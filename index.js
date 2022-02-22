/* ---------------------- Boiler Plate --------------------- */
const readline = require("readline");
const rl = readline.createInterface(process.stdin, process.stdout);

function ask(questionText) {
  return new Promise((resolve, reject) => {
    rl.question(questionText, resolve);
  });
}

/* --------------------- Game choice function ------------------ */

whichGame();

//Function for user to choose which game to play
async function whichGame() {
  console.log("\nLet's play a number guessing game!");
  //Computer asks which game human would like to play.
  let gameChoice = await ask(
    "Type 'h' if you (human) want to choose a number, \nor 'c' if you want me (computer) to choose a number. "
  );
  //If human chooses "h", go to humanChooses function.
  //If humam chooses "c", go to compChooses function.
  if (gameChoice === "h") {
    //Computer repeats human's response.
    console.log("\nYou chose human! ");
    humanChooses();
  } else if (gameChoice === "c") {
    //Computer repeats human's response.
    console.log("\nYou chose computer! ");
    compChooses();
  } else {
    console.log("\nI don't know how to " + gameChoice + ". Try again. ");
    whichGame();
  }
}

/* ------------------ THE HUMAN CHOOSES NUMBER GAME --------------- */

//Function for computer guesses game
async function humanChooses() {
  //Setting the min and max
  let min = 1;
  let max;
  console.log(
    "Let's play a game where you (human) think of a number, and I (computer) try to guess it."
  );
  //Computer asks human to choose the max number for range.
  max = await ask(
    "First, pick a number greater than 1 to be your maximum range. "
  );
  if (max <= 1) {
    console.log("\nYou must choose a number that is greater than 1. ");
    humanChooses()
  } 
  //Turn max into an integer.
  max = parseInt(max);
  //Computer asks human to choose a secret number.
  let secretNumber = await ask(
    "Now, choose a number between " +
      min +
      " and " +
      max +
      "." +
      " \nWhat is your secret number? \nI won't peek, I promise...\n"
  );
  //Function for computer to make a smarter guess.
  function smartGuess(min, max) {
    return Math.floor((min + max) / 2);
  }
  //If human chooses secret number outside of range, computer prompts human to choose again.
  while (secretNumber > max || secretNumber < min) {
    secretNumber = await ask("Please choose a number within the range. ");
  }
  //Computer repeats human's secret number.
  console.log("You entered: " + secretNumber);
  //Name computer's guess.
  let compGuess = smartGuess(min, max);
  //Computer makes a smart guess.
  let answer = await ask("Is your number " + compGuess + "? ");
  //Setting the amount of times computer has guessed so far to 0.
  let guessCount = 0;
  //If computer guesses correctly on the first try, it rejoices and starts program over.
  //Otherwise, it enters 'while' loop below.
  if (answer === "y" || answer === "yes") {
    console.log("Woohoo! I guessed it on the first try!! ");
    startAgain();
  } else {
    while (answer !== "y" || answer !== "yes") {
      //Counting how many times it takes computer to guess.
      guessCount = guessCount + 1;
      //If computer guesses incorrectly, it asks if the number is higher or lower.
      if (answer === "y" || answer === "yes") {
        //If computer finally guesses correctly, it celbrates and starts program over.
        console.log(
          "Yay! I finally guessed it! \nIt took me " +
            guessCount +
            " tries to guess your number. "
        );
        startAgain();
      }
      //Defining highLow as this question.
      let highLow = await ask("Is it higher or lower? (h/l) ");
      //If human lies, computer catches human.
      if (compGuess - 1 < min && highLow === "l") {
        console.log(
          "Your number is higher than " +
            (compGuess - 1) +
            ", so it can't also be lower than " +
            compGuess +
            "! "
        );
      } else if (compGuess + 1 > max && highLow === "h") {
        console.log(
          "Your number is lower than " +
            (compGuess + 1) +
            ", so it can't also be higher than " +
            compGuess +
            "! "
        );
      } else if (highLow === "h") {
        min = compGuess + 1;
        //If guess is too high, comuter guesses lower.
        compGuess = smartGuess(min, max);
      } else if (highLow === "l") {
        max = compGuess - 1;
        //If guess is too low, computer guesses higher.
        compGuess = smartGuess(min, max);
      }
      //Question always asked based on "higher" or "lower" response.
      answer = await ask("Is your number " + compGuess + "? ");
    }
  }
}
//Callback function to start game over if human says yes.
async function startAgain() {
  let playAgain = await ask("Do you want to play again? ");
  if (playAgain === "y" || playAgain === "yes") {
    humanChooses();
  } else {
    process.exit();
  }
}

/* ------------------- THE COMPUTER CHOOSES NUMBER GAME ---------------- */

//Function for user guessing game
async function compChooses() {
  //Setting the min and max
  let minimum = 1;
  let maximum;
  console.log(
    "Let's play a game where I (computer) think of a number and you (human) guess it."
  );
  //Computer asks human to choose a maximum.
  maximum = await ask(
    "First, pick a number greater than 1 to be my maximum range. "
  );
  if (maximum <= 1) {
    console.log("\nYou must choose a number that is greater than 1. ");
    compChooses()
  } 
  //Turns max into integer.
  maximum = parseInt(maximum);
  //Computer chooses a number between the minimum and maximum.
  let compNumber = Math.floor(Math.random() * maximum);
  //Computer asks human to guess a number.
  let humanGuess = await ask(
    "Okay, hmmm, let me think of a number between " +
      minimum +
      " and " +
      maximum +
      "... " +
      "\n... " +
      "\n\nOkay, I picked one... " +
      "\nWhat is your guess? "
  );
  //Name the human guess.
  humanGuess = parseInt(humanGuess);
  //Computer repeats user's guess.
  console.log("You guessed " + humanGuess + ". ");
  //If human guesses correctly on first try, computer returns this message.
  //Otherwise, computer goes into the 'while' loop below.
  if (humanGuess === compNumber) {
    console.log("Wow, you guessed it on the FIRST TRY! You're amazing. ");
  } else {
    while (humanGuess !== compNumber) {
      //If the guess is outside of the range, computer returns this message.
      if (humanGuess > maximum || humanGuess < minimum) {
        humanGuess = await ask(
          "Your guess is outside of the range, please pick a guess between " +
            minimum +
            " and " +
            maximum +
            ". "
        );
      } else if (humanGuess < compNumber) {
        //If human guess is too low.
        humanGuess = await ask("Noooo, your guess is too low. Guess again! ");
      } else if (humanGuess > compNumber) {
        //If human guess is too high.
        humanGuess = await ask("Nope! Your number is too high. Guess again! ");
      } else {
        //When human finally guesses correctly...
        console.log("Congratulations! You guessed it correctly! ");
        //Exit the program.
        process.exit();
      }
    }
  }
  //Exit the program.
  process.exit();
}
