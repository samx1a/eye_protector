let mode = "work";
let timeLeft = 0;
let timerId = null;
let isRunning = false;

const WORK_DURATION = 20;
const BREAK_DURATION = 20;

function formatTime(totalSeconds) {
    const minsLeft = Math.floor(totalSeconds / 60);
    const secsLeft = totalSeconds % 60;
    const paddedSecs = secsLeft < 10 ? "0" + secsLeft : secsLeft;
    return minsLeft + ":" + paddedSecs;
}

function updateCountdownDisplay() {
    if (mode === "work") {
        const workEl = document.getElementById("work-timer");
        workEl.textContent = formatTime(timeLeft);
    } else if (mode === "break") {
        const breakEl = document.getElementById("break-timer");
        breakEl.textContent = timeLeft;
    }
}

function showBreakPopup() {
    const breakPopup = document.getElementById("break-popup");
    const workContainer = document.getElementById("work-container");
    breakPopup.style.display = "block";
    workContainer.style.display = "none";
}

function hideBreakPopup() {
    const breakPopup = document.getElementById("break-popup");
    const workContainer = document.getElementById("work-container");
    breakPopup.style.display = "none";
    workContainer.style.display = "block";
}

function switchMode() {
    if (mode === "work") {
        mode = "break";
        timeLeft = BREAK_DURATION;
        showBreakPopup();
        startTimerLoop();
    } else {
        mode = "work";
        timeLeft = WORK_DURATION;
        hideBreakPopup();
        startTimerLoop();
    }
}

function startTimerLoop() {
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

function toggleStartStop() {
    const btn = document.getElementById("toggle-btn");
    if (!isRunning) {
        isRunning = true;
        btn.textContent = "Stop";
        mode = "work";
        timeLeft = WORK_DURATION;
        hideBreakPopup();
        startTimerLoop();
    } else {
        isRunning = false;
        btn.textContent = "Start";
        clearInterval(timerId);
    }
}

window.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("toggle-btn");
    btn.addEventListener("click", toggleStartStop);
    isRunning = false;
    btn.textContent = "Start";
    mode = "work";
    timeLeft = WORK_DURATION;
    hideBreakPopup();
    updateCountdownDisplay();
});
