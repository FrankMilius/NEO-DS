/**
 * Plan v3, Phase 3 (Block Inhalte): Karte, Akkordeon und Datentabelle kommen
 * aus dem Recipe (Vorlagen in src/arena-templates) statt aus handgeschriebenen
 * Vue-Arenen; die Sektion „Table" zeigt die Arena von compare-table (Recipe
 * am 25.08.2026 zusammengelegt). Geprueft wird:
 *   - keine Sonderfall-Arena, jede Zelle jedes Specimens aus der Vorlage;
 *     Recipe, Spec und Registry zeigen auf die RecipeArena, die Vue-Arenen sind
 *     weg; table → compare-table (ALIASE)
 *   - echtes DS-Markup: Basisklasse, nur Klassen aus styles.css bzw. der
 *     Anatomie (Ausnahmen: Recipe-Modifier ohne SCSS — zur Entscheidung
 *     gemeldet), keine Inline-Gestaltung, keine fremden Zustandsklassen,
 *     andere Bauteile erklaert, ids eindeutig auch im Split-Modus
 *   - Zustaende je Bauteil (offen, gesperrt, gewaehlt, Platzhalter, laden,
 *     Fehler, leer) an den Elementen, die das DS dafuer liest
 *   - „Ausprobieren" nur beim Akkordeon (neo-behaviors accordion): alles
 *     startet zu, kein fester Zustand; in der gemounteten RecipeArena gebunden
 *   - styles.css: Wrap-Modus der Datentabelle laesst <td> eine Tabellenzelle
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { mount, flushPromises } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import { MIT_VERHALTEN } from 'neo-behaviors'
import RecipeArena from '../../src/components/laboratory/RecipeArena.vue'
import { vorlageFuer } from '../../src/arena-templates/index.js'
import { normalisiereRecipe, specimenAnsicht, fuerWeiteresThema } from '../../src/lib/recipe-arena.js'
import { hasArena, arenaQuelle, arenaRecipe } from '../../src/composables/useArenaResolver.js'
import { vorschauVariablen } from '../../src/lib/vorschau-variablen.js'
import { RECIPE_IDS, WURZEL, DATA, rohesRecipe } from './_recipes.js'

const BLOCK = ['card', 'accordion', 'data-table']
const VUE_ARENEN = ['CardArena', 'AccordionArena', 'DataTableArena', 'TableArena']

function zellen (id, specimenId, optionen) {
  const recipe = normalisiereRecipe(rohesRecipe(id))
  return recipe.specimens
    .filter((sp) => !specimenId || sp.id === specimenId)
    .flatMap((sp) => specimenAnsicht(sp, recipe, id, vorlageFuer(id), optionen).zeilen
      .flatMap((z) => z.zellen.map((c) => ({ ...c, specimen: sp }))))
}
const beideModi = (id) => [...zellen(id), ...zellen(id, null, { ausprobieren: true })]

function dom (html) {
  const d = document.createElement('div')
  d.innerHTML = html
  return d
}
/** Zelle eines Specimens nach Beschriftung (z. B. 'Geöffnet', 'Deaktiviert'). */
function zelle (id, sp, label) {
  const z = zellen(id, sp).find((c) => c.label === label || c.label.endsWith(`· ${label}`))
  if (!z) throw new Error(`${id}/${sp}: keine Zelle „${label}" (${zellen(id, sp).map((c) => c.label).join(', ')})`)
  return dom(z.html)
}
const lebendig = (id, sp) => dom(zellen(id, sp, { ausprobieren: true })[0].html)

const STYLES = resolve(WURZEL, 'styles.css')
function dsKlassen () {
  if (!existsSync(STYLES)) throw new Error('styles.css fehlt — im Wurzelordner `npm run build:css` ausfuehren')
  const css = readFileSync(STYLES, 'utf8')
  return new Set([...css.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)].map((m) => m[1]))
}
function anatomieKlassen (id) {
  const r = rohesRecipe(id)
  const sel = [r.anatomy?.root?.element, ...(r.anatomy?.slots || []).map((s) => s.element), ...(r.anatomy?.convenience || []).map((s) => s.element)].filter(Boolean)
  return new Set(sel.flatMap((s) => [...String(s).matchAll(/\.([\w-]+)/g)].map((m) => m[1])))
}
const WURZELN = Object.fromEntries(RECIPE_IDS.map((id) => {
  const el = rohesRecipe(id).anatomy?.root?.element || ''
  const m = /^\.([a-z0-9-]+)$/.exec(String(el).trim())
  return [id, m ? m[1] : null]
}).filter(([, k]) => k))

