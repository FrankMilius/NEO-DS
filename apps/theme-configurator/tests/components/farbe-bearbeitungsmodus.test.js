// UX-08 (4-Theme-Matrix bringt den Farb-Inspector zum Absturz) und
// UX-13 (unklar, ob Hell oder Dunkel bearbeitet wird) — 15.10.2026
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { useThemeStore } from '../../src/stores/theme.js'
import FoundationColors from '../../src/components/foundation/FoundationColors.vue'

describe('Bearbeitungsmodus im Store', () => {
  let store
  beforeEach(() => { localStorage.clear(); store = useThemeStore(); store.state.activeThemeSet = 'neo'; store.setPreviewMode('light') })

  it('Matrix und Split: currentSemanticTokens bleibt eine Farbtabelle, Schreiben trifft den gewählten Modus', () => {
    store.setPreviewMode('dark')
    store.setPreviewMode('matrix')
    expect(store.editMode).toBe('dark')
    expect(store.currentSemanticTokens['background-base']).toBeTruthy()
    expect(store.currentThemeKey).toBe('neo-dark')
    const hell = store.state.themes.neo.light['text-primary']
    store.updateSemanticToken('text-primary', '#123456')
    expect(store.state.themes.neo.dark['text-primary']).toBe('#123456')
    expect(store.state.themes.neo.light['text-primary']).toBe(hell)
    expect(store.state.themes.neo.matrix).toBeUndefined()
  })

  it('Vorschau Hell/Dunkel bestimmt den Modus; bei Split/Matrix gilt der Umschalter', () => {
    store.setPreviewMode('dark'); expect(store.editMode).toBe('dark')
    store.state.previewMode = 'light'; expect(store.editMode).toBe('light')   // direkt gesetzt (ältere Aufrufer)
    store.setPreviewMode('dark')
    store.setPreviewMode('split'); expect(store.editMode).toBe('dark')
    store.setBearbeitungsModus('light'); expect(store.editMode).toBe('light')
    expect(store.state.previewMode).toBe('split')
    store.setBearbeitungsModus('matrix'); expect(store.editMode).toBe('light')
    store.setPreviewMode('light'); store.setBearbeitungsModus('dark')   // Einzelansicht: Vorschau zieht mit
    expect(store.state.previewMode).toBe('dark'); expect(store.editMode).toBe('dark')
  })

  it('ausdrücklicher Modus beim Schreiben', () => {
    store.updateSemanticToken('text-primary', '#0a0a0a', 'dark')
    expect(store.state.themes.neo.dark['text-primary']).toBe('#0a0a0a')
  })
})

describe('Farb-Inspector: Token offen in der 4-Theme-Matrix', () => {
  let store, w
  beforeEach(() => {
    localStorage.clear(); store = useThemeStore(); store.state.activeThemeSet = 'neo'
    store.setPreviewMode('light'); store.state.colorActiveTab = 'semantic'; store.state.semanticCategory = 'text'
  })
  afterEach(() => { w?.unmount() })

  it('stürzt nicht ab und zeigt, welcher Wert bearbeitet wird (UX-08, UX-13)', async () => {
    w = mount(FoundationColors, { attachTo: document.body })
    await w.find('.semantic-token-header').trigger('click')
    store.setPreviewMode('matrix')
    await w.vm.$nextTick()
    const wahl = w.find('[data-test="modus-wahl"]')
    expect(wahl.exists()).toBe(true)
    expect(w.find('[data-test="modus-light"]').attributes('aria-pressed')).toBe('true')
    expect(w.text()).toContain('Du bearbeitest den Wert für Hell')
    expect(w.find('[data-test="token-modus"]').text()).toBe('Hell')
    await w.find('[data-test="modus-dark"]').trigger('click')
    expect(store.editMode).toBe('dark')
    expect(store.state.previewMode).toBe('matrix')
    expect(w.find('[data-test="modus-dark"]').attributes('aria-pressed')).toBe('true')
    expect(w.find('[data-test="token-modus"]').text()).toBe('Dunkel')
    // beide Werte sichtbar
    expect(w.find('[data-test="modus-light"] code').text()).toBe(store.state.themes.neo.light['text-primary'])
    expect(w.find('[data-test="modus-dark"] code').text()).toBe(store.state.themes.neo.dark['text-primary'])
  })
})
