#!/usr/bin/env node
// ==========================================================================
// Migrate docs-stage toolbars to DS components
// ==========================================================================
// Transforms old <select>/<checkbox> toolbar controls in docs/content/*.html
// fragments to nc-segmented-control / nc-chip-group / nc-select / nc-switch.
//
// Rules:
//   - Theme select (4 opts) → segmented control with color dots (always)
//   - Select with 2–4 options → segmented control
//   - Select with 5–9 options → chip group (sm)
//   - Select with 10+ or <optgroup> → nc-select--sm
//   - Checkbox → nc-switch--sm
//
// Preserves hidden native inputs for backward compatibility.
// ==========================================================================

'use strict';

const fs = require('fs');
const path = require('path');

const CONTENT_DIR = path.join(__dirname, '..', 'docs', 'content');

// ---------------------------------------------------------------------------
// Theme Segmented Control (always the same)
// ---------------------------------------------------------------------------

const THEME_SEGMENTED = `
                <!-- Theme — Segmented Control mit farbigen Dots -->
                <div class="nc-segmented-control nc-segmented-control--sm"
                     role="radiogroup" aria-label="Theme"
                     data-stage-control="segmented" data-stage-target="stage-theme" data-default="neo-light-theme">
                  <button class="nc-segmented-control__item" role="radio" aria-checked="true" tabindex="0"
                          data-value="neo-light-theme" aria-label="Neo Light">
                    <span class="docs-stage__theme-dot docs-stage__theme-dot--neo-light"></span>
                  </button>
                  <button class="nc-segmented-control__item" role="radio" aria-checked="false" tabindex="-1"
                          data-value="neo-dark-theme" aria-label="Neo Dark">
                    <span class="docs-stage__theme-dot docs-stage__theme-dot--neo-dark"></span>
                  </button>
                  <button class="nc-segmented-control__item" role="radio" aria-checked="false" tabindex="-1"
                          data-value="customer-light-theme" aria-label="Customer Light">
                    <span class="docs-stage__theme-dot docs-stage__theme-dot--customer-light"></span>
                  </button>
                  <button class="nc-segmented-control__item" role="radio" aria-checked="false" tabindex="-1"
                          data-value="customer-dark-theme" aria-label="Customer Dark">
                    <span class="docs-stage__theme-dot docs-stage__theme-dot--customer-dark"></span>
                  </button>
                </div>`.trim();

const THEME_HIDDEN = `
              <select class="docs-stage__hidden" id="stage-theme">
                <option value="neo-light-theme" selected>Neo Light</option>
                <option value="neo-dark-theme">Neo Dark</option>
                <option value="customer-light-theme">Customer Light</option>
                <option value="customer-dark-theme">Customer Dark</option>
              </select>`.trim();

// Action Buttons
const ACTION_BUTTONS = `
              <!-- Action-Buttons -->
              <div class="docs-stage__actions">
                <button class="docs-stage__action-btn" data-stage-action="copy"
                        aria-label="HTML kopieren" title="HTML kopieren">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="8" y="8" width="12" height="12" rx="2"></rect>
                    <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"></path>
                  </svg>
                </button>
                <button class="docs-stage__action-btn" data-stage-action="reset"
                        aria-label="Zurücksetzen" title="Zurücksetzen">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                    <path d="M3 3v5h5"></path>
                  </svg>
                </button>
              </div>`.trim();

// ---------------------------------------------------------------------------
// Parse toolbar HTML
// ---------------------------------------------------------------------------

