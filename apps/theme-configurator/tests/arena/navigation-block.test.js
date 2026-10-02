/**
 * Plan v3, Phase 3 (Block Navigation): Breadcrumb, Pagination, Navigation,
 * Navigationsmenue, Sidebar, Treeview und Toolbar kommen aus dem Recipe
 * (Vorlagen in src/arena-templates) statt aus handgeschriebenen Vue-Arenen.
 * Geprueft wird:
 *   - keine Sonderfall-Arena, jede Zelle jedes Specimens aus der Vorlage
 *   - echtes DS-Markup: Basisklasse, nur Klassen aus styles.css (oder der
 *     Recipe-Anatomie), keine Inline-Gestaltung (erlaubt nur der
 *     DS-Instanzwert --_level des Treeviews), keine fremden Zustandsklassen
 *   - Zustaende je Specimen (offene Dropdowns/Viewports, aktuelle Seite,
 *     Rand-Zustaende, scrolled/hidden, Auswahl, Checkbox-Modus, Drag & Drop)
 *   - Verhalten (Entscheidung 02.10.2026): breadcrumb, treeview,
 *     navigation-menu, toolbar und sidebar geben keyboard/events vor und
 *     haben ein Behavior — die Arena bietet „Ausprobieren" (Markup mit
 *     m.ausprobieren, geprueft wie „Zustände"); pagination und navigation
 *     zeigen weiter nur „Zustände"
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { mount, flushPromises } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import { MIT_VERHALTEN } from 'neo-behaviors'
import RecipeArena from '../../src/components/laboratory/RecipeArena.vue'
import { vorlageFuer, einrichtungFuer } from '../../src/arena-templates/index.js'
import { normalisiereRecipe, specimenAnsicht, fuerWeiteresThema } from '../../src/lib/recipe-arena.js'
import { hasArena, arenaQuelle } from '../../src/composables/useArenaResolver.js'
import { RECIPE_IDS, WURZEL, rohesRecipe } from './_recipes.js'

const BLOCK = ['breadcrumb', 'pagination', 'navigation', 'navigation-menu', 'sidebar', 'treeview', 'toolbar']
// Mit Verhalten in neo-behaviors (keyboard/events im Recipe, „Ausprobieren")
const MIT_VERHALTEN_IM_BLOCK = ['breadcrumb']

function zellen (id, specimenId, optionen = {}) {
  const recipe = normalisiereRecipe(rohesRecipe(id))
  return recipe.specimens
    .filter((sp) => !specimenId || sp.id === specimenId)
    .flatMap((sp) => specimenAnsicht(sp, recipe, id, vorlageFuer(id), optionen).zeilen
      .flatMap((z) => z.zellen.map((c) => ({ ...c, specimen: sp }))))
}

/** Alle Zellen in „Zustände" und — bei Bauteilen mit Verhalten — in „Ausprobieren". */
const beideModi = (id) => [...zellen(id), ...(MIT_VERHALTEN_IM_BLOCK.includes(id) ? zellen(id, null, { ausprobieren: true }) : [])]

function dom (html) {
  const d = document.createElement('div')
  d.innerHTML = html
  return d
}

const alle = (id, sp) => zellen(id, sp).map((z) => dom(z.html))

const STYLES = resolve(WURZEL, 'styles.css')
function dsKlassen () {
  if (!existsSync(STYLES)) throw new Error('styles.css fehlt — im Wurzelordner `npm run build:css` ausfuehren')
  const css = readFileSync(STYLES, 'utf8')
  return new Set([...css.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)].map((m) => m[1]))
}

/**
 * Klassen aus der Recipe-Anatomie und den Achsen-Modifiern — auch ohne
 * eigene Regel im CSS (z. B. nc-navigation-menu__content--two-col: die
 * SCSS-Regel ist leer und faellt beim Kompilieren weg).
 */
