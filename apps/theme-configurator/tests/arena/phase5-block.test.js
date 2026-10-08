/**
 * Plan v3, Phase 5: Recipes fuer die Bausteine ohne Recipe (Inventur:
 * docs/phase5-inventur.md). Neu sind vier Objects (container-intent,
 * content, media-frame, prose), ein Molekuel (section-header), vier
 * Website-Bloecke (accordion-block, block-bundle, reference-page, text-cta).
 * Die Templates sind stillgelegt, Ersatz sind die Shell-Presets
 * (data-layout): content-page und form-page am 07.10.2026, dashboard,
 * error-page, home-basic, home-hero und settings-page — in Phase 5 noch als
 * Recipe-Entwurf angelegt — am 08.10.2026. Geprueft wird:
 *   - Recipe angelegt als 1.0.0 mit Changelog der Phase 5, Kennzeichen
 *     „Entwurf" (recipe-entwuerfe.js) solange draft — freigegebene Recipes
 *     (Abschluss Plan v3, 08.10.2026) stehen auf stable — und Sektion in der
 *     Navigation (Templates mit Recipe zeigen die RecipeArena)
 *   - keine Sonderfall-Arena, jede Zelle jedes Specimens aus der Vorlage,
 *     mindestens zwei Specimens, jeder Achsenwert und Zustand mit Zelle
 *   - echtes DS-Markup: Wurzel aus dem Recipe, nur Klassen aus styles.css,
 *     der Anatomie oder dem geernteten Markup eines enthaltenen Bauteils;
 *     Arena-Klassen nie an DS-Elementen, keine Inline-Gestaltung ausser
 *     Instanzwerten wie in Drupal
 *   - Recipe-Modifier ohne CSS nur als „nicht gebaut" (text-cta --no-card ist
 *     seit der Entscheidung Phase 5 vom 07.10.2026 gebaut)
 *   - andere Bauteile im Markup sind erklaert (composes je Specimen — ohne
 *     geerntetes Markup haelt eine komposition die Pruefung nicht); die
 *     Eltern der neuen Wurzeln (.nc-section-header, .nc-media-frame) nennen
 *     sie ebenfalls
 *   - Teile anderer Bauteile (Einordnung b) stehen in deren Anatomie
 */
import { describe, it, expect } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { vorlageFuer, ausprobierenFuer, abspielenFuer } from '../../src/arena-templates/index.js'
import { OHNE_CSS as TEXT_CTA_OHNE_CSS } from '../../src/arena-templates/text-cta.js'
import { normalisiereRecipe, specimenAnsicht, fuerWeiteresThema } from '../../src/lib/recipe-arena.js'
import { hasArena, arenaQuelle } from '../../src/composables/useArenaResolver.js'
import { istEntwurf } from '../../src/data/recipe-entwuerfe.js'
import { navigationTree } from '../../src/data/navigation-builder.js'
import { RECIPE_IDS, WURZEL, rohesRecipe } from './_recipes.js'

const OBJECTS = ['container-intent', 'content', 'media-frame', 'prose']
const BAUTEILE = ['section-header', 'accordion-block', 'block-bundle', 'reference-page', 'text-cta']
// Stillgelegt (Entscheidung 08.10.2026) — kein SCSS, kein Recipe, keine Sektion mehr
const STILLGELEGT = {
  dashboard: { klasse: 't-dashboard', layout: 'dashboard' },
  'error-page': { klasse: 't-error', layout: 'focused' },
  'home-basic': { klasse: 't-home-basic', alt: 'home-basic', layout: 'landing' },
  'home-hero': { klasse: 't-home-hero', alt: 'home-hero', layout: 'landing' },
  'settings-page': { klasse: 't-settings', layout: 'settings' }
}
const BLOCK = [...OBJECTS, ...BAUTEILE]

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

