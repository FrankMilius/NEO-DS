/**
 * Plan v3, Phase 3 (Block Rueckmeldung): Toast, Benachrichtigung, Alert und
 * Banner kommen aus dem Recipe (Vorlagen in src/arena-templates) statt aus
 * handgeschriebenen Vue-Arenen. Geprueft wird:
 *   - keine Sonderfall-Arena, jede Zelle jedes Specimens aus der Vorlage;
 *     Recipe, Spec und Registry zeigen auf die RecipeArena
 *   - echtes DS-Markup: Basisklasse, nur Klassen aus styles.css (oder der
 *     Recipe-Anatomie), keine Inline-Gestaltung ausser den Instanzwerten, die
 *     im DS das JS setzt (Balken des Toasts, Wischen)
 *   - Rollen und Namen nach Recipe a11y (status/alert, article, Schliessen-
 *     Knopf mit aria-label), Zustaende je Specimen (ungelesen, Schließt als
 *     Standbild, Wischen, Warteschlange), Toaster und festes Banner im
 *     Arena-Rahmen ra-bildschirm
 *   - „Ausprobieren": neo-behaviors hat fuer alle vier ein Verhalten, die
 *     lebendige Instanz startet im Ruhezustand, „Erneut zeigen" setzt eine
 *     geschlossene Meldung wieder ein — auf dem Arena-Markup und in der
 *     gemounteten RecipeArena
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { mount, flushPromises } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import { anbinden, MIT_VERHALTEN } from 'neo-behaviors'
import RecipeArena from '../../src/components/laboratory/RecipeArena.vue'
import { vorlageFuer, einrichtungFuer } from '../../src/arena-templates/index.js'
import { normalisiereRecipe, specimenAnsicht, fuerWeiteresThema } from '../../src/lib/recipe-arena.js'
import { hasArena, arenaQuelle } from '../../src/composables/useArenaResolver.js'
import { RECIPE_IDS, WURZEL, rohesRecipe } from './_recipes.js'
import { buehne } from '../behaviors/_helfer.js'

const BLOCK = ['toast', 'notification', 'alert', 'banner']

function zellen (id, specimenId, optionen) {
  const recipe = normalisiereRecipe(rohesRecipe(id))
  return recipe.specimens
    .filter((sp) => !specimenId || sp.id === specimenId)
    .flatMap((sp) => specimenAnsicht(sp, recipe, id, vorlageFuer(id), optionen).zeilen
      .flatMap((z) => z.zellen.map((c) => ({ ...c, specimen: sp }))))
}
const beideModi = (id) => [...zellen(id), ...zellen(id, null, { ausprobieren: true })]

function dom (html) {
  const d = document.createElement('div')
  d.innerHTML = html
  return d
}
const alle = (id, sp) => zellen(id, sp).map((z) => dom(z.html))
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
  toast: { button: 'nur Ausprobieren: Knopf „Erneut zeigen" der Arena' },
  notification: { button: 'nur Ausprobieren: Knopf „Erneut zeigen" der Arena' },
  banner: { button: 'nur Ausprobieren: Knopf „Erneut zeigen" der Arena' }
}

/** Inline-Stile, die im DS das JS setzt (Instanzwerte) — sonst keine. */
function erlaubterStil (el) {
  const stil = el.getAttribute('style')
  if (el.matches('.nc-toast__progress')) return /^width: \d+%$/.test(stil)
  if (el.matches('.nc-toast.is-swiping')) return /^--_toast-swipe-x: [\d.]+px; --_toast-swipe-opacity: [\d.]+$/.test(stil)
  return false
}

