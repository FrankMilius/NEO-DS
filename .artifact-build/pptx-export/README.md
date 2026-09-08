# Figma Slides → PowerPoint (Hybrid-Export)

Stand 08.09.2026. Datei hmqtDCHimfqmwXAob7ZsDN, alle Reihen außer „Alt · …“.

Ablauf:
1. `use_figma`: je Folie alle Textknoten auslesen (Position, Größe, Ausrichtung, Laufweite, Zeilenhöhe, Rotation, Segmente mit Schrift/Größe/Farbe/Versalien),
   dann `visible=false` setzen und mit `setSharedPluginData('neo.pptx','hidden','1')` markieren.
   U+2028/U+2029 in Texten mit `String.fromCharCode(8232)` ersetzen (Escape-Sequenzen im Code werden vom Transport dekodiert).
   Nutzlast je Aufruf unter ca. 4,3 KB halten, Ausgabe sofort in Datei sichern.
2. `download_assets` (png, scale 1) je Folie → Bildebene ohne Text.
3. `use_figma`: alle markierten Texte wieder sichtbar schalten.
4. `build.py all.json` → PPTX: Hintergrundfarbe, Bildebene (entfällt bei einfarbigen Folien), Textboxen (1 px = 0,5 pt),
   Laufweite über `spc`, Versalien über `cap="all"`, Zeilenhöhe exakt in Punkt, Abschnitte über `p14:sectionLst`, Notiz mit Reihe und Figma-ID.

Schriften müssen installiert sein: Space Grotesk (Bold/Regular/Medium), Manrope (Regular/Bold), JetBrains Mono (Regular/Bold).
