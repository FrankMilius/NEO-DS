// Helfer fuer die Rueckmeldungs-Vorlagen (toast, notification, alert,
// banner) — keine Vorlage (`_` am Anfang).
//
// Zwei Ansichten (RecipeArena):
//   Zustände      jede Zelle zeigt ihren Zustand fest. Toaster und festes
//                 Banner liegen in einem Arena-Rahmen (ra-bildschirm), der per
//                 contain ihr Bezugsrahmen ist — sonst saessen sie am Fenster
//                 ueber der App. Ausblend-Animationen (is-dismissing) stehen
//                 als Standbild (ra-standbild) halb eingeklappt.
//   Ausprobieren  die Meldung lebt: neo-behaviors schliesst sie (Knopf,
//                 Escape, Zeit, Wischen) und nimmt sie aus dem Dokument. Ein
//                 Knopf „Erneut zeigen" (data-ra-erneut) setzt sie aus der
//                 Vorlage (<template data-ra-vorlage>) wieder ein und bindet
//                 sie — siehe einrichtenErneut().
import { anbinden } from 'neo-behaviors'
import { SYMBOL } from './_helfer.js'

const svg = (inhalt) => `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inhalt}</svg>`

/** Symbol je Bedeutung — Farbe ist nie das einzige Signal (Recipe: Icon-Formsprache). */
export const SYMBOLE = {
  neutral: svg('<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>'),
  info: svg('<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>'),
  erfolg: svg('<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>'),
  warnung: svg('<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>'),
  fehler: svg('<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>')
}

/** Schliessen-Knopf (X) mit Klasse und Namen des Bauteils. */
export const schliessKnopf = (klasse, name = 'Schließen') => `<button type="button" class="${klasse}" aria-label="${name}">${SYMBOL.schliessen}</button>`

/**
 * Ausprobieren: Knopf „Erneut zeigen", Ziel und Vorlage.
 * @param {string} behavior  Recipe-ID des Verhaltens
 * @param {string} rahmen    Markup mit dem Ziel ([data-ra-ziel])
 * @param {string} vorlage   Markup, das „Erneut zeigen" einsetzt
 */
export function erneutHuelle (behavior, rahmen, vorlage) {
  return `<div class="ra-stapel ra-stapel--breit">
<button type="button" class="nc-button nc-button--sm nc-button--outline" data-ra-erneut="${behavior}">Erneut zeigen</button>
${rahmen}
<template data-ra-vorlage>${vorlage}</template>
</div>`
}

const VERDRAHTET = new WeakSet()

/**
 * einrichten() der Vorlagen: „Erneut zeigen" setzt die Vorlage ins Ziel
 * (Toasts kommen dazu, alles andere ersetzt den Inhalt) und bindet das
 * Verhalten daran. Mehrfaches Einrichten ist harmlos.
 * @param {HTMLElement} zelle
 */
export function einrichtenErneut (zelle) {
  for (const knopf of zelle.querySelectorAll('[data-ra-erneut]')) {
    if (VERDRAHTET.has(knopf)) continue
    VERDRAHTET.add(knopf)
    knopf.addEventListener('click', () => {
      const huelle = knopf.parentElement
      const ziel = huelle?.querySelector('[data-ra-ziel]')
      const vorlage = huelle?.querySelector('template[data-ra-vorlage]')
      if (!ziel || !vorlage) return
      const id = knopf.getAttribute('data-ra-erneut')
      if (id !== 'toast') ziel.replaceChildren()
      ziel.append(vorlage.content.cloneNode(true))
      anbinden(ziel, [id])
    })
  }
}
