# dashboard Component Spec
> Version 1.0.0 | Status: draft | Layer: template

Tags: `templates`, `layout`, `app`

## Anatomy
Root element: `.t-dashboard`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| sidebar | `.t-dashboard__sidebar` | Yes | Linke Spalte (<nav>), sticky; unter md ausgeblendet. |
| sidebar-nav | `.t-dashboard__sidebar-nav` | Yes | Liste der Links. |
| sidebar-link | `.t-dashboard__sidebar-link` | Yes | Link; aria-current="page" fuer die aktuelle Seite. |
| header | `.t-dashboard__header` | Yes | Sticky-Kopf mit Seitentitel. |
| title | `.t-dashboard__title` | Yes | h1. |
| main | `.t-dashboard__main` | Yes | <main>, Spalte mit gap. |
| metrics | `.t-dashboard__metrics` | No | Raster der Kennzahlen (auto-fit, min 220 px). |
| metric-card | `.t-dashboard__metric-card` | No | Kennzahl-Karte (layer-01). |
| metric-label | `.t-dashboard__metric-label` | No | Bezeichnung. |
| metric-value | `.t-dashboard__metric-value` | No | Wert. |
| card | `.t-dashboard__card` | Yes | Inhalts-Karte (<section>). |
| card-header | `.t-dashboard__card-header` | Yes | Kopfzeile der Karte. |
| card-title | `.t-dashboard__card-title` | Yes | h2. |

### DOM Notes
- Im SCSS als DEPRECATED markiert: die Layout-Struktur uebernimmt das Shell-Preset <body data-layout="dashboard"> mit .nc-shell; die Bauteil-Stile bleiben. Kein Verwender auf der Website.
- Grid 260px 1fr / auto 1fr, min-height 100vh; geschachtelte Flaechen ueber die Layer-Tokens.

## Variants
### Variante (`variant`)
Einzige Variante

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |

## States
Supported: `default`

## CSS Token API
Base classes: `t-dashboard`

### Layout
| Token | CSS Property | Override |
| --- | --- | --- |
| `--fnd-color-background-base` | — | — |
| `--fnd-color-border-secondary` | — | — |
| `--fnd-color-interactive-default` | — | — |
| `--fnd-color-layer-01` | — | — |
| `--fnd-color-layer-02` | — | — |
| `--fnd-color-on-layer-01` | — | — |
| `--fnd-color-text-on-interactive` | — | — |
| `--fnd-color-text-primary` | — | — |
| `--fnd-color-text-secondary` | — | — |
| `--fnd-content-max-width` | — | — |
| `--fnd-elevation-base` | — | — |
| `--fnd-font-weight-medium` | — | — |
| `--fnd-font-weight-regular` | — | — |
| `--fnd-radius-sm` | — | — |
| `--fnd-spacing-01` | — | — |
| `--fnd-spacing-02` | — | — |
| `--fnd-spacing-03` | — | — |
| `--fnd-spacing-04` | — | — |
| `--fnd-spacing-05` | — | — |
| `--fnd-spacing-06` | — | — |
| `--fnd-z-sticky` | — | — |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

## Web Components Mapping
Derived from anatomy for potential `<nc-dashboard>` custom element:

```js
class NcDashboard extends HTMLElement {
  static observedAttributes = ['variant'];
  // Slots: <slot name="sidebar">, <slot name="sidebar-nav">, <slot name="sidebar-link">, <slot name="header">, <slot name="title">, <slot name="main">, <slot name="card">, <slot name="card-header">, <slot name="card-title">
}
```

---

*Generated from `data/dashboard-recipe.json` by `scripts/generate-component-specs.js`*
