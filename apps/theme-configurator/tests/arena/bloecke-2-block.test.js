/**
 * Plan v3, Phase 4 (Gruppe „bloecke-2"): duenne Recipes bekommen Specimens
 * aus ihrer Vorlage — link-with-arrow, multiselect, news, pricing, question,
 * searchbar, security-list, solutions, spacing, square, tab-nav, table-block,
 * tbl-cell, testimonial-grid, testimonial, text-blocks, text-only,
 * video-section. Geprueft wird:
 *   - keine Sonderfall-Arena, jede Zelle jedes Specimens aus der Vorlage
 *     (Zustaende und Ausprobieren/Abspielen), mehr als ein Specimen (ausser
 *     spacing: Foundation, kein Bauteil)
 *   - echtes DS-Markup: Wurzel aus dem Recipe, nur Klassen aus styles.css
 *     bzw. der Anatomie, Arena-Klassen nie an DS-Elementen, keine Inline-
 *     Gestaltung (ausser Instanzwerten wie in Drupal)
 *   - Website-Bloecke (data/markup/<id>.html): die Klassen der geernteten
 *     Wurzel stehen im Markup der Arena
 *   - „nicht gebaut": beschriebene Klassen ohne CSS zeigen den Hinweis
 *     (security-list __icon/__text seit der Entscheidung 06.10.2026 gebaut)
 *   - animierte Website-Bloecke (question, tab-nav): Standbild in jeder
 *     Zelle, Animation nur mit der Taste „Abspielen" der Arena (export
 *     abspielen, gemeinsamer Mechanismus), kein „Ausprobieren"
 *   - Formular-Bauteile ohne Verhalten (multiselect, searchbar): kein
 *     „Ausprobieren" (neues Behavior = Entscheidungsfall)
 */
import { describe, it, expect } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { MIT_VERHALTEN } from 'neo-behaviors'
import { vorlageFuer, ausprobierenFuer, abspielenFuer } from '../../src/arena-templates/index.js'
import { normalisiereRecipe, specimenAnsicht, fuerWeiteresThema } from '../../src/lib/recipe-arena.js'
import { hasArena, arenaQuelle } from '../../src/composables/useArenaResolver.js'
import { RECIPE_IDS, WURZEL, rohesRecipe } from './_recipes.js'

const BLOCK = ['link-with-arrow', 'multiselect', 'news', 'pricing', 'question', 'searchbar',
  'security-list', 'solutions', 'spacing', 'square', 'tab-nav', 'table-block', 'tbl-cell',
  'testimonial-grid', 'testimonial', 'text-blocks', 'text-only', 'video-section']

function zellen (id, optionen) {
  const recipe = normalisiereRecipe(rohesRecipe(id))
  return recipe.specimens
    .flatMap((sp) => specimenAnsicht(sp, recipe, id, vorlageFuer(id), optionen).zeilen
      .flatMap((z) => z.zellen.map((c) => ({ ...c, specimen: sp }))))
}
const beideModi = (id) => [...zellen(id), ...zellen(id, { ausprobieren: true })]

function dom (html) {
  const d = document.createElement('div')
  d.innerHTML = html
  return d
}

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

