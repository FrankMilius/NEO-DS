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
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/data-table.html</code>.
  </p>
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
};

export const BasicTable = {
  name: 'Basic Table',
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/data-table.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-data-table">
    <span class="nc-data-table__scroll-container">scroll-container</span>
    <span class="nc-data-table__table">table</span>
    <span class="nc-data-table__thead">thead</span>
    <span class="nc-data-table__tbody">tbody</span>
    <span class="nc-data-table__row">row</span>
    <span class="nc-data-table__th">th</span>
    <span class="nc-data-table__td">td</span>
  </div>
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
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/data-table.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Default (40px), Compact (32px), Comfortable (48px)' },
    },
  },
};

export const SortableTable = {
  name: 'Sortable Table',
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/data-table.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-data-table">
    <span class="nc-data-table__scroll-container">scroll-container</span>
    <span class="nc-data-table__table">table</span>
    <span class="nc-data-table__thead">thead</span>
    <span class="nc-data-table__tbody">tbody</span>
    <span class="nc-data-table__row">row</span>
    <span class="nc-data-table__th">th</span>
    <span class="nc-data-table__td">td</span>
  </div>
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
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/data-table.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-data-table">
    <span class="nc-data-table__scroll-container">scroll-container</span>
    <span class="nc-data-table__table">table</span>
    <span class="nc-data-table__thead">thead</span>
    <span class="nc-data-table__tbody">tbody</span>
    <span class="nc-data-table__row">row</span>
    <span class="nc-data-table__th">th</span>
    <span class="nc-data-table__td">td</span>
  </div>
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
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/data-table.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-data-table">
    <span class="nc-data-table__scroll-container">scroll-container</span>
    <span class="nc-data-table__table">table</span>
    <span class="nc-data-table__thead">thead</span>
    <span class="nc-data-table__tbody">tbody</span>
    <span class="nc-data-table__row">row</span>
    <span class="nc-data-table__th">th</span>
    <span class="nc-data-table__td">td</span>
  </div>
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
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/data-table.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-data-table">
    <span class="nc-data-table__scroll-container">scroll-container</span>
    <span class="nc-data-table__table">table</span>
    <span class="nc-data-table__thead">thead</span>
    <span class="nc-data-table__tbody">tbody</span>
    <span class="nc-data-table__row">row</span>
    <span class="nc-data-table__th">th</span>
    <span class="nc-data-table__td">td</span>
  </div>
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
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/data-table.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-data-table">
    <span class="nc-data-table__scroll-container">scroll-container</span>
    <span class="nc-data-table__table">table</span>
    <span class="nc-data-table__thead">thead</span>
    <span class="nc-data-table__tbody">tbody</span>
    <span class="nc-data-table__row">row</span>
    <span class="nc-data-table__th">th</span>
    <span class="nc-data-table__td">td</span>
  </div>
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
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/data-table.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-data-table">
    <span class="nc-data-table__scroll-container">scroll-container</span>
    <span class="nc-data-table__table">table</span>
    <span class="nc-data-table__thead">thead</span>
    <span class="nc-data-table__tbody">tbody</span>
    <span class="nc-data-table__row">row</span>
    <span class="nc-data-table__th">th</span>
    <span class="nc-data-table__td">td</span>
  </div>
</div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Transparente Dashboard-Tabelle mit Backdrop-Blur' },
    },
  },
};
