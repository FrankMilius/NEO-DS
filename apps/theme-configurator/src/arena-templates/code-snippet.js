// Vorlage: code-snippet — Markup aus data/markup/code-snippet.html (geerntet
// von der Doku) und der SCSS-Struktur (scss/scss/05-atoms/_code-snippet.scss):
//   code.nc-code-snippet.nc-code-snippet--inline          (variant=inline)
//   div.nc-code-snippet.nc-code-snippet--single|--multi[--header-*|--wrap|
//       --with-line-numbers|--line-highlight|--expanded]
//     div.nc-code-snippet__header  (plain/window: __header-title; macos:
//       __header-dots mit drei __header-dot--close|minimize|maximize)
//     pre.nc-code-snippet__pre (tabindex=0: scrollbar per Tastatur)
//       > code.nc-code-snippet__code  (Zeilen als span.nc-code-snippet__line,
//         hervorgehobene mit __line--highlighted; Syntax als Prism-.token)
//     button.nc-code-snippet__copy  aria-label="Code kopieren", zwei Symbole
//     button.nc-code-snippet__show-more aria-expanded (nur multi)
//
// Zustaende: expanded (nur multi) → .nc-code-snippet--expanded am Block,
// aria-expanded="true" und „Weniger anzeigen" am Knopf (nicht an der Wurzel).
// Kompositionen code-full-featured und code-macos-full zeigen laut
// Beschreibung Zeilennummern UND Hervorhebung — die Achse features kann nur
// einen Wert tragen, die Vorlage setzt --line-highlight dazu.
// „Ausprobieren": Kopieren und Mehr/Weniger aus neo-behaviors (code-snippet).
import { esc } from './_helfer.js'

const t = (art, text) => `<span class="token ${art}">${esc(text)}</span>`
const p = (text) => t('punctuation', text)

// Beispielcode: 16 Zeilen — mehr als die Hoehe des eingeklappten Blocks
// (--nc-cs-multi-max-height), damit Ein- und Ausklappen sichtbar wird
const ZEILEN = [
  [t('comment', '// Theme-Store einrichten')],
  [t('keyword', 'import'), ' ', p('{'), ' ref', p(','), ' computed ', p('}'), ' ', t('keyword', 'from'), ' ', t('string', "'vue'")],
  [t('keyword', 'import'), ' ', p('{'), ' useThemeStore ', p('}'), ' ', t('keyword', 'from'), ' ', t('string', "'./stores/theme'")],
  [''],
  [t('keyword', 'const'), ' store ', t('operator', '='), ' ', t('function', 'useThemeStore'), p('()')],
  [t('keyword', 'const'), ' dunkel ', t('operator', '='), ' ', t('function', 'computed'), p('(()'), ' ', t('operator', '=>'), ' store', p('.'), 'state', p('.'), 'previewMode ', t('operator', '==='), ' ', t('string', "'dark'"), p(')')],
  [''],
  [t('keyword', 'export'), ' ', t('keyword', 'function'), ' ', t('function', 'wechsle'), ' ', p('('), 'modus', p(')'), ' ', p('{')],
  ['  ', t('keyword', 'if'), ' ', p('('), t('operator', '!'), 'modus', p(')'), ' ', t('keyword', 'return'), ' ', t('boolean', 'false')],
  ['  store', p('.'), 'state', p('.'), 'previewMode ', t('operator', '='), ' modus'],
  ['  ', t('keyword', 'return'), ' ', t('boolean', 'true')],
  [p('}')],
  [''],
  [t('keyword', 'export'), ' ', t('keyword', 'default'), ' ', p('{')],
  ['  name', p(':'), ' ', t('string', "'ThemeConfigurator'"), p(',')],
  ['  version', p(':'), ' ', t('number', '2'), ' ', p('}')]
]
// ohne Syntax: dieselben Zeilen ohne Token-Spans (Text ist schon maskiert)
const ROH = (z) => z.join('').replace(/<[^>]+>/g, '')
const LANGE_ZEILE = 'const meldung = `Theme ${name} gespeichert — ${anzahl} Tokens geändert, ${fehler} Fehler, Zeitstempel ${new Date().toISOString()}`'
const HERVORGEHOBEN = new Set([4, 5])

