// Vorlage: testimonial — Markup aus data/markup/testimonial.html (ohne die
// Karussell-Breitenangaben der Doku-Seite).
export default (zelle, m) => `
<blockquote class="${m.klasse}"${m.attrs}>
<p class="nc-testimonial__quote">„Exzellente Dokumentation und klare Muster.“</p>
<footer class="nc-testimonial__author">
<div class="nc-testimonial__meta">
<span class="nc-testimonial__name">Pia Weber</span>
<span class="nc-testimonial__role">Product Manager</span>
</div>
</footer>
</blockquote>
`
