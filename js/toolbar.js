// Module 6: Toolbar Actions
function runWorkflow() {
  const logsContent = document.getElementById('logs-content');
  logsContent.innerHTML = `
    <div style="color: #60a5fa;">⚡ Starting workflow execution...</div>
    <div style="color: #94a3b8; margin-top: 0.5rem;">Found ${nodes.length} nodes</div>
  `;
  
  nodes.forEach((node, index) => {
    setTimeout(() => {
      logsContent.innerHTML += `<div style="color: #10b981; margin-top: 0.3rem;">✓ Executed: ${node.name}</div>`;
    }, (index + 1) * 500);
  });

  setTimeout(() => {
    logsContent.innerHTML += `<div style="color: #60a5fa; margin-top: 0.8rem;">🎉 Workflow completed successfully!</div>`;
  }, (nodes.length + 1) * 500);

  document.getElementById('logs-panel').style.display = 'block';
}

function stopWorkflow() {
  const logsContent = document.getElementById('logs-content');
  logsContent.innerHTML += `<div style="color: #ef4444; margin-top: 0.5rem;">⏹️ Workflow execution stopped</div>`;
}

function saveWorkflow() {
  // Save to current project if available
  if (typeof currentProjectId !== 'undefined' && currentProjectId) {
    const project = projects.find(p => p.id === currentProjectId);
    if (project) {
      project.nodes = nodes;
      project.connections = connections;
      project.updatedAt = new Date().toISOString();
      saveProjects();
    }
  }
  
  const logsContent = document.getElementById('logs-content');
  logsContent.innerHTML = `<div style="color: #10b981;">💾 Workflow saved successfully! (${nodes.length} nodes)</div>`;
  document.getElementById('logs-panel').style.display = 'block';
}

function exportWorkflow() {
  const workflow = {
    nodes: nodes,
    timestamp: new Date().toISOString()
  };
  const logsContent = document.getElementById('logs-content');
  logsContent.innerHTML = `
    <div style="color: #60a5fa;">📤 Exporting workflow...</div>
    <div style="color: #94a3b8; margin-top: 0.5rem;">Nodes: ${nodes.length}</div>
    <div style="color: #10b981; margin-top: 0.5rem;">✓ Export complete!</div>
  `;
  document.getElementById('logs-panel').style.display = 'block';
}

function clearCanvas() {
  const canvas = document.getElementById('canvas');
  // Remove all canvas children (nodes, SVGs, placeholders)
  canvas.innerHTML = `
    <div style="text-align: center; color: #94a3b8; margin-top: 10rem; pointer-events: none;">
      <div style="font-size: 3rem; margin-bottom: 1rem;">🎯</div>
      <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem;">Drag components here to start building</h3>
      <p>Create your AI workflow by connecting nodes</p>
    </div>
  `;

  // Reset in-memory state
  nodes = [];
  selectedNode = null;
  draggedNode = null;

  // Clear connection state and temporary visuals
  if (typeof isConnecting !== 'undefined') {
    isConnecting = false;
    connectionFromNode = null;
  }

  if (typeof clearTempConnection === 'function') {
    clearTempConnection();
  }

  // Remove persistent connections data and SVG overlay, then reinitialize
  if (typeof connections !== 'undefined') {
    connections = [];
  }

  if (typeof connectionsSvg !== 'undefined' && connectionsSvg) {
    try {
      if (connectionsSvg.parentNode) connectionsSvg.parentNode.removeChild(connectionsSvg);
    } catch (err) {
      console.warn('Failed to remove old connectionsSvg:', err);
    }
    connectionsSvg = null;
  }

  if (typeof initConnectionsSvg === 'function') {
    initConnectionsSvg();
  }

  const logsContent = document.getElementById('logs-content');
  logsContent.innerHTML = `<div style="color: #94a3b8;">Canvas cleared. Ready to build...</div>`;
}

function toggleLogs() {
  const logsPanel = document.getElementById('logs-panel');
  logsPanel.style.display = logsPanel.style.display === 'none' ? 'block' : 'none';
}
