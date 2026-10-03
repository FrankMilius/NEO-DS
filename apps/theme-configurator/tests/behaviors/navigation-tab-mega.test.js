/**
 * neo-behaviors: Hauptnavigation V3 Tab-Mega (navigation-tab-mega-recipe.json,
 * Entscheidung 03.10.2026 „Markup per Twig, Verhalten in neo-behaviors").
 * Gebunden wird an genau das Markup, das die Arena im Modus „Ausprobieren"
 * aus dem Recipe baut (src/arena-templates/navigation-tab-mega.js) — dasselbe
 * Markup rendert neo-nav.html.twig in Drupal. Jede Taste aus `keyboard` wird
 * geprueft, jedes Ereignis gegen `events`. Abgedeckt ist alles, was
 * neo_fe/js/neo-nav.js konnte, ausser dem Aufbau des Markups.
 */
import { describe, it, expect, afterEach, vi } from 'vitest'
import { anbinden, abbinden } from 'neo-behaviors'
import { lebendigesMarkup, zellenMarkup, buehne, taste, tastenAus, deckeTastenAb, sammle, passtZumRecipe } from './_helfer.js'

const ID = 'navigation-tab-mega'
afterEach(() => { document.body.innerHTML = ''; vi.useRealTimers() })
const aktiv = () => document.activeElement

/** Desktop- (Standard) oder Mobil-Instanz, gebunden. */
function aufbau ({ specimen = 'desktop-geschlossen', vorBinden } = {}) {
  const b = buehne(`<button type="button" id="draussen">draussen</button>\n${lebendigesMarkup(ID, specimen)}`)
  const kopf = b.querySelector('header.site-header[data-neo-nav]')
  vorBinden?.(kopf, b)
  anbinden(b)
  const $ = (s) => b.querySelector(s)
  const $$ = (s) => [...b.querySelectorAll(s)]
  const ziel = (el) => document.getElementById(el.getAttribute('aria-controls'))
  const knoepfe = $$('.nav-btn')
  const menue = (art) => {
    const knopf = $(`.hdr-btn[id$="${art === 'sprache' ? 'langToggle' : 'themeToggle'}"]`)
    return { knopf, pop: ziel(knopf), optionen: [...ziel(knopf).querySelectorAll('.hdr-opt')] }
  }
  return {
    b, kopf, $, $$, ziel, knoepfe,
    mega: knoepfe[0],
    dropdown: knoepfe[1],
    panel: (k) => ziel(k),
    tabs: () => [...ziel(knoepfe[0]).querySelectorAll('[role="tab"]')],
    suche: $('.search-toggle'),
    band: ziel($('.search-toggle')),
    feld: $('.search-input'),
    sprache: menue('sprache'),
    ansicht: menue('ansicht'),
    burger: $('.burger'),
    drawer: ziel($('.burger')),
    draussen: $('#draussen')
  }
}
const istOffen = (panel) => !panel.hidden && panel.classList.contains('is-open')
const alleEreignisse = (el) => {
  const liste = []
  for (const name of ['panel', 'tab', 'search', 'menu', 'select', 'language', 'drawer', 'screen', 'hidden']) el.addEventListener(`navigation-tab-mega-${name}`, (e) => liste.push(e))
  return liste
}

