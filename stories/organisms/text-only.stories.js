// ============================================================
// TextOnly — Auto-generated from text-only-recipe.json
// Version: 1.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/TextOnly',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**TextOnly** v1.0.0 (stable)

Container: max-width, padding. Title: heading-Stil.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-text-only">
    <span class="nc-text-only__text">text-only</span>
  </div>`,
};

export const TextOnlyVariants = {
  name: 'Text-Only Variants',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Default vs Scroll-Animation' },
    },
  },
};
