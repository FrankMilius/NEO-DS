/**
 * Shell – Vanilla JS Controller
 * ==============================
 * Sidebar-Toggle, Off-Canvas-Drawer (Mobile), Linkbar/Footerbar JSON-Rendering.
 *
 * Verwendung:
 *   const shell = setupShell(document.querySelector('.nc-shell'));
 *
 * Auto-Init:
 *   setupShells() — initialisiert alle .nc-shell Elemente auf der Seite.
 *
 * API:
 *   destroy()  Event-Listener + Overlay entfernen
 */

// ---------------------------------------------------------------------------
// SVG Icons (Tabler, 20×20, stroke-width 1.5)
// ---------------------------------------------------------------------------

const ICON_SIDEBAR_L_COLLAPSE = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"/><path d="M9 4v16"/><path d="M15 10l-2 2l2 2"/></svg>';
const ICON_SIDEBAR_L_EXPAND = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"/><path d="M9 4v16"/><path d="M14 10l2 2l-2 2"/></svg>';
const ICON_SIDEBAR_R_COLLAPSE = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"/><path d="M15 4v16"/><path d="M9 10l2 2l-2 2"/></svg>';
const ICON_SIDEBAR_R_EXPAND = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"/><path d="M15 4v16"/><path d="M15 10l-2 2l2 2"/></svg>';

// ---------------------------------------------------------------------------
// Breakpoint-Erkennung (lg = 1024px, passend zu respond-to('lg'))
// ---------------------------------------------------------------------------

const LG_BREAKPOINT = 1024;

const isDesktop = () => window.matchMedia(`(min-width: ${LG_BREAKPOINT}px)`).matches;

// ---------------------------------------------------------------------------
// setupShell
// ---------------------------------------------------------------------------

/**
 * Initialisiert eine Shell-Instanz.
 * @param {HTMLElement} shellEl - Das .nc-shell Element
 * @param {Object} [options]
 * @param {string} [options.linkbarUrl]   - URL zur Linkbar-JSON-Datei
 * @param {string} [options.footerbarUrl] - URL zur Footerbar-JSON-Datei
 * @returns {{ destroy: () => void }}
 */