const KOPIEREN = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2"/><path d="M9 5a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2"/></svg>'
const HAKEN = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M5 12l5 5l10 -10"/></svg>'

const DATEI = { plain: 'theme-store.js', macos: 'theme-store.js', window: 'theme-store.js — Editor' }

function kopf (m) {
  const h = m.wert('header') || 'none'
  if (h === 'none') return ''
  const punkte = h === 'macos'
    ? '<span class="nc-code-snippet__header-dots" aria-hidden="true"><span class="nc-code-snippet__header-dot nc-code-snippet__header-dot--close"></span><span class="nc-code-snippet__header-dot nc-code-snippet__header-dot--minimize"></span><span class="nc-code-snippet__header-dot nc-code-snippet__header-dot--maximize"></span></span>'
    : ''
  return `<div class="nc-code-snippet__header">${punkte}<span class="nc-code-snippet__header-title">${esc(DATEI[h])}</span></div>`
}

export default (zelle, m) => {
  const variant = m.wert('variant') || 'single'
  const farbig = m.wert('syntax') !== 'none'
  const art = m.specimen.render?.compositionType
  // Klassen: Zustandsklassen des Modells (is-open) kennt das DS nicht —
  // expanded ist der Modifier --expanded
  const klassen = m.klassen.filter((k) => !/^is-/.test(k))
  if (art === 'code-full-featured' || art === 'code-macos-full') klassen.push('nc-code-snippet--line-highlight')
  const attrs = m.attrsOhne('aria-expanded')

  if (variant === 'inline') {
    const code = `<code class="${klassen.join(' ')}"${attrs}>useThemeStore()</code>`
    if (art === 'code-in-paragraph') {
      return `<p class="ra-feld ra-feld--breit">Rufen Sie ${code} auf, um auf den Theme-Zustand zuzugreifen. Der aktuelle Modus steht in ${`<code class="${klassen.join(' ')}">state.previewMode</code>`}.</p>`
    }
    return code
  }

  if (m.hat('expanded')) klassen.push('nc-code-snippet--expanded')
  const zeilenweise = klassen.some((k) => k === 'nc-code-snippet--with-line-numbers' || k === 'nc-code-snippet--line-highlight')
  let zeilen = variant === 'single' ? [ZEILEN[4]] : ZEILEN
  if (m.specimen.id === 'wrap-comparison') zeilen = [...zeilen.slice(0, 3), [farbig ? t('keyword', 'const') + esc(LANGE_ZEILE.slice(5)) : esc(LANGE_ZEILE)], ...zeilen.slice(3)]
  const zeile = (z) => (farbig ? z.join('') : ROH(z))
  const code = zeilenweise
    ? zeilen.map((z, i) => `<span class="nc-code-snippet__line${klassen.includes('nc-code-snippet--line-highlight') && HERVORGEHOBEN.has(i) ? ' nc-code-snippet__line--highlighted' : ''}">${zeile(z) || ' '}</span>`).join('')
    : zeilen.map(zeile).join('\n')

  const offen = m.hat('expanded')
  const mehr = variant === 'multi'
    ? `<button class="nc-code-snippet__show-more" type="button" aria-expanded="${offen}"><span class="nc-code-snippet__show-more-label">${offen ? 'Weniger anzeigen' : 'Mehr anzeigen'}</span></button>`
    : ''
  return `<div class="ra-feld ra-feld--breit"><div class="${[...new Set(klassen)].join(' ')}"${attrs}>${kopf(m)}<pre class="nc-code-snippet__pre language-javascript" tabindex="0" aria-label="Beispielcode"><code class="nc-code-snippet__code language-javascript">${code}</code></pre>` +
    `<button class="nc-code-snippet__copy" type="button" aria-label="Code kopieren"><span class="nc-code-snippet__copy-icon nc-code-snippet__copy-icon--copy">${KOPIEREN}</span><span class="nc-code-snippet__copy-icon nc-code-snippet__copy-icon--check">${HAKEN}</span></button>${mehr}</div></div>`
}
