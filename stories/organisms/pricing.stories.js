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
  render: () => `<div class="nc-pricing-card">
    <span class="nc-price">price</span>
  </div>`,
};

export const PricingVariants = {
  name: 'Pricing Variants',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Default vs Featured' },
    },
  },
};
