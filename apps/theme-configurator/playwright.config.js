// ==========================================================================
// Playwright — End-to-End-Tests des Theme-Konfigurators (Plan v2, 4.2)
// ==========================================================================
// Getestet wird das GEBAUTE Bundle, so wie es ausgeliefert wird: der
// Docs-Server liefert config/theme-config.html und /api/neo-theme-defaults.
// Vorher bauen:
//
//   npm run build:css            (Wurzel, styles.css)
//   npx vite build               (hier, → config/theme-configurator/)
//
// Projekte:
//   smoke    Sektionen, Kernablaeufe, axe — CI-Gate (npm run e2e)
//   visuell  Screenshot-Vergleich der Arenen, Tag @visuell — NICHT im Gate
//            (npm run e2e:visuell, Anleitung in e2e/README.md)
// ==========================================================================

import { defineConfig, devices } from '@playwright/test'
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const hier = dirname(fileURLToPath(import.meta.url))
const wurzel = resolve(hier, '../..')

// Eigener Port, damit ein laufender Docs-Server (3000) nicht stoert
export const PORT = Number(process.env.E2E_PORT || 3100)
const BASIS = `http://127.0.0.1:${PORT}`

if (!existsSync(resolve(wurzel, 'config/theme-config.html'))) {
  throw new Error(
    'config/theme-config.html fehlt — erst bauen: `npm run build:css` in der Wurzel, dann `npx vite build` in apps/theme-configurator.'
  )
}

export default defineConfig({
  testDir: './e2e',
  // Nur Linux-Baselines werden versioniert (siehe e2e/README.md)
  snapshotPathTemplate: '{testDir}/__screenshots__/{testFileName}/{arg}-{platform}{ext}',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  timeout: 30_000,
  expect: {
    timeout: 10_000,
    toHaveScreenshot: {
      animations: 'disabled',
      caret: 'hide',
      scale: 'css',
      // Kantenglaettung darf wackeln, Layout- und Farbaenderungen nicht
      maxDiffPixelRatio: 0.002,
    },
  },
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
  use: {
    baseURL: BASIS,
    viewport: { width: 1440, height: 900 },
    locale: 'de-DE',
    timezoneId: 'Europe/Berlin',
    colorScheme: 'light',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'smoke',
      grepInvert: /@visuell/,
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'visuell',
      grep: /@visuell/,
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 },
    },
  ],
  webServer: {
    command: 'node scripts/docs-server.js',
    cwd: wurzel,
    env: { PORT: String(PORT), HOST: '127.0.0.1' },
    url: `${BASIS}/config/theme-config.html`,
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
    stdout: 'ignore',
    stderr: 'pipe',
  },
})
