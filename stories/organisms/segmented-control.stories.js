// ============================================================
// SegmentedControl — Auto-generated from segmented-control-recipe.json
// Version: 2.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/SegmentedControl',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**SegmentedControl** v2.0.0 (stable)

Container ist ein <div class='nc-segmented-control' role='radiogroup'> mit aria-label.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  name: 'Standard',
  render: () => `<!-- @quelle: geerntet von Doku /docs/segmented-control-docs.html -->
<!-- @punkte: 13 -->`,
};

export const Standard = {
  name: 'Standard',
  render: () => `<div class="nc-segmented-control" role="radiogroup" aria-label="Ansicht">
<button class="nc-segmented-control__item nc-segmented-control__item--active" role="radio" aria-checked="true" aria-label="Rasteransicht" tabindex="0">
<svg class="nc-segmented-control__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
<rect x="3" y="3" width="7" height="7">
</rect>
<rect x="14" y="3" width="7" height="7">
</rect>
<rect x="3" y="14" width="7" height="7">
</rect>
<rect x="14" y="14" width="7" height="7">
</rect>
</svg>
</button>
<button class="nc-segmented-control__item" role="radio" aria-checked="false" aria-label="Listenansicht" tabindex="-1">
<svg class="nc-segmented-control__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
<line x1="3" y1="6" x2="21" y2="6">
</line>
<line x1="3" y1="12" x2="21" y2="12">
</line>
<line x1="3" y1="18" x2="21" y2="18">
</line>
</svg>
</button>
<button class="nc-segmented-control__item" role="radio" aria-checked="false" aria-label="Kartenansicht" tabindex="-1">
<svg class="nc-segmented-control__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
<rect x="3" y="3" width="18" height="8" rx="2">
</rect>
<rect x="3" y="13" width="18" height="8" rx="2">
</rect>
</svg>
</button>
</div>`,
};
