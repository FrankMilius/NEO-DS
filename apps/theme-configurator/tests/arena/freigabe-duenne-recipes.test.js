/**
 * Freigabe der restlichen Entwurfs-Recipes aus Phase 4 („Duenne Recipes",
 * Abschluss Plan v3, Entscheidung 08.10.2026): mobile-drawer, multiselect,
 * searchbar, tab-nav, table-block, table-info-modal, tbl-cell.
 *
 * Je Recipe: Status stable mit Freigabe-Eintrag, aus der Entwurfsliste
 * ausgetragen, Spec aus dem Recipe neu erzeugt, Anatomie gegen das SCSS
 * (jedes BEM-Element ist ein Slot, kein Zustand als Slot), Recipe-Form nach
 * recipe-schema.json und a11y als Pruefpunkte. Dazu, was die Pruefung gegen
 * SCSS, neo-behaviors und das Drupal-Theme neo_fe ergeben hat.
 */
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { MIT_VERHALTEN } from 'neo-behaviors'
import { istEntwurf } from '../../src/data/recipe-entwuerfe.js'
import { vorlageFuer } from '../../src/arena-templates/index.js'
import { normalisiereRecipe, specimenAnsicht } from '../../src/lib/recipe-arena.js'
import { WURZEL, rohesRecipe } from './_recipes.js'

const spec = (id) => JSON.parse(readFileSync(resolve(WURZEL, `specs/${id}.spec.json`), 'utf8'))

function zellen (id, optionen) {
  const recipe = normalisiereRecipe(rohesRecipe(id))
  return recipe.specimens.flatMap((sp) => specimenAnsicht(sp, recipe, id, vorlageFuer(id), optionen).zeilen
    .flatMap((z) => z.zellen.map((c) => ({ ...c, specimen: sp }))))
}

function dom (html) {
  const d = document.createElement('div')
  d.innerHTML = html
  return d
}

/** BEM-Elemente (.block__element, ohne Modifier) einer SCSS-Datei. */
function scssElemente (pfad, block) {
  const text = readFileSync(resolve(WURZEL, pfad), 'utf8').replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '')
  const muster = new RegExp(`\\.${block}__[a-z0-9-]+`, 'g')
  return new Set([...text.matchAll(muster)].map((m) => m[0].replace(/--.*$/, '')))
}

/** Gemeinsame Freigabe-Pruefung. */
function freigegeben (id, version) {
  const r = rohesRecipe(id)
  expect(r.meta.status, id).toBe('stable')
  expect(r.meta.version, id).toBe(version)
  expect(r.meta.changelog[0].version, id).toBe(version)
  // Freigabe-Eintrag (danach hoechstens Korrekturen „Freigabe ausstehend" oder
  // unsichtbare Aenderungen aus den Entscheidungen Abschluss 2, 08.10.2026)
  const freigabe = r.meta.changelog.findIndex((e) => /^Freigabe \(Abschluss Plan v3, 08\.10\.2026\)/.test(e.changes[0]))
  expect(freigabe, id).toBeGreaterThanOrEqual(0)
  // Plan v4, Phase 4 (12.10.2026): Tabellenfarben als Token-Auswahl, Darstellung
  // unveraendert (Rueckfall, Nachweis im Bericht) — keine Website-Wirkung
  for (const e of r.meta.changelog.slice(0, freigabe)) expect(e.changes.join(' '), id).toMatch(/Freigabe ausstehend|Entscheidung Abschluss 2 \(08\.10\.2026\)|Plan v4, Phase 4 \(12\.10\.2026, Entscheidung E2 = A\)/)
  expect(istEntwurf(id), id).toBe(false)
  // Recipe-Form (recipe-schema.json): Objekte statt Listen, mindestens eine Token-Gruppe
  expect(Array.isArray(r.constraints), id).toBe(false)
  expect(Array.isArray(r.recipes), id).toBe(false)
  expect(Object.keys(r.styling.tokenGroups || {}).length, id).toBeGreaterThan(0)
  for (const sp of r.specimens) expect(['row', 'grid', 'composition'], `${id}/${sp.id}`).toContain(sp.layout)
  // a11y als Pruefpunkte, kein „nicht geprueft" mehr
  expect(r.a11y.notes, id).toBeUndefined()
  expect(r.a11y.base.assertions.length, id).toBeGreaterThan(2)
  expect(JSON.stringify(r.a11y), id).not.toMatch(/nicht geprueft/i)
  // kein Zustand (Modifier) als Slot
  for (const s of r.anatomy.slots) expect(s.element, `${id}: ${s.name}`).not.toMatch(/--/)
  // Spec aus dem Recipe neu erzeugt (npm run specs:pruefen prueft den Rest)
  const s = spec(id)
  expect(s.status, id).toBe('stable')
  expect(s.version, id).toBe(version)
  expect(s.layer, id).not.toBe('unknown')
  return r
}

