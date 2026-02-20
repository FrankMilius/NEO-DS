/**
 * DataTable – Vanilla JS Controller
 * ==================================
 * Token-basiertes, zugaengliches DataTable mit kombinierbaren Varianten.
 *
 * Verwendung:
 *   const dt = setupDataTable(containerEl, { sortable: true, ... });
 *
 * Auto-Init:
 *   setupDataTables() — initialisiert alle [data-dt-id] Container.
 *
 * Optionen:
 *   sortable      boolean           Tri-State Sort (none/asc/desc)
 *   selectable    false|'single'|'multi'   Zeilen-Auswahl
 *   expandable    boolean           Aufklappbare Zeilen
 *   paginated     boolean           Client-Pagination
 *   filterable    boolean           Globale Suche
 *   pageSize      number            Zeilen pro Seite (Standard: 25)
 *   pageSizeOptions number[]        Auswahlmoeglichkeiten (Standard: [10,25,50,100])
 *
 * Callbacks:
 *   onSort(column, direction)
 *   onSelect(selectedIds)
 *   onExpand(rowId, expanded)
 *   onPageChange(page, pageSize)
 *   onSearch(query)
 *   onBatchAction(actionId, selectedIds)
 *
 * API (Rueckgabewert):
 *   destroy()             Event-Listener entfernen
 *   refresh()             DOM-Zustand neu lesen
 *   getSelectedRows()     string[]
 *   setPage(n)            Seite wechseln
 *   getState()            Aktueller State-Snapshot
 */

// ---------------------------------------------------------------------------
// Setup: Einzelner DataTable
// ---------------------------------------------------------------------------

