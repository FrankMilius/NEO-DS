// ============================================================
// Square — Auto-generated from square-recipe.json
// Version: 1.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/Square',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Square** v1.0.0 (stable)

Dekoratives Quadrat via ::before Pseudo-Element.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="square">
    square
  </div>`,
};

export const VariantComparison = {
  name: 'Variant Comparison',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Default, White, Dark, Adaptive, Blinking' },
    },
  },
};