describe('navigation-tab-mega: Startzustand', () => {
  it('Ausprobieren startet zu (auch bei offenen Specimens), Auto-Hide aus', () => {
    for (const sp of ['desktop-geschlossen', 'panel-offen', 'kopfleiste-offen', 'mobil']) {
      const d = aufbau({ specimen: sp })
      expect(d.kopf.getAttribute('data-neo-behavior')).toContain(ID)
      expect(d.kopf.dataset.neoNavAutohide).toBe('aus')
      expect(d.$$('.panel').every((p) => p.hidden && !p.classList.contains('is-open'))).toBe(true)
      expect(d.band.hidden).toBe(true)
      expect(d.sprache.pop.hidden && d.ansicht.pop.hidden).toBe(true)
      expect(d.drawer.classList.contains('is-open')).toBe(false)
      expect(d.$$('[aria-expanded="true"]')).toHaveLength(0)
      document.body.innerHTML = ''
    }
  })

  it('Markup aus dem Recipe: Panels, Tabs, Drawer-Bildschirme stehen fertig da (nichts wird gebaut)', () => {
    const vorher = lebendigesMarkup(ID, 'desktop-geschlossen')
    const d = aufbau()
    expect(d.$$('.panel')).toHaveLength(4)
    expect(d.$$('.m-screen')).toHaveLength(5)
    expect(d.$$('.m-row[aria-controls]').every((z) => d.ziel(z)?.classList.contains('m-screen'))).toBe(true)
    // Bis auf Zustandsattribute unveraendert
    expect(d.$$('*').length).toBe(buehne(vorher).querySelectorAll('*').length + 1)
  })

  it('abbinden loest alles: Klick wirkt nicht mehr', () => {
    const d = aufbau()
    abbinden(d.b)
    expect(d.kopf.hasAttribute('data-neo-behavior')).toBe(false)
    d.mega.click()
    expect(istOffen(d.panel(d.mega))).toBe(false)
  })
})

describe('navigation-tab-mega: Panels', () => {
  it('Klick oeffnet (hidden weg, .is-open, aria-expanded), erneuter Klick schliesst mit Fokus zurueck; [hidden] nach 200 ms', () => {
    vi.useFakeTimers()
    const d = aufbau()
    const ev = sammle(d.kopf, 'navigation-tab-mega-panel')
    d.mega.click()
    const p = d.panel(d.mega)
    expect(istOffen(p)).toBe(true)
    expect(d.mega.getAttribute('aria-expanded')).toBe('true')
    d.mega.click()
    expect(p.classList.contains('is-open')).toBe(false)
    expect(d.mega.getAttribute('aria-expanded')).toBe('false')
    expect(aktiv()).toBe(d.mega)
    expect(p.hidden).toBe(false)
    vi.advanceTimersByTime(200)
    expect(p.hidden).toBe(true)
    expect(ev.map((e) => e.detail)).toEqual([{ value: 'nav-loesungen', open: true }, { value: 'nav-loesungen', open: false }])
    for (const e of ev) passtZumRecipe(ID, e)
  })

  it('nur ein Panel; Oeffnen schliesst Such-Band und Kopfleisten-Menues', () => {
    const d = aufbau()
    d.mega.click()
    d.dropdown.click()
    expect(istOffen(d.panel(d.dropdown))).toBe(true)
    expect(d.panel(d.mega).classList.contains('is-open')).toBe(false)
    expect(d.mega.getAttribute('aria-expanded')).toBe('false')
    d.suche.click()
    expect(d.panel(d.dropdown).classList.contains('is-open')).toBe(false)
    d.sprache.knopf.click()
    expect(d.band.classList.contains('is-open')).toBe(false)
    d.mega.click()
    expect(d.sprache.pop.hidden).toBe(true)
    expect(istOffen(d.panel(d.mega))).toBe(true)
  })

  it('Klick ausserhalb schliesst; Klick im Panel nicht', () => {
    const d = aufbau()
    d.mega.click()
    d.panel(d.mega).querySelector('.link-grid').click()
    expect(istOffen(d.panel(d.mega))).toBe(true)
    d.draussen.click()
    expect(d.panel(d.mega).classList.contains('is-open')).toBe(false)
  })

  it('ein Panel offen haelt den Wiederoeffnen-Wettlauf aus (kein spaetes hidden)', () => {
    vi.useFakeTimers()
    const d = aufbau()
    d.mega.click(); d.mega.click(); d.mega.click()
    vi.advanceTimersByTime(300)
    expect(istOffen(d.panel(d.mega))).toBe(true)
  })
})

