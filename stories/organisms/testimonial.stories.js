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
  name: 'Standard',
  render: () => `<blockquote class="nc-testimonial" style="min-width: 280px; flex-shrink: 0;">
<p class="nc-testimonial__quote">„Slide 1: Excellente Dokumentation und klare Muster.“</p>
<footer class="nc-testimonial__author">
<div class="nc-testimonial__meta">
<span class="nc-testimonial__name">Pia Weber</span>
<span class="nc-testimonial__role">Product Manager</span>
</div>
</footer>
</blockquote>`,
};
