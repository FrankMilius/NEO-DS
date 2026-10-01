/**
 * Pruefwerkzeug scripts/pruefe-kunden-themes.mjs (Plan v2, 2.6 — ADR-002,
 * Folge 3): Standard + Abweichungen zusammenfuehren, Kontrast pruefen,
 * Exit-Code. Laeuft als echter Node-Prozess gegen die Beispiel-Abweichungen
 * in tests/speicher/beispiele/.
 */
import { describe, it, expect } from 'vitest'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { pruefeKundenThemes } from '../../../../scripts/pruefe-kunden-themes.mjs'

const WURZEL = resolve(__dirname, '../../../..')
const WERKZEUG = join(WURZEL, 'scripts/pruefe-kunden-themes.mjs')
const BEISPIELE = resolve(__dirname, 'beispiele')
const ACME = join(BEISPIELE, 'kunde-acme.abweichungen.json')
const BETA = join(BEISPIELE, 'kunde-beta.abweichungen.json')
const STANDARD = JSON.parse(readFileSync(join(WURZEL, 'data/neo-theme-defaults/neo-theme-defaults.json'), 'utf8'))

const lauf = (...args) => spawnSync(process.execPath, [WERKZEUG, ...args], { cwd: WURZEL, encoding: 'utf8' })

/** Standard, in dem das Design System den Kontrast-Befund behoben hat (Entscheidung G). */
function korrigierterStandard() {
  const s = JSON.parse(JSON.stringify(STANDARD))
  s._meta.version = '1.1.0'
  for (const set of ['neo', 'customer']) {
    s.themes[set].light['on-danger'] = '#000000'
    s.themes[set].light['on-success'] = '#000000'
  }
  const datei = join(mkdtempSync(join(tmpdir(), 'neo-standard-')), 'neo-theme-defaults.json')
  writeFileSync(datei, JSON.stringify(s))
  return { datei, inhalt: s }
}

describe('pruefe-kunden-themes (Node)', () => {
  it('ACME (behebt den Befund selbst) besteht, Beta faellt durch -> Exit 1 mit Befund', () => {
    const r = lauf(ACME, BETA)
    expect(r.status).toBe(1)
    expect(r.stdout).toMatch(/✓ ACME Corporate \(Set customer\): bestanden/)
    expect(r.stdout).toMatch(/✗ kunde-beta \(Set customer\): 1 Befund/)
    expect(r.stdout).toMatch(/hell: text-secondary auf background-base [\d,]+:1 \(mind\. 4,5:1\)/)
  })

  it('Ordner als Eingabe und --json', () => {
    const r = lauf('--json', BEISPIELE)
    expect(r.status).toBe(1)
    const erg = JSON.parse(r.stdout)
    expect(erg.standardVersion).toBe(STANDARD._meta.version)
    expect(erg.themes.map(t => [t.name, t.bestanden])).toEqual([['ACME Corporate', true], ['kunde-beta', false]])
  })

  it('neuer Standard wirkt durch: leere Abweichung uebernimmt die Korrektur und besteht (Exit 0)', () => {
    const { datei } = korrigierterStandard()
    const leer = join(mkdtempSync(join(tmpdir(), 'neo-kunde-')), 'kunde-leer.json')
    writeFileSync(leer, JSON.stringify({ meta: { name: 'Leer' }, abweichungen: {} }))
    expect(lauf(leer).status).toBe(1)                          // heutiger Standard: Befund 30.09.2026
    const r = lauf('--standard', datei, leer, ACME)
    expect(r.stdout).toMatch(/NEO-Standard 1\.1\.0/)
    expect(r.status).toBe(0)
    expect(r.stdout).toMatch(/alle bestanden/)
  })

  it('Aufruf- und Lesefehler -> Exit 2', () => {
    expect(lauf().status).toBe(2)
    expect(lauf(join(BEISPIELE, 'gibt-es-nicht.json')).status).toBe(2)
  })

  it('Kern ohne Dateisystem: pruefeKundenThemes', () => {
    const { inhalt } = korrigierterStandard()
    const erg = pruefeKundenThemes(inhalt, [
      { name: 'a', inhalt: { abweichungen: {} } },
      { name: 'b', inhalt: { themes: { customer: { dark: { 'text-primary': '#000000' } } } } },
    ])
    expect(erg.themes.map(t => t.bestanden)).toEqual([true, false])
    expect(erg.themes[1].befunde.map(b => `${b.modus}:${b.vordergrund}`)).toContain('dark:text-primary')
    expect(erg.bestanden).toBe(false)
  })
})
