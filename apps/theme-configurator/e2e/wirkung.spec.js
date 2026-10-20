// ==========================================================================
// Wirkungsprüfung der Komponentenwerte (Roadmap R12, 20.10.2026)
// ==========================================================================
// Je Komponente mit Bühne: jedes Token bekommt einen Prüfwert, gesetzt auf
// den Theme-Bereichen und an allen Elementen, an denen die Vorschau den Wert
// inline setzt (lib/vorschau-variablen.js). Gemessen wird, ob sich der
// berechnete Stil irgendeines Elements der Bühne ändert (45 Eigenschaften,
// auch ::before/::after, Übergänge aus).
//
// Ergebnis je Komponente als Datei in wirkung-ergebnis/. Auswertung und
// Ratsche: scripts/wirkung.mjs (npm run e2e:wirkung).
// ==========================================================================
import fs from 'node:fs'
import { resolve } from 'node:path'
import { test, oeffneSektion, SEKTIONEN } from './hilfen.js'
import { componentTokenGroups } from '../src/data/tokens.generated.js'

const AUS = resolve(import.meta.dirname, '../wirkung-ergebnis')
test.describe.configure({ mode: 'parallel' })

const LAENGE = /^-?[\d.]+(px|rem|em|%|vw|vh|ch)$|var\(--(fnd-(spacing|size|radius|border-width|icon-size|focus)|fs-|nc-[a-z-]*(size|gap|padding|radius|width|height|offset|spacing))/

/** Prüfwert, der sich sicher vom Standard unterscheidet (null = keiner) */
function pruefwert (t) {
  const d = String(t.default ?? '').trim(); const id = t.id
  if ((/color|-bg|-fg|-border(?!-width|-radius)|shadow-color|fill|stroke(?!-width)/.test(id) && !/width|radius|size/.test(id)) || /^#|^rgb|^hsl|color-mix|var\(--fnd-color|transparent/.test(d)) return 'rgb(1, 2, 3)'
  if (/shadow/.test(id)) return '0 0 0 7px rgb(1, 2, 3)'
  if (/family/.test(id)) return '"Courier New", monospace'
  if (/weight/.test(id)) return /^(8|9)00$|bold/.test(d) ? '100' : '900'
  if (/opacity/.test(id)) return '0.37'
  if (/duration|delay/.test(id) || /^[\d.]+m?s$/.test(d)) return '3.7s'
  if (/line-height/.test(id)) return '3.7'
  if (/^-?[\d.]+$/.test(d)) return String(Number(d) === 7 ? 5 : 7)
  if (LAENGE.test(d) || /size|gap|padding|margin|radius|width|height|offset|inset|spacing|indent|top|left|right|bottom/.test(id)) return '37px'
  return null
}

const gruppen = componentTokenGroups.filter((g) => SEKTIONEN.includes(`component-${g.id}`))

for (const g of gruppen) {
  test(`Wirkung ${g.id}`, async ({ page }) => {
    test.setTimeout(240_000)
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await oeffneSektion(page, `component-${g.id}`)
    await page.waitForLoadState('load'); await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(800)
    const tokens = [...(g.tokens || []), ...((g.subGroups || g.subgroups || []).flatMap((s) => s.tokens || []))]
      .map((t) => ({ id: t.id, probe: pruefwert(t) }))
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
    const r = await page.evaluate(([tokens, css]) => {
      const P = ['color', 'background-color', 'background-image', 'border-top-color', 'border-bottom-color', 'border-left-color', 'border-top-width', 'border-left-width', 'border-top-left-radius', 'padding-top', 'padding-left', 'margin-top', 'margin-left', 'row-gap', 'column-gap', 'width', 'height', 'min-width', 'min-height', 'max-width', 'font-family', 'font-size', 'font-weight', 'line-height', 'letter-spacing', 'opacity', 'box-shadow', 'outline-color', 'outline-width', 'outline-offset', 'transition-duration', 'animation-duration', 'transform', 'text-transform', 'text-decoration-color', 'fill', 'stroke', 'stroke-width', 'grid-template-columns', 'aspect-ratio', 'z-index', 'filter', 'top', 'left', 'inset-inline-start']
      const docs = [document, ...[...document.querySelectorAll('.lab-viewport iframe')].map((f) => { try { return f.contentDocument } catch { return null } }).filter(Boolean)]
      const wurzeln = () => docs.flatMap((d) => [d === document ? d.querySelector('.lab-viewport') : d.documentElement, ...d.querySelectorAll('.lab-viewport [class*="-theme"], body [class*="-theme"]')]).filter(Boolean)
      // Übergänge aus: sonst liefert getComputedStyle den Startwert
      for (const d of docs) { const st = d.createElement('style'); st.textContent = '*,*::before,*::after{transition:none!important;animation:none!important}'; d.head.appendChild(st) }
      const elemente = docs.flatMap((d) => [...(d === document ? d.querySelectorAll('.lab-viewport *') : d.querySelectorAll('body *'))]).slice(0, 3000)
      const abdruck = () => elemente.map((e) => { const w = e.ownerDocument.defaultView; return [null, '::before', '::after'].map((ps) => { const s = w.getComputedStyle(e, ps); return P.map((p) => s.getPropertyValue(p)).join('|') }).join('#') })
      const basis = abdruck()
      const ergebnis = {}
      for (const t of tokens) {
        const v = `--${t.id}`
        if (!new RegExp(`var\\(${v}[,)\\s]`).test(css)) { ergebnis[t.id] = 'unbenutzt'; continue }
        if (!t.probe) { ergebnis[t.id] = 'ohne-pruefwert'; continue }
        const inline = docs.flatMap((d) => [...d.querySelectorAll('[style]')]).filter((el) => el.style.getPropertyValue(v) !== '')
        const ziele = [...new Set([...wurzeln(), ...inline])]
        const alt = ziele.map((el) => [el, el.style.getPropertyValue(v), el.style.getPropertyPriority(v)])
        for (const el of ziele) el.style.setProperty(v, t.probe)
        const neu = abdruck()
        for (const [el, wert, prio] of alt) { if (wert) el.style.setProperty(v, wert, prio); else el.style.removeProperty(v) }
        let n = 0; for (let i = 0; i < neu.length; i++) if (neu[i] !== basis[i]) n++
        ergebnis[t.id] = n
      }
      return { elemente: elemente.length, ergebnis }
    }, [tokens, css])
    fs.mkdirSync(AUS, { recursive: true })
    fs.writeFileSync(`${AUS}/${g.id}.json`, JSON.stringify(r))
  })
}
