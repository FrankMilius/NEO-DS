// Container (04-objects/_section.scss, .nc-container) — Plan v3, Phase 3,
// Block Layout.
//
// Der Container begrenzt die Breite erst ab lg (Fenster >= 1200 px) auf
// --nc-container-max-width. In einer Arena-Zelle (rund 600 px) waeren alle
// Breiten gleich breit — der Rahmen ra-massstab ist deshalb eine
// Desktop-Seite von 1600 px im Massstab 1:2,5. Darin gelten die echten
// Werte: 1200 / 1440 / 768 px / volle Breite.
//
// Inhalt: echter Website-Abschnitt (abschnitt(), 19.10.2026). Die Kante des
// Containers und die Maßangabe (data-hilfe) zeigt der Schalter
// „Hilfslinien“. Im Geräterahmen „Desktop“ gilt die echte Fensterbreite;
// ra-massstab zoomt nur noch in der Ansicht „Voll“.
//
// vspace, align und surface sind seit dem 06.10.2026 gebaut (Entscheidung
// layout-container-modifier) und erscheinen als echte Modifier: vspace als
// Polsterung oben/unten, align erst im Massstab sichtbar (max-width ab lg),
// surface mit Flaeche, Radius und Schatten. Was das Recipe kuenftig ohne
// CSS beschreibt, zeigt „nicht gebaut" (siehe _layout.js).
import { abschnitt, fehlendeKlassen, nichtGebaut, wertBeschreibung } from './_layout.js'
import { esc } from '../lib/recipe-arena.js'

const ACHSEN = ['width', 'vertical-spacing', 'alignment', 'surface']

export default (zelle, m) => {
  const fehlend = fehlendeKlassen(m)
  if (fehlend.length) return nichtGebaut(m, fehlend)
  // Beschriftung: der Achsenwert, den das Specimen variiert, mit der
  // Beschreibung aus dem Recipe
  const achse = ACHSEN.find((a) => m.wert(a) !== undefined) || 'width'
  const text = wertBeschreibung(m, achse) || m.text
  // Echter Inhalt (19.10.2026); die Maßangabe nur mit „Hilfslinien“
  return `<div class="ra-massstab">
<div class="${m.klasse}"${m.attrs} data-hilfe="${esc(text)}">
${abschnitt()}
</div>
</div>`
}
