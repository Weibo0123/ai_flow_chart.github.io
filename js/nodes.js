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
    <div class="connection-handles">
      <div class="handle input-handle" title="Connect from previous node"></div>
      <div class="handle output-handle" title="Connect to next node"></div>
    </div>
  `;

  nodes.push({ id: nodeId, name, type, icon, x, y });

  node.addEventListener('click', () => selectNode(nodeId, name, type));
  node.addEventListener('dragstart', handleNodeDragStart);
  node.addEventListener('dragend', handleNodeDragEnd);

  // Add connection handle events
  const outputHandle = node.querySelector('.output-handle');
  const inputHandle = node.querySelector('.input-handle');
  
  outputHandle.addEventListener('mousedown', (e) => startConnection(e, nodeId, 'output'));
  inputHandle.addEventListener('mousedown', (e) => startConnection(e, nodeId, 'input'));

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
    redrawConnections();
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
    removeNodeConnections(nodeId);
    redrawConnections();
    
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

// Connection drawing
let isConnecting = false;
let connectionFromNode = null;

function startConnection(e, nodeId, handleType) {
  e.preventDefault();
  e.stopPropagation();
  
  isConnecting = true;
  connectionFromNode = { id: nodeId, type: handleType };
  
  const canvas = document.getElementById('canvas');
  canvas.style.cursor = 'crosshair';
}

function drawTempConnectionLine(mouseX, mouseY) {
  const canvas = document.getElementById('canvas');
  
  if (!connectionFromNode) return;
  
  const fromNode = document.getElementById(connectionFromNode.id);
  if (!fromNode) return;
  
  const fromHandle = connectionFromNode.type === 'output' 
    ? fromNode.querySelector('.output-handle')
    : fromNode.querySelector('.input-handle');
  
  if (!fromHandle) return;
  
  const fromHandleRect = fromHandle.getBoundingClientRect();
  const canvasRect = canvas.getBoundingClientRect();
  
  const x1 = fromHandleRect.left - canvasRect.left + fromHandleRect.width / 2;
  const y1 = fromHandleRect.top - canvasRect.top + fromHandleRect.height / 2;
  const x2 = mouseX - canvasRect.left;
  const y2 = mouseY - canvasRect.top;
  
  // Get or create temporary SVG
  let tempSvg = canvas.querySelector('svg.temp-connection');
  if (!tempSvg) {
    tempSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    tempSvg.classList.add('temp-connection');
    tempSvg.style.position = 'absolute';
    tempSvg.style.top = '0';
    tempSvg.style.left = '0';
    tempSvg.style.width = '100%';
    tempSvg.style.height = '100%';
    tempSvg.style.pointerEvents = 'none';
    tempSvg.style.zIndex = '6';
    canvas.appendChild(tempSvg);
  }
  
  tempSvg.innerHTML = '';
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  const controlX = (x1 + x2) / 2;
  const d = `M ${x1} ${y1} Q ${controlX} ${y1}, ${controlX} ${(y1 + y2) / 2} T ${x2} ${y2}`;
  
  path.setAttribute('d', d);
  path.setAttribute('stroke', '#60a5fa');
  path.setAttribute('stroke-width', '2');
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke-dasharray', '5,5');
  path.setAttribute('stroke-linecap', 'round');
  
  tempSvg.appendChild(path);
}

function clearTempConnection() {
  const canvas = document.getElementById('canvas');
  const tempSvg = canvas.querySelector('svg.temp-connection');
  if (tempSvg) {
    tempSvg.remove();
  }
}

document.addEventListener('mousemove', (e) => {
  if (isConnecting && connectionFromNode) {
    drawTempConnectionLine(e.clientX, e.clientY);
  }
});

document.addEventListener('mouseup', (e) => {
  if (isConnecting && connectionFromNode) {
    const handle = e.target.closest('.handle');
    
    if (handle) {
      const toNode = handle.closest('.canvas-node');
      
      if (toNode && toNode.id !== connectionFromNode.id) {
        // Connect from current node to target node, regardless of handle side
        addConnection(connectionFromNode.id, toNode.id);
      }
    }
    
    isConnecting = false;
    connectionFromNode = null;
    const canvas = document.getElementById('canvas');
    canvas.style.cursor = 'default';
    clearTempConnection();
  }
});
