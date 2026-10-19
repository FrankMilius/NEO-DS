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
import { abschnitt, fehlendeKlassen, nichtGebaut } from './_layout.js'
import { esc } from '../lib/recipe-arena.js'

export default (zelle, m) => {
  // Website-Form (Recipe-Block website, Entscheidung 06.10.2026): Klassen aus
  // render.website statt der Recipe-Basis — so, wie Drupal sie setzt
  const website = m.specimen.render?.website
  if (website) {
    return `<div class="ra-seite">
<section class="${website}" data-recipe-wurzel="${m.root}" data-hilfe="${esc(website.split(' ').map((k) => '.' + k).join(' '))}">
<div class="nc-container">
${abschnitt({ karten: 2 })}
</div>
</section>
</div>`
  }
  const fehlend = fehlendeKlassen(m)
  if (fehlend.length) return nichtGebaut(m, fehlend)
  const teile = ['density', 'surface', 'divider'].map((a) => m.wert(a)).filter(Boolean)
  // Divider: Umriss der Arena mit Abstand, sonst laege er auf der Linie
  const divider = m.wert('divider') && m.wert('divider') !== 'none'
  return `<div class="ra-seite${divider ? ' ra-seite--kante' : ''}">
<section class="${m.klasse}"${m.attrs} data-hilfe="${esc(teile.length ? teile.join(' · ') : 'Standard')}">
<div class="nc-container">
${abschnitt({ karten: 2 })}
</div>
</section>
</div>`
}
