// ============================================================
// SecurityList — Auto-generated from security-list-recipe.json
// Version: 1.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/SecurityList',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**SecurityList** v1.0.0 (stable)

Grid-Layout mit gap. Items: flex, align-items center, border-bottom.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-security-list">
    <span class="nc-security-list__item">item</span>
    <span class="nc-security-list__text">security-list</span>
  </div>`,
};

export const SecurityList = {
  name: 'Security List',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-security-list">
    <span class="nc-security-list__item">item</span>
    <span class="nc-security-list__text">security-list</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Liste mit Sicherheits-Features und Icons' },
    },
  },
};