function enthaelt (id, gesehen = new Set()) {
  for (const k of rohesRecipe(id).komposition || []) {
    if (k.art !== 'enthaelt' || gesehen.has(k.recipe)) continue
    gesehen.add(k.recipe)
    enthaelt(k.recipe, gesehen)
  }
  return gesehen
}

// Recipe-Modifier und Markup-Klassen der Website ohne Regel in styles.css —
// zur Entscheidung gemeldet (Bericht Block Inhalte). Faellt eine weg, weil
// das SCSS sie bekommt, schlaegt der letzte Test hier an: Liste kuerzen.
const OHNE_SCSS = {
  accordion: ['nc-accordion--nested', 'nc-accordion--selection', 'nc-accordion--sticky', 'nc-accordion__trigger-text', 'nc-accordion__trigger-prefix', 'nc-accordion__trigger-suffix', 'nc-accordion__footer'],
  // Merkmal-Modifier ohne eigene Regel: die Gestaltung kommt aus den
  // Elementen (Sortierknopf, Auswahl- und Aufklapp-Zelle) — kein Befund
  'data-table': ['nc-data-table--sortable', 'nc-data-table--selectable', 'nc-data-table--expandable']
}

describe('Inhalte-Block aus dem Recipe', () => {
  const bekannt = dsKlassen()

  for (const id of BLOCK) {
    describe(id, () => {
      it('keine Sonderfall-Arena, jede Zelle jedes Specimens aus der Vorlage (beide Ansichten)', () => {
        expect(hasArena(id)).toBe(false)
        expect(arenaQuelle(id)).toBe('recipe')
        expect(vorlageFuer(id)).toBeTypeOf('function')
        for (const optionen of [{}, { ausprobieren: true }]) {
          const z = zellen(id, null, optionen)
          expect(new Set(z.map((c) => c.quelle))).toEqual(new Set(['vorlage']))
          expect(z.filter((c) => c.fehler)).toEqual([])
          const recipe = normalisiereRecipe(rohesRecipe(id))
          expect(new Set(z.map((c) => c.specimen.id))).toEqual(new Set(recipe.specimens.map((s) => s.id)))
        }
      })

      it('Recipe, Spec und Registry zeigen auf die RecipeArena', () => {
        const ziel = 'apps/theme-configurator/src/components/laboratory/RecipeArena.vue'
        expect(rohesRecipe(id).meta.pipeline.arena).toBe(ziel)
        const spec = readFileSync(resolve(WURZEL, `specs/${id}.spec.json`), 'utf8')
        expect(spec).toContain(ziel)
        expect(spec).not.toMatch(/laboratory\/(?!Recipe)\w+Arena\.vue/)
      })

      it('echtes DS-Element mit Basisklasse, nur Klassen aus styles.css bzw. der Anatomie', () => {
        const anatomie = anatomieKlassen(id)
        const ohne = new Set(OHNE_SCSS[id] || [])
        for (const z of beideModi(id)) {
          const d = dom(z.html)
          expect(d.querySelector(`.${WURZELN[id]}`), `${z.specimen.id}/${z.id}`).not.toBeNull()
          for (const el of d.querySelectorAll('[class]')) {
            for (const k of el.classList) {
              if (/^(nc|fnd|u|o)-/.test(k)) expect(bekannt.has(k) || anatomie.has(k) || ohne.has(k), `${id}/${z.specimen.id}: Klasse ${k} fehlt in styles.css`).toBe(true)
              if (/^ra-/.test(k)) expect(el.className, `${id}: Arena-Klasse ${k} an einem DS-Element`).not.toMatch(/(^|\s)(nc|fnd)-/)
            }
          }
        }
      })

      it('keine Inline-Gestaltung (nur Spaltenbreiten im colgroup), keine fremden Zustandsklassen', () => {
        for (const z of beideModi(id)) {
          const d = dom(z.html)
          for (const el of d.querySelectorAll('[style]')) {
            expect(el.tagName === 'COL' && /^width: \d+px$/.test(el.getAttribute('style')), `${id}/${z.specimen.id}: ${el.outerHTML.slice(0, 120)}`).toBe(true)
          }
          expect(d.querySelector('.is-active, .is-open, .is-selected, .is-disabled, .is-loading, [data-state]'), `${id}/${z.specimen.id}`).toBeNull()
        }
      })

      it('andere Bauteile sind erklaert (komposition oder composes)', () => {
        const erklaert = enthaelt(id)
        for (const z of beideModi(id)) {
          const klassen = new Set([...dom(z.html).querySelectorAll('[class]')].flatMap((el) => [...el.classList]))
          const composes = new Set((z.specimen.composes || []).flatMap((c) => (WURZELN[c] ? [c, ...enthaelt(c)] : [])))
          for (const [anderes, k] of Object.entries(WURZELN)) {
            if (anderes === id || !klassen.has(k)) continue
            expect(erklaert.has(anderes) || composes.has(anderes), `${id}/${z.specimen.id} enthaelt ${anderes}`).toBe(true)
          }
        }
      })

      it('ids eindeutig (auch im Split-Modus), Knoepfe mit type und Namen, Symbole aria-hidden', () => {
        for (const z of beideModi(id)) {
          const d = dom(z.html + fuerWeiteresThema(z.html, '-t2'))
          const ids = [...d.querySelectorAll('[id]')].map((e) => e.id)
          expect(new Set(ids).size, `${id}/${z.specimen.id}`).toBe(ids.length)
          for (const k of d.querySelectorAll('button')) {
            expect(k.getAttribute('type'), `${id}/${z.specimen.id}`).toBe('button')
            expect((k.getAttribute('aria-label') || k.textContent).trim(), `${id}/${z.specimen.id}: Knopf ohne Namen`).not.toBe('')
          }
          for (const s of d.querySelectorAll('svg:not([role="img"])')) expect(s.closest('[aria-hidden="true"]'), `${id}/${z.specimen.id}: Symbol ohne aria-hidden`).not.toBeNull()
          for (const f of d.querySelectorAll('input:not([type="hidden"])')) {
            const name = f.getAttribute('aria-label') || f.closest('label')?.textContent.trim() || (f.id && d.querySelector(`label[for="${f.id}"]`))
            expect(name, `${id}/${z.specimen.id}: Feld ohne Namen`).toBeTruthy()
          }
        }
      })
    })
  }

  it('Verhalten: nur das Akkordeon (Recipe keyboard/events), Karte und Datentabelle ohne', () => {
    expect(BLOCK.filter((id) => MIT_VERHALTEN.includes(id))).toEqual(['accordion'])
    for (const id of ['card', 'data-table']) {
      const r = rohesRecipe(id)
      expect(r.keyboard, id).toBeUndefined()
      expect(r.events, id).toBeUndefined()
    }
    const VERSION = { card: '3.2.0', accordion: '3.1.0', 'data-table': '2.2.0', 'compare-table': '2.0.1' }
    for (const [id, v] of Object.entries(VERSION)) expect(rohesRecipe(id).meta.version, id).toBe(v)
  })

  it('die vier Vue-Arenen sind geloescht, die Registry kennt sie nicht mehr', () => {
    const registry = readFileSync(resolve(DATA, 'component-registry.json'), 'utf8')
    for (const name of VUE_ARENEN) {
      expect(existsSync(resolve(WURZEL, `apps/theme-configurator/src/components/laboratory/${name}.vue`)), name).toBe(false)
      expect(registry, name).not.toContain(`${name}.vue`)
    }
  })

  it('Sektion „Table": kein eigenes Recipe, Arena von compare-table (gleiche Wurzel, --nc-table-*-Tokens)', () => {
    expect(RECIPE_IDS).not.toContain('table')
    expect(hasArena('table')).toBe(false)
    expect(arenaQuelle('table')).toBe('recipe')
    expect(arenaRecipe('table')).toBe('compare-table')
    expect(arenaRecipe('card')).toBe('card')
    const r = rohesRecipe('compare-table')
    expect(r.anatomy.root.element).toBe('.nc-compare-table')
    expect(r.meta.pipeline.scss).toEqual(['scss/scss/05-atoms/_table.scss'])
    expect(r.meta.pipeline.arena).toBe('apps/theme-configurator/src/components/laboratory/RecipeArena.vue')
    expect(existsSync(resolve(WURZEL, r.meta.pipeline.story))).toBe(true)
    const tokens = Object.values(r.styling.tokenGroups).flatMap((g) => g.tokens)
    expect(tokens.filter((t) => t.startsWith('nc-table-')).length).toBeGreaterThan(20)
    expect(vorlageFuer('compare-table')).toBeTypeOf('function')
  })

  it('dunkle Vorschau: Tokens mit Kurzpraefix (--nc-dt-*, --nc-table-*) werden im Vorschau-Bereich neu gebunden', () => {
    const stil = (decl) => Object.assign(Object.keys(decl), { getPropertyValue: (n) => decl[n] })
    const sheets = [{ cssRules: [{ selectorText: ':root', style: stil({ '--nc-dt-body-bg': 'var(--fnd-color-background-base)', '--nc-table-bg': 'var(--fnd-color-background-base)' }) }] }]
    const state = { themes: {}, componentOverrides: {} }
    expect(vorschauVariablen({ id: 'data-table', modus: 'dark', state, sheets })['--nc-dt-body-bg']).toBe('var(--fnd-color-background-base)')
    expect(vorschauVariablen({ id: 'compare-table', modus: 'dark', state, sheets })['--nc-table-bg']).toBe('var(--fnd-color-background-base)')
  })

  it('Ausnahmen ohne SCSS sind noch noetig (Liste kuerzen, sobald das SCSS sie kennt)', () => {
    for (const [id, liste] of Object.entries(OHNE_SCSS)) {
      for (const k of liste) expect(bekannt.has(k), `${id}: ${k} steht jetzt in styles.css`).toBe(false)
    }
  })
})

