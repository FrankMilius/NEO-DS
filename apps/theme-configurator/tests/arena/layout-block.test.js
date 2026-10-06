/**
 * Plan v3, Phase 3 (Block Layout): Container, Grid, Section, Hero, Shell und
 * Psychedelic Background kommen aus dem Recipe (Vorlagen in
 * src/arena-templates) statt aus handgeschriebenen Vue-Arenen. Geprueft wird:
 *   - keine Sonderfall-Arena, jede Zelle jedes Specimens aus der Vorlage;
 *     Recipe, Spec und Registry zeigen auf die RecipeArena, die Vue-Arenen
 *     sind weg (die Grid-Buehne bleibt der Foundation)
 *   - echtes DS-Markup: Basisklasse, nur Klassen aus styles.css (oder der
 *     Recipe-Anatomie), Arena-Klassen nie an DS-Elementen, keine Inline-
 *     Gestaltung ausser dem Hintergrundbild des Heros (Instanzwert wie in
 *     Drupal)
 *   - „nicht gebaut": jeder Modifier der sechs Recipes steht in styles.css
 *     oder in NICHT_GEBAUT (_layout.js) — und umgekehrt; solche Zellen zeigen
 *     den Hinweis statt einer wirkungslosen Klasse
 *   - Zustaende und Aufbau je Bauteil (Rahmen, Landmarks, Modifier am
 *     richtigen Element)
 *   - psychedelic-bg: Canvas, „Ausprobieren" mit dem Renderer der Arena
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { mount, flushPromises } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import { MIT_VERHALTEN } from 'neo-behaviors'
import RecipeArena from '../../src/components/laboratory/RecipeArena.vue'
import { vorlageFuer, einrichtungFuer, ausprobierenFuer } from '../../src/arena-templates/index.js'
import { NICHT_GEBAUT } from '../../src/arena-templates/_layout.js'
import { normalisiereRecipe, specimenAnsicht, fuerWeiteresThema } from '../../src/lib/recipe-arena.js'
import { hasArena, arenaQuelle } from '../../src/composables/useArenaResolver.js'
import { RECIPE_IDS, WURZEL, rohesRecipe } from './_recipes.js'

const BLOCK = ['container', 'grid', 'section', 'hero', 'shell', 'psychedelic-bg']
const VUE = { container: 'Container', grid: 'Grid', section: 'Section', hero: 'Hero', shell: 'Shell', 'psychedelic-bg': 'PsychedelicBg' }

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
function css () {
  if (!existsSync(STYLES)) throw new Error('styles.css fehlt — im Wurzelordner `npm run build:css` ausfuehren')
  return readFileSync(STYLES, 'utf8')
}
const dsKlassen = () => new Set([...css().matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)].map((m) => m[1]))
function anatomieKlassen (id) {
  const r = rohesRecipe(id)
  const sel = [r.anatomy?.root?.element, ...(r.anatomy?.slots || []).map((s) => s.element)].filter(Boolean)
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

// Andere Bauteile, die weder komposition noch composes nennt — begruendet.
const ERLAUBT = {
  shell: { switch: 'Linkbar wie auf der Website: Schalter „Dunkel" (Freigabe G1, 02.10.2026)' },
  section: { container: 'Anatomie: .section > .nc-container (Slot container)' }
}

/** Alle Modifier der Achsen eines Recipes. */
function modifier (id) {
  const r = rohesRecipe(id)
  return Object.values(r.axes || {}).flatMap((a) => Object.values(a.values || {}))
    .flatMap((v) => (v?.modifier ? String(v.modifier).split(/\s+/).map((k) => k.replace(/^\./, '')) : []))
}

