// ==========================================================================
// Docs Theme Toggle — Light / Dark Mode
// ==========================================================================
// Schaltet zwischen neo-light-theme und neo-dark-theme um.
// Eingebunden am Ende jeder Docs-Seite via <script src="docs-theme-toggle.js">
//
// Verhalten:
//   - Toggle Switch im Header (#docs-theme-toggle)
//   - Klick wechselt body-Klasse: neo-light-theme <-> neo-dark-theme
//   - Zustand wird in localStorage gespeichert
//   - Beim Laden wird gespeicherter Zustand wiederhergestellt
//
// Elemente:
//   #docs-theme-toggle  — <button role="switch"> im Header
// ==========================================================================

(function () {
  'use strict';

  var STORAGE_KEY = 'docs-theme-dark';
  var LIGHT_CLASS = 'neo-light-theme';
  var DARK_CLASS  = 'neo-dark-theme';

  var toggle = document.getElementById('docs-theme-toggle');
  if (!toggle) return;

  // -----------------------------------------------------------------------
  // State helpers
  // -----------------------------------------------------------------------

  function isDark() {
    return document.body.classList.contains(DARK_CLASS);
  }

  function applyTheme(dark) {
    document.body.classList.remove(LIGHT_CLASS, DARK_CLASS);
    document.body.classList.add(dark ? DARK_CLASS : LIGHT_CLASS);
    toggle.setAttribute('aria-checked', String(dark));
  }

  function saveState(dark) {
    try {
      localStorage.setItem(STORAGE_KEY, dark ? '1' : '0');
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

  // -----------------------------------------------------------------------
  // Click handler
  // -----------------------------------------------------------------------

  toggle.addEventListener('click', function () {
    var dark = !isDark();
    applyTheme(dark);
    saveState(dark);
  });

  // -----------------------------------------------------------------------
  // Restore state on load
  // -----------------------------------------------------------------------

  var savedDark = loadState();
  if (savedDark) {
    applyTheme(true);
  }
})();
