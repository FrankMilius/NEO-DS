// ==========================================================================
// Docs Search — Client-Side Suchfunktion
// ==========================================================================
// Lädt den Suchindex lazy beim ersten Tastendruck.
// Pattern aus icons-docs.js: Array.filter + String.includes + Debounce.
// ==========================================================================

(function () {
  'use strict';

  var searchInput = document.getElementById('docs-search-input');
  var searchField = document.getElementById('docs-search-field');
  if (!searchInput || !searchField) return;

  var index = null;
  var loading = false;
  var results = null; // Dropdown-Element
  var selectedIndex = -1;

  // -----------------------------------------------------------------------
  // 1. Ergebnis-Dropdown erstellen
  // -----------------------------------------------------------------------

  function createDropdown() {
    if (results) return results;
    results = document.createElement('div');
    results.className = 'docs-search-results';
    results.setAttribute('role', 'listbox');
    results.setAttribute('id', 'docs-search-results');
    results.setAttribute('aria-label', 'Suchergebnisse');
    searchField.appendChild(results);
    searchInput.setAttribute('aria-owns', 'docs-search-results');
    searchInput.setAttribute('aria-autocomplete', 'list');
    return results;
  }

  // -----------------------------------------------------------------------
  // 2. Suchindex laden (lazy)
  // -----------------------------------------------------------------------

  function loadIndex(callback) {
    if (index) { callback(); return; }
    if (loading) return;
    loading = true;

    fetch('../data/docs-search-index.json')
      .then(function (res) { return res.json(); })
      .then(function (data) {
        index = data;
        loading = false;
        callback();
      })
      .catch(function (err) {
        console.warn('Docs search index konnte nicht geladen werden:', err);
        loading = false;
      });
  }

  // -----------------------------------------------------------------------
  // 3. Suche durchführen
  // -----------------------------------------------------------------------

  function search(query) {
    if (!index) return [];
    var q = query.trim().toLowerCase();
    if (!q) return [];

    return index.filter(function (entry) {
      if (entry.title.toLowerCase().includes(q)) return true;
      if (entry.description.toLowerCase().includes(q)) return true;
      if (entry.section.toLowerCase().includes(q)) return true;
      if (entry.category.toLowerCase().includes(q)) return true;
      if (entry.keywords && entry.keywords.some(function (kw) {
        return kw.toLowerCase().includes(q);
      })) return true;
      return false;
    });
  }

  // -----------------------------------------------------------------------
  // 4. Ergebnisse rendern
  // -----------------------------------------------------------------------

  function renderResults(matches) {
    var dropdown = createDropdown();
    selectedIndex = -1;

    if (matches.length === 0) {
      dropdown.innerHTML = '<div class="docs-search-results__empty">Keine Ergebnisse gefunden.</div>';
      dropdown.style.display = 'block';
      return;
    }

    var html = matches.slice(0, 15).map(function (entry, i) {
      return '<a class="docs-search-results__item" href="' + entry.url + '" role="option" id="search-result-' + i + '">'
        + '<span class="docs-search-results__title">' + escapeHtml(entry.title) + '</span>'
        + '<span class="docs-search-results__section">' + escapeHtml(entry.section) + '</span>'
        + '</a>';
    }).join('');

    dropdown.innerHTML = html;
    dropdown.style.display = 'block';
  }

  function hideResults() {
    if (results) {
      results.style.display = 'none';
      results.innerHTML = '';
    }
    selectedIndex = -1;
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // -----------------------------------------------------------------------
  // 5. Keyboard Navigation im Dropdown
  // -----------------------------------------------------------------------

  function navigateResults(direction) {
    if (!results) return;
    var items = results.querySelectorAll('.docs-search-results__item');
    if (!items.length) return;

    // Vorherige Markierung entfernen
    if (selectedIndex >= 0 && items[selectedIndex]) {
      items[selectedIndex].classList.remove('is-selected');
    }

    selectedIndex += direction;
    if (selectedIndex < 0) selectedIndex = items.length - 1;
    if (selectedIndex >= items.length) selectedIndex = 0;

    items[selectedIndex].classList.add('is-selected');
    items[selectedIndex].scrollIntoView({ block: 'nearest' });
    searchInput.setAttribute('aria-activedescendant', 'search-result-' + selectedIndex);
  }

  // -----------------------------------------------------------------------
  // 6. Event Listeners
  // -----------------------------------------------------------------------

  var searchTimeout = null;

  searchInput.addEventListener('input', function () {
    clearTimeout(searchTimeout);
    var query = searchInput.value;

    if (!query.trim()) {
      hideResults();
      return;
    }

    loadIndex(function () {
      searchTimeout = setTimeout(function () {
        var matches = search(query);
        renderResults(matches);
      }, 150);
    });
  });

  searchInput.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      navigateResults(1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      navigateResults(-1);
    } else if (e.key === 'Enter') {
      if (selectedIndex >= 0 && results) {
        var items = results.querySelectorAll('.docs-search-results__item');
        if (items[selectedIndex]) {
          e.preventDefault();
          items[selectedIndex].click();
        }
      }
    } else if (e.key === 'Escape') {
      hideResults();
    }
  });

  // Klick außerhalb schließt Dropdown
  document.addEventListener('click', function (e) {
    if (!searchField.contains(e.target)) {
      hideResults();
    }
  });

})();
