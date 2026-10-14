// ============================================================
// Events — Auto-generated from events-recipe.json
// Version: 1.3.1 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/Events',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Events** v1.3.1 (stable)

Website: block--block-content/inline-block--neo-events-listing.html.twig (identisch) und die Canvas-Komponente neo-events-listing geben <section class="nc-section"><div class="nc-container" data-neo-events-listing …> mit Filterleiste, Trefferzahl, leerem Raster, Leerzustand und „Mehr laden" aus. Eine Wurzel .nc-events gibt es dort nicht; die Arena setzt sie als Recipe-Wurzel.


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
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/events.html</code>.
  </p>
  <div class="nc-events">
    <span class="nc-events__filter-bar">filter-bar</span>
    <span class="nc-events__search">search</span>
    <span class="nc-events__search-wrapper">search-wrapper</span>
    <span class="nc-events__search-icon">search-icon</span>
    <span class="nc-events__search-input">search-input</span>
    <span class="nc-events__filter-select">filter-select</span>
    <span class="nc-events__results-count">results-count</span>
    <span class="nc-events__grid">grid</span>
  </div>
</div>`,
};

export const Standard = {
  name: 'Standard',
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/events.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-events">
    <span class="nc-events__filter-bar">filter-bar</span>
    <span class="nc-events__search">search</span>
    <span class="nc-events__search-wrapper">search-wrapper</span>
    <span class="nc-events__search-icon">search-icon</span>
    <span class="nc-events__search-input">search-input</span>
    <span class="nc-events__filter-select">filter-select</span>
    <span class="nc-events__results-count">results-count</span>
    <span class="nc-events__grid">grid</span>
  </div>
</div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'events wie auf der Website' },
    },
  },
};

export const KeineTreffer = {
  name: 'Keine Treffer',
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/events.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-events">
    <span class="nc-events__filter-bar">filter-bar</span>
    <span class="nc-events__search">search</span>
    <span class="nc-events__search-wrapper">search-wrapper</span>
    <span class="nc-events__search-icon">search-icon</span>
    <span class="nc-events__search-input">search-input</span>
    <span class="nc-events__filter-select">filter-select</span>
    <span class="nc-events__results-count">results-count</span>
    <span class="nc-events__grid">grid</span>
  </div>
</div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Leerzustand: Trefferzahl 0, .nc-events__empty statt Raster und „Mehr laden".' },
    },
  },
};

export const NurRaster = {
  name: 'Nur Raster',
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/events.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-events">
    <span class="nc-events__filter-bar">filter-bar</span>
    <span class="nc-events__search">search</span>
    <span class="nc-events__search-wrapper">search-wrapper</span>
    <span class="nc-events__search-icon">search-icon</span>
    <span class="nc-events__search-input">search-input</span>
    <span class="nc-events__filter-select">filter-select</span>
    <span class="nc-events__results-count">results-count</span>
    <span class="nc-events__grid">grid</span>
  </div>
</div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Ohne Filterleiste, Trefferzahl und „Mehr laden" (optionale Slots aus).' },
    },
  },
};