function parseToolbar(html) {
  var toolbarMatch = html.match(/<div class="docs-stage__toolbar"[^>]*>([\s\S]*?)<\/div>\s*\n\s*<div class="docs-stage__preview/);
  if (!toolbarMatch) return null;

  var toolbarContent = toolbarMatch[1];
  var controls = [];

  // Parse each control block
  // Pattern 1: Select control
  var selectRe = /<div class="docs-stage__control"([^>]*)>\s*<span class="docs-stage__label">([^<]*)<\/span>\s*<select class="docs-stage__select" id="([^"]*)">([\s\S]*?)<\/select>\s*<\/div>/g;
  var m;
  while ((m = selectRe.exec(toolbarContent)) !== null) {
    var wrapperAttrs = m[1];
    var label = m[2];
    var id = m[3];
    var optionsHtml = m[4];
    var hasOptgroup = optionsHtml.indexOf('<optgroup') !== -1;

    var options = [];
    if (hasOptgroup) {
      // Parse optgroups
      var optgroupRe = /<optgroup label="([^"]*)">([\s\S]*?)<\/optgroup>/g;
      var og;
      while ((og = optgroupRe.exec(optionsHtml)) !== null) {
        var optRe = /<option value="([^"]*)"([^>]*)>([^<]*)<\/option>/g;
        var o;
        while ((o = optRe.exec(og[2])) !== null) {
          options.push({ value: o[1], label: o[3], selected: o[2].indexOf('selected') !== -1, group: og[1] });
        }
      }
    } else {
      var optRe = /<option value="([^"]*)"([^>]*)>([^<]*)<\/option>/g;
      var o;
      while ((o = optRe.exec(optionsHtml)) !== null) {
        options.push({ value: o[1], label: o[3], selected: o[2].indexOf('selected') !== -1 });
      }
    }

    // Extract wrapper id and style if present
    var wrapperId = '';
    var wrapperStyle = '';
    var idMatch = wrapperAttrs.match(/id="([^"]*)"/);
    if (idMatch) wrapperId = idMatch[1];
    var styleMatch = wrapperAttrs.match(/style="([^"]*)"/);
    if (styleMatch) wrapperStyle = styleMatch[1];

    controls.push({
      type: 'select',
      label: label,
      id: id,
      options: options,
      hasOptgroup: hasOptgroup,
      optionsHtml: optionsHtml,
      wrapperId: wrapperId,
      wrapperStyle: wrapperStyle
    });
  }

  // Pattern 2: Checkbox control
  var checkRe = /<div class="docs-stage__control">\s*<label style="display:\s*flex;\s*align-items:\s*center;\s*gap:\s*6px;\s*cursor:\s*pointer;">\s*<input type="checkbox" id="([^"]*)"([^/]*)\/>\s*<span class="docs-stage__label">([^<]*)<\/span>\s*<\/label>\s*<\/div>/g;
  while ((m = checkRe.exec(toolbarContent)) !== null) {
    var id = m[1];
    var attrs = m[2];
    var label = m[3];
    var checked = attrs.indexOf('checked') !== -1;
    controls.push({ type: 'checkbox', label: label, id: id, checked: checked });
  }

  // Pattern 3: Buttons (text-only.html special case)
  var btnRe = /<button[^>]*id="(stage-[^"]*)"[^>]*class="[^"]*nc-btn[^"]*"[^>]*>([^<]*)<\/button>/g;
  while ((m = btnRe.exec(toolbarContent)) !== null) {
    controls.push({ type: 'button', id: m[1], label: m[2].trim() });
  }

  return controls;
}

// ---------------------------------------------------------------------------
// Generate new toolbar HTML
// ---------------------------------------------------------------------------

