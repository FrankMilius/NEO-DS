// @ts-check
/**
 * @file
 * Tokens-Studio-Export (Roadmap R08, 20.10.2026)
 * ==========================================================================
 * Wandelt den DTCG-Export (data/design-tokens.dtcg.json, packages/dtcg-export)
 * in eine Datei für das Figma-Plugin „Tokens Studio“: Token-Sets plus
 * $themes und $metadata, Werte als Text im Tokens-Studio-Format
 * („value“/„type“, Verweise {pfad.zum.token} wie im DTCG-Export).
 *
 * SETS UND THEMEN
 *   primitives, foundation, semantic, components   Werte des hellen NEO-Themes
 *   semantic-dunkel, components-dunkel             nur die Dunkel-Werte; später
 *                                                  in der Reihenfolge, gewinnen
 *   $themes: „NEO Hell“ und „NEO Dunkel“. Die Variante „Kunde“ fehlt bewusst —
 *   sie gibt es nur im lokalen Betrieb (Entscheidung E3), nicht auf der Website.
 *
 * GRUNDLAGEN: nur foundation._configurator (die Werte hinter den
 * CSS-Variablen --fnd-*, die der Konfigurator bearbeitet), eine Ebene höher
 * gehoben: {foundation._configurator.spacing.05} → {foundation.spacing.05}.
 * Die übrigen Gruppen unter foundation sind Quelldaten und Konfiguration
 * (Viewport-Parameter, Zuordnungen, Skalen-Schlüssel) — für Figma Rauschen.
 * Aufgenommen wird von dort nur, worauf ein Token verweist (auch über
 * Ketten), unter seinem Pfad (z. B. foundation.typography.paragraph.m.font_size).
 * Treffen zwei Pfade aufeinander, bricht der Export ab.
 *
 * WERTE
 *   Farbe {hex, alpha}        → "#rrggbb" bzw. "#rrggbbaa"
 *   Maß/Dauer {value, unit}   → "16px", "0.2s"
 *   Schatten "0 1px 2px rgba(…)" → boxShadow-Objekt (mehrere: Liste)
 *   CSS, das Figma nicht kennt (var(…) var(…), repeat(…), clamp(…)) bleibt
 *   Text mit type „other“ — nichts geht verloren, nichts wird erfunden.
 *
 * Reines ESM ohne Dateizugriff: scripts/export-tokens-studio.cjs liest und
 * schreibt, die Tests prüfen die Abbildung direkt.
 * ==========================================================================
 */

/** Tokens-Studio-Typen, die dieser Export erzeugt */
export const TYPEN = Object.freeze([
  'color', 'spacing', 'sizing', 'dimension', 'borderRadius', 'borderWidth',
  'fontSizes', 'fontWeights', 'fontFamilies', 'lineHeights', 'letterSpacing',
  'opacity', 'boxShadow', 'number', 'other',
])

export const SETS = Object.freeze(['primitives', 'foundation', 'semantic', 'semantic-dunkel', 'components', 'components-dunkel'])

const NS = 'de.neocosmo'
const ALIAS = /^\{([^{}]+)\}$/
const ALIAS_GLOBAL = /\{([^{}]+)\}/g

/** {foundation._configurator.x} → {foundation.x} — auch in Verweisen */
export function pfadUmschreiben (pfad) {
  return pfad.startsWith('foundation._configurator.') ? 'foundation.' + pfad.slice('foundation._configurator.'.length) : pfad
}
const verweiseUmschreiben = (s) => s.replace(ALIAS_GLOBAL, (_, p) => `{${pfadUmschreiben(p)}}`)

/** Schriftrollen: var(--font-body|heading|mono|ui) → Verweis auf die Rolle (20.10.2026) */
const SCHRIFTROLLE = /^var\(--font-(body|heading|mono|ui)\)$/
export function schriftrolle (wert) {
  const m = typeof wert === 'string' && wert.trim().match(SCHRIFTROLLE)
  return m ? `{foundation.typography.font-${m[1]}}` : null
}

const zahl = (n) => String(Math.round(n * 10000) / 10000)

/** Verweise {pfad} in einem Wert — nur in Textfeldern, auch in Schatten-Objekten */
export function verweiseIn (wert) {
  if (typeof wert === 'string') return [...wert.matchAll(ALIAS_GLOBAL)].map((m) => m[1])
  if (wert && typeof wert === 'object') return Object.values(wert).flatMap(verweiseIn)
  return []
}

/** DTCG-Farbe → Hex (mit Alpha als achtstellig) */
export function farbe (wert) {
  if (typeof wert === 'string') return verweiseUmschreiben(wert)
  if (!wert || typeof wert !== 'object') return String(wert)
  let hex = wert.hex
  if (!hex && Array.isArray(wert.components)) {
    hex = '#' + wert.components.map((c) => Math.round(c * 255).toString(16).padStart(2, '0')).join('')
  }
  const a = typeof wert.alpha === 'number' ? wert.alpha : 1
  return a < 1 ? hex + Math.round(a * 255).toString(16).padStart(2, '0') : hex
}

