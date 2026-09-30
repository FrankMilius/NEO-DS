// Vorlage: app-store — Markup aus data/markup/app-store.html, abgeglichen mit
// block--block-content--neo-app-store.html.twig (neo_fe): Titel, Lead,
// Store-Abzeichen (nc-app-store__badges), QR-Code und Hinweis. Die Symbole
// der Abzeichen stammen unveraendert aus dem Twig. Achsen: surface
// (--on-dark), align (--center). Slots badges/qr/note sind optional und
// werden nur ausgeblendet, wenn das Recipe sie abschaltet.
import { an } from './_helfer.js'

const APPLE = '<svg class="nc-app-store__badge-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.4 12.8c0-2.2 1.8-3.3 1.9-3.3-1-1.5-2.6-1.7-3.2-1.7-1.4-.1-2.7.8-3.3.8-.7 0-1.7-.8-2.8-.8-1.5 0-2.8.8-3.6 2.1-1.5 2.7-.4 6.6 1.1 8.8.7 1 1.6 2.2 2.7 2.2 1.1 0 1.5-.7 2.8-.7 1.3 0 1.7.7 2.8.7 1.2 0 1.9-1.1 2.6-2.1.8-1.2 1.2-2.4 1.2-2.4s-2.2-.9-2.2-3.6zM14.3 5.9c.6-.7 1-1.7.9-2.7-.9 0-2 .6-2.6 1.3-.6.6-1.1 1.7-.9 2.6 1 .1 2-.5 2.6-1.2z"/></svg>'
const PLAY = '<svg class="nc-app-store__badge-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3.6 2.2c-.3.3-.5.8-.5 1.4v16.8c0 .6.2 1.1.5 1.4l.1.1 9.4-9.4v-.2L3.7 2.9l-.1-.7zM17 15.3l-3.1-3.1 3.1-3.1 3.7 2.1c1.1.6 1.1 1.6 0 2.2L17 15.3zM13.9 12.2l3.1 3.1-9.8 5.6c-.6.3-1.1.3-1.5 0l8.2-8.7zM5.7 3.1c.4-.3.9-.3 1.5 0l9.8 5.6-3.1 3.1L5.7 3.1z"/></svg>'
// Platzhalter statt eines echten Codes — der Code ist nicht Gegenstand der Arena.
const QR_SRC = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 7 7%22 shape-rendering=%22crispEdges%22%3E%3Crect width=%227%22 height=%227%22 fill=%22%23fff%22/%3E%3Cpath d=%22M0 0h3v3H0zM4 0h3v3H4zM0 4h3v3H0zM4 4h1v1H4zM6 4h1v1H6zM5 5h1v1H5zM4 6h1v1H4zM6 6h1v1H6z%22 fill=%22%23000%22/%3E%3C/svg%3E'

const abzeichen = (symbol, kicker, name) => `<a class="nc-app-store__badge" href="#" onclick="return false" rel="noopener">
${symbol}
<span class="nc-app-store__badge-text">
<span class="nc-app-store__badge-kicker">${kicker}</span>
<span class="nc-app-store__badge-name">${name}</span>
</span>
</a>`

export default (zelle, m) => `
<div class="${m.klasse}"${m.attrs}>
<h2 class="nc-section-header__title">Jetzt laden — oder in zwei Minuten ansehen</h2>
<p class="nc-section-header__subtitle">Die neo app gibt es für iOS und Android. Der Zugang läuft über Ihre Organisation; einen Testzugang richten wir auf Anfrage ein.</p>
${an(m, 'badges') ? `<div class="nc-app-store__badges">
${abzeichen(APPLE, 'Laden im', 'App&nbsp;Store')}
${abzeichen(PLAY, 'Jetzt bei', 'Google&nbsp;Play')}
</div>` : ''}
${an(m, 'qr') ? `<div class="nc-app-store__qr">
<div class="nc-app-store__qr-code"><img src="${QR_SRC}" alt="QR-Code zum Laden der App" width="128" height="128" loading="lazy"></div>
<p class="nc-app-store__qr-text">Mit der Kamera scannen — die App öffnet sich im passenden Store.</p>
</div>` : ''}
${an(m, 'note') ? '<p class="nc-app-store__note">iOS 16 und Android 10 oder neuer · Deutsch und Englisch</p>' : ''}
</div>
`
