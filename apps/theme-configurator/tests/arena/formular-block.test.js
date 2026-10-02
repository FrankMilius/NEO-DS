/**
 * Plan v3, Phase 3 (Block Formular): die zwoelf Formular-Bauteile kommen aus
 * dem Recipe (Vorlagen in src/arena-templates) statt aus handgeschriebenen
 * Vue-Arenen. Geprueft wird je Bauteil:
 *   - keine Sonderfall-Arena, jede Zelle aus der Vorlage
 *   - echtes DS-Element mit Basisklasse, nur Klassen aus styles.css, keine
 *     Inline-Gestaltung (erlaubt sind nur Custom Properties, die das DS als
 *     Instanzwert vorsieht, z. B. --nc-range-progress)
 *   - Zustaende ueber native Attribute bzw. DS-Klassen
 *   - andere Bauteile im Markup sind im Recipe erklaert (komposition) oder
 *     vom Specimen ausdruecklich zusammengesetzt (composes)
 */
import { describe, it, expect } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { vorlageFuer, einrichtungFuer } from '../../src/arena-templates/index.js'
import { normalisiereRecipe, specimenAnsicht, fuerWeiteresThema } from '../../src/lib/recipe-arena.js'
import { hasArena, arenaQuelle } from '../../src/composables/useArenaResolver.js'
import { RECIPE_IDS, WURZEL, rohesRecipe } from './_recipes.js'

const BLOCK = ['input', 'textarea', 'checkbox', 'radio', 'switch', 'form-field', 'input-group', 'fieldset']

function zellen (id, specimenId) {
  const recipe = normalisiereRecipe(rohesRecipe(id))
  return recipe.specimens
    .filter((sp) => !specimenId || sp.id === specimenId)
    .flatMap((sp) => specimenAnsicht(sp, recipe, id, vorlageFuer(id)).zeilen
      .flatMap((z) => z.zellen.map((c) => ({ ...c, specimen: sp }))))
}

function dom (html) {
  const d = document.createElement('div')
  d.innerHTML = html
  return d
}

const alle = (id, sp) => zellen(id, sp).map((z) => dom(z.html))

// Klassen des gebauten Stylesheets (CI baut es vor den Tests: npm run build:css)
const STYLES = resolve(WURZEL, 'styles.css')
function dsKlassen () {
  if (!existsSync(STYLES)) throw new Error('styles.css fehlt — im Wurzelordner `npm run build:css` ausfuehren')
  const css = readFileSync(STYLES, 'utf8')
  return new Set([...css.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)].map((m) => m[1]))
}

// Wurzelklasse je Recipe (anatomy.root.element = ".nc-…")
const WURZELN = Object.fromEntries(RECIPE_IDS.map((id) => {
  const el = rohesRecipe(id).anatomy?.root?.element || ''
  const m = /^\.([a-z0-9-]+)$/.exec(String(el).trim())
  return [id, m ? m[1] : null]
}).filter(([, k]) => k))

// Andere Bauteile in Slots, die weder komposition noch composes nennt —
// begruendet.
const ERLAUBT = {
  textarea: { button: 'Knoepfe in der Aktionsleiste (__actions)' }
}

