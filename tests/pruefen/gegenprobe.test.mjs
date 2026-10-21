// Gegenprobe: wirkt eine Setzung (z. B. ein Token) überhaupt auf die Bauteile
// der Website? Sie wird auf :root und den vier Theme-Klassen erzwungen; je
// Bauteil wird gezählt, bei wie vielen Elementen sich eine Eigenschaft ändert.
// 0 von n heißt „wirkungslos“, 0 von 0 aber „nicht geprüft“ — das Bauteil kam
// auf keiner Seite vor (Projekt-Risiko „Geltungsbereich ohne Träger“).
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { chromium } from '../../scripts/pruefen/lib/browser.mjs'
import { zaehle, summiere, urteil, bericht, regel, messe } from '../../scripts/pruefen/lib/gegenprobe.mjs'

describe('pruefen: Gegenprobe — Auswertung', () => {
  it('zaehle: je Bauteil Elemente und geänderte Elemente', () => {
    const z = zaehle(['a', 'a', 'b'], ['a', 'x', 'b'], ['.nc-button', '.nc-button', '.nc-badge'])
    expect(z).toEqual({ '.nc-button': [2, 1], '.nc-badge': [1, 0] })
  })

  it('summiere: Seiten zusammenzählen, Bauteile ohne Vorkommen als [0, 0]', () => {
    const s = summiere([{ '.nc-button': [2, 1] }, { '.nc-button': [3, 0], '.nc-badge': [1, 1] }], ['.nc-button', '.nc-badge', '.nc-chip'])
    expect(s).toEqual({ '.nc-button': [5, 1], '.nc-badge': [1, 1], '.nc-chip': [0, 0] })
  })

  it('urteil: wirkt · wirkungslos · nicht geprüft', () => {
    expect(urteil([5, 1])).toBe('wirkt')
    expect(urteil([5, 0])).toBe('wirkungslos')
    expect(urteil([0, 0])).toBe('nicht geprüft')
  })

  it('bericht: Tabelle Bauteil · Elemente · geändert · Urteil', () => {
    const t = bericht({ '.nc-button': [5, 1], '.nc-chip': [0, 0] })
    expect(t).toMatch(/Bauteil\s+Elemente\s+geändert\s+Urteil/)
    expect(t).toMatch(/\.nc-button\s+5\s+1\s+wirkt/)
    expect(t).toMatch(/\.nc-chip\s+0\s+0\s+nicht geprüft/)
  })

  it('regel: Setzung auf :root und den Theme-Klassen, mit !important genau einmal', () => {
    expect(regel('--font-ui: var(--font-mono)')).toBe(':root,:where(.neo-light-theme,.neo-dark-theme,.customer-light-theme,.customer-dark-theme){--font-ui: var(--font-mono) !important}')
    expect(regel('--x: 1px !important;')).toMatch(/\{--x: 1px !important\}$/)
  })
})

describe('pruefen: Gegenprobe — Messung im Browser', () => {
  let browser, seite
  beforeAll(async () => {
    browser = await chromium().launch()
    seite = await browser.newPage()
    await seite.setContent(`<style>
      :root{--font-ui:serif}
      .neo-light-theme{--font-ui:serif}
      .nc-button{font-family:var(--font-ui)} .nc-badge{font-family:cursive}
    </style><div class="neo-light-theme"><button class="nc-button">a</button><button class="nc-button nc-badge">b</button><span class="nc-badge">c</span></div>`)
  }, 30000)
  afterAll(async () => { await browser?.close() })

  it('zählt je Bauteil, erstes passendes Bauteil gewinnt, und räumt die Setzung wieder ab', async () => {
    const arg = { bauteile: ['.nc-button', '.nc-badge', '.nc-chip'], eigenschaft: 'font-family', css: regel('--font-ui: monospace') }
    expect(await messe(seite, arg)).toEqual({ '.nc-button': [2, 1], '.nc-badge': [1, 0] })
    expect(await seite.evaluate(() => getComputedStyle(document.querySelector('.nc-button')).fontFamily)).toBe('serif')
  })

  it('erfundenes Token ändert nichts', async () => {
    const arg = { bauteile: ['.nc-button', '.nc-badge'], eigenschaft: 'padding-inline', css: regel('--gibt-es-nicht: 1px') }
    expect(await messe(seite, arg)).toEqual({ '.nc-button': [2, 0], '.nc-badge': [1, 0] })
  })
})
