/**
 * Ein Schema fuer alle Theme-Inhalte (THEME_DATA_KEYS).
 * Prueft, dass Persistenz, Undo und Branch-Schnappschuss dieselben Felder
 * abdecken — vorher liefen vier Abschriften auseinander (Befund H1).
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useThemeStore, THEME_DATA_KEYS } from '../../src/stores/theme.js'

describe('Theme-Schema', () => {
  let store
  beforeEach(() => {
    store = useThemeStore()
    store.state.history = []
    store.state.historyIndex = -1
  })
  afterEach(() => vi.restoreAllMocks())

  it('saveToStorage persistiert jedes Feld des Schemas', () => {
    localStorage.clear()
    store.saveToStorage()
    const gespeichert = JSON.parse(localStorage.getItem('neo-theme-configurator'))
    const fehlend = THEME_DATA_KEYS.filter((k) => !(k in gespeichert))
    expect(fehlend).toEqual([])
  })

  it('snapshotThemeData enthaelt genau das Schema (+ activeThemeSet)', () => {
    const snap = store.snapshotThemeData({ withActiveSet: true })
    expect(Object.keys(snap).sort()).toEqual([...THEME_DATA_KEYS, 'activeThemeSet'].sort())
  })

  it('Undo erfasst auch Custom-Tokens', () => {
    let clock = 5_000_000
    vi.spyOn(Date, 'now').mockImplementation(() => (clock += 1000))
    const vorher = JSON.stringify(store.state.customSpacingTokens)
    // Aenderung wie ein Editor: erst History, dann Mutation
    const set = store.state.activeThemeSet
    store.state.history = []
    store.state.historyIndex = -1
    store.updateSemanticToken('background-base', '#abcdef') // legt History an
    store.state.customSpacingTokens[set] = { ...store.state.customSpacingTokens[set], 'test-x': '99px' }
    store.undo()
    expect(JSON.stringify(store.state.customSpacingTokens)).toBe(vorher)
  })

  it('applyThemeData spielt einen Branch-Schnappschuss vollstaendig zurueck', () => {
    const set = store.state.activeThemeSet
    const snap = store.snapshotThemeData({ withActiveSet: true })
    store.state.iconStrokeWidths[set] = 'geaendert'
    store.applyThemeData(snap)
    expect(store.state.iconStrokeWidths[set]).toEqual(snap.iconStrokeWidths[set])
  })
})
