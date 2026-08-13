// ============================================================
// CardCta — Auto-generated from card-cta-recipe.json
// Version: 1.0.0 | Status: draft
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Molecules/CardCta',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**CardCta** v1.0.0 (draft)

Aus dem Drupal-Theme uebernommen; Markup siehe templates/block/ im Theme neo_fe.


`,
      },
    },
    status: { type: 'draft' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-card-cta">
    <span class="nc-card-cta__actions">actions</span>
    <span class="nc-card-cta__content">content</span>
    <span class="nc-card-cta__media">media</span>
    <span class="nc-card-cta__overlay">overlay</span>
    <span class="nc-card-cta__title">title</span>
  </div>`,
};

export const Standard = {
  name: 'Standard',
  render: () => `<div class="nc-card-cta">
    <span class="nc-card-cta__actions">actions</span>
    <span class="nc-card-cta__content">content</span>
    <span class="nc-card-cta__media">media</span>
    <span class="nc-card-cta__overlay">overlay</span>
    <span class="nc-card-cta__title">title</span>
  </div>`,
  parameters: {
    docs: {
      description: { story: 'card-cta wie auf der Website' },
    },
  },
};
