// =========================
// STATE
// =========================

// TODO: variable to track current mode: "work" or "break"
let mode = "work"; // can be work or braek
let timeLeft; 
let timerId; 

// TODO: variable to track if the timer is currently running or not
// let isRunning = ...
let isRunning = false; 


// =========================
// CONSTANTS
// =========================
const WORK_DURATION = 20 * 60; 
const BREAK_DURATION = 20; 


// =========================
// FORMAT TIME (MM:SS)
// =========================

function formatTime(totalSeconds) {
    let minutes = Math.floor(totalSeconds / 60); 
    let seconds = totalSeconds % 60; 
    let res;
    
    if (seconds < 10) { // only 1 digit so need to add 0 to front
        seconds = "0" + seconds; 
    }
    return `${minutes}:${seconds}`; 
}


// =========================
// UPDATE SCREEN
// =========================

// This should update the visible text in the HTML
// - If mode is "work": update the element with id="work-timer"
//   with the formatted MM:SS version of timeLeft
// - If mode is "break": update the element with id="break-timer"
//   with just the raw number of seconds left (timeLeft)
function updateCountdownDisplay() {
    if (mode === "work") {
        // get curr time, format time, display that time
        const workEl = document.getElementById("work-timer"); 
        const formatted = formatTime(timeLeft);
        workEl.textContent = formatted; 
    } else {
        // mode is equal to break
        const breakEl = document.getElementById("break-timer"); 
        breakEl.textContent = timeLeft;
    }
}


// =========================
// SHOW / HIDE SECTIONS
// =========================

// During work mode:
// - work-container should be visible
// - break-popup should be hidden
//
// During break mode:
// - break-popup should be visible
// - work-container should be hidden

function showBreakPopup() {
    // get break-popup element
    const breakPopup = document.getElementById("break-popup"); 
    const workContainer = document.getElementById("work-container"); 

    // show break popup
    breakPopup.style.display = "block"; 

    // hide work container
    workContainer.style.display = "none"; 
}

function hideBreakPopup() {
    const breakPopup = document.getElementById("break-popup"); 
    const workContainer = document.getElementById("work-container"); 
    
    // want to do opposite here of above
    breakPopup.style.display = "none"; 
    workContainer.style.display = "block"
}


// =========================
// SWITCH MODES
// =========================

// This runs when a phase finishes.
// If we just finished work:
// - switch mode to "break"
// - set timeLeft to BREAK_DURATION
// - showBreakPopup()
// - restart the timer loop
//
// If we just finished break:
// - switch mode to "work"
// - set timeLeft to WORK_DURATION
// - hideBreakPopup()
// - restart the timer loop
function switchMode() {
    if (mode === "work") {
        mode = "break";
        timeLeft = BREAK_DURATION; 
        showBreakPopup();
        // how to restart timer 
    } else {
        mode = "work"; 
        timeLeft = WORK_DURATION; 
        hideBreakPopup();
    }
    startTimerLoop();
}



// =========================
// START THE INTERVAL LOOP
// =========================

// This function should:
// 1. clear any existing interval (clearInterval(...)) check 
// 2. immediately update the screen so UI matches current timeLeft check 
// 3. start a new setInterval that runs every 1000ms (1s):
//    - subtract 1 from timeLeft
//    - update the screen
//    - if timeLeft <= 0:
//        - stop the interval
//        - call switchMode()
function startTimerLoop() {
    // TODO:
    // clear old interval
    clearInterval(timerId); 
    updateCountdownDisplay();

    timerId = setInterval(() => {
        timeLeft -= 1;
        updateCountdownDisplay();
        
        if (timeLeft <= 0) {
            clearInterval(timerId); 
            switchMode(); 
        }


    }, 1000); 
}


// =========================
// START / STOP BUTTON
// =========================

// This function runs when the user clicks the Start/Stop button.
//
// If we are currently NOT running:
// - mark isRunning = true
// - change button textContent to "Stop"
// - initialize mode to "work"
// - set timeLeft = WORK_DURATION
// - make sure break popup is hidden (because we're working now)
// - startTimerLoop()
//
// If we ARE running:
// - mark isRunning = false
// - change button textContent to "Start"
// - clearInterval(timerId) so it stops counting down
function toggleStartStop() {
    let btn = document.getElementById("toggle-btn"); 

    if (!isRunning) {
        isRunning = true; 
        btn.textContent = "stop"; 

        mode = "work";
        timeLeft = WORK_DURATION; 
        hideBreakPopup();

        startTimerLoop();
    } else {
        isRunning = false; 
        btn.textContent = "start"; 
        clearInterval(timerId); 
    }
}


// =========================
// INITIALIZE WHEN PAGE LOADS
// =========================

// This waits until the HTML is ready, then:
// - grabs the Start/Stop button and attaches the click handler
// - sets isRunning = false
// - sets the button text to "Start"
// - sets mode = "work"
// - sets timeLeft = WORK_DURATION initially
// - makes sure break popup is hidden
// - calls updateCountdownDisplay() once so UI shows correct starting time
window.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("toggle-btn"); 

    btn.addEventListener("click", toggleStartStop); 

    isRunning = false; 

    btn.textContent = "start"; 

    mode = "work"; 

    timeLeft = WORK_DURATION; 

    hideBreakPopup(); 

    updateCountdownDisplay(); 
});
