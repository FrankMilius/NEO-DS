// Vorlage: container-intent (04-objects/_container-intent.scss) — Plan v3,
// Phase 5. Markup wie im Section-Layout der Website
// (neo_fe/templates/layouts/neo-section-default.html.twig):
//   <section class="nc-section"><div class="container container--{{ width }}">
//
// Die Breiten (72ch bis 1536 px) greifen erst auf Seitenbreite — der Rahmen
// ra-massstab ist deshalb eine Desktop-Seite von 1600 px im Massstab 1:2,7
// wie beim .nc-container. Der Platzhalter ist Arena-Inhalt.
import { platzhalter, wertBeschreibung } from './_layout.js'

export default (zelle, m) => {
  const text = `.${m.klassen.join('.')} — ${wertBeschreibung(m, 'width') || m.text}`
  const container = `<div class="${m.klasse}"${m.attrs}>
${platzhalter(text)}
</div>`
  if (m.specimen.render?.website) {
    return `<div class="ra-massstab">
<section class="nc-section">
${container}
</section>
</div>`
  }
  return `<div class="ra-massstab">
${container}
</div>`
}
