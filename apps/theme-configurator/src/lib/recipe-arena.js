// @ts-check
// ==========================================================================
// Recipe-Arena — aus einem Recipe die Vorschau-Zellen bauen
// ==========================================================================
// In Drupal 11 entstehen die Komponenten aus denselben Recipes. Die Arena im
// Konfigurator soll deshalb ebenfalls aus dem Recipe kommen und nicht aus
// einer handgeschriebenen Vue-Datei je Bauteil.
//
// Ablauf je Specimen:
//   1. normalisiereRecipe()   Altformen (Achsen als Liste, States als Liste,
//                             Klassen mit Punkt) auf die Form bringen, die das
//                             recipe-sdk erwartet — ohne die JSON anzufassen.
//   2. expandSpecimenMatrix() (SDK) Achsen × Zustaende → Zellen, inkl.
//                             applyStateRules().
//   3. baueModell()           Klassen (resolveClassList), Token-Gruppen
//                             (resolveTokenGroups + Zustandsregeln),
//                             slotConfig/renderHint (renderModel), Attribute.
//   4. renderZelle()          Vorlage aus src/arena-templates/<id>.js oder,
//                             ohne Vorlage, eine Slot-Heuristik.
//
// Alles hier ist pur (kein Vue, kein DOM) und damit ohne Mount testbar.
// ==========================================================================

import {
  loadRecipe,
  expandSpecimenMatrix,
  resolveClassList,
  resolveTokenGroups,
  renderModel,
  specimenTokenGroups,
  capitalize
} from 'recipe-sdk'

// ---------------------------------------------------------------------------
// Zustaende
// ---------------------------------------------------------------------------
// Das DS-CSS (scss/scss) kennt fuer einige Zustaende Klassen: .is-active,
// .is-open, .is-selected, .is-pressed, .is-loading, .is-disabled sowie
// Modifier wie nc-<bauteil>--error / --disabled. Fuer :hover und :focus gibt
// es KEINE Zustandsklassen — diese Zellen zeigen den Ruhezustand und werden
// als „nur interaktiv" markiert.
const ZUSTAND_KLASSE = {
  active: 'is-active',
  open: 'is-open',
  expanded: 'is-open',
  selected: 'is-selected',
  pressed: 'is-pressed',
  loading: 'is-loading',
  disabled: 'is-disabled'
}

const ZUSTAND_MODIFIER = {
  error: '--error',
  invalid: '--error',
  disabled: '--disabled',
  // Drag-Zustand setzt das DS per JS als Klasse (z. B. nc-file-upload--dragging)
  dragging: '--dragging'
}

const ZUSTAND_ATTRIBUTE = {
  disabled: { 'aria-disabled': 'true' },
  selected: { 'aria-selected': 'true' },
  pressed: { 'aria-pressed': 'true' },
  expanded: { 'aria-expanded': 'true' },
  open: { 'data-state': 'open' },
  loading: { 'aria-busy': 'true' },
  error: { 'aria-invalid': 'true' },
  invalid: { 'aria-invalid': 'true' },
  readonly: { 'aria-readonly': 'true' }
}

/**
 * Zustaende, die sich ohne Pseudoklasse nicht zeigen lassen. (swiping nicht:
 * das DS kennt .is-swiping am Toast, die Vorlage zeigt es mit den Werten,
 * die das JS waehrend der Geste setzt.)
 */
export const NUR_INTERAKTIV = new Set([
  'hover', 'focus', 'focus-visible', 'focus-within'
])

const ZUSTAND_LABEL = {
  default: 'Standard',
  hover: 'Hover',
  focus: 'Fokus',
  'focus-visible': 'Fokus sichtbar',
  active: 'Aktiv',
  disabled: 'Deaktiviert',
  selected: 'Ausgewählt',
  checked: 'Angehakt',
  indeterminate: 'Unbestimmt',
  open: 'Geöffnet',
  expanded: 'Aufgeklappt',
  loading: 'Lädt',
  pressed: 'Gedrückt',
  readonly: 'Schreibgeschützt',
  error: 'Fehler',
  visible: 'Sichtbar',
  hidden: 'Verborgen',
  filled: 'Befüllt',
  'not-empty': 'Befüllt',
  scrolled: 'Gescrollt',
  dismissing: 'Schließt',
  dragging: 'Ziehen',
  swiping: 'Wischen',
  unread: 'Ungelesen',
  skeleton: 'Platzhalter',
  empty: 'Leer',
  'mobile-open': 'Mobil geöffnet'
}

