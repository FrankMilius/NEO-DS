// ============================================================
// FormSection — Auto-generated from form-section-recipe.json
// Version: 1.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/FormSection',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**FormSection** v1.0.0 (stable)

Logische Gruppierung innerhalb eines Formulars mit optionalem Titel + Beschreibung.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-form-section">
    <span class="nc-form-section__content">content</span>
  </div>`,
};

export const DefaultSection = {
  name: 'Default Section',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-form-section">
    <span class="nc-form-section__content">content</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Section mit Titel, Beschreibung und Form-Fields' },
    },
  },
};

export const VariantComparison = {
  name: 'Variant Comparison',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  
</div>`,
  parameters: {
    docs: {
      description: { story: 'Default, Bordered, Compact' },
    },
  },
};

export const ContentVariants = {
  name: 'Content Variants',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-form-section">
    <span class="nc-form-section__content">content</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Fields-Only, With Title, With Header' },
    },
  },
};

export const MultipleSections = {
  name: 'Multiple Sections',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-form-section">
    <span class="nc-form-section__content">content</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Mehrere Sections nacheinander mit Bordered-Trennlinien' },
    },
  },
};

export const WithDivider = {
  name: 'With Divider',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-form-section">
    <span class="nc-form-section__content">content</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Sections getrennt durch .nc-form-divider <hr>' },
    },
  },
};

export const CompactForm = {
  name: 'Compact Form',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-form-section">
    <span class="nc-form-section__content">content</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Kompakte Sections fuer platzbeschraenkte Formulare' },
    },
  },
};
