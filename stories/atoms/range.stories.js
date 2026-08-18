// ============================================================
// Range — Auto-generated from range-recipe.json
// Version: 2.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Atoms/Range',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Range** v2.0.0 (stable)

Native <input type='range'> mit Cross-Browser Custom-Styling via Pseudo-Elemente.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-range">
    <span class="nc-range__input">input</span>
  </div>`,
};

export const AllStates = {
  name: 'All States',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-range">
    <span class="nc-range__input">input</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Slider in allen Zustaenden: default, hover, active, focus, disabled' },
    },
  },
};

export const FloatingTooltip = {
  name: 'Floating Tooltip',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-range">
    <span class="nc-range__input">input</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Tooltip schwebt ueber dem Thumb und folgt der Position. Sichtbar bei Hover, Focus und Active.' },
    },
  },
};

export const RangeSliderDualThumb = {
  name: 'Range Slider (Dual Thumb)',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-range">
    <span class="nc-range__input">input</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Zwei Thumbs fuer Min/Max-Auswahl. Fill-Bereich zwischen den Thumbs in Markenfarbe.' },
    },
  },
};

export const TouchTarget44px = {
  name: 'Touch Target (44px)',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-range">
    <span class="nc-range__input">input</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Unsichtbarer 44px Klickbereich um den 20px Thumb — WCAG 2.5.8 Touch-Ergonomie.' },
    },
  },
};

export const DisplayVariants = {
  name: 'Display Variants',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-range">
    <span class="nc-range__input">input</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Plain, Floating Tooltip, statischer Output, Labels, Full' },
    },
  },
};

export const HorizontalvsVertical = {
  name: 'Horizontal vs Vertical',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Standard (horizontal) vs vertikale Ausrichtung' },
    },
  },
};

export const ErrorState = {
  name: 'Error State',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-range">
    <span class="nc-range__input">input</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Slider mit Error-Markierung (Thumb-Border + Fill in Danger-Farbe)' },
    },
  },
};

export const InFormField = {
  name: 'In Form Field',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-range">
    <span class="nc-range__input">input</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Slider im Form-Field Wrapper mit Label und Floating Tooltip' },
    },
  },
};
