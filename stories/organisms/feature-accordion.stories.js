// ============================================================
// FeatureAccordion — Auto-generated from feature-accordion-recipe.json
// Version: 1.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/FeatureAccordion',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**FeatureAccordion** v1.0.0 (stable)

2-Spalten Grid: nav-links (left) + expandable chapters (right).


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-feature-accordeon">
    <span class="nc-feature-accordeon__left">left</span>
  </div>`,
};

export const FeatureAccordion = {
  name: 'Feature Accordion',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-feature-accordeon">
    <span class="nc-feature-accordeon__left">left</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: '2-Spalten Layout mit Nav-Links und expandierbaren Chapters' },
    },
  },
};
