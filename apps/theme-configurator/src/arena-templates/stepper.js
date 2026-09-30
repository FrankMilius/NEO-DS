// Vorlage: stepper — Markup aus data/markup/stepper.html.
// Groesse/Validierung per Modifier; disabled deaktiviert Knoepfe und Feld.
const MINUS = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"></line></svg>'
const PLUS = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>'

export default (zelle, m) => {
  const aus = m.deaktiviert ? ' disabled' : ''
  return `
<div class="${m.klasse}" role="group" aria-label="Menge"${m.attrs}>
<button class="nc-stepper__decrement" type="button" aria-label="Wert verringern"${aus}>${MINUS}</button>
<input class="nc-stepper__input" type="number" value="5" min="0" max="99" aria-label="Menge"${aus}>
<button class="nc-stepper__increment" type="button" aria-label="Wert erhöhen"${aus}>${PLUS}</button>
</div>`
}
