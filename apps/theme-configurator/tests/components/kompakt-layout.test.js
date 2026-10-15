// UX-04 (15.10.2026): Bei 1024 px und 200 % Zoom waren Kopfleiste und Bühne
// abgeschnitten. Unter 1200 px: Bühne und Inspector als Tabs, Sidebar als
// Überlagerung.
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { useThemeStore } from '../../src/stores/theme.js'
import App from '../../src/App.vue'

function stelleBreite (kompakt) {
  // kein Netzwerk: die App fragt beim Start Styleguide und Updates ab
  vi.stubGlobal('fetch', () => Promise.resolve(new Response('{}', { status: 404 })))
  vi.stubGlobal('matchMedia', (q) => ({ matches: kompakt && q.includes('max-width: 1199px'), media: q, addEventListener () {}, removeEventListener () {} }))
}
const stubs = {
  AppHeader: { props: ['sidebarCollapsed'], emits: ['toggle-sidebar'], template: '<header class="app-header"><button class="umschalten" @click="$emit(\'toggle-sidebar\')">Leiste</button></header>' },
  LaboratoryPanel: { template: '<div class="laboratory-panel">Bühne</div>' },
  InspectorPanel: { template: '<div class="inspector-panel">Inspector</div>' },
  UpdateDialog: true, KonfigBestaetigung: true, DrupalRechteHinweis: true
}

describe('Layout unter 1200 px', () => {
  let w
  beforeEach(() => { localStorage.clear(); useThemeStore() })
  afterEach(() => { w?.unmount(); vi.unstubAllGlobals() })

  it('kompakt: Tabs Bühne | Inspector, Leiste zu, Wechsel zeigt jeweils ein Panel', async () => {
    stelleBreite(true)
    w = mount(App, { global: { stubs }, attachTo: document.body })
    const shell = w.find('.app-shell')
    expect(shell.classes()).toContain('app-shell--kompakt')
    expect(shell.attributes('data-ansicht')).toBe('buehne')
    expect(shell.classes()).toContain('sidebar-collapsed')
    const tabs = w.findAll('[role="tab"]')
    expect(tabs.map(t => t.text())).toEqual(['Bühne', 'Inspector'])
    expect(tabs[0].attributes('aria-selected')).toBe('true')
    await w.find('[data-test="kompakt-tab-inspector"]').trigger('click')
    expect(shell.attributes('data-ansicht')).toBe('inspector')
    expect(w.find('[data-test="kompakt-tab-inspector"]').attributes('aria-selected')).toBe('true')
  })

  it('kompakt: Leiste öffnet als Überlagerung und schließt per Schleier, Escape und Auswahl', async () => {
    stelleBreite(true)
    w = mount(App, { global: { stubs }, attachTo: document.body })
    const store = useThemeStore()
    const shell = w.find('.app-shell')
    await w.find('.umschalten').trigger('click')
    expect(shell.classes()).toContain('app-shell--overlay-offen')
    expect(shell.classes()).not.toContain('sidebar-collapsed')
    await w.find('.kompakt-schleier').trigger('click')
    expect(shell.classes()).not.toContain('app-shell--overlay-offen')
    await w.find('.umschalten').trigger('click')
    await shell.trigger('keydown', { key: 'Escape' })
    expect(shell.classes()).not.toContain('app-shell--overlay-offen')
    await w.find('.umschalten').trigger('click')
    store.setActiveSection('component-button')
    await w.vm.$nextTick()
    expect(shell.classes()).not.toContain('app-shell--overlay-offen')
    // die gespeicherte Einstellung der breiten Ansicht bleibt unberührt
    expect(localStorage.getItem('neo-cfg-sidebar-collapsed')).toBeNull()
  })

  it('breit: keine Tabs, Leiste wie gespeichert', () => {
    stelleBreite(false)
    w = mount(App, { global: { stubs }, attachTo: document.body })
    expect(w.find('.app-shell').classes()).not.toContain('app-shell--kompakt')
    expect(w.find('[role="tablist"]').exists()).toBe(false)
  })
})
