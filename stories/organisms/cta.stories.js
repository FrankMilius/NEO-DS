// ============================================================
// Cta — Auto-generated from cta-recipe.json
// Version: 1.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/Cta',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**Cta** v1.0.0 (stable)

3-Spalten Grid: clamp padding, clamp gap. Farbe: always-light auf dunklem BG.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  name: 'Standard',
  render: () => `<!-- @quelle: geerntet von Doku /docs/cta-docs.html -->
<!-- @punkte: 17 -->`,
};

export const Standard = {
  name: 'Standard',
  render: () => `<div class="nc-cta">
<div class="nc-cta__left">
<h2 class="nc-section-title">Jetzt starten</h2>
<p class="nc-lead">Die vollständige Lösung für Ihr digitales Business.</p>
</div>
<div class="nc-cta__mid">
<div class="nc-newsletter-cta">
<p style="color: var(--fnd-color-always-light); font-weight: var(--fnd-font-weight-semibold);">Updates per E-Mail</p>
<div class="nc-cta__form">
<input class="nc-input" type="email" placeholder="ihre@email.de" aria-label="E-Mail-Adresse">
<button class="nc-button nc-button--primary">Anmelden</button>
</div>
<p class="nc-cta__note" style="color: var(--fnd-color-always-light); font-size: 0.875rem;">Datenschutz gewährleistet.</p>
</div>
</div>
<div class="nc-cta__right">
<div class="nc-demo-cta">
<p class="nc-demo-cta__title" style="color: var(--fnd-color-always-light);">30 Minuten Beratung</p>
<p style="color: var(--fnd-color-always-light); opacity: 0.85; margin: 0;">Sprechen Sie direkt mit einem Experten.</p>
<div class="nc-demo-cta__form">
<button class="nc-button nc-button--outline" style="color: var(--fnd-color-always-light); border-color: var(--fnd-color-always-light);">Termin buchen</button>
</div>
</div>
</div>
</div>`,
};
