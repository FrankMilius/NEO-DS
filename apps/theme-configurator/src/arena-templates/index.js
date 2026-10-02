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
// Ohne Vorlage rendert die Arena per Slot-Heuristik. Dateien mit `_` am
// Anfang sind Helfer, keine Vorlagen.
// ==========================================================================

const MODULE = import.meta.glob(['./*.js', '!./index.js', '!./_*.js'], { eager: true })

const VORLAGEN = {}
const EINRICHTUNG = {}
for (const [pfad, modul] of Object.entries(MODULE)) {
  const id = pfad.slice(2, -3)
  if (typeof modul.default === 'function') VORLAGEN[id] = modul.default
  if (typeof modul.einrichten === 'function') EINRICHTUNG[id] = modul.einrichten
}

export function vorlageFuer (id) {
  return VORLAGEN[id] || null
}

/** Nachbereitung nach dem Rendern (DOM-Eigenschaften ohne Markup) oder null. */
export function einrichtungFuer (id) {
  return EINRICHTUNG[id] || null
}

export function hatVorlage (id) {
  return id in VORLAGEN
}

export function vorlagenIds () {
  return Object.keys(VORLAGEN).sort()
}
