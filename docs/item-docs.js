// ==========================================================================
// Item Docs — Tab Navigation + Staging Area Controller
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
  // 3. SVG Icons
  // -----------------------------------------------------------------------

  var ICONS = {
    settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    message: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
    bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
    link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>'
  };

  // -----------------------------------------------------------------------
  // 4. Staging Area
  // -----------------------------------------------------------------------

  var themeSelect   = document.getElementById('stage-theme');
  var variantSelect = document.getElementById('stage-variant');
  var sizeSelect    = document.getElementById('stage-size');
  var mediaSelect   = document.getElementById('stage-media');
  var actionsChk    = document.getElementById('stage-actions');
  var preview       = document.getElementById('stage-preview');
  var codeOutput    = document.getElementById('stage-code');

  if (!preview) return;

  function updateStage() {
    var theme   = themeSelect.value;
    var variant = variantSelect.value;
    var size    = sizeSelect.value;
    var media   = mediaSelect.value;
    var actions = actionsChk.checked;

    // Apply theme
    var themes = ['neo-light-theme', 'neo-dark-theme', 'customer-light-theme', 'customer-dark-theme'];
    themes.forEach(function (t) { preview.classList.remove(t); });
    preview.classList.add(theme);

    // Build classes
    var classes = ['nc-item'];
    if (variant === 'outline') classes.push('nc-item--outline');
    if (variant === 'muted') classes.push('nc-item--muted');
    if (size === 'sm') classes.push('nc-item--sm');
    if (size === 'xs') classes.push('nc-item--xs');
    var cls = classes.join(' ');

    // Build media HTML
    var mediaHtml = '';
    var mediaClass = '';
    if (media === 'icon') {
      mediaClass = 'nc-item__media nc-item__media--icon';
      mediaHtml = '<div class="' + mediaClass + '">' + ICONS.settings + '</div>';
    } else if (media === 'avatar') {
      mediaClass = 'nc-item__media nc-item__media--avatar';
      var avatarSize = size === 'xs' ? 'nc-avatar--xs' : (size === 'sm' ? 'nc-avatar--sm' : '');
      mediaHtml = '<div class="' + mediaClass + '"><span class="nc-avatar ' + avatarSize + '"><span class="nc-avatar__fallback">MM</span></span></div>';
    } else if (media === 'image') {
      mediaClass = 'nc-item__media nc-item__media--image';
      mediaHtml = '<div class="' + mediaClass + '"><img src="https://picsum.photos/80/80?random=1" alt="Beispielbild" /></div>';
    }

    // Build actions HTML
    var actionsHtml = '';
    if (actions) {
      actionsHtml = '<div class="nc-item__actions"><button class="button outline" style="--nc-button-height-md: 32px; font-size: 0.75rem;">Bearbeiten</button></div>';
    }

    // Render
    preview.innerHTML = '<div style="max-width: 480px; width: 100%;">'
      + '<div class="' + cls + '">'
      + mediaHtml
      + '<div class="nc-item__content">'
      + '<div class="nc-item__title">Einstellungen</div>'
      + '<p class="nc-item__description">Konto- und Profil-Einstellungen verwalten.</p>'
      + '</div>'
      + actionsHtml
      + '</div>'
      + '</div>';

    // Code output
    if (codeOutput) {
      var codeLines = ['<div class="' + cls + '">'];
      if (media !== 'none') {
        codeLines.push('  <div class="' + mediaClass + '">...</div>');
      }
      codeLines.push('  <div class="nc-item__content">');
      codeLines.push('    <div class="nc-item__title">Einstellungen</div>');
      codeLines.push('    <p class="nc-item__description">Beschreibung</p>');
      codeLines.push('  </div>');
      if (actions) {
        codeLines.push('  <div class="nc-item__actions">');
        codeLines.push('    <button class="button outline">Bearbeiten</button>');
        codeLines.push('  </div>');
      }
      codeLines.push('</div>');
      codeOutput.textContent = codeLines.join('\n');
    }
  }

  themeSelect.addEventListener('change', updateStage);
  variantSelect.addEventListener('change', updateStage);
  sizeSelect.addEventListener('change', updateStage);
  mediaSelect.addEventListener('change', updateStage);
  actionsChk.addEventListener('change', updateStage);

  // Initial render
  updateStage();

})();
