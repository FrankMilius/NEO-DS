// Neue Foundation-Kategorien in der Konfig-App (Plan v2, Schritt 2.4 · 30.09.2026):
// Groessen, Tracking und die Rollen-Schriftstaerken kommen aus der Quelle und
// muessen auch in aelteren gespeicherten Staenden ankommen.
import { describe, it, expect, beforeEach } from 'vitest'
import { useThemeStore } from '../../src/stores/theme.js'
import { foundationTokens } from '../../src/data/tokens.generated.js'

describe('Neue Foundation-Kategorien', () => {
  let store
  beforeEach(() => {
    localStorage.clear()
    store = useThemeStore()
    store.state.activeThemeSet = 'neo'
  })

  it('Quelle liefert size, tracking und die Rollen-Staerken mit CSS-Namen', () => {
    expect(foundationTokens.size.tokens['touch-target']).toMatchObject({ value: '2.75rem', cssVar: '--fnd-size-touch-target' })
    expect(foundationTokens.tracking.tokens.snug).toMatchObject({ value: '-0.01em', cssVar: '--fnd-tracking-snug' })
    expect(foundationTokens.typography.tokens['weight-heading-strong']).toMatchObject({ value: 600, cssVar: '--fnd-font-weight-heading-strong' })
  })

  it('ein gespeicherter Stand ohne die neuen Kategorien wird beim Laden ergaenzt', () => {
    const alt = JSON.parse(JSON.stringify(store.state.foundationOverrides))
    for (const set of ['neo', 'customer']) { delete alt[set].size; delete alt[set].tracking; delete alt[set].typography['weight-mono'] }
    alt.neo.radius.md = '7px' // eigener Wert, muss erhalten bleiben
    store.saveToStorage()
    const data = JSON.parse(localStorage.getItem('neo-theme-configurator'))
    data.foundationOverrides = alt
    localStorage.setItem('neo-theme-configurator', JSON.stringify(data))

    store.loadFromStorage()
    const f = store.currentFoundation
    expect(f.size['touch-target']).toBe('2.75rem')
    expect(f.tracking.wide).toBe('0.02em')
    expect(f.typography['weight-mono']).toBe(400)
    expect(f.radius.md).toBe('7px')
  })

  it('Bearbeiten einer fehlenden Kategorie stuerzt nicht ab', () => {
    delete store.state.foundationOverrides.neo.size
    expect(() => store.updateFoundationToken('size', 'md', '2.25rem')).not.toThrow()
    expect(store.currentFoundation.size.md).toBe('2.25rem')
  })
})
