// @ts-check
// ==========================================================================
// Farbskalen der Haupt-Paletten (Primary, Secondary, Accent)
// ==========================================================================
// Eine Rechnung für Anzeige, Mitziehen der semantischen Farben und Export
// (Befund Frank 15.10.2026: Paletten im Kunden-Theme übernehmen und ändern).
//
// - NEO-Vorgabe: die handgepflegten Leitern aus dem Design System
//   (primitiveColors[id].shades — Graphit bzw. Lime, 11 Stufen).
// - Eigene Basisfarbe: erzeugte Skala wie fn.generate-shade-scale() in
//   scss/scss/00-settings/_color-functions.scss (unter 500 mit Weiß, über
//   500 mit Schwarz gemischt) — in 5-%-Schritten (19 Stufen), die Website
//   nutzt davon die 11 Stufen 50, 100 … 900, 950.
// ==========================================================================

import { primitiveColors } from '../data/tokens.js'

/** 5-%-Schritte der App (Anzeige, Auswahl im Farbwähler) */
export const SKALEN_STUFEN = [50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900, 950]

/** Stufen, die die Website als CSS-Variablen kennt (--fnd-accent-*, --fnd-neutral-*) */
export const WEBSITE_STUFEN = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

/**
 * Wohin eine Haupt-Palette auf der Website wirkt. Die NEO-Website ist
 * monochrom: Flächen und Text kommen aus der Graphit-Leiter (--fnd-neutral-*,
 * = Primary), der Akzent aus --fnd-accent-*. Secondary ist vorerst gleich
 * Primary und hat auf der Website keine eigenen Variablen.
 */
export const PALETTEN_ZIEL = {
  primary: { variable: '--fnd-neutral', selektor: ':root, .neo-light-theme, .neo-dark-theme, .neo-mono-light, .neo-mono-dark' },
  accent: { variable: '--fnd-accent', selektor: ':root, .neo-light-theme, .neo-dark-theme, .neo-mono-light, .neo-mono-dark' },
}

/** Paletten, deren Änderung semantische Farben mitzieht (Secondary = Primary, daher nicht). */
export const MITZIEHENDE_PALETTEN = ['primary', 'accent']

function hexZuRgb (hex) {
  let h = String(hex).replace('#', '')
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2]
  const n = parseInt(h, 16)
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}

function rgbZuHex (r, g, b) {
  return '#' + [r, g, b].map(c => Math.round(Math.min(255, Math.max(0, c))).toString(16).padStart(2, '0')).join('')
}

function mische (a, b, anteil) {
  return { r: a.r + (b.r - a.r) * anteil, g: a.g + (b.g - a.g) * anteil, b: a.b + (b.b - a.b) * anteil }
}

/**
 * Erzeugte Skala aus einer Basisfarbe (= Stufe 500).
 * @param {string} basis  #rrggbb
 * @returns {Record<number, string>}
 */
export function erzeugeSkala (basis) {
  const b = hexZuRgb(basis)
  /** @type {Record<number, string>} */
  const aus = {}
  for (const stufe of SKALEN_STUFEN) {
    if (stufe === 500) { aus[stufe] = String(basis).toLowerCase(); continue }
    const c = stufe < 500
      ? mische(b, { r: 255, g: 255, b: 255 }, (500 - stufe) / 500)
      : mische(b, { r: 0, g: 0, b: 0 }, (stufe - 500) / 500)
    aus[stufe] = rgbZuHex(c.r, c.g, c.b)
  }
  return aus
}

/** Ist das die Vorgabe des Design Systems (dann gilt die Leiter)? */
export function istVorgabe (id, basis) {
  const p = primitiveColors?.[id]
  return !!p && String(p.base).toLowerCase() === String(basis || p.base).toLowerCase()
}

/**
 * Wirksame Skala einer Haupt-Palette: Leiter bei NEO-Vorgabe, sonst erzeugt.
 * @param {string} id  primary | secondary | accent
 * @param {string} [basis]
 * @returns {Record<number, string>}
 */
export function paletteSkala (id, basis) {
  const p = primitiveColors?.[id]
  if (p?.shades && istVorgabe(id, basis)) {
    return Object.fromEntries(Object.entries(p.shades).map(([s, f]) => [Number(s), String(f).toLowerCase()]))
  }
  return erzeugeSkala(basis || p?.base || '#808080')
}

/**
 * Semantische Farben eines Modus mitziehen: Werte, die einer Stufe der alten
 * Skala entsprechen, bekommen dieselbe Stufe der neuen Skala. Eigene Werte
 * (keine Stufe der Palette) bleiben unberührt.
 * @param {Record<string, string>} tokens   themes[set][modus], wird verändert
 * @param {Record<number, string>} alt
 * @param {Record<number, string>} neu
 * @returns {string[]}  geänderte Token-Namen
 */
export function zieheMit (tokens, alt, neu) {
  const stufeVon = new Map(Object.entries(alt).map(([s, f]) => [String(f).toLowerCase(), Number(s)]))
  const geaendert = []
  for (const [token, wert] of Object.entries(tokens || {})) {
    const stufe = stufeVon.get(String(wert).toLowerCase())
    if (stufe !== undefined && neu[stufe] && neu[stufe] !== String(wert).toLowerCase()) {
      tokens[token] = neu[stufe]
      geaendert.push(token)
    }
  }
  return geaendert
}

/**
 * CSS-Zeilen für geänderte Haupt-Paletten (nur, was von der Vorgabe abweicht).
 * @param {Record<string, string>} primitives  primitiveOverrides[set]
 * @returns {string[]}
 */
export function palettenCss (primitives) {
  const zeilen = []
  for (const [id, ziel] of Object.entries(PALETTEN_ZIEL)) {
    const basis = primitives?.[id]
    if (!basis || istVorgabe(id, basis)) continue
    const skala = erzeugeSkala(basis)
    zeilen.push(`/* === Palette ${primitiveColors?.[id]?.label || id}: ${basis} === */`)
    zeilen.push(`${ziel.selektor} {`)
    for (const stufe of WEBSITE_STUFEN) zeilen.push(`  ${ziel.variable}-${stufe}: ${skala[stufe]};`)
    zeilen.push('}', '')
  }
  return zeilen
}
