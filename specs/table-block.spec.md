# table-block Component Spec
> Version 1.7.0 | Status: stable | Layer: molecule

Tags: `aufgenommen`, `molecules`

## Anatomy
Root element: `.nc-table-block`

### DOM Notes
- Website (block--block-content--neo-table.html.twig; inline_block per include): section.nc-section[style=Flaeche] > .nc-container > neo_fe:block-header (nc-section-header--center; Badges, Kicker, Headline, Lead) + div.nc-table-block[data-neo-table][data-width][data-scroll-bp][data-sticky-col][data-info-modal][style=--tbl-header-bg/--tbl-stripe-bg] > div.nc-compare-table… > table (fertig aus dem Twig, seit 1.7.0) + der Info-Dialog (Recipe table-info-modal). Bis 1.6.0 stand dort eine leere <table> und das JSON in script[data-table-json].
- Felder: field_tbl_variant striped (Vorgabe) | compact | borderless -> nc-compare-table--{variant}; immer --sticky-header; field_tbl_width full (Vorgabe) -> --full-width (data-width hat kein CSS); field_tbl_sticky_col first (Vorgabe) -> --sticky-col; field_tbl_scroll_bp (Vorgabe 768) -> data-scroll-bp; Farben seit 1.6.0 als Token-Auswahl field_tbl_kopf_ton/-streifen_ton/-flaeche_ton (Achsen kopf, streifen, flaeche; neo_fe _neo_fe_tbl_ton() setzt die Deklarationen der Positivliste); ohne Schluessel der Rueckfall auf die alten Freitextfelder field_tbl_header_bg/-stripe_bg/-bg_color (auf der Website Kopf #1a1a1a, Streifen #f5f5f5): neo_fe bildet bekannte Werte auf Theme-Tokens ab (_neo_fe_tbl_farben) und schreibt --tbl-header-bg/--tbl-stripe-bg inline an den Block bzw. background-color an die Section; leere Felder -> DS-Vorgabe; fremde feste Farben bleiben fest mit Textfarbe nach Kontrast (Kopf --mod-table-header-color, Streifen --tbl-stripe-color + data-tbl-stripe-fest, Section die Farben des Blockkopfs).
- Tabelle aus field_tbl_data (seit 1.7.0 im Preprocess, _neo_fe_tbl_aufbereiten; vorher neoTable im Browser): thead > tr > th[scope=col] je Spalte (Text); tbody > tr je Zeile, erste Zelle th[scope=row], sonst td, Inhalt je Zelle .nc-tbl-cell (Recipe tbl-cell). Rubriken sind normale Zeilen (Text im Zeilenkopf, leere Wertzellen). Ohne columns im JSON bleibt die Tabelle leer (wie bisher).
- Kopfzeile: thead th in Versalien (fs-xs, bold, letter-spacing --nc-table-block-thead-th-letter-spacing), mittig, die erste links; Flaeche var(--tbl-header-bg, --nc-table-header-bg) — auch fuer die erste Kopfzelle bei --sticky-col, die compare-table sonst auf background-base setzt —, Textfarbe --nc-table-header-color (text-inverse) aus compare-table (thead). Vorgabe bis 1.2.x: background-tertiary (Kopftext darauf 1,43:1).
- Streifen (--striped): Flaeche var(--tbl-stripe-bg) — der Block setzt sie auf --nc-table-block-stripe-bg (hell background-secondary, dunkel background-base, opak, weil die feste erste Spalte sie mittraegt); ein Farbfeld schlaegt sie inline. Mit data-tbl-stripe-fest (feste Farbe aus dem Feld) nehmen Text, Untertitel, Info-Knopf und Strich der Streifenzeilen --tbl-stripe-color.
- Scrollen: der Block ist der Scroll-Container (overflow-x auto); der innere Rahmen .nc-compare-table schneidet mit overflow: clip an den runden Ecken, ist aber kein Scroll-Container und waechst mit der Tabelle (width fit-content, min-width 100 %) — so scrollt der Block, und die feste erste Spalte (sticky) bleibt am Block stehen (seit 1.2.2; vorher hielt overflow: hidden die Tabelle im Rahmen fest). Im Scroll-Modus: erste Spalte hoechstens 45vw, erste Kopfzelle ueber den festen Kopfzellen, die feste Spalte klebt am Rand des Blocks (left: minus Polster). Unter data-scroll-bp (Fensterbreite) setzt das Behavior table-block data-scroll-active=true, sonst false (Tabelle max-content statt fester Breite; gedrosselt neu bei ResizeObserver und resize), beim Scrollen ab 5 px .is-scrolled (Schatten der festen ersten Spalte, --nc-table-block-is-scrolled-…-after-opacity). Laeuft die Tabelle ueber, setzt table-block role=region, aria-label (Blocktitel) und tabindex=0 am Block, sonst nicht. Ohne JavaScript fehlt data-scroll-active: die Tabelle behaelt die feste Breite, der Block scrollt bei Ueberlauf trotzdem (overflow-x auto), alle Inhalte stehen im Dokument. Polster spacing-06, unter 768 px spacing-03; Hoechstbreite --nc-container-max-width.
- Verhalten: Behavior table-block (neo-behaviors, seit 1.7.0; vorher neoTable) — Scroll-Grenze, Scroll-Region, Schatten; der Info-Dialog nutzt table-info-modal (Name je Knopf aus data-info-label).

## Variants
### Variant (`variant`)
Einzige Variante (die Tabellenvariante kommt als Modifier von compare-table)

| Value | CSS Modifier | Default |
| --- | --- | --- |
| default | — |  |

### Kopffarbe (`kopf`)
Flaeche der Kopfzeile (thead). Drupal: field_tbl_kopf_ton (Liste (Text), Auswahlknoepfe), ersetzt das Freitextfeld field_tbl_header_bg; Deklarationen an .nc-table-block. Nur „standard" — „gedaempft" (Ghost-Kopf) ist nicht eingefuehrt (Entscheidung 12.10.2026).

| Value | CSS Modifier | Default |
| --- | --- | --- |
| standard | — | Yes |

### Streifenfarbe (`streifen`)
Flaeche jeder zweiten Zeile (--striped). Drupal: field_tbl_streifen_ton (Liste (Text), Auswahlknoepfe), ersetzt field_tbl_stripe_bg; Deklarationen an .nc-table-block. Opak, weil die feste erste Spalte sie mittraegt.

| Value | CSS Modifier | Default |
| --- | --- | --- |
| standard | — | Yes |
| basis | — |  |

### Flaeche (`flaeche`)
Hintergrund der Section um Blockkopf und Tabelle. Drupal: field_tbl_flaeche_ton (Liste (Text), Auswahlknoepfe), ersetzt field_tbl_bg_color; Deklarationen an section.nc-section. Die Tabelle behaelt ihre eigene Flaeche.

| Value | CSS Modifier | Default |
| --- | --- | --- |
| standard | — | Yes |
| erhoeht | — |  |
| basis | — |  |

## States
Supported: `default`, `scrolled`

## CSS Token API
Base classes: `nc-table-block`

### Base
| Token | CSS Property | Override |
| --- | --- | --- |
| `--nc-table-block-is-scrolled-nc-compare-table-sticky-col-th-first-child-after-opacity` | — | — |
| `--nc-table-block-thead-th-letter-spacing` | — | — |
| `--nc-table-block-stripe-bg` | — | — |

## Keyboard Interactions
| Key | Action | Notes |
| --- | --- | --- |
| `Tab` | focus-next | Laeuft die Tabelle ueber, ist der Block (role=region mit Namen) ein Tab-Halt vor den Info-Knoepfen; ohne Ueberlauf nicht. |
| `ArrowLeft` | scroll | Fokus auf dem Block: der Browser scrollt waagerecht (kein eigener Tastenlauscher, das Behavior verhindert nichts). |
| `ArrowRight` | scroll | Wie Pfeil links, in die andere Richtung. |

## Events
| Event | Bubbles | Detail |
| --- | --- | --- |
| `table-block-change` | Yes | `{"scrollActive":"boolean","overflow":"boolean"}` |

## Accessibility
Contrast Target: WCAG AA normal text (4.5:1)

- 1.3.1: echte Tabelle — Spaltenkoepfe th[scope=col], Zeilenkoepfe th[scope=row]; Rubriken sind normale Zeilen (keine eigene Auszeichnung).
- 1.4.3: Kopfzeile text-inverse auf --tbl-header-bg — auf der Website #1a1a1a (neo_fe bildet es auf --nc-table-header-bg ab, 17,17:1 hell und dunkel), seit 1.2.1 auch die erste Kopfzelle bei --sticky-col (vorher background-base, 1,07:1). Ohne Feldwert seit 1.3.0 --nc-table-header-bg (17,17:1; bis 1.2.x background-tertiary, 1,43:1).
- 1.4.3: Farben seit 1.6.0 als Token-Auswahl (Achsen kopf, streifen, flaeche) — jeder Schluessel dreht mit dem Theme; Kontrast je Wert hell/dunkel in a11y.overrides (gemessen 12.10.2026, styles.css, Theme-Klasse am <html> wie neo_fe, 1100 px; Text >= 4,5:1 in allen 6 Kombinationen, kleinster Wert Strich-Symbol in ungeraden Zeilen dunkel 4,59:1). Rueckfall fuer Werte in den alten Freitextfeldern unveraendert: neo_fe bildet bekannte Werte auf Theme-Tokens ab, fremde feste Farben bekommen die Textfarbe nach Kontrast (gemessen: Kopf ab 6,67:1, Streifenzeilen ab 5,75:1, Blockkopf auf fester Flaeche ab 6,09:1; Bestand Block 34: Kopf #d9d9d9 mit always-dark 14,88:1, Streifen #f0f0f0 18,43:1, hell und dunkel fest). Streifen ohne Farbfeld im Dunkeln seit 1.3.0 sichtbar (gegen die Zeile 1,25:1 statt 1,00:1).
- 2.1.1: laeuft die Tabelle ueber, ist der Block per Tastatur erreichbar und scrollbar — das Behavior table-block setzt dann role=region, aria-label (Blocktitel) und tabindex=0 (vorher neoTable, Entscheidung Abschluss 2), ohne Ueberlauf nicht (kein leerer Tab-Halt). Seit 1.2.2 laeuft der Block wirklich ueber (vorher blieb die Tabelle im Rahmen haengen).
- 1.4.10: unter der Scroll-Grenze scrollt die Tabelle im Block, die Seite nicht; die erste Spalte bleibt stehen (gemessen Website-Tabelle 320/375 px: Seite 320/375 px breit, Block scrollWidth 538/564 px, scrollt bis 250/221 px, erste Spalte bleibt am Blockrand).
- 1.4.3: Zellen gemessen (Arena) — Zeilenkoepfe text-primary ab 12,79:1, Strich ab 4,59:1; Info-Symbol siehe tbl-cell.
- 1.3.1/4.1.1: die Tabelle steht seit 1.7.0 im ausgelieferten Dokument (Twig) — ohne JavaScript vollstaendig, Text und Untertitel nach Positivliste gefiltert (kein Skript aus dem Feld).

## Web Components Mapping
Derived from anatomy for potential `<nc-table-block>` custom element:

```js
class NcTableBlock extends HTMLElement {
  static observedAttributes = ['variant', 'kopf', 'streifen', 'flaeche'];
  // Slots: default
}
```

---

*Generated from `data/table-block-recipe.json` by `scripts/generate-component-specs.js`*
