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
// Ohne Vorlage rendert die Arena per Slot-Heuristik. Dateien mit `_` am
// Anfang sind Helfer, keine Vorlagen.
// ==========================================================================

const MODULE = import.meta.glob(['./*.js', '!./index.js', '!./_*.js'], { eager: true })

const VORLAGEN = {}
for (const [pfad, modul] of Object.entries(MODULE)) {
  const id = pfad.slice(2, -3)
  if (typeof modul.default === 'function') VORLAGEN[id] = modul.default
}

export function vorlageFuer (id) {
  return VORLAGEN[id] || null
}

export function hatVorlage (id) {
  return id in VORLAGEN
}

export function vorlagenIds () {
  return Object.keys(VORLAGEN).sort()
}
