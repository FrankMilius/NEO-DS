// ============================================================
// SecurityList — Auto-generated from security-list-recipe.json
// Version: 1.2.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/SecurityList',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**SecurityList** v1.2.0 (stable)

Liste: ul.nc-security-list ohne Aufzaehlungszeichen, Grid mit gap spacing-03.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  name: 'Standard',
  render: () => `<ul class="nc-security-list" style="max-width: 420px;">
<li class="nc-security-list__item">Zwei-Faktor-Authentifizierung</li>
<li class="nc-security-list__item">Automatische Sicherheitsupdates</li>
<li class="nc-security-list__item">Penetrationstests durch Dritte</li>
</ul>`,
};
