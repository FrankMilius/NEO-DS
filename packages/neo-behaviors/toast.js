// @ts-check
// ==========================================================================
// Toast — nach data/toast-recipe.json (keyboard, events)
// ==========================================================================
// Bindet an fertiges Markup (.nc-toast, meist in einem .nc-toaster mit
// aria-live). Toasts erzeugt das Programm bzw. Drupal; das Behavior gibt
// ihnen das Verhalten aus dem Recipe:
//
//   Schliessen   Knopf .nc-toast__close, Escape (der Toast mit dem Fokus,
//                sonst der neueste — nicht, solange ein modaler Dialog offen
//                ist), Wischen (Touch/Stift, waagrecht ab
//                --nc-toast-swipe-threshold, Standard 100 px). Danach
//                .is-leaving (Animation des DS) und aus dem Dokument; lag der
//                Fokus im Toast, geht er zum naechsten Bedienelement.
//   Aktion       .nc-toast__action meldet `toast-action` { action } (Wert aus
//                data-action, mit data-undo 'undo', sonst der Knopftext) und
//                schliesst den Toast.
//   Auto-Aus     nur mit data-duration (ms; ohne Wert oder 'auto' = Token
//                --nc-toast-auto-dismiss-duration). Ohne Angabe bleibt der
//                Toast, bis man ihn schliesst (WCAG 2.2.1). Toasts mit Aktion
//                laufen mindestens 10 s (Recipe: extended-timeout). Der Timer
//                haelt an, solange Maus oder Fokus im Toast sind (wie der
//                Fortschrittsbalken per CSS) und solange die Seite verborgen
//                ist; danach laeuft die Restzeit weiter.
//                Fehler und Warnung (.nc-toast--error, .nc-toast--warning)
//                bleiben stehen: data-duration wird ignoriert, kein Timer,
//                kein 'timeout' (Entscheidung 05.10.2026) — wer die Meldung
//                verpasst, soll sie noch lesen koennen.
//   Balken       .nc-toast__progress laeuft ueber die Dauer ab (Animation
//                nc-toast-progress des DS). Gesetzt werden nur Name, Dauer,
//                Verlauf und Fuellmodus — NICHT die Kurzform `animation`,
//                die als Inline-Stil das Anhalten per :hover/:focus-within
//                des SCSS ueberstimmen wuerde. Bei einem stehenden Toast
//                (Fehler/Warnung mit data-duration) ist der Balken [hidden]:
//                er zeigte einen Ablauf an, den es nicht gibt (ohne Animation
//                haette er ohnehin keine Breite).
//   Warteschlange im .nc-toaster hoechstens --nc-toast-max-visible (Standard
//                3) offene Toasts; der aelteste geht (reason 'queue').
//   Eintritt     .is-entering faellt nach der Animation weg.
//
// Ereignisse `toast-dismiss` { reason } — 'close', 'escape', 'timeout',
// 'swipe', 'action', 'queue' — und `toast-action` { action }.
// ==========================================================================
import { sende } from './kern.js'
import { ausblenden, fokusWeiter } from './_meldung.js'

const MIT_AKTION_MINDESTENS = 10000
const STANDARD_DAUER = 5000
/** Varianten, die nie von selbst gehen (Entscheidung 05.10.2026). */
const STEHEND = '.nc-toast--error, .nc-toast--warning'

/** Offene Toasts in Bindungs-Reihenfolge (der letzte ist der neueste). */
const OFFEN = new Set()

/** Wert eines DS-Tokens in ms ('5000ms', '5s', '5000'). */
function zeitwert (text, ersatz) {
  const t = String(text || '').trim()
  if (!t) return ersatz
  const zahl = parseFloat(t)
  if (Number.isNaN(zahl)) return ersatz
  return t.endsWith('ms') || !t.endsWith('s') ? zahl : zahl * 1000
}

function token (el, name) {
  return el.ownerDocument.defaultView?.getComputedStyle(el).getPropertyValue(name) || ''
}

/** @param {HTMLElement} wurzel */
function dauerAus (wurzel) {
  if (!wurzel.hasAttribute('data-duration') || wurzel.matches(STEHEND)) return 0
  const roh = wurzel.getAttribute('data-duration') || ''
  let dauer = roh === '' || roh === 'auto'
    ? zeitwert(token(wurzel, '--nc-toast-auto-dismiss-duration'), STANDARD_DAUER)
    : zeitwert(roh, 0)
  if (dauer > 0 && wurzel.querySelector('.nc-toast__action')) dauer = Math.max(dauer, MIT_AKTION_MINDESTENS)
  return dauer > 0 ? dauer : 0
}

