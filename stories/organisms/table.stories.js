// ============================================================
// Table — Auto-generated from table-recipe.json
// Version: 2.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/Table',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Table** v2.0.0 (stable)

Einfache Vergleichstabelle mit inverser Header-Zeile.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-compare-table">
    <span class="nc-compare-table__sort-icon">sort-icon</span>
    <span class="nc-compare-table__checkbox">checkbox</span>
    <span class="nc-compare-table__numeric">numeric</span>
  </div>`,
};

export const LinesDefault = {
  name: 'Lines (Default)',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-compare-table">
    <span class="nc-compare-table__sort-icon">sort-icon</span>
    <span class="nc-compare-table__checkbox">checkbox</span>
    <span class="nc-compare-table__numeric">numeric</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Standard-Tabelle mit horizontalen Trennlinien und inverser Kopfzeile' },
    },
  },
};

export const Borderless = {
  name: 'Borderless',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-compare-table">
    <span class="nc-compare-table__sort-icon">sort-icon</span>
    <span class="nc-compare-table__checkbox">checkbox</span>
    <span class="nc-compare-table__numeric">numeric</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Tabelle ohne Trennlinien — nur Weissraum trennt Daten' },
    },
  },
};

export const Ghost = {
  name: 'Ghost',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-compare-table">
    <span class="nc-compare-table__sort-icon">sort-icon</span>
    <span class="nc-compare-table__checkbox">checkbox</span>
    <span class="nc-compare-table__numeric">numeric</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Dezente Tabelle fuer Card-Integration — transparenter Header, keine Borders' },
    },
  },
};

export const DensityComparison = {
  name: 'Density Comparison',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; flex-direction: column;">
  <div class="nc-compare-table">
    <span class="nc-compare-table__sort-icon">sort-icon</span>
    <span class="nc-compare-table__checkbox">checkbox</span>
    <span class="nc-compare-table__numeric">numeric</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Compact / Default / Expressive nebeneinander' },
    },
  },
};

export const StripedHover = {
  name: 'Striped + Hover',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-compare-table">
    <span class="nc-compare-table__sort-icon">sort-icon</span>
    <span class="nc-compare-table__checkbox">checkbox</span>
    <span class="nc-compare-table__numeric">numeric</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Zebra-Striping mit Row-Hover fuer verbesserte Zeilenorientierung' },
    },
  },
};

export const StickyHeader = {
  name: 'Sticky Header',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-compare-table">
    <span class="nc-compare-table__sort-icon">sort-icon</span>
    <span class="nc-compare-table__checkbox">checkbox</span>
    <span class="nc-compare-table__numeric">numeric</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Fixierter Header mit Shadow beim Scrollen' },
    },
  },
};

export const SortableHeaders = {
  name: 'Sortable Headers',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-compare-table">
    <span class="nc-compare-table__sort-icon">sort-icon</span>
    <span class="nc-compare-table__checkbox">checkbox</span>
    <span class="nc-compare-table__numeric">numeric</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Interaktive Spalten-Sortierung mit Sort-Icons und aria-sort' },
    },
  },
};

export const SelectableRows = {
  name: 'Selectable Rows',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-compare-table">
    <span class="nc-compare-table__sort-icon">sort-icon</span>
    <span class="nc-compare-table__checkbox">checkbox</span>
    <span class="nc-compare-table__numeric">numeric</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Checkbox-Spalte fuer Zeilen-Auswahl und Massenaktionen' },
    },
  },
};