export function zustandLabel (state) {
  return ZUSTAND_LABEL[state] || capitalize(state)
}

// ---------------------------------------------------------------------------
// Helfer
// ---------------------------------------------------------------------------

export function esc (text) {
  return String(text ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** `.nc-a__b` / `button.nc-a` / `.x > .y` / `a | b` → { tag, klassen } */
export function parseSelektor (selektor) {
  if (!selektor || typeof selektor !== 'string') return { tag: null, klassen: [] }
  let s = selektor.split('|')[0].split(',')[0].trim()
  // letzter Teil einer Kombinator-Kette
  const teile = s.split(/\s*[>+~\s]\s*/).filter(Boolean)
  s = teile[teile.length - 1] || ''
  // Pseudoklassen/-elemente und Attributselektoren entfernen
  s = s.replace(/::?[\w-]+(\([^)]*\))?/g, '').replace(/\[[^\]]*\]/g, '')
  const tagTreffer = s.match(/^[a-z][a-z0-9-]*/i)
  const tag = tagTreffer ? tagTreffer[0].toLowerCase() : null
  const klassen = (s.match(/\.[\w*-]+/g) || [])
    .map((k) => k.slice(1))
    .filter((k) => !k.includes('*'))
  return { tag, klassen }
}

function alsKlasse (k) {
  return String(k || '').trim().replace(/^\./, '')
}

// ---------------------------------------------------------------------------
// 1. Normalisieren
// ---------------------------------------------------------------------------

function achsenAlsObjekt (axes) {
  const liste = Array.isArray(axes)
    ? axes.map((a) => [a?.name || a?.id, a])
    : Object.entries(axes || {})
  const ergebnis = {}
  for (const [name, achse] of liste) {
    if (!name || !achse) continue
    let values = achse.values || {}
    if (Array.isArray(values)) {
      const obj = {}
      for (const v of values) {
        if (typeof v === 'string') obj[v] = { modifier: null, tokenGroups: [] }
        else if (v && (v.value ?? v.id) != null) obj[v.value ?? v.id] = v
      }
      values = obj
    }
    const saubere = {}
    for (const [wert, def] of Object.entries(values)) {
      saubere[wert] = {
        ...(def || {}),
        modifier: def?.modifier ? alsKlasse(def.modifier) : null,
        tokenGroups: Array.isArray(def?.tokenGroups) ? def.tokenGroups : []
      }
    }
    ergebnis[name] = { ...achse, values: saubere }
  }
  return ergebnis
}

function zustaendeAlsObjekt (states) {
  if (Array.isArray(states)) {
    return { supported: states, precedence: states, rules: [] }
  }
  const s = states || {}
  return {
    ...s,
    supported: s.supported || ['default'],
    precedence: s.precedence || s.supported || ['default'],
    // Manche Recipes fuehren Regeln als Fliesstext — die sind Doku, keine Regel.
    rules: (s.rules || []).filter((r) => r && typeof r === 'object' && r.state)
  }
}

function saubereSpecimen (specimen, axes, hinweise) {
  const roh = specimen.matrix?.axes || specimen.matrix || {}
  const saubereAchsen = {}
  for (const [achse, eintrag] of Object.entries(roh)) {
    if (achse === 'states') continue
    const def = axes[achse]
    if (!def) {
      hinweise.push(`Specimen „${specimen.id}": Achse „${achse}" fehlt im Recipe`)
      continue
    }
    if (eintrag === '*') { saubereAchsen[achse] = '*'; continue }
    const werte = (Array.isArray(eintrag) ? eintrag : [eintrag]).map(String)
    const gueltig = werte.filter((w) => w in def.values)
    for (const w of werte) {
      if (!(w in def.values)) hinweise.push(`Specimen „${specimen.id}": Wert „${w}" fehlt auf Achse „${achse}"`)
    }
    if (gueltig.length) saubereAchsen[achse] = gueltig
  }
  const states = Array.isArray(specimen.matrix?.states) && specimen.matrix.states.length
    ? specimen.matrix.states
    : ['default']
  return { ...specimen, matrix: { axes: saubereAchsen, states } }
}

