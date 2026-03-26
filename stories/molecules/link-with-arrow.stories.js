// ============================================================
// LinkWithArrow — Auto-generated from link-with-arrow-recipe.json
// Version: 1.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Molecules/LinkWithArrow',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**LinkWithArrow** v1.0.0 (stable)

Flex-Row: Text + Pfeil-Icon. Gap spacing-02.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="link-with-arrow">
    link-with-arrow
  </div>`,
};

export const LinkwithArrow = {
  name: 'Link with Arrow',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="link-with-arrow">
    link-with-arrow
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Standard Link mit Pfeil-Icon' },
    },
  },
};
