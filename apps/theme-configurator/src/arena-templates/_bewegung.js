// Helfer fuer die Taste „Abspielen" (Plan v3, Phase 4; aus Gruppe bewegung,
// fuer alle animierten Website-Bloecke vereinheitlicht) —
// keine Vorlage (`_` am Anfang). Siehe arena-templates/index.js.
//
// Nachgestellt wird nur, was das DS hergibt: Klassen-/Zustandswechsel, die
// das SCSS animiert (Transitionen an is-active/is-visible), das Blaettern
// einer Scroll-Spur (scroll-snap/scroll-behavior des DS) und Keyframes aus
// styles.css. Jede starten()-Funktion gibt eine Aufraeum-Funktion zurueck,
// die den statischen Zustand der Zelle wiederherstellt.

/** Takt zwischen zwei Schritten (ms) — lang genug fuer die DS-Transitionen. */
export const TAKT = 2400

/**
 * Ruft schritt(n) im Takt auf (n = 1, 2, …).
 * @param {(n: number) => void} schritt
 * @param {number} [ms]
 * @returns {() => void} anhalten
 */
export function imTakt (schritt, ms = TAKT) {
  let n = 0
  const uhr = setInterval(() => { n += 1; schritt(n) }, ms)
  return () => clearInterval(uhr)
}

/** Naechster Frame (Transition nach display-Wechsel), ohne rAF sofort. */
export function naechsterFrame (fn) {
  if (typeof requestAnimationFrame === 'function') requestAnimationFrame(() => fn())
  else fn()
}

/**
 * Scroll-Spur Element um Element blaettern. Die Bewegung macht der Browser
 * (scrollTo mit behavior smooth; die Spuren des DS rasten per scroll-snap
 * ein). Am Ende geht es zurueck zum Anfang.
 * @param {HTMLElement} spur  das scrollende Element
 * @param {HTMLElement[]} glieder  die Elemente in der Spur
 * @param {(i: number) => void} [beiSchritt]  z. B. Paddles sperren
 * @returns {() => void} anhalten und zurueck zum Anfang
 */
export function blaettere (spur, glieder, beiSchritt) {
  if (!spur || glieder.length < 2) return () => {}
  const gehe = (i, sanft) => {
    const left = glieder[i].offsetLeft - glieder[0].offsetLeft
    if (typeof spur.scrollTo === 'function') spur.scrollTo({ left, behavior: sanft ? 'smooth' : 'auto' })
    else spur.scrollLeft = left
    beiSchritt?.(i)
  }
  const anhalten = imTakt((n) => gehe(n % glieder.length, true))
  return () => { anhalten(); gehe(0, false) }
}

/**
 * Einblendung erneut abspielen: entfernt die Endzustands-Klasse, springt
 * laufende Transitionen ans Ende (sonst beginnt das Abspielen fast beim
 * Endzustand), erzwingt ein Layout und setzt die Klasse im naechsten Frame
 * wieder — die Transition des DS laeuft einmal ab. Nur Transitionen werden
 * beendet: Endlos-Animationen (Mesh, Badge-Puls) liessen sich nicht beenden
 * (finish() wirft dort). Aus Gruppe bloecke-1 (bento-grid) uebernommen.
 * @param {Element} element  Traeger der Endzustands-Klasse
 * @param {string} klasse    Endzustand (z. B. is-revealed)
 * @returns {() => void} Frame abbrechen, Endzustand setzen
 */
export function spieleEin (element, klasse) {
  let frame = 0
  const spielen = () => {
    if (typeof cancelAnimationFrame === 'function') cancelAnimationFrame(frame)
    element.classList.remove(klasse)
    for (const a of element.getAnimations?.({ subtree: true }) || []) {
      if (typeof CSSTransition !== 'undefined' && a instanceof CSSTransition) a.finish()
    }
    void (/** @type {HTMLElement} */ (element)).offsetWidth
    if (typeof requestAnimationFrame === 'function') frame = requestAnimationFrame(() => element.classList.add(klasse))
    else element.classList.add(klasse)
  }
  spielen()
  const anhalten = imTakt(spielen)
  return () => {
    anhalten()
    if (typeof cancelAnimationFrame === 'function') cancelAnimationFrame(frame)
    element.classList.add(klasse)
  }
}

/** Mehrere Aufraeum-Funktionen zu einer. */
export const alle = (liste) => () => liste.forEach((weg) => weg())

/**
 * Sperrgrund fuer Bloecke, deren Bewegung es nur als GSAP-Logik der Website
 * gibt (neo_fe/js/neo-theme.js) — nicht ueber DS-Klassen nachstellbar.
 * @param {string} was  was sich auf der Website bewegt
 */
export const nurGsap = (was) =>
  `Nicht nachstellbar: ${was} steuert auf der Website GSAP/ScrollTrigger in neo-theme.js — das DS hat dafür keine Klassen oder Zustände. Die Arena zeigt den statischen Zustand.`
