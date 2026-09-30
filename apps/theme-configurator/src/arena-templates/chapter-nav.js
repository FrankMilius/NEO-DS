// Vorlage: chapter-nav — Markup aus data/markup/chapter-nav.html.
// Achse form: leiste (Kapitel-Leiste), verzeichnis (nummerierte Liste am
// Seitenanfang, eigener Block nc-chapter-toc), keine (nur Sprungziele).
const KAPITEL = ['Kommunikation', 'Wissen', 'Events', 'Vernetzung', 'Anwendungen']

export default (zelle, m) => {
  const form = m.wert('form') || 'leiste'
  if (form === 'verzeichnis') {
    return `
<nav class="${m.klasse}" aria-label="Kapitel dieser Seite"${m.attrs}>
<ol class="nc-chapter-toc__list">
${KAPITEL.map((k) => `<li><a class="nc-chapter-nav__link" href="#" onclick="return false">${k}</a></li>`).join('\n')}
</ol>
</nav>`
  }
  if (form === 'keine') {
    return `<div class="${m.klasse}"${m.attrs}><span class="nc-chapter-anchor" id="${m.uid}-anker">Sprungziel ohne sichtbare Navigation</span></div>`
  }
  return `
<nav class="${m.klasse}" aria-label="Kapitel dieser Seite"${m.attrs}>
<div class="nc-container nc-chapter-nav__inner">
${KAPITEL.map((k, i) => `<a class="nc-chapter-nav__link" href="#" onclick="return false"${i === 0 ? ' aria-current="true"' : ''}>${k}</a>`).join('\n')}
</div>
</nav>`
}
