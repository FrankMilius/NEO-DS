// ============================================================
// Solutions — Auto-generated from solutions-recipe.json
// Version: 1.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/Solutions',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Solutions** v1.0.0 (stable)

Desktop: 3-Spalten Grid (6+1+5) mit grid-areas accordion/side/content.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="solutions">
    <span class="accordion--solutions">accordion</span>
  </div>`,
};

export const SolutionsSection = {
  name: 'Solutions Section',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="solutions">
    <span class="accordion--solutions">accordion</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Accordion mit Side-Content und Tabs' },
    },
  },
};
