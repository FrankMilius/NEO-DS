// Vorlage: form-section — Markup aus data/markup/form-section.html.
// content-Achse schaltet header/title/description per slotConfig.
export default (zelle, m) => {
  const kopf = m.slot('header')
    ? `<div class="nc-form-section__header">
${m.slot('title') ? '<h3 class="nc-form-section__title">Adresse</h3>' : ''}
${m.slot('description') ? '<p class="nc-form-section__description">Ihre aktuelle Lieferadresse.</p>' : ''}
</div>`
    : ''
  return `
<div class="${m.klasse}"${m.attrs}>
${kopf}
<div class="nc-form-section__content">
<div class="nc-form-field">
<label class="nc-form-label" for="${m.uid}-strasse"><span class="nc-form-label__text">Straße</span></label>
<input class="nc-input" id="${m.uid}-strasse" type="text" placeholder="Musterstraße 1">
</div>
<div class="nc-form-field">
<label class="nc-form-label" for="${m.uid}-stadt"><span class="nc-form-label__text">Stadt</span></label>
<input class="nc-input" id="${m.uid}-stadt" type="text" placeholder="Berlin">
</div>
</div>
</div>`
}
