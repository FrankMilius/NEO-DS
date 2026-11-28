# Entwürfe

Spezifikationen für Komponenten, die es im Design System noch nicht gibt.

Ein Recipe in `data/` verlangt das fertige SCSS (Token-Coverage, SCSS-Parität,
Abgleich `generate-component-specs --pruefen`). Bis zum Bau liegen Recipe und
daraus erzeugte Spec deshalb hier. Beim Bau wandert das Recipe nach
`data/<name>-recipe.json`, der Generator erzeugt `specs/<name>.spec.*` neu und
die Dateien hier werden gelöscht.

| Komponente | Stand | Dateien |
|---|---|---|
| combobox | Entwurf 0.1.0, 28.11.2026, Freigabe ausstehend | [Spezifikation](combobox-spezifikation.md) · [Recipe](combobox-recipe.json) · [Spec](combobox.spec.md) |