describe('navigation-tab-mega: Mega-Tabs', () => {
  it('Klick waehlt (aria-selected, roving tabindex, tabpanel per hidden); navigation-tab-mega-tab wie im Recipe', () => {
    const d = aufbau()
    d.mega.click()
    const [t1, t2] = d.tabs()
    const ev = sammle(d.kopf, 'navigation-tab-mega-tab')
    t2.click()
    expect(t2.getAttribute('aria-selected')).toBe('true')
    expect(t1.getAttribute('aria-selected')).toBe('false')
    expect([t1.tabIndex, t2.tabIndex]).toEqual([-1, 0])
    expect(d.ziel(t2).hidden).toBe(false)
    expect(d.ziel(t1).hidden).toBe(true)
    t2.click() // gleicher Tab: kein Ereignis
    expect(ev.map((e) => e.detail)).toEqual([{ value: t2.id, previousValue: t1.id }])
    passtZumRecipe(ID, ev[0])
    expect(istOffen(d.panel(d.mega))).toBe(true)
  })
})

describe('navigation-tab-mega: Such-Band', () => {
  it('Ausloeser oeffnet, Fokus ins Feld; Schliessen-Knopf schliesst, Fokus zurueck; Ereignisse', () => {
    const d = aufbau()
    const ev = sammle(d.kopf, 'navigation-tab-mega-search')
    d.suche.click()
    expect(istOffen(d.band)).toBe(true)
    expect(d.suche.getAttribute('aria-expanded')).toBe('true')
    expect(aktiv()).toBe(d.feld)
    d.band.querySelector('.search-close').click()
    expect(d.band.classList.contains('is-open')).toBe(false)
    expect(aktiv()).toBe(d.suche)
    d.suche.click(); d.suche.click()
    expect(ev.map((e) => e.detail.open)).toEqual([true, false, true, false])
    for (const e of ev) passtZumRecipe(ID, e)
  })

  it('Loeschen-Knopf nur mit Text; leert, meldet input und fokussiert das Feld', () => {
    const d = aufbau()
    const knopf = d.band.querySelector('.search-clear')
    d.suche.click()
    expect(knopf.hidden).toBe(true)
    d.feld.value = 'Intranet'
    d.feld.dispatchEvent(new Event('input', { bubbles: true }))
    expect(knopf.hidden).toBe(false)
    const eingaben = sammle(d.feld, 'input')
    knopf.click()
    expect(d.feld.value).toBe('')
    expect(knopf.hidden).toBe(true)
    expect(eingaben).toHaveLength(1)
    expect(aktiv()).toBe(d.feld)
    expect(istOffen(d.band)).toBe(true)
  })

  it('Klick ausserhalb schliesst, Klick ins Band nicht', () => {
    const d = aufbau()
    d.suche.click()
    d.feld.click()
    expect(istOffen(d.band)).toBe(true)
    d.draussen.click()
    expect(d.band.classList.contains('is-open')).toBe(false)
  })
})

