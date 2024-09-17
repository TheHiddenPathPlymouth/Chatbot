let navySupported = false;
let sendNavyInstructions = false;
let navyStage = 0;
let accessible = false;
let navyReminderSent = false;
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
const navyLine = document.querySelector('.navy-line');
const bottomBox = document.querySelector('.bottom-box');
const helpButton = document.getElementById('help-btn');


const clues = [{
    clue: "I'm 3 in May and though I grow no older, I'm 16 at the start of November. What am I at the start of October?",
    hint: "Look at the small information stones surrounding The Sundial.",
    hint2: ["https://cdn.pixabay.com/photo/2012/04/15/17/58/scroll-34696_1280.png", "We're looking for a number. My sources tell me we may find the answer here."],
    answer: ["ten", "10"],
    mistakenAnswer: ["1","2","3","4","5","6","7","8","9","0","one","two","three","four","five","six","seven","eight","nine","eleven","twelve","thirteen","twenty","fifteen","thirty","forty"],
    mistakenAnswerResponse: "Aye, that's a number, but not the right one!",
    mistakenAnswer2: ["time","equation","difference"],
    mistakenAnswerResponse2: "You're on the right track m'hearties, but we need a number.",
    explanation: "If ye were mathematically inclined you could use the equation of time to work out the exact time in Plymouth from this 'ere sundial.",
    afterClueMessage: "Ye shouldn't need to look far for the answer to this one. My charts tell me you're already in position.",
    afterAnswerMessage: "But it's probably easier to just look at yer clock.",
    hintsRequested: 0,
    delayAfterClue: 2000, // Delay in milliseconds
    delayAfterAnswer: 6000
  },
  {
    clue: "Often greatness from small things starts. What's written upon a drum under the stars?",
    hint: "Look for something that looks like an oddly-shaped lamp post near the Guildhall carpark.",
    hint2: "It's something that can cause serious damage but also provide warmth.",
    answer: "sic parvis magna",
    mistakenAnswer: ["sic","parvis","magna","design","original","drake","francis"],
    mistakenAnswerResponse: "Hmm, those are words on a drum, but are they the exact words under the stars?",
    explanation: "Sic parvis magna: Greatness from small beginnings. Some say old Francis Drake used it as his motto.",
    afterClueMessage: "Head South, then look left before the water for the answer to this next clue. I've updated your map. Type 'map' to view it.",
    afterAnswerMessage: "I don't agree with that privateer navy scum on much, but I'll agree it's a fine saying.",
    hintsRequested: 0,
    delayAfterClue: 3000, // Delay in milliseconds
    delayAfterAnswer: 6000
  },
  {
    clue: "An astronomer has six, an architect has three, a metal-worker has none at all. What could I be?",
    hint: "Look at the statues on the side of the guildhall, can you see an astronomer, metal-worker or an architect perhaps?",
    hint2: "Look at the desks of the architect and astronomer.",
    answer: ["flower","flowers","a flower"],
    mistakenAnswer: "globe",
    mistakenAnswerResponse: "close",
    explanation: "A map represents geographical features like cities, mountains, and seas.",
    afterClueMessage: "The answer isn't far away, carry on along the North side of the Guildhall to find it.",
    afterAnswerMessage: "Maps are essential for explorers and adventurers.",
    hintsRequested: 0,
    delayAfterClue: 2500, // Delay in milliseconds
    delayAfterAnswer: 6000
  },
  {
    clue: [
      "I've acquired this piece of paper with these symbols on. Maybe you'll be able to figure out what it means at the location marked on your map?",
      "https://i.ibb.co/d0Df0vC/cluechinese.png", // Image URL
      
    ],
    hint: "You'll find the answer in the sensory garden. Bear West as you sail towards the sea.",
    hint2: "Look outs: search for a pole bearing these same symbols. Maybe there'll be a helpful translation about.",
    answer: "may peace prevail on earth",
    mistakenAnswer: "may the world be filled with peace",
    mistakenAnswerResponse: "Very clever, but no cheating allowed! That's not it! Follow the map to find the answer!",
    explanation: "As you walk, you leave behind more footsteps.",
    afterClueMessage: "How am I gettin' this information you might ask. Let's just say the less you know the better.",
    afterAnswerMessage: "Peace! Ha! Whoever put up this pole obviously wasn't a pirate!",
    hintsRequested: 0,
    delayAfterClue: 6000, // Delay in milliseconds
    delayAfterAnswer: 6000
  },
  {
    clue: "Eternal flowers lay on my cheeks, though neither side's the same. Place your hands in mine, and tell me: What's my name?",
    hint: "Look down low. If you see nothing, an information board may help you find what you're looking for (It's directly in front of the sign).",
    hint2: "The order of the names on the information board correspond to their positions in the photo.",
    answer: ["john lennon","john","lennon"],
    mistakenAnswer: ["paul","mccartney","ringo","starr","george","harrison","beatle"],
    mistakenAnswerResponse: "Ah, ye be close, but you need to pick the right Beatle. The information board might help ye!",
    explanation: "A joke can be cracked, made, told, and played for amusement.",
    afterClueMessage: "Think of something light-hearted and humorous.",
    afterAnswerMessage: "Your next clue isn't far away now.",
    hintsRequested: 0,
    delayAfterClue: 3000, // Delay in milliseconds
    delayAfterAnswer: 6000
  },
  {
    clue: "A boulder hidden in the grass, a history once in doubt. Amongst Denmark, Sweden, Norway, Iceland, what's the odd one out?",
    hint: "Look for a rock in the grass. It might be hard to see if the grass is long.",
    hint2: "It's often shared among friends.",
    answer: "plymouth",
    mistakenAnswer: ["denmark","sweden","norway","iceland"],
    mistakenAnswerResponse: "That's a country on the stone for sure, but is there something else that stands out as different?",
    explanation: "A joke can be cracked, made, told, and played for amusement.",
    afterClueMessage: "Think of something light-hearted and humorous.",
    afterAnswerMessage: "Shiver me timbers, we've been misled! The answer to this clue confirms it. We're goin' the wrong way shipmates! Heave ho and lets get this ship turned around.",
    hintsRequested: 0,
    delayAfterClue: 3000, // Delay in milliseconds
    delayAfterAnswer: 6000
  },
  {
    clue: "Gaze out to sea, at all the places you might roam. What golden animal sits atop a dome?",
    hint: "If you're at the map location, look left.",
    hint2: "Here's a picture, what can you see?",
    answer: ["fish", "a fish"],
    mistakenAnswer: "gull",
    mistakenAnswerResponse: "Hmm, I'm sure they are atop the dome, the pesky sky rats! But they're not golden... Try again.",
    explanation: "A joke can be cracked, made, told, and played for amusement.",
    afterClueMessage: "Maybe ye've got the keen eyes o' hawks, but if not ye can always use the telescopes by the wall to help you. The views not half bad either.",
    afterAnswerMessage: "Aaah we're back on track thanks to you! Ye be a fine crew of scallywags",
    hintsRequested: 0,
    delayAfterClue: 3000, // Delay in milliseconds
    delayAfterAnswer: 6000
  },
  {
    clue: "A face and a goblet, three pears on a crest, a bird, cross and croissants, three lions, what comes next?",
    hint: "Look for sheilds on the Armada memorial. Maybe there'll be a sequence.",
    hint2: "On the sheild next to the three lions, what letter does the pattern look like? How many of them are there?",
    answer: ["three js", "3 js", "three j's", "3 j's", "three jays", "three jay's", "3 jays", "3 jay's"],
    mistakenAnswer: ["three","j","3","hook","jay"],
    mistakenAnswerResponse: "Close, what letter does the pattern look like? How many of them are there?",
    explanation: "A joke can be cracked, made, told, and played for amusement.",
    afterClueMessage: "This one could be tricky. My sources can't confirm the location of the answer, but three possible locations are marked on your map now. Ye better check them all.",
    afterAnswerMessage: "Aaah we're back on track thanks to you! Ye be a fine crew of scallywags",
    hintsRequested: 0,
    delayAfterClue: 3000, // Delay in milliseconds
    delayAfterAnswer: 6000
  },
  {
    clue: "Could a legendary emperor know the answer? Maybe. What comes between Dartmoor and The Royal Navy.",
    hint: "Check both plaques on the Napolean commemerative stone.",
    hint2: "What words do you see on the plaque with two flags, between 'Dartmoor' and 'The Royal Navy?'?",
    answer: ["the french navy","french navy"],
    mistakenAnswer: ["three","j","3","hook","jay"],
    mistakenAnswerResponse: "Close, what letter does the pattern look like? How many of them are there?",
    explanation: "A joke can be cracked, made, told, and played for amusement.",
    afterClueMessage: "This one could be tricky. My sources can't confirm the location of the answer, but three possible locations are marked on your map now. Ye better check them all.",
    afterAnswerMessage: "Aaah we're back on track thanks to you! Ye be a fine crew of scallywags",
    hintsRequested: 0,
    delayAfterClue: 3000, // Delay in milliseconds
    delayAfterAnswer: 6000
  },
  {
    clue: "18-pounder, forged in Carron. What identity number is marked on the cannon?",
    hint: "Inspect the 18-pounder! The information plaque can help you work out which it is.",
    hint2: "There is a number written above 'Carron' on the cannon to the right of the information plaque.",
    answer: ["78964","seven eight nine six four","seven, eight, nine, six, four"],
    mistakenAnswer: ["1819","eighteen nineteen","one eight one nine"],
    mistakenAnswerResponse: "That's the date the cannon was made. What other number do you see?",
    explanation: "These cannons were sunk into the ground and used as bollards before they were restored. See the grooves that ships' ropes have worn into the barrells. Crazy!",
    afterClueMessage: "This one could be tricky. My sources can't confirm the location of the answer, but three possible locations are marked on your map now. Ye better check them all.",
    afterAnswerMessage: "Aaah we're back on track thanks to you! Ye be a fine crew of scallywags",
    hintsRequested: 0,
    delayAfterClue: 3000, // Delay in milliseconds
    delayAfterAnswer: 6000
  },
  {
    clue: "Life was hard in days of old. What does the woman in the window hold?",
    hint: "Look up!",
    hint2: "On the sheild next to the three lions, what letter does the pattern look like? How many of them are there?",
    answer: ["pot","chamberpot","chamber pot","bowl","pan","bucket","toilet"],
    mistakenAnswer: ["slop","poo","brown"],
    mistakenAnswerResponse: "Eeew! Luckily for her that's not what's in her hand. Try again.",
    explanation: "It's a chamber pot. Course that's unnecessary on a ship. It all goes straight over the side. Much cleaner if you ask me.",
    afterClueMessage: "This one could be tricky. My sources can't confirm the location of the answer, but three possible locations are marked on your map now. Ye better check them all.",
    afterAnswerMessage: "Aaah we're back on track thanks to you! Ye be a fine crew of scallywags",
    hintsRequested: 0,
    delayAfterClue: 3000, // Delay in milliseconds
    delayAfterAnswer: 6000
  },
   {
    clue: "With Plymouth to stern, the Atlantic to starboard, what ship provides a companion for Charlotte?",
    hint: "Look for sheilds on the Armada memorial. Maybe there'll be a sequence.",
    hint2: "On the sheild next to the three lions, what letter does the pattern look like? How many of them are there?",
    answer: "friendship",
    mistakenAnswer: ["three","J","3","hook","jay"],
    mistakenAnswerResponse: "Close, what letter does the pattern look like? How many of them are there?",
    explanation: "A joke can be cracked, made, told, and played for amusement.",
    afterClueMessage: "This one could be tricky. My sources can't confirm the location of the answer, but three possible locations are marked on your map now. Ye better check them all.",
    afterAnswerMessage: "Aaah we're back on track thanks to you! Ye be a fine crew of scallywags",
    hintsRequested: 0,
    delayAfterClue: 3000, // Delay in milliseconds
    delayAfterAnswer: 6000
  },
  
  {
    clue: "The hill may be steep but our legs are trusty. When you reach the secret garden, tell me: Who is lusty?",
    hint: "Look for sheilds on the Armada memorial. Maybe there'll be a sequence.",
    hint2: "On the sheild next to the three lions, what letter does the pattern look like? How many of them are there?",
    answer: ["landlubbers", "land lubbers"],
    mistakenAnswer: ["three","J","3","hook"],
    mistakenAnswerResponse: "Close, what letter does the pattern look like? How many of them are there?",
    explanation: "A joke can be cracked, made, told, and played for amusement.",
    afterClueMessage: "This one could be tricky. My sources can't confirm the location of the answer, but three possible locations are marked on your map now. Ye better check them all.",
    afterAnswerMessage: "Aaah we're back on track thanks to you! Ye be a fine crew of scallywags",
    hintsRequested: 0,
    delayAfterClue: 3000, // Delay in milliseconds
    delayAfterAnswer: 6000
  }
];

