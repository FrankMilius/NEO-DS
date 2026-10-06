/**
 * Plan v3, Phase 4 (Gruppe bewegung): animierte Website-Bloecke und die
 * letzten Recipes ohne Arena-Vorlage kommen aus dem Recipe. Geprueft wird:
 *   - jede Zelle jedes Specimens aus der Vorlage (beide Ansichten), Recipe
 *     und Spec zeigen auf die RecipeArena
 *   - echtes DS-Markup: nur Klassen aus styles.css oder der Recipe-Anatomie,
 *     Arena-Klassen nie an DS-Elementen, Inline-Stile nur als Instanzwert
 *     (Custom Properties bzw. die begruendeten Ausnahmen unten)
 *   - „nicht gebaut": scroll-expand, scroll-reveal und .nc-header--compact
 *     zeigen den Hinweis statt einer wirkungslosen Klasse; jeder andere
 *     Modifier der zwoelf Recipes steht in styles.css
 *   - Abspielen: statischer Zustand in „Zustände", die Taste stellt die
 *     Bewegung mit DS-Mitteln nach (Zustandsklassen, scroll-behavior/
 *     scroll-snap, Keyframes) oder ist mit Grund gesperrt (nur GSAP, nicht
 *     gebaut); prefers-reduced-motion sperrt sie; kein GSAP im Konfigurator
 *   - Specimens: die duennen Recipes haben jetzt mehr als eines
 */
import { describe, it, expect, vi, afterEach } from 'vitest'
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { resolve, join } from 'node:path'
import { mount, flushPromises } from '@vue/test-utils'
import { MIT_VERHALTEN } from 'neo-behaviors'
import RecipeArena from '../../src/components/laboratory/RecipeArena.vue'
import { vorlageFuer, ausprobierenFuer, abspielenFuer } from '../../src/arena-templates/index.js'
import { TAKT } from '../../src/arena-templates/_bewegung.js'
import { normalisiereRecipe, specimenAnsicht, fuerWeiteresThema } from '../../src/lib/recipe-arena.js'
import { hasArena, arenaQuelle } from '../../src/composables/useArenaResolver.js'
import { RECIPE_IDS, WURZEL, rohesRecipe } from './_recipes.js'

// Vorlagen neu (vorher Slot-Heuristik) und animierte Website-Bloecke
const NEU = ['mobile-drawer', 'navigation-orchestration', 'scroll-expand', 'scroll-reveal', 'table-info-modal']
const ANIMIERT = ['hero-tom', 'hero-tmob', 'story-gallery', 'marquee', 'parallax-bg', 'fade-gallery', 'carousel', 'scroll-reveal', 'scroll-expand']
const BLOCK = [...new Set([...NEU, ...ANIMIERT])]
// Abspielen mit DS-Mitteln bzw. gesperrt (Grund in der Vorlage)
const SPIELBAR = ['carousel', 'fade-gallery', 'marquee', 'story-gallery']
const NUR_GSAP = ['hero-tmob', 'hero-tom', 'parallax-bg']
const NICHT_GEBAUT = ['scroll-expand', 'scroll-reveal']
// Derselbe Mechanismus fuer die animierten Bloecke der Gruppen bloecke-1/-2
// (bento-grid, question, tab-nav; Tests dort)
const AUS_BLOECKE = ['bento-grid', 'question', 'tab-nav']

// Inline-Stile ausser Custom Properties — Instanzwerte, die die Website
// setzt, bzw. Komponenten-CSS der Website, das styles.css nicht hat
const INLINE_ERLAUBT = {
  'hero-tmob': (el) => el.matches('.nc-hero-tmob') && /^background-color: var\(--fnd-color-[\w-]+\);$/.test(el.getAttribute('style')),
  'parallax-bg': (el) => el.matches('.nc-parallax-bg, .nc-parallax-grid, .nc-parallax-square, .nc-parallax-bar, .nc-hero-tmob'),
  'story-gallery': (el) => el.matches('.nc-story-gallery__cursor-paddle') && /^left: [\d.]+%; top: \d+px;$/.test(el.getAttribute('style'))
}
INLINE_ERLAUBT['hero-tmob-parallax'] = INLINE_ERLAUBT['parallax-bg']

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
// Anatomie der Bauteile, die ein Specimen einbettet (composes)
function anatomieMitTeilen (id) {
  const k = anatomieKlassen(id)
  for (const sp of rohesRecipe(id).specimens || []) for (const t of sp.composes || []) for (const c of anatomieKlassen(t)) k.add(c)
  return k
}
// Haken fuer das Skript der Website (neo-theme.js), ohne Gestaltung im DS —
// im geernteten Markup, die Arena behaelt sie (Richtung der Paddles)
const WEBSITE_HAKEN = new Set(['nc-story-gallery__paddle--prev', 'nc-story-gallery__paddle--next', 'nc-gallery__paddle--prev', 'nc-gallery__paddle--next'])

