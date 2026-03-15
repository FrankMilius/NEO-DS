# Design System Master-Prompts

Diese Sammlung enthält validierte Prompts für die Generierung komplexer UI-Szenarien unter Verwendung der definierten Recipes. Diese Prompts sind darauf optimiert, die Interaktion und visuelle Konsistenz zwischen den verschiedenen Komponenten zu prüfen.

---

### navigation-orchestration
"Erstelle einen Website-Header basierend auf dem navigation-recipe. 
1. Integriere ein navigation-menu-recipe für die Hauptlinks. 
2. Füge eine 'Mega-Menu' Variante hinzu, die das item-recipe mit Icons und Beschreibungen innerhalb der Dropdowns nutzt. 
3. Der Header muss sticky sein und einen Backdrop-Blur Effekt nutzen. 
4. Implementiere eine 'Search' (compact) am rechten Ende des Headers neben einem 'Kontakt'-Button."

### data-table-recipe
"Erstelle eine 'Bestellübersicht' unter Verwendung des data-table-recipe. 
1. Aktiviere die 'selectable' und 'sortable' Features. 
2. Integriere eine 'toolbar' mit einer Search und Batch-Actions ('Export', 'Stornieren'). 
3. Nutze für die Spalte 'Status' das badge-recipe. 
4. Implementiere 'comfortable' Density für hohe Lesbarkeit. 
5. Die Tabelle muss einen 'sticky-header' haben und bei 0 Treffern den 'empty' State mit einer Illustration anzeigen."

### search-recipe
"Erstelle ein 'Global Search' Modul basierend auf dem search-recipe. 
1. Integriere ein Scoped-Dropdown links im Input-Feld (Optionen: 'Alle', 'Bilder', 'Videos', 'Dokumente'). 
2. Nutze die 'grouped' Inhaltsvariante, um Treffer nach Kategorie zu trennen (z.B. 'Dateien', 'Personen'). 
3. Implementiere den 'with-shortcut' Slot mit dem Hint 'Cmd+K'. 
4. Stelle sicher, dass Treffer innerhalb der Item-Labels mit dem highlight-Slot (<mark>) hervorgehoben werden."

### toolbar-recipe
"Erstelle eine 'Asset-Management' Toolbar basierend auf dem toolbar-recipe. 
1. Nutze die 'bordered' Variante. 
2. Integriere eine 'Search' (compact) auf der linken Seite. 
3. Verwende einen 'spacer', um Aktions-Buttons (Upload, Download) nach rechts zu schieben. 
4. Trenne die Ansichts-Optionen (Grid/List) durch eine 'Toggle-Group' und einen 'separator'. 
5. Stelle sicher, dass die gesamte Toolbar role='toolbar' und ein passendes aria-label trägt."

### accordion-recipe
"Erstelle eine 'Feature-Showcase' Sektion basierend auf dem accordion-recipe. 
1. Verwende die 'separated' Variante mit Schatten. 
2. Jedes Item muss im Content-Bereich ein Bild (Media-Slot) oberhalb des Textes enthalten. 
3. Implementiere das 'single' Behavior (auto-close). 
4. Achte darauf, dass das Toggle-Icon rechtsbündig ist und im 'open' State sanft rotiert."

### alert-dialog-recipe & alert-recipe
"Erstelle eine Seite 'Benutzer-Einstellungen'. 
1. Platziere im Inhaltsbereich einen statischen success-Alert ('Profil erfolgreich aktualisiert'). 
2. Füge einen Button 'Account löschen' hinzu, der einen destructive Alert-Dialog öffnet. 
3. Der Dialog muss den Titel 'Account permanent löschen?' tragen und den Fokus beim Öffnen auf den 'Abbrechen'-Button setzen, um Fehlklicks zu vermeiden. 
4. Achte darauf, dass die Danger-Farben in beiden Komponenten identisch gerendert werden."

### treeview-recipe
"Erstelle einen 'File-Explorer' basierend auf dem treeview-recipe. 
1. Nutze die 'bordered' Variante. 
2. Integriere Datei-Icons (via icon-slot) und Status-Badges. 
3. Implementiere Guide-Lines zwischen den Ebenen für bessere Lesbarkeit. 
4. Der 'selected' State muss visuell deutlich hervorgehoben sein (bg-primary-subtle + border-left accent). 
5. Stelle sicher, dass die Tastatur-Navigation (Pfeiltasten) funktionsfähig ist."

