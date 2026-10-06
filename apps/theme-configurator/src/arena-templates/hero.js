// Hero (07-organisms/_hero.scss, .nc-hero) — Plan v3, Phase 3, Block Layout.
//
// Markup nach data/markup/hero.html (Ernte der Website) und der SCSS-Struktur:
//   ohne Medium   .nc-hero > .nc-hero__content
//   mit Medium    .nc-hero > .nc-hero__grid > .nc-hero__content + .nc-hero__media
// Inhalt: Badge-Zeile (.nc-badge-row mit .nc-label), Kicker, Titel mit
// Hervorhebung, Untertitel (Rich-Text-Huelle mit <p>), Merkmalsliste,
// Aktionen (.nc-button), Fuss mit Kennzahlen (.nc-metric) — so wie die
// Website sie liefert. Bild: neutraler Platzhalter (BILD_SRC); der Hero mit
// Hintergrundbild traegt es wie Drupal als Inline-Stil am Block.
//
// Die Modifier der Kennzahlen (cardsAlign, cardsRule, cardsSurface) gehoeren
// an .nc-hero__cards, nicht an den Block — die Vorlage verteilt sie.
//
// Ausrichtung „center" greift nur OHNE Medium (Selektor
// .nc-hero--center:not(:has(.nc-hero__media))). Das Specimen
// alignment-comparison schaltet das Medium deshalb ueber render.slots ab.
//
// Rahmen ra-desktop: der Hero ist fuer die Seitenbreite gebaut (zwei
// Spalten ab 960 px Fenster, Medium buendig bis zum Rand) — in einer Zelle
// von rund 550 px stuende er gequetscht. Der Rahmen ist eine Desktop-Seite
// von 1280 px im Massstab 1:2,4; darin gelten die echten Werte.
//
// <section> ohne Namen wie im geernteten Markup (kein Landmark).
import { BILD_SRC, esc } from './_helfer.js'

const KARTEN = [
  ['Lizenz', '100%', 'Open Source'],
  ['Betrieb', 'Cloud & On-Prem', 'Betriebsmodelle'],
  ['Technik', 'KI-nativ', 'Entwicklung & Betrieb'],
  ['Standard', 'Barrierefrei', 'WCAG-konform']
]
const BADGES = ['90% Open Source', 'Cloud & On-Premise', 'KI-nativ', 'WCAG-konform']

const badges = () => `<div class="nc-badge-row nc-hero__badges">
${BADGES.map((b) => `<span class="nc-label nc-label--pill">${esc(b)}</span>`).join('\n')}
</div>`

function karten (kartenKlassen) {
  const klassen = ['nc-hero__cards', 'nc-hero__cards--n4', ...kartenKlassen]
  if (kartenKlassen.some((k) => /--rule-/.test(k))) klassen.splice(2, 0, 'nc-hero__cards--ruled')
  return `<div class="${klassen.join(' ')}">
${KARTEN.map(([kicker, wert, text]) => `<div class="nc-metric nc-metric--subtle">
<span class="nc-metric__label">${esc(kicker)}</span>
<div class="nc-metric__value-row">
<span class="nc-metric__value">${esc(wert)}</span>
</div>
<span class="nc-metric__footer">${esc(text)}</span>
</div>`).join('\n')}
</div>`
}

const aktionen = () => `<div class="nc-hero__actions">
<a href="#" onclick="return false" class="nc-button nc-button--accent nc-button--lg"><span>Demo anfordern</span></a>
<a href="#" onclick="return false" class="nc-button nc-button--ghost nc-button--lg"><span>Lösungen entdecken</span></a>
</div>`

const merkmale = () => `<ul class="nc-hero__highlights" aria-label="Highlights">
<li class="nc-hero__highlight">Live-Dashboards aus allen Quellen</li>
<li class="nc-hero__highlight">KI-gestützte Suche und Assistenz</li>
<li class="nc-hero__highlight">DSGVO-konform, gehostet in der EU</li>
</ul>`

