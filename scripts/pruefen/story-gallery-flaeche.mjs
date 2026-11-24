#!/usr/bin/env node
// ==========================================================================
// pruefen:sg-flaeche — Kartenfläche je Block und je Karte
// (I18 Phase 11, 24.11.2026, Vorschläge 13 und 14, E4/E5 Frank)
//
//   npm run pruefen:sg-flaeche -- [--css <styles.css>] [--theme <neo_fe>]
//        [--vorlage-nachbauen] [--seiten /] [--breiten 1280,390]
//
// --theme <neo_fe>: prüft _neo_fe_sg_flaeche() mit lokalem PHP — Vorgaben,
//   Paletten-Stufen (ohne neo-blue/neo-darkblue), eigene Farbwerte, und dass
//   alles andere (auch CSS-Einschleusung) leer ergibt.
// --vorlage-nachbauen: DDEV rendert Twig aus dem Haupt-Checkout. Das HTML
//   bekommt wie die Vorlage ab Phase 11 am Block --nc-story-gallery-stage-bg
//   „Neutral“, Karte 2 „Coral 100“, Karte 3 „#d8e4f0“, Karte 4 „ohne“.
//   Gemessen: Hintergrund jeder Medienfläche = erwartete Farbe (Karte vor
//   Block vor Vorgabe), Abdeckebene ::after in derselben Farbe.
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
    seiten: { type: 'string', default: '/' },
    breiten: { type: 'string', default: '1280,390' },
  },
})
const fehler = []
const f = (wo, text) => { fehler.push(`${wo}: ${text}`); console.log(`✗ ${wo}: ${text}`) }

if (a.theme) {
  const php = join(mkdtempSync(join(tmpdir(), 'sg-flaeche-')), 'probe.php')
  const faelle = {
    '': '', akzent: 'var(--nc-story-gallery-stage-bg-akzent)', neutral: 'var(--nc-story-gallery-stage-bg-neutral)',
    hell: 'var(--nc-story-gallery-stage-bg-hell)', dunkel: 'var(--nc-story-gallery-stage-bg-dunkel)', ohne: 'transparent',
    'palette:coral-100': 'var(--fnd-primitive-coral-100)', 'palette:dark-orange-950': 'var(--fnd-primitive-dark-orange-950)',
    'palette:neo-blue-500': '', 'palette:neo-darkblue-100': '', 'palette:coral-150': '',
    'palette:danger-500': '', 'palette:primary-500': '', 'palette:neutral-950': '', 'palette:foo-100': '', 'palette:medien-gruen-300': 'var(--fnd-primitive-medien-gruen-300)',
    '#D8E4F0': '#d8e4f0', '#abc': '#abc', '#abcd': '', 'red': '', 'var(--x)': '',
    '#fff; background:url(x)': '', 'palette:coral-100;color:red': '', ' neutral ': 'var(--nc-story-gallery-stage-bg-neutral)',
  }
  writeFileSync(php, `<?php
require '${a.theme}/includes/neo_table.inc';
require '${a.theme}/includes/neo_story_gallery.inc';
$faelle = json_decode('${JSON.stringify(Object.keys(faelle)).replace(/'/g, "\\'")}', TRUE);
$aus = [];
foreach ($faelle as $w) { $aus[] = _neo_fe_sg_flaeche($w); }
$karten = _neo_fe_sg_aufbereiten(json_encode([['image' => '/a.png', 'flaeche' => 'palette:aqua-200'], ['image' => '/b.png'], ['image' => '/c.png', 'flaeche' => 'url(x)']]));
echo json_encode(['einzeln' => $aus, 'karten' => array_column($karten, 'flaeche')]);
`)
  try {
    const erg = JSON.parse(execFileSync('php', [php], { encoding: 'utf8' }))
    Object.entries(faelle).forEach(([w, soll], i) => { if (erg.einzeln[i] !== soll) f('PHP', `„${w}“ → „${erg.einzeln[i]}“ statt „${soll}“`) })
    const sollK = ['var(--fnd-primitive-aqua-200)', '', '']
    erg.karten.forEach((k, i) => { if (k !== sollK[i]) f('PHP', `Karte ${i + 1}: „${k}“ statt „${sollK[i]}“`) })
    console.log(`· PHP: ${Object.keys(faelle).length} Werte, ${erg.karten.length} Karten`)
  } catch (e) { f('PHP', e.message.split('\n')[0]) }
}

