/**
 * Tokens-Studio-Export (Roadmap R08, 20.10.2026): Umwandlung einzeln und
 * die ganze Datei aus dem aktuellen DTCG-Export.
 */
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { alsTokensStudio, farbe, mass, schatten, typVon, pfadUmschreiben, verweiseIn, TYPEN, SETS } from '../packages/tokens-studio-export/index.js'

const dtcg = JSON.parse(readFileSync(new URL('../data/design-tokens.dtcg.json', import.meta.url), 'utf8'))
const { datei, bericht } = alsTokensStudio(dtcg)

/** alle Tokens eines Sets als [pfad, token] */
function tokens (set) {
  const aus = []
  ;(function lauf (o, p) {
    for (const [k, v] of Object.entries(o)) {
      if (!v || typeof v !== 'object') continue
      if ('value' in v && 'type' in v) aus.push([p.concat(k).join('.'), v])
      else lauf(v, p.concat(k))
    }
  })(datei[set], [])
  return aus
}

describe('Umwandlung einzelner Werte', () => {
  it('Farben: Hex, mit Alpha achtstellig, Verweise umgeschrieben', () => {
    expect(farbe({ colorSpace: 'srgb', components: [0, 0, 0], alpha: 1, hex: '#000000' })).toBe('#000000')
    expect(farbe({ colorSpace: 'srgb', components: [0, 0, 0], alpha: 0.1, hex: '#000000' })).toBe('#0000001a')
    expect(farbe('{foundation._configurator.focus.color}')).toBe('{foundation.focus.color}')
  })
  it('Maße und Dauern als Text mit Einheit', () => {
    expect(mass({ value: 20, unit: 'px' })).toBe('20px')
    expect(mass({ value: 0.625, unit: 'rem' })).toBe('0.625rem')
    expect(mass({ value: 1.5, unit: 's' })).toBe('1.5s')
    expect(mass('{foundation._configurator.spacing.05}')).toBe('{foundation.spacing.05}')
  })
  it('Schatten: einfach, mehrfach, innen; mit var() nicht umwandelbar', () => {
    expect(schatten('0 1px 2px rgba(15, 23, 42, 0.06)')).toEqual({ x: '0', y: '1', blur: '2', spread: '0', color: 'rgba(15, 23, 42, 0.06)', type: 'dropShadow' })
    expect(schatten('0 1px 2px #000, inset 0 0 0 1px rgba(0,0,0,.1)')).toHaveLength(2)
    expect(schatten('inset 0 1px 2px rgba(0, 0, 0, 0.2)').type).toBe('innerShadow')
    expect(schatten('0 0 0 var(--x) red')).toBeNull()
  })
  it('Typen aus DTCG-Typ, Pfad und CSS-Art', () => {
    expect(typVon('color', ['semantic', 'text-primary'])).toBe('color')
    expect(typVon('dimension', ['foundation', 'spacing', '05'])).toBe('spacing')
    expect(typVon('dimension', ['foundation', 'radius', 'md'])).toBe('borderRadius')
    expect(typVon('dimension', ['components', 'button', 'nc-button-height-xs'], 'size')).toBe('sizing')
    expect(typVon(undefined, ['components', 'badge', 'nc-badge-font-weight'], 'size', '600')).toBe('fontWeights')
    expect(typVon(undefined, ['components', 'x', 'nc-x-scale'], 'generic', '0.97')).toBe('number')
    expect(pfadUmschreiben('foundation._configurator.size.xs')).toBe('foundation.size.xs')
    expect(verweiseIn({ color: '{semantic.x}', x: '0' })).toEqual(['semantic.x'])
  })
})

describe('Datei für Tokens Studio', () => {
  it('Sets, Themen und Reihenfolge', () => {
    expect(Object.keys(datei).filter((k) => !k.startsWith('$'))).toEqual(SETS)
    expect(datei.$metadata.tokenSetOrder).toEqual(SETS)
    expect(datei.$themes.map((t) => t.name)).toEqual(['NEO Hell', 'NEO Dunkel'])
    expect(datei.$themes[0].selectedTokenSets['semantic-dunkel']).toBe('disabled')
    expect(datei.$themes[1].selectedTokenSets['semantic-dunkel']).toBe('enabled')
  })
  it('jeder Token hat einen gültigen Typ und einen Wert', () => {
    for (const set of SETS) {
      for (const [p, t] of tokens(set)) {
        expect(TYPEN, `${set}: ${p}`).toContain(t.type)
        expect(t.value, `${set}: ${p}`).not.toBeUndefined()
        expect(JSON.stringify(t.value), `${set}: ${p}`).not.toContain('undefined')
      }
    }
  })
  it('CSS-Text, den Figma nicht kennt, steht nur bei „other“', () => {
    for (const set of SETS) {
      for (const [p, t] of tokens(set)) {
        if (t.type === 'other' || t.type === 'fontFamilies' || t.type === 'boxShadow') continue
        expect(String(t.value), `${set}: ${p}`).not.toMatch(/var\(|clamp\(|repeat\(|calc\(/)
      }
    }
  })
  it('alle Verweise sind in beiden Themen auflösbar', () => {
    expect(bericht.offen).toEqual([])
    const basis = new Set(['primitives', 'foundation', 'semantic', 'components'].flatMap((s) => tokens(s).map(([p]) => p)))
    for (const set of SETS) for (const [p, t] of tokens(set)) for (const z of verweiseIn(t.value)) expect(basis.has(z), `${set}: ${p} → {${z}}`).toBe(true)
  })
  it('Dunkel-Sets überschreiben nur vorhandene Tokens', () => {
    for (const [dunkel, hell] of [['semantic-dunkel', 'semantic'], ['components-dunkel', 'components']]) {
      const pfade = new Set(tokens(hell).map(([p]) => p))
      for (const [p] of tokens(dunkel)) expect(pfade.has(p), `${dunkel}: ${p}`).toBe(true)
    }
    expect(tokens('semantic-dunkel').length).toBe(tokens('semantic').length)
  })
  it('Grundlagen ohne _configurator im Namen; Konfigurationsdaten fehlen', () => {
    const pfade = tokens('foundation').map(([p]) => p)
    expect(pfade.some((p) => p.includes('_configurator'))).toBe(false)
    expect(pfade).toContain('foundation.spacing.05')
    expect(pfade.some((p) => p.includes('fluid_mappings') || p.includes('viewport_min'))).toBe(false)
  })
  it('die Datei im Repository ist aktuell', () => {
    const gespeichert = readFileSync(new URL('../data/design-tokens.tokens-studio.json', import.meta.url), 'utf8')
    expect(gespeichert).toBe(JSON.stringify(datei, null, 2) + '\n')
  })
})
