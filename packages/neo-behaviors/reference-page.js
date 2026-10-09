// @ts-check
// ==========================================================================
// Referenzseite — nach data/reference-page-recipe.json (keyboard, events)
// ==========================================================================
// Das mitlaufende Inhaltsverzeichnis .nc-refpage__toc der Referenzseiten
// (Inhaltstyp reference_page, node--reference-page.html.twig). Ersetzt
// Drupal.behaviors.neoRefpageToc aus neo_fe/js/neo-theme.js (Entscheidung
// Abschluss 08.10.2026, Punkt A) und fuehrt denselben Spy wie chapter-nav:
//
//   Scroll-Spy   Der aktuelle Abschnitt ist der LETZTE, dessen Oberkante die
//                Ausloeselinie schon passiert hat (nicht der oberste
//                sichtbare — ein langer Abschnitt haette sonst immer den
//                kleinsten top-Wert; gemessen: Sprung auf „Analytics"
//                markierte „Inhaltsmanagement und Administration"). Ueber dem
//                ersten Abschnitt: der erste, solange die Seite oben steht.
//                Am Ende der Seite (gescrollt, Rest < 4 px): der letzte — ein
//                kurzer letzter Abschnitt erreicht die Linie sonst nie (neu
//                gegenueber neo-theme.js). Markiert per aria-current="true"
//                (die Farbe ist nur die sichtbare Entsprechung, WCAG 1.4.1).
//                IntersectionObserver an den Schwellen plus Scroll-Auswertung,
//                gedrosselt per requestAnimationFrame.
//   Linie        Versatz + 24 px. Versatz = Hoehe der Kopfzeile aus dem DOM
//                (.site-header[data-neo-nav], offsetHeight — NICHT aus
//                --nc-nav-height: parseInt("4rem") ist 4, die Linie lag
//                damit bei 28 statt 88 px), mindestens der scroll-margin-top
//                des Abschnitts (.nc-refpage__section) — Spy und Sprung lesen
//                dieselbe Schwelle.
//   Sprung       Klick (bzw. Enter) auf einen Verzeichniseintrag: markiert
//                sofort (der Spy ruht, bis das Scrollen steht — sonst liefe
//                die Markierung durch alle Abschnitte dazwischen), schliesst
//                unter 1024 px das Verzeichnis (sonst verdeckt die Liste das
//                Ziel), scrollt den Abschnitt unter die Kopfzeile (sanft,
//                ausser bei prefers-reduced-motion), setzt den Anker in die
//                Adresse und den Fokus aufs Sprungziel (tabindex="-1", ohne
//                Scrollen; neu) — Tastatur und Vorlesen landen dort, wo das
//                Auge ist. Waehrend des Sprungs steht [data-neo-sprung] an
//                <html> (nur Fenster): das Auto-Hide der Hauptnavigation
//                zaehlt dieses Scrollen nicht. Der angesprungene Eintrag
//                bleibt markiert, bis wieder gescrollt wird — am Seitenende
//                erreicht ein Abschnitt die Linie nicht, und weder „letzter
//                ueber der Linie" noch „Seitenende" duerften den Klick dann
//                ueberstimmen (gemessen: Klick auf den vorletzten Abschnitt
//                markierte nach dem Sprung den letzten).
//   Klebendes    Unter 1024 px klebt das (zugeklappte) Verzeichnis oben unter
//   Verzeichnis  der Kopfzeile (position: sticky) und verdeckte das Sprungziel
//                (gemessen 54 px). Der Versatz ist dort mindestens seine
//                Unterkante (top + Hoehe, gemessen NACH dem Zuklappen) plus
//                12 px — Spy und Sprung lesen dieselbe Schwelle (Restpunkte
//                09.10.2026, refseite-versatz). Darueber steht es daneben.
//   Mitfuehren   Ab 1024 px hat ein langes Verzeichnis einen eigenen
//                Scrollbereich. Der markierte Eintrag wird darin sichtbar
//                gehalten (wie scrollIntoView block: 'nearest', aber NUR im
//                Verzeichnis — scrollIntoView scrollte auch die Seite), sanft
//                ausser bei prefers-reduced-motion (Restpunkte 09.10.2026).
//   Klappen      Unter 1024 px (matchMedia, wie $refpage-bp im SCSS) startet
//                das Verzeichnis (<details>) zu, darueber ist es immer offen;
//                folgt dem Wechsel der Fensterbreite.
//
// Scroll-Container: der naechste Vorfahr mit overflow-y auto/scroll (Arena),
// sonst das Fenster (Website).
//
// Ereignis `reference-page-change` { value, previousValue } — id des
// Abschnitts (neu).
// ==========================================================================
import { sende } from './kern.js'
import { naechsterScroller } from './chapter-nav.js'

