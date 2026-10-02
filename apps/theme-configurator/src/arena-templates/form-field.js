// Vorlage: form-field — Markup aus data/markup/form-field.html:
// <div class="nc-form-field"> mit .nc-form-label (for/id), .nc-input und
// .nc-form-error bzw. .nc-form-hint (per aria-describedby verbunden).
// Komposition im Recipe: enthaelt form-label, input, form-error.
//
// Achsen: layout/validation per Modifier aus dem Recipe;
//   requirement  required: Stern im Label (__required) + required am Feld;
//                optional: „(optional)" (__optional)
//   validation   error: Feld aria-invalid + Fehlermeldung (role="alert");
//                success: Bestaetigung (nc-form-error--success, role="status")
//   content      with-hint: Hinweis unter dem Feld; full: Hinweis + Meldung
//   grouping     fieldset: <fieldset class="nc-form-field"> mit <legend
//                class="nc-form-label"> fuer zusammengehoerige Felder
// Zustand: disabled = nc-form-field--disabled + Feld disabled.
import { klassenOhne, FREMDE_ZUSTANDSKLASSEN, NATIVE_ARIA, SYMBOL } from './_helfer.js'

const MELDUNG = {
  error: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.',
  success: 'Die E-Mail-Adresse ist gültig.'
}

function marke (m) {
  const anforderung = m.wert('requirement')
  if (anforderung === 'required') return '<span class="nc-form-label__required" aria-hidden="true">*</span>'
  if (anforderung === 'optional') return '<span class="nc-form-label__optional">(optional)</span>'
  return ''
}

export default (zelle, m) => {
  const klasse = klassenOhne(m, ...FREMDE_ZUSTANDSKLASSEN)
  const attrs = m.attrsOhne(...NATIVE_ARIA)
  const aus = m.deaktiviert ? ' disabled' : ''

  if (m.wert('grouping') === 'fieldset') {
    return `<div class="ra-feld"><fieldset class="${klasse}"${attrs}${aus}>
<legend class="nc-form-label"><span class="nc-form-label__text">Anschrift</span>${marke(m)}</legend>
<input class="nc-input" type="text" id="${m.uid}-strasse" autocomplete="street-address" placeholder="Straße und Hausnummer" aria-label="Straße und Hausnummer">
<input class="nc-input" type="text" id="${m.uid}-ort" autocomplete="address-level2" placeholder="PLZ und Ort" aria-label="PLZ und Ort">
</fieldset></div>`
  }

  const validation = m.wert('validation') || 'none'
  const content = m.wert('content') || 'minimal'
  const id = `${m.uid}-feld`
  const meldung = validation !== 'none' || m.slot('error')
    ? `<p class="nc-form-error${validation === 'success' ? ' nc-form-error--success' : ''}" role="${validation === 'success' ? 'status' : 'alert'}" id="${m.uid}-meldung"><span class="nc-form-error__icon">${SYMBOL.fehler}</span><span class="nc-form-error__text">${MELDUNG[validation === 'success' ? 'success' : 'error']}</span></p>`
    : ''
  const hinweis = content === 'with-hint' || content === 'full' || m.slot('hint-below')
    ? `<p class="nc-form-hint" id="${m.uid}-hinweis"><span class="nc-form-hint__text">Wir nutzen die Adresse nur für Rückfragen.</span></p>`
    : ''
  const bezug = [meldung && `${m.uid}-meldung`, hinweis && `${m.uid}-hinweis`].filter(Boolean).join(' ')
  const pflicht = m.wert('requirement') === 'required'
  const wert = validation === 'error' ? ' value="max@beispiel"' : validation === 'success' ? ' value="max@beispiel.de"' : ''

  const huelle = m.wert('layout') === 'horizontal' ? 'ra-feld ra-feld--breit' : 'ra-feld'
  return `<div class="${huelle}"><div class="${klasse}"${attrs}>
<label class="nc-form-label" for="${id}"><span class="nc-form-label__text">E-Mail</span>${marke(m)}</label>
<input class="nc-input" type="email" id="${id}" placeholder="name@firma.de" autocomplete="email"${wert}${pflicht ? ' required aria-required="true"' : ''}${validation === 'error' ? ' aria-invalid="true"' : ''}${bezug ? ` aria-describedby="${bezug}"` : ''}${aus}>
${meldung}${hinweis}
</div></div>`
}