/** Klassen aus dem geernteten Markup der enthaltenen Bauteile (Website-Klassen ohne eigene Regel, z. B. nc-accordion__trigger-text). */
function geernteteKlassen (id) {
  const k = new Set()
  const teile = enthaelt(id)
  for (const sp of rohesRecipe(id).specimens || []) for (const c of sp.composes || []) teile.add(c)
  for (const anderes of teile) {
    const datei = resolve(WURZEL, `data/markup/${anderes}.html`)
    if (!existsSync(datei)) continue
    for (const m of readFileSync(datei, 'utf8').matchAll(/class="([^"]*)"/g)) {
      for (const c of m[1].split(/\s+/)) if (c) k.add(c)
    }
  }
  return k
}

// Instanzwerte, die Drupal je Block inline setzt — sonst keine Inline-Gestaltung.
const INLINE_ERLAUBT = {
  // field_tc_card_bg -> style="--mod-card-bg: …" am .nc-card
  'text-cta': (el) => el.matches('.nc-text-cta__card') && /^--mod-card-bg:/.test(el.getAttribute('style'))
}

// Recipe-Modifier ohne CSS — Entscheidungsfall im Bericht (Plan v3, Phase 5)
const MODIFIER_OHNE_CSS = { 'text-cta': Object.fromEntries(TEXT_CTA_OHNE_CSS.map((k) => [k, 'Drupal setzt ihn ohne Karte'])) }

const modifier = (id) => Object.values(normalisiereRecipe(rohesRecipe(id)).axes || {})
  .flatMap((a) => Object.values(a.values || {}))
  .flatMap((v) => (v?.modifier ? String(v.modifier).split(/\s+/).map((k) => k.replace(/^\./, '')) : []))

function navEintraege (knoten = navigationTree, ziel = []) {
  for (const k of knoten) {
    if (k.section) ziel.push(k)
    if (Array.isArray(k.children)) navEintraege(k.children, ziel)
  }
  return ziel
}

