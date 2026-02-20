// ==========================================================================
// Tag Docs — Tab Navigation + Staging Area Controller
// ==========================================================================
// Tabs: Benutzung | Style | API | Accessibility
// Staging Area: Theme, Size, Variant, Interactive, Removable, Icon
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

  var themeSelect      = document.getElementById('stage-theme');
  var sizeSelect       = document.getElementById('stage-size');
  var variantSelect    = document.getElementById('stage-variant');
  var interactiveChk   = document.getElementById('stage-interactive');
  var removableChk     = document.getElementById('stage-removable');
  var iconSelect       = document.getElementById('stage-icon');
  var preview          = document.getElementById('stage-preview');
  var codeOutput       = document.getElementById('stage-code');

  if (!preview) return;

  // SVG: X icon for remove button
  var removeSvg = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="4" y1="4" x2="12" y2="12"/><line x1="12" y1="4" x2="4" y2="12"/></svg>';

  // SVG: Leading icon (generic circle)
  var leadingIconSvg = '<svg class="nc-tag__icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6"/></svg>';

  function updateStage() {
    var theme       = themeSelect.value;
    var size        = sizeSelect.value;
    var variant     = variantSelect.value;
    var interactive = interactiveChk.checked;
    var removable   = removableChk.checked;
    var icon        = iconSelect.value;

    // Apply theme to preview area
    var themes = ['neo-light-theme', 'neo-dark-theme', 'customer-light-theme', 'customer-dark-theme'];
    themes.forEach(function (t) { preview.classList.remove(t); });
    preview.classList.add(theme);

    // Build class list
    var classes = ['nc-tag'];
    if (size !== 'md') classes.push('nc-tag--' + size);
    if (variant !== 'default') classes.push('nc-tag--' + variant);
    if (interactive) classes.push('nc-tag--interactive');
    var classStr = classes.join(' ');

    // Determine the HTML element tag
    var elTag = interactive ? 'a' : 'span';

    // Build inner content
    var innerHtml = '';
    var codeInner = '';

    // Leading icon
    if (icon === 'leading') {
      innerHtml += leadingIconSvg;
      codeInner += '  <svg class="nc-tag__icon" viewBox="0 0 16 16">...</svg>\n';
    }

    // Text content
    innerHtml += 'Beispiel-Tag';
    codeInner += (icon === 'leading' ? '  ' : '  ') + 'Beispiel-Tag';

    // Remove button
    if (removable) {
      innerHtml += '<button class="nc-tag__remove" aria-label="Beispiel-Tag entfernen">' + removeSvg + '</button>';
      codeInner += '\n  <button class="nc-tag__remove" aria-label="Beispiel-Tag entfernen">\n    <svg viewBox="0 0 16 16">...</svg>\n  </button>';
    }

    // Build the full HTML
    var html;
    var codeStr;

    if (interactive) {
      html = '<a href="#" class="' + classStr + '">' + innerHtml + '</a>';
      codeStr = '<a href="/ziel" class="' + classStr + '">\n' + codeInner + '\n</a>';
    } else {
      html = '<span class="' + classStr + '">' + innerHtml + '</span>';
      codeStr = '<span class="' + classStr + '">\n' + codeInner + '\n</span>';
    }

    preview.innerHTML = html;
    codeOutput.textContent = codeStr;
  }

  // Event listeners
  themeSelect.addEventListener('change', updateStage);
  sizeSelect.addEventListener('change', updateStage);
  variantSelect.addEventListener('change', updateStage);
  interactiveChk.addEventListener('change', updateStage);
  removableChk.addEventListener('change', updateStage);
  iconSelect.addEventListener('change', updateStage);

  // Initial render
  updateStage();

})();
