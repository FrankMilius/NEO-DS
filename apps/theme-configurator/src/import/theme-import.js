// ==========================================================================
// Theme-Import (Plan v2, 2.2) — JSON im Format von exportAsJSON()
// ==========================================================================
// pruefeThemeImport(text)  -> { ok, fehler[], daten, meta }
//   Schema-Pruefung: bekannte Schluessel, Typen, Farbwerte, Versionsfeld.
//   Ein Fehler reicht fuer die Ablehnung; die Liste nennt alle Fundstellen
//   (hoechstens MAX_FEHLER), damit man die Datei in einem Durchgang korrigiert.
// importZiel(daten, aktuell) -> vollstaendige Theme-Daten des Sets nach dem Import
// importVorschau(ziel, aktuell) -> je Bereich Anzahl Aenderungen + Beispiele
//
// Die Schluessel des Export-Formats sind auf THEME_DATA_KEYS abgebildet
// (IMPORT_ZUORDNUNG). Alles andere — eigene Tokens, Schriften, Icons — steht
// nicht im Export und bleibt beim Import unveraendert.
// ==========================================================================

import { componentTokenGroups, foundationTokens, primitiveColors, semanticDefaults, semanticTokenGroups } from '../data/tokens.js'
import { TYPE_SCALE_KEYS } from '../stores/theme/token-aktionen.js'

export const MAX_FEHLER = 25

/** Export-Schluessel -> Theme-Daten-Schluessel (alle aus THEME_DATA_KEYS). */
export const IMPORT_ZUORDNUNG = {
  semantic: ['themes'],
  foundation: ['foundationOverrides'],
  components: ['componentOverrides', 'componentLocks', 'componentVersions', 'variantDefinitions'],
  primitives: ['primitiveOverrides'],
  typeScale: ['typeScale'],
  focusRingMode: ['focusRingMode'],
}
const BEKANNT_OBEN = new Set(['meta', ...Object.keys(IMPORT_ZUORDNUNG)])
const META_FELDER = new Set(['name', 'version', 'branch', 'generated', 'generator'])

export const BEREICHE = {
  themes: 'Semantische Farben',
  foundationOverrides: 'Foundation',
  componentOverrides: 'Komponenten-Tokens',
  componentLocks: 'Komponenten-Sperren',
  componentVersions: 'Komponenten-Versionen',
  variantDefinitions: 'Eigene Varianten',
  primitiveOverrides: 'Markenfarben (Primitives)',
  typeScale: 'Schriftskala',
  focusRingMode: 'Fokusring',
}

const SEMVER = /^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/
const FARBE = [
  /^#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i,
  /^(?:rgba?|hsla?|oklch|oklab|lab|lch)\([^;{}]*\)$/i,
  /^color-mix\([^;{}]*\)$/i,
  /^var\(--[a-z0-9-]+(?:\s*,[^;{}]*)?\)$/i,
  /^(?:transparent|currentcolor)$/i,
]
export const istFarbe = (v) => typeof v === 'string' && FARBE.some((r) => r.test(v.trim()))
const istObjekt = (v) => v !== null && typeof v === 'object' && !Array.isArray(v)
// CSS-Wert: Text oder Zahl, ohne Zeichen, die aus einer Deklaration ausbrechen.
const istCssWert = (v) => (typeof v === 'number' && Number.isFinite(v)) || (typeof v === 'string' && v.trim() !== '' && !/[;{}<>]/.test(v))
const typ = (v) => (v === null ? 'null' : Array.isArray(v) ? 'Liste' : typeof v === 'object' ? 'Objekt' : typeof v === 'string' ? 'Text' : typeof v === 'number' ? 'Zahl' : typeof v === 'boolean' ? 'Wahrheitswert' : typeof v)

const SEMANTIK_IDS = new Set([...semanticTokenGroups.flatMap((g) => g.tokens.map((t) => t.id)), ...Object.values(semanticDefaults).flatMap((d) => Object.keys(d))])
const KOMPONENTEN_IDS = new Set(componentTokenGroups.flatMap((g) => g.tokens.map((t) => t.id)))
const KOMPONENTEN = new Set(componentTokenGroups.map((g) => g.id))

