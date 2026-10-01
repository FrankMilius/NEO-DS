/**
 * Drupal-Attrappe (scripts/drupal-attrappe.mjs, Plan v2, 2.6, Teil 2) über
 * HTTP gegen den Vertrag 1.0.0: 200/201/204, 412, 428, 409, 422 (Schema und
 * Kontrast-Tor), 413, 403 (Recht, CSRF), ETag = inhalts-hash.js, Rechte per
 * Kopfzeile/Cookie/Startparameter, Persistenz in einer Datei — und der
 * Drupal-Adapter der App gegen die Attrappe.
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import http from 'node:http'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { erzeugeAttrappe, BASIS, leseRechte, maschinenname, pruefeAbweichungen } from '../../../../scripts/drupal-attrappe.mjs'
import { inhaltsHash, alsEtag } from '../../src/speicher/inhalts-hash.js'
import { erzeugeDrupalSpeicher } from '../../src/speicher/drupal.js'
import { standardDaten } from '../../src/speicher/standard.js'

const STANDARD = JSON.parse(readFileSync(resolve(__dirname, '../../../../data/neo-theme-defaults/neo-theme-defaults.json'), 'utf8'))
const TOKEN = 'test-token'

/**
 * fetch über node:http — die Testumgebung (happy-dom) ersetzt globalThis.fetch
 * durch eine Browser-Nachbildung mit CORS-Regeln; die Attrappe ist ein echter
 * Server, also sprechen wir sie direkt an.
 */
function fetch (adresse, o = {}) {
  return new Promise((ok, fehler) => {
    const req = http.request(adresse, { method: o.method || 'GET', headers: o.headers || {} }, (res) => {
      const teile = []
      res.on('data', (c) => teile.push(c))
      res.on('end', () => {
        const text = Buffer.concat(teile).toString('utf8')
        ok({
          status: res.statusCode,
          ok: res.statusCode >= 200 && res.statusCode < 300,
          headers: { get: (n) => res.headers[n.toLowerCase()] ?? null },
          text: async () => text,
          json: async () => JSON.parse(text),
        })
      })
    })
    req.on('error', fehler)
    if (o.body !== undefined) req.write(o.body)
    req.end()
  })
}
const KORRIGIERT = { activeThemeSet: 'customer', themes: { customer: { light: { 'on-danger': '#000000', 'on-success': '#000000' } } } }
const KONTRAST_OK = { bestanden: true, verfahren: 'x', ergebnisse: [] }

function starte (o = {}) {
  const server = erzeugeAttrappe({ standard: STANDARD, csrfToken: TOKEN, ...o })
  return new Promise((ok) => server.listen(0, '127.0.0.1', () => ok(server)))
}

let server, url
beforeAll(async () => { server = await starte(); url = `http://127.0.0.1:${server.address().port}` })
afterAll(() => new Promise((ok) => server.close(ok)))

async function api (methode, pfad, { body, etag, csrf = TOKEN, rechte, roh } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (csrf) headers['X-CSRF-Token'] = csrf
  if (etag) headers['If-Match'] = etag
  if (rechte !== undefined) headers['X-Neo-Rechte'] = rechte
  const res = await fetch(url + BASIS + pfad, { method: methode, headers, body: roh ?? (body === undefined ? undefined : JSON.stringify(body)) })
  const text = await res.text()
  let daten = text
  try { daten = JSON.parse(text) } catch { /* Text (CSS) */ }
  return { status: res.status, daten, etag: res.headers.get('etag'), headers: res.headers }
}

let zaehler = 0
async function lege (abweichungen = {}, name = `Test ${++zaehler}`) {
  const r = await api('POST', '/themes', { body: { meta: { name, version: '1.0.0' }, abweichungen } })
  expect(r.status).toBe(201)
  return r
}

