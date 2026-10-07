# settings-page Component Spec
> Version 1.0.0 | Status: draft | Layer: template

Tags: `templates`, `layout`, `app`, `einstellungen`

## Anatomy
Root element: `.t-settings`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| nav | `.t-settings__nav` | Yes | Seitliche Navigation (<nav>). |
| nav-list | `.t-settings__nav-list` | Yes | Liste. |
| nav-link | `.t-settings__nav-link` | Yes | Link; aria-current="page" fuer den aktiven Bereich. |
| content | `.t-settings__content` | Yes | Abschnitte. |
| section | `.t-settings__section` | Yes | <section> mit id. |
| section-header | `.t-settings__section-header` | Yes | Kopf des Abschnitts. |
| section-title | `.t-settings__section-title` | Yes | h2. |
| section-description | `.t-settings__section-description` | No | Beschreibung. |
| row | `.t-settings__row` | Yes | Zeile: Bezeichnung links, Aktion rechts. |
| row-label | `.t-settings__row-label` | Yes | Bezeichnung. |
| row-title | `.t-settings__row-title` | Yes | Titel der Zeile (<p>, keine Ueberschrift). |
| row-description | `.t-settings__row-description` | No | Erklaerung. |
| row-action | `.t-settings__row-action` | Yes | Aktion (Button, Schalter). |

### DOM Notes
- Im SCSS als DEPRECATED markiert: die Layout-Struktur uebernimmt das Shell-Preset <body data-layout="settings"> mit .nc-shell; die Bauteil-Stile bleiben. Kein Verwender auf der Website.
- Navigation links, Abschnitte rechts; unter md gestapelt.

## Variants
### Variante (`variant`)
Einzige Variante

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |

## States
Supported: `default`

## CSS Token API
Base classes: `t-settings`

### Layout
| Token | CSS Property | Override |
| --- | --- | --- |
| `--fnd-color-border-secondary` | — | — |
| `--fnd-color-interactive-default` | — | — |
| `--fnd-color-layer-01` | — | — |
| `--fnd-color-on-layer-01` | — | — |
| `--fnd-color-text-primary` | — | — |
| `--fnd-color-text-secondary` | — | — |
| `--fnd-content-max-width` | — | — |
| `--fnd-elevation-base` | — | — |
| `--fnd-font-weight-medium` | — | — |
| `--fnd-radius-sm` | — | — |
| `--fnd-spacing-01` | — | — |
| `--fnd-spacing-02` | — | — |
| `--fnd-spacing-03` | — | — |
| `--fnd-spacing-04` | — | — |
| `--fnd-spacing-06` | — | — |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

## Web Components Mapping
Derived from anatomy for potential `<nc-settings-page>` custom element:

```js
class NcSettingsPage extends HTMLElement {
  static observedAttributes = ['variant'];
  // Slots: <slot name="nav">, <slot name="nav-list">, <slot name="nav-link">, <slot name="content">, <slot name="section">, <slot name="section-header">, <slot name="section-title">, <slot name="row">, <slot name="row-label">, <slot name="row-title">, <slot name="row-action">
}
```

---

*Generated from `data/settings-page-recipe.json` by `scripts/generate-component-specs.js`*
