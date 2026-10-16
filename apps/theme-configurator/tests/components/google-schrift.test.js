// UX-14: Google-Schrift mit falscher Adresse wurde angenommen und auf der
// Website still ignoriert (15.10.2026)
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import TypographyEditor from '../../src/components/foundation/TypographyEditor.vue'
import { useThemeStore } from '../../src/stores/theme.js'
import { familienAusUrl, baueGoogleUrl, pruefeFamilieZurUrl, pruefeLadbarkeit } from '../../src/utils/google-schrift.js'

const rueckfrage = vi.hoisted(() => ({ antwort: true, text: '' }))
vi.mock('../../src/composables/useBestaetigung.js', () => ({ bestaetigen: (o) => { rueckfrage.text = o.text; return Promise.resolve(rueckfrage.antwort) } }))

describe('google-schrift.js', () => {
  it('liest Familien aus css und css2', () => {
    expect(familienAusUrl('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&family=Inter&display=swap')).toEqual(['Open Sans', 'Inter'])
    expect(familienAusUrl('https://fonts.googleapis.com/css?family=Roboto|Lato:400,700')).toEqual(['Roboto', 'Lato'])
    expect(familienAusUrl('keine adresse')).toEqual([])
  })
  it('baut eine Adresse ohne Stärken', () => {
    expect(baueGoogleUrl('Open Sans')).toBe('https://fonts.googleapis.com/css2?family=Open+Sans&display=swap')
    expect(familienAusUrl(baueGoogleUrl('Source Sans 3'))).toEqual(['Source Sans 3'])
  })
  it('Adresse und Font-Stack müssen dieselbe Familie nennen', () => {
    expect(pruefeFamilieZurUrl('Inter, sans-serif', baueGoogleUrl('Inter'))).toBeNull()
    expect(pruefeFamilieZurUrl("'open sans', Arial", baueGoogleUrl('Open Sans'))).toBeNull()
    expect(pruefeFamilieZurUrl('Inter, sans-serif', baueGoogleUrl('Roboto'))).toMatch(/lädt „Roboto“.*„Inter“/)
    expect(pruefeFamilieZurUrl('Inter', 'https://fonts.googleapis.com/css2?display=swap')).toMatch(/keine Schrift/)
  })
  it('Ladbarkeit: Fehler des Stylesheets oder keine Schrift in document.fonts = fehler', async () => {
    const l1 = document.createElement('link'); const p1 = pruefeLadbarkeit(l1, 'Gibtsnicht')
    l1.dispatchEvent(new Event('error')); expect(await p1).toBe('fehler')
    const fonts = { load: vi.fn().mockResolvedValue([]) }
    vi.stubGlobal('document', Object.assign(Object.create(document), { fonts }))
    const l2 = window.document.createElement('link'); const p2 = pruefeLadbarkeit(l2, 'Leer')
    l2.dispatchEvent(new Event('load')); expect(await p2).toBe('fehler')
    fonts.load.mockResolvedValue([{}])
    const l3 = window.document.createElement('link'); const p3 = pruefeLadbarkeit(l3, 'Inter')
    l3.dispatchEvent(new Event('load')); expect(await p3).toBe('ok')
    vi.unstubAllGlobals()
  })
})

