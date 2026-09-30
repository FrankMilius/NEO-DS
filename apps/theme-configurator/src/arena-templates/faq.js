// Vorlage: faq — Markup aus data/markup/faq.html. Zustand „open" oeffnet den
// ersten Eintrag; sonst ist er wie auf der Website vorgeoeffnet.
export default (zelle, m) => `
<div class="${m.klasse}"${m.attrs}>
<details class="nc-faq__item" open>
<summary class="nc-faq__question">Dieser Eintrag ist vorgeöffnet</summary>
<p class="nc-faq__answer">Durch das <code>open</code>-Attribut am <code>&lt;details&gt;</code>-Element ist dieser Eintrag beim Laden der Seite bereits sichtbar.</p>
</details>
<details class="nc-faq__item"${m.hat('open') ? ' open' : ''}>
<summary class="nc-faq__question">Dieser Eintrag ist geschlossen</summary>
<p class="nc-faq__answer">Klicke auf die Frage, um die Antwort zu sehen.</p>
</details>
</div>
`
