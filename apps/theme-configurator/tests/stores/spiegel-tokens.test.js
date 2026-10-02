/**
 * MIRROR_TOKEN_MAP (Plan v2, 3.2): ESLint (no-dupe-keys) fand doppelte
 * Schluessel — im Objektliteral gewinnt der letzte, die frueheren Ziele
 * gingen still verloren (z. B. nc-input-radius → nc-input-group-radius).
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { useThemeStore } from '../../src/stores/theme.js'
import { MIRROR_TOKEN_MAP } from '../../src/stores/theme/token-aktionen.js'
import { componentTokenGroups } from '../../src/data/tokens.generated.js'

describe('MIRROR_TOKEN_MAP', () => {
  it('fuehrt alle Ziele je Quelle (keine verlorenen Doppel-Eintraege)', () => {
    // Plan v3 (02.10.2026): item/toolbar-Radius erben per CSS-Kette, nicht mehr per Spiegel
    expect(MIRROR_TOKEN_MAP['nc-input-radius']).toEqual(['nc-input-group-radius', 'nc-toggle-group-radius'])
    // Entscheidung 02.10.2026: Benachrichtigung/Kennzahl per CSS-Kette, Akkordeon-Medien und Avatar entkoppelt
    expect(MIRROR_TOKEN_MAP['nc-card-radius']).toBeUndefined()
    // Befehlspalette erbt per CSS-Kette vom Dialog (Entscheidung 02.10.2026)
    expect(MIRROR_TOKEN_MAP['nc-dialog-shadow']).toBeUndefined()
    for (const z of ['nc-avatar-badge-online', 'nc-avatar-badge-busy', 'nc-avatar-badge-away', 'nc-dialog-danger-action-bg', 'nc-treeview-gap', 'nc-dt-radius', 'nc-table-shadow', 'nc-dt-batch-shadow', 'nc-fieldset-card-shadow']) {
      expect(Object.values(MIRROR_TOKEN_MAP).flat(), z).not.toContain(z)
    }
  })

  describe('Spiegeln im Store', () => {
    let store
    beforeEach(() => {
      store = useThemeStore()
      store.state.activeThemeSet = 'neo'
      store.state.componentOverrides = { neo: {}, customer: {} }
      store.state.syncGeometry = true
    })

    it('nc-input-radius erreicht wieder auch nc-input-group-radius', () => {
      store.updateComponentToken('nc-input-radius', '12px')
      const o = store.state.componentOverrides.neo
      expect(o['nc-input-group-radius']).toBe('12px')
      expect(o['nc-toggle-group-radius']).toBe('12px')
      // Toolbar folgt jetzt ueber die CSS-Kette (kein kopierter Wert)
      expect(o['nc-toolbar-radius']).toBeUndefined()
    })

    it('Reset nimmt alle gespiegelten Ziele mit', () => {
      store.updateComponentToken('nc-input-radius', '20px')
      store.resetComponentToken('nc-input-radius')
      const o = store.state.componentOverrides.neo
      for (const id of MIRROR_TOKEN_MAP['nc-input-radius']) expect(o[id]).toBeUndefined()
    })
  })

  it('umgestellte Paare stehen als CSS-Kette im Standard (Plan v3)', () => {
    const standard = (id) => componentTokenGroups.flatMap((g) => g.tokens).find((t) => t.id === id)?.default
    expect(standard('nc-toolbar-radius')).toBe('var(--nc-input-radius)')
    expect(standard('nc-item-radius')).toBe('var(--nc-input-radius)')
    expect(standard('nc-drawer-shadow')).toBe('var(--nc-dialog-shadow)')
    expect(standard('nc-search-command-shadow')).toBe('var(--nc-dialog-shadow)')
    expect(standard('nc-badge-success-bg')).toBe('var(--nc-tag-success-bg)')
    expect(Object.values(MIRROR_TOKEN_MAP).flat()).not.toContain('nc-toolbar-radius')
  })
})
