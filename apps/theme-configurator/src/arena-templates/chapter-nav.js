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
// Container, sie steht dort wie am Seitenanfang.
// „Ausprobieren" (Entscheidung 06.10.2026, website-verhalten): die Leiste mit
// echten Ankern in einer kleinen Seite (Rahmen ra-kapitelseite, eigener
// Scroll-Container) mit den Kapiteln als Sprungziele (.nc-chapter-anchor);
// das Behavior chapter-nav aus neo-behaviors markiert beim Scrollen und
// springt beim Klick. Instanzwerte am Rahmen: --mod-chapternav-top 0 (keine
// Kopfzeile darueber), --mod-chapternav-scroll-margin = Leiste + Abstand.
// Auf der Website bis zur Umstellung die Library neo_fe/neo-chapter-nav.
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
  if (m.ausprobieren) {
    const id = (k) => `${m.uid}-${anker(k)}`
    return `
<div class="ra-kapitelseite" style="--mod-chapternav-top: 0px; --mod-chapternav-scroll-margin: calc(56px + var(--fnd-spacing-05));">
<nav class="${['nc-chapter-nav', ...klassen].join(' ')}" aria-label="Kapitel dieser Seite"${m.attrs}>
<div class="nc-container nc-chapter-nav__inner">
${kapitel.map((k, i) => `<a class="nc-chapter-nav__link" href="#${id(k)}"${i === 0 ? ' aria-current="true"' : ''}>${esc(k)}</a>`).join('\n')}
</div>
</nav>
${kapitel.map((k, i) => `<section class="nc-chapter-anchor" id="${id(k)}" aria-label="${esc(k)}">
${platzhalter(`Kapitel ${i + 1}: ${k}`, 'ra-platzhalter--kapitel')}
</section>`).join('\n')}
</div>`
  }
  const leiste = `<nav class="${['nc-chapter-nav', ...klassen].join(' ')}" aria-label="Kapitel dieser Seite"${m.attrs}>
<div class="nc-container nc-chapter-nav__inner">
${kapitel.map((k, i) => `<a class="nc-chapter-nav__link" href="#" onclick="return false"${i === aktuell ? ' aria-current="true"' : ''}>${esc(k)}</a>`).join('\n')}
</div>
</nav>`
  return vorgabe(m, 'schmal', false) ? `\n<div class="ra-schmal">\n${leiste}\n</div>` : `\n${leiste}`
}
