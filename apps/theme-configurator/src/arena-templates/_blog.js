// Gemeinsames Markup der Blog-Bausteine (I15 Phase 1, 22.11.2026):
// Byline (.nc-byline), Teilen-Leiste (.nc-share-bar) und Blog-Artikel
// (.t-article--blog). Dieselben Bausteine nutzen die Vorlagen byline.js,
// share-bar.js und blog-article.js; data/markup/*.html und die Doku-Beispiele
// sind daraus erzeugt. Ohne Abhängigkeiten, damit es auch in Node läuft.
// Person und Texte sind erfunden.

export const PERSON = { name: 'Lena Hoffmann', initialen: 'LH' }

// Graues Personenbild wie in der Avatar-Vorlage
export const PERSON_SRC = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 64 64%22%3E%3Crect width=%2264%22 height=%2264%22 fill=%22%23c9ced6%22/%3E%3Ccircle cx=%2232%22 cy=%2225%22 r=%2212%22 fill=%22%23aab1bc%22/%3E%3Cpath d=%22M10 64c2-14 11-21 22-21s20 7 22 21z%22 fill=%22%23aab1bc%22/%3E%3C/svg%3E'

// Hauptbild 16:9 (Platzhalter)
export const BILD_SRC = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1600 900%22 width=%221600%22 height=%22900%22%3E%3Crect width=%221600%22 height=%22900%22 fill=%22%23c9ced6%22/%3E%3Cpath d=%22M0 900 560 400l360 300 200-150 480 350z%22 fill=%22%23aab1bc%22/%3E%3Ccircle cx=%221180%22 cy=%22250%22 r=%2290%22 fill=%22%23aab1bc%22/%3E%3C/svg%3E'

// Tabler Icons (assets/icons), 20 px im Knopf
const svg = (pfade) => `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${pfade}</svg>`
export const ICON = {
  share: svg('<path d="M3 12a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"/><path d="M15 6a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"/><path d="M15 18a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"/><path d="M8.7 10.7l6.6 -3.4"/><path d="M8.7 13.3l6.6 3.4"/>'),
  linkedin: svg('<path d="M8 11v5"/><path d="M8 8v.01"/><path d="M12 16v-5"/><path d="M16 16v-3a2 2 0 1 0 -4 0"/><path d="M3 7a4 4 0 0 1 4 -4h10a4 4 0 0 1 4 4v10a4 4 0 0 1 -4 4h-10a4 4 0 0 1 -4 -4l0 -10"/>'),
  mail: svg('<path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10"/><path d="M3 7l9 6l9 -6"/>'),
  link: svg('<path d="M9 15l6 -6"/><path d="M11 6l.463 -.536a5 5 0 0 1 7.071 7.072l-.534 .464"/><path d="M13 18l-.397 .534a5.068 5.068 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463"/>')
}

export const ARTIKEL = {
  url: 'https://example.org/inside/blog/ki-assistenten-im-intranet',
  kategorie: 'Künstliche Intelligenz',
  titel: 'Warum KI-Assistenten im Intranet scheitern und wie es besser geht',
  untertitel: 'Drei Projekte, ein Muster: Die Technik funktioniert, die Inhalte nicht. Was wir aus der Einführung bei Kommunen und Mittelständlern gelernt haben.',
  lesezeit: '7 Min. Lesezeit',
  datum: ['2026-11-18', '18. Nov. 2026'],
  bildunterschrift: 'Ein Assistent ist nur so gut wie die Inhalte, auf die er zugreift.',
  tags: ['KI', 'Intranet', 'Wissensmanagement', 'Öffentliche Verwaltung']
}

const enc = encodeURIComponent

/**
 * Byline: Foto (oder Initialen), Name, Lesezeit · Datum.
 * @param {{ klein?: boolean, foto?: boolean, klasse?: string, attrs?: string }} o
 */
export function byline ({ klein = false, foto = true, klasse, attrs = '' } = {}) {
  const k = klasse || `nc-byline${klein ? ' nc-byline--sm' : ''}`
  const bild = foto ? `<img class="nc-avatar__image" src="${PERSON_SRC}" alt="">` : ''
  return `<div class="${k}"${attrs}>` +
    `<span class="nc-avatar nc-byline__photo">${bild}<span class="nc-avatar__fallback" aria-hidden="true">${PERSON.initialen}</span></span>` +
    '<div class="nc-byline__text">' +
    `<span class="nc-byline__name">${PERSON.name}</span>` +
    `<span class="nc-byline__meta"><span>${ARTIKEL.lesezeit}</span><time datetime="${ARTIKEL.datum[0]}">${ARTIKEL.datum[1]}</time></span>` +
    '</div></div>'
}

const knopf = (inhalt, label, href, extra = '') => href
  ? `<a class="nc-button nc-button--ghost nc-button--icon-only nc-button--sm" href="${href}" aria-label="${label}"${extra}><span class="nc-button__icon">${inhalt}</span></a>`
  : `<button class="nc-button nc-button--ghost nc-button--icon-only nc-button--sm" type="button" aria-label="${label}"${extra}><span class="nc-button__icon">${inhalt}</span></button>`