/**
 * Bringt ein Recipe (roh oder aus loadRecipe) in die Form, mit der die
 * SDK-Funktionen arbeiten. Das Original wird nicht veraendert.
 */
export function normalisiereRecipe (raw) {
  const r = loadRecipe(raw)
  const hinweise = []
  const axes = achsenAlsObjekt(r.axes)
  const states = zustaendeAlsObjekt(r.states)

  const rootSel = parseSelektor(r.anatomy?.root?.element)
  let baseClasses = (r.styling?.baseClasses || []).map(alsKlasse).filter(Boolean)
  if (!baseClasses.length && rootSel.klassen.length) {
    baseClasses = [rootSel.klassen[0]]
    hinweise.push('styling.baseClasses fehlt — aus anatomy.root.element abgeleitet')
  }

  const slots = (Array.isArray(r.anatomy?.slots) ? r.anatomy.slots : [])
    .filter((s) => s && s.name)
    .map((s) => {
      const sel = parseSelektor(s.element)
      return {
        name: s.name,
        tag: sel.tag,
        klassen: sel.klassen,
        optional: s.optional === true || (s.optional == null && s.required === false)
      }
    })

  let specimens = (r.specimens || []).map((s) => saubereSpecimen(s, axes, hinweise))
  if (!specimens.length) {
    hinweise.push('keine Specimens — Standard-Specimen ergaenzt')
    specimens = [{
      id: 'standard',
      label: 'Standard',
      matrix: { axes: {}, states: ['default'] },
      layout: 'single',
      render: {}
    }]
  }

  return {
    ...r,
    // loadRecipe() reicht nur die neun kanonischen Abschnitte durch; `api`
    // (Element je Variante, z. B. <button>/<a>) braucht die Arena aber.
    api: raw.api || r.api || null,
    axes,
    states,
    styling: {
      ...(r.styling || {}),
      baseClasses,
      baseTokenGroups: Array.isArray(r.styling?.baseTokenGroups) ? r.styling.baseTokenGroups : [],
      tokenGroups: r.styling?.tokenGroups && !Array.isArray(r.styling.tokenGroups) ? r.styling.tokenGroups : {}
    },
    specimens,
    arena: {
      rootTag: rootSel.tag,
      slots,
      hinweise
    }
  }
}

// ---------------------------------------------------------------------------
// 2. Zellen
// ---------------------------------------------------------------------------

/** Achsen, die in diesem Specimen mehr als einen Wert haben. */
export function variierendeAchsen (specimen, recipe) {
  const achsen = specimen.matrix?.axes || {}
  return Object.entries(achsen)
    .filter(([name, eintrag]) => {
      const anzahl = eintrag === '*' ? Object.keys(recipe.axes[name]?.values || {}).length : eintrag.length
      return anzahl > 1
    })
    .map(([name]) => name)
}

export function zellenFuer (specimen, recipe) {
  return expandSpecimenMatrix(specimen, recipe)
}

export function specimenGruppen (specimen, recipe) {
  if (specimen.focusTokenGroups?.length) return [...specimen.focusTokenGroups]
  return specimenTokenGroups(
    specimen,
    recipe.axes,
    recipe.styling.baseTokenGroups,
    recipe.states.rules
  )
}

// ---------------------------------------------------------------------------
// 3. Modell je Zelle
// ---------------------------------------------------------------------------

function attributWert (wert) {
  if (wert === true) return 'true'
  if (wert === false) return 'false'
  const s = String(wert)
  return s.includes('|') ? s.split('|')[0] : s
}

export function attributString (attribute) {
  return Object.entries(attribute)
    .map(([k, v]) => (v === '' ? ` ${k}` : ` ${k}="${esc(v)}"`))
    .join('')
}

