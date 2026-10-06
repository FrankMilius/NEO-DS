# shell Component Spec
> Version 2.1.2 | Status: stable | Layer: organism

Tags: `layout`, `scaffold`, `template`

## Anatomy
Root element: `.nc-shell`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| skip-link | `.nc-shell__skip-link` | Yes | — |
| banner | `.nc-shell__banner` | No | — |
| banner-item | `.nc-shell__banner-item` | No | — |
| banner-close | `.nc-shell__banner-close` | No | — |
| linkbar | `.nc-shell__linkbar` | No | — |
| linkbar-left | `.nc-shell__linkbar-left` | No | — |
| linkbar-right | `.nc-shell__linkbar-right` | No | — |
| navbar | `.nc-shell__navbar` | Yes | — |
| stage | `.nc-shell__stage` | Yes | — |
| sidebar-left | `.nc-shell__sidebar-left` | No | — |
| sidebar-right | `.nc-shell__sidebar-right` | No | — |
| main | `.nc-shell__main` | Yes | — |
| content-header | `.nc-shell__content-header` | No | — |
| content-body | `.nc-shell__content-body` | Yes | — |
| content-footer | `.nc-shell__content-footer` | No | — |
| footerbar | `.nc-shell__footerbar` | No | — |
| sidebar-overlay | `.nc-shell__sidebar-overlay` | No | — |

### DOM Notes
- Aeusseres Grid (.nc-shell): 5 Rows — banner, linkbar, navbar, stage, footerbar. min-height: 100dvh.
- Banner: .nc-shell__banner als erste Grid-Row ueber allem. display:none per Default, sichtbar via :not(:empty). Enthaelt .nc-shell__banner-item mit Severity-Modifiern (--info, --success, --warning, --danger). Dismissable via .nc-shell__banner-close Button.
- Inneres Grid (.nc-shell__stage): Sidebars + Main-Content. Spalten-Definition per Preset.
- Presets via data-layout='...' auf <body>: dashboard, content-page, docs, landing, focused, settings.
- Skip-Link: Erstes Element in .nc-shell. <a href='#main-content' class='nc-shell__skip-link'>Zum Inhalt springen</a>. Unsichtbar bis :focus, dann fixed ueber allen Zonen (z-index: skip-link).
- Linkbar: 32px Leiste ueber der Navigation. Default: display:none, Preset schaltet ein.
- Navbar: sticky, z-index: nc-shell-z-navbar. Bei Landing-Preset: Linkbar darueber (z-index + 1).
- Sidebars: Default versteckt. Desktop (ab lg): sticky, unabhaengiges Scrollen (height: calc(100dvh - nav-height)). Mobile (<lg): Fixed Off-Canvas-Drawer mit translateX-Animation.
- Sidebar-Density: data-sidebar-density='narrow|wide' auf .nc-shell oder <body>. Standard: kein Attribut noetig (260px; Docs 240/200px, Settings 220px). Narrow: 200px links / 160px rechts. Wide: 320px links / 300px rechts. Die Dichte setzt die Spaltenvariable --nc-shell-sidebar-*-width; in Docs und Settings ersetzt narrow/wide die Preset-Breite.
- Sidebar-Toggle: [data-shell-toggle] Buttons in der Navbar mit aria-controls="<id der Sidebar>" und aria-expanded. Unter lg oeffnet das Behavior shell (neo-behaviors) damit den Drawer; ab lg ist der Knopf ohne Verhalten (Collapse setzt die Seite selbst).
- Sidebar-Collapsed: .nc-shell--sidebar-left-collapsed / --sidebar-right-collapsed — Width 0, visibility hidden, sanfte Transition.
- Sidebar-Drawer (Mobile): .nc-shell--sidebar-left-drawer-open / --sidebar-right-drawer-open — translateX(0) + Overlay-Backdrop.
- Content-Body Alignment: --left (max-width links, margin-inline: 0 — auch in content-page und focused), --center (max-width zentriert), Default: volle Breite (Presets content-page/focused zentrieren).
- Footerbar: sticky-bottom, 3-Zonen-Grid (left/center/right). Default: display:none. Mobile-Verhalten per data-footerbar-mobile='hide|static' steuerbar (Default: sticky).
- Z-Index Governance: Feste Rangfolge ueber --nc-shell-z-* Tokens. linkbar (base) < footerbar (sticky) < navbar (header) < sidebar (sidebar) < overlay (drawer-1) < drawer (drawer). Verhindert Z-Index-Kriege.
- RTL: Durchgaengig CSS Logical Properties — kein separater RTL-Code noetig.
- Off-Canvas Overlay: .nc-shell__sidebar-overlay--visible — halbtransparenter Backdrop, pointer-events auto.
- Drawer-Verhalten (neo-behaviors shell, Mobil-Lage = Sidebar position: fixed): hoechstens ein Drawer offen, Fokus auf das erste bedienbare Element der Sidebar (sonst die Sidebar mit tabindex=-1), Fokus-Falle, Geschwister bis <body> ausser dem Overlay inert, Schliessen per Escape, Overlay-Klick, Knopf oder Wechsel ueber lg; Fokus zurueck zum Ausloeser. Fehlt .nc-shell__sidebar-overlay, legt das Behavior es an.

