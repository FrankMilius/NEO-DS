// ==========================================================================
// Docs Sidebar Loader — Laedt Sidebar-HTML aus externer Datei
// ==========================================================================
// Eingebunden VOR docs-sidebar-toggle.js und docs-sidebar.js.
//
// Laedt docs-sidebar.html per fetch() und ersetzt den Platzhalter.
// Nach dem Laden wird ein 'sidebar-loaded' Event dispatched,
// damit docs-sidebar.js und docs-sidebar-toggle.js initialisieren koennen.
// ==========================================================================

(function () {
  'use strict';

  var placeholder = document.getElementById('docs-sidebar');
  if (!placeholder) return;

  // Sidebar bereits befuellt (z.B. kein Loader noetig) — direkt Event feuern
  if (placeholder.querySelector('nav')) {
    window.dispatchEvent(new CustomEvent('sidebar-loaded'));
    return;
  }

  fetch('docs-sidebar.html')
    .then(function (response) {
      if (!response.ok) throw new Error('Sidebar konnte nicht geladen werden');
      return response.text();
    })
    .then(function (html) {
      // Platzhalter durch vollstaendige Sidebar ersetzen
      var temp = document.createElement('div');
      temp.innerHTML = html;
      var sidebarEl = temp.firstElementChild;
      if (sidebarEl) {
        placeholder.parentNode.replaceChild(sidebarEl, placeholder);
      }
      // Sidebar-Scripts koennen jetzt initialisieren
      window.dispatchEvent(new CustomEvent('sidebar-loaded'));
    })
    .catch(function (err) {
      // eslint-disable-next-line no-console
      console.warn('[Sidebar Loader]', err.message);
    });
})();
