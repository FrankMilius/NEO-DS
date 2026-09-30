// Gemeinsame Helfer fuer die Arena-Tests: Recipes direkt aus data/ lesen.
import { readdirSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

export const WURZEL = resolve(__dirname, '../../../..')
export const DATA = resolve(WURZEL, 'data')

export const RECIPE_IDS = readdirSync(DATA)
  .filter((f) => f.endsWith('-recipe.json'))
  .map((f) => f.slice(0, -'-recipe.json'.length))
  .sort()

export function rohesRecipe (id) {
  return JSON.parse(readFileSync(resolve(DATA, `${id}-recipe.json`), 'utf-8'))
}
