#!/usr/bin/env node
// ==========================================================================
// pruefen:sg-fluide — passen Bild, Text und Laufleiste ins Fenster?
// (I21 Phase 2, 25.11.2026, Empfehlung F Frank)
//
//   npm run pruefen:sg-fluide -- [--css <styles.css>] [--js <neo-story-gallery.js>]
//        [--seiten /,/musterseite-bauteile] [--fenster 1920x1080,1280x720,…]
//
// Je Seite und Fenster (Vorgabe: die zehn Fenster aus dem Befund I21):
//   ab 769 px  1. Medienhöhe = min(Block, max(-card-height-min,
//                 min(Fensterhöhe − Navigation − -text-reserve, Stufe)))
//                 mit Stufe sm/md/lg/xl nach Breakpoint (±1 px)
//              2. Steht die erste Karte unter der Navigation, reicht der
//                 Platz bis zum Fensterende für Bild, Text und Laufleiste
//              3. Jede Karte mindestens min(-card-min-width, Platz − Vorschau)
//                 breit
//   immer      4. Keine Bildunterschrift schneidet Text ab
//   Handy (≤ 768 px) wird bei 1–3 nur berichtet: dort gilt die eigene Höhe.
//
// Ausgang 0 erfüllt, 1 Abweichung, 2 Seitenfehler.
// ==========================================================================
import { readFileSync } from 'node:fs'
import { parseArgs } from 'node:util'
import { lade } from './lib/einstellungen.mjs'
import { chromium } from './lib/browser.mjs'
import { oeffne } from './lib/aufnahme.mjs'

const FENSTER = '1920x1080,1536x864,1440x900,1366x768,1280x720,1024x768,820x1180,768x1024,390x844,360x740'
const { values: a } = parseArgs({
  options: {
    css: { type: 'string' },
    js: { type: 'string' },
    seiten: { type: 'string', default: '/,/musterseite-bauteile' },
    fenster: { type: 'string', default: FENSTER },
  },
})
const einst = lade()
const css = a.css ? readFileSync(a.css, 'utf8') : null
const js = a.js ? readFileSync(a.js, 'utf8') : null

function messen () {
  const g = document.querySelector('[data-neo-story-gallery]')
  if (!g) return { fehler: 'keine Galerie' }
  const px = (wert) => {
    const p = document.createElement('span')
    p.style.cssText = `position:absolute;width:${wert}`
    g.appendChild(p)
    const w = p.getBoundingClientRect().width
    p.remove()
    return w
  }
  const inline = (g.getAttribute('style') || '').match(/--sg-card-height(?:-block)?:\s*(\d+(?:\.\d+)?)px/)
  const breite = document.documentElement.clientWidth
  const stufe = breite >= 1600 ? 'xl' : breite >= 1200 ? 'lg' : breite >= 960 ? 'md' : 'sm'
  const karten = [...g.querySelectorAll('.nc-story-gallery__card:not(.nc-story-gallery__card--clone)')]
  const erste = karten[0].getBoundingClientRect()
  const fuss = g.querySelector('.nc-story-gallery__footer') || g.nextElementSibling
  const scroll = g.querySelector('.nc-story-gallery__scroll')
  return {
    breite,
    hoehe: window.innerHeight,
    nav: px('var(--nc-nav-height)'),
    block: inline ? Number(inline[1]) : px('var(--nc-story-gallery-card-height)'),
    min: px('var(--nc-story-gallery-card-height-min)'),
    reserve: px('var(--nc-story-gallery-text-reserve)'),
    stufe: px(`var(--nc-story-gallery-card-height-${stufe})`),
    minBreite: px('var(--nc-story-gallery-card-min-width)'),
    vorschau: px('var(--nc-story-gallery-peek-mobile)'),
    randR: parseFloat(getComputedStyle(g).getPropertyValue('--_sg-rand-r')) || 0,
    spur: scroll.clientWidth,
    medien: karten.map((k) => k.querySelector('.nc-story-gallery__media').getBoundingClientRect().height),
    breiten: karten.map((k) => k.getBoundingClientRect().width),
    abgeschnitten: karten.filter((k) => { const c = k.querySelector('.nc-story-gallery__caption'); return c && c.scrollHeight > c.clientHeight + 1 }).length,
    kartenOben: erste.top,
    fussUnten: fuss ? fuss.getBoundingClientRect().bottom : erste.bottom,
  }
}

