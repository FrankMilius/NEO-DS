/**
 * Shell — Drawer der Mobil-Lage (neo-behaviors shell.js, Entscheidung
 * 06.10.2026, shell-verhalten). Gebunden wird an das Markup, das die Arena im
 * Modus „Ausprobieren" aus dem Recipe baut (Mobil-Fenster mit Drawer-Knopf).
 * Die Mobil-Lage erkennt das Behavior an position: fixed der Sidebar — hier
 * setzt ein Stylesheet dieselben Werte wie der Rahmen ra-fenster--mobil (im
 * DS: respond-to-max('lg') in 08-templates/_shell.scss).
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { anbinden, abbinden } from 'neo-behaviors'
import { buehne, lebendigesMarkup, taste, tastenAus, deckeTastenAb, sammle, passtZumRecipe } from './_helfer.js'

const aktiv = () => document.activeElement

let stil
beforeEach(() => {
  stil = document.createElement('style')
  stil.textContent = '.ra-fenster--mobil .nc-shell__sidebar-left, .ra-fenster--mobil .nc-shell__sidebar-right { position: fixed; }'
  document.head.append(stil)
})
afterEach(() => { abbinden(document.body); document.body.innerHTML = ''; stil.remove() })

/** Dashboard (linke Sidebar) bzw. Docs (beide Sidebars) im Mobil-Fenster */
function aufbau (specimen = 'sidebar-states', ersetze = (h) => h) {
  const b = buehne(ersetze(lebendigesMarkup('shell', specimen)))
  // Inhalt neben der Buehne: wird inert; ein schon inertes Element bleibt es
  const davor = document.createElement('div'); davor.innerHTML = '<a href="#">Seite</a>'
  const schonInert = document.createElement('div'); schonInert.setAttribute('inert', '')
  document.body.prepend(davor, schonInert)
  anbinden(b)
  const shell = b.querySelector('.nc-shell')
  const links = shell.querySelector('.nc-shell__sidebar-left')
  const rechts = shell.querySelector('.nc-shell__sidebar-right')
  const knopf = (panel) => b.querySelector(`[aria-controls="${panel.id}"]`)
  const overlay = () => shell.querySelector('.nc-shell__sidebar-overlay')
  return { b, shell, links, rechts, knopf, overlay, davor, schonInert }
}
const offen = (s, seite = 'left') => s.shell.classList.contains(`nc-shell--sidebar-${seite}-drawer-open`)

