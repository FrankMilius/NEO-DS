// ============================================================
// FormField — Auto-generated from form-field-recipe.json
// Version: 2.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Molecules/FormField',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**FormField** v2.0.0 (stable)

Flex-Column-Container der Label, Input, Hint und Error zusammenfasst.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-form-field">
    <span class="nc-input | .nc-textarea | .nc-select | .nc-checkbox">control</span>
  </div>`,
};

export const MinimalLabelInput = {
  name: 'Minimal (Label + Input)',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-form-field">
    <span class="nc-input | .nc-textarea | .nc-select | .nc-checkbox">control</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Einfachste Form: Label ueber Input' },
    },
  },
};

export const RequirementVariants = {
  name: 'Requirement Variants',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-form-field">
    <span class="nc-input | .nc-textarea | .nc-select | .nc-checkbox">control</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'None vs Required (*) vs Optional — Label-Indikatoren' },
    },
  },
};

export const RequiredError = {
  name: 'Required + Error',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-form-field">
    <span class="nc-input | .nc-textarea | .nc-select | .nc-checkbox">control</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Pflichtfeld im Error-State — typisches Pattern wenn Pflichtfeld leer abgeschickt wird' },
    },
  },
};

export const ValidationStates = {
  name: 'Validation States',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-form-field">
    <span class="nc-input | .nc-textarea | .nc-select | .nc-checkbox">control</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'None vs Error vs Success — mit Label, Input und ggf. Error-Message' },
    },
  },
};

export const WithHint = {
  name: 'With Hint',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-form-field">
    <span class="nc-input | .nc-textarea | .nc-select | .nc-checkbox">control</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Label + Input + Hint unterhalb' },
    },
  },
};

export const FullLabelHintInputError = {
  name: 'Full (Label + Hint + Input + Error)',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-form-field">
    <span class="nc-input | .nc-textarea | .nc-select | .nc-checkbox">control</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Vollstaendige Komposition mit allen Slots' },
    },
  },
};

export const VerticalvsHorizontal = {
  name: 'Vertical vs Horizontal',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Standard (vertical) vs Horizontal (Label links, Input rechts)' },
    },
  },
};

export const DisabledState = {
  name: 'Disabled State',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-form-field">
    <span class="nc-input | .nc-textarea | .nc-select | .nc-checkbox">control</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Disabled Form-Field — Label und Hint ausgegraut' },
    },
  },
};
