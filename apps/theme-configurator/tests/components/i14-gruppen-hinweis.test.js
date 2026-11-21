// I14 (21.11.2026): Eine Token-Gruppe kann einen Hinweis tragen (`hinweis` im
// Recipe, styling.tokenGroups.<id>). Die App zeigt ihn als eigene Zeile unter
// der Überschrift der Untergruppe — erster Fall: Card › Bilder einfärben gilt
// auch für Card CTA (Entscheidung Frank 21.11.2026, Option A).
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { mount, flushPromises } from '@vue/test-utils'
import { useThemeStore } from '../../src/stores/theme.js'
import ComponentEditor from '../../src/components/components/ComponentEditor.vue'

async function warte (bedingung) {
  const bis = Date.now() + 8000
  while (!bedingung() && Date.now() < bis) { await flushPromises(); await new Promise((r) => setTimeout(r, 10)) }
}

const cardRecipe = JSON.parse(readFileSync(resolve(__dirname, '../../../../data/card-recipe.json'), 'utf8'))

describe('Hinweis an der Token-Gruppe', () => {
  let store, w
  beforeEach(() => { localStorage.clear(); store = useThemeStore(); store.state.activeThemeSet = 'neo' })
  afterEach(() => { w?.unmount(); w = null; document.body.innerHTML = '' })

  it('Card-Recipe: Bilder einfärben nennt Card CTA', () => {
    expect(cardRecipe.styling.tokenGroups.medien.hinweis).toBe('Gilt für Card und Card CTA (Card Grid CTA).')
  })

  it('Card › Bilder einfärben zeigt den Hinweis unter der Überschrift', async () => {
    w = mount(ComponentEditor, { props: { componentId: 'card' } })
    await warte(() => w.find('[data-subgroup="medien"] .ce-subgroup-header').exists())
    const gruppe = w.find('[data-subgroup="medien"]')
    expect(gruppe.exists()).toBe(true)
    expect(gruppe.find('[data-test="gruppen-hinweis"]').exists()).toBe(false)
    await gruppe.find('.ce-subgroup-header').trigger('click')
    // Das Recipe lädt nach (dynamischer Import); bis dahin gilt die Gruppe aus der Registry
    await warte(() => w.find('[data-subgroup="medien"] [data-test="gruppen-hinweis"]').exists())
    const hinweis = w.find('[data-subgroup="medien"] [data-test="gruppen-hinweis"]')
    expect(hinweis.exists()).toBe(true)
    expect(hinweis.text()).toBe('Gilt für Card und Card CTA (Card Grid CTA).')
  })

  it('Gruppe ohne Hinweis: keine leere Zeile', async () => {
    w = mount(ComponentEditor, { props: { componentId: 'card' } })
    await warte(() => w.find('[data-subgroup="date-badge"] .ce-subgroup-header').exists() && w.find('[data-subgroup="medien"] .ce-subgroup-header').exists())
    // erst warten, bis das Recipe geladen ist (Bilder einfärben zeigt seinen Hinweis)
    await w.find('[data-subgroup="medien"] .ce-subgroup-header').trigger('click')
    await warte(() => w.find('[data-subgroup="medien"] [data-test="gruppen-hinweis"]').exists())
    await w.find('[data-subgroup="date-badge"] .ce-subgroup-header').trigger('click')
    await flushPromises()
    expect(w.find('[data-subgroup="date-badge"] .ce-subgroup-body').exists()).toBe(true)
    expect(w.find('[data-subgroup="date-badge"] [data-test="gruppen-hinweis"]').exists()).toBe(false)
  })

  it('Schwarzpunkt unter „Weitere Einstellungen“ trägt den Hinweis seiner Gruppe (Befund Widersacher)', async () => {
    w = mount(ComponentEditor, { props: { componentId: 'card' } })
    // Recipe geladen: Bilder einfärben zeigt seinen Hinweis
    await warte(() => w.find('[data-subgroup="medien"] .ce-subgroup-header').exists())
    await w.find('[data-subgroup="medien"] .ce-subgroup-header').trigger('click')
    await warte(() => w.find('[data-subgroup="medien"] [data-test="gruppen-hinweis"]').exists())
    const weitere = w.findAll('.inspector-section__header').find((b) => b.text().includes('Weitere Einstellungen'))
    expect(weitere).toBeTruthy()
    await weitere.trigger('click')
    await flushPromises()
    const zeilen = w.findAll('.token-row').filter((z) => z.text().includes('Bilder einfärben — Schwarzpunkt'))
    expect(zeilen).toHaveLength(1)
    expect(zeilen[0].find('[data-test="token-gruppen-hinweis"]').text()).toBe('Gilt für Card und Card CTA (Card Grid CTA).')
    // andere Werte unter „Weitere Einstellungen“ ohne Hinweis
    const ohne = w.findAll('.token-row').filter((z) => !z.text().includes('Schwarzpunkt') && z.find('[data-test="token-gruppen-hinweis"]').exists())
    expect(ohne).toHaveLength(0)
  })

  it('jede der vier Gruppenansichten kann den Hinweis zeigen', () => {
    const q = readFileSync(resolve(__dirname, '../../src/components/components/ComponentEditor.vue'), 'utf8')
    expect(q.match(/data-test="gruppen-hinweis"/g)).toHaveLength(4)
  })
})
