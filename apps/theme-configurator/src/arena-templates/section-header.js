// Vorlage: section-header (06-molecules/_section-header.scss) — Plan v3,
// Phase 5. Markup nach neo_fe:block-header (components/block-header/
// block-header.twig): Badges (neo_fe:badge-row, .nc-badge-row mit
// .nc-section-header__badges) -> Kicker -> Headline -> Lead. Texte aus dem
// geernteten Markup von feature-list (data/markup/feature-list.html), die
// Badges wie im Hero der Website (.nc-label--pill).
// Specimen „abstand": der Folgeinhalt ist ein Platzhalter (Arena-Inhalt).
import { slotAn } from './_bloecke-1.js'
import { platzhalter } from './_layout.js'

export default (zelle, m) => {
  const kopf = `<div class="${m.klasse}"${m.attrs}>
${slotAn(m, 'badges') ? `<div class="nc-badge-row nc-section-header__badges">
<span class="nc-label nc-label--pill">100% Open Source</span>
<span class="nc-label nc-label--pill">DSGVO-konform</span>
</div>` : ''}
${slotAn(m, 'label') ? '<span class="nc-section-header__label">Authentifizierung und Login</span>' : ''}
<h2 class="nc-section-header__title">Sicherer Zugang für jeden Mitarbeitenden</h2>
${slotAn(m, 'subtitle') ? '<p class="nc-section-header__subtitle">Der Zugang zur App ist ausschließlich authentifizierten Nutzerinnen und Nutzern vorbehalten. Verschiedene Login-Verfahren ermöglichen eine einfache Integration in Ihre bestehende IT-Infrastruktur.</p>' : ''}
</div>`
  if (m.specimen.render?.folgeinhalt) {
    return `<div>
${kopf}
${platzhalter('Folgeinhalt des Blocks')}
</div>`
  }
  return kopf
}
