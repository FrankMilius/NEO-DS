// Vorlage: range — Markup aus data/markup/range.html: <div class="nc-range">
// mit nativem <input type="range" class="nc-range__input">, optional
// __output, __labels (__label-min/-max) und __tooltip. Der Regler ist echt
// und bedienbar.
//
// Die Lage von Tooltip und Fuellung steuert das DS ueber --nc-range-progress
// (0–100, im DS setzt es das JS) — die Vorlage setzt den Startwert an der
// Wurzel; im Range-Modus --nc-range-progress-min/-max.
//
// Achsen: orientation/mode/display/validation per Modifier aus dem Recipe;
// display steuert Tooltip (with-tooltip, full), Ausgabe (with-output) und
// Min/Max-Beschriftung (with-labels, full). mode=range: zwei ueberlagerte
// Regler (zweimal __input, der obere mit __input--max, den das SCSS nach
// oben legt) ueber __track/__fill.
// Zustaende: disabled nativ + nc-range--disabled; hover/focus/active nur
// echt (der Tooltip erscheint bei Hover, Fokus und Ziehen).
// with-form-field stellt den Regler mit Label in ein Formularfeld.
import { klassenOhne, FREMDE_ZUSTANDSKLASSEN, NATIVE_ARIA } from './_helfer.js'

const WERT = 40

export default (zelle, m) => {
  const display = m.wert('display') || 'plain'
  const bereich = m.wert('mode') === 'range'
  const tooltip = m.slot('tooltip') || display === 'with-tooltip' || display === 'full'
  const ausgabe = display === 'with-output'
  const beschriftung = display === 'with-labels' || display === 'full'
  const imFeld = m.specimen.render?.compositionType === 'slider-form-field'
  const klasse = klassenOhne(m, ...FREMDE_ZUSTANDSKLASSEN)
  const aus = m.deaktiviert ? ' disabled' : ''
  const id = `${m.uid}-feld`
  const name = imFeld ? '' : ' aria-label="Lautstärke"'
  const fehler = m.wert('validation') === 'error' ? ' aria-invalid="true"' : ''

  let innen
  let stil
  if (bereich) {
    stil = '--nc-range-progress-min: 20; --nc-range-progress-max: 70; --nc-range-progress: 70'
    innen = `<div class="nc-range__track"><div class="nc-range__fill"></div></div>
<input class="nc-range__input" type="range" min="0" max="100" value="20" aria-label="Preis von"${aus}>
<input class="nc-range__input nc-range__input--max" type="range" min="0" max="100" value="70" aria-label="Preis bis"${aus}>
${tooltip ? '<span class="nc-range__tooltip" aria-hidden="true">20 – 70 €</span>' : ''}`
  } else {
    stil = `--nc-range-progress: ${WERT}`
    innen = `<input class="nc-range__input" type="range" min="0" max="100" value="${WERT}" id="${id}"${name}${fehler}${aus}>
${tooltip ? `<span class="nc-range__tooltip" aria-hidden="true">${WERT}</span>` : ''}
${ausgabe ? `<output class="nc-range__output" for="${id}">${WERT}</output>` : ''}
${beschriftung ? '<div class="nc-range__labels" aria-hidden="true"><span class="nc-range__label-min">0</span><span class="nc-range__label-max">100</span></div>' : ''}`
  }

  const regler = `<div class="${klasse}" style="${stil}"${m.attrsOhne(...NATIVE_ARIA)}>
${innen}
</div>`
  if (imFeld) {
    return `<div class="nc-form-field ra-feld">
<label class="nc-form-label" for="${id}"><span class="nc-form-label__text">Lautstärke</span></label>
${regler}
</div>`
  }
  return `<div class="ra-feld">${regler}</div>`
}