## Variants
### Preset (`preset`)
Layout-Preset via data-layout Attribut — bestimmt welche Zonen sichtbar sind und wie das Grid konfiguriert wird.

| Value | CSS Modifier | Default |
| --- | --- | --- |
| dashboard | — |  |
| content-page | — |  |
| docs | — |  |
| landing | — |  |
| focused | — |  |
| settings | — |  |

### Sidebar State (`sidebar`)
Sichtbarkeit und Zustand der Sidebars — expanded (Standard), collapsed (eingeklappt, Desktop), drawer-open (ausgeklappt, Mobile).

| Value | CSS Modifier | Default |
| --- | --- | --- |
| expanded | — |  |
| collapsed | `.nc-shell--sidebar-left-collapsed` |  |
| drawer | `.nc-shell--sidebar-left-drawer-open` |  |

### Sidebar Density (`sidebarDensity`)
Sidebar-Breitenstufe — narrow (kompakt, Icon-Leiste), standard (default), wide (breiter Dateibaum, erweiterte Navigation).

| Value | CSS Modifier | Default |
| --- | --- | --- |
| narrow | — |  |
| standard | — |  |
| wide | — |  |

### Content Alignment (`contentAlign`)
Horizontale Ausrichtung des Hauptinhalts — full (volle Breite, Standard), center (zentriert, max-width), left (linksbuendig, max-width).

| Value | CSS Modifier | Default |
| --- | --- | --- |
| full | — |  |
| center | `.nc-shell__content-body--center` |  |
| left | `.nc-shell__content-body--left` |  |

### Footerbar Mobile (`footerbarMobile`)
Verhalten der Footerbar auf Mobile-Viewports (<lg) — sticky (klebrig, Standard), static (am Ende), hide (versteckt).

| Value | CSS Modifier | Default |
| --- | --- | --- |
| sticky | — |  |
| static | — |  |
| hide | — |  |

## States
Supported: `default`

## CSS Token API
Base classes: `nc-shell`

### Linkbar
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-shell-linkbar-height` | — | `--mod-shell-linkbar-height` |
| `--nc-shell-linkbar-bg` | — | `--mod-shell-linkbar-bg` |
| `--nc-shell-linkbar-color` | — | `--mod-shell-linkbar-color` |
| `--nc-shell-linkbar-border` | — | `--mod-shell-linkbar-border` |

### Sidebars
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-shell-sidebar-left-width` | — | `--mod-shell-sidebar-left-width` |
| `--nc-shell-sidebar-right-width` | — | `--mod-shell-sidebar-right-width` |
| `--nc-shell-sidebar-bg` | — | `--mod-shell-sidebar-bg` |
| `--nc-shell-sidebar-border` | — | `--mod-shell-sidebar-border` |

