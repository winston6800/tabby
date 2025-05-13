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
    // Note: Unsure if you want this to be main but you need to declare something to be main
    // as per your test
    <main style={{ width: '100vw', height: '100vh' }}>
      <NodeCanvas nodeTypes={nodeTypes} />
    </main>
  );
}

export default App;
