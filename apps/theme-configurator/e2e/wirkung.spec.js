// ==========================================================================
// Wirkungsprüfung der Komponentenwerte (Roadmap R12, 20.10.2026)
// ==========================================================================
// Je Komponente mit Bühne: jedes Token bekommt einen Prüfwert, gesetzt auf
// den Theme-Bereichen und an allen Elementen, an denen die Vorschau den Wert
// inline setzt (lib/vorschau-variablen.js). Gemessen wird, ob sich der
// berechnete Stil irgendeines Elements der Bühne ändert (51 Eigenschaften,
// auch ::before/::after, Übergänge aus).
//
// Regler-Knopf (R14 Paket 2a, E2, 22.10.2026): getComputedStyle mit
// ::-webkit-slider-thumb liefert in Chromium die Werte des Eingabefelds, nicht
// die des Knopfs. Tokens, die in Regeln für ::-webkit-slider-thumb oder
// ::-moz-range-thumb gelesen werden, misst deshalb zusätzlich ein Bildvergleich
// der Regler (input[type=range]) der Bühne — nur diese Tokens, nur diese
// Elemente, damit kein anderer Wert unbemerkt umgestuft wird.
//
// Untere Ecke (R14 Paket 3a, 23.10.2026): border-bottom-left-radius gehört
// zu den gemessenen Eigenschaften — die Aussparung des Geräterahmens
// (nc-device-notch-radius, ::after) rundet nur die unteren Ecken.
//
// Handy-Breite und weitere Eigenschaften (Nachbesserung 3a, Frank
// 23.10.2026): nach der Messung in der Vorgabebreite misst die Prüfung die
// Bühne ein zweites Mal im 390-px-Rahmen („Handy“) — Regeln in
// Handy-Medienabfragen greifen nur dort. Die Unterschiede beider Breiten
// werden addiert (mehr Messung = nur zusätzliche „wirkt“). Gemessene
// Eigenschaften und Zusammenführung: e2e/wirkung-messung.js.
//
// Ergebnis je Komponente als Datei in wirkung-ergebnis/. Auswertung und
// Ratsche: scripts/wirkung.mjs (npm run e2e:wirkung).
// ==========================================================================
import fs from 'node:fs'
import { resolve } from 'node:path'
import { test, oeffneSektion, SEKTIONEN } from './hilfen.js'
import { componentTokenGroups } from '../src/data/tokens.generated.js'
import { EIGENSCHAFTEN, PSEUDO, HANDY, zusammenfuehren, schluesselwortPruefwert } from './wirkung-messung.js'

const AUS = resolve(import.meta.dirname, '../wirkung-ergebnis')
test.describe.configure({ mode: 'parallel' })

