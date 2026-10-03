/**
 * neo-behaviors, Block Navigation (Plan v3, Entscheidung 02.10.2026):
 * Breadcrumb, Treeview, Navigationsmenue, Toolbar, Sidebar. Gebunden wird
 * an genau das Markup, das die Arena im Modus „Ausprobieren" aus dem Recipe
 * baut (src/arena-templates, m.ausprobieren); jede Taste aus `keyboard` wird
 * geprueft, jedes Ereignis gegen `events`.
 */
import { describe, it, expect, afterEach, vi } from 'vitest'
import { anbinden, abbinden } from 'neo-behaviors'
import { lebendigesMarkup, zellenMarkup, zelleMit, buehne, taste, tastenAus, deckeTastenAb, sammle, passtZumRecipe } from './_helfer.js'
import { readFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { WURZEL } from '../arena/_recipes.js'

afterEach(() => { document.body.innerHTML = ''; vi.useRealTimers() })

const aktiv = () => document.activeElement

// ---------------------------------------------------------------------------
describe('Breadcrumb (breadcrumb-recipe.json)', () => {
  function aufbau (specimen = 'truncated') {
    const b = buehne(`<button type="button" id="draussen">draussen</button>\n${lebendigesMarkup('breadcrumb', specimen)}`)
    anbinden(b)
    const wurzel = b.querySelector('.nc-breadcrumb')
    const knopf = wurzel.querySelector('.nc-breadcrumb__ellipsis')
    const menue = wurzel.querySelector('.nc-breadcrumb__dropdown')
    return { b, wurzel, knopf, menue, eintraege: [...menue.querySelectorAll('.nc-breadcrumb__dropdown-item')] }
  }
  const istOffen = (d) => d.menue.classList.contains('is-open')

  it('Ausprobieren startet zu, auch beim Specimen „Dropdown Open"', () => {
    const d = aufbau('truncated-dropdown')
    expect(istOffen(d)).toBe(false)
    expect(d.knopf.getAttribute('aria-expanded')).toBe('false')
    expect(d.eintraege.every((e) => e.tabIndex === -1)).toBe(true)
  })

  it('Klick oeffnet (.is-open, aria-expanded), Fokus auf den ersten Eintrag; breadcrumb-toggle wie im Recipe', () => {
    const d = aufbau()
    const ev = sammle(d.wurzel, 'breadcrumb-toggle')
    d.knopf.click()
    expect(istOffen(d)).toBe(true)
    expect(d.knopf.getAttribute('aria-expanded')).toBe('true')
    expect(aktiv()).toBe(d.eintraege[0])
    d.knopf.click()
    expect(istOffen(d)).toBe(false)
    expect(ev.map((e) => e.detail)).toEqual([{ open: true }, { open: false }])
    for (const e of ev) passtZumRecipe('breadcrumb', e)
  })

  it('Klick ausserhalb und Klick auf einen Eintrag schliessen', () => {
    const d = aufbau()
    d.knopf.click()
    document.getElementById('draussen').click()
    expect(istOffen(d)).toBe(false)
    d.knopf.click()
    d.eintraege[1].click()
    expect(istOffen(d)).toBe(false)
  })

  it('Fokus verlaesst die Ellipsis → zu', () => {
    const d = aufbau()
    d.knopf.click()
    d.eintraege[0].dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: document.getElementById('draussen') }))
    expect(istOffen(d)).toBe(false)
  })

  // nav-a11y (Entscheidung 03.10.2026): die Doku baute mit js/breadcrumb.js
  // ein zweites Menue neben das im Markup — jetzt wirkt nur neo-behaviors
  it('Doku: nur neo-behaviors, je Breadcrumb genau ein Menue (Showcase und Buehne)', () => {
    expect(existsSync(join(WURZEL, 'js/breadcrumb.js'))).toBe(false)
    const quelle = readFileSync(join(WURZEL, 'docs/content/breadcrumb.html'), 'utf8')
    expect(quelle).not.toMatch(/js\/breadcrumb\.js"/)
    expect(quelle).toContain('<script src="../packages/neo-behaviors/dist/neo-behaviors.js"></script>')
    expect(quelle).not.toMatch(/data-breadcrumb-(truncated|hidden-items)\s*[=>\n]/)
    const koerper = quelle.replace(/<script[\s\S]*?<\/script>/g, '')
    const b = buehne(koerper)
    window.NeoBehaviors = { anbinden, abbinden }
    try {
      new Function(readFileSync(join(WURZEL, 'docs/breadcrumb-docs.js'), 'utf8'))()
      // Navs mit Menue (der Abschnitt „Mit Ellipsis" zeigt nur den Knopf)
      const pruefe = (bereich) => {
        const mitMenue = [...bereich.querySelectorAll('nav.nc-breadcrumb')].filter((n) => n.querySelector('.nc-breadcrumb__dropdown'))
        expect(mitMenue.length).toBeGreaterThan(0)
        for (const nav of mitMenue) {
          expect(nav.querySelectorAll('.nc-breadcrumb__dropdown')).toHaveLength(1)
          const knopf = nav.querySelector('.nc-breadcrumb__ellipsis')
          knopf.click()
          expect(nav.querySelector('.nc-breadcrumb__dropdown').classList.contains('is-open')).toBe(true)
          expect(knopf.getAttribute('aria-expanded')).toBe('true')
          knopf.click()
          expect(knopf.getAttribute('aria-expanded')).toBe('false')
        }
      }
      pruefe(b)
      // Buehne mit Ellipsis neu zeichnen (Regler): genau ein Menue, gebunden;
      // ein zweites Zeichnen bindet die neue Instanz wieder
      const stufe = b.querySelector('#stage-items')
      stufe.value = stufe.options[stufe.options.length - 1].value
      const chk = b.querySelector('#stage-ellipsis')
      chk.checked = true
      chk.dispatchEvent(new Event('change'))
      pruefe(b.querySelector('#stage-preview'))
      stufe.dispatchEvent(new Event('change'))
      pruefe(b.querySelector('#stage-preview'))
    } finally { delete window.NeoBehaviors }
  })

  it('volle Pfade ohne Ellipsis: nichts gebunden', () => {
    const b = buehne(lebendigesMarkup('breadcrumb', 'default-full'))
    expect(() => anbinden(b)).not.toThrow()
    expect(b.querySelector('.nc-breadcrumb__dropdown')).toBeNull()
  })

  describe('Tasten aus dem Recipe', () => {
    const offen = () => { const d = aufbau(); d.knopf.click(); return d }
    const pruefungen = {
      Enter: () => {
        const d = aufbau(); d.knopf.focus(); taste(d.knopf, 'Enter')
        expect(istOffen(d)).toBe(true); expect(aktiv()).toBe(d.eintraege[0])
        taste(d.knopf, 'Enter'); expect(istOffen(d)).toBe(false)
      },
      Space: () => { const d = aufbau(); taste(d.knopf, 'Space'); expect(istOffen(d)).toBe(true); expect(aktiv()).toBe(d.eintraege[0]) },
      ArrowDown: () => {
        const d = aufbau(); taste(d.knopf, 'ArrowDown'); expect(istOffen(d)).toBe(true); expect(aktiv()).toBe(d.eintraege[0])
        taste(d.eintraege[0], 'ArrowDown'); expect(aktiv()).toBe(d.eintraege[1])
        taste(d.eintraege[1], 'ArrowDown'); taste(d.eintraege[2], 'ArrowDown'); expect(aktiv()).toBe(d.eintraege[0]) // rundum
      },
      ArrowUp: () => {
        const d = aufbau(); taste(d.knopf, 'ArrowUp'); expect(istOffen(d)).toBe(true); expect(aktiv()).toBe(d.eintraege[2])
        taste(d.eintraege[2], 'ArrowUp'); expect(aktiv()).toBe(d.eintraege[1])
      },
      Home: () => { const d = offen(); d.eintraege[2].focus(); taste(d.eintraege[2], 'Home'); expect(aktiv()).toBe(d.eintraege[0]) },
      End: () => { const d = offen(); taste(d.eintraege[0], 'End'); expect(aktiv()).toBe(d.eintraege[2]) },
      Escape: () => {
        const d = offen(); const e = taste(d.eintraege[0], 'Escape')
        expect(istOffen(d)).toBe(false); expect(aktiv()).toBe(d.knopf); expect(e.defaultPrevented).toBe(true)
      },
      Tab: () => { const d = offen(); const e = taste(d.eintraege[0], 'Tab'); expect(istOffen(d)).toBe(false); expect(e.defaultPrevented).toBe(false) }
    }
    it('jede Taste hat eine Pruefung', () => deckeTastenAb('breadcrumb', pruefungen))
    for (const t of tastenAus('breadcrumb')) it(t, () => pruefungen[t]())
  })
})

