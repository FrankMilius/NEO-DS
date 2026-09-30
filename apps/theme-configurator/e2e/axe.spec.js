// ==========================================================================
// axe-Pruefung der App-Oberflaeche mit Basislinie (Plan v2, 4.2)
// ==========================================================================
// Geprueft wird die Oberflaeche des Konfigurators: Header, Navigation,
// Inspector, Dialoge. Die Vorschau-Inhalte (Arenen im Labor-Viewport) sind
// ausgenommen — sie zeigen Design-System-Komponenten, deren Barriere-
// freiheit gehoert zum System, nicht zur App.
//
// Basislinie: e2e/axe-basislinie.json, je Seite { regel-id: Anzahl Knoten }.
// Der Test scheitert nur, wenn eine Regel NEU auftaucht oder MEHR Knoten
// verletzt. Weniger Befunde → Hinweis im Report, Basislinie senken:
//
//   AXE_BASISLINIE=schreiben npm run e2e -- e2e/axe.spec.js
//
// (Schreibt die Datei mit den aktuellen Zahlen; Diff pruefen, committen.)
// ==========================================================================

import AxeBuilder from '@axe-core/playwright'
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { test, expect, oeffneSektion, EINSTIEG, warteAufRuhe } from './hilfen.js'

const DATEI = fileURLToPath(new URL('./axe-basislinie.json', import.meta.url))
const SCHREIBEN = process.env.AXE_BASISLINIE === 'schreiben'
const REGELN = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']

// Arenen/Vorschau: nicht Teil der App-Oberflaeche
const AUSGENOMMEN = ['.lab-viewport']

const basislinie = existsSync(DATEI) ? JSON.parse(readFileSync(DATEI, 'utf-8')) : { seiten: {} }

const SEITEN = [
  {
    name: 'start',
    oeffnen: async (page) => {
      await page.goto(EINSTIEG)
      await expect(page.locator('.inspector-panel')).toBeVisible()
    },
  },
  {
    name: 'foundation-farben-semantisch',
    oeffnen: async (page) => {
      await oeffneSektion(page, 'foundation-colors')
      await page.locator('.color-tabs').getByRole('button', { name: /Semantic Colors/ }).click()
    },
  },
  { name: 'typografie', oeffnen: (page) => oeffneSektion(page, 'foundation-typography') },
  { name: 'praesentation', oeffnen: (page) => oeffneSektion(page, 'foundation-praesentation') },
  // Badge hat keine Sonderfall-Arena → RecipeArena
  {
    name: 'recipe-arena-badge',
    oeffnen: async (page) => {
      await oeffneSektion(page, 'component-badge')
      await expect(page.locator('.recipe-arena')).toBeVisible()
    },
  },
  {
    name: 'dialog-dtcg-export',
    oeffnen: async (page) => {
      await oeffneSektion(page, 'foundation-colors')
      await page.locator('.app-header').getByRole('button', { name: /export/i }).click()
      await page.locator('[data-test="export-dtcg"]').click()
      const dialog = page.getByRole('dialog', { name: /DTCG-Export/ })
      await expect(dialog.getByRole('button', { name: 'Herunterladen' })).toBeEnabled()
    },
  },
]

// Beim Schreiben laufen alle Seiten nacheinander in einem Worker
test.describe.configure({ mode: SCHREIBEN ? 'serial' : 'parallel' })

const ergebnisse = {}

for (const seite of SEITEN) {
  test(`axe: ${seite.name}`, async ({ page }, info) => {
    await seite.oeffnen(page)
    await warteAufRuhe(page)

    let builder = new AxeBuilder({ page }).withTags(REGELN)
    for (const sel of AUSGENOMMEN) builder = builder.exclude(sel)
    const { violations } = await builder.analyze()

    const aktuell = {}
    for (const v of violations) aktuell[v.id] = v.nodes.length
    ergebnisse[seite.name] = Object.fromEntries(Object.entries(aktuell).sort(([a], [b]) => a.localeCompare(b)))

    await info.attach('axe-befunde.json', {
      body: JSON.stringify(violations.map((v) => ({
        id: v.id, impact: v.impact, hilfe: v.help, knoten: v.nodes.map((n) => n.target.join(' ')),
      })), null, 2),
      contentType: 'application/json',
    })

    if (SCHREIBEN) return

    const erlaubt = basislinie.seiten[seite.name] || {}
    const schlechter = Object.entries(aktuell)
      .filter(([id, n]) => n > (erlaubt[id] || 0))
      .map(([id, n]) => `${id}: ${n} (Basislinie ${erlaubt[id] || 0}) — ${violations.find((v) => v.id === id).help}`)
    const besser = Object.entries(erlaubt)
      .filter(([id, n]) => (aktuell[id] || 0) < n)
      .map(([id, n]) => `${id}: ${aktuell[id] || 0} statt ${n}`)
    if (besser.length) {
      info.annotations.push({ type: 'axe besser als Basislinie — senken', description: besser.join('; ') })
    }
    expect(schlechter, `Neue oder mehr axe-Befunde auf „${seite.name}"`).toEqual([])
  })
}

test.afterAll(() => {
  if (!SCHREIBEN) return
  const daten = {
    _hinweis:
      'Basislinie der axe-Befunde (Regel-ID → Anzahl verletzender Knoten) je Seite. ' +
      'Gepflegt von e2e/axe.spec.js; aktualisieren mit AXE_BASISLINIE=schreiben npm run e2e -- e2e/axe.spec.js',
    regeln: REGELN,
    ausgenommen: AUSGENOMMEN,
    seiten: Object.fromEntries(SEITEN.map((s) => [s.name, ergebnisse[s.name] || {}])),
  }
  writeFileSync(DATEI, JSON.stringify(daten, null, 2) + '\n')
})
