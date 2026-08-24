# Echtes Bauteil-Markup

Hier liegt je Komponente eine Datei `<komponente>.html` mit dem Markup, das
Storybook zeigen soll.

## Warum hier und nicht im Recipe

Der Generator liest auch `specimens[].markup` aus dem Recipe-JSON — das
funktioniert und bleibt gültig. Für längeres Markup ist JSON aber der falsche
Ort: maskierte Anführungszeichen, `\n` statt Zeilenumbrüchen, und ein Diff, den
niemand liest. Am 21.08.2026 trug **kein einziges** der 131 Recipes Markup;
vermutlich genau deswegen.

Eine `.html`-Datei ist lesbar, im Diff prüfbar und bekommt im Editor
Syntaxfarbe.

## Aufbau

Mehrere Fassungen einer Komponente werden mit einem Kommentar getrennt. Der
Name hinter `@fassung:` wird zur Story-Überschrift:

```html
<!-- @fassung: Standard -->
<div class="nc-accordion nc-accordion--flush">
  <details class="nc-accordion__item" open>
    …
  </details>
</div>

<!-- @fassung: Als Karten -->
<div class="nc-accordion nc-accordion--separated">
  …
</div>
```

Ohne Trenner gilt die ganze Datei als eine Fassung namens „Standard".

## Was hier NICHT hingehört

Kein Markup, das nur plausibel aussieht. Der Zweck dieser Dateien ist, dass man
sich auf sie verlassen kann — eine Ableitung aus Klassennamen kann jeder
Generator, und genau die hat das Problem verursacht.

## Woher das Markup kommt

```
npm run ernte:markup                      von der Website
npm run ernte:markup -- --quelle=doku     von den Doku-Seiten
npm run ernte:markup -- hero              nur ein Bauteil
npm run lint:ernte                        Bericht: wo fehlt noch was
npm run lint:klassen                      trifft das Markup das Bauteil?
```

`scripts/ernte-markup.mjs` sucht jeden Wurzelselektor aus den Recipes auf allen
Seiten der gewählten Quelle und nimmt die reichhaltigste Fundstelle. Es gibt
**keine gepflegte Liste** „Bauteil X steht auf Seite Y" — die wäre beim ersten
Seitenumbau still veraltet.

**Zwei Quellen, dieselbe Technik.** Die Website ist die bessere: dort stehen
echte Inhalte. Für alles, was auf keiner Seite vorkommt, bleiben die
Doku-Seiten — sie rendern ihre Beispiele live, teils per JS. Reihenfolge:
erst die Website, dann die Doku; die füllt dann nur Lücken.

Vor dem Ernten müssen die Seitenlisten stehen:

```
cd ~/Sites/DRUPAL11
ddev drush php:script scripts/neo-seitenliste.php > ~/Sites/WEBSITE26/data/markup/.seiten.txt

cd ~/Sites/WEBSITE26                 # Doku-Server muss auf :3000 laufen
ls docs/*-docs.html | sed 's|docs/|/docs/|' > data/markup/.doku-seiten.txt
```

### Handarbeit schützen

Eine Datei, die in den ersten Zeilen `@quelle: von Hand` trägt, fasst das
Skript nicht an. So bleibt Markup erhalten, das bewusst gestellt wurde, weil
das Bauteil auf keiner Seite steht (`device.html`).

### Die Musterseite

Manche Bauteile stehen auf keiner redaktionellen Seite — Hero T-Mobile,
Bento-Grid, App-Store. Für die gibt es `/musterseite-bauteile` (Node 80,
angelegt von `scripts/neo-musterseite.php` in DRUPAL11). Sie steht in keinem
Menü und ist nicht für Besucher gedacht.

### Was das Skript beim Ernten tut

- **Durchscrollen vor dem Abgriff.** Die Timeline setzt `.is-visible` erst,
  wenn ein Eintrag ins Bild kommt; vorher steht sein Inhalt auf `opacity: 0`.
  Wer ohne Scrollen abgreift, erntet ein leeres Gerüst.
- **Verwaltungsdaten entfernen.** Kontextmenüs, Cache-Marken,
  Bearbeitungs-Kennungen — in Storybook sinnlos und im Weg.
- **Bildwege ersetzen.** `/sites/default/files/…` gibt es in Storybook nicht.
- **Das erste `<details>` aufklappen**, damit der Inhaltsbereich sichtbar ist.
- **Zu grosses ausdünnen.** Über 24 000 Zeichen sieht man nicht mehr das
  Bauteil, sondern eine Datenmenge — die Vergleichstabelle der Editionen bringt
  29 kB. Ausgedünnt wird die grösste Gruppe gleichartiger Geschwister: vier
  Zeilen zeigen denselben Aufbau wie vierzig. **Dass etwas fehlt, steht als
  Kommentar im Markup** (`<!-- gekuerzt: N weitere gleichartige Eintraege -->`).
  Stillschweigend kürzen wäre schlimmer als wegwerfen — die Story sähe
  vollständig aus. Bleibt sie auch ausgedünnt zu gross, wird sie verworfen und
  im Bericht genannt.

