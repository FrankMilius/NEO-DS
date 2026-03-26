// ============================================================
// Stepper — Auto-generated from stepper-recipe.json
// Version: 1.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Molecules/Stepper',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Stepper** v1.0.0 (stable)

Inline-Flex Container: Decrement-Button | Input | Increment-Button.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-stepper">
    <span class="nc-stepper__decrement">decrement</span>
    <span class="nc-stepper__input">input</span>
    <span class="nc-stepper__increment">increment</span>
  </div>`,
};

export const AllStates = {
  name: 'All States',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-stepper">
    <span class="nc-stepper__decrement">decrement</span>
    <span class="nc-stepper__input">input</span>
    <span class="nc-stepper__increment">increment</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Stepper in allen Zustaenden: default, hover, focus, disabled' },
    },
  },
};

export const SizeVariants = {
  name: 'Size Variants',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'SM, MD, LG Groessen im Vergleich' },
    },
  },
};

export const ValidationStates = {
  name: 'Validation States',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-stepper">
    <span class="nc-stepper__decrement">decrement</span>
    <span class="nc-stepper__input">input</span>
    <span class="nc-stepper__increment">increment</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'None vs Error' },
    },
  },
};

export const MinMaxBoundary = {
  name: 'Min/Max Boundary',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-stepper">
    <span class="nc-stepper__decrement">decrement</span>
    <span class="nc-stepper__input">input</span>
    <span class="nc-stepper__increment">increment</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Verhalten bei Minimum und Maximum — Button disabled am Rand' },
    },
  },
};

export const InFormField = {
  name: 'In Form Field',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-stepper">
    <span class="nc-stepper__decrement">decrement</span>
    <span class="nc-stepper__input">input</span>
    <span class="nc-stepper__increment">increment</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Stepper im Form-Field Wrapper mit Label' },
    },
  },
};

export const ReadonlyInput = {
  name: 'Readonly Input',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-stepper">
    <span class="nc-stepper__decrement">decrement</span>
    <span class="nc-stepper__input">input</span>
    <span class="nc-stepper__increment">increment</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Input ist readonly — Wert nur ueber Buttons aenderbar' },
    },
  },
};
