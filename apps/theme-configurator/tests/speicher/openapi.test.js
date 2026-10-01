/**
 * OpenAPI-Vertrag docs/api/theme-konfigurator.openapi.yaml (Plan v2, 2.6,
 * Entscheidungen 01.10.2026): gueltiges YAML, Pfade ohne {kunde}, keine
 * Revisionen, If-Match/412/428, Rechte je Operation, ThemeAbweichungen als
 * Teilmenge der THEME_DATA_KEYS, Groessenlimit — und jede URL des
 * Drupal-Adapters steht drin.
 */
import { describe, it, expect, beforeAll } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { leseYamlTeilmenge } from '../helpers/yaml-teilmenge.js'
import { useThemeStore, THEME_DATA_KEYS } from '../../src/stores/theme.js'
import { erzeugeDrupalSpeicher, MAX_ANFRAGE_BYTES } from '../../src/speicher/drupal.js'
import { RECHTE, inhaltsHash } from '../../src/speicher/index.js'
import { abweichungenBerechnen, zusammenfuehren } from '../../src/speicher/abweichungen.js'
import { standardDaten } from '../../src/speicher/standard.js'
import { antwort, fetchAttrappe } from './_hilfen.js'

const DATEI = resolve(__dirname, '../../../../docs/api/theme-konfigurator.openapi.yaml')
const STANDARD = JSON.parse(readFileSync(resolve(__dirname, '../../../../data/neo-theme-defaults/neo-theme-defaults.json'), 'utf8'))
let api

beforeAll(() => { api = leseYamlTeilmenge(readFileSync(DATEI, 'utf8')) })

