import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
} from 'reactflow';
import useNodeStore from '../store/nodeStore';
import SidebarEditor from './SidebarEditor';
import FocusMode from './FocusMode';
import 'reactflow/dist/style.css';

// NodeCanvas: Main canvas for displaying and interacting with nodes and edges using ReactFlow.
// Handles node creation, selection, and renders the sidebar editor for node editing.
// Integrates with Zustand store for state management.
const NodeCanvas = ({ nodeTypes }) => {
  const navigate = useNavigate();
  const { 
    nodes, 
    edges, 
    addNode, 
    onNodesChange, 
    onEdgesChange, 
    onConnect, 
    saveToLocalStorage, 
    selectNode,
    isFocusMode,
    toggleMode,
  } = useNodeStore();

  const handleAddNode = useCallback(() => {
    addNode({
      title: 'New Node',
      tags: ['new'],
      color: '#ffffff',
      size: 200,
    });
    saveToLocalStorage();
  }, [addNode, saveToLocalStorage]);

  const onNodeClick = useCallback((event, node) => {
    selectNode(node.id);
  }, [selectNode]);

<<<<<<< HEAD
  const handleSave = useCallback(() => {
    // Save to localStorage first
    saveToLocalStorage();
    // Redirect to login page
    window.location.href = '/login';
  }, [saveToLocalStorage]);
=======
  // Save Progress button handler
  const handleSaveProgress = () => {
    navigate('/login');
  };
>>>>>>> main

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <div style={{
        position: 'absolute',
        top: 10,
        left: 10,
        zIndex: 5,
        display: 'flex',
        gap: 10,
      }}>
        <button
          onClick={handleAddNode}
          style={{
            padding: '8px 16px',
            background: '#1a192b',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Add Node
        </button>
        <button
          onClick={toggleMode}
          style={{
            padding: '8px 16px',
            background: isFocusMode ? '#e74c3c' : '#2ecc71',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          {isFocusMode ? 'Edit Mode' : 'Focus Mode'}
        </button>
        <button
<<<<<<< HEAD
          onClick={handleSave}
          style={{
            padding: '8px 16px',
            background: '#3498db',
=======
          onClick={handleSaveProgress}
          style={{
            padding: '8px 16px',
            background: '#7a77ff',
>>>>>>> main
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Save Progress
        </button>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
      {isFocusMode ? <FocusMode /> : <SidebarEditor />}
    </div>
  );
};

export default NodeCanvas; 