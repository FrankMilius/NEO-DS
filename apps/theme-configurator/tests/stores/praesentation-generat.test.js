// Generator und Bereich Praesentation (Plan v2, 2.5): die Folien-Grammatik
// kommt als Objekt ohne Notizen in die App und nicht mehr als ungueltige
// Custom Properties in data/design-tokens.css.
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { praesentation } from '../../src/data/tokens.js'

const notizPfade = (o, pfad = []) => Object.entries(o).flatMap(([k, v]) => [
  ...(k.startsWith('_') ? [[...pfad, k].join('.')] : []),
  ...(v && typeof v === 'object' ? notizPfade(v, [...pfad, k]) : [])
])

describe('Generat: praesentation', () => {
  it('wird exportiert, ohne _notiz-Schluessel', () => {
    expect(Object.keys(praesentation)).toEqual(expect.arrayContaining(
      ['figma', 'dichtestufen', 'status', 'diagramm', 'gruenfamilie', 'welten', 'papiere']))
    expect(notizPfade(praesentation)).toEqual([])
    expect(praesentation.diagramm.farbfolge).toHaveLength(6)
  })

  it('data/design-tokens.css enthaelt keine --fnd-praesentation-, _configurator- oder Notiz-Zeilen', () => {
    const css = readFileSync(resolve(__dirname, '../../../../data/design-tokens.css'), 'utf8')
    expect(css).not.toMatch(/--fnd-praesentation/)
    expect(css).not.toMatch(/--fnd--configurator/)
    expect(css).not.toMatch(/notiz/)
    expect(css).toMatch(/--fnd-spacing-/)
  })
})
