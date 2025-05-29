let isTimerRunning = false;
let productiveTime = 0;
let unproductiveTime = 0;
let lastActiveTime = Date.now();
let currentTask = null;
let remainingTime = 25 * 60; // Default 25 minutes in seconds
let hasNotified = false;
let initialTimerDuration = 25 * 60; // Track the initial timer duration in seconds
let tabSwitchCount = 0;
let lastTabId = null;
let lastWindowId = null;

// initialize tab switch count from storage when extension starts
chrome.storage.local.get(['tabSwitchCount'], (result) => {
  if (result.tabSwitchCount !== undefined) {
    tabSwitchCount = result.tabSwitchCount;
  }
});

function notifyTabSwitchThreshold() {
  console.log('Attempting to show notification...');
  
  // check if we have notification permission
  chrome.permissions.contains({
    permissions: ['notifications']
  }, (hasPermission) => {
    if (!hasPermission) {
      console.log('No notification permission, requesting...');
      chrome.permissions.request({
        permissions: ['notifications']
      }, (granted) => {
        if (granted) {
          console.log('Notification permission granted, showing notification');
          showNotification();
        } else {
          console.log('Notification permission denied');
        }
      });
    } else {
      console.log('Notification permission exists, showing notification');
      showNotification();
    }
  });
}

function showNotification() {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: chrome.runtime.getURL('icon.jpg'),
    title: 'Tab Switch Alert',
    message: 'You\'ve switched tabs 25 times. Consider taking a short break or refocusing on your task.',
    priority: 2,
    requireInteraction: true,
    silent: false
  }, (notificationId) => {
    if (chrome.runtime.lastError) {
      console.error('Notification error:', chrome.runtime.lastError);
    } else {
      console.log('Notification created with ID:', notificationId);
    }
  });
}

// track tab switches
chrome.tabs.onActivated.addListener((activeInfo) => {
  if (activeInfo.tabId !== lastTabId) {
    tabSwitchCount++;
    lastTabId = activeInfo.tabId;
    chrome.storage.local.set({ tabSwitchCount });
    console.log('Tab switch detected. Count:', tabSwitchCount);
    
    // check if we've hit the threshold
    // in the future make this customizable
    if (tabSwitchCount % 25 === 0) {
      console.log('Tab switch threshold reached!');
      notifyTabSwitchThreshold();
    }
  }
});

// track window focus switches
chrome.windows.onFocusChanged.addListener((windowId) => {
  if (windowId !== lastWindowId && windowId !== chrome.windows.WINDOW_ID_NONE) {
    tabSwitchCount++;
    lastWindowId = windowId;
    chrome.storage.local.set({ tabSwitchCount });
    
    // check if we've hit the threshold
    if (tabSwitchCount % 25 === 0) {
      notifyTabSwitchThreshold();
    }
  }
});

// request notification permission when extension is installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    productiveTime: 0,
    unproductiveTime: 0,
    currentTask: null,
    isTimerRunning: false,
    remainingTime: 25 * 60,
    tabSwitchCount: 0
  });
});

function notifyTimerComplete() {
  if (!hasNotified) {
    hasNotified = true;
    
    // first check if we have notification permission
    chrome.permissions.contains({
      permissions: ['notifications']
    }, (hasPermission) => {
      if (!hasPermission) {
        console.log('No notification permission');
        return;
      }

      // create the notification with more options
      chrome.notifications.create({
        type: 'basic',
        iconUrl: chrome.runtime.getURL('icon.jpg'),
        title: 'Timer Complete!',
        message: 'Your focus session has ended.',
        priority: 2,
        requireInteraction: true, // keep notification visible until user interacts
        silent: false // ensure sound plays
      }, (notificationId) => {
        if (chrome.runtime.lastError) {
          console.error('Notification error:', chrome.runtime.lastError);
          console.error('Error details:', {
            message: chrome.runtime.lastError.message,
            stack: chrome.runtime.lastError.stack
          });
        } else {
          console.log('Notification created with ID:', notificationId);
          
          // add click listener for the notification
          chrome.notifications.onClicked.addListener((clickedId) => {
            if (clickedId === notificationId) {
              console.log('Notification clicked');
              chrome.notifications.clear(notificationId);
            }
          });
        }
      });
    });
  }
}

function updateTimer() {
  const now = Date.now();
  const timeDiff = now - lastActiveTime;
  
  if (isTimerRunning) {
    // Update remaining time
    remainingTime = Math.max(0, remainingTime - Math.floor(timeDiff / 1000));
    if (remainingTime === 0) {
      isTimerRunning = false;
      // Add the completed timer duration to productive time using the initial duration
      const timerDuration = initialTimerDuration * 1000; // Convert to milliseconds
      productiveTime += timerDuration;
      currentTask = null;
      notifyTimerComplete();
    }
  }
  
  lastActiveTime = now;
  
  // Store the updated times
  chrome.storage.local.set({
    productiveTime,
    unproductiveTime,
    currentTask,
    isTimerRunning,
    remainingTime
  });
}

// Start the timer update interval
setInterval(updateTimer, 1000);

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case 'startTimer':
      // Request notification permission when starting the timer
      chrome.permissions.request({
        permissions: ['notifications']
      }, (granted) => {
        if (granted) {
          console.log('Notification permission granted');
          isTimerRunning = true;
          currentTask = request.taskId || null;
          lastActiveTime = Date.now();
          hasNotified = false;
          sendResponse({ 
            isRunning: true,
            remainingTime
          });
        } else {
          console.log('Notification permission denied');
          // Still start the timer even if notifications are denied
          isTimerRunning = true;
          currentTask = request.taskId || null;
          lastActiveTime = Date.now();
          hasNotified = false;
          sendResponse({ 
            isRunning: true,
            remainingTime
          });
        }
      });
      return true; // Keep the message channel open for the async response
      
    case 'stopTimer':
      isTimerRunning = false;
      currentTask = null;
      hasNotified = false;
      sendResponse({ 
        isRunning: false,
        remainingTime
      });
      break;
      
    case 'getTimerStatus':
      sendResponse({
        isRunning: isTimerRunning,
        productiveTime,
        unproductiveTime,
        currentTask,
        remainingTime
      });
      break;
      
    case 'setTimer':
      remainingTime = request.seconds;
      initialTimerDuration = request.seconds; // Update the initial timer duration
      hasNotified = false;
      sendResponse({ 
        isRunning: isTimerRunning,
        remainingTime
      });
      break;

    case 'getTabSwitchCount':
      sendResponse({ count: tabSwitchCount });
      break;
  }
  return true;
}); 