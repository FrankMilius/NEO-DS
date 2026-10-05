/**
 * neo-behaviors, Block Rueckmeldung (Plan v3, Phase 3): Toast, Alert, Banner,
 * Benachrichtigung. Gebunden wird an genau das Markup, das die Arena im Modus
 * „Ausprobieren" aus dem Recipe baut (src/arena-templates, m.ausprobieren);
 * jede Taste aus `keyboard` wird geprueft, jedes Ereignis gegen `events`.
 *
 * jsdom laedt styles.css nicht: es gibt keine Animation, Schliessen entfernt
 * sofort (wie bei prefers-reduced-motion). Das Warten auf animationend prueft
 * der Test fuer _meldung.js mit einer gesetzten Animationsdauer.
 */
import { describe, it, expect, afterEach, vi } from 'vitest'
import { anbinden, abbinden } from 'neo-behaviors'
import { lebendigesMarkup, buehne, taste, deckeTastenAb, sammle, passtZumRecipe } from './_helfer.js'
import { ausblenden, fokusWeiter } from '../../../../packages/neo-behaviors/_meldung.js'

afterEach(() => {
  document.body.innerHTML = ''
  vi.useRealTimers()
  try { localStorage.clear() } catch { /* jsdom ohne Speicher */ }
})

const aktiv = () => document.activeElement

/** Zeiger-Ereignis (jsdom kennt PointerEvent nicht ueberall). */
function zeiger (el, typ, x, art = 'touch') {
  const e = new MouseEvent(typ, { bubbles: true, cancelable: true, clientX: x })
  Object.defineProperty(e, 'pointerType', { value: art })
  Object.defineProperty(e, 'pointerId', { value: 1 })
  el.dispatchEvent(e)
}

