// UX-09 (15.10.2026): Die 4-Theme-Matrix der Komponenten zeigte in allen
// vier Feldern dieselbe helle Darstellung des aktiven Sets.
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { useThemeStore } from '../../src/stores/theme.js'
import KomponentenBuehne from '../../src/components/laboratory/komponenten/KomponentenBuehne.vue'

async function warteAuf (w, sel, anzahl) {
  const bis = Date.now() + 8000
  while (w.findAll(sel).length < anzahl && Date.now() < bis) {
    await flushPromises(); await new Promise((r) => setTimeout(r, 10))
  }
}

describe('4-Theme-Matrix der Komponenten', () => {
  let store, w
  beforeEach(() => {
    localStorage.clear(); store = useThemeStore(); store.state.activeThemeSet = 'neo'
    store.setActiveSection('component-card'); store.setPreviewMode('matrix')
  })
  afterEach(() => { w?.unmount(); store.setPreviewMode('light') })

  it('jeder Quadrant rendert mit Set und Modus seines Themes', async () => {
    store.state.themes.customer.dark['background-base'] = '#101820'
    w = mount(KomponentenBuehne)
    await warteAuf(w, '.theme-matrix__quadrant .ra-preview', 4)
    const quadranten = w.findAll('.theme-matrix__quadrant')
    expect(quadranten).toHaveLength(4)
    const erwartet = [['neo', 'light'], ['neo', 'dark'], ['customer', 'light'], ['customer', 'dark']]
    quadranten.forEach((q, i) => {
      const [set, modus] = erwartet[i]
      const vorschau = q.find('.ra-preview')
      expect(vorschau.classes()).toContain(`${set}-${modus}-theme`)
      const stil = q.find('.ra-live-component').attributes('style')
      expect(stil, `${set}-${modus}`).toContain(`--fnd-color-background-base: ${store.state.themes[set][modus]['background-base']}`)
    })
    // nicht mehr viermal dasselbe
    const stile = quadranten.map(q => q.find('.ra-live-component').attributes('style'))
    expect(new Set(stile).size).toBe(4)
  })

  it('außerhalb der Matrix bleibt die Arena beim aktiven Set und Modus', async () => {
    store.setPreviewMode('dark')
    w = mount(KomponentenBuehne)
    await warteAuf(w, '.ra-preview', 1)
    expect(w.find('.ra-preview').classes()).toContain('neo-dark-theme')
  })
})