const ref = (r) => r.replace(/^#\//, '').split('/').reduce((o, k) => o?.[k], api)
const METHODEN = ['get', 'post', 'put', 'delete']
const operationen = () => Object.entries(api.paths).flatMap(([pfad, ops]) => METHODEN.filter(m => ops[m]).map(m => ({ pfad, m, op: ops[m] })))

describe('OpenAPI-Vertrag', () => {
  it('ist gueltiges YAML in OpenAPI 3.1, Version 1.0.0', () => {
    expect(api.openapi).toBe('3.1.0')
    expect(api.info.title).toMatch(/Theme-Konfigurator/)
    expect(api.info.version).toBe('1.0.0')
    expect(api.servers[0].url).toBe('/api/neo-theme-konfigurator/v1')
  })

  it('enthaelt genau die vereinbarten Pfade und Operationen (kein {kunde}, keine Revisionen)', () => {
    const soll = {
      '/neo-standard': ['get'],
      '/themes': ['get', 'post'],
      '/themes/{themeId}': ['get', 'put', 'delete'],
      '/themes/{themeId}/aktivieren': ['post'],
      '/themes/{themeId}/veroeffentlichen': ['post'],
      '/themes/{themeId}/export': ['get'],
    }
    expect(Object.keys(api.paths).sort()).toEqual(Object.keys(soll).sort())
    for (const [pfad, methoden] of Object.entries(soll)) {
      expect(METHODEN.filter(m => api.paths[pfad][m]), pfad).toEqual(methoden)
    }
    const text = readFileSync(DATEI, 'utf8')
    expect(text).not.toMatch(/\{kunde\}|revisionId|RevisionsListe/)
    const ids = operationen().map(o => o.op.operationId)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('jede Operation nennt ihr Recht (x-neo-recht)', () => {
    const soll = {
      'get /neo-standard': 'ansehen', 'get /themes': 'ansehen', 'post /themes': 'bearbeiten',
      'get /themes/{themeId}': 'ansehen', 'put /themes/{themeId}': 'bearbeiten', 'delete /themes/{themeId}': 'bearbeiten',
      'post /themes/{themeId}/aktivieren': 'veroeffentlichen', 'post /themes/{themeId}/veroeffentlichen': 'veroeffentlichen',
      'get /themes/{themeId}/export': 'ansehen',
    }
    for (const { pfad, m, op } of operationen()) {
      expect(RECHTE, `${m} ${pfad}`).toContain(op['x-neo-recht'])
      expect(op['x-neo-recht'], `${m} ${pfad}`).toBe(soll[`${m} ${pfad}`])
    }
  })

  it('alle $ref zeigen auf etwas', () => {
    const refs = []
    const lauf = (o) => { if (o && typeof o === 'object') for (const [k, v] of Object.entries(o)) k === '$ref' ? refs.push(v) : lauf(v) }
    lauf(api)
    expect(refs.length).toBeGreaterThan(40)
    for (const r of refs) expect(ref(r), r).toBeTruthy()
  })

  it('Konflikterkennung: If-Match Pflicht fuer PUT/DELETE/veroeffentlichen, 412/428, ETag = Inhalts-Hash', () => {
    expect(ref('#/components/parameters/IfMatch').required).toBe(true)
    for (const [pfad, m] of [['/themes/{themeId}', 'put'], ['/themes/{themeId}', 'delete'], ['/themes/{themeId}/veroeffentlichen', 'post']]) {
      const op = api.paths[pfad][m]
      expect(op.parameters.map(p => ref(p.$ref).name), `${m} ${pfad}`).toContain('If-Match')
      for (const s of ['412', '428']) expect(op.responses[s], `${m} ${pfad} ${s}`).toBeTruthy()
    }
    expect(api.paths['/themes/{themeId}'].put.responses['200'].headers.ETag).toBeTruthy()
    expect(api.components.headers.ETag.description).toMatch(/SHA-256/)
    expect(api.paths['/themes/{themeId}'].delete.responses['409']).toBeTruthy()
    expect(api.paths['/themes/{themeId}/aktivieren'].post.responses['409']).toBeTruthy()
  })

  it('Pruefvektor des Inhalts-Hashes in der Beschreibung stimmt', async () => {
    const hash = await inhaltsHash({ meta: { name: 'Beispiel', version: '1.0.0' }, abweichungen: {} })
    expect(api.info.description.replace(/\s+/g, '')).toContain(hash)
  })

  it('Veroeffentlichen: Kontrast + CSS im Body, 422 mit Befunden, Antwort mit Pfad/Version', () => {
    const vf = api.paths['/themes/{themeId}/veroeffentlichen'].post
    expect(ref(vf.requestBody.content['application/json'].schema.$ref).required).toEqual(['kontrast', 'css'])
    expect(ref(vf.responses['422'].$ref).content['application/problem+json']).toBeTruthy()
    expect(api.components.schemas.Problem.properties.kontrast).toBeTruthy()
    const antwortSchema = ref(vf.responses['200'].content['application/json'].schema.$ref)
    expect(antwortSchema.properties.css.required).toEqual(['pfad', 'version'])
    expect(api.components.schemas.KontrastErgebnis.properties.uebergangen).toBeUndefined()
  })

  it('Liste mit aktiv; Groessenlimit 1 MB an allen Theme-Koerpern, 413 beschrieben', () => {
    expect(api.components.schemas.ThemeMeta.properties.aktiv.type).toBe('boolean')
    expect(MAX_ANFRAGE_BYTES).toBe(1048576)
    for (const { pfad, m, op } of operationen().filter(o => o.op.requestBody?.required)) {
      expect(op.requestBody['x-neo-max-bytes'], `${m} ${pfad}`).toBe(MAX_ANFRAGE_BYTES)
      expect(op.responses['413'], `${m} ${pfad}`).toBeTruthy()
    }
    expect(api.components.schemas.ThemeAbweichungen['x-neo-max-bytes']).toBe(MAX_ANFRAGE_BYTES)
  })

  it('ThemeAbweichungen ist Teilmenge der THEME_DATA_KEYS (nichts Pflicht), Beispiel rechnet zurueck', () => {
    const s = api.components.schemas.ThemeAbweichungen
    expect(s.required).toBeUndefined()
    expect(s.additionalProperties).toBe(false)
    expect(Object.keys(s.properties).sort()).toEqual([...THEME_DATA_KEYS, 'activeThemeSet'].sort())
    const snap = useThemeStore().snapshotThemeData({ withActiveSet: true })
    expect(Object.keys(snap).sort()).toEqual(Object.keys(s.properties).sort())

    const standard = standardDaten(STANDARD)
    const voll = zusammenfuehren(standard, s.example)
    expect(voll.foundationOverrides.neo).toBeUndefined()
    expect(voll.primitiveOverrides.customer.primary).toBe('#0b5cad')
    expect(abweichungenBerechnen(voll, standard)).toEqual(s.example)
    expect(api.components.schemas.ThemeDokument.required).toEqual(['meta', 'abweichungen'])
  })

  it('jede URL des Drupal-Adapters ist in der OpenAPI-Datei beschrieben', async () => {
    const vorlagen = operationen().map(({ pfad, m }) => ({
      methode: m.toUpperCase(),
      re: new RegExp('^' + api.servers[0].url + pfad.replace(/\{[^}]+\}/g, '[^/?]+') + '(\\?.*)?$'),
    }))
    const dok = { meta: { id: 't1', hash: 'h' }, abweichungen: {} }
    const f = fetchAttrappe([
      ['GET', '/session/token', antwort(200, 'tok')],
      ['GET', '/export', antwort(200, ':root{}')],
      ['GET', '/neo-standard', antwort(200, STANDARD)],
      ['GET', '/themes/', antwort(200, dok, { ETag: '"h"' })],
      ['GET', '/themes', antwort(200, { themes: [] })],
      ['POST', '/aktivieren', antwort(200, { themes: [] })],
      ['POST', '/veroeffentlichen', antwort(200, { meta: { id: 't1' }, css: { pfad: 'p', version: '1' } })],
      ['POST', '/themes', antwort(201, dok)],
      ['PUT', '/themes/', antwort(200, dok)],
      ['DELETE', '/themes/', antwort(204)],
    ])
    const sp = erzeugeDrupalSpeicher({ basisUrl: api.servers[0].url, fetch: f })
    await sp.liste()
    await sp.lade('t1')
    await sp.speichere({ meta: { name: 'x' }, daten: {} })
    await sp.speichere({ meta: { id: 't1', name: 'x' }, daten: {}, etag: '"h"' })
    await sp.loesche('t1', { etag: '"h"' })
    await sp.aktiviere('t1')
    await sp.veroeffentliche('t1', { etag: '"h"', kontrast: { bestanden: true }, css: ':root{}' })
    await sp.exportiere('t1', 'abweichungen')
    await sp.ladeStandard()

    const anfragen = f.aufrufe.filter(a => a.url !== '/session/token')
    expect(anfragen).toHaveLength(9)   // /neo-standard nur einmal (Cache)
    for (const a of anfragen) {
      expect(vorlagen.some(v => v.methode === a.methode && v.re.test(a.url)), `${a.methode} ${a.url}`).toBe(true)
    }
    const exp = api.paths['/themes/{themeId}/export'].get.parameters.find(p => p.name === 'format')
    expect(exp.schema.enum).toEqual(['css', 'abweichungen'])
  })
})
