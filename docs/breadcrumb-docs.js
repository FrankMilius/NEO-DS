// ==========================================================================
// Breadcrumb Docs — Tab Navigation + Staging Area Controller
// ==========================================================================
// Tabs: Benutzung | Style | API | Accessibility
// Staging Area: Theme, Items, Separator, Ellipsis
// Verhalten des Ellipsis-Menues: allein neo-behaviors (breadcrumb), das Menue
// steht im Markup. Das fruehere js/breadcrumb.js baute es aus
// data-breadcrumb-hidden-items zusaetzlich — auf geerntetem Markup mit
// vorhandenem Menue entstand so ein zweites (Entscheidung 03.10.2026).
// ==========================================================================

(function () {
  'use strict';

  // Statische Beispiele (Showcase): Ellipsis-Menue per neo-behaviors
  if (window.NeoBehaviors) window.NeoBehaviors.anbinden(document, ['breadcrumb']);

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
  var itemsSelect     = document.getElementById('stage-items');
  var separatorSelect = document.getElementById('stage-separator');
  var ellipsisChk     = document.getElementById('stage-ellipsis');
  var preview         = document.getElementById('stage-preview');
  var codeOutput      = document.getElementById('stage-code');

  if (!preview) return;

  // -----------------------------------------------------------------------
  // 3. Constants
  // -----------------------------------------------------------------------

  var chevronSvg = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>';

  var ellipsisSvg = '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>';

  var pageNames = ['Home', 'Dashboard', 'Einstellungen', 'Benutzer', 'Profil'];

  // -----------------------------------------------------------------------
  // 4. updateStage()
  // -----------------------------------------------------------------------

  function updateStage() {
    var theme     = themeSelect.value;
    var itemCount = parseInt(itemsSelect.value, 10);
    var separator = separatorSelect.value;
    var ellipsis  = ellipsisChk.checked;

    // Apply theme to preview area
    var themes = ['neo-light-theme', 'neo-dark-theme', 'customer-light-theme', 'customer-dark-theme'];
    themes.forEach(function (t) { preview.classList.remove(t); });
    preview.classList.add(theme);

    // Determine separator HTML
    var sepHtml;
    var sepCode;
    switch (separator) {
      case 'chevron':
        sepHtml = '<span class="nc-breadcrumb__separator" aria-hidden="true">' + chevronSvg + '</span>';
        sepCode = '      <span class="nc-breadcrumb__separator" aria-hidden="true">\n        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>\n      </span>';
        break;
      case 'slash':
        sepHtml = '<span class="nc-breadcrumb__separator" aria-hidden="true">/</span>';
        sepCode = '      <span class="nc-breadcrumb__separator" aria-hidden="true">/</span>';
        break;
      case 'dot':
        sepHtml = '<span class="nc-breadcrumb__separator nc-breadcrumb__separator--dot" aria-hidden="true"></span>';
        sepCode = '      <span class="nc-breadcrumb__separator nc-breadcrumb__separator--dot" aria-hidden="true"></span>';
        break;
      case 'square':
        sepHtml = '<span class="nc-breadcrumb__separator nc-breadcrumb__separator--square" aria-hidden="true"></span>';
        sepCode = '      <span class="nc-breadcrumb__separator nc-breadcrumb__separator--square" aria-hidden="true"></span>';
        break;
      case 'custom':
        sepHtml = '<span class="nc-breadcrumb__separator nc-breadcrumb__separator--custom" aria-hidden="true"></span>';
        sepCode = '      <span class="nc-breadcrumb__separator nc-breadcrumb__separator--custom" aria-hidden="true"></span>';
        break;
      default:
        sepHtml = '<span class="nc-breadcrumb__separator" aria-hidden="true">' + chevronSvg + '</span>';
        sepCode = '      <span class="nc-breadcrumb__separator" aria-hidden="true">...</span>';
    }

    // Get the items to display (slice from pageNames)
    var items = pageNames.slice(0, itemCount);

    // Build HTML and code
    var html = '';
    var code = '';

    if (ellipsis && itemCount > 2) {
      var preHiddenItems = [];
      for (var p = 1; p < itemCount - 2; p++) {
        preHiddenItems.push({ label: items[p], href: '#' });
      }
      html += '<nav class="nc-breadcrumb" aria-label="Breadcrumb">';
      code += '<nav class="nc-breadcrumb" aria-label="Breadcrumb">\n';
    } else {
      html += '<nav class="nc-breadcrumb" aria-label="Breadcrumb">';
      code += '<nav class="nc-breadcrumb" aria-label="Breadcrumb">\n';
    }
    html += '<ol class="nc-breadcrumb__list">';
    code += '  <ol class="nc-breadcrumb__list">\n';

    if (ellipsis && itemCount > 2) {
      // Ellipsis mode: Home -> ellipsis -> last 2 items
      // Versteckte Items ermitteln (alle zwischen erstem und letzten 2)
      var hiddenItems = [];
      for (var h = 1; h < items.length - 2; h++) {
        hiddenItems.push({ label: items[h], href: '#' });
      }

      // First item (Home)
      html += '<li class="nc-breadcrumb__item">';
      html += '<a class="nc-breadcrumb__link" href="#">' + items[0] + '</a>';
      html += sepHtml;
      html += '</li>';

      code += '    <li class="nc-breadcrumb__item">\n';
      code += '      <a class="nc-breadcrumb__link" href="#">' + items[0] + '</a>\n';
      code += sepCode + '\n';
      code += '    </li>\n';

      // Ellipsis-Knopf + Menue der ausgeblendeten Ebenen (im Markup)
      var menuHtml = '<ul class="nc-breadcrumb__dropdown" role="menu">';
      var menuCode = '      <ul class="nc-breadcrumb__dropdown" role="menu">\n';
      preHiddenItems.forEach(function (it) {
        menuHtml += '<li role="none"><a class="nc-breadcrumb__dropdown-item" role="menuitem" tabindex="-1" href="' + it.href + '">' + it.label + '</a></li>';
        menuCode += '        <li role="none"><a class="nc-breadcrumb__dropdown-item" role="menuitem" tabindex="-1" href="' + it.href + '">' + it.label + '</a></li>\n';
      });
      menuHtml += '</ul>';
      menuCode += '      </ul>\n';

      html += '<li class="nc-breadcrumb__item nc-breadcrumb__ellipsis-wrap">';
      html += '<button type="button" class="nc-breadcrumb__ellipsis" aria-label="Versteckte Seiten anzeigen" aria-haspopup="true" aria-expanded="false">' + ellipsisSvg + '</button>';
      html += menuHtml;
      html += sepHtml;
      html += '</li>';

      code += '    <li class="nc-breadcrumb__item nc-breadcrumb__ellipsis-wrap">\n';
      code += '      <button type="button" class="nc-breadcrumb__ellipsis" aria-label="Versteckte Seiten anzeigen"\n';
      code += '              aria-haspopup="true" aria-expanded="false">\n';
      code += '        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>\n';
      code += '      </button>\n';
      code += menuCode;
      code += sepCode + '\n';
      code += '    </li>\n';

      // Last 2 items: second-to-last as link, last as current page
      var lastTwo = items.slice(-2);

      // Second-to-last (link)
      html += '<li class="nc-breadcrumb__item">';
      html += '<a class="nc-breadcrumb__link" href="#">' + lastTwo[0] + '</a>';
      html += sepHtml;
      html += '</li>';

      code += '    <li class="nc-breadcrumb__item">\n';
      code += '      <a class="nc-breadcrumb__link" href="#">' + lastTwo[0] + '</a>\n';
      code += sepCode + '\n';
      code += '    </li>\n';

      // Last item (current page)
      html += '<li class="nc-breadcrumb__item">';
      html += '<span class="nc-breadcrumb__page" aria-current="page">' + lastTwo[1] + '</span>';
      html += '</li>';

      code += '    <li class="nc-breadcrumb__item">\n';
      code += '      <span class="nc-breadcrumb__page" aria-current="page">' + lastTwo[1] + '</span>\n';
      code += '    </li>\n';

    } else {
      // Normal mode: all items in order
      for (var i = 0; i < items.length; i++) {
        var isLast = (i === items.length - 1);

        html += '<li class="nc-breadcrumb__item">';
        code += '    <li class="nc-breadcrumb__item">\n';

        if (isLast) {
          html += '<span class="nc-breadcrumb__page" aria-current="page">' + items[i] + '</span>';
          code += '      <span class="nc-breadcrumb__page" aria-current="page">' + items[i] + '</span>\n';
        } else {
          html += '<a class="nc-breadcrumb__link" href="#">' + items[i] + '</a>';
          html += sepHtml;

          code += '      <a class="nc-breadcrumb__link" href="#">' + items[i] + '</a>\n';
          code += sepCode + '\n';
        }

        html += '</li>';
        code += '    </li>\n';
      }
    }

    html += '</ol>';
    html += '</nav>';

    code += '  </ol>\n';
    code += '</nav>';

    // neo-behaviors: alte Instanz loesen, neue binden (nur Breadcrumb)
    var nb = window.NeoBehaviors;
    if (nb) nb.abbinden(preview, ['breadcrumb']);
    preview.innerHTML = html;
    codeOutput.textContent = code;
    if (nb) nb.anbinden(preview, ['breadcrumb']);
  }

  // -----------------------------------------------------------------------
  // 5. Event listeners + initial render
  // -----------------------------------------------------------------------

  themeSelect.addEventListener('change', updateStage);
  itemsSelect.addEventListener('change', updateStage);
  separatorSelect.addEventListener('change', updateStage);
  ellipsisChk.addEventListener('change', updateStage);

  // Initial render
  updateStage();

})();
