// Vorlage: table-block — Markup aus data/markup/table-block.html (Website
// /events/editionen-preise): Block nc-table-block (data-neo-table, Breite,
// Scroll-Grenze, feste erste Spalte) um eine Vergleichstabelle
// nc-compare-table --striped --sticky-header --full-width --sticky-col.
// Gekuerzt auf eine Rubrik mit fuenf Zeilen; die Rubrik ist wie auf der
// Website eine normale Zeile (th scope=row, leere Zellen), Zeilenkoepfe mit
// Info-Knopf wie bei „On-Premise" (das Symbol ohne nc-tbl-info-icon: die
// Klasse der Ernte hat kein CSS). Plan v3, Phase 4.
// Die Kopffarben (--tbl-header-bg/--tbl-stripe-bg) setzt Drupal je Block
// inline — die Arena zeigt die DS-Vorgabe (background-tertiary).
// Zustand scrolled: schmaler Rahmen (ra-schmal), die
// Tabelle scrollt waagerecht (data-scroll-active=true, Tabelle max-content)
// und ist nach rechts gescrollt (is-scrolled — der Schatten der festen
// ersten Spalte erscheint), so wie es neo-theme.js beim Scrollen setzt.
const HAKEN = '<svg class="nc-tbl-icon nc-tbl-icon--check" width="32" height="32" viewBox="0 0 36 36" fill="none" aria-label="enthalten"><circle cx="18" cy="18" r="18" fill="#AEF359"></circle><path d="M12 18L16 22L24 14" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>'
const STRICH = '<svg class="nc-tbl-icon nc-tbl-icon--dash" width="32" height="32" viewBox="0 0 36 36" fill="none" aria-label="nicht enthalten"><path d="M11 18H25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>'
const INFO = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5"></circle><path d="M8 5.33h.007" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path><path d="M7.33 8H8v2.67h.67" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>'

const ZEILEN = [
  ['News, Newskanäle', true, true],
  ['Inhalts- und Wissensseiten', true, true],
  ['Veranstaltungskalender &amp; Event-Seiten', true, true],
  ['On-Premise', false, true, true],
  ['Personalisierte Toolbar &amp; Schnellzugriff', false, true]
]

const wert = (an) => `<td><div class="nc-tbl-cell nc-tbl-cell--icon">${an ? HAKEN : STRICH}</div></td>`
const kopf = (text, info) => `<th scope="row"><div class="nc-tbl-cell"><p class="nc-tbl-cell__text">${text}${info ? `<button class="nc-tbl-cell__info-btn" type="button" aria-label="Mehr Informationen">${INFO}</button>` : ''}</p></div></th>`

export default (_zelle, m) => {
  const gescrollt = m.hat('scrolled')
  const tabelle = `<div class="${m.klasse}${gescrollt ? ' is-scrolled' : ''}" data-neo-table="" data-width="full" data-scroll-bp="768" data-sticky-col="first" data-scroll-active="${gescrollt}"${m.attrs}>
<div class="nc-compare-table nc-compare-table--striped nc-compare-table--sticky-header nc-compare-table--full-width nc-compare-table--sticky-col">
<table>
<thead><tr><th scope="col">Funktion</th><th scope="col">Standard</th><th scope="col">Premium</th></tr></thead>
<tbody>
<tr>${kopf('FÜR MITARBEITENDE / ENDNUTZER')}<td><div class="nc-tbl-cell"></div></td><td><div class="nc-tbl-cell"></div></td></tr>
${ZEILEN.map(([text, std, prem, info]) => `<tr>${kopf(text, info)}${wert(std)}${wert(prem)}</tr>`).join('\n')}
</tbody>
</table>
</div>
</div>`
  return gescrollt ? `<div class="ra-schmal">${tabelle}</div>` : tabelle
}

/** Gescrollt: die Tabelle steht nach rechts verschoben (scrollLeft wie nach dem Wischen). */
export function einrichten (zelle) {
  for (const block of zelle.querySelectorAll('.nc-table-block.is-scrolled')) block.scrollLeft = 120
}
