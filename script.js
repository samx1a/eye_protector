// =========================
// STATE
// =========================

// TODO: variable to track current mode: "work" or "break"
let mode = "work"; // can be work or braek
let timeLeft = 1200; 
let timerId; 
// TODO: variable to store the interval ID returned by setInterval()
// let timerId = ...
timerId = setInterval(() => {
    timeLeft -= 1
}, 1000); 

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
    
    if (seconds < 10): // only 1 digit so need to add 0 to front
        seconds = "0" + seconds; 
    
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
    // TODO:
    if (mode === "work") {
        mode = "break";
        timeLeft = BREAK_DURATION; 
        showBreakPopup()
        // how to restart timer 
    } else {
        mode = "work"; 
        timeLeft = WORK_DURATION; 
        hideBreakPopup()
    }
}


// =========================
// START THE INTERVAL LOOP
// =========================

// This function should:
// 1. clear any existing interval (clearInterval(...))
// 2. immediately update the screen so UI matches current timeLeft
// 3. start a new setInterval that runs every 1000ms (1s):
//    - subtract 1 from timeLeft
//    - update the screen
//    - if timeLeft <= 0:
//        - stop the interval
//        - call switchMode()
function startTimerLoop() {
    // TODO:
    // clear old interval
    // updateCountdownDisplay() once at the start
    // create new interval:
    //   inside it:
    //     timeLeft -= 1
    //     updateCountdownDisplay()
    //     if timeLeft <= 0:
    //         clearInterval(...)
    //         switchMode()
    //
    // store the interval id in timerId
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
    // TODO:
    // get the button element by id="toggle-btn"
    // if we're not running:
    //   set isRunning
    //   set button text
    //   set mode and timeLeft
    //   hideBreakPopup()
    //   startTimerLoop()
    // else (we are running):
    //   set isRunning false
    //   set button text
    //   clearInterval(timerId)
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
    // TODO:
    // 1. get the button element
    // 2. addEventListener("click", toggleStartStop)
    // 3. set isRunning = false
    // 4. set button text to "Start"
    // 5. set mode = "work"
    // 6. set timeLeft = WORK_DURATION
    // 7. hideBreakPopup()
    // 8. updateCountdownDisplay()
});
