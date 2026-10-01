/**
 * Speicher-Adapter "drupal" (Plan v2, 2.6) gegen ein gefaelschtes fetch —
 * Vertrag nach den Entscheidungen vom 01.10.2026 (ADR-002): kein {kunde},
 * Liste mit `aktiv`, aktivieren, PUT mit If-Match (Inhalts-Hash), nur
 * Abweichungen vom NEO-Standard, 412/428/409/403/422/413, Rechte — und die
 * Store-Aktionen, die ihn benutzen.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { useThemeStore } from '../../src/stores/theme.js'
import { erzeugeDrupalSpeicher, MAX_ANFRAGE_BYTES } from '../../src/speicher/drupal.js'
import { setzeSpeicher, SpeicherFehler, darf, inhaltsHash } from '../../src/speicher/index.js'
import { standardDaten } from '../../src/speicher/standard.js'
import { zusammenfuehren } from '../../src/speicher/abweichungen.js'
import { antwort, fetchAttrappe } from './_hilfen.js'

const STANDARD = JSON.parse(readFileSync(resolve(__dirname, '../../../../data/neo-theme-defaults/neo-theme-defaults.json'), 'utf8'))
const BASIS = '/api/neo-theme-konfigurator/v1'
const THEMES = `${BASIS}/themes`
const ALLE = ['ansehen', 'bearbeiten', 'veroeffentlichen']
const meta = (hash, extra = {}) => ({ id: 't1', name: 'ACME', version: '1.0.0', hash, status: 'entwurf', aktiv: false, ...extra })
const dok = (hash, abweichungen = {}) => ({ meta: meta(hash), abweichungen, standardVersion: '1.0.0' })
const standardRegel = ['GET', `${BASIS}/neo-standard`, antwort(200, STANDARD)]

function adapter(regeln, extra = {}) {
  const f = fetchAttrappe([['GET', '/session/token', antwort(200, 'tok-123')], standardRegel, ...regeln])
  return { sp: erzeugeDrupalSpeicher({ basisUrl: BASIS + '/', fetch: f, rechte: ALLE, ...extra }), f }
}

describe('Adapter drupal — Vertrag', () => {
  it('liste: GET /themes (ohne Kunde) mit `aktiv`, ohne CSRF, mit Sitzungscookie', async () => {
    const { sp, f } = adapter([['GET', THEMES, antwort(200, { themes: [meta('a', { aktiv: true }), { ...meta('b'), id: 't2' }] })]])
    const liste = await sp.liste()
    expect(liste.map(t => [t.id, t.aktiv])).toEqual([['t1', true], ['t2', false]])
    expect(f.aufrufe[0]).toMatchObject({ url: THEMES, methode: 'GET', credentials: 'same-origin' })
    expect(f.aufrufe[0].headers['X-CSRF-Token']).toBeUndefined()
    expect(f.aufrufe[0].url).not.toMatch(/kunden/)
  })

  it('lade: Abweichungen + aktueller Standard = App-Stand; ETag; 404 -> null; Standard nur einmal geladen', async () => {
    const abw = { primitiveOverrides: { customer: { primary: '#0b5cad' } } }
    const { sp, f } = adapter([
      ['GET', `${THEMES}/t1`, antwort(200, dok('h1', abw), { ETag: '"h1"' })],
      ['GET', `${THEMES}/fehlt`, antwort(404, { title: 'Not Found', status: 404 })],
    ])
    const erg = await sp.lade('t1')
    expect(erg.etag).toBe('"h1"')
    expect(erg.abweichungen).toEqual(abw)
    expect(erg.daten).toEqual(zusammenfuehren(standardDaten(STANDARD), abw))
    expect(erg.daten.primitiveOverrides.customer.primary).toBe('#0b5cad')
    expect(erg.daten.themes.customer.light['text-primary']).toBe(STANDARD.themes.customer.light['text-primary'])
    expect(await sp.lade('fehlt')).toBeNull()
    await sp.lade('t1')
    expect(f.aufrufe.filter(a => a.url.endsWith('/neo-standard'))).toHaveLength(1)
  })

  it('speichere neu: POST mit CSRF (einmal geholt), sendet nur Abweichungen + Standard-Version', async () => {
    const { sp, f } = adapter([
      ['POST', THEMES, (a) => antwort(201, { meta: { ...a.body.meta, id: 't1', hash: 'h1' }, abweichungen: a.body.abweichungen }, { ETag: '"h1"' })],
    ])
    const stand = standardDaten(STANDARD)
    stand.themes.customer.light['text-link'] = '#0b5cad'
    const erg = await sp.speichere({ meta: { name: 'ACME', version: '1.0.0', createdAt: 'x' }, daten: stand })
    await sp.speichere({ meta: { name: 'ACME 2', version: '1.0.0' }, daten: stand })
    expect(erg).toMatchObject({ etag: '"h1"', meta: { id: 't1' } })
    expect(erg.daten).toEqual(stand)
    expect(f.aufrufe.filter(a => a.url === '/session/token')).toHaveLength(1)
    const post = f.aufrufe.find(a => a.methode === 'POST')
    expect(post.headers['X-CSRF-Token']).toBe('tok-123')
    expect(post.headers['If-Match']).toBeUndefined()
    expect(post.body).toEqual({
      meta: { name: 'ACME', version: '1.0.0' },
      abweichungen: { themes: { customer: { light: { 'text-link': '#0b5cad' } } } },
      standardVersion: STANDARD._meta.version,
    })
  })

  it('speichere vorhanden: PUT mit If-Match = Inhalts-Hash; festes csrfToken ohne Abruf', async () => {
    const { sp, f } = adapter([['PUT', `${THEMES}/t1`, antwort(200, dok('h2'), { ETag: '"h2"' })]], { csrfToken: 'fest' })
    const erg = await sp.speichere({ meta: meta('h1'), daten: standardDaten(STANDARD), etag: '"h1"' })
    expect(erg.etag).toBe('"h2"')
    const put = f.aufrufe.find(a => a.methode === 'PUT')
    expect(put.url).toBe(`${THEMES}/t1`)
    expect(put.headers).toMatchObject({ 'If-Match': '"h1"', 'X-CSRF-Token': 'fest', 'Content-Type': 'application/json' })
    expect(put.body).toMatchObject({ meta: { id: 't1', name: 'ACME', version: '1.0.0' }, abweichungen: {} })
    expect(f.aufrufe.some(a => a.url === '/session/token')).toBe(false)
  })

  it('vorhandenes Theme ohne ETag wird nicht blind ueberschrieben (kein Aufruf)', async () => {
    const { sp, f } = adapter([])
    await expect(sp.speichere({ meta: meta('h1'), daten: {} })).rejects.toMatchObject({ art: 'revision-fehlt' })
    expect(f.aufrufe).toHaveLength(0)
  })

  it('aktivieren: POST …/aktivieren mit CSRF, liefert die neue Liste (genau eines aktiv)', async () => {
    const { sp, f } = adapter([['POST', `${THEMES}/t2/aktivieren`, antwort(200, { themes: [meta('a'), { ...meta('b', { aktiv: true }), id: 't2' }] })]])
    const liste = await sp.aktiviere('t2')
    expect(liste.filter(t => t.aktiv).map(t => t.id)).toEqual(['t2'])
    expect(f.aufrufe.find(a => a.methode === 'POST').headers['X-CSRF-Token']).toBe('tok-123')
  })

  it('veroeffentlichen: If-Match, Kontrast + CSS im Body, Antwort mit Pfad/Version der CSS-Datei', async () => {
    const css = { pfad: 'public://neo-theme/theme.css', url: '/sites/default/files/neo-theme/theme.css?v=3', version: '3', hash: 'c0ffee', ausgeliefert: true }
    const { sp, f } = adapter([['POST', `${THEMES}/t1/veroeffentlichen`, antwort(200, { meta: meta('h1', { status: 'veroeffentlicht' }), css }, { ETag: '"h1"' })]])
    const v = await sp.veroeffentliche('t1', { etag: '"h1"', kontrast: { bestanden: true, ergebnisse: [] }, css: ':root{--x:1}', notiz: 'Go-live' })
    expect(v).toMatchObject({ meta: { status: 'veroeffentlicht' }, css, etag: '"h1"' })
    const a = f.aufrufe.find(x => x.url.endsWith('/veroeffentlichen'))
    expect(a.headers['If-Match']).toBe('"h1"')
    expect(a.body).toEqual({ kontrast: { bestanden: true, ergebnisse: [] }, css: ':root{--x:1}', notiz: 'Go-live' })
    await expect(sp.veroeffentliche('t1', { etag: '"h1"', kontrast: {} })).rejects.toMatchObject({ art: 'ungueltig' })
  })

  it('export (css | abweichungen) und neo-standard', async () => {
    const { sp } = adapter([['GET', `${THEMES}/t1/export?format=css`, antwort(200, ':root{}')]])
    expect(await sp.exportiere('t1', 'css')).toBe(':root{}')
    expect((await sp.ladeStandard())._meta.version).toBe(STANDARD._meta.version)
  })

  it('Anfragen ueber 1 MB werden nicht gesendet (zu-gross)', async () => {
    const { sp, f } = adapter([])
    const e = await sp.veroeffentliche('t1', { etag: '"h1"', kontrast: {}, css: 'x'.repeat(MAX_ANFRAGE_BYTES) }).catch(x => x)
    expect(e).toMatchObject({ art: 'zu-gross', status: 413 })
    expect(f.aufrufe.some(a => a.url.endsWith('/veroeffentlichen'))).toBe(false)
  })

  it('Rechte: ohne Angabe nur ansehen; unbekannte Rechte werden verworfen; darf()', () => {
    const ohne = erzeugeDrupalSpeicher({ basisUrl: BASIS })
    expect(ohne.rechte).toEqual(['ansehen'])
    expect(darf('bearbeiten', ohne)).toBe(false)
    const mit = erzeugeDrupalSpeicher({ basisUrl: BASIS, rechte: ['bearbeiten', 'ansehen', 'kontrast-uebergehen'] })
    expect(mit.rechte).toEqual(['ansehen', 'bearbeiten'])
    expect(darf('bearbeiten', mit)).toBe(true)
    expect(darf('veroeffentlichen', mit)).toBe(false)
    expect(darf('kontrast-uebergehen', mit)).toBe(false)
  })
})

describe('Adapter drupal — Fehler', () => {
  it('412: jemand anderes hat gespeichert -> veraltet, istKonflikt, aktueller ETag', async () => {
    const { sp } = adapter([['PUT', `${THEMES}/t1`, antwort(412, { title: 'Precondition Failed', status: 412, aktuellerEtag: '"h9"' }, { ETag: '"h9"' })]])
    const e = await sp.speichere({ meta: meta('h1'), daten: {}, etag: '"h1"' }).catch(x => x)
    expect(e).toBeInstanceOf(SpeicherFehler)
    expect(e).toMatchObject({ art: 'veraltet', status: 412, aktuellEtag: '"h9"', istKonflikt: true })
  })

  it('428: If-Match fehlt (Server) -> revision-fehlt', async () => {
    const { sp } = adapter([['DELETE', `${THEMES}/t1`, antwort(428, { title: 'Precondition Required', status: 428 })]])
    await expect(sp.loesche('t1')).rejects.toMatchObject({ art: 'revision-fehlt', status: 428, istKonflikt: false })
  })

  it('409: Zustandskonflikt -> konflikt, Meldung aus problem+json', async () => {
    const { sp } = adapter([['POST', `${THEMES}/t1/aktivieren`, antwort(409, { title: 'Conflict', detail: 'Nur veröffentlichte Themes können aktiviert werden.', status: 409 })]])
    const e = await sp.aktiviere('t1').catch(x => x)
    expect(e).toMatchObject({ art: 'konflikt', status: 409, istKonflikt: true, message: 'Nur veröffentlichte Themes können aktiviert werden.' })
  })

  it('422: Server-Kontrastpruefung lehnt ab -> ungueltig, Befunde in details.kontrast', async () => {
    const kontrast = { bestanden: false, ergebnisse: [{ modus: 'light', vordergrund: 'on-danger', hintergrund: 'feedback-danger', verhaeltnis: 3.35, mindestens: 4.5, bestanden: false }] }
    const { sp } = adapter([['POST', `${THEMES}/t1/veroeffentlichen`, antwort(422, { title: 'Kontrast nicht bestanden', status: 422, fehler: ['light: on-danger/feedback-danger 3.35 < 4.5'], kontrast })]])
    const e = await sp.veroeffentliche('t1', { etag: '"h1"', kontrast: { bestanden: true }, css: ':root{}' }).catch(x => x)
    expect(e).toMatchObject({ art: 'ungueltig', status: 422, istKonflikt: false, message: 'Kontrast nicht bestanden' })
    expect(e.details.kontrast.ergebnisse[0].vordergrund).toBe('on-danger')
  })

  it('403: Recht fehlt -> verboten, kein Konflikt', async () => {
    const { sp } = adapter([['PUT', `${THEMES}/t1`, antwort(403, undefined)]])
    const e = await sp.speichere({ meta: meta('h1'), daten: {}, etag: '"h1"' }).catch(x => x)
    expect(e).toMatchObject({ art: 'verboten', status: 403, istKonflikt: false })
    expect(e.message).toMatch(/Berechtigung/)
  })

  it('413 vom Server -> zu-gross', async () => {
    const { sp } = adapter([['PUT', `${THEMES}/t1`, antwort(413, { status: 413, title: 'Payload Too Large' })]])
    await expect(sp.speichere({ meta: meta('h1'), daten: {}, etag: '"h1"' })).rejects.toMatchObject({ art: 'zu-gross' })
  })

  it('Netzwerkfehler -> netzwerk (auch beim CSRF-Token)', async () => {
    const tot = async () => { throw new TypeError('Failed to fetch') }
    const sp = erzeugeDrupalSpeicher({ basisUrl: BASIS, fetch: tot })
    await expect(sp.liste()).rejects.toMatchObject({ art: 'netzwerk' })
    await expect(sp.aktiviere('t1')).rejects.toMatchObject({ art: 'netzwerk' })
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

  /** Kleiner Server: haelt { meta, abweichungen }, ETag = Inhalts-Hash. */
  function mitServer({ rechte = ALLE } = {}) {
    const server = { dok: null, hash: null, aktiv: null }
    const etag = () => `"${server.hash}"`
    async function ablegen(body) {
      const neu = server.dok === null
      server.dok = { meta: { ...body.meta, id: 't1' }, abweichungen: body.abweichungen }
      server.hash = await inhaltsHash({ meta: { name: body.meta.name, version: body.meta.version }, abweichungen: body.abweichungen })
      return antwort(neu ? 201 : 200, { ...server.dok, meta: { ...server.dok.meta, hash: server.hash } }, { ETag: etag() })
    }
    const f = fetchAttrappe([
      ['GET', '/session/token', antwort(200, 'tok')],
      standardRegel,
      ['POST', `${THEMES}/t1/veroeffentlichen`, (a) => a.headers['If-Match'] !== etag()
        ? antwort(412, { status: 412, aktuellerEtag: etag() })
        : antwort(200, { meta: { ...server.dok.meta, hash: server.hash, status: 'veroeffentlicht' }, css: { pfad: 'public://neo-theme/theme.css', version: '1', hash: 'x', ausgeliefert: false } }, { ETag: etag() })],
      ['POST', `${THEMES}/t1/aktivieren`, () => { server.aktiv = 't1'; return antwort(200, { themes: [{ ...server.dok.meta, aktiv: true }] }) }],
      ['POST', THEMES, (a) => ablegen(a.body)],
      ['PUT', `${THEMES}/t1`, (a) => a.headers['If-Match'] !== etag() ? antwort(412, { status: 412, aktuellerEtag: etag() }) : ablegen(a.body)],
      ['GET', `${THEMES}/t1`, () => antwort(200, { ...server.dok, meta: { ...server.dok.meta, hash: server.hash } }, { ETag: etag() })],
    ])
    setzeSpeicher(erzeugeDrupalSpeicher({ basisUrl: BASIS, fetch: f, rechte }))
    return { f, server }
  }

  it('speichereTheme legt an (nur Abweichungen), merkt sich den ETag und speichert danach mit If-Match', async () => {
    const { f, server } = mitServer()
    const m1 = await store.speichereTheme('ACME', '1.0.0')
    expect(m1).toMatchObject({ id: 't1', etag: `"${server.hash}"` })
    expect(store.state.savedThemes.map(t => t.id)).toEqual(['t1'])
    const post = f.aufrufe.find(a => a.methode === 'POST')
    expect(post.body.meta.etag).toBeUndefined()
    expect(Object.keys(post.body)).toEqual(['meta', 'abweichungen', 'standardVersion'])
    expect(JSON.stringify(post.body).length).toBeLessThan(JSON.stringify(store.snapshotThemeData()).length)

    const ersterEtag = store.state.currentThemeMeta.etag
    store.updatePrimitive('primary', '#0b5cad')
    await store.speichereTheme()
    expect(f.aufrufe.find(a => a.methode === 'PUT').headers['If-Match']).toBe(ersterEtag)
    expect(server.dok.abweichungen.primitiveOverrides.customer.primary).toBe('#0b5cad')
    expect(store.state.currentThemeMeta.etag).not.toBe(ersterEtag)
  })

  it('Strg+S (saveToServer) speichert mit Drupal statt /api/save-theme', async () => {
    const { f } = mitServer()
    await store.saveToServer()
    expect(f.aufrufe.some(a => a.url.includes('/api/save-theme'))).toBe(false)
    expect(store.state.currentThemeMeta.etag).toMatch(/^"[0-9a-f]{64}"$/)
  })

  it('Konflikt: veralteter ETag -> Fehler (412), Meta bleibt unveraendert', async () => {
    mitServer()
    await store.speichereTheme('ACME', '1.0.0')
    store.state.currentThemeMeta.etag = '"alt"'   // jemand anderes war schneller
    const e = await store.speichereTheme().catch(x => x)
    expect(e).toMatchObject({ art: 'veraltet', istKonflikt: true })
    expect(store.state.currentThemeMeta.etag).toBe('"alt"')
  })

  it('ohne Recht „bearbeiten“: Speichern scheitert ohne Serveraufruf', async () => {
    const { f } = mitServer({ rechte: ['ansehen'] })
    await expect(store.speichereTheme('ACME', '1.0.0')).rejects.toMatchObject({ art: 'verboten' })
    expect(f.aufrufe.some(a => a.methode !== 'GET')).toBe(false)
  })

  it('oeffneTheme fuehrt Abweichungen mit dem Standard zusammen (ein Undo-Schritt)', async () => {
    const { server } = mitServer()
    await store.speichereTheme('ACME', '1.0.0')
    server.dok.abweichungen = { primitiveOverrides: { customer: { primary: '#445566' } } }
    const vorher = store.state.history.length
    // ausserhalb des Zusammenfassungsfensters (HISTORY_COALESCE_MS) frueherer Tests
    const jetzt = vi.spyOn(Date, 'now').mockReturnValue(Date.now() + 60_000)
    expect(await store.oeffneTheme('t1')).toBe(true)
    jetzt.mockRestore()
    expect(store.state.primitiveOverrides.customer.primary).toBe('#445566')
    expect(store.state.primitiveOverrides.neo.primary).toBe(STANDARD.primitiveOverrides.neo.primary)
    expect(store.state.currentThemeMeta.etag).toBe(`"${server.hash}"`)
    expect(store.state.history.length).toBe(vorher + 1)
  })

  it('veroeffentlicheTheme: Kontrast-Tor sperrt ohne Serveraufruf; bestanden -> CSS + Kontrast gesendet', async () => {
    const { f } = mitServer()
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
    await store.speichereTheme()
    const erg = await store.veroeffentlicheTheme({ notiz: 'Go-live' })
    expect(erg.meta.status).toBe('veroeffentlicht')
    expect(erg.css.pfad).toBe('public://neo-theme/theme.css')
    const anfrage = f.aufrufe.find(a => a.url.endsWith('/veroeffentlichen'))
    expect(anfrage.headers['If-Match']).toBe(store.state.currentThemeMeta.etag)
    expect(anfrage.body).toMatchObject({ notiz: 'Go-live', kontrast: { bestanden: true } })
    expect(anfrage.body.kontrast.uebergangen).toBeUndefined()
    expect(anfrage.body.css).toMatch(/--/)
    const ohneZeit = (css) => css.replace(/\/\* Generated: .*\*\//, '')
    expect(ohneZeit(anfrage.body.css)).toBe(ohneZeit(store.exportAsCSSVars()))
  })

  it('ohne Recht „veroeffentlichen“: Veroeffentlichen und Aktivieren scheitern ohne Serveraufruf', async () => {
    const { f } = mitServer({ rechte: ['ansehen', 'bearbeiten'] })
    await store.speichereTheme('ACME', '1.0.0')
    await expect(store.veroeffentlicheTheme()).rejects.toMatchObject({ art: 'verboten' })
    await expect(store.aktiviereTheme('t1')).rejects.toMatchObject({ art: 'verboten' })
    expect(f.aufrufe.some(a => /veroeffentlichen|aktivieren/.test(a.url))).toBe(false)
  })

  it('aktiviereTheme setzt den Katalog mit `aktiv`', async () => {
    mitServer()
    await store.speichereTheme('ACME', '1.0.0')
    const liste = await store.aktiviereTheme()
    expect(liste).toHaveLength(1)
    expect(store.state.savedThemes[0]).toMatchObject({ id: 't1', aktiv: true })
  })
})
