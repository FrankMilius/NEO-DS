// ============================================================
// SolutionTabs — Auto-generated from solution-tabs-recipe.json
// Version: 1.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/SolutionTabs',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**SolutionTabs** v1.0.0 (stable)

Root .nc-solution-tabs setzt --nc-solution-tabs-accent (Default = -accent-default), per Panel via Inline-Style ueberschreibbar.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-solution-tabs">
    <span class="nc-solution-tabs__tablist">tablist</span>
    <span class="nc-solution-tabs__tab">tab</span>
    <span class="nc-solution-tabs__panel">panel</span>
    <span class="nc-solution-tabs__panel-title">panel-title</span>
  </div>`,
};

export const HorizontalAutoplay = {
  name: 'Horizontal + Autoplay',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-solution-tabs">
    <span class="nc-solution-tabs__tablist">tablist</span>
    <span class="nc-solution-tabs__tab">tab</span>
    <span class="nc-solution-tabs__panel">panel</span>
    <span class="nc-solution-tabs__panel-title">panel-title</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Tab-Leiste oben, Auto-Rotation mit Fortschrittsbalken, reiches Panel + Produkt-Visual.' },
    },
  },
};

export const VertikaleNavigation = {
  name: 'Vertikale Navigation',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-solution-tabs">
    <span class="nc-solution-tabs__tablist">tablist</span>
    <span class="nc-solution-tabs__tab">tab</span>
    <span class="nc-solution-tabs__panel">panel</span>
    <span class="nc-solution-tabs__panel-title">panel-title</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Nummerierte Seitennavigation links, gleitendes Panel rechts.' },
    },
  },
};