// ---------------------------------------------------------------------------
describe('Treeview (treeview-recipe.json)', () => {
  const ITEM = '.nc-treeview__item'
  function aufbau (html = lebendigesMarkup('treeview', 'states')) {
    const b = buehne(html)
    anbinden(b)
    const wurzel = b.querySelector('.nc-treeview')
    const li = (text) => [...b.querySelectorAll(ITEM)].find((x) => x.querySelector(':scope > .nc-treeview__node .nc-treeview__label').textContent === text)
    const zeile = (text) => li(text).querySelector(':scope > .nc-treeview__node')
    return { b, wurzel, li, zeile }
  }
  const stopps = (b) => [...b.querySelectorAll(ITEM)].filter((li) => li.tabIndex === 0)

  it('roving tabindex am treeitem: genau ein Eintrag im Tab-Fluss, Fokus per Klick wird Tab-Stopp', () => {
    const t = aufbau()
    expect(stopps(t.b)).toEqual([t.li('Dokumente')])
    t.zeile('Notizen.txt').click()
    expect(stopps(t.b)).toEqual([t.li('Notizen.txt')])
    expect(aktiv()).toBe(t.li('Notizen.txt'))
  })

  it('Fokus auf dem treeitem, nicht auf der Zeile; Bedienteile der Zeile aus der Tab-Folge', () => {
    const t = aufbau(lebendigesMarkup('treeview', 'with-actions'))
    expect(t.b.querySelectorAll('.nc-treeview__node[tabindex]')).toHaveLength(0)
    for (const el of t.b.querySelectorAll('.nc-treeview__toggle, .nc-treeview__checkbox, .nc-treeview__link, .nc-treeview__drag-handle')) {
      if (el.tagName !== 'SPAN') expect(el.tabIndex).toBe(-1)
    }
    t.zeile('Notizen.txt').click()
    expect(aktiv()).toBe(t.li('Notizen.txt'))
    expect(aktiv().getAttribute('role')).toBe('treeitem')
  })

  it('aelteres Markup (tabindex an der Zeile, ohne aria-labelledby): wird umgestellt, Name aus dem Label', () => {
    const html = `<nav class="nc-treeview" aria-label="Baum"><ul class="nc-treeview__list" role="tree">
<li class="nc-treeview__item nc-treeview__item--branch" role="treeitem" aria-expanded="true"><div class="nc-treeview__node" tabindex="-1"><span class="nc-treeview__label">A</span></div>
<ul class="nc-treeview__list" role="group"><li class="nc-treeview__item nc-treeview__item--leaf" role="treeitem"><div class="nc-treeview__node" tabindex="0"><a class="nc-treeview__link" href="#b">B</a></div></li></ul></li>
</ul></nav>`
    const b = buehne(html)
    anbinden(b)
    const [a, bb] = b.querySelectorAll('li')
    expect(b.querySelectorAll('.nc-treeview__node[tabindex]')).toHaveLength(0)
    expect(bb.tabIndex).toBe(0) // vorhandener Tab-Stopp bleibt
    expect(a.tabIndex).toBe(-1)
    expect(b.querySelector('.nc-treeview__link').tabIndex).toBe(-1)
    expect(document.getElementById(a.getAttribute('aria-labelledby')).textContent).toBe('A')
    expect(document.getElementById(bb.getAttribute('aria-labelledby')).textContent).toBe('B')
  })

  it('Zeilen-Aktionen: nur die Zeile mit dem Tab-Stopp hat sie im Tab-Fluss, sie wandern mit', () => {
    const t = aufbau(lebendigesMarkup('treeview', 'with-actions'))
    const aktionen = (text) => [...t.zeile(text).querySelectorAll('.nc-treeview__action')]
    const imFluss = () => [...t.b.querySelectorAll('.nc-treeview__action')].filter((a) => a.tabIndex === 0)
    expect(imFluss()).toEqual(aktionen('Dokumente'))
    t.li('Dokumente').focus()
    taste(t.li('Dokumente'), 'ArrowDown')
    expect(imFluss()).toEqual(aktionen('Projekte'))
    // Fokus direkt auf eine Aktion einer anderen Zeile: diese Zeile wird Tab-Stopp
    aktionen('Notizen.txt')[1].focus()
    expect(stopps(t.b)).toEqual([t.li('Notizen.txt')])
    expect(imFluss()).toEqual(aktionen('Notizen.txt'))
    // Klick auf eine Aktion waehlt nicht
    const auswahl = sammle(t.wurzel, 'treeview-select')
    aktionen('Notizen.txt')[0].click()
    expect(auswahl).toHaveLength(0)
    // Pfeiltasten in der Aktion bleiben nativ
    expect(taste(aktionen('Notizen.txt')[0], 'ArrowDown').defaultPrevented).toBe(false)
  })

  it('Zuklappen mit dem Fokus in einer Aktion im Ast holt den Fokus auf den Zweig', () => {
    const t = aufbau(lebendigesMarkup('treeview', 'with-actions'))
    t.zeile('Budget-2026.xlsx').querySelector('.nc-treeview__action').focus()
    taste(t.li('Projekte'), 'ArrowLeft')
    expect(t.li('Projekte').getAttribute('aria-expanded')).toBe('false')
    expect(aktiv()).toBe(t.li('Projekte'))
  })

  it('Klick waehlt (single): aria-selected + --selected wandern; treeview-select wie im Recipe', () => {
    const t = aufbau()
    const ev = sammle(t.wurzel, 'treeview-select')
    t.zeile('Budget-2026.xlsx').click()
    expect(t.li('Budget-2026.xlsx').getAttribute('aria-selected')).toBe('true')
    expect(t.li('Budget-2026.xlsx').classList.contains('nc-treeview__item--selected')).toBe(true)
    expect(t.li('Website-Relaunch.pdf').getAttribute('aria-selected')).toBe('false')
    expect(t.li('Website-Relaunch.pdf').classList.contains('nc-treeview__item--selected')).toBe(false)
    expect(t.b.querySelectorAll('[aria-selected="true"]').length).toBe(1)
    expect(ev.map((e) => e.detail)).toEqual([{ value: 'Budget-2026.xlsx', selected: true, values: ['Budget-2026.xlsx'] }])
    passtZumRecipe('treeview', ev[0])
    t.zeile('Budget-2026.xlsx').click()
    expect(ev).toHaveLength(1) // schon gewaehlt
  })

  it('Chevron klappt nur, waehlt nicht; treeview-toggle wie im Recipe', () => {
    const t = aufbau()
    const ev = sammle(t.wurzel, 'treeview-toggle')
    const auswahl = sammle(t.wurzel, 'treeview-select')
    t.zeile('Vorlagen').querySelector('.nc-treeview__toggle').click()
    expect(t.li('Vorlagen').getAttribute('aria-expanded')).toBe('true')
    t.zeile('Vorlagen').querySelector('.nc-treeview__toggle').click()
    expect(t.li('Vorlagen').getAttribute('aria-expanded')).toBe('false')
    expect(ev.map((e) => e.detail)).toEqual([{ value: 'Vorlagen', expanded: true }, { value: 'Vorlagen', expanded: false }])
    passtZumRecipe('treeview', ev[0])
    expect(auswahl).toHaveLength(0)
  })

  it('Zuklappen mit dem Fokus im Ast holt den Fokus auf den Zweig', () => {
    const t = aufbau()
    t.li('Budget-2026.xlsx').focus()
    t.zeile('Projekte').querySelector('.nc-treeview__toggle').click()
    expect(t.li('Projekte').getAttribute('aria-expanded')).toBe('false')
    expect(stopps(t.b)).toEqual([t.li('Projekte')])
  })

  it('gesperrter Eintrag: wird uebersprungen, nicht gewaehlt, nicht geklappt', () => {
    const t = aufbau(zelleMit('treeview', 'states', (h) => h.includes('nc-treeview__item--disabled')))
    expect(t.li('Vorlagen').getAttribute('aria-disabled')).toBe('true')
    taste(t.li('Budget-2026.xlsx'), 'ArrowDown')
    expect(aktiv()).toBe(t.li('Notizen.txt'))
    t.zeile('Vorlagen').click()
    expect(t.li('Vorlagen').getAttribute('aria-selected')).toBe('false')
    expect(t.li('Vorlagen').getAttribute('aria-expanded')).toBe('false')
  })

  it('Checkbox-Modus: Anhaken schaltet Nachfahren, Eltern werden mixed/true; Checkbox folgt', () => {
    const t = aufbau(lebendigesMarkup('treeview', 'checkbox-mode'))
    const ev = sammle(t.wurzel, 'treeview-select')
    const box = (text) => t.zeile(text).querySelector('.nc-treeview__checkbox')
    // Projekte ist mixed (Website an, Budget aus): Budget anhaken → Projekte true
    t.zeile('Budget-2026.xlsx').click()
    expect(t.li('Budget-2026.xlsx').getAttribute('aria-checked')).toBe('true')
    expect(t.li('Projekte').getAttribute('aria-checked')).toBe('true')
    expect(box('Projekte').checked).toBe(true)
    expect(box('Projekte').indeterminate).toBe(false)
    expect(t.li('Dokumente').getAttribute('aria-checked')).toBe('mixed')
    expect(box('Dokumente').indeterminate).toBe(true)
    // Zweig abhaken → alle Nachfahren aus
    t.zeile('Projekte').click()
    expect(['Projekte', 'Website-Relaunch.pdf', 'Budget-2026.xlsx'].map((x) => t.li(x).getAttribute('aria-checked'))).toEqual(['false', 'false', 'false'])
    expect(t.li('Dokumente').getAttribute('aria-checked')).toBe('false')
    // Klick direkt auf die Checkbox hakt ebenfalls an
    box('Notizen.txt').click()
    expect(t.li('Notizen.txt').getAttribute('aria-checked')).toBe('true')
    expect(box('Notizen.txt').checked).toBe(true)
    expect(ev.at(-1).detail).toEqual({ value: 'Notizen.txt', selected: true, values: ['Notizen.txt'] })
    for (const e of ev) passtZumRecipe('treeview', e)
    expect(t.b.querySelector('[aria-selected]')).toBeNull()
  })

  describe('Tasten aus dem Recipe', () => {
    const pruefungen = {
      ArrowDown: () => {
        const t = aufbau(); t.li('Dokumente').focus()
        taste(t.li('Dokumente'), 'ArrowDown'); expect(aktiv()).toBe(t.li('Projekte'))
        taste(t.li('Notizen.txt'), 'ArrowDown'); expect(aktiv()).toBe(t.li('Bilder')) // Vorlagen zu: Kinder uebersprungen
        taste(t.li('Archiv'), 'ArrowDown'); expect(aktiv()).toBe(t.li('Bilder')) // kein Rundum
        expect(stopps(t.b)).toEqual([t.li('Bilder')])
      },
      ArrowUp: () => {
        const t = aufbau(); taste(t.li('Projekte'), 'ArrowUp'); expect(aktiv()).toBe(t.li('Dokumente'))
        const e = taste(t.li('Dokumente'), 'ArrowUp'); expect(e.defaultPrevented).toBe(false)
      },
      ArrowRight: () => {
        const t = aufbau(); const ev = sammle(t.wurzel, 'treeview-toggle')
        t.li('Vorlagen').focus(); taste(t.li('Vorlagen'), 'ArrowRight')
        expect(t.li('Vorlagen').getAttribute('aria-expanded')).toBe('true'); expect(aktiv()).toBe(t.li('Vorlagen'))
        taste(t.li('Vorlagen'), 'ArrowRight'); expect(aktiv()).toBe(t.li('Angebot.docx'))
        taste(t.li('Angebot.docx'), 'ArrowRight'); expect(aktiv()).toBe(t.li('Angebot.docx')) // Blatt
        expect(ev).toHaveLength(1)
      },
      ArrowLeft: () => {
        const t = aufbau()
        taste(t.li('Budget-2026.xlsx'), 'ArrowLeft'); expect(aktiv()).toBe(t.li('Projekte'))
        taste(t.li('Projekte'), 'ArrowLeft'); expect(t.li('Projekte').getAttribute('aria-expanded')).toBe('false')
        taste(t.li('Projekte'), 'ArrowLeft'); expect(aktiv()).toBe(t.li('Dokumente'))
      },
      Home: () => { const t = aufbau(); taste(t.li('Archiv'), 'Home'); expect(aktiv()).toBe(t.li('Dokumente')) },
      End: () => {
        const t = aufbau(); taste(t.li('Dokumente'), 'End'); expect(aktiv()).toBe(t.li('Archiv'))
        taste(t.li('Archiv'), 'ArrowRight'); taste(t.li('Archiv'), 'Home'); taste(t.li('Dokumente'), 'End'); expect(aktiv()).toBe(t.li('2025'))
      },
      Enter: () => {
        const t = aufbau(); const ev = sammle(t.wurzel, 'treeview-select')
        const e = taste(t.li('Notizen.txt'), 'Enter')
        expect(e.defaultPrevented).toBe(true); expect(t.li('Notizen.txt').getAttribute('aria-selected')).toBe('true'); expect(ev).toHaveLength(1)
      },
      Space: () => {
        const t = aufbau(lebendigesMarkup('treeview', 'checkbox-mode'))
        taste(t.li('Archiv'), 'Space'); expect(t.li('Archiv').getAttribute('aria-checked')).toBe('true')
        expect(t.li('2025').getAttribute('aria-checked')).toBe('true')
      },
      Tab: () => {
        const t = aufbau(); const e = taste(t.li('Dokumente'), 'Tab')
        expect(e.defaultPrevented).toBe(false); expect(stopps(t.b)).toHaveLength(1)
        // mit Aktionen: die naechsten Tab-Stationen sind die Aktionen dieser Zeile, sonst keine im Baum
        const a = aufbau(lebendigesMarkup('treeview', 'with-actions'))
        const fluss = [...a.b.querySelectorAll('li, button, a[href], input')].filter((el) => el.tabIndex >= 0)
        expect(fluss).toEqual([a.li('Dokumente'), ...a.zeile('Dokumente').querySelectorAll('.nc-treeview__action')])
        expect(taste(a.li('Dokumente'), 'Tab').defaultPrevented).toBe(false)
      },
      'Shift+Tab': () => {
        const t = aufbau(lebendigesMarkup('treeview', 'with-actions'))
        const erste = t.zeile('Dokumente').querySelector('.nc-treeview__action')
        erste.focus()
        // nativ: der Eintrag steht im Dokument vor seinen Aktionen und ist der Tab-Stopp
        expect(taste(erste, 'Shift+Tab').defaultPrevented).toBe(false)
        expect(t.li('Dokumente').tabIndex).toBe(0)
        expect(t.li('Dokumente').compareDocumentPosition(erste) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
      },
      Escape: () => {
        const t = aufbau(lebendigesMarkup('treeview', 'with-actions'))
        const aktion = t.zeile('Projekte').querySelectorAll('.nc-treeview__action')[1]
        aktion.focus()
        const e = taste(aktion, 'Escape')
        expect(e.defaultPrevented).toBe(true); expect(aktiv()).toBe(t.li('Projekte'))
        expect(taste(t.li('Projekte'), 'Escape').defaultPrevented).toBe(false) // am Eintrag: frei
      }
    }
    it('jede Taste hat eine Pruefung', () => deckeTastenAb('treeview', pruefungen))
    for (const t of tastenAus('treeview')) it(t, () => pruefungen[t]())
  })
})

// ---------------------------------------------------------------------------
describe('Navigationsmenue (navigation-menu-recipe.json)', () => {
  // WAI-ARIA Disclosure-Navigation (Recipe 3.0.0, Entscheidung 03.10.2026)
  function aufbau (specimen = 'default-dropdown') {
    const b = buehne(`${lebendigesMarkup('navigation-menu', specimen)}\n<button type="button" id="draussen">draussen</button>`)
    anbinden(b)
    const wurzel = b.querySelector('.nc-navigation-menu')
    const oben = [...wurzel.querySelectorAll('.nc-navigation-menu__list > .nc-navigation-menu__item > :first-child')]
    const [produkte, services] = oben
    const panelVon = (a) => document.getElementById(a.getAttribute('aria-controls'))
    const links = (a) => [...panelVon(a).querySelectorAll('a[href]')]
    return { b, wurzel, oben, produkte, services, panelVon, links }
  }
  const offenIst = (n, a) => a.getAttribute('aria-expanded') === 'true' && !n.panelVon(a).hidden
  const offene = (n) => [n.produkte, n.services].filter((a) => a.getAttribute('aria-expanded') === 'true' || !n.panelVon(a).hidden)
  const zu = (n) => offene(n).length === 0

  it('Markup: keine Menue-Rollen, kein roving tabindex, Panels im Item mit aria-controls und [hidden]', () => {
    const n = aufbau('mega-menu')
    expect(n.wurzel.querySelector('[role]')).toBeNull()
    expect(n.wurzel.querySelector('[aria-haspopup]')).toBeNull()
    expect(n.wurzel.querySelector('[tabindex]')).toBeNull()
    expect(n.wurzel.querySelector('.nc-navigation-menu__viewport, .nc-navigation-menu__viewport-wrapper, [inert]')).toBeNull()
    expect(zu(n)).toBe(true)
    for (const a of [n.produkte, n.services]) {
      expect(a.getAttribute('type')).toBe('button')
      expect(a.getAttribute('aria-expanded')).toBe('false')
      expect(a.nextElementSibling).toBe(n.panelVon(a))
      expect(n.panelVon(a).hidden).toBe(true)
    }
    // jeder Top-Level-Eintrag eine eigene Tab-Station
    expect(n.oben.every((a) => a.tabIndex === 0)).toBe(true)
  })

  it('Klick schaltet: aria-expanded/[hidden], Indikator, nur ein Panel offen; navigation-menu-change wie im Recipe', () => {
    const n = aufbau()
    const ev = sammle(n.wurzel, 'navigation-menu-change')
    n.produkte.click()
    expect(offenIst(n, n.produkte)).toBe(true)
    expect(offene(n)).toEqual([n.produkte])
    expect(n.links(n.produkte).length).toBe(3)
    const zeiger = n.wurzel.querySelector('.nc-navigation-menu__indicator')
    expect(zeiger.dataset.state).toBe('visible')
    // Lage per Custom Property (das SCSS liest sie), kein Inline-left/width
    expect(zeiger.style.getPropertyValue('--_indicator-left')).toMatch(/px$/)
    expect(zeiger.style.getPropertyValue('--_indicator-width')).toBe('10px')
    expect(zeiger.style.left).toBe('')
    n.services.click()
    expect(offene(n)).toEqual([n.services])
    expect(n.panelVon(n.services).dataset.motion).toBe('from-end')
    n.produkte.click()
    expect(n.panelVon(n.produkte).dataset.motion).toBe('from-start')
    n.produkte.click()
    expect(zu(n)).toBe(true)
    expect(zeiger.dataset.state).toBe('hidden')
    expect(ev.map((e) => e.detail)).toEqual([
      { value: 'Produkte', previousValue: null },
      { value: 'Services', previousValue: 'Produkte' },
      { value: 'Produkte', previousValue: 'Services' },
      { value: null, previousValue: 'Produkte' }
    ])
    for (const e of ev) passtZumRecipe('navigation-menu', e)
  })

  it('Klick auf einen Link im Panel schliesst', () => {
    const n = aufbau()
    n.produkte.click()
    n.links(n.produkte)[1].addEventListener('click', (e) => e.preventDefault())
    n.links(n.produkte)[1].click()
    expect(zu(n)).toBe(true)
  })

  it('Klick ausserhalb und Fokus verlaesst das Menue schliessen', () => {
    const n = aufbau()
    n.produkte.click()
    document.getElementById('draussen').click()
    expect(zu(n)).toBe(true)
    n.produkte.click()
    n.produkte.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: document.getElementById('draussen') }))
    expect(zu(n)).toBe(true)
  })

  it('Fokus wandert aus dem offenen Item (Tab weiter, anderer Eintrag) → zu; im Panel bleibt es offen', () => {
    const n = aufbau()
    n.produkte.focus(); n.produkte.click()
    n.links(n.produkte)[0].focus()
    expect(offenIst(n, n.produkte)).toBe(true)
    n.links(n.produkte)[2].focus()
    expect(offenIst(n, n.produkte)).toBe(true)
    n.services.focus() // Tab vom letzten Link zum naechsten Eintrag
    expect(zu(n)).toBe(true)
    n.services.click()
    n.oben[2].focus()
    expect(zu(n)).toBe(true)
  })

  it('Mausdruck auf einen anderen Ausloeser wechselt direkt (ein Ereignis)', () => {
    const n = aufbau()
    n.produkte.click()
    const ev = sammle(n.wurzel, 'navigation-menu-change')
    n.services.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    n.services.focus()
    n.services.click()
    expect(offene(n)).toEqual([n.services])
    expect(ev.map((e) => e.detail)).toEqual([{ value: 'Services', previousValue: 'Produkte' }])
  })

  it('aria-controls fehlt: das Behavior vergibt ids und verknuepft', () => {
    const html = lebendigesMarkup('navigation-menu', 'default-dropdown').replace(/ aria-controls="[^"]*"/g, '').replace(/ id="[^"]*-panel-\d"/g, '')
    const b = buehne(html)
    anbinden(b)
    const a = b.querySelector('.nc-navigation-menu__trigger')
    const p = document.getElementById(a.getAttribute('aria-controls'))
    expect(p).toBe(a.nextElementSibling)
    expect(p.hidden).toBe(true)
  })

  it('abbinden: keine Reaktion mehr', () => {
    const n = aufbau()
    abbinden(n.b)
    n.produkte.click()
    expect(n.produkte.getAttribute('aria-expanded')).toBe('false')
  })

  it('data-trigger="hover": oeffnet nach 150 ms, das Panel gehoert zum Item, schliesst 150 ms nach Verlassen', () => {
    vi.useFakeTimers()
    const n = aufbau()
    expect(n.wurzel.dataset.trigger).toBe('hover')
    const item = n.produkte.parentElement
    item.dispatchEvent(new MouseEvent('mouseenter'))
    vi.advanceTimersByTime(149)
    expect(zu(n)).toBe(true)
    vi.advanceTimersByTime(1)
    expect(offenIst(n, n.produkte)).toBe(true)
    expect(item.contains(n.panelVon(n.produkte))).toBe(true)
    item.dispatchEvent(new MouseEvent('mouseleave'))
    vi.advanceTimersByTime(149)
    expect(offenIst(n, n.produkte)).toBe(true)
    item.dispatchEvent(new MouseEvent('mouseenter')) // zurueck vor Ablauf: bleibt offen
    vi.advanceTimersByTime(500)
    expect(offenIst(n, n.produkte)).toBe(true)
    item.dispatchEvent(new MouseEvent('mouseleave'))
    vi.advanceTimersByTime(150)
    expect(zu(n)).toBe(true)
  })

  it('data-trigger="click": Verweilen oeffnet nicht', () => {
    vi.useFakeTimers()
    const b = buehne(lebendigesMarkup('navigation-menu', 'default-dropdown').replace('data-trigger="hover"', 'data-trigger="click"'))
    anbinden(b)
    b.querySelector('.nc-navigation-menu__item').dispatchEvent(new MouseEvent('mouseenter'))
    vi.advanceTimersByTime(500)
    expect(b.querySelector('.nc-navigation-menu__trigger').getAttribute('aria-expanded')).toBe('false')
  })

  describe('Tasten aus dem Recipe', () => {
    const pruefungen = {
      Tab: () => {
        // Tab ist nativ: das Behavior verhindert nichts, die Tab-Folge ergibt
        // sich aus dem DOM (Ausloeser → eigenes Panel → naechster Eintrag)
        const n = aufbau(); n.produkte.click()
        const e = taste(n.produkte, 'Tab')
        expect(e.defaultPrevented).toBe(false)
        const folge = [...n.wurzel.querySelectorAll('a[href], button')].filter((el) => !el.closest('[hidden]'))
        expect(folge.slice(0, 5)).toEqual([n.produkte, ...n.links(n.produkte), n.services])
        expect(offenIst(n, n.produkte)).toBe(true)
        n.services.focus(); expect(zu(n)).toBe(true)
      },
      Enter: () => {
        // Nativer Klick (taste() loest ihn aus wie der Browser): kein preventDefault, kein Doppel-Schalten
        const n = aufbau(); n.produkte.focus()
        const e = taste(n.produkte, 'Enter')
        expect(e.defaultPrevented).toBe(false)
        expect(offenIst(n, n.produkte)).toBe(true); expect(aktiv()).toBe(n.produkte)
        taste(n.produkte, 'Enter'); expect(zu(n)).toBe(true)
        // Links: das Behavior greift nicht ein
        n.produkte.click(); const l = n.links(n.produkte)[0]; l.focus()
        expect(taste(l, 'Enter').defaultPrevented).toBe(false)
      },
      Space: () => {
        const n = aufbau(); n.services.focus()
        expect(taste(n.services, 'Space').defaultPrevented).toBe(false)
        expect(offene(n)).toEqual([n.services]); expect(aktiv()).toBe(n.services)
        taste(n.produkte, 'Space'); expect(offene(n)).toEqual([n.produkte])
        taste(n.produkte, 'Space'); expect(zu(n)).toBe(true)
      },
      Escape: () => {
        const n = aufbau(); n.produkte.click(); const l = n.links(n.produkte)[1]; l.focus()
        expect(taste(l, 'Escape').defaultPrevented).toBe(true)
        expect(zu(n)).toBe(true); expect(aktiv()).toBe(n.produkte)
        n.produkte.click(); taste(n.produkte, 'Escape'); expect(zu(n)).toBe(true); expect(aktiv()).toBe(n.produkte)
        // nichts offen: Escape bleibt unberuehrt
        expect(taste(n.produkte, 'Escape').defaultPrevented).toBe(false)
      },
      ArrowRight: () => {
        const n = aufbau(); n.produkte.focus()
        taste(n.produkte, 'ArrowRight'); expect(aktiv()).toBe(n.services)
        expect(n.oben.every((a) => a.tabIndex === 0)).toBe(true) // kein roving tabindex
        taste(n.oben[4], 'ArrowRight'); expect(aktiv()).toBe(n.produkte) // rundum
        // offenes Panel: Fokus verlaesst das Item → zu
        n.produkte.click(); taste(n.produkte, 'ArrowRight'); expect(aktiv()).toBe(n.services); expect(zu(n)).toBe(true)
      },
      ArrowLeft: () => {
        const n = aufbau(); n.produkte.focus(); taste(n.produkte, 'ArrowLeft'); expect(aktiv()).toBe(n.oben[4])
        taste(n.oben[4], 'ArrowLeft'); expect(aktiv()).toBe(n.oben[3])
      },
      ArrowDown: () => {
        const n = aufbau(); n.produkte.focus(); taste(n.produkte, 'ArrowDown')
        expect(offenIst(n, n.produkte)).toBe(true); expect(aktiv()).toBe(n.links(n.produkte)[0])
        const l = n.links(n.produkte)
        taste(l[0], 'ArrowDown'); expect(aktiv()).toBe(l[1])
        taste(l[1], 'ArrowDown'); taste(l[2], 'ArrowDown'); expect(aktiv()).toBe(l[0]) // rundum
        // auf einem direkten Link: nichts
        n.oben[2].focus(); expect(taste(n.oben[2], 'ArrowDown').defaultPrevented).toBe(false)
      },
      ArrowUp: () => {
        const n = aufbau(); n.produkte.focus(); taste(n.produkte, 'ArrowDown')
        const l = n.links(n.produkte)
        taste(l[0], 'ArrowUp'); expect(aktiv()).toBe(l[2]) // rundum
        taste(l[2], 'ArrowUp'); expect(aktiv()).toBe(l[1])
      },
      Home: () => {
        const n = aufbau(); n.oben[3].focus(); taste(n.oben[3], 'Home'); expect(aktiv()).toBe(n.produkte)
        taste(n.produkte, 'ArrowDown'); const l = n.links(n.produkte); taste(l[0], 'End'); taste(l[2], 'Home'); expect(aktiv()).toBe(l[0])
      },
      End: () => {
        const n = aufbau(); n.produkte.focus(); taste(n.produkte, 'End'); expect(aktiv()).toBe(n.oben[4])
        n.produkte.focus(); taste(n.produkte, 'ArrowDown'); const l = n.links(n.produkte); taste(l[0], 'End'); expect(aktiv()).toBe(l[2])
      }
    }
    it('jede Taste hat eine Pruefung', () => deckeTastenAb('navigation-menu', pruefungen))
    for (const t of tastenAus('navigation-menu')) it(t, () => pruefungen[t]())
  })
})

