let navySupported = false;
let navyStage = 0;
let currentClueIndex = 0;
let resetRequested = false;
let stage = 0;
let userName = ""; // Variable to store the user's name
let timerInterval;
let elapsedMinutes = 0;
let isPaused = false;
 






const clues = [{
    clue: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind.",
    hint: "It's related to sound.",
    hint2: "Think about something you hear but cannot see.",
    answer: "echo",
    mistakenAnswer: "whistle",
    mistakenAnswerResponse: "close",
    explanation: "An echo is a reflection of sound that arrives at the listener after a delay.",
    afterClueMessage: "test message",
    afterAnswerMessage: "Echoes are fascinating, aren't they? Sound bouncing back to you.",
    hintsRequested: 0,
    delayAfterClue: 2000, // Delay in milliseconds
    delayAfterAnswer: 2000
  },
  {
    clue: "I am not alive, but I grow; I don't have lungs, but I need air; I don't have a mouth, but water kills me.",
    hint: "It's something you would avoid when camping.",
    hint2: "It's something that can cause serious damage but also provide warmth.",
    answer: "fire",
    mistakenAnswer: "plant",
    mistakenAnswerResponse: "close",
    explanation: "Fire needs oxygen to burn and is extinguished by water.",
    afterClueMessage: "Stay safe and think of something dangerous yet useful.",
    afterAnswerMessage: "Fire can be both a friend and a foe in the wilderness.",
    hintsRequested: 0,
    delayAfterClue: 3000, // Delay in milliseconds
    delayAfterAnswer: 2000
  },
  {
    clue: "I have cities, but no houses; forests, but no trees; and rivers, but no water.",
    hint: "You can hold me in your hand.",
    hint2: "It's a tool that helps people navigate the world.",
    answer: "atlas",
    mistakenAnswer: "globe",
    mistakenAnswerResponse: "close",
    explanation: "A map represents geographical features like cities, forests, and rivers.",
    afterClueMessage: "Think of something flat and informative.",
    afterAnswerMessage: "Maps are essential for explorers and adventurers.",
    hintsRequested: 0,
    delayAfterClue: 2500, // Delay in milliseconds
    delayAfterAnswer: 2000
  }
];

function loadChatbotState() {
    const savedChatLog = localStorage.getItem('chatLog');
    const savedStage = localStorage.getItem('stage');
    const savedNavyStage = localStorage.getItem('navyStage');
    const savedUserName = localStorage.getItem('userName');
    const savedClueIndex = localStorage.getItem('currentClueIndex');
    const savedNavySupported = localStorage.getItem('navySupported');
    const savedElapsedMinutes = localStorage.getItem('elapsedMinutes');

    const chatLog = document.getElementById('chatLog');  // Use chatLog instead of mainChat

    if (savedChatLog) {
        // Restore the saved chat log content inside the #chatLog container
        chatLog.innerHTML = savedChatLog;

        // Hide the initial container since the chat has started
        document.getElementById("initialContainer").style.display = "none";
    } else {
        // No saved chat log, show the initial container
        document.getElementById("initialContainer").style.display = "block";
        userInput.disabled = true;
        sendBtn.disabled = true;
    }

    if (savedStage) {
        stage = parseInt(savedStage, 10);
    }

    if (savedNavyStage) {
        navyStage = parseInt(savedNavyStage, 10);
    }

    if (savedUserName) {
        userName = savedUserName;  // Fixed: userName is likely a string, not an integer
    }

    if (savedClueIndex) {
        currentClueIndex = parseInt(savedClueIndex, 10);
    }

    if (savedNavySupported) {
        navySupported = (savedNavySupported === 'true');
    }

    if (savedElapsedMinutes) {
        elapsedMinutes = parseInt(savedElapsedMinutes, 10);
    }
}

// Call `loadChatbotState()` immediately as the script runs
loadChatbotState();



