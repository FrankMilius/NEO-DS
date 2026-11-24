// @ts-check
// ==========================================================================
// Hero Wortwechsel — nach data/hero-recipe.json (Variante wortwechsel,
// keyboard, events). I19 Phase 2, 24.11.2026.
// ==========================================================================
// Website-Bauteil an .nc-hero--wortwechsel. Das Layout steht im SCSS
// (Phase 1); das Verhalten bringt nur Bewegung und zwei Messungen:
//
//   Takt        Claim i: Wort (Buchstaben bauen sich auf), Web-Bild, App-Bild
//               (data-ww-index), Ton (lime/blue im Wechsel), Segment der
//               Laufleiste (aria-current, erledigte is-done), Name der Bühne
//               (data-ww-label des Web-Bilds, mit App „, davor die App“) und
//               der Text für Screenreader (.nc-hero__ww-current, nicht live).
//               Dauer aus --nc-hero-ww-duration (Vorgabe 5 s); ein Zeitgeber,
//               die Laufleiste zeigt dieselbe Dauer per CSS-Animation.
//   Knopf       .nc-hero__ww-pause: anhalten/fortsetzen (Restzeit bleibt),
//               Symbol Tabler player-pause/player-play. Bei reduzierter
//               Bewegung kein Takt; der Knopf heißt „Nächster Claim“
//               (chevron-right) und schaltet weiter (WCAG 2.2.2).
//   Segmente    Klick zeigt diesen Claim und startet den Takt neu.
//   Rahmen      Ist der Text höher als die Bühne, steht er oben über; der
//               Ausgleich --_ww-ausgleich = (Text − Bühne) / 2 hält Rahmen
//               oben = unten (Entscheidung Frank 24.11.2026). Nur ab 960 px.
//   Füllen      Bleiben unter der Kopfzeile weniger als 100 px Rest, füllt
//               der Hero das Fenster: --_ww-fuell = halber Rest oben und
//               unten. Nur ab 960 px. Neu messen bei Größenänderung (ein
//               Durchlauf je Bild) und wenn die Schriften geladen sind.
//
// Abbinden stellt Markup und Attribute der Wurzel von vorher her.
// Ereignisse: `hero-wortwechsel-change` { index, previousIndex } bei jedem
// Wechsel (nicht beim Binden); `hero-wortwechsel-autoplay` { playing,
// reason: "knopf" } beim Anhalten/Fortsetzen.
// ==========================================================================
import { sende } from './kern.js'
import { dauerAus, reduzierteBewegung, spracheVon } from './gallery.js'

export const TEXTE = {
  de: { pause: 'Wechsel anhalten', play: 'Wechsel fortsetzen', next: 'Nächster Claim', app: ', davor die App' },
  en: { pause: 'Pause word change', play: 'Resume word change', next: 'Next claim', app: ', with the app in front' }
}

// Tabler-Icons, Strichstärke 2 wie die Pfeile der Story Gallery
const PFADE = {
  pause: '<path d="M6 6a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z" /><path d="M14 6a1 1 0 0 1 1 -1h2a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1z" />',
  play: '<path d="M7 4v16l13 -8z" />',
  next: '<path d="M9 6l6 6l-6 6" />'
}
/** @param {'pause'|'play'|'next'} name */
const symbol = (name) => `<svg data-symbol="${name}" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${PFADE[name]}</svg>`

const VORGABE_MS = 5000
const REST_FUELLEN = 100

/**
 * Zerlegt die Textknoten eines Worts in Buchstaben (.nc-hero__ww-letter,
 * --i fortlaufend); Elemente wie die Trennstelle bleiben, ihr Text wird
 * ebenso zerlegt.
 * @param {Element} el @param {{ i: number }} zaehler
 */
