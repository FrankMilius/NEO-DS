/**
 * Plan v3, Phase 3 (Block Bausteine): Button, Item, Kennzahl (metric) und
 * Code-Snippet kommen aus dem Recipe (Vorlagen in src/arena-templates) statt
 * aus handgeschriebenen Vue-Arenen. Geprueft wird:
 *   - keine Sonderfall-Arena, jede Zelle jedes Specimens aus der Vorlage;
 *     Recipe, Spec und Registry zeigen auf die RecipeArena, die Vue-Arena ist weg
 *   - echtes DS-Markup: Basisklasse, nur Klassen aus styles.css (oder der
 *     Anatomie), keine Inline-Gestaltung, keine Zustandsklassen, die das DS
 *     am Bauteil nicht kennt; andere Bauteile erklaert (composes)
 *   - Zustaende und Inhalte je Specimen (Button: Varianten, Groessen, Symbol,
 *     Loading, Toggle, Gruppe, Link; Item: Media am Media-Element, Optionen
 *     mit aria-selected/aria-disabled; Kennzahl: Trend als Text; Code-Snippet:
 *     Kopf, Zeilen, Hervorhebung, eingeklappt/aufgeklappt)
 *   - „Ausprobieren" nur, wo neo-behaviors Verhalten hat: code-snippet
 *   - form-layout: Arena gestrichen (Entscheidung 06.10.2026), keine Sektion mehr
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
import { hasArena, arenaQuelle, arenaRecipe, getRegisteredArenas } from '../../src/composables/useArenaResolver.js'
import { NAVIGATIONS_SEKTIONEN } from '../../src/navigation/sektions-ids.js'
import { RECIPE_IDS, WURZEL, rohesRecipe } from './_recipes.js'

const BLOCK = ['button', 'item', 'metric', 'code-snippet']
const VUE = { button: 'ButtonArena', item: 'ItemArena', metric: 'MetricArena', 'code-snippet': 'CodeSnippetArena' }

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
const alle = (id, sp) => zellen(id, sp).map((z) => dom(z.html))

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

/** Zustandsklassen, die das DS am jeweiligen Bauteil kennt. */
const ZUSTANDSKLASSEN = { item: ['is-selected', 'is-disabled'] }

