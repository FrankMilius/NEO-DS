// Vorlage: error-page (08-templates/_error-page.scss, .t-error) — Plan v3,
// Phase 5. Markup aus der Doku (docs/content/template-error-page.html: 404
// und 500). Im SCSS als DEPRECATED markiert (Nachfolger: Shell-Preset
// data-layout="focused"). Seitenlayout: Rahmen ra-fenster.

const FEHLER = {
  404: {
    titel: 'Seite nicht gefunden',
    text: 'Die gewünschte Seite existiert nicht oder wurde verschoben. Überprüfen Sie die URL oder kehren Sie zur Startseite zurück.',
    aktionen: '<a href="#" onclick="return false" class="nc-button">&larr; Zur Startseite</a>\n<a href="#" onclick="return false" class="nc-button nc-button--outline">Suche</a>'
  },
  500: {
    titel: 'Interner Serverfehler',
    text: 'Es ist ein unerwarteter Fehler aufgetreten. Unser Team wurde benachrichtigt.',
    aktionen: '<button type="button" class="nc-button">Seite neu laden</button>\n<a href="#" onclick="return false" class="nc-button nc-button--outline">Support</a>'
  }
}

export default (zelle, m) => {
  const nr = m.specimen.render?.fehler === 500 ? 500 : 404
  const f = FEHLER[nr]
  return `<div class="ra-fenster">
<main class="${m.klasse}"${m.attrs}>
<div class="t-error__content">
<p class="t-error__code" aria-hidden="true">${nr}</p>
<h1 class="t-error__title">${f.titel}</h1>
<p class="t-error__description">${f.text}</p>
<div class="t-error__actions">
${f.aktionen}
</div>
</div>
</main>
</div>`
}