/** Jedes BEM-Element des SCSS ist ein Slot und umgekehrt. */
function anatomieWieScss (id, pfad, block, ausser = []) {
  const r = rohesRecipe(id)
  const slots = new Set(r.anatomy.slots.map((s) => s.element).filter((e) => e.startsWith(`.${block}__`)))
  const scss = [...scssElemente(pfad, block)].filter((e) => !ausser.includes(e))
  expect([...slots].sort(), id).toEqual(scss.sort())
}

describe('Freigabe duenne Recipes (Abschluss Plan v3, 08.10.2026)', () => {
  it('mobile-drawer: 1.3.0, Anatomie wie das SCSS, keyboard/events wie das Behavior, auf der Website nicht im Einsatz', () => {
    const r = freigegeben('mobile-drawer', '1.3.0')
    anatomieWieScss('mobile-drawer', 'scss/scss/07-organisms/_mobile-drawer.scss', 'nc-mobile-drawer')
    const pflicht = Object.fromEntries(r.anatomy.slots.map((s) => [s.name, !s.optional]))
    expect(pflicht).toMatchObject({ backdrop: true, header: true, close: true, nav: true, list: true, link: true, title: false, sublist: false, sublink: false })
    expect(MIT_VERHALTEN).toContain('mobile-drawer')
    expect(Object.keys(r.keyboard).sort()).toEqual(['Enter', 'Escape', 'Shift+Tab', 'Space', 'Tab'])
    // reason-Werte aus _ueberlagerung.js; resize, weil der Drawer ab 1200 px ausgeblendet wird
    for (const grund of ['escape', 'overlay-click', 'close-button', 'trigger', 'resize']) {
      expect(r.events['mobile-drawer-close'].note).toContain(`'${grund}'`)
    }
    expect(r.keyboard.Enter.note).toMatch(/inert/)
    expect(r.meta.source.behavior).toMatch(/mobile-drawer\.js/)
    expect(r.meta.source.drupal).toMatch(/nicht im Einsatz/)
    expect(r.meta.pipeline.drupal).toEqual([])
    expect(r.anatomy.domNotes.join(' ')).not.toMatch(/neoMobileNav\)|bis zur Umstellung/)
    expect(r.a11y.base.assertions.join(' ')).toMatch(/Namen im Markup/)
  })

  it('table-info-modal: 1.4.0, Anatomie wie das SCSS, keyboard/events wie das Behavior, Website seit 07.10.2026 per nur, Name je Knopf (Plan v4, Phase 5)', () => {
    const r = freigegeben('table-info-modal', '1.4.0')
    anatomieWieScss('table-info-modal', 'scss/scss/07-organisms/_table-info-modal.scss', 'nc-table-info-modal')
    expect(MIT_VERHALTEN).toContain('table-info-modal')
    expect(Object.keys(r.keyboard).sort()).toEqual(['Enter', 'Escape', 'Shift+Tab', 'Space', 'Tab'])
    // ohne nochDa: kein 'resize'
    const grund = r.events['table-info-modal-close'].note
    for (const g of ['escape', 'overlay-click', 'close-button', 'trigger']) expect(grund).toContain(`'${g}'`)
    expect(grund).not.toContain("'resize'")
    expect(r.meta.pipeline.drupal).toEqual(['block/block--block-content--neo-table.html.twig', 'block/block--inline-block--neo-table.html.twig'])
    expect(r.meta.source.drupal).toMatch(/schaltet table-info-modal und table-block ein/)
    expect(r.anatomy.domNotes.join(' ')).not.toMatch(/bis zur Umstellung|ersten sechs/)
    // 1.4.0: Name je Knopf aus data-info-label (vorher Klick-Lauscher in neoTable)
    expect(r.a11y.base.assertions.join(' ')).toMatch(/data-info-label/)
    expect(r.anatomy.domNotes.join(' ')).not.toMatch(/gebaut von neoTable/)
    // Website-Markup (geerntet): role=dialog, Schliessen per data-modal-close, ohne Namen
    const ernte = readFileSync(resolve(WURZEL, 'data/markup/table-info-modal.html'), 'utf8')
    expect(ernte).toMatch(/role="dialog"/)
    expect(ernte).toMatch(/nc-table-info-modal__close" data-modal-close/)
    expect(ernte).not.toMatch(/aria-labelledby|aria-modal/)
  })

  it('multiselect: 1.6.0, Anatomie wie das SCSS, keyboard wie das Behavior, Texte nach Sprache (de/en)', () => {
    const r = freigegeben('multiselect', '1.6.0') // 1.5.1: Rahmen wie .nc-input (Entscheidung Abschluss 2); 1.5.2: ohne aria-haspopup (Abschluss 3); 1.6.0: Sprache (Restpunkte 09.10.2026), alle Freigabe ausstehend
    // Disclosure, kein Menue: kein aria-haspopup am Knopf — weder Arena noch Behavior (wie neo_fe)
    for (const z of zellen('multiselect')) expect(dom(z.html).querySelector('.nc-multiselect__trigger').hasAttribute('aria-haspopup'), z.specimen.id).toBe(false)
    expect(readFileSync(resolve(WURZEL, 'packages/neo-behaviors/multiselect.js'), 'utf8')).not.toMatch(/haspopup/)
    expect(r.anatomy.domNotes.join(' ')).not.toMatch(/\[aria-haspopup/)
    anatomieWieScss('multiselect', 'scss/scss/06-molecules/_multiselect.scss', 'nc-multiselect')
    expect(MIT_VERHALTEN).toContain('multiselect')
    expect(Object.keys(r.keyboard).sort()).toEqual(['ArrowDown', 'ArrowUp', 'End', 'Enter', 'Escape', 'Home', 'Space', 'Tab'])
    expect(r.events['multiselect-change'].detail).toEqual({ values: 'string[]' })
    // Seit 1.6.0 (Restpunkte 09.10.2026) nicht mehr fest deutsch: Texte nach
    // lang (de/en), am Bauteil per data-placeholder/data-count-text
    const behavior = readFileSync(resolve(WURZEL, 'packages/neo-behaviors/multiselect.js'), 'utf8')
    expect(behavior).toContain("'@count ausgewählt'")
    expect(behavior).toContain("'@count selected'")
    expect(r.anatomy.domNotes.join(' ')).toMatch(/Sprache \(seit 1\.6\.0.*data-count-text/)
    expect(r.anatomy.domNotes.join(' ')).not.toMatch(/fest deutsch/)
    expect(r.a11y.base.assertions.join(' ')).not.toMatch(/fest deutsch/)
    expect(r.constraints.copy.summary.note).toMatch(/data-count-text/)
    expect(r.meta.source.drupal).toMatch(/_neo_fe_hat_multiselect/)
    // die frueher „ausstehenden" SCSS-Aenderungen sind freigegeben (im Freigabe-Eintrag)
    const freigabe = r.meta.changelog.find((e) => /^Freigabe \(Abschluss Plan v3/.test(e.changes[0]))
    expect(freigabe.changes.join(' ')).toMatch(/seit 07\.10\.2026 freigegeben/)
  })

  it('searchbar: 1.4.0, Anatomie wie das SCSS (__shortcut entfernt), Verhalten beschrieben, nicht migriert', () => {
    const r = freigegeben('searchbar', '1.4.0')
    anatomieWieScss('searchbar', 'scss/scss/06-molecules/_searchbar.scss', 'nc-searchbar')
    expect(r.anatomy.slots.map((s) => s.name)).not.toContain('shortcut')
    // kein Behavior in neo-behaviors: keine keyboard/events (wie reference-page)
    expect(MIT_VERHALTEN).not.toContain('searchbar')
    expect(r.keyboard).toBeUndefined()
    expect(r.events).toBeUndefined()
    expect(r.meta.source.behavior).toBeNull()
    expect(r.meta.source.drupal).toMatch(/neoSearch/)
    expect(r.meta.source.drupal).toMatch(/nicht im Einsatz/)
    expect(r.anatomy.domNotes.join(' ')).toMatch(/Strg\/⌘\+K/)
    expect(r.anatomy.domNotes.join(' ')).not.toMatch(/__shortcut/)
  })

  // Entscheidung Abschluss 2 (08.10.2026), searchbar = beides: Fokusring wie
  // bei den anderen Eingabefeldern, tote Regel __shortcut entfernt
  it('searchbar: Fokus im Feld mit focus-ring wie form-control-base, kein __shortcut, keine Shortcut-Tokens', () => {
    const c = readFileSync(resolve(WURZEL, 'styles.css'), 'utf8')
    expect(c).toContain('.nc-searchbar__input:focus-visible{outline:var(--fnd-focus-ring-width) var(--fnd-focus-ring-style) var(--fnd-focus-ring-color);outline-offset:var(--fnd-focus-offset);border-color:var(--mod-searchbar-input-border-focus, var(--nc-searchbar-input-border-focus))}')
    expect(c).toContain('.nc-searchbar__input:focus:not(:focus-visible){outline:none}')
    // kein outline none bei echtem Fokus, kein schwacher 25-%-Schatten mehr
    expect(c).not.toMatch(/\.nc-searchbar__input:focus\{/)
    expect(c).not.toMatch(/nc-searchbar[\w-]*[^{}]*\{[^}]*color-mix\([^)]*25%/)
    expect(c).not.toContain('nc-searchbar__shortcut')
    expect(c).not.toContain('--nc-searchbar-shortcut-')
    const r = rohesRecipe('searchbar')
    expect(r.a11y.base.focusIndicator).toMatch(/focus-ring/)
    expect(r.a11y.base.assertions.join(' ')).toMatch(/14,23:1/)
  })

  it('tab-nav: 1.5.0 (Plan v4, Phase 7, Block 10a), jedes SCSS-Element ein Slot, Haken ohne CSS benannt, zehn Website-Module, Verhalten aus solution-tabs', () => {
    const r = freigegeben('tab-nav', '1.5.0')
    const slots = Object.fromEntries(r.anatomy.slots.map((s) => [s.element, s]))
    const scss = scssElemente('scss/scss/06-molecules/_tab-nav.scss', 'nc-tab-nav')
    for (const el of scss) expect(slots[el], el).toBeTruthy()
    // Haken der Website am jeweiligen Element, ohne eigenes CSS
    for (const el of ['.nc-tab-nav__panel', '.nc-tab-nav__features', '.nc-tab-nav__xpanels']) {
      expect(scss.has(el), el).toBe(false)
      expect(slots[el].description, el).toMatch(/Haken/)
    }
    // __badges: im DS gebaut, auf der Website nicht im Markup
    expect(slots['.nc-tab-nav__badges'].optional).toBe(true)
    const module = ['features', 'feature_list', 'bento', 'expanding', 'card_grid', 'hero', 'hero_tom', 'hero_tmob', 'text_media', 'form']
    const notizen = r.anatomy.domNotes.join(' ')
    for (const mod of module) expect(notizen, mod).toMatch(new RegExp(`\\b${mod}\\b`))
    // Verhalten teilt sie mit solution-tabs (Plan v4, Phase 1): keine eigenen keyboard/events
    expect(MIT_VERHALTEN).not.toContain('tab-nav')
    expect(MIT_VERHALTEN).toContain('solution-tabs')
    expect(r.keyboard).toBeUndefined()
    expect(r.events).toBeUndefined()
    expect(r.meta.source.behavior).toMatch(/solution-tabs\.js/)
    expect(r.meta.source.drupal).toMatch(/neoTabNav/)
    expect(r.komposition.find((k) => k.recipe === 'solution-tabs').hinweis).toMatch(/teilt dessen Verhalten/)
    expect(notizen).toMatch(/Pos1\/Ende/)
    // 2.2.2: Befund geschlossen — Pause-Knopf
    expect(r.a11y.base.assertions.join(' ')).toMatch(/2\.2\.2: .*Knopf/)
    expect(r.a11y.base.assertions.join(' ')).not.toMatch(/fehlt \(Befund/)
    // Plan v4, Phase 7, Block 10a: Geruest im Twig, Aufbereitung in includes/neo_tab_nav.inc
    expect(r.meta.pipeline.drupal).toEqual(['block/block--block-content--neo-tab-nav.html.twig', 'block/block--inline-block--neo-tab-nav.html.twig', 'includes/neo_tab_nav.inc (Tabs aus field_tn_tabs, neo_tn_tabs)'])
  })

  it('tbl-cell: 1.5.0, Anatomie wie das SCSS, nur der Text Pflicht, Wertsymbole mit Textalternative, Haken ohne Farbwerte, Twig mit Positivliste', () => {
    const r = freigegeben('tbl-cell', '1.5.0') // 1.5.0: Zellen aus dem Twig, Positivliste (Plan v4, Phase 5)
    // 1.4.0 (Abschluss 3, tabelle-bold): bold an der Zelle -> <strong> in Wertzellen, Zeilenkopf unveraendert
    const boldNotiz = r.anatomy.domNotes.find((n) => n.startsWith('Feld bold'))
    expect(boldNotiz).toMatch(/Wertzellen \(td/)
    expect(boldNotiz).toMatch(/<strong>/)
    expect(boldNotiz).toMatch(/Zeilenkopf \(th\[scope=row\]\) ohne Wirkung/)
    expect(r.anatomy.domNotes.join(' ')).not.toMatch(/bold ohne Wirkung|wertet neoTable nicht aus — fett/)
    anatomieWieScss('tbl-cell', 'scss/scss/05-atoms/_tbl-cell.scss', 'nc-tbl-cell')
    const pflicht = Object.fromEntries(r.anatomy.slots.map((s) => [s.name, !s.optional]))
    expect(pflicht).toEqual({ text: true, 'info-btn': false, sub: false, 'icon-block': false, icon: false })
    expect(Object.keys(r.keyboard).sort()).toEqual(['Enter', 'Space', 'Tab'])
    expect(r.meta.source.drupal).toMatch(/_neo_fe_tbl_zelle/)
    expect(r.meta.pipeline.drupal).toEqual(['block/block--block-content--neo-table.html.twig', 'block/block--inline-block--neo-table.html.twig'])
    expect(r.anatomy.domNotes.join(' ')).toMatch(/br, strong, em, b, i, a, sup, sub/)
    for (const z of zellen('tbl-cell')) {
      const d = dom(z.html)
      for (const svg of d.querySelectorAll('svg.nc-tbl-icon')) {
        expect(svg.getAttribute('aria-label'), z.specimen.id).toMatch(/^(nicht )?enthalten$/)
        expect(svg.getAttribute('role'), z.specimen.id).toBe('img')
        // Farben nur aus _tbl-icon.scss (wie neoTable seit 25.08.2026)
        expect(svg.innerHTML, z.specimen.id).not.toMatch(/fill="#|stroke="black"/)
      }
      for (const knopf of d.querySelectorAll('.nc-tbl-cell__info-btn')) {
        expect(knopf.getAttribute('type')).toBe('button')
        expect(knopf.getAttribute('aria-label')).toMatch(/^Mehr Informationen zu /)
        expect(knopf.getAttribute('data-info-label')).toMatch(/^Informationen zu /)
      }
    }
    expect(r.a11y.base.assertions.join(' ')).toMatch(/1\.1\.1/)
    // Korrektur 1.3.1 (Freigabe ausstehend): Info-Symbol ohne opacity-muted (2,6:1 -> ab 4,59:1)
    const regel = /\.nc-tbl-cell__info-btn\{([^}]*)\}/.exec(readFileSync(resolve(WURZEL, 'styles.css'), 'utf8'))
    expect(regel[1]).toContain('color:var(--fnd-color-text-tertiary)')
    expect(regel[1]).not.toMatch(/opacity:/)
  })

  it('table-block: 1.7.0, Felder und Aufbau wie Drupal, Kopf-Kontrast als Befund, Arena wie die Website-Tabelle', () => {
    const r = freigegeben('table-block', '1.7.0') // 1.4.0 Theme-Bereiche, 1.5.0 breite Tabellen (Restpunkte 09.10.2026), 1.6.0 Token-Auswahl (Plan v4, Phase 4), 1.7.0 Twig + Behavior table-block (Phase 5)
    expect(r.anatomy.slots).toEqual([])
    expect(r.komposition.map((k) => k.recipe)).toEqual(['compare-table', 'tbl-cell'])
    const notizen = r.anatomy.domNotes.join(' ')
    for (const feld of ['field_tbl_variant', 'field_tbl_width', 'field_tbl_sticky_col', 'field_tbl_scroll_bp', 'field_tbl_header_bg']) expect(notizen, feld).toContain(feld)
    // jeder Tabellen-Modifier, den Drupal setzen kann, steht im DS
    const css = readFileSync(resolve(WURZEL, 'styles.css'), 'utf8')
    for (const k of ['striped', 'compact', 'borderless', 'sticky-header', 'full-width', 'sticky-col']) expect(css, k).toContain(`.nc-compare-table--${k}`)
    expect(r.a11y.base.assertions.join(' ')).toMatch(/1,07:1/)
    // Korrektur 1.2.1 (Freigabe ausstehend): erste Kopfzelle mit der Kopfflaeche, nicht background-base
    expect(css).toContain('.nc-table-block .nc-compare-table--sticky-col thead th:first-child{background-color:var(--tbl-header-bg, var(--nc-table-header-bg))')
    // 1.3.0 (Abschluss 3, tabelle-ds): Kopf ohne Farbfeld wie die Vergleichstabelle,
    // nicht mehr background-tertiary (Kopftext 1,43:1)
    expect(css).not.toContain('var(--tbl-header-bg, var(--fnd-color-background-tertiary))')
    expect(css).toMatch(/\.nc-table-block thead th\{background-color:var\(--tbl-header-bg, var\(--nc-table-header-bg\)\)/)
    // Streifen ohne Farbfeld: Token, das im Dunkeln neu bindet (sonst gleich der Tabellenflaeche)
    expect(css).toMatch(/\.nc-table-block\{[^}]*--tbl-stripe-bg: *var\(--nc-table-block-stripe-bg\)/)
    expect(css).toMatch(/--nc-table-block-stripe-bg: *var\(--fnd-color-background-secondary\)/)
    expect(css).toMatch(/\.neo-light-theme,\.customer-light-theme\{--nc-table-block-stripe-bg: *var\(--fnd-color-background-secondary\)\}/)
    // seit 1.4.0 auch :root:is(...) — seitenweites Dunkel per Klasse auf <html> (Restpunkte 09.10.2026)
    expect(css).toMatch(/\.neo-dark-theme,\.customer-dark-theme,:root:is\(\.neo-dark-theme,\.customer-dark-theme\)\{--nc-table-block-stripe-bg: *var\(--fnd-color-background-base\)\}/)
    expect(css).toMatch(/@media\(prefers-color-scheme: *dark\)\{:root:not\(\[data-theme\]\)\{--nc-table-block-stripe-bg: *var\(--fnd-color-background-base\)\}\}/)
    expect(r.styling.tokens).toContain('--nc-table-block-stripe-bg')
    // Textfarbe auf fester Streifenfarbe (aus neo_fe neo-overrides.css uebernommen)
    expect(css).toContain('.nc-table-block[data-tbl-stripe-fest] .nc-compare-table--striped tbody tr:nth-child(even) :is(th,td,.nc-tbl-cell__text,.nc-tbl-cell__sub,.nc-tbl-cell__info-btn,.nc-tbl-icon--dash){color:var(--tbl-stripe-color, var(--fnd-color-text-primary))}')
    // Korrektur 1.2.2 (Abschluss 3, tabelle-scroll): der Block scrollt, der Rahmen
    // schneidet nur (clip ist kein Scroll-Container) und waechst mit der Tabelle;
    // die Vergleichstabelle allein behaelt overflow: hidden
    expect(css).toContain('.nc-table-block>.nc-compare-table{overflow:clip;width:fit-content;min-width:100%}')
    expect(css).toContain('.nc-table-block[data-scroll-active=true] .nc-compare-table--sticky-col thead th:first-child{z-index:calc(var(--mod-table-sticky-z-index, var(--nc-table-sticky-z-index)) + 1)}')
    expect(css).toMatch(/\.nc-table-block \.nc-compare-table--sticky-col :is\(th,td\):first-child\{left:calc\(-1\*var\(--fnd-spacing-06\)\)\}/)
    expect(css).toMatch(/\.nc-compare-table\{[^}]*overflow:hidden/)
    expect(r.anatomy.domNotes.join(' ')).toMatch(/overflow: clip/)
    expect(r.meta.pipeline.drupal).toEqual(['block/block--block-content--neo-table.html.twig', 'block/block--inline-block--neo-table.html.twig'])
    // 1.7.0: Behavior table-block statt neoTable
    expect(MIT_VERHALTEN).toContain('table-block')
    expect(Object.keys(r.keyboard).sort()).toEqual(['ArrowLeft', 'ArrowRight', 'Tab'])
    expect(Object.keys(r.events)).toEqual(['table-block-change'])
    expect(r.meta.source.behavior).toMatch(/table-block\.js; nurAusdruecklich/)
    expect(notizen).not.toMatch(/setzt neoTable|Kein Behavior in neo-behaviors/)
    for (const z of zellen('table-block')) {
      const d = dom(z.html)
      expect(d.querySelectorAll('thead th[scope="col"]').length).toBeGreaterThan(1)
      for (const svg of d.querySelectorAll('svg.nc-tbl-icon')) expect(svg.innerHTML).not.toMatch(/fill="#|stroke="black"/)
    }
  })

  it('table-block 1.6.0: Tabellenfarben als Token-Auswahl (Plan v4, Phase 4, E2 = A) — Achsen, Drupal-Felder, Kontrast, Arena', () => {
    const r = rohesRecipe('table-block')
    // Soll fuer die Listenfelder in Drupal: Feld, Schluessel, Bezeichnung de/en, Deklarationen
    const soll = {
      kopf: { feld: 'field_tbl_kopf_ton', altfeld: 'field_tbl_header_bg', ziel: '.nc-table-block', werte: { standard: [] } },
      streifen: { feld: 'field_tbl_streifen_ton', altfeld: 'field_tbl_stripe_bg', ziel: '.nc-table-block', werte: { standard: [], basis: ['--tbl-stripe-bg: var(--fnd-color-background-base);'] } },
      flaeche: {
        feld: 'field_tbl_flaeche_ton',
        altfeld: 'field_tbl_bg_color',
        ziel: 'section.nc-section',
        werte: { standard: [], erhoeht: ['background-color: var(--fnd-color-surface-elevated);'], basis: ['background-color: var(--fnd-color-background-base);'] }
      }
    }
    const ersetzt = []
    for (const [achse, s] of Object.entries(soll)) {
      const a = r.axes[achse]
      expect(a.drupal, achse).toEqual({ feld: s.feld, altfeld: s.altfeld, ziel: s.ziel })
      expect(Object.keys(a.values), achse).toEqual(Object.keys(s.werte))
      expect(a.values.standard.default, achse).toBe(true)
      for (const [schluessel, v] of Object.entries(a.values)) {
        expect(schluessel, achse).toMatch(/^[a-z]+$/) // Maschinenwert in Drupal
        expect(v.modifier, schluessel).toBeNull() // Inline-Deklarationen, keine Klasse
        expect(v.bezeichnung.de, schluessel).toBeTruthy()
        expect(v.bezeichnung.en, schluessel).toBeTruthy()
        expect(v.drupal.deklarationen, `${achse}.${schluessel}`).toEqual(s.werte[schluessel])
        // nur Token, keine festen Farben
        for (const d of v.drupal.deklarationen) expect(d).toMatch(/^[a-z-]+: var\(--fnd-color-[a-z-]+\);$/)
        for (const alt of v.drupal.ersetzt) ersetzt.push(`${s.altfeld}=${alt}`)
      }
      // a11y: gemessener Kontrast hell und dunkel je Wert
      for (const schluessel of Object.keys(s.werte)) {
        const o = r.a11y.overrides.find((x) => x.when?.axes?.[achse]?.includes(schluessel))
        expect(o?.note, `${achse}.${schluessel}`).toMatch(/hell .*\d+,\d+:1/)
        expect(o.note, `${achse}.${schluessel}`).toMatch(/dunkel .*\d+,\d+:1/)
      }
    }
    // Gedaempft (Ghost-Kopf) ist nicht eingefuehrt (Entscheidung 12.10.2026)
    expect(r.axes.kopf.values.gedaempft).toBeUndefined()
    // jeder Altwert hoechstens einmal; die unbekannten Werte aus Schritt 0 nicht
    expect(new Set(ersetzt).size).toBe(ersetzt.length)
    expect(ersetzt).not.toContain('field_tbl_header_bg=#d9d9d9')
    expect(ersetzt).not.toContain('field_tbl_stripe_bg=#f0f0f0')

    // Arena: je Achse ein Specimen; Deklarationen inline wie Drupal
    for (const achse of Object.keys(soll)) expect(r.specimens.find((sp) => sp.id === achse)?.matrix.axes[achse]).toEqual(Object.keys(soll[achse].werte))
    const recipe = normalisiereRecipe(r)
    const vorlage = vorlageFuer('table-block')
    const html = (id) => specimenAnsicht(recipe.specimens.find((sp) => sp.id === id), recipe, 'table-block', vorlage).zeilen.flatMap((z) => z.zellen).map((z) => dom(z.html))
    const [streifenStandard, streifenBasis] = html('streifen')
    expect(streifenStandard.querySelector('.nc-table-block').hasAttribute('style')).toBe(false)
    expect(streifenBasis.querySelector('.nc-table-block').getAttribute('style')).toBe('--tbl-stripe-bg: var(--fnd-color-background-base);')
    const [flStandard, flErhoeht, flBasis] = html('flaeche')
    expect(flStandard.querySelector('section.nc-section').hasAttribute('style')).toBe(false)
    expect(flErhoeht.querySelector('section.nc-section').getAttribute('style')).toBe('background-color: var(--fnd-color-surface-elevated);')
    expect(flBasis.querySelector('section.nc-section > .nc-container > .nc-section-header .nc-section-header__title')).not.toBeNull()
    expect(flBasis.querySelector('section.nc-section .nc-table-block')).not.toBeNull()
    // Specimen default unveraendert: kein Inline-Stil, keine Section
    for (const d of html('default')) {
      expect(d.querySelector('.nc-table-block').hasAttribute('style')).toBe(false)
      expect(d.querySelector('section')).toBeNull()
    }
  })
})
