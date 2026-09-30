// Vorlage: parallax-bg — Markup wie components/parallax-bg/parallax-bg.twig
// im Drupal-Theme (neo_fe): .nc-parallax-bg mit den Custom Properties,
// .nc-parallax-grid (4 × 8 .nc-parallax-square) und .nc-parallax-bar.
// Endzustand der Scroll-Animation: jede Flaeche hat die Ziel-Deckkraft aus
// parallax-bg.js (targetOpacity: 0.55 unten links, −0.10 je Reihe nach
// oben, −0.05 je Spalte nach rechts, mindestens 0.04).
// Grid, Flaechen und Balken sind in Drupal Komponenten-CSS (parallax-bg.css,
// SDC) — nicht in styles.css. Die Zelle traegt diese Regeln deshalb inline;
// position: fixed wird dabei zu einer festen Buehne von 360 × 200 px.
const SPALTEN = 8
const REIHEN = 4

const deckkraft = (reihe, spalte) => Math.max(0.04, 0.55 - (REIHEN - reihe) * 0.10 - (spalte - 1) * 0.05).toFixed(2)

export default (zelle, m) => {
  const flaechen = []
  for (let r = 1; r <= REIHEN; r++) {
    for (let s = 1; s <= SPALTEN; s++) {
      flaechen.push(`<div class="nc-parallax-square" data-row="${r}" data-col="${s}" style="opacity: ${deckkraft(r, s)}; background-color: var(--nc-parallax-square-color); border-radius: var(--nc-parallax-radius);"></div>`)
    }
  }
  return `
<div class="${m.klasse}" aria-hidden="true"${m.attrs} style="--nc-parallax-bg: var(--fnd-color-always-dark); --nc-parallax-square-color: #ffffff; --nc-parallax-radius: 12px; --nc-parallax-gap: 6px; --nc-parallax-cols: ${SPALTEN}; --nc-parallax-rows: ${REIHEN}; position: relative; width: 360px; height: 200px; display: flex; flex-direction: column; overflow: hidden; background-color: color-mix(in srgb, var(--nc-parallax-bg) 10%, transparent);">
<div class="nc-parallax-grid" style="flex: 1 1 80%; display: grid; grid-template-columns: repeat(var(--nc-parallax-cols), 1fr); grid-template-rows: repeat(var(--nc-parallax-rows), 1fr); gap: var(--nc-parallax-gap); padding: var(--nc-parallax-gap);">
${flaechen.join('\n')}
</div>
<div class="nc-parallax-bar" style="flex: 0 0 20%; background-color: var(--nc-parallax-bg);"></div>
</div>`
}
