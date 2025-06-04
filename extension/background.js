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
    timeWindow: 2, // minutes
    unproductiveTimeThreshold: 30, // seconds before showing notification
    notificationEnabled: true,
    notificationStyle: 'subtle',
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00'
};
let previousTabId = null; // store the previous tab ID for restoration
let lastProductiveTabId = null; // store the last productive tab ID
let nonProductiveDomains = []; // array to store non-productive domains
let unproductiveStartTime = null; // track when user enters unproductive domain
let progressUpdateInterval = null; // for tracking progress bar updates

// Initialize node storage when extension is installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({
    productiveTime: 0,
    unproductiveTime: 0,
    currentTask: null,
    isTimerRunning: false,
    remainingTime: 25 * 60,
    tabSwitchCount: 0,
    nodes: [], // Initialize empty nodes array
    edges: [] // Initialize empty edges array
  });
});

// analytics data structures
let domainStats = {
    // Format: { 'domain.com': { totalTime: 0, visits: 0, lastVisit: null } }
};

let dailyStats = {
    // Format: { 'YYYY-MM-DD': { domains: {}, totalDriftEvents: 0 } }
};

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

// initialize analytics data from storage
chrome.storage.local.get(['domainStats', 'dailyStats'], (result) => {
    if (result.domainStats) {
        domainStats = result.domainStats;
    }
    if (result.dailyStats) {
        dailyStats = result.dailyStats;
    }
});

// track tab switches with time window
let tabSwitchTimes = [];

function notifyTabSwitchThreshold() {
  console.log('Attempting to show notification...');
  
  // check notification preferences first
  chrome.storage.local.get(['focusSettings'], (result) => {
    const settings = result.focusSettings || {};
    if (!settings.notificationEnabled) {
      console.log('Notifications are disabled in settings');
      return;
    }

    // check if we're in quiet hours
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const [startHour, startMin] = (settings.quietHoursStart || '22:00').split(':').map(Number);
    const [endHour, endMin] = (settings.quietHoursEnd || '08:00').split(':').map(Number);
    const startTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;
    
    if (startTime > endTime) {
      // Quiet hours span midnight
      if (currentTime >= startTime || currentTime <= endTime) {
        console.log('Currently in quiet hours');
        return;
      }
    } else {
      // Normal quiet hours
      if (currentTime >= startTime && currentTime <= endTime) {
        console.log('Currently in quiet hours');
        return;
      }
    }
  
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
            showNotification(settings.notificationStyle || 'subtle');
          } else {
            console.log('Notification permission denied');
          }
        });
      } else {
        console.log('Notification permission exists, showing notification');
        showNotification(settings.notificationStyle || 'subtle');
      }
    });
  });
}

