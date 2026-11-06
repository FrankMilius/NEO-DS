// ==========================================================================
// Flächenliste der Hauptnavigation (I06 Phase 3, Entscheidung Frank 06.11.2026)
// ==========================================================================
// Eine Fläche gilt gemeinsam für Leiste, Panel und Drawer und muss in beiden
// Varianten und allen vier Themen den Kontrast halten. Geprüft wird die
// gebaute styles.css auf den Referenz-Fassungen aus data/markup, gemessen im
// Browser. Die Teaser-Karte behält ihre eigene Fläche und zählt hier nicht.
// ==========================================================================
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import AxeBuilder from '@axe-core/playwright'
import { test, expect, oeffneSektion, warteAufRuhe } from './hilfen.js'
import { componentTokenGroups } from '../src/data/tokens.generated.js'

const datei = (pfad) => readFileSync(fileURLToPath(new URL(pfad, import.meta.url)), 'utf8')
const CSS = datei('../../../styles.css')
const FASSUNGEN = datei('../../../data/markup/navigation-tab-mega.html').split(/<!--\s*@fassung:[^>]*-->/)

function suche (knoten) {
  if (Array.isArray(knoten)) return knoten.flatMap(suche)
  if (knoten && typeof knoten === 'object') return knoten.type === 'flaeche' ? [knoten] : Object.values(knoten).flatMap(suche)
  return []
}
const [TOKEN] = suche(componentTokenGroups)
const THEMEN = ['neo-light-theme', 'neo-dark-theme', 'customer-light-theme', 'customer-dark-theme']
// Fassung je Variante: Mega-Panel offen und mobiler Drawer offen
const VARIANTEN = { standard: [2, 5], zentriert: [7, 9] }

async function buehne (page, thema, option, fassung) {
  const werte = Object.entries(option.werte).map(([k, v]) => `--${k}:${v}`).join(';')
  await page.setContent(`<!doctype html><html lang="de" data-theme="${thema.includes('dark') ? 'dark' : 'light'}"><head><title>Flächen</title><style>${CSS}</style></head><body><div class="${thema}" style="${werte}">${FASSUNGEN[fassung]}</div></body></html>`)
}

for (const option of TOKEN.optionen.filter((o) => o.id !== 'standard')) {
  for (const thema of THEMEN) {
    for (const [variante, fassungen] of Object.entries(VARIANTEN)) {
      test(`Fläche ${option.label}, ${thema}, ${variante}: Leiste, Panel und Drawer gemeinsam, kein Kontrastbefund`, async ({ page }) => {
        for (const fassung of fassungen) {
          await buehne(page, thema, option, fassung)
          const flaechen = await page.evaluate((soll) => {
            const probe = document.createElement('i')
            probe.style.backgroundColor = soll
            document.querySelector('[style]').append(probe)
            const hintergrund = (el) => el && getComputedStyle(el).backgroundColor
            return {
              soll: hintergrund(probe),
              leiste: hintergrund(document.querySelector('.site-header')),
              panel: hintergrund(document.querySelector('.panel.is-open')),
              drawer: hintergrund(document.querySelector('.m-drawer.is-open'))
            }
          }, option.werte['nc-nav-surface'])
          expect(flaechen.leiste).toBe(flaechen.soll)
          if (flaechen.panel) expect(flaechen.panel).toBe(flaechen.soll)
          if (flaechen.drawer) expect(flaechen.drawer).toBe(flaechen.soll)
          const { violations } = await new AxeBuilder({ page })
            .withRules(['color-contrast'])
            .include('.site-header').include('.m-drawer').exclude('.teaser')
            .analyze()
          expect(violations.flatMap((v) => v.nodes.map((n) => `${n.target}: ${n.any[0]?.message}`))).toEqual([])
        }
      })
    }
  }
}

test('Die alte Navigation bleibt von jeder Fläche unberührt', async ({ page }) => {
  const alt = datei('../../../data/markup/navigation.html').split(/<!--\s*@fassung:[^>]*-->/)[1]
  const messe = async (werte) => {
    await page.setContent(`<!doctype html><html lang="de" data-theme="light"><head><title>Alt</title><style>${CSS}</style></head><body><div class="neo-light-theme" style="${werte}">${alt}</div></body></html>`)
    return page.locator('.nc-header, .nc-nav').first().evaluate((el) => getComputedStyle(el).backgroundColor)
  }
  const vorher = await messe('')
  for (const o of TOKEN.optionen) {
    expect(await messe(Object.entries(o.werte).map(([k, v]) => `--${k}:${v}`).join(';'))).toBe(vorher)
  }
})

test('Fläche wählen setzt die Tokens gemeinsam, Standard nimmt sie wieder weg', async ({ page }) => {
  await oeffneSektion(page, 'component-navigation-tab-mega'); await warteAufRuhe(page)
  await page.getByRole('button', { name: 'Neues Theme' }).first().click()
  const dialog = page.getByRole('dialog', { name: 'Neues Theme anlegen' })
  await dialog.getByLabel('Name des Themes').fill('E2E Flächen')
  await dialog.getByRole('button', { name: 'Theme anlegen' }).click()
  await expect(dialog).toBeHidden()
  await page.getByRole('searchbox', { name: 'Tokens suchen' }).fill('nc-nav-flaeche')
  const wahl = page.locator('[data-test="flaechen-wahl"] select').first()
  const zu = page.locator('.inspector-panel :is(.inspector-section.collapsed > .inspector-section__header, .ce-subgroup-header[aria-expanded="false"], .anatomy-row__header)')
  for (let i = 0; i < 6 && !(await wahl.isVisible()) && (await zu.count()); i++) await zu.first().click()
  // Der Editor öffnet sich mit Klick auf die Zeile
  if (!(await wahl.isVisible())) await page.locator('.inspector-panel .mirror-row').first().click()
  await expect(wahl).toBeVisible()
  await expect(wahl).toHaveValue('standard')
  const leiste = page.frameLocator('iframe').first().locator('.site-header').first()
  const flaeche = () => leiste.evaluate((el) => getComputedStyle(el).backgroundColor)
  const vorher = await flaeche()
  await wahl.selectOption('invertiert')
  await expect(wahl).toHaveValue('invertiert')
  await expect.poll(flaeche).not.toBe(vorher)
  await wahl.selectOption('standard')
  await expect(wahl).toHaveValue('standard')
  await expect.poll(flaeche).toBe(vorher)
})