function zerlege (el, zaehler) {
  for (const knoten of [...el.childNodes]) {
    if (knoten.nodeType === 3) {
      const teil = el.ownerDocument.createDocumentFragment()
      for (const zeichen of knoten.textContent || '') {
        const l = el.ownerDocument.createElement('span')
        l.className = 'nc-hero__ww-letter'
        l.style.setProperty('--i', String(zaehler.i++))
        l.textContent = zeichen
        teil.appendChild(l)
      }
      knoten.replaceWith(teil)
    } else if (knoten.nodeType === 1 && !(/** @type {Element} */ (knoten).matches('br'))) {
      zerlege(/** @type {Element} */ (knoten), zaehler)
    }
  }
}

/** Text eines Worts ohne Trennstelle @param {Element} wort */
function wortText (wort) {
  const kopie = /** @type {Element} */ (wort.cloneNode(true))
  kopie.querySelectorAll('.nc-hero__ww-break').forEach((b) => b.remove())
  return (kopie.textContent || '').trim()
}

export const heroWortwechsel = {
  id: 'hero-wortwechsel',
  selektor: '.nc-hero--wortwechsel',
  // Soll in Recipe hero (Variante wortwechsel), kein eigenes Recipe
  recipes: ['hero'],
  // Website-Bauteil: in Drupal nur per drupalSettings.neoBehaviors.nur
  nurAusdruecklich: true,
  /** @param {HTMLElement} wurzel @param {AbortSignal} signal */
  binde (wurzel, signal) {
    const worte = [...wurzel.querySelectorAll('.nc-hero__ww-word')]
    if (worte.length < 2) return
    const ansicht = wurzel.ownerDocument.defaultView || window
    const vorher = {
      html: wurzel.innerHTML,
      klasse: wurzel.getAttribute('class'),
      stil: wurzel.getAttribute('style'),
      ton: wurzel.getAttribute('data-tone')
    }

    const webs = [...wurzel.querySelectorAll('.nc-hero__ww-web > img')]
    const apps = /** @type {HTMLElement[]} */ ([...wurzel.querySelectorAll('.nc-hero__ww-phone > img')])
    const segmente = /** @type {HTMLButtonElement[]} */ ([...wurzel.querySelectorAll('.nc-hero__ww-seg')])
    const knopf = /** @type {HTMLButtonElement|null} */ (wurzel.querySelector('.nc-hero__ww-pause'))
    const buehne = wurzel.querySelector('.nc-hero__ww-stage')
    const text = /** @type {HTMLElement|null} */ (wurzel.querySelector('.nc-hero__content'))
    const vorlesen = wurzel.querySelector('.nc-hero__ww-current')
    const texte = TEXTE[spracheVon(wurzel)]
    const ruhig = reduzierteBewegung(wurzel)
    const dauer = dauerAus(wurzel, '--nc-hero-ww-duration', VORGABE_MS)
    const namen = worte.map(wortText)

    const zaehler = { i: 0 }
    worte.forEach((w) => { zaehler.i = 0; zerlege(w, zaehler) })

    let aktuell = Math.max(0, worte.findIndex((w) => w.classList.contains('is-on')))
    let angehalten = false
    let zeitgeber = 0
    let start = 0
    let rest = dauer

    /** @param {Element[]} liste @param {number} i @param {number} alt */
    const tausche = (liste, i, alt) => liste.forEach((el, k) => {
      el.classList.toggle('is-on', k === i)
      el.classList.toggle('is-off', k === alt && k !== i)
    })

    /** @param {number} i @param {number} alt */
    const zeige = (i, alt) => {
      tausche(worte, i, alt)
      tausche(webs, i, alt)
      const mitApp = apps.some((a) => Number(a.dataset.wwIndex) === i)
      apps.forEach((a) => a.classList.toggle('is-on', Number(a.dataset.wwIndex) === i))
      buehne?.classList.toggle('has-app', mitApp)
      wurzel.setAttribute('data-tone', i % 2 ? 'blue' : 'lime')
      const label = webs[i]?.getAttribute('data-ww-label')
      if (buehne && label) buehne.setAttribute('aria-label', label + (mitApp ? texte.app : ''))
      if (vorlesen) vorlesen.textContent = namen[i]
      segmente.forEach((s, k) => {
        s.classList.toggle('is-done', k < i)
        if (k === i) {
          s.setAttribute('aria-current', 'true')
          // Fortschritt neu starten: das Innere ersetzen startet die Animation
          s.innerHTML = '<i></i>'
        } else s.removeAttribute('aria-current')
      })
    }

    const stoppe = () => { if (zeitgeber) ansicht.clearTimeout(zeitgeber); zeitgeber = 0 }
    /** @param {number} ms */
    const plane = (ms) => {
      stoppe()
      if (ruhig || angehalten) return
      start = Date.now(); rest = ms
      zeitgeber = ansicht.setTimeout(() => wechsle((aktuell + 1) % worte.length), ms)
    }

    /** @param {number} i */
    function wechsle (i) {
      const alt = aktuell
      aktuell = i
      zeige(i, alt)
      sende(wurzel, 'hero-wortwechsel-change', { index: i, previousIndex: alt })
      plane(dauer)
    }

    const setzeKnopf = () => {
      if (!knopf) return
      const art = ruhig ? 'next' : angehalten ? 'play' : 'pause'
      knopf.innerHTML = symbol(art)
      knopf.setAttribute('aria-label', ruhig ? texte.next : angehalten ? texte.play : texte.pause)
    }

    knopf?.addEventListener('click', () => {
      if (ruhig) return wechsle((aktuell + 1) % worte.length)
      angehalten = !angehalten
      wurzel.classList.toggle('is-paused', angehalten)
      if (angehalten) { rest = Math.max(0, rest - (Date.now() - start)); stoppe() } else plane(rest)
      setzeKnopf()
      sende(wurzel, 'hero-wortwechsel-autoplay', { playing: !angehalten, reason: 'knopf' })
    }, { signal })

    segmente.forEach((s, k) => s.addEventListener('click', () => {
      rest = dauer
      if (k !== aktuell) return wechsle(k)
      // derselbe Claim: Fortschritt und Takt gemeinsam von vorn (Widersacher Phase 2)
      s.innerHTML = '<i></i>'
      plane(dauer)
    }, { signal }))

    // -- Layout: Rahmen-Ausgleich und Füllen (ab 960 px) --
    const messe = () => {
      if (!ansicht.matchMedia?.('(min-width: 960px)')?.matches) {
        wurzel.style.removeProperty('--_ww-ausgleich')
        wurzel.style.removeProperty('--_ww-fuell')
        return
      }
      const t = text?.getBoundingClientRect().height || 0
      const s = buehne?.getBoundingClientRect().height || 0
      wurzel.style.setProperty('--_ww-ausgleich', `${Math.max(0, (t - s) / 2)}px`)
      wurzel.style.setProperty('--_ww-fuell', '0px')
      const kopf = wurzel.ownerDocument.querySelector('.site-header')
      const kopfUnten = kopf ? kopf.getBoundingClientRect().height : 0
      const r = wurzel.getBoundingClientRect()
      const oben = r.top + (ansicht.scrollY || 0)
      const sichtbar = r.height - Math.max(0, kopfUnten - oben)
      const restHoehe = (ansicht.innerHeight - kopfUnten) - sichtbar
      wurzel.style.setProperty('--_ww-fuell', `${restHoehe > 0 && restHoehe < REST_FUELLEN ? restHoehe / 2 : 0}px`)
    }
    let frame = 0
    ansicht.addEventListener('resize', () => {
      if (!frame) frame = ansicht.setTimeout(() => { frame = 0; messe() }, 16)
    }, { signal })
    wurzel.ownerDocument.fonts?.ready?.then(() => { if (!signal.aborted) messe() })

    signal.addEventListener('abort', () => {
      stoppe()
      if (frame) ansicht.clearTimeout(frame)
      wurzel.innerHTML = vorher.html
      for (const [name, wert] of /** @type {[string, string|null][]} */ ([['class', vorher.klasse], ['style', vorher.stil], ['data-tone', vorher.ton]])) {
        if (wert === null) wurzel.removeAttribute(name)
        else wurzel.setAttribute(name, wert)
      }
    })

    wurzel.classList.add('is-ready')
    zeige(aktuell, -1)
    setzeKnopf()
    messe()
    plane(dauer)
  }
}
