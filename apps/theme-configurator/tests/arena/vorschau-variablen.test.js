// Recipe-Vorschau uebernimmt Store-Aenderungen und bindet Komponenten-Tokens
// im Vorschau-Bereich neu (Plan v2, 3.5 · 30.09.2026).
import { describe, it, expect, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import RecipeArena from '../../src/components/laboratory/RecipeArena.vue'
import { useThemeStore } from '../../src/stores/theme.js'
import { komponentenDeklarationen, vorschauVariablen, zeilenZuObjekt } from '../../src/lib/vorschau-variablen.js'

function fakeStyle (decl) {
  const namen = Object.keys(decl)
  return Object.assign([...namen], { getPropertyValue: (n) => decl[n] })
}
const fakeSheets = [{ cssRules: [
  { selectorText: ':root', style: fakeStyle({ '--nc-demo-bg': 'var(--fnd-color-background-secondary)', '--nc-andere-bg': 'red' }) },
  { cssRules: [{ selectorText: ':root, .x', style: fakeStyle({ '--nc-demo-fg': 'var(--fnd-color-text-primary)' }) }] },
  { selectorText: '.nc-demo', style: fakeStyle({ '--nc-demo-bg': 'blue' }) }
] }]

describe('vorschau-variablen', () => {
  it('liest nur :root-Deklarationen der Komponente, auch in @media', () => {
    expect(komponentenDeklarationen('demo', fakeSheets)).toEqual({
      '--nc-demo-bg': 'var(--fnd-color-background-secondary)',
      '--nc-demo-fg': 'var(--fnd-color-text-primary)'
    })
  })

  it('zeilenZuObjekt versteht Exportzeilen', () => {
    expect(zeilenZuObjekt(['  --fnd-radius-md: 7px;', '/* x */'])).toEqual({ '--fnd-radius-md': '7px' })
  })

  it('setzt Semantik je Modus und Komponenten-Overrides', () => {
    const store = useThemeStore()
    store.state.activeThemeSet = 'neo'
    store.state.componentOverrides.neo['nc-demo-bg'] = '#ff00aa'
    const hell = vorschauVariablen({ id: 'demo', modus: 'light', state: store.state, sheets: fakeSheets })
    const dunkel = vorschauVariablen({ id: 'demo', modus: 'dark', state: store.state, sheets: fakeSheets })
    expect(hell['--nc-demo-bg']).toBe('#ff00aa')
    expect(hell['--fnd-color-background-base']).toBe(store.state.themes.neo.light['background-base'])
    expect(dunkel['--fnd-color-background-base']).toBe(store.state.themes.neo.dark['background-base'])
    delete store.state.componentOverrides.neo['nc-demo-bg']
  })
})

describe('RecipeArena mit Store-Aenderungen', () => {
  let store
  beforeEach(() => { store = useThemeStore(); store.state.activeThemeSet = 'neo'; store.state.previewMode = 'light' })

  async function mountArena (id) {
    const w = mount(RecipeArena, { props: { componentId: id } })
    for (const bis = Date.now() + 8000; !w.find('.ra-specimen').exists() && Date.now() < bis;) {
      await flushPromises(); await new Promise((r) => setTimeout(r, 10))
    }
    return w
  }

  it('Komponenten-Override erscheint als Variable in der Vorschau', async () => {
    store.state.componentOverrides.neo['nc-badge-default-bg'] = '#ff00aa'
    const w = await mountArena('badge')
    const style = w.find('.ra-live-component').attributes('style') || ''
    expect(style).toContain('--nc-badge-default-bg: #ff00aa')
    delete store.state.componentOverrides.neo['nc-badge-default-bg']
  })

  it('semantische Aenderung erscheint, dunkle Zellen bekommen die Dunkel-Werte', async () => {
    const alt = store.state.themes.neo.light['background-secondary']
    store.state.themes.neo.light['background-secondary'] = '#123456'
    const w = await mountArena('footer')
    const hell = w.find('[data-specimen-id="simple-light"] .ra-live-component').attributes('style')
    const dunkel = w.find('[data-specimen-id="simple-dark"] .ra-live-component').attributes('style')
    expect(hell).toContain('--fnd-color-background-secondary: #123456')
    expect(dunkel).toContain(`--fnd-color-background-secondary: ${store.state.themes.neo.dark['background-secondary']}`)
    store.state.themes.neo.light['background-secondary'] = alt
  })
})