describe('Shell (shell-recipe.json): Drawer der Mobil-Lage', () => {
  it('Markup aus der Arena: Knopf mit aria-controls/aria-expanded, Sidebar mit id, Overlay geschlossen', () => {
    const s = aufbau()
    expect(s.shell.closest('.ra-fenster--mobil')).not.toBeNull()
    expect(s.knopf(s.links).getAttribute('aria-expanded')).toBe('false')
    expect(s.knopf(s.links).hasAttribute('data-shell-toggle')).toBe(true)
    expect(s.overlay().classList.contains('nc-shell__sidebar-overlay--visible')).toBe(false)
    expect(s.shell.getAttribute('data-neo-behavior')).toBe('shell')
  })

  it('Knopf oeffnet (Klasse, Overlay, aria-expanded, Fokus in die Sidebar), Overlay schliesst (Fokus zurueck); shell-drawer-toggle', () => {
    const s = aufbau()
    const k = s.knopf(s.links)
    const ev = sammle(s.shell, 'shell-drawer-toggle')
    k.focus()
    k.click()
    expect(offen(s)).toBe(true)
    expect(s.overlay().classList.contains('nc-shell__sidebar-overlay--visible')).toBe(true)
    expect(k.getAttribute('aria-expanded')).toBe('true')
    expect(aktiv()).toBe(s.links.querySelector('a'))
    s.overlay().click()
    expect(offen(s)).toBe(false)
    expect(s.overlay().classList.contains('nc-shell__sidebar-overlay--visible')).toBe(false)
    expect(k.getAttribute('aria-expanded')).toBe('false')
    expect(aktiv()).toBe(k)
    expect(ev.map((e) => e.detail)).toEqual([
      { side: 'left', open: true, reason: 'trigger' },
      { side: 'left', open: false, reason: 'overlay-click' }
    ])
    for (const e of ev) passtZumRecipe('shell', e)
  })

  it('offen: Rest der Seite inert (Overlay und Sidebar nicht), Escape gibt nur das eigene inert frei', () => {
    const s = aufbau()
    const k = s.knopf(s.links)
    k.click()
    for (const sel of ['.nc-shell__navbar', '.nc-shell__main', '.nc-shell__footerbar', '.nc-shell__skip-link']) {
      expect(s.shell.querySelector(sel).hasAttribute('inert'), sel).toBe(true)
    }
    expect(s.davor.hasAttribute('inert')).toBe(true)
    expect(s.overlay().hasAttribute('inert')).toBe(false)
    expect(s.links.closest('[inert]')).toBeNull()
    taste(aktiv(), 'Escape')
    expect(offen(s)).toBe(false)
    expect(s.b.querySelector('[inert]')).toBeNull()
    expect(s.davor.hasAttribute('inert')).toBe(false)
    expect(s.schonInert.hasAttribute('inert')).toBe(true)
    expect(aktiv()).toBe(k)
  })

  it('Tab und Shift+Tab bleiben in der offenen Sidebar', () => {
    const s = aufbau()
    s.knopf(s.links).click()
    const liste = [...s.links.querySelectorAll('a')]
    liste.at(-1).focus()
    expect(taste(liste.at(-1), 'Tab').defaultPrevented).toBe(true)
    expect(aktiv()).toBe(liste[0])
    expect(taste(liste[0], 'Shift+Tab').defaultPrevented).toBe(true)
    expect(aktiv()).toBe(liste.at(-1))
    liste[0].focus()
    expect(taste(liste[0], 'Tab').defaultPrevented).toBe(false) // mitten drin: nativ
  })

  it('zwei Sidebars (Docs): rechte Seite oeffnet von rechts; hoechstens ein Drawer offen', () => {
    const s = aufbau('z-index-governance')
    const ev = sammle(s.shell, 'shell-drawer-toggle')
    s.knopf(s.rechts).click()
    expect(offen(s, 'right')).toBe(true)
    expect(offen(s, 'left')).toBe(false)
    // programmatisch (der Knopf ist inert): wechselt die Seite
    s.knopf(s.links).click()
    expect(offen(s, 'left')).toBe(true)
    expect(offen(s, 'right')).toBe(false)
    expect(s.knopf(s.rechts).getAttribute('aria-expanded')).toBe('false')
    expect(ev.map((e) => e.detail)).toEqual([
      { side: 'right', open: true, reason: 'trigger' },
      { side: 'right', open: false, reason: 'trigger' },
      { side: 'left', open: true, reason: 'trigger' }
    ])
  })

  it('Sidebar ohne bedienbare Elemente: Fokus auf die Sidebar (tabindex -1 nur solange offen)', () => {
    const s = aufbau('sidebar-states', (h) => h.replace(/<a href="#" onclick="return false">[^<]*<\/a>/g, ''))
    s.knopf(s.links).click()
    expect(s.links.getAttribute('tabindex')).toBe('-1')
    expect(aktiv()).toBe(s.links)
    taste(aktiv(), 'Escape')
    expect(s.links.hasAttribute('tabindex')).toBe(false)
  })

  it('ohne Overlay im Markup: beim Oeffnen angelegt (aria-hidden), Klick schliesst, Abbinden entfernt es', () => {
    const s = aufbau('sidebar-states', (h) => h.replace('<div class="nc-shell__sidebar-overlay" aria-hidden="true"></div>', ''))
    expect(s.overlay()).toBeNull()
    s.knopf(s.links).click()
    const o = s.overlay()
    expect(o.getAttribute('aria-hidden')).toBe('true')
    expect(o.classList.contains('nc-shell__sidebar-overlay--visible')).toBe(true)
    o.click()
    expect(offen(s)).toBe(false)
    abbinden(s.b)
    expect(s.overlay()).toBeNull()
  })

  it('Fenster waechst ueber lg (Sidebar nicht mehr fixed): Drawer zu, Rest frei; reason resize', () => {
    const s = aufbau()
    const ev = sammle(s.shell, 'shell-drawer-toggle')
    s.knopf(s.links).click()
    s.shell.closest('.ra-fenster').classList.remove('ra-fenster--mobil')
    window.dispatchEvent(new Event('resize'))
    expect(offen(s)).toBe(false)
    expect(s.davor.hasAttribute('inert')).toBe(false)
    expect(ev.at(-1).detail).toEqual({ side: 'left', open: false, reason: 'resize' })
  })

  it('Desktop-Lage (ab lg): der Knopf tut nichts', () => {
    const s = aufbau('sidebar-states', (h) => h.replace('ra-fenster ra-fenster--mobil', 'ra-fenster'))
    const k = s.knopf(s.links)
    const klick = new MouseEvent('click', { bubbles: true, cancelable: true })
    k.dispatchEvent(klick)
    expect(klick.defaultPrevented).toBe(false)
    expect(offen(s)).toBe(false)
    expect(k.getAttribute('aria-expanded')).toBe('false')
  })

  it('Abbinden bei offenem Drawer: Klasse weg, Rest frei', () => {
    const s = aufbau()
    s.knopf(s.links).click()
    abbinden(s.b)
    expect(offen(s)).toBe(false)
    expect(s.davor.hasAttribute('inert')).toBe(false)
    expect(s.shell.hasAttribute('data-neo-behavior')).toBe(false)
  })

  describe('Tasten aus dem Recipe', () => {
    const pruefungen = {
      Enter: () => { const s = aufbau(); taste(s.knopf(s.links), 'Enter'); expect(offen(s)).toBe(true) },
      Space: () => { const s = aufbau(); taste(s.knopf(s.links), 'Space'); expect(offen(s)).toBe(true) },
      Escape: () => {
        const s = aufbau(); const k = s.knopf(s.links); const ev = sammle(s.shell, 'shell-drawer-toggle')
        expect(taste(k, 'Escape').defaultPrevented).toBe(false) // zu: Escape bleibt frei
        taste(k, 'Enter')
        const e = taste(aktiv(), 'Escape')
        expect(e.defaultPrevented).toBe(true); expect(offen(s)).toBe(false); expect(aktiv()).toBe(k)
        expect(ev.at(-1).detail).toEqual({ side: 'left', open: false, reason: 'escape' })
      },
      Tab: () => {
        const s = aufbau(); s.knopf(s.links).click(); const l = [...s.links.querySelectorAll('a')]; l.at(-1).focus()
        expect(taste(l.at(-1), 'Tab').defaultPrevented).toBe(true); expect(aktiv()).toBe(l[0])
      },
      'Shift+Tab': () => {
        const s = aufbau(); s.knopf(s.links).click(); const l = [...s.links.querySelectorAll('a')]
        expect(taste(l[0], 'Shift+Tab').defaultPrevented).toBe(true); expect(aktiv()).toBe(l.at(-1))
      }
    }
    it('jede Taste hat eine Pruefung', () => deckeTastenAb('shell', pruefungen))
    for (const t of tastenAus('shell')) it(t, () => pruefungen[t]())
  })
})