describe('Layout-Block aus dem Recipe', () => {
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
        expect(registry).not.toContain(`${VUE[id]}Arena.vue`)
        expect(existsSync(resolve(WURZEL, `apps/theme-configurator/src/components/laboratory/${VUE[id]}Arena.vue`))).toBe(false)
      })

      it('echtes DS-Element mit Basisklasse (oder „nicht gebaut"), nur Klassen aus styles.css bzw. der Anatomie', () => {
        const anatomie = anatomieKlassen(id)
        for (const z of beideModi(id)) {
          const d = dom(z.html)
          expect(d.querySelector(`.${WURZELN[id]}, [data-nicht-gebaut]`), `${z.specimen.id}/${z.id}`).not.toBeNull()
          for (const el of d.querySelectorAll('[class]')) {
            for (const k of el.classList) {
              if (/^(nc|fnd|u|o)-/.test(k) || /^section(--|$)/.test(k)) {
                expect(bekannt.has(k) || anatomie.has(k), `${id}: Klasse ${k} fehlt in styles.css`).toBe(true)
              }
              if (/^ra-/.test(k)) expect(el.className, `${id}: Arena-Klasse ${k} an einem DS-Element`).not.toMatch(/(^|\s)(nc|fnd|o)-|(^|\s)section(\s|$)/)
            }
          }
        }
      })

      it('keine Inline-Gestaltung (ausser dem Hintergrundbild des Heros), keine fremden Zustandsklassen', () => {
        for (const z of beideModi(id)) {
          const d = dom(z.html)
          for (const el of d.querySelectorAll('[style]')) {
            const ok = id === 'hero' && el.matches('.nc-hero') && /^background-image: url\(/.test(el.getAttribute('style'))
            expect(ok, `${id}/${z.specimen.id}: ${el.outerHTML.slice(0, 120)}`).toBe(true)
          }
          expect(d.querySelector('.is-active, .is-open, .is-selected, .is-disabled, [data-state]'), `${id}/${z.specimen.id}`).toBeNull()
          // data-zustand nur an Zellen „nur interaktiv" (Hover im Recipe von psychedelic-bg)
          if (!z.nurInteraktiv) expect(d.querySelector('[data-zustand]'), `${id}/${z.specimen.id}`).toBeNull()
        }
      })

      it('andere Bauteile sind erklaert (komposition, composes oder begruendet)', () => {
        const erklaert = enthaelt(id)
        for (const z of beideModi(id)) {
          const klassen = new Set([...dom(z.html).querySelectorAll('[class]')].flatMap((el) => [...el.classList]))
          for (const [anderes, k] of Object.entries(WURZELN)) {
            if (anderes === id || !klassen.has(k)) continue
            const ok = erklaert.has(anderes) || ERLAUBT[id]?.[anderes]
            expect(ok, `${id}/${z.specimen.id} enthaelt ${anderes}`).toBeTruthy()
          }
        }
      })

      it('ids eindeutig (auch im Split-Modus)', () => {
        for (const z of beideModi(id)) {
          const d = dom(z.html + fuerWeiteresThema(z.html, '-t2'))
          const ids = [...d.querySelectorAll('[id]')].map((e) => e.id)
          expect(new Set(ids).size).toBe(ids.length)
        }
      })
    })
  }

  it('nicht gebaut: jede Klasse in NICHT_GEBAUT fehlt in styles.css, jeder fehlende Modifier steht dort', () => {
    for (const k of Object.keys(NICHT_GEBAUT)) expect(bekannt.has(k), `${k} ist inzwischen gebaut — Eintrag in _layout.js entfernen`).toBe(false)
    for (const id of BLOCK) {
      for (const k of modifier(id)) {
        expect(bekannt.has(k) || k in NICHT_GEBAUT, `${id}: Modifier ${k} weder in styles.css noch in NICHT_GEBAUT`).toBe(true)
      }
    }
    expect(new Set(Object.values(NICHT_GEBAUT))).toEqual(new Set(['layout-section-modifier']))
  })

  it('nicht gebaut: genau die Zellen mit fehlendem Modifier zeigen den Hinweis, mit Namen der Klasse', () => {
    for (const id of ['container', 'grid', 'section']) {
      const recipe = normalisiereRecipe(rohesRecipe(id))
      for (const sp of recipe.specimens) {
        for (const z of specimenAnsicht(sp, recipe, id, vorlageFuer(id)).zeilen.flatMap((r) => r.zellen)) {
          const d = dom(z.html)
          const fehlend = Object.entries(z.axisValues || {})
            .map(([a, w]) => recipe.axes[a].values[w].modifier)
            .filter((k) => k && k in NICHT_GEBAUT)
          const hinweis = d.querySelector('[data-nicht-gebaut]')
          if (fehlend.length) {
            expect(hinweis, `${id}/${sp.id}/${z.id}`).not.toBeNull()
            expect(hinweis.getAttribute('data-nicht-gebaut').split(' ')).toEqual(fehlend)
            for (const k of fehlend) expect(hinweis.textContent).toContain(`.${k}`)
            expect(d.querySelector(`.${WURZELN[id] || 'section'}`)).toBeNull()
          } else {
            expect(hinweis, `${id}/${sp.id}/${z.id}`).toBeNull()
          }
        }
      }
    }
  })

  it('Kennzahl: alle sechs ohne Sonderfall; Verhalten nur psychedelic-bg (Arena), keines in neo-behaviors', () => {
    expect(BLOCK.filter((id) => hasArena(id))).toEqual([])
    expect(BLOCK.filter((id) => MIT_VERHALTEN.includes(id))).toEqual([])
    expect(BLOCK.filter((id) => ausprobierenFuer(id))).toEqual(['psychedelic-bg'])
    for (const id of BLOCK) {
      const r = rohesRecipe(id)
      expect(Object.keys(r.keyboard || {}), id).toEqual([])
      expect(Object.keys(r.events || {}), id).toEqual([])
    }
  })

  it('Grid-Buehne der Foundation liegt unter laboratory/foundation/', () => {
    expect(existsSync(resolve(WURZEL, 'apps/theme-configurator/src/components/laboratory/foundation/GridBuehne.vue'))).toBe(true)
  })
})