describe('navigation-tab-mega: Kopfleisten-Menues und Sprache', () => {
  it('Klick oeffnet (Fokus auf die erste Option), nur eines offen, erneuter Klick schliesst', () => {
    const d = aufbau()
    const ev = sammle(d.kopf, 'navigation-tab-mega-menu')
    d.sprache.knopf.click()
    expect(d.sprache.pop.hidden).toBe(false)
    expect(d.sprache.knopf.getAttribute('aria-expanded')).toBe('true')
    expect(aktiv()).toBe(d.sprache.optionen[0])
    d.ansicht.knopf.click()
    expect(d.sprache.pop.hidden).toBe(true)
    expect(d.ansicht.pop.hidden).toBe(false)
    d.ansicht.knopf.click()
    expect(d.ansicht.pop.hidden).toBe(true)
    expect(ev.map((e) => e.detail)).toEqual([
      { value: 'sprache', open: true }, { value: 'sprache', open: false }, { value: 'ansicht', open: true }, { value: 'ansicht', open: false }
    ])
    for (const e of ev) passtZumRecipe(ID, e)
  })

  it('Klick ausserhalb schliesst', () => {
    const d = aufbau()
    d.sprache.knopf.click()
    d.draussen.click()
    expect(d.sprache.pop.hidden).toBe(true)
  })

  it('Sprache EN: live neu beschriftet (Text, aria-label, data-text, placeholder), Haken, Kuerzel, lang an Header und Drawer', () => {
    const d = aufbau()
    const ev = alleEreignisse(d.kopf)
    d.sprache.knopf.click()
    d.sprache.optionen[1].click()
    expect(d.sprache.pop.hidden).toBe(true)
    expect(aktiv()).toBe(d.sprache.knopf)
    expect(d.sprache.optionen.map((o) => o.getAttribute('aria-checked'))).toEqual(['false', 'true'])
    expect(d.$('[data-lang-code]').textContent).toBe('EN')
    expect(d.mega.querySelector('.nav-btn__label > span').textContent).toBe('Solutions')
    expect(d.mega.querySelector('.nav-btn__label').dataset.text).toBe('Solutions')
    expect(d.panel(d.mega).getAttribute('aria-label')).toBe('Solutions')
    expect(d.feld.placeholder).toBe('Search the website …')
    expect(d.$('.panel-overview span').textContent).toBe('View overview')
    expect(d.$('.m-cta').textContent).toBe('Contact')
    expect(d.$('.m-back span').textContent).toBe('Back')
    expect(d.$('.nav-link').textContent).toBe('Editions & pricing')
    expect(d.$('.nav-btn[id$="nav-inside"] .nav-btn__label > span').textContent).toBe('Inside') // ohne Uebersetzung: DE
    expect(d.$$('.lang-switch button').map((x) => x.getAttribute('aria-pressed'))).toEqual(['false', 'true'])
    expect(d.kopf.getAttribute('lang')).toBe('en')
    expect(d.drawer.getAttribute('lang')).toBe('en')
    expect(document.documentElement.getAttribute('lang')).not.toBe('en')
    const namen = ev.map((e) => e.type)
    expect(namen).toEqual(['navigation-tab-mega-menu', 'navigation-tab-mega-language', 'navigation-tab-mega-select', 'navigation-tab-mega-menu'])
    expect(ev[1].detail).toEqual({ value: 'en' })
    expect(ev[2].detail).toEqual({ menu: 'sprache', value: 'en' })
    for (const e of ev) passtZumRecipe(ID, e)
    // zurueck ueber den Umschalter im Drawer
    d.$('.lang-switch button[data-lang="de"]').click()
    expect(d.mega.querySelector('.nav-btn__label > span').textContent).toBe('Lösungen')
    expect(d.sprache.optionen.map((o) => o.getAttribute('aria-checked'))).toEqual(['true', 'false'])
    expect(d.$('[data-lang-code]').textContent).toBe('DE')
  })

  it('Erscheinungsbild: meldet die Wahl (navigation-tab-mega-select), schliesst mit Fokus zurueck', () => {
    const d = aufbau()
    const ev = sammle(d.kopf, 'navigation-tab-mega-select')
    d.ansicht.knopf.click()
    d.ansicht.optionen[1].click()
    expect(ev.map((e) => e.detail)).toEqual([{ menu: 'ansicht', value: 'neo-dark-theme' }])
    passtZumRecipe(ID, ev[0])
    expect(d.ansicht.pop.hidden).toBe(true)
    expect(aktiv()).toBe(d.ansicht.knopf)
  })
})

