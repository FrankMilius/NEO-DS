// DTCG-Export aus der App (Plan v2, 2.2): derselbe Kern wie scripts/export-dtcg.cjs
import { describe, it, expect, beforeAll, beforeEach } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { execFileSync } from 'node:child_process'
import { erzeugeDtcg } from 'dtcg-export'
import { ladeDtcgGrundlagen, erzeugeThemeDtcg, themeDatenAusState } from '../../src/export/dtcg.js'
import { useThemeStore } from '../../src/stores/theme.js'
import { semanticDefaults } from '../../src/data/tokens.js'

const WURZEL = resolve(__dirname, '../../../..')
const ZIEL = readFileSync(resolve(WURZEL, 'data/design-tokens.dtcg.json'), 'utf8')

let grundlagen
beforeAll(async () => { grundlagen = await ladeDtcgGrundlagen() }, 60000)

describe('DTCG-Kern (packages/dtcg-export)', () => {
  it('liefert dasselbe wie das Node-Skript (data/design-tokens.dtcg.json)', () => {
    const { text, bericht } = erzeugeDtcg(grundlagen.quelle, grundlagen)
    expect(bericht.offen).toEqual([])
    expect(text === ZIEL).toBe(true)
  })

  it('das Node-Skript benutzt den Kern und findet die Datei aktuell', () => {
    const aus = execFileSync('node', ['scripts/export-dtcg.cjs', '--pruefen'], { cwd: WURZEL, encoding: 'utf8' })
    expect(aus).toMatch(/Datei aktuell/)
    expect(readFileSync(resolve(WURZEL, 'scripts/export-dtcg.cjs'), 'utf8')).toMatch(/packages\/dtcg-export/)
  })
})

describe('DTCG-Export des Theme-Stores', () => {
  beforeEach(() => {
    // Die Stores teilen den Modul-State: vor jedem Test auf Werkseinstellung.
    const store = useThemeStore()
    store.state.activeThemeSet = 'neo'
    store.resetToDefaults()
  })

  it('unverändertes NEO-Theme ⇒ identisch mit data/design-tokens.dtcg.json', () => {
    const store = useThemeStore()
    const { text, hinweise } = erzeugeThemeDtcg(grundlagen, themeDatenAusState(store.state), { themeSet: 'neo', semanticDefaults })
    expect(hinweise).toEqual([])
    expect(text === ZIEL).toBe(true)
  })
})

describe('DTCG-Export mit Theme-Änderungen', () => {
  beforeEach(() => {
    // Die Stores teilen den Modul-State: vor jedem Test auf Werkseinstellung.
    const store = useThemeStore()
    store.state.activeThemeSet = 'neo'
    store.resetToDefaults()
  })

  const export_ = (store) => {
    const { text, hinweise, uebernommen } = erzeugeThemeDtcg(grundlagen, themeDatenAusState(store.state), { themeSet: store.state.activeThemeSet, semanticDefaults, name: 'Kunde' })
    return { dtcg: JSON.parse(text), text, hinweise, uebernommen }
  }

  it('eine semantische Farbe erscheint im DTCG (und nur sie wird als Änderung gezählt)', () => {
    const store = useThemeStore()
    store.state.themes.neo.light['text-primary'] = '#123456'
    const { dtcg, uebernommen } = export_(store)
    expect(dtcg.semantic['text-primary'].$value.hex).toBe('#123456')
    expect(uebernommen.semantik).toBe(1)
    expect(dtcg.$extensions['de.neocosmo'].themeExport.uebernommen.semantik).toBe(1)
  })

  it('Komponenten-, Foundation- und Schriftskala-Änderungen erscheinen im DTCG', () => {
    const store = useThemeStore()
    store.state.componentOverrides.neo['nc-button-fab-radius'] = '20px'
    store.state.foundationOverrides.neo.spacing['03'] = '14px'
    store.state.typeScale.neo = { ratio_max: 1.25 }
    const { dtcg, uebernommen } = export_(store)
    const btn = Object.values(dtcg.components).find((g) => g['nc-button-fab-radius'])
    expect(btn['nc-button-fab-radius'].$value).toEqual({ value: 20, unit: 'px' })
    expect(dtcg.foundation._configurator.spacing['03'].$value).toEqual({ value: 14, unit: 'px' })
    expect(dtcg.foundation.typography.fluid.ratio_max.$value).toBe(1.25)
    expect(uebernommen).toMatchObject({ komponenten: 1, foundation: 1, schriftskala: 1 })
  })

  it('nicht abbildbare Änderungen werden ausgewiesen statt still verloren', () => {
    const store = useThemeStore()
    store.state.focusRingMode.neo = 'inset'
    store.state.customSpacingTokens.neo['14'] = { label: '14', value: '56px' }
    store.state.primitiveOverrides.neo.primary = '#003366'
    const { dtcg, hinweise } = export_(store)
    expect(hinweise.join('\n')).toMatch(/Fokusring/)
    expect(hinweise.join('\n')).toMatch(/Spacing/)
    expect(hinweise.join('\n')).toMatch(/Stufen/)
    expect(dtcg.$extensions['de.neocosmo'].themeExport.nichtAbgebildet).toEqual(hinweise)
    expect(dtcg.primitives.brand.primary.base.$value.hex).toBe('#003366')
  })

  it('Store-Aktion exportAsDTCG liefert Text und Dateinamen', async () => {
    const store = useThemeStore()
    const erg = await store.exportAsDTCG()
    expect(erg.text === ZIEL).toBe(true)
    expect(erg.dateiname).toMatch(/\.tokens\.dtcg\.json$/)
  })
})
