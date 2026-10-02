// Vorlage: checkbox — Markup aus data/markup/checkbox.html:
// <label class="nc-checkbox"> mit nativem <input class="nc-checkbox__input">,
// __control und optionalem __label. Das Kaestchen ist echt und bedienbar.
//
// Achsen: size/variant/validation per Modifier aus dem Recipe;
// validation=error zusaetzlich aria-invalid="true".
// Zustaende: checked und disabled als native Attribute; indeterminate gibt
// es nicht als Attribut — die Vorlage markiert das Feld mit
// data-indeterminate, einrichten() setzt input.indeterminate (wie das DS-JS).
// hover/focus nur echt. Das Label steht bei with-label, card und
// variant-comparison; sonst traegt das Feld ein aria-label.
// disabled-states zeigt aus und an nebeneinander.
import { klassenOhne, FREMDE_ZUSTANDSKLASSEN, NATIVE_ARIA } from './_helfer.js'

const MIT_LABEL = new Set(['checkbox-with-label', 'checkbox-card'])

function kaestchen (m, { an = false, unbestimmt = false, nr = '' } = {}) {
  const klasse = klassenOhne(m, ...FREMDE_ZUSTANDSKLASSEN, 'nc-checkbox--disabled')
  const label = MIT_LABEL.has(m.specimen.render?.compositionType)
  const text = m.wert('variant') === 'card' ? 'Newsletter abonnieren' : 'Ich stimme zu'
  const attrs = [
    ` class="nc-checkbox__input" type="checkbox" id="${m.uid}-feld${nr}" name="${m.uid}"`,
    label ? '' : ` aria-label="${text}"`,
    an ? ' checked' : '',
    unbestimmt ? ' data-indeterminate' : '',
    m.wert('validation') === 'error' ? ' aria-invalid="true"' : '',
    m.deaktiviert ? ' disabled' : ''
  ].join('')
  return `<label class="${klasse}"${m.attrsOhne(...NATIVE_ARIA)}>
<input${attrs}>
<span class="nc-checkbox__control"></span>
${label ? `<span class="nc-checkbox__label">${text}</span>` : ''}
</label>`
}

export default (zelle, m) => {
  if (m.specimen.id === 'disabled-states') {
    return `<div class="ra-reihe">${kaestchen(m, { nr: '-aus' })}${kaestchen(m, { an: true, nr: '-an' })}</div>`
  }
  return kaestchen(m, { an: m.hat('checked'), unbestimmt: m.hat('indeterminate') })
}

/** Setzt den unbestimmten Zustand (nur per JS moeglich). */
export function einrichten (element) {
  for (const feld of element.querySelectorAll('input[data-indeterminate]')) feld.indeterminate = true
}
