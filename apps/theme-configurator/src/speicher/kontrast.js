// @ts-check
// ==========================================================================
// Kontrast-Pruefung fuer das Veroeffentlichen (Plan v2, 2.6)
// ==========================================================================
// Rechnet WCAG-2.1-Kontraste der wichtigsten semantischen Paare eines
// Theme-Sets (hell und dunkel). Das Ergebnis geht beim Veroeffentlichen an
// den Server. Die App zeigt das Ergebnis sofort; der Server prueft beim
// Veroeffentlichen verbindlich mit derselben Paarliste (ADR-002, Frage 5).
// Ein Recht zum Uebergehen gibt es nicht (Frage 2).
//
// Nur Hex-Werte (#rrggbb, Kurzform #rgb) werden bewertet. Alles andere (rgba, var(), color-mix) ist
// "ungeklaert" und zaehlt NICHT als bestanden.
// ==========================================================================

import PAARLISTE from '../../../../data/kontrast-paare.json' with { type: 'json' }

/**
 * Die Paarliste steht seit Plan v2, 2.6 in data/kontrast-paare.json — eine
 * Quelle fuer App, Pruefwerkzeug (scripts/pruefe-kunden-themes.mjs) und den
 * Drupal-Server, der beim Veroeffentlichen verbindlich nachrechnet
 * (Entscheidung Frage 5). Hier als [Vordergrund, Hintergrund, Mindestwert].
 *
 * BEFUND 30.09.2026, behoben 01.10.2026 (Entscheidung G): on-danger/
 * on-success/on-warning/on-info sind im NEO-Standard jetzt dunkel (#000000,
 * 6,26–9,11:1). Die Paare bleiben im Tor; weisse Schrift auf den
 * Statusflaechen faellt weiterhin durch (tests/speicher/kontrast.test.js).
 * Gleiche Faelle fuer PHP: data/pruefvektoren/speicher-vertrag.json.
 */
/** @type {Array<[string, string, number]>} vordergrund, hintergrund, mindestens */
export const KONTRAST_PAARE = PAARLISTE.paare.map(p => [p.vordergrund, p.hintergrund, p.mindestens])

/** Verfahrensangabe im Ergebnis (aus der Paarliste). */
export const KONTRAST_VERFAHREN = PAARLISTE._meta.verfahren

function hexZuRgb(hex) {
  if (typeof hex !== 'string') return null
  let h = hex.trim().replace(/^#/, '')
  if (/^[0-9a-f]{3}$/i.test(h)) h = h.split('').map(c => c + c).join('')
  if (!/^[0-9a-f]{6}$/i.test(h)) return null
  return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16) / 255)
}

/** @param {number[]} rgb */
function luminanz([r, g, b]) {
  const k = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
  return 0.2126 * k(r) + 0.7152 * k(g) + 0.0722 * k(b)
}

/** Kontrastverhaeltnis zweier Hex-Farben oder null. */
export function kontrastVerhaeltnis(a, b) {
  const x = hexZuRgb(a), y = hexZuRgb(b)
  if (!x || !y) return null
  const [hell, dunkel] = [luminanz(x), luminanz(y)].sort((p, q) => q - p)
  return (hell + 0.05) / (dunkel + 0.05)
}

/**
 * @param {{ light: object, dark: object }} themes  state.themes[set]
 * @returns {{ bestanden: boolean, verfahren: string, geprueftAm: string,
 *   ergebnisse: Array<{ modus, vordergrund, hintergrund, verhaeltnis, mindestens, bestanden }> }}
 */
export function pruefeKontrast(themes, paare = KONTRAST_PAARE) {
  const ergebnisse = []
  for (const modus of ['light', 'dark']) {
    const t = themes?.[modus] || {}
    for (const [vg, hg, mindestens] of paare) {
      if (t[vg] === undefined || t[hg] === undefined) continue
      const v = kontrastVerhaeltnis(t[vg], t[hg])
      ergebnisse.push({
        modus,
        vordergrund: vg,
        hintergrund: hg,
        verhaeltnis: v === null ? null : Math.round(v * 100) / 100,
        mindestens,
        bestanden: v === null ? null : v >= mindestens,
      })
    }
  }
  return {
    bestanden: ergebnisse.length > 0 && ergebnisse.every(e => e.bestanden === true),
    verfahren: KONTRAST_VERFAHREN,
    geprueftAm: new Date().toISOString(),
    ergebnisse,
  }
}
