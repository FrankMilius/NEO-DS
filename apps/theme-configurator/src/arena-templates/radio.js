// Vorlage: radio — Markup aus data/markup/radio.html:
// <label class="nc-radio"> mit nativem <input type="radio" class="nc-radio__input">,
// __control und optionalem __label. Das Feld ist echt und bedienbar; jede
// Zelle hat einen eigenen name, damit sich die Zellen nicht abwaehlen.
//
// Achsen: size/alignment/variant/validation per Modifier aus dem Recipe;
// validation=error zusaetzlich aria-invalid="true".
// Zustaende: checked und disabled als native Attribute; hover/focus nur echt.
// Specimens: alignment-comparison mit mehrzeiligem Label (top richtet den
// Punkt an der ersten Zeile aus), radio-group als Gruppe in einem Fieldset,
// disabled-states zeigt aus und an nebeneinander.
import { klassenOhne, FREMDE_ZUSTANDSKLASSEN, NATIVE_ARIA } from './_helfer.js'

const MIT_LABEL = new Set(['radio-with-label', 'radio-card', 'radio-multiline-label', 'radio-group'])
const LANG = 'Ich möchte per E-Mail über neue Funktionen und Veranstaltungen informiert werden.'

function knopf (m, { an = false, nr = '', text = 'Standardversand', wert = 'standard' } = {}) {
  const klasse = klassenOhne(m, ...FREMDE_ZUSTANDSKLASSEN, 'nc-radio--disabled')
  const label = MIT_LABEL.has(m.specimen.render?.compositionType)
  const attrs = [
    ` type="radio" class="nc-radio__input" id="${m.uid}-feld${nr}" name="${m.uid}" value="${wert}"`,
    label ? '' : ` aria-label="${text}"`,
    an ? ' checked' : '',
    m.wert('validation') === 'error' ? ' aria-invalid="true"' : '',
    m.deaktiviert ? ' disabled' : ''
  ].join('')
  return `<label class="${klasse}"${m.attrsOhne(...NATIVE_ARIA)}>
<input${attrs}>
<span class="nc-radio__control"></span>
${label ? `<span class="nc-radio__label">${text}</span>` : ''}
</label>`
}

export default (zelle, m) => {
  const art = m.specimen.render?.compositionType
  if (art === 'radio-group') {
    const optionen = [['standard', 'Standardversand'], ['express', 'Expressversand'], ['abholung', 'Abholung']]
    return `<fieldset class="nc-fieldset nc-fieldset--borderless">
<legend class="nc-fieldset__legend">Versandart</legend>
${optionen.map(([wert, text], i) => knopf(m, { an: m.hat('checked') && i === 1, nr: `-${i}`, text, wert })).join('\n')}
</fieldset>`
  }
  if (m.specimen.id === 'disabled-states') {
    return `<div class="ra-reihe">${knopf(m, { nr: '-aus' })}${knopf(m, { an: true, nr: '-an', wert: 'an' })}</div>`
  }
  if (art === 'radio-multiline-label') {
    return `<div class="ra-feld">${knopf(m, { an: m.hat('checked'), text: LANG })}</div>`
  }
  return knopf(m, { an: m.hat('checked') })
}