describe('Typografie-Editor: eigene Google-Schrift', () => {
  let store, w, links
  beforeEach(() => {
    localStorage.clear()
    store = useThemeStore(); store.state.activeThemeSet = 'neo'
    store.state.currentThemeMeta = { id: 't1', name: 'Kunde' }
    store.state.customFonts.neo = []
    // kein Netzwerk: Stylesheets werden nicht wirklich eingehängt
    links = []
    const echt = document.head.appendChild.bind(document.head)
    vi.spyOn(document.head, 'appendChild').mockImplementation((el) => (el.tagName === 'LINK' ? (links.push(el), el) : echt(el)))
  })
  afterEach(() => { w?.unmount(); vi.restoreAllMocks(); store.state.currentThemeMeta = null; store.state.customFonts.neo = [] })

  async function hinzufuegen (name, stack, url = '') {
    await w.find('.add-font-btn').trigger('click')
    await w.find('#gf-neu-name').setValue(name)
    await w.find('#gf-neu-stack').setValue(stack)
    await w.find('#gf-neu-url').setValue(url)
    await w.find('.btn-add-confirm').trigger('click')
  }

  it('ohne Adresse: Adresse wird aus dem Font-Stack gebaut und geladen', async () => {
    w = mount(TypographyEditor)
    await hinzufuegen('Lato', 'Lato, sans-serif')
    expect(store.state.customFonts.neo[0].url).toBe('https://fonts.googleapis.com/css2?family=Lato&display=swap')
    expect(links.map(l => l.href)).toContain('https://fonts.googleapis.com/css2?family=Lato&display=swap')
    expect(store.exportAsCSSVars()).toContain('@import url("https://fonts.googleapis.com/css2?family=Lato&display=swap");')
  })

  it('Adresse einer anderen Familie wird abgelehnt', async () => {
    w = mount(TypographyEditor)
    await hinzufuegen('Inter', 'Inter, sans-serif', 'https://fonts.googleapis.com/css2?family=Roboto&display=swap')
    expect(store.state.customFonts.neo).toEqual([])
    expect(w.text()).toContain('der Font-Stack beginnt aber mit „Inter“')
  })

  it('Google liefert die Familie nicht → „Nicht ladbar“ an der Schrift', async () => {
    w = mount(TypographyEditor)
    await hinzufuegen('Gibtsnicht', 'Gibtsnicht, sans-serif')
    const id = store.state.customFonts.neo[0].id
    links.at(-1).dispatchEvent(new Event('error'))
    await flushPromises()
    expect(w.find(`[data-test="schrift-stand-${id}"]`).text()).toContain('Nicht ladbar')
  })

  it('alte Schrift ohne Adresse: Hinweis und Knopf baut die Adresse', async () => {
    store.state.customFonts.neo = [{ id: 'alt', name: 'Arimo', family: 'Arimo, Arial', url: '' }]
    w = mount(TypographyEditor)
    expect(w.find('[data-test="schrift-stand-alt"]').text()).toContain('lädt die Website diese Schrift nicht')
    await w.find('[data-test="schrift-adresse-bauen-alt"]').trigger('click')
    expect(store.state.customFonts.neo[0].url).toBe('https://fonts.googleapis.com/css2?family=Arimo&display=swap')
  })

  it('UX-35: deutsches Formular mit Sperrgrund', async () => {
    w = mount(TypographyEditor)
    await w.find('.add-font-btn').trigger('click')
    expect(w.find('label[for="gf-neu-name"]').text()).toContain('Name')
    expect(w.find('[data-test="gf-neu-sperrgrund"]').exists()).toBe(true)
    expect(w.find('.btn-add-confirm').text()).toBe('Hinzufügen')
  })

  it('UX-36: „Als Body“ übernimmt den eingegebenen Stack', async () => {
    store.state.customFonts.neo = [{ id: 'lato', name: 'Lato', family: 'Lato, Georgia, serif', url: baueGoogleUrl('Lato') }]
    w = mount(TypographyEditor)
    await w.find('[data-test="google-schrift-rolle-body"]').trigger('click')
    expect(store.currentFoundation.typography['font-body']).toBe('Lato, Georgia, serif')
  })

  it('UX-49: Entfernen fragt nach und setzt die Rolle zurück', async () => {
    store.state.customFonts.neo = [{ id: 'lato', name: 'Lato', family: 'Lato, Georgia, serif', url: baueGoogleUrl('Lato') }]
    store.updateFoundationToken('typography', 'font-body', 'Lato, Georgia, serif')
    w = mount(TypographyEditor)
    rueckfrage.antwort = false
    await w.find('button[aria-label="Lato entfernen"]').trigger('click'); await flushPromises()
    expect(store.state.customFonts.neo).toHaveLength(1)
    rueckfrage.antwort = true
    await w.find('button[aria-label="Lato entfernen"]').trigger('click'); await flushPromises()
    expect(rueckfrage.text).toContain('als Body zugewiesen')
    expect(store.state.customFonts.neo).toHaveLength(0)
    expect(store.currentFoundation.typography['font-body']).not.toContain('Lato')
  })
})
