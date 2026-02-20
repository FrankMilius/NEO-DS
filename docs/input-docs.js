// ==========================================================================
// Input Docs — Tab Navigation + Staging Area Controller
// ==========================================================================
// Tabs: Benutzung | Style | API | Accessibility
// Staging Area: Theme, Type, Size, State, Icon
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
  var typeSelect  = document.getElementById('stage-type');
  var sizeSelect  = document.getElementById('stage-size');
  var stateSelect = document.getElementById('stage-state');
  var iconChk     = document.getElementById('stage-icon');
  var preview     = document.getElementById('stage-preview');
  var codeOutput  = document.getElementById('stage-code');

  if (!preview) return;

  // SVG icon templates (inline)
  var iconSearch = '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>';
  var iconEye = '<svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
  var iconMail = '<svg viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22,4 12,13 2,4"/></svg>';

  // Placeholder map per type
  var placeholders = {
    text: 'Text eingeben...',
    email: 'name@example.com',
    url: 'https://example.com',
    tel: '+49 123 456789',
    password: 'Passwort eingeben...',
    search: 'Suchen...',
    number: '0'
  };

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function updateStage() {
    var theme = themeSelect.value;
    var type  = typeSelect.value;
    var size  = sizeSelect.value;
    var state = stateSelect.value;
    var icon  = iconChk.checked;

    // Apply theme to preview area
    var themes = ['neo-light-theme', 'neo-dark-theme', 'customer-light-theme', 'customer-dark-theme'];
    themes.forEach(function (t) { preview.classList.remove(t); });
    preview.classList.add(theme);

    // Build class list
    var classes = ['nc-input'];

    // Size modifier (md = default, no modifier needed)
    if (size === 'sm') {
      classes.push('nc-input--sm');
    } else if (size === 'lg') {
      classes.push('nc-input--lg');
    }

    // State modifier
    if (state === 'error') {
      classes.push('nc-input--error');
    } else if (state === 'success') {
      classes.push('nc-input--success');
    }

    // Type modifier for search/password with icon
    var useWrapper = false;
    var iconPosition = 'start'; // 'start' or 'end'
    var iconSvg = '';

    if (icon) {
      if (type === 'search') {
        classes.push('nc-input--search');
        useWrapper = true;
        iconPosition = 'start';
        iconSvg = iconSearch;
      } else if (type === 'password') {
        classes.push('nc-input--password');
        useWrapper = true;
        iconPosition = 'end';
        iconSvg = iconEye;
      } else {
        // Generic icon for other types — use search icon on start
        classes.push('nc-input--search');
        useWrapper = true;
        iconPosition = 'start';
        iconSvg = iconMail;
      }
    }

    var classStr = classes.join(' ');
    var placeholder = placeholders[type] || 'Eingabe...';

    // Build attributes
    var attrs = '';
    if (state === 'disabled') {
      attrs += ' disabled';
    } else if (state === 'readonly') {
      attrs += ' readonly value="Readonly-Wert"';
    }
    if (state === 'error') {
      attrs += ' aria-invalid="true"';
    }

    // Build HTML
    var html = '';
    var codeStr = '';

    if (useWrapper) {
      // With icon wrapper
      if (iconPosition === 'start') {
        html = '<div class="nc-input-wrapper" style="max-width: 360px; width: 100%;">'
             + '<span class="nc-input__icon">' + iconSvg + '</span>'
             + '<input class="' + classStr + '" type="' + type + '" placeholder="' + placeholder + '"' + attrs + ' />'
             + '</div>';

        codeStr = '<div class="nc-input-wrapper">\n'
                + '  <span class="nc-input__icon" aria-hidden="true">\n'
                + '    <svg><!-- icon --></svg>\n'
                + '  </span>\n'
                + '  <input class="' + classStr + '" type="' + type + '"\n'
                + '         placeholder="' + placeholder + '"' + attrs + ' />\n'
                + '</div>';
      } else {
        html = '<div class="nc-input-wrapper" style="max-width: 360px; width: 100%;">'
             + '<input class="' + classStr + '" type="' + type + '" placeholder="' + placeholder + '"' + attrs + ' />'
             + '<span class="nc-input__icon nc-input__icon--end">' + iconSvg + '</span>'
             + '</div>';

        codeStr = '<div class="nc-input-wrapper">\n'
                + '  <input class="' + classStr + '" type="' + type + '"\n'
                + '         placeholder="' + placeholder + '"' + attrs + ' />\n'
                + '  <span class="nc-input__icon nc-input__icon--end" aria-hidden="true">\n'
                + '    <svg><!-- icon --></svg>\n'
                + '  </span>\n'
                + '</div>';
      }
    } else {
      // Without wrapper
      html = '<input class="' + classStr + '" type="' + type + '" placeholder="' + placeholder + '"' + attrs + ' style="max-width: 360px; width: 100%;" />';

      codeStr = '<input class="' + classStr + '" type="' + type + '"\n'
              + '       placeholder="' + placeholder + '"' + attrs + ' />';
    }

    preview.innerHTML = html;
    codeOutput.textContent = codeStr;
  }

  // Event listeners
  themeSelect.addEventListener('change', updateStage);
  typeSelect.addEventListener('change', updateStage);
  sizeSelect.addEventListener('change', updateStage);
  stateSelect.addEventListener('change', updateStage);
  iconChk.addEventListener('change', updateStage);

  // Initial render
  updateStage();

})();
