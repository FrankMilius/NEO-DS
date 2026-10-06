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
// den Rahmen zu seinem Bezugsrahmen. Das Recipe nennt weder keyboard noch
// events — kein „Ausprobieren"; auf der Website oeffnet neo-theme.js den
// Dialog.
import { SYMBOL } from './_helfer.js'

export default (zelle, m) => {
  const marke = m.attribute['data-zustand']
  const offen = m.hat('open') || !!marke
  return `<div class="ra-buehne ra-buehne--niedrig">
<div class="nc-table-info-modal${offen ? ' is-open' : ''}" role="dialog" aria-modal="true" aria-labelledby="${m.uid}-titel" aria-hidden="${!offen}">
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