describe('Bausteine-Block aus dem Recipe', () => {
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

      it('Recipe, Spec und Registry zeigen auf die RecipeArena; die Vue-Arena ist weg', () => {
        const ziel = 'apps/theme-configurator/src/components/laboratory/RecipeArena.vue'
        expect(rohesRecipe(id).meta.pipeline.arena).toBe(ziel)
        const spec = readFileSync(resolve(WURZEL, `specs/${id}.spec.json`), 'utf8')
        expect(spec).toContain(ziel)
        expect(spec).not.toMatch(/laboratory\/(?!Recipe)\w+Arena\.vue/)
        const registry = readFileSync(resolve(WURZEL, 'data/component-registry.json'), 'utf8')
        expect(registry).not.toContain(`${VUE[id]}.vue`)
        expect(existsSync(resolve(WURZEL, `apps/theme-configurator/src/components/laboratory/${VUE[id]}.vue`))).toBe(false)
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

      it('keine Inline-Gestaltung, nur Zustandsklassen, die das DS am Bauteil kennt', () => {
        const erlaubt = ZUSTANDSKLASSEN[id] || []
        for (const z of beideModi(id)) {
          const d = dom(z.html)
          expect(d.querySelector('[style]'), `${id}/${z.specimen.id}`).toBeNull()
          for (const el of d.querySelectorAll('[class*="is-"]')) {
            for (const k of el.classList) if (/^is-/.test(k)) expect(erlaubt, `${id}/${z.specimen.id}: ${k}`).toContain(k)
          }
          expect(d.querySelector('[data-state]'), `${id}/${z.specimen.id}`).toBeNull()
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

      it('ids eindeutig (auch im Split-Modus), Symbole aria-hidden, Knoepfe mit Namen', () => {
        for (const z of beideModi(id)) {
          const d = dom(z.html + fuerWeiteresThema(z.html, '-t2'))
          const ids = [...d.querySelectorAll('[id]')].map((e) => e.id)
          expect(new Set(ids).size).toBe(ids.length)
          for (const svg of d.querySelectorAll('svg')) {
            expect(svg.closest('[aria-hidden="true"]'), `${id}/${z.specimen.id}: Symbol nicht aria-hidden`).not.toBeNull()
          }
          for (const k of d.querySelectorAll('button, a[href]')) {
            const name = (k.getAttribute('aria-label') || k.textContent).trim()
            expect(name, `${id}/${z.specimen.id}: ${k.outerHTML.slice(0, 100)}`).not.toBe('')
            if (k.tagName === 'BUTTON') expect(k.getAttribute('type')).toBe('button')
          }
        }
      })
    })
  }

  it('Kennzahl: alle vier ohne Sonderfall; Verhalten nur beim Code-Snippet', () => {
    expect(BLOCK.filter((id) => hasArena(id))).toEqual([])
    expect(BLOCK.filter((id) => MIT_VERHALTEN.includes(id))).toEqual(['code-snippet'])
    for (const id of ['button', 'item', 'metric']) {
      expect(rohesRecipe(id).events?.['code-snippet-copy']).toBeUndefined()
    }
    for (const id of BLOCK) expect(rohesRecipe(id).meta.version, id).toBe('2.1.0')
  })

  it('form-layout: Arena gestrichen, keine Sektion, form zeigt die RecipeArena (Entscheidung 06.10.2026)', () => {
    expect(hasArena('form-layout')).toBe(false)
    expect(getRegisteredArenas()).toEqual([])
    expect(existsSync(resolve(WURZEL, 'apps/theme-configurator/src/components/laboratory/FormLayoutArena.vue'))).toBe(false)
    expect(RECIPE_IDS).not.toContain('form-layout')
    expect(NAVIGATIONS_SEKTIONEN).not.toContain('component-form-layout')
    expect(NAVIGATIONS_SEKTIONEN).toContain('component-form')
    expect(arenaQuelle('form')).toBe('recipe')
    expect(arenaRecipe('form')).toBe('form')
  })
})

describe('Bausteine-Block: Zustände und Inhalte', () => {
  it('button: Varianten als Modifier (primary ohne), Beschriftung im __label', () => {
    const knoepfe = alle('button', 'all-variants').map((d) => d.querySelector('button.nc-button'))
    expect(knoepfe).toHaveLength(11)
    expect(knoepfe[0].className).toBe('nc-button')
    expect(knoepfe.slice(1).every((k) => /nc-button--(secondary|accent|outline|ghost|soft|inverted|success|warning|error|info)$/.test(k.className))).toBe(true)
    for (const k of knoepfe) expect(k.querySelector(':scope > span.nc-button__label').textContent).not.toBe('')
    const groessen = alle('button', 'size-scale').map((d) => d.querySelector('.nc-button').className)
    expect(groessen).toEqual(['nc-button nc-button--xs', 'nc-button nc-button--sm', 'nc-button', 'nc-button nc-button--lg'])
  })

  it('button: Symbol vor dem Label, nur Symbol mit aria-label (icon-only, FAB)', () => {
    for (const d of alle('button', 'with-icon')) expect(d.querySelector('.nc-button > .nc-button__icon[aria-hidden="true"] + .nc-button__label')).not.toBeNull()
    for (const sp of ['icon-only', 'fab']) {
      for (const d of alle('button', sp)) {
        const k = d.querySelector('.nc-button')
        expect(k.classList.contains('nc-button--icon-only'), sp).toBe(true)
        expect(k.querySelector('.nc-button__label')).toBeNull()
        expect(k.getAttribute('aria-label')).toBeTruthy()
      }
    }
    expect(alle('button', 'fab').every((d) => d.querySelector('.nc-button--fab'))).toBe(true)
    expect(new Set(alle('button', 'icon-only').map((d) => d.querySelector('.nc-button').getAttribute('aria-label'))).size).toBe(12)
  })

  it('button: Loading mit nc-button--loading, aria-busy und Spinner — gleiche Struktur wie der Ruhezustand', () => {
    const z = zellen('button', 'loading-stability')
    const laedt = z.filter((c) => c.id.includes('loading')).map((c) => dom(c.html).querySelector('.nc-button'))
    expect(laedt).toHaveLength(3)
    for (const k of laedt) {
      expect(k.classList.contains('nc-button--loading')).toBe(true)
      expect(k.getAttribute('aria-busy')).toBe('true')
      expect(k.hasAttribute('disabled')).toBe(false)
      expect(k.querySelector('.nc-button__label + .nc-button__spinner[aria-hidden="true"]')).not.toBeNull()
    }
    const ruhig = z.filter((c) => !c.id.includes('loading')).map((c) => dom(c.html).querySelector('.nc-button'))
    for (const k of ruhig) expect(k.matches('.nc-button--loading, [aria-busy]') || !!k.querySelector('.nc-button__spinner')).toBe(false)
    // QA: loading + disabled — Loading gewinnt (Spinner, kein natives disabled)
    const qa = alle('button', 'neg-disabled-loading')[0].querySelector('.nc-button')
    expect(qa.classList.contains('nc-button--loading')).toBe(true)
    expect(qa.hasAttribute('disabled')).toBe(false)
  })

  it('button: Toggle — nc-button--toggle in nc-button-group, aria-pressed je Knopf; ohne Toggle kein aria-pressed', () => {
    const [d] = alle('button', 'toggle')
    const gruppe = d.querySelector('div.nc-button-group[role="group"][aria-label]')
    expect(gruppe.className).toBe('nc-button-group')
    const knoepfe = [...gruppe.querySelectorAll(':scope > button.nc-button.nc-button--toggle')]
    expect(knoepfe.map((k) => k.getAttribute('aria-pressed'))).toEqual(['true', 'false', 'false'])
    expect(knoepfe.every((k) => k.querySelector('.nc-button__icon svg'))).toBe(true)
    expect(alle('button', 'neg-pressed-without-toggle')[0].querySelector('[aria-pressed]')).toBeNull()
    const g = alle('button', 'button-group')[0].querySelector('.nc-button-group[role="group"][aria-label="Aktionen"]')
    expect([...g.children].map((k) => k.className)).toEqual(Array(3).fill('nc-button nc-button--outline'))
  })

  it('button: Link als <a>, volle Breite, invertiert auf dunklem Grund', () => {
    for (const d of alle('button', 'link-as-button')) expect(d.querySelector('a.nc-button[href]')).not.toBeNull()
    expect(alle('button', 'full-width').every((d) => d.querySelector('.nc-button--full-width'))).toBe(true)
    expect(zellen('button', 'inverted-variant').every((z) => z.flaeche === 'invers')).toBe(true)
  })

  it('item: Media-Modifier am Media-Element, nicht an der Wurzel', () => {
    const typen = alle('item', 'media-comparison').map((d) => {
      const wurzel = d.querySelector('.nc-item')
      expect([...wurzel.classList].some((k) => k.startsWith('nc-item__'))).toBe(false)
      return wurzel.querySelector(':scope > .nc-item__media')?.className || null
    })
    expect(typen).toEqual([null, 'nc-item__media nc-item__media--icon', 'nc-item__media nc-item__media--image', 'nc-item__media nc-item__media--avatar', 'nc-item__media nc-item__media--thumbnail'])
    expect(alle('item', 'media-comparison')[3].querySelector('.nc-item__media--avatar > .nc-avatar')).not.toBeNull()
    for (const d of alle('item', 'variant-comparison')) expect(d.querySelector('.nc-item > .nc-item__content > .nc-item__title + .nc-item__description')).not.toBeNull()
    expect(alle('item', 'alignment-comparison').map((d) => d.querySelector('.nc-item').classList.contains('nc-item--align-start'))).toEqual([false, true])
  })

  it('item: Zustaende als Optionen einer Listbox — interaktiv, ausgewaehlt, gesperrt', () => {
    const z = zellen('item', 'interactive-states')
    expect(z.map((c) => c.label)).toEqual(['Standard', 'Hover *', 'Aktiv', 'Ausgewählt', 'Deaktiviert'])
    const opt = z.map((c) => dom(c.html).querySelector('[role="listbox"] > .nc-item.nc-item--interactive[role="option"]'))
    expect(opt.every(Boolean)).toBe(true)
    expect(opt.map((o) => o.getAttribute('aria-selected'))).toEqual(['false', 'false', 'false', 'true', 'false'])
    expect(opt.map((o) => o.classList.contains('is-selected'))).toEqual([false, false, false, true, false])
    expect(opt.map((o) => o.getAttribute('aria-disabled'))).toEqual([null, null, null, null, 'true'])
  })

  it('item: Gruppe als Liste, Suche als Listbox, Dropdown als Menue mit Tastenkuerzeln', () => {
    const [g] = alle('item', 'group-outline')
    expect(g.querySelectorAll('.nc-item-group.nc-item-group--outline[role="list"] > .nc-item[role="listitem"]')).toHaveLength(3)
    const [s] = alle('item', 'search-integration')
    expect(s.querySelectorAll('[role="listbox"] > .nc-item--sm[role="option"]')).toHaveLength(2)
    expect(s.querySelector('.nc-item__title mark')).not.toBeNull()
    const [m] = alle('item', 'dropdown-integration')
    const punkte = [...m.querySelectorAll('[role="menu"] > .nc-item.nc-item--compact[role="menuitem"]')]
    expect(punkte.map((p) => p.getAttribute('aria-keyshortcuts'))).toEqual(['Control+C', 'Delete'])
    expect(punkte.every((p) => p.querySelector('.nc-item__meta[aria-hidden="true"] kbd.nc-kbd'))).toBe(true)
  })

  it('metric: Slots in DS-Reihenfolge, Trend als Text mit Pfeil, Modifier nach Achsen', () => {
    for (const d of alle('metric')) {
      for (const k of d.querySelectorAll('.nc-metric')) {
        expect(k.querySelector(':scope > .nc-metric__value-row > .nc-metric__value')).not.toBeNull()
        const trend = k.querySelector(':scope > .nc-metric__trend')
        if (trend) {
          expect(trend.querySelector('svg.nc-metric__trend-icon[aria-hidden="true"]')).not.toBeNull()
          expect(trend.textContent.trim()).toMatch(/%/)
          expect([...k.classList].some((c) => /^nc-metric--trend-(up|down|neutral)$/.test(c))).toBe(true)
        }
      }
    }
    const trends = alle('metric', 'trend-variants').map((d) => d.querySelector('.nc-metric').className)
    expect(trends).toEqual(['nc-metric nc-metric--trend-up', 'nc-metric nc-metric--trend-down', 'nc-metric nc-metric--trend-neutral'])
    expect(alle('metric', 'emphasis-comparison').map((d) => d.querySelector('.nc-metric').classList.contains('nc-metric--subtle'))).toEqual([false, true])
    expect(alle('metric', 'size-comparison').map((d) => d.querySelector('.nc-metric').className)).toEqual(['nc-metric nc-metric--md nc-metric--trend-up', 'nc-metric nc-metric--trend-up', 'nc-metric nc-metric--xl nc-metric--trend-up'])
    const [minimal] = alle('metric', 'value-only')
    expect([...minimal.querySelector('.nc-metric').children].map((e) => e.className)).toEqual(['nc-metric__value-row'])
    const [raster] = alle('metric', 'dashboard-grid')
    expect(raster.querySelectorAll('.nc-metric-grid > .nc-metric.nc-metric--subtle.nc-metric--md')).toHaveLength(4)
  })

  it('code-snippet: inline als <code>, Bloecke mit pre, Kopieren und (multi) Mehr anzeigen', () => {
    const [inline, single, multi] = alle('code-snippet', 'all-variants')
    expect(inline.querySelector('code.nc-code-snippet.nc-code-snippet--inline')).not.toBeNull()
    expect(inline.querySelector('button')).toBeNull()
    for (const d of [single, multi]) {
      const b = d.querySelector('div.nc-code-snippet')
      expect(b.querySelector(':scope > pre.nc-code-snippet__pre[tabindex="0"] > code.nc-code-snippet__code .token')).not.toBeNull()
      expect(b.querySelector(':scope > button.nc-code-snippet__copy[aria-label="Code kopieren"] > .nc-code-snippet__copy-icon--copy + .nc-code-snippet__copy-icon--check')).not.toBeNull()
    }
    expect(single.querySelector('.nc-code-snippet__show-more')).toBeNull()
    expect(multi.querySelector('.nc-code-snippet > button.nc-code-snippet__show-more[aria-expanded="false"]').textContent).toBe('Mehr anzeigen')
    const [p] = alle('code-snippet', 'inline-in-context')
    expect(p.querySelectorAll('p > code.nc-code-snippet--inline')).toHaveLength(2)
  })

  it('code-snippet: Kopf je Stil, Zeilen fuer Nummern und Hervorhebung, Umbruch', () => {
    const koepfe = alle('code-snippet', 'header-comparison').map((d) => d.querySelector('.nc-code-snippet'))
    expect(koepfe.map((k) => k.classList[2])).toEqual(['nc-code-snippet--header-plain', 'nc-code-snippet--header-macos', 'nc-code-snippet--header-window'])
    expect(koepfe[1].querySelectorAll('.nc-code-snippet__header > .nc-code-snippet__header-dots[aria-hidden="true"] > .nc-code-snippet__header-dot')).toHaveLength(3)
    for (const k of koepfe) expect(k.querySelector(':scope > .nc-code-snippet__header .nc-code-snippet__header-title').textContent).toMatch(/\.js/)
    const [nummern] = alle('code-snippet', 'with-line-numbers')
    expect(nummern.querySelectorAll('.nc-code-snippet--with-line-numbers .nc-code-snippet__code > .nc-code-snippet__line').length).toBeGreaterThan(12)
    expect(nummern.querySelector('.nc-code-snippet__line--highlighted')).toBeNull()
    for (const sp of ['line-highlight', 'line-numbers-highlight', 'macos-full']) {
      const [d] = alle('code-snippet', sp)
      expect(d.querySelectorAll('.nc-code-snippet--line-highlight .nc-code-snippet__line--highlighted'), sp).toHaveLength(2)
    }
    const umbruch = alle('code-snippet', 'wrap-comparison').map((d) => d.querySelector('.nc-code-snippet').classList.contains('nc-code-snippet--wrap'))
    expect(umbruch).toEqual([false, true])
  })

  it('code-snippet: eingeklappt vs. aufgeklappt — Modifier am Block, aria-expanded und Text am Knopf', () => {
    const [zu, auf] = alle('code-snippet', 'multi-collapsed-expanded')
    expect(zu.querySelector('.nc-code-snippet--expanded')).toBeNull()
    expect(auf.querySelector('.nc-code-snippet.nc-code-snippet--multi.nc-code-snippet--expanded')).not.toBeNull()
    expect(auf.querySelector('.nc-code-snippet').hasAttribute('aria-expanded')).toBe(false)
    const knopf = auf.querySelector('.nc-code-snippet__show-more')
    expect(knopf.getAttribute('aria-expanded')).toBe('true')
    expect(knopf.textContent).toBe('Weniger anzeigen')
  })
})

describe('Bausteine-Block in der RecipeArena', () => {
  beforeEach(() => setActivePinia(createPinia()))
  afterEach(() => { document.body.innerHTML = '' })

  async function geladen (id) {
    const w = mount(RecipeArena, { props: { componentId: id }, attachTo: document.body })
    for (const bis = Date.now() + 8000; !w.find('.ra-specimen').exists() && Date.now() < bis;) {
      await flushPromises()
      await new Promise((r) => setTimeout(r, 10))
    }
    return w
  }

  for (const id of BLOCK) {
    it(`${id}: alle Specimens aus der Vorlage; „Ausprobieren" nur mit Verhalten`, async () => {
      const w = await geladen(id)
      const recipe = normalisiereRecipe(rohesRecipe(id))
      expect(w.findAll('.ra-specimen').length).toBe(recipe.specimens.length)
      expect(w.findAll('.ra-cell[data-quelle="heuristik"], .ra-cell[data-quelle="fehler"]')).toHaveLength(0)
      const knoepfe = w.findAll('.ra-modus__knopf')
      if (id !== 'code-snippet') {
        expect(knoepfe).toHaveLength(0)
      } else {
        await knoepfe[1].trigger('click')
        await flushPromises()
        await new Promise((r) => setTimeout(r, 0))
        expect(w.find('[data-neo-behavior~="code-snippet"]').exists()).toBe(true)
        // das Inline-Snippet bleibt ungebunden
        expect(w.find('.nc-code-snippet--inline[data-neo-behavior]').exists()).toBe(false)
        const zelle = w.find('.ra-specimen[data-specimen-id="multi-collapsed-expanded"] .ra-cell').element
        zelle.querySelector('.nc-code-snippet__show-more').click()
        expect(zelle.querySelector('.nc-code-snippet').classList.contains('nc-code-snippet--expanded')).toBe(true)
      }
      w.unmount()
    })
  }
})
