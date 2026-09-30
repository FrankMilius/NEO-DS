// Vorlage: form-label — Markup aus data/markup/form-label.html.
// indicator schaltet required/optional/info per slotConfig; disabled als
// Modifier + aria-disabled aus dem Modell.
import { SYMBOL } from './_helfer.js'

export default (zelle, m) => `
<label class="${m.klasse}" for="${m.uid}-feld"${m.attrs}>
<span class="nc-form-label__text">E-Mail</span>
${m.slot('required') ? '<span class="nc-form-label__required" aria-hidden="true">*</span>' : ''}
${m.slot('optional') ? '<span class="nc-form-label__optional">(optional)</span>' : ''}
${m.slot('info') ? `<span class="nc-form-label__info" title="Wir nutzen die Adresse nur für Rückfragen.">${SYMBOL.info}</span>` : ''}
</label>
`
