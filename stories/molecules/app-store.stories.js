// ============================================================
// AppStore — Auto-generated from app-store-recipe.json
// Version: 1.2.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Molecules/AppStore',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**AppStore** v1.2.0 (stable)

Die Abzeichen sind KEINE Nachbauten der Marken von Apple und Google. Beide geben eigene Bilddateien und Gestaltungsvorgaben vor; bis die vorliegen, steht hier eine Schaltflaeche im Systemstil.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  name: 'Standard',
  render: () => `<div class="nc-app-store">
<h2 class="nc-section-header__title">Jetzt laden — oder in zwei Minuten ansehen</h2>
<p class="nc-section-header__subtitle">Die neo app gibt es für iOS und Android. Der Zugang läuft über Ihre Organisation; einen Testzugang richten wir auf Anfrage ein.</p>
<p class="nc-app-store__note">iOS 16 und Android 10 oder neuer · Deutsch und Englisch</p>
</div>`,
};
