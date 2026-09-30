// ==========================================================================
// DTCG-Export aus dem Theme-Konfigurator (Plan v2, 2.2)
// ==========================================================================
// Die App wendet die Theme-Aenderungen des aktiven Theme-Sets auf die
// Token-Quelle (data/design-tokens.json) an und schickt das Ergebnis durch
// DENSELBEN Exporter wie scripts/export-dtcg.cjs (packages/dtcg-export).
// Unveraendertes NEO-Theme => byte-identisch mit data/design-tokens.dtcg.json.
//
// Abbildung (Theme-Daten -> Quelle)
//   themes[set].light/dark       -> semantic.references + semantic.defaults
//                                   (neo-* bzw. customer-*), nur Abweichungen
//   foundationOverrides[set]     -> foundation._configurator.<kat>.tokens.<key>.value
//   componentOverrides[set]      -> components.groups[].tokens[].default (ref entfaellt)
//   primitiveOverrides[set]      -> primitives.brand.<palette>.base
//   typeScale[set]               -> foundation.typography.fluid + semantic_sizes_px
// Was sich nicht sauber abbilden laesst, geht NICHT still verloren: es steht
// in der Hinweisliste (Export-Dialog) und in
// $extensions["de.neocosmo"].themeExport.nichtAbgebildet.
// ==========================================================================

import { erzeugeDtcg } from 'dtcg-export'
import { berechneSkala, skalenParameter } from '../utils/fluid-scale.js'
import { THEME_DATA_KEYS } from '../stores/theme/verlauf.js'
import { foundationTokens, typographyScale } from '../data/tokens.js'

const klon = (o) => JSON.parse(JSON.stringify(o))
const gleich = (a, b) => String(a).trim().toLowerCase() === String(b).trim().toLowerCase()
const rund3 = (x) => Math.round(x * 1000) / 1000

// Werkseinstellungen der Icon-Striche (wie resetToDefaults in stores/theme/verlauf.js)
const ICON_STRICH = {
  tabler: { xs: '1', sm: '1.5', md: '1.5', lg: '2', xl: '2', '2xl': '2' },
  heroicons: { xs: '1.5', sm: '1.5', md: '1.5', lg: '1.5', xl: '1.5', '2xl': '1.5' },
}
const leer = (o) => !o || (Array.isArray(o) ? o.length === 0 : Object.keys(o).length === 0)

/** Quelle (design-tokens.json) und styles.css erst bei Bedarf laden. */
export async function ladeDtcgGrundlagen() {
  const [quelle, css] = await Promise.all([
    import('../../../../data/design-tokens.json').then((m) => m.default),
    import('../../../../styles.css?raw').then((m) => m.default),
  ])
  return { quelle, stylesCss: css, foundationTokens, typographyScale }
}

/**
 * Theme-Daten eines Sets auf eine Kopie der Quelle anwenden.
 * @param {object} quelle      data/design-tokens.json (wird nicht veraendert)
 * @param {object} daten       { themes, foundationOverrides, componentOverrides,
 *                               primitiveOverrides, typeScale, … } eines Sets
 *                               (flach: daten.themes = { light, dark })
 * @param {object} opt         { themeSet: 'neo'|'customer', semanticDefaults, typographyScale }
 * @returns {{ quelle, uebernommen: object, hinweise: string[] }}
 */
