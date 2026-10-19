// @ts-check
/**
 * @file
 * Strichstärken der Icons (Roadmap V07, 19.10.2026).
 *
 * Das Design System setzt die Strichstärke seiner Icons als
 * stroke-width: var(--fnd-icon-stroke-<stufe>, <bisheriger Wert>) und
 * definiert die Variablen selbst NICHT (05-atoms/_icon.scss). Der
 * Konfigurator schreibt sie nur für Stufen, die im Theme gesetzt sind.
 *
 * „Standard“ = leerer Wert. Vorher standen hier feste Vorgaben (Tabler: xs 1,
 * sm/md 1,5, ab lg 2), die nichts bewirkten und nicht dem entsprachen, was
 * die Website zeichnet. Unveränderte alte Vorgaben werden beim Laden auf
 * „Standard“ gesetzt, sonst würde der neue Export sie plötzlich ausliefern.
 */

export const STUFEN = Object.freeze(['xs', 'sm', 'md', 'lg', 'xl', '2xl'])

/** Bibliothek, mit der die Website zeichnet — nur sie wird exportiert. */
export const WEBSITE_BIBLIOTHEK = 'tabler'

/** Was die Website ohne Theme ungefähr zeichnet (nur für die Vorschau im Konfigurator). */
export const STRICH_VORSCHAU = Object.freeze({ xs: '2', sm: '2', md: '2', lg: '2', xl: '2', '2xl': '1.5' })

const ALT = Object.freeze({
  tabler: { xs: '1', sm: '1.5', md: '1.5', lg: '2', xl: '2', '2xl': '2' },
  heroicons: { xs: '1.5', sm: '1.5', md: '1.5', lg: '1.5', xl: '1.5', '2xl': '1.5' },
})

/** @returns {Record<string, string>} alle Stufen „Standard“ */
export function strichLeer () {
  return Object.fromEntries(STUFEN.map((s) => [s, '']))
}

/** Werkseinstellung je Set: alle Bibliotheken „Standard“ */
export function strichVorgaben () {
  return { tabler: strichLeer(), heroicons: strichLeer() }
}

const gleich = (a, b) => !!a && !!b && STUFEN.every((s) => String(a[s] ?? '') === String(b[s] ?? ''))

/**
 * Unveränderte alte Vorgaben → „Standard“. Verändert das Objekt.
 * @param {Record<string, Record<string, string>>} jeBibliothek  iconStrokeWidths[set]
 * @returns {boolean} ob etwas umgestellt wurde
 */
export function migriereStriche (jeBibliothek) {
  let geaendert = false
  for (const [id, alt] of Object.entries(ALT)) {
    if (gleich(jeBibliothek?.[id], alt)) { jeBibliothek[id] = strichLeer(); geaendert = true }
  }
  return geaendert
}

const GUELTIG = /^(?:\d+(?:\.\d+)?|\.\d+)$/

/**
 * CSS-Zeilen für die gesetzten Stufen der Website-Bibliothek.
 * @param {Record<string, string> | undefined} striche  iconStrokeWidths[set].tabler
 * @returns {string[]} z. B. ['  --fnd-icon-stroke-xs: 1.75;']
 */
export function iconStrichZeilen (striche) {
  const zeilen = []
  for (const s of STUFEN) {
    const v = String(striche?.[s] ?? '').trim()
    if (!v || !GUELTIG.test(v)) continue
    const n = Number(v)
    if (n > 0 && n <= 4) zeilen.push(`  --fnd-icon-stroke-${s}: ${v};`)
  }
  return zeilen
}
