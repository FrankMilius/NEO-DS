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
  // 4. buildNavigationMenu (standalone copy for docs)
  // -----------------------------------------------------------------------

  function createEl(tag, className, text) {
    var el = document.createElement(tag);
    if (className) el.className = className;
    if (text) el.textContent = text;
    return el;
  }

  function buildNavigationMenu(links) {
    var menuNav = createEl('nav', 'nc-navigation-menu');
    menuNav.setAttribute('aria-label', 'Hauptnavigation');
    menuNav.style.display = 'flex'; // Override responsive hide for docs

    var list = createEl('ul', 'nc-navigation-menu__list');
    list.setAttribute('role', 'menubar');

    var viewportWrapper = createEl('div', 'nc-navigation-menu__viewport-wrapper');
    var viewport = createEl('div', 'nc-navigation-menu__viewport');
    viewport.dataset.state = 'closed';
    viewportWrapper.appendChild(viewport);

    var indicator = createEl('div', 'nc-navigation-menu__indicator');
    indicator.dataset.state = 'hidden';
    var indicatorArrow = createEl('div', 'nc-navigation-menu__indicator-arrow');
    indicator.appendChild(indicatorArrow);

    var activeItem = null;
    var closeTimeout = null;

    function openItem(item, content, trigger) {
      if (closeTimeout) { clearTimeout(closeTimeout); closeTimeout = null; }

      var items = Array.from(list.children);
      var prevIndex = activeItem ? items.indexOf(activeItem) : -1;
      var nextIndex = items.indexOf(item);

      if (activeItem && activeItem !== item) {
        var prevContent = activeItem.querySelector('.nc-navigation-menu__content');
        var prevTrigger = activeItem.querySelector('.nc-navigation-menu__trigger');
        if (prevContent) {
          prevContent.dataset.state = 'closed';
          prevContent.dataset.motion = prevIndex < nextIndex ? 'to-start' : 'to-end';
        }
        if (prevTrigger) prevTrigger.dataset.state = 'closed';
      }

      activeItem = item;
      trigger.dataset.state = 'open';
      content.dataset.state = 'open';
      content.dataset.motion = prevIndex >= 0
        ? (prevIndex < nextIndex ? 'from-end' : 'from-start')
        : '';

      viewport.dataset.state = 'open';
      viewport.innerHTML = '';
      viewport.appendChild(content.cloneNode(true));

      var contentWidth = content.offsetWidth || 500;
      viewport.style.width = contentWidth + 'px';

      var triggerRect = trigger.getBoundingClientRect();
      var navRect = menuNav.getBoundingClientRect();
      indicator.dataset.state = 'visible';
      indicator.style.left = (triggerRect.left - navRect.left + triggerRect.width / 2 - 5) + 'px';
      indicator.style.width = '10px';
    }

    function closeAll() {
      if (activeItem) {
        var prevContent = activeItem.querySelector('.nc-navigation-menu__content');
        var prevTrigger = activeItem.querySelector('.nc-navigation-menu__trigger');
        if (prevContent) prevContent.dataset.state = 'closed';
        if (prevTrigger) prevTrigger.dataset.state = 'closed';
      }
      activeItem = null;
      viewport.dataset.state = 'closed';
      indicator.dataset.state = 'hidden';
    }

    function scheduleClose() {
      closeTimeout = setTimeout(closeAll, 150);
    }

    function cancelClose() {
      if (closeTimeout) { clearTimeout(closeTimeout); closeTimeout = null; }
    }

    links.forEach(function (link) {
      var li = createEl('li', 'nc-navigation-menu__item');
      li.setAttribute('role', 'none');

      if (link.children && link.children.length) {
        var trigger = createEl('button', 'nc-navigation-menu__trigger');
        trigger.type = 'button';
        trigger.setAttribute('role', 'menuitem');
        trigger.setAttribute('aria-haspopup', 'true');
        trigger.setAttribute('aria-expanded', 'false');
        trigger.dataset.state = 'closed';

        var labelSpan = createEl('span', '', link.label);
        var chevron = createEl('span', 'nc-navigation-menu__trigger-icon');
        chevron.innerHTML = CHEVRON_SVG;
        trigger.append(labelSpan, chevron);

        var content = createEl('div', 'nc-navigation-menu__content nc-navigation-menu__content--two-col');
        content.dataset.state = 'closed';
        content.setAttribute('role', 'menu');

        var contentGrid = createEl('div', 'nc-navigation-menu__content-grid');

        var callout = createEl('a', 'nc-navigation-menu__callout');
        callout.href = link.href;
        var calloutTitle = createEl('div', 'nc-navigation-menu__callout-title', link.label);
        var calloutDesc = createEl('p', 'nc-navigation-menu__callout-desc', link.description || '');
        callout.append(calloutTitle, calloutDesc);

        var linksGrid = createEl('div', 'nc-navigation-menu__content-grid');
        link.children.forEach(function (child) {
          var childLink = createEl('a', 'nc-navigation-menu__link');
          childLink.href = child.href;
          childLink.setAttribute('role', 'menuitem');
          var title = createEl('div', 'nc-navigation-menu__link-title', child.label);
          childLink.appendChild(title);
          if (child.description) {
            var desc = createEl('p', 'nc-navigation-menu__link-desc', child.description);
            childLink.appendChild(desc);
          }
          linksGrid.appendChild(childLink);
        });

        contentGrid.append(callout, linksGrid);
        content.appendChild(contentGrid);

        li.addEventListener('mouseenter', function () { openItem(li, content, trigger); });
        li.addEventListener('mouseleave', scheduleClose);
        trigger.addEventListener('click', function () {
          if (trigger.dataset.state === 'open') { closeAll(); }
          else { openItem(li, content, trigger); }
        });
        trigger.addEventListener('keydown', function (e) {
          if (e.key === 'Escape') { closeAll(); trigger.focus(); }
        });

        li.append(trigger, content);
      } else {
        var a = createEl('a', 'nc-navigation-menu__link--top');
        a.href = link.href;
        a.setAttribute('role', 'menuitem');
        a.textContent = link.label;
        li.appendChild(a);
      }

      list.appendChild(li);
    });

    viewportWrapper.addEventListener('mouseenter', cancelClose);
    viewportWrapper.addEventListener('mouseleave', scheduleClose);

    document.addEventListener('click', function (event) {
      if (!menuNav.contains(event.target)) closeAll();
    });

    menuNav.append(list, indicator, viewportWrapper);
    return menuNav;
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
    preview.innerHTML = '';
    var links = variant === 'simple' ? simpleLinks : defaultLinks;
    var navMenu = buildNavigationMenu(links);
    preview.appendChild(navMenu);

    // Update code output
    if (codeOutput) {
      codeOutput.textContent = '<nav class="nc-navigation-menu" aria-label="Hauptnavigation">\n'
        + '  <ul class="nc-navigation-menu__list" role="menubar">\n'
        + links.map(function (link) {
            if (link.children && link.children.length) {
              return '    <li class="nc-navigation-menu__item" role="none">\n'
                + '      <button class="nc-navigation-menu__trigger" data-state="closed">...</button>\n'
                + '      <div class="nc-navigation-menu__content nc-navigation-menu__content--two-col" data-state="closed">...</div>\n'
                + '    </li>';
            }
            return '    <li class="nc-navigation-menu__item" role="none">\n'
              + '      <a class="nc-navigation-menu__link--top" href="' + link.href + '">' + link.label + '</a>\n'
              + '    </li>';
          }).join('\n')
        + '\n  </ul>\n'
        + '  <div class="nc-navigation-menu__indicator" data-state="hidden">...</div>\n'
        + '  <div class="nc-navigation-menu__viewport-wrapper">...</div>\n'
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
  }

  var showcaseSimple = document.getElementById('showcase-simple');
  if (showcaseSimple) {
    showcaseSimple.appendChild(buildNavigationMenu(simpleLinks));
  }

})();
