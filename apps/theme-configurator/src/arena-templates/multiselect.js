// Vorlage: multiselect — wie das Formularfeld „multiselect" im Drupal-Theme
// (neo_fe, js/neo-theme.js, Drupal.behaviors … case 'multiselect'):
// Feld-Wrapper nc-form-field nc-multiselect, Label (nc-form-label),
// Disclosure-Knopf nc-multiselect__trigger (__value, __caret ▾) und Panel mit
// Checkboxen (label.nc-checkbox.nc-multiselect__option). Plan v3, Phase 4.
// Ohne aria-haspopup: das kuendigt ein Menue an, der Knopf ist eine
// Disclosure fuer eine Gruppe (wie neo_fe seit Abschluss 2; Entscheidung
// Abschluss 3, 08.10.2026, a11y-rest).
//
// Zustaende (Recipe):
//   default  geschlossen, Auswahl im Knopf zusammengefasst
//   hover / focus  nur echt (data-zustand am Knopf, Pseudoklasse im DS)
//   open     is-open am Feld, aria-expanded, Panel sichtbar (das Panel ist im
//            DS absolut unter dem Feld positioniert, inset-block-start 100% +
//            spacing-01 — der Rahmen ra-anker haelt ihm Platz frei)
//   error    nc-form-field--invalid (Rahmen des Knopfs in Danger), Meldung
//            nc-form-error unter dem Feld, aria-invalid am Knopf
// render.compositionType „leer": keine Auswahl — Platzhalter
// nc-multiselect__value--empty statt der Liste.
// „Ausprobieren" (Entscheidung 06.10.2026, multiselect-verhalten): das
// Panel steht immer im Markup, geschlossen mit [hidden] (wie die Website;
// das Behavior blendet zusaetzlich inline aus, siehe neo-behaviors/multiselect.js);
// das Behavior multiselect aus neo-behaviors oeffnet, bewegt den Fokus mit
// den Pfeiltasten, fasst die Auswahl im Knopf zusammen und meldet
// multiselect-change. Die Website nutzt das Behavior seit 07.10.2026
// (neo-theme.js baut nur noch das Markup und bindet es an). Die
// Zusammenfassung „<n> ausgewählt" ist fest deutsch (Recipe, Einschraenkung).
import { SYMBOL } from './_helfer.js'

const OPTIONEN = ['Interne Kommunikation', 'Wissensmanagement', 'Mitarbeiter-App', 'Intranet-KI']
const GEWAEHLT = new Set([0, 2])

export default (zelle, m) => {
  const id = m.uid
  const leer = m.specimen.render?.compositionType === 'leer'
  const offen = m.hat('open') && !m.ausprobieren
  const fehler = m.hat('error')
  const gewaehlt = (i) => !leer && GEWAEHLT.has(i)
  const wert = leer
    ? '<span class="nc-multiselect__value nc-multiselect__value--empty">Bitte wählen</span>'
    : `<span class="nc-multiselect__value">${OPTIONEN.filter((_, i) => gewaehlt(i)).join(', ')}</span>`
  const klasse = ['nc-form-field', m.basisKlasse, offen && 'is-open', fehler && 'nc-form-field--invalid'].filter(Boolean).join(' ')
  const zustand = m.attribute['data-zustand'] ? ` data-zustand="${m.attribute['data-zustand']}"` : ''
  const meldung = fehler
    ? `<p class="nc-form-error" role="alert" id="${id}-meldung"><span class="nc-form-error__icon">${SYMBOL.fehler}</span><span class="nc-form-error__text">Bitte mindestens ein Interesse wählen.</span></p>`
    : ''
  const panel = offen || m.ausprobieren
    ? `<div class="nc-multiselect__panel" id="${id}-panel" role="group" aria-labelledby="${id}-label"${offen ? '' : ' hidden'}>
${OPTIONEN.map((o, i) => `<label class="nc-checkbox nc-multiselect__option"><input type="checkbox" class="nc-checkbox__input" name="${id}[]" value="${i}"${gewaehlt(i) ? ' checked' : ''}><span class="nc-checkbox__control"></span><span class="nc-checkbox__label">${o}</span></label>`).join('\n')}
</div>`
    : ''
  return `<div class="ra-anker${offen || m.ausprobieren ? ' ra-anker--hoch' : ' ra-anker--flach'}"><div class="ra-feld">
<div class="${klasse}">
<span class="nc-form-label" id="${id}-label"><span class="nc-form-label__text">Interessen</span><span class="nc-form-label__optional"> (optional)</span></span>
<button type="button" class="nc-multiselect__trigger" id="${id}-trigger" aria-expanded="${offen}"${offen || m.ausprobieren ? ` aria-controls="${id}-panel"` : ''} aria-labelledby="${id}-label ${id}-trigger"${fehler ? ` aria-invalid="true" aria-describedby="${id}-meldung"` : ''}${zustand}>${wert}<span class="nc-multiselect__caret" aria-hidden="true">▾</span></button>
${panel}${meldung}
</div>
</div></div>`
}
