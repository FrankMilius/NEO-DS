#!/usr/bin/env node
// ==========================================================================
// pruefen:sg-anordnung — sitzt der Screen so auf der Medienfläche, wie die
// Karte es sagt? (I18 Phase 9, 24.11.2026, Vorschläge 2 und 11, E3 Frank)
//
//   npm run pruefen:sg-anordnung -- [--css <styles.css>] [--vorlage-nachbauen]
//        [--theme <neo_fe>] [--seiten /,/musterseite-bauteile] [--breiten 1280,390]
//
// Anordnungen (Klasse nc-story-gallery__card--anordnung-*, ohne = unten):
//   unten   Abstand oben, links, rechts; läuft unten aus (bisheriges Bild)
//   rechts  Abstand oben und links; läuft rechts und unten aus
//   links   Abstand oben und rechts; läuft links und unten aus
//   ganz    Abstand rundum, ganzes Bild sichtbar (kein Beschnitt, kein Zoom)
// Gemessen am Screen (Rahmen .nc-shot__frame oder Bild .nc-shot__img) in der
// Medienfläche, Toleranz 1 px; bei „ganz“ zusätzlich Seitenverhältnis des
// Bildes = Datei (±1 %).
//
// --vorlage-nachbauen: DDEV rendert Twig aus dem Haupt-Checkout. Das HTML
// wird so umgeschrieben, wie Vorlage und includes/neo_story_gallery.inc ab
// Phase 9 es ausgeben: Karte 1 „rechts“, Karte 2 „links“, jede Karte im
// Hochformat (Breite < Höhe) „ganz“ (E3: automatisch), alle übrigen ohne
// Klasse. Zoom und Fokus fallen bei „ganz“ weg (data-sg-shot).
//
// Dazu je Seite eine Probe-Videokarte „ganz“: Ecken, Schatten, passt in die
// Fläche (Widersacher Phase 9).
//
// --theme <neo_fe>: prüft zusätzlich _neo_fe_sg_aufbereiten() mit lokalem
// PHP — Vorgabe nach Format, eigene Wahl schlägt Vorgabe, unbekannte Werte
// fallen auf die Vorgabe zurück, bei „ganz“ Zoom 1 und Fokus Mitte.
//
// Ausgang 0 alles passt, 1 mindestens eine Abweichung, 2 Seitenfehler.
// ==========================================================================
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { execFileSync } from 'node:child_process'
import { parseArgs } from 'node:util'
import { lade } from './lib/einstellungen.mjs'
import { chromium } from './lib/browser.mjs'
import { oeffne } from './lib/aufnahme.mjs'

const { values: a } = parseArgs({
  options: {
    css: { type: 'string' },
    theme: { type: 'string' },
    'vorlage-nachbauen': { type: 'boolean', default: false },
    seiten: { type: 'string', default: '/,/musterseite-bauteile' },
    breiten: { type: 'string', default: '1280,390' },
  },
})

const fehler = []
const f = (wo, text) => { fehler.push(`${wo}: ${text}`); console.log(`✗ ${wo}: ${text}`) }

// ---- 1. Aufbereitung in PHP ------------------------------------------------
if (a.theme) {
  const dir = mkdtempSync(join(tmpdir(), 'sg-anordnung-'))
  const php = join(dir, 'probe.php')
  writeFileSync(php, `<?php
require '${a.theme}/includes/neo_table.inc';
require '${a.theme}/includes/neo_story_gallery.inc';
$karten = [
  ['image' => '/a.png', 'ratio' => '4/3', 'zoom' => 1.4, 'focal' => ['x' => 0, 'y' => 0]],
  ['image' => '/b.png', 'ratio' => '9/16', 'zoom' => 1.8, 'focal' => ['x' => 0.2, 'y' => 0.9]],
  ['image' => '/c.png', 'ratio' => '16/9', 'anordnung' => 'rechts'],
  ['image' => '/d.png', 'ratio' => '9/16', 'anordnung' => 'unten'],
  ['image' => '/e.png', 'ratio' => '4/3', 'anordnung' => 'quer'],
  ['image' => '/f.png', 'ratio' => '1/1', 'anordnung' => 'ganz', 'zoom' => 2],
  ['video' => '/g.mp4', 'ratio' => '9/16'],
];
$aus = _neo_fe_sg_aufbereiten(json_encode($karten));
echo json_encode(array_map(fn ($k) => ['anordnung' => $k['anordnung'] ?? null, 'shot' => $k['shot'] !== '' ? json_decode($k['shot'], TRUE) : null], $aus));
`)
  try {
    const erg = JSON.parse(execFileSync('php', [php], { encoding: 'utf8' }))
    const soll = ['', 'ganz', 'rechts', '', '', 'ganz', 'ganz']
    erg.forEach((k, i) => {
      if (k.anordnung !== soll[i]) f('PHP', `Karte ${i + 1}: Anordnung „${k.anordnung}“ statt „${soll[i]}“`)
      if (soll[i] === 'ganz' && k.shot && (k.shot.zoom !== 1 || k.shot.focal?.x !== 0.5 || k.shot.focal?.y !== 0.5)) f('PHP', `Karte ${i + 1}: bei „ganz“ Zoom ${k.shot.zoom}, Fokus ${JSON.stringify(k.shot.focal)}`)
      if (i === 0 && k.shot.zoom !== 1.4) f('PHP', 'Karte 1: Zoom außerhalb von „ganz“ verändert')
    })
    console.log(`· PHP: ${erg.length} Karten aufbereitet`)
  } catch (e) {
    f('PHP', e.message.split('\n')[0])
  }
}

