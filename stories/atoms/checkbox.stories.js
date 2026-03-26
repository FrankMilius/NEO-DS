// ============================================================
// Checkbox — Auto-generated from checkbox-recipe.json
// Version: 2.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Atoms/Checkbox',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Checkbox** v2.0.0 (stable)

Wrapper ist ein <label class='nc-checkbox'> — Klick auf Label aktiviert Input.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-checkbox">
    <span class="nc-checkbox__input">input</span>
    <span class="nc-checkbox__control">control</span>
  </div>`,
};

export const AllStatesMD = {
  name: 'All States — MD',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-checkbox">
    <span class="nc-checkbox__input">input</span>
    <span class="nc-checkbox__control">control</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Checkbox in allen interaktiven Zustaenden' },
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

export const CheckedvsIndeterminate = {
  name: 'Checked vs Indeterminate',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-checkbox">
    <span class="nc-checkbox__input">input</span>
    <span class="nc-checkbox__control">control</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Vergleich der beiden aktiven Zustaende' },
    },
  },
};

export const ErrorState = {
  name: 'Error State',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-checkbox">
    <span class="nc-checkbox__input">input</span>
    <span class="nc-checkbox__control">control</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Error-Validierung in verschiedenen Check-Zustaenden' },
    },
  },
};

export const DisabledStates = {
  name: 'Disabled States',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-checkbox">
    <span class="nc-checkbox__input">input</span>
    <span class="nc-checkbox__control">control</span>
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
      description: { story: 'Checkbox mit und ohne Label-Text' },
    },
  },
};

export const ErrorSize = {
  name: 'Error × Size',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Error-State in allen Groessen' },
    },
  },
};

export const CardVariant = {
  name: 'Card Variant',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-checkbox">
    <span class="nc-checkbox__input">input</span>
    <span class="nc-checkbox__control">control</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Checkbox als Card mit umgebendem Rahmen — default, checked, disabled' },
    },
  },
};
