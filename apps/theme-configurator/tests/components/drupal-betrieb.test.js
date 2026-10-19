/**
 * Oberfläche im Drupal-Betrieb (Plan v2, 2.6, Teil 2) mit gefälschtem
 * Speicher-Adapter: Rechte-Gating, Konfliktdialog (412), Veröffentlichen mit
 * und ohne Kontrast-Befund (App und Server-422), Theme-Auswahl, Strg+S,
 * Branches/Releases ausgeblendet, Schreibschutz — und lokal unverändert.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { nextTick } from 'vue'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import AppHeader from '../../src/components/layout/AppHeader.vue'
import DrupalWerkzeuge from '../../src/components/drupal/DrupalWerkzeuge.vue'
import DrupalThemeAuswahl from '../../src/components/drupal/DrupalThemeAuswahl.vue'
import DrupalKonfliktDialog from '../../src/components/drupal/DrupalKonfliktDialog.vue'
import DrupalVeroeffentlichenDialog from '../../src/components/drupal/DrupalVeroeffentlichenDialog.vue'
import DrupalRechteHinweis from '../../src/components/drupal/DrupalRechteHinweis.vue'
import KonfigBestaetigung from '../../src/components/ui/KonfigBestaetigung.vue'
import { useThemeStore } from '../../src/stores/theme.js'
import { setzeSpeicher, SpeicherFehler, meldungFuer } from '../../src/speicher/index.js'
import { standardDaten } from '../../src/speicher/standard.js'
import { useDrupalBetrieb, starteDrupalBetrieb, _zuruecksetzenDrupalBetrieb, STAND_SCHLUESSEL } from '../../src/composables/useDrupalBetrieb.js'
import { _zuruecksetzen as bestaetigungZuruecksetzen, useBestaetigung } from '../../src/composables/useBestaetigung.js'
import { _zuruecksetzenSchreibschutz } from '../../src/stores/plugins/schreibschutz.js'

const STANDARD = JSON.parse(readFileSync(resolve(__dirname, '../../../../data/neo-theme-defaults/neo-theme-defaults.json'), 'utf8'))
const ALLE = ['ansehen', 'bearbeiten', 'veroeffentlichen']

const meta = (id, extra = {}) => ({ id, name: `Theme ${id}`, version: '1.0.0', hash: `h-${id}`, status: 'entwurf', aktiv: false, ...extra })

/** Gefälschter Drupal-Adapter mit vi.fn je Operation. */
function adapter ({ rechte = ALLE, ...ueber } = {}) {
  return {
    art: 'drupal',
    faehigkeiten: { veroeffentlichen: true, aktivieren: true, konflikterkennung: true, branchesUndReleases: false },
    rechte,
    liste: vi.fn(async () => []),
    lade: vi.fn(async (id) => ({ meta: meta(id), daten: standardDaten(STANDARD), etag: `"h-${id}"` })),
    speichere: vi.fn(async ({ meta: m }) => ({ meta: { ...meta(m.id || 'neu'), name: m.name, version: m.version }, etag: '"h-neu"' })),
    loesche: vi.fn(async () => {}),
    aktiviere: vi.fn(async (id) => [meta(id, { aktiv: true, status: 'veroeffentlicht' })]),
    veroeffentliche: vi.fn(async (id) => ({ meta: meta(id, { status: 'veroeffentlicht' }), css: { pfad: 'public://neo-theme/t1/theme-v1.css', version: '1', hash: 'x', ausgeliefert: false }, etag: `"h-${id}"` })),
    exportiere: vi.fn(),
    ladeStandard: vi.fn(async () => STANDARD),
    sichereEntwurf: vi.fn(),
    ...ueber,
  }
}

const wrappers = []
function montiere (k, opts = {}) {
  const w = mount(k, { attachTo: document.body, global: { stubs: { Transition: false, Teleport: true } }, ...opts })
  wrappers.push(w)
  return w
}
const knopf = (w, test) => w.find(`[data-test="${test}"]`)

let store
beforeEach(() => {
  store = useThemeStore()
  store.state.currentThemeMeta = null
  store.state.savedThemes = []
  bestaetigungZuruecksetzen()
  _zuruecksetzenSchreibschutz()
})
afterEach(() => {
  while (wrappers.length) wrappers.pop().unmount()
  _zuruecksetzenDrupalBetrieb()
  bestaetigungZuruecksetzen()
  setzeSpeicher(null)
  store.state.currentThemeMeta = null
  store.state.savedThemes = []
  document.body.innerHTML = ''
})

/** Theme „t1“ geöffnet und gespeichert (Status gespeichert). */
async function geoeffnet (sp, daten = standardDaten(STANDARD)) {
  sp.lade.mockResolvedValue({ meta: meta('t1'), daten, etag: '"h-t1"' })
  sp.liste.mockResolvedValue([meta('t1')])
  await starteDrupalBetrieb(store)
  await useDrupalBetrieb().oeffnen('t1')
  await flushPromises()
  expect(useDrupalBetrieb().zustand.status).toBe('gespeichert')
}

