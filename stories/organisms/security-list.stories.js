// ============================================================
// SecurityList — Auto-generated from security-list-recipe.json
// Version: 1.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/SecurityList',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**SecurityList** v1.0.0 (stable)

Grid-Layout mit gap. Items: flex, align-items center, border-bottom.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  name: 'Standard',
  render: () => `<!-- @quelle: geerntet von Doku /docs/security-list-docs.html -->
<!-- @punkte: 11 -->`,
};

export const Standard = {
  name: 'Standard',
  render: () => `<ul class="nc-security-list" style="max-width: 420px;">
<li class="nc-security-list__item">Zwei-Faktor-Authentifizierung</li>
<li class="nc-security-list__item">Automatische Sicherheitsupdates</li>
<li class="nc-security-list__item">Penetrationstests durch Dritte</li>
</ul>`,
};
