// ============================================================
// News — Auto-generated from news-recipe.json
// Version: 1.0.0 | Status: draft
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/News',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**News** v1.0.0 (draft)

Aus dem Drupal-Theme uebernommen; Markup siehe templates/block/ im Theme neo_fe.


`,
      },
    },
    status: { type: 'draft' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-news">
    <span class="nc-news__body">body</span>
    <span class="nc-news__date">date</span>
    <span class="nc-news__eyebrow">eyebrow</span>
    <span class="nc-news__footer">footer</span>
    <span class="nc-news__hero">hero</span>
    <span class="nc-news__hero-cta">hero-cta</span>
  </div>`,
};

export const Standard = {
  name: 'Standard',
  render: () => `<div class="nc-news">
    <span class="nc-news__body">body</span>
    <span class="nc-news__date">date</span>
    <span class="nc-news__eyebrow">eyebrow</span>
    <span class="nc-news__footer">footer</span>
    <span class="nc-news__hero">hero</span>
    <span class="nc-news__hero-cta">hero-cta</span>
  </div>`,
  parameters: {
    docs: {
      description: { story: 'news wie auf der Website' },
    },
  },
};
