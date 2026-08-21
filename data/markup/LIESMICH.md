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
npm run ernte:markup            alle Bauteile neu ernten
npm run ernte:markup -- hero    nur eines
npm run lint:ernte              Bericht: wo fehlt noch was
```

`scripts/ernte-markup.mjs` sucht jeden Wurzelselektor aus den Recipes auf allen
veröffentlichten Seiten der laufenden Website und nimmt die reichhaltigste
Fundstelle. Es gibt **keine gepflegte Liste** „Bauteil X steht auf Seite Y" —
die wäre beim ersten Seitenumbau still veraltet.

Vor dem Ernten muss die Seitenliste stehen:

```
cd ~/Sites/DRUPAL11
ddev drush php:script scripts/neo-seitenliste.php > ~/Sites/WEBSITE26/data/markup/.seiten.txt
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
- **Zu grosses verwerfen.** Über 24 000 Zeichen ist nicht mehr das Bauteil zu
  sehen, sondern eine Datenmenge (Vergleichstabellen).

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

## Bilder

Beispielbilder kommen aus `assets/muster/` — Storybook liefert `assets/` unter
`/assets/` aus (siehe `.storybook/main.js`).

**Nicht von fremden Diensten laden.** Eine Story, die `placehold.co` braucht,
ist ohne Internet leer, und im Firmennetz womoeglich immer. Beim Ernten von der
Website (Phase 2) zeigen die Bildwege ausserdem auf
`/sites/default/files/…` — die gibt es in Storybook nicht und sie muessen
ersetzt werden.
