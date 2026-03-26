// ============================================================
// ValidationSummary — Auto-generated from validation-summary-recipe.json
// Version: 1.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/ValidationSummary',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**ValidationSummary** v1.0.0 (stable)

Error-Summary-Box am Anfang eines Formulars — zeigt alle Fehler gesammelt.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-validation-summary">
    <span class="nc-validation-summary__title">title</span>
    <span class="nc-validation-summary__list">list</span>
    <span class="nc-validation-summary__item">item</span>
  </div>`,
};

export const DefaultValidationSummary = {
  name: 'Default Validation Summary',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-validation-summary">
    <span class="nc-validation-summary__title">title</span>
    <span class="nc-validation-summary__list">list</span>
    <span class="nc-validation-summary__item">item</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Standard-Error-Summary mit Titel und Fehlerliste als Links' },
    },
  },
};

export const ContentVariants = {
  name: 'Content Variants',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'With Links, Text-Only, With Icon im Vergleich' },
    },
  },
};

export const SingleError = {
  name: 'Single Error',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-validation-summary">
    <span class="nc-validation-summary__title">title</span>
    <span class="nc-validation-summary__list">list</span>
    <span class="nc-validation-summary__item">item</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Validation Summary mit nur einem Fehler' },
    },
  },
};

export const MultipleErrors = {
  name: 'Multiple Errors',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-validation-summary">
    <span class="nc-validation-summary__title">title</span>
    <span class="nc-validation-summary__list">list</span>
    <span class="nc-validation-summary__item">item</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Validation Summary mit mehreren Fehlern — typischer Formular-Submit' },
    },
  },
};

export const InFormContext = {
  name: 'In Form Context',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-validation-summary">
    <span class="nc-validation-summary__title">title</span>
    <span class="nc-validation-summary__list">list</span>
    <span class="nc-validation-summary__item">item</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Validation Summary am Anfang eines Formulars mit markierten Feldern' },
    },
  },
};

export const HighContrastMode = {
  name: 'High Contrast Mode',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-validation-summary">
    <span class="nc-validation-summary__title">title</span>
    <span class="nc-validation-summary__list">list</span>
    <span class="nc-validation-summary__item">item</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Darstellung in Windows High Contrast Mode (forced-colors)' },
    },
  },
};
