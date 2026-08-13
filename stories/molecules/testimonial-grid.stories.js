// ============================================================
// TestimonialGrid — Auto-generated from testimonial-grid-recipe.json
// Version: 1.0.0 | Status: draft
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Molecules/TestimonialGrid',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**TestimonialGrid** v1.0.0 (draft)

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
        "2"
      ],
      "description": ""
    }
  },
};

export const Default = {
  render: () => `<div class="nc-testimonial-grid">
    <span class="nc-testimonial-grid__btn">btn</span>
    <span class="nc-testimonial-grid__nav">nav</span>
  </div>`,
};

export const Standard = {
  name: 'Standard',
  render: () => `<div class="nc-testimonial-grid">
    <span class="nc-testimonial-grid__btn">btn</span>
    <span class="nc-testimonial-grid__nav">nav</span>
  </div>`,
  parameters: {
    docs: {
      description: { story: 'testimonial-grid wie auf der Website' },
    },
  },
};
