// ============================================================
// Status — Auto-generated from status-recipe.json
// Version: 1.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/Status',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Status** v1.0.0 (stable)

Status ist rein dekorativ — immer aria-hidden='true' auf dem Dot.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  name: 'Standard',
  render: () => `<!-- @quelle: geerntet von Doku /docs/status-docs.html -->
<!-- @punkte: 0 -->`,
};

export const Standard = {
  name: 'Standard',
  render: () => `<span class="nc-status nc-status--busy" aria-hidden="true">
</span>`,
};
