// Vorlage: pagination — Markup aus data/markup/pagination.html und der
// STRUKTUR in scss/scss/06-molecules/_pagination.scss:
//   nav.nc-pagination  aria-label="Seitennavigation"
//     button.nc-pagination__prev   aria-label (am Rand aria-disabled="true")
//     ol.nc-pagination__list
//       li > button.nc-pagination__item  (aktuelle Seite aria-current="page")
//       li > span.nc-pagination__ellipsis (+ .u-sr-only „Weitere Seiten")
//     span.nc-pagination__info      (minimal: „Seite X von Y" statt Liste)
//     button.nc-pagination__next
//     input.nc-pagination__jumper   (with-jumper, mit verstecktem Label)
//
// Achsen: size, alignment, appearance, elevation, features — alle als
// Modifier an der Wurzel. appearance=minimal zeigt statt der Liste den
// Info-Text. Ausrichtungen ausser start brauchen Breite: ra-feld--breit.
// Zustaende: disabled = Prev/Next am Rand (Specimen first-last-page: erste
// und letzte Seite), hover/focus nur echt (data-zustand an einer Seite),
// active = aktuelle Seite (immer per aria-current).
// Verhalten: Seitenwechsel ist Sache der Anwendung (Links bzw. Knoepfe);
// kein Behavior in neo-behaviors, keine keyboard/events im Recipe.
import { wurzelKlassen } from './_overlay.js'

const ZURUECK = '<svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="15 18 9 12 15 6"></polyline></svg>'
const WEITER = '<svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="9 18 15 12 9 6"></polyline></svg>'
const LETZTE = 12

const AUSLASSUNG = '<li><span class="nc-pagination__ellipsis"><span aria-hidden="true">…</span><span class="u-sr-only">Weitere Seiten</span></span></li>'

/** Seitenfolge um die aktuelle Seite (1 … 4 5 6 … 12). */
function seiten (aktuell) {
  if (aktuell <= 3) return [1, 2, 3, 4, '…', LETZTE]
  if (aktuell >= LETZTE - 2) return [1, '…', LETZTE - 3, LETZTE - 2, LETZTE - 1, LETZTE]
  return [1, '…', aktuell - 1, aktuell, aktuell + 1, '…', LETZTE]
}

function liste (m, aktuell) {
  const zustand = m.attribute['data-zustand']
  let markiert = false
  const eintraege = seiten(aktuell).map((s) => {
    if (s === '…') return AUSLASSUNG
    let attrs = s === aktuell ? ' aria-current="page"' : ''
    // hover/focus: an der ersten Seite, die nicht die aktuelle ist
    if (zustand && !markiert && s !== aktuell) { attrs += ` data-zustand="${zustand}"`; markiert = true }
    return `<li><button type="button" class="nc-pagination__item"${attrs}>${s}</button></li>`
  })
  return `<ol class="nc-pagination__list">\n${eintraege.join('\n')}\n</ol>`
}

function pagination (m, aktuell, name = 'Seitennavigation') {
  const minimal = m.wert('appearance') === 'minimal'
  const amAnfang = aktuell === 1 ? ' aria-disabled="true"' : ''
  const amEnde = aktuell === LETZTE ? ' aria-disabled="true"' : ''
  const mitte = minimal
    ? `<span class="nc-pagination__info">Seite ${aktuell} von ${LETZTE}</span>`
    : liste(m, aktuell)
  const sprung = m.wert('features') === 'with-jumper'
    ? `<label class="u-sr-only" for="${m.uid}-sprung-${aktuell}">Gehe zu Seite</label>
<input class="nc-pagination__jumper" id="${m.uid}-sprung-${aktuell}" type="number" min="1" max="${LETZTE}" placeholder="Seite" inputmode="numeric">`
    : ''
  return `<nav class="${wurzelKlassen(m)}" aria-label="${name}">
<button type="button" class="nc-pagination__prev" aria-label="Vorherige Seite"${amAnfang}>${ZURUECK}</button>
${mitte}
<button type="button" class="nc-pagination__next" aria-label="Nächste Seite"${amEnde}>${WEITER}</button>${sprung ? '\n' + sprung : ''}
</nav>`
}

export default (zelle, m) => {
  let inhalt
  if (m.deaktiviert) {
    // Rand-Zustaende: Prev auf der ersten, Next auf der letzten Seite aus
    inhalt = `<div class="ra-stapel">
${pagination(m, 1, 'Seitennavigation, erste Seite')}
${pagination(m, LETZTE, 'Seitennavigation, letzte Seite')}
</div>`
  } else {
    inhalt = pagination(m, 5)
  }
  const ausrichtung = m.wert('alignment') || 'start'
  return ausrichtung === 'start' ? inhalt : `<div class="ra-feld ra-feld--breit">\n${inhalt}\n</div>`
}
