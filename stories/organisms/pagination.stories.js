// ============================================================
// Pagination — Auto-generated from pagination-recipe.json
// Version: 2.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/Pagination',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Pagination** v2.0.0 (stable)

Root: <nav aria-label='Seitennavigation'> — landmark fuer Screen Reader.


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
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/pagination.html</code>.
  </p>
  <div class="nc-pagination">
    <span class="nc-pagination__prev">prev</span>
    <span class="nc-pagination__list">list</span>
    <span class="nc-pagination__item">item</span>
    <span class="nc-pagination__next">next</span>
  </div>
</div>`,
};

export const AppearanceComparison = {
  name: 'Appearance Comparison',
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/pagination.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-pagination">
    <span class="nc-pagination__prev">prev</span>
    <span class="nc-pagination__list">list</span>
    <span class="nc-pagination__item">item</span>
    <span class="nc-pagination__next">next</span>
  </div>
</div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Default vs Pill vs Outline vs Minimal' },
    },
  },
};

export const SizeComparison = {
  name: 'Size Comparison',
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/pagination.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'MD (32px) vs SM (28px) mit Touch-Target' },
    },
  },
};

export const RaisedShadow = {
  name: 'Raised (Shadow)',
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/pagination.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-pagination">
    <span class="nc-pagination__prev">prev</span>
    <span class="nc-pagination__list">list</span>
    <span class="nc-pagination__item">item</span>
    <span class="nc-pagination__next">next</span>
  </div>
</div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Aktive Seite mit Schatten — haptisches Feedback' },
    },
  },
};

export const WithActiveIndicator = {
  name: 'With Active Indicator',
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/pagination.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-pagination">
    <span class="nc-pagination__prev">prev</span>
    <span class="nc-pagination__list">list</span>
    <span class="nc-pagination__item">item</span>
    <span class="nc-pagination__next">next</span>
  </div>
</div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Aktive Seite mit Unterlinie — verbesserte visuelle Erkennbarkeit' },
    },
  },
};

export const WithJumper = {
  name: 'With Jumper',
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/pagination.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-pagination">
    <span class="nc-pagination__prev">prev</span>
    <span class="nc-pagination__list">list</span>
    <span class="nc-pagination__item">item</span>
    <span class="nc-pagination__next">next</span>
  </div>
</div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Go-to-Page Input fuer schnelle Navigation bei vielen Seiten' },
    },
  },
};

export const MinimalMobile = {
  name: 'Minimal (Mobile)',
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/pagination.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-pagination">
    <span class="nc-pagination__prev">prev</span>
    <span class="nc-pagination__list">list</span>
    <span class="nc-pagination__item">item</span>
    <span class="nc-pagination__next">next</span>
  </div>
</div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Nur Prev + \'Seite X von Y\' + Next — ideal fuer Mobile und schmale Container' },
    },
  },
};

export const AlignmentVariants = {
  name: 'Alignment Variants',
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/pagination.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-pagination">
    <span class="nc-pagination__prev">prev</span>
    <span class="nc-pagination__list">list</span>
    <span class="nc-pagination__item">item</span>
    <span class="nc-pagination__next">next</span>
  </div>
</div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Start, Center, End, Between' },
    },
  },
};
