// ==========================================================================
// File Upload Docs — Tab Navigation + Staging Area Controller
// ==========================================================================
// Tabs: Benutzung | Style | API | Accessibility
// Staging Area: Theme, Variant (Dropzone/Compact), State (Default/Error/Disabled)
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
  var stateSelect   = document.getElementById('stage-state');
  var preview       = document.getElementById('stage-preview');
  var codeOutput    = document.getElementById('stage-code');

  if (!preview) return;

  // SVG icons
  var iconUploadLg = '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>';
  var iconUploadSm = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>';

  function updateStage() {
    var theme   = themeSelect.value;
    var variant = variantSelect.value;
    var state   = stateSelect.value;

    // Apply theme to preview area
    var themes = ['neo-light-theme', 'neo-dark-theme', 'customer-light-theme', 'customer-dark-theme'];
    themes.forEach(function (t) { preview.classList.remove(t); });
    preview.classList.add(theme);

    // Build class list
    var classes = ['nc-file-upload'];

    if (variant === 'compact') {
      classes.push('nc-file-upload--compact');
    }

    if (state === 'error') {
      classes.push('nc-file-upload--error');
    } else if (state === 'disabled') {
      classes.push('nc-file-upload--disabled');
    }

    var classStr = classes.join(' ');

    // Build HTML
    var html = '';
    var codeStr = '';
    var isDisabled = state === 'disabled';
    var roleAttr = isDisabled ? '' : ' role="button" tabindex="0"';
    var disabledAttr = isDisabled ? ' aria-disabled="true"' : '';
    var inputDisabled = isDisabled ? ' disabled' : '';

    if (variant === 'dropzone') {
      html = '<div class="' + classStr + '"' + roleAttr + disabledAttr + '>'
           + '<input class="nc-file-upload__input" type="file" multiple tabindex="-1"' + inputDisabled + ' />'
           + '<span class="nc-file-upload__icon">' + iconUploadLg + '</span>'
           + '<span class="nc-file-upload__text">Dateien hierher ziehen</span>'
           + '<span class="nc-file-upload__subtext">oder <span class="nc-file-upload__button">Dateien ausw\u00E4hlen</span></span>'
           + '</div>';

      codeStr = '<div class="' + classStr + '"' + roleAttr + disabledAttr + '>\n'
              + '  <input class="nc-file-upload__input" type="file" multiple tabindex="-1"' + inputDisabled + ' />\n'
              + '  <span class="nc-file-upload__icon">\n'
              + '    <svg><!-- upload icon --></svg>\n'
              + '  </span>\n'
              + '  <span class="nc-file-upload__text">Dateien hierher ziehen</span>\n'
              + '  <span class="nc-file-upload__subtext">\n'
              + '    oder <span class="nc-file-upload__button">Dateien ausw\u00E4hlen</span>\n'
              + '  </span>\n'
              + '</div>';
    } else {
      // compact
      html = '<div class="' + classStr + '"' + roleAttr + disabledAttr + '>'
           + '<input class="nc-file-upload__input" type="file" multiple tabindex="-1"' + inputDisabled + ' />'
           + '<span class="nc-file-upload__icon">' + iconUploadSm + '</span>'
           + '<span class="nc-file-upload__text">Dateien ausw\u00E4hlen</span>'
           + '</div>';

      codeStr = '<div class="' + classStr + '"' + roleAttr + disabledAttr + '>\n'
              + '  <input class="nc-file-upload__input" type="file" multiple tabindex="-1"' + inputDisabled + ' />\n'
              + '  <span class="nc-file-upload__icon">\n'
              + '    <svg><!-- upload icon --></svg>\n'
              + '  </span>\n'
              + '  <span class="nc-file-upload__text">Dateien ausw\u00E4hlen</span>\n'
              + '</div>';
    }

    preview.innerHTML = '<div style="max-width: 480px; width: 100%;">' + html + '</div>';
    codeOutput.textContent = codeStr;
  }

  // Event listeners
  themeSelect.addEventListener('change', updateStage);
  variantSelect.addEventListener('change', updateStage);
  stateSelect.addEventListener('change', updateStage);

  // Initial render
  updateStage();

})();
