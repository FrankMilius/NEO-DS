// @ts-check
// ==========================================================================
// Kapitelnavigation — nach data/chapter-nav-recipe.json (keyboard, events)
// ==========================================================================
// Die klebende Leiste .nc-chapter-nav der Landing Pages (Entscheidung
// 06.10.2026, website-verhalten). Ersetzt die Library neo_fe/neo-chapter-nav
// (eingebunden in node--landing-page--full.html.twig, [data-neo-chapternav])
// und folgt dem Scroll-Spy aus neo-theme.js (Drupal.behaviors.neoRefpageToc):
//
//   Scroll-Spy   Das laufende Kapitel ist das LETZTE, dessen Oberkante die
//                Ausloeselinie schon passiert hat (nicht das oberste
//                sichtbare — ein langer Abschnitt haette sonst immer den
//                kleinsten top-Wert). Ueber dem ersten Kapitel: das erste,
//                solange die Seite oben steht. Am Ende der Seite (gescrollt,
//                Rest < 4 px): das letzte — ein kurzer letzter Abschnitt
//                erreicht die Linie sonst nie (wie neo_fe/js/neo-chapter-nav.js). Markiert per
//                aria-current="true" (die Farbe ist nur die sichtbare
//                Entsprechung, WCAG 1.4.1). IntersectionObserver an den
//                Schwellen plus Scroll-Auswertung, gedrosselt per
//                requestAnimationFrame.
//   Linie        Versatz + 24 px. Versatz = Hoehe der Kopfzeile aus dem DOM
//                (.site-header[data-neo-nav], offsetHeight — nicht aus
//                --nc-nav-height, siehe neo-theme.js) + Hoehe der Leiste,
//                mindestens der scroll-margin-top des Kapitels (Recipe: der
//                Spy liest dieselbe Schwelle wie der Sprung).
//   Sprung       Klick (bzw. Enter) auf einen Kapitelverweis: markiert sofort
//                (der Spy ruht, bis das Scrollen steht — sonst liefe die
//                Markierung durch alle Kapitel dazwischen), scrollt das
//                Kapitel unter Kopfzeile und Leiste (sanft, ausser bei
//                prefers-reduced-motion), setzt den Anker in die Adresse und
//                den Fokus aufs Kapitel (tabindex="-1", ohne Scrollen) —
//                Tastatur und Vorlesen landen dort, wo das Auge ist.
//                Waehrend des Sprungs steht [data-neo-sprung] an <html>: die
//                Hauptnavigation (navigation-tab-mega, Auto-Hide) zaehlt
//                dieses Scrollen nicht und blendet sich nicht ein oder aus —
//                sonst schoebe sie die Leiste auf halber Strecke (wie
//                neo_fe/js/neo-chapter-nav.js; nur auf dem Fenster).
//   Leiste       Der markierte Verweis wird in der quer scrollbaren Leiste
//                sichtbar gehalten.
//
// Scroll-Container: der naechste Vorfahr mit overflow-y auto/scroll (Arena),
// sonst das Fenster (Website).
//
// Ereignis `chapter-nav-change` { value, previousValue } — id des Kapitels.
// ==========================================================================
import { sende } from './kern.js'

const TOLERANZ = 24

