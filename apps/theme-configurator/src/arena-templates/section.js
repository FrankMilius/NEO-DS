// Section (04-objects/_section.scss, .section) — Plan v3, Phase 3, Block
// Layout.
//
// Verschachtelung nach der Anatomie: .section > .nc-container > Inhalt. Die
// Section setzt Polsterung (Dichte) und Flaeche; der Rahmen ra-seite zeichnet
// ihre Kante gestrichelt nach, damit auch die Standard-Flaeche (gleich dem
// Seitengrund) und die Polsterung sichtbar werden.
//
// Website-Specimens (render.website): .nc-section bzw. .nc-section--full,
// wie neocosmo.de sie setzt — Recipe-Block website.
//
// <section> ohne Namen: kein Landmark (Recipe a11y — nur mit
// aria-labelledby).
//
// Divider sind seit dem 06.10.2026 gebaut (Entscheidung
// layout-section-modifier) und erscheinen als echte Rahmenkante; die
// Kantenformen (edge-*) sind aus dem Recipe gestrichen. Was das Recipe
// kuenftig ohne CSS beschreibt, zeigt „nicht gebaut" (siehe _layout.js).
import { fehlendeKlassen, nichtGebaut, platzhalter } from './_layout.js'

export default (zelle, m) => {
  // Website-Form (Recipe-Block website, Entscheidung 06.10.2026): Klassen aus
  // render.website statt der Recipe-Basis — so, wie Drupal sie setzt
  const website = m.specimen.render?.website
  if (website) {
    return `<div class="ra-seite">
<section class="${website}" data-recipe-wurzel="${m.root}">
<div class="nc-container">
${platzhalter(website.split(' ').map((k) => '.' + k).join(' '))}
</div>
</section>
</div>`
  }
  const fehlend = fehlendeKlassen(m)
  if (fehlend.length) return nichtGebaut(m, fehlend)
  const teile = ['density', 'surface', 'divider'].map((a) => m.wert(a)).filter(Boolean)
  return `<div class="ra-seite">
<section class="${m.klasse}"${m.attrs}>
<div class="nc-container">
${platzhalter(teile.length ? teile.join(' · ') : 'Inhalt')}
</div>
</section>
</div>`
}
