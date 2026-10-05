// @ts-check
// ==========================================================================
// Gemeinsamer Teil der Rueckmeldungen (Toast, Benachrichtigung, Alert,
// Banner) — keine eigene Recipe-ID (`_` am Anfang)
// ==========================================================================
// Alle vier verschwinden beim Schliessen aus dem Dokument. Zwei Dinge sind
// dabei ueberall gleich:
//   - Fokus weiterreichen: lag der Fokus in der Meldung (Schliessen-Knopf),
//     faellt er nicht auf <body> zurueck, sondern geht auf das naechste
//     bedienbare Element danach (sonst davor) — WCAG 2.4.3.
//   - Ausblenden mit der Animation des DS: Klasse setzen (is-leaving,
//     is-dismissing), auf animationend warten, dann entfernen. Ohne Animation
//     (prefers-reduced-motion: das SCSS setzt display:none) sofort; ein
//     Zeitlimit faengt ein ausbleibendes animationend ab (z. B. verborgener
//     Tab).
// ==========================================================================
import { fokussierbare } from './kern.js'

/**
 * Liegt der Fokus in `el`, geht er auf das naechste bedienbare Element
 * ausserhalb (in Dokument-Reihenfolge danach, sonst davor).
 * @param {HTMLElement} el
 */
export function fokusWeiter (el) {
  const dok = el.ownerDocument
  if (!el.contains(dok.activeElement)) return
  const liste = fokussierbare(dok.body).filter((e) => !el.contains(e))
  const danach = liste.find((e) => el.compareDocumentPosition(e) & Node.DOCUMENT_POSITION_FOLLOWING)
  const davor = liste.filter((e) => el.compareDocumentPosition(e) & Node.DOCUMENT_POSITION_PRECEDING).at(-1)
  const ziel = danach || davor
  if (ziel) ziel.focus()
  else /** @type {HTMLElement} */ (dok.activeElement)?.blur?.()
}

/** Laengste Animationsdauer des Elements in ms (0 = keine Animation). */
function animationsDauer (el) {
  const stil = el.ownerDocument.defaultView?.getComputedStyle(el)
  if (!stil || !stil.animationName || stil.animationName === 'none') return 0
  const ms = (t) => (t.trim().endsWith('ms') ? parseFloat(t) : parseFloat(t) * 1000) || 0
  const dauern = (stil.animationDuration || '0s').split(',').map(ms)
  const verzug = (stil.animationDelay || '0s').split(',').map(ms)
  return Math.max(0, ...dauern.map((d, i) => d + (verzug[i] || 0)))
}

/**
 * Setzt `klasse` und ruft `fertig` nach der Animation (oder sofort, wenn das
 * DS keine abspielt).
 * @param {HTMLElement} el @param {string} klasse @param {() => void} fertig
 */
export function ausblenden (el, klasse, fertig) {
  el.classList.add(klasse)
  const dauer = animationsDauer(el)
  if (!dauer) { fertig(); return }
  let erledigt = false
  const einmal = () => {
    if (erledigt) return
    erledigt = true
    clearTimeout(notfall)
    el.removeEventListener('animationend', beiEnde)
    fertig()
  }
  const beiEnde = (e) => { if (e.target === el) einmal() }
  const notfall = setTimeout(einmal, dauer + 100)
  el.addEventListener('animationend', beiEnde)
}

/**
 * Hoehe als Startwert der Einklapp-Animation (Banner, Benachrichtigung): das
 * SCSS liest --_<bauteil>-height, sonst rechnet es mit einem festen Wert.
 * @param {HTMLElement} el @param {string} eigenschaft
 */
export function merkeHoehe (el, eigenschaft) {
  const hoehe = el.getBoundingClientRect().height
  if (hoehe > 0) el.style.setProperty(eigenschaft, `${Math.ceil(hoehe)}px`)
}