describe('Formular-Block aus dem Recipe', () => {
  const bekannt = dsKlassen()

  for (const id of BLOCK) {
    describe(id, () => {
      it('keine Sonderfall-Arena, jede Zelle aus der Vorlage', () => {
        expect(hasArena(id)).toBe(false)
        expect(arenaQuelle(id)).toBe('recipe')
        expect(vorlageFuer(id)).toBeTypeOf('function')
        const z = zellen(id)
        expect(z.length).toBeGreaterThan(0)
        expect(new Set(z.map((c) => c.quelle))).toEqual(new Set(['vorlage']))
        // jedes Specimen des Recipes hat Zellen
        const recipe = normalisiereRecipe(rohesRecipe(id))
        expect(new Set(z.map((c) => c.specimen.id))).toEqual(new Set(recipe.specimens.map((s) => s.id)))
      })

      it('echtes DS-Element mit Basisklasse, nur Klassen aus styles.css', () => {
        const wurzel = WURZELN[id]
        for (const z of zellen(id)) {
          const d = dom(z.html)
          expect(d.querySelector(`.${wurzel}`), `${z.specimen.id}/${z.id}`).not.toBeNull()
          for (const el of d.querySelectorAll('[class]')) {
            for (const k of el.classList) {
              if (/^(nc|fnd|u|o)-/.test(k)) expect(bekannt.has(k), `${id}: Klasse ${k} fehlt in styles.css`).toBe(true)
            }
          }
        }
      })

      it('keine Inline-Gestaltung — style nur fuer DS-Custom-Properties', () => {
        for (const z of zellen(id)) {
          for (const el of dom(z.html).querySelectorAll('[style]')) {
            const deklarationen = el.getAttribute('style').split(';').map((s) => s.trim()).filter(Boolean)
            for (const d of deklarationen) expect(d, `${id}/${z.specimen.id}: ${d}`).toMatch(/^--(nc|mod)-[\w-]+\s*:/)
          }
        }
      })

      it('andere Bauteile sind erklaert (komposition, composes oder begruendet)', () => {
        const recipe = rohesRecipe(id)
        const erklaert = new Set((recipe.komposition || []).map((k) => k.recipe))
        for (const z of zellen(id)) {
          const klassen = new Set([...dom(z.html).querySelectorAll('[class]')].flatMap((el) => [...el.classList]))
          const composes = new Set(z.specimen.composes || [])
          for (const [anderes, k] of Object.entries(WURZELN)) {
            if (anderes === id || !klassen.has(k)) continue
            const ok = erklaert.has(anderes) || composes.has(anderes) || ERLAUBT[id]?.[anderes]
            expect(ok, `${id}/${z.specimen.id} enthaelt ${anderes}`).toBeTruthy()
          }
        }
      })

      it('deaktiviert heisst nativ deaktiviert, ohne fremde Zustandsklassen', () => {
        for (const z of zellen(id)) {
          const d = dom(z.html)
          expect(d.querySelector('.is-disabled, .is-active, .is-selected'), `${id}/${z.specimen.id}`).toBeNull()
          if (!z.label.includes('Deaktiviert')) continue
          expect(d.querySelector(':disabled'), `${id}/${z.specimen.id}: nichts deaktiviert`).not.toBeNull()
        }
      })
    })
  }

  it('Kennzahl: abgeloeste ohne Sonderfall', () => {
    expect(BLOCK.filter((id) => hasArena(id))).toEqual([])
  })
})

