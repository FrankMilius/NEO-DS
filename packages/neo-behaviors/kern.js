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

/**
 * Ziel einer Pfeil-/Pos1-/Ende-Taste in einer Liste (rundum, gesperrte
 * uebersprungen). `richtung`: 'beide' (rechts/runter vor, links/hoch zurueck),
 * 'horizontal' oder 'vertikal'. Andere Tasten → null.
 * @param {string} key @param {HTMLElement[]} liste @param {Element} aktuell
 * @param {'beide'|'horizontal'|'vertikal'} [richtung]
 * @returns {HTMLElement|null}
 */
export function zielFuerTaste (key, liste, aktuell, richtung = 'beide') {
  const vor = richtung === 'horizontal' ? ['ArrowRight'] : richtung === 'vertikal' ? ['ArrowDown'] : ['ArrowRight', 'ArrowDown']
  const zurueck = richtung === 'horizontal' ? ['ArrowLeft'] : richtung === 'vertikal' ? ['ArrowUp'] : ['ArrowLeft', 'ArrowUp']
  if (vor.includes(key)) return nachbar(liste, aktuell, 1)
  if (zurueck.includes(key)) return nachbar(liste, aktuell, -1)
  if (key === 'Home') return ersterBedienbar(liste) || null
  if (key === 'End') return ersterBedienbar(liste, true) || null
  return null
}

const FOKUSSIERBAR = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]), summary'

/** Per Tab erreichbare Elemente im Bereich (sichtbar im Sinne von nicht [hidden]). */
export function fokussierbare (bereich) {
  return /** @type {HTMLElement[]} */ ([...bereich.querySelectorAll(FOKUSSIERBAR)])
    .filter((e) => !e.closest('[hidden], [inert]') && e.getAttribute('aria-hidden') !== 'true')
}

/**
 * Fokus-Falle: Tab vom letzten springt zum ersten, Shift+Tab vom ersten zum
 * letzten Element im Bereich. Aufrufen im keydown-Handler.
 * @param {KeyboardEvent} e @param {HTMLElement} bereich
 */
export function fokusFalle (e, bereich) {
  if (e.key !== 'Tab') return
  const liste = fokussierbare(bereich)
  if (!liste.length) { e.preventDefault(); return }
  const erstes = liste[0]
  const letztes = liste.at(-1)
  const aktiv = /** @type {HTMLElement|null} */ (bereich.ownerDocument.activeElement)
  const drin = aktiv && bereich.contains(aktiv)
  if (e.shiftKey && (aktiv === erstes || !drin)) { e.preventDefault(); letztes.focus() }
  else if (!e.shiftKey && (aktiv === letztes || !drin)) { e.preventDefault(); erstes.focus() }
}

/** Gesperrt per disabled oder aria-disabled. */
export function gesperrt (el) {
  return !!el && (el.hasAttribute('disabled') || el.getAttribute('aria-disabled') === 'true')
}
