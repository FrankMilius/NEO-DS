// UX-52 (19.10.2026): ein gemeinsames Formular „… hinzufügen“
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { useThemeStore } from '../../src/stores/theme.js'
import HinzufuegenFormular from '../../src/components/ui/HinzufuegenFormular.vue'
import RadiiEditor from '../../src/components/foundation/RadiiEditor.vue'
import MediaRatioEditor from '../../src/components/foundation/MediaRatioEditor.vue'
import OpacityZindexMotionEditor from '../../src/components/foundation/OpacityZindexMotionEditor.vue'
import SpacingInspector from '../../src/components/foundation/SpacingInspector.vue'
import IconsEditor from '../../src/components/foundation/IconsEditor.vue'
import FoundationColors from '../../src/components/foundation/FoundationColors.vue'
import { pruefeNeuenNamen, pruefeNeuenWert } from '../../src/utils/token-pruefung.js'

let store, w
const ticks = async () => { await nextTick(); await nextTick() }
beforeEach(() => { localStorage.clear(); store = useThemeStore(); store.resetToDefaults(); store.state.activeThemeSet = 'neo' })
afterEach(() => { w?.unmount(); w = null; document.body.innerHTML = '' })

describe('Prüfhilfen', () => {
  it('Namen: Format und Dubletten', () => {
    expect(pruefeNeuenNamen('panel-gross', [])).toBeNull()
    expect(pruefeNeuenNamen('Panel Groß')).toMatch(/nicht möglich/)
    expect(pruefeNeuenNamen('md', ['md'])).toMatch(/gibt es schon/)
    expect(pruefeNeuenNamen('')).toBe('Bitte einen Namen eingeben.')
  })
  it('Werte nach Art und Bereich', () => {
    expect(pruefeNeuenWert('laenge', '20px')).toBeNull()
    expect(pruefeNeuenWert('laenge', 'zwanzig')).toMatch(/keine Länge/)
    expect(pruefeNeuenWert('zahl', '1.5', 'opacity')).toMatch(/zwischen 0 und 1/)
    expect(pruefeNeuenWert('verhaeltnis', '21 / 9')).toBeNull()
  })
})

describe('HinzufuegenFormular', () => {
  const felder = [{ name: 'name', label: 'Name' }, { name: 'wert', label: 'Wert' }]
  const pruefe = (x) => (x.name ? null : { feld: 'name', text: 'Bitte einen Namen eingeben.' })
  it('öffnet mit Fokus im ersten Feld, Escape schließt und gibt den Fokus zurück', async () => {
    w = mount(HinzufuegenFormular, { props: { knopfText: 'Ding hinzufügen', felder, pruefe }, attachTo: document.body })
    await w.find('.hf-oeffnen').trigger('click'); await ticks()
    expect(document.activeElement.id).toMatch(/-name$/)
    expect(w.find('label').text()).toBe('Name')
    await w.find('form').trigger('keydown', { key: 'Escape' }); await ticks()
    expect(w.find('form').exists()).toBe(false)
    expect(document.activeElement).toBe(w.find('.hf-oeffnen').element)
  })
  it('Fehler am Feld (aria-invalid, Meldung), gültig → Ereignis und Ansage', async () => {
    w = mount(HinzufuegenFormular, { props: { knopfText: 'Ding hinzufügen', felder, pruefe }, attachTo: document.body })
    await w.find('.hf-oeffnen').trigger('click'); await ticks()
    await w.find('form').trigger('submit'); await ticks()
    expect(w.find('[data-test="hinzufuegen-fehler"]').text()).toBe('Bitte einen Namen eingeben.')
    expect(w.find('input').attributes('aria-invalid')).toBe('true')
    await w.findAll('input')[0].setValue('neu'); await w.findAll('input')[1].setValue('5px')
    await w.find('form').trigger('submit'); await ticks()
    expect(w.emitted('hinzufuegen').at(-1)[0]).toEqual({ name: 'neu', wert: '5px' })
    expect(w.text()).toContain('„neu“ hinzugefügt.')
  })
  it('Farbfeld: Farbwähler und HEX-Feld zeigen denselben Wert, feste IDs, Pflichtmarke', async () => {
    const farbe = [{ name: 'name', label: 'Name', pflicht: true }, { name: 'ton', label: 'Grundton', typ: 'farbe', start: '#e06060' }]
    w = mount(HinzufuegenFormular, { props: { knopfText: 'Palette hinzufügen', felder: farbe, idBasis: 'pal' }, attachTo: document.body })
    await w.find('.hf-oeffnen').trigger('click'); await ticks()
    expect(w.find('#pal-name').exists()).toBe(true)
    expect(w.find('label[for="pal-name"] abbr').attributes('title')).toBe('Pflichtfeld')
    expect(w.find('input[type="color"]').element.value).toBe('#e06060')
    expect(w.find('input[type="color"]').attributes('aria-label')).toBe('Grundton wählen')
    await w.find('#pal-ton').setValue('0f0')
    expect(w.find('input[type="color"]').element.value).toBe('#00ff00')
    await w.find('input[type="color"]').setValue('#123456')
    expect(w.find('#pal-ton').element.value).toBe('#123456')
  })
})

