// generate-component-specs.js: leere Eintraege in Textlisten des Recipes
// (domNotes, a11y-Assertions) duerfen weder im JSON noch als leere
// Aufzaehlungszeile `- ` im Markdown landen (hero, bis 05.10.2026).
import { describe, it, expect } from 'vitest'
import { recipeToSpec, specToMarkdown, textListe } from '../scripts/generate-component-specs.js'

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
