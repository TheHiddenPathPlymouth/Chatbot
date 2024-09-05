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
let incorrectAttempts = 0; // Initialize a variable to track incorrect attempts

// Call `saveStateAndLog()` after every significant change
let inactivityTimer;
let inactivityLimit = 60000; // 1 minute in milliseconds
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
    clue: "I have cities, but no houses; mountains, but no trees; and seas, but no water.",
    hint: "It's something that helps people find their way.",
    hint2: "It's a tool used in navigation.",
    answer: "atlas",
    mistakenAnswer: "globe",
    mistakenAnswerResponse: "close",
    explanation: "A map represents geographical features like cities, mountains, and seas.",
    afterClueMessage: "Think of something flat and informative.",
    afterAnswerMessage: "Maps are essential for explorers and adventurers.",
    hintsRequested: 0,
    delayAfterClue: 2500, // Delay in milliseconds
    delayAfterAnswer: 3000
  },
  {
    clue: "The more you take, the more you leave behind. What am I?",
    hint: "It's something you do while walking.",
    hint2: "It's related to footprints.",
    answer: "footsteps",
    mistakenAnswer: "time",
    mistakenAnswerResponse: "not quite",
    explanation: "As you walk, you leave behind more footsteps.",
    afterClueMessage: "Consider the physical marks you leave while moving.",
    afterAnswerMessage: "Footsteps are the trace of your journey.",
    hintsRequested: 0,
    delayAfterClue: 3000, // Delay in milliseconds
    delayAfterAnswer: 3000
  },
  {
    clue: "I can be cracked, made, told, and played. What am I?",
    hint: "It's something that can make you laugh.",
    hint2: "It's often shared among friends.",
    answer: "joke",
    mistakenAnswer: "story",
    mistakenAnswerResponse: "close",
    explanation: "A joke can be cracked, made, told, and played for amusement.",
    afterClueMessage: "Think of something light-hearted and humorous.",
    afterAnswerMessage: "Jokes are a universal way to bring joy and laughter.",
    hintsRequested: 0,
    delayAfterClue: 3000, // Delay in milliseconds
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


// Define a mapping of action names to functions
const actionMap = {
  'navyMessage': navyMessage,
  'navyMessage2': navyMessage2,
  'giveClue': giveClue,
  'clueMessages': clueMessages,
  'readyMessage': readyMessage,
  'congratulations': congratulations,
  'greetUser': greetUser,
  'pirateIntro': pirateIntro,
  'askForName': askForName,
  'roles': roles, 
  'rolesConfirmation': rolesConfirmation,
  'instructions' : instructions
};

function executePendingActions() {
  pendingActions.forEach((action) => {
    const actionFunction = actionMap[action];
    if (actionFunction) {
      actionFunction();
    }
  });

  // Clear all pending actions after execution
  pendingActions = [];
  localStorage.removeItem('pendingActions');

  // Optional: Add any additional logic if needed
  console.log('All pending actions executed and cleared.');
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
  if (savedChatLog) {
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
    stage = parseFloat(savedStage, 10);
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
updateFlag();
executePendingActions();







function startInactivityTimer() {
  // Clear any existing timer to prevent multiple intervals
  clearTimeout(inactivityTimer);

  if (stage === 0.5) {
    // Set inactivityLimit to 1 minute for stage 0.2
    inactivityLimit = 60000; // 1 minute in milliseconds

    inactivityTimer = setTimeout(() => {
      displayMessage("Spit it out then shipmates!", "pirate");
    }, inactivityLimit);
  } else if (stage === 0.2) {
    // Set inactivityLimit to 5 minutes for stage 2
    inactivityLimit = 60000; // 5 minutes in milliseconds

    inactivityTimer = setTimeout(() => {
      displayMessage("I need an answer shipmates! Say 'aye' if your'e ready to seek some treasure!", "pirate");
    }, inactivityLimit);

  } else if (stage === 2) {
    // Set inactivityLimit to 5 minutes for stage 2
    inactivityLimit = 300000; // 5 minutes in milliseconds

    inactivityTimer = setTimeout(() => {
      sendInactivityMessage();
    }, inactivityLimit);
  } else {
    // Do not start the timer if the stage is not 0.2 or 2
    return;
  }
}


function stopInactivityTimer() {
  // Clear the existing timer to stop the inactivity check
  clearTimeout(inactivityTimer);

  // Optionally, log or take other actions to confirm the timer has been stopped
  console.log("Inactivity timer stopped.");
}


function sendInactivityMessage() {
  // Check the value of navySupported and send appropriate message
  if (navySupported) {

    displayMessage("Where are you? We've got treasure to find. Type 'hint' for a hint from that pesky pirate.", "navy");

  } else {

    displayMessage("Arrr, where have you gone? We've got treasure to plunder. Type 'hint' if you need help!", "pirate");
  }
}

document.getElementById('userInput').addEventListener('input', startInactivityTimer);






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

function pirateIntro() {
  stage = 0.2;
  startInactivityTimer();
  addPendingAction('pirateIntro');
  displayMessage("Ahoy there! Captain Ida Patch speakin', foulest and richest pirate in these 'ere Plymouth waters.", "pirate");
  setTimeout(() => {
    displayMessage("What have we got here? A scraggy bunch of treasure-seeking miscreants lookin' to join my crew? Well, you're in luck, I happen to have a few openings available for crewmates with sharp eyes and sharp brains. That sound like you?", "pirate");
    saveStateAndLog();
    removePendingAction('pirateIntro');
  }, 3000);

  
}

function pirateIntroResponse(input) {
  displayMessage(input, "user");
  addPendingAction('askForName');


  // Convert input to lowercase for case-insensitive comparison
  const lowerInput = input.toLowerCase();

  // Check if the input includes specific keywords and display the corresponding message
  if (lowerInput.includes('aye')) {

    setTimeout(() => {
      displayMessage("Excellent, you have the soul of a pirate! Now let's get treasure hunting!", "pirate");
    }, 1000);
  } else if (lowerInput.includes('yes')) {

    setTimeout(() => {
      displayMessage("That'll do for now. Let's get treasure hunting!", "pirate");
    }, 1000);
  } else if (lowerInput.includes('no')) {
    setTimeout(() => {
      displayMessage("That's ok, there's room for foolish deck skivvies on this ship too! Now let's get treasure hunting!", "pirate");
    }, 1000);
  }


  setTimeout(() => {
    askForName();
    
  }, 5000);
}


function askForName() {

  stage = 0.5; // Set a special stage for name input
  startInactivityTimer();
  displayMessage("Now first, if you're going to join my crew you're going to need a team name. What'll it be mateys?", "pirate");
  removePendingAction('askForName');
  saveStateAndLog();

}


function greetUser() {
  addPendingAction('greetUser');
  displayMessage(`Welcome to the crew, ${userName}! You're all now officially pirates!`, "pirate");
  addPendingAction('roles'); // Add pending action for roles
  // Remove greetUser pending action after the message
  removePendingAction('greetUser');
  showPirateFlag();

  // Set a 2-second timeout before triggering the roles function
  setTimeout(() => {
    roles();
  }, 2000);

}

function roles() {
  displayMessage("Now everyone chips in 'n' helps out on this crew, but if you'd like, you can now choose your roles...", "pirate");

  // Set a 2-second gap before each role message
  setTimeout(() => {
    displayMessage("We'll need a First Lieutenant, a leader to be in charge of reading out clues and giving the answer...", "pirate");
  }, 3000);

  setTimeout(() => {
    displayMessage("A Navigator, an incredibly important job. You'll be in charge of the map and getting this ship where it needs to go...", "pirate");
  }, 6000);

  setTimeout(() => {
    displayMessage("And finally, we'll need some Look Outs with keen eyes to look out for clues and help solve the riddles.", "pirate");
    addPendingAction('rolesConfirmation');
    removePendingAction('roles'); // Remove pending action for roles
    rolesConfirmation();
  }, 9000);
  
 


}

function rolesConfirmation() {
  setTimeout(() => {
    displayMessage("Got your roles sorted? Once you have, say 'aye!'", "pirate");
    stage = 0.7;
    startInactivityTimer();
    removePendingAction('rolesConfirmation');
  }, 5000);
}

function pirateIntroResponse2(input) {
  displayMessage(input, "user");



  // Convert input to lowercase for case-insensitive comparison
  const lowerInput = input.toLowerCase();

  // Check if the input includes specific keywords and display the corresponding message
  if (lowerInput.includes('aye')) {
    setTimeout(() => {
      displayMessage("Excellent, just before we start here's some tips for you", "pirate");
      addPendingAction('instructions');
      instructions();
    }, 1000);
  } else if (lowerInput.includes('yes')) {
    setTimeout(() => {
      displayMessage("You're pirates m'hearties, say 'aye!'", "pirate");
    }, 1000);
  } else if (lowerInput.includes('no')) {
    setTimeout(() => {
      displayMessage("Just say 'aye!' when you've dished out your jobs", "pirate");
    }, 1000);
  }

}

function instructions() {
  // Display the instructions for the First Lieutenant after 3 seconds
  setTimeout(() => {
    displayMessage("First Lieutenant: If your team needs extra information to solve a clue, type 'hint'", "pirate");
  }, 3000);

  // Display the instructions for the Navigator after an additional 3 seconds
  setTimeout(() => {
    displayMessage("Navigator: Type 'map' to access the map to your next clue", "pirate");
  }, 6000);

  // Display the general help message after another 3 seconds
  setTimeout(() => {
    displayMessage("If you lose a crewmate overboard or need help with anything else, just type 'help' and we'll throw you a rubber ring!", "pirate");

    // Remove the 'instructions' pending action and add 'readyMessage' pending action
    removePendingAction('instructions');
    addPendingAction('readyMessage');

    // Call the readyMessage function
    readyMessage();
  }, 9000);
}





function readyMessage() {
  stage = 1;

  if (currentClueIndex > 0) {
    const message = currentClueIndex === clues.length - 1 ?
      "Are you ready for your final clue?" :
      "Are you ready for the next clue? If so say aye!";

    setTimeout(() => {
      displayMessage(message, "pirate");
      removePendingAction('readyMessage');
    }, 6000); // 6-second delay if currentClueIndex > 0
  } else {
    setTimeout(() => {
      displayMessage("OK, that's it. Are you ready for your first clue?", "pirate");
      removePendingAction('readyMessage');
    }, 2000); // 2-second delay if currentClueIndex = 0
  }
}



function giveClue() {
  const currentClue = clues[currentClueIndex];
  stage = 2;
  displayMessage(`Here is your clue: ${currentClue.clue}`, "pirate");
  startInactivityTimer();

  resumeTimer();

  // Add navyMessage logic if conditions are met
  if (currentClueIndex === 1 && stage >= 2 && navyStage === 0) {
    addPendingAction('navyMessage');
    setTimeout(() => {
      removePendingAction('giveClue');
    }, 3050);

    setTimeout(() => {
      navyMessage();
      removePendingAction('navyMessage');
    }, 6000); // 6-second delay for navyMessage
  }

  // Add navyMessage2 logic if conditions are met
  if (currentClueIndex === 3 && stage >= 2) {
    addPendingAction('navyMessage2');
    removePendingAction('giveClue');
    setTimeout(() => {
      navyMessage2();
      removePendingAction('navyMessage2');
    }, 8000); // 8-second delay for navyMessage2
  }

  // Display the after clue message after a delay (This is the last thing in the function)
  setTimeout(() => {
    displayMessage(currentClue.afterClueMessage, "pirate");
  }, currentClue.delayAfterClue);
}




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
    stopInactivityTimer();
    pauseTimer();
    addPendingAction('clueMessages');

    setTimeout(() => {
      displayMessage(randomResponse, "pirate");

      clueMessages();

    }, 2000); // 2-second delay before executing displayMessage and clueMessages






  } else if (input.toLowerCase().includes("hint")) {
    giveHint();
  } else {
    // Check if the input matches the mistakenAnswer for the current clue
    if (currentClue.mistakenAnswer && input.toLowerCase().includes(currentClue.mistakenAnswer.toLowerCase())) {
      displayMessage(currentClue.mistakenAnswerResponse, "pirate");

      // Add a 1.5-second delay before showing the hint message
      setTimeout(() => {
        displayMessage("Type 'hint' if you need more information.", "pirate");
      }, 1500);
    } else {
      const randomIncorrectResponse = incorrectResponses[Math.floor(Math.random() * incorrectResponses.length)];
      displayMessage(randomIncorrectResponse, "pirate");

      // Display a reminder message on the first and third incorrect attempts
      if (incorrectAttempts === 0 || incorrectAttempts === 3) {
        displayMessage("You can type 'hint' if you need more information.", "pirate");
      }
    }

    incorrectAttempts++; // Increment incorrect attempts

  }
}

function clueMessages() {

  const currentClue = clues[currentClueIndex];

  setTimeout(() => {

    displayMessage(currentClue.explanation, "pirate");

  }, 1000);

  setTimeout(() => {

    displayMessage(currentClue.afterAnswerMessage, "pirate");

  }, currentClue.delayAfterAnswer);


  // Logic for advancing to the next clue or ending the game
  if (currentClueIndex < clues.length - 1) {
    stage = 0; // Reset stage to readyMessage
    incorrectAttempts = 0;
    currentClueIndex++;
    saveStateAndLog();
    addPendingAction('readyMessage');
    readyMessage();
  } else {
    addPendingAction('congratulations');
    setTimeout(() => {
      congratulations(); // Display final congratulations message
    }, 6000); // 6-second delay before displaying the final message

  }

  removePendingAction('clueMessages');


}




function congratulations() {
  stage = 3;
  navyStage = 4;
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

    let message = `Congratulations, you found the treasure, ${userName}! As a true member of the Queen's Navy, you have proven your loyalty and wit! Your final time was ${finalTime}.`;
    displayMessage(message, "navy");

    // Delay before switching to Pirate personality and displaying the next message
    setTimeout(() => {

      message = `Scupper me kippers you betrayed me to the Navy!`;
      displayMessage(message, "pirate");
    }, 4000); // 4-second delay

  } else {

    let message = `Ahoy, ${userName}! Ye found the treasure! Ye've got the cunning of a true pirate, and the spoils are yours! Yarrr! Your final time was ${finalTime}.`;
    displayMessage(message, "pirate");

    // Delay before switching to Navy personality and displaying the next message
    setTimeout(() => {

      message = `Curses be upon you, ${userName}! The Navy shall never forgive you for this!`;
      displayMessage(message, "navy");
    }, 4000); // 4-second delay
  }


  // Stop the timer permanently
  stopTimer();
  removePendingAction('congratulations');
  startCoinEffect();
  saveStateAndLog();
}