describe('Phase 5: Recipes fuer Bausteine ohne Recipe (Plan v3)', () => {
  const bekannt = dsKlassen()

  for (const id of BLOCK) {
    describe(id, () => {
      it('Recipe angelegt als 1.0.0 mit Changelog der Phase 5, Kennzeichen „Entwurf" solange draft, Sektion in der Navigation', () => {
        const meta = rohesRecipe(id).meta
        // Abschluss Plan v3 (08.10.2026): freigegebene Recipes stehen auf stable
        expect(['draft', 'stable']).toContain(meta.status)
        const entwurf = meta.status === 'draft'
        // Spaetere Entscheidungen (text-cta --no-card, section-header Kicker
        // im Dunkeln, 07.10.2026) erhoehen die Version; der aelteste Eintrag
        // bleibt die Anlage in Phase 5, der neueste die aktuelle Version.
        const anlage = meta.changelog[meta.changelog.length - 1]
        expect(anlage.version).toBe('1.0.0')
        expect(anlage.changes.join(' ')).toMatch(/Plan v3, Phase 5/)
        expect(meta.changelog[0].version).toBe(meta.version)
        if (!entwurf) expect(meta.changelog.some((e) => /^Freigabe \(Abschluss Plan v3, 08\.10\.2026\)/.test(e.changes[0])), 'Freigabe im Changelog').toBe(true)
        expect(istEntwurf(id)).toBe(entwurf)
        const eintrag = navEintraege().find((e) => e.section === `component-${id}`)
        expect(eintrag, `component-${id} in der Navigation`).toBeTruthy()
        expect(!!eintrag.entwurf).toBe(entwurf)
      })

      it('keine Sonderfall-Arena, jede Zelle jedes Specimens aus der Vorlage (beide Ansichten)', () => {
        expect(hasArena(id)).toBe(false)
        expect(arenaQuelle(id)).toBe('recipe')
        expect(vorlageFuer(id)).toBeTypeOf('function')
        const recipe = normalisiereRecipe(rohesRecipe(id))
        expect(recipe.arena.hinweise).toEqual([])
        for (const optionen of [{}, { ausprobieren: true }]) {
          const z = zellen(id, optionen)
          expect(new Set(z.map((c) => c.quelle))).toEqual(new Set(['vorlage']))
          expect(z.filter((c) => c.fehler)).toEqual([])
          expect(new Set(z.map((c) => c.specimen.id))).toEqual(new Set(recipe.specimens.map((s) => s.id)))
        }
      })

      it('mindestens zwei Specimens; jeder Achsenwert und jeder Zustand hat eine Zelle', () => {
        const recipe = normalisiereRecipe(rohesRecipe(id))
        expect(recipe.specimens.length).toBeGreaterThanOrEqual(2)
        const z = zellen(id)
        for (const [achse, def] of Object.entries(recipe.axes)) {
          for (const wert of Object.keys(def.values)) {
            expect(z.some((c) => c.axisValues?.[achse] === wert), `${id}: ${achse}=${wert} ohne Zelle`).toBe(true)
          }
        }
        const gezeigt = new Set(recipe.specimens.flatMap((sp) => sp.matrix.states))
        for (const s of recipe.states.supported) expect(gezeigt.has(s), `${id}: Zustand ${s} ohne Zelle`).toBe(true)
      })

      it('Wurzel aus dem Recipe, nur bekannte Klassen, Arena-Klassen nie an DS-Elementen', () => {
        const anatomie = anatomieKlassen(id)
        const geerntet = geernteteKlassen(id)
        for (const z of beideModi(id)) {
          const d = dom(z.html)
          const wurzel = `.${WURZELN[id]}, [data-nicht-gebaut]`
          expect(d.querySelector(wurzel), `${id}/${z.specimen.id}/${z.id}`).not.toBeNull()
          for (const el of d.querySelectorAll('[class]')) {
            for (const k of el.classList) {
              if (/^ra-/.test(k)) {
                expect(el.className, `${id}: Arena-Klasse ${k} an einem DS-Element`).not.toMatch(/(^|\s)(nc|fnd|o|u|t)-/)
                continue
              }
              expect(bekannt.has(k) || anatomie.has(k) || geerntet.has(k), `${id}/${z.specimen.id}: Klasse ${k} weder in styles.css noch in der Anatomie`).toBe(true)
            }
          }
        }
      })

      it('jeder Modifier steht in styles.css (oder ist als Entscheidungsfall „nicht gebaut")', () => {
        for (const k of modifier(id)) {
          expect(bekannt.has(k) || !!MODIFIER_OHNE_CSS[id]?.[k], `${id}: Modifier ${k} ohne CSS`).toBe(true)
        }
        for (const k of Object.keys(MODIFIER_OHNE_CSS[id] || {})) {
          expect(bekannt.has(k), `${k} ist inzwischen gebaut — Eintrag entfernen`).toBe(false)
          const z = zellen(id).filter((c) => modifierVon(id, c).includes(k))
          expect(z.length, `${k}: Zelle fehlt`).toBeGreaterThan(0)
          for (const c of z) expect(dom(c.html).querySelector(`[data-nicht-gebaut~="${k}"]`), `${k} ohne Hinweis`).not.toBeNull()
        }
      })

      it('keine Inline-Gestaltung (ausser Instanzwerten wie in Drupal), keine Zustaende ausserhalb des DS', () => {
        for (const z of beideModi(id)) {
          const d = dom(z.html)
          for (const el of d.querySelectorAll('[style]')) {
            const ok = INLINE_ERLAUBT[id]?.(el)
            expect(ok, `${id}/${z.specimen.id}: ${el.outerHTML.slice(0, 140)}`).toBe(true)
          }
          expect(d.querySelector('[data-state], [data-zustand]'), `${id}/${z.specimen.id}`).toBeNull()
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

      it('kein „Ausprobieren" und kein „Abspielen" (keine keyboard/events im Recipe, keine Bewegung im DS)', () => {
        expect(ausprobierenFuer(id)).toBeNull()
        expect(abspielenFuer(id)).toBeNull()
        const r = rohesRecipe(id)
        expect(r.keyboard).toBeUndefined()
        expect(r.events).toBeUndefined()
      })
    })
  }

  it('content-templates bleibt Template-Sektion ohne Recipe', () => {
    const eintraege = navEintraege()
    // content-templates: Teil der Shell, bleibt Template-Sektion ohne Recipe
    expect(eintraege.some((e) => e.section === 'template-content-templates')).toBe(true)
    expect(RECIPE_IDS).not.toContain('content-templates')
  })

  it('content-page und form-page sind stillgelegt (Entscheidung Phase 5, 07.10.2026): kein SCSS, keine Klassen, keine Sektion — Ersatz sind die Shell-Presets', () => {
    const k = dsKlassen()
    expect(k.has('t-content')).toBe(false)
    expect(k.has('t-form-page')).toBe(false)
    for (const datei of ['_content-page.scss', '_form-page.scss']) {
      expect(existsSync(resolve(WURZEL, 'scss/scss/08-templates', datei)), datei).toBe(false)
    }
    const eintraege = navEintraege()
    for (const id of ['content-page', 'form-page']) {
      expect(eintraege.some((e) => e.id === id || e.section === `template-${id}`), id).toBe(false)
      expect(RECIPE_IDS).not.toContain(id)
    }
  })

  it('dashboard, error-page, home-basic, home-hero, settings-page sind stillgelegt (Entscheidung 08.10.2026): kein SCSS, keine Klassen, kein Recipe, keine Sektion — Ersatz sind die Shell-Presets', () => {
    const k = dsKlassen()
    const eintraege = navEintraege()
    const index = readFileSync(resolve(WURZEL, 'scss/scss/08-templates/_index.scss'), 'utf8')
    for (const [id, { klasse, alt, layout }] of Object.entries(STILLGELEGT)) {
      expect(existsSync(resolve(WURZEL, 'scss/scss/08-templates', `_${id}.scss`)), id).toBe(false)
      expect(index, id).not.toMatch(new RegExp(`@forward '${id}'`))
      expect(k.has(klasse), klasse).toBe(false)
      if (alt) expect(k.has(alt), alt).toBe(false)
      expect(existsSync(resolve(WURZEL, `data/${id}-recipe.json`)), `${id}-recipe.json`).toBe(false)
      expect(RECIPE_IDS).not.toContain(id)
      expect(istEntwurf(id), id).toBe(false)
      expect(vorlageFuer(id), id).toBeFalsy()
      expect(eintraege.some((e) => e.id === id || e.section === `component-${id}` || e.section === `template-${id}`), id).toBe(false)
      // Mapping-Kommentar nennt das Shell-Preset als Ersatz
      expect(index, id).toMatch(new RegExp(`\\.${klasse.replace(/^t-home-/, 'home-')}\\s+→ data-layout="${layout}"`))
    }
    // Die Inhalts-Layouts der Shell (t-dashboard-overview) bleiben
    expect(k.has('t-dashboard-overview')).toBe(true)
  })

  it('text-cta: Karte steht im DOM hinter dem Text, auch bei --card-left', () => {
    for (const z of zellen('text-cta').filter((c) => c.axisValues?.card === 'mit')) {
      const grid = dom(z.html).querySelector('.nc-text-cta__grid')
      const kinder = [...grid.children].map((e) => e.className)
      expect(kinder).toEqual(['nc-text-cta__content', 'nc-text-cta__aside'])
    }
  })

  it('text-cta --no-card (Entscheidung Phase 5, 07.10.2026): ohne __aside wie in Drupal, eine Spalte, Inhalt auf Lesebreite', () => {
    const ohne = zellen('text-cta').filter((c) => c.axisValues?.card === 'ohne')
    expect(ohne.length).toBeGreaterThan(0)
    for (const z of ohne) {
      const d = dom(z.html)
      expect(d.querySelector('.nc-text-cta.nc-text-cta--no-card')).not.toBeNull()
      expect(d.querySelector('.nc-text-cta__aside')).toBeNull()
      expect([...d.querySelector('.nc-text-cta__grid').children].map((e) => e.className)).toEqual(['nc-text-cta__content'])
    }
    // Die Regel selbst: Raster einspaltig (schlaegt die Container-Query-Spalten
    // per Spezifitaet), Inhalt ueber den Token gekappt — kein fester Wert.
    const c = css()
    expect(c).toMatch(/\.nc-text-cta--no-card \.nc-text-cta__grid\{grid-template-columns:1fr\}/)
    expect(c).toMatch(/\.nc-text-cta--no-card \.nc-text-cta__grid \.nc-text-cta__content\{max-inline-size:var\(--mod-text-cta-content-measure, var\(--nc-text-cta-content-measure\)\)\}/)
    expect(c).toMatch(/--nc-text-cta-content-measure: *var\(--container-prose\)/)
  })

  it('section-header: Kicker bindet im Dunkeln neu, hell bleibt neutral-800 (Entscheidung Phase 5 kicker-dunkel, 07.10.2026)', () => {
    const c = css()
    expect(c).toMatch(/--nc-section-header-label-color: *var\(--fnd-neutral-800\)/)
    expect(c).toMatch(/\.neo-light-theme,\.customer-light-theme\{--nc-section-header-label-color: *var\(--fnd-neutral-800\)\}/)
    expect(c).toMatch(/\.neo-dark-theme,\.customer-dark-theme\{--nc-section-header-label-color: *var\(--fnd-color-text-secondary\)\}/)
    expect(c).toMatch(/@media\(prefers-color-scheme: *dark\)\{:root:not\(\[data-theme\]\)\{--nc-section-header-label-color: *var\(--fnd-color-text-secondary\)\}\}/)
  })

  it('reference-page: Verzeichnis vor dem Inhalt, genau ein aktueller Eintrag, Anker zeigen auf vorhandene Abschnitte', () => {
    for (const z of zellen('reference-page')) {
      const d = dom(z.html)
      const wurzel = d.querySelector('.nc-refpage')
      expect([...wurzel.children].map((e) => e.className)).toEqual(['nc-refpage__toc', 'nc-refpage__content'])
      expect(d.querySelector('nav.nc-refpage__toc').getAttribute('aria-label')).toBeTruthy()
      expect(d.querySelectorAll('.nc-refpage__toc-link[aria-current="true"]')).toHaveLength(1)
      for (const a of d.querySelectorAll('.nc-refpage__toc-link')) {
        expect(d.querySelector(a.getAttribute('href')), a.getAttribute('href')).not.toBeNull()
      }
    }
  })

  it('accordion-block: Verhaeltnis-Modifier wie in Drupal immer gesetzt, Akkordeon wie auf der Website', () => {
    for (const z of zellen('accordion-block')) {
      const d = dom(z.html)
      expect(d.querySelector('section.nc-section.nc-accordion-block').className).toMatch(/nc-accordion-block--(zwei-drittel|halb|voll)/)
      expect(d.querySelector('.nc-container.nc-accordion-block__inner > .nc-accordion-block__text + .nc-accordion-block__accordion')).not.toBeNull()
      expect(d.querySelectorAll('details.nc-accordion__item').length).toBeGreaterThan(1)
    }
  })

  it('text-cta: Haken der Punkteliste mit leerem Alternativtext, kein speak (Freigabe text-cta, 08.10.2026)', () => {
    const regel = /\.nc-text-cta__list-item::before\{([^}]*)\}/.exec(css())
    expect(regel).not.toBeNull()
    expect(regel[1]).toMatch(/content:"✔";content:"✔"\/""/)
    expect(regel[1]).not.toMatch(/speak/)
  })

  it('text-cta: --card-left nur mit Karte wie in Drupal (Freigabe 08.10.2026)', () => {
    for (const z of beideModi('text-cta')) {
      expect(dom(z.html).querySelector('.nc-text-cta--card-left.nc-text-cta--no-card'), z.specimen.id).toBeNull()
    }
  })

  it('reference-page: Scroll-Spy beschrieben, nicht migriert — Quelle neo-theme.js, keine keyboard/events, jedes Sprungziel mit id (Freigabe 08.10.2026)', () => {
    const r = rohesRecipe('reference-page')
    expect(r.meta.source.drupal).toMatch(/Drupal\.behaviors\.neoRefpageToc/)
    expect(r.meta.source.behavior).toBeNull()
    expect(r.anatomy.domNotes.join(' ')).toMatch(/gehoert nach neo-behaviors/)
    for (const z of zellen('reference-page')) {
      for (const el of dom(z.html).querySelectorAll('.nc-refpage__section')) expect(el.id, z.specimen.id).toBeTruthy()
    }
  })

  it('block-bundle: __items optional wie in Drupal (nur mit referenzierten Bloecken); „Nur Kopf" ohne __items (Freigabe 08.10.2026)', () => {
    const items = rohesRecipe('block-bundle').anatomy.slots.find((s) => s.name === 'items')
    expect(items.optional).toBe(true)
    for (const z of zellen('block-bundle')) {
      const d = dom(z.html)
      const nurKopf = z.specimen.id === 'nur-kopf'
      expect(!!d.querySelector('.nc-block-bundle__items'), z.specimen.id).toBe(!nurKopf)
      if (nurKopf) expect(d.querySelector('.nc-container.nc-block-bundle__header .nc-section-header--flush .nc-section-header__title')).not.toBeNull()
    }
  })

  describe('Einordnung (b): Teile anderer Bauteile stehen in deren Anatomie', () => {
    const FAELLE = [
      ['hero', 'badges', '.nc-hero__badges'],
      ['form', 'honeypot', '.nc-form-hp'],
      ['form-block', 'honeypot', '.nc-form-hp'],
      ['tbl-cell', 'icon', '.nc-tbl-icon'],
      ['compare-table', 'icon', '.nc-tbl-icon'],
      ['breadcrumb', 'section', '.nc-breadcrumb-section'],
      ['card-grid', 'cq', '.nc-card-grid-cq'],
      ['bento-grid', 'section', '.nc-bento-section'],
      ['shell', 'layout-article', '.t-article'],
      ['shell', 'layout-split', '.t-split']
    ]
    for (const [recipe, slot, element] of FAELLE) {
      it(`${recipe}: Slot ${slot} (${element})`, () => {
        const s = (rohesRecipe(recipe).anatomy.slots || []).find((x) => x.name === slot)
        expect(s, `${recipe}.${slot}`).toBeTruthy()
        expect(s.element).toBe(element)
        expect(s.optional).toBe(true)
      })
    }
  })

  it('Eltern der neuen Wurzeln erklaeren sie: section-header und media-frame in komposition', () => {
    const kinder = (id) => (rohesRecipe(id).komposition || []).filter((k) => k.art === 'enthaelt').map((k) => k.recipe)
    for (const id of ['feature-list', 'form-block', 'text-media']) expect(kinder(id), id).toContain('section-header')
    expect(kinder('text-media')).toContain('media-frame')
    expect(kinder('navigation-tab-mega')).toContain('container-intent')
  })
})

/** Klassen, die das Modell der Zelle aus den Achsen setzt. */
function modifierVon (id, zelle) {
  const r = normalisiereRecipe(rohesRecipe(id))
  return Object.entries(zelle.axisValues || {})
    .map(([achse, wert]) => r.axes[achse]?.values?.[wert]?.modifier)
    .filter(Boolean)
}