// ---------------------------------------------------------------------------
describe('Toolbar (toolbar-recipe.json)', () => {
  const STEUER = 'button, input'
  function aufbau (specimen = 'content-variants', html = lebendigesMarkup('toolbar', specimen)) {
    const b = buehne(`<button type="button" id="davor">davor</button>\n${html}\n<button type="button" id="danach">danach</button>`)
    anbinden(b)
    const wurzel = b.querySelector('.nc-toolbar')
    return { b, wurzel, el: [...wurzel.querySelectorAll(STEUER)] }
  }
  const stopps = (t) => t.el.filter((e) => e.tabIndex === 0)

  it('eine Tab-Station: Ausprobieren-Markup kommt mit roving tabindex, das Behavior fuehrt ihn', () => {
    const t = aufbau()
    expect(t.el.map((e) => e.getAttribute('tabindex'))).toEqual(['0', '-1', '-1', '-1'])
    expect(stopps(t)).toEqual([t.el[0]])
  })

  it('Markup ohne tabindex (wie in „Zustände"): Behavior setzt den roving tabindex, Loesen stellt ihn zurueck', () => {
    const t = aufbau(null, zellenMarkup('toolbar', 'content-variants'))
    expect(t.el.map((e) => e.tabIndex)).toEqual([0, -1, -1, -1])
    abbinden(t.b)
    expect(t.el.some((e) => e.hasAttribute('tabindex'))).toBe(false)
  })

  it('Klick und Fokus verschieben die Tab-Station; toolbar-focus wie im Recipe', () => {
    const t = aufbau()
    const ev = sammle(t.wurzel, 'toolbar-focus')
    t.el[2].click()
    expect(stopps(t)).toEqual([t.el[2]])
    t.el[3].focus()
    expect(stopps(t)).toEqual([t.el[3]])
    expect(ev.map((e) => e.detail)).toEqual([
      { value: 'Exportieren', previousValue: 'Neu' },
      { value: 'Archivieren', previousValue: 'Exportieren' }
    ])
    for (const e of ev) passtZumRecipe('toolbar', e)
  })

  it('Eingabefeld: Pfeiltasten, Pos1 und Ende bleiben im Feld', () => {
    const t = aufbau('table-toolbar')
    const feld = t.wurzel.querySelector('input')
    feld.focus()
    expect(stopps(t)).toEqual([feld])
    for (const k of ['ArrowLeft', 'ArrowRight', 'Home', 'End']) {
      const e = taste(feld, k)
      expect(e.defaultPrevented, k).toBe(false)
      expect(aktiv()).toBe(feld)
    }
  })

  it('Eingabefeld am Rand: Tab verlaesst die Leiste', () => {
    const t = aufbau(null, '<div class="nc-toolbar" role="toolbar" aria-label="Test"><div class="nc-toolbar__group"><button type="button" class="nc-button">A</button><input class="nc-input" type="text" aria-label="Feld"></div></div>')
    const feld = t.wurzel.querySelector('input')
    feld.focus()
    expect(taste(feld, 'Tab').defaultPrevented).toBe(false)
    expect(taste(feld, 'Shift+Tab').defaultPrevented).toBe(true)
    expect(aktiv()).toBe(t.el[0])
  })

  it('eingebettete Toggle-Groups: Pfeile laufen flach durch, waehlen nicht; Klick waehlt (Toggle-Group), eine Tab-Station bleibt', () => {
    const t = aufbau('editor-toolbar')
    const radios = [...t.wurzel.querySelectorAll('[role="radio"]')]
    const vor = radios.map((r) => r.getAttribute('aria-checked'))
    expect(t.wurzel.querySelector('.nc-toggle-group').getAttribute('data-neo-behavior')).toBe('toggle-group')
    radios[0].focus()
    taste(radios[0], 'ArrowRight')
    expect(aktiv()).toBe(radios[1])
    expect(radios.map((r) => r.getAttribute('aria-checked'))).toEqual(vor)
    radios[2].click()
    expect(radios[2].getAttribute('aria-checked')).toBe('true')
    expect(stopps(t)).toEqual([radios[2]])
    // Mehrfachauswahl (aria-pressed): Leertaste schaltet ueber die Toggle-Group
    const fett = t.wurzel.querySelector('[aria-pressed]')
    taste(fett, 'Space')
    expect(fett.getAttribute('aria-pressed')).toBe('false')
  })

  describe('Tasten aus dem Recipe', () => {
    const pruefungen = {
      ArrowRight: () => {
        const t = aufbau(); t.el[0].focus()
        taste(t.el[0], 'ArrowRight'); expect(aktiv()).toBe(t.el[1]); expect(stopps(t)).toEqual([t.el[1]])
        taste(t.el[3], 'ArrowRight'); expect(aktiv()).toBe(t.el[0]) // rundum
      },
      ArrowLeft: () => { const t = aufbau(); taste(t.el[0], 'ArrowLeft'); expect(aktiv()).toBe(t.el[3]) },
      Home: () => { const t = aufbau(); taste(t.el[2], 'Home'); expect(aktiv()).toBe(t.el[0]) },
      End: () => { const t = aufbau(); taste(t.el[0], 'End'); expect(aktiv()).toBe(t.el[3]); expect(stopps(t)).toEqual([t.el[3]]) },
      Tab: () => {
        const t = aufbau(); expect(taste(t.el[1], 'Tab').defaultPrevented).toBe(false)
        const tab = aufbau('table-toolbar'); const feld = tab.wurzel.querySelector('input'); feld.focus()
        const e = taste(feld, 'Tab'); expect(e.defaultPrevented).toBe(true)
        expect(aktiv().textContent).toBe('Exportieren'); expect(stopps(tab)).toEqual([aktiv()])
      },
      'Shift+Tab': () => {
        const t = aufbau(); expect(taste(t.el[1], 'Shift+Tab').defaultPrevented).toBe(false)
        const tab = aufbau('table-toolbar'); const feld = tab.wurzel.querySelector('input'); feld.focus()
        taste(feld, 'Shift+Tab'); expect(aktiv().textContent).toBe('Filter')
      }
    }
    it('jede Taste hat eine Pruefung', () => deckeTastenAb('toolbar', pruefungen))
    for (const t of tastenAus('toolbar')) it(t, () => pruefungen[t]())
  })

  describe('Sticky: .is-scrolled solange angeheftet (IntersectionObserver)', () => {
    // Gemockter IntersectionObserver: merkt sich Beobachter und Optionen
    let beobachter
    class IOAttrappe {
      constructor (rueckruf, optionen) { this.rueckruf = rueckruf; this.optionen = optionen; this.ziele = []; this.getrennt = false; beobachter.push(this) }
      observe (el) { this.ziele.push(el) }
      unobserve () {}
      disconnect () { this.getrennt = true }
      melde (ratio, oben, rahmenOben = 1) { this.rueckruf([{ target: this.ziele[0], intersectionRatio: ratio, boundingClientRect: { top: oben }, rootBounds: { top: rahmenOben } }], this) }
    }
    const sticky = (html = lebendigesMarkup('toolbar', 'sticky-scrolled')) => {
      beobachter = []
      vi.stubGlobal('IntersectionObserver', IOAttrappe)
      return aufbau(null, html)
    }
    afterEach(() => vi.unstubAllGlobals())

    it('Ausprobieren-Markup der Sticky-Specimen ist nc-toolbar--sticky', () => {
      const t = sticky()
      expect(t.wurzel.classList.contains('nc-toolbar--sticky')).toBe(true)
    })

    it('angeheftet (Oberkante ueber dem um 1px verkleinerten Rahmen) setzt die Klasse, sonst nicht', () => {
      const t = sticky()
      expect(beobachter).toHaveLength(1)
      const io = beobachter[0]
      expect(io.ziele).toEqual([t.wurzel])
      expect(io.optionen).toMatchObject({ rootMargin: '-1px 0px 0px 0px', threshold: [1] })
      io.melde(1, 40)
      expect(t.wurzel.classList.contains('is-scrolled')).toBe(false)
      io.melde(0.98, 0)
      expect(t.wurzel.classList.contains('is-scrolled')).toBe(true)
      // Unten angeschnitten (Leiste ragt unten aus dem Fenster): nicht angeheftet
      io.melde(0.5, 600)
      expect(t.wurzel.classList.contains('is-scrolled')).toBe(false)
    })

    it('Abbinden trennt den Beobachter und raeumt die Klasse auf', () => {
      const t = sticky()
      beobachter[0].melde(0.9, 0)
      expect(t.wurzel.classList.contains('is-scrolled')).toBe(true)
      abbinden(t.b)
      expect(beobachter[0].getrennt).toBe(true)
      expect(t.wurzel.classList.contains('is-scrolled')).toBe(false)
    })

    it('ohne Sticky-Modifier kein Beobachter; ohne IntersectionObserver nichts', () => {
      sticky(lebendigesMarkup('toolbar', 'content-variants'))
      expect(beobachter).toHaveLength(0)
      document.body.innerHTML = ''
      vi.stubGlobal('IntersectionObserver', undefined)
      const t = aufbau(null, lebendigesMarkup('toolbar', 'sticky-scrolled'))
      expect(t.wurzel.classList.contains('is-scrolled')).toBe(false)
      expect(stopps(t)).toHaveLength(1) // Tastatur arbeitet trotzdem
    })
  })
})

