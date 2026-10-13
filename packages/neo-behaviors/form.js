// @ts-check
// ==========================================================================
// Form — Pruefung nach data/form-recipe.json (keyboard, events), Anzeige
// nach form-field und validation-summary
// ==========================================================================
// Website-Bauteil (Plan v4, Phase 8, 13.10.2026). Ersetzt die Pruefung aus
// NeoForm.renderFields (neo_fe/js/neo-theme.js); die Felder rendert neo_fe
// im Twig. Absenden (Honigtopf, AJAX) bleibt im Theme und haengt am
// Ereignis form-submit.
//
// Wurzel form[data-neo-form]. Geprueft wird
//   - jedes benannte Feld (input, select, textarea; nicht im Honigtopf
//     .nc-form-hp, nicht in einer Gruppe) ueber die native Gueltigkeit
//     (required, type, minlength, pattern) — das Formular traegt novalidate;
//   - jede Gruppe [data-neo-form-gruppe] mit data-required (checkbox-group
//     als fieldset, multiselect): mindestens ein Haken.
//
// Wann: beim Verlassen eines Felds bzw. einer Gruppe (focusout), danach live
// (input/change), solange es fehlerhaft ist; beim Absenden alle.
//
// Anzeige: Fehlertext p.nc-form-error#<id>-err im Feld-Wrapper OHNE Rolle
// (vorher je Feld role="alert": bei sechs Fehlern sechs gleichzeitige
// Ansagen), Feld aria-invalid="true" und aria-describedby um die Fehler-id
// ergaenzt. Beim Absenden mit Fehlern die Zusammenfassung
// .nc-validation-summary (role="alert", tabindex=-1) als erstes Kind des
// Formulars mit Links zu den Feldern; der Fokus springt dorthin.
//
// Ereignis `form-submit` { valid, errors } am Formular, abbrechbar. Ohne
// Fehler: wer es abbricht, uebernimmt das Absenden (sonst sendet der
// Browser). Mit Fehlern bricht das Behavior den Submit selbst ab.
//
// Texte de/en nach lang (eigener Text eines Felds: data-error; Name im Text:
// data-label).
// ==========================================================================
import { spracheVon } from './gallery.js'

export const TEXTE = {
  de: {
    fehlt: 'Bitte @label angeben.',
    bestaetigen: 'Bitte bestätigen Sie diese Angabe.',
    auswahl: 'Bitte wählen Sie mindestens eine Option.',
    email: 'Bitte eine gültige E-Mail-Adresse eingeben (z. B. name@firma.de).',
    url: 'Bitte eine gültige URL eingeben (z. B. https://…).',
    kurz: 'Bitte mindestens @n Zeichen eingeben.',
    sonst: 'Bitte überprüfen Sie diese Eingabe.',
    feld: 'Dieses Feld',
    titelEins: '1 Angabe ist noch nicht korrekt',
    titelViele: '@count Angaben sind noch nicht korrekt'
  },
  en: {
    fehlt: 'Please enter @label.',
    bestaetigen: 'Please confirm this.',
    auswahl: 'Please choose at least one option.',
    email: 'Please enter a valid email address (e.g. name@company.com).',
    url: 'Please enter a valid URL (e.g. https://…).',
    kurz: 'Please enter at least @n characters.',
    sonst: 'Please check this entry.',
    feld: 'This field',
    titelEins: 'There is 1 problem',
    titelViele: 'There are @count problems'
  }
}

let zaehler = 0

/** Symbol der Zusammenfassung (wie data/markup/validation-summary.html) */
const KREUZ = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" focusable="false"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>'

const FELD = 'input[name], select[name], textarea[name]'

/** Wrapper eines Felds (dort stehen Fehlertext und Modifier) @param {HTMLElement} el */
const wrapperVon = (el) => /** @type {HTMLElement} */ (el.closest('.nc-form-field, .nc-form-block__terms') || el.parentElement)

/** aria-describedby um eine id ergaenzen bzw. davon befreien */
function beschreibe (el, id, an) {
  const d = (el.getAttribute('aria-describedby') || '').split(' ').filter(Boolean)
  const i = d.indexOf(id)
  if (an && i < 0) d.push(id)
  if (!an && i >= 0) d.splice(i, 1)
  if (d.length) el.setAttribute('aria-describedby', d.join(' '))
  else el.removeAttribute('aria-describedby')
}

/** Name des Felds im Fehlertext */
function nameVon (el, t) {
  return (el.getAttribute('data-label') || t.feld).replace(/\s*\*?$/, '')
}

