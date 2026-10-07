# navigation-tab-mega Component Spec
> Version 1.1.2 | Status: stable | Layer: organism

Tags: `navigation`, `header`, `mega-menu`, `interactive`, `website`

## Anatomy
Root element: `.site-header`

| Slot | Selector | Required | Description |
| --- | --- | --- | --- |
| inner | `.header-inner` | Yes | — |
| brand | `.brand` | Yes | — |
| brand-logo | `.brand__logo` | No | — |
| brand-name | `.brand__name` | No | — |
| primary-nav | `.primary-nav` | Yes | — |
| list | `.nav-list` | Yes | — |
| trigger | `.nav-btn` | No | — |
| trigger-label | `.nav-btn__label` | No | — |
| trigger-icon | `.nav-btn__pm` | No | — |
| link | `.nav-link` | No | — |
| actions | `.header-actions` | Yes | — |
| settings | `.hdr-group` | Yes | — |
| settings-menu | `.hdr-menu` | Yes | — |
| settings-trigger | `.hdr-btn` | Yes | — |
| settings-panel | `.hdr-pop` | Yes | — |
| settings-option | `.hdr-opt` | Yes | — |
| search-toggle | `.search-toggle` | Yes | — |
| burger | `.burger` | Yes | — |
| panel | `.panel` | No | — |
| panel-inner | `.panel-inner` | No | — |
| panel-overview | `.panel-overview` | No | — |
| mega-grid | `.mega-grid` | No | — |
| mega-cat | `.mega-cat` | No | — |
| mega-eyebrow | `.mega-cat__eyebrow` | No | — |
| tablist | `.tablist` | No | — |
| tab | `.tab` | No | — |
| tab-count | `.tab__count` | No | — |
| tabpanel | `.tabpanel` | No | — |
| link-grid | `.link-grid` | No | — |
| dropdown-grid | `.dropdown-grid` | No | — |
| dropdown-cols | `.dropdown-cols` | No | — |
| teaser | `.teaser` | No | — |
| teaser-title | `.teaser__title` | No | — |
| teaser-text | `.teaser__text` | No | — |
| teaser-cta | `.teaser__cta` | No | — |
| teaser-bg | `.teaser__bg` | No | — |
| arrow | `.nav-arrow` | No | — |
| search-band | `.search-band` | Yes | — |
| searchbox | `.searchbox` | Yes | — |
| search-input | `.search-input` | Yes | — |
| search-clear | `.search-clear` | Yes | — |
| search-submit | `.search-submit` | Yes | — |
| search-close | `.search-close` | Yes | — |
| drawer | `.m-drawer` | Yes | — |
| drawer-viewport | `.m-viewport` | Yes | — |
| drawer-screen | `.m-screen` | Yes | — |
| drawer-row | `.m-row` | Yes | — |
| drawer-back | `.m-back` | No | — |
| drawer-heading | `.m-heading` | No | — |
| drawer-section-title | `.m-section-title` | No | — |
| drawer-link | `.m-link` | No | — |
| drawer-tools | `.m-tools` | Yes | — |
| drawer-search | `.m-search` | Yes | — |
| drawer-lang | `.lang-switch` | Yes | — |
| drawer-lang-mobil | `.m-lang` | Yes | — |
| drawer-cta | `.m-cta` | No | — |