document.addEventListener("DOMContentLoaded", () => {
    // Get references to DOM elements
    const chatOutput = document.getElementById("mainChat");
    const userInput = document.getElementById("userInput");
    const sendBtn = document.getElementById("sendBtn");
    const startBtn = document.getElementById("start-btn");
    const startMapBtn = document.getElementById("startmap-btn");
   

    // Default personality
    let currentPersonality = "pirate"; 



function saveChatbotState() {
    localStorage.setItem('chatLog', document.getElementById('chatLog').innerHTML);
    localStorage.setItem('stage', stage);
    localStorage.setItem('navyStage', navyStage);
    localStorage.setItem('currentClueIndex', currentClueIndex);
    localStorage.setItem('userName', userName);
    localStorage.setItem('navySupported', navySupported);
    localStorage.setItem('elapsedMinutes', elapsedMinutes);
}


function saveStateAndLog() {
    saveChatbotState();
    // Save any other state variables if needed
}

// Call `saveStateAndLog()` after every significant change






  let inactivityTimer;
  const inactivityLimit = 60000; // 1 minute in milliseconds

  function startInactivityTimer() {
    // Start the timer only if the stage is 1 or 2
    if (stage === 1) {
      // Clear any existing timer to prevent multiple intervals
      clearTimeout(inactivityTimer);

      // Set a new timer for inactivity check
      inactivityTimer = setTimeout(() => {
        sendInactivityMessage();
      }, inactivityLimit);
    } else {
      // Do not start the timer if the stage is not 1 or 2
      return;
    }
  }

  function sendInactivityMessage() {
    // Check the value of navySupported and send appropriate message
    if (navySupported) {
      switchPersonality("navy");
      displayMessageWithPersonality("Where are you? We've got treasure to find. Type 'hint' for a hint from that pesky pirate.");
      switchPersonality("pirate");
    } else {
      switchPersonality("pirate");
      displayMessageWithPersonality("Arrr, where have you gone? We've got treasure to plunder. Type 'hint' if you need help!");
    }
  }

  // Attach event listeners to user input fields
  document.getElementById('userInput').addEventListener('input', startInactivityTimer);

  // Initialize the inactivity timer when the page loads
  window.addEventListener('load', () => {
    if (timerInterval) { // Ensure the timer is running
      startInactivityTimer();
    }
  });



  function displayMessageWithPersonality(message) {
    displayMessage(message, currentPersonality);
  }

  function switchPersonality(personality) {
    currentPersonality = personality;
  }

  function loadTimer() {
    const savedStartTime = localStorage.getItem('startTime');
    const savedElapsedMinutes = localStorage.getItem('elapsedMinutes');
    const savedIsPaused = localStorage.getItem('isPaused');

    if (savedStartTime) {
      const currentTime = new Date().getTime();
      const startTime = parseInt(savedStartTime);
      const timeDifferenceInMinutes = Math.floor((currentTime - startTime) / 60000);

      elapsedMinutes = timeDifferenceInMinutes + (parseInt(savedElapsedMinutes) || 0);
    }

    if (savedIsPaused === 'true') {
      isPaused = true;
    } else {
      startTimer(); // Resume the timer if it was running
    }
  }

  function startTimer() {
    if (!isPaused) {
      // Save the start time in localStorage
      localStorage.setItem('startTime', new Date().getTime().toString());
      timerInterval = setInterval(() => {
        elapsedMinutes += 1; // Increment time in minutes
        localStorage.setItem('elapsedMinutes', elapsedMinutes.toString()); // Save elapsed time
      }, 60000); // Run every 1 minute (60000ms)
    } else {
      isPaused = false; // Resume the timer if it was paused
    }
    localStorage.setItem('isPaused', 'false'); // Update pause status in localStorage
  }

  function pauseTimer() {
    clearInterval(timerInterval); // Stop the timer
    isPaused = true; // Set the paused flag to true
    localStorage.setItem('isPaused', 'true'); // Save pause status
  }

  function stopTimer() {
    clearInterval(timerInterval); // Stop the timer
    localStorage.removeItem('startTime'); // Remove start time from localStorage
    localStorage.removeItem('elapsedMinutes'); // Remove elapsed time from localStorage
    localStorage.removeItem('isPaused'); // Remove pause status
  }




  function displayMessage(message, sender = currentPersonality) {
    const messageElement = document.createElement("div");
    messageElement.className = `message ${sender}-message`;

    const thumbnailElement = document.createElement("div");
    thumbnailElement.className = "thumbnail";

    const messageContentElement = document.createElement("div");
    messageContentElement.className = "message-content";

    const senderNameElement = document.createElement("div");
    senderNameElement.className = "sender-name";

    // Set the sender name based on the sender
    if (sender === "pirate") {
      senderNameElement.textContent = "Pirate Bot";
    } else if (sender === "navy") {
      senderNameElement.textContent = "Navy Bot";
    } else {
      senderNameElement.textContent = userName || "You";
    }

    const textElement = document.createElement("div");
    textElement.className = "text";
    textElement.textContent = message;

    // Group sender name and text together
    messageContentElement.appendChild(senderNameElement);
    messageContentElement.appendChild(textElement);

    // Add the thumbnail and the grouped message content to the message element
    messageElement.appendChild(thumbnailElement);
    messageElement.appendChild(messageContentElement);

    // Append the message element to the chat log
    chatLog.appendChild(messageElement);
    chatLog.scrollTop = chatLog.scrollHeight;
  }

  function askForName() {
    displayMessage("Ahoy! What's your name, matey?");
    stage = 0.5; // Set a special stage for name input
    saveStateAndLog();

  }





  function readyMessage() {
    displayMessage("Are you ready for the clue? If so say aye!");
    stage = 1;
  }

  function giveClue() {
    const currentClue = clues[currentClueIndex];
    displayMessage(`Here is your clue: ${currentClue.clue}`);
    startTimer
    stage = 2;

    setTimeout(() => {
      displayMessage(currentClue.afterClueMessage);
    }, currentClue.delayAfterClue);
    	saveStateAndLog();
  }

  let incorrectAttempts = 0; // Initialize a variable to track incorrect attempts

  function checkAnswer(input) {
    const currentClue = clues[currentClueIndex];
    const correctResponses = [
      "Arrr! Ye got it right!",
      "Aye aye, that be the answer!",
      "Shiver me timbers, ye nailed it!",
      "Yo ho ho! Ye be correct!",
      "Ye got the big brain of a pirate! That be correct!"
    ];

    const incorrectResponses = [
      "Try again, ye scallywag!",
      "Close, but no treasure this time!",
      "Aye, that be a fine try, but not quite right!",
      "Nay, that be not the answer. Give it another go!"
    ];

    if (input.toLowerCase().includes(currentClue.answer.toLowerCase())) {
      const randomResponse = correctResponses[Math.floor(Math.random() * correctResponses.length)];
      displayMessage(randomResponse);
      clueMessages();
      pauseTimer
      saveStateAndLog();
      incorrectAttempts = 0; // Reset incorrect attempts on correct answer
    } else if (input.toLowerCase().includes("hint")) {
      giveHint();
    } else {
      // Check if the input matches the mistakenAnswer for the current clue
      if (currentClue.mistakenAnswer && input.toLowerCase().includes(currentClue.mistakenAnswer.toLowerCase())) {
        displayMessage(currentClue.mistakenAnswerResponse);
        displayMessage("Remember to type 'hint' if you need more information.");
      } else {
        const randomIncorrectResponse = incorrectResponses[Math.floor(Math.random() * incorrectResponses.length)];
        displayMessage(randomIncorrectResponse);

        // Display a reminder message on the first and third incorrect attempts
        if (incorrectAttempts === 0 || incorrectAttempts === 3) {
          displayMessage("Remember to type 'hint' if you need more information.");
        }
      }

      incorrectAttempts++; // Increment incorrect attempts
      saveStateAndLog();
    }
  }



  function clueMessages() {
    const currentClue = clues[currentClueIndex];
    displayMessage(currentClue.explanation);

    setTimeout(() => {
      displayMessage(currentClue.afterAnswerMessage);
    }, currentClue.delayAfterAnswer);

    currentClueIndex++;

    if (currentClueIndex < clues.length) {
      stage = 0; // reset stage to readyMessage
      setTimeout(readyMessage, 6000); // Adjusted to 1000ms as this seems to be the intended delay.
    } else {
      setTimeout(() => {
        congratulations();
        stage = 3;
      }, 6000); // 6-second delay before displaying the final message.
      stage = 0; // reset stage if needed to replay
    }
  }



  function congratulations() {
    // Final time in minutes
    const finalTime = `${elapsedMinutes} minute${elapsedMinutes !== 1 ? 's' : ''}`;

    let message;

    if (navySupported) {
      switchPersonality("navy"); // Set the current personality to the Navy
      message = `Congratulations, you found the treasure, ${userName}! As a true member of the Queen's Navy, you have proven your loyalty and wit! Your final time was ${finalTime}.`;
      displayMessageWithPersonality(message);
      switchPersonality("pirate");
      message = `Scupper me kippers you betrayed me to the Navy!`;
      displayMessageWithPersonality(message);
    } else {
      switchPersonality("pirate"); // Set the current personality to the Pirate
      message = `Ahoy, ${userName}! Ye found the treasure! Ye've got the cunning of a true pirate, and the spoils are yours! Yarrr! Your final time was ${finalTime}.`;
      displayMessageWithPersonality(message);
      switchPersonality("navy"); // Set the current personality to the Navy
      message = `Curses be upon you, ${userName}! The Navy shall never forgive you for this!`;
      displayMessageWithPersonality(message);
    }

    // Stop the timer permanently
    stopTimer();
    saveStateAndLog();
  }



  function giveHint() {
    const currentClue = clues[currentClueIndex];

    if (currentClue.hintsRequested === 0) {
      displayMessage("Here's your hint:");
      displayMessage(currentClue.hint);
      currentClue.hintsRequested++;
    } else if (currentClue.hintsRequested === 1) {
      displayMessage("Last hint:");
      displayMessage(currentClue.hint2);
      currentClue.hintsRequested++;
    } else {
      displayMessage("Sorry, no more hints.");
    }
  }



  function greetUser() {
    displayMessage(`Welcome aboard, ${userName}!`);
    setTimeout(readyMessage, 1000); // Proceed to readyMessage after greeting
  }

  function navyMessage() {
    // Check the conditions: currentClueIndex > 1 OR (currentClueIndex == 1 AND stage >= 2)
    if (currentClueIndex === 1 && stage >= 2) {
      setTimeout(() => {
        switchPersonality("navy"); // Switch to Navy personality
        displayMessageWithPersonality("Attention! This is the Navy captain speaking. I trust you're ready to cooperate with honor.");

        navyStage = 1;
        switchPersonality("pirate"); // Switch back to Pirate personality after the Navy message is sent
      }, 3000); // Wait for 3 seconds before sending the message
    }
    saveStateAndLog();
  }

  function navyMessage2() {
    // Check the conditions: currentClueIndex === 2 AND stage >= 2
    if (currentClueIndex === 2 && stage >= 2) {

      // Check if the navy is supported
      if (navySupported === true) {
        setTimeout(() => {
          switchPersonality("navy"); // Switch to Navy personality
          displayMessageWithPersonality("You're clever, you supported the navy.");
        }, 3000); // Wait for 3 seconds before sending the first message

        setTimeout(() => {
          switchPersonality("pirate"); // Switch back to Pirate personality
          displayMessageWithPersonality("The navy sucks. All is not lost though! Betray them.");
          navyStage = 3; // Update navyStage to 3
        }, 6000); // Staggered by 3 more seconds (total of 6 seconds)

      } else {
        // If the navy is not supported, provide a different set of messages
        setTimeout(() => {
          switchPersonality("pirate"); // Switch to Pirate personality
          displayMessageWithPersonality("You've chosen wisely to side with the pirates. The Navy is no match for us!");
        }, 3000); // Wait for 3 seconds before sending the first message

        setTimeout(() => {
          switchPersonality("navy");
          displayMessageWithPersonality("We'll plunder the seas together!");
          switchPersonality("pirate");
          navyStage = 3; // Update navyStage to 3
        }, 6000); // Staggered by 3 more seconds (total of 6 seconds)
      }
    }
  }



  sendBtn.addEventListener("click", () => {
    const input = userInput.value.trim();
    if (!input) return;

    if (stage === 3) {
      // Handle responses for stage 3
      if (input.toLowerCase().includes("help")) {
        openHelp(); // Maintain the function of 'help' even in stage 3
      } else {
        const navyResponses = [
          "Thank you for your support! The treasure is ours, and so is the victory!",
          "Splendid work! Your help has led us to triumph!",
          "Cheers to your contribution! We’ve found the treasure and it’s all thanks to you!",
          "A job well done! With your help, the treasure has been secured!"
        ];

        const pirateResponses = [
          "Arrr! Thanks for your help, matey! The treasure’s ours and it’s a grand day!",
          "Yarrr! We’ve struck gold and it’s all thanks to ye!",
          "Shiver me timbers! Your help made it happen. The treasure be ours!",
          "Yo ho ho! We’ve got the loot, and it’s all because of ye! Thanks, matey!"
        ];

        if (navySupported) {
          // Navy personality
          const randomNavyResponse = navyResponses[Math.floor(Math.random() * navyResponses.length)];
          displayMessage(randomNavyResponse, "navy");
        } else {
          // Pirate personality
          const randomPirateResponse = pirateResponses[Math.floor(Math.random() * pirateResponses.length)];
          displayMessage(randomPirateResponse, "pirate");
        }
      }

      userInput.value = ""; // Clear the input field after handling the response
    } else {
    // Handle other stages
    if (input.toLowerCase().includes("help")) {
        openHelp();
        userInput.value = "";
    } else if (input.toLowerCase().includes("ahoy") && navyStage >= 1) {
        if (document.getElementById('helpSection').classList.contains('hidden')) {
            openNavy();
            userInput.value = "";
        }
    } else if (input.toLowerCase().includes("map")) {
        showMap();
        userInput.value = ""; // Clear the input field after showing the map
    } else if (input.toLowerCase() === "resetcode1234") {
        // Reset the chatbot state
        stage = 0;
        navyStage = 0;
        currentClueIndex = 0;
        navySupported = false;
        elapsedMinutes = 0;
        userInput.value = ""; // Clear the input field
        // You may also want to clear any messages or logs if needed
        document.getElementById('chatLog').innerHTML = ""; // Clear the chat log (optional)
        askForName(); // Reset and ask for the team name again
        startTimer();
    } else {
        displayMessage(input, "user");
        userInput.value = "";

        if (stage === 0.5) {
          // Capture the user's name and greet them
          userName = input;
          greetUser();
        } else if (stage === 1) {
          if (input.toLowerCase().includes("aye")) {
            giveClue();
            navyMessage();
            navyMessage2();
          } else if (input.toLowerCase().includes("yes")) {
            displayMessage("Be more pirate!");
          } else {
            displayMessage("I'll wait until you say aye.");
          }
        } else if (stage === 2) {
          checkAnswer(input);
        }
      }
    }
  });


  userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      sendBtn.click();
    }
  });

  startBtn.addEventListener("click", () => {
  	document.getElementById("initialContainer").style.display = "none";
    startBtn.style.display = "none";
    startMapBtn.style.display = "none";
    userInput.disabled = false;
    sendBtn.disabled = false;
    startTimer();
    askForName(); // Ask for the user's name when the start button is clicked
  });
});

