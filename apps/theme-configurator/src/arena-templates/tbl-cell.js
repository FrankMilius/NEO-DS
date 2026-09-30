// Vorlage: tbl-cell — Markup aus data/markup/tbl-cell.html (Tabellenzelle der
// Vergleichstabelle). Achse variante=icon zeigt die Haken-Zelle.
import { SYMBOL } from './_helfer.js'

const HAKEN = '<svg class="nc-tbl-icon nc-tbl-icon--check" width="32" height="32" viewBox="0 0 36 36" fill="none" aria-label="enthalten"><circle cx="18" cy="18" r="18"></circle><path d="M12 18L16 22L24 14" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>'

export default (zelle, m) => {
  if (m.wert('variante') === 'icon') {
    return `<div class="${m.klasse}"${m.attrs}>${HAKEN}</div>`
  }
  return `
<div class="${m.klasse}"${m.attrs}>
<p class="nc-tbl-cell__text">On-Premise<button class="nc-tbl-cell__info-btn" type="button" aria-label="Mehr Informationen">${SYMBOL.info}</button></p>
<p class="nc-tbl-cell__sub">Betrieb im eigenen Rechenzentrum</p>
</div>`
}
