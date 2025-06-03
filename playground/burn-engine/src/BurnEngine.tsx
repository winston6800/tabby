import React, { useState, useRef, useEffect } from 'react';
import { FaMinus, FaPaperPlane, FaPlay, FaPause, FaPlus } from 'react-icons/fa';

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

interface OpenLoop {
  id: number;
  name: string;
  time: number;
}

interface Loop {
  id: number;
  title: string;
  isChecked: boolean;
  time: number;
  isActive: boolean;
  rate: number; // $/hr
}

function OpenLoopsDashboard({ mainTaskActive, pauseMainTask }: { mainTaskActive: boolean, pauseMainTask: () => void }) {
  const [loops, setLoops] = useState<Loop[]>([]);
  const [input, setInput] = useState('');
  const [minimized, setMinimized] = useState(false);
  const [activeId, setActiveId] = useState<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Timer effect for active loop
  useEffect(() => {
    if (activeId == null) return;
    const interval = setInterval(() => {
      setLoops(ls => ls.map(l => l.id === activeId ? { ...l, time: l.time + 1 } : l));
    }, 1000);
    return () => clearInterval(interval);
  }, [activeId]);

  // Auto-expand textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [input]);

  const handleAdd = () => {
    if (input.trim()) {
      setLoops([
        {
          id: Date.now(),
          title: input,
          isChecked: false,
          time: 0,
          isActive: false,
          rate: 1000, // $/hr default
        },
        ...loops,
      ]);
      setInput('');
    }
  };

  const handlePlayPause = (id: number) => {
    if (activeId === id) {
      setLoops(ls => ls.map(l => l.id === id ? { ...l, isActive: false } : l));
      setActiveId(null);
    } else {
      pauseMainTask(); // Pause main task if running
      setLoops(ls => ls.map(l => l.id === id ? { ...l, isActive: true } : { ...l, isActive: false }));
      setActiveId(id);
    }
  };

  const handleCheck = (id: number) => {
    setLoops(ls => ls.filter(l => l.id !== id));
  };

  const calcCost = (loop: Loop) => ((loop.time / 3600) * loop.rate).toFixed(2);

  return (
    <div style={{ maxWidth: 400, background: '#faf9f7', borderRadius: 12, boxShadow: '0 2px 12px #0001', padding: 20, margin: '2rem auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ fontWeight: 700, fontSize: 18, color: '#222' }}>Open Loops</span>
        <button
          onClick={() => setMinimized(m => !m)}
          style={{ background: minimized ? '#f1f1f1' : '#eee', border: 'none', borderRadius: 8, boxShadow: '0 1px 4px #0001', fontSize: 18, cursor: 'pointer', color: '#888', padding: 6, transition: 'background 0.2s' }}
          title={minimized ? 'Expand' : 'Minimize'}
        >
          {minimized ? <FaPlus /> : <FaMinus />}
        </button>
      </div>
      {!minimized && (
        <>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 16 }}>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Add a distraction or open loop"
              rows={1}
              style={{ flex: 1, resize: 'none', border: '1px solid #ddd', borderRadius: 6, padding: '8px 10px', fontSize: 15, minHeight: 36, maxHeight: 80, overflow: 'auto', background: '#fff' }}
            />
            <button
              onClick={handleAdd}
              style={{ background: '#eee', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginTop: 2 }}
              title="Add"
            >
              <FaPaperPlane size={14} />
            </button>
          </div>
          <div>
            {loops.map(loop => (
              <div key={loop.id} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', borderRadius: 8, marginBottom: 10, padding: '8px 10px', boxShadow: '0 1px 2px #0001' }}>
                <input type="checkbox" checked={loop.isChecked} onChange={() => handleCheck(loop.id)} style={{ marginRight: 6, cursor: 'pointer' }} />
                <span style={{ flex: 1, fontWeight: 500, fontSize: 15, color: '#222', whiteSpace: 'pre-line' }}>{loop.title}</span>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', minWidth: 70 }}>
                  <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600, fontSize: 14 }}>{formatTime(loop.time)}</span>
                  <span style={{ color: '#e74c3c', fontWeight: 700, fontSize: 13 }}>${calcCost(loop)} spent</span>
                </div>
                <button
                  onClick={() => handlePlayPause(loop.id)}
                  style={{ background: loop.isActive ? '#e0e7ff' : '#222', color: loop.isActive ? '#222' : '#fff', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 8, fontSize: 16, cursor: 'pointer', boxShadow: loop.isActive ? '0 0 8px #a5b4fc' : undefined }}
                  title={loop.isActive ? 'Pause' : 'Play'}
                  disabled={mainTaskActive && !loop.isActive}
                >
                  {loop.isActive ? <FaPause /> : <FaPlay />}
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function BurnEngine() {
  const [hourlyRate, setHourlyRate] = useState<number>(() => {
    const saved = localStorage.getItem('burnEngine_hourlyRate');
    return saved ? Number(saved) : 90;
  });
  const [timer, setTimer] = useState<number>(() => {
    const saved = localStorage.getItem('burnEngine_timer');
    return saved ? Number(saved) : 0;
  });
  const [isRunning, setIsRunning] = useState<boolean>(() => {
    const saved = localStorage.getItem('burnEngine_isRunning');
    return saved ? JSON.parse(saved) : false;
  });
  const [openLoops, setOpenLoops] = useState<OpenLoop[]>(() => {
    const saved = localStorage.getItem('burnEngine_openLoops');
    return saved ? JSON.parse(saved) : [];
  });
  const [showOpenLoops, setShowOpenLoops] = useState<boolean>(() => {
    const saved = localStorage.getItem('burnEngine_showOpenLoops');
    return saved ? JSON.parse(saved) : true;
  });
  const [newLoopName, setNewLoopName] = useState<string>('');
  const [newLoopTimer, setNewLoopTimer] = useState<number>(0);
  const newLoopInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const [currentTask, setCurrentTask] = useState<string>(() => {
    const saved = localStorage.getItem('burnEngine_currentTask');
    return saved || 'Define product strategy';
  });
  const [taskHistory, setTaskHistory] = useState<{ name: string; amount: string }[]>(() => {
    const saved = localStorage.getItem('burnEngine_taskHistory');
    return saved ? JSON.parse(saved) : [];
  });

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('burnEngine_hourlyRate', hourlyRate.toString());
  }, [hourlyRate]);
  useEffect(() => {
    localStorage.setItem('burnEngine_timer', timer.toString());
  }, [timer]);
  useEffect(() => {
    localStorage.setItem('burnEngine_isRunning', JSON.stringify(isRunning));
  }, [isRunning]);
  useEffect(() => {
    localStorage.setItem('burnEngine_openLoops', JSON.stringify(openLoops));
  }, [openLoops]);
  useEffect(() => {
    localStorage.setItem('burnEngine_showOpenLoops', JSON.stringify(showOpenLoops));
  }, [showOpenLoops]);
  useEffect(() => {
    localStorage.setItem('burnEngine_currentTask', currentTask);
  }, [currentTask]);
  useEffect(() => {
    localStorage.setItem('burnEngine_taskHistory', JSON.stringify(taskHistory));
  }, [taskHistory]);

  // Main work timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isRunning) {
      interval = setInterval(() => setTimer(t => t + 1), 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  // New open loop timer
  useEffect(() => {
    if (newLoopInterval.current) clearInterval(newLoopInterval.current);
    if (newLoopName) {
      newLoopInterval.current = setInterval(() => setNewLoopTimer(t => t + 1), 1000);
    }
    return () => {
      if (newLoopInterval.current) clearInterval(newLoopInterval.current);
    };
  }, [newLoopName]);

  const moneySpent = ((timer / 3600) * hourlyRate).toFixed(2);

  const handleAddOpenLoop = () => {
    if (newLoopName.trim()) {
      setOpenLoops([...openLoops, { id: Date.now(), name: newLoopName, time: newLoopTimer }]);
      setNewLoopName('');
      setNewLoopTimer(0);
    }
  };

  // Add a function to pause the main task
  const pauseMainTask = () => {
    setIsRunning(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', fontFamily: 'Inter, sans-serif', background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px #0001', padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <span style={{ fontWeight: 600, fontSize: 15 }}>Your hourly value</span>
        <input
          type="number"
          value={hourlyRate}
          min={1}
          onChange={e => setHourlyRate(Number(e.target.value))}
          style={{ width: 70, border: '1px solid #ddd', borderRadius: 4, padding: '2px 6px', fontWeight: 600, marginLeft: 8 }}
        />
        <span style={{ marginLeft: 4, fontWeight: 500, color: '#888' }}>$ / hr</span>
        <span style={{ marginLeft: 'auto', color: Number(moneySpent) > 0 ? '#e74c3c' : '#333', fontWeight: 700, fontVariantNumeric: 'tabular-nums', fontSize: 16 }}>
          -${moneySpent}
        </span>
      </div>
      <h2 style={{ fontWeight: 700, fontSize: 20, marginBottom: 8 }}>Work on the one thing</h2>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <input
          type="text"
          value={currentTask}
          onChange={e => setCurrentTask(e.target.value)}
          style={{ flex: 1, border: 'none', background: '#f5f5f5', borderRadius: 6, padding: '6px 10px', fontWeight: 500 }}
        />
        <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{formatTime(timer)}</span>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button
          onClick={() => {
            // If any open loop is active, pause it
            const openLoopsDashboard = document.querySelector('[data-open-loops-dashboard]');
            if (openLoopsDashboard) {
              // This is a hack; ideally, state would be lifted up
              // but for now, we just pause all open loops
              // (no-op here, handled in OpenLoopsDashboard)
            }
            setIsRunning(r => !r);
          }}
          style={{ flex: 1, padding: '8px 0', borderRadius: 6, background: isRunning ? '#e74c3c' : '#27ae60', color: '#fff', fontWeight: 700, border: 'none' }}
          disabled={isRunning ? false : undefined}
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={() => {
            if (currentTask.trim()) {
              setTaskHistory([{ name: currentTask, amount: moneySpent }, ...taskHistory]);
              setCurrentTask('');
              setTimer(0);
              setIsRunning(false);
            }
          }}
          style={{ flex: 1, padding: '8px 0', borderRadius: 6, background: '#3498db', color: '#fff', fontWeight: 700, border: 'none' }}
        >
          Finish Task
        </button>
      </div>
      <OpenLoopsDashboard mainTaskActive={isRunning} pauseMainTask={pauseMainTask} />
      <div style={{ display: 'flex', gap: 24 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <span>Set yourself the value of</span>
            <input
              type="number"
              value={hourlyRate}
              min={1}
              onChange={e => setHourlyRate(Number(e.target.value))}
              style={{ width: 70, border: '1px solid #ddd', borderRadius: 4, padding: '2px 6px', fontWeight: 600 }}
            />
            <span>$ / hr</span>
            <span style={{ marginLeft: 'auto', color: Number(moneySpent) > 0 ? '#e74c3c' : '#333', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
              -${moneySpent}
            </span>
          </div>
        </div>
        <div style={{ minWidth: 180, background: '#fafbfc', borderRadius: 8, padding: 12, boxShadow: '0 1px 4px #0001', height: 'fit-content' }}>
          <h4 style={{ margin: '0 0 8px 0', fontWeight: 700, fontSize: 15 }}>Task History</h4>
          {taskHistory.length === 0 && <div style={{ color: '#bbb', fontSize: 13 }}>No tasks finished yet.</div>}
          {taskHistory.map((task, idx) => (
            <div key={idx} style={{ marginBottom: 8, padding: 8, background: '#fff', borderRadius: 6, boxShadow: '0 1px 2px #0001', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 500, fontSize: 14 }}>{task.name || <em>Untitled</em>}</span>
              <span style={{ color: '#e74c3c', fontWeight: 700, fontVariantNumeric: 'tabular-nums', marginLeft: 8 }}>${task.amount}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 