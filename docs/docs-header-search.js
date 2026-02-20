// ==========================================================================
// Docs Header — Search Toggle
// ==========================================================================
// Steuert das Öffnen/Schließen des Suchfelds im Dokumentations-Header.
// Eingebunden am Ende jeder Docs-Seite via <script src="docs-header-search.js">
//
// Elemente:
//   #docs-search-toggle  — Icon-Button (Lupe), öffnet Suchfeld
//   #docs-search-field   — Container mit Input + Close-Button (hidden default)
//   #docs-search-input   — <input type="search">
//   #docs-search-close   — Close-Button, schließt Suchfeld
// ==========================================================================

(function () {
  'use strict';

  var searchToggle = document.getElementById('docs-search-toggle');
  var searchField  = document.getElementById('docs-search-field');
  var searchInput  = document.getElementById('docs-search-input');
  var searchClose  = document.getElementById('docs-search-close');

  if (!searchToggle || !searchField) return;

  function openSearch() {
    searchField.removeAttribute('hidden');
    searchToggle.setAttribute('aria-expanded', 'true');
    if (searchInput) {
      searchInput.value = '';
      searchInput.focus();
    }
  }

  function closeSearch() {
    searchField.setAttribute('hidden', '');
    searchToggle.setAttribute('aria-expanded', 'false');
    searchToggle.focus();
  }

  searchToggle.addEventListener('click', openSearch);

  if (searchClose) {
    searchClose.addEventListener('click', closeSearch);
  }

  // Escape schließt das Suchfeld
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !searchField.hasAttribute('hidden')) {
      closeSearch();
    }
  });
})();
