import React, { useState, useEffect } from 'react';
import useNodeStore from '../store/nodeStore';

const FocusMode = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [scope, setScope] = useState('');
  const [expectedOutput, setExpectedOutput] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  
  const selectedNodeId = useNodeStore((state) => state.selectedNodeId);
  const nodes = useNodeStore((state) => state.nodes);
  const clearSelectedNode = useNodeStore((state) => state.clearSelectedNode);
  const updateNode = useNodeStore((state) => state.updateNode);
  const addToHistory = useNodeStore((state) => state.addToHistory);
  const taskHistory = useNodeStore((state) => state.taskHistory);

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

  useEffect(() => {
    if (selectedNode) {
      setScope(selectedNode.data.description || '');
      setExpectedOutput(selectedNode.data.expectedOutput || '');
    }
  }, [selectedNode]);

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

  const handleScopeChange = (e) => {
    setScope(e.target.value);
    if (selectedNode) {
      updateNode(selectedNode.id, { description: e.target.value });
    }
  };

  const handleExpectedOutputChange = (e) => {
    setExpectedOutput(e.target.value);
    if (selectedNode) {
      updateNode(selectedNode.id, { expectedOutput: e.target.value });
    }
  };

  const handleEnd = () => {
    if (selectedNode) {
      addToHistory({
        nodeId: selectedNode.id,
        title: selectedNode.data.title,
        description: scope,
        expectedOutput,
        timeSpent: time,
        tags: selectedNode.data.tags || []
      });
      handleReset();
      clearSelectedNode();
    }
  };

  if (!selectedNode && !showHistory) return null;

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
      overflowY: 'auto'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button 
          onClick={() => setShowHistory(!showHistory)}
          style={{
            padding: '8px 16px',
            background: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          {showHistory ? 'Back to Task' : 'View History'}
        </button>
        <button 
          style={{ 
            padding: '8px 16px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.2em'
          }} 
          onClick={clearSelectedNode}
        >
          ✕
        </button>
      </div>

      {showHistory ? (
        <div>
          <h2 style={{ margin: '0 0 16px 0' }}>Task History</h2>
          {taskHistory.length === 0 ? (
            <p style={{ color: '#666' }}>No completed tasks yet</p>
          ) : (
            taskHistory.map((task) => (
              <div
                key={task.id}
                style={{
                  padding: 16,
                  background: '#f8f9fa',
                  border: '1px solid #e9ecef',
                  borderRadius: 8,
                  marginBottom: 12,
                }}
              >
                <h3 style={{ margin: '0 0 8px 0' }}>{task.title}</h3>
                <p style={{ margin: '0 0 8px 0', color: '#666' }}>
                  <strong>Time Spent:</strong> {formatTime(task.timeSpent)}
                </p>
                <p style={{ margin: '0 0 8px 0', color: '#666' }}>
                  <strong>Completed:</strong> {new Date(task.completedAt).toLocaleString()}
                </p>
                <div style={{ marginTop: 8 }}>
                  <strong>Scope:</strong>
                  <p style={{ margin: '4px 0', color: '#666' }}>{task.description}</p>
                </div>
                <div style={{ marginTop: 8 }}>
                  <strong>Expected Output:</strong>
                  <p style={{ margin: '4px 0', color: '#666' }}>{task.expectedOutput}</p>
                </div>
                {task.tags && task.tags.length > 0 && (
                  <div style={{ marginTop: 8, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {task.tags.map((tag, index) => (
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
                )}
              </div>
            ))
          )}
        </div>
      ) : (
        <>
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
            <button
              onClick={handleEnd}
              style={{
                padding: '8px 16px',
                background: '#9b59b6',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              End Task
            </button>
          </div>

          <div style={{ marginTop: 20 }}>
            <h3 style={{ margin: '0 0 10px 0' }}>Scope</h3>
            <textarea
              value={scope}
              onChange={handleScopeChange}
              placeholder="Define the scope of your task..."
              style={{
                width: '100%',
                minHeight: '100px',
                padding: 12,
                background: '#f8f9fa',
                border: '1px solid #e9ecef',
                borderRadius: 6,
                fontSize: '0.9em',
                color: '#6c757d',
                resize: 'vertical',
              }}
            />
          </div>

          <div style={{ marginTop: 20 }}>
            <h3 style={{ margin: '0 0 10px 0' }}>Expected Output</h3>
            <textarea
              value={expectedOutput}
              onChange={handleExpectedOutputChange}
              placeholder="What do you expect to achieve?"
              style={{
                width: '100%',
                minHeight: '100px',
                padding: 12,
                background: '#f8f9fa',
                border: '1px solid #e9ecef',
                borderRadius: 6,
                fontSize: '0.9em',
                color: '#6c757d',
                resize: 'vertical',
              }}
            />
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
        </>
      )}
    </div>
  );
};

export default FocusMode; 