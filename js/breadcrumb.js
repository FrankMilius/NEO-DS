// ==========================================================================
// Breadcrumb — Truncation-Dropdown
// ==========================================================================
// Progressive Enhancement: Klick auf den Ellipsis-Button oeffnet ein
// Dropdown-Menue mit den ausgeblendeten Zwischenebenen.
//
// AKTIVIERUNG:
//   <nav class="nc-breadcrumb" data-breadcrumb-truncated
//        data-breadcrumb-hidden-items='[{"label":"...","href":"..."}]'>
//
// Ohne JS bleibt der Ellipsis-Button sichtbar, tut aber nichts.
// ==========================================================================

(function () {
  'use strict';

  // -----------------------------------------------------------------------
  // Init: Alle truncated Breadcrumbs finden
  // -----------------------------------------------------------------------

  function init() {
    var breadcrumbs = document.querySelectorAll('[data-breadcrumb-truncated]');
    for (var i = 0; i < breadcrumbs.length; i++) {
      setupBreadcrumb(breadcrumbs[i]);
    }
  }

  // -----------------------------------------------------------------------
  // Setup: Einzelne Breadcrumb-Instanz
  // -----------------------------------------------------------------------

  function setupBreadcrumb(nav) {
    var ellipsis = nav.querySelector('.nc-breadcrumb__ellipsis');
    if (!ellipsis) return;

    // Hidden Items aus data-Attribut lesen
    var hiddenItemsAttr = nav.getAttribute('data-breadcrumb-hidden-items');
    if (!hiddenItemsAttr) return;

    var hiddenItems;
    try {
      hiddenItems = JSON.parse(hiddenItemsAttr);
    } catch (e) {
      return;
    }

    if (!hiddenItems || !hiddenItems.length) return;

    // Ellipsis-Wrap: Position-Context auf dem Parent-<li>
    var ellipsisItem = ellipsis.closest('.nc-breadcrumb__item');
    if (ellipsisItem) {
      ellipsisItem.classList.add('nc-breadcrumb__ellipsis-wrap');
    }

    // ARIA-Attribute auf dem Ellipsis-Button
    ellipsis.setAttribute('aria-haspopup', 'true');
    ellipsis.setAttribute('aria-expanded', 'false');

    // Dropdown erzeugen
    var dropdown = buildDropdown(hiddenItems);
    ellipsis.parentNode.insertBefore(dropdown, ellipsis.nextSibling);

    // -----------------------------------------------------------------------
    // Event-Handling
    // -----------------------------------------------------------------------

    ellipsis.addEventListener('click', function (e) {
      e.stopPropagation();
      toggleDropdown(ellipsis, dropdown);
    });

    ellipsis.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        openDropdown(ellipsis, dropdown);
        focusFirstItem(dropdown);
      }
    });

    dropdown.addEventListener('keydown', function (e) {
      handleDropdownKeydown(e, ellipsis, dropdown);
    });

    // Close on click-outside
    document.addEventListener('click', function (e) {
      if (!dropdown.classList.contains('is-open')) return;
      if (!ellipsis.contains(e.target) && !dropdown.contains(e.target)) {
        closeDropdown(ellipsis, dropdown);
      }
    });

    // Close on focusout (Tab away)
    var wrap = ellipsisItem || ellipsis.parentNode;
    wrap.addEventListener('focusout', function (e) {
      if (!dropdown.classList.contains('is-open')) return;
      // Pruefen ob der neue Focus noch innerhalb ist
      requestAnimationFrame(function () {
        if (!wrap.contains(document.activeElement)) {
          closeDropdown(ellipsis, dropdown);
        }
      });
    });
  }

  // -----------------------------------------------------------------------
  // Dropdown DOM erzeugen
  // -----------------------------------------------------------------------

  function buildDropdown(items) {
    var ul = document.createElement('ul');
    ul.className = 'nc-breadcrumb__dropdown';
    ul.setAttribute('role', 'menu');

    for (var i = 0; i < items.length; i++) {
      var li = document.createElement('li');
      li.setAttribute('role', 'none');

      var a = document.createElement('a');
      a.className = 'nc-breadcrumb__dropdown-item';
      a.setAttribute('role', 'menuitem');
      a.setAttribute('tabindex', '-1');
      a.href = items[i].href || '#';
      a.textContent = items[i].label;

      li.appendChild(a);
      ul.appendChild(li);
    }

    return ul;
  }

  // -----------------------------------------------------------------------
  // Open / Close / Toggle
  // -----------------------------------------------------------------------

  function openDropdown(ellipsis, dropdown) {
    dropdown.classList.add('is-open');
    ellipsis.setAttribute('aria-expanded', 'true');
  }

  function closeDropdown(ellipsis, dropdown) {
    dropdown.classList.remove('is-open');
    ellipsis.setAttribute('aria-expanded', 'false');
  }

  function toggleDropdown(ellipsis, dropdown) {
    if (dropdown.classList.contains('is-open')) {
      closeDropdown(ellipsis, dropdown);
    } else {
      openDropdown(ellipsis, dropdown);
      focusFirstItem(dropdown);
    }
  }

  // -----------------------------------------------------------------------
  // Focus-Management
  // -----------------------------------------------------------------------

  function focusFirstItem(dropdown) {
    var first = dropdown.querySelector('.nc-breadcrumb__dropdown-item');
    if (first) first.focus();
  }

  function getDropdownItems(dropdown) {
    return dropdown.querySelectorAll('.nc-breadcrumb__dropdown-item');
  }

  // -----------------------------------------------------------------------
  // Keyboard-Navigation im Dropdown
  // -----------------------------------------------------------------------

  function handleDropdownKeydown(e, ellipsis, dropdown) {
    var items = getDropdownItems(dropdown);
    var currentIndex = Array.prototype.indexOf.call(items, document.activeElement);

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (currentIndex < items.length - 1) {
          items[currentIndex + 1].focus();
        } else {
          items[0].focus(); // Wrap
        }
        break;

      case 'ArrowUp':
        e.preventDefault();
        if (currentIndex > 0) {
          items[currentIndex - 1].focus();
        } else {
          items[items.length - 1].focus(); // Wrap
        }
        break;

      case 'Home':
        e.preventDefault();
        items[0].focus();
        break;

      case 'End':
        e.preventDefault();
        items[items.length - 1].focus();
        break;

      case 'Escape':
        e.preventDefault();
        closeDropdown(ellipsis, dropdown);
        ellipsis.focus();
        break;

      case 'Tab':
        closeDropdown(ellipsis, dropdown);
        break;
    }
  }

  // -----------------------------------------------------------------------
  // Oeffentliche API: Re-Init fuer dynamisch erzeugte Breadcrumbs
  // -----------------------------------------------------------------------

  function initWithinScope(scope) {
    var root = scope || document;
    var breadcrumbs = root.querySelectorAll('[data-breadcrumb-truncated]');
    for (var i = 0; i < breadcrumbs.length; i++) {
      // Nur initialisieren wenn noch kein Dropdown vorhanden
      if (!breadcrumbs[i].querySelector('.nc-breadcrumb__dropdown')) {
        setupBreadcrumb(breadcrumbs[i]);
      }
    }
  }

  // Globale Funktion fuer Re-Init (z.B. aus Docs Staging Area)
  window.initBreadcrumbDropdowns = initWithinScope;

  // -----------------------------------------------------------------------
  // DOM-ready
  // -----------------------------------------------------------------------

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
