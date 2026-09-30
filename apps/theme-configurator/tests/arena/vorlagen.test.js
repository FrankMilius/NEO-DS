/**
 * Vorlagen-Registry (src/arena-templates): Abdeckung und Snapshots.
 *
 * Kennzahl „Recipes mit Vorlage": wie viele Recipes echtes Markup (aus
 * data/markup, per Vorlage mit Recipe-Klassen/-Zustaenden gefuellt) statt der
 * Slot-Heuristik bekommen. Die Zahl steht in der Testausgabe.
 */
import { describe, it, expect } from 'vitest'
import { vorlagenIds, vorlageFuer } from '../../src/arena-templates/index.js'
import { normalisiereRecipe, specimenAnsicht } from '../../src/lib/recipe-arena.js'
import { hasArena } from '../../src/composables/useArenaResolver.js'
import { RECIPE_IDS, rohesRecipe } from './_recipes.js'

function ansichten (id) {
  const recipe = normalisiereRecipe(rohesRecipe(id))
  return recipe.specimens.map((sp) => specimenAnsicht(sp, recipe, id, vorlageFuer(id)))
}

describe('Arena-Vorlagen: Abdeckung', () => {
  it('jede Vorlage gehoert zu einem Recipe', () => {
    const verwaist = vorlagenIds().filter((id) => !RECIPE_IDS.includes(id))
    expect(verwaist).toEqual([])
  })

  it('Kennzahl: Recipes mit Vorlage', () => {
    const mit = RECIPE_IDS.filter((id) => vorlageFuer(id))
    const sichtbar = mit.filter((id) => !hasArena(id))
    const ohneArena = RECIPE_IDS.filter((id) => !hasArena(id))
    console.log(
      `[Arena-Vorlagen] Recipes mit Vorlage: ${mit.length} von ${RECIPE_IDS.length}` +
      ` — davon in der App sichtbar (keine Sonderfall-Arena): ${sichtbar.length} von ${ohneArena.length}`
    )
    expect(mit.length).toBeGreaterThanOrEqual(69)
  })

  for (const id of vorlagenIds()) {
    it(`${id}: jede Zelle kommt aus der Vorlage`, () => {
      const quellen = new Set(ansichten(id).flatMap((a) => a.zeilen.flatMap((z) => z.zellen.map((c) => c.quelle))))
      expect([...quellen]).toEqual(['vorlage'])
    })
  }
})

describe('Arena-Vorlagen: Snapshots', () => {
  const FAELLE = [
    ['kbd', 'key-combination'],
    ['form-hint', 'with-icon'],
    ['form-label', 'all-states'],
    ['stepper', 'all-states'],
    ['empty-state', 'content-variants'],
    ['divider', 'with-label'],
    ['compare-table', 'selectable'],
    // Stufe 3: Organismen und groessere Molekuele
    ['footer', 'columns-comparison'],
    ['timeline', 'node-status-variants'],
    ['logo-wall', 'layouts-comparison'],
    ['product-showcase', 'option-styles'],
    ['facts', 'default'],
    ['solution-tabs', 'vertical'],
    ['expanding-panels', 'default']
  ]
  for (const [id, specimenId] of FAELLE) {
    it(`${id} / ${specimenId}`, () => {
      const a = ansichten(id).find((x) => x.id === specimenId)
      expect(a, `${id}: Specimen ${specimenId} fehlt`).toBeTruthy()
      const zellen = a.zeilen.flatMap((z) => z.zellen).map((z) => ({
        id: z.id,
        label: z.label,
        tokenGroups: z.tokenGroups,
        html: z.html.trim()
      }))
      expect(zellen).toMatchSnapshot()
    })
  }
})

