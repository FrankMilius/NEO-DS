---
name: neo-design-system
description: Verbindliche Token-, Typografie- und Komponentengrundlage des NEO Design Systems (Drupal 11 / Vue / SCSS, Marke neocosmo). Diesen Skill IMMER verwenden, sobald ein Artefakt, Mockup, Prototyp, HTML-Demo, Vergleichsseite, Komponente, Screenshot-Sektion, Farbschema, Theme oder ein Typografie-Vorschlag für neocosmo, das Intranet, die Website oder das Design System erstellt wird — auch wenn der Nutzer das Design System nicht ausdrücklich erwähnt. Ebenso verwenden bei Fragen zu Farbkontrasten, WCAG-Prüfungen, Akzentfarben, Lime #37e93d, Fokusringen oder Token-Benennung. Ohne diesen Skill erfundene Werte machen jeden visuellen Vergleich wertlos.
---

# NEO Design System

Dieser Skill liefert die verbindlichen Grundlagen für alle visuellen Artefakte im
NEO-Umfeld. Er ersetzt Schätzungen durch echte Werte.

`references/tokens.css` wird aus der echten Quelle **generiert**
(`npm run skill:build` in WEBSITE26) — nicht von Hand gepflegt. Was dort steht,
steht so auch im System.

## Die eine wichtige Regel

**Niemals Token-Werte erfinden.** Weder Schriftfamilien noch Farben, Abstände,
Radien oder Schriftgewichte.

Fehlt ein Wert in `references/tokens.css`, dann existiert er im System nicht —
die Datei ist generiert und vollständig für die Foundation-Ebene. In dem Fall:

