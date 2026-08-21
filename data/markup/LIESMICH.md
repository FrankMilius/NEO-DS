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

Woher es stattdessen kommt, steht im Plan: geerntet von der laufenden Website
(Blockvorlagen im Theme), übernommen aus geprüften Doku-Beispielen, oder von
Hand nach dem BEM-Kommentar im Kopf der SCSS-Datei.

## Bilder

Beispielbilder kommen aus `assets/muster/` — Storybook liefert `assets/` unter
`/assets/` aus (siehe `.storybook/main.js`).

**Nicht von fremden Diensten laden.** Eine Story, die `placehold.co` braucht,
ist ohne Internet leer, und im Firmennetz womoeglich immer. Beim Ernten von der
Website (Phase 2) zeigen die Bildwege ausserdem auf
`/sites/default/files/…` — die gibt es in Storybook nicht und sie muessen
ersetzt werden.
