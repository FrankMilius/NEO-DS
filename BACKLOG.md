# Backlog

Was beim Arbeiten auffällt und nicht in den laufenden Commit gehört. Ein Eintrag nennt Fundort, Befund und den Weg, nicht nur den Wunsch. Erledigtes wird gestrichen, nicht abgehakt.

## Foliensystem

- **Sichtprüfung der Master in PowerPoint** (`dist/pptx/NEO-Master-*.pptx`, offen seit Phase 9 am 04.09.2026): Alle Maße sind gerechnet und im XML geprüft, keines gesehen. Zu prüfen: Chevrons in L4, gedrehte Achsenbeschriftung in L6, Speichenlinien mit `flipV` in C6, Plot-Layouts der nativen Diagramme in D3 bis D10 und K4. Ein Versuch, per AppleScript ein PDF aus PowerPoint zu exportieren, endete mit Fehler −9074, vermutlich ein offener Dialog. Weg: von Hand öffnen, Layoutmenü durchgehen, Befunde als Zeilen hier eintragen.
- **Speichern als `.potx`** (Handarbeit): Beide Master in PowerPoint öffnen, „Speichern unter" → PowerPoint-Vorlage. pptxgenjs schreibt das Format nicht.
- **Beispieldecks in der Vortragsstufe** (`scripts/pptx-beispiel.mjs`, `PPTX_STUFE=vortrag`): Die Renderer setzen feste Schriftgrade (13 bis 20 pt) und rechnen mit der Versand-Inhaltszone. In der Vortragsstufe (40 mm Titelzone, 22 pt) ist nicht geprüft, ob Zeilen, Balken und Tabellen noch in die Zone passen. Weg: ein Deck mit `PPTX_STUFE=vortrag` bauen, Überläufe zählen, Renderer auf `textPt` aus `geometrie()` umstellen.
- **Bilder, Logos, Bildschirmfotos**: Alle Bildplätze sind Platzhalter (B1 bis B7, S1 bis S7, G1, M1, M2, LG1, T3, V1). Weg: freigegebene Dateien einsetzen, Logos einfarbig in Graphit 700, Bildschirmfotos aus dem Produkt mit plausiblen Testdaten.

- **Feste Kicker im Bestand des Masters** (`scripts/pptx-vorlage.mjs`, gefunden in Phase 4 am 04.09.2026): T1_TITEL_TIEF, T3_TITEL_BILD, T4_TITEL_KUNDE, A1_ABSCHNITT_TIEF, A2_ABSCHNITT_PAPIER und K1_KPI_EINE tragen den Kicker als festes Textobjekt im Layout. Es steht auf jeder Folie, auch unter dem Kicker, den das Deck setzt. Weg: in Platzhalter umbauen wie X4 (`kickerPlatz`), danach die Beispieldecks prüfen, ob doppelte Kicker verschwunden sind.
