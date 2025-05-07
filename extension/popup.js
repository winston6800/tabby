document.addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('checkInButton');
    const counterDisplay = document.getElementById('counter');
    let keyBuffer = '';
  
    function getTodayDateString() {
      const today = new Date();
      return today.toISOString().split('T')[0];
    }
  
    function updateUI(lastCheckIn, count) {
      const today = getTodayDateString();
      counterDisplay.textContent = count;
  
      if (lastCheckIn === today) {
        button.disabled = true;
        button.textContent = "Checked In Today";
      } else {
        button.disabled = false;
        button.textContent = "Check In";
      }
    }
  
    chrome.storage.local.get(['lastCheckIn', 'checkInCount'], (result) => {
      updateUI(result.lastCheckIn || '', result.checkInCount || 0);
  
      button.addEventListener('click', () => {
        const today = getTodayDateString();
        const now = new Date();
        chrome.storage.local.set({
          lastCheckIn: today,
          checkInCount: (result.checkInCount || 0) + 1
        }, () => {
          updateUI(today, (result.checkInCount || 0) + 1);
        });
      });
    });
  
    
    
  });
  