const einst = lade()
const seiten = a.seiten.split(',').map((s) => s.trim()).filter(Boolean)
const breiten = a.breiten.split(',').map(Number).filter(Boolean)
const css = a.css ? readFileSync(a.css, 'utf8') : null
const KARTE = { 2: 'var(--fnd-primitive-coral-100)', 3: '#d8e4f0', 4: 'transparent' }
const BLOCK = 'var(--nc-story-gallery-stage-bg-neutral)'

function nachbauen (html) {
  let n = 0
  return html
    .replace(/(data-neo-story-gallery[\s\S]*?style=")(--sg-card-height(?:-block)?:\s*\d+px;)/, (m, vor, hoehe) => `${vor}${hoehe.replace('--sg-card-height:', '--sg-card-height-block:')} --nc-story-gallery-stage-bg: ${BLOCK};`)
    .replace(/(<li class="nc-story-gallery__card[^"]*" role="listitem" style="--sg-card-ratio-w: \d+; --sg-card-ratio-h: \d+;)"/g, (m, vor) => { n++; return KARTE[n] ? `${vor} --nc-story-gallery-stage-bg: ${KARTE[n]};"` : `${vor}"` })
}

function messen (soll) {
  const g = document.querySelector('[data-neo-story-gallery]')
  if (!g) return { fehler: 'keine Galerie' }
  const farbe = (wert, wo) => { const e = document.createElement('div'); e.style.background = wert; (wo || g).appendChild(e); const c = getComputedStyle(e).backgroundColor; e.remove(); return c }
  return [...g.querySelectorAll('.nc-story-gallery__card:not(.nc-story-gallery__card--clone)')].slice(0, 6).map((k, i) => {
    const m = k.querySelector('.nc-story-gallery__media')
    const erwartet = farbe(soll[i + 1] || soll.block)
    const nach = getComputedStyle(m, '::after')
    const wert = soll[i + 1] || soll.block
    return { wert, ist: getComputedStyle(m).backgroundColor, erwartet, deck: nach.content === 'none' ? 'keine' : nach.boxShadow.slice(-60) }
  })
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
      await t.seite.waitForTimeout(500)
      const m = await t.seite.evaluate(messen, { block: BLOCK, ...KARTE })
      if (m.fehler) { f(wo, m.fehler); continue }
      m.forEach((k, i) => {
        geprueft++
        if (k.wert !== 'transparent' && k.erwartet === 'rgba(0, 0, 0, 0)') f(wo, `Karte ${i + 1}: ${k.wert} ergibt keine Farbe (Token fehlt)`)
        if (k.ist !== k.erwartet) f(wo, `Karte ${i + 1}: Fläche ${k.ist} statt ${k.erwartet}`)
        if (k.deck !== 'keine' && !k.deck.includes(k.ist.replace(/\s/g, ' ')) && k.ist !== 'rgba(0, 0, 0, 0)') f(wo, `Karte ${i + 1}: Abdeckebene in anderer Farbe (${k.deck})`)
      })
      console.log(`· ${wo}: ${m.length} Karten · ${m.map((k) => k.ist).join(' | ')}`)
    } catch (e) { f(wo, e.message.split('\n')[0]) }
  }
  await t.schliesse()
}
await browser.close()
console.log(`\n${geprueft} Karten geprüft · ${fehler.length} Abweichung(en)`)
process.exit(fehler.some((x) => /HTTP|keine Galerie|Timeout/.test(x)) ? 2 : fehler.length ? 1 : 0)