describe('Inhalte-Block: Zustände und Inhalte', () => {
  it('accordion: Markup wie auf der Website (details/summary, trigger-body, Chevron aria-hidden, content-inner > text)', () => {
    const d = zelle('accordion', 'faq-pattern', 'Standard')
    const eintraege = d.querySelectorAll('.nc-accordion > details.nc-accordion__item')
    expect(eintraege.length).toBe(6)
    for (const e of eintraege) {
      expect(e.querySelector(':scope > summary.nc-accordion__trigger > .nc-accordion__trigger-body > .nc-accordion__trigger-text')).not.toBeNull()
      expect(e.querySelector('.nc-accordion__icon').getAttribute('aria-hidden')).toBe('true')
      expect(e.querySelector(':scope > .nc-accordion__content > .nc-accordion__content-inner > .nc-accordion__text')).not.toBeNull()
    }
    expect(d.querySelector('.nc-accordion__list')).not.toBeNull()
    expect(d.querySelector('.nc-accordion__actions > .nc-button')).not.toBeNull()
  })

  it('accordion: Zustand am ersten Eintrag — offen, gesperrt (aria-disabled am Ausloeser), hover/focus nur echt', () => {
    expect(zelle('accordion', 'all-states', 'Standard').querySelector('details[open]')).toBeNull()
    const offen = zelle('accordion', 'all-states', 'Geöffnet').querySelectorAll('details')
    expect(offen[0].open).toBe(true)
    expect(offen[1].open).toBe(false)
    const gesperrt = zelle('accordion', 'all-states', 'Deaktiviert')
    expect(gesperrt.querySelector('details:first-child > summary').getAttribute('aria-disabled')).toBe('true')
    expect(gesperrt.querySelectorAll('[aria-disabled]').length).toBe(1)
    expect(gesperrt.querySelector('.nc-accordion').hasAttribute('aria-disabled')).toBe(false)
    expect(zelle('accordion', 'all-states', 'Hover *').querySelector('summary[data-zustand="hover"]')).not.toBeNull()
  })

  it('accordion: Varianten und Dichte als Modifier an der Liste, Medium nach media-layout, einzeln per data-neo-accordion + name', () => {
    for (const z of zellen('accordion', 'variant-comparison')) {
      const v = z.axisValues.variant
      const liste = dom(z.html).querySelector('.nc-accordion')
      if (v !== 'default') expect(liste.classList.contains(`nc-accordion--${v}`), v).toBe(true)
    }
    expect(zelle('accordion', 'density-comparison', 'compact · Geöffnet').querySelector('.nc-accordion--compact')).not.toBeNull()
    expect(zelle('accordion', 'media-layouts', 'top · Geöffnet').querySelector('.nc-accordion--media-top details[open] .nc-accordion__media img[alt]')).not.toBeNull()
    expect(zelle('accordion', 'media-layouts', 'side · Geöffnet').querySelector('.nc-accordion--media-side .nc-accordion__media')).not.toBeNull()
    const einzeln = zelle('accordion', 'ghost-compact', 'Standard')
    expect(einzeln.querySelector('.nc-accordion').dataset.neoAccordion).toBe('einzeln')
    expect(new Set([...einzeln.querySelectorAll('details')].map((e) => e.getAttribute('name'))).size).toBe(1)
    expect(zelle('accordion', 'faq-pattern', 'Standard').querySelector('[data-neo-accordion]')).toBeNull()
  })

  it('accordion: Kompositionen — zweite Ebene, Checkbox im Praefix (gewaehlt = angehakt), Badge + Knopf im Suffix, Fuss', () => {
    expect(zelle('accordion', 'nested-hierarchy', 'Geöffnet').querySelector('.nc-accordion__content-inner > .nc-accordion .nc-accordion__item')).not.toBeNull()
    expect(zelle('accordion', 'selection-checkable', 'Standard').querySelector('.nc-accordion__trigger-prefix .nc-checkbox__input:checked')).toBeNull()
    expect(zelle('accordion', 'selection-checkable', 'Ausgewählt').querySelector('details:first-child .nc-accordion__trigger-prefix .nc-checkbox__input:checked')).not.toBeNull()
    const suffix = zelle('accordion', 'actionable-header', 'Standard').querySelector('.nc-accordion__trigger-suffix')
    expect(suffix.querySelector('.nc-badge')).not.toBeNull()
    expect(suffix.querySelector('button.nc-button').getAttribute('aria-label')).toBe('Bearbeiten')
    expect(zelle('accordion', 'separated-with-footer', 'Geöffnet').querySelector('.nc-accordion--separated .nc-accordion__footer .nc-button')).not.toBeNull()
  })

  it('card: Wurzel-Element nach Verhalten (article, a, label + Feld, details), Website-Markup der Link-Karte', () => {
    expect(zelle('card', 'informational', 'Standard').querySelector('article.nc-card')).not.toBeNull()
    const nav = zelle('card', 'navigational', 'Standard')
    const link = nav.querySelector('a.nc-card.nc-card--navigational')
    expect(link.querySelector('.nc-card__content > .nc-card__kicker + .nc-card__title')).not.toBeNull()
    expect(link.querySelector('.nc-card__footer > .nc-card__footer-label + .nc-card__footer-icon')).not.toBeNull()
    expect(nav.querySelector('article.nc-card .nc-card__title > a.nc-card__title-link')).not.toBeNull()
    expect(nav.querySelector('article.nc-card--navigational')).toBeNull()
    const wahl = zelle('card', 'selectable', 'Standard')
    expect(wahl.querySelector('label.nc-card--selectable > input.nc-card__input[type="radio"]')).not.toBeNull()
    expect(wahl.querySelector('label.nc-card--selectable > input.nc-card__input[type="checkbox"]')).not.toBeNull()
    expect(zelle('card', 'expandable', 'Standard').querySelector('details.nc-card--expandable > summary.nc-card__summary')).not.toBeNull()
  })

  it('card: Zustaende — gewaehlt = angehaktes Feld, offen = [open], gesperrt (aria-disabled bzw. disabled), Platzhalter', () => {
    expect(zelle('card', 'selectable', 'Standard').querySelector('.nc-card__input:checked')).toBeNull()
    expect(zelle('card', 'selectable', 'Ausgewählt').querySelectorAll('.nc-card__input:checked').length).toBe(2)
    expect(zelle('card', 'expandable', 'Geöffnet').querySelector('details.nc-card[open]')).not.toBeNull()
    expect(zelle('card', 'disabled-states', 'navigational · Deaktiviert').querySelector('a.nc-card[aria-disabled="true"]')).not.toBeNull()
    const wahl = zelle('card', 'disabled-states', 'selectable · Deaktiviert')
    expect(wahl.querySelector('.nc-card__input:disabled')).not.toBeNull()
    expect(wahl.querySelector('label[aria-disabled]')).toBeNull()
    for (const z of zellen('card', 'skeleton')) {
      const k = dom(z.html).querySelector('.nc-card')
      expect(k.classList.contains('nc-card--skeleton')).toBe(true)
      expect(k.getAttribute('aria-hidden')).toBe('true')
    }
  })

  it('card: Status mit Namen (Farbe nicht einziges Signal), Muster mit Medium, Section-Flaechen, Anwendungen', () => {
    for (const z of zellen('card', 'status-levels')) {
      const k = dom(z.html).querySelector('.nc-card--status')
      expect(k.classList.contains(`nc-card--status-${z.axisValues.statusLevel}`)).toBe(true)
      expect(k.getAttribute('aria-label')).toMatch(/^Status: /)
    }
    expect(zelle('card', 'preview-patterns', 'featured').querySelector('a.nc-card--preview.nc-card--featured > .nc-card__media > img')).not.toBeNull()
    expect(zelle('card', 'summary-patterns', 'static').querySelector('article.nc-card--summary .nc-card__media img[alt="Anna Müller"]')).not.toBeNull()
    const flaechen = zelle('card', 'surface-adaptation', 'Standard')
    expect([...flaechen.querySelectorAll('.section')].map((s) => s.className)).toEqual([
      'section ra-flaechen-probe', 'section section--muted ra-flaechen-probe', 'section section--accent ra-flaechen-probe'
    ])
    const muster = zelle('card', 'anwendungen', 'Standard')
    expect(muster.querySelectorAll('.nc-card').length).toBe(5)
    expect(muster.querySelector('a.nc-card--action.nc-card--navigational .nc-card__icon')).not.toBeNull()
    expect(muster.querySelector('a.nc-card[aria-label]:not(:has(.nc-card__content))')).not.toBeNull()
  })

  it('data-table: Aufbau wie in der Doku (scroll-container > table mit caption, thead/tbody, Spaltentypen)', () => {
    const d = zelle('data-table', 'basic', 'Standard')
    const t = d.querySelector('.nc-data-table > .nc-data-table__scroll-container > table.nc-data-table__table')
    expect(t.querySelector('caption.u-sr-only')).not.toBeNull()
    expect(t.querySelectorAll('thead.nc-data-table__thead th.nc-data-table__th[scope="col"]').length).toBe(4)
    expect(t.querySelectorAll('tbody.nc-data-table__tbody > tr.nc-data-table__row').length).toBe(4)
    expect(t.querySelector('.nc-data-table__td--user .nc-avatar')).not.toBeNull()
    expect(t.querySelector('.nc-data-table__td--status .nc-badge')).not.toBeNull()
    expect(t.querySelector('.nc-data-table__td--date time[datetime]')).not.toBeNull()
  })

  it('data-table: Sortierung (aria-sort, eine Spalte aufsteigend), Auswahl (Checkbox/Radio), aufklappen (aria-expanded + aria-controls)', () => {
    const s = zelle('data-table', 'sortable', 'Standard')
    expect([...s.querySelectorAll('th[aria-sort]')].map((th) => th.getAttribute('aria-sort'))).toEqual(['ascending', 'none', 'none', 'none'])
    expect(s.querySelectorAll('th .nc-data-table__sort-button').length).toBe(4)
    const r = zelle('data-table', 'radio-selection', 'Standard')
    expect(r.querySelectorAll('.nc-data-table__radio-cell .nc-radio__input').length).toBe(4)
    expect(r.querySelector('tr[aria-selected="true"] .nc-radio__input:checked')).not.toBeNull()
    const e = zelle('data-table', 'expandable', 'Standard')
    const knopf = e.querySelector('.nc-data-table__expand-button[aria-expanded="true"]')
    expect(e.querySelector(`#${knopf.getAttribute('aria-controls')}`).hidden).toBe(false)
    const zu = e.querySelector('.nc-data-table__expand-button[aria-expanded="false"]')
    expect(e.querySelector(`#${zu.getAttribute('aria-controls')}`).hidden).toBe(true)
  })

  it('data-table: Zustaende — Standard ohne Auswahl, gewaehlt mit Batch-Leiste, laden, Fehler, leer', () => {
    const standard = zelle('data-table', 'states', 'Standard')
    expect(standard.querySelector('.nc-data-table__batch-bar').hidden).toBe(true)
    expect(standard.querySelector('tr[aria-selected="true"]')).toBeNull()
    const gewaehlt = zelle('data-table', 'states', 'Ausgewählt')
    expect(gewaehlt.querySelector('.nc-data-table__batch-bar').hidden).toBe(false)
    expect(gewaehlt.querySelector('.nc-data-table__batch-bar').getAttribute('aria-live')).toBe('polite')
    expect(gewaehlt.querySelectorAll('tr[aria-selected="true"] .nc-checkbox__input:checked').length).toBe(2)
    const fehler = zelle('data-table', 'states', 'Fehler')
    expect(fehler.querySelector('.nc-data-table--error .nc-data-table__error[role="alert"]')).not.toBeNull()
    expect(zelle('data-table', 'states', 'Leer').querySelector('.nc-data-table__empty .nc-data-table__empty-title')).not.toBeNull()
    const laden = zelle('data-table', 'skeleton-variants', 'Lädt')
    expect(laden.querySelector('.nc-data-table--loading[aria-busy="true"]')).not.toBeNull()
    expect(laden.querySelectorAll('tr.nc-data-table__skeleton-row[aria-hidden="true"]').length).toBe(4)
  })

  it('data-table: Varianten und Kompositionen — Dichte, card/glass/wrap, Stapel mit data-label, feste Spalten, alles zusammen', () => {
    for (const z of zellen('data-table', 'density-variants')) {
      const t = dom(z.html).querySelector('.nc-data-table')
      expect(t.classList.contains('nc-data-table--striped')).toBe(true)
      if (z.axisValues.density !== 'default') expect(t.classList.contains(`nc-data-table--${z.axisValues.density}`)).toBe(true)
    }
    expect(zelle('data-table', 'card-variant', 'Standard').querySelector('.nc-data-table--card')).not.toBeNull()
    expect(zelle('data-table', 'glass-variant', 'Standard').querySelector('.nc-data-table--glass')).not.toBeNull()
    expect(zelle('data-table', 'content-wrap', 'Standard').querySelector('.nc-data-table--wrap')).not.toBeNull()
    const stapel = zelle('data-table', 'stacked-layout', 'Standard')
    expect(stapel.querySelector('.nc-data-table--stacked')).not.toBeNull()
    expect([...stapel.querySelectorAll('tbody td')].every((td) => td.dataset.label)).toBe(true)
    // Container Query (Entscheidung 06.10.2026): schmale Zelle der Arena
    expect(stapel.querySelector('.ra-schmal > .nc-data-table--stacked')).not.toBeNull()
    const fest = zelle('data-table', 'sticky-columns', 'Standard')
    expect(fest.querySelector('.nc-data-table--sticky-col-start.nc-data-table--sticky-col-end colgroup')).not.toBeNull()
    expect(fest.querySelectorAll('.nc-data-table__action-menu[aria-label]').length).toBe(4)
    const alles = zelle('data-table', 'full-featured', 'Standard')
    for (const sel of ['.nc-data-table__title-bar .nc-data-table__title', '.nc-data-table__toolbar[role="toolbar"] .nc-data-table__search .nc-input', '.nc-data-table__batch-bar:not([hidden])', 'th[aria-sort="ascending"]', '.nc-data-table__pagination .nc-select']) {
      expect(alles.querySelector(sel), sel).not.toBeNull()
    }
  })

  it('styles.css: Wrap-Modus laesst <td> eine Tabellenzelle (kein display:-webkit-box)', () => {
    const css = readFileSync(STYLES, 'utf8')
    const regel = css.match(/\.nc-data-table--wrap \.nc-data-table__td\{([^}]*)\}/)
    expect(regel).not.toBeNull()
    expect(regel[1]).toContain('white-space:normal')
    expect(regel[1]).not.toMatch(/display/)
  })
})