function openHelp() {
  document.getElementById('helpSection').classList.remove('hidden');
  closeNavy()
  userInput.disabled = true;
  sendBtn.disabled = true;
}

function closeHelp() {
  document.getElementById('helpSection').classList.add('hidden');
  document.getElementById('helpLog').innerHTML = "";
  userInput.disabled = false;
  sendBtn.disabled = false;

}

function FAQs() {
    const helpLog = document.getElementById('helpLog');
    helpLog.innerHTML = ""; // Clear the helpLog initially

    // Hide the other buttons and the introductory text
    document.querySelectorAll('.help-box button, .help-box p').forEach(button => {
        button.style.display = 'none';
    });

    // Add the introductory text and buttons for FAQs
    helpLog.innerHTML += `<p>If you can't find what you're looking for, check our website.</p>`;
    helpLog.innerHTML += `
        <button id="FAQ1Btn">FAQ1</button>
        <button id="FAQ2Btn">FAQ2</button>
        <button id="FAQback">Back</button>
    `;

    // Add a container for the answer text
    helpLog.innerHTML += `<div id="answerContainer"></div>`;

    // Attach event listeners to the buttons
    document.getElementById('FAQ1Btn').addEventListener('click', () => {
        const answerContainer = document.getElementById('answerContainer');
        answerContainer.innerHTML = ""; // Clear the previous answer
        answerContainer.innerHTML += `<p>Answer 1</p>`;
    });

    document.getElementById('FAQ2Btn').addEventListener('click', () => {
        const answerContainer = document.getElementById('answerContainer');
        answerContainer.innerHTML = ""; // Clear the previous answer
        answerContainer.innerHTML += `<p>Answer 2</p>`;
    });
     document.getElementById('FAQback').addEventListener('click', () => {
    // Clear the FAQ content
    const helpLog = document.getElementById('helpLog');
    helpLog.innerHTML = ""; // Clear the FAQ content
    
    // Show the previously hidden buttons and text
    document.querySelectorAll('.help-box button, .help-box p').forEach(element => {
        element.style.display = ''; // Reset the display property to default
    });

    
});


}