/** @param {HTMLElement} knopf */
function aktionsWert (knopf) {
  if (knopf.dataset.action) return knopf.dataset.action
  if (knopf.hasAttribute('data-undo')) return 'undo'
  return (knopf.textContent || '').trim()
}

export const toast = {
  id: 'toast',
  selektor: '.nc-toast',
  /** @param {HTMLElement} wurzel @param {AbortSignal} signal */
  binde (wurzel, signal) {
    const dok = wurzel.ownerDocument
    // Eigene Steuerung: ein geschlossener Toast loest seine Dokument-
    // Ereignisse selbst, auch wenn niemand abbindet (Toasts kommen und gehen).
    const intern = new AbortController()
    signal.addEventListener('abort', () => intern.abort(), { once: true })
    const sig = intern.signal

    const balken = /** @type {HTMLElement|null} */ (wurzel.querySelector(':scope > .nc-toast__progress'))
    const dauer = dauerAus(wurzel)
    let rest = dauer
    let start = 0
    let uhr = 0
    let zu = false
    const halt = new Set() // 'maus', 'fokus', 'verborgen', 'wischen'

    OFFEN.add(wurzel)

    const laufe = () => {
      if (!dauer || zu || halt.size || uhr) return
      start = Date.now()
      uhr = setTimeout(() => schliesse('timeout'), rest)
      if (balken) balken.style.animationPlayState = ''
    }
    const pausiere = () => {
      if (!uhr) return
      clearTimeout(uhr)
      uhr = 0
      rest = Math.max(0, rest - (Date.now() - start))
    }
    const halte = (grund, an) => {
      if (an) { halt.add(grund); pausiere() } else { halt.delete(grund); laufe() }
      // Verborgene Seite haelt auch den Balken an (Maus/Fokus macht das CSS)
      if (balken && grund === 'verborgen') balken.style.animationPlayState = an ? 'paused' : ''
    }

    const schliesse = (reason) => {
      if (zu) return
      zu = true
      pausiere()
      OFFEN.delete(wurzel)
      sende(wurzel, 'toast-dismiss', { reason })
      fokusWeiter(wurzel)
      ausblenden(wurzel, 'is-leaving', () => { wurzel.remove(); intern.abort() })
    }

    // -- Balken ---------------------------------------------------------
    // Stehender Toast trotz data-duration: kein Ablauf, also kein Balken
    const balkenWeg = Boolean(balken && !dauer && !balken.hidden && wurzel.hasAttribute('data-duration') && wurzel.matches(STEHEND))
    if (balken && balkenWeg) balken.hidden = true
    if (balken && dauer) {
      balken.style.animationName = 'nc-toast-progress'
      balken.style.animationDuration = `${dauer}ms`
      balken.style.animationTimingFunction = 'linear'
      balken.style.animationFillMode = 'forwards'
    }

    // -- Eintritt -------------------------------------------------------
    if (wurzel.classList.contains('is-entering')) {
      ausblenden(wurzel, 'is-entering', () => wurzel.classList.remove('is-entering'))
    }

    // -- Knoepfe --------------------------------------------------------
    wurzel.addEventListener('click', (e) => {
      const ziel = /** @type {HTMLElement} */ (e.target)
      if (ziel.closest('.nc-toast__close')) { schliesse('close'); return }
      const aktion = /** @type {HTMLElement|null} */ (ziel.closest('.nc-toast__action'))
      if (aktion) {
        sende(wurzel, 'toast-action', { action: aktionsWert(aktion) })
        schliesse('action')
      }
    }, { signal: sig })

    // -- Anhalten: Maus, Fokus, verborgene Seite --------------------------
    wurzel.addEventListener('mouseenter', () => halte('maus', true), { signal: sig })
    wurzel.addEventListener('mouseleave', () => halte('maus', false), { signal: sig })
    wurzel.addEventListener('focusin', () => halte('fokus', true), { signal: sig })
    wurzel.addEventListener('focusout', (e) => {
      const nach = /** @type {Node|null} */ (e.relatedTarget)
      if (!nach || !wurzel.contains(nach)) halte('fokus', false)
    }, { signal: sig })
    dok.addEventListener('visibilitychange', () => halte('verborgen', dok.visibilityState === 'hidden'), { signal: sig })

    // -- Escape ---------------------------------------------------------
    dok.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape' || zu || e.defaultPrevented) return
      const aktiv = dok.activeElement
      const mitFokus = [...OFFEN].find((t) => t.contains(aktiv))
      // Ein offener modaler Dialog bekommt Escape zuerst (er schliesst nativ)
      if (!mitFokus && dok.querySelector('dialog[open]')) return
      const neuester = [...OFFEN].filter((t) => t.ownerDocument === dok && t.isConnected).at(-1)
      if ((mitFokus || neuester) !== wurzel) return
      e.preventDefault()
      schliesse('escape')
    }, { signal: sig })

    // -- Wischen (Touch/Stift) --------------------------------------------
    let wisch = /** @type {{ id: number, x: number, dx: number }|null} */ (null)
    const schwelle = () => parseFloat(token(wurzel, '--nc-toast-swipe-threshold')) || 100
    const wischEnde = () => {
      wurzel.classList.remove('is-swiping')
      wurzel.removeAttribute('aria-busy')
      wurzel.style.removeProperty('--_toast-swipe-opacity')
    }
    wurzel.addEventListener('pointerdown', (/** @type {PointerEvent} */ e) => {
      if (zu || (e.pointerType !== 'touch' && e.pointerType !== 'pen')) return
      if (/** @type {HTMLElement} */ (e.target).closest('button, a, input, select, textarea')) return
      wisch = { id: e.pointerId, x: e.clientX, dx: 0 }
    }, { signal: sig })
    wurzel.addEventListener('pointermove', (/** @type {PointerEvent} */ e) => {
      if (!wisch || e.pointerId !== wisch.id) return
      wisch.dx = e.clientX - wisch.x
      if (!wurzel.classList.contains('is-swiping')) {
        if (Math.abs(wisch.dx) < 5) return
        wurzel.classList.add('is-swiping')
        // Waehrend der Geste keine Ansagen (Recipe a11y: aria-hidden-during-swipe)
        wurzel.setAttribute('aria-busy', 'true')
        halte('wischen', true)
      }
      wurzel.style.setProperty('--_toast-swipe-x', `${wisch.dx}px`)
      wurzel.style.setProperty('--_toast-swipe-opacity', String(Math.max(0.2, 1 - Math.abs(wisch.dx) / (schwelle() * 2))))
    }, { signal: sig })
    const loslassen = (/** @type {PointerEvent} */ e) => {
      if (!wisch || e.pointerId !== wisch.id) return
      const { dx } = wisch
      wisch = null
      if (!wurzel.classList.contains('is-swiping')) return
      wischEnde()
      if (Math.abs(dx) >= schwelle() && e.type === 'pointerup') {
        zu = true
        pausiere()
        OFFEN.delete(wurzel)
        wurzel.style.setProperty('--_toast-swipe-x', `${Math.sign(dx) * 120}%`)
        sende(wurzel, 'toast-dismiss', { reason: 'swipe' })
        fokusWeiter(wurzel)
        // is-swipe-out ist eine Transition des DS (200 ms), keine Animation
        wurzel.classList.add('is-swipe-out')
        const weg = () => { if (wurzel.isConnected) wurzel.remove(); intern.abort() }
        wurzel.addEventListener('transitionend', weg, { once: true })
        setTimeout(weg, 250)
        return
      }
      wurzel.style.removeProperty('--_toast-swipe-x')
      halte('wischen', false)
    }
    wurzel.addEventListener('pointerup', loslassen, { signal: sig })
    wurzel.addEventListener('pointercancel', loslassen, { signal: sig })

    // -- Warteschlange --------------------------------------------------
    const toaster = wurzel.parentElement?.classList.contains('nc-toaster') ? wurzel.parentElement : null
    if (toaster) {
      const hoechstens = parseInt(token(toaster, '--nc-toast-max-visible'), 10) || 3
      const offene = [...toaster.children].filter((k) => OFFEN.has(k))
      for (const alt of offene.slice(0, Math.max(0, offene.length - hoechstens))) {
        alt.dispatchEvent(new CustomEvent('neo-toast-queue'))
      }
    }
    wurzel.addEventListener('neo-toast-queue', () => schliesse('queue'), { signal: sig })

    laufe()

    // Abbinden: Timer und Inline-Werte zuruecknehmen, der Toast bleibt stehen
    sig.addEventListener('abort', () => {
      clearTimeout(uhr)
      OFFEN.delete(wurzel)
      if (zu) return
      wischEnde()
      wurzel.style.removeProperty('--_toast-swipe-x')
      if (balken) {
        if (balkenWeg) balken.hidden = false
        for (const p of ['animation-name', 'animation-duration', 'animation-timing-function', 'animation-fill-mode', 'animation-play-state']) balken.style.removeProperty(p)
      }
    })
  }
}
