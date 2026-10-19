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
const redoKnopf = (page) => page.locator('.app-header').getByRole('button', { name: /redo|wiederholen|wiederherstellen/i })

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
  const neo = page.locator('.theme-set-switcher').getByRole('button', { name: 'NEO', exact: true })
  const customer = page.locator('.theme-set-switcher').getByRole('button', { name: 'Kunde', exact: true })
  await expect(neo).toHaveClass(/active/)

  await customer.click()
  await expect(customer).toHaveClass(/active/)
  await expect(neo).not.toHaveClass(/active/)
  await expect(page).toHaveURL(/#\/component\/button\?set=customer/)

  // Deep-Link mit Set stellt es beim Laden wieder her
  await page.goto('about:blank')
  await oeffneSektion(page, 'component-button', 'set=customer')
  await expect(page.locator('.theme-set-switcher').getByRole('button', { name: 'Kunde', exact: true })).toHaveClass(/active/)
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

// Roadmap V01 (19.10.2026): Geräteansicht in einem eigenen Frame — die
// Medienabfragen des Design Systems sehen die Gerätebreite.
test('V01: Handy-Breite rendert die Arena im Frame mit 390 px Fenster; Vollbild und Escape', async ({ page }) => {
  await oeffneSektion(page, 'component-hero')
  await page.getByRole('radio', { name: 'Handy' }).click()
  const rahmen = page.locator('iframe.br-rahmen')
  await expect(rahmen).toHaveAttribute('title', 'Vorschau in 390 px Breite')
  const frame = page.frameLocator('iframe.br-rahmen')
  await expect(frame.locator('.recipe-arena .nc-hero').first()).toBeVisible()
  const fenster = await rahmen.evaluate((f) => [f.contentWindow.innerWidth, f.contentWindow.innerHeight, f.contentDocument.documentElement.scrollWidth])
  expect(fenster).toEqual([390, 844, 390])

  const vollbild = page.getByRole('button', { name: 'Vollbild' })
  await vollbild.click()
  await expect(page.locator('.laboratory-panel')).toHaveClass(/laboratory-panel--fullscreen/)
  await page.keyboard.press('Escape')
  await expect(page.locator('.laboratory-panel')).not.toHaveClass(/laboratory-panel--fullscreen/)
  await expect(vollbild).toBeFocused()

  await page.getByRole('radio', { name: 'Voll' }).click()
  await expect(rahmen).toHaveCount(0)
  await expect(page.locator('.lab-viewport .recipe-arena')).toBeVisible()
})

// Roadmap V02 (19.10.2026): Wirkung auf der Website, Kurztexte, technische Namen
test('V02: Button nennt seine Orte auf der Website; technische Namen lassen sich ausblenden', async ({ page }) => {
  await oeffneSektion(page, 'component-button')
  const insp = page.locator('.inspector-panel')
  await expect(insp.locator('[data-test="website-einsatz-bloecke"]')).toContainText('Hero')
  await insp.locator('.ce-subgroup-header').first().click()
  await expect(insp.locator('[data-test="gruppen-wirkung"]').first()).toContainText('Steuert')
  await expect(insp.locator('[data-test="website-einsatz-dateien"]')).toBeVisible()
  await insp.getByLabel('Technische Namen zeigen').uncheck()
  await expect(insp.locator('[data-test="website-einsatz-dateien"]')).toHaveCount(0)
  await insp.getByLabel('Technische Namen zeigen').check()
})

// Roadmap V03 (19.10.2026): Vorschau → passende Token-Gruppe im Inspector
test('V03: Enter auf der Beschriftung einer Zelle öffnet ihre Gruppe im Inspector und setzt den Fokus', async ({ page }) => {
  await oeffneSektion(page, 'component-button')
  const knopf = page.locator('[data-test="zu-token"]').first()
  await expect(knopf).toHaveAccessibleName(/Einstellungen öffnen/)
  await knopf.focus()
  await page.keyboard.press('Enter')
  const insp = page.locator('.inspector-panel')
  await expect(insp.locator('.context-label')).toContainText('primary')
  await expect(insp.locator('.ce-subgroup-header[aria-expanded="true"]', { hasText: 'Primary' })).toBeFocused()
  await insp.getByRole('button', { name: 'Alle zeigen' }).click()
  await expect(insp.locator('.context-label')).toHaveCount(0)
})

// Roadmap V04 (19.10.2026): Bühne = Wirkung, Inspector = Eingabe
test('V04: Foundation-Bühnen ohne Token-Eingaben; Bereiche ohne Eingaben sagen „Nur Ansicht“', async ({ page }) => {
  for (const s of ['radius', 'spacing', 'size', 'focus', 'media', 'opacity', 'icons', 'surfaces']) {
    await oeffneSektion(page, `foundation-${s}`)
    await expect(page.locator('.inspector-panel').getByRole('textbox').or(page.locator('.inspector-panel').getByRole('combobox')).first()).toBeVisible()
    await expect(page.locator('.lab-viewport').getByRole('textbox')).toHaveCount(0)
    await expect(page.locator('.lab-viewport').getByRole('combobox')).toHaveCount(0)
  }
  for (const s of ['border', 'shadows', 'elements', 'themes']) {
    await oeffneSektion(page, `foundation-${s}`)
    await expect(page.locator('.inspector-panel [data-test="nur-ansicht-bereich"]')).toContainText('Nur Ansicht')
  }
})

// Roadmap V05 (19.10.2026): Seitenvorlagen als ein Bereich, Utilities nicht in der Navigation
test('V05: Seitenvorlagen zeigen alle Skizzen; Utilities stehen nicht in der Navigation', async ({ page }) => {
  await oeffneSektion(page, 'template-content-templates')
  await expect(page.locator('[data-test="template-uebersicht"] .template-placeholder')).toHaveCount(6)
  await expect(page.locator('.inspector-panel [data-test="nur-ansicht-bereich"]')).toContainText('keine eigenen Werte')
  await expect(page.locator('.inspector-panel')).toContainText('Seitenvorlagen')
  await expect(page.locator('.sidebar-nav').getByText('Utilities', { exact: true })).toHaveCount(0)
})

// UX-58 / UX-59 (19.10.2026): kein Überlauf auf 390 px; ausgeblendete Bauteile erklärt
test('UX-58/59: Tabs und Navigationsmenü laufen auf 390 px nicht über; ausgeblendetes Menü mit Hinweis', async ({ page }) => {
  await oeffneSektion(page, 'component-tabs')
  await page.getByRole('radio', { name: 'Handy' }).click()
  const rahmen = page.locator('iframe.br-rahmen')
  await expect(page.frameLocator('iframe.br-rahmen').locator('.nc-tabs').first()).toBeVisible()
  expect(await rahmen.evaluate((f) => f.contentDocument.documentElement.scrollWidth)).toBe(390)
  await oeffneSektion(page, 'component-navigation-menu')
  // 19.10.2026: Organismen öffnen im Rahmen „Desktop“; die Breite gilt je Bereich
  await expect(page.getByRole('radio', { name: 'Desktop' })).toHaveAttribute('aria-checked', 'true')
  await page.getByRole('radio', { name: 'Handy' }).click()
  const frame = page.frameLocator('iframe.br-rahmen')
  await expect(frame.locator('.ra-live-component[data-ausgeblendet]').first()).toBeAttached()
  expect(await rahmen.evaluate((f) => f.contentDocument.documentElement.scrollWidth)).toBe(390)
  await page.getByRole('radio', { name: 'Desktop' }).click()
  await expect(page.frameLocator('iframe.br-rahmen').locator('.ra-live-component').first()).toBeAttached()
  await expect(page.frameLocator('iframe.br-rahmen').locator('.ra-live-component[data-ausgeblendet]')).toHaveCount(0)
})

// UX-20 (19.10.2026): „Technische Namen zeigen“ gilt überall
test('UX-20: technische Namen lassen sich auch in den Foundation-Editoren ausblenden', async ({ page }) => {
  await oeffneSektion(page, 'foundation-radius')
  const insp = page.locator('.inspector-panel')
  await expect(insp.locator('.re-token-name').first()).toBeVisible()
  await insp.getByLabel('Technische Namen zeigen').uncheck()
  await expect(insp.locator('.re-token-name').first()).toBeHidden()
  await oeffneSektion(page, 'foundation-spacing')
  await expect(page.locator('.inspector-panel .si-token-name').first()).toBeHidden()
  await page.locator('.inspector-panel').getByLabel('Technische Namen zeigen').check()
  await expect(page.locator('.inspector-panel .si-token-name').first()).toBeVisible()
})

test('UX-52: Paletten- und Icon-Formular — Tastatur, Fehler am Feld, Escape gibt den Fokus zurück', async ({ page }) => {
  await oeffneSektion(page, 'foundation-colors')
  const insp = page.locator('.inspector-panel')
  await insp.getByRole('tab', { name: 'Grundfarben' }).click()
  const form = insp.locator('[data-test="ergaenzende-palette-neu"]')
  const knopf = form.getByRole('button', { name: 'Ergänzende Palette hinzufügen' })
  await knopf.click()
  await expect(form.getByLabel('Name')).toBeFocused()
  await page.keyboard.type('Primary')
  await page.keyboard.press('Enter')
  await expect(form.getByRole('alert')).toContainText('gibt es schon')
  await expect(form.getByLabel('Name')).toHaveAttribute('aria-invalid', 'true')
  await page.keyboard.press('Escape')
  await expect(knopf).toBeFocused()

  await oeffneSektion(page, 'foundation-icons')
  const icons = page.locator('.inspector-panel [data-test="icon-bibliothek-neu"]')
  await icons.getByRole('button', { name: 'SVG-Icon-Bibliothek hinzufügen' }).click()
  await page.keyboard.type('Lucide Icons')
  await page.keyboard.press('Tab')
  await page.keyboard.type('lucide-static')
  await page.keyboard.press('Enter')
  await expect(page.locator('.inspector-panel')).toContainText('Lucide Icons')
  await expect(icons.getByRole('button', { name: 'SVG-Icon-Bibliothek hinzufügen' })).toBeFocused()
})

test('UX-34: Grundfarben — Bühne zeigt Paletten und Website-Ausschnitt; Ändern und Zurücksetzen sind nachvollziehbar', async ({ page }) => {
  await oeffneSektion(page, 'foundation-colors')
  const buehne = page.locator('[data-test="grundfarben-buehne"]')
  await expect(buehne).toBeVisible()
  const akzent = buehne.locator('[data-test="grundfarben-palette-accent"]')
  await expect(akzent.locator('strong')).toHaveText('Akzent · Neo Lime')
  const hex = page.locator('.inspector-panel').getByRole('textbox', { name: 'Akzent: HEX-Wert' })
  await hex.fill('#e06060')
  await hex.press('Enter')
  await expect(akzent.locator('strong')).toHaveText('Akzent · eigene Farbe')
  await expect(akzent.locator('.gb-leiste').first().locator('li')).toHaveCount(11)
  await expect(page.locator('[data-test="grundfarben-website-hell"] .gb-knopf').nth(1)).toHaveCSS('background-color', 'rgb(224, 96, 96)')
  await page.locator('.inspector-panel').getByRole('button', { name: 'Akzent auf NEO-Standard zurücksetzen' }).click()
  await expect(akzent.locator('strong')).toHaveText('Akzent · Neo Lime')
})

test('Bühne = Ausschnitt der Website: Organismen im Rahmen „Desktop“, HTML-Elemente und Themes als echtes Markup', async ({ page }) => {
  await oeffneSektion(page, 'component-hero')
  await expect(page.getByRole('radio', { name: 'Desktop' })).toHaveAttribute('aria-checked', 'true')
  await expect(page.frameLocator('iframe.br-rahmen').locator('.ra-live-component').first()).toBeVisible()
  await oeffneSektion(page, 'component-button')
  await expect(page.getByRole('radio', { name: 'Voll' })).toHaveAttribute('aria-checked', 'true')

  await oeffneSektion(page, 'foundation-elements')
  const elemente = page.locator('[data-test="elemente-buehne"]')
  await expect(elemente.locator('h1')).toHaveText('Überschrift 1')
  await expect(elemente.locator('h1')).toHaveCSS('font-family', /Space Grotesk/)
  await page.getByRole('radio', { name: 'Hell und Dunkel nebeneinander' }).click()
  await expect(elemente.locator('.neo-dark-theme')).toHaveCount(1)

  await oeffneSektion(page, 'foundation-themes')
  await expect(page.locator('[data-test="themes-buehne"] .nc-card--navigational')).toHaveCount(4)
})
