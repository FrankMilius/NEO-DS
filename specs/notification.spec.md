# notification Component Spec
> Version 2.1.0 | Status: stable | Layer: organism

Tags: `feedback`, `news-alert`, `floating-card`, `in-app`

## Anatomy
Root element: `.nc-notification`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| media | `.nc-notification__media` | No | — |
| content | `.nc-notification__content` | Yes | — |
| header | `.nc-notification__header` | Yes | — |
| title | `.nc-notification__title` | Yes | — |
| meta | `.nc-notification__meta` | No | — |
| body | `.nc-notification__body` | No | — |
| footer | `.nc-notification__footer` | No | — |
| action | `.nc-notification__action` | No | — |
| close | `.nc-notification__close` | No | — |
| unread | `.nc-notification__unread` | No | — |

### DOM Notes
- Floating-Card Surface: surface-elevated BG + elevation-overlay Schatten (L2). Gleiche Ebene wie Popover.
- role='article' auf jedem Notification-Item. aria-label mit Titel + Zeitstempel.
- Media-Slot: 48×48 Thumbnail oder Avatar. Optional. Flexibles img/svg/div.
- Header: Titel (semibold) + Meta-Zeile (Zeitstempel, Kategorie). Auf gleicher Zeile mit space-between.
- Footer: Action-Links (CTA). Optional. Horizontale Anordnung mit gap.
- Unread-Dot: 8px Kreis in Akzentfarbe. aria-hidden='true' — Status per aria-label am Root.
- Unread-BG: Subtiler Akzent-Hintergrund (6% Mix der interaktiven Farbe) bei --unread Modifier.
- Priority High: 4px Akzent-Border links. Farbe per Type-Variante steuerbar.
- Type-Varianten setzen Akzentfarbe fuer Unread-Dot UND Priority-Border: feature (blau), system (gelb), promo (gruen).
- Interaction: 'dismissible' zeigt Close-Button, 'permanent' versteckt ihn.
- Close-Button: Absolut positioniert oben-rechts. aria-label='Benachrichtigung schliessen'.
- Dismiss-Animation: max-height + padding + opacity → 0. JS fuegt .is-dismissing hinzu.
- Shell-Integration: In Notification-Panel (Popover/Drawer) als Liste von .nc-notification Items.
- Read-Receipt JS: Unread-Status per localStorage oder API. JS entfernt --unread Modifier nach Klick/Lesen.
- Keyboard: Tab durchlaeuft Header → Actions → Close. Fokus-Ring auf interaktiven Elementen.
- Verhalten (neo-behaviors notification): .nc-notification__close (nicht bei --permanent) setzt --_notification-height und .is-dismissing, danach aus dem DOM; Fokus geht zum naechsten Bedienelement. Klick in eine ungelesene Notification (auch eine Aktion) entfernt --unread und __unread, streicht 'Ungelesen:' aus aria-label und meldet notification-read — speichern macht das Programm.

## Variants
### Priority (`priority`)
Prioritaet — low (Standard, kein Akzent) oder high (Akzent-Border links)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| low | — |  |
| high | `.nc-notification--priority-high` |  |

### Type (`type`)
Inhaltskategorie — feature (blau), system (gelb), promo (gruen)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| feature | `.nc-notification--feature` |  |
| system | `.nc-notification--system` |  |
| promo | `.nc-notification--promo` |  |

### Interaction (`interaction`)
Interaktionsmodell — dismissible (Close-Button) oder permanent (kein Close)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| dismissible | — |  |
| permanent | `.nc-notification--permanent` |  |

## States
Supported: `default`, `unread`, `dismissing`

- **unread**: 
- **dismissing**: 

## CSS Token API
Base classes: `nc-notification`

