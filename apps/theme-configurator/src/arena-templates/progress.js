// Vorlage: progress — Markup aus data/markup/progress.html. Sonderfall-Arena
// vorhanden. mode=indeterminate per Modifier; determinate zeigt 60 % — die
// Breite des Fill setzt die Anwendung inline (das DS hat dafuer keine Klasse).
export default (zelle, m) => {
  const unbestimmt = m.wert('mode') === 'indeterminate'
  const wert = unbestimmt ? '' : ' aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"'
  return `
<div class="${m.klasse}" role="progressbar" aria-label="Fortschritt"${wert}${m.attrs}>
<div class="nc-progress__fill"${unbestimmt ? '' : ' style="width: 60%"'}></div>
</div>`
}
