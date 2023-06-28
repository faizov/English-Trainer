// Import the GameLogic module
import GameLogic from "./GameLogic";

// Get the necessary DOM elements
const answerElement = document.getElementById("answer");
const lettersElement = document.getElementById("letters");
const currentQuestionElement = document.getElementById("current_question");
const totalQuestionsElement = document.getElementById("total_questions");

// Create an instance of the GameLogic class
const gameLogic = new GameLogic();

// Function to shuffle the letters of a word
function shuffleLetters(word: string) {
  return word.split("").sort(() => Math.random() - 0.5);
}

// Function to display the shuffled letters
function displayLetters(letters: string[]) {
  lettersElement.textContent = "";

  for (let i = 0; i < letters.length; i++) {
    const letter = document.createElement("button");
    letter.classList.add("btn");
    letter.textContent = letters[i];
    lettersElement.appendChild(letter);
  }
}

// Function to render the question
function renderQuestion(word: string) {
  if (!word) {
    return;
  }

  const letters = shuffleLetters(word);

  if (answerElement) {
    answerElement.textContent = "";
  }

  displayLetters(letters);

  currentQuestionElement.textContent = gameLogic.getCurrentRound().toString();
  totalQuestionsElement.textContent = gameLogic.getTotalRounds().toString();

  gameLogic.resetErrorCount();
}

// Variable to store the clicked button
let clickedButton: HTMLButtonElement | null = null;

// Function to handle the click event on a letter button
function handleLetter(selectedLetter: string, answerElement: HTMLElement) {
  const letterButtons = lettersElement?.querySelectorAll("button");
  if (!letterButtons) {
    return;
  }

  let isLetterSelected = false;
  letterButtons.forEach((button) => {
    if (!isLetterSelected && button.textContent === selectedLetter) {
      const isCorrect = gameLogic.checkSelectedLetter(
        selectedLetter,
        answerElement
      );
      if (isCorrect) {
        if (clickedButton) {
          clickedButton.parentNode.removeChild(clickedButton);
        }

        const button = document.createElement("button");
        button.textContent = selectedLetter;
        answerElement.appendChild(button);
        button.classList.add("btn");
        button.classList.add("btn-success");
      } else {
        gameLogic.increaseErrorCount();

        if (clickedButton) {
          clickedButton.classList.add("btn-danger");
          setTimeout(() => {
            clickedButton.classList.remove("btn-danger");
          }, 1000);
        }
      }
      isLetterSelected = true;
    }
  });
}

// Function to handle the click event on the letters container
function handleLettersClick(event: MouseEvent, answerElement: HTMLElement) {
  clickedButton = event.target as HTMLButtonElement;
  const selectedLetter = clickedButton.textContent;
  if (!selectedLetter) {
    return;
  }

  handleLetter(selectedLetter, answerElement);
}

// Function to handle key press events
function handleKeyPress(event: KeyboardEvent) {
  const selectedKey = event.key.toLowerCase();

  // Check if the selected key is a letter
  if (/^[a-z]$/.test(selectedKey)) {
    const letterButtons = lettersElement?.querySelectorAll("button");
    if (!letterButtons) {
      return;
    }

    let isLetterSelected = false;

    letterButtons.forEach((button) => {
      if (!isLetterSelected && button.textContent === selectedKey) {
        clickedButton = button;
        handleLetter(selectedKey, answerElement);
        isLetterSelected = true;
      }
    });

    if (!isLetterSelected) {
      gameLogic.increaseErrorCount();
    }
  }
}

// Function to check the answer
function checkAnswer() {
  if (answerElement.textContent === gameLogic.getCurrentWord()) {
    gameLogic.moveToNextWord();

    if (gameLogic.getErrorCount() < 3) {
      console.log("decreaseSuccessfulWordsCount");
      gameLogic.decreaseSuccessfulWordsCount();
    }

    if (gameLogic.getCurrentRound() > gameLogic.getTotalRounds()) {
      const statistics = gameLogic.getStatistics();

      const statisticsElement = document.getElementById("statistics");

      if (statisticsElement) {
        statisticsElement.style.display = "block";
      }

      const successfulWordsElement =
        document.getElementById("successful_words");
      const errorWordsElement = document.getElementById("error_words");
      const wordWithMaxErrorsElement = document.getElementById(
        "word_with_max_errors"
      );

      if (successfulWordsElement) {
        successfulWordsElement.textContent =
          "Successful Words: " + statistics.successfulWords;
      }

      if (errorWordsElement) {
        errorWordsElement.textContent = "Error Words: " + statistics.errorWords;
      }

      if (wordWithMaxErrorsElement) {
        wordWithMaxErrorsElement.textContent =
          "Word with Max Errors: " + statistics.wordWithMaxErrors;
      }
    } else {
      const currentWord = gameLogic.getCurrentWord();
      renderQuestion(currentWord);
    }
  }
}

// Function to check for errors
function checkErrors() {
  const countErrors = gameLogic.getErrorCount();

  if (countErrors === 3) {
    answerElement.innerHTML = "";
    lettersElement.innerHTML = "";
    const currentWord = gameLogic.getCurrentWord();
    let arrCurrentWord = currentWord.split("");

    arrCurrentWord.forEach((element) => {
      const button = document.createElement("button");
      button.textContent = element;
      answerElement.appendChild(button);
      button.classList.add("btn");
      button.classList.add("btn-danger");
    });

    gameLogic.moveToNextWord();

    setTimeout(() => renderQuestion(gameLogic.getCurrentWord()), 2000);
  }
}

// Event listener when the window loads
window.addEventListener("load", () => {
  const currentWord = gameLogic.getCurrentWord();
  renderQuestion(currentWord);

  // Event listener for clicks on letter buttons
  lettersElement.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    if (target.tagName === "BUTTON") {
      handleLettersClick(event, answerElement);
      checkErrors();
      checkAnswer();
    }
  });

  // Event listener for key presses
  document.addEventListener("keydown", (event) => {
    handleKeyPress(event);
    checkErrors();
    checkAnswer();
  });
});