const TOLERANZ = 24
// Luft zwischen klebendem Verzeichnis (unter 1024 px) und Sprungziel
const LUFT_VERZEICHNIS = 12
// Rand beim Mitfuehren des markierten Eintrags im Verzeichnis
const RAND_EINTRAG = 8
// Umbruch wie $refpage-bp in scss/scss/07-organisms/_reference-page.scss
const BREIT = '(min-width: 1024px)'

export const referencePage = {
  id: 'reference-page',
  selektor: '.nc-refpage',
  // Website-Bauteil: in Drupal nur per drupalSettings.neoBehaviors.nur
  nurAusdruecklich: true,
  /** @param {HTMLElement} wurzel @param {AbortSignal} signal */
  binde (wurzel, signal) {
    const dok = wurzel.ownerDocument
    const ansicht = /** @type {Window} */ (dok.defaultView)
    const idVon = (a) => {
      const href = a.getAttribute('href') || ''
      return href.startsWith('#') ? decodeURIComponent(href.slice(1)) : ''
    }
    // Ziel je Eintrag einsammeln. Fehlende Ziele werden uebersprungen statt
    // die ganze Markierung scheitern zu lassen.
    /** @type {{ link: HTMLAnchorElement, ziel: HTMLElement, id: string }[]} */
    const eintraege = []
    for (const link of /** @type {HTMLAnchorElement[]} */ ([...wurzel.querySelectorAll('.nc-refpage__toc-link')])) {
      const id = idVon(link)
      const ziel = id ? dok.getElementById(id) : null
      if (ziel) eintraege.push({ link, ziel, id })
    }
    if (!eintraege.length) return

    const details = /** @type {HTMLDetailsElement|null} */ (wurzel.querySelector('.nc-refpage__toc-disclosure'))
    const verzeichnis = /** @type {HTMLElement|null} */ (wurzel.querySelector('.nc-refpage__toc'))
    const breit = typeof ansicht.matchMedia === 'function' ? ansicht.matchMedia(BREIT) : null
    const scroller = naechsterScroller(wurzel)
    const scrollTop = () => (scroller ? scroller.scrollTop : ansicht.scrollY)
    const obenKante = () => (scroller ? scroller.getBoundingClientRect().top : 0)
    const versatz = (ziel) => {
      const kopf = scroller ? null : dok.querySelector('.site-header[data-neo-nav]')
      const kopfHoehe = kopf ? (/** @type {HTMLElement} */ (kopf).offsetHeight || 64) : 0
      const rand = parseFloat(ansicht.getComputedStyle(ziel).scrollMarginTop) || 0
      const klebt = verzeichnisUnterkante()
      return Math.max(rand, kopfHoehe, klebt ? klebt + LUFT_VERZEICHNIS : 0)
    }
    // Unterkante des klebenden Verzeichnisses unter dem Umbruch (relativ zur
    // Oberkante des Scroll-Containers), sonst 0. top ist der Klebepunkt aus
    // dem SCSS (Navigationshoehe + Abstand), die Hoehe die des zugeklappten
    // <details>.
    function verzeichnisUnterkante () {
      if (!verzeichnis || !breit || breit.matches) return 0
      const stil = ansicht.getComputedStyle(verzeichnis)
      if (stil.position !== 'sticky') return 0
      return (parseFloat(stil.top) || 0) + verzeichnis.offsetHeight
    }

    let aktiv = eintraege.find((k) => k.link.getAttribute('aria-current') === 'true')?.id || null
    const vorher = new Map(eintraege.map((k) => [k.link, k.link.getAttribute('aria-current')]))
    const warOffen = details ? details.open : false
    const eigenerTabindex = new Set()

    function markiere (id) {
      if (!id || id === aktiv) return
      const davor = aktiv
      aktiv = id
      for (const k of eintraege) {
        if (k.id === id) k.link.setAttribute('aria-current', 'true')
        else k.link.removeAttribute('aria-current')
      }
      mitfuehren(eintraege.find((k) => k.id === id)?.link)
      sende(wurzel, 'reference-page-change', { value: id, previousValue: davor })
    }

    // Markierten Eintrag im eigenen Scrollbereich des Verzeichnisses sichtbar
    // halten (ab 1024 px). Nur das Verzeichnis scrollt, nie die Seite.
    function mitfuehren (link) {
      if (!link || !verzeichnis || !breit || !breit.matches) return
      if (verzeichnis.scrollHeight <= verzeichnis.clientHeight + 1) return
      const rahmen = verzeichnis.getBoundingClientRect()
      const r = link.getBoundingClientRect()
      let ziel = verzeichnis.scrollTop
      if (r.top < rahmen.top + RAND_EINTRAG) ziel -= rahmen.top + RAND_EINTRAG - r.top
      else if (r.bottom > rahmen.bottom - RAND_EINTRAG) ziel += r.bottom - (rahmen.bottom - RAND_EINTRAG)
      else return
      const max = verzeichnis.scrollHeight - verzeichnis.clientHeight
      ziel = Math.max(0, Math.min(max, ziel))
      const sanft = !ansicht.matchMedia?.('(prefers-reduced-motion: reduce)').matches
      if (typeof verzeichnis.scrollTo === 'function') verzeichnis.scrollTo({ top: ziel, behavior: sanft ? 'smooth' : 'auto' })
      else verzeichnis.scrollTop = ziel
    }

    // Spy: letzter Abschnitt ueber der Linie
    let ruht = false
    /** @type {string|null} angesprungen, bis wieder gescrollt wird */
    let angesprungen = null
    function auswerten () {
      if (ruht) return
      if (angesprungen) { markiere(angesprungen); return }
      const oben = obenKante()
      let treffer = null
      for (const k of eintraege) {
        if (k.ziel.getBoundingClientRect().top - oben - (versatz(k.ziel) + TOLERANZ) <= 0) treffer = k
      }
      if (!treffer && scrollTop() < 10) treffer = eintraege[0]
      if (scrollTop() > 0 && amEnde()) treffer = eintraege[eintraege.length - 1]
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
      angesprungen = null
      if (laeuft) return
      laeuft = true
      ansicht.requestAnimationFrame(() => { laeuft = false; auswerten() })
    }, { signal, passive: true })

    const Beobachter = /** @type {typeof IntersectionObserver|undefined} */ (/** @type {any} */ (ansicht).IntersectionObserver)
    if (typeof Beobachter === 'function') {
      const beobachter = new Beobachter(() => auswerten(), {
        root: scroller,
        rootMargin: `-${versatz(eintraege[0].ziel) + TOLERANZ}px 0px 0px 0px`,
        threshold: 0
      })
      for (const k of eintraege) beobachter.observe(k.ziel)
      signal.addEventListener('abort', () => beobachter.disconnect())
    }

    // Klappzustand unterhalb des Umbruchs: aufgeklappt schoebe eine Liste mit
    // 69 Eintraegen den Inhalt weit nach unten.
    function klappZustand () {
      if (!details || !breit) return
      details.open = !!breit.matches
    }
    klappZustand()
    if (breit && typeof breit.addEventListener === 'function') breit.addEventListener('change', klappZustand, { signal })

    // Sprung
    wurzel.addEventListener('click', (e) => {
      const link = /** @type {HTMLElement} */ (e.target).closest?.('.nc-refpage__toc-link')
      const k = eintraege.find((x) => x.link === link)
      if (!k || e.defaultPrevented || e.button > 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      e.preventDefault()
      markiere(k.id)
      angesprungen = k.id
      ruht = true
      meldeSprung(true)
      ruheBis()
      // Erst schliessen, dann messen: das Verzeichnis steht unter 1024 px
      // ueber dem Inhalt, seine Hoehe verschiebt das Ziel.
      if (details && breit && !breit.matches) details.open = false
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
    if (anker && eintraege.some((k) => k.id === anker)) markiere(anker)
    else auswerten()

    signal.addEventListener('abort', () => {
      ansicht.clearTimeout(ruheUhr)
      meldeSprung(false)
      for (const [link, wert] of vorher) {
        if (wert === null) link.removeAttribute('aria-current')
        else link.setAttribute('aria-current', wert)
      }
      for (const z of eigenerTabindex) z.removeAttribute('tabindex')
      if (details) details.open = warOffen
    })
  }
}
