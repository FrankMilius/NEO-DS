// ==========================================================================
// App-Darstellung Hell · Dunkel · Wie System (Roadmap R03, 20.10.2026)
// ==========================================================================
// 1. Schalter in der Kopfleiste: Optionsgruppe, gemerkt, „Wie System“ folgt
//    der Systemeinstellung.
// 2. Dunkel setzt am Dokument dieselben --fnd-*-Werte wie ein Bereich mit
//    .neo-dark-theme — aber nicht die Klasse (sie gestaltet auch Elemente).
// 3. Die Bühne bleibt unverändert: Bauteile des Design Systems haben in
//    beiden App-Darstellungen dieselben berechneten Stile.
// 4. Keine Kontrastfehler der App-Oberfläche im Dunkeln (axe, Bühne
//    ausgenommen wie in axe.spec.js).
// ==========================================================================
import AxeBuilder from '@axe-core/playwright'
import { test, expect, oeffneSektion, warteAufRuhe, EINSTIEG } from './hilfen.js'

const SCHLUESSEL = 'neo-cfg-app-darstellung'
// setzt den Wert vor dem ersten Laden; spätere Änderungen in der Seite bleiben
const setze = (page, wert) => page.addInitScript(([k, w]) => { if (!sessionStorage.getItem('gesetzt')) { localStorage.setItem(k, w); sessionStorage.setItem('gesetzt', '1') } }, [SCHLUESSEL, wert])
// Ruhe ohne networkidle: In der dunklen App mit reduzierter Bewegung meldet
// Playwright für den Geräterahmen (leeres iframe, kopierte Stylesheets) in
// etwa jedem zweiten Lauf kein networkidle, obwohl Seite, Rahmen und alle
// Anfragen fertig sind (geprüft 20.10.2026). Sichtbar ist das nicht.
const ruhe = async (page) => {
  await page.waitForLoadState('load')
  await page.evaluate(() => document.fonts?.ready)
}
const html = (page) => page.evaluate(() => ({ darstellung: document.documentElement.dataset.appDarstellung, theme: document.documentElement.dataset.theme, klassen: document.documentElement.className }))

test('App-Darstellung: Schalter, gemerkt, „Wie System“ folgt dem System', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.goto(EINSTIEG)
  const gruppe = page.getByRole('radiogroup', { name: 'App-Darstellung' })
  await expect(gruppe.getByRole('radio', { name: 'Wie System' })).toHaveAttribute('aria-checked', 'true')
  expect(await html(page)).toMatchObject({ darstellung: 'dunkel', theme: 'dark' })
  await page.emulateMedia({ colorScheme: 'light' })
  await expect.poll(async () => (await html(page)).darstellung).toBe('hell')

  await gruppe.getByRole('radio', { name: 'Dunkel' }).click()
  expect(await html(page)).toMatchObject({ darstellung: 'dunkel', theme: 'dark' })
  await page.reload()
  await expect(page.getByRole('radiogroup', { name: 'App-Darstellung' }).getByRole('radio', { name: 'Dunkel' })).toHaveAttribute('aria-checked', 'true')
  expect((await html(page)).darstellung).toBe('dunkel')

  // Pfeiltaste: Dunkel → Wie System (Muster radiogroup), Fokus wandert mit
  await page.getByRole('radio', { name: 'Dunkel' }).focus()
  await page.keyboard.press('ArrowRight')
  await expect(page.getByRole('radio', { name: 'Wie System' })).toBeFocused()
  await expect(page.getByRole('radio', { name: 'Wie System' })).toHaveAttribute('aria-checked', 'true')
  expect((await html(page)).darstellung).toBe('hell')
})

test('App-Darstellung Dunkel: Werte des dunklen NEO-Themes, ohne Theme-Klasse', async ({ page }) => {
  await setze(page, 'dunkel')
  await page.goto(EINSTIEG)
  await expect(page.locator('.app-header')).toBeVisible()
  const r = await page.evaluate(() => {
    const namen = new Set()
    for (const sh of document.styleSheets) {
      try { for (const t of sh.cssRules) t.cssText.match(/--fnd-[a-z0-9-]+(?=\s*:)/g)?.forEach((x) => namen.add(x)) } catch { /* fremdes Blatt */ }
    }
    const probe = document.createElement('div'); probe.className = 'neo-dark-theme'; document.body.append(probe)
    const a = getComputedStyle(document.documentElement), b = getComputedStyle(probe)
    const abw = [...namen].filter((n) => a.getPropertyValue(n).trim() !== b.getPropertyValue(n).trim())
    probe.remove()
    return { anzahl: namen.size, abw, klassen: document.documentElement.className }
  })
  expect(r.anzahl).toBeGreaterThan(400)
  expect(r.abw.slice(0, 10), `${r.abw.length} --fnd-Werte weichen vom dunklen NEO-Theme ab`).toEqual([])
  expect(r.klassen).not.toMatch(/neo-(light|dark)-theme/)
})

