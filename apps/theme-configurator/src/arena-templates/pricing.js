// Vorlage: pricing — Markup aus data/markup/pricing.html; Featureliste mit
// den Klassen aus der Anatomie (nc-pricing-features). variant=featured → is-featured.
export default (zelle, m) => `
<div class="${m.klasse}"${m.attrs}>
<div class="nc-price">€ ${m.wert('variant') === 'featured' ? '12' : '0'}</div>
<ul class="nc-pricing-features">
<li class="nc-pricing-features__item">Feature A</li>
<li class="nc-pricing-features__item">Feature B</li>
</ul>
</div>
`