describe('Header: lokal unverändert, Drupal mit eigenen Werkzeugen', () => {
  it('lokal: Branches, Save, Delete, Merge wie bisher — keine Drupal-Werkzeuge', () => {
    setzeSpeicher(null) // Standard: lokal
    const w = montiere(AppHeader)
    expect(w.find('.branch-manager').exists()).toBe(true)
    expect(w.find('.tb-btn-save').exists()).toBe(true)
    expect(w.find('.tb-btn-danger').exists()).toBe(true)
    expect(w.find('.tb-btn-merge').exists()).toBe(true)
    expect(knopf(w, 'drupal-theme-auswahl').exists()).toBe(false)
  })

  it('drupal: Branches/Releases und lokale Theme-Werkzeuge ausgeblendet', () => {
    setzeSpeicher(adapter())
    const w = montiere(AppHeader)
    expect(w.find('.branch-manager').exists()).toBe(false)
    expect(w.text()).not.toContain('Publish Release')
    expect(w.find('.tb-btn-save').exists()).toBe(false)
    expect(w.find('.tb-btn-danger').exists()).toBe(false)
    expect(w.find('.tb-btn-merge').exists()).toBe(false)
    expect(knopf(w, 'drupal-theme-auswahl').exists()).toBe(true)
    expect(knopf(w, 'drupal-speichern').exists()).toBe(true)
  })

  it('Strg+S speichert im Drupal-Betrieb in Drupal (PUT mit ETag)', async () => {
    const sp = adapter()
    setzeSpeicher(sp)
    await geoeffnet(sp)
    montiere(AppHeader)
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 's', ctrlKey: true, bubbles: true }))
    await flushPromises()
    expect(sp.speichere).toHaveBeenCalledTimes(1)
    expect(sp.speichere.mock.calls[0][0]).toMatchObject({ meta: { id: 't1' }, etag: '"h-t1"' })
  })
})

describe('Rechte-Gating', () => {
  it('nur ansehen: Banner, Speichern/Veröffentlichen gesperrt, kein „Neu anlegen“/Löschen', async () => {
    const sp = adapter({ rechte: ['ansehen'] })
    sp.liste.mockResolvedValue([meta('t1')])
    setzeSpeicher(sp)
    const banner = montiere(DrupalRechteHinweis)
    expect(banner.text()).toContain('Nur Ansicht – Ihnen fehlt das Recht ‚bearbeiten‘')
    await starteDrupalBetrieb(store)
    const w = montiere(DrupalWerkzeuge)
    expect(knopf(w, 'drupal-speichern').attributes('disabled')).toBeDefined()
    expect(knopf(w, 'drupal-speichern').attributes('title')).toContain('Recht „bearbeiten“')
    expect(knopf(w, 'drupal-veroeffentlichen').attributes('disabled')).toBeDefined()
    await knopf(w, 'drupal-theme-auswahl').trigger('click')
    expect(knopf(w, 'drupal-neu').exists()).toBe(false)
    expect(knopf(w, 'drupal-loeschen').exists()).toBe(false)
    expect(knopf(w, 'drupal-aktivieren').exists()).toBe(false)
  })

  it('mit allen Rechten: kein Banner', () => {
    setzeSpeicher(adapter())
    expect(montiere(DrupalRechteHinweis).find('[data-test="nur-ansicht"]').exists()).toBe(false)
  })

  it('ohne „veröffentlichen“: Speichern ja, Veröffentlichen gesperrt mit Hinweis', () => {
    setzeSpeicher(adapter({ rechte: ['ansehen', 'bearbeiten'] }))
    store.state.currentThemeMeta = { ...meta('t1'), etag: '"h-t1"' }
    const w = montiere(DrupalWerkzeuge)
    expect(knopf(w, 'drupal-speichern').attributes('disabled')).toBeUndefined()
    expect(knopf(w, 'drupal-veroeffentlichen').attributes('disabled')).toBeDefined()
    expect(knopf(w, 'drupal-veroeffentlichen').attributes('title')).toBe('Ihnen fehlt das Recht „veröffentlichen“')
  })

  it('Schreibschutz-Plugin: ändernde Store-Aktionen ohne „bearbeiten“ angehalten, lokal nicht', async () => {
    setzeSpeicher(adapter({ rechte: ['ansehen'] }))
    const vorher = store.state.foundationOverrides[store.state.activeThemeSet].radius?.xs
    store.updateFoundationToken('radius', 'xs', '13px')
    expect(store.state.foundationOverrides[store.state.activeThemeSet].radius?.xs).toBe(vorher)
    expect(useBestaetigung().aktuelleAnfrage.value?.titel).toBe('Nur Ansicht')

    setzeSpeicher(null) // lokal
    store.updateFoundationToken('radius', 'xs', '13px')
    expect(store.state.foundationOverrides[store.state.activeThemeSet].radius.xs).toBe('13px')
    store.updateFoundationToken('radius', 'xs', vorher)
  })
})

