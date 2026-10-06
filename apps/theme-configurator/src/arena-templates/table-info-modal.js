// Vorlage: table-info-modal — Info-Dialog zu einer Tabellenzelle, Markup aus
// data/markup/table-info-modal.html (geerntet von /events/editionen-preise):
//   div.nc-table-info-modal[role=dialog] (+ .is-open)  aria-hidden
//     div.nc-table-info-modal__backdrop  (Klick schliesst)
//     div.nc-table-info-modal__content
//       button.nc-table-info-modal__close  aria-label
//       div.nc-table-info-modal__body   (fuellt die Website per JS mit dem
//                                        Infotext der Zelle)
// Abweichung von der Ernte: aria-modal und aria-labelledby (die Ernte hat
// keinen Namen am Dialog) — gemeldet, nicht im DS geaendert.
//
// Zustaende: open = .is-open (das SCSS blendet per opacity ein); geschlossen
// ist der Dialog unsichtbar (opacity 0) — die Zelle zeigt den leeren Rahmen.
// hover/focus gibt es nur am Schliessen-Knopf und nur bei offenem Dialog:
// data-zustand am Knopf, der Dialog steht offen.
// Rahmen ra-buehne: der Dialog ist position: fixed; inset: 0 — contain macht
// den Rahmen zu seinem Bezugsrahmen.
//
// „Ausprobieren" (Entscheidung 06.10.2026, overlay-verhalten): eine
// Tabellenzelle mit Info-Knopf (.nc-tbl-cell__info-btn, aria-controls,
// data-info) im Rahmen, Dialog startet geschlossen; das Behavior
// table-info-modal aus neo-behaviors setzt den Text aus data-info in __body
// und oeffnet (Fokus auf den Schliessen-Knopf, Falle, Escape, Backdrop,
// Fokus zurueck). Den Namen nimmt der Dialog dort vom Info-Knopf (der Text
// in __body wird ersetzt, ein aria-labelledby darin liefe ins Leere). Auf
// der Website bis zur Umstellung neo-theme.js (neoTable).
import { SYMBOL } from './_helfer.js'

const INFO_TEXT = 'Anmeldung mit dem Firmenkonto über SAML oder OpenID Connect.\nIn der Edition „Professional“ enthalten, in „Basic“ als Zusatzmodul buchbar.'

export default (zelle, m) => {
  const marke = m.ausprobieren ? undefined : m.attribute['data-zustand']
  const offen = !m.ausprobieren && (m.hat('open') || !!marke)
  const zelleMitInfo = m.ausprobieren
    ? `<div class="nc-tbl-cell"><p class="nc-tbl-cell__text">Single Sign-on <button type="button" class="nc-tbl-cell__info-btn" aria-label="Mehr Informationen zu Single Sign-on" aria-haspopup="dialog" aria-controls="${m.uid}-info" data-info="${INFO_TEXT.replace(/"/g, '&quot;')}">${SYMBOL.info}</button></p></div>\n`
    : ''
  return `<div class="ra-buehne ra-buehne--niedrig">
${zelleMitInfo}<div class="nc-table-info-modal${offen ? ' is-open' : ''}" id="${m.uid}-info" role="dialog" aria-modal="true"${m.ausprobieren ? '' : ` aria-labelledby="${m.uid}-titel"`} aria-hidden="${!offen}">
<div class="nc-table-info-modal__backdrop"></div>
<div class="nc-table-info-modal__content">
<button type="button" class="nc-table-info-modal__close" aria-label="Schließen"${marke ? ` data-zustand="${marke}"` : ''}>${SYMBOL.schliessen}</button>
<div class="nc-table-info-modal__body">
<p id="${m.uid}-titel"><strong>Single Sign-on</strong></p>
<p>Anmeldung mit dem Firmenkonto über SAML oder OpenID Connect. In der Edition „Professional“ enthalten, in „Basic“ als Zusatzmodul buchbar.</p>
</div>
</div>
</div>
</div>`
}
