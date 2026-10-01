/**
 * Abweichungen vom NEO-Standard (Plan v2, 2.6 — ADR-002, Folge 3):
 * Roundtrip, leere Abweichung beim unveraenderten Standard, ein neuer
 * Standard wirkt durch, explizites Loeschen; standardDaten() entspricht der
 * Werkseinstellung der App.
 */
import { describe, it, expect, vi, afterEach } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { useThemeStore, THEME_DATA_KEYS } from '../../src/stores/theme.js'
import { abweichungenBerechnen, zusammenfuehren, istOhneAbweichung, ENTFERNT } from '../../src/speicher/abweichungen.js'
import { standardDaten, standardVersion } from '../../src/speicher/standard.js'
import { setzeSpeicher } from '../../src/speicher/index.js'

const DATEI = JSON.parse(readFileSync(resolve(__dirname, '../../../../data/neo-theme-defaults/neo-theme-defaults.json'), 'utf8'))
const kopie = (v) => JSON.parse(JSON.stringify(v))
const standard = () => standardDaten(DATEI)

/** Store auf die Werkseinstellung (Rueckfall aus tokens.js, kein Server). */
async function werkseinstellung() {
  setzeSpeicher(null)
  vi.stubGlobal('fetch', async () => { throw new TypeError('offline') })
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
  const log = vi.spyOn(console, 'log').mockImplementation(() => {})
  const store = useThemeStore()
  await store.loadNeoDefaults()
  warn.mockRestore(); log.mockRestore()
  return store
}

/**
 * Wie eine Sitzung mit Server-Standard: erst Werkseinstellung (alle Schluessel),
 * dann die Standard-Datei vom Server (GET /api/neo-theme-defaults bzw.
 * /neo-standard) — so laedt die App den Standard im Betrieb.
 */
async function standardVomServer() {
  const store = await werkseinstellung()
  vi.stubGlobal('fetch', async () => ({ ok: true, json: async () => ({ status: 'ok', defaults: kopie(DATEI) }) }))
  const log = vi.spyOn(console, 'log').mockImplementation(() => {})
  await store.loadNeoDefaults()
  log.mockRestore()
  return store
}

afterEach(() => { vi.unstubAllGlobals(); setzeSpeicher(null) })

describe('standardDaten', () => {
  it('liefert alle THEME_DATA_KEYS fuer beide Sets und die Version', () => {
    const s = standard()
    expect(Object.keys(s)).toEqual(THEME_DATA_KEYS)
    for (const k of THEME_DATA_KEYS) expect(Object.keys(s[k]), k).toEqual(['neo', 'customer'])
    expect(standardVersion(DATEI)).toBe(DATEI._meta.version)
  })

  it('entspricht der Werkseinstellung der App (loadNeoDefaults mit Server-Standard)', async () => {
    const store = await standardVomServer()
    expect(store.snapshotThemeData()).toEqual(standard())
  })

  // Bekannte Abweichung: getDefaultFoundation() (Rueckfall ohne Server) legt
  // fuer Foundation-Kategorien ohne Tokens leere Objekte an (elements, themes),
  // scripts/generate-neo-defaults.js nicht. Ergebnis ist hoechstens die
  // harmlose Abweichung { elements: {}, themes: {} } — der Roundtrip bleibt exakt.
  it('Rueckfall aus tokens.js unterscheidet sich nur um leere Foundation-Kategorien', async () => {
    const store = await werkseinstellung()
    const snap = store.snapshotThemeData()
    const abw = abweichungenBerechnen(snap, standard())
    for (const set of ['neo', 'customer']) {
      for (const [k, v] of Object.entries(abw.foundationOverrides?.[set] || {})) expect(v, `${set}.${k}`).toEqual({})
    }
    expect(Object.keys(abw).filter(k => k !== 'foundationOverrides')).toEqual([])
    expect(zusammenfuehren(standard(), abw)).toEqual(snap)
  })

  it('lehnt eine unvollstaendige Standard-Datei ab', () => {
    expect(() => standardDaten({ themes: DATEI.themes })).toThrow(/unvollständig/)
    expect(() => standardDaten(null)).toThrow()
  })
})

