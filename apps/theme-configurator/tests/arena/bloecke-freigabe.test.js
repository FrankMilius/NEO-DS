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
  },
  events: {
    namensraum: /^nc-events(__|--|$)/,
    ohneRegel: { 'nc-events': 'Recipe-Wurzel; auf der Website haengen die Teile direkt im .nc-container[data-neo-events-listing]' },
    wurzelWebsite: '.nc-container[data-neo-events-listing]',
    website: [
      {
        quelle: 'neo_fe/templates/block/block--block-content--neo-events-listing.html.twig und createCard() in js/neo-theme.js (eine Karte mit Untertitel)',
        markup: '<section class="nc-section"><div class="nc-container" data-neo-events-listing data-api-url="/api/events?_format=json" data-per-page="16"><div class="nc-events__filter-bar"><div class="nc-events__search"><div class="nc-events__search-wrapper"><svg class="nc-events__search-icon"></svg><input type="search" class="nc-events__search-input" placeholder="Events durchsuchen…" data-events-search></div></div><select class="nc-events__filter-select" data-events-filter="type"><option value="">Alle Event-Typen</option></select><select class="nc-events__filter-select" data-events-filter="category"><option value="">Alle Kategorien</option></select><select class="nc-events__filter-select" data-events-filter="year"><option value="">Alle Jahre</option></select></div><div class="nc-events__results-count" data-events-count>1 Event gefunden</div><div class="nc-events__grid" data-events-grid><a href="/events/x" class="nc-events__card"><div class="nc-events__card-header"><span class="nc-events__card-type">Konferenz</span><h3 class="nc-events__card-title">Titel</h3><p style="font-size:var(--fs-sm);color:var(--fnd-color-text-secondary);margin:0">Untertitel</p><div class="nc-events__card-meta"><span class="nc-events__card-meta-item"><svg></svg>20.05.2026</span><span class="nc-events__card-meta-item">Hybrid</span></div></div><div class="nc-events__card-footer"><span>Mehr erfahren</span><svg></svg></div></a></div><div class="nc-events__empty" data-events-empty hidden><p>Keine Events gefunden. Versuchen Sie andere Filtereinstellungen.</p></div><div class="nc-events__load-more" data-events-load-more hidden><button class="nc-button nc-button--secondary" data-events-load-btn><span>Mehr laden</span></button></div></div></section>'
      }
    ],
    arena: {
      default: ['.nc-events > .nc-events__filter-bar > .nc-events__search > .nc-events__search-wrapper > .nc-events__search-icon + input.nc-events__search-input[type="search"][aria-label]', '.nc-events__filter-bar > select.nc-events__filter-select[aria-label]', '.nc-events > .nc-events__results-count + .nc-events__grid > a.nc-events__card > .nc-events__card-header > .nc-events__card-type + h3.nc-events__card-title + .nc-events__card-meta', 'a.nc-events__card > .nc-events__card-header + .nc-events__card-footer', '.nc-events__load-more > button.nc-button.nc-button--secondary'],
      leer: ['.nc-events__empty > p']
    }
  },
  news: {
    namensraum: /^nc-news(__|--|$)/,
    ohneRegel: {
      'nc-news': 'Wurzel <article>, fasst Hero, Text und Fusszeile',
      'nc-news__hero--has-media': 'Drupal setzt es mit Titelbild zusammen mit neo-dark-theme',
      'nc-news__footer-cta': 'Huelle des Fuss-Links',
      'nc-news__contact': 'Huelle des Kontaktlinks'
    },
    website: [
      {
        quelle: 'neo_fe/templates/node/node--news--full.html.twig (mit Titelbild, alle Felder)',
        markup: '<article class="node node--type-news nc-news"><header class="nc-news__hero nc-news__hero--has-media neo-dark-theme"><div class="nc-news__hero-media" style="background-image: url(\'x.jpg\'); background-position: 50% 30%; transform: scale(1.2); transform-origin: 50% 30%;"></div><div class="nc-news__hero-overlay" aria-hidden="true"></div><div class="nc-news__hero-inner nc-cw-wide"><div class="nc-news__eyebrow"><span class="nc-news__kicker">Produktnews</span><span class="nc-news__date"><time datetime="2026-07-01">Juli 2026</time></span></div><h1 class="nc-news__title">Titel</h1><div class="nc-news__lead"><p>Lead</p></div><div class="nc-news__hero-cta"><a href="/x" class="nc-button nc-button--accent">Weiterlesen</a></div></div></header><div class="nc-news__body u-prose nc-cw-content"><p>Text</p></div><footer class="nc-news__footer nc-container"><div class="nc-news__footer-cta"><a href="/news">Alle News</a></div><div class="nc-news__contact"><a href="/kontakt">Pressekontakt</a></div></footer></article>'
      },
      {
        quelle: 'neo_fe/templates/node/node--news--full.html.twig (ohne Titelbild, ohne Fusszeile)',
        markup: '<article class="node node--type-news nc-news"><header class="nc-news__hero"><div class="nc-news__hero-inner nc-cw-wide"><div class="nc-news__eyebrow"></div><h1 class="nc-news__title">Titel</h1></div></header><div class="nc-news__body u-prose nc-cw-content"><p>Text</p></div></article>'
      }
    ],
    arena: {
      default: ['article.nc-news > header.nc-news__hero.nc-news__hero--has-media.neo-dark-theme > .nc-news__hero-media[style^="background-image"] + .nc-news__hero-overlay[aria-hidden="true"] + .nc-news__hero-inner.nc-cw-wide > .nc-news__eyebrow + .nc-news__title', 'article.nc-news > .nc-news__body.u-prose.nc-cw-content', 'article.nc-news > footer.nc-news__footer.nc-container > .nc-news__footer-cta + .nc-news__contact'],
      'ohne-bild': ['article.nc-news > header.nc-news__hero:not(.nc-news__hero--has-media):not(.neo-dark-theme) > .nc-news__hero-inner:first-child']
    },
    ohneArena: { default: ['.nc-news__hero-inner.nc-container', '.nc-news__body.nc-container'], 'ohne-bild': ['.nc-news__hero-media', '.nc-news__hero-overlay'] }
  },
  'feature-list': {
    namensraum: /^nc-feature-list(__|--|$)/,
    website: [
      {
        quelle: 'neo_fe/templates/block/block--block-content--neo-feature-list.html.twig (Vorgaben: Medium rechts, Text mittig, Rahmen frame) mit neoFeatureMedia/shotAufbauen und neoFeatureList',
        markup: '<section class="nc-section nc-feature-list nc-feature-list--with-media nc-feature-list--media-right nc-feature-list--valign-middle"><div class="nc-container nc-feature-list__inner"><div class="nc-feature-list__media nc-media-frame nc-shot" data-fl-media data-fl-media-init="1" data-nc-shot="none"><img src="x.jpg" alt="Bild" class="nc-shot__img"></div><div class="nc-feature-list__content"><div class="nc-section-header nc-section-header--flush"><h2 class="nc-section-header__title">T</h2></div><div class="nc-feature-list__text"><p>Text</p></div><div class="nc-feature-list__items-host" data-feature-list data-feature-list-init="1"><ul class="nc-feature-list__items"><li class="nc-feature-list__item"><span class="nc-feature-list__icon"><svg aria-hidden="true"></svg></span><span class="nc-feature-list__item-text">Punkt</span></li></ul></div><script type="application/json" data-feature-list-items>[]</script><div class="nc-feature-list__cta"><a class="nc-button nc-button--accent nc-button--lg" href="/x"><span>Mehr</span></a></div></div></div></section>'
      },
      {
        quelle: 'neo_fe/templates/block/block--block-content--neo-feature-list.html.twig (Geraeterahmen, Medium links, Video-Fassung nicht gezeigt)',
        markup: '<section class="nc-section nc-feature-list nc-feature-list--with-media nc-feature-list--media-left nc-feature-list--valign-top"><div class="nc-container nc-feature-list__inner"><div class="nc-feature-list__media nc-feature-list__media--device"><div class="nc-device"><div class="nc-device__screen"><img src="x.png" alt="Login" width="800" height="1740"></div></div></div><div class="nc-feature-list__content"><div class="nc-feature-list__items-host" data-feature-list></div></div></div></section>'
      },
      {
        quelle: 'neo_fe/js/neo-theme.js, neoFeatureMedia (Video-Datei)',
        markup: '<section class="nc-section nc-feature-list nc-feature-list--with-media nc-feature-list--media-right nc-feature-list--valign-middle"><div class="nc-container nc-feature-list__inner"><div class="nc-feature-list__media nc-media-frame" data-fl-media data-fl-video="x.mp4"><video src="x.mp4" controls playsinline class="nc-feature-list__video"></video></div><div class="nc-feature-list__content"></div></div></section>'
      },
      {
        quelle: 'neo_fe/templates/block/block--block-content--neo-feature-list.html.twig (ohne Medium)',
        markup: '<section class="nc-section nc-feature-list"><div class="nc-container nc-feature-list__inner"><div class="nc-feature-list__content"><div class="nc-feature-list__items-host" data-feature-list></div></div></div></section>'
      }
    ],
    arena: {
      default: ['section.nc-section.nc-feature-list.nc-feature-list--with-media.nc-feature-list--media-right.nc-feature-list--valign-top > .nc-container.nc-feature-list__inner > .nc-feature-list__media.nc-feature-list__media--device + .nc-feature-list__content', '.nc-feature-list__media--device > .nc-device > .nc-device__screen > img'],
      'mit-bild': ['.nc-feature-list--valign-middle .nc-feature-list__media.nc-media-frame.nc-shot[data-nc-shot="none"] > img.nc-shot__img[alt]'],
      medienlage: ['.nc-feature-list--media-left.nc-feature-list--valign-middle', '.nc-feature-list--media-right.nc-feature-list--valign-middle'],
      'ohne-medium': ['section.nc-feature-list:not(.nc-feature-list--with-media) > .nc-feature-list__inner > .nc-feature-list__content:first-child > .nc-feature-list__items-host > ul.nc-feature-list__items > li.nc-feature-list__item > .nc-feature-list__icon + .nc-feature-list__item-text']
    },
    ohneArena: { 'mit-bild': ['.nc-feature-list__media--device'], 'ohne-medium': ['.nc-feature-list__media'] }
  },
  'testimonial-grid': {
    namensraum: /^nc-testimonial-grid(__|--|$)/,
    website: [
      {
        quelle: 'neo_fe/templates/block/block--block-content--neo-testimonial-grid.html.twig (Raster, Vorgabe 3 Spalten; Kind als gerenderter Block)',
        markup: '<section class="nc-section"><div class="nc-container"><div class="nc-section-header"><h2 class="nc-section-header__title">Stimmen</h2></div><div class="nc-testimonial-grid nc-testimonial-grid--cols-3"><div class="block"><section class="nc-section"><div class="nc-container"><figure class="nc-testimonial"><blockquote class="nc-testimonial__quote">Zitat</blockquote></figure></div></section></div></div></div></section>'
      },
      {
        quelle: 'neo_fe/templates/block/block--block-content--neo-testimonial-grid.html.twig (Karussell)',
        markup: '<div class="nc-testimonial-grid nc-testimonial-grid--carousel" data-testimonial-carousel role="group" aria-roledescription="Karussell" aria-label="Stimmen" tabindex="0"><figure class="nc-testimonial"></figure></div><div class="nc-testimonial-grid__nav"><button type="button" class="nc-testimonial-grid__btn" data-tc-prev aria-label="Vorherige Testimonials"><svg aria-hidden="true" focusable="false"></svg></button><button type="button" class="nc-testimonial-grid__btn" data-tc-next aria-label="Weitere Testimonials"><svg aria-hidden="true" focusable="false"></svg></button></div>'
      }
    ],
    arena: {
      carousel: ['.nc-testimonial-grid.nc-testimonial-grid--carousel[data-testimonial-carousel][role="group"][aria-roledescription="Karussell"][aria-label][tabindex="0"] > figure.nc-testimonial', '.nc-testimonial-grid--carousel + .nc-testimonial-grid__nav > button.nc-testimonial-grid__btn[data-tc-prev][aria-label] + button.nc-testimonial-grid__btn[data-tc-next][aria-label]'],
      default: ['.nc-testimonial-grid.nc-testimonial-grid--cols-3 > figure.nc-testimonial', '.nc-testimonial-grid.nc-testimonial-grid--cols-2 > figure.nc-testimonial']
    },
    ohneArena: { default: ['.nc-testimonial-grid__nav', '[data-testimonial-carousel]'] }
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
        for (const k of r.komposition || []) expect(rohesRecipe(k.recipe), k.recipe).toBeTruthy()
        for (const p of r.meta.pipeline.scss) expect(existsSync(resolve(WURZEL, p)), p).toBe(true)
        if (r.meta.pipeline.story) expect(existsSync(resolve(WURZEL, r.meta.pipeline.story)), r.meta.pipeline.story).toBe(true)
        expect(r.a11y.base.assertions.length).toBeGreaterThan(0)
        expect(Array.isArray(r.constraints)).toBe(false)
        expect(r.recipes.mode).toBe('derived')
        expect(Object.keys(r.styling.tokenGroups).length).toBeGreaterThan(0)
        expect(r.anatomy.slots.every((s) => s.description), 'jeder Slot beschrieben').toBe(true)
      })

      if (id === 'feature-list') {
        it('Medienrahmen erklaert: media-frame und shot in komposition (Freigabe 08.10.2026)', () => {
          const kinder = rohesRecipe(id).komposition.filter((k) => k.art === 'enthaelt').map((k) => k.recipe)
          expect(kinder).toEqual(expect.arrayContaining(['media-frame', 'shot', 'device', 'section-header', 'container']))
          expect(rohesRecipe(id).anatomy.slots.map((s) => s.element)).toContain('.nc-feature-list__media--device')
        })
      }

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
          const wurzel = fall.wurzelWebsite || rohesRecipe(id).anatomy.root.element
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

