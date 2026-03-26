// ============================================================
// FormError — Auto-generated from form-error-recipe.json
// Version: 1.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Molecules/FormError',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**FormError** v1.0.0 (stable)

Flexbox-Layout: Icon + Text nebeneinander, align-items: flex-start.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-form-error">
    <span class="nc-form-error__text">form-error</span>
  </div>`,
};

export const ErrorDefault = {
  name: 'Error (Default)',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-form-error">
    <span class="nc-form-error__text">form-error</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Standard-Fehlermeldung mit Icon und Text' },
    },
  },
};

export const SeverityVariants = {
  name: 'Severity Variants',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-form-error">
    <span class="nc-form-error__text">form-error</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Alle Schweregrade im Vergleich: Error, Warning, Success' },
    },
  },
};

export const ContentVariants = {
  name: 'Content Variants',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Text-only vs mit Icon' },
    },
  },
};

export const WithInputField = {
  name: 'With Input Field',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-form-error">
    <span class="nc-form-error__text">form-error</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Fehlermeldung unterhalb eines Input-Feldes (typischer Anwendungsfall)' },
    },
  },
};

export const MultiLineError = {
  name: 'Multi-Line Error',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-form-error">
    <span class="nc-form-error__text">form-error</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Fehlermeldung mit langem Text (mehrzeilig)' },
    },
  },
};

export const FormHintRelated = {
  name: 'Form Hint (Related)',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-form-error">
    <span class="nc-form-error__text">form-error</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Hint-Text unterhalb eines Feldes — verwandte Komponente, aehnliches Pattern' },
    },
  },
};
