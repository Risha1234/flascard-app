const cardText = document.getElementById("card-text");
const nextBtn = document.getElementById("next-btn");
const flashCard = document.getElementById("flashcard");
const addFlashCard = document.getElementById("add-flashcard");
const submitBtn= document.getElementById("submit");
const inputQ = document.getElementById("add-flashcard-q");
const inputA = document.getElementById("add-flashcard-a");

let flashcards = [];
let currentCard = 0;
let showingAnswer = false;


const loadFlashcards = async () => {
  try {
    const res = await fetch("flashcards.json");
    if (!res.ok) throw new Error("Failed to load flashcards");

    flashcards = await res.json();
    showCard();
  } catch (error) {
    cardText.textContent = `⚠️ Error: ${error.message}`;
  }
};


const showCard = () => {
  if (!flashcards.length) return;

  const { question } = flashcards[currentCard]; 
  cardText.textContent = `❓ ${question}`; 
  showingAnswer = false;
};


const toggleCard = () => {
  const { question, answer } = flashcards[currentCard]; 
  cardText.textContent = showingAnswer
    ? `❓ ${question}`
    : `💡 ${answer}`; 
  showingAnswer = !showingAnswer;
};


const nextCard = () => {
  currentCard++;
  if(currentCard>=flashcards.length)
  {
    currentCard=0;
  }
  showCard();
};

const addflashcard = () => {
  const question = inputQ.value.trim();
  const answer = inputA.value.trim();

  if (question && answer) {
    flashcards.push({ question, answer });
    inputQ.value = "";
    inputA.value = "";
    currentCard = flashcards.length - 1;
    showCard();
  } else {
    alert("Please enter both a question and an answer.");
  }
};

flashCard.addEventListener("click", toggleCard);
nextBtn.addEventListener("click",  nextCard);
submitBtn.addEventListener("click",addflashcard);

const testModeBtn = document.getElementById("test-mode-btn");
const testSection = document.getElementById("test-section");
const testQuestion = document.getElementById("test-question");
const userAnswer = document.getElementById("user-answer");
const checkAnswerBtn = document.getElementById("check-answer-btn");
const feedback = document.getElementById("feedback");
const scoreDisplay = document.getElementById("score-display");
const nextQuestionBtn = document.getElementById("next-question-btn");

let testCardIndex = 0;
let score = 0;
let attempted = 0;

testModeBtn.addEventListener("click", () => {
  if (!flashcards.length) {
    alert("No flashcards to test.");
    return;
  }
  testCardIndex = 0;
  score = 0;
  attempted = 0;

  testSection.style.display = "block";
  userAnswer.style.display = "inline";
  checkAnswerBtn.style.display = "inline";
  nextQuestionBtn.style.display = "none";
  feedback.textContent = "";
  scoreDisplay.textContent = "Score: 0/0";

  showTestQuestion();
});

const showTestQuestion = () => {
  const current = flashcards[testCardIndex];
  testQuestion.textContent = `❓ ${current.question}`;
  userAnswer.value = "";
  feedback.textContent = "";
  userAnswer.disabled = false;
  checkAnswerBtn.disabled = false;
  nextQuestionBtn.style.display = "none";
};

checkAnswerBtn.addEventListener("click", () => {
  const userInput = userAnswer.value.trim().toLowerCase();
  const correctAnswer = flashcards[testCardIndex].answer.trim().toLowerCase();

  attempted++;
  if (userInput === correctAnswer) {
    feedback.textContent = "Correct!";
    score++;
  } else {
    feedback.textContent = `Incorrect. Correct answer is: ${flashcards[testCardIndex].answer}`;
    }

  scoreDisplay.textContent = `Score: ${score}/${attempted}`;
  checkAnswerBtn.disabled = true;
  userAnswer.disabled = true;
  nextQuestionBtn.style.display = "inline";
});

nextQuestionBtn.addEventListener("click", () => {
  testCardIndex++;

  if (testCardIndex >= flashcards.length) {
    testQuestion.textContent = "Test complete!";
    userAnswer.style.display = "none";
    checkAnswerBtn.style.display = "none";
    nextQuestionBtn.style.display = "none";
    feedback.textContent = `Final Score: ${score}/${attempted}`;
    return;
  }

  showTestQuestion();
});

loadFlashcards();