// scroll-expand und scroll-reveal gehoeren zur selben Liste, sind aber nicht
// gebaut (Entscheidung 25.08.2026: draft, damit niemand sie fuer
// einsatzbereit haelt). Geprueft am 08.10.2026 und NICHT freigegeben —
// Entscheidungsfall im Bericht. Wer sie baut, stellt diesen Test um.
describe('Abschluss Plan v3: scroll-expand und scroll-reveal geprueft, nicht freigegeben (nicht gebaut)', () => {
  for (const id of ['scroll-expand', 'scroll-reveal']) {
    it(`${id}: draft, Kennzeichen „Entwurf", keine Regel, Pruefung im Changelog, Schema-Form`, () => {
      const r = rohesRecipe(id)
      expect(r.meta.status).toBe('draft')
      expect(istEntwurf(id)).toBe(true)
      expect(klassenIn(css()).has(`nc-${id}`)).toBe(false)
      expect(r.meta.pipeline.scss).toEqual([])
      expect(r.meta.changelog[0].changes.join(' ')).toMatch(/Geprueft \(Abschluss Plan v3, 08\.10\.2026\), NICHT freigegeben/)
      expect(r.meta.links.docs).toBe('')
      expect(r.specimens.every((s) => ['row', 'grid', 'composition'].includes(s.layout))).toBe(true)
    })
  }
})

