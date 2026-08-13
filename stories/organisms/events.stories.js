// ============================================================
// Events — Auto-generated from events-recipe.json
// Version: 1.0.0 | Status: draft
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/Events',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Events** v1.0.0 (draft)

Aus dem Drupal-Theme uebernommen; Markup siehe templates/block/ im Theme neo_fe.


`,
      },
    },
    status: { type: 'draft' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-events">
    <span class="nc-events__card">card</span>
    <span class="nc-events__card-footer">card-footer</span>
    <span class="nc-events__card-header">card-header</span>
    <span class="nc-events__card-meta">card-meta</span>
    <span class="nc-events__card-meta-item">card-meta-item</span>
    <span class="nc-events__card-title">card-title</span>
  </div>`,
};

export const Standard = {
  name: 'Standard',
  render: () => `<div class="nc-events">
    <span class="nc-events__card">card</span>
    <span class="nc-events__card-footer">card-footer</span>
    <span class="nc-events__card-header">card-header</span>
    <span class="nc-events__card-meta">card-meta</span>
    <span class="nc-events__card-meta-item">card-meta-item</span>
    <span class="nc-events__card-title">card-title</span>
  </div>`,
  parameters: {
    docs: {
      description: { story: 'events wie auf der Website' },
    },
  },
};
