// Hash-Router (Plan v2, 3.4): Sektion ↔ Hash, Zurueck/Vor, unbekannte Hashes.
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { nextTick } from 'vue'
import { useThemeStore } from '../../src/stores/theme.js'
import {
  sektionZuPfad, pfadZuSektion, hashZuRoute, routeZuHash, starteHashRouter,
} from '../../src/navigation/hash-router.js'
import { NAVIGATIONS_SEKTIONEN, START_SEKTION } from '../../src/navigation/sektions-ids.js'

// Kleines Fenster-Double mit History-Stack: pushState/replaceState/back/forward
// verhalten sich wie im Browser (back/forward loesen popstate + hashchange aus).
function erzeugeFenster (startHash = '') {
  const listener = { hashchange: new Set(), popstate: new Set() }
  const eintraege = [{ hash: startHash, state: null }]
  let index = 0
  const hashAus = (url) => { const i = url.indexOf('#'); return i < 0 ? '' : url.slice(i) }
  const feuere = (typ) => { for (const fn of [...listener[typ]]) fn({ type: typ }) }
  const fenster = {
    location: { pathname: '/config/theme-configurator/', search: '', get hash () { return eintraege[index].hash } },
    history: {
      get state () { return eintraege[index].state },
      get length () { return eintraege.length },
      pushState (state, _t, url) { eintraege.splice(index + 1); eintraege.push({ hash: hashAus(url), state }); index++ },
      replaceState (state, _t, url) { eintraege[index] = { hash: hashAus(url), state } },
      back () { if (index > 0) { index--; feuere('popstate'); feuere('hashchange') } },
      forward () { if (index < eintraege.length - 1) { index++; feuere('popstate'); feuere('hashchange') } },
    },
    addEventListener (typ, fn) { listener[typ].add(fn) },
    removeEventListener (typ, fn) { listener[typ].delete(fn) },
    // Nutzer tippt einen Hash / klickt einen Anker: neuer Eintrag + hashchange
    tippeHash (hash) { eintraege.splice(index + 1); eintraege.push({ hash, state: null }); index++; feuere('hashchange') },
    anzahlListener: () => listener.hashchange.size + listener.popstate.size,
  }
  return fenster
}

describe('Hash-Schema', () => {
  it('Sektion → Pfad → Sektion ist fuer jede Navigations-Sektion umkehrbar', () => {
    for (const id of NAVIGATIONS_SEKTIONEN) {
      expect(pfadZuSektion(sektionZuPfad(id)), id).toBe(id)
      expect(hashZuRoute(routeZuHash({ sektion: id })).sektion, id).toBe(id)
    }
  })

  it('lesbare Pfade', () => {
    expect(routeZuHash({ sektion: 'foundation-typography' })).toBe('#/foundation/typography')
    expect(routeZuHash({ sektion: 'component-button' })).toBe('#/component/button')
    expect(routeZuHash({ sektion: 'component-code-snippet' })).toBe('#/component/code-snippet')
    expect(routeZuHash({ sektion: 'template-dashboard' })).toBe('#/template/dashboard')
  })

  it('Set und Modus nur als Query, wenn nicht Standard', () => {
    expect(routeZuHash({ sektion: 'component-button', set: 'neo', modus: 'light' })).toBe('#/component/button')
    expect(routeZuHash({ sektion: 'component-button', set: 'customer', modus: 'dark' }))
      .toBe('#/component/button?set=customer&modus=dark')
    expect(hashZuRoute('#/component/button?set=customer&modus=dark'))
      .toEqual({ istRoute: true, sektion: 'component-button', set: 'customer', modus: 'dark' })
  })

  it('unbrauchbare Hashes', () => {
    expect(hashZuRoute('').istRoute).toBe(false)
    expect(hashZuRoute('#mag-content').istRoute).toBe(false)
    expect(hashZuRoute('#/foundation').sektion).toBe(null)
    expect(hashZuRoute('#/a/b/c').sektion).toBe(null)
    expect(hashZuRoute('#/%E0%A4%A/x').sektion).toBe(null) // kaputtes Encoding wirft nicht
  })
})

