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
 *   - Website-Vorschau (Vertrag 1.1.0, Entscheidung Frank 14.10.2026): nach
 *     Speichern, Anlegen und Öffnen sieht die angemeldete Person den
 *     gespeicherten Stand sofort auf der Website; Besucher erst nach
 *     Veröffentlichen. Abschaltbar (gemerkt in localStorage).
 */
import { nextTick, reactive, toRaw, watch } from 'vue'
import { darf, kanonischesJson, meldungFuer, speicher } from '../speicher/index.js'
import { THEME_DATA_KEYS } from '../stores/theme/theme-schluessel.js'
import { bestaetigen, hinweisen } from './useBestaetigung.js'
import { neoAnsicht } from './neoAnsicht.js'

/** localStorage: { id, abdruck } des zuletzt gespeicherten bzw. geöffneten Stands */
export const STAND_SCHLUESSEL = 'neo-theme-configurator-drupal-stand'
/** localStorage: 'aus', wenn die Website-Vorschau abgeschaltet ist */
export const VORSCHAU_SCHLUESSEL = 'neo-theme-configurator-drupal-vorschau'

function vorschauGemerkt () {
  try { return localStorage.getItem(VORSCHAU_SCHLUESSEL) !== 'aus' } catch { return true }
}
/** localStorage: Theme-ID der zuletzt gesetzten Vorschau (UX-25: übersteht Neuladen) */
export const VORSCHAU_ID_SCHLUESSEL = 'neo-theme-configurator-drupal-vorschau-id'
function vorschauIdGemerkt () {
  try { return localStorage.getItem(VORSCHAU_ID_SCHLUESSEL) || null } catch { return null }
}
function merkeVorschauId (id) {
  try { if (id) localStorage.setItem(VORSCHAU_ID_SCHLUESSEL, id); else localStorage.removeItem(VORSCHAU_ID_SCHLUESSEL) } catch { /* gesperrt */ }
}

