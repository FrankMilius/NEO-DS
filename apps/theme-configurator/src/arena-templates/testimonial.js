// Vorlage: testimonial — Aufbau wie block--block-content--neo-testimonial
// .html.twig (neo_fe), Texte aus data/markup/testimonial.html. Ergebnisse
// und Kontext zeigt Drupal nur, wenn die Felder gefuellt sind — die Arena
// fuellt sie, damit die Token der Unterelemente sichtbar werden.
import { testimonialHtml } from './_testimonial.js'

export default (zelle, m) => '\n' + testimonialHtml({
  zitat: '„Exzellente Dokumentation und klare Muster.“',
  name: 'Pia Weber',
  rolle: 'Product Manager, Festo',
  ergebnisse: ['40 % weniger interne E-Mails', '12.000 aktive Nutzer im ersten Monat'],
  kontext: ['Industrie', '20.000 Mitarbeitende']
}, { klasse: m.klasse, attrs: m.attrs, rolleZeigen: m.slotConfig?.role !== false }) + '\n'
