// Farbskalen der Haupt-Paletten (Befund Frank 15.10.2026): gleiche Rechnung
// wie das Design System, Mitziehen der semantischen Farben, Export.
import { describe, it, expect, beforeEach } from 'vitest'
import { resolve } from 'node:path'
import * as sass from 'sass'
import { erzeugeSkala, paletteSkala, zieheMit, palettenCss, istVorgabe, WEBSITE_STUFEN } from '../../src/utils/farbskala.js'
import { primitiveColors } from '../../src/data/tokens.js'
import { useThemeStore } from '../../src/stores/theme.js'

const WURZEL = resolve(__dirname, '../../../..')

describe('erzeugeSkala = fn.generate-shade-scale() des Design Systems', () => {
  it('Stufe für Stufe gleich (Kundenfarbe #0b5cad)', () => {
    const scss = `@use 'sass:map';@use 'scss/scss/00-settings/color-functions' as fn;
      $s: fn.generate-shade-scale(#0b5cad);
      a { @each $k, $v in $s { --s-#{$k}: #{$v}; } }`
    const css = sass.compileString(scss, { loadPaths: [WURZEL] }).css
    // Sass gibt Mischstufen als rgb() mit Nachkommastellen aus, der Browser rundet
    const hex = (v) => v.startsWith('#') ? v : '#' + v.match(/[\d.]+/g).map(n => Math.round(Number(n)).toString(16).padStart(2, '0')).join('')
    const ds = Object.fromEntries([...css.matchAll(/--s-(\d+): ([^;]+);/g)].map(m => [Number(m[1]), hex(m[2].trim())]))
    const app = erzeugeSkala('#0b5cad')
    for (const [stufe, farbe] of Object.entries(ds)) expect(app[stufe], `Stufe ${stufe}`).toBe(farbe)
    expect(Object.keys(ds).length).toBeGreaterThanOrEqual(10)
  })

  it('NEO-Vorgabe liefert die Leiter, eigene Basis die erzeugte Skala', () => {
    expect(istVorgabe('accent', primitiveColors.accent.base)).toBe(true)
    expect(paletteSkala('accent', primitiveColors.accent.base)[600]).toBe(String(primitiveColors.accent.shades[600]).toLowerCase())
    expect(paletteSkala('accent', '#e06060')[500]).toBe('#e06060')
    expect(paletteSkala('accent', '#e06060')[600]).toBe(erzeugeSkala('#e06060')[600])
  })
})

describe('zieheMit', () => {
  it('ersetzt nur Werte, die einer Stufe der alten Skala entsprechen', () => {
    const alt = paletteSkala('accent', primitiveColors.accent.base)
    const neu = paletteSkala('accent', '#e06060')
    const tokens = { a: alt[500], b: alt[800].toUpperCase(), eigen: '#123456' }
    expect(zieheMit(tokens, alt, neu).sort()).toEqual(['a', 'b'])
    expect(tokens).toEqual({ a: neu[500], b: neu[800], eigen: '#123456' })
  })
})

describe('palettenCss', () => {
  it('nur geänderte Paletten, Website-Stufen, Secondary ohne Ausgabe', () => {
    expect(palettenCss({ primary: primitiveColors.primary.base, accent: primitiveColors.accent.base, secondary: '#ff0000' })).toEqual([])
    const css = palettenCss({ accent: '#e06060', primary: '#0b5cad' }).join('\n')
    expect(css).toContain('--fnd-accent-500: #e06060;')
    expect(css).toContain('--fnd-neutral-500: #0b5cad;')
    expect(css.match(/--fnd-accent-\d+:/g)).toHaveLength(WEBSITE_STUFEN.length)
    expect(css).toContain(':root, .neo-light-theme, .neo-dark-theme, .neo-mono-light, .neo-mono-dark {')
  })
})

describe('Store: Palette ändern zieht semantische Farben mit und landet im CSS', () => {
  let store
  beforeEach(() => {
    localStorage.clear()
    store = useThemeStore()
    store.state.activeThemeSet = 'neo'
  })

  it('Accent: background-accent hell und dunkel folgen, eigener Wert bleibt, Export mit Skala', () => {
    const t = store.state.themes.neo
    const altHell = t.light['background-accent']
    expect(paletteSkala('accent', store.state.primitiveOverrides.neo.accent)[500]).toBe(altHell.toLowerCase())
    t.light['text-link'] = '#123456'
    store.updatePrimitive('accent', '#E06060')
    expect(store.state.primitiveOverrides.neo.accent).toBe('#e06060')
    expect(t.light['background-accent']).toBe('#e06060')
    expect(t.dark['background-accent']).toBe(paletteSkala('accent', '#e06060')[500])
    expect(t.light['text-link']).toBe('#123456')
    const css = store.exportAsCSSVars({ nurAbweichungen: true })
    expect(css).toContain('--fnd-accent-500: #e06060;')
    expect(css).toContain('--fnd-color-background-accent: #e06060;')
    store.updatePrimitive('accent', primitiveColors.accent.base)   // zurück
    expect(t.light['background-accent']).toBe(altHell.toLowerCase())
  })

  it('ungültige Eingabe ändert nichts', () => {
    const vorher = store.state.primitiveOverrides.neo.primary
    store.updatePrimitive('primary', '#12')
    expect(store.state.primitiveOverrides.neo.primary).toBe(vorher)
  })
})
