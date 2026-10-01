/**
 * useDrupalBetrieb — Oberflächen-Zustand im Drupal-Betrieb (Plan v2, 2.6, Teil 2)
 *
 * Nur aktiv, wenn speicher().art === 'drupal' (window.NEO_KONFIGURATOR,
 * ADR-002). Im lokalen Betrieb ruft niemand diese Funktionen auf.
 *
 * Hält, was die Header-Werkzeuge und Dialoge gemeinsam brauchen:
 *   - Speicherstatus des geöffneten Themes: gespeichert / ungespeicherte
 *     Änderungen / speichert / Fehler / ohne Drupal-Theme. Grundlage ist ein
 *     Fingerabdruck der Theme-Daten zum Zeitpunkt des letzten Öffnens oder
 *     Speicherns (auch in localStorage, damit der Status ein Neuladen der
 *     Seite übersteht — der Arbeitsstand bleibt im Browser, Beschluss 8).
 *   - Konflikt (412, If-Match passt nicht): öffnet den Konfliktdialog
 *     „Das Theme wurde inzwischen geändert“ (Beschluss 7).
 *   - Abläufe Speichern (Strg+S), Anlegen, Öffnen, Löschen, Aktivieren —
 *     mit verständlichen Meldungen (meldungFuer aus speicher/fehler.js).
 */
import { nextTick, reactive, toRaw, watch } from 'vue'
import { darf, kanonischesJson, meldungFuer, speicher } from '../speicher/index.js'
import { THEME_DATA_KEYS } from '../stores/theme/theme-schluessel.js'
import { bestaetigen, hinweisen } from './useBestaetigung.js'

/** localStorage: { id, abdruck } des zuletzt gespeicherten bzw. geöffneten Stands */
export const STAND_SCHLUESSEL = 'neo-theme-configurator-drupal-stand'

const zustand = reactive({
  /** 'ohne-theme' | 'gespeichert' | 'ungespeichert' | 'speichert' | 'fehler' */
  status: 'ohne-theme',
  /** Kurztext des letzten Fehlers (Statusanzeige) */
  fehlerText: '',
  /** SpeicherFehler (412) → Konfliktdialog offen */
  konflikt: null,
  /** Dialog „Neues Theme“: null | { vomStandard: boolean } */
  anlegen: null,
  /** Veröffentlichen-Dialog offen */
  veroeffentlichenOffen: false,
  /** Katalog konnte nicht geladen werden */
  katalogFehler: '',
})

let store = null
let basis = null
let stoppen = null
let zeitgeber = null

export const istDrupalBetrieb = () => speicher().art === 'drupal'

/** FNV-1a (32 Bit) über das kanonische JSON — reicht zum Vergleichen. */
function fnv (text) {
  let h = 0x811c9dc5
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return (h >>> 0).toString(16) + ':' + text.length
}

function abdruck () {
  const snap = JSON.parse(JSON.stringify(toRaw(store.snapshotThemeData({ withActiveSet: true }))))
  return fnv(kanonischesJson(snap))
}

function leseBasis () {
  try { return JSON.parse(localStorage.getItem(STAND_SCHLUESSEL) || 'null') } catch { return null }
}

/** Aktuellen Stand als „in Drupal gespeichert“ merken. */
export function merkeStand () {
  const id = store?.state.currentThemeMeta?.id
  if (!id) { basis = null; zustand.status = 'ohne-theme'; return }
  basis = { id, abdruck: abdruck() }
  try { localStorage.setItem(STAND_SCHLUESSEL, JSON.stringify(basis)) } catch { /* voll/gesperrt */ }
  zustand.status = 'gespeichert'
  zustand.fehlerText = ''
}

/** Status aus dem Vergleich mit dem gemerkten Stand ableiten. */
export function pruefeStand () {
  if (!store || zustand.status === 'speichert') return
  const id = store.state.currentThemeMeta?.id
  if (!id) { zustand.status = 'ohne-theme'; return }
  const gleich = basis && basis.id === id && basis.abdruck === abdruck()
  if (gleich) { zustand.status = 'gespeichert'; zustand.fehlerText = '' } else zustand.status = 'ungespeichert'
}

/**
 * Drupal-Betrieb starten (App.vue, nach loadFromStorage): Katalog laden,
 * Status bestimmen, Änderungen beobachten. Gibt eine Stopp-Funktion zurück.
 */
export async function starteDrupalBetrieb (s) {
  store = s
  basis = leseBasis()
  stoppen?.()
  const quelle = () => [...THEME_DATA_KEYS.map(k => store.state[k]), store.state.activeThemeSet, store.state.currentThemeMeta?.id]
  const stop = watch(quelle, () => {
    clearTimeout(zeitgeber)
    zeitgeber = setTimeout(pruefeStand, 150)
  }, { deep: true })
  stoppen = () => { stop(); clearTimeout(zeitgeber) }
  pruefeStand()
  await ladeKatalog()
  return stoppen
}

export async function ladeKatalog () {
  try {
    await store.ladeThemeKatalog()
    zustand.katalogFehler = ''
  } catch (e) {
    const m = meldungFuer(e, 'Laden der Themes')
    zustand.katalogFehler = m.titel
    await hinweisen(m)
  }
}

function fehlerZeigen (e, was) {
  const m = meldungFuer(e, was)
  zustand.status = 'fehler'
  zustand.fehlerText = m.titel
  return hinweisen(m)
}