const accessibleClues = [
  {
    index: 9, // This corresponds to the 9th clue in the normal flow
    clue: "On a fishy sheild, this answer will lie. What do explorers do? It's under the eye.",
    hint: "Look for sheilds on the Armada memorial. Maybe there'll be a sequence.",
    hint2: "On the sheild next to the three lions, what letter does the pattern look like? How many of them are there?",
    answer: "discover",
    mistakenAnswer: ["three","J","3","hook"],
    mistakenAnswerResponse: "Close, what letter does the pattern look like? How many of them are there?",
    explanation: "A joke can be cracked, made, told, and played for amusement.",
    afterClueMessage: "This one could be tricky. My sources can't confirm the location of the answer, but three possible locations are marked on your map now. Ye better check them all.",
    afterAnswerMessage: "Aaah we're back on track thanks to you! Ye be a fine crew of scallywags",
    hintsRequested: 0,
    delayAfterClue: 3000, // Delay in milliseconds
    delayAfterAnswer: 6000
  },
  {
    index: 10, // This corresponds to the 10th clue in the normal flow
    clue: "Accessible alternative clue for clue 10",
    answer: "accessible answer 10",
    hint: "accessible hint for clue 10",
    afterAnswerMessage: "Great job on the accessible version of clue 10!",
    delayAfterAnswer: 2000
  }
];



