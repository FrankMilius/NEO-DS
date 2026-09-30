/**
 * RecipeArena (Plan v2, 3.5): Jede Arena entsteht aus dem Recipe. Der Test
 * mountet die Arena fuer ALLE Recipes und prueft jede Specimen-Zelle:
 *   - es gibt genau so viele Zellen, wie die SDK-Matrix (Achsen × Zustaende)
 *     ergibt,
 *   - jede Zelle traegt data-token-groups und data-specimen-id,
 *   - jede Zelle enthaelt ein Element mit allen baseClasses des Recipes
 *     (oder ein ausdruecklich markiertes Wurzelelement, s. u.),
 *   - keine Zelle ist beim Rendern gescheitert.
 */
import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import RecipeArena from '../../src/components/laboratory/RecipeArena.vue'
import { normalisiereRecipe, zellenFuer, specimenAnsicht } from '../../src/lib/recipe-arena.js'
import { RECIPE_IDS, rohesRecipe } from './_recipes.js'

async function mountArena (id) {
  const w = mount(RecipeArena, { props: { componentId: id } })
  for (let i = 0; i < 30 && !w.find('.ra-specimen').exists(); i++) {
    await flushPromises()
    await new Promise((r) => setTimeout(r, 5))
  }
  return w
}

describe('RecipeArena — alle Recipes', () => {
  afterEach(() => vi.restoreAllMocks())

  it('liest den kompletten Recipe-Ordner', () => {
    expect(RECIPE_IDS.length).toBeGreaterThanOrEqual(130)
  })

  for (const id of RECIPE_IDS) {
    it(`${id}: jede Zelle rendert mit Basisklassen und Token-Gruppen`, async () => {
      const warnungen = []
      vi.spyOn(console, 'warn').mockImplementation((...a) => warnungen.push(a.join(' ')))

      const recipe = normalisiereRecipe(rohesRecipe(id))
      const erwartet = recipe.specimens.reduce((n, sp) => n + zellenFuer(sp, recipe).length, 0)
      expect(recipe.styling.baseClasses.length, `${id}: keine Basisklasse`).toBeGreaterThan(0)

      const w = await mountArena(id)
      const zellen = w.findAll('.ra-cell')
      expect(zellen.length, `${id}: Zellenzahl`).toBe(erwartet)
      expect(erwartet, `${id}: keine Zellen`).toBeGreaterThan(0)

      const selektor = recipe.styling.baseClasses.map((k) => '.' + k).join('')
      for (const z of zellen) {
        const zellId = z.attributes('data-cell-id')
        expect(z.attributes('data-token-groups'), `${id}/${zellId}`).toBeTypeOf('string')
        expect(z.attributes('data-specimen-id'), `${id}/${zellId}`).toBeTruthy()
        expect(z.attributes('data-quelle'), `${id}/${zellId}: ${z.text()}`).not.toBe('fehler')
        const live = z.find('.ra-live-component').element
        // Ausnahme mit Kennzeichnung: manche Varianten sind im DS ein eigener
        // Block (divider with-label → .nc-divider-label). Die Vorlage markiert
        // ihn dann mit data-recipe-wurzel="<Basisklasse>".
        const wurzel = live.querySelector(selektor) ||
          live.querySelector(`[data-recipe-wurzel="${recipe.styling.baseClasses[0]}"]`)
        expect(wurzel, `${id}/${zellId}: kein ${selektor}`).not.toBeNull()
      }
      expect(warnungen.filter((t) => t.includes('RecipeLoader')), id).toEqual([])
      w.unmount()
    })
  }
})

describe('Slot-Heuristik ohne Vorlage', () => {
  it('leere Behaelter zeigen ihren Slotnamen statt einer leeren Flaeche', () => {
    const recipe = normalisiereRecipe({
      meta: { component: 'probe', layer: 'organism' },
      anatomy: {
        root: { element: '.nc-probe' },
        slots: [
          { name: 'panel', element: '.nc-probe__panel' },
          { name: 'title', element: '.nc-probe__title' }
        ]
      },
      styling: { baseClasses: ['nc-probe'] }
    })
    const [zelle] = specimenAnsicht(recipe.specimens[0], recipe, 'probe', null).zeilen[0].zellen
    expect(zelle.quelle).toBe('heuristik')
    expect(zelle.html).toContain('<div class="nc-probe__panel"><span class="ra-slot-name" aria-hidden="true">panel</span></div>')
    // Slots mit eigenem Inhalt (Titel) bekommen keine Beschriftung
    expect(zelle.html).not.toContain('>title</span>')
  })
})
