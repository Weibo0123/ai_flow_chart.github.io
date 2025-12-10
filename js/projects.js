// Module: Project Management
let projects = [];
let currentProjectId = null;

// Initialize projects from localStorage
function initializeProjects() {
  const stored = localStorage.getItem('aiFlowChartProjects');
  if (stored) {
    projects = JSON.parse(stored);
  }
  renderProjectsList();
}

// Save projects to localStorage
function saveProjects() {
  localStorage.setItem('aiFlowChartProjects', JSON.stringify(projects));
}

// Open new project dialog
function openNewProjectDialog() {
  document.getElementById('project-modal').style.display = 'flex';
  document.getElementById('project-name').value = '';
  document.getElementById('project-description').value = '';
  document.getElementById('project-name').focus();
}

// Close new project dialog
function closeNewProjectDialog() {
  document.getElementById('project-modal').style.display = 'none';
}

// Create a new project
function createNewProject() {
  const name = document.getElementById('project-name').value.trim();
  const description = document.getElementById('project-description').value.trim();

  if (!name) {
    alert('Project name is required');
    return;
  }

  const project = {
    id: Date.now().toString(),
    name: name,
    description: description,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    nodes: [],
    connections: []
  };

  projects.push(project);
  saveProjects();
  closeNewProjectDialog();
  renderProjectsList();
}

