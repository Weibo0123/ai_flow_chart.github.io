// Module 9: Connection Lines Management
let connections = [];
let connectionsSvg = null;

function initConnectionsSvg() {
  const canvas = document.getElementById('canvas');
  
  // Remove old SVG if exists
  if (connectionsSvg && connectionsSvg.parentNode) {
    connectionsSvg.parentNode.removeChild(connectionsSvg);
  }

  // Create SVG for drawing lines
  connectionsSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  connectionsSvg.classList.add('connections-svg');
  connectionsSvg.style.position = 'absolute';
  connectionsSvg.style.top = '0';
  connectionsSvg.style.left = '0';
  connectionsSvg.style.width = '100%';
  connectionsSvg.style.height = '100%';
  connectionsSvg.style.pointerEvents = 'none';
  connectionsSvg.style.zIndex = '5';

  canvas.insertBefore(connectionsSvg, canvas.firstChild);
  
  // Add defs for arrow markers
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  const arrowMarker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
  arrowMarker.setAttribute('id', 'arrow-marker');
  arrowMarker.setAttribute('markerWidth', '10');
  arrowMarker.setAttribute('markerHeight', '10');
  arrowMarker.setAttribute('refX', '8');
  arrowMarker.setAttribute('refY', '5');
  arrowMarker.setAttribute('orient', 'auto');
  
  const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
  polygon.setAttribute('points', '0,0 10,5 0,10');
  polygon.setAttribute('fill', '#818cf8');
  arrowMarker.appendChild(polygon);
  defs.appendChild(arrowMarker);
  connectionsSvg.appendChild(defs);
}

function drawConnections() {
  if (!connectionsSvg) initConnectionsSvg();
  
  // Remove all children except defs
  const defs = connectionsSvg.querySelector('defs');
  while (connectionsSvg.firstChild) {
    connectionsSvg.removeChild(connectionsSvg.firstChild);
  }
  
  // Re-add defs
  if (defs) {
    connectionsSvg.appendChild(defs);
  } else {
    const newDefs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const arrowMarker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
    arrowMarker.setAttribute('id', 'arrow-marker');
    arrowMarker.setAttribute('markerWidth', '10');
    arrowMarker.setAttribute('markerHeight', '10');
    arrowMarker.setAttribute('refX', '8');
    arrowMarker.setAttribute('refY', '5');
    arrowMarker.setAttribute('orient', 'auto');
    
    const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    polygon.setAttribute('points', '0,0 10,5 0,10');
    polygon.setAttribute('fill', '#818cf8');
    arrowMarker.appendChild(polygon);
    newDefs.appendChild(arrowMarker);
    connectionsSvg.appendChild(newDefs);
  }

  if (connections.length === 0) return;

  const canvas = document.getElementById('canvas');

  connections.forEach((conn) => {
    const fromNode = document.getElementById(conn.from);
    const toNode = document.getElementById(conn.to);

    if (fromNode && toNode) {
      const canvasRect = canvas.getBoundingClientRect();

      // Get any handle from both nodes to draw the connection
      const fromHandle = fromNode.querySelector('.handle');
      const toHandle = toNode.querySelector('.handle');

      if (fromHandle && toHandle) {
        const fromHandleRect = fromHandle.getBoundingClientRect();
        const toHandleRect = toHandle.getBoundingClientRect();

        // Calculate positions relative to canvas
        const x1 = fromHandleRect.left - canvasRect.left + fromHandleRect.width / 2;
        const y1 = fromHandleRect.top - canvasRect.top + fromHandleRect.height / 2;
        const x2 = toHandleRect.left - canvasRect.left + toHandleRect.width / 2;
        const y2 = toHandleRect.top - canvasRect.top + toHandleRect.height / 2;

        // Draw curved line
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const controlX = (x1 + x2) / 2;
        const d = `M ${x1} ${y1} Q ${controlX} ${y1}, ${controlX} ${(y1 + y2) / 2} T ${x2} ${y2}`;
        
        path.setAttribute('d', d);
        path.setAttribute('stroke', '#818cf8');
        path.setAttribute('stroke-width', '2');
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke-linecap', 'round');
        path.setAttribute('marker-end', 'url(#arrow-marker)');
        
        connectionsSvg.appendChild(path);
      }
    }
  });
}

function addConnection(fromNodeId, toNodeId) {
  // Check if connection already exists
  const exists = connections.some(c => c.from === fromNodeId && c.to === toNodeId);
  if (!exists) {
    connections.push({ from: fromNodeId, to: toNodeId });
    drawConnections();
  }
}

function removeConnection(fromNodeId, toNodeId) {
  connections = connections.filter(c => !(c.from === fromNodeId && c.to === toNodeId));
  drawConnections();
}

function removeNodeConnections(nodeId) {
  connections = connections.filter(c => c.from !== nodeId && c.to !== nodeId);
  drawConnections();
}

function redrawConnections() {
  drawConnections();
}

// Set up continuous redraw to handle node movements
setInterval(() => {
  if (connections.length > 0) {
    drawConnections();
  }
}, 100);
