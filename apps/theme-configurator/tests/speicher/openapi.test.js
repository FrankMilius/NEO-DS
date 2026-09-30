/**
 * OpenAPI-Entwurf docs/api/theme-konfigurator.openapi.yaml (Plan v2, 2.6):
 * gueltiges YAML, alle Pfade da, Schemas passen zur App (THEME_DATA_KEYS,
 * exportAsJSON, Import-Pruefung) und jede URL des Drupal-Adapters steht drin.
 */
import { describe, it, expect, beforeAll } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { leseYamlTeilmenge } from '../helpers/yaml-teilmenge.js'
import { useThemeStore, THEME_DATA_KEYS } from '../../src/stores/theme.js'
import { pruefeThemeImport } from '../../src/import/theme-import.js'
import { erzeugeDrupalSpeicher } from '../../src/speicher/drupal.js'
import { antwort, fetchAttrappe } from './_hilfen.js'

const DATEI = resolve(__dirname, '../../../../docs/api/theme-konfigurator.openapi.yaml')
let api

beforeAll(() => { api = leseYamlTeilmenge(readFileSync(DATEI, 'utf8')) })

const ref = (r) => r.replace(/^#\//, '').split('/').reduce((o, k) => o?.[k], api)

describe('OpenAPI-Entwurf', () => {
  it('ist gueltiges YAML in OpenAPI 3.1', () => {
    expect(api.openapi).toBe('3.1.0')
    expect(api.info.title).toMatch(/Theme-Konfigurator/)
    expect(api.servers[0].url).toBe('/api/neo-theme-konfigurator/v1')
  })

  it('enthaelt die vereinbarten Pfade und Operationen', () => {
    const soll = {
      '/neo-standard': ['get'],
      '/kunden/{kunde}/themes': ['get', 'post'],
      '/kunden/{kunde}/themes/{themeId}': ['get', 'put', 'delete'],
      '/kunden/{kunde}/themes/{themeId}/revisionen': ['get'],
      '/kunden/{kunde}/themes/{themeId}/revisionen/{revisionId}': ['get'],
      '/kunden/{kunde}/themes/{themeId}/revisionen/{revisionId}/wiederherstellen': ['post'],
      '/kunden/{kunde}/themes/{themeId}/veroeffentlichen': ['post'],
      '/kunden/{kunde}/themes/{themeId}/export': ['get'],
    }
    for (const [pfad, methoden] of Object.entries(soll)) {
      expect(api.paths[pfad], pfad).toBeTruthy()
      for (const m of methoden) expect(api.paths[pfad][m]?.operationId, `${m} ${pfad}`).toBeTruthy()
    }
    const ids = Object.values(api.paths).flatMap(p => ['get', 'post', 'put', 'delete'].filter(m => p[m]).map(m => p[m].operationId))
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('alle $ref zeigen auf etwas', () => {
    const refs = []
    const lauf = (o) => { if (o && typeof o === 'object') for (const [k, v] of Object.entries(o)) k === '$ref' ? refs.push(v) : lauf(v) }
    lauf(api)
    expect(refs.length).toBeGreaterThan(40)
    for (const r of refs) expect(ref(r), r).toBeTruthy()
  })

  it('Speichern: If-Match Pflicht, 409/412/428 beschrieben, ETag in der Antwort', () => {
    const put = api.paths['/kunden/{kunde}/themes/{themeId}'].put
    expect(put.parameters.map(p => ref(p.$ref).name)).toContain('If-Match')
    expect(ref('#/components/parameters/IfMatch').required).toBe(true)
    for (const s of ['409', '412', '428']) expect(put.responses[s], s).toBeTruthy()
    expect(put.responses['200'].headers.ETag).toBeTruthy()
    const vf = api.paths['/kunden/{kunde}/themes/{themeId}/veroeffentlichen'].post
    expect(ref(vf.requestBody.content['application/json'].schema.$ref).required).toContain('kontrast')
    expect(vf.responses['422']).toBeTruthy()
  })

  it('ThemeDaten entspricht THEME_DATA_KEYS (Speicherformat = App-Schnappschuss)', () => {
    const s = api.components.schemas.ThemeDaten
    expect(s.required).toEqual(THEME_DATA_KEYS)
    expect(Object.keys(s.properties).sort()).toEqual([...THEME_DATA_KEYS, 'activeThemeSet'].sort())
    const snap = useThemeStore().snapshotThemeData({ withActiveSet: true })
    expect(Object.keys(snap).sort()).toEqual(Object.keys(s.properties).sort())
  })

  it('Beispiel ThemeExportJson hat die Struktur von exportAsJSON() und besteht die Import-Pruefung', () => {
    const store = useThemeStore()
    store.state.activeThemeSet = 'customer'
    store.updateComponentToken('nc-button-accent-bg', '#0b5cad')
    const echt = JSON.parse(store.exportAsJSON())
    const bsp = api.components.schemas.ThemeExportJson.example
    const schema = api.components.schemas.ThemeExportJson

    expect(Object.keys(bsp)).toEqual(Object.keys(echt))
    expect(Object.keys(schema.properties)).toEqual(Object.keys(echt))
    expect(schema.required.sort()).toEqual(Object.keys(echt).sort())
    expect(Object.keys(bsp.meta)).toEqual(Object.keys(echt.meta))
    expect(Object.keys(schema.properties.meta.properties)).toEqual(Object.keys(echt.meta))
    expect(Object.keys(bsp.semantic)).toEqual(Object.keys(echt.semantic))
    expect(Object.keys(bsp.components.button)).toEqual(Object.keys(echt.components.button))
    expect(Object.keys(bsp.primitives).sort()).toEqual(Object.keys(echt.primitives).sort())
    expect(schema.properties.focusRingMode.enum).toContain(echt.focusRingMode)

    const pruefung = pruefeThemeImport(JSON.stringify(bsp))
    expect(pruefung.fehler).toEqual([])
    expect(pruefung.ok).toBe(true)
  })

  it('jede URL des Drupal-Adapters ist in der OpenAPI-Datei beschrieben', async () => {
    const vorlagen = Object.entries(api.paths).flatMap(([pfad, ops]) =>
      ['get', 'post', 'put', 'delete'].filter(m => ops[m]).map(m => ({
        methode: m.toUpperCase(),
        re: new RegExp('^' + api.servers[0].url + pfad.replace(/\{[^}]+\}/g, '[^/?]+') + '(\\?.*)?$'),
      })))
    const f = fetchAttrappe([
      ['GET', '/session/token', antwort(200, 'tok')],
      ['GET', '/revisionen', antwort(200, { revisionen: [] })],
      ['GET', '/export', antwort(200, ':root{}')],
      ['GET', '/neo-standard', antwort(200, {})],
      ['GET', '/themes/', antwort(200, { meta: { id: 't1' }, daten: {} }, { ETag: '"1"' })],
      ['GET', '/themes', antwort(200, { themes: [] })],
      ['POST', '/wiederherstellen', antwort(200, { meta: { id: 't1' }, daten: {} })],
      ['POST', '/veroeffentlichen', antwort(200, { meta: { id: 't1' } })],
      ['POST', '/themes', antwort(201, { meta: { id: 't1' }, daten: {} })],
      ['PUT', '/themes/', antwort(200, { meta: { id: 't1' }, daten: {} })],
      ['DELETE', '/themes/', antwort(204)],
    ])
    const sp = erzeugeDrupalSpeicher({ basisUrl: api.servers[0].url, kunde: 'acme', fetch: f })
    await sp.liste()
    await sp.lade('t1')
    await sp.speichere({ meta: { name: 'x' }, daten: {} })
    await sp.speichere({ meta: { id: 't1', name: 'x' }, daten: {}, etag: '"1"' })
    await sp.loesche('t1', { etag: '"1"' })
    await sp.revisionen('t1')
    await sp.stelleWiederHer('t1', 'r5', { etag: '"1"' })
    await sp.veroeffentliche('t1', { etag: '"1"', kontrast: { bestanden: true } })
    await sp.exportiere('t1', 'dtcg')
    await sp.ladeStandard()

    const anfragen = f.aufrufe.filter(a => a.url !== '/session/token')
    expect(anfragen).toHaveLength(10)
    for (const a of anfragen) {
      expect(vorlagen.some(v => v.methode === a.methode && v.re.test(a.url)), `${a.methode} ${a.url}`).toBe(true)
    }
  })
})