/**
 * Teilen-Leiste: Teilen (Web Share), LinkedIn, E-Mail, Link kopieren.
 * @param {{ beschriftung?: boolean, klasse?: string, attrs?: string }} o
 */
export function shareBar ({ beschriftung = false, klasse = 'nc-share-bar', attrs = '' } = {}) {
  const linkedin = `https://www.linkedin.com/sharing/share-offsite/?url=${enc(ARTIKEL.url)}`
  const mail = `mailto:?subject=${enc(ARTIKEL.titel)}&amp;body=${enc(ARTIKEL.url)}`
  return `<div class="${klasse}" role="group" aria-label="Artikel teilen"${attrs}>` +
    (beschriftung ? '<span class="nc-share-bar__label" aria-hidden="true">Teilen</span>' : '') +
    '<div class="nc-share-bar__actions">' +
    knopf(ICON.share, 'Teilen') +
    knopf(ICON.linkedin, 'Auf LinkedIn teilen (öffnet in neuem Tab)', linkedin, ' target="_blank" rel="noopener noreferrer"') +
    knopf(ICON.mail, 'Per E-Mail teilen', mail) +
    knopf(ICON.link, 'Link kopieren') +
    '</div></div>'
}

/** Blase an einer markierten Textstelle (nur Aussehen, Verhalten folgt in Phase 3). */
export function popover ({ attrs = '' } = {}) {
  return `<div class="nc-share-bar__popover" role="group" aria-label="Textstelle teilen"${attrs}>` +
    '<button class="nc-button nc-button--ghost nc-button--xs" type="button">Zitat teilen</button>' +
    '<button class="nc-button nc-button--ghost nc-button--xs" type="button">Link kopieren</button>' +
    '</div>'
}

export const PROSA = [
  '<p>Als wir im Frühjahr den ersten KI-Assistenten in ein Intranet einbauten, lief die Technik nach zwei Wochen stabil. Die Enttäuschung kam später, als die Mitarbeitenden ihre ersten echten Fragen stellten und Antworten bekamen, die gut klangen, aber nicht stimmten.</p>',
  '<p><mark>Ein Assistent findet nur, was jemand vorher sauber aufgeschrieben hat.</mark> Veraltete Richtlinien, doppelte Seiten und fehlende Zuständigkeiten führen zu Antworten, die überzeugend klingen und trotzdem falsch sind. Das Modell kann nicht wissen, welche von zwei Fassungen einer Reiserichtlinie die gültige ist.</p>',
  '<blockquote><p>„Wir haben drei Monate lang Inhalte aufgeräumt, bevor der Assistent eine einzige Frage beantworten durfte.“</p></blockquote>',
  '<h2>Erst die Inhalte, dann die Technik</h2>',
  '<p>Bevor wir heute einen Assistenten einschalten, klären wir drei Dinge: Wem gehört welche Seite, wann wurde sie zuletzt geprüft, und welche Seiten dürfen gar nicht als Quelle dienen. Diese drei Fragen klingen banal, doch in keinem der drei Projekte gab es zu Beginn eine vollständige Antwort.</p>',
  '<p>Die gute Nachricht: Die Arbeit lohnt sich doppelt. Ein aufgeräumtes Intranet hilft auch den Menschen, die ohne Assistenten suchen. Und wer Zuständigkeiten einmal festgelegt hat, kann sie im Redaktionssystem hinterlegen und regelmäßig erinnern lassen.</p>'
]

/**
 * Ganzer Artikel nach Entwurf A.
 * @param {{ titelEbene?: number, attrs?: string, klasse?: string, mitPopover?: boolean, mitBild?: boolean }} o
 */
export function artikel ({ titelEbene = 1, attrs = '', klasse = 't-article t-article--blog', mitPopover = true, mitBild = true } = {}) {
  const h = `h${titelEbene}`
  const zwischen = `h${titelEbene + 1}`
  const prosa = PROSA.map((p, i) => {
    let s = p.replace(/<(\/?)h2>/g, `<$1${zwischen}>`)
    // Beispiel: Blase über der markierten Stelle, ohne Behavior im Fluss
    if (i === 1 && mitPopover) s = popover({ attrs: ' style="margin-block-end: var(--fnd-spacing-03);"' }) + s
    return s
  }).join('')
  return `<article class="${klasse}"${attrs}>` +
    '<header class="t-article__header">' +
    `<a class="t-article__category" href="#">${ARTIKEL.kategorie}</a>` +
    `<${h} class="t-article__title">${ARTIKEL.titel}</${h}>` +
    `<p class="t-article__subtitle">${ARTIKEL.untertitel}</p>` +
    byline() +
    shareBar() +
    '</header>' +
    (mitBild ? `<figure class="t-article__figure"><img src="${BILD_SRC}" alt="Platzhalterbild: Landschaft mit Sonne" width="1600" height="900"><figcaption>${ARTIKEL.bildunterschrift}</figcaption></figure>` : '') +
    `<div class="t-article__prose">${prosa}</div>` +
    `<ul class="t-article__tags" aria-label="Schlagwörter">${ARTIKEL.tags.map((t) => `<li><a class="nc-chip" href="#"><span class="nc-chip__label">${t}</span></a></li>`).join('')}</ul>` +
    '</article>'
}
