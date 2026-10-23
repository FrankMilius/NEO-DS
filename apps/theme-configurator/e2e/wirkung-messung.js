// ==========================================================================
// Wirkungsprüfung — reine Bausteine der Messung (R14 Paket 3a, 23.10.2026)
// ==========================================================================
// Ausgelagert aus wirkung.spec.js, damit Vitest sie prüfen kann
// (tests/utils/wirkung-messung.test.js). Die Messung selbst läuft im Browser.
//
// Nachbesserung nach dem Widersacher (Entscheidung Frank, 23.10.2026):
//   - zusätzlich bei Handy-Breite 390 px (Regeln in Handy-Medienabfragen
//     greifen nur im 390-px-Rahmen der Bühne)
//   - zusätzliche Eigenschaften scroll-margin(-block-start), padding-right,
//     untere Ecke (border-bottom-left-radius / border-end-start-radius,
//     z. B. .nc-device__screen::after) — ::before/::after misst die Prüfung
//     für jede Eigenschaft mit
// Bestehende Messungen bleiben; mehr Messung ergibt nur zusätzliche „wirkt“
// (zusammenfuehren zählt Unterschiede beider Breiten zusammen).
// ==========================================================================

/** Bisher gemessene Eigenschaften (Stand vor der Nachbesserung, unverändert) */
export const EIGENSCHAFTEN_BISHER = Object.freeze(['color', 'background-color', 'background-image', 'border-top-color', 'border-bottom-color', 'border-left-color', 'border-top-width', 'border-left-width', 'border-top-left-radius', 'border-bottom-left-radius', 'padding-top', 'padding-left', 'margin-top', 'margin-left', 'row-gap', 'column-gap', 'width', 'height', 'min-width', 'min-height', 'max-width', 'font-family', 'font-size', 'font-weight', 'line-height', 'letter-spacing', 'opacity', 'box-shadow', 'outline-color', 'outline-width', 'outline-offset', 'transition-duration', 'animation-duration', 'transform', 'text-transform', 'text-decoration-color', 'fill', 'stroke', 'stroke-width', 'grid-template-columns', 'aspect-ratio', 'z-index', 'filter', 'backdrop-filter', 'top', 'left', 'inset-inline-start'])

/** Zusätzlich gemessen (Nachbesserung 3a) */
export const EIGENSCHAFTEN_NEU = Object.freeze(['scroll-margin-top', 'scroll-margin-block-start', 'padding-right', 'border-end-start-radius'])

/** Alle gemessenen Eigenschaften — bisherige zuerst, ohne Doppel */
export const EIGENSCHAFTEN = Object.freeze([...new Set([...EIGENSCHAFTEN_BISHER, ...EIGENSCHAFTEN_NEU])])

/** Pseudo-Elemente je Element (null = das Element selbst) */
export const PSEUDO = Object.freeze([null, '::before', '::after'])

/** Breite der zusätzlichen Messung (Knopf „Handy“ der Bühne) */
export const HANDY = Object.freeze({ key: 'handy', breite: 390 })

/** Anzahl Elemente, deren Abdruck sich gegenüber der Basis unterscheidet */
export function zaehleUnterschiede (basis, neu) {
  let n = 0
  for (let i = 0; i < neu.length; i++) if (neu[i] !== basis[i]) n++
  return n
}

/**
 * Ergebnis zweier Breiten zusammenführen: Zahlen werden addiert (wirkt eine
 * Breite, wirkt der Wert); Text-Ergebnisse (unbenutzt, ohne-pruefwert) der
 * ersten Messung bleiben. Fehlt die zweite Messung, gilt die erste unverändert.
 */
export function zusammenfuehren (erste, zweite) {
  const aus = { ...erste }
  if (!zweite) return aus
  for (const [id, wert] of Object.entries(zweite)) {
    const alt = aus[id]
    if (typeof alt === 'number' && typeof wert === 'number') aus[id] = alt + wert
    else if (alt === undefined) aus[id] = wert
  }
  return aus
}
