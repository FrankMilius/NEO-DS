// ==========================================================================
// Navigation Docs — Tab Navigation + Staging Area Controller
// ==========================================================================
// Tabs: Benutzung | Style | API | Accessibility
// Staging Area: Theme, Variante (with-mega | simple)
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
    triggers.forEach(function (t) { t.setAttribute('aria-selected', 'false'); });
    panels.forEach(function (p) { p.classList.remove('is-active'); });
    trigger.setAttribute('aria-selected', 'true');
    var panelId = trigger.getAttribute('aria-controls');
    var panel = document.getElementById(panelId);
    if (panel) panel.classList.add('is-active');
  }

  triggers.forEach(function (trigger) {
    trigger.addEventListener('click', function () { activateTab(trigger); });
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
  // 2. SVG Icons
  // -----------------------------------------------------------------------

  var ICON_SEARCH = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>';
  var ICON_MENU   = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
  var ICON_CHEVRON = '<svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><polyline points="2 4 6 8 10 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  // -----------------------------------------------------------------------
  // 3. Sample Data
  // -----------------------------------------------------------------------

  var megaLinks = [
    {
      label: 'Produkte',
      description: 'Plattform-Bausteine f\u00fcr Intranet, App und Magazin.',
      children: [
        { label: 'Social Intranet', description: 'News, Communities und Knowledge Hubs.' },
        { label: 'Mitarbeiter App', description: 'Mobile Kommunikation f\u00fcr alle Teams.' },
        { label: 'Magazin', description: 'Editorial Content und Storytelling.' }
      ]
    },
    {
      label: 'Services',
      description: 'Einf\u00fchrung, Support und langfristiger Erfolg.',
      children: [
        { label: 'Einf\u00fchrungsberatung', description: 'Strategie, Rollout und Enablement.' },
        { label: 'Support', description: 'Schnelle Hilfe mit klaren SLAs.' },
        { label: 'Customer Success', description: 'Adoption, KPIs und Wachstum.' }
      ]
    },
    { label: 'Kunden' },
    { label: 'News' },
    { label: '\u00dcber uns' }
  ];

  var simpleLinks = [
    { label: 'Startseite' },
    { label: 'Produkte' },
    { label: 'Services' },
    { label: 'Kunden' },
    { label: 'Kontakt' }
  ];

  // -----------------------------------------------------------------------
  // 4. Build Header
  // -----------------------------------------------------------------------

  function createEl(tag, className, text) {
    var el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
  }

  function buildHeader(links) {
    var header = createEl('header', 'nc-header');
    header.style.position = 'relative'; // Override sticky for docs preview

    var nav = createEl('nav', 'nc-nav');
    nav.setAttribute('aria-label', 'Hauptnavigation');

    var inner = createEl('div', 'nc-nav__inner');

    // Brand
    var brand = createEl('a', 'nc-brand', 'markenname');
    brand.href = '#';

    // Nav list
    var list = createEl('ul', 'nc-nav__list');
    list.style.display = 'flex';

    links.forEach(function (link) {
      var li = createEl('li', 'nc-nav__item');

      if (link.children && link.children.length) {
        // Trigger button
        var btn = createEl('button', 'nc-nav__link');
        btn.type = 'button';
        btn.setAttribute('aria-haspopup', 'true');
        btn.setAttribute('aria-expanded', 'false');
        var btnText = createEl('span', '', link.label);
        var chevron = createEl('span', 'nc-nav__chevron');
        chevron.innerHTML = ICON_CHEVRON;
        btn.style.cssText = 'display: inline-flex; align-items: center; gap: 4px; cursor: pointer; background: none; border: none; font: inherit; padding: 4px 8px; border-radius: var(--fnd-radius-md); color: var(--fnd-color-text-high);';
        btn.append(btnText, chevron);

        // Mega menu
        var mega = createEl('div', 'nc-mega');
        mega.style.zIndex = '100';
        var megaInner = createEl('div', 'nc-mega__inner');

        var metaDiv = createEl('div', 'nc-mega__meta');
        var eyebrow = createEl('span', 'nc-mega__eyebrow', 'Produktbereich');
        var title = createEl('strong', '', link.label);
        var desc = createEl('p', '', link.description || '');
        metaDiv.append(eyebrow, title, desc);

        var linksDiv = document.createElement('div');
        linksDiv.style.cssText = 'display: flex; flex-direction: column; gap: 8px;';
        link.children.forEach(function (child) {
          var a = createEl('a', '', child.label);
          a.href = '#';
          a.style.cssText = 'display: block; padding: 8px 12px; border-radius: var(--fnd-radius-md); text-decoration: none; color: var(--fnd-color-text-high);';
          a.onmouseover = function () { a.style.background = 'var(--fnd-color-background-secondary)'; };
          a.onmouseout = function () { a.style.background = ''; };
          if (child.description) {
            var childDesc = createEl('p', '', child.description);
            childDesc.style.cssText = 'margin: 2px 0 0; font-size: 0.85rem; color: var(--fnd-color-text-mid);';
            a.appendChild(childDesc);
          }
          linksDiv.appendChild(a);
        });

        megaInner.append(metaDiv, linksDiv);
        mega.appendChild(megaInner);

        btn.addEventListener('click', function () {
          var isOpen = li.classList.contains('is-open');
          // Close all
          list.querySelectorAll('.nc-nav__item.is-open').forEach(function (openLi) {
            openLi.classList.remove('is-open');
            var openBtn = openLi.querySelector('[aria-expanded]');
            if (openBtn) openBtn.setAttribute('aria-expanded', 'false');
          });
          if (!isOpen) {
            li.classList.add('is-open');
            btn.setAttribute('aria-expanded', 'true');
          }
        });

        btn.addEventListener('keydown', function (e) {
          if (e.key === 'Escape') {
            li.classList.remove('is-open');
            btn.setAttribute('aria-expanded', 'false');
            btn.focus();
          }
        });

        li.append(btn, mega);
      } else {
        var a = createEl('a', '', link.label);
        a.href = '#';
        a.style.cssText = 'padding: 4px 8px; border-radius: var(--fnd-radius-md); text-decoration: none; color: var(--fnd-color-text-high);';
        a.onmouseover = function () { a.style.background = 'var(--fnd-color-background-secondary)'; };
        a.onmouseout = function () { a.style.background = ''; };
        li.appendChild(a);
      }

      list.appendChild(li);
    });

    // Close mega menus on outside click
    document.addEventListener('click', function (e) {
      if (!header.contains(e.target)) {
        list.querySelectorAll('.nc-nav__item.is-open').forEach(function (openLi) {
          openLi.classList.remove('is-open');
          var openBtn = openLi.querySelector('[aria-expanded]');
          if (openBtn) openBtn.setAttribute('aria-expanded', 'false');
        });
      }
    });

    // Tools
    var tools = createEl('div', 'nc-tools');
    tools.style.display = 'flex';
    var searchBtn = createEl('button', '');
    searchBtn.type = 'button';
    searchBtn.setAttribute('aria-label', 'Suche \u00f6ffnen');
    searchBtn.innerHTML = ICON_SEARCH;
    searchBtn.style.cssText = 'background: none; border: none; cursor: pointer; padding: 6px; border-radius: var(--fnd-radius-md); color: var(--fnd-color-text-high);';
    tools.appendChild(searchBtn);

    // Mobile toggle (visible only on small screens via CSS)
    var mobileToggle = createEl('button', 'nc-mobile-toggle');
    mobileToggle.type = 'button';
    mobileToggle.setAttribute('aria-label', 'Navigation \u00f6ffnen');
    mobileToggle.innerHTML = ICON_MENU;
    mobileToggle.style.cssText = 'background: none; border: none; cursor: pointer; color: var(--fnd-color-text-high);';

    inner.append(brand, list, tools, mobileToggle);
    nav.appendChild(inner);
    header.appendChild(nav);

    return header;
  }

  // -----------------------------------------------------------------------
  // 5. Staging Area
  // -----------------------------------------------------------------------

  var themeSelect   = document.getElementById('stage-theme');
  var variantSelect = document.getElementById('stage-variant');
  var preview       = document.getElementById('stage-preview');
  var codeOutput    = document.getElementById('stage-code');

  if (!preview) return;

  function updateStage() {
    var theme   = themeSelect.value;
    var variant = variantSelect.value;

    // Apply theme
    var themes = ['neo-light-theme', 'neo-dark-theme', 'customer-light-theme', 'customer-dark-theme'];
    themes.forEach(function (t) { preview.classList.remove(t); });
    preview.classList.add(theme);

    preview.innerHTML = '';
    var links = variant === 'simple' ? simpleLinks : megaLinks;
    preview.appendChild(buildHeader(links));

    if (codeOutput) {
      if (variant === 'simple') {
        codeOutput.textContent =
          '<header class="nc-header">\n'
          + '  <nav class="nc-nav" aria-label="Hauptnavigation">\n'
          + '    <div class="nc-nav__inner">\n'
          + '      <a class="nc-brand" href="/">markenname</a>\n'
          + '      <ul class="nc-nav__list">\n'
          + simpleLinks.map(function (l) {
              return '        <li class="nc-nav__item"><a href="#">' + l.label + '</a></li>';
            }).join('\n')
          + '\n      </ul>\n'
          + '      <div class="nc-tools"><!-- Icon-Buttons --></div>\n'
          + '    </div>\n'
          + '  </nav>\n'
          + '</header>';
      } else {
        codeOutput.textContent =
          '<header class="nc-header">\n'
          + '  <nav class="nc-nav" aria-label="Hauptnavigation">\n'
          + '    <div class="nc-nav__inner">\n'
          + '      <a class="nc-brand" href="/">markenname</a>\n'
          + '      <ul class="nc-nav__list">\n'
          + '        <li class="nc-nav__item">\n'
          + '          <button type="button" aria-haspopup="true" aria-expanded="false">Produkte</button>\n'
          + '          <div class="nc-mega">\n'
          + '            <div class="nc-mega__inner">\n'
          + '              <div class="nc-mega__meta">\n'
          + '                <span class="nc-mega__eyebrow">Produktbereich</span>\n'
          + '                <strong>Produkte</strong>\n'
          + '                <p>Beschreibung...</p>\n'
          + '              </div>\n'
          + '              <div><!-- Links --></div>\n'
          + '            </div>\n'
          + '          </div>\n'
          + '        </li>\n'
          + '        <li class="nc-nav__item"><a href="#">Kunden</a></li>\n'
          + '      </ul>\n'
          + '      <div class="nc-tools"><!-- Icon-Buttons --></div>\n'
          + '    </div>\n'
          + '  </nav>\n'
          + '</header>';
      }
    }
  }

  themeSelect.addEventListener('change', updateStage);
  variantSelect.addEventListener('change', updateStage);

  // Initial render
  updateStage();

})();
