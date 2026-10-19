// Paket 5, Block 5d (19.10.2026): UX-31, UX-37, UX-39, UX-40, UX-54
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { useThemeStore } from '../../src/stores/theme.js'
import { foundationTokens } from '../../src/data/tokens.js'
import { foundationZeilen } from '../../src/export/foundation-css.js'
import { kategorienFuer, vorschlagsGruppen, passendeBezeichnung, popupLage, inPixel } from '../../src/utils/geometrie-auswahl.js'
import { extractFiltersFromRecipe, optionen } from '../../src/composables/useArenaFilters.js'
import { sektionAufloesen } from '../../src/navigation/sektionen.js'
import GeometryTokenSelect from '../../src/components/editors/GeometryTokenSelect.vue'
import IconsInspector from '../../src/components/foundation/IconsInspector.vue'
import InspectorPanel from '../../src/components/layout/InspectorPanel.vue'

const quelle = (pfad) => readFileSync(resolve(__dirname, '../../', pfad), 'utf8')
const recipe = (id) => JSON.parse(readFileSync(resolve(__dirname, '../../../../data', `${id}-recipe.json`), 'utf8'))

let store, w
beforeEach(() => { localStorage.clear(); store = useThemeStore(); store.resetToDefaults(); store.state.activeThemeSet = 'neo'; store.setPreviewMode('light') })
afterEach(() => { w?.unmount(); w = null; document.body.innerHTML = '' })

