// Vorlage: form-error — Markup aus data/markup/form-error.html.
// content=with-icon schaltet das Icon per slotConfig, severity per Modifier.
import { SYMBOL } from './_helfer.js'

const TEXT = {
  error: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.',
  warning: 'Diese Adresse wird bereits verwendet.',
  success: 'Die E-Mail-Adresse ist gültig.'
}

export default (zelle, m) => `
<p class="${m.klasse}" role="${m.wert('severity') === 'success' ? 'status' : 'alert'}" id="${m.uid}"${m.attrs}>
${m.slot('icon') ? `<span class="nc-form-error__icon">${SYMBOL.fehler}</span>` : ''}
<span class="nc-form-error__text">${TEXT[m.wert('severity')] || TEXT.error}</span>
</p>
`
