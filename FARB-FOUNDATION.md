# Farb-Foundation — Monochrom mit Akzent

Stand 13.08.2026. Ein Graphit-Grau trägt, Lime unterbricht. Cyan und Dunkelblau
haben ihre semantischen Rollen abgegeben und bestehen nur noch als Primitives.

## Die vier Achsen (Governance — WICHTIG)

Wer sie vermischt, baut genau die Sammlung wieder auf, die vorher unbrauchbar
war. Alle vier sind **unabhängig** voneinander:

| Achse | Beantwortet | Token | NICHT dafür |
|---|---|---|---|
| **Fläche** | Worauf liege ich? | `--surface-stage/-card`, `--surface-01…03` | Zustände, Erhebung |
| **Erhebung** | Wie hoch schwebe ich darüber? | `--elevation-0…3` | Flächenwechsel |
| **Akzent** | Ist das *die* Handlung? | `--accent-*` | alles Anklickbare |
| **Bedienung** | Kann man das anklicken? | `--interactive-*` | Hervorhebung |

**Regel:** Ein Hover-Zustand ändert die **Erhebung**, nicht die Fläche. Ein
sekundärer Knopf ist **interaktiv**, nicht **akzentuiert**.

## Warum OKLCH

In HSL ist ein Gelb bei L 50 % deutlich heller als ein Blau bei L 50 %. Vier
Neutralleitern mit verschiedenen Farbtönen wären damit nicht vergleichbar.

Alle Leitern hier sind in OKLCH gerechnet und auf sRGB begrenzt — wobei die
**Buntheit verkleinert statt abgeschnitten** wird, sonst verschiebt sich der
Farbton beim Beschneiden.

## Vier austauschbare Neutralleitern

| Leiter | Farbton | Vorgesehen für |
|---|---|---|
| **Graphit** | 143° | führend, alle Produkte |
| Blaustichig | 248° | kühl, sachlich — Support, Statusseiten |
| Beigestichig | 80° | warm, einladend — Kurse, Weiterbildung |
| Salbei | 143° | sichtbar getönt — Foren, Gemeinschaft |

Alle vier haben **stufenweise dieselben Helligkeiten**. Kontrast gegen Weiß:

```
 50  1,04    100  1,12    200  1,25    300  1,49
400  2,14    500  3,11    600  4,66    700  6,77
800  9,98    900 14,27    950 17,85
```

Ein Bereich, der auf Beige umschaltet, behält damit **sämtliche Kontrastwerte**.
Die Barrierefreiheit muss nicht neu geprüft werden.

```html
<body data-neutral="beige">
```

> **Das gilt nur, solange Bauteile die Stufennummer ansprechen**
> (`var(--fnd-neutral-700)`) und nicht den Hexwert. Ein einziger fest
> eingetragener Grauton bricht die Umschaltbarkeit für den ganzen Bereich.

### Warum Graphit und nicht Salbei

Radix Colors liefert sechs Grauleitern und empfiehlt, das Grau nach der Familie
der Akzentfarbe zu wählen — für grüne Akzente ist das Sage. Material 3 erzeugt
seine Neutralen aus der Ausgangsfarbe. IBM Carbon stellt Gray, Cool Gray und
Warm Gray gleichwertig bereit. Der gemeinsame Nenner: **Ein Grau ohne Haltung
wirkt nicht neutral, sondern unentschieden.**

Nach dieser Logik wäre Salbei richtig. Der Ausschlag gab, dass unser Akzent
außergewöhnlich bunt ist (Buntheit 0,25 — Radix' Sage ist für etwa halb so
kräftige Akzente gedacht). Ist die Oberfläche leicht grün und der Akzent stärker
grün, liest sich der Akzent als *mehr vom Gleichen* statt als Unterbrechung.
Graphit trägt denselben Farbton bei einem Drittel der Buntheit.

## Der Akzent hat eine harte Grenze