// Declare the pendingActions array globally
let pendingActions = JSON.parse(localStorage.getItem('pendingActions')) || [];
// Select the help button by its ID





// Function to add a pending action
function addPendingAction(action) {
  pendingActions.push(action);
  localStorage.setItem('pendingActions', JSON.stringify(pendingActions));

  // Log the current state of pendingActions
  console.log('Pending actions:', pendingActions);
}


function removePendingAction(action) {
  setTimeout(() => {
    // Find the index of the action in the pendingActions array
    const actionIndex = pendingActions.indexOf(action);

    // If the action is found, remove it from the array
    if (actionIndex !== -1) {
      pendingActions.splice(actionIndex, 1);
      localStorage.setItem('pendingActions', JSON.stringify(pendingActions));
    }

    console.log('Pending actions after removal:', pendingActions);
  }, 2000); // 2-second timeout
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
  'navyInstructions': navyInstructions,
  'navyReminder' : navyReminder,
  'afterClueMessage' : afterClueMessage,
  'clueReminder' : clueReminder,
  'giveHint': giveHint,
  'avoidCobbles': avoidCobbles,
  'instructions': instructions

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
  localStorage.setItem('navyReminderSent', navyReminderSent);
  localStorage.setItem('accessible', accessible);
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
  const savedAccessible = localStorage.getItem('accessible');
  const savedNavyReminderSent = localStorage.getItem('navyReminderSent');


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
  
   if (savedAccessible) {
    accessible = (savedAccessible === 'true');
  }
  
  if (savedNavyReminderSent) {
    navyReminderSent = (savedNavyReminderSent === 'true');
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
      displayMessage("Spit it out then shipmates!", "pirate", false, false, true);
    }, inactivityLimit);
  } else if (stage === 0.2) {
    // Set inactivityLimit to 5 minutes for stage 2
    inactivityLimit = 15000; // 5 minutes in milliseconds

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

// Function to show typing message
function showTypingMessage(sender) {
  const typingMessageDiv = document.getElementById('typingMessage');

  // Set the message based on the sender
  if (sender === 'pirate') {
    typingMessageDiv.textContent = 'Capt. I. Patch is typing...';
  } else if (sender === 'navy') {
    typingMessageDiv.textContent = 'Capt. Drake is typing...';
  }

  // Make the typing message visible
  typingMessageDiv.style.display = 'block';
}

// Function to hide typing message
function hideTypingMessage() {
  const typingMessageDiv = document.getElementById('typingMessage');

  // Hide the typing message
  typingMessageDiv.style.display = 'none';
}



function displayMessage(message, sender = currentPersonality, isClue = false, isImageOnly = false, isSmall = false) {
  const messageElement = document.createElement("div");

 let messageClass = `message ${sender}-message`;

  // Apply additional classes based on message properties
  if (isClue) {
    messageClass += ` clue`;
  }
  if (isImageOnly) {
    messageClass += ` isImageOnly`;
  }
  if (isSmall) {
    messageClass += ` isSmall`;
  }

  // Set the className for the messageElement
  messageElement.className = messageClass;

  const thumbnailElement = document.createElement("div");
  thumbnailElement.className = "thumbnail";

  const messageContentElement = document.createElement("div");
  messageContentElement.className = "message-content";

  const senderNameElement = document.createElement("div");
  senderNameElement.className = "sender-name";

  // Set the sender name based on the sender
  if (sender === "pirate") {
    senderNameElement.textContent = "Capt. I. Patch";
  } else if (sender === "navy") {
    senderNameElement.textContent = "Navy Bot";
  } else {
    senderNameElement.textContent = userName || "You";
  }

  const textElement = document.createElement("div");
  textElement.className = "text";
  textElement.innerHTML = message; // Use innerHTML to render HTML content

  // Group sender name and text together
  messageContentElement.appendChild(senderNameElement);
  messageContentElement.appendChild(textElement);

  // Add the thumbnail and the grouped message content to the message element
  messageElement.appendChild(thumbnailElement);
  messageElement.appendChild(messageContentElement);

  // Append the message element to the chat log with proper typing effect handling
  if (sender === "pirate" || sender === "navy") {
    showTypingMessage(sender);
    setTimeout(() => {
      chatLog.appendChild(messageElement);
      chatLog.scrollTop = chatLog.scrollHeight;
      hideTypingMessage();
      saveStateAndLog();
    }, 2000);
  } else {
    chatLog.appendChild(messageElement);
    chatLog.scrollTop = chatLog.scrollHeight;
    saveStateAndLog();
  }
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
  } else  {
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
  stage = 0.6;
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
  } else {
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
    addPendingAction ('readyMessage')
    removePendingAction('instructions');
    readyMessage();
    
   
  }, 9000);
}

function navyReminder() {
  if (navyStage === 2 && currentClueIndex > 5 && navyReminderSent === false) {
   addPendingAction ('navyReminder')
    setTimeout(() => {
      displayMessage("I hear whispers in the wind that you've confirmed the answer to your latest clue. Shout 'ahoy!' if you have some information for me.", "navy");
      navyReminderSent = true;
      removePendingAction('navyReminder');
    }, 15000); // 15-second delay
  }
}







