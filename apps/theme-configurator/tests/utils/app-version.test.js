/**
 * Versionsanzeige (Plan v2, 4.5): App-Version aus package.json, Git-Kurz-Hash
 * und Build-Datum per Vite `define` (build-info.js) — getrennt von der
 * Theme-Version (state.version).
 */
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import {
  APP_VERSION, APP_COMMIT, APP_BUILD_DATUM,
  appVersionKurz, appVersionLang, formatiereBuildDatum
} from '../../src/lib/app-version.js'
import { buildDefine, buildInfo } from '../../build-info.js'

const pkg = JSON.parse(readFileSync(resolve(__dirname, '../../package.json'), 'utf-8'))

describe('App-Version', () => {
  it('kommt per define aus package.json', () => {
    expect(APP_VERSION).toBe(pkg.version)
    expect(APP_VERSION).toMatch(/^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$/)
  })

  it('traegt Commit und Build-Datum', () => {
    expect(APP_COMMIT).toMatch(/^([0-9a-f]{7,}|unbekannt)$/)
    expect(Number.isNaN(new Date(APP_BUILD_DATUM).getTime())).toBe(false)
  })

  it('formatiert Kurz- und Langtext', () => {
    const info = { version: '1.2.3', commit: 'abc1234', datum: '2026-09-30T09:05:00.000Z' }
    expect(appVersionKurz(info)).toBe('App 1.2.3 · abc1234')
    expect(appVersionLang(info)).toBe('Theme-Konfigurator 1.2.3, Commit abc1234, gebaut 30.09.2026, 09:05 UTC')
    expect(appVersionLang({ ...info, datum: '' })).toBe('Theme-Konfigurator 1.2.3, Commit abc1234')
  })

  it('ungueltiges Datum ergibt leeren Text', () => {
    expect(formatiereBuildDatum('kein datum')).toBe('')
    expect(formatiereBuildDatum(undefined)).toBe('')
  })

  it('buildDefine liefert JSON-Literale fuer Vite', () => {
    const d = buildDefine({ version: '9.9.9', commit: 'deadbee', datum: '2026-01-01T00:00:00.000Z' })
    expect(d).toEqual({
      __APP_VERSION__: '"9.9.9"',
      __APP_COMMIT__: '"deadbee"',
      __APP_BUILD_DATUM__: '"2026-01-01T00:00:00.000Z"'
    })
    expect(buildInfo().version).toBe(pkg.version)
  })
})
