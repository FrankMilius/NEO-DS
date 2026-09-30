/**
 * Barrierefreiheit des App-Chromes (Plan v2, 4.4)
 *  - kein alert/confirm/prompt mehr im Quelltext
 *  - Klickziele in Header, Navigation, Inspector und Dialogen sind interaktiv
 *    (button/a/Formularfeld oder role + tabindex + Tastatur-Handler)
 *  - gerenderte Knoepfe haben einen zugaenglichen Namen, Navigation traegt aria-current
 */
import { describe, it, expect, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { parse } from '@vue/compiler-sfc'
import { readFileSync, readdirSync, statSync } from 'fs'
import { resolve, relative, join } from 'path'
import AppHeader from '../../src/components/layout/AppHeader.vue'
import SidebarNav from '../../src/components/layout/SidebarNav.vue'
import { useThemeStore } from '../../src/stores/theme.js'

const SRC = resolve(__dirname, '../../src')

function alleDateien (dir, endungen) {
  const out = []
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) out.push(...alleDateien(p, endungen))
    else if (endungen.some(e => p.endsWith(e))) out.push(p)
  }
  return out
}

// Kommentare entfernen, damit Erklaerungen wie „ersetzt confirm()“ nicht zaehlen
function ohneKommentare (text) {
  return text
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:'"`\\])\/\/.*$/gm, '$1')
}

