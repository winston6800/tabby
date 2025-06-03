import React, { useState, useEffect } from 'react';
import useNodeStore from '../store/nodeStore';

const FocusMode = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [scope, setScope] = useState('');
  const [expectedOutput, setExpectedOutput] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  
  const userValue = useNodeStore((state) => state.userValue);
  const setUserValue = useNodeStore((state) => state.setUserValue);

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

  const burnRatePerSecond = userValue / 3600;
  const totalBurned = (burnRatePerSecond * time);

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
        tags: selectedNode.data.tags || [],
        moneyBurned: Number((burnRatePerSecond * time).toFixed(2)),
      });
      handleReset();
      clearSelectedNode();
    }
  };

  if (!selectedNode && !showHistory) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: 360,
        height: '100vh',
        background: '#fff',
        boxShadow: '-2px 0 8px rgba(0,0,0,0.08)',
        padding: 32,
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
        overflowY: 'auto',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <button
          onClick={() => setShowHistory(!showHistory)}
          style={{
            padding: '8px 20px',
            background: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 600,
            fontSize: 16,
            cursor: 'pointer',
          }}
        >
          {showHistory ? 'Back to Task' : 'View History'}
        </button>
        <button
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.5em',
            color: '#888',
          }}
          onClick={clearSelectedNode}
          aria-label="Close"
        >
          ✕
        </button>
      </div>

      {showHistory ? (
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>Task History</h2>
          {taskHistory.length === 0 ? (
            <div>No completed tasks yet.</div>
          ) : (
            taskHistory.map((task) => (
              <div key={task.id} style={{
                border: '1px solid #eee',
                borderRadius: 6,
                padding: 12,
                marginBottom: 12,
                background: '#fafafa'
              }}>
                <div style={{ fontWeight: 600 }}>{task.title}</div>
                <div style={{ fontSize: 13, color: '#888' }}>
                  {new Date(task.completedAt).toLocaleString()}
                </div>
                <div style={{ margin: '8px 0' }}>
                  <b>Time Spent:</b> {formatTime(task.timeSpent)}
                </div>
                <div>
                  <b>Scope:</b> {task.description}
                </div>
                <div>
                  <b>Expected Output:</b> {task.expectedOutput}
                </div>
                <div style={{ color: 'red', fontWeight: 600, marginTop: 4 }}>
                  Money Burned: ${task.moneyBurned?.toFixed(2) ?? '0.00'}
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
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 24 }}>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#2c3e50', letterSpacing: 0.2 }}>
              {selectedNode.data.title}
            </h2>
          </div>

          <div
            style={{
              fontSize: 54,
              fontWeight: 800,
              color: '#1a192b',
              textAlign: 'center',
              margin: '0 0 12px 0',
              letterSpacing: 2,
              lineHeight: 1.1,
            }}
          >
            {formatTime(time)}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 12 }}>
            <label
              htmlFor="hourly-rate"
              style={{
                fontWeight: 500,
                fontSize: 16,
                marginBottom: 4,
                color: '#222',
                letterSpacing: 0.2,
              }}
            >
              Your Hourly Rate ($/hr)
            </label>
            <input
              id="hourly-rate"
              type="number"
              min="0"
              value={userValue}
              onChange={e => setUserValue(Number(e.target.value))}
              style={{
                width: 100,
                padding: '8px 12px',
                border: '1px solid #ccc',
                borderRadius: 6,
                fontSize: 16,
                textAlign: 'center',
                fontFamily: 'inherit',
                fontWeight: 500,
                marginBottom: 4,
              }}
            />
          </div>

          <div style={{ textAlign: 'center', marginBottom: 8 }}>
            <div
              style={{
                color: '#e74c3c',
                fontWeight: 700,
                fontSize: 18,
                marginBottom: 2,
              }}
            >
              Burn Rate: ${burnRatePerSecond.toFixed(4)}/sec
            </div>
            <div
              style={{
                color: '#c0392b',
                fontWeight: 600,
                fontSize: 16,
              }}
            >
              Total Burned: ${totalBurned.toFixed(2)}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              gap: 12,
              justifyContent: 'center',
              margin: '18px 0 24px 0',
            }}
          >
            <button
              onClick={handleStart}
              disabled={isRunning}
              style={{
                padding: '10px 22px',
                background: '#2ecc71',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: isRunning ? 'not-allowed' : 'pointer',
                fontWeight: 700,
                fontSize: 16,
                boxShadow: isRunning ? 'none' : '0 2px 8px rgba(46,204,113,0.08)',
                transition: 'background 0.2s',
              }}
            >
              Start
            </button>
            <button
              onClick={handleReset}
              style={{
                padding: '10px 22px',
                background: '#bdc3c7',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: 16,
              }}
            >
              Reset
            </button>
            <button
              onClick={handleEnd}
              style={{
                padding: '10px 22px',
                background: '#8e44ad',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: 16,
              }}
            >
              End Task
            </button>
          </div>

          <div style={{ marginTop: 8 }}>
            <label style={{ fontWeight: 600, fontSize: 15, color: '#222' }}>Scope</label>
            <textarea
              value={scope}
              onChange={handleScopeChange}
              rows={3}
              style={{
                width: '100%',
                padding: 10,
                border: '1px solid #ccc',
                borderRadius: 6,
                fontSize: 15,
                marginTop: 4,
                fontFamily: 'inherit',
              }}
            />
          </div>
          <div style={{ marginTop: 16 }}>
            <label style={{ fontWeight: 600, fontSize: 15, color: '#222' }}>Expected Output</label>
            <textarea
              value={expectedOutput}
              onChange={handleExpectedOutputChange}
              rows={3}
              style={{
                width: '100%',
                padding: 10,
                border: '1px solid #ccc',
                borderRadius: 6,
                fontSize: 15,
                marginTop: 4,
                fontFamily: 'inherit',
              }}
            />
          </div>
          {selectedNode.data.tags && selectedNode.data.tags.length > 0 && (
            <div style={{ marginTop: 18 }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: 15, fontWeight: 600, color: '#222' }}>Tags</h3>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {selectedNode.data.tags.map((tag, index) => (
                  <span
                    key={index}
                    style={{
                      background: '#e0e0e0',
                      padding: '3px 10px',
                      borderRadius: 4,
                      fontSize: 13,
                      fontWeight: 500,
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