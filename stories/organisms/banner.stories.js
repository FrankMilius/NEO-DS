// ============================================================
// Banner — Auto-generated from banner-recipe.json
// Version: 2.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/Banner',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Banner** v2.0.0 (stable)

Seitenbreite Benachrichtigungsleiste — Unterschied zu Alert: Banner ist sticky/fixed, seitenbreit.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  name: 'Standard',
  render: () => `<!-- @quelle: geerntet von Doku /docs/banner-docs.html -->
<!-- @punkte: 14 -->`,
};

export const Standard = {
  name: 'Standard',
  render: () => `<div class="nc-banner nc-banner--danger" role="alert">
<span class="nc-banner__icon" aria-hidden="true">
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
<circle cx="12" cy="12" r="10">
</circle>
<line x1="15" y1="9" x2="9" y2="15">
</line>
<line x1="9" y1="9" x2="15" y2="15">
</line>
</svg>
</span>
<div class="nc-banner__content">
<span>Kritischer Systemfehler — einige Dienste sind derzeit nicht erreichbar.</span>
<a class="nc-banner__link" href="#">Status-Seite</a>
</div>
<button class="nc-banner__close" aria-label="Banner schließen">
<svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
<line x1="4" y1="4" x2="16" y2="16">
</line>
<line x1="16" y1="4" x2="4" y2="16">
</line>
</svg>
</button>
</div>`,
};
