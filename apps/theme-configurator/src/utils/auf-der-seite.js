// @ts-check
/**
 * @file
 * „Auf der Seite“ (Schritt f, 19.10.2026): Wo wirkt ein Grundlagen-Wert?
 *
 * Gemessen statt behauptet: Für jedes Element des Website-Ausschnitts werden
 * die berechneten Stile gelesen und den Tokens der Kategorie zugeordnet, deren
 * Werte im Ausschnitt selbst aufgelöst sind (also mit den Werten des
 * geöffneten Themes). Ein Element mit 6 px Eckenradius bekommt „Radius MD ·
 * 6 px“, weil --fnd-radius-md dort 6 px ergibt.
 */

/**
 * @typedef {{ name: string, label: string, cssVar: string }} TokenInfo
 * @typedef {{ el: Element, text: string, polster?: number[] }} Markierung
 */

/** Grundlagen-Kategorie je Bereich (foundationTokens-Schlüssel bzw. Sonderfall) */
export const KATEGORIE_JE_BEREICH = Object.freeze({
  'foundation-radius': 'radius',
  'foundation-spacing': 'spacing',
  'foundation-size': 'size',
  'foundation-border': 'border',
  'foundation-shadows': 'shadow',
  'foundation-opacity': 'opacity',
  'foundation-icons': 'icons',
  'foundation-typography': 'typography',
  'foundation-focus': 'focus',
  'foundation-surfaces': 'surfaces',
})

const px = (v) => { const n = parseFloat(v); return Number.isFinite(n) ? Math.round(n * 100) / 100 : NaN }
const fmt = (n) => String(Math.round(n * 10) / 10).replace('.', ',')

/**
 * Löst Tokens im Ausschnitt auf: Länge über ein Mess-Element, sonst den Text.
 * @param {HTMLElement} wurzel
 * @param {TokenInfo[]} tokens
 * @param {'laenge'|'text'} art
 */
export function loeseTokens (wurzel, tokens, art) {
  const ansicht = wurzel.ownerDocument.defaultView
  const probe = wurzel.ownerDocument.createElement('div')
  probe.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none;'
  wurzel.appendChild(probe)
  const aus = tokens.map((t) => {
    if (art === 'laenge') {
      probe.style.width = `var(${t.cssVar})`
      return { ...t, wert: px(ansicht.getComputedStyle(probe).width) }
    }
    probe.style.boxShadow = `var(${t.cssVar})`
    const schatten = ansicht.getComputedStyle(probe).boxShadow
    return { ...t, wert: t.cssVar.includes('shadow') ? schatten : ansicht.getComputedStyle(wurzel).getPropertyValue(t.cssVar).trim() }
  })
  probe.remove()
  return aus
}

/** Token, dessen Länge dem Wert entspricht (±0,5 px); null, wenn keiner passt */
export function passendeLaenge (wert, aufgeloest) {
  if (!(wert > 0)) return null
  return aufgeloest.find((t) => Math.abs(t.wert - wert) <= 0.5) || null
}

const SICHTBAR = (el, ansicht) => {
  const r = el.getBoundingClientRect()
  return r.width > 0 && r.height > 0 && ansicht.getComputedStyle(el).visibility !== 'hidden'
}

/**
 * Markierungen einer Kategorie im Ausschnitt.
 * @param {HTMLElement} wurzel  Seite des Ausschnitts
 * @param {string} kategorie
 * @param {Record<string, { tokens: Record<string, { label?: string, cssVar: string }> }>} foundationTokens
 * @returns {Markierung[]}
 */
