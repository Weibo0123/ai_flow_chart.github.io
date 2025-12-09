// Module 7: Element SDK Integration
async function onConfigChange(config) {
  const titleEl = document.getElementById('hero-title');
  const subtitleEl = document.getElementById('hero-subtitle');
  const btnPrimaryEl = document.getElementById('btn-primary');
  const btnSecondaryEl = document.getElementById('btn-secondary');

  if (titleEl) titleEl.textContent = config.main_title || defaultConfig.main_title;
  if (subtitleEl) subtitleEl.textContent = config.subtitle || defaultConfig.subtitle;
  if (btnPrimaryEl) btnPrimaryEl.textContent = config.cta_primary || defaultConfig.cta_primary;
  if (btnSecondaryEl) btnSecondaryEl.textContent = config.cta_secondary || defaultConfig.cta_secondary;
}

function initElementSDK() {
  if (window.elementSdk) {
    window.elementSdk.init({
      defaultConfig,
      onConfigChange,
      mapToCapabilities: (config) => ({
        recolorables: [],
        borderables: [],
        fontEditable: undefined,
        fontSizeable: undefined
      }),
      mapToEditPanelValues: (config) => new Map([
        ["main_title", config.main_title || defaultConfig.main_title],
        ["subtitle", config.subtitle || defaultConfig.subtitle],
        ["cta_primary", config.cta_primary || defaultConfig.cta_primary],
        ["cta_secondary", config.cta_secondary || defaultConfig.cta_secondary]
      ])
    });
  }
}
