#!/usr/bin/env node
// ==========================================================================
// pruefen:sg-rahmen — schlichte Rahmen am Medien-Bauteil shot
// (I18 Phase 10, 24.11.2026, Vorschläge 10 und 12, E7 Frank: überall)
//
//   npm run pruefen:sg-rahmen -- [--css <styles.css>] [--js <neo-behaviors.js>]
//        [--vorlage-nachbauen] [--seiten /,/musterseite-bauteile] [--breiten 1280,390]
//
// Je Rahmen (.nc-shot__frame) auf der Seite:
//   Telefon   (.nc-shot__frame--telefon) keine Leiste; Kontur ganz in der
//             Medienfläche; Seitenverhältnis = --nc-shot-phone-ratio (±2 %);
//             vom Screen mindestens 90 % der Höhe sichtbar
//   Browser   Leiste hell (Luminanz der Fläche > 0,8 im hellen Theme), Adresse
//             nur, wenn die Karte eine url nennt
//   Vorgabe   Rahmen ohne Rahmenart im Hochformat ist Telefon
// --js ersetzt neo_fe/js/neo-behaviors.js (das Markup baut shot im Browser).
// --vorlage-nachbauen schreibt das HTML wie die Vorlage ab I18 Phase 9 um
// (Hochformat-Karten mit Klasse „ganz“, Höhe als --sg-card-height-block).
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

