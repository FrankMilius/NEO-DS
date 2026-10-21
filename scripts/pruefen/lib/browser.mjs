// Playwright für die Prüfwerkzeuge (E3, 21.10.2026).
// Die Wurzel hat Playwright nicht als Abhängigkeit; der Theme-Konfigurator
// führt @playwright/test in genau der Version des Docker-Abbilds (1.64.1).
// Von dort laden statt eine zweite Fassung in die Wurzel zu holen.
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../apps/theme-configurator/package.json')

export function chromium () {
  try {
    return createRequire(APP)('@playwright/test').chromium
  } catch {
    throw new Error('Playwright fehlt — erst `npm ci` in apps/theme-configurator.')
  }
}
