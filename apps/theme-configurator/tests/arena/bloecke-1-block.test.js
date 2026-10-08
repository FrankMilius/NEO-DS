/**
 * Plan v3, Phase 4 (duenne Recipes), Gruppe „bloecke-1": app-store,
 * aspect-ratio, bento-grid, card-cta, card-grid-cta, chapter-nav, cta,
 * device, event, events, expanding-panels, facts, faq, feature-accordion,
 * feature-list, header. Geprueft wird:
 *   - mindestens zwei Specimens je Recipe, Recipe-Version ab 1.1.0 mit
 *     Phase-4-Eintrag im Changelog; jede Zelle jedes Specimens aus der Vorlage (beide
 *     Ansichten), keine Sonderfall-Arena
 *   - echtes DS-Markup: Wurzel des Bauteils, nur Klassen aus styles.css bzw.
 *     der Anatomie, Arena-Klassen nie an DS-Elementen; Inline-Stile nur, wo
 *     das geerntete Markup oder ein Instanzwert sie traegt; keine
 *     Zustandsklassen, die das DS am Bauteil nicht kennt
 *   - je Bauteil die Specimen-Besonderheiten (Formen der Kapitelnavigation,
 *     Abspielen der Einblendung, Bildlagen, Ton, Leerzustand …)
 *   - „Ausprobieren" fuer die Bauteile mit Behavior in neo-behaviors
 *     (MIT_BEHAVIOR, Entscheidung 06.10.2026, website-verhalten; Tests in
 *     tests/behaviors/website-behaviors.test.js) und fuer faq (natives
 *     <details>, eigener Hinweis der Vorlage), „Abspielen" nur fuer
 *     bento-grid (gemeinsamer Mechanismus der RecipeArena), Entwurf laut
 *     meta.status in der Liste der Navigation (src/data/recipe-entwuerfe.js;
 *     das Kennzeichen selbst prueft tests/navigation/entwuerfe.test.js)
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { mount, flushPromises } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import { MIT_VERHALTEN } from 'neo-behaviors'
import RecipeArena from '../../src/components/laboratory/RecipeArena.vue'
import { vorlageFuer, ausprobierenFuer, abspielenFuer } from '../../src/arena-templates/index.js'
import { istEntwurf } from '../../src/data/recipe-entwuerfe.js'
import { normalisiereRecipe, specimenAnsicht, fuerWeiteresThema } from '../../src/lib/recipe-arena.js'
import { hasArena, arenaQuelle } from '../../src/composables/useArenaResolver.js'
import { WURZEL, rohesRecipe } from './_recipes.js'

const BLOCK = ['app-store', 'aspect-ratio', 'bento-grid', 'card-cta', 'card-grid-cta', 'chapter-nav', 'cta',
  'device', 'event', 'events', 'expanding-panels', 'facts', 'faq', 'feature-accordion', 'feature-list', 'header']

// Wurzel je Bauteil (chapter-nav: je Form, siehe eigener Test)
const WURZEL_SEL = {
  'chapter-nav': '.nc-chapter-nav, .nc-chapter-toc, .nc-chapter-anchor',
  facts: '.nc-facts-block',
  'feature-accordion': '.nc-feature-accordeon',
  header: 'header.header'
}
const wurzelSel = (id) => WURZEL_SEL[id] || `.nc-${id}`

const MIT_BEHAVIOR = ['chapter-nav', 'expanding-panels', 'feature-accordion']
const MIT_AUSPROBIEREN = ['faq', 'feature-accordion'].filter((id) => !MIT_BEHAVIOR.includes(id))
const MIT_ABSPIELEN = ['bento-grid']
const ENTWURF = ['events', 'feature-list']

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
const alle = (id, sp, optionen) => zellen(id, sp, optionen).map((z) => dom(z.html))

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

// Klassen, die das geerntete Website-Markup traegt (Drupal gibt sie aus), das
// DS aber nicht gestaltet — gemeldet, nicht stillschweigend gebaut.
// Stand 06.10.2026 (Entscheidung event-klassen): nc-section--muted ist gebaut,
// die Tag-Modifier --format/--lang sind aus Markup und Vorlage gestrichen.
const GEERNTET_OHNE_CSS = {}

// Inline-Stile, die das geerntete Markup bzw. ein Instanzwert traegt — alles
// andere ist Gestaltung an der Vorlage vorbei.
const KNOPF_VARS = /^--nc-button-(primary|ghost)-/
function stilErlaubt (id, el) {
  const stil = el.getAttribute('style')
  if (['card-cta', 'card-grid-cta'].includes(id) && el.matches('.nc-button')) return KNOPF_VARS.test(stil)
  if (id === 'card-grid-cta' && el.matches('.nc-card-cta__title')) return /^max-width: \d+%;$/.test(stil)
  if (id === 'card-grid-cta' && el.matches('.nc-card-grid-cta')) return /^--cgc-columns: \d+; --cgc-ratio: [\d/]+;$/.test(stil)
  if (id === 'aspect-ratio' && el.matches('.nc-aspect-ratio')) return /^--nc-aspect-ratio-ratio: [\d\s/]+;$/.test(stil)
  // cta: Farbangaben aus data/markup/cta.html (Text auf dunkler Flaeche)
  if (id === 'cta') return el.closest('.nc-cta') && /always-light/.test(stil)
  // chapter-nav „Ausprobieren": Instanzwerte am Rahmen der kleinen Seite
  if (id === 'chapter-nav' && el.matches('.ra-kapitelseite')) return stil.split(';').map((t) => t.trim()).filter(Boolean).every((t) => t.startsWith('--mod-chapternav-'))
  return false
}

describe('Bloecke 1 aus dem Recipe (Plan v3, Phase 4)', () => {
  const bekannt = dsKlassen()

  for (const id of BLOCK) {
    describe(id, () => {
      it('mindestens zwei Specimens, Recipe ab 1.1.0 mit Changelog-Eintrag der Phase 4', () => {
        const r = rohesRecipe(id)
        expect(r.specimens.length).toBeGreaterThanOrEqual(2)
        // Spaetere Entscheidungen (z. B. 06.10.2026) setzen die Version weiter
        // hoch — der Eintrag der Phase 4 bleibt im Changelog.
        expect(r.meta.changelog[0].version).toBe(r.meta.version)
        const p4 = r.meta.changelog.find((e) => e.changes[0]?.includes('Plan v3, Phase 4'))
        expect(p4?.version).toBe('1.1.0')
        expect(new Set(r.specimens.map((s) => s.id)).size).toBe(r.specimens.length)
      })

      it('keine Sonderfall-Arena, jede Zelle jedes Specimens aus der Vorlage (beide Ansichten)', () => {
        expect(hasArena(id)).toBe(false)
        expect(arenaQuelle(id)).toBe('recipe')
        expect(vorlageFuer(id)).toBeTypeOf('function')
        const recipe = normalisiereRecipe(rohesRecipe(id))
        expect(recipe.arena.hinweise.filter((h) => /Specimen/.test(h))).toEqual([])
        for (const optionen of [{}, { ausprobieren: true }]) {
          const z = zellen(id, null, optionen)
          expect(new Set(z.map((c) => c.quelle))).toEqual(new Set(['vorlage']))
          expect(z.filter((c) => c.fehler)).toEqual([])
          expect(new Set(z.map((c) => c.specimen.id))).toEqual(new Set(recipe.specimens.map((s) => s.id)))
        }
      })

      it('echtes DS-Element, nur Klassen aus styles.css bzw. der Anatomie, Arena-Klassen nie am DS-Element', () => {
        const anatomie = anatomieKlassen(id)
        for (const z of beideModi(id)) {
          const d = dom(z.html)
          expect(d.querySelector(wurzelSel(id)), `${z.specimen.id}/${z.id}`).not.toBeNull()
          for (const el of d.querySelectorAll('[class]')) {
            for (const k of el.classList) {
              if (/^(nc|fnd|u|o)-/.test(k)) {
                const geerntet = GEERNTET_OHNE_CSS[id]?.includes(k)
                expect(bekannt.has(k) || anatomie.has(k) || geerntet, `${id}: Klasse ${k} fehlt in styles.css`).toBe(true)
              }
              if (/^ra-/.test(k)) expect(el.className, `${id}: Arena-Klasse ${k} an einem DS-Element`).not.toMatch(/(^|\s)(nc|fnd|o)-|(^|\s)header(\s|$)/)
            }
          }
        }
      })

      it('Inline-Stile nur aus geerntetem Markup oder als Instanzwert; keine fremden Zustandsklassen', () => {
        for (const z of beideModi(id)) {
          const d = dom(z.html)
          for (const el of d.querySelectorAll('[style]')) {
            expect(stilErlaubt(id, el), `${id}/${z.specimen.id}: ${el.outerHTML.slice(0, 140)}`).toBeTruthy()
          }
          expect(d.querySelector('.is-open, .is-selected, .is-disabled, [data-state]'), `${id}/${z.specimen.id}`).toBeNull()
          for (const el of d.querySelectorAll('.is-active')) expect(el.matches('.nc-feature-accordeon__link'), `${id}: is-active an ${el.className}`).toBe(true)
          for (const el of d.querySelectorAll('.is-revealed')) expect(el.matches('.nc-bento-grid[data-animation="reveal"]')).toBe(true)
          if (!z.nurInteraktiv) expect(d.querySelector('[data-zustand]'), `${id}/${z.specimen.id}`).toBeNull()
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
})

describe('Bloecke 1: Specimens im Einzelnen', () => {
  it('geerntet ohne CSS: die Liste ist ehrlich (jede Klasse fehlt wirklich in styles.css)', () => {
    const bekannt = dsKlassen()
    for (const klassen of Object.values(GEERNTET_OHNE_CSS)) for (const k of klassen) expect(bekannt.has(k), `${k} ist inzwischen gestaltet — Eintrag entfernen`).toBe(false)
  })

  it('app-store: Musterseite ohne Abzeichen und QR, dunkle Flaeche als Theme-Bereich, zentriert per Modifier', () => {
    const [website] = alle('app-store', 'website')
    expect(website.querySelector('.nc-app-store__badges, .nc-app-store__qr')).toBeNull()
    expect(website.querySelector('.nc-app-store__note')).not.toBeNull()
    const flaeche = zellen('app-store', 'flaeche')
    expect(flaeche.map((z) => z.flaeche)).toEqual([null, 'dunkel'])
    expect(dom(flaeche[1].html).querySelector('.nc-app-store--on-dark .nc-app-store__badges')).not.toBeNull()
    expect(alle('app-store', 'ausrichtung').map((d) => !!d.querySelector('.nc-app-store--center'))).toEqual([false, true])
  })

  it('aspect-ratio: eigenes Verhaeltnis als Instanzwert, ueberschreibt das Preset am selben Element', () => {
    const [d] = alle('aspect-ratio', 'eigenes-verhaeltnis')
    const el = d.querySelector('.nc-aspect-ratio')
    expect(el.getAttribute('style')).toBe('--nc-aspect-ratio-ratio: 21 / 9;')
    expect([...el.classList].filter((k) => k.startsWith('nc-aspect-ratio--'))).toEqual(['nc-aspect-ratio--16-9'])
  })

  it('bento-grid: Spalten per Modifier, Einblenden als Endzustand mit „Abspielen", Bildlagen aus dem SCSS', async () => {
    expect(alle('bento-grid', 'spalten').map((d) => d.querySelector('.nc-bento-grid').classList.contains('nc-bento-grid--cols-3'))).toEqual([false, true])
    const [statisch] = alle('bento-grid', 'default-4col')
    expect(statisch.querySelector('[data-animation]')).toBeNull()

    const [einblenden] = alle('bento-grid', 'einblenden')
    const raster = einblenden.querySelector('.nc-bento-grid')
    expect(raster.matches('[data-animation="reveal"].is-revealed')).toBe(true)
    // keine eigene Taste im Zellen-Markup: „Abspielen" ist die Taste der Arena
    expect(einblenden.querySelector('button:not(.nc-button)')).toBeNull()

    document.body.appendChild(einblenden)
    const anhalten = abspielenFuer('bento-grid').starten(einblenden)
    expect(raster.classList.contains('is-revealed')).toBe(false)
    await new Promise((r) => requestAnimationFrame(r))
    expect(raster.classList.contains('is-revealed')).toBe(true)
    anhalten()
    expect(raster.classList.contains('is-revealed')).toBe(true)
    einblenden.remove()
    // ohne Einblendung bleibt die Zelle unberuehrt
    const vorher = statisch.innerHTML
    abspielenFuer('bento-grid').starten(statisch)()
    expect(statisch.innerHTML).toBe(vorher)

    const [medien] = alle('bento-grid', 'medienlagen')
    const lagen = [...medien.querySelectorAll('.nc-bento-grid__cell')].map((c) => c.dataset.mediaPos)
    expect(lagen).toEqual(rohesRecipe('bento-grid').specimens.find((s) => s.id === 'medienlagen').render.medienLagen)
    for (const c of medien.querySelectorAll('.nc-bento-grid__cell')) {
      expect(c.querySelector(':scope > .nc-bento-grid__media img')).not.toBeNull()
      expect(c.querySelector(':scope > .nc-bento-grid__content .nc-bento-grid__title')).not.toBeNull()
      expect(!!c.querySelector('.nc-bento-grid__scrim')).toBe(c.dataset.mediaPos === 'cover')
    }
    expect(medien.querySelector('[data-media-pos="cover"]').classList.contains('neo-dark-theme')).toBe(true)
  })

  it('card-cta: Ton als data-theme; heller Knopf nur auf dunkler Karte; Hover nur interaktiv', () => {
    const ton = alle('card-cta', 'ton')
    expect(ton.map((d) => d.querySelector('.nc-card-cta').dataset.theme)).toEqual(['dark', 'light'])
    expect(ton.map((d) => d.querySelector('.nc-button').hasAttribute('style'))).toEqual([true, false])
    const hover = zellen('card-cta', 'hover')
    expect(hover.map((z) => z.nurInteraktiv)).toEqual([false, true])
  })

  it('card-grid-cta: Website mit Instanzwerten (2 Spalten, 4/3), ohne Instanzwerte sechs Kacheln', () => {
    const [website] = alle('card-grid-cta', 'default')
    expect(website.querySelector('.nc-card-grid-cta').getAttribute('style')).toBe('--cgc-columns: 2; --cgc-ratio: 4/3;')
    expect(website.querySelectorAll('.nc-card-cta')).toHaveLength(4)
    const [ohne] = alle('card-grid-cta', 'ohne-instanzwerte')
    expect(ohne.querySelector('.nc-card-grid-cta').hasAttribute('style')).toBe(false)
    expect(ohne.querySelectorAll('.nc-card-cta')).toHaveLength(6)
  })

  it('chapter-nav: Leiste, Verzeichnis und Sprungziel mit je eigener Wurzel', () => {
    expect(rohesRecipe('chapter-nav').styling.baseClasses).toEqual(['nc-chapter-nav'])
    const [leiste, verzeichnis, keine] = alle('chapter-nav', 'formen')
    const nav = leiste.querySelector('nav.nc-chapter-nav')
    expect(nav.classList.contains('nc-chapter-toc')).toBe(false)
    expect(nav.querySelectorAll('.nc-chapter-nav__inner > .nc-chapter-nav__link')).toHaveLength(5)
    expect(nav.querySelectorAll('[aria-current="true"]')).toHaveLength(1)

    const toc = verzeichnis.querySelector('nav.nc-chapter-toc')
    expect(toc.classList.contains('nc-chapter-nav')).toBe(false)
    expect(toc.querySelector('.nc-chapter-toc__title')).not.toBeNull()
    expect(toc.querySelectorAll('ol.nc-chapter-toc__list > li.nc-chapter-toc__item > a.nc-chapter-toc__link')).toHaveLength(5)
    expect(toc.querySelector('.nc-chapter-nav__link')).toBeNull()

    expect(keine.querySelector('nav')).toBeNull()
    expect(keine.querySelector('.nc-chapter-anchor[id]')).not.toBeNull()

    const [schmal] = alle('chapter-nav', 'schmal')
    const links = [...schmal.querySelectorAll('.ra-schmal > .nc-chapter-nav .nc-chapter-nav__link')]
    expect(links).toHaveLength(9)
    expect(links.findIndex((a) => a.hasAttribute('aria-current'))).toBe(1)
  })

  it('cta: eigene Flaeche (--nc-cta-bg), Spalten nur fuer vorhandene Bereiche, optionale Spalten per Specimen (Entscheidung 06.10.2026)', () => {
    expect(css()).toMatch(/\.nc-cta\{background:var\(--mod-cta-bg, ?var\(--nc-cta-bg\)\)/)
    expect(css()).toMatch(/--nc-cta-bg: ?var\(--fnd-color-always-dark\)/)
    expect(css()).toMatch(/\.nc-cta\{grid-template-columns:none;grid-auto-flow:column;grid-auto-columns:minmax\(0, ?1fr\)\}/)
    for (const z of zellen('cta')) {
      expect(z.flaeche, z.specimen.id).toBeNull()
      expect(dom(z.html).querySelector('.ra-desktop > .nc-cta'), z.specimen.id).not.toBeNull()
      expect(dom(z.html).querySelector('.ra-grund-dunkel'), z.specimen.id).toBeNull()
    }
    const teile = (sp) => ['mid', 'right'].filter((t) => alle('cta', sp)[0].querySelector(`.nc-cta__${t}`))
    expect(teile('default')).toEqual(['mid', 'right'])
    expect(teile('nur-newsletter')).toEqual(['mid'])
    expect(teile('nur-demo')).toEqual(['right'])
    expect(teile('nur-text')).toEqual([])
  })

  it('device: Groessen, Neigung und Aussparung per Modifier, Beschriftung als figure', () => {
    const mods = (sp) => alle('device', sp).map((d) => [...d.querySelector('.nc-device').classList].filter((k) => k.startsWith('nc-device--')).join(' '))
    expect(mods('groessen')).toEqual(['nc-device--sm', '', 'nc-device--lg'])
    expect(mods('neigung')).toEqual(['nc-device--sm', 'nc-device--sm nc-device--tilt-left', 'nc-device--sm nc-device--tilt-right'])
    expect(mods('aussparung')).toEqual(['nc-device--sm', 'nc-device--sm nc-device--plain'])
    const [fig] = alle('device', 'mit-beschriftung')
    expect(fig.querySelector('figure.nc-device-figure > .nc-device + figcaption.nc-device-figure__caption .nc-device-figure__name')).not.toBeNull()
  })

  it('event: Hero-Bild mit Verlauf, Infokarte im Inhaltsraster, Pflichtteile', () => {
    const [bild] = alle('event', 'hero-bild')
    expect(bild.querySelector('.nc-event__hero > .nc-event__hero-media img + *, .nc-event__hero > .nc-event__hero-media + .nc-event__hero-overlay')).not.toBeNull()
    const [karte] = alle('event', 'infokarte')
    // wie node--event--full.html.twig: Beschreibung links, <aside> mit Infokarte rechts, Agenda danach (Freigabe 08.10.2026)
    expect(karte.querySelector('.nc-event__content-grid > .nc-event__description.u-prose + aside.nc-event__sidebar > .nc-event__info-card')).not.toBeNull()
    expect(karte.querySelector('.nc-event__content-grid .nc-event__agenda')).toBeNull()
    expect(karte.querySelector('.nc-event__content-grid .nc-event__info-card .nc-event__info-list dt + dd')).not.toBeNull()
    expect(karte.querySelector('.nc-event__info-card .nc-button.nc-event__info-cta')).not.toBeNull()
    const [minimal] = alle('event', 'minimal')
    expect(minimal.querySelector('.nc-event__tags, .nc-event__subtitle, .nc-event__meta, .nc-event__related-grid')).toBeNull()
    expect(minimal.querySelector('.nc-event__title')).not.toBeNull()
  })

  it('events: Leerzustand ohne Raster, nur Raster ohne Filter und „Mehr laden"', () => {
    const [leer] = alle('events', 'leer')
    expect(leer.querySelector('.nc-events__empty')).not.toBeNull()
    expect(leer.querySelector('.nc-events__grid, .nc-events__load-more')).toBeNull()
    expect(leer.querySelector('.nc-events__results-count').textContent).toMatch(/^0 /)
    const [raster] = alle('events', 'nur-raster')
    expect(raster.querySelector('.nc-events__filter-bar, .nc-events__results-count, .nc-events__load-more')).toBeNull()
    expect(raster.querySelectorAll('.nc-events__grid > .nc-events__card').length).toBeGreaterThan(0)
  })

  it('expanding-panels: Standard alle zu, Geoeffnet das erste; ohne Deko keine Nummer und kein Hintergrund', () => {
    const offen = (d) => [...d.querySelectorAll('.nc-expanding-panels__panel')].map((p) => p.getAttribute('aria-expanded'))
    expect(alle('expanding-panels', 'default').map(offen)).toEqual([
      ['false', 'false', 'false', 'false'],
      ['true', 'false', 'false', 'false']
    ])
    const [ohne] = alle('expanding-panels', 'ohne-deko')
    expect(ohne.querySelector('.nc-expanding-panels__num, .nc-expanding-panels__bg')).toBeNull()
    expect(offen(ohne)[0]).toBe('true')
  })

  it('facts: lange Werte aus dem Specimen, maskiert', () => {
    const [d] = alle('facts', 'lange-werte')
    expect(d.querySelectorAll('.nc-facts-list > .nc-facts-term')).toHaveLength(3)
    expect(d.querySelector('.nc-facts-title')).not.toBeNull()
  })

  it('faq: Standard alle zu, Geoeffnet der erste, mehrere zugleich offen; Ausprobieren startet zu', () => {
    const offen = (d) => [...d.querySelectorAll('details.nc-faq__item')].map((e) => e.hasAttribute('open'))
    expect(alle('faq', 'default').map(offen)).toEqual([[false, false, false], [true, false, false]])
    expect(alle('faq', 'mehrere-offen').map(offen)).toEqual([[true, false, true]])
    for (const d of alle('faq', 'default', { ausprobieren: true })) expect(offen(d)).toEqual([false, false, false])
  })

  it('feature-accordion: Zustaende am <details>, Titel optional, aktiver Link', () => {
    const offen = (d) => [...d.querySelectorAll('details.nc-feature-accordeon__item')].map((e) => e.hasAttribute('open'))
    expect(alle('feature-accordion', 'default').map(offen)).toEqual([[true, false, false], [true, true, false]])
    const [ohne] = alle('feature-accordion', 'ohne-titel')
    expect(ohne.querySelector('.nc-feature-accordeon__title')).toBeNull()
    expect(ohne.querySelectorAll('.nc-feature-accordeon__link.is-active')).toHaveLength(1)
  })

  it('feature-list: Website mit Geraet rechts oben, ohne Medium keine Medien-Klassen, Bild statt Geraet', () => {
    const klassen = (d) => [...d.querySelector('.nc-feature-list').classList].filter((k) => k.startsWith('nc-feature-list--')).sort()
    const [website] = alle('feature-list', 'default')
    expect(klassen(website)).toEqual(['nc-feature-list--media-right', 'nc-feature-list--valign-top', 'nc-feature-list--with-media'])
    expect(website.querySelector('.nc-feature-list__media--device > .nc-device')).not.toBeNull()
    const [ohne] = alle('feature-list', 'ohne-medium')
    expect(klassen(ohne)).toEqual([])
    expect(ohne.querySelector('.nc-feature-list__media')).toBeNull()
    expect(alle('feature-list', 'ausrichtung').map((d) => klassen(d).find((k) => k.includes('valign')))).toEqual([
      'nc-feature-list--valign-top', 'nc-feature-list--valign-middle', 'nc-feature-list--valign-bottom'
    ])
    const [bild] = alle('feature-list', 'mit-bild')
    expect(bild.querySelector('.nc-feature-list__media:not(.nc-feature-list__media--device) > img')).not.toBeNull()
    expect(bild.querySelector('.nc-device')).toBeNull()
  })

  it('header: im Rahmen ra-desktop/ra-bildschirm statt Inline-Stilen, verborgen per .nav-hidden, Conversion optional', () => {
    const [standard, verborgen] = alle('header', 'default')
    expect(standard.querySelector('.ra-desktop > .ra-bildschirm > header.header > .nav-wrapper:not(.nav-hidden)')).not.toBeNull()
    expect(verborgen.querySelector('.nav-wrapper.nav-hidden')).not.toBeNull()
    expect(verborgen.querySelector('.conversion')).not.toBeNull()
    expect(alle('header', 'ohne-conversion')[0].querySelector('.conversion')).toBeNull()
  })
})

describe('Bloecke 1 in der RecipeArena', () => {
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
    const behavior = MIT_BEHAVIOR.includes(id)
    const ausprobieren = MIT_AUSPROBIEREN.includes(id)
    const abspielen = MIT_ABSPIELEN.includes(id)
    const entwurf = ENTWURF.includes(id)
    it(`${id}: alle Specimens${ausprobieren || behavior ? ', „Ausprobieren"' : ''}${abspielen ? ', „Abspielen"' : ''}${entwurf ? ', Entwurf' : ''}, keine Heuristik`, async () => {
      expect(MIT_VERHALTEN.includes(id)).toBe(behavior)
      expect(!!ausprobierenFuer(id)).toBe(ausprobieren)
      expect(!!abspielenFuer(id)).toBe(abspielen)
      expect(rohesRecipe(id).meta.status === 'draft').toBe(entwurf)
      expect(istEntwurf(id)).toBe(entwurf)
      const w = await arena(id)
      const recipe = normalisiereRecipe(rohesRecipe(id))
      expect(w.findAll('.ra-specimen').length).toBe(recipe.specimens.length)
      expect(w.find('[data-quelle="heuristik"]').exists()).toBe(false)
      expect(w.find('.ra-modus').exists()).toBe(ausprobieren || abspielen || behavior)
      expect(w.find('[data-test="abspielen"]').exists()).toBe(abspielen)
      if (ausprobieren) {
        await w.findAll('.ra-modus__knopf')[1].trigger('click')
        await flushPromises()
        expect(w.findAll('.ra-cell')).toHaveLength(recipe.specimens.length)
        expect(w.find('.ra-modus__hinweis').text()).toContain('<details>')
        // natives <details>: keine Bindung aus neo-behaviors
        expect(w.find('[data-neo-behavior]').exists()).toBe(false)
      }
      if (behavior) {
        await w.findAll('.ra-modus__knopf')[1].trigger('click')
        await flushPromises()
        await new Promise((r) => setTimeout(r, 0))
        expect(w.findAll('.ra-cell')).toHaveLength(recipe.specimens.length)
        expect(w.find(`[data-neo-behavior~="${id}"]`).exists()).toBe(true)
      }
      w.unmount()
    })
  }
})