function beschriftung (specimen, zelle, recipe) {
  const vorgabe = specimen.render?.label
  if (typeof vorgabe === 'string' && vorgabe.trim()) {
    const text = vorgabe.replace(/\{(\w+)\}/g, (_, achse) => {
      if (achse === 'state') return zustandLabel(zelle.states?.[0] || 'default')
      return zelle.axisValues?.[achse] ?? ''
    }).trim()
    if (text) return capitalize(text)
  }
  const name = recipe.meta?.component || 'Bauteil'
  return name.split('-').map(capitalize).join(' ')
}

/**
 * Das Modell, das Vorlagen und Heuristik bekommen.
 * `optionen.ausprobieren`: die Zelle wird als lebendige Instanz gebunden
 * (RecipeArena „Ausprobieren") — Overlays starten dann geschlossen, das
 * Verhalten aus neo-behaviors oeffnet sie (m.ausprobieren).
 * @param {{ ausprobieren?: boolean }} [optionen]
 */
export function baueModell (zelle, specimen, recipe, componentId, optionen = {}) {
  const root = recipe.styling.baseClasses[0] || componentId
  const klassen = resolveClassList(zelle, recipe)
  const basisKlassen = [...new Set(klassen.filter(Boolean))]
  const rm = renderModel(zelle, recipe)
  const zustand = zelle.resolvedState || { attributes: {}, tokenGroups: [] }
  const zustaende = (zelle.states || ['default']).filter((s) => s !== 'default')

  const attribute = {}
  for (const s of zustaende) {
    if (ZUSTAND_KLASSE[s]) klassen.push(ZUSTAND_KLASSE[s])
    if (ZUSTAND_MODIFIER[s]) klassen.push(root + ZUSTAND_MODIFIER[s])
    Object.assign(attribute, ZUSTAND_ATTRIBUTE[s] || {})
    if (NUR_INTERAKTIV.has(s)) attribute['data-zustand'] = s
  }
  for (const [k, v] of Object.entries(zustand.attributes || {})) {
    attribute[k.replace(/\?$/, '')] = attributWert(v)
  }
  // `disabled` gehoert nur an Elemente, die es kennen — das entscheidet die
  // Vorlage/Heuristik ueber m.deaktiviert. Im Attribut-String bleibt aria-disabled.
  const deaktiviert = zustaende.includes('disabled') || 'disabled' in attribute
  delete attribute.disabled

  const slotConfig = { ...rm.slotConfig, ...(zelle.slotConfig || {}) }
  const slotDefs = recipe.arena?.slots || []
  const slotAktiv = (name) => {
    if (slotConfig[name] === false) return false
    if (slotConfig[name]) return true
    const def = slotDefs.find((s) => s.name === name)
    return def ? !def.optional : false
  }

  const tokenGroups = [...new Set([
    ...resolveTokenGroups(zelle, recipe),
    ...(zustand.tokenGroups || [])
  ])]

  const eindeutig = [...new Set(klassen.filter(Boolean))]

  return {
    id: componentId,
    // eindeutig je Zelle — fuer id/for/name/aria-labelledby in Vorlagen
    uid: `${componentId}-${specimen.id}-${zelle.id || 'standard'}`.replace(/[^\w-]+/g, '-'),
    zelle,
    specimen,
    recipe,
    root,
    klassen: eindeutig,
    klasse: eindeutig.join(' '),
    // nur Basis + Achsen-Modifier — fuer Vorlagen, die den Zustand an ein
    // Kindelement haengen (z. B. selected an die Tabellenzeile)
    basisKlasse: basisKlassen.join(' '),
    attribute,
    attrs: attributString(attribute),
    attrsOhne: (...namen) => attributString(Object.fromEntries(
      Object.entries(attribute).filter(([k]) => !namen.includes(k))
    )),
    achsen: zelle.axisValues || {},
    wert: (achse) => zelle.axisValues?.[achse],
    zustaende,
    hat: (state) => zustaende.includes(state),
    deaktiviert,
    slotConfig,
    slot: slotAktiv,
    slotKlasse: (name) => {
      const def = slotDefs.find((s) => s.name === name)
      return def?.klassen?.[0] || `${root}__${name}`
    },
    text: beschriftung(specimen, zelle, recipe),
    renderHint: rm.renderHint,
    elementHint: rm.elementHint,
    templateId: rm.templateId,
    tokenGroups,
    nurInteraktiv: zustaende.filter((s) => NUR_INTERAKTIV.has(s)),
    ausprobieren: !!optionen.ausprobieren
  }
}