describe('Arena-Vorlagen: Stufe 3 (Organismen)', () => {
  const html = (id, specimenId) => ansichten(id).find((a) => a.id === specimenId)
    .zeilen.flatMap((z) => z.zellen).map((z) => z.html)

  it('footer: Spaltenzahl folgt der Achse columns, simple ohne Sitemap', () => {
    const [zwei, drei, vier] = html('footer', 'columns-comparison')
    const spalten = (h) => (h.match(/class="nc-footer__column"/g) || []).length
    expect([spalten(zwei), spalten(drei), spalten(vier)]).toEqual([2, 3, 4])
    const [simple] = html('footer', 'simple-light')
    expect(simple).not.toContain('nc-footer__columns')
    expect(simple).not.toContain('nc-footer__newsletter')
    expect(html('footer', 'cta-engagement')[0]).toContain('nc-footer__cta')
  })

  it('timeline: nodeStatus landet an den Knoten', () => {
    const zellen = html('timeline', 'node-status-variants')
    expect(zellen.some((h) => h.includes('nc-timeline__node--success'))).toBe(true)
    expect(zellen.some((h) => h.includes('nc-timeline__node--danger'))).toBe(true)
  })

  it('expanding-panels: open klappt das erste Panel auf', () => {
    const [zu, auf] = html('expanding-panels', 'default')
    expect(zu).not.toContain('aria-expanded="true"')
    expect(auf).toContain('aria-expanded="true"')
  })

  it('keine externen Bild-URLs in den Vorlagen', () => {
    for (const id of vorlagenIds()) {
      for (const a of ansichten(id)) {
        for (const z of a.zeilen.flatMap((x) => x.zellen)) {
          expect(z.html, id).not.toMatch(/(src|poster)="(https?:|\/)/)
        }
      }
    }
  })
})

describe('Arena-Vorlagen: Abgleich mit dem Drupal-Twig (neo_fe)', () => {
  const alle = (id) => ansichten(id).flatMap((a) => a.zeilen.flatMap((z) => z.zellen)).map((z) => z.html)

  it('text-media: Medienposition als --media-left/--media-right, kein --reversed', () => {
    const [links, rechts] = alle('text-media')
    expect(links).toContain('nc-text-media--media-left')
    expect(rechts).toContain('nc-text-media--media-right')
    expect(rechts).not.toContain('nc-text-media--reversed')
  })

  it('testimonial: figure > blockquote.__quote + figcaption.__author > cite.__name', () => {
    const [h] = alle('testimonial')
    expect(h.trim()).toMatch(/^<figure class="nc-testimonial/)
    expect(h).toContain('<blockquote class="nc-testimonial__quote">')
    expect(h).toContain('<figcaption class="nc-testimonial__author">')
    expect(h).toContain('<cite class="nc-testimonial__name">')
  })

  it('testimonial-grid / story-gallery: Navigation steht nach dem Raster, nicht darin', () => {
    const grid = alle('testimonial-grid').find((h) => h.includes('nc-testimonial-grid__nav'))
    expect(grid.indexOf('nc-testimonial-grid__nav')).toBeGreaterThan(grid.lastIndexOf('</figure>\n</div>'))
    const [sg] = alle('story-gallery')
    expect(sg).toMatch(/<\/ul>\n<\/div>\n<\/div>\n<div class="nc-story-gallery__footer">/)
    expect(sg).toContain('nc-story-gallery__paddles nc-story-gallery__paddles--below')
  })

  it('solution-tabs: Features, Schaubild und Tab-Nummer wie neoSolutionTabs', () => {
    const h = alle('solution-tabs').join('\n')
    expect(h).toContain('nc-solution-tabs__features')
    expect(h).toContain('nc-solution-tabs__visual')
    expect(h).toContain('nc-solution-tabs__tab-index')
    expect(h).not.toContain('nc-feature-list__item')
    expect(h).not.toContain('nc-tab-nav')
  })

  it('tab-nav: Wurzel nc-solution-tabs nc-tab-nav, Modul mit nc-tab-nav__features', () => {
    const [h] = alle('tab-nav')
    expect(h).toMatch(/class="nc-solution-tabs nc-tab-nav/)
    expect(h).toContain('nc-solution-tabs__features nc-tab-nav__features')
  })

  it('app-store: Store-Abzeichen und QR-Code', () => {
    const [h] = alle('app-store')
    expect((h.match(/class="nc-app-store__badge"/g) || []).length).toBe(2)
    expect(h).toContain('nc-app-store__qr-code')
  })

  it('feature-list: mit Medium immer with-media + media-* + valign-*', () => {
    for (const h of alle('feature-list').filter((x) => x.includes('nc-feature-list__media'))) {
      expect(h).toMatch(/nc-feature-list--with-media/)
      expect(h).toMatch(/nc-feature-list--media-(left|right)/)
      expect(h).toMatch(/nc-feature-list--valign-(top|middle|bottom)/)
    }
  })

  it('footer / events: CTA-Headline h2, Mehr-laden als secondary', () => {
    expect(alle('footer').find((h) => h.includes('nc-footer__cta'))).toContain('<h2 class="nc-footer__cta-headline">')
    expect(alle('events')[0]).toContain('nc-button nc-button--secondary')
  })
})
