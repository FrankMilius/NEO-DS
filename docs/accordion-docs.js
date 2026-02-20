// ==========================================================================
// Accordion Docs — Tab Navigation + Staging Area Controller
// ==========================================================================
// Tabs: Benutzung | Style | API | Accessibility
// Staging Area: Theme, Anzahl Items, Erstes Item offen, Progress Bar
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
  var countSelect    = document.getElementById('stage-count');
  var openChk        = document.getElementById('stage-open');
  var progressChk    = document.getElementById('stage-progress');
  var preview        = document.getElementById('stage-preview');
  var codeOutput     = document.getElementById('stage-code');

  if (!preview) return;

  // SVG icons for expand/collapse
  var iconExpand = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>';
  var iconCollapse = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>';

  // Sample content for items
  var items = [
    {
      title: 'Was ist ein Accordion?',
      content: 'Ein Accordion ist ein zusammenklappbares UI-Element, das Inhalt progressiv offenbart. Es eignet sich f\u00fcr FAQ-Seiten, Einstellungsbereiche und strukturierte Inhalte.'
    },
    {
      title: 'Wann sollte ich einen Accordion verwenden?',
      content: 'Verwende Accordions wenn der Inhalt l\u00e4nger ist als der verf\u00fcgbare Platz oder wenn Benutzer selektiv Informationen ben\u00f6tigen.'
    },
    {
      title: 'Wird JavaScript ben\u00f6tigt?',
      content: 'Nein. Der Accordion funktioniert vollst\u00e4ndig ohne JavaScript auf Basis des nativen \u003cdetails\u003e/\u003csummary\u003e-Elements.'
    },
    {
      title: 'Wie wird das erste Item ge\u00f6ffnet?',
      content: 'Das \u003ccode\u003eopen\u003c/code\u003e-Attribut am \u003cdetails\u003e-Element \u00f6ffnet ein Item beim Laden der Seite.'
    }
  ];

  function buildIconContainer() {
    return '<div class="accordion-item-summary-icon">'
      + '<span class="icon accordion-icon-expand" aria-hidden="true">' + iconExpand + '</span>'
      + '<span class="icon accordion-icon-collapse" aria-hidden="true">' + iconCollapse + '</span>'
      + '</div>';
  }

  function updateStage() {
    var theme       = themeSelect.value;
    var count       = parseInt(countSelect.value, 10);
    var firstOpen   = openChk.checked;
    var showProgress = progressChk.checked;

    // Apply theme to preview area
    var themes = ['neo-light-theme', 'neo-dark-theme', 'customer-light-theme', 'customer-dark-theme'];
    themes.forEach(function (t) { preview.classList.remove(t); });
    preview.classList.add(theme);

    // Build accordion HTML
    var html = '<div class="accordion">';
    var codeStr = '<div class="accordion">\n';

    for (var i = 0; i < count; i++) {
      var item = items[i] || items[items.length - 1];
      var isOpen = (i === 0 && firstOpen);
      var openAttr = isOpen ? ' open' : '';
      var progressClass = showProgress ? ' active' : '';

      html += '<details class="accordion-item"' + openAttr + ' style="position: relative;">';
      if (showProgress) {
        html += '<div class="accordion-progress' + progressClass + '"></div>';
      }
      html += '<summary class="accordion-item-summary">';
      html += buildIconContainer();
      html += item.title;
      html += '</summary>';
      html += '<div class="accordion-item-content"><p>' + item.content + '</p></div>';
      html += '</details>';

      // Code string
      codeStr += '  <details class="accordion-item"' + openAttr + '>\n';
      if (showProgress) {
        codeStr += '    <div class="accordion-progress' + progressClass + '"></div>\n';
      }
      codeStr += '    <summary class="accordion-item-summary">\n';
      codeStr += '      <div class="accordion-item-summary-icon">\n';
      codeStr += '        <span class="icon accordion-icon-expand" aria-hidden="true"><svg>...</svg></span>\n';
      codeStr += '        <span class="icon accordion-icon-collapse" aria-hidden="true"><svg>...</svg></span>\n';
      codeStr += '      </div>\n';
      codeStr += '      ' + item.title + '\n';
      codeStr += '    </summary>\n';
      codeStr += '    <div class="accordion-item-content">\n';
      codeStr += '      <p>' + item.content.replace(/<[^>]+>/g, '') + '</p>\n';
      codeStr += '    </div>\n';
      codeStr += '  </details>\n';
    }

    html += '</div>';
    codeStr += '</div>';

    preview.innerHTML = html;
    codeOutput.textContent = codeStr;
  }

  // Event listeners
  themeSelect.addEventListener('change', updateStage);
  countSelect.addEventListener('change', updateStage);
  openChk.addEventListener('change', updateStage);
  progressChk.addEventListener('change', updateStage);

  // Initial render
  updateStage();

})();