describe('Rückmeldungs-Block aus dem Recipe', () => {
  const bekannt = dsKlassen()

  for (const id of BLOCK) {
    describe(id, () => {
      it('keine Sonderfall-Arena, jede Zelle jedes Specimens aus der Vorlage (beide Ansichten)', () => {
        expect(hasArena(id)).toBe(false)
        expect(arenaQuelle(id)).toBe('recipe')
        expect(vorlageFuer(id)).toBeTypeOf('function')
        for (const optionen of [{}, { ausprobieren: true }]) {
          const z = zellen(id, null, optionen)
          expect(new Set(z.map((c) => c.quelle))).toEqual(new Set(['vorlage']))
          expect(z.filter((c) => c.fehler)).toEqual([])
          const recipe = normalisiereRecipe(rohesRecipe(id))
          expect(new Set(z.map((c) => c.specimen.id))).toEqual(new Set(recipe.specimens.map((s) => s.id)))
        }
      })

      it('Recipe, Spec und Registry zeigen auf die RecipeArena; die Vue-Arena ist weg', () => {
        const ziel = 'apps/theme-configurator/src/components/laboratory/RecipeArena.vue'
        expect(rohesRecipe(id).meta.pipeline.arena).toBe(ziel)
        const spec = readFileSync(resolve(WURZEL, `specs/${id}.spec.json`), 'utf8')
        expect(spec).toContain(ziel)
        expect(spec).not.toMatch(/laboratory\/(?!Recipe)\w+Arena\.vue/)
        const registry = readFileSync(resolve(WURZEL, 'data/component-registry.json'), 'utf8')
        expect(registry).not.toMatch(/(Toast|Notification|Alert|Banner)Arena\.vue/)
        const name = id[0].toUpperCase() + id.slice(1)
        expect(existsSync(resolve(WURZEL, `apps/theme-configurator/src/components/laboratory/${name}Arena.vue`))).toBe(false)
      })

      it('echtes DS-Element mit Basisklasse, nur Klassen aus styles.css bzw. der Anatomie', () => {
        const anatomie = anatomieKlassen(id)
        for (const z of beideModi(id)) {
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

      it('keine Inline-Gestaltung (ausser Instanzwerten des JS), keine fremden Zustandsklassen', () => {
        for (const z of beideModi(id)) {
          const d = dom(z.html)
          for (const el of d.querySelectorAll('[style]')) expect(erlaubterStil(el), `${id}/${z.specimen.id}: ${el.outerHTML.slice(0, 120)}`).toBe(true)
          expect(d.querySelector('.is-active, .is-open, .is-selected, .is-disabled, [data-state], [data-zustand]'), `${id}/${z.specimen.id}`).toBeNull()
        }
      })

      it('andere Bauteile sind erklaert (komposition, composes oder begruendet)', () => {
        const erklaert = enthaelt(id)
        for (const z of beideModi(id)) {
          const klassen = new Set([...dom(z.html).querySelectorAll('[class]')].flatMap((el) => [...el.classList]))
          const composes = new Set((z.specimen.composes || []).flatMap((c) => (WURZELN[c] ? [c, ...enthaelt(c)] : [])))
          for (const [anderes, k] of Object.entries(WURZELN)) {
            if (anderes === id || !klassen.has(k)) continue
            const ok = erklaert.has(anderes) || composes.has(anderes) || ERLAUBT[id]?.[anderes]
            expect(ok, `${id}/${z.specimen.id} enthaelt ${anderes}`).toBeTruthy()
          }
        }
      })

      it('ids eindeutig (auch im Split-Modus), Schliessen-Knoepfe mit Namen, Symbole aria-hidden', () => {
        for (const z of beideModi(id)) {
          const d = dom(z.html + fuerWeiteresThema(z.html, '-t2'))
          const ids = [...d.querySelectorAll('[id]')].map((e) => e.id)
          expect(new Set(ids).size).toBe(ids.length)
          for (const k of d.querySelectorAll(`.${WURZELN[id]}__close`)) {
            expect(k.tagName).toBe('BUTTON')
            expect(k.getAttribute('type')).toBe('button')
            expect(k.getAttribute('aria-label'), `${id}/${z.specimen.id}`).toBeTruthy()
          }
          for (const s of d.querySelectorAll(`.${WURZELN[id]}__icon`)) expect(s.getAttribute('aria-hidden')).toBe('true')
        }
      })
    })
  }

  const VERSION = { toast: '2.1.0', notification: '2.1.0', alert: '2.1.0', banner: '2.2.0' }
  it('Kennzahl: alle vier ohne Sonderfall, alle vier mit Verhalten (keyboard/events im Recipe)', () => {
    expect(BLOCK.filter((id) => hasArena(id))).toEqual([])
    expect(BLOCK.filter((id) => MIT_VERHALTEN.includes(id))).toEqual(BLOCK)
    for (const id of BLOCK) {
      const r = rohesRecipe(id)
      expect(Object.keys(r.keyboard || {}).length, id).toBeGreaterThan(0)
      expect(Object.keys(r.events || {}).length, id).toBeGreaterThan(0)
      // 2.1.0: Verhalten; 2.2.0: Entscheidungen vom 05.10.2026 (toast, alert, banner)
      expect(r.meta.version, id).toBe(VERSION[id])
    }
  })

  it('styles.css: Toast-Text erbt die Schrift des Toasts, zentrierter Toaster in ganzer Breite, Kopf der Benachrichtigung macht dem X Platz', () => {
    const css = readFileSync(STYLES, 'utf8')
    expect(css).toMatch(/\.nc-toast__title\{font-size:inherit;line-height:inherit;/)
    expect(css).toMatch(/\.nc-toaster--top-center\{top:0;left:0;right:0;align-items:center\}/)
    expect(css).toMatch(/\.nc-toaster--bottom-center\{bottom:0;left:0;right:0;align-items:center;flex-direction:column-reverse\}/)
    expect(css).toContain('.nc-notification:not(.nc-notification--permanent):has(>.nc-notification__close) .nc-notification__header{padding-inline-end:')
    expect(css).toMatch(/\.nc-notification__body\{margin:0;/)
  })
})

describe('Rückmeldungs-Block: Zustände und Inhalte', () => {
  it('toast: Toaster im Arena-Rahmen, Position am Toaster, Rolle nach Severity, Symbol je Severity', () => {
    for (const d of alle('toast')) {
      const toaster = d.querySelector('.ra-bildschirm > .nc-toaster[role="region"][aria-live="polite"][aria-label]')
      expect(toaster).not.toBeNull()
      expect([...toaster.classList].filter((k) => k.startsWith('nc-toaster--'))).toHaveLength(1)
      for (const t of toaster.querySelectorAll(':scope > .nc-toast')) {
        const sev = [...t.classList].find((k) => /^nc-toast--/.test(k)).slice(10)
        expect(t.getAttribute('role'), sev).toBe(sev === 'error' || sev === 'warning' ? 'alert' : 'status')
        expect(t.querySelector(':scope > .nc-toast__icon svg')).not.toBeNull()
        expect(t.querySelector(':scope > .nc-toast__content > p.nc-toast__title')).not.toBeNull()
        expect(t.querySelector(':scope > button.nc-toast__close')).not.toBeNull()
      }
    }
    const sev = alle('toast', 'severity-variants').map((d) => d.querySelector('.nc-toast').className)
    expect(sev).toEqual(['nc-toast nc-toast--default', 'nc-toast nc-toast--success', 'nc-toast nc-toast--warning', 'nc-toast nc-toast--error', 'nc-toast nc-toast--info'])
    const symbole = new Set(alle('toast', 'severity-variants').map((d) => d.querySelector('.nc-toast__icon').innerHTML))
    expect(symbole.size).toBe(5)
    expect(alle('toast', 'error-alert')[0].querySelector('.nc-toaster--top-center > .nc-toast--error[role="alert"]')).not.toBeNull()
    expect(alle('toast', 'error-alert')[0].querySelector('.ra-bildschirm--breit')).not.toBeNull()
  })

  it('toast: Inhalte nach content — Beschreibung, Aktion, Rueckgaengig (data-undo, vor dem X), Balken', () => {
    const [basis, text, aktion, undo, balken] = alle('toast', 'content-variants')
    expect(basis.querySelector('.nc-toast__description, .nc-toast__action, .nc-toast__progress')).toBeNull()
    expect(text.querySelector('.nc-toast__description')).not.toBeNull()
    expect(aktion.querySelector('button.nc-toast__action:not([data-undo]) + .nc-toast__close')).not.toBeNull()
    expect(undo.querySelector('button.nc-toast__action[data-undo] + .nc-toast__close')).not.toBeNull()
    const b = balken.querySelector('.nc-toast > .nc-toast__progress[aria-hidden="true"]:last-child')
    expect(b.getAttribute('style')).toBe('width: 60%')
    // Zustände: kein Auto-Ausblenden
    for (const d of alle('toast')) expect(d.querySelector('[data-duration]')).toBeNull()
  })

  it('toast: Stapel und Warteschlange in EINEM Toaster (eine Zelle), aeltester geht als Standbild', () => {
    const stapel = alle('toast', 'stacked')
    expect(stapel).toHaveLength(1)
    expect([...stapel[0].querySelectorAll('.nc-toaster > .nc-toast')].map((t) => t.classList[1])).toEqual(['nc-toast--success', 'nc-toast--error', 'nc-toast--default'])
    expect(stapel[0].querySelector('.ra-bildschirm--hoch')).not.toBeNull()
    const [schlange] = alle('toast', 'queue-limit')
    const toasts = [...schlange.querySelectorAll('.nc-toaster > .nc-toast')]
    expect(toasts).toHaveLength(4)
    expect(toasts.map((t) => t.classList.contains('is-leaving'))).toEqual([true, false, false, false])
    expect(schlange.querySelector('.ra-bildschirm.ra-standbild')).not.toBeNull()
  })

  it('toast: Wischen mit der DS-Klasse .is-swiping und den Werten des JS (nicht „nur interaktiv")', () => {
    const [z] = zellen('toast', 'swipe-dismiss')
    expect(z.nurInteraktiv).toBe(false)
    const t = dom(z.html).querySelector('.nc-toast.is-swiping')
    expect(t.style.getPropertyValue('--_toast-swipe-x')).toBe('72px')
  })

  it('alert: Rolle nach Variante, Inhalte nach content, Details nativ, Inline-Modifier', () => {
    for (const d of alle('alert')) {
      const a = d.querySelector('.ra-feld--breit > .nc-alert')
      const v = [...a.classList].find((k) => /^nc-alert--(info|success|warning|danger)$/.test(k)).slice(10)
      expect(a.getAttribute('role'), v).toBe(v === 'danger' || v === 'warning' ? 'alert' : 'status')
      expect(a.querySelector(':scope > .nc-alert__icon[aria-hidden="true"] svg + *, :scope > .nc-alert__icon svg')).not.toBeNull()
      expect(a.querySelector(':scope > .nc-alert__content > p.nc-alert__title')).not.toBeNull()
    }
    const [nurTitel, voll, aktion, schliessbar, details] = alle('alert', 'content-compositions')
    expect(nurTitel.querySelector('.nc-alert__description')).toBeNull()
    expect(voll.querySelector('.nc-alert__description + *')).toBeNull()
    expect(aktion.querySelector('.nc-alert__content > .nc-alert__action > button.nc-button.nc-button--sm.nc-button--outline[type="button"]')).not.toBeNull()
    expect(schliessbar.querySelector('.nc-alert > button.nc-alert__close[aria-label="Schließen"]')).not.toBeNull()
    expect(details.querySelector('.nc-alert__content > details.nc-alert__details > summary + p')).not.toBeNull()
    expect(alle('alert', 'dismissible-variants').every((d) => d.querySelector('.nc-alert__close'))).toBe(true)
    expect(alle('alert', 'inline-variants').map((d) => d.querySelector('.nc-alert').classList.contains('nc-alert--inline'))).toEqual([true, true, true, true])
    expect(alle('alert', 'all-variants').some((d) => d.querySelector('.nc-alert__close'))).toBe(false)
  })

  it('banner: Rolle (danger: alert, sonst benannte Region „Hinweis", nie banner), Slots nach content, Stil und Lage als Modifier', () => {
    for (const d of alle('banner')) {
      const b = d.querySelector('.nc-banner')
      const gefahr = b.classList.contains('nc-banner--danger')
      expect(b.getAttribute('role')).toBe(gefahr ? 'alert' : 'region')
      expect(b.getAttribute('aria-label')).toBe(gefahr ? null : 'Hinweis')
      expect(d.querySelector('[role="banner"]')).toBeNull()
      expect(b.querySelector(':scope > .nc-banner__content > span')).not.toBeNull()
    }
    const slots = alle('banner', 'content-variants').map((d) => ['__icon', '__title', '__link', '__close'].filter((s) => d.querySelector(`.nc-banner${s}`)))
    expect(slots).toEqual([[], ['__icon'], ['__title'], ['__link'], ['__close'], ['__icon', '__title', '__link', '__close']])
    expect(alle('banner', 'accent-variants').every((d) => d.querySelector('.nc-banner--accent'))).toBe(true)
    const lagen = alle('banner', 'position-variants')
    expect(lagen.map((d) => d.querySelector('.nc-banner').className)).toEqual(['nc-banner', 'nc-banner nc-banner--sticky', 'nc-banner nc-banner--fixed'])
    // fest und haftend im Rahmen ueber Seiteninhalt, das feste mit Platz
    expect(lagen[0].querySelector('.ra-bildschirm')).toBeNull()
    expect(lagen[1].querySelector('.ra-bildschirm > .nc-banner--sticky + .ra-seitentext')).not.toBeNull()
    expect(lagen[2].querySelector('.ra-bildschirm.ra-bildschirm--fest > .nc-banner--fixed + .ra-seitentext')).not.toBeNull()
    expect(alle('banner', 'danger-alert')[0].querySelector('.ra-bildschirm--fest > .nc-banner--danger.nc-banner--fixed[role="alert"]')).not.toBeNull()
    expect(alle('banner', 'with-cta')[0].querySelector('.nc-banner--sticky a.nc-banner__link')).not.toBeNull()
  })

  it('banner und notification: „Schließt" als Standbild (.is-dismissing im Rahmen ra-standbild)', () => {
    for (const [id, sp] of [['banner', 'dismiss-animation'], ['notification', 'dismiss-animation']]) {
      const [d] = alle(id, sp)
      expect(d.querySelector(`.ra-standbild > .nc-${id}.is-dismissing`), id).not.toBeNull()
    }
    expect(alle('banner', 'dismissible')[0].querySelector('.is-dismissing')).toBeNull()
  })

  it('notification: article mit Namen, Kopf mit Titel und Meta (Kategorie als Text), Schliessen ausser permanent', () => {
    for (const d of alle('notification')) {
      const k = d.querySelector('article.nc-notification')
      expect(k.getAttribute('aria-label')).toMatch(/, /)
      expect(k.querySelector(':scope > .nc-notification__content > .nc-notification__header > .nc-notification__title + .nc-notification__meta')).not.toBeNull()
      expect(k.querySelector(':scope > .nc-notification__content > .nc-notification__body')).not.toBeNull()
      const permanent = k.classList.contains('nc-notification--permanent')
      expect(!!k.querySelector(':scope > button.nc-notification__close[aria-label="Benachrichtigung schließen"]'), d.innerHTML.slice(0, 80)).toBe(!permanent)
    }
    const typen = alle('notification', 'type-variants').map((d) => d.querySelector('.nc-notification__meta').textContent.split(' · ')[0])
    expect(new Set(typen).size).toBe(3)
    expect(alle('notification', 'priority-high').every((d) => d.querySelector('.nc-notification--priority-high'))).toBe(true)
    expect(alle('notification', 'with-media')[0].querySelector('.nc-notification > .nc-notification__media:first-child > img[alt=""]')).not.toBeNull()
    const fuss = alle('notification', 'with-actions')[0].querySelector('.nc-notification__footer')
    expect([...fuss.children].map((e) => e.tagName + '.' + e.className)).toEqual(['A.nc-notification__action', 'BUTTON.nc-notification__action'])
    expect(alle('notification', 'permanent')[0].querySelector('.nc-notification--permanent.nc-notification--system.nc-notification--priority-high')).not.toBeNull()
  })

  it('notification: ungelesen — Modifier, Punkt aria-hidden, Praefix im Namen', () => {
    for (const d of alle('notification', 'unread-state')) {
      const k = d.querySelector('.nc-notification')
      expect(k.classList.contains('nc-notification--unread')).toBe(true)
      expect(k.querySelector('.nc-notification__header > .nc-notification__unread[aria-hidden="true"]')).not.toBeNull()
      expect(k.getAttribute('aria-label')).toMatch(/^Ungelesen: /)
    }
    for (const d of alle('notification', 'basic')) {
      expect(d.querySelector('.nc-notification--unread, .nc-notification__unread')).toBeNull()
      expect(d.querySelector('.nc-notification').getAttribute('aria-label')).not.toMatch(/Ungelesen/)
    }
  })
})

describe('Rückmeldungs-Block: Ausprobieren', () => {
  afterEach(() => { document.body.innerHTML = '' })

  it('lebendige Instanz im Ruhezustand: kein Standbild, kein Wischen, keine festen Balkenwerte', () => {
    for (const id of BLOCK) {
      for (const z of zellen(id, null, { ausprobieren: true })) {
        const d = dom(z.html)
        expect(d.querySelector('.is-dismissing, .is-leaving, .is-swiping, .ra-standbild, [style]'), `${id}/${z.specimen.id}`).toBeNull()
      }
    }
  })

  it('toast: Auto-Ausblenden nur bei Balken (6 s) und Rueckgaengig (10 s), sonst bis zum Schliessen', () => {
    expect(dom(lebendig('toast', 'with-progress')).querySelector('.nc-toast').dataset.duration).toBe('6000')
    expect(dom(lebendig('toast', 'undo-action')).querySelector('.nc-toast').dataset.duration).toBe('10000')
    for (const sp of ['severity-variants', 'with-action', 'stacked', 'error-alert']) {
      expect(dom(lebendig('toast', sp)).querySelector('[data-duration]'), sp).toBeNull()
    }
  })

  it('„Erneut zeigen": Vorlage passt zur lebendigen Meldung, nur wo man schliessen kann', () => {
    for (const [id, sp] of [['toast', 'stacked'], ['alert', 'dismissible-variants'], ['banner', 'dismissible'], ['notification', 'basic']]) {
      const d = dom(lebendig(id, sp))
      const knopf = d.querySelector(`button.nc-button[data-ra-erneut="${id}"]`)
      expect(knopf, `${id}`).not.toBeNull()
      const ziel = d.querySelector('[data-ra-ziel]')
      const vorlage = d.querySelector('template[data-ra-vorlage]')
      expect(vorlage.innerHTML.trim().length).toBeGreaterThan(0)
      expect(ziel.querySelectorAll(`.${WURZELN[id]}`).length).toBe(dom(vorlage.innerHTML).querySelectorAll(`.${WURZELN[id]}`).length)
    }
    expect(dom(lebendig('alert', 'all-variants')).querySelector('[data-ra-erneut]')).toBeNull()
    expect(dom(lebendig('notification', 'permanent')).querySelector('[data-ra-erneut]')).toBeNull()
  })

  for (const [id, sp] of [['toast', 'severity-variants'], ['alert', 'dismissible-variants'], ['banner', 'dismissible'], ['notification', 'basic']]) {
    it(`${id}: Schliessen nimmt die Meldung weg, „Erneut zeigen" setzt sie wieder ein und bindet sie`, () => {
      const b = buehne(lebendig(id, sp))
      einrichtungFuer(id)(b)
      anbinden(b, [id])
      const wurzel = () => b.querySelectorAll(`.${WURZELN[id]}`)
      b.querySelector(`.${WURZELN[id]}__close`).click()
      expect(wurzel()).toHaveLength(0)
      b.querySelector('[data-ra-erneut]').click()
      expect(wurzel()).toHaveLength(1)
      expect(wurzel()[0].getAttribute('data-neo-behavior')).toBe(id)
      b.querySelector(`.${WURZELN[id]}__close`).click()
      expect(wurzel()).toHaveLength(0)
    })
  }
})

describe('Rückmeldungs-Block in der RecipeArena', () => {
  beforeEach(() => setActivePinia(createPinia()))
  afterEach(() => { document.body.innerHTML = '' })

  async function geladen (id) {
    const w = mount(RecipeArena, { props: { componentId: id }, attachTo: document.body })
    for (const bis = Date.now() + 8000; !w.find('.ra-specimen').exists() && Date.now() < bis;) {
      await flushPromises()
      await new Promise((r) => setTimeout(r, 10))
    }
    return w
  }

  for (const id of BLOCK) {
    it(`${id}: alle Specimens aus der Vorlage, Umschalter „Ausprobieren", danach gebunden`, async () => {
      const w = await geladen(id)
      const recipe = normalisiereRecipe(rohesRecipe(id))
      expect(w.findAll('.ra-specimen').length).toBe(recipe.specimens.length)
      expect(w.findAll('.ra-cell[data-quelle="heuristik"], .ra-cell[data-quelle="fehler"]')).toHaveLength(0)
      expect(w.find('[data-neo-behavior]').exists()).toBe(false)
      await w.findAll('.ra-modus__knopf')[1].trigger('click')
      await flushPromises()
      await new Promise((r) => setTimeout(r, 0))
      expect(w.find(`[data-neo-behavior~="${id}"]`).exists()).toBe(true)
      expect(w.findAll('.ra-cell').length).toBe(w.findAll('.ra-specimen').length)
      w.unmount()
    })
  }

  it('toast: Schliessen und „Erneut zeigen" in der gemounteten Arena', async () => {
    const w = await geladen('toast')
    await w.findAll('.ra-modus__knopf')[1].trigger('click')
    await flushPromises()
    await new Promise((r) => setTimeout(r, 0))
    const zelle = w.find('.ra-specimen[data-specimen-id="stacked"] .ra-cell').element
    expect(zelle.querySelectorAll('.nc-toast')).toHaveLength(3)
    zelle.querySelector('.nc-toast__close').click()
    expect(zelle.querySelectorAll('.nc-toaster .nc-toast')).toHaveLength(2)
    zelle.querySelector('[data-ra-erneut]').click()
    // drei neue dazu → Warteschlange (3) laesst die drei neuesten stehen
    expect(zelle.querySelectorAll('.nc-toaster .nc-toast')).toHaveLength(3)
    expect([...zelle.querySelectorAll('.nc-toaster .nc-toast')].every((t) => t.getAttribute('data-neo-behavior') === 'toast')).toBe(true)
    w.unmount()
  })
})
