// Vorlage: avatar — Markup aus data/markup/avatar.html (nc-avatar mit
// __fallback und __badge--<status>) und _avatar.scss (__image, --hash,
// --ring, --interactive). content: image (__image), initials/hash
// (__fallback mit Initialen), icon (__fallback mit Symbol). decorator
// badge-* setzt den Status-Punkt; interactive link/button rendert <a> bzw.
// <button>. Komposition avatar-group: vier Avatare + Zaehler in
// nc-avatar-group (row-reverse: der Zaehler steht im DOM vorn).
import { esc } from './_helfer.js'

const PERSON_SRC = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 64 64%22%3E%3Crect width=%2264%22 height=%2264%22 fill=%22%23c9ced6%22/%3E%3Ccircle cx=%2232%22 cy=%2225%22 r=%2212%22 fill=%22%23aab1bc%22/%3E%3Cpath d=%22M10 64c2-14 11-21 22-21s20 7 22 21z%22 fill=%22%23aab1bc%22/%3E%3C/svg%3E'
const PERSON_SYMBOL = '<svg width="60%" height="60%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"></circle><path d="M4 21a8 8 0 0 1 16 0"></path></svg>'
const STATUS = { 'badge-online': 'online', 'badge-offline': 'offline', 'badge-busy': 'busy', 'badge-away': 'away', 'badge-verified': 'verified' }

function initialen (name) {
  const teile = name.split(/\s+/)
  if (teile.length === 1) return name.length <= 3 ? name.toUpperCase() : name.slice(0, 2).toUpperCase()
  return teile.map((t) => t[0]).join('').slice(0, 2).toUpperCase()
}

function avatar (m, { klasse, name, inhalt, attrs = '' }) {
  const deko = STATUS[m.wert('decorator')]
  let innen
  if (inhalt === 'image') innen = `<img class="nc-avatar__image" src="${PERSON_SRC}" alt="${esc(name)}">`
  else if (inhalt === 'icon') innen = `<span class="nc-avatar__fallback">${PERSON_SYMBOL}</span>`
  else innen = `<span class="nc-avatar__fallback">${esc(initialen(name))}</span>`
  const punkt = deko ? `<span class="nc-avatar__badge nc-avatar__badge--${deko}" aria-hidden="true"></span>` : ''
  const beschriftung = inhalt === 'image' ? '' : ` role="img" aria-label="${esc(name)}"`
  const i = m.wert('interactive')
  if (i === 'link') return `<a class="${klasse}" href="#" onclick="return false" aria-label="Profil von ${esc(name)}"${m.deaktiviert ? ' aria-disabled="true" tabindex="-1"' : ''}${attrs}>${innen}${punkt}</a>`
  if (i === 'button') return `<button type="button" class="${klasse}" aria-label="Profil von ${esc(name)}"${m.deaktiviert ? ' disabled' : ''}${attrs}>${innen}${punkt}</button>`
  return `<div class="${klasse}"${beschriftung}${attrs}>${innen}${punkt}</div>`
}

export default (zelle, m) => {
  const render = m.specimen.render || {}
  if (render.compositionType === 'avatar-group') {
    const namen = ['Birgit Schwarz', 'Jonas Kramer', 'Aylin Demir', 'Pia Weber']
    return `<div class="nc-avatar-group" role="group" aria-label="7 Personen">
<span class="nc-avatar-group__count" aria-hidden="true">+3</span>
${namen.map((name) => avatar(m, { klasse: m.klasse, name, inhalt: m.wert('content') })).join('\n')}
</div>`
  }
  const name = render.entityLabels?.[0] || render.names?.[0] || 'Birgit Schwarz'
  const attrs = m.wert('interactive') === 'static' ? m.attrs : m.attrsOhne('aria-disabled')
  return avatar(m, { klasse: m.klasse, name, inhalt: m.wert('content'), attrs })
}
