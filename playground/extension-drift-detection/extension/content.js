// Create and inject the progress bar
function createProgressBar() {
    const progressBar = document.createElement('div');
    progressBar.id = 'tabby-progress-bar';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background-color: #4CAF50;
        transition: width 1s linear;
        z-index: 999999;
        opacity: 0;
    `;
    document.body.appendChild(progressBar);
    return progressBar;
}

// Update progress bar
function updateProgressBar(progress) {
    let progressBar = document.getElementById('tabby-progress-bar');
    if (!progressBar) {
        progressBar = createProgressBar();
    }
    
    // Show the progress bar with a fade in
    progressBar.style.opacity = '1';
    progressBar.style.width = `${progress}%`;
}

// Reset progress bar
function resetProgressBar() {
    const progressBar = document.getElementById('tabby-progress-bar');
    if (progressBar) {
        progressBar.style.width = '0%';
        progressBar.style.opacity = '0';
    }
}

// Create progress bar when the page loads
createProgressBar();

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'updateProgress') {
        updateProgressBar(request.progress);
    } else if (request.action === 'resetProgress') {
        resetProgressBar();
    }
}); 