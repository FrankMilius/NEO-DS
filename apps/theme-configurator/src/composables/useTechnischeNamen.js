// @ts-check
/**
 * @file
 * „Technische Namen zeigen“ für die ganze App (Befund UX-20, 19.10.2026).
 * Vorher galt der Schalter nur im Komponenten-Editor (V02); CSS-Variablen in
 * den Foundation-Editoren und Arena-Angaben standen immer da. Ein Zustand,
 * je Browser gemerkt; App.vue setzt danach die Klasse cfg-ohne-technik am
 * Dokument, style.css blendet die technischen Angaben aus.
 */
import { ref, watch } from 'vue'

const SCHLUESSEL = 'neo-cfg-technische-namen'

function lesen () {
  try { return localStorage.getItem(SCHLUESSEL) !== 'nein' } catch { return true }
}

const technik = ref(lesen())
watch(technik, (an) => { try { localStorage.setItem(SCHLUESSEL, an ? 'ja' : 'nein') } catch { /* privater Modus */ } })

/** @returns {import('vue').Ref<boolean>} */
export function useTechnischeNamen () {
  return technik
}