function nachbauen (html) {
  return html
    .replace(/style="--sg-card-height:/g, 'style="--sg-card-height-block:')
    .replace(/<li class="nc-story-gallery__card" role="listitem" style="--sg-card-ratio-w: (\d+); --sg-card-ratio-h: (\d+);">/g,
      (m, w, h) => Number(w) < Number(h) ? m.replace('nc-story-gallery__card"', 'nc-story-gallery__card nc-story-gallery__card--anordnung-ganz"') : m)
}

function messen () {
  const lum = (farbe) => {
    const m = farbe.match(/[\d.]+/g)
    if (!m) return null
    const [r, g, b] = m.slice(0, 3).map((x) => { const c = Number(x) / 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4 })
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }
  return [...document.querySelectorAll('.nc-shot__frame')].filter((f) => !f.closest('.nc-story-gallery__card--clone')).map((f) => {
    const huelle = f.parentElement
    const daten = (() => { try { return JSON.parse(huelle.dataset.probeShot || huelle.dataset.sgShot || '{}') } catch { return {} } })()
    const fr = f.getBoundingClientRect(), hr = huelle.getBoundingClientRect()
    const img = f.querySelector('.nc-shot__img')
    const sicht = f.querySelector('.nc-shot__viewport')
    const leiste = f.querySelector('.nc-shot__chrome-bar')
    const t = String(daten.ratio || '').split('/').map(Number)
    let sichtbarHoehe = null
    if (img && img.naturalWidth && sicht) {
      const vb = sicht.clientWidth / sicht.clientHeight, ib = img.naturalWidth / img.naturalHeight
      sichtbarHoehe = ib >= vb ? 1 : ib / vb
    }
    const probe = document.createElement('span')
    probe.style.cssText = 'position:absolute;width:100px;height:calc(100px / (var(--nc-shot-phone-ratio)))'
    f.appendChild(probe)
    const sollRatio = 100 / probe.getBoundingClientRect().height
    probe.remove()
    return {
      karte: f.closest('.nc-story-gallery__card') ? 'Galerie' : (f.closest('[class*="feature"]') ? 'Feature-Liste' : 'sonst'),
      telefon: f.classList.contains('nc-shot__frame--telefon'),
      art: daten.frame || '',
      hoch: t.length === 2 && t[0] < t[1],
      url: daten.url || '',
      adresse: f.querySelector('.nc-shot__chrome-url')?.textContent ?? null,
      leiste: !!leiste,
      leisteHell: leiste ? lum(getComputedStyle(leiste).backgroundColor) : null,
      drin: fr.left >= hr.left - 0.5 && fr.right <= hr.right + 0.5 && fr.top >= hr.top - 0.5 && fr.bottom <= hr.bottom + 0.5,
      verhaeltnis: fr.width / fr.height,
      sollRatio,
      sichtbarHoehe,
    }
  })
}

const browser = await chromium().launch()
const fehler = []
let geprueft = 0
for (const breite of breiten) {
  const t = await oeffne(browser, einst, breite)
  if (css !== null) t.setzeCss(css)
  // neo-story-gallery.js entfernt data-sg-shot nach dem Bauen — vorher sichern
  await t.seite.addInitScript(() => document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-sg-shot]').forEach((e) => { e.dataset.probeShot = e.getAttribute('data-sg-shot') })
  }, { capture: true }))
  if (js !== null) await t.seite.context().route(/neo_fe\/js\/neo-behaviors\.js/, (r) => r.fulfill({ body: js, contentType: 'text/javascript' }))
  if (a['vorlage-nachbauen']) {
    await t.seite.route((u) => seiten.includes(new URL(u).pathname), async (r) => {
      const antwort = await r.fetch()
      await r.fulfill({ response: antwort, body: nachbauen(await antwort.text()) })
    })
  }
  for (const s of seiten) {
    const wo = `${breite} ${s}`
    const f = (text) => { fehler.push(`${wo}: ${text}`); console.log(`✗ ${wo}: ${text}`) }
    try {
      const antwort = await t.seite.goto(s, { waitUntil: 'networkidle', timeout: 90000 })
      if (!antwort || antwort.status() >= 400) throw new Error(`HTTP ${antwort?.status() ?? 'ohne Antwort'}`)
      await t.seite.evaluate(async () => {
        const imgs = [...document.querySelectorAll('.nc-shot img')]
        imgs.forEach((i) => { i.loading = 'eager' })
        await Promise.all(imgs.map((i) => i.decode().catch(() => {})))
      })
      await t.seite.waitForTimeout(600)
      const rahmen = await t.seite.evaluate(messen)
      const n = { telefon: 0, browser: 0, sonst: 0 }
      rahmen.forEach((r, i) => {
        geprueft++
        const nr = `Rahmen ${i + 1} (${r.karte}, ${r.art || 'ohne Art'})`
        if (!r.art && r.hoch && !r.telefon) f(`${nr}: Hochformat ohne Rahmenart ist kein Telefon`)
        if (r.telefon) {
          n.telefon++
          if (r.leiste) f(`${nr}: Telefon mit Leiste`)
          if (!r.drin) f(`${nr}: Telefon ragt aus der Fläche`)
          if (Math.abs(r.verhaeltnis / r.sollRatio - 1) > 0.02) f(`${nr}: Seitenverhältnis ${r.verhaeltnis.toFixed(3)} statt ${r.sollRatio.toFixed(3)}`)
          if (r.sichtbarHoehe !== null && r.sichtbarHoehe < 0.9) f(`${nr}: nur ${(r.sichtbarHoehe * 100).toFixed(0)} % der Screen-Höhe sichtbar`)
        } else if (r.leiste) {
          n.browser++
          if (r.leisteHell !== null && r.leisteHell < 0.8) f(`${nr}: Leiste dunkel (Luminanz ${r.leisteHell.toFixed(2)})`)
          if (!r.url && r.adresse !== null) f(`${nr}: Adresse „${r.adresse}“ ohne url der Karte`)
          if (r.url && r.adresse !== r.url) f(`${nr}: Adresse „${r.adresse}“ statt „${r.url}“`)
        } else n.sonst++
      })
      console.log(`· ${wo}: ${rahmen.length} Rahmen · Telefon ${n.telefon}, Browser ${n.browser}, ohne Leiste ${n.sonst}`)
    } catch (e) {
      f(e.message.split('\n')[0])
    }
  }
  await t.schliesse()
}
await browser.close()
console.log(`\n${geprueft} Rahmen geprüft · ${fehler.length} Abweichung(en)`)
process.exit(fehler.some((x) => /HTTP|Timeout/.test(x)) ? 2 : fehler.length ? 1 : 0)
