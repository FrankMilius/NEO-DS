// ==========================================================================
// Alert Docs — Tab Navigation + Staging Area Controller
// ==========================================================================
// Tabs: Benutzung | Style | API | Accessibility
// Staging Area: Theme, Variant, Title, Description, Close Button
// ==========================================================================

(function () {
  'use strict';

  // -----------------------------------------------------------------------
  // 1. Tab Navigation
  // -----------------------------------------------------------------------

  var tabList = document.querySelector('.docs-tabs__list');
  var triggers = tabList ? tabList.querySelectorAll('.docs-tabs__trigger') : [];
  var panels = document.querySelectorAll('.docs-tabs__panel');

  function activateTab(trigger) {
    // Deactivate all
    triggers.forEach(function (t) { t.setAttribute('aria-selected', 'false'); });
    panels.forEach(function (p) { p.classList.remove('is-active'); });

    // Activate selected
    trigger.setAttribute('aria-selected', 'true');
    var panelId = trigger.getAttribute('aria-controls');
    var panel = document.getElementById(panelId);
    if (panel) panel.classList.add('is-active');
  }

  triggers.forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      activateTab(trigger);
    });

    // Arrow key navigation within tabs
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
  // 2. Staging Area
  // -----------------------------------------------------------------------

  var themeSelect   = document.getElementById('stage-theme');
  var variantSelect = document.getElementById('stage-variant');
  var titleChk      = document.getElementById('stage-title');
  var descChk       = document.getElementById('stage-description');
  var closeChk      = document.getElementById('stage-close');
  var preview       = document.getElementById('stage-preview');
  var codeOutput    = document.getElementById('stage-code');

  if (!preview) return;

  // SVG icon templates (inline) per variant
  var iconInfo = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';

  var iconSuccess = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>';

  var iconWarning = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';

  var iconDanger = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';

  var iconClose = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';

  var icons = {
    info: iconInfo,
    success: iconSuccess,
    warning: iconWarning,
    danger: iconDanger
  };

  var titles = {
    info: 'Info Titel',
    success: 'Erfolg Titel',
    warning: 'Warnung Titel',
    danger: 'Fehler Titel'
  };

  var descriptions = {
    info: 'Dies ist eine informative Nachricht.',
    success: 'Die Aktion wurde erfolgreich ausgef\u00fchrt.',
    warning: 'Bitte \u00fcberpr\u00fcfen Sie die Eingabe.',
    danger: 'Ein kritischer Fehler ist aufgetreten.'
  };

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function updateStage() {
    var theme   = themeSelect.value;
    var variant = variantSelect.value;
    var showTitle = titleChk.checked;
    var showDesc  = descChk.checked;
    var showClose = closeChk.checked;

    // Apply theme to preview area
    var themes = ['neo-light-theme', 'neo-dark-theme', 'customer-light-theme', 'customer-dark-theme'];
    themes.forEach(function (t) { preview.classList.remove(t); });
    preview.classList.add(theme);

    // Determine role based on variant
    var role = (variant === 'danger' || variant === 'warning') ? 'alert' : 'status';

    // Build class string
    var classStr = 'nc-alert nc-alert--' + variant;

    // Get variant-specific icon
    var variantIcon = icons[variant];

    // Build HTML
    var html = '<div class="' + classStr + '" role="' + role + '">';
    html += '<span class="nc-alert__icon" aria-hidden="true">' + variantIcon + '</span>';
    html += '<div class="nc-alert__content">';

    if (showTitle) {
      html += '<p class="nc-alert__title">' + titles[variant] + '</p>';
    }
    if (showDesc) {
      html += '<p class="nc-alert__description">' + descriptions[variant] + '</p>';
    }

    html += '</div>';

    if (showClose) {
      html += '<button class="nc-alert__close" aria-label="Schlie\u00dfen">' + iconClose + '</button>';
    }

    html += '</div>';

    // Build code string
    var codeStr = '<div class="' + classStr + '" role="' + role + '">\n';
    codeStr += '  <span class="nc-alert__icon" aria-hidden="true">\n';
    codeStr += '    <svg><!-- ' + variant + ' icon --></svg>\n';
    codeStr += '  </span>\n';
    codeStr += '  <div class="nc-alert__content">\n';

    if (showTitle) {
      codeStr += '    <p class="nc-alert__title">' + titles[variant] + '</p>\n';
    }
    if (showDesc) {
      codeStr += '    <p class="nc-alert__description">' + descriptions[variant] + '</p>\n';
    }

    codeStr += '  </div>\n';

    if (showClose) {
      codeStr += '  <button class="nc-alert__close" aria-label="Schlie\u00dfen">\n';
      codeStr += '    <svg><!-- close icon --></svg>\n';
      codeStr += '  </button>\n';
    }

    codeStr += '</div>';

    preview.innerHTML = html;
    codeOutput.textContent = codeStr;
  }

  // Event listeners
  themeSelect.addEventListener('change', updateStage);
  variantSelect.addEventListener('change', updateStage);
  titleChk.addEventListener('change', updateStage);
  descChk.addEventListener('change', updateStage);
  closeChk.addEventListener('change', updateStage);

  // Initial render
  updateStage();

})();
