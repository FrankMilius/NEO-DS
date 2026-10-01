// ==========================================================================
// Drupal-Betrieb gegen die Drupal-Attrappe (Plan v2, 2.6, Teil 2)
// ==========================================================================
// Projekt „drupal“ (playwright.config.js): die Attrappe
// scripts/drupal-attrappe.mjs bildet den Vertrag 1.0.0 im Speicher nach und
// startet die gebaute App mit window.NEO_KONFIGURATOR = { speicher: 'drupal',
// basisUrl, csrfToken, rechte } (Rechte per ?rechte=…, als Cookie gemerkt).
//
// Abgedeckt: Theme anlegen → ändern → speichern · zweiter Kontext ändert →
// Konfliktdialog (Abbrechen / Neu laden) · NEO-Standard besteht · Theme mit
// weißer Schrift auf Statusflächen: Befund und Server-Tor (422) ·
// korrigiertes Theme veröffentlichen + aktivieren · nur „ansehen“ →
// schreibgeschützt · Branches/Releases ausgeblendet · axe ohne Befund.
// ==========================================================================

import AxeBuilder from '@axe-core/playwright'
import { test, expect, sektionZuPfad, unbekannteFehler, warteAufRuhe } from './hilfen.js'

const API = '/api/neo-theme-konfigurator/v1'
const ALLE = 'ansehen,bearbeiten,veroeffentlichen'

// Erwartete Ablehnungen des Servers erscheinen als Konsolenfehler des Browsers
// („Failed to load resource … 412“). Nur diese Status sind hier erlaubt.
const ERWARTETE_STATUS = /the server responded with a status of (412|422)\b/

test.afterEach(async ({ fehler }, info) => {
  const rest = unbekannteFehler(fehler).filter((f) => !ERWARTETE_STATUS.test(f.text))
  expect(rest, `Konsolenfehler in „${info.title}"`).toEqual([])
})

const eindeutig = (praefix) => `${praefix} ${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`

/** App im Drupal-Betrieb öffnen (Sektion per Hash). */
async function oeffneDrupal (page, { rechte = ALLE, sektion = 'foundation-colors' } = {}) {
  await page.goto(`/konfigurator?rechte=${rechte}#${sektionZuPfad(sektion)}`)
  await expect(page.locator('.app-header')).toBeVisible()
  await expect(page.locator('.inspector-panel')).toBeVisible()
  await expect(page.locator('[data-test="drupal-theme-auswahl"]')).toBeVisible()
}

/** Zweiter Browser-Kontext (andere Person), externe Anfragen abgebrochen. */
async function zweiteSitzung (browser, baseURL) {
  const context = await browser.newContext({ baseURL, viewport: { width: 1440, height: 900 }, locale: 'de-DE' })
  const eigen = new URL(baseURL).origin
  await context.route((url) => url.origin !== eigen, (route) => route.abort())
  return context
}

const status = (page) => page.locator('[data-test="drupal-status"]')
const primaerHex = (page) => page.locator('.inspector-panel .primitive-card').first().locator('input.hex-input')
// Benannte Themes zeigen unter Farben keine NEO-Paletten; geändert wird
// deshalb ein Radius im Labor (Sektion foundation-radius)
const radiusXs = (page) => page.getByRole('textbox', { name: 'Radius XS' })

async function setzeRadius (page, wert) {
  const feld = radiusXs(page)
  await feld.fill(wert)
  await feld.press('Enter')
  await expect(feld).toHaveValue(wert)
}

async function themeOeffnen (page, name) {
  await page.locator('[data-test="drupal-theme-auswahl"]').click()
  await page.getByRole('region', { name: 'Themes in Drupal' }).getByRole('button', { name: new RegExp(`^${name} öffnen`) }).click()
  await expect(page.locator('[data-test="drupal-theme-auswahl"]')).toContainText(name)
  await expect(status(page)).toHaveAttribute('data-status', 'gespeichert')
}

async function themeAnlegen (page, name) {
  await page.locator('[data-test="drupal-theme-auswahl"]').click()
  await page.locator('[data-test="drupal-neu"]').click()
  const dialog = page.getByRole('dialog', { name: 'Neues Theme anlegen' })
  await expect(dialog).toBeVisible()
  await dialog.getByLabel('Name').fill(name)
  await dialog.getByRole('button', { name: 'Anlegen' }).click()
  await expect(dialog).toBeHidden()
  await expect(page.locator('[data-test="drupal-theme-auswahl"]')).toContainText(name)
  await expect(status(page)).toHaveAttribute('data-status', 'gespeichert')
}