/** @typedef {{ ziel: HTMLElement, wrapper: HTMLElement, gruppe: HTMLElement|null, fehlerId: string }} Einheit */

/**
 * Pruefeinheiten des Formulars: Felder und Gruppen.
 * @param {HTMLFormElement} form
 * @returns {Einheit[]}
 */
function einheitenVon (form) {
  const aus = []
  for (const g of /** @type {HTMLElement[]} */ ([...form.querySelectorAll('[data-neo-form-gruppe]')])) {
    // Ziel: Knopf des Multiselects bzw. das fieldset
    const ziel = /** @type {HTMLElement} */ (g.querySelector('.nc-multiselect__trigger') || g)
    if (!g.id) g.id = `nc-form-gruppe-${++zaehler}`
    aus.push({ ziel, wrapper: g, gruppe: g, fehlerId: `${g.id}-err` })
  }
  for (const el of /** @type {HTMLElement[]} */ ([...form.querySelectorAll(FELD)])) {
    if (el.closest('.nc-form-hp, [data-neo-form-gruppe]')) continue
    if (/** @type {HTMLInputElement} */ (el).type === 'hidden') continue
    if (!el.id) el.id = `nc-form-feld-${++zaehler}`
    aus.push({ ziel: el, wrapper: wrapperVon(el), gruppe: null, fehlerId: `${el.id}-err` })
  }
  // Reihenfolge wie im Dokument (Zusammenfassung, erstes fehlerhaftes Feld)
  return aus.sort((a, b) => (a.wrapper.compareDocumentPosition(b.wrapper) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1))
}

/** Fehlermeldung einer Einheit ('' = gueltig) */
function meldung (e, t) {
  const eigen = e.ziel.getAttribute('data-error') || (e.gruppe && e.gruppe.getAttribute('data-error')) || ''
  if (e.gruppe) {
    if (!e.gruppe.hasAttribute('data-required')) return ''
    const n = e.gruppe.querySelectorAll('input[type="checkbox"]:checked').length
    return n ? '' : (eigen || t.auswahl)
  }
  const el = /** @type {HTMLInputElement} */ (e.ziel)
  const v = el.validity
  if (!v || v.valid) return ''
  if (v.valueMissing) {
    if (el.type === 'checkbox') return eigen || t.bestaetigen
    return eigen || t.fehlt.replace('@label', nameVon(el, t))
  }
  if (v.typeMismatch && el.type === 'email') return t.email
  if (v.typeMismatch && el.type === 'url') return t.url
  if (v.tooShort) return t.kurz.replace('@n', String(el.minLength))
  return eigen || t.sonst
}

