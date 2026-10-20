// @ts-check
/**
 * @file
 * App-Darstellung Hell · Dunkel · Wie System (Roadmap R03, 20.10.2026).
 *
 * Vorher wurde die App bei dunkler Systemeinstellung nur halb dunkel: Die
 * Medienabfrage des Design Systems (:root:not([data-theme]), _color-themes.scss)
 * setzt allein die älteren Dunkel-Rollen, nicht die Brücke des dunklen
 * NEO-Themes (_mono-bridge.scss). Jetzt entscheidet die App selbst und setzt
 * am Dokument immer data-theme (schaltet die Medienabfrage ab) und
 * data-app-darstellung. Unter data-app-darstellung="dunkel" setzt
 * app-darstellung.scss die Werte des dunklen NEO-Themes — bewusst nicht die
 * Klasse neo-dark-theme, die auch Elemente gestaltet (Links, Fokusring).
 *
 * Die Bühne ist davon unabhängig: Jede Vorschau trägt ihre eigene
 * Theme-Klasse (Vorschaumodus Hell · Dunkel · Nebeneinander · Alle vier), und
 * Theme-Bereiche erben seit der Vererbung im Design System (19.10.2026) die
 * Werte einer ganzen Seite ihres Themes (e2e/vererbung.spec.js).
 *
 * Die Wahl wird je Browser gemerkt; ohne Speicher gilt „Wie System“.
 */
import { ref, computed, watch } from 'vue'

const SCHLUESSEL = 'neo-cfg-app-darstellung'

/** @typedef {'hell'|'dunkel'|'system'} Darstellung */

/** @type {ReadonlyArray<{ wert: Darstellung, label: string }>} */
export const DARSTELLUNGEN = Object.freeze([
  { wert: 'hell', label: 'Hell' },
  { wert: 'dunkel', label: 'Dunkel' },
  { wert: 'system', label: 'Wie System' },
])

/** @returns {Darstellung} */
function lesen () {
  try {
    const w = localStorage.getItem(SCHLUESSEL)
    return w === 'hell' || w === 'dunkel' ? w : 'system'
  } catch { return 'system' }
}

const abfrage = typeof window !== 'undefined' && window.matchMedia
  ? window.matchMedia('(prefers-color-scheme: dark)')
  : null

const wahl = ref(lesen())
const systemDunkel = ref(!!abfrage?.matches)
abfrage?.addEventListener?.('change', (e) => { systemDunkel.value = e.matches })

/** wirksame Darstellung nach Auflösen von „Wie System“ */
const dunkel = computed(() => (wahl.value === 'system' ? systemDunkel.value : wahl.value === 'dunkel'))

/**
 * Setzt data-theme und data-app-darstellung am Dokument.
 * @param {boolean} istDunkel
 * @param {Document} [doc]
 */
export function anwenden (istDunkel, doc = document) {
  const html = doc.documentElement
  html.dataset.theme = istDunkel ? 'dark' : 'light'
  html.dataset.appDarstellung = istDunkel ? 'dunkel' : 'hell'
}

watch(wahl, (w) => { try { localStorage.setItem(SCHLUESSEL, w) } catch { /* privater Modus */ } })
if (typeof document !== 'undefined') watch(dunkel, (d) => anwenden(d), { immediate: true })

export function useAppDarstellung () {
  return { wahl, dunkel }
}