describe('navigation-tab-mega: mobiler Drawer', () => {
  const mobil = () => aufbau({ specimen: 'mobil' })

  it('Burger oeffnet/schliesst: .is-open, aria-expanded, aria-label, Symbol; Ereignis mit reason', () => {
    const d = mobil()
    const ev = sammle(d.kopf, 'navigation-tab-mega-drawer')
    d.burger.click()
    expect(d.drawer.classList.contains('is-open')).toBe(true)
    expect(d.burger.getAttribute('aria-expanded')).toBe('true')
    expect(d.burger.getAttribute('aria-label')).toBe('Menü schließen')
    expect(d.burger.querySelector('path').getAttribute('d')).toBe('M6 6l12 12M18 6L6 18')
    d.burger.click()
    expect(d.drawer.classList.contains('is-open')).toBe(false)
    expect(d.burger.getAttribute('aria-label')).toBe('Menü öffnen')
    expect(d.burger.querySelector('path').getAttribute('d')).toBe('M3 6h18M3 12h18M3 18h18')
    expect(ev.map((e) => e.detail)).toEqual([{ open: true, reason: 'trigger' }, { open: false, reason: 'trigger' }])
    for (const e of ev) passtZumRecipe(ID, e)
  })

  it('Push-Navigation: Zeile schiebt ihren Bildschirm (vorheriger .is-prev), Fokus auf Zurueck; Zurueck stellt wieder her, Fokus auf die Zeile', () => {
    const d = mobil()
    const ev = sammle(d.kopf, 'navigation-tab-mega-screen')
    d.burger.click()
    const start = d.$('.m-screen[data-screen="root"]')
    const zeile = start.querySelector('button.m-row')
    zeile.click()
    const unter = d.ziel(zeile)
    expect(unter.classList.contains('is-active')).toBe(true)
    expect(start.classList.contains('is-prev')).toBe(true)
    expect(start.classList.contains('is-active')).toBe(false)
    expect(aktiv()).toBe(unter.querySelector('.m-back'))
    unter.querySelector('.m-back').click()
    expect(start.classList.contains('is-active')).toBe(true)
    expect(unter.classList.contains('is-active') || unter.classList.contains('is-prev')).toBe(false)
    expect(aktiv()).toBe(zeile)
    expect(ev.map((e) => e.detail.value)).toEqual(['nav-loesungen', 'root'])
    for (const e of ev) passtZumRecipe(ID, e)
  })

  it('inert: geschlossener Drawer und verschobene Bildschirme sind nicht bedienbar', () => {
    const d = mobil()
    const screens = d.$$('.m-screen')
    expect(d.drawer.hasAttribute('inert')).toBe(true)
    d.burger.click()
    expect(d.drawer.hasAttribute('inert')).toBe(false)
    expect(screens.filter((s) => !s.hasAttribute('inert')).map((s) => s.dataset.screen)).toEqual(['root'])
    d.$('.m-screen[data-screen="root"] button.m-row').click()
    expect(screens.filter((s) => !s.hasAttribute('inert')).map((s) => s.dataset.screen)).toEqual(['nav-loesungen'])
    d.burger.click()
    expect(d.drawer.hasAttribute('inert')).toBe(true)
    abbinden(d.b)
    expect(d.b.querySelector('[inert]')).toBeNull()
  })

  it('Schliessen setzt auf den Startbildschirm zurueck', () => {
    const d = mobil()
    d.burger.click()
    d.$$('.m-screen[data-screen="root"] button.m-row')[2].click()
    d.burger.click()
    expect(d.$('.m-screen[data-screen="root"]').classList.contains('is-active')).toBe(true)
    expect(d.$$('.m-screen.is-active')).toHaveLength(1)
    expect(d.$$('.m-screen.is-prev')).toHaveLength(0)
  })

  it('Zustände-Markup (Unterseite offen) wird uebernommen: Zurueck fuehrt zum Start', () => {
    const b = buehne(zellenMarkup(ID, 'mobil', 0, 2))
    anbinden(b)
    const unter = b.querySelector('.m-screen.is-active')
    expect(unter.dataset.screen).toBe('nav-loesungen')
    unter.querySelector('.m-back').click()
    expect(b.querySelector('.m-screen[data-screen="root"]').classList.contains('is-active')).toBe(true)
  })
})

