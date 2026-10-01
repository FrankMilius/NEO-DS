// @ts-check
// ==========================================================================
// neo-behaviors — Kern
// ==========================================================================
// Ein Behavior ist { id, selektor, binde(wurzel, signal) }. `anbinden(bereich)`
// sucht alle passenden Wurzeln im Bereich (auch den Bereich selbst), bindet
// jede genau einmal und merkt sich einen AbortController. `abbinden(bereich)`
// loest alle Ereignisse wieder (Drupal detach, Arena-Wechsel).
//
// Ohne Framework, ohne Abhaengigkeiten, nur DOM — damit Drupal, die Doku und
// der Konfigurator dieselbe Datei nutzen koennen.
// ==========================================================================

/** @typedef {{ id: string, selektor: string, binde: (wurzel: HTMLElement, signal: AbortSignal) => void }} Behavior */

const GEBUNDEN = new WeakMap() // Element → Map<behaviorId, AbortController>

/**
 * @param {ParentNode & Node} bereich
 * @param {Behavior[]} behaviors
 * @returns {() => void} Aufraeumen
 */
export function bindeAlle (bereich, behaviors) {
  const neu = []
  for (const b of behaviors) {
    for (const wurzel of finde(bereich, b.selektor)) {
      let liste = GEBUNDEN.get(wurzel)
      if (!liste) { liste = new Map(); GEBUNDEN.set(wurzel, liste) }
      if (liste.has(b.id)) continue
      const steuerung = new AbortController()
      liste.set(b.id, steuerung)
      wurzel.setAttribute('data-neo-behavior', [...liste.keys()].join(' '))
      b.binde(wurzel, steuerung.signal)
      neu.push([wurzel, b.id])
    }
  }
  return () => { for (const [w, id] of neu) loese(w, id) }
}

/**
 * @param {ParentNode & Node} bereich
 * @param {Behavior[]} behaviors
 */
export function loeseAlle (bereich, behaviors) {
  for (const b of behaviors) for (const wurzel of finde(bereich, b.selektor)) loese(wurzel, b.id)
}

function loese (wurzel, id) {
  const liste = GEBUNDEN.get(wurzel)
  const steuerung = liste?.get(id)
  if (!steuerung) return
  steuerung.abort()
  liste.delete(id)
  if (liste.size) wurzel.setAttribute('data-neo-behavior', [...liste.keys()].join(' '))
  else wurzel.removeAttribute('data-neo-behavior')
}

/** @returns {HTMLElement[]} */
function finde (bereich, selektor) {
  const treffer = []
  if (bereich instanceof Element && bereich.matches(selektor)) treffer.push(bereich)
  if ('querySelectorAll' in bereich) treffer.push(...bereich.querySelectorAll(selektor))
  return /** @type {HTMLElement[]} */ (treffer)
}

/** Ereignis wie im Recipe beschrieben (`events`): bubbles, detail. */
export function sende (el, name, detail) {
  el.dispatchEvent(new CustomEvent(name, { bubbles: true, detail }))
}

/** Naechstes/vorheriges bedienbares Element einer Liste (rundum). */
export function nachbar (liste, aktuell, schritt) {
  const bedienbar = liste.filter((e) => !e.hasAttribute('disabled') && e.getAttribute('aria-disabled') !== 'true')
  if (!bedienbar.length) return null
  const i = bedienbar.indexOf(aktuell)
  return bedienbar[(i + schritt + bedienbar.length) % bedienbar.length]
}

export function ersterBedienbar (liste, vonHinten = false) {
  const bedienbar = liste.filter((e) => !e.hasAttribute('disabled') && e.getAttribute('aria-disabled') !== 'true')
  return vonHinten ? bedienbar.at(-1) : bedienbar[0]
}
