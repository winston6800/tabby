import React, { useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
} from 'reactflow';
import useNodeStore from '../store/nodeStore';
import SidebarEditor from './SidebarEditor';
import 'reactflow/dist/style.css';

// NodeCanvas: Main canvas for displaying and interacting with nodes and edges using ReactFlow.
// Handles node creation, selection, and renders the sidebar editor for node editing.
// Integrates with Zustand store for state management.
const NodeCanvas = ({ nodeTypes }) => {
  const { nodes, edges, addNode, onNodesChange, onEdgesChange, onConnect, saveToLocalStorage, selectNode } = useNodeStore();

  const handleAddNode = useCallback(() => {
    addNode({
      title: 'New Node',
      description: 'Click to edit',
      tags: ['new'],
      color: '#ffffff',
      size: 200,
    });
    saveToLocalStorage();
  }, [addNode, saveToLocalStorage]);

  const onNodeClick = useCallback((event, node) => {
    selectNode(node.id);
  }, [selectNode]);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <button
        onClick={handleAddNode}
        style={{
          position: 'absolute',
          top: 10,
          left: 10,
          zIndex: 5,
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
      <SidebarEditor />
    </div>
  );
};

export default NodeCanvas; 