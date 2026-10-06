// Vorlage: accordion — Markup aus data/markup/accordion.html (geerntet von der
// Website): <div class="nc-accordion"> mit <details class="nc-accordion__item">,
// <summary class="nc-accordion__trigger"> (Text in __trigger-body/
// __trigger-text, Chevron in __icon) und dem Inhalt in __content >
// __content-inner > __text (bzw. __list, __actions).
//
// Achsen: variant/density/media-layout/sticky per Modifier aus dem Recipe
// (m.basisKlasse — der Zustand gehoert an den Eintrag, nicht an die Liste);
// behavior single/single-scroll = data-neo-accordion="einzeln" plus
// gemeinsames name-Attribut der Eintraege (natives „nur eines offen").
// Zustaende am ersten Eintrag: open = [open]; disabled = aria-disabled am
// Ausloeser (das DS sperrt ihn per pointer-events, neo-behaviors die Tastatur);
// selected = angehakte Checkbox im Praefix; hover/focus nur echt
// (data-zustand). In „Ausprobieren" startet alles zu — das Verhalten kommt
// aus neo-behaviors (accordion).
//
// Kompositionen (render.compositionType): nested (zweite Ebene im Inhalt),
// selection (Checkbox im Praefix), actions (Badge + Symbolknopf im Suffix),
// sticky (langer Inhalt), footer (Handlungsleiste im Fuss), stacked (FAQ wie
// auf der Website, mit Liste und Handlung), media (Bild ueber/neben dem Text).
import { BILD_SRC, esc } from './_helfer.js'

const CHEVRON = '<span class="nc-accordion__icon" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 7.5L10 12.5L15 7.5"></path></svg></span>'
const STIFT = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"></path><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg>'

// Fragen und Antworten von der Website (data/markup/accordion.html)
const FAQ = [
  ['Brauchen Mitarbeitende eine Firmen-E-Mail?', 'Nein. Der Zugang läuft wahlweise über Personalnummer oder Einladungscode.'],
  ['Läuft die App auch ohne Internet?', 'Gelesene Inhalte bleiben verfügbar. Neue Beiträge und Kommentare werden übertragen, sobald wieder Verbindung besteht.'],
  ['Wo werden die Daten verarbeitet?', 'In Deutschland, dokumentiert und prüfbar.'],
  ['Ist die App barrierefrei?', 'Sie folgt WCAG 2.1 AA. Geprüft, nicht nur behauptet.'],
  ['Was kostet die Einführung?', 'Das hängt von Umfang und Betriebsart ab. Die Editionen decken die üblichen Fälle ab.'],
  ['Wie lange dauert es bis zum Start?', 'Von der Entscheidung bis zur ersten Schicht typischerweise sechs bis zehn Wochen.']
]

const LANG = 'Der Auslöser bleibt beim Scrollen am oberen Rand stehen, solange der Eintrag offen ist. '

/**
 * Ein Eintrag. `kopf` ist Text oder fertiges Markup fuer den Ausloeser-Text,
 * `inhalt` fertiges Markup fuer __content-inner.
 */
function eintrag (m, nr, { titel, inhalt, offen = false, kopfAttrs = '', praefix = '', suffix = '', fuss = '', gruppe = '' }) {
  return `<details class="nc-accordion__item" id="${m.uid}-${nr}"${gruppe ? ` name="${gruppe}"` : ''}${offen ? ' open' : ''}>
<summary class="nc-accordion__trigger"${kopfAttrs}>
${praefix ? `<span class="nc-accordion__trigger-prefix">${praefix}</span>` : ''}<span class="nc-accordion__trigger-body">
<span class="nc-accordion__trigger-text">${titel}</span>
</span>
${suffix ? `<span class="nc-accordion__trigger-suffix">${suffix}</span>` : ''}${CHEVRON}
</summary>
<div class="nc-accordion__content">
<div class="nc-accordion__content-inner">
${inhalt}${fuss ? `\n<div class="nc-accordion__footer">${fuss}</div>` : ''}
</div>
</div>
</details>`
}

const text = (t) => `<div class="nc-accordion__text">${esc(t)}</div>`

/** Zustand der Zelle am ersten Eintrag (Ausloeser bzw. Checkbox). */
function ersterKopf (m) {
  if (m.ausprobieren) return ''
  let a = ''
  if (m.deaktiviert) a += ' aria-disabled="true"'
  if (m.attribute['data-zustand']) a += ` data-zustand="${m.attribute['data-zustand']}"`
  return a
}

function liste (m, eintraege, extra = '') {
  const einzeln = m.wert('behavior') === 'single' || m.wert('behavior') === 'single-scroll'
  const gruppe = einzeln ? `${m.uid}-gruppe` : ''
  return `<div class="${m.basisKlasse}"${einzeln ? ' data-neo-accordion="einzeln"' : ''}${extra}>
${eintraege.map((e, i) => eintrag(m, i + 1, { gruppe, ...e })).join('\n')}
</div>`
}

