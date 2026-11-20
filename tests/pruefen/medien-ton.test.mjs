// Medien einfärben (I12): Filterkette Graustufen → Schwarzpunkt → Multiplizieren
// mit einem Ton. Die Zahlen für brightness() und contrast() folgen aus dem
// Schwarzpunkt; der Vergleich läuft im echten Chromium, damit er dieselbe
// Filter- und Mischlogik misst, die später die Website rendert.
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { chromium } from '../../scripts/pruefen/lib/browser.mjs'
import { readFileSync, existsSync } from 'node:fs'
import path from 'node:path'
import { filterParameter, filterKette, mittlereAbweichung, vergleicheMitVorlage, vergleicheMitStylesheet } from '../../scripts/pruefen/lib/medien-ton.mjs'

let browser, seite

// Einfarbiges Bild als PNG-Daten-URL, im Browser erzeugt (kein Zusatzpaket)
async function flaeche (farbe, breite = 20, hoehe = 10) {
  return seite.evaluate(([f, b, h]) => {
    const c = document.createElement('canvas'); c.width = b; c.height = h
    const x = c.getContext('2d'); x.fillStyle = f; x.fillRect(0, 0, b, h)
    return c.toDataURL('image/png')
  }, [farbe, breite, hoehe])
}

beforeAll(async () => {
  browser = await chromium().launch()
  seite = await browser.newPage()
}, 30000)
afterAll(async () => { await browser?.close() })

describe('medien-ton: Filterparameter', () => {
  it('Schwarzpunkt 0.3 bildet 0.3 auf 0 und 1 auf 1 ab', () => {
    const { helligkeit: h, kontrast: k } = filterParameter(0.3)
    expect(k).toBeCloseTo(1.857, 3)
    expect(h).toBeCloseTo(0.769, 3)
    const abbild = (x) => (x * h - 0.5) * k + 0.5
    expect(abbild(0.3)).toBeCloseTo(0, 9)
    expect(abbild(1)).toBeCloseTo(1, 9)
  })

  it('Schwarzpunkt 0 lässt die Helligkeit unverändert', () => {
    expect(filterParameter(0)).toEqual({ helligkeit: 1, kontrast: 1 })
  })

  it('Schwarzpunkt außerhalb von 0 bis unter 1 ist ein Fehler', () => {
    expect(() => filterParameter(1)).toThrow()
    expect(() => filterParameter(-0.1)).toThrow()
    expect(() => filterParameter(Number.NaN)).toThrow()
  })

  it('Filterkette nennt Graustufen, Helligkeit und Kontrast in dieser Reihenfolge', () => {
    expect(filterKette(0.3)).toMatch(/^grayscale\(1\) brightness\(0\.769\d*\) contrast\(1\.857\d*\)$/)
  })
})

describe('medien-ton: mittlere Abweichung', () => {
  it('rechnet je Farbkanal und lässt den Alphakanal weg', () => {
    const a = new Uint8ClampedArray([10, 20, 30, 255, 0, 0, 0, 0])
    const b = new Uint8ClampedArray([14, 20, 20, 0, 0, 4, 0, 255])
    expect(mittlereAbweichung(a, b)).toEqual([2, 2, 5])
  })

  it('ungleich lange Daten sind ein Fehler', () => {
    expect(() => mittlereAbweichung(new Uint8ClampedArray(4), new Uint8ClampedArray(8))).toThrow()
  })
})