/** DTCG-Maß/-Dauer {value, unit} → "16px"; Text bleibt (Verweise umgeschrieben) */
export function mass (wert) {
  if (wert && typeof wert === 'object' && 'value' in wert) return `${zahl(wert.value)}${wert.unit}`
  if (typeof wert === 'number') return zahl(wert)
  return verweiseUmschreiben(String(wert))
}

/**
 * CSS-Schatten → boxShadow von Tokens Studio, oder null, wenn nicht eindeutig.
 * @param {string} css
 */
export function schatten (css) {
  if (typeof css !== 'string' || /var\(|calc\(/.test(css)) return null
  const teile = []
  let tiefe = 0, start = 0
  for (let i = 0; i <= css.length; i++) {
    const z = css[i]
    if (z === '(') tiefe++
    if (z === ')') tiefe--
    if ((z === ',' && tiefe === 0) || i === css.length) { teile.push(css.slice(start, i).trim()); start = i + 1 }
  }
  const aus = []
  for (const t of teile) {
    const innen = /^inset\s+/.test(t)
    const rest = t.replace(/^inset\s+/, '')
    const m = rest.match(/^(-?[\d.]+(?:px)?)\s+(-?[\d.]+(?:px)?)\s+(-?[\d.]+(?:px)?)(?:\s+(-?[\d.]+(?:px)?))?\s+(.+)$/)
    if (!m) return null
    const px = (v) => (v === undefined ? '0' : v.replace(/px$/, ''))
    aus.push({ x: px(m[1]), y: px(m[2]), blur: px(m[3]), spread: px(m[4]), color: m[5].trim(), type: innen ? 'innerShadow' : 'dropShadow' })
  }
  return aus.length === 1 ? aus[0] : aus
}

/** Tokens-Studio-Typ aus DTCG-Typ, Pfad und CSS-Art des Konfigurators */
export function typVon (dtcgTyp, pfad, cssType, wert) {
  const p = pfad.join('.').toLowerCase()
  const name = pfad[pfad.length - 1].toLowerCase()
  if (dtcgTyp === 'color' || cssType === 'color') return 'color'
  if (/(^|\.)(shadow|elevation)(\.|$)|shadow$/.test(p) && typeof wert === 'string' && !ALIAS.test(wert)) return schatten(wert) ? 'boxShadow' : 'other'
  if (/font-body|font-heading|font-mono|font-ui|fonts?$|family$/.test(name) || /typography\.font-(body|heading|mono|ui)/.test(p)) return 'fontFamilies'
  if (/weight/.test(name)) return 'fontWeights'
  if (/line[-_]height/.test(p)) return 'lineHeights'
  if (/tracking|letter[-_]spacing/.test(p)) return 'letterSpacing'
  if (/opacity/.test(p)) return 'opacity'
  if (dtcgTyp === 'duration' || cssType === 'duration') return 'other'
  if (dtcgTyp === 'dimension' || ['size', 'spacing', 'border-radius', 'font-size'].includes(cssType)) {
    if (cssType === 'font-size' || /font[-_]size|semantic_sizes/.test(p)) return 'fontSizes'
    if (cssType === 'border-radius' || /radius|radii/.test(p)) return 'borderRadius'
    if (/border[-.]width|width-(null|xs|sm|md|lg|xl)|outline-width|ring-width/.test(p)) return 'borderWidth'
    if (cssType === 'spacing' || /spacing|gap|padding|margin|offset|inset/.test(p)) return 'spacing'
    if (/size|height|width|min|max/.test(name) || cssType === 'size') return 'sizing'
    return 'dimension'
  }
  if (dtcgTyp === 'number' || typeof wert === 'number') return 'number'
  if (typeof wert === 'string' && /^-?\d+(\.\d+)?$/.test(wert.trim())) return 'number'
  return null   // aus dem Verweis bestimmen oder „other“
}

/** Ist der Text ein Wert, den Tokens Studio für den Typ versteht? */
function verstaendlich (typ, wert) {
  if (typeof wert !== 'string') return true
  if (ALIAS.test(wert)) return true
  if (/var\(|repeat\(|minmax\(|clamp\(|calc\(|min\(|max\(|\s/.test(wert) && typ !== 'fontFamilies' && typ !== 'boxShadow') return false
  return true
}

/**
 * DTCG → Tokens Studio.
 * @param {Record<string, any>} dtcg  Inhalt von data/design-tokens.dtcg.json
 * @returns {{ datei: Record<string, any>, bericht: { anzahl: Record<string, number>, typen: Record<string, number>, andere: number, offen: string[], dunkel: number } }}
 */
export function alsTokensStudio (dtcg) {
  /** @type {Record<string, Record<string, any>>} */
  const sets = Object.fromEntries(SETS.map((s) => [s, {}]))
  /** @type {{ set: string, pfad: string[], token: Record<string, any>, verweis: string|null }[]} */
  const liste = []

  const setze = (set, pfad, token) => {
    let o = sets[set]
    for (const k of pfad.slice(0, -1)) {
      o = o[k] ||= {}
      if ('value' in o && 'type' in o) throw new Error(`Pfad-Kollision in ${set}: ${pfad.join('.')} liegt unter einem Token`)
    }
    const blatt = pfad[pfad.length - 1]
    if (o[blatt]) throw new Error(`Pfad-Kollision in ${set}: ${pfad.join('.')} doppelt`)
    o[blatt] = token
  }
  /** Grundlagen außerhalb von _configurator: nur bei Bedarf (Verweis) */
  const reserve = new Map()

  const lauf = (knoten, pfad, typ) => {
    const t = knoten.$type || typ
    for (const [k, v] of Object.entries(knoten)) {
      if (k.startsWith('$') || !v || typeof v !== 'object') continue
      const unter = [...pfad, k]
      if (!('$value' in v)) { lauf(v, unter, t); continue }
      const oben = unter[0]
      let ziel = unter
      if (oben === 'foundation') {
        if (unter[1] !== '_configurator') { reserve.set(unter.join('.'), { v, t }); continue }
        ziel = ['foundation', ...unter.slice(2)]
      }
      aufnehmen(v, t, ziel, oben === 'foundation' ? 'foundation' : oben)
    }
  }
  const aufnehmen = (v, t, ziel, set) => {
      const ext = v.$extensions?.[NS] || {}
      const eintrag = (wert, setName) => {
        const dt = v.$type || t
        let typ = typVon(dt, ziel, ext.cssType, wert)
        let value
        const rolle = schriftrolle(wert)
        if (rolle) { value = rolle; typ = 'fontFamilies' }
        else if (dt === 'color' || typ === 'color') value = farbe(wert)
        else if (typ === 'boxShadow') value = schatten(wert)
        else value = mass(wert)
        const verweis = typeof value === 'string' && ALIAS.test(value) ? value.slice(1, -1) : null
        if (typ && typ !== 'boxShadow' && !verstaendlich(typ, value)) typ = 'other'
        const token = { value, type: typ }
        if (ext.label) token.description = ext.label
        liste.push({ set: setName, pfad: ziel, token, verweis })
        setze(setName, ziel, token)
      }
      eintrag(v.$value, set)
      // Modus-Wert direkt oder — bei aufgelösten Mischungen — als {$value, css}
      const roh = ext.modes?.['neo-dark']
      const dunkel = roh && typeof roh === 'object' && '$value' in roh ? roh.$value : roh
      if (dunkel !== undefined && (set === 'semantic' || set === 'components')) eintrag(dunkel, `${set}-dunkel`)
  }
  lauf(dtcg, [], undefined)

  // Verweise auf Grundlagen außerhalb von _configurator nachziehen (Ketten)
  const vorhanden = new Set(liste.map((e) => e.pfad.join('.')))
  for (let i = 0; i < liste.length; i++) {
    for (const ziel of verweiseIn(liste[i].token.value)) {
      const r = reserve.get(ziel)
      if (r && !vorhanden.has(ziel)) { vorhanden.add(ziel); aufnehmen(r.v, r.t, ziel.split('.'), 'foundation') }
    }
  }

  // Typ offener Tokens aus dem Verweisziel (Kette) bestimmen, sonst „other“
  const index = new Map()
  for (const e of liste) if (!e.set.endsWith('-dunkel')) index.set(e.pfad.join('.'), e)
  const zielTyp = (e, tiefe = 0) => {
    if (e.token.type) return e.token.type
    if (!e.verweis || tiefe > 20) return 'other'
    const z = index.get(e.verweis)
    return z ? zielTyp(z, tiefe + 1) : 'other'
  }
  for (const e of liste) if (!e.token.type) e.token.type = zielTyp(e)

  // Bericht: Verweise müssen in den Sets des jeweiligen Themas auflösbar sein
  const offen = []
  for (const e of liste) {
    for (const ziel of verweiseIn(e.token.value)) if (!index.has(ziel)) offen.push(`${e.set}: ${e.pfad.join('.')} → {${ziel}}`)
  }
  const anzahl = Object.fromEntries(SETS.map((s) => [s, liste.filter((e) => e.set === s).length]))
  const typen = {}
  for (const e of liste) typen[e.token.type] = (typen[e.token.type] || 0) + 1

  const alle = (zusatz) => Object.fromEntries(SETS.map((s) => [s, s.endsWith('-dunkel') ? (zusatz ? 'enabled' : 'disabled') : 'enabled']))
  const datei = {
    ...sets,
    $themes: [
      { id: 'neo-hell', name: 'NEO Hell', group: 'NEO', selectedTokenSets: alle(false) },
      { id: 'neo-dunkel', name: 'NEO Dunkel', group: 'NEO', selectedTokenSets: alle(true) },
    ],
    $metadata: { tokenSetOrder: [...SETS] },
  }
  return { datei, bericht: { anzahl, typen, andere: typen.other || 0, offen, dunkel: anzahl['semantic-dunkel'] + anzahl['components-dunkel'] } }
}