describe('Layout-Block: Zustände und Aufbau', () => {
  it('container: Desktop-Seite im Massstab, Breite als Modifier, Platzhalter mit der Recipe-Beschreibung', () => {
    const breiten = alle('container', 'width-scale')
    expect(breiten.map((d) => d.querySelector('.ra-massstab > .nc-container').className)).toEqual([
      'nc-container', 'nc-container nc-container--wide', 'nc-container nc-container--narrow', 'nc-container nc-container--full'
    ])
    const r = rohesRecipe('container')
    expect(breiten[1].querySelector('.ra-platzhalter').textContent).toBe(r.axes.width.values.wide.description)
    // gebaute Standardwerte der anderen Achsen: Container ohne Modifier
    for (const sp of ['vertical-spacing-scale', 'alignment-options', 'surface-variants']) {
      expect(alle('container', sp)[0].querySelector('.ra-massstab > .nc-container').className).toBe('nc-container')
    }
  })

  it('container: gebaute Modifier (Entscheidung 06.10.2026) als echte Klassen im Massstab, kein „nicht gebaut"', () => {
    const klasse = (sp) => alle('container', sp).map((d) => {
      expect(d.querySelector('[data-nicht-gebaut]')).toBeNull()
      return d.querySelector('.ra-massstab > .nc-container').className
    })
    expect(klasse('vertical-spacing-scale')).toEqual(['nc-container', 'nc-container nc-container--vspace-sm', 'nc-container nc-container--vspace-md', 'nc-container nc-container--vspace-lg'])
    expect(klasse('alignment-options')).toEqual(['nc-container', 'nc-container nc-container--align-start', 'nc-container nc-container--align-end'])
    expect(klasse('surface-variants')).toEqual(['nc-container', 'nc-container nc-container--surface'])
    const k = dsKlassen()
    for (const m of ['vspace-sm', 'vspace-md', 'vspace-lg', 'align-start', 'align-end', 'surface']) expect(k.has(`nc-container--${m}`), m).toBe(true)
    expect(rohesRecipe('container').meta.version).toBe('2.1.0')
  })

  it('grid: Spannen als .o-col-N, Auto-fit ohne Spannen, Ausrichtung mit verschieden hohen Kindern', () => {
    const [standard, klein, gross] = alle('grid', 'gap-variants')
    expect(standard.querySelector('.o-grid').className).toBe('o-grid')
    expect(klein.querySelector('.o-grid').className).toBe('o-grid o-grid--gap-sm')
    expect(gross.querySelector('.o-grid').className).toBe('o-grid o-grid--gap-lg')
    expect([...standard.querySelectorAll('.o-grid > [class^="o-col-"]')].map((e) => e.className)).toEqual(
      ['o-col-6', 'o-col-6', 'o-col-4', 'o-col-4', 'o-col-4', 'o-col-3', 'o-col-3', 'o-col-3', 'o-col-3'])
    const [, autofit] = alle('grid', 'layout-modes')
    expect(autofit.querySelector('.o-grid.o-grid--auto-fit')).not.toBeNull()
    expect(autofit.querySelector('.o-grid > [class^="o-col-"]')).toBeNull()
    expect(alle('grid', 'alignment').map((d) => d.querySelector('.o-grid').className)).toEqual(['o-grid', 'o-grid o-grid--center', 'o-grid o-grid--end'])
    expect(alle('grid', 'alignment')[0].querySelector('.ra-platzhalter--hoch')).not.toBeNull()
  })

  it('grid: Mobil-Lage im Rahmen ra-mobil — Standard und gebaute Modifier mobile-1/2/6, auch in der Matrix je Gap', () => {
    const mobil = alle('grid', 'mobile-breakpoints')
    expect(mobil.map((d) => d.querySelector('.ra-mobil > .o-grid').className)).toEqual([
      'o-grid o-grid--mobile-1', 'o-grid o-grid--mobile-2', 'o-grid', 'o-grid o-grid--mobile-6'
    ])
    for (const d of mobil) expect(d.querySelector('[data-nicht-gebaut]')).toBeNull()
    expect(mobil[0].querySelector('.ra-mobil > .o-grid > .o-col-6')).not.toBeNull()
    const matrix = alle('grid', 'responsive-matrix')
    expect(matrix).toHaveLength(12)
    for (const d of matrix) expect(d.querySelector('.ra-mobil > .o-grid')).not.toBeNull()
    expect(matrix.filter((d) => /mobile-/.test(d.querySelector('.o-grid').className) === false).map((d) => d.querySelector('.o-grid').className))
      .toEqual(['o-grid', 'o-grid o-grid--gap-sm', 'o-grid o-grid--gap-lg'])
  })

  it('grid: Flow (Entscheidung 06.10.2026) — row/dense mit Luecke, column mit vorgegebenen Zeilen; Subgrid gestrichen', () => {
    const [zeile, spalte, dicht] = alle('grid', 'flow-variants')
    expect([zeile, spalte, dicht].map((d) => d.querySelector('.o-grid').className)).toEqual(['o-grid', 'o-grid o-grid--flow-col', 'o-grid o-grid--dense'])
    for (const d of [zeile, dicht]) expect([...d.querySelectorAll('.o-grid > [class^="o-col-"]')].map((e) => e.className)).toEqual(['o-col-8', 'o-col-6', 'o-col-4', 'o-col-2'])
    expect(spalte.querySelector('.ra-zeilen > .o-grid--flow-col')).not.toBeNull()
    expect(spalte.querySelectorAll('.o-grid > .o-col-3')).toHaveLength(6)
    expect(zeile.querySelector('.ra-platzhalter').textContent).toBe('1 · 8')
    const r = rohesRecipe('grid')
    expect(r.meta.version).toBe('3.0.0')
    expect(r.axes.subgrid).toBeUndefined()
    expect(r.specimens.map((s) => s.id)).not.toContain('subgrid-modes')
    const k = dsKlassen()
    for (const m of ['flow-col', 'dense', 'mobile-1', 'mobile-2', 'mobile-6']) expect(k.has(`o-grid--${m}`), m).toBe(true)
  })

  it('section: .section > .nc-container > Inhalt im Rahmen ra-seite, Dichte und Flaeche als Modifier, kein Landmark', () => {
    const dichte = alle('section', 'density-scale')
    expect(dichte.map((d) => d.querySelector('.ra-seite > section.section').className)).toEqual(['section', 'section section--compact', 'section section--spacious'])
    for (const d of dichte) {
      expect(d.querySelector('section.section > .nc-container > .ra-platzhalter')).not.toBeNull()
      expect(d.querySelector('section').hasAttribute('aria-label')).toBe(false)
    }
    expect(alle('section', 'surface-variants').map((d) => d.querySelector('section').className))
      .toEqual(['section', 'section section--elevated', 'section section--muted', 'section section--accent'])
    expect(alle('section', 'density-x-surface')).toHaveLength(12)
  })

  it('hero: mit Medium im __grid (Bild, buendig, Attrappe), Inhalt immer zuerst, Desktop-Rahmen', () => {
    const [bild, split, attrappe] = alle('hero', 'variant-comparison')
    for (const d of [bild, split, attrappe]) {
      const grid = d.querySelector('.ra-desktop > section.nc-hero > .nc-hero__grid')
      expect(grid).not.toBeNull()
      expect([...grid.children].map((e) => e.className)).toEqual(['nc-hero__content', 'nc-hero__media'])
      const c = grid.querySelector('.nc-hero__content')
      expect([...c.children].map((e) => e.className)).toEqual(['nc-hero__kicker', 'nc-hero__title', 'nc-hero__subtitle', 'nc-hero__highlights', 'nc-hero__actions'])
      expect(c.querySelector('.nc-hero__subtitle > p')).not.toBeNull()
      expect(c.querySelectorAll('.nc-hero__actions > a.nc-button')).toHaveLength(2)
    }
    expect(bild.querySelector('.nc-hero__picture > img[alt]')).not.toBeNull()
    expect(split.querySelector('.nc-hero.nc-hero--split .nc-hero__picture')).not.toBeNull()
    expect(attrappe.querySelector('.nc-hero__mockup[aria-hidden="true"] .nc-hero__mockup-pulse')).not.toBeNull()
    expect(alle('hero', 'media-position-comparison').map((d) => d.querySelector('.nc-hero').className))
      .toEqual(['nc-hero nc-hero--surface-dark', 'nc-hero nc-hero--surface-dark nc-hero--media-start'])
  })

  it('hero: Ausrichtung ohne Medium (render.slots), center nur dort wirksam', () => {
    const [start, mitte] = alle('hero', 'alignment-comparison')
    for (const d of [start, mitte]) {
      expect(d.querySelector('.nc-hero__media, .nc-hero__grid')).toBeNull()
      expect(d.querySelector('section.nc-hero > .nc-hero__content')).not.toBeNull()
    }
    expect(mitte.querySelector('.nc-hero').classList.contains('nc-hero--center')).toBe(true)
    expect(rohesRecipe('hero').specimens.find((s) => s.id === 'alignment-comparison').render.slots).not.toContain('media')
  })

  it('hero: Full Featured mit Hintergrundbild, Verlauf, Badges, Merkmalen und Hervorhebung', () => {
    const [d] = alle('hero', 'full-featured')
    const hero = d.querySelector('.nc-hero')
    expect(hero.getAttribute('style')).toMatch(/^background-image: url\(/)
    expect(hero.querySelector(':scope > .nc-hero__overlay[aria-hidden="true"]')).not.toBeNull()
    expect(hero.querySelector('.nc-hero__content > .nc-badge-row.nc-hero__badges > .nc-label')).not.toBeNull()
    expect(hero.querySelector('.nc-hero__title > .nc-hero__mark')).not.toBeNull()
    // nur hier ein Verlauf
    for (const z of zellen('hero')) {
      if (z.specimen.id !== 'full-featured') expect(dom(z.html).querySelector('.nc-hero__overlay, [style]')).toBeNull()
    }
  })

  it('hero: Flaechen und Hervorhebung als Block-Modifier; keine dunkle Seitenflaeche um die Zelle', () => {
    expect(alle('hero', 'surface-comparison').map((d) => d.querySelector('.nc-hero').className))
      .toEqual(['nc-hero nc-hero--surface-dark', 'nc-hero nc-hero--surface-muted', 'nc-hero nc-hero--surface-light'])
    expect(zellen('hero', 'surface-comparison').map((z) => z.flaeche)).toEqual([null, null, null])
    const mark = alle('hero', 'mark-comparison')
    expect(mark.map((d) => d.querySelector('.nc-hero').className)).toEqual([
      'nc-hero nc-hero--surface-dark', 'nc-hero nc-hero--surface-light',
      'nc-hero nc-hero--surface-dark nc-hero--mark-tint', 'nc-hero nc-hero--surface-light nc-hero--mark-tint'
    ])
    for (const d of mark) expect(d.querySelector('.nc-hero__title > span.nc-hero__mark')).not.toBeNull()
  })

  it('hero: Fuss — Badges oben bzw. unten, Kennzahlen mit .nc-metric; Karten-Modifier an .nc-hero__cards', () => {
    const [oben, unten] = alle('hero', 'footer-comparison')
    expect(oben.querySelector('.nc-hero__content > .nc-hero__badges:first-child')).not.toBeNull()
    expect(oben.querySelector('.nc-hero__footer .nc-hero__badges')).toBeNull()
    expect(unten.querySelector('.nc-hero__footer > .nc-hero__badges + .nc-hero__cards')).not.toBeNull()
    expect(unten.querySelectorAll('.nc-hero__cards > .nc-metric > .nc-metric__value-row > .nc-metric__value')).toHaveLength(4)

    const flaechen = alle('hero', 'cards-surface-comparison').map((d) => d.querySelector('.nc-hero__cards').className)
    expect(flaechen).toEqual([
      'nc-hero__cards nc-hero__cards--n4',
      'nc-hero__cards nc-hero__cards--n4 nc-hero__cards--bg-base',
      'nc-hero__cards nc-hero__cards--n4 nc-hero__cards--bg-secondary',
      'nc-hero__cards nc-hero__cards--n4 nc-hero__cards--bg-tertiary',
      'nc-hero__cards nc-hero__cards--n4 nc-hero__cards--bg-inverse'
    ])
    const linien = alle('hero', 'cards-rule-comparison').map((d) => d.querySelector('.nc-hero__cards').className)
    expect(linien).toEqual(['sm', 'md', 'lg', 'accent'].map((r) => `nc-hero__cards nc-hero__cards--n4 nc-hero__cards--ruled nc-hero__cards--rule-${r}`))
    const ausrichtung = alle('hero', 'cards-align-comparison').map((d) => d.querySelector('.nc-hero__cards').className)
    expect(ausrichtung).toEqual(['start', 'center', 'end'].map((a) => `nc-hero__cards nc-hero__cards--n4 nc-hero__cards--${a} nc-hero__cards--bg-secondary`))
    // nie am Block
    for (const z of zellen('hero')) expect(dom(z.html).querySelector('.nc-hero').className).not.toMatch(/nc-hero__cards/)
  })

  it('hero: mark-tint faerbt nur <mark>, .nc-hero__mark bleibt Balken (Entscheidung 06.10.2026)', () => {
    const css = readFileSync(STYLES, 'utf8')
    const tinte = css.match(/([^{}]*)\{background-image:none;color:var\(--mod-hero-mark-tint/)
    expect(tinte).not.toBeNull()
    const selektoren = tinte[1].split(',')
    expect(selektoren.some((x) => /\.nc-hero--mark-tint \.nc-hero__title mark$/.test(x))).toBe(true)
    expect(selektoren.some((x) => /nc-hero--mark-tint[^,]*\.nc-hero__mark(?!--)/.test(x))).toBe(false)
    expect(rohesRecipe('hero').axes.markStyle.values.tint.description).toContain('.nc-hero__mark bleibt Balken')
  })

  it('hero: Recipe 2.2.0 — Specimens fuer jede Achse', () => {
    const r = rohesRecipe('hero')
    expect(r.meta.version).toBe('2.2.0')
    const genutzt = new Set(r.specimens.flatMap((s) => Object.keys(s.matrix.axes)))
    for (const achse of Object.keys(r.axes)) expect(genutzt.has(achse), achse).toBe(true)
  })

  it('shell: Preset als data-layout, Skip-Link als erstes Kind auf <main>, Landmarks mit Namen', () => {
    const presets = alle('shell', 'preset-overview')
    expect(presets.map((d) => d.querySelector('.ra-fenster > .nc-shell').getAttribute('data-layout')))
      .toEqual(['dashboard', 'content-page', 'docs', 'landing', 'focused', 'settings'])
    for (const z of zellen('shell')) {
      const d = dom(z.html)
      for (const shell of d.querySelectorAll('.nc-shell')) {
        const skip = shell.firstElementChild
        expect(skip.matches('a.nc-shell__skip-link'), z.specimen.id).toBe(true)
        const main = shell.querySelector('main.nc-shell__main')
        expect(skip.getAttribute('href')).toBe('#' + main.id)
        expect(shell.querySelectorAll('main')).toHaveLength(1)
        expect(shell.querySelector('header.nc-shell__navbar > nav[aria-label]')).not.toBeNull()
        for (const a of shell.querySelectorAll('aside')) expect(a.getAttribute('aria-label')).toBeTruthy()
      }
    }
    const zahl = (d, sel) => d.querySelectorAll(sel).length
    const [dash, inhalt, docs, landing, fokus, einst] = presets
    expect([dash, inhalt, docs, landing, fokus, einst].map((d) => zahl(d, 'aside'))).toEqual([1, 0, 2, 0, 0, 1])
    expect([dash, inhalt, docs, landing, fokus, einst].map((d) => zahl(d, '.nc-shell__linkbar'))).toEqual([0, 0, 0, 1, 0, 0])
    expect([dash, inhalt, docs, landing, fokus, einst].map((d) => zahl(d, 'footer.nc-shell__footerbar'))).toEqual([1, 1, 1, 1, 0, 1])
  })

  it('shell: Linkbar wie auf der Website — Symbole aria-hidden, Trenner, Schalter', () => {
    const [d] = alle('shell', 'linkbar-detail')
    const leiste = d.querySelector('.nc-shell[data-layout="landing"] > .nc-shell__linkbar')
    expect(leiste.querySelectorAll('.nc-shell__linkbar-left > a > .nc-shell__linkbar-icon[aria-hidden="true"] > svg')).toHaveLength(2)
    expect(leiste.querySelector('.nc-shell__linkbar-separator[aria-hidden="true"]')).not.toBeNull()
    expect(leiste.querySelector('.nc-shell__linkbar-right label.nc-switch > input.nc-switch__input[role="switch"]')).not.toBeNull()
  })

  it('shell: Sidebar eingeklappt (Desktop), Drawer im Mobil-Fenster mit Overlay; Dichte und Footerbar-Mobil als data-Attribute', () => {
    const [offen, eingeklappt, drawer] = alle('shell', 'sidebar-states')
    expect(offen.querySelector('.ra-fenster:not(.ra-fenster--mobil) > .nc-shell').className).toBe('nc-shell')
    expect(eingeklappt.querySelector('.nc-shell').className).toBe('nc-shell nc-shell--sidebar-left-collapsed')
    expect(drawer.querySelector('.ra-fenster--mobil > .nc-shell.nc-shell--sidebar-left-drawer-open')).not.toBeNull()
    expect(drawer.querySelector('.nc-shell__sidebar-overlay.nc-shell__sidebar-overlay--visible[aria-hidden="true"]')).not.toBeNull()
    expect(offen.querySelector('.nc-shell__sidebar-overlay')).toBeNull()

    expect(alle('shell', 'sidebar-density').map((d) => d.querySelector('.nc-shell').getAttribute('data-sidebar-density')))
      .toEqual(['narrow', null, 'wide'])
    const mobil = alle('shell', 'footerbar-mobile')
    expect(mobil.map((d) => d.querySelector('.ra-fenster--mobil > .nc-shell').getAttribute('data-footerbar-mobile'))).toEqual([null, 'static', 'hide'])
    expect(alle('shell', 'content-alignment').map((d) => d.querySelector('.nc-shell__content-body').className)).toEqual([
      'nc-shell__content-body', 'nc-shell__content-body nc-shell__content-body--center', 'nc-shell__content-body nc-shell__content-body--left'
    ])
    // Modifier des Content-Body nie am Block
    for (const z of zellen('shell')) expect(dom(z.html).querySelector('.nc-shell').className).not.toMatch(/content-body/)
  })

  it('shell: Dark Mode zeigt beide Themen nebeneinander', () => {
    const [d] = alle('shell', 'dark-mode')
    expect(d.querySelector('.neo-light-theme > .ra-fenster > .nc-shell')).not.toBeNull()
    expect(d.querySelector('.neo-dark-theme > .ra-fenster > .nc-shell')).not.toBeNull()
  })

  it('psychedelic-bg: Canvas aria-hidden im Rahmen ra-effekt, Muster aus den Achsen, Standbild bzw. lebendig', () => {
    const recipe = rohesRecipe('psychedelic-bg')
    for (const z of zellen('psychedelic-bg')) {
      const d = dom(z.html)
      const flaeche = d.querySelector('.ra-effekt > .nc-psychedelic-bg')
      expect(flaeche.querySelector('canvas[aria-hidden="true"]')).not.toBeNull()
      expect(flaeche.getAttribute('data-ra-modus')).toBe('standbild')
      const muster = JSON.parse(flaeche.getAttribute('data-ra-muster'))
      const achsen = recipe.specimens.find((s) => s.id === z.specimen.id).matrix.axes
      for (const a of ['shape', 'mouseEffect', 'colorMode', 'region']) expect(muster[a]).toBe(achsen[a][0])
      expect(muster.bgColor).toMatch(/^#[0-9a-f]{6}$/i)
    }
    for (const z of zellen('psychedelic-bg', null, { ausprobieren: true })) {
      expect(dom(z.html).querySelector('.nc-psychedelic-bg').getAttribute('data-ra-modus')).toBe('lebendig')
    }
    expect(ausprobierenFuer('psychedelic-bg').hinweis).toMatch(/Canvas-Renderer/)
  })
})

describe('Layout-Block: psychedelic-bg einrichten()', () => {
  // jsdom kennt weder Canvas noch ResizeObserver — beides hier als Attrappe
  const ctx = new Proxy({}, {
    get: (_, k) => (k === 'createLinearGradient' || k === 'createRadialGradient' ? () => ({ addColorStop () {} }) : () => {}),
    set: () => true
  })
  const beobachter = []
  beforeEach(() => {
    vi.stubGlobal('ResizeObserver', class { constructor (f) { this.f = f; beobachter.push(this) } observe () {} disconnect () { this.weg = true } })
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(() => ctx)
    vi.stubGlobal('requestAnimationFrame', vi.fn(() => 1))
    vi.stubGlobal('cancelAnimationFrame', vi.fn())
  })
  afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks(); beobachter.length = 0 })

  const zelle = (optionen) => dom(zellen('psychedelic-bg', 'neocon-moire', optionen)[0].html)

  it('ohne ResizeObserver: nichts (Tests, alte Umgebungen)', () => {
    vi.unstubAllGlobals()
    vi.stubGlobal('ResizeObserver', undefined)
    expect(einrichtungFuer('psychedelic-bg')(zelle())).toBeUndefined()
  })

  it('Zustände: ein Standbild ohne Animationsschleife, Aufraeumen trennt die Beobachter', () => {
    const weg = einrichtungFuer('psychedelic-bg')(zelle())
    expect(weg).toBeTypeOf('function')
    // start() fordert genau einen Frame an, stop() bricht ihn ab
    expect(cancelAnimationFrame).toHaveBeenCalled()
    weg()
    expect(beobachter.every((b) => b.weg)).toBe(true)
  })

  it('Ausprobieren: Animation laeuft; bei prefers-reduced-motion bleibt es beim Standbild', () => {
    const weg = einrichtungFuer('psychedelic-bg')(zelle({ ausprobieren: true }))
    expect(requestAnimationFrame).toHaveBeenCalled()
    expect(cancelAnimationFrame).not.toHaveBeenCalled()
    weg()
    expect(cancelAnimationFrame).toHaveBeenCalled()

    vi.mocked(cancelAnimationFrame).mockClear()
    vi.stubGlobal('matchMedia', () => ({ matches: true }))
    einrichtungFuer('psychedelic-bg')(zelle({ ausprobieren: true }))()
    expect(cancelAnimationFrame).toHaveBeenCalled()
  })
})

describe('Layout-Block in der RecipeArena', () => {
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
    const mitAusprobieren = id === 'psychedelic-bg'
    it(`${id}: alle Specimens, ${mitAusprobieren ? 'Umschalter „Ausprobieren" (Renderer der Arena)' : 'kein Umschalter'}, keine Heuristik`, async () => {
      const w = await arena(id)
      const recipe = normalisiereRecipe(rohesRecipe(id))
      expect(w.findAll('.ra-specimen').length).toBe(recipe.specimens.length)
      expect(w.find('.ra-modus').exists()).toBe(mitAusprobieren)
      expect(w.find('[data-quelle="heuristik"]').exists()).toBe(false)
      expect(w.find(`.${WURZELN[id]}, [data-nicht-gebaut]`).exists()).toBe(true)
      if (mitAusprobieren) {
        await w.findAll('.ra-modus__knopf')[1].trigger('click')
        await flushPromises()
        expect(w.find('.ra-modus__hinweis').text()).toBe(ausprobierenFuer(id).hinweis)
        expect(w.findAll('.ra-cell')).toHaveLength(recipe.specimens.length)
        expect(w.findAll('[data-ra-modus="lebendig"]')).toHaveLength(recipe.specimens.length)
      }
      w.unmount()
    })
  }
})
