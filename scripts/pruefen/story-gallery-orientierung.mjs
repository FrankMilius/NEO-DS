#!/usr/bin/env node
// ==========================================================================
// pruefen:sg-orientierung — zeigt die Story Gallery Pfeile und Fortschritt?
// (I16 Phase 5, 23.11.2026, Vorschlag 11)
//
//   npm run pruefen:sg-orientierung -- [--css <styles.css>] [--js <neo-story-gallery.js>]
//        [--vorlage-nachbauen] [--seiten /,/musterseite-bauteile] [--breiten 1280,390]
//
// Je Seite und Breite, für Galerien mit „Pfeile: unten“ oder Endlos-Modus:
//   1. Pfeile unten sichtbar, beide per Tastatur erreichbar (tabIndex ≥ 0)
//   2. Fortschrittsbalken sichtbar, aria-hidden
//   3. „Weiter“ blättert (scrollLeft steigt) und der Balken wandert mit
//   4. Endlos-Modus: jeder Klick der Runde rückt den Balken vor; nach einer vollen Runde (Anzahl Originalkarten × „Weiter“)
//      steht der Balken wieder am Anfang (±5 % der Spur)
//
// --vorlage-nachbauen: DDEV rendert Twig aus dem Haupt-Checkout von neo_fe.
// Das Init-Skript baut deshalb vor den Drupal-Behaviors die Fußleiste so in
// die Seite, wie block--block-content--neo-story-gallery.html.twig sie ab
// I16 Phase 5 ausgibt (FUSS unten muss mit der Vorlage übereinstimmen).
//
// Ausgang 0 alles erfüllt, 1 mindestens eine Abweichung, 2 Seitenfehler.
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
    'vorlage-nachbauen': { type: 'boolean', default: false },
    seiten: { type: 'string', default: '/,/musterseite-bauteile' },
    breiten: { type: 'string', default: '1280,390' },
  },
})

const einst = lade()
const seiten = a.seiten.split(',').map((s) => s.trim()).filter(Boolean)
const breiten = a.breiten.split(',').map(Number).filter(Boolean)
const css = a.css ? readFileSync(a.css, 'utf8') : null
const js = a.js ? readFileSync(a.js, 'utf8') : null

// Wie die Twig-Vorlage ab I16 Phase 5 (Pfeile ohne SVG-Inhalt genügen hier)
const FORTSCHRITT = '<div class="nc-story-gallery__progress" aria-hidden="true"><span class="nc-story-gallery__progress-bar"></span></div>'
const PADDLES = '<div class="nc-story-gallery__paddles nc-story-gallery__paddles--below">' +
  '<button class="nc-story-gallery__paddle nc-story-gallery__paddle--prev" aria-label="Zurueck" data-sg-prev disabled>‹</button>' +
  '<button class="nc-story-gallery__paddle nc-story-gallery__paddle--next" aria-label="Weiter" data-sg-next>›</button></div>'
const FUSS = `<div class="nc-story-gallery__footer">${FORTSCHRITT}${PADDLES}</div>`

function nachbauen (fuss, fortschritt) {
  document.addEventListener('DOMContentLoaded', () => {
    for (const g of document.querySelectorAll('[data-neo-story-gallery]')) {
      const unten = g.nextElementSibling?.classList.contains('nc-story-gallery__footer') ? g.nextElementSibling : null
      if (!unten && g.dataset.loop === 'on') g.insertAdjacentHTML('afterend', fuss)
      else if (unten && !unten.querySelector('.nc-story-gallery__progress')) unten.insertAdjacentHTML('afterbegin', fortschritt)
    }
  }, { capture: true })
}

