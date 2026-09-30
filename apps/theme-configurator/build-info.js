// ==========================================================================
// Build-Informationen fuer die Versionsanzeige (Plan v2, 4.5)
// ==========================================================================
// Wird von vite.config.js und vitest.config.js als `define` eingesetzt.
// In der App liest src/lib/app-version.js die Konstanten aus.
//
//   __APP_VERSION__      "version" aus apps/theme-configurator/package.json
//   __APP_COMMIT__       Git-Kurz-Hash des Build-Stands (Rueckfall GITHUB_SHA,
//                        sonst "unbekannt", z. B. im entpackten Release-ZIP)
//   __APP_BUILD_DATUM__  Zeitpunkt des Builds (ISO 8601, UTC)
//
// Die App-Version ist NICHT die Theme-Version (state.version, Metadaten des
// bearbeiteten Themes) — beide stehen getrennt beschriftet im Header.
// ==========================================================================

import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const APP_DIR = dirname(fileURLToPath(import.meta.url))

function gitKurzHash () {
  try {
    return execSync('git rev-parse --short HEAD', { cwd: APP_DIR, stdio: ['ignore', 'pipe', 'ignore'] })
      .toString().trim()
  } catch {
    return process.env.GITHUB_SHA ? process.env.GITHUB_SHA.slice(0, 7) : 'unbekannt'
  }
}

export function buildInfo () {
  const pkg = JSON.parse(readFileSync(resolve(APP_DIR, 'package.json'), 'utf-8'))
  return {
    version: pkg.version,
    commit: gitKurzHash(),
    datum: new Date().toISOString(),
  }
}

export function buildDefine (info = buildInfo()) {
  return {
    __APP_VERSION__: JSON.stringify(info.version),
    __APP_COMMIT__: JSON.stringify(info.commit),
    __APP_BUILD_DATUM__: JSON.stringify(info.datum),
  }
}
