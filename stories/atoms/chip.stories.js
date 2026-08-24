// ============================================================
// Chip — Auto-generated from chip-recipe.json
// Version: 2.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Atoms/Chip',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Chip** v2.0.0 (stable)

Chip ist immer ein <button> — interaktiv, toggled Filter.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  name: 'Standard',
  render: () => `<!-- @quelle: geerntet von Doku /docs/chip-docs.html -->
<!-- @punkte: 12 -->`,
};

export const Standard = {
  name: 'Standard',
  render: () => `<button class="nc-chip" type="button" aria-pressed="false">
<img class="nc-chip__avatar" src="https://api.dicebear.com/9.x/initials/svg?seed=FM&amp;backgroundColor=1a1a1a&amp;textColor=ffffff" alt="">
<span class="nc-chip__label">Frank M.</span>
</button>`,
};
