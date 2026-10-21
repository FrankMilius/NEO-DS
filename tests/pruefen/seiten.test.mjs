// Seitenliste der Prüfwerkzeuge: frisch aus der DDEV-Datenbank (path_alias),
// Formular- und Testseiten per Ausschlussmuster aus den Einstellungen
// (Entscheidung Frank 21.10.2026). Fixture: Abfrage vom 21.10.2026, 77 Aliase;
// die Startseite „/“ hat keinen Alias. Erwartet sind genau die 72 der bisher
// von Hand gepflegten Liste.
import { describe, it, expect } from 'vitest'
import { readFileSync, mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { filtere, seiten, SQL } from '../../scripts/pruefen/lib/seiten.mjs'
import { lade } from '../../scripts/pruefen/lib/einstellungen.mjs'

const fixture = (n) => readFileSync(new URL(`../fixtures/pruefen/${n}`, import.meta.url), 'utf8')
const zeilen = (t) => t.trim().split('\n')
const einst = lade()

describe('pruefen: Seitenliste', () => {
  it('77 Aliase ohne Formular-Unterseiten und Testseiten, plus Startseite → die bekannten 72', () => {
    const liste = seiten(einst, { ausfuehren: () => fixture('path-alias-2026-10-21.txt') })
    expect(liste.length).toBe(72)
    expect(liste).toEqual([...zeilen(fixture('seiten-72.txt'))].sort())
  })

  it('die Startseite hat keinen Alias und kommt trotzdem immer mit', () => {
    expect(seiten(einst, { ausfuehren: () => '/a\n' })).toEqual(['/', '/a'])
  })

  it('Seiten, die „test“ nur im Wort tragen, bleiben drin', () => {
    expect(filtere(['/testimonials', '/contest', '/events/x-test'], einst.seitenAusschluss)).toEqual(['/contest', '/testimonials'])
  })

  it('fragt path_alias über ddev drush sqlq im DRUPAL11-Ordner ab', () => {
    const aufrufe = []
    const ausfuehren = (befehl, argumente, opt) => { aufrufe.push([befehl, argumente, opt.cwd]); return '/b\n/a\n/a\n\n' }
    expect(seiten(einst, { ausfuehren })).toEqual(['/', '/a', '/b'])
    expect(aufrufe).toEqual([['ddev', ['drush', 'sqlq', SQL], einst.drupalWurzel]])
  })

  it('--seiten <datei> liest eine feste Liste und filtert sie nicht', () => {
    const d = mkdtempSync(path.join(tmpdir(), 'pruefen-seiten-'))
    writeFileSync(path.join(d, 'liste.txt'), '/x-test\n/a\n')
    expect(seiten(einst, { datei: path.join(d, 'liste.txt'), ausfuehren: () => { throw new Error('kein DDEV') } })).toEqual(['/x-test', '/a'])
  })
})
