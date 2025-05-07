import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { applyNodeChanges, applyEdgeChanges } from 'reactflow';

const useNodeStore = create((set, get) => ({
  nodes: [],
  edges: [],
  
  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
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
    nodes: [...state.nodes, {
      id: uuidv4(),
      type: 'custom',
      position: { x: 100, y: 100 },
      data: {
        title: nodeData.title || 'New Node',
        description: nodeData.description || '',
        tags: nodeData.tags || [],
        color: nodeData.color || '#ffffff',
        size: nodeData.size || 200,
      },
    }],
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
  
  // Save to localStorage
  saveToLocalStorage: () => {
    const state = get();
    localStorage.setItem('nodeFlow', JSON.stringify({
      nodes: state.nodes,
      edges: state.edges,
    }));
  },
  
  // Load from localStorage
  loadFromLocalStorage: () => {
    const saved = localStorage.getItem('nodeFlow');
    if (saved) {
      const { nodes, edges } = JSON.parse(saved);
      set({ nodes, edges });
    }
  },
}));

export default useNodeStore; 