### Sidebar Density
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-shell-sidebar-left-width-narrow` | — | `--mod-shell-sidebar-left-width-narrow` |
| `--nc-shell-sidebar-left-width-standard` | — | `--mod-shell-sidebar-left-width-standard` |
| `--nc-shell-sidebar-left-width-wide` | — | `--mod-shell-sidebar-left-width-wide` |
| `--nc-shell-sidebar-right-width-narrow` | — | `--mod-shell-sidebar-right-width-narrow` |
| `--nc-shell-sidebar-right-width-standard` | — | `--mod-shell-sidebar-right-width-standard` |
| `--nc-shell-sidebar-right-width-wide` | — | `--mod-shell-sidebar-right-width-wide` |

### Footerbar
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-shell-footerbar-height` | — | `--mod-shell-footerbar-height` |
| `--nc-shell-footerbar-bg` | — | `--mod-shell-footerbar-bg` |
| `--nc-shell-footerbar-color` | — | `--mod-shell-footerbar-color` |
| `--nc-shell-footerbar-border` | — | `--mod-shell-footerbar-border` |

### Content Area
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-shell-content-max-width` | — | `--mod-shell-content-max-width` |
| `--nc-shell-content-narrow` | — | `--mod-shell-content-narrow` |
| `--nc-shell-content-padding` | — | `--mod-shell-content-padding` |

### Z-Index Governance
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-shell-z-linkbar` | — | `--mod-shell-z-linkbar` |
| `--nc-shell-z-footerbar` | — | `--mod-shell-z-footerbar` |
| `--nc-shell-z-navbar` | — | `--mod-shell-z-navbar` |
| `--nc-shell-z-sidebar` | — | `--mod-shell-z-sidebar` |
| `--nc-shell-z-overlay` | — | `--mod-shell-z-overlay` |
| `--nc-shell-z-drawer` | — | `--mod-shell-z-drawer` |

### Skip-Link
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-shell-skip-link-bg` | — | `--mod-shell-skip-link-bg` |
| `--nc-shell-skip-link-color` | — | `--mod-shell-skip-link-color` |
| `--nc-shell-skip-link-z` | — | `--mod-shell-skip-link-z` |

### Banner (Messages)
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-shell-banner-bg` | — | `--mod-shell-banner-bg` |
| `--nc-shell-banner-color` | — | `--mod-shell-banner-color` |
| `--nc-shell-banner-padding` | — | `--mod-shell-banner-padding` |
| `--nc-shell-banner-font-size` | — | `--mod-shell-banner-font-size` |

## Keyboard Interactions
| Key | Action | Notes |
| --- | --- | --- |
| `Enter` | toggle-drawer | Auf dem Knopf mit aria-controls="<id der Sidebar>" (nativer Knopf, Mobil-Lage unter lg): oeffnet den Drawer, Fokus in die Sidebar. Ab lg ohne Verhalten. |
| `Space` | toggle-drawer | Wie Enter auf dem Knopf. |
| `Escape` | close-drawer | Offener Drawer: schliesst ihn, gibt den inert gesetzten Rest der Seite frei, Fokus zurueck auf den Ausloeser. Geschlossen: Escape bleibt frei. |
| `Tab` | trap-focus | Offener Drawer: Fokus bleibt in der Sidebar (vom letzten zum ersten Element). Sonst normaler Tab-Fluss; der geschlossene Drawer ist per display: none nicht in der Tab-Folge. |
| `Shift+Tab` | trap-focus-reverse | Offener Drawer: vom ersten zum letzten Element der Sidebar. |

## Events
| Event | Bubbles | Detail |
| --- | --- | --- |
| `shell-drawer-toggle` | Yes | `{"side":"string","open":"boolean","reason":"string"}` |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- hasLandmarks
- hasSkipLink

## Web Components Mapping
Derived from anatomy for potential `<nc-shell>` custom element:

```js
class NcShell extends HTMLElement {
  static observedAttributes = ['preset', 'sidebar', 'sidebarDensity', 'contentAlign', 'footerbarMobile'];
  // Slots: <slot name="skip-link">, <slot name="navbar">, <slot name="stage">, <slot name="main">, <slot name="content-body">
}
```

---

*Generated from `data/shell-recipe.json` by `scripts/generate-component-specs.js`*
