---
name: create-drupal-block
description: Erstellt einen vollständigen NEO Block-Typ in Drupal inkl. aller Artefakte.
---

# Create Drupal Block Skill

Erstellt einen vollständigen NEO Block-Typ in Drupal inkl. aller Artefakte.

## Trigger
`/create-drupal-block <block-id> "<Label>" [--fields="feld1:typ,feld2:typ"]`

Beispiel: `/create-drupal-block neo_testimonial "NEO Testimonial" --fields="headline:string,quote:string_long,author:string,role:string,image:entity_reference:media,layout:list_string"`

## Ablauf

### 1. Block-Typ erstellen (Drupal)
- Erstelle `BlockContentType` mit id `<block-id>` und label `<Label>`
- Erstelle `FieldStorageConfig` für jedes Feld
- Erstelle `FieldConfig` (Instance) für jedes Feld im Bundle
- Konfiguriere Form Display (Widgets: string_textfield, string_textarea, options_select, media_library_widget)
- Konfiguriere View Display (alle Felder auf hidden — Template rendert)

### 2. Twig Templates erstellen
- Erstelle `block--inline-block--<block-id>.html.twig` in `web/themes/custom/neo_theme/templates/block/`
- Erstelle `block--block-content--<block-id>.html.twig` (Kopie für Reusable Blocks)
- Template-Pattern:
  ```twig
  {% set f = neo_fields|default({}) %}
  {% set headline = f.field_<prefix>_headline|default('') %}
  ...
  <div{{ attributes }}>
    <section class="nc-section">
      <div class="nc-container">
        {# Markup hier #}
      </div>
    </section>
  </div>
  ```

### 3. JS Behavior erstellen
- Füge `Drupal.behaviors.neo<BlockName>` in `web/themes/custom/neo_theme/js/neo-theme.js` hinzu
- Pattern: JSON aus `<script type="application/json" data-<block>-config>` lesen, DOM generieren
- Registrierung am Ende der Datei, vor `})(Drupal);`

### 4. CSS Styles
- Füge Block-spezifische Styles in `web/themes/custom/neo_theme/css/neo-overrides.css` hinzu
- Nutze NEO Design System BEM-Klassen und Tokens wo möglich

### 5. Theme-Preprocess prüfen
- Stelle sicher, dass `neo_theme_preprocess_block()` in `neo_theme.theme` generisch alle `field_*` Felder extrahiert
- Stelle sicher, dass `neo_theme_theme_suggestions_block_alter()` den neuen Block-Typ abdeckt

### 6. Beispiel-Instanz erstellen
- Erstelle eine `BlockContent` Entity mit Beispieldaten
- Optional: Platziere auf einer Seite via Layout Builder

### 7. Config exportieren
- `ddev drush cex --yes`
- `ddev drush cr`

### 8. Zusammenfassung
- Liste aller erstellten Dateien/Configs
- Hinweis auf nächste Schritte (Styling, Integration)

## Regeln
- Prüfe IMMER zuerst ob `field_storage` bereits existiert (andere Block-Typen könnten es nutzen)
- Feld-Präfix ableiten: `neo_card_grid` → `field_cg_*`, `neo_hero` → `field_hero_*`
- Für `list_string` Felder: `allowed_values` als Key-Value-Map (nicht Array-of-Objects)
- Templates: IMMER beide Varianten erstellen (inline-block + block-content)
- View Display: ALLE Felder hidden (Template rendert via `neo_fields`)
