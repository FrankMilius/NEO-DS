// ==========================================================================
// Navigation Menu Docs — Tab Navigation + Staging Area Controller
// ==========================================================================
// Tabs: Benutzung | Style | API | Accessibility
// Staging Area: Theme, Variant
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
  // 2. Sidebar Toggle
  // -----------------------------------------------------------------------

  var sidebar = document.getElementById('docs-sidebar');
  var sidebarOpen = document.getElementById('docs-sidebar-open');
  var sidebarClose = document.getElementById('docs-sidebar-close');
  var sidebarOverlay = document.getElementById('docs-sidebar-overlay');

  function openSidebar() {
    if (sidebar) sidebar.classList.add('is-open');
    if (sidebarOverlay) sidebarOverlay.classList.add('is-open');
  }

  function closeSidebar() {
    if (sidebar) sidebar.classList.remove('is-open');
    if (sidebarOverlay) sidebarOverlay.classList.remove('is-open');
  }

  if (sidebarOpen) sidebarOpen.addEventListener('click', openSidebar);
  if (sidebarClose) sidebarClose.addEventListener('click', closeSidebar);
  if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeSidebar);

  // Sidebar collapsible sections
  document.querySelectorAll('.docs-sidebar__toggle, .docs-sidebar__subtoggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var targetId = btn.getAttribute('aria-controls');
      var target = document.getElementById(targetId);
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      if (target) target.style.display = expanded ? 'none' : '';
    });
  });

  // -----------------------------------------------------------------------
  // 3. Sample Data
  // -----------------------------------------------------------------------

  var CHEVRON_SVG = '<svg viewBox="0 0 12 12" aria-hidden="true"><polyline points="2 4 6 8 10 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  var defaultLinks = [
    {
      label: 'Produkte',
      href: '#',
      description: 'Plattform-Bausteine f\u00fcr Intranet, App und Magazin.',
      children: [
        { label: 'Social Intranet', href: '#', description: 'News, Communities und Knowledge Hubs.' },
        { label: 'Mitarbeiter App', href: '#', description: 'Mobile Kommunikation f\u00fcr alle Teams.' },
        { label: 'Magazin', href: '#', description: 'Editorial Content und Storytelling.' }
      ]
    },
    {
      label: 'Services',
      href: '#',
      description: 'Einf\u00fchrung, Support und langfristiger Erfolg.',
      children: [
        { label: 'Einf\u00fchrungsberatung', href: '#', description: 'Strategie, Rollout und Enablement.' },
        { label: 'Support', href: '#', description: 'Schnelle Hilfe mit klaren SLAs.' },
        { label: 'Customer Success', href: '#', description: 'Adoption, KPIs und Wachstum.' }
      ]
    },
    { label: 'Kunden', href: '#' },
    { label: 'News', href: '#' },
    { label: '\u00dcber uns', href: '#' }
  ];

  var simpleLinks = [
    { label: 'Startseite', href: '#' },
    { label: 'Produkte', href: '#' },
    { label: 'Services', href: '#' },
    { label: 'Kunden', href: '#' },
    { label: 'Kontakt', href: '#' }
  ];

  // -----------------------------------------------------------------------
  // 4. buildNavigationMenu — Markup nach Recipe 3.0.0 (WAI-ARIA
  //    Disclosure-Navigation, Entscheidung 03.10.2026). Das Verhalten kommt
  //    aus neo-behaviors (../packages/neo-behaviors/dist/neo-behaviors.js),
  //    dieselbe Quelle wie Drupal und Theme-Konfigurator.
  // -----------------------------------------------------------------------

  var panelNummer = 0;

  function createEl(tag, className, text) {
    var el = document.createElement(tag);
    if (className) el.className = className;
    if (text) el.textContent = text;
    return el;
  }

  function buildNavigationMenu(links) {
    var menuNav = createEl('nav', 'nc-navigation-menu');
    menuNav.setAttribute('aria-label', 'Hauptnavigation');
    menuNav.dataset.trigger = 'hover';
    menuNav.style.display = 'flex'; // Override responsive hide for docs

    var list = createEl('ul', 'nc-navigation-menu__list');

    var indicator = createEl('div', 'nc-navigation-menu__indicator');
    indicator.dataset.state = 'hidden';
    indicator.appendChild(createEl('div', 'nc-navigation-menu__indicator-arrow'));

    links.forEach(function (link) {
      var li = createEl('li', 'nc-navigation-menu__item');

      if (link.children && link.children.length) {
        var id = 'docs-navigation-menu-panel-' + (++panelNummer);
        var trigger = createEl('button', 'nc-navigation-menu__trigger');
        trigger.type = 'button';
        trigger.setAttribute('aria-expanded', 'false');
        trigger.setAttribute('aria-controls', id);

        var chevron = createEl('span', 'nc-navigation-menu__trigger-icon');
        chevron.innerHTML = CHEVRON_SVG;
        trigger.append(createEl('span', '', link.label), chevron);

        var content = createEl('div', 'nc-navigation-menu__content nc-navigation-menu__content--two-col');
        content.id = id;
        content.hidden = true;

        var contentGrid = createEl('div', 'nc-navigation-menu__content-grid');

        var calloutsArea = createEl('div', 'nc-navigation-menu__callouts-area');
        var callout = createEl('a', 'nc-navigation-menu__callout');
        callout.href = link.href;
        callout.append(
          createEl('div', 'nc-navigation-menu__callout-title', link.label),
          createEl('p', 'nc-navigation-menu__callout-desc', link.description || '')
        );
        calloutsArea.appendChild(callout);

        var linksArea = createEl('div', 'nc-navigation-menu__links-area');
        link.children.forEach(function (child) {
          var childLink = createEl('a', 'nc-navigation-menu__link');
          childLink.href = child.href;
          childLink.appendChild(createEl('div', 'nc-navigation-menu__link-title', child.label));
          if (child.description) childLink.appendChild(createEl('p', 'nc-navigation-menu__link-desc', child.description));
          linksArea.appendChild(childLink);
        });

        contentGrid.append(calloutsArea, linksArea);
        content.appendChild(contentGrid);
        li.append(trigger, content);
      } else {
        var a = createEl('a', 'nc-navigation-menu__link--top');
        a.href = link.href;
        a.textContent = link.label;
        li.appendChild(a);
      }

      list.appendChild(li);
    });

    menuNav.append(list, indicator);
    return menuNav;
  }

  /** Verhalten aus neo-behaviors binden (falls geladen). */
  function binde(bereich) {
    if (window.NeoBehaviors) window.NeoBehaviors.anbinden(bereich, ['navigation-menu']);
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

    // Clear & rebuild
    if (window.NeoBehaviors) window.NeoBehaviors.abbinden(preview);
    preview.innerHTML = '';
    var links = variant === 'simple' ? simpleLinks : defaultLinks;
    var navMenu = buildNavigationMenu(links);
    preview.appendChild(navMenu);
    binde(preview);

    // Update code output
    if (codeOutput) {
      var nr = 0;
      codeOutput.textContent = '<nav class="nc-navigation-menu" aria-label="Hauptnavigation" data-trigger="hover">\n'
        + '  <ul class="nc-navigation-menu__list">\n'
        + links.map(function (link) {
            if (link.children && link.children.length) {
              nr += 1;
              return '    <li class="nc-navigation-menu__item">\n'
                + '      <button type="button" class="nc-navigation-menu__trigger" aria-expanded="false" aria-controls="nav-panel-' + nr + '">...</button>\n'
                + '      <div class="nc-navigation-menu__content nc-navigation-menu__content--two-col" id="nav-panel-' + nr + '" hidden>...</div>\n'
                + '    </li>';
            }
            return '    <li class="nc-navigation-menu__item">\n'
              + '      <a class="nc-navigation-menu__link--top" href="' + link.href + '">' + link.label + '</a>\n'
              + '    </li>';
          }).join('\n')
        + '\n  </ul>\n'
        + '  <div class="nc-navigation-menu__indicator" data-state="hidden">...</div>\n'
        + '</nav>';
    }
  }

  themeSelect.addEventListener('change', updateStage);
  variantSelect.addEventListener('change', updateStage);

  // Initial render
  updateStage();

  // -----------------------------------------------------------------------
  // 6. Showcase Sections
  // -----------------------------------------------------------------------

  var showcaseDefault = document.getElementById('showcase-default');
  if (showcaseDefault) {
    showcaseDefault.appendChild(buildNavigationMenu(defaultLinks));
    binde(showcaseDefault);
  }

  var showcaseSimple = document.getElementById('showcase-simple');
  if (showcaseSimple) {
    showcaseSimple.appendChild(buildNavigationMenu(simpleLinks));
    binde(showcaseSimple);
  }

})();