function showNotification(style = 'subtle') {
  const notificationOptions = {
    type: 'basic',
    iconUrl: chrome.runtime.getURL('icon.jpg'),
    title: 'Tab Switch Alert',
    message: 'You\'ve switched tabs frequently. Would you like to return to your previous task?',
    priority: style === 'bold' ? 2 : 0,
    requireInteraction: style === 'bold',
    silent: style === 'subtle',
    buttons: [
      { title: 'Return to Task' },
      { title: 'Dismiss' }
    ]
  };

  chrome.notifications.create(notificationOptions, (notificationId) => {
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
    
    // remove old tab switches outside the time window
    tabSwitchTimes = tabSwitchTimes.filter(time => now - time < timeWindowMs);
    
    // check if we've hit the threshold
    if (tabSwitchTimes.length >= focusSettings.switchThreshold) {
        notifyTabSwitchThreshold();
        // clear the array after notification
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
  // for both buttons, clear the notification
  chrome.notifications.clear(notificationId);
  // only reset tab switch times for tab switch notifications
  if (notificationId.startsWith('tab-switch')) {
    tabSwitchTimes = [];
  }
});

function getTodayDateString() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

function updateDomainStats(domain, timeSpent) {
    const today = getTodayDateString();
    
    // initialize today's stats if not exists
    if (!dailyStats[today]) {
        dailyStats[today] = {
            domains: {},
            totalDriftEvents: 0
        };
    }
    
    // update domain stats
    if (!domainStats[domain]) {
        domainStats[domain] = {
            totalTime: 0,
            visits: 0,
            lastVisit: null
        };
    }
    
    // update daily domain stats
    if (!dailyStats[today].domains[domain]) {
        dailyStats[today].domains[domain] = {
            timeSpent: 0,
            visits: 0
        };
    }
    
    // update the stats
    domainStats[domain].totalTime += timeSpent;
    domainStats[domain].visits += 1;
    domainStats[domain].lastVisit = Date.now();
    
    dailyStats[today].domains[domain].timeSpent += timeSpent;
    dailyStats[today].domains[domain].visits += 1;
    
    // Save to storage
    chrome.storage.local.set({ domainStats, dailyStats });
}

// track tab switches
chrome.tabs.onActivated.addListener((activeInfo) => {
    if (activeInfo.tabId !== lastTabId) {
        // Clear any existing progress update interval
        if (progressUpdateInterval) {
            clearInterval(progressUpdateInterval);
            progressUpdateInterval = null;
        }

        // get the url of the newly activated tab
        chrome.tabs.get(activeInfo.tabId, (tab) => {
            if (chrome.runtime.lastError) {
                console.error('Error getting tab:', chrome.runtime.lastError);
                return;
            }
            
            // extract domain from url
            let domain = '';
            try {
                domain = new URL(tab.url).hostname;
                console.log('Current domain:', domain);
            } catch (e) {
                console.error('Error parsing URL:', e);
                return;
            }

            // check if we're leaving an unproductive domain
            if (unproductiveStartTime && lastTabId) {
                chrome.tabs.get(lastTabId, (lastTab) => {
                    if (!chrome.runtime.lastError && lastTab.url) {
                        try {
                            const lastDomain = new URL(lastTab.url).hostname;
                            if (nonProductiveDomains.some(d => lastDomain.includes(d))) {
                                const timeSpent = Math.floor((Date.now() - unproductiveStartTime) / 1000);
                                console.log(`Time spent on unproductive domain: ${timeSpent} seconds`);
                                unproductiveTime += timeSpent * 1000; // convert to milliseconds
                                chrome.storage.local.set({ unproductiveTime });
                                
                                // Update analytics
                                updateDomainStats(lastDomain, timeSpent);
                                dailyStats[getTodayDateString()].totalDriftEvents++;
                                chrome.storage.local.set({ dailyStats });

                                // Reset progress bar on the previous tab
                                chrome.tabs.sendMessage(lastTabId, { action: 'resetProgress' });
                            }
                        } catch (e) {
                            console.error('Error parsing last tab URL:', e);
                        }
                    }
                });
            }

            // only increment counter if the domain is in non-productive list
            if (nonProductiveDomains.some(d => domain.includes(d))) {
                console.log('Incrementing counter for non-productive domain:', domain);
                previousTabId = lastTabId; // store the previous tab before updating
                tabSwitchCount++;
                lastTabId = activeInfo.tabId;
                chrome.storage.local.set({ tabSwitchCount });
                
                // add current time to tab switch times
                tabSwitchTimes.push(Date.now());
                checkTabSwitchThreshold();

                // start tracking time on unproductive domain
                unproductiveStartTime = Date.now();
                
                // Start progress bar updates
                progressUpdateInterval = setInterval(() => {
                    const timeSpent = Math.floor((Date.now() - unproductiveStartTime) / 1000);
                    const threshold = focusSettings.unproductiveTimeThreshold;
                    const progress = Math.min(100, (timeSpent / threshold) * 100);
                    
                    // Update progress bar
                    chrome.tabs.sendMessage(activeInfo.tabId, { 
                        action: 'updateProgress',
                        progress: progress
                    });

                    // Show notification when threshold is reached
                    if (timeSpent >= threshold) {
                        notifyUnproductiveTime();
                        clearInterval(progressUpdateInterval);
                        progressUpdateInterval = null;
                    }
                }, 1000); // Update every second
            } else {
                console.log('Domain not in non-productive list:', domain);
                // update last productive tab if this is a productive domain
                lastProductiveTabId = activeInfo.tabId;
                // still update lastTabId but don't increment counter
                lastTabId = activeInfo.tabId;
                // reset unproductive time tracking
                unproductiveStartTime = null;
            }
        });
    }
});

// track window focus switches
chrome.windows.onFocusChanged.addListener((windowId) => {
    if (windowId !== lastWindowId && windowId !== chrome.windows.WINDOW_ID_NONE) {
        // get the active tab in the focused window
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

            // only increment counter if the domain is in non-productive list
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
                // update last productive tab if this is a productive domain
                lastProductiveTabId = tab.id;
                // still update lastWindowId but don't increment counter
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
    
    // First check if we have notification permission
    chrome.permissions.contains({
      permissions: ['notifications']
    }, (hasPermission) => {
      if (!hasPermission) {
        console.log('No notification permission');
        return;
      }

      // Create the notification with more options
      chrome.notifications.create({
        type: 'basic',
        iconUrl: chrome.runtime.getURL('icon.jpg'),
        title: 'Timer Complete!',
        message: 'Your focus session has ended.',
        priority: 2,
        requireInteraction: true, // Keep notification visible until user interacts
        silent: false // Ensure sound plays
      }, (notificationId) => {
        if (chrome.runtime.lastError) {
          console.error('Notification error:', chrome.runtime.lastError);
          // Try to get more details about the error
          console.error('Error details:', {
            message: chrome.runtime.lastError.message,
            stack: chrome.runtime.lastError.stack
          });
        } else {
          console.log('Notification created with ID:', notificationId);
          
          // Add click listener for the notification
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

function notifyUnproductiveTime() {
  // check notification preferences first
  chrome.storage.local.get(['focusSettings'], (result) => {
    const settings = result.focusSettings || {};
    if (!settings.notificationEnabled) {
      console.log('Notifications are disabled in settings');
      return;
    }

    // check if we're in quiet hours
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const [startHour, startMin] = (settings.quietHoursStart || '22:00').split(':').map(Number);
    const [endHour, endMin] = (settings.quietHoursEnd || '08:00').split(':').map(Number);
    const startTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;
    
    if (startTime > endTime) {
      // Quiet hours span midnight
      if (currentTime >= startTime || currentTime <= endTime) {
        console.log('Currently in quiet hours');
        return;
      }
    } else {
      // Normal quiet hours
      if (currentTime >= startTime && currentTime <= endTime) {
        console.log('Currently in quiet hours');
        return;
      }
    }

    const notificationOptions = {
      type: 'basic',
      iconUrl: chrome.runtime.getURL('icon.jpg'),
      title: 'Unproductive Time Alert',
      message: 'You\'ve been on this site for a while. Would you like to return to your previous task?',
      priority: settings.notificationStyle === 'bold' ? 2 : 0,
      requireInteraction: settings.notificationStyle === 'bold',
      silent: settings.notificationStyle === 'subtle',
      buttons: [
        { title: 'Return to Task' },
        { title: 'Dismiss' }
      ]
    };

    chrome.notifications.create(notificationOptions, (notificationId) => {
      if (chrome.runtime.lastError) {
        console.error('Notification error:', chrome.runtime.lastError);
      } else {
        console.log('Notification created with ID:', notificationId);
      }
    });
  });
}

// Listen for messages from popup and content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background script received message:', request);
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

    case 'updateNodes':
      console.log('Updating nodes in storage:', request.nodes);
      // Update nodes and edges in storage
      chrome.storage.local.set({ 
        nodes: request.nodes,
        edges: request.edges || []
      }, () => {
        console.log('Nodes and edges updated in storage');
        // Notify popup about the update
        chrome.runtime.sendMessage({ 
          action: 'nodesUpdated',
          nodes: request.nodes,
          edges: request.edges || []
        }, (response) => {
          console.log('Popup response:', response);
        });
      });
      sendResponse({ success: true });
      break;

    case 'getNodes':
      console.log('Getting nodes from storage');
      chrome.storage.local.get(['nodes', 'edges'], (result) => {
        console.log('Retrieved nodes and edges from storage:', result);
        sendResponse({ 
          nodes: result.nodes || [],
          edges: result.edges || []
        });
      });
      return true; // Keep the message channel open for async response

    case 'updateFocusSettings':
      focusSettings = request.settings;
      // reset tab switch times when settings change
      tabSwitchTimes = [];
      // update unproductive time threshold if provided
      if (request.settings.unproductiveTimeThreshold) {
          focusSettings.unproductiveTimeThreshold = request.settings.unproductiveTimeThreshold;
      }
      sendResponse({
        isRunning: isTimerRunning,
        remainingTime
      });
      break;

    case 'updateNonProductiveDomains':
      console.log('Updating non-productive domains:', request.domains);
      nonProductiveDomains = request.domains;
      console.log('Updated non-productive domains list:', nonProductiveDomains);
      // reset unproductive time tracking if we're currently on an unproductive domain
      if (unproductiveStartTime) {
          const currentTab = chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
              if (tabs[0] && tabs[0].url) {
                  try {
                      const domain = new URL(tabs[0].url).hostname;
                      console.log('Current domain:', domain);
                      console.log('Is domain in updated list?', nonProductiveDomains.some(d => domain.includes(d)));
                      if (!nonProductiveDomains.some(d => domain.includes(d))) {
                          console.log('Resetting unproductive time tracking');
                          unproductiveStartTime = null;
                      }
                  } catch (e) {
                      console.error('Error parsing URL:', e);
                  }
              }
          });
      }
      sendResponse({ success: true });
      break;
  }
  return true;
}); 