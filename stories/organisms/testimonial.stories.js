// ============================================================
// Testimonial — Auto-generated from testimonial-recipe.json
// Version: 1.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/Testimonial',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Testimonial** v1.0.0 (stable)

Card: background-secondary, radius-sm, padding-05, grid gap 1.25rem, scroll-snap-align.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  render: () => `<div class="nc-testimonial">
    <span class="nc-testimonial__quote">quote</span>
    <span class="nc-testimonial__author">author</span>
    <span class="nc-testimonial__name">name</span>
  </div>`,
};

export const Testimonial = {
  name: 'Testimonial',
  render: () => `<div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; ">
  <div class="nc-testimonial">
    <span class="nc-testimonial__quote">quote</span>
    <span class="nc-testimonial__author">author</span>
    <span class="nc-testimonial__name">name</span>
  </div>
</div>`,
  parameters: {
    docs: {
      description: { story: 'Zitat-Karte mit Autor und Rolle' },
    },
  },
};
