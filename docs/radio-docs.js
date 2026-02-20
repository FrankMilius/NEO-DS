// ==========================================================================
// Radio Docs — Tab Navigation + Staging Area Controller
// ==========================================================================
// Tabs: Benutzung | Style | API | Accessibility
// Staging Area: Theme, Size, State
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

  var themeSelect = document.getElementById('stage-theme');
  var sizeSelect  = document.getElementById('stage-size');
  var stateSelect = document.getElementById('stage-state');
  var preview     = document.getElementById('stage-preview');
  var codeOutput  = document.getElementById('stage-code');

  if (!preview) return;

  function updateStage() {
    var theme = themeSelect.value;
    var size  = sizeSelect.value;
    var state = stateSelect.value;

    // Apply theme to preview area
    var themes = ['neo-light-theme', 'neo-dark-theme', 'customer-light-theme', 'customer-dark-theme'];
    themes.forEach(function (t) { preview.classList.remove(t); });
    preview.classList.add(theme);

    // Build class list
    var wrapperClasses = ['nc-radio'];
    if (size === 'sm') wrapperClasses.push('nc-radio--sm');
    if (size === 'lg') wrapperClasses.push('nc-radio--lg');
    if (state === 'error') wrapperClasses.push('nc-radio--error');

    var wrapperClass = wrapperClasses.join(' ');

    // Input attributes
    var checked = (state === 'checked') ? ' checked' : '';
    var disabled = (state === 'disabled') ? ' disabled' : '';

    // Build HTML
    var html = '<label class="' + wrapperClass + '">'
             + '<input type="radio" class="nc-radio__input" name="stage-radio"' + checked + disabled + ' />'
             + '<span class="nc-radio__control"></span>'
             + '<span class="nc-radio__label">Option</span>'
             + '</label>';

    // Build code string
    var codeLines = [];
    codeLines.push('<label class="' + wrapperClass + '">');
    codeLines.push('  <input type="radio" class="nc-radio__input"');
    codeLines.push('         name="group-name" value="option-1"' + checked + disabled + ' />');
    codeLines.push('  <span class="nc-radio__control"></span>');
    codeLines.push('  <span class="nc-radio__label">Option</span>');
    codeLines.push('</label>');

    preview.innerHTML = html;
    codeOutput.textContent = codeLines.join('\n');
  }

  // Event listeners
  themeSelect.addEventListener('change', updateStage);
  sizeSelect.addEventListener('change', updateStage);
  stateSelect.addEventListener('change', updateStage);

  // Initial render
  updateStage();

})();
