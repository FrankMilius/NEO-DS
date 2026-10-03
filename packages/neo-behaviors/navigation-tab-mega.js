// @ts-check
// ==========================================================================
// Hauptnavigation V3 Tab-Mega — nach data/navigation-tab-mega-recipe.json
// (keyboard, events, States)
// ==========================================================================
// Website-Navigation (Drupal neo_nav / neo_fe). Arbeitet auf FERTIGEM Markup
// laut Recipe — das Twig (neo-nav.html.twig) bzw. die Arena-Vorlage rendert
// Menuepunkte, Panels, Such-Band und Drawer-Bildschirme vollstaendig. Das
// Behavior baut nichts, es schaltet nur Zustaende, die das SCSS kennt
// (07-organisms/_navigation-tab-mega.scss): [hidden], .is-open, .is-active,
// .is-prev, .is-nav-hidden, aria-expanded/-selected/-checked/-pressed/-current.
// Abgeloest wird damit neo_fe/js/neo-nav.js (Entscheidung 03.10.2026).
//
// Wurzel: header.site-header[data-neo-nav]. Der Drawer .m-drawer ist ein
// Geschwister (zweite Wurzel) und wird ueber aria-controls des Burgers
// gefunden; Panels, Such-Band und Kopfleisten-Menues ebenso ueber
// aria-controls — keine festen ids, damit mehrere Instanzen (Arena) gehen.
//
//   Panels       button.nav-btn[aria-controls] schaltet sein Panel (Klick,
//                Enter, Leertaste nativ): hidden weg, .is-open, aria-expanded.
//                Nur eines offen; Oeffnen schliesst Such-Band und
//                Kopfleisten-Menues. Schliessen ueber denselben Knopf gibt
//                den Fokus an ihn zurueck; [hidden] erst nach 200 ms (Ausblenden).
//   Mega-Tabs    .tab[role=tab]: Klick waehlt; Pfeil runter/hoch waehlt den
//                naechsten/vorigen Tab (rundum) und fokussiert ihn; roving
//                tabindex, .tabpanel per [hidden].
//   Such-Band    .search-toggle[aria-controls] oeffnet/schliesst, Fokus ins
//                Feld; .search-close schliesst (Fokus zurueck auf den
//                Ausloeser); .search-clear erscheint nur mit Text, leert und
//                fokussiert das Feld.
//   Menues       [data-hdr-menu] > .hdr-btn + .hdr-pop: Klick oeffnet (Fokus
//                auf die erste Option), Pfeil runter/hoch in der Liste
//                (rundum), Auswahl schliesst mit Fokus zurueck. Sprache
//                (data-lang) schaltet live um, Erscheinungsbild
//                (data-theme-value) meldet nur — umschalten ist Sache der Website.
//   Sprache      setzt aria-checked/-pressed an allen Sprach-Optionen,
//                [data-lang-code], lang an Header und Drawer und beschriftet
//                alles mit data-neo-i18n='{"de":…,"en":…}' neu (Text oder,
//                mit data-neo-i18n-attr, ein Attribut). Fehlt eine Sprache,
//                gilt de.
//   Escape       schliesst in dieser Reihenfolge: Kopfleisten-Menue,
//                Such-Band, Panel (je Fokus zurueck), Drawer (Fokus nur dann
//                zum Burger, wenn er im Drawer lag).
//   Aussenklick  schliesst Panel, Such-Band und Menues.
//   Drawer       .burger[aria-controls] schaltet .m-drawer.is-open,
//                aria-expanded, aria-label und das Symbol (Striche/Kreuz).
//                Push-Navigation: button.m-row[aria-controls] schiebt den
//                Bildschirm (.m-screen.is-active, der vorige .is-prev), Fokus
//                auf „Zurueck"; .m-back geht zurueck (Fokus auf die Zeile).
//                Schliessen setzt auf den Startbildschirm zurueck. Der
//                geschlossene Drawer und die verschobenen Bildschirme sind
//                inert (sonst per Tab erreichbar, obwohl aus dem Bild).
//   Aktiver Ast  traegt kein Menuepunkt aria-current, markiert das Behavior
//                den laengsten Treffer des aktuellen Pfads (location.pathname
//                bzw. data-neo-nav-pfad): aria-current="page" (der Punkt IST
//                die Seite) oder "true" (sein Panel ENTHAELT sie) + .is-active.
//   Auto-Hide    .is-nav-hidden beim Runterscrollen (ab 120 px, Schwelle
//                8 px), weg beim Hochscrollen; gesperrt, solange etwas offen
//                ist oder der Fokus im Header liegt; Spruenge mit
//                [data-neo-sprung] an <html> zaehlen nicht.
//                data-neo-nav-autohide="aus" schaltet es ab (Arena).
//
// Ereignisse (alle an der Wurzel, bubbles):
//   navigation-tab-mega-panel    { value, open }       value = data-panel
//   navigation-tab-mega-tab      { value, previousValue } ids der Tabs
//   navigation-tab-mega-search   { open }
//   navigation-tab-mega-menu     { value, open }       'sprache' | 'ansicht'
//   navigation-tab-mega-select   { menu, value }       gewaehlte Option
//   navigation-tab-mega-language { value }             neue Sprache
//   navigation-tab-mega-drawer   { open, reason }      'trigger' | 'escape'
//   navigation-tab-mega-screen   { value }             'root' | data-screen
//   navigation-tab-mega-hidden   { hidden }            Auto-Hide
// ==========================================================================
import { sende, nachbar } from './kern.js'

