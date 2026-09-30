// Vorlage: file-upload — Markup aus data/markup/file-upload.html, Dateiliste
// nach Anatomie (nc-file-upload-list). content-Achse schaltet die Liste per
// slotConfig; validation=error und Zustand dragging kommen als Modifier.
import { SYMBOL } from './_helfer.js'

const HOCHLADEN = '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>'
const DATEI = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>'

const DATEIEN = [['Angebot_2026.pdf', '1,2 MB', 100], ['Präsentation.pptx', '8,4 MB', 45]]

export default (zelle, m) => {
  const liste = m.slot('list')
    ? `<ul class="nc-file-upload-list">
${DATEIEN.map(([name, groesse, prozent]) => `<li class="nc-file-upload-list__item">
<span class="nc-file-upload-list__icon">${DATEI}</span>
<span class="nc-file-upload-list__name">${name}</span>
<span class="nc-file-upload-list__size">${groesse}</span>
${m.slot('list-progress') ? `<progress class="nc-file-upload-list__progress" max="100" value="${prozent}">${prozent} %</progress>` : ''}
<button class="nc-file-upload-list__remove" type="button" aria-label="${name} entfernen">${SYMBOL.schliessen}</button>
</li>`).join('\n')}
</ul>`
    : ''
  return `
<div class="${m.klasse}" role="button" tabindex="${m.deaktiviert ? '-1' : '0'}"${m.attrs}>
<input class="nc-file-upload__input" type="file" multiple tabindex="-1"${m.deaktiviert ? ' disabled' : ''}>
<span class="nc-file-upload__icon">${HOCHLADEN}</span>
<span class="nc-file-upload__text">${m.hat('dragging') ? 'Loslassen zum Hochladen' : 'Dateien hierher ziehen'}</span>
<span class="nc-file-upload__subtext">oder <span class="nc-file-upload__button">Dateien auswählen</span></span>
</div>
${liste}`
}
