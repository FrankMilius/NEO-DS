// Vorlage: form-block — Markup aus data/markup/form-block.html.
// position per Modifier und data-layout (wie im geernteten Markup).
// Das fehlerhafte type="checkbox-group" der Ernte ist durch ein
// Auswahlfeld ersetzt.
import { an } from './_helfer.js'

export default (zelle, m) => {
  const id = (n) => `${m.uid}-${n}`
  return `
<div class="${m.klasse}" data-layout="${m.wert('position') || 'text-left'}"${m.attrs}>
<div class="nc-form-block__text">
<div class="nc-section-header nc-section-header--flush">
<h2 class="nc-section-header__title nc-form-block__headline">Nachricht senden</h2>
${an(m, 'subtext') ? '<p class="nc-section-header__subtitle nc-form-block__subtext">Erzählen Sie uns von Ihrem Vorhaben – wir melden uns persönlich.</p>' : ''}
</div>
</div>
<div class="nc-form-block__form">
<form class="nc-form nc-form--two-column" novalidate onsubmit="return false">
<div class="nc-form-field nc-form-field--required">
<label class="nc-form-label" for="${id('org')}"><span class="nc-form-label__text">Organisation</span><span class="nc-form-label__required" aria-hidden="true"> *</span></label>
<input class="nc-input" type="text" id="${id('org')}" placeholder="Ihr Unternehmen / Ihre Institution">
</div>
<div class="nc-form-field">
<label class="nc-form-label" for="${id('thema')}"><span class="nc-form-label__text">Thema</span><span class="nc-form-label__optional"> (optional)</span></label>
<select class="nc-select" id="${id('thema')}"><option>Bitte wählen …</option><option>Demo</option><option>Preise</option></select>
</div>
<div class="nc-form-field nc-form-field--required nc-form-field--full-width">
<label class="nc-form-label" for="${id('msg')}"><span class="nc-form-label__text">Worum geht es?</span><span class="nc-form-label__required" aria-hidden="true"> *</span></label>
<textarea class="nc-textarea" rows="4" id="${id('msg')}" placeholder="Beschreiben Sie Ihr Vorhaben …"></textarea>
</div>
${an(m, 'submission') ? `<div class="nc-form-block__submission nc-form-field--full-width">
${an(m, 'hint-text') ? '<p class="nc-form-block__hint-text">Antwort in 48h · DSGVO-konform</p>' : ''}
<button type="button" class="nc-button nc-button--accent nc-button--lg nc-form-block__submit">Nachricht senden</button>
</div>` : ''}
</form>
</div>
</div>`
}
