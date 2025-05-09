import React, { useEffect } from 'react';
import ReactFlow from 'reactflow';
import NodeCanvas from './components/NodeCanvas';
import CustomNode from './components/CustomNode';
import useNodeStore from './store/nodeStore';
import 'reactflow/dist/style.css';

const nodeTypes = {
  custom: CustomNode,
};

function App() {
  const loadFromLocalStorage = useNodeStore((state) => state.loadFromLocalStorage);

  useEffect(() => {
    loadFromLocalStorage();
  }, [loadFromLocalStorage]);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <NodeCanvas nodeTypes={nodeTypes} />
      </div>
  );
}

export default App;
