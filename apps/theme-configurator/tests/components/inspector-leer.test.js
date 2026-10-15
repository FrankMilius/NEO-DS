// UX-11 (15.10.2026): Bei 34 Komponenten war der Inspector leer — ohne
// Erklärung, mit Sync, Suche und „New Variant“, die ins Leere liefen.
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { useThemeStore } from '../../src/stores/theme.js'
import ComponentEditor from '../../src/components/components/ComponentEditor.vue'
import { componentTokenGroups } from '../../src/data/tokens.js'

async function warte (w, bedingung) {
  const bis = Date.now() + 8000
  while (!bedingung() && Date.now() < bis) { await flushPromises(); await new Promise((r) => setTimeout(r, 10)) }
}

describe('Inspector ohne eigene Tokens', () => {
  let store, w
  beforeEach(() => { localStorage.clear(); store = useThemeStore(); store.state.activeThemeSet = 'neo' })
  afterEach(() => w?.unmount())

  it('Modal zeigt die Dialog-Tokens mit Hinweis auf die Mitnutzer', async () => {
    w = mount(ComponentEditor, { props: { componentId: 'modal' } })
    await warte(w, () => w.find('.inspector-section').exists())
    const hinweis = w.find('[data-test="inspector-geteilt"]')
    expect(hinweis.exists()).toBe(true)
    expect(hinweis.text()).toContain('--nc-dialog-*')
    expect(hinweis.find('a[href="#/component/alert-dialog"]').exists()).toBe(true)
    const dialogTokens = componentTokenGroups.find(g => g.id === 'dialog').tokens.length
    expect(dialogTokens).toBeGreaterThan(0)
    expect(w.find('[data-test="inspector-leer"]').exists()).toBe(false)
    expect(w.find('.token-search-input').exists()).toBe(true)
  })

  it('Navigation zeigt die Nav-Tokens', async () => {
    w = mount(ComponentEditor, { props: { componentId: 'navigation' } })
    await flushPromises()
    expect(w.find('[data-test="inspector-geteilt"]').text()).toContain('--nc-nav-*')
  })

  it('Header ohne Tokens: Leerzustand mit Foundation-Links, keine leeren Bedienelemente', async () => {
    w = mount(ComponentEditor, { props: { componentId: 'header' } })
    await flushPromises()
    const leer = w.find('[data-test="inspector-leer"]')
    expect(leer.exists()).toBe(true)
    expect(leer.text()).toContain('hat keine eigenen Einstellungen')
    expect(leer.find('a[href="#/foundation/colors"]').exists()).toBe(true)
    expect(w.find('.sync-toggle').exists()).toBe(false)
    expect(w.find('.token-search-input').exists()).toBe(false)
    expect(w.find('.ce-action-bar').exists()).toBe(false)
  })

  it('Bausteine aus der Komposition werden verlinkt (Form Actions → Button)', async () => {
    w = mount(ComponentEditor, { props: { componentId: 'form-actions' } })
    await warte(w, () => w.find('[data-test="inspector-leer"] a[href="#/component/button"]').exists())
    expect(w.find('[data-test="inspector-leer"] a[href="#/component/button"]').exists()).toBe(true)
  })

  it('Komponente mit eigenen Tokens: kein Hinweis, kein Leerzustand', async () => {
    w = mount(ComponentEditor, { props: { componentId: 'button' } })
    await flushPromises()
    expect(w.find('[data-test="inspector-geteilt"]').exists()).toBe(false)
    expect(w.find('[data-test="inspector-leer"]').exists()).toBe(false)
  })
})
