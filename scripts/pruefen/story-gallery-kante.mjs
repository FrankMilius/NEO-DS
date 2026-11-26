#!/usr/bin/env node
// ==========================================================================
// pruefen:sg-kante — stehen Kopf und Karten der Story Gallery auf einer Kante?
// (I16 Phase 4, 23.11.2026, Vorschläge 8 und 9)
//
//   npm run pruefen:sg-kante -- [--css <styles.css>] [--js <neo-story-gallery.js>]
//        [--seiten /,/musterseite-bauteile] [--breiten 1280,1440,1920,2560,3000,390]
//        [--ohne-endlos]
//
// --ohne-endlos schreibt das HTML der Seite so um, dass die Galerie ohne
// Endlos-Modus läuft (Klasse und data-loop) — lokal gibt es sonst keine
// solche Galerie.
//
// Je Seite und Breite: linke Kante der ersten Schrift im Kopftitel gegen die
// linke Kante der Karte, die am Inhaltsrand steht — nach dem Laden, nach
// einmal „weiter“ und nach einmal „zurück“ (Pfeiltasten im Scroller, wie die
// Galerie sie anbietet). Toleranz 1 px. Dazu: Titelgröße des Kopfs gleich
// --nc-story-gallery-head-title-size, und der Kopf hält mindestens 15 px
// Abstand zum Fensterrand. Dazu (I22, 26.11.2026): Der Kopf behält seine
// volle Breite — Inhaltsbreite = min(max-width, Platz rechts der Kante);
// ein Einzug darf sie nicht schmälern (vorher 191 statt 703 px bei 2560).
//
// Ohne --css/--js gilt, was DDEV ausliefert. Ausgang 0 alles auf einer Kante,
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
    breiten: { type: 'string', default: '1280,1440,1920,2560,3000,390' },
    voll: { type: 'boolean', default: false },
    'ohne-endlos': { type: 'boolean', default: false },
  },
})

const einst = lade()
const seiten = a.seiten.split(',').map((s) => s.trim()).filter(Boolean)
const breiten = a.breiten.split(',').map(Number).filter(Boolean)
const css = a.css ? readFileSync(a.css, 'utf8') : null
const js = a.js ? readFileSync(a.js, 'utf8') : null

// Im Browser: Kanten messen. Kopftitel über die Schrift (Range), nicht über
// die Box — bei zentriertem Text wäre die Box trotzdem links.
function messen () {
  const g = document.querySelector('[data-neo-story-gallery]')
  if (!g) return { fehler: 'keine Galerie' }
  const kopf = g.previousElementSibling?.matches?.('.nc-section-header') ? g.previousElementSibling : null
  const titel = kopf?.querySelector('.nc-section-header__title')
  if (!titel || !titel.firstChild) return { fehler: 'kein Kopftitel direkt vor der Galerie' }
  const r = document.createRange()
  r.setStart(titel.firstChild, 0); r.setEnd(titel.firstChild, 1)
  const kopfLinks = r.getBoundingClientRect().left
  const scroll = g.querySelector('.nc-story-gallery__scroll')
  const track = g.querySelector('.nc-story-gallery__track')
  const einzug = parseFloat(getComputedStyle(track).paddingInlineStart) || 0
  const rand = scroll.getBoundingClientRect().left + einzug
  // Karte am Inhaltsrand: die mit der kleinsten Abweichung zum Rand
  const karten = [...g.querySelectorAll('.nc-story-gallery__card')].map((k) => k.getBoundingClientRect().left)
  const karteLinks = karten.reduce((b, x) => (Math.abs(x - rand) < Math.abs(b - rand) ? x : b), Infinity)
  const probe = document.createElement('span')
  probe.style.fontSize = 'var(--nc-story-gallery-head-title-size)'
  kopf.appendChild(probe)
  const soll = getComputedStyle(probe).fontSize
  probe.remove()
  const ks = getComputedStyle(kopf), eltern = kopf.parentElement.getBoundingClientRect()
  const kopfInhalt = kopf.clientWidth - parseFloat(ks.paddingLeft) - parseFloat(ks.paddingRight)
  const kopfSoll = Math.min(parseFloat(ks.maxWidth) || Infinity, eltern.right - parseFloat(getComputedStyle(kopf.parentElement).paddingRight) - kopfLinks)
  return { kopfInhalt, kopfSoll, kopfLinks, karteLinks, titelGroesse: getComputedStyle(titel).fontSize, sollGroesse: soll }
}

