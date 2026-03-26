// ============================================================
// Switch — Auto-generated from switch-recipe.json
// Version: 2.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Atoms/Switch',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Switch** v2.0.0 (stable)

Button-Pattern: <button role='switch' aria-checked='true/false'> als Track.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-switch">
    <span class="nc-switch__track">track</span>
    <span class="nc-switch__thumb">thumb</span>
  </div>`,
};

export const AllStatesMD = {
  name: 'All States — MD',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-switch">
    <span class="nc-switch__track">track</span>
    <span class="nc-switch__thumb">thumb</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Switch in allen Zustaenden (Standardgroesse)' },
    },
  },
};

export const CheckedVariations = {
  name: 'Checked + Variations',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-switch">
    <span class="nc-switch__track">track</span>
    <span class="nc-switch__thumb">thumb</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Checked-Zustand mit Hover, Focus und Disabled' },
    },
  },
};

export const SizeScaleMDSM = {
  name: 'Size Scale — MD / SM',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Beide Groessen im Vergleich' },
    },
  },
};

export const SquashStretch = {
  name: 'Squash & Stretch',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-switch">
    <span class="nc-switch__track">track</span>
    <span class="nc-switch__thumb">thumb</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Micro-Interaction: Thumb dehnt sich bei :active in Bewegungsrichtung, schnappt zurueck beim Loslassen' },
    },
  },
};

export const TrackIndicatorsIO = {
  name: 'Track Indicators (I/O)',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-switch">
    <span class="nc-switch__track">track</span>
    <span class="nc-switch__thumb">thumb</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'I/O Labels im Track — verbessert a11y-Erkennbarkeit ueber Farbe hinaus' },
    },
  },
};

export const ThumbElevation = {
  name: 'Thumb Elevation',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-switch">
    <span class="nc-switch__track">track</span>
    <span class="nc-switch__thumb">thumb</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Plastischer Thumb mit Shadow-Token — variabel von keinem bis starkem Schatten' },
    },
  },
};

export const SwitchmitLabel = {
  name: 'Switch mit Label',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-switch">
    <span class="nc-switch__track">track</span>
    <span class="nc-switch__thumb">thumb</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Switch mit begleitendem Text-Label' },
    },
  },
};

export const ButtonvsCheckboxPattern = {
  name: 'Button vs Checkbox Pattern',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-switch">
    <span class="nc-switch__track">track</span>
    <span class="nc-switch__thumb">thumb</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Beide Implementierungs-Muster im Vergleich' },
    },
  },
};