// ---- 2. Lage auf der Medienfläche -------------------------------------------
const einst = lade()
const seiten = a.seiten.split(',').map((s) => s.trim()).filter(Boolean)
const breiten = a.breiten.split(',').map(Number).filter(Boolean)
const css = a.css ? readFileSync(a.css, 'utf8') : null

function nachbauen (html) {
  let n = 0
  return html.replace(/<li class="nc-story-gallery__card" role="listitem" style="--sg-card-ratio-w: (\d+); --sg-card-ratio-h: (\d+);">([\s\S]*?)<\/li>/g, (alles, w, h, innen) => {
    n++
    const art = Number(w) < Number(h) ? 'ganz' : n === 1 ? 'rechts' : n === 2 ? 'links' : ''
    let neu = innen
    if (art === 'ganz') {
      neu = neu.replace(/data-sg-shot="([^"]*)"/, (m, json) => {
        const d = JSON.parse(json.replace(/&quot;/g, '"').replace(/&amp;/g, '&'))
        d.zoom = 1; d.focal = { x: 0.5, y: 0.5 }
        return `data-sg-shot="${JSON.stringify(d).replace(/&/g, '&amp;').replace(/"/g, '&quot;')}"`
      })
    }
    const klasse = art ? ` nc-story-gallery__card--anordnung-${art}` : ''
    return `<li class="nc-story-gallery__card${klasse}" role="listitem" style="--sg-card-ratio-w: ${w}; --sg-card-ratio-h: ${h};">${neu}</li>`
  })
}

function messen () {
  const g = document.querySelector('[data-neo-story-gallery]')
  if (!g) return { fehler: 'keine Galerie' }
  // Videokarte „ganz“ (Widersacher Phase 9): lokal gibt es keine, darum eine
  // Probe mit leerem <video> (Standardgröße 300 × 150) am Ende der Spur
  const spur = g.querySelector('.nc-story-gallery__track')
  spur.insertAdjacentHTML('beforeend', '<li class="nc-story-gallery__card nc-story-gallery__card--anordnung-ganz" data-probe-video style="--sg-card-ratio-w: 9; --sg-card-ratio-h: 16;"><div class="nc-story-gallery__media"><video muted></video></div></li>')
  const pv = spur.querySelector('[data-probe-video]')
  const vm = pv.querySelector('.nc-story-gallery__media'), vv = pv.querySelector('video')
  const vcs = getComputedStyle(vv)
  const video = { rund: parseFloat(vcs.borderTopLeftRadius) > 0, schatten: vcs.boxShadow !== 'none', passt: vv.offsetWidth <= vm.clientWidth && vv.offsetHeight <= vm.clientHeight, breite: vv.offsetWidth, hoehe: vv.offsetHeight }
  pv.remove()
  const probe = document.createElement('span')
  probe.style.width = 'var(--nc-story-gallery-stage-padding)'
  probe.style.position = 'absolute'
  g.appendChild(probe)
  const P = probe.getBoundingClientRect().width
  probe.remove()
  return {
    P,
    video,
    karten: [...g.querySelectorAll('.nc-story-gallery__card:not(.nc-story-gallery__card--clone)')].map((k) => {
      const m = k.querySelector('.nc-story-gallery__media')
      const art = (k.className.match(/--anordnung-(\w+)/) || [])[1] || 'unten'
      const screen = m.querySelector('.nc-shot__frame') || m.querySelector('.nc-shot__img')
      if (!screen) return { art, ohne: true }
      const mr = m.getBoundingClientRect()
      // Layout-Box ohne transform (Zoom skaliert das Bild per scale)
      let x = 0, y = 0, e = screen
      while (e && e !== m) { x += e.offsetLeft; y += e.offsetTop; e = e.offsetParent }
      const img = m.querySelector('.nc-shot__img')
      return {
        art,
        links: x, oben: y,
        rechts: mr.width - x - screen.offsetWidth,
        unten: mr.height - y - screen.offsetHeight,
        rahmen: screen !== img,
        verhaeltnis: img && img.naturalWidth ? (img.offsetWidth / img.offsetHeight) / (img.naturalWidth / img.naturalHeight) : null,
        transform: img ? getComputedStyle(img).transform : 'none',
        nachher: getComputedStyle(m, '::after').content,
      }
    }),
  }
}