Stufe 500 ist der unveränderte Markenwert `#37e93d`. **Die Leiter zerfällt
zwischen 700 und 800:**

| Stufe | Wert | auf Weiß | schwarz darauf | Rolle |
|---|---|---|---|---|
| 500 | `#37e93d` | 1,63 | 12,89 | `--accent-surface` |
| 600 | `#00c01a` | 2,45 | 8,55 | `--accent-surface-hover` hell |
| 700 | `#009612` | 3,91 | 5,37 | `--accent-line`, `-active` hell |
| 800 | `#006f0a` | 6,41 | 3,28 | `--accent-text` hell |

Oberhalb taugt Lime nur als **Fläche**, unterhalb nur als **Schrift**. Das ist
keine Empfehlung, sondern Arithmetik.

**Der Akzent ist deshalb nie Schrift auf hellem Grund.** Textlinks tragen die
Textfarbe und einen Unterstrich in `--accent-underline`.

### Unterstrich und Kante — zwei Rollen

| Token | Wert | Kontrast | Wofür |
|---|---|---|---|
| `--accent-line` | Stufe 700 | 3,91:1 | **Rahmen.** Macht ein Element erkennbar und ist das einzige Zeichen dafür — WCAG 1.4.11 verlangt hier 3:1. |
| `--accent-underline` | Stufe 500 | 1,63:1 | **Unterstrich unter Schrift.** Sein Signal ist, *dass* er da ist; den Kontrast trägt die Schrift darüber. |

Wer die beiden zusammenlegt, muss sich zwischen richtig und schön entscheiden.
Getrennt kann beides stimmen.

Die Maße stehen in `--fnd-underline-offset` (4px) und
`--fnd-underline-thickness` (2px) — in `00-settings/_typography.scss`, weil ein
Unterstrich eine Leseeigenschaft ist und kein Fokusmerkmal. 4px statt der
früheren 3: Bei einer 2px starken Linie berührte der Strich in kleineren
Graden die Unterlängen, und `text-decoration-skip-ink` schnitt ihn dort auf.

Dieselben Token tragen die **Kante in Navigationslisten** — dort erscheint sie
nur bei Überfahren, Fokus und beim aktuellen Ast, nie dauerhaft. Damit sitzen
Fließtext-Unterstrich und Navigationskante auf derselben Höhe.

Im hellen Thema wird der Akzent beim Überfahren **dunkler**, im dunklen
**heller** — die Bewegung geht immer vom Grund weg.

## Erfolg ist nicht grün

Bei Rot-Grün-Sehschwäche (Deuteranopie, rund 8 % der Männer) liegt ein
Erfolgsgrün nach Simulation **0,4 Grad** vom Markenlime entfernt; beide werden
zu demselben Gelb. Petrol `#00717a` liegt 175 Grad entfernt.

> Eine Marke, deren Zeichen grün ist, kann Grün nicht nebenbei als Systemfarbe
> verbrauchen.

Simuliert nach Viénot, Brettel und Mollon (1999) auf linearem RGB.

## Zwei Rahmenrollen

WCAG 1.4.11 verlangt 3:1 **nur** für Rahmen, die ein Bedienelement erkennbar
machen. Eine dekorative Trennlinie ist ausgenommen. Mit einem einzigen Token
wird entweder die Trennlinie unnötig hart oder das Eingabefeld unzulässig blass.

| Token | hell | dunkel | Wofür |
|---|---|---|---|
| `--border-subtle` | 200 | 800 | gliedert, darf blass sein |
| `--border-control` | 500 (3,11) | 600 (3,83) | Eingabefeld, Auswahl |
| `--border-emphasis` | 950 | 50 | Hervorhebung |

**Prüfregel:** Alles, was man anklicken oder ausfüllen kann, nimmt
`--border-control`. Alles andere `--border-subtle`.

## Fokus in zwei Schichten

