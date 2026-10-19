// Roadmap V02 (19.10.2026): Was bewirkt eine Komponenten-Einstellung auf der Website?
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { mount } from '@vue/test-utils'
import { useThemeStore } from '../../src/stores/theme.js'
import { gruppenWirkung, aufzaehlung } from '../../src/utils/token-wirkung.js'
import { WEBSITE_EINSATZ, WEBSITE_EINSATZ_STAND } from '../../src/data/website-einsatz.generated.js'
import WebsiteEinsatz from '../../src/components/components/WebsiteEinsatz.vue'
import ComponentLockToggle from '../../src/components/components/ComponentLockToggle.vue'

const quelle = (pfad) => readFileSync(resolve(__dirname, '../../', pfad), 'utf8')

let store, w
beforeEach(() => { localStorage.clear(); store = useThemeStore(); store.resetToDefaults() })
afterEach(() => { w?.unmount(); w = null; document.body.innerHTML = '' })

describe('Kurztext je Token-Gruppe', () => {
  it('Geometrie des Buttons', () => {
    const w = gruppenWirkung(['nc-button-height-md', 'nc-button-padding-x-md', 'nc-button-radius-md', 'nc-button-border-width-sm'], 'button')
    expect(w.text).toBe('Steuert Höhe, Innenabstand, Eckenradius und Rahmenbreite.')
  })
  it('Farben mit Zuständen', () => {
    const w = gruppenWirkung(['--nc-chip-bg', '--nc-chip-bg-hover', '--nc-chip-text', '--nc-chip-border-disabled'], 'chip')
    expect(w.eigenschaften).toEqual(['Hintergrund', 'Textfarbe', 'Rahmen'])
    expect(w.text).toBe('Steuert Hintergrund, Textfarbe und Rahmen, auch beim Überfahren und deaktiviert.')
  })
  it('Klickfläche, unbekannte Namen, leere Gruppe', () => {
    expect(gruppenWirkung(['nc-icon-touch-target'], 'icon').text).toBe('Steuert Mindestgröße der Klickfläche.')
    expect(gruppenWirkung(['nc-x-foo'], 'x').text).toBe('')
    expect(gruppenWirkung([], 'x').text).toBe('')
  })
  it('Aufzählung', () => {
    expect(aufzaehlung(['a'])).toBe('a')
    expect(aufzaehlung(['a', 'b', 'c'])).toBe('a, b und c')
  })
  it('über 90 % der Recipe-Gruppen bekommen einen Text', () => {
    const dir = resolve(__dirname, '../../../../data')
    let n = 0, mit = 0
    for (const f of readdirSync(dir).filter((f) => f.endsWith('-recipe.json'))) {
      const r = JSON.parse(readFileSync(resolve(dir, f), 'utf8'))
      for (const g of Object.values(r.styling?.tokenGroups || {})) {
        if (!(g.tokens || []).length) continue
        n++; if (gruppenWirkung(g.tokens, f.slice(0, -12)).text) mit++
      }
    }
    expect(mit / n).toBeGreaterThan(0.9)
  })
})

describe('Website-Einsatz (generiert aus neo_fe)', () => {
  it('Daten: nur bekannte Recipes, Orte mit Dateien, Stand vorhanden', () => {
    expect(WEBSITE_EINSATZ_STAND).toMatch(/^[0-9a-f]{7,} \d{4}-\d{2}-\d{2}$/)
    for (const [id, orte] of Object.entries(WEBSITE_EINSATZ)) {
      expect(existsSync(resolve(__dirname, '../../../../data', `${id}-recipe.json`)), id).toBe(true)
      for (const o of orte) { expect(o.ort).toBeTruthy(); expect(o.dateien.length).toBeGreaterThan(0) }
    }
    expect(WEBSITE_EINSATZ.hero.map((o) => o.ort)).toContain('Block „Hero“')
    expect(WEBSITE_EINSATZ.button.length).toBeGreaterThan(5)
  })
  it('zeigt Blöcke kompakt, Templates nur mit technischen Namen', async () => {
    w = mount(WebsiteEinsatz, { props: { componentId: 'button', label: 'Button', technik: false } })
    expect(w.text()).toContain('Wirkt auf der Website')
    expect(w.find('[data-test="website-einsatz-bloecke"]').text()).toMatch(/^Blöcke: .*Hero/)
    expect(w.text()).toContain('Außerdem: ')
    expect(w.find('[data-test="website-einsatz-dateien"]').exists()).toBe(false)
    await w.setProps({ technik: true })
    expect(w.find('[data-test="website-einsatz-dateien"]').text()).toMatch(/\.twig/)
  })
  it('Bauteil ohne Einsatz: erklärender Satz', () => {
    w = mount(WebsiteEinsatz, { props: { componentId: 'gibt-es-nicht', label: 'X' } })
    expect(w.find('[data-test="website-einsatz-keiner"]').text()).toContain('Kein Template der Website nutzt X direkt')
  })
})

describe('Begriffe deutsch und erklärt', () => {
  it('Sperre und Version deutsch', async () => {
    w = mount(ComponentLockToggle, { props: { componentId: 'button', componentLabel: 'Button' } })
    expect(w.text()).toMatch(/Bearbeitbar|Gesperrt/)
    expect(w.text()).not.toMatch(/Unlocked|Locked/)
  })
  it('Inspector: Begriffe, Schalter für technische Namen, Sync deutsch, Kurztexte je Gruppe', () => {
    const q = quelle('src/components/components/ComponentEditor.vue')
    expect(q).toContain('Begriffe erklärt')
    expect(quelle('src/components/layout/InspectorPanel.vue')).toContain('Technische Namen zeigen')
    expect(q).not.toContain('Sync Geometry</span>')
    expect(q.match(/data-test="gruppen-wirkung"/g)).toHaveLength(4)
    expect(quelle('src/components/layout/InspectorPanel.vue')).toContain('Ebene 1: Grundfarben (Primitive)')
  })
})
