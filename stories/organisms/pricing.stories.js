// ============================================================
// Pricing — Auto-generated from pricing-recipe.json
// Version: 1.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/Pricing',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Pricing** v1.0.0 (stable)

Card: background-base, radius-xl, elevation-raised.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  name: 'Standard',
  render: () => `<!-- @quelle: geerntet von Doku /docs/pricing-docs.html -->
<!-- @punkte: 11 -->`,
};

export const Standard = {
  name: 'Standard',
  render: () => `<div class="nc-pricing-card" style="padding: var(--fnd-spacing-06); border: 1px solid var(--fnd-color-border-secondary);">
<div class="nc-price" style="margin-block-end: var(--fnd-spacing-04);">€ 0</div>
<ul class="nc-feature-list">
<li class="nc-feature-list__item">Feature A</li>
<li class="nc-feature-list__item">Feature B</li>
</ul>
</div>`,
};
