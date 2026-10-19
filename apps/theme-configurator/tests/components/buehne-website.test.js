// Grundsatz „Bühne = Ausschnitt der echten Website“ (Frank, 19.10.2026):
// HTML-Elemente und Themes zeigen echtes Markup im geöffneten Theme,
// Seitenverhältnisse die Komponente nc-aspect-ratio, breitenabhängige
// Komponenten öffnen im Geräterahmen „Desktop“.
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { useThemeStore } from '../../src/stores/theme.js'
import ElementeBuehne from '../../src/components/laboratory/foundation/ElementeBuehne.vue'
import ThemesBuehne from '../../src/components/laboratory/foundation/ThemesBuehne.vue'
import FoundationWirkung from '../../src/components/laboratory/foundation/FoundationWirkung.vue'
import { ebeneDerSektion } from '../../src/data/navigation-builder.js'
import { sektionAufloesen } from '../../src/navigation/sektionen.js'

let store, w
beforeEach(() => { localStorage.clear(); store = useThemeStore(); store.resetToDefaults(); store.state.activeThemeSet = 'neo'; store.state.previewMode = 'light' })
afterEach(() => { w?.unmount(); w = null })

describe('HTML-Elemente', () => {
  it('zeigt die Elemente selbst statt Token-Tabellen', () => {
    w = mount(ElementeBuehne)
    for (const tag of ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'ul', 'ol', 'blockquote', 'pre', 'figure', 'hr']) {
      expect(w.find(`[data-test="elemente-buehne"] ${tag}`).exists(), tag).toBe(true)
    }
    expect(w.find('table.nc-compare-table').exists()).toBe(true)
    expect(w.find('button.nc-button.nc-button--primary').exists()).toBe(true)
    expect(w.text()).not.toMatch(/var\(--fnd-/)
  })
  it('folgt dem Vorschaumodus: Hell, Nebeneinander, Alle vier', async () => {
    w = mount(ElementeBuehne)
    const klassen = () => w.findAll('[data-test^="website-ausschnitt-"]').map((a) => a.classes().find((k) => k.endsWith('-theme')))
    expect(klassen()).toEqual(['neo-light-theme'])
    store.state.previewMode = 'split'; await nextTick()
    expect(klassen()).toEqual(['neo-light-theme', 'neo-dark-theme'])
    store.state.previewMode = 'matrix'; await nextTick()
    expect(klassen()).toEqual(['neo-light-theme', 'neo-dark-theme', 'customer-light-theme', 'customer-dark-theme'])
  })
})

describe('Themes', () => {
  it('zeigt denselben Website-Ausschnitt in allen vier Kombinationen mit den Werten des Themes', () => {
    store.state.themes.neo.light['interactive-default'] = '#123456'
    w = mount(ThemesBuehne)
    const felder = w.findAll('[data-test^="website-ausschnitt-"]')
    expect(felder.map((f) => f.attributes('data-test'))).toEqual(['website-ausschnitt-neo-light', 'website-ausschnitt-neo-dark', 'website-ausschnitt-customer-light', 'website-ausschnitt-customer-dark'])
    expect(felder[0].attributes('style')).toContain('--fnd-color-interactive-default: #123456')
    expect(felder[1].attributes('style')).not.toContain('#123456')
    for (const f of felder) expect(f.find('a.nc-card.nc-card--navigational').exists()).toBe(true)
    expect(w.text()).toContain('NEO · Hell')
    expect(w.text()).toContain('Kunde · Dunkel')
  })
})

describe('Seitenverhältnisse', () => {
  it('echte Komponente nc-aspect-ratio; Hochformate über die Höhe begrenzt', () => {
    w = mount(FoundationWirkung, { props: { kategorie: 'media' } })
    const quer = w.find('[data-test="medium-16-9"] .nc-aspect-ratio')
    const hoch = w.find('[data-test="medium-9-16"] .nc-aspect-ratio')
    expect(quer.attributes('style')).toContain('--nc-aspect-ratio-ratio: 16 / 9')
    expect(quer.attributes('style')).toContain('width: 100%')
    expect(hoch.attributes('style')).toMatch(/width: 7\dpx/)
    expect(hoch.find('img.nc-aspect-ratio__content').exists()).toBe(true)
  })
})

describe('Breitenabhängige Bereiche', () => {
  it('Ebene je Sektion für die Vorgabe des Geräterahmens', () => {
    expect(ebeneDerSektion('component-hero')).toBe('organisms')
    expect(ebeneDerSektion('component-container')).toBe('objects')
    expect(ebeneDerSektion('component-button')).toBe('atoms')
    expect(ebeneDerSektion('foundation-colors')).toBe('foundation')
  })
  it('Themes und HTML-Elemente nutzen die neuen Bühnen', async () => {
    const name = async (id) => { const k = await sektionAufloesen(id).labor.__asyncLoader(); return (k.default ?? k).__name }
    expect(await name('foundation-themes')).toBe('ThemesBuehne')
    expect(await name('foundation-elements')).toBe('ElementeBuehne')
  })
})