/** Theme direkt über die Schnittstelle anlegen (Testdaten). */
async function themePerApi (request, name, abweichungen) {
  const token = (await (await request.get('/session/token')).text()).trim()
  const res = await request.post(`${API}/themes`, {
    headers: { 'X-CSRF-Token': token, 'X-Neo-Rechte': ALLE },
    data: { meta: { name, version: '1.0.0' }, abweichungen },
  })
  expect(res.status()).toBe(201)
  return { token, dok: await res.json(), etag: res.headers().etag }
}

test('Theme anlegen, ändern, speichern — zweite Sitzung ändert → Konfliktdialog', async ({ page, browser, baseURL }) => {
  const name = eindeutig('E2E Konflikt')
  await oeffneDrupal(page, { sektion: 'foundation-radius' })
  await expect(status(page)).toHaveAttribute('data-status', 'ohne-theme')

  await themeAnlegen(page, name)
  await setzeRadius(page, '3px')
  await expect(status(page)).toHaveAttribute('data-status', 'ungespeichert')
  await expect(status(page)).toHaveText(/Ungespeicherte Änderungen/)
  await page.keyboard.press('Control+s')
  await expect(status(page)).toHaveAttribute('data-status', 'gespeichert')

  // Zweite Person öffnet dasselbe Theme, ändert und speichert
  const kontextB = await zweiteSitzung(browser, baseURL)
  const seiteB = await kontextB.newPage()
  await oeffneDrupal(seiteB, { sektion: 'foundation-radius' })
  await themeOeffnen(seiteB, name)
  await expect(radiusXs(seiteB)).toHaveValue('3px')
  await setzeRadius(seiteB, '5px')
  await seiteB.locator('[data-test="drupal-speichern"]').click()
  await expect(status(seiteB)).toHaveAttribute('data-status', 'gespeichert')
  await kontextB.close()

  // Erste Person speichert auf altem Stand → 412 → Konfliktdialog
  await setzeRadius(page, '7px')
  await page.locator('[data-test="drupal-speichern"]').click()
  const konflikt = page.getByRole('alertdialog', { name: 'Das Theme wurde inzwischen geändert' })
  await expect(konflikt).toBeVisible()
  await expect(konflikt.getByRole('button', { name: 'Abbrechen' })).toBeFocused()

  // Abbrechen: weiterarbeiten, nichts gespeichert
  await konflikt.getByRole('button', { name: 'Abbrechen' }).click()
  await expect(konflikt).toBeHidden()
  await expect(radiusXs(page)).toHaveValue('7px')
  await expect(status(page)).toHaveAttribute('data-status', 'ungespeichert')

  // Erneut speichern → wieder Konflikt → Neu laden holt den Stand der anderen Person
  await page.keyboard.press('Control+s')
  await expect(konflikt).toBeVisible()
  await konflikt.getByRole('button', { name: 'Neu laden' }).click()
  await expect(konflikt).toBeHidden()
  await expect(radiusXs(page)).toHaveValue('5px')
  await expect(status(page)).toHaveAttribute('data-status', 'gespeichert')
})

test('Veröffentlichen: neues Theme vom NEO-Standard besteht die Kontrastprüfung', async ({ page }) => {
  const name = eindeutig('E2E Standard')
  await oeffneDrupal(page)
  await themeAnlegen(page, name)
  await page.locator('[data-test="drupal-veroeffentlichen"]').click()
  const dialog = page.getByRole('dialog', { name: 'Theme veröffentlichen' })
  await expect(dialog.locator('[data-test="kontrast-ergebnis"]')).toContainText('Kontrastprüfung bestanden')
  await dialog.getByRole('button', { name: 'Abbrechen' }).click()
})

