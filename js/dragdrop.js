// Module 3: Drag & Drop for Components
let dragDropInitialized = false;

function initializeDragAndDrop() {
  // Skip if already initialized to avoid duplicate listeners
  if (dragDropInitialized) return;
  
  let canvas = document.getElementById('canvas');
  if (!canvas) {
    console.warn('Canvas not found for drag and drop initialization');
    return;
  }
  
  const componentItems = document.querySelectorAll('.component-item');

  // Setup drag events for component items
  componentItems.forEach(item => {
    item.addEventListener('dragstart', (e) => {
      item.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'copy';
      e.dataTransfer.setData('componentType', item.dataset.type);
      e.dataTransfer.setData('componentName', item.dataset.name);
      e.dataTransfer.setData('componentIcon', item.dataset.icon);
    });

    item.addEventListener('dragend', (e) => {
      item.classList.remove('dragging');
    });
  });

  // Setup drop zone on canvas
  canvas.addEventListener('dragover', (e) => {
    e.preventDefault();
    canvas.classList.add('drag-over');
  });

  canvas.addEventListener('dragleave', (e) => {
    if (e.target === canvas) {
      canvas.classList.remove('drag-over');
    }
  });

  canvas.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    canvas.classList.remove('drag-over');

    // Only create new node if dragging from component panel (copy operation)
    // If draggedNode exists, it's a move operation (don't create new node)
    if (draggedNode) {
      return; // Moving existing node, don't create new one
    }

    const componentType = e.dataTransfer.getData('componentType');
    const componentName = e.dataTransfer.getData('componentName');
    const componentIcon = e.dataTransfer.getData('componentIcon');

    // Only add new node if we have component data (from component panel)
    if (componentType && componentName && componentIcon) {
      const canvasRect = canvas.getBoundingClientRect();
      const x = e.clientX - canvasRect.left - 80;
      const y = e.clientY - canvasRect.top - 50;

      addNodeToCanvas(componentName, componentType, componentIcon, x, y);
    }
  });
  
  dragDropInitialized = true;
}