// Obergrenzen: Das Button-Polster ist min(padding-y, Rest der Knopfhoehe)
// (Entscheidung 02.10.2026) — ein groesserer Pruefwert kann nie wirken.
// Gemessen wird mit einem kleineren (Entscheidung E5, R14, 22.10.2026).
const OBERGRENZE = /^nc-button-padding-y-(xs|sm|md|lg)$/
// Komponenten, deren Wert unter reduzierter Bewegung absichtlich aus ist:
// Die Glas-Unschaerfe der Data Table schaltet @media (prefers-reduced-motion)
// ab. Diese Buehne wird ohne die Emulation gemessen, sonst bliebe
// backdrop-filter immer none (Entscheidung E6, R14, 22.10.2026).
const OHNE_REDUZIERT = new Set(['data-table'])
const LAENGE = /^-?[\d.]+(px|rem|em|%|vw|vh|ch)$|var\(--(fnd-(spacing|size|radius|border-width|icon-size|focus)|fs-|nc-[a-z-]*(size|gap|padding|radius|width|height|offset|spacing))/

/** Prüfwert, der sich sicher vom Standard unterscheidet (null = keiner) */
function pruefwert (t) {
  const d = String(t.default ?? '').trim(); const id = t.id
  if ((/color|-bg|-fg|-border(?!-width|-radius)|shadow-color|fill|stroke(?!-width)/.test(id) && !/width|radius|size/.test(id)) || /^#|^rgb|^hsl|color-mix|var\(--fnd-color|transparent/.test(d)) return 'rgb(1, 2, 3)'
  if (/shadow/.test(id)) return '0 0 0 7px rgb(1, 2, 3)'
  if (/family/.test(id)) return '"Courier New", monospace'
  if (/weight/.test(id)) return /^(8|9)00$|bold/.test(d) ? '100' : '900'
  // Sichtbarkeit als Deckkraft 0/1 (z. B. nc-hero-overlay-visible): 7 wäre
  // auf 1 gekappt und änderte nie etwas (R14 Paket 3a, 23.10.2026)
  if (/opacity/.test(id) || (/-visible$/.test(id) && /^[01]$/.test(d))) return '0.37'
  if (/duration|delay/.test(id) || /^[\d.]+m?s$/.test(d)) return '3.7s'
  if (/line-height/.test(id)) return '3.7'
  if (OBERGRENZE.test(id)) return '0px'
  // Länge mit Standard 0 (Radius, Polster …): unitless 7 ist dort ungültig
  // und wirkte nie — Prüfwert wie bei anderen Längen (R14 Paket 3a, 23.10.2026)
  if (d === '0' && /size|gap|padding|margin|radius|width|height|offset|inset|spacing|indent/.test(id)) return '37px'
  // Obergrenze über min(): nc-device-width-per-height (0.46) und
  // nc-product-showcase-acc-device-reserve (150px) kappen die Gerätebreite nur
  // nach unten — 7 bzw. 37px lassen die Kappe nie greifen (Gegenprobe 390 px:
  // 0 von 16), 0.115 bzw. 600px greifen (7 von 16). Nachbesserung 3a, 23.10.2026
  if (/-per-/.test(id) && /^0?\.\d+$/.test(d)) return String(Number(d) / 4)
  if (/reserve/.test(id) && LAENGE.test(d)) return '600px'
  if (/^-?[\d.]+$/.test(d)) return String(Number(d) === 7 ? 5 : 7)
  if (LAENGE.test(d) || /size|gap|padding|margin|radius|width|height|offset|inset|spacing|indent|top|left|right|bottom/.test(id)) return '37px'
  return null
}

/**
 * Prüfwert je Token: Speist ein Token mit Schlüsselwort-Standard eine
 * Eigenschaft, die nur Schlüsselwörter kennt (scrollbar-width …), gilt ein
 * anderes Schlüsselwort statt einer Länge (Nachbesserung 3c, Frank
 * 23.10.2026). Tokens ohne bisherigen Prüfwert bleiben ohne (keine neuen
 * Messungen nebenbei, z. B. die bewusste Ausnahme nc-textarea-resize).
 */
function probeFuer (t, css) {
  const bisher = pruefwert(t)
  if (bisher === null) return null
  return schluesselwortPruefwert(t, css) ?? bisher
}

/** Tokens, die in Regeln für den Regler-Knopf gelesen werden (Quelltext) */
function knopfTokens (css) {
  const ids = new Set()
  for (const [, sel, rumpf] of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    if (!/::-webkit-slider-thumb|::-moz-range-thumb/.test(sel)) continue
    for (const [, id] of rumpf.matchAll(/var\(--(nc-[a-z0-9-]+)/g)) ids.add(id)
  }
  return ids
}

/** Alle Regler der Bühne (auch in iframes der Bühne) als Locator */
async function reglerDerBuehne (page) {
  const liste = []
  const haupt = page.locator('.lab-viewport input[type="range"]')
  for (let i = 0; i < await haupt.count(); i++) liste.push(haupt.nth(i))
  for (const f of page.frames()) {
    if (f === page.mainFrame()) continue
    const rahmen = await f.frameElement().catch(() => null)
    if (!rahmen || !(await rahmen.evaluate((e) => !!e.closest('.lab-viewport')))) continue
    const l = f.locator('input[type="range"]')
    for (let i = 0; i < await l.count(); i++) liste.push(l.nth(i))
  }
  return liste.slice(0, 40)
}

const bilder = async (regler) => Promise.all(regler.map((l) => l.screenshot({ animations: 'disabled', caret: 'hide' }).catch(() => null)))

/**
 * Misst im Browser je Token, an wie vielen Elementen der Bühne (auch in
 * iframes der Bühne, auch ::before/::after) sich der berechnete Stil ändert.
 */
async function miss (page, tokens, css) {
  return page.evaluate(([tokens, css, P, PS]) => {
    const docs = [document, ...[...document.querySelectorAll('.lab-viewport iframe')].map((f) => { try { return f.contentDocument } catch { return null } }).filter(Boolean)]
    const wurzeln = () => docs.flatMap((d) => [d === document ? d.querySelector('.lab-viewport') : d.documentElement, ...d.querySelectorAll('.lab-viewport [class*="-theme"], body [class*="-theme"]')]).filter(Boolean)
    // Übergänge aus: sonst liefert getComputedStyle den Startwert
    for (const d of docs) { const st = d.createElement('style'); st.textContent = '*,*::before,*::after{transition:none!important;animation:none!important}'; d.head.appendChild(st) }
    const elemente = docs.flatMap((d) => [...(d === document ? d.querySelectorAll('.lab-viewport *') : d.querySelectorAll('body *'))]).slice(0, 3000)
    const abdruck = () => elemente.map((e) => { const w = e.ownerDocument.defaultView; return PS.map((ps) => { const s = w.getComputedStyle(e, ps); return P.map((p) => s.getPropertyValue(p)).join('|') }).join('#') })
    const basis = abdruck()
    // Prüfwert auf Theme-Bereiche und Inline-Stellen setzen; liefert das Zurücksetzen
    const setze = (v, probe) => {
      const inline = docs.flatMap((d) => [...d.querySelectorAll('[style]')]).filter((el) => el.style.getPropertyValue(v) !== '')
      const ziele = [...new Set([...wurzeln(), ...inline])]
      const alt = ziele.map((el) => [el, el.style.getPropertyValue(v), el.style.getPropertyPriority(v)])
      for (const el of ziele) el.style.setProperty(v, probe)
      return () => { for (const [el, wert, prio] of alt) { if (wert) el.style.setProperty(v, wert, prio); else el.style.removeProperty(v) } }
    }
    window.__wirkungSetze = (v, probe) => { window.__wirkungZurueck = setze(v, probe) }
    const ergebnis = {}
    for (const t of tokens) {
      const v = `--${t.id}`
      if (!new RegExp(`var\\(${v}[,)\\s]`).test(css)) { ergebnis[t.id] = 'unbenutzt'; continue }
      if (!t.probe) { ergebnis[t.id] = 'ohne-pruefwert'; continue }
      const zurueck = setze(v, t.probe)
      const neu = abdruck()
      zurueck()
      let n = 0; for (let i = 0; i < neu.length; i++) if (neu[i] !== basis[i]) n++ // wie zaehleUnterschiede
      ergebnis[t.id] = n
    }
    return { elemente: elemente.length, ergebnis }
  }, [tokens, css, EIGENSCHAFTEN, PSEUDO])
}

/** Schaltet die Bühne auf „Handy“ (390-px-Rahmen); false = kein Knopf */
async function aufHandy (page) {
  const knopf = page.locator(`[data-test="breite-${HANDY.key}"]`)
  if (!(await knopf.count())) return false
  await knopf.click()
  const rahmen = page.locator('[data-test="breiten-rahmen"] iframe')
  await rahmen.first().waitFor()
  await page.waitForFunction((b) => {
    const f = document.querySelector('[data-test="breiten-rahmen"] iframe')
    const ziel = f?.contentDocument?.getElementById('br-ziel')
    // offsetWidth ohne Verkleinerung (transform: scale) — die Rahmenbreite selbst
    return f && f.offsetWidth === b && ziel && ziel.children.length > 0
  }, HANDY.breite)
  await page.evaluate(async () => { const f = document.querySelector('[data-test="breiten-rahmen"] iframe'); await f.contentDocument.fonts?.ready })
  await page.waitForTimeout(800)
  return true
}

const gruppen = componentTokenGroups.filter((g) => SEKTIONEN.includes(`component-${g.id}`))

for (const g of gruppen) {
  test(`Wirkung ${g.id}`, async ({ page }) => {
    test.setTimeout(240_000)
    await page.emulateMedia({ reducedMotion: OHNE_REDUZIERT.has(g.id) ? 'no-preference' : 'reduce' })
    await oeffneSektion(page, `component-${g.id}`)
    await page.waitForLoadState('load'); await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(800)
    // Quelltext aller Stylesheets: cssText schreibt Kurzformen mit var()
    // (transition, border-color …) um, der Token-Name fiele dort heraus
    const css = await page.evaluate(async () => {
      const docs = [document, ...[...document.querySelectorAll('.lab-viewport iframe')].map((f) => { try { return f.contentDocument } catch { return null } }).filter(Boolean)]
      const teile = []
      for (const d of docs) for (const s of d.styleSheets) {
        if (s.href) { try { teile.push(await (await fetch(s.href)).text()) } catch { /* fremde Quelle */ } } else teile.push(s.ownerNode?.textContent || '')
      }
      return teile.join('\n')
    })
    const tokens = [...(g.tokens || []), ...((g.subGroups || g.subgroups || []).flatMap((s) => s.tokens || []))]
      .map((t) => ({ id: t.id, probe: probeFuer(t, css) }))
    const r = await miss(page, tokens, css)
    // Bildvergleich für Knopf-Tokens (E2): Anzahl Regler, deren Bild sich ändert
    const knopf = knopfTokens(css)
    // Zustands- und Bewegungswerte (Fokus, Übergang, Dauer …) sind in Ruhe
    // nicht messbar; ein mitfotografierter Übergang ergab sonst Zufallstreffer
    // (22.10.2026: focus-ring-offset und transition-duration „wirkt“ nur in
    // einem von zwei Läufen). Gleiche Regel wie ZUSTAND in scripts/wirkung.mjs.
    const zuMessen = tokens.filter((t) => knopf.has(t.id) && typeof r.ergebnis[t.id] === 'number' &&
      !/hover|active|focus|pressed|disabled|transition|duration|delay|anim|ease/.test(t.id))
    if (zuMessen.length) {
      const regler = await reglerDerBuehne(page)
      const vorher = await bilder(regler)
      const nochmal = await bilder(regler)
      const ruhig = regler.map((_, i) => vorher[i] && nochmal[i] && vorher[i].equals(nochmal[i]))
      r.bild = {}
      for (const t of zuMessen) {
        await page.evaluate(([v, probe]) => window.__wirkungSetze(v, probe), [`--${t.id}`, t.probe])
        const nachher = await bilder(regler)
        await page.evaluate(() => window.__wirkungZurueck())
        const n = nachher.filter((b, i) => ruhig[i] && b && !b.equals(vorher[i])).length
        r.bild[t.id] = n
        r.ergebnis[t.id] += n
      }
    }
    // Zweite Messung bei Handy-Breite (Nachbesserung 3a): Unterschiede addieren
    if (await aufHandy(page)) {
      const h = await miss(page, tokens, css)
      r.handy = { elemente: h.elemente, ergebnis: h.ergebnis }
      r.ergebnis = zusammenfuehren(r.ergebnis, h.ergebnis)
    }
    fs.mkdirSync(AUS, { recursive: true })
    fs.writeFileSync(`${AUS}/${g.id}.json`, JSON.stringify(r))
  })
}
