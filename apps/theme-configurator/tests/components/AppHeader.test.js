/**
 * Snapshot-Tests für AppHeader
 * Prüft dass die Komponente rendert und grundlegende Interaktion funktioniert.
 */
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import AppHeader from '../../src/components/layout/AppHeader.vue'

// Mock des Theme-Stores
vi.mock('../../src/stores/theme.js', () => ({
  useThemeStore: () => ({
    state: {
      version: '1.0.0',
      currentThemeMeta: null,
      savedThemes: [],
      historyIndex: 0,
      history: [{}]
    },
    undo: vi.fn(),
    redo: vi.fn(),
    loadNeoDefaults: vi.fn(),
    loadTheme: vi.fn(),
    createTheme: vi.fn(),
    deleteTheme: vi.fn(),
    downloadThemeCSS: vi.fn(),
    downloadThemeJSON: vi.fn()
  })
}))

describe('AppHeader', () => {
  it('rendert ohne Fehler', () => {
    const wrapper = mount(AppHeader, {
      global: {
        stubs: { Transition: false, Teleport: true }
      }
    })
    expect(wrapper.exists()).toBe(true)
  })

  it('zeigt den App-Titel', () => {
    const wrapper = mount(AppHeader, {
      global: {
        stubs: { Transition: false, Teleport: true }
      }
    })
    expect(wrapper.find('.app-title').text()).toBe('Theme Configurator')
  })

  it('zeigt die Version', () => {
    const wrapper = mount(AppHeader, {
      global: {
        stubs: { Transition: false, Teleport: true }
      }
    })
    expect(wrapper.find('.version-tag').text()).toContain('1.0.0')
  })

  it('zeigt Neo Theme als Standard-Label', () => {
    const wrapper = mount(AppHeader, {
      global: {
        stubs: { Transition: false, Teleport: true }
      }
    })
    expect(wrapper.find('.tb-dropdown-label').text()).toBe('Neo Theme')
  })

  it('deaktiviert Delete-Button für Standard-Theme', () => {
    const wrapper = mount(AppHeader, {
      global: {
        stubs: { Transition: false, Teleport: true }
      }
    })
    const deleteBtn = wrapper.find('.tb-btn-danger')
    expect(deleteBtn.attributes('disabled')).toBeDefined()
  })

  it('zeigt Create Dialog bei Klick auf New', async () => {
    const wrapper = mount(AppHeader, {
      global: {
        stubs: { Transition: false, Teleport: true }
      }
    })
    const newBtn = wrapper.findAll('.tb-btn').find(b => b.text().includes('New'))
    await newBtn.trigger('click')
    expect(wrapper.find('.modal-title').text()).toBe('Create New Theme')
  })
})