### Container
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-notification-padding` | — | `--mod-notification-padding` |
| `--nc-notification-radius` | — | `--mod-notification-radius` |
| `--nc-notification-shadow` | — | `--mod-notification-shadow` |
| `--nc-notification-bg` | — | `--mod-notification-bg` |
| `--nc-notification-border-width` | — | `--mod-notification-border-width` |
| `--nc-notification-border-color` | — | `--mod-notification-border-color` |
| `--nc-notification-max-width` | — | `--mod-notification-max-width` |
| `--nc-notification-gap` | — | `--mod-notification-gap` |

### Header
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-notification-header-gap` | — | `--mod-notification-header-gap` |
| `--nc-notification-title-size` | — | `--mod-notification-title-size` |
| `--nc-notification-title-weight` | — | `--mod-notification-title-weight` |
| `--nc-notification-title-color` | — | `--mod-notification-title-color` |
| `--nc-notification-meta-size` | — | `--mod-notification-meta-size` |
| `--nc-notification-meta-color` | — | `--mod-notification-meta-color` |

### Body
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-notification-body-size` | — | `--mod-notification-body-size` |
| `--nc-notification-body-color` | — | `--mod-notification-body-color` |
| `--nc-notification-body-line-height` | — | `--mod-notification-body-line-height` |

### Media Slot
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-notification-media-size` | — | `--mod-notification-media-size` |
| `--nc-notification-media-radius` | — | `--mod-notification-media-radius` |

### Unread Indicator
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-notification-unread-dot-size` | — | `--mod-notification-unread-dot-size` |
| `--nc-notification-unread-dot-color` | — | `--mod-notification-unread-dot-color` |
| `--nc-notification-unread-bg` | — | `--mod-notification-unread-bg` |

### Close Button
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-notification-close-size` | — | `--mod-notification-close-size` |
| `--nc-notification-close-radius` | — | `--mod-notification-close-radius` |
| `--nc-notification-close-opacity` | — | `--mod-notification-close-opacity` |
| `--nc-notification-close-opacity-hover` | — | `--mod-notification-close-opacity-hover` |

### Footer / Actions
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-notification-footer-gap` | — | `--mod-notification-footer-gap` |
| `--nc-notification-action-size` | — | `--mod-notification-action-size` |
| `--nc-notification-action-weight` | — | `--mod-notification-action-weight` |
| `--nc-notification-action-color` | — | `--mod-notification-action-color` |

### Priority (High)
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-notification-priority-border-width` | — | `--mod-notification-priority-border-width` |
| `--nc-notification-priority-border-color` | — | `--mod-notification-priority-border-color` |

### Type Colors
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-notification-feature-color` | — | `--mod-notification-feature-color` |
| `--nc-notification-system-color` | — | `--mod-notification-system-color` |
| `--nc-notification-promo-color` | — | `--mod-notification-promo-color` |

### Animation
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-notification-transition-duration` | — | `--mod-notification-transition-duration` |
| `--nc-notification-dismiss-duration` | — | `--mod-notification-dismiss-duration` |

## Keyboard Interactions
| Key | Action | Notes |
| --- | --- | --- |
| `Tab` | focus-order | Reihenfolge Aktionen (Footer) → Schliessen-Knopf, aus der DOM-Reihenfolge. |
| `Enter` | activate | Auf einer Aktion: loest sie aus und markiert die Notification als gelesen. Auf dem Schliessen-Knopf: klappt sie ein und entfernt sie. |
| `Space` | activate | Wie Enter auf Knoepfen (Schliessen, Aktion als <button>). |

## Events
| Event | Bubbles | Detail |
| --- | --- | --- |
| `notification-dismiss` | Yes | `{"reason":"string"}` |
| `notification-read` | Yes | — |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- hasAccessibleName
- supportsKeyboard

## Web Components Mapping
Derived from anatomy for potential `<nc-notification>` custom element:

```js
class NcNotification extends HTMLElement {
  static observedAttributes = ['priority', 'type', 'interaction'];
  // Slots: <slot name="content">, <slot name="header">, <slot name="title">
}
```

---

*Generated from `data/notification-recipe.json` by `scripts/generate-component-specs.js`*
