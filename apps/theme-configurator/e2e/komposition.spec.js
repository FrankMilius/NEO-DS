// ==========================================================================
// Komposition (Plan v3, Phase 1 — Abnahme): Eine Aenderung am Input kommt in
// den Bauteilen an, die den Input enthalten. Weg wie ein Admin: Input →
// Inspector → Geometry → Radius → „Radius LG", danach die Suche oeffnen.
// ==========================================================================
import { test, expect, oeffneSektion, unbekannteFehler, warteAufRuhe } from './hilfen.js'

test.afterEach(async ({ fehler }, info) => {
  expect(unbekannteFehler(fehler), `Konsolenfehler in „${info.title}"`).toEqual([])
})

async function inputRadiusAufLg (page) {
  await oeffneSektion(page, 'component-input')
  await warteAufRuhe(page)
  const insp = page.locator('.inspector-panel')
  await insp.getByRole('button', { name: /Geometry/ }).first().click()
  const zeile = insp.locator('.anatomy-row', { has: page.locator('[title="--nc-input-radius"]') })
  await zeile.locator('.geo-select__trigger').click()
  await zeile.locator('.geo-select__item', { hasText: '--fnd-radius-lg' }).first().click()
  await expect(zeile.locator('.geo-select__trigger')).toContainText('8px')
}

const radius = (loc) => loc.evaluate((el) => getComputedStyle(el).borderTopLeftRadius)

test('Input-Radius LG (8px) kommt im Suchfeld an — jede Zelle', async ({ page }) => {
  await inputRadiusAufLg(page)
  await page.evaluate(() => { location.hash = '#/component/search' })
  await expect(page.locator('.recipe-arena[data-component-id="search"]')).toBeVisible()
  const felder = page.locator('.recipe-arena .nc-search__input')
  await expect(felder.first()).toBeVisible()
  const n = await felder.count()
  expect(n).toBeGreaterThan(5)
  for (let i = 0; i < n; i++) {
    const f = felder.nth(i)
    // alle Felder — Standard, XL und Befehlspalette (Entscheidung 02.10.2026)
    expect(await radius(f), `Suchfeld ${i}`).toBe('8px')
  }
  // Inspector der Suche zeigt die Herkunft
  await page.locator('.inspector-panel').getByPlaceholder(/Token suchen/).fill('input-radius')
  await page.locator('.inspector-panel').getByRole('button', { name: /Input Area/ }).click()
  const herkunft = page.locator('.inspector-panel a.inheritance-link', { hasText: 'Input' }).first()
  await expect(herkunft).toHaveAttribute('href', '#/component/input')
  // … und den aufgeloesten Wert statt des rohen var()-Verweises
  const wert = page.locator('.inspector-panel .geo-select__trigger[title="--nc-search-input-radius"]')
  await expect(wert).toContainText('8px')
  await expect(wert).toContainText('erbt von Input')
  // Die Ergebnisliste bleibt bei ihrem eigenen Radius (schwebende Flaeche)
  expect(await radius(page.locator('.recipe-arena .nc-search__results').first())).toBe('4px')
})

test('Input-Radius LG (8px) kommt in der Searchbar an, Hoehe bleibt 44px', async ({ page }) => {
  await inputRadiusAufLg(page)
  await page.evaluate(() => { location.hash = '#/component/searchbar' })
  const feld = page.locator('.recipe-arena .nc-searchbar__input').first()
  await expect(feld).toBeVisible()
  expect(await radius(feld)).toBe('8px')
  expect(await feld.evaluate((el) => getComputedStyle(el).height)).toBe('44px')
})
