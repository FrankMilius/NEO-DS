// Section (04-objects/_section.scss, .section) — Plan v3, Phase 3, Block
// Layout.
//
// Verschachtelung nach der Anatomie: .section > .nc-container > Inhalt. Die
// Section setzt Polsterung (Dichte) und Flaeche; der Rahmen ra-seite zeichnet
// ihre Kante gestrichelt nach, damit auch die Standard-Flaeche (gleich dem
// Seitengrund) und die Polsterung sichtbar werden.
//
// <section> ohne Namen: kein Landmark (Recipe a11y — nur mit
// aria-labelledby).
//
// Modifier ohne CSS (divider-*, edge-*) zeigen „nicht gebaut" —
// Entscheidungsfall layout-section-modifier, siehe _layout.js.
import { fehlendeKlassen, nichtGebaut, platzhalter } from './_layout.js'

export default (zelle, m) => {
  const fehlend = fehlendeKlassen(m)
  if (fehlend.length) return nichtGebaut(m, fehlend)
  const teile = ['density', 'surface', 'divider', 'edge'].map((a) => m.wert(a)).filter(Boolean)
  return `<div class="ra-seite">
<section class="${m.klasse}"${m.attrs}>
<div class="nc-container">
${platzhalter(teile.length ? teile.join(' · ') : 'Inhalt')}
</div>
</section>
</div>`
}
