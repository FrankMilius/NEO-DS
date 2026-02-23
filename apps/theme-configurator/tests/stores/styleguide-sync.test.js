/**
 * Unit-Tests für den Styleguide Sync Store
 * Testet: Detection, Security Guards, Pipeline Orchestration, Dialog.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useStyleguideSync } from '../../src/stores/styleguide-sync.js'

describe('useStyleguideSync', () => {
  let sync

  beforeEach(() => {
    sync = useStyleguideSync()
    // Reset state
    sync.state.existingPalettes = []
    sync.state.loaded = false
    sync.state.fetchError = null
    sync.state.stage = 'idle'
    sync.state.stageMessage = ''
    sync.state.pendingPalettes = []
    sync.state.mergeRequest = null
    sync.state.showDialog = false
    sync.state.dialogContext = null
    sync.state.lastSync = null
    sync.state.syncLog = []

    // Mock fetch globally
    vi.stubGlobal('fetch', vi.fn())
  })

  // ═══════════════════════════════════════════════════════════════
  // State-Initialisierung
  // ═══════════════════════════════════════════════════════════════

  describe('State-Initialisierung', () => {
    it('startet im idle-Stage', () => {
      expect(sync.state.stage).toBe('idle')
    })

    it('startet ohne Dialog', () => {
      expect(sync.state.showDialog).toBe(false)
    })

    it('hat leere existingPalettes', () => {
      expect(sync.state.existingPalettes).toEqual([])
    })
  })

  // ═══════════════════════════════════════════════════════════════
  // Computed
  // ═══════════════════════════════════════════════════════════════

  describe('Computed Properties', () => {
    it('hasPendingUpdates ist false bei leeren pendingPalettes', () => {
      expect(sync.hasPendingUpdates.value).toBe(false)
    })

    it('hasPendingUpdates ist true bei vorhandenen pendingPalettes', () => {
      sync.state.pendingPalettes = [{ id: 'test', label: 'Test', base: '#ff0000' }]
      expect(sync.hasPendingUpdates.value).toBe(true)
    })

    it('pendingCount gibt korrekte Anzahl zurück', () => {
      sync.state.pendingPalettes = [
        { id: 'a', label: 'A', base: '#ff0000' },
        { id: 'b', label: 'B', base: '#00ff00' }
      ]
      expect(sync.pendingCount.value).toBe(2)
    })

    it('isProcessing ist true während detecting/forging/merging', () => {
      sync.state.stage = 'detecting'
      expect(sync.isProcessing.value).toBe(true)
      sync.state.stage = 'forging'
      expect(sync.isProcessing.value).toBe(true)
      sync.state.stage = 'merging'
      expect(sync.isProcessing.value).toBe(true)
      sync.state.stage = 'review'
      expect(sync.isProcessing.value).toBe(false)
    })

    it('canMerge ist nur true bei review + mergeRequest', () => {
      expect(sync.canMerge.value).toBe(false)
      sync.state.stage = 'review'
      expect(sync.canMerge.value).toBe(false)
      sync.state.mergeRequest = { palettes: [] }
      expect(sync.canMerge.value).toBe(true)
    })
  })

  // ═══════════════════════════════════════════════════════════════
  // Security Guards
  // ═══════════════════════════════════════════════════════════════

  describe('Security Guards', () => {
    it('isNeoDefaultTheme gibt true für NEO-Default zurück', () => {
      const mockStore = {
        state: { activeThemeSet: 'neo', currentThemeMeta: null }
      }
      expect(sync.isNeoDefaultTheme(mockStore)).toBe(true)
    })

    it('isNeoDefaultTheme gibt false für Custom-Theme zurück', () => {
      const mockStore = {
        state: { activeThemeSet: 'neo', currentThemeMeta: { id: 'test', name: 'Test' } }
      }
      expect(sync.isNeoDefaultTheme(mockStore)).toBe(false)
    })

    it('isNeoDefaultTheme gibt false für Customer-Theme-Set zurück', () => {
      const mockStore = {
        state: { activeThemeSet: 'customer', currentThemeMeta: null }
      }
      expect(sync.isNeoDefaultTheme(mockStore)).toBe(false)
    })

    it('isNeoDefaultTheme gibt false ohne Store zurück', () => {
      expect(sync.isNeoDefaultTheme(null)).toBe(false)
    })
  })

  // ═══════════════════════════════════════════════════════════════
  // Detection
  // ═══════════════════════════════════════════════════════════════

  describe('detectPendingUpdates', () => {
    it('erkennt neue Paletten die nicht in existingPalettes sind', () => {
      sync.state.existingPalettes = [{ id: 'existing', base: '#000' }]
      const result = sync.detectPendingUpdates([
        { id: 'existing', label: 'Existing', base: '#000' },
        { id: 'new-one', label: 'New One', base: '#ff0000' }
      ])
      expect(result).toBe(true)
      expect(sync.state.pendingPalettes).toHaveLength(1)
      expect(sync.state.pendingPalettes[0].id).toBe('new-one')
    })

    it('gibt false zurück wenn alle Paletten existieren', () => {
      sync.state.existingPalettes = [{ id: 'a', base: '#000' }]
      const result = sync.detectPendingUpdates([{ id: 'a', label: 'A', base: '#000' }])
      expect(result).toBe(false)
      expect(sync.state.pendingPalettes).toHaveLength(0)
    })

    it('behandelt leere Arrays korrekt', () => {
      const result = sync.detectPendingUpdates([])
      expect(result).toBe(false)
    })

    it('behandelt ungültige Eingabe', () => {
      sync.detectPendingUpdates(null)
      expect(sync.state.pendingPalettes).toHaveLength(0)
    })
  })

  // ═══════════════════════════════════════════════════════════════
  // Pipeline Orchestration
  // ═══════════════════════════════════════════════════════════════

  describe('startPipeline', () => {
    it('blockiert Custom-Themes', async () => {
      const mockStore = {
        state: { activeThemeSet: 'neo', currentThemeMeta: { id: 'custom', name: 'Custom' } }
      }
      const result = await sync.startPipeline([], {}, mockStore)
      expect(result).toBe(false)
      expect(sync.state.stage).toBe('idle')
    })

    it('blockiert Customer-Theme-Set', async () => {
      const mockStore = {
        state: { activeThemeSet: 'customer', currentThemeMeta: null }
      }
      const result = await sync.startPipeline([], {}, mockStore)
      expect(result).toBe(false)
    })
  })

  // ═══════════════════════════════════════════════════════════════
  // quickDetect
  // ═══════════════════════════════════════════════════════════════

  describe('quickDetect', () => {
    it('gibt false zurück wenn nicht geladen', () => {
      sync.state.loaded = false
      const result = sync.quickDetect([])
      expect(result).toBe(false)
    })

    it('gibt false zurück für Custom-Theme', () => {
      sync.state.loaded = true
      const mockStore = {
        state: { activeThemeSet: 'neo', currentThemeMeta: { id: 'test' } }
      }
      const result = sync.quickDetect([], mockStore)
      expect(result).toBe(false)
    })

    it('erkennt Pending bei NEO-Default', () => {
      sync.state.loaded = true
      sync.state.existingPalettes = []
      const mockStore = {
        state: { activeThemeSet: 'neo', currentThemeMeta: null }
      }
      const result = sync.quickDetect(
        [{ id: 'new', label: 'New', base: '#ff0000' }],
        mockStore
      )
      expect(result).toBe(true)
      expect(sync.state.pendingPalettes).toHaveLength(1)
    })
  })

  // ═══════════════════════════════════════════════════════════════
  // Dialog Management
  // ═══════════════════════════════════════════════════════════════

  describe('Dialog Management', () => {
    it('dismissDialog setzt Dialog-Zustand zurück', () => {
      sync.state.showDialog = true
      sync.state.dialogContext = { trigger: 'manual' }
      sync.state.mergeRequest = { palettes: [] }
      sync.state.stage = 'review'

      sync.dismissDialog()

      expect(sync.state.showDialog).toBe(false)
      expect(sync.state.dialogContext).toBeNull()
      expect(sync.state.mergeRequest).toBeNull()
      expect(sync.state.stage).toBe('idle')
    })

    it('retryMerge setzt Stage auf review', () => {
      sync.state.stage = 'error'
      sync.retryMerge()
      expect(sync.state.stage).toBe('review')
    })

    it('promptForUpdate zeigt Dialog an', () => {
      sync.promptForUpdate({ trigger: 'test' })
      expect(sync.state.showDialog).toBe(true)
      expect(sync.state.dialogContext.trigger).toBe('test')
    })
  })

  // ═══════════════════════════════════════════════════════════════
  // Logging
  // ═══════════════════════════════════════════════════════════════

  describe('Logging', () => {
    it('syncLog wächst mit Aktionen', () => {
      sync.detectPendingUpdates([])
      expect(sync.state.syncLog.length).toBeGreaterThan(0)
    })

    it('syncLog hat korrekte Eintragsstruktur', () => {
      sync.detectPendingUpdates([])
      const entry = sync.state.syncLog[0]
      expect(entry).toHaveProperty('timestamp')
      expect(entry).toHaveProperty('action')
      expect(entry).toHaveProperty('detail')
    })
  })
})