let coinInterval;
const coinDuration = 10000; // Duration for which coins should fall (10 seconds)
const coinIntervalTime = 200; // Interval between creating new coins

function createCoin() {
  const coin = document.createElement('div');
  coin.classList.add('coin');

  // Randomize the starting position of each coin
  coin.style.left = Math.random() * 100 + 'vw';

  // Randomize the duration of the fall animation
  coin.style.animationDuration = Math.random() * 3 + 2 + 's';

  document.getElementById('coin-container').appendChild(coin);

  // Remove the coin after the animation ends to prevent too many elements
  setTimeout(() => {
    coin.remove();
  }, 5000); // Adjust this value to match the longest animation duration
}

function startCoinEffect() {
  // Create new coins at intervals
  coinInterval = setInterval(createCoin, coinIntervalTime);

  // Stop the coin effect after the specified duration
  setTimeout(() => {
    clearInterval(coinInterval);
  }, coinDuration);
}





function giveHint() {
  const currentClue = clues[currentClueIndex];

  if (currentClue.hintsRequested === 0) {
    displayMessage("Here's your hint:", "pirate");
    setTimeout(() => {
      displayMessage(currentClue.hint, "pirate");
      currentClue.hintsRequested++;
    }, 1000);

  } else if (currentClue.hintsRequested === 1) {
    displayMessage("Sorry mateys, this is your last hint for this clue!", "pirate");
    setTimeout(() => {
      displayMessage(currentClue.hint2, "pirate");
      currentClue.hintsRequested++;
    }, 1500);

  } else {
    displayMessage("Sorry, I've no more info for you, but if you're really stuck you can find the answer to this clue in the 'Urgent Help' section. (Access this by typing 'help!')", "pirate");
  }
}



