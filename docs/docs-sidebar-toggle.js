// ==========================================================================
// Docs Sidebar — Desktop Toggle (Collapse / Expand)
// ==========================================================================
// Steuert das Ein-/Ausblenden der Sidebar auf Desktop-Viewports.
// Eingebunden am Ende jeder Docs-Seite via <script src="docs-sidebar-toggle.js">
//
// Verhalten:
//   - Initial: Sidebar sichtbar, Icon = sidebar-open
//   - Klick auf Icon: Sidebar wird ausgeblendet, Icon wechselt zu sidebar-close
//   - Klick auf Icon (sidebar-close): Sidebar wird eingeblendet, Icon wechselt zurueck
//   - Zustand wird in localStorage gespeichert
//   - Auf Mobile (< 960px) wird der bestehende Drawer aus docs-sidebar.js genutzt
//
// Initialisierung wartet auf 'sidebar-loaded' Event vom Sidebar-Loader.
//
// Elemente:
//   #docs-sidebar-open  — Toggle-Button im Header
//   .docs-layout         — Grid-Container (bekommt .sidebar-collapsed)
//   .docs-header__icon-sidebar — Desktop-SVG im Button (wird ausgetauscht)
// ==========================================================================

(function () {
  'use strict';

  var DESKTOP_BP = 960;
  var STORAGE_KEY = 'docs-sidebar-collapsed';

  function init() {
    var toggleBtn = document.getElementById('docs-sidebar-open');
    var layout    = document.querySelector('.docs-layout');
    var iconEl    = toggleBtn ? toggleBtn.querySelector('.docs-header__icon-sidebar') : null;

    if (!toggleBtn || !layout || !iconEl) return;

    // SVG paths for both states (currentColor, 24x24 viewBox)
    var sidebarOpenSVG =
      '<g transform="translate(12,12) scale(-1,1) translate(-12,-12)">' +
        '<path d="M10,12 L16.5,12 L13.5,9 M13.5,15 L16.5,12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<line x1="9" y1="4" x2="9" y2="20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</g>';

    var sidebarCloseSVG =
      '<g transform="translate(12,12) scale(-1,1) translate(-12,-12)">' +
        '<path d="M13,12 L19.5,12 L16.5,9 M16.5,15 L19.5,12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" transform="translate(16.25,12) scale(-1,1) translate(-16.25,-12)"/>' +
        '<rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<line x1="9" y1="4" x2="9" y2="20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</g>';

    // -------------------------------------------------------------------
    // State helpers
    // -------------------------------------------------------------------

    function isDesktop() {
      return window.innerWidth >= DESKTOP_BP;
    }

    function isCollapsed() {
      return layout.classList.contains('sidebar-collapsed');
    }

    function setIcon(collapsed) {
      iconEl.innerHTML = collapsed ? sidebarCloseSVG : sidebarOpenSVG;
      toggleBtn.setAttribute('aria-label', collapsed ? 'Sidebar einblenden' : 'Sidebar ausblenden');
    }

    function collapseSidebar() {
      layout.classList.add('sidebar-collapsed');
      setIcon(true);
      saveState(true);
    }

    function expandSidebar() {
      layout.classList.remove('sidebar-collapsed');
      setIcon(false);
      saveState(false);
    }

    // -------------------------------------------------------------------
    // localStorage
    // -------------------------------------------------------------------

    function saveState(collapsed) {
      try {
        localStorage.setItem(STORAGE_KEY, collapsed ? '1' : '0');
      } catch (e) {
        // noop (private browsing)
      }
    }

    function loadState() {
      try {
        return localStorage.getItem(STORAGE_KEY) === '1';
      } catch (e) {
        return false;
      }
    }

    // -------------------------------------------------------------------
    // Click handler — desktop only toggle, mobile keeps drawer behavior
    // -------------------------------------------------------------------

    toggleBtn.addEventListener('click', function (e) {
      if (!isDesktop()) return; // Let docs-sidebar.js handle mobile drawer

      // Prevent docs-sidebar.js from also firing (it uses same #docs-sidebar-open)
      e.stopImmediatePropagation();

      if (isCollapsed()) {
        expandSidebar();
      } else {
        collapseSidebar();
      }
    });

    // -------------------------------------------------------------------
    // Restore state on load (desktop only)
    // -------------------------------------------------------------------

    function restoreState() {
      if (isDesktop() && loadState()) {
        layout.classList.add('sidebar-collapsed');
        setIcon(true);
      }
    }

    // On resize: if switching to mobile, ensure sidebar is not collapsed
    // If switching to desktop, restore saved state
    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        if (!isDesktop()) {
          // Mobile: remove desktop collapse, reset icon to sidebar-open
          layout.classList.remove('sidebar-collapsed');
          setIcon(false);
        } else {
          // Desktop: restore saved state
          if (loadState()) {
            layout.classList.add('sidebar-collapsed');
            setIcon(true);
          }
        }
      }, 150);
    });

    // Init
    restoreState();
  }

  // -------------------------------------------------------------------
  // Start: sofort oder nach sidebar-loaded Event
  // -------------------------------------------------------------------
  var sidebar = document.getElementById('docs-sidebar');
  if (sidebar && sidebar.querySelector('nav')) {
    init();
  } else {
    window.addEventListener('sidebar-loaded', init);
  }
})();