// ---------------------------------------------------------------------------
describe('Toast (toast-recipe.json)', () => {
  function aufbau (specimen, vorher = '') {
    const b = buehne(`${vorher}${lebendigesMarkup('toast', specimen)}<button type="button" id="danach">danach</button>`)
    const ev = sammle(document, 'toast-dismiss')
    anbinden(b, ['toast'])
    return { b, ev, toasts: () => [...b.querySelectorAll('.nc-toaster .nc-toast')] }
  }

  it('jede Taste aus dem Recipe hat eine Pruefung', () => {
    deckeTastenAb('toast', {
      Escape: 'Escape schliesst den Toast mit Fokus, sonst den neuesten',
      Tab: 'Fokus im Toast haelt den Timer an'
    })
  })

  it('Schliessen-Knopf: toast-dismiss { reason: close }, Toast weg, Fokus zum naechsten Bedienelement', () => {
    const { b, ev, toasts } = aufbau('stacked')
    expect(toasts()).toHaveLength(3)
    const [erster, zweiter] = toasts()
    const knopf = erster.querySelector('.nc-toast__close')
    knopf.focus()
    knopf.click()
    expect(erster.isConnected).toBe(false)
    expect(toasts()).toHaveLength(2)
    expect(aktiv()).toBe(zweiter.querySelector('.nc-toast__close'))
    expect(ev.map((e) => e.detail)).toEqual([{ reason: 'close' }])
    passtZumRecipe('toast', ev[0])
    expect(b.querySelector('[data-ra-erneut]')).not.toBeNull()
  })

  it('Escape schliesst den neuesten Toast; mit Fokus in einem Toast genau diesen', () => {
    const { ev, toasts } = aufbau('stacked')
    const [erster, , dritter] = toasts()
    taste(document.body, 'Escape')
    expect(dritter.isConnected).toBe(false)
    erster.querySelector('.nc-toast__close').focus()
    taste(aktiv(), 'Escape')
    expect(erster.isConnected).toBe(false)
    expect(toasts()).toHaveLength(1)
    expect(ev.map((e) => e.detail.reason)).toEqual(['escape', 'escape'])
    for (const e of ev) passtZumRecipe('toast', e)
  })

  it('Escape gehoert einem offenen modalen Dialog (Toast bleibt), ausser der Fokus liegt im Toast', () => {
    const { toasts } = aufbau('stacked', '<dialog open><button type="button">im Dialog</button></dialog>')
    taste(document.body, 'Escape')
    expect(toasts()).toHaveLength(3)
    toasts()[0].querySelector('.nc-toast__close').focus()
    taste(aktiv(), 'Escape')
    expect(toasts()).toHaveLength(2)
  })

  it('Aktion: toast-action { action } (data-undo = undo), danach schliesst der Toast mit reason action', () => {
    const { b, ev } = aufbau('undo-action')
    const toast = b.querySelector('.nc-toast')
    const aktionen = sammle(document, 'toast-action')
    toast.querySelector('.nc-toast__action').click()
    expect(aktionen.map((e) => e.detail)).toEqual([{ action: 'undo' }])
    passtZumRecipe('toast', aktionen[0])
    expect(ev.map((e) => e.detail)).toEqual([{ reason: 'action' }])
    expect(toast.isConnected).toBe(false)
  })

  it('Aktion ohne data-undo meldet den Knopftext bzw. data-action', () => {
    const { b } = aufbau('with-action')
    const knopf = b.querySelector('.nc-toast__action')
    const aktionen = sammle(document, 'toast-action')
    knopf.click()
    expect(aktionen[0].detail).toEqual({ action: 'Ansehen' })
    document.body.innerHTML = ''
    const c = aufbau('with-action').b
    c.querySelector('.nc-toast__action').dataset.action = 'oeffnen'
    const z = sammle(document, 'toast-action')
    c.querySelector('.nc-toast__action').click()
    expect(z[0].detail).toEqual({ action: 'oeffnen' })
  })

  it('Auto-Ausblenden nur mit data-duration: Balken laeuft per Einzel-Eigenschaften, nach der Zeit reason timeout', () => {
    vi.useFakeTimers()
    const { b, ev } = aufbau('with-progress')
    const toast = b.querySelector('.nc-toast')
    expect(toast.dataset.duration).toBe('6000')
    const balken = toast.querySelector('.nc-toast__progress')
    expect(balken.style.animationName).toBe('nc-toast-progress')
    expect(balken.style.animationDuration).toBe('6000ms')
    expect(balken.style.animationTimingFunction).toBe('linear')
    expect(balken.style.animationFillMode).toBe('forwards')
    // keine Kurzform: animation-play-state bleibt dem :hover/:focus-within des SCSS
    expect(balken.style.animationPlayState).toBe('')
    vi.advanceTimersByTime(5999)
    expect(toast.isConnected).toBe(true)
    vi.advanceTimersByTime(1)
    expect(toast.isConnected).toBe(false)
    expect(ev.map((e) => e.detail)).toEqual([{ reason: 'timeout' }])
  })

  it('ohne data-duration bleibt der Toast (WCAG 2.2.1)', () => {
    vi.useFakeTimers()
    const { b } = aufbau('severity-variants')
    vi.advanceTimersByTime(120000)
    expect(b.querySelector('.nc-toast').isConnected).toBe(true)
  })

  it('data-duration ohne Wert: Dauer aus dem Token (Standard 5 s); mit Aktion mindestens 10 s', () => {
    vi.useFakeTimers()
    const b = buehne(`<div class="nc-toaster"><div class="nc-toast" role="status" data-duration><div class="nc-toast__content"><p class="nc-toast__title">A</p></div></div>
<div class="nc-toast" role="status" data-duration="3000"><div class="nc-toast__content"><p class="nc-toast__title">B</p></div><button type="button" class="nc-toast__action">Rückgängig</button></div></div>`)
    anbinden(b, ['toast'])
    const [a, mitAktion] = b.querySelectorAll('.nc-toast')
    vi.advanceTimersByTime(5000)
    expect(a.isConnected).toBe(false)
    expect(mitAktion.isConnected).toBe(true)
    vi.advanceTimersByTime(4999)
    expect(mitAktion.isConnected).toBe(true)
    vi.advanceTimersByTime(1)
    expect(mitAktion.isConnected).toBe(false)
  })

  it('Maus und Fokus (Tab) halten den Timer an, danach laeuft die Restzeit', () => {
    vi.useFakeTimers()
    const { b } = aufbau('with-progress')
    const toast = b.querySelector('.nc-toast')
    vi.advanceTimersByTime(2000)
    toast.dispatchEvent(new MouseEvent('mouseenter'))
    vi.advanceTimersByTime(30000)
    expect(toast.isConnected).toBe(true)
    toast.dispatchEvent(new MouseEvent('mouseleave'))
    // Tab auf den Schliessen-Knopf: Fokus im Toast
    toast.querySelector('.nc-toast__close').focus()
    vi.advanceTimersByTime(30000)
    expect(toast.isConnected).toBe(true)
    document.getElementById('danach').focus()
    vi.advanceTimersByTime(3999)
    expect(toast.isConnected).toBe(true)
    vi.advanceTimersByTime(1)
    expect(toast.isConnected).toBe(false)
  })

  it('verborgene Seite haelt Timer und Balken an', () => {
    vi.useFakeTimers()
    const { b } = aufbau('with-progress')
    const toast = b.querySelector('.nc-toast')
    const balken = toast.querySelector('.nc-toast__progress')
    const sichtbar = (wert) => {
      Object.defineProperty(document, 'visibilityState', { value: wert, configurable: true })
      document.dispatchEvent(new Event('visibilitychange'))
    }
    sichtbar('hidden')
    expect(balken.style.animationPlayState).toBe('paused')
    vi.advanceTimersByTime(60000)
    expect(toast.isConnected).toBe(true)
    sichtbar('visible')
    expect(balken.style.animationPlayState).toBe('')
    vi.advanceTimersByTime(6000)
    expect(toast.isConnected).toBe(false)
    delete document.visibilityState
  })

  it('Warteschlange: mehr als --nc-toast-max-visible (3) — der aelteste geht mit reason queue', () => {
    const { ev, toasts } = aufbau('queue-limit')
    expect(toasts()).toHaveLength(3)
    expect(toasts()[0].classList.contains('nc-toast--success')).toBe(true)
    expect(ev.map((e) => e.detail)).toEqual([{ reason: 'queue' }])
  })

  it('Wischen (Touch): ab der Schwelle weg (reason swipe), darunter zurueck; Maus wischt nicht', () => {
    vi.useFakeTimers()
    const { b, ev } = aufbau('swipe-dismiss')
    const toast = b.querySelector('.nc-toast')
    const inhalt = toast.querySelector('.nc-toast__content')
    zeiger(inhalt, 'pointerdown', 0)
    zeiger(inhalt, 'pointermove', 40)
    expect(toast.classList.contains('is-swiping')).toBe(true)
    expect(toast.getAttribute('aria-busy')).toBe('true')
    expect(toast.style.getPropertyValue('--_toast-swipe-x')).toBe('40px')
    zeiger(inhalt, 'pointerup', 40)
    expect(toast.classList.contains('is-swiping')).toBe(false)
    expect(toast.hasAttribute('aria-busy')).toBe(false)
    expect(toast.style.getPropertyValue('--_toast-swipe-x')).toBe('')
    zeiger(inhalt, 'pointerdown', 0, 'mouse')
    zeiger(inhalt, 'pointermove', 200, 'mouse')
    expect(toast.classList.contains('is-swiping')).toBe(false)
    zeiger(inhalt, 'pointerdown', 0)
    zeiger(inhalt, 'pointermove', 150)
    zeiger(inhalt, 'pointerup', 150)
    expect(toast.classList.contains('is-swipe-out')).toBe(true)
    expect(ev.map((e) => e.detail)).toEqual([{ reason: 'swipe' }])
    vi.advanceTimersByTime(250)
    expect(toast.isConnected).toBe(false)
  })

  it('Abbinden: Timer aus, Balken ohne Inline-Werte, Toast bleibt', () => {
    vi.useFakeTimers()
    const { b } = aufbau('with-progress')
    const toast = b.querySelector('.nc-toast')
    abbinden(b, ['toast'])
    expect(toast.hasAttribute('data-neo-behavior')).toBe(false)
    expect(toast.querySelector('.nc-toast__progress').getAttribute('style') || '').toBe('')
    vi.advanceTimersByTime(60000)
    expect(toast.isConnected).toBe(true)
  })

  it('geschlossener Toast loest seine Dokument-Ereignisse: Escape trifft danach den naechsten', () => {
    const { toasts, ev } = aufbau('stacked')
    toasts()[2].querySelector('.nc-toast__close').click()
    taste(document.body, 'Escape')
    expect(toasts()).toHaveLength(1)
    expect(ev.map((e) => e.detail.reason)).toEqual(['close', 'escape'])
  })
})

