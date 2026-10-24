// ==========================================================================
// Vorlagen-Registry fuer die RecipeArena
// ==========================================================================
// Je Recipe-ID eine Datei `<id>.js` mit
//
//   export default (zelle, m) => `<… class="${m.klasse}"${m.attrs}>…`
//
// `m` ist das Modell aus src/lib/recipe-arena.js (baueModell): Klassen aus
// Basis + Achsen-Modifiern + Zustandsklassen, Attribute aus den State-Rules,
// m.slot(name) fuer optionale Slots (slotConfig), m.text fuer das Label,
// m.hat(zustand)/m.deaktiviert, m.wert(achse), m.uid (eindeutig je Zelle),
// m.basisKlasse/m.attrsOhne(...) wenn der Zustand an ein Kind gehoert.
//
// Das Markup stammt aus data/markup/<id>.html (von der Website bzw. den
// Doku-Seiten geerntet) — dieselbe Quelle wie Storybook. Die Vorlage setzt nur
// Klassen, Attribute und Slot-Schalter aus dem Recipe ein.
//
// Optional exportiert eine Vorlage `einrichten(element)`: die RecipeArena ruft
// es nach dem Rendern je Zelle auf — fuer DOM-Eigenschaften, die es als
// Markup nicht gibt und die im DS das JS setzt (z. B. checkbox.indeterminate,
// Lage des gleitenden Indikators im Segmented Control).
//
// Gibt einrichten() eine Funktion zurueck, ruft die RecipeArena sie vor dem
// naechsten Rendern und beim Verlassen auf (Aufraeumen, z. B. Canvas-
// Renderer mit requestAnimationFrame — psychedelic-bg).
//
// Optional exportiert eine Vorlage `ausprobieren = { hinweis }`: die Arena
// bietet dann „Ausprobieren" an, auch ohne Behavior in neo-behaviors — fuer
// Bauteile, deren Verhalten nur die Arena selbst mitbringt (psychedelic-bg:
// Canvas-Renderer des Konfigurators, im DS nicht gebaut).
//
// Optional exportiert eine Vorlage `abspielen = { hinweis, gesperrt?, starten? }`
// (Plan v3, Phase 4, Gruppe bewegung): die Arena bietet dann die Taste
// „Abspielen" an. starten(zelle) stellt die Bewegung des Website-Blocks mit
// den Mitteln des DS nach — Klassen-/Zustandswechsel, die das SCSS animiert
// (is-active, is-visible), scroll-behavior/scroll-snap des DS oder DS-
// Keyframes — und gibt eine Aufraeum-Funktion zurueck, die den statischen
// Zustand wiederherstellt. Kein GSAP im Konfigurator-Bundle. Gibt es die
// Bewegung nur als GSAP-Logik der Website (parallax-bg) oder ist das
// Bauteil nicht gebaut, nennt `gesperrt` den Grund: die Taste bleibt dann
// deaktiviert. Bei prefers-reduced-motion deaktiviert die Arena die Taste.
// Das ist der EINZIGE Mechanismus fuer animierte Website-Bloecke (in Phase 4
// vereinheitlicht: kein eigener Knopf im Zellen-Markup, kein umbenanntes
// „Ausprobieren"); Helfer in _bewegung.js (imTakt, blaettere, spieleEin).
//
// Optional exportiert eine Vorlage `zusatzSpecimens` (Liste im Format der
// Recipe-Specimens): die Arena haengt sie hinter die Specimens des Recipes —
// nur fuer die Buehne, das Recipe (Doku, Storybook, Drupal) bleibt unberuehrt.
// Gedacht fuer Bauteil-Faelle, die kein Recipe-Specimen zeigt, deren Werte die
// Wirkungspruefung aber sehen muss (R14 Paket 3c, Frank 23.10.2026: nur
// ergaenzen, bestehende Specimens nicht aendern).
//
// Ohne Vorlage rendert die Arena per Slot-Heuristik. Dateien mit `_` am
// Anfang sind Helfer, keine Vorlagen.
// ==========================================================================

const MODULE = import.meta.glob(['./*.js', '!./index.js', '!./_*.js'], { eager: true })

const VORLAGEN = {}
const EINRICHTUNG = {}
const AUSPROBIEREN = {}
const ABSPIELEN = {}
const ZUSATZ = {}
for (const [pfad, modul] of Object.entries(MODULE)) {
  const id = pfad.slice(2, -3)
  if (typeof modul.default === 'function') VORLAGEN[id] = modul.default
  if (typeof modul.einrichten === 'function') EINRICHTUNG[id] = modul.einrichten
  if (modul.ausprobieren && typeof modul.ausprobieren === 'object') AUSPROBIEREN[id] = modul.ausprobieren
  if (modul.abspielen && typeof modul.abspielen === 'object') ABSPIELEN[id] = modul.abspielen
  if (Array.isArray(modul.zusatzSpecimens)) ZUSATZ[id] = modul.zusatzSpecimens
}

export function vorlageFuer (id) {
  return VORLAGEN[id] || null
}

/** Nachbereitung nach dem Rendern (DOM-Eigenschaften ohne Markup) oder null. */
export function einrichtungFuer (id) {
  return EINRICHTUNG[id] || null
}

/** Eigenes „Ausprobieren" der Vorlage ({ hinweis }) oder null. */
export function ausprobierenFuer (id) {
  return AUSPROBIEREN[id] || null
}

/** Taste „Abspielen" der Vorlage ({ hinweis, gesperrt?, starten? }) oder null. */
export function abspielenFuer (id) {
  return ABSPIELEN[id] || null
}

/** Zusaetzliche Buehnen-Specimens der Vorlage (Liste, leer ohne). */
export function zusatzSpecimensFuer (id) {
  return ZUSATZ[id] || []
}

/** Rohes Recipe mit den Zusatz-Specimens der Vorlage dahinter (Original bleibt). */
export function mitZusatzSpecimens (raw, id) {
  const zusatz = zusatzSpecimensFuer(id)
  return zusatz.length ? { ...raw, specimens: [...(raw.specimens || []), ...zusatz] } : raw
}

export function hatVorlage (id) {
  return id in VORLAGEN
}

export function vorlagenIds () {
  return Object.keys(VORLAGEN).sort()
}