// ---------------------------------------------------------------------------
// 4. Heuristik (ohne Vorlage)
// ---------------------------------------------------------------------------

const VOID = new Set(['input', 'img', 'hr', 'br', 'source'])

const SYMBOL = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 8v4l2.5 2.5"/></svg>'
const KREUZ = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>'
const BILD = '<svg viewBox="0 0 160 90" width="160" height="90" role="img" aria-label="Platzhalterbild"><rect width="160" height="90" fill="currentColor" opacity=".12"/><path d="M0 90 55 40l35 30 20-15 50 35z" fill="currentColor" opacity=".2"/></svg>'

const KIND_VON = {
  item: ['list', 'group', 'menu', 'nav', 'items', 'grid', 'track'],
  trigger: ['list'],
  option: ['panel', 'list', 'menu'],
  link: ['list', 'nav'],
  'nav-link': ['nav'],
  cell: ['row'],
  fill: ['track'],
  thumb: ['track']
}

const WIEDERHOLT = new Set(['item', 'trigger', 'option', 'link', 'nav-link', 'cell', 'card'])

function art (name) {
  const n = name.toLowerCase()
  const t = (...w) => w.some((x) => n === x || n.endsWith('-' + x))
  if (t('close', 'remove', 'clear', 'dismiss')) return 'schliessen'
  if (t('icon', 'arrow', 'caret', 'chevron', 'indicator', 'spinner', 'dot', 'marker', 'check')) return 'symbol'
  if (t('media', 'image', 'picture', 'thumbnail', 'img', 'poster', 'logo', 'avatar')) return 'bild'
  if (t('input', 'field')) return 'eingabe'
  if (t('trigger', 'action', 'cta', 'button', 'btn', 'toggle', 'prev', 'next', 'increment', 'decrement')) return 'knopf'
  if (t('link')) return 'link'
  if (t('separator', 'divider')) return 'trenner'
  if (t('backdrop', 'overlay', 'scrim', 'track', 'fill', 'thumb', 'progress', 'bar', 'mesh', 'canvas')) return 'leer'
  if (t('actions', 'footer-actions', 'cta-area')) return 'aktionen'
  if (t('title', 'heading', 'headline', 'name', 'kicker', 'eyebrow')) return 'titel'
  if (t('label', 'text', 'value', 'count', 'badge', 'tag', 'required', 'shortcut', 'date', 'role')) return 'kurztext'
  if (t('description', 'lead', 'subtext', 'hint', 'note', 'meta', 'body', 'content', 'answer', 'quote', 'error', 'message', 'caption', 'info', 'details', 'summary')) return 'text'
  return 'behaelter'
}

function slotInhalt (slot, m) {
  switch (art(slot.name)) {
    case 'schliessen': return KREUZ
    case 'symbol': return SYMBOL
    case 'bild': return BILD
    case 'titel': return esc(m.text)
    case 'kurztext':
      if (slot.name.endsWith('count')) return '3'
      if (slot.name.endsWith('required')) return '*'
      return esc(m.text)
    case 'text': return 'Kurzer Beispieltext für diese Fläche.'
    case 'knopf': return esc(m.text)
    case 'link': return 'Verweis'
    case 'aktionen': return '<button class="nc-button nc-button--sm" type="button">Aktion</button>'
    default: return ''
  }
}

function slotTag (slot) {
  if (slot.tag) return slot.tag
  switch (art(slot.name)) {
    case 'schliessen':
    case 'knopf': return 'button'
    case 'link': return 'a'
    case 'eingabe': return 'input'
    case 'titel': return 'strong'
    case 'text': return 'p'
    case 'trenner':
    case 'kurztext':
    case 'symbol': return 'span'
    default: return 'div'
  }
}

function element (tag, klassen, attrs, inhalt) {
  const k = klassen.length ? ` class="${klassen.join(' ')}"` : ''
  if (VOID.has(tag)) return `<${tag}${k}${attrs}>`
  return `<${tag}${k}${attrs}>${inhalt}</${tag}>`
}

const PLATZHALTER_SRC = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 16 9%22%3E%3Crect width=%2216%22 height=%229%22 fill=%22%23ccd%22/%3E%3C/svg%3E'