### breadcrumb-recipe
"Erstelle eine 'Produktdetail-Seite' unter Verwendung der shell-recipe. 
1. Platziere im Header-Bereich das breadcrumb-recipe. 
2. Konfiguriere den Pfad: 'Home > Elektronik > Kameras > DSLRs > [Produktname]'. 
3. Nutze die 'truncated' Variante, wobei 'Kameras' und 'DSLRs' im Ellipsis-Dropdown verschwinden. 
4. Verwende den 'chevron' Separator mit reduzierter Opacity. 
5. Stelle sicher, dass das letzte Item aria-current='page' trägt."

### avatar-recipe & badge-recipe
"Erstelle eine 'Team-Sidebar' unter Verwendung der shell-recipe. 
1. Liste 5 Teammitglieder unter Verwendung des item-recipe auf. 
2. Nutze im Media-Slot des Items das avatar-recipe. 
3. Variiere die Avatare: Nutze 'image' für reale Personen, 'initials' für neue User und 'icon' für Gäste. 
4. Füge jedem Avatar einen decorator='badge-online' oder 'badge-away' hinzu und stelle sicher, dass der Status im aria-label enthalten ist."

### button-recipe
"Erstelle ein 'Aktions-Panel' für einen Editor. 
1. Reihe 3 'icon-only' Ghost-Buttons (Undo, Redo, Share) nebeneinander auf. 
2. Füge eine 'button-group' für die Textausrichtung hinzu. 
3. Platziere rechtsbündig einen 'primary' Button mit dem Label 'Veröffentlichen'. 
4. Simuliere für den 'Veröffentlichen'-Button den 'loading' State und stelle sicher, dass der Spinner korrekt gerendert wird."

### chip-recipe
"Erstelle eine 'Filter-Bar' über einer Ergebnisliste. 
1. Nutze die chip-group mit 5 Chips. 
2. Ein Chip nutzt die 'with-avatar' Variante (Autor-Filter). 
3. Zwei Chips nutzen 'removable' (aktive Filter: 'Datum', 'Typ'). 
4. Implementiere einen 'selected' State mit aria-pressed='true'. 
5. Stelle sicher, dass die gesamte Gruppe horizontal scrollbar ist, wenn der Platz auf Mobile nicht ausreicht."

### label-recipe
"Erstelle ein 'Ticket-System' Dashboard. 
1. Nutze das item-recipe für jede Aufgabe. 
2. Füge jeder Aufgabe Labels aus dem label-recipe hinzu: 
   - Ein 'Prio-Label' mit variant='danger' und emphasis='solid'. 
   - Ein 'Kategorie-Label' mit variant='default' und emphasis='subtle'. 
   - Ein 'Status-Label' mit variant='success' und einem 'Check'-Icon. 
3. Stelle sicher, dass alle Labels im .labels-container flexibel wrappen."

### virtual-scrolling (Data-Table Extension)
"Erstelle ein 'Log-Viewer' Modul für eine Server-Anwendung. 
1. Nutze die data-table mit dem 'Virtual-Scrolling' Recipe. 
2. Simuliere 10.000 Zeilen im scroll-container. 
3. Implementiere Skeleton-Zeilen für den Ladezustand beim schnellen Scrollen. 
4. Nutze eine 'compact' Density für maximale Informationsdichte."

### inline-editing (Data-Table Extension)
"Erstelle eine 'Inventar-Liste' unter Verwendung des data-table-recipe. 
1. Aktiviere das 'Inline-Editing' Recipe für die Spalte 'Lagerbestand'. 
2. Nutze den 'confirm-cancel' Modus für Änderungen in der Zelle. 
3. Implementiere den 'Dirty-State' Indikator für ungespeicherte Werte. 
4. Verwende zum finalen Speichern einen Button-Primary in der Batch-Bar."

### shell-recipe (Application Layout)
"Erstelle das Grundlayout für eine 'Analytics-Plattform' unter Verwendung des shell-recipe. 
1. Nutze die 'dashboard' Variante mit einer fixierten Sidebar links und einer Top-Navigation. 
2. Implementiere den 'sidebar-collapsible' Mechanismus. 
3. Platziere im Main-Content-Bereich einen Header mit Breadcrumbs und eine Toolbar. 
4. Stelle sicher, dass der mobile 'drawer' für die Navigation bei Screens unter 1024px aktiv ist."

