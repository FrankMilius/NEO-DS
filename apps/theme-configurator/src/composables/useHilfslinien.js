// @ts-check
/**
 * @file
 * Schalter „Hilfslinien“ auf der Bühne (Schritt e, 19.10.2026). Objekte
 * (Container, Grid, Section …) zeigen echten Website-Inhalt; die Kanten der
 * Bereiche und ihre Maße (data-hilfe) erscheinen nur, wenn der Schalter an
 * ist — wie Hilfslinien in einem Layout-Programm. Je Browser gemerkt.
 */
import { ref, watch } from 'vue'

const SCHLUESSEL = 'neo-cfg-hilfslinien'

function lesen () {
  try { return localStorage.getItem(SCHLUESSEL) === 'ja' } catch { return false }
}

const an = ref(lesen())
watch(an, (wert) => { try { localStorage.setItem(SCHLUESSEL, wert ? 'ja' : 'nein') } catch { /* privater Modus */ } })

/** @returns {import('vue').Ref<boolean>} */
export function useHilfslinien () {
  return an
}
