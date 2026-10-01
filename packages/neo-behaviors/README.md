# neo-behaviors

Verhalten der NEO-Bauteile — eine Quelle für Drupal, Doku und Theme-Konfigurator
(ADR-005, Entscheidung 01.10.2026).

| Recipe | Verhalten | Ereignisse |
| --- | --- | --- |
| `tabs` | Klick, Pfeiltasten (vertikal: hoch/runter), Pos1, Ende, Enter/Leertaste; gesperrte Tabs übersprungen; `data-neo-tabs="manuell"` = nur Enter aktiviert | `tab-change` { value, previousValue } |
| `accordion` | `<details>` klappt nativ; Pfeiltasten, Pos1, Ende zwischen den Kopfzeilen; `data-neo-accordion="einzeln"` = nur eines offen | `accordion-toggle` { itemId, open } |
| `select` | natives Feld; `.is-open` am `.nc-select-wrapper` solange die Liste offen ist (Chevron dreht) | — |
| `search` | Fokus/Tippen öffnet, Tippen filtert und markiert, Leerhinweis, Pfeiltasten + Enter wählen, Escape/Verlassen schließt, Bereichs-Menü | `search-open` { open }, `search-select` { value } |

```js
import { anbinden, abbinden } from 'neo-behaviors'

const aufraeumen = anbinden(document)       // oder ein Teilbereich, mehrfach harmlos
aufraeumen()                                // bzw. abbinden(bereich)
anbinden(bereich, ['tabs'])                 // nur bestimmte Bauteile
```

Drupal (sobald die Library-Datei gebaut wird):

```js
Drupal.behaviors.neoBehaviors = {
  attach: (context) => NeoBehaviors.anbinden(context),
  detach: (context, settings, trigger) => { if (trigger === 'unload') NeoBehaviors.abbinden(context) }
}
```

Das Soll steht im Recipe (`keyboard`, `events`, State-Regeln). Die Tests in
`apps/theme-configurator/tests/behaviors/` binden an genau das Markup, das die
Arena aus dem Recipe baut.