### navigation-orchestration (Master-Plan)
"Erstelle einen Website-Header basierend auf dem navigation-recipe. 
1. Integriere ein navigation-menu-recipe für die Hauptlinks. 
2. Füge eine 'Mega-Menu' Variante hinzu, die das item-recipe mit Icons und Beschreibungen innerhalb der Dropdowns nutzt. 
3. Der Header muss sticky sein und einen Backdrop-Blur Effekt nutzen. 
4. Implementiere eine 'Search' (compact) am rechten Ende des Headers neben einem 'Kontakt'-Button."

### banner-recipe
"Erstelle einen systemweiten Hinweis für eine geplante Wartung unter Verwendung des banner-recipe. 
1. Nutze die 'warning' Variante. 
2. Platziere das Banner 'sticky' am obersten Rand der Shell. 
3. Füge einen Button-Link mit dem Label 'Mehr erfahren' hinzu. 
4. Implementiere den 'dismissable' State, sodass Nutzer das Banner dauerhaft schließen können."

### data-table-recipe
"Erstelle eine 'Bestellübersicht' unter Verwendung des data-table-recipe. 
1. Aktiviere die 'selectable' und 'sortable' Features. 
2. Integriere eine 'toolbar' mit einer Search und Batch-Actions ('Export', 'Stornieren'). 
3. Nutze für die Spalte 'Status' das badge-recipe. 
4. Implementiere 'comfortable' Density für hohe Lesbarkeit. 
5. Die Tabelle muss einen 'sticky-header' haben und bei 0 Treffern den 'empty' State mit einer Illustration anzeigen."

### virtual-scrolling (Data-Table Extension)
"Erstelle ein 'Log-Viewer' Modul für eine Server-Anwendung. 
1. Nutze die data-table mit dem 'Virtual-Scrolling' Recipe. 
2. Simuliere 10.000 Zeilen im scroll-container. 
3. Implementiere Skeleton-Zeilen für den Ladezustand beim schnellen Scrollen. 
4. Nutze eine 'compact' Density für maximale Informationsdichte."

### inline-editing (Data-Table Extension)
"Erstelle eine 'Inventar-Liste' unter Verwendung des data-table-recipe. 
1. Aktiviere das 'Inline-Editing' Recipe für die Spalte 'Lagerbestand'. 
2. Nutze den 'confirm-cancel' Modus für Änderungen in der Zelle. 
3. Implementiere den 'Dirty-State' Indikator für ungespeicherte Werte. 
4. Verwende zum finalen Speichern einen Button-Primary in der Batch-Bar."

### search-recipe
"Erstelle ein 'Global Search' Modul basierend auf dem search-recipe. 
1. Integriere ein Scoped-Dropdown links im Input-Feld (Optionen: 'Alle', 'Bilder', 'Videos', 'Dokumente'). 
2. Nutze die 'grouped' Inhaltsvariante, um Treffer nach Kategorie zu trennen (z.B. 'Dateien', 'Personen'). 
3. Implementiere den 'with-shortcut' Slot mit dem Hint 'Cmd+K'. 
4. Stelle sicher, dass Treffer innerhalb der Item-Labels mit dem highlight-Slot (<mark>) hervorgehoben werden."

### toolbar-recipe
"Erstelle eine 'Asset-Management' Toolbar basierend auf dem toolbar-recipe. 
1. Nutze die 'bordered' Variante. 
2. Integriere eine 'Search' (compact) auf der linken Seite. 
3. Verwende einen 'spacer', um Aktions-Buttons (Upload, Download) nach rechts zu schieben. 
4. Trenne die Ansichts-Optionen (Grid/List) durch eine 'Toggle-Group' und einen 'separator'. 
5. Stelle sicher, dass die gesamte Toolbar role='toolbar' und ein passendes aria-label trägt."

### notification-recipe (Toast/System)
"Erstelle ein 'Benachrichtigungs-Center' für eingehende Nachrichten. 
1. Nutze das toast-recipe für Echtzeit-Feedback. 
2. Simuliere eine 'info' Benachrichtigung mit einem Avatar des Absenders. 
3. Ergänze ein badge-recipe (counter) am Benachrichtigungs-Icon in der Top-Nav. 
4. Achte darauf, dass die Toast-Meldung nach 5 Sekunden automatisch verschwindet ('auto-dismiss')."

