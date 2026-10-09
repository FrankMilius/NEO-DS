# media-frame Component Spec
> Version 1.1.0 | Status: stable | Layer: object

Tags: `layout`, `objects`, `media`

## Anatomy
Root element: `.nc-media-frame`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| surface | `.nc-surface-muted` | No | Abgesetzte Flaeche (Layer 2) um den ganzen Block — kombinierbar, steht AUSSEN. Auf der Website derzeit ohne Verwender. |

### DOM Notes
- Bildrahmen fuer Produkt-Screenshots mit hohem Weissanteil: Hairline (--nc-media-frame-border-width/-color) plus gestufte Elevation (--nc-media-frame-shadow, im Dunkeln staerker). Die Hairline traegt die Kante, wenn der Schatten wegfaellt; overflow hidden klippt das Medium auf den Radius.
- Als Rahmen um ein Medium: die direkten Kinder <img>, <picture> > <img> und <video> fuellen ihn ohne Luecke (display block, inline-size 100 %). Andere Kinder (z. B. <iframe>) bringen ihre Geometrie selbst mit.
- Website (Feld field_media_frame: frame = Vorgabe, none = ohne Rahmen, device = .nc-device statt Rahmen): text-media setzt die Klasse am Bild (img.nc-text-media__image.nc-media-frame) und am Video-Rahmen (div.nc-video.nc-media-frame > iframe); feature-list am Medien-Container (div.nc-feature-list__media.nc-media-frame, Radius per eigener Regel in _feature-list.scss).
- Am Video in text-media gewinnt .nc-text-media .nc-video (Spezifitaet 0,2,0) den Schatten: dort steht --fnd-shadow-md statt --nc-media-frame-shadow, auch bei prefers-contrast: more. Hairline und Radius greifen.
- Kontrast der Hairline: --fnd-color-border-hairline ist mit der Mono-Bruecke neutral-200 (hell) bzw. neutral-800 (dunkel) — gemessen 1,13:1 gegen das helle Seitenpapier, 1,25:1 gegen Weiss, 1,79:1 gegen die dunkle Seite. Auf .nc-surface-muted hell 1,00:1 (Flaeche und Kante gleich). Eine leise Kante, keine 3:1-Abgrenzung.
- forced-colors: Kante CanvasText, kein Schatten; prefers-contrast: more: Kante --fnd-color-border-strong, kein Schatten; Druck: kein Schatten, .nc-surface-muted ohne Flaeche und Innenabstand (in der Arena nicht darstellbar).
- Keine --mod-*-Hooks: angepasst wird ueber die --nc-media-frame-*- und --nc-surface-muted-*-Tokens selbst.
- .nc-surface-muted ist die zweite Ebene derselben Datei; derzeit ohne Verwender auf der Website.

## Variants
### Kante (`edge`)
Radius des Rahmens

| Value | CSS Modifier | Default |
| --- | --- | --- |
| rund | — |  |
| flush | `.nc-media-frame--flush` |  |

## States
Supported: `default`

## CSS Token API
Base classes: `nc-media-frame`

### Rahmen
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-media-frame-border-width` | — | — |
| `--nc-media-frame-border-color` | — | — |
| `--nc-media-frame-radius` | — | — |
| `--nc-media-frame-shadow` | — | — |

### Abgesetzte Flaeche
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-surface-muted-bg` | — | — |
| `--nc-surface-muted-radius` | — | — |
| `--nc-surface-muted-padding` | — | — |

### Kontrastmodus
| Token | CSS Property | Override |
| --- | --- | --- |
| `--fnd-color-border-strong` | — | — |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- Der Rahmen ist Dekoration ohne Rolle; das Medium braucht seinen Alternativtext (img alt, iframe title) — auf der Website die Ueberschrift des Blocks.
- Die Hairline ist eine leise Kante (gemessen 1,13 bis 1,79:1), keine Abgrenzung nach WCAG 1.4.11 — der Screenshot ist kein Bedienelement. Traegt die Kante Information, braucht es einen staerkeren Rahmen.
- forced-colors und prefers-contrast: more: Kante bleibt (CanvasText bzw. border-strong), Schatten entfaellt.

## Web Components Mapping
Derived from anatomy for potential `<nc-media-frame>` custom element:

```js
class NcMediaFrame extends HTMLElement {
  static observedAttributes = ['edge'];
  // Slots: default
}
```

---

*Generated from `data/media-frame-recipe.json` by `scripts/generate-component-specs.js`*