function anatomieKlassen (id) {
  const r = rohesRecipe(id)
  const sel = [r.anatomy?.root?.element, ...(r.anatomy?.slots || []).map((s) => s.element)].filter(Boolean)
  const modifier = Object.values(r.axes || {}).flatMap((a) => Object.values(a.values || {}).map((v) => v?.modifier)).filter(Boolean)
  return new Set([
    ...sel.flatMap((s) => [...String(s).matchAll(/\.([\w-]+)/g)].map((m) => m[1])),
    ...modifier.map((k) => String(k).replace(/^\./, ''))
  ])
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

// Andere Bauteile, die weder komposition noch composes nennt — begruendet.
// navigation-orchestration teilt die Wurzel nc-header mit navigation.
const ERLAUBT = {
  navigation: { button: 'CTA in __actions (docs/navigation-docs.html)', 'navigation-orchestration': 'teilt die Wurzel nc-header' },
  'navigation-menu': { button: 'CTA in __actions der Kopfzeile (composition-header, site.js)', 'navigation-orchestration': 'Kopfzeile nc-header (composition-header)' }
}

// Zustandsklassen, die das DS fuer das Bauteil kennt (SCSS) — alle anderen
// is-* sind fremd.
const DS_ZUSTAENDE = {
  breadcrumb: ['is-open'],
  navigation: ['is-scrolled', 'is-hidden'],
  toolbar: ['is-scrolled']
}

describe('Navigation-Block aus dem Recipe', () => {
  const bekannt = dsKlassen()

  for (const id of BLOCK) {
    describe(id, () => {
      it('keine Sonderfall-Arena, jede Zelle jedes Specimens aus der Vorlage', () => {
        expect(hasArena(id)).toBe(false)
        expect(arenaQuelle(id)).toBe('recipe')
        expect(vorlageFuer(id)).toBeTypeOf('function')
        const z = zellen(id)
        expect(new Set(z.map((c) => c.quelle))).toEqual(new Set(['vorlage']))
        expect(z.filter((c) => c.fehler)).toEqual([])
        const recipe = normalisiereRecipe(rohesRecipe(id))
        expect(new Set(z.map((c) => c.specimen.id))).toEqual(new Set(recipe.specimens.map((s) => s.id)))
      })

      it('Recipe, Spec und Registry zeigen auf die RecipeArena', () => {
        const ziel = 'apps/theme-configurator/src/components/laboratory/RecipeArena.vue'
        expect(rohesRecipe(id).meta.pipeline.arena).toBe(ziel)
        const spec = JSON.parse(readFileSync(resolve(WURZEL, `specs/${id}.spec.json`), 'utf8'))
        expect(JSON.stringify(spec)).toContain(ziel)
        expect(JSON.stringify(spec)).not.toMatch(/laboratory\/(?!Recipe)\w+Arena\.vue/)
      })

      it('echtes DS-Element mit Basisklasse, nur Klassen aus styles.css bzw. der Anatomie', () => {
        const anatomie = anatomieKlassen(id)
        for (const z of beideModi(id)) {
          const d = dom(z.html)
          expect(d.querySelector(`.${WURZELN[id]}`), `${z.specimen.id}/${z.id}`).not.toBeNull()
          for (const el of d.querySelectorAll('[class]')) {
            for (const k of el.classList) {
              if (/^(nc|fnd|u|o)-/.test(k)) expect(bekannt.has(k) || anatomie.has(k), `${id}: Klasse ${k} fehlt in styles.css`).toBe(true)
              if (/^ra-/.test(k)) expect(el.className, `${id}: Arena-Klasse ${k} an einem DS-Element`).not.toMatch(/(^|\s)(nc|fnd)-/)
            }
          }
        }
      })

      it('keine Inline-Gestaltung, keine fremden Zustandsklassen', () => {
        for (const z of beideModi(id)) {
          const d = dom(z.html)
          for (const el of d.querySelectorAll('[style]')) {
            // einzig erlaubt: Einrueckung des Treeviews (DS-Instanzwert)
            expect(id === 'treeview' && /^--_level: \d+;$/.test(el.getAttribute('style')), `${id}/${z.specimen.id}: style="${el.getAttribute('style')}"`).toBe(true)
          }
          for (const el of d.querySelectorAll('[class*="is-"]')) {
            for (const k of [...el.classList].filter((c) => c.startsWith('is-'))) {
              expect(DS_ZUSTAENDE[id] || [], `${id}/${z.specimen.id}: ${k}`).toContain(k)
            }
          }
          expect(d.querySelector(`.${WURZELN[id]}--disabled`), `${id}/${z.specimen.id}`).toBeNull()
          if (id !== 'navigation-menu') expect(d.querySelector('[data-state]'), `${id}/${z.specimen.id}`).toBeNull()
        }
      })

      it('Kind-Modifier am Kind, nicht an der Wurzel', () => {
        for (const z of zellen(id)) {
          const w = dom(z.html).querySelector(`.${WURZELN[id]}`)
          for (const k of w.classList) expect(k.includes('__'), `${id}/${z.specimen.id}: ${k} an der Wurzel`).toBe(false)
        }
      })

      it('andere Bauteile sind erklaert (komposition, composes oder begruendet)', () => {
        const erklaert = enthaelt(id)
        for (const z of beideModi(id)) {
          const klassen = new Set([...dom(z.html).querySelectorAll('[class]')].flatMap((el) => [...el.classList]))
          const composes = new Set((z.specimen.composes || []).flatMap((c) => (WURZELN[c] ? [c, ...enthaelt(c)] : [])))
          for (const [anderes, k] of Object.entries(WURZELN)) {
            if (anderes === id || WURZELN[id] === k || !klassen.has(k)) continue
            const ok = erklaert.has(anderes) || composes.has(anderes) || ERLAUBT[id]?.[anderes]
            expect(ok, `${id}/${z.specimen.id} enthaelt ${anderes}`).toBeTruthy()
          }
        }
      })

      it('ids sind je Zelle eindeutig, Bezuege zeigen auf vorhandene Elemente, Landmarken beschriftet', () => {
        for (const z of beideModi(id)) {
          const d = dom(z.html)
          const ids = [...d.querySelectorAll('[id]')].map((e) => e.id)
          expect(new Set(ids).size, `${id}/${z.specimen.id}`).toBe(ids.length)
          for (const el of d.querySelectorAll('[aria-labelledby], [aria-describedby], [aria-controls], label[for]')) {
            for (const a of ['aria-labelledby', 'aria-describedby', 'aria-controls', 'for']) {
              for (const ref of (el.getAttribute(a) || '').split(/\s+/).filter(Boolean)) {
                expect(d.querySelector(`#${ref}`), `${id}/${z.specimen.id}: ${a}="${ref}"`).not.toBeNull()
              }
            }
          }
          for (const nav of d.querySelectorAll('nav, [role="toolbar"]')) expect(nav.getAttribute('aria-label'), `${id}/${z.specimen.id}`).toBeTruthy()
          // Knoepfe ausserhalb des Baums der Hilfstechnik (aria-hidden, z. B.
          // der Treeview-Toggle — der Eintrag selbst traegt aria-expanded)
          for (const knopf of d.querySelectorAll('button:not([aria-hidden="true"])')) {
            expect(knopf.getAttribute('type'), `${id}/${z.specimen.id}: Knopf ohne type`).toBe('button')
            expect((knopf.textContent.trim() || knopf.getAttribute('aria-label')), `${id}/${z.specimen.id}: Knopf ohne Namen`).toBeTruthy()
          }
        }
      })

      it('Split-Modus: zweites Thema bekommt eigene ids', () => {
        for (const z of beideModi(id)) {
          const d = dom(z.html + fuerWeiteresThema(z.html, '-t2'))
          const ids = [...d.querySelectorAll('[id]')].map((e) => e.id)
          expect(new Set(ids).size).toBe(ids.length)
        }
      })
    })
  }

  it('Kennzahl: alle sieben ohne Sonderfall', () => {
    expect(BLOCK.filter((id) => hasArena(id))).toEqual([])
  })

  it('Verhalten: keyboard/events im Recipe genau bei den Bauteilen mit Behavior', () => {
    for (const id of BLOCK) {
      const r = rohesRecipe(id)
      if (MIT_VERHALTEN_IM_BLOCK.includes(id)) {
        expect(Object.keys(r.keyboard || {}).length, id).toBeGreaterThan(0)
        expect(Object.keys(r.events || {}).length, id).toBeGreaterThan(0)
      } else {
        expect(r.keyboard, id).toBeUndefined()
        expect(r.events, id).toBeUndefined()
      }
    }
    expect(BLOCK.filter((id) => MIT_VERHALTEN.includes(id))).toEqual(MIT_VERHALTEN_IM_BLOCK)
  })
})

describe('Navigation-Block: Zustände und Inhalte', () => {
  it('breadcrumb: nav > ol, aktuelle Seite, Trenner aria-hidden, Lage der Trenner-Modifier', () => {
    for (const d of alle('breadcrumb')) {
      const nav = d.querySelector('nav.nc-breadcrumb[aria-label="Breadcrumb"]')
      expect(nav.querySelector(':scope > ol.nc-breadcrumb__list > li.nc-breadcrumb__item')).not.toBeNull()
      for (const t of nav.querySelectorAll('.nc-breadcrumb__separator')) expect(t.getAttribute('aria-hidden')).toBe('true')
    }
    for (const d of alle('breadcrumb').filter((x) => !x.querySelector('.nc-breadcrumb--back-link'))) {
      const seite = d.querySelectorAll('.nc-breadcrumb__page[aria-current="page"]')
      expect(seite.length).toBe(1)
      expect(seite[0].closest('li').nextElementSibling).toBeNull()
    }
    const trenner = alle('breadcrumb', 'separator-types').map((d) => d.querySelector('.nc-breadcrumb__separator'))
    expect(trenner.map((t) => t.className)).toEqual([
      'nc-breadcrumb__separator',
      'nc-breadcrumb__separator',
      'nc-breadcrumb__separator nc-breadcrumb__separator--dot',
      'nc-breadcrumb__separator nc-breadcrumb__separator--square',
      'nc-breadcrumb__separator nc-breadcrumb__separator--custom'
    ])
    expect(trenner[0].querySelector('svg')).not.toBeNull()
    expect(trenner[1].textContent).toBe('/')
    expect(alle('breadcrumb', 'sizes').map((d) => d.querySelector('nav').className)).toEqual(['nc-breadcrumb nc-breadcrumb--sm', 'nc-breadcrumb'])
    const [, hover] = alle('breadcrumb', 'ghost-appearance')
    expect(hover.querySelector('nav.nc-breadcrumb--ghost .nc-breadcrumb__link').dataset.zustand).toBe('hover')
    expect(alle('breadcrumb', 'home-icon')[0].querySelector('a.nc-breadcrumb__link[aria-label="Home"] > .nc-breadcrumb__home-icon > svg')).not.toBeNull()
    expect(alle('breadcrumb', 'single-level')[0].querySelectorAll('li').length).toBe(2)
    expect(alle('breadcrumb', 'long-path')[0].querySelectorAll('li').length).toBeGreaterThan(6)
    expect(alle('breadcrumb', 'long-path')[0].querySelector('.ra-feld > nav')).not.toBeNull()
  })

  it('breadcrumb: Ellipsis zu bzw. offen, Back-Link', () => {
    const zu = alle('breadcrumb', 'truncated')[0]
    const knopf = zu.querySelector('.nc-breadcrumb__ellipsis-wrap > button.nc-breadcrumb__ellipsis[aria-haspopup="true"]')
    expect(knopf.getAttribute('aria-expanded')).toBe('false')
    expect(knopf.getAttribute('aria-label')).toBe('Weitere Seiten anzeigen')
    expect(zu.querySelector('.nc-breadcrumb__dropdown').classList.contains('is-open')).toBe(false)
    const auf = alle('breadcrumb', 'truncated-dropdown')[0]
    expect(auf.querySelector('.nc-breadcrumb__ellipsis').getAttribute('aria-expanded')).toBe('true')
    const menue = auf.querySelector('ul.nc-breadcrumb__dropdown.is-open[role="menu"]')
    expect(menue.querySelectorAll(':scope > li[role="none"] > a.nc-breadcrumb__dropdown-item[role="menuitem"]').length).toBe(3)
    expect(auf.querySelector('.ra-anker > nav')).not.toBeNull()
    const zurueck = alle('breadcrumb', 'back-link')[0]
    expect(zurueck.querySelector('nav.nc-breadcrumb--back-link a.nc-breadcrumb__link[aria-label^="Zurück zu"] > .nc-breadcrumb__back-icon')).not.toBeNull()
    expect(zurueck.querySelectorAll('li').length).toBe(1)
  })

  it('pagination: Liste mit aktueller Seite, Auslassung, Prev/Next, Varianten', () => {
    const [d] = alle('pagination', 'default')
    const nav = d.querySelector('nav.nc-pagination[aria-label]')
    expect(nav.querySelector(':scope > button.nc-pagination__prev[aria-label] + ol.nc-pagination__list + button.nc-pagination__next[aria-label]')).not.toBeNull()
    expect(nav.querySelector('.nc-pagination__item[aria-current="page"]').textContent).toBe('5')
    expect(nav.querySelectorAll('.nc-pagination__ellipsis .u-sr-only').length).toBe(2)
    expect(nav.querySelector('[aria-disabled]')).toBeNull()
    expect(alle('pagination', 'appearance-comparison').map((x) => x.querySelector('nav').className)).toEqual(['nc-pagination', 'nc-pagination nc-pagination--pill', 'nc-pagination nc-pagination--outline', 'nc-pagination nc-pagination--minimal'])
    const minimal = alle('pagination', 'minimal')[0]
    expect(minimal.querySelector('.nc-pagination__list')).toBeNull()
    const info = minimal.querySelector('.nc-pagination__prev + .nc-pagination__info')
    expect(info.textContent).toMatch(/Seite 5 von 12/)
    expect(info.nextElementSibling.classList.contains('nc-pagination__next')).toBe(true)
    expect(alle('pagination', 'size-comparison').map((x) => x.querySelector('nav').className)).toEqual(['nc-pagination', 'nc-pagination nc-pagination--sm'])
    expect(alle('pagination', 'raised')[0].querySelector('nav.nc-pagination--raised')).not.toBeNull()
    expect(alle('pagination', 'with-indicator')[0].querySelector('nav.nc-pagination--with-indicator')).not.toBeNull()
    const sprung = alle('pagination', 'with-jumper')[0]
    const feld = sprung.querySelector('nav.nc-pagination--with-jumper input.nc-pagination__jumper[type="number"]')
    expect(sprung.querySelector(`label.u-sr-only[for="${feld.id}"]`)).not.toBeNull()
    expect(alle('pagination', 'alignment-variants').map((x) => x.querySelector('nav').className)).toEqual(['nc-pagination', 'nc-pagination nc-pagination--center', 'nc-pagination nc-pagination--end', 'nc-pagination nc-pagination--between'])
    expect(alle('pagination', 'alignment-variants').map((x) => !!x.querySelector('.ra-feld--breit'))).toEqual([false, true, true, true])
    expect(alle('pagination', 'pill-raised')[0].querySelector('nav').className).toBe('nc-pagination nc-pagination--center nc-pagination--pill nc-pagination--raised')
  })

  it('pagination: Rand-Zustaende — Prev auf der ersten, Next auf der letzten Seite aus', () => {
    const [erste, letzte] = alle('pagination', 'first-last-page')[0].querySelectorAll('nav.nc-pagination')
    expect(erste.querySelector('.nc-pagination__prev').getAttribute('aria-disabled')).toBe('true')
    expect(erste.querySelector('.nc-pagination__next').hasAttribute('aria-disabled')).toBe(false)
    expect(erste.querySelector('[aria-current="page"]').textContent).toBe('1')
    expect(letzte.querySelector('.nc-pagination__next').getAttribute('aria-disabled')).toBe('true')
    expect(letzte.querySelector('[aria-current="page"]').textContent).toBe('12')
    expect(erste.getAttribute('aria-label')).not.toBe(letzte.getAttribute('aria-label'))
  })

  it('navigation: nc-header > nc-nav > __inner mit Marke, Liste, Aktionen, Burger', () => {
    for (const d of alle('navigation')) {
      const inner = d.querySelector('.ra-kopf > header.nc-header > nav.nc-nav[aria-label] > .nc-nav__inner')
      expect(inner.querySelector(':scope > a.nc-brand + ul.nc-nav__list + .nc-nav__actions + button.nc-mobile-toggle')).not.toBeNull()
      expect(inner.querySelectorAll('.nc-nav__list > li.nc-nav__item > a.nc-nav__link').length).toBe(5)
      expect(inner.querySelectorAll('[aria-current="page"]').length).toBe(1)
    }
    expect(alle('navigation', 'emphasis-comparison').map((d) => d.querySelector('header').className)).toEqual(['nc-header', 'nc-header nc-header--transparent', 'nc-header nc-header--solid'])
    expect(alle('navigation', 'emphasis-comparison').map((d) => !!d.querySelector('.ra-kulisse'))).toEqual([false, true, false])
    expect(alle('navigation', 'alignment-comparison').map((d) => d.querySelector('nav').className)).toEqual(['nc-nav', 'nc-nav nc-nav--align-center', 'nc-nav nc-nav--align-right'])
    expect(alle('navigation', 'sticky-states').map((d) => d.querySelector('header').className)).toEqual(['nc-header', 'nc-header is-scrolled', 'nc-header is-hidden'])
    const landing = alle('navigation', 'landingpage-header')[0]
    expect(landing.querySelector('.ra-kulisse header.nc-header--transparent nav.nc-nav--align-center')).not.toBeNull()
  })

  it('navigation-menu: Ausloeser, Inhalte als Vorlage im Item, Viewport zu bzw. offen', () => {
    for (const z of zellen('navigation-menu')) {
      const d = dom(z.html)
      const offen = z.label.includes('Geöffnet')
      const nav = d.querySelector('nav.nc-navigation-menu[aria-label]')
      expect(nav.dataset.trigger).toBe(z.axisValues.trigger)
      expect(nav.querySelectorAll(':scope > ul.nc-navigation-menu__list[role="menubar"] > li.nc-navigation-menu__item[role="none"]').length).toBe(5)
      expect(nav.querySelectorAll('.nc-navigation-menu__item > a.nc-navigation-menu__link--top[role="menuitem"]').length).toBe(3)
      const ausloeser = [...nav.querySelectorAll('button.nc-navigation-menu__trigger[role="menuitem"][aria-haspopup="true"]')]
      expect(ausloeser.length).toBe(2)
      for (const a of ausloeser) {
        expect(a.querySelector('.nc-navigation-menu__trigger-icon > svg')).not.toBeNull()
        expect(a.nextElementSibling.classList.contains('nc-navigation-menu__content')).toBe(true)
        expect(a.nextElementSibling.dataset.state).toBe(a.dataset.state)
      }
      expect(ausloeser[0].dataset.state).toBe(offen ? 'open' : 'closed')
      expect(ausloeser[0].getAttribute('aria-expanded')).toBe(String(offen))
      expect(ausloeser[1].dataset.state).toBe('closed')
      const huelle = nav.querySelector(':scope > .nc-navigation-menu__viewport-wrapper')
      expect(huelle.dataset.state).toBe(offen ? 'open' : 'closed')
      const sicht = huelle.querySelector(':scope > .nc-navigation-menu__viewport')
      expect(sicht.querySelectorAll(':scope > .nc-navigation-menu__content[data-state="open"]').length).toBe(offen ? 1 : 0)
      expect(nav.querySelector(':scope > .nc-navigation-menu__indicator[data-state="hidden"]')).not.toBeNull()
      if (offen) expect(d.querySelector('.ra-anker > nav.nc-navigation-menu')).not.toBeNull()
    }
    const [, hover] = alle('navigation-menu', 'indicator-states')
    expect(hover.querySelector('.nc-navigation-menu__trigger').dataset.zustand).toBe('hover')
  })

  it('navigation-menu: Layout am Inhalt — Liste, zwei Spalten mit Callout, Mega mit Featured und Gruppen', () => {
    const inhalt = (sp) => alle('navigation-menu', sp)[1].querySelector('.nc-navigation-menu__viewport > .nc-navigation-menu__content')
    const einfach = inhalt('default-dropdown')
    expect(einfach.className).toBe('nc-navigation-menu__content')
    expect(einfach.querySelectorAll(':scope > .nc-navigation-menu__links-area > a.nc-navigation-menu__link[role="menuitem"] > .nc-navigation-menu__link-title + .nc-navigation-menu__link-desc').length).toBe(3)
    const zwei = inhalt('two-col-callout')
    expect(zwei.className).toBe('nc-navigation-menu__content nc-navigation-menu__content--two-col')
    expect(zwei.querySelector(':scope > .nc-navigation-menu__content-grid > .nc-navigation-menu__callouts-area > a.nc-navigation-menu__callout > .nc-navigation-menu__callout-title + .nc-navigation-menu__callout-desc')).not.toBeNull()
    expect(zwei.querySelector('.nc-navigation-menu__callouts-area + .nc-navigation-menu__links-area')).not.toBeNull()
    const mega = inhalt('mega-menu')
    expect(mega.className).toBe('nc-navigation-menu__content nc-navigation-menu__content--mega')
    const flaeche = mega.querySelector('.nc-navigation-menu__links-area')
    expect(flaeche.firstElementChild.classList.contains('nc-navigation-menu__featured')).toBe(true)
    expect(flaeche.querySelectorAll(':scope > .nc-navigation-menu__link-group > .nc-navigation-menu__group-kicker').length).toBe(3)
  })

  it('navigation-menu: Kopfzeile (composition-header) wie site.js', () => {
    const d = alle('navigation-menu', 'composition-header')[0]
    const inner = d.querySelector('.ra-kopf > header.nc-header > nav.nc-nav > .nc-nav__inner')
    expect(inner.querySelector(':scope > a.nc-brand + nav.nc-navigation-menu + .nc-nav__actions + button.nc-mobile-toggle')).not.toBeNull()
    const [aussen, innen] = d.querySelectorAll('nav')
    expect(aussen.getAttribute('aria-label')).not.toBe(innen.getAttribute('aria-label'))
  })

  it('sidebar: Rahmen, nav > __nav, aktuelle Seite, Zustaende am zweiten Eintrag', () => {
    for (const d of alle('sidebar')) {
      expect(d.querySelector('nav.nc-sidebar[aria-label] > .nc-sidebar__nav')).not.toBeNull()
      expect(d.querySelectorAll('[aria-current="page"]').length).toBe(1)
    }
    const [standard, hover, aktiv, fokus] = alle('sidebar', 'default')
    const zweiter = (d) => d.querySelectorAll('.nc-sidebar__item')[1]
    expect(standard.querySelector('.ra-spalte > nav.nc-sidebar')).not.toBeNull()
    expect(standard.querySelector('.nc-sidebar__item').getAttribute('aria-current')).toBe('page')
    expect(zweiter(hover).dataset.zustand).toBe('hover')
    expect(zweiter(fokus).dataset.zustand).toBe('focus')
    expect(zweiter(aktiv).getAttribute('aria-current')).toBe('page')
    expect(aktiv.querySelector('.nc-sidebar__item').hasAttribute('aria-current')).toBe(false)
    for (const d of alle('sidebar')) {
      for (const e of d.querySelectorAll('.nc-sidebar__item:not(.nc-sidebar__item--sub)')) {
        expect(e.querySelector(':scope > .nc-sidebar__item-icon[aria-hidden="true"] > svg')).not.toBeNull()
        expect(e.querySelector('.nc-sidebar__item-label')).not.toBeNull()
      }
    }
  })

  it('sidebar: eingeklappt, Inhalte, Submenue, voll, mobil', () => {
    const [auf, zu] = alle('sidebar', 'variant-comparison')
    expect(auf.querySelector('nav').className).toBe('nc-sidebar')
    expect(zu.querySelector('nav').className).toBe('nc-sidebar nc-sidebar--collapsed')
    for (const e of zu.querySelectorAll('.nc-sidebar__item:not(.nc-sidebar__item--sub)')) expect(e.getAttribute('aria-label')).toBeTruthy()
    expect(auf.querySelector('.nc-sidebar__item[aria-label]')).toBeNull()
    const [flat, grouped, nested, badges, full] = alle('sidebar', 'content-variants')
    expect(flat.querySelector('.nc-sidebar__group, .nc-sidebar__item-badge, .nc-sidebar__submenu')).toBeNull()
    expect(grouped.querySelectorAll('.nc-sidebar__nav > .nc-sidebar__group > .nc-sidebar__group-label').length).toBe(3)
    const sub = nested.querySelector('.nc-sidebar__submenu > button.nc-sidebar__item[aria-expanded="true"]')
    expect(sub.querySelector('.nc-sidebar__item-chevron[aria-hidden="true"] svg')).not.toBeNull()
    expect(nested.querySelector(`#${sub.getAttribute('aria-controls')}.nc-sidebar__submenu-items`).querySelectorAll('a.nc-sidebar__item.nc-sidebar__item--sub').length).toBe(3)
    expect(badges.querySelectorAll('.nc-sidebar__item-badge').length).toBe(2)
    expect(full.querySelector('nav > .nc-sidebar__header > a.nc-sidebar__logo + button.nc-sidebar__toggle[aria-label]')).not.toBeNull()
    expect(full.querySelector('nav > .nc-sidebar__nav + .nc-sidebar__footer')).not.toBeNull()
    expect(full.querySelector('.ra-spalte--hoch')).not.toBeNull()
    expect(alle('sidebar', 'full-sidebar')[0].querySelector('.nc-sidebar__submenu')).not.toBeNull()
    const mobil = alle('sidebar', 'mobile-overlay')[0]
    expect(mobil.querySelector('.ra-buehne.ra-buehne--mobil > .nc-sidebar-backdrop + nav.nc-sidebar.nc-sidebar--open')).not.toBeNull()
  })

  it('treeview: tree > treeitem mit Ebene, Zweige mit aria-expanded und __children, Einrueckung --_level', () => {
    for (const d of alle('treeview')) {
      const baum = d.querySelector('nav.nc-treeview[aria-label] > ul.nc-treeview__list[role="tree"]')
      expect(baum).not.toBeNull()
      for (const li of baum.querySelectorAll('li')) {
        expect(li.getAttribute('role')).toBe('treeitem')
        expect(li.classList.contains('nc-treeview__item')).toBe(true)
        const ebene = Number(li.getAttribute('aria-level'))
        expect(li.getAttribute('style')).toBe(`--_level: ${ebene - 1};`)
        const zweig = li.classList.contains('nc-treeview__item--branch')
        expect(zweig || li.classList.contains('nc-treeview__item--leaf')).toBe(true)
        expect(li.hasAttribute('aria-expanded')).toBe(zweig)
        if (zweig) expect(li.querySelector(':scope > .nc-treeview__children > ul.nc-treeview__list[role="group"]')).not.toBeNull()
        expect(li.querySelector(':scope > .nc-treeview__node > .nc-treeview__label')).not.toBeNull()
      }
      expect(baum.querySelectorAll('.nc-treeview__node[tabindex="0"]').length).toBe(1)
    }
    expect(alle('treeview', 'variant-comparison').map((d) => d.querySelector('nav').className)).toEqual(['nc-treeview', 'nc-treeview nc-treeview--bordered', 'nc-treeview nc-treeview--compact', 'nc-treeview nc-treeview--flush'])
    expect(alle('treeview', 'guide-lines').map((d) => d.querySelector('nav').className)).toEqual(['nc-treeview', 'nc-treeview nc-treeview--lines-solid', 'nc-treeview nc-treeview--lines-dashed'])
    expect(Math.max(...[...alle('treeview', 'deep-hierarchy')[0].querySelectorAll('li')].map((li) => Number(li.getAttribute('aria-level'))))).toBe(5)
  })

  it('treeview: Zustaende am Zweig „Vorlagen", Auswahl single', () => {
    const ziel = (d) => [...d.querySelectorAll('li')].find((li) => li.querySelector(':scope > .nc-treeview__node .nc-treeview__label').textContent === 'Vorlagen')
    const [standard, hover, gewaehlt, offen, aus] = alle('treeview', 'states')
    expect(ziel(standard).getAttribute('aria-expanded')).toBe('false')
    expect(standard.querySelectorAll('[aria-selected="true"]').length).toBe(1)
    expect(standard.querySelector('.nc-treeview__item--selected[aria-selected="true"]')).not.toBeNull()
    expect(ziel(hover).querySelector('.nc-treeview__node').dataset.zustand).toBe('hover')
    expect(ziel(gewaehlt).classList.contains('nc-treeview__item--selected')).toBe(true)
    expect(gewaehlt.querySelectorAll('[aria-selected="true"]').length).toBe(1)
    expect(ziel(offen).getAttribute('aria-expanded')).toBe('true')
    expect(ziel(aus).classList.contains('nc-treeview__item--disabled')).toBe(true)
    expect(ziel(aus).getAttribute('aria-disabled')).toBe('true')
  })

  it('treeview: Checkboxen, Aktionen, Badges, Drag & Drop, Datei-Explorer', () => {
    const multi = alle('treeview', 'checkbox-mode')[0]
    expect(multi.querySelector('nav.nc-treeview--checkboxes ul[role="tree"][aria-multiselectable="true"]')).not.toBeNull()
    expect(multi.querySelector('[aria-selected]')).toBeNull()
    expect(new Set([...multi.querySelectorAll('li')].map((li) => li.getAttribute('aria-checked')))).toEqual(new Set(['true', 'false', 'mixed']))
    for (const li of multi.querySelectorAll('li')) {
      const box = li.querySelector(':scope > .nc-treeview__node > input.nc-treeview__checkbox[type="checkbox"]')
      expect(box.checked).toBe(li.getAttribute('aria-checked') === 'true')
      expect(box.hasAttribute('data-unbestimmt')).toBe(li.getAttribute('aria-checked') === 'mixed')
    }
    einrichtungFuer('treeview')(multi)
    expect([...multi.querySelectorAll('.nc-treeview__checkbox')].filter((b) => b.indeterminate).length).toBe(2)
    expect(alle('treeview', 'with-actions')[0].querySelectorAll('.nc-treeview__node > .nc-treeview__actions > button.nc-treeview__action[aria-label]').length).toBeGreaterThan(4)
    expect(alle('treeview', 'with-actions')[0].querySelector('.nc-treeview__badge')).toBeNull()
    expect(alle('treeview', 'with-badges')[0].querySelectorAll('.nc-treeview__badge').length).toBe(4)
    const ziehen = alle('treeview', 'drag-drop')[0]
    expect(ziehen.querySelector('nav.nc-treeview--draggable.nc-treeview--lines-solid')).not.toBeNull()
    for (const n of ziehen.querySelectorAll('.nc-treeview__node')) expect(n.firstElementChild.matches('button.nc-treeview__drag-handle[aria-label]')).toBe(true)
    for (const k of ['dragging', 'drop-before', 'drop-inside', 'drop-after']) expect(ziehen.querySelectorAll(`.nc-treeview__item--${k}`).length, k).toBe(1)
    const explorer = alle('treeview', 'file-explorer')[0]
    expect(explorer.querySelectorAll('.nc-treeview__icon svg').length).toBe(explorer.querySelectorAll('li').length)
    expect(explorer.querySelector('.nc-treeview__badge')).not.toBeNull()
    expect(explorer.querySelector('.nc-treeview__actions')).not.toBeNull()
    expect(alle('treeview', 'variant-comparison')[0].querySelector('.nc-treeview__icon, .nc-treeview__badge, .nc-treeview__actions, .nc-treeview__drag-handle, .nc-treeview__checkbox')).toBeNull()
  })

  it('toolbar: role toolbar, Gruppen, Slots nach content, Varianten, scrolled', () => {
    for (const d of alle('toolbar')) {
      const leiste = d.querySelector('.nc-toolbar[role="toolbar"][aria-label]')
      expect(leiste.querySelector(':scope > .nc-toolbar__group')).not.toBeNull()
      for (const t of leiste.querySelectorAll('.nc-toolbar__separator')) expect(t.getAttribute('aria-hidden')).toBe('true')
      // ohne Verhalten bleibt jeder Knopf in der Tab-Folge
      expect(leiste.querySelector('.nc-button[tabindex="-1"]')).toBeNull()
    }
    expect(alle('toolbar', 'variant-comparison').map((d) => d.querySelector('.nc-toolbar').className)).toEqual(['nc-toolbar', 'nc-toolbar nc-toolbar--bordered', 'nc-toolbar nc-toolbar--border-bottom', 'nc-toolbar nc-toolbar--floating', 'nc-toolbar nc-toolbar--blurred'])
    expect(alle('toolbar', 'variant-comparison').map((d) => !!d.querySelector('.ra-kulisse'))).toEqual([false, false, false, false, true])
    expect(alle('toolbar', 'alignment-comparison').map((d) => d.querySelector('.nc-toolbar').className)).toEqual(['nc-toolbar nc-toolbar--bordered', 'nc-toolbar nc-toolbar--bordered nc-toolbar--align-center', 'nc-toolbar nc-toolbar--bordered nc-toolbar--align-justify'])
    expect(alle('toolbar', 'density-comparison').map((d) => d.querySelector('.nc-toolbar').className)).toEqual(['nc-toolbar nc-toolbar--bordered', 'nc-toolbar nc-toolbar--bordered nc-toolbar--compact'])
    const [knoepfe, trenner, luecke, label, voll] = alle('toolbar', 'content-variants')
    expect(knoepfe.querySelector('.nc-toolbar__separator, .nc-toolbar__spacer, .nc-toolbar__label')).toBeNull()
    expect(trenner.querySelector('.nc-toolbar__group + .nc-toolbar__separator + .nc-toolbar__group')).not.toBeNull()
    expect(luecke.querySelector('.nc-toolbar__group + .nc-toolbar__spacer + .nc-toolbar__group')).not.toBeNull()
    expect(label.querySelector('.nc-toolbar__group > .nc-toolbar__label')).not.toBeNull()
    expect(voll.querySelector('.nc-toolbar__label')).not.toBeNull()
    expect(voll.querySelector('.nc-toolbar__separator')).not.toBeNull()
    expect(voll.querySelector('.nc-toolbar__spacer + .nc-toolbar__group--end')).not.toBeNull()
    const [ruhig, gescrollt] = alle('toolbar', 'sticky-scrolled')
    expect(ruhig.querySelector('.nc-toolbar').className).toBe('nc-toolbar nc-toolbar--sticky')
    expect(gescrollt.querySelector('.nc-toolbar').className).toBe('nc-toolbar nc-toolbar--sticky is-scrolled')
  })

  it('toolbar: Kompositionen — Editoren mit Toggle-Groups, Tabelle mit Suche', () => {
    const schwebend = alle('toolbar', 'floating-editor')[0]
    expect(schwebend.querySelector('.nc-toolbar--floating.nc-toolbar--align-center .nc-toggle-group[role="radiogroup"] > button.nc-toggle-group__item[role="radio"]')).not.toBeNull()
    const editor = alle('toolbar', 'editor-toolbar')[0]
    expect(editor.querySelector('.nc-toolbar--border-bottom .nc-toggle-group[role="group"] > button.nc-toggle-group__item[aria-pressed]')).not.toBeNull()
    expect(editor.querySelector('.nc-toggle-group[role="radiogroup"]')).not.toBeNull()
    const tabelle = alle('toolbar', 'table-toolbar')[0]
    expect(tabelle.querySelector('.ra-feld--sehr-breit .nc-toolbar .nc-search > .nc-search__input-wrapper > input.nc-input.nc-search__input[type="search"][aria-label]')).not.toBeNull()
    expect(tabelle.querySelector('.nc-toolbar__spacer')).not.toBeNull()
    expect(alle('toolbar', 'blurred-shell')[0].querySelector('.ra-kulisse .nc-toolbar--blurred')).not.toBeNull()
  })
})

describe('Navigation-Block in der RecipeArena', () => {
  beforeEach(() => setActivePinia(createPinia()))
  afterEach(() => { document.body.innerHTML = '' })

  async function arena (id) {
    const w = mount(RecipeArena, { props: { componentId: id }, attachTo: document.body })
    for (const bis = Date.now() + 8000; !w.find('.ra-specimen').exists() && Date.now() < bis;) {
      await flushPromises()
      await new Promise((r) => setTimeout(r, 10))
    }
    return w
  }

  for (const id of BLOCK) {
    const mitVerhalten = MIT_VERHALTEN_IM_BLOCK.includes(id)
    it(`${id}: alle Specimens, ${mitVerhalten ? 'Umschalter „Ausprobieren"' : 'kein Umschalter (kein Verhalten)'}, keine Heuristik`, async () => {
      const w = await arena(id)
      const recipe = normalisiereRecipe(rohesRecipe(id))
      expect(w.findAll('.ra-specimen').length).toBe(recipe.specimens.length)
      expect(w.find('.ra-modus').exists()).toBe(mitVerhalten)
      expect(w.find('[data-quelle="heuristik"], .ra-fallback').exists()).toBe(false)
      expect(w.find(`.${WURZELN[id]}`).exists()).toBe(true)
      w.unmount()
    })
  }

  it('treeview: einrichten() setzt indeterminate in der gemounteten Arena', async () => {
    const w = await arena('treeview')
    await flushPromises()
    await new Promise((r) => setTimeout(r, 0))
    const boxen = w.findAll('.ra-specimen[data-specimen-id="checkbox-mode"] .nc-treeview__checkbox[data-unbestimmt]')
    expect(boxen.length).toBeGreaterThan(0)
    for (const b of boxen) expect(b.element.indeterminate).toBe(true)
    w.unmount()
  })
})

describe('Navigation-Block: Ausprobieren in der RecipeArena', () => {
  beforeEach(() => setActivePinia(createPinia()))
  afterEach(() => { document.body.innerHTML = '' })

  async function ausprobieren (id) {
    const w = mount(RecipeArena, { props: { componentId: id }, attachTo: document.body })
    for (const bis = Date.now() + 8000; !w.find('.ra-specimen').exists() && Date.now() < bis;) {
      await flushPromises()
      await new Promise((r) => setTimeout(r, 10))
    }
    await w.findAll('.ra-modus__knopf')[1].trigger('click')
    await flushPromises()
    await new Promise((r) => setTimeout(r, 0))
    expect(w.find(`[data-neo-behavior~="${id}"]`).exists()).toBe(true)
    return w
  }
  const zelle = (w, sp) => w.find(`.ra-specimen[data-specimen-id="${sp}"] .ra-cell`)

  it('breadcrumb: „Dropdown Open" startet zu, Klick auf die Ellipsis oeffnet', async () => {
    const w = await ausprobieren('breadcrumb')
    const z = zelle(w, 'truncated-dropdown')
    expect(z.find('.ra-anker > nav.nc-breadcrumb').exists()).toBe(true)
    expect(z.find('.nc-breadcrumb__dropdown').classes()).not.toContain('is-open')
    await z.find('.nc-breadcrumb__ellipsis').trigger('click')
    expect(z.find('.nc-breadcrumb__dropdown').classes()).toContain('is-open')
    expect(z.find('.nc-breadcrumb__ellipsis').attributes('aria-expanded')).toBe('true')
    w.unmount()
  })
})
