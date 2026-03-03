// ==========================================================================
// Media Ratios Docs — Tab Navigation + Staging Area Controller
// ==========================================================================
// Tabs: Benutzung | Style | API | Accessibility
// Staging Area: Theme, Ratio, Content
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

  var themeSelect   = document.getElementById('stage-theme');
  var ratioSelect   = document.getElementById('stage-ratio');
  var contentSelect = document.getElementById('stage-content');
  var preview       = document.getElementById('stage-preview');
  var codeOutput    = document.getElementById('stage-code');

  if (!preview) return;

  function updateStage() {
    var theme   = themeSelect.value;
    var ratio   = ratioSelect.value;
    var content = contentSelect.value;

    // Apply theme to preview area
    var themes = ['neo-light-theme', 'neo-dark-theme', 'customer-light-theme', 'customer-dark-theme'];
    themes.forEach(function (t) { preview.classList.remove(t); });
    preview.classList.add(theme);

    var modifier = 'nc-aspect-ratio--' + ratio;
    var ratioLabel = ratioSelect.options[ratioSelect.selectedIndex].text;

    // Build inner content HTML
    var innerHtml = '';
    var innerCode = '';

    if (content === 'image') {
      innerHtml = '<img class="nc-aspect-ratio__content" src="data:image/svg+xml,'
                + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900"><rect width="1600" height="900" fill="#e5e5e5"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="48" fill="#999">')
                + ratio
                + encodeURIComponent('</text></svg>')
                + '" alt="Media Ratios Demo" />';
      innerCode = '<img class="nc-aspect-ratio__content"\n'
                + '       src="image.jpg" alt="Beschreibung" />';
    } else if (content === 'video') {
      innerHtml = '<div class="nc-aspect-ratio__content" style="background: var(--fnd-color-background-secondary); display: flex; align-items: center; justify-content: center;">'
                + '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--fnd-color-text-secondary);"><polygon points="5 3 19 12 5 21 5 3"/></svg>'
                + '</div>';
      innerCode = '<video class="nc-aspect-ratio__content" controls>\n'
                + '       <source src="video.mp4" type="video/mp4" />\n'
                + '     </video>';
    } else {
      innerHtml = '<div class="nc-aspect-ratio__content" style="background: var(--fnd-color-background-secondary); display: flex; align-items: center; justify-content: center; font-size: var(--fs-lg); color: var(--fnd-color-text-secondary);">'
                + ratioLabel
                + '</div>';
      innerCode = '<div class="nc-aspect-ratio__content">\n'
                + '       <!-- Beliebiger Inhalt -->\n'
                + '     </div>';
    }

    // Build wrapper — constrain width for usability
    var maxW = '480px';
    if (ratio === '9-16' || ratio === '3-4' || ratio === '2-3' || ratio === '1-2') {
      maxW = '240px'; // Portrait ratios: narrower
    }

    var html = '<div style="max-width: ' + maxW + ';">'
             + '<div class="nc-aspect-ratio ' + modifier + '">'
             + innerHtml
             + '</div>'
             + '</div>';

    preview.innerHTML = html;

    // Code output
    var codeStr = '<div class="nc-aspect-ratio ' + modifier + '">\n'
                + '  ' + innerCode + '\n'
                + '</div>';

    codeOutput.textContent = codeStr;
  }

  // Event listeners
  themeSelect.addEventListener('change', updateStage);
  ratioSelect.addEventListener('change', updateStage);
  contentSelect.addEventListener('change', updateStage);

  // Initial render
  updateStage();

})();