describe('Speichern, Status und Konfliktdialog (412)', () => {
  it('Status: gespeichert → ungespeichert nach Änderung → gespeichert nach Speichern', async () => {
    vi.useFakeTimers()
    try {
      const sp = adapter()
      setzeSpeicher(sp)
      await geoeffnet(sp)
      store.state.focusRingMode.customer = store.state.focusRingMode.customer === 'inset' ? 'offset' : 'inset'
      await nextTick()
      vi.advanceTimersByTime(200)
      expect(useDrupalBetrieb().zustand.status).toBe('ungespeichert')
      expect(await useDrupalBetrieb().speichern()).toBe(true)
      expect(useDrupalBetrieb().zustand.status).toBe('gespeichert')
      expect(JSON.parse(localStorage.getItem(STAND_SCHLUESSEL)).id).toBe('t1')
    } finally {
      vi.useRealTimers()
    }
  })

  it('nach dem Speichern steht der neue ETag im Arbeitsstand (Neuladen ohne falschen Konflikt)', async () => {
    const sp = adapter()
    sp.speichere.mockResolvedValue({ meta: meta('t1'), etag: '"neu-nach-speichern"' })
    setzeSpeicher(sp)
    await geoeffnet(sp)
    store.state.focusRingMode.neo = store.state.focusRingMode.neo === 'inset' ? 'offset' : 'inset'
    expect(await useDrupalBetrieb().speichern()).toBe(true)
    const stand = JSON.parse(localStorage.getItem('neo-theme-configurator'))
    expect(stand.currentThemeMeta.etag).toBe('"neu-nach-speichern"')
  })

  it('leere Kategorien (wie nach dem Neuladen ergänzt) zählen nicht als Änderung', async () => {
    const sp = adapter()
    setzeSpeicher(sp)
    await geoeffnet(sp)
    store.state.foundationOverrides.neo.elements = {}
    store.state.foundationOverrides.customer.themes = {}
    useDrupalBetrieb().pruefeStand()
    expect(useDrupalBetrieb().zustand.status).toBe('gespeichert')
  })

  it('UX-07: Konfliktdialog nennt Zeit und Person; „Als neues Theme“ und „Meine Fassung speichern“ retten die Änderungen', async () => {
    const sp = adapter()
    setzeSpeicher(sp)
    await geoeffnet(sp)
    sp.lade.mockResolvedValue({ meta: meta('t1', { hash: 'h-fremd', updatedAt: '2026-10-15T09:30:00.000Z', geaendertVon: 'Anna' }), daten: standardDaten(STANDARD), etag: '"h-fremd"' })
    sp.speichere.mockRejectedValueOnce(new SpeicherFehler('veraltet', 'veraltet', { status: 412, aktuellEtag: '"h-fremd"' }))
    const w = montiere(DrupalKonfliktDialog)
    store.state.focusRingMode.customer = 'inset'   // eigene Änderung
    await useDrupalBetrieb().speichern()
    await flushPromises()
    const dialog = w.find('[role="alertdialog"]')
    expect(dialog.text()).toContain('von Anna')
    expect(dialog.text()).toMatch(/am 15\.10\.2026/)
    // „Meine Fassung speichern“: erst Warnung, dann mit dem ETag des fremden Stands
    await knopf(w, 'konflikt-ueberschreiben').trigger('click')
    expect(knopf(w, 'konflikt-warnung').text()).toContain('von Anna')
    expect(sp.speichere).toHaveBeenCalledTimes(1)
    sp.speichere.mockResolvedValueOnce({ meta: meta('t1'), etag: '"h-mein"' })
    await knopf(w, 'konflikt-ueberschreiben').trigger('click')
    await flushPromises()
    expect(sp.speichere).toHaveBeenCalledTimes(2)
    expect(sp.speichere.mock.calls[1][0].etag).toBe('"h-fremd"')
    expect(sp.speichere.mock.calls[1][0].daten.focusRingMode.customer).toBe('inset')
    expect(useDrupalBetrieb().zustand.konflikt).toBeNull()
    expect(useDrupalBetrieb().zustand.status).toBe('gespeichert')

    // „Als neues Theme speichern“: POST ohne id, Name mit „(meine Fassung)“
    sp.speichere.mockRejectedValueOnce(new SpeicherFehler('veraltet', 'veraltet', { status: 412, aktuellEtag: '"h-x"' }))
    store.state.focusRingMode.customer = 'offset'
    await useDrupalBetrieb().speichern()
    await flushPromises()
    sp.speichere.mockResolvedValueOnce({ meta: { ...meta('neu'), name: 'Theme t1 (meine Fassung)' }, etag: '"h-neu"' })
    await knopf(w, 'konflikt-als-neu').trigger('click')
    await flushPromises()
    const neu = sp.speichere.mock.calls.at(-1)[0]
    expect(neu.meta.id).toBeUndefined()
    expect(neu.meta.name).toBe('Theme t1 (meine Fassung)')
    expect(store.state.currentThemeMeta.id).toBe('neu')
  })

  it('UX-06: beim Verlassen mit ungespeicherten Änderungen fragt der Browser nach', async () => {
    vi.useFakeTimers()
    try {
      const sp = adapter()
      setzeSpeicher(sp)
      await geoeffnet(sp)
      const ev = () => { const e = new Event('beforeunload', { cancelable: true }); window.dispatchEvent(e); return e }
      expect(ev().defaultPrevented).toBe(false)
      store.state.focusRingMode.customer = store.state.focusRingMode.customer === 'inset' ? 'offset' : 'inset'
      await nextTick(); vi.advanceTimersByTime(200)
      expect(useDrupalBetrieb().zustand.status).toBe('ungespeichert')
      expect(ev().defaultPrevented).toBe(true)
    } finally { vi.useRealTimers() }
  })

  it('ohne Drupal-Theme öffnet Speichern den Dialog „Als neues Theme speichern“', async () => {
    const sp = adapter()
    setzeSpeicher(sp)
    await starteDrupalBetrieb(store)
    expect(await useDrupalBetrieb().speichern()).toBe(false)
    expect(useDrupalBetrieb().zustand.anlegen).toEqual({ vomStandard: false })
    expect(sp.speichere).not.toHaveBeenCalled()
  })

  it('412 → Konfliktdialog; „Abbrechen“ arbeitet weiter, „Neu laden“ holt den Server-Stand', async () => {
    const sp = adapter()
    setzeSpeicher(sp)
    await geoeffnet(sp)
    sp.speichere.mockRejectedValue(new SpeicherFehler('veraltet', 'veraltet', { status: 412, aktuellEtag: '"h-neu"' }))
    const w = montiere(DrupalKonfliktDialog)
    expect(w.find('[role="alertdialog"]').exists()).toBe(false)

    await useDrupalBetrieb().speichern()
    await nextTick()
    const dialog = w.find('[role="alertdialog"]')
    expect(dialog.exists()).toBe(true)
    expect(dialog.text()).toContain('Das Theme wurde inzwischen geändert')
    expect(dialog.text()).toContain('„Theme t1“')

    await knopf(w, 'konflikt-abbrechen').trigger('click')
    expect(w.find('[role="alertdialog"]').exists()).toBe(false)
    expect(useDrupalBetrieb().zustand.status).toBe('ungespeichert')

    await useDrupalBetrieb().speichern()
    await nextTick()
    const geaendert = standardDaten(STANDARD)
    geaendert.focusRingMode.customer = 'inset'
    sp.lade.mockResolvedValue({ meta: meta('t1', { hash: 'h-neu' }), daten: geaendert, etag: '"h-neu"' })
    const vorher = sp.lade.mock.calls.length
    await knopf(w, 'konflikt-neu-laden').trigger('click')
    await flushPromises()
    expect(sp.lade.mock.calls.length).toBe(vorher + 1)
    expect(store.state.focusRingMode.customer).toBe('inset')
    expect(store.state.currentThemeMeta.etag).toBe('"h-neu"')
    expect(useDrupalBetrieb().zustand.konflikt).toBeNull()
    expect(useDrupalBetrieb().zustand.status).toBe('gespeichert')
  })

  it('andere Fehler (Netzwerk, 403, 413, CSRF) als verständlicher Hinweis', async () => {
    const sp = adapter()
    setzeSpeicher(sp)
    await geoeffnet(sp)
    const b = montiere(KonfigBestaetigung)
    sp.speichere.mockRejectedValue(new SpeicherFehler('zu-gross', 'Das Theme ist zu groß (höchstens 1 MB).', { status: 413 }))
    useDrupalBetrieb().speichern()
    await flushPromises()
    expect(b.text()).toContain('Theme zu groß')
    expect(useDrupalBetrieb().zustand.status).toBe('fehler')
    expect(useDrupalBetrieb().zustand.fehlerText).toBe('Theme zu groß')
  })

  it('meldungFuer: CSRF, Netzwerk, Recht, 413', () => {
    const csrf = new SpeicherFehler('verboten', 'CSRF-Token ungültig', { status: 403, details: { type: 'https://x/probleme/csrf', title: 'CSRF-Token ungültig' } })
    expect(meldungFuer(csrf).titel).toBe('Anmeldung abgelaufen')   // UX-28: ohne Fachbegriff
    expect(meldungFuer(csrf).text).toContain('in einem neuen Tab neu an')
    expect(meldungFuer(new SpeicherFehler('netzwerk', 'x'), 'Speichern')).toMatchObject({ titel: 'Keine Verbindung zu Drupal' })
    expect(meldungFuer(new SpeicherFehler('netzwerk', 'x'), 'Speichern').text).toContain('Speichern hat nicht geklappt')
    expect(meldungFuer(new SpeicherFehler('verboten', 'Ihnen fehlt das Recht „bearbeiten“.', { status: 403 })).text).toContain('Ihnen fehlt das Recht „bearbeiten“.')
    expect(meldungFuer(new SpeicherFehler('zu-gross', 'x')).titel).toBe('Theme zu groß')
    expect(meldungFuer(new Error('kaputt'), 'Öffnen')).toEqual({ titel: 'Öffnen fehlgeschlagen', text: 'kaputt' })
  })
})

