// Vorlage: banner — Markup aus data/markup/banner.html (geerntet von der
// Doku) und der SCSS-Struktur (scss/scss/07-organisms/_banner.scss):
//   div.nc-banner[.nc-banner--<severity>][.nc-banner--accent]
//     [.nc-banner--sticky|--fixed]  role="region" aria-label="Hinweis"
//     (allgemein, benannte Region) bzw. role="alert" (danger; Recipe
//     a11y/constraints, Entscheidung 05.10.2026 — kein role="banner")
//     span.nc-banner__icon (aria-hidden)                    with-icon, full
//     div.nc-banner__content
//       strong.nc-banner__title („Wartung:")               with-title, full
//       span (Text) + a.nc-banner__link (CTA)              with-link, full
//     button.nc-banner__close  aria-label="Banner schließen" with-close, full
// Das Verhalten (Schliessen mit Einklapp-Animation, Merken per
// data-banner-id, Platz fuer das feste Banner) kommt aus neo-behaviors
// (banner.js). data-banner-id setzt die Arena nicht: ein einmal
// geschlossenes Banner bliebe sonst auch in der Arena weg.
//
// Achsen: severity (info ohne Modifier = Standard des SCSS), style (accent),
//   position (sticky/fixed), content (Slots) — Modifier an der Wurzel.
// Zustaende:
//   default
//   dismissing  .is-dismissing als Standbild (ra-standbild: die Animation
//               des DS angehalten, halb eingeklappt)
// Lage: das feste Banner (position: fixed) liegt in einem Arena-Rahmen
//   ra-bildschirm (per contain sein Bezugsrahmen) ueber etwas Seiteninhalt;
//   static und sticky stehen zum Vergleich im selben Rahmen.
// Specimens: severity-variants, accent-variants, with-title, content-variants,
//   dismiss-animation, position-variants, danger-alert (fixed, role="alert"),
//   with-cta (sticky), dismissible.
import { esc } from './_helfer.js'
import { wurzelKlassen } from './_overlay.js'
import { SYMBOLE, schliessKnopf, erneutHuelle, einrichtenErneut } from './_rueckmeldung.js'

const INHALT = {
  info: ['Neu:', 'Die Mitgliederverwaltung hat jetzt Gruppenrechte.', SYMBOLE.info, 'Mehr erfahren'],
  warning: ['Wartung:', 'Am Sonntag von 2 bis 4 Uhr ist die Plattform nicht erreichbar.', SYMBOLE.warnung, 'Details'],
  danger: ['Störung:', 'Einige Dienste sind derzeit nicht erreichbar.', SYMBOLE.fehler, 'Status-Seite'],
  success: ['Erledigt:', 'Alle Systeme laufen wieder normal.', SYMBOLE.erfolg, 'Protokoll']
}

const SLOTS = {
  'text-only': [],
  'with-icon': ['icon'],
  'with-title': ['title'],
  'with-link': ['link'],
  'with-close': ['close'],
  full: ['icon', 'title', 'link', 'close']
}

export default (zelle, m) => {
  const severity = m.wert('severity') || 'info'
  const content = m.wert('content') || 'text-only'
  const position = m.wert('position') || 'static'
  const slots = new Set(SLOTS[content] || [])
  const [titel, text, symbol, link] = INHALT[severity] || INHALT.info
  // danger: sofort angesagt; sonst benannte Region (Standardname „Hinweis")
  const rolle = severity === 'danger' ? 'role="alert"' : 'role="region" aria-label="Hinweis"'
  const schliesst = m.hat('dismissing') && !m.ausprobieren

  const teile = []
  if (slots.has('icon')) teile.push(`<span class="nc-banner__icon" aria-hidden="true">${symbol}</span>`)
  const inhalt = []
  if (slots.has('title')) inhalt.push(`<strong class="nc-banner__title">${esc(titel)}</strong>`)
  inhalt.push(`<span>${esc(text)}</span>`)
  if (slots.has('link')) inhalt.push(`<a class="nc-banner__link" href="#" onclick="return false">${esc(link)}</a>`)
  teile.push(`<div class="nc-banner__content">${inhalt.join('')}</div>`)
  if (slots.has('close')) teile.push(schliessKnopf('nc-banner__close', 'Banner schließen'))

  const banner = `<div class="${wurzelKlassen(m, schliesst ? ['is-dismissing'] : [])}" ${rolle}>
${teile.join('\n')}
</div>`

  // Lage: fest und haftend im Rahmen ueber Seiteninhalt
  const seite = '<p class="ra-seitentext">Seiteninhalt — Überschrift, Text und Bilder der Seite beginnen hier.</p>'
  const imRahmen = position !== 'static'
  const huelle = (html, ziel = false) => {
    const z = ziel ? ' data-ra-ziel' : ''
    if (imRahmen) return `<div class="ra-bildschirm ra-bildschirm--voll${position === 'fixed' ? ' ra-bildschirm--fest' : ''}"${z}>${html}${seite}</div>`
    if (schliesst) return `<div class="ra-standbild"${z}>${html}</div>`
    return `<div${z}>${html}</div>`
  }

  if (!m.ausprobieren || !slots.has('close')) return huelle(banner)
  return erneutHuelle('banner', huelle(banner, true), banner + (imRahmen ? seite : ''))
}

export const einrichten = einrichtenErneut