function medium (variante) {
  if (variante === 'mockup') {
    return `<div class="nc-hero__media">
<div class="nc-hero__mockup" aria-hidden="true">
<div class="nc-hero__mockup-tile"><span class="nc-hero__mockup-value">98,4 %</span><span class="nc-hero__mockup-label">Verfügbarkeit, letzte 30 Tage</span></div>
<div class="nc-hero__mockup-tile"><span class="nc-hero__mockup-value">1,2 Mio.</span><span class="nc-hero__mockup-label">Verarbeitete Ereignisse</span></div>
<div class="nc-hero__mockup-tile"><span class="nc-hero__mockup-value">42 ms</span><span class="nc-hero__mockup-label">Durchschnittliche Latenz</span></div>
<div class="nc-hero__mockup-pulse"></div>
</div>
</div>`
  }
  return `<div class="nc-hero__media">
<div class="nc-hero__picture"><img src="${BILD_SRC}" alt="Vorschau der Plattform" width="600" height="400"></div>
</div>`
}

const vorlage = (zelle, m) => {
  const art = m.specimen.render?.compositionType
  const voll = art === 'full-anatomy'
  const slots = m.specimen.render?.slots
  const variante = m.wert('variant') || (m.wert('mediaPosition') ? 'picture' : null)
  const mitMedium = !!variante && (!slots || slots.includes('media'))

  const blockKlassen = m.klassen.filter((k) => !k.startsWith('nc-hero__cards'))
  const kartenKlassen = m.klassen.filter((k) => k.startsWith('nc-hero__cards--'))
  const mitKarten = m.wert('badgesPosition') !== undefined || kartenKlassen.length > 0 ||
    ['cardsSurface', 'cardsRule', 'cardsAlign'].some((a) => m.wert(a) !== undefined)
  const unten = m.wert('badgesPosition') === 'bottom'
  const mitBadges = voll || m.wert('badgesPosition') !== undefined

  const titel = m.wert('markStyle') !== undefined || voll
    ? 'Der <span class="nc-hero__mark">intelligente</span> digitale Arbeitsplatz'
    : 'Der intelligente digitale Arbeitsplatz'

  const inhalt = [
    mitBadges && !unten ? badges() : '',
    '<p class="nc-hero__kicker">Social Intranet Plattform</p>',
    `<h1 class="nc-hero__title">${titel}</h1>`,
    '<div class="nc-hero__subtitle">\n<p>Kommunikation, Wissen und Zusammenarbeit in einer offenen Plattform — sicher, flexibel und Open Source.</p>\n</div>',
    variante || voll ? merkmale() : '',
    aktionen(),
    mitKarten || unten
      ? `<div class="nc-hero__footer">\n${unten ? badges() + '\n' : ''}${mitKarten ? karten(kartenKlassen) : ''}\n</div>`
      : ''
  ].filter(Boolean).join('\n')

  const content = `<div class="nc-hero__content">\n${inhalt}\n</div>`
  const koerper = mitMedium ? `<div class="nc-hero__grid">\n${content}\n${medium(variante)}\n</div>` : content

  // Hero mit Hintergrundbild (Full Featured): Bild als Inline-Stil am Block
  // wie in Drupal, darueber der Verlauf (.nc-hero__overlay)
  const bild = voll ? ` style="background-image: url(&quot;${BILD_SRC}&quot;)"` : ''
  const verlauf = voll ? '<div class="nc-hero__overlay" aria-hidden="true"></div>\n' : ''
  return `<div class="ra-desktop">
<section class="${blockKlassen.join(' ')}"${m.attrs}${bild}>
${verlauf}${koerper}
</section>
</div>`
}

// Die Achse surface ist die Flaeche des Heros (Modifier nc-hero--surface-*),
// nicht das Seiten-Thema — die Arena setzt deshalb keinen dunklen Grund um
// die Zelle (recipe-arena.js, zellenFlaeche).
vorlage.eigeneFlaeche = true
export default vorlage
