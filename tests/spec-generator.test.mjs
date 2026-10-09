// generate-component-specs.js: leere Eintraege in Textlisten des Recipes
// (domNotes, a11y-Assertions) duerfen weder im JSON noch als leere
// Aufzaehlungszeile `- ` im Markdown landen (hero, bis 05.10.2026).
import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { recipeToSpec, specToMarkdown, textListe, gelesenModOverrides } from '../scripts/generate-component-specs.js'

const recipe = {
  meta: { component: 'probe', version: '1.0.0', status: 'stable', layer: 'organism', tags: [] },
  anatomy: {
    root: { element: '.nc-probe' },
    slots: [],
    domNotes: ['Erste Notiz.', '', '   ', 'Zweite Notiz.'],
  },
  a11y: { base: { role: 'region', assertions: ['Hat eine Ueberschrift.', ''] } },
}

describe('generate-component-specs: Textlisten ohne leere Eintraege', () => {
  it('textListe verwirft leere, reine Leerzeichen und Nicht-Strings', () => {
    expect(textListe(['a', '', '  ', null, 3, 'b'])).toEqual(['a', 'b'])
    expect(textListe(undefined)).toEqual([])
  })

  it('JSON: domNotes und Assertions ohne leere Eintraege', () => {
    const spec = recipeToSpec(recipe)
    expect(spec.anatomy.notes).toEqual(['Erste Notiz.', 'Zweite Notiz.'])
    expect(spec.a11y.assertions).toEqual(['Hat eine Ueberschrift.'])
  })

  it('Markdown: keine leere Aufzaehlungszeile', () => {
    const md = specToMarkdown(recipeToSpec(recipe))
    expect(md).toContain('- Erste Notiz.\n- Zweite Notiz.\n')
    expect(md.split('\n').filter((z) => /^-\s*$/.test(z))).toEqual([])
  })

  it('nur leere domNotes: kein Abschnitt DOM Notes', () => {
    const md = specToMarkdown(recipeToSpec({ ...recipe, anatomy: { ...recipe.anatomy, domNotes: [''] } }))
    expect(md).not.toContain('### DOM Notes')
  })
})

// Restpunkte 09.10.2026: --mod-* nur, wenn das SCSS es liest (vorher 426 von
// 2511 Overrides ohne Wirkung in den Specs).
describe('generate-component-specs: nur gelesene --mod-*-Overrides', () => {
  const wurzel = new URL('../', import.meta.url)

  it('Spec fuehrt kein --mod-*, das das SCSS nicht liest', () => {
    const md = specToMarkdown(recipeToSpec({
      ...recipe,
      styling: { baseClasses: ['nc-probe'], tokenGroups: { g: { tokens: ['nc-probe-gibt-es-nicht'] } } },
    }))
    expect(md).toContain('| `--nc-probe-gibt-es-nicht` | — | — |')
    const gelesen = gelesenModOverrides()
    for (const f of readdirSync(new URL('specs/', wurzel)).filter((n) => n.endsWith('.spec.json'))) {
      const spec = JSON.parse(readFileSync(new URL(`specs/${f}`, wurzel), 'utf8'))
      for (const m of spec.cssApi?.modTokens || []) expect(gelesen.has(m), `${f}: ${m}`).toBe(true)
    }
  })

  it('SCSS-Quelle und gebautes CSS lesen dieselben --mod-* (keine Interpolation)', () => {
    const css = new URL('styles.css', wurzel)
    if (!existsSync(css)) return
    const imCss = new Set([...readFileSync(css, 'utf8').matchAll(/var\((--mod-[a-zA-Z0-9_-]+)/g)].map((m) => m[1]))
    expect([...gelesenModOverrides()].sort()).toEqual([...imCss].sort())
  })
})