export const form = {
  id: 'form',
  selektor: 'form[data-neo-form]',
  // Website-Bauteil: in Drupal nur per drupalSettings.neoBehaviors.nur
  nurAusdruecklich: true,
  /** @param {HTMLElement} wurzel @param {AbortSignal} signal */
  binde (wurzel, signal) {
    const formEl = /** @type {HTMLFormElement} */ (wurzel)
    const t = TEXTE[spracheVon(formEl)]
    const dok = formEl.ownerDocument
    const einheiten = einheitenVon(formEl)
    if (!einheiten.length) return
    /** @type {Set<Einheit>} */
    const fehlerhaft = new Set()
    const angelegt = []

    /** Fehlertext setzen bzw. entfernen @param {Einheit} e @param {string} text */
    function zeige (e, text) {
      let p = /** @type {HTMLElement|null} */ (dok.getElementById(e.fehlerId))
      if (text) {
        if (!p) {
          p = dok.createElement('p')
          p.className = 'nc-form-error'
          p.id = e.fehlerId
          e.wrapper.appendChild(p)
          angelegt.push(p)
        }
        p.textContent = text
        e.wrapper.classList.add('nc-form-field--invalid')
        e.ziel.setAttribute('aria-invalid', 'true')
        beschreibe(e.ziel, e.fehlerId, true)
        fehlerhaft.add(e)
      } else {
        if (p) p.remove()
        e.wrapper.classList.remove('nc-form-field--invalid')
        e.ziel.removeAttribute('aria-invalid')
        beschreibe(e.ziel, e.fehlerId, false)
        fehlerhaft.delete(e)
      }
    }

    /** @param {Einheit} e */
    const pruefe = (e) => { const m = meldung(e, t); zeige(e, m); return m }

    /** Einheit zu einem Element */
    const einheitVon = (/** @type {EventTarget|null} */ el) => {
      if (!el || /** @type {Node} */ (el).nodeType !== 1) return null
      const knoten = /** @type {Node} */ (el)
      return einheiten.find((e) => (e.gruppe ? e.gruppe.contains(knoten) : e.ziel === knoten)) || null
    }

    // Verlassen: pruefen — bei Gruppen erst, wenn der Fokus die Gruppe verlaesst
    formEl.addEventListener('focusout', (ev) => {
      const e = einheitVon(ev.target)
      if (!e) return
      const naechst = /** @type {Node|null} */ (ev.relatedTarget)
      if (e.gruppe && naechst && e.gruppe.contains(naechst)) return
      pruefe(e)
    }, { signal })

    // Live, solange fehlerhaft (Kaestchen: sofort bei change)
    const live = (ev) => {
      const e = einheitVon(ev.target)
      if (!e) return
      const kaestchen = /** @type {HTMLInputElement} */ (ev.target).type === 'checkbox'
      if (fehlerhaft.has(e) || (kaestchen && !e.gruppe)) pruefe(e)
    }
    formEl.addEventListener('input', live, { signal })
    formEl.addEventListener('change', live, { signal })

    // Zusammenfassung: vorhanden (Twig) oder anlegen
    let box = /** @type {HTMLElement|null} */ (formEl.querySelector(':scope > .nc-validation-summary'))
    let boxAngelegt = false
    function zusammenfassung (liste) {
      if (!box) {
        box = dok.createElement('div')
        box.className = 'nc-validation-summary nc-validation-summary--hidden'
        formEl.insertBefore(box, formEl.firstChild)
        boxAngelegt = true
      }
      const b = box
      if (!b.id) b.id = `nc-validation-summary-${++zaehler}`
      b.setAttribute('role', 'alert')
      b.setAttribute('tabindex', '-1')
      b.setAttribute('aria-labelledby', `${b.id}-titel`)
      const titel = liste.length === 1 ? t.titelEins : t.titelViele.replace('@count', String(liste.length))
      // Aufbau wie data/markup/validation-summary.html (Recipe validation-summary)
      b.innerHTML = '<span class="nc-validation-summary__icon" aria-hidden="true">' + KREUZ + '</span>'
      const inhalt = dok.createElement('div')
      const kopf = dok.createElement('strong')
      kopf.className = 'nc-validation-summary__title'
      kopf.id = `${b.id}-titel`
      kopf.textContent = titel
      const ul = dok.createElement('ul')
      ul.className = 'nc-validation-summary__list'
      for (const { e, text } of liste) {
        const li = dok.createElement('li')
        li.className = 'nc-validation-summary__item'
        const a = dok.createElement('a')
        a.href = `#${e.ziel.id || e.wrapper.id}`
        a.textContent = text
        li.appendChild(a)
        ul.appendChild(li)
      }
      inhalt.append(kopf, ul)
      b.appendChild(inhalt)
      b.classList.toggle('nc-validation-summary--hidden', !liste.length)
      if (!liste.length) b.removeAttribute('role')
    }

    // Link der Zusammenfassung: Feld fokussieren (statt nur zu springen)
    formEl.addEventListener('click', (ev) => {
      const a = /** @type {HTMLElement} */ (ev.target).closest?.('.nc-validation-summary a[href^="#"]')
      if (!a) return
      const ziel = dok.getElementById(a.getAttribute('href').slice(1))
      if (!ziel) return
      ev.preventDefault()
      const fokus = /** @type {HTMLElement} */ (ziel.matches('fieldset') ? ziel.querySelector('input') : ziel)
      fokus?.focus()
    }, { signal })

    formEl.addEventListener('submit', (ev) => {
      const liste = []
      for (const e of einheiten) {
        const text = pruefe(e)
        if (text) liste.push({ e, text })
      }
      if (liste.length) {
        ev.preventDefault()
        zusammenfassung(liste)
        formEl.dispatchEvent(new CustomEvent('form-submit', { bubbles: true, cancelable: true, detail: { valid: false, errors: liste.length } }))
        box?.focus()
        return
      }
      if (box) zusammenfassung([])
      const weiter = formEl.dispatchEvent(new CustomEvent('form-submit', { bubbles: true, cancelable: true, detail: { valid: true, errors: 0 } }))
      if (!weiter) ev.preventDefault()
    }, { signal })

    signal.addEventListener('abort', () => {
      for (const e of [...fehlerhaft]) zeige(e, '')
      for (const p of angelegt) p.remove()
      if (box && boxAngelegt) box.remove()
      else if (box) { box.innerHTML = ''; box.classList.add('nc-validation-summary--hidden'); box.removeAttribute('role') }
    })
  }
}
