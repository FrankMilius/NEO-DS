// Vorlage: badge — Markup aus data/markup/badge.html. Noch nicht sichtbar:
// badge hat eine handgeschriebene Arena (SONDERFAELLE); die Vorlage bereitet
// deren Abloesung vor.
// decorator: icon (Slot per slotConfig), dot/pulse (ohne Text, aria-label),
// counter (Zahl aus render.counterValues).
import { SYMBOL, esc } from './_helfer.js'

export default (zelle, m) => {
  const deko = m.wert('decorator')
  if (deko === 'dot' || deko === 'pulse') {
    return `<span class="${m.klasse}" aria-label="${esc(m.text)}"${m.attrs}></span>`
  }
  const zahl = m.specimen.render?.counterValues?.[0]
  const text = deko === 'counter' || deko === 'decorator' ? (zahl || '3') : esc(m.text)
  return `<span class="${m.klasse}"${m.attrs}>${m.slot('icon') ? `<span class="nc-badge__icon">${SYMBOL.kreis}</span>` : ''}<span class="nc-badge__label">${text}</span></span>`
}