export function themeAufQuelle(quelle, daten, opt = {}) {
  const q = klon(quelle)
  const set = opt.themeSet === 'customer' ? 'customer' : 'neo'
  const uebernommen = { semantik: 0, foundation: 0, komponenten: 0, primitives: 0, schriftskala: 0 }
  const hinweise = []

  // ── Semantik ────────────────────────────────────────────────────────────
  for (const modus of ['light', 'dark']) {
    const th = `${set}-${modus}`
    const werte = daten.themes?.[modus] || {}
    const vorgabe = opt.semanticDefaults?.[th] ?? q.semantic.defaults?.[th] ?? {}
    const bekannt = new Set([...Object.keys(q.semantic.references[th] || {}), ...q.semantic.groups.flatMap((g) => g.tokens.map((t) => t.id))])
    for (const [id, wert] of Object.entries(werte)) {
      if (vorgabe[id] !== undefined && gleich(vorgabe[id], wert)) continue
      if (!bekannt.has(id)) { hinweise.push(`Semantik ${th}: Rolle „${id}“ gibt es in der Quelle nicht`); continue }
      ;(q.semantic.references[th] ??= {})[id] = wert
      ;(q.semantic.defaults[th] ??= {})[id] = wert
      uebernommen.semantik++
    }
  }

  // ── Foundation (Konfigurator-Sicht) ─────────────────────────────────────
  const kon = q.foundation._configurator || {}
  for (const [kat, werte] of Object.entries(daten.foundationOverrides || {})) {
    for (const [key, wert] of Object.entries(werte || {})) {
      const t = kon[kat]?.tokens?.[key]
      if (!t) { hinweise.push(`Foundation: „${kat}.${key}“ gibt es in der Quelle nicht`); continue }
      if (String(t.value) === String(wert)) continue
      t.value = wert
      uebernommen.foundation++
    }
  }
  if (uebernommen.foundation) {
    hinweise.push('Foundation-Änderungen stehen in foundation._configurator; die kanonischen Pfade (foundation.spacing, foundation.radii …) behalten den Quellstand')
  }

  // ── Komponenten ─────────────────────────────────────────────────────────
  const komp = new Map()
  for (const g of q.components.groups) for (const t of g.tokens) komp.set(t.id, t)
  for (const [id, wert] of Object.entries(daten.componentOverrides || {})) {
    const t = komp.get(id)
    if (!t) { hinweise.push(`Komponente: Token „${id}“ gibt es in der Quelle nicht`); continue }
    if (t.ref === undefined && t.default !== undefined && gleich(t.default, wert)) continue
    t.default = wert
    delete t.ref
    uebernommen.komponenten++
  }

  // ── Primitives (Markenfarben) ───────────────────────────────────────────
  for (const [palette, wert] of Object.entries(daten.primitiveOverrides || {})) {
    const p = q.primitives.brand?.[palette]
    if (!p) { hinweise.push(`Primitive: Palette „${palette}“ gibt es in der Quelle nicht`); continue }
    if (gleich(p.base, wert)) continue
    p.base = wert
    uebernommen.primitives++
    hinweise.push(`Primitive „${palette}“: nur der Grundton ist übernommen — die Stufen (shades) behalten den Quellstand, die Vorschau-Leiter der App wird nicht exportiert`)
  }

  // ── Fluide Schriftskala ─────────────────────────────────────────────────
  const skala = daten.typeScale || {}
  if (!leer(skala)) {
    const fluid = q.foundation.typography.fluid
    for (const [k, v] of Object.entries(skala)) {
      if (!(k in fluid)) { hinweise.push(`Schriftskala: Parameter „${k}“ unbekannt`); continue }
      if (Number(fluid[k]) === Number(v)) continue
      fluid[k] = Number(v)
      uebernommen.schriftskala++
    }
    if (uebernommen.schriftskala) {
      const basis = opt.typographyScale ?? q.foundation.typography
      const stufen = berechneSkala(skalenParameter(basis, skala))
      const px = q.foundation.typography.semantic_sizes_px
      if (px) for (const s of stufen) if (px[s.stufe]) px[s.stufe] = { min: rund3(s.minPx), max: rund3(s.maxPx) }
    }
  }

  // ── Nicht abbildbar ─────────────────────────────────────────────────────
  const n = (o) => (Array.isArray(o) ? o.length : Object.keys(o || {}).length)
  if (!leer(daten.customFonts)) hinweise.push(`Eigene Schriften (${n(daten.customFonts)}) — die Quelle kennt keine Webfont-Einbindung`)
  if (daten.focusRingMode && daten.focusRingMode !== 'offset') hinweise.push(`Fokusring-Modus „${daten.focusRingMode}“ — kein Token in der Quelle`)
  if (!leer(daten.variantDefinitions)) hinweise.push(`Eigene Varianten (${n(daten.variantDefinitions)} Komponenten) — Modifier-Klassen sind kein Token`)
  for (const k of ['customSpacingTokens', 'customRadiiTokens', 'customBorderWidthTokens', 'customMediaRatioTokens', 'customShadowTokens', 'customElevationTokens', 'customOpacityTokens', 'customZindexTokens', 'customMotionTokens', 'customMotionEffectTokens']) {
    if (!leer(daten[k])) hinweise.push(`Eigene Tokens ${k.replace(/^custom|Tokens$/g, '')} (${n(daten[k])}) — neue Tokens werden nicht in die Quelle geschrieben`)
  }
  if (!leer(daten.semanticSpacing)) hinweise.push(`Semantische Abstände (${n(daten.semanticSpacing)}) — nicht in der Quelle abgebildet`)
  if (!leer(daten.semanticTypography)) hinweise.push(`Semantische Typografie (${n(daten.semanticTypography)}) — nicht in der Quelle abgebildet`)
  if ((daten.iconLibraries || []).some((l) => !l.builtIn)) hinweise.push('Eigene Icon-Bibliotheken — nicht in der Quelle abgebildet')
  for (const [lib, stufen] of Object.entries(daten.iconStrokeWidths || {})) {
    if (JSON.stringify(stufen) !== JSON.stringify(ICON_STRICH[lib] ?? stufen)) hinweise.push(`Icon-Strichstärken (${lib}) — nicht in der Quelle abgebildet`)
  }
  for (const [lib, farben] of Object.entries(daten.iconStrokeColors || {})) {
    if (Object.values(farben || {}).some((f) => f !== 'currentColor')) hinweise.push(`Icon-Strichfarben (${lib}) — nicht in der Quelle abgebildet`)
  }

  return { quelle: q, uebernommen, hinweise }
}

/** Theme-Daten eines Sets aus dem Store-State herausziehen (Schluessel aus THEME_DATA_KEYS). */
export function themeDatenAusState(state, themeSet = state.activeThemeSet) {
  const daten = {}
  for (const k of THEME_DATA_KEYS) if (state[k] && themeSet in state[k]) daten[k] = state[k][themeSet]
  return daten
}

/**
 * DTCG-Text fuer ein Theme erzeugen.
 * @returns {{ text, hinweise, uebernommen, zusammenfassung }}
 */
export function erzeugeThemeDtcg(grundlagen, daten, opt = {}) {
  const { quelle, uebernommen, hinweise } = themeAufQuelle(grundlagen.quelle, daten, { ...opt, typographyScale: grundlagen.typographyScale })
  const geaendert = Object.values(uebernommen).some(Boolean) || hinweise.length > 0
  const extensions = geaendert
    ? { themeExport: { name: opt.name ?? null, themeSet: opt.themeSet ?? 'neo', uebernommen, nichtAbgebildet: hinweise } }
    : undefined
  const { text, zusammenfassung } = erzeugeDtcg(quelle, {
    foundationTokens: grundlagen.foundationTokens,
    stylesCss: grundlagen.stylesCss,
    basis: grundlagen.quelle,
    extensions,
  })
  return { text, hinweise, uebernommen, zusammenfassung }
}