function checkbox (m, nr, an) {
  return `<label class="nc-checkbox nc-checkbox--sm"><input class="nc-checkbox__input" type="checkbox" id="${m.uid}-wahl-${nr}" aria-label="Auswählen"${an ? ' checked' : ''}><span class="nc-checkbox__control"></span></label>`
}

export default (zelle, m) => {
  const offen = m.hat('open') && !m.ausprobieren
  const kopf = ersterKopf(m)
  const typ = m.specimen.render?.compositionType
  const medium = m.slot('media')
    ? `<div class="nc-accordion__media"><img src="${BILD_SRC}" alt="Bildschirmansicht der App"></div>\n`
    : ''

  let html
  switch (typ) {
    case 'accordion-nested': {
      const innen = `<div class="nc-accordion">
${eintrag({ uid: `${m.uid}-u` }, 1, { titel: 'Unterkategorie A', inhalt: text('Details zu A.'), offen })}
${eintrag({ uid: `${m.uid}-u` }, 2, { titel: 'Unterkategorie B', inhalt: text('Details zu B.') })}
</div>`
      html = liste(m, [
        { titel: 'Kategorie 1 (mit Unterkategorien)', inhalt: innen, offen, kopfAttrs: kopf },
        { titel: 'Kategorie 2 (einfach)', inhalt: text('Einfacher Inhalt ohne Unterkategorien.') }
      ])
      break
    }
    case 'accordion-selection': {
      const gewaehlt = m.hat('selected') && !m.ausprobieren
      html = liste(m, [
        { titel: 'Option A — Performance', inhalt: text('Konfigurationsdetails für diese Option.'), offen, kopfAttrs: kopf, praefix: checkbox(m, 1, gewaehlt) },
        { titel: 'Option B — Comfort', inhalt: text('Konfigurationsdetails für diese Option.'), praefix: checkbox(m, 2, false) },
        { titel: 'Option C — Eco', inhalt: text('Konfigurationsdetails für diese Option.'), praefix: checkbox(m, 3, false) }
      ])
      break
    }
    case 'accordion-actions': {
      const suffix = `<span class="nc-badge nc-badge--info nc-badge--sm"><span class="nc-badge__label">Neu</span></span><button type="button" class="nc-button nc-button--ghost nc-button--sm nc-button--icon-only" aria-label="Bearbeiten">${STIFT}</button>`
      html = liste(m, [
        { titel: 'Eintrag mit Badge und Aktion', inhalt: text('Badge und Bearbeiten-Knopf stehen im Suffix vor dem Zeichen.'), offen, kopfAttrs: kopf, suffix },
        { titel: 'Eintrag ohne Suffix', inhalt: text('Ohne Badge und Aktion.') }
      ])
      break
    }
    case 'accordion-sticky':
      html = liste(m, [
        { titel: 'Langer Eintrag', inhalt: `<div class="nc-accordion__text"><p>${LANG.repeat(4)}</p><p>${LANG.repeat(4)}</p></div>`, offen, kopfAttrs: kopf },
        { titel: 'Nächster Eintrag', inhalt: text('Kurzer Inhalt.') }
      ])
      break
    case 'accordion-footer': {
      const fuss = '<button type="button" class="nc-button nc-button--outline nc-button--sm">Abbrechen</button><button type="button" class="nc-button nc-button--sm">Weiter</button>'
      html = liste(m, [
        { titel: 'Schritt 1: Grunddaten', inhalt: text('Formularinhalte für Schritt 1.'), offen, kopfAttrs: kopf, fuss },
        { titel: 'Schritt 2: Konfiguration', inhalt: text('Formularinhalte für Schritt 2.'), fuss },
        { titel: 'Schritt 3: Zusammenfassung', inhalt: text('Übersicht und Bestätigung.'), fuss }
      ])
      break
    }
    case 'accordion-stacked':
      html = liste(m, FAQ.map(([titel, antwort], i) => ({
        titel: esc(titel),
        inhalt: text(antwort) +
          (i === 2 ? '\n<ul class="nc-accordion__list"><li><a href="#" onclick="return false">Datenschutz im Detail</a></li></ul>' : '') +
          (i === 4 ? '\n<div class="nc-accordion__actions"><a class="nc-button nc-button--sm" href="#" onclick="return false">Editionen ansehen</a></div>' : ''),
        offen: i === 0 && offen,
        kopfAttrs: i === 0 ? kopf : ''
      })))
      break
    default:
      html = liste(m, FAQ.slice(0, 2).map(([titel, antwort], i) => ({
        titel: esc(titel),
        inhalt: (i === 0 ? medium : '') + text(antwort),
        offen: i === 0 && offen,
        kopfAttrs: i === 0 ? kopf : ''
      })))
  }
  return `<div class="ra-feld ra-feld--breit">${html}</div>`
}
