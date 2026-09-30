# E2E-Tests des Theme-Konfigurators (Plan v2, 4.2)

Playwright gegen das **gebaute** Bundle, serviert vom Docs-Server
(`scripts/docs-server.js`, Port 3100 — `E2E_PORT` ändert ihn).

## Ausführen

```bash
# Wurzel
npm ci && npm run build:css
# apps/theme-configurator
npm ci
npx playwright install chromium     # einmalig (Version aus package-lock)
npx vite build
npm run e2e                         # CI-Gate: Smoke, Kernabläufe, axe
npm run e2e:visuell                 # Screenshot-Vergleich (nicht im Gate)
npx playwright show-report          # HTML-Report
```

Externe Anfragen (Google Fonts, Bild-CDNs) werden im Test abgebrochen; die
Tests laufen offline.

## Was geprüft wird

| Datei | Inhalt |
|---|---|
| `sektionen.spec.js` | Jede Sektion der Navigation per Deep-Link: Router nimmt sie an, Header/Labor/Inspector sichtbar, Inhalt vorhanden, keine Error-Boundary, keine Konsolenfehler/pageerror. Die Liste kommt aus `src/navigation/sektions-ids.js` (über `sektionsliste.mjs`), neue Sektionen sind automatisch dabei. |
| `ablaeufe.spec.js` | Token ändern → Undo/Redo (Knöpfe und Strg+Z) · Theme-Set Neo → Customer inkl. URL · DTCG-Export-Dialog · Import lehnt ungültige Dateien ab · Präsentations-Bühne folgt Farbwechsel. |
| `axe.spec.js` | axe (WCAG 2.0/2.1 A+AA, 2.2 AA) auf Start, Farben (Semantic), Typografie, Präsentation, Recipe-Arena (Badge), DTCG-Dialog. Geprüft wird die App-Oberfläche; `.lab-viewport` (Arenen) ist ausgenommen. |
| `arenen.visuell.spec.js` | `@visuell`: Screenshots des Labor-Viewports ausgewählter Arenen. |

Bekannte, noch nicht behobene Konsolenfehler stehen mit Grund in
`BEKANNTE_FEHLER` (`hilfen.js`) — nach der Behebung dort entfernen.

## axe-Basislinie

`axe-basislinie.json` hält je Seite `Regel-ID → Anzahl verletzender Knoten`.
Der Test scheitert nur bei **neuen Regeln oder mehr Knoten**. Sinkt eine
Zahl (z. B. durch 4.4 Barrierefreiheit), erscheint im Report die Annotation
„axe besser als Basislinie — senken“. Dann:

```bash
AXE_BASISLINIE=schreiben npm run e2e -- e2e/axe.spec.js
git diff e2e/axe-basislinie.json    # nur Senkungen erwartet
```

Die Basislinie nie anheben, um einen roten Test grün zu machen — erst die
Ursache beheben oder die Anhebung im Commit begründen.

## Screenshot-Vergleich (`@visuell`)

Baselines liegen in `e2e/__screenshots__/` und sind **nur für Linux**
versioniert (`…-linux.png`): Schriftglättung unterscheidet sich zwischen
macOS und Linux, ein Mac-Lauf meldet deshalb fehlende Baselines. Der
Vergleich ist bewusst **kein CI-Gate**.

Aktualisieren (nach gewollter Änderung an einer Arena):

1. GitHub → Actions → „Theme-Konfigurator“ → *Run workflow*, Häkchen
   „Screenshot-Baselines neu schreiben“ setzen.
2. Im Lauf das Artefakt `e2e-screenshots-<sha>` laden, nach
   `apps/theme-configurator/e2e/__screenshots__/` entpacken, Diff ansehen,
   committen.

Ohne Häkchen vergleicht derselbe Job nur und legt bei Abweichungen den
Report mit Diff-Bildern als Artefakt ab. Lokal unter Linux geht auch
`npm run e2e:visuell -- --update-snapshots`.

Die ersten Baselines (30.09.2026) entstanden in einem Linux-Container mit
Chromium 141 (Playwright 1.56.1). Weicht der erste CI-Lauf ab, einmal über
Schritt 1–2 neu schreiben.
