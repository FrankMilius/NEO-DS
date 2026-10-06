// ==========================================================================
// Button Docs — Tab Navigation + Staging Area Controller
// ==========================================================================
// Updated for .nc-button BEM classes, 4 sizes (xs/sm/md/lg),
// 10 variants in 3 groups (Main/Supporting/System),
// icon property (none/leading/trailing/only),
// fixed typography, and formal icon integration.
// ==========================================================================

(function () {
  'use strict';

  function bindeUmschalter(bereich) {
    if (window.NeoBehaviors) window.NeoBehaviors.anbinden(bereich, ['button']);
  }

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
  var variantSelect = document.getElementById('stage-variant');
  var sizeSelect    = document.getElementById('stage-size');
  var iconSelect    = document.getElementById('stage-icon');
  var disabledChk   = document.getElementById('stage-disabled');
  var preview       = document.getElementById('stage-preview');
  var codeOutput    = document.getElementById('stage-code');

  if (!preview) return;

  // SVG icon templates (from Icon Foundation — icons-manifest.json)
  // Icon: plus (actions)
  var iconPlus = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g><rect x="0" y="0" rx="3"></rect><g><polygon points="0 0 24 0 24 24 0 24"></polygon><line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></line><line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></line></g></g></g></svg>';
  // Icon: chevron-right (arrows)
  var iconArrow = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g><rect x="0" y="0" rx="3"></rect><g><polygon points="0 0 24 0 24 24 0 24"></polygon><polyline stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" transform="translate(12, 12) rotate(270) translate(-12, -12)" points="6 9 12 15 18 9"></polyline></g></g></g></svg>';
  // Icon: settings (settings) — from icons-manifest.json
  var iconSettings = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g><rect x="0" y="0" width="24" height="24" rx="3"></rect><g><polygon points="0 0 24 0 24 24 0 24"></polygon><path d="M19,6.873 C19.6234513,7.23292309 20.0053693,7.90013379 20.0000559,8.62 L20.0000559,15.156 C19.9998281,15.8822818 19.6059422,16.5513902 18.971,16.904 L12.971,20.737 C12.3671034,21.0723689 11.6328966,21.0723689 11.029,20.737 L5.029,16.904 C4.39437058,16.5515641 4.00053487,15.8829237 4,15.157 L4,8.62 C4.0001719,7.89371815 4.39405775,7.22460983 5.029,6.872 L11.029,3.3 C11.6507466,2.95389748 12.4072534,2.95389748 13.029,3.3 L19.029,6.873 L19,6.873 Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><circle stroke="currentColor" stroke-width="1.5" cx="12" cy="12" r="3"></circle></g></g></g></svg>';

  var iconSpan = '<span class="nc-button__icon">';
  var iconEnd = '</span>';

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // BEM size modifier (md = default, no modifier needed)
  function sizeModifier(size) {
    if (size === 'md') return '';
    return ' nc-button--' + size;
  }

  function updateStage() {
    var theme    = themeSelect.value;
    var variant  = variantSelect.value;
    var size     = sizeSelect.value;
    var iconMode = iconSelect.value;
    var disabled = disabledChk.checked;

    // Apply theme to preview area
    var themes = ['neo-light-theme', 'neo-dark-theme', 'customer-light-theme', 'customer-dark-theme',
                  'light-base-theme', 'dark-base-theme', 'light-secondary-theme', 'dark-secondary-theme'];
    themes.forEach(function (t) { preview.classList.remove(t); });
    preview.classList.add(theme);

    // Reset inline styles
    preview.style.backgroundColor = '';
    preview.style.color = '';

    // Build button HTML
    var html = '';
    var codeStr = '';
    var sizeMod = sizeModifier(size);
    var disabledAttr = disabled ? ' disabled' : '';

    // ----- Special variants -----

    if (variant === '__link') {
      // Link als Button
      var cls = 'nc-button' + sizeMod;
      if (iconMode === 'leading') {
        html = '<a href="#" class="' + cls + '" role="button"' + disabledAttr + '>' + iconSpan + iconPlus + iconEnd + ' Link Button</a>';
        codeStr = '<a href="#" class="' + cls + '" role="button">\n  <span class="nc-button__icon"><svg>...</svg></span>\n  Link Button\n</a>';
      } else if (iconMode === 'trailing') {
        html = '<a href="#" class="' + cls + '" role="button"' + disabledAttr + '>Link Button ' + iconSpan + iconArrow + iconEnd + '</a>';
        codeStr = '<a href="#" class="' + cls + '" role="button">\n  Link Button\n  <span class="nc-button__icon"><svg>...</svg></span>\n</a>';
      } else {
        html = '<a href="#" class="' + cls + '" role="button"' + disabledAttr + '>Link Button</a>';
        codeStr = '<a href="#" class="' + cls + '" role="button">Link Button</a>';
      }

    } else if (variant === '__spinner') {
      // Loading / Spinner
      var cls = 'nc-button nc-button--loading' + sizeMod;
      html = '<button class="' + cls + '" data-loading="true"' + disabledAttr + '><span class="button-text">Speichern</span><span class="button-spinner"></span></button>';
      codeStr = '<button class="' + cls + '" data-loading="true">\n  <span class="button-text">Speichern</span>\n  <span class="button-spinner"></span>\n</button>';

    } else if (variant === '__group') {
      // Button Group
      html = '<div class="nc-button-group">';
      html += '<button class="nc-button nc-button--outline' + sizeMod + '"' + disabledAttr + '>Links</button>';
      html += '<button class="nc-button nc-button--outline' + sizeMod + '"' + disabledAttr + '>Mitte</button>';
      html += '<button class="nc-button nc-button--outline' + sizeMod + '"' + disabledAttr + '>Rechts</button>';
      html += '</div>';
      codeStr = '<div class="nc-button-group">\n  <button class="nc-button nc-button--outline">Links</button>\n  <button class="nc-button nc-button--outline">Mitte</button>\n  <button class="nc-button nc-button--outline">Rechts</button>\n</div>';

    } else if (variant === '__toggle') {
      // Toggle
      // Beschriftung bleibt fest: der Zustand steht in aria-pressed
      // (umschalten: neo-behaviors button, Entscheidung 06.10.2026)
      var cls = 'nc-button nc-button--toggle' + sizeMod;
      html = '<button type="button" class="' + cls + '" aria-pressed="false"' + disabledAttr + '>Fett</button>';
      html += ' <button type="button" class="' + cls + '" aria-pressed="true"' + disabledAttr + '>Kursiv</button>';
      codeStr = '<button type="button" class="' + cls + '" aria-pressed="false">Fett</button>';

    } else {
      // ----- Standard variants (primary, secondary, tertiary, ghost, outline, accent, etc.) -----
      var variantMod = variant ? ' nc-button--' + variant : '';
      var cls = 'nc-button' + variantMod + sizeMod;
      var label = variant
        ? variant.charAt(0).toUpperCase() + variant.slice(1)
        : 'Primary';

      if (iconMode === 'only') {
        // Icon-Only: single button with the selected variant
        var iconOnlyCls = 'nc-button' + variantMod + ' nc-button--icon-only' + sizeMod;
        html = '<button class="' + iconOnlyCls + '" aria-label="Einstellungen"' + disabledAttr + '>' + iconSpan + iconSettings + iconEnd + '</button>';
        codeStr = '<button class="' + iconOnlyCls + '" aria-label="Einstellungen">\n  <span class="nc-button__icon"><svg>...</svg></span>\n</button>';

      } else if (iconMode === 'leading') {
        // Icon links
        html = '<button class="' + cls + '"' + disabledAttr + '>' + iconSpan + iconPlus + iconEnd + ' ' + label + '</button>';
        codeStr = '<button class="' + cls + '">\n  <span class="nc-button__icon"><svg>...</svg></span>\n  ' + label + '\n</button>';

      } else if (iconMode === 'trailing') {
        // Icon rechts
        html = '<button class="' + cls + '"' + disabledAttr + '>' + label + ' ' + iconSpan + iconArrow + iconEnd + '</button>';
        codeStr = '<button class="' + cls + '">\n  ' + label + '\n  <span class="nc-button__icon"><svg>...</svg></span>\n</button>';

      } else {
        // No icon
        html = '<button class="' + cls + '"' + disabledAttr + '>' + label + '</button>';
        codeStr = '<button class="' + cls + '">' + label + '</button>';
      }
    }

    preview.innerHTML = html;
    codeOutput.textContent = codeStr;
    bindeUmschalter(preview);
  }

  // Event listeners
  themeSelect.addEventListener('change', updateStage);
  variantSelect.addEventListener('change', updateStage);
  sizeSelect.addEventListener('change', updateStage);
  iconSelect.addEventListener('change', updateStage);
  disabledChk.addEventListener('change', updateStage);

  // Initial render
  updateStage();

  // -----------------------------------------------------------------------
  // 3. Toggle Button — Verhalten aus neo-behaviors (button)
  // -----------------------------------------------------------------------
  // Entscheidung 06.10.2026: kein eigenes Umschalten mehr. Das Behavior
  // `button` (../packages/neo-behaviors/dist/neo-behaviors.js) schaltet
  // aria-pressed an .nc-button--toggle um und meldet `button-toggle`
  // { pressed, value }; gesperrte Knoepfe bleiben unveraendert.
  // anbinden() ist mehrfach harmlos — nach jedem Neuzeichnen der Buehne
  // werden nur die neuen Knoepfe gebunden.

  bindeUmschalter(document);

  // -----------------------------------------------------------------------
  // 4. Micro Animation Ripple (click position based)
  // -----------------------------------------------------------------------

  document.addEventListener('pointerdown', function (e) {
    var target = e.target;
    if (!target || !target.closest) return;

    var button = target.closest('.nc-button--micro-a, .nc-button--micro-b, .nc-button--micro-c, .button.micro-a, .button.micro-b, .button.micro-c');
    if (!button) return;
    if (button.matches(':disabled, [aria-disabled="true"], [data-loading="true"]')) return;

    var rect = button.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    var size = Math.max(rect.width, rect.height) * 1.2;

    button.style.setProperty('--nc-ripple-x', x + 'px');
    button.style.setProperty('--nc-ripple-y', y + 'px');
    button.style.setProperty('--nc-ripple-size', size + 'px');

    button.classList.remove('is-rippling');
    void button.offsetWidth;
    button.classList.add('is-rippling');

    if (button._rippleTimeout) {
      clearTimeout(button._rippleTimeout);
    }
    button._rippleTimeout = setTimeout(function () {
      button.classList.remove('is-rippling');
    }, 560);
  });

})();
