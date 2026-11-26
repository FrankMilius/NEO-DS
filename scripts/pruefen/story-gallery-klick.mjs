#!/usr/bin/env node
// ==========================================================================
// pruefen:sg-klick — blättert ein Mausklick auf die Karten jedes Mal genau
// eine Karte weiter bzw. zurück? (I23, 26.11.2026)
//
//   npm run pruefen:sg-klick -- [--js <neo-story-gallery.js>] [--css <styles.css>]
//        [--seiten /,/musterseite-bauteile] [--breiten 1280,1440,1920,2560]
//        [--voll] [--klicks 4]
//
// --voll schreibt den Container der Seite auf nc-cw-full um (wie live): ab
// 1920 px rückt die Spur dann um bis zu (100 % − Inhaltsbreite) / 2 ein.
//
// Je Seite und Breite: nach dem Laden --klicks Mal in die rechte Hälfte der
// Galerie klicken, dann zweimal in die linke. Gemessen wird die Karte an der
// Inhaltskante (wie pruefen:sg-kante); jeder Klick rechts muss sie um genau
// eins erhöhen, jeder Klick links um genau eins senken. Vorher blätterte ab
// 1920 px im vollen Container nur der erste Klick (live 717 / 717 / 717 px),
// weil der Klick die aktuelle Karte ohne den Einzug suchte.
//
// Geklickt wird auf einen Punkt der Galerie (erst Medienfläche, dann Text), der kein bedienbares
// Element trifft (Hotspot, Regler, Video) — dort blättert die Galerie
// absichtlich nicht.
//
// Ohne --css/--js gilt, was DDEV ausliefert. Ausgang 0 jeder Klick trifft,
// 1 mindestens eine Abweichung, 2 Aufruf- oder Seitenfehler.
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
    breiten: { type: 'string', default: '1280,1440,1920,2560' },
    voll: { type: 'boolean', default: false },
    klicks: { type: 'string', default: '4' },
  },
})

const einst = lade()
const seiten = a.seiten.split(',').map((s) => s.trim()).filter(Boolean)
const breiten = a.breiten.split(',').map(Number).filter(Boolean)
const klicks = Number(a.klicks) || 4
const css = a.css ? readFileSync(a.css, 'utf8') : null
const js = a.js ? readFileSync(a.js, 'utf8') : null

// Im Browser: Index der Karte an der Inhaltskante (wie sg-kante).
function karteAnDerKante () {
  const g = document.querySelector('[data-neo-story-gallery]')
  if (!g) return { fehler: 'keine Galerie' }
  const scroll = g.querySelector('.nc-story-gallery__scroll')
  const track = g.querySelector('.nc-story-gallery__track')
  const kante = scroll.getBoundingClientRect().left + (parseFloat(getComputedStyle(track).paddingInlineStart) || 0)
  const karten = [...g.querySelectorAll('.nc-story-gallery__card')]
  let idx = 0, best = Infinity
  karten.forEach((k, i) => { const d = Math.abs(k.getBoundingClientRect().left - kante); if (d < best) { best = d; idx = i } })
  return { idx, abstand: best, scrollLeft: Math.round(scroll.scrollLeft), paddel: !!g.querySelector('.nc-story-gallery__cursor, [data-cursor-dir]') }
}

// Im Browser: Punkt in der gewünschten Fensterhälfte, der auf der Medienfläche
// liegt und kein bedienbares Element trifft.
function klickPunkt (seite) {
  const BEDIENBAR = 'a, button, input, select, textarea, label, video, [tabindex]:not(.nc-story-gallery__scroll), .nc-video-pause'
  const g = document.querySelector('[data-neo-story-gallery]')
  const s = g.querySelector('.nc-story-gallery__scroll').getBoundingClientRect()
  const w = window.innerWidth
  const xs = seite === 'rechts' ? [0.75, 0.7, 0.8, 0.65, 0.85, 0.6, 0.9, 0.55] : [0.25, 0.3, 0.2, 0.35, 0.15, 0.4, 0.1, 0.45]
  const ys = [0.3, 0.2, 0.4, 0.15, 0.5, 0.6, 0.7, 0.8, 0.9, 0.95]
  for (const fy of ys) {
    for (const fx of xs) {
      const x = w * fx, y = s.top + s.height * fy
      const el = document.elementFromPoint(x, y)
      if (el && g.contains(el) && !el.closest(BEDIENBAR)) return { x, y }
    }
  }
  return null
}

