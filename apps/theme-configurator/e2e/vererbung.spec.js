// ==========================================================================
// Vererbung in Theme-Bereichen (Frank, 19.10.2026)
// ==========================================================================
// Ein Bereich mit eigener Theme-Klasse (z. B. dunkler Block
// „neo-dark-theme neo-surface“ auf heller Seite) muss für JEDES Token
// (--nc-*, --fnd-*) dieselben Werte haben wie eine ganze Seite in diesem
// Theme. Vorher waren 731 bzw. 796 Tokens nur auf :root abgeleitet und
// behielten im Bereich die Werte der Seite (Knöpfe, Karten, Felder,
// Schatten, Fokusring). Geprüft mit dem gebauten styles.css.
// Ausnahme: Papier der lokalen Variante „Kunde“ im Dunkeln — im DS als
// offener Punkt dokumentiert (_mono-bridge.scss), in Drupal nicht genutzt.
// ==========================================================================
import { test, expect } from './hilfen.js'

const PAARE = [['neo-light-theme', 'neo-dark-theme'], ['customer-light-theme', 'customer-dark-theme']]
const AUSNAHMEN = new Set(['customer-light-theme>customer-dark-theme:--fnd-color-paper'])

test('Vererbung: Theme-Bereiche haben die Werte einer ganzen Seite dieses Themes', async ({ page }) => {
  const css = await (await page.request.get('/styles.css')).text()
  const namen = [...new Set(css.match(/--(?:nc|fnd)-[a-z0-9-]+(?=\s*:)/g))]
  expect(namen.length).toBeGreaterThan(3000)
  const messen = async (seite, bereich) => {
    await page.setContent(`<!doctype html><html class="${seite}"><head><style>${css}</style></head><body class="${seite}">${bereich ? `<div class="${bereich} neo-surface"><div id="m"></div></div>` : '<div id="m"></div>'}</body></html>`)
    return page.evaluate((n) => { const cs = getComputedStyle(document.getElementById('m')); return Object.fromEntries(n.map((x) => [x, cs.getPropertyValue(x).trim()])) }, namen)
  }
  const befunde = []
  for (const [hell, dunkel] of PAARE) {
    for (const [seite, bereich] of [[hell, dunkel], [dunkel, hell]]) {
      const imBereich = await messen(seite, bereich)
      const ganzeSeite = await messen(bereich)
      for (const n of namen) {
        if (imBereich[n] !== ganzeSeite[n] && !AUSNAHMEN.has(`${seite}>${bereich}:${n}`)) befunde.push(`${bereich} in ${seite}: ${n} = ${imBereich[n]} statt ${ganzeSeite[n]}`)
      }
    }
  }
  expect(befunde.slice(0, 10), `${befunde.length} Tokens erben im Theme-Bereich falsch`).toEqual([])
})
