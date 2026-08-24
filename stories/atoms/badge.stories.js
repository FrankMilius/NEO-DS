// ============================================================
// Badge — Auto-generated from badge-recipe.json
// Version: 2.2.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Atoms/Badge',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Badge** v2.2.0 (stable)

Badge ist NIEMALS fokussierbar — immer <span>, kein role='button', kein tabindex.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  name: 'Standard',
  render: () => `<!-- @quelle: geerntet von Doku /docs/badge-docs.html -->
<!-- @punkte: 11 -->`,
};

export const Standard = {
  name: 'Standard',
  render: () => `<span class="nc-badge">
<span class="nc-badge__label">Kurzer Text</span>
</span>`,
};
