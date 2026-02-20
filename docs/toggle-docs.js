// ==========================================================================
// Toggle Docs — Tab Navigation + Staging Area Controller
// ==========================================================================
// Tabs: Benutzung | Style | API | Accessibility
// Staging Area: Theme, Component (Toggle Button / Toggle Group),
//   Size (sm/md/lg), Type (single/multi), Count (2/3/4),
//   Icon Mode (text/icon/icon+text), Variant (default/outline)
//
// Handles both:
//   - Toggle Button (.nc-button--toggle) with aria-pressed
//   - Toggle Group (.nc-toggle-group) with radiogroup or group pattern
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
  // 2. Inline SVG Icons
  // -----------------------------------------------------------------------

  // Grid icon (4 squares)
  var iconGrid = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>';

  // List icon
  var iconList = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>';

  // Bold B
  var iconBold = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/></svg>';

  // Italic I
  var iconItalic = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>';

  // Underline U
  var iconUnderline = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"/><line x1="4" y1="21" x2="20" y2="21"/></svg>';

  // Icon arrays for different modes
  var groupIcons = [iconGrid, iconList, iconBold, iconItalic, iconUnderline];
  var groupLabelsText = ['Option A', 'Option B', 'Option C', 'Option D'];
  var groupLabelsIcon = ['Grid-Ansicht', 'Listen-Ansicht', 'Fett', 'Kursiv', 'Unterstrichen'];
  var groupLabelsIconText = [
    { icon: iconGrid, text: 'Grid' },
    { icon: iconList, text: 'Liste' },
    { icon: iconBold, text: 'Fett' },
    { icon: iconItalic, text: 'Kursiv' },
    { icon: iconUnderline, text: 'Unterstrichen' }
  ];

  // -----------------------------------------------------------------------
  // 3. Staging Area
  // -----------------------------------------------------------------------

  var themeSelect     = document.getElementById('stage-theme');
  var componentSelect = document.getElementById('stage-component');
  var sizeSelect      = document.getElementById('stage-size');
  var typeSelect      = document.getElementById('stage-type');
  var countSelect     = document.getElementById('stage-count');
  var iconSelect      = document.getElementById('stage-icon');
  var variantSelect   = document.getElementById('stage-variant');

  var typeWrap    = document.getElementById('stage-type-wrap');
  var countWrap   = document.getElementById('stage-count-wrap');
  var variantWrap = document.getElementById('stage-variant-wrap');

  var preview    = document.getElementById('stage-preview');
  var codeOutput = document.getElementById('stage-code');

  if (!preview) return;

  // -----------------------------------------------------------------------
  // 3a. Show/Hide controls based on Component selection
  // -----------------------------------------------------------------------

  function updateControlVisibility() {
    var isGroup = componentSelect.value === 'toggle-group';
    typeWrap.style.display    = isGroup ? '' : 'none';
    countWrap.style.display   = isGroup ? '' : 'none';
    variantWrap.style.display = isGroup ? '' : 'none';
  }

  // -----------------------------------------------------------------------
  // 3b. Build Toggle Button preview
  // -----------------------------------------------------------------------

  function buildToggleButton(size, iconMode) {
    var sizeMod = (size === 'md') ? '' : ' nc-button--' + size;
    var cls = 'nc-button nc-button--toggle' + sizeMod;

    var labelOff = 'Inaktiv';
    var labelOn = 'Aktiv';
    var html = '';
    var code = '';

    if (iconMode === 'icon') {
      // Icon-only toggle button (using grid icon)
      var iconOnlyCls = 'nc-button nc-button--toggle nc-button--icon-only' + sizeMod;
      html += '<button class="' + iconOnlyCls + '" aria-pressed="false" aria-label="Toggle">';
      html += '<span class="nc-button__icon">' + iconGrid + '</span>';
      html += '</button>';
      html += ' <button class="' + iconOnlyCls + '" aria-pressed="true" aria-label="Toggle">';
      html += '<span class="nc-button__icon">' + iconGrid + '</span>';
      html += '</button>';

      code = '<button class="' + iconOnlyCls + '" aria-pressed="false" aria-label="Toggle">\n';
      code += '  <span class="nc-button__icon"><svg>...</svg></span>\n';
      code += '</button>';
    } else if (iconMode === 'icon-text') {
      // Icon + Text toggle button
      html += '<button class="' + cls + '" aria-pressed="false">';
      html += '<span class="nc-button__icon">' + iconGrid + '</span> ';
      html += labelOff + '</button>';
      html += ' <button class="' + cls + '" aria-pressed="true">';
      html += '<span class="nc-button__icon">' + iconGrid + '</span> ';
      html += labelOn + '</button>';

      code = '<button class="' + cls + '" aria-pressed="false">\n';
      code += '  <span class="nc-button__icon"><svg>...</svg></span>\n';
      code += '  Toggle Label\n';
      code += '</button>';
    } else {
      // Text only
      html += '<button class="' + cls + '" aria-pressed="false">' + labelOff + '</button>';
      html += ' <button class="' + cls + '" aria-pressed="true">' + labelOn + '</button>';

      code = '<button class="' + cls + '" aria-pressed="false">Toggle Label</button>';
    }

    return { html: html, code: code };
  }

  // -----------------------------------------------------------------------
  // 3c. Build Toggle Group preview
  // -----------------------------------------------------------------------

  function buildToggleGroup(size, type, count, iconMode, variant) {
    var n = parseInt(count, 10);
    var sizeMod = (size === 'md') ? '' : ' nc-toggle-group--' + size;
    var variantMod = (variant === 'outline') ? ' nc-toggle-group--outline' : '';
    var isSingle = (type === 'single');

    var containerRole = isSingle ? 'radiogroup' : 'group';
    var containerLabel = isSingle ? 'Ansicht' : 'Optionen';
    var cls = 'nc-toggle-group' + sizeMod + variantMod;

    var html = '<div class="' + cls + '" role="' + containerRole + '" aria-label="' + containerLabel + '">';
    var code = '<div class="' + cls + '" role="' + containerRole + '" aria-label="' + containerLabel + '">\n';

    for (var i = 0; i < n; i++) {
      var isFirst = (i === 0);

      // Build item content
      var itemContent = '';
      var codeContent = '';

      if (iconMode === 'icon') {
        // Icon only
        var svg = groupIcons[i % groupIcons.length];
        var label = groupLabelsIcon[i % groupLabelsIcon.length];
        itemContent = '<span class="nc-toggle-group__icon">' + svg + '</span>';
        codeContent = '\n    <span class="nc-toggle-group__icon"><svg>...</svg></span>\n  ';
      } else if (iconMode === 'icon-text') {
        // Icon + Text
        var data = groupLabelsIconText[i % groupLabelsIconText.length];
        itemContent = '<span class="nc-toggle-group__icon">' + data.icon + '</span> ' + data.text;
        codeContent = '\n    <span class="nc-toggle-group__icon"><svg>...</svg></span>\n    ' + data.text + '\n  ';
      } else {
        // Text only
        var text = groupLabelsText[i % groupLabelsText.length];
        itemContent = text;
        codeContent = text;
      }

      if (isSingle) {
        // radiogroup pattern: role="radio" + aria-checked + tabindex
        var checked = isFirst ? 'true' : 'false';
        var tabIdx = isFirst ? '0' : '-1';
        var ariaLabelAttr = (iconMode === 'icon') ? ' aria-label="' + groupLabelsIcon[i % groupLabelsIcon.length] + '"' : '';

        html += '<button class="nc-toggle-group__item" role="radio" aria-checked="' + checked + '" tabindex="' + tabIdx + '"' + ariaLabelAttr + '>';
        html += itemContent;
        html += '</button>';

        code += '  <button class="nc-toggle-group__item" role="radio" aria-checked="' + checked + '" tabindex="' + tabIdx + '"' + ariaLabelAttr + '>';
        code += codeContent;
        code += '</button>\n';
      } else {
        // group pattern: aria-pressed
        var pressed = isFirst ? 'true' : 'false';
        var ariaLabelAttr = (iconMode === 'icon') ? ' aria-label="' + groupLabelsIcon[i % groupLabelsIcon.length] + '"' : '';

        html += '<button class="nc-toggle-group__item" aria-pressed="' + pressed + '"' + ariaLabelAttr + '>';
        html += itemContent;
        html += '</button>';

        code += '  <button class="nc-toggle-group__item" aria-pressed="' + pressed + '"' + ariaLabelAttr + '>';
        code += codeContent;
        code += '</button>\n';
      }
    }

    html += '</div>';
    code += '</div>';

    return { html: html, code: code };
  }

  // -----------------------------------------------------------------------
  // 3d. Attach interactivity to rendered preview items
  // -----------------------------------------------------------------------

  function attachToggleHandlers() {
    var previewEl = document.getElementById('stage-preview');
    if (!previewEl) return;

    // Toggle Buttons (.nc-button--toggle)
    var toggleButtons = previewEl.querySelectorAll('.nc-button--toggle');
    toggleButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var current = btn.getAttribute('aria-pressed') === 'true';
        btn.setAttribute('aria-pressed', String(!current));
      });
    });

    // Toggle Group items
    var group = previewEl.querySelector('.nc-toggle-group');
    if (!group) return;

    var role = group.getAttribute('role');
    var items = group.querySelectorAll('.nc-toggle-group__item');

    if (role === 'radiogroup') {
      // Single-Select: radio pattern
      items.forEach(function (item) {
        item.addEventListener('click', function () {
          if (item.disabled || item.getAttribute('aria-disabled') === 'true') return;

          // Deselect all
          items.forEach(function (it) {
            it.setAttribute('aria-checked', 'false');
            it.setAttribute('tabindex', '-1');
          });

          // Select clicked
          item.setAttribute('aria-checked', 'true');
          item.setAttribute('tabindex', '0');
          item.focus();
        });

        // Arrow key navigation (roving tabindex)
        item.addEventListener('keydown', function (e) {
          var idx = Array.prototype.indexOf.call(items, item);
          var nextIdx = -1;
          var enabledItems = Array.prototype.filter.call(items, function (it) {
            return !it.disabled && it.getAttribute('aria-disabled') !== 'true';
          });
          var currentEnabledIdx = enabledItems.indexOf(item);

          if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            nextIdx = (currentEnabledIdx + 1) % enabledItems.length;
          } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            nextIdx = (currentEnabledIdx - 1 + enabledItems.length) % enabledItems.length;
          } else if (e.key === 'Home') {
            nextIdx = 0;
          } else if (e.key === 'End') {
            nextIdx = enabledItems.length - 1;
          }

          if (nextIdx >= 0) {
            e.preventDefault();
            var target = enabledItems[nextIdx];

            // Deselect all
            items.forEach(function (it) {
              it.setAttribute('aria-checked', 'false');
              it.setAttribute('tabindex', '-1');
            });

            // Select target
            target.setAttribute('aria-checked', 'true');
            target.setAttribute('tabindex', '0');
            target.focus();
          }
        });
      });

    } else {
      // Multi-Select: toggle pattern
      items.forEach(function (item) {
        item.addEventListener('click', function () {
          if (item.disabled || item.getAttribute('aria-disabled') === 'true') return;
          var current = item.getAttribute('aria-pressed') === 'true';
          item.setAttribute('aria-pressed', String(!current));
        });
      });
    }
  }

  // -----------------------------------------------------------------------
  // 3e. Attach interactivity to showcase radiogroup demos
  // -----------------------------------------------------------------------

  function initShowcaseRadiogroups() {
    var radiogroups = document.querySelectorAll('[role="radiogroup"]');
    radiogroups.forEach(function (group) {
      // Skip the staging preview (handled separately)
      if (group.closest('#stage-preview')) return;

      var items = group.querySelectorAll('[role="radio"]');
      items.forEach(function (item) {
        item.addEventListener('click', function () {
          if (item.disabled) return;
          items.forEach(function (it) {
            it.setAttribute('aria-checked', 'false');
            it.setAttribute('tabindex', '-1');
          });
          item.setAttribute('aria-checked', 'true');
          item.setAttribute('tabindex', '0');
          item.focus();
        });

        item.addEventListener('keydown', function (e) {
          var enabledItems = Array.prototype.filter.call(items, function (it) {
            return !it.disabled;
          });
          var currentIdx = enabledItems.indexOf(item);
          var nextIdx = -1;

          if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            nextIdx = (currentIdx + 1) % enabledItems.length;
          } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            nextIdx = (currentIdx - 1 + enabledItems.length) % enabledItems.length;
          } else if (e.key === 'Home') {
            nextIdx = 0;
          } else if (e.key === 'End') {
            nextIdx = enabledItems.length - 1;
          }

          if (nextIdx >= 0) {
            e.preventDefault();
            var target = enabledItems[nextIdx];
            items.forEach(function (it) {
              it.setAttribute('aria-checked', 'false');
              it.setAttribute('tabindex', '-1');
            });
            target.setAttribute('aria-checked', 'true');
            target.setAttribute('tabindex', '0');
            target.focus();
          }
        });
      });
    });
  }

  // -----------------------------------------------------------------------
  // 3f. Main update function
  // -----------------------------------------------------------------------

  function updateStage() {
    var theme     = themeSelect.value;
    var component = componentSelect.value;
    var size      = sizeSelect.value;
    var type      = typeSelect.value;
    var count     = countSelect.value;
    var iconMode  = iconSelect.value;
    var variant   = variantSelect.value;

    // Apply theme to preview area
    var themes = ['neo-light-theme', 'neo-dark-theme', 'customer-light-theme', 'customer-dark-theme'];
    themes.forEach(function (t) { preview.classList.remove(t); });
    preview.classList.add(theme);

    // Update visibility
    updateControlVisibility();

    // Build HTML + code
    var result;
    if (component === 'toggle-button') {
      result = buildToggleButton(size, iconMode);
    } else {
      result = buildToggleGroup(size, type, count, iconMode, variant);
    }

    preview.innerHTML = result.html;
    codeOutput.textContent = result.code;

    // Attach click handlers to the rendered preview
    attachToggleHandlers();
  }

  // -----------------------------------------------------------------------
  // 4. Event listeners
  // -----------------------------------------------------------------------

  themeSelect.addEventListener('change', updateStage);
  componentSelect.addEventListener('change', updateStage);
  sizeSelect.addEventListener('change', updateStage);
  typeSelect.addEventListener('change', updateStage);
  countSelect.addEventListener('change', updateStage);
  iconSelect.addEventListener('change', updateStage);
  variantSelect.addEventListener('change', updateStage);

  // -----------------------------------------------------------------------
  // 5. Initial render
  // -----------------------------------------------------------------------

  updateControlVisibility();
  updateStage();
  initShowcaseRadiogroups();

})();
