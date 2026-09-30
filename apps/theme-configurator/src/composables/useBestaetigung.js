/**
 * useBestaetigung — Promise-basierte Bestaetigungen und Hinweise (Plan v2, 4.4)
 *
 * Ersetzt window.confirm / window.alert durch zugaengliche Dialoge
 * (KonfigBestaetigung.vue, einmal in App.vue eingebunden).
 *
 *   if (await bestaetigen({ titel: 'Branch löschen?', text: '…', gefaehrlich: true })) { … }
 *   await hinweisen({ titel: 'Speichern fehlgeschlagen', text: err.message })
 *
 * Anfragen werden der Reihe nach gezeigt.
 */
import { shallowRef } from 'vue'

const aktuelleAnfrage = shallowRef(null)
const warteschlange = []
let zaehler = 0

function naechste () {
  aktuelleAnfrage.value = warteschlange.shift() || null
}

function anfragen (art, optionen = {}) {
  return new Promise((resolve) => {
    const anfrage = {
      id: ++zaehler,
      art,
      titel: optionen.titel || (art === 'hinweis' ? 'Hinweis' : 'Bitte bestätigen'),
      text: optionen.text || '',
      bestaetigenText: optionen.bestaetigenText || (art === 'hinweis' ? 'OK' : 'Bestätigen'),
      abbrechenText: optionen.abbrechenText || 'Abbrechen',
      gefaehrlich: !!optionen.gefaehrlich,
      erledigen (wert) {
        if (aktuelleAnfrage.value !== anfrage) return
        resolve(art === 'hinweis' ? undefined : !!wert)
        naechste()
      }
    }
    if (aktuelleAnfrage.value) warteschlange.push(anfrage)
    else aktuelleAnfrage.value = anfrage
  })
}

/** Ersetzt confirm(): liefert true (bestätigt) oder false (abgebrochen / Escape). */
export function bestaetigen (optionen) { return anfragen('bestaetigung', optionen) }

/** Ersetzt alert(): wird erfuellt, sobald der Hinweis geschlossen ist. */
export function hinweisen (optionen) { return anfragen('hinweis', optionen) }

export function useBestaetigung () {
  return { aktuelleAnfrage, bestaetigen, hinweisen }
}

/** Nur fuer Tests: offene Anfragen verwerfen. */
export function _zuruecksetzen () {
  warteschlange.length = 0
  aktuelleAnfrage.value = null
}
