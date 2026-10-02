// Vorlage: switch — beide Muster aus scss/scss/05-atoms/_switch.scss:
//   pattern=button    <button class="nc-switch__track" role="switch"
//                     aria-checked> (Zustand per aria-checked; Umschalten
//                     uebernimmt neo-behaviors)
//   pattern=checkbox  natives <input class="nc-switch__input" role="switch">
//                     vor dem Track (Markup aus data/markup/switch.html) —
//                     echt und bedienbar
// Achsen: size und indicators per Modifier; indicators=labels stellt
// I/O (__indicator-on/-off) in den Track.
// Zustaende: checked (aria-checked bzw. checked), disabled nativ; active
// (Squash & Stretch) gibt es nur als :active — wie hover/focus nur echt.
// checked-states zeigt alle Zellen angeschaltet; disabled-states zeigt aus
// und an nebeneinander (render.checkedVariants).
import { klassenOhne, FREMDE_ZUSTANDSKLASSEN, NATIVE_ARIA } from './_helfer.js'

const TEXT = 'Benachrichtigungen'

function indikatoren (m) {
  if (m.wert('indicators') !== 'labels') return ''
  return '<span class="nc-switch__indicator-on" aria-hidden="true">I</span><span class="nc-switch__indicator-off" aria-hidden="true">O</span>'
}

function schalter (m, { an, nr = '' }) {
  const klasse = klassenOhne(m, ...FREMDE_ZUSTANDSKLASSEN, 'nc-switch--disabled')
  const label = m.specimen.render?.compositionType === 'switch-label'
  const name = label ? '' : ` aria-label="${TEXT}"`
  const aus = m.deaktiviert ? ' disabled' : ''
  const text = label ? `<span class="nc-switch__label">${TEXT}</span>` : ''
  if (m.wert('pattern') === 'checkbox') {
    return `<label class="${klasse}"${m.attrsOhne(...NATIVE_ARIA)}>
<input type="checkbox" class="nc-switch__input" role="switch" id="${m.uid}-feld${nr}"${name}${an ? ' checked' : ''}${aus}>
<span class="nc-switch__track">${indikatoren(m)}<span class="nc-switch__thumb"></span></span>
${text}
</label>`
  }
  return `<label class="${klasse}"${m.attrsOhne(...NATIVE_ARIA)}>
<button type="button" class="nc-switch__track" role="switch" id="${m.uid}-feld${nr}" aria-checked="${an}"${name}${aus}>${indikatoren(m)}<span class="nc-switch__thumb"></span></button>
${text}
</label>`
}

export default (zelle, m) => {
  if (m.specimen.render?.checkedVariants) {
    return `<div class="ra-reihe">${m.specimen.render.checkedVariants.map((an, i) => schalter(m, { an, nr: `-${i}` })).join('')}</div>`
  }
  const an = m.hat('checked') || m.specimen.id === 'checked-states'
  return schalter(m, { an })
}