describe('Datentabelle: Stapel-Layout per Container Query (Entscheidung 06.10.2026)', () => {
  it('styles.css: --stacked ist Container (data-table), Karten-Ansicht per @container statt @media', () => {
    const css = readFileSync(STYLES, 'utf8')
    expect(css).toMatch(/\.nc-data-table--stacked\{container-type:inline-size;container-name:data-table\}/)
    const cq = css.match(/@container data-table \(max-width: ?(\d+)px\)\{(.*?\}\})/)
    expect(cq, '@container data-table fehlt').not.toBeNull()
    expect(Number(cq[1])).toBe(600)
    expect(cq[2]).toContain('.nc-data-table--stacked .nc-data-table__thead')
    expect(cq[2]).toContain('.nc-data-table--stacked .nc-data-table__row{display:flex')
    // keine Media Query mehr fuer das Stapel-Layout
    for (const m of css.matchAll(/@media[^{]*\{((?:[^{}]*\{[^{}]*\})*)\}/g)) {
      expect(m[1], m[0].slice(0, 80)).not.toContain('.nc-data-table--stacked')
    }
    // nur der Modifier macht die Wurzel zum Container
    expect(css).not.toMatch(/\.nc-data-table\{[^}]*container-type/)
  })
})

describe('Datentabelle: Batch-Leiste setzt Knopffarben (Entscheidung 06.10.2026)', () => {
  it('styles.css: Override-Stufe --mod-button-* fuer ghost/secondary/outline aus --nc-dt-batch-color', () => {
    const css = readFileSync(STYLES, 'utf8')
    const regel = css.match(/\.nc-data-table__batch-bar\{([^}]*)\}/)
    expect(regel).not.toBeNull()
    for (const v of ['ghost', 'secondary', 'outline']) {
      expect(regel[1]).toContain(`--mod-button-${v}-color: var(--_dt-batch-knopf)`)
      expect(regel[1]).toContain(`--mod-button-${v}-bg-hover: var(--_dt-batch-knopf-hover)`)
      expect(regel[1]).toContain(`--mod-button-${v}-bg-active: var(--_dt-batch-knopf-active)`)
    }
    expect(regel[1]).toMatch(/--_dt-batch-knopf: ?var\(--mod-dt-batch-color, ?var\(--nc-dt-batch-color\)\)/)
  })
})