/**
 * JSON-Text pruefen und in Theme-Daten (Teilmenge von THEME_DATA_KEYS) uebersetzen.
 */
export function pruefeThemeImport(text) {
  const fehler = []
  const f = (msg) => { if (fehler.length < MAX_FEHLER) fehler.push(msg) }
  let roh
  try { roh = JSON.parse(text) } catch (e) {
    return { ok: false, fehler: [`Die Datei ist kein gültiges JSON (${e.message}).`], daten: null, meta: null }
  }
  if (!istObjekt(roh)) return { ok: false, fehler: [`Erwartet wird ein JSON-Objekt, gefunden: ${typ(roh)}.`], daten: null, meta: null }

  for (const k of Object.keys(roh)) if (!BEKANNT_OBEN.has(k)) f(`Unbekannter Schlüssel „${k}“ auf oberster Ebene.`)

  // meta + Versionsfeld
  const meta = roh.meta
  if (!istObjekt(meta)) f('„meta“ fehlt oder ist kein Objekt — ein Theme-Export enthält immer meta.version.')
  else {
    for (const k of Object.keys(meta)) if (!META_FELDER.has(k)) f(`Unbekannter Schlüssel „meta.${k}“.`)
    if (typeof meta.version !== 'string' || !SEMVER.test(meta.version)) f(`„meta.version“ muss eine Versionsnummer wie „1.0.0“ sein, gefunden: ${JSON.stringify(meta.version)}.`)
    for (const k of ['name', 'branch', 'generated', 'generator']) if (meta[k] !== undefined && typeof meta[k] !== 'string') f(`„meta.${k}“ muss Text sein, gefunden: ${typ(meta[k])}.`)
  }

  const daten = {}

  // semantic
  if (roh.semantic !== undefined) {
    if (!istObjekt(roh.semantic)) f(`„semantic“ muss ein Objekt sein, gefunden: ${typ(roh.semantic)}.`)
    else {
      daten.themes = {}
      for (const [modus, werte] of Object.entries(roh.semantic)) {
        if (modus !== 'light' && modus !== 'dark') { f(`Unbekannter Schlüssel „semantic.${modus}“ (erlaubt: light, dark).`); continue }
        if (!istObjekt(werte)) { f(`„semantic.${modus}“ muss ein Objekt sein, gefunden: ${typ(werte)}.`); continue }
        daten.themes[modus] = {}
        for (const [id, v] of Object.entries(werte)) {
          if (!SEMANTIK_IDS.has(id)) f(`Unbekannte semantische Rolle „semantic.${modus}.${id}“.`)
          else if (!istFarbe(v)) f(`Ungültiger Farbwert für „semantic.${modus}.${id}“: ${JSON.stringify(v)}.`)
          else daten.themes[modus][id] = v
        }
      }
    }
  }

  // primitives
  if (roh.primitives !== undefined) {
    if (!istObjekt(roh.primitives)) f(`„primitives“ muss ein Objekt sein, gefunden: ${typ(roh.primitives)}.`)
    else {
      daten.primitiveOverrides = {}
      for (const [p, v] of Object.entries(roh.primitives)) {
        if (!(p in primitiveColors)) f(`Unbekannte Palette „primitives.${p}“ (erlaubt: ${Object.keys(primitiveColors).join(', ')}).`)
        else if (!istFarbe(v)) f(`Ungültiger Farbwert für „primitives.${p}“: ${JSON.stringify(v)}.`)
        else daten.primitiveOverrides[p] = v
      }
    }
  }

  // foundation
  if (roh.foundation !== undefined) {
    if (!istObjekt(roh.foundation)) f(`„foundation“ muss ein Objekt sein, gefunden: ${typ(roh.foundation)}.`)
    else {
      daten.foundationOverrides = {}
      for (const [kat, werte] of Object.entries(roh.foundation)) {
        if (!(kat in foundationTokens)) { f(`Unbekannte Foundation-Kategorie „foundation.${kat}“.`); continue }
        if (!istObjekt(werte)) { f(`„foundation.${kat}“ muss ein Objekt sein, gefunden: ${typ(werte)}.`); continue }
        daten.foundationOverrides[kat] = {}
        for (const [key, v] of Object.entries(werte)) {
          const t = foundationTokens[kat].tokens?.[key]
          if (!t) f(`Unbekanntes Foundation-Token „foundation.${kat}.${key}“.`)
          else if (!istCssWert(v)) f(`Ungültiger Wert für „foundation.${kat}.${key}“: ${JSON.stringify(v)}.`)
          else if (typeof t.value === 'number' && typeof v !== 'number') f(`„foundation.${kat}.${key}“ muss eine Zahl sein, gefunden: ${typ(v)}.`)
          else daten.foundationOverrides[kat][key] = v
        }
      }
    }
  }

  // components
  if (roh.components !== undefined) {
    if (!istObjekt(roh.components)) f(`„components“ muss ein Objekt sein, gefunden: ${typ(roh.components)}.`)
    else {
      const ov = {}, locks = {}, versionen = {}, varianten = {}
      for (const [id, c] of Object.entries(roh.components)) {
        const wo = `components.${id}`
        if (!KOMPONENTEN.has(id) && id !== '_ungrouped') { f(`Unbekannte Komponente „${wo}“.`); continue }
        if (!istObjekt(c)) { f(`„${wo}“ muss ein Objekt sein, gefunden: ${typ(c)}.`); continue }
        for (const k of Object.keys(c)) if (!['version', 'locked', 'overrides', 'customVariants'].includes(k)) f(`Unbekannter Schlüssel „${wo}.${k}“.`)
        if (c.version !== undefined && c.version !== null) {
          if (typeof c.version !== 'string' || !SEMVER.test(c.version)) f(`„${wo}.version“ muss eine Versionsnummer wie „1.0.0“ oder null sein.`)
          else versionen[id] = c.version
        }
        if (c.locked !== undefined) {
          if (typeof c.locked !== 'boolean') f(`„${wo}.locked“ muss true oder false sein, gefunden: ${typ(c.locked)}.`)
          else if (c.locked) locks[id] = true
        }
        const variantenTokens = new Set()
        if (c.customVariants !== undefined) {
          if (!istObjekt(c.customVariants)) f(`„${wo}.customVariants“ muss ein Objekt sein.`)
          else for (const [name, d] of Object.entries(c.customVariants)) {
            const vw = `${wo}.customVariants.${name}`
            if (!istObjekt(d) || typeof d.modifier !== 'string' || !/^[a-z0-9_-]+$/i.test(d.modifier) || (d.tokens !== undefined && !istObjekt(d.tokens))) { f(`„${vw}“ braucht modifier (Klassenname) und tokens (Objekt).`); continue }
            for (const [t, v] of Object.entries(d.tokens || {})) {
              if (!istCssWert(v)) f(`Ungültiger Wert für „${vw}.tokens.${t}“: ${JSON.stringify(v)}.`)
              variantenTokens.add(t)
            }
            ;(varianten[id] ??= {})[name] = { modifier: d.modifier, baseVariant: typeof d.baseVariant === 'string' ? d.baseVariant : undefined, tokens: Object.keys(d.tokens || {}) }
          }
        }
        if (c.overrides !== undefined) {
          if (!istObjekt(c.overrides)) { f(`„${wo}.overrides“ muss ein Objekt sein, gefunden: ${typ(c.overrides)}.`); continue }
          for (const [t, v] of Object.entries(c.overrides)) {
            if (!KOMPONENTEN_IDS.has(t) && !variantenTokens.has(t)) f(`Unbekanntes Komponenten-Token „${wo}.overrides.${t}“.`)
            else if (!istCssWert(v)) f(`Ungültiger Wert für „${wo}.overrides.${t}“: ${JSON.stringify(v)}.`)
            else ov[t] = v
          }
        }
      }
      Object.assign(daten, { componentOverrides: ov, componentLocks: locks, componentVersions: versionen, variantDefinitions: varianten })
    }
  }

  // typeScale
  if (roh.typeScale !== undefined) {
    if (!istObjekt(roh.typeScale)) f(`„typeScale“ muss ein Objekt sein, gefunden: ${typ(roh.typeScale)}.`)
    else {
      daten.typeScale = {}
      for (const [k, v] of Object.entries(roh.typeScale)) {
        if (!TYPE_SCALE_KEYS.includes(k)) f(`Unbekannter Schlüssel „typeScale.${k}“ (erlaubt: ${TYPE_SCALE_KEYS.join(', ')}).`)
        else if (typeof v !== 'number' || !Number.isFinite(v) || v <= 0) f(`„typeScale.${k}“ muss eine positive Zahl sein, gefunden: ${JSON.stringify(v)}.`)
        else daten.typeScale[k] = v
      }
    }
  }

  // focusRingMode
  if (roh.focusRingMode !== undefined) {
    if (roh.focusRingMode !== 'offset' && roh.focusRingMode !== 'inset') f(`„focusRingMode“ muss „offset“ oder „inset“ sein, gefunden: ${JSON.stringify(roh.focusRingMode)}.`)
    else daten.focusRingMode = roh.focusRingMode
  }

  if (!fehler.length && !Object.keys(daten).length) f('Die Datei enthält keine Theme-Daten (semantic, foundation, components, primitives, typeScale oder focusRingMode).')
  return fehler.length ? { ok: false, fehler, daten: null, meta: istObjekt(meta) ? meta : null } : { ok: true, fehler: [], daten, meta }
}

