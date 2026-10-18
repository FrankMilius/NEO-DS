// Paket 5, Block 5c (18.10.2026): UX-21, UX-29, UX-32, UX-33, UX-48, UX-57
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { useThemeStore } from '../../src/stores/theme.js'
import { normalisiereHex } from '../../src/utils/token-pruefung.js'
import { abstandZeilen } from '../../src/export/foundation-css.js'
import { pruefeCss } from '../../src/utils/css-wert.js'
import ColorEditor from '../../src/components/editors/ColorEditor.vue'
import FoundationColors from '../../src/components/foundation/FoundationColors.vue'
import SidebarNav from '../../src/components/layout/SidebarNav.vue'
import InspectorPanel from '../../src/components/layout/InspectorPanel.vue'
import SpacingInspector from '../../src/components/foundation/SpacingInspector.vue'

let store, w
beforeEach(() => { localStorage.clear(); store = useThemeStore(); store.resetToDefaults(); store.state.activeThemeSet = 'neo'; store.setPreviewMode('light'); store.state.currentThemeMeta = { id: 't', name: 'T' } })
afterEach(() => { w?.unmount(); w = null; document.body.innerHTML = '' })

describe('UX-21: HEX-Eingaben', () => {
  it('normalisiert Kurzformen und lehnt Unsinn ab', () => {
    expect(normalisiereHex('f00')).toBe('#ff0000')
    expect(normalisiereHex('#ABC')).toBe('#aabbcc')
    expect(normalisiereHex(' 1f6f3a ')).toBe('#1f6f3a')
    expect(normalisiereHex('xyz')).toBeNull()
    expect(normalisiereHex('#2266dd#37e93d')).toBeNull()
  })
  it('Primitive: „f00“ wird #ff0000; Unsinn wird gemeldet und zurückgesetzt', () => {
    const feld = document.createElement('input'); document.body.appendChild(feld)
    expect(store.updatePrimitive('accent', 'f00', feld)).toBe(true)
    expect(store.currentPrimitives.accent).toBe('#ff0000')
    feld.value = 'xyz'
    expect(store.updatePrimitive('accent', 'xyz', feld)).toBe(false)
    expect(store.currentPrimitives.accent).toBe('#ff0000')
    expect(feld.getAttribute('aria-invalid')).toBe('true')
    expect(feld.value).toBe('#ff0000')
  })
  it('Farbwähler: beim Verlassen normalisieren bzw. Fehler am Feld', async () => {
    w = mount(ColorEditor, { props: { modelValue: '#000000', tokenPalettes: [] }, attachTo: document.body })
    const feld = w.find('input[aria-label="HEX-Wert"]')
    await feld.setValue('0f0'); await feld.trigger('blur')
    expect(w.emitted('update:modelValue').at(-1)).toEqual(['#00ff00'])
    await feld.setValue('kaputt'); await feld.trigger('blur')
    expect(feld.attributes('aria-invalid')).toBe('true')
    expect(feld.element.value).toBe('#000000')
  })
})

describe('UX-29: Sidebar markiert geänderte Foundation-Bereiche', () => {
  it('Radius und Farben werden markiert, sobald sie abweichen', async () => {
    localStorage.setItem('neo-cfg-sidebar', JSON.stringify({ expandedGroups: ['foundation'] }))
    w = mount(SidebarNav)
    const punkt = (label) => w.findAll('.nav-item').find(b => b.find('.nav-item-label').text() === label)?.find('.nav-item-dot')
    expect(punkt('Radii').classes()).not.toContain('modified')
    store.updateFoundationToken('radius', 'md', '9px'); await nextTick()
    expect(punkt('Radii').classes()).toContain('modified')
    expect(punkt('Color').classes()).not.toContain('modified')
    store.updatePrimitive('accent', '#e06060'); await nextTick()
    expect(punkt('Color').classes()).toContain('modified')
  })
})

describe('UX-32/UX-33: Farbkategorien', () => {
  it('frisches Theme ohne Warnsymbol; „Erhebung“ nicht unter den Farben', () => {
    store.state.colorActiveTab = 'semantic'; store.state.semanticCategory = null
    w = mount(FoundationColors)
    expect(w.findAll('[data-test="kategorie-frei"]')).toHaveLength(0)
    expect(w.find('.semantic-category-card[data-kategorie="elevation"]').exists()).toBe(false)
    expect(w.find('[data-test="erhebung-hinweis"] a').attributes('href')).toBe('#/foundation/shadows')
  })
  it('freier Wert: Warnsymbol an der Kategorie, Hinweis und „An … binden“ am Token', async () => {
    store.updateSemanticToken('text-primary', '#123457')
    store.state.colorActiveTab = 'semantic'; store.state.semanticCategory = null
    w = mount(FoundationColors)
    expect(w.find('.semantic-category-card[data-kategorie="text"] [data-test="kategorie-frei"]').exists()).toBe(true)
    w.unmount()
    store.state.semanticCategory = 'text'
    w = mount(FoundationColors)
    const kopf = w.findAll('.semantic-token-header').find(k => k.text().includes('#123457'))
    await kopf.trigger('click')
    expect(w.find('[data-test="frei-hinweis"]').exists()).toBe(true)
    await w.find('[data-test="wieder-binden"]').trigger('click')
    expect(store.state.themes.neo.light['text-primary']).not.toBe('#123457')
  })
})

describe('UX-48: Tab-Wechsel merkt die Semantic-Ansicht', () => {
  it('Kategorie und Token bleiben nach Primitive → Semantic erhalten', async () => {
    store.setActiveSection('foundation-colors')
    store.state.colorActiveTab = 'semantic'; store.state.semanticCategory = 'text'; store.selectToken({ id: 'text-link', label: 'Link' })
    w = mount(InspectorPanel)
    await w.findAll('[role="tab"]')[0].trigger('click')
    expect(store.state.semanticCategory).toBeNull()
    await w.findAll('[role="tab"]')[1].trigger('click')
    expect(store.state.semanticCategory).toBe('text')
    expect(store.state.selectedToken.id).toBe('text-link')
  })
})

describe('UX-57: Abstände im CSS', () => {
  it('eigene Stufen und semantische Abstände werden ausgegeben, gültiges CSS', () => {
    store.addCustomSpacingToken('px36', '36px')
    store.updateSemanticSpacing('component', 'var(--fnd-spacing-px36)')
    const css = store.exportAsCSSVars({ nurAbweichungen: true })
    expect(css).toContain('--fnd-spacing-px36: 36px;')
    expect(css).toContain('--fnd-spacing-component: var(--fnd-spacing-px36);')
    expect(pruefeCss(css)).toEqual([])
    expect(abstandZeilen({ 'x;}': { value: '1px' } }, { a: 'red; } body {' })).toEqual([])
  })
  it('Inspector: fluide Stufen zeigen min–max, fehlende Verweise sind markiert', () => {
    store.updateSemanticSpacing('mein-abstand', 'var(--fnd-spacing-16)')
    store.state.spacingActiveTab = 'primitives'
    w = mount(SpacingInspector)
    expect(w.find('[data-test="spacing-fluid"]').text()).toMatch(/^fluid \d+–\d+ px$/)
    w.unmount()
    store.state.spacingActiveTab = 'semantic'
    w = mount(SpacingInspector)
    expect(w.text()).toContain('var(--fnd-spacing-16) (fehlt)')
  })
})
