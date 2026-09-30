// Vorlage: feature-list — Markup aus data/markup/feature-list.html.
// variante: with-media/media-left/media-right zeigen das Geraet (media-*
// tragen dazu --with-media wie im geernteten Markup), valign-* per Modifier;
// default ohne Medium.
import { BILD_SRC, HAKEN_KREIS } from './_helfer.js'

const PUNKTE = [
  'Anmeldung mit Benutzername/E-Mail und Passwort',
  'Firmenaccount-Login z.B. via Microsoft-Kennung (Entra ID) / LDAP',
  'SAML 2.0 / OpenID Connect für unternehmensweites Single-Sign-On',
  'Kopplung an bestehende Nutzerkonten von neo workplace'
]

export default (zelle, m) => {
  const v = m.wert('variante') || 'default'
  const medium = ['with-media', 'media-left', 'media-right'].includes(v)
  const extra = v.startsWith('media-') ? ' nc-feature-list--with-media' : ''
  return `
<section class="nc-section ${m.klasse}${extra}"${m.attrs}>
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
<div class="nc-feature-list__cta"><a href="#" onclick="return false" class="nc-button nc-button--primary">Mehr zur Sicherheit</a></div>
</div>
</div>
</section>`
}
