// Helfer fuer die Overlay-Vorlagen (dropdown-menu, popover, tooltip, modal,
// drawer, alert-dialog) — keine Vorlage (`_` am Anfang).
//
// Zwei Ansichten (RecipeArena):
//   Zustände      offen und fest: Panel ohne [hidden], aria-expanded="true",
//                 Popover und Tooltip mit der DS-Klasse .is-open an der
//                 Wurzel, Dialoge mit [open] in einem Arena-Rahmen (ra-buehne)
//   Ausprobieren  geschlossen (m.ausprobieren): neo-behaviors oeffnet per
//                 Klick und Tastatur, Escape schliesst, Fokus kehrt zurueck
import { SYMBOL } from './_helfer.js'

/** Zustaende-Ansicht zeigt das Overlay offen, Ausprobieren startet zu. */
export const offen = (m) => !m.ausprobieren

/**
 * Klassen der Wurzel: Basis + Wurzel-Modifier aus dem Recipe. Modifier fuer
 * Kinder (z. B. nc-popover__panel--top) und Zustandsklassen aus der Matrix
 * (is-active, <wurzel>--disabled …) bleiben weg. Zustandsklassen, die das DS
 * am Bauteil kennt (is-open bei Popover und Tooltip), gibt die Vorlage als
 * `extra` mit.
 * @param {any} m
 * @param {string[]} [extra]
 */
export function wurzelKlassen (m, extra = []) {
  const eigen = m.klassen.filter((k) => k === m.root || k.startsWith(`${m.root}--`))
    .filter((k) => k !== `${m.root}--disabled` && k !== `${m.root}--error`)
  return [...new Set([...eigen, ...extra])].join(' ')
}

/** Achsen-Modifier eines Kind-Elements (z. B. nc-dropdown__menu--top-end). */
export function kindModifier (m, praefix) {
  return m.klassen.filter((k) => k.startsWith(praefix))
}

/** Schliessen-Knopf (X) mit der Klasse des Bauteils. */
export const schliessen = (klasse) => `<button type="button" class="${klasse}" aria-label="Schließen">${SYMBOL.schliessen}</button>`

export const WARNUNG = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>'

export const INFO = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'

/** Absatzfolge als Fuelltext (scrollende Inhalte). */
export function absaetze (anzahl, satz) {
  return Array.from({ length: anzahl }, (_, i) => `<p>${i + 1}. ${satz}</p>`).join('\n')
}

/**
 * Dialog-Huelle fuer Modal, Drawer und Alert-Dialog.
 *   Zustände      <div class="ra-buehne"><dialog … open></div>
 *   Ausprobieren  Ausloeser (aria-controls) + geschlossener <dialog>
 * @param {any} m
 * @param {{ dialog: string, ausloeser: string, buehne?: string }} teile
 */
export function dialogHuelle (m, { dialog, ausloeser, buehne = '' }) {
  if (m.ausprobieren) {
    return `<div class="ra-stapel">
<button type="button" class="nc-button" aria-haspopup="dialog" aria-controls="${m.uid}-dialog">${ausloeser}</button>
${dialog}
</div>`
  }
  return `<div class="ra-buehne${buehne ? ' ' + buehne : ''}">
${dialog}
</div>`
}