const setupDataTable = (container, options = {}) => {
  const opts = {
    sortable: false,
    selectable: false,     // false | 'single' | 'multi'
    expandable: false,
    paginated: false,
    filterable: false,
    pageSize: 25,
    pageSizeOptions: [10, 25, 50, 100],
    onSort: null,
    onSelect: null,
    onExpand: null,
    onPageChange: null,
    onSearch: null,
    onBatchAction: null,
    ...options,
  };

  // Fuer selectable: true → 'multi' normalisieren
  if (opts.selectable === true) opts.selectable = 'multi';

  // AbortController fuer sauberes Cleanup
  const ac = new AbortController();
  const signal = ac.signal;

  // ---- State ----

  const state = {
    sortColumn: null,
    sortDirection: 'none',       // 'none' | 'asc' | 'desc'
    selectedRows: new Set(),
    expandedRows: new Set(),
    currentPage: 1,
    pageSize: opts.pageSize,
    searchQuery: '',
    totalRows: 0,
  };

  // ---- DOM-Referenzen ----

  const table = container.querySelector('.nc-data-table__table');
  const thead = container.querySelector('.nc-data-table__thead');
  const tbody = container.querySelector('.nc-data-table__tbody');
  const batchBar = container.querySelector('.nc-data-table__batch-bar');
  const searchInput = container.querySelector('[data-dt-search]');
  const paginationEl = container.querySelector('.nc-data-table__pagination');

  // ---- Hilfsfunktionen ----

  /** Alle sichtbaren Daten-Zeilen (ohne Expand-Zeilen). */
  const getDataRows = () =>
    tbody
      ? [...tbody.querySelectorAll('.nc-data-table__row:not(.nc-data-table__row--expand)')]
      : [];

  /** Gesamtzahl Zeilen ermitteln. */
  const countTotalRows = () => {
    state.totalRows = getDataRows().length;
  };

  // =========================================================================
  // SORT
  // =========================================================================

  const updateSortIcons = () => {
    if (!thead) return;
    thead.querySelectorAll('[data-dt-sort]').forEach((btn) => {
      const col = btn.dataset.dtSort;
      const isThisCol = col === state.sortColumn;
      const dir = isThisCol ? state.sortDirection : 'none';
      const icons = btn.querySelectorAll('.nc-data-table__sort-icon');

      icons.forEach((icon) => {
        const iconState = icon.dataset.dtSortIcon; // 'none' | 'asc' | 'desc'
        const isVisible = iconState === dir;
        const isActive = dir !== 'none';

        icon.style.display = isVisible ? '' : 'none';
        icon.classList.toggle('nc-data-table__sort-icon--active', isVisible && isActive);
      });
    });
  };

  const handleSort = (column) => {
    // Tri-State-Zyklus: none → asc → desc → none
    if (state.sortColumn === column) {
      state.sortDirection =
        state.sortDirection === 'none' ? 'asc' :
        state.sortDirection === 'asc'  ? 'desc' : 'none';
    } else {
      state.sortColumn = column;
      state.sortDirection = 'asc';
    }

    // aria-sort aktualisieren
    if (thead) {
      thead.querySelectorAll('.nc-data-table__th').forEach((th) => {
        const col = th.dataset.dtCol;
        if (!col) return;
        if (col === column) {
          th.setAttribute('aria-sort',
            state.sortDirection === 'asc'  ? 'ascending' :
            state.sortDirection === 'desc' ? 'descending' : 'none'
          );
        } else {
          th.setAttribute('aria-sort', 'none');
        }
      });
    }

    updateSortIcons();

    // Client-seitige DOM-Sortierung
    sortRowsInDOM();

    if (typeof opts.onSort === 'function') {
      opts.onSort(state.sortColumn, state.sortDirection);
    }
  };

  /** Sortiert tbody-Zeilen im DOM (einfache Textsortierung). */
  const sortRowsInDOM = () => {
    if (!tbody || state.sortDirection === 'none') return;

    const rows = getDataRows();
    // Index der Sortierspalte ermitteln
    const headers = thead
      ? [...thead.querySelectorAll('.nc-data-table__th')]
      : [];
    const colIndex = headers.findIndex(
      (th) => th.dataset.dtCol === state.sortColumn
    );
    if (colIndex === -1) return;

    // Zeilen mit ihren Expand-Panels sammeln
    const rowPairs = rows.map((row) => {
      const expandPanel = row.nextElementSibling?.classList.contains(
        'nc-data-table__row--expand'
      )
        ? row.nextElementSibling
        : null;
      const cells = row.querySelectorAll('.nc-data-table__td');
      const cellText = cells[colIndex]
        ? cells[colIndex].textContent.trim()
        : '';
      return { row, expandPanel, cellText };
    });

    // Sortieren
    const dir = state.sortDirection === 'asc' ? 1 : -1;
    rowPairs.sort((a, b) => {
      // Numerisch versuchen
      const numA = parseFloat(a.cellText.replace(/[^0-9.,-]/g, '').replace(',', '.'));
      const numB = parseFloat(b.cellText.replace(/[^0-9.,-]/g, '').replace(',', '.'));
      if (!isNaN(numA) && !isNaN(numB)) {
        return (numA - numB) * dir;
      }
      // Datums-Vergleich (ISO oder DE-Format)
      const dateA = Date.parse(a.cellText);
      const dateB = Date.parse(b.cellText);
      if (!isNaN(dateA) && !isNaN(dateB)) {
        return (dateA - dateB) * dir;
      }
      // Text-Vergleich (locale-aware)
      return a.cellText.localeCompare(b.cellText, 'de', { sensitivity: 'base' }) * dir;
    });

    // DOM neu ordnen (keine Remove/Append → kein Flimmern, nur Reorder)
    const fragment = document.createDocumentFragment();
    rowPairs.forEach(({ row, expandPanel }) => {
      fragment.appendChild(row);
      if (expandPanel) fragment.appendChild(expandPanel);
    });
    tbody.appendChild(fragment);

    // Nach Sortierung: Pagination aktualisieren
    if (opts.paginated) showPage(state.currentPage);
  };

  const initSort = () => {
    if (!thead) return;

    thead.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-dt-sort]');
      if (!btn) return;
      handleSort(btn.dataset.dtSort);
    }, { signal });

    thead.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const btn = e.target.closest('[data-dt-sort]');
      if (!btn) return;
      e.preventDefault();
      handleSort(btn.dataset.dtSort);
    }, { signal });

    // Initial-Zustand: 'none'-Icon sichtbar, asc/desc versteckt
    updateSortIcons();
  };

  // =========================================================================
  // SELECTION
  // =========================================================================

  const updateSelectAllState = () => {
    const selectAll = container.querySelector('[data-dt-select-all]');
    if (!selectAll) return;
    const total = getDataRows().filter((r) => r.dataset.dtRowId).length;
    const selected = state.selectedRows.size;

    selectAll.checked = selected === total && total > 0;
    selectAll.indeterminate = selected > 0 && selected < total;
  };

  const updateBatchBar = () => {
    if (!batchBar) return;
    const count = state.selectedRows.size;
    const countEl = batchBar.querySelector('[data-dt-batch-count]');
    if (countEl) countEl.textContent = String(count);

    batchBar.hidden = count === 0;
  };

  const handleSelectAll = (checked) => {
    const rows = getDataRows().filter((r) => r.dataset.dtRowId);
    rows.forEach((row) => {
      const id = row.dataset.dtRowId;
      if (checked) {
        state.selectedRows.add(id);
        row.setAttribute('aria-selected', 'true');
      } else {
        state.selectedRows.delete(id);
        row.setAttribute('aria-selected', 'false');
      }
      const cb = row.querySelector('[data-dt-select-row]');
      if (cb) cb.checked = checked;
    });

    updateBatchBar();
    updateSelectAllState();

    if (typeof opts.onSelect === 'function') {
      opts.onSelect(Array.from(state.selectedRows));
    }
  };

  const handleSelectRow = (rowId, checked) => {
    // Single-Mode: alle anderen abwaehlen
    if (opts.selectable === 'single' && checked) {
      state.selectedRows.forEach((id) => {
        const row = tbody?.querySelector(`[data-dt-row-id="${CSS.escape(id)}"]`);
        if (row) {
          row.setAttribute('aria-selected', 'false');
          const cb = row.querySelector('[data-dt-select-row]');
          if (cb) cb.checked = false;
        }
      });
      state.selectedRows.clear();
    }

    const row = tbody?.querySelector(`[data-dt-row-id="${CSS.escape(rowId)}"]`);
    if (checked) {
      state.selectedRows.add(rowId);
      row?.setAttribute('aria-selected', 'true');
    } else {
      state.selectedRows.delete(rowId);
      row?.setAttribute('aria-selected', 'false');
    }

    updateSelectAllState();
    updateBatchBar();

    if (typeof opts.onSelect === 'function') {
      opts.onSelect(Array.from(state.selectedRows));
    }
  };

  const initSelection = () => {
    container.addEventListener('change', (e) => {
      const selectAll = e.target.closest('[data-dt-select-all]');
      if (selectAll) {
        handleSelectAll(selectAll.checked);
        return;
      }

      const selectRow = e.target.closest('[data-dt-select-row]');
      if (selectRow) {
        handleSelectRow(selectRow.dataset.dtSelectRow, selectRow.checked);
      }
    }, { signal });
  };

  // =========================================================================
  // BATCH ACTIONS
  // =========================================================================

  const initBatchActions = () => {
    if (!batchBar) return;

    batchBar.addEventListener('click', (e) => {
      const actionBtn = e.target.closest('[data-dt-batch-action]');
      if (actionBtn) {
        if (typeof opts.onBatchAction === 'function') {
          opts.onBatchAction(
            actionBtn.dataset.dtBatchAction,
            Array.from(state.selectedRows)
          );
        }
        return;
      }

      const cancelBtn = e.target.closest('[data-dt-batch-cancel]');
      if (cancelBtn) {
        handleSelectAll(false);
      }
    }, { signal });
  };

  // =========================================================================
  // EXPAND / COLLAPSE
  // =========================================================================

  const handleExpand = (rowId) => {
    const panel = container.querySelector(`#dt-expand-${CSS.escape(rowId)}`);
    const btn = container.querySelector(`[data-dt-expand="${CSS.escape(rowId)}"]`);
    if (!panel) return;

    const isExpanded = state.expandedRows.has(rowId);

    if (isExpanded) {
      state.expandedRows.delete(rowId);
      panel.hidden = true;
      btn?.setAttribute('aria-expanded', 'false');
    } else {
      state.expandedRows.add(rowId);
      panel.hidden = false;
      btn?.setAttribute('aria-expanded', 'true');
    }

    if (typeof opts.onExpand === 'function') {
      opts.onExpand(rowId, !isExpanded);
    }
  };

  const initExpand = () => {
    container.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-dt-expand]');
      if (!btn) return;
      handleExpand(btn.dataset.dtExpand);
    }, { signal });

    container.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const btn = e.target.closest('[data-dt-expand]');
      if (!btn) return;
      e.preventDefault();
      handleExpand(btn.dataset.dtExpand);
    }, { signal });
  };

  // =========================================================================
  // PAGINATION
  // =========================================================================

  /** Zeigt nur die Zeilen der aktuellen Seite, versteckt den Rest. */
  const showPage = (page) => {
    const rows = getDataRows();
    const maxPage = Math.max(1, Math.ceil(rows.length / state.pageSize));
    state.currentPage = Math.max(1, Math.min(page, maxPage));

    const start = (state.currentPage - 1) * state.pageSize;
    const end = start + state.pageSize;

    rows.forEach((row, i) => {
      const visible = i >= start && i < end;
      row.hidden = !visible;

      // Zugehoerige Expand-Zeile ebenfalls verstecken
      const expandPanel = row.nextElementSibling;
      if (expandPanel?.classList.contains('nc-data-table__row--expand')) {
        if (!visible) {
          expandPanel.hidden = true;
        } else {
          // Nur anzeigen wenn zuvor expanded
          const rowId = row.dataset.dtRowId;
          expandPanel.hidden = !(rowId && state.expandedRows.has(rowId));
        }
      }
    });

    updatePaginationUI();
  };

  const updatePaginationUI = () => {
    if (!paginationEl) return;
    const total = getDataRows().length;
    const maxPage = Math.max(1, Math.ceil(total / state.pageSize));
    const start = Math.min((state.currentPage - 1) * state.pageSize + 1, total);
    const end = Math.min(state.currentPage * state.pageSize, total);

    const info = paginationEl.querySelector('[data-dt-page-info]');
    if (info) info.textContent = `${start}\u2013${end} von ${total}`;

    // Page-Jump-Select aktualisieren
    const pageSelect = paginationEl.querySelector('[data-dt-page-select]');
    if (pageSelect) {
      const currentOptions = pageSelect.options.length;
      if (currentOptions !== maxPage) {
        pageSelect.innerHTML = '';
        for (let i = 1; i <= maxPage; i++) {
          const opt = document.createElement('option');
          opt.value = i;
          opt.textContent = i;
          pageSelect.appendChild(opt);
        }
      }
      pageSelect.value = state.currentPage;
    }
    // "von {n}" Label aktualisieren
    const pageMax = paginationEl.querySelector('[data-dt-page-max]');
    if (pageMax) pageMax.textContent = 'von ' + maxPage;

    const prevBtn = paginationEl.querySelector('[data-dt-page="first"]');
    const prevPageBtn = paginationEl.querySelector('[data-dt-page="prev"]');
    const nextBtn = paginationEl.querySelector('[data-dt-page="next"]');
    const lastBtn = paginationEl.querySelector('[data-dt-page="last"]');

    if (prevBtn) prevBtn.disabled = state.currentPage <= 1;
    if (prevPageBtn) prevPageBtn.disabled = state.currentPage <= 1;
    if (nextBtn) nextBtn.disabled = state.currentPage >= maxPage;
    if (lastBtn) lastBtn.disabled = state.currentPage >= maxPage;
  };

  const initPagination = () => {
    if (!paginationEl) return;

    paginationEl.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-dt-page]');
      if (!btn || btn.disabled) return;

      const action = btn.dataset.dtPage;
      const total = getDataRows().length;
      const maxPage = Math.max(1, Math.ceil(total / state.pageSize));

      switch (action) {
        case 'first': showPage(1); break;
        case 'prev':  showPage(state.currentPage - 1); break;
        case 'next':  showPage(state.currentPage + 1); break;
        case 'last':  showPage(maxPage); break;
      }

      if (typeof opts.onPageChange === 'function') {
        opts.onPageChange(state.currentPage, state.pageSize);
      }
    }, { signal });

    // Rows-Per-Page Select + Page-Jump Select
    paginationEl.addEventListener('change', (e) => {
      // Rows-Per-Page
      const rpp = e.target.closest('[data-dt-rows-per-page]');
      if (rpp) {
        state.pageSize = Number(rpp.value);
        showPage(1);
        if (typeof opts.onPageChange === 'function') {
          opts.onPageChange(state.currentPage, state.pageSize);
        }
        return;
      }
      // Page-Jump
      const pageJump = e.target.closest('[data-dt-page-select]');
      if (pageJump) {
        showPage(Number(pageJump.value));
        if (typeof opts.onPageChange === 'function') {
          opts.onPageChange(state.currentPage, state.pageSize);
        }
      }
    }, { signal });
  };

  // =========================================================================
  // SEARCH / FILTER
  // =========================================================================

  /** Client-seitige Filterung: Zeilen ein-/ausblenden. */
  const filterRows = (query) => {
    const rows = getDataRows();
    const lowerQuery = query.toLowerCase();

    rows.forEach((row) => {
      if (!query) {
        row.hidden = false;
        row.removeAttribute('data-dt-filtered');
      } else {
        const text = row.textContent.toLowerCase();
        const matches = text.includes(lowerQuery);
        row.hidden = !matches;
        row.setAttribute('data-dt-filtered', matches ? 'visible' : 'hidden');
      }

      // Zugehoerige Expand-Zeile ausblenden
      const expandPanel = row.nextElementSibling;
      if (expandPanel?.classList.contains('nc-data-table__row--expand')) {
        if (row.hidden) expandPanel.hidden = true;
      }
    });

    // Bei Pagination: Seite 1 zeigen nach Filter
    if (opts.paginated) {
      countTotalRows();
      showPage(1);
    }
  };

  const initSearch = () => {
    if (!searchInput) return;
    let debounceTimer;

    searchInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        state.searchQuery = e.target.value.trim();
        filterRows(state.searchQuery);

        if (typeof opts.onSearch === 'function') {
          opts.onSearch(state.searchQuery);
        }
      }, 250);
    }, { signal });
  };

  // =========================================================================
  // INITIALISIERUNG
  // =========================================================================

  const init = () => {
    countTotalRows();

    if (opts.sortable)   initSort();
    if (opts.selectable) initSelection();
    if (opts.expandable) initExpand();
    if (opts.paginated)  initPagination();
    if (opts.filterable) initSearch();
    initBatchActions();

    // Pagination: Erste Seite anzeigen
    if (opts.paginated) showPage(1);
  };

  init();

  // ---- Oeffentliche API ----

  return {
    /** Event-Listener sauber entfernen. */
    destroy() {
      ac.abort();
    },

    /** DOM-Zustand neu lesen (z.B. nach dynamischem Zeilenhinzufuegen). */
    refresh() {
      countTotalRows();
      if (opts.paginated) showPage(state.currentPage);
      updateSelectAllState();
      updateBatchBar();
    },

    /** Array der selektierten Row-IDs. */
    getSelectedRows() {
      return Array.from(state.selectedRows);
    },

    /** Zu bestimmter Seite springen. */
    setPage(page) {
      if (!opts.paginated) return;
      showPage(page);
      if (typeof opts.onPageChange === 'function') {
        opts.onPageChange(state.currentPage, state.pageSize);
      }
    },

    /** Aktuellen State-Snapshot (Kopie). */
    getState() {
      return {
        ...state,
        selectedRows: Array.from(state.selectedRows),
        expandedRows: Array.from(state.expandedRows),
      };
    },
  };
};

// ---------------------------------------------------------------------------
// Auto-Init: Alle DataTables auf der Seite initialisieren
// ---------------------------------------------------------------------------

const setupDataTables = () => {
  document.querySelectorAll('[data-dt-id]').forEach((container) => {
    // Keine Doppel-Initialisierung
    if (container._dataTable) return;

    const sel = container.dataset.dtSelectable;
    const options = {
      sortable:   container.hasAttribute('data-dt-sortable'),
      selectable: sel === '' || sel === 'multi' ? 'multi' : sel === 'single' ? 'single' : false,
      expandable: container.hasAttribute('data-dt-expandable'),
      paginated:  container.hasAttribute('data-dt-paginated'),
      filterable: container.hasAttribute('data-dt-filterable'),
      pageSize:   Number(container.dataset.dtPageSize) || 25,
    };

    container._dataTable = setupDataTable(container, options);
  });
};

// ---------------------------------------------------------------------------
// Export fuer manuelle und automatische Nutzung
// ---------------------------------------------------------------------------

if (typeof window !== 'undefined') {
  window.setupDataTable = setupDataTable;
  window.setupDataTables = setupDataTables;
}
