// ==========================================================================
// Avatar Docs — Tab Navigation + Staging Area Controller
// ==========================================================================
// Tabs: Benutzung | Style | API | Accessibility
// Staging Area: Theme, Size, Content, Badge, Shape, Ring
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
  var sizeSelect    = document.getElementById('stage-size');
  var contentSelect = document.getElementById('stage-content');
  var badgeSelect   = document.getElementById('stage-badge');
  var shapeSelect   = document.getElementById('stage-shape');
  var ringChk       = document.getElementById('stage-ring');
  var preview       = document.getElementById('stage-preview');
  var codeOutput    = document.getElementById('stage-code');

  if (!preview) return;

  // SVG: Generic user icon for fallback demo
  var iconUser = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';

  // Demo image URL (placeholder)
  var demoImageUrl = 'https://api.dicebear.com/9.x/initials/svg?seed=FM&backgroundColor=1a1a1a&textColor=ffffff';

  function updateStage() {
    var theme   = themeSelect.value;
    var size    = sizeSelect.value;
    var content = contentSelect.value;
    var badge   = badgeSelect.value;
    var shape   = shapeSelect.value;
    var ring    = ringChk.checked;

    // Apply theme to preview area
    var themes = ['neo-light-theme', 'neo-dark-theme', 'customer-light-theme', 'customer-dark-theme'];
    themes.forEach(function (t) { preview.classList.remove(t); });
    preview.classList.add(theme);

    // Build class list
    var classes = ['nc-avatar'];
    if (size !== 'md') classes.push('nc-avatar--' + size);
    if (shape === 'square') classes.push('nc-avatar--square');
    if (ring) classes.push('nc-avatar--ring');
    var classStr = classes.join(' ');

    // Build inner HTML
    var inner = '';
    var codeInner = '';

    if (content === 'image') {
      inner += '<img class="nc-avatar__image" src="' + demoImageUrl + '" alt="Frank Milius" />';
      inner += '<span class="nc-avatar__fallback">FM</span>';
      codeInner += '  <img class="nc-avatar__image" src="user.jpg" alt="Max Mustermann" />\n';
      codeInner += '  <span class="nc-avatar__fallback">MM</span>';
    } else if (content === 'initials') {
      inner += '<span class="nc-avatar__fallback">FM</span>';
      codeInner += '  <span class="nc-avatar__fallback" role="img" aria-label="Frank Milius">FM</span>';
    } else if (content === 'icon') {
      inner += '<span class="nc-avatar__fallback">' + iconUser + '</span>';
      codeInner += '  <span class="nc-avatar__fallback" role="img" aria-label="Benutzer">\n    <svg>...</svg>\n  </span>';
    }

    // Badge
    if (badge !== 'none') {
      inner += '<span class="nc-avatar__badge nc-avatar__badge--' + badge + '"></span>';
      codeInner += '\n  <span class="nc-avatar__badge nc-avatar__badge--' + badge + '"></span>';
    }

    var html = '<div class="' + classStr + '">' + inner + '</div>';
    var codeStr = '<div class="' + classStr + '">\n' + codeInner + '\n</div>';

    preview.innerHTML = html;
    codeOutput.textContent = codeStr;
  }

  // Event listeners
  themeSelect.addEventListener('change', updateStage);
  sizeSelect.addEventListener('change', updateStage);
  contentSelect.addEventListener('change', updateStage);
  badgeSelect.addEventListener('change', updateStage);
  shapeSelect.addEventListener('change', updateStage);
  ringChk.addEventListener('change', updateStage);

  // Initial render
  updateStage();

})();
