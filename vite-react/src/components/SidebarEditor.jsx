import React from 'react';
import useNodeStore from '../store/nodeStore';

// SidebarEditor: Right sidebar for editing the selected node's properties (title, tags, color, size).
// Appears when a node is selected, updates node state in real time via Zustand store.
const SidebarEditor = () => {
  const nodes = useNodeStore((state) => state.nodes);
  const selectedNodeId = useNodeStore((state) => state.selectedNodeId);
  const updateNode = useNodeStore((state) => state.updateNode);
  const clearSelectedNode = useNodeStore((state) => state.clearSelectedNode);

  const node = nodes.find((n) => n.id === selectedNodeId);
  if (!node) return null;

  const handleChange = (field, value) => {
    updateNode(node.id, { [field]: value });
  };

  const handleTagChange = (e) => {
    handleChange('tags', e.target.value.split(',').map(t => t.trim()));
  };

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
      <button style={{ alignSelf: 'flex-end' }} onClick={clearSelectedNode}>✕</button>
      <h2>Edit Node</h2>
      <label>
        Title
        <input
          type="text"
          value={node.data.title}
          onChange={e => handleChange('title', e.target.value)}
          style={{ width: '100%' }}
        />
      </label>
      <label>
        Tags (comma separated)
        <input
          type="text"
          value={node.data.tags.join(', ')}
          onChange={handleTagChange}
          style={{ width: '100%' }}
        />
      </label>
      <label>
        Color
        <input
          type="color"
          value={node.data.color}
          onChange={e => handleChange('color', e.target.value)}
        />
      </label>
      <label>
        Size
        <input
          type="range"
          min={120}
          max={400}
          value={node.data.size}
          onChange={e => handleChange('size', Number(e.target.value))}
        />
        <span>{node.data.size}px</span>
      </label>
    </div>
  );
};

export default SidebarEditor; 