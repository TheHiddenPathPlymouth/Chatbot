let navySupported = false;
let navyStage = 0;
let currentClueIndex = 0;
let stage = 0;
let userName = ""; // Variable to store the user's name
let startTime; // Save the start time of the treasure hunt
let totalPausedTime = 0; // Total paused time in milliseconds
let pauseStartTime; // Time when the game was last paused
let isPaused = false;
let currentPersonality = "pirate";

// Call `saveStateAndLog()` after every significant change
let inactivityTimer;
const inactivityLimit = 60000; // 1 minute in milliseconds
const savedChatLog = localStorage.getItem('chatLog');
const chatLog = document.getElementById('chatLog'); // Use chatLog instead of mainChat
const chatOutput = document.getElementById("mainChat");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const startBtn = document.getElementById("start-btn");
const startMapBtn = document.getElementById("startmap-btn");

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
    delayAfterAnswer: 3000
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
    delayAfterAnswer: 3000
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
    delayAfterAnswer: 3000
  }
];

// Declare the pendingActions array globally
let pendingActions = JSON.parse(localStorage.getItem('pendingActions')) || [];

// Function to add a pending action
function addPendingAction(action) {
  pendingActions.push(action);
  localStorage.setItem('pendingActions', JSON.stringify(pendingActions));
  
  // Log the current state of pendingActions
  console.log('Pending actions:', pendingActions);
}


function removePendingAction(action) {
  // Find the index of the action in the pendingActions array
  const actionIndex = pendingActions.indexOf(action);

  // If the action is found, remove it from the array
  if (actionIndex !== -1) {
    pendingActions.splice(actionIndex, 1);
    localStorage.setItem('pendingActions', JSON.stringify(pendingActions));
  }
  console.log('Pending actions after removal:', pendingActions);
}


function executePendingActions() {
  pendingActions.forEach((action) => {
    if (action === 'navyMessage') {
      navyMessage();
    }

    if (action === 'navyMessage2') {
      navyMessage2();
    }
   
     if (action === 'giveClue') {
      giveClue();
    }
     if (action === 'clueMessages') {
      clueMessages();
    }
     if (action === 'readyMessage') {
      readyMessage();
    }
  });

  // Clear all pending actions after execution
  pendingActions = [];
  localStorage.removeItem('pendingActions');
}

function saveChatbotState() {
  localStorage.setItem('chatLog', document.getElementById('chatLog').innerHTML);
  localStorage.setItem('stage', stage);
  localStorage.setItem('navyStage', navyStage);
  localStorage.setItem('currentClueIndex', currentClueIndex);
  localStorage.setItem('userName', userName);
  localStorage.setItem('navySupported', navySupported);
  localStorage.setItem('totalPausedTime', totalPausedTime);
  localStorage.setItem('pauseStartTime', pauseStartTime);
  localStorage.setItem('hintsRequested', clues[currentClueIndex].hintsRequested);
}


function saveStateAndLog() {
  saveChatbotState();
  const currentTime = new Date().getTime(); // Get the current time as the end time

  // Calculate the total time excluding the paused time
  const totalCurrentTime = currentTime - startTime - totalPausedTime;
  console.log(`Total elapsed time: ${formatTime(totalCurrentTime)}`);
  // Save any other state variables if needed
}


function loadChatbotState() {
  const savedChatLog = localStorage.getItem('chatLog');
  const savedStage = localStorage.getItem('stage');
  const savedNavyStage = localStorage.getItem('navyStage');
  const savedUserName = localStorage.getItem('userName');
  const savedClueIndex = localStorage.getItem('currentClueIndex');
  const savedNavySupported = localStorage.getItem('navySupported');
  const savedTotalPausedTime = localStorage.getItem('totalPausedTime');
  const savedPauseStartTime = localStorage.getItem('pauseStartTime');
  const savedStartTime = localStorage.getItem('startTime');


  const chatLog = document.getElementById('chatLog'); // Use chatLog instead of mainChat
  const savedHintsRequested = localStorage.getItem('hintsRequested');

  // Call reinitializeEventListeners after loading the chat log
  if (savedChatLog && savedUserName) {
    // Restore the saved chat log content inside the #chatLog container
    chatLog.innerHTML = savedChatLog;

    // Hide the initial container since the chat has started
    document.getElementById("initialContainer").style.display = "none";
    // Scroll to the bottom of the chat log
    chatLog.scrollTop = chatLog.scrollHeight;
  } else {
    // No saved chat log or both clueIndex and stage are 0, show the initial container and disable inputs
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
    userName = savedUserName; // Fixed: userName is likely a string, not an integer
  }

  if (savedClueIndex) {
    currentClueIndex = parseInt(savedClueIndex, 10);
  }

  if (savedNavySupported) {
    navySupported = (savedNavySupported === 'true');
  }

  // Handle loading of totalPausedTime and pauseStartTime
  if (savedTotalPausedTime) {
    totalPausedTime = parseFloat(savedTotalPausedTime); // Use parseFloat for time which may have decimal values
  }

  if (savedPauseStartTime) {
    pauseStartTime = new Date(parseInt(savedPauseStartTime, 10)); // Assuming savedPauseStartTime is a timestamp
  }
  if (savedStartTime) {
    startTime = new Date(parseInt(savedStartTime, 10)); // Assuming savedPauseStartTime is a timestamp
  }
  if (savedHintsRequested) {
    clues[currentClueIndex].hintsRequested = parseInt(savedHintsRequested, 10);
  }
}

