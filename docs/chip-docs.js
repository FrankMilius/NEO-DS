// ==========================================================================
// Chip Docs — Tab Navigation + Staging Area Controller
// ==========================================================================
// Tabs: Benutzung | Style | API | Accessibility
// Staging Area: Theme, Size, Selected, Removable, Content, Disabled
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
  var selectedChk   = document.getElementById('stage-selected');
  var removableChk  = document.getElementById('stage-removable');
  var contentSelect = document.getElementById('stage-content');
  var disabledChk   = document.getElementById('stage-disabled');
  var preview       = document.getElementById('stage-preview');
  var codeOutput    = document.getElementById('stage-code');

  if (!preview) return;

  // SVG: Checkmark icon for selected state
  var iconCheckmark = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3.5 8 6.5 11 12.5 5"/></svg>';

  // SVG: X icon for remove button
  var iconClose = '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="4" y1="4" x2="10" y2="10"/><line x1="10" y1="4" x2="4" y2="10"/></svg>';

  // Demo avatar URL
  var demoAvatarUrl = 'https://api.dicebear.com/9.x/initials/svg?seed=FM&backgroundColor=1a1a1a&textColor=ffffff';

  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function updateStage() {
    var theme     = themeSelect.value;
    var size      = sizeSelect.value;
    var selected  = selectedChk.checked;
    var removable = removableChk.checked;
    var content   = contentSelect.value;
    var disabled  = disabledChk.checked;

    // Apply theme to preview area
    var themes = ['neo-light-theme', 'neo-dark-theme', 'customer-light-theme', 'customer-dark-theme'];
    themes.forEach(function (t) { preview.classList.remove(t); });
    preview.classList.add(theme);

    // Build class list
    var classes = ['nc-chip'];
    if (size !== 'md') classes.push('nc-chip--' + size);
    if (selected) classes.push('nc-chip--selected');
    var classStr = classes.join(' ');

    var ariaPressed = selected ? 'true' : 'false';

    // Build inner HTML (live preview)
    var inner = '';
    // Build code output (clean representation)
    var codeInner = '';

    // --- Content: icon-text mode ---
    if (content === 'icon-text') {
      if (selected) {
        inner += '<span class="nc-chip__icon">' + iconCheckmark + '</span>';
        codeInner += '\n  <span class="nc-chip__icon">\n    <svg><!-- checkmark --></svg>\n  </span>';
      } else {
        inner += '<span class="nc-chip__icon"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6"/></svg></span>';
        codeInner += '\n  <span class="nc-chip__icon">\n    <svg><!-- icon --></svg>\n  </span>';
      }
      inner += '<span class="nc-chip__label">Filter</span>';
      codeInner += '\n  <span class="nc-chip__label">Filter</span>';
    }
    // --- Content: avatar-text mode ---
    else if (content === 'avatar-text') {
      inner += '<img class="nc-chip__avatar" src="' + demoAvatarUrl + '" alt="" />';
      inner += '<span class="nc-chip__label">Frank M.</span>';
      codeInner += '\n  <img class="nc-chip__avatar" src="avatar.jpg" alt="" />';
      codeInner += '\n  <span class="nc-chip__label">Frank M.</span>';
    }
    // --- Content: text only ---
    else {
      inner += 'Filter';
      codeInner += 'Filter';
    }

    // --- Removable ---
    if (removable) {
      inner += '<button class="nc-chip__remove" type="button" aria-label="Entfernen"' + (disabled ? ' disabled' : '') + '>' + iconClose + '</button>';
      codeInner += '\n  <button class="nc-chip__remove" type="button" aria-label="Entfernen">\n    <svg><!-- x --></svg>\n  </button>';
    }

    // Build the full HTML string for live preview
    var disabledAttr = disabled ? ' disabled' : '';
    var html = '<button class="' + classStr + '" type="button" aria-pressed="' + ariaPressed + '"' + disabledAttr + '>' + inner + '</button>';

    // Build the full code string for the code output
    var codeStr;
    if (content === 'text' && !removable) {
      codeStr = '<button class="' + classStr + '" type="button" aria-pressed="' + ariaPressed + '"' + disabledAttr + '>' + codeInner + '</button>';
    } else {
      codeStr = '<button class="' + classStr + '" type="button" aria-pressed="' + ariaPressed + '"' + disabledAttr + '>' + codeInner + '\n</button>';
    }

    preview.innerHTML = html;
    codeOutput.textContent = codeStr;
  }

  // Event listeners
  themeSelect.addEventListener('change', updateStage);
  sizeSelect.addEventListener('change', updateStage);
  selectedChk.addEventListener('change', updateStage);
  removableChk.addEventListener('change', updateStage);
  contentSelect.addEventListener('change', updateStage);
  disabledChk.addEventListener('change', updateStage);

  // Initial render
  updateStage();

})();
