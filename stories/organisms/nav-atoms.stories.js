// ============================================================
// NavAtoms — Auto-generated from nav-atoms-recipe.json
// Version: 2.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/NavAtoms',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**NavAtoms** v2.0.0 (stable)

Icon: inline-flex Container, width/height via --nc-nav-atom-icon-size (default 24px).


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
<!-- @punkte: 11 -->`,
};

export const Standard = {
  name: 'Standard',
  render: () => `<span class="nc-nav__icon">
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z">
</path>
</svg>
</span>`,
};
