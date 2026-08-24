// ============================================================
// ToggleGroup — Auto-generated from toggle-group-recipe.json
// Version: 2.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/ToggleGroup',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**ToggleGroup** v2.0.0 (stable)

Container ist ein <div class='nc-toggle-group'>.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  name: 'Standard',
  render: () => `<!-- @quelle: geerntet von Doku /docs/toggle-docs.html -->
<!-- @punkte: 12 -->`,
};

export const Standard = {
  name: 'Standard',
  render: () => `<div class="nc-toggle-group" role="radiogroup" aria-label="Ansichtsmodus">
<button class="nc-toggle-group__item" role="radio" aria-checked="true" tabindex="0" aria-label="Grid-Ansicht">
<span class="nc-toggle-group__icon">
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
<rect x="3" y="3" width="7" height="7">
</rect>
<rect x="14" y="3" width="7" height="7">
</rect>
<rect x="3" y="14" width="7" height="7">
</rect>
<rect x="14" y="14" width="7" height="7">
</rect>
</svg>
</span>
</button>
<button class="nc-toggle-group__item" role="radio" aria-checked="false" tabindex="-1" aria-label="Listen-Ansicht">
<span class="nc-toggle-group__icon">
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
<line x1="8" y1="6" x2="21" y2="6">
</line>
<line x1="8" y1="12" x2="21" y2="12">
</line>
<line x1="8" y1="18" x2="21" y2="18">
</line>
<line x1="3" y1="6" x2="3.01" y2="6">
</line>
<line x1="3" y1="12" x2="3.01" y2="12">
</line>
<line x1="3" y1="18" x2="3.01" y2="18">
</line>
</svg>
</span>
</button>
</div>`,
};