/**
 * Vollstaendige Theme-Daten des Sets nach dem Import. Ein Theme-Export
 * beschreibt das ganze Theme: fehlende semantische Rollen, Foundation-Werte
 * und Markenfarben fallen auf die Werkseinstellung zurueck; Komponenten-
 * Overrides, Sperren, Versionen und Varianten werden ersetzt.
 * @param {object} daten     Ergebnis von pruefeThemeImport().daten
 * @param {object} vorgabe   { themes: {light, dark}, foundationOverrides, primitiveOverrides } — Werkseinstellung des Sets
 */
export function importZiel(daten, vorgabe) {
  const ziel = {}
  if (daten.themes) ziel.themes = { light: { ...vorgabe.themes.light, ...(daten.themes.light || {}) }, dark: { ...vorgabe.themes.dark, ...(daten.themes.dark || {}) } }
  if (daten.foundationOverrides) {
    ziel.foundationOverrides = {}
    for (const [kat, werte] of Object.entries(vorgabe.foundationOverrides)) ziel.foundationOverrides[kat] = { ...werte, ...(daten.foundationOverrides[kat] || {}) }
  }
  if (daten.primitiveOverrides) ziel.primitiveOverrides = { ...vorgabe.primitiveOverrides, ...daten.primitiveOverrides }
  for (const k of ['componentOverrides', 'componentLocks', 'componentVersions', 'variantDefinitions', 'typeScale', 'focusRingMode']) {
    if (daten[k] !== undefined) ziel[k] = JSON.parse(JSON.stringify(daten[k]))
  }
  return ziel
}

