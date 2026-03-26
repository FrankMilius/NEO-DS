// ============================================================
// Form — Auto-generated from form-recipe.json
// Version: 1.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/Form',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Form** v1.0.0 (stable)

Root: <form> mit flex-column Layout. Gap via nc-form-gap (24px).


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-form">
    form
  </div>`,
};

export const LayoutVariants = {
  name: 'Layout Variants',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Vertical, Inline, Two-Column Layouts' },
    },
  },
};

export const VerticalForm = {
  name: 'Vertical Form',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-form">
    form
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Standard vertikales Formular mit Sections und Actions' },
    },
  },
};

export const InlineForm = {
  name: 'Inline Form',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-form">
    form
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Horizontales Formular (z.B. Suche, Filter)' },
    },
  },
};

export const TwoColumnForm = {
  name: 'Two-Column Form',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-form">
    form
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Responsives 2-Spalten-Grid (mobile: 1 Spalte)' },
    },
  },
};

export const DisabledForm = {
  name: 'Disabled Form',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-form">
    form
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Deaktiviertes Formular' },
    },
  },
};

export const WithValidation = {
  name: 'With Validation',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-form">
    form
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Formular mit Validation-Summary und Inline-Fehlern' },
    },
  },
};
