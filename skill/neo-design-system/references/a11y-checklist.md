# Barrierefreiheit — Prüfliste für NEO-Artefakte

Ziel ist **WCAG 2.1 AA**. Diese Liste ist HANDGEPFLEGT und wird vom Generator
nicht überschrieben — sie enthält Urteile, keine Daten.

Die Punkte stammen aus Fehlern, die im NEO-Bestand tatsächlich aufgetreten
sind. Jeder Abschnitt nennt den Fall, damit erkennbar ist, warum die Regel da
steht.

---

## Vor dem Bauen

- [ ] **Beide Themes bedienen.** `prefers-color-scheme` als Vorgabe **und**
      `:root[data-theme="…"]` als Override — der Umschalter muss in beide
      Richtungen gewinnen.
      *Fall: Die Monochrom-Darstellung der Logo Wall war nur für das helle
      Theme gedacht. Im dunklen lag sie bei 1,08:1 und war unsichtbar — das
      fiel erst beim Nachmessen auf, nie beim Ansehen.*

- [ ] **Alle Werte in `rem`**, keine `px` für Schrift (1.4.4).
      Die fluide Skala des DS ist bereits rem-basiert; bei eigenen `clamp()`
      denselben Aufbau verwenden.

---

## Kontrast (1.4.3 / 1.4.11)

- [ ] Fließtext ≥ **4,5:1**, große Schrift (≥ 24 px oder ≥ 18,66 px fett)
      ≥ **3:1**.
- [ ] Nicht-Text: Rahmen, Icons, Zustandsanzeigen ≥ **3:1**.
- [ ] **Für ALLE Objekte prüfen**, nicht nur für Text: Badge, Icon, Chip,
      Trennlinie, Fokusring.
- [ ] **In beiden Themes** prüfen.
- [ ] Bei überlagerten Flächen den **tatsächlichen** Hintergrund rechnen, nicht
      den nominellen.
      *Fall: Der Bento-Glow liegt mit `mix-blend-mode: soft-light` über der
      Kartenfläche. Erst die Nachrechnung des Blends zeigte den wirklichen
      Untergrund — im dunklen Theme blieben nur 4,69:1 statt der nominellen
      5,85:1.*
- [ ] Logos sind vom Kontrastgebot **ausgenommen** (Logotypes) — trotzdem
      lesbar halten.

---

## Fokus (2.4.7 / 2.4.11)

- [ ] Jedes bedienbare Element hat einen **sichtbaren** Fokusring.
- [ ] `outline-offset` setzen, damit der Ring nicht auf der Kante klebt.
- [ ] `:focus-visible` statt `:focus` — sonst erscheint der Ring auch bei
      Mausklick.
- [ ] **Kein doppelter Ring.** Sitzt der Ring an der Gruppe (`:focus-within`),
      muss das innere Feld seinen eigenen abschalten.
      *Fall: Das Suchfeld zeigte zwei Ringe. Ursache war eine generische
      `input:focus-visible`-Regel im DS. Programmatisches `.focus()` löst
      `:focus-visible` NICHT aus — der Fehler war nur mit einem echten
      Tastendruck reproduzierbar.*
- [ ] Bei zusammengesetzten Bedienobjekten: ist die Wurzel nicht fokussierbar,
      braucht es `:has(… :focus-visible)`, sonst bleibt die Tastatur ohne
      Rückmeldung.

---

## Klickflächen (2.5.8)

- [ ] Mindestens **44 × 44 px**, auch wenn das Icon kleiner ist.
- [ ] Bei Listenzeilen die **ganze Zeile** klickbar machen, nicht nur den Text.
- [ ] Sichtbarer Hover-Zustand.

---

## Formulare (3.3.2)

- [ ] Jedes Feld hat ein **echtes `<label>`**, notfalls visuell versteckt.
      Ein `placeholder` ist kein Label: er verschwindet beim Tippen und wird
      von Screenreadern uneinheitlich behandelt.
- [ ] Aktionen sind beschriftet, nicht nur Symbole.
- [ ] Löschen und Schließen sind **getrennte** Aktionen, wenn beide existieren.

---

## Bewegung

- [ ] `@media (prefers-reduced-motion: reduce)` behandeln.
- [ ] Bewegung entfernen, **farbliche Signale behalten** — sonst verliert das
      Element bei reduzierter Bewegung seine Rückmeldung ganz.
- [ ] Endlos laufende Animationen (Marquee) pausierbar machen.

---

## Semantik

- [ ] Überschriftenebenen nicht überspringen; `<h1>` nur einmal.
- [ ] Dekorative Grafik `aria-hidden="true"` **und** `focusable="false"`
      (letzteres wegen SVG im IE-Erbe und einiger Screenreader).
- [ ] Sinntragende Grafik braucht `alt`; leeres `alt=""` nur bei Dekoration.
- [ ] Reihenfolge im DOM = Lesereihenfolge. Nicht per CSS umsortieren.

---

## Fallstricke, die im NEO-Bestand mehrfach zugeschlagen haben

**Die Kaskade.** `neo-overrides.css` lädt **zuletzt**. Eine Änderung an der
DS-Quelle kann dort still ausgehebelt werden. Bei gleicher Spezifität gewinnt
die spätere Regel — das hat u. a. den Hover-Rahmen der Auswahlkarte falsch
eingefärbt.

**Eigene Deklaration schlägt Vererbung.** Immer, unabhängig von Spezifität.
Ein `<p>` in einem Wrapper mit `font-size` bekommt trotzdem die Größe aus einer
generischen `p`-Regel. Genau daran ist der Hero-Lead gescheitert.

**`overflow-wrap: break-word` reicht nicht** gegen Überläufe im Raster: nur
`anywhere` geht in die **min-content**-Breite ein. Mit `break-word` bricht das
Wort zwar um, das Element fordert aber weiter die volle Wortbreite an.

**`var()` in einer Custom Property löst dort auf, wo sie DEKLARIERT ist**, nicht
wo sie benutzt wird. Ein Token, das auf ein nur lokal definiertes Token zeigt,
wird im `:root` ungültig.

---

## Nachweis

Behauptungen zu Kontrast oder Größe gehören **gemessen**, nicht geschätzt.
Im Artefakt genügt eine kleine Canvas-Rechnung; sie kann Blend-Modi und
`clamp()` mit auflösen. Ein Artefakt, das seine eigenen Kontrastwerte
ausweist, ist deutlich mehr wert als eines, das sie nur behauptet.
