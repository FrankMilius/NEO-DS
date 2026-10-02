/**
 * Plan v3, Phase 3 (Block Overlays): Dropdown-Menue, Popover, Tooltip, Modal,
 * Drawer und Alert-Dialog kommen aus dem Recipe (Vorlagen in
 * src/arena-templates) statt aus handgeschriebenen Vue-Arenen. Geprueft wird:
 *   - keine Sonderfall-Arena, jede Zelle jedes Specimens aus der Vorlage
 *   - echtes DS-Markup: Basisklasse, nur Klassen aus styles.css (oder
 *     Struktur-Haken der Recipe-Anatomie), keine Inline-Gestaltung
 *   - „Zustände": Overlays offen und in der Zelle (Panel ohne [hidden],
 *     aria-expanded="true", Dialoge mit [open] im Arena-Rahmen ra-buehne)
 *   - „Ausprobieren": geschlossen, neo-behaviors oeffnet per Klick und Taste,
 *     Escape schliesst, Fokus kehrt zurueck — auf dem Arena-Markup und in der
 *     gemounteten RecipeArena
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { mount, flushPromises } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import { anbinden, MIT_VERHALTEN } from 'neo-behaviors'
import RecipeArena from '../../src/components/laboratory/RecipeArena.vue'
import { vorlageFuer } from '../../src/arena-templates/index.js'
import { normalisiereRecipe, specimenAnsicht } from '../../src/lib/recipe-arena.js'
import { hasArena, arenaQuelle } from '../../src/composables/useArenaResolver.js'
import { RECIPE_IDS, WURZEL, rohesRecipe } from './_recipes.js'
import { buehne, taste } from '../behaviors/_helfer.js'

const BLOCK = ['dropdown-menu', 'popover', 'tooltip', 'modal', 'drawer', 'alert-dialog']
const DIALOGE = ['modal', 'drawer', 'alert-dialog']

function zellen (id, specimenId, optionen) {
  const recipe = normalisiereRecipe(rohesRecipe(id))
  return recipe.specimens
    .filter((sp) => !specimenId || sp.id === specimenId)
    .flatMap((sp) => specimenAnsicht(sp, recipe, id, vorlageFuer(id), optionen).zeilen
      .flatMap((z) => z.zellen.map((c) => ({ ...c, specimen: sp }))))
}

function dom (html) {
  const d = document.createElement('div')
  d.innerHTML = html
  return d
}

const alle = (id, sp) => zellen(id, sp).map((z) => dom(z.html))
/** Erste Zelle je Specimen im Modus Ausprobieren — wie die RecipeArena sie zeigt. */
const lebendig = (id, sp) => {
  const recipe = normalisiereRecipe(rohesRecipe(id))
  const s = recipe.specimens.find((x) => x.id === sp)
  return specimenAnsicht(s, recipe, id, vorlageFuer(id), { ausprobieren: true }).zeilen[0].zellen[0].html
}

const STYLES = resolve(WURZEL, 'styles.css')
function dsKlassen () {
  if (!existsSync(STYLES)) throw new Error('styles.css fehlt — im Wurzelordner `npm run build:css` ausfuehren')
  const css = readFileSync(STYLES, 'utf8')
  return new Set([...css.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)].map((m) => m[1]))
}

/** Klassen aus der Recipe-Anatomie (auch ohne eigene Regel im CSS, z. B. __trigger als Haken fuer das Verhalten). */
function anatomieKlassen (id) {
  const r = rohesRecipe(id)
  const sel = [r.anatomy?.root?.element, ...(r.anatomy?.slots || []).map((s) => s.element)].filter(Boolean)
  return new Set(sel.flatMap((s) => [...String(s).matchAll(/\.([\w-]+)/g)].map((m) => m[1])))
}

const WURZELN = Object.fromEntries(RECIPE_IDS.map((id) => {
  const el = rohesRecipe(id).anatomy?.root?.element || ''
  const m = /^\.([a-z0-9-]+)$/.exec(String(el).trim())
  return [id, m ? m[1] : null]
}).filter(([, k]) => k))

/** komposition (enthaelt) eines Recipes, transitiv. */
function enthaelt (id, gesehen = new Set()) {
  for (const k of rohesRecipe(id).komposition || []) {
    if (k.art !== 'enthaelt' || gesehen.has(k.recipe)) continue
    gesehen.add(k.recipe)
    enthaelt(k.recipe, gesehen)
  }
  return gesehen
}