describe('starteHashRouter', () => {
  let store
  let stop
  beforeEach(() => {
    store = useThemeStore()
    // gemerkte Vorschaumodi je Sektion (Modul-State) zwischen Tests leeren
    for (const k of Object.keys(store.state.sectionPreviewModes)) delete store.state.sectionPreviewModes[k]
    store.setActiveThemeSet('neo')
    store.setActiveSection('foundation-spacing') // „gespeicherter Stand"
    store.setPreviewMode('light')
  })
  afterEach(() => stop?.())

  it('ohne Hash: gespeicherter Stand bleibt und landet in der URL (ohne neuen Eintrag)', () => {
    const f = erzeugeFenster('')
    stop = starteHashRouter(store, { fenster: f })
    expect(store.state.activeSection).toBe('foundation-spacing')
    expect(f.location.hash).toBe('#/foundation/spacing')
    expect(f.history.length).toBe(1)
  })

  it('Hash gewinnt beim Laden vor dem gespeicherten Stand', () => {
    const f = erzeugeFenster('#/component/button?set=customer&modus=dark')
    stop = starteHashRouter(store, { fenster: f })
    expect(store.state.activeSection).toBe('component-button')
    expect(store.state.activeThemeSet).toBe('customer')
    expect(store.state.previewMode).toBe('dark')
    expect(f.location.hash).toBe('#/component/button?set=customer&modus=dark')
  })

  it('unbekannter Hash → Startsektion, URL wird korrigiert, kein Fehler', () => {
    const f = erzeugeFenster('#/foo/bar?modus=quatsch&set=gibtsnicht')
    stop = starteHashRouter(store, { fenster: f })
    expect(store.state.activeSection).toBe(START_SEKTION)
    expect(store.state.activeThemeSet).toBe('neo')
    expect(f.location.hash).toBe('#/foundation/colors')
  })

  it('Sektion → Hash: Sektionswechsel legt History-Eintrag an, Moduswechsel ersetzt', async () => {
    const f = erzeugeFenster('')
    stop = starteHashRouter(store, { fenster: f })
    store.setActiveSection('component-button')
    await nextTick()
    expect(f.location.hash).toBe('#/component/button')
    expect(f.history.length).toBe(2)
    store.setPreviewMode('dark')
    await nextTick()
    expect(f.location.hash).toBe('#/component/button?modus=dark')
    expect(f.history.length).toBe(2)
  })

  it('Zurueck/Vor wechseln die Sektion (popstate + hashchange)', async () => {
    const f = erzeugeFenster('')
    stop = starteHashRouter(store, { fenster: f })
    store.setActiveSection('component-button'); await nextTick()
    store.setActiveSection('foundation-typography'); await nextTick()
    expect(f.history.length).toBe(3)

    f.history.back(); await nextTick()
    expect(store.state.activeSection).toBe('component-button')
    f.history.back(); await nextTick()
    expect(store.state.activeSection).toBe('foundation-spacing')
    f.history.forward(); await nextTick()
    expect(store.state.activeSection).toBe('component-button')
    // Navigation per History erzeugt keine zusaetzlichen Eintraege
    expect(f.history.length).toBe(3)
    expect(f.location.hash).toBe('#/component/button')
  })

  it('getippter Hash (hashchange) setzt die Sektion; unbekannt → Startsektion', async () => {
    const f = erzeugeFenster('')
    stop = starteHashRouter(store, { fenster: f })
    f.tippeHash('#/foundation/radius'); await nextTick()
    expect(store.state.activeSection).toBe('foundation-radius')
    f.tippeHash('#/component/gibtsnicht'); await nextTick()
    expect(store.state.activeSection).toBe(START_SEKTION)
    expect(f.location.hash).toBe('#/foundation/colors')
  })

  it('Sprungmarken (href="#…") aendern die Sektion nicht; URL wird zurueckgesetzt', async () => {
    const f = erzeugeFenster('')
    stop = starteHashRouter(store, { fenster: f })
    f.tippeHash('#'); await nextTick()
    expect(store.state.activeSection).toBe('foundation-spacing')
    expect(f.location.hash).toBe('#/foundation/spacing')
  })

  it('Stopp entfernt Listener und Watcher', async () => {
    const f = erzeugeFenster('')
    stop = starteHashRouter(store, { fenster: f })
    expect(f.anzahlListener()).toBe(2)
    stop(); stop = null
    expect(f.anzahlListener()).toBe(0)
    store.setActiveSection('component-button'); await nextTick()
    expect(f.location.hash).toBe('#/foundation/spacing')
  })

  it('laeuft mit dem echten (happy-dom) window', async () => {
    window.history.replaceState(null, '', '/#/foundation/border')
    stop = starteHashRouter(store)
    expect(store.state.activeSection).toBe('foundation-border')
    store.setActiveSection('component-badge'); await nextTick()
    expect(window.location.hash).toBe('#/component/badge')
  })
})