// Call `loadChatbotState()` immediately as the script runs


loadChatbotState();
executePendingActions();








function startInactivityTimer() {
  // Start the timer only if the stage is 1 or 2
  if (stage === 2) {
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


function displayMessageWithPersonality(message) {
  displayMessage(message, currentPersonality);
}

function switchPersonality(personality) {
  currentPersonality = personality;
}



function loadTimer() {
  // Load saved start time, total paused time, and pause state
  startTime = parseInt(localStorage.getItem('startTime'));
  totalPausedTime = parseInt(localStorage.getItem('totalPausedTime')) || 0;
  const savedIsPaused = localStorage.getItem('isPaused');
  pauseStartTime = parseInt(localStorage.getItem('pauseStartTime'));

  if (startTime) {
    // The game has already started
    if (savedIsPaused === 'true' && pauseStartTime) {
      isPaused = true;
    }
  
  } else {
    // If no start time is saved, this is the first time starting the timer
    startTime = new Date().getTime();
    localStorage.setItem('startTime', startTime.toString());
  }
}

function startTimer() {
  // This function should only be called at the beginning of the game
  startTime = new Date().getTime();
  localStorage.setItem('startTime', startTime.toString());
  isPaused = false;
  localStorage.setItem('isPaused', 'false');
}

function pauseTimer() {
  if (!isPaused) {
    pauseStartTime = new Date().getTime();
    isPaused = true;
    localStorage.setItem('isPaused', 'true');
    localStorage.setItem('pauseStartTime', pauseStartTime.toString());
  }
}

function resumeTimer() {
  if (isPaused && pauseStartTime) {
    // Calculate the time that the game was paused
    const currentPauseDuration = new Date().getTime() - pauseStartTime;
    totalPausedTime += currentPauseDuration;
    localStorage.setItem('totalPausedTime', totalPausedTime.toString());
    isPaused = false;
    localStorage.setItem('isPaused', 'false');
    localStorage.removeItem('pauseStartTime'); // Clear the pause start time as it's no longer needed
  }
}

function stopTimer() {
  const endTime = new Date().getTime();
  const totalTime = endTime - startTime - totalPausedTime;
  console.log(`Total time: ${formatTime(totalTime)}`); // Display or use the total time as needed

  // Clear all saved values (optional)
  localStorage.removeItem('startTime');
  localStorage.removeItem('totalPausedTime');
  localStorage.removeItem('pauseStartTime');
  localStorage.setItem('isPaused', 'true');
}

function formatTime(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
  return `${minutes}:${formattedSeconds}`;
}


// Additional logic, functions, and event listeners...

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
  saveStateAndLog();
}

function askForName() {
  displayMessage("Ahoy! What's your name, matey?");
  stage = 0.5; // Set a special stage for name input
  saveStateAndLog();

}





function readyMessage() {
    stage = 1;

    if (currentClueIndex > 0) {
        const message = currentClueIndex === clues.length - 1 
            ? "Are you ready for your final clue?" 
            : "Are you ready for the next clue? If so say aye!";

        setTimeout(() => {
            displayMessage(message);
            removePendingAction('readyMessage');
        }, 6000); // 6-second delay if currentClueIndex > 0
    } else {
        setTimeout(() => {
            displayMessage("Are you ready for your first clue?");
            removePendingAction('readyMessage');
        }, 2000); // 2-second delay if currentClueIndex = 0
    }

    
}


function giveClue() {
  const currentClue = clues[currentClueIndex];
  stage = 2;
  displayMessage(`Here is your clue: ${currentClue.clue}`);

  resumeTimer();

  // Add navyMessage logic if conditions are met
  if (currentClueIndex === 1 && stage >= 2 && navyStage === 0) {
  		addPendingAction('navyMessage');
    setTimeout(() => {
      removePendingAction ('giveClue');
    }, 3050);
     
    setTimeout(() => {
      navyMessage();
      removePendingAction('navyMessage');
    }, 6000); // 6-second delay for navyMessage
  }

  // Add navyMessage2 logic if conditions are met
  if (currentClueIndex === 2 && stage >= 2) {
  		addPendingAction('navyMessage2');
      removePendingAction ('giveClue');
    setTimeout(() => {
      navyMessage2();
      removePendingAction('navyMessage2');
    }, 8000); // 8-second delay for navyMessage2
  }

  // Display the after clue message after a delay (This is the last thing in the function)
  setTimeout(() => {
    displayMessage(currentClue.afterClueMessage);
  }, currentClue.delayAfterClue);
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
    stage = 0;

    pauseTimer();
    addPendingAction('clueMessages');

    setTimeout(() => {
        displayMessage(randomResponse);
       
        clueMessages();
        
    }, 2000); // 2-second delay before executing displayMessage and clueMessages

    




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

  }
}