// Andere Bauteile, die weder komposition noch composes nennt — begruendet.
const ERLAUBT = {
  'dropdown-menu': { button: 'Ausloeser ist ein nc-button (Recipe-domNotes: Styling vom nutzenden Button), Knopf im __footer' },
  tooltip: { button: 'Ausloeser (data/markup/tooltip.html: Knopf in der Tooltip-Huelle)' },
  modal: { button: 'Aktionen im __footer, Ausloeser in Ausprobieren' },
  drawer: { button: 'Aktionen im __footer', 'form-field': 'Filterformular (with-form)', input: 'Filterformular (with-form)', 'form-label': 'Filterformular (with-form)' },
  'alert-dialog': { button: 'Abbrechen und Aktion im __footer' }
}

describe('Overlay-Block aus dem Recipe', () => {
  const bekannt = dsKlassen()

  for (const id of BLOCK) {
    describe(id, () => {
      it('keine Sonderfall-Arena, jede Zelle jedes Specimens aus der Vorlage', () => {
        expect(hasArena(id)).toBe(false)
        expect(arenaQuelle(id)).toBe('recipe')
        expect(vorlageFuer(id)).toBeTypeOf('function')
        for (const optionen of [{}, { ausprobieren: true }]) {
          const z = zellen(id, null, optionen)
          expect(new Set(z.map((c) => c.quelle))).toEqual(new Set(['vorlage']))
          const recipe = normalisiereRecipe(rohesRecipe(id))
          expect(new Set(z.map((c) => c.specimen.id))).toEqual(new Set(recipe.specimens.map((s) => s.id)))
        }
      })

      it('echtes DS-Element mit Basisklasse, nur Klassen aus styles.css bzw. der Anatomie', () => {
        const anatomie = anatomieKlassen(id)
        for (const z of zellen(id)) {
          const d = dom(z.html)
          expect(d.querySelector(`.${WURZELN[id]}`), `${z.specimen.id}/${z.id}`).not.toBeNull()
          for (const el of d.querySelectorAll('[class]')) {
            for (const k of el.classList) {
              if (/^(nc|fnd|u|o)-/.test(k)) expect(bekannt.has(k) || anatomie.has(k), `${id}: Klasse ${k} fehlt in styles.css`).toBe(true)
              if (/^ra-/.test(k)) expect(el.className, `${id}: Arena-Klasse ${k} an einem DS-Element`).not.toMatch(/(^|\s)(nc|fnd)-/)
            }
          }
        }
      })

      it('keine Inline-Gestaltung, keine fremden Zustandsklassen', () => {
        for (const z of [...zellen(id), ...zellen(id, null, { ausprobieren: true })]) {
          const d = dom(z.html)
          expect(d.querySelector('[style]'), `${id}/${z.specimen.id}`).toBeNull()
          // .is-open kennt das DS an Popover und Tooltip (fester offener Zustand, 02.10.2026)
          const fremd = [...d.querySelectorAll('.is-active, .is-open, .is-selected, .is-disabled')]
            .filter((el) => !el.matches('.nc-popover.is-open, .nc-tooltip.is-open'))
          expect(fremd, `${id}/${z.specimen.id}`).toEqual([])
          expect(d.querySelector(`.${WURZELN[id]}--disabled, [data-state]`), `${id}/${z.specimen.id}`).toBeNull()
        }
      })

      it('andere Bauteile sind erklaert (komposition, composes oder begruendet)', () => {
        const erklaert = enthaelt(id)
        for (const z of zellen(id)) {
          const klassen = new Set([...dom(z.html).querySelectorAll('[class]')].flatMap((el) => [...el.classList]))
          const composes = new Set((z.specimen.composes || []).flatMap((c) => (WURZELN[c] ? [c, ...enthaelt(c)] : [])))
          for (const [anderes, k] of Object.entries(WURZELN)) {
            if (anderes === id || !klassen.has(k)) continue
            const ok = erklaert.has(anderes) || composes.has(anderes) || ERLAUBT[id]?.[anderes]
            expect(ok, `${id}/${z.specimen.id} enthaelt ${anderes}`).toBeTruthy()
          }
        }
      })

      it('ids sind je Zelle eindeutig, Bezuege zeigen auf vorhandene Elemente', () => {
        for (const z of zellen(id)) {
          const d = dom(z.html)
          const ids = [...d.querySelectorAll('[id]')].map((e) => e.id)
          expect(new Set(ids).size, `${id}/${z.specimen.id}`).toBe(ids.length)
          for (const el of d.querySelectorAll('[aria-labelledby], [aria-describedby], [aria-controls]')) {
            for (const a of ['aria-labelledby', 'aria-describedby', 'aria-controls']) {
              for (const ref of (el.getAttribute(a) || '').split(/\s+/).filter(Boolean)) {
                expect(d.querySelector(`#${ref}`), `${id}/${z.specimen.id}: ${a}="${ref}"`).not.toBeNull()
              }
            }
          }
        }
      })
    })
  }

  it('fester offener Zustand: styles.css kennt .is-open an Popover und Tooltip, [hidden] hat Vorrang', () => {
    const css = readFileSync(STYLES, 'utf8')
    expect(css).toContain('.nc-popover.is-open>.nc-popover__panel:not([hidden])')
    expect(css).toMatch(/\.nc-tooltip\.is-open>\.nc-tooltip__content\{[^}]*opacity:1[^}]*visibility:visible/)
    expect(css).not.toContain('ra-anker--offen')
  })

  it('Kennzahl: alle sechs ohne Sonderfall', () => {
    expect(BLOCK.filter((id) => hasArena(id))).toEqual([])
  })

  it('Ausprobieren fuer alle sechs (alert-dialog seit 02.10.2026)', () => {
    expect(BLOCK.filter((id) => MIT_VERHALTEN.includes(id))).toEqual(BLOCK)
  })
})

