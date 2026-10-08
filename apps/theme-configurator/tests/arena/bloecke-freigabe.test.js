/**
 * Abschluss Plan v3 (08.10.2026), zweite Runde: Freigabe der restlichen
 * Entwurfs-Recipes aus Phase 4 („duenne Recipes"). Je freigegebenem Recipe
 * wird Recipe <-> SCSS <-> Website-Markup abgeglichen (Muster:
 * objekte-freigabe.test.js):
 *   - Status stable, Changelog „Freigabe (Abschluss Plan v3, 08.10.2026)",
 *     nicht mehr in recipe-entwuerfe.js; Form wie die freigegebenen Recipes
 *     ($schema, layer, pipeline, a11y.base mit Pruefpunkten, constraints und
 *     recipes als Objekt, tokenGroups)
 *   - SCSS -> Recipe: jede Klasse im Namensraum des Bauteils ist Wurzel, Slot
 *     oder Modifier; jedes var(--nc-<id>-…) steht in styling.tokenGroups
 *   - Recipe -> SCSS: jede Recipe-Klasse kommt in der SCSS-Datei vor (ausser
 *     Teilen, die Drupal setzt und die ausdruecklich ohne Regel sind), jeder
 *     Recipe-Token ist in styles.css oder data/design-tokens.css deklariert
 *   - Website-Markup (abgeschrieben aus dem Drupal-Theme neo_fe, Stand
 *     08.10.2026; Quelle je Fall): Wurzel vorhanden, jede Klasse im
 *     Namensraum steht im Recipe
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

// Je Recipe: Namensraum, Teile ohne Regel, Website-Markup (neo_fe), Arena-Struktur
const BAUTEILE = {
  'card-cta': {
    namensraum: /^nc-card-cta(__|--|$)/,
    website: [
      {
        quelle: 'neo_fe/js/neo-theme.js, Drupal.behaviors.neoCardGridCta (Bild, dunkel, Knopf primary mit URL)',
        markup: '<div class="nc-card-grid-cta" data-neo-card-grid-cta style="--cgc-columns: 3; --cgc-ratio: 16/9;"><div class="nc-card-cta" data-theme="dark"><img class="nc-card-cta__media" src="x.jpg" alt="" loading="lazy" decoding="async"><div class="nc-card-cta__overlay"></div><div class="nc-card-cta__content"><h3 class="nc-card-cta__title" style="max-width: 80%;">Titel</h3><div class="nc-card-cta__actions"><a href="/x" class="nc-button nc-button--primary" aria-label="Mehr – Titel" style="--nc-button-primary-bg: var(--fnd-color-always-light); --nc-button-primary-color: var(--fnd-color-always-dark);">Mehr</a></div></div></div></div>'
      },
      {
        quelle: 'neo_fe/js/neo-theme.js, Drupal.behaviors.neoCardGridCta (Video, hell, Knopf ghost ohne URL)',
        markup: '<div class="nc-card-cta" data-theme="light"><video class="nc-card-cta__media" src="x.mp4" autoplay loop muted playsinline aria-hidden="true"></video><div class="nc-card-cta__overlay"></div><div class="nc-card-cta__content"><h3 class="nc-card-cta__title" style="max-width: 80%;">Titel</h3><div class="nc-card-cta__actions"><span class="nc-button nc-button--ghost" aria-label="Mehr – Titel">Mehr</span></div></div></div>'
      },
      {
        quelle: 'neo_fe/js/neo-theme.js, Drupal.behaviors.neoCardGridCta (ohne Medium, ohne Ton)',
        markup: '<div class="nc-card-cta"><div class="nc-card-cta__content"><h3 class="nc-card-cta__title" style="max-width: 80%;">Titel</h3></div></div>'
      }
    ],
    arena: {
      default: ['.nc-card-cta[data-theme="dark"] > img.nc-card-cta__media[alt=""] + .nc-card-cta__overlay + .nc-card-cta__content > h3.nc-card-cta__title + .nc-card-cta__actions > a.nc-button.nc-button--primary[aria-label][style]'],
      ghost: ['.nc-card-cta__actions > a.nc-button.nc-button--ghost[style*="--nc-button-ghost-color"]'],
      'ohne-medium': ['.nc-card-cta[data-theme="dark"] > .nc-card-cta__content:first-child', '.nc-card-cta[data-theme="light"] > .nc-card-cta__content:first-child']
    },
    ohneArena: { 'ohne-medium': ['.nc-card-cta__media', '.nc-card-cta__overlay'] }
  },
  event: {
    namensraum: /^nc-event(__|--|$)/,
    ohneRegel: {
      'nc-event': 'Wurzel <article>, fasst nur die Abschnitte',
      'nc-event__hero--has-media': 'Drupal setzt es mit Titelbild; Bild und Verlauf tragen die Gestaltung',
      'nc-event__description': 'linke Spalte, gestaltet ueber u-prose',
      'nc-event__sidebar': '<aside> um die Infokarte, Sprungziel #event-signup'
    },
    // Gibt das Template noch aus, im DS gestrichen (Entscheidung event-klassen, 06.10.2026)
    websiteAusnahmen: ['nc-event__tag--format', 'nc-event__tag--lang'],
    website: [
      {
        quelle: 'neo_fe/templates/node/node--event--full.html.twig (alle Abschnitte, mit Titelbild und Video)',
        markup: '<article class="nc-event"><section class="nc-event__hero nc-event__hero--has-media"><div class="nc-event__hero-media"><img src="x.jpg" alt="Summit" loading="eager"></div><div class="nc-event__hero-overlay"></div><div class="nc-event__hero-content nc-container"><div class="nc-event__tags"><span class="nc-event__tag nc-event__tag--type">Konferenz</span><span class="nc-event__tag nc-event__tag--format">Hybrid</span><span class="nc-event__tag nc-event__tag--lang">Deutsch</span></div><h1 class="nc-event__title">Summit</h1><p class="nc-event__subtitle">Sub</p><div class="nc-event__meta"><div class="nc-event__meta-item"><svg></svg><span>20.05.2026</span></div></div><div class="nc-event__cta"><a href="#event-signup" class="nc-button nc-button--accent nc-button--lg"><span>Anmelden</span></a><a href="https://x" class="nc-button nc-button--outline nc-button--lg" target="_blank" rel="noopener"><svg></svg><span>Aufzeichnung ansehen</span></a></div></div></section><section class="nc-section"><div class="nc-container"><div class="nc-event__content-grid"><div class="nc-event__description u-prose"><h2>Über dieses Event</h2><p>Text</p></div><aside class="nc-event__sidebar" id="event-signup"><div class="nc-event__info-card"><h3 class="nc-event__info-card-title">Event Details</h3><dl class="nc-event__info-list"><dt>Datum</dt><dd>20. Mai 2026</dd></dl><a href="#" class="nc-button nc-button--accent nc-event__info-cta"><span>Anmelden</span></a></div></aside></div></div></section><section class="nc-section nc-section--muted"><div class="nc-container"><h2 class="nc-event__section-title">Agenda</h2><div class="nc-event__agenda u-prose"><p>Tag 1</p></div></div></section><section class="nc-section"><div class="nc-container"><h2 class="nc-event__section-title">Weitere Events</h2><div class="nc-event__related-grid"><a href="/x" class="nc-card nc-card--navigational nc-event__related-card"><div class="nc-card__content"><span class="nc-card__kicker">Konferenz</span><h3 class="nc-card__title">Partner Day</h3></div><div class="nc-card__footer"><span class="nc-card__footer-label">Mehr erfahren</span><span class="nc-card__footer-icon"><svg></svg></span></div></a></div></div></section></article>'
      }
    ],
    arena: {
      'hero-bild': ['article.nc-event > section.nc-event__hero.nc-event__hero--has-media > .nc-event__hero-media > img + * , article.nc-event > section.nc-event__hero.nc-event__hero--has-media > .nc-event__hero-media + .nc-event__hero-overlay + .nc-event__hero-content.nc-container'],
      infokarte: ['.nc-section > .nc-container > .nc-event__content-grid > .nc-event__description.u-prose + aside.nc-event__sidebar > .nc-event__info-card > .nc-event__info-card-title + dl.nc-event__info-list + a.nc-button.nc-event__info-cta', 'section.nc-section.nc-section--muted .nc-event__agenda.u-prose'],
      default: ['.nc-event__hero-content > .nc-event__title', '.nc-event__related-grid > a.nc-card.nc-card--navigational.nc-event__related-card']
    },
    ohneArena: { default: ['.nc-event__hero--has-media', '.nc-event__content-grid'] }
  }
}

describe('Abschluss Plan v3: duenne Recipes aus Phase 4 freigegeben (Recipe <-> SCSS <-> Website)', () => {
  for (const [id, fall] of Object.entries(BAUTEILE)) {
    describe(id, () => {
      it('stable, Changelog der Freigabe, kein Kennzeichen „Entwurf", Form der freigegebenen Recipes', () => {
        const r = rohesRecipe(id)
        expect(r.meta.status).toBe('stable')
        expect(r.meta.changelog[0].version).toBe(r.meta.version)
        expect(r.meta.changelog.some((e) => e.changes.join(' ').includes('Freigabe (Abschluss Plan v3, 08.10.2026)'))).toBe(true)
        expect(istEntwurf(id)).toBe(false)
        expect(r.$schema).toBe('./recipe-schema.json')
        expect(r.meta.layer).toMatch(/^(molecule|organism)$/)
        for (const p of r.meta.pipeline.scss) expect(existsSync(resolve(WURZEL, p)), p).toBe(true)
        if (r.meta.pipeline.story) expect(existsSync(resolve(WURZEL, r.meta.pipeline.story)), r.meta.pipeline.story).toBe(true)
        expect(r.a11y.base.assertions.length).toBeGreaterThan(0)
        expect(Array.isArray(r.constraints)).toBe(false)
        expect(r.recipes.mode).toBe('derived')
        expect(Object.keys(r.styling.tokenGroups).length).toBeGreaterThan(0)
        expect(r.anatomy.slots.every((s) => s.description), 'jeder Slot beschrieben').toBe(true)
      })

      it('SCSS -> Recipe: jede Klasse im Namensraum und jedes var(--nc-<id>-…) steht im Recipe', () => {
        const quelle = scss(id)
        const bekannt = recipeKlassen(id)
        for (const k of klassenIn(quelle)) {
          if (fall.namensraum.test(k)) expect(bekannt.has(k), `${id}: Klasse .${k} gebaut, aber nicht im Recipe`).toBe(true)
        }
        const tokens = recipeTokens(id)
        for (const [, t] of quelle.matchAll(/var\(--(nc-[\w-]+)/g)) {
          if (!t.startsWith(`nc-${id}-`)) continue
          expect(tokens.has(t), `${id}: --${t} im SCSS, nicht in styling.tokenGroups`).toBe(true)
        }
      })

      it('Recipe -> SCSS: jede Recipe-Klasse gebaut, jeder Token deklariert', () => {
        for (const k of fall.websiteAusnahmen || []) {
          expect(recipeKlassen(id).has(k), `${k} ist gestrichen und steht doch im Recipe`).toBe(false)
          expect(klassenIn(css()).has(k), `${k} ist gestrichen und doch gebaut`).toBe(false)
        }
        const gebaut = klassenIn(scss(id))
        for (const k of recipeKlassen(id)) {
          if (fall.ohneRegel?.[k]) continue
          expect(gebaut.has(k), `${id}: .${k} im Recipe, nicht im SCSS`).toBe(true)
        }
        for (const k of Object.keys(fall.ohneRegel || {})) expect(gebaut.has(k), `${k} hat jetzt eine Regel — Eintrag entfernen`).toBe(false)
        const deklariert = css() + TOKENS_CSS()
        for (const t of recipeTokens(id)) expect(deklariert.includes(`--${t}:`), `${id}: --${t} nicht deklariert`).toBe(true)
      })

      for (const w of fall.website) {
        it(`Website-Markup (${w.quelle}): Wurzel, Klassen im Recipe`, () => {
          const d = dom(w.markup)
          const wurzel = rohesRecipe(id).anatomy.root.element
          expect(d.querySelector(wurzel), `${id}: ${wurzel} fehlt`).not.toBeNull()
          const bekannt = recipeKlassen(id)
          for (const el of d.querySelectorAll('[class]')) {
            for (const k of el.classList) {
              if (fall.websiteAusnahmen?.includes(k)) continue
              if (fall.namensraum.test(k)) expect(bekannt.has(k), `${id}: Website setzt .${k}, das Recipe kennt es nicht`).toBe(true)
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
          for (const sel of fall.ohneArena?.[specimen] || []) {
            expect(z.every((c) => !dom(c.html).querySelector(sel)), `${id}/${specimen}: ${sel} darf fehlen`).toBe(true)
          }
        })
      }
    })
  }
})
