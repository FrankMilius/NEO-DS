// Vorlage: multiselect — wie das Formularfeld „multiselect" im Drupal-Theme
// (neo_fe, js/neo-theme.js, Drupal.behaviors … case 'multiselect'):
// Feld-Wrapper mit nc-multiselect, Label (nc-form-label), Disclosure-Knopf
// nc-multiselect__trigger (__value, __caret ▾) und Panel mit Checkboxen
// (label.nc-checkbox.nc-multiselect__option). Gezeigt wird der geoeffnete
// Zustand mit zwei Auswahlen (is-open, aria-expanded); das Panel ist im DS
// absolut positioniert, die Zelle haelt ihm Platz frei.
const OPTIONEN = ['Interne Kommunikation', 'Wissensmanagement', 'Mitarbeiter-App', 'Intranet-KI']
const GEWAEHLT = new Set([0, 2])

export default (zelle, m) => {
  const id = m.uid
  return `
<div class="nc-form-field ${m.klasse} is-open"${m.attrs} style="width: 320px; padding-block-end: 12.5rem;">
<span class="nc-form-label" id="${id}-label"><span class="nc-form-label__text">Interessen</span><span class="nc-form-label__optional"> (optional)</span></span>
<button type="button" class="nc-multiselect__trigger" id="${id}-trigger" aria-haspopup="true" aria-expanded="true" aria-labelledby="${id}-label ${id}-trigger"><span class="nc-multiselect__value">${OPTIONEN.filter((_, i) => GEWAEHLT.has(i)).join(', ')}</span><span class="nc-multiselect__caret" aria-hidden="true">▾</span></button>
<div class="nc-multiselect__panel" role="group" aria-labelledby="${id}-label" style="inset-block-start: 4.75rem;">
${OPTIONEN.map((o, i) => `<label class="nc-checkbox nc-multiselect__option"><input type="checkbox" class="nc-checkbox__input" name="${id}[]" value="${i}"${GEWAEHLT.has(i) ? ' checked' : ''}><span class="nc-checkbox__control"></span><span class="nc-checkbox__label">${o}</span></label>`).join('\n')}
</div>
</div>`
}
