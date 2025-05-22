// Zustand store for managing node and edge state in the node canvas.
// Handles node/edge CRUD, selection, and localStorage persistence.

import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { applyNodeChanges, applyEdgeChanges } from 'reactflow';

const useNodeStore = create((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  isFocusMode: false,
  taskHistory: [], // Array to store completed tasks
  
  toggleMode: () => set((state) => ({
    isFocusMode: !state.isFocusMode,
    selectedNodeId: null // Clear selection when toggling modes
  })),
  
  onNodesChange: (changes) => {
    set((state) => {
      const newNodes = applyNodeChanges(changes, state.nodes);
      console.log('Sending node update to extension:', newNodes);
      // Notify extension about node updates
      window.postMessage({
        type: 'NODE_UPDATE',
        nodes: newNodes
      }, 'http://localhost:5173');
      return { nodes: newNodes };
    });
  },
  
  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  
  onConnect: (connection) => {
    set({
      edges: [...get().edges, { ...connection, id: uuidv4() }],
    });
  },
  
  addNode: (nodeData) => set((state) => ({
    nodes: [
      ...state.nodes,
      {
        id: uuidv4(),
        type: 'custom',
        position: { x: 100, y: 100 },
        data: {
          title: nodeData.title && nodeData.title.trim() !== '' ? nodeData.title : 'New Node',
          description: nodeData.description || '',
          expectedOutput: nodeData.expectedOutput || '',
          tags: Array.isArray(nodeData.tags) && nodeData.tags.length > 0 ? nodeData.tags : ['new'],
          color: nodeData.color || '#ffffff',
          size: nodeData.size || 200,
        },
      },
    ],
  })),
  
  updateNode: (nodeId, updates) => set((state) => ({
    nodes: state.nodes.map((node) =>
      node.id === nodeId
        ? { ...node, data: { ...node.data, ...updates } }
        : node
    ),
  })),
  
  deleteNode: (nodeId) => set((state) => ({
    nodes: state.nodes.filter((node) => node.id !== nodeId),
    edges: state.edges.filter(
      (edge) => edge.source !== nodeId && edge.target !== nodeId
    ),
  })),
  
  addEdge: (edge) => set((state) => ({
    edges: [...state.edges, { ...edge, id: uuidv4() }],
  })),
  
  deleteEdge: (edgeId) => set((state) => ({
    edges: state.edges.filter((edge) => edge.id !== edgeId),
  })),
  
  // Add completed task to history
  addToHistory: (taskData) => set((state) => ({
    taskHistory: [
      {
        id: uuidv4(),
        completedAt: new Date().toISOString(),
        ...taskData
      },
      ...state.taskHistory
    ]
  })),
  
  // Save to localStorage
  saveToLocalStorage: () => {
    const state = get();
    localStorage.setItem('nodeFlow', JSON.stringify({
      nodes: state.nodes,
      edges: state.edges,
      isFocusMode: state.isFocusMode,
      taskHistory: state.taskHistory,
    }));
  },
  
  // Load from localStorage
  loadFromLocalStorage: () => {
    const saved = localStorage.getItem('nodeFlow');
    if (saved) {
      const { nodes, edges, isFocusMode, taskHistory } = JSON.parse(saved);
      set({ 
        nodes, 
        edges, 
        isFocusMode: isFocusMode || false,
        taskHistory: taskHistory || []
      });
    }
  },
  
  selectNode: (nodeId) => set({ selectedNodeId: nodeId }),
  clearSelectedNode: () => set({ selectedNodeId: null }),
}));

export default useNodeStore; 