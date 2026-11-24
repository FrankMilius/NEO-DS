#!/usr/bin/env node
// ==========================================================================
// pruefen:sg-handy — passen die Karten der Story Gallery auf jede Breite?
// (I18 Phase 8, 24.11.2026, Vorschlag 9; Entscheidung E2 Frank)
//
//   npm run pruefen:sg-handy -- [--css <styles.css>] [--vorlage-nachbauen]
//        [--seiten /,/musterseite-bauteile] [--breiten 390,768,1280]
//
// Je Seite und Breite, für jede Originalkarte (ohne Endlos-Kopien):
//   bis 768 px  Medienhöhe = --nc-story-gallery-card-height-mobile und
//               Kartenbreite ≤ Breite des Scrollers − --nc-story-gallery-peek-mobile
//               (die nächste Karte bleibt sichtbar) und ≥ Höhe ×
//               --nc-story-gallery-ratio-min-mobile (kein Hochkant-Streifen,
//               der den Text in viele Zeilen bricht) — soweit der Platz
//               reicht: unter etwa 328 px Fensterbreite hat die Obergrenze
//               Vorrang, die Karte wird dann schmaler als quadratisch
//               (Widersacher I18 Phase 8, gewollt: nie breiter als der Platz)
//   Gemessen wird die Medienfläche (__media), nicht die ganze Karte mit Text.
//   ab 769 px   Medienhöhe = Wert aus dem Block (Inline-Stil der Galerie)
//
// --vorlage-nachbauen: DDEV rendert Twig aus dem Haupt-Checkout von neo_fe.
// Das HTML der Seite wird deshalb so umgeschrieben, wie die Vorlage es ab
// I18 Phase 8 ausgibt: --sg-card-height-block statt --sg-card-height im
// Inline-Stil der Galerie.
//
// Ausgang 0 alles passt, 1 mindestens eine Abweichung, 2 Seitenfehler.
// ==========================================================================
import { readFileSync } from 'node:fs'
import { parseArgs } from 'node:util'
import { lade } from './lib/einstellungen.mjs'
import { chromium } from './lib/browser.mjs'
import { oeffne } from './lib/aufnahme.mjs'

const { values: a } = parseArgs({
  options: {
    css: { type: 'string' },
    'vorlage-nachbauen': { type: 'boolean', default: false },
    seiten: { type: 'string', default: '/,/musterseite-bauteile' },
    breiten: { type: 'string', default: '390,768,1280' },
  },
})

const einst = lade()
const seiten = a.seiten.split(',').map((s) => s.trim()).filter(Boolean)
const breiten = a.breiten.split(',').map(Number).filter(Boolean)
const css = a.css ? readFileSync(a.css, 'utf8') : null

function messen () {
  const g = document.querySelector('[data-neo-story-gallery]')
  if (!g) return { fehler: 'keine Galerie' }
  const px = (name) => {
    const p = document.createElement('span')
    p.style.width = `var(${name})`
    p.style.position = 'absolute'
    g.appendChild(p)
    const w = p.getBoundingClientRect().width
    p.remove()
    return w
  }
  const inline = (g.getAttribute('style') || '').match(/--sg-card-height(?:-block)?:\s*(\d+(?:\.\d+)?)px/)
  const scroll = g.querySelector('.nc-story-gallery__scroll')
  return {
    blockHoehe: inline ? Number(inline[1]) : null,
    sollHandy: px('--nc-story-gallery-card-height-mobile'),
    vorschau: px('--nc-story-gallery-peek-mobile'),
    ratioMinHandy: parseFloat(getComputedStyle(g).getPropertyValue('--nc-story-gallery-ratio-min-mobile')),
    scrollBreite: scroll.clientWidth,
    karten: [...g.querySelectorAll('.nc-story-gallery__card:not(.nc-story-gallery__card--clone)')].map((k) => {
      const r = k.getBoundingClientRect()
      const m = k.querySelector('.nc-story-gallery__media').getBoundingClientRect()
      return { breite: r.width, hoehe: m.height }
    }),
  }
}

const browser = await chromium().launch()
const fehler = []
let geprueft = 0
for (const breite of breiten) {
  const t = await oeffne(browser, einst, breite)
  if (css !== null) t.setzeCss(css)
  if (a['vorlage-nachbauen']) {
    await t.seite.route((u) => seiten.includes(new URL(u).pathname), async (r) => {
      const antwort = await r.fetch()
      const html = (await antwort.text()).replace(/style="--sg-card-height:/g, 'style="--sg-card-height-block:')
      await r.fulfill({ response: antwort, body: html })
    })
  }
  for (const s of seiten) {
    const f = (text) => { fehler.push(`${breite} ${s}: ${text}`); console.log(`✗ ${breite} ${s}: ${text}`) }
    try {
      const antwort = await t.seite.goto(s, { waitUntil: 'networkidle', timeout: 90000 })
      if (!antwort || antwort.status() >= 400) throw new Error(`HTTP ${antwort?.status() ?? 'ohne Antwort'}`)
      await t.seite.locator('[data-neo-story-gallery]').first().scrollIntoViewIfNeeded()
      await t.seite.waitForTimeout(600)
      const m = await t.seite.evaluate(messen)
      if (m.fehler) { f(m.fehler); continue }
      const handy = breite <= 768
      if (handy && !(m.sollHandy > 0 && m.vorschau > 0 && m.ratioMinHandy > 0)) f('Token -card-height-mobile, -peek-mobile oder -ratio-min-mobile fehlt')
      if (!handy && !m.blockHoehe) f('kein Höhenwert im Inline-Stil der Galerie')
      const sollHoehe = handy ? m.sollHandy : m.blockHoehe
      const maxBreite = m.scrollBreite - m.vorschau
      let breiteste = 0, schmalste = Infinity
      m.karten.forEach((k, i) => {
        geprueft++
        breiteste = Math.max(breiteste, k.breite)
        schmalste = Math.min(schmalste, k.breite)
        if (sollHoehe && Math.abs(k.hoehe - sollHoehe) > 0.5) f(`Karte ${i + 1}: Höhe ${k.hoehe.toFixed(1)} statt ${sollHoehe}`)
        if (handy && k.breite > maxBreite + 0.5) f(`Karte ${i + 1}: ${k.breite.toFixed(1)} px breit, Platz ${maxBreite.toFixed(1)} px`)
        const minBreite = Math.min(sollHoehe * m.ratioMinHandy, maxBreite)
        if (handy && k.breite < minBreite - 0.5) f(`Karte ${i + 1}: ${k.breite.toFixed(1)} px schmaler als ${minBreite.toFixed(1)} px`)
      })
      console.log(`· ${breite} ${s}: ${m.karten.length} Karten · Höhe soll ${sollHoehe} · schmalste ${schmalste.toFixed(1)} · breiteste ${breiteste.toFixed(1)} px · Scroller ${m.scrollBreite} px · Vorschau ${m.vorschau} px`)
    } catch (e) {
      f(e.message.split('\n')[0])
    }
  }
  await t.schliesse()
}
await browser.close()
console.log(`\n${geprueft} Karten geprüft · ${fehler.length} Abweichung(en)`)
process.exit(fehler.some((x) => /HTTP|keine Galerie|Timeout/.test(x)) ? 2 : fehler.length ? 1 : 0)
