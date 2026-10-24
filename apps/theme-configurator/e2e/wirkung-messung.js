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
//
// R14 Paket 3c — Regel „ein Wert, der im berechneten Wert ankommt, gilt als
// wirkend“ (ursprünglich Claudes Vorgabe in den Zusatzaufträgen 3a–3c, von
// Frank übernommen; Entscheidung 23.10.2026, STAND.md Paket 3c): zusätzlich
// border-right-color (Trennlinie der Zeilennummern,
// .nc-code-snippet__line::before), tab-size (Code-Snippet) und
// scrollbar-width (Textarea) — die Werte kamen an, die Prüfung sah nur die
// Eigenschaft nicht.
//
// Schlüsselwort-Prüfwert (Nachbesserung 3c, Entscheidung Frank 23.10.2026):
// Liest eine Eigenschaft, die nur Schlüsselwörter kennt (z. B.
// scrollbar-width: auto | thin | none), ein Token mit Schlüsselwort-Standard,
// wäre eine Länge als Prüfwert ungültig — der berechnete Wert fiele auf den
// Anfangswert zurück und „wirkte“ nur scheinbar. Entschieden wird an der
// Eigenschaft, die das Token im CSS liest, nicht am Namen des Tokens.
// ==========================================================================

/** Bisher gemessene Eigenschaften (Stand vor der Nachbesserung, unverändert) */
export const EIGENSCHAFTEN_BISHER = Object.freeze(['color', 'background-color', 'background-image', 'border-top-color', 'border-bottom-color', 'border-left-color', 'border-top-width', 'border-left-width', 'border-top-left-radius', 'border-bottom-left-radius', 'padding-top', 'padding-left', 'margin-top', 'margin-left', 'row-gap', 'column-gap', 'width', 'height', 'min-width', 'min-height', 'max-width', 'font-family', 'font-size', 'font-weight', 'line-height', 'letter-spacing', 'opacity', 'box-shadow', 'outline-color', 'outline-width', 'outline-offset', 'transition-duration', 'animation-duration', 'transform', 'text-transform', 'text-decoration-color', 'fill', 'stroke', 'stroke-width', 'grid-template-columns', 'aspect-ratio', 'z-index', 'filter', 'backdrop-filter', 'top', 'left', 'inset-inline-start'])

/** Zusätzlich gemessen (Nachbesserung 3a) */
export const EIGENSCHAFTEN_NEU = Object.freeze(['scroll-margin-top', 'scroll-margin-block-start', 'padding-right', 'border-end-start-radius', 'border-right-color', 'tab-size', 'scrollbar-width'])

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

/**
 * Eigenschaften, die nur Schlüsselwörter annehmen (keine Länge). Je Liste
 * gilt das erste vom Standard verschiedene Wort als Prüfwert.
 */
export const NUR_SCHLUESSELWORT = Object.freeze({
  'scrollbar-width': Object.freeze(['none', 'auto', 'thin']),
  resize: Object.freeze(['none', 'both', 'horizontal', 'vertical']),
  'text-transform': Object.freeze(['lowercase', 'none', 'uppercase', 'capitalize']),
  'border-style': Object.freeze(['dotted', 'solid', 'dashed', 'double', 'none'])
})

/** Eigenschaften, in deren Deklaration das Token gelesen wird (Quelltext) */
export function gelesenIn (id, css) {
  const props = new Set()
  const muster = new RegExp(`(?:^|[;{\\s])(-?-?[a-z][a-z0-9-]*)\\s*:[^;{}]*var\\(--${id}[,)\\s]`, 'g')
  for (const [, prop] of String(css).matchAll(muster)) if (!prop.startsWith('--')) props.add(prop)
  return props
}

/**
 * Prüfwert für ein Token mit Schlüsselwort-Standard, das eine
 * Nur-Schlüsselwort-Eigenschaft speist: ein anderes gültiges Schlüsselwort
 * (scrollbar-width: thin → none). null = keine solche Eigenschaft, der
 * bisherige Prüfwert gilt.
 */
export function schluesselwortPruefwert (t, css) {
  const d = String(t.default ?? '').trim()
  if (!/^[a-z][a-z-]*$/.test(d)) return null
  for (const prop of gelesenIn(t.id, css)) {
    const liste = NUR_SCHLUESSELWORT[prop]
    if (liste?.includes(d)) return liste.find((w) => w !== d)
  }
  return null
}
