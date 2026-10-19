// @ts-check
/**
 * @file
 * Werteauswahl „Geometry“ im Komponenten-Inspector (Befund UX-39, 19.10.2026).
 *
 * Vorher in GeometryTokenSelect.vue, mit drei Fehlern:
 * 1. Die Kategorie hiess im Code „sizes“, im Token-Generator „size“ — Hoehen,
 *    Groessen und der Rueckfall bekamen eine leere Liste.
 * 2. Die Rueckwaertssuche nach dem Pixelwert lief ueber alle Skalen: ein
 *    Padding von 8px hiess „Radius …“, weil der Radius zuerst passte.
 * 3. Das Popup stand immer an der linken Kante des Ausloesers und ragte im
 *    rechten Inspector aus dem Fenster.
 */

/** @typedef {{ label?: string, value?: string, cssVar?: string, type?: string, rem?: string }} FoundationToken */
/** @typedef {Record<string, { label?: string, tokens?: Record<string, FoundationToken> }>} FoundationKategorien */
/** @typedef {{ label: string, varName: string, varValue: string, value: string, rem: string }} Vorschlag */

export const KATEGORIE_NAME = Object.freeze({ size: 'Größe', spacing: 'Abstand', radius: 'Radius', border: 'Rahmen' })

/**
 * Welche Skalen passen zu einem Komponenten-Token? Leer = keine Vorschlaege
 * (Schriftgroesse und -gewicht kommen aus der Typografie).
 * @param {string} tokenId
 * @returns {Array<'size'|'spacing'|'radius'|'border'>}
 */
export function kategorienFuer (tokenId) {
  const id = String(tokenId || '')
  if (id.includes('radius')) return ['radius']
  if (id.includes('font-size') || id.includes('weight')) return []
  // Vor „width“ pruefen: border-width enthaelt auch „width“
  if (id.includes('border-width') || id.includes('outline') || id.includes('ring')) return ['border']
  if (/padding|gap|spacing|margin|indent|offset/.test(id)) return ['spacing']
  if (id.includes('height') || id.includes('-size') || id.includes('icon')) return ['size']
  if (id.includes('width')) return ['size', 'spacing']
  return ['size']
}

/** Wert in Pixel fuer Sortierung und Balken; rem mit 16px. */
export function inPixel (wert) {
  const m = String(wert ?? '').trim().match(/^(-?\d*\.?\d+)(px|rem)?$/)
  if (!m) return NaN
  return m[2] === 'rem' ? parseFloat(m[1]) * 16 : parseFloat(m[1])
}

/**
 * @param {FoundationKategorien} foundation
 * @param {string} kategorie
 * @returns {Array<[string, FoundationToken]>}
 */
function eintraege (foundation, kategorie) {
  const tokens = foundation?.[kategorie]?.tokens || {}
  return Object.entries(tokens).filter(([key, tok]) => {
    if (key === 'null' || !tok?.cssVar || typeof tok.value !== 'string') return false
    if (kategorie === 'border') return tok.type === 'width'
    return true
  })
}

/**
 * Vorschlagsgruppen in Pixel-Reihenfolge.
 * @param {string} tokenId
 * @param {FoundationKategorien} foundation
 * @returns {Array<{ label: string, items: Vorschlag[] }>}
 */
export function vorschlagsGruppen (tokenId, foundation) {
  const gruppen = []
  for (const kat of kategorienFuer(tokenId)) {
    const items = eintraege(foundation, kat)
      .map(([, tok]) => ({
        label: `${KATEGORIE_NAME[kat]} ${tok.label}`,
        varName: /** @type {string} */ (tok.cssVar),
        varValue: `var(${tok.cssVar})`,
        value: /** @type {string} */ (tok.value),
        rem: tok.rem || '',
      }))
      .sort((a, b) => (inPixel(a.value) || 0) - (inPixel(b.value) || 0))
    if (items.length) gruppen.push({ label: KATEGORIE_NAME[kat], items })
  }
  return gruppen
}

/**
 * Token zu einem Verweis var(--fnd-…) — in allen Skalen, weil ein Verweis
 * eindeutig ist.
 * @param {string} wert
 * @param {FoundationKategorien} foundation
 * @returns {{ kategorie: string, token: FoundationToken } | null}
 */
export function verweisToken (wert, foundation) {
  const m = String(wert ?? '').match(/^var\((--fnd-[\w-]+)\)$/)
  if (!m) return null
  for (const kat of Object.keys(KATEGORIE_NAME)) {
    for (const [, tok] of eintraege(foundation, kat)) {
      if (tok.cssVar === m[1]) return { kategorie: kat, token: tok }
    }
  }
  return null
}

/**
 * Bezeichnung fuer den aktuellen Wert: ein Verweis nennt sein Token; ein
 * fester Wert nur dann, wenn er in einer PASSENDEN Skala vorkommt.
 * @param {string} wert  roher Wert (Verweis oder fester Wert)
 * @param {string} aufgeloest  angezeigter Wert
 * @param {string} tokenId
 * @param {FoundationKategorien} foundation
 */
export function passendeBezeichnung (wert, aufgeloest, tokenId, foundation) {
  const verweis = verweisToken(wert, foundation)
  if (verweis) return `${KATEGORIE_NAME[verweis.kategorie]} ${verweis.token.label}`
  // Vergleich in Pixel: Groessen stehen in rem (1.5rem), Komponenten oft in px (24px)
  const px = inPixel(aufgeloest)
  for (const kat of kategorienFuer(tokenId)) {
    for (const [, tok] of eintraege(foundation, kat)) {
      if (tok.value === aufgeloest || (!Number.isNaN(px) && inPixel(tok.value) === px)) return `${KATEGORIE_NAME[kat]} ${tok.label}`
    }
  }
  return ''
}

/**
 * Lage des Popups (position: fixed) — bleibt im Fenster.
 * @param {{ top: number, bottom: number, left: number, right: number, width: number }} ausloeser
 * @param {{ breite: number, hoehe: number }} fenster
 * @param {{ breite?: number, hoehe?: number, rand?: number }} [opt]
 * @returns {{ top: number, left: number, width: number, maxHeight: number }}
 */
export function popupLage (ausloeser, fenster, opt = {}) {
  const rand = opt.rand ?? 8
  const width = Math.min(Math.max(opt.breite ?? 260, ausloeser.width), fenster.breite - 2 * rand)
  const gewuenscht = opt.hoehe ?? 320
  const unten = fenster.hoehe - ausloeser.bottom - rand - 4
  const oben = ausloeser.top - rand - 4
  const nachUnten = unten >= gewuenscht || unten >= oben
  const maxHeight = Math.max(120, Math.min(gewuenscht, nachUnten ? unten : oben))
  const top = nachUnten ? ausloeser.bottom + 4 : Math.max(rand, ausloeser.top - 4 - maxHeight)
  // Rechtsbuendig zum Ausloeser, wenn links ausgerichtet ueber den Rand ragt
  let left = ausloeser.left
  if (left + width > fenster.breite - rand) left = Math.max(rand, Math.min(ausloeser.right, fenster.breite - rand) - width)
  return { top, left, width, maxHeight }
}
