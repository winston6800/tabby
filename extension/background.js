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
  }
  return true;
}); 