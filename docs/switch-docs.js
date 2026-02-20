// ==========================================================================
// Switch Docs — Tab Navigation + Staging Area Controller
// ==========================================================================
// Tabs: Benutzung | Style | API | Accessibility
// Staging Area: Theme, Variant (Button/Input), State, Compact
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
  var compactChk    = document.getElementById('stage-compact');
  var preview       = document.getElementById('stage-preview');
  var codeOutput    = document.getElementById('stage-code');

  if (!preview) return;

  function updateStage() {
    var theme   = themeSelect.value;
    var variant = variantSelect.value;
    var state   = stateSelect.value;
    var compact = compactChk.checked;

    // Apply theme to preview area
    var themes = ['neo-light-theme', 'neo-dark-theme', 'customer-light-theme', 'customer-dark-theme'];
    themes.forEach(function (t) { preview.classList.remove(t); });
    preview.classList.add(theme);

    // Build wrapper classes
    var wrapperClasses = ['nc-switch'];
    if (compact) wrapperClasses.push('nc-switch--sm');
    var wrapperClass = wrapperClasses.join(' ');

    var isOn = (state === 'on');
    var isDisabled = (state === 'disabled');

    var html = '';
    var codeStr = '';

    if (variant === 'button') {
      // Button pattern
      var ariaChecked = isOn ? 'true' : 'false';
      var disabledAttr = isDisabled ? ' disabled' : '';
      var labelText = isOn ? 'An' : (isDisabled ? 'Deaktiviert' : 'Aus');

      html = '<div class="' + wrapperClass + '">'
           + '<button class="nc-switch__track" role="switch" aria-checked="' + ariaChecked + '"' + disabledAttr + '>'
           + '<span class="nc-switch__thumb"></span>'
           + '</button>'
           + '<span class="nc-switch__label">' + labelText + '</span>'
           + '</div>';

      var codeLines = [];
      codeLines.push('<div class="' + wrapperClass + '">');
      codeLines.push('  <button class="nc-switch__track"');
      codeLines.push('          role="switch"');
      codeLines.push('          aria-checked="' + ariaChecked + '"' + disabledAttr + '>');
      codeLines.push('    <span class="nc-switch__thumb"></span>');
      codeLines.push('  </button>');
      codeLines.push('  <span class="nc-switch__label">' + labelText + '</span>');
      codeLines.push('</div>');
      codeStr = codeLines.join('\n');

    } else {
      // Input pattern
      var checkedAttr = isOn ? ' checked' : '';
      var disabledAttr = isDisabled ? ' disabled' : '';
      var labelText = isOn ? 'An' : (isDisabled ? 'Deaktiviert' : 'Aus');

      html = '<label class="' + wrapperClass + '">'
           + '<input type="checkbox" class="nc-switch__input" role="switch"' + checkedAttr + disabledAttr + ' />'
           + '<span class="nc-switch__track">'
           + '<span class="nc-switch__thumb"></span>'
           + '</span>'
           + '<span class="nc-switch__label">' + labelText + '</span>'
           + '</label>';

      var codeLines = [];
      codeLines.push('<label class="' + wrapperClass + '">');
      codeLines.push('  <input type="checkbox" class="nc-switch__input"');
      codeLines.push('         role="switch"' + checkedAttr + disabledAttr + ' />');
      codeLines.push('  <span class="nc-switch__track">');
      codeLines.push('    <span class="nc-switch__thumb"></span>');
      codeLines.push('  </span>');
      codeLines.push('  <span class="nc-switch__label">' + labelText + '</span>');
      codeLines.push('</label>');
      codeStr = codeLines.join('\n');
    }

    preview.innerHTML = html;
    codeOutput.textContent = codeStr;
  }

  // Event listeners
  themeSelect.addEventListener('change', updateStage);
  variantSelect.addEventListener('change', updateStage);
  stateSelect.addEventListener('change', updateStage);
  compactChk.addEventListener('change', updateStage);

  // Initial render
  updateStage();

})();
