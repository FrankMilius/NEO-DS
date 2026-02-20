/**
 * DataTable Documentation — Interactive Controls
 * ================================================
 * Initialisiert Tab-Navigation und Demo-Tabellen.
 * Sidebar, Theme-Toggle und Suche werden von den
 * Shared-Scripts (docs-sidebar-toggle.js etc.) gesteuert.
 */

(function () {
  'use strict';

  // =========================================================================
  // Tab Navigation (is-active Pattern — identisch mit checkbox-docs.js)
  // =========================================================================

  var tabList = document.querySelector('.docs-tabs__list');
  var triggers = tabList ? tabList.querySelectorAll('.docs-tabs__trigger') : [];
  var panels = document.querySelectorAll('.docs-tabs__panel');

  function activateTab(trigger) {
    // Alle Tabs deaktivieren
    triggers.forEach(function (t) { t.setAttribute('aria-selected', 'false'); });
    panels.forEach(function (p) { p.classList.remove('is-active'); });

    // Aktiven Tab setzen
    trigger.setAttribute('aria-selected', 'true');
    var panelId = trigger.getAttribute('aria-controls');
    var panel = document.getElementById(panelId);
    if (panel) panel.classList.add('is-active');
  }

  triggers.forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      activateTab(trigger);
    });

    // Arrow key navigation within tabs
    trigger.addEventListener('keydown', function (e) {
      var index = Array.prototype.indexOf.call(triggers, trigger);
      var nextIndex = -1;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        nextIndex = (index + 1) % triggers.length;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        nextIndex = (index - 1 + triggers.length) % triggers.length;
      } else if (e.key === 'Home') {
        nextIndex = 0;
      } else if (e.key === 'End') {
        nextIndex = triggers.length - 1;
      }

      if (nextIndex >= 0) {
        e.preventDefault();
        activateTab(triggers[nextIndex]);
        triggers[nextIndex].focus();
      }
    });
  });

  // Erster Tab aktiv
  if (triggers.length > 0) {
    activateTab(triggers[0]);
  }

  // =========================================================================
  // DataTable Demo Initialisierung
  // =========================================================================

  if (typeof window.setupDataTables === 'function') {
    window.setupDataTables();
  } else {
    console.warn('[DataTable Docs] setupDataTables nicht gefunden.');
  }
})();
