// Vorlage: testimonial — Aufbau wie block--block-content--neo-testimonial
// .html.twig (neo_fe), Texte aus data/markup/testimonial.html. Plan v3,
// Phase 4 — render.compositionType waehlt, welche Felder gefuellt sind
// (Drupal zeigt jeden Teil nur, wenn das Feld gefuellt ist):
//   (ohne)       Zitat, Name, Rolle — wie die Ernte
//   ergebnisse   dazu messbare Ergebnisse (__results) und Kontext (__context)
//   person       Avatar, Firmenlogo und Social-Link
//   video        Video-Vorschau mit Abspiel-Knopf oben in der Karte
// Slot role: ohne Rolle (slotConfig role: false bzw. compositionType
// „ohne-rolle").
// Rahmen ra-feld--breit: die Karte fuellt ihre Spalte.
import { BILD_SRC } from './_helfer.js'
import { testimonialHtml } from './_testimonial.js'

const BASIS = {
  zitat: '„Exzellente Dokumentation und klare Muster.“',
  name: 'Pia Weber',
  rolle: 'Product Manager, Festo'
}

const FELDER = {
  ergebnisse: {
    ergebnisse: ['40 % weniger interne E-Mails', '12.000 aktive Nutzer im ersten Monat'],
    kontext: ['Industrie', '20.000 Mitarbeitende']
  },
  person: { avatar: BILD_SRC, logo: BILD_SRC, socials: true },
  video: { video: true }
}

export default (zelle, m) => {
  const art = m.specimen.render?.compositionType
  const rolleZeigen = m.slotConfig?.role !== false && art !== 'ohne-rolle'
  return `<div class="ra-feld ra-feld--breit">
${testimonialHtml({ ...BASIS, ...(FELDER[art] || {}) }, { klasse: m.klasse, attrs: m.attrs, rolleZeigen })}
</div>`
}
