# ADR-003: Store – Pinia-Setup-Stores, Module, Verlauf-Plugin

- **Status:** angenommen, umgesetzt (Plan v2, 3.3a–3.3c)
- **Datum:** 30.09.2026
- **Entscheider:** Frank Milius
- **Code:** `apps/theme-configurator/src/stores/`

## Kontext

Der Theme-Konfigurator hält den gesamten Theme-Zustand im Browser: zwei
Theme-Sets (`neo`, `customer`) mit je hellem und dunklem Modus, Foundation-,
Komponenten- und Primitive-Overrides, eigene Tokens, Schriften, Icons,
Komponenten-Sperren und -Versionen. Bis Plan v2, 3.3 lag das in **einer**
Store-Datei `stores/theme.js`. Befunde (29.09.2026):

- Undo war in jede Aktion von Hand eingebaut; Aktionen ohne Aufruf fehlten im
  Verlauf, abgelehnte Eingaben erzeugten leere Schritte, Redo erreichte den
  letzten Stand nicht.
- Vier Abschriften der Liste „was gehört zum Theme“ (9, 10, 24 Felder) –
  eigene Tokens, Icons, semantische Abstände/Typografie fielen aus Undo und
  Branches heraus.
- Eine Datei mit allen Aufgaben (UI-Zustand, Token-Aktionen, Speichern,
  Export) war für neue Entwickler schwer zu überblicken.

## Entscheidung

1. **Pinia 3 mit Setup-Stores.** `useThemeStore` (`stores/theme.js`) ist eine
   **Fassade**: `defineStore('theme', () => ({ state, …getter, …aktionen }))`.
   Komponenten importieren nur `useThemeStore`.
2. **Module nach Aufgaben** in `stores/theme/`:

   | Modul | Aufgabe |
   | --- | --- |
   | `kern.js` | reaktiver `state` (Vue `reactive`, Modul-Ebene), `deepClone`, gültige Token-IDs, Foundation-Standard |
   | `getter.js` | abgeleitete Werte (`currentSemanticTokens`, `isDirty`, …) |
   | `ui.js` | Sektion, Theme-Set, Vorschaumodus, Arena-Auswahl/-Filter |
   | `token-aktionen.js` | Token ändern/anlegen/entfernen (Semantik, Foundation, Komponenten, eigene Tokens, Icons, Schriftskala) |
   | `komponenten.js` | Sperren, Versionen, eigene Varianten |
   | `verlauf.js` | `THEME_DATA_KEYS`, Schnappschuss, Undo/Redo, Werkseinstellung |
   | `themes.js` | benannte Themes, NEO-Standard laden, Import, Speicher-Abstraktion (`speichereTheme`, `veroeffentlicheTheme`, `aktiviereTheme`) |
   | `persistenz.js` | Auto-Save des Arbeitsstands (localStorage), `saveToServer` |
   | `export.js` | JSON-, CSS-Variablen-, DTCG-Export |
   | `theme-sets.js` | Sets vergleichen/kopieren, Customer auf NEO zurücksetzen |
   | `praesentation.js` | Einstellungen der Präsentations-Sektion |

   Daneben eigenständige Stores: `branches.js` (`useBranchStore`, lokale
   Branches/Releases) und `styleguide-sync.js` (`useStyleguideSync`,
   Zusatzpaletten in den Styleguide schreiben, nur mit Docs-Server).
3. **Ein Schema für Theme-Inhalte:** `THEME_DATA_KEYS` in
   `stores/theme/verlauf.js`. Undo, benannte Themes und Branch-Schnappschüsse
   (über `snapshotThemeData`/`applyThemeData`), Import und DTCG-Export
   benutzen dieselbe Liste; `tests/stores/theme-schema.test.js` hält sie
   vollständig. Der Branch-Merge (`branches.js`) führt davon nur einen Teil
   zusammen (Komponenten-, Foundation-, semantische Werte, Sperren,
   Versionen).
4. **Undo als Pinia-Plugin** (`stores/plugins/verlauf.js`): Der Store meldet
   per Option `{ verlauf: VERLAUF_AKTIONEN }` (47 Aktionen), welche Aktionen
   einen Schritt anlegen. Das Plugin ruft über `$onAction` vor der Aktion
   `beginneSchritt()` und danach – auch nach `await` oder Fehler –
   `schliesseSchritt()`. Ein Schritt entsteht nur bei tatsächlicher Änderung.
   Schnelle Folgen (Slider, Farbrad) innerhalb von 400 ms werden
   zusammengefasst (`HISTORY_COALESCE_MS`), höchstens 50 Schritte
   (`HISTORY_MAX`).
5. **Eine Pinia-Fabrik** `stores/pinia.js` (`erzeugePinia()`), von `main.js`
   und `tests/setup.js` gleich benutzt – Tests laufen mit demselben Plugin.

## Alternativen

| Alternative | Warum nicht |
| --- | --- |
| Options-Stores je Bereich (mehrere `defineStore`) | Aktionen greifen quer auf denselben Zustand zu (Set × Modus × Bereich); getrennte Stores hätten Zustand verdoppelt oder gegenseitig importiert. |
| Undo weiter in jeder Aktion | genau die Fehlerquelle der Befunde; neue Aktionen vergessen den Aufruf. |
| `pinia-plugin-persistedstate` / generisches Undo über `$subscribe` | `$subscribe` feuert je Mutation (ein Slider = viele Schritte), Persistenz braucht eigene Schlüssel und Migration (Alt-Schriften, bereinigte Token-IDs). |
| Vuex | abgelöst, keine Setup-Syntax. |

## Folgen

- Positiv: Neue Aktion = Funktion im passenden Modul, Eintrag in der Fassade,
  ggf. Name in `VERLAUF_AKTIONEN`. Neues Theme-Feld = Eintrag in
  `THEME_DATA_KEYS` (Test schlägt sonst an).
- Positiv: Module sind ohne Mount testbar; die Tests teilen die Plugin-Kette
  der App.
- Negativ: Der `state` liegt auf Modul-Ebene (`kern.js`) und wird von der
  Fassade nur durchgereicht. Mehrere Pinia-Instanzen teilen ihn (in Tests
  bewusst so, siehe `tests/setup.js`); zwei unabhängige Konfiguratoren auf
  einer Seite gehen damit nicht.
- Im Drupal-Betrieb werden lokale Branches/Releases (`branches.js`)
  ausgeblendet (ADR-002, Beschluss E; Drupal speichert ohne Revisionen).
