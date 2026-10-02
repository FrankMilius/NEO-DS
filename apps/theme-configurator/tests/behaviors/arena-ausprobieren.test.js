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

  // Formular-Bauteile mit Recipe-Vorlage (Plan v3, Phase 3) und Verhalten
  async function ausprobieren (id) {
    const w = await arena(id)
    expect(w.find('.ra-modus').exists()).toBe(true)
    await w.findAll('.ra-modus__knopf')[1].trigger('click')
    await flushPromises()
    await new Promise((r) => setTimeout(r, 0))
    expect(w.find(`[data-neo-behavior~="${id}"]`).exists()).toBe(true)
    return w
  }
  const zelle = (w, sp) => w.find(`.ra-specimen[data-specimen-id="${sp}"] .ra-cell`)

  it('Segmented Control: Klick waehlt, Indikator folgt', async () => {
    const w = await ausprobieren('segmented-control')
    const segmente = zelle(w, 'sliding-indicator').findAll('.nc-segmented-control__item')
    await segmente[2].trigger('click')
    expect(segmente[2].attributes('aria-checked')).toBe('true')
    expect(segmente[0].attributes('aria-checked')).toBe('false')
    expect(zelle(w, 'sliding-indicator').find('.nc-segmented-control').attributes('style')).toContain('--_indicator-left')
    w.unmount()
  })

  it('Toggle-Group: Pfeiltaste waehlt (einfach)', async () => {
    const w = await ausprobieren('toggle-group')
    const knoepfe = zelle(w, 'all-states').findAll('.nc-toggle-group__item')
    await knoepfe[0].trigger('keydown', { key: 'ArrowRight' })
    expect(knoepfe[1].attributes('aria-checked')).toBe('true')
    w.unmount()
  })

  it('Switch: Klick schaltet um', async () => {
    const w = await ausprobieren('switch')
    const knopf = zelle(w, 'default-states').find('[role="switch"]')
    await knopf.trigger('click')
    expect(knopf.attributes('aria-checked')).toBe('true')
    w.unmount()
  })

  it('Rating: Pfeiltaste setzt den Wert und faerbt ein', async () => {
    const w = await ausprobieren('rating')
    const z = zelle(w, 'interactive-states')
    const sterne = z.findAll('.nc-rating__input:not(.nc-rating__input--clear)')
    await sterne[2].trigger('keydown', { key: 'ArrowRight' })
    expect(sterne[3].element.checked).toBe(true)
    expect(z.findAll('.nc-rating__item--active')).toHaveLength(4)
    w.unmount()
  })

  it('Input: Loeschknopf leert das Feld', async () => {
    const w = await ausprobieren('input')
    const z = zelle(w, 'content-states')
    const feld = z.find('input')
    feld.element.value = 'Hallo'
    await z.find('.nc-input__clear').trigger('click')
    expect(feld.element.value).toBe('')
    w.unmount()
  })
})
