// Pixelvergleich ohne Zusatzpaket: Chromium dekodiert beide PNGs, zeichnet sie
// streifenweise auf ein Canvas und zählt Pixel mit Graudifferenz > Schwelle
// (Regel aus dem bisherigen Python-Auswerter). Ungleiche Größe ist ein
// Unterschied; sehr lange Seiten werden in Streifen verglichen, nicht abgeschnitten.
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { chromium } from '../../scripts/pruefen/lib/browser.mjs'
import { Vergleicher } from '../../scripts/pruefen/lib/vergleich.mjs'

let browser, seite, v

async function bild (html, hoehe = 200) {
  await seite.setViewportSize({ width: 300, height: hoehe })
  await seite.setContent(`<style>body{margin:0;background:#fff}</style>${html}`)
  return seite.screenshot({ fullPage: true })
}

beforeAll(async () => {
  browser = await chromium().launch()
  seite = await browser.newPage()
  v = await Vergleicher.starte(browser)
}, 30000)
afterAll(async () => { await v?.schliesse(); await browser?.close() })

describe('pruefen: Pixelvergleich', () => {
  it('zwei gleiche Bilder → 0 abweichend', async () => {
    const a = await bild('<div style="width:100px;height:50px;background:#336"></div>')
    const b = await bild('<div style="width:100px;height:50px;background:#336"></div>')
    expect(await v.vergleiche(a, b)).toEqual({ gleicheGroesse: true, abweichend: 0, breite: 300, hoehe: 200 })
  })

  it('ein Feld umgefärbt → genau seine Fläche weicht ab', async () => {
    const a = await bild('<div style="width:100px;height:50px;background:#336"></div>')
    const b = await bild('<div style="width:100px;height:50px;background:#c33"></div>')
    expect((await v.vergleiche(a, b)).abweichend).toBe(100 * 50)
  })

  it('Differenz unter der Schwelle zählt nicht', async () => {
    const a = await bild('<div style="width:100px;height:50px;background:#808080"></div>')
    const b = await bild('<div style="width:100px;height:50px;background:#848484"></div>')
    expect((await v.vergleiche(a, b, { schwelle: 8 })).abweichend).toBe(0)
  })

  it('andere Höhe → gleicheGroesse false, überstehende Fläche zählt als abweichend', async () => {
    const a = await bild('', 200)
    const b = await bild('', 260)
    expect(await v.vergleiche(a, b)).toMatchObject({ gleicheGroesse: false, abweichend: 300 * 60 })
  })

  it('Seite höher als die Canvas-Grenze wird vollständig verglichen', async () => {
    const lang = (farbe) => `<div style="height:40000px"></div><div style="height:10px;background:${farbe}"></div>`
    const a = await bild(lang('#fff'), 900)
    const b = await bild(lang('#000'), 900)
    expect(await v.vergleiche(a, b)).toMatchObject({ gleicheGroesse: true, abweichend: 300 * 10 })
  }, 60000)
})
