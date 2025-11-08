// =========================
// STATE
// =========================

let mode = "work"; // can be work or break
let timeLeft;
let timerId;
let isRunning = false;
let startTime = null;
let duration = WORK_DURATION;


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
    const remaining = calculateTimeLeft();
    if (mode === "work") {
        const workEl = document.getElementById("work-timer");
        const formatted = formatTime(remaining);
        workEl.textContent = formatted;
    } else {
        const breakEl = document.getElementById("break-timer");
        breakEl.textContent = remaining;
    }
}

function calculateTimeLeft() {
    const baseDuration = duration ?? (mode === "work" ? WORK_DURATION : BREAK_DURATION);
    if (isRunning && startTime) {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        return Math.max(0, baseDuration - elapsed);
    }
    if (typeof timeLeft === "number") {
        return Math.max(0, timeLeft);
    }
    return baseDuration;
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

// Mode switching is now handled by background.js
// This function is kept for compatibility but background handles it
function switchMode() {
    // Background service worker handles mode switching
    // Just refresh state from background
    getStateFromBackground().then(state => {
        mode = state.mode;
        timeLeft = state.timeLeft;
        updateUIForMode();
        startTimerLoop();
    });
}



// =========================
// START THE INTERVAL LOOP
// =========================

// This function syncs with background timer and updates UI
// The actual timer runs in background.js, this just displays it
function startTimerLoop() {
    clearInterval(timerId);
    updateCountdownDisplay();

    timerId = setInterval(async () => {
        updateCountdownDisplay();

        const state = await getStateFromBackground();
        applyState(state);
        updateUIForMode();
        updateCountdownDisplay();

        if (!isRunning) {
            clearInterval(timerId);
        }
    }, 1000);
}

// Get current state from background service worker
async function getStateFromBackground() {
    return new Promise((resolve) => {
        chrome.runtime.sendMessage({ action: 'getState' }, (response) => {
            if (chrome.runtime.lastError) {
                resolve({ isRunning: false, mode: 'work', timeLeft: WORK_DURATION });
            } else {
                resolve(response || { isRunning: false, mode: 'work', timeLeft: WORK_DURATION });
            }
        });
    });
}

function updateUIForMode() {
    if (mode === 'break') {
        showBreakPopup();
    } else {
        hideBreakPopup();
    }
}

function applyState(state) {
    if (!state) {
        return;
    }

    isRunning = state.isRunning || false;
    mode = state.mode || 'work';
    timeLeft = state.timeLeft ?? (mode === 'work' ? WORK_DURATION : BREAK_DURATION);
    startTime = state.startTime || null;
    duration = state.duration ?? (mode === 'work' ? WORK_DURATION : BREAK_DURATION);
}


// =========================
// START / STOP BUTTON
// =========================

async function toggleStartStop() {
    let btn = document.getElementById("toggle-btn"); 

    if (!isRunning) {
        // Start timer in background
        chrome.runtime.sendMessage({ action: 'start' }, (response) => {
            if (response && response.success) {
                isRunning = true;
                btn.textContent = "Stop";
                mode = "work";
                timeLeft = WORK_DURATION;
                startTime = Date.now();
                duration = WORK_DURATION;
                hideBreakPopup();
                startTimerLoop();
                window.close();
            }
        });
    } else {
        // Stop timer in background
        chrome.runtime.sendMessage({ action: 'stop' }, (response) => {
            if (response && response.success) {
                isRunning = false;
                btn.textContent = "Start";
                clearInterval(timerId);
                mode = "work";
                timeLeft = WORK_DURATION;
                startTime = null;
                duration = WORK_DURATION;
                hideBreakPopup();
                updateCountdownDisplay();
            }
        });
    }
}


// =========================
// INITIALIZE WHEN PAGE LOADS
// =========================

window.addEventListener("DOMContentLoaded", async () => {
    const btn = document.getElementById("toggle-btn"); 
    btn.addEventListener("click", toggleStartStop); 

    // Load state from background service worker
    const state = await getStateFromBackground();
    
    applyState(state);
    
    // Update button
    btn.textContent = isRunning ? "Stop" : "Start";
    
    // Update UI based on mode
    if (mode === "break") {
        showBreakPopup();
    } else {
        hideBreakPopup();
    }
    
    // Update display
    updateCountdownDisplay();
    
    // If timer is running, start the sync loop
    if (isRunning) {
        startTimerLoop();
    }
});
