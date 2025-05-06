// Track the current mode (add, point, delete, edit)
let mode = 'add';

// Arrays to store nodes and edges
let nodes = [];
let edges = [];

// Track selected node (used in point mode)
let selectedNode = null;

// Used to give each node a unique ID
let nodeId = 0;

// Change the current mode
function setMode(newMode) {
  mode = newMode;
  selectedNode = null; // reset selection when changing modes
}

// Handle canvas clicks for adding nodes
function handleCanvasClick(event) {
  // Only add nodes in "add" mode
  if (mode !== 'add') return;

  // Only allow clicks on the canvas, not on a node
  if (event.target.id !== 'canvas') return;

  // Create a new node object
  let newNode = {
    id: nodeId++,
    label: 'Node',
    x: event.offsetX,
    y: event.offsetY
  };

  nodes.push(newNode); // add the node to the list
  render(); // update the display
}

// Redraw all nodes and edges
function render() {
  const canvas = document.getElementById('canvas');

  // Remove all existing node elements
  const existingNodes = document.querySelectorAll('.node');
  existingNodes.forEach(function (n) {
    canvas.removeChild(n);
  });

  // Clear all lines (edges) from the SVG
  const lineGroup = document.getElementById('lines');
  lineGroup.innerHTML = '';

  // Draw each edge as a line with an arrow
  edges.forEach(function (edge) {
    const fromNode = nodes.find(n => n.id === edge.from);
    const toNode = nodes.find(n => n.id === edge.to);

    if (!fromNode || !toNode) return;

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', fromNode.x);
    line.setAttribute('y1', fromNode.y);
    line.setAttribute('x2', toNode.x);
    line.setAttribute('y2', toNode.y);
    line.setAttribute('stroke', 'black');
    line.setAttribute('marker-end', 'url(#arrow)');

    lineGroup.appendChild(line);
  });

  // Draw each node as a clickable div
  nodes.forEach(function (node) {
    const div = document.createElement('div');
    div.className = 'node';
    div.style.left = node.x + 'px';
    div.style.top = node.y + 'px';
    div.textContent = node.label;

    // Handle click on a node
    div.onclick = function (e) {
      e.stopPropagation(); // don't trigger canvas click

      if (mode === 'point') {
        // In point mode: connect nodes
        if (!selectedNode) {
          selectedNode = node;
        } else {
          if (selectedNode.id !== node.id) {
            edges.push({ from: selectedNode.id, to: node.id });
          }
          selectedNode = null;
          render();
        }
      } else if (mode === 'edit') {
        // In edit mode: change label
        const input = document.createElement('input');
        input.type = 'text';
        input.value = node.label;
        input.className = 'edit-label';

        div.textContent = ''; // clear node text
        div.appendChild(input);
        input.focus();

        // Save on blur
        input.onblur = function () {
          node.label = input.value;
          render();
        };

        // Save on Enter key
        input.onkeydown = function (e) {
          if (e.key === 'Enter') {
            input.blur();
          }
        };
      }
    };

    // Handle double-click on a node for deleting
    div.ondblclick = function (e) {
      e.stopPropagation(); // don't trigger canvas click
      if (mode === 'delete') {
        // Remove the node and its connected edges
        nodes = nodes.filter(n => n.id !== node.id);
        edges = edges.filter(e => e.from !== node.id && e.to !== node.id);
        render();
      }
    };

    // Add the node to the canvas
    canvas.appendChild(div);
  });
}

// Initial render on page load
render();
