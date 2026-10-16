// Testlauf 16.10.2026: E9 (Hochladen wie Google-Schrift, Formular danach leer),
// E12 (sichtbarer Löschen-Knopf), UX-49 (Rolle zurücksetzen), UX-50 (Fehler im Klartext)
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { vorschlagAusDateiname } from '../../src/utils/schrift-datei.js'

const zustand = vi.hoisted(() => ({ hochladen: null, loeschen: null, bestaetigt: true }))
vi.mock('../../src/speicher/index.js', () => ({
  darf: () => true,
  meldungFuer: (e, was) => ({ titel: `${was} abgelehnt` }),
  speicher: () => ({ art: 'drupal', ladeSchriftHoch: (...a) => zustand.hochladen(...a), loescheSchrift: (...a) => zustand.loeschen(...a) })
}))
vi.mock('../../src/composables/useBestaetigung.js', () => ({ bestaetigen: () => Promise.resolve(zustand.bestaetigt) }))
vi.mock('../../src/composables/useServerSchriften.js', async () => {
  const { ref } = await import('vue')
  const serverSchriften = ref([])
  return {
    serverSchriften, serverSchriftenFehler: ref(''),
    ladeServerSchriften: () => Promise.resolve(),
    uebernehmeSchriften: (liste) => { serverSchriften.value = liste }
  }
})

const { default: DrupalSchriften } = await import('../../src/components/drupal/DrupalSchriften.vue')
const { serverSchriften } = await import('../../src/composables/useServerSchriften.js')
const { useThemeStore } = await import('../../src/stores/theme.js')

describe('Vorschlag aus dem Dateinamen', () => {
  it('Familie, Gewicht, Stil', () => {
    expect(vorschlagAusDateiname('Kundenschrift-BoldItalic.woff2')).toEqual({ familie: 'Kundenschrift', gewicht: 700, stil: 'italic' })
    expect(vorschlagAusDateiname('Open Sans Light Italic.otf')).toEqual({ familie: 'Open Sans', gewicht: 300, stil: 'italic' })
    expect(vorschlagAusDateiname('Inter_600.ttf')).toEqual({ familie: 'Inter', gewicht: 600, stil: 'normal' })
    expect(vorschlagAusDateiname('Space Grotesk.woff2')).toEqual({ familie: 'Space Grotesk', gewicht: 400, stil: 'normal' })
  })
})

describe('Schriften auf dem Server', () => {
  let w, store
  const datei = new File(['x'], 'Kundenschrift-Bold.woff2', { type: 'font/woff2' })
  beforeEach(() => {
    localStorage.clear(); store = useThemeStore(); store.state.activeThemeSet = 'neo'
    serverSchriften.value = []
    zustand.hochladen = vi.fn().mockResolvedValue([{ familie: 'Kundenschrift', quelle: 'hochgeladen', schnitte: [{ id: 's1', gewicht: 700, stil: 'normal' }] }])
    zustand.loeschen = vi.fn().mockResolvedValue([])
    zustand.bestaetigt = true
  })
  afterEach(() => w?.unmount())

  async function waehleDatei () {
    const feld = w.find('input[type="file"]')
    Object.defineProperty(feld.element, 'files', { value: [datei], configurable: true })
    await feld.trigger('change')
  }

  it('E9: Karte öffnet das Formular, Dateiname füllt Felder, nach dem Hochladen zu und leer', async () => {
    w = mount(DrupalSchriften)
    expect(w.find('[data-test="drupal-schrift-hochladen"]').exists()).toBe(false)
    await w.find('[data-test="drupal-schrift-neu"]').trigger('click')
    expect(w.find('[data-test="drupal-schrift-hochladen"]').exists()).toBe(true)
    expect(w.find('button[type="submit"]').attributes('disabled')).toBeDefined()
    await waehleDatei()
    expect(w.find('input[type="text"]').element.value).toBe('Kundenschrift')
    expect(w.find('select').element.value).toBe('700')
    await w.find('form').trigger('submit')
    await flushPromises()
    expect(zustand.hochladen).toHaveBeenCalledWith(datei, { familie: 'Kundenschrift', gewicht: 700, stil: 'normal' })
    expect(w.find('[data-test="drupal-schrift-hochladen"]').exists()).toBe(false)
    expect(w.find('[data-test="drupal-schrift-erfolg"]').text()).toBe('Kundenschrift 700 hochgeladen.')
    await w.find('[data-test="drupal-schrift-neu"]').trigger('click')
    expect(w.find('input[type="text"]').element.value).toBe('')
  })

  it('UX-50: abgelehnte Datei → Klartext, role=alert, Formular bleibt offen', async () => {
    zustand.hochladen = vi.fn().mockRejectedValue(Object.assign(new Error('Daten abgelehnt'), { fehler: ['datei: Inhalt ist keine woff2-Schrift'] }))
    w = mount(DrupalSchriften)
    await w.find('[data-test="drupal-schrift-neu"]').trigger('click')
    await waehleDatei()
    await w.find('form').trigger('submit')
    await flushPromises()
    const f = w.find('[data-test="drupal-schrift-fehler"]')
    expect(f.attributes('role')).toBe('alert')
    expect(f.text()).toContain('keine gültige Schriftdatei')
    expect(w.find('[data-test="drupal-schrift-hochladen"]').exists()).toBe(true)
  })

  it('E12 und UX-49: sichtbarer Löschen-Knopf; letzter Schnitt einer zugewiesenen Familie setzt die Rolle zurück', async () => {
    serverSchriften.value = [{ familie: 'Kundenschrift', quelle: 'hochgeladen', schnitte: [{ id: 's1', gewicht: 700, stil: 'normal' }] }]
    store.updateFoundationToken('typography', 'font-body', "'Kundenschrift', sans-serif")
    w = mount(DrupalSchriften)
    const knopf = w.find('[data-test="schnitt-loeschen-s1"]')
    expect(knopf.text()).toBe('Löschen')
    await knopf.trigger('click')
    await flushPromises()
    expect(zustand.loeschen).toHaveBeenCalledWith('s1')
    expect(store.currentFoundation.typography['font-body']).not.toContain('Kundenschrift')
  })
})
