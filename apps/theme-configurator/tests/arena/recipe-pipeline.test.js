/**
 * pipeline.arena im Recipe muss auf eine existierende Datei zeigen. Anlass:
 * range-recipe.json verwies auf SliderArena.vue, die es seit der Teilung in
 * range/carousel nicht mehr gab.
 */
import { describe, it, expect } from 'vitest'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { RECIPE_IDS, rohesRecipe, WURZEL } from './_recipes.js'

describe('Recipe-Pipeline: Arena-Pfade', () => {
  for (const id of RECIPE_IDS) {
    const arena = rohesRecipe(id).meta?.pipeline?.arena
    if (!arena) continue
    it(`${id}: ${arena} existiert`, () => {
      expect(existsSync(resolve(WURZEL, arena)), arena).toBe(true)
    })
  }
})