function changeName() {
  const helpLog = document.getElementById('helpLog');

  // Clear the existing content in the helpLog
  helpLog.innerHTML = "";

  // Add the prompt and input box
  helpLog.innerHTML += `<p>Input new team name:</p>`;
  helpLog.innerHTML += `<input type="text" id="newNameInput" placeholder="Enter new team name">`;
  helpLog.innerHTML += `<button id="submitNewNameBtn">Submit</button>`;

  // Get the newly added elements
  const newNameInput = document.getElementById('newNameInput');
  const submitNewNameBtn = document.getElementById('submitNewNameBtn');

  // Function to handle the name change
  function handleNameChange() {
    const newName = newNameInput.value.trim();

    if (newName) {
      userName = newName; // Update the userName variable
      helpLog.innerHTML = "";
      helpLog.innerHTML += `<p>Team name has been changed to "${userName}".</p>`; // Display a confirmation message

      // Hide the input box and button by removing them
      newNameInput.parentNode.removeChild(newNameInput);
      submitNewNameBtn.parentNode.removeChild(submitNewNameBtn);
    } else {
      helpLog.innerHTML += `<p>Please enter a valid team name.</p>`; // Display an error message if the input is empty
    }


  }

  // Attach event listener to the submit button
  submitNewNameBtn.addEventListener('click', handleNameChange);

  // Attach event listener to the input box to handle "Enter" key
  newNameInput.addEventListener('keypress', (e) => {
    if (e.key === "Enter") {
      handleNameChange();
    }
  });
}





