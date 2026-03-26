// ============================================================
// Status — Auto-generated from status-recipe.json
// Version: 1.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/Status',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Status** v1.0.0 (stable)

Status ist rein dekorativ — immer aria-hidden='true' auf dem Dot.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-status">
    status
  </div>`,
};

export const AllVariantsSM = {
  name: 'All Variants — SM',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Alle 5 Status-Varianten in Standardgroesse' },
    },
  },
};

export const VariantSize = {
  name: 'Variant × Size',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Alle Varianten in allen 3 Groessen' },
    },
  },
};

export const RingModifier = {
  name: 'Ring Modifier',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Weisser Ring fuer Verwendung auf farbigen Hintergruenden' },
    },
  },
};

export const PulseAnimation = {
  name: 'Pulse Animation',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-status">
    status
  </div>
  <div class="nc-status">
    status
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Live-Status-Anzeige mit pulsierender Animation' },
    },
  },
};

export const StatusmitLabel = {
  name: 'Status mit Label',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Dot + begleitender Text ueber .nc-status-label' },
    },
  },
};

export const StatusonAvatar = {
  name: 'Status on Avatar',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-status">
    status
  </div>
  <div class="nc-status">
    status
  </div>
  <div class="nc-status">
    status
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Positionierung auf Avatar-Ecke mit Ring' },
    },
  },
};
