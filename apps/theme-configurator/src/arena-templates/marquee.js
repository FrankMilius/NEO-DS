// Vorlage: marquee — Markup aus data/markup/marquee.html (ohne die
// Demo-Animation der Doku-Seite; die Bewegung kommt aus dem DS-CSS).
export default (zelle, m) => `
<div class="${m.klasse}" aria-hidden="true"${m.attrs}>
<div class="nc-marquee__track">
<span class="nc-marquee__text">Kommunikation — Wissen — Events — Vernetzung — Anwendungen — </span>
<span class="nc-marquee__text">Kommunikation — Wissen — Events — Vernetzung — Anwendungen — </span>
</div>
</div>
`
