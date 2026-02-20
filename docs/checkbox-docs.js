// ==========================================================================
// Checkbox Docs — Tab Navigation + Staging Area Controller
// ==========================================================================
// Tabs: Benutzung | Style | API | Accessibility
// Staging Area: Theme, Size, State (Default/Checked/Indeterminate/Error/Disabled)
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

    // Build class list for the label wrapper
    var classes = ['nc-checkbox'];

    // Size modifier (md = default, no modifier needed)
    if (size === 'sm') {
      classes.push('nc-checkbox--sm');
    } else if (size === 'lg') {
      classes.push('nc-checkbox--lg');
    }

    // Error modifier
    if (state === 'error') {
      classes.push('nc-checkbox--error');
    }

    var classStr = classes.join(' ');
    var isDisabled = state === 'disabled';
    var isChecked = state === 'checked';
    var isIndeterminate = state === 'indeterminate';

    // Build HTML
    var inputAttrs = 'class="nc-checkbox__input" type="checkbox"';
    if (isChecked || isIndeterminate) {
      inputAttrs += ' checked';
    }
    if (isDisabled) {
      inputAttrs += ' disabled';
    }
    if (state === 'error') {
      inputAttrs += ' aria-invalid="true"';
    }

    var html = '<label class="' + classStr + '">'
             + '<input ' + inputAttrs + ' id="stage-cb" />'
             + '<span class="nc-checkbox__control"></span>'
             + '<span class="nc-checkbox__label">Checkbox Label</span>'
             + '</label>';

    preview.innerHTML = html;

    // Set indeterminate via JS (no HTML attribute exists)
    if (isIndeterminate) {
      var cbInput = document.getElementById('stage-cb');
      if (cbInput) {
        cbInput.indeterminate = true;
        cbInput.checked = false;
      }
    }

    // Build code string
    var codeClasses = classes.slice();
    var codeInputAttrs = '';
    if (isChecked) {
      codeInputAttrs += ' checked';
    }
    if (isDisabled) {
      codeInputAttrs += ' disabled';
    }
    if (state === 'error') {
      codeInputAttrs += ' aria-invalid="true"';
    }

    var codeStr = '<label class="' + codeClasses.join(' ') + '">\n'
                + '  <input class="nc-checkbox__input" type="checkbox"' + codeInputAttrs + ' />\n'
                + '  <span class="nc-checkbox__control"></span>\n'
                + '  <span class="nc-checkbox__label">Checkbox Label</span>\n'
                + '</label>';

    if (isIndeterminate) {
      codeStr += '\n\n<script>\n'
               + '  document.querySelector(\'.nc-checkbox__input\').indeterminate = true;\n'
               + '<\/script>';
    }

    codeOutput.textContent = codeStr;
  }

  // Event listeners
  themeSelect.addEventListener('change', updateStage);
  sizeSelect.addEventListener('change', updateStage);
  stateSelect.addEventListener('change', updateStage);

  // Initial render
  updateStage();

})();