const browser = await chromium().launch()
const fehler = []
let geprueft = 0
for (const breite of breiten) {
  const t = await oeffne(browser, einst, breite)
  if (css !== null) t.setzeCss(css)
  if (js !== null) await t.seite.context().route(/neo_fe\/js\/neo-story-gallery\.js/, (r) => r.fulfill({ body: js, contentType: 'text/javascript' }))
  if (a.voll) {
    await t.seite.route((u) => seiten.includes(new URL(u).pathname), async (r) => {
      const antwort = await r.fetch()
      const html = (await antwort.text()).replace(/class="nc-cw-[a-z]+/g, 'class="nc-cw-full')
      await r.fulfill({ response: antwort, body: html })
    })
  }
  for (const s of seiten) {
    try {
      const antwort = await t.seite.goto(s, { waitUntil: 'networkidle', timeout: 45000 })
      if (!antwort || antwort.status() >= 400) throw new Error(`HTTP ${antwort?.status() ?? 'ohne Antwort'}`)
      const scroll = t.seite.locator('[data-neo-story-gallery] .nc-story-gallery__scroll').first()
      await scroll.scrollIntoViewIfNeeded()
      await t.seite.waitForTimeout(600)
      let vorher = await t.seite.evaluate(karteAnDerKante)
      if (vorher.fehler) throw new Error(vorher.fehler)
      const folge = [...Array(klicks).fill('rechts'), 'links', 'links']
      const spur = [vorher.idx]
      for (const [n, seite] of folge.entries()) {
        const p = await t.seite.evaluate(klickPunkt, seite)
        if (!p) { fehler.push(`${breite} ${s} Klick ${n + 1} ${seite}: kein freier Punkt auf der Galerie`); break }
        await t.seite.mouse.move(p.x, p.y)
        await t.seite.mouse.move(p.x + 2, p.y)
        await t.seite.mouse.down(); await t.seite.mouse.up()
        await t.seite.waitForTimeout(1200)
        const nachher = await t.seite.evaluate(karteAnDerKante)
        geprueft++
        const soll = Math.max(0, vorher.idx + (seite === 'rechts' ? 1 : -1))
        spur.push(nachher.idx)
        if (nachher.idx !== soll) fehler.push(`${breite} ${s} Klick ${n + 1} ${seite}: Karte ${nachher.idx} statt ${soll} an der Kante (scrollLeft ${vorher.scrollLeft} → ${nachher.scrollLeft})`)
        if (nachher.abstand > 1) fehler.push(`${breite} ${s} Klick ${n + 1} ${seite}: Karte ${nachher.abstand.toFixed(1)} px neben der Kante`)
        vorher = nachher
      }
      const ok = !fehler.some((f) => f.startsWith(`${breite} ${s} `))
      console.log(`${ok ? '✓' : '✗'} ${breite} ${s}: Karte an der Kante ${spur.join(' → ')} (${folge.map((x) => (x === 'rechts' ? 'R' : 'L')).join('')})`)
    } catch (e) {
      fehler.push(`${breite} ${s}: ${e.message}`)
      console.log(`✗ ${breite} ${s}: ${e.message}`)
    }
  }
  await t.schliesse()
}
await browser.close()
console.log(`\n${geprueft} Klicks · ${fehler.length} Abweichung(en)`)
for (const f of fehler) console.log('  - ' + f)
process.exit(fehler.some((f) => /HTTP|keine Galerie/.test(f)) ? 2 : fehler.length ? 1 : 0)
