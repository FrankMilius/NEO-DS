/**
 * RecipeArena „Ausprobieren" (Plan v3, Phase 2): je Specimen eine lebendige
 * Instanz mit dem Verhalten aus neo-behaviors; „Zustände" bleibt die feste
 * Matrix ohne Verhalten.
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import RecipeArena from '../../src/components/laboratory/RecipeArena.vue'

async function arena (id) {
  const w = mount(RecipeArena, { props: { componentId: id }, attachTo: document.body })
  for (const bis = Date.now() + 8000; !w.find('.ra-specimen').exists() && Date.now() < bis;) {
    await flushPromises()
    await new Promise((r) => setTimeout(r, 10))
  }
  return w
}

describe('RecipeArena: Zustände | Ausprobieren', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('Umschalter nur bei Bauteilen mit Verhalten', async () => {
    expect((await arena('badge')).find('.ra-modus').exists()).toBe(false)
    expect((await arena('tabs')).find('.ra-modus').exists()).toBe(true)
  })

  it('Ausprobieren: eine Instanz je Specimen, Tabs wechseln per Klick', async () => {
    const w = await arena('tabs')
    const zellenVorher = w.findAll('.ra-cell').length
    // Zustaende: kein Verhalten gebunden
    expect(w.find('[data-neo-behavior]').exists()).toBe(false)
    await w.findAll('.ra-modus__knopf')[1].trigger('click')
    await flushPromises()
    await new Promise((r) => setTimeout(r, 0))
    const specimens = w.findAll('.ra-specimen')
    expect(w.findAll('.ra-cell').length).toBe(specimens.length)
    expect(w.findAll('.ra-cell').length).toBeLessThan(zellenVorher)
    const tabs = w.find('.ra-cell').findAll('.nc-tabs__trigger')
    await tabs[2].trigger('click')
    expect(tabs[2].attributes('aria-selected')).toBe('true')
    expect(tabs[0].attributes('aria-selected')).toBe('false')
    // zurueck: Verhalten geloest
    await w.findAll('.ra-modus__knopf')[0].trigger('click')
    await flushPromises()
    await new Promise((r) => setTimeout(r, 0))
    expect(w.find('[data-neo-behavior]').exists()).toBe(false)
    w.unmount()
  })
})