Ein einfarbiger Ring müsste auf *jeder* Fläche 3:1 erreichen, auf der er
auftauchen kann — auch auf dem Akzentknopf. Das schafft keine einzelne Farbe.

```css
outline: 2px solid var(--focus-inner);   /* neutral-950 */
outline-offset: 2px;
box-shadow: 0 0 0 4px var(--focus-outer); /* neutral-50  */
```

Auf hellen Flächen trägt der innere Ring, auf dunklen der äußere. Auf sechs
Gründen gemessen — darunter der Akzentknopf und die dunkle Karte — immer
mindestens 10,9:1 auf einer der beiden Schichten.

Im Windows-Kontrastmodus wird `box-shadow` verworfen; dort greift ein
Systemring aus dem `forced-colors`-Block.

## Die Brücke

Die 71 `--fnd-color-*`-Token sind über mehr als hundert Bauteile verteilt. Sie
alle umzuschreiben wäre ein Umbau von Wochen ohne Gegenwert: Die Bauteile
sprechen bereits eine semantische Sprache, sie zeigte nur auf die falschen Werte.

`00-settings/_mono-bridge.scss` zeigt sie auf die richtigen. Ein Bauteil, das
`var(--fnd-color-text-primary)` benutzt, bekommt Graphit 950 — ohne angefasst zu
werden.

**Was die Brücke nicht leistet:** Sie kann keine Rolle erfinden, die es vorher
nicht gab. Diese vier müssen einzeln in die Bauteile nachgezogen werden:

- `--border-control` an Eingabefeldern
- `--accent-*` getrennt von `--interactive-*`
- `--elevation-*` als eigene Achse
- `--focus-inner/-outer`

> `theme-overrides.css` im Drupal-Theme lädt **nach** `styles.css`. Was dort
> steht, gewinnt. Die Datei muss deshalb frei von Farbtoken bleiben, sonst ist
> die Umstellung still wieder weg.

## Prüfen

```bash
npm run kontrast -- <referenzstand>                 # WCAG AA über alle Bauteile
npm run kontrast -- <neu> --gegen <alt>             # was ist NEU durchgefallen
npm run baseline:diff -- <a> <b>                    # hat sich etwas geändert
```

Bei einer gewollten Farbumstellung ändert sich alles — `baseline:diff` wird dann
sinnlos. `npm run kontrast` beantwortet stattdessen „ist es noch zulässig", und
das ist die einzige Frage, die dann zählt.

**Grenze des Verfahrens:** Liegt ein Element auf einer durchscheinenden Fläche
oder auf einem Bild, meldet der Browser `rgba(0,0,0,0)` als Hintergrund. Solche
Fälle werden getrennt als „ungeklärt" ausgewiesen und sind **nicht automatisch
in Ordnung**.

## Wo was steht

| Datei | Inhalt |
|---|---|
| `00-settings/_neutral-ramps.scss` | die fünf Leitern als Primitives |
| `00-settings/_mono-theme.scss` | semantische Rollen, `.neo-mono-*` |
| `00-settings/_mono-bridge.scss` | Alt-Token → neue Leitern, `:root`/`.neo-*-theme` |
| `03-elements/_mono-elements.scss` | Links, Fokus, vergessene Oberflächen, `forced-colors` |
| `data/design-tokens.json` | Konfig-App: `primitives`, `semantic.groups` |
| `stories/foundations/mono-foundation.stories.js` | Storybook |

## Offen

- **Akzentfarbe:** Lime bleibt vorerst. Fünf geprüfte Alternativen liegen vor;
  ein Wechsel ist eine Zeile in `_neutral-ramps.scss` plus der
  `brand.accent`-Eintrag in `design-tokens.json`.
- **`theme-color` und Reitersymbol** gehören ins Twig-Template des Themes, nicht
  ins CSS. Zwei Fassungen je Thema.
- **Nachziehen der vier neuen Rollen** in die Bauteile, beginnend bei den
  Formularen (`--border-control`).
