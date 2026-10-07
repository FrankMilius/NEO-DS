/**
 * Medien-Bauteil shot (Entscheidung 07.10.2026, Punkt 3) aus dem Recipe.
 * Aufgenommen aus dem Drupal-Theme (neo_fe css/neo-shot.css, js/neo-shot.js).
 *   - keine Sonderfall-Arena, jede Zelle jedes Specimens aus der Vorlage;
 *     das Markup baut shotBauen aus neo-behaviors (wie die Website)
 *   - nur Klassen aus styles.css bzw. der Anatomie; jede Regel des Bauteils
 *     haengt an .nc-shot
 *   - Zustaende: Erklaerung offen (vom Behavior gebaut), Lupe sichtbar;
 *     dunkles Theme als Flaeche
 *   - Tokens: Vorgaben = die bisherigen Werte von neo-shot.css (hell
 *     pixelgleich); die dunkle Fassung nur in dunklen Selektoren
 *   - data/markup, Spec, Registry, Story, SCSS-Index verdrahtet
 */
import { describe, it, expect } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { MIT_VERHALTEN } from 'neo-behaviors'
import { vorlageFuer } from '../../src/arena-templates/index.js'
import { normalisiereRecipe, specimenAnsicht } from '../../src/lib/recipe-arena.js'
import { hasArena, arenaQuelle } from '../../src/composables/useArenaResolver.js'
import { WURZEL, rohesRecipe } from './_recipes.js'

const ID = 'shot'

function zellen (specimenId) {
  const recipe = normalisiereRecipe(rohesRecipe(ID))
  return recipe.specimens
    .filter((sp) => !specimenId || sp.id === specimenId)
    .flatMap((sp) => specimenAnsicht(sp, recipe, ID, vorlageFuer(ID)).zeilen
      .flatMap((z) => z.zellen.map((c) => ({ ...c, specimen: sp }))))
}

function dom (html) {
  const d = document.createElement('div')
  d.innerHTML = html
  return d
}

const lies = (pfad) => readFileSync(resolve(WURZEL, pfad), 'utf8')

function css () {
  const styles = resolve(WURZEL, 'styles.css')
  if (!existsSync(styles)) throw new Error('styles.css fehlt — im Wurzelordner `npm run build:css` ausfuehren')
  return readFileSync(styles, 'utf8')
}