function generateToolbar(controls, fileName) {
  var dsControls = [];
  var hiddenInputs = [];
  var isThemeOnly = controls.length === 1 && controls[0].id === 'stage-theme';

  for (var i = 0; i < controls.length; i++) {
    var ctrl = controls[i];

    if (ctrl.id === 'stage-theme' && ctrl.type === 'select') {
      // Theme: always segmented control with dots
      dsControls.push('                ' + THEME_SEGMENTED);
      hiddenInputs.push('              ' + THEME_HIDDEN);
      continue;
    }

    if (ctrl.type === 'button') {
      // Keep buttons as-is (text-only.html special case)
      dsControls.push('                <!-- ' + ctrl.label + ' bleibt als Button -->');
      continue;
    }

    if (ctrl.type === 'checkbox') {
      // Boolean → Switch
      var switchHtml = generateSwitch(ctrl);
      dsControls.push(switchHtml.ds);
      hiddenInputs.push(switchHtml.hidden);
      continue;
    }

    if (ctrl.type === 'select') {
      var optCount = ctrl.options.length;

      // Hidden controls (toggle.html): keep as legacy selects
      if (ctrl.wrapperStyle && ctrl.wrapperStyle.indexOf('display') !== -1 && ctrl.wrapperStyle.indexOf('none') !== -1) {
        dsControls.push(generateLegacySelect(ctrl));
        continue;
      }

      if (ctrl.hasOptgroup || optCount >= 10) {
        // 10+ or optgroups → nc-select--sm
        var selectHtml = generateNcSelect(ctrl);
        dsControls.push(selectHtml.ds);
        hiddenInputs.push(selectHtml.hidden);
      } else if (optCount >= 5) {
        // 5–9 → chip group
        var chipHtml = generateChipGroup(ctrl);
        dsControls.push(chipHtml.ds);
        hiddenInputs.push(chipHtml.hidden);
      } else {
        // 2–4 → segmented control
        var segHtml = generateSegmented(ctrl);
        dsControls.push(segHtml.ds);
        hiddenInputs.push(segHtml.hidden);
      }
    }
  }

  // Build full toolbar
  var defaultVal = controls.find(function (c) { return c.type === 'select' && c.id === 'stage-theme'; });
  var toolbar = '            <div class="docs-stage__toolbar">\n';
  toolbar += '              <div class="docs-stage__controls">\n\n';
  toolbar += dsControls.join('\n\n');
  toolbar += '\n\n              </div>\n\n';
  toolbar += '              ' + ACTION_BUTTONS + '\n\n';
  if (hiddenInputs.length > 0) {
    toolbar += '              <!-- Hidden Inputs — Backward-Kompatibilität -->\n';
    toolbar += hiddenInputs.join('\n');
    toolbar += '\n';
  }
  toolbar += '            </div>';

  return toolbar;
}

function generateSegmented(ctrl) {
  var defaultVal = '';
  ctrl.options.forEach(function (o) { if (o.selected) defaultVal = o.value; });
  if (!defaultVal && ctrl.options.length > 0) defaultVal = ctrl.options[0].value;

  // Shorten labels for segmented display
  var items = ctrl.options.map(function (o) {
    var shortLabel = o.label
      .replace(/\s*\([^)]*\)/, '')  // Remove parenthetical (24px) etc.
      .replace(/&ouml;/g, 'ö').replace(/&szlig;/g, 'ß').replace(/&auml;/g, 'ä').replace(/&uuml;/g, 'ü')
      .replace(/&mdash;/g, '—');
    if (shortLabel.length > 16) shortLabel = shortLabel.substring(0, 14) + '…';
    var checked = o.value === defaultVal;
    return '                    <button class="nc-segmented-control__item" role="radio" aria-checked="' +
      (checked ? 'true' : 'false') + '" tabindex="' + (checked ? '0' : '-1') +
      '"\n                            data-value="' + o.value + '">' + shortLabel + '</button>';
  }).join('\n');

  var label = ctrl.label.replace(/&ouml;/g, 'ö').replace(/&szlig;/g, 'ß').replace(/&auml;/g, 'ä').replace(/&uuml;/g, 'ü');

  var ds = '                <div class="docs-stage__control">\n' +
    '                  <span class="docs-stage__label">' + ctrl.label + '</span>\n' +
    '                  <div class="nc-segmented-control nc-segmented-control--sm"\n' +
    '                       role="radiogroup" aria-label="' + label + '"\n' +
    '                       data-stage-control="segmented" data-stage-target="' + ctrl.id + '" data-default="' + defaultVal + '">\n' +
    items + '\n' +
    '                  </div>\n' +
    '                </div>';

  var hiddenOpts = ctrl.options.map(function (o) {
    return '                <option value="' + o.value + '"' + (o.selected ? ' selected' : '') + '>' + o.label + '</option>';
  }).join('\n');
  var hidden = '              <select class="docs-stage__hidden" id="' + ctrl.id + '">\n' + hiddenOpts + '\n              </select>';

  return { ds: ds, hidden: hidden };
}

