// UX-03, UX-15, UX-16 (Usability-Audit 15.10.2026)
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { pruefeFoundationWert, pruefeKomponentenWert, pruefeSchriftskala, pruefeFarbe, artVon } from '../../src/utils/token-pruefung.js'
import { useThemeStore } from '../../src/stores/theme.js'
import { pruefeCss } from '../../src/utils/css-wert.js'
import SpacingInspector from '../../src/components/foundation/SpacingInspector.vue'

describe('UX-03: Regeln je Token-Art', () => {
  it('leitet die Art aus dem Standardwert ab', () => {
    expect(artVon('6px')).toBe('laenge'); expect(artVon(0.5)).toBe('zahl'); expect(artVon('0.2s')).toBe('dauer')
    expect(artVon('16 / 9')).toBe('verhaeltnis'); expect(artVon('#fff')).toBe('farbe'); expect(artVon('ease-out')).toBe('frei')
  })
  it('Foundation: Radius, Opacity, Z-Index, Motion, Media, Gewicht', () => {
    expect(pruefeFoundationWert('radius', 'md', '8px')).toBeNull()
    expect(pruefeFoundationWert('radius', 'md', 'calc(4px * 2)')).toBeNull()
    expect(pruefeFoundationWert('radius', 'md', 'abc')).toMatch(/keine Länge/)
    expect(pruefeFoundationWert('opacity', 'disabled', 0.4)).toBeNull()
    expect(pruefeFoundationWert('opacity', 'disabled', NaN)).toMatch(/zwischen 0 und 1/)
    expect(pruefeFoundationWert('opacity', 'disabled', 'halb')).toMatch(/keine Zahl/)
    expect(pruefeFoundationWert('opacity', 'disabled', 2)).toMatch(/zwischen 0 und 1/)
    expect(pruefeFoundationWert('zindex', 'dropdown', 100.5)).toMatch(/ganze Zahl/)
    expect(pruefeFoundationWert('motion', 'duration-quick', 'schnell')).toMatch(/keine Dauer/)
    expect(pruefeFoundationWert('motion', 'easing-focused', 'cubic-bezier(.2,0,0,1)')).toBeNull()
    expect(pruefeFoundationWert('media', '3-2', '3 / 2')).toBeNull()
    expect(pruefeFoundationWert('media', '3-2', 'breit')).toMatch(/Seitenverhältnis/)
    expect(pruefeFoundationWert('typography', 'weight-light', 1200)).toMatch(/100 und 900/)
    expect(pruefeFoundationWert('focus', 'color-dark', 'hellblau')).toMatch(/keine Farbe/)
    expect(pruefeFoundationWert('elevation', 'raised', 'md')).toBeNull()
  })
  it('Komponenten: Grid-Spalten 1–24, Größen mehrteilig, Farben', () => {
    expect(pruefeKomponentenWert('nc-grid-columns', '12')).toBeNull()
    expect(pruefeKomponentenWert('nc-grid-columns', '0')).toMatch(/1 und 24/)
    expect(pruefeKomponentenWert('nc-grid-columns', '40')).toMatch(/1 und 24/)
    expect(pruefeKomponentenWert('nc-grid-gap', 'viel')).toMatch(/keine Länge/)
    expect(pruefeKomponentenWert('nc-grid-gap', 'clamp(12px, 1.5vw, 24px)')).toBeNull()
    expect(pruefeKomponentenWert('nc-accordion-padding', 'var(--fnd-spacing-04) 12px')).toBeNull()
    expect(pruefeKomponentenWert('nc-accordion-padding', '8px breit')).toMatch(/„breit“/)
    expect(pruefeKomponentenWert('nc-accordion-border', 'rot')).toMatch(/keine Farbe/)
  })
  it('Schriftskala: Bereiche und Min ≤ Max', () => {
    const akt = { base_min_px: 14, base_max_px: 18, ratio_min: 1.2, ratio_max: 1.25 }
    expect(pruefeSchriftskala('base_min_px', 16, akt)).toBeNull()
    expect(pruefeSchriftskala('base_min_px', 50, akt)).toMatch(/10 bis 32/)
    expect(pruefeSchriftskala('ratio_max', 3, akt)).toMatch(/1 bis 1,618/)
    expect(pruefeSchriftskala('base_min_px', 20, akt)).toMatch(/kleiner oder gleich/)
    expect(pruefeSchriftskala('ratio_max', 1.1, akt)).toMatch(/größer oder gleich/)
  })
  it('Farben', () => {
    for (const f of ['#1f6f3a', '#abc', 'rgba(0,0,0,.5)', 'var(--fnd-color-x)', 'transparent']) expect(pruefeFarbe(f), f).toBeNull()
    expect(pruefeFarbe('#12')).toMatch(/keine Farbe/)
  })
})

