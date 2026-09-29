# ADR-001: Eine Token-Quelle, vier Ausgaben

- **Status:** angenommen, Umsetzung in Etappen
- **Datum:** 29.09.2026
- **Entscheider:** Frank Milius

## Kontext

Das NEO Design System lief in drei Staenden auseinander:

| Stand | Quelle | Befund (29.09.2026) |
| --- | --- | --- |
| Website / Drupal | SCSS → `styles.css`, Mono-Bruecke | fuehrend, Graphit |
| Konfig-App, PowerPoint | `data/design-tokens.json` | Semantik noch blau (`#009fe3`) |
| Folien | Figma-Bibliothek `Td9jEnrwY4vSzqnMPm6u1n` | Textfarben `#000` / `#494949` / `#7a7a7a` |

Dieselbe Rolle hatte in drei Kanaelen drei Werte. Jeder Kanal wurde von
Hand nachgezogen; niemand merkte die Abweichung, weil keine Pruefung lief.

## Entscheidung

1. **Werte haben genau eine Quelle:** `data/design-tokens.json`.
   Semantische Rollen stehen dort als Verweise auf Leitern
   (`semantic.references`, z. B. `{neutral.950}`), aufgeloeste Werte
   (`semantic.defaults`) werden daraus abgeleitet.
2. **Vier Ausgaben werden erzeugt, nicht gepflegt:**
   CSS/SCSS (Website, Drupal), `tokens.generated.js` (Konfig-App),
   Figma-Variablen (Sammlung „Rolle"), PowerPoint-Master.
3. **Figma ist fuehrend fuer Layouts, nicht fuer Werte.**
4. **Jede Aenderung laeuft durch einen Waechter:** Validator (Schwelle darf
   nur sinken), Semantik-Abgleich, Generat-Drift, Kontrast.
5. **Uebergang:** Bis die SCSS aus der JSON erzeugt wird, bleibt
   `_mono-bridge.scss` fuehrend fuer die Semantik; die JSON folgt ihr per
   `scripts/semantik-aus-bruecke.cjs` und wird in `npm test` und CI geprueft.

## Folgen

- Positiv: Abweichungen fallen im Commit bzw. in der CI auf, nicht Wochen
  spaeter auf einer Folie.
- Negativ: Werte duerfen nicht mehr direkt in Figma oder in PowerPoint-
  Skripten geaendert werden; der Weg fuehrt ueber die JSON.
- Offen: Umkehr der Richtung (SCSS aus JSON), DTCG-Format, automatischer
  Figma-Abgleich (die Variablen-REST-API setzt einen Enterprise-Plan voraus;
  sonst per Plugin/`use_figma`).

## Umgesetzt am 29.09.2026

`0be9563` Generator-Bruecke · `918f54a` Semantik aus der Bruecke ·
`94dbc5f` Waechter in npm test · `f53c98f` Golden Master ·
`6e60d94` Figma-Rollen aus der JSON · `a5a88bf` CI-Workflow.
