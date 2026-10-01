/**
 * Speicher-Adapter "lokal" (Plan v2, 2.6): verhaelt sich wie vor der
 * Abstraktion — gleiche localStorage-Schluessel, gleiche Formate, gleiche
 * Endpunkte des Docs-Servers.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { useThemeStore } from '../../src/stores/theme.js'
import { SAVED_THEMES_KEY } from '../../src/stores/theme/kern.js'
import { STORAGE_KEY } from '../../src/stores/theme/persistenz.js'
import { LOKALE_SCHLUESSEL, erzeugeLokalenSpeicher } from '../../src/speicher/lokal.js'
import { darf, erzeugeSpeicher, leseKonfiguration, setzeSpeicher, speicher, SpeicherFehler } from '../../src/speicher/index.js'
import { antwort, fetchAttrappe } from './_hilfen.js'

let store
beforeEach(() => {
  setzeSpeicher(null)
  store = useThemeStore()
  store.state.activeThemeSet = 'neo'
  store.state.currentThemeMeta = null
  store.state.savedThemes = []
})
afterEach(() => {
  vi.unstubAllGlobals()
  setzeSpeicher(null)
})

describe('Konfiguration', () => {
  it('Standard ist lokal', () => {
    expect(leseKonfiguration(undefined, {}).speicher).toBe('lokal')
    expect(speicher().art).toBe('lokal')
  })

  it('window.NEO_KONFIGURATOR gewinnt vor import.meta.env', () => {
    const k = leseKonfiguration({ speicher: 'drupal', basisUrl: '/api/x' }, { VITE_NEO_SPEICHER: 'lokal', VITE_NEO_CSRF_TOKEN_URL: '/token' })
    expect(k).toMatchObject({ speicher: 'drupal', basisUrl: '/api/x', csrfTokenUrl: '/token' })
    expect(k.kunde).toBeUndefined()
  })

  it('Rechte aus window.NEO_KONFIGURATOR oder VITE_NEO_RECHTE (kommagetrennt)', () => {
    expect(leseKonfiguration(undefined, { VITE_NEO_RECHTE: 'ansehen, bearbeiten' }).rechte).toEqual(['ansehen', 'bearbeiten'])
    expect(leseKonfiguration({ rechte: ['ansehen'] }, { VITE_NEO_RECHTE: 'ansehen,bearbeiten' }).rechte).toEqual(['ansehen'])
    expect(leseKonfiguration(undefined, {}).rechte).toBeUndefined()
  })

  it('lokal hat alle Rechte; Branches/Releases nur lokal', () => {
    expect(speicher().rechte).toEqual(['ansehen', 'bearbeiten', 'veroeffentlichen'])
    for (const r of ['ansehen', 'bearbeiten', 'veroeffentlichen']) expect(darf(r), r).toBe(true)
    expect(darf('kontrast-uebergehen')).toBe(false)
    expect(speicher().faehigkeiten.branchesUndReleases).toBe(true)
    expect(erzeugeSpeicher({ speicher: 'drupal', basisUrl: '/api' }).faehigkeiten.branchesUndReleases).toBe(false)
  })

  it('unbekannte Art und unvollstaendige Drupal-Konfiguration werden abgelehnt', () => {
    expect(() => erzeugeSpeicher({ speicher: 'ftp' })).toThrow(SpeicherFehler)
    expect(() => erzeugeSpeicher({ speicher: 'drupal' })).toThrow(/basisUrl/)
    expect(erzeugeSpeicher({ speicher: 'drupal', basisUrl: '/api' }).art).toBe('drupal')   // kein `kunde` noetig
  })
})

describe('Adapter lokal — gleiche Schluessel und Formate wie bisher', () => {
  it('Schluessel stimmen mit Store-Konstanten ueberein', () => {
    expect(LOKALE_SCHLUESSEL.arbeitsstand).toBe('neo-theme-configurator')
    expect(STORAGE_KEY).toBe(LOKALE_SCHLUESSEL.arbeitsstand)
    expect(SAVED_THEMES_KEY).toBe(LOKALE_SCHLUESSEL.katalog)
  })

  it('createTheme schreibt neo-theme-{id} und den Katalog; der Adapter liest beides', async () => {
    store.updatePrimitive('primary', '#123456')
    const meta = store.createTheme('Kunde A', '1.2.0')
    expect(JSON.parse(localStorage.getItem(`neo-theme-${meta.id}`)).meta.name).toBe('Kunde A')
    expect(JSON.parse(localStorage.getItem('neo-theme-configurator-saved-themes'))[0].id).toBe(meta.id)

    const sp = erzeugeLokalenSpeicher()
    expect((await sp.liste()).map(t => t.id)).toEqual([meta.id])
    const geladen = await sp.lade(meta.id)
    expect(geladen.meta.name).toBe('Kunde A')
    expect(geladen.daten.primitiveOverrides.neo.primary).toBe('#123456')
    expect(geladen.daten.meta).toBeUndefined()
    expect(await sp.lade('gibt-es-nicht')).toBeNull()
  })

  it('was der Adapter speichert, laedt loadTheme wie ein benanntes Theme', async () => {
    const sp = erzeugeLokalenSpeicher()
    const daten = store.snapshotThemeData({ withActiveSet: true })
    daten.primitiveOverrides.neo.primary = '#abcdef'
    const { meta } = await sp.speichere({ meta: { id: 'theme-x', name: 'X', version: '1.0.0' }, daten })
    expect(meta.updatedAt).toBeTruthy()
    expect(store.loadTheme('theme-x')).toBe(true)
    expect(store.state.primitiveOverrides.neo.primary).toBe('#abcdef')
    await sp.loesche('theme-x')
    expect(localStorage.getItem('neo-theme-theme-x')).toBeNull()
    expect(await sp.liste()).toEqual([])
  })

  it('Arbeitsstand: saveToStorage/loadFromStorage unveraendert unter neo-theme-configurator', () => {
    store.state.activeSection = 'foundation'
    store.saveToStorage()
    const data = JSON.parse(localStorage.getItem('neo-theme-configurator'))
    expect(data.activeSection).toBe('foundation')
    expect(Object.keys(data)).toContain('typeScale')
  })

  it('saveToServer schickt dasselbe Payload an POST /api/save-theme', async () => {
    const f = fetchAttrappe([['POST', '/api/save-theme', antwort(200, { status: 'ok', path: 'x' })]])
    vi.stubGlobal('fetch', f)
    const erg = await store.saveToServer()
    expect(erg.status).toBe('ok')
    expect(f.aufrufe).toHaveLength(1)
    const a = f.aufrufe[0]
    expect(a.url).toBe('/api/save-theme')
    expect(a.headers['Content-Type']).toBe('application/json')
    expect(Object.keys(a.body)).toEqual(['meta', 'theme', 'primitives', 'semantic', 'components', 'foundation', 'typeScale'])
    expect(Object.keys(a.body.semantic)).toEqual(['neo-light', 'neo-dark'])
  })

  it('saveToServer wirft wie bisher die Servermeldung', async () => {
    vi.stubGlobal('fetch', fetchAttrappe([['POST', '/api/save-theme', antwort(400, { status: 'error', message: 'kaputt' })]]))
    await expect(store.saveToServer()).rejects.toThrow('kaputt')
  })

  it('loadNeoDefaults: /api/neo-theme-defaults, bei Netzwerkfehler Rueckfall auf tokens.js', async () => {
    const f = fetchAttrappe([['GET', '/api/neo-theme-defaults', antwort(200, {
      status: 'ok', defaults: { _meta: { version: '9.9.9' }, primitiveOverrides: { neo: { primary: '#010203' }, customer: { primary: '#010203' } } }
    })]])
    vi.stubGlobal('fetch', f)
    await store.loadNeoDefaults()
    expect(f.aufrufe[0].url).toBe('/api/neo-theme-defaults')
    expect(store.state.version).toBe('9.9.9')
    expect(store.state.primitiveOverrides.neo.primary).toBe('#010203')

    vi.stubGlobal('fetch', async () => { throw new TypeError('offline') })
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    await store.loadNeoDefaults()
    expect(store.state.version).toBe('1.0.0')
    expect(warn).toHaveBeenCalled()
    warn.mockRestore()
  })

  it('asynchrone Store-Aktionen rufen lokal die bisherigen Funktionen', async () => {
    const meta = await store.speichereTheme('Lokal', '2.0.0')
    expect(meta.name).toBe('Lokal')
    expect(meta.etag).toBeUndefined()
    expect(localStorage.getItem(`neo-theme-${meta.id}`)).not.toBeNull()
    store.state.savedThemes = []
    expect((await store.ladeThemeKatalog()).map(t => t.id)).toEqual([meta.id])
    expect(await store.oeffneTheme(meta.id)).toBe(true)
    await expect(store.aktiviereTheme(meta.id)).rejects.toMatchObject({ art: 'nicht-unterstuetzt' })
    await expect(store.veroeffentlicheTheme()).rejects.toMatchObject({ art: 'nicht-unterstuetzt' })
  })
})
