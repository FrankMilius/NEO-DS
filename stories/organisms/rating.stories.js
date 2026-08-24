// ============================================================
// Rating — Auto-generated from rating-recipe.json
// Version: 2.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/Rating',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Rating** v2.0.0 (stable)

Interaktiv: <div class='nc-rating' role='radiogroup' aria-label='Bewertung'> mit versteckten Radio-Inputs + Labels.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  name: 'Standard',
  render: () => `<!-- @quelle: geerntet von Doku /docs/rating-docs.html -->
<!-- @punkte: 15 -->`,
};

export const Standard = {
  name: 'Standard',
  render: () => `<div class="nc-rating nc-rating--readonly" role="img" aria-label="Bewertung: 4 von 5 Sternen" data-rating-value="4">
<span class="nc-rating__item nc-rating__item--active">
<svg class="nc-rating__star" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linejoin="round">
<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2">
</polygon>
</svg>
</span>
<span class="nc-rating__item nc-rating__item--active">
<svg class="nc-rating__star" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linejoin="round">
<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2">
</polygon>
</svg>
</span>
<span class="nc-rating__item nc-rating__item--active">
<svg class="nc-rating__star" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linejoin="round">
<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2">
</polygon>
</svg>
</span>
<span class="nc-rating__item nc-rating__item--active">
<svg class="nc-rating__star" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linejoin="round">
<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2">
</polygon>
</svg>
</span>
<span class="nc-rating__item">
<svg class="nc-rating__star" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round">
<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2">
</polygon>
</svg>
</span>
<span class="nc-rating__value">4.0</span>
<span class="nc-rating__count">(128 Bewertungen)</span>
</div>`,
};