describe('Editoren nutzen das gemeinsame Formular', () => {
  async function ausfuellen (komp, werte) {
    w = mount(komp, { attachTo: document.body })
    await w.find('.hf-oeffnen').trigger('click'); await ticks()
    const felder = w.findAll('.hf-formular input, .hf-formular select')
    for (const [i, v] of werte.entries()) await felder[i].setValue(v)
    await w.find('.hf-formular').trigger('submit'); await ticks()
  }
  it('Eckenradius: gültig landet im Store, Dublette wird gemeldet', async () => {
    await ausfuellen(RadiiEditor, ['panel', '20px'])
    expect(store.currentCustomRadiiTokens.panel.value).toBe('20px')
    w.unmount(); w = null
    await ausfuellen(RadiiEditor, ['md', '5px'])
    expect(w.find('[data-test="hinzufuegen-fehler"]').text()).toMatch(/gibt es schon/)
  })
  it('Seitenverhältnis: Name aus der Bezeichnung, Wert geprüft', async () => {
    await ausfuellen(MediaRatioEditor, ['21:9 Ultrawide', '21 / 9'])
    expect(store.currentCustomMediaRatioTokens['21-9-ultrawide'].value).toBe('21 / 9')
  })
  it('Deckkraft außerhalb 0–1 wird abgelehnt', async () => {
    await ausfuellen(OpacityZindexMotionEditor, ['hinweis', '2'])
    expect(w.find('[data-test="hinzufuegen-fehler"]').text()).toMatch(/zwischen 0 und 1/)
  })
  it('Abstand: vorhandener Pixelwert wird gemeldet (vorher still deaktiviert)', async () => {
    await ausfuellen(SpacingInspector, ['16'])
    expect(w.find('[data-test="hinzufuegen-fehler"]').text()).toMatch(/16 px gibt es schon/)
  })
})

describe('Icons, Paletten und Schriften nutzen das gemeinsame Formular', () => {
  async function oeffne (komp, testId) {
    w = mount(komp, { attachTo: document.body })
    const f = () => w.find(`[data-test="${testId}"]`)
    await f().find('.hf-oeffnen').trigger('click'); await ticks()
    return f
  }
  async function absenden (f, werte) {
    for (const [id, v] of Object.entries(werte)) await f().find(`#${id}`).setValue(v)
    await f().find('form').trigger('submit'); await ticks()
  }
  it('Icon-Bibliothek: npm-Paket geprüft, Dublette gemeldet, gültig landet im Store', async () => {
    const f = await oeffne(IconsEditor, 'icon-bibliothek-neu')
    await absenden(f, { 'icon-bibliothek-neu-name': 'Lucide Icons', 'icon-bibliothek-neu-paket': 'Lucide Static' })
    expect(f().find('[data-test="hinzufuegen-fehler"]').text()).toMatch(/kein npm-Paketname/)
    expect(f().find('#icon-bibliothek-neu-paket').attributes('aria-invalid')).toBe('true')
    await absenden(f, { 'icon-bibliothek-neu-paket': '@lucide/static' })
    expect(store.currentIconLibraries.at(-1)).toMatchObject({ id: 'lucide-icons', name: 'Lucide Icons', npmPackage: '@lucide/static' })
    await f().find('.hf-oeffnen').trigger('click'); await ticks()
    await absenden(f, { 'icon-bibliothek-neu-name': 'lucide icons', 'icon-bibliothek-neu-paket': 'lucide-static' })
    expect(f().find('[data-test="hinzufuegen-fehler"]').text()).toMatch(/„Lucide Icons“ gibt es schon/)
  })
  it('Ergänzende Palette: HEX geprüft, Kennung über alle Paletten eindeutig, Stufenvorschau', async () => {
    store.state.colorActiveTab = 'primitives'
    store.state.currentThemeMeta = { id: 'kunde-a', name: 'Kunde A' }
    const f = await oeffne(FoundationColors, 'ergaenzende-palette-neu')
    expect(f().findAll('.shade-chip').length).toBeGreaterThan(5)
    await absenden(f, { 'ergaenzende-palette-neu-name': 'Primary', 'ergaenzende-palette-neu-grundton': '#e06060' })
    expect(f().find('[data-test="hinzufuegen-fehler"]').text()).toMatch(/gibt es schon/)
    await absenden(f, { 'ergaenzende-palette-neu-name': 'Koralle', 'ergaenzende-palette-neu-grundton': 'rot' })
    expect(f().find('[data-test="hinzufuegen-fehler"]').text()).toMatch(/keine HEX-Farbe/)
    expect(f().findAll('.shade-chip').length).toBe(0)
    await absenden(f, { 'ergaenzende-palette-neu-grundton': 'e06' })
    expect(w.text()).toContain('Koralle')
    expect(Object.values(localStorage).some(v => v.includes('"base":"#ee0066"'))).toBe(true)
    store.state.currentThemeMeta = null
  })
})
