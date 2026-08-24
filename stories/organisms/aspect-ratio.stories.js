// ============================================================
// AspectRatio — Auto-generated from aspect-ratio-recipe.json
// Version: 1.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/AspectRatio',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**AspectRatio** v1.0.0 (stable)

Nutzt native CSS aspect-ratio Property.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  name: 'Standard',
  render: () => `<!-- @quelle: geerntet von Doku /docs/media-ratios-docs.html -->
<!-- @punkte: 11 -->`,
};

export const Standard = {
  name: 'Standard',
  render: () => `<div class="nc-aspect-ratio nc-aspect-ratio--1-1">
<img class="nc-aspect-ratio__content" src="https://picsum.photos/seed/ar-sq/400/400" alt="1:1 Beispiel">
</div>`,
};
