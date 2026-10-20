// @ts-check
/**
 * @file
 * Kopfleiste mit Menü „Mehr …“ (Roadmap R05, 20.10.2026).
 *
 * Die Kopfleiste bleibt immer einzeilig. Läuft sie über, wandert die jeweils
 * am seltensten gebrauchte Aktion ins Menü „Mehr …“; wird es wieder breit
 * genug, kommt sie in umgekehrter Reihenfolge zurück. Gemessen statt fester
 * Breiten, weil Theme-Namen und Statustexte unterschiedlich lang sind.
 *
 * Verschoben wird mit <Teleport> (KopfPlatz.vue): dieselbe Komponente samt
 * Zustand, Dialogen und Tastenkürzeln, nur an anderer Stelle im Dokument.
 *
 * Vorher (UX-04) brach die Kopfleiste unter 1200 px um — bei 390 px
 * vier bis fünf Zeilen; im Drupal-Betrieb lief sie seit App 1.2.32 (Schalter
 * App-Darstellung) schon bei 1440 px über.
 */
import { ref, nextTick } from 'vue'

/** Namen der Aktionen im Menü, in der Reihenfolge, in der sie wanderten */
const imMenue = ref(/** @type {string[]} */ ([]))
/**
 * Je Aktion: Breite der Kopfleiste, ab der sie zurück in die Leiste passt,
 * ob „Mehr …“ beim Messen sichtbar war (kommt die letzte Aktion zurück, wird
 * dessen Breite frei) und die Breite beim Verschieben. Ist die Leiste seither
 * breiter geworden, wird probeweise zurückgeholt: An den Umbruchpunkten
 * (768/1024 px) ändern sich Beschriftungen, gemessene Schwellen veralten.
 * Passt es nicht, wandert die Aktion sofort zurück — mit genauer Schwelle.
 * @type {Map<string, { breite: number, mitMehr: boolean, beiBreite: number }>}
 */
const schwellen = new Map()
/** Menü „Mehr …“ aufgeklappt */
const offen = ref(false)

export function useKopfMehr () {
  return { imMenue, offen }
}

const bild = () => new Promise((r) => requestAnimationFrame(() => r(undefined)))

/**
 * Überstand der Kopfleiste in px (≤ 0: passt). Gemessen am rechten Rand der
 * Elemente im Fluss — nicht scrollWidth: aufgeklappte Ausklappmenüs würden
 * sonst als Überlauf zählen.
 * @param {HTMLElement} kopf
 */
export function ueberstand (kopf) {
  const r = kopf.getBoundingClientRect()
  const innenRechts = r.right - parseFloat(getComputedStyle(kopf).paddingRight || '0')
  let rechts = r.left
  for (const el of kopf.querySelectorAll('[data-kopf-mass]')) {
    const e = /** @type {HTMLElement} */ (el)
    if (!e.offsetParent || e.closest('.kopf-mehr-panel')) continue
    rechts = Math.max(rechts, e.getBoundingClientRect().right)
  }
  return Math.ceil(rechts - innenRechts)
}

/**
 * Passt die Kopfleiste an: verschiebt Aktionen ins Menü, bis nichts mehr
 * übersteht, und holt sie zurück, sobald ihre Schwelle erreicht ist.
 * @param {HTMLElement} kopf
 * @param {string[]} reihenfolge  Namen, zuerst ins Menü zuerst
 */
export async function anpassen (kopf, reihenfolge) {
  for (let runde = 0; runde <= reihenfolge.length * 2 + 1; runde++) {
    await nextTick(); await bild()
    const zuViel = ueberstand(kopf)
    if (zuViel > 0) {
      const naechster = reihenfolge.find((n) => !imMenue.value.includes(n))
      if (!naechster) return
      schwellen.set(naechster, { breite: kopf.clientWidth + zuViel, mitMehr: imMenue.value.length > 0, beiBreite: kopf.clientWidth })
      imMenue.value = [...imMenue.value, naechster]
      continue
    }
    const letzter = imMenue.value[imMenue.value.length - 1]
    const s = letzter && schwellen.get(letzter)
    const mehr = /** @type {HTMLElement|null} */ (kopf.querySelector('.kopf-mehr'))
    const frei = s && s.mitMehr && imMenue.value.length === 1 && mehr ? mehr.getBoundingClientRect().width + 6 : 0
    if (s && (kopf.clientWidth > s.beiBreite || kopf.clientWidth >= s.breite - frei)) {
      imMenue.value = imMenue.value.slice(0, -1)
      continue
    }
    return
  }
}

/** Nur für Tests: Ausgangszustand */
export function _zuruecksetzen () {
  imMenue.value = []
  schwellen.clear()
  offen.value = false
}
