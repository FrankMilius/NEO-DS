// @ts-check
// Schriften auf dem Server (Drupal, Vertrag 1.1.0) — gemeinsamer Stand für
// die Schriftverwaltung (DrupalSchriften) und die Rollen-Auswahl der
// Typografie (TypographyEditor). Hängt die @font-face-Datei in die App ein.
import { ref } from 'vue'
import { meldungFuer, speicher } from '../speicher/index.js'

const LINK_ID = 'neo-konfigurator-schriften'

/** @type {import('vue').Ref<Array<{familie: string, quelle: string, schnitte: object[]}>>} */
export const serverSchriften = ref([])
export const serverSchriftenFehler = ref('')
let geladen = null

/** @font-face-Datei von Drupal einhängen (neue URL je Stand). */
function cssEinhaengen (url) {
  if (!url || typeof document === 'undefined') return
  let link = document.getElementById(LINK_ID)
  if (!link) {
    link = document.createElement('link')
    link.id = LINK_ID
    link.setAttribute('rel', 'stylesheet')
    document.head.appendChild(link)
  }
  if (link.getAttribute('href') !== url) link.setAttribute('href', url)
}

/** Antwort von GET/POST/DELETE /schriften übernehmen. */
export function uebernehmeSchriften (antwort) {
  serverSchriften.value = antwort?.schriften || []
  cssEinhaengen(antwort?.cssUrl)
}

/** Einmal laden (erneut mit neu = true). Nur im Drupal-Betrieb. */
export function ladeServerSchriften (neu = false) {
  const sp = speicher()
  if (sp.art !== 'drupal' || !sp.schriften) return Promise.resolve()
  if (geladen && !neu) return geladen
  geladen = sp.schriften()
    .then((a) => { uebernehmeSchriften(a); serverSchriftenFehler.value = '' })
    .catch((e) => { serverSchriftenFehler.value = meldungFuer(e, 'Laden der Schriften').titel; geladen = null })
  return geladen
}

/** Nur für Tests */
export function _zuruecksetzenServerSchriften () { serverSchriften.value = []; serverSchriftenFehler.value = ''; geladen = null }