describe('kein alert / confirm / prompt', () => {
  it('src/ ruft keine blockierenden Browser-Dialoge auf', () => {
    const treffer = []
    for (const datei of alleDateien(SRC, ['.vue', '.js'])) {
      const text = ohneKommentare(readFileSync(datei, 'utf8'))
      text.split('\n').forEach((zeile, i) => {
        if (/(^|[^\w.$])(window\.)?(alert|confirm|prompt)\s*\(/.test(zeile)) {
          treffer.push(`${relative(SRC, datei)}:${i + 1}: ${zeile.trim()}`)
        }
      })
    }
    expect(treffer).toEqual([])
  })
})

// ── Statische Pruefung der Templates ────────────────────────────────────────
const CHROME = [
  'components/layout/AppHeader.vue',
  'components/layout/SidebarNav.vue',
  'components/layout/InspectorPanel.vue',
  'components/workflow/BranchManager.vue',
  'components/workflow/MergeDialog.vue',
  'components/workflow/ReleaseDialog.vue',
  'components/workflow/DtcgExportDialog.vue',
  'components/workflow/ThemeImportDialog.vue',
  'components/components/ComponentLockToggle.vue',
  'components/components/VariantCreator.vue',
  'components/components/UpdateDialog.vue',
  'components/ui/KonfigDialog.vue',
  'components/ui/KonfigBestaetigung.vue',
  'components/laboratory/ArenaFilterbar.vue',
  'components/foundation/LayoutDependencyPanel.vue'
]
const INTERAKTIV = new Set(['button', 'a', 'input', 'select', 'textarea', 'label', 'summary', 'option'])
const ROLLEN = new Set(['button', 'link', 'checkbox', 'switch', 'tab', 'menuitem', 'menuitemcheckbox', 'option', 'radio', 'treeitem', 'separator'])

const attr = (el, name) => (el.props || []).find(p =>
  (p.type === 6 && p.name === name) || (p.type === 7 && p.name === 'bind' && p.arg?.content === name))
const handler = (el, ereignis) => (el.props || []).find(p => p.type === 7 && p.name === 'on' && p.arg?.content === ereignis)
const modifikatoren = (p) => (p.modifiers || []).map(m => m.content ?? m)

function klickzielBefunde (datei, quelle = readFileSync(resolve(SRC, datei), 'utf8')) {
  const { descriptor } = parse(quelle, { filename: datei })
  const befunde = []
  const besuche = (n) => {
    if (n.type === 1) {
      const klick = handler(n, 'click')
      const istKomponente = /^[A-Z]/.test(n.tag) || n.tag.includes('-') || n.tag === 'component'
      if (klick && !INTERAKTIV.has(n.tag) && !istKomponente) {
        // Hintergrund eines Dialogs: Klick nur auf das Element selbst, Tastatur schliesst per Escape
        const hintergrund = modifikatoren(klick).includes('self')
        const rolle = attr(n, 'role')?.value?.content
        const zugaenglich = ROLLEN.has(rolle) && attr(n, 'tabindex') && handler(n, 'keydown')
        if (!hintergrund && !zugaenglich) befunde.push(`${datei}:${n.loc.start.line} <${n.tag}>`)
      }
      // verschachtelte Knoepfe
      if (n.tag === 'button') {
        const innen = []
        const suche = (k) => { for (const c of k.children || []) { if (c.type === 1 && c.tag === 'button') innen.push(c); suche(c) } }
        suche(n)
        if (innen.length) befunde.push(`${datei}:${n.loc.start.line} <button> enthaelt <button>`)
      }
    }
    for (const c of n.children || []) besuche(c)
    for (const b of n.branches || []) besuche(b)
  }
  besuche(descriptor.template.ast)
  return befunde
}

describe('Klickziele im App-Chrome sind interaktiv', () => {
  it.each(CHROME)('%s', (datei) => {
    expect(klickzielBefunde(datei)).toEqual([])
  })

  it('Gegenprobe: die Pruefung meldet div/span/li-Klickziele und verschachtelte Knoepfe', () => {
    const quelle = `<template><div>
      <div @click="a"></div>
      <li @click="b"></li>
      <span role="button" @click="c"></span>
      <div role="button" tabindex="0" @click="d" @keydown.enter="d"></div>
      <div class="modal-overlay" @click.self="e"></div>
      <button @click="f"><button @click="g"></button></button>
    </div></template>`
    expect(klickzielBefunde('probe.vue', quelle)).toEqual([
      'probe.vue:2 <div>',
      'probe.vue:3 <li>',
      'probe.vue:4 <span>',
      'probe.vue:7 <button> enthaelt <button>'
    ])
  })
})

// ── Gerenderte Pruefung: Header und Navigation ─────────────────────────────
const wrappers = []
afterEach(() => { while (wrappers.length) wrappers.pop().unmount() })

function zugaenglicherName (el) {
  const labelledby = el.getAttribute('aria-labelledby')
  if (labelledby) return labelledby.split(' ').map(id => document.getElementById(id)?.textContent || '').join(' ').trim()
  return (el.getAttribute('aria-label') || el.textContent || el.getAttribute('title') || '').trim()
}

function pruefeKnoepfe (root) {
  const ohneName = []
  for (const b of root.querySelectorAll('button, [role="button"], a[href]')) {
    if (!zugaenglicherName(b)) ohneName.push(b.outerHTML.slice(0, 120))
  }
  return ohneName
}

describe('Header und Navigation (gerendert)', () => {
  it('AppHeader: alle Knoepfe benannt, Menues mit aria-expanded, keine verschachtelten Knoepfe', async () => {
    const w = mount(AppHeader, { attachTo: document.body, global: { stubs: { Transition: false, Teleport: true } } })
    wrappers.push(w)
    expect(pruefeKnoepfe(w.element)).toEqual([])
    expect(w.element.querySelectorAll('button button').length).toBe(0)
    const menue = w.find('.tb-dropdown-btn')
    expect(menue.attributes('aria-expanded')).toBe('false')
    await menue.trigger('click')
    expect(menue.attributes('aria-expanded')).toBe('true')
    expect(w.find(`#${menue.attributes('aria-controls')}`).exists()).toBe(true)
    expect(pruefeKnoepfe(w.element)).toEqual([])
  })

  it('AppHeader: Speicherfehler erscheint als Hinweis-Dialog statt alert()', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const store = useThemeStore()
    store.saveToServer = () => Promise.reject(new Error('offline'))
    const { aktuelleAnfrage } = (await import('../../src/composables/useBestaetigung.js')).useBestaetigung()
    const w = mount(AppHeader, { attachTo: document.body, global: { stubs: { Transition: false, Teleport: true } } })
    wrappers.push(w)
    await w.find('.tb-btn-save').trigger('click')
    await new Promise(r => setTimeout(r, 0))
    expect(aktuelleAnfrage.value?.art).toBe('hinweis')
    expect(aktuelleAnfrage.value?.text).toBe('offline')
    aktuelleAnfrage.value.erledigen()
    console.error.mockRestore()
  })

  it('SidebarNav: benannte Knoepfe, aria-expanded/-controls an Gruppen, aria-current am aktiven Eintrag', async () => {
    const store = useThemeStore()
    const w = mount(SidebarNav, { attachTo: document.body })
    wrappers.push(w)
    expect(w.find('nav').attributes('aria-label')).toBeTruthy()
    expect(w.find('[role="tree"]').exists()).toBe(false)
    expect(w.find('.search-input').attributes('aria-label')).toBeTruthy()

    const kopf = w.findAll('.nav-group-header')[0]
    if (kopf.attributes('aria-expanded') === 'false') await kopf.trigger('click')
    expect(kopf.attributes('aria-expanded')).toBe('true')
    expect(w.find(`#${kopf.attributes('aria-controls')}`).exists()).toBe(true)

    const eintrag = w.find('.nav-item')
    await eintrag.trigger('click')
    expect(w.findAll('[aria-current="page"]')).toHaveLength(1)
    expect(w.find('[aria-current="page"]').classes()).toContain('active')
    expect(store.state.activeSection).toBeTruthy()

    expect(pruefeKnoepfe(w.element)).toEqual([])
    const ids = [...w.element.querySelectorAll('[id]')].map(e => e.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})
