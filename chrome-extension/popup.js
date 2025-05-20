// ================= FIREBASE INITIALIZATION =====================
//Tabby's web app Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCzIbQYdkKTVfbEIz1VrKfuwMITm2mNglU",
  authDomain: "tabby-5cde7.firebaseapp.com",
  projectId: "tabby-5cde7",
  storageBucket: "tabby-5cde7.firebasestorage.app",
  messagingSenderId: "955038627256",
  appId: "1:955038627256:web:d678ef827573c4647c4b4d",
  measurementId: "G-4XHC1CKT6N"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore();

// ================= NODE MAP SYNC LOGIC =====================
// Example node map structure
let nodeMap = [
  {
    id: "node1",
    title: "Research",
    objective: "Understand the problem",
    scope: "Read articles",
    children: ["node2"]
  },
  {
    id: "node2",
    title: "Build",
    objective: "Create prototype",
    scope: "Write code",
    children: []
  }
];

// Firestore collection and document (for demo, use a static doc)
const NODEMAP_COLLECTION = "nodeMaps";
const NODEMAP_DOC = "demoUser"; // Replace with user ID for real app

// Update the UI with the current node map
function updateNodeMapDisplay() {
  const nodeMapContainer = document.getElementById('nodeMap');
  const nodesHtml = nodeMap.map(node => `
    <div class="node">
      <div class="node-title">${node.title}</div>
      <div class="node-details">
        <div class="node-objective">${node.objective}</div>
        <div class="node-scope">${node.scope}</div>
      </div>
    </div>
  `).join('');
  
  // Keep the header but replace the nodes
  nodeMapContainer.innerHTML = `<h3>Your Node Map</h3>${nodesHtml}`;
}

// Save the node map to Firestore
function saveNodeMapToFirestore(map) {
  const syncStatus = document.getElementById('syncStatus');
  syncStatus.textContent = 'Syncing...';
  syncStatus.className = 'sync-status';

  db.collection(NODEMAP_COLLECTION).doc(NODEMAP_DOC).set({
    nodes: map,
    lastUpdated: new Date().toISOString()
  })
  .then(() => {
    syncStatus.textContent = `Last synced: ${new Date().toLocaleTimeString()}`;
    syncStatus.className = 'sync-status sync-success';
  })
  .catch((error) => {
    console.error("Error saving node map: ", error);
    syncStatus.textContent = 'Sync failed. Click to retry.';
    syncStatus.className = 'sync-status sync-error';
  });
}

// Load the node map from Firestore
function loadNodeMapFromFirestore() {
  const syncStatus = document.getElementById('syncStatus');
  syncStatus.textContent = 'Loading...';
  syncStatus.className = 'sync-status';

  db.collection(NODEMAP_COLLECTION).doc(NODEMAP_DOC).get()
    .then((doc) => {
      if (doc.exists) {
        nodeMap = doc.data().nodes;
        updateNodeMapDisplay();
        syncStatus.textContent = `Last synced: ${new Date().toLocaleTimeString()}`;
        syncStatus.className = 'sync-status sync-success';
      } else {
        console.log("No node map found in Firestore.");
        syncStatus.textContent = 'No data found. Click to create.';
        syncStatus.className = 'sync-status';
      }
    })
    .catch((error) => {
      console.error("Error loading node map: ", error);
      syncStatus.textContent = 'Load failed. Click to retry.';
      syncStatus.className = 'sync-status sync-error';
    });
}

// ================= UI LOGIC (TIMER, OBJECTIVE, SCOPE) =====================
console.log("Tabby Chrome Extension loaded!"); 

// Timer state
let startTime = null;
let timerInterval = null;
let elapsedTime = 0;

// DOM Elements
const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const objectiveInput = document.getElementById('objective');
const scopeInput = document.getElementById('scope');
const syncStatus = document.getElementById('syncStatus');

// Load saved data from Chrome local storage
chrome.storage.local.get(['objective', 'scope', 'elapsedTime'], (result) => {
  if (result.objective) objectiveInput.value = result.objective;
  if (result.scope) scopeInput.value = result.scope;
  if (result.elapsedTime) {
    elapsedTime = result.elapsedTime;
    updateTimerDisplay();
  }
});

// Save data to Chrome local storage when inputs change
objectiveInput.addEventListener('input', () => {
  chrome.storage.local.set({ objective: objectiveInput.value });
});

scopeInput.addEventListener('input', () => {
  chrome.storage.local.set({ scope: scopeInput.value });
});

// Timer functions
function startTimer() {
  if (!startTime) {
    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(updateTimer, 1000);
    startBtn.disabled = true;
    stopBtn.disabled = false;
  }
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
    elapsedTime = Date.now() - startTime;
    startTime = null;
    chrome.storage.local.set({ elapsedTime });
    startBtn.disabled = false;
    stopBtn.disabled = true;
  }
}

function updateTimer() {
  elapsedTime = Date.now() - startTime;
  updateTimerDisplay();
}

function updateTimerDisplay() {
  const hours = Math.floor(elapsedTime / 3600000);
  const minutes = Math.floor((elapsedTime % 3600000) / 60000);
  const seconds = Math.floor((elapsedTime % 60000) / 1000);
  
  timerDisplay.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Event listeners for timer controls
startBtn.addEventListener('click', startTimer);
stopBtn.addEventListener('click', stopTimer);

// Initialize button states
stopBtn.disabled = true;

// Make sync status clickable for retry
syncStatus.addEventListener('click', () => {
  if (syncStatus.textContent.includes('failed') || syncStatus.textContent.includes('No data')) {
    loadNodeMapFromFirestore();
  }
});

// Initial load of node map
loadNodeMapFromFirestore();

// Auto-sync every 30 seconds
setInterval(() => {
  saveNodeMapToFirestore(nodeMap);
}, 30000); 