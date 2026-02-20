// ==========================================================================
// Select Docs — Tab Navigation + Staging Area Controller
// ==========================================================================
// Tabs: Benutzung | Style | API | Accessibility
// Staging Area: Theme, Size, State, Multiple
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
  var stateSelect    = document.getElementById('stage-state');
  var multipleChk    = document.getElementById('stage-multiple');
  var preview        = document.getElementById('stage-preview');
  var codeOutput     = document.getElementById('stage-code');

  if (!preview) return;

  function updateStage() {
    var theme    = themeSelect.value;
    var size     = sizeSelect.value;
    var state    = stateSelect.value;
    var multiple = multipleChk.checked;

    // Apply theme to preview area
    var themes = ['neo-light-theme', 'neo-dark-theme', 'customer-light-theme', 'customer-dark-theme'];
    themes.forEach(function (t) { preview.classList.remove(t); });
    preview.classList.add(theme);

    // Build class list
    var classes = ['nc-select'];

    // Size modifier (md = default, no modifier needed)
    if (size === 'sm') {
      classes.push('nc-select--sm');
    } else if (size === 'lg') {
      classes.push('nc-select--lg');
    }

    // State modifier
    if (state === 'error') {
      classes.push('nc-select--error');
    } else if (state === 'success') {
      classes.push('nc-select--success');
    }

    // Multiple modifier
    if (multiple) {
      classes.push('nc-select--multiple');
    }

    var classStr = classes.join(' ');
    var isDisabled = state === 'disabled';

    // Build HTML
    var html = '';
    var codeStr = '';

    if (multiple) {
      html = '<select class="' + classStr + '" multiple size="4"'
           + (isDisabled ? ' disabled' : '') + '>'
           + '<option>Option 1</option>'
           + '<option>Option 2</option>'
           + '<option>Option 3</option>'
           + '<option>Option 4</option>'
           + '<option>Option 5</option>'
           + '</select>';

      codeStr = '<select class="' + classStr + '" multiple size="4"'
              + (isDisabled ? ' disabled' : '') + '>\n'
              + '  <option value="1">Option 1</option>\n'
              + '  <option value="2">Option 2</option>\n'
              + '  <option value="3">Option 3</option>\n'
              + '  <option value="4">Option 4</option>\n'
              + '  <option value="5">Option 5</option>\n'
              + '</select>';
    } else {
      html = '<select class="' + classStr + '"'
           + (isDisabled ? ' disabled' : '')
           + (state === 'error' ? ' aria-invalid="true"' : '') + '>'
           + '<option value="" disabled selected>Bitte w\u00E4hlen\u2026</option>'
           + '<option value="a">Option A</option>'
           + '<option value="b">Option B</option>'
           + '<option value="c">Option C</option>'
           + '</select>';

      codeStr = '<select class="' + classStr + '"'
              + (isDisabled ? ' disabled' : '')
              + (state === 'error' ? ' aria-invalid="true"' : '') + '>\n'
              + '  <option value="" disabled selected>Bitte w&auml;hlen\u2026</option>\n'
              + '  <option value="a">Option A</option>\n'
              + '  <option value="b">Option B</option>\n'
              + '  <option value="c">Option C</option>\n'
              + '</select>';
    }

    preview.innerHTML = html;
    codeOutput.textContent = codeStr;
  }

  // Event listeners
  themeSelect.addEventListener('change', updateStage);
  sizeSelect.addEventListener('change', updateStage);
  stateSelect.addEventListener('change', updateStage);
  multipleChk.addEventListener('change', updateStage);

  // Initial render
  updateStage();

})();
