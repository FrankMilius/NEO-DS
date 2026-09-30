// Vorlage: app-store — Markup aus data/markup/app-store.html.
// Achsen: surface (--on-dark), align (--center). Slots note/badges optional.
export default (zelle, m) => `
<div class="${m.klasse}"${m.attrs}>
<h2 class="nc-section-header__title">Jetzt laden — oder in zwei Minuten ansehen</h2>
<p class="nc-section-header__subtitle">Die neo app gibt es für iOS und Android. Der Zugang läuft über Ihre Organisation; einen Testzugang richten wir auf Anfrage ein.</p>
<p class="nc-app-store__note">iOS 16 und Android 10 oder neuer · Deutsch und Englisch</p>
</div>
`
