// Medien einfärben (I12): Filterkette Graustufen → Schwarzpunkt → Multiplizieren
// mit einem Ton. Die Zahlen für brightness() und contrast() folgen aus dem
// Schwarzpunkt; der Vergleich läuft im echten Chromium, damit er dieselbe
// Filter- und Mischlogik misst, die später die Website rendert.
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { chromium } from '../../scripts/pruefen/lib/browser.mjs'
import { readFileSync, existsSync } from 'node:fs'
import path from 'node:path'
import { filterParameter, filterKette, mittlereAbweichung, vergleicheMitVorlage, vergleicheMitStylesheet, vergleicheCardCta } from '../../scripts/pruefen/lib/medien-ton.mjs'

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

// card-cta (I14, 21.11.2026): Das Medium ist das direkte Kind der Karte, die
// Karte selbst ist die Tonfläche. Töne und Schwarzpunkt teilt card-cta mit der
// Card. Ohne Attribut, bei „aus“ und ohne Medium bleibt die Karte wie sie ist.
describe('medien-ton: card-cta (styles.css)', () => {
  const datei = path.resolve(import.meta.dirname, '../../styles.css')
  const css = () => readFileSync(datei, 'utf8')
  const fall = async (gridTon, karteTon, original, vorlage) =>
    vergleicheCardCta(seite, { css: css(), original: await flaeche(original), vorlage: await flaeche(vorlage), gridTon, karteTon })
  const nahe = (r, grenze = 1) => { for (const k of r.abweichung) expect(k).toBeLessThanOrEqual(grenze) }
  const attr = (ton) => (ton ? ` data-medien-ton="${ton}"` : '')

  // Vollständige Karte wie im Drupal-Template: Medium, Verlauf, Inhalt mit Titel und Knopf
  const karte = ({ gridTon = null, karteTon = null, medium = 'img', theme = null, inhaltBild = false } = {}) => {
    const src = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=='
    const m = medium === 'img' ? `<img class="nc-card-cta__media" src="${src}" alt="">`
      : medium === 'video' ? '<video class="nc-card-cta__media" muted playsinline></video>' : ''
    return `<style>${css()}</style><div class="nc-card-grid-cta"${attr(gridTon)}>
      <div class="nc-card-cta"${attr(karteTon)}${theme ? ` data-theme="${theme}"` : ''} style="width:320px">
        ${m}${m ? '<div class="nc-card-cta__overlay"></div>' : ''}
        <div class="nc-card-cta__content"><h3 class="nc-card-cta__title">Titel</h3>
          ${inhaltBild ? `<img class="logo" src="${src}" alt="">` : ''}
          <div class="nc-card-cta__actions"><a class="nc-button nc-button--primary" href="#">Mehr</a></div></div></div></div>`
  }
  const stile = (sel, props) => seite.evaluate(([s, p]) => {
    const c = getComputedStyle(document.querySelector(s)); return Object.fromEntries(p.map((k) => [k, c.getPropertyValue(k)]))
  }, [sel, props])

  it.each([
    ['gruen', '#99f5c0'],
    ['aqua', '#c0e8e8'],
    ['lime', '#a4ff9f'],
    ['forest', '#aabdbe'],
  ])('Grid „%s“: Weiß wird %s', async (ton, hex) => {
    nahe(await fall(ton, null, '#ffffff', hex))
  }, 30000)

  it('Schwarzpunkt geteilt mit der Card: Grau #424242 wird schwarz', async () => {
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

  it('ohne Attribut bleibt das Bild unverändert', async () => {
    nahe(await fall(null, null, '#3366cc', '#3366cc'), 0)
  }, 30000)

  it('Video im grünen Grid bekommt dieselbe Filterkette und Mischung wie ein Bild', async () => {
    const props = ['filter', 'mix-blend-mode']
    await seite.setContent(karte({ gridTon: 'gruen' })); const bild = await stile('.nc-card-cta__media', props)
    await seite.setContent(karte({ gridTon: 'gruen', medium: 'video' })); const video = await stile('.nc-card-cta__media', props)
    expect(bild.filter).toContain('grayscale(1)')
    expect(bild['mix-blend-mode']).toBe('multiply')
    expect(video).toEqual(bild)
  }, 30000)

  it.each([[null], ['light']])('Karte ohne Medium (Ton %s) behält im grünen Grid ihre Fläche', async (theme) => {
    const props = ['background-color', 'isolation']
    await seite.setContent(karte({ medium: null, theme })); const ohne = await stile('.nc-card-cta', props)
    await seite.setContent(karte({ medium: null, theme, gridTon: 'gruen' })); const mit = await stile('.nc-card-cta', props)
    expect(mit).toEqual(ohne)
  }, 30000)

  it.each([[null], ['light']])('Verlauf, Titel und Knopf (Ton %s) bleiben im grünen Grid unverändert', async (theme) => {
    for (const [sel, props] of [
      ['.nc-card-cta__overlay', ['background-image', 'filter', 'mix-blend-mode', 'opacity']],
      ['.nc-card-cta__title', ['color', 'filter', 'mix-blend-mode']],
      ['.nc-card-cta .nc-button', ['color', 'background-color', 'filter', 'mix-blend-mode']],
    ]) {
      await seite.setContent(karte({ theme })); const ohne = await stile(sel, props)
      await seite.setContent(karte({ theme, gridTon: 'gruen' })); const mit = await stile(sel, props)
      expect(mit, sel).toEqual(ohne)
    }
  }, 30000)

  it('Karte „aus“ im grünen Grid behält ihre Fläche (lädt das Medium noch, sieht man sie)', async () => {
    const props = ['background-color']
    await seite.setContent(karte({ medium: 'video' })); const ohne = await stile('.nc-card-cta', props)
    await seite.setContent(karte({ medium: 'video', gridTon: 'gruen', karteTon: 'aus' }))
    expect(await stile('.nc-card-cta', props)).toEqual(ohne)
    // Bildebene durchsichtig: ohne Medium-Inhalt sieht man genau die Fläche von heute
    const png = await seite.locator('.nc-card-cta').screenshot({ animations: 'disabled', scale: 'css' })
    await seite.setContent(karte({ medium: 'video' }))
    const png0 = await seite.locator('.nc-card-cta').screenshot({ animations: 'disabled', scale: 'css' })
    const abweichung = await seite.evaluate(async ([a, b, rechne]) => {
      const pixel = async (src) => {
        const i = new Image(); i.src = src; await i.decode()
        const c = document.createElement('canvas'); c.width = i.naturalWidth; c.height = i.naturalHeight
        const x = c.getContext('2d'); x.drawImage(i, 0, 0); return x.getImageData(0, 0, c.width, c.height).data
      }
      return (0, eval)(`(${rechne})`)(await pixel(a), await pixel(b))
    }, [`data:image/png;base64,${png.toString('base64')}`, `data:image/png;base64,${png0.toString('base64')}`, mittlereAbweichung.toString()])
    // Rundung an der abgerundeten Kante (gemessen ≈ 0,0002 Stufen im Mittel)
    for (const k of abweichung) expect(k).toBeLessThanOrEqual(0.01)
  }, 30000)

  it('Bild im Inhalt der Karte bleibt ohne Filter', async () => {
    await seite.setContent(karte({ gridTon: 'gruen', inhaltBild: true }))
    expect(await stile('.nc-card-cta__content img', ['filter', 'mix-blend-mode'])).toEqual({ filter: 'none', 'mix-blend-mode': 'normal' })
  }, 30000)

  it('ohne Attribut: Karte und Medium ohne Ton-Regel', async () => {
    await seite.setContent(karte())
    expect(await stile('.nc-card-cta', ['isolation'])).toEqual({ isolation: 'auto' })
    expect(await stile('.nc-card-cta__media', ['filter', 'mix-blend-mode'])).toEqual({ filter: 'none', 'mix-blend-mode': 'normal' })
  }, 30000)

  it('Hover im grünen Grid: Vergrößerung bleibt, Filter bleibt', async () => {
    await seite.setViewportSize({ width: 400, height: 400 })
    await seite.setContent(karte({ gridTon: 'gruen' }))
    await seite.hover('.nc-card-cta')
    const s = await stile('.nc-card-cta__media', ['transform', 'filter'])
    expect(s.transform).not.toBe('none')
    expect(s.filter).toContain('grayscale(1)')
  }, 30000)
})