const browser = await chromium().launch()
const fehler = []
let geprueft = 0
for (const breite of breiten) {
  const t = await oeffne(browser, einst, breite)
  if (css !== null) t.setzeCss(css)
  if (js !== null) await t.seite.context().route(/neo_fe\/js\/neo-story-gallery\.js/, (r) => r.fulfill({ body: js, contentType: 'text/javascript' }))
  if (a.voll) {
    const pfade = seiten
    await t.seite.route((u) => pfade.includes(new URL(u).pathname), async (r) => {
      const antwort = await r.fetch()
      const html = (await antwort.text()).replace(/class="nc-cw-[a-z]+/g, 'class="nc-cw-full')
      await r.fulfill({ response: antwort, body: html })
    })
  }
  if (a['ohne-endlos']) {
    await t.seite.route((u) => seiten.includes(new URL(u).pathname), async (r) => {
      const antwort = await r.fetch()
      const html = (await antwort.text()).replace(/ nc-story-gallery--loop/g, '').replace(/data-loop="on"/g, 'data-loop="off"')
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
      const schritte = [['geladen', null], ['weiter', 'ArrowRight'], ['zurück', 'ArrowLeft']]
      for (const [name, taste] of schritte) {
        const vorher = await scroll.evaluate((e) => e.scrollLeft)
        if (taste) { await scroll.focus(); await t.seite.keyboard.press(taste); await t.seite.waitForTimeout(1200) }
        const nachher = await scroll.evaluate((e) => e.scrollLeft)
        if (taste && Math.abs(nachher - vorher) < 10) fehler.push(`${breite} ${s} ${name}: Taste ${taste} hat nicht geblättert (scrollLeft ${vorher} → ${nachher})`)
        const m = await t.seite.evaluate(messen)
        geprueft++
        if (m.fehler) { fehler.push(`${breite} ${s} ${name}: ${m.fehler}`); continue }
        const d = Math.round((m.karteLinks - m.kopfLinks) * 10) / 10
        const ok = Math.abs(d) <= 1
        const groesseOk = m.titelGroesse === m.sollGroesse
        console.log(`${ok && groesseOk ? '✓' : '✗'} ${breite} ${s} ${name}: Kopf ${m.kopfLinks.toFixed(1)} · Karte ${m.karteLinks.toFixed(1)} · Abstand ${d} px · Titel ${m.titelGroesse} (soll ${m.sollGroesse}) · scrollLeft ${Math.round(nachher)}`)
        if (!ok) fehler.push(`${breite} ${s} ${name}: Karte ${d} px neben dem Kopf`)
        // Nicht am Fensterrand (Widersacher Phase 4: voller Container ab 1920 px)
        if (m.kopfLinks < 15) fehler.push(`${breite} ${s} ${name}: Kopf ${m.kopfLinks.toFixed(1)} px vom Fensterrand`)
        if (name === 'geladen' && m.kopfInhalt < m.kopfSoll - 1) fehler.push(`${breite} ${s}: Kopf hat ${m.kopfInhalt.toFixed(0)} statt ${m.kopfSoll.toFixed(0)} px Platz`)
        if (!groesseOk) fehler.push(`${breite} ${s} ${name}: Kopftitel ${m.titelGroesse} statt ${m.sollGroesse}`)
      }
    } catch (e) {
      fehler.push(`${breite} ${s}: ${e.message}`)
      console.log(`✗ ${breite} ${s}: ${e.message}`)
    }
  }
  await t.schliesse()
}
await browser.close()
console.log(`\n${geprueft} Messungen · ${fehler.length} Abweichung(en)`)
for (const f of fehler) console.log('  - ' + f)
process.exit(fehler.some((f) => /HTTP|keine Galerie|Kopftitel direkt/.test(f)) ? 2 : fehler.length ? 1 : 0)
