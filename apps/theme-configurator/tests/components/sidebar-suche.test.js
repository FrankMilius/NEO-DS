// UX-12 (15.10.2026): „Search tokens…“ fand keine Tokens und keine deutschen
// Begriffe, meldete null Treffer nicht, Escape leerte das Feld nicht.
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { useThemeStore } from '../../src/stores/theme.js'
import SidebarNav from '../../src/components/layout/SidebarNav.vue'
import { suchTreffer } from '../../src/navigation/sidebar-suche.js'

describe('suchTreffer', () => {
  it('Name, Token, deutscher Begriff', () => {
    expect(suchTreffer({ id: 'button', label: 'Button' }, 'butt')).toEqual({ grund: null })
    expect(suchTreffer({ id: 'button', label: 'Button' }, 'knopf')?.grund).toBe('Begriff „knopf“')
    expect(suchTreffer({ id: 'colors', label: 'Color' }, 'Farbe')?.grund).toBe('Begriff „farbe“')
    expect(suchTreffer({ id: 'colors', label: 'Color' }, 'text-primary')?.grund).toBe('Token --fnd-color-text-primary')
    expect(suchTreffer({ id: 'radius', label: 'Radii' }, 'radius')).toEqual({ grund: null })
    expect(suchTreffer({ id: 'button', label: 'Button' }, 'radius')?.grund).toMatch(/^Token --nc-button-.*radius/)
    expect(suchTreffer({ id: 'button', label: 'Button' }, 'xyzzy')).toBeNull()
  })
})

describe('Sidebar-Suche', () => {
  let w
  beforeEach(() => { localStorage.clear(); useThemeStore() })
  afterEach(() => w?.unmount())

  it('„primary“ findet Bereiche über ihre Tokens, Gruppen sind aufgeklappt, Ansage nennt die Zahl', async () => {
    w = mount(SidebarNav)
    await w.find('[data-test="sidebar-suche"]').setValue('primary')
    const labels = w.findAll('.nav-item-label').map(l => l.text())
    expect(labels.some(t => t.startsWith('Farben'))).toBe(true)
    expect(labels.some(t => t.startsWith('Button') && t.includes('Token --nc-button'))).toBe(true)
    for (const kopf of w.findAll('.nav-group-header')) expect(kopf.attributes('aria-expanded')).toBe('true')
    expect(w.find('#cfg-suche-stand').text()).toMatch(/^\d+ Treffer$/)
  })

  it('„Farbe“ und das frühere „Color“ finden Farben (Block 5e)', async () => {
    w = mount(SidebarNav)
    await w.find('[data-test="sidebar-suche"]').setValue('Farbe')
    expect(w.findAll('.nav-item-label').map(l => l.text()).some(t => t.startsWith('Farben'))).toBe(true)
    await w.find('[data-test="sidebar-suche"]').setValue('Color')
    expect(w.findAll('.nav-item-label').map(l => l.text()).some(t => t.startsWith('Farben'))).toBe(true)
  })

  it('ohne Treffer: sichtbarer Hinweis; Escape leert das Feld', async () => {
    w = mount(SidebarNav)
    const feld = w.find('[data-test="sidebar-suche"]')
    await feld.setValue('xyzzy')
    expect(w.find('[data-test="sidebar-suche-leer"]').text()).toContain('Keine Treffer für „xyzzy“')
    expect(w.find('#cfg-suche-stand').text()).toBe('Keine Treffer')
    await feld.trigger('keydown', { key: 'Escape' })
    expect(feld.element.value).toBe('')
    expect(w.find('[data-test="sidebar-suche-leer"]').exists()).toBe(false)
  })
})