describe('Drupal-Attrappe — Vertrag 1.0.0', () => {
  it('GET /neo-standard und leere/gefüllte Liste mit aktiv + hash', async () => {
    const s = await api('GET', '/neo-standard', { csrf: null })
    expect(s.status).toBe(200)
    expect(s.daten._meta.version).toBe(STANDARD._meta.version)
    expect(s.etag).toBe(`"${STANDARD._meta.version}"`)
    const t = await lege()
    const l = await api('GET', '/themes', { csrf: null })
    expect(l.status).toBe(200)
    const eintrag = l.daten.themes.find(x => x.id === t.daten.meta.id)
    expect(eintrag).toMatchObject({ aktiv: false, status: 'entwurf', hash: t.daten.meta.hash })
  })

  it('POST 201: Maschinenname, Location, ETag = inhaltsHash({ meta: { name, version }, abweichungen })', async () => {
    const abw = { themes: { customer: { light: { 'text-link': '#0b5cad' } } } }
    const r = await api('POST', '/themes', { body: { meta: { name: 'Stadtwerke Süd', version: '2.0.0' }, abweichungen: abw, standardVersion: '1.0.0' } })
    expect(r.status).toBe(201)
    expect(r.daten.meta.id).toMatch(/^stadtwerke_sued(_\d+)?$/)
    expect(r.headers.get('location')).toBe(`${BASIS}/themes/${r.daten.meta.id}`)
    const hash = await inhaltsHash({ meta: { name: 'Stadtwerke Süd', version: '2.0.0' }, abweichungen: abw })
    expect(r.etag).toBe(alsEtag(hash))
    expect(r.daten.meta.hash).toBe(hash)
    const g = await api('GET', `/themes/${r.daten.meta.id}`, { csrf: null })
    expect(g.etag).toBe(r.etag)
    expect(g.daten.abweichungen).toEqual(abw)
  })

  it('PUT: 428 ohne If-Match, 412 mit altem ETag (aktuellerEtag), 200 mit aktuellem', async () => {
    const t = await lege()
    const id = t.daten.meta.id
    const body = { meta: { name: t.daten.meta.name, version: '1.0.1' }, abweichungen: { focusRingMode: { customer: 'inset' } } }
    expect((await api('PUT', `/themes/${id}`, { body })).status).toBe(428)
    const ok = await api('PUT', `/themes/${id}`, { body, etag: t.etag })
    expect(ok.status).toBe(200)
    expect(ok.etag).not.toBe(t.etag)
    const alt = await api('PUT', `/themes/${id}`, { body, etag: t.etag })
    expect(alt.status).toBe(412)
    expect(alt.daten.aktuellerEtag).toBe(ok.etag)
    expect(alt.etag).toBe(ok.etag)
    expect(alt.headers.get('content-type')).toMatch(/problem\+json/)
  })

  it('422: Schema ThemeAbweichungen und Pflichtfelder', async () => {
    const r = await api('POST', '/themes', { body: { meta: { name: 'x', version: '1' }, abweichungen: { gibtsNicht: {}, themes: { fremd: {} }, activeThemeSet: 'blau' } } })
    expect(r.status).toBe(422)
    expect(r.daten.fehler).toEqual(expect.arrayContaining([
      'abweichungen.gibtsNicht: unbekannter Schlüssel',
      'abweichungen.themes.fremd: erlaubt sind nur die Sets neo, customer',
      'abweichungen.activeThemeSet: erlaubt sind neo, customer',
    ]))
    expect((await api('POST', '/themes', { body: { meta: { version: '1' }, abweichungen: {} } })).status).toBe(422)
    expect((await api('POST', '/themes', { roh: '{kein json' })).status).toBe(400)
  })

  it('413: Anfrage über 1 MB', async () => {
    const r = await api('POST', '/themes', { roh: JSON.stringify({ meta: { name: 'gross', version: '1' }, abweichungen: { customFonts: { customer: ['x'.repeat(1024 * 1024)] } } }) })
    expect(r.status).toBe(413)
  })

  it('403: Recht fehlt (Kopfzeile) und CSRF-Token falsch/fehlend', async () => {
    const nurAnsehen = await api('POST', '/themes', { body: { meta: { name: 'a', version: '1' }, abweichungen: {} }, rechte: 'ansehen' })
    expect(nurAnsehen.status).toBe(403)
    expect(nurAnsehen.daten.detail).toBe('Dir fehlt das Recht „bearbeiten“.')
    expect((await api('GET', '/themes', { rechte: '' })).status).toBe(403)
    const csrf = await api('POST', '/themes', { body: { meta: { name: 'a', version: '1' }, abweichungen: {} }, csrf: 'falsch' })
    expect(csrf.status).toBe(403)
    expect(csrf.daten.type).toMatch(/csrf$/)
    expect((await api('POST', '/themes', { body: {}, csrf: null })).status).toBe(403)
    const t = await lege()
    expect((await api('POST', `/themes/${t.daten.meta.id}/aktivieren`, { rechte: 'ansehen,bearbeiten' })).status).toBe(403)
  })

  it('Veröffentlichen: 422 mit Kontrast-Befund des NEO-Standards (Befund G), auch wenn die App „bestanden“ meldet', async () => {
    const t = await lege({})
    const r = await api('POST', `/themes/${t.daten.meta.id}/veroeffentlichen`, { etag: t.etag, body: { css: ':root{}', kontrast: KONTRAST_OK } })
    expect(r.status).toBe(422)
    expect(r.daten.kontrast.bestanden).toBe(false)
    const befunde = r.daten.kontrast.ergebnisse.filter(e => !e.bestanden).map(e => `${e.modus} ${e.vordergrund}/${e.hintergrund} ${e.verhaeltnis}`)
    expect(befunde).toEqual(['light on-danger/feedback-danger 3.35', 'light on-success/feedback-success 3.35'])
    expect((await api('POST', `/themes/${t.daten.meta.id}/veroeffentlichen`, { etag: t.etag, body: { css: '', kontrast: {} } })).status).toBe(422)
    expect((await api('POST', `/themes/${t.daten.meta.id}/veroeffentlichen`, { body: { css: 'x', kontrast: KONTRAST_OK } })).status).toBe(428)
  })

  it('409: Aktivieren nur veröffentlicht; Veröffentlichen + Aktivieren; aktives nicht löschbar; Export', async () => {
    const t = await lege(KORRIGIERT)
    const id = t.daten.meta.id
    expect((await api('POST', `/themes/${id}/aktivieren`)).status).toBe(409)
    const v = await api('POST', `/themes/${id}/veroeffentlichen`, { etag: t.etag, body: { css: ':root{--x:1}', kontrast: KONTRAST_OK } })
    expect(v.status).toBe(200)
    expect(v.etag).toBe(t.etag) // Veröffentlichen ändert den Inhalt nicht
    expect(v.daten.meta.status).toBe('veroeffentlicht')
    expect(v.daten.css).toMatchObject({ version: '1', ausgeliefert: false })
    const a = await api('POST', `/themes/${id}/aktivieren`)
    expect(a.status).toBe(200)
    expect(a.daten.themes.filter(x => x.aktiv).map(x => x.id)).toEqual([id])
    const v2 = await api('POST', `/themes/${id}/veroeffentlichen`, { etag: t.etag, body: { css: ':root{--x:2}', kontrast: KONTRAST_OK } })
    expect(v2.daten.css).toMatchObject({ version: '2', ausgeliefert: true, pfad: 'public://neo-theme/theme.css' })
    expect((await api('DELETE', `/themes/${id}`, { etag: t.etag })).status).toBe(409)
    expect((await api('GET', `/themes/${id}/export?format=css`, { csrf: null })).daten).toBe(':root{--x:2}')
    expect((await api('GET', `/themes/${id}/export?format=abweichungen`, { csrf: null })).daten.abweichungen).toEqual(KORRIGIERT)
    // Speichern nach dem Veröffentlichen: Status geändert
    const p = await api('PUT', `/themes/${id}`, { etag: t.etag, body: { meta: { name: t.daten.meta.name, version: '1.1.0' }, abweichungen: KORRIGIERT } })
    expect(p.daten.meta.status).toBe('geaendert-seit-veroeffentlichung')
  })

  it('DELETE: 428/412/204, danach 404', async () => {
    const t = await lege()
    const id = t.daten.meta.id
    expect((await api('DELETE', `/themes/${id}`)).status).toBe(428)
    expect((await api('DELETE', `/themes/${id}`, { etag: '"alt"' })).status).toBe(412)
    expect((await api('DELETE', `/themes/${id}`, { etag: t.etag })).status).toBe(204)
    expect((await api('GET', `/themes/${id}`, { csrf: null })).status).toBe(404)
  })

  it('Rechte per Cookie der Einstiegsseite; CSRF-Token unter /session/token', async () => {
    const tok = await (await fetch(`${url}/session/token`)).text()
    expect(tok).toBe(TOKEN)
    const r = await fetch(url + BASIS + '/themes', {
      method: 'POST',
      headers: { 'X-CSRF-Token': TOKEN, Cookie: 'neo_attrappe_rechte=ansehen', 'Content-Type': 'application/json' },
      body: JSON.stringify({ meta: { name: 'c', version: '1' }, abweichungen: {} }),
    })
    expect(r.status).toBe(403)
  })

  it('Hilfsfunktionen', () => {
    expect(leseRechte('alle')).toEqual(['ansehen', 'bearbeiten', 'veroeffentlichen'])
    expect(leseRechte('bearbeiten, ansehen, quatsch')).toEqual(['ansehen', 'bearbeiten'])
    expect(leseRechte('keine')).toEqual([])
    expect(maschinenname('Ärger & Öl!')).toBe('aerger_oel')
    expect(pruefeAbweichungen({})).toEqual([])
  })
})