// Blaetter eines Objekts als Pfad -> Wert
function blaetter(o, pfad = '', out = new Map()) {
  if (istObjekt(o)) {
    for (const [k, v] of Object.entries(o)) blaetter(v, pfad ? `${pfad}.${k}` : k, out)
    if (!Object.keys(o).length && pfad) out.set(pfad, '{}')
  } else if (Array.isArray(o)) out.set(pfad, JSON.stringify(o))
  else out.set(pfad, o)
  return out
}

/**
 * Vorschau: je Bereich die Zahl der Aenderungen und bis zu drei Beispiele.
 * @returns {Array<{ schluessel, label, anzahl, beispiele: Array<{ pfad, alt, neu }> }>}
 */
export function importVorschau(ziel, aktuell) {
  const out = []
  for (const [k, neu] of Object.entries(ziel)) {
    const a = blaetter(aktuell[k] ?? (typeof neu === 'string' ? '' : {}), k === 'focusRingMode' ? 'focusRingMode' : '')
    const n = blaetter(neu, k === 'focusRingMode' ? 'focusRingMode' : '')
    const pfade = new Set([...a.keys(), ...n.keys()])
    const aenderungen = []
    for (const p of pfade) {
      if (String(a.get(p)) === String(n.get(p))) continue
      aenderungen.push({ pfad: p, alt: a.has(p) ? a.get(p) : null, neu: n.has(p) ? n.get(p) : null })
    }
    out.push({ schluessel: k, label: BEREICHE[k] || k, anzahl: aenderungen.length, beispiele: aenderungen.slice(0, 3) })
  }
  return out
}