function eingabeTyp (m) {
  const id = String(m.id || '')
  if (/checkbox|switch/.test(id)) return 'checkbox'
  if (/radio/.test(id)) return 'radio'
  if (/range/.test(id)) return 'range'
  return 'text'
}

function eingabeAttrs (m) {
  const typ = eingabeTyp(m)
  let a = ` type="${typ}"`
  if (typ === 'text') a += ` placeholder="${esc(m.text)}"`
  else a += ` aria-label="${esc(m.text)}"`
  if ((typ === 'checkbox' || typ === 'radio') && (m.hat('checked') || m.hat('selected'))) a += ' checked'
  if (m.deaktiviert) a += ' disabled'
  return a
}

/** Sichtbare Slot-Beschriftung fuer die Heuristik (Klasse ra-slot-name). */
export function slotBeschriftung (name) {
  return `<span class="ra-slot-name" aria-hidden="true">${esc(name)}</span>`
}

function slotHtml (slot, m, kinder, nummer) {
  const tag = slotTag(slot)
  let attrs = ''
  if (tag === 'button') {
    attrs = ' type="button"'
    if (art(slot.name) === 'schliessen') attrs += ' aria-label="Schließen"'
  }
  if (tag === 'a') attrs = ' href="#" onclick="return false"'
  if (tag === 'input') attrs = eingabeAttrs(m)
  if (tag === 'img') attrs = ` alt="" src="${PLATZHALTER_SRC}"`
  let inhalt = kinder.length ? kinder.join('') : slotInhalt(slot, m)
  if (nummer && !kinder.length && inhalt === esc(m.text)) inhalt = `${esc(m.text)} ${nummer}`
  // Leerer Behaelter ohne Vorlage: Slotnamen zeigen statt einer leeren
  // grauen Flaeche (die Beschriftung gehoert zur Arena, nicht zum DS).
  if (!inhalt && !kinder.length && art(slot.name) === 'behaelter' && !VOID.has(tag)) inhalt = slotBeschriftung(slot.name)
  return element(tag, slot.klassen, attrs, inhalt)
}

const ROLLEN = new Set(['radiogroup', 'group', 'region', 'list', 'listbox', 'tablist', 'menu', 'toolbar'])

/**
 * Baut Markup aus der Anatomie: alle aktiven Slots (Pflicht + per slotConfig
 * eingeschaltete), einfache Verschachtelung (item in list, fill in track,
 * foo-bar in foo), Klassen aus korrekt geparsten Selektoren.
 */
export function renderHeuristik (m) {
  const recipe = m.recipe
  const slots = (recipe.arena?.slots || []).filter((s) => m.slot(s.name) && (s.klassen.length || s.tag))
  const namen = new Set(slots.map((s) => s.name))

  const elternVon = (name) => {
    for (const eltern of KIND_VON[name] || []) if (namen.has(eltern)) return eltern
    const praefix = name.includes('-') ? name.slice(0, name.lastIndexOf('-')) : null
    if (praefix && namen.has(praefix)) return praefix
    return null
  }

  const kinderVon = new Map()
  const wurzel = []
  for (const s of slots) {
    const e = elternVon(s.name)
    if (e) {
      if (!kinderVon.has(e)) kinderVon.set(e, [])
      kinderVon.get(e).push(s)
    } else {
      wurzel.push(s)
    }
  }

  const baue = (slot, tiefe = 0, nummer = 0) => {
    const kinder = tiefe > 4 ? [] : (kinderVon.get(slot.name) || []).flatMap((k) => (
      WIEDERHOLT.has(k.name)
        ? [1, 2, 3].map((n) => baue(k, tiefe + 1, n))
        : [baue(k, tiefe + 1, nummer)]
    ))
    return slotHtml(slot, m, kinder, nummer)
  }

  let tag = recipe.api?.elements?.default?.element || recipe.arena?.rootTag || 'div'
  let extra = ''
  if (m.elementHint) {
    if (ROLLEN.has(m.elementHint)) extra += ` role="${m.elementHint}"`
    else if (/^[a-z][a-z0-9]*$/.test(m.elementHint)) tag = m.elementHint
  }
  if (tag === 'button') extra += ' type="button"' + (m.deaktiviert ? ' disabled' : '')
  if (tag === 'a') extra += ' href="#" onclick="return false"'
  if (tag === 'input') extra += eingabeAttrs(m)
  if (tag === 'img') extra += ` alt="" src="${PLATZHALTER_SRC}"`

  if (VOID.has(tag)) return element(tag, m.klassen, extra + m.attrs, '')
  if (tag === 'select') {
    return element('select', m.klassen, extra + m.attrs + (m.deaktiviert ? ' disabled' : ''), `<option>${esc(m.text)}</option>`)
  }
  const inhalt = wurzel.map((s) => baue(s)).join('') || esc(m.text)
  return element(tag, m.klassen, extra + m.attrs, inhalt)
}

