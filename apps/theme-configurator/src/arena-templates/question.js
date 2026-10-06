// Vorlage: question — Markup aus data/markup/question.html (zwei Laufzeilen,
// Trennlinien, Aktionsbereich mit zwei Knoepfen). Plan v3, Phase 4.
//
// Animierter Website-Block: die Laufzeilen bewegen sich nur mit
// .question-animate (07-organisms/_question.scss, Keyframes marquee/
// marquee-reverse). Die Zellen zeigen das Standbild (ohne die Klasse, keine
// Inline-Gestaltung); die Taste „Abspielen" der RecipeArena (export
// abspielen) setzt sie und nimmt sie beim Anhalten wieder weg — kein GSAP.
// Bei prefers-reduced-motion sperrt die Arena die Taste.
//
// Rahmen ra-desktop: der Block ist fuer die Seitenbreite gebaut (Knoepfe im
// 12-Spalten-Raster des Containers).
// variant=with-text: der Modifier gehoert an den Aktionsbereich
// (.question-action-section.with-text), nicht an die Wurzel; davor ein
// Absatz (question-paragraphs).
const ICON = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"></path></svg>'

const ZEILEN = [
  ['Wie können wir effizienter werden?', 'Was wäre wenn alles möglich ist?'],
  ['Welche Lösung passt zu uns?', 'Wie wachsen wir nachhaltig?']
]

export default (zelle, m) => {
  const mitText = m.wert('variant') === 'with-text'
  const wurzel = m.klassen.filter((k) => k !== 'with-text').join(' ')
  return `<div class="ra-desktop">
<section class="${wurzel}"${m.attrs}>
${ZEILEN.map(([a, b]) => `<hr>
<div class="question-text-row" aria-hidden="true">
<span class="question-text">${a} ${ICON} ${b} ${ICON} ${a} ${ICON} ${b} ${ICON}</span>
</div>`).join('\n')}
<hr>
<div class="question-action-section${mitText ? ' with-text' : ''}">
${mitText ? '<div class="question-text-container question-paragraphs"><p>Gute Fragen verdienen gute Antworten. Wir zeigen Ihnen, wie andere Organisationen sie gefunden haben.</p></div>' : ''}
<div class="question-buttons">
<button class="nc-button nc-button--primary" type="button">Demo vereinbaren</button>
<button class="nc-button nc-button--outline" type="button">Mehr erfahren</button>
</div>
</div>
<hr>
</section>
</div>`
}

/** Animierter Block: Standbild, Laufzeilen mit „Abspielen" (Plan v3, Phase 4). */
export const abspielen = {
  hinweis: 'Laufzeilen mit .question-animate (CSS-Keyframes des DS); Anhalten zeigt wieder das Standbild.',
  starten (zelle) {
    const zeilen = [...zelle.querySelectorAll('.question-text-row')]
    for (const z of zeilen) z.classList.add('question-animate')
    return () => { for (const z of zeilen) z.classList.remove('question-animate') }
  }
}