describe('Theme-Auswahl', () => {
  it('Liste mit aktiv/Status; Aktivieren nur veröffentlicht; aktives nicht löschbar; Öffnen', async () => {
    const sp = adapter()
    sp.liste.mockResolvedValue([
      meta('a', { aktiv: true, status: 'veroeffentlicht' }),
      meta('b', { status: 'entwurf' }),
      meta('c', { status: 'geaendert-seit-veroeffentlichung' }),
    ])
    sp.aktiviere.mockResolvedValue([
      meta('a', { status: 'veroeffentlicht' }),
      meta('b', { status: 'entwurf' }),
      meta('c', { aktiv: true, status: 'geaendert-seit-veroeffentlichung' }),
    ])
    setzeSpeicher(sp)
    await starteDrupalBetrieb(store)
    const w = montiere(DrupalThemeAuswahl)
    await knopf(w, 'drupal-theme-auswahl').trigger('click')
    const zeilen = w.findAll('li.dt-eintrag')
    expect(zeilen).toHaveLength(3)
    expect(zeilen[0].text()).toContain('aktiv')
    expect(zeilen[0].text()).toContain('Veröffentlicht')
    expect(zeilen[1].text()).toContain('Entwurf')
    expect(zeilen[2].text()).toContain('Geändert')
    // a ist aktiv: kein Aktivieren, Löschen gesperrt
    expect(zeilen[0].find('[data-test="drupal-aktivieren"]').exists()).toBe(false)
    expect(zeilen[0].find('[data-test="drupal-loeschen"]').attributes('disabled')).toBeDefined()
    // b Entwurf: Aktivieren gesperrt; c geändert seit Veröffentlichung: aktivierbar
    expect(zeilen[1].find('[data-test="drupal-aktivieren"]').attributes('disabled')).toBeDefined()
    expect(zeilen[2].find('[data-test="drupal-aktivieren"]').attributes('disabled')).toBeUndefined()
    const best = montiere(KonfigBestaetigung)
    await zeilen[2].find('[data-test="drupal-aktivieren"]').trigger('click')
    await flushPromises()
    // UX-05: erst Rückfrage, die das abgelöste Theme nennt
    expect(sp.aktiviere).not.toHaveBeenCalled()
    expect(best.text()).toContain('Theme aktivieren?')
    expect(best.text()).toContain('Es ersetzt „Theme a“')
    await best.find('[data-test="bestaetigung-ok"]').trigger('click')
    await flushPromises()
    expect(sp.aktiviere).toHaveBeenCalledWith('c')
    if (!w.find('li.dt-eintrag').exists()) await knopf(w, 'drupal-theme-auswahl').trigger('click')   // Liste schließt beim Dialog
    expect(w.findAll('li.dt-eintrag')[2].find('[data-test="drupal-loeschen"]').attributes('disabled')).toBeDefined()

    await w.findAll('li button.dt-oeffnen')[1].trigger('click')
    await flushPromises()
    expect(sp.lade).toHaveBeenCalledWith('b')
    expect(store.state.currentThemeMeta.id).toBe('b')
  })

  it('Neu anlegen startet vom NEO-Standard (Set neo, 1.1.0) und legt per POST an', async () => {
    const sp = adapter()
    setzeSpeicher(sp)
    await starteDrupalBetrieb(store)
    await useDrupalBetrieb().anlegen({ name: 'ACME', version: '1.0.0', vomStandard: true })
    expect(sp.ladeStandard).toHaveBeenCalled()
    const aufruf = sp.speichere.mock.calls[0][0]
    expect(aufruf.meta).toMatchObject({ name: 'ACME', version: '1.0.0' })
    expect(aufruf.meta.id).toBeUndefined()
    expect(aufruf.daten.activeThemeSet).toBe('neo')
    expect(aufruf.daten.themes.neo.light).toEqual(STANDARD.themes.neo.light)
    expect(aufruf.daten.themes.neo.dark).toEqual(STANDARD.themes.neo.dark)
    expect(useDrupalBetrieb().zustand.status).toBe('gespeichert')
  })

  it('NEO-Standard (1.1.0): fester Eintrag, aktiv ohne aktives Theme, Aktivieren nach Rückfrage', async () => {
    const sp = adapter({
      faehigkeiten: { veroeffentlichen: true, aktivieren: true, konflikterkennung: true, branchesUndReleases: false, vorschau: true, schriften: true },
      aktiviereNeoStandard: vi.fn(async () => [meta('a', { status: 'veroeffentlicht' })]),
    })
    sp.liste.mockResolvedValue([meta('a', { aktiv: true, status: 'veroeffentlicht' })])
    setzeSpeicher(sp)
    await starteDrupalBetrieb(store)
    const w = montiere(DrupalThemeAuswahl)
    const b = montiere(KonfigBestaetigung)
    await knopf(w, 'drupal-theme-auswahl').trigger('click')
    const neo = knopf(w, 'drupal-neo-standard')
    expect(neo.text()).toContain('NEO Design System (Standard)')
    expect(neo.text()).not.toContain('aktiv')
    await knopf(w, 'drupal-neo-aktivieren').trigger('click')
    await flushPromises()
    expect(b.text()).toContain('NEO-Standard aktivieren?')
    await b.find('[data-test="bestaetigung-ok"]').trigger('click')
    await flushPromises()
    expect(sp.aktiviereNeoStandard).toHaveBeenCalled()
    await knopf(w, 'drupal-theme-auswahl').trigger('click')
    expect(knopf(w, 'drupal-neo-standard').text()).toContain('aktiv')
    expect(knopf(w, 'drupal-neo-aktivieren').exists()).toBe(false)
  })

  it('NEO ansehen (15.10.2026): lädt den Standard ohne Theme, sperrt Änderungen, Öffnen beendet es', async () => {
    const sp = adapter({
      faehigkeiten: { veroeffentlichen: true, aktivieren: true, konflikterkennung: true, branchesUndReleases: false, vorschau: true, schriften: true },
      beendeVorschau: vi.fn(async () => {}),
    })
    sp.liste.mockResolvedValue([meta('a', { status: 'veroeffentlicht' })])
    setzeSpeicher(sp)
    await geoeffnet(sp)
    store.state.themes.neo.light['text-link'] = '#123456'
    useDrupalBetrieb().merkeStand()
    const w = montiere(DrupalThemeAuswahl)
    await knopf(w, 'drupal-theme-auswahl').trigger('click')
    await knopf(w, 'drupal-neo-oeffnen').trigger('click')
    await flushPromises()
    expect(useDrupalBetrieb().neoAnsicht.value).toBe(true)
    expect(store.state.currentThemeMeta).toBeNull()
    expect(store.state.activeThemeSet).toBe('neo')
    expect(store.state.themes.neo.light['text-link']).toBe(STANDARD.themes.neo.light['text-link'])
    expect(sp.beendeVorschau).toHaveBeenCalled()
    expect(knopf(w, 'drupal-theme-auswahl').text()).toContain('NEO Design System (ansehen)')
    // Schreibschutz: Änderungen kommen nicht an
    const vorher = store.state.primitiveOverrides.neo.accent
    store.updatePrimitive('accent', '#e06060')
    expect(store.state.primitiveOverrides.neo.accent).toBe(vorher)
    // Speichern bietet „Neu anlegen“ vom Standard an
    await useDrupalBetrieb().speichern()
    expect(useDrupalBetrieb().zustand.anlegen).toEqual({ vomStandard: true })
    useDrupalBetrieb().zustand.anlegen = null
    // Theme öffnen beendet die Ansicht
    await useDrupalBetrieb().oeffnen('a')
    expect(useDrupalBetrieb().neoAnsicht.value).toBe(false)
    store.updatePrimitive('accent', '#e06060')
    expect(store.state.primitiveOverrides.neo.accent).toBe('#e06060')
  })

  it('Website-Vorschau (1.1.0): nach Speichern gesetzt, Schalter beendet sie und merkt sich das', async () => {
    const sp = adapter({
      faehigkeiten: { veroeffentlichen: true, aktivieren: true, konflikterkennung: true, branchesUndReleases: false, vorschau: true, schriften: true },
      setzeVorschau: vi.fn(async (id) => ({ themeId: id, name: 'x', seit: '2026-10-14T00:00:00.000Z' })),
      beendeVorschau: vi.fn(async () => {}),
    })
    setzeSpeicher(sp)
    await starteDrupalBetrieb(store)
    const w = montiere(DrupalWerkzeuge)
    expect(knopf(w, 'drupal-vorschau').attributes('aria-pressed')).toBe('true')
    await useDrupalBetrieb().anlegen({ name: 'ACME', version: '1.0.0', vomStandard: true })
    expect(sp.setzeVorschau).toHaveBeenCalledWith('neu', expect.stringContaining('/* Theme: NEO-Standard */'))
    await knopf(w, 'drupal-vorschau').trigger('click')
    await flushPromises()
    expect(sp.beendeVorschau).toHaveBeenCalled()
    expect(knopf(w, 'drupal-vorschau').attributes('aria-pressed')).toBe('false')
    expect(localStorage.getItem('neo-theme-configurator-drupal-vorschau')).toBe('aus')
    sp.setzeVorschau.mockClear()
    await useDrupalBetrieb().speichern()
    expect(sp.setzeVorschau).not.toHaveBeenCalled()
    expect(knopf(w, 'drupal-website').attributes('href')).toBe('/')
    expect(knopf(w, 'drupal-website').attributes('target')).toBe('_blank')
  })

  it('Löschen fragt nach und ruft den Adapter mit If-Match aus dem Katalog', async () => {
    const sp = adapter()
    sp.liste.mockResolvedValue([meta('x')])
    setzeSpeicher(sp)
    await starteDrupalBetrieb(store)
    const b = montiere(KonfigBestaetigung)
    const laeuft = useDrupalBetrieb().loeschen('x')
    await nextTick()
    expect(b.text()).toContain('Theme löschen?')
    await b.find('[data-test="bestaetigung-ok"]').trigger('click')
    expect(await laeuft).toBe(true)
    expect(sp.loesche).toHaveBeenCalledWith('x', { etag: '"h-x"' })
    expect(store.state.savedThemes).toEqual([])
  })
})