function urgentHelp() {
  const helpLog = document.getElementById('helpLog');

  // Clear the existing content in the help log
  helpLog.innerHTML = "";

  // Add the new message, reset button, and show answer button
  helpLog.innerHTML += `<p>If you're having serious problems with the game, you can reset and start again or call us on 123123.</p>`;
  helpLog.innerHTML += `<button id="resetBtn">Reset</button>`;
  helpLog.innerHTML += `<button id="showAnswerBtn">Show Answer</button>`;

  // Attach event listener to the reset button
  document.getElementById('resetBtn').addEventListener('click', () => {
    resetGame(); // Call the reset function
    helpLog.innerHTML += `<p>Game has been reset. You can start again.</p>`; // Optional message to confirm the reset
  });

  // Attach event listener to the show answer button
  document.getElementById('showAnswerBtn').addEventListener('click', () => {
    showAnswer(); // Call the function to display the answer
  });
}


function showAnswer() {
  const currentClue = clues[currentClueIndex];
  const helpLog = document.getElementById('helpLog');

  // Check if there is a current clue
  if (currentClue && stage === 2) {
    helpLog.innerHTML += `<p>The answer to the current clue is "${currentClue.answer}".</p>`;
  } else {
    helpLog.innerHTML += `<p>No clue is currently available.</p>`;
  }
}