const zustand = reactive({
  /** 'ohne-theme' | 'gespeichert' | 'ungespeichert' | 'speichert' | 'fehler' */
  status: 'ohne-theme',
  /** Kurztext des letzten Fehlers (Statusanzeige) */
  fehlerText: '',
  /** SpeicherFehler (412) → Konfliktdialog offen */
  konflikt: null,
  /** Stand in Drupal beim Konflikt: { name, updatedAt, geaendertVon } (UX-07) */
  konfliktFremd: null,
  /** Dialog „Neues Theme“: null | { vomStandard: boolean } */
  anlegen: null,
  /** Veröffentlichen-Dialog offen */
  veroeffentlichenOffen: false,
  /** Katalog konnte nicht geladen werden */
  katalogFehler: '',
  /** Website-Vorschau eingeschaltet (für die angemeldete Person) */
  vorschauAn: vorschauGemerkt(),
  /** Theme-ID der zuletzt gesetzten Vorschau (null = keine) */
  vorschauId: vorschauIdGemerkt(),
  /** Name des Themes, das die Vorschau zeigt (vom Server, UX-25) */
  vorschauName: '',
  /** Fehler der Vorschau (stört das Speichern nicht) */
  vorschauFehler: '',
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

/**
 * Leere Objekte entfernen: Beim Neuladen ergänzt loadFromStorage leere
 * Foundation-Kategorien (elements, themes) — inhaltlich dasselbe, darf den
 * Status nicht auf „ungespeichert“ setzen (gefunden 14.10.2026 in DDEV).
 */
function ohneLeere (wert) {
  if (Array.isArray(wert)) return wert.map(ohneLeere)
  if (!wert || typeof wert !== 'object') return wert
  const aus = {}
  for (const [k, v] of Object.entries(wert)) {
    const n = ohneLeere(v)
    if (n && typeof n === 'object' && !Array.isArray(n) && !Object.keys(n).length) continue
    aus[k] = n
  }
  return aus
}

function abdruck () {
  const snap = ohneLeere(JSON.parse(JSON.stringify(toRaw(store.snapshotThemeData({ withActiveSet: true })))))
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
  // Arbeitsstand sofort mit dem neuen ETag sichern: das Auto-Save reagiert nur
  // auf Theme-Daten; sonst kommt nach dem Neuladen der alte ETag zurück und
  // das nächste Speichern/Veröffentlichen endet in 412 (gefunden 14.10.2026).
  store.saveToStorage?.()
  zustand.status = 'gespeichert'
  zustand.fehlerText = ''
}

/** Status aus dem Vergleich mit dem gemerkten Stand ableiten. */
export function pruefeStand () {
  if (!store || zustand.status === 'speichert' || zustand.status === 'laedt') return
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
  // UX-06: Warnung beim Verlassen der Seite mit ungespeicherten Änderungen
  const beimVerlassen = (e) => {
    if (zustand.status === 'ungespeichert' || zustand.status === 'fehler' || zustand.konflikt) {
      e.preventDefault()
      e.returnValue = ''
    }
  }
  // UX-25: zurück im Tab → Vorschau mit dem Server abgleichen
  const beimZurueckkehren = () => { if (typeof document === 'undefined' || document.visibilityState === 'visible') vorschauAbgleichen() }
  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', beimVerlassen)
    window.addEventListener('focus', beimZurueckkehren)
    document.addEventListener('visibilitychange', beimZurueckkehren)
  }
  stoppen = () => {
    stop(); clearTimeout(zeitgeber)
    if (typeof window !== 'undefined') {
      window.removeEventListener('beforeunload', beimVerlassen)
      window.removeEventListener('focus', beimZurueckkehren)
      document.removeEventListener('visibilitychange', beimZurueckkehren)
    }
  }
  // Drupal-Betrieb arbeitet im Set „neo“ (Klassen der Website); ein im
  // Browser liegender Arbeitsstand ohne Theme wird umgestellt.
  if (!store.state.currentThemeMeta?.id && store.state.activeThemeSet !== 'neo') store.state.activeThemeSet = 'neo'
  pruefeStand()
  await ladeKatalog()
  await pruefeAktualitaet()
  await vorschauAbgleichen()
  return stoppen
}

/** ETags vergleichen (nginx in DDEV schwächt zu W/"…" ab) */
const etagKern = (e) => String(e || '').replace(/^W\//, '').replace(/"/g, '')

/**
 * UX-27: Nach dem Neuladen kann der Arbeitsstand im Browser älter sein als
 * der in Drupal (jemand anderes hat gespeichert). Ohne eigene Änderungen
 * wird der neue Stand still geladen, sonst gefragt. Gelöschte Themes:
 * UX-26.
 */
export async function pruefeAktualitaet () {
  const meta = store?.state.currentThemeMeta
  if (!meta?.id || zustand.katalogFehler) return
  const t = store.state.savedThemes.find(x => x.id === meta.id)
  if (!t) {
    if (zustand.status === 'gespeichert') {
      store.state.currentThemeMeta = null
      zustand.status = 'ohne-theme'
      await hinweisen({ titel: 'Theme nicht mehr vorhanden', text: `„${meta.name}“ wurde inzwischen in Drupal gelöscht. Wählen Sie ein anderes Theme oder legen Sie ein neues an.` })
    } else {
      await geloeschtRetten(meta.name)
    }
    return
  }
  if (!t.hash || !meta.etag || etagKern(t.hash) === etagKern(meta.etag)) return
  if (zustand.status === 'gespeichert') { await neuLaden(); return }
  const von = t.geaendertVon ? ` von ${t.geaendertVon}` : ''
  const ok = await bestaetigen({
    titel: 'Neuerer Stand in Drupal',
    text: `„${meta.name}“ wurde${von} in Drupal gespeichert, nachdem Sie es zuletzt gespeichert haben. Laden Sie den neueren Stand (Ihre ungespeicherten Änderungen gehen verloren) oder arbeiten Sie weiter — beim Speichern entscheiden Sie dann.`,
    bestaetigenText: 'Neueren Stand laden',
    abbrechenText: 'Weiterarbeiten',
  })
  if (ok) await neuLaden()
}

/** Eigenen Stand als neues Theme speichern (Konflikt, gelöschtes Theme). */
async function alsNeuesThemeSpeichern (name, was) {
  try {
    store.state.currentThemeMeta = null
    await store.speichereTheme(name, store.state.version || '1.0.0')
    await nextTick()
    merkeStand()
    await vorschauNachziehen()
    await ladeKatalog()
    return true
  } catch (err) {
    await fehlerZeigen(err, was)
    return false
  }
}

/** UX-26: Das Theme wurde anderswo gelöscht — Änderungen retten statt „Nicht gefunden“. */
async function geloeschtRetten (name) {
  await ladeKatalog()
  const ok = await bestaetigen({
    titel: 'Theme wurde gelöscht',
    text: `„${name}“ gibt es in Drupal nicht mehr — vermutlich hat es jemand gelöscht. Ihre Änderungen sind noch da: Speichern Sie sie als neues Theme „${name} (gerettet)“.`,
    bestaetigenText: 'Als neues Theme speichern',
    abbrechenText: 'Später',
  })
  if (ok) return alsNeuesThemeSpeichern(`${name} (gerettet)`, 'Als neues Theme speichern')
  zustand.status = 'ungespeichert'
  return false
}

/** Vorschau auf den gespeicherten Stand nachziehen (Fehler nur anzeigen). */
export async function vorschauNachziehen () {
  if (!store || !zustand.vorschauAn || !darf('bearbeiten') || !store.state.currentThemeMeta?.id) return
  try {
    const erg = await store.setzeWebsiteVorschau()
    zustand.vorschauId = erg?.themeId ?? store.state.currentThemeMeta.id
    zustand.vorschauName = erg?.name || store.state.currentThemeMeta.name || ''
    merkeVorschauId(zustand.vorschauId)
    zustand.vorschauFehler = ''
  } catch (e) {
    zustand.vorschauFehler = meldungFuer(e, 'Website-Vorschau').titel
  }
}

/** Website-Vorschau ein- oder ausschalten. */
export async function vorschauUmschalten (an = !zustand.vorschauAn) {
  zustand.vorschauAn = an
  try { localStorage.setItem(VORSCHAU_SCHLUESSEL, an ? 'an' : 'aus') } catch { /* gesperrt */ }
  if (an) return vorschauNachziehen()
  try {
    await store?.beendeWebsiteVorschau()
    zustand.vorschauId = null
    zustand.vorschauName = ''
    merkeVorschauId(null)
    zustand.vorschauFehler = ''
  } catch (e) {
    zustand.vorschauFehler = meldungFuer(e, 'Website-Vorschau').titel
  }
}

/**
 * Vorschau mit dem Server abgleichen (Befund UX-25, 19.10.2026). Vorher kam
 * „an/aus“ nur aus dem Browser: Wer die Vorschau über die Leiste auf der
 * Website beendete, sah in der App weiter „an“.
 *   Server hat eine Vorschau  → an, mit Theme und Namen vom Server
 *   Server hat keine, die App hatte eine gesetzt → auf der Website beendet: aus
 *     (die ID der gesetzten Vorschau liegt im Browser — gilt auch nach Neuladen)
 *   Server hat keine, die App noch keine → Wunsch bleibt (setzt beim Speichern)
 */
export async function vorschauAbgleichen () {
  if (!store?.leseWebsiteVorschau) return
  let server
  try { server = await store.leseWebsiteVorschau() } catch { return }   // offline: nichts ändern
  if (server === undefined) return
  if (server) {
    zustand.vorschauAn = true
    zustand.vorschauId = server.themeId
    zustand.vorschauName = server.name || ''
    merkeVorschauId(server.themeId)
    try { localStorage.setItem(VORSCHAU_SCHLUESSEL, 'an') } catch { /* gesperrt */ }
  } else if (zustand.vorschauId) {
    zustand.vorschauAn = false
    zustand.vorschauId = null
    zustand.vorschauName = ''
    merkeVorschauId(null)
    try { localStorage.setItem(VORSCHAU_SCHLUESSEL, 'aus') } catch { /* gesperrt */ }
  }
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
    await hinweisen({ titel: 'Nur Ansicht', text: 'Ihnen fehlt das Recht „bearbeiten“. Änderungen können nicht in Drupal gespeichert werden.' })
    return false
  }
  if (!store.state.currentThemeMeta?.id) {
    zustand.anlegen = { vomStandard: neoAnsicht.value }
    return false
  }
  zustand.status = 'speichert'
  try {
    await store.speichereTheme()
    merkeStand()
    await vorschauNachziehen()
    return true
  } catch (e) {
    if (e?.art === 'veraltet') {
      meldeKonflikt(e)
      return false
    }
    if (e?.art === 'nicht-gefunden') {
      zustand.status = 'ungespeichert'
      return geloeschtRetten(store.state.currentThemeMeta?.name || 'Theme')
    }
    await fehlerZeigen(e, 'Speichern')
    return false
  }
}

/** Neues Theme anlegen (vom NEO-Standard oder aus dem aktuellen Stand). */
export async function anlegen ({ name, version, vomStandard }) {
  const warNeo = neoAnsicht.value
  neoAnsicht.value = false   // Anlegen beendet „NEO ansehen“ (vorher, sonst greift der Schreibschutz)
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
    await vorschauNachziehen()
    return true
  } catch (e) {
    neoAnsicht.value = warNeo
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
  // UX-27: das geöffnete Theme erneut wählen lädt den Stand aus Drupal neu
  if (store.state.currentThemeMeta?.id === id && zustand.status === 'gespeichert') return neuLaden()
  if (!(await verwerfenErlaubt('Ihre Änderungen am geöffneten Theme sind noch nicht in Drupal gespeichert. Beim Öffnen eines anderen Themes gehen sie verloren.'))) return false
  try {
    neoAnsicht.value = false
    const ok = await store.oeffneTheme(id)
    if (!ok) { await hinweisen({ titel: 'Nicht gefunden', text: 'Das Theme wurde nicht gefunden — vielleicht hat es jemand gelöscht.' }); await ladeKatalog(); return false }
    await nextTick()
    merkeStand()
    await vorschauNachziehen()
    return true
  } catch (e) {
    await fehlerZeigen(e, 'Öffnen')
    return false
  }
}

/**
 * Konflikt (412) melden: Dialog öffnen und den Stand in Drupal nachladen,
 * damit der Dialog Person und Zeit der anderen Änderung nennt (UX-07).
 * Die eigenen Daten bleiben unberührt.
 */
export function meldeKonflikt (e) {
  zustand.status = 'fehler'
  zustand.fehlerText = 'Konflikt — nicht gespeichert'
  zustand.konflikt = e
  zustand.konfliktFremd = null
  const id = store?.state.currentThemeMeta?.id
  if (!id) return
  speicher().lade(id)
    .then((erg) => { if (zustand.konflikt === e && erg?.meta) zustand.konfliktFremd = { name: erg.meta.name, updatedAt: erg.meta.updatedAt, geaendertVon: erg.meta.geaendertVon || '', etag: erg.etag } })
    .catch(() => {})
}

/**
 * Konfliktdialog: „Meine Fassung speichern“ — den eigenen Stand über den
 * aktuellen in Drupal schreiben (UX-07). If-Match ist dann der ETag des
 * Stands, den man gerade gesehen hat; hat inzwischen wieder jemand
 * gespeichert, kommt der Dialog erneut.
 */
export async function konfliktUeberschreiben () {
  const e = zustand.konflikt
  const etag = zustand.konfliktFremd?.etag || e?.aktuellEtag
  if (!etag || !store.state.currentThemeMeta) return false
  zustand.konflikt = null
  zustand.konfliktFremd = null
  store.state.currentThemeMeta = { ...store.state.currentThemeMeta, etag }
  return speichern()
}

/**
 * Konfliktdialog: „Als neues Theme speichern“ — der eigene Stand wird ein
 * eigenes Theme, das andere bleibt unverändert (UX-07).
 */
export async function konfliktAlsNeuesTheme () {
  const name = `${store.state.currentThemeMeta?.name || 'Theme'} (meine Fassung)`
  zustand.konflikt = null
  zustand.konfliktFremd = null
  return alsNeuesThemeSpeichern(name, 'Als neues Theme speichern')
}

/** Konfliktdialog: „Neu laden“ — aktuellen Stand aus Drupal holen, eigene Änderungen verwerfen. */
export async function neuLaden () {
  const id = store.state.currentThemeMeta?.id
  zustand.konflikt = null
  zustand.konfliktFremd = null
  if (!id) return false
  // Während des Ladens „Lädt …“ — Eingaben in dieser Zeit würden überschrieben
  zustand.status = 'laedt'
  try {
    const ok = await store.oeffneTheme(id)
    await nextTick()
    if (ok) { merkeStand(); await vorschauNachziehen() } else { store.state.currentThemeMeta = null; zustand.status = 'ohne-theme'; await ladeKatalog() }
    return ok
  } catch (e) {
    await fehlerZeigen(e, 'Neu laden')
    return false
  }
}

/** Konfliktdialog: „Abbrechen“ — weiterarbeiten, nichts speichern. */
export function konfliktAbbrechen () {
  zustand.konflikt = null
  zustand.konfliktFremd = null
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
    text: `„${t.name}“ (Version ${t.version || '–'}${t.updatedAt ? `, zuletzt gespeichert am ${new Date(t.updatedAt).toLocaleString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}` : ''}) wird in Drupal gelöscht. Das lässt sich nicht rückgängig machen — Drupal führt keinen Verlauf.`,
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
  // UX-05: Aktivieren stellt die Website für alle Besucher um — erst fragen
  const t = store.state.savedThemes.find(x => x.id === id)
  const bisher = store.state.savedThemes.find(x => x.aktiv)
  const ok = await bestaetigen({
    titel: 'Theme aktivieren?',
    text: `Die Website zeigt danach allen Besuchern „${t?.name || id}“ im veröffentlichten Stand`
      + (t?.veroeffentlichtAm ? ` vom ${new Date(t.veroeffentlichtAm).toLocaleString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}` : '')
      + `. Es ersetzt ${bisher ? `„${bisher.name}“` : 'den NEO-Standard'}. Zurückwechseln geht jederzeit über die Theme-Auswahl.`,
    bestaetigenText: 'Aktivieren',
  })
  if (!ok) return false
  try {
    await store.aktiviereTheme(id)
    return true
  } catch (e) {
    await hinweisen(meldungFuer(e, 'Aktivieren'))
    return false
  }
}

/**
 * NEO Design System (Standard) ansehen (Befund Frank 15.10.2026): lädt den
 * aktuellen NEO-Standard ohne Theme, Editoren gesperrt. Die eigene
 * Website-Vorschau endet — die Website zeigt dann, was Besucher sehen.
 */
export async function neoAnsehen () {
  if (neoAnsicht.value && !store.state.currentThemeMeta?.id) return true
  if (!(await verwerfenErlaubt('Ihre Änderungen am geöffneten Theme sind noch nicht in Drupal gespeichert. Beim Wechsel zum NEO-Standard gehen sie verloren.'))) return false
  try {
    await store.zeigeNeoStandard()
    neoAnsicht.value = true
    await nextTick()
    merkeStand()
    if (zustand.vorschauAn && darf('bearbeiten')) {
      try { await store.beendeWebsiteVorschau(); zustand.vorschauId = null; zustand.vorschauName = ''; merkeVorschauId(null) } catch { /* Vorschau bleibt */ }
    }
    return true
  } catch (e) {
    await fehlerZeigen(e, 'NEO-Standard laden')
    return false
  }
}

/** NEO-Standard aktivieren: kein Theme aktiv, die Website zeigt reines NEO. */
export async function neoStandardAktivieren () {
  const ok = await bestaetigen({
    titel: 'NEO-Standard aktivieren?',
    text: 'Die Website zeigt danach für alle Besucher wieder das unveränderte NEO Design System. Die Themes bleiben erhalten und lassen sich jederzeit wieder aktivieren.',
    bestaetigenText: 'NEO-Standard aktivieren',
  })
  if (!ok) return false
  try {
    await store.aktiviereNeoStandard()
    return true
  } catch (e) {
    await hinweisen(meldungFuer(e, 'NEO-Standard aktivieren'))
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
    neoStandardAktivieren,
    meldeKonflikt,
    konfliktUeberschreiben,
    konfliktAlsNeuesTheme,
    neoAnsehen,
    neoAnsicht,
    vorschauUmschalten,
    vorschauNachziehen,
    vorschauAbgleichen,
  }
}

/** Nur für Tests. */
export function _zuruecksetzenDrupalBetrieb () {
  stoppen?.()
  stoppen = null
  store = null
  basis = null
  Object.assign(zustand, { status: 'ohne-theme', fehlerText: '', konflikt: null, konfliktFremd: null, anlegen: null, veroeffentlichenOffen: false, katalogFehler: '', vorschauAn: true, vorschauId: null, vorschauName: '', vorschauFehler: '' }); merkeVorschauId(null)
}