const setupShell = (shellEl, options = {}) => {
  if (!shellEl) return { destroy() {} };

  const ac = new AbortController();
  const signal = ac.signal;

  // Referenzen
  const sidebarLeft = shellEl.querySelector('.nc-shell__sidebar-left');
  const sidebarRight = shellEl.querySelector('.nc-shell__sidebar-right');
  const linkbarEl = shellEl.querySelector('.nc-shell__linkbar');
  const footerbarEl = shellEl.querySelector('.nc-shell__footerbar');

  // Overlay (fuer Off-Canvas-Drawer) — wird lazy erzeugt
  let overlayEl = null;

  const getOverlay = () => {
    if (!overlayEl) {
      overlayEl = document.createElement('div');
      overlayEl.className = 'nc-shell__sidebar-overlay';
      overlayEl.setAttribute('aria-hidden', 'true');
      shellEl.querySelector('.nc-shell__stage')?.appendChild(overlayEl);

      overlayEl.addEventListener('click', () => {
        closeAllDrawers();
      }, { signal });
    }
    return overlayEl;
  };

  // =========================================================================
  // Sidebar Toggle (Desktop: Collapse/Expand, Mobile: Off-Canvas Drawer)
  // =========================================================================

  /**
   * Schaltet eine Sidebar um.
   * Desktop: collapsed ↔ expanded (CSS-Klasse)
   * Mobile: Off-Canvas-Drawer oeffnen/schliessen
   */
  const toggleSidebar = (side) => {
    const sidebar = side === 'left' ? sidebarLeft : sidebarRight;
    if (!sidebar) return;

    const classCollapsed = `nc-shell--sidebar-${side}-collapsed`;
    const classDrawerOpen = `nc-shell--sidebar-${side}-drawer-open`;

    if (isDesktop()) {
      // Desktop: Toggle collapsed
      const nowCollapsed = shellEl.classList.toggle(classCollapsed);

      // ARIA aktualisieren
      sidebar.setAttribute('aria-hidden', String(nowCollapsed));

      // Icon wechseln
      updateToggleIcon(side, nowCollapsed);
    } else {
      // Mobile: Off-Canvas-Drawer
      const mobileMode = sidebar.dataset.sidebarMobile || 'drawer';
      if (mobileMode === 'hidden') return;

      const isOpen = shellEl.classList.contains(classDrawerOpen);

      if (isOpen) {
        closeDrawer(side);
      } else {
        openDrawer(side);
      }
    }
  };

  const openDrawer = (side) => {
    const sidebar = side === 'left' ? sidebarLeft : sidebarRight;
    if (!sidebar) return;

    // Andere Drawer schliessen
    closeAllDrawers();

    const classDrawerOpen = `nc-shell--sidebar-${side}-drawer-open`;
    shellEl.classList.add(classDrawerOpen);
    sidebar.setAttribute('aria-hidden', 'false');

    // Overlay anzeigen
    getOverlay().classList.add('nc-shell__sidebar-overlay--visible');

    // Body-Scroll blockieren
    document.body.style.overflow = 'hidden';

    // Focus in Sidebar setzen
    const firstFocusable = sidebar.querySelector('a, button, input, [tabindex]:not([tabindex="-1"])');
    if (firstFocusable) firstFocusable.focus();
  };

  const closeDrawer = (side) => {
    const classDrawerOpen = `nc-shell--sidebar-${side}-drawer-open`;
    shellEl.classList.remove(classDrawerOpen);

    const sidebar = side === 'left' ? sidebarLeft : sidebarRight;
    if (sidebar) sidebar.setAttribute('aria-hidden', 'true');

    // Overlay verstecken
    if (overlayEl) overlayEl.classList.remove('nc-shell__sidebar-overlay--visible');

    // Body-Scroll freigeben
    document.body.style.overflow = '';

    // Focus zurueck auf Toggle-Button
    const btn = shellEl.querySelector(`[data-shell-toggle="sidebar-${side}"]`);
    if (btn) btn.focus();
  };

  const closeAllDrawers = () => {
    closeDrawer('left');
    closeDrawer('right');
  };

  /**
   * Icon im Toggle-Button aktualisieren.
   */
  const updateToggleIcon = (side, collapsed) => {
    const btn = shellEl.querySelector(`[data-shell-toggle="sidebar-${side}"]`);
    if (!btn) return;

    const iconEl = btn.querySelector('.nc-shell__toggle-icon');
    if (!iconEl) return;

    if (side === 'left') {
      iconEl.innerHTML = collapsed ? ICON_SIDEBAR_L_EXPAND : ICON_SIDEBAR_L_COLLAPSE;
    } else {
      iconEl.innerHTML = collapsed ? ICON_SIDEBAR_R_EXPAND : ICON_SIDEBAR_R_COLLAPSE;
    }

    btn.setAttribute('aria-expanded', String(!collapsed));
    btn.setAttribute('aria-label',
      collapsed
        ? `${side === 'left' ? 'Linke' : 'Rechte'} Sidebar einblenden`
        : `${side === 'left' ? 'Linke' : 'Rechte'} Sidebar ausblenden`
    );
  };

  // Toggle-Buttons binden
  shellEl.querySelectorAll('[data-shell-toggle]').forEach((btn) => {
    const target = btn.dataset.shellToggle; // "sidebar-left" oder "sidebar-right"
    const side = target.replace('sidebar-', '');

    // Initiales Icon setzen
    if (!btn.querySelector('.nc-shell__toggle-icon')) {
      const span = document.createElement('span');
      span.className = 'nc-shell__toggle-icon';
      span.innerHTML = side === 'left' ? ICON_SIDEBAR_L_COLLAPSE : ICON_SIDEBAR_R_COLLAPSE;
      btn.appendChild(span);
    }

    // ARIA-Attribute
    btn.setAttribute('aria-expanded', 'true');
    btn.setAttribute('aria-controls', `shell-sidebar-${side}`);
    btn.setAttribute('aria-label',
      `${side === 'left' ? 'Linke' : 'Rechte'} Sidebar ausblenden`
    );

    btn.addEventListener('click', () => toggleSidebar(side), { signal });
  });

  // Sidebar-IDs setzen (fuer aria-controls)
  if (sidebarLeft && !sidebarLeft.id) sidebarLeft.id = 'shell-sidebar-left';
  if (sidebarRight && !sidebarRight.id) sidebarRight.id = 'shell-sidebar-right';

  // =========================================================================
  // ESC schliesst Drawer
  // =========================================================================

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const leftOpen = shellEl.classList.contains('nc-shell--sidebar-left-drawer-open');
      const rightOpen = shellEl.classList.contains('nc-shell--sidebar-right-drawer-open');
      if (leftOpen) closeDrawer('left');
      if (rightOpen) closeDrawer('right');
    }
  }, { signal });

  // =========================================================================
  // Responsive: Drawer schliessen bei Resize auf Desktop
  // =========================================================================

  const mql = window.matchMedia(`(min-width: ${LG_BREAKPOINT}px)`);

  const onBreakpointChange = (e) => {
    if (e.matches) {
      // Wechsel zu Desktop: Drawer schliessen
      closeAllDrawers();
    }
  };

  mql.addEventListener('change', onBreakpointChange, { signal });

  // =========================================================================
  // JSON-Rendering: Linkbar
  // =========================================================================

  const renderLinkbar = async () => {
    if (!linkbarEl) return;

    const url = options.linkbarUrl
      || shellEl.dataset.shellLinkbar
      || 'data/shell-linkbar.json';

    try {
      const res = await fetch(url, { signal });
      if (!res.ok) return;
      const data = await res.json();

      const leftZone = linkbarEl.querySelector('.nc-shell__linkbar-left');
      const rightZone = linkbarEl.querySelector('.nc-shell__linkbar-right');

      if (!leftZone || !rightZone || !data.items) return;

      data.items.forEach((item) => {
        const zone = item.position === 'right' ? rightZone : leftZone;

        if (item.type === 'icon-link') {
          const a = document.createElement('a');
          a.href = item.href || '#';
          a.setAttribute('aria-label', item.label || '');
          if (item.target) a.target = item.target;
          // Icon via Tabler-Sprite oder inline
          a.innerHTML = `<svg class="nc-icon nc-icon--xs"><use href="assets/icons/tabler-sprite.svg#${item.icon}"></use></svg>`;
          zone.appendChild(a);
        } else {
          // Standard-Link
          const a = document.createElement('a');
          a.href = item.href || '#';
          a.textContent = item.label || '';
          if (item.target) a.target = item.target;
          zone.appendChild(a);
        }
      });
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.warn('[shell] Linkbar-Daten konnten nicht geladen werden:', err.message);
      }
    }
  };

  // =========================================================================
  // JSON-Rendering: Footerbar
  // =========================================================================

  const renderFooterbar = async () => {
    if (!footerbarEl) return;

    const url = options.footerbarUrl
      || shellEl.dataset.shellFooterbar
      || 'data/shell-footerbar.json';

    try {
      const res = await fetch(url, { signal });
      if (!res.ok) return;
      const data = await res.json();

      const leftZone = footerbarEl.querySelector('.nc-shell__footerbar-left');
      const centerZone = footerbarEl.querySelector('.nc-shell__footerbar-center');
      const rightZone = footerbarEl.querySelector('.nc-shell__footerbar-right');

      if (!data.zones) return;

      // Template-Variablen
      const vars = {
        version: document.querySelector('meta[name="version"]')?.content || '0.0.0',
        date: document.querySelector('meta[name="last-changed"]')?.content
          || new Date().toISOString().slice(0, 10),
      };

      const renderZone = (items, container) => {
        if (!container || !items) return;
        items.forEach((item) => {
          const span = document.createElement('span');
          let text = item.template || item.label || '';
          // Platzhalter ersetzen: {{key}}
          text = text.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] || '');
          span.textContent = text;
          if (item.id) span.dataset.shellFooterbarItem = item.id;
          container.appendChild(span);
        });
      };

      renderZone(data.zones.left, leftZone);
      renderZone(data.zones.center, centerZone);
      renderZone(data.zones.right, rightZone);
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.warn('[shell] Footerbar-Daten konnten nicht geladen werden:', err.message);
      }
    }
  };

  // JSON-Daten laden
  renderLinkbar();
  renderFooterbar();

  // =========================================================================
  // Public API
  // =========================================================================

  return {
    toggleSidebar,
    openDrawer,
    closeDrawer,
    closeAllDrawers,
    destroy() {
      ac.abort();
      if (overlayEl) overlayEl.remove();
      document.body.style.overflow = '';
    },
  };
};

// ---------------------------------------------------------------------------
// Auto-Init
// ---------------------------------------------------------------------------

/**
 * Initialisiert alle .nc-shell Elemente auf der Seite.
 */
const setupShells = () => {
  document.querySelectorAll('.nc-shell').forEach((el) => {
    if (el._ncShell) return; // bereits initialisiert
    el._ncShell = setupShell(el);
  });
};

// ---------------------------------------------------------------------------
// Window Export
// ---------------------------------------------------------------------------

if (typeof window !== 'undefined') {
  window.setupShell = setupShell;
  window.setupShells = setupShells;
}