/** Speichern (Knopf und Strg+S). Ohne Drupal-Theme: Dialog „Als neues Theme speichern“. */
export async function speichern () {
  if (!store || zustand.status === 'speichert') return false
  if (!darf('bearbeiten')) {
    await hinweisen({ titel: 'Nur Ansicht', text: 'Dir fehlt das Recht „bearbeiten“. Änderungen können nicht in Drupal gespeichert werden.' })
    return false
  }
  if (!store.state.currentThemeMeta?.id) {
    zustand.anlegen = { vomStandard: false }
    return false
  }
  zustand.status = 'speichert'
  try {
    await store.speichereTheme()
    merkeStand()
    return true
  } catch (e) {
    if (e?.art === 'veraltet') {
      zustand.status = 'fehler'
      zustand.fehlerText = 'Konflikt — nicht gespeichert'
      zustand.konflikt = e
      return false
    }
    await fehlerZeigen(e, 'Speichern')
    return false
  }
}

/** Neues Theme anlegen (vom NEO-Standard oder aus dem aktuellen Stand). */
export async function anlegen ({ name, version, vomStandard }) {
  try {
    if (vomStandard) {
      await store.legeThemeAusStandardAn(name, version)
    } else {
      store.state.currentThemeMeta = null
      await store.speichereTheme(name, version)
    }
    await nextTick()
    merkeStand()
    zustand.anlegen = null
    return true
  } catch (e) {
    await fehlerZeigen(e, 'Anlegen')
    return false
  }
}

async function verwerfenErlaubt (frage) {
  if (zustand.status !== 'ungespeichert' && zustand.status !== 'fehler') return true
  return bestaetigen({
    titel: 'Ungespeicherte Änderungen verwerfen?',
    text: frage,
    bestaetigenText: 'Verwerfen',
    gefaehrlich: true,
  })
}

/** Theme aus Drupal öffnen (fragt bei ungespeicherten Änderungen nach). */
export async function oeffnen (id) {
  if (store.state.currentThemeMeta?.id === id && zustand.status === 'gespeichert') return true
  if (!(await verwerfenErlaubt('Deine Änderungen am geöffneten Theme sind noch nicht in Drupal gespeichert. Beim Öffnen eines anderen Themes gehen sie verloren.'))) return false
  try {
    const ok = await store.oeffneTheme(id)
    if (!ok) { await hinweisen({ titel: 'Nicht gefunden', text: 'Das Theme wurde nicht gefunden — vielleicht hat es jemand gelöscht.' }); await ladeKatalog(); return false }
    await nextTick()
    merkeStand()
    return true
  } catch (e) {
    await fehlerZeigen(e, 'Öffnen')
    return false
  }
}

/** Konfliktdialog: „Neu laden“ — aktuellen Stand aus Drupal holen, eigene Änderungen verwerfen. */
export async function neuLaden () {
  const id = store.state.currentThemeMeta?.id
  zustand.konflikt = null
  if (!id) return false
  try {
    const ok = await store.oeffneTheme(id)
    await nextTick()
    if (ok) merkeStand()
    else { store.state.currentThemeMeta = null; zustand.status = 'ohne-theme'; await ladeKatalog() }
    return ok
  } catch (e) {
    await fehlerZeigen(e, 'Neu laden')
    return false
  }
}

/** Konfliktdialog: „Abbrechen“ — weiterarbeiten, nichts speichern. */
export function konfliktAbbrechen () {
  zustand.konflikt = null
  zustand.status = 'ungespeichert'
  zustand.fehlerText = ''
}

/** Theme löschen (Bestätigung; das aktive ist nicht löschbar). */
export async function loeschen (id) {
  const t = store.state.savedThemes.find(x => x.id === id)
  if (!t) return false
  if (t.aktiv) {
    await hinweisen({ titel: 'Aktives Theme', text: 'Das aktive Theme kann nicht gelöscht werden. Bitte zuerst ein anderes Theme aktivieren.' })
    return false
  }
  const ok = await bestaetigen({
    titel: 'Theme löschen?',
    text: `„${t.name}“ wird in Drupal gelöscht. Das lässt sich nicht rückgängig machen — Drupal führt keinen Verlauf.`,
    bestaetigenText: 'Löschen',
    gefaehrlich: true,
  })
  if (!ok) return false
  try {
    await store.loescheGespeichertesTheme(id)
    if (!store.state.currentThemeMeta) merkeStand()
    return true
  } catch (e) {
    await fehlerZeigen(e, 'Löschen')
    if (e?.istKonflikt) await ladeKatalog()
    return false
  }
}

/** Theme aktivieren (nur veröffentlichte, Recht „veröffentlichen“). */
export async function aktivieren (id) {
  try {
    await store.aktiviereTheme(id)
    return true
  } catch (e) {
    await hinweisen(meldungFuer(e, 'Aktivieren'))
    return false
  }
}

export function useDrupalBetrieb () {
  return {
    zustand,
    speichern,
    anlegen,
    oeffnen,
    neuLaden,
    konfliktAbbrechen,
    loeschen,
    aktivieren,
    ladeKatalog,
    merkeStand,
    pruefeStand,
  }
}

/** Nur für Tests. */
export function _zuruecksetzenDrupalBetrieb () {
  stoppen?.()
  stoppen = null
  store = null
  basis = null
  Object.assign(zustand, { status: 'ohne-theme', fehlerText: '', konflikt: null, anlegen: null, veroeffentlichenOffen: false, katalogFehler: '' })
}
