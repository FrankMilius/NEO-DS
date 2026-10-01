// Vorlage: select — natives <select class="nc-select"> (Entscheidung
// 01.10.2026: natives Feld bleibt). Das Feld ist echt: anklicken oeffnet die
// Liste des Browsers, eine Auswahl bleibt stehen. Die geoeffnete Liste
// zeichnet der Browser — das Theme gestaltet nur das geschlossene Feld.
//
// variant/size/validation per Modifier aus dem Recipe; type=multiple zeigt
// die native Mehrfachauswahl; content=grouped nutzt <optgroup>.
// Zustaende: disabled (Attribut), open (.is-open am Wrapper, dreht den
// Chevron), placeholder (required + leere Option); hover/focus nur echt.
// Mit Indikator (Specimen composes: indicator oder open) im .nc-select-wrapper.
import { esc } from './_helfer.js'

const CHEVRON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>'

function optionen (m, platzhalter) {
  if (m.wert('content') === 'grouped') {
    return `<optgroup label="Europa"><option>Berlin</option><option selected>Hamburg</option><option>Wien</option></optgroup>
<optgroup label="Amerika"><option>New York</option><option>Toronto</option></optgroup>`
  }
  const leer = platzhalter ? '<option value="" disabled selected>Bitte auswählen …</option>' : ''
  return `${leer}<option${platzhalter ? '' : ' selected'}>Option A</option><option>Option B</option><option>Option C</option>`
}

export default (zelle, m) => {
  const offen = m.hat('open') || m.specimen.render?.compositionType === 'select-open-state'
  const platzhalter = m.hat('placeholder') || m.specimen.id === 'placeholder-hack'
  const mehrfach = m.wert('type') === 'multiple'
  // filled nutzt laut Recipe den Indikator statt des Hintergrundbilds
  const mitIndikator = offen || m.slot('indicator') || m.wert('variant') === 'filled' || (m.specimen.composes || []).includes('indicator')
  const klasse = m.klassen.filter((k) => k !== 'is-open').join(' ')
  const attrs = m.attrsOhne('data-state', 'aria-expanded')
  const feld = `<select class="${klasse}" aria-label="${esc(m.text || 'Auswahl')}"${attrs}${m.deaktiviert ? ' disabled' : ''}${platzhalter ? ' required' : ''}${mehrfach ? ' multiple size="4"' : ''}>
${optionen(m, platzhalter)}
</select>`
  if (!mitIndikator || mehrfach) return feld
  return `<div class="nc-select-wrapper${offen ? ' is-open' : ''}">${feld}<span class="nc-select__indicator">${CHEVRON}</span></div>`
}
