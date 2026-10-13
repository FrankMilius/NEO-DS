/**
 * Form (Plan v4, Phase 8, 13.10.2026): Pruefung als Behavior form nach
 * data/form-recipe.json (keyboard, events), Anzeige nach form-field und
 * validation-summary. Ersetzt die Pruefung aus NeoForm.renderFields
 * (neo_fe/js/neo-theme.js); die Felder rendert neo_fe im Twig
 * (templates/block/neo-form-fields.html.twig) — das Markup hier folgt ihm.
 * Jede Taste aus `keyboard` und jedes Ereignis aus `events` wird geprueft.
 */
import { describe, it, expect, afterEach } from 'vitest'
import { anbinden, abbinden, BEHAVIORS, NUR_AUSDRUECKLICH } from 'neo-behaviors'
import { buehne, taste, deckeTastenAb, sammle, passtZumRecipe } from './_helfer.js'

afterEach(() => { document.body.innerHTML = '' })

/** Markup wie neo-form-fields.html.twig (Auszug) */
function formMarkup ({ lang = 'de', summary = true } = {}) {
  return `<div lang="${lang}"><form class="nc-form nc-form--two-column" novalidate data-neo-form>
${summary ? '<div class="nc-validation-summary nc-validation-summary--hidden"></div>' : ''}
<div class="nc-form-field nc-form-field--required"><label class="nc-form-label" for="nf-name"><span class="nc-form-label__text">Name</span><span class="nc-form-label__required" aria-hidden="true"> *</span></label><input class="nc-input" type="text" name="name" id="nf-name" required data-label="Name"></div>
<div class="nc-form-field nc-form-field--required"><label class="nc-form-label" for="nf-email"><span class="nc-form-label__text">E-Mail</span></label><input class="nc-input" type="email" name="email" id="nf-email" required data-label="E-Mail" aria-describedby="nf-email-help"><p class="nc-form-field__help" id="nf-email-help">Geschaeftlich</p></div>
<div class="nc-form-field"><label class="nc-form-label" for="nf-firma"><span class="nc-form-label__text">Firma</span></label><input class="nc-input" type="text" name="firma" id="nf-firma" data-label="Firma"></div>
<fieldset class="nc-form-field nc-form-group" id="nf-thema" data-neo-form-gruppe data-required><legend class="nc-form-label">Thema</legend>
<label class="nc-checkbox"><input type="checkbox" class="nc-checkbox__input" name="thema[]" value="a"><span class="nc-checkbox__label">A</span></label>
<label class="nc-checkbox"><input type="checkbox" class="nc-checkbox__input" name="thema[]" value="b"><span class="nc-checkbox__label">B</span></label></fieldset>
<div class="nc-form-hp" aria-hidden="true"><input type="text" name="website_url" tabindex="-1" autocomplete="off"></div>
<div class="nc-form-block__submission nc-form-field--full-width"><div class="nc-form-block__terms"><label class="nc-checkbox"><input type="checkbox" class="nc-checkbox__input" name="terms_accepted" id="nf-terms" required data-error="Bitte stimmen Sie zu."><span class="nc-checkbox__label">Ich stimme zu</span></label></div>
<button type="submit" class="nc-button nc-form-block__submit">Senden</button></div>
</form></div>`
}

function bau (opts) {
  const b = buehne(formMarkup(opts))
  anbinden(b, ['form'])
  const form = /** @type {HTMLFormElement} */ (b.querySelector('form'))
  const $ = (s) => /** @type {HTMLElement} */ (b.querySelector(s))
  return { b, form, $, knopf: $('button[type=submit]'), name: $('#nf-name'), email: $('#nf-email'), terms: $('#nf-terms'), gruppe: $('#nf-thema') }
}
const verlasse = (el) => el.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: null }))
const tippe = (el, wert) => { el.value = wert; el.dispatchEvent(new Event('input', { bubbles: true })) }
const hake = (el, an = true) => { el.checked = an; el.dispatchEvent(new Event('change', { bubbles: true })) }
const fuelleAlles = ({ name, email, terms, gruppe }) => { tippe(name, 'Anna'); tippe(email, 'a@b.de'); hake(terms); hake(gruppe.querySelector('input')) }

