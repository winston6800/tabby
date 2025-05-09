import React, { useState, useEffect } from 'react';
import useNodeStore from '../store/nodeStore';

const FocusMode = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const selectedNodeId = useNodeStore((state) => state.selectedNodeId);
  const nodes = useNodeStore((state) => state.nodes);
  const clearSelectedNode = useNodeStore((state) => state.clearSelectedNode);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => setIsRunning(true);
  const handleStop = () => setIsRunning(false);
  const handleReset = () => {
    setTime(0);
    setIsRunning(false);
  };

  if (!selectedNode) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      width: 320,
      height: '100vh',
      background: '#fff',
      boxShadow: '-2px 0 8px rgba(0,0,0,0.08)',
      padding: 24,
      zIndex: 10,
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
    }}>
      <button 
        style={{ alignSelf: 'flex-end' }} 
        onClick={clearSelectedNode}
      >
        ✕
      </button>
      
      <h2 style={{ margin: 0 }}>{selectedNode.data.title}</h2>
      
      <div style={{
        fontSize: '2.5em',
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#2c3e50',
        margin: '10px 0',
      }}>
        {formatTime(time)}
      </div>
      
      <div style={{
        display: 'flex',
        gap: 10,
        justifyContent: 'center',
      }}>
        {!isRunning ? (
          <button
            onClick={handleStart}
            style={{
              padding: '8px 16px',
              background: '#2ecc71',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Start
          </button>
        ) : (
          <button
            onClick={handleStop}
            style={{
              padding: '8px 16px',
              background: '#e74c3c',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Stop
          </button>
        )}
        <button
          onClick={handleReset}
          style={{
            padding: '8px 16px',
            background: '#95a5a6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Reset
        </button>
      </div>

      <div style={{ marginTop: 20 }}>
        <h3 style={{ margin: '0 0 10px 0' }}>Scope</h3>
        <div style={{
          padding: 12,
          background: '#f8f9fa',
          border: '1px solid #e9ecef',
          borderRadius: 6,
          fontSize: '0.9em',
          color: '#6c757d',
        }}>
          {selectedNode.data.description || 'No scope defined'}
        </div>
      </div>

      {selectedNode.data.tags && selectedNode.data.tags.length > 0 && (
        <div style={{ marginTop: 10 }}>
          <h3 style={{ margin: '0 0 10px 0' }}>Tags</h3>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {selectedNode.data.tags.map((tag, index) => (
              <span
                key={index}
                style={{
                  background: '#e0e0e0',
                  padding: '2px 6px',
                  borderRadius: 3,
                  fontSize: '12px',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FocusMode; 