function clueMessages() {
  const currentClue = clues[currentClueIndex];
  displayMessage(currentClue.explanation);

  setTimeout(() => {
    displayMessage(currentClue.afterAnswerMessage);
  }, currentClue.delayAfterAnswer);

  // Logic for advancing to the next clue or ending the game
  if (currentClueIndex < clues.length - 1) {
    stage = 0; // Reset stage to readyMessage
    incorrectAttempts = 0;
    currentClueIndex++;
    addPendingAction('readyMessage');
    readyMessage();
  } else {
    setTimeout(() => {
      congratulations(); // Display final congratulations message
      stage = 3;
    }, 6000); // 6-second delay before displaying the final message
    stage = 0; // Reset stage if needed to replay
  }
  
  removePendingAction('clueMessages');
 
  
}




function congratulations() {
  const endTime = new Date().getTime(); // Get the current time as the end time

  // Calculate the total time excluding the paused time
  const totalElapsedTime = endTime - startTime - totalPausedTime;

  // Convert the total elapsed time from milliseconds to minutes and seconds
  const elapsedMinutes = Math.floor(totalElapsedTime / 60000); // Convert to minutes
  const elapsedSeconds = Math.floor((totalElapsedTime % 60000) / 1000); // Convert remaining milliseconds to seconds

  // Format the final time string
  const finalTime = `${elapsedMinutes} minute${elapsedMinutes !== 1 ? 's' : ''} and ${elapsedSeconds} second${elapsedSeconds !== 1 ? 's' : ''}`;

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
  addPendingAction('readyMessage'); // Proceed to readyMessage after greeting
  readyMessage();
}


function openHelp() {
  document.getElementById('helpSection').classList.remove('hidden');
  closeNavy();
  userInput.disabled = true;
  sendBtn.disabled = true;
  pauseTimer();
}

function closeHelp() {
  document.getElementById('helpSection').classList.add('hidden');
  document.getElementById('helpLog').innerHTML = "";
  userInput.disabled = false;
  sendBtn.disabled = false;
  resumeTimer();

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
      saveStateAndLog();
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
  saveStateAndLog();

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
    navyStage = 4;
    navySupported = false;
    saveStateAndLog();
    navyLog.innerHTML += `<p>Fool! The fury of the Navy will rain down upon you</p>`;

  } else if (choice === 'pirates') {
    navyStage = 4;
    navySupported = true;
    saveStateAndLog();
    navyLog.innerHTML += `<p>A wise choice! I never doubted your knowledge of the glory and might of The Navy, forever now your ally!</p>`;

  }
  document.getElementById('betrayNavyBtn').style.display = 'none';
  document.getElementById('betrayPiratesBtn').style.display = 'none';
}