### select-recipe (Dropdown-Auswahl)
"Erstelle ein Formular-Modul zur 'Länderauswahl'. 
1. Nutze das select-recipe mit integrierter Suche innerhalb des Dropdowns. 
2. Jedes Item im Dropdown soll die Flagge als Icon (Media-Slot) und den Ländernamen (Label) zeigen. 
3. Implementiere den 'multi-select' Modus, bei dem gewählte Länder als Chips im Input-Feld angezeigt werden. 
4. Achte auf korrekte ARIA-Labels für das Listbox-Pattern."

### switch-recipe (Toggle)
"Erstelle ein 'Einstellungs-Panel' für App-Präferenzen. 
1. Nutze das switch-recipe für binäre Optionen wie 'Dark Mode' oder 'E-Mail Benachrichtigungen'. 
2. Platziere den Switch innerhalb eines item-recipe, wobei das Label links und der Switch rechtsbündig (Action-Slot) liegt. 
3. Implementiere eine 'loading' Animation innerhalb des Switch-Toggles, wenn die Einstellung serverseitig gespeichert wird. 
4. Nutze aria-checked für die Status-Kommunikation."

### checkbox- & radio-recipe
"Erstelle eine 'Datenschutz-Einwilligung' Sektion. 
1. Nutze eine checkbox-group für multiple Auswahlmöglichkeiten (Marketing, Analyse, Notwendig). 
2. Verwende für die Auswahl des bevorzugten Kontaktwegs (E-Mail, SMS, Telefon) eine radio-group, um Exklusivität sicherzustellen. 
3. Jedes Element muss einen 'indeterminate' State unterstützen, falls eine übergeordnete Checkbox vorhanden ist. 
4. Achte darauf, dass die Focus-Ringe konsistent zu den Button-Recipes gerendert werden."

### accordion-recipe
"Erstelle eine 'Feature-Showcase' Sektion basierend auf dem accordion-recipe. 
1. Verwende die 'separated' Variante mit Schatten. 
2. Jedes Item muss im Content-Bereich ein Bild (Media-Slot) oberhalb des Textes enthalten. 
3. Implementiere das 'single' Behavior (auto-close). 
4. Achte darauf, dass das Toggle-Icon rechtsbündig ist und im 'open' State sanft rotiert."

### alert-dialog-recipe & alert-recipe
"Erstelle eine Seite 'Benutzer-Einstellungen'. 
1. Platziere im Inhaltsbereich einen statischen success-Alert ('Profil erfolgreich aktualisiert'). 
2. Füge einen Button 'Account löschen' hinzu, der einen destructive Alert-Dialog öffnet. 
3. Der Dialog muss den Titel 'Account permanent löschen?' tragen und den Fokus beim Öffnen auf den 'Abbrechen'-Button setzen, um Fehlklicks zu vermeiden. 
4. Achte darauf, dass die Danger-Farben in beiden Komponenten identisch gerendert werden."

### treeview-recipe
"Erstelle einen 'File-Explorer' basierend auf dem treeview-recipe. 
1. Nutze die 'bordered' Variante. 
2. Integriere Datei-Icons (via icon-slot) und Status-Badges. 
3. Implementiere Guide-Lines zwischen den Ebenen für bessere Lesbarkeit. 
4. Der 'selected' State muss visuell deutlich hervorgehoben sein (bg-primary-subtle + border-left accent). 
5. Stelle sicher, dass die Tastatur-Navigation (Pfeiltasten) funktionsfähig ist."

### breadcrumb-recipe
"Erstelle eine 'Produktdetail-Seite' unter Verwendung der shell-recipe. 
1. Platziere im Header-Bereich das breadcrumb-recipe. 
2. Konfiguriere den Pfad: 'Home > Elektronik > Kameras > DSLRs > [Produktname]'. 
3. Nutze die 'truncated' Variante, wobei 'Kameras' und 'DSLRs' im Ellipsis-Dropdown verschwinden. 
4. Verwende den 'chevron' Separator mit reduzierter Opacity. 
5. Stelle sicher, dass das letzte Item aria-current='page' trägt."

### avatar-recipe & badge-recipe
"Erstelle eine 'Team-Sidebar' unter Verwendung der shell-recipe. 
1. Liste 5 Teammitglieder unter Verwendung des item-recipe auf. 
2. Nutze im Media-Slot des Items das avatar-recipe. 
3. Variiere die Avatare: Nutze 'image' für reale Personen, 'initials' für neue User und 'icon' für Gäste. 
4. Füge jedem Avatar einen decorator='badge-online' oder 'badge-away' hinzu und stelle sicher, dass der Status im aria-label enthalten ist."

