// Vorlage: fieldset — Markup aus data/markup/fieldset.html:
// <fieldset class="nc-fieldset"> mit <legend class="nc-fieldset__legend">
// und Formularfeldern (.nc-form-field > .nc-form-label + .nc-input).
// Komposition im Recipe: enthaelt form-field, form-label, input.
//
// Achsen: appearance/density/legend-align per Modifier aus dem Recipe.
// Zustand: disabled = natives <fieldset disabled> (deaktiviert alle Felder)
// + nc-fieldset--disabled.
// Specimens: with-helper (Gruppenbeschreibung __helper per
// aria-describedby), required-group (Pflicht-Stern __required),
// with-checkboxes / with-radios (Gruppe aus Checkboxen bzw. Radios),
// nested-form (Karte mit eingebettetem Abschnitt ohne Rahmen).
import { klassenOhne, FREMDE_ZUSTANDSKLASSEN, NATIVE_ARIA } from './_helfer.js'

function feld (m, nr, label, platz, pflicht = false) {
  const id = `${m.uid}-f${nr}`
  return `<div class="nc-form-field">
<label class="nc-form-label" for="${id}"><span class="nc-form-label__text">${label}</span>${pflicht ? '<span class="nc-form-label__required" aria-hidden="true">*</span>' : ''}</label>
<input class="nc-input" type="text" id="${id}" placeholder="${platz}"${pflicht ? ' required aria-required="true"' : ''}>
</div>`
}

function auswahl (m, typ, optionen) {
  return optionen.map(([text, an], i) => `<label class="nc-${typ}">
<input class="nc-${typ}__input" type="${typ}" name="${m.uid}-${typ}" value="${i}"${an ? ' checked' : ''}>
<span class="nc-${typ}__control"></span>
<span class="nc-${typ}__label">${text}</span>
</label>`).join('\n')
}

export default (zelle, m) => {
  const art = m.specimen.render?.compositionType || ''
  const klasse = klassenOhne(m, ...FREMDE_ZUSTANDSKLASSEN)
  const aus = m.deaktiviert ? ' disabled' : ''
  const helfer = art === 'fieldset-with-helper' || art === 'fieldset-checkboxes'
  const pflicht = art === 'fieldset-required'
  const beschreibung = helfer ? ` aria-describedby="${m.uid}-helfer"` : ''

  let legende = 'Persönliche Daten'
  let helferText = 'Diese Angaben erscheinen in Ihrem Profil.'
  let inhalt = `${feld(m, 1, 'Vorname', 'Max', pflicht)}\n${feld(m, 2, 'Nachname', 'Mustermann', pflicht)}`
  if (art === 'fieldset-checkboxes') {
    legende = 'Benachrichtigungen'
    helferText = 'Wählen Sie, worüber wir Sie informieren.'
    inhalt = auswahl(m, 'checkbox', [['Neue Beiträge', true], ['Erwähnungen', true], ['Wochenrückblick', false]])
  } else if (art === 'fieldset-radios') {
    legende = 'Zahlungsweise'
    inhalt = auswahl(m, 'radio', [['Rechnung', true], ['Lastschrift', false], ['Kreditkarte', false]])
  } else if (art === 'fieldset-nested-form') {
    legende = 'Konto'
    inhalt = `${feld(m, 1, 'E-Mail', 'name@firma.de')}
<fieldset class="nc-fieldset nc-fieldset--borderless nc-fieldset--compact">
<legend class="nc-fieldset__legend">Anschrift</legend>
${feld(m, 2, 'Straße', 'Musterweg 1')}
${feld(m, 3, 'PLZ und Ort', '12345 Musterstadt')}
</fieldset>`
  }

  return `<div class="ra-feld ra-feld--breit"><fieldset class="${klasse}"${beschreibung}${aus}${m.attrsOhne(...NATIVE_ARIA)}>
<legend class="nc-fieldset__legend">${legende}${pflicht ? '<span class="nc-fieldset__required" aria-hidden="true">*</span>' : ''}</legend>
${helfer ? `<p class="nc-fieldset__helper" id="${m.uid}-helfer">${helferText}</p>` : ''}
${inhalt}
</fieldset></div>`
}
