// Vorlage: tbl-cell — Markup aus data/markup/tbl-cell.html und
// data/markup/table-block.html (Zellen der Vergleichstabelle). Plan v3,
// Phase 4.
//
// Die Zelle gestaltet sich nach ihrem Ort (05-atoms/_tbl-cell.scss):
// th[scope=row] links, Text fett; td mittig. Jede Zelle steht deshalb in
// einer Tabelle (Arena-Rahmen ra-tabelle, ohne nc-compare-table).
//   variante default  Zeilenkopf: Text mit Info-Knopf (__info-btn);
//                     hover/focus am Info-Knopf nur echt (data-zustand)
//   variante icon     Wertzelle nc-tbl-cell--icon mit Haken
// render.compositionType:
//   untertitel  Zeilenkopf mit __sub unter dem Text
//   werte       Wertzellen enthalten (Haken) und nicht enthalten (Strich)
//   symbol      Wertzelle mit __icon-block (Symbol ueber dem Text)
// Haken ohne Farbwerte im SVG wie neoTable seit 25.08.2026 (die Farben
// stehen in 05-atoms/_tbl-icon.scss); aria-label an den Wertsymbolen ist die
// Empfehlung des Recipes — die Website gibt ihnen keinen Text (Befund).
const HAKEN = '<svg class="nc-tbl-icon nc-tbl-icon--check" width="32" height="32" viewBox="0 0 36 36" fill="none" aria-label="enthalten"><circle cx="18" cy="18" r="18"></circle><path d="M12 18L16 22L24 14" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>'
const STRICH = '<svg class="nc-tbl-icon nc-tbl-icon--dash" width="32" height="32" viewBox="0 0 36 36" fill="none" aria-label="nicht enthalten"><path d="M11 18H25" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>'
const INFO = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5"></circle><path d="M8 5.33h.007" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path><path d="M7.33 8H8v2.67h.67" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>'

const tabelle = (zellen) => `<table class="ra-tabelle"><tbody><tr>${zellen}</tr></tbody></table>`

export default (zelle, m) => {
  const art = m.specimen.render?.compositionType
  const zustand = m.attribute['data-zustand'] ? ` data-zustand="${m.attribute['data-zustand']}"` : ''
  if (art === 'werte') {
    return tabelle(`<td><div class="${m.klasse}">${HAKEN}</div></td><td><div class="${m.klasse}">${STRICH}</div></td>`)
  }
  if (art === 'symbol') {
    return tabelle(`<td><div class="${m.basisKlasse}"><div class="nc-tbl-cell__icon-block">${HAKEN}</div><p class="nc-tbl-cell__text">bis 500 Nutzer</p></div></td>`)
  }
  if (m.wert('variante') === 'icon') {
    return tabelle(`<td><div class="${m.klasse}">${HAKEN}</div></td>`)
  }
  const unter = art === 'untertitel' ? '\n<p class="nc-tbl-cell__sub">Betrieb im eigenen Rechenzentrum</p>' : ''
  return tabelle(`<th scope="row"><div class="${m.basisKlasse}">
<p class="nc-tbl-cell__text">On-Premise<button class="nc-tbl-cell__info-btn" type="button" aria-label="Mehr Informationen"${zustand}>${INFO}</button></p>${unter}
</div></th>`)
}
