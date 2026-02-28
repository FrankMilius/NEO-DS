// ==========================================================================
// Badge Docs — Tab Navigation + Staging Area Controller
// ==========================================================================
// Tabs: Benutzung | Style | API | Accessibility
// Staging Area: Theme, Size, Tone, Emphasis, Icon, Dot Mode
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
  var sizeSelect     = document.getElementById('stage-size');
  var variantSelect  = document.getElementById('stage-variant');
  var emphasisSelect = document.getElementById('stage-emphasis');
  var iconSelect     = document.getElementById('stage-icon');
  var dotChk         = document.getElementById('stage-dot');
  var preview        = document.getElementById('stage-preview');
  var codeOutput     = document.getElementById('stage-code');

  if (!preview) return;

  // SVG icon templates (inline)
  // Checkmark icon (for leading icon demo)
  var iconCheckmark = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';

  // Info-circle icon (alternative leading icon)
  var iconInfoCircle = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function updateStage() {
    var theme    = themeSelect.value;
    var size     = sizeSelect.value;
    var variant  = variantSelect.value;
    var emphasis = emphasisSelect ? emphasisSelect.value : 'solid';
    var icon     = iconSelect.value;
    var dot      = dotChk.checked;

    // Apply theme to preview area
    var themes = ['neo-light-theme', 'neo-dark-theme', 'customer-light-theme', 'customer-dark-theme'];
    themes.forEach(function (t) { preview.classList.remove(t); });
    preview.classList.add(theme);

    // Build class list
    var classes = ['nc-badge'];

    // Size modifier (md = default, no modifier needed)
    if (size === 'sm') {
      classes.push('nc-badge--sm');
    }

    // Dot modifier
    if (dot) {
      classes.push('nc-badge--dot');
    }

    // Tone modifier (default = no modifier)
    if (variant !== 'default') {
      classes.push('nc-badge--' + variant);
    }

    // Emphasis modifier (solid = no modifier)
    if (emphasis !== 'solid') {
      classes.push('nc-badge--' + emphasis);
    }

    var classStr = classes.join(' ');

    // Build HTML
    var html = '';
    var codeStr = '';

    if (dot) {
      // Dot mode: no text, no icon
      html = '<span class="' + classStr + '"></span>';
      codeStr = '<span class="' + classStr + '"></span>';
    } else if (icon === 'leading') {
      // Leading icon + text
      var label = variant === 'default' ? 'Badge' : variant.charAt(0).toUpperCase() + variant.slice(1);
      var chosenIcon = (variant === 'success') ? iconCheckmark : iconInfoCircle;
      var chosenIconName = (variant === 'success') ? 'checkmark' : 'info-circle';

      html = '<span class="' + classStr + '">'
           + '<span class="nc-badge__icon">' + chosenIcon + '</span>'
           + ' ' + label
           + '</span>';

      codeStr = '<span class="' + classStr + '">\n'
              + '  <span class="nc-badge__icon" aria-hidden="true">\n'
              + '    <svg><!-- ' + chosenIconName + ' --></svg>\n'
              + '  </span>\n'
              + '  ' + label + '\n'
              + '</span>';
    } else {
      // Text only
      var label = variant === 'default' ? 'Badge' : variant.charAt(0).toUpperCase() + variant.slice(1);
      html = '<span class="' + classStr + '">' + label + '</span>';
      codeStr = '<span class="' + classStr + '">' + label + '</span>';
    }

    preview.innerHTML = html;
    codeOutput.textContent = codeStr;
  }

  // Event listeners
  themeSelect.addEventListener('change', updateStage);
  sizeSelect.addEventListener('change', updateStage);
  variantSelect.addEventListener('change', updateStage);
  if (emphasisSelect) emphasisSelect.addEventListener('change', updateStage);
  iconSelect.addEventListener('change', updateStage);
  dotChk.addEventListener('change', updateStage);

  // Initial render
  updateStage();

})();
