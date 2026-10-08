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
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { MIT_VERHALTEN } from 'neo-behaviors'
import { istEntwurf } from '../../src/data/recipe-entwuerfe.js'
import { vorlageFuer } from '../../src/arena-templates/index.js'
import { normalisiereRecipe, specimenAnsicht } from '../../src/lib/recipe-arena.js'
import { WURZEL, rohesRecipe } from './_recipes.js'

const spec = (id) => JSON.parse(readFileSync(resolve(WURZEL, `specs/${id}.spec.json`), 'utf8'))

function zellen (id, optionen) {
  const recipe = normalisiereRecipe(rohesRecipe(id))
  return recipe.specimens.flatMap((sp) => specimenAnsicht(sp, recipe, id, vorlageFuer(id), optionen).zeilen
    .flatMap((z) => z.zellen.map((c) => ({ ...c, specimen: sp }))))
}

function dom (html) {
  const d = document.createElement('div')
  d.innerHTML = html
  return d
}

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
  // Freigabe-Eintrag (danach hoechstens eine Korrektur „Freigabe ausstehend")
  const freigabe = r.meta.changelog.findIndex((e) => /^Freigabe \(Abschluss Plan v3, 08\.10\.2026\)/.test(e.changes[0]))
  expect(freigabe, id).toBeGreaterThanOrEqual(0)
  for (const e of r.meta.changelog.slice(0, freigabe)) expect(e.changes.join(' '), id).toMatch(/Freigabe ausstehend/)
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

  it('table-info-modal: 1.3.0, Anatomie wie das SCSS, keyboard/events wie das Behavior, Website seit 07.10.2026 per nur', () => {
    const r = freigegeben('table-info-modal', '1.3.0')
    anatomieWieScss('table-info-modal', 'scss/scss/07-organisms/_table-info-modal.scss', 'nc-table-info-modal')
    expect(MIT_VERHALTEN).toContain('table-info-modal')
    expect(Object.keys(r.keyboard).sort()).toEqual(['Enter', 'Escape', 'Shift+Tab', 'Space', 'Tab'])
    // ohne nochDa: kein 'resize'
    const grund = r.events['table-info-modal-close'].note
    for (const g of ['escape', 'overlay-click', 'close-button', 'trigger']) expect(grund).toContain(`'${g}'`)
    expect(grund).not.toContain("'resize'")
    expect(r.meta.pipeline.drupal).toEqual(['block/block--block-content--neo-table.html.twig', 'block/block--inline-block--neo-table.html.twig'])
    expect(r.meta.source.drupal).toMatch(/nur\[\] = 'table-info-modal'/)
    expect(r.anatomy.domNotes.join(' ')).not.toMatch(/bis zur Umstellung|ersten sechs/)
    // Website-Markup (geerntet): role=dialog, Schliessen per data-modal-close, ohne Namen
    const ernte = readFileSync(resolve(WURZEL, 'data/markup/table-info-modal.html'), 'utf8')
    expect(ernte).toMatch(/role="dialog"/)
    expect(ernte).toMatch(/nc-table-info-modal__close" data-modal-close/)
    expect(ernte).not.toMatch(/aria-labelledby|aria-modal/)
  })

  it('multiselect: 1.5.0, Anatomie wie das SCSS, keyboard wie das Behavior, „<n> ausgewählt" als Einschraenkung', () => {
    const r = freigegeben('multiselect', '1.5.0')
    anatomieWieScss('multiselect', 'scss/scss/06-molecules/_multiselect.scss', 'nc-multiselect')
    expect(MIT_VERHALTEN).toContain('multiselect')
    expect(Object.keys(r.keyboard).sort()).toEqual(['ArrowDown', 'ArrowUp', 'End', 'Enter', 'Escape', 'Home', 'Space', 'Tab'])
    expect(r.events['multiselect-change'].detail).toEqual({ values: 'string[]' })
    // Einschraenkung: fest deutsch im Behavior — wird es uebersetzbar, Recipe nachziehen
    const behavior = readFileSync(resolve(WURZEL, 'packages/neo-behaviors/multiselect.js'), 'utf8')
    expect(behavior).toContain('ausgewählt`')
    expect(r.anatomy.domNotes.join(' ')).toMatch(/Einschraenkung: „<n> ausgewählt" .* fest deutsch/)
    expect(r.a11y.base.assertions.join(' ')).toMatch(/fest deutsch/)
    expect(r.constraints.copy.summary.note).toMatch(/fest deutsch/)
    expect(r.meta.source.drupal).toMatch(/_neo_fe_hat_multiselect/)
    // die frueher „ausstehenden" SCSS-Aenderungen sind freigegeben
    expect(r.meta.changelog[0].changes.join(' ')).toMatch(/seit 07\.10\.2026 freigegeben/)
  })

  it('searchbar: 1.3.0, Anatomie wie das SCSS (ohne den toten __shortcut), Verhalten beschrieben, nicht migriert', () => {
    const r = freigegeben('searchbar', '1.3.0')
    anatomieWieScss('searchbar', 'scss/scss/06-molecules/_searchbar.scss', 'nc-searchbar', ['.nc-searchbar__shortcut'])
    expect(r.anatomy.slots.map((s) => s.name)).not.toContain('shortcut')
    // kein Behavior in neo-behaviors: keine keyboard/events (wie reference-page)
    expect(MIT_VERHALTEN).not.toContain('searchbar')
    expect(r.keyboard).toBeUndefined()
    expect(r.events).toBeUndefined()
    expect(r.meta.source.behavior).toBeNull()
    expect(r.meta.source.drupal).toMatch(/neoSearch/)
    expect(r.meta.source.drupal).toMatch(/nicht im Einsatz/)
    expect(r.anatomy.domNotes.join(' ')).toMatch(/Strg\/⌘\+K/)
    expect(r.anatomy.domNotes.join(' ')).toMatch(/__shortcut .* tot/)
  })

  it('tab-nav: 1.3.0, jedes SCSS-Element ein Slot, Haken ohne CSS benannt, zehn Website-Module, Verhalten beschrieben', () => {
    const r = freigegeben('tab-nav', '1.3.0')
    const slots = Object.fromEntries(r.anatomy.slots.map((s) => [s.element, s]))
    const scss = scssElemente('scss/scss/06-molecules/_tab-nav.scss', 'nc-tab-nav')
    for (const el of scss) expect(slots[el], el).toBeTruthy()
    // Haken der Website am jeweiligen Element, ohne eigenes CSS
    for (const el of ['.nc-tab-nav__panel', '.nc-tab-nav__features', '.nc-tab-nav__xpanels']) {
      expect(scss.has(el), el).toBe(false)
      expect(slots[el].description, el).toMatch(/Haken/)
    }
    // __badges: im DS gebaut, auf der Website nicht im Markup
    expect(slots['.nc-tab-nav__badges'].optional).toBe(true)
    const module = ['features', 'feature_list', 'bento', 'expanding', 'card_grid', 'hero', 'hero_tom', 'hero_tmob', 'text_media', 'form']
    const notizen = r.anatomy.domNotes.join(' ')
    for (const mod of module) expect(notizen, mod).toMatch(new RegExp(`\\b${mod}\\b`))
    // kein Behavior in neo-behaviors: keine keyboard/events
    expect(MIT_VERHALTEN).not.toContain('tab-nav')
    expect(r.keyboard).toBeUndefined()
    expect(r.events).toBeUndefined()
    expect(r.meta.source.behavior).toBeNull()
    expect(r.meta.source.drupal).toMatch(/neoTabNav/)
    expect(notizen).toMatch(/Pos1\/Ende/)
    expect(r.a11y.base.assertions.join(' ')).toMatch(/2\.2\.2/)
    expect(r.meta.pipeline.drupal).toEqual(['block/block--block-content--neo-tab-nav.html.twig', 'block/block--inline-block--neo-tab-nav.html.twig'])
  })

  it('tbl-cell: 1.3.0, Anatomie wie das SCSS, nur der Text Pflicht, Wertsymbole mit Textalternative, Haken ohne Farbwerte', () => {
    const r = freigegeben('tbl-cell', '1.3.0')
    anatomieWieScss('tbl-cell', 'scss/scss/05-atoms/_tbl-cell.scss', 'nc-tbl-cell')
    const pflicht = Object.fromEntries(r.anatomy.slots.map((s) => [s.name, !s.optional]))
    expect(pflicht).toEqual({ text: true, 'info-btn': false, sub: false, 'icon-block': false, icon: false })
    expect(r.keyboard).toBeUndefined()
    expect(r.meta.source.drupal).toMatch(/renderCell/)
    for (const z of zellen('tbl-cell')) {
      const d = dom(z.html)
      for (const svg of d.querySelectorAll('svg.nc-tbl-icon')) {
        expect(svg.getAttribute('aria-label'), z.specimen.id).toMatch(/^(nicht )?enthalten$/)
        // Farben nur aus _tbl-icon.scss (wie neoTable seit 25.08.2026)
        expect(svg.innerHTML, z.specimen.id).not.toMatch(/fill="#|stroke="black"/)
      }
      for (const knopf of d.querySelectorAll('.nc-tbl-cell__info-btn')) {
        expect(knopf.getAttribute('type')).toBe('button')
        expect(knopf.getAttribute('aria-label')).toBeTruthy()
      }
    }
    expect(r.a11y.base.assertions.join(' ')).toMatch(/1\.1\.1/)
  })

  it('table-block: 1.2.1, Felder und Aufbau wie Drupal, Kopf-Kontrast als Befund, Arena wie die Website-Tabelle', () => {
    const r = freigegeben('table-block', '1.2.1')
    expect(r.anatomy.slots).toEqual([])
    expect(r.komposition.map((k) => k.recipe)).toEqual(['compare-table', 'tbl-cell'])
    const notizen = r.anatomy.domNotes.join(' ')
    for (const feld of ['field_tbl_variant', 'field_tbl_width', 'field_tbl_sticky_col', 'field_tbl_scroll_bp', 'field_tbl_header_bg']) expect(notizen, feld).toContain(feld)
    // jeder Tabellen-Modifier, den Drupal setzen kann, steht im DS
    const css = readFileSync(resolve(WURZEL, 'styles.css'), 'utf8')
    for (const k of ['striped', 'compact', 'borderless', 'sticky-header', 'full-width', 'sticky-col']) expect(css, k).toContain(`.nc-compare-table--${k}`)
    expect(r.a11y.base.assertions.join(' ')).toMatch(/1,07:1/)
    // Korrektur 1.2.1 (Freigabe ausstehend): erste Kopfzelle mit der Kopfflaeche, nicht background-base
    expect(css).toContain('.nc-table-block .nc-compare-table--sticky-col thead th:first-child{background-color:var(--tbl-header-bg, var(--fnd-color-background-tertiary))')
    expect(r.meta.pipeline.drupal).toEqual(['block/block--block-content--neo-table.html.twig', 'block/block--inline-block--neo-table.html.twig'])
    expect(r.keyboard).toBeUndefined()
    for (const z of zellen('table-block')) {
      const d = dom(z.html)
      expect(d.querySelectorAll('thead th[scope="col"]').length).toBeGreaterThan(1)
      for (const svg of d.querySelectorAll('svg.nc-tbl-icon')) expect(svg.innerHTML).not.toMatch(/fill="#|stroke="black"/)
    }
  })
})
