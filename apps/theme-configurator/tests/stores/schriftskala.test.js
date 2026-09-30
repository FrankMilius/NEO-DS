// Fluide Schriftskala in der Konfig-App (Plan v2, Schritt 2.3 · 30.09.2026):
// Basis und Verhaeltnisse sind je Theme-Set einstellbar, werden gespeichert
// und nur dann exportiert, wenn sie von der Quelle abweichen.
import { describe, it, expect, beforeEach } from 'vitest'
import { useThemeStore } from '../../src/stores/theme.js'
import { schriftskalaZeilen } from '../../src/export/type-scale-css.js'
import { generateDrupalCSS } from '../../src/export/drupal-adapter.js'

describe('Schriftskala im Store', () => {
  let store
  beforeEach(() => {
    localStorage.clear()
    store = useThemeStore()
    store.resetTypeScale()
    store.state.activeThemeSet = 'neo'
    store.resetTypeScale()
  })

  it('akzeptiert nur erlaubte Schluessel und positive Zahlen', () => {
    store.updateTypeScale('base_max_px', 19)
    store.updateTypeScale('ratio_max', '1.3')
    store.updateTypeScale('floor_px', 10)
    store.updateTypeScale('base_min_px', -4)
    store.updateTypeScale('ratio_min', 'abc')
    expect(store.currentTypeScale.value).toEqual({ base_max_px: 19, ratio_max: 1.3 })
  })

  it('Theme-Sets sind getrennt, Reset betrifft nur das aktive', () => {
    store.updateTypeScale('base_max_px', 19)
    store.state.activeThemeSet = 'customer'
    store.updateTypeScale('base_max_px', 20)
    store.resetTypeScale()
    expect(store.currentTypeScale.value).toEqual({})
    store.state.activeThemeSet = 'neo'
    expect(store.currentTypeScale.value).toEqual({ base_max_px: 19 })
  })

  it('wird gespeichert und wieder geladen', () => {
    store.updateTypeScale('ratio_max', 1.3)
    store.saveToStorage()
    store.state.typeScale.neo = {}
    store.loadFromStorage()
    expect(store.state.typeScale.neo).toEqual({ ratio_max: 1.3 })
  })

  it('CSS-Export enthaelt --fs-* nur nach einer Aenderung', () => {
    expect(store.exportAsCSSVars()).not.toContain('--fs-')
    store.updateTypeScale('base_max_px', 20)
    const css = store.exportAsCSSVars()
    expect(css).toContain('--fs-base:')
    expect(css.match(/--fs-[a-z0-9]+:/g)).toHaveLength(14)
  })

  it('JSON- und Drupal-Export tragen die Skala', () => {
    store.updateTypeScale('base_max_px', 20)
    const json = JSON.parse(store.exportAsJSON())
    expect(json.typeScale).toEqual({ base_max_px: 20 })
    expect(generateDrupalCSS(json)).toContain('--fs-base:')
  })
})

describe('schriftskalaZeilen', () => {
  it('liefert nichts ohne Aenderung oder mit Quellwerten', () => {
    expect(schriftskalaZeilen()).toEqual([])
    expect(schriftskalaZeilen({})).toEqual([])
  })
  it('liefert 14 Stufen mit clamp()', () => {
    const z = schriftskalaZeilen({ ratio_max: 1.3 })
    expect(z).toHaveLength(14)
    for (const zeile of z) expect(zeile).toMatch(/^ {2}--fs-[a-z0-9]+: clamp\(/)
  })
})
