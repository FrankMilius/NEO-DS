// ============================================================
// FormActions — Auto-generated from form-actions-recipe.json
// Version: 1.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/FormActions',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**FormActions** v1.0.0 (stable)

Flex-Container fuer Formular-Buttons (Submit, Cancel, Reset).


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-form-actions">
    form-actions
  </div>`,
};

export const AlignmentVariants = {
  name: 'Alignment Variants',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Start, Center, End, Spread Ausrichtungen' },
    },
  },
};

export const LayoutVariants = {
  name: 'Layout Variants',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-form-actions">
    form-actions
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Default, Sticky, Stacked, Bordered' },
    },
  },
};

export const SpreadLayout = {
  name: 'Spread Layout',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-form-actions">
    form-actions
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Cancel links, Submit rechts — typisches Formular-Pattern' },
    },
  },
};

export const StickyActions = {
  name: 'Sticky Actions',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-form-actions">
    form-actions
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Sticky am unteren Rand — fuer lange Formulare' },
    },
  },
};

export const StackedMobile = {
  name: 'Stacked (Mobile)',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-form-actions">
    form-actions
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Vertikale Anordnung fuer schmale Viewports' },
    },
  },
};

export const InFormContext = {
  name: 'In Form Context',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-form-actions">
    form-actions
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Form-Actions am Ende eines Formulars mit Fieldsets' },
    },
  },
};
