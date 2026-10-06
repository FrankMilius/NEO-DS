// Vorlage: faq — Markup aus data/markup/faq.html: <details>/<summary>, die
// Antwort als <p>. Plan v3, Phase 4:
//   Zustand default  alle Eintraege zu (Stand beim Laden ohne open-Attribut)
//   Zustand open     erster Eintrag offen (open-Attribut, wie im geernteten
//                    Markup „vorgeoeffnet")
//   render.fragen    eigene Liste; render.offen: Indizes der offenen
//                    Eintraege (mehrere zugleich — native <details>, kein
//                    „nur eines offen")
// Das Modell setzt fuer open pauschal is-open und data-state — das DS kennt
// am FAQ beides nicht, der Zustand steht am <details>.
//
// „Ausprobieren": Auf- und Zuklappen macht der Browser (<details>), wie auf
// der Website. Das Akkordeon-Verhalten aus neo-behaviors (Pfeiltasten,
// „nur eines offen", Ereignis accordion-toggle) bindet nur .nc-accordion —
// am FAQ greift es nicht.
import { esc, klassenOhne } from './_helfer.js'
import { vorgabe } from './_bloecke-1.js'

// Texte aus geerntetem Website-Markup (bento-grid, app-store), keine neuen
// Produktaussagen.
const FRAGEN = [
  ['Wo läuft neo workplace?', 'Flexible Betriebsmodelle für jede Compliance-Anforderung: in der Cloud oder On-Prem.'],
  ['Gibt es eine App?', 'Die neo app gibt es für iOS und Android. Der Zugang läuft über Ihre Organisation.'],
  ['Ist neo workplace barrierefrei?', 'WCAG-konform nach BITV 2.0 – Zugänglichkeit als Standard, nicht als Feature.']
]

export const ausprobieren = {
  hinweis: 'Klicken oder Enter/Leertaste auf eine Frage — auf- und zuklappen macht der Browser (<details>), wie auf der Website. Pfeiltasten und „nur eines offen" des Akkordeons greifen am FAQ nicht.'
}

export default (zelle, m) => {
  const fragen = vorgabe(m, 'fragen', null)?.map(([f, a]) => [esc(f), esc(a)]) || FRAGEN
  const offen = new Set(vorgabe(m, 'offen', m.hat('open') && !m.ausprobieren ? [0] : []))
  return `
<div class="${klassenOhne(m, 'is-open')}"${m.attrsOhne('data-state')}>
${fragen.map(([frage, antwort], i) => `<details class="nc-faq__item"${offen.has(i) ? ' open' : ''}>
<summary class="nc-faq__question">${frage}</summary>
<p class="nc-faq__answer">${antwort}</p>
</details>`).join('\n')}
</div>
`
}
