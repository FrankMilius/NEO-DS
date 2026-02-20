// ==========================================================================
// Docs Sidebar — Collapse, Active-Link, Mobile Drawer, localStorage
// ==========================================================================
// Eingebunden am Ende jeder Docs-Seite via <script src="docs-sidebar.js"></script>
//
// Features:
//   1. Collapsible Sektionen (Foundation / Components) mit aria-expanded
//   2. Active-Link-Erkennung anhand der aktuellen URL
//   3. Mobile off-canvas Drawer (open/close/overlay)
//   4. localStorage fuer Collapse-Zustand
//   5. Keyboard-Zugaenglich (Enter/Space auf Toggle, Escape schliesst Drawer)
//
// Hinweis: Subgroups (Ebene 2) sind statische Labels, nicht aufklappbar.
// Initialisierung wartet auf 'sidebar-loaded' Event vom Sidebar-Loader.
// ==========================================================================

(function () {
  'use strict';

  var STORAGE_KEY = 'docs-sidebar-state';
  var DESKTOP_BREAKPOINT = 960; // matches @include respond-to('md') = 960px

  function init() {
    // -------------------------------------------------------------------
    // DOM References
    // -------------------------------------------------------------------
    var sidebar  = document.getElementById('docs-sidebar');
    var overlay  = document.getElementById('docs-sidebar-overlay');
    var openBtn  = document.getElementById('docs-sidebar-open');
    var closeBtn = document.getElementById('docs-sidebar-close');

    if (!sidebar) return;

    // Nur Hauptsektions-Toggles (Foundation, Components) — keine Subtoggles
    var toggles = sidebar.querySelectorAll('.docs-sidebar__toggle');

    // -------------------------------------------------------------------
    // 0. Ensure Custom Docs Links
    // -------------------------------------------------------------------
    function ensureCustomLinks() {
      var actionsList = sidebar.querySelector('#sidebar-actions');
      if (!actionsList) return;

      var existing = actionsList.querySelector('a.docs-sidebar__link[href="./button-micro-docs.html"]');
      if (existing) return;

      var item = document.createElement('li');
      var link = document.createElement('a');
      link.className = 'docs-sidebar__link';
      link.href = './button-micro-docs.html';
      link.textContent = 'Button Micro';
      item.appendChild(link);
      actionsList.appendChild(item);
    }

    // -------------------------------------------------------------------
    // 1. Active Link Detection
    // -------------------------------------------------------------------
    function setActiveLink() {
      var rawPage = window.location.pathname.split('/').pop() || 'index';
      var currentPage = rawPage.replace(/\.html$/, '');
      var currentLinks = sidebar.querySelectorAll('.docs-sidebar__link');
      currentLinks.forEach(function (link) {
        var href = link.getAttribute('href');
        var hrefPage = href.replace(/^\.\//, '').replace(/\.html$/, '');
        if (hrefPage === currentPage) {
          link.setAttribute('aria-current', 'page');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    }

    // -------------------------------------------------------------------
    // 2. Collapse State (localStorage) — nur Hauptsektionen
    // -------------------------------------------------------------------
    function loadCollapseState() {
      var saved = {};
      try {
        saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
      } catch (e) {
        // noop
      }

      toggles.forEach(function (toggle) {
        var sectionId = toggle.getAttribute('aria-controls');
        if (!sectionId) return;

        // Default: expanded (true). Use saved value if available.
        var isExpanded = saved[sectionId] !== undefined ? saved[sectionId] : true;
        toggle.setAttribute('aria-expanded', String(isExpanded));
      });
    }

    function saveCollapseState() {
      var state = {};
      toggles.forEach(function (toggle) {
        var sectionId = toggle.getAttribute('aria-controls');
        if (sectionId) {
          state[sectionId] = toggle.getAttribute('aria-expanded') === 'true';
        }
      });
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (e) {
        // noop (private browsing etc.)
      }
    }

    // -------------------------------------------------------------------
    // 3. Section Toggle (click + keyboard)
    // -------------------------------------------------------------------
    toggles.forEach(function (toggle) {
      toggle.addEventListener('click', function () {
        var expanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!expanded));
        saveCollapseState();
      });
    });

    // -------------------------------------------------------------------
    // 4. Mobile Drawer
    // -------------------------------------------------------------------
    function openDrawer() {
      sidebar.classList.add('is-open');
      if (overlay) overlay.classList.add('is-visible');
      document.body.style.overflow = 'hidden';
      if (closeBtn) closeBtn.focus();
    }

    function closeDrawer() {
      sidebar.classList.remove('is-open');
      if (overlay) overlay.classList.remove('is-visible');
      document.body.style.overflow = '';
      if (openBtn) openBtn.focus();
    }

    if (openBtn) {
      openBtn.addEventListener('click', openDrawer);
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', closeDrawer);
    }

    if (overlay) {
      overlay.addEventListener('click', closeDrawer);
    }

    // Escape-Taste schliesst den Drawer
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && sidebar.classList.contains('is-open')) {
        closeDrawer();
      }
    });

    // Bei Desktop-Resize: Drawer-Zustand zuruecksetzen
    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        if (window.innerWidth >= DESKTOP_BREAKPOINT) {
          sidebar.classList.remove('is-open');
          if (overlay) overlay.classList.remove('is-visible');
          document.body.style.overflow = '';
        }
      }, 150);
    });

    // -------------------------------------------------------------------
    // 5. Focus Trap (mobile drawer)
    // -------------------------------------------------------------------
    sidebar.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab' || window.innerWidth >= DESKTOP_BREAKPOINT) return;
      if (!sidebar.classList.contains('is-open')) return;

      var focusable = sidebar.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;

      var first = focusable[0];
      var last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });

    // -------------------------------------------------------------------
    // Init
    // -------------------------------------------------------------------
    ensureCustomLinks();
    loadCollapseState();
    setActiveLink();
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
