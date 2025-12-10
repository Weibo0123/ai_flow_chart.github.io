// Module 4: Node Management
function addNodeToCanvas(name, type, icon, x, y) {
  const nodeId = `node-${nodeIdCounter++}`;
  const node = document.createElement('div');
  node.className = 'canvas-node';
  node.id = nodeId;
  node.style.left = `${x}px`;
  node.style.top = `${y}px`;
  node.draggable = true;

  node.innerHTML = `
    <div class="delete-btn" onclick="deleteNode('${nodeId}')">×</div>
    <div style="font-size: 2rem; margin-bottom: 0.5rem;">${icon}</div>
    <div class="node-label">${name}</div>
    <div class="node-type">${type}</div>
  `;

  nodes.push({ id: nodeId, name, type, icon, x, y });

  node.addEventListener('click', () => selectNode(nodeId, name, type));
  node.addEventListener('dragstart', handleNodeDragStart);
  node.addEventListener('dragend', handleNodeDragEnd);

  const canvas = document.getElementById('canvas');
  const placeholder = canvas.querySelector('div[style*="pointer-events: none"]');
  if (placeholder) {
    placeholder.remove();
  }
  canvas.appendChild(node);
}

function handleNodeDragStart(e) {
  // Get the canvas-node element (in case a child element is clicked)
  const canvasNode = e.target.closest('.canvas-node');
  if (canvasNode) {
    draggedNode = canvasNode;
    e.dataTransfer.effectAllowed = 'move';
  }
}

function handleNodeDragEnd(e) {
  if (draggedNode) {
    const canvas = document.getElementById('canvas');
    const canvasRect = canvas.getBoundingClientRect();
    const x = e.clientX - canvasRect.left - 80;
    const y = e.clientY - canvasRect.top - 50;
    
    // Only update position if dropped within the canvas
    if (x >= 0 && y >= 0) {
      draggedNode.style.left = `${Math.max(0, x)}px`;
      draggedNode.style.top = `${Math.max(0, y)}px`;
    }
    
    draggedNode = null;
  }
}

function selectNode(nodeId, name, type) {
  document.querySelectorAll('.canvas-node').forEach(n => n.classList.remove('selected'));
  const node = document.getElementById(nodeId);
  if (node) {
    node.classList.add('selected');
    selectedNode = nodeId;
    updatePropertiesPanel(name, type);
  }
}

function deleteNode(nodeId) {
  const node = document.getElementById(nodeId);
  if (node) {
    node.remove();
    nodes = nodes.filter(n => n.id !== nodeId);
    
    if (selectedNode === nodeId) {
      selectedNode = null;
      const panel = document.querySelector('.properties-panel');
      panel.innerHTML = `
        <h3 class="panel-title">Properties</h3>
        <p style="color: #94a3b8; font-size: 0.95rem;">Select a node to view and edit its properties</p>
      `;
    }
  }
}
