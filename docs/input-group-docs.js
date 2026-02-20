// ==========================================================================
// Input Group Docs — Tab Navigation + Staging Area Controller
// ==========================================================================
// Tabs: Benutzung | Style | API | Accessibility
// Staging Area: Theme, Component (Input Group / Stepper / OTP), Size, State
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
  var sizeSelect      = document.getElementById('stage-size');
  var stateSelect     = document.getElementById('stage-state');
  var preview         = document.getElementById('stage-preview');
  var codeOutput      = document.getElementById('stage-code');

  if (!preview) return;

  // SVG icons
  var iconMinus = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>';
  var iconPlus = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>';
  var iconSearch = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>';

  function updateStage() {
    var theme     = themeSelect.value;
    var component = componentSelect.value;
    var size      = sizeSelect.value;
    var state     = stateSelect.value;

    // Apply theme to preview area
    var themes = ['neo-light-theme', 'neo-dark-theme', 'customer-light-theme', 'customer-dark-theme'];
    themes.forEach(function (t) { preview.classList.remove(t); });
    preview.classList.add(theme);

    var isError    = (state === 'error');
    var isDisabled = (state === 'disabled');

    var html = '';
    var code = '';

    // ===================================================================
    // INPUT GROUP
    // ===================================================================
    if (component === 'input-group') {
      var groupClasses = ['nc-input-group'];
      if (size === 'sm') groupClasses.push('nc-input-group--sm');
      if (size === 'lg') groupClasses.push('nc-input-group--lg');
      if (isError) groupClasses.push('nc-input-group--error');
      if (isDisabled) groupClasses.push('nc-input-group--disabled');
      var groupClassStr = groupClasses.join(' ');

      var disabledAttr = isDisabled ? ' disabled' : '';

      html = '<div class="' + groupClassStr + '">'
           + '<span class="nc-input-group__prepend">https://</span>'
           + '<input class="nc-input' + (size === 'sm' ? ' nc-input--sm' : size === 'lg' ? ' nc-input--lg' : '') + '" type="text" placeholder="www.example.com"' + disabledAttr + ' />'
           + '</div>';

      code = '<div class="' + groupClassStr + '">\n'
           + '  <span class="nc-input-group__prepend">https://</span>\n'
           + '  <input class="nc-input" type="text"\n'
           + '         placeholder="www.example.com"' + (isDisabled ? ' disabled' : '') + ' />\n'
           + '</div>';

    // ===================================================================
    // STEPPER
    // ===================================================================
    } else if (component === 'stepper') {
      var stepClasses = ['nc-stepper'];
      if (size === 'sm') stepClasses.push('nc-stepper--sm');
      if (size === 'lg') stepClasses.push('nc-stepper--lg');
      if (isError) stepClasses.push('nc-stepper--error');
      if (isDisabled) stepClasses.push('nc-stepper--disabled');
      var stepClassStr = stepClasses.join(' ');

      var disabledBtnAttr = isDisabled ? ' disabled aria-disabled="true"' : '';
      var disabledInputAttr = isDisabled ? ' disabled' : '';

      html = '<div class="' + stepClassStr + '">'
           + '<button class="nc-stepper__decrement" type="button" aria-label="Wert verringern"' + disabledBtnAttr + '>' + iconMinus + '</button>'
           + '<input class="nc-stepper__input" type="number" value="5" min="0" max="99" readonly role="spinbutton" aria-valuenow="5" aria-valuemin="0" aria-valuemax="99" aria-label="Menge"' + disabledInputAttr + ' />'
           + '<button class="nc-stepper__increment" type="button" aria-label="Wert erh\u00f6hen"' + disabledBtnAttr + '>' + iconPlus + '</button>'
           + '</div>';

      code = '<div class="' + stepClassStr + '">\n'
           + '  <button class="nc-stepper__decrement" type="button"\n'
           + '          aria-label="Wert verringern"' + (isDisabled ? '\n          disabled aria-disabled="true"' : '') + '>\n'
           + '    <svg><!-- minus --></svg>\n'
           + '  </button>\n'
           + '  <input class="nc-stepper__input" type="number"\n'
           + '         value="5" min="0" max="99" readonly\n'
           + '         role="spinbutton"\n'
           + '         aria-valuenow="5"\n'
           + '         aria-valuemin="0"\n'
           + '         aria-valuemax="99"\n'
           + '         aria-label="Menge"' + (isDisabled ? '\n         disabled' : '') + ' />\n'
           + '  <button class="nc-stepper__increment" type="button"\n'
           + '          aria-label="Wert erh\u00f6hen"' + (isDisabled ? '\n          disabled aria-disabled="true"' : '') + '>\n'
           + '    <svg><!-- plus --></svg>\n'
           + '  </button>\n'
           + '</div>';

    // ===================================================================
    // OTP INPUT
    // ===================================================================
    } else if (component === 'otp') {
      var otpClasses = ['nc-otp-input'];
      if (size === 'sm') otpClasses.push('nc-otp-input--sm');
      if (size === 'lg') otpClasses.push('nc-otp-input--lg');
      if (isError) otpClasses.push('nc-otp-input--error');
      if (isDisabled) otpClasses.push('nc-otp-input--disabled');
      var otpClassStr = otpClasses.join(' ');

      var cellDisabled = isDisabled ? ' disabled' : '';

      html = '<div class="' + otpClassStr + '" role="group" aria-label="Verifizierungscode">'
           + '<input class="nc-otp-input__cell" type="text" maxlength="1" inputmode="numeric" autocomplete="one-time-code" aria-label="Ziffer 1"' + cellDisabled + ' />'
           + '<input class="nc-otp-input__cell" type="text" maxlength="1" inputmode="numeric" aria-label="Ziffer 2"' + cellDisabled + ' />'
           + '<input class="nc-otp-input__cell" type="text" maxlength="1" inputmode="numeric" aria-label="Ziffer 3"' + cellDisabled + ' />'
           + '<span class="nc-otp-input__separator" aria-hidden="true">\u2013</span>'
           + '<input class="nc-otp-input__cell" type="text" maxlength="1" inputmode="numeric" aria-label="Ziffer 4"' + cellDisabled + ' />'
           + '<input class="nc-otp-input__cell" type="text" maxlength="1" inputmode="numeric" aria-label="Ziffer 5"' + cellDisabled + ' />'
           + '<input class="nc-otp-input__cell" type="text" maxlength="1" inputmode="numeric" aria-label="Ziffer 6"' + cellDisabled + ' />'
           + '</div>';

      code = '<div class="' + otpClassStr + '" role="group"\n'
           + '     aria-label="Verifizierungscode">\n'
           + '  <input class="nc-otp-input__cell" type="text"\n'
           + '         maxlength="1" inputmode="numeric"\n'
           + '         autocomplete="one-time-code"\n'
           + '         aria-label="Ziffer 1"' + (isDisabled ? ' disabled' : '') + ' />\n'
           + '  <input class="nc-otp-input__cell" ... aria-label="Ziffer 2" />\n'
           + '  <input class="nc-otp-input__cell" ... aria-label="Ziffer 3" />\n'
           + '  <span class="nc-otp-input__separator" aria-hidden="true">&ndash;</span>\n'
           + '  <input class="nc-otp-input__cell" ... aria-label="Ziffer 4" />\n'
           + '  <input class="nc-otp-input__cell" ... aria-label="Ziffer 5" />\n'
           + '  <input class="nc-otp-input__cell" ... aria-label="Ziffer 6" />\n'
           + '</div>';
    }

    preview.innerHTML = '<div style="max-width: 400px; width: 100%;">' + html + '</div>';
    codeOutput.textContent = code;
  }

  // Event listeners
  themeSelect.addEventListener('change', updateStage);
  componentSelect.addEventListener('change', updateStage);
  sizeSelect.addEventListener('change', updateStage);
  stateSelect.addEventListener('change', updateStage);

  // Initial render
  updateStage();

})();
