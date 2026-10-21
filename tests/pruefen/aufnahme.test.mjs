// Aufnahme der Prüfwerkzeuge: styles.css des Themes wird je Seite per Route
// ersetzt (Muster cssRoute aus den Einstellungen), ohne die Website anzufassen.
// Geprüft gegen einen kleinen lokalen Server statt gegen DDEV.
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import http from 'node:http'
import { chromium } from '../../scripts/pruefen/lib/browser.mjs'
import { oeffne, aufnehmen } from '../../scripts/pruefen/lib/aufnahme.mjs'
import { lade } from '../../scripts/pruefen/lib/einstellungen.mjs'

let server, basis, browser

beforeAll(async () => {
  server = http.createServer((req, res) => {
    if (req.url.endsWith('styles.css')) { res.writeHead(200, { 'content-type': 'text/css' }); return res.end('body{background:rgb(255,0,0)}') }
    if (req.url === '/fehlt') { res.writeHead(404); return res.end('nein') }
    if (req.url === '/bild.svg') {
      // Langsames Bild: kommt erst nach 1500 ms — länger als Scroll und Nachlauf
      return setTimeout(() => { res.writeHead(200, { 'content-type': 'image/svg+xml' }); res.end('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="#000"/></svg>') }, 1500)
    }
    if (req.url === '/faul') {
      res.writeHead(200, { 'content-type': 'text/html' })
      return res.end('<body style="margin:0;background:#fff"><div style="height:12000px"></div><img loading="lazy" src="/bild.svg" width="200" height="200" style="display:block"></body>')
    }
    res.writeHead(200, { 'content-type': 'text/html' })
    res.end('<link rel="stylesheet" href="/themes/custom/neo_fe/css/styles.css?v=1"><body style="margin:0"><div style="height:1500px"></div></body>')
  })
  await new Promise((r) => server.listen(0, '127.0.0.1', r))
  basis = `http://127.0.0.1:${server.address().port}`
  browser = await chromium().launch()
}, 30000)
afterAll(async () => { await browser?.close(); server?.close() })

describe('pruefen: Aufnahme', () => {
  it('ersetzt styles.css durch die übergebene CSS und wechselt sie je Aufnahme', async () => {
    const t = await oeffne(browser, { ...lade(), ddevUrl: basis }, 400)
    t.setzeCss('body{background:rgb(0,0,255)}')
    await aufnehmen(t.seite, '/')
    expect(await t.seite.evaluate(() => getComputedStyle(document.body).backgroundColor)).toBe('rgb(0, 0, 255)')
    t.setzeCss('body{background:rgb(0,128,0)}')
    const png = await aufnehmen(t.seite, '/')
    expect(await t.seite.evaluate(() => getComputedStyle(document.body).backgroundColor)).toBe('rgb(0, 128, 0)')
    expect(png.subarray(1, 4).toString()).toBe('PNG')
    await t.schliesse()
  }, 30000)

  it('nimmt die ganze Seite auf, nicht nur den Ausschnitt', async () => {
    const t = await oeffne(browser, { ...lade(), ddevUrl: basis }, 400)
    t.setzeCss('')
    const png = await aufnehmen(t.seite, '/')
    expect(png.readUInt32BE(20)).toBe(1500) // Höhe im IHDR-Block
    await t.schliesse()
  }, 30000)

  it('wartet auf nachgeladene Bilder (loading="lazy"), statt eine leere Fläche aufzunehmen', async () => {
    // Anlass 21.10.2026: Probe mit gleicher CSS meldete /musterseite-bauteile als geändert —
    // in Aufnahme b fehlte ein Bild, das erst beim Scrollen geladen wurde.
    const t = await oeffne(browser, { ...lade(), ddevUrl: basis }, 400)
    t.setzeCss('')
    await aufnehmen(t.seite, '/faul')
    expect(await t.seite.evaluate(() => [...document.images].every((i) => i.complete && i.naturalWidth > 0))).toBe(true)
    await t.schliesse()
  }, 30000)

  it('HTTP-Fehler der Seite wirft, statt eine Fehlerseite zu vergleichen', async () => {
    const t = await oeffne(browser, { ...lade(), ddevUrl: basis }, 400)
    await expect(aufnehmen(t.seite, '/fehlt')).rejects.toThrow(/404/)
    await t.schliesse()
  }, 30000)
})
