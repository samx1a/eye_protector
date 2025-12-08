const button = document.getElementById("onButton"); 
const resetButton = document.getElementById("reset"); 
const timeDisplay = document.getElementById("time"); 

let isPaused = false; 

// timer state
let seconds = 1200; 
let timerId = null; // null means timer not running

function formatTime(totalSeconds) {
    const mins = Math.floor(totalSeconds / 60); 
    const secs = totalSeconds % 60; 

    // padSTart
    const minsStr = String(mins).padStart(2, "0"); 
    const secsStr = String(secs).padStart(2, "0"); 

    return `${minsStr}:${secsStr}`; 
} 

// update DOM with current time
function updateDisplay() {
    timeDisplay.textContent = formatTime(seconds); 
}

function tick() {
    if (seconds > 0) {
        seconds -= 1;
        updateDisplay(); 
    }

    // if hit 0 stop 
    if (seconds === 0) {
        playBeep(); 
        clearInterval(timerId); 
        timerId = null; 
        isPaused = false;
        seconds = 1200;        // or whatever default
        updateDisplay();
        button.textContent = "start";
    }
}


// MAIN BUTTON LOGIC → Start, Pause, Resume
button.addEventListener("click", () => {
  // If timer has never run OR after reset
  if (timerId === null && !isPaused) {
    timerId = setInterval(tick, 1000);
    button.textContent = "pause";
  }
  // If timer is running → pause it
  else if (timerId !== null) {
    clearInterval(timerId);
    timerId = null;
    isPaused = true;
    button.textContent = "resume";
  }
  // If paused → resume it
  else if (timerId === null && isPaused) {
    timerId = setInterval(tick, 1000);
    button.textContent = "pause";
  }
});

// RESET LOGIC
resetButton.addEventListener("click", () => {
  if (timerId !== null) {
    clearInterval(timerId);
  }

  seconds = 1200;
  updateDisplay();
  timerId = null;
  isPaused = false;
  button.textContent = "start";
});

function playBeep() {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)(); 
    const oscillator = audioCtx.createOscillator(); 
    oscillator.frequency.value = 800; 
    oscillator.connect(audioCtx.destination); 
    oscillator.start(); 

    setTimeout(() => {
        oscillator.stop(); 
    }, 300); // beep length (300 ms)
}

updateDisplay(); 