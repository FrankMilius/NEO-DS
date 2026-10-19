// ==========================================================================
// Screenshot-Vergleich der Arenen — @visuell (Plan v2, 4.2)
// ==========================================================================
// NICHT im CI-Gate. Schriftglaettung und Systemschriften unterscheiden sich
// zwischen macOS und Linux; versioniert werden nur Linux-Baselines
// (e2e/__screenshots__/…-linux.png). Ausfuehren und Aktualisieren:
// e2e/README.md.
//
// Auswahl: Arenen ohne externe Bilder und ohne Zeit-/Zufallsanteile.
// ==========================================================================

import { test, expect, oeffneSektion, warteAufRuhe } from './hilfen.js'

const ARENEN = [
  { sektion: 'component-button', warte: '.lab-viewport-inner > *' },
  { sektion: 'component-badge', warte: '.recipe-arena' },
  { sektion: 'component-chip', warte: '.lab-viewport-inner > *' },
  { sektion: 'component-status', warte: '.lab-viewport-inner > *' },
  { sektion: 'component-alert', warte: '.lab-viewport-inner > *' },
  { sektion: 'foundation-typography', warte: '.lab-viewport-inner > *' },
  { sektion: 'foundation-praesentation', warte: '[data-test="buehne"]' },
  // 19.10.2026: alle Grundlagen-Bühnen (Grundsatz „Bühne = Ausschnitt der
  // echten Website“); HTML-Elemente auch dunkel
  { sektion: 'foundation-grid', warte: '.lab-viewport-inner > *' },
  { sektion: 'foundation-colors', warte: '.lab-viewport-inner > *' },
  { sektion: 'foundation-surfaces', warte: '.lab-viewport-inner > *' },
  { sektion: 'foundation-spacing', warte: '.lab-viewport-inner > *' },
  { sektion: 'foundation-size', warte: '.lab-viewport-inner > *' },
  { sektion: 'foundation-radius', warte: '.lab-viewport-inner > *' },
  { sektion: 'foundation-border', warte: '.lab-viewport-inner > *' },
  { sektion: 'foundation-focus', warte: '.lab-viewport-inner > *' },
  { sektion: 'foundation-media', warte: '.lab-viewport-inner > *' },
  { sektion: 'foundation-icons', warte: '.lab-viewport-inner > *' },
  { sektion: 'foundation-shadows', warte: '.lab-viewport-inner > *' },
  { sektion: 'foundation-opacity', warte: '.lab-viewport-inner > *' },
  { sektion: 'foundation-elements', warte: '[data-test="elemente-buehne"]', modi: ['light', 'dark'] },
  { sektion: 'foundation-themes', warte: '[data-test="themes-buehne"]' },
]

for (const { sektion, warte, modi: eigeneModi } of ARENEN) {
  // Hell/Dunkel schaltet der Labor-Kopf bei Komponenten (und HTML-Elementen)
  const modi = eigeneModi || (sektion.startsWith('component-') ? ['light', 'dark'] : ['light'])
  for (const modus of modi) {
    test(`Arena ${sektion} (${modus})`, { tag: '@visuell' }, async ({ page }) => {
      await oeffneSektion(page, sektion, modus === 'dark' ? 'modus=dark' : '')
      await expect(page.locator(warte).first()).toBeVisible()
      await warteAufRuhe(page)
      // Maus aus dem Bild, keine Hover-Zustaende
      await page.mouse.move(0, 0)
      await expect(page.locator('.lab-viewport')).toHaveScreenshot(`${sektion}-${modus}.png`)
    })
  }
}