// Render projects list
function renderProjectsList() {
  const container = document.getElementById('projects-container');
  const emptyState = document.getElementById('empty-state');

  if (projects.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div style="font-size: 4rem; margin-bottom: 1rem;">📋</div>
        <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem; color: #cbd5e1;">No projects yet</h3>
        <p style="color: #94a3b8; margin-bottom: 2rem;">Create your first AI workflow to get started</p>
        <button class="btn btn-primary" onclick="openNewProjectDialog()">Create First Project</button>
      </div>
    `;
    return;
  }

  container.innerHTML = projects.map(project => {
    const createdDate = new Date(project.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    const nodeCount = project.nodes ? project.nodes.length : 0;

    return `
      <div class="project-card" onclick="openProject('${project.id}')">
        <div class="project-card-header">
          <div class="project-icon">🤖</div>
          <div class="project-actions">
            <button class="project-action-btn" onclick="event.stopPropagation(); editProject('${project.id}')" title="Edit">✏️</button>
            <button class="project-action-btn" onclick="event.stopPropagation(); deleteProject('${project.id}')" title="Delete">🗑️</button>
          </div>
        </div>
        <div class="project-info">
          <div class="project-name">${escapeHtml(project.name)}</div>
          <div class="project-description">${project.description ? escapeHtml(project.description) : '<em style="color: #64748b;">No description</em>'}</div>
        </div>
        <div class="project-footer">
          <div class="project-stats">
            <div class="project-stat">📊 ${nodeCount} nodes</div>
          </div>
          <div class="project-date">${createdDate}</div>
        </div>
      </div>
    `;
  }).join('');
}

// Open a project in the canvas editor
function openProject(projectId) {
  const project = projects.find(p => p.id === projectId);
  if (!project) return;

  currentProjectId = projectId;
  
  // Update canvas view with project data
  document.getElementById('project-title-display').textContent = project.name;
  
  // Load project data
  const savedNodes = project.nodes ? [...project.nodes] : [];
  connections = project.connections ? [...project.connections] : [];
  
  // Switch to canvas editor view first
  showPage('canvas-editor');
  
  // Clear the canvas completely
  const canvas = document.getElementById('canvas');
  canvas.innerHTML = '';

  // Reset nodes array - don't add placeholder
  nodes = [];
  
  // If there are no saved nodes, show placeholder
  if (savedNodes.length === 0) {
    canvas.innerHTML = `
      <div style="text-align: center; color: #94a3b8; margin-top: 10rem; pointer-events: none;">
        <div style="font-size: 3rem; margin-bottom: 1rem;">🎯</div>
        <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem;">Drag components here to continue building</h3>
        <p>Start by dragging components from the left panel</p>
      </div>
    `;
  }

  // Calculate the highest node ID to set nodeIdCounter appropriately
  let maxNodeId = -1;
  savedNodes.forEach(node => {
    const nodeNum = parseInt(node.id.replace('node-', ''));
    if (!isNaN(nodeNum) && nodeNum > maxNodeId) {
      maxNodeId = nodeNum;
    }
  });
  nodeIdCounter = maxNodeId + 1;

  // Render existing nodes on canvas
  savedNodes.forEach(node => {
    // Manually create and add nodes without using addNodeToCanvas to preserve IDs
    const nodeEl = document.createElement('div');
    nodeEl.className = 'canvas-node';
    nodeEl.id = node.id;
    nodeEl.style.left = node.x + 'px';
    nodeEl.style.top = node.y + 'px';
    nodeEl.draggable = true;

    nodeEl.innerHTML = `
      <div class="delete-btn" onclick="deleteNode('${node.id}')">×</div>
      <div style="font-size: 2rem; margin-bottom: 0.5rem;">${node.icon}</div>
      <div class="node-label">${node.name}</div>
      <div class="node-type">${node.type}</div>
      <div class="handle top" data-side="top" title="Top handle"></div>
      <div class="handle right" data-side="right" title="Right handle"></div>
      <div class="handle bottom" data-side="bottom" title="Bottom handle"></div>
      <div class="handle left" data-side="left" title="Left handle"></div>
    `;

    // Add event listeners
    nodeEl.addEventListener('click', () => selectNode(node.id, node.name, node.type));
    nodeEl.addEventListener('dragstart', handleNodeDragStart);
    nodeEl.addEventListener('dragend', handleNodeDragEnd);

    // Add connection handle events
    const topHandle = nodeEl.querySelector('.handle.top');
    const rightHandle = nodeEl.querySelector('.handle.right');
    const bottomHandle = nodeEl.querySelector('.handle.bottom');
    const leftHandle = nodeEl.querySelector('.handle.left');

    if (topHandle) topHandle.addEventListener('mousedown', (e) => startConnection(e, node.id, 'top'));
    if (rightHandle) rightHandle.addEventListener('mousedown', (e) => startConnection(e, node.id, 'right'));
    if (bottomHandle) bottomHandle.addEventListener('mousedown', (e) => startConnection(e, node.id, 'bottom'));
    if (leftHandle) leftHandle.addEventListener('mousedown', (e) => startConnection(e, node.id, 'left'));

    canvas.appendChild(nodeEl);
    nodes.push(node);
  });

  // Re-initialize connections SVG 
  initConnectionsSvg();
}

// Go back to projects list
function goBackToProjects() {
  // Save current project state before leaving
  if (currentProjectId) {
    const project = projects.find(p => p.id === currentProjectId);
    if (project) {
      project.nodes = nodes;
      project.connections = connections;
      project.updatedAt = new Date().toISOString();
      saveProjects();
    }
  }
  
  currentProjectId = null;
  nodes = [];
  connections = [];
  dragDropInitialized = false; // Reset flag to allow reinit if needed
  showPage('editor');
  renderProjectsList();
}

// Edit project (opens dialog with current project info)
function editProject(projectId) {
  const project = projects.find(p => p.id === projectId);
  if (!project) return;

  const newName = prompt('Project name:', project.name);
  if (newName === null) return;

  if (newName.trim() === '') {
    alert('Project name cannot be empty');
    return;
  }

  const newDescription = prompt('Project description:', project.description || '');
  if (newDescription === null) return;

  project.name = newName.trim();
  project.description = newDescription.trim();
  project.updatedAt = new Date().toISOString();
  saveProjects();
  renderProjectsList();
}

// Delete project
function deleteProject(projectId) {
  const project = projects.find(p => p.id === projectId);
  if (!project) return;

  if (confirm(`Are you sure you want to delete "${project.name}"? This cannot be undone.`)) {
    projects = projects.filter(p => p.id !== projectId);
    saveProjects();
    renderProjectsList();
  }
}

// Utility function to escape HTML
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
  const modal = document.getElementById('project-modal');
  if (e.target === modal) {
    closeNewProjectDialog();
  }
});

// Allow Enter key to create project
document.addEventListener('keydown', (e) => {
  const modal = document.getElementById('project-modal');
  if (modal && modal.style.display !== 'none' && e.key === 'Enter') {
    e.preventDefault();
    createNewProject();
  }
});
