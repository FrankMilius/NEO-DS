/**
 * Website-Hauptnavigation „V3 Tab-Mega" (navigation-tab-mega) aus dem Recipe.
 * Aufgenommen aus dem Drupal-Theme (neo_nav / neo_fe, Entscheidung 02.10.2026).
 * Geprueft wird die Markup-Struktur jedes Specimens, so wie neo-nav.js sie im
 * Browser aufbaut (Twig-Huelle + Menuepunkte, Panels, Drawer):
 *   - keine Sonderfall-Arena, jede Zelle jedes Specimens aus der Vorlage
 *   - nur Klassen aus styles.css bzw. der Recipe-Anatomie, keine
 *     Inline-Stile, nur die Zustandsklassen, die neo-nav.css kennt
 *   - Zustaende je Specimen: offenes Panel/Such-Band/Menue, Teaser mit/ohne,
 *     Teaser-Flaechen und -Knoepfe, aktueller Ast, Auto-Hide, mobiler Drawer
 *   - ids/Bezuege/Landmarken/Knopfnamen, Split-Modus
 *   - Verhalten aus neo-behaviors (navigation-tab-mega, Entscheidung
 *     03.10.2026): „Ausprobieren" startet zu, das Behavior oeffnet (Tests
 *     des Verhaltens: tests/behaviors/navigation-tab-mega.test.js);
 *     data/markup und Pipeline-Eintraege vorhanden
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { mount, flushPromises } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import { MIT_VERHALTEN } from 'neo-behaviors'
import RecipeArena from '../../src/components/laboratory/RecipeArena.vue'
import { vorlageFuer } from '../../src/arena-templates/index.js'
import { normalisiereRecipe, specimenAnsicht, fuerWeiteresThema } from '../../src/lib/recipe-arena.js'
import { hasArena, arenaQuelle } from '../../src/composables/useArenaResolver.js'
import { vorschauVariablen } from '../../src/lib/vorschau-variablen.js'
import { useThemeStore } from '../../src/stores/theme.js'
import { WURZEL, rohesRecipe } from './_recipes.js'

const ID = 'navigation-tab-mega'

function zellen (specimenId) {
  const recipe = normalisiereRecipe(rohesRecipe(ID))
  return recipe.specimens
    .filter((sp) => !specimenId || sp.id === specimenId)
    .flatMap((sp) => specimenAnsicht(sp, recipe, ID, vorlageFuer(ID)).zeilen
      .flatMap((z) => z.zellen.map((c) => ({ ...c, specimen: sp }))))
}

function dom (html) {
  const d = document.createElement('div')
  d.innerHTML = html
  return d
}

const alle = (sp) => zellen(sp).map((z) => dom(z.html))
const offenesPanel = (d) => d.querySelectorAll('.panel:not([hidden])')

function dsKlassen () {
  const styles = resolve(WURZEL, 'styles.css')
  if (!existsSync(styles)) throw new Error('styles.css fehlt — im Wurzelordner `npm run build:css` ausfuehren')
  const css = readFileSync(styles, 'utf8')
  return new Set([...css.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)].map((m) => m[1]))
}

function anatomieKlassen () {
  const r = rohesRecipe(ID)
  const sel = [r.anatomy.root.element, ...r.anatomy.slots.map((s) => s.element)]
  const modifier = Object.values(r.axes).flatMap((a) => Object.values(a.values).map((v) => v.modifier)).filter(Boolean)
  return new Set([...sel.flatMap((s) => [...s.matchAll(/\.([\w-]+)/g)].map((m) => m[1])), ...modifier])
}

// Zustandsklassen aus neo-nav.css bzw. neo-nav.js — je Element
const ZUSTAENDE = {
  'is-nav-hidden': ['site-header'],
  'is-open': ['panel', 'search-band', 'm-drawer'],
  'is-active': ['nav-btn', 'm-screen'],
  'is-prev': ['m-screen']
}

describe('navigation-tab-mega aus dem Recipe', () => {
  it('keine Sonderfall-Arena, jede Zelle jedes Specimens aus der Vorlage', () => {
    expect(hasArena(ID)).toBe(false)
    expect(arenaQuelle(ID)).toBe('recipe')
    expect(vorlageFuer(ID)).toBeTypeOf('function')
    const z = zellen()
    expect(new Set(z.map((c) => c.quelle))).toEqual(new Set(['vorlage']))
    expect(z.filter((c) => c.fehler)).toEqual([])
    const recipe = normalisiereRecipe(rohesRecipe(ID))
    expect(recipe.arena.hinweise).toEqual([])
    expect(new Set(z.map((c) => c.specimen.id))).toEqual(new Set(recipe.specimens.map((s) => s.id)))
    expect(recipe.specimens.map((s) => s.id)).toEqual(['desktop-geschlossen', 'panel-offen', 'kopfleiste-offen', 'teaser-flaechen', 'teaser-knopf', 'mobil'])
    expect(z.length).toBe(21)
  })

  it('Recipe, Spec, Registry und Story zeigen auf dieselben Artefakte', () => {
    const r = rohesRecipe(ID)
    const ziel = 'apps/theme-configurator/src/components/laboratory/RecipeArena.vue'
    expect(r.meta.pipeline.arena).toBe(ziel)
    expect(r.meta.pipeline.scss).toEqual(['scss/scss/07-organisms/_navigation-tab-mega.scss'])
    for (const p of [...r.meta.pipeline.scss, r.meta.pipeline.story, 'data/markup/navigation-tab-mega.html']) expect(existsSync(resolve(WURZEL, p)), p).toBe(true)
    const spec = JSON.parse(readFileSync(resolve(WURZEL, `specs/${ID}.spec.json`), 'utf8'))
    expect(JSON.stringify(spec)).toContain(ziel)
    const reg = JSON.parse(readFileSync(resolve(WURZEL, 'data/component-registry.json'), 'utf8'))
    expect(reg.components[ID].paths.arena).toBe(ziel)
    expect(reg.components[ID].paths.scss).toEqual(r.meta.pipeline.scss)
    const index = readFileSync(resolve(WURZEL, 'scss/scss/07-organisms/_index.scss'), 'utf8')
    expect(index).toMatch(/@forward 'navigation-tab-mega';/)
  })

  it('nur Klassen aus styles.css bzw. der Anatomie; Arena-Rahmen nie an Bauteil-Elementen', () => {
    const bekannt = dsKlassen()
    const anatomie = anatomieKlassen()
    for (const z of zellen()) {
      const d = dom(z.html)
      expect(d.querySelector('header.site-header[data-neo-nav]'), z.id).not.toBeNull()
      for (const el of d.querySelectorAll('[class]')) {
        for (const k of el.classList) {
          if (/^ra-/.test(k)) {
            expect([...el.classList].every((x) => /^ra-/.test(x)), `${z.specimen.id}/${z.id}: ${el.className}`).toBe(true)
            continue
          }
          if (ZUSTAENDE[k]) continue
          expect(bekannt.has(k) || anatomie.has(k), `${z.specimen.id}/${z.id}: Klasse ${k} fehlt in styles.css`).toBe(true)
        }
      }
    }
  })

  it('jede Regel des Bauteils in styles.css haengt an seiner Wurzel', () => {
    const css = readFileSync(resolve(WURZEL, 'styles.css'), 'utf8')
    // Auszug des Bauteils: die Klassen, die nur die Navigation fuehrt
    let geprueft = 0
    for (const k of ['panel', 'tab', 'tablist', 'teaser', 'mega-grid', 'hdr-pop', 'm-screen', 'searchbox']) {
      for (const m of css.matchAll(new RegExp(`(?:^|[{},])([^{}]*\\.${k}(?![\\w-])[^{}]*)\\{`, 'g'))) {
        for (const sel of m[1].split(/,(?![^(]*\))/)) {
          if (!new RegExp(`\\.${k}(?![\\w-])`).test(sel)) continue
          geprueft++
          expect(sel.trim(), `.${k}`).toMatch(/^(\.site-header\[data-neo-nav\]|:where\(\.site-header\[data-neo-nav\],\s*\.m-drawer\)|\.m-drawer|\.neo-dark-theme :where|\[data-theme=["']?neo-dark-theme["']?\] :where)/)
        }
      }
    }
    expect(geprueft).toBeGreaterThan(20)
  })

  it('keine Inline-Stile, nur Zustandsklassen aus neo-nav.css am richtigen Element', () => {
    for (const z of zellen()) {
      const d = dom(z.html)
      expect(d.querySelector('[style]'), `${z.specimen.id}/${z.id}`).toBeNull()
      for (const el of d.querySelectorAll('[class*="is-"]')) {
        for (const k of [...el.classList].filter((c) => c.startsWith('is-'))) {
          expect(ZUSTAENDE[k], `${z.specimen.id}/${z.id}: ${k}`).toBeTruthy()
          expect(ZUSTAENDE[k].some((t) => el.classList.contains(t)), `${z.specimen.id}/${z.id}: ${k} an ${el.className}`).toBe(true)
        }
      }
      expect(d.querySelector('[data-state]')).toBeNull()
    }
  })

  it('ids je Zelle eindeutig, Bezuege vorhanden, Landmarken beschriftet, Knoepfe benannt', () => {
    for (const z of zellen()) {
      const d = dom(z.html)
      const ids = [...d.querySelectorAll('[id]')].map((e) => e.id)
      expect(new Set(ids).size, `${z.specimen.id}/${z.id}`).toBe(ids.length)
      for (const el of d.querySelectorAll('[aria-labelledby], [aria-controls], label[for]')) {
        for (const a of ['aria-labelledby', 'aria-controls', 'for']) {
          for (const ref of (el.getAttribute(a) || '').split(/\s+/).filter(Boolean)) {
            expect(d.querySelector(`#${ref}`), `${z.specimen.id}/${z.id}: ${a}="${ref}"`).not.toBeNull()
          }
        }
      }
      for (const el of d.querySelectorAll('nav, [role="region"], [role="group"], [role="tablist"]')) expect(el.getAttribute('aria-label'), `${z.specimen.id}/${z.id}`).toBeTruthy()
      for (const knopf of d.querySelectorAll('button')) {
        expect(['button', 'submit'], `${z.specimen.id}/${z.id}: Knopf ohne type`).toContain(knopf.getAttribute('type'))
        expect(knopf.textContent.trim() || knopf.getAttribute('aria-label'), `${z.specimen.id}/${z.id}: Knopf ohne Namen`).toBeTruthy()
      }
    }
  })

  it('Split-Modus: zweites Thema bekommt eigene ids', () => {
    for (const z of zellen()) {
      const d = dom(z.html + fuerWeiteresThema(z.html, '-t2'))
      const ids = [...d.querySelectorAll('[id]')].map((e) => e.id)
      expect(new Set(ids).size).toBe(ids.length)
    }
  })
})

describe('navigation-tab-mega: Markup je Specimen', () => {
  it('Grundgeruest wie neo-nav.html.twig + neo-nav.js', () => {
    for (const d of alle()) {
      const kopf = d.querySelector('header.site-header[data-neo-nav]')
      expect(kopf.querySelector(':scope > .container.header-inner > a.brand[rel="home"]')).not.toBeNull()
      expect(kopf.querySelector(':scope > .container.header-inner > nav.primary-nav[aria-label="Hauptnavigation"] > ul.nav-list')).not.toBeNull()
      expect(kopf.querySelectorAll('.nav-list > li > button.nav-btn[aria-haspopup="true"][aria-controls]').length).toBe(4)
      expect(kopf.querySelectorAll('.nav-list > li > a.nav-link').length).toBe(1)
      for (const b of kopf.querySelectorAll('.nav-btn')) {
        expect(b.querySelector(':scope > .nav-btn__label[data-text] > span').textContent).toBe(b.querySelector('.nav-btn__label').dataset.text)
        expect(b.querySelector(':scope > .nav-btn__pm[aria-hidden="true"] > .pm-plus + .pm-minus')).not.toBeNull()
      }
      expect(kopf.querySelector('.header-actions > .hdr-group[role="group"] > .hdr-menu[data-hdr-menu] > button.hdr-btn')).not.toBeNull()
      expect(kopf.querySelectorAll('.hdr-group > .hdr-menu').length).toBe(2)
      expect(kopf.querySelector('.hdr-group > button.hdr-btn.hdr-btn--icon.search-toggle[aria-controls]')).not.toBeNull()
      expect(kopf.querySelector('.header-actions > button.icon-btn.burger[aria-controls]')).not.toBeNull()
      // Panels haengen in #panelHost, das Such-Band direkt im Header
      expect(kopf.querySelectorAll(':scope > div[id$="panelHost"] > .panel[role="region"][data-panel]').length).toBe(4)
      expect(kopf.querySelector(':scope > .search-band[role="region"] > .container > form.search-form[role="search"]')).not.toBeNull()
      // Drawer ist Geschwister des Headers, kein Nachfahre
      expect(kopf.querySelector('.m-drawer')).toBeNull()
      expect(kopf.nextElementSibling.matches('.m-drawer')).toBe(true)
      expect(d.querySelector('.m-drawer > .m-viewport > .m-screen[data-screen="root"]')).not.toBeNull()
    }
  })

  it('desktop-geschlossen: alles zu; aktiv = aktueller Ast; verborgen = .is-nav-hidden', () => {
    const [standard, aktiv, verborgen] = alle('desktop-geschlossen')
    for (const d of [standard, aktiv, verborgen]) {
      expect(d.querySelector(':scope > .ra-kopf:not(.ra-kopf--offen) > header')).not.toBeNull()
      expect(offenesPanel(d).length).toBe(0)
      expect(d.querySelector('[aria-expanded="true"], .is-open')).toBeNull()
      expect(d.querySelectorAll('.hdr-pop:not([hidden]), .search-band:not([hidden])').length).toBe(0)
    }
    expect(standard.querySelector('[aria-current], .is-active:not(.m-screen)')).toBeNull()
    const ast = aktiv.querySelector('.nav-btn[aria-current="true"].is-active')
    expect(ast.textContent).toContain('Lösungen')
    expect(aktiv.querySelectorAll('[aria-current]').length).toBe(1)
    expect(verborgen.querySelector('header.site-header').classList.contains('is-nav-hidden')).toBe(true)
    expect(standard.querySelector('header.site-header').classList.contains('is-nav-hidden')).toBe(false)
  })

  it('panel-offen: Mega-Panel (Loesungen) und Dropdown (Produkte), je mit und ohne Teaser', () => {
    const [megaMit, megaOhne, dropMit, dropOhne] = alle('panel-offen')
    for (const d of [megaMit, megaOhne, dropMit, dropOhne]) {
      expect(d.querySelector(':scope > .ra-kopf.ra-kopf--offen')).not.toBeNull()
      const offen = offenesPanel(d)
      expect(offen.length).toBe(1)
      expect(offen[0].classList.contains('is-open')).toBe(true)
      const knopf = d.querySelector(`[aria-controls="${offen[0].id}"]`)
      expect(knopf.getAttribute('aria-expanded')).toBe('true')
      expect(d.querySelectorAll('.nav-btn[aria-expanded="true"]').length).toBe(1)
      expect(offen[0].querySelector(':scope > .container > .panel-inner')).not.toBeNull()
    }
    // Mega
    for (const d of [megaMit, megaOhne]) {
      const p = offenesPanel(d)[0]
      expect(p.getAttribute('aria-label')).toBe('Lösungen')
      const cat = p.querySelector('.mega-grid > .mega-cat')
      expect(cat.querySelector(':scope > p.mega-cat__eyebrow + .tablist[role="tablist"][aria-orientation="vertical"]')).not.toBeNull()
      const tabs = [...cat.querySelectorAll('.tablist > button.tab[role="tab"]')]
      expect(tabs.map((t) => t.getAttribute('aria-selected'))).toEqual(['true', 'false'])
      expect(tabs.map((t) => t.getAttribute('tabindex'))).toEqual(['0', '-1'])
      expect(tabs.map((t) => t.querySelector('.tab__count').textContent)).toEqual(['(6)', '(5)'])
      const tabpanels = [...p.querySelectorAll('.tabpanel[role="tabpanel"]')]
      expect(tabpanels.map((t) => t.hidden)).toEqual([false, true])
      for (const [i, t] of tabpanels.entries()) {
        expect(t.getAttribute('aria-labelledby')).toBe(tabs[i].id)
        expect(tabs[i].getAttribute('aria-controls')).toBe(t.id)
      }
      expect(tabpanels[0].querySelectorAll('ul.link-grid > li > a[href]').length).toBe(6)
      expect(p.querySelector('.mega-grid > div:not([class]) > a.panel-overview[href="/loesungen"] > .nav-arrow[aria-hidden="true"] > svg')).not.toBeNull()
    }
    expect(offenesPanel(megaMit)[0].querySelector('.mega-grid:not(.mega-grid--no-teaser) > aside.teaser.teaser--cta-dark > .teaser__title + .teaser__text + a.teaser__cta')).not.toBeNull()
    expect(offenesPanel(megaOhne)[0].querySelector('.mega-grid.mega-grid--no-teaser')).not.toBeNull()
    expect(offenesPanel(megaOhne)[0].querySelector('.teaser')).toBeNull()
    // Dropdown
    for (const d of [dropMit, dropOhne]) {
      const p = offenesPanel(d)[0]
      expect(p.getAttribute('aria-label')).toBe('Produkte')
      expect(p.querySelectorAll('ul.dropdown-cols > li > a[href]').length).toBe(7)
      expect(p.querySelector('a.panel-overview[href="/produkte"]')).not.toBeNull()
    }
    expect(offenesPanel(dropMit)[0].querySelector('.panel-inner > .dropdown-grid > div > ul.dropdown-cols')).not.toBeNull()
    expect(offenesPanel(dropMit)[0].querySelector('.dropdown-grid > aside.teaser')).not.toBeNull()
    expect(offenesPanel(dropOhne)[0].querySelector('.panel-inner > ul.dropdown-cols')).not.toBeNull()
    expect(offenesPanel(dropOhne)[0].querySelector('.dropdown-grid, .teaser')).toBeNull()
    // Punkte ohne eigene Seite (<nolink>) haben keinen Uebersichtslink
    for (const name of ['Unternehmen', 'Inside']) {
      const p = megaMit.querySelector(`.panel[aria-label="${name}"]`)
      expect(p.hidden).toBe(true)
      expect(p.querySelector('.panel-overview')).toBeNull()
    }
  })

  it('kopfleiste-offen: Such-Band, Sprachmenue, Erscheinungsbild-Menue', () => {
    const [suche, sprache, ansicht] = alle('kopfleiste-offen')
    const band = suche.querySelector('.search-band.is-open:not([hidden])')
    expect(band).not.toBeNull()
    expect(suche.querySelector(`[aria-controls="${band.id}"]`).getAttribute('aria-expanded')).toBe('true')
    const box = band.querySelector('form.search-form > .searchbox')
    expect(box.querySelector(':scope > svg.searchbox__icon[aria-hidden="true"] + label.visually-hidden + input.search-input[type="search"]')).not.toBeNull()
    expect(box.querySelector(':scope > button.search-clear[hidden][aria-label="Eingabe löschen"]')).not.toBeNull()
    expect(box.querySelector(':scope > button.search-submit[type="submit"]')).not.toBeNull()
    expect(band.querySelector('form.search-form > button.search-close > kbd.nc-kbd').textContent).toBe('Esc')
    expect(offenesPanel(suche).length).toBe(0)
    expect(suche.querySelectorAll('.hdr-pop:not([hidden])').length).toBe(0)

    const pop = (d) => [...d.querySelectorAll('.hdr-pop:not([hidden])')]
    for (const [d, titel] of [[sprache, 'Sprache'], [ansicht, 'Erscheinungsbild']]) {
      const [p] = pop(d)
      expect(pop(d).length).toBe(1)
      expect(d.querySelector(`[aria-controls="${p.id}"]`).getAttribute('aria-expanded')).toBe('true')
      expect(p.querySelector('.hdr-pop__title').textContent).toBe(titel)
      expect(p.querySelector('ul.hdr-pop__list[role="menu"]').getAttribute('aria-labelledby')).toBe(p.querySelector('.hdr-pop__title').id)
      const opts = [...p.querySelectorAll('li[role="none"] > button.hdr-opt[role="menuitemradio"]')]
      expect(opts.filter((o) => o.getAttribute('aria-checked') === 'true').length).toBe(1)
      for (const o of opts) expect(o.querySelector('.hdr-opt__label + * , .hdr-opt__check[aria-hidden="true"]')).not.toBeNull()
      expect(d.querySelector('.search-band').hidden).toBe(true)
    }
    expect([...pop(sprache)[0].querySelectorAll('.hdr-opt__code')].map((c) => c.textContent)).toEqual(['DE', 'EN'])
    expect(pop(ansicht)[0].querySelector('li.hdr-pop__sep > .hdr-opt[data-theme-value="system"]')).not.toBeNull()
  })

  it('teaser-flaechen und teaser-knopf: Modifier am Kind aside.teaser, nicht an der Wurzel', () => {
    const teaser = (d) => offenesPanel(d)[0].querySelector('aside.teaser')
    const flaechen = alle('teaser-flaechen').map((d) => [...teaser(d).classList].filter((k) => k.startsWith('teaser--bg-')))
    expect(flaechen).toEqual([[], ['teaser--bg-g50'], ['teaser--bg-g200'], ['teaser--bg-g900'], ['teaser--bg-g950'], ['teaser--bg-accent']])
    for (const d of alle('teaser-flaechen')) expect(teaser(d).classList.contains('teaser--cta-dark')).toBe(true)
    const knoepfe = alle('teaser-knopf').map((d) => teaser(d).className)
    expect(knoepfe).toEqual(['teaser teaser--cta-dark teaser--bg-g950', 'teaser teaser--cta-light teaser--bg-g950'])
    for (const d of [...alle('teaser-flaechen'), ...alle('teaser-knopf')]) {
      expect(d.querySelector('header.site-header').className).toBe('site-header')
      expect(d.querySelectorAll('.teaser').length).toBe(2)
    }
  })

  it('mobil: Drawer zu, Startbildschirm, Unterseite (Push-Navigation)', () => {
    const [zu, start, unten] = alle('mobil')
    for (const d of [zu, start, unten]) expect(d.querySelector(':scope > .ra-nav-mobil > header.site-header + .m-drawer')).not.toBeNull()
    const burger = (d) => d.querySelector('.burger')
    expect(zu.querySelector('.m-drawer').classList.contains('is-open')).toBe(false)
    expect(burger(zu).getAttribute('aria-expanded')).toBe('false')
    expect(burger(zu).getAttribute('aria-label')).toBe('Menü öffnen')
    for (const d of [start, unten]) {
      expect(d.querySelector('.m-drawer').classList.contains('is-open')).toBe(true)
      expect(burger(d).getAttribute('aria-expanded')).toBe('true')
      expect(burger(d).getAttribute('aria-label')).toBe('Menü schließen')
    }
    const root = start.querySelector('.m-screen[data-screen="root"]')
    expect(root.classList.contains('is-active')).toBe(true)
    expect(root.querySelectorAll(':scope > button.m-row > .chev[aria-hidden="true"]').length).toBe(4)
    expect(root.querySelectorAll(':scope > a.m-row[href]').length).toBe(1)
    expect(root.querySelector(':scope > .m-tools > form.m-search[role="search"] > label.visually-hidden + input[type="search"]')).not.toBeNull()
    expect(root.querySelector('.m-tools > .lang-switch.m-lang[role="group"] > button[aria-pressed="true"]').textContent).toBe('DE')
    expect(root.querySelector('.m-tools > a.m-cta[href="/kontakt"]').textContent).toBe('Kontakt')
    expect(start.querySelectorAll('.m-screen.is-active').length).toBe(1)

    expect(unten.querySelector('.m-screen[data-screen="root"]').classList.contains('is-prev')).toBe(true)
    const sub = unten.querySelector('.m-screen.is-active')
    expect(sub.dataset.screen).toBe('nav-loesungen')
    expect(sub.querySelector(':scope > button.m-back + .m-heading').textContent).toBe('Lösungen')
    expect([...sub.querySelectorAll('.m-section-title')].map((t) => t.textContent)).toEqual(['Branchen', 'Anwendungsfälle'])
    expect(sub.querySelector(':scope > a.m-link[href="/loesungen"] > .nav-arrow')).not.toBeNull()
    expect(unten.querySelector('.m-screen[data-screen="nav-unternehmen"] a.m-link .nav-arrow')).toBeNull()
  })

  it('data/markup: Fassungen aus der Vorlage, ids wie auf der Website', () => {
    const html = readFileSync(resolve(WURZEL, 'data/markup/navigation-tab-mega.html'), 'utf8')
    const fassungen = [...html.matchAll(/<!--\s*@fassung:\s*(.+?)\s*-->/g)].map((m) => m[1])
    expect(fassungen).toEqual(['Desktop — geschlossen', 'Desktop — Mega-Panel offen (Lösungen)', 'Desktop — Dropdown offen (Produkte)', 'Desktop — Suche offen', 'Mobil — Drawer offen'])
    const d = dom(html.split(/<!--\s*@fassung:[^>]*-->/)[2])
    for (const id of ['siteHeader', 'navList', 'panelHost', 'searchBand', 'searchInput', 'burger', 'mDrawer', 'mViewport', 'trigger-nav-loesungen', 'panel-nav-loesungen', 'tab-nav-loesungen-tab-branchen', 'tabpanel-nav-loesungen-tab-branchen']) {
      expect(d.querySelector(`#${id}`), id).not.toBeNull()
    }
    expect(d.querySelector('[class*="ra-"]')).toBeNull()
  })
})

describe('navigation-tab-mega in der RecipeArena', () => {
  beforeEach(() => setActivePinia(createPinia()))
  afterEach(() => { document.body.innerHTML = '' })

  it('dunkle Zellen: die geteilten --nc-nav-*-Tokens werden neu gebunden, Store-Werte gewinnen', () => {
    const style = (decl) => Object.assign(Object.keys(decl), { getPropertyValue: (n) => decl[n] })
    const sheets = [{ cssRules: [{ selectorText: ':root', style: style({ '--nc-nav-bg': 'var(--fnd-color-background-base)', '--nc-navigation-menu-bg': 'x' }) }] }]
    const store = useThemeStore()
    const vars = vorschauVariablen({ id: ID, modus: 'dark', state: store.state, sheets })
    expect(vars['--nc-nav-bg']).toBe('var(--fnd-color-background-base)')
    expect(vars['--nc-navigation-menu-bg']).toBeUndefined()
    store.state.componentOverrides[store.state.activeThemeSet || 'neo']['nc-nav-bg'] = '#123456'
    expect(vorschauVariablen({ id: ID, modus: 'dark', state: store.state, sheets })['--nc-nav-bg']).toBe('#123456')
    expect(rohesRecipe(ID).komposition).toContainEqual(expect.objectContaining({ art: 'teilt', recipe: 'navigation', tokenPraefix: 'nc-nav-' }))
  })

  it('Verhalten: in neo-behaviors, alle Specimens, Umschalter; Ausprobieren startet zu und oeffnet per Klick', async () => {
    expect(MIT_VERHALTEN.includes(ID)).toBe(true)
    expect(Object.keys(rohesRecipe(ID).events)).toContain('navigation-tab-mega-panel')
    const w = mount(RecipeArena, { props: { componentId: ID }, attachTo: document.body })
    for (const bis = Date.now() + 8000; !w.find('.ra-specimen').exists() && Date.now() < bis;) {
      await flushPromises()
      await new Promise((r) => setTimeout(r, 10))
    }
    const recipe = normalisiereRecipe(rohesRecipe(ID))
    expect(w.findAll('.ra-specimen').length).toBe(recipe.specimens.length)
    expect(w.findAll('.ra-cell').length).toBe(21)
    expect(w.find('.ra-modus').exists()).toBe(true)
    expect(w.find('[data-quelle="heuristik"], .ra-fallback').exists()).toBe(false)
    expect(w.findAll('header.site-header[data-neo-nav]').length).toBe(21)
    expect(w.find('[data-neo-behavior]').exists()).toBe(false)
    await w.findAll('.ra-modus__knopf')[1].trigger('click')
    await flushPromises()
    await new Promise((r) => setTimeout(r, 0))
    expect(w.findAll('.ra-cell').length).toBe(recipe.specimens.length)
    const kopf = w.find('.ra-specimen[data-specimen-id="panel-offen"] header.site-header')
    expect(kopf.attributes('data-neo-behavior')).toContain(ID)
    expect(kopf.find('.panel.is-open').exists()).toBe(false)
    await kopf.find('.nav-btn').trigger('click')
    expect(kopf.find('.nav-btn').attributes('aria-expanded')).toBe('true')
    expect(kopf.find('.panel.is-open').exists()).toBe(true)
    w.unmount()
  })
})
