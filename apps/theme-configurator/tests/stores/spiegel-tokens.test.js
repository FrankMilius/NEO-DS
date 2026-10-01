/**
 * MIRROR_TOKEN_MAP (Plan v2, 3.2): ESLint (no-dupe-keys) fand doppelte
 * Schluessel — im Objektliteral gewinnt der letzte, die frueheren Ziele
 * gingen still verloren (z. B. nc-input-radius → nc-input-group-radius).
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { useThemeStore } from '../../src/stores/theme.js'
import { MIRROR_TOKEN_MAP } from '../../src/stores/theme/token-aktionen.js'

describe('MIRROR_TOKEN_MAP', () => {
  it('fuehrt alle Ziele je Quelle (keine verlorenen Doppel-Eintraege)', () => {
    expect(MIRROR_TOKEN_MAP['nc-input-radius']).toEqual(
      ['nc-input-group-radius', 'nc-toggle-group-radius', 'nc-item-radius', 'nc-toolbar-radius'])
    expect(MIRROR_TOKEN_MAP['nc-card-radius']).toEqual(
      ['nc-notification-radius', 'nc-metric-radius', 'nc-accordion-media-radius', 'nc-avatar-radius-square'])
    expect(MIRROR_TOKEN_MAP['nc-dialog-shadow']).toEqual(['nc-drawer-shadow', 'nc-search-command-shadow'])
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
      expect(o['nc-toolbar-radius']).toBe('12px')
    })

    it('Reset nimmt alle gespiegelten Ziele mit', () => {
      store.updateComponentToken('nc-card-radius', '20px')
      store.resetComponentToken('nc-card-radius')
      const o = store.state.componentOverrides.neo
      for (const id of MIRROR_TOKEN_MAP['nc-card-radius']) expect(o[id]).toBeUndefined()
    })
  })
})
