// ==========================================================================
// Themes Docs — Tab Navigation + Theme Configuration Engine
// ==========================================================================

(function () {
  'use strict';

  // -----------------------------------------------------------------------
  // 1. Tab Navigation (same pattern as button-docs.js)
  // -----------------------------------------------------------------------

  var tabList = document.querySelector('.docs-tabs__list');
  var triggers = tabList ? tabList.querySelectorAll('.docs-tabs__trigger') : [];
  var panels = document.querySelectorAll('.docs-tabs__panel');

  function activateTab(trigger) {
    triggers.forEach(function (t) { t.setAttribute('aria-selected', 'false'); });
    panels.forEach(function (p) { p.classList.remove('is-active'); });
    trigger.setAttribute('aria-selected', 'true');
    var panelId = trigger.getAttribute('aria-controls');
    var panel = document.getElementById(panelId);
    if (panel) panel.classList.add('is-active');
  }

  triggers.forEach(function (trigger) {
    trigger.addEventListener('click', function () { activateTab(trigger); });
    trigger.addEventListener('keydown', function (e) {
      var index = Array.prototype.indexOf.call(triggers, trigger);
      var nextIndex = -1;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        nextIndex = (index + 1) % triggers.length;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        nextIndex = (index - 1 + triggers.length) % triggers.length;
      } else if (e.key === 'Home') {
        nextIndex = 0;
      } else if (e.key === 'End') {
        nextIndex = triggers.length - 1;
      }
      if (nextIndex >= 0) {
        e.preventDefault();
        triggers[nextIndex].focus();
        activateTab(triggers[nextIndex]);
      }
    });
  });

  // -----------------------------------------------------------------------
  // 2. Default Theme Data
  // -----------------------------------------------------------------------

  var NEO_DEFAULTS = {
    color: {
      primary: '#009ee3',
      secondary: '#002049',
      accent: '#37e93d'
    },
    typography: {
      'font-body': "'Manrope', 'Helvetica Neue', Arial, sans-serif",
      'font-heading': "'Space Grotesk', 'Helvetica Neue', Arial, sans-serif",
      'font-weight-body': 400,
      'font-weight-heading': 400
    }
  };

  var THEME_DEFS = {
    'neo-light': {
      label: 'Neo Light',
      cssClass: 'neo-light-theme',
      type: 'base',
      locked: true,
      preview: ['#ffffff', '#f5f5f5', '#009ee3', '#002049']
    },
    'neo-dark': {
      label: 'Neo Dark',
      cssClass: 'neo-dark-theme',
      type: 'base',
      locked: true,
      preview: ['#0f0f0f', '#1a1a1a', '#009ee3', '#37e93d']
    },
    'customer-light': {
      label: 'Customer Light',
      cssClass: 'customer-light-theme',
      type: 'customer',
      locked: false,
      preview: ['#f5f5f5', '#ffffff', '#009ee3', '#37e93d']
    },
    'customer-dark': {
      label: 'Customer Dark',
      cssClass: 'customer-dark-theme',
      type: 'customer',
      locked: false,
      preview: ['#1a1a1a', '#252525', '#009ee3', '#37e93d']
    }
  };

  // All CSS theme classes (new + legacy) for removal
  var ALL_THEME_CLASSES = [
    'neo-light-theme', 'neo-dark-theme', 'customer-light-theme', 'customer-dark-theme',
    'light-base-theme', 'dark-base-theme', 'light-secondary-theme', 'dark-secondary-theme'
  ];

  // -----------------------------------------------------------------------
  // 3. State
  // -----------------------------------------------------------------------

  var configData = null; // Loaded from themes-config.json
  var activeThemeKey = 'neo-light'; // Currently selected theme in config tab

  // -----------------------------------------------------------------------
  // 4. DOM Helpers
  // -----------------------------------------------------------------------

  function $(id) { return document.getElementById(id); }
  var statusEl = $('status-msg');

  function showStatus(type, message) {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.className = 'config__status config__status--' + type;
    clearTimeout(statusEl._timeout);
    statusEl._timeout = setTimeout(function () {
      statusEl.className = 'config__status';
    }, 5000);
  }

  // -----------------------------------------------------------------------
  // 5. Color Math (migrated from color-config.html)
  // -----------------------------------------------------------------------

  function hexToRgb(hex) {
    var r = parseInt(hex.slice(1, 3), 16);
    var g = parseInt(hex.slice(3, 5), 16);
    var b = parseInt(hex.slice(5, 7), 16);
    return { r: r, g: g, b: b };
  }

  function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(function (x) {
      return Math.round(Math.max(0, Math.min(255, x))).toString(16).padStart(2, '0');
    }).join('');
  }

  function mixColors(c1, c2, amount) {
    return {
      r: c1.r + (c2.r - c1.r) * amount,
      g: c1.g + (c2.g - c1.g) * amount,
      b: c1.b + (c2.b - c1.b) * amount
    };
  }

  function generateScale(baseHex) {
    var base = hexToRgb(baseHex);
    var white = { r: 255, g: 255, b: 255 };
    var black = { r: 0, g: 0, b: 0 };
    var steps = [100, 200, 300, 400, 500, 600, 700, 800, 900];
    var scale = {};
    steps.forEach(function (step) {
      if (step === 500) {
        scale[step] = baseHex;
      } else if (step < 500) {
        var amount = (500 - step) / 500;
        var mixed = mixColors(base, white, amount);
        scale[step] = rgbToHex(mixed.r, mixed.g, mixed.b);
      } else {
        var amount = (step - 500) / 500;
        var mixed = mixColors(base, black, amount);
        scale[step] = rgbToHex(mixed.r, mixed.g, mixed.b);
      }
    });
    return scale;
  }

  // -----------------------------------------------------------------------
  // 6. Shade Preview Rendering
  // -----------------------------------------------------------------------

  function renderShadePreview(containerId, scale) {
    var container = $(containerId);
    if (!container) return;
    container.innerHTML = '';
    [100, 200, 300, 400, 500, 600, 700, 800, 900].forEach(function (step) {
      var el = document.createElement('div');
      el.className = 'config__shade-step';
      el.style.backgroundColor = scale[step];
      el.title = step + ': ' + scale[step];
      container.appendChild(el);
    });
  }

  // -----------------------------------------------------------------------
  // 7. Apply Colors to CSS Custom Properties (live)
  // -----------------------------------------------------------------------

  function applyColorsLive(themeData) {
    var root = document.documentElement;
    var palettes = {
      primary: generateScale(themeData.color.primary),
      secondary: generateScale(themeData.color.secondary),
      accent: generateScale(themeData.color.accent)
    };

    Object.keys(palettes).forEach(function (name) {
      var scale = palettes[name];
      Object.keys(scale).forEach(function (step) {
        root.style.setProperty('--fnd-primitive-' + name + '-' + step, scale[step]);
      });
    });

    // Update interactive tokens
    root.style.setProperty('--fnd-color-interactive-default', palettes.primary[500]);
    root.style.setProperty('--fnd-color-interactive-hover', palettes.primary[600]);
    root.style.setProperty('--fnd-color-interactive-active', palettes.primary[700]);
    root.style.setProperty('--fnd-color-interactive-focus', palettes.primary[500]);

    // Update shade previews
    renderShadePreview('shade-primary', palettes.primary);
    renderShadePreview('shade-secondary', palettes.secondary);
    renderShadePreview('shade-accent', palettes.accent);

    return palettes;
  }

  // -----------------------------------------------------------------------
  // 8. Apply Typography to CSS Custom Properties (live)
  // -----------------------------------------------------------------------

  function applyTypographyLive(themeData) {
    var root = document.documentElement;
    root.style.setProperty('--font-body', themeData.typography['font-body']);
    root.style.setProperty('--font-heading', themeData.typography['font-heading']);
    root.style.setProperty('--fnd-font-weight-body', themeData.typography['font-weight-body']);
    root.style.setProperty('--fnd-font-weight-heading', themeData.typography['font-weight-heading']);

    // Update typography previews
    var previewBody = $('preview-font-body');
    if (previewBody) {
      previewBody.style.fontFamily = themeData.typography['font-body'];
      previewBody.style.fontWeight = themeData.typography['font-weight-body'];
    }
    var previewHeading = $('preview-font-heading');
    if (previewHeading) {
      previewHeading.style.fontFamily = themeData.typography['font-heading'];
      previewHeading.style.fontWeight = themeData.typography['font-weight-heading'];
    }
  }

  // -----------------------------------------------------------------------
  // 9. Theme Card Rendering (Config tab)
  // -----------------------------------------------------------------------

  function renderConfigThemeCards() {
    var container = $('config-theme-cards');
    if (!container || !configData) return;
    container.innerHTML = '';

    Object.keys(configData.themes).forEach(function (key) {
      var theme = configData.themes[key];
      var def = THEME_DEFS[key];
      if (!def) return;

      var card = document.createElement('div');
      card.className = 'themes__card' + (key === activeThemeKey ? ' is-active' : '');
      card.dataset.theme = key;

      var previewColors = [
        def.preview[0], def.preview[1],
        theme.color.primary, theme.color.accent
      ];

      card.innerHTML =
        '<div class="themes__card-preview">' +
          previewColors.map(function (c) { return '<div style="background:' + c + ';"></div>'; }).join('') +
        '</div>' +
        '<div class="themes__card-name">' + theme.label + '</div>' +
        '<span class="themes__card-badge themes__card-badge--' + (def.type === 'base' ? 'neo' : 'customer') + '">' +
          (def.type === 'base' ? 'Neo' : 'Customer') +
        '</span>' +
        '<div class="themes__card-lock"' + (theme.locked ? '' : ' style="color:var(--fnd-color-feedback-success);"') + '>' +
          (theme.locked ? '\u{1F512} Schreibgesch\u00fctzt' : '\u270F Konfigurierbar') +
        '</div>';

      card.addEventListener('click', function () {
        selectTheme(key);
      });

      container.appendChild(card);
    });
  }

  // -----------------------------------------------------------------------
  // 10. Select a Theme (config tab)
  // -----------------------------------------------------------------------

  function selectTheme(key) {
    activeThemeKey = key;
    var theme = configData.themes[key];
    var def = THEME_DEFS[key];
    if (!theme || !def) return;

    // Switch body CSS class
    ALL_THEME_CLASSES.forEach(function (cls) { document.body.classList.remove(cls); });
    document.body.classList.add(def.cssClass);

    // Update active card
    document.querySelectorAll('#config-theme-cards .themes__card').forEach(function (card) {
      card.classList.toggle('is-active', card.dataset.theme === key);
    });

    // Populate color pickers
    $('picker-primary').value = theme.color.primary;
    $('hex-primary').value = theme.color.primary;
    $('picker-secondary').value = theme.color.secondary;
    $('hex-secondary').value = theme.color.secondary;
    $('picker-accent').value = theme.color.accent;
    $('hex-accent').value = theme.color.accent;

    // Populate typography
    $('input-font-body').value = theme.typography['font-body'];
    $('input-font-heading').value = theme.typography['font-heading'];
    $('select-weight-body').value = theme.typography['font-weight-body'];
    $('select-weight-heading').value = theme.typography['font-weight-heading'];

    // Lock/unlock controls
    var isLocked = theme.locked;
    ['picker-card-primary', 'picker-card-secondary', 'picker-card-accent'].forEach(function (id) {
      var el = $(id);
      if (el) el.classList.toggle('is-locked', isLocked);
    });
    ['typo-card-body', 'typo-card-heading'].forEach(function (id) {
      var el = $(id);
      if (el) el.classList.toggle('is-locked', isLocked);
    });

    // Apply live
    applyColorsLive(theme);
    applyTypographyLive(theme);
    renderJson();
    updateCompare();
  }

  // -----------------------------------------------------------------------
  // 11. Picker Sync
  // -----------------------------------------------------------------------

  function syncPicker(palette) {
    var picker = $('picker-' + palette);
    var hex = $('hex-' + palette);
    if (!picker || !hex) return;

    picker.addEventListener('input', function () {
      hex.value = picker.value;
      updateThemeColor(palette, picker.value);
    });

    hex.addEventListener('input', function () {
      var val = hex.value.trim();
      if (/^#[0-9a-fA-F]{6}$/.test(val)) {
        picker.value = val;
        updateThemeColor(palette, val);
      }
    });

    hex.addEventListener('blur', function () {
      var val = hex.value.trim();
      if (!/^#[0-9a-fA-F]{6}$/.test(val)) {
        hex.value = configData.themes[activeThemeKey].color[palette];
      }
    });
  }

  function updateThemeColor(palette, value) {
    if (!configData || !configData.themes[activeThemeKey]) return;
    var theme = configData.themes[activeThemeKey];
    if (theme.locked) return;
    theme.color[palette] = value;
    applyColorsLive(theme);
    renderJson();
    updateCompare();
  }

  // -----------------------------------------------------------------------
  // 12. Typography Sync
  // -----------------------------------------------------------------------

  function setupTypographySync() {
    var fontBody = $('input-font-body');
    var fontHeading = $('input-font-heading');
    var weightBody = $('select-weight-body');
    var weightHeading = $('select-weight-heading');

    if (fontBody) {
      fontBody.addEventListener('input', function () {
        updateThemeTypography('font-body', fontBody.value);
      });
    }
    if (fontHeading) {
      fontHeading.addEventListener('input', function () {
        updateThemeTypography('font-heading', fontHeading.value);
      });
    }
    if (weightBody) {
      weightBody.addEventListener('change', function () {
        updateThemeTypography('font-weight-body', parseInt(weightBody.value, 10));
      });
    }
    if (weightHeading) {
      weightHeading.addEventListener('change', function () {
        updateThemeTypography('font-weight-heading', parseInt(weightHeading.value, 10));
      });
    }
  }

  function updateThemeTypography(prop, value) {
    if (!configData || !configData.themes[activeThemeKey]) return;
    var theme = configData.themes[activeThemeKey];
    if (theme.locked) return;
    theme.typography[prop] = value;
    applyTypographyLive(theme);
    renderJson();
    updateCompare();
  }

  // -----------------------------------------------------------------------
  // 13. Comparison Table
  // -----------------------------------------------------------------------

  function updateCompare() {
    if (!configData) return;
    var keyA = $('compare-a') ? $('compare-a').value : 'neo-light';
    var keyB = $('compare-b') ? $('compare-b').value : 'customer-light';
    var themeA = configData.themes[keyA];
    var themeB = configData.themes[keyB];
    if (!themeA || !themeB) return;

    // Update headers
    var thA = $('compare-th-a');
    var thB = $('compare-th-b');
    if (thA) thA.textContent = themeA.label;
    if (thB) thB.textContent = themeB.label;

    var tbody = $('compare-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    // Color comparisons
    var scaleA = {
      primary: generateScale(themeA.color.primary),
      secondary: generateScale(themeA.color.secondary),
      accent: generateScale(themeA.color.accent)
    };
    var scaleB = {
      primary: generateScale(themeB.color.primary),
      secondary: generateScale(themeB.color.secondary),
      accent: generateScale(themeB.color.accent)
    };

    // Section header
    addCompareRow(tbody, 'Farben (Primitives)', '', '', true);

    ['primary', 'secondary', 'accent'].forEach(function (palette) {
      [100, 300, 500, 700, 900].forEach(function (step) {
        var valA = scaleA[palette][step];
        var valB = scaleB[palette][step];
        var isDiff = valA.toLowerCase() !== valB.toLowerCase();
        addCompareRow(
          tbody,
          palette + '-' + step,
          '<span class="compare__swatch" style="background:' + valA + ';"></span> ' + valA,
          '<span class="compare__swatch" style="background:' + valB + ';"></span> ' + valB,
          false,
          isDiff
        );
      });
    });

    // Typography comparisons
    addCompareRow(tbody, 'Typography', '', '', true);

    var typoKeys = ['font-body', 'font-heading', 'font-weight-body', 'font-weight-heading'];
    typoKeys.forEach(function (key) {
      var valA = String(themeA.typography[key]);
      var valB = String(themeB.typography[key]);
      var isDiff = valA !== valB;
      addCompareRow(tbody, key, valA, valB, false, isDiff);
    });
  }

  function addCompareRow(tbody, label, valA, valB, isHeader, isDiff) {
    var tr = document.createElement('tr');
    if (isHeader) {
      tr.innerHTML = '<td colspan="3" style="font-weight:700; background:var(--fnd-color-background-tertiary); padding:var(--fnd-spacing-02) var(--fnd-spacing-03);">' + label + '</td>';
    } else {
      var diffClass = isDiff ? ' class="compare__diff"' : '';
      tr.innerHTML =
        '<td><code>' + label + '</code></td>' +
        '<td' + diffClass + '>' + valA + '</td>' +
        '<td' + diffClass + '>' + valB + '</td>';
    }
    tbody.appendChild(tr);
  }

  // -----------------------------------------------------------------------
  // 14. JSON Output
  // -----------------------------------------------------------------------

  function renderJson() {
    var output = $('json-output');
    if (!output || !configData) return;
    var exportData = JSON.parse(JSON.stringify(configData));
    exportData.meta.updated = new Date().toISOString().split('T')[0];
    output.textContent = JSON.stringify(exportData, null, 2);
  }

  // -----------------------------------------------------------------------
  // 15. Persistence: Save / Load / Reset / Import / Export
  // -----------------------------------------------------------------------

  function buildDefaultConfig() {
    return {
      meta: { version: '2.0.0', updated: new Date().toISOString().split('T')[0] },
      themes: {
        'neo-light': {
          label: 'Neo Light', cssClass: 'neo-light-theme', type: 'base', locked: true,
          color: Object.assign({}, NEO_DEFAULTS.color),
          typography: Object.assign({}, NEO_DEFAULTS.typography)
        },
        'neo-dark': {
          label: 'Neo Dark', cssClass: 'neo-dark-theme', type: 'base', locked: true,
          color: Object.assign({}, NEO_DEFAULTS.color),
          typography: Object.assign({}, NEO_DEFAULTS.typography)
        },
        'customer-light': {
          label: 'Customer Light', cssClass: 'customer-light-theme', type: 'customer', locked: false,
          color: Object.assign({}, NEO_DEFAULTS.color),
          typography: Object.assign({}, NEO_DEFAULTS.typography)
        },
        'customer-dark': {
          label: 'Customer Dark', cssClass: 'customer-dark-theme', type: 'customer', locked: false,
          color: Object.assign({}, NEO_DEFAULTS.color),
          typography: Object.assign({}, NEO_DEFAULTS.typography)
        }
      }
    };
  }

  async function loadConfig() {
    try {
      var response = await fetch('../data/themes-config.json');
      if (response.ok) {
        var json = await response.json();
        if (json && json.themes) {
          configData = json;
          // Ensure locked flags are correct
          if (configData.themes['neo-light']) configData.themes['neo-light'].locked = true;
          if (configData.themes['neo-dark']) configData.themes['neo-dark'].locked = true;
          showStatus('success', 'Konfiguration aus themes-config.json geladen.');
        } else {
          configData = buildDefaultConfig();
        }
      } else {
        configData = buildDefaultConfig();
      }
    } catch (e) {
      configData = buildDefaultConfig();
    }

    // Initialize UI
    renderConfigThemeCards();
    selectTheme(activeThemeKey);
    renderJson();
    updateCompare();
  }

  async function saveConfig() {
    if (!configData) return;
    configData.meta.updated = new Date().toISOString().split('T')[0];

    try {
      var response = await fetch('/api/save-themes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(configData)
      });
      if (response.ok) {
        showStatus('success', 'Konfiguration gespeichert in data/themes-config.json');
      } else {
        throw new Error('Server returned ' + response.status);
      }
    } catch (err) {
      // Fallback: Download as file
      var blob = new Blob([JSON.stringify(configData, null, 2)], { type: 'application/json' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'themes-config.json';
      a.click();
      URL.revokeObjectURL(url);
      showStatus('success', 'Server nicht erreichbar \u2014 Datei zum Download angeboten. Bitte manuell nach data/themes-config.json kopieren.');
    }
  }

  function resetConfig() {
    configData = buildDefaultConfig();

    // Remove inline overrides
    var root = document.documentElement;
    var props = [];
    for (var i = 0; i < root.style.length; i++) {
      props.push(root.style[i]);
    }
    props.forEach(function (prop) {
      if (prop.startsWith('--fnd-primitive-') ||
          prop.startsWith('--fnd-color-interactive-') ||
          prop.startsWith('--font-') ||
          prop.startsWith('--fnd-font-weight-')) {
        root.style.removeProperty(prop);
      }
    });

    activeThemeKey = 'neo-light';
    renderConfigThemeCards();
    selectTheme(activeThemeKey);
    showStatus('success', 'Konfiguration auf Standard zur\u00fcckgesetzt (Neo Defaults).');
  }

  function copyJson() {
    var output = $('json-output');
    if (!output) return;
    navigator.clipboard.writeText(output.textContent).then(function () {
      showStatus('success', 'JSON in Zwischenablage kopiert.');
    }).catch(function () {
      var range = document.createRange();
      range.selectNodeContents(output);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
      showStatus('success', 'Text markiert \u2014 bitte manuell kopieren (Ctrl+C).');
    });
  }

  function importJson() {
    var fileInput = $('file-import');
    if (fileInput) fileInput.click();
  }

  function handleImport(event) {
    var file = event.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function (e) {
      try {
        var imported = JSON.parse(e.target.result);
        if (imported && imported.themes) {
          configData = imported;
          // Enforce locked flags
          if (configData.themes['neo-light']) configData.themes['neo-light'].locked = true;
          if (configData.themes['neo-dark']) configData.themes['neo-dark'].locked = true;
          renderConfigThemeCards();
          selectTheme(activeThemeKey);
          showStatus('success', 'Konfiguration importiert aus ' + file.name);
        } else {
          showStatus('error', 'Ung\u00fcltiges JSON-Format: themes-Objekt fehlt.');
        }
      } catch (err) {
        showStatus('error', 'JSON-Parse-Fehler: ' + err.message);
      }
    };
    reader.readAsText(file);
    // Reset file input
    event.target.value = '';
  }

  // -----------------------------------------------------------------------
  // 16. Event Listeners
  // -----------------------------------------------------------------------

  // Action buttons
  var btnSave = $('btn-save');
  var btnExport = $('btn-export');
  var btnImport = $('btn-import');
  var btnReset = $('btn-reset');
  var fileImport = $('file-import');

  if (btnSave) btnSave.addEventListener('click', saveConfig);
  if (btnExport) btnExport.addEventListener('click', copyJson);
  if (btnImport) btnImport.addEventListener('click', importJson);
  if (btnReset) btnReset.addEventListener('click', resetConfig);
  if (fileImport) fileImport.addEventListener('change', handleImport);

  // Comparison dropdowns
  var compareA = $('compare-a');
  var compareB = $('compare-b');
  if (compareA) compareA.addEventListener('change', updateCompare);
  if (compareB) compareB.addEventListener('change', updateCompare);

  // -----------------------------------------------------------------------
  // 17. Init
  // -----------------------------------------------------------------------

  syncPicker('primary');
  syncPicker('secondary');
  syncPicker('accent');
  setupTypographySync();
  loadConfig();

})();
