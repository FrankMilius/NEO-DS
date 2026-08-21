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
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/table.html</code>.
  </p>
  <div class="nc-compare-table">
    <span class="nc-compare-table__sort-icon">sort-icon</span>
    <span class="nc-compare-table__checkbox">checkbox</span>
    <span class="nc-compare-table__numeric">numeric</span>
  </div>
</div>`,
};

export const LinesDefault = {
  name: 'Lines (Default)',
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/table.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-compare-table">
    <span class="nc-compare-table__sort-icon">sort-icon</span>
    <span class="nc-compare-table__checkbox">checkbox</span>
    <span class="nc-compare-table__numeric">numeric</span>
  </div>
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
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/table.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-compare-table">
    <span class="nc-compare-table__sort-icon">sort-icon</span>
    <span class="nc-compare-table__checkbox">checkbox</span>
    <span class="nc-compare-table__numeric">numeric</span>
  </div>
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
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/table.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-compare-table">
    <span class="nc-compare-table__sort-icon">sort-icon</span>
    <span class="nc-compare-table__checkbox">checkbox</span>
    <span class="nc-compare-table__numeric">numeric</span>
  </div>
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
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/table.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; flex-direction: column;">
  <div class="nc-compare-table">
    <span class="nc-compare-table__sort-icon">sort-icon</span>
    <span class="nc-compare-table__checkbox">checkbox</span>
    <span class="nc-compare-table__numeric">numeric</span>
  </div>
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
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/table.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-compare-table">
    <span class="nc-compare-table__sort-icon">sort-icon</span>
    <span class="nc-compare-table__checkbox">checkbox</span>
    <span class="nc-compare-table__numeric">numeric</span>
  </div>
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
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/table.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-compare-table">
    <span class="nc-compare-table__sort-icon">sort-icon</span>
    <span class="nc-compare-table__checkbox">checkbox</span>
    <span class="nc-compare-table__numeric">numeric</span>
  </div>
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
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/table.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-compare-table">
    <span class="nc-compare-table__sort-icon">sort-icon</span>
    <span class="nc-compare-table__checkbox">checkbox</span>
    <span class="nc-compare-table__numeric">numeric</span>
  </div>
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
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/table.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-compare-table">
    <span class="nc-compare-table__sort-icon">sort-icon</span>
    <span class="nc-compare-table__checkbox">checkbox</span>
    <span class="nc-compare-table__numeric">numeric</span>
  </div>
</div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Checkbox-Spalte fuer Zeilen-Auswahl und Massenaktionen' },
    },
  },
};