Ein Lauf **ersetzt nur, was er verbessert.** Die Punktzahl steht als
`@punkte` in der Datei; eine schlechtere Fundstelle lässt die bessere stehen.
Die Doku-Seiten liefern für manches Bauteil eine dürftige Fassung, die die
Website deutlich besser zeigt — die Feature List kam aus der Preistabelle mit
11 Punkten, von `/produkte/app` mit 63. Mit `--erzwingen` schreibt der Lauf
trotzdem.

## Geerntet heisst nicht gut

Ein Block, bei dem der Redakteur die Hälfte der Felder leer gelassen hat,
liefert ein Zitat ohne Urheber oder eine Text-Medien-Sektion ohne Medium —
echt, aber als Story eine Ruine. `npm run lint:ernte` stellt jede Datei ihrer
Anatomie im Recipe gegenüber und unterscheidet zwei Fälle:

| Befund | Bedeutung |
|---|---|
| **Inhalt leer** | Die Klasse steht in `styles.css`, aber in keinem Markup — auf der Website ist das Feld nicht gefüllt. |
| **Recipe falsch** | Die Klasse steht in keinem Stylesheet — das Recipe beschreibt einen Bereich, den es nie gab. |

Die Prüfung blockiert nichts. Sie sagt nur, welche Story dünn ist und warum.

## Trifft das Markup das Bauteil überhaupt?

`npm run lint:klassen` stellt **jede** Klasse im Markup dem kompilierten
`styles.css` gegenüber. Eine Klasse, die es dort nicht gibt, gestaltet nichts —
sie sieht in der Story nur so aus, als tue sie es. Genau so sind die veralteten
Doku-Seiten entstanden und jahrelang unbemerkt geblieben: niemand hat je
gegengeprüft.

Diese Prüfung läuft in `npm test`. Sie friert den Bestand ein und lässt ihn nur
sinken — ein Test, der ab dem ersten Tag rot steht, wird abgeschaltet.

**Die Schwelle steht je Bauteil, nicht als Gesamtzahl.** Zuerst war es eine
einzige Zahl. Als der Bestand von 42 auf 101 Dateien wuchs, war sie wertlos:
„70 gegen 55" sagt nicht, ob etwas schlechter wurde oder nur mehr geworden ist.
Schlimmer — eine Gesamtzahl verrechnet: ein behobener Befund hätte stillschweigend
Raum für einen neuen geschaffen. Je Bauteil kann ein neues kein anderes decken.

**Die Schwelle wird nicht angehoben.** Ein Befund heisst: entweder die Klasse im
Markup korrigieren oder das Bauteil im Stylesheet ergänzen. Am 24.08.2026 stehen
64 Klassen in 30 Bauteilen offen — Klassen, die das Drupal-Theme oder eine
Doku-Seite schreibt und das Design System nicht kennt. Sie stehen im BACKLOG
von DRUPAL11.

## Neue Bauteile kommen mit Markup — oder gar nicht

`npm run aufnehmen -- nc-<bauteil> --anwenden` nimmt ein Bauteil aus
`neo-overrides.css` ins Design System auf. Der **letzte** Schritt, das Entfernen
der Override-Regeln, läuft erst, wenn `data/markup/<name>.html` existiert.
Vorher bricht das Skript ab und nennt den Befehl, mit dem das Markup zu holen
ist.

Die Reihenfolge ist kein Zufall:

1. SCSS, Tokens, Konfigurator-Eintrag — ergänzend, jederzeit wiederholbar
2. **Recipe-Entwurf** — ohne ihn kennt die Ernte den Wurzelselektor nicht und
   findet das Bauteil gar nicht
3. Ernte oder Handarbeit
4. Override-Regeln entfernen — der einzige unumkehrbare Schritt

Bis Schritt 4 ist nichts verloren, wenn man abbricht. Deshalb steht die Sperre
davor und nicht am Anfang.

**Warum überhaupt eine Sperre.** Am 21.08.2026 trugen alle 131 Stories Markup,
das aus Klassennamen abgeleitet war — es sah nach Bauteil aus und war keines.
Vier Phasen Arbeit haben das aufgeholt. Ohne Sperre fällt es beim nächsten
Bauteil wieder auf, und niemand merkt es: Eine Story mit Platzhalter sieht
genauso aus wie eine fertige.

## Bilder

Beispielbilder kommen aus `assets/muster/` — Storybook liefert `assets/` unter
`/assets/` aus (siehe `.storybook/main.js`).

**Nicht von fremden Diensten laden.** Eine Story, die `placehold.co` braucht,
ist ohne Internet leer, und im Firmennetz womoeglich immer. Beim Ernten von der
Website (Phase 2) zeigen die Bildwege ausserdem auf
`/sites/default/files/…` — die gibt es in Storybook nicht und sie muessen
ersetzt werden.
