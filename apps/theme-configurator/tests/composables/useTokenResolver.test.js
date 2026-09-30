// useTokenResolver (Plan v2, Schritt 3.1): die Reihenfolge der Aufloesung,
// wie sie vorher in 49 Arena-Kopien stand.
import { describe, it, expect } from 'vitest'
import { ref } from 'vue'
import { resolveTokenValue, useTokenResolver } from '../../src/composables/useTokenResolver.js'

const semantik = { 'background-accent': '#37e93d', 'text-primary': '#161816' }
const tokens = [
  { id: 'nc-x-bg', ref: 'background-accent' },
  { id: 'nc-x-pad', default: '12px' },
  { id: 'nc-x-leer' },
  { id: 'nc-x-toter-ref', ref: 'gibt-es-nicht', default: '4px' },
]
const refs = { 'nc-x-color': 'text-primary', 'nc-x-leer': 'text-primary' }
const defaults = { 'nc-x-radius': '8px' }
const r = (id, extra = {}) => resolveTokenValue(semantik, id, { tokens, refs, defaults, ...extra })

describe('resolveTokenValue', () => {
  it('1. Override hat Vorrang, auch als leerer String', () => {
    expect(r('nc-x-bg', { overrides: { 'nc-x-bg': '#ff0000' } })).toBe('#ff0000')
    expect(r('nc-x-bg', { overrides: { 'nc-x-bg': '' } })).toBe('')
  })
  it('2. Token-Verweis auf eine Rolle, sonst default des Tokens', () => {
    expect(r('nc-x-bg')).toBe('#37e93d')
    expect(r('nc-x-pad')).toBe('12px')
    expect(r('nc-x-toter-ref')).toBe('4px')
  })
  it('3. TOKEN_REFS, wenn das Token nichts liefert oder fehlt', () => {
    expect(r('nc-x-leer')).toBe('#161816')
    expect(r('nc-x-color')).toBe('#161816')
  })
  it('4. TOKEN_DEFAULTS, zuletzt leerer String', () => {
    expect(r('nc-x-radius')).toBe('8px')
    expect(r('nc-x-unbekannt')).toBe('')
  })
  it('vertraegt fehlende Token-Liste und fehlende Overrides', () => {
    expect(resolveTokenValue(semantik, 'nc-x-radius', { defaults })).toBe('8px')
    expect(resolveTokenValue(undefined, 'nc-x-radius', { defaults })).toBe('8px')
  })
})

describe('useTokenResolver', () => {
  it('liest Store und componentData bei jedem Aufruf neu (reaktiv)', () => {
    const store = { currentComponentOverrides: ref({}) }
    const componentData = ref({ tokens })
    const { resolveToken } = useTokenResolver({ store, componentData, refs, defaults })
    expect(resolveToken(semantik, 'nc-x-bg')).toBe('#37e93d')
    store.currentComponentOverrides.value = { 'nc-x-bg': '#000000' }
    expect(resolveToken(semantik, 'nc-x-bg')).toBe('#000000')
    componentData.value = null
    expect(resolveToken(semantik, 'nc-x-radius')).toBe('8px')
  })
})
