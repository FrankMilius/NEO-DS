// ==========================================================================
// Tabs Docs — Tab Navigation + Staging Area + 8 Showcase Demos
// ==========================================================================

(function () {
  'use strict';

  // -----------------------------------------------------------------------
  // 1. Docs-Tab Navigation (page-level tabs: Benutzung / Style / API / A11y)
  // -----------------------------------------------------------------------

  var tabList = document.querySelector('.docs-tabs__list');
  var triggers = tabList ? tabList.querySelectorAll('.docs-tabs__trigger') : [];
  var panels = document.querySelectorAll('.docs-tabs__panel');

  function activateDocsTab(trigger) {
    triggers.forEach(function (t) { t.setAttribute('aria-selected', 'false'); });
    panels.forEach(function (p) { p.classList.remove('is-active'); });
    trigger.setAttribute('aria-selected', 'true');
    var panelId = trigger.getAttribute('aria-controls');
    var panel = document.getElementById(panelId);
    if (panel) panel.classList.add('is-active');
  }

  triggers.forEach(function (trigger) {
    trigger.addEventListener('click', function () { activateDocsTab(trigger); });
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
        activateDocsTab(triggers[nextIndex]);
      }
    });
  });

  // -----------------------------------------------------------------------
  // Sidebar toggle (mobile)
  // -----------------------------------------------------------------------

  var sidebarOpen = document.getElementById('docs-sidebar-open');
  var sidebarClose = document.getElementById('docs-sidebar-close');
  var sidebar = document.getElementById('docs-sidebar');
  var sidebarOverlay = document.getElementById('docs-sidebar-overlay');

  function openSidebar() {
    if (sidebar) sidebar.classList.add('is-open');
    if (sidebarOverlay) sidebarOverlay.classList.add('is-visible');
  }
  function closeSidebar() {
    if (sidebar) sidebar.classList.remove('is-open');
    if (sidebarOverlay) sidebarOverlay.classList.remove('is-visible');
  }
  if (sidebarOpen) sidebarOpen.addEventListener('click', openSidebar);
  if (sidebarClose) sidebarClose.addEventListener('click', closeSidebar);
  if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeSidebar);

  // Sidebar sub-toggles
  document.querySelectorAll('.docs-sidebar__toggle, .docs-sidebar__subtoggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      var targetId = btn.getAttribute('aria-controls');
      var target = document.getElementById(targetId);
      if (target) target.style.display = expanded ? 'none' : '';
    });
  });

  // -----------------------------------------------------------------------
  // 2. SVG Icon Constants (simplified inline SVGs from the icon set)
  // -----------------------------------------------------------------------

  var HOME_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="5 12 3 12 12 3 21 12 19 12"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/><path d="M9 21v-6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v6"/></svg>';

  var USER_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="7" r="4"/><path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/></svg>';

  var SETTINGS_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="14" cy="6" r="2"/><line x1="4" y1="6" x2="12" y2="6"/><line x1="16" y1="6" x2="20" y2="6"/><circle cx="8" cy="12" r="2"/><line x1="4" y1="12" x2="6" y2="12"/><line x1="10" y1="12" x2="20" y2="12"/><circle cx="17" cy="18" r="2"/><line x1="4" y1="18" x2="15" y2="18"/><line x1="19" y1="18" x2="20" y2="18"/></svg>';

  var SEARCH_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="10" r="7"/><line x1="21" y1="21" x2="15" y2="15"/></svg>';

  var BELL_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 5a2 2 0 0 1 4 0c2.34 1.11 3.88 3.41 4 6v3c.15 1.26.89 2.37 2 3H4c1.11-.63 1.85-1.74 2-3v-3c.12-2.59 1.66-4.89 4-6"/><path d="M9 17v1a3 3 0 0 0 6 0v-1"/></svg>';

  var STAR_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';

  var MAIL_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="22 7 12 13 2 7"/></svg>';

  var HEART_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';

  var CHEVRON_LEFT_SVG = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="10 4 6 8 10 12"/></svg>';

  var CHEVRON_RIGHT_SVG = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 4 10 8 6 12"/></svg>';

  // -----------------------------------------------------------------------
  // 3. Helper: create element
  // -----------------------------------------------------------------------

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  // -----------------------------------------------------------------------
  // 4. Sample Data
  // -----------------------------------------------------------------------

  var BASIC_TABS = [
    { label: '\u00dcbersicht', content: '<p style="padding: var(--fnd-spacing-04); color: var(--fnd-color-text-mid);">\u00dcbersicht-Inhalt: Willkommen bei der Demo. Hier finden Sie eine \u00dcbersicht der wichtigsten Funktionen.</p>' },
    { label: 'Funktionen', content: '<p style="padding: var(--fnd-spacing-04); color: var(--fnd-color-text-mid);">Funktionen-Inhalt: Alle verf\u00fcgbaren Features auf einen Blick.</p>' },
    { label: 'Einstellungen', content: '<p style="padding: var(--fnd-spacing-04); color: var(--fnd-color-text-mid);">Einstellungen-Inhalt: Passen Sie die Konfiguration nach Ihren W\u00fcnschen an.</p>' }
  ];

  var ICON_TABS = [
    { label: 'Startseite', icon: HOME_SVG, content: '<p style="padding: var(--fnd-spacing-04); color: var(--fnd-color-text-mid);">Startseite mit Home-Icon.</p>' },
    { label: 'Profil', icon: USER_SVG, content: '<p style="padding: var(--fnd-spacing-04); color: var(--fnd-color-text-mid);">Benutzerprofil mit User-Icon.</p>' },
    { label: 'Einstellungen', icon: SETTINGS_SVG, content: '<p style="padding: var(--fnd-spacing-04); color: var(--fnd-color-text-mid);">Einstellungen mit Settings-Icon.</p>' }
  ];

  var ICON_ONLY_TABS = [
    { label: 'Benachrichtigungen', icon: BELL_SVG, iconOnly: true, content: '<p style="padding: var(--fnd-spacing-04); color: var(--fnd-color-text-mid);">Benachrichtigungen-Panel.</p>' },
    { label: 'Suche', icon: SEARCH_SVG, iconOnly: true, content: '<p style="padding: var(--fnd-spacing-04); color: var(--fnd-color-text-mid);">Such-Panel.</p>' },
    { label: 'Einstellungen', icon: SETTINGS_SVG, iconOnly: true, content: '<p style="padding: var(--fnd-spacing-04); color: var(--fnd-color-text-mid);">Einstellungen-Panel.</p>' }
  ];

  // Icon-only with Tooltip data (5 Tabs fuer mehr Vielfalt)
  var TOOLTIP_TABS = [
    { label: 'Startseite', icon: HOME_SVG, iconOnly: true, tooltip: true, content: '<p style="padding: var(--fnd-spacing-04); color: var(--fnd-color-text-mid);">Startseite-Panel.</p>' },
    { label: 'Profil', icon: USER_SVG, iconOnly: true, tooltip: true, content: '<p style="padding: var(--fnd-spacing-04); color: var(--fnd-color-text-mid);">Profil-Panel.</p>' },
    { label: 'Suche', icon: SEARCH_SVG, iconOnly: true, tooltip: true, content: '<p style="padding: var(--fnd-spacing-04); color: var(--fnd-color-text-mid);">Such-Panel.</p>' },
    { label: 'Benachrichtigungen', icon: BELL_SVG, iconOnly: true, tooltip: true, content: '<p style="padding: var(--fnd-spacing-04); color: var(--fnd-color-text-mid);">Benachrichtigungen-Panel.</p>' },
    { label: 'Einstellungen', icon: SETTINGS_SVG, iconOnly: true, tooltip: true, content: '<p style="padding: var(--fnd-spacing-04); color: var(--fnd-color-text-mid);">Einstellungen-Panel.</p>' }
  ];

  // Many tabs for overflow scroll demo
  var OVERFLOW_TABS = [
    { label: 'Startseite', content: '<p style="padding: var(--fnd-spacing-04); color: var(--fnd-color-text-mid);">Startseite-Inhalt.</p>' },
    { label: 'Funktionen', content: '<p style="padding: var(--fnd-spacing-04); color: var(--fnd-color-text-mid);">Funktionen-Inhalt.</p>' },
    { label: 'Einstellungen', content: '<p style="padding: var(--fnd-spacing-04); color: var(--fnd-color-text-mid);">Einstellungen-Inhalt.</p>' },
    { label: 'Benachrichtigungen', content: '<p style="padding: var(--fnd-spacing-04); color: var(--fnd-color-text-mid);">Benachrichtigungen-Inhalt.</p>' },
    { label: 'Statistiken', content: '<p style="padding: var(--fnd-spacing-04); color: var(--fnd-color-text-mid);">Statistiken-Inhalt.</p>' },
    { label: 'Berichte', content: '<p style="padding: var(--fnd-spacing-04); color: var(--fnd-color-text-mid);">Berichte-Inhalt.</p>' },
    { label: 'Favoriten', content: '<p style="padding: var(--fnd-spacing-04); color: var(--fnd-color-text-mid);">Favoriten-Inhalt.</p>' },
    { label: 'Verlauf', content: '<p style="padding: var(--fnd-spacing-04); color: var(--fnd-color-text-mid);">Verlauf-Inhalt.</p>' },
    { label: 'Downloads', content: '<p style="padding: var(--fnd-spacing-04); color: var(--fnd-color-text-mid);">Downloads-Inhalt.</p>' },
    { label: 'Support', content: '<p style="padding: var(--fnd-spacing-04); color: var(--fnd-color-text-mid);">Support-Inhalt.</p>' },
    { label: 'Profil', content: '<p style="padding: var(--fnd-spacing-04); color: var(--fnd-color-text-mid);">Profil-Inhalt.</p>' },
    { label: 'Sicherheit', content: '<p style="padding: var(--fnd-spacing-04); color: var(--fnd-color-text-mid);">Sicherheit-Inhalt.</p>' }
  ];

  // -----------------------------------------------------------------------
  // 5. buildTabs(options) — Create Tab DOM structure
  // -----------------------------------------------------------------------

  var tabIdCounter = 0;

  function buildTabs(options) {
    var variant = options.variant || 'line';
    var orientation = options.orientation || 'horizontal';
    var size = options.size || 'md';
    var tabs = options.tabs || BASIC_TABS;
    var fullWidth = options.fullWidth || false;
    var scrollable = options.scrollable || false;
    var id = options.id || ('tabs-demo-' + (++tabIdCounter));

    // Build class list
    var classes = ['nc-tabs', 'nc-tabs--' + variant];
    if (orientation === 'vertical') classes.push('nc-tabs--vertical');
    if (size !== 'md') classes.push('nc-tabs--' + size);
    if (fullWidth && !scrollable) classes.push('nc-tabs--full-width');
    if (scrollable) classes.push('nc-tabs--scrollable');

    // Wrapper
    var wrapper = el('div', classes.join(' '));

    // Tablist
    var list = el('div', 'nc-tabs__list');
    list.setAttribute('role', 'tablist');
    list.setAttribute('aria-label', 'Demo Tabs');
    if (orientation === 'vertical') {
      list.setAttribute('aria-orientation', 'vertical');
    }

    // Triggers + Panels
    var panelsArr = [];

    tabs.forEach(function (tab, i) {
      var triggerId = id + '-tab-' + i;
      var panelId = id + '-panel-' + i;
      var tooltipId = id + '-tooltip-' + i;

      // Trigger
      var triggerClasses = 'nc-tabs__trigger';
      if (tab.iconOnly) triggerClasses += ' nc-tabs__trigger--icon-only';

      var trigger = el('button', triggerClasses);
      trigger.setAttribute('role', 'tab');
      trigger.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      trigger.setAttribute('aria-controls', panelId);
      trigger.setAttribute('id', triggerId);
      trigger.setAttribute('tabindex', i === 0 ? '0' : '-1');
      trigger.type = 'button';

      if (tab.iconOnly) {
        trigger.setAttribute('aria-label', tab.label);
      }

      // For tooltip variant: add aria-describedby
      if (tab.tooltip) {
        trigger.setAttribute('aria-describedby', tooltipId);
      }

      // Icon
      if (tab.icon) {
        var iconSpan = el('span', 'nc-tabs__trigger-icon');
        iconSpan.innerHTML = tab.icon;
        trigger.appendChild(iconSpan);
      }

      // Label
      var labelSpan = el('span', 'nc-tabs__trigger-label', tab.label);
      trigger.appendChild(labelSpan);

      // Wrap in tooltip if needed
      if (tab.tooltip) {
        var tooltipWrapper = el('span', 'nc-tooltip nc-tooltip--bottom');
        tooltipWrapper.appendChild(trigger);

        var tooltipContent = el('span', 'nc-tooltip__content');
        tooltipContent.setAttribute('role', 'tooltip');
        tooltipContent.setAttribute('id', tooltipId);
        tooltipContent.textContent = tab.label;

        var tooltipArrow = el('span', 'nc-tooltip__arrow');
        tooltipContent.appendChild(tooltipArrow);
        tooltipWrapper.appendChild(tooltipContent);

        list.appendChild(tooltipWrapper);
      } else {
        list.appendChild(trigger);
      }

      // Panel
      var panel = el('div', 'nc-tabs__panel' + (i === 0 ? ' is-active' : ''));
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('id', panelId);
      panel.setAttribute('aria-labelledby', triggerId);
      if (tab.content) {
        panel.innerHTML = tab.content;
      }
      panelsArr.push(panel);
    });

    // Scrollable: wrap list in scroll container with buttons
    if (scrollable) {
      var scrollContainer = el('div', 'nc-tabs__scroll-container');

      var btnStart = el('button', 'nc-tabs__scroll-btn nc-tabs__scroll-btn--start');
      btnStart.type = 'button';
      btnStart.setAttribute('aria-label', 'Tabs nach links scrollen');
      btnStart.setAttribute('tabindex', '-1');
      btnStart.innerHTML = CHEVRON_LEFT_SVG;

      var btnEnd = el('button', 'nc-tabs__scroll-btn nc-tabs__scroll-btn--end');
      btnEnd.type = 'button';
      btnEnd.setAttribute('aria-label', 'Tabs nach rechts scrollen');
      btnEnd.setAttribute('tabindex', '-1');
      btnEnd.innerHTML = CHEVRON_RIGHT_SVG;

      scrollContainer.appendChild(btnStart);
      scrollContainer.appendChild(list);
      scrollContainer.appendChild(btnEnd);
      wrapper.appendChild(scrollContainer);
    } else {
      wrapper.appendChild(list);
    }

    panelsArr.forEach(function (p) { wrapper.appendChild(p); });

    return wrapper;
  }

  // -----------------------------------------------------------------------
  // 6. initTabs(container) — Click + Keyboard Navigation
  // -----------------------------------------------------------------------

  function initTabs(container) {
    if (!container) return;

    var tablist = container.querySelector('[role="tablist"]');
    if (!tablist) return;

    var tabTriggers = tablist.querySelectorAll('[role="tab"]');
    var tabPanels = container.querySelectorAll('[role="tabpanel"]');
    var isVertical = tablist.getAttribute('aria-orientation') === 'vertical';

    function activate(trigger) {
      // Deactivate all
      tabTriggers.forEach(function (t) {
        t.setAttribute('aria-selected', 'false');
        t.setAttribute('tabindex', '-1');
      });
      tabPanels.forEach(function (p) { p.classList.remove('is-active'); });

      // Activate target
      trigger.setAttribute('aria-selected', 'true');
      trigger.setAttribute('tabindex', '0');
      trigger.focus();

      var panelId = trigger.getAttribute('aria-controls');
      var panel = document.getElementById(panelId);
      if (panel) panel.classList.add('is-active');

      // Scroll into view if scrollable
      if (container.classList.contains('nc-tabs--scrollable')) {
        scrollTriggerIntoView(container, trigger);
      }
    }

    tabTriggers.forEach(function (trigger) {
      // Skip disabled
      if (trigger.disabled || trigger.getAttribute('aria-disabled') === 'true') return;

      trigger.addEventListener('click', function () {
        if (!trigger.disabled && trigger.getAttribute('aria-disabled') !== 'true') {
          activate(trigger);
        }
      });

      trigger.addEventListener('keydown', function (e) {
        var enabledTriggers = Array.prototype.filter.call(tabTriggers, function (t) {
          return !t.disabled && t.getAttribute('aria-disabled') !== 'true';
        });
        var currentIndex = enabledTriggers.indexOf(trigger);
        if (currentIndex < 0) return;

        var nextIndex = -1;
        var nextKey = isVertical ? 'ArrowDown' : 'ArrowRight';
        var prevKey = isVertical ? 'ArrowUp' : 'ArrowLeft';

        if (e.key === nextKey) {
          nextIndex = (currentIndex + 1) % enabledTriggers.length;
        } else if (e.key === prevKey) {
          nextIndex = (currentIndex - 1 + enabledTriggers.length) % enabledTriggers.length;
        } else if (e.key === 'Home') {
          nextIndex = 0;
        } else if (e.key === 'End') {
          nextIndex = enabledTriggers.length - 1;
        }

        if (nextIndex >= 0) {
          e.preventDefault();
          activate(enabledTriggers[nextIndex]);
        }
      });
    });
  }

  // -----------------------------------------------------------------------
  // 6b. Scroll Trigger into view (for scrollable tabs)
  // -----------------------------------------------------------------------

  function scrollTriggerIntoView(container, trigger) {
    var list = container.querySelector('.nc-tabs__list');
    if (!list) return;
    var triggerEl = trigger.closest('.nc-tooltip') || trigger;
    var listRect = list.getBoundingClientRect();
    var triggerRect = triggerEl.getBoundingClientRect();

    if (triggerRect.left < listRect.left) {
      list.scrollLeft -= (listRect.left - triggerRect.left + 16);
    } else if (triggerRect.right > listRect.right) {
      list.scrollLeft += (triggerRect.right - listRect.right + 16);
    }
  }

  // -----------------------------------------------------------------------
  // 6c. initScrollable(container) — Scroll button logic
  // -----------------------------------------------------------------------

  function initScrollable(container) {
    if (!container || !container.classList.contains('nc-tabs--scrollable')) return;

    var scrollContainer = container.querySelector('.nc-tabs__scroll-container');
    if (!scrollContainer) return;

    var list = scrollContainer.querySelector('.nc-tabs__list');
    var btnStart = scrollContainer.querySelector('.nc-tabs__scroll-btn--start');
    var btnEnd = scrollContainer.querySelector('.nc-tabs__scroll-btn--end');
    if (!list || !btnStart || !btnEnd) return;

    var scrollStep = 150;

    function updateButtons() {
      var scrollLeft = Math.round(list.scrollLeft);
      var maxScroll = list.scrollWidth - list.clientWidth;

      btnStart.disabled = scrollLeft <= 0;
      btnEnd.disabled = scrollLeft >= maxScroll - 1;
    }

    btnStart.addEventListener('click', function () {
      list.scrollLeft -= scrollStep;
    });

    btnEnd.addEventListener('click', function () {
      list.scrollLeft += scrollStep;
    });

    list.addEventListener('scroll', updateButtons);

    // Use ResizeObserver if available for dynamic updates
    if (typeof ResizeObserver !== 'undefined') {
      var ro = new ResizeObserver(updateButtons);
      ro.observe(list);
    }

    // Initial state
    updateButtons();
  }

  // -----------------------------------------------------------------------
  // 7. Code Snippet Generator
  // -----------------------------------------------------------------------

  function generateCode(variant, orientation, size, mode) {
    var cls = 'nc-tabs nc-tabs--' + variant;
    if (orientation === 'vertical') cls += ' nc-tabs--vertical';
    if (size !== 'md') cls += ' nc-tabs--' + size;

    var ariaOrient = orientation === 'vertical' ? '\n       aria-orientation="vertical"' : '';
    var triggerContent = '';

    if (mode === 'tooltip') {
      triggerContent =
        '    <span class="nc-tooltip nc-tooltip--bottom">\n' +
        '      <button class="nc-tabs__trigger nc-tabs__trigger--icon-only"\n' +
        '              role="tab" aria-label="Startseite"\n' +
        '              aria-describedby="tip-1"\n' +
        '              aria-selected="true" aria-controls="panel-1"\n' +
        '              id="tab-1" tabindex="0">\n' +
        '        <span class="nc-tabs__trigger-icon">\n' +
        '          <svg><!-- home.svg --></svg>\n' +
        '        </span>\n' +
        '        <span class="nc-tabs__trigger-label">Startseite</span>\n' +
        '      </button>\n' +
        '      <span class="nc-tooltip__content" role="tooltip" id="tip-1">\n' +
        '        Startseite\n' +
        '        <span class="nc-tooltip__arrow"></span>\n' +
        '      </span>\n' +
        '    </span>';
    } else if (mode === 'scrollable') {
      cls += ' nc-tabs--scrollable';
      return '<div class="' + cls + '">\n' +
        '  <div class="nc-tabs__scroll-container">\n' +
        '    <button class="nc-tabs__scroll-btn nc-tabs__scroll-btn--start"\n' +
        '            aria-label="Tabs nach links scrollen" tabindex="-1">\n' +
        '      <svg viewBox="0 0 16 16"><polyline points="10 4 6 8 10 12"/></svg>\n' +
        '    </button>\n' +
        '    <div class="nc-tabs__list" role="tablist" aria-label="...">\n' +
        '      <button class="nc-tabs__trigger" role="tab" ...>Tab 1</button>\n' +
        '      <button class="nc-tabs__trigger" role="tab" ...>Tab 2</button>\n' +
        '      <!-- ... viele Tabs ... -->\n' +
        '    </div>\n' +
        '    <button class="nc-tabs__scroll-btn nc-tabs__scroll-btn--end"\n' +
        '            aria-label="Tabs nach rechts scrollen" tabindex="-1">\n' +
        '      <svg viewBox="0 0 16 16"><polyline points="6 4 10 8 6 12"/></svg>\n' +
        '    </button>\n' +
        '  </div>\n' +
        '  <div class="nc-tabs__panel is-active" role="tabpanel" ...>Inhalt</div>\n' +
        '</div>';
    } else if (mode === 'icons') {
      triggerContent =
        '    <button class="nc-tabs__trigger" role="tab"\n' +
        '            aria-selected="true" aria-controls="panel-1"\n' +
        '            id="tab-1" tabindex="0">\n' +
        '      <span class="nc-tabs__trigger-icon">\n' +
        '        <svg><!-- home.svg --></svg>\n' +
        '      </span>\n' +
        '      <span class="nc-tabs__trigger-label">Startseite</span>\n' +
        '    </button>\n' +
        '    <button class="nc-tabs__trigger" role="tab"\n' +
        '            aria-selected="false" aria-controls="panel-2"\n' +
        '            id="tab-2" tabindex="-1">\n' +
        '      <span class="nc-tabs__trigger-icon">\n' +
        '        <svg><!-- user.svg --></svg>\n' +
        '      </span>\n' +
        '      <span class="nc-tabs__trigger-label">Profil</span>\n' +
        '    </button>';
    } else if (mode === 'icon-only') {
      triggerContent =
        '    <button class="nc-tabs__trigger nc-tabs__trigger--icon-only"\n' +
        '            role="tab" aria-label="Benachrichtigungen"\n' +
        '            aria-selected="true" aria-controls="panel-1"\n' +
        '            id="tab-1" tabindex="0">\n' +
        '      <span class="nc-tabs__trigger-icon">\n' +
        '        <svg><!-- bell.svg --></svg>\n' +
        '      </span>\n' +
        '      <span class="nc-tabs__trigger-label">Benachrichtigungen</span>\n' +
        '    </button>\n' +
        '    <button class="nc-tabs__trigger nc-tabs__trigger--icon-only"\n' +
        '            role="tab" aria-label="Suche"\n' +
        '            aria-selected="false" aria-controls="panel-2"\n' +
        '            id="tab-2" tabindex="-1">\n' +
        '      <span class="nc-tabs__trigger-icon">\n' +
        '        <svg><!-- search.svg --></svg>\n' +
        '      </span>\n' +
        '      <span class="nc-tabs__trigger-label">Suche</span>\n' +
        '    </button>';
    } else {
      triggerContent =
        '    <button class="nc-tabs__trigger" role="tab"\n' +
        '            aria-selected="true" aria-controls="panel-1"\n' +
        '            id="tab-1" tabindex="0">\n' +
        '      <span class="nc-tabs__trigger-label">\u00dcbersicht</span>\n' +
        '    </button>\n' +
        '    <button class="nc-tabs__trigger" role="tab"\n' +
        '            aria-selected="false" aria-controls="panel-2"\n' +
        '            id="tab-2" tabindex="-1">\n' +
        '      <span class="nc-tabs__trigger-label">Funktionen</span>\n' +
        '    </button>';
    }

    return '<div class="' + cls + '">\n' +
      '  <div class="nc-tabs__list" role="tablist"\n' +
      '       aria-label="Demo"' + ariaOrient + '>\n' +
      triggerContent + '\n' +
      '  </div>\n' +
      '  <div class="nc-tabs__panel is-active" role="tabpanel"\n' +
      '       id="panel-1" aria-labelledby="tab-1">\n' +
      '    Inhalt 1\n' +
      '  </div>\n' +
      '  <div class="nc-tabs__panel" role="tabpanel"\n' +
      '       id="panel-2" aria-labelledby="tab-2">\n' +
      '    Inhalt 2\n' +
      '  </div>\n' +
      '</div>';
  }

  // -----------------------------------------------------------------------
  // 8. Staging Area
  // -----------------------------------------------------------------------

  var themeSelect       = document.getElementById('stage-theme');
  var variantSelect     = document.getElementById('stage-variant');
  var orientationSelect = document.getElementById('stage-orientation');
  var sizeSelect        = document.getElementById('stage-size');
  var preview           = document.getElementById('stage-preview');
  var codeOutput        = document.getElementById('stage-code');

  if (!preview) return;

  function updateStage() {
    var theme       = themeSelect ? themeSelect.value : 'neo-light-theme';
    var variant     = variantSelect ? variantSelect.value : 'line';
    var orientation = orientationSelect ? orientationSelect.value : 'horizontal';
    var size        = sizeSelect ? sizeSelect.value : 'md';

    // Apply theme
    var themes = ['neo-light-theme', 'neo-dark-theme', 'customer-light-theme', 'customer-dark-theme'];
    themes.forEach(function (t) { preview.classList.remove(t); });
    preview.classList.add(theme);

    // Clear & rebuild
    preview.innerHTML = '';

    var tabsEl = buildTabs({
      variant: variant,
      orientation: orientation,
      size: size,
      tabs: BASIC_TABS,
      id: 'stage'
    });
    preview.appendChild(tabsEl);
    initTabs(tabsEl);

    // Update code output
    if (codeOutput) {
      codeOutput.textContent = generateCode(variant, orientation, size, 'basic');
    }
  }

  if (themeSelect) themeSelect.addEventListener('change', updateStage);
  if (variantSelect) variantSelect.addEventListener('change', updateStage);
  if (orientationSelect) orientationSelect.addEventListener('change', updateStage);
  if (sizeSelect) sizeSelect.addEventListener('change', updateStage);
  updateStage();

  // -----------------------------------------------------------------------
  // 9. Showcase Sections
  // -----------------------------------------------------------------------

  // Showcase 1: Line Tabs (Default)
  var showcaseLine = document.getElementById('showcase-line');
  if (showcaseLine) {
    var t1 = buildTabs({ variant: 'line', tabs: BASIC_TABS, id: 'sc-line' });
    showcaseLine.appendChild(t1);
    initTabs(t1);
  }

  // Showcase 2: Contained Tabs
  var showcaseContained = document.getElementById('showcase-contained');
  if (showcaseContained) {
    var t2 = buildTabs({ variant: 'contained', tabs: BASIC_TABS, id: 'sc-contained' });
    showcaseContained.appendChild(t2);
    initTabs(t2);
  }

  // Showcase 3: Vertical Line Tabs
  var showcaseVertLine = document.getElementById('showcase-vertical-line');
  if (showcaseVertLine) {
    var t3 = buildTabs({ variant: 'line', orientation: 'vertical', tabs: BASIC_TABS, id: 'sc-vert-line' });
    showcaseVertLine.appendChild(t3);
    initTabs(t3);
  }

  // Showcase 4: Vertical Contained Tabs
  var showcaseVertContained = document.getElementById('showcase-vertical-contained');
  if (showcaseVertContained) {
    var t4 = buildTabs({ variant: 'contained', orientation: 'vertical', tabs: BASIC_TABS, id: 'sc-vert-contained' });
    showcaseVertContained.appendChild(t4);
    initTabs(t4);
  }

  // Showcase 5: Tabs mit Icons
  var showcaseIcons = document.getElementById('showcase-icons');
  if (showcaseIcons) {
    // Line with icons
    var label5a = el('p', null, 'Line:');
    label5a.style.cssText = 'margin-bottom: var(--fnd-spacing-02); font-weight: 600; font-size: 0.875rem; color: var(--fnd-color-text-mid);';
    showcaseIcons.appendChild(label5a);
    var t5a = buildTabs({ variant: 'line', tabs: ICON_TABS, id: 'sc-icon-line' });
    showcaseIcons.appendChild(t5a);
    initTabs(t5a);

    var spacer5 = el('div');
    spacer5.style.height = 'var(--fnd-spacing-06)';
    showcaseIcons.appendChild(spacer5);

    // Contained with icons
    var label5b = el('p', null, 'Contained:');
    label5b.style.cssText = 'margin-bottom: var(--fnd-spacing-02); font-weight: 600; font-size: 0.875rem; color: var(--fnd-color-text-mid);';
    showcaseIcons.appendChild(label5b);
    var t5b = buildTabs({ variant: 'contained', tabs: ICON_TABS, id: 'sc-icon-contained' });
    showcaseIcons.appendChild(t5b);
    initTabs(t5b);
  }

  // Showcase 6: Icon-only Tabs (ohne Tooltip — bestehend)
  var showcaseIconOnly = document.getElementById('showcase-icon-only');
  if (showcaseIconOnly) {
    // Line icon-only
    var label6a = el('p', null, 'Line:');
    label6a.style.cssText = 'margin-bottom: var(--fnd-spacing-02); font-weight: 600; font-size: 0.875rem; color: var(--fnd-color-text-mid);';
    showcaseIconOnly.appendChild(label6a);
    var t6a = buildTabs({ variant: 'line', tabs: ICON_ONLY_TABS, id: 'sc-icononly-line' });
    showcaseIconOnly.appendChild(t6a);
    initTabs(t6a);

    var spacer6 = el('div');
    spacer6.style.height = 'var(--fnd-spacing-06)';
    showcaseIconOnly.appendChild(spacer6);

    // Contained icon-only
    var label6b = el('p', null, 'Contained:');
    label6b.style.cssText = 'margin-bottom: var(--fnd-spacing-02); font-weight: 600; font-size: 0.875rem; color: var(--fnd-color-text-mid);';
    showcaseIconOnly.appendChild(label6b);
    var t6b = buildTabs({ variant: 'contained', tabs: ICON_ONLY_TABS, id: 'sc-icononly-contained' });
    showcaseIconOnly.appendChild(t6b);
    initTabs(t6b);
  }

  // Showcase 7: Icon-only with Tooltip (NEW)
  var showcaseTooltip = document.getElementById('showcase-tooltip');
  if (showcaseTooltip) {
    // Horizontal Line + Tooltip
    var label7a = el('p', null, 'Horizontal (Line):');
    label7a.style.cssText = 'margin-bottom: var(--fnd-spacing-02); font-weight: 600; font-size: 0.875rem; color: var(--fnd-color-text-mid);';
    showcaseTooltip.appendChild(label7a);
    var t7a = buildTabs({ variant: 'line', tabs: TOOLTIP_TABS, id: 'sc-tooltip-line' });
    showcaseTooltip.appendChild(t7a);
    initTabs(t7a);

    var spacer7a = el('div');
    spacer7a.style.height = 'var(--fnd-spacing-06)';
    showcaseTooltip.appendChild(spacer7a);

    // Horizontal Contained + Tooltip
    var label7b = el('p', null, 'Horizontal (Contained):');
    label7b.style.cssText = 'margin-bottom: var(--fnd-spacing-02); font-weight: 600; font-size: 0.875rem; color: var(--fnd-color-text-mid);';
    showcaseTooltip.appendChild(label7b);
    var t7b = buildTabs({ variant: 'contained', tabs: TOOLTIP_TABS, id: 'sc-tooltip-contained' });
    showcaseTooltip.appendChild(t7b);
    initTabs(t7b);

    var spacer7b = el('div');
    spacer7b.style.height = 'var(--fnd-spacing-06)';
    showcaseTooltip.appendChild(spacer7b);

    // Vertical Line + Tooltip
    var label7c = el('p', null, 'Vertikal (Line):');
    label7c.style.cssText = 'margin-bottom: var(--fnd-spacing-02); font-weight: 600; font-size: 0.875rem; color: var(--fnd-color-text-mid);';
    showcaseTooltip.appendChild(label7c);
    var t7c = buildTabs({ variant: 'line', orientation: 'vertical', tabs: TOOLTIP_TABS, id: 'sc-tooltip-vert-line' });
    showcaseTooltip.appendChild(t7c);
    initTabs(t7c);

    var spacer7c = el('div');
    spacer7c.style.height = 'var(--fnd-spacing-06)';
    showcaseTooltip.appendChild(spacer7c);

    // Vertical Contained + Tooltip
    var label7d = el('p', null, 'Vertikal (Contained):');
    label7d.style.cssText = 'margin-bottom: var(--fnd-spacing-02); font-weight: 600; font-size: 0.875rem; color: var(--fnd-color-text-mid);';
    showcaseTooltip.appendChild(label7d);
    var t7d = buildTabs({ variant: 'contained', orientation: 'vertical', tabs: TOOLTIP_TABS, id: 'sc-tooltip-vert-contained' });
    showcaseTooltip.appendChild(t7d);
    initTabs(t7d);
  }

  // Showcase 8: Full-Width Overflow Scrollable (NEW)
  var showcaseScrollable = document.getElementById('showcase-scrollable');
  if (showcaseScrollable) {
    // Line scrollable
    var label8a = el('p', null, 'Line:');
    label8a.style.cssText = 'margin-bottom: var(--fnd-spacing-02); font-weight: 600; font-size: 0.875rem; color: var(--fnd-color-text-mid);';
    showcaseScrollable.appendChild(label8a);
    var t8a = buildTabs({ variant: 'line', tabs: OVERFLOW_TABS, scrollable: true, id: 'sc-scroll-line' });
    showcaseScrollable.appendChild(t8a);
    initTabs(t8a);
    initScrollable(t8a);

    var spacer8 = el('div');
    spacer8.style.height = 'var(--fnd-spacing-06)';
    showcaseScrollable.appendChild(spacer8);

    // Contained scrollable
    var label8b = el('p', null, 'Contained:');
    label8b.style.cssText = 'margin-bottom: var(--fnd-spacing-02); font-weight: 600; font-size: 0.875rem; color: var(--fnd-color-text-mid);';
    showcaseScrollable.appendChild(label8b);
    var t8b = buildTabs({ variant: 'contained', tabs: OVERFLOW_TABS, scrollable: true, id: 'sc-scroll-contained' });
    showcaseScrollable.appendChild(t8b);
    initTabs(t8b);
    initScrollable(t8b);
  }

})();
