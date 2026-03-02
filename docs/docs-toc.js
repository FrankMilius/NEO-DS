// ==========================================================================
// On-Page Table of Contents (Inhaltsverzeichnis)
// ==========================================================================
// Scannt h2.docs__section-title Elemente und generiert eine sticky Navigation.
// IntersectionObserver highlighted die aktive Section.
// Tab-aware: Wenn .docs-tabs__list existiert, zeigt die TOC nur Headings
// des aktiven Tab-Panels an.
// Nur sichtbar ab lg Breakpoint (via CSS).
// ==========================================================================

(function () {
  'use strict';

  var HEADER_HEIGHT = 56;
  var SELECTOR = 'h2.docs__section-title';

  function initTOC() {
    var headings = document.querySelectorAll(SELECTOR);
    if (headings.length < 2) return;

    // Pruefen ob Tab-Navigation existiert
    var tabList = document.querySelector('.docs-tabs__list[role="tablist"]');
    var hasTabs = !!tabList;

    // IDs sicherstellen
    headings.forEach(function (h, i) {
      if (!h.id) {
        h.id = 'section-' + (i + 1);
      }
    });

    // TOC-Element erstellen
    var nav = document.createElement('nav');
    nav.className = 'docs-toc';
    nav.setAttribute('aria-label', 'Inhaltsverzeichnis');

    var title = document.createElement('p');
    title.className = 'docs-toc__title';
    title.textContent = 'Auf dieser Seite';
    nav.appendChild(title);

    var list = document.createElement('ul');
    list.className = 'docs-toc__list';

    headings.forEach(function (h) {
      var li = document.createElement('li');
      li.className = 'docs-toc__item';

      // Panel-Zuordnung: Heading innerhalb eines Tab-Panels?
      if (hasTabs) {
        var panel = h.closest('.docs-tabs__panel');
        if (panel && panel.id) {
          li.setAttribute('data-panel', panel.id);
        }
      }

      var a = document.createElement('a');
      a.className = 'docs-toc__link';
      a.href = '#' + h.id;
      a.textContent = h.textContent;
      li.appendChild(a);
      list.appendChild(li);
    });

    nav.appendChild(list);

    // Einfuegen: in .docs__body (Sub-Grid: Content | TOC)
    var body = document.querySelector('.docs__body');
    if (body) {
      body.appendChild(nav);
    } else {
      var main = document.querySelector('main.docs');
      if (main && main.parentNode) {
        main.parentNode.insertBefore(nav, main.nextSibling);
      }
    }

    // --- IntersectionObserver ---
    var links = nav.querySelectorAll('.docs-toc__link');
    var observer = null;

    function createObserver(visibleHeadings) {
      if (observer) observer.disconnect();

      observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            links.forEach(function (l) { l.classList.remove('is-active'); });
            var active = nav.querySelector('a[href="#' + entry.target.id + '"]');
            if (active) active.classList.add('is-active');
          }
        });
      }, {
        rootMargin: '-' + (HEADER_HEIGHT + 32) + 'px 0px -60% 0px',
        threshold: 0
      });

      visibleHeadings.forEach(function (h) { observer.observe(h); });
    }

    // --- Tab-Filterung ---
    function updateForPanel(panelId) {
      var items = list.querySelectorAll('.docs-toc__item');
      var visibleHeadings = [];

      items.forEach(function (li) {
        var itemPanel = li.getAttribute('data-panel');
        // Anzeigen wenn: kein Panel-Attribut (ausserhalb Tabs) oder passendes Panel
        if (!itemPanel || itemPanel === panelId) {
          li.style.display = '';
        } else {
          li.style.display = 'none';
        }
      });

      // Nur sichtbare Headings beobachten (inkl. dynamisch hinzugefuegte)
      var allHeadings = document.querySelectorAll(SELECTOR + ', .docs-tabs__panel h3.docs__section-title');
      allHeadings.forEach(function (h) {
        var panel = h.closest('.docs-tabs__panel');
        if (!panel || (panel.id === panelId)) {
          visibleHeadings.push(h);
        }
      });

      // Active-State zuruecksetzen
      links.forEach(function (l) { l.classList.remove('is-active'); });

      createObserver(visibleHeadings);
    }

    // --- Dynamisch injizierte Headings hinzufuegen (z.B. Recipe-Tab) ---
    function addHeadingsFromPanel(panelId) {
      var panel = document.getElementById(panelId);
      if (!panel) return;

      // h2 und h3 mit docs__section-title im Panel scannen
      var newHeadings = panel.querySelectorAll('h2.docs__section-title, h3.docs__section-title');
      if (!newHeadings.length) return;

      newHeadings.forEach(function (h) {
        // Duplikat-Pruefung
        if (nav.querySelector('a[href="#' + h.id + '"]')) return;

        var li = document.createElement('li');
        li.className = 'docs-toc__item';
        if (h.tagName === 'H3') {
          li.classList.add('docs-toc__item--sub');
        }
        li.setAttribute('data-panel', panelId);

        var a = document.createElement('a');
        a.className = 'docs-toc__link';
        a.href = '#' + h.id;
        a.textContent = h.textContent;
        li.appendChild(a);
        list.appendChild(li);
      });

      // Links-Liste aktualisieren
      links = nav.querySelectorAll('.docs-toc__link');
    }

    // Auf Recipe-Tab-Injection reagieren
    document.addEventListener('docs-recipe-ready', function (e) {
      if (e.detail && e.detail.panelId) {
        addHeadingsFromPanel(e.detail.panelId);
        // Aktives Panel erneut filtern
        var activePanel = document.querySelector('.docs-tabs__panel.is-active');
        if (activePanel) {
          updateForPanel(activePanel.id);
        }
      }
    });

    if (hasTabs) {
      // Initiales Panel ermitteln (das mit .is-active)
      var activePanel = document.querySelector('.docs-tabs__panel.is-active');
      if (activePanel) {
        updateForPanel(activePanel.id);
      }

      // Auf Tab-Wechsel reagieren
      document.addEventListener('docs-tab-change', function (e) {
        if (e.detail && e.detail.panelId) {
          updateForPanel(e.detail.panelId);
        }
      });
    } else {
      // Keine Tabs: alle Headings beobachten
      createObserver(Array.prototype.slice.call(headings));
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTOC);
  } else {
    initTOC();
  }
})();