function openHelp() {
  document.getElementById('helpSection').classList.remove('hidden');
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
  helpLog.innerHTML += `<p>If you're really stuck, press the button below to reveal your answer.</p>`;

  helpLog.innerHTML += `<button id="showAnswerBtn">Show Answer</button>`;
  helpLog.innerHTML += `<p>If you're having serious problems with the game, you can call us for help on 123123123.</p>`;





  // Attach event listener to the show answer button
  document.getElementById('showAnswerBtn').addEventListener('click', () => {
    showAnswer(); // Call the function to display the answer
  });
}


function showAnswer() {
  const currentClue = clues[currentClueIndex];
  const showAnswerBtn = document.getElementById('showAnswerBtn');

  // Check if there is a current clue
  if (currentClue && stage === 2) {
    // Insert the answer directly after the showAnswerBtn
    showAnswerBtn.insertAdjacentHTML('afterend', `<p>The answer to the current clue is "${currentClue.answer}".</p>`);
  } else {
    // Insert the "No clue" message directly after the showAnswerBtn
    showAnswerBtn.insertAdjacentHTML('afterend', `<p>No clue is currently available.</p>`);
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

function updateFlag() {
  // Check if startTime or username is missing or invalid
  if (!startTime || !userName) {
    return; // Exit the function early
  }

  if (navySupported === false) {
    showPirateFlag();
  } else if (navySupported === true) {
    showNavyFlag();
  }
}


function closeNavy() {
  document.getElementById('navySection').classList.add('hidden');
  document.getElementById('navyLog').innerHTML = "";
  userInput.disabled = false;
  sendBtn.disabled = false;
  saveStateAndLog();
  updateFlag();



  // Check if stage is less than 3
  if (stage < 3) {
    // Define pirate responses
    const pirateResponses = [
      'Was that the Navy I heard?',
      'Blimey! I think I heard the Navy approaching!',
      'Arrr! Did I catch a glimpse of the Navy?',
      'Yarrr! Could it be the Navy lurking nearby?'
    ];

    // Randomly select a response
    const randomResponse = pirateResponses[Math.floor(Math.random() * pirateResponses.length)];

    // Set a timeout before displaying the message
    setTimeout(() => {

      displayMessage(randomResponse, "pirate");
    }, 1000); // 1-second delay
  }
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
    navyLog.innerHTML += `<p>It's time to decide where your loyalties lie</p>`;
    // Create two buttons for 'betrayNavy' and 'betrayPirates'
    if (navySupported) {
      navyLog.innerHTML += `
            <button class="betrayBtn" id="betrayNavyBtn">Betray Navy</button>
            <button class="betrayBtn" id="betrayPiratesBtn">Stick with Navy</button>
        `;
    } else {
      navyLog.innerHTML += `
            <button class="betrayBtn" id="betrayNavyBtn">Stick with Pirates</button>
            <button class="betrayBtn" id="betrayPiratesBtn">Switch to Navy</button>
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
    navyLog.innerHTML = '';
    navyLog.innerHTML += `<p>Fool! The fury of the Navy will rain down upon you</p>`;

  } else if (choice === 'pirates') {
    navyStage = 4;
    navySupported = true;
    saveStateAndLog();
    navyLog.innerHTML = '';
    navyLog.innerHTML += `<p>A wise choice! I never doubted your knowledge of the glory and might of The Navy, forever now your ally!</p>`;

  }
  document.getElementById('betrayNavyBtn').style.display = 'none';
  document.getElementById('betrayPiratesBtn').style.display = 'none';
}





function confirmation() {
  const navyLog = document.getElementById('navyLog');
  navyStage = 2;
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
  if (startTime && stage === 2) {
    startInactivityTimer();
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

  displayMessage("Attention! This is the Navy captain speaking. I trust you're ready to cooperate with honor.", "navy");

}



function navyMessage2() {
  // Update navyStage to 3
  navyStage = 3;
  saveStateAndLog(); // Save the updated state after changing navyStage

  // Check if the navy is supported
  if (navySupported === true) {
    setTimeout(() => {

      displayMessage("You're clever, you supported the navy.", "navy");
    }); // Wait for 3 seconds before sending the first message

    setTimeout(() => {

      displayMessage("You betrayed me.. That's OK though, we're all villians here. All is not lost! Betray the Navy! Rejoin us!", "pirate");
    }, 3000); // Staggered by 3 more seconds (total of 6 seconds)

  } else {
    // If the navy is not supported, provide a different set of messages
    setTimeout(() => {

      displayMessage("You've chosen wisely to side with the pirates. The Navy is no match for us!", "pirate");
    }); // Wait for 3 seconds before sending the first message

    setTimeout(() => {

      displayMessage("You are a fool! The King's Navy will make you pay for this!", "navy");

    }, 3000); // Staggered by 3 more seconds (total of 6 seconds)
  }
}

function showPirateFlag() {
  const pirateFlag = document.getElementById('pirateFlag');
  const navyFlag = document.getElementById('navyFlag');

  // Fade out navy flag if it's visible
  if (navyFlag.classList.contains('show')) {
    navyFlag.classList.remove('show');
    setTimeout(() => {
      navyFlag.style.display = 'none';
      pirateFlag.style.display = 'block';

      // Use setTimeout with 10ms to ensure the browser re-renders
      setTimeout(() => {
        pirateFlag.classList.add('show');
      }, 10);

    }, 1000); // Match the CSS transition duration
  } else {
    pirateFlag.style.display = 'block';

    // Use setTimeout with 10ms to ensure the browser re-renders
    setTimeout(() => {
      pirateFlag.classList.add('show');
    }, 10);
  }
}

function showNavyFlag() {
  const pirateFlag = document.getElementById('pirateFlag');
  const navyFlag = document.getElementById('navyFlag');

  // Fade out pirate flag if it's visible
  if (pirateFlag.classList.contains('show')) {
    pirateFlag.classList.remove('show');
    setTimeout(() => {
      pirateFlag.style.display = 'none';
      navyFlag.style.display = 'block';

      // Use setTimeout with 10ms to ensure the browser re-renders
      setTimeout(() => {
        navyFlag.classList.add('show');
      }, 10);

    }, 1000); // Match the CSS transition duration
  } else {
    navyFlag.style.display = 'block';

    // Use setTimeout with 10ms to ensure the browser re-renders
    setTimeout(() => {
      navyFlag.classList.add('show');
    }, 10);
  }
}





sendBtn.addEventListener("click", () => {
  const input = userInput.value.trim();
  if (!input) return;

  console.log("Stage before input:", stage); // Debug log to check stage

  // Check for reset codes before anything else
  if (input.toLowerCase() === "resetcode1234") {
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

  if (input.toLowerCase() === "resetcoderet1") {
    currentClueIndex--;
    userInput.value = ""; // Clear the input field
    switchPersonality("pirate");
    readyMessage();
    return; // Exit the function to prevent further processing
  }

  if (input.toLowerCase() === "resetcode9999") {
    localStorage.clear();
    reloadPageAndClearStorage();
    return;
  }

  if (input.toLowerCase().includes("help")) {
    openHelp();
    userInput.value = ""; // Clear the input field after showing help
    return;
  }

  if (input.toLowerCase().includes("ahoy") && navyStage >= 1) {
    if (document.getElementById('helpSection').classList.contains('hidden')) {
      openNavy();
      userInput.value = "";
      return;
    }
  } else if (input.toLowerCase().includes("map")) {
    showMap();
    userInput.value = ""; // Clear the input field after showing the map
    return;
  }

  // Handle stage-based logic
  if (stage === 0.2) {
    // Trigger pirateIntroResponse if stage is 0.2
    pirateIntroResponse(input);
    userInput.value = "";
  } else if (stage === 0.5) {
    // Capture the user's name and greet them
    displayMessage(input, "user");
    userName = input;
    userInput.value = "";
    greetUser();
  } else if (stage === 0.7) {
    pirateIntroResponse2(input);
    userInput.value = "";
  } else if (stage === 1) {
    displayMessage(input, "user");

    if (input.toLowerCase().includes("aye")) {
      if (currentClueIndex === 0) {
        startTimer(); // Start the timer if it's the first clue
      }

      addPendingAction('giveClue');
      setTimeout(() => {
        giveClue();
        removePendingAction('giveClue');
      }, 3000); // 3-second delay for giveClue

    } else if (input.toLowerCase().includes("yes")) {
      displayMessage("Be more pirate!", "pirate");
    } else {
      displayMessage("I'll wait until you say aye.", "pirate");
    }

    userInput.value = "";
  } else if (stage === 2) {
    displayMessage(input, "user");
    checkAnswer(input);
    userInput.value = "";
  } else if (stage === 3) {
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
      const randomNavyResponse = navyResponses[Math.floor(Math.random() * navyResponses.length)];
      displayMessage(randomNavyResponse, "navy");
    } else {
      const randomPirateResponse = pirateResponses[Math.floor(Math.random() * pirateResponses.length)];
      displayMessage(randomPirateResponse, "pirate");
    }

    userInput.value = "";
  } else {
    // Handle all other inputs
    displayMessage(input, "user");
    userInput.value = "";
  }

  console.log("Stage after input:", stage); // Debug log to check if stage changes
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



  pirateIntro(); // Ask for the user's name when the start button is clicked
});



