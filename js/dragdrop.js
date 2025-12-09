// Module 3: Drag & Drop for Components
function initializeDragAndDrop() {
  const componentItems = document.querySelectorAll('.component-item');
  const canvas = document.getElementById('canvas');

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
    canvas.classList.remove('drag-over');

    const componentType = e.dataTransfer.getData('componentType');
    const componentName = e.dataTransfer.getData('componentName');
    const componentIcon = e.dataTransfer.getData('componentIcon');

    const canvasRect = canvas.getBoundingClientRect();
    const x = e.clientX - canvasRect.left - 80;
    const y = e.clientY - canvasRect.top - 50;

    addNodeToCanvas(componentName, componentType, componentIcon, x, y);
  });
}
