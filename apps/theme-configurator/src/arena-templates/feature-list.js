// Vorlage: feature-list — Markup aus data/markup/feature-list.html, abgeglichen
// mit block--block-content--neo-feature-list.html.twig (neo_fe). Drupal setzt
// mit Medium immer alle drei Klassen: --with-media, --media-<links|rechts>
// und --valign-<oben|mitte|unten>; ohne Medium keine davon. Jede variante
// ausser default zeigt deshalb das Geraet und ergaenzt die fehlenden
// Klassen mit den Drupal-Vorgaben (media-left, valign-top). Die Punkte baut
// Drupal per JS (neo-theme.js) — gleiches Markup wie hier.
import { BILD_SRC, HAKEN_KREIS } from './_helfer.js'

const PUNKTE = [
  'Anmeldung mit Benutzername/E-Mail und Passwort',
  'Firmenaccount-Login z.B. via Microsoft-Kennung (Entra ID) / LDAP',
  'SAML 2.0 / OpenID Connect für unternehmensweites Single-Sign-On',
  'Kopplung an bestehende Nutzerkonten von neo workplace'
]

export default (zelle, m) => {
  const v = m.wert('variante') || 'default'
  const medium = v !== 'default'
  const klassen = [...m.klassen]
  if (medium) {
    for (const k of ['nc-feature-list--with-media',
      v === 'media-right' ? 'nc-feature-list--media-right' : 'nc-feature-list--media-left',
      v.startsWith('valign-') ? `nc-feature-list--${v}` : 'nc-feature-list--valign-top']) {
      if (!klassen.includes(k)) klassen.push(k)
    }
  }
  return `
<section class="nc-section ${klassen.join(' ')}"${m.attrs}>
<div class="nc-container nc-feature-list__inner">
${medium ? `<div class="nc-feature-list__media nc-feature-list__media--device"><div class="nc-device"><div class="nc-device__screen"><img src="${BILD_SRC}" alt="Login" loading="lazy" decoding="async"></div></div></div>` : ''}
<div class="nc-feature-list__content">
<div class="nc-section-header nc-section-header--flush">
<span class="nc-section-header__label">Authentifizierung und Login</span>
<h2 class="nc-section-header__title">Sicherer Zugang für jeden Mitarbeitenden</h2>
<p class="nc-section-header__subtitle">Verschiedene Login-Verfahren ermöglichen eine einfache Integration in Ihre bestehende IT-Infrastruktur.</p>
</div>
<div class="nc-feature-list__items-host">
<ul class="nc-feature-list__items">
${PUNKTE.map((p) => `<li class="nc-feature-list__item"><span class="nc-feature-list__icon">${HAKEN_KREIS}</span><span class="nc-feature-list__item-text">${p}</span></li>`).join('\n')}
</ul>
</div>
<div class="nc-feature-list__cta"><a class="nc-button nc-button--accent nc-button--lg" href="#" onclick="return false"><span>Mehr zur Sicherheit</span></a></div>
</div>
</div>
</section>`
}
