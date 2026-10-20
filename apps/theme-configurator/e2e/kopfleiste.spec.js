// Kopfleiste mit Menü „Mehr …“ — lokaler Betrieb (R05, 20.10.2026)
import { test, expect, EINSTIEG } from './hilfen.js'
import { pruefeEinzeilig, pruefeReihenfolge, mehrOeffnen, pruefeEscape, pruefeDarstellungImMenue, pruefeAxe } from './kopfleiste-pruefung.js'

const URL = `${EINSTIEG}#/component/card`

test('Kopfleiste lokal: einzeilig von 360 bis 1920 px, ab 1440 px ohne Menü', async ({ page }) => {
  const m = await pruefeEinzeilig(page, URL)
  expect(m[1440].imMenue).toEqual([])
  expect(m[1920].imMenue).toEqual([])
  await expect(page.locator('[data-test="kopf-mehr"]')).toBeHidden()
  // Reihenfolge: Seltenes zuerst ins Menü (wie AppHeader.vue, WANDERN)
  pruefeReihenfolge(m, ['loeschen', 'zusammenfuehren', 'exportieren', 'darstellung', 'arbeitsstand', 'neu'])
  expect(m[390].imMenue).toEqual(expect.arrayContaining(['neu', 'exportieren', 'zusammenfuehren', 'loeschen', 'darstellung']))
})

test('Kopfleiste lokal 390 px: Menü „Mehr …“ bedienbar, zurück in die Leiste beim Verbreitern', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 })
  await page.goto(URL)
  let panel = await mehrOeffnen(page)
  await expect(panel.getByRole('button', { name: 'Neues Theme' })).toBeVisible()
  await expect(panel.getByRole('button', { name: 'Theme löschen' })).toContainText('Theme löschen')
  await pruefeAxe(page)
  // Untermenü Exportieren klappt im Menü auf; Escape schließt erst das Untermenü
  await panel.getByRole('button', { name: /Exportieren/ }).click()
  await expect(panel.locator('[data-test="export-dtcg"]')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(panel.locator('[data-test="export-dtcg"]')).toBeHidden()
  await expect(panel).toBeVisible()
  await pruefeDarstellungImMenue(page, panel)
  await page.locator('[data-test="kopf-mehr"]').focus()
  await pruefeEscape(page)
  // Aktion im Menü schließt es: Neues Theme öffnet den Dialog
  panel = await mehrOeffnen(page)
  await panel.getByRole('button', { name: 'Neues Theme' }).click()
  await expect(page.locator('#kopf-mehr-panel')).toBeHidden()
  await expect(page.getByRole('dialog', { name: /Neues Theme/ })).toBeVisible()
  await page.keyboard.press('Escape')
  // breiter: alles zurück in die Leiste, „Mehr …“ verschwindet
  await page.setViewportSize({ width: 1600, height: 800 })
  await expect(page.locator('[data-test="kopf-mehr"]')).toBeHidden()
  await expect(page.locator('.header-toolbar [data-kopf-platz="loeschen"]')).toBeVisible()
})

for (const art of ['schmaler', 'neu']) {
  test(`Kopfleiste lokal: einzeilig auch ${art === 'neu' ? 'frisch geladen' : 'beim Verkleinern'}`, async ({ page }) => {
    const m = await pruefeEinzeilig(page, URL, art)
    expect(m[1920].imMenue).toEqual([])
  })
}