test('Veröffentlichen: weiße Schrift auf Statusflächen fällt durch — App sperrt, Server lehnt ab (422)', async ({ page }) => {
  const name = eindeutig('E2E Weiss')
  await themePerApi(page.request, name, {
    activeThemeSet: 'customer',
    themes: { customer: { light: { 'on-danger': '#ffffff', 'on-success': '#ffffff' } } },
  })
  await oeffneDrupal(page)
  await themeOeffnen(page, name)

  await page.locator('[data-test="drupal-veroeffentlichen"]').click()
  const dialog = page.getByRole('dialog', { name: 'Theme veröffentlichen' })
  await expect(dialog).toBeVisible()
  await expect(dialog.locator('[data-test="kontrast-ergebnis"]')).toContainText('Kontrastprüfung nicht bestanden')
  const befunde = dialog.locator('[data-test="kontrast-befunde"] tbody tr')
  await expect(befunde).toHaveCount(2)
  await expect(befunde.nth(0)).toContainText('hell')
  await expect(befunde.nth(0)).toContainText('on-danger')
  await expect(befunde.nth(0)).toContainText('feedback-danger')
  await expect(befunde.nth(0)).toContainText('3,35:1')
  await expect(befunde.nth(0)).toContainText('4,5:1')
  await expect(befunde.nth(1)).toContainText('on-success')
  await expect(befunde.nth(1)).toContainText('feedback-success')
  await expect(dialog.getByRole('button', { name: 'Veröffentlichen' })).toBeDisabled()
  await dialog.getByRole('button', { name: 'Abbrechen' }).click()
  await expect(dialog).toBeHidden()

  // Server-Tor: auch eine geschönte App-Meldung hilft nicht
  const id = await page.evaluate(() => JSON.parse(localStorage.getItem('neo-theme-configurator-drupal-stand')).id)
  const token = (await (await page.request.get('/session/token')).text()).trim()
  const etag = (await page.request.get(`${API}/themes/${id}`)).headers().etag
  const res = await page.request.post(`${API}/themes/${id}/veroeffentlichen`, {
    headers: { 'X-CSRF-Token': token, 'If-Match': etag },
    data: { css: ':root{}', kontrast: { bestanden: true, verfahren: 'x', ergebnisse: [] } },
  })
  expect(res.status()).toBe(422)
  const problem = await res.json()
  expect(problem.kontrast.bestanden).toBe(false)
  expect(problem.fehler.join(' ')).toContain('on-danger auf feedback-danger 3.35:1')
})

test('Korrigiertes Theme: Veröffentlichen und Aktivieren klappen', async ({ page }) => {
  const name = eindeutig('E2E Korrigiert')
  await themePerApi(page.request, name, {
    activeThemeSet: 'customer',
    themes: { customer: { light: { 'on-danger': '#000000', 'on-success': '#000000' } } },
  })
  await oeffneDrupal(page)
  await themeOeffnen(page, name)

  await page.locator('[data-test="drupal-veroeffentlichen"]').click()
  const dialog = page.getByRole('dialog', { name: 'Theme veröffentlichen' })
  await expect(dialog.locator('[data-test="kontrast-ergebnis"]')).toContainText('Kontrastprüfung bestanden')
  await expect(dialog.locator('[data-test="kontrast-befunde"]')).toHaveCount(0)
  await dialog.getByRole('button', { name: 'Veröffentlichen' }).click()
  const erfolg = dialog.locator('[data-test="veroeffentlichen-erfolg"]')
  await expect(erfolg).toContainText('Veröffentlicht (CSS-Version 1)')
  await expect(erfolg).toContainText('Theme-Library')
  await erfolg.getByRole('button', { name: 'Jetzt aktivieren' }).click()
  await expect(dialog.locator('[data-test="aktiviert-hinweis"]')).toBeVisible()
  await dialog.getByRole('button', { name: 'Schließen', exact: true }).click()

  // Liste: aktiv + veröffentlicht; das aktive Theme ist nicht löschbar
  await expect(page.locator('[data-test="drupal-theme-auswahl"]')).toContainText('aktiv')
  await page.locator('[data-test="drupal-theme-auswahl"]').click()
  const eintrag = page.getByRole('region', { name: 'Themes in Drupal' }).locator('li', { hasText: name })
  await expect(eintrag).toContainText('aktiv')
  await expect(eintrag).toContainText('Veröffentlicht')
  await expect(eintrag.getByRole('button', { name: `${name} löschen` })).toBeDisabled()

  // Server: das veröffentlichte CSS ist abrufbar
  const id = await page.evaluate(() => JSON.parse(localStorage.getItem('neo-theme-configurator-drupal-stand')).id)
  const css = await page.request.get(`${API}/themes/${id}/export?format=css`)
  expect(css.status()).toBe(200)
  expect(await css.text()).toContain('--')
})

test('Löschen mit Bestätigung (Entwurf)', async ({ page }) => {
  const name = eindeutig('E2E Löschen')
  await themePerApi(page.request, name, {})
  await oeffneDrupal(page)
  await page.locator('[data-test="drupal-theme-auswahl"]').click()
  const liste = page.getByRole('region', { name: 'Themes in Drupal' })
  await liste.getByRole('button', { name: `${name} löschen` }).click()
  const frage = page.getByRole('alertdialog', { name: 'Theme löschen?' })
  await expect(frage).toBeVisible()
  await frage.getByRole('button', { name: 'Löschen' }).click()
  await expect(frage).toBeHidden()
  await page.locator('[data-test="drupal-theme-auswahl"]').click()
  await expect(page.getByRole('region', { name: 'Themes in Drupal' }).locator('li', { hasText: name })).toHaveCount(0)
})