### DOM Notes
- Wurzel ist <header class="site-header" data-neo-nav>. Das Attribut data-neo-nav ist Pflicht: alle Regeln haengen an .site-header[data-neo-nav] bzw. an :where(.site-header[data-neo-nav], .m-drawer).
- Der mobile Drawer .m-drawer ist ein GESCHWISTER des Headers, kein Nachfahre — er ist die zweite Wurzel. Grund: transform am Header (Auto-Hide) erzeugt einen Containing-Block fuer position: fixed; laege der Drawer darin, wanderte er mit.
- Das Twig (neo-nav.html.twig) rendert das komplette Markup serverseitig aus den Daten des Moduls neo_nav (Menuepunkte, Panels, Drawer-Bildschirme; crawlbar, ohne JS lesbar). Das Verhalten kommt aus neo-behaviors (navigation-tab-mega) und baut nichts — vor dem 03.10.2026 baute neo-nav.js Panels und Drawer aus drupalSettings.neoNav.
- Panel-Typ aus der Menuestruktur, ohne Auswahlfeld: Ebene 1 ohne Kinder = a.nav-link; mit Kindern = Dropdown (ul.dropdown-cols, zweispaltig); mit Enkeln = Mega-Panel (div.mega-grid: Kategoriespalte .mega-cat mit role=tablist, Linkliste je .tabpanel, optional Teaser).
- Teaser-Karte aside.teaser am Menuepunkt der Ebene 1 gepflegt (Titel leer = kein Teaser). Ohne Teaser im Mega-Panel: .mega-grid--no-teaser (zweispaltig). Flaeche ueber .teaser--bg-{g50|g200|g900|g950|accent}, Knopf ueber .teaser--cta-{dark|light}, Bild ueber --nn-teaser-image + .teaser--has-image, Animation ueber div.teaser__bg[data-neo-bg] + .teaser--has-anim.
- Punkte ohne eigene Seite (<nolink>) haben keinen Uebersichtslink .panel-overview.
- Sprache, Erscheinungsbild und Suche bilden eine Gruppe .hdr-group (role=group). Die aktive Option traegt Haken UND Fettung, keine Markenfarbe.
- Breiten-Zwilling: .nav-btn__label traegt data-text mit der Beschriftung; das CSS legt daraus einen unsichtbaren Zwilling in 600 in dieselbe Rasterzelle, damit der Gewichtswechsel die Leiste nicht verschiebt.
- Unter 1025 px (max-width: 1024px) entfallen .primary-nav, .hdr-group, .panel und .search-band; .burger und .m-drawer erscheinen.
- Sprache live (DE/EN ohne Neuladen): jede uebersetzbare Beschriftung traegt beide Fassungen als data-neo-i18n='{"de":…,"en":…}'; mit data-neo-i18n-attr (aria-label, placeholder, data-text) wird statt des Texts das Attribut gesetzt. Gerendert wird die Sprache der Seite; das Behavior beschriftet beim Wechsel neu und setzt lang an Header und Drawer (nicht an <html> — der Seiteninhalt wechselt nicht).
- Drawer-Push: button.m-row[aria-controls] verweist auf seinen Unterbildschirm (.m-screen[id][data-screen]); .m-back geht zurueck. Gefunden werden Panel, Such-Band, Kopfleisten-Menue und Drawer ueber aria-controls, nicht ueber feste ids.
- data-neo-nav-autohide="aus" an der Wurzel schaltet das Auto-Hide ab (Arena „Ausprobieren"); data-neo-nav-pfad ersetzt location.pathname fuer die Markierung des aktuellen Asts.

## Variants
### Geöffnet (`offen`)
Was gerade offen ist. Immer hoechstens eines: Panels, Such-Band und Kopfleisten-Menues schliessen sich gegenseitig.

| Value | CSS Modifier | Default |
| --- | --- | --- |
| keins | — |  |
| mega | — |  |
| dropdown | — |  |
| suche | — |  |
| sprache | — |  |
| ansicht | — |  |

### Teaser (`teaser`)
Teaser-Karte im Panel. Redaktionell am Menuepunkt gepflegt; ohne Titel entfaellt sie samt Spalte.

| Value | CSS Modifier | Default |
| --- | --- | --- |
| mit | — |  |
| ohne | — |  |

### Teaser-Fläche (`teaserFlaeche`)
Gepruefte Flaechen der Teaser-Karte (Modifier am Kind aside.teaser). Jede Stufe bringt ihre Schriftfarben mit.

| Value | CSS Modifier | Default |
| --- | --- | --- |
| standard | — |  |
| g50 | `.teaser--bg-g50` |  |
| g200 | `.teaser--bg-g200` |  |
| g900 | `.teaser--bg-g900` |  |
| g950 | `.teaser--bg-g950` |  |
| accent | `.teaser--bg-accent` |  |

### Teaser-Knopf (`teaserKnopf`)
Fassung des Teaser-Knopfs, je Teaser von der Redaktion gewaehlt — bei einem Hintergrundbild laesst sie sich nicht berechnen. neo-nav.js setzt dark, wenn nichts gepflegt ist.

| Value | CSS Modifier | Default |
| --- | --- | --- |
| dark | `.teaser--cta-dark` |  |
| light | `.teaser--cta-light` |  |

### Ausgabe (`ausgabe`)
Desktop (Leiste mit Panels) oder mobil (Burger + Push-Navigation im Drawer). Umschaltung im Bauteil allein ueber die Fensterbreite (max-width: 1024px).

| Value | CSS Modifier | Default |
| --- | --- | --- |
| desktop | — |  |
| mobil | — |  |

### Drawer (`drawer`)
Mobiler Drawer: zu, offen auf dem Startbildschirm oder auf einer Unterseite (Push-Navigation, der vorige Bildschirm rueckt um 30 % nach links).

| Value | CSS Modifier | Default |
| --- | --- | --- |
| zu | — |  |
| start | — |  |
| unterseite | — |  |

## States
Supported: `default`, `active`, `hidden`

- **active**: 
- **hidden**: 

## CSS Token API
Base classes: `site-header`

### Leiste
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nn-text` | — | — |
| `--nn-muted` | — | — |
| `--nn-line` | — | — |
| `--nn-line-strong` | — | — |
| `--nn-surface` | — | — |
| `--nn-surface-2` | — | — |
| `--nn-content-max` | — | — |
| `--nn-header-h` | — | — |
| `--nn-radius-sm` | — | — |
| `--nav-l1-size` | — | — |
| `--nav-l1-weight-rest` | — | — |
| `--nav-l1-weight-active` | — | — |
| `--nav-hit-height` | — | — |
| `--nav-focus-ring` | — | — |

### Panel
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nn-shadow` | — | — |
| `--nn-t` | — | — |
| `--nav-l2-size` | — | — |
| `--nav-l3-size` | — | — |
| `--nav-eyebrow-size` | — | — |
| `--nav-rail-color` | — | — |
| `--nav-rail-width` | — | — |
| `--nav-action-size` | — | — |
| `--nav-dropdown-cols-max` | — | — |

### Teaser
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nn-teaser-bg` | — | — |
| `--nn-teaser-fg` | — | — |
| `--nn-teaser-fg-muted` | — | — |
| `--nn-teaser-border` | — | — |
| `--nn-teaser-cta-bg` | — | — |
| `--nn-teaser-cta-fg` | — | — |
| `--nn-teaser-image` | — | — |
| `--nn-teaser-scrim` | — | — |

### Suche
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nav-search-bg` | — | — |
| `--nav-search-bg-focus` | — | — |
| `--nav-search-border` | — | — |
| `--nav-search-radius` | — | — |
| `--nav-focus-width` | — | — |
| `--nav-focus-offset` | — | — |

### Kopfleisten-Menü
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nav-pop-bg` | — | — |
| `--nav-pop-radius` | — | — |
| `--nav-pop-shadow` | — | — |
| `--nav-pop-min-width` | — | — |
| `--nav-check-color` | — | — |
| `--nav-check-color-dark` | — | — |

### Drawer
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nn-accent` | — | — |
| `--nn-on-accent` | — | — |
| `--nn-header-h` | — | — |

## Keyboard Interactions
| Key | Action | Notes |
| --- | --- | --- |
| `Enter` | toggle-panel | Auf einem Menuepunkt mit Unterpunkten (button.nav-btn): oeffnet bzw. schliesst sein Panel (native Button-Aktivierung). Nur ein Panel gleichzeitig; Oeffnen schliesst Such-Band und Kopfleisten-Menues. Schliessen gibt den Fokus an den Ausloeser. Auf Such-, Menue-, Burger- und Drawer-Knoepfen: deren Aktion (nativ). |
| `Space` | toggle-panel | Wie Enter. |
| `ArrowDown` | next-tab-or-option | Im Mega-Panel auf einem Tab: naechster Tab, aktiviert ihn sofort (rundum). Im Sprach-/Erscheinungsbild-Menue: naechste Option (rundum). |
| `ArrowUp` | prev-tab-or-option | Wie ArrowDown, rueckwaerts. |
| `Escape` | close | Schliesst in dieser Reihenfolge: Kopfleisten-Menue, Such-Band, Panel, Drawer — Fokus zurueck auf den Ausloeser (beim Drawer nur, wenn der Fokus im Drawer lag: der geschlossene Drawer ist inert). |

## Events
| Event | Bubbles | Detail |
| --- | --- | --- |
| `navigation-tab-mega-panel` | Yes | `{"value":"string","open":"boolean"}` |
| `navigation-tab-mega-tab` | Yes | `{"value":"string","previousValue":"string"}` |
| `navigation-tab-mega-search` | Yes | `{"open":"boolean"}` |
| `navigation-tab-mega-menu` | Yes | `{"value":"string","open":"boolean"}` |
| `navigation-tab-mega-select` | Yes | `{"menu":"string","value":"string"}` |
| `navigation-tab-mega-language` | Yes | `{"value":"string"}` |
| `navigation-tab-mega-drawer` | Yes | `{"open":"boolean","reason":"string"}` |
| `navigation-tab-mega-screen` | Yes | `{"value":"string"}` |
| `navigation-tab-mega-hidden` | Yes | `{"hidden":"boolean"}` |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- hasAccessibleName
- supportsKeyboard
- hasVisibleFocus
- targetSize44

## Dependencies
`kbd`

## Web Components Mapping
Derived from anatomy for potential `<nc-navigation-tab-mega>` custom element:

```js
class NcNavigationTabMega extends HTMLElement {
  static observedAttributes = ['offen', 'teaser', 'teaserFlaeche', 'teaserKnopf', 'ausgabe', 'drawer'];
  // Slots: <slot name="inner">, <slot name="brand">, <slot name="primary-nav">, <slot name="list">, <slot name="actions">, <slot name="settings">, <slot name="settings-menu">, <slot name="settings-trigger">, <slot name="settings-panel">, <slot name="settings-option">, <slot name="search-toggle">, <slot name="burger">, <slot name="search-band">, <slot name="searchbox">, <slot name="search-input">, <slot name="search-clear">, <slot name="search-submit">, <slot name="search-close">, <slot name="drawer">, <slot name="drawer-viewport">, <slot name="drawer-screen">, <slot name="drawer-row">, <slot name="drawer-tools">, <slot name="drawer-search">, <slot name="drawer-lang">, <slot name="drawer-lang-mobil">
}
```

---

*Generated from `data/navigation-tab-mega-recipe.json` by `scripts/generate-component-specs.js`*
