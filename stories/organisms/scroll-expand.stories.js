// ============================================================
// ScrollExpand — Auto-generated from scroll-expand-recipe.json
// Version: 1.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/ScrollExpand',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**ScrollExpand** v1.0.0 (stable)

Element expandiert von Content-Breite zum Viewport beim Scrollen.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-scroll-expand">
    scroll-expand
  </div>`,
};

export const ScrollExpand = {
  name: 'Scroll Expand',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-scroll-expand">
    scroll-expand
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Element expandiert von Content-Breite zum Viewport beim Scrollen.' },
    },
  },
};
