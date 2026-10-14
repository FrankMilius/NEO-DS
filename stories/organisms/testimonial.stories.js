// ============================================================
// Testimonial — Auto-generated from testimonial-recipe.json
// Version: 1.2.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/Testimonial',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Testimonial** v1.2.0 (stable)

figure.nc-testimonial (Karte: background-secondary, radius-4xl, Polsterung spacing-05, Grid gap spacing-05) > blockquote.__quote, optional ul.__results, figcaption.__author > div.__meta > cite.__name + span.__role, optional p.__context.


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
