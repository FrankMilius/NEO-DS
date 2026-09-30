// Verweise der Folien-Grammatik aufloesen (Plan v2, 2.5)
// ==========================================================================
// foundation.praesentation schreibt Farben als "palette.stufe" ("lime.500",
// "forest.800", "success.600"). Dieselbe Aufloesung wie farbe() in
// scripts/pptx-vorlage.mjs: zuerst die Leitern (Papiere, Forest, Lime),
// dann Reserve-, System-, Foundation- und Markenpaletten.
//   Hex bleibt Hex, Listen werden elementweise aufgeloest,
//   Unbekanntes ergibt null (mit Warnung).

import {
  paperLadders, supportingPalettes, systemPalettes, foundationPalettes, primitiveColors
} from '../data/tokens.generated.js'

const QUELLEN = [paperLadders, supportingPalettes, systemPalettes, foundationPalettes, primitiveColors]

/** Palettenname → Stufen ({ '100': '#…' }), in Aufloesungsreihenfolge. */
export const PALETTEN = (() => {
  const karte = new Map()
  for (const quelle of QUELLEN) {
    for (const [name, p] of Object.entries(quelle || {})) {
      if (p?.shades && !karte.has(name)) karte.set(name, p.shades)
    }
  }
  return karte
})()

const HEX = /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i
const VERWEIS = /^([a-z][a-z-]*)\.(\d{2,3})$/

/** Ist das ein Farbverweis "palette.stufe"? */
export const istVerweis = (wert) => typeof wert === 'string' && VERWEIS.test(wert.trim())

/**
 * @param {string|string[]} ref  "palette.stufe", Hex oder Liste davon
 * @param {{ still?: boolean }} [opt]  still: keine Warnung (fuer Eingabepruefung)
 * @returns {string|null|Array}
 */
export function loeseAuf(ref, opt = {}) {
  if (Array.isArray(ref)) return ref.map((r) => loeseAuf(r, opt))
  if (typeof ref !== 'string') return warne(ref, opt)
  const s = ref.trim()
  if (HEX.test(s)) return s
  const m = s.match(VERWEIS)
  const wert = m ? PALETTEN.get(m[1])?.[m[2]] : undefined
  return wert ?? warne(ref, opt)
}

function warne(ref, opt) {
  if (!opt.still) console.warn(`[praes-ref] Unbekannter Farbverweis: ${JSON.stringify(ref)}`)
  return null
}

/** Paletten fuer die Farbwahl im Inspector: [{ name, label, stufen: [{ stufe, hex }] }] */
export function palettenAuswahl() {
  const labels = new Map()
  for (const quelle of QUELLEN) for (const [n, p] of Object.entries(quelle || {})) if (!labels.has(n)) labels.set(n, p?.label || n)
  return [...PALETTEN.entries()]
    .map(([name, stufen]) => ({
      name,
      label: labels.get(name) || name,
      stufen: Object.entries(stufen)
        .filter(([, hex]) => typeof hex === 'string' && hex.startsWith('#'))
        .map(([stufe, hex]) => ({ stufe, hex }))
    }))
    .filter((p) => p.stufen.length)
}

// --- Kontrast (WCAG 2.x) ---------------------------------------------------
function kanal(c) {
  const v = c / 255
  return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
}
function leuchtdichte(hex) {
  let h = String(hex).replace('#', '')
  if (h.length === 3) h = h.split('').map((c) => c + c).join('')
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16))
  return 0.2126 * kanal(r) + 0.7152 * kanal(g) + 0.0722 * kanal(b)
}
/** Kontrastverhaeltnis zweier Hex-Farben, null wenn eine fehlt. */
export function kontrast(a, b) {
  if (!a || !b || !HEX.test(a) || !HEX.test(b)) return null
  const [x, y] = [leuchtdichte(a), leuchtdichte(b)].sort((p, q) => q - p)
  return (x + 0.05) / (y + 0.05)
}
