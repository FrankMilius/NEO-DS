// Undo-Verlauf als Pinia-Plugin (Plan v2, 3.3c · 30.09.2026)
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useThemeStore } from '../../src/stores/theme.js'
import { VERLAUF_AKTIONEN } from '../../src/stores/theme/verlauf.js'

describe('Verlauf-Plugin', () => {
  let store, clock
  beforeEach(() => {
    store = useThemeStore()
    store.state.activeThemeSet = 'neo'
    store.state.history = []
    store.state.historyIndex = -1
    clock = 5_000_000
    vi.spyOn(Date, 'now').mockImplementation(() => (clock += 1000))
  })
  afterEach(() => vi.restoreAllMocks())

  it('jede Verlauf-Aktion gibt es im Store', () => {
    for (const name of VERLAUF_AKTIONEN) expect(typeof store[name], name).toBe('function')
  })

  it('abgelehnte Eingaben legen keinen Undo-Schritt an', () => {
    store.updateTypeScale('base_max_px', -1)
    store.updateTypeScale('unbekannt', 3)
    expect(store.canUndo()).toBe(false)
  })

  it('ein gleicher Wert legt keinen Undo-Schritt an', () => {
    const md = store.currentFoundation.radius.md
    store.updateFoundationToken('radius', 'md', md)
    expect(store.canUndo()).toBe(false)
  })

  it('Aktionen ausserhalb der Liste (UI-Zustand) legen keinen Schritt an', () => {
    store.setActiveSection('foundation-size')
    store.setPreviewMode('dark')
    expect(store.canUndo()).toBe(false)
  })

  it('async-Aktionen legen den Schritt nach dem await an', async () => {
    store.updateFoundationToken('radius', 'md', '13px')
    const vorher = store.state.history.length
    globalThis.fetch = vi.fn(() => Promise.reject(new Error('offline')))
    await store.loadNeoDefaults()
    expect(store.state.history.length).toBe(vorher + 1)
    store.undo()
    expect(store.currentFoundation.radius.md).toBe('13px')
  })
})
