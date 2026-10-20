// Kopfleiste mit Menü „Mehr …“ — Drupal-Betrieb gegen die Attrappe (R05, 20.10.2026)
import { test, expect } from './hilfen.js'
import { pruefeEinzeilig, mehrOeffnen, pruefeEscape, pruefeDarstellungImMenue, pruefeAxe } from './kopfleiste-pruefung.js'

const URL = '/konfigurator?rechte=ansehen,bearbeiten,veroeffentlichen#/component/card'

test('Kopfleiste Drupal: einzeilig von 360 bis 1920 px — vorher lief sie bei 1440 px über', async ({ page }) => {
  const m = await pruefeEinzeilig(page, URL)
  expect(m[1920].imMenue).toEqual([])
  // Veröffentlichen bleibt bei 1440 px in der Leiste, Website öffnen wandert zuerst
  expect(m[1440].imMenue).not.toContain('veroeffentlichen')
  expect(m[1440].imMenue).toContain('website')
})

test('Kopfleiste Drupal 390 px: Veröffentlichen, Vorschau und Website im Menü bedienbar', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 })
  await page.goto(URL)
  // Speichern und Status bleiben in der Leiste (Text nur vorgelesen)
  await expect(page.locator('.header-toolbar [data-test="drupal-speichern"]')).toBeVisible()
  await expect(page.locator('[data-test="drupal-status"]')).toHaveAccessibleName(/./)
  const panel = await mehrOeffnen(page)
  await expect(panel.locator('[data-test="drupal-veroeffentlichen"]')).toBeVisible()
  await expect(panel.locator('[data-test="drupal-website"]')).toBeVisible()
  await pruefeAxe(page)
  // Umschalter im Menü wirkt wie in der Leiste: er ruft die Vorschau-Schnittstelle.
  // (Nicht das Ergebnis prüfen — die Attrappe teilt den Vorschau-Zustand mit
  // parallel laufenden Tests.)
  const anfrage = page.waitForRequest((r) => /\/vorschau(\?|$)/.test(r.url()) && r.method() !== 'GET')
  await panel.locator('[data-test="drupal-vorschau"]').click()
  await anfrage
  await mehrOeffnen(page)
  await pruefeDarstellungImMenue(page, page.locator('#kopf-mehr-panel'))
  await page.locator('[data-test="kopf-mehr"]').focus()
  await pruefeEscape(page)
})

for (const art of ['schmaler', 'neu']) {
  test(`Kopfleiste Drupal: einzeilig auch ${art === 'neu' ? 'frisch geladen' : 'beim Verkleinern'}`, async ({ page }) => {
    const m = await pruefeEinzeilig(page, URL, art)
    expect(m[1920].imMenue).toEqual([])
  })
}
