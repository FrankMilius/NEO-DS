#!/usr/bin/env node
// ==========================================================================
// pruefen:sg-rand — Spur bis an den Fensterrand, sanfter Rand nur außen
// (I21 Phase 1, 25.11.2026, Empfehlung F Frank)
//
//   npm run pruefen:sg-rand -- [--css <styles.css>] [--js <neo-story-gallery.js>]
//        [--seiten /,/musterseite-bauteile] [--breiten 3000,2560,1920,1280,1100,900,820,700,390]
//
// Je Seite und Breite:
//   1. Die Spur (.nc-story-gallery__scroll) reicht von Fensterrand zu
//      Fensterrand (±0,5 px), die Seite scrollt nicht seitlich
//   2. Die Karte an der Inhaltskante liegt ganz im deckenden Teil der Maske:
//      Maske ab dem Seitenrand voll (keine Transparenz über der ersten Karte).
//   3. Der Verlauf ist höchstens --nc-story-gallery-fade-width und höchstens
//      Seitenrand + Einzug breit — und nie 0, solange links oder rechts neben
//      der Inhaltskante Karten zu sehen sind (I22, 26.11.2026: ab 1920 px ist
//      der Seitenrand 0, der Rand liegt dann im Einzug).
//   4. Kein Titel hält Zeilen frei (min-block-size 0/auto).
//
// --voll stellt den Container der Galerie auf volle Breite (nc-cw-full, wie
// live auf website.piipe.de; lokal steht sie in nc-cw-xwide) — I22.
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
    breiten: { type: 'string', default: '3000,2560,1920,1280,1100,900,820,700,390' },
    voll: { type: 'boolean', default: false },
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
  // Einzug bis zur Inhaltskante: Spur-Einzug ohne den linken Seitenrand
  const einzug = (parseFloat(getComputedStyle(g.querySelector('.nc-story-gallery__track')).paddingInlineStart) || 0) - randL
  // Stopps der Maske in px auflösen (sie enthalten calc() mit %)
  const maske = cs.maskImage || cs.webkitMaskImage || 'none'
  const teile = []; let tiefe = 0, start = 0
  const innen = maske.slice(maske.indexOf('(') + 1, maske.lastIndexOf(')'))
  for (let i = 0; i < innen.length; i++) {
    if (innen[i] === '(') tiefe++; else if (innen[i] === ')') tiefe--
    else if (innen[i] === ',' && tiefe === 0) { teile.push(innen.slice(start, i).trim()); start = i + 1 }
  }
  teile.push(innen.slice(start).trim())
  const stoppe = teile.filter((x) => /^(rgba?\(|transparent|#)/.test(x)).map((x) => x.replace(/^(rgba?\([^)]*\)|transparent|#[0-9a-f]+)\s*/i, ''))
  const pos = sc.style.position; sc.style.position = 'relative'
  const loese = (ausdruck) => { const p = document.createElement('div'); p.style.cssText = `position:absolute;left:0;top:0;height:1px;width:${ausdruck}`; sc.appendChild(p); const w = p.getBoundingClientRect().width; p.remove(); return w }
  const s = stoppe.map(loese); sc.style.position = pos
  const fadeL = s.length === 4 ? s[1] - s[0] : NaN, fadeR = s.length === 4 ? s[3] - s[2] : NaN
  const titel = [...g.querySelectorAll('.nc-story-gallery__title')].map((t) => getComputedStyle(t).minHeight)
  return {
    links: r.left, rechts: breite - r.right, breite, randL, randR, galerieLinks: gr.left, einzug,
    ueberlauf: document.documentElement.scrollWidth - breite,
    maske, stoppe: s, deckendAb: s[1], deckendBis: r.width - s[2], fadeL, fadeR, fadeMax,
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
  if (a.voll) {
    const pfade = a.seiten.split(',').map((x) => x.trim()).filter(Boolean)
    await t.seite.route((u) => pfade.includes(new URL(u).pathname), async (r) => {
      const antwort = await r.fetch()
      const html = (await antwort.text()).replace(/class="nc-cw-[a-z]+/g, 'class="nc-cw-full')
      await r.fulfill({ response: antwort, body: html })
    })
  }
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
      if (m.stoppe.length !== 4) f(`Maske hat ${m.stoppe.length} statt 4 Stopps`)
      const aussenL = m.randL + m.einzug, aussenR = m.randR + m.einzug
      for (const [seite, fade, aussen] of [['links', m.fadeL, aussenL], ['rechts', m.fadeR, aussenR]]) {
        if (fade > Math.min(aussen, m.fadeMax) + 0.5) f(`Verlauf ${seite} ${fade.toFixed(1)} px breiter als Seitenrand + Einzug (${aussen.toFixed(1)}) oder Höchstwert (${m.fadeMax.toFixed(1)})`)
        if (aussen > 0.5 && !(fade > 0.5)) f(`kein Verlauf ${seite}, obwohl ${aussen.toFixed(1)} px Karten neben der Inhaltskante zu sehen sind`)
      }
      if (m.deckendAb > aussenL + 0.5) f(`Maske erst ab ${m.deckendAb.toFixed(1)} px deckend, Inhaltskante bei ${aussenL.toFixed(1)} px`)
      if (m.titelReserve) f(`${m.titelReserve} Titel halten Zeilen frei`)
      console.log(`· ${wo}: Seitenrand ${m.randL}/${m.randR} px · Einzug ${m.einzug.toFixed(1)} px · Verlauf ${m.fadeL.toFixed(1)}/${m.fadeR.toFixed(1)} px · Überlauf ${m.ueberlauf}`)
    } catch (e) { f(e.message.split('\n')[0]) }
  }
  await t.schliesse()
}
await browser.close()
console.log(`\n${geprueft} Seitenläufe · ${fehler.length} Abweichung(en)`)
process.exit(fehler.some((x) => /HTTP|keine Galerie|Timeout/.test(x)) ? 2 : fehler.length ? 1 : 0)