// ---------------------------------------------------------------------------
describe('Alert (alert-recipe.json)', () => {
  function aufbau (specimen = 'dismissible-variants') {
    const b = buehne(`${lebendigesMarkup('alert', specimen)}<button type="button" id="danach">danach</button>`)
    anbinden(b, ['alert'])
    return { b, alert: b.querySelector('.nc-alert') }
  }

  it('jede Taste aus dem Recipe hat eine Pruefung', () => {
    deckeTastenAb('alert', { Enter: 'Schliessen per Enter', Space: 'Schliessen per Leertaste' })
  })

  for (const t of ['Enter', 'Space']) {
    it(`${t} auf dem Schliessen-Knopf: alert-dismiss { reason: close }, Alert weg, Fokus weiter`, () => {
      const { alert } = aufbau()
      const ev = sammle(document, 'alert-dismiss')
      const knopf = alert.querySelector('.nc-alert__close')
      expect(knopf.getAttribute('aria-label')).toBeTruthy()
      knopf.focus()
      taste(knopf, t)
      expect(alert.isConnected).toBe(false)
      expect(aktiv().id).toBe('danach')
      expect(ev.map((e) => e.detail)).toEqual([{ reason: 'close' }])
      passtZumRecipe('alert', ev[0])
    })
  }

  it('ohne Schliessen-Knopf: nichts zu tun, Details klappen nativ', () => {
    const { alert } = aufbau('progressive-disclosure')
    alert.querySelector('summary').click()
    expect(alert.isConnected).toBe(true)
    expect(alert.querySelector('details').open).toBe(true)
  })
})

