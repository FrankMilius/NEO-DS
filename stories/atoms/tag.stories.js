// ============================================================
// Tag — Auto-generated from tag-recipe.json
// Version: 2.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Atoms/Tag',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Tag** v2.0.0 (stable)

Statischer Tag: <span class='nc-tag'>. Nicht fokussierbar, kein interaktives Element.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  name: 'Standard',
  render: () => `<!-- @quelle: geerntet von Doku /docs/tag-docs.html -->
<!-- @punkte: 1 -->`,
};

export const Standard = {
  name: 'Standard',
  render: () => `<span class="nc-tag nc-tag--removable"> mit <button class="nc-tag__remove"> als Kind.</button>
</span>`,
};
