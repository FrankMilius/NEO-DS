// generate-component-specs.js --component=<id> hat bis 05.10.2026
// specs/index.json mit nur EINEM Eintrag ueberschrieben. Dieser Test haelt
// fest: Einzellauf ersetzt/fuegt nur den eigenen Eintrag ein, alles andere
// (Reihenfolge, uebrige Eintraege, Datum) bleibt.
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { indexZusammenfuehren } from '../scripts/generate-component-specs.js'

const bestehend = {
  generated: '2026-08-24',
  specs: {
    accordion: { version: '3.0.0', variants: 7 },
    'alert-dialog': { version: '2.1.0', variants: 2 },
    alert: { version: '2.0.0', variants: 4 },
    button: { version: '5.0.0', variants: 6 },
  },
}

describe('generate-component-specs: index.json zusammenfuehren', () => {
  it('Einzellauf ersetzt nur den Eintrag des Bauteils, an seiner Stelle', () => {
    const neu = indexZusammenfuehren(bestehend, { 'alert-dialog': { version: '2.2.0', variants: 3 } }, { einzeln: true, heute: '2026-10-05' })
    expect(Object.keys(neu.specs)).toEqual(['accordion', 'alert-dialog', 'alert', 'button'])
    expect(neu.specs['alert-dialog']).toEqual({ version: '2.2.0', variants: 3 })
    expect(neu.specs.accordion).toEqual(bestehend.specs.accordion)
    expect(neu.specs.button).toEqual(bestehend.specs.button)
    expect(neu.generated).toBe('2026-08-24')
  })

  it('Einzellauf fuegt ein neues Bauteil in Dateinamen-Reihenfolge ein', () => {
    const neu = indexZusammenfuehren(bestehend, { 'alert-banner': { version: '1.0.0' } }, { einzeln: true, heute: '2026-10-05' })
    // alert-banner-recipe.json < alert-dialog-recipe.json < alert-recipe.json
    expect(Object.keys(neu.specs)).toEqual(['accordion', 'alert-banner', 'alert-dialog', 'alert', 'button'])
    const amEnde = indexZusammenfuehren(bestehend, { zeitleiste: { version: '1.0.0' } }, { einzeln: true, heute: '2026-10-05' })
    expect(Object.keys(amEnde.specs).at(-1)).toBe('zeitleiste')
  })

  it('Einzellauf veraendert das Eingabeobjekt nicht', () => {
    const kopie = structuredClone(bestehend)
    indexZusammenfuehren(bestehend, { button: { version: '6.0.0' } }, { einzeln: true, heute: '2026-10-05' })
    expect(bestehend).toEqual(kopie)
  })

  it('Einzellauf ohne lesbaren Index faellt auf einen neuen Index zurueck', () => {
    const neu = indexZusammenfuehren(null, { button: { version: '6.0.0' } }, { einzeln: true, heute: '2026-10-05' })
    expect(neu).toEqual({ generated: '2026-10-05', specs: { button: { version: '6.0.0' } } })
  })

  it('vollstaendiger Lauf baut den Index neu (Datum heute, nur erzeugte Eintraege)', () => {
    const neu = indexZusammenfuehren(bestehend, { button: { version: '6.0.0' } }, { einzeln: false, heute: '2026-10-05' })
    expect(neu).toEqual({ generated: '2026-10-05', specs: { button: { version: '6.0.0' } } })
  })

  it('der echte specs/index.json bleibt beim Ersetzen eines Eintrags sonst identisch', () => {
    const echt = JSON.parse(readFileSync(new URL('../specs/index.json', import.meta.url), 'utf8'))
    const [erster] = Object.keys(echt.specs)
    const neu = indexZusammenfuehren(echt, { [erster]: { geaendert: true } }, { einzeln: true, heute: '2099-01-01' })
    expect(Object.keys(neu.specs)).toEqual(Object.keys(echt.specs))
    expect({ ...neu, specs: { ...neu.specs, [erster]: echt.specs[erster] } }).toEqual(echt)
  })
})
