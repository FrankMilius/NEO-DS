// ============================================================
// Header — Auto-generated from header-recipe.json
// Version: 1.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/Header',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Header** v1.0.0 (stable)

Relative positioned, z-index header. Nav-Wrapper: fixed, background-base, border-bottom.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="header">
    <span class="nav-wrapper">nav-wrapper</span>
  </div>`,
};

export const Header = {
  name: 'Header',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="header">
    <span class="nav-wrapper">nav-wrapper</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Fixed Header mit Navigation und Conversion-Button' },
    },
  },
};
