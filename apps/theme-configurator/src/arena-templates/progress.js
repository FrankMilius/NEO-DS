// Vorlage: progress — Markup aus data/markup/progress.html. mode=indeterminate
// per Modifier; determinate zeigt 60 % — die Breite des Fill setzt die
// Anwendung inline (das DS hat dafuer keine Klasse). Komposition
// progress-labeled: nc-progress-labeled mit __header, __label, __value.
export default (zelle, m) => {
  const unbestimmt = m.wert('mode') === 'indeterminate'
  const wert = unbestimmt ? '' : ' aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"'
  const labeled = m.specimen.render?.compositionType === 'progress-labeled'
  const balken = `<div class="${m.klasse}" role="progressbar"${labeled ? ` aria-labelledby="${m.uid}-l"` : ' aria-label="Fortschritt"'}${wert}${m.attrs}>
<div class="nc-progress__fill"${unbestimmt ? '' : ' style="width: 60%"'}></div>
</div>`
  if (labeled) {
    return `
<div class="nc-progress-labeled" style="width: 280px;">
<div class="nc-progress-labeled__header"><span class="nc-progress-labeled__label" id="${m.uid}-l">Upload</span><span class="nc-progress-labeled__value">60 %</span></div>
${balken}
</div>`
  }
  return `
<div style="width: 240px;">${balken}</div>`
}
