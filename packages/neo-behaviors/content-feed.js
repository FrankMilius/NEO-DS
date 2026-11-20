// @ts-check
// ==========================================================================
// Content Feed — "load more" without leaving the page (I11 Phase 2, 19.11.2026)
// ==========================================================================
// Website component (block neo_content_feed, overview page). Without
// JavaScript "Mehr laden" is a plain link to the next page (?seite=2); the
// server renders that page completely. With this behavior a click fetches
// that page, takes the cards of the feed with the same id (else the first
// feed) and appends them to the list:
//
//   - focus moves to the first new card, the status line ([role="status"],
//     text from data-feed-geladen with {anzahl}) announces the count
//   - the link points to the next page of the answer; without one the
//     footer is removed (last page)
//   - while loading the link is aria-disabled and the list aria-busy; a
//     second click does nothing
//   - errors (network, HTTP status, page without cards) fall back to the
//     plain link: the browser opens the next page (navigiere)
//   - clicks with a modifier key or another button, and links without a
//     real target (empty or only #fragment), stay with the browser
//
// Markup contract (data/markup/content-feed.html): link [data-feed-more] in
// .nc-content-feed__footer, list .nc-content-feed__list, cards in
// .nc-content-feed__item. Event `content-feed-mehr` { anzahl, ende } at the
// root after appending. Unbinding removes the click handler.
// ==========================================================================
import { sende } from './kern.js'

export const contentFeed = {
  id: 'content-feed',
  selektor: '.nc-content-feed',
  // Website component: in Drupal only via drupalSettings.neoBehaviors.nur
  nurAusdruecklich: true,

  /**
   * Fallback: open the page like the plain link would.
   * @param {Window} ansicht @param {string} href
   */
  navigiere (ansicht, href) {
    ansicht.location.assign(href)
  },

  /** @param {HTMLElement} wurzel @param {AbortSignal} signal */
  binde (wurzel, signal) {
    const ansicht = /** @type {Window} */ (wurzel.ownerDocument.defaultView || window)
    let laedt = false

    wurzel.addEventListener('click', (e) => {
      const ziel = /** @type {Element} */ (e.target)
      const link = /** @type {HTMLAnchorElement|null} */ (ziel.closest?.('[data-feed-more]'))
      if (!link || !wurzel.contains(link)) return
      if (e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return
      // No next page behind a bare fragment (examples in docs): leave it to
      // the browser, otherwise the fallback would reload the current page.
      const href = link.getAttribute('href') || ''
      if (!href || href.startsWith('#')) return
      e.preventDefault()
      if (laedt) return
      laedt = true
      void lade(link, href).finally(() => { laedt = false })
    }, { signal })

    /** @param {HTMLAnchorElement} link @param {string} href */
    const lade = async (link, href) => {
      const liste = wurzel.querySelector('.nc-content-feed__list')
      link.setAttribute('aria-disabled', 'true')
      liste?.setAttribute('aria-busy', 'true')
      const ende = () => {
        link.removeAttribute('aria-disabled')
        liste?.removeAttribute('aria-busy')
      }
      try {
        const holen = /** @type {any} */ (ansicht).fetch || globalThis.fetch
        const antwort = await holen(href, { headers: { Accept: 'text/html' }, credentials: 'same-origin' })
        if (!antwort.ok) throw new Error(`HTTP ${antwort.status}`)
        const Leser = /** @type {any} */ (ansicht).DOMParser || globalThis.DOMParser
        const dok = new Leser().parseFromString(await antwort.text(), 'text/html')
        const quelle = (wurzel.id && dok.getElementById(wurzel.id)) || dok.querySelector('.nc-content-feed')
        const neu = quelle ? [...quelle.querySelectorAll('.nc-content-feed__item')] : []
        if (!liste || !neu.length) throw new Error('keine Karten')

        const angehaengt = neu.map((el) => {
          const kopie = /** @type {HTMLElement} */ (wurzel.ownerDocument.importNode(el, true))
          kopie.classList.remove('nc-content-feed__item--lead')
          liste.append(kopie)
          return kopie
        })

        const weiter = quelle?.querySelector('[data-feed-more]')?.getAttribute('href') || ''
        ende()
        if (weiter) link.setAttribute('href', weiter)
        else (link.closest('.nc-content-feed__footer') || link).remove()

        const status = wurzel.querySelector('[role="status"]')
        if (status) status.textContent = (status.getAttribute('data-feed-geladen') || '{anzahl}').replace('{anzahl}', String(angehaengt.length))

        const erste = /** @type {HTMLElement|null} */ (angehaengt[0].matches('a[href]') ? angehaengt[0] : angehaengt[0].querySelector('a[href], button'))
        erste?.focus()
        sende(wurzel, 'content-feed-mehr', { anzahl: angehaengt.length, ende: !weiter })
      } catch {
        ende()
        contentFeed.navigiere(ansicht, href)
      }
    }
  }
}
