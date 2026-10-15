// UX-10 (15.10.2026): Arena-Filter (Chips, Dropdowns) änderten die Vorschau nicht.
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { useThemeStore } from '../../src/stores/theme.js'
import RecipeArena from '../../src/components/laboratory/RecipeArena.vue'
import { extractFiltersFromRecipe, filterAchse } from '../../src/composables/useArenaFilters.js'
import { rohesRecipe } from './_recipes.js'

async function mountArena (id) {
  const w = mount(RecipeArena, { props: { componentId: id } })
  const bis = Date.now() + 8000
  while (!w.find('.ra-specimen').exists() && Date.now() < bis) { await flushPromises(); await new Promise((r) => setTimeout(r, 10)) }
  return w
}

describe('Arena-Filter wirken auf die RecipeArena', () => {
  let store, w
  beforeEach(() => { localStorage.clear(); store = useThemeStore(); store.resetArenaFilters(); store.setPreviewMode('light') })
  afterEach(() => { w?.unmount(); store.resetArenaFilters() })

  it('filterAchse ordnet Kategorien den Recipe-Achsen zu', () => {
    const r = rohesRecipe('button')
    expect(filterAchse(r, 'variants')).toBe(['variant', 'tone', 'severity', 'color'].find(k => r.axes?.[k]))
    expect(filterAchse(r, 'sizes')).toBe('size')
    expect(filterAchse(r, 'states')).toBeNull()
  })

  it('Button: eine Variante gewählt → nur ihre Zellen, Stand und Zurücksetzen', async () => {
    const r = rohesRecipe('button')
    const optionen = extractFiltersFromRecipe(r)
    expect(optionen.variants.length).toBeGreaterThan(1)
    w = await mountArena('button')
    const vorher = w.findAll('.ra-cell').length
    const gewaehlt = optionen.variants[0].id
    store.setArenaFilter('variants', new Map([[gewaehlt, true]]))
    await flushPromises()
    const nachher = w.findAll('.ra-cell').length
    expect(nachher).toBeGreaterThan(0)
    expect(nachher).toBeLessThan(vorher)
    expect(w.find('[data-test="filter-stand"]').text()).toContain(`${nachher} von ${vorher} Vorschauen`)
    await w.find('[data-test="filter-zuruecksetzen"]').trigger('click')
    expect(w.findAll('.ra-cell').length).toBe(vorher)
    expect(w.find('[data-test="filter-stand"]').exists()).toBe(false)
  })

  it('Zustände abgewählt → Zellen mit diesem Zustand verschwinden', async () => {
    const optionen = extractFiltersFromRecipe(rohesRecipe('button'))
    expect(optionen.states.length).toBeGreaterThan(0)
    w = await mountArena('button')
    const vorher = w.findAll('.ra-cell').length
    store.setArenaFilter('states', new Map(optionen.states.map(s => [s.id, false])))
    await flushPromises()
    expect(w.findAll('.ra-cell').length).toBeLessThan(vorher)
  })

  it('nichts gewählt → Leerzustand mit Hinweis', async () => {
    w = await mountArena('button')
    store.setArenaFilter('variants', new Map())
    await flushPromises()
    expect(w.findAll('.ra-cell').length).toBe(0)
    expect(w.find('[data-test="filter-stand"]').text()).toContain('Keine Vorschau passt')
  })
})
