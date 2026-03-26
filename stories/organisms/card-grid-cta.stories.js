// ============================================================
// CardGridCta — Auto-generated from card-grid-cta-recipe.json
// Version: 1.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/CardGridCta',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**CardGridCta** v1.0.0 (stable)

Hero-artige Teaser-Karten mit BG-Media + Headline + CTA.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-card-grid-cta">
    card-grid-cta
  </div>`,
};

export const CardGridCTA = {
  name: 'Card Grid CTA',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-card-grid-cta">
    card-grid-cta
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Hero-artige Teaser-Karten mit BG-Media + Headline + CTA.' },
    },
  },
};
