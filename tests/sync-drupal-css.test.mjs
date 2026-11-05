// sync-drupal-css.js bringt styles.css ins Theme neo_fe (npm run build:drupal).
// Anlass (I09, 05.11.2026): Der Abgleich schrieb url("fonts/…") auf
// url("../fonts/…") um. Seit neo_fe 92c3116 (13.10.2026) liegen die Schriften
// aber in css/fonts/, der umgeschriebene Pfad zeigte ins Leere (404 je Seite).
// cc865c9 reparierte nur die Datei im Theme, der nächste Abgleich (503c76b)
// brachte den Fehler zurück. Diese Tests halten fest:
//   1. styles.css kommt byte-gleich im Theme an (kein Umschreiben).
//   2. Zeigt eine Schrift-URL auf keine Datei im Theme, bricht der Abgleich ab
//      und schreibt nichts.
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fehlendeSchriften, abgleichen } from '../scripts/sync-drupal-css.js'

let ordner, root, theme

/** Quelle (Design System) und Ziel (Theme) als temporäre Ordner. */
function anlegen ({ css, schriften = [] }) {
  writeFileSync(path.join(root, 'styles.css'), css)
  writeFileSync(path.join(root, 'data', 'design-tokens.css'), ':root{--a:1}')
  writeFileSync(path.join(root, 'shot-vorschau.css'), '.x{}')
  for (const name of schriften) writeFileSync(path.join(theme, 'css', 'fonts', name), 'woff2')
}

beforeEach(() => {
  ordner = mkdtempSync(path.join(tmpdir(), 'sync-drupal-css-'))
  root = path.join(ordner, 'ds')
  theme = path.join(ordner, 'neo_fe')
  mkdirSync(path.join(root, 'data'), { recursive: true })
  mkdirSync(path.join(theme, 'css', 'fonts'), { recursive: true })
})

afterEach(() => rmSync(ordner, { recursive: true, force: true }))

describe('fehlendeSchriften', () => {
  it('meldet keine fehlenden Schriften, wenn alle Dateien in css/fonts liegen', () => {
    anlegen({ css: '', schriften: ['a.woff2', 'b.woff2'] })
    const css = '@font-face{src:url("fonts/a.woff2")}@font-face{src:url("fonts/b.woff2") format("woff2")}'
    expect(fehlendeSchriften(css, path.join(theme, 'css'))).toEqual([])
  })

  it('meldet eine fehlende Schrift mit Dateiname', () => {
    anlegen({ css: '', schriften: ['a.woff2'] })
    const css = '@font-face{src:url("fonts/a.woff2")}@font-face{src:url("fonts/fehlt.woff2")}'
    expect(fehlendeSchriften(css, path.join(theme, 'css'))).toEqual(['fonts/fehlt.woff2'])
  })

  it('wertet ../fonts/ als fehlend, wenn es den Ordner nicht gibt', () => {
    anlegen({ css: '', schriften: ['a.woff2'] })
    const css = '@font-face{src:url("../fonts/a.woff2")}'
    expect(fehlendeSchriften(css, path.join(theme, 'css'))).toEqual(['../fonts/a.woff2'])
  })

  // Randfälle aus dem Widersacher 05.11.2026
  it('erkennt fehlende Schriften auch mit Abfrage, Fragment und Großschreibung', () => {
    anlegen({ css: '', schriften: ['a.woff2'] })
    const css = 'src:url("fonts/a.woff2?v=1"),URL(fonts/x.woff#iefix),url(\'fonts/Y.WOFF2?v=2\')'
    expect(fehlendeSchriften(css, path.join(theme, 'css'))).toEqual(['fonts/x.woff#iefix', 'fonts/Y.WOFF2?v=2'])
  })

  it('übergeht data:, absolute und fremde Adressen sowie Kommentare', () => {
    anlegen({ css: '', schriften: [] })
    const css = '/* url("fonts/alt.woff2") */src:url(data:font/woff2;base64,AAAA),url("/fonts/a.woff2"),url("https://x.de/a.woff2"),url(//x.de/b.woff2)'
    expect(fehlendeSchriften(css, path.join(theme, 'css'))).toEqual([])
  })
})

describe('abgleichen', () => {
  it('kopiert styles.css byte-gleich ins Theme', () => {
    const css = '@font-face{font-family:M;src:url("fonts/m.woff2") format("woff2")}body{font-family:M}'
    anlegen({ css, schriften: ['m.woff2'] })
    const ergebnis = abgleichen({ root, theme })
    expect(ergebnis.fehlend).toEqual([])
    expect(readFileSync(path.join(theme, 'css', 'styles.css'), 'utf8')).toBe(css)
  })

  it('bricht bei fehlender Schrift ab und schreibt nichts', () => {
    anlegen({ css: '@font-face{src:url("fonts/fehlt.woff2")}', schriften: [] })
    const ergebnis = abgleichen({ root, theme })
    expect(ergebnis.fehlend).toEqual(['fonts/fehlt.woff2'])
    expect(existsSync(path.join(theme, 'css', 'styles.css'))).toBe(false)
    expect(existsSync(path.join(theme, 'css', 'design-tokens.css'))).toBe(false)
  })
})
