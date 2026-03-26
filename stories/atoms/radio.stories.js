// ============================================================
// Radio — Auto-generated from radio-recipe.json
// Version: 2.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Atoms/Radio',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Radio** v2.0.0 (stable)

Wrapper ist ein <label class='nc-radio'> — Klick auf Label aktiviert Input.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-radio">
    <span class="nc-radio__input">input</span>
    <span class="nc-radio__control">control</span>
  </div>`,
};

export const AllStatesMD = {
  name: 'All States — MD',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-radio">
    <span class="nc-radio__input">input</span>
    <span class="nc-radio__control">control</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Radio in allen interaktiven Zustaenden' },
    },
  },
};

export const SizeScaleSMMDLG = {
  name: 'Size Scale — SM / MD / LG',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Alle 3 Groessen im Vergleich' },
    },
  },
};

export const AlignmentCentervsTop = {
  name: 'Alignment: Center vs Top',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-radio">
    <span class="nc-radio__input">input</span>
    <span class="nc-radio__control">control</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Vergleich der vertikalen Ausrichtung bei mehrzeiligem Label' },
    },
  },
};

export const DefaultvsChecked = {
  name: 'Default vs Checked',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-radio">
    <span class="nc-radio__input">input</span>
    <span class="nc-radio__control">control</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Vergleich unchecked und checked mit Dot-Animation' },
    },
  },
};

export const RadioGroup = {
  name: 'Radio Group',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-radio">
    <span class="nc-radio__input">input</span>
    <span class="nc-radio__control">control</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Mehrere Radios in einer Gruppe — nur einer kann aktiv sein' },
    },
  },
};

export const ErrorState = {
  name: 'Error State',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-radio">
    <span class="nc-radio__input">input</span>
    <span class="nc-radio__control">control</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Error-Validierung fuer die Radio-Gruppe' },
    },
  },
};

export const DisabledStates = {
  name: 'Disabled States',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-radio">
    <span class="nc-radio__input">input</span>
    <span class="nc-radio__control">control</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Disabled in unchecked und checked' },
    },
  },
};

export const WithLabelText = {
  name: 'With Label Text',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Radio mit Label-Text in allen Groessen' },
    },
  },
};
