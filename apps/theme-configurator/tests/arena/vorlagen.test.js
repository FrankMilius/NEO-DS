/**
 * Vorlagen-Registry (src/arena-templates): Abdeckung und Snapshots.
 *
 * Kennzahl „Recipes mit Vorlage": wie viele Recipes echtes Markup (aus
 * data/markup, per Vorlage mit Recipe-Klassen/-Zustaenden gefuellt) statt der
 * Slot-Heuristik bekommen. Die Zahl steht in der Testausgabe.
 */
import { describe, it, expect } from 'vitest'
import { vorlagenIds, vorlageFuer } from '../../src/arena-templates/index.js'
import { normalisiereRecipe, specimenAnsicht } from '../../src/lib/recipe-arena.js'
import { hasArena } from '../../src/composables/useArenaResolver.js'
import { RECIPE_IDS, rohesRecipe } from './_recipes.js'

function ansichten (id) {
  const recipe = normalisiereRecipe(rohesRecipe(id))
  return recipe.specimens.map((sp) => specimenAnsicht(sp, recipe, id, vorlageFuer(id)))
}

describe('Arena-Vorlagen: Abdeckung', () => {
  it('jede Vorlage gehoert zu einem Recipe', () => {
    const verwaist = vorlagenIds().filter((id) => !RECIPE_IDS.includes(id))
    expect(verwaist).toEqual([])
  })

  it('Kennzahl: Recipes mit Vorlage', () => {
    const mit = RECIPE_IDS.filter((id) => vorlageFuer(id))
    const sichtbar = mit.filter((id) => !hasArena(id))
    const ohneArena = RECIPE_IDS.filter((id) => !hasArena(id))
    console.log(
      `[Arena-Vorlagen] Recipes mit Vorlage: ${mit.length} von ${RECIPE_IDS.length}` +
      ` — davon in der App sichtbar (keine Sonderfall-Arena): ${sichtbar.length} von ${ohneArena.length}`
    )
    expect(mit.length).toBeGreaterThanOrEqual(30)
  })

  for (const id of vorlagenIds()) {
    it(`${id}: jede Zelle kommt aus der Vorlage`, () => {
      const quellen = new Set(ansichten(id).flatMap((a) => a.zeilen.flatMap((z) => z.zellen.map((c) => c.quelle))))
      expect([...quellen]).toEqual(['vorlage'])
    })
  }
})

describe('Arena-Vorlagen: Snapshots', () => {
  const FAELLE = [
    ['kbd', 'key-combination'],
    ['form-hint', 'with-icon'],
    ['form-label', 'all-states'],
    ['stepper', 'all-states'],
    ['empty-state', 'content-variants'],
    ['divider', 'with-label'],
    ['compare-table', 'selectable']
  ]
  for (const [id, specimenId] of FAELLE) {
    it(`${id} / ${specimenId}`, () => {
      const a = ansichten(id).find((x) => x.id === specimenId)
      expect(a, `${id}: Specimen ${specimenId} fehlt`).toBeTruthy()
      const zellen = a.zeilen.flatMap((z) => z.zellen).map((z) => ({
        id: z.id,
        label: z.label,
        tokenGroups: z.tokenGroups,
        html: z.html.trim()
      }))
      expect(zellen).toMatchSnapshot()
    })
  }
})