// ---------------------------------------------------------------------------
// 5. Zelle rendern
// ---------------------------------------------------------------------------

/**
 * @param {{ ausprobieren?: boolean }} [optionen]
 * @returns {{ html: string, quelle: 'vorlage'|'heuristik', modell: object }}
 */
export function renderZelle (zelle, specimen, recipe, componentId, vorlage, optionen = {}) {
  const modell = baueModell(zelle, specimen, recipe, componentId, optionen)
  if (vorlage) {
    return { html: vorlage(zelle, modell), quelle: 'vorlage', modell }
  }
  return { html: renderHeuristik(modell), quelle: 'heuristik', modell }
}

// ---------------------------------------------------------------------------
// Flaeche (Theme-Achse)
// ---------------------------------------------------------------------------
// Dunkle Bereiche schaltet das DS ueber die Theme-Klasse am Wrapper: in
// .neo-dark-theme wird das komplette --fnd-color-*-Buendel lokal neu gebunden
// (00-settings/_color-themes.scss). Drupal macht es genauso: field_surface
// „dunkel" setzt am Block-Wrapper „neo-dark-theme neo-surface"
// (neo_fe_preprocess_block, neo_fe.theme); .neo-surface malt die Flaeche.
//   'dunkel'  Theme-/Flaechen-Achse steht auf inverse/dark/on-dark
//             (footer theme=inverse, app-store surface=dark)
//   'invers'  Vordergrund fuer dunklen Grund (color=inverse, render.bgVariant
//             dark): text-inverse gehoert auf background-inverse im
//             aktuellen Theme — NICHT in .neo-dark-theme, dort kippt inverse.
const THEMEN_ACHSEN = new Set(['theme', 'surface'])
const DUNKLE_WERTE = new Set(['inverse', 'dark', 'on-dark'])

export function zellenFlaeche (zelle, specimen) {
  for (const [achse, wert] of Object.entries(zelle.axisValues || {})) {
    if (THEMEN_ACHSEN.has(achse) && DUNKLE_WERTE.has(String(wert))) return 'dunkel'
  }
  const render = specimen?.render || {}
  if (render.bgVariant === 'dark' || render.background === 'dark') return 'invers'
  // Farbvergleiche (color: '*'): die inverse Zelle braucht ihren Grund, sonst
  // steht Weiss auf Weiss. Kompositionen (z. B. Spinner im Button) bringen
  // ihren Grund selbst mit.
  if (zelle.axisValues?.color === 'inverse' && !render.compositionType) return 'invers'
  return null
}

// ---------------------------------------------------------------------------
// Split-Modus: dieselbe Zelle zweimal im Dokument
// ---------------------------------------------------------------------------
// Hell und dunkel stehen im Split-Modus nebeneinander — dasselbe Markup also
// zweimal. Doppelte ids brechen for/aria-*-Bezuege, und Radios mit gleichem
// name bilden EINE Gruppe: das zweite `checked` hebt das erste auf. Die
// zweite Vorschau bekommt deshalb eigene ids und names.
const BEZUGS_ATTRIBUTE = /(\s(?:id|for|name|aria-labelledby|aria-describedby|aria-controls|aria-owns|aria-activedescendant|list|form)=")([^"]*)"/g

/**
 * @param {string} html
 * @param {string} suffix  z. B. '-t2'
 * @returns {string}
 */
