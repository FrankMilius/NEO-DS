// ============================================================
// ExpandingPanels — Auto-generated from expanding-panels-recipe.json
// Version: 1.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/ExpandingPanels',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**ExpandingPanels** v1.0.0 (stable)

Root .nc-expanding-panels: display:flex, gap, feste Hoehe (--nc-expanding-panels-height).


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-expanding-panels">
    <span class="nc-expanding-panels__panel">panel</span>
    <span class="nc-expanding-panels__label">expanding-panels</span>
    <span class="nc-expanding-panels__body">body</span>
  </div>`,
};

export const ExpandingPanels = {
  name: 'Expanding Panels',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-expanding-panels">
    <span class="nc-expanding-panels__panel">panel</span>
    <span class="nc-expanding-panels__label">expanding-panels</span>
    <span class="nc-expanding-panels__body">body</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Vier horizontale Panels, erstes aktiv. Hover/Klick expandiert, Body wird sichtbar.' },
    },
  },
};
