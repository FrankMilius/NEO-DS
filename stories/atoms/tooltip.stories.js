// ============================================================
// Tooltip — Auto-generated from tooltip-recipe.json
// Version: 2.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Atoms/Tooltip',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Tooltip** v2.0.0 (stable)

Wrapper um Trigger + Content. Content wird absolut positioniert.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  name: 'Standard',
  render: () => `<span class="nc-tooltip nc-tooltip--bottom">
<button class="nc-tabs__trigger nc-tabs__trigger--icon-only" role="tab" aria-selected="false" aria-controls="sc-tooltip-line-panel-2" id="sc-tooltip-line-tab-2" tabindex="-1" type="button" aria-label="Suche" aria-describedby="sc-tooltip-line-tooltip-2">
<span class="nc-tabs__trigger-icon">
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
<circle cx="10" cy="10" r="7">
</circle>
<line x1="21" y1="21" x2="15" y2="15">
</line>
</svg>
</span>
<span class="nc-tabs__trigger-label">Suche</span>
</button>
<span class="nc-tooltip__content" role="tooltip" id="sc-tooltip-line-tooltip-2">Suche<span class="nc-tooltip__arrow">
</span>
</span>
</span>`,
};
