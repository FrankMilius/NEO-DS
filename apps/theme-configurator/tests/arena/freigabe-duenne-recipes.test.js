/**
 * Freigabe der restlichen Entwurfs-Recipes aus Phase 4 („Duenne Recipes",
 * Abschluss Plan v3, Entscheidung 08.10.2026): mobile-drawer, multiselect,
 * searchbar, tab-nav, table-block, table-info-modal, tbl-cell.
 *
 * Je Recipe: Status stable mit Freigabe-Eintrag, aus der Entwurfsliste
 * ausgetragen, Spec aus dem Recipe neu erzeugt, Anatomie gegen das SCSS
 * (jedes BEM-Element ist ein Slot, kein Zustand als Slot), Recipe-Form nach
 * recipe-schema.json und a11y als Pruefpunkte. Dazu, was die Pruefung gegen
 * SCSS, neo-behaviors und das Drupal-Theme neo_fe ergeben hat.
 */
import { describe, it, expect } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { MIT_VERHALTEN } from 'neo-behaviors'
import { istEntwurf } from '../../src/data/recipe-entwuerfe.js'
import { WURZEL, rohesRecipe } from './_recipes.js'

const spec = (id) => JSON.parse(readFileSync(resolve(WURZEL, `specs/${id}.spec.json`), 'utf8'))

/** BEM-Elemente (.block__element, ohne Modifier) einer SCSS-Datei. */
function scssElemente (pfad, block) {
  const text = readFileSync(resolve(WURZEL, pfad), 'utf8').replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '')
  const muster = new RegExp(`\\.${block}__[a-z0-9-]+`, 'g')
  return new Set([...text.matchAll(muster)].map((m) => m[0].replace(/--.*$/, '')))
}

/** Gemeinsame Freigabe-Pruefung. */
function freigegeben (id, version) {
  const r = rohesRecipe(id)
  expect(r.meta.status, id).toBe('stable')
  expect(r.meta.version, id).toBe(version)
  expect(r.meta.changelog[0].version, id).toBe(version)
  expect(r.meta.changelog[0].changes[0], id).toMatch(/^Freigabe \(Abschluss Plan v3, 08\.10\.2026\)/)
  expect(istEntwurf(id), id).toBe(false)
  // Recipe-Form (recipe-schema.json): Objekte statt Listen, mindestens eine Token-Gruppe
  expect(Array.isArray(r.constraints), id).toBe(false)
  expect(Array.isArray(r.recipes), id).toBe(false)
  expect(Object.keys(r.styling.tokenGroups || {}).length, id).toBeGreaterThan(0)
  for (const sp of r.specimens) expect(['row', 'grid', 'composition'], `${id}/${sp.id}`).toContain(sp.layout)
  // a11y als Pruefpunkte, kein „nicht geprueft" mehr
  expect(r.a11y.notes, id).toBeUndefined()
  expect(r.a11y.base.assertions.length, id).toBeGreaterThan(2)
  expect(JSON.stringify(r.a11y), id).not.toMatch(/nicht geprueft/i)
  // kein Zustand (Modifier) als Slot
  for (const s of r.anatomy.slots) expect(s.element, `${id}: ${s.name}`).not.toMatch(/--/)
  // Spec aus dem Recipe neu erzeugt (npm run specs:pruefen prueft den Rest)
  const s = spec(id)
  expect(s.status, id).toBe('stable')
  expect(s.version, id).toBe(version)
  expect(s.layer, id).not.toBe('unknown')
  return r
}

/** Jedes BEM-Element des SCSS ist ein Slot und umgekehrt. */
function anatomieWieScss (id, pfad, block, ausser = []) {
  const r = rohesRecipe(id)
  const slots = new Set(r.anatomy.slots.map((s) => s.element).filter((e) => e.startsWith(`.${block}__`)))
  const scss = [...scssElemente(pfad, block)].filter((e) => !ausser.includes(e))
  expect([...slots].sort(), id).toEqual(scss.sort())
}

describe('Freigabe duenne Recipes (Abschluss Plan v3, 08.10.2026)', () => {
  it('mobile-drawer: 1.3.0, Anatomie wie das SCSS, keyboard/events wie das Behavior, auf der Website nicht im Einsatz', () => {
    const r = freigegeben('mobile-drawer', '1.3.0')
    anatomieWieScss('mobile-drawer', 'scss/scss/07-organisms/_mobile-drawer.scss', 'nc-mobile-drawer')
    const pflicht = Object.fromEntries(r.anatomy.slots.map((s) => [s.name, !s.optional]))
    expect(pflicht).toMatchObject({ backdrop: true, header: true, close: true, nav: true, list: true, link: true, title: false, sublist: false, sublink: false })
    expect(MIT_VERHALTEN).toContain('mobile-drawer')
    expect(Object.keys(r.keyboard).sort()).toEqual(['Enter', 'Escape', 'Shift+Tab', 'Space', 'Tab'])
    // reason-Werte aus _ueberlagerung.js; resize, weil der Drawer ab 1200 px ausgeblendet wird
    for (const grund of ['escape', 'overlay-click', 'close-button', 'trigger', 'resize']) {
      expect(r.events['mobile-drawer-close'].note).toContain(`'${grund}'`)
    }
    expect(r.keyboard.Enter.note).toMatch(/inert/)
    expect(r.meta.source.behavior).toMatch(/mobile-drawer\.js/)
    expect(r.meta.source.drupal).toMatch(/nicht im Einsatz/)
    expect(r.meta.pipeline.drupal).toEqual([])
    expect(r.anatomy.domNotes.join(' ')).not.toMatch(/neoMobileNav\)|bis zur Umstellung/)
    expect(r.a11y.base.assertions.join(' ')).toMatch(/Namen im Markup/)
  })
})
