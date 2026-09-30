// Fluide Schriftskala (Plan v2, 2.3): die App muss dieselben Werte rechnen
// wie das SCSS — sonst zeigt der Editor etwas anderes, als die Website setzt.
import { describe, it, expect } from 'vitest'
import { existsSync, readFileSync } from 'fs'
import { resolve } from 'path'
import { typographyScale } from '../../src/data/tokens.generated.js'
import { skalenParameter, berechneSkala, groesseBei, istGeaendert, sassZahl } from '../../src/utils/fluid-scale.js'

const p = skalenParameter(typographyScale)
const skala = berechneSkala(p)

describe('fluide Schriftskala', () => {
  it('14 Stufen von 12 bis ca. 112 px', () => {
    expect(skala).toHaveLength(14)
    expect(skala[0]).toMatchObject({ stufe: '2xs', minPx: 12, maxPx: 13, fest: true })
    expect(Math.round(skala.at(-1).maxPx)).toBe(111)
  })

  it('min/max je Stufe = semantic_sizes_px der Quelle', () => {
    for (const s of skala) {
      const q = typographyScale.semantic_sizes_px[s.stufe]
      expect(s.minPx, `${s.stufe} min`).toBeCloseTo(q.min, 2)
      expect(s.maxPx, `${s.stufe} max`).toBeCloseTo(q.max, 2)
    }
  })

  it('CSS-Zeichenketten = gebautes styles.css (wenn vorhanden)', () => {
    const css = resolve(__dirname, '../../../../styles.css')
    if (!existsSync(css)) return // lokal ohne Build: die CI baut styles.css vor den Tests
    const text = readFileSync(css, 'utf8')
    for (const s of skala) {
      const m = text.match(new RegExp(`--fs-${s.stufe}:\\s*([^;}]+)`))
      expect(m?.[1]?.trim(), `--fs-${s.stufe}`).toBe(s.css)
    }
  })

  it('Groesse je Viewport folgt clamp()', () => {
    const base = skala.find((s) => s.stufe === 'base')
    expect(groesseBei(base, 320, p)).toBe(16)
    expect(groesseBei(base, 1920, p)).toBe(18)
    expect(groesseBei(base, 1120, p)).toBe(17)
    expect(groesseBei(base, 2400, p)).toBe(18)
  })

  it('geaenderte Parameter wirken, feste Stufen und Boden bleiben', () => {
    const q = skalenParameter(typographyScale, { base_min_px: 14, ratio_max: 1.25 })
    expect(istGeaendert(typographyScale, { base_min_px: 14 })).toBe(true)
    expect(istGeaendert(typographyScale, {})).toBe(false)
    const s = berechneSkala(q)
    expect(s.find((x) => x.stufe === 'base').minPx).toBe(14)
    expect(s.find((x) => x.stufe === 'lg').maxPx).toBeCloseTo(22.5, 5)
    expect(s.find((x) => x.stufe === 'sm').minPx).toBe(14) // fest
  })

  it('Zahlen wie Sass', () => {
    expect(sassZahl(24.334 / 16)).toBe('1.520875')
    expect(sassZahl(0.1 + 0.2)).toBe('0.3')
  })
})