describe('shot: Arena aus dem Recipe', () => {
  it('keine Sonderfall-Arena, jede Zelle jedes Specimens aus der Vorlage', () => {
    expect(hasArena(ID)).toBe(false)
    expect(arenaQuelle(ID)).toBe('recipe')
    expect(vorlageFuer(ID)).toBeTypeOf('function')
    const z = zellen()
    expect(new Set(z.map((c) => c.quelle))).toEqual(new Set(['vorlage']))
    expect(z.filter((c) => c.fehler)).toEqual([])
    const recipe = normalisiereRecipe(rohesRecipe(ID))
    expect(recipe.arena.hinweise).toEqual([])
    expect(recipe.specimens.map((s) => s.id)).toEqual(['darstellungen', 'rahmen', 'marker', 'lupe', 'vergleich', 'ken-burns', 'dunkel'])
    expect(z.length).toBe(6 + 4 + 2 + 2 + 1 + 1 + 2)
    expect(MIT_VERHALTEN).toContain(ID)
  })

  it('Darstellungen: je Zelle eine Wurzel .nc-shot[data-nc-shot] mit dem Preset der Achse, Format 16/10', () => {
    const z = zellen('darstellungen')
    expect(z.map((c) => dom(c.html).querySelector('.nc-shot[data-nc-shot]').getAttribute('data-nc-shot')))
      .toEqual(['none', 'frame', 'kenburns', 'lens', 'hotspots', 'compare'])
    for (const c of z) {
      const w = dom(c.html).querySelector('.nc-shot[data-nc-shot]')
      expect(w.classList.contains('nc-shot--ratio')).toBe(true)
      expect(w.hasAttribute('data-neo-behavior')).toBe(false)
      expect(w.querySelector('.nc-shot__img').getAttribute('alt')).not.toBe('')
    }
  })

  it('nur Klassen aus styles.css bzw. der Anatomie; jede Regel des Bauteils haengt an .nc-shot', () => {
    const text = css()
    const ds = new Set([...text.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)].map((m) => m[1]))
    const r = rohesRecipe(ID)
    const anatomie = [r.anatomy.root.element, ...r.anatomy.slots.map((s) => s.element)].map((e) => e.slice(1))
    for (const c of zellen()) {
      for (const el of dom(c.html).querySelectorAll('[class]')) {
        for (const k of el.classList) {
          if (k.startsWith('ra-') || k.startsWith('neo-')) continue
          expect(ds.has(k) || anatomie.includes(k), `${c.specimen.id}: .${k}`).toBe(true)
        }
      }
    }
    for (const a of anatomie) expect(ds.has(a), `.${a} fehlt in styles.css`).toBe(true)
    // Regeln mit nc-shot: jeder Selektor beginnt bei einer nc-shot-Klasse
    const regeln = [...text.matchAll(/(?:^|})([^{}@]*\.nc-shot[^{}]*){/g)].map((m) => m[1].trim())
    expect(regeln.length).toBeGreaterThan(20)
    for (const sel of regeln.flatMap((r) => r.split(','))) expect(sel.trim(), sel).toMatch(/^\.nc-shot/)
  })

  it('Marker geoeffnet: die Erklaerung des ersten Markers baut das Behavior (Detail-Zoom, Titel, Text)', () => {
    const [zu, auf] = zellen('marker').map((c) => dom(c.html))
    expect(zu.querySelector('.nc-shot__tip')).toBeNull()
    const k = auf.querySelectorAll('.nc-shot__hotspot')
    expect(k[0].getAttribute('aria-expanded')).toBe('true')
    expect(k[1].getAttribute('aria-expanded')).toBe('false')
    const tip = k[0].querySelector('.nc-shot__tip')
    expect(tip.querySelector('.nc-shot__tip-title').textContent).toBe('Suche')
    expect(tip.querySelector('.nc-shot img.nc-shot__img')).not.toBeNull()
    expect(auf.querySelector('[data-neo-behavior]')).toBeNull()
  })

  it('Lupe Hover: Lupe sichtbar mit vergroessertem Bild; Standard ohne sichtbare Lupe', () => {
    const [ruhe, hover] = zellen('lupe').map((c) => dom(c.html))
    expect(ruhe.querySelector('.nc-shot__lens')).toBeNull()
    const lupe = hover.querySelector('.nc-shot__lens')
    expect(lupe.style.display).toBe('block')
    expect(lupe.querySelector('img').style.width).toBe('1200px')
  })

  it('Rahmen: Browser mit Leiste, Minimal ohne; Schatten nach Achse', () => {
    const z = zellen('rahmen').map((c) => ({ achsen: c.axisValues, d: dom(c.html) }))
    for (const { achsen, d } of z) {
      expect(!!d.querySelector('.nc-shot__chrome-bar')).toBe(achsen.rahmen === 'browser')
      expect(d.querySelector('.nc-shot__frame').classList.contains('nc-shot--shadow')).toBe(achsen.schatten === 'mit')
    }
  })

  it('Dunkles Theme: Zellen auf dunkler Flaeche (neo-dark-theme)', () => {
    for (const c of zellen('dunkel')) expect(c.flaeche).toBe('dunkel')
  })

  it('Ausprobieren: unbewegtes Markup, nichts geoeffnet', () => {
    const recipe = normalisiereRecipe(rohesRecipe(ID))
    const sp = recipe.specimens.find((s) => s.id === 'marker')
    const html = specimenAnsicht(sp, recipe, ID, vorlageFuer(ID), { ausprobieren: true }).zeilen[0].zellen[0].html
    expect(dom(html).querySelector('.nc-shot__tip')).toBeNull()
  })
})