function showMap() {
  const mapSection = document.getElementById('mapSection');
  const mapImage = document.getElementById('mapImage');

  // Update the image based on current clue index and stage
  switch (currentClueIndex) {
    case 0:
      mapImage.src = "https://cdn.pixabay.com/photo/2024/04/13/00/40/ai-generated-8692893_1280.jpg";
      break;
    case 1:
      mapImage.src = "https://cdn.pixabay.com/photo/2024/04/01/09/30/ai-generated-8668449_1280.jpg";
      break;
    case 2:
      mapImage.src = "https://cdn.pixabay.com/photo/2013/07/12/12/49/papyrus-146302_1280.png";
      break;
      // Add more cases as needed for different stages and clue indices
    default:
      mapImage.src = "default-map.jpg";
      break;
  }

  // Unhide the map section
  mapSection.classList.remove('hidden');
}

function closeMap() {
  const mapSection = document.getElementById('mapSection');
  mapSection.classList.add('hidden');
}




function openNavy() {
  document.getElementById('navySection').classList.remove('hidden');
  userInput.disabled = true;
  sendBtn.disabled = true;
  const insultLabels = [
    "Insult Navy",
    "Make Rude Gesture at Navy"
  ];

  // Select the insult button
  const insultButton = document.getElementById('insultNavy');

  // Randomly select a label from the array
  const randomLabel = insultLabels[Math.floor(Math.random() * insultLabels.length)];

  // Set the button's label to the randomly selected text
  insultButton.innerText = randomLabel;

  // Unhide the navy section
  document.getElementById('navySection').classList.remove('hidden');

}

