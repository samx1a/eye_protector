// =========================
// BACKGROUND SERVICE WORKER
// Keeps timer running even when popup is closed
// =========================

const WORK_DURATION = 20 * 60; // 20 minutes
const BREAK_DURATION = 20; // 20 seconds

let timerInterval = null;

// Load saved state when service worker starts
chrome.runtime.onStartup.addListener(loadState);
chrome.runtime.onInstalled.addListener(loadState);

async function loadState() {
  const result = await chrome.storage.local.get(['isRunning', 'mode', 'timeLeft', 'startTime', 'duration']);
  
  if (result.isRunning && result.startTime) {
    // Calculate how much time has passed since timer started
    const elapsed = Math.floor((Date.now() - result.startTime) / 1000);
    const storedDuration = result.duration ?? (result.mode === 'work' ? WORK_DURATION : BREAK_DURATION);
    const remaining = Math.max(0, storedDuration - elapsed);
    
    if (remaining > 0) {
      // Resume timer with remaining time
      startBackgroundTimer(result.mode, remaining);
    } else {
      // Timer finished while popup was closed, switch mode
      switchModeInBackground(result.mode === 'work' ? BREAK_DURATION : WORK_DURATION);
    }
  }
}

function startBackgroundTimer(mode, initialTime) {
  // Clear any existing timer
  if (timerInterval) {
    clearInterval(timerInterval);
  }
  
  const duration = initialTime;
  const startTime = Date.now();
  
  // Save state
  chrome.storage.local.set({
    isRunning: true,
    mode: mode,
    timeLeft: duration,
    startTime: startTime,
    duration: duration
  });
  
  // Update badge immediately
  updateBadge(mode, duration);
  
  // Start counting down
  timerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const timeLeft = Math.max(0, duration - elapsed);
    
    // Update badge every second
    updateBadge(mode, timeLeft);
    
    // Save current state
    chrome.storage.local.set({
      isRunning: timeLeft > 0,
      mode: mode,
      timeLeft: timeLeft,
      startTime: startTime,
      duration: duration
    });
    
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      
      // Switch to next mode
      if (mode === 'work') {
        switchModeInBackground(BREAK_DURATION);
      } else {
        switchModeInBackground(WORK_DURATION);
      }
    }
  }, 1000);
}

function switchModeInBackground(duration) {
  const newMode = duration === BREAK_DURATION ? 'break' : 'work';
  
  // Show notification when break starts
  if (newMode === 'break') {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: chrome.runtime.getURL('icon48.png'),
      title: 'Eye Protector',
      message: 'Time for a break! Look away from the screen.'
    }).catch(() => {
      // If icon doesn't exist, create without icon
      chrome.notifications.create({
        type: 'basic',
        title: 'Eye Protector',
        message: 'Time for a break! Look away from the screen.'
      }).catch(() => {}); // Ignore if notifications fail
    });
    chrome.action.openPopup().catch(() => {});
  }
  
  // Start timer for new mode
  startBackgroundTimer(newMode, duration);
}

function updateBadge(mode, timeLeft) {
  try {
    if (mode === 'work') {
      // Show minutes:seconds for work mode (badge text limited, so show MM:SS)
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      const badgeText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
      chrome.action.setBadgeText({ text: badgeText });
      chrome.action.setBadgeBackgroundColor({ color: '#3a5f2a' }); // Green
    } else {
      // Show just seconds for break mode
      chrome.action.setBadgeText({ text: timeLeft.toString() });
      chrome.action.setBadgeBackgroundColor({ color: '#b0522e' }); // Orange/red
    }
  } catch (error) {
    // Ignore badge errors
  }
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  
  chrome.storage.local.set({
    isRunning: false,
    mode: 'work',
    timeLeft: WORK_DURATION,
    startTime: null,
    duration: null
  });
  
  chrome.action.setBadgeText({ text: '' });
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'start') {
    startBackgroundTimer('work', WORK_DURATION);
    sendResponse({ success: true });
  } else if (request.action === 'stop') {
    stopTimer();
    sendResponse({ success: true });
  } else if (request.action === 'getState') {
    chrome.storage.local.get(['isRunning', 'mode', 'timeLeft', 'startTime', 'duration']).then(result => {
      if (result.isRunning && result.startTime) {
        // Calculate remaining time
        const elapsed = Math.floor((Date.now() - result.startTime) / 1000);
        const storedDuration = result.duration ?? (result.mode === 'work' ? WORK_DURATION : BREAK_DURATION);
        result.timeLeft = Math.max(0, storedDuration - elapsed);
        if (result.timeLeft <= 0) {
          result.isRunning = false;
        }
      }
      sendResponse(result);
    });
    return true; // Keep channel open for async response
  }
});