describe('Overlay-Block: Zustände (offen, in der Zelle)', () => {
  it('dropdown-menu: Menue offen, Lage am Menue, Zustand am ersten Eintrag', () => {
    for (const d of alle('dropdown-menu')) {
      const ausloeser = d.querySelector('.nc-dropdown > button.nc-button.nc-dropdown__trigger[aria-haspopup="true"]')
      const menue = d.querySelector('.nc-dropdown > .nc-dropdown__menu[role="menu"]')
      expect(ausloeser.getAttribute('aria-expanded')).toBe('true')
      expect(menue.hidden).toBe(false)
      expect(ausloeser.getAttribute('aria-controls')).toBe(menue.id)
      expect(d.querySelector('.nc-dropdown').className).not.toMatch(/__menu--/)
      expect(d.querySelector('.nc-dropdown').closest('.ra-anker')).not.toBeNull()
    }
    const lagen = alle('dropdown-menu', 'placement-variants').map((d) => [...d.querySelector('.nc-dropdown__menu').classList].find((k) => k.includes('--')))
    expect(lagen).toEqual(['nc-dropdown__menu--bottom-start', 'nc-dropdown__menu--bottom-end', 'nc-dropdown__menu--top-start', 'nc-dropdown__menu--top-end'])
    const [, hover, , fokus, aus] = alle('dropdown-menu', 'all-states')
    const erster = (d) => d.querySelector('.nc-dropdown__item')
    expect(erster(hover).dataset.zustand).toBe('hover')
    expect(erster(fokus).dataset.zustand).toBe('focus')
    expect(erster(aus).getAttribute('aria-disabled')).toBe('true')
  })

  it('dropdown-menu: Inhalte, Auswahl, Untermenue, Fuss, Gefahr', () => {
    const inhalt = alle('dropdown-menu', 'content-variants')
    expect(inhalt[1].querySelectorAll('.nc-dropdown__item-icon svg').length).toBe(4)
    expect(inhalt[2].querySelectorAll('.nc-dropdown__group[role="group"] > .nc-dropdown__group-label').length).toBe(2)
    expect(inhalt[2].querySelector('.nc-dropdown__separator')).not.toBeNull()
    expect(inhalt[3].querySelectorAll('.nc-dropdown__item-shortcut').length).toBe(4)
    expect(inhalt[5].querySelector('.nc-dropdown__menu > .nc-dropdown__footer')).not.toBeNull()
    const [einzelLeer, einzel] = alle('dropdown-menu', 'checkable-single')
    expect(einzel.querySelector('.nc-dropdown--checkable')).not.toBeNull()
    expect(einzelLeer.querySelectorAll('[aria-checked="true"]').length).toBe(0)
    const gewaehlt = einzel.querySelectorAll('[role="menuitemradio"][aria-checked="true"]')
    expect(gewaehlt.length).toBe(1)
    expect(gewaehlt[0].classList.contains('nc-dropdown__item--checked')).toBe(true)
    expect(gewaehlt[0].querySelector('.nc-dropdown__item-check svg')).not.toBeNull()
    const [, mehrfach] = alle('dropdown-menu', 'checkable-multiple')
    expect(mehrfach.querySelectorAll('[role="menuitemcheckbox"][aria-checked="true"]').length).toBe(2)
    const unter = alle('dropdown-menu', 'with-submenu')[0].querySelector('.nc-dropdown__item--has-submenu[aria-haspopup="menu"]')
    expect(unter.getAttribute('aria-expanded')).toBe('true')
    expect(unter.querySelector(':scope > .nc-dropdown__menu[role="menu"]').hidden).toBe(false)
    expect(unter.querySelector('.nc-dropdown__submenu-indicator')).not.toBeNull()
    const [, gefahrHover] = alle('dropdown-menu', 'danger-item')
    expect(gefahrHover.querySelector('.nc-dropdown__item--danger').dataset.zustand).toBe('hover')
    expect(alle('dropdown-menu', 'grouped-with-danger')[0].querySelector('.nc-dropdown__group .nc-dropdown__item--danger')).not.toBeNull()
    expect(alle('dropdown-menu', 'full-featured')[0].querySelectorAll('.nc-dropdown__group [role="menuitemradio"]').length).toBe(3)
  })

  it('popover: Panel offen (.is-open), Lage am Panel, Inhalte nach content, Formular', () => {
    for (const d of alle('popover')) {
      const ausloeser = d.querySelector('.nc-popover > button.nc-popover__trigger[aria-haspopup="dialog"]')
      const panel = d.querySelector('.nc-popover > .nc-popover__panel[role="dialog"]')
      expect(ausloeser.getAttribute('aria-expanded')).toBe('true')
      expect(panel.hidden).toBe(false)
      expect(d.querySelector('.nc-popover').classList.contains('is-open')).toBe(true)
      expect(panel.getAttribute('aria-labelledby') || panel.getAttribute('aria-label')).toBeTruthy()
      expect(d.querySelector('.nc-popover').className).not.toMatch(/__panel--/)
    }
    const lagen = alle('popover', 'placement-variants').map((d) => d.querySelector('.nc-popover__panel').className)
    expect(lagen).toEqual(['nc-popover__panel', 'nc-popover__panel nc-popover__panel--top', 'nc-popover__panel nc-popover__panel--left', 'nc-popover__panel nc-popover__panel--right'])
    const [nurBody, kopf, fuss, voll, pfeil] = alle('popover', 'content-variants')
    expect(nurBody.querySelector('.nc-popover__header, .nc-popover__footer')).toBeNull()
    expect(kopf.querySelector('.nc-popover__header > button.nc-popover__close[aria-label]')).not.toBeNull()
    expect(fuss.querySelector('.nc-popover__footer')).not.toBeNull()
    expect(voll.querySelector('.nc-popover__header + .nc-popover__body + .nc-popover__footer')).not.toBeNull()
    expect(pfeil.querySelector('.nc-popover__panel > .nc-popover__arrow[aria-hidden="true"]:first-child')).not.toBeNull()
    expect(alle('popover', 'alignment-variants').map((d) => d.querySelector('.nc-popover__panel').classList[1])).toEqual(['nc-popover__panel--bottom-start', 'nc-popover__panel--bottom-end'])
    const filter = alle('popover', 'inline-filter')[0]
    expect(filter.querySelectorAll('.nc-popover__body .nc-form-field > input.nc-input').length).toBe(2)
  })

  it('tooltip: sichtbar ueber .is-open (DS), verborgen im Standard, Bezug per aria-describedby', () => {
    for (const z of zellen('tooltip')) {
      const d = dom(z.html)
      const inhalt = d.querySelector('.nc-tooltip > .nc-tooltip__content[role="tooltip"]')
      expect(d.querySelector(`[aria-describedby="${inhalt.id}"]`)).not.toBeNull()
      expect(!!d.querySelector('.nc-tooltip.is-open'), `${z.specimen.id}/${z.id}`).toBe(z.specimen.id !== 'default-hidden')
      expect(d.querySelector('.ra-anker--offen')).toBeNull() // keine Arena-Nachbildung mehr
    }
    expect(alle('tooltip', 'all-positions').map((d) => d.querySelector('.nc-tooltip').className)).toEqual(['nc-tooltip is-open', 'nc-tooltip nc-tooltip--bottom is-open', 'nc-tooltip nc-tooltip--left is-open', 'nc-tooltip nc-tooltip--right is-open'])
    for (const d of alle('tooltip', 'with-arrow')) expect(d.querySelector('.nc-tooltip__content > .nc-tooltip__arrow[aria-hidden="true"]')).not.toBeNull()
    expect(alle('tooltip', 'all-positions')[0].querySelector('.nc-tooltip__arrow')).toBeNull()
    const gesperrt = alle('tooltip', 'on-disabled-trigger')[0]
    expect(gesperrt.querySelector('.nc-tooltip > span[tabindex="0"][aria-describedby] > button:disabled')).not.toBeNull()
  })

  for (const id of DIALOGE) {
    it(`${id}: <dialog open> im Arena-Rahmen, beschriftet`, () => {
      for (const d of alle(id)) {
        const dialog = d.querySelector(`dialog.${WURZELN[id]}`)
        expect(dialog.open).toBe(true)
        expect(dialog.parentElement.classList.contains('ra-buehne')).toBe(true)
        expect(dialog.getAttribute('aria-labelledby') || dialog.getAttribute('aria-label')).toBeTruthy()
        // kein autofocus in „Zustände": der offen eingefuegte Dialog nimmt der App sonst den Fokus
        expect(dialog.querySelector('[autofocus]')).toBeNull()
      }
    })
  }

  it('modal: Groessen, Inhalte, scrollbar, Gefahr, Formular, Hintergrund-Klick', () => {
    expect(alle('modal', 'size-variants').map((d) => d.querySelector('dialog').className)).toEqual(['nc-modal nc-modal--sm', 'nc-modal', 'nc-modal nc-modal--lg', 'nc-modal nc-modal--full'])
    const [einfach, kopf, fuss, voll, scroll] = alle('modal', 'content-variants')
    expect(einfach.querySelector('.nc-modal__header, .nc-modal__footer')).toBeNull()
    expect(einfach.querySelector('dialog').getAttribute('aria-label')).toBeTruthy()
    expect(kopf.querySelector('.nc-modal__header > h2.nc-modal__title + button.nc-modal__close')).not.toBeNull()
    expect(fuss.querySelector('.nc-modal__header')).toBeNull()
    expect(fuss.querySelector('.nc-modal__footer [data-action="cancel"]')).not.toBeNull()
    expect(voll.querySelector('.nc-modal__header + .nc-modal__body + .nc-modal__footer')).not.toBeNull()
    expect(scroll.querySelector('dialog.nc-modal--scrollable.is-scrolled-bottom')).not.toBeNull()
    expect(alle('modal', 'scrollable')[0].querySelector('.ra-buehne--begrenzt')).not.toBeNull()
    const gefahr = alle('modal', 'danger-confirmation')[0]
    expect(gefahr.querySelector('dialog.nc-modal--danger.nc-modal--sm .nc-modal__header-icon svg')).not.toBeNull()
    expect(gefahr.querySelector('.nc-modal__footer [data-action="confirm"].nc-button--primary')).not.toBeNull()
    expect(alle('modal', 'with-form')[0].querySelectorAll('.nc-modal__body form.nc-form .nc-form-field input.nc-input').length).toBe(2)
    expect(alle('modal', 'backdrop-close')[0].querySelector('dialog[data-backdrop-close="true"]')).not.toBeNull()
    expect(alle('modal', 'default')[0].querySelector('dialog[data-backdrop-close]')).toBeNull()
  })

  it('modal: Bottom-Sheet per Modifier (layout: sheet) — dieselben Regeln wie die automatische Umschaltung', () => {
    const [sheet] = alle('modal', 'sheet')
    expect(sheet.querySelector('.ra-buehne > dialog.nc-modal.nc-modal--sheet[open]')).not.toBeNull()
    expect(alle('modal', 'mobile-bottom-sheet')[0].querySelector('.nc-modal--sheet')).toBeNull()
    const css = readFileSync(STYLES, 'utf8')
    const regeln = 'inset:auto 0 0 0;margin:0;width:100%;max-width:100%;max-height:var(--mod-dialog-mobile-max-height'
    expect(css).toContain(`.nc-modal--sheet{${regeln}`)
    expect(css).toMatch(new RegExp(`@media\\(max-width: ?\\d+px\\)\\{\\.nc-modal\\{${regeln.replace(/[()|.*+?^$[\]\\]/g, '\\$&')}`))
    expect(css).toContain('@starting-style{.nc-modal--sheet[open]{opacity:0;translate:0 100%}}')
    expect(css).toContain('.nc-modal--sheet:not([open]){translate:0 100%}')
  })

  it('drawer: Richtungen, Griff nur oben/unten, gescrollt, Formular', () => {
    const richtungen = alle('drawer', 'direction-comparison')
    expect(richtungen.map((d) => d.querySelector('dialog').className)).toEqual(['nc-drawer', 'nc-drawer nc-drawer--top', 'nc-drawer nc-drawer--left', 'nc-drawer nc-drawer--right'])
    expect(richtungen.map((d) => !!d.querySelector('.nc-drawer__handle[aria-hidden="true"]'))).toEqual([true, true, false, false])
    for (const d of alle('drawer')) {
      const dialog = d.querySelector('dialog')
      expect(d.querySelector(`#${dialog.getAttribute('aria-describedby')}.nc-drawer__description`)).not.toBeNull()
      expect(dialog.querySelector(':scope > .nc-drawer__header + .nc-drawer__content + .nc-drawer__footer')).not.toBeNull()
      expect(dialog.querySelector(':scope > button.nc-drawer__close[aria-label]')).not.toBeNull()
      expect(d.querySelector('.ra-buehne--drawer')).not.toBeNull()
    }
    const gescrollt = alle('drawer', 'scrolled-content')[0]
    expect(gescrollt.querySelector('dialog.nc-drawer--right.is-scrolled')).not.toBeNull()
    expect(gescrollt.querySelectorAll('.nc-drawer__content p').length).toBeGreaterThan(10)
    expect(alle('drawer', 'with-form')[0].querySelectorAll('.nc-drawer__content .nc-form-field input.nc-input').length).toBe(3)
  })

  it('alert-dialog: role alertdialog, Inhalte, destruktiv', () => {
    for (const d of alle('alert-dialog')) expect(d.querySelector('dialog').getAttribute('role')).toBe('alertdialog')
    const [mitText, nurTitel, mitSymbol] = alle('alert-dialog', 'content-variants')
    expect(mitText.querySelector('.nc-alert-dialog__header > .nc-alert-dialog__description')).not.toBeNull()
    expect(nurTitel.querySelector('.nc-alert-dialog__description')).toBeNull()
    expect(nurTitel.querySelector('dialog').hasAttribute('aria-describedby')).toBe(false)
    expect(mitSymbol.querySelector('dialog > .nc-alert-dialog__icon[aria-hidden="true"] + .nc-alert-dialog__header')).not.toBeNull()
    const [normal, destruktiv] = alle('alert-dialog', 'intent-comparison')
    expect(normal.querySelector('.nc-alert-dialog--destructive')).toBeNull()
    expect(destruktiv.querySelector('dialog.nc-alert-dialog--destructive .nc-alert-dialog__footer [data-action="confirm"]')).not.toBeNull()
    // sichere Aktion fuer das Behavior: Abbrechen mit data-action="cancel"
    for (const d of alle('alert-dialog')) expect(d.querySelector('.nc-alert-dialog__footer > button.nc-button--outline[data-action="cancel"]')).not.toBeNull()
  })
})