// ---------------------------------------------------------------------------
describe('Sidebar (sidebar-recipe.json)', () => {
  function aufbau (specimen) {
    const b = buehne(lebendigesMarkup('sidebar', specimen))
    anbinden(b)
    const wurzel = b.querySelector('.nc-sidebar')
    return { b, wurzel }
  }
  const unter = (s) => s.wurzel.querySelector('button.nc-sidebar__item[aria-controls]')
  const panel = (s) => document.getElementById(unter(s).getAttribute('aria-controls'))

  it('Untermenue: Klick klappt zu und auf ([hidden], aria-expanded); sidebar-submenu-toggle wie im Recipe', () => {
    const s = aufbau('nested-submenu')
    const ev = sammle(s.wurzel, 'sidebar-submenu-toggle')
    expect(panel(s).hidden).toBe(false)
    unter(s).click()
    expect(unter(s).getAttribute('aria-expanded')).toBe('false')
    expect(panel(s).hidden).toBe(true)
    unter(s).click()
    expect(panel(s).hidden).toBe(false)
    expect(ev.map((e) => e.detail)).toEqual([{ value: 'Einstellungen', open: false }, { value: 'Einstellungen', open: true }])
    for (const e of ev) passtZumRecipe('sidebar', e)
  })

  it('Einklappen: --collapsed, aria-expanded/-label am Knopf, Eintraege bekommen aria-label; sidebar-collapse', () => {
    const s = aufbau('full-sidebar')
    const knopf = s.wurzel.querySelector('.nc-sidebar__toggle')
    const ev = sammle(s.wurzel, 'sidebar-collapse')
    const eintrag = s.wurzel.querySelector('.nc-sidebar__nav a.nc-sidebar__item')
    expect(knopf.getAttribute('aria-expanded')).toBe('true')
    knopf.click()
    expect(s.wurzel.classList.contains('nc-sidebar--collapsed')).toBe(true)
    expect(knopf.getAttribute('aria-expanded')).toBe('false')
    expect(knopf.getAttribute('aria-label')).toBe('Navigation ausklappen')
    expect(eintrag.getAttribute('aria-label')).toBe('Dashboard')
    knopf.click()
    expect(s.wurzel.classList.contains('nc-sidebar--collapsed')).toBe(false)
    expect(knopf.getAttribute('aria-label')).toBe('Navigation einklappen')
    expect(eintrag.hasAttribute('aria-label')).toBe(false)
    expect(ev.map((e) => e.detail)).toEqual([{ collapsed: true }, { collapsed: false }])
    for (const e of ev) passtZumRecipe('sidebar', e)
  })

  it('Mobil-Lage: startet zu, Knopf oeffnet (Fokus in die Sidebar), Backdrop schliesst; sidebar-toggle', () => {
    const s = aufbau('mobile-overlay')
    const knopf = s.b.querySelector('button[aria-controls]')
    const hinten = s.b.querySelector('.nc-sidebar-backdrop')
    const ev = sammle(s.wurzel, 'sidebar-toggle')
    expect(s.wurzel.classList.contains('nc-sidebar--open')).toBe(false)
    expect(hinten.hidden).toBe(true)
    knopf.click()
    expect(s.wurzel.classList.contains('nc-sidebar--open')).toBe(true)
    expect(hinten.hidden).toBe(false)
    expect(knopf.getAttribute('aria-expanded')).toBe('true')
    expect(aktiv()).toBe(s.wurzel.querySelector('[aria-current="page"]'))
    hinten.click()
    expect(s.wurzel.classList.contains('nc-sidebar--open')).toBe(false)
    expect(hinten.hidden).toBe(true)
    expect(aktiv()).toBe(knopf)
    expect(ev.map((e) => e.detail)).toEqual([{ open: true, reason: 'trigger' }, { open: false, reason: 'overlay-click' }])
    for (const e of ev) passtZumRecipe('sidebar', e)
  })

  // Fokus-Falle in der Overlay-Lage (Entscheidung 03.10.2026, sidebar-falle)
  function mobil () {
    const s = aufbau('mobile-overlay')
    const knopf = s.b.querySelector('button[aria-controls]')
    const hinten = s.b.querySelector('.nc-sidebar-backdrop')
    // Inhalt neben der Buehne: wird inert; ein schon inertes Element bleibt es
    const davor = document.createElement('main'); davor.innerHTML = '<a href="#">Inhalt</a>'
    const schonInert = document.createElement('aside'); schonInert.setAttribute('inert', '')
    document.body.prepend(davor, schonInert)
    const liste = () => [...s.wurzel.querySelectorAll('a[href], button:not([disabled])')]
    return { ...s, knopf, hinten, davor, schonInert, liste }
  }

  it('Overlay offen: Rest der Seite inert (Backdrop und Sidebar nicht), Schliessen gibt nur das eigene inert frei', () => {
    const s = mobil()
    s.knopf.click()
    expect(s.knopf.hasAttribute('inert')).toBe(true)
    expect(s.davor.hasAttribute('inert')).toBe(true)
    expect(s.hinten.hasAttribute('inert')).toBe(false)
    expect(s.wurzel.closest('[inert]')).toBeNull()
    taste(aktiv(), 'Escape')
    expect(s.knopf.hasAttribute('inert')).toBe(false)
    expect(s.davor.hasAttribute('inert')).toBe(false)
    expect(s.schonInert.hasAttribute('inert')).toBe(true)
    expect(aktiv()).toBe(s.knopf)
  })

  it('Overlay offen: Tab und Shift+Tab bleiben in der Sidebar', () => {
    const s = mobil()
    s.knopf.click()
    const liste = s.liste()
    liste.at(-1).focus()
    expect(taste(liste.at(-1), 'Tab').defaultPrevented).toBe(true)
    expect(aktiv()).toBe(liste[0])
    expect(taste(liste[0], 'Shift+Tab').defaultPrevented).toBe(true)
    expect(aktiv()).toBe(liste.at(-1))
    liste[0].focus()
    expect(taste(liste[0], 'Tab').defaultPrevented).toBe(false) // mitten drin: nativ
  })

  it('Abbinden bei offener Sidebar gibt den Rest der Seite frei', () => {
    const s = mobil()
    s.knopf.click()
    abbinden(s.b)
    expect(s.davor.hasAttribute('inert')).toBe(false)
    expect(s.knopf.hasAttribute('inert')).toBe(false)
  })

  it('Desktop-Lage (kein Overlay): keine Falle, nichts inert', () => {
    const b = buehne(lebendigesMarkup('sidebar', 'mobile-overlay').replace(' nc-sidebar--overlay', ''))
    anbinden(b)
    const wurzel = b.querySelector('.nc-sidebar')
    const knopf = b.querySelector('button[aria-controls]')
    knopf.click()
    expect(wurzel.classList.contains('nc-sidebar--open')).toBe(true)
    expect(knopf.hasAttribute('inert')).toBe(false)
    const letzter = [...wurzel.querySelectorAll('a[href], button')].at(-1)
    letzter.focus()
    expect(taste(letzter, 'Tab').defaultPrevented).toBe(false)
  })

  describe('Tasten aus dem Recipe', () => {
    const pruefungen = {
      Tab: () => {
        const s = mobil(); s.knopf.click(); const l = s.liste(); l.at(-1).focus()
        expect(taste(l.at(-1), 'Tab').defaultPrevented).toBe(true); expect(aktiv()).toBe(l[0])
        const v = aufbau('full-sidebar'); expect(taste(v.wurzel.querySelector('.nc-sidebar__toggle'), 'Tab').defaultPrevented).toBe(false)
      },
      'Shift+Tab': () => {
        const s = mobil(); s.knopf.click(); const l = s.liste()
        expect(taste(l[0], 'Shift+Tab').defaultPrevented).toBe(true); expect(aktiv()).toBe(l.at(-1))
      },
      Enter: () => {
        const s = aufbau('nested-submenu'); taste(unter(s), 'Enter'); expect(panel(s).hidden).toBe(true)
        const v = aufbau('full-sidebar'); taste(v.wurzel.querySelector('.nc-sidebar__toggle'), 'Enter'); expect(v.wurzel.classList.contains('nc-sidebar--collapsed')).toBe(true)
      },
      Space: () => { const s = aufbau('nested-submenu'); taste(unter(s), 'Space'); expect(unter(s).getAttribute('aria-expanded')).toBe('false') },
      Escape: () => {
        const s = aufbau('mobile-overlay'); const knopf = s.b.querySelector('button[aria-controls]'); const ev = sammle(s.wurzel, 'sidebar-toggle')
        taste(knopf, 'Enter'); expect(s.wurzel.classList.contains('nc-sidebar--open')).toBe(true)
        const e = taste(aktiv(), 'Escape')
        expect(e.defaultPrevented).toBe(true); expect(s.wurzel.classList.contains('nc-sidebar--open')).toBe(false); expect(aktiv()).toBe(knopf)
        expect(ev.at(-1).detail).toEqual({ open: false, reason: 'escape' })
        expect(taste(knopf, 'Escape').defaultPrevented).toBe(false) // zu: Escape bleibt frei
      }
    }
    it('jede Taste hat eine Pruefung', () => deckeTastenAb('sidebar', pruefungen))
    for (const t of tastenAus('sidebar')) it(t, () => pruefungen[t]())
  })
})
