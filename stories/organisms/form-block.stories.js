// ============================================================
// FormBlock — Auto-generated from form-block-recipe.json
// Version: 1.0.0 | Status: stable
// DO NOT EDIT DIRECTLY — run: npm run generate:stories
// ============================================================

export default {
  title: 'Organisms/FormBlock',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `**FormBlock** v1.0.0 (stable)

4 Positionierungsvarianten: text-left, text-right, text-top, text-bottom.


`,
      },
    },
    status: { type: 'stable' },
  },
  argTypes: {},
};

export const Default = {
  name: 'Standard',
  render: () => `<div class="nc-form-block nc-form-block--text-left" data-neo-form="" data-layout="text-left">
<div class="nc-form-block__text">
<div class="nc-section-header nc-section-header--flush">
<h2 class="nc-section-header__title">Nachricht senden</h2>
<p class="nc-section-header__subtitle">Erzählen Sie uns von Ihrem Vorhaben – wir melden uns persönlich.</p>
</div>
</div>
<div class="nc-form-block__form">
<form class="nc-form nc-form--two-column" novalidate="" data-neo-form-fields="" data-neo-form-init="1">
<div class="nc-form-hp" aria-hidden="true">
<input type="text" name="website_url" tabindex="-1" autocomplete="off">
</div>
<div class="nc-form-field nc-form-field--required">
<label class="nc-form-label" for="nf-organisation">
<span class="nc-form-label__text">Organisation</span>
<span class="nc-form-label__required" aria-hidden="true"> *</span>
</label>
<input class="nc-input" type="text" name="organisation" id="nf-organisation" placeholder="Ihr Unternehmen / Ihre Institution" required="">
</div>
<div class="nc-form-field nc-form-field--required">
<label class="nc-form-label" for="nf-message">
<span class="nc-form-label__text">Worum geht es?</span>
<span class="nc-form-label__required" aria-hidden="true"> *</span>
</label>
<textarea class="nc-textarea" rows="4" name="message" id="nf-message" placeholder="Beschreiben Sie Ihr Vorhaben …" required="">
</textarea>
</div>
<div class="nc-form-field">
<label class="nc-form-label" for="nf-topic">
<span class="nc-form-label__text">Bitte waehlen …</span>
<span class="nc-form-label__optional"> (optional)</span>
</label>
<input class="nc-input" type="checkbox-group" name="topic" id="nf-topic">
</div>
<div class="nc-form-block__submission nc-form-field--full-width">
<p class="nc-form-block__hint-text">Antwort in 48h · DSGVO-konform</p>
<button type="submit" class="nc-button nc-button--accent nc-button--lg nc-form-block__submit">Nachricht senden</button>
</div>
</form>
</div>
</div>`,
};
