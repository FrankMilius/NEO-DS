// ==========================================================================
// Slider Docs — Tab Navigation + Staging Area Controller
// ==========================================================================
// Tabs: Benutzung | Style | API | Accessibility
// Staging Area: Theme, State (Default / Error / Disabled)
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
  var stateSelect = document.getElementById('stage-state');
  var preview     = document.getElementById('stage-preview');
  var codeOutput  = document.getElementById('stage-code');

  if (!preview) return;

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function updateStage() {
    var theme = themeSelect.value;
    var state = stateSelect.value;

    // Apply theme to preview area
    var themes = ['neo-light-theme', 'neo-dark-theme', 'customer-light-theme', 'customer-dark-theme'];
    themes.forEach(function (t) { preview.classList.remove(t); });
    preview.classList.add(theme);

    // Build class list
    var classes = ['nc-slider'];
    var inputAttrs = 'type="range" min="0" max="100" value="50"';

    if (state === 'disabled') {
      classes.push('nc-slider--disabled');
      inputAttrs += ' disabled';
    } else if (state === 'error') {
      classes.push('nc-slider--error');
    }

    var classStr = classes.join(' ');

    // Build HTML
    var html = '<div class="' + classStr + '" style="width: 100%; max-width: 320px;">'
             + '<input class="nc-slider__input" ' + inputAttrs + ' id="stage-slider-input" />'
             + '<span class="nc-slider__output" id="stage-slider-output">50</span>'
             + '</div>';

    // Build code string
    var codeStr = '<div class="' + classStr + '">\n'
                + '  <input class="nc-slider__input" ' + inputAttrs + ' />\n'
                + '  <span class="nc-slider__output">50</span>\n'
                + '</div>';

    preview.innerHTML = html;
    codeOutput.textContent = codeStr;

    // Attach live slider interaction
    bindStageSlider();
  }

  function bindStageSlider() {
    var input = document.getElementById('stage-slider-input');
    var output = document.getElementById('stage-slider-output');
    if (!input || !output) return;

    input.addEventListener('input', function () {
      output.textContent = input.value;
    });
  }

  // Event listeners
  themeSelect.addEventListener('change', updateStage);
  stateSelect.addEventListener('change', updateStage);

  // Initial render
  updateStage();

  // -----------------------------------------------------------------------
  // 3. Static Demo Sliders — Live Value Output
  // -----------------------------------------------------------------------

  function bindStaticSliders() {
    var sliders = document.querySelectorAll('.nc-slider__input[data-slider-output]');
    sliders.forEach(function (slider) {
      var outputId = slider.getAttribute('data-slider-output');
      var output = document.getElementById(outputId);
      if (!output) return;

      slider.addEventListener('input', function () {
        output.textContent = slider.value;
      });
    });
  }

  bindStaticSliders();

})();
