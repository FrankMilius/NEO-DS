/**
 * R14 Paket 5 (26.10.2026): 55 unbenutzte Komponenten-Tokens gelöscht, dazu
 * nc-avatar-border-color (Entscheidung Frank 26.10.2026) — zusammen 56.
 * Beim Laden eines Themes — lokal, aus Drupal, Arbeitsstand, Import —
 * verwirft die App gespeicherte Werte dieser Tokens und meldet sie
 * (Entscheidung Frank 23.10.2026). Die Kundenwerte nc-card-nav-color-hover
 * und nc-hero-padding-inline gehen bewusst verloren.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { useThemeStore } from '../../src/stores/theme.js'
import { componentTokenGroups } from '../../src/data/tokens.js'
import { GELOESCHTE_TOKENS, verwirfGeloeschteTokens, hinweisZuVerworfenen, ohneGeloeschteTokens, variantenTokens, istGeloescht } from '../../src/speicher/geloeschte-tokens.js'
import { erzeugeLokalenSpeicher, leseArbeitsstand, leseTheme, schreibeArbeitsstand } from '../../src/speicher/lokal.js'
import { useBranchStore } from '../../src/stores/branches.js'
import { setzeSpeicher } from '../../src/speicher/index.js'
import { pruefeThemeImport } from '../../src/import/theme-import.js'

const REGISTRY = new Set(componentTokenGroups.flatMap((g) => g.tokens.map((t) => t.id)))
const KUNDENWERTE = { 'nc-card-nav-color-hover': '#37e93d', 'nc-hero-padding-inline': '40px' }

describe('Liste der gelöschten Tokens', () => {
  it('56 Tokens, keines steht noch in der Registry', () => {
    expect(GELOESCHTE_TOKENS.size).toBe(56)
    for (const t of GELOESCHTE_TOKENS) expect(REGISTRY.has(t), t).toBe(false)
  })

  it('die fünf von JavaScript gelesenen Tokens bleiben (neo-behaviors)', () => {
    for (const t of ['nc-toast-auto-dismiss-duration', 'nc-toast-max-visible', 'nc-toast-swipe-threshold', 'nc-gallery-autoplay-interval', 'nc-logo-wall-fadein-delay-step']) {
      expect(GELOESCHTE_TOKENS.has(t), t).toBe(false)
      expect(REGISTRY.has(t), t).toBe(true)
    }
  })

  it('Vorsilben bleiben: nc-accordion-padding-compact-block ist nicht gelöscht', () => {
    expect(GELOESCHTE_TOKENS.has('nc-accordion-padding-compact')).toBe(true)
    expect(GELOESCHTE_TOKENS.has('nc-accordion-padding-compact-block')).toBe(false)
    expect(REGISTRY.has('nc-accordion-padding-compact-block')).toBe(true)
  })
})

describe('verwirfGeloeschteTokens', () => {
  it('entfernt nur gelöschte Tokens, je Set; eigene Varianten und andere Werte bleiben', () => {
    const daten = {
      componentOverrides: {
        neo: { 'nc-alert-close-size': '24px', 'nc-button-fab-radius': '6px' },
        customer: { ...KUNDENWERTE, 'nc-card-hover-border': '#111111', 'nc-button-meine-bg': '#222222' },
      },
      primitiveOverrides: { neo: { primary: '#abcdef' } },
    }
    const vorher = JSON.stringify(daten)
    const { daten: neu, verworfen } = verwirfGeloeschteTokens(daten)
    expect(neu.componentOverrides).toEqual({
      neo: { 'nc-button-fab-radius': '6px' },
      customer: { 'nc-card-hover-border': '#111111', 'nc-button-meine-bg': '#222222' },
    })
    expect(neu.primitiveOverrides).toBe(daten.primitiveOverrides)
    expect(verworfen).toEqual([
      { set: 'neo', token: 'nc-alert-close-size', wert: '24px' },
      { set: 'customer', token: 'nc-card-nav-color-hover', wert: '#37e93d' },
      { set: 'customer', token: 'nc-hero-padding-inline', wert: '40px' },
    ])
    expect(JSON.stringify(daten)).toBe(vorher)   // Eingabe unverändert
  })

  it('eigene Variante, die wie ein gelöschtes Token heißt, bleibt (Card „header“ aus „footer“)', () => {
    const daten = {
      componentOverrides: { customer: { 'nc-card-header-padding': '12px', 'nc-card-header-radius': '4px', 'nc-card-nav-color-hover': '#37e93d' }, neo: { 'nc-card-header-padding': '9px' } },
      variantDefinitions: { customer: { card: { header: { modifier: 'nc-card--header', baseVariant: 'footer', tokens: ['nc-card-header-padding', 'nc-card-header-radius'] } } } },
    }
    const { daten: neu, verworfen } = verwirfGeloeschteTokens(daten)
    expect(neu.componentOverrides.customer).toEqual({ 'nc-card-header-padding': '12px', 'nc-card-header-radius': '4px' })
    // die Variante gibt es nur im Set customer — im Set neo ist es das gelöschte Token
    expect(neu.componentOverrides.neo).toEqual({})
    expect(verworfen).toEqual([
      { set: 'customer', token: 'nc-card-nav-color-hover', wert: '#37e93d' },
      { set: 'neo', token: 'nc-card-header-padding', wert: '9px' },
    ])
  })

  // B1 (Widersacher, Nachbesserung 2): createVariant übernimmt IDs ohne das
  // Muster nc-{komponente}-{basis}- unverändert — das sind Registry-Tokens,
  // keine eigenen. Nur echt umbenannte (nc-{komponente}-{name}-) sind geschützt.
  it('Variante „dicht“ aus density „compact“: unverändert übernommenes gelöschtes Token wird verworfen', () => {
    const variantDefinitions = { customer: { accordion: { dicht: { modifier: 'nc-accordion--dicht', baseVariant: 'compact', axis: 'density', tokens: ['nc-accordion-padding-compact', 'nc-accordion-dicht-gap'] } } } }
    const daten = {
      componentOverrides: { customer: { 'nc-accordion-padding-compact': '4px', 'nc-accordion-dicht-gap': '2px' } },
      variantDefinitions,
    }
    expect(variantenTokens(variantDefinitions.customer)).toEqual(new Set(['nc-accordion-dicht-gap']))
    expect(istGeloescht('nc-accordion-padding-compact', variantenTokens(variantDefinitions.customer))).toBe(true)
    const { daten: neu, verworfen } = verwirfGeloeschteTokens(daten)
    expect(neu.componentOverrides.customer).toEqual({ 'nc-accordion-dicht-gap': '2px' })
    expect(verworfen).toEqual([{ set: 'customer', token: 'nc-accordion-padding-compact', wert: '4px' }])
    expect(ohneGeloeschteTokens(daten.componentOverrides.customer, variantDefinitions.customer)).toEqual({ 'nc-accordion-dicht-gap': '2px' })
  })

  it('Card „header“ aus „footer“: umbenanntes nc-card-header-padding bleibt geschützt', () => {
    const varianten = { card: { header: { baseVariant: 'footer', tokens: ['nc-card-header-padding'] } } }
    expect(variantenTokens(varianten).has('nc-card-header-padding')).toBe(true)
    expect(istGeloescht('nc-card-header-padding', variantenTokens(varianten))).toBe(false)
    // dieselbe ID unter einer anderen Variante (nicht umbenannt) schützt nicht
    expect(variantenTokens({ card: { kopf: { baseVariant: 'footer', tokens: ['nc-card-header-padding'] } } }).size).toBe(0)
  })

  it('ohneGeloeschteTokens (Speichern): ohne gelöschte, Varianten-Tokens bleiben; ohne Treffer dasselbe Objekt', () => {
    const werte = { 'nc-card-header-padding': '12px', 'nc-alert-close-size': '24px', 'nc-button-fab-radius': '6px' }
    const varianten = { card: { header: { tokens: ['nc-card-header-padding'] } } }
    expect(ohneGeloeschteTokens(werte, varianten)).toEqual({ 'nc-card-header-padding': '12px', 'nc-button-fab-radius': '6px' })
    expect(ohneGeloeschteTokens(werte)).toEqual({ 'nc-button-fab-radius': '6px' })
    const sauber = { 'nc-button-fab-radius': '6px' }
    expect(ohneGeloeschteTokens(sauber)).toBe(sauber)
  })

  it('ohne Treffer: dieselben Daten, leere Liste', () => {
    const daten = { componentOverrides: { neo: { 'nc-button-fab-radius': '6px' } } }
    expect(verwirfGeloeschteTokens(daten)).toEqual({ daten, verworfen: [] })
    expect(verwirfGeloeschteTokens(null)).toEqual({ daten: null, verworfen: [] })
  })

  it('Hinweis nennt die Tokens (Anrede Sie), null ohne Treffer', () => {
    const h = hinweisZuVerworfenen([{ token: 'nc-hero-padding-inline' }, { token: 'nc-card-nav-color-hover' }, { token: 'nc-card-nav-color-hover' }])
    expect(h.titel).toBe('Werte entfernter Tokens verworfen')
    expect(h.text).toContain('Werte für 2 Tokens, die es im Design System nicht mehr gibt: --nc-card-nav-color-hover, --nc-hero-padding-inline.')
    expect(h.text).toContain('Beim nächsten Speichern')
    expect(hinweisZuVerworfenen([{ token: 'nc-alert-close-size' }]).text).toContain('einen Wert für ein Token, das es')
    expect(hinweisZuVerworfenen([])).toBeNull()
  })

  it('Hinweis für Personen mit Recht nur ansehen: neutral, nichts zum Speichern', () => {
    const h = hinweisZuVerworfenen([{ token: 'nc-hero-padding-inline' }], { nurAnsehen: true })
    expect(h.titel).toBe('Werte entfernter Tokens ausgeblendet')
    expect(h.text).toContain('--nc-hero-padding-inline')
    expect(h.text).not.toMatch(/[Ss]peicher|ungespeichert|verworfen/)
  })
})

describe('Laden im Store', () => {
  let store
  beforeEach(() => {
    setzeSpeicher(null)
    store = useThemeStore()
    store.state.activeThemeSet = 'customer'
    store.state.currentThemeMeta = null
    store.state.savedThemes = []
    store.state.componentOverrides = { neo: {}, customer: {} }
    store.state.verworfeneTokens = []
  })
  afterEach(() => setzeSpeicher(null))

  it('loadTheme (lokal) verwirft die Kundenwerte und meldet sie', async () => {
    const daten = store.snapshotThemeData({ withActiveSet: true })
    daten.componentOverrides.customer = { ...KUNDENWERTE, 'nc-card-hover-border': '#111111' }
    await erzeugeLokalenSpeicher().speichere({ meta: { id: 'theme-alt', name: 'Alt', version: '1.0.0' }, daten })
    expect(store.loadTheme('theme-alt')).toBe(true)
    expect(store.state.componentOverrides.customer).toEqual({ 'nc-card-hover-border': '#111111' })
    expect(store.state.verworfeneTokens.map((v) => v.token)).toEqual(['nc-card-nav-color-hover', 'nc-hero-padding-inline'])
  })

  it('loadTheme ohne gelöschte Tokens setzt eine leere Liste', async () => {
    store.state.verworfeneTokens = [{ set: 'neo', token: 'nc-alert-close-size', wert: '1px' }]
    const daten = store.snapshotThemeData({ withActiveSet: true })
    await erzeugeLokalenSpeicher().speichere({ meta: { id: 'theme-neu', name: 'Neu', version: '1.0.0' }, daten })
    expect(store.loadTheme('theme-neu')).toBe(true)
    expect(store.state.verworfeneTokens).toEqual([])
  })

  it('loadFromStorage (Arbeitsstand) meldet gelöschte Tokens', () => {
    schreibeArbeitsstand({ componentOverrides: { neo: {}, customer: { ...KUNDENWERTE, 'nc-card-hover-border': '#111111' } } })
    store.loadFromStorage()
    expect(store.state.componentOverrides.customer).toEqual({ 'nc-card-hover-border': '#111111' })
    expect(store.state.verworfeneTokens.map((v) => v.token).sort()).toEqual(['nc-card-nav-color-hover', 'nc-hero-padding-inline'])
  })
})

describe('Laden: eigene Varianten', () => {
  beforeEach(() => setzeSpeicher(null))

  it('loadFromStorage behält Varianten-Tokens, auch mit dem Namen eines gelöschten', () => {
    const store = useThemeStore()
    store.state.componentOverrides = { neo: {}, customer: {} }
    store.state.variantDefinitions = { neo: {}, customer: {} }
    store.state.verworfeneTokens = []
    schreibeArbeitsstand({
      componentOverrides: { neo: {}, customer: { 'nc-card-header-padding': '12px', 'nc-card-nav-color-hover': '#37e93d' } },
      variantDefinitions: { neo: {}, customer: { card: { header: { modifier: 'nc-card--header', baseVariant: 'footer', tokens: ['nc-card-header-padding'] } } } },
    })
    store.loadFromStorage()
    expect(store.state.componentOverrides.customer).toEqual({ 'nc-card-header-padding': '12px' })
    expect(store.state.verworfeneTokens.map((v) => v.token)).toEqual(['nc-card-nav-color-hover'])
  })
})

describe('Laden: Variante mit unverändert übernommenem gelöschtem Token (B1)', () => {
  beforeEach(() => setzeSpeicher(null))

  it('loadFromStorage verwirft nc-accordion-padding-compact der Variante „dicht“ und meldet es', () => {
    const store = useThemeStore()
    store.state.componentOverrides = { neo: {}, customer: {} }
    store.state.variantDefinitions = { neo: {}, customer: {} }
    store.state.verworfeneTokens = []
    schreibeArbeitsstand({
      componentOverrides: { neo: {}, customer: { 'nc-accordion-padding-compact': '4px', 'nc-accordion-dicht-gap': '2px' } },
      variantDefinitions: { neo: {}, customer: { accordion: { dicht: { modifier: 'nc-accordion--dicht', baseVariant: 'compact', axis: 'density', tokens: ['nc-accordion-padding-compact', 'nc-accordion-dicht-gap'] } } } },
    })
    store.loadFromStorage()
    expect(store.state.componentOverrides.customer).toEqual({ 'nc-accordion-dicht-gap': '2px' })
    expect(store.state.verworfeneTokens.map((v) => v.token)).toEqual(['nc-accordion-padding-compact'])
    store.state.componentOverrides = { neo: {}, customer: {} }
    store.state.variantDefinitions = { neo: {}, customer: {} }
  })
})

describe('Speichern schreibt keine gelöschten Tokens', () => {
  let store
  beforeEach(() => {
    setzeSpeicher(null)
    store = useThemeStore()
    store.state.activeThemeSet = 'customer'
    store.state.currentThemeMeta = null
    store.state.variantDefinitions = { neo: {}, customer: { card: { header: { modifier: 'nc-card--header', baseVariant: 'footer', tokens: ['nc-card-header-padding'] } } } }
    // z. B. aus einem alten Stand, der an keinem Lade-Weg vorbeikam
    store.state.componentOverrides = { neo: { 'nc-alert-close-size': '24px' }, customer: { ...KUNDENWERTE, 'nc-card-header-padding': '12px', 'nc-card-hover-border': '#111111' } }
  })
  afterEach(() => {
    store.state.componentOverrides = { neo: {}, customer: {} }
    store.state.variantDefinitions = { neo: {}, customer: {} }
    store.state.currentThemeMeta = null
  })

  it('Arbeitsstand (saveToStorage)', () => {
    store.saveToStorage()
    expect(leseArbeitsstand().componentOverrides).toEqual({ neo: {}, customer: { 'nc-card-header-padding': '12px', 'nc-card-hover-border': '#111111' } })
    // der gezeigte Stand bleibt unberührt
    expect(store.state.componentOverrides.customer).toHaveProperty('nc-hero-padding-inline')
  })

  it('Theme-Platz (saveCurrentTheme) und Entwurf (saveToServer)', async () => {
    const meta = store.createTheme('Kunde', '1.0.0')
    store.saveCurrentTheme()
    expect(leseTheme(meta.id).componentOverrides.customer).toEqual({ 'nc-card-header-padding': '12px', 'nc-card-hover-border': '#111111' })
    let payload = null
    setzeSpeicher({ art: 'lokal', faehigkeiten: {}, rechte: [], sichereEntwurf: async (p) => { payload = p; return true } })
    await store.saveToServer()
    expect(payload.components).toEqual({ 'nc-card-header-padding': '12px', 'nc-card-hover-border': '#111111' })
  })
})

describe('Lokale Zweige', () => {
  let store, zweige
  const anwenden = (snap) => store.applyThemeData(snap)
  const stand = () => store.snapshotThemeData({ withActiveSet: true })
  beforeEach(() => {
    setzeSpeicher(null)
    store = useThemeStore()
    zweige = useBranchStore()
    zweige.state.branches = {}
    zweige.state.activeBranchId = null
    store.state.activeThemeSet = 'customer'
    store.state.componentOverrides = { neo: {}, customer: { 'nc-card-hover-border': '#111111' } }
    store.state.variantDefinitions = { neo: {}, customer: {} }
    store.state.verworfeneTokens = []
  })
  afterEach(() => {
    zweige.state.branches = {}
    zweige.state.activeBranchId = null
    store.state.componentOverrides = { neo: {}, customer: {} }
  })

  /** Zweig mit einem alten Stand (Werte gelöschter Tokens), wie er in localStorage liegen kann. */
  function alterZweig() {
    const z = zweige.createBranch('alt', '', stand)
    z.snapshot.componentOverrides.customer = { ...KUNDENWERTE, 'nc-card-hover-border': '#222222' }
    return z
  }

  it('Wechsel: Werte gelöschter Tokens verworfen und zurückgegeben', () => {
    const z = alterZweig()
    const verworfen = zweige.switchBranch(z.id, stand, anwenden)
    expect(store.state.componentOverrides.customer).toEqual({ 'nc-card-hover-border': '#222222' })
    expect(verworfen.map((v) => v.token)).toEqual(['nc-card-nav-color-hover', 'nc-hero-padding-inline'])
    expect(zweige.switchBranch(null, stand, anwenden)).toEqual([])
  })

  it('Zusammenführen: weder übernommen noch Konflikt, aber gemeldet', () => {
    const z = alterZweig()
    z.parentSnapshot.componentOverrides.customer = { 'nc-card-hover-border': '#111111', 'nc-hero-padding-inline': '8px' }
    const { autoMerged, conflicts, verworfen } = zweige.computeMerge(z.id, stand)
    expect(autoMerged.componentOverrides.customer).toEqual({ 'nc-card-hover-border': '#222222' })
    expect(conflicts).toEqual([])
    expect(verworfen.map((v) => v.token)).toEqual(['nc-card-nav-color-hover', 'nc-hero-padding-inline'])
  })
})

describe('Import', () => {
  it('Werte gelöschter Tokens sind kein Fehler: übersprungen und genannt', () => {
    const text = JSON.stringify({ meta: { name: 'Kunde', version: '1.0.0' }, components: { card: { overrides: { 'nc-card-nav-color-hover': '#37e93d', 'nc-card-hover-border': '#111111' } } } })
    const erg = pruefeThemeImport(text)
    expect(erg.ok).toBe(true)
    expect(erg.daten.componentOverrides).toEqual({ 'nc-card-hover-border': '#111111' })
    expect(erg.verworfen).toEqual([{ token: 'nc-card-nav-color-hover', wert: '#37e93d' }])
  })

  it('ein unbekanntes Token bleibt ein Fehler', () => {
    const text = JSON.stringify({ meta: { name: 'Kunde', version: '1.0.0' }, components: { card: { overrides: { 'nc-card-gibt-es-nicht': '1px' } } } })
    expect(pruefeThemeImport(text).ok).toBe(false)
  })
})
