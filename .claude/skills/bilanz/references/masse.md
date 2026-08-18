# Maße für Umfang und Güte

## Warum nicht nach Zeilen

Die ursprüngliche Fassung maß Umfang in Prompts: „Small: unter 5 Prompts".
Das misst, wie mühsam etwas war, nicht wie viel es einbrachte — und mühsam
ist oft genau das, was man nicht wiederholen will.

Diese Fassung misst in **Wirkung**.

| Stufe | Woran erkennbar |
|---|---|
| **klein** | Wirkt an einer Stelle. Ein Wert, eine Regel, eine Datei. Rückweg: ein `git revert`. |
| **mittel** | Wirkt in einer Domäne. Eine Komponente über die ganze Strecke, ein neues Prüfwerkzeug. Rückweg: überlegt, aber klar. |
| **groß** | Wirkt über Domänen hinweg. Ein Token-Umbau, eine Ebenenverschiebung, ein neuer Blocktyp mit Feldern. Rückweg: nur über einen Referenzstand. |

Die Probe: **Wie viele Domänen berührt es, und wie käme man zurück?** Beides
steht in der Bilanz, beides ist ohne Erinnerung ablesbar.

## Die vier tragenden Zahlen

### Gesamtstrecke

```
vollständig / berührt
```

Von den in diesem Zeitraum berührten SCSS-Komponenten: wie viele haben
Recipe **und** Story **und** Konfig-App-Eintrag.

Misst deine eigene Regel am Stand statt an der Absicht. **Unter 70 % heißt:
Es wird schneller gebaut als angeschlossen.** Der Rückstand fällt nicht sofort
auf, weil die Website funktioniert — er fällt auf, wenn ein Kunde etwas
einstellen will, was niemand eingetragen hat.

### Nacharbeitsquote

```
Commits mit Korrektur-Betreff / alle Commits
```

Daneben, absichtlich getrennt: **Commits, die Dateien der letzten 14 Tage
erneut anfassen.** Beides zusammen unterscheidet zwei sehr verschiedene Dinge —
planvolles Weiterbauen an frischer Arbeit von Reparatur an frischer Arbeit.

Richtwerte aus diesem Projekt: unter 15 % unauffällig, 15–25 % normal bei
schnellen Umbauten, über 30 % heißt, dass Prüfschranken zu spät greifen.

### Bauteile ohne Fundstelle

```
Wurzelklassen ohne Vorkommen im letzten Referenzstand / alle Wurzelklassen
```

**Kein Fehlermaß.** Storybook-Bauteile, Zukunftsvorrat und Kundenvarianten
stehen hier zu Recht. Interessant ist die **Richtung**: Wächst die Zahl
schneller als die Zahl der Komponenten, entsteht Vorrat statt Bedarf.

### Verbrauch je Ergebnis

```
Verbrauch / Commits        Verbrauch / berührte Komponenten
```

Aussagekräftiger als der absolute Betrag, weil er über Wochen vergleichbar
bleibt. Ein Ausschlag nach oben hat meist eine von drei Ursachen: eine lange
Suche ohne Fund, ein Umweg mit Rückbau, oder eine große Erhebung — und alle
drei stehen im Verlauf.

## Was ausdrücklich NICHT gemessen wird

- **Zeilen als Leistung.** `+27.944` in der Konfig-App war ein Build-Artefakt,
  keine Arbeit. Zeilen stehen im Bericht, aber nie in einer Kennzahl.
- **Commits als Fleiß.** Wer klein committet, sieht fleißiger aus. Das ist
  eine Gewohnheit, kein Ergebnis.
- **Geschwindigkeit.** Ein schnell durchgezogener Farbumbau ohne Kontrastprüfung
  ist teurer als ein langsamer mit.
