
let currentIndex = 0;
let selected = [];
let shuffled = [];
let countdown;
let delayedPool = [];
let delayedCounter = 0;

function shuffle(array) {
  return array.map(v => ({ v, sort: Math.random() }))
              .sort((a, b) => a.sort - b.sort)
              .map(({ v }) => v);
}

function startQuiz() {
  shuffled = shuffle(questions);
  currentIndex = 0;
  delayedPool = [];
  delayedCounter = 0;
  renderQuestion();
}

function renderQuestion() {
  if (currentIndex >= shuffled.length) {
    document.getElementById("quiz-container").innerHTML = "<h2>Квіз завершено!</h2>";
    return;
  }

  // вставити відкладене питання через 2
  if (delayedPool.length > 0 && delayedCounter >= 2) {
    shuffled.splice(currentIndex + 1, 0, delayedPool.shift());
    delayedCounter = 0;
  }

  const q = shuffled[currentIndex];
  selected = [];

  const container = document.getElementById("quiz-container");
  container.innerHTML = `
    <div class="question-box">
      ${q.image ? `<img src="${q.image}" alt="Фото питання" style="max-width:100%; margin-bottom:10px;" />` : ""}
      <div class="timer" id="timer">10</div>
      <h3>Питання ${currentIndex + 1} із ${shuffled.length}: ${q.text}</h3>
      <div class="options">
        ${q.options.map((opt, i) =>
          `<button onclick="selectOption(this, ${i})">${opt}</button>`
        ).join("")}
      </div>
      <button onclick="checkAnswer()">Перевірити</button>
    </div>
  `;

  startTimer();
}

function selectOption(btn, index) {
  index = Number(index);
  btn.classList.toggle("selected");
  if (selected.includes(index)) {
    selected = selected.filter(i => i !== index);
  } else {
    selected.push(index);
  }
}

function checkAnswer() {
  const q = shuffled[currentIndex];
  const buttons = document.querySelectorAll(".options button");

  // очистити класи
  buttons.forEach(btn => btn.classList.remove("selected"));

  // підсвітити
  buttons.forEach((btn, i) => {
    if (q.correct.includes(i)) {
      btn.classList.add("correct");
    } else if (selected.includes(i)) {
      btn.classList.add("incorrect");
    }
  });

  const isCorrect = arraysEqual(selected.sort(), q.correct.sort());

  if (!isCorrect) {
    delayedPool.push(q); // додати до пулу відкладених
  }

  clearInterval(countdown);

  setTimeout(() => {
    currentIndex++;
    delayedCounter++;
    renderQuestion();
  }, 1500);
}

function arraysEqual(a, b) {
  return a.length === b.length && a.every((val, i) => val === b[i]);
}

function startTimer() {
  let time = 10;
  document.getElementById("timer").innerText = time;
  clearInterval(countdown);
  countdown = setInterval(() => {
    time--;
    document.getElementById("timer").innerText = time;
    if (time <= 0) {
      clearInterval(countdown);
      checkAnswer();
    }
  }, 1000);
}

window.onload = startQuiz;
