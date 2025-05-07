import React, { useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
} from 'reactflow';
import useNodeStore from '../store/nodeStore';
import 'reactflow/dist/style.css';

const NodeCanvas = ({ nodeTypes }) => {
  const { nodes, edges, addNode, onNodesChange, onEdgesChange, onConnect, saveToLocalStorage } = useNodeStore();

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
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};

export default NodeCanvas; 