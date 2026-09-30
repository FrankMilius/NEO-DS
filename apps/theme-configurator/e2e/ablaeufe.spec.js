// ==========================================================================
// Kernablaeufe (Plan v2, 4.2)
// ==========================================================================
// Token aendern → Undo/Redo · Theme-Set wechseln · DTCG-Export-Dialog ·
// Import lehnt ungueltige Datei ab · Praesentations-Buehne folgt Farbwechsel
//
// Selektoren: Rollen/Texte bzw. data-test, wo vorhanden. Die Klassen-
// selektoren (.hex-input, .tss-btn, .pf-select) stammen aus den Komponenten
// und sind die einzigen stabilen Griffe, bis 4.4 Beschriftungen nachzieht.
// ==========================================================================

import { test, expect, oeffneSektion, unbekannteFehler, warteAufRuhe } from './hilfen.js'

// Undo/Redo-Knoepfe haben nur ein Icon; der Name kommt aus title/aria-label
const undoKnopf = (page) => page.locator('.app-header').getByRole('button', { name: /undo|rückgängig/i })
const redoKnopf = (page) => page.locator('.app-header').getByRole('button', { name: /redo|wiederholen/i })

test.afterEach(async ({ fehler }, info) => {
  expect(unbekannteFehler(fehler), `Konsolenfehler in „${info.title}"`).toEqual([])
})

test('Token aendern, dann Undo und Redo', async ({ page }) => {
  await oeffneSektion(page, 'foundation-colors')
  const hex = page.locator('.inspector-panel .primitive-card').first().locator('input.hex-input')
  await expect(hex).toBeVisible()
  const vorher = await hex.inputValue()
  const neu = vorher.toLowerCase() === '#c0392b' ? '#1e8449' : '#c0392b'

  await expect(undoKnopf(page)).toBeDisabled()
  await hex.fill(neu)
  await hex.press('Enter') // change-Event
  await expect(hex).toHaveValue(neu)
  await expect(undoKnopf(page)).toBeEnabled()

  await undoKnopf(page).click()
  await expect(hex).toHaveValue(vorher)
  await expect(redoKnopf(page)).toBeEnabled()

  await redoKnopf(page).click()
  await expect(hex).toHaveValue(neu)

  // Tastenkuerzel ausserhalb eines Eingabefelds
  await page.locator('.lab-title').click()
  await page.keyboard.press('Control+z')
  await expect(hex).toHaveValue(vorher)
})

test('Theme-Set wechseln (Neo → Customer) schreibt die URL', async ({ page }) => {
  await oeffneSektion(page, 'component-button')
  const neo = page.locator('.theme-set-switcher').getByRole('button', { name: 'Neo', exact: true })
  const customer = page.locator('.theme-set-switcher').getByRole('button', { name: 'Customer', exact: true })
  await expect(neo).toHaveClass(/active/)

  await customer.click()
  await expect(customer).toHaveClass(/active/)
  await expect(neo).not.toHaveClass(/active/)
  await expect(page).toHaveURL(/#\/component\/button\?set=customer/)

  // Deep-Link mit Set stellt es beim Laden wieder her
  await page.goto('about:blank')
  await oeffneSektion(page, 'component-button', 'set=customer')
  await expect(page.locator('.theme-set-switcher').getByRole('button', { name: 'Customer', exact: true })).toHaveClass(/active/)
})

test('Export-Dialog DTCG oeffnet und zeigt das Ergebnis', async ({ page }) => {
  await oeffneSektion(page, 'foundation-colors')
  await page.locator('.app-header').getByRole('button', { name: /export/i }).click()
  await page.locator('[data-test="export-dtcg"]').click()

  const dialog = page.getByRole('dialog', { name: /DTCG-Export/ })
  await expect(dialog).toBeVisible()
  await expect(dialog.getByRole('button', { name: 'Herunterladen' })).toBeEnabled()
  await expect(dialog.locator('[data-test="dtcg-fehler"]')).toHaveCount(0)

  await dialog.getByRole('button', { name: 'Abbrechen' }).click()
  await expect(dialog).toBeHidden()
})

test('Import-Dialog lehnt eine ungueltige Datei ab', async ({ page }) => {
  await oeffneSektion(page, 'foundation-colors')
  await page.locator('.app-header').getByRole('button', { name: /export/i }).click()
  await page.locator('[data-test="import-theme"]').click()

  const dialog = page.getByRole('dialog', { name: /Theme importieren/ })
  await expect(dialog).toBeVisible()

  await dialog.locator('[data-test="import-datei"]').setInputFiles({
    name: 'kaputt.json',
    mimeType: 'application/json',
    buffer: Buffer.from('{ "das ist": kein JSON'),
  })
  await expect(dialog.locator('[data-test="import-fehler"]')).toBeVisible()
  await expect(dialog.locator('[data-test="import-fehler"]')).toContainText('Import abgelehnt')
  await expect(dialog.locator('[data-test="import-uebernehmen"]')).toBeDisabled()

  // Gueltiges JSON, aber kein Theme-Export: ebenfalls abgelehnt
  await dialog.locator('[data-test="import-datei"]').setInputFiles({
    name: 'fremd.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify({ hallo: 'welt' })),
  })
  await expect(dialog.locator('[data-test="import-fehler"]')).toBeVisible()
  await expect(dialog.locator('[data-test="import-uebernehmen"]')).toBeDisabled()
})

test('Praesentations-Buehne reagiert auf Farbwechsel im Inspector', async ({ page }) => {
  await oeffneSektion(page, 'foundation-praesentation')
  await warteAufRuhe(page)
  const buehne = page.locator('[data-test="buehne"]')
  await expect(buehne).toBeVisible()
  const reihe1 = () => buehne.evaluate((el) => el.style.getPropertyValue('--p-reihe-1').trim())
  const vorher = await reihe1()
  expect(vorher, '--p-reihe-1 gesetzt').not.toBe('')

  // Erste Position der Diagramm-Farbfolge: andere Palette waehlen
  const gruppe = page.locator('.inspector-panel section').filter({ hasText: 'Diagramm · Farbfolge' })
  const palette = gruppe.locator('select.pf-select').first()
  const aktuell = await palette.inputValue()
  const optionen = await palette.locator('option:not([disabled])').evaluateAll((os) => os.map((o) => o.value))
  const ziel = optionen.find((o) => o && o !== aktuell)
  expect(ziel, 'Alternative Palette vorhanden').toBeTruthy()
  await palette.selectOption(ziel)

  // Die Buehne rechnet Reihe 1 neu — ohne Neuladen
  await expect.poll(reihe1).not.toBe(vorher)
  expect(await reihe1()).not.toBe('')
})
