// ==========================================================================
// Form Field Docs — Tab Navigation + Staging Area Controller
// ==========================================================================
// Tabs: Benutzung | Style | API | Accessibility
// Staging Area: Theme, Input-Typ, State, Required, Hint, Horizontal
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
  var inputTypeSelect = document.getElementById('stage-input-type');
  var stateSelect     = document.getElementById('stage-state');
  var requiredChk     = document.getElementById('stage-required');
  var hintChk         = document.getElementById('stage-hint');
  var horizontalChk   = document.getElementById('stage-horizontal');
  var preview         = document.getElementById('stage-preview');
  var codeOutput      = document.getElementById('stage-code');

  if (!preview) return;

  // SVG icon for error message
  var iconError = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function updateStage() {
    var theme      = themeSelect.value;
    var inputType  = inputTypeSelect.value;
    var state      = stateSelect.value;
    var isRequired = requiredChk.checked;
    var showHint   = hintChk.checked;
    var isHoriz    = horizontalChk.checked;

    // Apply theme to preview area
    var themes = ['neo-light-theme', 'neo-dark-theme', 'customer-light-theme', 'customer-dark-theme'];
    themes.forEach(function (t) { preview.classList.remove(t); });
    preview.classList.add(theme);

    // Build form-field classes
    var fieldClasses = ['nc-form-field'];
    if (state === 'error')    fieldClasses.push('nc-form-field--error');
    if (state === 'success')  fieldClasses.push('nc-form-field--success');
    if (state === 'disabled') fieldClasses.push('nc-form-field--disabled');
    if (isHoriz)              fieldClasses.push('nc-form-field--horizontal');

    var fieldClassStr = fieldClasses.join(' ');
    var isDisabled = (state === 'disabled');
    var isError    = (state === 'error');

    // Build HTML
    var html = '';
    var code = '';

    // --- Label ---
    var labelHtml = '<label class="nc-form-label" for="stage-demo-input">';
    labelHtml += '<span class="nc-form-label__text">Benutzername</span>';
    if (isRequired) {
      labelHtml += '<span class="nc-form-label__required" aria-hidden="true">*</span>';
    }
    labelHtml += '</label>';

    var labelCode = '  <label class="nc-form-label" for="input-id">\n';
    labelCode += '    <span class="nc-form-label__text">Benutzername</span>\n';
    if (isRequired) {
      labelCode += '    <span class="nc-form-label__required" aria-hidden="true">*</span>\n';
    }
    labelCode += '  </label>';

    // --- Hint ---
    var hintHtml = '';
    var hintCode = '';
    if (showHint) {
      hintHtml = '<p class="nc-form-hint" id="stage-hint-id">W\u00e4hlen Sie einen eindeutigen Benutzernamen.</p>';
      hintCode = '  <p class="nc-form-hint" id="hint-id">Hilfetext</p>';
    }

    // --- Input ---
    var ariaDesc = [];
    if (showHint) ariaDesc.push('stage-hint-id');
    if (isError) ariaDesc.push('stage-error-id');
    var ariaDescAttr = ariaDesc.length > 0 ? ' aria-describedby="' + ariaDesc.join(' ') + '"' : '';
    var ariaInvalid = isError ? ' aria-invalid="true"' : '';
    var ariaRequired = isRequired ? ' aria-required="true"' : '';
    var disabledAttr = isDisabled ? ' disabled' : '';

    var inputHtml = '';
    var inputCode = '';

    if (inputType === 'input') {
      inputHtml = '<input class="nc-input" type="text" id="stage-demo-input" placeholder="z.B. max_mustermann"' + ariaDescAttr + ariaInvalid + ariaRequired + disabledAttr + ' />';
      inputCode = '  <input class="nc-input" type="text" id="input-id"' + (ariaDesc.length > 0 ? '\n         aria-describedby="' + ariaDesc.map(function(s) { return s.replace('stage-', ''); }).join(' ') + '"' : '') + (isError ? '\n         aria-invalid="true"' : '') + (isRequired ? '\n         aria-required="true"' : '') + (isDisabled ? '\n         disabled' : '') + ' />';
    } else if (inputType === 'textarea') {
      inputHtml = '<textarea class="nc-textarea" id="stage-demo-input" rows="3" placeholder="Nachricht eingeben..."' + ariaDescAttr + ariaInvalid + ariaRequired + disabledAttr + '></textarea>';
      inputCode = '  <textarea class="nc-textarea" id="input-id" rows="3"' + (ariaDesc.length > 0 ? '\n            aria-describedby="' + ariaDesc.map(function(s) { return s.replace('stage-', ''); }).join(' ') + '"' : '') + (isError ? '\n            aria-invalid="true"' : '') + (isRequired ? '\n            aria-required="true"' : '') + (isDisabled ? '\n            disabled' : '') + '></textarea>';
    } else if (inputType === 'select') {
      inputHtml = '<select class="nc-select" id="stage-demo-input"' + ariaDescAttr + ariaInvalid + ariaRequired + disabledAttr + '>';
      inputHtml += '<option value="" disabled selected>Bitte w\u00e4hlen...</option>';
      inputHtml += '<option value="1">Option 1</option>';
      inputHtml += '<option value="2">Option 2</option>';
      inputHtml += '<option value="3">Option 3</option>';
      inputHtml += '</select>';
      inputCode = '  <select class="nc-select" id="input-id"' + (ariaDesc.length > 0 ? '\n          aria-describedby="' + ariaDesc.map(function(s) { return s.replace('stage-', ''); }).join(' ') + '"' : '') + (isError ? '\n          aria-invalid="true"' : '') + (isRequired ? '\n          aria-required="true"' : '') + (isDisabled ? '\n          disabled' : '') + '>\n    <option value="">Bitte w\u00e4hlen...</option>\n  </select>';
    }

    // --- Error ---
    var errorHtml = '';
    var errorCode = '';
    if (isError) {
      errorHtml = '<p class="nc-form-error" role="alert" id="stage-error-id">'
                + '<span class="nc-form-error__icon">' + iconError + '</span>'
                + '<span class="nc-form-error__text">Dieses Feld ist erforderlich.</span>'
                + '</p>';
      errorCode = '  <p class="nc-form-error" role="alert" id="error-id">\n'
                + '    <span class="nc-form-error__icon"><svg>...</svg></span>\n'
                + '    <span class="nc-form-error__text">Fehlermeldung</span>\n'
                + '  </p>';
    }

    // Assemble
    html = '<div class="' + fieldClassStr + '">'
         + labelHtml
         + hintHtml
         + inputHtml
         + errorHtml
         + '</div>';

    code = '<div class="' + fieldClassStr + '">\n'
         + labelCode + '\n'
         + (hintCode ? hintCode + '\n' : '')
         + inputCode + '\n'
         + (errorCode ? errorCode + '\n' : '')
         + '</div>';

    preview.innerHTML = '<div style="max-width: 400px; width: 100%;">' + html + '</div>';
    codeOutput.textContent = code;
  }

  // Event listeners
  themeSelect.addEventListener('change', updateStage);
  inputTypeSelect.addEventListener('change', updateStage);
  stateSelect.addEventListener('change', updateStage);
  requiredChk.addEventListener('change', updateStage);
  hintChk.addEventListener('change', updateStage);
  horizontalChk.addEventListener('change', updateStage);

  // Initial render
  updateStage();

})();
