// Vorlage: form-hint — Markup aus data/markup/form-hint.html (<p class="nc-form-hint">).
// content: with-icon/with-link per slotConfig, list als Anforderungsliste.
import { SYMBOL } from './_helfer.js'

export default (zelle, m) => {
  if (m.wert('content') === 'list') {
    return `
<div class="${m.klasse}" id="${m.uid}"${m.attrs}>
<span class="nc-form-hint__text">Das Passwort braucht:</span>
<ul>
<li>mindestens 8 Zeichen</li>
<li>eine Ziffer</li>
<li>ein Sonderzeichen</li>
</ul>
</div>`
  }
  return `
<p class="${m.klasse}" id="${m.uid}"${m.attrs}>
${m.slot('icon') ? `<span class="nc-form-hint__icon">${SYMBOL.info}</span>` : ''}
<span class="nc-form-hint__text">Maximal 500 Zeichen.</span>
${m.slot('link') ? '<a class="nc-form-hint__link" href="#" onclick="return false">Mehr erfahren</a>' : ''}
</p>`
}