describe('Inhalte-Block: Ausprobieren', () => {
  it('accordion: lebendige Instanz startet zu, ohne festen Zustand (kein open, aria-disabled, data-zustand)', () => {
    const recipe = normalisiereRecipe(rohesRecipe('accordion'))
    for (const sp of recipe.specimens) {
      const d = lebendig('accordion', sp.id)
      expect(d.querySelector('details[open]'), sp.id).toBeNull()
      expect(d.querySelector('[aria-disabled], [data-zustand], .nc-checkbox__input:checked'), sp.id).toBeNull()
    }
  })
})

describe('Inhalte-Block in der RecipeArena', () => {
  beforeEach(() => setActivePinia(createPinia()))
  afterEach(() => { document.body.innerHTML = '' })

  async function geladen (props) {
    const w = mount(RecipeArena, { props, attachTo: document.body })
    for (const bis = Date.now() + 8000; !w.find('.ra-specimen').exists() && Date.now() < bis;) {
      await flushPromises()
      await new Promise((r) => setTimeout(r, 10))
    }
    return w
  }

  it('accordion: alle Specimens aus der Vorlage, Umschalter „Ausprobieren", danach gebunden', async () => {
    const w = await geladen({ componentId: 'accordion' })
    const recipe = normalisiereRecipe(rohesRecipe('accordion'))
    expect(w.findAll('.ra-specimen').length).toBe(recipe.specimens.length)
    expect(w.findAll('.ra-cell[data-quelle="heuristik"], .ra-cell[data-quelle="fehler"]')).toHaveLength(0)
    expect(w.find('[data-neo-behavior]').exists()).toBe(false)
    await w.findAll('.ra-modus__knopf')[1].trigger('click')
    await flushPromises()
    await new Promise((r) => setTimeout(r, 0))
    expect(w.find('[data-neo-behavior~="accordion"]').exists()).toBe(true)
    expect(w.findAll('.ra-cell').length).toBe(w.findAll('.ra-specimen').length)
    w.unmount()
  })

  for (const id of ['card', 'data-table']) {
    it(`${id}: alle Specimens aus der Vorlage, nur „Zustände"`, async () => {
      const w = await geladen({ componentId: id })
      expect(w.findAll('.ra-specimen').length).toBe(normalisiereRecipe(rohesRecipe(id)).specimens.length)
      expect(w.findAll('.ra-cell[data-quelle="heuristik"], .ra-cell[data-quelle="fehler"]')).toHaveLength(0)
      expect(w.find('.ra-modus').exists()).toBe(false)
      w.unmount()
    })
  }

  it('Sektion „Table": RecipeArena von compare-table, Hervorhebung ueber die Sektion (--nc-table-*)', async () => {
    const w = await geladen({ componentId: arenaRecipe('table'), sektion: 'table' })
    expect(w.find('.recipe-arena').attributes('data-component-id')).toBe('compare-table')
    expect(w.find('.nc-compare-table').exists()).toBe(true)
    w.unmount()
  })
})