function confirmation() {
  const navyLog = document.getElementById('navyLog');
  navyLog.innerHTML = ""; // Clear the navy log

  if (navySupported) {
    navyLog.innerHTML += `<p>Thank you for your support. We shall proceed with honor!</p>`;
  } else {
    navyLog.innerHTML += `<p>You chose deception! We'll see where this leads...</p>`;
  }

  saveStateAndLog();

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

// Function to reload the page and clear all storage
function reloadPageAndClearStorage() {
  // Clear all local storage

  userInput.value = ""; // Clear the input field
  // You may also want to clear any messages or logs if needed
  document.getElementById('chatLog').innerHTML = "";

  // Introduce a slight delay before reloading the page to ensure storage is cleared
  setTimeout(() => {
    location.reload();
    startTimer();
  }, 100); // 100 milliseconds delay

  // Event listener to show the initial container after the page has loaded
  window.addEventListener('load', () => {
    document.getElementById('initialContainer').style.display = 'block';
  });
}

// On page load, check if we need to show the initial container
window.addEventListener('load', () => {
  // Check if the timer should start
  if (stage > 0 && startTime) {
    startInactivityTimer();
  }
  // Check the stage and currentclueindex conditions
  if (stage === 0 && currentClueIndex > 0 && currentClueIndex < clues.length - 1) {
    readyMessage();
  }



  // Check if we need to show the initial container
  if (localStorage.getItem('showInitialContainer') === 'true') {
    // Show the initial container
    const initialContainer = document.getElementById('initialContainer');
    if (initialContainer) {
      initialContainer.style.display = 'block';
    }

    // Optionally, disable the user input and send button
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');
    if (userInput) {
      userInput.disabled = true;
    }
    if (sendBtn) {
      sendBtn.disabled = true;
    }

    // Remove the flag
    localStorage.removeItem('showInitialContainer');
  }
});






function navyMessage() {
  navyStage = 1;
  saveStateAndLog();

  switchPersonality("navy"); // Switch to Navy personality
  displayMessageWithPersonality("Attention! This is the Navy captain speaking. I trust you're ready to cooperate with honor.");

  switchPersonality("pirate"); // Switch back to Pirate personality after the Navy message is sent
}



function navyMessage2() {
  // Update navyStage to 3
  navyStage = 3;
  saveStateAndLog(); // Save the updated state after changing navyStage

  // Check if the navy is supported
  if (navySupported === true) {
    setTimeout(() => {
      switchPersonality("navy"); // Switch to Navy personality
      displayMessageWithPersonality("You're clever, you supported the navy.");
    }); // Wait for 3 seconds before sending the first message

    setTimeout(() => {
      switchPersonality("pirate"); // Switch back to Pirate personality
      displayMessageWithPersonality("The navy sucks. All is not lost though! Betray them.");
    }, 3000); // Staggered by 3 more seconds (total of 6 seconds)

  } else {
    // If the navy is not supported, provide a different set of messages
    setTimeout(() => {
      switchPersonality("pirate"); // Switch to Pirate personality
      displayMessageWithPersonality("You've chosen wisely to side with the pirates. The Navy is no match for us!");
    }); // Wait for 3 seconds before sending the first message

    setTimeout(() => {
      switchPersonality("navy");
      displayMessageWithPersonality("We'll plunder the seas together!");
      switchPersonality("pirate");
    }, 3000); // Staggered by 3 more seconds (total of 6 seconds)
  }
}




sendBtn.addEventListener("click", () => {
  const input = userInput.value.trim();
  if (!input) return;

  // Check for reset codes before anything else
  if (input.toLowerCase() === "resetcode1234") {
    // Reset the chatbot state
    stage = 0;
    navyStage = 0;
    currentClueIndex = 0;
    navySupported = false;
    totalPausedTime = 0;
    userInput.value = ""; // Clear the input field
    document.getElementById('chatLog').innerHTML = ""; // Clear the chat log (optional)
    askForName(); // Reset and ask for the team name again
    return; // Exit the function to prevent further processing
  }

  if (input.toLowerCase() === "resetcode9999") {
    // Call the function to clear storage and reload the page
    localStorage.clear();
    reloadPageAndClearStorage();
    return; // Exit the function to prevent further processing
  }

  // Check for help command
  if (input.toLowerCase().includes("help")) {
    openHelp();
    userInput.value = ""; // Clear the input field after showing help
    return; // Exit the function to prevent further processing
  }

  // Handle commands that should work at all stages
  if (input.toLowerCase().includes("ahoy") && navyStage >= 1) {
    if (document.getElementById('helpSection').classList.contains('hidden')) {
      openNavy();
      userInput.value = "";
      return; // Exit the function to prevent further processing
    }
  } else if (input.toLowerCase().includes("map")) {
    showMap();
    userInput.value = ""; // Clear the input field after showing the map
    return; // Exit the function to prevent further processing
  }

  // Handle stage-based logic
  if (stage === 0.5) {
    // Capture the user's name and greet them
    displayMessage(input, "user");
    userName = input;
    greetUser();
    userInput.value = "";
  } else if (stage === 1) {
    displayMessage(input, "user");

    if (input.toLowerCase().includes("aye")) {
      if (currentClueIndex === 0) {
        startTimer(); // Start the timer if it's the first clue
      }

      // Add giveClue to pending actions
      addPendingAction('giveClue');
      setTimeout(() => {
        giveClue();
        removePendingAction('giveClue');
      }, 3000); // 3-second delay for giveClue

    } else if (input.toLowerCase().includes("yes")) {
      displayMessage("Be more pirate!");
    } else {
      displayMessage("I'll wait until you say aye.");
    }

    userInput.value = "";


  } else if (stage === 2) {
    displayMessage(input, "user");
    checkAnswer(input);
    userInput.value = "";
  } else if (stage === 3) {
    // Handle responses for stage 3
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

    userInput.value = ""; // Clear the input field after handling the response
  } else {
    // Handle all other inputs
    displayMessage(input, "user");
    userInput.value = "";
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
  


  askForName(); // Ask for the user's name when the start button is clicked
});
