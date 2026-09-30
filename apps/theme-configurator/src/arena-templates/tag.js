// Vorlage: tag — Markup aus data/markup/tag.html (nc-tag mit nc-tag__remove
// als Kind) und scss/scss/05-atoms/_tag.scss (Elemente __icon, __label,
// __remove). Alle Achsen per Modifier. interactive rendert einen <button>
// (Umschalter: aria-pressed folgt selected), content=icon-text setzt das
// Symbol, removable den Entfernen-Knopf. disabled sperrt den Knopf.
import { SYMBOL, esc } from './_helfer.js'

export default (zelle, m) => {
  const interaktiv = m.wert('interactive') === 'interactive'
  const inhalt = m.wert('content')
  const ausgewaehlt = m.wert('selected') === 'true'
  const symbol = inhalt === 'icon-text' ? `<span class="nc-tag__icon">${SYMBOL.kreis}</span>` : ''
  const label = `<span class="nc-tag__label">${esc(m.text)}</span>`
  const entfernen = inhalt === 'removable'
    ? `<button type="button" class="nc-tag__remove" aria-label="${esc(m.text)} entfernen"${m.deaktiviert ? ' disabled' : ''}>${SYMBOL.schliessen}</button>`
    : ''
  if (interaktiv) {
    return `<button type="button" class="${m.klasse}" aria-pressed="${ausgewaehlt}"${m.deaktiviert ? ' disabled' : ''}${m.attrsOhne('aria-pressed')}>${symbol}${label}</button>`
  }
  return `<span class="${m.klasse}"${m.attrs}>${symbol}${label}${entfernen}</span>`
}
