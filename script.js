// =========================
// STATE
// =========================

// TODO: variable to track current mode: "work" or "break"
// let mode = ...

// TODO: variable to track how many seconds are left in the current phase
// let timeLeft = ...

// TODO: variable to store the interval ID returned by setInterval()
// let timerId = ...

// TODO: variable to track if the timer is currently running or not
// let isRunning = ...


// =========================
// CONSTANTS
// =========================

// TODO: how long is a work session, in seconds?
// For testing, make it small like 20 seconds.
// Later you can make it 20 * 60 for 20 minutes.
// const WORK_DURATION = ...

// TODO: how long is a break session, in seconds?
// const BREAK_DURATION = ...


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
    // TODO:
    // 1. check current mode
    // 2. get the correct DOM element with document.getElementById(...)
    // 3. set its .textContent to the right thing
    //    (formatTime(...) vs just timeLeft)
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
    // TODO:
    // get break-popup element
    // get work-container element
    // set break-popup.style.display = "block"
    // set work-container.style.display = "none"
}

function hideBreakPopup() {
    // TODO:
    // reverse of showBreakPopup
    // break-popup => "none"
    // work-container => "block"
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
    // use if (mode === "work") { ... } else { ... }
    // update mode
    // reset timeLeft
    // show/hide correct popup
    // call startTimerLoop()
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