describe('Veröffentlichen-Dialog', () => {
  async function dialogMit (sp, daten) {
    setzeSpeicher(sp)
    await geoeffnet(sp, daten)
    useDrupalBetrieb().zustand.veroeffentlichenOffen = true
    const w = montiere(DrupalVeroeffentlichenDialog)
    await nextTick()
    return w
  }
  const korrigiert = () => {
    const d = standardDaten(STANDARD)
    d.activeThemeSet = 'customer'
    d.themes.customer.light['on-danger'] = '#000000'
    d.themes.customer.light['on-success'] = '#000000'
    return d
  }

  const weissAufStatus = () => {
    const d = standardDaten(STANDARD)
    d.activeThemeSet = 'customer'
    d.themes.customer.light['on-danger'] = '#ffffff'
    d.themes.customer.light['on-success'] = '#ffffff'
    return d
  }

  it('NEO-Standard besteht die Prüfung', async () => {
    const w = await dialogMit(adapter(), { ...standardDaten(STANDARD), activeThemeSet: 'customer' })
    expect(knopf(w, 'kontrast-ergebnis').text()).toContain('Kontrastprüfung bestanden')
  })

  it('Weiße Schrift auf Statusflächen: Befundliste (Paare, Werte), Veröffentlichen gesperrt, kein Serveraufruf', async () => {
    const sp = adapter()
    const w = await dialogMit(sp, weissAufStatus())
    expect(knopf(w, 'kontrast-ergebnis').text()).toContain('Kontrastprüfung nicht bestanden')
    const zeilen = w.findAll('[data-test="kontrast-befunde"] tbody tr')
    expect(zeilen.map(z => z.text())).toEqual([
      expect.stringMatching(/hell.*#[0-9a-f]{3,8}.*#[0-9a-f]{3,8}.*3,35:1.*4,5:1.*Farbe ändern/i),
      expect.stringMatching(/hell.*#[0-9a-f]{3,8}.*#[0-9a-f]{3,8}.*3,35:1.*4,5:1.*Farbe ändern/i),
    ])   // UX-23: Klarname, Farbmuster mit Hex, Weg zur Korrektur
    expect(knopf(w, 'veroeffentlichen-los').attributes('disabled')).toBeDefined()
    await knopf(w, 'veroeffentlichen-los').trigger('click')
    expect(sp.veroeffentliche).not.toHaveBeenCalled()
  })

  it('korrigiert: bestanden → Veröffentlichen → Hinweis zur Auslieferung, Jetzt aktivieren', async () => {
    const sp = adapter()
    const w = await dialogMit(sp, korrigiert())
    expect(knopf(w, 'kontrast-ergebnis').text()).toContain('Kontrastprüfung bestanden')
    expect(knopf(w, 'veroeffentlichen-los').attributes('disabled')).toBeUndefined()
    await knopf(w, 'veroeffentlichen-los').trigger('click')
    await flushPromises()
    expect(sp.veroeffentliche).toHaveBeenCalledWith('t1', expect.objectContaining({ etag: '"h-t1"', kontrast: expect.objectContaining({ bestanden: true }), css: expect.any(String) }))
    const erfolg = knopf(w, 'veroeffentlichen-erfolg')
    expect(erfolg.text()).toContain('Besucher sehen noch nichts')   // UX-47: Klartext
    expect(erfolg.find('details').text()).toContain('CSS-Version 1')
    expect(knopf(w, 'veroeffentlichen-aktivieren').classes()).not.toContain('dk-knopf--primaer')   // UX-05: Sekundärknopf
    const best = montiere(KonfigBestaetigung)
    await knopf(w, 'veroeffentlichen-aktivieren').trigger('click')
    await flushPromises()
    expect(sp.aktiviere).not.toHaveBeenCalled()
    await best.find('[data-test="bestaetigung-ok"]').trigger('click')
    await flushPromises()
    expect(sp.aktiviere).toHaveBeenCalledWith('t1')
    expect(knopf(w, 'aktiviert-hinweis').exists()).toBe(true)
  })

  it('Server-422: zeigt die Befunde des Servers', async () => {
    const serverKontrast = { bestanden: false, verfahren: 'v', ergebnisse: [{ modus: 'dark', vordergrund: 'text-link', hintergrund: 'background-base', verhaeltnis: 2.1, mindestens: 4.5, bestanden: false }] }
    const sp = adapter({
      veroeffentliche: vi.fn(async () => { throw new SpeicherFehler('ungueltig', 'Die Kontrastprüfung des Servers ist nicht bestanden (Set customer).', { status: 422, details: { kontrast: serverKontrast } }) }),
    })
    const w = await dialogMit(sp, korrigiert())
    await knopf(w, 'veroeffentlichen-los').trigger('click')
    await flushPromises()
    const box = knopf(w, 'server-befunde')
    expect(box.text()).toContain('Drupal hat das Veröffentlichen abgelehnt')
    expect(box.text()).toMatch(/dunkel.*#[0-9a-f]{3,8}.*#[0-9a-f]{3,8}.*2,1:1/i)
  })

  it('ungespeicherte Änderungen sperren; 412 öffnet den Konfliktdialog', async () => {
    const sp = adapter({ veroeffentliche: vi.fn(async () => { throw new SpeicherFehler('veraltet', 'x', { status: 412 }) }) })
    const w = await dialogMit(sp, korrigiert())
    useDrupalBetrieb().zustand.status = 'ungespeichert'
    await nextTick()
    expect(knopf(w, 'veroeffentlichen-sperre').text()).toContain('speichern Sie zuerst')
    expect(knopf(w, 'speichern-und-pruefen').exists()).toBe(true)   // UX-22
    expect(knopf(w, 'veroeffentlichen-los').attributes('disabled')).toBeDefined()
    useDrupalBetrieb().zustand.status = 'gespeichert'
    await nextTick()
    await knopf(w, 'veroeffentlichen-los').trigger('click')
    await flushPromises()
    expect(useDrupalBetrieb().zustand.veroeffentlichenOffen).toBe(false)
    expect(useDrupalBetrieb().zustand.konflikt).toMatchObject({ art: 'veraltet' })
  })
})

// ---------------------------------------------------------------------------
// Paket 5, Block 5a (16.10.2026): UX-22, UX-23, UX-24, UX-26, UX-27, UX-28, UX-47
// ---------------------------------------------------------------------------
import DrupalAnlegenDialog from '../../src/components/drupal/DrupalAnlegenDialog.vue'
import KontrastBefunde from '../../src/components/drupal/KontrastBefunde.vue'
import { erzeugeDrupalSpeicher } from '../../src/speicher/drupal.js'

const antworte = async (wert) => { await flushPromises(); useBestaetigung().aktuelleAnfrage.value.erledigen(wert); await flushPromises() }

describe('Block 5a: Speichern und Veröffentlichen', () => {
  it('UX-28: abgelaufenes Sicherheits-Token wird einmal neu geholt, die Anfrage wiederholt', async () => {
    let tokenNr = 0
    const aufrufe = []
    const fetch = vi.fn(async (url, opt = {}) => {
      if (url === '/session/token') return new Response(`tok-${++tokenNr}`, { status: 200 })
      aufrufe.push(opt.headers?.['X-CSRF-Token'])
      if (opt.headers?.['X-CSRF-Token'] === 'tok-1') return new Response(JSON.stringify({ type: 'https://neo/problem/csrf', title: 'CSRF-Token ungültig' }), { status: 403, headers: { 'Content-Type': 'application/problem+json' } })
      return new Response(JSON.stringify({ themes: [] }), { status: 200, headers: { 'Content-Type': 'application/json' } })
    })
    const sp = erzeugeDrupalSpeicher({ basisUrl: '/api', fetch, rechte: ALLE })
    await sp.loesche('t1', { etag: '"x"' })
    expect(aufrufe).toEqual(['tok-1', 'tok-2'])
  })

  it('UX-26: Speichern eines anderswo gelöschten Themes bietet „Als neues Theme speichern“', async () => {
    const sp = adapter()
    setzeSpeicher(sp)
    await geoeffnet(sp)
    store.state.radii = { ...(store.state.radii || {}) }
    sp.speichere.mockRejectedValueOnce(new SpeicherFehler('nicht-gefunden', 'Nicht gefunden', { status: 404 }))
    const lauf = useDrupalBetrieb().speichern()
    await flushPromises()
    expect(useBestaetigung().aktuelleAnfrage.value.titel).toBe('Theme wurde gelöscht')
    await antworte(true)
    await lauf
    expect(sp.speichere).toHaveBeenLastCalledWith(expect.objectContaining({ meta: expect.objectContaining({ name: 'Theme t1 (gerettet)' }) }))
  })

  it('UX-27: neuerer Stand in Drupal wird beim Start ohne eigene Änderungen still geladen', async () => {
    const sp = adapter()
    setzeSpeicher(sp)
    await geoeffnet(sp)
    _zuruecksetzenDrupalBetrieb()
    sp.liste.mockResolvedValue([meta('t1', { hash: 'h-neuer' })])
    sp.lade.mockResolvedValue({ meta: meta('t1', { hash: 'h-neuer' }), daten: standardDaten(STANDARD), etag: '"h-neuer"' })
    const vorher = sp.lade.mock.calls.length
    await starteDrupalBetrieb(store)
    await flushPromises()
    expect(sp.lade.mock.calls.length).toBe(vorher + 1)
    expect(store.state.currentThemeMeta.etag).toBe('"h-neuer"')
    expect(useDrupalBetrieb().zustand.status).toBe('gespeichert')
  })

  it('UX-27: das geöffnete Theme erneut wählen lädt neu', async () => {
    const sp = adapter()
    setzeSpeicher(sp)
    await geoeffnet(sp)
    const vorher = sp.lade.mock.calls.length
    await useDrupalBetrieb().oeffnen('t1')
    expect(sp.lade.mock.calls.length).toBe(vorher + 1)
  })

  it('UX-24: doppelter Name und ungültige Version werden am Feld gemeldet', async () => {
    setzeSpeicher(adapter())
    store.state.savedThemes = [meta('t1', { name: 'Kundentheme NEU' })]
    useDrupalBetrieb().zustand.anlegen = { vomStandard: true }
    const w = montiere(DrupalAnlegenDialog)
    await nextTick()
    await w.find('#cfg-drupal-neu-name').setValue(' kundentheme neu ')
    expect(knopf(w, 'drupal-neu-name-fehler').text()).toContain('gibt es schon')
    expect(knopf(w, 'drupal-neu-anlegen').attributes('disabled')).toBeDefined()
    await w.find('#cfg-drupal-neu-name').setValue('Stadtwerke')
    await w.find('#cfg-drupal-neu-version').setValue('1.0')
    expect(knopf(w, 'drupal-neu-version-fehler').text()).toContain('1.0.0')
    await w.find('#cfg-drupal-neu-version').setValue('1.2.0')
    expect(knopf(w, 'drupal-neu-anlegen').attributes('disabled')).toBeUndefined()
  })

  it('UX-23: „Farbe ändern“ springt zur Farbrolle im richtigen Modus', async () => {
    setzeSpeicher(adapter())
    const w = montiere(KontrastBefunde, { props: { befunde: [{ modus: 'dark', vordergrund: 'text-link', hintergrund: 'background-base', verhaeltnis: 2.1, mindestens: 4.5, bestanden: false }] } })
    expect(w.text()).toMatch(/#[0-9a-f]{3,8}/i)
    await knopf(w, 'kontrast-korrigieren-0').trigger('click')
    expect(store.state.colorActiveTab).toBe('semantic')
    expect(store.state.selectedToken.id).toBe('text-link')
    expect(store.state.bearbeitungsModus).toBe('dark')
    expect(location.hash).toBe('#/foundation/colors')
    expect(w.emitted('korrigieren')[0]).toEqual(['text-link'])
  })
})