// ---------------------------------------------------------------------------
describe('Banner (banner-recipe.json)', () => {
  function aufbau (specimen = 'dismissible') {
    const b = buehne(`${lebendigesMarkup('banner', specimen)}<button type="button" id="danach">danach</button>`)
    anbinden(b, ['banner'])
    return { b, banner: b.querySelector('.nc-banner') }
  }

  it('jede Taste aus dem Recipe hat eine Pruefung', () => {
    deckeTastenAb('banner', { Enter: 'Schliessen per Enter', Space: 'Schliessen per Leertaste' })
  })

  for (const t of ['Enter', 'Space']) {
    it(`${t} auf dem Schliessen-Knopf: is-dismissing, banner-dismiss { reason, id }, Banner weg, Fokus weiter`, () => {
      const { banner } = aufbau()
      const ev = sammle(document, 'banner-dismiss')
      const knopf = banner.querySelector('.nc-banner__close')
      expect(knopf.getAttribute('aria-label')).toBe('Banner schließen')
      knopf.focus()
      taste(knopf, t)
      expect(banner.classList.contains('is-dismissing')).toBe(true)
      expect(banner.isConnected).toBe(false)
      expect(aktiv().id).toBe('danach')
      expect(ev.map((e) => e.detail)).toEqual([{ reason: 'close', id: null }])
      passtZumRecipe('banner', ev[0])
    })
  }

  it('data-banner-id: geschlossen gemerkt (localStorage), beim naechsten Binden [hidden]', () => {
    const html = lebendigesMarkup('banner', 'dismissible').replace('class="nc-banner', 'data-banner-id="wartung-26" class="nc-banner')
    const b = buehne(html)
    anbinden(b, ['banner'])
    const ev = sammle(document, 'banner-dismiss')
    b.querySelector('.nc-banner__close').click()
    expect(ev[0].detail).toEqual({ reason: 'close', id: 'wartung-26' })
    expect(localStorage.getItem('neo-banner:wartung-26')).toBe('geschlossen')
    document.body.innerHTML = ''
    const c = buehne(html)
    anbinden(c, ['banner'])
    expect(c.querySelector('.nc-banner').hidden).toBe(true)
  })

  it('--fixed: Elternelement bekommt oben Platz, beim Schliessen und Abbinden den alten Wert', () => {
    const b = buehne(lebendigesMarkup('banner', 'danger-alert'))
    const rahmen = b.querySelector('[data-ra-ziel]')
    rahmen.style.paddingBlockStart = '3px'
    anbinden(b, ['banner'])
    expect(rahmen.style.paddingBlockStart).toMatch(/^calc\(/)
    abbinden(b, ['banner'])
    expect(rahmen.style.paddingBlockStart).toBe('3px')
    anbinden(b, ['banner'])
    expect(rahmen.style.paddingBlockStart).toMatch(/^calc\(/)
    rahmen.querySelector('.nc-banner__close').click()
    expect(rahmen.style.paddingBlockStart).toBe('3px')
    expect(rahmen.querySelector('.nc-banner')).toBeNull()
  })
})

// ---------------------------------------------------------------------------
describe('Benachrichtigung (notification-recipe.json)', () => {
  function aufbau (specimen = 'with-actions') {
    const b = buehne(`${lebendigesMarkup('notification', specimen)}<button type="button" id="danach">danach</button>`)
    anbinden(b, ['notification'])
    return { b, karte: b.querySelector('.nc-notification') }
  }

  it('jede Taste aus dem Recipe hat eine Pruefung', () => {
    deckeTastenAb('notification', {
      Tab: 'Reihenfolge Aktionen vor Schliessen',
      Enter: 'Aktion bzw. Schliessen',
      Space: 'wie Enter auf Knoepfen'
    })
  })

  it('Tab: Aktionen kommen vor dem Schliessen-Knopf (DOM-Reihenfolge)', () => {
    const { karte } = aufbau()
    const reihe = [...karte.querySelectorAll('a[href], button')].map((e) => e.className)
    expect(reihe).toEqual(['nc-notification__action', 'nc-notification__action', 'nc-notification__close'])
  })

  for (const t of ['Enter', 'Space']) {
    it(`${t} auf dem Schliessen-Knopf: is-dismissing, notification-dismiss, Karte weg, Fokus weiter`, () => {
      const { karte } = aufbau()
      const ev = sammle(document, 'notification-dismiss')
      const knopf = karte.querySelector('.nc-notification__close')
      expect(knopf.getAttribute('aria-label')).toBe('Benachrichtigung schließen')
      knopf.focus()
      taste(knopf, t)
      expect(karte.classList.contains('is-dismissing')).toBe(true)
      expect(karte.isConnected).toBe(false)
      expect(aktiv().id).toBe('danach')
      expect(ev.map((e) => e.detail)).toEqual([{ reason: 'close' }])
      passtZumRecipe('notification', ev[0])
    })
  }

  it('Gelesen: Klick bzw. Enter auf eine Aktion nimmt --unread, Punkt und Praefix weg (einmal notification-read)', () => {
    const { karte } = aufbau('unread-state')
    const ev = sammle(document, 'notification-read')
    expect(karte.getAttribute('aria-label')).toMatch(/^Ungelesen: /)
    karte.querySelector('.nc-notification__body').click()
    expect(karte.classList.contains('nc-notification--unread')).toBe(false)
    expect(karte.querySelector('.nc-notification__unread')).toBeNull()
    expect(karte.getAttribute('aria-label')).not.toMatch(/Ungelesen/)
    karte.click()
    expect(ev).toHaveLength(1)
    passtZumRecipe('notification', ev[0])
    // Enter auf einer Aktion (Knopf): loest den Klick aus → gelesen
    document.body.innerHTML = ''
    const b = buehne(lebendigesMarkup('notification', 'with-actions'))
    const k = b.querySelector('.nc-notification')
    k.classList.add('nc-notification--unread')
    anbinden(b, ['notification'])
    const ev2 = sammle(document, 'notification-read')
    taste(k.querySelector('button.nc-notification__action'), 'Enter')
    expect(ev2).toHaveLength(1)
    expect(k.isConnected).toBe(true)
  })

  it('--permanent: kein Schliessen-Knopf im Markup; ein Knopf darin schliesst trotzdem nicht', () => {
    const { karte } = aufbau('permanent')
    expect(karte.querySelector('.nc-notification__close')).toBeNull()
    karte.insertAdjacentHTML('beforeend', '<button type="button" class="nc-notification__close" aria-label="x">x</button>')
    karte.querySelector('.nc-notification__close').click()
    expect(karte.isConnected).toBe(true)
  })
})

// ---------------------------------------------------------------------------
describe('_meldung.js: Ausblenden und Fokus', () => {
  it('wartet auf animationend, mit Zeitlimit; ohne Animation sofort', () => {
    vi.useFakeTimers()
    const el = buehne('<div class="x"></div>').firstElementChild
    const fertig = vi.fn()
    ausblenden(el, 'is-leaving', fertig)
    expect(el.classList.contains('is-leaving')).toBe(true)
    expect(fertig).toHaveBeenCalledTimes(1)

    el.style.animationName = 'nc-toast-slide-out-right'
    el.style.animationDuration = '300ms'
    const spaeter = vi.fn()
    ausblenden(el, 'is-dismissing', spaeter)
    expect(spaeter).not.toHaveBeenCalled()
    el.dispatchEvent(new Event('animationend'))
    expect(spaeter).toHaveBeenCalledTimes(1)
    vi.advanceTimersByTime(1000)
    expect(spaeter).toHaveBeenCalledTimes(1)

    const notfall = vi.fn()
    ausblenden(el, 'is-x', notfall)
    vi.advanceTimersByTime(399)
    expect(notfall).not.toHaveBeenCalled()
    vi.advanceTimersByTime(1)
    expect(notfall).toHaveBeenCalledTimes(1)
  })

  it('fokusWeiter: danach, sonst davor; ohne Fokus in der Meldung nichts', () => {
    const b = buehne('<button id="a">a</button><div id="m"><button id="x">x</button></div><button id="c">c</button>')
    const m = b.querySelector('#m')
    b.querySelector('#a').focus()
    fokusWeiter(m)
    expect(aktiv().id).toBe('a')
    b.querySelector('#x').focus()
    fokusWeiter(m)
    expect(aktiv().id).toBe('c')
    b.querySelector('#c').remove()
    b.querySelector('#x').focus()
    fokusWeiter(m)
    expect(aktiv().id).toBe('a')
  })
})
