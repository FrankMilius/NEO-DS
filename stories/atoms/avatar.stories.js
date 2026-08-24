// ============================================================
// Avatar — Auto-generated from avatar-recipe.json
// Version: 2.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Atoms/Avatar',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Avatar** v2.0.0 (stable)

Image/Fallback-Pattern: Fallback (z-index:0) immer im DOM, Image (z-index:1) ueberdeckt bei Erfolg.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  name: 'Standard',
  render: () => `<!-- @quelle: geerntet von Doku /docs/avatar-docs.html -->
<!-- @punkte: 3 -->`,
};

export const Standard = {
  name: 'Standard',
  render: () => `<div class="nc-avatar nc-avatar--lg">
<span class="nc-avatar__fallback">BS</span>
<span class="nc-avatar__badge nc-avatar__badge--busy">
</span>
</div>`,
};