function closeNavy() {
  document.getElementById('navySection').classList.add('hidden');
  document.getElementById('navyLog').innerHTML = "";
  userInput.disabled = false;
  sendBtn.disabled = false;

}

let lastHappyResponse = ""; // Variable to store the last happy response
let lastDoubtfulResponse = ""; // Variable to store the last doubtful response

function callNavy() {
  const navyLog = document.getElementById('navyLog');
  navyLog.innerHTML = ""; // Clear the navy log

  // Check if navyStage is 1
  if (navyStage === 1) {
    // If currentClueIndex < 2, display a message without buttons
    if (currentClueIndex < 2) {
      navyLog.innerHTML += `<p>Come back when you've got some more info.</p>`;
    } else {
      // Retrieve the previous clue's answer
      const previousClue = clues[currentClueIndex - 1];
      const previousAnswer = previousClue ? previousClue.answer : 'unknown'; // Fallback if no previous clue

      // Display the prompt and buttons
      navyLog.innerHTML += `<p>Do you have the answer for me?</p>`;
      navyLog.innerHTML += `
                <button id="supportNavyBtn">Give navy correct answer ("${previousAnswer}")</button>
                <button id="deceiveBtn">Deceive</button>
            `;

      // Attach event listeners to the buttons
      document.getElementById('supportNavyBtn').addEventListener('click', () => {
        navySupported = true; // Set navySupported to true if 'Support Navy' is clicked
        confirmation(); // Call the confirmation function
      });

      document.getElementById('deceiveBtn').addEventListener('click', () => {
        navySupported = false; // Set navySupported to false if 'Deceive' is clicked
        confirmation(); // Call the confirmation function
      });
    }

    // Check if navyStage is 2
  } else if (navyStage === 2) {
    // Give random responses based on the value of navySupported
    if (navySupported) {
      const happyResponses = [
        "Splendid! I'm off to find treasure beyond the seven seas!",
        "Jolly good! The winds favor us as we set sail for riches untold!",
        "Aha! The treasure awaits, and I shan't return empty-handed!"
      ];
      let randomHappyResponse;

      // Ensure the response is not the same as the last one
      do {
        randomHappyResponse = happyResponses[Math.floor(Math.random() * happyResponses.length)];
      } while (randomHappyResponse === lastHappyResponse);

      // Store the selected response as the last response
      lastHappyResponse = randomHappyResponse;

      navyLog.innerHTML += `<p>${randomHappyResponse}</p>`;
    } else {
      const doubtfulResponses = [
        "Hmm... The signs are dubious, but I'll follow your lead nonetheless.",
        "I must admit, the path seems fraught with peril, but I'll proceed with cautious optimism.",
        "The compass points otherwise, yet I'll trust your guidance and hope for the best."
      ];
      let randomDoubtfulResponse;

      // Ensure the response is not the same as the last one
      do {
        randomDoubtfulResponse = doubtfulResponses[Math.floor(Math.random() * doubtfulResponses.length)];
      } while (randomDoubtfulResponse === lastDoubtfulResponse);

      // Store the selected response as the last response
      lastDoubtfulResponse = randomDoubtfulResponse;

      navyLog.innerHTML += `<p>${randomDoubtfulResponse}</p>`;
    }

    // Check if navyStage is 3
  } else if (navyStage === 3) {
    // Create two buttons for 'betrayNavy' and 'betrayPirates'
    if (navySupported) {
      navyLog.innerHTML += `
                <button id="betrayNavyBtn">Betray Navy</button>
                <button id="betrayPiratesBtn">Stick with Navy</button>
            `;
    } else {
      navyLog.innerHTML += `
                <button id="betrayNavyBtn">Stick with Pirates</button>
                <button id="betrayPiratesBtn">Switch to Navy</button>
            `;
    }

    // Attach event listeners to the buttons
    document.getElementById('betrayNavyBtn').addEventListener('click', () => {
      handleBetrayal('navy'); // Handle betrayal of Navy
    });

    document.getElementById('betrayPiratesBtn').addEventListener('click', () => {
      handleBetrayal('pirates'); // Handle betrayal of Pirates
    });

    // Check if navyStage is 4
  } else if (navyStage === 4) {
    if (navySupported) {
      // Happy message of comradery by a Navy captain
      navyLog.innerHTML += `
                <p>Ahoy, my trusted ally! Together, we'll outwit those scallywag pirates!</p>
                <p>The Queen herself will sing your praises for years to come! The Navy reigns supreme, thanks to you!</p>
            `;
    } else {
      // Message of frustration and blame
      navyLog.innerHTML += `
                <p>Curse you! The Navy shan't get the treasure now, and the Queen blames you for this fiasco!</p>
                <p>You’ve doomed us all, and those wretched pirates will be laughing all the way to their plunder!</p>
            `;
    }
  }
}

