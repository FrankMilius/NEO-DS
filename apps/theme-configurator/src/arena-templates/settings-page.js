// Vorlage: settings-page (08-templates/_settings-page.scss, .t-settings) —
// Plan v3, Phase 5. Markup aus der Doku (docs/content/
// template-settings-page.html). Im SCSS als DEPRECATED markiert (Nachfolger:
// Shell-Preset data-layout="settings"). Seitenlayout: Rahmen ra-fenster.

const zeile = (titel, text, aktion) => `<div class="t-settings__row">
<div class="t-settings__row-label">
<p class="t-settings__row-title">${titel}</p>
<p class="t-settings__row-description">${text}</p>
</div>
<div class="t-settings__row-action">
<button type="button" class="nc-button nc-button--outline nc-button--sm">${aktion}</button>
</div>
</div>`

export default (zelle, m) => {
  const zwei = m.specimen.render?.abschnitte === 2
  return `<div class="ra-fenster">
<div class="${m.klasse}"${m.attrs}>
<nav class="t-settings__nav" aria-label="Einstellungen">
<ul class="t-settings__nav-list">
<li><a class="t-settings__nav-link" href="#${m.uid}-profil" aria-current="page">Profil</a></li>
<li><a class="t-settings__nav-link" href="#${m.uid}-sicherheit">Sicherheit</a></li>
</ul>
</nav>
<div class="t-settings__content">
<section class="t-settings__section" id="${m.uid}-profil" aria-labelledby="${m.uid}-profil-titel">
<div class="t-settings__section-header">
<h2 class="t-settings__section-title" id="${m.uid}-profil-titel">Profil</h2>
<p class="t-settings__section-description">Ihre öffentlichen Profilinformationen.</p>
</div>
${zeile('Anzeigename', 'Dieser Name ist öffentlich sichtbar.', 'Bearbeiten')}
${zwei ? zeile('Profilbild', 'Wird neben Ihren Beiträgen angezeigt.', 'Ändern') : ''}
</section>
${zwei ? `<section class="t-settings__section" id="${m.uid}-sicherheit" aria-labelledby="${m.uid}-sicherheit-titel">
<div class="t-settings__section-header">
<h2 class="t-settings__section-title" id="${m.uid}-sicherheit-titel">Sicherheit</h2>
<p class="t-settings__section-description">Anmeldung und Sitzungen.</p>
</div>
${zeile('Passwort', 'Zuletzt geändert vor 3 Monaten.', 'Ändern')}
${zeile('Zwei-Faktor-Anmeldung', 'Zusätzlicher Code bei jeder Anmeldung.', 'Einrichten')}
</section>` : ''}
</div>
</div>
</div>`
}
