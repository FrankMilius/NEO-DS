// ==========================================================================
// Fluide Schriftskala — dieselbe Rechnung wie scss/00-settings/_typography.scss
// ==========================================================================
// Plan v2, Schritt 2.3 (30.09.2026). Der Typografie-Editor zeigte eine feste
// Skala (10–42 px, Basis 14). Das Design System rechnet fluide:
//
//   min(Stufe) = base_min_px × ratio_min ^ Schritt   (bei viewport_min, 320 px)
//   max(Stufe) = base_max_px × ratio_max ^ Schritt   (bei viewport_max, 1920 px)
//
// Feste Werte (fixed_steps: 2xs, xs, sm) schlagen die Rechnung, und keine
// Stufe faellt unter 12 px (floor_px). Das CSS setzt daraus
//   --fs-<stufe>: clamp(MINrem, calc(MINrem + (MAXrem - MINrem) * var(--fluid-bp)), MAXrem)
// Dieses Modul erzeugt exakt diese Zeichenketten; der Test vergleicht sie mit
// dem gebauten styles.css.
// ==========================================================================

/** Zahl wie Sass: hoechstens 10 Nachkommastellen, ohne Nullen am Ende. */
export function sassZahl(x) {
  const r = Math.round(x * 1e10) / 1e10
  return String(r)
}

const rem = (px) => `${sassZahl(px / 16)}rem`

/**
 * Parameter der Skala: Vorgaben der Quelle, ueberlagert von Aenderungen.
 * @param {object} quelle     typographyScale aus tokens.generated.js
 * @param {object} [aenderung] { base_min_px, base_max_px, ratio_min, ratio_max }
 */
export function skalenParameter(quelle, aenderung = {}) {
  const f = quelle.fluid
  const zahl = (v, d) => (v === undefined || v === '' || !Number.isFinite(Number(v)) ? d : Number(v))
  return {
    viewportMin: f.viewport_min,
    viewportMax: f.viewport_max,
    baseMin: zahl(aenderung.base_min_px, f.base_min_px),
    baseMax: zahl(aenderung.base_max_px, f.base_max_px),
    ratioMin: zahl(aenderung.ratio_min, f.ratio_min),
    ratioMax: zahl(aenderung.ratio_max, f.ratio_max),
    fest: f.fixed_steps || {},
    boden: quelle.floor_px ?? 12,
    schritte: quelle.semantic_steps,
  }
}

/**
 * Alle Stufen der Skala.
 * @returns {Array<{stufe:string, schritt:number, minPx:number, maxPx:number, fest:boolean, css:string}>}
 */
export function berechneSkala(p) {
  return Object.entries(p.schritte).map(([stufe, schritt]) => {
    const fest = p.fest[stufe]
    const minPx = Math.max(p.boden, fest ? fest.min : p.baseMin * Math.pow(p.ratioMin, schritt))
    const maxPx = Math.max(p.boden, fest ? fest.max : p.baseMax * Math.pow(p.ratioMax, schritt))
    const a = rem(minPx), b = rem(maxPx)
    return {
      stufe, schritt, minPx, maxPx, fest: Boolean(fest),
      css: `clamp(${a}, calc(${a} + (${b} - ${a}) * var(--fluid-bp)), ${b})`,
    }
  })
}

/** Groesse einer Stufe bei einer Viewport-Breite (px), wie clamp() im Browser. */
export function groesseBei(stufe, vw, p) {
  const t = Math.min(1, Math.max(0, (vw - p.viewportMin) / (p.viewportMax - p.viewportMin)))
  return stufe.minPx + (stufe.maxPx - stufe.minPx) * t
}

/** Weicht die Aenderung von der Quelle ab? */
export function istGeaendert(quelle, aenderung = {}) {
  const f = quelle.fluid
  const p = skalenParameter(quelle, aenderung)
  return p.baseMin !== f.base_min_px || p.baseMax !== f.base_max_px || p.ratioMin !== f.ratio_min || p.ratioMax !== f.ratio_max
}
