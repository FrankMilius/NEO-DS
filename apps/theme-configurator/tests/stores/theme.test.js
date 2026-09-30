/**
 * Unit-Tests für den Theme Store
 * Testet: State-Initialisierung, Token-Updates, Undo/Redo,
 * Theme-Lifecycle (Create/Load/Delete), Persistence, Export.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useThemeStore } from '../../src/stores/theme.js'

describe('useThemeStore', () => {
  let store

  beforeEach(() => {
    store = useThemeStore()
    // Reset zum Ausgangszustand
    store.state.activeThemeSet = 'neo'
    store.state.previewMode = 'light'
    store.state.currentThemeMeta = null
    store.state.savedThemes = []
    store.state.history = []
    store.state.historyIndex = -1
    store.state.componentOverrides = { neo: {}, customer: {} }
  })

  // ═══════════════════════════════════════════════════════════════
  // State-Initialisierung
  // ═══════════════════════════════════════════════════════════════

  describe('State-Initialisierung', () => {
    it('startet mit neo als activeThemeSet', () => {
      expect(store.state.activeThemeSet).toBe('neo')
    })

    it('startet mit light als previewMode', () => {
      expect(store.state.previewMode).toBe('light')
    })

    it('hat Themes für neo und customer', () => {
      expect(store.state.themes.neo).toBeDefined()
      expect(store.state.themes.customer).toBeDefined()
      expect(store.state.themes.neo.light).toBeDefined()
      expect(store.state.themes.neo.dark).toBeDefined()
    })

    it('startet ohne geladenes Theme (currentThemeMeta = null)', () => {
      expect(store.state.currentThemeMeta).toBeNull()
    })

    it('hat Version 1.0.0', () => {
      expect(store.state.version).toBe('1.0.0')
    })
  })

  // ═══════════════════════════════════════════════════════════════
  // Computed Properties
  // ═══════════════════════════════════════════════════════════════

  describe('Computed Properties', () => {
    it('currentThemeKey kombiniert themeSet und previewMode', () => {
      expect(store.currentThemeKey).toBe('neo-light')
      store.setPreviewMode('dark')
      expect(store.currentThemeKey).toBe('neo-dark')
    })

    it('currentThemeId mappt auf kanonische Theme-Klasse', () => {
      expect(store.currentThemeId).toBe('neo-light-theme')
      store.setActiveThemeSet('customer')
      store.setPreviewMode('dark')
      expect(store.currentThemeId).toBe('customer-dark-theme')
    })

    it('isNeoDefault ist true wenn neo + kein Theme geladen', () => {
      expect(store.isNeoDefault).toBe(true)
    })

    it('isNeoDefault ist false wenn Theme geladen', () => {
      store.state.currentThemeMeta = { id: 'test', name: 'Test' }
      expect(store.isNeoDefault).toBe(false)
    })

    it('currentSemanticTokens gibt aktive Theme-Tokens zurück', () => {
      const tokens = store.currentSemanticTokens
      expect(tokens).toBeDefined()
      expect(typeof tokens).toBe('object')
      // Sollte mindestens background-base enthalten
      expect(tokens['background-base']).toBeDefined()
    })
  })

  // ═══════════════════════════════════════════════════════════════
  // Token-Updates
  // ═══════════════════════════════════════════════════════════════

  describe('Token-Updates', () => {
    it('updateSemanticToken ändert den Token-Wert', () => {
      const before = store.currentSemanticTokens['background-base']
      store.updateSemanticToken('background-base', '#ff0000')
      expect(store.currentSemanticTokens['background-base']).toBe('#ff0000')
      expect(store.currentSemanticTokens['background-base']).not.toBe(before)
    })

    it('updateSemanticToken ignoriert unbekannte Token-IDs', () => {
      const tokensBefore = { ...store.currentSemanticTokens }
      store.updateSemanticToken('nonexistent-token', '#ff0000')
      // Kein Crash, Token-Objekt unverändert
      expect(store.currentSemanticTokens['background-base']).toBe(tokensBefore['background-base'])
    })

    it('updatePrimitive ändert die Primärfarbe', () => {
      store.updatePrimitive('primary', '#123456')
      expect(store.currentPrimitives.primary).toBe('#123456')
    })

    it('updateComponentToken setzt einen Override', () => {
      store.updateComponentToken('nc-button-bg', '#aabbcc')
      expect(store.currentComponentOverrides['nc-button-bg']).toBe('#aabbcc')
    })
  })

  // ═══════════════════════════════════════════════════════════════
  // Undo / Redo
  // ═══════════════════════════════════════════════════════════════

  describe('Undo / Redo', () => {
    // Jede Aenderung eine Sekunde spaeter — sonst fasst die History schnelle
    // Folgen (Slider) zu einem Schritt zusammen.
    let clock
    beforeEach(() => {
      clock = 1_000_000
      vi.spyOn(Date, 'now').mockImplementation(() => (clock += 1000))
      store.state.themes.neo.light['background-base'] = '#ffffff'
    })
    afterEach(() => vi.restoreAllMocks())

    const bg = () => store.currentSemanticTokens['background-base']

    it('undo nimmt eine einzelne Aenderung zurueck', () => {
      store.updateSemanticToken('background-base', '#111111')
      store.undo()
      expect(bg()).toBe('#ffffff')
      expect(store.canUndo()).toBe(false)
    })

    it('undo geht Schritt fuer Schritt zurueck, ohne einen zu ueberspringen', () => {
      store.updateSemanticToken('background-base', '#111111')
      store.updateSemanticToken('background-base', '#222222')
      store.undo()
      expect(bg()).toBe('#111111')
      store.undo()
      expect(bg()).toBe('#ffffff')
    })

    it('redo erreicht wieder den letzten Stand', () => {
      store.updateSemanticToken('background-base', '#111111')
      store.updateSemanticToken('background-base', '#222222')
      store.undo()
      store.undo()
      store.redo()
      expect(bg()).toBe('#111111')
      store.redo()
      expect(bg()).toBe('#222222')
      expect(store.canRedo()).toBe(false)
    })

    it('eine neue Aenderung nach undo verwirft den Redo-Zweig', () => {
      store.updateSemanticToken('background-base', '#111111')
      store.updateSemanticToken('background-base', '#222222')
      store.undo()
      store.updateSemanticToken('background-base', '#333333')
      expect(store.canRedo()).toBe(false)
      store.undo()
      expect(bg()).toBe('#111111')
      store.undo()
      expect(bg()).toBe('#ffffff')
    })

    it('schnelle Folgen (Slider) sind ein Undo-Schritt', () => {
      Date.now.mockImplementation(() => (clock += 50))
      store.updateSemanticToken('background-base', '#111111')
      store.updateSemanticToken('background-base', '#222222')
      store.updateSemanticToken('background-base', '#333333')
      store.undo()
      expect(bg()).toBe('#ffffff')
    })

    it('undo bei leerem Verlauf tut nichts', () => {
      store.undo()
      expect(bg()).toBe('#ffffff')
    })

    it('redo am Ende des Verlaufs tut nichts', () => {
      store.updateSemanticToken('background-base', '#ff0000')
      store.redo()
      expect(bg()).toBe('#ff0000')
    })

    it('History ist auf 50 Einträge begrenzt', () => {
      for (let i = 0; i < 55; i++) {
        store.updateSemanticToken('background-base', `#${String(i).padStart(6, '0')}`)
      }
      expect(store.state.history.length).toBeLessThanOrEqual(50)
    })
  })

  // ═══════════════════════════════════════════════════════════════
  // Theme-Lifecycle
  // ═══════════════════════════════════════════════════════════════

  describe('Theme-Lifecycle', () => {
    it('createTheme erstellt ein neues Theme', () => {
      const meta = store.createTheme('Test Theme', '2.0.0')
      expect(meta).toBeDefined()
      expect(meta.name).toBe('Test Theme')
      expect(meta.version).toBe('2.0.0')
      expect(meta.id).toMatch(/^theme-/)
      expect(store.state.currentThemeMeta).toStrictEqual(meta)
      expect(store.state.savedThemes).toHaveLength(1)
    })

    it('loadTheme lädt ein gespeichertes Theme', () => {
      const meta = store.createTheme('Load Test')
      const themeId = meta.id

      // Ändere etwas
      store.updateSemanticToken('background-base', '#aaaaaa')

      // Lade NEO Defaults zwischen
      store.state.currentThemeMeta = null
      store.state.activeThemeSet = 'neo'

      // Lade das Theme zurück
      const loaded = store.loadTheme(themeId)
      expect(loaded).toBe(true)
      expect(store.state.currentThemeMeta.id).toBe(themeId)
    })

    it('loadTheme gibt false bei unbekannter ID', () => {
      const loaded = store.loadTheme('nonexistent-id')
      expect(loaded).toBe(false)
    })

    it('deleteTheme löscht ein gespeichertes Theme', () => {
      const meta = store.createTheme('Delete Test')
      expect(store.state.savedThemes).toHaveLength(1)

      const deleted = store.deleteTheme(meta.id)
      expect(deleted).toBe(true)
      expect(store.state.savedThemes).toHaveLength(0)
      expect(store.state.currentThemeMeta).toBeNull()
    })

    it('deleteTheme verhindert Löschung des NEO-Defaults', () => {
      store.state.currentThemeMeta = null
      const deleted = store.deleteTheme('some-id')
      expect(deleted).toBe(false)
    })

    it('deleteTheme verhindert Löschung ohne themeId', () => {
      store.state.currentThemeMeta = { id: 'test', name: 'Test' }
      const deleted = store.deleteTheme(undefined)
      expect(deleted).toBe(false)
    })

    it('deleteTheme verhindert Löschung von nicht existierendem Theme', () => {
      store.state.currentThemeMeta = { id: 'test', name: 'Test' }
      const deleted = store.deleteTheme('nonexistent')
      expect(deleted).toBe(false)
    })
  })

  // ═══════════════════════════════════════════════════════════════
  // Persistence
  // ═══════════════════════════════════════════════════════════════

  describe('Persistence', () => {
    it('saveToStorage speichert in localStorage', () => {
      store.saveToStorage()
      const raw = localStorage.getItem('neo-theme-configurator')
      expect(raw).toBeTruthy()
      const data = JSON.parse(raw)
      expect(data.activeThemeSet).toBe('neo')
    })

    it('loadFromStorage lädt Theme-Werte aus localStorage', () => {
      store.state.themes.neo.light['background-base'] = '#123123'
      store.saveToStorage()

      store.state.themes.neo.light['background-base'] = '#ffffff'
      store.loadFromStorage()
      expect(store.state.themes.neo.light['background-base']).toBe('#123123')
    })

    it('loadFromStorage startet bewusst immer im Light Mode', () => {
      store.state.previewMode = 'dark'
      store.saveToStorage()
      store.loadFromStorage()
      expect(store.state.previewMode).toBe('light')
    })

    it('loadFromStorage ohne Daten crasht nicht', () => {
      localStorage.clear()
      expect(() => store.loadFromStorage()).not.toThrow()
    })
  })

  // ═══════════════════════════════════════════════════════════════
  // Export
  // ═══════════════════════════════════════════════════════════════

  describe('Export', () => {
    it('exportAsCSSVars gibt gültiges CSS zurück', () => {
      const css = store.exportAsCSSVars()
      expect(css).toContain('.neo-light-theme')
      expect(css).toContain('.neo-dark-theme')
      expect(css).toContain('--fnd-color-')
    })

    it('exportAsJSON gibt gültiges JSON zurück', () => {
      const json = store.exportAsJSON()
      const parsed = JSON.parse(json)
      expect(parsed.meta).toBeDefined()
      expect(parsed.meta.generator).toMatch(/^NEO Theme Configurator/)
      expect(parsed.semantic).toBeDefined()
      expect(parsed.semantic.light).toBeDefined()
      expect(parsed.semantic.dark).toBeDefined()
    })
  })

  // ═══════════════════════════════════════════════════════════════
  // Reset
  // ═══════════════════════════════════════════════════════════════

  describe('resetToDefaults', () => {
    it('setzt Themes auf Defaults zurück', () => {
      store.updateSemanticToken('background-base', '#ff0000')
      expect(store.currentSemanticTokens['background-base']).toBe('#ff0000')

      store.resetToDefaults()
      expect(store.currentSemanticTokens['background-base']).not.toBe('#ff0000')
    })

    it('setzt Component-Overrides zurück', () => {
      store.updateComponentToken('nc-button-bg', '#aabbcc')
      expect(Object.keys(store.currentComponentOverrides).length).toBe(1)

      store.resetToDefaults()
      expect(Object.keys(store.currentComponentOverrides).length).toBe(0)
    })
  })
})
