// ============================================================
// Pricing — Auto-generated from pricing-recipe.json
// Version: 1.2.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/Pricing',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Pricing** v1.2.0 (stable)

Card: background-base, radius-xl, elevation-raised, padding spacing-06, Rahmen border-secondary (hairline).


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  name: 'Standard',
  render: () => `<div class="nc-pricing-card">
<div class="nc-price" style="margin-block-end: var(--fnd-spacing-04);">€ 0</div>
<ul class="nc-pricing-features">
<li class="nc-pricing-features__item">Feature A</li>
<li class="nc-pricing-features__item">Feature B</li>
</ul>
</div>`,
};
