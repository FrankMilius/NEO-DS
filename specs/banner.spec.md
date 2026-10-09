# banner Component Spec
> Version 2.2.0 | Status: stable | Layer: organism

Tags: `feedback`, `notification`, `layout`

## Anatomy
Root element: `.nc-banner`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| icon | `.nc-banner__icon` | No | — |
| content | `.nc-banner__content` | Yes | — |
| title | `.nc-banner__title` | No | — |
| link | `.nc-banner__link` | No | — |
| close | `.nc-banner__close` | No | — |

### DOM Notes
- Seitenbreite Benachrichtigungsleiste — Unterschied zu Alert: Banner ist sticky/fixed, seitenbreit.
- Rolle: role='region' + aria-label (Standard 'Hinweis', im Markup ueberschreibbar, z. B. 'Wartungshinweis'); danger: role='alert' (ohne aria-label-Pflicht, der Text wird angesagt). Nie role='banner' — das ist der Landmark des Seitenkopfs (<header>).
- Root: flex-Layout, zentriert, volle Breite. Farbe via private Custom Props --_banner-bg/--_banner-color.
- Icon: Token-gesteuert (--nc-banner-icon-size), dekorativ (aria-hidden), optional links.
- Content: flex-wrap, zentriert. Text + optionaler CTA-Link.
- Title: Fettgedruckter Praefix (z.B. 'Wartung:') fuer bessere Scanbarkeit. Token: --nc-banner-title-weight.
- Link: erbt Farbe, bold + underline. Hover: opacity-prominent.
- Close-Button: 20px, opacity medium → 1 bei Hover. BG via color-mix(currentColor 15%).
- Varianten setzen --_banner-bg und --_banner-color auf die jeweiligen Feedback-Farben.
- Border-Accent (--accent): color-mix(bg 12%, transparent) + 4px border-left. Textfarbe wechselt zu text-primary.
- Position: --sticky (sticky top:0) oder --fixed (fixed top:0 left:0 right:0).
- z-index: notification-Ebene fuer Sichtbarkeit ueber anderem Content.
- Dismiss-Animation: .is-dismissing → @keyframes nc-banner-dismiss (max-height + padding + opacity → 0).
- Layout-Shift-Vermeidung: Bei --fixed sollte JS den body/shell padding-top um die Banner-Hoehe erhoehen. Beim Dismiss padding-top zuruecksetzen.
- Dismiss-Persist: JS sollte data-banner-id + localStorage nutzen, damit geschlossene Banner beim naechsten Seitenaufruf nicht erneut angezeigt werden.
- Reduced Motion: Dismiss ohne Animation (display:none).
- High Contrast Mode: 1px solid ButtonText, Focus-Ring 2px Highlight.
- Verhalten (neo-behaviors banner): .nc-banner__close setzt --_banner-height und .is-dismissing, danach aus dem DOM; Fokus geht zum naechsten Bedienelement. Mit data-banner-id merkt localStorage ('neo-banner:<id>') das Schliessen, beim naechsten Binden ist das Banner [hidden]. --fixed: das Elternelement bekommt oben die Banner-Hoehe als Innenabstand (bis zum Schliessen bzw. Abbinden).

## Variants
### Severity (`severity`)
Schweregrad — info (Standard, Hauptfarbe), warning (Warnung), danger (Kritisch), success (Erfolg)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| info | — |  |
| warning | `.nc-banner--warning` |  |
| danger | `.nc-banner--danger` |  |
| success | `.nc-banner--success` |  |

### Position (`position`)
Positionierung — static (im Flow), sticky (haftet oben), fixed (ueber allem fixiert)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| static | — |  |
| sticky | `.nc-banner--sticky` |  |
| fixed | `.nc-banner--fixed` |  |

### Style (`style`)
Visueller Stil — solid (volle Farbflaeche), accent (dezente BG + Akzent-Border)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| solid | — |  |
| accent | `.nc-banner--accent` |  |

### Content (`content`)
Inhaltsvariante — text-only, with-icon, with-title, with-link, with-close, full

| Value | CSS Modifier | Default |
| --- | --- | --- |
| text-only | — |  |
| with-icon | — |  |
| with-title | — |  |
| with-link | — |  |
| with-close | — |  |
| full | — |  |

## States
Supported: `default`, `dismissing`

- **dismissing**: 

## CSS Token API
Base classes: `nc-banner`

### Base
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-banner-padding` | — | `--mod-banner-padding` |
| `--nc-banner-gap` | — | `--mod-banner-gap` |
| `--nc-banner-z-index` | — | `--mod-banner-z-index` |
| `--nc-banner-font-size` | — | `--mod-banner-font-size` |
| `--nc-banner-font-weight` | — | `--mod-banner-font-weight` |
| `--nc-banner-icon-size` | — | `--mod-banner-icon-size` |

### Info
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-banner-info-bg` | — | `--mod-banner-info-bg` |
| `--nc-banner-info-color` | — | `--mod-banner-info-color` |

### Warning
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-banner-warning-bg` | — | `--mod-banner-warning-bg` |
| `--nc-banner-warning-color` | — | `--mod-banner-warning-color` |

### Danger
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-banner-danger-bg` | — | `--mod-banner-danger-bg` |
| `--nc-banner-danger-color` | — | `--mod-banner-danger-color` |

### Success
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-banner-success-bg` | — | `--mod-banner-success-bg` |
| `--nc-banner-success-color` | — | `--mod-banner-success-color` |

### Border-Accent
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-banner-accent-border-width` | — | `--mod-banner-accent-border-width` |
| `--nc-banner-accent-border-color` | — | — |

### Close Button
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-banner-close-size` | — | `--mod-banner-close-size` |
| `--nc-banner-close-radius` | — | `--mod-banner-close-radius` |
| `--nc-banner-close-opacity` | — | `--mod-banner-close-opacity` |
| `--nc-banner-close-opacity-hover` | — | `--mod-banner-close-opacity-hover` |

### Link
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-banner-link-weight` | — | `--mod-banner-link-weight` |
| `--nc-banner-link-underline` | — | `--mod-banner-link-underline` |

### Dismiss Animation
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-banner-dismiss-duration` | — | `--mod-banner-dismiss-duration` |
| `--nc-banner-title-weight` | — | `--mod-banner-title-weight` |

## Keyboard Interactions
| Key | Action | Notes |
| --- | --- | --- |
| `Enter` | dismiss | Auf dem Schliessen-Knopf (nativer Knopf): klappt das Banner ein und entfernt es (banner-dismiss). Auf dem CTA-Link: folgt dem Link. |
| `Space` | dismiss | Wie Enter auf dem Schliessen-Knopf. |

## Events
| Event | Bubbles | Detail |
| --- | --- | --- |
| `banner-dismiss` | Yes | `{"reason":"string","id":"string"}` |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- hasAccessibleName

## Web Components Mapping
Derived from anatomy for potential `<nc-banner>` custom element:

```js
class NcBanner extends HTMLElement {
  static observedAttributes = ['severity', 'position', 'style', 'content'];
  // Slots: <slot name="content">
}
```

---

*Generated from `data/banner-recipe.json` by `scripts/generate-component-specs.js`*
