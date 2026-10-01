/**
 * Inhalts-Hash = ETag (Plan v2, 2.6 — ADR-002, Folge 1): kanonisches JSON,
 * SHA-256, stabil gegen Schluesselreihenfolge. Pruefvektor fuer den PHP-Server.
 */
import { describe, it, expect, vi, afterEach } from 'vitest'
import { createHash } from 'node:crypto'
import { inhaltsHash, kanonischesJson, alsEtag } from '../../src/speicher/inhalts-hash.js'

afterEach(() => vi.unstubAllGlobals())

describe('kanonischesJson', () => {
  it('sortiert Schluessel rekursiv, Listen behalten ihre Reihenfolge, keine Leerzeichen', () => {
    expect(kanonischesJson({ b: 1, a: { d: [3, 1], c: 'ü/x' } })).toBe('{"a":{"c":"ü/x","d":[3,1]},"b":1}')
    expect(kanonischesJson({ a: undefined, b: null })).toBe('{"b":null}')
    expect(kanonischesJson([])).toBe('[]')
    expect(kanonischesJson({})).toBe('{}')
  })
})

describe('inhaltsHash', () => {
  it('ist stabil gegen Schluesselreihenfolge und aendert sich mit dem Inhalt', async () => {
    const a = await inhaltsHash({ meta: { name: 'ACME', version: '1.0.0' }, abweichungen: { themes: { customer: { light: { x: '#fff', y: '#000' } } } } })
    const b = await inhaltsHash({ abweichungen: { themes: { customer: { light: { y: '#000', x: '#fff' } } } }, meta: { version: '1.0.0', name: 'ACME' } })
    const c = await inhaltsHash({ meta: { name: 'ACME', version: '1.0.1' }, abweichungen: { themes: { customer: { light: { x: '#fff', y: '#000' } } } } })
    expect(a).toMatch(/^[0-9a-f]{64}$/)
    expect(a).toBe(b)
    expect(a).not.toBe(c)
    expect(alsEtag(a)).toBe(`"${a}"`)
  })

  it('Pruefvektor (auch in der OpenAPI-Datei) und Node-Rueckfall ohne crypto.subtle rechnen gleich', async () => {
    const inhalt = { meta: { name: 'Beispiel', version: '1.0.0' }, abweichungen: {} }
    const soll = createHash('sha256').update('{"abweichungen":{},"meta":{"name":"Beispiel","version":"1.0.0"}}').digest('hex')
    expect(await inhaltsHash(inhalt)).toBe(soll)
    expect(soll).toBe('21bd9c5994626d8dce75705b8e20cd10683c9bc3efa98ad7e649ac12eab92a33')
    vi.stubGlobal('crypto', undefined)
    expect(await inhaltsHash(inhalt)).toBe(soll)
  })
})
