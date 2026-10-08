// generate-component-specs.js --pruefen (Abschluss Plan v3, 08.10.2026):
// Bis dahin pruefte kein CI-Schritt specs/* gegen die Recipes. Der Pruefmodus
// erzeugt im Speicher und vergleicht; dieser Test haelt den Vergleich fest.
import { describe, it, expect } from 'vitest'
import { specsErzeugen, specsVergleichen } from '../scripts/generate-component-specs.js'

const index = (datum, specs = { a: { version: '1.0.0' } }) => JSON.stringify({ generated: datum, specs }, null, 2) + '\n'

describe('generate-component-specs: Pruefmodus', () => {
  it('gleicher Stand: keine Abweichung, Datum im Index zaehlt nicht', () => {
    const soll = new Map([['a.spec.json', '{}\n'], ['index.json', index('2026-10-08')]])
    const ist = new Map([['a.spec.json', '{}\n'], ['index.json', index('2026-10-01')]])
    expect(specsVergleichen(soll, ist)).toEqual([])
  })

  it('meldet abweichende, fehlende und verwaiste Dateien sortiert', () => {
    const soll = new Map([
      ['b.spec.md', 'neu\n'],
      ['a.spec.json', '{"v":2}\n'],
      ['index.json', index('2026-10-08', { a: { version: '2.0.0' } })],
    ])
    const ist = new Map([
      ['a.spec.json', '{"v":1}\n'],
      ['alt.spec.json', '{}\n'],
      ['index.json', index('2026-10-08')],
    ])
    expect(specsVergleichen(soll, ist)).toEqual([
      { datei: 'a.spec.json', grund: 'abweichend' },
      { datei: 'alt.spec.json', grund: 'ohne Recipe' },
      { datei: 'b.spec.md', grund: 'fehlt' },
      { datei: 'index.json', grund: 'abweichend' },
    ])
  })

  it('specsErzeugen schreibt nichts und meldet unlesbare Recipes als Warnung', () => {
    const warnungen = []
    const { dateien, eintraege } = specsErzeugen(
      [{ datei: 'kaputt-recipe.json', fehler: new Error('Unexpected token') }],
      { warnen: (t) => warnungen.push(t) },
    )
    expect(dateien.size).toBe(0)
    expect(eintraege).toEqual({})
    expect(warnungen).toEqual(['kaputt-recipe.json: Unexpected token'])
  })
})
