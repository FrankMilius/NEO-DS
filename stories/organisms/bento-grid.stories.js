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
  render: () => `<div class="nc-bento-grid">
    <span class="nc-bento-grid__cell">cell</span>
    <span class="nc-bento-grid__title">title</span>
  </div>`,
};

export const Bento4Spalten = {
  name: 'Bento 4 Spalten',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-bento-grid">
    <span class="nc-bento-grid__cell">cell</span>
    <span class="nc-bento-grid__title">title</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Standard: 4 Spalten, eine grosse Feature-Zelle mit Mesh, Hover-Glow.' },
    },
  },
};
