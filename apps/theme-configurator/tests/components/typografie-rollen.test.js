// Typografie: Schrift je Rolle aus einer Liste (Befund Frank 15.10.2026)
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import TypographyEditor from '../../src/components/foundation/TypographyEditor.vue'
import { useThemeStore } from '../../src/stores/theme.js'
import { foundationTokens } from '../../src/data/tokens.js'

const typo = foundationTokens.typography.tokens
let store, w

beforeEach(() => {
  localStorage.clear()
  store = useThemeStore()
  store.state.activeThemeSet = 'neo'
  store.state.currentThemeMeta = { id: 't1', name: 'Kunde' }
  // ohne Adresse: kein Netzwerkzugriff auf Google Fonts im Test
  store.state.customFonts.neo = [{ id: 'arimo', name: 'Arimo', family: 'Arimo, Helvetica Neue, Arial', url: '' }]
  store.updateFoundationToken('typography', 'font-body', typo['font-body'].value)
})
afterEach(() => { w?.unmount(); store.state.currentThemeMeta = null; store.state.customFonts.neo = [] })

describe('Typografie-Rollen', () => {
  it('zeigt je Rolle Wirkung, richtige CSS-Variable und eine Auswahl mit NEO, System und Google', () => {
    w = mount(TypographyEditor)
    const body = w.find('[data-test="schrift-rolle-body"]')
    expect(body.text()).toContain('Fließtext')
    expect(body.text()).toContain('--font-body')
    expect(body.text()).not.toContain('--fnd-font-body')
    const gruppen = body.findAll('optgroup').map(g => g.attributes('label'))
    expect(gruppen).toEqual(['NEO Design System', 'Systemschriften', 'Google-Schriften (dieses Theme)'])
    expect(body.find('select').element.value).toBe('Manrope')
  })

  it('Auswahl setzt den Stack mit den Ersatzschriften der Rolle; NEO-Schrift = Standard (keine Abweichung)', async () => {
    w = mount(TypographyEditor)
    const sel = w.find('#schrift-wahl-body')
    await sel.setValue('Arimo')
    expect(store.currentFoundation.typography['font-body']).toBe('Arimo, Helvetica Neue, Arial, sans-serif')
    await sel.setValue('Times New Roman')
    expect(store.currentFoundation.typography['font-body']).toBe("'Times New Roman', Helvetica Neue, Arial, sans-serif")
    await sel.setValue('Manrope')
    expect(store.currentFoundation.typography['font-body']).toBe(typo['font-body'].value)
  })

  it('„Als Body“ an der Google-Schrift und unbekannte Angabe = „Eigene Angabe“', async () => {
    w = mount(TypographyEditor)
    await w.find('[data-test="google-schrift-rolle-body"]').trigger('click')
    expect(store.currentFoundation.typography['font-body']).toMatch(/^Arimo, /)
    store.updateFoundationToken('typography', 'font-heading', 'Comic Sans MS, cursive')
    await w.vm.$nextTick()
    expect(w.find('#schrift-wahl-heading').element.value).toBe('__eigene__')
  })

  it('auf der Bühne nur Anzeige (keine Auswahl, keine Google-Verwaltung)', () => {
    w = mount(TypographyEditor, { props: { buehne: true } })
    expect(w.find('select').exists()).toBe(false)
    expect(w.text()).not.toContain('Google-Schrift hinzufügen')
    expect(w.find('[data-test="schrift-rolle-body"]').text()).toContain('Manrope')
  })
})