### button-recipe
"Erstelle ein 'Aktions-Panel' für einen Editor. 
1. Reihe 3 'icon-only' Ghost-Buttons (Undo, Redo, Share) nebeneinander auf. 
2. Füge eine 'button-group' für die Textausrichtung hinzu. 
3. Platziere rechtsbündig einen 'primary' Button mit dem Label 'Veröffentlichen'. 
4. Simuliere für den 'Veröffentlichen'-Button den 'loading' State und stelle sicher, dass der Spinner korrekt gerendert wird."

### chip-recipe
"Erstelle eine 'Filter-Bar' über einer Ergebnisliste. 
1. Nutze die chip-group mit 5 Chips. 
2. Ein Chip nutzt die 'with-avatar' Variante (Autor-Filter). 
3. Zwei Chips nutzen 'removable' (aktive Filter: 'Datum', 'Typ'). 
4. Implementiere einen 'selected' State mit aria-pressed='true'. 
5. Stelle sicher, dass die gesamte Gruppe horizontal scrollbar ist, wenn der Platz auf Mobile nicht ausreicht."

### label-recipe
"Erstelle ein 'Ticket-System' Dashboard. 
1. Nutze das item-recipe für jede Aufgabe. 
2. Füge jeder Aufgabe Labels aus dem label-recipe hinzu: 
   - Ein 'Prio-Label' mit variant='danger' und emphasis='solid'. 
   - Ein 'Kategorie-Label' mit variant='default' und emphasis='subtle'. 
   - Ein 'Status-Label' mit variant='success' und einem 'Check'-Icon. 
3. Stelle sicher, dass alle Labels im .labels-container flexibel wrappen."

### tooltip- & popover-recipe
"Erstelle ein interaktives 'Hilfe-System' für eine komplexe Tabelle. 
1. Nutze das tooltip-recipe für kurze Erklärungen bei Hover über Tabellenköpfe. 
2. Implementiere ein popover-recipe, das sich beim Klick auf ein 'Info'-Icon öffnet und eine detaillierte Anleitung inklusive eines Bildes (Media-Slot) zeigt. 
3. Stelle sicher, dass das Popover eine 'focus-trap' besitzt und mit der Escape-Taste geschlossen werden kann. 
4. Die Schatten-Tokens müssen dem globalen 'elevation-raised' Standard entsprechen."

### fieldset-recipe
"Erstelle einen Abschnitt 'Benachrichtigungs-Einstellungen' für ein Benutzerprofil. 
1. Nutze das fieldset-recipe in der 'default' Variante. 
2. Setze die Legend auf 'E-Mail & Push'. 
3. Integriere darin eine checkbox-group mit drei Optionen 
   (Newsletter, System-Updates, Sicherheits-Warnungen). 
4. Simuliere den 'disabled' State für das gesamte 
   Fieldset, um zu zeigen, wie alle Checkboxen automatisch inaktiv werden."

### Pagination für Data Tabel
"Erstelle eine Ergebnis-Ansicht für eine Produktsuche. 
1. Nutze die data-table für die Anzeige der Produkte. 
2. Platziere darunter eine pagination-recipe. 
3. Konfiguration: alignment='between' (Prev/Next außen), content='with-ellipsis'. 
4. Simuliere Seite 6 von 20 aktiv (Pattern: 1 ... 4 5 [6] 7 8 ... 20). 
5. Stelle sicher, dass die aktive Seite aria-current='page' trägt."

### Code Snippet recipe
"Erstelle eine 'Entwickler-Anleitung' für die Installation. 
1. Nutze ein code-snippet-recipe in der 'multi' Variante. 
2. Aktiviere das Sprach-Label 'Bash'. 
3. Füge den Kopier-Button mit dem dual-icon Pattern hinzu. 
4. Simuliere den 'expanded' Zustand, um einen langen 
   Installationsbefehl vollständig anzuzeigen. 
5. Achte darauf, dass das Syntax-Highlighting für Shell-Befehle korrekt 
   über die Tokens abgebildet wird."

### Metric recipe
"Erstelle ein 'Umsatz-Dashboard' Modul unter Verwendung des metric-recipe.
1. Füge ein Label 'Monatlicher Umsatz' hinzu.
2. Der Hauptwert (value) soll '$42.000' sein, gerendert in fs-6xl.
3. Integriere einen Trend-Indikator: '+12%' mit einem grünen Aufwärts-Pfeil (success).
4. Nutze die 'inverse' Hintergrund-Variante.
5. Platziere die Metrik innerhalb einer Card des shell-recipe."