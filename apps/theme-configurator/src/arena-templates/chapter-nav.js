// Vorlage: chapter-nav — Markup aus data/markup/chapter-nav.html (Leiste,
// Website /produkte/workplace) und 07-organisms/_chapter-nav.scss.
// Achse form (Plan v3, Phase 4 — die Vorlage gab bis hier beiden Formen
// beide Wurzelklassen und dem Verzeichnis die Klassen der Leiste):
//   leiste       nav.nc-chapter-nav > .nc-container.nc-chapter-nav__inner >
//                a.nc-chapter-nav__link (laufendes Kapitel: aria-current)
//   verzeichnis  eigener Block: nav.nc-chapter-toc > .nc-chapter-toc__title +
//                ol.nc-chapter-toc__list > li.nc-chapter-toc__item >
//                a.nc-chapter-toc__link (Nummern per CSS-Zaehler) — ohne
//                .nc-chapter-nav, sonst klebte es wie die Leiste
//   keine        nur das Sprungziel am Block (.nc-chapter-anchor mit id)
// Verzeichnis und Sprungziel tragen data-recipe-wurzel="nc-chapter-nav"
// (eigener Block statt der Basisklasse, wie divider with-label).
// Die Leiste ist position: sticky; in der Zelle hat sie keinen Scroll-
// Container, sie steht dort wie am Seitenanfang. Scroll-Spy und Sprung macht
// auf der Website neo-theme.js (nicht neo-behaviors) — kein „Ausprobieren".
// render.kapitel: eigene Kapitelliste, render.aktuell: Index des laufenden
// Kapitels; render.schmal: Rahmen ra-schmal (quer scrollbare Leiste).
import { esc } from './_helfer.js'
import { platzhalter } from './_layout.js'
import { vorgabe } from './_bloecke-1.js'

const KAPITEL = ['Kommunikation', 'Wissen', 'Events', 'Vernetzung', 'Anwendungen']
const anker = (k) => k.toLowerCase().normalize('NFD').replace(/[^\w]+/g, '-')

export default (zelle, m) => {
  const form = m.wert('form') || 'leiste'
  const kapitel = vorgabe(m, 'kapitel', KAPITEL)
  const aktuell = vorgabe(m, 'aktuell', 0)
  const klassen = m.klassen.filter((k) => k !== 'nc-chapter-nav' && k !== 'nc-chapter-toc')
  if (form === 'verzeichnis') {
    return `
<nav class="${['nc-chapter-toc', ...klassen].join(' ')}" data-recipe-wurzel="nc-chapter-nav" aria-label="Kapitel dieser Seite"${m.attrs}>
<p class="nc-chapter-toc__title">Auf dieser Seite</p>
<ol class="nc-chapter-toc__list">
${kapitel.map((k) => `<li class="nc-chapter-toc__item"><a class="nc-chapter-toc__link" href="#" onclick="return false">${esc(k)}</a></li>`).join('\n')}
</ol>
</nav>`
  }
  if (form === 'keine') {
    return `
<section class="${['nc-chapter-anchor', ...klassen].join(' ')}" data-recipe-wurzel="nc-chapter-nav" id="${m.uid}-${anker(kapitel[1])}" aria-label="${esc(kapitel[1])}"${m.attrs}>
${platzhalter(`Block mit Sprungziel #${anker(kapitel[1])} — keine sichtbare Navigation`)}
</section>`
  }
  const leiste = `<nav class="${['nc-chapter-nav', ...klassen].join(' ')}" aria-label="Kapitel dieser Seite"${m.attrs}>
<div class="nc-container nc-chapter-nav__inner">
${kapitel.map((k, i) => `<a class="nc-chapter-nav__link" href="#" onclick="return false"${i === aktuell ? ' aria-current="true"' : ''}>${esc(k)}</a>`).join('\n')}
</div>
</nav>`
  return vorgabe(m, 'schmal', false) ? `\n<div class="ra-schmal">\n${leiste}\n</div>` : `\n${leiste}`
}
