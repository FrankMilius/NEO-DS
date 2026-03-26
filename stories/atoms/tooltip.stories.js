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
  render: () => `<div class="nc-tooltip">
    <span class="nc-tooltip__content">content</span>
  </div>`,
};

export const AllPositions = {
  name: 'All Positions',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Tooltip in allen 4 Positionen mit Scale+Fade Animation' },
    },
  },
};

export const HiddenState = {
  name: 'Hidden State',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-tooltip">
    <span class="nc-tooltip__content">content</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Tooltip im versteckten Standardzustand' },
    },
  },
};

export const ArrowVariants = {
  name: 'Arrow Variants',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Tooltip mit Pfeil in allen Positionen — Arrow uebernimmt bg' },
    },
  },
};

export const LongContent = {
  name: 'Long Content',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-tooltip">
    <span class="nc-tooltip__content">content</span>
  </div>
  <div class="nc-tooltip">
    <span class="nc-tooltip__content">content</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Tooltip mit laengerem Text — max-width Verhalten' },
    },
  },
};

export const HoverIntentDelay = {
  name: 'Hover Intent Delay',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-tooltip">
    <span class="nc-tooltip__content">content</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: '300ms Verzoegerung verhindert \'Tooltip-Terror\' — Tooltip erscheint erst bei Absicht' },
    },
  },
};

export const HoverableContentWCAG1413 = {
  name: 'Hoverable Content (WCAG 1.4.13)',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-tooltip">
    <span class="nc-tooltip__content">content</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Nutzer kann mit Maus auf Tooltip fahren — Text kopierbar' },
    },
  },
};

export const DisabledTrigger = {
  name: 'Disabled Trigger',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-tooltip">
    <span class="nc-tooltip__content">content</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Tooltip auf deaktiviertem Button — Wrapper-Pattern' },
    },
  },
};
