// Vorlage: pricing — Markup aus data/markup/pricing.html (Karte mit Preis und
// Featureliste nc-pricing-features). variant=featured → is-featured.
// Polster und Rahmen gestaltet styles.css (Entscheidung 06.10.2026; die
// Inline-Stile der Doku sind entfernt). render.compositionType „raster": drei
// Tarife im Seitenraster nc-pricing-grid (04-objects/_section.scss), der
// mittlere hervorgehoben.
const TARIFE = [
  ['Starter', '0', ['Bis 50 Nutzer', 'News und Seiten']],
  ['Business', '12', ['Unbegrenzte Nutzer', 'Mitarbeiter-App', 'SSO / SAML']],
  ['Enterprise', '29', ['Alles aus Business', 'Audit-Logs', '24/7 Support']]
]

const karte = (klasse, attrs, [, preis, features]) => `<div class="${klasse}"${attrs}>
<div class="nc-price">€ ${preis}</div>
<ul class="nc-pricing-features">
${features.map((f) => `<li class="nc-pricing-features__item">${f}</li>`).join('\n')}
</ul>
</div>`

export default (zelle, m) => {
  if (m.specimen.render?.compositionType === 'raster') {
    return `<div class="ra-feld ra-feld--sehr-breit"><div class="nc-pricing-grid">
${TARIFE.map((t, i) => karte(i === 1 ? `${m.basisKlasse} is-featured` : m.basisKlasse, '', t)).join('\n')}
</div></div>`
  }
  return '\n' + karte(m.klasse, m.attrs, m.wert('variant') === 'featured' ? TARIFE[1] : TARIFE[0]) + '\n'
}
