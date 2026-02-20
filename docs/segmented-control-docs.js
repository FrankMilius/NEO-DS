// ==========================================================================
// Segmented Control Docs — Tab Navigation + Staging Area Controller
// ==========================================================================
// IIFE: Tab switching, staging area with Theme/Size/Count/Full-Width/IconMode,
// live preview with clickable exclusive-selection segments,
// and generated code output.
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
  var countSelect    = document.getElementById('stage-count');
  var fullWidthChk   = document.getElementById('stage-fullwidth');
  var iconModeSelect = document.getElementById('stage-iconmode');
  var preview        = document.getElementById('stage-preview');
  var codeOutput     = document.getElementById('stage-code');

  if (!preview) return;

  // -----------------------------------------------------------------------
  // 3. SVG Icon Templates
  // -----------------------------------------------------------------------

  // Grid icon (4 squares)
  var iconGrid = '<svg class="nc-segmented-control__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>';

  // List icon (3 horizontal lines)
  var iconList = '<svg class="nc-segmented-control__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';

  // Card icon (2 stacked rectangles)
  var iconCard = '<svg class="nc-segmented-control__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="8" rx="2"/><rect x="3" y="13" width="18" height="8" rx="2"/></svg>';

  // Map icon (folded map) — used as 4th option when count=4
  var iconMap = '<svg class="nc-segmented-control__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>';

  var icons = [iconGrid, iconList, iconCard, iconMap];

  // -----------------------------------------------------------------------
  // 4. Segment Label Sets
  // -----------------------------------------------------------------------

  var labelSets = {
    2: ['Monatlich', 'J\u00e4hrlich'],
    3: ['Tag', 'Woche', 'Monat'],
    4: ['Tag', 'Woche', 'Monat', 'Jahr']
  };

  var iconLabels = {
    2: ['Rasteransicht', 'Listenansicht'],
    3: ['Rasteransicht', 'Listenansicht', 'Kartenansicht'],
    4: ['Rasteransicht', 'Listenansicht', 'Kartenansicht', 'Kartenansicht']
  };

  var iconTextLabels = {
    2: ['Raster', 'Liste'],
    3: ['Raster', 'Liste', 'Karten'],
    4: ['Raster', 'Liste', 'Karten', 'Karte']
  };

  // -----------------------------------------------------------------------
  // 5. Helper: Escape HTML
  // -----------------------------------------------------------------------

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // -----------------------------------------------------------------------
  // 6. Build + Render
  // -----------------------------------------------------------------------

  function updateStage() {
    var theme     = themeSelect.value;
    var size      = sizeSelect.value;
    var count     = parseInt(countSelect.value, 10);
    var fullWidth = fullWidthChk.checked;
    var iconMode  = iconModeSelect.value;

    // Apply theme to preview area
    var themes = ['neo-light-theme', 'neo-dark-theme', 'customer-light-theme', 'customer-dark-theme'];
    themes.forEach(function (t) { preview.classList.remove(t); });
    preview.classList.add(theme);

    // Build container classes
    var containerCls = 'nc-segmented-control';
    if (size !== 'md') containerCls += ' nc-segmented-control--' + size;
    if (fullWidth)     containerCls += ' nc-segmented-control--full-width';

    // Select labels and aria-labels
    var labels     = labelSets[count] || labelSets[2];
    var ariaLabels = iconLabels[count] || iconLabels[2];
    var textLabels = iconTextLabels[count] || iconTextLabels[2];

    // Build HTML for preview
    var html = '<div class="' + containerCls + '" role="radiogroup" aria-label="Demo Segmented Control">';

    for (var i = 0; i < count; i++) {
      var isActive  = (i === 0);
      var itemCls   = 'nc-segmented-control__item';
      if (isActive) itemCls += ' nc-segmented-control__item--active';

      var ariaChecked = isActive ? 'true' : 'false';
      var tabIdx      = isActive ? '0' : '-1';

      var ariaLabelAttr = '';
      var content = '';

      if (iconMode === 'icon') {
        ariaLabelAttr = ' aria-label="' + ariaLabels[i] + '"';
        content = icons[i];
      } else if (iconMode === 'icon-text') {
        content = icons[i] + ' ' + textLabels[i];
      } else {
        content = labels[i];
      }

      html += '<button class="' + itemCls + '" role="radio" aria-checked="' + ariaChecked + '"' + ariaLabelAttr + ' tabindex="' + tabIdx + '">' + content + '</button>';
    }

    html += '</div>';
    preview.innerHTML = html;

    // Build code output
    var sizeMod = (size !== 'md') ? ' nc-segmented-control--' + size : '';
    var fwMod   = fullWidth ? ' nc-segmented-control--full-width' : '';
    var codeCls = 'nc-segmented-control' + sizeMod + fwMod;

    var code = '<div class="' + codeCls + '" role="radiogroup" aria-label="...">\n';

    for (var j = 0; j < count; j++) {
      var jActive   = (j === 0);
      var jItemCls  = 'nc-segmented-control__item';
      if (jActive) jItemCls += ' nc-segmented-control__item--active';

      var jAriaChecked = jActive ? 'true' : 'false';
      var jTabIdx      = jActive ? '0' : '-1';
      var jLabel       = '';
      var jAriaLabel   = '';
      var jContent     = '';

      if (iconMode === 'icon') {
        jAriaLabel = '\n          aria-label="' + ariaLabels[j] + '"';
        jContent = '\n    <svg class="nc-segmented-control__icon">...</svg>';
      } else if (iconMode === 'icon-text') {
        jContent = '\n    <svg class="nc-segmented-control__icon">...</svg>\n    ' + textLabels[j];
      } else {
        jContent = labels[j];
      }

      if (iconMode === 'text') {
        code += '  <button class="' + jItemCls + '"\n          role="radio" aria-checked="' + jAriaChecked + '" tabindex="' + jTabIdx + '">' + jContent + '</button>\n';
      } else {
        code += '  <button class="' + jItemCls + '"\n          role="radio" aria-checked="' + jAriaChecked + '"' + jAriaLabel + '\n          tabindex="' + jTabIdx + '">' + jContent + '\n  </button>\n';
      }
    }

    code += '</div>';
    codeOutput.textContent = code;

    // Attach click handlers to the new segments for exclusive selection
    attachSegmentClickHandlers();
  }

  // -----------------------------------------------------------------------
  // 7. Exclusive Selection Click Handler
  // -----------------------------------------------------------------------

  function attachSegmentClickHandlers() {
    var container = preview.querySelector('.nc-segmented-control');
    if (!container) return;

    var items = container.querySelectorAll('.nc-segmented-control__item');
    items.forEach(function (item) {
      item.addEventListener('click', function () {
        if (item.disabled) return;
        // Deselect all
        items.forEach(function (it) {
          it.classList.remove('nc-segmented-control__item--active');
          it.setAttribute('aria-checked', 'false');
          it.setAttribute('tabindex', '-1');
        });
        // Select clicked
        item.classList.add('nc-segmented-control__item--active');
        item.setAttribute('aria-checked', 'true');
        item.setAttribute('tabindex', '0');
        item.focus();
      });

      // Arrow key navigation within the radiogroup (roving tabindex)
      item.addEventListener('keydown', function (e) {
        var allItems = Array.prototype.slice.call(items);
        var enabledItems = allItems.filter(function (it) { return !it.disabled; });
        var currentIdx = enabledItems.indexOf(item);
        if (currentIdx < 0) return;

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
          // Deselect all
          allItems.forEach(function (it) {
            it.classList.remove('nc-segmented-control__item--active');
            it.setAttribute('aria-checked', 'false');
            it.setAttribute('tabindex', '-1');
          });
          // Select next
          var nextItem = enabledItems[nextIdx];
          nextItem.classList.add('nc-segmented-control__item--active');
          nextItem.setAttribute('aria-checked', 'true');
          nextItem.setAttribute('tabindex', '0');
          nextItem.focus();
        }
      });
    });
  }

  // -----------------------------------------------------------------------
  // 8. Event Listeners
  // -----------------------------------------------------------------------

  themeSelect.addEventListener('change', updateStage);
  sizeSelect.addEventListener('change', updateStage);
  countSelect.addEventListener('change', updateStage);
  fullWidthChk.addEventListener('change', updateStage);
  iconModeSelect.addEventListener('change', updateStage);

  // Initial render
  updateStage();

  // -----------------------------------------------------------------------
  // 9. Showcase Segmented Controls — Interactive Click Handlers
  // -----------------------------------------------------------------------
  // Make all static showcase segmented controls clickable with exclusive
  // selection, just like the staging area preview.

  document.addEventListener('click', function (e) {
    var item = e.target.closest('.nc-segmented-control__item');
    if (!item) return;

    // Skip if inside the staging preview (already handled above)
    if (item.closest('#stage-preview')) return;

    // Skip if disabled
    if (item.disabled) return;

    var container = item.closest('.nc-segmented-control');
    if (!container) return;

    var siblings = container.querySelectorAll('.nc-segmented-control__item');
    // Deselect all
    siblings.forEach(function (sib) {
      sib.classList.remove('nc-segmented-control__item--active');
      sib.setAttribute('aria-checked', 'false');
      sib.setAttribute('tabindex', '-1');
    });
    // Select clicked
    item.classList.add('nc-segmented-control__item--active');
    item.setAttribute('aria-checked', 'true');
    item.setAttribute('tabindex', '0');
  });

})();
