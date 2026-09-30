// ==========================================================================
// Smoke je Sektion (Plan v2, 4.2)
// ==========================================================================
// Jede Sektion der Navigation wird per Deep-Link geoeffnet. Erwartet:
//   - die URL bleibt auf der Sektion (der Router kennt sie, kein Rueckfall
//     auf die Startsektion)
//   - Header, Labor und Inspector sind sichtbar, der Labor-Kopf nennt die
//     Sektion
//   - Labor ODER Inspector zeigen Inhalt
//   - keine Error-Boundary, keine Konsolenfehler, kein pageerror
// Die Liste kommt aus der Navigation (e2e/hilfen.js), neue Sektionen sind
// automatisch dabei.
// ==========================================================================

import { test, expect, SEKTIONEN, sektionZuPfad, oeffneSektion, unbekannteFehler, warteAufRuhe } from './hilfen.js'

test('Navigation liefert Sektionen', () => {
  // Schutz gegen eine leere Liste — dann liefe der Smoke „gruen" ohne Test
  expect(SEKTIONEN.length).toBeGreaterThan(100)
  expect(SEKTIONEN).toContain('foundation-colors')
})

for (const id of SEKTIONEN) {
  test(`Sektion ${id}`, async ({ page, fehler }) => {
    await oeffneSektion(page, id)
    await warteAufRuhe(page)

    // Router hat die Sektion angenommen
    await expect.poll(() => page.evaluate(() => location.hash.split('?')[0])).toBe('#' + sektionZuPfad(id))

    // Labor-Kopf nennt die Sektion
    await expect(page.locator('.lab-title')).toBeVisible()
    await expect(page.locator('.lab-breadcrumb-leaf')).not.toBeEmpty()
    await expect(page.locator('.error-boundary')).toHaveCount(0)

    const inhalt = await page.evaluate(() => {
      const labor = document.querySelector('.lab-viewport-inner')
      const inspector = document.querySelector('.inspector-panel')
      const kopf = inspector?.querySelector('.inspector-header')?.innerText.length || 0
      return {
        labor: labor ? labor.children.length : 0,
        laborText: (labor?.innerText || '').trim().length,
        inspectorText: (inspector?.innerText || '').trim().length - kopf,
      }
    })
    expect(inhalt.labor + Math.max(0, inhalt.inspectorText), 'Labor oder Inspector zeigt Inhalt').toBeGreaterThan(0)
    if (inhalt.labor === 0) {
      // Sichtbar im Report: Sektionen ohne Arena (Stand 30.09.2026: colors
      // ohne Auswahl, container-intent, content, media-frame, prose)
      test.info().annotations.push({ type: 'leere Arena', description: id })
    }

    expect(unbekannteFehler(fehler, id), 'Konsolenfehler/pageerror').toEqual([])
  })
}
