# Figma MCP Setup Guide

## Einmalige Einrichtung (5 Minuten)

### Schritt 1: MCP Server hinzufügen
In einer Claude Code Terminal-Session:
```bash
claude mcp add --transport http figma https://mcp.figma.com/mcp
```

### Schritt 2: Session neustarten
```bash
/exit
claude
```

### Schritt 3: MCP konfigurieren
```bash
/mcp
```
→ "figma" aus der Liste wählen → "Authenticate" → Browser-Fenster öffnet sich → Figma-Konto bestätigen.

**Wichtig:** Richtiges Figma-Konto wählen (E-Mail prüfen!). Bei falschem Konto: "Switch accounts".

### Schritt 4: Figma Plugin installieren
```bash
/plugin install figma@claude-plugins-official
```

### Schritt 5: Verifizieren
```bash
/mcp
```
→ "figma" sollte als "connected" angezeigt werden.

## Nutzung

### Design nach Figma exportieren
```
transfer this design into Figma [FIGMA FILE LINK]
```

### Figma-Änderungen in Code übernehmen
```
update the style according to this [FIGMA SELECTION LINK]
```

### Komponente aus Figma dokumentieren
```
document this component [FIGMA SELECTION LINK]
```

## Bekannte Limitierungen (Stand März 2026)

1. **Auto-Layout**: Export zu Figma hat Layout-Probleme, nicht responsive
2. **Keine Components**: UI-Elemente als Frames, nicht als Figma Components
3. **Styling-Verluste**: Gradienten, komplexe Styles gehen teilweise verloren
4. **Fehlende Sections**: Bei komplexen Designs können Teile fehlen

**Empfehlung:** Figma MCP für **Dokumentation** und **visuelle Inspektion** nutzen, nicht für Produktions-Export. Für Token-Sync weiterhin `figma-sync.mjs` verwenden.

## Zusammenspiel mit bestehenden Tools

| Aufgabe | Tool |
|---------|------|
| Token-Sync (Farben, Spacing) | `npm run figma:pull` (figma-sync.mjs) |
| Component-Mapping | `npm run figma:components` (figma-sync.mjs) |
| Visueller Export nach Figma | Figma MCP (`transfer design`) |
| Design-Änderungen übernehmen | Figma MCP (`update style`) |
| Komponenten-Dokumentation | Figma MCP (`document component`) |
