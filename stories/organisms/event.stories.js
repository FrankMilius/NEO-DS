// ============================================================
// Event — Auto-generated from event-recipe.json
// Version: 1.0.0 | Status: draft
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/Event',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Event** v1.0.0 (draft)

Aus dem Drupal-Theme uebernommen; Markup siehe templates/block/ im Theme neo_fe.


`,
      },
    },
    status: { type: 'draft' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-event">
    <span class="nc-event__agenda">agenda</span>
    <span class="nc-event__content-grid">content-grid</span>
    <span class="nc-event__cta">cta</span>
    <span class="nc-event__hero">hero</span>
    <span class="nc-event__hero-content">hero-content</span>
    <span class="nc-event__hero-media">hero-media</span>
  </div>`,
};

export const Standard = {
  name: 'Standard',
  render: () => `<div class="nc-event">
    <span class="nc-event__agenda">agenda</span>
    <span class="nc-event__content-grid">content-grid</span>
    <span class="nc-event__cta">cta</span>
    <span class="nc-event__hero">hero</span>
    <span class="nc-event__hero-content">hero-content</span>
    <span class="nc-event__hero-media">hero-media</span>
  </div>`,
  parameters: {
    docs: {
      description: { story: 'event wie auf der Website' },
    },
  },
};
