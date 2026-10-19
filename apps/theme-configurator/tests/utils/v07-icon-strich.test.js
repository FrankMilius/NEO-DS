// Roadmap V07 (19.10.2026): Strichstärke der Icons wirkt auf der Website
import { describe, it, expect, beforeEach } from 'vitest'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { useThemeStore } from '../../src/stores/theme.js'
import { iconStrichZeilen, migriereStriche, strichLeer, strichVorgaben } from '../../src/utils/icon-strich.js'
import { vorschauVariablen } from '../../src/lib/vorschau-variablen.js'

const SCSS = resolve(__dirname, '../../../../scss/scss')
function alleScss (d, a = []) { for (const f of readdirSync(d)) { const p = join(d, f); statSync(p).isDirectory() ? alleScss(p, a) : p.endsWith('.scss') && a.push(p) } return a }

let store
beforeEach(() => { localStorage.clear(); store = useThemeStore(); store.resetToDefaults(); store.state.activeThemeSet = 'neo' })

describe('Design System: Theme-Haken statt fester Strichstärken', () => {
  const texte = alleScss(SCSS).map((p) => readFileSync(p, 'utf8'))
  it('Komponenten lesen --fnd-icon-stroke-<stufe> mit dem bisherigen Wert als Rückfall', () => {
    const treffer = texte.join('\n').match(/stroke-width: var\(--fnd-icon-stroke-(xs|sm|md|lg|xl|2xl), [\d.]+\);/g) || []
    expect(treffer.length).toBeGreaterThanOrEqual(49)
  })
  it('das Design System definiert die Variablen nicht (Website ohne Theme unverändert)', () => {
    expect(texte.join('\n')).not.toMatch(/--fnd-icon-stroke-[\w]+\s*:/)
  })
})

describe('Konfigurator', () => {
  it('Vorgabe ist „Standard“ (leer) — kein Export', () => {
    expect(store.currentIconStrokeWidths.tabler).toEqual(strichLeer())
    expect(store.exportAsCSSVars()).not.toContain('--fnd-icon-stroke-')
  })
  it('gesetzte Stufen gehen ins CSS, nur gültige Werte', () => {
    expect(iconStrichZeilen({ xs: '1.75', sm: '', md: 'abc', lg: '9', xl: '.5', '2xl': '2' }))
      .toEqual(['  --fnd-icon-stroke-xs: 1.75;', '  --fnd-icon-stroke-xl: .5;', '  --fnd-icon-stroke-2xl: 2;'])
    store.updateIconStrokeWidth('tabler', 'xs', '1.5')
    expect(store.exportAsCSSVars()).toContain('--fnd-icon-stroke-xs: 1.5;')
  })
  it('nur die Website-Bibliothek (Tabler) wird exportiert', () => {
    store.updateIconStrokeWidth('heroicons', 'xs', '1')
    expect(store.exportAsCSSVars()).not.toContain('--fnd-icon-stroke-')
  })
  it('Arena-Vorschau bekommt dieselben Variablen', () => {
    store.updateIconStrokeWidth('tabler', 'sm', '1.25')
    const vars = vorschauVariablen({ id: 'accordion', modus: 'light', state: store.state })
    expect(vars['--fnd-icon-stroke-sm']).toBe('1.25')
  })
  it('alte, unveränderte Vorgaben werden „Standard“; veränderte bleiben', () => {
    const alt = { tabler: { xs: '1', sm: '1.5', md: '1.5', lg: '2', xl: '2', '2xl': '2' }, heroicons: { xs: '1.5', sm: '1.5', md: '1.5', lg: '1.5', xl: '1.5', '2xl': '1.5' } }
    expect(migriereStriche(alt)).toBe(true)
    expect(alt).toEqual(strichVorgaben())
    const geaendert = { tabler: { xs: '2', sm: '1.5', md: '1.5', lg: '2', xl: '2', '2xl': '2' } }
    expect(migriereStriche(geaendert)).toBe(false)
    expect(geaendert.tabler.xs).toBe('2')
  })
})
