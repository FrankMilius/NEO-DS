// Schriftrollen (20.10.2026): Rolle „Bedienelemente“ unter Typografie und
// Schriftfamilie der Komponenten als Verweis auf eine Rolle
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import TypographyEditor from '../../src/components/foundation/TypographyEditor.vue'
import SchriftRolleWahl from '../../src/components/editors/SchriftRolleWahl.vue'
import { useThemeStore } from '../../src/stores/theme.js'
import { foundationTokens } from '../../src/data/tokens.js'
import { pruefeFoundationWert, pruefeKomponentenWert } from '../../src/utils/token-pruefung.js'

const typo = foundationTokens.typography.tokens
let store, w

beforeEach(() => {
  localStorage.clear()
  store = useThemeStore()
  store.state.activeThemeSet = 'neo'
  store.state.currentThemeMeta = { id: 't1', name: 'Kunde' }
  store.updateFoundationToken('typography', 'font-ui', typo['font-ui'].value)
  store.updateFoundationToken('typography', 'font-heading', typo['font-heading'].value)
})
afterEach(() => { w?.unmount(); store.state.currentThemeMeta = null })

describe('Prüfung', () => {
  it('Bedienelemente nimmt nur Verweise auf Body, Heading oder Mono', () => {
    expect(pruefeFoundationWert('typography', 'font-ui', 'var(--font-heading)')).toBeNull()
    expect(pruefeFoundationWert('typography', 'font-ui', 'var(--font-ui)')).toMatch(/Fließtext/)
    expect(pruefeFoundationWert('typography', 'font-ui', 'Arial')).toMatch(/Fließtext/)
  })
  it('Schriftfamilie einer Komponente: Rolle oder Font-Stack', () => {
    expect(pruefeKomponentenWert('nc-button-font-family', 'var(--font-mono)')).toBeNull()
    expect(pruefeKomponentenWert('nc-button-font-family', 'Inter, sans-serif')).toBeNull()
    expect(pruefeKomponentenWert('nc-button-font-family', 'Inter; color: red')).not.toBeNull()
  })
})

describe('Typografie: Karte Bedienelemente', () => {
  it('steht auf Body und wechselt auf Heading', async () => {
    w = mount(TypographyEditor)
    const karte = w.find('[data-test="schrift-rolle-ui"]')
    expect(karte.text()).toContain('--font-ui')
    const sel = karte.find('select')
    expect(sel.element.value).toBe('var(--font-body)')
    expect(sel.findAll('option').map(o => o.text())).toEqual(['Body – Manrope (NEO-Standard)', 'Heading – Space Grotesk', 'Mono – JetBrains Mono'])
    expect(karte.find('details').exists()).toBe(false)
    await sel.setValue('var(--font-heading)')
    expect(store.currentFoundation.typography['font-ui']).toBe('var(--font-heading)')
  })
})

describe('Rollen-Auswahl einer Komponente', () => {
  it('zeigt die Schrift jeder Rolle, folgt Bedienelemente und meldet die Wahl', async () => {
    store.updateFoundationToken('typography', 'font-ui', 'var(--font-heading)')
    w = mount(SchriftRolleWahl, { props: { label: 'Font Family', modelValue: 'var(--font-ui)', standard: 'var(--font-ui)' } })
    const texte = w.findAll('option').map(o => o.text())
    expect(texte[0]).toBe('Bedienelemente – Space Grotesk (NEO-Standard)')
    expect(texte).toContain('Mono – JetBrains Mono')
    await w.find('select').setValue('var(--font-mono)')
    expect(w.emitted('update:modelValue').at(-1)).toEqual(['var(--font-mono)'])
  })
  it('eigener Wert bleibt sichtbar und lässt sich als Font-Stack eintragen', async () => {
    w = mount(SchriftRolleWahl, { props: { label: 'Font Family', modelValue: '"Inter", sans-serif' } })
    expect(w.find('select').element.value).toBe('__eigene__')
    expect(w.find('details').attributes('open')).toBeDefined()
    const feld = w.find('input')
    await feld.setValue('Inter; x')
    expect(w.find('[role="alert"]').exists()).toBe(true)
    await feld.setValue('Inter, sans-serif')
    expect(w.emitted('update:modelValue').at(-1)).toEqual(['Inter, sans-serif'])
  })
})
