// ============================================================
// Chip — Auto-generated from chip-recipe.json
// Version: 2.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Atoms/Chip',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Chip** v2.0.0 (stable)

Chip ist immer ein <button> — interaktiv, toggled Filter.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-chip">
    <span class="nc-chip__label">chip</span>
  </div>`,
};

export const AllStatesMD = {
  name: 'All States — MD',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-chip">
    <span class="nc-chip__label">chip</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Chip in allen interaktiven Zustaenden' },
    },
  },
};

export const SizeScaleSMMDLG = {
  name: 'Size Scale — SM / MD / LG',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Alle 3 Groessen im Vergleich. SM hat 44px Touch-Target.' },
    },
  },
};

export const VariantsFilledOutlineGhost = {
  name: 'Variants — Filled / Outline / Ghost',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-chip">
    <span class="nc-chip__label">chip</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Alle 3 visuellen Varianten im Vergleich (default + selected)' },
    },
  },
};

export const ContentTypes = {
  name: 'Content Types',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-chip">
    <span class="nc-chip__label">chip</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Text, mit Icon, mit Avatar, mit Count-Badge und mit Remove-Button' },
    },
  },
};

export const DefaultvsSelected = {
  name: 'Default vs Selected',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-chip">
    <span class="nc-chip__label">chip</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Vergleich von unselected und selected State — kein Layout-Shift dank transparenter Border' },
    },
  },
};

export const SelectedVariants = {
  name: 'Selected × Variants',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-chip">
    <span class="nc-chip__label">chip</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Selected-State in allen 3 Varianten' },
    },
  },
};

export const ChipGroupWrap = {
  name: 'Chip Group (Wrap)',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-chip">
    <span class="nc-chip__label">chip</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Mehrere Chips in einem Gruppen-Container mit flex-wrap' },
    },
  },
};

export const ChipGroupScroll = {
  name: 'Chip Group (Scroll)',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-chip">
    <span class="nc-chip__label">chip</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Horizontal-Scroll Gruppe ohne Wrap — fuer Mobile/Header' },
    },
  },
};
