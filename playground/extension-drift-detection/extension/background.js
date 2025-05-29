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
let focusSettings = {
    switchThreshold: 25,
    timeWindow: 2 // minutes
};
let previousTabId = null; // store the previous tab ID for restoration
let lastProductiveTabId = null; // store the last productive tab ID
let nonProductiveDomains = []; // Array to store non-productive domains

// initialize tab switch count from storage when extension starts
chrome.storage.local.get(['tabSwitchCount', 'nonProductiveDomains'], (result) => {
  if (result.tabSwitchCount !== undefined) {
    tabSwitchCount = result.tabSwitchCount;
  }
  if (result.nonProductiveDomains) {
    nonProductiveDomains = result.nonProductiveDomains;
  }
});

// initialize settings from storage
chrome.storage.local.get(['focusSettings'], (result) => {
    if (result.focusSettings) {
        focusSettings = result.focusSettings;
    }
});

// track tab switches with time window
let tabSwitchTimes = [];

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
    message: 'You\'ve switched tabs frequently. Would you like to return to your previous task?',
    priority: 2,
    requireInteraction: true,
    silent: false,
    buttons: [
      { title: 'Return to Task' },
      { title: 'Dismiss' }
    ]
  }, (notificationId) => {
    if (chrome.runtime.lastError) {
      console.error('Notification error:', chrome.runtime.lastError);
    } else {
      console.log('Notification created with ID:', notificationId);
    }
  });
}

function checkTabSwitchThreshold() {
    const now = Date.now();
    const timeWindowMs = focusSettings.timeWindow * 60 * 1000; // convert minutes to milliseconds
    
    // Remove old tab switches outside the time window
    tabSwitchTimes = tabSwitchTimes.filter(time => now - time < timeWindowMs);
    
    // Check if we've hit the threshold
    if (tabSwitchTimes.length >= focusSettings.switchThreshold) {
        notifyTabSwitchThreshold();
        // Clear the array after notification
        tabSwitchTimes = [];
    }
}

// add notification button click handler
chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
  if (buttonIndex === 0) { // return to Task button
    if (lastProductiveTabId) {
      chrome.tabs.update(lastProductiveTabId, { active: true }, (tab) => {
        if (chrome.runtime.lastError) {
          console.error('Error restoring tab:', chrome.runtime.lastError);
        }
      });
    }
  }
  // for both buttons, clear the notification and reset the counter
  chrome.notifications.clear(notificationId);
  tabSwitchTimes = [];
});

// track tab switches
chrome.tabs.onActivated.addListener((activeInfo) => {
    if (activeInfo.tabId !== lastTabId) {
        // Get the URL of the newly activated tab
        chrome.tabs.get(activeInfo.tabId, (tab) => {
            if (chrome.runtime.lastError) {
                console.error('Error getting tab:', chrome.runtime.lastError);
                return;
            }
            
            // Extract domain from URL
            let domain = '';
            try {
                domain = new URL(tab.url).hostname;
                console.log('Current domain:', domain);
                console.log('Non-productive domains list:', nonProductiveDomains);
                console.log('Is domain non-productive?', nonProductiveDomains.some(d => domain.includes(d)));
            } catch (e) {
                console.error('Error parsing URL:', e);
                return;
            }

            // Only increment counter if the domain is in non-productive list
            if (nonProductiveDomains.some(d => domain.includes(d))) {
                console.log('Incrementing counter for non-productive domain:', domain);
                previousTabId = lastTabId; // store the previous tab before updating
                tabSwitchCount++;
                lastTabId = activeInfo.tabId;
                chrome.storage.local.set({ tabSwitchCount });
                
                // Add current time to tab switch times
                tabSwitchTimes.push(Date.now());
                checkTabSwitchThreshold();
            } else {
                console.log('Domain not in non-productive list:', domain);
                // Update last productive tab if this is a productive domain
                lastProductiveTabId = activeInfo.tabId;
                // Still update lastTabId but don't increment counter
                lastTabId = activeInfo.tabId;
            }
        });
    }
});

// track window focus switches
chrome.windows.onFocusChanged.addListener((windowId) => {
    if (windowId !== lastWindowId && windowId !== chrome.windows.WINDOW_ID_NONE) {
        // Get the active tab in the focused window
        chrome.tabs.query({active: true, windowId: windowId}, (tabs) => {
            if (tabs.length === 0) return;
            
            const tab = tabs[0];
            let domain = '';
            try {
                domain = new URL(tab.url).hostname;
                console.log('Window switch - Current domain:', domain);
                console.log('Window switch - Non-productive domains list:', nonProductiveDomains);
                console.log('Window switch - Is domain non-productive?', nonProductiveDomains.some(d => domain.includes(d)));
            } catch (e) {
                console.error('Error parsing URL:', e);
                return;
            }

            // Only increment counter if the domain is in non-productive list
            if (nonProductiveDomains.some(d => domain.includes(d))) {
                console.log('Window switch - Incrementing counter for non-productive domain:', domain);
                previousTabId = lastTabId; // store the previous tab before updating
                tabSwitchCount++;
                lastWindowId = windowId;
                chrome.storage.local.set({ tabSwitchCount });
                
                // add current time to tab switch times
                tabSwitchTimes.push(Date.now());
                checkTabSwitchThreshold();
            } else {
                console.log('Window switch - Domain not in non-productive list:', domain);
                // Update last productive tab if this is a productive domain
                lastProductiveTabId = tab.id;
                // Still update lastWindowId but don't increment counter
                lastWindowId = windowId;
            }
        });
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

    case 'updateFocusSettings':
      focusSettings = request.settings;
      // reset tab switch times when settings change
      tabSwitchTimes = [];
      sendResponse({
        isRunning: isTimerRunning,
        remainingTime
      });
      break;
  }
  return true;
}); 