export const chapterNav = {
  id: 'chapter-nav',
  selektor: '.nc-chapter-nav',
  // Website-Bauteil: in Drupal nur per drupalSettings.neoBehaviors.nur
  nurAusdruecklich: true,
  /** @param {HTMLElement} nav @param {AbortSignal} signal */
  binde (nav, signal) {
    const dok = nav.ownerDocument
    const ansicht = /** @type {Window} */ (dok.defaultView)
    const leiste = /** @type {HTMLElement|null} */ (nav.querySelector('.nc-chapter-nav__inner'))
    const idVon = (a) => {
      const href = a.getAttribute('href') || ''
      return href.startsWith('#') ? decodeURIComponent(href.slice(1)) : ''
    }
    /** @type {{ link: HTMLAnchorElement, ziel: HTMLElement, id: string }[]} */
    const kapitel = []
    for (const link of /** @type {HTMLAnchorElement[]} */ ([...nav.querySelectorAll('.nc-chapter-nav__link')])) {
      const id = idVon(link)
      const ziel = id ? dok.getElementById(id) : null
      if (ziel) kapitel.push({ link, ziel, id })
    }
    if (!kapitel.length) return

    const scroller = naechsterScroller(nav)
    const scrollTop = () => (scroller ? scroller.scrollTop : ansicht.scrollY)
    const obenKante = () => (scroller ? scroller.getBoundingClientRect().top : 0)
    const versatz = (ziel) => {
      const kopf = scroller ? null : dok.querySelector('.site-header[data-neo-nav]')
      const kopfHoehe = kopf ? (/** @type {HTMLElement} */ (kopf).offsetHeight || 64) : 0
      const rand = parseFloat(ansicht.getComputedStyle(ziel).scrollMarginTop) || 0
      return Math.max(rand, kopfHoehe + nav.offsetHeight)
    }

    let aktiv = kapitel.find((k) => k.link.getAttribute('aria-current') === 'true')?.id || null
    const vorher = new Map(kapitel.map((k) => [k.link, k.link.getAttribute('aria-current')]))
    const eigenerTabindex = new Set()

    function markiere (id) {
      if (!id || id === aktiv) return
      const davor = aktiv
      aktiv = id
      for (const k of kapitel) {
        if (k.id === id) k.link.setAttribute('aria-current', 'true')
        else k.link.removeAttribute('aria-current')
      }
      zeigeInLeiste(kapitel.find((k) => k.id === id)?.link)
      sende(nav, 'chapter-nav-change', { value: id, previousValue: davor })
    }
    function zeigeInLeiste (link) {
      if (!leiste || !link) return
      const l = leiste.getBoundingClientRect()
      const r = link.getBoundingClientRect()
      if (r.left < l.left) leiste.scrollLeft -= l.left - r.left
      else if (r.right > l.right) leiste.scrollLeft += r.right - l.right
    }

    // Spy: letzter Abschnitt ueber der Linie
    let ruht = false
    function auswerten () {
      if (ruht) return
      const oben = obenKante()
      let treffer = null
      for (const k of kapitel) {
        if (k.ziel.getBoundingClientRect().top - oben - (versatz(k.ziel) + TOLERANZ) <= 0) treffer = k
      }
      if (!treffer && scrollTop() < 10) treffer = kapitel[0]
      if (scrollTop() > 0 && amEnde()) treffer = kapitel[kapitel.length - 1]
      if (treffer) markiere(treffer.id)
    }

    function amEnde () {
      if (scroller) return scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 4
      return ansicht.innerHeight + ansicht.scrollY >= dok.body.scrollHeight - 4
    }

    // Sprung-Marke fuer die Hauptnavigation (nur Fenster, nicht Arena)
    let sprungMarke = false
    function meldeSprung (an) {
      if (an && !scroller) { dok.documentElement.setAttribute('data-neo-sprung', 'ja'); sprungMarke = true }
      else if (!an && sprungMarke) { dok.documentElement.removeAttribute('data-neo-sprung'); sprungMarke = false }
    }

    let laeuft = false
    let ruheUhr = 0
    const ruheBis = () => {
      ansicht.clearTimeout(ruheUhr)
      ruheUhr = ansicht.setTimeout(() => { ruht = false; meldeSprung(false); auswerten() }, 150)
    }
    ;(scroller || ansicht).addEventListener('scroll', () => {
      if (ruht) { ruheBis(); return }
      if (laeuft) return
      laeuft = true
      ansicht.requestAnimationFrame(() => { laeuft = false; auswerten() })
    }, { signal, passive: true })

    const Beobachter = /** @type {typeof IntersectionObserver|undefined} */ (/** @type {any} */ (ansicht).IntersectionObserver)
    if (typeof Beobachter === 'function') {
      const beobachter = new Beobachter(() => auswerten(), {
        root: scroller,
        rootMargin: `-${versatz(kapitel[0].ziel) + TOLERANZ}px 0px 0px 0px`,
        threshold: 0
      })
      for (const k of kapitel) beobachter.observe(k.ziel)
      signal.addEventListener('abort', () => beobachter.disconnect())
    }

    // Sprung
    nav.addEventListener('click', (e) => {
      const link = /** @type {HTMLElement} */ (e.target).closest?.('.nc-chapter-nav__link')
      const k = kapitel.find((x) => x.link === link)
      if (!k || e.defaultPrevented || e.button > 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      e.preventDefault()
      markiere(k.id)
      ruht = true
      meldeSprung(true)
      ruheBis()
      const ziel = k.ziel.getBoundingClientRect().top - obenKante() + scrollTop() - versatz(k.ziel)
      const sanft = !ansicht.matchMedia?.('(prefers-reduced-motion: reduce)').matches
      const flaeche = scroller || ansicht
      if (typeof flaeche.scrollTo === 'function') flaeche.scrollTo({ top: Math.max(0, ziel), behavior: sanft ? 'smooth' : 'auto' })
      else if (scroller) scroller.scrollTop = Math.max(0, ziel)
      if (!scroller && ansicht.location.hash !== `#${k.id}`) {
        try { ansicht.history.pushState(null, '', `#${encodeURIComponent(k.id)}`) } catch { /* z. B. file: — Anker egal */ }
      }
      if (!k.ziel.hasAttribute('tabindex')) { k.ziel.setAttribute('tabindex', '-1'); eigenerTabindex.add(k.ziel) }
      k.ziel.focus({ preventScroll: true })
    }, { signal })

    // Mit Anker aufgerufen: gleich den richtigen Eintrag markieren
    const anker = !scroller && ansicht.location.hash ? decodeURIComponent(ansicht.location.hash.slice(1)) : ''
    if (anker && kapitel.some((k) => k.id === anker)) markiere(anker)
    else auswerten()

    signal.addEventListener('abort', () => {
      ansicht.clearTimeout(ruheUhr)
      meldeSprung(false)
      for (const [link, wert] of vorher) {
        if (wert === null) link.removeAttribute('aria-current')
        else link.setAttribute('aria-current', wert)
      }
      for (const z of eigenerTabindex) z.removeAttribute('tabindex')
    })
  }
}

/** Naechster Vorfahr, der senkrecht scrollt (overflow-y auto/scroll), sonst null = Fenster. */
function naechsterScroller (el) {
  const ansicht = el.ownerDocument.defaultView
  for (let p = el.parentElement; p && p !== el.ownerDocument.body && p !== el.ownerDocument.documentElement; p = p.parentElement) {
    const oy = ansicht?.getComputedStyle(p).overflowY
    if (oy === 'auto' || oy === 'scroll') return p
  }
  return null
}