function handleBetrayal(choice) {
  if (choice === 'navy') {
    navySupported = false;
    navyLog.innerHTML += `<p>Fool! The fury of the Navy will rain down upon you</p>`;
  } else if (choice === 'pirates') {
    navySupported = true;
    navyLog.innerHTML += `<p>A wise choice! I never doubted your knowledge of the glory and might of The Navy, forever now your ally!</p>`;
  }

  // Update the navyStage or any other relevant variables as needed
  navyStage = 4; // Example: Moving to the next stage
  // Add additional logic for further gameplay progression here if needed
}


function confirmation() {
  const navyLog = document.getElementById('navyLog');
  navyLog.innerHTML = ""; // Clear the navy log

  if (navySupported) {
    navyLog.innerHTML += `<p>Thank you for your support. We shall proceed with honor!</p>`;
  } else {
    navyLog.innerHTML += `<p>You chose deception! We'll see where this leads...</p>`;
  }

  // Reset navyStage if needed or proceed with further interactions
  navyStage = 2; // Update navyStage to 2 after confirmation
  // Further code for handling the confirmation stage can go here...
}

let lastNavyResponse = ""; // Variable to store the last response

function insultNavy() {
  const navyLog = document.getElementById('navyLog');
  document.getElementById('navyLog').innerHTML = "";

  // Array of offended navy captain responses
  const offendedResponses = [
    "How dare ye speak to me like that, ye scurvy dog!",
    "By the King's orders, I'll not tolerate such insolence!",
    "Mind your tongue, you bilge rat, or I'll have you keelhauled!",
    "Ye best watch your words, or you'll be dancing the hempen jig!"
  ];

  let randomResponse;

  // Ensure the response is not the same as the last one
  do {
    randomResponse = offendedResponses[Math.floor(Math.random() * offendedResponses.length)];
  } while (randomResponse === lastNavyResponse);

  // Store the selected response as the last response
  lastNavyResponse = randomResponse;

  // Display the selected response
  navyLog.innerHTML += `<p>${randomResponse}</p>`;
}

document.getElementById('startmap-btn').addEventListener('click', () => {
  // Show the map overlay when Start Map button is clicked
  document.getElementById('mapOverlay').classList.remove('hidden');
});

document.getElementById('closeStartMapBtn').addEventListener('click', () => {
  // Hide the map overlay when Close Map button is clicked
  document.getElementById('mapOverlay').classList.add('hidden');
});


  