function generateChipGroup(ctrl) {
  var defaultVal = '';
  ctrl.options.forEach(function (o) { if (o.selected) defaultVal = o.value; });
  if (!defaultVal && ctrl.options.length > 0) defaultVal = ctrl.options[0].value;

  var chips = ctrl.options.map(function (o) {
    var sel = o.value === defaultVal;
    return '                    <button class="nc-chip nc-chip--sm' + (sel ? ' nc-chip--selected' : '') +
      '" type="button" aria-pressed="' + (sel ? 'true' : 'false') + '"\n' +
      '                            data-value="' + o.value + '">' + o.label + '</button>';
  }).join('\n');

  var label = ctrl.label.replace(/&ouml;/g, 'ö').replace(/&szlig;/g, 'ß').replace(/&auml;/g, 'ä').replace(/&uuml;/g, 'ü');

  var ds = '                <div class="docs-stage__control">\n' +
    '                  <span class="docs-stage__label">' + ctrl.label + '</span>\n' +
    '                  <div class="nc-chip-group"\n' +
    '                       data-stage-control="chips" data-stage-target="' + ctrl.id + '" data-default="' + defaultVal + '">\n' +
    chips + '\n' +
    '                  </div>\n' +
    '                </div>';

  var hiddenOpts = ctrl.options.map(function (o) {
    return '                <option value="' + o.value + '"' + (o.selected ? ' selected' : '') + '>' + o.label + '</option>';
  }).join('\n');
  var hidden = '              <select class="docs-stage__hidden" id="' + ctrl.id + '">\n' + hiddenOpts + '\n              </select>';

  return { ds: ds, hidden: hidden };
}

function generateNcSelect(ctrl) {
  var defaultVal = '';
  ctrl.options.forEach(function (o) { if (o.selected) defaultVal = o.value; });

  var ds = '                <div class="docs-stage__control">\n' +
    '                  <span class="docs-stage__label">' + ctrl.label + '</span>\n' +
    '                  <select class="nc-select nc-select--sm"\n' +
    '                          data-stage-control="select" data-stage-target="' + ctrl.id + '" data-default="' + defaultVal + '">\n';

  if (ctrl.hasOptgroup) {
    // Rebuild optgroups
    var groups = {};
    ctrl.options.forEach(function (o) {
      var g = o.group || '';
      if (!groups[g]) groups[g] = [];
      groups[g].push(o);
    });
    Object.keys(groups).forEach(function (g) {
      if (g) ds += '                    <optgroup label="' + g + '">\n';
      groups[g].forEach(function (o) {
        ds += '                      <option value="' + o.value + '"' + (o.selected ? ' selected' : '') + '>' + o.label + '</option>\n';
      });
      if (g) ds += '                    </optgroup>\n';
    });
  } else {
    ctrl.options.forEach(function (o) {
      ds += '                    <option value="' + o.value + '"' + (o.selected ? ' selected' : '') + '>' + o.label + '</option>\n';
    });
  }

  ds += '                  </select>\n' +
    '                </div>';

  // Hidden select (duplicate with original ID)
  var hiddenOpts = '';
  if (ctrl.hasOptgroup) {
    var groups = {};
    ctrl.options.forEach(function (o) {
      var g = o.group || '';
      if (!groups[g]) groups[g] = [];
      groups[g].push(o);
    });
    Object.keys(groups).forEach(function (g) {
      if (g) hiddenOpts += '                <optgroup label="' + g + '">\n';
      groups[g].forEach(function (o) {
        hiddenOpts += '                  <option value="' + o.value + '"' + (o.selected ? ' selected' : '') + '>' + o.label + '</option>\n';
      });
      if (g) hiddenOpts += '                </optgroup>\n';
    });
  } else {
    ctrl.options.forEach(function (o) {
      hiddenOpts += '                <option value="' + o.value + '"' + (o.selected ? ' selected' : '') + '>' + o.label + '</option>\n';
    });
  }
  var hidden = '              <select class="docs-stage__hidden" id="' + ctrl.id + '">\n' + hiddenOpts + '              </select>';

  return { ds: ds, hidden: hidden };
}

