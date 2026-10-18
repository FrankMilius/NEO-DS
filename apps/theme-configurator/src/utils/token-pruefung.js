// @ts-check
// ==========================================================================
// Token-Werte prüfen (Befund UX-03, Usability-Audit 15.10.2026)
// ==========================================================================
// Vorher nahm der Store jeden Wert an: Radius „abc“, Opacity „halb“ (als
// NaN gespeichert), Schriftskala-Basis 50 mit Verhältnis 3 (9XL = 578704 px),
// Grid-Spalten 0 oder 40. Alles landete ohne Meldung im CSS.
//
// Die Art eines Tokens ergibt sich aus seinem Standardwert im Design
// System: Länge (px, rem …), Zahl, Farbe, Dauer, Seitenverhältnis. Dazu
// feste Bereiche, wo das DS sie vorgibt. Andere Werte (Schatten, Easing,
// Schriftstapel) prüft nur css-wert.js auf Ausbruch.
// Jede Funktion liefert eine Fehlermeldung für das Feld oder null.
// ==========================================================================

import { foundationTokens, componentTokenGroups } from '../data/tokens.js'
import { pruefeFontStack } from './css-wert.js'

const ZAHL = /^-?(\d+\.?\d*|\.\d+)$/
const LAENGE = /^-?(\d+\.?\d*|\.\d+)(px|rem|em|%|vw|vh|svh|dvh|vmin|vmax|ch|ex)$/
const DAUER = /^(\d+\.?\d*|\.\d+)(ms|s)$/
const VERHAELTNIS = /^(\d+\.?\d*)\s*\/\s*(\d+\.?\d*)$/
const FARBE = /^(#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})|(rgb|rgba|hsl|hsla|oklch|oklab|color-mix)\(.+\)|transparent|currentcolor)$/i
const FUNKTION = /^(var|calc|clamp|min|max)\(.+\)$/

/** Feste Bereiche aus dem Design System */
const BEREICHE = {
  opacity: { min: 0, max: 1, text: 'eine Zahl zwischen 0 und 1 (z. B. 0.5)' },
  zindex: { min: -1, max: 99999, ganz: true, text: 'eine ganze Zahl zwischen -1 und 99999' },
}
const KOMPONENTEN_BEREICHE = {
  'nc-grid-columns': { min: 1, max: 24, ganz: true, text: 'eine ganze Zahl zwischen 1 und 24' },
}
/** Schriftskala: Grenzen wie die Eingabefelder (TypographyEditor) */
export const SCHRIFTSKALA_BEREICHE = {
  base_min_px: { min: 10, max: 32, text: 'Basis bei kleinem Viewport: 10 bis 32 px' },
  base_max_px: { min: 10, max: 32, text: 'Basis bei großem Viewport: 10 bis 32 px' },
  ratio_min: { min: 1, max: 1.618, text: 'Verhältnis klein: 1 bis 1,618' },
  ratio_max: { min: 1, max: 1.618, text: 'Verhältnis groß: 1 bis 1,618' },
}

/** Art eines Werts aus dem Standardwert ableiten */
export function artVon (standard) {
  if (typeof standard === 'number') return 'zahl'
  const s = String(standard ?? '').trim()
  if (ZAHL.test(s)) return 'zahl'
  if (LAENGE.test(s) || s === '0') return 'laenge'
  if (DAUER.test(s)) return 'dauer'
  if (VERHAELTNIS.test(s)) return 'verhaeltnis'
  if (FARBE.test(s)) return 'farbe'
  return 'frei'
}

function pruefeArt (art, wert, bereich) {
  if (wert === null || wert === undefined || (typeof wert === 'number' && !Number.isFinite(wert))) {
    return art === 'zahl' ? `Bitte ${bereich?.text || 'eine Zahl'} eingeben.` : 'Bitte einen Wert eingeben.'
  }
  if (typeof wert !== 'string' && typeof wert !== 'number') return null
  const s = String(wert).trim()
  if (!s) return 'Bitte einen Wert eingeben.'
  if (FUNKTION.test(s) && art !== 'zahl') return null
  switch (art) {
    case 'zahl': {
      if (!ZAHL.test(s)) return `„${s}“ ist keine Zahl. Erwartet: ${bereich?.text || 'eine Zahl'}.`
      const n = Number(s)
      if (bereich && (n < bereich.min || n > bereich.max || (bereich.ganz && !Number.isInteger(n)))) return `Erwartet: ${bereich.text}.`
      return null
    }
    case 'laenge':
      return LAENGE.test(s) || s === '0' ? null : `„${s}“ ist keine Länge. Erwartet z. B. 8px, 0.5rem oder 2em.`
    case 'dauer':
      return DAUER.test(s) ? null : `„${s}“ ist keine Dauer. Erwartet z. B. 200ms oder 0.2s.`
    case 'verhaeltnis':
      return VERHAELTNIS.test(s) || s === 'auto' ? null : `„${s}“ ist kein Seitenverhältnis. Erwartet z. B. 16 / 9.`
    case 'farbe':
      return FARBE.test(s) ? null : `„${s}“ ist keine Farbe. Erwartet z. B. #1f6f3a.`
    default:
      return null
  }
}

/**
 * Foundation-Token prüfen.
 * @param {string} kategorie @param {string} schluessel @param {unknown} wert
 * @returns {string|null}
 */
export function pruefeFoundationWert (kategorie, schluessel, wert) {
  if (wert !== null && typeof wert === 'object') return null   // strukturierte Werte (z. B. Präsentation)
  if (kategorie === 'typography' && /^font-(body|heading|mono)$/.test(schluessel)) return typeof wert === 'string' ? pruefeFontStack(wert) : null
  if (kategorie === 'typography' && /^weight-/.test(schluessel)) return pruefeArt('zahl', wert, { min: 100, max: 900, text: 'ein Gewicht zwischen 100 und 900' })
  if (kategorie === 'focus' && /^color(-light|-dark)?$/.test(schluessel)) return pruefeArt('farbe', wert)
  const token = foundationTokens?.[kategorie]?.tokens?.[schluessel]
  if (token?.maps_to) {
    // Verweis auf einen Schlüssel der Zielskala (z. B. Elevation → Schatten „md“)
    return typeof wert === 'string' && /^[A-Za-z0-9_-]+$/.test(wert) ? null : `Erwartet: ein Schlüssel der Skala „${token.maps_to}“.`
  }
  const art = token ? artVon(token.value) : (kategorie === 'opacity' || kategorie === 'zindex' ? 'zahl' : 'frei')
  return pruefeArt(art, wert, BEREICHE[kategorie])
}

let komponentenTokens = null
function komponentenToken (id) {
  if (!komponentenTokens) {
    komponentenTokens = new Map()
    for (const g of componentTokenGroups || []) for (const tok of g.tokens || []) if (tok?.id) komponentenTokens.set(tok.id, tok)
  }
  return komponentenTokens.get(id)
}

const SCHLUESSELWORT = /^(inherit|initial|unset|revert|auto|none|normal)$/i

/** In Teile auf oberster Ebene zerlegen (Leerzeichen, nicht in Klammern). */
function teile (s) {
  const aus = []; let tiefe = 0; let aktuell = ''
  for (const z of s) {
    if (z === '(') tiefe++
    if (z === ')') tiefe = Math.max(0, tiefe - 1)
    if (/\s/.test(z) && tiefe === 0) { if (aktuell) aus.push(aktuell); aktuell = '' } else aktuell += z
  }
  if (aktuell) aus.push(aktuell)
  return aus
}

const TYP_ART = {
  color: 'farbe', size: 'laengen', spacing: 'laengen', radius: 'laengen', 'border-radius': 'laengen', 'font-size': 'laengen',
  number: 'zahl', opacity: 'deckkraft', duration: 'dauer', time: 'dauer', fontWeight: 'gewicht', 'font-weight': 'gewicht', weight: 'gewicht',
}

/** Komponenten-Token prüfen (nach Typ der Token-Liste, sonst nach Standardwert). */
export function pruefeKomponentenWert (tokenId, wert) {
  const bereich = KOMPONENTEN_BEREICHE[tokenId]
  if (bereich) return pruefeArt('zahl', wert, bereich)
  const tok = komponentenToken(tokenId)
  if (!tok) return null
  if (wert === null || wert === undefined || (typeof wert === 'number' && !Number.isFinite(wert))) return 'Bitte einen Wert eingeben.'
  if (typeof wert !== 'string' && typeof wert !== 'number') return null
  const s = String(wert).trim()
  if (!s) return 'Bitte einen Wert eingeben.'
  if (SCHLUESSELWORT.test(s) || FUNKTION.test(s)) return null
  const art = TYP_ART[tok.type] || (tok.default !== undefined ? artVon(tok.default) : 'frei')
  switch (art) {
    case 'farbe': return FARBE.test(s) ? null : `„${s}“ ist keine Farbe. Erwartet z. B. #1f6f3a oder var(--fnd-color-…).`
    case 'laengen':
    case 'laenge': {
      const falsch = teile(s).find(x => !(LAENGE.test(x) || x === '0' || FUNKTION.test(x) || SCHLUESSELWORT.test(x)))
      return falsch ? `„${falsch}“ ist keine Länge. Erwartet z. B. 8px, 0.5rem oder var(--fnd-spacing-04).` : null
    }
    case 'zahl': return ZAHL.test(s) ? null : `„${s}“ ist keine Zahl.`
    case 'deckkraft': {
      if (/^\d+(\.\d+)?%$/.test(s)) return Number(s.slice(0, -1)) <= 100 ? null : 'Erwartet: 0 bis 100 %.'
      return ZAHL.test(s) && Number(s) >= 0 && Number(s) <= 1 ? null : 'Erwartet: eine Zahl zwischen 0 und 1 (z. B. 0.5).'
    }
    case 'dauer': return DAUER.test(s) ? null : `„${s}“ ist keine Dauer. Erwartet z. B. 200ms oder 0.2s.`
    case 'gewicht': return /^(bold|bolder|lighter)$/i.test(s) || (ZAHL.test(s) && Number(s) >= 1 && Number(s) <= 1000) ? null : 'Erwartet: ein Gewicht zwischen 100 und 900.'
    default: return null
  }
}

/**
 * HEX-Eingabe normalisieren (UX-21): „f00“, „#F00“, „ff0000“ → „#ff0000“.
 * @param {unknown} text
 * @returns {string|null}  null = keine HEX-Farbe
 */
export function normalisiereHex (text) {
  const t = String(text ?? '').trim().replace(/^#/, '').toLowerCase()
  if (/^[0-9a-f]{3}$/.test(t)) return '#' + t.split('').map(z => z + z).join('')
  if (/^[0-9a-f]{6}$/.test(t)) return '#' + t
  return null
}
export const HEX_MELDUNG = (text) => `„${String(text ?? '').trim()}“ ist keine HEX-Farbe. Erwartet z. B. #1f6f3a oder #1f3.`

/** Semantische Farbe prüfen. */
export function pruefeFarbe (wert) {
  return pruefeArt('farbe', wert)
}

/**
 * Schriftskala prüfen, einschließlich Min ≤ Max gegen den anderen Wert.
 * @param {string} schluessel @param {unknown} wert @param {Record<string, number>} aktuell  wirksame Werte
 */
export function pruefeSchriftskala (schluessel, wert, aktuell = {}) {
  const b = SCHRIFTSKALA_BEREICHE[schluessel]
  if (!b) return null
  const f = pruefeArt('zahl', wert, b)
  if (f) return f
  const n = Number(wert)
  const paar = { base_min_px: ['base_max_px', '≤'], base_max_px: ['base_min_px', '≥'], ratio_min: ['ratio_max', '≤'], ratio_max: ['ratio_min', '≥'] }[schluessel]
  const anderer = aktuell[paar[0]]
  if (Number.isFinite(anderer) && ((paar[1] === '≤' && n > anderer) || (paar[1] === '≥' && n < anderer))) {
    return paar[1] === '≤' ? `Muss kleiner oder gleich dem Wert für den großen Viewport sein (${anderer}).` : `Muss größer oder gleich dem Wert für den kleinen Viewport sein (${anderer}).`
  }
  return null
}
