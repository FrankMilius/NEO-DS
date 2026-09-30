// Vorlage: radio-group — Markup aus data/markup/radio-group.html.
// Jede Zelle bekommt einen eigenen name, damit die Gruppen der Arena sich
// nicht gegenseitig abwaehlen. disabled/error aus dem Modell.
const OPTIONEN = [['rot', 'Rot', true], ['gruen', 'Grün'], ['blau', 'Blau']]

export default (zelle, m) => {
  const aus = m.deaktiviert ? ' disabled' : ''
  const hint = m.slot('hint') || m.hat('error')
    ? `<p class="nc-radio-group__hint">${m.hat('error') ? 'Bitte eine Farbe wählen.' : 'Eine Option ist Pflicht.'}</p>`
    : ''
  return `
<div class="${m.klasse}" role="radiogroup" aria-label="Lieblingsfarbe"${m.attrs}>
${OPTIONEN.map(([wert, text, an]) => `<label class="nc-radio">
<input type="radio" class="nc-radio__input" name="${m.uid}" value="${wert}"${an ? ' checked' : ''}${aus}>
<span class="nc-radio__control"></span>
<span class="nc-radio__label">${text}</span>
</label>`).join('\n')}
${hint}
</div>`
}
