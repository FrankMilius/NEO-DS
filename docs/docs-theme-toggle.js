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

    // data-theme auf <html> setzen für Konsistenz mit Haupt-Site
    // und Opt-out von prefers-color-scheme Auto-Switching
    if (dark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
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

  // -----------------------------------------------------------------------
  // Papierwahl (Markenbuch 04.2): data-bg-paper auf <html>, nur zur Pruefung.
  // Graphit ist die Voreinstellung und traegt kein Attribut. Im dunklen Thema
  // wirkt das Attribut nicht — das ist die Regel, kein Fehler.
  // -----------------------------------------------------------------------

  var PAPER_KEY = 'docs-bg-paper';
  var paperSelect = document.getElementById('docs-paper-select');
  if (paperSelect) {
    var applyPaper = function (paper) {
      if (!paper || paper === 'graphit') {
        document.documentElement.removeAttribute('data-bg-paper');
      } else {
        document.documentElement.setAttribute('data-bg-paper', paper);
      }
      paperSelect.value = paper || 'graphit';
    };
    var savedPaper = null;
    try { savedPaper = localStorage.getItem(PAPER_KEY); } catch (e) { /* noop */ }
    applyPaper(savedPaper);
    paperSelect.addEventListener('change', function () {
      applyPaper(paperSelect.value);
      try { localStorage.setItem(PAPER_KEY, paperSelect.value); } catch (e) { /* noop */ }
    });
  }
})();