describe('Overlay-Block: Ausprobieren (geschlossen, neo-behaviors bedient)', () => {
  afterEach(() => { document.body.innerHTML = '' })
  const aktiv = () => document.activeElement

  it('alle Specimens starten geschlossen', () => {
    for (const id of BLOCK) {
      for (const z of zellen(id, null, { ausprobieren: true })) {
        const d = dom(z.html)
        expect(d.querySelector('[aria-expanded="true"], dialog[open], .is-open, .ra-buehne'), `${id}/${z.specimen.id}`).toBeNull()
        for (const p of d.querySelectorAll('.nc-dropdown__menu, .nc-popover__panel')) {
          if (!p.closest('.nc-popover--hover-trigger')) expect(p.hidden, `${id}/${z.specimen.id}`).toBe(true)
        }
      }
    }
  })

  it('dropdown-menu: Klick oeffnet, Pfeiltaste, Escape schliesst und gibt den Fokus zurueck', () => {
    const b = buehne(lebendig('dropdown-menu', 'all-states'))
    anbinden(b, ['dropdown-menu'])
    const ausloeser = b.querySelector('.nc-dropdown__trigger')
    const menue = b.querySelector('.nc-dropdown__menu')
    ausloeser.click()
    expect(menue.hidden).toBe(false)
    expect(ausloeser.getAttribute('aria-expanded')).toBe('true')
    const eintraege = [...menue.querySelectorAll('.nc-dropdown__item')]
    expect(aktiv()).toBe(eintraege[0])
    taste(eintraege[0], 'ArrowDown')
    expect(aktiv()).toBe(eintraege[1])
    taste(aktiv(), 'Escape')
    expect(menue.hidden).toBe(true)
    expect(aktiv()).toBe(ausloeser)
    taste(ausloeser, 'ArrowUp')
    expect(aktiv()).toBe(eintraege.at(-1))
  })

  it('dropdown-menu: Untermenue per Pfeil rechts, Auswahl per Klick', () => {
    const b = buehne(lebendig('dropdown-menu', 'with-submenu'))
    anbinden(b, ['dropdown-menu'])
    b.querySelector('.nc-dropdown__trigger').click()
    const eltern = b.querySelector('.nc-dropdown__item--has-submenu')
    expect(eltern.querySelector('.nc-dropdown__menu').hidden).toBe(true)
    eltern.focus()
    taste(eltern, 'ArrowRight')
    expect(eltern.querySelector('.nc-dropdown__menu').hidden).toBe(false)
    document.body.innerHTML = ''
    const c = buehne(lebendig('dropdown-menu', 'checkable-single'))
    anbinden(c, ['dropdown-menu'])
    c.querySelector('.nc-dropdown__trigger').click()
    const radios = c.querySelectorAll('[role="menuitemradio"]')
    radios[2].click()
    expect(radios[2].getAttribute('aria-checked')).toBe('true')
    expect(c.querySelector('.nc-dropdown__menu').hidden).toBe(true)
  })

  it('popover: Enter oeffnet, Fokus ins Panel, Escape schliesst, Fokus zurueck', () => {
    const b = buehne(lebendig('popover', 'full-popover'))
    anbinden(b, ['popover'])
    const ausloeser = b.querySelector('.nc-popover__trigger')
    const panel = b.querySelector('.nc-popover__panel')
    ausloeser.focus()
    taste(ausloeser, 'Enter')
    expect(panel.hidden).toBe(false)
    expect(panel.contains(aktiv())).toBe(true)
    taste(aktiv(), 'Escape')
    expect(panel.hidden).toBe(true)
    expect(aktiv()).toBe(ausloeser)
  })

  it('popover: Formular — Fokus aufs erste Feld, Klick ausserhalb schliesst nicht', () => {
    const b = buehne(lebendig('popover', 'inline-filter'))
    anbinden(b, ['popover'])
    b.querySelector('.nc-popover__trigger').click()
    expect(aktiv()).toBe(b.querySelector('.nc-popover__panel input'))
    document.body.click()
    expect(b.querySelector('.nc-popover__panel').hidden).toBe(false)
  })

  it('tooltip: Escape blendet den Tooltip am fokussierten Ausloeser aus', () => {
    const b = buehne(lebendig('tooltip', 'all-positions'))
    anbinden(b, ['tooltip'])
    const knopf = b.querySelector('.nc-tooltip > button')
    const inhalt = b.querySelector('.nc-tooltip__content')
    expect(inhalt.hidden).toBe(false)
    knopf.focus()
    taste(knopf, 'Escape')
    expect(inhalt.hidden).toBe(true)
  })

  for (const id of ['modal', 'drawer']) {
    it(`${id}: Ausloeser oeffnet per showModal, Escape schliesst, Fokus zurueck`, () => {
      const b = buehne(lebendig(id, id === 'modal' ? 'default' : 'side-panel-right'))
      anbinden(b, [id])
      const ausloeser = b.querySelector('button[aria-controls]')
      const dialog = b.querySelector(`dialog.nc-${id}`)
      expect(ausloeser.getAttribute('aria-controls')).toBe(dialog.id)
      expect(dialog.open).toBe(false)
      ausloeser.focus()
      ausloeser.click()
      expect(dialog.open).toBe(true)
      expect(dialog.contains(aktiv())).toBe(true)
      taste(aktiv(), 'Escape')
      expect(dialog.open).toBe(false)
      expect(aktiv()).toBe(ausloeser)
    })
  }

  for (const sp of ['default', 'destructive', 'session-timeout']) {
    it(`alert-dialog (${sp}): Ausloeser oeffnet, Fokus auf Abbrechen, Escape bricht ab, Hintergrund schliesst nicht`, () => {
      const b = buehne(lebendig('alert-dialog', sp))
      anbinden(b, ['alert-dialog'])
      const ausloeser = b.querySelector('button[aria-controls]')
      const dialog = b.querySelector('dialog.nc-alert-dialog')
      expect(ausloeser.getAttribute('aria-controls')).toBe(dialog.id)
      const zu = []
      dialog.addEventListener('alert-dialog-close', (e) => zu.push(e.detail.reason))
      ausloeser.focus()
      ausloeser.click()
      expect(dialog.open).toBe(true)
      expect(aktiv()).toBe(dialog.querySelector('[data-action="cancel"]'))
      dialog.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: 1, clientY: 1 }))
      expect(dialog.open).toBe(true)
      taste(aktiv(), 'Escape')
      expect(dialog.open).toBe(false)
      expect(zu).toEqual(['escape'])
      expect(aktiv()).toBe(ausloeser)
    })
  }

  it('modal: Gefahr — Fokus startet auf Abbrechen (autofocus nur am geschlossenen Dialog)', () => {
    const b = buehne(lebendig('modal', 'danger-confirmation'))
    anbinden(b, ['modal'])
    b.querySelector('button[aria-controls]').click()
    expect(aktiv()).toBe(b.querySelector('.nc-modal__footer [data-action="cancel"]'))
    taste(aktiv(), 'Enter')
    expect(b.querySelector('dialog').open).toBe(false)
  })
})