describe('medien-ton: Vergleich im Browser', () => {
  it('Weiß wird zum Ton', async () => {
    const r = await vergleicheMitVorlage(seite, {
      original: await flaeche('#ffffff'), vorlage: await flaeche('#88e6b1'), ton: '#88e6b1', schwarzpunkt: 0.3,
    })
    expect(r).toMatchObject({ breite: 20, hoehe: 10, gleicheGroesse: true })
    for (const k of r.abweichung) expect(k).toBeLessThanOrEqual(1)
  }, 30000)

  it('Grau am Schwarzpunkt wird schwarz, Schwarz bleibt schwarz', async () => {
    for (const grau of ['#4d4d4d', '#000000']) {
      const r = await vergleicheMitVorlage(seite, {
        original: await flaeche(grau), vorlage: await flaeche('#000000'), ton: '#88e6b1', schwarzpunkt: 0.3,
      })
      for (const k of r.abweichung) expect(k).toBeLessThanOrEqual(2)
    }
  }, 30000)

  it('Mittelgrau landet auf halbem Weg zwischen Schwarz und Ton (Steigung, nicht nur Endpunkte)', async () => {
    // Graustufe 0.65 = #a6a6a6: bei Schwarzpunkt 0.3 → (0.65−0.3)/0.7 = 0.5 → halber Ton
    const halb = '#' + [0x88, 0xe6, 0xb1].map((k) => Math.round(k * 0.5).toString(16).padStart(2, '0')).join('')
    const r = await vergleicheMitVorlage(seite, {
      original: await flaeche('#a6a6a6'), vorlage: await flaeche(halb), ton: '#88e6b1', schwarzpunkt: 0.3,
    })
    for (const k of r.abweichung) expect(k).toBeLessThanOrEqual(2)
  }, 30000)

  it('ungleiche Größe von Original und Vorlage wird gemeldet', async () => {
    const r = await vergleicheMitVorlage(seite, {
      original: await flaeche('#ffffff', 20, 10), vorlage: await flaeche('#ffffff', 10, 10), ton: '#ffffff', schwarzpunkt: 0.3,
    })
    expect(r.gleicheGroesse).toBe(false)
    expect(r.abweichung).toBeNull()
  }, 30000)
})

// Das gebaute Stylesheet (npm test baut es vorher): data-medien-ton am Grid
// färbt, an der Karte schlägt es das Grid, ohne Attribut bleibt alles wie es ist.
describe('medien-ton: Design System (styles.css)', () => {
  const datei = path.resolve(import.meta.dirname, '../../styles.css')
  const css = () => readFileSync(datei, 'utf8')
  const fall = async (gridTon, karteTon, original, vorlage) =>
    vergleicheMitStylesheet(seite, { css: css(), original: await flaeche(original), vorlage: await flaeche(vorlage), gridTon, karteTon })
  const nahe = (r, grenze = 1) => { for (const k of r.abweichung) expect(k).toBeLessThanOrEqual(grenze) }

  it('styles.css ist gebaut', () => { expect(existsSync(datei)).toBe(true) })

  it.each([
    ['gruen', '#99f5c0'],
    ['aqua', '#c0e8e8'],
    ['lime', '#a4ff9f'],
    ['forest', '#aabdbe'],
  ])('Grid „%s“: Weiß wird %s', async (ton, hex) => {
    nahe(await fall(ton, null, '#ffffff', hex))
  }, 30000)

  it('Schwarzpunkt-Token 0.26: Grau #424242 wird schwarz', async () => {
    nahe(await fall('gruen', null, '#424242', '#000000'), 2)
  }, 30000)

  it('Karte „aus“ im grünen Grid bleibt ungefärbt', async () => {
    nahe(await fall('gruen', 'aus', '#3366cc', '#3366cc'), 0)
  }, 30000)

  it('Karte „aqua“ im grünen Grid bekommt Aqua', async () => {
    nahe(await fall('gruen', 'aqua', '#ffffff', '#c0e8e8'))
  }, 30000)

  it('Karte „lime“ ohne Grid-Attribut wird eingefärbt', async () => {
    nahe(await fall(null, 'lime', '#ffffff', '#a4ff9f'))
  }, 30000)

  it('Skeleton-Karte im eingefärbten Grid behält ihre Ladefläche', async () => {
    const markup = (ton) => `<style>${css()}</style><div class="nc-card-grid"${ton ? ` data-medien-ton="${ton}"` : ''}>
      <article class="nc-card nc-card--skeleton"><div class="nc-card__media"></div></article></div>`
    const flaecheVon = () => seite.evaluate(() => getComputedStyle(document.querySelector('.nc-card__media')).backgroundColor)
    await seite.setContent(markup(null)); const ohne = await flaecheVon()
    await seite.setContent(markup('gruen')); const mit = await flaecheVon()
    expect(mit).toBe(ohne)
  }, 30000)

  it('ohne Attribut bleibt das Bild unverändert', async () => {
    nahe(await fall(null, null, '#3366cc', '#3366cc'), 0)
  }, 30000)
})
