// ==========================================================================
// Vitest globalSetup: compile scss/scss/main.scss ONCE per test run
// ==========================================================================
// Before (02.11.2026): twelve test files compiled the full design system in
// their own beforeAll, and tokens.test.mjs ran `npm run build:css` twice —
// about 15 full Sass builds per `npm test`, in parallel on every worker.
// The CPU was saturated and unrelated tests timed out (5 s default).
//
// Now: one compile here, in the main process before the workers start. The
// result goes to a temporary file; tests read it via tests/_hilfen/voll-css.mjs
// (inject('vollCssPfad')). A compile error fails the whole run right here,
// with the Sass message — not as a hook timeout somewhere else.
// ==========================================================================
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import * as sass from 'sass'

const ROOT = resolve(import.meta.dirname, '../..')

/** @param {import('vitest/node').TestProject} project */
export default function setup (project) {
  const ordner = mkdtempSync(join(tmpdir(), 'neo-tests-'))
  const pfad = join(ordner, 'main.css')
  const start = Date.now()
  const { css } = sass.compile(resolve(ROOT, 'scss/scss/main.scss'), { style: 'compressed' })
  writeFileSync(pfad, css)
  console.log(`  voll-css: main.scss einmal übersetzt (${((Date.now() - start) / 1000).toFixed(1)} s, ${(css.length / 1024).toFixed(0)} KB)`)
  project.provide('vollCssPfad', pfad)
  return () => rmSync(ordner, { recursive: true, force: true })
}