describe('event: Outline-Knopf im Hero mit den Farben des Heros (Abschluss Plan v3, 08.10.2026, Freigabe ausstehend)', () => {
  it('Schrift always-light, Schleier fuer Hover/Active — nur im Hero', () => {
    const c = css()
    expect(c).toMatch(/\.nc-event__hero \.nc-button--outline\{--mod-button-outline-color: ?var\(--fnd-color-always-light\);--mod-button-outline-bg-hover: ?color-mix\(in srgb, ?var\(--fnd-color-always-light\) 10%, ?transparent\);--mod-button-outline-bg-active: ?color-mix\(in srgb, ?var\(--fnd-color-always-light\) 19%, ?transparent\)\}/)
    // nur diese eine Stelle setzt die Schrift des Outline-Knopfs auf always-light
    expect(c.match(/--mod-button-outline-color: ?var\(--fnd-color-always-light\)/g)).toHaveLength(1)
  })
})

describe('event / events: Kartenraster ohne Ueberlauf (Abschluss Plan v3, 08.10.2026, Freigabe ausstehend)', () => {
  it('Spur hoechstens so breit wie das Raster', () => {
    const c = css()
    for (const sel of ['nc-event__related-grid', 'nc-events__grid']) {
      expect(c, sel).toMatch(new RegExp(`\\.${sel}\\{display:grid;grid-template-columns:repeat\\(auto-fill, ?minmax\\(min\\(300px, ?100%\\), ?1fr\\)\\)`))
    }
  })
})