describe('form: Website-Bauteil', () => {
  it('nurAusdruecklich und in NUR_AUSDRUECKLICH (Drupal bindet nur per nur)', () => {
    expect(BEHAVIORS.form.nurAusdruecklich).toBe(true)
    expect(NUR_AUSDRUECKLICH).toContain('form')
  })

  it('Verlassen eines Pflichtfelds: Text unter dem Feld OHNE role=alert, aria-invalid, aria-describedby ergaenzt', () => {
    const { name, email, $ } = bau()
    verlasse(name)
    const p = $('#nf-name-err')
    expect(p.textContent).toBe('Bitte Name angeben.')
    expect(p.hasAttribute('role')).toBe(false)
    expect(name.getAttribute('aria-invalid')).toBe('true')
    expect(name.getAttribute('aria-describedby')).toBe('nf-name-err')
    expect(name.closest('.nc-form-field').classList.contains('nc-form-field--invalid')).toBe(true)
    // Hilfetext bleibt verbunden
    tippe(email, 'kein-at'); verlasse(email)
    expect(email.getAttribute('aria-describedby')).toBe('nf-email-help nf-email-err')
    expect($('#nf-email-err').textContent).toMatch(/gültige E-Mail-Adresse/)
  })

  it('live nach einem Fehler: Eingabe heilt das Feld, vorher keine Meldung beim Tippen', () => {
    const { name, email, $ } = bau()
    tippe(email, 'x')
    expect($('#nf-email-err')).toBeNull()
    verlasse(name)
    tippe(name, 'Anna')
    expect($('#nf-name-err')).toBeNull()
    expect(name.hasAttribute('aria-invalid')).toBe(false)
    expect(name.hasAttribute('aria-describedby')).toBe(false)
  })

  it('Gruppe (checkbox-group): erst beim Verlassen der Gruppe pruefen, mindestens ein Haken; fieldset traegt Fehler', () => {
    const { gruppe, $ } = bau()
    const [a, b2] = gruppe.querySelectorAll('input')
    a.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: b2 }))
    expect($('#nf-thema-err')).toBeNull()
    verlasse(b2)
    expect($('#nf-thema-err').textContent).toBe('Bitte wählen Sie mindestens eine Option.')
    expect(gruppe.getAttribute('aria-invalid')).toBe('true')
    hake(a)
    expect($('#nf-thema-err')).toBeNull()
  })

  it('eigener Text aus data-error; Zustimmungs-Kaestchen prueft sofort bei change', () => {
    const { terms, $ } = bau()
    hake(terms, false)
    expect($('#nf-terms-err').textContent).toBe('Bitte stimmen Sie zu.')
    expect(terms.closest('.nc-form-block__terms').classList.contains('nc-form-field--invalid')).toBe(true)
  })

  it('Absenden mit Fehlern: EINE Zusammenfassung (role=alert, Anzahl, Links) mit Fokus statt vieler alerts; Link fokussiert das Feld', () => {
    const { form, knopf, gruppe, $ } = bau()
    knopf.click()
    const box = $('.nc-validation-summary')
    expect(box.classList.contains('nc-validation-summary--hidden')).toBe(false)
    expect(box.getAttribute('role')).toBe('alert')
    expect(document.activeElement).toBe(box)
    expect(form.querySelectorAll('[role=alert]')).toHaveLength(1)
    expect(document.getElementById(box.getAttribute('aria-labelledby')).textContent).toBe('4 Angaben sind noch nicht korrekt')
    const links = [...box.querySelectorAll('a')]
    expect(links.map((a) => a.getAttribute('href'))).toEqual(['#nf-name', '#nf-email', '#nf-thema', '#nf-terms'])
    expect(box.querySelector('.nc-validation-summary__icon').getAttribute('aria-hidden')).toBe('true')
    links[2].click()
    expect(document.activeElement).toBe(gruppe.querySelector('input'))
  })

  it('Zusammenfassung fehlt im Markup: das Behavior legt sie als erstes Kind an und raeumt sie beim Abbinden weg', () => {
    const { b, form, knopf } = bau({ summary: false })
    knopf.click()
    expect(form.firstElementChild.classList.contains('nc-validation-summary')).toBe(true)
    abbinden(b, ['form'])
    expect(form.querySelector('.nc-validation-summary')).toBeNull()
  })

  it('Texte nach lang: en', () => {
    const { name, knopf, $ } = bau({ lang: 'en' })
    verlasse(name)
    expect($('#nf-name-err').textContent).toBe('Please enter Name.')
    knopf.click()
    expect($('.nc-validation-summary__title').textContent).toBe('There are 4 problems')
  })

  it('Honigtopf zaehlt nicht mit', () => {
    const t = bau()
    fuelleAlles(t)
    const liste = sammle(t.form, 'form-submit')
    t.form.querySelector('[name=website_url]').value = 'bot'
    t.knopf.click()
    expect(liste.at(-1).detail).toEqual({ valid: true, errors: 0 })
  })

  it('jede Taste aus keyboard', () => {
    deckeTastenAb('form', {
      Tab: () => {
        // Nach dem Absenden mit Fehlern steht der Fokus auf der Zusammenfassung,
        // ihre Links sind in der Tab-Folge; das Behavior faengt Tab nicht ab.
        const { knopf, $ } = bau()
        knopf.click()
        const e = taste($('.nc-validation-summary'), 'Tab')
        expect(e.defaultPrevented).toBe(false)
        expect($('.nc-validation-summary a').tabIndex).toBe(0)
      },
      Enter: () => {
        const { knopf, $ } = bau()
        knopf.focus()
        taste(knopf, 'Enter')
        expect(document.activeElement).toBe($('.nc-validation-summary'))
      }
    })
  })

  it('Ereignis form-submit wie im Recipe: mit Fehlern Submit abgebrochen; ohne Fehler uebernimmt, wer abbricht, sonst sendet der Browser', () => {
    const t = bau()
    const liste = sammle(t.form, 'form-submit')
    const roh = []
    t.form.addEventListener('submit', (e) => roh.push(e))
    t.knopf.click()
    expect(liste.at(-1).detail).toEqual({ valid: false, errors: 4 })
    expect(roh.at(-1).defaultPrevented).toBe(true)
    fuelleAlles(t)
    t.knopf.click()
    expect(liste.at(-1).detail).toEqual({ valid: true, errors: 0 })
    expect(roh.at(-1).defaultPrevented).toBe(false)
    expect(t.form.querySelector('.nc-validation-summary').classList.contains('nc-validation-summary--hidden')).toBe(true)
    t.form.addEventListener('form-submit', (e) => e.preventDefault())
    t.knopf.click()
    expect(roh.at(-1).defaultPrevented).toBe(true)
    for (const e of liste) { expect(e.cancelable).toBe(true); passtZumRecipe('form', e) }
  })

  it('abbinden stellt den Zustand ohne Skript her (keine Fehlertexte, kein aria-invalid, Hilfetext bleibt)', () => {
    const { b, name, email, knopf, form } = bau()
    knopf.click()
    abbinden(b, ['form'])
    expect(form.querySelectorAll('.nc-form-error')).toHaveLength(0)
    expect(name.hasAttribute('aria-invalid')).toBe(false)
    expect(email.getAttribute('aria-describedby')).toBe('nf-email-help')
    expect(form.querySelector('.nc-validation-summary').classList.contains('nc-validation-summary--hidden')).toBe(true)
  })
})
