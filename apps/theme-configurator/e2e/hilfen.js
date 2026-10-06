// ==========================================================================
// Gemeinsame Hilfen der E2E-Tests (Plan v2, 4.2)
// ==========================================================================
// - Sektionsliste aus der Navigation (src/navigation/sektions-ids.js) —
//   NICHT abgetippt. Ermittelt von e2e/sektionsliste.mjs (Vites
//   runnerImport in einem eigenen Node-Prozess, siehe dort).
// - URL einer Sektion ueber sektionZuPfad aus dem Hash-Router (ebenfalls
//   aus sektionsliste.mjs).
// - Fixture `fehler`: sammelt Konsolenfehler und pageerror je Test.
// - Externe Anfragen (Google Fonts, Bild-CDNs) werden abgebrochen: die Tests
//   sollen offline und deterministisch laufen. Fehler dieser Anfragen zaehlen
//   nicht, nur Fehler vom eigenen Server.
// ==========================================================================

import { test as basis, expect } from '@playwright/test'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const ids = JSON.parse(
  execFileSync(process.execPath, [fileURLToPath(new URL('./sektionsliste.mjs', import.meta.url))], {
    encoding: 'utf-8',
    env: { ...process.env, NODE_OPTIONS: '' },
  })
)

/** Alle Sektions-IDs der Navigation in Anzeigereihenfolge */
export const SEKTIONEN = Object.freeze(ids.sektionen.map((s) => s.id))
export const START_SEKTION = ids.start
const PFADE = new Map(ids.sektionen.map((s) => [s.id, s.pfad]))

/** 'component-button' → '/component/button' (sektionZuPfad des Hash-Routers) */
export function sektionZuPfad (id) {
  const pfad = PFADE.get(id)
  if (!pfad) throw new Error(`Unbekannte Sektion: ${id}`)
  return pfad
}

export const EINSTIEG = '/config/theme-config.html'

/** 'component-button' → '/config/theme-config.html#/component/button' */
export function sektionsUrl (id, query = '') {
  return `${EINSTIEG}#${sektionZuPfad(id)}${query ? '?' + query : ''}`
}

/**
 * Bekannte Konsolenfehler, die (noch) nicht behoben sind. Jeder Eintrag mit
 * Grund — neue Fehler lassen den Test scheitern. Eintraege entfernen, sobald
 * die Ursache behoben ist.
 */
// Leer seit 06.10.2026: die Card-Bilder (404 aus data/card-recipes.json) sind
// mit der Karten-Arena aus dem Recipe weg (Plan v3, Phase 3, Block Inhalte).
export const BEKANNTE_FEHLER = []

function istEigeneQuelle (url, basisUrl) {
  if (!url) return true // Fehler ohne Ort (z. B. console.error aus der App) zaehlen immer
  try {
    return new URL(url).origin === new URL(basisUrl).origin
  } catch {
    return true
  }
}

export const test = basis.extend({
  // Externe Anfragen abbrechen (vor dem ersten goto)
  context: async ({ context, baseURL }, use) => {
    const eigen = new URL(baseURL).origin
    await context.route((url) => url.origin !== eigen, (route) => route.abort())
    await use(context)
  },

  fehler: [
    async ({ page, baseURL }, use) => {
      const liste = []
      page.on('console', (m) => {
        if (m.type() !== 'error') return
        const ort = m.location()?.url || ''
        if (!istEigeneQuelle(ort, baseURL)) return
        liste.push({ art: 'console', text: m.text(), ort })
      })
      page.on('pageerror', (e) => liste.push({ art: 'pageerror', text: String(e?.stack || e), ort: '' }))
      await use(liste)
    },
    { auto: true },
  ],
})

export { expect }

/**
 * Filtert bekannte Fehler einer Sektion heraus.
 * @param {Array<{art:string,text:string,ort:string}>} fehler
 * @param {string} [sektion]
 */
export function unbekannteFehler (fehler, sektion) {
  const erlaubt = BEKANNTE_FEHLER.filter((b) => !b.sektion || b.sektion === sektion)
  return fehler.filter((f) => !erlaubt.some((b) => b.muster.test(f.ort) || b.muster.test(f.text)))
}

/** Oeffnet eine Sektion per Deep-Link und wartet, bis die App steht. */
export async function oeffneSektion (page, id, query = '') {
  await page.goto(sektionsUrl(id, query))
  await expect(page.locator('.app-header')).toBeVisible()
  await expect(page.locator('.laboratory-panel')).toBeVisible()
  await expect(page.locator('.inspector-panel')).toBeVisible()
}

/** Wartet, bis lazy geladene Arenen/Recipes nachgeladen sind. */
export async function warteAufRuhe (page) {
  await page.waitForLoadState('networkidle')
  await page.evaluate(() => document.fonts?.ready)
}
