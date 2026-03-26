// ============================================================
// Select — Auto-generated from select-recipe.json
// Version: 2.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Atoms/Select',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Select** v2.0.0 (stable)

Select ist ein natives <select class='nc-select'>. Kein JS fuer Basis-Funktion noetig.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-select">
    select
  </div>`,
};

export const AllStatesMD = {
  name: 'All States — MD',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-select">
    select
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Select in allen interaktiven Zustaenden' },
    },
  },
};

export const VariantComparison = {
  name: 'Variant Comparison',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Outlined vs Filled vs Borderless — alle 3 Varianten im Vergleich' },
    },
  },
};

export const SizeScaleSMMDLG = {
  name: 'Size Scale — SM / MD / LG',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-select">
    select
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Alle 3 Groessen im Vergleich' },
    },
  },
};

export const ValidationStates = {
  name: 'Validation States',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-select">
    select
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Error und Success im Vergleich zu Default' },
    },
  },
};

export const SinglevsMultiple = {
  name: 'Single vs Multiple',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-select">
    select
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Standard-Dropdown vs native Mehrfachauswahl (nur Fallback)' },
    },
  },
};

export const WithOptgroups = {
  name: 'With Optgroups',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-select">
    select
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Select mit gruppierten Optionen (<optgroup>) — Fettdruck und Einrueckung' },
    },
  },
};

export const WithCustomIndicator = {
  name: 'With Custom Indicator',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-select">
    select
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Select im Wrapper mit custom SVG-Indicator statt background-image' },
    },
  },
};

export const OpenStateChevronRotation = {
  name: 'Open State (Chevron Rotation)',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-select">
    select
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Wrapper mit .is-open Klasse — Chevron rotiert 180 Grad' },
    },
  },
};
