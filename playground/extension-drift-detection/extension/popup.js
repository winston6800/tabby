document.addEventListener('DOMContentLoaded', () => {
    // Navigation
    const navButtons = document.querySelectorAll('.nav-button[data-section]');
    const sections = document.querySelectorAll('.section');
    
    updateTabSwitchCount();
    
    // update tab switch count every second
    setInterval(updateTabSwitchCount, 1000);
    
    navButtons.forEach(button => {
      button.addEventListener('click', () => {
        const targetSection = button.dataset.section;
        sections.forEach(section => {
          section.classList.remove('active');
          if (section.id === targetSection) {
            section.classList.add('active');
          }
        });
      });
    });
  
    // Check-in functionality
    const checkInButton = document.getElementById('checkInButton');
    const counterDisplay = document.getElementById('counter');
    let keyBuffer = '';
  
    function getTodayDateString() {
      const today = new Date();
      return today.toISOString().split('T')[0];
    }
  
    function updateCheckInUI(lastCheckIn, count) {
      const today = getTodayDateString();
      counterDisplay.textContent = count;
  
      if (lastCheckIn === today) {
        checkInButton.disabled = true;
        checkInButton.textContent = "Checked In Today";
      } else {
        checkInButton.disabled = false;
        checkInButton.textContent = "Check In";
      }
    }
  
    chrome.storage.local.get(['lastCheckIn', 'checkInCount'], (result) => {
      updateCheckInUI(result.lastCheckIn || '', result.checkInCount || 0);
  
      checkInButton.addEventListener('click', () => {
        const today = getTodayDateString();
        chrome.storage.local.set({
          lastCheckIn: today,
          checkInCount: (result.checkInCount || 0) + 1
        }, () => {
          updateCheckInUI(today, (result.checkInCount || 0) + 1);
        });
      });
    });
  
    // Timer functionality
    const timerDisplay = document.getElementById('timerDisplay');
    const startTimerBtn = document.getElementById('startTimer');
    const stopTimerBtn = document.getElementById('stopTimer');
    const currentTaskDisplay = document.getElementById('currentTask');
    
    let timerInterval;
    let timeLeft = 25 * 60; // Default 25 minutes in seconds
  
    function updateTimerDisplay() {
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
  
    // Make timer display editable
    timerDisplay.addEventListener('click', () => {
      if (timerInterval) return; // Don't allow editing while timer is running
      
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      const input = document.createElement('input');
      input.type = 'text';
      input.value = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      input.style.width = '100%';
      input.style.fontSize = '48px';
      input.style.textAlign = 'center';
      input.style.border = 'none';
      input.style.background = 'transparent';
      input.style.fontFamily = 'inherit';
      
      // Replace display with input
      timerDisplay.textContent = '';
      timerDisplay.appendChild(input);
      input.focus();
      input.select();

      function validateAndSaveTime() {
        const value = input.value.trim();
        const match = value.match(/^(\d{1,2}):(\d{2})$/);
        
        if (match) {
          const minutes = parseInt(match[1]);
          const seconds = parseInt(match[2]);
          
          if (minutes >= 0 && minutes <= 99 && seconds >= 0 && seconds < 60) {
            timeLeft = minutes * 60 + seconds;
            // Sync with background script
            chrome.runtime.sendMessage({ 
              action: 'setTimer',
              seconds: timeLeft
            }, (response) => {
              if (response) {
                timeLeft = response.remainingTime;
                updateTimerDisplay();
              }
            });
          } else {
            // Invalid time, revert to previous value
            updateTimerDisplay();
          }
        } else {
          // Invalid format, revert to previous value
          updateTimerDisplay();
        }
      }

      input.addEventListener('blur', validateAndSaveTime);
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          validateAndSaveTime();
          input.blur();
        }
      });
    });
  
    function startTimer() {
      if (!timerInterval) {
        chrome.runtime.sendMessage({ action: 'startTimer' }, (response) => {
          if (response && response.isRunning) {
            timeLeft = response.remainingTime;
            updateTimerDisplay();
            timerInterval = setInterval(() => {
              chrome.runtime.sendMessage({ action: 'getTimerStatus' }, (response) => {
                if (response) {
                  timeLeft = response.remainingTime;
                  updateTimerDisplay();
                  if (timeLeft === 0) {
                    stopTimer();
                    // Show notification when timer ends
                    chrome.notifications.create({
                      type: 'basic',
                      iconUrl: 'icon.jpg',
                      title: 'Timer Complete!',
                      message: 'Your focus session has ended. Take a short break!',
                      priority: 2
                    });
                  }
                }
              });
            }, 1000);
            startTimerBtn.disabled = true;
            stopTimerBtn.disabled = false;
          }
        });
      }
    }
  
    function stopTimer() {
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
        chrome.runtime.sendMessage({ action: 'stopTimer' }, (response) => {
          if (response) {
            timeLeft = response.remainingTime;
            updateTimerDisplay();
            startTimerBtn.disabled = false;
            stopTimerBtn.disabled = true;
          }
        });
      }
    }
  
    // Initialize timer state
    chrome.runtime.sendMessage({ action: 'getTimerStatus' }, (response) => {
      if (response) {
        timeLeft = response.remainingTime;
        updateTimerDisplay();
        
        if (response.isRunning) {
          startTimerBtn.disabled = true;
          stopTimerBtn.disabled = false;
          timerInterval = setInterval(() => {
            chrome.runtime.sendMessage({ action: 'getTimerStatus' }, (response) => {
              if (response) {
                timeLeft = response.remainingTime;
                updateTimerDisplay();
                if (timeLeft === 0) {
                  stopTimer();
                  // Show notification when timer ends
                  chrome.notifications.create({
                    type: 'basic',
                    iconUrl: 'icon.jpg',
                    title: 'Timer Complete!',
                    message: 'Your focus session has ended. Take a short break!',
                    priority: 2
                  });
                }
              }
            });
          }, 1000);
        }
      }
    });
  
    startTimerBtn.addEventListener('click', startTimer);
    stopTimerBtn.addEventListener('click', stopTimer);
  
    // stats display
    function updateStats() {
      chrome.runtime.sendMessage({ action: 'getTimerStatus' }, (response) => {
        if (response) {
          const productiveHours = Math.floor(response.productiveTime / (1000 * 60 * 60));
          const productiveMinutes = Math.floor((response.productiveTime % (1000 * 60 * 60)) / (1000 * 60));
          const unproductiveHours = Math.floor(response.unproductiveTime / (1000 * 60 * 60));
          const unproductiveMinutes = Math.floor((response.unproductiveTime % (1000 * 60 * 60)) / (1000 * 60));
  
          document.getElementById('productiveTime').textContent = `${productiveHours}h ${productiveMinutes}m`;
          document.getElementById('unproductiveTime').textContent = `${unproductiveHours}h ${unproductiveMinutes}m`;
          
          if (response.currentTask) {
            currentTaskDisplay.textContent = response.currentTask;
          }
        }
      });
    }
  
    // update stats every second
    setInterval(updateStats, 1000);
          
    // focus mode Settings
    const switchThreshold = document.getElementById('switchThreshold');
    const timeWindow = document.getElementById('timeWindow');
    const saveSettings = document.getElementById('saveSettings');
    const unproductiveTimeThreshold = document.getElementById('unproductiveTimeThreshold');

    // load saved settings
    chrome.storage.local.get(['focusSettings'], (result) => {
        if (result.focusSettings) {
            switchThreshold.value = result.focusSettings.switchThreshold || 25;
            timeWindow.value = result.focusSettings.timeWindow || 2;
            unproductiveTimeThreshold.value = result.focusSettings.unproductiveTimeThreshold || 30;
        }
    });

    // save settings
    saveSettings.addEventListener('click', () => {
        const settings = {
            switchThreshold: parseInt(switchThreshold.value),
            timeWindow: parseInt(timeWindow.value),
            unproductiveTimeThreshold: parseInt(unproductiveTimeThreshold.value)
        };

        chrome.storage.local.set({ focusSettings: settings }, () => {
            // Notify background script of settings change
            chrome.runtime.sendMessage({ 
                action: 'updateFocusSettings',
                settings: settings
            });

            // show save confirmation
            const originalText = saveSettings.textContent;
            saveSettings.textContent = 'Saved!';
            saveSettings.disabled = true;
            setTimeout(() => {
                saveSettings.textContent = originalText;
                saveSettings.disabled = false;
            }, 2000);
        });
    });

    // Non-productive domains management
    const newDomainInput = document.getElementById('newDomain');
    const addDomainButton = document.getElementById('addDomain');
    const domainList = document.getElementById('domainList');

    // load existing domains
    chrome.storage.local.get(['nonProductiveDomains'], (result) => {
        if (result.nonProductiveDomains) {
            result.nonProductiveDomains.forEach(domain => {
                addDomainToList(domain);
            });
        }
    });

    function addDomainToList(domain) {
        const li = document.createElement('li');
        li.textContent = domain;
        
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete-domain';
        deleteButton.style.marginLeft = '10px';
        deleteButton.style.padding = '2px 8px';
        deleteButton.style.border = '1px solid #ccc';
        deleteButton.style.borderRadius = '3px';
        deleteButton.style.backgroundColor = '#fff';
        deleteButton.style.cursor = 'pointer';
        deleteButton.style.fontSize = '12px';
        
        deleteButton.onclick = () => {
            chrome.storage.local.get(['nonProductiveDomains'], (result) => {
                const domains = result.nonProductiveDomains || [];
                const updatedDomains = domains.filter(d => d !== domain);
                chrome.storage.local.set({ nonProductiveDomains: updatedDomains });
                li.remove();
            });
        };
        
        li.appendChild(deleteButton);
        domainList.appendChild(li);
    }

    addDomainButton.addEventListener('click', () => {
        const domain = newDomainInput.value.trim().toLowerCase();
        if (!domain) {
            alert('Please enter a domain');
            return;
        }

        chrome.storage.local.get(['nonProductiveDomains'], (result) => {
            const domains = result.nonProductiveDomains || [];
            if (domains.includes(domain)) {
                alert('This domain is already in the list');
                return;
            }

            domains.push(domain);
            chrome.storage.local.set({ nonProductiveDomains: domains }, () => {
                addDomainToList(domain);
                newDomainInput.value = '';
            });
        });
    });

    newDomainInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addDomainButton.click();
        }
    });
  });
  
  // Listen for messages from background script
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'updateTimer') {
      updateTimerDisplay(request.remainingTime);
    }
  });

  function updateTabSwitchCount() {
    chrome.runtime.sendMessage({ action: 'getTabSwitchCount' }, (response) => {
      if (response) {
        document.getElementById('tabSwitchCount').textContent = response.count;
      }
    });
  }