const AUSBLENDEN = 200 // ms, Dauer der Ausblende-Transition im SCSS
const FOKUS_NACH = 130 // ms, zweiter Fokusversuch ins Suchfeld
const OBEN_FREI = 120 // px, oberhalb bleibt die Leiste immer sichtbar
const SCHWELLE = 8 // px Mindest-Scrollweg
const BURGER_ZU = '<path d="M3 6h18M3 12h18M3 18h18"/>'
const BURGER_OFFEN = '<path d="M6 6l12 12M18 6L6 18"/>'

export const navigationTabMega = {
  id: 'navigation-tab-mega',
  selektor: '.site-header[data-neo-nav]',
  binde (wurzel, signal) {
    const dok = wurzel.ownerDocument
    const fenster = dok.defaultView || window
    const perId = (id) => /** @type {HTMLElement|null} */ (id ? dok.getElementById(id) : null)
    const ziel = (el) => perId(el?.getAttribute('aria-controls') || '')
    const uhren = new Set()
    const spaeter = (fn, ms) => { const u = fenster.setTimeout(() => { uhren.delete(u); fn() }, ms); uhren.add(u) }
    const fokus = (el) => { try { el?.focus({ preventScroll: true }) } catch { el?.focus() } }

    // --- Teile -------------------------------------------------------------
    const ausloeser = /** @type {HTMLElement[]} */ ([...wurzel.querySelectorAll('.nav-btn[aria-controls]')]).filter((b) => ziel(b))
    const suchKnopf = /** @type {HTMLElement|null} */ (wurzel.querySelector('.search-toggle'))
    const band = ziel(suchKnopf)
    const feld = /** @type {HTMLInputElement|null} */ (band?.querySelector('.search-input') || null)
    const loeschen = /** @type {HTMLElement|null} */ (band?.querySelector('.search-clear') || null)
    const schliessKnopf = /** @type {HTMLElement|null} */ (band?.querySelector('.search-close') || null)
    const menues = /** @type {HTMLElement[]} */ ([...wurzel.querySelectorAll('[data-hdr-menu]')]).map((m) => {
      const knopf = /** @type {HTMLElement|null} */ (m.querySelector('.hdr-btn'))
      const pop = ziel(knopf) || /** @type {HTMLElement|null} */ (m.querySelector('.hdr-pop'))
      const art = pop?.querySelector('[data-lang]') ? 'sprache' : pop?.querySelector('[data-theme-value]') ? 'ansicht' : (knopf?.id || '')
      return { m, knopf, pop, art }
    }).filter((x) => x.knopf && x.pop)
    const burger = /** @type {HTMLElement|null} */ (wurzel.querySelector('.burger'))
    const drawer = ziel(burger)
    const bereiche = () => (drawer ? [wurzel, drawer] : [wurzel])

    // --- Panels ------------------------------------------------------------
    let offen = /** @type {HTMLElement|null} */ (null)
    const panelName = (b) => ziel(b)?.dataset.panel || b.dataset.trigger || b.id

    const oeffnePanel = (b) => {
      if (offen === b) return
      schliessePanel()
      schliesseSuche()
      schliesseMenues()
      const p = /** @type {HTMLElement} */ (ziel(b))
      p.hidden = false
      void p.offsetWidth // Reflow vor der Transition
      p.classList.add('is-open')
      b.setAttribute('aria-expanded', 'true')
      offen = b
      sende(wurzel, 'navigation-tab-mega-panel', { value: panelName(b), open: true })
    }
    const schliessePanel = (fokusZurueck = false) => {
      const b = offen
      if (!b) return
      const p = /** @type {HTMLElement} */ (ziel(b))
      p.classList.remove('is-open')
      b.setAttribute('aria-expanded', 'false')
      spaeter(() => { if (!p.classList.contains('is-open')) p.hidden = true }, AUSBLENDEN)
      offen = null
      if (fokusZurueck) fokus(b)
      sende(wurzel, 'navigation-tab-mega-panel', { value: panelName(b), open: false })
    }
    // Startzustand aus dem Markup (die Arena zeigt in „Zustände" Offenes fest)
    for (const b of ausloeser) {
      const p = /** @type {HTMLElement} */ (ziel(b))
      if (p.classList.contains('is-open') && !p.hidden && !offen) { offen = b; b.setAttribute('aria-expanded', 'true') } else b.setAttribute('aria-expanded', 'false')
    }

    // --- Mega-Tabs ---------------------------------------------------------
    const tabsVon = (tab) => /** @type {HTMLElement[]} */ ([...(tab.closest('[role="tablist"]')?.querySelectorAll('[role="tab"]') || [])])
    const waehleTab = (tab) => {
      const liste = tabsVon(tab)
      const vorher = liste.find((t) => t.getAttribute('aria-selected') === 'true') || null
      for (const t of liste) {
        const an = t === tab
        t.setAttribute('aria-selected', String(an))
        t.tabIndex = an ? 0 : -1
        const tp = ziel(t)
        if (tp) tp.hidden = !an
      }
      if (vorher !== tab) sende(wurzel, 'navigation-tab-mega-tab', { value: tab.id, previousValue: vorher ? vorher.id : null })
    }

    // --- Such-Band ---------------------------------------------------------
    let sucheOffen = !!(band && !band.hidden && band.classList.contains('is-open'))
    if (suchKnopf) suchKnopf.setAttribute('aria-expanded', String(sucheOffen))
    const loeschenAbgleichen = () => { if (loeschen && feld) loeschen.hidden = feld.value.length === 0 }
    const oeffneSuche = () => {
      if (!band || sucheOffen) return
      schliessePanel()
      schliesseMenues()
      band.hidden = false
      void band.offsetWidth
      band.classList.add('is-open')
      suchKnopf?.setAttribute('aria-expanded', 'true')
      sucheOffen = true
      // Zwei Versuche: sofort und nach der Einblendung — gegen
      // konkurrierende Fokus-Setzer anderer Behaviors.
      const insFeld = () => { if (sucheOffen) fokus(feld) }
      insFeld()
      spaeter(insFeld, FOKUS_NACH)
      loeschenAbgleichen()
      sende(wurzel, 'navigation-tab-mega-search', { open: true })
    }
    const schliesseSuche = (fokusZurueck = false) => {
      if (!band || !sucheOffen) return
      band.classList.remove('is-open')
      suchKnopf?.setAttribute('aria-expanded', 'false')
      spaeter(() => { if (!band.classList.contains('is-open')) band.hidden = true }, AUSBLENDEN)
      sucheOffen = false
      if (fokusZurueck) fokus(suchKnopf)
      sende(wurzel, 'navigation-tab-mega-search', { open: false })
    }
    feld?.addEventListener('input', loeschenAbgleichen, { signal })
    feld?.addEventListener('change', loeschenAbgleichen, { signal })
    loeschenAbgleichen()

    // --- Kopfleisten-Menues ------------------------------------------------
    const menueOffen = (x) => !x.pop.hidden
    for (const x of menues) x.knopf.setAttribute('aria-expanded', String(menueOffen(x)))
    const schliesseMenue = (x, fokusZurueck = false) => {
      if (!menueOffen(x)) return
      x.pop.hidden = true
      x.knopf.setAttribute('aria-expanded', 'false')
      if (fokusZurueck) fokus(x.knopf)
      sende(wurzel, 'navigation-tab-mega-menu', { value: x.art, open: false })
    }
    function schliesseMenues (ausser = null) { for (const x of menues) if (x !== ausser) schliesseMenue(x) }
    const optionen = (x) => /** @type {HTMLElement[]} */ ([...x.pop.querySelectorAll('.hdr-opt')])
    const oeffneMenue = (x) => {
      schliesseMenues(x)
      schliessePanel()
      schliesseSuche()
      x.pop.hidden = false
      x.knopf.setAttribute('aria-expanded', 'true')
      fokus(optionen(x)[0])
      sende(wurzel, 'navigation-tab-mega-menu', { value: x.art, open: true })
    }

    // --- Sprache -----------------------------------------------------------
    const codeEl = /** @type {HTMLElement|null} */ (wurzel.querySelector('[data-lang-code]'))
    let sprache = (codeEl?.textContent || wurzel.closest('[lang]')?.getAttribute('lang') || 'de').trim().toLowerCase()
    const setzeSprache = (lc) => {
      if (!lc) return
      const wechsel = lc !== sprache
      sprache = lc
      for (const b of bereiche()) {
        for (const x of b.querySelectorAll('.lang-switch button[data-lang]')) x.setAttribute('aria-pressed', String(/** @type {HTMLElement} */ (x).dataset.lang === lc))
        for (const x of b.querySelectorAll('.hdr-opt[data-lang]')) x.setAttribute('aria-checked', String(/** @type {HTMLElement} */ (x).dataset.lang === lc))
        for (const el of b.querySelectorAll('[data-neo-i18n]')) {
          let texte
          try { texte = JSON.parse(el.getAttribute('data-neo-i18n') || '') } catch { continue }
          if (!texte || typeof texte !== 'object') continue
          const wert = texte[lc] ?? texte.de ?? ''
          const attr = el.getAttribute('data-neo-i18n-attr')
          if (attr) el.setAttribute(attr, wert)
          else el.textContent = wert
        }
        // Nur die Navigation wechselt die Sprache, nicht die Seite — deshalb
        // lang an Header und Drawer, nicht an <html>.
        b.setAttribute('lang', lc)
      }
      if (codeEl) codeEl.textContent = lc.toUpperCase()
      if (wechsel) sende(wurzel, 'navigation-tab-mega-language', { value: lc })
    }

    // --- Drawer ------------------------------------------------------------
    const bildschirme = () => /** @type {HTMLElement[]} */ (drawer ? [...drawer.querySelectorAll('.m-screen')] : [])
    const startBild = () => bildschirme().find((s) => s.dataset.screen === 'root') || bildschirme()[0]
    let stapel = /** @type {HTMLElement[]} */ ([])
    let rufer = /** @type {HTMLElement[]} */ ([]) // Zeilen, die den Stapel gefuellt haben
    const drawerOffen = () => !!drawer?.classList.contains('is-open')
    // Was nicht zu sehen ist, ist auch nicht bedienbar: der geschlossene
    // Drawer und die verschobenen Bildschirme sind nur aus dem Bild
    // geschoben (transform), per Tab aber erreichbar — sie bekommen inert.
    const sperre = () => {
      if (!drawer) return
      drawer.toggleAttribute('inert', !drawerOffen())
      const oben = stapel.at(-1)
      for (const s of bildschirme()) s.toggleAttribute('inert', s !== oben)
    }
    const zeigeStapel = (melden = true) => {
      const oben = stapel.at(-1)
      for (const s of bildschirme()) {
        s.classList.remove('is-active', 'is-prev')
        if (s === oben) s.classList.add('is-active')
        else if (stapel.includes(s)) s.classList.add('is-prev')
      }
      sperre()
      if (melden) sende(wurzel, 'navigation-tab-mega-screen', { value: oben?.dataset.screen || 'root' })
    }
    // Startzustand: aktiver Bildschirm aus dem Markup (Arena „Zustände")
    if (drawer) {
      const aktiv = bildschirme().find((s) => s.classList.contains('is-active'))
      const start = startBild()
      stapel = start ? (aktiv && aktiv !== start ? [start, aktiv] : [start]) : []
      sperre()
    }
    const zielBild = (zeile) => {
      const z = ziel(zeile)
      if (z) return z
      // Rueckfall ohne aria-controls: n-te Zeile mit Unterseite → n-ter Unterbildschirm
      const zeilen = [...(startBild()?.querySelectorAll('button.m-row') || [])]
      return bildschirme().filter((s) => s !== startBild())[zeilen.indexOf(zeile)] || null
    }
    const schiebe = (zeile) => {
      const s = zielBild(zeile)
      if (!s || stapel.includes(s)) return
      stapel.push(s)
      rufer.push(zeile)
      zeigeStapel()
      fokus(/** @type {HTMLElement|null} */ (s.querySelector('.m-back')))
    }
    const zurueck = () => {
      if (stapel.length < 2) return
      stapel.pop()
      const z = rufer.pop()
      zeigeStapel()
      fokus(z)
    }
    const setzeDrawer = (an, grund) => {
      if (!drawer || !burger || drawerOffen() === an) return
      // Lag der Fokus im Drawer, der gleich inert wird, geht er zum Burger
      // — sonst fiele er auf <body>.
      if (!an && drawer.contains(dok.activeElement)) fokus(burger)
      drawer.classList.toggle('is-open', an)
      burger.setAttribute('aria-expanded', String(an))
      burger.setAttribute('aria-label', an ? (burger.dataset.labelOffen || 'Menü schließen') : (burger.dataset.labelZu || 'Menü öffnen'))
      const svg = burger.querySelector('svg')
      if (svg) svg.innerHTML = an ? BURGER_OFFEN : BURGER_ZU
      if (!an) {
        const start = startBild()
        stapel = start ? [start] : []
        rufer = []
        zeigeStapel()
      } else sperre()
      sende(wurzel, 'navigation-tab-mega-drawer', { open: an, reason: grund })
    }

    // --- Klicks (ein Zuhoerer am Dokument: Bedienung UND Aussenklick) -----
    dok.addEventListener('click', (e) => {
      const t = /** @type {HTMLElement} */ (e.target)
      if (!t || !t.closest) return
      const b = /** @type {HTMLElement|null} */ (t.closest('.nav-btn[aria-controls]'))
      if (b && ausloeser.includes(b)) { if (offen === b) schliessePanel(true); else oeffnePanel(b); return }
      if (suchKnopf && t.closest('.search-toggle') === suchKnopf) { if (sucheOffen) schliesseSuche(true); else oeffneSuche(); return }
      for (const x of menues) {
        if (t.closest('.hdr-btn') === x.knopf) { if (menueOffen(x)) schliesseMenue(x); else oeffneMenue(x); return }
        const opt = /** @type {HTMLElement|null} */ (t.closest('.hdr-opt'))
        if (opt && x.pop.contains(opt)) {
          const wert = opt.dataset.lang || opt.dataset.themeValue || ''
          if (opt.dataset.lang) setzeSprache(opt.dataset.lang)
          sende(wurzel, 'navigation-tab-mega-select', { menu: x.art, value: wert })
          schliesseMenue(x, true)
          return
        }
      }
      if (schliessKnopf && t.closest('.search-close') === schliessKnopf) { schliesseSuche(true); return }
      if (loeschen && t.closest('.search-clear') === loeschen && feld) {
        feld.value = ''
        loeschenAbgleichen()
        feld.dispatchEvent(new Event('input', { bubbles: true }))
        fokus(feld)
        return
      }
      const tab = /** @type {HTMLElement|null} */ (t.closest('[role="tab"]'))
      if (tab && wurzel.contains(tab)) { waehleTab(tab); return }
      if (burger && t.closest('.burger') === burger) { setzeDrawer(!drawerOffen(), 'trigger'); return }
      if (drawer && drawer.contains(t)) {
        const zeile = /** @type {HTMLElement|null} */ (t.closest('button.m-row'))
        if (zeile) { schiebe(zeile); return }
        if (t.closest('.m-back')) { zurueck(); return }
      }
      const sprachKnopf = /** @type {HTMLElement|null} */ (t.closest('.lang-switch button[data-lang]'))
      if (sprachKnopf && bereiche().some((x) => x.contains(sprachKnopf))) { setzeSprache(sprachKnopf.dataset.lang || ''); return }
      // Aussenklick
      if (offen && !ziel(offen)?.contains(t)) schliessePanel()
      if (sucheOffen && band && !band.contains(t)) schliesseSuche()
      for (const x of menues) if (menueOffen(x) && !x.m.contains(t)) schliesseMenue(x)
    }, { signal })

    // --- Tasten ------------------------------------------------------------
    wurzel.addEventListener('keydown', (e) => {
      const t = /** @type {HTMLElement} */ (e.target)
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
      const schritt = e.key === 'ArrowDown' ? 1 : -1
      if (t.getAttribute('role') === 'tab' && t.closest('[role="tablist"]')) {
        e.preventDefault()
        const n = nachbar(tabsVon(t), t, schritt)
        if (n) { waehleTab(n); fokus(n) }
        return
      }
      const x = menues.find((m) => m.pop.contains(t))
      if (x) {
        e.preventDefault()
        const liste = optionen(x)
        const i = liste.indexOf(t)
        fokus(liste[(i + schritt + liste.length) % liste.length])
      }
    }, { signal })

    dok.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return
      const x = menues.find(menueOffen)
      if (x) { e.preventDefault(); schliesseMenue(x, true); return }
      if (sucheOffen) { e.preventDefault(); schliesseSuche(true); return }
      if (offen) { e.preventDefault(); schliessePanel(true); return }
      if (drawerOffen()) { e.preventDefault(); setzeDrawer(false, 'escape') }
    }, { signal })

    // --- Aktueller Ast -----------------------------------------------------
    const liste = wurzel.querySelector('.nav-list')
    if (liste && !liste.querySelector('[aria-current]')) {
      const norm = (p) => {
        try { p = decodeURI(p || '') } catch { /* roher Pfad */ }
        p = p.split('?')[0].split('#')[0]
        return p.length > 1 ? p.replace(/\/+$/, '') : p
      }
      const hier = norm(wurzel.dataset.neoNavPfad || fenster.location?.pathname || '')
      let bester = /** @type {HTMLElement|null} */ (null)
      let laenge = -1
      let seite = false
      const href = (a) => a.getAttribute('href') || ''
      for (const punkt of /** @type {HTMLElement[]} */ ([...liste.querySelectorAll('.nav-btn[aria-controls], a.nav-link')])) {
        const p = punkt.classList.contains('nav-btn') ? ziel(punkt) : null
        const ueber = p?.querySelector('.panel-overview')
        const eigenes = p ? (ueber ? norm(href(ueber)) : null) : norm(href(punkt))
        const ziele = (p ? [...p.querySelectorAll('.link-grid a, .dropdown-cols a, .panel-overview')].map(href) : [href(punkt)])
          .map(norm).filter((h) => h && h !== '#')
        for (const z of ziele) {
          let treffer = false
          let genau = false
          if (z === hier) { treffer = true; genau = z === eigenes } else if (z !== '/' && hier.indexOf(z + '/') === 0) treffer = true
          if (!treffer) continue
          if (z.length > laenge || (z.length === laenge && genau)) { laenge = z.length; bester = punkt; seite = genau }
        }
      }
      if (bester) {
        bester.setAttribute('aria-current', seite ? 'page' : 'true')
        bester.classList.add('is-active')
      }
    }

    // --- Auto-Hide ---------------------------------------------------------
    if (wurzel.dataset.neoNavAutohide !== 'aus') {
      const VERSTECKT = 'is-nav-hidden'
      let zuletzt = fenster.scrollY || 0
      let wartet = false
      const gesperrt = () => wurzel.contains(dok.activeElement) || !!wurzel.querySelector('[aria-expanded="true"], .is-open') || drawerOffen()
      const setze = (an) => {
        if (wurzel.classList.contains(VERSTECKT) === an) return
        wurzel.classList.toggle(VERSTECKT, an)
        sende(wurzel, 'navigation-tab-mega-hidden', { hidden: an })
      }
      const pruefe = () => {
        wartet = false
        const y = Math.max(0, fenster.scrollY || 0) // iOS-Overscroll
        // Ein Sprung per Skript (z. B. Kapitelleiste) ist keine Bewegung.
        if (dok.documentElement.hasAttribute('data-neo-sprung')) { zuletzt = y; return }
        if (gesperrt() || y <= OBEN_FREI) { setze(false); zuletzt = y; return }
        const d = y - zuletzt
        // Unter der Schwelle zuletzt NICHT nachziehen, sonst summieren sich
        // kleine Bewegungen nie zu einer Richtung.
        if (d > SCHWELLE) { setze(true); zuletzt = y } else if (d < -SCHWELLE) { setze(false); zuletzt = y }
      }
      const naechsterFrame = (fn) => (fenster.requestAnimationFrame ? fenster.requestAnimationFrame(fn) : spaeter(fn, 16))
      fenster.addEventListener('scroll', () => { if (!wartet) { wartet = true; naechsterFrame(pruefe) } }, { passive: true, signal })
      wurzel.addEventListener('focusin', () => setze(false), { signal })
      wurzel.addEventListener('click', () => naechsterFrame(pruefe), { signal })
      pruefe()
    }

    signal.addEventListener('abort', () => {
      for (const u of uhren) fenster.clearTimeout(u)
      uhren.clear()
      drawer?.removeAttribute('inert')
      for (const s of bildschirme()) s.removeAttribute('inert')
    })
  }
}
