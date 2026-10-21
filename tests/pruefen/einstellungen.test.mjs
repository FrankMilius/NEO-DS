// Einstellungen der Prüfwerkzeuge (scripts/pruefen/, E3): Pfade und Adressen
// stehen in einer Datei, nicht im Code. Die lokale Datei überschreibt die
// versionierte Vorgabe; fehlt ein Pflichtfeld, nennt der Fehler das Feld.
import { describe, it, expect } from 'vitest'
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir, homedir } from 'node:os'
import path from 'node:path'
import { lade, PFLICHT } from '../../scripts/pruefen/lib/einstellungen.mjs'

function ordnerMit (vorgabe, lokal) {
  const d = mkdtempSync(path.join(tmpdir(), 'pruefen-einst-'))
  writeFileSync(path.join(d, 'einstellungen.json'), JSON.stringify(vorgabe))
  if (lokal) writeFileSync(path.join(d, 'einstellungen.lokal.json'), JSON.stringify(lokal))
  return d
}

const voll = {
  drupalWurzel: '~/Sites/DRUPAL11',
  modulPfad: '~/Sites/DRUPAL11/web/modules/custom/neo_theme_konfigurator',
  themePfad: '~/Sites/DRUPAL11/web/themes/custom/neo_fe',
  ddevUrl: 'https://piipe-workplace.ddev.site',
  cssRoute: 'neo_fe/css/styles\\.css',
  dockerAbbild: 'mcr.microsoft.com/playwright:v1.64.1-noble',
  dockerEinhaengen: '~/Sites',
  dockerVolumes: { wurzel: 'neo-nm-wurzel-164', app: 'neo-nm-app-164' },
  breiten: [1280, 390],
  seitenAusschluss: ['^/form/contact/'],
}

describe('pruefen: Einstellungen', () => {
  it('die versionierte Datei enthält alle Pflichtfelder', () => {
    const e = lade()
    for (const f of PFLICHT) expect(e[f], f).toBeDefined()
  })

  it('lokale Datei überschreibt die Vorgabe feldweise', () => {
    const d = ordnerMit(voll, { ddevUrl: 'https://anders.ddev.site' })
    const e = lade({ ordner: d })
    expect(e.ddevUrl).toBe('https://anders.ddev.site')
    expect(e.breiten).toEqual([1280, 390])
  })

  it('~ wird zum Benutzerordner aufgelöst', () => {
    const e = lade({ ordner: ordnerMit(voll) })
    expect(e.drupalWurzel).toBe(path.join(homedir(), 'Sites/DRUPAL11'))
  })

  it('fehlendes ddevUrl → Fehler nennt ddevUrl', () => {
    const { ddevUrl, ...ohne } = voll
    expect(() => lade({ ordner: ordnerMit(ohne) })).toThrow(/ddevUrl/)
  })
})
