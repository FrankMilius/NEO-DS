// Gemeinsame Helfer fuer die Behavior-Tests (Plan v3, Phase 2).
// Markup kommt — wo es eine Vorlage gibt — genau so aus dem Recipe, wie die
// Arena es baut. Tasten und Ereignisse liest jeder Test aus dem Recipe
// (`keyboard`, `events`), damit Recipe und Verhalten nicht auseinanderlaufen.
import { expect } from 'vitest'
import { vorlageFuer } from '../../src/arena-templates/index.js'
import { normalisiereRecipe, specimenAnsicht } from '../../src/lib/recipe-arena.js'
import { rohesRecipe } from '../arena/_recipes.js'

/** Markup einer Arena-Zelle (Standard: erste Zelle des Specimens). */
export function zellenMarkup (id, specimenId, zeile = 0, zelle = 0) {
  const recipe = normalisiereRecipe(rohesRecipe(id))
  const sp = recipe.specimens.find((s) => !specimenId || s.id === specimenId)
  if (!sp) throw new Error(`${id}: Specimen ${specimenId} fehlt`)
  return specimenAnsicht(sp, recipe, id, vorlageFuer(id)).zeilen[zeile].zellen[zelle].html
}

/** Markup der ersten Zelle des Specimens, deren HTML `test` erfuellt. */
export function zelleMit (id, specimenId, test) {
  const recipe = normalisiereRecipe(rohesRecipe(id))
  const sp = recipe.specimens.find((s) => s.id === specimenId)
  const zelle = specimenAnsicht(sp, recipe, id, vorlageFuer(id)).zeilen.flatMap((z) => z.zellen).find((z) => test(z.html))
  if (!zelle) throw new Error(`${id}/${specimenId}: keine passende Zelle`)
  return zelle.html
}

export function buehne (html) {
  const d = document.createElement('div')
  d.innerHTML = html
  document.body.append(d)
  return d
}

/** Recipe-Tastenname → KeyboardEvent-Init ('Space' → ' ', 'Shift+Tab' …). */
export function tastenInit (name) {
  const teile = name.split('+')
  const key = teile.pop()
  return { key: key === 'Space' ? ' ' : key, shiftKey: teile.includes('Shift'), altKey: teile.includes('Alt'), ctrlKey: teile.includes('Ctrl') }
}

/**
 * Taste wie im Browser: keydown; bei Knoepfen loesen Enter und Leertaste
 * danach einen Klick aus, sofern niemand preventDefault() gerufen hat.
 * @returns {KeyboardEvent}
 */
export function taste (el, name) {
  const init = tastenInit(name)
  const e = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, ...init })
  el.dispatchEvent(e)
  if (!e.defaultPrevented && el.tagName === 'BUTTON' && !el.disabled && (init.key === 'Enter' || init.key === ' ')) el.click()
  return e
}

export const tastenAus = (id) => Object.keys(rohesRecipe(id).keyboard || {})

/** Haelt die Pruefliste vollstaendig: jede Recipe-Taste hat genau eine Pruefung. */
export function deckeTastenAb (id, pruefungen) {
  expect(Object.keys(pruefungen).sort()).toEqual(tastenAus(id).sort())
}

/** Sammelt Ereignisse eines Namens am Element. */
export function sammle (el, name) {
  const liste = []
  el.addEventListener(name, (e) => liste.push(e))
  return liste
}

const TYP = {
  string: (v) => typeof v === 'string' || v === null,
  number: (v) => typeof v === 'number',
  boolean: (v) => typeof v === 'boolean',
  'string[]': (v) => Array.isArray(v) && v.every((x) => typeof x === 'string'),
  'boolean|null': (v) => typeof v === 'boolean' || v === null
}

/** Ereignis passt zur Beschreibung im Recipe (`events`): bubbles, detail-Felder und -Typen. */
export function passtZumRecipe (id, ereignis) {
  const soll = rohesRecipe(id).events?.[ereignis.type]
  expect(soll, `${id}: Ereignis ${ereignis.type} fehlt im Recipe`).toBeTruthy()
  expect(ereignis.bubbles).toBe(soll.bubbles !== false)
  const felder = soll.detail || {}
  expect(Object.keys(ereignis.detail || {}).sort()).toEqual(Object.keys(felder).sort())
  for (const [feld, typ] of Object.entries(felder)) {
    expect(TYP[typ], `unbekannter Typ ${typ}`).toBeTypeOf('function')
    expect(TYP[typ](ereignis.detail[feld]), `${ereignis.type}.${feld} ist kein ${typ}`).toBe(true)
  }
}
