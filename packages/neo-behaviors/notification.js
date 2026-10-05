// @ts-check
// ==========================================================================
// Benachrichtigung — nach data/notification-recipe.json (keyboard, events)
// ==========================================================================
//   Schliessen   Knopf .nc-notification__close (nicht bei --permanent): Hoehe
//                als --_notification-height merken, .is-dismissing
//                (Einklapp-Animation des DS, bei reduzierter Bewegung
//                sofort), danach aus dem Dokument. Lag der Fokus auf dem
//                Knopf, geht er zum naechsten Bedienelement (z. B. die
//                naechste Benachrichtigung der Liste).
//   Gelesen      eine ungelesene Benachrichtigung (--unread) gilt als gelesen,
//                sobald man in ihr klickt oder eine Aktion ausloest (Enter auf
//                Link/Knopf): --unread und der Punkt (__unread) fallen weg,
//                das Praefix „Ungelesen:" verschwindet aus aria-label.
//                Speichern (localStorage oder API) macht das Programm auf das
//                Ereignis hin.
//
// Ereignisse `notification-dismiss` { reason } (reason: 'close') und
// `notification-read` (ohne detail).
// ==========================================================================
import { sende } from './kern.js'
import { ausblenden, fokusWeiter, merkeHoehe } from './_meldung.js'

const PRAEFIX = /^\s*Ungelesen:\s*/i

export const notification = {
  id: 'notification',
  selektor: '.nc-notification',
  /** @param {HTMLElement} wurzel @param {AbortSignal} signal */
  binde (wurzel, signal) {
    let zu = false

    const gelesen = () => {
      if (!wurzel.classList.contains('nc-notification--unread')) return
      wurzel.classList.remove('nc-notification--unread')
      wurzel.querySelector('.nc-notification__unread')?.remove()
      const name = wurzel.getAttribute('aria-label')
      if (name && PRAEFIX.test(name)) wurzel.setAttribute('aria-label', name.replace(PRAEFIX, ''))
      sende(wurzel, 'notification-read')
    }

    wurzel.addEventListener('click', (e) => {
      const knopf = /** @type {HTMLElement} */ (e.target).closest('.nc-notification__close')
      if (!knopf) { gelesen(); return }
      if (zu || wurzel.classList.contains('nc-notification--permanent')) return
      zu = true
      sende(wurzel, 'notification-dismiss', { reason: 'close' })
      fokusWeiter(wurzel)
      merkeHoehe(wurzel, '--_notification-height')
      ausblenden(wurzel, 'is-dismissing', () => wurzel.remove())
    }, { signal })
  }
}