describe('abweichungenBerechnen / zusammenfuehren', () => {
  it('unveraenderter Standard -> leere Abweichung, Zusammenfuehren ergibt den Standard', async () => {
    const store = await standardVomServer()
    const abw = abweichungenBerechnen(store.snapshotThemeData(), standard())
    expect(abw).toEqual({})
    expect(istOhneAbweichung(abw)).toBe(true)
    expect(zusammenfuehren(standard(), abw)).toEqual(standard())
  })

  it('Roundtrip mit echten Store-Aenderungen (nur die Aenderungen landen in den Abweichungen)', async () => {
    const store = await standardVomServer()
    store.state.activeThemeSet = 'customer'
    store.updatePrimitive('primary', '#0b5cad')
    store.updateSemanticToken('text-link', '#0b5cad')
    store.updateComponentToken('nc-button-accent-bg', '#0b5cad')
    store.state.customFonts.customer.push({ name: 'ACME Sans', url: 'x.woff2' })
    store.state.iconLibraries.customer = store.state.iconLibraries.customer.slice(0, 1)
    const stand = store.snapshotThemeData({ withActiveSet: true })

    const abw = abweichungenBerechnen(stand, standard())
    expect(zusammenfuehren(standard(), abw)).toEqual(stand)
    expect(abw.activeThemeSet).toBe('customer')
    expect(abw.primitiveOverrides).toEqual({ customer: { primary: '#0b5cad' } })
    expect(abw.componentOverrides).toEqual({ customer: { 'nc-button-accent-bg': '#0b5cad' } })
    expect(abw.iconLibraries.customer).toHaveLength(1)           // Listen als Ganzes
    expect(abw.themes.neo).toBeUndefined()
    expect(JSON.stringify(abw).length).toBeLessThan(JSON.stringify(stand).length / 20)
  })

  it('Roundtrip mit entfernten Schluesseln, Typwechseln, null und neuen Schluesseln', () => {
    const s = standard()
    const x = kopie(s)
    delete x.themes.customer.light['text-link']
    delete x.foundationOverrides.neo
    x.focusRingMode.customer = { modus: 'inset' }
    x.componentLocks.customer = { button: null }
    x.typeScale.customer = { basis: 18, stufen: [1, 1.25] }
    const abw = abweichungenBerechnen(x, s)
    expect(abw.themes.customer.light['text-link']).toEqual({ [ENTFERNT]: true })
    expect(abw.foundationOverrides.neo).toEqual({ [ENTFERNT]: true })
    expect(zusammenfuehren(s, abw)).toEqual(x)
    expect(s).toEqual(standard())                                 // Standard unveraendert
  })

  it('ein neuer Standard wirkt durch, bewusste Abweichungen bleiben', () => {
    const alt = standard()
    const x = kopie(alt)
    x.themes.customer.light['text-link'] = '#0b5cad'
    const abw = abweichungenBerechnen(x, alt)

    const neuDatei = kopie(DATEI)
    neuDatei.themes.customer.light['on-danger'] = '#000000'
    neuDatei.themes.customer.light['text-link'] = '#123456'
    neuDatei.primitiveOverrides.customer.accent = '#00aa00'
    const neu = standardDaten(neuDatei)

    const geladen = zusammenfuehren(neu, abw)
    expect(geladen.themes.customer.light['on-danger']).toBe('#000000')   // neuer Standard
    expect(geladen.primitiveOverrides.customer.accent).toBe('#00aa00')
    expect(geladen.themes.customer.light['text-link']).toBe('#0b5cad')   // Kunde gewinnt
  })

  it('Schluessel ausserhalb von THEME_DATA_KEYS werden ignoriert', () => {
    const abw = abweichungenBerechnen({ ...standard(), meta: { name: 'x' }, previewMode: 'dark' }, standard())
    expect(abw).toEqual({})
  })
})