describe('UX-37: Icons', () => {
  it('Icon-Seite hat einen deutschen Inspector statt „Select a section …“', () => {
    expect(sektionAufloesen('foundation-icons').inspector[0].komponente).toBe(IconsInspector)
    expect(quelle('src/components/layout/InspectorPanel.vue')).not.toContain('Select a section')
  })
  it('Inspector nennt, was exportiert wird und was nur Vorschau ist', () => {
    store.updateFoundationToken('elements', 'icon-touch-target', '48px')
    w = mount(IconsInspector)
    expect(w.text()).toContain('Wirkt auf der Website')
    expect(w.find('[data-test="icons-touch-ziel"]').text()).toBe('48px')
    expect(w.find('[data-test="icons-nur-vorschau"]').text()).toContain('Strichstärke')
  })
  it('Touch-Ziel wird als --nc-icon-touch-target exportiert, nur bei Abweichung und gültigem Wert', () => {
    expect(foundationZeilen({ elements: { 'icon-touch-target': '48px' } }).zeilen).toEqual(['  --nc-icon-touch-target: 48px;'])
    expect(foundationZeilen({ elements: { 'icon-touch-target': '44px' } }).zeilen).toEqual([])
    const kaputt = foundationZeilen({ elements: { 'icon-touch-target': '48px; color: red' } })
    expect(kaputt.zeilen).toEqual([])
    expect(kaputt.uebersprungen).toEqual(['elements.icon-touch-target'])
  })
  it('Bühne kennzeichnet nicht exportierte Einstellungen', () => {
    expect(quelle('src/components/foundation/IconsEditor.vue').match(/ie-nur-vorschau"/g)).toHaveLength(3)
  })
})

describe('UX-39: Geometry-Werteauswahl', () => {
  it('passende Skala je Token', () => {
    expect(kategorienFuer('button-padding-x-md')).toEqual(['spacing'])
    expect(kategorienFuer('button-radius')).toEqual(['radius'])
    expect(kategorienFuer('button-border-width')).toEqual(['border'])
    expect(kategorienFuer('button-height-md')).toEqual(['size'])
    expect(kategorienFuer('button-font-size')).toEqual([])
  })
  it('Höhen bekommen Größen-Tokens (vorher leer: Kategorie „sizes“ gab es nicht), aufsteigend', () => {
    const [gruppe] = vorschlagsGruppen('button-height-md', foundationTokens)
    expect(gruppe.label).toBe('Größe')
    expect(gruppe.items.length).toBeGreaterThan(3)
    const px = gruppe.items.map((i) => inPixel(i.value))
    expect([...px].sort((a, b) => a - b)).toEqual(px)
    expect(gruppe.items.every((i) => i.varName.startsWith('--fnd-size-'))).toBe(true)
  })
  it('Rahmenbreiten zeigen --fnd-border-width-*, nicht --fnd-radius-*', () => {
    const [gruppe] = vorschlagsGruppen('button-border-width', foundationTokens)
    expect(gruppe.items.every((i) => i.varName.startsWith('--fnd-border-width-'))).toBe(true)
  })
  it('Padding wird nicht mit einem Radius beschriftet', () => {
    const b = passendeBezeichnung('8px', '8px', 'button-padding-x-xs', foundationTokens)
    expect(b).toMatch(/^Abstand /)
    expect(passendeBezeichnung('24px', '24px', 'button-height-xs', foundationTokens)).toBe('Größe XS')
    expect(passendeBezeichnung('var(--fnd-radius-sm)', '4px', 'button-padding-x-xs', foundationTokens)).toMatch(/^Radius SM/)
  })
  it('Popup bleibt im Fenster: rechts und unten', () => {
    const fenster = { breite: 1440, hoehe: 900 }
    const rechts = popupLage({ top: 400, bottom: 428, left: 1300, right: 1420, width: 120 }, fenster)
    expect(rechts.left + rechts.width).toBeLessThanOrEqual(1432)
    const unten = popupLage({ top: 850, bottom: 878, left: 100, right: 300, width: 200 }, fenster)
    expect(unten.top + unten.maxHeight).toBeLessThanOrEqual(850)
    expect(unten.top).toBeGreaterThanOrEqual(8)
  })
  it('ohne passende Skala: Hinweis statt leerer Liste; Escape gibt den Fokus zurück', async () => {
    w = mount(GeometryTokenSelect, { props: { token: { id: 'button-font-size', label: 'Schriftgröße' }, modelValue: '14px' }, attachTo: document.body })
    const ausloeser = w.find('.geo-select__trigger')
    expect(ausloeser.attributes('aria-expanded')).toBe('false')
    await ausloeser.trigger('click'); await nextTick(); await nextTick()
    expect(w.find('[data-test="geo-keine-tokens"]').exists()).toBe(true)
    expect(document.activeElement?.classList.contains('geo-select__custom-input')).toBe(true)
    await w.find('.geo-select').trigger('keydown', { key: 'Escape' }); await nextTick(); await nextTick()
    expect(w.find('[data-test="geo-popup"]').exists()).toBe(false)
    expect(document.activeElement).toBe(ausloeser.element)
  })
  it('Auswahl eines Tokens schreibt den Verweis', async () => {
    w = mount(GeometryTokenSelect, { props: { token: { id: 'button-height-md' }, modelValue: '40px' }, attachTo: document.body })
    await w.find('.geo-select__trigger').trigger('click'); await nextTick()
    const eintraege = w.findAll('[data-test="geo-eintrag"]')
    expect(eintraege.length).toBeGreaterThan(3)
    expect(w.find('.geo-select__item.active').exists()).toBe(true)
    await eintraege[0].trigger('click')
    expect(w.emitted('update:modelValue').at(-1)[0]).toMatch(/^var\(--fnd-size-/)
  })
})

describe('UX-40: Filterleiste', () => {
  it('Achsen als Liste liefern Namen statt „0 1 2“ (tabs)', () => {
    const f = extractFiltersFromRecipe(recipe('tabs'))
    expect(f.variants.map((o) => o.id)).toContain('line')
    expect(f.variants.find((o) => o.id === 'line').label).toBe('Line')
    expect(f.sizes.map((o) => o.id)).toEqual(['sm', 'md', 'lg'])
    expect(f.sizes.map((o) => o.label)).toEqual(['Small', 'Medium', 'Large'])
    for (const liste of Object.values(f)) for (const o of liste) expect(o.id).not.toMatch(/^\d+$/)
  })
  it('timeline: keine Zahlen-IDs', () => {
    const f = extractFiltersFromRecipe(recipe('timeline'))
    for (const liste of Object.values(f)) for (const o of liste) expect(o.id).not.toMatch(/^\d+$/)
  })
  it('Bezeichnung: Klammer weg, bloße Wiederholung des Schlüssels groß geschrieben', () => {
    expect(optionen({ a: { label: 'Alpha (lang)' }, left: { label: 'left' }, b: {} })).toEqual([
      { id: 'a', label: 'Alpha' }, { id: 'left', label: 'Left' }, { id: 'b', label: 'B' },
    ])
  })
})

describe('UX-31: keine Klick-Optik ohne Wirkung', () => {
  it('Farb-Specimens ohne cursor:pointer, Hover- und Auswahlrahmen', () => {
    const css = quelle('src/components/laboratory/foundation/farben-arena.css')
    expect(css).not.toMatch(/\.arena-specimen\s*\{[^}]*cursor:\s*pointer/)
    expect(css).not.toContain('.arena-specimen:hover')
    expect(css).not.toContain('.arena-specimen--selected')
  })
  it('Labor vergibt eine Komponenten-ID nur auf Komponenten-Seiten', () => {
    expect(quelle('src/components/laboratory/LaboratoryPanel.vue')).toContain("s.startsWith('component-') ? s.slice('component-'.length) : ''")
  })
})

describe('UX-54: Ausprobieren', () => {
  it('Überschrift und Beschreibung passen zur einzelnen Instanz', () => {
    const q = quelle('src/components/laboratory/RecipeArena.vue')
    expect(q).toContain('label: `${sp.label} · Ausprobieren`')
    expect(q).toContain('Alle Varianten zeigt die Ansicht „Zustände“.')
    expect(q).toContain('achsen: [],')
  })
})

describe('Leerhinweis im Inspector ist deutsch', () => {
  it('unbekannte Seite zeigt den deutschen Hinweis', () => {
    store.setActiveSection('gibt-es-nicht')
    w = mount(InspectorPanel, { global: { stubs: { ComponentLockToggle: true } } })
    expect(w.find('[data-test="inspector-leer"]').text()).toContain('Für diesen Bereich gibt es hier keine Einstellungen')
  })
})
