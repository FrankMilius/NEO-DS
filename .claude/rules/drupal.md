# Drupal Integration Rules

## Drupal Environment

- **CMS:** Drupal 11 via DDEV (`piipe-workplace.ddev.site`)
- **Theme:** `web/themes/custom/neo_fe` (own repo, see `/commit`)
- **Commands:** Always `cd ~/Sites/DRUPAL11` before `ddev drush` (the theme repo is `~/Sites/DRUPAL11/web/themes/custom/neo_fe`; `Documents/DRUPAL11` is stale and empty since 2026)

## Block Creation Pattern

When creating a new NEO block type, always follow this sequence:
1. Create `BlockContentType` entity
2. Create `FieldStorageConfig` (check if storage already exists!)
3. Create `FieldConfig` instances
4. Configure Form Display (widgets)
5. Configure View Display (all fields hidden — template renders)
6. Create BOTH Twig templates: `block--inline-block--neo-*.html.twig` AND `block--block-content--neo-*.html.twig`
7. Behavior in neo-behaviors, Anhängen über `_neo_fe_behaviors_anhaengen` (if needed): behavior in WEBSITE26 `packages/neo-behaviors` (recipe first, `nurAusdruecklich: true`), attached in the block preprocess with `_neo_fe_behaviors_anhaengen($variables, ['<id>'])`. Theme-only glue (data, submit) goes into a block library `neo_fe/neo-<block>` (`js/neo-<block>.js`, attached with `_neo_fe_bibliothek_anhaengen`) — never into `global-styling`. See neo-behaviors README, section „Website-Bauteile“.
8. Export config: `ddev drush cex --yes && ddev drush cr`

## Template Pattern

```twig
{% set f = neo_fields|default({}) %}
{% set headline = f.field_prefix_headline|default('') %}
<div{{ attributes }}>
  <section class="nc-section">
    <div class="nc-container">
      {# Content here #}
    </div>
  </section>
</div>
```

## Key Files

- `neo_fe.theme` — Preprocess functions (generic field extraction, template suggestions, attaching behaviors and block libraries)
- `includes/neo_*.inc` — Per-block preparation of JSON fields for Twig (allowlists)
- `js/neo-behaviors.js` — Built copy of WEBSITE26 `packages/neo-behaviors/dist` (do not edit)
- `js/neo-<block>.js` — Small per-block libraries (data, submit); `neo-theme.js` was removed in Plan v4, Phase 8 (13.10.2026)
- `neo-overrides.css` — Drupal-specific CSS overrides (~2000 lines)
- `theme-settings.php` — Theme configuration forms (footer, navigation, etc.)

## Important Rules

- For `list_string` fields: `allowed_values` as key-value map (NOT array-of-objects)
- Field prefix convention: `neo_card_grid` → `field_cg_*`, `neo_hero` → `field_hero_*`
- View Display: ALL fields hidden (template renders via `neo_fields`)
- Always create both template variants (inline-block + block-content)
- After DB changes: always `ddev drush cex --yes` to export config