describe('shot: Tokens (hell = bisherige Werte, dunkel neu)', () => {
  // Werte aus neo_fe css/neo-shot.css (master b6b19ad)
  const BISHER = {
    'nc-shot-accent': '#37e93d',
    'nc-shot-frame-radius': '14px',
    'nc-shot-frame-shadow': '0 24px 70px rgba(0, 0, 0, .45), 0 0 40px rgba(55, 233, 61, .05)',
    'nc-shot-chrome-gap': '.5rem',
    'nc-shot-chrome-padding': '.55rem .8rem',
    'nc-shot-chrome-bg': '#101a24',
    'nc-shot-chrome-border': 'rgba(255, 255, 255, .06)',
    'nc-shot-chrome-dot-bg': '#2a3845',
    'nc-shot-chrome-url-font-size': '.62rem',
    'nc-shot-chrome-url-font-family': 'ui-monospace, Menlo, monospace',
    'nc-shot-chrome-url-color': '#7da58a',
    'nc-shot-chrome-url-bg': '#0a131c',
    'nc-shot-chrome-url-radius': '6px',
    'nc-shot-chrome-url-padding': '.25rem .8rem',
    'nc-shot-lens-border-width': '2px',
    'nc-shot-lens-shadow': '0 10px 40px rgba(0, 0, 0, .6)',
    'nc-shot-lens-bg': '#060c12',
    'nc-shot-hotspot-size': '22px',
    'nc-shot-hotspot-bg': 'rgba(55, 233, 61, .25)',
    'nc-shot-hotspot-border-width': '2px',
    'nc-shot-hotspot-ping-color': 'rgba(55, 233, 61, .4)',
    'nc-shot-tip-width': '240px',
    'nc-shot-tip-bg': '#0c151e',
    'nc-shot-tip-color': '#eafff0',
    'nc-shot-tip-border-width': '1px',
    'nc-shot-tip-radius': '10px',
    'nc-shot-tip-padding': '.6rem',
    'nc-shot-tip-text-size': '.72rem',
    'nc-shot-tip-text-gap': '.5rem',
    'nc-shot-tip-title-gap': '.25rem',
    'nc-shot-tip-title-weight': 'var(--fnd-font-weight-bold)',
    'nc-shot-tip-media-radius': '6px',
    'nc-shot-divider-width': '2px',
    'nc-shot-divider-shadow': '0 0 12px rgba(55, 233, 61, .8)'
  }
  const scss = lies('scss/scss/00-settings/_component-tokens.scss')
  const abschnitt = scss.slice(scss.indexOf('// Shot Tokens'))
  const hell = abschnitt.slice(0, abschnitt.indexOf('// Dunkle Fassung'))

  it('Vorgaben in :root = Werte aus neo-shot.css; Recipe nennt genau diese Tokens', () => {
    const werte = Object.fromEntries([...hell.matchAll(/--(nc-shot-[\w-]+):\s*(.+?);/g)].map((m) => [m[1], m[2]]))
    expect(werte).toEqual(BISHER)
    const r = rohesRecipe(ID)
    expect(Object.values(r.styling.tokenGroups).flatMap((g) => g.tokens).sort()).toEqual(Object.keys(BISHER).sort())
  })

  it('dunkle Fassung nur unter .neo-dark-theme/.customer-dark-theme bzw. prefers-color-scheme ohne data-theme', () => {
    const text = css()
    const shotBloecke = [...text.matchAll(/([^{}]+)\{[^{}]*--nc-shot-accent:\s*([^;}]+)/g)].map((m) => [m[1].trim(), m[2].trim()])
    expect(shotBloecke).toEqual([
      [':root', '#37e93d'],
      ['.neo-dark-theme,.customer-dark-theme', 'var(--fnd-color-background-accent)'],
      [':root:not([data-theme])', 'var(--fnd-color-background-accent)']
    ])
    expect(text).toMatch(/@media\(prefers-color-scheme: dark\)\{:root:not\(\[data-theme\]\)\{--nc-shot-accent/)
  })

  it('Konfigurator: jeder Token steht in einer Untergruppe der Gruppe shot', () => {
    const d = JSON.parse(lies('data/design-tokens.json'))
    const g = d.components.groups.find((x) => x.id === 'shot')
    expect(g.subgroups.flatMap((s) => s.tokenIds).sort()).toEqual(Object.keys(BISHER).sort())
    expect(g.tokens.map((t) => t.id).sort()).toEqual(Object.keys(BISHER).sort())
  })
})

describe('shot: Pipeline', () => {
  it('data/markup aus der Vorlage (gleiches Markup wie die Zellen), Spec, Registry, Story, SCSS-Index', () => {
    const markup = lies('data/markup/shot.html')
    expect(markup).toMatch(/@quelle: shotBauen/)
    expect((markup.match(/@fassung:/g) || []).length).toBe(8)
    for (const p of ['none', 'frame', 'kenburns', 'lens', 'hotspots', 'compare']) expect(markup).toContain(`data-nc-shot="${p}"`)
    expect(markup).toContain('class="nc-shot__tip"')
    const spec = JSON.parse(lies(`specs/${ID}.spec.json`))
    expect(spec.component || spec.meta?.component || spec.name).toBeTruthy()
    const reg = JSON.parse(lies('data/component-registry.json'))
    expect(reg.components[ID].paths.scss).toEqual(['scss/scss/06-molecules/_shot.scss'])
    expect(reg.components[ID].paths.story).toBe('stories/molecules/shot.stories.js')
    expect(existsSync(resolve(WURZEL, 'stories/molecules/shot.stories.js'))).toBe(true)
    expect(lies('scss/scss/07-organisms/_index.scss')).toMatch(/@forward '\.\.\/06-molecules\/shot';\s*$/)
    expect(lies('scss/scss/06-molecules/_index.scss')).not.toMatch(/@forward 'shot'/)
  })
})
