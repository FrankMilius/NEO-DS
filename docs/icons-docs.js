// ==========================================================================
// Icons Docs — Tab Navigation, Manifest Loading, Search, Filter, Grid
// ==========================================================================

(function () {
  'use strict';

  // -----------------------------------------------------------------------
  // Tab Navigation
  // -----------------------------------------------------------------------

  const tabContainer = document.getElementById('icons-tabs');
  if (tabContainer) {
    const triggers = tabContainer.querySelectorAll('[role="tab"]');
    const panels = tabContainer.querySelectorAll('[role="tabpanel"]');

    const activateTab = (trigger) => {
      triggers.forEach((t) => {
        t.setAttribute('aria-selected', 'false');
        t.setAttribute('tabindex', '-1');
      });
      panels.forEach((p) => p.classList.remove('is-active'));

      trigger.setAttribute('aria-selected', 'true');
      trigger.removeAttribute('tabindex');
      const panel = document.getElementById(trigger.getAttribute('aria-controls'));
      if (panel) panel.classList.add('is-active');
    };

    triggers.forEach((trigger) => {
      trigger.addEventListener('click', () => activateTab(trigger));
      trigger.addEventListener('keydown', (e) => {
        const idx = Array.from(triggers).indexOf(trigger);
        let next = -1;
        if (e.key === 'ArrowRight') next = (idx + 1) % triggers.length;
        if (e.key === 'ArrowLeft') next = (idx - 1 + triggers.length) % triggers.length;
        if (e.key === 'Home') next = 0;
        if (e.key === 'End') next = triggers.length - 1;
        if (next >= 0) {
          e.preventDefault();
          activateTab(triggers[next]);
          triggers[next].focus();
        }
      });
    });
  }

  // -----------------------------------------------------------------------
  // Sidebar Toggle (mobile)
  // -----------------------------------------------------------------------

  const sidebar = document.getElementById('docs-sidebar');
  const sidebarOpen = document.getElementById('docs-sidebar-open');
  const sidebarClose = document.getElementById('docs-sidebar-close');
  const sidebarOverlay = document.getElementById('docs-sidebar-overlay');

  const openSidebar = () => {
    if (sidebar) sidebar.classList.add('is-open');
    if (sidebarOverlay) sidebarOverlay.classList.add('is-visible');
  };
  const closeSidebar = () => {
    if (sidebar) sidebar.classList.remove('is-open');
    if (sidebarOverlay) sidebarOverlay.classList.remove('is-visible');
  };

  if (sidebarOpen) sidebarOpen.addEventListener('click', openSidebar);
  if (sidebarClose) sidebarClose.addEventListener('click', closeSidebar);
  if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeSidebar);

  // Sidebar section toggles
  document.querySelectorAll('.docs-sidebar__toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      const list = document.getElementById(btn.getAttribute('aria-controls'));
      if (list) list.style.display = expanded ? 'none' : '';
    });
  });

  // -----------------------------------------------------------------------
  // Constants
  // -----------------------------------------------------------------------

  const ICON_SIZES = [
    { key: 'xs',  px: 16, label: 'XS',  token: '--nc-icon-size-xs',  cssClass: '.icon--xs',  desc: 'Kompakte UIs' },
    { key: 'sm',  px: 20, label: 'SM',  token: '--nc-icon-size-sm',  cssClass: '.icon--sm',  desc: 'Default', isDefault: true },
    { key: 'md',  px: 24, label: 'MD',  token: '--nc-icon-size-md',  cssClass: '.icon--md',  desc: 'Navigation' },
    { key: 'lg',  px: 28, label: 'LG',  token: '--nc-icon-size-lg',  cssClass: '.icon--lg',  desc: 'Hervorgehoben' },
    { key: 'xl',  px: 32, label: 'XL',  token: '--nc-icon-size-xl',  cssClass: '.icon--xl',  desc: 'Features' },
    { key: '2xl', px: 36, label: '2XL', token: '--nc-icon-size-2xl', cssClass: '.icon--2xl', desc: 'Hero' }
  ];

  const BUTTON_ICON_MAP = [
    { btn: 'XS',  height: '24px',  fontSize: '12px', iconKey: 'xs',  iconPx: 16, ratio: '1.33' },
    { btn: 'SM',  height: '32px',  fontSize: '12px', iconKey: 'xs',  iconPx: 16, ratio: '1.33' },
    { btn: 'MD',  height: '40px',  fontSize: '16px', iconKey: 'sm',  iconPx: 20, ratio: '1.25' },
    { btn: 'LG',  height: '48px',  fontSize: '16px', iconKey: 'sm',  iconPx: 20, ratio: '1.25' }
  ];

  // Real library icon for previews: "settings" (category: settings, file: settings.svg)
  const SAMPLE_SVG = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g><rect x="0" y="0" width="24" height="24" rx="3"></rect><g><polygon points="0 0 24 0 24 24 0 24"></polygon><path d="M19,6.873 C19.6234513,7.23292309 20.0053693,7.90013379 20.0000559,8.62 L20.0000559,15.156 C19.9998281,15.8822818 19.6059422,16.5513902 18.971,16.904 L12.971,20.737 C12.3671034,21.0723689 11.6328966,21.0723689 11.029,20.737 L5.029,16.904 C4.39437058,16.5515641 4.00053487,15.8829237 4,15.157 L4,8.62 C4.0001719,7.89371815 4.39405775,7.22460983 5.029,6.872 L11.029,3.3 C11.6507466,2.95389748 12.4072534,2.95389748 13.029,3.3 L19.029,6.873 L19,6.873 Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><circle stroke="currentColor" stroke-width="1.5" cx="12" cy="12" r="3"></circle></g></g></g></svg>';

  // -----------------------------------------------------------------------
  // Render: Icon Size Grid (Overview Tab)
  // -----------------------------------------------------------------------

  const sizeGrid = document.getElementById('icons-size-grid');
  if (sizeGrid) {
    sizeGrid.innerHTML = ICON_SIZES.map((s) => {
      const defaultBadge = s.isDefault
        ? '<span class="icons-size-card__default-badge">Default</span>'
        : '';
      return '<div class="icons-size-card' + (s.isDefault ? ' icons-size-card--active' : '') + '">' +
        '<div class="icons-size-card__preview" style="width:' + s.px + 'px;height:' + s.px + 'px;">' + SAMPLE_SVG + '</div>' +
        '<div class="icons-size-card__label">' + s.label + ' ' + defaultBadge + '</div>' +
        '<div class="icons-size-card__value">' + s.px + 'px</div>' +
        '<div class="icons-size-card__token"><code>' + s.token + '</code></div>' +
      '</div>';
    }).join('');
  }

  // -----------------------------------------------------------------------
  // Render: Button-Icon Mapping Table (Overview Tab)
  // -----------------------------------------------------------------------

  const mappingTable = document.getElementById('icons-mapping-table');
  if (mappingTable) {
    const tbody = mappingTable.querySelector('tbody');
    if (tbody) {
      tbody.innerHTML = BUTTON_ICON_MAP.map((m) => {
        return '<tr>' +
          '<td><strong>' + m.btn + '</strong></td>' +
          '<td>' + m.height + '</td>' +
          '<td>' + m.fontSize + '</td>' +
          '<td><code>--nc-button-icon-size-' + m.btn.toLowerCase() + '</code></td>' +
          '<td>' + m.iconPx + 'px</td>' +
          '<td>' + m.ratio + '&times;</td>' +
          '<td><span class="nc-button__icon" style="display:inline-flex;align-items:center;justify-content:center;width:' + m.iconPx + 'px;height:' + m.iconPx + 'px;color:var(--fnd-color-text-primary);">' + SAMPLE_SVG + '</span></td>' +
        '</tr>';
      }).join('');
    }
  }

  // -----------------------------------------------------------------------
  // Render: Button-Icon Mapping Stage (Overview Tab)
  // -----------------------------------------------------------------------

  const mappingStage = document.getElementById('icons-mapping-stage');
  if (mappingStage) {
    mappingStage.innerHTML = BUTTON_ICON_MAP.map((m) => {
      var sizeMod = m.btn.toLowerCase() === 'md' ? '' : ' nc-button--' + m.btn.toLowerCase();
      return '<div class="icons-mapping-stage__item">' +
        '<div class="icons-mapping-stage__label">' + m.btn + '</div>' +
        '<button class="nc-button' + sizeMod + '">' +
          '<span class="nc-button__icon">' + SAMPLE_SVG + '</span>' +
          'Button' +
        '</button>' +
      '</div>';
    }).join('');
  }

  // -----------------------------------------------------------------------
  // Manifest Loading + Library
  // -----------------------------------------------------------------------

  let manifest = null;
  let allIcons = [];
  let categories = [];

  const iconsGrid = document.getElementById('icons-grid');
  const iconsEmpty = document.getElementById('icons-empty');
  const iconsCount = document.getElementById('icons-count');
  const searchInput = document.getElementById('icons-search');
  const categoryFilter = document.getElementById('icons-category-filter');

  // Load manifest
  fetch('../data/icons-manifest.json')
    .then((res) => res.json())
    .then((data) => {
      manifest = data;
      allIcons = data.icons || [];
      categories = data.categories || [];
      populateCategoryFilter();
      renderIcons(allIcons);
    })
    .catch((err) => {
      console.error('Failed to load icons manifest:', err);
      if (iconsGrid) {
        iconsGrid.innerHTML = '<div class="icons-empty"><div class="icons-empty__text">Fehler beim Laden des Icon-Manifests.</div></div>';
      }
    });

  // Populate category dropdown
  function populateCategoryFilter() {
    if (!categoryFilter) return;
    categories.forEach((cat) => {
      const opt = document.createElement('option');
      opt.value = cat;
      opt.textContent = cat;
      categoryFilter.appendChild(opt);
    });
  }

  // Render icon grid
  function renderIcons(icons) {
    if (!iconsGrid) return;

    if (icons.length === 0) {
      iconsGrid.style.display = 'none';
      if (iconsEmpty) iconsEmpty.style.display = '';
      if (iconsCount) iconsCount.textContent = '0 Icons';
      return;
    }

    iconsGrid.style.display = '';
    if (iconsEmpty) iconsEmpty.style.display = 'none';
    if (iconsCount) iconsCount.textContent = icons.length + ' Icon' + (icons.length !== 1 ? 's' : '');

    iconsGrid.innerHTML = icons.map((icon) => {
      const preview = icon.svg
        ? icon.svg
        : '<span style="font-size:0.625rem;color:var(--fnd-color-text-tertiary);">PNG</span>';

      return '<div class="icons-grid__card" data-icon-name="' + escHtml(icon.name) + '" data-icon-category="' + escHtml(icon.category) + '">' +
        '<div class="icons-grid__preview">' + preview + '</div>' +
        '<div class="icons-grid__name">' + escHtml(icon.name) + '</div>' +
        '<span class="icons-grid__category">' + escHtml(icon.category) + '</span>' +
        '<button class="icons-grid__download" title="Download ' + escHtml(icon.name) + '" data-path="' + escHtml(icon.path) + '" data-type="' + icon.type + '" data-svg="' + (icon.svg ? '1' : '') + '">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>' +
        '</button>' +
      '</div>';
    }).join('');
  }

  // HTML escape helper
  function escHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // -----------------------------------------------------------------------
  // Search + Filter
  // -----------------------------------------------------------------------

  let searchTimeout = null;

  function filterIcons() {
    const query = (searchInput ? searchInput.value : '').trim().toLowerCase();
    const cat = categoryFilter ? categoryFilter.value : '';

    let filtered = allIcons;

    // Category filter
    if (cat) {
      filtered = filtered.filter((icon) => icon.category === cat);
    }

    // Full-text search across keywords
    if (query) {
      filtered = filtered.filter((icon) => {
        // Match against name, category, and keywords
        if (icon.name.toLowerCase().includes(query)) return true;
        if (icon.category.toLowerCase().includes(query)) return true;
        if (icon.keywords && icon.keywords.some((kw) => kw.toLowerCase().includes(query))) return true;
        return false;
      });
    }

    renderIcons(filtered);
  }

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(filterIcons, 200);
    });
  }

  if (categoryFilter) {
    categoryFilter.addEventListener('change', filterIcons);
  }

  // -----------------------------------------------------------------------
  // Download
  // -----------------------------------------------------------------------

  if (iconsGrid) {
    iconsGrid.addEventListener('click', (e) => {
      const btn = e.target.closest('.icons-grid__download');
      if (!btn) return;

      const card = btn.closest('.icons-grid__card');
      const iconName = card ? card.dataset.iconName : 'icon';
      const isSvg = btn.dataset.svg === '1';
      const iconPath = btn.dataset.path;

      if (isSvg) {
        // Find the icon in manifest and download inline SVG
        const icon = allIcons.find((i) => i.path === iconPath);
        if (icon && icon.svg) {
          downloadBlob(icon.svg, iconName + '.svg', 'image/svg+xml');
        }
      } else {
        // For PNGs: open the file path directly
        window.open('../assets/icons/' + iconPath, '_blank');
      }
    });
  }

  function downloadBlob(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }

})();