describe('navigation-tab-mega: aktueller Ast', () => {
  const mitPfad = (pfad) => aufbau({ vorBinden: (k) => { k.dataset.neoNavPfad = pfad } })
  const markiert = (d) => d.$$('.nav-list [aria-current]').map((el) => [el.textContent.trim(), el.getAttribute('aria-current'), el.classList.contains('is-active')])

  it('Uebersichtsseite = page, Seite im Panel = true, einfacher Link = page; laengster Treffer, nur an Pfadgrenzen', () => {
    expect(markiert(mitPfad('/loesungen/'))).toEqual([['Lösungen', 'page', true]])
    document.body.innerHTML = ''
    expect(markiert(mitPfad('/gesundheitswesen'))).toEqual([['Lösungen', 'true', true]])
    document.body.innerHTML = ''
    expect(markiert(mitPfad('/produkte/ai/details'))).toEqual([['Produkte', 'true', true]])
    document.body.innerHTML = ''
    expect(markiert(mitPfad('/editionen-preise'))).toEqual([['Editionen & Preise', 'page', true]])
    document.body.innerHTML = ''
    expect(markiert(mitPfad('/loesungen-archiv'))).toEqual([])
  })

  it('serverseitig gesetztes aria-current bleibt unangetastet', () => {
    const d = aufbau({ vorBinden: (k) => { k.dataset.neoNavPfad = '/produkte'; k.querySelector('.nav-link').setAttribute('aria-current', 'page') } })
    expect(d.$$('.nav-list [aria-current]')).toHaveLength(1)
    expect(d.dropdown.hasAttribute('aria-current')).toBe(false)
  })
})

describe('navigation-tab-mega: Auto-Hide', () => {
  function scrolle (y) {
    Object.defineProperty(window, 'scrollY', { value: y, configurable: true })
    window.dispatchEvent(new Event('scroll'))
  }
  function mitAutohide () {
    window.requestAnimationFrame = (fn) => { fn(0); return 0 }
    scrolle(0)
    return aufbau({ vorBinden: (k) => k.removeAttribute('data-neo-nav-autohide') })
  }
  afterEach(() => { Object.defineProperty(window, 'scrollY', { value: 0, configurable: true }) })

  it('runter (ab 120 px, Schwelle 8 px) versteckt, hoch zeigt; Ereignis navigation-tab-mega-hidden', () => {
    const d = mitAutohide()
    const ev = sammle(d.kopf, 'navigation-tab-mega-hidden')
    scrolle(100)
    expect(d.kopf.classList.contains('is-nav-hidden')).toBe(false)
    scrolle(300)
    expect(d.kopf.classList.contains('is-nav-hidden')).toBe(true)
    scrolle(295) // unter der Schwelle
    expect(d.kopf.classList.contains('is-nav-hidden')).toBe(true)
    scrolle(280)
    expect(d.kopf.classList.contains('is-nav-hidden')).toBe(false)
    expect(ev.map((e) => e.detail.hidden)).toEqual([true, false])
    for (const e of ev) passtZumRecipe(ID, e)
  })

  it('gesperrt bei offenem Panel, Fokus im Header oder Sprung per Skript', () => {
    const d = mitAutohide()
    scrolle(130)
    d.mega.click()
    scrolle(400)
    expect(d.kopf.classList.contains('is-nav-hidden')).toBe(false)
    d.draussen.click()
    d.draussen.focus()
    scrolle(800)
    expect(d.kopf.classList.contains('is-nav-hidden')).toBe(true)
    d.mega.focus() // focusin zeigt sofort
    expect(d.kopf.classList.contains('is-nav-hidden')).toBe(false)
    d.draussen.focus()
    document.documentElement.setAttribute('data-neo-sprung', '')
    scrolle(1400)
    expect(d.kopf.classList.contains('is-nav-hidden')).toBe(false)
    document.documentElement.removeAttribute('data-neo-sprung')
  })

  it('data-neo-nav-autohide="aus" (Arena): nichts passiert', () => {
    const d = aufbau()
    scrolle(0); scrolle(600)
    expect(d.kopf.classList.contains('is-nav-hidden')).toBe(false)
  })
})