export function markierungen (wurzel, kategorie, foundationTokens) {
  const ansicht = wurzel.ownerDocument.defaultView
  const cs = (el) => ansicht.getComputedStyle(el)
  const liste = (kat) => Object.entries(foundationTokens?.[kat]?.tokens || {})
    .filter(([k]) => k !== 'null' && !k.endsWith('-null'))
    .map(([name, t]) => ({ name, label: t.label || name, cssVar: t.cssVar }))
  const elemente = [...wurzel.querySelectorAll('*')].filter((el) => SICHTBAR(el, ansicht))
  /** @type {Markierung[]} */
  const aus = []
  const name = (t) => t.label.replace(/\s*\(Default\)\s*/i, '')

  if (kategorie === 'radius' || kategorie === 'border' || kategorie === 'size') {
    const toks = loeseTokens(wurzel, kategorie === 'border' ? liste('border').filter((t) => t.cssVar.includes('width')) : liste(kategorie), 'laenge')
    for (const el of elemente) {
      const s = cs(el)
      if (kategorie === 'radius') {
        const t = passendeLaenge(px(s.borderTopLeftRadius), toks)
        if (t) aus.push({ el, text: `Radius ${name(t)} · ${fmt(t.wert)} px` })
      } else if (kategorie === 'border') {
        const t = s.borderTopStyle !== 'none' || s.borderBottomStyle !== 'none'
          ? passendeLaenge(px(s.borderTopWidth) || px(s.borderBottomWidth), toks) : null
        if (t) aus.push({ el, text: `Rahmen ${name(t)} · ${fmt(t.wert)} px` })
      } else {
        if (!el.matches('button, input, select, textarea, .nc-button, .nc-avatar, .nc-badge')) continue
        const t = passendeLaenge(px(s.height), toks)
        if (t) aus.push({ el, text: `Höhe ${name(t)} · ${fmt(t.wert)} px` })
      }
    }
  } else if (kategorie === 'spacing') {
    const toks = loeseTokens(wurzel, liste('spacing'), 'laenge')
    for (const el of elemente) {
      const s = cs(el)
      const polster = [s.paddingTop, s.paddingRight, s.paddingBottom, s.paddingLeft].map(px)
      const teile = []
      const innen = passendeLaenge(Math.max(polster[1], polster[3]), toks) || passendeLaenge(Math.max(polster[0], polster[2]), toks)
      if (innen) teile.push(`Innenabstand ${innen.name} · ${fmt(innen.wert)} px`)
      const luecke = /flex|grid/.test(s.display) ? passendeLaenge(px(s.columnGap) || px(s.rowGap), toks) : null
      if (luecke) teile.push(`Lücke ${luecke.name} · ${fmt(luecke.wert)} px`)
      if (teile.length) aus.push({ el, text: teile.join(' · '), polster: innen ? polster : undefined })
    }
  } else if (kategorie === 'shadow') {
    const toks = loeseTokens(wurzel, liste('shadow'), 'text')
    for (const el of elemente) {
      const b = cs(el).boxShadow
      if (!b || b === 'none') continue
      const t = toks.find((x) => x.wert === b)
      aus.push({ el, text: t ? `Schatten ${name(t)}` : 'Schatten (eigener Wert)' })
    }
  } else if (kategorie === 'opacity') {
    const toks = liste('opacity').map((t) => ({ ...t, wert: parseFloat(cs(wurzel).getPropertyValue(t.cssVar)) }))
    for (const el of elemente) {
      const o = parseFloat(cs(el).opacity)
      if (!(o < 1)) continue
      const t = toks.find((x) => Math.abs(x.wert - o) < 0.005)
      aus.push({ el, text: `Deckkraft ${t ? name(t) + ' · ' : ''}${fmt(o)}` })
    }
  } else if (kategorie === 'icons') {
    for (const el of elemente) {
      if (el.tagName.toLowerCase() !== 'svg') continue
      const r = el.getBoundingClientRect()
      const strich = cs(el).strokeWidth || el.getAttribute('stroke-width')
      aus.push({ el, text: `Icon ${fmt(r.width)} px · Strich ${fmt(px(strich))}` })
    }
  } else if (kategorie === 'typography') {
    const familie = (v) => String(v || '').split(',')[0].replace(/["']/g, '').trim().toLowerCase()
    const rollen = [['--font-heading', 'Überschriften-Schrift'], ['--font-body', 'Fließtext-Schrift'], ['--font-mono', 'Mono-Schrift']]
      .map(([v, l]) => [familie(cs(wurzel).getPropertyValue(v)), l])
    for (const el of elemente) {
      const direkt = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())
      if (!direkt) continue
      const s = cs(el)
      const rolle = rollen.find(([f]) => f && f === familie(s.fontFamily))
      aus.push({ el, text: `${rolle ? rolle[1] : 'Schrift'} · ${fmt(px(s.fontSize))} px · ${s.fontWeight}` })
    }
  } else if (kategorie === 'focus') {
    // Fokus nicht wirklich setzen (nähme der App den Tastaturfokus): Ring
    // wird mit denselben Tokens gezeichnet (AufDerSeite, Klasse ads-fokus)
    const [breite, abstand] = loeseTokens(wurzel, [{ name: 'w', label: 'w', cssVar: '--fnd-focus-ring-width' }, { name: 'o', label: 'o', cssVar: '--fnd-focus-offset' }], 'laenge').map((t) => t.wert)
    for (const el of elemente) {
      if (!el.matches('a[href], button:not([disabled]), input, select, textarea')) continue
      aus.push({ el, text: `Fokusring ${fmt(breite)} px · Abstand ${fmt(abstand)} px` })
    }
  } else if (kategorie === 'surfaces') {
    const rollen = [['--fnd-color-layer-01', 'Fläche 01'], ['--fnd-color-layer-02', 'Fläche 02'], ['--fnd-color-layer-03', 'Fläche 03'], ['--fnd-color-surface-elevated', 'Erhobene Fläche']]
    const probe = wurzel.ownerDocument.createElement('div')
    wurzel.appendChild(probe)
    const farben = rollen.map(([v, l]) => { probe.style.backgroundColor = `var(${v})`; return [cs(probe).backgroundColor, l] })
    probe.remove()
    for (const el of elemente) {
      const bg = cs(el).backgroundColor
      if (!bg || bg === 'rgba(0, 0, 0, 0)') continue
      const f = farben.find(([c]) => c === bg)
      if (f) aus.push({ el, text: f[1] })
    }
  }
  return aus.slice(0, 40)
}
