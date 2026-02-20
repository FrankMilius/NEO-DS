// ==========================================================================
// Rating Docs — Tab Navigation + Staging Area Controller
// ==========================================================================
// Tabs: Benutzung | Style | API | Accessibility
// Staging Area: Theme, Size (SM/MD/LG), Mode (Interactive/Readonly),
//               State (Default/Disabled/Error)
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
  // 2. SVG Star Template
  // -----------------------------------------------------------------------

  var starSvg = '<svg class="nc-rating__star" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';

  var starSvgFilled = '<svg class="nc-rating__star" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';

  // -----------------------------------------------------------------------
  // 3. Staging Area
  // -----------------------------------------------------------------------

  var themeSelect = document.getElementById('stage-theme');
  var sizeSelect  = document.getElementById('stage-size');
  var modeSelect  = document.getElementById('stage-mode');
  var stateSelect = document.getElementById('stage-state');
  var preview     = document.getElementById('stage-preview');
  var codeOutput  = document.getElementById('stage-code');

  if (!preview) return;

  // Current rating value for staging
  var stageRatingValue = 3;

  function updateStage() {
    var theme = themeSelect.value;
    var size  = sizeSelect.value;
    var mode  = modeSelect.value;
    var state = stateSelect.value;

    // Apply theme to preview area
    var themes = ['neo-light-theme', 'neo-dark-theme', 'customer-light-theme', 'customer-dark-theme'];
    themes.forEach(function (t) { preview.classList.remove(t); });
    preview.classList.add(theme);

    // Build class list
    var classes = ['nc-rating'];

    if (size === 'sm') classes.push('nc-rating--sm');
    if (size === 'lg') classes.push('nc-rating--lg');

    if (mode === 'readonly') classes.push('nc-rating--readonly');

    if (state === 'disabled') classes.push('nc-rating--disabled');
    if (state === 'error') classes.push('nc-rating--error');

    var classStr = classes.join(' ');

    // Build HTML
    var html = '';
    var codeStr = '';

    if (mode === 'readonly') {
      // Readonly: spans
      var roleAttr = 'role="img" aria-label="Bewertung: ' + stageRatingValue + ' von 5 Sternen"';
      html = '<div class="' + classStr + '" ' + roleAttr + '>';

      for (var i = 1; i <= 5; i++) {
        var isActive = i <= stageRatingValue;
        var itemClass = 'nc-rating__item' + (isActive ? ' nc-rating__item--active' : '');
        html += '<span class="' + itemClass + '">' + (isActive ? starSvgFilled : starSvg) + '</span>';
      }

      html += '<span class="nc-rating__value">' + stageRatingValue + '.0</span>';
      html += '</div>';

      // Code
      codeStr = '<div class="' + classStr + '"\n'
              + '     role="img" aria-label="Bewertung: ' + stageRatingValue + ' von 5 Sternen">\n'
              + '  <span class="nc-rating__item nc-rating__item--active"><svg>...</svg></span>\n'
              + '  <!-- ... weitere Sterne ... -->\n'
              + '  <span class="nc-rating__value">' + stageRatingValue + '.0</span>\n'
              + '</div>';
    } else {
      // Interactive: radio inputs
      var disabledAttr = (state === 'disabled') ? ' disabled' : '';
      html = '<div class="' + classStr + '" role="radiogroup" aria-label="Bewertung">';

      for (var i = 1; i <= 5; i++) {
        var isActive = i <= stageRatingValue;
        var itemClass = 'nc-rating__item' + (isActive ? ' nc-rating__item--active' : '');
        var checkedAttr = (i === stageRatingValue) ? ' checked' : '';
        html += '<label class="' + itemClass + '" data-value="' + i + '">'
              + '<input class="nc-rating__input" type="radio" name="stage-rating" value="' + i + '"' + checkedAttr + disabledAttr + ' />'
              + (isActive ? starSvgFilled : starSvg)
              + '</label>';
      }

      html += '</div>';

      // Code
      codeStr = '<div class="' + classStr + '"\n'
              + '     role="radiogroup" aria-label="Bewertung">\n'
              + '  <label class="nc-rating__item">\n'
              + '    <input class="nc-rating__input" type="radio"\n'
              + '           name="rating" value="1"' + disabledAttr + ' />\n'
              + '    <svg class="nc-rating__star">...</svg>\n'
              + '  </label>\n'
              + '  <!-- ... weitere Sterne (2-5) ... -->\n'
              + '</div>';
    }

    preview.innerHTML = html;
    codeOutput.textContent = codeStr;

    // Bind star click for staging interactive mode
    if (mode === 'interactive' && state !== 'disabled') {
      bindStageStarClicks();
    }
  }

  function bindStageStarClicks() {
    var items = preview.querySelectorAll('.nc-rating__item[data-value]');
    items.forEach(function (item) {
      item.addEventListener('click', function (e) {
        var val = parseInt(item.getAttribute('data-value'), 10);
        stageRatingValue = val;
        updateStage();
      });
    });
  }

  // Event listeners
  themeSelect.addEventListener('change', updateStage);
  sizeSelect.addEventListener('change', updateStage);
  modeSelect.addEventListener('change', updateStage);
  stateSelect.addEventListener('change', updateStage);

  // Initial render
  updateStage();

  // -----------------------------------------------------------------------
  // 4. Static Demo Ratings — Star Click Interaction
  // -----------------------------------------------------------------------

  function bindStaticRatings() {
    var interactiveRatings = document.querySelectorAll('.nc-rating[data-rating-interactive]');
    interactiveRatings.forEach(function (rating) {
      var items = rating.querySelectorAll('.nc-rating__item[data-value]');
      items.forEach(function (item) {
        item.addEventListener('click', function () {
          var val = parseInt(item.getAttribute('data-value'), 10);
          // Update active state for all items in this rating
          var allItems = rating.querySelectorAll('.nc-rating__item[data-value]');
          allItems.forEach(function (it) {
            var itVal = parseInt(it.getAttribute('data-value'), 10);
            var svg = it.querySelector('.nc-rating__star');
            if (itVal <= val) {
              it.classList.add('nc-rating__item--active');
              if (svg) {
                svg.setAttribute('fill', 'currentColor');
              }
            } else {
              it.classList.remove('nc-rating__item--active');
              if (svg) {
                svg.setAttribute('fill', 'none');
              }
            }
          });
          // Check the corresponding radio
          var radio = item.querySelector('.nc-rating__input');
          if (radio) radio.checked = true;
        });
      });
    });
  }

  bindStaticRatings();

})();
