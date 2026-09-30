// Vorlage: product-showcase — Markup aus data/markup/product-showcase.html
// (drei Stationen, erste aktiv). Alle Achsen per Modifier; zusaetzlich
// aendern sie das Markup: interaktion=accordion nutzt Trigger + Panel wie
// im geernteten Markup, sonst Optionsgruppen (Tabs); optionStyle=indicator
// setzt den Farbpunkt (slotConfig option-indicator); mediaFrame=device legt
// das Bild in ein nc-device.
import { BILD_SRC } from './_helfer.js'

const STATIONEN = [
  ['Zugang', 'Anmelden wie gewohnt — auch ohne Firmen-E-Mail', 'Wer in der Produktion arbeitet, hat oft gar keine Adresse im Unternehmen. Der Zugang über Personalnummer oder Einladungscode löst genau das.', 'var(--fnd-color-accent, #aef359)'],
  ['Orientierung', 'Drei Fingertipps bis zur wichtigsten Information', 'Die Startseite zeigt, was heute zählt. Alles andere liegt eine Ebene tiefer und bleibt auffindbar.', 'var(--fnd-color-text-info, #3b82f6)'],
  ['Austausch', 'Die Spätschicht antwortet, bevor Sie zu Hause sind', 'Communities, Blogs und das Verzeichnis sind vollständig dabei: lesen, posten, kommentieren.', 'var(--fnd-color-text-warning, #f59e0b)']
]

export default (zelle, m) => {
  const akkordeon = m.wert('interaktion') === 'accordion'
  const indikator = m.slot('option-indicator') || m.wert('optionStyle') === 'indicator'
  const geraet = m.wert('mediaFrame') === 'device'
  const bilder = STATIONEN.map(([, titel], i) => `<img class="nc-product-showcase__media-item${i === 0 ? ' is-active' : ''}" src="${BILD_SRC}" alt="${titel}" decoding="async">`).join('\n')
  const medien = geraet ? `<div class="nc-device"><div class="nc-device__screen">\n${bilder}\n</div></div>` : bilder
  const punkt = (farbe) => indikator ? `<span class="nc-product-showcase__option-indicator" style="background-color: ${farbe};" aria-hidden="true"></span>` : ''
  const optionen = STATIONEN.map(([label, titel, text, farbe], i) => akkordeon
    ? `<div class="nc-product-showcase__option${i === 0 ? ' is-active' : ''}">
<button type="button" class="nc-product-showcase__trigger" id="${m.uid}-t${i}" aria-expanded="${i === 0}" aria-controls="${m.uid}-p${i}">${punkt(farbe)}
<span class="nc-product-showcase__label">${label}</span>
<span class="nc-product-showcase__title">${titel}</span>
</button>
<div class="nc-product-showcase__panel" id="${m.uid}-p${i}" role="region" aria-labelledby="${m.uid}-t${i}"><div><p class="nc-product-showcase__description-text">${text}</p></div></div>
</div>`
    : `<div class="nc-product-showcase__option-group">
<button type="button" class="nc-product-showcase__option${i === 0 ? ' is-active' : ''}" aria-pressed="${i === 0}">${punkt(farbe)}<span class="nc-product-showcase__title">${titel}</span></button>
${i === 0 ? `<div class="nc-product-showcase__description"><p class="nc-product-showcase__description-text">${text}</p></div>` : ''}
</div>`).join('\n')
  return `
<div class="${m.klasse}"${m.attrs}>
<div class="nc-product-showcase__media-panel">
${medien}
</div>
<div class="nc-product-showcase__options">
${optionen}
</div>
</div>`
}
