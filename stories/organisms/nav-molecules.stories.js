// ============================================================
// NavMolecules — Auto-generated from nav-molecules-recipe.json
// Version: 2.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/NavMolecules',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**NavMolecules** v2.0.0 (stable)

Nav-Link: inline-flex, gap, padding, radius — Hover: BG-Wechsel + Textfarbe. Active: border-bottom accent.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  name: 'Standard',
  render: () => `<!-- @quelle: geerntet von Doku /docs/nav-atoms-docs.html -->
<!-- @punkte: 13 -->`,
};

export const Standard = {
  name: 'Standard',
  render: () => `<button class="nc-nav__toggle nc-nav__link" style="color: inherit; font-size: 1rem;" aria-expanded="false" aria-haspopup="true">
<span class="nc-nav__label">Produkte</span>
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
<polyline points="6 9 12 15 18 9">
</polyline>
</svg>
</button>`,
};
