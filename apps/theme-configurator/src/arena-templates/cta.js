// Vorlage: cta — Markup aus data/markup/cta.html. Die Farbangaben stehen so
// im geernteten Website-Markup (Text auf dunkler CTA-Fläche).
export default (zelle, m) => `
<div class="${m.klasse}"${m.attrs}>
<div class="nc-cta__left">
<h2 class="nc-section-title">Jetzt starten</h2>
<p class="nc-lead">Die vollständige Lösung für Ihr digitales Business.</p>
</div>
<div class="nc-cta__mid">
<div class="nc-newsletter-cta">
<p style="color: var(--fnd-color-always-light); font-weight: var(--fnd-font-weight-semibold);">Updates per E-Mail</p>
<div class="nc-cta__form">
<input class="nc-input" type="email" placeholder="ihre@email.de" aria-label="E-Mail-Adresse">
<button class="nc-button nc-button--primary" type="button">Anmelden</button>
</div>
<p class="nc-cta__note" style="color: var(--fnd-color-always-light); font-size: 0.875rem;">Datenschutz gewährleistet.</p>
</div>
</div>
<div class="nc-cta__right">
<div class="nc-demo-cta">
<p class="nc-demo-cta__title" style="color: var(--fnd-color-always-light);">30 Minuten Beratung</p>
<p style="color: var(--fnd-color-always-light); opacity: 0.85; margin: 0;">Sprechen Sie direkt mit einem Experten.</p>
<div class="nc-demo-cta__form">
<button class="nc-button nc-button--outline" type="button" style="color: var(--fnd-color-always-light); border-color: var(--fnd-color-always-light);">Termin buchen</button>
</div>
</div>
</div>
</div>
`
