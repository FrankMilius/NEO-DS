// @ts-check
/**
 * @file
 * Ansicht der Grundlagen-Bühnen (Schritt f, 19.10.2026): „Muster“ (Kacheln je
 * Wert) oder „Auf der Seite“ (Website-Ausschnitt mit Markierungen, wo der
 * Wert wirkt). Je Browser gemerkt.
 */
import { ref, watch } from 'vue'

const SCHLUESSEL = 'neo-cfg-grundlagen-ansicht'

/** @returns {'muster'|'seite'} */
function lesen () {
  try { return localStorage.getItem(SCHLUESSEL) === 'seite' ? 'seite' : 'muster' } catch { return 'muster' }
}

/** @type {import('vue').Ref<'muster'|'seite'>} */
const ansicht = ref(lesen())
watch(ansicht, (wert) => { try { localStorage.setItem(SCHLUESSEL, wert) } catch { /* privater Modus */ } })

/** @returns {import('vue').Ref<'muster'|'seite'>} */
export function useGrundlagenAnsicht () {
  return ansicht
}
