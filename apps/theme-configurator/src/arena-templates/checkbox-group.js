// Vorlage: checkbox-group — Markup aus data/markup/checkbox-group.html.
// Zustaende error/disabled kommen als Modifier + aria-Attribute aus dem Modell;
// die Checkboxen selbst werden bei disabled mit `disabled` gerendert.
const OPTIONEN = [['design', 'Design'], ['development', 'Development', true], ['marketing', 'Marketing']]

export default (zelle, m) => {
  const aus = m.deaktiviert ? ' disabled' : ''
  const header = m.slot('header') ? `<div class="nc-checkbox-group__header" id="${m.uid}-label">Interessen</div>` : ''
  const hint = m.slot('hint') || m.hat('error')
    ? `<p class="nc-checkbox-group__hint">${m.hat('error') ? 'Bitte mindestens eine Option wählen.' : 'Mehrfachauswahl möglich.'}</p>`
    : ''
  const beschriftung = header ? ` aria-labelledby="${m.uid}-label"` : ' aria-label="Interessen"'
  return `
<div class="${m.klasse}" role="group"${beschriftung}${m.attrs}>
${header}
${OPTIONEN.map(([wert, text, an]) => `<label class="nc-checkbox">
<input class="nc-checkbox__input" type="checkbox" name="${m.uid}" value="${wert}"${an ? ' checked' : ''}${aus}>
<span class="nc-checkbox__control"></span>
<span class="nc-checkbox__label">${text}</span>
</label>`).join('\n')}
${hint}
</div>`
}
