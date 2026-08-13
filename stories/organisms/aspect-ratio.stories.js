// ============================================================
// AspectRatio — Auto-generated from aspect-ratio-recipe.json
// Version: 1.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/AspectRatio',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**AspectRatio** v1.0.0 (stable)

Nutzt native CSS aspect-ratio Property.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-aspect-ratio">
    <span class="nc-aspect-ratio__content">content</span>
  </div>`,
};

export const AlleSeitenverhaeltnisse = {
  name: 'Alle Seitenverhaeltnisse',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: '' },
    },
  },
};
