// Full compiled CSS of scss/scss/main.scss (compressed), compiled once per
// run by tests/_setup/voll-css.mjs. Use this instead of sass.compile() or
// `npm run build:css` in a test — see the reason there.
import { readFileSync } from 'node:fs'
import { inject } from 'vitest'

/** @type {string|null} */
let cache = null

/** @returns {string} */
export function vollCss () {
  if (cache === null) {
    const pfad = inject('vollCssPfad')
    if (!pfad) throw new Error('vollCssPfad fehlt — Test nicht über die Wurzel-Konfiguration (vitest.config.js) gestartet')
    cache = readFileSync(pfad, 'utf-8')
  }
  return cache
}
