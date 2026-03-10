/**
 * Persistence-Tests für den Theme Store
 * Stellt sicher, dass pro Theme (Light/Dark) definierte Werte
 * und zugeordnete Tokens persistent in localStorage gespeichert werden.
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { useThemeStore } from '../../src/stores/theme.js'

describe('Theme Persistence — Semantic Token Values per Theme', () => {
  let store

  beforeEach(() => {
    localStorage.clear()
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
  // Light-Theme Persistence
  // ═══════════════════════════════════════════════════════════════

  describe('Light-Theme Token-Persistenz', () => {
    it('speichert einen Light-Token-Wert in localStorage', () => {
      store.state.previewMode = 'light'
      store.updateSemanticToken('text-primary', '#111111')
      store.saveToStorage()

      const raw = localStorage.getItem('neo-theme-configurator')
      const data = JSON.parse(raw)
      expect(data.themes.neo.light['text-primary']).toBe('#111111')
    })

    it('stellt einen Light-Token-Wert nach loadFromStorage wieder her', () => {
      store.state.previewMode = 'light'
      store.updateSemanticToken('background-base', '#fafafa')
      store.saveToStorage()

      // Wert manuell ueberschreiben
      store.state.themes.neo.light['background-base'] = '#000000'
      expect(store.state.themes.neo.light['background-base']).toBe('#000000')

      // Laden
      store.loadFromStorage()
      expect(store.state.themes.neo.light['background-base']).toBe('#fafafa')
    })

    it('persistiert mehrere Light-Tokens gleichzeitig', () => {
      store.state.previewMode = 'light'
      store.updateSemanticToken('text-primary', '#aaa111')
      store.updateSemanticToken('text-secondary', '#bbb222')
      store.updateSemanticToken('interactive-default', '#ccc333')
      store.saveToStorage()

      const raw = localStorage.getItem('neo-theme-configurator')
      const data = JSON.parse(raw)
      expect(data.themes.neo.light['text-primary']).toBe('#aaa111')
      expect(data.themes.neo.light['text-secondary']).toBe('#bbb222')
      expect(data.themes.neo.light['interactive-default']).toBe('#ccc333')
    })
  })

  // ═══════════════════════════════════════════════════════════════
  // Dark-Theme Persistence
  // ═══════════════════════════════════════════════════════════════

  describe('Dark-Theme Token-Persistenz', () => {
    it('speichert einen Dark-Token-Wert in localStorage', () => {
      store.state.previewMode = 'dark'
      store.updateSemanticToken('text-primary', '#eeeeee')
      store.saveToStorage()

      const raw = localStorage.getItem('neo-theme-configurator')
      const data = JSON.parse(raw)
      expect(data.themes.neo.dark['text-primary']).toBe('#eeeeee')
    })

    it('stellt einen Dark-Token-Wert nach loadFromStorage wieder her', () => {
      store.state.previewMode = 'dark'
      store.updateSemanticToken('background-base', '#1a1a1a')
      store.saveToStorage()

      // Wert manuell ueberschreiben
      store.state.themes.neo.dark['background-base'] = '#ffffff'
      expect(store.state.themes.neo.dark['background-base']).toBe('#ffffff')

      // Laden
      store.loadFromStorage()
      expect(store.state.themes.neo.dark['background-base']).toBe('#1a1a1a')
    })

    it('persistiert mehrere Dark-Tokens gleichzeitig', () => {
      store.state.previewMode = 'dark'
      store.updateSemanticToken('text-primary', '#ddd111')
      store.updateSemanticToken('border-primary', '#ddd222')
      store.updateSemanticToken('text-on-interactive', '#ffffff')
      store.saveToStorage()

      const raw = localStorage.getItem('neo-theme-configurator')
      const data = JSON.parse(raw)
      expect(data.themes.neo.dark['text-primary']).toBe('#ddd111')
      expect(data.themes.neo.dark['border-primary']).toBe('#ddd222')
      expect(data.themes.neo.dark['text-on-interactive']).toBe('#ffffff')
    })
  })

  // ═══════════════════════════════════════════════════════════════
  // Light + Dark Isolation
  // ═══════════════════════════════════════════════════════════════

  describe('Light- und Dark-Werte sind voneinander isoliert', () => {
    it('aendert Light ohne Dark zu beeinflussen', () => {
      const darkBefore = store.state.themes.neo.dark['text-primary']

      store.state.previewMode = 'light'
      store.updateSemanticToken('text-primary', '#light1')
      store.saveToStorage()

      const raw = localStorage.getItem('neo-theme-configurator')
      const data = JSON.parse(raw)
      expect(data.themes.neo.light['text-primary']).toBe('#light1')
      expect(data.themes.neo.dark['text-primary']).toBe(darkBefore)
    })

    it('aendert Dark ohne Light zu beeinflussen', () => {
      const lightBefore = store.state.themes.neo.light['text-primary']

      store.state.previewMode = 'dark'
      store.updateSemanticToken('text-primary', '#dark01')
      store.saveToStorage()

      const raw = localStorage.getItem('neo-theme-configurator')
      const data = JSON.parse(raw)
      expect(data.themes.neo.dark['text-primary']).toBe('#dark01')
      expect(data.themes.neo.light['text-primary']).toBe(lightBefore)
    })

    it('persistiert Light und Dark unabhaengig nach Roundtrip', () => {
      store.state.previewMode = 'light'
      store.updateSemanticToken('interactive-default', '#0000ff')

      store.state.previewMode = 'dark'
      store.updateSemanticToken('interactive-default', '#00ff00')

      store.saveToStorage()

      // Werte ueberschreiben
      store.state.themes.neo.light['interactive-default'] = '#000000'
      store.state.themes.neo.dark['interactive-default'] = '#000000'

      store.loadFromStorage()
      expect(store.state.themes.neo.light['interactive-default']).toBe('#0000ff')
      expect(store.state.themes.neo.dark['interactive-default']).toBe('#00ff00')
    })
  })

  // ═══════════════════════════════════════════════════════════════
  // Split-Mode schreibt in Light
  // ═══════════════════════════════════════════════════════════════

  describe('Split-Mode schreibt korrekt in Light', () => {
    it('updateSemanticToken im Split-Mode schreibt in light', () => {
      store.state.previewMode = 'split'
      store.updateSemanticToken('text-primary', '#split1')

      expect(store.state.themes.neo.light['text-primary']).toBe('#split1')
      // Dark bleibt unveraendert
      expect(store.state.themes.neo.dark['text-primary']).not.toBe('#split1')
    })

    it('Split-Mode Werte werden persistent gespeichert', () => {
      store.state.previewMode = 'split'
      store.updateSemanticToken('background-base', '#split2')
      store.saveToStorage()

      const raw = localStorage.getItem('neo-theme-configurator')
      const data = JSON.parse(raw)
      expect(data.themes.neo.light['background-base']).toBe('#split2')
    })
  })

  // ═══════════════════════════════════════════════════════════════
  // Customer-Theme Persistence
  // ═══════════════════════════════════════════════════════════════

  describe('Customer-Theme Token-Persistenz', () => {
    it('speichert Customer-Light-Token in localStorage', () => {
      store.state.activeThemeSet = 'customer'
      store.state.previewMode = 'light'
      store.updateSemanticToken('text-primary', '#cust01')
      store.saveToStorage()

      const raw = localStorage.getItem('neo-theme-configurator')
      const data = JSON.parse(raw)
      expect(data.themes.customer.light['text-primary']).toBe('#cust01')
    })

    it('speichert Customer-Dark-Token in localStorage', () => {
      store.state.activeThemeSet = 'customer'
      store.state.previewMode = 'dark'
      store.updateSemanticToken('text-primary', '#cust02')
      store.saveToStorage()

      const raw = localStorage.getItem('neo-theme-configurator')
      const data = JSON.parse(raw)
      expect(data.themes.customer.dark['text-primary']).toBe('#cust02')
    })

    it('Neo und Customer Themes sind isoliert', () => {
      store.state.activeThemeSet = 'neo'
      store.state.previewMode = 'light'
      store.updateSemanticToken('text-primary', '#neo001')

      store.state.activeThemeSet = 'customer'
      store.state.previewMode = 'light'
      store.updateSemanticToken('text-primary', '#cust03')

      store.saveToStorage()

      const raw = localStorage.getItem('neo-theme-configurator')
      const data = JSON.parse(raw)
      expect(data.themes.neo.light['text-primary']).toBe('#neo001')
      expect(data.themes.customer.light['text-primary']).toBe('#cust03')
    })
  })

  // ═══════════════════════════════════════════════════════════════
  // Vollstaendiger Roundtrip aller 4 Theme-Slots
  // ═══════════════════════════════════════════════════════════════

  describe('Vollstaendiger Roundtrip (4 Themes)', () => {
    it('persistiert Aenderungen in allen 4 Theme-Slots korrekt', () => {
      // Neo Light
      store.state.activeThemeSet = 'neo'
      store.state.previewMode = 'light'
      store.updateSemanticToken('background-base', '#nl0001')

      // Neo Dark
      store.state.previewMode = 'dark'
      store.updateSemanticToken('background-base', '#nd0001')

      // Customer Light
      store.state.activeThemeSet = 'customer'
      store.state.previewMode = 'light'
      store.updateSemanticToken('background-base', '#cl0001')

      // Customer Dark
      store.state.previewMode = 'dark'
      store.updateSemanticToken('background-base', '#cd0001')

      store.saveToStorage()

      // Alle Werte ueberschreiben
      store.state.themes.neo.light['background-base'] = '#000000'
      store.state.themes.neo.dark['background-base'] = '#000000'
      store.state.themes.customer.light['background-base'] = '#000000'
      store.state.themes.customer.dark['background-base'] = '#000000'

      store.loadFromStorage()

      expect(store.state.themes.neo.light['background-base']).toBe('#nl0001')
      expect(store.state.themes.neo.dark['background-base']).toBe('#nd0001')
      expect(store.state.themes.customer.light['background-base']).toBe('#cl0001')
      expect(store.state.themes.customer.dark['background-base']).toBe('#cd0001')
    })
  })

  // ═══════════════════════════════════════════════════════════════
  // On-Interactive und spezifische Token-Persistenz
  // ═══════════════════════════════════════════════════════════════

  describe('Spezifische Token-Persistenz (On-Interactive, Feedback, etc.)', () => {
    it('persistiert text-on-interactive fuer Light und Dark getrennt', () => {
      store.state.previewMode = 'light'
      store.updateSemanticToken('text-on-interactive', '#ffffff')

      store.state.previewMode = 'dark'
      store.updateSemanticToken('text-on-interactive', '#000000')

      store.saveToStorage()

      store.state.themes.neo.light['text-on-interactive'] = '#aaaaaa'
      store.state.themes.neo.dark['text-on-interactive'] = '#aaaaaa'

      store.loadFromStorage()

      expect(store.state.themes.neo.light['text-on-interactive']).toBe('#ffffff')
      expect(store.state.themes.neo.dark['text-on-interactive']).toBe('#000000')
    })

    it('persistiert Feedback-Tokens (text-warning, text-info)', () => {
      store.state.previewMode = 'light'
      store.updateSemanticToken('text-warning', '#f59e0b')
      store.updateSemanticToken('text-info', '#3b82f6')
      store.saveToStorage()

      store.state.themes.neo.light['text-warning'] = '#000000'
      store.state.themes.neo.light['text-info'] = '#000000'

      store.loadFromStorage()

      expect(store.state.themes.neo.light['text-warning']).toBe('#f59e0b')
      expect(store.state.themes.neo.light['text-info']).toBe('#3b82f6')
    })

    it('persistiert On-Color-Tokens (on-accent, on-success, on-danger)', () => {
      store.state.previewMode = 'dark'
      store.updateSemanticToken('on-accent', '#fefefe')
      store.updateSemanticToken('on-success', '#fdfdfd')
      store.updateSemanticToken('on-danger', '#fcfcfc')
      store.saveToStorage()

      store.state.themes.neo.dark['on-accent'] = '#000000'
      store.state.themes.neo.dark['on-success'] = '#000000'
      store.state.themes.neo.dark['on-danger'] = '#000000'

      store.loadFromStorage()

      expect(store.state.themes.neo.dark['on-accent']).toBe('#fefefe')
      expect(store.state.themes.neo.dark['on-success']).toBe('#fdfdfd')
      expect(store.state.themes.neo.dark['on-danger']).toBe('#fcfcfc')
    })

    it('persistiert Border- und Layer-Tokens', () => {
      store.state.previewMode = 'light'
      store.updateSemanticToken('border-primary', '#d1d5db')
      store.updateSemanticToken('layer-01', '#f9fafb')
      store.saveToStorage()

      store.state.themes.neo.light['border-primary'] = '#000000'
      store.state.themes.neo.light['layer-01'] = '#000000'

      store.loadFromStorage()

      expect(store.state.themes.neo.light['border-primary']).toBe('#d1d5db')
      expect(store.state.themes.neo.light['layer-01']).toBe('#f9fafb')
    })
  })

  // ═══════════════════════════════════════════════════════════════
  // Neue Tokens die zugeordnet werden
  // ═══════════════════════════════════════════════════════════════

  describe('Neue Token-Zuordnungen werden persistent gespeichert', () => {
    it('neu zugeordneter Token wird gespeichert und wiederhergestellt', () => {
      // Simuliert: User weist einem semantischen Token einen neuen Primitive-Wert zu
      store.state.previewMode = 'light'
      store.updateSemanticToken('text-on-interactive', '#e2e8f0')
      store.saveToStorage()

      // Verifiziere, dass localStorage den Wert enthaelt
      const raw = localStorage.getItem('neo-theme-configurator')
      const data = JSON.parse(raw)
      expect(data.themes.neo.light['text-on-interactive']).toBe('#e2e8f0')

      // Roundtrip
      store.state.themes.neo.light['text-on-interactive'] = '#ffffff'
      store.loadFromStorage()
      expect(store.state.themes.neo.light['text-on-interactive']).toBe('#e2e8f0')
    })
  })

  // ═══════════════════════════════════════════════════════════════
  // Persistence nach Undo
  // ═══════════════════════════════════════════════════════════════

  describe('Persistence nach direkter Aenderung', () => {
    it('persistiert den manuell gesetzten Zustand korrekt', () => {
      store.state.activeThemeSet = 'neo'
      store.state.previewMode = 'light'

      // Mehrere aufeinanderfolgende Aenderungen
      store.updateSemanticToken('text-primary', '#aaa111')
      store.updateSemanticToken('text-primary', '#bbb222')
      store.updateSemanticToken('text-primary', '#ccc333')

      // Nur der letzte Wert zaehlt
      expect(store.state.themes.neo.light['text-primary']).toBe('#ccc333')

      store.saveToStorage()
      store.state.themes.neo.light['text-primary'] = '#999999'
      store.loadFromStorage()

      // Letzter Wert muss persistent sein
      expect(store.state.themes.neo.light['text-primary']).toBe('#ccc333')
    })
  })
})