describe('Drupal-Attrappe — mit dem App-Adapter (speicher/drupal.js)', () => {
  it('anlegen → speichern → 412 bei veraltetem Stand; Laden führt mit dem Standard zusammen', async () => {
    const f = (u, o) => fetch(u.startsWith('http') ? u : url + u, o)
    const sp = erzeugeDrupalSpeicher({ basisUrl: BASIS, fetch: f, rechte: ['ansehen', 'bearbeiten', 'veroeffentlichen'] })
    const daten = standardDaten(STANDARD)
    daten.themes.customer.light['text-link'] = '#0b5cad'
    const neu = await sp.speichere({ meta: { name: 'Adapter', version: '1.0.0' }, daten })
    expect(neu.meta.id).toBeTruthy()
    expect(neu.etag).toBe(alsEtag(await inhaltsHash({ meta: { name: 'Adapter', version: '1.0.0' }, abweichungen: neu.abweichungen })))
    const geladen = await sp.lade(neu.meta.id)
    expect(geladen.daten).toEqual(daten)
    const zwei = await sp.speichere({ meta: neu.meta, daten, etag: neu.etag })
    daten.themes.customer.light['text-link'] = '#111111'
    await sp.speichere({ meta: zwei.meta, daten, etag: zwei.etag })
    // zwei.etag ist durch das letzte Speichern veraltet
    const e = await sp.speichere({ meta: zwei.meta, daten, etag: zwei.etag }).catch(x => x)
    expect(e).toMatchObject({ art: 'veraltet', status: 412 })
    expect(e.istKonflikt).toBe(true)
  })
})

describe('Drupal-Attrappe — Persistenz', () => {
  it('schreibt in die Datei und liest sie beim Start', async () => {
    const ordner = mkdtempSync(join(tmpdir(), 'attrappe-'))
    const datei = join(ordner, 'themes.json')
    try {
      const s1 = await starte({ datei })
      const u1 = `http://127.0.0.1:${s1.address().port}`
      const r = await fetch(u1 + BASIS + '/themes', { method: 'POST', headers: { 'X-CSRF-Token': TOKEN }, body: JSON.stringify({ meta: { name: 'Bleibt', version: '1' }, abweichungen: {} }) })
      expect(r.status).toBe(201)
      await new Promise((ok) => s1.close(ok))
      const s2 = await starte({ datei })
      const liste = await (await fetch(`http://127.0.0.1:${s2.address().port}${BASIS}/themes`)).json()
      expect(liste.themes.map(t => t.name)).toEqual(['Bleibt'])
      await new Promise((ok) => s2.close(ok))
    } finally {
      rmSync(ordner, { recursive: true, force: true })
    }
  })
})
