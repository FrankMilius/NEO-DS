// ============================================================
// FeatureList — Auto-generated from feature-list-recipe.json
// Version: 1.0.0 | Status: draft
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/FeatureList',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**FeatureList** v1.0.0 (draft)

Aus dem Drupal-Theme uebernommen; Markup siehe templates/block/ im Theme neo_fe.


`,
      },
    },
    status: { type: 'draft' },
  },
  argTypes: {
    "unknown": {
      "control": {
        "type": "select"
      },
      "options": [
        "0",
        "1",
        "2",
        "3",
        "4",
        "5"
      ],
      "description": ""
    }
  },
};

export const Default = {
  render: () => `<div class="nc-feature-list">
    <span class="nc-feature-list__content">content</span>
    <span class="nc-feature-list__cta">cta</span>
    <span class="nc-feature-list__icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg></span>
    <span class="nc-feature-list__inner">inner</span>
    <span class="nc-feature-list__item">item</span>
    <span class="nc-feature-list__item-text">item-text</span>
  </div>`,
};

export const Standard = {
  name: 'Standard',
  render: () => `<div class="nc-feature-list">
    <span class="nc-feature-list__content">content</span>
    <span class="nc-feature-list__cta">cta</span>
    <span class="nc-feature-list__icon"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg></span>
    <span class="nc-feature-list__inner">inner</span>
    <span class="nc-feature-list__item">item</span>
    <span class="nc-feature-list__item-text">item-text</span>
  </div>`,
  parameters: {
    docs: {
      description: { story: 'feature-list wie auf der Website' },
    },
  },
};