// Bühnen mit eigenen Darstellungen (Sonderfälle) und je eine Arena pro Ebene
// (Kachel-Bühnen ohne Komponentenklassen wie Farben und Typografie prüft der
// Bildvergleich; dort steht die Bühne ebenfalls in ihrer eigenen Theme-Klasse)
const BUEHNEN = ['component-card', 'component-button', 'component-footer', 'component-data-table', 'component-accordion', 'component-hero', 'foundation-themes', 'foundation-elements']
const messen = (page) => page.evaluate(() => {
  const P = ['color', 'background-color', 'border-top-color', 'box-shadow', 'font-family', 'font-size']
  const aus = {}
  const lies = (doc, praefix, sel) => [...doc.querySelectorAll(sel)].slice(0, 400)
    .forEach((e, i) => { const s = doc.defaultView.getComputedStyle(e); aus[`${praefix}${i}:${e.tagName}.${String(e.className).slice(0, 50)}`] = P.map((p) => s.getPropertyValue(p)).join('|') })
  lies(document, '', '.lab-viewport [class*="nc-"], .lab-viewport .wa-seite *')
  document.querySelectorAll('.lab-viewport iframe').forEach((f, k) => { try { lies(f.contentDocument, `f${k}:`, '[class*="nc-"]') } catch { /* fremd */ } })
  return aus
})

for (const id of BUEHNEN) {
  test(`App-Darstellung: Bühne ${id} bleibt unverändert`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    const werte = {}
    await setze(page, 'hell')
    await oeffneSektion(page, id)
    for (const d of ['hell', 'dunkel']) {
      // neu laden statt erneut öffnen: ein zweites goto auf dieselbe Seite
      // ändert nur den Hash und lädt nicht neu
      if (d === 'dunkel') {
        await page.evaluate(([k]) => localStorage.setItem(k, 'dunkel'), [SCHLUESSEL])
        await page.reload()
      }
      await expect.poll(async () => (await html(page)).darstellung).toBe(d)
      await ruhe(page)
      // Geräterahmen „Desktop“ lädt seinen Inhalt etwas später
      await expect.poll(async () => Object.keys(await messen(page)).length, { message: 'keine Bauteile auf der Bühne gemessen' }).toBeGreaterThan(0)
      await page.waitForTimeout(200)
      werte[d] = await messen(page)
    }
    const schluessel = Object.keys(werte.hell)
    expect(Object.keys(werte.dunkel).length).toBe(schluessel.length)
    const abw = schluessel.filter((k) => werte.hell[k] !== werte.dunkel[k])
    expect(abw.slice(0, 5).map((k) => `${k}: ${werte.hell[k]} → ${werte.dunkel[k]}`)).toEqual([])
  })
}

const KONTRAST = ['component-card', 'component-badge', 'foundation-colors', 'foundation-icons', 'foundation-focus', 'foundation-grid', 'foundation-spacing', 'foundation-typography']
for (const id of KONTRAST) {
  test(`App-Darstellung Dunkel: keine Kontrastfehler (${id})`, async ({ page }) => {
    await setze(page, 'dunkel')
    await oeffneSektion(page, id)
    await warteAufRuhe(page)
    const r = await new AxeBuilder({ page }).withRules(['color-contrast']).exclude('.lab-viewport').analyze()
    expect(r.violations.flatMap((v) => v.nodes.map((n) => `${n.target.join(' ')}: ${n.any[0]?.message}`))).toEqual([])
  })
}

test('App-Darstellung Dunkel: ganze App (Card)', { tag: '@visuell' }, async ({ page }) => {
  await setze(page, 'dunkel')
  await oeffneSektion(page, 'component-card')
  await warteAufRuhe(page)
  await page.mouse.move(0, 0)
  await expect(page).toHaveScreenshot('app-dunkel-component-card.png')
})
