// ==========================================================================
// Schriftrollen und Button-Abstand (20.10.2026)
// ==========================================================================
// Befund Frank: Die Schriftfamilie einer Komponente konnte nicht auf die
// Schriften unter Typografie verweisen, und „Icon Gap“ am Button blieb ohne
// Wirkung. Geprüft wird auf der Bühne mit gemessenen Werten.
// ==========================================================================
import { test, expect, oeffneSektion, warteAufRuhe } from './hilfen.js'

async function themeAnlegen (page) {
  await page.getByRole('button', { name: 'Neues Theme' }).first().click()
  const dialog = page.getByRole('dialog', { name: 'Neues Theme anlegen' })
  await dialog.getByLabel('Name des Themes').fill('E2E Schriftrollen')
  await dialog.getByRole('button', { name: 'Theme anlegen' }).click()
  await expect(dialog).toBeHidden()
}

/** Token suchen und nur zugeklappte Abschnitte/Gruppen öffnen, bis die Zeile sichtbar ist */
async function zeigeToken (page, suche, zeile) {
  await page.getByRole('searchbox', { name: 'Tokens suchen' }).fill(suche)
  const zu = page.locator('.inspector-panel :is(.inspector-section.collapsed > .inspector-section__header, .ce-subgroup-header[aria-expanded="false"]):visible')
  for (let i = 0; i < 6 && !(await zeile.isVisible()) && (await zu.count()); i++) await zu.first().click()
  await expect(zeile).toBeVisible()
}

/** Buttons der Standardgröße MD auf der Bühne: gemessener Wert */
const mdButtons = (page, eigenschaft) => page.locator('.laboratory-panel .nc-button').evaluateAll((l, e) =>
  l.filter((b) => !/nc-button--(xs|sm|lg|icon)/.test(b.className) && b.offsetParent).map((b) => getComputedStyle(b)[e]), eigenschaft)

test('Icon Gap ändert den Abstand der MD-Buttons auf der Bühne', async ({ page }) => {
  await oeffneSektion(page, 'component-button'); await warteAufRuhe(page)
  await themeAnlegen(page)
  const vorher = await mdButtons(page, 'columnGap')
  expect(vorher.length).toBeGreaterThan(0)
  expect(new Set(vorher)).toEqual(new Set(['8px']))
  const zeile = page.locator('.anatomy-row').filter({ has: page.locator('.anatomy-row__label', { hasText: /^\s*Icon Gap\s*$/ }) })
  await zeigeToken(page, 'nc-button-gap', zeile)
  await zeile.locator('.geo-select__trigger').click()
  const eigen = zeile.getByLabel('Eigener Wert')
  await eigen.fill('var(--fnd-spacing-08)'); await eigen.press('Enter')
  // spacing-08 ist fließend (32 bis 40 px): Wert der Variable auf der Bühne messen
  const soll = await page.locator('.laboratory-panel .nc-button').first().evaluate((b) => {
    const p = document.createElement('div'); p.style.width = 'var(--fnd-spacing-08)'; b.parentElement.append(p)
    const w = getComputedStyle(p).width; p.remove(); return w
  })
  expect(parseFloat(soll)).toBeGreaterThanOrEqual(32)
  await expect.poll(async () => (await mdButtons(page, 'columnGap')).every((g) => Math.abs(parseFloat(g) - parseFloat(soll)) < 0.1)).toBe(true)
})

test('Schriftfamilie der Komponente wählt eine Rolle; Bedienelemente folgt Typografie', async ({ page }) => {
  await oeffneSektion(page, 'component-button'); await warteAufRuhe(page)
  await themeAnlegen(page)
  const familie = async () => [...new Set(await mdButtons(page, 'fontFamily'))]
  expect((await familie())[0]).toMatch(/^Manrope/)
  const wahl = page.locator('[data-test="schrift-rolle-wahl"]').first()
  await zeigeToken(page, 'nc-button-font-family', wahl)
  const select = wahl.getByRole('combobox', { name: 'Font Family: Schriftrolle' })
  await expect(select).toHaveValue('var(--font-ui)')
  await select.selectOption('var(--font-mono)')
  await expect.poll(familie).toEqual([expect.stringMatching(/^"?JetBrains Mono/)])
  await select.selectOption('var(--font-ui)')
  await expect.poll(familie).toEqual([expect.stringMatching(/^Manrope/)])

  // Typografie: Bedienelemente auf Heading → Buttons folgen
  await oeffneSektion(page, 'foundation-typography'); await warteAufRuhe(page)
  const karte = page.locator('.inspector-panel [data-test="schrift-rolle-ui"]')
  await karte.getByRole('combobox', { name: 'Bedienelemente: Schriftrolle' }).selectOption('var(--font-heading)')
  await oeffneSektion(page, 'component-button'); await warteAufRuhe(page)
  await expect.poll(familie).toEqual([expect.stringMatching(/^"?Space Grotesk/)])
})