test('Nur „ansehen“: schreibgeschützt — Banner, Editoren gesperrt, Server lehnt ab', async ({ page }) => {
  await oeffneDrupal(page, { rechte: 'ansehen' })
  await expect(page.locator('[data-test="nur-ansicht"]')).toContainText('Nur Ansicht – dir fehlt das Recht ‚bearbeiten‘')
  await expect(primaerHex(page)).toBeDisabled()
  await expect(page.locator('[data-test="drupal-speichern"]')).toBeDisabled()
  await expect(page.locator('[data-test="drupal-veroeffentlichen"]')).toBeDisabled()
  await page.locator('[data-test="drupal-theme-auswahl"]').click()
  await expect(page.locator('[data-test="drupal-neu"]')).toHaveCount(0)
  await page.keyboard.press('Escape')

  // Eingaben außerhalb des Inspectors (Labor) hält der Schreibschutz an
  await page.goto(`/konfigurator?rechte=ansehen#${sektionZuPfad('foundation-radius')}`)
  const vorher = await radiusXs(page).inputValue()
  await radiusXs(page).fill('11px')
  await radiusXs(page).press('Enter')
  const hinweis = page.getByRole('alertdialog', { name: 'Nur Ansicht' })
  await expect(hinweis).toBeVisible()
  await hinweis.getByRole('button', { name: 'OK' }).click()
  await expect(page.locator('.app-header').getByRole('button', { name: 'Rückgängig' })).toBeDisabled()
  // Der Store hat nichts übernommen: nach dem Neuladen (Arbeitsstand) steht der alte Wert da
  await page.reload()
  await expect(radiusXs(page)).toHaveValue(vorher)

  // Die Sitzung (Cookie der Einstiegsseite) trägt nur „ansehen“ → 403
  const token = (await (await page.request.get('/session/token')).text()).trim()
  const res = await page.request.post(`${API}/themes`, {
    headers: { 'X-CSRF-Token': token },
    data: { meta: { name: 'verboten', version: '1.0.0' }, abweichungen: {} },
  })
  expect(res.status()).toBe(403)
})

test('Ohne „veröffentlichen“: Bearbeiten ja, Veröffentlichen/Aktivieren nein', async ({ page }) => {
  await oeffneDrupal(page, { rechte: 'ansehen,bearbeiten' })
  await expect(page.locator('[data-test="nur-ansicht"]')).toHaveCount(0)
  await expect(primaerHex(page)).toBeEnabled()
  await expect(page.locator('[data-test="drupal-veroeffentlichen"]')).toBeDisabled()
  await expect(page.locator('[data-test="drupal-veroeffentlichen"]')).toHaveAttribute('title', /Recht „veröffentlichen“/)
  await page.locator('[data-test="drupal-theme-auswahl"]').click()
  await expect(page.locator('[data-test="drupal-aktivieren"]')).toHaveCount(0)
})

test('Branches/Releases und lokale Theme-Werkzeuge sind ausgeblendet', async ({ page }) => {
  await oeffneDrupal(page)
  await expect(page.locator('.branch-manager')).toHaveCount(0)
  await expect(page.locator('.app-header').getByRole('button', { name: 'Theme löschen' })).toHaveCount(0)
  await expect(page.locator('.app-header .tb-btn-merge')).toHaveCount(0)
})

test('axe: Drupal-Werkzeuge, Theme-Liste und Veröffentlichen-Dialog ohne Befund', async ({ page }) => {
  const name = eindeutig('E2E axe')
  await themePerApi(page.request, name, {})
  await oeffneDrupal(page)
  await themeOeffnen(page, name)
  await page.locator('[data-test="drupal-theme-auswahl"]').click()
  await warteAufRuhe(page)
  // Geprüft werden die neuen Teile: Header mit Drupal-Werkzeugen und Dialog
  const pruefe = async (bereich) => {
    const { violations } = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
      .include(bereich)
      .analyze()
    return violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)
  }
  expect(await pruefe('.app-header')).toEqual([])
  await page.keyboard.press('Escape')
  await page.locator('[data-test="drupal-veroeffentlichen"]').click()
  await expect(page.getByRole('dialog', { name: 'Theme veröffentlichen' })).toBeVisible()
  expect(await pruefe('.konfig-dialog')).toEqual([])
})
