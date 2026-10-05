// Vorlage: alert — Markup aus data/markup/alert.html (geerntet von der Doku)
// und der SCSS-Struktur (scss/scss/05-atoms/_alert.scss):
//   div.nc-alert.nc-alert--<variant>[.nc-alert--inline]  role="alert"
//     (danger/warning) bzw. role="status" (info/success)
//     span.nc-alert__icon (aria-hidden, Symbol je Variante)
//     div.nc-alert__content
//       p.nc-alert__title / p.nc-alert__description
//       details.nc-alert__details > summary + p   (with-details, natives
//         Disclosure — kein Behavior noetig)
//       div.nc-alert__action > button.nc-button.nc-button--sm.nc-button--outline
//     button.nc-alert__close  aria-label="Schließen"   (dismissible)
// Das Schliessen kommt aus neo-behaviors (alert.js): Knopf nimmt den Alert
// aus dem Dokument, Fokus geht weiter.
//
// Achsen: variant (Modifier, Rolle), content (Slots), display (inline:
//   Modifier, nur Symbol + Text). Zustaende: nur default.
// Specimens: all-variants, content-compositions, dismissible-variants,
//   with-action-variants, title-only-variants, danger-detail,
//   progressive-disclosure, inline-variants.
// Ausprobieren: Knopf „Erneut zeigen" setzt einen geschlossenen Alert wieder
// ein.
import { esc } from './_helfer.js'
import { wurzelKlassen } from './_overlay.js'
import { SYMBOLE, schliessKnopf, erneutHuelle, einrichtenErneut } from './_rueckmeldung.js'

const INHALT = {
  info: ['Sitzung läuft bald ab', 'Speichern Sie Ihre Arbeit — in 15 Minuten werden Sie abgemeldet.', SYMBOLE.info, 'Sitzung verlängern'],
  success: ['Änderungen gespeichert', 'Ihr Profil ist aktualisiert.', SYMBOLE.erfolg, 'Profil ansehen'],
  warning: ['Angaben unvollständig', 'Bitte prüfen Sie die markierten Felder vor dem Absenden.', SYMBOLE.warnung, 'Zu den Feldern'],
  danger: ['Löschen fehlgeschlagen', 'Der Eintrag konnte nicht gelöscht werden. Versuchen Sie es erneut.', SYMBOLE.fehler, 'Erneut versuchen']
}

const DETAILS = {
  danger: 'Fehler 503: Der Dienst „Ablage" antwortet nicht (Zeitüberschreitung nach 30 s). Anfrage-ID 7f3c-21a9.',
  warning: 'Pflichtfelder ohne Wert: Abteilung, Kostenstelle. Ungültiges Format: Telefonnummer.'
}

export default (zelle, m) => {
  const variant = m.wert('variant') || 'info'
  const content = m.wert('content') || 'full'
  const [titel, beschreibung, symbol, aktion] = INHALT[variant] || INHALT.info
  const rolle = variant === 'danger' || variant === 'warning' ? 'alert' : 'status'

  const inhalt = [`<p class="nc-alert__title">${esc(titel)}</p>`]
  if (content !== 'title-only') inhalt.push(`<p class="nc-alert__description">${esc(beschreibung)}</p>`)
  if (content === 'with-details') {
    inhalt.push(`<details class="nc-alert__details"><summary>Details anzeigen</summary><p>${esc(DETAILS[variant] || DETAILS.danger)}</p></details>`)
  }
  if (content === 'with-action') {
    inhalt.push(`<div class="nc-alert__action"><button type="button" class="nc-button nc-button--sm nc-button--outline">${esc(aktion)}</button></div>`)
  }
  const schliessbar = content === 'dismissible'

  const alert = `<div class="${wurzelKlassen(m)}" role="${rolle}">
<span class="nc-alert__icon" aria-hidden="true">${symbol}</span>
<div class="nc-alert__content">${inhalt.join('')}</div>
${schliessbar ? schliessKnopf('nc-alert__close') : ''}
</div>`

  const feld = (html, ziel = false) => `<div class="ra-feld ra-feld--breit"${ziel ? ' data-ra-ziel' : ''}>${html}</div>`
  if (!m.ausprobieren || !schliessbar) return feld(alert)
  return erneutHuelle('alert', feld(alert, true), alert)
}

export const einrichten = einrichtenErneut
