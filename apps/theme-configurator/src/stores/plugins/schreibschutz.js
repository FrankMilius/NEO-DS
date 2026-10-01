// @ts-check
// ==========================================================================
// Pinia-Plugin: Schreibschutz im Drupal-Betrieb (Plan v2, 2.6, Teil 2)
// ==========================================================================
// Ohne Recht „bearbeiten“ ist die App eine Ansicht (ADR-002, Frage 2). Die
// Oberfläche sperrt die Editoren im Inspector (<fieldset disabled>) und
// blendet Speichern/Anlegen/Löschen aus. Eingaben gibt es aber auch an
// anderen Stellen (Labor-Arenen, Tastenkürzel). Dieses Plugin hält deshalb
// alle ändernden Store-Aktionen an (Option `schreibschutz: [...]`) und zeigt
// einmal je Sitzung einen Hinweis.
//
// Lokal (und mit Recht „bearbeiten“) ändert sich nichts: die Prüfung läuft
// bei jedem Aufruf und ist dort immer false.
// ==========================================================================

import { darf, speicher } from '../../speicher/index.js'
import { hinweisen } from '../../composables/useBestaetigung.js'

/** true im Drupal-Betrieb ohne Recht „bearbeiten“. */
export function istSchreibgeschuetzt () {
  const sp = speicher()
  return sp.art === 'drupal' && !darf('bearbeiten', sp)
}

let gemeldet = false

function melde () {
  if (gemeldet) return
  gemeldet = true
  hinweisen({
    titel: 'Nur Ansicht',
    text: 'Dir fehlt das Recht „bearbeiten“. Änderungen werden nicht übernommen und nicht in Drupal gespeichert.',
  })
}

export function schreibschutzPlugin ({ store, options }) {
  const aktionen = options.schreibschutz || []
  if (!aktionen.length) return
  const ersatz = {}
  for (const name of aktionen) {
    const original = store[name]
    if (typeof original !== 'function') continue
    ersatz[name] = function (...args) {
      if (istSchreibgeschuetzt()) { melde(); return undefined }
      return original.apply(this, args)
    }
  }
  return ersatz
}

/** Nur für Tests: Hinweis wieder zulassen. */
export function _zuruecksetzenSchreibschutz () { gemeldet = false }
