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
  render: () => `<!-- @quelle: geerntet von /loesungen/anwendungsfaelle/content-management -->`,
};

export const Standard = {
  name: 'Standard',
  render: () => `<figure class="nc-testimonial">
<blockquote class="nc-testimonial__quote">„Wir haben unsere Website mit Intranet verbunden – und können extern wie intern mit einer Plattform kommunizieren."</blockquote>
</figure>`,
};