describe('UX-03: Store lehnt ab, Meldung am Feld, letzter Wert zurück', () => {
  let store, feld
  beforeEach(() => {
    localStorage.clear(); store = useThemeStore(); store.state.activeThemeSet = 'neo'
    feld = document.createElement('input'); document.body.appendChild(feld); feld.focus()
  })
  afterEach(() => { document.body.innerHTML = '' })

  it('ungültiger Radius: nicht übernommen, aria-invalid, Meldung, Wert zurück; gültiger Wert räumt auf', () => {
    const vorher = store.currentFoundation.radius.md
    feld.value = 'abc'
    store.updateFoundationToken('radius', 'md', 'abc')
    expect(store.currentFoundation.radius.md).toBe(vorher)
    expect(feld.getAttribute('aria-invalid')).toBe('true')
    const id = feld.getAttribute('aria-describedby')
    expect(document.getElementById(id).textContent).toMatch(/keine Länge/)
    expect(document.getElementById(id).getAttribute('role')).toBe('alert')
    expect(feld.value).toBe(String(vorher))
    store.updateFoundationToken('radius', 'md', '9px')
    expect(store.currentFoundation.radius.md).toBe('9px')
    expect(feld.hasAttribute('aria-invalid')).toBe(false)
    expect(document.getElementById(id)).toBeNull()
  })

  it('Schriftskala Basis 50 wird abgelehnt', () => {
    store.updateTypeScale('base_min_px', 50)
    expect(store.currentTypeScale.base_min_px).toBeUndefined()
    expect(feld.getAttribute('aria-invalid')).toBe('true')
  })

  it('Opacity NaN wird abgelehnt', () => {
    const vorher = store.currentFoundation.opacity.disabled
    store.updateFoundationToken('opacity', 'disabled', NaN)
    expect(store.currentFoundation.opacity.disabled).toBe(vorher)
  })
})

describe('UX-16: Fokusring-Farbe je Modus wird ausgeliefert', () => {
  let store
  beforeEach(() => { localStorage.clear(); store = useThemeStore(); store.state.activeThemeSet = 'neo' })
  it('hell auf :root/.neo-light-theme, dunkel auf .neo-dark-theme; kein „nicht exportiert“', () => {
    store.updateFoundationToken('focus', 'color-light', '#0b5cad')
    store.updateFoundationToken('focus', 'color-dark', '#ffcc00')
    const css = store.exportAsCSSVars({ nurAbweichungen: true })
    expect(css).toMatch(/:root, \.neo-light-theme \{\n {2}--fnd-focus-ring-color: #0b5cad;\n\}/)
    expect(css).toMatch(/\.neo-dark-theme \{\n {2}--fnd-focus-ring-color: #ffcc00;\n\}/)
    expect(css).not.toMatch(/Nicht exportiert[^*]*focus\.color/)
    expect(pruefeCss(css)).toEqual([])
  })
})

describe('UX-15: Spacing zeigt die echten Token-Namen', () => {
  it('32px heißt --fnd-spacing-07 und speichert spacing.07', async () => {
    const store = useThemeStore(); store.state.activeThemeSet = 'neo'; store.state.currentThemeMeta = { id: 't', name: 'T' }
    const w = mount(SpacingInspector)
    const namen = w.findAll('.si-token-name').map(n => n.text())
    expect(namen).toContain('--fnd-spacing-07')
    const zeile = w.findAll('.si-token-name').find(n => n.text() === '--fnd-spacing-07').element.closest('*:has(input)') || w.element
    expect(zeile).toBeTruthy()
    const feld = w.find('input[aria-label="Spacing Spacing 07"]')
    expect(feld.exists()).toBe(true)
    expect(feld.element.value).toBe(store.currentFoundation.spacing['07'])
    await feld.setValue('36px'); await feld.trigger('change')
    expect(store.currentFoundation.spacing['07']).toBe('36px')
    w.unmount(); store.state.currentThemeMeta = null
  })
})

describe('UX-15: Inspector sortiert die Spacing-Skala nach Stufe', () => {
  it('01 … 13 statt 10–13 zuerst; Bühnentext nennt die richtige Regel', async () => {
    const { default: FoundationGeneric } = await import('../../src/components/foundation/FoundationGeneric.vue')
    const store = useThemeStore(); store.state.activeThemeSet = 'neo'
    const w = mount(FoundationGeneric, { props: { category: 'spacing' } })
    const text = w.text()
    expect(text.indexOf('--fnd-spacing-01')).toBeLessThan(text.indexOf('--fnd-spacing-10'))
    w.unmount()
    const s = mount(SpacingInspector)
    expect(s.find('.si-intro').text()).toContain('spacing-07 = 32px')
    expect(s.find('.si-intro').text()).not.toMatch(/Pixelwert \/ 4/)
    s.unmount()
  })
})

describe('UX-16: Editoren zeigen die Variablen, die das CSS setzt', () => {
  it('Fokusring: --fnd-focus-ring-color/-width/-style auf Bühne und im Inspector', async () => {
    const { default: FocusRingEditor } = await import('../../src/components/foundation/FocusRingEditor.vue')
    const { default: FoundationGeneric } = await import('../../src/components/foundation/FoundationGeneric.vue')
    const store = useThemeStore(); store.state.activeThemeSet = 'neo'
    for (const w of [mount(FocusRingEditor), mount(FoundationGeneric, { props: { category: 'focus' } })]) {
      const t = w.text()
      expect(t).toContain('--fnd-focus-ring-color'); expect(t).toContain('--fnd-focus-ring-width')
      expect(t).not.toMatch(/--fnd-focus-(color|width|style)\b/)
      w.unmount()
    }
  })
})
