// Vorlage: card-cta — Markup aus data/markup/card-cta.html (Website,
// /musterseite-bauteile), abgeglichen mit Drupal.behaviors.neoCardGridCta
// (neo_fe, js/neo-theme.js — die Karten baut dort das Skript, es gibt kein
// eigenes Twig). Die Inline-Variablen am Knopf setzt das Skript auf dunkler
// Karte (heller Knopf auf dunklem Bild).
//
// Achse ton (Recipe 1.1.0, Plan v3, Phase 4): data-theme am Wurzelelement —
// „dunkel" (data-theme="dark", wie auf der Website: heller Titel, dunkler
// Verlauf) oder „hell" (data-theme="light": Titel in always-dark, heller
// Verlauf; Regeln .nc-card-cta[data-theme="light"] in
// 06-molecules/_card-cta.scss). Auf heller Karte bleibt der Knopf beim
// Website-Standard (ohne Inline-Farben).
//
// Freigabe (Abschluss Plan v3, 08.10.2026): render.knopf 'ghost' zeigt den
// Knopf wie bei card.ghost (auf dunkler Karte mit hellen Ghost-Farben),
// render.ohneMedium die Karte ohne Bild und ohne Verlauf (das Skript setzt
// den Verlauf nur mit Medium).
import { BILD_SRC } from './_helfer.js'
import { vorgabe } from './_bloecke-1.js'

const HELL = {
  primary: ' style="--nc-button-primary-bg: var(--fnd-color-always-light); --nc-button-primary-color: var(--fnd-color-always-dark);"',
  ghost: ' style="--nc-button-ghost-color: var(--fnd-color-always-light); --nc-button-ghost-border: var(--fnd-color-always-light);"'
}

export default (zelle, m) => {
  const hell = m.wert('ton') === 'hell'
  const knopf = vorgabe(m, 'knopf', 'primary')
  const medium = !vorgabe(m, 'ohneMedium', false)
  return `
<div class="${m.klasse}" data-theme="${hell ? 'light' : 'dark'}"${m.attrs}>
${medium ? `<img class="nc-card-cta__media" src="${BILD_SRC}" alt="" loading="lazy" decoding="async">
<div class="nc-card-cta__overlay"></div>` : ''}
<div class="nc-card-cta__content">
<h3 class="nc-card-cta__title">Flexibel skalierbar</h3>
<div class="nc-card-cta__actions">
<a href="#" onclick="return false" class="nc-button nc-button--${knopf}" aria-label="Preise ansehen – Flexibel skalierbar"${hell ? '' : HELL[knopf]}>Preise ansehen</a>
</div>
</div>
</div>
`
}
