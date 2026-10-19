// C1 (Testlauf 16.10.2026): Erklärung, was eine Markenpalette auf der Website färbt
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { useThemeStore } from '../../src/stores/theme.js'
import FoundationColors from '../../src/components/foundation/FoundationColors.vue'

describe('Wirkung der Markenpaletten', () => {
  let store, w
  beforeEach(() => {
    localStorage.clear(); store = useThemeStore(); store.state.activeThemeSet = 'neo'
    store.state.currentThemeMeta = { id: 't', name: 'Kunde' }; store.state.colorActiveTab = 'primitives'
  })
  afterEach(() => { w?.unmount(); store.state.currentThemeMeta = null })

  it('Akzent (Neo Lime) nennt die Farbrollen, die auf seine Stufen zeigen; Secondary wirkt nicht', () => {
    w = mount(FoundationColors)
    const akzent = w.find('[data-test="paletten-wirkung-accent"]')
    expect(akzent.find('summary').text()).toMatch(/^Färbt auf der Website \d+ Farbrollen$/)
    expect(akzent.findAll('li').length).toBeGreaterThan(0)
    expect(akzent.text()).toContain('--fnd-color-')
    expect(w.find('[data-test="paletten-wirkung-secondary"] summary').text()).toBe('Wirkt auf der Website derzeit nicht')
  })

  it('folgt dem Theme: neue Akzentfarbe zieht mit, die Wirkung bleibt sichtbar', () => {
    w = mount(FoundationColors)
    const vorher = w.findAll('[data-test="paletten-wirkung-accent"] li').length
    store.updatePrimitive('accent', '#e06060')
    return w.vm.$nextTick().then(() => {
      expect(w.findAll('[data-test="paletten-wirkung-accent"] li').length).toBe(vorher)
    })
  })
})