1. Das Artefakt trotzdem bauen — aber jeden erfundenen Wert im Artefakt sichtbar
   kennzeichnen (siehe „Platzhalter kennzeichnen").
2. Am Ende der Antwort auflisten, welche Werte gefehlt haben.

Ein Vergleich von Schriften, Farben oder Themes auf Basis geschätzter Werte ist
wertlos — und schlimmer als kein Vergleich, weil er wie ein echter aussieht.

## Ablauf für jedes visuelle Artefakt

1. `references/tokens.css` lesen. Das ist die Quelle der Wahrheit.
2. Prüfen, ob die benötigten Rollen vorhanden sind.
3. `references/components.md` lesen, wenn eine bekannte Komponente gebaut wird.
4. Artefakt bauen: **Tokens inline kopiert.**
5. `references/a11y-checklist.md` durchgehen, bevor die Antwort abgeht.
6. Fehlende Werte am Ende der Antwort benennen.

**Kein `@import`.** Artefakte laufen unter strikter CSP: keine externen
Stylesheets, Skripte, Schriften oder Bilder. Alles muss inline oder als
`data:`-URI ins Dokument. Nur die tatsächlich benötigten Token-Gruppen
übernehmen — die Datei hat 569 Einträge.

## Schriften

Drei Familien, alle selbst gehostet, alle variabel:

| Rolle | Token | Familie | Gewichte |
|---|---|---|---|
| Fließtext | `--font-body` | Manrope | 200–800 |
| Überschriften | `--font-heading` | Space Grotesk | 300–700 |
| Metaebene | `--font-mono` | JetBrains Mono | 100–800, echte Kursive |

Es gibt **kein** `--font-sans` und **kein** `--font-display`. Wer diese Namen
verwendet, erfindet Tokens.

**Schriften im Artefakt.** Weil die CSP externe Requests blockiert, liegen die
drei Familien subgesetzt und base64-kodiert unter `assets/fonts/`. Einbetten:

```css
@font-face {
  font-family: 'Manrope';
  font-weight: 200 800;
  font-display: swap;
  src: url(data:font/woff2;base64,INHALT_VON_manrope.base64.txt) format('woff2');
}
```

Nur einbetten, was das Artefakt wirklich braucht — je Familie 17–41 KB im
Dokument. **Für Schriftfragen ist das Pflicht**: ohne Einbettung rendert das
Artefakt in Systemschriften und zeigt genau das nicht, worum es geht. Für
Layout-, Farb- und Abstandsvergleiche genügt der Fallback-Stack.

## Feste Prinzipien des Systems

Diese gelten unabhängig vom aktuellen Token-Stand:

- **Zwei-Ebenen-Tokens.** Tier 1 (`--fnd-primitive-*`) bleibt stabil und wird nie
  direkt von Komponenten konsumiert — die Rohpalette ist deshalb bewusst **nicht**
  in `tokens.css` enthalten. Tier 2 (semantisch) trägt die Bedeutung und ist die
  einzige Ebene, die Komponenten verwenden dürfen.
- **`#37e93d` ist Fläche, niemals Text.** Auf Weiß erreicht Lime 1,5:1.
  Token: `--fnd-color-background-accent`. Die Schriftfarbe darauf steht als
  `--fnd-color-on-accent` (aktuell `#000000`).
- **Farbe ist Fläche, Text ist Tinte.** Kategorien, Zustände und Meldungen laufen
  über getönte Paare (blasse Fläche + dunklere Schrift derselben Familie), nicht
  über farbige Schrift auf Weiß.
- **Links: Tinte, Gewicht 650, abgesetzter Lime-Unterstrich.** 2 px Stärke, 5 px
  Abstand, `text-decoration-skip-ink: none`. Hover: Lime-Wash 20 % plus 3 px
  Strich. Kein Farbwechsel.
- **Mono trägt die Metaebene.** Dachzeilen, Zähler, Labels, Tags,
  Ordnungsziffern, Token-Namen. Die Hausschrift trägt Inhalt. Diese Trennung
  ersetzt einen großen Teil der Farbcodierung.
- **Fokusring ist Tinte, nicht Lime.** `outline-offset: 2px`. Auf dunklen Flächen
  die helle Variante. Der Offset legt den Ring auf die Nachbarfläche — dort
  prüfen, nicht am Element.
- **Hover-Signale trägt die Fläche, nicht die Schriftfarbe.** Lift, Rahmen,
  Untergrund. Farbwechsel am Text sind das schwächste Signal: sie treffen nur
  Text, wandern beim Themewechsel und kollidieren mit der Bedeutung des Akzents.
- **Akkordeons nur als zweite Detailebene**, nie als Primärstruktur für lange
  Listen.
- **Haarlinien statt Schatten.** Schatten nur, wo etwas wirklich schwebt.
- **WCAG 2.1 AA ist Mindeststandard**, kein Ziel. Jede Farbentscheidung wird gegen
  die *tatsächliche Nachbarfläche* gerechnet, nicht gegen den Seitenhintergrund.

### Noch nicht tokenisiert

Zwei Werte aus den Prinzipien haben **kein** Token und stehen nur hier:
`#047857` (grüne Schrift auf Hell) und `#06210a` (Text auf Lime-Fläche, wobei
das System dafür `--fnd-color-on-accent: #000000` führt). Wer sie verwendet,
kennzeichnet sie wie einen Platzhalter.

## Aufbau jedes Artefakts

```
1. Schriften (nur die benötigten, als data:-URI)
2. Token-Block (Tier 2 hell, dann Tier 2 dunkel) — aus tokens.css kopiert
3. Basis-Styles
4. Komponenten-Styles (nur Tier-2-Variablen)
5. Inhalt
6. Minimales JS für Zustände
```

Pflicht in jedem Artefakt:

- Hell/Dunkel umschaltbar über `data-theme` am Wurzelelement, zusätzlich
  `@media (prefers-color-scheme: dark)` als Vorgabe — der Umschalter muss in
  beide Richtungen gewinnen
- `@media (prefers-reduced-motion: reduce)` — Bewegung entfernen, farbliche
  Signale behalten
- `@media (forced-colors: active)` — Tönungen fallen weg, Kante und Beschriftung
  müssen die Bedeutung allein tragen
- Sprache Deutsch (`lang="de"` setzt die Umgebung)
- Alle Zustände tastaturbedienbar, `:focus-visible` sichtbar
- Breite Inhalte (Tabellen, Code, Diagramme) scrollen in einem eigenen
  `overflow-x`-Container; die Seite selbst nie waagerecht

**Kein `<!doctype>`, `<html>`, `<head>` oder `<body>`** — das Gerüst wird beim
Veröffentlichen darumgelegt. Das Artefakt enthält nur Seiteninhalt.

`assets/artifact-template.html` enthält das Gerüst. Von dort starten.

## Platzhalter kennzeichnen

```css
/* ⚠ PLATZHALTER — nicht aus tokens.css. Bitte echten Wert nachliefern. */
--irgendein-wert: system-ui;
```

und oben im Artefakt ein Hinweisbalken:

```html
<p class="placeholder-warning">
  ⚠ Dieses Artefakt enthält 2 geschätzte Werte: --x, --y.
  Die Darstellung ist insoweit nicht verbindlich.
</p>
```

## Referenzdateien

| Datei | Wann lesen |
|---|---|
| `references/tokens.css` | **Immer**, vor jedem Artefakt |
| `references/components.md` | Wenn eine bekannte Komponente gebaut wird |
| `references/a11y-checklist.md` | Vor dem Abschicken jeder Antwort mit visuellem Output |
| `assets/artifact-template.html` | Als Startpunkt für jedes neue Artefakt |
| `assets/fonts/*.base64.txt` | Nur wenn die Schrift selbst zur Debatte steht |

## Wenn mehr Tiefe nötig ist

`tokens.css` deckt die Foundation ab, nicht die rund 2400 komponentenspezifischen
`--nc-*` Tokens. Steht ein MCP-Dateizugriff auf `~/Sites/WEBSITE26` und
`~/Sites/DRUPAL11` bereit, dort direkt nachlesen:

- `scss/scss/00-settings/_component-tokens.scss` — alle `--nc-*` Tokens
- `scss/scss/0[4-7]-*/` — die Komponenten-Quellen
- `web/themes/custom/neo_fe/css/neo-overrides.css` — **lädt zuletzt** und kann
  DS-Regeln still aushebeln. Wer wissen will, was auf der Website tatsächlich
  ankommt, muss hier gegenprüfen.

## Bekannter Defekt

`--fnd-elevation-*` **nicht ungeprüft übernehmen.** Im Design System stimmen die
Werte. Auf der Website nicht: die vom Theme-Konfigurator erzeugte
`theme-overrides.css` setzt `--fnd-elevation-base` auf das Wort `xs` statt auf
einen Schattenwert und lädt nach `styles.css`. Bis das behoben ist im Artefakt
die `--fnd-shadow-*` Werte direkt verwenden.

## Aktualität

`references/tokens.css` trägt oben `@source` und `@updated`. Ist das Datum älter
als 30 Tage, am Ende der Antwort einmal ergänzen:

> Die hinterlegten Tokens sind vom {Datum}. Falls sich seitdem etwas geändert
> hat, im Design System `npm run skill:build` laufen lassen und den Skill neu
> hochladen.

Nicht ungefragt nachfragen, nicht blockieren — nur einmal am Ende erwähnen.

## Was dieser Skill nicht tut

- Er ersetzt keine Designentscheidung. Vorschläge bleiben Vorschläge.
- Er erzwingt keinen Stil für Nicht-NEO-Kontexte.
