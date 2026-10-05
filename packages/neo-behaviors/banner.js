// @ts-check
// ==========================================================================
// Banner — nach data/banner-recipe.json (keyboard, events, domNotes)
// ==========================================================================
//   Schliessen   Knopf .nc-banner__close: Hoehe als --_banner-height merken,
//                .is-dismissing (Einklapp-Animation des DS, bei reduzierter
//                Bewegung sofort), danach aus dem Dokument. Lag der Fokus
//                auf dem Knopf, geht er zum naechsten Bedienelement.
//   Merken       mit data-banner-id bleibt ein geschlossenes Banner auch beim
//                naechsten Seitenaufruf weg (localStorage
//                'neo-banner:<id>'); beim Binden wird es dann verborgen
//                ([hidden]).
//   Platz        .nc-banner--fixed liegt ueber dem Inhalt: das Elternelement
//                bekommt oben zusaetzlich die Hoehe des Banners als
//                Innenabstand (Recipe: layout-shift-prevention), beim
//                Schliessen und Abbinden wieder den alten Wert. In Drupal ist
//                das Elternelement <body> (Banner zuerst im DOM, Recipe a11y).
//
// Ereignis `banner-dismiss` { reason, id } (reason: 'close'; id: der Wert
// von data-banner-id oder null).
// ==========================================================================
import { sende } from './kern.js'
import { ausblenden, fokusWeiter, merkeHoehe } from './_meldung.js'

const SCHLUESSEL = (id) => `neo-banner:${id}`

function speicher (dok) {
  try { return dok.defaultView?.localStorage || null } catch { return null }
}

export const banner = {
  id: 'banner',
  selektor: '.nc-banner',
  /** @param {HTMLElement} wurzel @param {AbortSignal} signal */
  binde (wurzel, signal) {
    const dok = wurzel.ownerDocument
    const id = wurzel.getAttribute('data-banner-id')
    const ablage = id ? speicher(dok) : null
    try {
      if (ablage && ablage.getItem(SCHLUESSEL(id)) === 'geschlossen') { wurzel.hidden = true; return }
    } catch { /* Speicher gesperrt: Banner zeigen */ }

    // -- Platz fuer das feste Banner ------------------------------------
    const eltern = wurzel.matches('.nc-banner--fixed') ? wurzel.parentElement : null
    const vorher = eltern ? eltern.style.paddingBlockStart : ''
    // Innenabstand, den das Elternelement ohne das Banner hat
    const basis = eltern ? (dok.defaultView?.getComputedStyle(eltern).paddingBlockStart || '0px') : '0px'
    const setzePlatz = () => {
      if (eltern) eltern.style.paddingBlockStart = `calc(${basis} + ${Math.ceil(wurzel.getBoundingClientRect().height)}px)`
    }
    const gibPlatzFrei = () => { if (eltern) eltern.style.paddingBlockStart = vorher }
    let beobachter = /** @type {ResizeObserver|null} */ (null)
    if (eltern) {
      setzePlatz()
      const RO = dok.defaultView?.ResizeObserver
      if (RO) { beobachter = new RO(setzePlatz); beobachter.observe(wurzel) }
    }

    let zu = false
    wurzel.addEventListener('click', (e) => {
      const knopf = /** @type {HTMLElement} */ (e.target).closest('.nc-banner__close')
      if (!knopf || zu) return
      zu = true
      try { if (ablage) ablage.setItem(SCHLUESSEL(id), 'geschlossen') } catch { /* nur fuer diese Seite */ }
      sende(wurzel, 'banner-dismiss', { reason: 'close', id })
      fokusWeiter(wurzel)
      merkeHoehe(wurzel, '--_banner-height')
      beobachter?.disconnect()
      ausblenden(wurzel, 'is-dismissing', () => { gibPlatzFrei(); wurzel.remove() })
    }, { signal })

    signal.addEventListener('abort', () => {
      beobachter?.disconnect()
      if (!zu) gibPlatzFrei()
    })
  }
}
