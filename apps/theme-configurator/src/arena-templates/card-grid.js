// Vorlage: card-grid — Markup aus data/markup/card-grid.html (drei Karten).
// pattern hat im DS keinen Modifier, sondern bestimmt die Karten:
// standard = Bild nur an der ersten Karte, preview = Bild an allen Karten,
// featured = erste Karte nc-card--featured, horizontal = Bild neben Text
// (nc-card--square-media). animation=reverse-domino setzt data-animation und
// den Endzustand is-revealed.
import { BILD_SRC, SYMBOL } from './_helfer.js'

const KARTEN = [
  ['Aus PIIPE Workplace wird neo workplace', 'Produktnews · Juli 2026 — Mit dem Einzug von KI und dem funktionalen Ausbau des NEOCOSMO Produktuniversums werden die Namen der NEOCOSMO Produkte unter der Firmendachmarke vereinheitlicht.'],
  ['neo AI - statt Suchen gibt es Antworten', 'Produktnews · ab Juli 2026 — mit neo AI bringt NEOCOSMO eine spezielle Intranet-KI auf den Markt: sicher, offen, schnell.'],
  ['NEOCOSMO in Analysten-Ranking top platziert', 'Auszeichnung als einer der innovativsten Anbieter im D/A/CH Raum.']
]

export default (zelle, m) => {
  const muster = m.wert('pattern') || 'standard'
  const domino = m.wert('animation') === 'reverse-domino'
  const karte = ([titel, text], i) => {
    const bild = muster === 'preview' || muster === 'horizontal' || i === 0
    const mods = ['nc-card', 'nc-card--navigational']
    if (muster === 'preview') mods.push('nc-card--preview')
    if (muster === 'featured' && i === 0) mods.push('nc-card--featured')
    if (muster === 'horizontal') mods.push('nc-card--square-media')
    return `<article class="${mods.join(' ')}"${domino ? ` style="--card-delay: ${i / 10}s;"` : ''}>
${bild ? `<div class="nc-card__media"><img src="${BILD_SRC}" alt="" loading="lazy"></div>` : ''}
<div class="nc-card__content">
<h3 class="nc-card__title">${titel}</h3>
<p class="nc-card__description">${text}</p>
</div>
<div class="nc-card__footer"><span class="nc-card__footer-label">Mehr darüber erfahren</span><span class="nc-card__footer-icon">${SYMBOL.pfeil}</span></div>
</article>`
  }
  return `
<div class="${m.klasse} nc-card-grid--cols-3${domino ? ' is-revealed' : ''}" data-pattern="${muster}"${domino ? ' data-animation="reverse-domino"' : ''}${m.attrs}>
${KARTEN.map(karte).join('\n')}
</div>`
}
