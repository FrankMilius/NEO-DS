// ==========================================================================
// Drawer Docs — Tab Navigation + Staging Area Controller
// ==========================================================================

(function () {
  'use strict';

  // -----------------------------------------------------------------------
  // 1. Tab Navigation
  // -----------------------------------------------------------------------

  var tabList = document.querySelector('.docs-tabs__list');
  var triggers = tabList ? tabList.querySelectorAll('.docs-tabs__trigger') : [];
  var panels = document.querySelectorAll('.docs-tabs__panel');

  function activateTab(trigger) {
    triggers.forEach(function (t) { t.setAttribute('aria-selected', 'false'); });
    panels.forEach(function (p) { p.classList.remove('is-active'); });
    trigger.setAttribute('aria-selected', 'true');
    var panelId = trigger.getAttribute('aria-controls');
    var panel = document.getElementById(panelId);
    if (panel) panel.classList.add('is-active');
  }

  triggers.forEach(function (trigger) {
    trigger.addEventListener('click', function () { activateTab(trigger); });
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
        triggers[nextIndex].focus();
        activateTab(triggers[nextIndex]);
      }
    });
  });

  // -----------------------------------------------------------------------
  // 2. Sidebar Toggle
  // -----------------------------------------------------------------------

  var sidebar = document.getElementById('docs-sidebar');
  var sidebarOpen = document.getElementById('docs-sidebar-open');
  var sidebarClose = document.getElementById('docs-sidebar-close');
  var sidebarOverlay = document.getElementById('docs-sidebar-overlay');

  function openSidebar() {
    if (sidebar) sidebar.classList.add('is-open');
    if (sidebarOverlay) sidebarOverlay.classList.add('is-open');
  }

  function closeSidebar() {
    if (sidebar) sidebar.classList.remove('is-open');
    if (sidebarOverlay) sidebarOverlay.classList.remove('is-open');
  }

  if (sidebarOpen) sidebarOpen.addEventListener('click', openSidebar);
  if (sidebarClose) sidebarClose.addEventListener('click', closeSidebar);
  if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeSidebar);

  document.querySelectorAll('.docs-sidebar__toggle, .docs-sidebar__subtoggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var targetId = btn.getAttribute('aria-controls');
      var target = document.getElementById(targetId);
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      if (target) target.style.display = expanded ? 'none' : '';
    });
  });

  // -----------------------------------------------------------------------
  // 3. Helper: Close Drawer + Backdrop-Click
  // -----------------------------------------------------------------------

  function setupDrawer(drawer) {
    if (!drawer) return;

    // Close on backdrop click
    drawer.addEventListener('click', function (e) {
      if (e.target === drawer) drawer.close();
    });

    // Close on [data-drawer-close] click
    drawer.querySelectorAll('[data-drawer-close]').forEach(function (btn) {
      btn.addEventListener('click', function () { drawer.close(); });
    });
  }

  // -----------------------------------------------------------------------
  // 4. Staging Area
  // -----------------------------------------------------------------------

  var themeSelect     = document.getElementById('stage-theme');
  var directionSelect = document.getElementById('stage-direction');
  var footerChk       = document.getElementById('stage-footer');
  var openBtn         = document.getElementById('stage-open-drawer');
  var codeOutput      = document.getElementById('stage-code');
  var preview         = document.getElementById('stage-preview');

  var stageDrawer     = document.getElementById('stage-drawer');
  var stageHandle     = document.getElementById('stage-drawer-handle');
  var stageCloseBtn   = document.getElementById('stage-drawer-close-btn');
  var stageFooter     = document.getElementById('stage-drawer-footer');
  var stageSave       = document.getElementById('stage-drawer-save');
  var stageCancel     = document.getElementById('stage-drawer-cancel');

  if (!stageDrawer || !openBtn) return;

  // Setup backdrop click for staging drawer
  stageDrawer.addEventListener('click', function (e) {
    if (e.target === stageDrawer) stageDrawer.close();
  });

  // Close button
  if (stageCloseBtn) {
    stageCloseBtn.addEventListener('click', function () { stageDrawer.close(); });
  }

  // Footer buttons
  if (stageSave) stageSave.addEventListener('click', function () { stageDrawer.close(); });
  if (stageCancel) stageCancel.addEventListener('click', function () { stageDrawer.close(); });

  function updateStage() {
    var theme     = themeSelect.value;
    var direction = directionSelect.value;
    var showFooter = footerChk.checked;

    // Apply theme to preview
    var themes = ['neo-light-theme', 'neo-dark-theme', 'customer-light-theme', 'customer-dark-theme'];
    themes.forEach(function (t) { preview.classList.remove(t); });
    preview.classList.add(theme);

    // Update drawer classes
    stageDrawer.classList.remove('nc-drawer--top', 'nc-drawer--right', 'nc-drawer--left');
    if (direction !== 'bottom') {
      stageDrawer.classList.add('nc-drawer--' + direction);
    }

    // Show/hide handle (visible for bottom/top)
    var isSide = direction === 'left' || direction === 'right';
    if (stageHandle) stageHandle.style.display = isSide ? 'none' : '';
    if (stageCloseBtn) stageCloseBtn.style.display = isSide ? '' : 'none';

    // Show/hide footer
    if (stageFooter) stageFooter.style.display = showFooter ? '' : 'none';

    // Update code output
    if (codeOutput) {
      var dirClass = direction === 'bottom' ? 'nc-drawer' : 'nc-drawer nc-drawer--' + direction;
      var lines = [];
      lines.push('<dialog class="' + dirClass + '" aria-labelledby="drawer-title" aria-describedby="drawer-desc">');
      if (!isSide) {
        lines.push('  <div class="nc-drawer__handle"></div>');
      } else {
        lines.push('  <button class="nc-drawer__close" aria-label="Schlie\u00dfen">');
        lines.push('    <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>');
        lines.push('  </button>');
      }
      lines.push('  <div class="nc-drawer__header">');
      lines.push('    <h2 class="nc-drawer__title" id="drawer-title">Titel</h2>');
      lines.push('    <p class="nc-drawer__description" id="drawer-desc">Beschreibung</p>');
      lines.push('  </div>');
      lines.push('  <div class="nc-drawer__content">');
      lines.push('    Inhalt\u2026');
      lines.push('  </div>');
      if (showFooter) {
        lines.push('  <div class="nc-drawer__footer">');
        lines.push('    <button class="nc-button">Speichern</button>');
        lines.push('    <button class="nc-button nc-button--outline">Abbrechen</button>');
        lines.push('  </div>');
      }
      lines.push('</dialog>');
      codeOutput.textContent = lines.join('\n');
    }
  }

  // Open staging drawer
  openBtn.addEventListener('click', function () {
    updateStage();
    stageDrawer.showModal();
  });

  // Listen to control changes
  themeSelect.addEventListener('change', updateStage);
  directionSelect.addEventListener('change', updateStage);
  footerChk.addEventListener('change', updateStage);

  // Initial code render
  updateStage();

  // -----------------------------------------------------------------------
  // 5. Static Demo Drawers
  // -----------------------------------------------------------------------

  var demoBottom = document.getElementById('demo-drawer-bottom');
  var demoTop    = document.getElementById('demo-drawer-top');
  var demoRight  = document.getElementById('demo-drawer-right');
  var demoLeft   = document.getElementById('demo-drawer-left');

  setupDrawer(demoBottom);
  setupDrawer(demoTop);
  setupDrawer(demoRight);
  setupDrawer(demoLeft);

  var btnBottom = document.getElementById('demo-open-bottom');
  var btnTop    = document.getElementById('demo-open-top');
  var btnRight  = document.getElementById('demo-open-right');
  var btnLeft   = document.getElementById('demo-open-left');

  if (btnBottom && demoBottom) btnBottom.addEventListener('click', function () { demoBottom.showModal(); });
  if (btnTop && demoTop) btnTop.addEventListener('click', function () { demoTop.showModal(); });
  if (btnRight && demoRight) btnRight.addEventListener('click', function () { demoRight.showModal(); });
  if (btnLeft && demoLeft) btnLeft.addEventListener('click', function () { demoLeft.showModal(); });

})();
