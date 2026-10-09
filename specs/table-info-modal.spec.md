# table-info-modal Component Spec
> Version 1.3.0 | Status: stable | Layer: organism

Tags: `aufgenommen`, `organisms`

## Anatomy
Root element: `.nc-table-info-modal`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| backdrop | `.nc-table-info-modal__backdrop` | Yes | Abdunklung (absolut, always-dark 40 %, cursor pointer) im Dialog vor dem Inhalt; Klick schliesst (reason overlay-click). Auf der Website mit data-modal-close. |
| content | `.nc-table-info-modal__content` | Yes | Karte (background-base, radius-lg, shadow-xl, Polster spacing-06), hoechstens 480 px breit und 80vh hoch, scrollt selbst. |
| close | `.nc-table-info-modal__close` | Yes | Schliessen-Knopf oben rechts mit aria-label (Symbol 20 px + spacing-01 Polster); erstes bedienbares Element — bekommt beim Oeffnen den Fokus. Auch [data-modal-close] schliesst (reason close-button). |
| body | `.nc-table-info-modal__body` | Yes | Infotext (body-m, text-primary); Absaetze mit spacing-03 Abstand. Traegt der Ausloeser data-info, ersetzt das Behavior den Inhalt beim Oeffnen. |

### DOM Notes
- Website (block--block-content--neo-table.html.twig, einer je Tabelle, nach der Tabelle in der Section): div.nc-table-info-modal#nc-table-info-<Block-ID>[role=dialog][aria-hidden=true] > __backdrop[data-modal-close] + __content > button.__close[data-modal-close][aria-label] + __body (leer). Ohne aria-modal und ohne Namen — aria-modal setzt das Behavior, den Namen nimmt es vom Ausloeser.
- Ausloeser: Info-Knopf der Tabellenzelle (.nc-tbl-cell__info-btn, Recipe tbl-cell), gebaut von neoTable (neo-theme.js) mit aria-controls="<id des Dialogs>", aria-expanded und dem Infotext in data-info. Auf der Website heisst jeder Info-Knopf „Mehr Informationen" (fest im Skript, nicht uebersetzt) — so heisst dann auch jeder Dialog; die Arena zeigt den empfohlenen Namen mit Zeilenbezug („Mehr Informationen zu …") und aria-haspopup="dialog".
- Inhalt: das Behavior setzt data-info als Text in __body, jede Zeile (\n) ein <p> — kein HTML (die Website nutzte bis 07.10.2026 innerHTML; Auszeichnung im Feld erscheint jetzt als Text). Ohne data-info bleibt der Inhalt, wie er ist (die Arena-Zellen zeigen einen Titel als <p><strong>).
- Zustand offen = .is-open: opacity --nc-table-info-modal-is-open-opacity (0,2 s) und pointer-events; geschlossen opacity 0, bleibt im Layout. Lage: position fixed, inset 0, z-index --fnd-z-toast, Inhalt mittig (flex).
- Modal (neo-behaviors table-info-modal): role=dialog (falls fehlend) und aria-modal, Fokus auf den Schliessen-Knopf, Fokus-Falle, Geschwister des Dialogs und seiner Vorfahren bis <body> inert (auch die Tabelle mit dem Ausloeser); geschlossen inert + aria-hidden="true". Escape, Schliessen-Knopf und Backdrop schliessen, danach Fokus zurueck zum Info-Knopf. Die Seite scrollt hinter dem Dialog weiter (keine Seitensperre).
- hover/focus nur am Schliessen-Knopf: Hover text-primary statt text-secondary, :focus-visible Ring interactive-focus (2 px).

## Variants
### Variant (`variant`)
Einzige Variante

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |

## States
Supported: `default`, `open`, `hover`, `focus`

## CSS Token API
Base classes: `nc-table-info-modal`

### Base
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-table-info-modal-is-open-opacity` | — | — |

## Keyboard Interactions
| Key | Action | Notes |
| --- | --- | --- |
| `Enter` | open | Auf dem Info-Knopf mit aria-controls (nativer Knopf): setzt den Text aus data-info, oeffnet den Dialog, Fokus auf den Schliessen-Knopf. |
| `Space` | open | Wie Enter auf dem Info-Knopf. |
| `Escape` | close | Offener Dialog (Fokus irgendwo im Dokument): schliesst, Fokus zurueck auf den Info-Knopf (reason escape). |
| `Tab` | trap-focus | Offener Dialog: Fokus bleibt im Dialog (vom letzten zum ersten Element). |
| `Shift+Tab` | trap-focus-reverse | Offener Dialog: rueckwaerts innerhalb der Fokus-Falle. |

## Events
| Event | Bubbles | Detail |
| --- | --- | --- |
| `table-info-modal-open` | Yes | — |
| `table-info-modal-close` | Yes | `{"reason":"string"}` |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- 2.1.2/2.4.3: modaler Dialog — Fokus beim Oeffnen auf den Schliessen-Knopf, Fokus-Falle, Rest der Seite inert, Escape schliesst, Fokus zurueck zum Info-Knopf.
- 2.4.3: geschlossen inert und aria-hidden — der per opacity ausgeblendete Schliessen-Knopf ist nicht per Tab erreichbar.
- 4.1.2: Name aus aria-labelledby/aria-label im Markup; fehlt er, uebernimmt das Behavior das aria-label des Ausloesers. Der Info-Knopf braucht deshalb einen Namen mit Zeilenbezug („Mehr Informationen zu <Zeile>") — auf der Website heisst jeder „Mehr Informationen" (Befund fuer neo_fe).
- 1.3.1: Inhalt als Absaetze (<p>) aus data-info, als Text gesetzt (kein HTML aus dem Feld).
- 2.5.8: Schliessen-Knopf 28 x 28 px (Symbol 20 px + Polster); der Backdrop schliesst zusaetzlich.
- 1.4.3/1.4.11: Kontrast AA hell und dunkel gemessen — Text text-primary 16,01:1, Schliessen-Symbol text-secondary ab 6,07:1.

## Web Components Mapping
Derived from anatomy for potential `<nc-table-info-modal>` custom element:

```js
class NcTableInfoModal extends HTMLElement {
  static observedAttributes = ['variant'];
  // Slots: <slot name="backdrop">, <slot name="content">, <slot name="close">, <slot name="body">
}
```

---

*Generated from `data/table-info-modal-recipe.json` by `scripts/generate-component-specs.js`*
