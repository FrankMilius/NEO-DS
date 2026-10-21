// Bau-Prüfung der Prüfwerkzeuge: gleiche Regel wie der Schutz-Hook
// (~/.claude/hooks/neo-schutz.py, veraltet()) — styles.css älter als scss/ oder
// design-tokens.json, gebauter Konfigurator älter als App-Quellen oder styles.css.
// Sonst vergleichen Bildvergleich und Modul-e2e eine alte Fassung.
import { describe, it, expect } from 'vitest'
import { mkdtempSync, mkdirSync, writeFileSync, utimesSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { bauVeraltet } from '../../scripts/pruefen/lib/bau.mjs'

function datei (wurzel, rel, sekunden) {
  const p = path.join(wurzel, rel)
  mkdirSync(path.dirname(p), { recursive: true })
  writeFileSync(p, 'x')
  utimesSync(p, sekunden, sekunden)
}

function baum (zeiten) {
  const w = mkdtempSync(path.join(tmpdir(), 'pruefen-bau-'))
  for (const [rel, t] of Object.entries(zeiten)) datei(w, rel, t)
  return w
}

const aktuell = {
  'scss/scss/main.scss': 100,
  'data/design-tokens.json': 100,
  'styles.css': 200,
  'apps/theme-configurator/src/main.js': 150,
  'config/theme-configurator/index.html': 300,
}

describe('pruefen: Bau-Prüfung', () => {
  it('aktueller Bau → keine Gründe', () => {
    expect(bauVeraltet(baum(aktuell))).toEqual([])
  })

  it('styles.css älter als scss → ein Grund „styles.css älter als scss“', () => {
    const g = bauVeraltet(baum({ ...aktuell, 'scss/scss/main.scss': 250 }))
    expect(g).toHaveLength(1)
    expect(g[0]).toMatch(/styles\.css älter als scss/)
  })

  it('design-tokens.json neuer als styles.css zählt ebenso', () => {
    expect(bauVeraltet(baum({ ...aktuell, 'data/design-tokens.json': 250 }))[0]).toMatch(/styles\.css älter/)
  })

  it('App-Quelle neuer als der gebaute Konfigurator → Grund „Konfigurator älter als src“', () => {
    const g = bauVeraltet(baum({ ...aktuell, 'apps/theme-configurator/src/main.js': 400 }))
    expect(g).toHaveLength(1)
    expect(g[0]).toMatch(/Konfigurator älter als src/)
  })

  it('fehlender Konfigurator-Bau gilt als veraltet', () => {
    const { 'config/theme-configurator/index.html': _, ...ohne } = aktuell
    expect(bauVeraltet(baum(ohne))[0]).toMatch(/Konfigurator/)
  })

  it('nurCss: veralteter Konfigurator-Bau zählt nicht (app-uebernehmen.sh baut selbst)', () => {
    const w = baum({ ...aktuell, 'apps/theme-configurator/src/main.js': 400 })
    expect(bauVeraltet(w, { nurCss: true })).toEqual([])
    expect(bauVeraltet(baum({ ...aktuell, 'scss/scss/main.scss': 250 }), { nurCss: true })).toHaveLength(1)
  })

  it('node_modules unter den Quellen zählt nicht', () => {
    expect(bauVeraltet(baum({ ...aktuell, 'apps/theme-configurator/src/node_modules/x.js': 999 }))).toEqual([])
  })
})