const SOLL = {
  unten: { links: 'P', oben: 'P', rechts: 'P', unten: 0 },
  rechts: { links: 'P', oben: 'P', rechts: 0, unten: 0 },
  links: { links: 0, oben: 'P', rechts: 'P', unten: 0 },
}

const browser = await chromium().launch()
let geprueft = 0
for (const breite of breiten) {
  const t = await oeffne(browser, einst, breite)
  if (css !== null) t.setzeCss(css)
  if (a['vorlage-nachbauen']) {
    await t.seite.route((u) => seiten.includes(new URL(u).pathname), async (r) => {
      const antwort = await r.fetch()
      await r.fulfill({ response: antwort, body: nachbauen(await antwort.text()) })
    })
  }
  for (const s of seiten) {
    const wo = `${breite} ${s}`
    try {
      const antwort = await t.seite.goto(s, { waitUntil: 'networkidle', timeout: 90000 })
      if (!antwort || antwort.status() >= 400) throw new Error(`HTTP ${antwort?.status() ?? 'ohne Antwort'}`)
      await t.seite.evaluate(async () => {
        const imgs = [...document.querySelectorAll('[data-neo-story-gallery] img')]
        imgs.forEach((i) => { i.loading = 'eager' })
        await Promise.all(imgs.map((i) => i.decode().catch(() => {})))
      })
      await t.seite.waitForTimeout(600)
      const m = await t.seite.evaluate(messen)
      if (m.fehler) { f(wo, m.fehler); continue }
      if (!(m.video.rund && m.video.schatten && m.video.passt)) f(wo, `Videokarte „ganz“: Ecken ${m.video.rund}, Schatten ${m.video.schatten}, passt ${m.video.passt} (${m.video.breite} × ${m.video.hoehe})`)
      const arten = {}
      m.karten.forEach((k, i) => {
        if (k.ohne) return
        geprueft++
        arten[k.art] = (arten[k.art] || 0) + 1
        const nr = `Karte ${i + 1} (${k.art})`
        if (k.art === 'ganz') {
          for (const seite of ['links', 'oben', 'rechts', 'unten']) if (k[seite] < m.P - 1) f(wo, `${nr}: ${seite} ${k[seite].toFixed(1)} px Abstand, mindestens ${m.P}`)
          if (!k.rahmen && k.verhaeltnis !== null && Math.abs(k.verhaeltnis - 1) > 0.01) f(wo, `${nr}: Bild verzerrt oder beschnitten (Verhältnis ${k.verhaeltnis.toFixed(3)})`)
          if (k.transform !== 'none') f(wo, `${nr}: Zoom aktiv (${k.transform})`)
          if (k.nachher !== 'none') f(wo, `${nr}: Abdeckebene ::after noch aktiv`)
        } else {
          for (const [seite, soll] of Object.entries(SOLL[k.art] || {})) {
            const w = soll === 'P' ? m.P : soll
            if (Math.abs(k[seite] - w) > 1) f(wo, `${nr}: ${seite} ${k[seite].toFixed(1)} px statt ${w}`)
          }
        }
      })
      console.log(`· ${wo}: ${Object.entries(arten).map(([k, v]) => `${k} ${v}`).join(', ')} · Innenabstand ${m.P} px`)
    } catch (e) {
      f(wo, e.message.split('\n')[0])
    }
  }
  await t.schliesse()
}
await browser.close()
console.log(`\n${geprueft} Karten geprüft · ${fehler.length} Abweichung(en)`)
process.exit(fehler.some((x) => /HTTP|keine Galerie|Timeout/.test(x)) ? 2 : fehler.length ? 1 : 0)
