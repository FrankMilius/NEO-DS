// ==========================================================================
// Generisches Docs Tabs + Stage Theme Controller
// ==========================================================================
// Übernimmt Tab-Navigation und Stage-Theme-Toggle für alle Dokumentationsseiten.
// Komponenten-spezifische Demo-Logik bleibt in den jeweiligen {component}-docs.js.
// ==========================================================================

(function () {
  'use strict';

  // -----------------------------------------------------------------------
  // 1. Tab Navigation (für alle .docs-tabs Instanzen auf der Seite)
  // -----------------------------------------------------------------------

  // Tab-List liegt in .docs__tab-nav, Panels in .docs-tabs (innerhalb .docs__body)
  // Event-Delegation: unterstuetzt auch dynamisch hinzugefuegte Tabs (z.B. Rezept-Tab)
  document.querySelectorAll('.docs-tabs__list[role="tablist"]').forEach(function (tabList) {

    function getAllTriggers() {
      return tabList.querySelectorAll('.docs-tabs__trigger');
    }

    function getAllPanels() {
      var panels = [];
      getAllTriggers().forEach(function (t) {
        var panelId = t.getAttribute('aria-controls');
        var panel = panelId ? document.getElementById(panelId) : null;
        if (panel) panels.push(panel);
      });
      return panels;
    }

    function activateTab(trigger) {
      getAllTriggers().forEach(function (t) { t.setAttribute('aria-selected', 'false'); });
      getAllPanels().forEach(function (p) { p.classList.remove('is-active'); });

      trigger.setAttribute('aria-selected', 'true');
      var panelId = trigger.getAttribute('aria-controls');
      var panel = document.getElementById(panelId);
      if (panel) panel.classList.add('is-active');

      // TOC ueber Tab-Wechsel informieren
      document.dispatchEvent(new CustomEvent('docs-tab-change', {
        detail: { panelId: panelId }
      }));
    }

    // Click-Delegation auf Tablist
    tabList.addEventListener('click', function (e) {
      var trigger = e.target.closest('.docs-tabs__trigger');
      if (!trigger || !tabList.contains(trigger)) return;
      activateTab(trigger);
    });

    // Keyboard-Delegation auf Tablist
    tabList.addEventListener('keydown', function (e) {
      var trigger = e.target.closest('.docs-tabs__trigger');
      if (!trigger) return;

      var allTriggers = getAllTriggers();
      var index = Array.prototype.indexOf.call(allTriggers, trigger);
      var nextIndex = -1;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        nextIndex = (index + 1) % allTriggers.length;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        nextIndex = (index - 1 + allTriggers.length) % allTriggers.length;
      } else if (e.key === 'Home') {
        nextIndex = 0;
      } else if (e.key === 'End') {
        nextIndex = allTriggers.length - 1;
      }

      if (nextIndex >= 0) {
        e.preventDefault();
        allTriggers[nextIndex].focus();
        activateTab(allTriggers[nextIndex]);
      }
    });
  });

  // -----------------------------------------------------------------------
  // 2. Stage Theme Toggle (generisch für alle #stage-theme Selects)
  // -----------------------------------------------------------------------

  var THEMES = ['neo-light-theme', 'neo-dark-theme', 'customer-light-theme', 'customer-dark-theme'];

  document.querySelectorAll('.docs-stage__select[id^="stage-theme"]').forEach(function (select) {
    var stage = select.closest('.docs-stage');
    if (!stage) return;

    var preview = stage.querySelector('.docs-stage__preview') || stage.querySelector('.docs-stage__canvas');
    if (!preview) return;

    select.addEventListener('change', function () {
      THEMES.forEach(function (t) { preview.classList.remove(t); });
      preview.classList.add(select.value);
    });

    // Initial: setze Theme falls schon gesetzt
    if (select.value) {
      THEMES.forEach(function (t) { preview.classList.remove(t); });
      preview.classList.add(select.value);
    }
  });

  // -----------------------------------------------------------------------
  // 3. Code Snippet Copy Button
  // -----------------------------------------------------------------------

  document.querySelectorAll('.docs-snippet').forEach(function (snippet) {
    var pre = snippet.querySelector('pre');
    if (!pre) return;

    // Erstelle Copy-Button wenn nicht vorhanden
    var btn = snippet.querySelector('.docs-snippet__copy');
    if (!btn) {
      btn = document.createElement('button');
      btn.className = 'docs-snippet__copy';
      btn.setAttribute('aria-label', 'Code kopieren');
      btn.textContent = 'Kopieren';
      snippet.appendChild(btn);
    }

    btn.addEventListener('click', function () {
      var text = pre.textContent || pre.innerText;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(function () {
          btn.textContent = 'Kopiert!';
          setTimeout(function () { btn.textContent = 'Kopieren'; }, 2000);
        });
      }
    });
  });

})();