describe('Formular-Block: Zustaende', () => {
  it('input: Typen, Validierung, readonly, gefuellt, schwebendes Label', () => {
    const [text, suche, passwort] = alle('input', 'input-types')
    expect(text.querySelector('input.nc-input').type).toBe('text')
    expect(suche.querySelector('input.nc-input--search').type).toBe('search')
    expect(suche.querySelector('.nc-input-wrapper .nc-input__icon')).not.toBeNull()
    expect(passwort.querySelector('input.nc-input--password').type).toBe('password')
    expect(passwort.querySelector('.nc-input__icon--end')).not.toBeNull()
    const [aus, nurLesen] = alle('input', 'disabled-readonly').map((d) => d.querySelector('input'))
    expect(aus.disabled).toBe(true)
    expect(nurLesen.readOnly).toBe(true)
    expect(nurLesen.value).not.toBe('')
    const fehler = alle('input', 'validation-states').map((d) => d.querySelector('input')).filter((i) => i.classList.contains('nc-input--error'))
    expect(fehler.length).toBeGreaterThan(0)
    for (const f of fehler) expect(f.getAttribute('aria-invalid')).toBe('true')
    const schwebend = alle('input', 'floating-label-states')
    for (const d of schwebend) {
      const feld = d.querySelector('.nc-input-wrapper > input.nc-input--has-label')
      expect(d.querySelector(`label.nc-input__label[for="${feld.id}"]`)).not.toBeNull()
    }
    expect(schwebend.some((d) => d.querySelector('input').value)).toBe(true)
    expect(alle('input', 'content-states').some((d) => d.querySelector('.nc-input__clear') && d.querySelector('input').value)).toBe(true)
    const affix = alle('input', 'with-affixes')[0]
    expect(affix.querySelector('.nc-input-wrapper--has-prefix .nc-input__prefix')).not.toBeNull()
    expect(affix.querySelector('.nc-input__suffix')).not.toBeNull()
  })

  it('textarea: Varianten, Zaehler am Limit, Aktionen, max-height als Token', () => {
    expect(alle('textarea', 'all-states').some((d) => d.querySelector('textarea.nc-textarea').disabled)).toBe(true)
    const [normal, limit] = alle('textarea', 'with-counter')
    expect(normal.querySelector('.nc-textarea__counter--limit')).toBeNull()
    expect(limit.querySelector('.nc-textarea__counter--limit')).not.toBeNull()
    expect(limit.querySelector('textarea').getAttribute('aria-invalid')).toBe('true')
    expect(alle('textarea', 'with-actions')[0].querySelector('.nc-textarea-wrapper > .nc-textarea__actions .nc-button')).not.toBeNull()
    expect(alle('textarea', 'max-height-limit')[0].querySelector('textarea').getAttribute('style')).toContain('--nc-textarea-max-height')
    const [leer, voll] = alle('textarea', 'empty-vs-filled')[0].querySelectorAll('textarea')
    expect([leer.value, voll.value.length > 0]).toEqual(['', true])
    const form = alle('textarea', 'full-composition')[0]
    expect(form.querySelector('.nc-form-field > label.nc-form-label').getAttribute('for')).toBe(form.querySelector('textarea').id)
  })

  it('checkbox: angehakt, unbestimmt (per einrichten), deaktiviert, Fehler, Karte', () => {
    const z = alle('checkbox', 'all-states')
    const feld = (d) => d.querySelector('input.nc-checkbox__input[type="checkbox"]')
    expect(z.some((d) => feld(d).checked)).toBe(true)
    expect(z.some((d) => feld(d).disabled)).toBe(true)
    const unbestimmt = z.find((d) => feld(d).hasAttribute('data-indeterminate'))
    expect(feld(unbestimmt).indeterminate).toBe(false)
    einrichtungFuer('checkbox')(unbestimmt)
    expect(feld(unbestimmt).indeterminate).toBe(true)
    for (const d of alle('checkbox', 'error-state')) {
      expect(d.querySelector('.nc-checkbox--error')).not.toBeNull()
      expect(feld(d).getAttribute('aria-invalid')).toBe('true')
    }
    const [aus, an] = alle('checkbox', 'disabled-states')[0].querySelectorAll('input')
    expect([aus.disabled, aus.checked, an.disabled, an.checked]).toEqual([true, false, true, true])
    expect(alle('checkbox', 'card-variant')[0].querySelector('label.nc-checkbox--card .nc-checkbox__label')).not.toBeNull()
  })

  it('radio: angehakt, Ausrichtung top, Gruppe im Fieldset mit eigenem name', () => {
    const z = alle('radio', 'all-states')
    expect(z.some((d) => d.querySelector('input.nc-radio__input').checked)).toBe(true)
    expect(z.some((d) => d.querySelector('input.nc-radio__input').disabled)).toBe(true)
    expect(alle('radio', 'alignment-comparison').some((d) => d.querySelector('.nc-radio--top'))).toBe(true)
    const gruppe = alle('radio', 'radio-group')
    const namen = gruppe.map((d) => [...new Set([...d.querySelectorAll('input')].map((i) => i.name))])
    for (const n of namen) expect(n.length).toBe(1)
    expect(new Set(namen.flat()).size).toBe(gruppe.length)
    expect(gruppe[0].querySelector('fieldset.nc-fieldset > legend.nc-fieldset__legend')).not.toBeNull()
  })

  it('switch: Knopf-Muster ueber aria-checked, Checkbox-Muster nativ', () => {
    const z = alle('switch', 'default-states')
    const spur = (d) => d.querySelector('button.nc-switch__track[role="switch"]')
    expect(z.map((d) => spur(d).getAttribute('aria-checked'))).toContain('true')
    expect(z.some((d) => spur(d).disabled)).toBe(true)
    for (const d of alle('switch', 'checked-states')) expect(spur(d).getAttribute('aria-checked')).toBe('true')
    const muster = alle('switch', 'pattern-comparison')
    const nativ = muster.filter((d) => d.querySelector('input.nc-switch__input[role="switch"]'))
    expect(nativ.length).toBe(2)
    expect(nativ.some((d) => d.querySelector('input').checked)).toBe(true)
    expect(alle('switch', 'with-indicators')[0].querySelector('.nc-switch--indicators .nc-switch__indicator-off')).not.toBeNull()
    const [aus, an] = alle('switch', 'disabled-states')[0].querySelectorAll('button')
    expect([aus.disabled, aus.getAttribute('aria-checked'), an.getAttribute('aria-checked')]).toEqual([true, 'false', 'true'])
  })





  it('form-field: Label/Feld verbunden, Pflicht, Fehler, Hinweis, deaktiviert, Fieldset', () => {
    for (const z of zellen('form-field').filter((c) => c.specimen.id !== 'fieldset-grouping')) {
      const d = dom(z.html)
      const feld = d.querySelector('.nc-form-field > input.nc-input')
      expect(d.querySelector(`.nc-form-field > label.nc-form-label[for="${feld.id}"]`), z.specimen.id).not.toBeNull()
    }
    const [keine, pflicht, optional] = alle('form-field', 'requirement-variants')
    expect(keine.querySelector('.nc-form-label__required, .nc-form-label__optional')).toBeNull()
    expect(pflicht.querySelector('.nc-form-label__required')).not.toBeNull()
    expect(pflicht.querySelector('input').required).toBe(true)
    expect(optional.querySelector('.nc-form-label__optional')).not.toBeNull()
    const fehler = alle('form-field', 'required-with-error')[0]
    const feld = fehler.querySelector('input')
    expect(fehler.querySelector('.nc-form-field--error')).not.toBeNull()
    expect(feld.getAttribute('aria-invalid')).toBe('true')
    for (const ref of feld.getAttribute('aria-describedby').split(' ')) expect(fehler.querySelector(`#${ref}`)).not.toBeNull()
    expect(fehler.querySelector('.nc-form-error[role="alert"]')).not.toBeNull()
    const [, aus] = alle('form-field', 'disabled-state')
    expect(aus.querySelector('.nc-form-field--disabled input').disabled).toBe(true)
    expect(alle('form-field', 'fieldset-grouping')[0].querySelector('fieldset.nc-form-field > legend.nc-form-label')).not.toBeNull()
  })

  it('input-group: Input mit Groesse, Fehler, deaktiviert, schreibgeschuetzt, Knopf in der Gruppe', () => {
    const [sm, , lg] = alle('input-group', 'size-variants')
    expect(sm.querySelector('.nc-input-group--sm > input.nc-input.nc-input--sm')).not.toBeNull()
    expect(lg.querySelector('.nc-input-group--lg > input.nc-input.nc-input--lg')).not.toBeNull()
    const z = alle('input-group', 'all-states')
    expect(z.find((d) => d.querySelector('.nc-input-group--disabled')).querySelector('input').disabled).toBe(true)
    expect(z.find((d) => d.querySelector('.nc-input-group--readonly')).querySelector('input').readOnly).toBe(true)
    expect(alle('input-group', 'validation').find((d) => d.querySelector('.nc-input-group--error')).querySelector('input').getAttribute('aria-invalid')).toBe('true')
    expect(alle('input-group', 'search-with-button')[0].querySelector('.nc-input-group > input.nc-input + button.nc-button')).not.toBeNull()
    const kopie = alle('input-group', 'readonly-with-copy')[0]
    expect(kopie.querySelector('input').readOnly).toBe(true)
    expect(kopie.querySelector('.nc-input-group > button.nc-button[aria-label="Kopieren"]:last-child')).not.toBeNull()
  })

  it('fieldset: Legende, Helfer per aria-describedby, natives disabled, Checkboxen/Radios', () => {
    for (const d of alle('fieldset')) expect(d.querySelector('fieldset.nc-fieldset > legend.nc-fieldset__legend')).not.toBeNull()
    const aus = alle('fieldset', 'disabled')[0].querySelector('fieldset')
    expect(aus.disabled).toBe(true)
    expect(aus.classList.contains('nc-fieldset--disabled')).toBe(true)
    const helfer = alle('fieldset', 'with-helper')[0]
    const ref = helfer.querySelector('fieldset').getAttribute('aria-describedby')
    expect(helfer.querySelector(`#${ref}.nc-fieldset__helper`)).not.toBeNull()
    expect(alle('fieldset', 'required-group')[0].querySelector('.nc-fieldset__legend .nc-fieldset__required')).not.toBeNull()
    expect(alle('fieldset', 'with-checkboxes')[0].querySelectorAll('input.nc-checkbox__input').length).toBe(3)
    expect(alle('fieldset', 'with-radios')[0].querySelectorAll('input.nc-radio__input').length).toBe(3)
    expect(alle('fieldset', 'nested-form')[0].querySelector('fieldset.nc-fieldset--card fieldset.nc-fieldset--borderless')).not.toBeNull()
    expect(alle('fieldset', 'legend-centered')[0].querySelector('.nc-fieldset--legend-center')).not.toBeNull()
  })
})

describe('Split-Modus: zweite Vorschau mit eigenen ids und names', () => {
  it('fuerWeiteresThema haengt an id, for, name und aria-Bezuege an', () => {
    const html = '<label for="a">x</label><input id="a" name="g" aria-describedby="h1 h2"><p id="h1"></p><span data-for="z"></span>'
    expect(fuerWeiteresThema(html, '-t2')).toBe('<label for="a-t2">x</label><input id="a-t2" name="g-t2" aria-describedby="h1-t2 h2-t2"><p id="h1-t2"></p><span data-for="z"></span>')
  })

  it('angehakte Radios bleiben in beiden Vorschauen angehakt', () => {
    const [z] = zellen('radio', 'checked-unchecked').filter((c) => c.label.includes('Angehakt'))
    const wurzel = document.createElement('div')
    wurzel.innerHTML = z.html + fuerWeiteresThema(z.html, '-t2')
    document.body.appendChild(wurzel)
    expect([...wurzel.querySelectorAll('input[type="radio"]')].map((i) => i.checked)).toEqual([true, true])
    wurzel.remove()
  })
})