function readyMessage() {
  stage = 1;
  navyReminder();
 if (sendNavyInstructions === true){
 return;
 }

  if (currentClueIndex > 0) {
    const message = currentClueIndex === clues.length - 1 ?
      "Are you ready for your final clue?" :
      "Are you ready for the next clue? If so say aye!";

    setTimeout(() => {
      displayMessage(message, "pirate", true, false, true);
      saveCheckpointState();
      removePendingAction('readyMessage');
    }, 6000); // 6-second delay if currentClueIndex > 0
  } else {
    setTimeout(() => {
      displayMessage("OK, that's it. Are you ready for your first clue?", "pirate", true);
      saveCheckpointState();
      removePendingAction('readyMessage');
    }, 2000); // 2-second delay if currentClueIndex = 0
  }
}



function giveClue() {
  let currentClue;

  if (accessible) {
    // Find the alternative clue that matches the currentClueIndex
    currentClue = accessibleClues.find(clue => clue.index === currentClueIndex);
  } else {
    // Use the normal clues array if Accessible is false
    currentClue = clues[currentClueIndex];
  }
  
  if (!currentClue) {
    currentClue = clues[currentClueIndex];
  }
  
  stage = 2;
  startInactivityTimer();
  resumeTimer();

  if (Array.isArray(currentClue.clue)) {
    // Loop through each element in the clue array
    currentClue.clue.forEach((cluePart, index) => {
      setTimeout(() => {
        if (cluePart.startsWith('http')) {
          // If the cluePart is a URL (likely an image), send an image message without background
          const imageMessage = `<img src="${cluePart}" alt="Clue Image" style="max-width: 100%; height: auto; margin-top: 10px;">`;
          displayMessage(imageMessage, "pirate", false, true, false); // Add true for imageOnly parameter
        } else {
          // Otherwise, treat it as text and display the message with background
          displayMessage(cluePart, "pirate", true);
        }
      }, index * 2000); // Add a 2-second delay for each item in the array
    });
  } else {
    // If the clue is not an array, just display it as a single text message
    displayMessage(`Here is your clue: ${currentClue.clue}`, "pirate", true);
  }

  
  removePendingAction('giveClue');
  

  // Add navyMessage logic if conditions are met
  if (currentClueIndex === 3 && stage >= 2 && navyStage === 0) {
    addPendingAction('navyMessage');
    setTimeout(() => {
      navyMessage();
    }, 20000); // 6-second delay for navyMessage
  }

  // Add navyMessage2 logic if conditions are met
  if (currentClueIndex === 8 && stage >= 2) {
    addPendingAction('navyMessage2');
    setTimeout(() => {
      navyMessage2();
      removePendingAction('navyMessage2');
    }, 12000); // 8-second delay for navyMessage2
  }
}


function afterClueMessage (){
const currentClue = clues[currentClueIndex];

displayMessage(currentClue.afterClueMessage, "pirate");
addPendingAction('giveClue');
removePendingAction('afterClueMessage');

setTimeout(() => {
    
    giveClue();
    
  }, currentClue.delayAfterClue);
  
  }


function checkAnswer(input) {
  // Determine the current clue to use based on the accessible state
  let clueToUse;

  if (accessible) {
    // Find the clue in accessibleClues that matches the current index
    clueToUse = accessibleClues.find(clue => clue.index === currentClueIndex);
  }

  // Fallback to the main clues array if no matching accessible clue is found
  if (!clueToUse) {
    clueToUse = clues[currentClueIndex];
  }

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
    "That be a fine try, but not quite right!",
    "Nay, that be not the answer. Give it another go!"
  ];

  // Ensure the clue's answers are treated as an array
  let answers = Array.isArray(clueToUse.answer) ? clueToUse.answer : [clueToUse.answer];

  // Correct answer check
  if (answers.some(answer => input.toLowerCase().trim() === answer.toLowerCase())) {
    const randomResponse = correctResponses[Math.floor(Math.random() * correctResponses.length)];
    stage = 0;
    stopInactivityTimer();
    pauseTimer();
    addPendingAction('clueMessages');

    setTimeout(() => {
      displayMessage(randomResponse, "pirate", false, false, true);
      clueMessages();
    }, 2000); // 2-second delay
    return; // Exit after handling the correct answer
  }

  // Partial correct answer (too many words)
  if (answers.some(answer => input.toLowerCase().includes(answer.toLowerCase()))) {
    const pirateCorrection = "Arrr, the right answer's in there! But yer answer be includin' too many words. Strip it down to the bones, matey, and try again!";
    displayMessage(pirateCorrection, "pirate");
    return; // Exit after handling the partial correct answer
  }

  // Hint request
  if (input.toLowerCase().includes("hint")) {
    giveHint();
    return; // Exit after handling the hint request
  }

  // Handle mistakenAnswer logic
  let mistakenAnswers = Array.isArray(clueToUse.mistakenAnswer) ? clueToUse.mistakenAnswer : [clueToUse.mistakenAnswer];
  if (mistakenAnswers.some(mistake => input.toLowerCase().includes(mistake.toLowerCase()))) {
    displayMessage(clueToUse.mistakenAnswerResponse, "pirate");

    setTimeout(() => {
      displayMessage("Type 'hint' if you need more information.", "pirate", false, false, true);
    }, 4000); // 4-second delay
    return; // Exit after handling the mistaken answer
  }

  // Incorrect response
  const randomIncorrectResponse = incorrectResponses[Math.floor(Math.random() * incorrectResponses.length)];
  displayMessage(randomIncorrectResponse, "pirate", false, false, true);

  // Add a 2-second delay before showing the reminder message
  if (incorrectAttempts === 0 || incorrectAttempts === 3) {
    setTimeout(() => {
      displayMessage("Remember, you can type 'hint' if you need more information, or 'map' to check you're in the right place.", "pirate");
    }, 2000); // 2-second delay
  }

  incorrectAttempts++; // Increment incorrect attempts
}


function avoidCobbles() {
  // Display the message about avoiding hills and cobbles
  
  displayMessage("For our next clue we're heading in to rougher waters. If ye would like to avoid hills and cobbles type 'change course' for an alternative route.", "pirate");
  addPendingAction('readyMessage');
  removePendingAction('avoidCobbles');
  setTimeout(() => {
   readyMessage();
  }, 4000); // 2-second delay

 

  
}







