# Backlog

Was beim Arbeiten auffällt und nicht in den laufenden Commit gehört. Ein Eintrag nennt Fundort, Befund und den Weg, nicht nur den Wunsch. Erledigtes wird gestrichen, nicht abgehakt.

## Foliensystem

- **Feste Kicker im Bestand des Masters** (`scripts/pptx-vorlage.mjs`, gefunden in Phase 4 am 04.09.2026): T1_TITEL_TIEF, T3_TITEL_BILD, T4_TITEL_KUNDE, A1_ABSCHNITT_TIEF, A2_ABSCHNITT_PAPIER und K1_KPI_EINE tragen den Kicker als festes Textobjekt im Layout. Es steht auf jeder Folie, auch unter dem Kicker, den das Deck setzt. Weg: in Platzhalter umbauen wie X4 (`kickerPlatz`), danach die Beispieldecks prüfen, ob doppelte Kicker verschwunden sind.
