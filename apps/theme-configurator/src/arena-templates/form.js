// Vorlage: form — Markup aus data/markup/form.html (Kontaktformular der
// Website, gekürzt). layout per Modifier; Zustand disabled deaktiviert alle
// Felder einzeln.
export default (zelle, m) => {
  const aus = m.deaktiviert ? ' disabled' : ''
  return `
<form class="${m.klasse}" novalidate onsubmit="return false"${m.attrs}>
<div class="nc-form-field nc-form-field--required">
<label class="nc-form-label" for="${m.uid}-org">
<span class="nc-form-label__text">Organisation</span>
<span class="nc-form-label__required" aria-hidden="true"> *</span>
</label>
<input class="nc-input" type="text" id="${m.uid}-org" placeholder="Ihr Unternehmen / Ihre Institution" required${aus}>
</div>
<div class="nc-form-field">
<label class="nc-form-label" for="${m.uid}-mail">
<span class="nc-form-label__text">E-Mail</span>
<span class="nc-form-label__optional"> (optional)</span>
</label>
<input class="nc-input" type="email" id="${m.uid}-mail" placeholder="name@firma.de"${aus}>
</div>
<div class="nc-form-field nc-form-field--required">
<label class="nc-form-label" for="${m.uid}-text">
<span class="nc-form-label__text">Worum geht es?</span>
<span class="nc-form-label__required" aria-hidden="true"> *</span>
</label>
<textarea class="nc-textarea" rows="3" id="${m.uid}-text" placeholder="Beschreiben Sie Ihr Vorhaben …" required${aus}></textarea>
</div>
<div class="nc-form-block__submission nc-form-field--full-width">
<p class="nc-form-block__hint-text">Antwort in 48h · DSGVO-konform</p>
<button type="submit" class="nc-button nc-button--accent nc-button--lg nc-form-block__submit"${aus}>Nachricht senden</button>
</div>
</form>`
}
