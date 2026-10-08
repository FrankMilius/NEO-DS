/**
 * Abschluss Plan v3 (08.10.2026): Freigabe der Layout-Objekte aus Phase 5
 * (docs/phase5-inventur.md, Abschnitt a). Je freigegebenem Recipe wird
 * Recipe <-> SCSS <-> Markup abgeglichen:
 *   - Status stable, Changelog „Freigabe (Abschluss Plan v3, 08.10.2026)",
 *     nicht mehr in recipe-entwuerfe.js
 *   - SCSS -> Recipe: jede Klasse der SCSS-Datei ist Wurzel, Slot oder
 *     Modifier (ausser ausdruecklich fremden, z. B. der Drupal-Body-Klasse);
 *     jedes var(--…) steht in styling.tokenGroups (ausser --mod-*-Hooks und
 *     internen Hilfsvariablen)
 *   - Recipe -> SCSS: jede Recipe-Klasse kommt in der SCSS-Datei vor (ausser
 *     Slots ausdruecklich ohne Regel), jeder Recipe-Token ist in styles.css
 *     oder data/design-tokens.css deklariert; Slots mit data-Attribut
 *     (data-bleed) haben ihre Attribut-Regel
 *   - Website-Markup (abgeschrieben aus dem Drupal-Theme neo_fe, Stand
 *     08.10.2026; Pfad je Fall): Wurzel vorhanden, jede Klasse im Namensraum
 *     des Objects steht im Recipe, alle Klassen gibt es in styles.css
 *   - Arena: das Specimen, das die Website zeigt, baut dieselbe Struktur
 */
import { describe, it, expect } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { vorlageFuer } from '../../src/arena-templates/index.js'
import { normalisiereRecipe, specimenAnsicht } from '../../src/lib/recipe-arena.js'
import { istEntwurf } from '../../src/data/recipe-entwuerfe.js'
import { WURZEL, rohesRecipe } from './_recipes.js'

const STYLES = resolve(WURZEL, 'styles.css')
function css () {
  if (!existsSync(STYLES)) throw new Error('styles.css fehlt — im Wurzelordner `npm run build:css` ausfuehren')
  return readFileSync(STYLES, 'utf8')
}
// Foundation-Tokens wie --fnd-layout-container-* stehen in design-tokens.css
// (auf der Website eine eigene Datei vor styles.css), nicht in styles.css.
const TOKENS_CSS = () => readFileSync(resolve(WURZEL, 'data/design-tokens.css'), 'utf8')
const ohneKommentare = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '')
const scss = (id) => rohesRecipe(id).meta.pipeline.scss.map((p) => ohneKommentare(readFileSync(resolve(WURZEL, p), 'utf8'))).join('\n')
const klassenIn = (text) => new Set([...text.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)].map((m) => m[1]))

/** Wurzel, Slots und Modifier des Recipes (ohne Punkt). */
function recipeKlassen (id) {
  const r = rohesRecipe(id)
  const sel = [r.anatomy.root.element, ...(r.anatomy.slots || []).map((s) => s.element)]
  const k = new Set(sel.flatMap((s) => [...String(s).matchAll(/\.([\w-]+)/g)].map((m) => m[1])))
  for (const achse of Object.values(r.axes || {})) {
    for (const v of Object.values(achse.values || {})) {
      if (v.modifier) String(v.modifier).split(/\s+/).forEach((m) => k.add(m.replace(/^\./, '')))
    }
  }
  return k
}
const recipeTokens = (id) => new Set(Object.values(rohesRecipe(id).styling.tokenGroups).flatMap((g) => g.tokens))

function zellen (id, specimenId) {
  const recipe = normalisiereRecipe(rohesRecipe(id))
  const sp = recipe.specimens.find((s) => s.id === specimenId)
  return specimenAnsicht(sp, recipe, id, vorlageFuer(id)).zeilen.flatMap((z) => z.zellen)
}
function dom (html) {
  const d = document.createElement('div')
  d.innerHTML = html
  return d
}

// Je Object: Namensraum, fremde Klassen, Website-Markup (neo_fe), Arena-Struktur
const OBJEKTE = {
  'container-intent': {
    namensraum: /^container(--|$)/,
    website: [
      {
        quelle: 'neo_fe/templates/layouts/neo-section-default.html.twig (Vorgabe width = content)',
        markup: '<section class="nc-section"><div class="container container--content"><p>Inhalt</p></div></section>'
      },
      {
        quelle: 'neo_fe/templates/navigation/neo-nav.html.twig (ohne Breite; Geometrie aus _navigation-tab-mega.scss)',
        markup: '<header class="site-header" data-neo-nav><div class="container header-inner"><a href="/">Logo</a></div></header>'
      }
    ],
    arena: {
      website: ['section.nc-section > div.container.container--content', 'section.nc-section > div.container.container--wide'],
      breiten: ['.container.container--prose', '.container.container--full']
    }
  },
  content: {
    namensraum: /^nc-content(__|--|$)/,
    ohneRegel: { 'nc-content__body': 'Huelle des Knoteninhalts, das Body-Feld bringt .nc-prose mit' },
    fremdeKlassen: { 'is-reading-left': 'Body-Klasse aus neo_fe_preprocess_html (Lese-Bereiche links)' },
    website: [
      {
        quelle: 'neo_fe/templates/content/node.html.twig (view_mode full, eingebettet) und field/field--body.html.twig',
        markup: '<article class="node node--type-article node--view-mode-full nc-content"><h2 class="nc-content__title"><a href="/x" rel="bookmark">Titel</a></h2><div class="nc-content__meta"><span>Redaktion — 15.09.2026</span></div><div class="nc-content__body"><div class="nc-prose"><p>Text</p></div></div></article>',
        ohneCss: ['node', 'node--type-article', 'node--view-mode-full']
      }
    ],
    arena: {
      eingebettet: ['article.nc-content > h2.nc-content__title > a[rel="bookmark"]', 'article.nc-content > .nc-content__meta', 'article.nc-content > .nc-content__body > .nc-prose'],
      seite: ['article.nc-content > .nc-content__body > .nc-prose']
    }
  }
}

