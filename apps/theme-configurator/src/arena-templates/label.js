// Vorlage: label — Markup aus data/markup/label.html (<span class="nc-label
// nc-label--pill">) mit den Elementen aus _label.scss (__icon, __text,
// __remove). Achsen per Modifier. render.icon setzt das Symbol,
// render.removable den Entfernen-Knopf (+ nc-label--removable), interactive
// rendert einen <button>. container-stacking stellt das Label in den
// nc-labels-container.
import { SYMBOL, esc } from './_helfer.js'

const TEXT = {
  default: 'Neu', accent: 'KI-nativ', success: 'Aktiv', warning: 'Prüfen', danger: 'Abgelaufen', info: 'Hinweis'
}

export default (zelle, m) => {
  const render = m.specimen.render || {}
  const text = TEXT[m.wert('variant')] || 'KI-nativ'
  const symbol = render.icon ? `<span class="nc-label__icon">${SYMBOL.info}</span>` : ''
  const entfernbar = render.removable === true
  const klassen = entfernbar && !m.klassen.includes('nc-label--removable') ? `${m.klasse} nc-label--removable` : m.klasse
  const entfernen = entfernbar
    ? `<button type="button" class="nc-label__remove" aria-label="${esc(text)} entfernen"${m.deaktiviert ? ' disabled' : ''}>${SYMBOL.schliessen}</button>`
    : ''
  const inhalt = `${symbol}<span class="nc-label__text">${esc(text)}</span>${entfernen}`
  const html = m.wert('interactive') === 'true' && !entfernbar
    ? `<button type="button" class="${klassen}"${m.deaktiviert ? ' disabled' : ''}${m.attrs}>${inhalt}</button>`
    : `<span class="${klassen}"${m.attrs}>${inhalt}</span>`
  return m.specimen.id === 'container-stacking' ? `<div class="nc-labels-container">${html}</div>` : html
}
