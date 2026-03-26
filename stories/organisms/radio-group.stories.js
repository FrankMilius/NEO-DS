// ============================================================
// RadioGroup — Auto-generated from radio-group-recipe.json
// Version: 2.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/RadioGroup',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**RadioGroup** v2.0.0 (stable)

Flex-Column Container fuer mehrere .nc-radio Elemente.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-radio-group">
    radio-group
  </div>`,
};

export const LayoutVariants = {
  name: 'Layout Variants',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Vertical vs Horizontal' },
    },
  },
};

export const SizeGap = {
  name: 'Size × Gap',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-radio-group">
    radio-group
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Gap-Abstufung gekoppelt an Radio-Groesse: sm (8px), md (12px), lg (16px)' },
    },
  },
};

export const SegmentedControl = {
  name: 'Segmented Control',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-radio-group">
    radio-group
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Pillen-Design — Radios als nahtlose Button-Gruppe' },
    },
  },
};

export const CardGroup = {
  name: 'Card Group',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-radio-group">
    radio-group
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Jedes Radio als eigene Card mit Border und Hintergrund' },
    },
  },
};

export const VariantComparison = {
  name: 'Variant Comparison',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-radio-group">
    radio-group
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Default vs Segmented vs Card im Vergleich' },
    },
  },
};

export const WithGroupHint = {
  name: 'With Group Hint',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-radio-group">
    radio-group
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Gruppen-Hilfetext unterhalb der Optionen via form-hint' },
    },
  },
};

export const States = {
  name: 'States',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-radio-group">
    radio-group
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Default, Error, Disabled' },
    },
  },
};