function clueMessages() {

  const currentClue = clues[currentClueIndex];

  

  // Logic for advancing to the next clue or ending the game
  if (currentClueIndex < clues.length - 1) {
    
    setTimeout(() => {

    displayMessage(currentClue.explanation, "pirate");
  

  }, 3000);

  setTimeout(() => {
  // Display the after answer message for the current clue
  displayMessage(currentClue.afterAnswerMessage, "pirate");

  // Check if currentClueIndex is not 8
  if (currentClueIndex !== 8) {
    addPendingAction('readyMessage');
    setTimeout(() => {
    readyMessage();
     }, 5000);
  } else {
    // If currentClueIndex is 8, add 'avoidCobbles' action and call avoidCobbles function
    addPendingAction('avoidCobbles');
    setTimeout(() => {
    avoidCobbles();
    }, 3000);
  }

  // Other logic remains the same for both cases
  removePendingAction('clueMessages');
  incorrectAttempts = 0;
  currentClueIndex++;

}, currentClue.delayAfterAnswer);

    
  } else {
    setTimeout(() => {

    displayMessage(currentClue.explanation, "pirate");

  }, 3000);

  setTimeout(() => {

    displayMessage(currentClue.afterAnswerMessage, "pirate");
    removePendingAction('clueMessages');

  }, currentClue.delayAfterAnswer);

    addPendingAction('congratulations');
    setTimeout(() => {
      congratulations(); // Display final congratulations message
    }, 6000); // 6-second delay before displaying the final message

  }

   saveStateAndLog();


}

function showCongratsBox(message) {
  const congratsBox = document.getElementById('congratsBox');
  const congratsMessageContent = document.getElementById('congratsMessage');

  // Update the content of the congratulatory box
  congratsMessageContent.innerHTML = message;

  // Show the box
  congratsBox.style.display = 'block';

  // Add event listener to close button
  document.getElementById('closeCongratsBox').addEventListener('click', () => {
    congratsBox.style.display = 'none';
  });
}



function congratulations() {
  stage = 3;
  navyStage = 6;
  const endTime = new Date().getTime(); // Get the current time as the end time

  // Calculate the total time excluding the paused time
  const totalElapsedTime = endTime - startTime - totalPausedTime;

  // Convert the total elapsed time from milliseconds to minutes and seconds
  const elapsedMinutes = Math.floor(totalElapsedTime / 60000); // Convert to minutes
  const elapsedSeconds = Math.floor((totalElapsedTime % 60000) / 1000); // Convert remaining milliseconds to seconds

  // Format the final time string
  const finalTime = `${elapsedMinutes} minute${elapsedMinutes !== 1 ? 's' : ''} and ${elapsedSeconds} second${elapsedSeconds !== 1 ? 's' : ''}`;

  let message;
  let congratsMessage;

  if (navySupported) {
    message = `Congratulations, you found the treasure, ${userName}! As a true member of the Queen's Navy, you have proven your loyalty and wit! Your final time was ${finalTime}.`;
    displayMessage(message, "navy");
    congratsMessage = message;

    // Delay before switching to Pirate personality and displaying the next message
    setTimeout(() => {
      message = `Scupper me kippers you betrayed me to the Navy!`;
      displayMessage(message, "pirate");
    }, 4000); // 4-second delay

  } else {
    message = `Ahoy, ${userName}! Ye found the treasure! Ye've got the cunning of a true pirate, and the spoils are yours! Yarrr! Your final time was ${finalTime}.`;
    displayMessage(message, "pirate", true);
    congratsMessage = message;

    // Delay before switching to Navy personality and displaying the next message
    setTimeout(() => {
      message = `Curses be upon you, ${userName}! The Navy shall never forgive you for this!`;
      displayMessage(message, "navy");
    }, 4000); // 4-second delay
  }

  // Show the congratulatory message in the new box
  showCongratsBox(congratsMessage);

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

  function displayHintContent(hint) {
    let hintContent = '';
    
    addPendingAction('giveHint');

    // Check if hint is an array and process each item
    if (Array.isArray(hint)) {
      hint.forEach(item => {
        if (item.startsWith('http')) {
          // If the item is a URL (likely an image), add an image tag
          hintContent = `<img src="${item}" alt="Hint Image" style="max-width: 100%; height: auto; margin-top: 10px;">`;
          displayMessage(hintContent, "pirate", false, true); // Display the image message
        } else {
          // Otherwise, add the text
          hintContent = `<p>${item}</p>`;
          displayMessage(hintContent, "pirate"); // Display the text message
        }
      });
    } else {
      // If hint is not an array, handle it as a single text
      hintContent = `<p>${hint}</p>`;
      displayMessage(hintContent, "pirate");
    }
  }

  if (currentClue.hintsRequested === 0) {
    displayMessage("Here's your hint:", "pirate", false, false, true);
    setTimeout(() => {
      displayHintContent(currentClue.hint); // Display the first hint
      currentClue.hintsRequested++;
      removePendingAction('giveHint');
    }, 1000);

  } else if (currentClue.hintsRequested === 1) {
    displayMessage("Sorry mateys, this is your last hint for this clue!", "pirate");
    addPendingAction('clueReminder')
    setTimeout(() => {
      displayHintContent(currentClue.hint2); // Display the second hint
      currentClue.hintsRequested++;
      
      removePendingAction('giveHint');
    }, 1500);
    setTimeout(() => {
      
      clueReminder();
      removePendingAction('clueReminder');
    }, 10000);

  } else {
    displayMessage("Sorry, I've no more info for you, but if you're really stuck you can find the answer to this clue in the 'Urgent Help' section. (Access this by typing 'help!')", "pirate");
    removePendingAction('giveHint');
  }
}





function openHelp() {
  document.getElementById('helpSection').classList.remove('hidden');
  userInput.disabled = true;
  sendBtn.disabled = true;
  pauseTimer();

  // Check if the global navyStage variable is >= 1
  if (navyStage >= 1) {
    document.querySelector('.navy-line').classList.remove('hidden');
  } else {
    document.querySelector('.navy-line').classList.add('hidden');
  }
}


function closeHelp() {
  document.getElementById('helpSection').classList.add('hidden');
  document.getElementById('helpLog').innerHTML = "";
  userInput.disabled = false;
  sendBtn.disabled = false;
  resumeTimer();

}

