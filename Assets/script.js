// Quiz questions in arrays
const questions = [
  {
    questionText: "Commonly used data types DO NOT include:",
    options: ["Strings", "Booleans", "Alerts", "Numbers"],
    answer: "Alerts",
  },
  {
    questionText: "Arrays in JavaScript can be used to store ______.",
    options: [
      "Numbers and Strings",
      "Other Arrays",
      "Booleans",
      "All of the above",
    ],
    answer: "All of the above",
  },
  {
    questionText:
      "String values must be enclosed within _____ when being assigned to variables.",
    options: ["Commas", "Curly Brackets", "Quotes", "Parentheses"],
    answer: "Quotes",
  },
];


// Assigning variables
const startCard = document.querySelector("#start-card");
const questionCard = document.querySelector("#question-card");
const scoreCard = document.querySelector("#score-card");
const leaderboardCard = document.querySelector("#leaderboard-card");

// Hide cards
function hideCards() {
  startCard.setAttribute("hidden", true);
  questionCard.setAttribute("hidden", true);
  scoreCard.setAttribute("hidden", true);
  leaderboardCard.setAttribute("hidden", true);
}

const resultDiv = document.querySelector("#result-div");
const resultText = document.querySelector("#result-text");
//hide result div
function hideResultText() {
  resultDiv.style.display = "none";
}


var intervalID;
var time;
var currentQuestion;

document.querySelector("#start").addEventListener("click", startQuiz);

function startQuiz() {
  // Show only the question card and hide the rest
  hideCards();
  questionCard.removeAttribute("hidden");

// Display the question on the page when the button is 
  currentQuestion = 0;
  displayQuestion();

  // Set time
  time = questions.length * 10;

   // Display time
  intervalID = setInterval(countdown, 1000);

  
  displayTime();
}

function countdown() {
  time--;
  displayTime();
  if (time < 1) {
    endQuiz();
  }
}

//display time on page
const timeDisplay = document.querySelector("#time");
function displayTime() {
  timeDisplay.textContent = time;
}

// Display the question and answer options
function displayQuestion() {
  let question = questions[currentQuestion];
  let options = question.options;

  let h2QuestionElement = document.querySelector("#question-text");
  h2QuestionElement.textContent = question.questionText;

  for (let i = 0; i < options.length; i++) {
    let option = options[i];
    let optionButton = document.querySelector("#option" + i);
    optionButton.textContent = option;
  }
}

document.querySelector("#quiz-options").addEventListener("click", checkAnswer);

//Compare the text content of the option button with the answer to the current question
function optionIsCorrect(optionButton) {
  return optionButton.textContent === questions[currentQuestion].answer;
}

// Check if the selected answer is correct
function checkAnswer(eventObject) {
  let optionButton = eventObject.target;
  resultDiv.style.display = "block";
  if (optionIsCorrect(optionButton)) {
    resultText.textContent = "Correct!";
    setTimeout(hideResultText, 1000);
  } else {
    resultText.textContent = "Incorrect!";
    setTimeout(hideResultText, 1000);
    if (time >= 10) {
      time = time - 10;
      displayTime();
    } else {
      //if time is less than 10 then end quiz
      time = 0;
      displayTime();
      endQuiz();
    }
  }

  //increment current question by 1
  currentQuestion++;
  //display next question if there aren't any more then end quiz
  if (currentQuestion < questions.length) {
    displayQuestion();
  } else {
    endQuiz();
  }
}

//display scorecard and hide others
const score = document.querySelector("#score");

//clear the timer and display the scorecard 
function endQuiz() {
  clearInterval(intervalID);
  hideCards();
  scoreCard.removeAttribute("hidden");
  score.textContent = time;
}

const submitButton = document.querySelector("#submit-button");
const inputElement = document.querySelector("#initials");


submitButton.addEventListener("click", storeScore);

function storeScore(event) {
  //stop default
  event.preventDefault();


  //keep score and initals 
  let leaderboardItem = {
    initials: inputElement.value,
    score: time,
  };

  updateStoredLeaderboard(leaderboardItem);

  // display the leaderboardcard only
  hideCards();
  leaderboardCard.removeAttribute("hidden");

  renderLeaderboard();
}


function updateStoredLeaderboard(leaderboardItem) {
  let leaderboardArray = getLeaderboard();

  leaderboardArray.push(leaderboardItem);
  localStorage.setItem("leaderboardArray", JSON.stringify(leaderboardArray));
}


function getLeaderboard() {
  let storedLeaderboard = localStorage.getItem("leaderboardArray");
  if (storedLeaderboard !== null) {
    let leaderboardArray = JSON.parse(storedLeaderboard);
    return leaderboardArray;
  } else {
    leaderboardArray = [];
  }
  return leaderboardArray;
}


function renderLeaderboard() {
  let sortedLeaderboardArray = sortLeaderboard();
  const highscoreList = document.querySelector("#highscore-list");
  highscoreList.innerHTML = "";
  for (let i = 0; i < sortedLeaderboardArray.length; i++) {
    let leaderboardEntry = sortedLeaderboardArray[i];
    let newListItem = document.createElement("li");
    newListItem.textContent =
      leaderboardEntry.initials + " - " + leaderboardEntry.score;
    highscoreList.append(newListItem);
  }
}


function sortLeaderboard() {
  let leaderboardArray = getLeaderboard();
  if (!leaderboardArray) {
    return;
  }

  leaderboardArray.sort(function (a, b) {
    return b.score - a.score;
  });
  return leaderboardArray;
}

const backButton = document.querySelector("#back");
backButton.addEventListener("click", returnToStart);

//Hide leaderboard card show start card
function returnToStart() {
  hideCards();
  startCard.removeAttribute("hidden");
}

//use link to view highscores 
const Link = document.querySelector("#link");
Link.addEventListener("click", showLeaderboard);

function showLeaderboard() {
  hideCards();
  leaderboardCard.removeAttribute("hidden");

  //stop countdown
  clearInterval(intervalID);

  //assign undefined to time and display 
  time = undefined;
  displayTime();

 
  renderLeaderboard();
}