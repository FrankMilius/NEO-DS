// ==========================================================================
// Teaser-Flächen g50 und g200 der Hauptnavigation (I10 Phase 1, 07.11.2026)
// ==========================================================================
// Die beiden hellen Graphit-Stufen sind feste Grundfarben und bleiben auch im
// Dunkelmodus hell (Entscheidung Frank 07.11.2026: helle Insel mit fester
// dunkler Schrift). Bis I10 kamen Schrift, Knopf und Fokus aber aus dem
// Thema und wurden im Dunkelmodus hell — rechnerisch etwa 1,04:1.
//
// Geprüft wird die gebaute styles.css auf den Referenz-Fassungen aus
// data/markup (Mega-Panel offen, beide Varianten), in allen vier Themen:
//   Text, Nebentext, Knopfschrift   4,5:1   (WCAG 1.4.3)
//   Knopf gegen Fläche, Fokusring   3:1     (WCAG 1.4.11)
// Dazu axe color-contrast. Der Prüfort ist bewusst nicht
// data/kontrast-paare.json: Die Liste prüft einstellbare Theme-Farben der
// Kunden-Themes, die Teaser-Flächen nutzen feste Grundfarben
// (Entscheidung Frank 07.11.2026).
// ==========================================================================
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import AxeBuilder from '@axe-core/playwright'
import { test, expect } from './hilfen.js'

const datei = (pfad) => readFileSync(fileURLToPath(new URL(pfad, import.meta.url)), 'utf8')
const CSS = datei('../../../styles.css')
const FASSUNGEN = datei('../../../data/markup/navigation-tab-mega.html').split(/<!--\s*@fassung:[^>]*-->/)

const THEMEN = ['neo-light-theme', 'neo-dark-theme', 'customer-light-theme', 'customer-dark-theme']
const FLAECHEN = ['g50', 'g200']
// Fassung je Variante: Mega-Panel offen (Teaser-Karte sichtbar)
const VARIANTEN = { standard: 2, zentriert: 7 }

async function buehne (page, thema, fassung, klassen) {
  await page.setContent(`<!doctype html><html lang="de" data-theme="${thema.includes('dark') ? 'dark' : 'light'}"><head><title>Teaser-Flächen</title><style>${CSS}</style></head><body><div class="${thema}">${FASSUNGEN[fassung]}</div></body></html>`)
  const teaser = page.locator('.panel.is-open .teaser').first()
  await teaser.evaluate((el, k) => el.classList.add(...k), klassen)
  // Die Klassen kommen hier erst nach dem Laden dazu; der Knopf blendet seine
  // Farben über (transition-quick) und würde sonst mitten im Übergang
  // gemessen. Auf der Website steht die Klasse schon im HTML.
  await teaser.evaluate((el) => Promise.all(el.getAnimations({ subtree: true }).map((a) => a.finished)))
  return teaser
}

// Misst im Browser: Farben der Karte, aufgelöst gegen ihren Grund
async function messe (teaser) {
  const cta = teaser.locator('.teaser__cta')
  await cta.focus()
  return teaser.evaluate((el) => {
    const leinwand = document.createElement('canvas').getContext('2d', { willReadFrequently: true })
    // Jede berechnete Farbe (rgb, color(srgb …), mit Alpha) über ihrem Grund
    // auf eine deckende sRGB-Farbe bringen
    const deckend = (farbe, grund = '#ffffff') => {
      leinwand.clearRect(0, 0, 1, 1)
      leinwand.fillStyle = grund
      leinwand.fillRect(0, 0, 1, 1)
      leinwand.fillStyle = farbe
      leinwand.fillRect(0, 0, 1, 1)
      return Array.from(leinwand.getImageData(0, 0, 1, 1).data.slice(0, 3))
    }
    const lum = (rgb) => {
      const [r, g, b] = rgb.map((v) => v / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
      return 0.2126 * r + 0.7152 * g + 0.0722 * b
    }
    const kontrast = (a, b) => {
      const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p)
      return Math.round(((x + 0.05) / (y + 0.05)) * 100) / 100
    }
    const s = (q) => getComputedStyle(el.querySelector(q))
    const grundFarbe = getComputedStyle(el).backgroundColor
    const grund = deckend(grundFarbe)
    const knopf = el.querySelector('.teaser__cta')
    const knopfGrund = deckend(getComputedStyle(knopf).backgroundColor, grundFarbe)
    const ring = getComputedStyle(knopf)
    return {
      fokussiert: knopf.matches(':focus-visible'),
      ringStil: ring.outlineStyle,
      titel: kontrast(deckend(s('.teaser__title').color, grundFarbe), grund),
      text: kontrast(deckend(s('.teaser__text').color, grundFarbe), grund),
      knopfSchrift: kontrast(deckend(getComputedStyle(knopf).color, `rgb(${knopfGrund})`), knopfGrund),
      knopfFlaeche: kontrast(knopfGrund, grund),
      fokus: kontrast(deckend(ring.outlineColor, grundFarbe), grund)
    }
  })
}

for (const flaeche of FLAECHEN) {
  for (const thema of THEMEN) {
    for (const [variante, fassung] of Object.entries(VARIANTEN)) {
      test(`Teaser-Fläche ${flaeche}, ${thema}, ${variante}: Text 4,5:1, Knopf und Fokus 3:1`, async ({ page }) => {
        const teaser = await buehne(page, thema, fassung, ['teaser--cta-dark', `teaser--bg-${flaeche}`])
        const m = await messe(teaser)
        expect(m.fokussiert, 'Knopf hat :focus-visible').toBe(true)
        expect(m.ringStil, 'Fokusring sichtbar').not.toBe('none')
        expect.soft(m.titel, 'Titel').toBeGreaterThanOrEqual(4.5)
        expect.soft(m.text, 'Nebentext').toBeGreaterThanOrEqual(4.5)
        expect.soft(m.knopfSchrift, 'Knopfschrift').toBeGreaterThanOrEqual(4.5)
        expect.soft(m.knopfFlaeche, 'Knopf gegen Fläche').toBeGreaterThanOrEqual(3)
        expect.soft(m.fokus, 'Fokusring gegen Fläche').toBeGreaterThanOrEqual(3)
        const { violations } = await new AxeBuilder({ page })
          .withRules(['color-contrast'])
          .include('.panel.is-open .teaser')
          .analyze()
        expect(violations.flatMap((v) => v.nodes.map((n) => `${n.target}: ${n.any[0]?.message}`))).toEqual([])
      })
    }
  }
}

// Ein Hintergrundbild gewinnt weiter über die Fläche: weiße Schrift auf dem
// dunklen Träger, auch wenn eine helle Stufe gewählt ist.
for (const thema of THEMEN) {
  test(`Teaser-Fläche g50 mit Bild, ${thema}: Bildregel gewinnt, Schrift bleibt weiß`, async ({ page }) => {
    const teaser = await buehne(page, thema, VARIANTEN.standard, ['teaser--cta-light', 'teaser--bg-g50', 'teaser--has-image'])
    const farbe = await teaser.locator('.teaser__title').evaluate((el) => getComputedStyle(el).color)
    expect(farbe).toBe('rgb(255, 255, 255)')
  })
}
