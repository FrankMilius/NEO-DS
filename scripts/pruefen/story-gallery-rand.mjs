#!/usr/bin/env node
// ==========================================================================
// pruefen:sg-rand — Spur bis an den Fensterrand, sanfter Rand nur außen
// (I21 Phase 1, 25.11.2026, Empfehlung F Frank)
//
//   npm run pruefen:sg-rand -- [--css <styles.css>] [--js <neo-story-gallery.js>]
//        [--seiten /,/musterseite-bauteile] [--breiten 1920,1280,1100,900,820,700,390]
//
// Je Seite und Breite:
//   1. Die Spur (.nc-story-gallery__scroll) reicht von Fensterrand zu
//      Fensterrand (±0,5 px), die Seite scrollt nicht seitlich
//   2. Die Karte an der Inhaltskante liegt ganz im deckenden Teil der Maske:
//      Maske ab dem Seitenrand voll (keine Transparenz über der ersten Karte).
//   3. Der Verlauf ist höchstens --nc-story-gallery-fade-width und höchstens
//      der Seitenrand breit.
//   4. Kein Titel hält Zeilen frei (min-block-size 0/auto).
//
// Ausgang 0 erfüllt, 1 Abweichung, 2 Seitenfehler.
// ==========================================================================
import { readFileSync } from 'node:fs'
import { parseArgs } from 'node:util'
import { lade } from './lib/einstellungen.mjs'
import { chromium } from './lib/browser.mjs'
import { oeffne } from './lib/aufnahme.mjs'

const { values: a } = parseArgs({
  options: {
    css: { type: 'string' },
    js: { type: 'string' },
    seiten: { type: 'string', default: '/,/musterseite-bauteile' },
    breiten: { type: 'string', default: '1920,1280,1100,900,820,700,390' },
  },
})
const einst = lade()
const css = a.css ? readFileSync(a.css, 'utf8') : null
const js = a.js ? readFileSync(a.js, 'utf8') : null

function messen () {
  const g = document.querySelector('[data-neo-story-gallery]')
  if (!g) return { fehler: 'keine Galerie' }
  const sc = g.querySelector('.nc-story-gallery__scroll')
  const r = sc.getBoundingClientRect(), gr = g.getBoundingClientRect()
  const breite = document.documentElement.clientWidth
  const cs = getComputedStyle(sc)
  const px = (n) => parseFloat(getComputedStyle(g).getPropertyValue(n)) || 0
  const probe = document.createElement('span'); probe.style.cssText = 'position:absolute;width:var(--nc-story-gallery-fade-width)'; g.appendChild(probe)
  const fadeMax = probe.getBoundingClientRect().width; probe.remove()
  const randL = px('--_sg-rand-l'), randR = px('--_sg-rand-r')
  const fadeL = Math.min(randL, fadeMax)
  const titel = [...g.querySelectorAll('.nc-story-gallery__title')].map((t) => getComputedStyle(t).minHeight)
  return {
    links: r.left, rechts: breite - r.right, breite, randL, randR, galerieLinks: gr.left,
    ueberlauf: document.documentElement.scrollWidth - breite,
    maske: cs.maskImage || cs.webkitMaskImage || 'none', fadeL, fadeMax,
    titelReserve: titel.filter((m) => m !== '0px' && m !== 'auto').length,
  }
}

const browser = await chromium().launch()
const fehler = []
let geprueft = 0
for (const breite of a.breiten.split(',').map(Number)) {
  const t = await oeffne(browser, einst, breite)
  if (css !== null) t.setzeCss(css)
  if (js !== null) await t.seite.context().route(/neo_fe\/js\/neo-story-gallery\.js/, (r) => r.fulfill({ body: js, contentType: 'text/javascript' }))
  for (const s of a.seiten.split(',').map((x) => x.trim()).filter(Boolean)) {
    const wo = `${breite} ${s}`
    const f = (x) => { fehler.push(`${wo}: ${x}`); console.log(`✗ ${wo}: ${x}`) }
    try {
      const antwort = await t.seite.goto(s, { waitUntil: 'networkidle', timeout: 90000 })
      if (!antwort || antwort.status() >= 400) throw new Error(`HTTP ${antwort?.status()}`)
      await t.seite.waitForTimeout(600)
      const m = await t.seite.evaluate(messen)
      if (m.fehler) { f(m.fehler); continue }
      geprueft++
      if (Math.abs(m.links) > 0.5 || Math.abs(m.rechts) > 0.5) f(`Spur endet ${m.links.toFixed(1)} px links / ${m.rechts.toFixed(1)} px rechts vor dem Fensterrand`)
      if (m.ueberlauf > 0) f(`Seite scrollt seitlich (${m.ueberlauf} px)`)
      if (Math.abs(m.randL - m.galerieLinks) > 1) f(`Seitenrand links ${m.randL} px, Galerie beginnt bei ${m.galerieLinks.toFixed(1)} px`)
      if (!/gradient/.test(m.maske)) f('keine Maske an der Spur')
      if (m.fadeL > m.randL + 0.5 || m.fadeL > m.fadeMax + 0.5) f(`Verlauf ${m.fadeL} px breiter als Seitenrand oder Höchstwert`)
      if (m.titelReserve) f(`${m.titelReserve} Titel halten Zeilen frei`)
      console.log(`· ${wo}: Seitenrand ${m.randL}/${m.randR} px · Verlauf ${m.fadeL.toFixed(1)} px · Überlauf ${m.ueberlauf}`)
    } catch (e) { f(e.message.split('\n')[0]) }
  }
  await t.schliesse()
}
await browser.close()
console.log(`\n${geprueft} Seitenläufe · ${fehler.length} Abweichung(en)`)
process.exit(fehler.some((x) => /HTTP|keine Galerie|Timeout/.test(x)) ? 2 : fehler.length ? 1 : 0)
