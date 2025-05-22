// Listen for messages from the website
window.addEventListener('message', (event) => {
  console.log('Content script received message:', event.data);
  // Only accept messages from our website
  if (event.origin !== 'http://localhost:5173') {
    console.log('Rejected message from origin:', event.origin);
    return;
  }

  // Handle node updates
  if (event.data.type === 'NODE_UPDATE') {
    console.log('Forwarding node update to background script:', event.data.nodes);
    chrome.runtime.sendMessage({
      action: 'updateNodes',
      nodes: event.data.nodes
    }, (response) => {
      console.log('Background script response:', response);
    });
  }
}); 