describe('Abschluss Plan v3: Layout-Objekte freigegeben (Recipe <-> SCSS <-> Markup)', () => {
  for (const [id, fall] of Object.entries(OBJEKTE)) {
    describe(id, () => {
      it('stable, Changelog der Freigabe, kein Kennzeichen „Entwurf"', () => {
        const meta = rohesRecipe(id).meta
        expect(meta.status).toBe('stable')
        expect(meta.changelog[0].version).toBe(meta.version)
        expect(meta.changelog[0].changes.join(' ')).toMatch(/Freigabe \(Abschluss Plan v3, 08\.10\.2026\)/)
        expect(istEntwurf(id)).toBe(false)
      })

      it('SCSS -> Recipe: jede Klasse und jedes var(--…) der SCSS-Datei steht im Recipe', () => {
        const quelle = scss(id)
        const bekannt = recipeKlassen(id)
        for (const k of klassenIn(quelle)) {
          if (fall.fremdeKlassen?.[k]) continue
          expect(bekannt.has(k), `${id}: Klasse .${k} gebaut, aber nicht im Recipe`).toBe(true)
        }
        const tokens = recipeTokens(id)
        for (const [, t] of quelle.matchAll(/var\(--([\w-]+)/g)) {
          if (t.startsWith('mod-') || fall.intern?.includes(t)) continue
          expect(tokens.has(t), `${id}: --${t} im SCSS, nicht in styling.tokenGroups`).toBe(true)
        }
      })

      it('Recipe -> SCSS: jede Recipe-Klasse gebaut, jeder Token in styles.css deklariert, data-Attribute mit Regel', () => {
        const gebaut = klassenIn(scss(id))
        for (const k of recipeKlassen(id)) {
          if (fall.ohneRegel?.[k]) continue
          expect(gebaut.has(k), `${id}: .${k} im Recipe, nicht im SCSS`).toBe(true)
        }
        for (const k of Object.keys(fall.ohneRegel || {})) expect(gebaut.has(k), `${k} hat jetzt eine Regel — Eintrag entfernen`).toBe(false)
        const c = css()
        const deklariert = c + TOKENS_CSS()
        for (const t of recipeTokens(id)) expect(deklariert.includes(`--${t}:`), `${id}: --${t} nicht deklariert`).toBe(true)
        for (const [klasse, attr] of Object.entries(fall.attribute || {})) {
          // Klasse und Attribut stehen in derselben Regel
          expect(c, `${id}: ${attr} ohne Regel neben .${klasse}`).toMatch(new RegExp(`\\.${klasse},[^{]*\\[${attr.replace(/[[\]=]/g, (z) => '\\' + z)}\\]`))
        }
      })

      for (const w of fall.website) {
        it(`Website-Markup (${w.quelle}): Wurzel, Klassen im Recipe und in styles.css`, () => {
          const d = dom(w.markup)
          const wurzel = rohesRecipe(id).anatomy.root.element
          expect(d.querySelector(wurzel), `${id}: ${wurzel} fehlt`).not.toBeNull()
          const bekannt = recipeKlassen(id)
          const c = klassenIn(css())
          for (const el of d.querySelectorAll('[class]')) {
            for (const k of el.classList) {
              if (fall.namensraum.test(k)) expect(bekannt.has(k), `${id}: Website setzt .${k}, das Recipe kennt es nicht`).toBe(true)
              if (!w.ohneCss?.includes(k) && !fall.ohneRegel?.[k]) expect(c.has(k), `${id}: .${k} nicht in styles.css`).toBe(true)
            }
          }
        })
      }

      for (const [specimen, selektoren] of Object.entries(fall.arena)) {
        it(`Arena-Specimen ${specimen} baut die Website-Struktur`, () => {
          const z = zellen(id, specimen)
          expect(z.length).toBeGreaterThan(0)
          for (const sel of selektoren) {
            expect(z.some((c) => dom(c.html).querySelector(sel)), `${id}/${specimen}: ${sel}`).toBe(true)
          }
        })
      }
    })
  }
})