function generateSwitch(ctrl) {
  var ds = '                <label class="nc-switch nc-switch--sm"\n' +
    '                       data-stage-control="switch" data-stage-target="' + ctrl.id + '">\n' +
    '                  <input type="checkbox" class="nc-switch__input" role="switch"' + (ctrl.checked ? ' checked' : '') + ' />\n' +
    '                  <span class="nc-switch__track"><span class="nc-switch__thumb"></span></span>\n' +
    '                  <span class="nc-switch__label">' + ctrl.label + '</span>\n' +
    '                </label>';

  var hidden = '              <input type="checkbox" class="docs-stage__hidden" id="' + ctrl.id + '"' + (ctrl.checked ? ' checked' : '') + ' />';

  return { ds: ds, hidden: hidden };
}

function generateLegacySelect(ctrl) {
  // Keep as-is for hidden/conditional controls (toggle.html)
  var opts = ctrl.options.map(function (o) {
    return '                  <option value="' + o.value + '"' + (o.selected ? ' selected' : '') + '>' + o.label + '</option>';
  }).join('\n');

  var styleAttr = ctrl.wrapperStyle ? ' style="' + ctrl.wrapperStyle + '"' : '';
  var idAttr = ctrl.wrapperId ? ' id="' + ctrl.wrapperId + '"' : '';

  return '                <div class="docs-stage__control"' + idAttr + styleAttr + '>\n' +
    '                  <span class="docs-stage__label">' + ctrl.label + '</span>\n' +
    '                  <select class="docs-stage__select" id="' + ctrl.id + '">\n' +
    opts + '\n' +
    '                  </select>\n' +
    '                </div>';
}

// ---------------------------------------------------------------------------
// Main migration
// ---------------------------------------------------------------------------

function migrateFile(filePath) {
  var html = fs.readFileSync(filePath, 'utf-8');
  var fileName = path.basename(filePath);

  // Skip if already migrated
  if (html.indexOf('data-stage-control=') !== -1) {
    return { status: 'skip', reason: 'already migrated' };
  }

  // Skip if no toolbar
  if (html.indexOf('docs-stage__toolbar') === -1) {
    return { status: 'skip', reason: 'no toolbar' };
  }

  var controls = parseToolbar(html);
  if (!controls || controls.length === 0) {
    return { status: 'skip', reason: 'parse failed' };
  }

  var newToolbar = generateToolbar(controls, fileName);

  // Replace old toolbar with new
  var newHtml = html.replace(
    /<div class="docs-stage__toolbar"[^>]*>[\s\S]*?<\/div>\s*\n(\s*<div class="docs-stage__preview)/,
    newToolbar + '\n\n$1'
  );

  if (newHtml === html) {
    return { status: 'skip', reason: 'replacement failed' };
  }

  fs.writeFileSync(filePath, newHtml, 'utf-8');
  return { status: 'migrated', controls: controls.length };
}

// Run
var files = fs.readdirSync(CONTENT_DIR).filter(function (f) { return f.endsWith('.html'); });
var migrated = 0;
var skipped = 0;
var failed = 0;

for (var i = 0; i < files.length; i++) {
  var filePath = path.join(CONTENT_DIR, files[i]);
  var result = migrateFile(filePath);

  if (result.status === 'migrated') {
    console.log('  MIGRATED: ' + files[i] + ' (' + result.controls + ' controls)');
    migrated++;
  } else if (result.status === 'skip') {
    if (result.reason !== 'no toolbar') {
      console.log('  SKIP: ' + files[i] + ' — ' + result.reason);
    }
    skipped++;
  }
}

console.log('\n============================================================');
console.log('Migration: ' + migrated + ' migrated, ' + skipped + ' skipped');
