/**
 * Snapshot-Tests für AppHeader
 * Prüft dass die Komponente rendert und grundlegende Interaktion funktioniert.
 */
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import AppHeader from '../../src/components/layout/AppHeader.vue'
import { APP_VERSION, APP_COMMIT } from '../../src/lib/app-version.js'

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
    canUndo: vi.fn(() => false),
    canRedo: vi.fn(() => false),
    loadNeoDefaults: vi.fn(),
    loadTheme: vi.fn(),
    createTheme: vi.fn(),
    deleteTheme: vi.fn(),
    downloadThemeCSS: vi.fn(),
    downloadThemeJSON: vi.fn(),
    downloadThemeDTCG: vi.fn(),
    exportAsDTCG: vi.fn(async () => ({ text: '{}', hinweise: [], uebernommen: {}, zusammenfassung: '', dateiname: 'x.json' })),
    pruefeImport: vi.fn(() => ({ ok: false, fehler: ['x'], vorschau: [] })),
    importTheme: vi.fn()
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

  it('trennt Theme-Version und App-Version (Plan v2, 4.5)', () => {
    const wrapper = mount(AppHeader, {
      global: {
        stubs: { Transition: false, Teleport: true }
      }
    })
    // Theme-Version: Metadaten des Themes aus dem Store
    expect(wrapper.find('.version-tag').text()).toBe('Theme v1.0.0')
    // App-Version: Build (package.json + Git-Kurz-Hash), Build-Datum im Tooltip
    const app = wrapper.find('.app-version')
    expect(app.text()).toBe(`App ${APP_VERSION} · ${APP_COMMIT}`)
    expect(app.attributes('title')).toContain(`Theme-Konfigurator ${APP_VERSION}`)
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

  it('Export-Menü bietet DTCG und Theme-Import und öffnet die Dialoge', async () => {
    const wrapper = mount(AppHeader, {
      global: {
        stubs: { Transition: false, Teleport: true }
      }
    })
    const exportBtn = wrapper.findAll('.tb-btn').find(b => b.text().includes('Export'))
    await exportBtn.trigger('click')
    expect(wrapper.find('[data-test="export-dtcg"]').text()).toContain('DTCG (W3C Design Tokens)')
    await wrapper.find('[data-test="export-dtcg"]').trigger('click')
    expect(wrapper.text()).toContain('DTCG-Export (W3C Design Tokens)')

    await exportBtn.trigger('click')
    await wrapper.find('[data-test="import-theme"]').trigger('click')
    expect(wrapper.text()).toContain('Theme importieren')
  })
})