// Helper function to handle FAQ logic
function handleFAQClick(answerText) {
  const answerContainer = document.getElementById('answerContainer');
  answerContainer.innerHTML = ""; // Clear previous answer
  answerContainer.innerHTML += `<p>${answerText}</p>`; // Display the answer
  
  // Hide FAQ buttons
  document.querySelector('.FAQButtons').style.display = 'none';

  // Remove introductory text if it exists
  const introText = document.getElementById('introText');
  if (introText) introText.remove();

  // Adjust opacity
  document.querySelector('.help-box-bg').style.opacity = '0.5'; // Change opacity to 0.5

  // Add a back button to return to FAQs
  answerContainer.innerHTML += `<button id="backtoFAQs">Back to FAQs</button>`;

  // Add event listener to the new back button
  document.getElementById('backtoFAQs').addEventListener('click', () => {
    FAQs(); // Reload the FAQs
    document.querySelector('.help-box-bg').style.opacity = '0.8'; // Change opacity to 0.8
  });
}

function FAQs() {
  const helpLog = document.getElementById('helpLog');
  helpLog.innerHTML = ""; // Clear the helpLog initially
  bottomBox.style.display = 'none'; // Hide the bottom-box

  // Hide the other buttons and the introductory text
  document.querySelectorAll('.help-box button, .help-box p').forEach(button => {
    button.style.display = 'none';
  });

  // Add the introductory text and buttons for FAQs
  helpLog.innerHTML += `<p id="introText">If you can't find what you're looking for, check our website.</p>`;
  helpLog.innerHTML += `
        <div class="FAQButtons">
          <button id="FAQ1Btn">Are there toilets along the route?</button>
          <button id="FAQ2Btn">Is the route accessible?</button>
          <button id="FAQ3Btn">Do I need to bring anything?</button>
          <button id="FAQ4Btn">Is the route suitable for dogs?</button>
        
          <button id="FAQback">Back</button>
        </div>
    `;

  // Add a container for the answer text
  helpLog.innerHTML += `<div id="answerContainer"></div>`;

  // Attach event listeners to the FAQ buttons using the helper function
  document.getElementById('FAQ1Btn').addEventListener('click', () => {
    handleFAQClick(`Yes, there are several public toilets that will be marked on the map to your next clue. There's also plenty of pubs and cafes along the way where you can stop for refreshments and toilet breaks.`);
  });

  document.getElementById('FAQ2Btn').addEventListener('click', () => {
    handleFAQClick(`The route has some short hills and no steps. If you want to avoid the cobbles and hill later in the route the game will give you the option to select another route. Contact us if you would like to discuss the accessibility of the route further.`);
  });

  document.getElementById('FAQ3Btn').addEventListener('click', () => {
    handleFAQClick(`Just your smartphone or tablet with plenty of charge, and a willing crew! We recommend you have good shoes for walking, and make sure you're prepared for the weather!`);
  });

  document.getElementById('FAQ4Btn').addEventListener('click', () => {
    handleFAQClick(`Yes, bring your furry friends! We'll point out dog-friendly places to stop for refreshments on your map.`);
  });

  document.getElementById('FAQback').addEventListener('click', () => {
    // Clear the FAQ content
    helpLog.innerHTML = ""; // Clear the FAQ content
    bottomBox.style.display = 'block'; // Show the bottom-box again

    // Show the previously hidden buttons and text
    document.querySelectorAll('.help-box button, .help-box p').forEach(element => {
      element.style.display = ''; // Reset the display property to default
    });
  });
}


