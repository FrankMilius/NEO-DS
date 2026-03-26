// ============================================================
// Timeline — Auto-generated from timeline-recipe.json
// Version: 1.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/Timeline',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Timeline** v1.0.0 (stable)

<ol> fuer chronologisch geordnete Eintraege — semantische Reihenfolge.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-timeline">
    <span class="nc-timeline__item">item</span>
    <span class="nc-timeline__node">node</span>
    <span class="nc-timeline__content">content</span>
    <span class="nc-timeline__title">title</span>
  </div>`,
};

export const DefaultTimeline = {
  name: 'Default Timeline',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-timeline">
    <span class="nc-timeline__item">item</span>
    <span class="nc-timeline__node">node</span>
    <span class="nc-timeline__content">content</span>
    <span class="nc-timeline__title">title</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Standard-Timeline mit kleinen Punkt-Nodes und Content' },
    },
  },
};

export const VariantComparison = {
  name: 'Variant Comparison',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Default, Icon, Connected, Compact im Vergleich' },
    },
  },
};

export const NodeStatusVariants = {
  name: 'Node Status Variants',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-timeline">
    <span class="nc-timeline__item">item</span>
    <span class="nc-timeline__node">node</span>
    <span class="nc-timeline__content">content</span>
    <span class="nc-timeline__title">title</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Default, Active, Success, Danger Nodes' },
    },
  },
};

export const IconTimeline = {
  name: 'Icon Timeline',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-timeline">
    <span class="nc-timeline__item">item</span>
    <span class="nc-timeline__node">node</span>
    <span class="nc-timeline__content">content</span>
    <span class="nc-timeline__title">title</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Groessere Nodes (32px) mit SVG-Icons — fuer Activity Feeds' },
    },
  },
};

export const ConnectedCards = {
  name: 'Connected Cards',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-timeline">
    <span class="nc-timeline__item">item</span>
    <span class="nc-timeline__node">node</span>
    <span class="nc-timeline__content">content</span>
    <span class="nc-timeline__title">title</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Timeline mit Card-Hintergrund fuer den Content-Bereich' },
    },
  },
};

export const ChangelogExample = {
  name: 'Changelog Example',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-timeline">
    <span class="nc-timeline__item">item</span>
    <span class="nc-timeline__node">node</span>
    <span class="nc-timeline__content">content</span>
    <span class="nc-timeline__title">title</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Typischer Anwendungsfall: Versions-Changelog mit Datum und Beschreibung' },
    },
  },
};