describe('navigation-tab-mega: Tasten aus dem Recipe', () => {
  const pruefungen = {
    Enter: () => {
      const d = aufbau()
      d.mega.focus()
      taste(d.mega, 'Enter')
      expect(istOffen(d.panel(d.mega))).toBe(true)
      taste(d.mega, 'Enter')
      expect(d.panel(d.mega).classList.contains('is-open')).toBe(false)
      expect(aktiv()).toBe(d.mega)
    },
    Space: () => {
      const d = aufbau()
      taste(d.dropdown, 'Space')
      expect(istOffen(d.panel(d.dropdown))).toBe(true)
      expect(d.dropdown.getAttribute('aria-expanded')).toBe('true')
    },
    ArrowDown: () => {
      const d = aufbau()
      d.mega.click()
      const [t1, t2] = d.tabs()
      t1.focus()
      const e = taste(t1, 'ArrowDown')
      expect(e.defaultPrevented).toBe(true)
      expect(aktiv()).toBe(t2)
      expect(t2.getAttribute('aria-selected')).toBe('true')
      taste(t2, 'ArrowDown') // rundum
      expect(aktiv()).toBe(t1)
      expect(t1.getAttribute('aria-selected')).toBe('true')
      // Menue: naechste Option, rundum
      d.ansicht.knopf.click()
      const o = d.ansicht.optionen
      taste(o[0], 'ArrowDown'); expect(aktiv()).toBe(o[1])
      taste(o[1], 'ArrowDown'); taste(o[2], 'ArrowDown'); expect(aktiv()).toBe(o[0])
    },
    ArrowUp: () => {
      const d = aufbau()
      d.mega.click()
      const [t1, t2] = d.tabs()
      taste(t1, 'ArrowUp')
      expect(aktiv()).toBe(t2)
      expect(t2.getAttribute('aria-selected')).toBe('true')
      d.sprache.knopf.click()
      taste(d.sprache.optionen[0], 'ArrowUp')
      expect(aktiv()).toBe(d.sprache.optionen[1])
    },
    Escape: () => {
      // Reihenfolge: Menue, Such-Band, Panel (je Fokus zurueck), Drawer (ohne)
      const d = aufbau()
      d.mega.click()
      d.sprache.knopf.click()
      let e = taste(d.sprache.optionen[0], 'Escape')
      expect(e.defaultPrevented).toBe(true)
      expect(d.sprache.pop.hidden).toBe(true)
      expect(aktiv()).toBe(d.sprache.knopf)
      d.suche.click()
      taste(d.feld, 'Escape')
      expect(d.band.classList.contains('is-open')).toBe(false)
      expect(aktiv()).toBe(d.suche)
      d.dropdown.click()
      d.panel(d.dropdown).querySelector('a').focus()
      taste(aktiv(), 'Escape')
      expect(d.panel(d.dropdown).classList.contains('is-open')).toBe(false)
      expect(aktiv()).toBe(d.dropdown)
      e = taste(d.dropdown, 'Escape') // nichts offen: nichts zu tun
      expect(e.defaultPrevented).toBe(false)
      document.body.innerHTML = ''
      const m = aufbau({ specimen: 'mobil' })
      const ev = sammle(m.kopf, 'navigation-tab-mega-drawer')
      m.burger.click()
      m.$('.m-screen[data-screen="root"] button.m-row').click()
      const fokusVorher = aktiv()
      taste(fokusVorher, 'Escape')
      expect(m.drawer.classList.contains('is-open')).toBe(false)
      expect(aktiv()).toBe(m.burger) // Fokus lag im Drawer, der jetzt inert ist
      expect(m.$('.m-screen[data-screen="root"]').classList.contains('is-active')).toBe(true)
      expect(ev.at(-1).detail).toEqual({ open: false, reason: 'escape' })
    }
  }
  it('jede Taste hat eine Pruefung', () => deckeTastenAb(ID, pruefungen))
  for (const t of tastenAus(ID)) it(t, () => pruefungen[t]())
})
