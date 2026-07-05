let currentQuestion = 0;
let score = 0;
let answers = [];
let studentName = "";
let timeLeft = 20 * 60; // 20 minutes
let timer;

// Results Save
let allResults = JSON.parse(localStorage.getItem("allResults")) || [];

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

        let checked =
            answers[currentQuestion] === index ? "selected" : "";

        optionHTML += `
            <button class="option ${checked}"
                onclick="selectOption(${index})">
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

    // Result Save
    let resultData = {
        name: studentName,
        score: score,
        total: questions.length,
        percentage: ((score / questions.length) * 100).toFixed(2),
        date: new Date().toLocaleString()
    };

    allResults.push(resultData);

    localStorage.setItem(
        "allResults",
        JSON.stringify(allResults)
    );

    document.getElementById("quizBox").style.display = "none";
    document.getElementById("result").style.display = "block";

    document.getElementById("student").innerHTML =
        "Student : " + studentName;

    document.getElementById("score").innerHTML =
        "Score : " + score + " / " + questions.length;

    document.getElementById("percentage").innerHTML =
        "Percentage : " +
        ((score / questions.length) * 100).toFixed(2) + "%";
}

function downloadAllResults() {

    let allResults =
        JSON.parse(localStorage.getItem("allResults")) || [];

    if (allResults.length === 0) {
        alert("Koi result available nahi hai");
        return;
    }

    let csv =
        "Name,Score,Total,Percentage,Date\n";

    allResults.forEach(r => {
        csv += `${r.name},${r.score},${r.total},${r.percentage}%,${r.date}\n`;
    });

    const blob = new Blob([csv], {
        type: "text/csv"
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "class5_quiz_results.csv";
    a.click();

    URL.revokeObjectURL(url);
}

// Optional: Clear All Results
function clearResults() {

    if (confirm("Kya aap sabhi results delete karna chahte hain?")) {

        localStorage.removeItem("allResults");

        allResults = [];

        alert("All results deleted successfully.");
    }
}
