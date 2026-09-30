/**
 * Speicher-Adapter "drupal" (Plan v2, 2.6) gegen ein gefaelschtes fetch:
 * Erfolg, Konflikte (409/412), fehlendes Recht (403), Netzwerkfehler —
 * und die Store-Aktionen, die ihn benutzen.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { useThemeStore } from '../../src/stores/theme.js'
import { erzeugeDrupalSpeicher } from '../../src/speicher/drupal.js'
import { setzeSpeicher, SpeicherFehler } from '../../src/speicher/index.js'
import { antwort, fetchAttrappe } from './_hilfen.js'

const BASIS = '/api/neo-theme-konfigurator/v1'
const THEMES = `${BASIS}/kunden/acme/themes`
const meta = (rev, extra = {}) => ({ id: 't1', name: 'ACME', version: '1.0.0', revision: rev, status: 'entwurf', ...extra })
const dok = (rev, daten = {}) => ({ meta: meta(rev), daten })

function adapter(regeln, extra = {}) {
  const f = fetchAttrappe([['GET', '/session/token', antwort(200, 'tok-123')], ...regeln])
  return { sp: erzeugeDrupalSpeicher({ basisUrl: BASIS + '/', kunde: 'acme', fetch: f, ...extra }), f }
}

describe('Adapter drupal — Erfolg', () => {
  it('liste: GET ohne CSRF, mit Sitzungscookie', async () => {
    const { sp, f } = adapter([['GET', THEMES, antwort(200, { themes: [meta('7')] })]])
    expect((await sp.liste())[0].id).toBe('t1')
    expect(f.aufrufe[0]).toMatchObject({ url: THEMES, methode: 'GET', credentials: 'same-origin' })
    expect(f.aufrufe[0].headers['X-CSRF-Token']).toBeUndefined()
  })

  it('lade: Theme + ETag; 404 -> null', async () => {
    const { sp } = adapter([
      ['GET', `${THEMES}/t1`, antwort(200, dok('7', { themes: {} }), { ETag: '"7"' })],
      ['GET', `${THEMES}/fehlt`, antwort(404, { title: 'Not Found', status: 404 })],
    ])
    expect(await sp.lade('t1')).toEqual({ meta: meta('7'), daten: { themes: {} }, etag: '"7"' })
    expect(await sp.lade('fehlt')).toBeNull()
  })

  it('speichere neu: POST mit CSRF-Token (einmal von /session/token geholt)', async () => {
    const { sp, f } = adapter([
      ['POST', THEMES, (a) => antwort(201, { meta: { ...a.body.meta, id: 't1', revision: '1' }, daten: a.body.daten }, { ETag: '"1"' })],
    ])
    const erg = await sp.speichere({ meta: { name: 'ACME', version: '1.0.0' }, daten: { x: 1 } })
    await sp.speichere({ meta: { name: 'ACME 2', version: '1.0.0' }, daten: { x: 2 } })
    expect(erg.etag).toBe('"1"')
    expect(erg.meta.id).toBe('t1')
    expect(f.aufrufe.filter(a => a.url === '/session/token')).toHaveLength(1)
    const post = f.aufrufe.find(a => a.methode === 'POST')
    expect(post.headers['X-CSRF-Token']).toBe('tok-123')
    expect(post.headers['If-Match']).toBeUndefined()
  })

  it('speichere vorhanden: PUT mit If-Match; festes csrfToken wird ohne Abruf benutzt', async () => {
    const { sp, f } = adapter([['PUT', `${THEMES}/t1`, antwort(200, dok('8'), { ETag: '"8"' })]], { csrfToken: 'fest' })
    const erg = await sp.speichere({ meta: meta('7'), daten: {}, etag: '"7"', notiz: 'Logo-Farbe' })
    expect(erg.etag).toBe('"8"')
    const put = f.aufrufe[0]
    expect(put.headers).toMatchObject({ 'If-Match': '"7"', 'X-CSRF-Token': 'fest', 'Content-Type': 'application/json' })
    expect(put.body.revisionsnotiz).toBe('Logo-Farbe')
    expect(f.aufrufe.some(a => a.url === '/session/token')).toBe(false)
  })

  it('vorhandenes Theme ohne ETag wird nicht blind ueberschrieben (kein Aufruf)', async () => {
    const { sp, f } = adapter([])
    await expect(sp.speichere({ meta: meta('7'), daten: {} })).rejects.toMatchObject({ art: 'revision-fehlt' })
    expect(f.aufrufe).toHaveLength(0)
  })

  it('revisionen, wiederherstellen, veroeffentlichen, export, neo-standard', async () => {
    const { sp, f } = adapter([
      ['GET', `${THEMES}/t1/revisionen`, antwort(200, { revisionen: [{ revision: '8', erstelltAm: '2026-09-30T10:00:00Z' }] })],
      ['POST', `${THEMES}/t1/revisionen/5/wiederherstellen`, antwort(200, dok('9'), { ETag: '"9"' })],
      ['POST', `${THEMES}/t1/veroeffentlichen`, antwort(200, { meta: meta('9', { status: 'veroeffentlicht' }) }, { ETag: '"9"' })],
      ['GET', `${THEMES}/t1/export?format=css`, antwort(200, ':root{}')],
      ['GET', `${BASIS}/neo-standard`, antwort(200, { _meta: { version: '1.0.0' } })],
    ])
    expect((await sp.revisionen('t1'))[0].revision).toBe('8')
    expect((await sp.stelleWiederHer('t1', '5', { etag: '"8"' })).etag).toBe('"9"')
    const v = await sp.veroeffentliche('t1', { etag: '"9"', kontrast: { bestanden: true, ergebnisse: [] } })
    expect(v.meta.status).toBe('veroeffentlicht')
    expect(f.aufrufe.find(a => a.url.endsWith('/veroeffentlichen')).body.kontrast.bestanden).toBe(true)
    expect(await sp.exportiere('t1', 'css')).toBe(':root{}')
    expect((await sp.ladeStandard())._meta.version).toBe('1.0.0')
  })
})

describe('Adapter drupal — Fehler', () => {
  it('412: jemand anderes hat gespeichert -> veraltet, istKonflikt, aktueller ETag', async () => {
    const { sp } = adapter([['PUT', `${THEMES}/t1`, antwort(412, { title: 'Precondition Failed', status: 412, aktuellerEtag: '"9"' }, { ETag: '"9"' })]])
    const e = await sp.speichere({ meta: meta('7'), daten: {}, etag: '"7"' }).catch(x => x)
    expect(e).toBeInstanceOf(SpeicherFehler)
    expect(e).toMatchObject({ art: 'veraltet', status: 412, aktuellEtag: '"9"', istKonflikt: true })
  })

  it('409: Zustandskonflikt -> konflikt, Meldung aus problem+json', async () => {
    const { sp } = adapter([['POST', `${THEMES}/t1/veroeffentlichen`, antwort(409, { title: 'Conflict', detail: 'Nicht die neueste Revision.', status: 409 })]])
    const e = await sp.veroeffentliche('t1', { etag: '"7"', kontrast: {} }).catch(x => x)
    expect(e).toMatchObject({ art: 'konflikt', status: 409, istKonflikt: true, message: 'Nicht die neueste Revision.' })
  })

  it('403: Recht fehlt -> verboten, kein Konflikt', async () => {
    const { sp } = adapter([['PUT', `${THEMES}/t1`, antwort(403, undefined)]])
    const e = await sp.speichere({ meta: meta('7'), daten: {}, etag: '"7"' }).catch(x => x)
    expect(e).toMatchObject({ art: 'verboten', status: 403, istKonflikt: false })
    expect(e.message).toMatch(/Berechtigung/)
  })

  it('Netzwerkfehler -> netzwerk (auch beim CSRF-Token)', async () => {
    const tot = async () => { throw new TypeError('Failed to fetch') }
    const sp = erzeugeDrupalSpeicher({ basisUrl: BASIS, kunde: 'acme', fetch: tot })
    await expect(sp.liste()).rejects.toMatchObject({ art: 'netzwerk' })
    await expect(sp.speichere({ meta: { name: 'x' }, daten: {} })).rejects.toMatchObject({ art: 'netzwerk' })
  })
})

describe('Store mit Drupal-Speicher', () => {
  let store
  beforeEach(() => {
    store = useThemeStore()
    store.state.activeThemeSet = 'customer'
    store.state.currentThemeMeta = null
    store.state.savedThemes = []
  })
  afterEach(() => setzeSpeicher(null))

  function mitServer() {
    let rev = 0
    const f = fetchAttrappe([
      ['GET', '/session/token', antwort(200, 'tok')],
      ['POST', THEMES + '/t1/veroeffentlichen', (a) => antwort(200, { meta: { ...meta(String(rev)), status: 'veroeffentlicht' } }, { ETag: `"${rev}"` })],
      ['POST', THEMES, (a) => { rev++; return antwort(201, { meta: { ...a.body.meta, id: 't1', revision: String(rev) }, daten: a.body.daten }, { ETag: `"${rev}"` }) }],
      ['PUT', `${THEMES}/t1`, (a) => a.headers['If-Match'] !== `"${rev}"`
        ? antwort(412, { status: 412, aktuellerEtag: `"${rev}"` })
        : (rev++, antwort(200, { meta: { ...a.body.meta, revision: String(rev) }, daten: a.body.daten }, { ETag: `"${rev}"` }))],
      ['GET', `${THEMES}/t1`, () => antwort(200, { meta: meta(String(rev)), daten: { primitiveOverrides: { neo: {}, customer: { primary: '#445566' } } } }, { ETag: `"${rev}"` })],
    ])
    setzeSpeicher(erzeugeDrupalSpeicher({ basisUrl: BASIS, kunde: 'acme', fetch: f }))
    return f
  }

  it('speichereTheme legt an, merkt sich den ETag und speichert danach mit If-Match', async () => {
    const f = mitServer()
    const m1 = await store.speichereTheme('ACME', '1.0.0')
    expect(m1).toMatchObject({ id: 't1', etag: '"1"' })
    expect(store.state.savedThemes.map(t => t.id)).toEqual(['t1'])
    const post = f.aufrufe.find(a => a.methode === 'POST')
    expect(post.body.meta.etag).toBeUndefined()
    expect(Object.keys(post.body.daten)).toContain('customMotionTokens')

    await store.speichereTheme()
    expect(store.state.currentThemeMeta.etag).toBe('"2"')
    expect(f.aufrufe.find(a => a.methode === 'PUT').headers['If-Match']).toBe('"1"')
  })

  it('Strg+S (saveToServer) speichert mit Drupal eine Revision statt /api/save-theme', async () => {
    const f = mitServer()
    await store.saveToServer()
    expect(f.aufrufe.some(a => a.url.includes('/api/save-theme'))).toBe(false)
    expect(store.state.currentThemeMeta.etag).toBe('"1"')
  })

  it('Konflikt: veralteter ETag -> Fehler, Meta bleibt unveraendert', async () => {
    mitServer()
    await store.speichereTheme('ACME', '1.0.0')
    store.state.currentThemeMeta.etag = '"0"'   // jemand anderes war schneller
    const e = await store.speichereTheme().catch(x => x)
    expect(e.istKonflikt).toBe(true)
    expect(store.state.currentThemeMeta.etag).toBe('"0"')
  })

  it('oeffneTheme uebernimmt Daten und ETag (ein Undo-Schritt)', async () => {
    mitServer()
    await store.speichereTheme('ACME', '1.0.0')
    const vorher = store.state.history.length
    expect(await store.oeffneTheme('t1')).toBe(true)
    expect(store.state.primitiveOverrides.customer.primary).toBe('#445566')
    expect(store.state.currentThemeMeta.etag).toBe('"1"')
    expect(store.state.history.length).toBe(vorher + 1)
  })

  it('veroeffentlicheTheme: Kontrast-Tor sperrt ohne Serveraufruf, bestanden -> veroeffentlicht', async () => {
    const f = mitServer()
    await store.speichereTheme('ACME', '1.0.0')
    const merk = store.state.themes.customer.light['text-primary']
    store.state.themes.customer.light['text-primary'] = store.state.themes.customer.light['background-base']
    const e = await store.veroeffentlicheTheme().catch(x => x)
    expect(e).toMatchObject({ art: 'ungueltig' })
    expect(e.details.bestanden).toBe(false)
    expect(f.aufrufe.some(a => a.url.endsWith('/veroeffentlichen'))).toBe(false)

    store.state.themes.customer.light['text-primary'] = merk
    // Befund im NEO-Standard (kontrast.test.js): on-danger/on-success hell 3,35:1
    store.state.themes.customer.light['on-danger'] = '#000000'
    store.state.themes.customer.light['on-success'] = '#000000'
    expect(store.pruefeThemeKontrast().bestanden).toBe(true)
    const erg = await store.veroeffentlicheTheme({ notiz: 'Go-live' })
    expect(erg.meta.status).toBe('veroeffentlicht')
    const anfrage = f.aufrufe.find(a => a.url.endsWith('/veroeffentlichen'))
    expect(anfrage.headers['If-Match']).toBe('"1"')
    expect(anfrage.body).toMatchObject({ notiz: 'Go-live', kontrast: { bestanden: true, uebergangen: false } })
  })
})
