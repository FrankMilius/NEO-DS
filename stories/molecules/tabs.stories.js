// ============================================================
// Tabs — Auto-generated from tabs-recipe.json
// Version: 1.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Molecules/Tabs',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Tabs** v1.0.0 (stable)

Tabs verwenden WAI-ARIA Tabs Pattern (role=tablist/tab/tabpanel).


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-tabs">
    <span class="nc-tabs__list">list</span>
    <span class="nc-tabs__trigger">trigger</span>
    <span class="nc-tabs__panel">panel</span>
  </div>`,
};

export const LineVariant = {
  name: 'Line Variant',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-tabs">
    <span class="nc-tabs__list">list</span>
    <span class="nc-tabs__trigger">trigger</span>
    <span class="nc-tabs__panel">panel</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: '' },
    },
  },
};

export const ContainedVariant = {
  name: 'Contained Variant',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-tabs">
    <span class="nc-tabs__list">list</span>
    <span class="nc-tabs__trigger">trigger</span>
    <span class="nc-tabs__panel">panel</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: '' },
    },
  },
};

export const VerticalTabs = {
  name: 'Vertical Tabs',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-tabs">
    <span class="nc-tabs__list">list</span>
    <span class="nc-tabs__trigger">trigger</span>
    <span class="nc-tabs__panel">panel</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: '' },
    },
  },
};

export const SizeScale = {
  name: 'Size Scale',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: '' },
    },
  },
};
