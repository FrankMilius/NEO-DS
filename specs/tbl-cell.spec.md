# tbl-cell Component Spec
> Version 1.5.0 | Status: stable | Layer: atom

Tags: `aufgenommen`, `atoms`

## Anatomy
Root element: `.nc-tbl-cell`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| text | `.nc-tbl-cell__text` | Yes | Text der Zelle (p, body-s, text-primary; im Zeilenkopf th[scope=row] semibold). Zeilenumbrueche aus dem Feld als <br>; Auszeichnung nur br, strong, em, b, i, a, sup, sub; mit bold im JSON steht der Text einer Wertzelle (td) in <strong>; traegt den Info-Knopf am Ende. |
| info-btn | `.nc-tbl-cell__info-btn` | No | Info-Knopf (button, Symbol 16 px + 2 px Polster, text-tertiary, Hover text-primary, :focus-visible Ring rund) mit aria-label (Zeile und Spalte), aria-controls auf den Info-Dialog (Recipe table-info-modal), aria-expanded, data-info und data-info-label (Name des Dialogs). Nur, wenn die Zelle einen Infotext hat. |
| sub | `.nc-tbl-cell__sub` | No | Untertitel unter dem Text (caption, text-tertiary, volle Breite, Zeilenhoehe --nc-tbl-cell-sub-line-height). |
| icon-block | `.nc-tbl-cell__icon-block` | No | Symbol ueber dem Text (flex, zentriert, Abstand spacing-01) — Zelle mit Symbol UND Text. |
| icon | `.nc-tbl-icon` | No | Wertsymbol der Zelle: --check (Kreis background-accent, Haken always-dark) oder --dash (text-tertiary); 05-atoms/_tbl-icon.scss. Braucht eine Textalternative (aria-label „enthalten"/„nicht enthalten"). |

### DOM Notes
- Zelle der Vergleichstabelle (Tabellen-Block, Recipe table-block): div.nc-tbl-cell (flex, gap spacing-02) in th oder td — der Ort gestaltet sie: th[scope=row] (erste Spalte) links, umbrechend, Text semibold; td mittig. Ohne Tabelle hat die Zelle keine Ausrichtung (die Arena stellt jede Zelle in eine Tabelle, Rahmen ra-tabelle).
- Aufbau (neo_fe Twig, seit 1.5.0; vorher neoTable renderCell — gleiche Regeln): nur Symbol -> .nc-tbl-cell--icon mit dem SVG direkt (ein info daran wird nicht gezeigt); Symbol und Text -> .nc-tbl-cell__icon-block + Text; Text -> p.nc-tbl-cell__text (\n -> <br>, Positivliste br, strong, em, b, i, a, sup, sub; in Wertzellen mit bold in <strong>); Untertitel -> p.nc-tbl-cell__sub (gleiche Positivliste); Info -> button.nc-tbl-cell__info-btn am Ende des Text-Absatzes (mit fuehrendem Leerzeichen), ohne Text direkt in der Zelle. Kurzformen im JSON: „✔“ = check, „–“ = dash, andere Texte = text. Wahrheitswerte wie bisher in JavaScript („0“ ist ein Text, bold „false“ wirkt nicht). Zwischen den Elementen kein Leerraum.
- Feld bold (JSON, an der Zelle: { "text": "…", "bold": true }): in Wertzellen (td, ab der zweiten Spalte) steht der Text in <strong> (p.nc-tbl-cell__text > strong, Info-Knopf danach im selben Absatz); im Zeilenkopf (th[scope=row]) ohne Wirkung — der ist ohnehin fett. Untertitel bleibt normal. Seit 1.4.0 (Entscheidung Abschluss 3, 08.10.2026); bis dahin wertete neoTable bold nicht aus. Ein bold an der Zeile ({ "cells": […], "bold": true }) wirkt nicht.
- Info-Knopf der Website (seit 1.5.0 aus dem Twig): aria-label „Mehr Informationen zu <Zeile>[, <Spalte>]“ (Bezug: Text, sonst Untertitel der ersten Zelle, als reiner Text; ohne Bezug „Mehr Informationen“), aria-controls auf den Info-Dialog des Blocks, aria-expanded=false, data-info mit dem Text (als Text, Twig maskiert), data-info-label „Informationen zu …“ (Name des Dialogs); Symbol svg.nc-tbl-info-icon mit aria-hidden und focusable=false. Den Dialog oeffnet neo-behaviors table-info-modal.
- Wertsymbole der Website: ohne Farbwerte (seit 25.08.2026 aus _tbl-icon.scss), mit role=img und aria-label „enthalten“/„nicht enthalten“ (uebersetzbar per t).

## Variants
### Variante (`variante`)
default (Text, Zeilenkopf oder Textzelle) oder icon (nur ein Wertsymbol, zentriert)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |
| icon | `.nc-tbl-cell--icon` |  |

## States
Supported: `default`, `hover`, `focus`

## CSS Token API
Base classes: `nc-tbl-cell`

### Base
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-tbl-cell-info-btn-hover-opacity` | — | — |
| `--nc-tbl-cell-info-btn-padding` | — | — |
| `--nc-tbl-cell-sub-line-height` | — | — |

## Keyboard Interactions
| Key | Action | Notes |
| --- | --- | --- |
| `Tab` | focus-next | Der Info-Knopf ist ein Tab-Halt (nativer button); Wertsymbole und Text nicht. |
| `Enter` | activate | Auf dem Info-Knopf: oeffnet den Info-Dialog (Behavior table-info-modal, aria-controls). |
| `Space` | activate | Wie Enter. |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- 1.3.1: Zeilenkopf als th[scope=row], Wertzellen als td; die Zelle gestaltet sich nach diesem Ort.
- 1.1.1: Wertsymbole mit Textalternative (role=img, aria-label „enthalten“/„nicht enthalten“) — auf der Website seit 08.10.2026, seit 1.5.0 aus dem Twig.
- 4.1.2/2.4.6: Info-Knopf mit Namen, der Zeile und Spalte nennt („Mehr Informationen zu <Zeile>, <Spalte>“); der Dialog heisst „Informationen zu …“ (data-info-label, table-info-modal).
- 1.4.11: Info-Symbol text-tertiary deckend ab 4,59:1 (Streifenzeile dunkel); bis 1.3.0 mit opacity-muted nur 2,6:1 hell / 2,89:1 dunkel (Korrektur 1.3.1, Freigabe ausstehend).
- 2.5.8: Info-Knopf 20 x 20 px — zulaessig ueber die Abstandsausnahme (einzeln am Ende des Zeilenkopfs).
- 1.4.3: Kontrast AA hell und dunkel gemessen — Text text-primary 16,01:1, Untertitel text-tertiary ab 5,75:1; Haken always-dark auf Akzent 12,89:1, Strich text-tertiary ab 4,59:1 (1.4.11).
- 1.3.1: Hervorhebung per bold ist in Wertzellen als <strong> ausgezeichnet (nicht nur als Schriftschnitt) — Screenreader koennen sie melden.
- 4.1.1/Sicherheit: Text und Untertitel nach Positivliste gefiltert (Xss::filter) — kein Skript, keine Ereignis-Attribute, keine javascript:-Links aus dem Feld (seit 1.5.0; vorher innerHTML).

## Web Components Mapping
Derived from anatomy for potential `<nc-tbl-cell>` custom element:

```js
class NcTblCell extends HTMLElement {
  static observedAttributes = ['variante'];
  // Slots: <slot name="text">
}
```

---

*Generated from `data/tbl-cell-recipe.json` by `scripts/generate-component-specs.js`*