// Instanzwerte, die Drupal je Block inline setzt (wie das Hintergrundbild
// des Heros) — sonst keine Inline-Gestaltung.
const INLINE_ERLAUBT = {
  news: (el) => el.matches('.nc-news__hero-media') && /^background-image: url\(/.test(el.getAttribute('style'))
}

// Recipe-Modifier ohne CSS, deren Wirkung das DS anders herstellt —
// Entscheidungsfall im Bericht (Plan v3, Phase 4).
// (text-only has-scroll: seit der Entscheidung 06.10.2026 aus dem Recipe
// gestrichen — die Einfaerbung macht p.visible)
const MODIFIER_OHNE_CSS = {}

const modifier = (id) => Object.values(normalisiereRecipe(rohesRecipe(id)).axes || {})
  .flatMap((a) => Object.values(a.values || {}))
  .flatMap((v) => (v?.modifier ? String(v.modifier).split(/\s+/).map((k) => k.replace(/^\./, '')) : []))

describe('Bloecke-2 aus dem Recipe (Plan v3, Phase 4)', () => {
  const bekannt = dsKlassen()

  for (const id of BLOCK) {
    describe(id, () => {
      it('keine Sonderfall-Arena, jede Zelle jedes Specimens aus der Vorlage (beide Ansichten)', () => {
        expect(hasArena(id)).toBe(false)
        expect(arenaQuelle(id)).toBe('recipe')
        expect(vorlageFuer(id)).toBeTypeOf('function')
        const recipe = normalisiereRecipe(rohesRecipe(id))
        expect(recipe.arena.hinweise.filter((h) => /Specimen/.test(h))).toEqual([])
        for (const optionen of [{}, { ausprobieren: true }]) {
          const z = zellen(id, optionen)
          expect(new Set(z.map((c) => c.quelle))).toEqual(new Set(['vorlage']))
          expect(z.filter((c) => c.fehler)).toEqual([])
          expect(new Set(z.map((c) => c.specimen.id))).toEqual(new Set(recipe.specimens.map((s) => s.id)))
        }
      })

      it('nicht mehr duenn: jeder Achsenwert und jeder Zustand des Recipes hat eine Zelle', () => {
        const recipe = normalisiereRecipe(rohesRecipe(id))
        const z = zellen(id)
        for (const [achse, def] of Object.entries(recipe.axes)) {
          for (const wert of Object.keys(def.values)) {
            expect(z.some((c) => c.axisValues?.[achse] === wert), `${id}: ${achse}=${wert} ohne Zelle`).toBe(true)
          }
        }
        const gezeigt = new Set(recipe.specimens.flatMap((sp) => sp.matrix.states))
        for (const s of recipe.states.supported) expect(gezeigt.has(s), `${id}: Zustand ${s} ohne Zelle`).toBe(true)
        // mehr als ein Specimen, wo Recipe und SCSS mehr hergeben als die Matrix
        // (question, solutions, table-block: eine Matrix deckt alles ab;
        // spacing ist Foundation)
        if (!['question', 'solutions', 'table-block', 'spacing'].includes(id)) {
          expect(recipe.specimens.length, id).toBeGreaterThan(1)
        }
      })

      it('Recipe-Version ab 1.1.0 mit Changelog-Eintrag der Phase 4', () => {
        const meta = rohesRecipe(id).meta
        expect(meta.changelog[0].version).toBe(meta.version)
        // Spaetere Entscheidungen (06.10.2026) duerfen davor stehen
        expect(meta.changelog.some((e) => /Plan v3, Phase 4/.test(e.changes.join(' ')))).toBe(true)
      })

      it('Wurzel aus dem Recipe, nur Klassen aus styles.css bzw. der Anatomie, Arena-Klassen nie an DS-Elementen', () => {
        const anatomie = anatomieKlassen(id)
        for (const z of beideModi(id)) {
          const d = dom(z.html)
          const wurzel = `.${WURZELN[id]}, [data-recipe-wurzel="${WURZELN[id]}"], [data-nicht-gebaut]`
          expect(d.querySelector(wurzel), `${id}/${z.specimen.id}/${z.id}`).not.toBeNull()
          for (const el of d.querySelectorAll('[class]')) {
            for (const k of el.classList) {
              if (/^ra-/.test(k)) {
                expect(el.className, `${id}: Arena-Klasse ${k} an einem DS-Element`).not.toMatch(/(^|\s)(nc|fnd|o|u)-/)
                continue
              }
              expect(bekannt.has(k) || anatomie.has(k), `${id}/${z.specimen.id}: Klasse ${k} weder in styles.css noch in der Anatomie`).toBe(true)
            }
          }
        }
      })

      it('jeder Modifier steht in styles.css (oder ist als Entscheidungsfall begruendet)', () => {
        for (const k of modifier(id)) {
          expect(bekannt.has(k) || !!MODIFIER_OHNE_CSS[id]?.[k], `${id}: Modifier ${k} ohne CSS`).toBe(true)
        }
        for (const k of Object.keys(MODIFIER_OHNE_CSS[id] || {})) {
          expect(bekannt.has(k), `${k} ist inzwischen gebaut — Eintrag entfernen`).toBe(false)
        }
      })

      it('keine Inline-Gestaltung (ausser Instanzwerten wie in Drupal), keine Zustandsklassen ausserhalb des DS', () => {
        for (const z of beideModi(id)) {
          const d = dom(z.html)
          for (const el of d.querySelectorAll('[style]')) {
            const ok = INLINE_ERLAUBT[id]?.(el)
            expect(ok, `${id}/${z.specimen.id}: ${el.outerHTML.slice(0, 140)}`).toBe(true)
          }
          expect(d.querySelector('[data-state]:not(.nc-searchbar)'), `${id}/${z.specimen.id}`).toBeNull()
          if (!z.nurInteraktiv) expect(d.querySelector('[data-zustand]'), `${id}/${z.specimen.id}`).toBeNull()
        }
      })

      it('andere Bauteile sind erklaert (komposition oder composes)', () => {
        const erklaert = enthaelt(id)
        for (const z of beideModi(id)) {
          for (const c of z.specimen.composes || []) erklaert.add(c)
          const klassen = new Set([...dom(z.html).querySelectorAll('[class]')].flatMap((el) => [...el.classList]))
          for (const [anderes, k] of Object.entries(WURZELN)) {
            if (anderes === id || !klassen.has(k)) continue
            expect(erklaert.has(anderes), `${id}/${z.specimen.id} enthaelt ${anderes}`).toBe(true)
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

      const ernte = resolve(WURZEL, `data/markup/${id}.html`)
      if (existsSync(ernte)) {
        it('Website-Block: die Klassen der geernteten Wurzel stehen im Markup der Arena', () => {
          const roh = readFileSync(ernte, 'utf8').replace(/<!--[\s\S]*?-->/g, '')
          const erste = dom(roh).querySelector('[class]')
          const html = zellen(id).map((z) => z.html).join('\n')
          const arena = new Set([...dom(html).querySelectorAll('[class]')].flatMap((el) => [...el.classList]))
          for (const k of erste.classList) expect(arena.has(k), `${id}: ${k} aus data/markup/${id}.html`).toBe(true)
        })
      }
    })
  }

  it('security-list: Symbol und Text gebaut (Entscheidung 06.10.2026) — Item mit __icon und __text, Beschreibung unter dem Titel', () => {
    for (const k of ['nc-security-list__icon', 'nc-security-list__text']) expect(bekannt.has(k), k).toBe(true)
    expect(css()).toMatch(/\.nc-security-list__item:has\(>\s?\.nc-security-list__icon\)\{display:grid/)
    const z = zellen('security-list').find((c) => c.specimen.id === 'mit-symbol')
    const d = dom(z.html)
    expect(d.querySelector('[data-nicht-gebaut]')).toBeNull()
    const items = [...d.querySelectorAll('.nc-security-list > .nc-security-list__item')]
    expect(items).toHaveLength(3)
    for (const li of items) {
      expect(li.querySelector(':scope > svg.nc-security-list__icon[aria-hidden="true"]')).not.toBeNull()
      expect(li.querySelector(':scope > .nc-security-list__text')).not.toBeNull()
    }
    expect(items[1].querySelectorAll('.nc-security-list__text > *')).toHaveLength(2)
  })

  describe('animierte Website-Bloecke: Standbild, „Abspielen" auf Wunsch', () => {
    it('question: Laufzeilen nur mit Abspielen (.question-animate)', () => {
      expect(ausprobierenFuer('question')).toBeNull()
      expect(abspielenFuer('question').gesperrt).toBeFalsy()
      for (const z of beideModi('question')) {
        const d = dom(z.html)
        expect(d.querySelector('.question-animate')).toBeNull()
        const anhalten = abspielenFuer('question').starten(d)
        expect(d.querySelectorAll('.question-text-row.question-animate').length).toBe(2)
        anhalten()
        expect(d.querySelector('.question-animate')).toBeNull()
      }
    })

    it('question: with-text am Aktionsbereich, nicht an der Wurzel', () => {
      const z = zellen('question').find((c) => c.axisValues.variant === 'with-text')
      const d = dom(z.html)
      expect(d.querySelector('.question-action-section.with-text')).not.toBeNull()
      expect(d.querySelector('section.question.with-text')).toBeNull()
    })

    it('tab-nav: autoplay off in jeder Zelle, on mit Abspielen', () => {
      expect(ausprobierenFuer('tab-nav')).toBeNull()
      expect(abspielenFuer('tab-nav').gesperrt).toBeFalsy()
      for (const z of beideModi('tab-nav')) {
        const d = dom(z.html)
        const wurzel = d.querySelector('.nc-tab-nav')
        expect(wurzel.getAttribute('data-autoplay')).toBe('off')
        const anhalten = abspielenFuer('tab-nav').starten(d)
        expect(wurzel.getAttribute('data-autoplay')).toBe('on')
        anhalten()
        expect(wurzel.getAttribute('data-autoplay')).toBe('off')
      }
    })
  })

  it('Formular-Bauteile ohne Verhalten: multiselect und searchbar ohne „Ausprobieren"', () => {
    for (const id of ['multiselect', 'searchbar']) {
      expect(MIT_VERHALTEN).not.toContain(id)
      expect(ausprobierenFuer(id)).toBeNull()
    }
  })

  it('multiselect: offen mit Panel, Fehler mit nc-form-field--invalid und Meldung', () => {
    const z = zellen('multiselect')
    const offen = dom(z.find((c) => c.specimen.id === 'default' && c.id.includes('open')).html)
    expect(offen.querySelector('.nc-multiselect.is-open .nc-multiselect__panel')).not.toBeNull()
    expect(offen.querySelector('.nc-multiselect__trigger').getAttribute('aria-expanded')).toBe('true')
    const fehler = dom(z.find((c) => c.id.includes('error')).html)
    expect(fehler.querySelector('.nc-form-field--invalid .nc-multiselect__trigger[aria-invalid="true"]')).not.toBeNull()
    expect(fehler.querySelector('.nc-form-error[role="alert"]')).not.toBeNull()
    const leer = dom(z.find((c) => c.specimen.id === 'leer').html)
    expect(leer.querySelector('.nc-multiselect__value--empty')).not.toBeNull()
  })

  it('solutions: Mobil-Tableiste als erstes Kind, .solutions danach (sonst auf dem Desktop unsichtbar)', () => {
    for (const z of zellen('solutions')) {
      const wrapper = dom(z.html).querySelector('.solutions-wrapper')
      expect(wrapper.firstElementChild.matches('div:not(.solutions)')).toBe(true)
      expect(wrapper.firstElementChild.querySelector('ul > li > span')).not.toBeNull()
      expect(wrapper.children[1].classList.contains('solutions')).toBe(true)
      expect(wrapper.querySelectorAll('details[open]').length).toBe(1)
    }
  })

  it('spacing: Foundation ohne Modifier, Rolle als Token in data-rolle', () => {
    expect(modifier('spacing')).toEqual([])
    for (const z of zellen('spacing')) {
      const d = dom(z.html)
      const rolle = z.axisValues.role
      expect(d.querySelector(`.ra-abstand[data-rolle="${rolle}"] > .fnd-spacing`)).not.toBeNull()
      expect(d.textContent).toContain(`--fnd-spacing-${rolle}`)
    }
  })

  it('square: genau eine Variantenklasse je Marker (die Varianten ersetzen .square)', () => {
    const varianten = ['square', 'white-square', 'dark-square', 'adaptive-square', 'blinking-square']
    for (const z of zellen('square')) {
      for (const el of dom(z.html).querySelectorAll('span')) {
        expect(varianten.filter((v) => el.classList.contains(v)).length, el.outerHTML).toBe(1)
      }
    }
  })

  it('testimonial-grid: Navigation nur beim Karussell, disabled sperrt „Zurück"', () => {
    for (const z of zellen('testimonial-grid')) {
      const d = dom(z.html)
      expect(!!d.querySelector('.nc-testimonial-grid__nav'), z.id).toBe(z.axisValues.variante === 'carousel')
    }
    const gesperrt = zellen('testimonial-grid').find((c) => c.id.includes('disabled'))
    expect(dom(gesperrt.html).querySelector('.nc-testimonial-grid__btn[disabled]')).not.toBeNull()
  })

  it('table-block: gescrollt mit data-scroll-active und is-scrolled im schmalen Rahmen', () => {
    const z = zellen('table-block').find((c) => c.id.includes('scrolled'))
    expect(dom(z.html).querySelector('.ra-schmal > .nc-table-block.is-scrolled[data-scroll-active="true"]')).not.toBeNull()
  })

  it('video-section: auf dunkler Flaeche wie in Drupal, playing blendet das Overlay aus', () => {
    const z = zellen('video-section')
    expect(z.find((c) => c.specimen.id === 'auf-dunkel').flaeche).toBe('dunkel')
    expect(dom(z.find((c) => c.id.includes('playing')).html).querySelector('.nc-video__media.is-playing')).not.toBeNull()
  })
})
