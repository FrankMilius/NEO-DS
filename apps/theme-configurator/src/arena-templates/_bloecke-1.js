// Helfer fuer die Vorlagen der Gruppe „bloecke-1" (Plan v3, Phase 4, duenne
// Recipes) — keine Vorlage (`_` am Anfang).
import { an } from './_helfer.js'

/**
 * Slot sichtbar? Erst die Vorgabe des Specimens (render.slotConfig), dann die
 * des Recipes (Achsen, Zustaende) — Slots, die im geernteten Markup immer
 * vorkommen, bleiben sichtbar, solange niemand sie abschaltet.
 */
export function slotAn (m, slot) {
  const vorgabe = m.specimen.render?.slotConfig?.[slot]
  if (vorgabe != null) return vorgabe !== false
  return an(m, slot)
}

/** Wert aus render des Specimens (oder Vorgabe). */
export const vorgabe = (m, schluessel, sonst) => m.specimen.render?.[schluessel] ?? sonst

/**
 * Taste „Abspielen" fuer animierte Website-Bloecke (Plan v3, Phase 4). Die
 * Zelle zeigt den Endzustand der Animation fest; die Taste spielt sie einmal
 * ab. Arena-Markup, kein DS-Element — gebunden wird sie von abspielenBinden()
 * aus einrichten() der Vorlage. Kein GSAP im Konfigurator: abgespielt wird
 * die CSS-Animation des DS (Klasse an/aus).
 */
export const abspielenKnopf = (beschriftung = 'Abspielen') =>
  `<div class="ra-reihe"><button type="button" class="ra-modus__knopf" data-abspielen>${beschriftung}</button></div>`

/**
 * Bindet die Taste: entfernt die Endzustands-Klasse am Ziel, wartet einen
 * Frame (der Browser uebernimmt den Ausgangszustand) und setzt sie wieder —
 * die Transition des DS laeuft dann einmal ab. Gibt das Aufraeumen zurueck.
 * @param {Element} zelle
 * @param {string} ziel Selektor des animierten Elements
 * @param {string} klasse Endzustand (z. B. is-revealed)
 */
export function abspielenBinden (zelle, ziel, klasse) {
  const knopf = zelle.querySelector('[data-abspielen]')
  const element = zelle.querySelector(ziel)
  if (!knopf || !element) return undefined
  let frame = 0
  const spielen = () => {
    cancelAnimationFrame(frame)
    element.classList.remove(klasse)
    // Das Entfernen startet die Transition rueckwaerts (Ausblenden) — sofort
    // ans Ende springen, sonst beginnt das Abspielen fast beim Endzustand.
    // Nur Transitionen: Endlos-Animationen (Mesh, Badge-Puls) liessen sich
    // nicht beenden (finish() wirft dort).
    for (const a of element.getAnimations?.({ subtree: true }) || []) {
      if (typeof CSSTransition !== 'undefined' && a instanceof CSSTransition) a.finish()
    }
    // Layout erzwingen: ohne das faellt das Entfernen und Wiedersetzen in
    // denselben Frame und es gibt nichts zu animieren.
    void (/** @type {HTMLElement} */ (element)).offsetWidth
    frame = requestAnimationFrame(() => element.classList.add(klasse))
  }
  knopf.addEventListener('click', spielen)
  return () => {
    cancelAnimationFrame(frame)
    knopf.removeEventListener('click', spielen)
    element.classList.add(klasse)
  }
}

/**
 * Hochkantes Platzhalterbild im Mass der App-Screenshots (1206 x 2622, wie
 * --nc-device-ratio) — fuer den Geraeterahmen. BILD_SRC ist quer; im Rahmen
 * (object-fit: contain) stuende es als schmaler Streifen.
 */
export const SCREEN_SRC = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1206 2622%22%3E%3Crect width=%221206%22 height=%222622%22 fill=%22%23eef0f3%22/%3E%3Crect x=%2280%22 y=%22220%22 width=%221046%22 height=%22560%22 rx=%2248%22 fill=%22%23c9ced6%22/%3E%3Crect x=%2280%22 y=%22860%22 width=%22700%22 height=%2260%22 rx=%2230%22 fill=%22%23aab1bc%22/%3E%3Crect x=%2280%22 y=%22960%22 width=%22960%22 height=%2240%22 rx=%2220%22 fill=%22%23c9ced6%22/%3E%3Crect x=%2280%22 y=%221040%22 width=%22880%22 height=%2240%22 rx=%2220%22 fill=%22%23c9ced6%22/%3E%3Crect x=%2280%22 y=%221180%22 width=%221046%22 height=%22420%22 rx=%2248%22 fill=%22%23c9ced6%22/%3E%3Crect x=%2280%22 y=%221680%22 width=%221046%22 height=%22420%22 rx=%2248%22 fill=%22%23c9ced6%22/%3E%3C/svg%3E'

/**
 * Rahmen ra-desktop (Desktop-Seite 1280 px im Massstab 1:2,4, wie beim Hero
 * in Phase 3) fuer Bloecke, die fuer die Seitenbreite gebaut sind — in einer
 * Zelle von rund 470 px stuenden Raster und Spalten gequetscht oder liefen
 * ueber. Die Fensterbreite (Media Queries) bleibt die des Konfigurators.
 */
export const desktop = (html) => `\n<div class="ra-desktop">\n${html.trim()}\n</div>`
