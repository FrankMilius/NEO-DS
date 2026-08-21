// ============================================================
// BentoGrid — Auto-generated from bento-grid-recipe.json
// Version: 1.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/BentoGrid',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**BentoGrid** v1.0.0 (stable)

Root .nc-bento-grid: CSS Grid, repeat(--nc-bento-grid-columns, 1fr), grid-auto-rows minmax(--nc-bento-grid-cell-min, auto).


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
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/bento-grid.html</code>.
  </p>
  <div class="nc-bento-grid">
    <span class="nc-bento-grid__cell">cell</span>
    <span class="nc-bento-grid__title">title</span>
  </div>
</div>`,
};

export const Bento4Spalten = {
  name: 'Bento 4 Spalten',
  render: () => `<div style="border:1px dashed #92500a;border-radius:4px;padding:12px">
  <p style="margin:0 0 10px;font:600 12px/1.4 ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;color:#92500a">
    Kein echtes Markup hinterlegt
  </p>
  <p style="margin:0 0 12px;font:400 13px/1.5 system-ui,sans-serif;color:#595c59;max-width:62ch">
    Was hier steht, ist aus der Anatomie des Recipes abgeleitet — die Slots als
    Geschwister, ohne Schachtelung und ohne Zustaende. So sieht das Bauteil
    nicht aus. Echtes Markup gehoert nach
    <code style="font:inherit;font-family:ui-monospace,monospace">data/markup/bento-grid.html</code>.
  </p>
  <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-bento-grid">
    <span class="nc-bento-grid__cell">cell</span>
    <span class="nc-bento-grid__title">title</span>
  </div>
</div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Standard: 4 Spalten, eine grosse Feature-Zelle mit Mesh, Hover-Glow.' },
    },
  },
};
