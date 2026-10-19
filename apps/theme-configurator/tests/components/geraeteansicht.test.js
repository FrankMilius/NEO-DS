// Roadmap V01 (19.10.2026): Breite der Vorschau und Vollbild
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick, h } from 'vue'
import { useThemeStore } from '../../src/stores/theme.js'
import BreitenRahmen from '../../src/components/laboratory/BreitenRahmen.vue'
import LaboratoryPanel from '../../src/components/laboratory/LaboratoryPanel.vue'

let store, w
beforeEach(() => { localStorage.clear(); store = useThemeStore(); store.resetToDefaults() })
afterEach(() => { w?.unmount(); w = null; document.body.innerHTML = '' })

describe('BreitenRahmen', () => {
  it('volle Breite: Inhalt direkt, kein Frame', () => {
    w = mount(BreitenRahmen, { props: { breite: null }, slots: { default: () => h('p', { class: 'inhalt' }, 'Arena') } })
    expect(w.find('.inhalt').exists()).toBe(true)
    expect(w.find('iframe').exists()).toBe(false)
  })
  it('feste Breite: Frame mit Breite, Höhe und Hinweis', () => {
    w = mount(BreitenRahmen, { props: { breite: 390, hoehe: 844 }, slots: { default: () => h('p', 'Arena') } })
    const f = w.find('iframe.br-rahmen')
    expect(f.attributes('title')).toBe('Vorschau in 390 px Breite')
    expect(f.attributes('style')).toContain('width: 390px')
    expect(f.attributes('style')).toContain('height: 844px')
    expect(f.attributes('srcdoc')).toContain('class="br-geraet"')
    expect(f.attributes('srcdoc')).toContain('<base href=')
    expect(w.find('[data-test="breiten-hinweis"]').text()).toContain('390 × 844 px')
  })
})

describe('Labor: Breitenwahl und Vollbild', () => {
  const stubs = { ArenaFilterbar: true, BreitenRahmen: { props: ['breite', 'hoehe'], template: '<div class="stub-rahmen" :data-breite="breite" :data-hoehe="hoehe"><slot /></div>' } }
  it('nur auf Komponenten-Seiten; Handy setzt 390 × 844', async () => {
    store.setActiveSection('foundation-colors')
    w = mount(LaboratoryPanel, { global: { stubs }, attachTo: document.body })
    expect(w.find('[data-test="breiten-wahl"]').exists()).toBe(false)
    store.setActiveSection('component-button'); await nextTick()
    const wahl = w.find('[data-test="breiten-wahl"]')
    expect(wahl.attributes('role')).toBe('radiogroup')
    expect(w.find('[data-test="breite-voll"]').attributes('aria-checked')).toBe('true')
    await w.find('[data-test="breite-handy"]').trigger('click')
    expect(w.find('[data-test="breite-handy"]').attributes('aria-checked')).toBe('true')
    expect(w.find('.stub-rahmen').attributes('data-breite')).toBe('390')
    expect(w.find('.stub-rahmen').attributes('data-hoehe')).toBe('844')
  })
  it('Vollbild: Knopf mit aria-pressed, Escape beendet', async () => {
    store.setActiveSection('component-button')
    w = mount(LaboratoryPanel, { global: { stubs }, attachTo: document.body })
    const knopf = w.find('[data-test="vollbild"]')
    expect(knopf.attributes('aria-pressed')).toBe('false')
    await knopf.trigger('click')
    expect(w.find('.laboratory-panel').classes()).toContain('laboratory-panel--fullscreen')
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' })); await nextTick()
    expect(w.find('.laboratory-panel').classes()).not.toContain('laboratory-panel--fullscreen')
  })
})
