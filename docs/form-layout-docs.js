// ==========================================================================
// Form Layout Docs — Tab Navigation + Staging Area Controller
// ==========================================================================
// Tabs: Benutzung | Style | API | Accessibility
// Staging Area: Theme, Component (Form/Fieldset/Form Section/Validation
//   Summary/Form Actions), Layout variants per component
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

  var themeSelect     = document.getElementById('stage-theme');
  var componentSelect = document.getElementById('stage-component');
  var layoutSelect    = document.getElementById('stage-layout');
  var preview         = document.getElementById('stage-preview');
  var codeOutput      = document.getElementById('stage-code');

  if (!preview) return;

  // Layout options per component
  var layoutOptions = {
    'form':               [
      { value: 'default', label: 'Default' },
      { value: 'inline', label: 'Inline' },
      { value: 'two-column', label: 'Two-Column' }
    ],
    'fieldset':           [
      { value: 'default', label: 'Default' },
      { value: 'borderless', label: 'Borderless' },
      { value: 'disabled', label: 'Disabled' }
    ],
    'form-section':       [
      { value: 'default', label: 'Default' },
      { value: 'bordered', label: 'Bordered' },
      { value: 'compact', label: 'Compact' }
    ],
    'validation-summary': [
      { value: 'default', label: 'Default' },
      { value: 'hidden', label: 'Hidden' }
    ],
    'form-actions':       [
      { value: 'start', label: 'Start' },
      { value: 'center', label: 'Center' },
      { value: 'end', label: 'End' },
      { value: 'spread', label: 'Spread' },
      { value: 'stacked', label: 'Stacked' }
    ]
  };

  // Update layout <select> when component changes
  function updateLayoutOptions() {
    var comp = componentSelect.value;
    var options = layoutOptions[comp] || [{ value: 'default', label: 'Default' }];

    layoutSelect.innerHTML = '';
    options.forEach(function (opt) {
      var el = document.createElement('option');
      el.value = opt.value;
      el.textContent = opt.label;
      layoutSelect.appendChild(el);
    });
  }

  // SVG icons
  var iconError = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';

  function updateStage() {
    var theme  = themeSelect.value;
    var comp   = componentSelect.value;
    var layout = layoutSelect.value;

    // Apply theme to preview area
    var themes = ['neo-light-theme', 'neo-dark-theme', 'customer-light-theme', 'customer-dark-theme'];
    themes.forEach(function (t) { preview.classList.remove(t); });
    preview.classList.add(theme);

    var html = '';
    var codeStr = '';

    // ------------------------------------------------------------------
    // Form
    // ------------------------------------------------------------------
    if (comp === 'form') {
      var formClass = 'nc-form';
      if (layout === 'inline') formClass += ' nc-form--inline';
      if (layout === 'two-column') formClass += ' nc-form--two-column';

      html = '<form class="' + formClass + '" style="max-width: 560px; width: 100%;">'
           + '<div class="nc-form-field">'
           + '<label class="nc-form-label"><span class="nc-form-label__text">Vorname</span></label>'
           + '<input class="nc-input" type="text" placeholder="Max" />'
           + '</div>'
           + '<div class="nc-form-field">'
           + '<label class="nc-form-label"><span class="nc-form-label__text">Nachname</span></label>'
           + '<input class="nc-input" type="text" placeholder="Mustermann" />'
           + '</div>'
           + '<div class="nc-form-field">'
           + '<label class="nc-form-label"><span class="nc-form-label__text">E-Mail</span></label>'
           + '<input class="nc-input" type="email" placeholder="max@beispiel.de" />'
           + '</div>'
           + '</form>';

      codeStr = '<form class="' + formClass + '">\n'
              + '  <div class="nc-form-field">\n'
              + '    <label class="nc-form-label">\n'
              + '      <span class="nc-form-label__text">Vorname</span>\n'
              + '    </label>\n'
              + '    <input class="nc-input" type="text" />\n'
              + '  </div>\n'
              + '  <div class="nc-form-field">\n'
              + '    <label class="nc-form-label">\n'
              + '      <span class="nc-form-label__text">Nachname</span>\n'
              + '    </label>\n'
              + '    <input class="nc-input" type="text" />\n'
              + '  </div>\n'
              + '  <div class="nc-form-field">\n'
              + '    <label class="nc-form-label">\n'
              + '      <span class="nc-form-label__text">E-Mail</span>\n'
              + '    </label>\n'
              + '    <input class="nc-input" type="email" />\n'
              + '  </div>\n'
              + '</form>';
    }

    // ------------------------------------------------------------------
    // Fieldset
    // ------------------------------------------------------------------
    else if (comp === 'fieldset') {
      var fsClass = 'nc-fieldset';
      var disabledAttr = '';
      if (layout === 'borderless') fsClass += ' nc-fieldset--borderless';
      if (layout === 'disabled') {
        fsClass += ' nc-fieldset--disabled';
        disabledAttr = ' disabled';
      }

      html = '<fieldset class="' + fsClass + '"' + disabledAttr + ' style="max-width: 480px; width: 100%;">'
           + '<legend class="nc-fieldset__legend">Pers\u00F6nliche Daten</legend>'
           + '<div class="nc-form-field">'
           + '<label class="nc-form-label"><span class="nc-form-label__text">Vorname</span></label>'
           + '<input class="nc-input" type="text" placeholder="Max" />'
           + '</div>'
           + '<div class="nc-form-field">'
           + '<label class="nc-form-label"><span class="nc-form-label__text">Nachname</span></label>'
           + '<input class="nc-input" type="text" placeholder="Mustermann" />'
           + '</div>'
           + '</fieldset>';

      codeStr = '<fieldset class="' + fsClass + '"' + disabledAttr + '>\n'
              + '  <legend class="nc-fieldset__legend">Pers\u00F6nliche Daten</legend>\n'
              + '  <div class="nc-form-field">\n'
              + '    <label class="nc-form-label">\n'
              + '      <span class="nc-form-label__text">Vorname</span>\n'
              + '    </label>\n'
              + '    <input class="nc-input" type="text" />\n'
              + '  </div>\n'
              + '  <div class="nc-form-field">\n'
              + '    <label class="nc-form-label">\n'
              + '      <span class="nc-form-label__text">Nachname</span>\n'
              + '    </label>\n'
              + '    <input class="nc-input" type="text" />\n'
              + '  </div>\n'
              + '</fieldset>';
    }

    // ------------------------------------------------------------------
    // Form Section
    // ------------------------------------------------------------------
    else if (comp === 'form-section') {
      var secClass = 'nc-form-section';
      if (layout === 'bordered') secClass += ' nc-form-section--bordered';
      if (layout === 'compact') secClass += ' nc-form-section--compact';

      html = '<div style="max-width: 560px; width: 100%;">'
           + '<div class="' + secClass + '">'
           + '<div class="nc-form-section__header">'
           + '<h3 class="nc-form-section__title">Kontoinformationen</h3>'
           + '<p class="nc-form-section__description">Grundlegende Informationen zu Ihrem Konto.</p>'
           + '</div>'
           + '<div class="nc-form-section__content">'
           + '<div class="nc-form-field">'
           + '<label class="nc-form-label"><span class="nc-form-label__text">Benutzername</span></label>'
           + '<input class="nc-input" type="text" placeholder="max_m" />'
           + '</div>'
           + '<div class="nc-form-field">'
           + '<label class="nc-form-label"><span class="nc-form-label__text">E-Mail</span></label>'
           + '<input class="nc-input" type="email" placeholder="max@beispiel.de" />'
           + '</div>'
           + '</div>'
           + '</div>'
           + '</div>';

      codeStr = '<div class="' + secClass + '">\n'
              + '  <div class="nc-form-section__header">\n'
              + '    <h3 class="nc-form-section__title">Kontoinformationen</h3>\n'
              + '    <p class="nc-form-section__description">Beschreibung...</p>\n'
              + '  </div>\n'
              + '  <div class="nc-form-section__content">\n'
              + '    <!-- Form-Fields -->\n'
              + '  </div>\n'
              + '</div>';
    }

    // ------------------------------------------------------------------
    // Validation Summary
    // ------------------------------------------------------------------
    else if (comp === 'validation-summary') {
      var vsClass = 'nc-validation-summary';
      if (layout === 'hidden') vsClass += ' nc-validation-summary--hidden';

      html = '<div class="' + vsClass + '" role="alert" style="max-width: 480px; width: 100%;">'
           + '<span class="nc-validation-summary__icon">' + iconError + '</span>'
           + '<div>'
           + '<strong class="nc-validation-summary__title">Es sind 3 Fehler aufgetreten:</strong>'
           + '<ul class="nc-validation-summary__list">'
           + '<li class="nc-validation-summary__item">Vorname ist ein Pflichtfeld</li>'
           + '<li class="nc-validation-summary__item">E-Mail-Adresse ist ung\u00FCltig</li>'
           + '<li class="nc-validation-summary__item">Passwort muss mindestens 8 Zeichen lang sein</li>'
           + '</ul>'
           + '</div>'
           + '</div>';

      codeStr = '<div class="' + vsClass + '" role="alert">\n'
              + '  <span class="nc-validation-summary__icon" aria-hidden="true">\n'
              + '    <svg><!-- error icon --></svg>\n'
              + '  </span>\n'
              + '  <div>\n'
              + '    <strong class="nc-validation-summary__title">\n'
              + '      Es sind 3 Fehler aufgetreten:\n'
              + '    </strong>\n'
              + '    <ul class="nc-validation-summary__list">\n'
              + '      <li class="nc-validation-summary__item">Vorname ist ein Pflichtfeld</li>\n'
              + '      <li class="nc-validation-summary__item">E-Mail ist ung\u00FCltig</li>\n'
              + '      <li class="nc-validation-summary__item">Passwort zu kurz</li>\n'
              + '    </ul>\n'
              + '  </div>\n'
              + '</div>';
    }

    // ------------------------------------------------------------------
    // Form Actions
    // ------------------------------------------------------------------
    else if (comp === 'form-actions') {
      var faClass = 'nc-form-actions';
      if (layout !== 'start') faClass += ' nc-form-actions--' + layout;

      var maxW = layout === 'stacked' ? '240px' : '560px';

      html = '<div class="' + faClass + '" style="max-width: ' + maxW + '; width: 100%;">';

      if (layout === 'spread') {
        html += '<button type="button" class="nc-btn nc-btn--secondary">Abbrechen</button>'
              + '<button type="button" class="nc-btn nc-btn--primary">Speichern</button>';
      } else {
        html += '<button type="button" class="nc-btn nc-btn--primary">Speichern</button>'
              + '<button type="button" class="nc-btn nc-btn--secondary">Abbrechen</button>';
      }
      html += '</div>';

      var codeClass = faClass;
      codeStr = '<div class="' + codeClass + '">\n';
      if (layout === 'spread') {
        codeStr += '  <button type="button" class="nc-btn nc-btn--secondary">Abbrechen</button>\n'
                 + '  <button type="submit" class="nc-btn nc-btn--primary">Speichern</button>\n';
      } else {
        codeStr += '  <button type="submit" class="nc-btn nc-btn--primary">Speichern</button>\n'
                 + '  <button type="button" class="nc-btn nc-btn--secondary">Abbrechen</button>\n';
      }
      codeStr += '</div>';
    }

    preview.innerHTML = html;
    codeOutput.textContent = codeStr;
  }

  // Event listeners
  themeSelect.addEventListener('change', updateStage);
  componentSelect.addEventListener('change', function () {
    updateLayoutOptions();
    updateStage();
  });
  layoutSelect.addEventListener('change', updateStage);

  // Initial render
  updateLayoutOptions();
  updateStage();

})();
