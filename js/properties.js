// Module 5: Properties Panel
function updatePropertiesPanel(name, type) {
  const panel = document.querySelector('.properties-panel');
  panel.innerHTML = `
    <h3 class="panel-title">Properties</h3>
    <div style="margin-bottom: 1.5rem;">
      <label style="display: block; color: #94a3b8; font-size: 0.9rem; margin-bottom: 0.5rem;">Node Name</label>
      <input type="text" value="${name}" style="width: 100%; padding: 0.6rem; background: rgba(15, 22, 41, 0.6); border: 1px solid #6366f1; border-radius: 8px; color: #e4e7f1; font-size: 0.95rem;" readonly>
    </div>
    <div style="margin-bottom: 1.5rem;">
      <label style="display: block; color: #94a3b8; font-size: 0.9rem; margin-bottom: 0.5rem;">Node Type</label>
      <input type="text" value="${type}" style="width: 100%; padding: 0.6rem; background: rgba(15, 22, 41, 0.6); border: 1px solid #6366f1; border-radius: 8px; color: #e4e7f1; font-size: 0.95rem;" readonly>
    </div>
    <div style="color: #94a3b8; font-size: 0.9rem; line-height: 1.6;">
      <p>Configure parameters, connections, and settings for this node here.</p>
    </div>
  `;
}