const browser = await chromium().launch()
const fehler = []
let geprueft = 0
for (const f of a.fenster.split(',').map((x) => x.trim()).filter(Boolean)) {
  const [w, h] = f.split('x').map(Number)
  const t = await oeffne(browser, einst, w)
  await t.seite.setViewportSize({ width: w, height: h })
  if (css !== null) t.setzeCss(css)
  if (js !== null) await t.seite.context().route(/neo_fe\/js\/neo-story-gallery\.js/, (r) => r.fulfill({ body: js, contentType: 'text/javascript' }))
  for (const s of a.seiten.split(',').map((x) => x.trim()).filter(Boolean)) {
    const wo = `${f} ${s}`
    const melde = (x) => { fehler.push(`${wo}: ${x}`); console.log(`✗ ${wo}: ${x}`) }
    try {
      const antwort = await t.seite.goto(s, { waitUntil: 'networkidle', timeout: 90000 })
      if (!antwort || antwort.status() >= 400) throw new Error(`HTTP ${antwort?.status()}`)
      // Erste Karte direkt unter die Navigation holen, wie beim Lesen
      await t.seite.evaluate(() => {
        const g = document.querySelector('[data-neo-story-gallery]')
        if (!g) return
        const nav = parseFloat(getComputedStyle(document.documentElement).fontSize) * 4
        const k = g.querySelector('.nc-story-gallery__card')
        window.scrollTo(0, k.getBoundingClientRect().top + window.scrollY - nav)
      })
      await t.seite.waitForTimeout(700)
      const m = await t.seite.evaluate(messen)
      if (m.fehler) { melde(m.fehler); continue }
      geprueft++
      const handy = m.breite <= 768
      const soll = Math.min(m.block, Math.max(m.min, Math.min(m.hoehe - m.nav - m.reserve, m.stufe)))
      const platz = m.hoehe - m.kartenOben
      const noetig = m.fussUnten - m.kartenOben
      const breiteSoll = Math.min(m.minBreite, m.spur - m.randR - m.vorschau)
      const schmalste = Math.min(...m.breiten)
      const zeile = `Medien ${m.medien[0].toFixed(0)} (soll ${handy ? '–' : soll.toFixed(0)}) · Bild bis Leiste ${noetig.toFixed(0)} von ${platz.toFixed(0)} px · schmalste Karte ${schmalste.toFixed(0)} px`
      if (!handy) {
        m.medien.forEach((x, i) => { if (Math.abs(x - soll) > 1) melde(`Karte ${i + 1}: Medienhöhe ${x.toFixed(1)} statt ${soll.toFixed(1)}`) })
        if (noetig > platz + 1) melde(`Bild, Text und Leiste brauchen ${noetig.toFixed(0)} px, Platz ${platz.toFixed(0)} px`)
        if (schmalste < breiteSoll - 0.5) melde(`Karte ${schmalste.toFixed(1)} px schmaler als ${breiteSoll.toFixed(1)} px`)
      }
      if (m.abgeschnitten) melde(`${m.abgeschnitten} Bildunterschrift(en) abgeschnitten`)
      console.log(`· ${wo}: ${zeile}${handy ? (noetig > platz ? ' · Handy: passt nicht ganz (nur berichtet)' : ' · Handy') : ''}`)
    } catch (e) { melde(e.message.split('\n')[0]) }
  }
  await t.schliesse()
}
await browser.close()
console.log(`\n${geprueft} Seitenläufe · ${fehler.length} Abweichung(en)`)
process.exit(fehler.some((x) => /HTTP|keine Galerie|Timeout/.test(x)) ? 2 : fehler.length ? 1 : 0)
