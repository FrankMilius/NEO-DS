// ============================================================
// DataTable — Auto-generated from data-table-recipe.json
// Version: 2.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/DataTable',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**DataTable** v2.0.0 (stable)

Wrapper: border, radius, overflow:hidden. Semantisches <table> mit <thead>/<tbody>.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-data-table">
    <span class="nc-data-table__scroll-container">scroll-container</span>
    <span class="nc-data-table__table">table</span>
    <span class="nc-data-table__thead">thead</span>
    <span class="nc-data-table__tbody">tbody</span>
    <span class="nc-data-table__row">row</span>
    <span class="nc-data-table__th">th</span>
    <span class="nc-data-table__td">td</span>
  </div>`,
};

export const BasicTable = {
  name: 'Basic Table',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-data-table">
    <span class="nc-data-table__scroll-container">scroll-container</span>
    <span class="nc-data-table__table">table</span>
    <span class="nc-data-table__thead">thead</span>
    <span class="nc-data-table__tbody">tbody</span>
    <span class="nc-data-table__row">row</span>
    <span class="nc-data-table__th">th</span>
    <span class="nc-data-table__td">td</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Einfache Tabelle ohne interaktive Features' },
    },
  },
};

export const DensityVariants = {
  name: 'Density Variants',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Default (40px), Compact (32px), Comfortable (48px)' },
    },
  },
};

export const SortableTable = {
  name: 'Sortable Table',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-data-table">
    <span class="nc-data-table__scroll-container">scroll-container</span>
    <span class="nc-data-table__table">table</span>
    <span class="nc-data-table__thead">thead</span>
    <span class="nc-data-table__tbody">tbody</span>
    <span class="nc-data-table__row">row</span>
    <span class="nc-data-table__th">th</span>
    <span class="nc-data-table__td">td</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Tabelle mit sortierbaren Spaltenkoepfen' },
    },
  },
};

export const SelectableTable = {
  name: 'Selectable Table',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-data-table">
    <span class="nc-data-table__scroll-container">scroll-container</span>
    <span class="nc-data-table__table">table</span>
    <span class="nc-data-table__thead">thead</span>
    <span class="nc-data-table__tbody">tbody</span>
    <span class="nc-data-table__row">row</span>
    <span class="nc-data-table__th">th</span>
    <span class="nc-data-table__td">td</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Tabelle mit Zeilen-Checkboxen und Batch-Actions (Zaehler + Clear All)' },
    },
  },
};

export const RadioSelection = {
  name: 'Radio Selection',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-data-table">
    <span class="nc-data-table__scroll-container">scroll-container</span>
    <span class="nc-data-table__table">table</span>
    <span class="nc-data-table__thead">thead</span>
    <span class="nc-data-table__tbody">tbody</span>
    <span class="nc-data-table__row">row</span>
    <span class="nc-data-table__th">th</span>
    <span class="nc-data-table__td">td</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Einzelauswahl per Radio-Button fuer Prozess-Selektion' },
    },
  },
};

export const ExpandableTable = {
  name: 'Expandable Table',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-data-table">
    <span class="nc-data-table__scroll-container">scroll-container</span>
    <span class="nc-data-table__table">table</span>
    <span class="nc-data-table__thead">thead</span>
    <span class="nc-data-table__tbody">tbody</span>
    <span class="nc-data-table__row">row</span>
    <span class="nc-data-table__th">th</span>
    <span class="nc-data-table__td">td</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Tabelle mit aufklappbaren Detail-Zeilen' },
    },
  },
};

export const CardVariant = {
  name: 'Card Variant',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-data-table">
    <span class="nc-data-table__scroll-container">scroll-container</span>
    <span class="nc-data-table__table">table</span>
    <span class="nc-data-table__thead">thead</span>
    <span class="nc-data-table__tbody">tbody</span>
    <span class="nc-data-table__row">row</span>
    <span class="nc-data-table__th">th</span>
    <span class="nc-data-table__td">td</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Erhobene Tabelle mit Card-Shadow' },
    },
  },
};

export const GlassVariant = {
  name: 'Glass Variant',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-data-table">
    <span class="nc-data-table__scroll-container">scroll-container</span>
    <span class="nc-data-table__table">table</span>
    <span class="nc-data-table__thead">thead</span>
    <span class="nc-data-table__tbody">tbody</span>
    <span class="nc-data-table__row">row</span>
    <span class="nc-data-table__th">th</span>
    <span class="nc-data-table__td">td</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Transparente Dashboard-Tabelle mit Backdrop-Blur' },
    },
  },
};
