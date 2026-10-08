/**
 * Plan v3, Phase 4: Recipes mit meta.status „draft" tragen im Konfigurator
 * ein sichtbares Kennzeichen „Entwurf" — in der Navigation und im
 * Arena-Kopf. Geprueft wird:
 *   - die Liste src/data/recipe-entwuerfe.js stimmt in beide Richtungen mit
 *     meta.status der Recipes ueberein (keine zweite Quelle, die driftet)
 *   - der Navigationsbaum markiert genau diese Eintraege
 *   - SidebarNav zeigt das Kennzeichen an genau diesen Eintraegen
 *   - der Arena-Kopf (LaboratoryPanel) zeigt es fuer Entwuerfe, nicht fuer
 *     freigegebene Recipes
 *
 * Seit 08.10.2026 (Entscheidung Abschluss 2: scroll-expand und scroll-reveal
 * stillgelegt) gibt es keinen Entwurf mehr — die Liste ist leer. Damit der
 * Mechanismus geprueft bleibt, meldet der Recipe-Loader unten fuer genau ein
 * Recipe kuenstlich meta.status „draft" (nur in diesem Test).
 */
import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent, h, markRaw } from 'vue'
import { ENTWUERFE, istEntwurf } from '../../src/data/recipe-entwuerfe.js'
import { navigationTree } from '../../src/data/navigation-builder.js'
import SidebarNav from '../../src/components/layout/SidebarNav.vue'
import { useThemeStore } from '../../src/stores/theme.js'
import { RECIPE_IDS, rohesRecipe } from '../arena/_recipes.js'

// Kuenstlicher Entwurf fuer den Arena-Kopf (die echte Liste ist leer)
const KUENSTLICH_DRAFT = 'button'
vi.mock('../../src/composables/useRecipeLoader.js', async (original) => {
  const echt = await original()
  const { computed, unref } = await import('vue')
  return {
    ...echt,
    useRecipeLoader: (idRef) => {
      const r = echt.useRecipeLoader(idRef)
      const recipe = computed(() => (unref(idRef) === KUENSTLICH_DRAFT && r.recipe.value
        ? { ...r.recipe.value, meta: { ...r.recipe.value.meta, status: 'draft' } }
        : r.recipe.value))
      return { ...r, recipe }
    }
  }
})

vi.mock('../../src/composables/useArenaResolver.js', async (original) => {
  const echt = await original()
  const { computed } = await import('vue')
  const Platzhalter = markRaw(defineComponent({ name: 'ArenaPlatzhalter', setup: () => () => h('div') }))
  return {
    ...echt,
    useArenaResolver: (idRef) => ({
      resolvedArena: computed(() => ((typeof idRef === 'string' ? idRef : idRef.value) ? Platzhalter : null)),
      hasDedicatedArena: computed(() => false)
    })
  }
})

const LaboratoryPanel = (await import('../../src/components/laboratory/LaboratoryPanel.vue')).default

const ENTWURF_LAUT_RECIPE = RECIPE_IDS.filter((id) => rohesRecipe(id).meta?.status === 'draft').sort()

function navEintraege (baum = navigationTree) {
  return baum.flatMap((k) => (k.children ? navEintraege(k.children) : [k]))
}

const wrappers = []
afterEach(() => { while (wrappers.length) wrappers.pop().unmount() })

describe('Kennzeichen „Entwurf"', () => {
  it('Liste = Recipes mit meta.status draft (beide Richtungen)', () => {
    expect([...ENTWUERFE].sort()).toEqual(ENTWURF_LAUT_RECIPE)
    // leer seit der Stilllegung von scroll-expand/scroll-reveal (08.10.2026)
    expect(ENTWURF_LAUT_RECIPE).toEqual([])
    expect(ENTWUERFE).toEqual([])
    for (const id of RECIPE_IDS) expect(istEntwurf(id), id).toBe(ENTWURF_LAUT_RECIPE.includes(id))
  })

  it('Navigationsbaum: genau die Entwuerfe tragen entwurf', () => {
    const komponenten = navEintraege().filter((e) => e.section?.startsWith('component-'))
    const markiert = komponenten.filter((e) => e.entwurf).map((e) => e.id).sort()
    const imBaum = komponenten.map((e) => e.id)
    expect(markiert).toEqual(ENTWURF_LAUT_RECIPE.filter((id) => imBaum.includes(id)))
    // jeder Entwurf mit Recipe steht in der Navigation
    expect(ENTWURF_LAUT_RECIPE.filter((id) => !imBaum.includes(id))).toEqual([])
  })

  it('SidebarNav: Kennzeichen an genau den Entwuerfen', async () => {
    const w = mount(SidebarNav, { attachTo: document.body })
    wrappers.push(w)
    // alle Gruppen aufklappen
    for (const knopf of w.findAll('.nav-group-header')) {
      if (knopf.attributes('aria-expanded') === 'false') await knopf.trigger('click')
    }
    const kennzeichen = w.findAll('[data-test="entwurf"]')
    expect(kennzeichen.length).toBe(ENTWURF_LAUT_RECIPE.length)
    for (const k of kennzeichen) {
      expect(k.text()).toBe('Entwurf')
      expect(k.attributes('title')).toContain('draft')
    }
    const beschriftungen = kennzeichen.map((k) => k.element.closest('.nav-item').querySelector('.nav-item-label').textContent)
    // freigegeben (Abschluss Plan v3, 08.10.2026)
    expect(beschriftungen).not.toContain('Mobile Drawer')
    expect(beschriftungen).not.toContain('Hero Tom')
    // stillgelegt (Entscheidung Abschluss 2, 08.10.2026): kein Eintrag mehr
    expect(beschriftungen).toEqual([])
    expect(navEintraege().filter((e) => ['scroll-expand', 'scroll-reveal'].includes(e.id))).toEqual([])
  })

  it('Arena-Kopf: Kennzeichen bei Entwurf, nicht bei freigegebenem Recipe', async () => {
    const store = useThemeStore()
    // ein noch offener Entwurf (falls es einen gibt) und freigegebene Recipes
    // KUENSTLICH_DRAFT: Status kommt aus dem geladenen Recipe, nicht aus der Liste
    for (const [id, erwartet] of [...ENTWURF_LAUT_RECIPE.slice(0, 1).map((e) => [e, true]), [KUENSTLICH_DRAFT, true], ['table-info-modal', false], ['mobile-drawer', false], ['fade-gallery', false], ['accordion', false]]) {
      store.setActiveSection(`component-${id}`)
      const w = mount(LaboratoryPanel, { attachTo: document.body, global: { stubs: { Teleport: true } } })
      wrappers.push(w)
      await vi.dynamicImportSettled()
      await flushPromises()
      const k = w.find('.lab-header [data-test="entwurf"]')
      expect(k.exists(), id).toBe(erwartet)
      if (erwartet) expect(k.text()).toBe('Entwurf')
      w.unmount()
      wrappers.pop()
    }
  })
})
