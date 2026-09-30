// Mount-Smoke je Sektion (Plan v2, 3.4): LaboratoryPanel und InspectorPanel
// rendern fuer jede Navigations-Sektion ohne Fehler und ohne Vue-Warnung.
// Gruppiert nach Ebene; Komponenten-Arenen werden fuer den Smoke durch einen
// Platzhalter ersetzt (ihre Darstellung testen tests/arena/*).
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent, h, markRaw } from 'vue'
import { useThemeStore } from '../../src/stores/theme.js'
import { NAVIGATIONS_SEKTIONEN } from '../../src/navigation/sektions-ids.js'

vi.mock('../../src/composables/useArenaResolver.js', async (original) => {
  const echt = await original()
  const { computed } = await import('vue')
  const Platzhalter = markRaw(defineComponent({
    name: 'ArenaPlatzhalter',
    props: {},
    setup: () => () => h('div', { 'data-test': 'arena-platzhalter' }),
  }))
  return {
    ...echt,
    useArenaResolver: (idRef) => ({
      resolvedArena: computed(() => ((typeof idRef === 'string' ? idRef : idRef.value) ? Platzhalter : null)),
      hasDedicatedArena: computed(() => false),
    }),
  }
})

const LaboratoryPanel = (await import('../../src/components/laboratory/LaboratoryPanel.vue')).default
const InspectorPanel = (await import('../../src/components/layout/InspectorPanel.vue')).default

let fehler
let warnSpy
beforeEach(() => {
  fehler = []
  warnSpy = vi.spyOn(console, 'warn').mockImplementation((...a) => {
    if (String(a[0]).includes('[Vue warn]')) fehler.push(String(a[0]))
  })
})
afterEach(() => warnSpy.mockRestore())

async function rendere (Komponente, sektion) {
  const store = useThemeStore()
  store.setActiveSection(sektion)
  const w = mount(Komponente, {
    attachTo: document.body,
    global: {
      config: { errorHandler: (err) => fehler.push(`${sektion}: ${err?.message || err}`) },
      stubs: { Teleport: true },
    },
  })
  await vi.dynamicImportSettled()
  await flushPromises()
  return w
}

const gruppen = {}
for (const id of NAVIGATIONS_SEKTIONEN) {
  const ebene = id.split('-')[0]
  ;(gruppen[ebene] ||= []).push(id)
}

for (const [ebene, sektionen] of Object.entries(gruppen)) {
  describe(`Mount-Smoke: ${ebene} (${sektionen.length})`, () => {
    it.each(sektionen)('%s rendert im Labor und Inspector ohne Fehler', async (sektion) => {
      const lab = await rendere(LaboratoryPanel, sektion)
      expect(lab.find('.lab-viewport-inner').exists()).toBe(true)
      // Viewport hat Inhalt — ausser Farben/Primitives (dort bewusst leer)
      if (sektion !== 'foundation-colors') {
        expect(lab.find('.lab-viewport-inner').element.children.length, sektion).toBeGreaterThan(0)
      }
      lab.unmount()
      const insp = await rendere(InspectorPanel, sektion)
      expect(insp.find('.inspector-panel').exists()).toBe(true)
      insp.unmount()
      expect(fehler).toEqual([])
    })
  })
}

describe('Labor-Inhalt je Sektionsart', () => {
  it('Komponenten-Sektion zeigt die Arena (Platzhalter), Matrix-Modus viermal', async () => {
    const store = useThemeStore()
    const w = await rendere(LaboratoryPanel, 'component-button')
    expect(w.findAll('[data-test="arena-platzhalter"]')).toHaveLength(1)
    store.setPreviewMode('matrix')
    await flushPromises()
    expect(w.findAll('.theme-matrix__quadrant [data-test="arena-platzhalter"]')).toHaveLength(4)
    w.unmount()
  })

  it('Typografie zeigt Editor und darunter die Magazin-Vorschau', async () => {
    const w = await rendere(LaboratoryPanel, 'foundation-typography')
    expect(w.find('.mag').exists()).toBe(true)
    w.unmount()
  })

  it('Farben/Semantic mit Kategorie zeigt die Specimens', async () => {
    const store = useThemeStore()
    store.setActiveSection('foundation-colors')
    store.state.colorActiveTab = 'semantic'
    store.state.semanticCategory = 'text'
    const w = await rendere(LaboratoryPanel, 'foundation-colors')
    expect(w.find('.arena-specimens-grid').exists()).toBe(true)
    store.state.colorActiveTab = 'primitives'
    store.state.semanticCategory = null
    await flushPromises()
    expect(w.find('.arena-specimens-grid').exists()).toBe(false)
    w.unmount()
  })

  it('Breadcrumb kommt aus der Registry', async () => {
    const w = await rendere(LaboratoryPanel, 'foundation-radius')
    expect(w.find('.lab-breadcrumb-leaf').text()).toBe('Border Radius')
    w.unmount()
  })
})
