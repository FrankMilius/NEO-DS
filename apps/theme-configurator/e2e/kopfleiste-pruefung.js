// ==========================================================================
// Kopfleiste mit Menü „Mehr …“ (Roadmap R05, 20.10.2026) — gemeinsame
// Prüfungen für den lokalen Betrieb (kopfleiste.spec.js) und den
// Drupal-Betrieb (kopfleiste-drupal.spec.js).
// ==========================================================================
import AxeBuilder from '@axe-core/playwright'
import { expect } from '@playwright/test'

export const BREITEN = [360, 390, 600, 768, 1024, 1280, 1440, 1920]

/** Höhe, rechter Rand der sichtbaren Bedienelemente, waagrechtes Scrollen */
export const kopfMasse = (page) => page.evaluate(() => {
  const h = document.querySelector('.app-header')
  const r = h.getBoundingClientRect()
  const sichtbar = [...h.querySelectorAll('button, a')].filter((e) => e.offsetParent && !e.closest('.kopf-mehr-panel, [class*=dropdown], .dt-panel, .modal-overlay'))
  return {
    hoehe: Math.round(r.height),
    unten: Math.round(Math.max(...sichtbar.map((e) => e.getBoundingClientRect().bottom))),
    rechts: Math.round(Math.max(...sichtbar.map((e) => e.getBoundingClientRect().right))),
    kopfRechts: Math.round(r.right),
    seiteBreit: document.documentElement.scrollWidth,
    imMenue: [...document.querySelectorAll('.kopf-mehr-panel [data-kopf-platz]')].map((e) => e.dataset.kopfPlatz),
  }
})

/**
 * Einzeilig und ohne Überstand in allen Breiten; liefert die Messwerte je Breite.
 * art: 'breiter' (Fenster wächst), 'schmaler' (Fenster schrumpft),
 * 'neu' (in jeder Breite frisch geladen)
 */
export async function pruefeEinzeilig (page, url, art = 'breiter') {
  const ergebnis = {}
  const breiten = art === 'schmaler' ? [...BREITEN].reverse() : BREITEN
  await page.goto(url)
  for (const w of breiten) {
    await page.setViewportSize({ width: w, height: 800 })
    if (art === 'neu') await page.reload()
    await expect(page.locator('.app-header')).toBeVisible()
    // Anpassen läuft in wenigen Bildern: warten, bis die Leiste passt UND sich
    // nicht mehr ändert (passt schon, während noch Aktionen zurückkommen)
    let vorher = ''
    await expect.poll(async () => {
      const m = await kopfMasse(page)
      const jetzt = JSON.stringify(m)
      const stabil = jetzt === vorher
      vorher = jetzt
      return stabil && m.rechts <= m.kopfRechts && m.unten <= m.hoehe
    }, { message: `Kopfleiste bei ${w} px`, intervals: [100, 150, 250] }).toBe(true)
    const m = await kopfMasse(page)
    expect(m.hoehe, `Höhe bei ${w} px`).toBeLessThanOrEqual(46)
    expect(m.seiteBreit, `waagrechtes Scrollen bei ${w} px`).toBeLessThanOrEqual(w)
    ergebnis[w] = m
  }
  return ergebnis
}

/**
 * Im Menü liegt immer ein Anfang der Reihenfolge (zuerst ins Menü zuerst) —
 * nie eine wichtigere Aktion vor einer selteneren. Unabhängig von Schrift-
 * metriken; wie viele es bei welcher Breite sind, hängt von ihnen ab.
 */
export function pruefeReihenfolge (messungen, reihenfolge) {
  for (const [w, m] of Object.entries(messungen)) {
    const erwartet = reihenfolge.slice(0, m.imMenue.length).sort()
    expect([...m.imMenue].sort(), `Menü bei ${w} px`).toEqual(erwartet)
  }
  // Keine Regel „breiter → weniger im Menü“: An der Grenze 768 px kehren
  // Beschriftungen zurück, dort liegt im Drupal-Betrieb eine Aktion mehr im Menü.
}

/** Menü „Mehr …“ öffnen; liefert das Panel */
export async function mehrOeffnen (page) {
  const knopf = page.locator('[data-test="kopf-mehr"]')
  await expect(knopf).toBeVisible()
  await knopf.click()
  await expect(knopf).toHaveAttribute('aria-expanded', 'true')
  const panel = page.locator('#kopf-mehr-panel')
  await expect(panel).toBeVisible()
  return panel
}

/** Escape schließt das Menü und gibt den Fokus an „Mehr …“ zurück */
export async function pruefeEscape (page) {
  await page.keyboard.press('Escape')
  await expect(page.locator('#kopf-mehr-panel')).toBeHidden()
  await expect(page.locator('[data-test="kopf-mehr"]')).toBeFocused()
}

/** App-Darstellung im Menü umschalten: Menü bleibt offen */
export async function pruefeDarstellungImMenue (page, panel) {
  await panel.getByRole('radio', { name: 'Dunkel' }).click()
  await expect.poll(() => page.evaluate(() => document.documentElement.dataset.appDarstellung)).toBe('dunkel')
  await expect(panel).toBeVisible()
  await panel.getByRole('radio', { name: 'Hell' }).click()
}

/** axe: Kopfleiste samt offenem Menü ohne Befund (WCAG 2.2 AA) */
export async function pruefeAxe (page) {
  const r = await new AxeBuilder({ page }).include('.app-header').withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze()
  expect(r.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)).toEqual([])
}