function modifier (id) {
  const r = rohesRecipe(id)
  return Object.values(r.axes || {}).flatMap((a) => Object.values(a.values || {}))
    .flatMap((v) => (v?.modifier ? String(v.modifier).split(/\s+/).map((k) => k.replace(/^\./, '')) : []))
}
const ARENA = 'apps/theme-configurator/src/components/laboratory/RecipeArena.vue'

describe('Bewegung-Block aus dem Recipe', () => {
  const bekannt = dsKlassen()

  for (const id of BLOCK) {
    describe(id, () => {
      it('jede Zelle jedes Specimens aus der Vorlage (beide Ansichten), Recipe und Spec zeigen auf die RecipeArena', () => {
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
        expect(rohesRecipe(id).meta.pipeline.arena).toBe(ARENA)
        expect(readFileSync(resolve(WURZEL, `specs/${id}.spec.json`), 'utf8')).toContain(ARENA)
      })

      it('nur Klassen aus styles.css bzw. der Anatomie, Arena-Klassen nie an DS-Elementen', () => {
        const anatomie = anatomieMitTeilen(id)
        for (const z of beideModi(id)) {
          const d = dom(z.html)
          for (const el of d.querySelectorAll('[class]')) {
            for (const k of el.classList) {
              if (/^(nc|fnd|u|o)-/.test(k)) {
                expect(bekannt.has(k) || anatomie.has(k) || WEBSITE_HAKEN.has(k), `${id}/${z.specimen.id}: Klasse ${k} weder in styles.css noch in der Anatomie`).toBe(true)
              }
              if (/^ra-/.test(k)) expect(el.className, `${id}: Arena-Klasse ${k} an einem DS-Element`).not.toMatch(/(^|\s)(nc|fnd|o)-/)
            }
          }
        }
      })

      it('Inline-Stile nur als Instanzwert (Custom Properties) oder begruendete Ausnahme', () => {
        for (const z of beideModi(id)) {
          for (const el of dom(z.html).querySelectorAll('[style]')) {
            const stil = el.getAttribute('style')
            const nurEigenschaften = stil.split(';').map((s) => s.trim()).filter(Boolean).every((s) => s.startsWith('--'))
            const parallaxImHero = id === 'hero-tmob' && el.closest('.nc-parallax-bg') && INLINE_ERLAUBT['parallax-bg'](el)
            const ok = nurEigenschaften || INLINE_ERLAUBT[id]?.(el) || parallaxImHero
            expect(ok, `${id}/${z.specimen.id}: ${el.outerHTML.slice(0, 140)}`).toBeTruthy()
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

  it('nicht gebaut: scroll-expand, scroll-reveal und .nc-header--compact zeigen den Hinweis; alle anderen Modifier stehen in styles.css', () => {
    for (const id of NICHT_GEBAUT) {
      const wurzel = rohesRecipe(id).anatomy.root.element.slice(1)
      expect(bekannt.has(wurzel), `${wurzel} ist inzwischen gebaut — Vorlage und Test anpassen`).toBe(false)
      for (const d of alle(id)) {
        expect(d.querySelector('[data-nicht-gebaut]').getAttribute('data-nicht-gebaut')).toBe(wurzel)
        expect(d.querySelector(`.${wurzel}`)).toBeNull()
      }
    }
    expect(bekannt.has('nc-header--compact')).toBe(false)
    const [kompakt] = alle('navigation-orchestration', 'compact-density')
    expect(kompakt.querySelector('[data-nicht-gebaut]').textContent).toContain('.nc-header--compact')
    for (const id of BLOCK) {
      for (const k of modifier(id)) {
        if (k === 'nc-header--compact') continue
        expect(bekannt.has(k), `${id}: Modifier ${k} fehlt in styles.css`).toBe(true)
      }
    }
  })

  it('kein Recipe nennt keyboard/events, keines hat ein Behavior — kein „Ausprobieren"', () => {
    for (const id of BLOCK) {
      const r = rohesRecipe(id)
      expect(Object.keys(r.keyboard || {}).length, id).toBe(0)
      expect(Object.keys(r.events || {}).length, id).toBe(0)
      expect(MIT_VERHALTEN.includes(id), id).toBe(false)
      expect(ausprobierenFuer(id), id).toBeNull()
    }
  })

  it('Specimens: die duennen Recipes haben mehr als eines (nicht gebaute bleiben bei einem)', () => {
    const duenn = ['hero-tom', 'hero-tmob', 'story-gallery', 'marquee', 'parallax-bg', 'fade-gallery', 'carousel', 'mobile-drawer', 'table-info-modal']
    for (const id of duenn) expect(rohesRecipe(id).specimens.length, id).toBeGreaterThan(1)
    for (const id of NICHT_GEBAUT) expect(rohesRecipe(id).specimens).toHaveLength(1)
    for (const id of BLOCK) {
      const r = rohesRecipe(id)
      expect(r.meta.changelog[0].version, id).toBe(r.meta.version)
      expect(r.meta.changelog[0].changes.join(' '), id).toContain('Phase 4')
    }
  })
})

describe('Bewegung-Block: Zustände und Aufbau', () => {
  it('fade-gallery: Leiste ist Kind, nicht Modifier der Wurzel; paddles mit Pfeilen; zweite Ansicht aktiv', () => {
    for (const z of zellen('fade-gallery')) {
      expect(dom(z.html).querySelector('.nc-fade-gallery').className).toBe('nc-fade-gallery')
    }
    const [tabs, paddles] = alle('fade-gallery', 'navigation')
    expect(tabs.querySelector('.nc-gallery__controls')).toBeNull()
    expect(paddles.querySelectorAll('.nc-fade-gallery__nav-row > .nc-gallery__controls .nc-gallery__paddle')).toHaveLength(2)
    const [zweite] = alle('fade-gallery', 'zweite-ansicht')
    expect([...zweite.querySelectorAll('.nc-fade-gallery__media')].map((e) => e.classList.contains('is-active'))).toEqual([false, true, false])
    expect([...zweite.querySelectorAll('.nc-fade-gallery__tab')].map((e) => e.getAttribute('aria-selected'))).toEqual(['false', 'true', 'false'])
    expect([...zweite.querySelectorAll('.nc-fade-gallery__desc')].map((e) => e.classList.contains('is-visible') && !e.hidden)).toEqual([false, true, false])
  })

  it('story-gallery: Paddles unter (Footer, Geschwister) bzw. ueber der Galerie; loop mit sichtbarem Cursor-Paddle im Rahmen', () => {
    const [unten, oben] = alle('story-gallery', 'navigation')
    expect(unten.querySelector('.nc-story-gallery + .nc-story-gallery__footer .nc-story-gallery__paddles--below')).not.toBeNull()
    expect(oben.querySelector('.nc-story-gallery > .nc-story-gallery__paddles--overlay')).not.toBeNull()
    expect(oben.querySelector('.nc-story-gallery__footer')).toBeNull()
    const [schleife] = alle('story-gallery', 'loop')
    expect(schleife.querySelector('.ra-bildschirm > .nc-story-gallery.nc-story-gallery--loop')).not.toBeNull()
    expect(schleife.querySelector('.nc-story-gallery__cursor-paddle.is-visible[data-cursor-dir="next"]')).not.toBeNull()
    expect(unten.querySelector('.nc-story-gallery__paddle--prev').disabled).toBe(true)
  })

  it('hero-tom / hero-tmob: Inhaltsbreite als Modifier, Ton, Badges, Parallax im Hero', () => {
    const breiten = alle('hero-tom', 'content-width').map((d) => d.querySelector('.nc-hero-tom').className)
    expect(breiten).toEqual(['nc-hero-tom', ...['prose', 'narrow', 'content', 'wide', 'xwide', 'full'].map((w) => `nc-hero-tom nc-hero-tom--cw-${w}`)])
    expect(alle('hero-tom', 'badges')[0].querySelector('.nc-hero-tom__copy > .nc-badge-row.nc-hero-tom__badges .nc-label')).not.toBeNull()
    expect(alle('hero-tom', 'default')[0].querySelector('.nc-hero-tom__media').getAttribute('style')).toBe('--tom-expand: 1;')
    const [dunkel, hell] = alle('hero-tmob', 'tone')
    expect(dunkel.querySelector('section').className).toBe('nc-hero-tmob')
    expect(hell.querySelector('section').className).toBe('nc-hero-tmob nc-hero-tmob--light')
    const [mitParallax] = alle('hero-tmob', 'parallax')
    expect(mitParallax.querySelector('.nc-hero-tmob > .nc-parallax-bg + .nc-hero-tmob__content')).not.toBeNull()
    expect(mitParallax.querySelectorAll('.nc-parallax-square')).toHaveLength(32)
    const [imHero] = alle('parallax-bg', 'im-hero')
    expect(imHero.querySelector('.nc-hero-tmob > .nc-parallax-bg').getAttribute('style')).not.toContain('position')
  })

  it('marquee: zwei gleiche Texte (nahtloser Lauf), im Container nach der DS-Regel', () => {
    const [lauf] = alle('marquee', 'default')
    const texte = [...lauf.querySelectorAll('.nc-marquee__track > .nc-marquee__text')].map((e) => e.textContent)
    expect(texte).toHaveLength(2)
    expect(texte[0]).toBe(texte[1])
    expect(alle('marquee', 'im-container')[0].querySelector('.nc-container > .nc-marquee')).not.toBeNull()
    expect(css()).toMatch(/\.nc-container>\.nc-marquee|\.nc-container > \.nc-marquee/)
  })

  it('carousel: Steuerung als Slot, vier Eintraege', () => {
    const [mit, ohne] = alle('carousel', 'controls')
    expect(mit.querySelector('.nc-carousel__controls')).not.toBeNull()
    expect(ohne.querySelector('.nc-carousel__controls')).toBeNull()
    expect(mit.querySelector('.nc-carousel__track').children).toHaveLength(4)
  })

  it('mobile-drawer: geschlossen aus dem Bild, offen mit sichtbarem Backdrop; Unterliste; Hover am ersten Link', () => {
    const [zu, auf] = alle('mobile-drawer', 'zustand')
    expect(zu.querySelector('.nc-mobile-drawer').className).toBe('nc-mobile-drawer')
    expect(zu.querySelector('.nc-mobile-drawer').getAttribute('aria-hidden')).toBe('true')
    expect(zu.querySelector('.nc-mobile-drawer__backdrop--visible')).toBeNull()
    expect(auf.querySelector('.ra-buehne--mobil-drawer > .nc-mobile-drawer.nc-mobile-drawer--open')).not.toBeNull()
    expect(auf.querySelector('.nc-mobile-drawer__backdrop.nc-mobile-drawer__backdrop--visible')).not.toBeNull()
    expect(auf.querySelector('.nc-mobile-drawer__sublist')).toBeNull()
    const [unter] = alle('mobile-drawer', 'unterpunkte')
    expect(unter.querySelectorAll('.nc-mobile-drawer__sublist .nc-mobile-drawer__sublink')).toHaveLength(3)
    expect(unter.querySelector('.nc-mobile-drawer__sublink[aria-current="page"]')).not.toBeNull()
    const [hover] = alle('mobile-drawer', 'hover')
    expect(hover.querySelector('.nc-mobile-drawer__link').getAttribute('data-zustand')).toBe('hover')
  })

  it('table-info-modal: geschlossen ohne is-open, offen mit is-open und Namen; hover/focus am Schliessen-Knopf bei offenem Dialog', () => {
    const [zu, auf] = alle('table-info-modal', 'zustand')
    expect(zu.querySelector('.nc-table-info-modal').className).toBe('nc-table-info-modal')
    expect(auf.querySelector('.ra-buehne > .nc-table-info-modal.is-open[role="dialog"][aria-modal="true"]')).not.toBeNull()
    const name = auf.querySelector('.nc-table-info-modal').getAttribute('aria-labelledby')
    expect(auf.querySelector(`#${name}`).textContent).toBe('Single Sign-on')
    const [hover, fokus] = alle('table-info-modal', 'schliessen')
    expect(hover.querySelector('.nc-table-info-modal.is-open .nc-table-info-modal__close[data-zustand="hover"]')).not.toBeNull()
    expect(fokus.querySelector('.nc-table-info-modal.is-open .nc-table-info-modal__close[data-zustand="focus"]')).not.toBeNull()
  })

  it('navigation-orchestration: fuenf Ebenen; Zustaende am Header; Mobil-Lage mit Panel; Legenden', () => {
    const [standard, gescrollt, versteckt] = alle('navigation-orchestration', 'full-composition')
    for (const sel of ['.nc-shell__navbar > .nc-header', '.nc-nav__inner > .nc-navigation-menu .nc-navigation-menu__trigger', '.nc-nav__actions > .nc-tools > .nc-nav__link > .nc-nav__icon + .nc-nav__label + .nc-nav__badge']) {
      expect(standard.querySelector(sel), sel).not.toBeNull()
    }
    expect(standard.querySelector('.nc-header').className).toBe('nc-header')
    expect(gescrollt.querySelector('.nc-header').className).toBe('nc-header is-scrolled')
    expect(versteckt.querySelector('.nc-header').className).toBe('nc-header is-hidden')
    const [zu, auf] = alle('navigation-orchestration', 'mobile-handoff')
    expect(zu.querySelector('.ra-kopf--mobil .nc-header').className).toBe('nc-header nc-header--mobile')
    expect(auf.querySelector('.nc-header').className).toBe('nc-header nc-header--mobile is-mobile-open')
    expect(auf.querySelector('.nc-mobile-toggle').getAttribute('aria-expanded')).toBe('true')
    expect(auf.querySelector('.nc-header > .nc-mobile-panel .nc-mobile-link')).not.toBeNull()
    expect(alle('navigation-orchestration', 'token-cascade')[0].querySelectorAll('.ra-legende code')).toHaveLength(5)
    const schichten = [...alle('navigation-orchestration', 'z-index-governance')[0].querySelectorAll('.ra-legende code')].map((e) => e.textContent)
    expect(schichten).toEqual(['linkbar', 'footerbar', 'navbar', 'sidebar', 'overlay', 'drawer'].map((s) => `--nc-shell-z-${s}`))
    for (const t of schichten) expect(css()).toContain(t)
  })
})

describe('Bewegung-Block: Abspielen', () => {
  afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals() })

  it('genau die animierten Bloecke haben die Taste; spielbar mit starten(), sonst gesperrt mit Grund', () => {
    const mit = RECIPE_IDS.filter((id) => abspielenFuer(id))
    expect(mit.sort()).toEqual([...ANIMIERT, ...AUS_BLOECKE].sort())
    for (const id of [...SPIELBAR, ...AUS_BLOECKE]) {
      expect(abspielenFuer(id).starten, id).toBeTypeOf('function')
      expect(abspielenFuer(id).gesperrt, id).toBeFalsy()
      expect(abspielenFuer(id).hinweis.length, id).toBeGreaterThan(20)
    }
    for (const id of NUR_GSAP) expect(abspielenFuer(id).gesperrt, id).toMatch(/GSAP/)
    for (const id of NICHT_GEBAUT) expect(abspielenFuer(id).gesperrt, id).toMatch(/^Nicht gebaut/)
  })

  it('kein GSAP im Konfigurator: keine Quelle in src/ importiert gsap oder ScrollTrigger', () => {
    const SRC = resolve(WURZEL, 'apps/theme-configurator/src')
    const dateien = (dir) => readdirSync(dir).flatMap((n) => {
      const p = join(dir, n)
      return statSync(p).isDirectory() ? dateien(p) : /\.(js|vue|ts)$/.test(n) ? [p] : []
    })
    const treffer = dateien(SRC).filter((p) => /from\s+['"](gsap|gsap\/[\w/]+)['"]|import\(['"]gsap/.test(readFileSync(p, 'utf8')))
    expect(treffer).toEqual([])
  })

  it('fade-gallery: wechselt im Takt ueber die Zustandsklassen; Anhalten stellt die Ausgangsansicht her', () => {
    vi.useFakeTimers()
    const zelle = dom(zellen('fade-gallery', 'default')[0].html)
    const anhalten = abspielenFuer('fade-gallery').starten(zelle)
    const aktiv = () => [...zelle.querySelectorAll('.nc-fade-gallery__media')].findIndex((e) => e.classList.contains('is-active'))
    expect(aktiv()).toBe(0)
    vi.advanceTimersByTime(TAKT + 20) // + ein Bild (is-visible im naechsten Frame)
    expect(aktiv()).toBe(1)
    expect(zelle.querySelectorAll('.nc-fade-gallery__tab')[1].getAttribute('aria-selected')).toBe('true')
    expect(zelle.querySelectorAll('.nc-fade-gallery__media')[0].getAttribute('aria-hidden')).toBe('true')
    expect(zelle.querySelectorAll('.nc-fade-gallery__desc')[0].hidden).toBe(true)
    expect(zelle.querySelectorAll('.nc-fade-gallery__desc')[1].hidden).toBe(false)
    anhalten()
    vi.advanceTimersByTime(20)
    expect(aktiv()).toBe(0)
    expect(zelle.querySelectorAll('.nc-fade-gallery__desc')[0].classList.contains('is-visible')).toBe(true)
  })

  it('marquee: DS-Keyframes „marquee" an der Spur, Anhalten nimmt sie wieder weg', () => {
    expect(css()).toMatch(/@keyframes marquee\{/)
    const zelle = dom(zellen('marquee', 'default')[0].html)
    const spur = zelle.querySelector('.nc-marquee__track')
    const anhalten = abspielenFuer('marquee').starten(zelle)
    expect(spur.style.animationName || spur.style.animation).toMatch(/^marquee\b/)
    anhalten()
    expect(spur.getAttribute('style') || '').toBe('')
  })

  it('story-gallery und carousel: die Spur blaettert per scrollTo (Bewegung aus dem DS), Paddles sperren sich, Anhalten springt zurueck', () => {
    vi.useFakeTimers()
    for (const [id, spurSel] of [['story-gallery', '.nc-story-gallery__scroll'], ['carousel', '.nc-carousel__track']]) {
      const zelle = dom(zellen(id, null)[0].html)
      const spur = zelle.querySelector(spurSel)
      const aufrufe = []
      spur.scrollTo = (o) => aufrufe.push(o)
      const anhalten = abspielenFuer(id).starten(zelle)
      vi.advanceTimersByTime(TAKT)
      expect(aufrufe.at(-1)?.behavior, id).toBe('smooth')
      if (id === 'story-gallery') {
        expect(zelle.querySelector('.nc-story-gallery__paddle--prev').disabled).toBe(false)
      }
      anhalten()
      expect(aufrufe.at(-1), id).toEqual({ left: 0, behavior: 'auto' })
      if (id === 'story-gallery') expect(zelle.querySelector('.nc-story-gallery__paddle--prev').disabled).toBe(true)
    }
  })

  async function arena (id) {
    const w = mount(RecipeArena, { props: { componentId: id }, attachTo: document.body })
    await vi.dynamicImportSettled()
    await flushPromises()
    return w
  }

  it('RecipeArena: Taste „Abspielen" (aria-pressed), gesperrt mit Grund, ohne Vorlage-Export keine Taste', async () => {
    const fade = await arena('fade-gallery')
    const taste = fade.find('[data-test="abspielen"]')
    expect(taste.exists()).toBe(true)
    expect(taste.text()).toBe('Abspielen')
    expect(taste.attributes('disabled')).toBeUndefined()
    expect(taste.attributes('aria-pressed')).toBe('false')
    // ohne Behavior keine Knoepfe Zustände/Ausprobieren
    expect(fade.findAll('.ra-modus__knopf')).toHaveLength(1)
    await taste.trigger('click')
    expect(taste.attributes('aria-pressed')).toBe('true')
    await taste.trigger('click')
    expect(taste.attributes('aria-pressed')).toBe('false')
    fade.unmount()

    const tom = await arena('hero-tom')
    expect(tom.find('[data-test="abspielen"]').attributes('disabled')).toBeDefined()
    expect(tom.find('[data-test="abspielen-hinweis"]').text()).toMatch(/GSAP/)
    tom.unmount()

    const knopf = await arena('mobile-drawer')
    expect(knopf.find('[data-test="abspielen"]').exists()).toBe(false)
    expect(knopf.find('.ra-modus').exists()).toBe(false)
    knopf.unmount()
  })

  it('RecipeArena: prefers-reduced-motion sperrt die Taste', async () => {
    vi.stubGlobal('matchMedia', (q) => ({ matches: q.includes('prefers-reduced-motion'), media: q, addEventListener () {}, removeEventListener () {} }))
    const w = await arena('carousel')
    const taste = w.find('[data-test="abspielen"]')
    expect(taste.attributes('disabled')).toBeDefined()
    expect(w.find('[data-test="abspielen-hinweis"]').text()).toMatch(/prefers-reduced-motion/)
    w.unmount()
  })
})