describe('Overlay-Block: Ausprobieren in der RecipeArena', () => {
  beforeEach(() => setActivePinia(createPinia()))
  afterEach(() => { document.body.innerHTML = '' })

  async function ausprobieren (id) {
    const w = mount(RecipeArena, { props: { componentId: id }, attachTo: document.body })
    for (const bis = Date.now() + 8000; !w.find('.ra-specimen').exists() && Date.now() < bis;) {
      await flushPromises()
      await new Promise((r) => setTimeout(r, 10))
    }
    // Zustände: offen, ohne Verhalten
    expect(w.find('[aria-expanded="true"], dialog[open], .is-open').exists()).toBe(true)
    expect(w.find('[data-neo-behavior]').exists()).toBe(false)
    await w.findAll('.ra-modus__knopf')[1].trigger('click')
    await flushPromises()
    await new Promise((r) => setTimeout(r, 0))
    expect(w.find(`[data-neo-behavior~="${id}"]`).exists()).toBe(true)
    expect(w.findAll('.ra-cell').length).toBe(w.findAll('.ra-specimen').length)
    return w
  }

  it('dropdown-menu: geschlossen, Klick oeffnet', async () => {
    const w = await ausprobieren('dropdown-menu')
    expect(w.find('[aria-expanded="true"]').exists()).toBe(false)
    const zelle = w.find('.ra-specimen[data-specimen-id="all-states"] .ra-cell')
    await zelle.find('.nc-dropdown__trigger').trigger('click')
    expect(zelle.find('.nc-dropdown__menu').element.hidden).toBe(false)
    w.unmount()
  })

  it('popover: geschlossen, Klick oeffnet', async () => {
    const w = await ausprobieren('popover')
    const zelle = w.find('.ra-specimen[data-specimen-id="default"] .ra-cell')
    expect(zelle.find('.nc-popover__panel').element.hidden).toBe(true)
    await zelle.find('.nc-popover__trigger').trigger('click')
    expect(zelle.find('.nc-popover__panel').element.hidden).toBe(false)
    expect(zelle.find('.nc-popover').classes()).toContain('is-open')
    w.unmount()
  })

  it('tooltip: nicht fest sichtbar, Behavior gebunden', async () => {
    const w = await ausprobieren('tooltip')
    expect(w.find('.nc-tooltip.is-open').exists()).toBe(false)
    w.unmount()
  })

  for (const id of ['modal', 'drawer']) {
    it(`${id}: geschlossen, Ausloeser oeffnet den Dialog`, async () => {
      const w = await ausprobieren(id)
      expect(w.find('dialog[open]').exists()).toBe(false)
      const zelle = w.find('.ra-cell')
      await zelle.find('button[aria-controls]').trigger('click')
      expect(zelle.find('dialog').element.open).toBe(true)
      zelle.find('dialog').element.close()
      w.unmount()
    })
  }

  it('alert-dialog: Umschalter da, geschlossen, Ausloeser oeffnet, Fokus auf Abbrechen', async () => {
    const w = await ausprobieren('alert-dialog')
    expect(w.find('dialog[open]').exists()).toBe(false)
    const zelle = w.find('.ra-cell')
    await zelle.find('button[aria-controls]').trigger('click')
    const dialog = zelle.find('dialog').element
    expect(dialog.open).toBe(true)
    expect(document.activeElement).toBe(dialog.querySelector('[data-action="cancel"]'))
    dialog.close()
    w.unmount()
  })
})
