// ==========================================================================
// On-Page Table of Contents (Inhaltsverzeichnis)
// ==========================================================================
// Scannt h2.docs__section-title Elemente und generiert eine sticky Navigation.
// IntersectionObserver highlighted die aktive Section.
// Nur sichtbar ab lg Breakpoint (via CSS).
// ==========================================================================

(function () {
  'use strict';

  var HEADER_HEIGHT = 56;
  var SELECTOR = 'h2.docs__section-title';
  var LG_BREAKPOINT = 1200;

  function initTOC() {
    var headings = document.querySelectorAll(SELECTOR);
    if (headings.length < 2) return; // Kein TOC bei 0-1 Sections

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

      var a = document.createElement('a');
      a.className = 'docs-toc__link';
      a.href = '#' + h.id;
      a.textContent = h.textContent;
      li.appendChild(a);
      list.appendChild(li);
    });

    nav.appendChild(list);

    // Einfuegen: nach <main class="docs"> als Sibling
    var main = document.querySelector('main.docs');
    if (main && main.parentNode) {
      main.parentNode.insertBefore(nav, main.nextSibling);
    }

    // IntersectionObserver fuer Active-State
    var links = nav.querySelectorAll('.docs-toc__link');

    var observer = new IntersectionObserver(function (entries) {
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

    headings.forEach(function (h) { observer.observe(h); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTOC);
  } else {
    initTOC();
  }
})();
