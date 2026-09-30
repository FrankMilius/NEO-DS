// Theme-Import (Plan v2, 2.2): Schema-Pruefung, Vorschau, Uebernehmen mit Undo
import { describe, it, expect, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { useThemeStore, THEME_DATA_KEYS } from '../../src/stores/theme.js'
import { IMPORT_ZUORDNUNG, pruefeThemeImport, istFarbe } from '../../src/import/theme-import.js'
import { VERLAUF_AKTIONEN } from '../../src/stores/theme/verlauf.js'
import ThemeImportDialog from '../../src/components/workflow/ThemeImportDialog.vue'
import DtcgExportDialog from '../../src/components/workflow/DtcgExportDialog.vue'

function frisch() {
  const store = useThemeStore()
  store.state.activeThemeSet = 'neo'
  store.resetToDefaults()
  store.state.history = []
  store.state.historyIndex = -1
  return store
}

/** Export eines veraenderten Themes, danach Werkseinstellung. */
function exportMitAenderungen(store) {
  store.state.themes.neo.light['text-primary'] = '#123456'
  store.state.themes.neo.dark['text-primary'] = '#abcdef'
  store.state.componentOverrides.neo['nc-button-fab-radius'] = '6px'
  store.state.foundationOverrides.neo.spacing['03'] = '14px'
  store.state.typeScale.neo = { ratio_max: 1.25 }
  store.state.focusRingMode.neo = 'inset'
  const json = store.exportAsJSON()
  frisch()
  return json
}

const gueltig = () => JSON.stringify({ meta: { name: 'Kunde', version: '1.2.0' }, semantic: { light: { 'text-primary': '#112233' } } })

describe('Schema-Prüfung', () => {
  it('jeder Import-Bereich zielt auf einen Schlüssel aus THEME_DATA_KEYS', () => {
    for (const ziele of Object.values(IMPORT_ZUORDNUNG)) for (const k of ziele) expect(THEME_DATA_KEYS).toContain(k)
    expect(VERLAUF_AKTIONEN).toContain('importTheme')
  })

  it('ein Export aus exportAsJSON ist ein gültiger Import', () => {
    const store = frisch()
    const erg = pruefeThemeImport(exportMitAenderungen(store))
    expect(erg.fehler).toEqual([])
    expect(erg.ok).toBe(true)
  })

  it('kaputtes JSON wird abgelehnt', () => {
    const erg = pruefeThemeImport('{ "meta": ')
    expect(erg.ok).toBe(false)
    expect(erg.fehler[0]).toMatch(/kein gültiges JSON/)
  })

  it('falscher Typ wird abgelehnt', () => {
    expect(pruefeThemeImport('[1, 2]').fehler[0]).toMatch(/JSON-Objekt/)
    const erg = pruefeThemeImport(JSON.stringify({ meta: { version: '1.0.0' }, semantic: 'rot', typeScale: { ratio_max: '1.3' } }))
    expect(erg.ok).toBe(false)
    expect(erg.fehler.join('\n')).toMatch(/„semantic“ muss ein Objekt sein/)
    expect(erg.fehler.join('\n')).toMatch(/typeScale.ratio_max“ muss eine positive Zahl/)
  })

  it('unbekannte Schlüssel werden abgelehnt', () => {
    const erg = pruefeThemeImport(JSON.stringify({ meta: { version: '1.0.0' }, farben: {}, semantic: { light: { 'gibt-es-nicht': '#fff' } }, foundation: { spacing: { '99': '1px' } } }))
    expect(erg.ok).toBe(false)
    const t = erg.fehler.join('\n')
    expect(t).toMatch(/Unbekannter Schlüssel „farben“/)
    expect(t).toMatch(/semantic.light.gibt-es-nicht/)
    expect(t).toMatch(/foundation.spacing.99/)
  })

  it('ungültige Farben werden abgelehnt', () => {
    const erg = pruefeThemeImport(JSON.stringify({ meta: { version: '1.0.0' }, semantic: { light: { 'text-primary': 'blau' } }, primitives: { primary: '#12345' } }))
    expect(erg.ok).toBe(false)
    expect(erg.fehler.join('\n')).toMatch(/Ungültiger Farbwert für „semantic.light.text-primary“/)
    expect(erg.fehler.join('\n')).toMatch(/Ungültiger Farbwert für „primitives.primary“/)
    expect(istFarbe('#1618168c')).toBe(true)
    expect(istFarbe('color-mix(in srgb, var(--x) 20%, transparent)')).toBe(true)
    expect(istFarbe('red; background: url(x)')).toBe(false)
  })

  it('fehlendes oder falsches Versionsfeld wird abgelehnt', () => {
    expect(pruefeThemeImport(JSON.stringify({ semantic: { light: {} } })).fehler.join()).toMatch(/meta/)
    expect(pruefeThemeImport(JSON.stringify({ meta: { version: 'neu' }, semantic: { light: {} } })).fehler.join()).toMatch(/meta.version/)
  })
})

describe('Import in den Store', () => {
  beforeEach(() => { frisch() })

  it('Vorschau zählt Änderungen je Bereich, ohne etwas zu ändern', () => {
    const store = useThemeStore()
    const json = exportMitAenderungen(store)
    const vorher = JSON.stringify(store.snapshotThemeData())
    const erg = store.pruefeImport(json)
    expect(erg.ok).toBe(true)
    const bereich = Object.fromEntries(erg.vorschau.map((b) => [b.schluessel, b]))
    expect(bereich.themes.anzahl).toBe(2)
    expect(bereich.themes.beispiele[0]).toMatchObject({ pfad: 'light.text-primary', neu: '#123456' })
    expect(bereich.componentOverrides.anzahl).toBe(1)
    expect(bereich.foundationOverrides.anzahl).toBe(1)
    expect(bereich.typeScale.anzahl).toBe(1)
    expect(bereich.focusRingMode.anzahl).toBe(1)
    expect(JSON.stringify(store.snapshotThemeData())).toBe(vorher)
    expect(store.state.history.length).toBe(0)
  })

  it('gültiger Import übernimmt alles in einem Schritt und ist per Undo rücknehmbar', () => {
    const store = useThemeStore()
    const json = exportMitAenderungen(store)
    store.state.history = []
    store.state.historyIndex = -1
    const vorher = JSON.stringify(store.snapshotThemeData())
    store.importTheme(store.pruefeImport(json).ziel)
    expect(store.state.themes.neo.light['text-primary']).toBe('#123456')
    expect(store.state.themes.neo.dark['text-primary']).toBe('#abcdef')
    expect(store.state.componentOverrides.neo['nc-button-fab-radius']).toBe('6px')
    expect(store.state.foundationOverrides.neo.spacing['03']).toBe('14px')
    expect(store.state.typeScale.neo).toEqual({ ratio_max: 1.25 })
    expect(store.state.focusRingMode.neo).toBe('inset')
    expect(store.state.history.length).toBe(1)
    store.undo()
    expect(JSON.stringify(store.snapshotThemeData())).toBe(vorher)
    store.redo()
    expect(store.state.themes.neo.light['text-primary']).toBe('#123456')
  })
})

describe('Dialoge', () => {
  beforeEach(() => { frisch() })

  it('ThemeImportDialog mountet, zeigt Fehler und Vorschau; Übernehmen ändert, Abbrechen nicht', async () => {
    const store = useThemeStore()
    const w = mount(ThemeImportDialog, { props: { visible: true }, global: { stubs: { Transition: false } } })
    expect(w.text()).toContain('Theme importieren')
    expect(w.find('[data-test="import-uebernehmen"]').attributes('disabled')).toBeDefined()

    w.vm.pruefeText('{ kaputt', 'kaputt.json')
    await w.vm.$nextTick()
    expect(w.find('[data-test="import-fehler"]').text()).toMatch(/Import abgelehnt/)

    w.vm.pruefeText(gueltig(), 'kunde.theme.json')
    await w.vm.$nextTick()
    expect(w.find('[data-test="import-vorschau"]').text()).toMatch(/Semantische Farben/)
    expect(w.find('[data-test="import-vorschau"]').text()).toMatch(/1 Änderung/)

    await w.findAll('.modal-btn').find((b) => b.text() === 'Abbrechen').trigger('click')
    expect(w.emitted('close')).toBeTruthy()
    expect(store.state.themes.neo.light['text-primary']).not.toBe('#112233')

    await w.find('[data-test="import-uebernehmen"]').trigger('click')
    expect(store.state.themes.neo.light['text-primary']).toBe('#112233')
    expect(w.emitted('imported')[0][0]).toMatchObject({ name: 'Kunde' })
  })

  it('DtcgExportDialog mountet und zeigt den Export ohne Änderungen', async () => {
    const w = mount(DtcgExportDialog, { props: { visible: true }, global: { stubs: { Transition: false } } })
    expect(w.text()).toContain('DTCG-Export (W3C Design Tokens)')
    for (let i = 0; i < 20 && !w.text().includes('Keine —'); i++) { await flushPromises(); await new Promise((r) => setTimeout(r, 50)) }
    expect(w.text()).toContain('Keine — der Export entspricht dem NEO-Standard')
    expect(w.find('.modal-btn.primary').attributes('disabled')).toBeUndefined()
  })
})