function zustand () {
  const g = document.querySelector('[data-neo-story-gallery]')
  if (!g) return { fehler: 'keine Galerie' }
  const fuss = g.nextElementSibling?.classList.contains('nc-story-gallery__footer') ? g.nextElementSibling : null
  const sichtbar = (e) => { if (!e) return false; const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' }
  const knoepfe = fuss ? [...fuss.querySelectorAll('.nc-story-gallery__paddle')] : []
  const balken = fuss?.querySelector('.nc-story-gallery__progress-bar')
  const spur = fuss?.querySelector('.nc-story-gallery__progress')
  const sb = balken?.getBoundingClientRect(), ss = spur?.getBoundingClientRect()
  return {
    endlos: g.dataset.loop === 'on',
    karten: g.querySelectorAll('.nc-story-gallery__card:not(.nc-story-gallery__card--clone)').length,
    fuss: sichtbar(fuss),
    knoepfe: knoepfe.length === 2 && knoepfe.every(sichtbar),
    tab: knoepfe.length === 2 && knoepfe.every((k) => k.tabIndex >= 0),
    balken: sichtbar(balken) && sichtbar(spur),
    ariaHidden: spur?.getAttribute('aria-hidden') === 'true',
    balkenLinks: sb && ss ? (sb.left - ss.left) / ss.width : null,
    scrollLeft: g.querySelector('.nc-story-gallery__scroll').scrollLeft,
  }
}

const browser = await chromium().launch()
const fehler = []
for (const breite of breiten) {
  const t = await oeffne(browser, einst, breite)
  if (css !== null) t.setzeCss(css)
  if (js !== null) await t.seite.context().route(/neo_fe\/js\/neo-story-gallery\.js/, (r) => r.fulfill({ body: js, contentType: 'text/javascript' }))
  if (a['vorlage-nachbauen']) await t.seite.addInitScript(`(${nachbauen})(${JSON.stringify(FUSS)}, ${JSON.stringify(FORTSCHRITT)})`)
  for (const s of seiten) {
    const f = (text) => { fehler.push(`${breite} ${s}: ${text}`); console.log(`✗ ${breite} ${s}: ${text}`) }
    try {
      const antwort = await t.seite.goto(s, { waitUntil: 'networkidle', timeout: 90000 })
      if (!antwort || antwort.status() >= 400) throw new Error(`HTTP ${antwort?.status() ?? 'ohne Antwort'}`)
      await t.seite.locator('[data-neo-story-gallery]').first().scrollIntoViewIfNeeded()
      await t.seite.waitForTimeout(800)
      const z0 = await t.seite.evaluate(zustand)
      if (z0.fehler) { f(z0.fehler); continue }
      if (!z0.fuss || !z0.knoepfe) { f('Pfeile unten nicht sichtbar'); continue }
      if (!z0.tab) f('Pfeile nicht per Tastatur erreichbar')
      if (!z0.balken) { f('Fortschrittsbalken nicht sichtbar'); continue }
      if (!z0.ariaHidden) f('Fortschrittsbalken ohne aria-hidden')
      const weiter = t.seite.locator('[data-neo-story-gallery] + .nc-story-gallery__footer [data-sg-next]').first()
      await weiter.click(); await t.seite.waitForTimeout(900)
      const z1 = await t.seite.evaluate(zustand)
      if (!(z1.scrollLeft > z0.scrollLeft + 10)) f(`„Weiter“ blättert nicht (scrollLeft ${z0.scrollLeft} → ${z1.scrollLeft})`)
      if (!(z1.balkenLinks > z0.balkenLinks + 0.005)) f(`Balken wandert nicht (${z0.balkenLinks?.toFixed(3)} → ${z1.balkenLinks?.toFixed(3)})`)
      let runde = null
      if (z0.endlos) {
        // Jeder Klick innerhalb der Runde rückt den Balken vor (Widersacher
        // Phase 5: bei 1280 stand er auf den letzten Karten still); der
        // letzte Klick schließt die Runde.
        let vorher = z1.balkenLinks
        for (let i = 1; i < z0.karten; i++) {
          await weiter.click(); await t.seite.waitForTimeout(700)
          if (i < z0.karten - 1) {
            const zi = await t.seite.evaluate(zustand)
            if (!(zi.balkenLinks > vorher + 0.005)) f(`Klick ${i + 1}: Balken steht (${vorher.toFixed(3)} → ${zi.balkenLinks.toFixed(3)})`)
            vorher = zi.balkenLinks
          }
        }
        runde = await t.seite.evaluate(zustand)
        if (Math.abs(runde.balkenLinks - z0.balkenLinks) > 0.05) f(`nach einer Runde Balken bei ${runde.balkenLinks.toFixed(3)} statt ${z0.balkenLinks.toFixed(3)}`)
      }
      console.log(`· ${breite} ${s}: Balken ${z0.balkenLinks.toFixed(3)} → ${z1.balkenLinks.toFixed(3)}${runde ? ` → nach Runde ${runde.balkenLinks.toFixed(3)}` : ''} · scrollLeft ${z0.scrollLeft} → ${z1.scrollLeft}`)
    } catch (e) {
      f(e.message.split('\n')[0])
    }
  }
  await t.schliesse()
}
await browser.close()
console.log(`\n${breiten.length * seiten.length} Seitenläufe · ${fehler.length} Abweichung(en)`)
process.exit(fehler.some((x) => /HTTP|keine Galerie|Timeout/.test(x)) ? 2 : fehler.length ? 1 : 0)
