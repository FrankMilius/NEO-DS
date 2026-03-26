// ============================================================
// OtpInput — Auto-generated from otp-input-recipe.json
// Version: 1.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Molecules/OtpInput',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**OtpInput** v1.0.0 (stable)

Inline-Flex Container mit einzelnen Input-Zellen (maxlength=1).


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-otp-input">
    <span class="nc-otp-input__cell">cell</span>
  </div>`,
};

export const AllStates = {
  name: 'All States',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-otp-input">
    <span class="nc-otp-input__cell">cell</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'OTP-Zelle in allen Zustaenden: default, hover, focus, filled, disabled' },
    },
  },
};

export const SizeVariants = {
  name: 'Size Variants',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'SM, MD, LG Zellen-Groessen' },
    },
  },
};

export const ValidationStates = {
  name: 'Validation States',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-otp-input">
    <span class="nc-otp-input__cell">cell</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'None, Error, Success' },
    },
  },
};

export const WithSeparator = {
  name: 'With Separator',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-otp-input">
    <span class="nc-otp-input__cell">cell</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: '6-stelliger OTP-Code mit Bindestrich-Separator (3+3 Format)' },
    },
  },
};

export const _4DigitPIN = {
  name: '4-Digit PIN',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-otp-input">
    <span class="nc-otp-input__cell">cell</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Typischer 4-stelliger PIN-Code' },
    },
  },
};

export const InFormField = {
  name: 'In Form Field',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-otp-input">
    <span class="nc-otp-input__cell">cell</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'OTP-Input im Form-Field Wrapper mit Label und Fehlermeldung' },
    },
  },
};
