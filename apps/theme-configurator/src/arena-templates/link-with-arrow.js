// Vorlage: link-with-arrow — Markup aus data/markup/link-with-arrow.html
// (<a class="link-with-arrow"> mit Linktext und Pfeil-SVG). Plan v3, Phase 4.
//
// render.compositionType (Anwendungen aus der Doku, Abschnitt
// „Anwendungsbeispiele"):
//   liste  drei Links untereinander (Standard-Verwendung)
//   text   am Ende eines Textabschnitts (Absatz + Link)
//   karte  im Fuss einer Karte (nc-card mit Titel und Beschreibung)
// Ohne compositionType: ein Link; hover/focus nur echt (data-zustand).
import { SYMBOL } from './_helfer.js'

const link = (m, text) => `<a href="#" onclick="return false" class="${m.klasse}"${m.attrs}>${text} ${SYMBOL.pfeil}</a>`

export default (zelle, m) => {
  switch (m.specimen.render?.compositionType) {
    case 'liste':
      return `<div class="ra-stapel">
${['Mehr erfahren', 'Alle Produkte anzeigen', 'Zur Dokumentation'].map((t) => link(m, t)).join('\n')}
</div>`
    case 'text':
      return `<div class="ra-feld ra-feld--breit">
<p>NEOCOSMO entwickelt digitale Lösungen für interne Kommunikation und Wissensmanagement in Unternehmen.</p>
${link(m, 'Mehr über uns')}
</div>`
    case 'karte':
      return `<div class="ra-feld">
<article class="nc-card">
<div class="nc-card__content">
<h3 class="nc-card__title">Feature-Titel</h3>
<p class="nc-card__description">Kurze Beschreibung dieses Features.</p>
</div>
<div class="nc-card__footer">${link(m, 'Details ansehen')}</div>
</article>
</div>`
    default:
      return link(m, 'Mehr erfahren')
  }
}
