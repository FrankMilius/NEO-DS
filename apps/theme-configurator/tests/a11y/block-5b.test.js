// Paket 5, Block 5b (16.10.2026): UX-17 Fokus, UX-30/51 ARIA, UX-46 Sprunglinks
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick, ref, defineComponent, h } from 'vue'
import { useThemeStore } from '../../src/stores/theme.js'
import { useFokusFalle } from '../../src/composables/useFokusFalle.js'
import App from '../../src/App.vue'
import InspectorThemeHeader from '../../src/components/components/InspectorThemeHeader.vue'
import ColorEditor from '../../src/components/editors/ColorEditor.vue'
import FoundationColors from '../../src/components/foundation/FoundationColors.vue'
import RadiiEditor from '../../src/components/foundation/RadiiEditor.vue'

let w
beforeEach(() => { localStorage.clear(); const s = useThemeStore(); s.state.activeThemeSet = 'neo'; s.setPreviewMode('light'); s.state.currentThemeMeta = { id: 't', name: 'T' } })
afterEach(() => { w?.unmount(); w = null; document.body.innerHTML = ''; vi.unstubAllGlobals() })

describe('UX-46: Sprunglinks', () => {
  it('führen zu Navigation, Bühne und Inspector', async () => {
    vi.stubGlobal('fetch', () => Promise.resolve(new Response('{}', { status: 404 })))
    vi.stubGlobal('matchMedia', (q) => ({ matches: false, media: q, addEventListener () {}, removeEventListener () {} }))
    w = mount(App, { attachTo: document.body, global: { stubs: {
      AppHeader: { template: '<header class="app-header">Kopf</header>' },
      LaboratoryPanel: { template: '<div id="cfg-buehne" tabindex="0" class="laboratory-panel">Bühne</div>' },
      InspectorPanel: { template: '<div id="cfg-inspector" tabindex="-1" class="inspector-panel">Inspector</div>' },
      UpdateDialog: true, KonfigBestaetigung: true, DrupalRechteHinweis: true } } })
    const links = w.findAll('.sprunglinks__link')
    expect(links.map(l => l.text())).toEqual(['Zur Navigation', 'Zur Bühne', 'Zu den Einstellungen'])
    await w.find('[data-test="sprung-inspector"]').trigger('click'); await nextTick()
    expect(document.activeElement.id).toBe('cfg-inspector')
    await w.find('[data-test="sprung-buehne"]').trigger('click'); await nextTick()
    expect(document.activeElement.id).toBe('cfg-buehne')
    await w.find('[data-test="sprung-navigation"]').trigger('click'); await nextTick()
    expect(document.activeElement.getAttribute('data-test')).toBe('sidebar-suche')
  })
})

describe('UX-51/UX-30: Zustände für Screenreader', () => {
  it('Vorschaumodus als Radiogruppe mit aria-checked', async () => {
    w = mount(InspectorThemeHeader)
    const radios = w.findAll('[role="radio"]')
    expect(radios.length).toBe(3)
    expect(radios[0].attributes('aria-checked')).toBe('true')
    await radios[1].trigger('click')
    expect(w.findAll('[role="radio"]')[1].attributes('aria-checked')).toBe('true')
    expect(w.find('[role="radiogroup"]').attributes('aria-label')).toBe('Vorschaumodus')
  })

  it('Swatches im Farbwähler sind benannt und zeigen die Auswahl', () => {
    w = mount(ColorEditor, { props: { modelValue: '#37e93d', tokenPalettes: [{ id: 'accent', label: 'Neo Lime', shades: [{ token: '--fnd-primitive-accent-500', step: 500, color: '#37e93d' }, { token: '--fnd-primitive-accent-600', step: 600, color: '#2bd033' }] }] } })
    const s = w.findAll('.picker-swatch')
    expect(s[0].attributes('aria-label')).toBe('Neo Lime 500, #37e93d')
    expect(s[0].attributes('aria-pressed')).toBe('true')
    expect(s[1].attributes('aria-pressed')).toBe('false')
  })

  it('Farb-Token zeigt aria-expanded; Stufen der Paletten sind fokussierbar und benannt', async () => {
    const store = useThemeStore()
    store.state.colorActiveTab = 'semantic'; store.state.semanticCategory = 'text'
    w = mount(FoundationColors, { attachTo: document.body })
    const kopf = w.find('.semantic-token-header')
    expect(kopf.attributes('aria-expanded')).toBe('false')
    await kopf.trigger('click')
    expect(w.find('.semantic-token-header').attributes('aria-expanded')).toBe('true')
    w.unmount()
    store.state.colorActiveTab = 'primitives'; store.state.semanticCategory = null
    w = mount(FoundationColors)
    const chip = w.find('.shade-chip')
    expect(chip.attributes('tabindex')).toBe('0')
    expect(chip.attributes('aria-label')).toMatch(/^Stufe \d+: #/)
  })
})

describe('UX-17: Fokus geht nicht verloren', () => {
  it('Kategorie öffnen fokussiert den Titel, zurück fokussiert die Karte', async () => {
    const store = useThemeStore()
    store.state.colorActiveTab = 'semantic'; store.state.semanticCategory = null
    w = mount(FoundationColors, { attachTo: document.body })
    const karte = w.find('.semantic-category-card[data-kategorie="text"]')
    karte.element.focus()
    await karte.trigger('click'); await nextTick(); await nextTick()
    expect(document.activeElement.classList.contains('semantic-category-title')).toBe(true)
    await w.find('.semantic-back-btn').trigger('click'); await nextTick(); await nextTick()
    expect(document.activeElement.getAttribute('data-kategorie')).toBe('text')
  })

  it('Hinzufügen-Formular fokussiert sein erstes Feld', async () => {
    w = mount(RadiiEditor, { attachTo: document.body })
    await w.find('.hf-oeffnen').trigger('click'); await nextTick(); await nextTick()
    expect(document.activeElement.tagName).toBe('INPUT')
  })

  it('Dialog ohne Auslöser gibt den Fokus an das zuletzt fokussierte Element zurück', async () => {
    const offen = ref(false)
    const Dialog = defineComponent({ setup () { const c = ref(null); useFokusFalle(c, offen); return () => h('div', { ref: c }, offen.value ? [h('button', 'OK')] : []) } })
    w = mount(Dialog, { attachTo: document.body })
    const feld = document.createElement('input'); document.body.appendChild(feld)
    feld.focus(); feld.blur()
    expect(document.activeElement).toBe(document.body)
    offen.value = true; await nextTick(); await nextTick()
    offen.value = false; await nextTick(); await nextTick()
    expect(document.activeElement).toBe(feld)
  })
})
