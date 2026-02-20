// ==========================================================================
// Tooltip Docs — Tab Navigation + Staging Area Controller
// ==========================================================================
// Tabs: Benutzung | Style | API | Accessibility
// Staging Area: Theme, Position, Arrow
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

  var themeSelect    = document.getElementById('stage-theme');
  var positionSelect = document.getElementById('stage-position');
  var arrowChk       = document.getElementById('stage-arrow');
  var preview        = document.getElementById('stage-preview');
  var codeOutput     = document.getElementById('stage-code');

  if (!preview) return;

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function updateStage() {
    var theme    = themeSelect.value;
    var position = positionSelect.value;
    var arrow    = arrowChk.checked;

    // Apply theme to preview area
    var themes = ['neo-light-theme', 'neo-dark-theme', 'customer-light-theme', 'customer-dark-theme'];
    themes.forEach(function (t) { preview.classList.remove(t); });
    preview.classList.add(theme);

    // Build wrapper class
    var wrapperClass = 'nc-tooltip';
    if (position !== 'top') {
      wrapperClass += ' nc-tooltip--' + position;
    }

    // Arrow HTML
    var arrowHtml = arrow ? '\n    <span class="nc-tooltip__arrow"></span>' : '';
    var arrowCode = arrow ? '\n    <span class="nc-tooltip__arrow"></span>' : '';

    // Build preview HTML (force-visible)
    var html = '<span class="' + wrapperClass + '">'
             + '<button class="nc-button nc-button--outline" aria-describedby="stage-tip">Hover mich</button>'
             + '<span class="nc-tooltip__content" role="tooltip" id="stage-tip" style="opacity:1;visibility:visible;">'
             + 'Tooltip-Text'
             + arrowHtml
             + '</span>'
             + '</span>';

    preview.innerHTML = html;

    // Build code output (without inline force-visible style)
    var codeStr = '<span class="' + wrapperClass + '">\n'
                + '  <button class="nc-button nc-button--outline" aria-describedby="tip-id">Hover mich</button>\n'
                + '  <span class="nc-tooltip__content" role="tooltip" id="tip-id">\n'
                + '    Tooltip-Text'
                + arrowCode + '\n'
                + '  </span>\n'
                + '</span>';

    codeOutput.textContent = codeStr;
  }

  // Event listeners
  themeSelect.addEventListener('change', updateStage);
  positionSelect.addEventListener('change', updateStage);
  arrowChk.addEventListener('change', updateStage);

  // Initial render
  updateStage();

})();
