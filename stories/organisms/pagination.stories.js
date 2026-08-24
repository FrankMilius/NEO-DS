// ============================================================
// Pagination — Auto-generated from pagination-recipe.json
// Version: 2.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/Pagination',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Pagination** v2.0.0 (stable)

Root: <nav aria-label='Seitennavigation'> — landmark fuer Screen Reader.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  name: 'Standard',
  render: () => `<!-- @quelle: geerntet von Doku /docs/pagination-docs.html -->
<!-- @punkte: 45 -->`,
};

export const Standard = {
  name: 'Standard',
  render: () => `<nav class="nc-pagination" aria-label="Seitennavigation">
<button class="nc-pagination__prev" aria-label="Vorherige Seite">
<svg viewBox="0 0 24 24">
<polyline points="15 18 9 12 15 6">
</polyline>
</svg>
</button>
<ol class="nc-pagination__list">
<li>
<button class="nc-pagination__item">1</button>
</li>
<li>
<span class="nc-pagination__ellipsis">…</span>
</li>
<li>
<button class="nc-pagination__item">4</button>
</li>
<li>
<button class="nc-pagination__item" aria-current="page">5</button>
</li>
<li>
<button class="nc-pagination__item">6</button>
</li>
<li>
<span class="nc-pagination__ellipsis">…</span>
</li>
<li>
<button class="nc-pagination__item">12</button>
</li>
</ol>
<button class="nc-pagination__next" aria-label="Nächste Seite">
<svg viewBox="0 0 24 24">
<polyline points="9 18 15 12 9 6">
</polyline>
</svg>
</button>
</nav>`,
};
