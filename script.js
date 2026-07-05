let currentQuestion = 0;
let score = 0;
let answers = [];
let studentName = "";
let timeLeft = 20 * 60; // 20 minutes
let timer;

function startQuiz() {
    studentName = document.getElementById("studentName").value.trim();

    if (studentName === "") {
        alert("Please enter your name.");
        return;
    }

    document.getElementById("startScreen").style.display = "none";
    document.getElementById("quizBox").style.display = "block";

    loadQuestion();
    startTimer();
}

function startTimer() {
    timer = setInterval(function () {
        let min = Math.floor(timeLeft / 60);
        let sec = timeLeft % 60;

        document.getElementById("timer").innerHTML =
            `${min}:${sec < 10 ? "0" + sec : sec}`;

        if (timeLeft <= 0) {
            clearInterval(timer);
            submitQuiz();
        }

        timeLeft--;
    }, 1000);
}

function loadQuestion() {
    let q = questions[currentQuestion];

    document.getElementById("questionNo").innerHTML =
        `Question ${currentQuestion + 1} of ${questions.length}`;

    document.getElementById("question").innerHTML = q.question;

    let optionHTML = "";

    q.options.forEach((option, index) => {
        let checked = answers[currentQuestion] === index ? "selected" : "";

        optionHTML += `
            <button class="option ${checked}" onclick="selectOption(${index})">
                ${option}
            </button>
        `;
    });

    document.getElementById("options").innerHTML = optionHTML;
}

function selectOption(index) {
    answers[currentQuestion] = index;
    loadQuestion();
}

function nextQuestion() {
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        loadQuestion();
    }
}

function previousQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        loadQuestion();
    }
}

function submitQuiz() {

    clearInterval(timer);

    score = 0;

    for (let i = 0; i < questions.length; i++) {
        if (answers[i] === questions[i].answer) {
            score++;
        }
    }

    document.getElementById("quizBox").style.display = "none";
    document.getElementById("result").style.display = "block";

    document.getElementById("student").innerHTML =
        "Student : " + studentName;

    document.getElementById("score").innerHTML =
        "Score : " + score + " / " + questions.length;

    document.getElementById("percentage").innerHTML =
        "Percentage : " + ((score / questions.length) * 100).toFixed(2) + "%";
}