export function fuerWeiteresThema (html, suffix) {
  return html.replace(BEZUGS_ATTRIBUTE, (_, anfang, wert) => (
    `${anfang}${wert.split(/\s+/).filter(Boolean).map((t) => t + suffix).join(' ')}"`
  ))
}

/** Klassen fuer den Zellen-Wrapper (RecipeArena). */
export function flaecheKlassen (flaeche) {
  if (flaeche === 'dunkel') return 'neo-dark-theme neo-surface ra-flaeche'
  if (flaeche === 'invers') return 'ra-flaeche ra-flaeche--invers'
  return ''
}

/** Beschriftung einer Zelle: variierende Achsenwerte + Zustand. */
export function zellenLabel (zelle, variierend) {
  const teile = variierend.map((a) => zelle.axisValues?.[a]).filter(Boolean)
  const zustaende = (zelle.states || []).filter((s) => s !== 'default')
  for (const s of zustaende) teile.push(zustandLabel(s) + (NUR_INTERAKTIV.has(s) ? ' *' : ''))
  return teile.length ? teile.join(' · ') : 'Standard'
}

/**
 * Alles, was die Arena fuer ein Specimen braucht, in einem Aufruf.
 * @param {{ ausprobieren?: boolean }} [optionen] siehe baueModell()
 */
export function specimenAnsicht (specimen, recipe, componentId, vorlage, optionen = {}) {
  const variierend = variierendeAchsen(specimen, recipe)
  const zellen = zellenFuer(specimen, recipe).map((zelle) => {
    /** @type {{ html: string, quelle: string, fehler?: string, modell: any }} */
    let ergebnis
    try {
      ergebnis = renderZelle(zelle, specimen, recipe, componentId, vorlage, optionen)
    } catch (err) {
      ergebnis = {
        html: `<div class="ra-fallback">Vorschau nicht darstellbar: ${esc(err.message)}</div>`,
        quelle: 'fehler',
        fehler: err.message,
        modell: { tokenGroups: [] }
      }
    }
    return {
      id: zelle.id || 'standard',
      label: zellenLabel(zelle, variierend),
      html: ergebnis.html,
      quelle: ergebnis.quelle,
      fehler: ergebnis.fehler,
      tokenGroups: ergebnis.modell.tokenGroups,
      axisValues: zelle.axisValues,
      // Vorlagen mit eigener Flaechen-Achse (Hero: surface ist die Flaeche
      // des Blocks, nicht das Seiten-Thema) setzen vorlage.eigeneFlaeche
      flaeche: vorlage?.eigeneFlaeche ? null : zellenFlaeche(zelle, specimen),
      nurInteraktiv: (zelle.states || []).some((s) => NUR_INTERAKTIV.has(s))
    }
  // Leere Ausgabe der Vorlage: die Zelle gehoert zu einer Sammelzelle (z. B.
  // mehrere Toasts in EINEM Toaster — die erste Zelle zeigt alle).
  }).filter((z) => z.html !== '')

  const rowAxis = specimen.layoutConfig?.rowAxis
  let zeilen
  if (rowAxis && variierend.includes(rowAxis)) {
    const map = new Map()
    for (const z of zellen) {
      const key = z.axisValues?.[rowAxis] ?? '_'
      if (!map.has(key)) map.set(key, { key, label: key, zellen: [] })
      map.get(key).zellen.push(z)
    }
    zeilen = [...map.values()]
  } else {
    zeilen = [{ key: '_', label: null, zellen }]
  }

  const layer = String(recipe.meta?.layer || '')
  const gestapelt = ['block', 'stack', 'column', 'composition'].includes(specimen.layout) ||
    layer.includes('organism')

  return {
    id: specimen.id,
    label: specimen.label || specimen.id,
    description: specimen.description || '',
    tokenGroups: specimenGruppen(specimen, recipe),
    anordnung: gestapelt ? 'stapel' : (specimen.layout === 'single' ? 'einzeln' : 'reihe'),
    zeilen,
    zellenAnzahl: zellen.length,
    nurInteraktiv: zellen.some((z) => z.nurInteraktiv),
    achsen: Object.entries(specimen.matrix?.axes || {}).map(([name, v]) => ({
      name,
      werte: v === '*' ? 'alle' : v.join(', ')
    }))
  }
}
