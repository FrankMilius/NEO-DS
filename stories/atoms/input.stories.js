// ============================================================
// Input — Auto-generated from input-recipe.json
// Version: 2.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Atoms/Input',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Input** v2.0.0 (stable)

Input ist immer ein <input> Element mit type='text|email|url|tel|password|search|number|color'.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-input">
    <span class="nc-input__label">input</span>
  </div>`,
};

export const AllStatesMD = {
  name: 'All States — MD',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-input">
    <span class="nc-input__label">input</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Input in allen interaktiven Zustaenden' },
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

export const FloatingLabel = {
  name: 'Floating Label',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-input">
    <span class="nc-input__label">input</span>
  </div>
  <div class="nc-input">
    <span class="nc-input__label">input</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Label-Verhalten: empty → focus → not-empty' },
    },
  },
};

export const ContentStatesEmptyvsNotEmpty = {
  name: 'Content States (Empty vs Not-Empty)',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-input">
    <span class="nc-input__label">input</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Clear-Button und Label-Position bei leerem vs. gefuelltem Input' },
    },
  },
};

export const TextAffixesPrefixSuffix = {
  name: 'Text Affixes (Prefix / Suffix)',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-input">
    <span class="nc-input__label">input</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Input mit Text-Praefix (https://) und/oder Text-Suffix (€, kg)' },
    },
  },
};

export const SizeScaleSMMDLG = {
  name: 'Size Scale — SM / MD / LG',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-input">
    <span class="nc-input__label">input</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Alle 3 Groessen im Vergleich mit Touch-Target-Visualisierung' },
    },
  },
};

export const ValidationStates = {
  name: 'Validation States',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-input">
    <span class="nc-input__label">input</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Error und Success im Vergleich zu Default' },
    },
  },
};

export const InputTypes = {
  name: 'Input Types',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-input">
    <span class="nc-input__label">input</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Text, Search und Password im Vergleich' },
    },
  },
};