function changeName() {
  const helpLog = document.getElementById('helpLog');
  bottomBox.style.display = 'none'; // Hide the bottom-box

  // Clear the existing content in the helpLog
  helpLog.innerHTML = "";

  // Add the prompt and input box
  helpLog.innerHTML += `<p>Input new team name:</p>`;
  helpLog.innerHTML += `<input type="text" id="newNameInput" placeholder="Enter new team name">`;
  helpLog.innerHTML += `<button id="submitNewNameBtn">Submit</button>`;
  helpLog.innerHTML += `<div id="errorMessage"></div>`; // Add a div for error messages

  // Get the newly added elements
  const newNameInput = document.getElementById('newNameInput');
  const submitNewNameBtn = document.getElementById('submitNewNameBtn');
  const errorMessage = document.getElementById('errorMessage'); // Error message element

  // Function to handle the name change
  function handleNameChange() {
    const newName = newNameInput.value.trim();

    if (newName) {
      userName = newName; // Update the userName variable
      saveStateAndLog();
      helpLog.innerHTML = ""; // Clear the helpLog content
      helpLog.innerHTML += `<p>Team name has been changed to "${userName}".</p>`; // Display a confirmation message
    } else {
      // Update the error message without clearing the input and button
      errorMessage.innerHTML = `<p>Please enter a valid team name.</p>`;
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
  bottomBox.style.display = 'none'; // Hide the bottom-box

  // Clear the existing content in the help log
  helpLog.innerHTML = "";

  // Add the new message, reset button, and show answer button
  helpLog.innerHTML += `<p id="revealText">If you're really stuck, press the button below to reveal your answer.</p>`;
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
  const revealText = document.getElementById('revealText'); // Get the "revealText" paragraph

  // Check if there is a current clue
  if (currentClue && stage === 2) {
    // Insert the answer directly after the showAnswerBtn
    showAnswerBtn.insertAdjacentHTML('afterend', `<p>The answer to the current clue is <strong>"${currentClue.answer}"</strong>.</p>`);
  } else {
    // Insert the "No clue" message directly after the showAnswerBtn
    showAnswerBtn.insertAdjacentHTML('afterend', `<p>No clue is currently available.</p>`);
  }

  // Hide the Show Answer button and the "If you're really stuck..." text
  showAnswerBtn.style.display = 'none';
  revealText.style.display = 'none';
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
    // Define pirate responses for navyStage <= 2
    if (navyStage <= 2) {
      const pirateResponses = [
        'That was the Navy I heard. Don’t trust them!',
        'I heard the Navy approaching. Make sure they don’t get wind of what we’re doing!',
        'I caught a glimpse of the Navy. They may try to contact you, be careful!',
        'The Navy is lurking nearby. Don’t let them know our plans!'
      ];

      // Randomly select a response
      const randomResponse = pirateResponses[Math.floor(Math.random() * pirateResponses.length)];

      // Set a 1-second timeout before displaying the message
      setTimeout(() => {
        displayMessage(randomResponse, "pirate");
      }, 1000); // 1-second delay
    }

    // Define pirate responses for navyStage == 3
    if (navyStage === 3) {
      // If navySupported is true
      if (navySupported) {
        const closeNavyResponses = [
          'My sources tell me the Navy is very close. Lie low!',
          'It appears the Navy knows what we’re up to. They lurk in these waters!',
          'The Navy is too close for comfort. I suspect we may have been betrated. Stay hidden, matey!'
        ];

        // Randomly select a response
        const randomResponse = closeNavyResponses[Math.floor(Math.random() * closeNavyResponses.length)];

        // Set a 1-second timeout before displaying the message
        setTimeout(() => {
          displayMessage(randomResponse, "pirate");
        }, 1000); // 1-second delay
      } else {
        // If navySupported is false
        const farNavyResponses = [
          'That was close. I thought I saw the Navy, but sources tell me they’re sailing away.',
          'The Navy passed by, but they’re heading in the other direction. We’re in the clear for now.',
          'I spotted the Navy, but they seem to be moving away. Keep your wits about you!'
        ];

        // Randomly select a response
        const randomResponse = farNavyResponses[Math.floor(Math.random() * farNavyResponses.length)];

        // Set a 1-second timeout before displaying the message
        setTimeout(() => {
          displayMessage(randomResponse, "pirate");
        }, 1000); // 1-second delay
      }
    }

    // Set a 3-second timeout for the isPaused logic
    setTimeout(() => {
      // Check if the game is paused
      if (stage === 1) {
        // If paused, display the reminder message
        displayMessage("Remember to say 'aye' when you're ready for your next clue", "pirate", true, false, true);
      }
      if (navyStage > 3) {
        // If paused, display the reminder message
        clueReminder();
      }
    }, 6000); // 3-second delay for paused message
  }
}



let lastHappyResponse = ""; // Variable to store the last happy response
let lastDoubtfulResponse = ""; // Variable to store the last doubtful response

function callNavy() {
  const navyLog = document.getElementById('navyLog');
  navyLog.innerHTML = ""; // Clear the navy log

  // Check if navyStage is 1
  if (navyStage === 1 || navyStage === 2) {
    // If currentClueIndex < 2, display a message without buttons
    if (currentClueIndex < 2) {
      navyLog.innerHTML += `<p>Check your answer to this clue with the pirates then come back to me, fine officers.</p>`;
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
  } else if (navyStage === 3) {
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
  } else if (navyStage === 4) {
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
  } else if (navyStage === 5) {
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
    navyStage = 5;
    navySupported = false;
    saveStateAndLog();
    navyLog.innerHTML = '';
    navyLog.innerHTML += `<p>Fool! The fury of the Navy will rain down upon you</p>`;

  } else if (choice === 'pirates') {
    navyStage = 5;
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
  navyStage = 3;
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

  displayMessage("Attention! You are being hailed by Admiral Frankie Drake of the King's Navy. Best be on guard. Pirates roam these waters.", "navy");

  setTimeout(() => {
    displayMessage("The King will pay a high price to any who report on the whereabouts of pirates, or the treasure they are rumoured to be searching for. You wouldn't happen to know anything about that would you?", "navy");
    removePendingAction('navyMessage');
   
  }, 6000);



}










function navyMessage2() {
  // Update navyStage to 3
  navyStage = 4;
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

function navyInstructions() {
  // Display the first message
setTimeout(() => {
  displayMessage("Here's the deal: When you get the answer to your next clue, tell me what it is, and the King's Navy will forever be in your debt.", "navy");
  }, 3500);

  // Set a timeout to display the second message after 3 seconds
  setTimeout(() => {
    displayMessage("You can speak to me anytime by shouting 'ahoy!'", "navy");
    
    addPendingAction('clueReminder')
    
    
  
  }, 8000); // 3000 milliseconds = 3 seconds
  
    setTimeout(() => {
    displayMessage("I could have sworn I saw a Navy ship approaching, keep your eyes peeled for mischief from those filthy deck rats.","pirate", false, false, true)
    removePendingAction('navyInstructions')
    clueReminder();
    if (sendNavyInstructions === true) { 
    sendNavyInstructions = false;
    setTimeout(() => {
    readyMessage();
    
     }, 1);
 
    }
    
    
  }, 12000); // 3000 milliseconds = 3 seconds
}

function clueReminder() {
  // Check if the stage is 2
  if (stage === 2) {
    // Access the current clue from the clues array
    const currentClue = clues[currentClueIndex];

    // Display the reminder message with the introductory text
    if (Array.isArray(currentClue.clue)) {
      // Display reminder text before clue parts
      displayMessage(`Remember your current clue is:`, "pirate", true, false, true);
      setTimeout(() => {
        // Loop through each element in the clue array
        currentClue.clue.forEach((cluePart, index) => {
          setTimeout(() => {
            if (cluePart.startsWith('http')) {
              // If cluePart is an image URL
              const imageMessage = `<img src="${cluePart}" alt="Clue Image" style="max-width: 100%; height: auto; margin-top: 10px;">`;
              displayMessage(imageMessage, "pirate", false, true); // isImageOnly true
            } else {
              // If cluePart is text
              displayMessage(cluePart, "pirate", true, false); // isClue and isSmall true
            }
          }, index * 2000);
        });

        // Remove the pending action after all clue parts are displayed
        setTimeout(() => {
          removePendingAction('clueReminder');
        }, currentClue.clue.length * 2000 + 3000); // Adjust timing to ensure all clue parts are shown

      }, 3000); // Initial delay before displaying the clue
    } else {
      // If the clue is a single text or image
      if (currentClue.clue.startsWith('http')) {
        // If clue is an image URL
        const imageMessage = `<img src="${currentClue.clue}" alt="Clue Image" style="max-width: 100%; height: auto; margin-top: 10px;">`;
        displayMessage(imageMessage, "pirate", false, true); // isImageOnly true
      } else {
        // If clue is text
        displayMessage(`Remember your current clue is: "${currentClue.clue}"`, "pirate", true);
      }

      // Remove the pending action after displaying the clue
      removePendingAction('clueReminder');
    }

    // Define pirate responses for the second message
    const pirateResponses = [
      'If they happen to contact you, not a word to the Navy!',
      'Remember, keep it quiet. This treasure is ours!',
      'Keep your lips sealed, or the Navy will be on us in no time!'
    ];

    // Randomly select a pirate response
    const randomResponse = pirateResponses[Math.floor(Math.random() * pirateResponses.length)];

    // Set a 4-second timeout before displaying the second message
    setTimeout(() => {
      displayMessage(randomResponse, "pirate", false, false, true); // isSmall true
      removePendingAction('clueReminder');
    }, 4000); // 4-second delay

  } else {
    // If stage is not 2, remove the pending action
    removePendingAction('clueReminder');
  }
}


function saveCheckpointState() {
  // Add a 2-second delay before saving the checkpoint state
  setTimeout(() => {
    // Use the currentClueIndex as the key for each checkpoint
    const checkpointKey = `checkpoint_clue_${currentClueIndex}`;

    // Save the current state into a special checkpoint in localStorage
    const chatbotState = {
      chatLog: document.getElementById('chatLog').innerHTML,
      stage: stage,
      navyStage: navyStage,
      currentClueIndex: currentClueIndex,
      userName: userName,
      navySupported: navySupported,
      totalPausedTime: totalPausedTime,
      pauseStartTime: pauseStartTime,
      navyReminderSent: navyReminderSent,
      accessible: accessible,
      hintsRequested: clues[currentClueIndex].hintsRequested
    };

    // Save the checkpoint state as a JSON string in local storage
    localStorage.setItem(checkpointKey, JSON.stringify(chatbotState));
    console.log(`Checkpoint saved for clue ${currentClueIndex}`);
  }, 2000); // 2-second delay
}


function recallCheckpoint(clueIndex) {
  const checkpointKey = `checkpoint_clue_${clueIndex}`;

  // Get the saved checkpoint from local storage
  const savedState = localStorage.getItem(checkpointKey);

  if (savedState) {
    // Parse the saved JSON string back to an object
    const chatbotState = JSON.parse(savedState);
    pendingActions.length = 0; // This empties the array

    // Update localStorage to reflect the cleared pending actions
    localStorage.setItem('pendingActions', JSON.stringify(pendingActions));

    // Restore the chatbot state from the saved data
    document.getElementById('chatLog').innerHTML = chatbotState.chatLog;
    stage = chatbotState.stage;
    navyStage = chatbotState.navyStage;
    currentClueIndex = chatbotState.currentClueIndex;
    userName = chatbotState.userName;
    navySupported = chatbotState.navySupported;
    totalPausedTime = chatbotState.totalPausedTime;
    pauseStartTime = chatbotState.pauseStartTime;
    navyReminderSent = chatbotState.navyReminderSent;
    accessible = chatbotState.accessible;
    clues[currentClueIndex].hintsRequested = chatbotState.hintsRequested;

    console.log(`Restored chatbot state from clue ${clueIndex}`);
  } else {
    console.log(`No saved checkpoint found for clue ${clueIndex}`);
  }
}





// Add an event listener for the 'click' event
helpButton.addEventListener('click', function() {
  // Call the openHelp function when the button is clicked
  openHelp();
});


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

    userInput.value = ""; // Clear the input field
    navyStage--;
    readyMessage();
    return; // Exit the function to prevent further processing
  }

  if (input.toLowerCase() === "resetcoderet2") {

    userInput.value = ""; // Clear the input field
    currentClueIndex--;
    navyStage = 0;

    readyMessage();
    return; // Exit the function to prevent further processing
  }
  
  if (input.startsWith('resetcodeclue')) {
    // Extract the clue index from the input, e.g., "resetcodeclue0" -> 0
    const clueIndex = parseInt(input.replace('resetcodeclue', ''), 10);

    if (!isNaN(clueIndex)) {
      // Call the recallCheckpoint function with the extracted clue index
      recallCheckpoint(clueIndex);

      userInput.value = ""; // Clear the input field
      return; // Exit the function to prevent further processing
    }
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
  
  if (input.toLowerCase().includes("change course") && currentClueIndex >= 8) {
    displayMessage(input, "user");
    accessible = true;
    userInput.value = "";
    addPendingAction('readyMessage')
    displayMessage("Our course has been altered. Smooth sailing ahead!", "pirate", false, false, true); // isSmall true
    
    if (stage === 1) {
    setTimeout(() => {
 
        // If paused, display the reminder message
        displayMessage("Remember to say 'aye' when you're ready for your next clue", "pirate", true, false, true);  }, 6000);
        
        }
    
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

  if (navyStage === 1 && stage !== 1 && !input.toLowerCase().includes('help') && !input.toLowerCase().includes('map')) {
    if (input.includes('yes') || input.includes('aye') || input.includes('maybe') || input.includes('perhaps') || input.includes('might')) {
      displayMessage(input, "user");
      displayMessage('Excellent, we shall be able to help each other', 'navy');
      addPendingAction('navyInstructions')
      navyInstructions();
      navyStage = 2; // Update navyStage to 2
    } else if (input.includes('no') || input.includes('not') || input.includes('fuck')|| input.includes('go away')) {
      displayMessage(input, "user");
      displayMessage('Curse you!, I know you are helping the pirates!', 'navy');
      navyStage = 2; // Update navyStage to 2
      addPendingAction('navyInstructions');
      navyInstructions();
    } else {
      displayMessage(input, "user");
      navyStage = 2;
      sendNavyInstructions = true;
      addPendingAction('navyInstructions')
      checkAnswer(input); // Call the function if input doesn't match special cases
      setTimeout(() => {
        displayMessage('Do not ignore an Admiral of the Navy!', 'navy');
        
        
        navyInstructions();
      }, 12000);

    }
    userInput.value = ""; // Clear the input field
    return; // Exit the function to prevent further processing
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

      addPendingAction('afterClueMessage');
      setTimeout(() => {
        afterClueMessage();
   
      }, 3000); // 3-second delay for giveClue

    } else if (input.toLowerCase().includes("yes")) {
      displayMessage("Be more pirate! Say 'aye'!", "pirate", false, false, true);
    } else {
      displayMessage("I'll wait until you say 'aye'.", "pirate", false, false, true);
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

 piratePasswordInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      pirateSendBtn.click();
    }
  });


document.getElementById('pirateSendBtn').addEventListener('click', function() {
  var passwordInput = document.getElementById('piratePasswordInput').value;
  var correctPassword = "blackbeard"; // You can set your desired password here
  var errorMessage = document.getElementById('passwordError');

  if (passwordInput === correctPassword) {
    // Hide the pirate story box
    document.getElementById('pirateStoryBox').classList.add('hidden');
    errorMessage.textContent = ''; // Clear any previous error messages
    // Start the pirate intro
    disclaimerBox.classList.remove('hidden');
    
  } else {
    // Display error message
    errorMessage.textContent = 'Incorrect password. Please try again.';
  }
});

confirmDisclaimerBtn.addEventListener('click', () => {
    // Hide the disclaimer box and start the pirate intro
    disclaimerBox.classList.add('hidden');
    pirateIntro();
  });

startBtn.addEventListener("click", () => {
  document.getElementById("initialContainer").style.display = "none";
  startBtn.style.display = "none";
  startMapBtn.style.display = "none";
  userInput.disabled = false;
  sendBtn.disabled = false;



 document.getElementById('pirateStoryBox').classList.remove('hidden');
});

