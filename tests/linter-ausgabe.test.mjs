// lint:schwellen liest die Schlusszeile jedes Linters aus dessen Ausgabe.
// Anlass (09.10.2026): Unter Last fehlte beim Token-Validator gelegentlich die
// Schlusszeile („KONNTE NICHT LAUFEN“) — er beendete sich mit process.exit(),
// und Node verwarf dabei noch nicht geschriebene Ausgabe an die Pipe.
// Diese Tests halten beide Absicherungen fest:
//   1. Kein Linter aus lint:schwellen beendet sich mit process.exit().
//   2. Der Pruefer liest die Ausgabe ueber eine Datei, nicht ueber eine Pipe —
//      selbst ein Linter, der wieder exit() ruft, verliert dort nichts.
import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { LINTER, linterAusfuehren } from '../scripts/pruefe-linter-schwellen.mjs'

const wurzel = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const pkg = JSON.parse(readFileSync(path.join(wurzel, 'package.json'), 'utf8'))

/** Skriptdateien hinter einem Befehl (`npm run x` wird aufgeloest). */
function skripte (befehl) {
  const npm = befehl.match(/^npm run ([\w:-]+)/)
  const text = npm ? pkg.scripts[npm[1]] : befehl
  if (!text) throw new Error(`npm-Skript fehlt: ${befehl}`)
  return [...text.matchAll(/node\s+(scripts\/[\w./-]+)/g)].map((m) => m[1])
}

/** Quelltext ohne Kommentare (Block- und Zeilenkommentare). */
function ohneKommentare (src) {
  return src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:'"`])\/\/.*$/gm, '$1')
}

describe('lint:schwellen: Linter-Ausgabe kommt vollstaendig an', () => {
  const dateien = [...new Set(LINTER.flatMap((l) => skripte(l.befehl)))]

  it('findet hinter jedem Linter ein Skript', () => {
    expect(dateien.length).toBeGreaterThanOrEqual(LINTER.length)
    for (const d of dateien) expect(existsSync(path.join(wurzel, d)), d).toBe(true)
  })

  it.each(dateien)('%s endet ohne process.exit() (exitCode setzen)', (datei) => {
    const src = ohneKommentare(readFileSync(path.join(wurzel, datei), 'utf8'))
    expect(src).not.toMatch(/process\.exit\s*\(/)
  })

  it('liest grosse Ausgabe vollstaendig, auch wenn der Linter exit() ruft', () => {
    const befehl = `node -e "process.stdout.write('x'.repeat(300000) + '\\nSchluss: 7\\n'); process.exit(1)"`
    const { ausgabe, status } = linterAusfuehren(befehl)
    expect(status).toBe(1)
    expect(ausgabe.length).toBeGreaterThan(300000)
    expect(ausgabe).toMatch(/Schluss: 7/)
  })

  // Schlusszeilen ohne Befund tragen keine Zahl — sie muessen als 0 zaehlen,
  // nicht als Ausfall (docs-scripts fiel am 09.10.2026 von 17 auf 0).
  it.each([
    ['tokens', 'Token-Lint: Keine Probleme gefunden.'],
    ['docs-tokens', 'Docs-Token-Lint: Keine Probleme gefunden.'],
    ['fragments', 'Fragment-Lint: 120 Fragmente geprueft, keine Probleme.'],
    ['docs-scripts', 'Script-Integrity-Lint: 46 Scripts, 120 Fragmente, keine Probleme.'],
    ['recipes', 'Recipe-Lint: 139 Dateien geprueft, 0 Fehler, 3 Warnungen.'],
    ['tote-verweise', 'Tote-Verweise: 0 Variablen ohne Definition und ohne Rueckfallwert'],
    ['root-dubletten', 'Root-Dubletten: 0 mit abweichendem Wert'],
    ['doku-befunde', 'Doku-Befunde: 0 ueber 120 Seiten'],
    ['token-validator', 'Token validation PASSED. No issues found.'],
  ])('%s: Schlusszeile ohne Befund zaehlt als 0', (id, zeile) => {
    const l = LINTER.find((x) => x.id === id)
    const m = l.muster.exec(`vorher\n${zeile}\n`)
    expect(m).not.toBeNull()
    expect(Number(m[1] ?? 0)).toBe(0)
  })

  it('jeder Linter ist in der Nullzeilen-Tabelle', () => {
    expect(LINTER.map((l) => l.id).sort()).toEqual(['docs-scripts', 'docs-tokens', 'doku-befunde', 'fragments', 'recipes', 'root-dubletten', 'token-validator', 'tokens', 'tote-verweise'])
  })
})
