// ==========================================================================
// Erlaubte Bereiche dauerhaft am Feld (Roadmap R06, 20.10.2026)
// ==========================================================================
// Felder mit festen Grenzen nennen ihren Bereich vor der Eingabe — sichtbar
// und als Beschreibung des Felds (aria-describedby). Vorher erst in der
// Fehlermeldung (UX-03). Texte aus utils/token-pruefung.js.
// ==========================================================================
import { test, expect, oeffneSektion, warteAufRuhe } from './hilfen.js'

/** ids der Hinweise sind auf der Seite eindeutig (Editoren stehen teils doppelt) */
async function idsEindeutig (page) {
  const ids = await page.locator('[data-test="feld-bereich"]').evaluateAll((l) => l.map((e) => e.id))
  expect(ids.length).toBeGreaterThan(0)
  expect(new Set(ids).size, `doppelte ids: ${ids}`).toBe(ids.length)
}

test('Deckkraft und Ebenen: Bereich über der Liste, an jedem Feld vorgelesen', async ({ page }) => {
  await oeffneSektion(page, 'foundation-opacity'); await warteAufRuhe(page)
  const deckkraft = page.getByRole('textbox', { name: /^Deckkraft / }).first()
  await expect(deckkraft).toHaveAccessibleDescription('Erlaubt: 0 bis 1, z. B. 0.5')
  await expect(page.getByRole('textbox', { name: /^Z-Index / }).first()).toHaveAccessibleDescription(/Erlaubt: ganze Zahlen von −1 bis 99999/)
  await expect(page.getByText('Erlaubt: 0 bis 1, z. B. 0.5').first()).toBeVisible()
  await idsEindeutig(page)
  // Fehlermeldung nennt weiter denselben Bereich
  await deckkraft.fill('2'); await deckkraft.press('Enter')
  await expect(page.getByRole('alert').filter({ hasText: 'zwischen 0 und 1' })).toBeVisible()
})

test('Grid-Spalten: Bereich am Feld', async ({ page }) => {
  await oeffneSektion(page, 'foundation-grid'); await warteAufRuhe(page)
  const feld = page.getByRole('spinbutton', { name: 'Spaltenanzahl' })
  await expect(feld).toHaveAccessibleDescription('Erlaubt: ganze Zahlen von 1 bis 24')
  await expect(feld).toHaveAttribute('step', '1')
  await idsEindeutig(page)
})

test('Schriftskala: Bereich je Feld, eindeutig auf Bühne und in den Einstellungen', async ({ page }) => {
  await oeffneSektion(page, 'foundation-typography'); await warteAufRuhe(page)
  const basis = page.getByRole('spinbutton', { name: /^Basis bei/ })
  const verhaeltnis = page.getByRole('spinbutton', { name: /^Verhältnis/ })
  expect(await basis.count()).toBeGreaterThan(1)
  for (const f of await basis.all()) await expect(f).toHaveAccessibleDescription('Erlaubt: 10 bis 32 px')
  for (const f of await verhaeltnis.all()) await expect(f).toHaveAccessibleDescription('Erlaubt: 1 bis 1,618')
  // Der Hinweis gehört nicht zum Feldnamen
  await expect(basis.first()).not.toHaveAccessibleName(/Erlaubt/)
  await idsEindeutig(page)
})

test('Komponenten: Deckkraft und Schriftstärke nennen ihren Bereich nach dem Öffnen', async ({ page }) => {
  await oeffneSektion(page, 'component-badge'); await warteAufRuhe(page)
  const suche = page.getByRole('searchbox', { name: 'Tokens suchen' })
  for (const [token, text] of [['pulse-opacity', 'Erlaubt: 0 bis 1 oder 0 bis 100 %'], ['status-font-weight', 'Erlaubt: 100 bis 900']]) {
    await suche.fill(token)
    // Treffer liegt in einer zugeklappten Gruppe: aufklappen, bis die Zeile sichtbar ist
    const zeile = page.locator('.token-row').first()
    // Abschnitt und darin die Untergruppe aufklappen (nach der Suche gibt es je Ebene nur einen Treffer)
    const geklickt = new Set()
    for (let i = 0; i < 4 && !(await zeile.isVisible()); i++) {
      const koepfe = await page.locator(':is(.inspector-section__header, .ce-subgroup-header):visible').all()
      const naechster = []
      for (const k of koepfe) { const t = (await k.textContent()).trim(); if (!geklickt.has(t)) naechster.push([k, t]) }
      if (!naechster.length) break
      geklickt.add(naechster[0][1]); await naechster[0][0].click()
    }
    await zeile.click()
    const feld = page.locator('.inline-editor .generic-input').first()
    await expect(feld).toHaveAccessibleDescription(text)
    await expect(page.locator('.inline-editor').getByText(text)).toBeVisible()
  }
  await idsEindeutig(page)
})
