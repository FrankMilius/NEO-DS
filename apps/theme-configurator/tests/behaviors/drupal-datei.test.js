/**
 * Fertige Datei fuer die Drupal-Library (packages/neo-behaviors/dist/
 * neo-behaviors.js, gebaut von scripts/baue-behaviors.mjs): laeuft ohne
 * Module im Browser, stellt window.NeoBehaviors bereit und meldet sich als
 * Drupal.behaviors.neoBehaviors an (attach/detach, drupalSettings.neoBehaviors).
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { vorlageFuer } from '../../src/arena-templates/index.js'
import { normalisiereRecipe, specimenAnsicht } from '../../src/lib/recipe-arena.js'
import { rohesRecipe } from '../arena/_recipes.js'
import paket from '../../../../packages/neo-behaviors/package.json'

const DATEI = readFileSync(resolve(__dirname, '../../../../packages/neo-behaviors/dist/neo-behaviors.js'), 'utf8')

function tabsMarkup () {
  const recipe = normalisiereRecipe(rohesRecipe('tabs'))
  return specimenAnsicht(recipe.specimens[0], recipe, 'tabs', vorlageFuer('tabs')).zeilen[0].zellen[0].html
}

function lade () {
  // wie ein <script>-Tag: globaler Kontext, keine Module
  new Function(DATEI)()
}

describe('dist/neo-behaviors.js (Drupal-Library)', () => {
  beforeEach(() => {
    delete globalThis.NeoBehaviors
    globalThis.Drupal = { behaviors: {} }
    document.body.innerHTML = ''
  })
  afterEach(() => { delete globalThis.Drupal; delete globalThis.NeoBehaviors })

  it('enthaelt keine import/export-Anweisungen und traegt die Paketversion', () => {
    expect(DATEI).not.toMatch(/^\s*(import|export)\s/m)
    expect(DATEI).toContain(`neo-behaviors ${paket.version}`)
  })

  it('stellt window.NeoBehaviors bereit und registriert Drupal.behaviors.neoBehaviors', () => {
    lade()
    expect(globalThis.NeoBehaviors.version).toBe(paket.version)
    expect(globalThis.NeoBehaviors.MIT_VERHALTEN).toContain('tabs')
    expect(typeof globalThis.Drupal.behaviors.neoBehaviors.attach).toBe('function')
  })

  it('attach bindet im Kontext, detach (unload) loest wieder', () => {
    lade()
    document.body.innerHTML = tabsMarkup()
    const b = globalThis.Drupal.behaviors.neoBehaviors
    b.attach(document, {})
    const tabs = [...document.querySelectorAll('.nc-tabs__trigger')]
    tabs[2].click()
    expect(tabs[2].getAttribute('aria-selected')).toBe('true')
    b.detach(document, {}, 'unload')
    expect(document.querySelector('[data-neo-behavior]')).toBeNull()
  })

  it('drupalSettings.neoBehaviors: nur bestimmte Bauteile oder aus', () => {
    lade()
    document.body.innerHTML = tabsMarkup()
    const b = globalThis.Drupal.behaviors.neoBehaviors
    b.attach(document, { neoBehaviors: { aus: true } })
    expect(document.querySelector('[data-neo-behavior]')).toBeNull()
    b.attach(document, { neoBehaviors: { nur: ['select'] } })
    expect(document.querySelector('[data-neo-behavior]')).toBeNull()
    b.attach(document, { neoBehaviors: { nur: ['tabs'] } })
    expect(document.querySelector('.nc-tabs').getAttribute('data-neo-behavior')).toBe('tabs')
  })

  it('Website-Bauteile (NUR_AUSDRUECKLICH) binden nur, wenn nur sie nennt (Entscheidung 06.10.2026)', () => {
    lade()
    const recipe = normalisiereRecipe(rohesRecipe('mobile-drawer'))
    const sp = recipe.specimens.find((s) => s.id === 'zustand')
    document.body.innerHTML = tabsMarkup() + specimenAnsicht(sp, recipe, 'mobile-drawer', vorlageFuer('mobile-drawer'), { ausprobieren: true }).zeilen[0].zellen[0].html
    const b = globalThis.Drupal.behaviors.neoBehaviors
    expect(globalThis.NeoBehaviors.NUR_AUSDRUECKLICH).toContain('mobile-drawer')
    b.attach(document, {})
    expect(document.querySelector('.nc-tabs').getAttribute('data-neo-behavior')).toBe('tabs')
    expect(document.querySelector('.nc-mobile-drawer').hasAttribute('data-neo-behavior')).toBe(false)
    b.attach(document, { neoBehaviors: { nur: ['mobile-drawer'] } })
    expect(document.querySelector('.nc-mobile-drawer').getAttribute('data-neo-behavior')).toBe('mobile-drawer')
  })

  it('Hauptnavigation (navigation-tab-mega): nur = [\'navigation-tab-mega\'] wie in neo_fe bindet Header und Drawer', () => {
    lade()
    const recipe = normalisiereRecipe(rohesRecipe('navigation-tab-mega'))
    const sp = recipe.specimens.find((s) => s.id === 'mobil')
    document.body.innerHTML = specimenAnsicht(sp, recipe, 'navigation-tab-mega', vorlageFuer('navigation-tab-mega'), { ausprobieren: true }).zeilen[0].zellen[0].html
    const b = globalThis.Drupal.behaviors.neoBehaviors
    b.attach(document, { neoBehaviors: { nur: ['navigation-tab-mega'] } })
    expect(document.querySelector('header.site-header').getAttribute('data-neo-behavior')).toBe('navigation-tab-mega')
    document.querySelector('.burger').click()
    expect(document.querySelector('.m-drawer').classList.contains('is-open')).toBe(true)
    b.detach(document, {}, 'unload')
    expect(document.querySelector('[data-neo-behavior]')).toBeNull()
  })

  it('ohne Drupal: nur window.NeoBehaviors (Doku, Storybook)', () => {
    delete globalThis.Drupal
    lade()
    expect(globalThis.NeoBehaviors.anbinden).toBeTypeOf('function')
  })
})
