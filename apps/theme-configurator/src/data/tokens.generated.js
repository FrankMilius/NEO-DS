// AUTO-GENERATED from data/design-tokens.json — DO NOT EDIT DIRECTLY.
// Token Contract v2.0.0 — Theme Configurator App Data Model
// Generated: 2026-08-20

// ==========================================================================
// NEO Theme Configurator — Token Data Model (Generated)
// ==========================================================================
// 3-Tier Token System:
//   Level 1: Primitives (raw values)
//   Level 2: Semantic (intent-based)
//   Level 3: Component (usage-specific)
// ==========================================================================

// ---------------------------------------------------------------------------
// Level 1: Primitives
// ---------------------------------------------------------------------------

// --- Main Palettes (Brand) ---
export const primitiveColors = {
  "primary": {
    "label": "Neo Darkblue",
    "base": "#002049",
    "shades": {
      "100": "#ccd2db",
      "200": "#99a6b6",
      "300": "#667992",
      "400": "#334d6d",
      "500": "#002049",
      "600": "#001a3a",
      "700": "#00132c",
      "800": "#000d1d",
      "900": "#00060f",
      "950": "#000308"
    }
  },
  "secondary": {
    "label": "Neo Blue",
    "base": "#009fe3",
    "shades": {
      "100": "#ccecfa",
      "200": "#99d9f4",
      "300": "#66c5ef",
      "400": "#33b2e9",
      "500": "#009fe3",
      "600": "#007fb6",
      "700": "#006088",
      "800": "#00405b",
      "900": "#00202e",
      "950": "#001017"
    }
  },
  "accent": {
    "label": "Neo Lime",
    "base": "#37e93d",
    "shades": {
      "50": "#f0ffef",
      "100": "#d0ffcd",
      "200": "#a4ff9f",
      "300": "#61ff61",
      "400": "#3df643",
      "500": "#37e93d",
      "600": "#00c01a",
      "700": "#009612",
      "800": "#006f0a",
      "900": "#004904",
      "950": "#002801"
    }
  }
}

// --- Supporting Palettes ---
export const supportingPalettes = {
  "beige": {
    "label": "Beigestichig",
    "base": "#989185",
    "shades": {
      "50": "#fef9f2",
      "100": "#f6f2ea",
      "200": "#eae4dc",
      "300": "#d8d3ca",
      "400": "#b7b0a6",
      "500": "#989185",
      "600": "#7b7366",
      "700": "#615a4e",
      "800": "#474138",
      "900": "#2e2922",
      "950": "#1a1710"
    }
  },
  "chartreuse": {
    "label": "Chartreuse",
    "base": "#E6FF9E",
    "shades": {
      "100": "#faffeb",
      "200": "#f4ffd7",
      "300": "#edffc3",
      "400": "#e6ffb0",
      "500": "#E6FF9E",
      "600": "#b8cc7e",
      "700": "#8a995f",
      "800": "#5c663f",
      "900": "#2e3320",
      "950": "#171a10"
    }
  },
  "pink": {
    "label": "Pink",
    "base": "#FF53CB",
    "shades": {
      "100": "#ffddf4",
      "200": "#ffbbe9",
      "300": "#ff99de",
      "400": "#ff76d4",
      "500": "#FF53CB",
      "600": "#cc43a2",
      "700": "#99327a",
      "800": "#662151",
      "900": "#331129",
      "950": "#1a0814"
    }
  },
  "aqua": {
    "label": "Aqua",
    "base": "#C0E8E8",
    "shades": {
      "100": "#f2fafa",
      "200": "#e6f5f5",
      "300": "#d9f0f0",
      "400": "#ccecec",
      "500": "#C0E8E8",
      "600": "#99baba",
      "700": "#738b8b",
      "800": "#4d5d5d",
      "900": "#262e2e",
      "950": "#131717"
    }
  },
  "cyan": {
    "label": "Cyan",
    "base": "#00FFFF",
    "shades": {
      "100": "#ccffff",
      "200": "#99ffff",
      "300": "#66ffff",
      "400": "#33ffff",
      "500": "#00FFFF",
      "600": "#00cccc",
      "700": "#009999",
      "800": "#006666",
      "900": "#003333",
      "950": "#001a1a"
    }
  },
  "burgundy": {
    "label": "Burgundy",
    "base": "#800020",
    "shades": {
      "100": "#e5ccd2",
      "200": "#cc99a6",
      "300": "#b26679",
      "400": "#99334d",
      "500": "#800020",
      "600": "#66001a",
      "700": "#4d0013",
      "800": "#33000d",
      "900": "#1a0006",
      "950": "#0d0003"
    }
  },
  "graphit": {
    "label": "Graphit",
    "base": "#909390",
    "shades": {
      "50": "#f9fbf9",
      "100": "#f1f3f1",
      "200": "#e4e6e4",
      "300": "#d2d4d2",
      "400": "#afb2af",
      "500": "#909390",
      "600": "#727572",
      "700": "#595c59",
      "800": "#414341",
      "900": "#292b29",
      "950": "#161816"
    }
  },
  "blau": {
    "label": "Blaustichig",
    "base": "#8a939d",
    "shades": {
      "50": "#f6fbff",
      "100": "#edf3f9",
      "200": "#e0e6ec",
      "300": "#cdd4dc",
      "400": "#aab2ba",
      "500": "#8a939d",
      "600": "#6c7680",
      "700": "#535c65",
      "800": "#3c434b",
      "900": "#252b31",
      "950": "#13181c"
    }
  },
  "salbei": {
    "label": "Salbei",
    "base": "#8d948d",
    "shades": {
      "50": "#f7fcf7",
      "100": "#eff4ef",
      "200": "#e2e7e1",
      "300": "#d0d5cf",
      "400": "#adb3ac",
      "500": "#8d948d",
      "600": "#6f776f",
      "700": "#565d56",
      "800": "#3e443e",
      "900": "#272c27",
      "950": "#151814"
    }
  }
}

// --- Foundation Palettes (Black / White Transparency) ---
export const foundationPalettes = {
  "black": {
    "label": "Foundation Black",
    "base": "#000000",
    "shades": {
      "10": "rgba(0,0,0,0.1)",
      "20": "rgba(0,0,0,0.2)",
      "30": "rgba(0,0,0,0.3)",
      "40": "rgba(0,0,0,0.4)",
      "50": "rgba(0,0,0,0.5)",
      "60": "rgba(0,0,0,0.6)",
      "70": "rgba(0,0,0,0.7)",
      "80": "rgba(0,0,0,0.8)",
      "90": "rgba(0,0,0,0.9)",
      "100": "#000000"
    }
  },
  "white": {
    "label": "Foundation White",
    "base": "#ffffff",
    "shades": {
      "10": "rgba(255,255,255,0.1)",
      "20": "rgba(255,255,255,0.2)",
      "30": "rgba(255,255,255,0.3)",
      "40": "rgba(255,255,255,0.4)",
      "50": "rgba(255,255,255,0.5)",
      "60": "rgba(255,255,255,0.6)",
      "70": "rgba(255,255,255,0.7)",
      "80": "rgba(255,255,255,0.8)",
      "90": "rgba(255,255,255,0.9)",
      "100": "#ffffff"
    }
  }
}

// --- Neutral Palette ---
export const neutralPalette = {
  "neutral": {
    "label": "Neutral",
    "base": "#7a7a7a",
    "shades": {
      "0": "#ffffff",
      "100": "#f5f5f5",
      "200": "#e5e5e5",
      "300": "#d9d9d9",
      "400": "#cbcbcb",
      "500": "#8e8d8d",
      "600": "#767676",
      "700": "#666666",
      "800": "#4d4d4d",
      "900": "#333333",
      "950": "#1d1d1d",
      "1000": "#000000"
    }
  }
}

// --- System Palettes (Feedback / Status with shade scales) ---
export const systemPalettes = {
  "info": {
    "label": "Info",
    "base": "#4589ff",
    "shades": {
      "100": "#dae8ff",
      "200": "#b5d1ff",
      "300": "#8fbaff",
      "400": "#6aa3ff",
      "500": "#4589ff",
      "600": "#376ecc",
      "700": "#295299",
      "800": "#1c3766",
      "900": "#0e1b33",
      "950": "#070e1a"
    }
  },
  "success": {
    "label": "Success",
    "base": "#24a148",
    "shades": {
      "100": "#d2ecd9",
      "200": "#a5d9b4",
      "300": "#78c68e",
      "400": "#4bb369",
      "500": "#24a148",
      "600": "#1d813a",
      "700": "#16612b",
      "800": "#0e401d",
      "900": "#07200e",
      "950": "#041007"
    }
  },
  "warning": {
    "label": "Warning",
    "base": "#d4a400",
    "shades": {
      "100": "#f7edcc",
      "200": "#efdb99",
      "300": "#e7c966",
      "400": "#dfb733",
      "500": "#d4a400",
      "600": "#aa8300",
      "700": "#7f6200",
      "800": "#554200",
      "900": "#2a2100",
      "950": "#151000"
    }
  },
  "danger": {
    "label": "Danger",
    "base": "#fa4d56",
    "shades": {
      "100": "#fedcde",
      "200": "#fdb9bd",
      "300": "#fc969c",
      "400": "#fb727a",
      "500": "#fa4d56",
      "600": "#c83e45",
      "700": "#962e34",
      "800": "#641f22",
      "900": "#320f11",
      "950": "#190809"
    }
  }
}

// ---------------------------------------------------------------------------
// Level 2: Semantic Tokens (all 4 themes)
// ---------------------------------------------------------------------------

export const semanticTokenGroups = [
  {
    "id": "text",
    "label": "Text",
    "icon": "typography",
    "tokens": [
      {
        "id": "text-primary",
        "label": "Primary Text",
        "description": "Haupt-Textfarbe für Überschriften, Body-Text und Labels. Höchster Kontrast."
      },
      {
        "id": "text-secondary",
        "label": "Secondary Text",
        "description": "Ergänzender Text: Untertitel, Beschreibungen, Metadaten. Mittlerer Kontrast."
      },
      {
        "id": "text-tertiary",
        "label": "Tertiary Text",
        "description": "Dezenter Text: Platzhalter, Hilfstexte, deaktivierte Labels. Niedriger Kontrast."
      },
      {
        "id": "text-inverse",
        "label": "Inverse Text",
        "description": "Text auf dunklen/invertierten Flächen (z.B. Banner, Footer, Tooltips)."
      },
      {
        "id": "text-disabled",
        "label": "Disabled Text",
        "description": "Deaktivierter Text in Formularen, Buttons und Listen."
      },
      {
        "id": "text-on-interactive",
        "label": "On Interactive",
        "description": "Text auf interaktiven Flächen (Primary Buttons, aktive Tabs, Selected States)."
      },
      {
        "id": "text-link",
        "label": "Link",
        "description": "Standard-Linkfarbe in Fließtext und Navigation."
      },
      {
        "id": "text-link-hover",
        "label": "Link Hover",
        "description": "Linkfarbe bei Hover — leicht abgedunkelt/aufgehellt für visuelles Feedback."
      },
      {
        "id": "text-success",
        "label": "Success Text",
        "description": "Erfolgsmeldungen, Validierungs-Hinweise, positive Status-Labels."
      },
      {
        "id": "text-danger",
        "label": "Danger Text",
        "description": "Fehlermeldungen, Pflichtfeld-Hinweise, negative Status-Labels."
      },
      {
        "id": "text-warning",
        "label": "Warning Text",
        "description": "Warnhinweise, Achtung-Labels, eingeschränkte Verfügbarkeit."
      },
      {
        "id": "text-info",
        "label": "Info Text",
        "description": "Informationshinweise, Hilfe-Texte, neutrale Status-Labels."
      },
      {
        "id": "text-accent",
        "label": "Accent Text",
        "description": "Akzent-/Markentextfarbe (z.B. grüner Akzent-Text). Kontrastsicher pro Theme — NICHT die Akzentfläche (background-accent)."
      }
    ]
  },
  {
    "id": "background",
    "label": "Background",
    "icon": "layout",
    "tokens": [
      {
        "id": "background-base",
        "label": "Base",
        "description": "Haupt-Hintergrund der Seite (body). Basis für alle Inhalte."
      },
      {
        "id": "background-secondary",
        "label": "Secondary",
        "description": "Zweite Ebene: Sidebar, Karten-Hintergründe, Formular-Bereiche."
      },
      {
        "id": "background-tertiary",
        "label": "Tertiary",
        "description": "Dritte Ebene: Hover-Zustände, deaktivierte Felder, Tabellenstreifen."
      },
      {
        "id": "background-quaternary",
        "label": "Quaternary",
        "description": "Vierte Ebene: Trennlinien, Input-Divider, subtile Hervorhebungen."
      },
      {
        "id": "background-inverse",
        "label": "Inverse",
        "description": "Invertierter Hintergrund für Banner, Tooltips, Dropdown-Hervorhebungen."
      },
      {
        "id": "background-disabled",
        "label": "Disabled",
        "description": "Hintergrund deaktivierter Felder und Buttons."
      },
      {
        "id": "background-hover",
        "label": "Hover",
        "description": "Hover-Fläche für Listeneinträge, Menüpunkte, Tabellenzeilen."
      },
      {
        "id": "background-active",
        "label": "Active",
        "description": "Aktiver/gedrückter Zustand von Flächen (Buttons, Tabs, Menüpunkte)."
      },
      {
        "id": "background-accent",
        "label": "Accent",
        "description": "Akzent-Hintergrund für Badges, Tags, hervorgehobene Bereiche."
      },
      {
        "id": "background-accent-secondary",
        "label": "Accent Secondary",
        "description": "Sekundärer Akzent: alternative Badge-Farbe, Kategorie-Markierungen."
      },
      {
        "id": "background-success",
        "label": "Success BG",
        "description": "Hintergrund für Erfolgs-Alerts, validierte Formularfelder, Status-Indikatoren."
      },
      {
        "id": "background-danger",
        "label": "Danger BG",
        "description": "Hintergrund für Fehler-Alerts, ungültige Formularfelder, Warnbereiche."
      },
      {
        "id": "background-warning",
        "label": "Warning BG",
        "description": "Hintergrund für Warn-Alerts, Hinweisbanner, eingeschränkte Zustände."
      },
      {
        "id": "background-info",
        "label": "Info BG",
        "description": "Hintergrund für Info-Alerts, Hinweiskästen, Hilfe-Bereiche."
      }
    ]
  },
  {
    "id": "border",
    "label": "Border",
    "icon": "square",
    "tokens": [
      {
        "id": "border-primary",
        "label": "Primary",
        "description": "Standard-Rahmenfarbe für Inputs, Karten, Trennlinien. Mittlerer Kontrast."
      },
      {
        "id": "border-secondary",
        "label": "Secondary",
        "description": "Dezenter Rahmen: Abschnitte, Divider, inaktive Elemente. Niedriger Kontrast."
      },
      {
        "id": "border-strong",
        "label": "Strong",
        "description": "Starker Rahmen: fokussierte Inputs, aktive Tabs, hervorgehobene Karten."
      },
      {
        "id": "border-inverse",
        "label": "Inverse",
        "description": "Rahmen auf dunklen Flächen (Tooltip-Borders, inverse Karten)."
      },
      {
        "id": "border-disabled",
        "label": "Disabled",
        "description": "Rahmen deaktivierter Inputs und Buttons."
      },
      {
        "id": "border-success",
        "label": "Success",
        "description": "Rahmen für Erfolgs-Indikatoren, validierte Felder."
      },
      {
        "id": "border-danger",
        "label": "Danger",
        "description": "Rahmen für Fehler-Indikatoren, ungültige Felder."
      },
      {
        "id": "border-warning",
        "label": "Warning",
        "description": "Rahmen für Warn-Indikatoren, Achtung-Felder."
      },
      {
        "id": "border-info",
        "label": "Info",
        "description": "Rahmen für Info-Indikatoren, Hinweis-Felder."
      }
    ]
  },
  {
    "id": "interactive",
    "label": "Interactive",
    "icon": "click",
    "tokens": [
      {
        "id": "interactive-default",
        "label": "Default",
        "description": "Grundfarbe aller primären interaktiven Elemente: Buttons, Links, Toggles, Checkboxen."
      },
      {
        "id": "interactive-hover",
        "label": "Hover",
        "description": "Hover-Zustand interaktiver Elemente — leicht abweichend für visuelles Feedback."
      },
      {
        "id": "interactive-active",
        "label": "Active",
        "description": "Aktiver/gedrückter Zustand interaktiver Elemente."
      },
      {
        "id": "interactive-visited",
        "label": "Visited",
        "description": "Bereits besuchte Links — visuell abgesetzt von Standard-Links."
      },
      {
        "id": "interactive-focus",
        "label": "Focus",
        "description": "Fokus-Ring-Farbe für Tastatur-Navigation (alle fokussierbaren Elemente)."
      }
    ]
  },
  {
    "id": "feedback",
    "label": "Feedback",
    "icon": "alert-circle",
    "tokens": [
      {
        "id": "feedback-info",
        "label": "Info",
        "description": "Farbe für Info-Icons, Badges und Status-Symbole in Feedback-Komponenten."
      },
      {
        "id": "feedback-success",
        "label": "Success",
        "description": "Farbe für Erfolgs-Icons, Checkmarks und positive Status-Symbole."
      },
      {
        "id": "feedback-warning",
        "label": "Warning",
        "description": "Farbe für Warn-Icons, Ausrufezeichen und Achtung-Symbole."
      },
      {
        "id": "feedback-danger",
        "label": "Danger",
        "description": "Farbe für Fehler-Icons, X-Symbole und negative Status-Symbole."
      }
    ]
  },
  {
    "id": "layer",
    "label": "Surface / Layer",
    "icon": "stack-2",
    "tokens": [
      {
        "id": "layer-01",
        "label": "Surface 01",
        "description": "Erste Oberflächen-Ebene: Karten, Panels, Sidebar-Hintergrund auf base."
      },
      {
        "id": "layer-02",
        "label": "Surface 02",
        "description": "Zweite Oberflächen-Ebene: Elemente auf layer-01 (z.B. Input in einer Karte)."
      },
      {
        "id": "layer-03",
        "label": "Surface 03",
        "description": "Dritte Oberflächen-Ebene: verschachtelte Elemente (z.B. Dropdown in Modal)."
      }
    ]
  },
  {
    "id": "on-color",
    "label": "On-Color",
    "icon": "contrast",
    "tokens": [
      {
        "id": "on-surface",
        "label": "On Surface",
        "description": "Textfarbe auf neutralen Oberflächen (base, secondary, tertiary)."
      },
      {
        "id": "on-layer-01",
        "label": "On Layer 01",
        "description": "Textfarbe auf layer-01 Oberflächen (Karten, Panels)."
      },
      {
        "id": "on-layer-02",
        "label": "On Layer 02",
        "description": "Textfarbe auf layer-02 Oberflächen (verschachtelte Elemente)."
      },
      {
        "id": "on-accent",
        "label": "On Accent",
        "description": "Textfarbe auf Akzent-Hintergründen (accent Badges, Tags)."
      },
      {
        "id": "on-success",
        "label": "On Success",
        "description": "Textfarbe auf Erfolgs-Hintergründen (Alerts, Status-Karten)."
      },
      {
        "id": "on-warning",
        "label": "On Warning",
        "description": "Textfarbe auf Warn-Hintergründen (Alerts, Hinweisbanner)."
      },
      {
        "id": "on-danger",
        "label": "On Danger",
        "description": "Textfarbe auf Fehler-Hintergründen (Alerts, Fehlerkarten)."
      },
      {
        "id": "on-info",
        "label": "On Info",
        "description": "Textfarbe auf Info-Hintergründen (Alerts, Hinweiskästen)."
      }
    ]
  },
  {
    "id": "surface",
    "label": "Flächen",
    "icon": "layout",
    "tokens": [
      {
        "id": "surface-stage",
        "label": "Bühne",
        "description": "Der Grund, auf dem Karten liegen. Modell C, Website."
      },
      {
        "id": "surface-card",
        "label": "Karte",
        "description": "Was auf der Bühne liegt. Getrennt durch Rahmen, nicht durch Füllung."
      },
      {
        "id": "surface-base",
        "label": "Grund",
        "description": "Modell A, Anwendung: die unterste Ebene."
      },
      {
        "id": "surface-01",
        "label": "Ebene 01",
        "description": "Erste Schachtelung."
      },
      {
        "id": "surface-02",
        "label": "Ebene 02",
        "description": "Zweite Schachtelung."
      },
      {
        "id": "surface-03",
        "label": "Ebene 03",
        "description": "Dritte Schachtelung."
      },
      {
        "id": "surface-sunken",
        "label": "Vertiefung",
        "description": "Eingelassene Fläche, etwa hinter einem Bildplatzhalter."
      }
    ]
  },
  {
    "id": "accent",
    "label": "Akzent",
    "icon": "sparkles",
    "tokens": [
      {
        "id": "accent-surface",
        "label": "Akzentfläche",
        "description": "Die Marke. Markiert die eine Handlung, die zählt."
      },
      {
        "id": "accent-surface-hover",
        "label": "Akzent überfahren",
        "description": "Im Hellen dunkler, im Dunkeln heller — immer vom Grund weg."
      },
      {
        "id": "accent-surface-active",
        "label": "Akzent gedrückt"
      },
      {
        "id": "accent-on",
        "label": "Schrift auf Akzent",
        "description": "Schwarz: der Markenwert ist zu hell für weiße Schrift."
      },
      {
        "id": "accent-line",
        "label": "Akzentlinie",
        "description": "Rahmen und Unterstrich. Erfüllt 3:1 nach WCAG 1.4.11."
      },
      {
        "id": "accent-underline",
        "label": "Akzent-Unterstrich",
        "description": "Unterstrich unter Schrift. Trägt den Markenwert — sein Signal ist sein Vorhandensein, nicht sein Kontrast. Für Rahmen gilt das nicht, dafür gibt es Akzentlinie."
      },
      {
        "id": "accent-text",
        "label": "Akzentschrift",
        "description": "Nur wo Schrift zwingend im Akzent stehen muss."
      }
    ]
  },
  {
    "id": "border-roles",
    "label": "Rahmen nach Aufgabe",
    "icon": "border-style",
    "tokens": [
      {
        "id": "border-subtle",
        "label": "Trennlinie",
        "description": "Gliedert. Von WCAG 1.4.11 ausgenommen, darf blass sein."
      },
      {
        "id": "border-control",
        "label": "Bedienrahmen",
        "description": "Macht ein Bedienelement erkennbar. Erfüllt 3:1 in beiden Themen."
      },
      {
        "id": "border-emphasis",
        "label": "Betonter Rahmen",
        "description": "Hervorhebung, höchster Kontrast."
      }
    ]
  },
  {
    "id": "elevation",
    "label": "Erhebung",
    "icon": "shadow",
    "tokens": [
      {
        "id": "elevation-0",
        "label": "Liegt auf",
        "description": "Keine Erhebung."
      },
      {
        "id": "elevation-1",
        "label": "Erhebung 1",
        "description": "Karte in Ruhe."
      },
      {
        "id": "elevation-2",
        "label": "Erhebung 2",
        "description": "Karte berührt, Screenshot."
      },
      {
        "id": "elevation-3",
        "label": "Erhebung 3",
        "description": "Dialog, Menü."
      }
    ]
  },
  {
    "id": "focus",
    "label": "Fokus",
    "icon": "target",
    "tokens": [
      {
        "id": "focus-inner",
        "label": "Fokus innen",
        "description": "Dunkler Innenring — trägt auf hellen Flächen."
      },
      {
        "id": "focus-outer",
        "label": "Fokus außen",
        "description": "Heller Außenring — trägt auf dunklen Flächen und auf dem Akzentknopf."
      }
    ]
  }
]

// Default semantic values for all 4 themes
export const semanticDefaults = {
  "neo-light": {
    "text-primary": "#0f1419",
    "text-secondary": "#586673",
    "text-tertiary": "#46566a",
    "text-inverse": "#ffffff",
    "text-disabled": "#8e8d8d",
    "text-on-interactive": "#ffffff",
    "text-link": "#0f1419",
    "text-link-hover": "#586673",
    "text-success": "#0a6e3d",
    "text-danger": "#a31f1f",
    "text-warning": "#92500a",
    "text-info": "#2563eb",
    "text-accent": "#0e7490",
    "background-base": "#ffffff",
    "background-secondary": "#f4f6f8",
    "background-tertiary": "#eef1f4",
    "background-quaternary": "#cbcbcb",
    "background-inverse": "#000000",
    "background-disabled": "#e5e5e5",
    "background-hover": "#f5f5f5",
    "background-active": "#e5e5e5",
    "background-accent": "#37e93d",
    "background-accent-secondary": "#04cd24",
    "background-success": "#e7f6ee",
    "background-danger": "#fbe9e9",
    "background-warning": "#fbf0dd",
    "background-info": "#e5ecfd",
    "border-primary": "#cbcbcb",
    "border-secondary": "#d6dce1",
    "border-strong": "#000000",
    "border-inverse": "#ffffff",
    "border-disabled": "#e5e5e5",
    "border-success": "#0b9e23",
    "border-danger": "#bf281b",
    "border-warning": "#8a6900",
    "border-info": "#2b6cb0",
    "interactive-default": "#009fe3",
    "interactive-hover": "#007fb6",
    "interactive-active": "#006088",
    "interactive-visited": "#006088",
    "interactive-focus": "#009fe3",
    "feedback-info": "#4589ff",
    "feedback-success": "#24a148",
    "feedback-warning": "#d4a400",
    "feedback-danger": "#fa4d56",
    "layer-01": "#f5f5f5",
    "layer-02": "#ffffff",
    "layer-03": "#f5f5f5",
    "on-surface": "#000000",
    "on-layer-01": "#000000",
    "on-layer-02": "#000000",
    "on-accent": "#000000",
    "on-success": "#000000",
    "on-warning": "#000000",
    "on-danger": "#000000",
    "on-info": "#ffffff"
  },
  "neo-dark": {
    "text-primary": "#eaf0f5",
    "text-secondary": "#8b9aa8",
    "text-tertiary": "#62748b",
    "text-inverse": "#000000",
    "text-disabled": "#8e8d8d",
    "text-on-interactive": "#ffffff",
    "text-link": "#009fe3",
    "text-link-hover": "#33b2e9",
    "text-success": "#5fd99a",
    "text-danger": "#f08a8a",
    "text-warning": "#e0a94e",
    "text-info": "#60a5fa",
    "text-accent": "#6cf06f",
    "background-base": "#0a0d10",
    "background-secondary": "#121821",
    "background-tertiary": "#19212c",
    "background-quaternary": "#666666",
    "background-inverse": "#ffffff",
    "background-disabled": "#333333",
    "background-hover": "#1d1d1d",
    "background-active": "#333333",
    "background-accent": "#37e93d",
    "background-accent-secondary": "#37e93d",
    "background-success": "#10301f",
    "background-danger": "#361717",
    "background-warning": "#33260f",
    "background-info": "#182535",
    "border-primary": "#767676",
    "border-secondary": "#263240",
    "border-strong": "#ffffff",
    "border-inverse": "#000000",
    "border-disabled": "#333333",
    "border-success": "#0b9e23",
    "border-danger": "#ef5b4e",
    "border-warning": "#d4a400",
    "border-info": "#6aa3ff",
    "interactive-default": "#009fe3",
    "interactive-hover": "#33b2e9",
    "interactive-active": "#66c5ef",
    "interactive-visited": "#007fb6",
    "interactive-focus": "#009fe3",
    "feedback-info": "#4589ff",
    "feedback-success": "#24a148",
    "feedback-warning": "#d4a400",
    "feedback-danger": "#fa4d56",
    "layer-01": "#1d1d1d",
    "layer-02": "#333333",
    "layer-03": "#4d4d4d",
    "on-surface": "#ffffff",
    "on-layer-01": "#ffffff",
    "on-layer-02": "#ffffff",
    "on-accent": "#000000",
    "on-success": "#ffffff",
    "on-warning": "#000000",
    "on-danger": "#ffffff",
    "on-info": "#ffffff"
  },
  "customer-light": {
    "text-primary": "#000000",
    "text-secondary": "#666666",
    "text-tertiary": "#8e8d8d",
    "text-inverse": "#ffffff",
    "text-disabled": "#8e8d8d",
    "text-on-interactive": "#ffffff",
    "text-link": "#009fe3",
    "text-link-hover": "#007fb6",
    "text-accent": "#0e7012",
    "text-success": "#0b9e23",
    "text-danger": "#bf281b",
    "text-warning": "#8a6900",
    "text-info": "#2b6cb0",
    "background-base": "#f5f5f5",
    "background-secondary": "#ffffff",
    "background-tertiary": "#d9d9d9",
    "background-quaternary": "#cbcbcb",
    "background-inverse": "#000000",
    "background-disabled": "#e5e5e5",
    "background-hover": "#e5e5e5",
    "background-active": "#d9d9d9",
    "background-accent": "#5cfe50",
    "background-accent-secondary": "#04cd24",
    "background-success": "#d5ffd1",
    "background-danger": "#ffdfdc",
    "background-warning": "#fff3cc",
    "background-info": "#dae8ff",
    "border-primary": "#cbcbcb",
    "border-secondary": "#d9d9d9",
    "border-strong": "#000000",
    "border-inverse": "#ffffff",
    "border-disabled": "#e5e5e5",
    "border-success": "#0b9e23",
    "border-danger": "#bf281b",
    "border-warning": "#8a6900",
    "border-info": "#2b6cb0",
    "interactive-default": "#009fe3",
    "interactive-hover": "#007fb6",
    "interactive-active": "#006088",
    "interactive-visited": "#006088",
    "interactive-focus": "#009fe3",
    "feedback-info": "#4589ff",
    "feedback-success": "#24a148",
    "feedback-warning": "#d4a400",
    "feedback-danger": "#fa4d56",
    "layer-01": "#ffffff",
    "layer-02": "#f5f5f5",
    "layer-03": "#ffffff",
    "on-surface": "#000000",
    "on-layer-01": "#000000",
    "on-layer-02": "#000000",
    "on-accent": "#000000",
    "on-success": "#000000",
    "on-warning": "#000000",
    "on-danger": "#000000",
    "on-info": "#ffffff"
  },
  "customer-dark": {
    "text-primary": "#ffffff",
    "text-secondary": "#cbcbcb",
    "text-tertiary": "#767676",
    "text-inverse": "#000000",
    "text-disabled": "#8e8d8d",
    "text-on-interactive": "#ffffff",
    "text-link": "#009fe3",
    "text-link-hover": "#33b2e9",
    "text-accent": "#6cf06f",
    "text-success": "#0b9e23",
    "text-danger": "#ef5b4e",
    "text-warning": "#d4a400",
    "text-info": "#6aa3ff",
    "background-base": "#1d1d1d",
    "background-secondary": "#333333",
    "background-tertiary": "#4d4d4d",
    "background-quaternary": "#666666",
    "background-inverse": "#ffffff",
    "background-disabled": "#333333",
    "background-hover": "#333333",
    "background-active": "#4d4d4d",
    "background-accent": "#5fef63",
    "background-accent-secondary": "#37e93d",
    "background-success": "#0d2b15",
    "background-danger": "#3b1419",
    "background-warning": "#2a2100",
    "background-info": "#0e1b33",
    "border-primary": "#767676",
    "border-secondary": "#333333",
    "border-strong": "#ffffff",
    "border-inverse": "#000000",
    "border-disabled": "#333333",
    "border-success": "#0b9e23",
    "border-danger": "#ef5b4e",
    "border-warning": "#d4a400",
    "border-info": "#6aa3ff",
    "interactive-default": "#009fe3",
    "interactive-hover": "#33b2e9",
    "interactive-active": "#66c5ef",
    "interactive-visited": "#007fb6",
    "interactive-focus": "#009fe3",
    "feedback-info": "#4589ff",
    "feedback-success": "#24a148",
    "feedback-warning": "#d4a400",
    "feedback-danger": "#fa4d56",
    "layer-01": "#333333",
    "layer-02": "#4d4d4d",
    "layer-03": "#666666",
    "on-surface": "#ffffff",
    "on-layer-01": "#ffffff",
    "on-layer-02": "#ffffff",
    "on-accent": "#000000",
    "on-success": "#ffffff",
    "on-warning": "#000000",
    "on-danger": "#ffffff",
    "on-info": "#ffffff"
  }
}

// ---------------------------------------------------------------------------
// Level 3: Component Tokens
// ---------------------------------------------------------------------------

export const componentTokenGroups = [
  {
    "id": "button",
    "label": "Button",
    "icon": "rectangle",
    "subgroups": [
      {
        "id": "geometry",
        "label": "Geometry",
        "tokenIds": [
          "nc-button-height-xs",
          "nc-button-height-sm",
          "nc-button-height-md",
          "nc-button-height-lg",
          "nc-button-padding-x-xs",
          "nc-button-padding-x-sm",
          "nc-button-padding-x-md",
          "nc-button-padding-x-lg",
          "nc-button-padding-y-xs",
          "nc-button-padding-y-sm",
          "nc-button-padding-y-md",
          "nc-button-padding-y-lg",
          "nc-button-radius-xs",
          "nc-button-radius-sm",
          "nc-button-radius-md",
          "nc-button-radius-lg",
          "nc-button-radius-full",
          "nc-button-border-width-sm",
          "nc-button-border-width-lg",
          "nc-button-touch-target-min",
          "nc-button-fab-size",
          "nc-button-fab-radius"
        ]
      },
      {
        "id": "typography",
        "label": "Typography",
        "tokenIds": [
          "nc-button-font-size-xs",
          "nc-button-font-size-sm",
          "nc-button-font-size-md",
          "nc-button-font-size-lg",
          "nc-button-line-height",
          "nc-button-font-weight",
          "nc-button-gap",
          "nc-button-min-width",
          "nc-button-label-compact",
          "nc-button-label-expressive"
        ]
      },
      {
        "id": "icon-sizing",
        "label": "Icon Sizing",
        "category": "patterns",
        "tokenIds": [
          "nc-button-icon-size-xs",
          "nc-button-icon-size-sm",
          "nc-button-icon-size-md",
          "nc-button-icon-size-lg",
          "nc-button-icon-gap-xs",
          "nc-button-icon-gap-sm",
          "nc-button-icon-gap-md",
          "nc-button-icon-gap-lg"
        ]
      },
      {
        "id": "interaction",
        "label": "Interaction",
        "category": "state",
        "tokenIds": [
          "nc-button-transition-duration",
          "nc-button-scale-active",
          "nc-button-opacity-disabled"
        ]
      },
      {
        "id": "primary",
        "label": "Primary",
        "category": "main",
        "tokenIds": [
          "nc-button-primary-bg",
          "nc-button-primary-bg-hover",
          "nc-button-primary-bg-active",
          "nc-button-primary-color",
          "nc-button-primary-border"
        ]
      },
      {
        "id": "secondary",
        "label": "Secondary",
        "category": "main",
        "tokenIds": [
          "nc-button-secondary-bg",
          "nc-button-secondary-bg-hover",
          "nc-button-secondary-bg-active",
          "nc-button-secondary-color",
          "nc-button-secondary-border"
        ]
      },
      {
        "id": "accent",
        "label": "Accent",
        "category": "main",
        "tokenIds": [
          "nc-button-accent-bg",
          "nc-button-accent-bg-hover",
          "nc-button-accent-bg-active",
          "nc-button-accent-color",
          "nc-button-accent-border"
        ]
      },
      {
        "id": "outline",
        "label": "Outline",
        "category": "supporting",
        "tokenIds": [
          "nc-button-outline-bg",
          "nc-button-outline-bg-hover",
          "nc-button-outline-bg-active",
          "nc-button-outline-color",
          "nc-button-outline-border"
        ]
      },
      {
        "id": "ghost",
        "label": "Ghost",
        "category": "supporting",
        "tokenIds": [
          "nc-button-ghost-bg",
          "nc-button-ghost-bg-hover",
          "nc-button-ghost-bg-active",
          "nc-button-ghost-color",
          "nc-button-ghost-border"
        ]
      },
      {
        "id": "success",
        "label": "Success",
        "category": "system",
        "tokenIds": [
          "nc-button-success-bg",
          "nc-button-success-bg-hover",
          "nc-button-success-bg-active",
          "nc-button-success-color",
          "nc-button-success-border"
        ]
      },
      {
        "id": "warning",
        "label": "Warning",
        "category": "system",
        "tokenIds": [
          "nc-button-warning-bg",
          "nc-button-warning-bg-hover",
          "nc-button-warning-bg-active",
          "nc-button-warning-color",
          "nc-button-warning-border"
        ]
      },
      {
        "id": "info",
        "label": "Info",
        "category": "system",
        "tokenIds": [
          "nc-button-info-bg",
          "nc-button-info-bg-hover",
          "nc-button-info-bg-active",
          "nc-button-info-color",
          "nc-button-info-border"
        ]
      },
      {
        "id": "error",
        "label": "Error",
        "category": "system",
        "tokenIds": [
          "nc-button-error-bg",
          "nc-button-error-bg-hover",
          "nc-button-error-bg-active",
          "nc-button-error-color",
          "nc-button-error-border"
        ]
      },
      {
        "id": "disabled",
        "label": "Disabled",
        "category": "state",
        "tokenIds": [
          "nc-button-disabled-bg",
          "nc-button-disabled-color",
          "nc-button-disabled-border"
        ]
      },
      {
        "id": "icon-button",
        "label": "Icon Button",
        "category": "patterns",
        "tokenIds": [
          "nc-icon-button-size",
          "nc-icon-button-padding",
          "nc-icon-button-radius",
          "nc-icon-button-bg",
          "nc-icon-button-bg-hover",
          "nc-icon-button-color"
        ]
      },
      {
        "id": "spinner",
        "label": "Spinner / Loading",
        "category": "patterns",
        "tokenIds": [
          "nc-button-spinner-size",
          "nc-button-spinner-border-width"
        ]
      },
      {
        "id": "colors",
        "label": "Farben",
        "category": "main",
        "tokenIds": [
          "nc-button-inverted-color",
          "nc-button-inverted-border",
          "nc-button-soft-color",
          "nc-button-soft-border",
          "nc-button-fab-shadow",
          "nc-button-fab-shadow-hover"
        ]
      }
    ],
    "arenaConfig": {
      "type": "variants-matrix",
      "variants": [
        {
          "id": "primary",
          "label": "Primary",
          "category": "main"
        },
        {
          "id": "secondary",
          "label": "Secondary",
          "category": "main"
        },
        {
          "id": "accent",
          "label": "Accent",
          "category": "main"
        },
        {
          "id": "outline",
          "label": "Outline",
          "category": "supporting"
        },
        {
          "id": "ghost",
          "label": "Ghost",
          "category": "supporting"
        },
        {
          "id": "success",
          "label": "Success",
          "category": "system"
        },
        {
          "id": "warning",
          "label": "Warning",
          "category": "system"
        },
        {
          "id": "info",
          "label": "Info",
          "category": "system"
        },
        {
          "id": "error",
          "label": "Error",
          "category": "system"
        }
      ],
      "sizes": [
        "xs",
        "sm",
        "md",
        "lg"
      ],
      "tokenPattern": {
        "background": "nc-button-{variant}-bg",
        "backgroundHover": "nc-button-{variant}-bg-hover",
        "backgroundActive": "nc-button-{variant}-bg-active",
        "color": "nc-button-{variant}-color",
        "borderColor": "nc-button-{variant}-border",
        "height": "nc-button-height-{size}",
        "radius": "nc-button-radius-{size}",
        "fontSize": "nc-button-font-size-{size}",
        "paddingX": "nc-button-padding-x-{size}",
        "paddingY": "nc-button-padding-y-{size}"
      },
      "states": [
        "default",
        "hover",
        "active",
        "disabled"
      ],
      "specimens": [
        {
          "id": "with-icon",
          "label": "With Icon",
          "renderType": "button-with-icon"
        },
        {
          "id": "icon-only",
          "label": "Icon Only",
          "renderType": "button-icon-only"
        },
        {
          "id": "loading",
          "label": "Loading",
          "renderType": "button-loading"
        },
        {
          "id": "group",
          "label": "Button Group",
          "renderType": "button-group"
        },
        {
          "id": "toggle",
          "label": "Toggle",
          "renderType": "button-toggle"
        },
        {
          "id": "link",
          "label": "Link as Button",
          "renderType": "button-link"
        }
      ]
    },
    "tokens": [
      {
        "id": "nc-button-height-xs",
        "label": "Height XS",
        "type": "size",
        "default": "24px"
      },
      {
        "id": "nc-button-height-sm",
        "label": "Height SM",
        "type": "size",
        "default": "32px"
      },
      {
        "id": "nc-button-height-md",
        "label": "Height MD",
        "type": "size",
        "default": "40px"
      },
      {
        "id": "nc-button-height-lg",
        "label": "Height LG",
        "type": "size",
        "default": "48px"
      },
      {
        "id": "nc-button-padding-x-xs",
        "label": "Padding X — XS",
        "type": "size",
        "default": "8px"
      },
      {
        "id": "nc-button-padding-x-sm",
        "label": "Padding X — SM",
        "type": "size",
        "default": "12px"
      },
      {
        "id": "nc-button-padding-x-md",
        "label": "Padding X — MD",
        "type": "size",
        "default": "20px"
      },
      {
        "id": "nc-button-padding-x-lg",
        "label": "Padding X — LG",
        "type": "size",
        "default": "24px"
      },
      {
        "id": "nc-button-padding-y-xs",
        "label": "Padding Y — XS",
        "type": "size",
        "default": "4px"
      },
      {
        "id": "nc-button-padding-y-sm",
        "label": "Padding Y — SM",
        "type": "size",
        "default": "8px"
      },
      {
        "id": "nc-button-padding-y-md",
        "label": "Padding Y — MD",
        "type": "size",
        "default": "12px"
      },
      {
        "id": "nc-button-padding-y-lg",
        "label": "Padding Y — LG",
        "type": "size",
        "default": "16px"
      },
      {
        "id": "nc-button-radius-xs",
        "label": "Radius XS",
        "type": "size",
        "default": "2px"
      },
      {
        "id": "nc-button-radius-sm",
        "label": "Radius SM",
        "type": "size",
        "default": "4px"
      },
      {
        "id": "nc-button-radius-md",
        "label": "Radius MD",
        "type": "size",
        "default": "6px"
      },
      {
        "id": "nc-button-radius-lg",
        "label": "Radius LG",
        "type": "size",
        "default": "8px"
      },
      {
        "id": "nc-button-radius-full",
        "label": "Radius Pill",
        "type": "size",
        "default": "9999px"
      },
      {
        "id": "nc-button-font-size-xs",
        "label": "Font Size XS",
        "type": "size",
        "default": "12px"
      },
      {
        "id": "nc-button-font-size-sm",
        "label": "Font Size SM",
        "type": "size",
        "default": "12px"
      },
      {
        "id": "nc-button-font-size-md",
        "label": "Font Size MD",
        "type": "size",
        "default": "16px"
      },
      {
        "id": "nc-button-font-size-lg",
        "label": "Font Size LG",
        "type": "size",
        "default": "16px"
      },
      {
        "id": "nc-button-line-height",
        "label": "Line Height",
        "type": "generic",
        "default": "1.25"
      },
      {
        "id": "nc-button-font-weight",
        "label": "Font Weight",
        "type": "generic",
        "default": "600"
      },
      {
        "id": "nc-button-gap",
        "label": "Icon Gap",
        "type": "size",
        "default": "8px"
      },
      {
        "id": "nc-button-min-width",
        "label": "Min Width",
        "type": "size",
        "default": "64px"
      },
      {
        "id": "nc-button-label-compact",
        "label": "Label Compact (XS/SM)",
        "type": "size",
        "default": "12px"
      },
      {
        "id": "nc-button-label-expressive",
        "label": "Label Expressive (MD/LG)",
        "type": "size",
        "default": "16px"
      },
      {
        "id": "nc-button-border-width-sm",
        "label": "Border Width SM",
        "type": "size",
        "default": "1px"
      },
      {
        "id": "nc-button-border-width-lg",
        "label": "Border Width LG",
        "type": "size",
        "default": "2px"
      },
      {
        "id": "nc-button-transition-duration",
        "label": "Transition Duration",
        "type": "generic",
        "default": "200ms"
      },
      {
        "id": "nc-button-scale-active",
        "label": "Scale Active",
        "type": "generic",
        "default": "0.98"
      },
      {
        "id": "nc-button-opacity-disabled",
        "label": "Opacity Disabled",
        "type": "generic",
        "default": "0.5"
      },
      {
        "id": "nc-button-icon-gap-xs",
        "label": "Icon Gap XS",
        "type": "size",
        "default": "4px"
      },
      {
        "id": "nc-button-icon-gap-sm",
        "label": "Icon Gap SM",
        "type": "size",
        "default": "8px"
      },
      {
        "id": "nc-button-icon-gap-md",
        "label": "Icon Gap MD",
        "type": "size",
        "default": "8px"
      },
      {
        "id": "nc-button-icon-gap-lg",
        "label": "Icon Gap LG",
        "type": "size",
        "default": "12px"
      },
      {
        "id": "nc-button-icon-size-xs",
        "label": "Icon Size XS",
        "type": "size",
        "default": "16px"
      },
      {
        "id": "nc-button-icon-size-sm",
        "label": "Icon Size SM",
        "type": "size",
        "default": "16px"
      },
      {
        "id": "nc-button-icon-size-md",
        "label": "Icon Size MD",
        "type": "size",
        "default": "20px"
      },
      {
        "id": "nc-button-icon-size-lg",
        "label": "Icon Size LG",
        "type": "size",
        "default": "20px"
      },
      {
        "id": "nc-button-primary-bg",
        "label": "Primary BG",
        "type": "color",
        "ref": "interactive-default"
      },
      {
        "id": "nc-button-primary-bg-hover",
        "label": "Primary BG Hover",
        "type": "color",
        "ref": "interactive-hover"
      },
      {
        "id": "nc-button-primary-bg-active",
        "label": "Primary BG Active",
        "type": "color",
        "ref": "interactive-active"
      },
      {
        "id": "nc-button-primary-color",
        "label": "Primary Text",
        "type": "color",
        "ref": "text-on-interactive"
      },
      {
        "id": "nc-button-primary-border",
        "label": "Primary Border",
        "type": "color",
        "default": "transparent"
      },
      {
        "id": "nc-button-secondary-bg",
        "label": "Secondary BG",
        "type": "color",
        "default": "transparent"
      },
      {
        "id": "nc-button-secondary-bg-hover",
        "label": "Secondary BG Hover",
        "type": "color",
        "ref": "background-secondary"
      },
      {
        "id": "nc-button-secondary-bg-active",
        "label": "Secondary BG Active",
        "type": "color",
        "ref": "background-tertiary"
      },
      {
        "id": "nc-button-secondary-color",
        "label": "Secondary Text",
        "type": "color",
        "ref": "interactive-default"
      },
      {
        "id": "nc-button-secondary-border",
        "label": "Secondary Border",
        "type": "color",
        "ref": "interactive-default"
      },
      {
        "id": "nc-button-accent-bg",
        "label": "Accent BG",
        "type": "color",
        "ref": "background-accent"
      },
      {
        "id": "nc-button-accent-bg-hover",
        "label": "Accent BG Hover",
        "type": "color",
        "ref": "background-accent-secondary"
      },
      {
        "id": "nc-button-accent-bg-active",
        "label": "Accent BG Active",
        "type": "color",
        "default": "#2cba31",
        "darkDefault": "#5fed64"
      },
      {
        "id": "nc-button-accent-color",
        "label": "Accent Text",
        "type": "color",
        "default": "#000000"
      },
      {
        "id": "nc-button-accent-border",
        "label": "Accent Border",
        "type": "color",
        "default": "transparent"
      },
      {
        "id": "nc-button-outline-bg",
        "label": "Outline BG",
        "type": "color",
        "default": "transparent"
      },
      {
        "id": "nc-button-outline-bg-hover",
        "label": "Outline BG Hover",
        "type": "color",
        "ref": "background-secondary"
      },
      {
        "id": "nc-button-outline-bg-active",
        "label": "Outline BG Active",
        "type": "color",
        "ref": "background-tertiary"
      },
      {
        "id": "nc-button-outline-color",
        "label": "Outline Text",
        "type": "color",
        "ref": "text-primary"
      },
      {
        "id": "nc-button-outline-border",
        "label": "Outline Border",
        "type": "color",
        "ref": "border-primary"
      },
      {
        "id": "nc-button-ghost-bg",
        "label": "Ghost BG",
        "type": "color",
        "default": "transparent"
      },
      {
        "id": "nc-button-ghost-bg-hover",
        "label": "Ghost BG Hover",
        "type": "color",
        "ref": "background-secondary"
      },
      {
        "id": "nc-button-ghost-bg-active",
        "label": "Ghost BG Active",
        "type": "color",
        "ref": "background-tertiary"
      },
      {
        "id": "nc-button-ghost-color",
        "label": "Ghost Text",
        "type": "color",
        "ref": "text-primary"
      },
      {
        "id": "nc-button-ghost-border",
        "label": "Ghost Border",
        "type": "color",
        "default": "transparent"
      },
      {
        "id": "nc-button-success-bg",
        "label": "Success BG",
        "type": "color",
        "ref": "feedback-success"
      },
      {
        "id": "nc-button-success-bg-hover",
        "label": "Success BG Hover",
        "type": "color",
        "default": "#1f893d",
        "darkDefault": "#45af63"
      },
      {
        "id": "nc-button-success-bg-active",
        "label": "Success BG Active",
        "type": "color",
        "default": "#1b7936",
        "darkDefault": "#5bb976"
      },
      {
        "id": "nc-button-success-color",
        "label": "Success Text",
        "type": "color",
        "default": "#ffffff"
      },
      {
        "id": "nc-button-success-border",
        "label": "Success Border",
        "type": "color",
        "default": "transparent"
      },
      {
        "id": "nc-button-warning-bg",
        "label": "Warning BG",
        "type": "color",
        "ref": "feedback-warning"
      },
      {
        "id": "nc-button-warning-bg-hover",
        "label": "Warning BG Hover",
        "type": "color",
        "default": "#b48b00",
        "darkDefault": "#dab226"
      },
      {
        "id": "nc-button-warning-bg-active",
        "label": "Warning BG Active",
        "type": "color",
        "default": "#9f7b00",
        "darkDefault": "#dfbb40"
      },
      {
        "id": "nc-button-warning-color",
        "label": "Warning Text",
        "type": "color",
        "default": "#000000"
      },
      {
        "id": "nc-button-warning-border",
        "label": "Warning Border",
        "type": "color",
        "default": "transparent"
      },
      {
        "id": "nc-button-info-bg",
        "label": "Info BG",
        "type": "color",
        "ref": "feedback-info"
      },
      {
        "id": "nc-button-info-bg-hover",
        "label": "Info BG Hover",
        "type": "color",
        "default": "#3b74d9",
        "darkDefault": "#619bff"
      },
      {
        "id": "nc-button-info-bg-active",
        "label": "Info BG Active",
        "type": "color",
        "default": "#3467bf",
        "darkDefault": "#74a7ff"
      },
      {
        "id": "nc-button-info-color",
        "label": "Info Text",
        "type": "color",
        "default": "#ffffff"
      },
      {
        "id": "nc-button-info-border",
        "label": "Info Border",
        "type": "color",
        "default": "transparent"
      },
      {
        "id": "nc-button-error-bg",
        "label": "Error BG",
        "type": "color",
        "ref": "feedback-danger"
      },
      {
        "id": "nc-button-error-bg-hover",
        "label": "Error BG Hover",
        "type": "color",
        "default": "#d54149",
        "darkDefault": "#fb686f"
      },
      {
        "id": "nc-button-error-bg-active",
        "label": "Error BG Active",
        "type": "color",
        "default": "#bc3a41",
        "darkDefault": "#fb7a80"
      },
      {
        "id": "nc-button-error-color",
        "label": "Error Text",
        "type": "color",
        "default": "#ffffff"
      },
      {
        "id": "nc-button-error-border",
        "label": "Error Border",
        "type": "color",
        "ref": "feedback-danger"
      },
      {
        "id": "nc-button-disabled-bg",
        "label": "Disabled BG",
        "type": "color",
        "ref": "background-disabled"
      },
      {
        "id": "nc-button-disabled-color",
        "label": "Disabled Text",
        "type": "color",
        "ref": "text-disabled"
      },
      {
        "id": "nc-button-disabled-border",
        "label": "Disabled Border",
        "type": "color",
        "ref": "border-secondary"
      },
      {
        "id": "nc-icon-button-size",
        "label": "Icon Button Size",
        "type": "size",
        "default": "48px"
      },
      {
        "id": "nc-icon-button-padding",
        "label": "Icon Button Padding",
        "type": "size",
        "default": "8px"
      },
      {
        "id": "nc-icon-button-radius",
        "label": "Icon Button Radius",
        "type": "size",
        "default": "4px"
      },
      {
        "id": "nc-icon-button-bg",
        "label": "Icon Button BG",
        "type": "color",
        "ref": "background-secondary"
      },
      {
        "id": "nc-icon-button-bg-hover",
        "label": "Icon Button BG Hover",
        "type": "color",
        "ref": "background-tertiary"
      },
      {
        "id": "nc-icon-button-color",
        "label": "Icon Button Color",
        "type": "color",
        "ref": "text-primary"
      },
      {
        "id": "nc-button-spinner-size",
        "label": "Spinner Size",
        "type": "size",
        "default": "20px"
      },
      {
        "id": "nc-button-spinner-border-width",
        "label": "Spinner Border Width",
        "type": "size",
        "default": "2px"
      },
      {
        "id": "nc-button-touch-target-min",
        "label": "Touch Target Min",
        "type": "size",
        "default": "44px"
      },
      {
        "id": "nc-button-inverted-color",
        "label": "Inverted Color",
        "type": "color",
        "default": "var(--fnd-color-always-dark)"
      },
      {
        "id": "nc-button-inverted-border",
        "label": "Inverted Border",
        "type": "color",
        "default": "var(--fnd-color-always-light)"
      },
      {
        "id": "nc-button-soft-color",
        "label": "Soft Color",
        "type": "color",
        "ref": "interactive-default"
      },
      {
        "id": "nc-button-soft-border",
        "label": "Soft Border",
        "type": "color",
        "default": "transparent"
      },
      {
        "id": "nc-button-fab-size",
        "label": "Fab Size",
        "type": "size",
        "default": "56px"
      },
      {
        "id": "nc-button-fab-radius",
        "label": "Fab Radius",
        "type": "radius",
        "default": "var(--fnd-radius-full)"
      },
      {
        "id": "nc-button-fab-shadow",
        "label": "Fab Shadow",
        "type": "color",
        "default": "var(--fnd-elevation-overlay)"
      },
      {
        "id": "nc-button-fab-shadow-hover",
        "label": "Fab Shadow Hover",
        "type": "color",
        "default": "var(--fnd-elevation-navigation)"
      }
    ]
  },
  {
    "id": "input",
    "label": "Input",
    "icon": "forms",
    "tokens": [
      {
        "id": "nc-input-height-sm",
        "label": "Height SM",
        "type": "size",
        "default": "32px"
      },
      {
        "id": "nc-input-height-md",
        "label": "Height MD",
        "type": "size",
        "default": "40px"
      },
      {
        "id": "nc-input-height-lg",
        "label": "Height LG",
        "type": "size",
        "default": "48px"
      },
      {
        "id": "nc-input-radius",
        "label": "Radius",
        "type": "size",
        "default": "4px"
      },
      {
        "id": "nc-input-bg",
        "label": "Background",
        "type": "color",
        "ref": "background-base"
      },
      {
        "id": "nc-input-color",
        "label": "Text Color",
        "type": "color",
        "ref": "text-primary"
      },
      {
        "id": "nc-input-border",
        "label": "Border Color",
        "type": "color",
        "ref": "border-primary"
      },
      {
        "id": "nc-input-placeholder",
        "label": "Placeholder",
        "type": "color",
        "ref": "text-tertiary"
      },
      {
        "id": "nc-input-border-hover",
        "label": "Border Hover",
        "type": "color",
        "ref": "border-strong"
      },
      {
        "id": "nc-input-border-focus",
        "label": "Border Focus",
        "type": "color",
        "ref": "interactive-focus"
      },
      {
        "id": "nc-input-border-error",
        "label": "Border Error",
        "type": "color",
        "ref": "border-danger"
      },
      {
        "id": "nc-input-border-success",
        "label": "Border Success",
        "type": "color",
        "ref": "border-success"
      },
      {
        "id": "nc-input-border-width",
        "label": "Border Width",
        "type": "size",
        "ref": "border-width-xs"
      },
      {
        "id": "nc-input-padding-x-sm",
        "label": "Padding X SM",
        "type": "spacing",
        "ref": "spacing-03"
      },
      {
        "id": "nc-input-padding-x-md",
        "label": "Padding X MD",
        "type": "spacing",
        "ref": "spacing-04"
      },
      {
        "id": "nc-input-padding-x-lg",
        "label": "Padding X LG",
        "type": "spacing",
        "ref": "spacing-05"
      },
      {
        "id": "nc-input-padding-y-sm",
        "label": "Padding Y SM",
        "type": "spacing",
        "ref": "spacing-01"
      },
      {
        "id": "nc-input-padding-y-md",
        "label": "Padding Y MD",
        "type": "spacing",
        "ref": "spacing-02"
      },
      {
        "id": "nc-input-padding-y-lg",
        "label": "Padding Y LG",
        "type": "spacing",
        "ref": "spacing-03"
      },
      {
        "id": "nc-input-font-size-sm",
        "label": "Font Size SM",
        "type": "font-size",
        "ref": "fs-xs"
      },
      {
        "id": "nc-input-font-size-md",
        "label": "Font Size MD",
        "type": "font-size",
        "ref": "fs-base"
      },
      {
        "id": "nc-input-font-size-lg",
        "label": "Font Size LG",
        "type": "font-size",
        "ref": "fs-base"
      },
      {
        "id": "nc-input-disabled-bg",
        "label": "Disabled BG",
        "type": "color",
        "ref": "background-disabled"
      },
      {
        "id": "nc-input-disabled-color",
        "label": "Disabled Text",
        "type": "color",
        "ref": "text-disabled"
      },
      {
        "id": "nc-input-disabled-border",
        "label": "Disabled Border",
        "type": "color",
        "ref": "border-secondary"
      },
      {
        "id": "nc-input-disabled-opacity",
        "label": "Disabled Opacity",
        "type": "opacity",
        "ref": "opacity-disabled"
      },
      {
        "id": "nc-input-bg-readonly",
        "label": "Readonly BG",
        "type": "color",
        "ref": "background-secondary"
      },
      {
        "id": "nc-input-border-readonly",
        "label": "Readonly Border",
        "type": "color",
        "ref": "border-secondary"
      },
      {
        "id": "nc-input-transition-duration",
        "label": "Transition",
        "type": "duration",
        "ref": "motion-duration-200"
      },
      {
        "id": "nc-input-icon-size",
        "label": "Icon Size",
        "type": "size",
        "default": "20px"
      },
      {
        "id": "nc-input-icon-color",
        "label": "Icon Color",
        "type": "color",
        "ref": "text-secondary"
      },
      {
        "id": "nc-input-group-addon-bg",
        "label": "Addon BG",
        "type": "color",
        "ref": "background-secondary"
      },
      {
        "id": "nc-input-group-addon-color",
        "label": "Addon Color",
        "type": "color",
        "ref": "text-secondary"
      },
      {
        "id": "nc-input-group-addon-border",
        "label": "Addon Border",
        "type": "color",
        "ref": "border-primary"
      },
      {
        "id": "nc-input-group-addon-padding-x",
        "label": "Addon Padding X",
        "type": "spacing",
        "ref": "spacing-03"
      },
      {
        "id": "nc-input-group-addon-font-size",
        "label": "Addon Font Size",
        "type": "font-size",
        "default": "var(--nc-input-font-size-md)"
      },
      {
        "id": "nc-input-filled-bg",
        "label": "Filled BG",
        "type": "color",
        "default": "var(--nc-form-control-filled-bg)"
      },
      {
        "id": "nc-input-filled-bg-hover",
        "label": "Filled BG Hover",
        "type": "color",
        "default": "var(--nc-form-control-filled-bg-hover)"
      },
      {
        "id": "nc-input-filled-bg-focus",
        "label": "Filled BG Focus",
        "type": "color",
        "default": "var(--nc-form-control-filled-bg-focus)"
      },
      {
        "id": "nc-input-filled-underline-width",
        "label": "Filled Underline Width",
        "type": "size",
        "default": "var(--nc-form-control-filled-border-bottom)"
      },
      {
        "id": "nc-input-filled-underline-color",
        "label": "Filled Underline Color",
        "type": "color",
        "default": "var(--nc-form-control-filled-underline-color)"
      },
      {
        "id": "nc-input-filled-underline-color-focus",
        "label": "Filled Underline Color Focus",
        "type": "color",
        "default": "var(--nc-form-control-filled-underline-color-focus)"
      },
      {
        "id": "nc-input-borderless-bg-hover",
        "label": "Borderless BG Hover",
        "type": "color",
        "default": "var(--nc-form-control-minimal-bg-hover)"
      },
      {
        "id": "nc-input-borderless-underline-focus",
        "label": "Borderless Underline Focus",
        "type": "generic",
        "default": "var(--nc-form-control-minimal-border-focus)"
      },
      {
        "id": "nc-input-label-color",
        "label": "Label Color",
        "type": "color",
        "ref": "text-secondary"
      },
      {
        "id": "nc-input-label-color-focus",
        "label": "Label Color Focus",
        "type": "color",
        "ref": "interactive-focus"
      },
      {
        "id": "nc-input-label-font-size",
        "label": "Label Font Size",
        "type": "size",
        "default": "var(--fs-base)"
      },
      {
        "id": "nc-input-label-font-size-float",
        "label": "Label Font Size Float",
        "type": "size",
        "default": "var(--fs-xs)"
      },
      {
        "id": "nc-input-label-offset-y",
        "label": "Label Offset Y",
        "type": "spacing",
        "default": "var(--fnd-spacing-02)"
      },
      {
        "id": "nc-input-label-scale",
        "label": "Label Scale",
        "type": "generic",
        "default": "0.75"
      },
      {
        "id": "nc-input-label-padding-top",
        "label": "Label Padding Top",
        "type": "spacing",
        "default": "var(--fnd-spacing-05)"
      },
      {
        "id": "nc-input-affix-color",
        "label": "Affix Color",
        "type": "color",
        "ref": "text-secondary"
      },
      {
        "id": "nc-input-affix-font-size",
        "label": "Affix Font Size",
        "type": "size",
        "default": "var(--fs-sm)"
      },
      {
        "id": "nc-input-affix-padding-x",
        "label": "Affix Padding X",
        "type": "spacing",
        "default": "var(--fnd-spacing-03)"
      },
      {
        "id": "nc-input-affix-bg",
        "label": "Affix BG",
        "type": "color",
        "ref": "background-secondary"
      },
      {
        "id": "nc-input-affix-border",
        "label": "Affix Border",
        "type": "color",
        "ref": "border-primary"
      },
      {
        "id": "nc-input-clear-size",
        "label": "Clear Size",
        "type": "size",
        "default": "16px"
      },
      {
        "id": "nc-input-clear-color",
        "label": "Clear Color",
        "type": "color",
        "ref": "text-tertiary"
      },
      {
        "id": "nc-input-clear-color-hover",
        "label": "Clear Color Hover",
        "type": "color",
        "ref": "text-primary"
      },
      {
        "id": "nc-input-touch-area-min",
        "label": "Touch Area Min",
        "type": "size",
        "default": "44px"
      }
    ],
    "subgroups": [
      {
        "id": "geometry",
        "label": "Geometry",
        "tokenIds": [
          "nc-input-height-sm",
          "nc-input-height-md",
          "nc-input-height-lg",
          "nc-input-radius",
          "nc-input-border-width",
          "nc-input-padding-x-sm",
          "nc-input-padding-x-md",
          "nc-input-padding-x-lg",
          "nc-input-padding-y-sm",
          "nc-input-padding-y-md",
          "nc-input-padding-y-lg",
          "nc-input-filled-underline-width",
          "nc-input-label-offset-y",
          "nc-input-label-padding-top",
          "nc-input-affix-padding-x",
          "nc-input-clear-size",
          "nc-input-touch-area-min"
        ]
      },
      {
        "id": "typography",
        "label": "Typography",
        "tokenIds": [
          "nc-input-font-size-sm",
          "nc-input-font-size-md",
          "nc-input-font-size-lg",
          "nc-input-label-font-size",
          "nc-input-label-font-size-float",
          "nc-input-affix-font-size"
        ]
      },
      {
        "id": "colors",
        "label": "Colors",
        "tokenIds": [
          "nc-input-bg",
          "nc-input-color",
          "nc-input-border",
          "nc-input-placeholder",
          "nc-input-filled-bg",
          "nc-input-filled-bg-hover",
          "nc-input-filled-bg-focus",
          "nc-input-filled-underline-color",
          "nc-input-filled-underline-color-focus",
          "nc-input-borderless-bg-hover",
          "nc-input-label-color",
          "nc-input-label-color-focus",
          "nc-input-affix-color",
          "nc-input-affix-bg",
          "nc-input-affix-border",
          "nc-input-clear-color",
          "nc-input-clear-color-hover"
        ]
      },
      {
        "id": "interactive",
        "label": "Interactive",
        "tokenIds": [
          "nc-input-border-hover",
          "nc-input-border-focus",
          "nc-input-border-error",
          "nc-input-border-success"
        ]
      },
      {
        "id": "disabled",
        "label": "Disabled",
        "tokenIds": [
          "nc-input-disabled-bg",
          "nc-input-disabled-color",
          "nc-input-disabled-border",
          "nc-input-disabled-opacity"
        ]
      },
      {
        "id": "readonly",
        "label": "Readonly",
        "tokenIds": [
          "nc-input-bg-readonly",
          "nc-input-border-readonly"
        ]
      },
      {
        "id": "icon",
        "label": "Icon",
        "tokenIds": [
          "nc-input-icon-size",
          "nc-input-icon-color"
        ]
      },
      {
        "id": "interaction",
        "label": "Interaction",
        "tokenIds": [
          "nc-input-transition-duration",
          "nc-input-label-scale"
        ]
      },
      {
        "id": "input-group",
        "label": "Input Group Addon",
        "tokenIds": [
          "nc-input-group-addon-bg",
          "nc-input-group-addon-color",
          "nc-input-group-addon-border",
          "nc-input-group-addon-padding-x",
          "nc-input-group-addon-font-size"
        ]
      },
      {
        "id": "other",
        "label": "Weitere",
        "tokenIds": [
          "nc-input-borderless-underline-focus"
        ]
      }
    ]
  },
  {
    "id": "select",
    "label": "Select",
    "icon": "select",
    "tokens": [
      {
        "id": "nc-select-indicator-size",
        "label": "Indicator Size",
        "type": "size",
        "default": "20px"
      },
      {
        "id": "nc-select-indicator-color",
        "label": "Indicator Color",
        "type": "color",
        "ref": "text-secondary"
      },
      {
        "id": "nc-select-padding-right",
        "label": "Padding Right",
        "type": "spacing",
        "ref": "spacing-08"
      },
      {
        "id": "nc-select-optgroup-font-weight",
        "label": "Optgroup Font Weight",
        "type": "fontWeight",
        "default": "var(--fnd-font-weight-semibold)"
      },
      {
        "id": "nc-select-optgroup-padding-left",
        "label": "Optgroup Padding Left",
        "type": "spacing",
        "default": "var(--fnd-spacing-02)"
      }
    ],
    "subgroups": [
      {
        "id": "indicator",
        "label": "Indicator",
        "tokenIds": [
          "nc-select-indicator-size",
          "nc-select-indicator-color"
        ]
      },
      {
        "id": "geometry",
        "label": "Geometry",
        "tokenIds": [
          "nc-select-padding-right",
          "nc-select-optgroup-padding-left"
        ]
      },
      {
        "id": "typography",
        "label": "Typografie",
        "tokenIds": [
          "nc-select-optgroup-font-weight"
        ]
      }
    ]
  },
  {
    "id": "textarea",
    "label": "Textarea",
    "icon": "forms",
    "tokens": [
      {
        "id": "nc-textarea-min-height",
        "label": "Min Height",
        "type": "size",
        "default": "80px"
      },
      {
        "id": "nc-textarea-padding",
        "label": "Padding",
        "type": "size",
        "default": "var(--fnd-spacing-03) var(--fnd-spacing-04)"
      },
      {
        "id": "nc-textarea-resize",
        "label": "Resize",
        "type": "keyword",
        "default": "vertical"
      },
      {
        "id": "nc-textarea-max-height",
        "label": "Max Height",
        "type": "size",
        "default": "none"
      },
      {
        "id": "nc-textarea-scrollbar-width",
        "label": "Scrollbar Width",
        "type": "size",
        "default": "thin"
      },
      {
        "id": "nc-textarea-actions-gap",
        "label": "Actions Gap",
        "type": "spacing",
        "default": "var(--fnd-spacing-02)"
      },
      {
        "id": "nc-textarea-actions-padding",
        "label": "Actions Padding",
        "type": "spacing",
        "default": "var(--fnd-spacing-02) var(--fnd-spacing-03)"
      }
    ],
    "subGroups": [
      {
        "id": "geometry",
        "label": "Geometry",
        "tokenIds": [
          "nc-textarea-min-height",
          "nc-textarea-padding",
          "nc-textarea-resize"
        ]
      }
    ],
    "subgroups": [
      {
        "id": "geometry",
        "label": "Geometrie",
        "tokenIds": [
          "nc-textarea-max-height",
          "nc-textarea-scrollbar-width",
          "nc-textarea-actions-gap",
          "nc-textarea-actions-padding"
        ]
      }
    ]
  },
  {
    "id": "segmented-control",
    "label": "Segmented Control",
    "icon": "layout-navbar",
    "tokens": [
      {
        "id": "nc-segmented-bg",
        "label": "Track BG",
        "type": "color",
        "default": "var(--fnd-color-background-secondary)"
      },
      {
        "id": "nc-segmented-radius",
        "label": "Track Radius",
        "type": "size",
        "default": "var(--nc-button-radius-md)"
      },
      {
        "id": "nc-segmented-padding",
        "label": "Track Padding",
        "type": "size",
        "default": "2px"
      },
      {
        "id": "nc-segmented-gap",
        "label": "Track Gap",
        "type": "size",
        "default": "2px"
      },
      {
        "id": "nc-segmented-item-bg",
        "label": "Item BG",
        "type": "color",
        "default": "transparent"
      },
      {
        "id": "nc-segmented-item-color",
        "label": "Item Color",
        "type": "color",
        "default": "var(--fnd-color-text-secondary)"
      },
      {
        "id": "nc-segmented-item-radius",
        "label": "Item Radius",
        "type": "size",
        "default": "var(--fnd-radius-sm)"
      },
      {
        "id": "nc-segmented-item-bg-hover",
        "label": "Item BG Hover",
        "type": "color",
        "default": "var(--fnd-color-background-tertiary)"
      },
      {
        "id": "nc-segmented-item-color-hover",
        "label": "Item Color Hover",
        "type": "color",
        "default": "var(--fnd-color-text-primary)"
      },
      {
        "id": "nc-segmented-item-selected-bg",
        "label": "Selected BG",
        "type": "color",
        "default": "var(--fnd-color-background-base)"
      },
      {
        "id": "nc-segmented-item-selected-color",
        "label": "Selected Color",
        "type": "color",
        "default": "var(--fnd-color-text-primary)"
      },
      {
        "id": "nc-segmented-item-selected-shadow",
        "label": "Selected Shadow",
        "type": "shadow",
        "default": "var(--fnd-elevation-base)"
      },
      {
        "id": "nc-segmented-item-disabled-color",
        "label": "Disabled Color",
        "type": "color",
        "default": "var(--fnd-color-text-disabled)"
      },
      {
        "id": "nc-segmented-item-disabled-opacity",
        "label": "Disabled Opacity",
        "type": "number",
        "default": "var(--fnd-opacity-disabled)"
      },
      {
        "id": "nc-segmented-transition-duration",
        "label": "Transition Duration",
        "type": "duration",
        "default": "var(--fnd-motion-duration-200)"
      }
    ],
    "subGroups": [
      {
        "id": "track",
        "label": "Track",
        "tokenIds": [
          "nc-segmented-bg",
          "nc-segmented-radius",
          "nc-segmented-padding",
          "nc-segmented-gap"
        ]
      },
      {
        "id": "item-default",
        "label": "Item Default",
        "tokenIds": [
          "nc-segmented-item-bg",
          "nc-segmented-item-color",
          "nc-segmented-item-radius"
        ]
      },
      {
        "id": "item-hover",
        "label": "Item Hover",
        "tokenIds": [
          "nc-segmented-item-bg-hover",
          "nc-segmented-item-color-hover"
        ]
      },
      {
        "id": "item-selected",
        "label": "Item Selected",
        "tokenIds": [
          "nc-segmented-item-selected-bg",
          "nc-segmented-item-selected-color",
          "nc-segmented-item-selected-shadow"
        ]
      },
      {
        "id": "item-disabled",
        "label": "Item Disabled",
        "tokenIds": [
          "nc-segmented-item-disabled-color",
          "nc-segmented-item-disabled-opacity"
        ]
      },
      {
        "id": "animation",
        "label": "Animation",
        "tokenIds": [
          "nc-segmented-transition-duration"
        ]
      }
    ]
  },
  {
    "id": "toggle-group",
    "label": "Toggle Group",
    "icon": "layout-navbar",
    "tokens": [
      {
        "id": "nc-toggle-group-gap",
        "label": "Gap",
        "type": "size",
        "default": "0"
      },
      {
        "id": "nc-toggle-group-radius",
        "label": "Radius",
        "type": "size",
        "default": "var(--nc-button-radius-md)"
      },
      {
        "id": "nc-toggle-group-border",
        "label": "Border Color",
        "type": "color",
        "default": "var(--fnd-color-border-primary)"
      },
      {
        "id": "nc-toggle-group-bg",
        "label": "BG",
        "type": "color",
        "default": "var(--fnd-color-background-secondary)"
      },
      {
        "id": "nc-toggle-group-item-bg",
        "label": "Item BG",
        "type": "color",
        "default": "transparent"
      },
      {
        "id": "nc-toggle-group-item-color",
        "label": "Item Color",
        "type": "color",
        "default": "var(--fnd-color-text-primary)"
      },
      {
        "id": "nc-toggle-group-item-border",
        "label": "Item Border",
        "type": "color",
        "default": "var(--fnd-color-border-secondary)"
      },
      {
        "id": "nc-toggle-group-item-bg-hover",
        "label": "Item BG Hover",
        "type": "color",
        "default": "var(--fnd-color-background-tertiary)"
      },
      {
        "id": "nc-toggle-group-item-selected-bg",
        "label": "Selected BG",
        "type": "color",
        "default": "var(--fnd-color-interactive-default)"
      },
      {
        "id": "nc-toggle-group-item-selected-color",
        "label": "Selected Color",
        "type": "color",
        "default": "var(--fnd-color-text-on-interactive)"
      },
      {
        "id": "nc-toggle-group-item-selected-border",
        "label": "Selected Border",
        "type": "color",
        "default": "var(--fnd-color-interactive-default)"
      },
      {
        "id": "nc-toggle-group-item-disabled-bg",
        "label": "Disabled BG",
        "type": "color",
        "default": "var(--fnd-color-background-disabled)"
      },
      {
        "id": "nc-toggle-group-item-disabled-color",
        "label": "Disabled Color",
        "type": "color",
        "default": "var(--fnd-color-text-disabled)"
      },
      {
        "id": "nc-toggle-group-item-disabled-opacity",
        "label": "Disabled Opacity",
        "type": "number",
        "default": "var(--fnd-opacity-disabled)"
      },
      {
        "id": "nc-toggle-group-transition-duration",
        "label": "Transition Duration",
        "type": "duration",
        "default": "var(--fnd-motion-duration-200)"
      },
      {
        "id": "nc-toggle-group-shadow",
        "label": "Shadow",
        "type": "color",
        "default": "none"
      },
      {
        "id": "nc-toggle-group-item-soft-bg",
        "label": "Item Soft BG",
        "type": "color",
        "default": "color-mix(in srgb, var(--fnd-color-interactive-default) 12%, transparent)"
      },
      {
        "id": "nc-toggle-group-item-soft-color",
        "label": "Item Soft Color",
        "type": "color",
        "ref": "interactive-default"
      },
      {
        "id": "nc-toggle-group-underline-width",
        "label": "Underline Width",
        "type": "size",
        "default": "2px"
      },
      {
        "id": "nc-toggle-group-underline-color",
        "label": "Underline Color",
        "type": "color",
        "ref": "interactive-default"
      },
      {
        "id": "nc-toggle-group-divider-width",
        "label": "Divider Width",
        "type": "size",
        "default": "1px"
      },
      {
        "id": "nc-toggle-group-divider-height",
        "label": "Divider Height",
        "type": "size",
        "default": "50%"
      },
      {
        "id": "nc-toggle-group-divider-color",
        "label": "Divider Color",
        "type": "color",
        "ref": "border-secondary"
      }
    ],
    "subGroups": [
      {
        "id": "container",
        "label": "Container",
        "tokenIds": [
          "nc-toggle-group-gap",
          "nc-toggle-group-radius",
          "nc-toggle-group-border",
          "nc-toggle-group-bg"
        ]
      },
      {
        "id": "item-default",
        "label": "Item Default",
        "tokenIds": [
          "nc-toggle-group-item-bg",
          "nc-toggle-group-item-color",
          "nc-toggle-group-item-border"
        ]
      },
      {
        "id": "item-hover",
        "label": "Item Hover",
        "tokenIds": [
          "nc-toggle-group-item-bg-hover"
        ]
      },
      {
        "id": "item-selected",
        "label": "Item Selected",
        "tokenIds": [
          "nc-toggle-group-item-selected-bg",
          "nc-toggle-group-item-selected-color",
          "nc-toggle-group-item-selected-border"
        ]
      },
      {
        "id": "item-disabled",
        "label": "Item Disabled",
        "tokenIds": [
          "nc-toggle-group-item-disabled-bg",
          "nc-toggle-group-item-disabled-color",
          "nc-toggle-group-item-disabled-opacity"
        ]
      },
      {
        "id": "animation",
        "label": "Animation",
        "tokenIds": [
          "nc-toggle-group-transition-duration"
        ]
      }
    ],
    "subgroups": [
      {
        "id": "geometry",
        "label": "Geometrie",
        "tokenIds": [
          "nc-toggle-group-underline-width",
          "nc-toggle-group-divider-width",
          "nc-toggle-group-divider-height"
        ]
      },
      {
        "id": "colors",
        "label": "Farben",
        "category": "main",
        "tokenIds": [
          "nc-toggle-group-shadow",
          "nc-toggle-group-item-soft-bg",
          "nc-toggle-group-item-soft-color",
          "nc-toggle-group-underline-color",
          "nc-toggle-group-divider-color"
        ]
      }
    ]
  },
  {
    "id": "icon",
    "label": "Icon",
    "icon": "icons",
    "tokens": [
      {
        "id": "nc-icon-size-xs",
        "label": "Size XS",
        "type": "size",
        "default": "16px"
      },
      {
        "id": "nc-icon-size-sm",
        "label": "Size SM",
        "type": "size",
        "default": "20px"
      },
      {
        "id": "nc-icon-size-md",
        "label": "Size MD",
        "type": "size",
        "default": "24px"
      },
      {
        "id": "nc-icon-size-lg",
        "label": "Size LG",
        "type": "size",
        "default": "28px"
      },
      {
        "id": "nc-icon-size-xl",
        "label": "Size XL",
        "type": "size",
        "default": "32px"
      },
      {
        "id": "nc-icon-size-2xl",
        "label": "Size 2XL",
        "type": "size",
        "default": "36px"
      },
      {
        "id": "nc-icon-size-2xs",
        "label": "Size 2XS (deprecated)",
        "type": "size",
        "default": "12px"
      },
      {
        "id": "nc-icon-color-default",
        "label": "Color Default",
        "type": "color",
        "default": "var(--fnd-color-text-primary)"
      },
      {
        "id": "nc-icon-color-secondary",
        "label": "Color Secondary",
        "type": "color",
        "default": "var(--fnd-color-text-secondary)"
      },
      {
        "id": "nc-icon-color-tertiary",
        "label": "Color Tertiary",
        "type": "color",
        "default": "var(--fnd-color-text-tertiary)"
      },
      {
        "id": "nc-icon-color-inverse",
        "label": "Color Inverse",
        "type": "color",
        "default": "var(--fnd-color-text-inverse)"
      },
      {
        "id": "nc-icon-color-disabled",
        "label": "Color Disabled",
        "type": "color",
        "default": "var(--fnd-color-text-disabled)"
      },
      {
        "id": "nc-icon-touch-target",
        "label": "Touch Target",
        "type": "size",
        "default": "44px"
      },
      {
        "id": "nc-icon-button-size",
        "label": "Icon Button Size",
        "type": "size",
        "default": "var(--nc-button-height-lg)"
      },
      {
        "id": "nc-icon-button-padding",
        "label": "Icon Button Padding",
        "type": "size",
        "default": "var(--fnd-spacing-02)"
      },
      {
        "id": "nc-icon-button-radius",
        "label": "Icon Button Radius",
        "type": "size",
        "default": "var(--nc-button-radius-md)"
      },
      {
        "id": "nc-icon-button-bg",
        "label": "Icon Button BG",
        "type": "color",
        "default": "var(--fnd-color-background-secondary)"
      },
      {
        "id": "nc-icon-button-bg-hover",
        "label": "Icon Button BG Hover",
        "type": "color",
        "default": "var(--fnd-color-background-tertiary)"
      },
      {
        "id": "nc-icon-button-color",
        "label": "Icon Button Color",
        "type": "color",
        "default": "var(--fnd-color-text-primary)"
      }
    ],
    "subGroups": [
      {
        "id": "sizing",
        "label": "Sizing",
        "tokenIds": [
          "nc-icon-size-xs",
          "nc-icon-size-sm",
          "nc-icon-size-md",
          "nc-icon-size-lg",
          "nc-icon-size-xl",
          "nc-icon-size-2xl",
          "nc-icon-size-2xs"
        ]
      },
      {
        "id": "colors",
        "label": "Colors",
        "tokenIds": [
          "nc-icon-color-default",
          "nc-icon-color-secondary",
          "nc-icon-color-tertiary",
          "nc-icon-color-inverse",
          "nc-icon-color-disabled"
        ]
      },
      {
        "id": "interaction",
        "label": "Interaction",
        "tokenIds": [
          "nc-icon-touch-target"
        ]
      },
      {
        "id": "icon-button",
        "label": "Icon Button",
        "tokenIds": [
          "nc-icon-button-size",
          "nc-icon-button-padding",
          "nc-icon-button-radius",
          "nc-icon-button-bg",
          "nc-icon-button-bg-hover",
          "nc-icon-button-color"
        ]
      }
    ],
    "subgroups": []
  },
  {
    "id": "progress",
    "label": "Progress",
    "icon": "progress",
    "tokens": [
      {
        "id": "nc-progress-bg",
        "label": "Track BG",
        "type": "color",
        "default": "var(--fnd-color-background-tertiary)"
      },
      {
        "id": "nc-progress-fill",
        "label": "Fill Color",
        "type": "color",
        "default": "var(--fnd-color-interactive-default)"
      },
      {
        "id": "nc-progress-radius",
        "label": "Radius",
        "type": "size",
        "default": "var(--fnd-radius-full)"
      },
      {
        "id": "nc-progress-transition",
        "label": "Transition Duration",
        "type": "duration",
        "default": "var(--fnd-motion-duration-300)"
      },
      {
        "id": "nc-progress-ease",
        "label": "Easing",
        "type": "keyword",
        "default": "var(--fnd-motion-ease-ease-out)"
      },
      {
        "id": "nc-progress-height-xs",
        "label": "Height XS",
        "type": "size",
        "default": "2px"
      },
      {
        "id": "nc-progress-height-sm",
        "label": "Height SM",
        "type": "size",
        "default": "4px"
      },
      {
        "id": "nc-progress-height-md",
        "label": "Height MD",
        "type": "size",
        "default": "8px"
      },
      {
        "id": "nc-progress-height-lg",
        "label": "Height LG",
        "type": "size",
        "default": "12px"
      },
      {
        "id": "nc-progress-fill-success",
        "label": "Fill Success",
        "type": "color",
        "default": "var(--fnd-color-feedback-success)"
      },
      {
        "id": "nc-progress-fill-warning",
        "label": "Fill Warning",
        "type": "color",
        "default": "var(--fnd-color-feedback-warning)"
      },
      {
        "id": "nc-progress-fill-danger",
        "label": "Fill Danger",
        "type": "color",
        "default": "var(--fnd-color-feedback-danger)"
      },
      {
        "id": "nc-progress-fill-info",
        "label": "Fill Info",
        "type": "color",
        "default": "var(--fnd-color-feedback-info)"
      },
      {
        "id": "nc-progress-label-color",
        "label": "Label Color",
        "type": "color",
        "default": "var(--fnd-color-text-secondary)"
      },
      {
        "id": "nc-progress-label-size",
        "label": "Label Font Size",
        "type": "size",
        "default": "var(--fs-xs)"
      },
      {
        "id": "nc-progress-label-weight",
        "label": "Label Font Weight",
        "type": "keyword",
        "default": "var(--fnd-font-weight-medium)"
      },
      {
        "id": "nc-progress-label-gap",
        "label": "Label Gap",
        "type": "size",
        "default": "var(--fnd-spacing-02)"
      }
    ],
    "subGroups": [
      {
        "id": "core",
        "label": "Core",
        "tokenIds": [
          "nc-progress-bg",
          "nc-progress-fill",
          "nc-progress-radius"
        ]
      },
      {
        "id": "sizing",
        "label": "Sizing",
        "tokenIds": [
          "nc-progress-height-xs",
          "nc-progress-height-sm",
          "nc-progress-height-md",
          "nc-progress-height-lg"
        ]
      },
      {
        "id": "feedback",
        "label": "Feedback Colors",
        "tokenIds": [
          "nc-progress-fill-success",
          "nc-progress-fill-warning",
          "nc-progress-fill-danger",
          "nc-progress-fill-info"
        ]
      },
      {
        "id": "label",
        "label": "Label",
        "tokenIds": [
          "nc-progress-label-color",
          "nc-progress-label-size",
          "nc-progress-label-weight",
          "nc-progress-label-gap"
        ]
      },
      {
        "id": "animation",
        "label": "Animation",
        "tokenIds": [
          "nc-progress-transition",
          "nc-progress-ease"
        ]
      }
    ],
    "subgroups": []
  },
  {
    "id": "tag",
    "label": "Tag",
    "icon": "tag",
    "tokens": [
      {
        "id": "nc-tag-height-sm",
        "label": "Height SM",
        "type": "size",
        "default": "var(--nc-button-height-xs)"
      },
      {
        "id": "nc-tag-height-md",
        "label": "Height MD",
        "type": "size",
        "default": "var(--nc-button-height-sm)"
      },
      {
        "id": "nc-tag-height-lg",
        "label": "Height LG",
        "type": "size",
        "default": "var(--nc-button-height-md)"
      },
      {
        "id": "nc-tag-padding-x",
        "label": "Padding X",
        "type": "size",
        "default": "var(--fnd-spacing-03)"
      },
      {
        "id": "nc-tag-padding-y",
        "label": "Padding Y",
        "type": "size",
        "default": "var(--fnd-spacing-01)"
      },
      {
        "id": "nc-tag-radius",
        "label": "Radius",
        "type": "size",
        "default": "var(--fnd-radius-full)"
      },
      {
        "id": "nc-tag-font-size",
        "label": "Font Size MD",
        "type": "size",
        "default": "var(--fs-xs)"
      },
      {
        "id": "nc-tag-font-size-sm",
        "label": "Font Size SM",
        "type": "size",
        "default": "var(--fs-xs)"
      },
      {
        "id": "nc-tag-font-size-lg",
        "label": "Font Size LG",
        "type": "size",
        "default": "var(--fs-base)"
      },
      {
        "id": "nc-tag-font-weight",
        "label": "Font Weight",
        "type": "keyword",
        "default": "var(--fnd-font-weight-semibold)"
      },
      {
        "id": "nc-tag-gap",
        "label": "Gap",
        "type": "size",
        "default": "var(--fnd-spacing-02)"
      },
      {
        "id": "nc-tag-transition-duration",
        "label": "Transition Duration",
        "type": "duration",
        "default": "var(--fnd-motion-duration-200)"
      },
      {
        "id": "nc-tag-default-bg",
        "label": "Default BG",
        "type": "color",
        "default": "var(--fnd-color-background-secondary)"
      },
      {
        "id": "nc-tag-default-color",
        "label": "Default Color",
        "type": "color",
        "default": "var(--fnd-color-text-primary)"
      },
      {
        "id": "nc-tag-default-border",
        "label": "Default Border",
        "type": "color",
        "default": "transparent"
      },
      {
        "id": "nc-tag-default-bg-hover",
        "label": "Default BG Hover",
        "type": "color",
        "default": "var(--fnd-color-background-tertiary)"
      },
      {
        "id": "nc-tag-outline-bg",
        "label": "Outline BG",
        "type": "color",
        "default": "transparent"
      },
      {
        "id": "nc-tag-outline-color",
        "label": "Outline Color",
        "type": "color",
        "default": "var(--fnd-color-text-primary)"
      },
      {
        "id": "nc-tag-outline-border",
        "label": "Outline Border",
        "type": "color",
        "default": "var(--fnd-color-border-primary)"
      },
      {
        "id": "nc-tag-outline-bg-hover",
        "label": "Outline BG Hover",
        "type": "color",
        "default": "var(--fnd-color-background-secondary)"
      },
      {
        "id": "nc-tag-primary-bg",
        "label": "Primary BG",
        "type": "color",
        "default": "var(--fnd-color-interactive-default)"
      },
      {
        "id": "nc-tag-primary-color",
        "label": "Primary Color",
        "type": "color",
        "default": "var(--fnd-color-text-on-interactive)"
      },
      {
        "id": "nc-tag-primary-border",
        "label": "Primary Border",
        "type": "color",
        "default": "transparent"
      },
      {
        "id": "nc-tag-primary-bg-hover",
        "label": "Primary BG Hover",
        "type": "color",
        "default": "var(--fnd-color-interactive-hover)"
      },
      {
        "id": "nc-tag-success-bg",
        "label": "Success BG",
        "type": "color",
        "default": "var(--fnd-color-background-success)"
      },
      {
        "id": "nc-tag-success-color",
        "label": "Success Color",
        "type": "color",
        "default": "var(--fnd-color-text-success)"
      },
      {
        "id": "nc-tag-success-border",
        "label": "Success Border",
        "type": "color",
        "default": "transparent"
      },
      {
        "id": "nc-tag-success-bg-hover",
        "label": "Success BG Hover",
        "type": "color",
        "default": "color-mix(in srgb, var(--fnd-color-background-success) 80%, var(--fnd-state-mix-target))"
      },
      {
        "id": "nc-tag-warning-bg",
        "label": "Warning BG",
        "type": "color",
        "default": "var(--fnd-color-background-warning)"
      },
      {
        "id": "nc-tag-warning-color",
        "label": "Warning Color",
        "type": "color",
        "default": "var(--fnd-color-text-warning)"
      },
      {
        "id": "nc-tag-warning-border",
        "label": "Warning Border",
        "type": "color",
        "default": "transparent"
      },
      {
        "id": "nc-tag-warning-bg-hover",
        "label": "Warning BG Hover",
        "type": "color",
        "default": "color-mix(in srgb, var(--fnd-color-background-warning) 80%, var(--fnd-state-mix-target))"
      },
      {
        "id": "nc-tag-error-bg",
        "label": "Error BG",
        "type": "color",
        "default": "var(--fnd-color-background-danger)"
      },
      {
        "id": "nc-tag-error-color",
        "label": "Error Color",
        "type": "color",
        "default": "var(--fnd-color-text-danger)"
      },
      {
        "id": "nc-tag-error-border",
        "label": "Error Border",
        "type": "color",
        "default": "transparent"
      },
      {
        "id": "nc-tag-error-bg-hover",
        "label": "Error BG Hover",
        "type": "color",
        "default": "color-mix(in srgb, var(--fnd-color-background-danger) 80%, var(--fnd-state-mix-target))"
      },
      {
        "id": "nc-tag-info-bg",
        "label": "Info BG",
        "type": "color",
        "default": "var(--fnd-color-background-info)"
      },
      {
        "id": "nc-tag-info-color",
        "label": "Info Color",
        "type": "color",
        "default": "var(--fnd-color-text-info)"
      },
      {
        "id": "nc-tag-info-border",
        "label": "Info Border",
        "type": "color",
        "default": "transparent"
      },
      {
        "id": "nc-tag-info-bg-hover",
        "label": "Info BG Hover",
        "type": "color",
        "default": "color-mix(in srgb, var(--fnd-color-background-info) 80%, var(--fnd-state-mix-target))"
      },
      {
        "id": "nc-tag-remove-size",
        "label": "Remove Button Size",
        "type": "size",
        "default": "16px"
      },
      {
        "id": "nc-tag-remove-hover-bg",
        "label": "Remove Hover BG",
        "type": "color",
        "default": "color-mix(in srgb, currentColor 15%, transparent)"
      },
      {
        "id": "nc-tag-icon-size",
        "label": "Icon Size",
        "type": "size",
        "default": "14px"
      },
      {
        "id": "nc-tag-disabled-bg",
        "label": "Disabled BG",
        "type": "color",
        "default": "var(--fnd-color-background-disabled)"
      },
      {
        "id": "nc-tag-disabled-color",
        "label": "Disabled Color",
        "type": "color",
        "default": "var(--fnd-color-text-disabled)"
      },
      {
        "id": "nc-tag-disabled-border",
        "label": "Disabled Border",
        "type": "color",
        "default": "var(--fnd-color-border-secondary)"
      },
      {
        "id": "nc-tag-opacity-disabled",
        "label": "Disabled Opacity",
        "type": "number",
        "default": "var(--fnd-opacity-disabled)"
      },
      {
        "id": "nc-tag-selected-bg",
        "label": "Selected BG",
        "type": "color",
        "ref": "interactive-default"
      },
      {
        "id": "nc-tag-selected-color",
        "label": "Selected Color",
        "type": "color",
        "ref": "text-on-interactive"
      },
      {
        "id": "nc-tag-selected-border",
        "label": "Selected Border",
        "type": "color",
        "default": "transparent"
      },
      {
        "id": "nc-tag-selected-bg-hover",
        "label": "Selected BG Hover",
        "type": "color",
        "ref": "interactive-hover"
      },
      {
        "id": "nc-tag-interactive-shadow-hover",
        "label": "Interactive Shadow Hover",
        "type": "color",
        "default": "var(--fnd-shadow-xs)"
      }
    ],
    "subGroups": [
      {
        "id": "geometry",
        "label": "Geometry",
        "tokenIds": [
          "nc-tag-height-sm",
          "nc-tag-height-md",
          "nc-tag-height-lg",
          "nc-tag-padding-x",
          "nc-tag-padding-y",
          "nc-tag-radius",
          "nc-tag-gap"
        ]
      },
      {
        "id": "typography",
        "label": "Typography",
        "tokenIds": [
          "nc-tag-font-size",
          "nc-tag-font-size-sm",
          "nc-tag-font-size-lg",
          "nc-tag-font-weight"
        ]
      },
      {
        "id": "default-colors",
        "label": "Default",
        "tokenIds": [
          "nc-tag-default-bg",
          "nc-tag-default-color",
          "nc-tag-default-border",
          "nc-tag-default-bg-hover"
        ]
      },
      {
        "id": "outline",
        "label": "Outline",
        "tokenIds": [
          "nc-tag-outline-bg",
          "nc-tag-outline-color",
          "nc-tag-outline-border",
          "nc-tag-outline-bg-hover"
        ]
      },
      {
        "id": "primary",
        "label": "Primary",
        "tokenIds": [
          "nc-tag-primary-bg",
          "nc-tag-primary-color",
          "nc-tag-primary-border",
          "nc-tag-primary-bg-hover"
        ]
      },
      {
        "id": "success",
        "label": "Success",
        "tokenIds": [
          "nc-tag-success-bg",
          "nc-tag-success-color",
          "nc-tag-success-border",
          "nc-tag-success-bg-hover"
        ]
      },
      {
        "id": "warning",
        "label": "Warning",
        "tokenIds": [
          "nc-tag-warning-bg",
          "nc-tag-warning-color",
          "nc-tag-warning-border",
          "nc-tag-warning-bg-hover"
        ]
      },
      {
        "id": "error",
        "label": "Error",
        "tokenIds": [
          "nc-tag-error-bg",
          "nc-tag-error-color",
          "nc-tag-error-border",
          "nc-tag-error-bg-hover"
        ]
      },
      {
        "id": "info",
        "label": "Info",
        "tokenIds": [
          "nc-tag-info-bg",
          "nc-tag-info-color",
          "nc-tag-info-border",
          "nc-tag-info-bg-hover"
        ]
      },
      {
        "id": "elements",
        "label": "Elements",
        "tokenIds": [
          "nc-tag-remove-size",
          "nc-tag-remove-hover-bg",
          "nc-tag-icon-size"
        ]
      },
      {
        "id": "disabled",
        "label": "Disabled",
        "tokenIds": [
          "nc-tag-disabled-bg",
          "nc-tag-disabled-color",
          "nc-tag-disabled-border",
          "nc-tag-opacity-disabled"
        ]
      },
      {
        "id": "animation",
        "label": "Animation",
        "tokenIds": [
          "nc-tag-transition-duration"
        ]
      }
    ],
    "subgroups": [
      {
        "id": "colors",
        "label": "Farben",
        "category": "main",
        "tokenIds": [
          "nc-tag-selected-bg",
          "nc-tag-selected-color",
          "nc-tag-selected-border",
          "nc-tag-selected-bg-hover",
          "nc-tag-interactive-shadow-hover"
        ]
      }
    ]
  },
  {
    "id": "alert",
    "label": "Alert",
    "icon": "alert-triangle",
    "tokens": [
      {
        "id": "nc-alert-padding",
        "label": "Padding",
        "type": "size",
        "default": "var(--fnd-spacing-04) var(--fnd-spacing-05)"
      },
      {
        "id": "nc-alert-radius",
        "label": "Radius",
        "type": "size",
        "default": "var(--fnd-radius-sm)"
      },
      {
        "id": "nc-alert-border-width",
        "label": "Border Width",
        "type": "size",
        "default": "var(--fnd-border-width-xs)"
      },
      {
        "id": "nc-alert-icon-size",
        "label": "Icon Size",
        "type": "size",
        "default": "20px"
      },
      {
        "id": "nc-alert-gap",
        "label": "Gap",
        "type": "size",
        "default": "var(--fnd-spacing-03)"
      },
      {
        "id": "nc-alert-info-bg",
        "label": "Info BG",
        "type": "color",
        "default": "var(--fnd-color-background-info)"
      },
      {
        "id": "nc-alert-info-color",
        "label": "Info Color",
        "type": "color",
        "default": "var(--fnd-color-text-primary)"
      },
      {
        "id": "nc-alert-info-border",
        "label": "Info Border",
        "type": "color",
        "default": "var(--fnd-color-feedback-info)"
      },
      {
        "id": "nc-alert-info-icon-color",
        "label": "Info Icon Color",
        "type": "color",
        "default": "var(--fnd-color-feedback-info)"
      },
      {
        "id": "nc-alert-success-bg",
        "label": "Success BG",
        "type": "color",
        "default": "var(--fnd-color-background-success)"
      },
      {
        "id": "nc-alert-success-color",
        "label": "Success Color",
        "type": "color",
        "default": "var(--fnd-color-text-primary)"
      },
      {
        "id": "nc-alert-success-border",
        "label": "Success Border",
        "type": "color",
        "default": "var(--fnd-color-border-success)"
      },
      {
        "id": "nc-alert-success-icon-color",
        "label": "Success Icon Color",
        "type": "color",
        "default": "var(--fnd-color-feedback-success)"
      },
      {
        "id": "nc-alert-warning-bg",
        "label": "Warning BG",
        "type": "color",
        "default": "var(--fnd-color-background-warning)"
      },
      {
        "id": "nc-alert-warning-color",
        "label": "Warning Color",
        "type": "color",
        "default": "var(--fnd-color-text-primary)"
      },
      {
        "id": "nc-alert-warning-border",
        "label": "Warning Border",
        "type": "color",
        "default": "var(--fnd-color-feedback-warning)"
      },
      {
        "id": "nc-alert-warning-icon-color",
        "label": "Warning Icon Color",
        "type": "color",
        "default": "var(--fnd-color-feedback-warning)"
      },
      {
        "id": "nc-alert-danger-bg",
        "label": "Danger BG",
        "type": "color",
        "default": "var(--fnd-color-background-danger)"
      },
      {
        "id": "nc-alert-danger-color",
        "label": "Danger Color",
        "type": "color",
        "default": "var(--fnd-color-text-primary)"
      },
      {
        "id": "nc-alert-danger-border",
        "label": "Danger Border",
        "type": "color",
        "default": "var(--fnd-color-border-danger)"
      },
      {
        "id": "nc-alert-danger-icon-color",
        "label": "Danger Icon Color",
        "type": "color",
        "default": "var(--fnd-color-feedback-danger)"
      },
      {
        "id": "nc-alert-title-font-weight",
        "label": "Title Font Weight",
        "type": "fontWeight",
        "default": "var(--fnd-font-weight-semibold)"
      },
      {
        "id": "nc-alert-description-opacity",
        "label": "Description Opacity",
        "type": "opacity",
        "default": "var(--fnd-opacity-subtle)"
      },
      {
        "id": "nc-alert-close-size",
        "label": "Close Size",
        "type": "size",
        "default": "20px"
      },
      {
        "id": "nc-alert-inline-gap",
        "label": "Inline Gap",
        "type": "spacing",
        "default": "var(--fnd-spacing-02)"
      },
      {
        "id": "nc-alert-inline-font-size",
        "label": "Inline Font Size",
        "type": "size",
        "default": "var(--fnd-typography-body-s-font-size)"
      },
      {
        "id": "nc-alert-details-margin-top",
        "label": "Details Margin Top",
        "type": "spacing",
        "default": "var(--fnd-spacing-03)"
      },
      {
        "id": "nc-alert-details-font-size",
        "label": "Details Font Size",
        "type": "size",
        "default": "var(--fnd-typography-body-s-font-size)"
      }
    ],
    "subGroups": [
      {
        "id": "geometry",
        "label": "Geometry",
        "tokenIds": [
          "nc-alert-padding",
          "nc-alert-radius",
          "nc-alert-border-width",
          "nc-alert-icon-size",
          "nc-alert-gap"
        ]
      },
      {
        "id": "info",
        "label": "Info",
        "tokenIds": [
          "nc-alert-info-bg",
          "nc-alert-info-color",
          "nc-alert-info-border",
          "nc-alert-info-icon-color"
        ]
      },
      {
        "id": "success",
        "label": "Success",
        "tokenIds": [
          "nc-alert-success-bg",
          "nc-alert-success-color",
          "nc-alert-success-border",
          "nc-alert-success-icon-color"
        ]
      },
      {
        "id": "warning",
        "label": "Warning",
        "tokenIds": [
          "nc-alert-warning-bg",
          "nc-alert-warning-color",
          "nc-alert-warning-border",
          "nc-alert-warning-icon-color"
        ]
      },
      {
        "id": "danger",
        "label": "Danger",
        "tokenIds": [
          "nc-alert-danger-bg",
          "nc-alert-danger-color",
          "nc-alert-danger-border",
          "nc-alert-danger-icon-color"
        ]
      }
    ],
    "subgroups": [
      {
        "id": "geometry",
        "label": "Geometrie",
        "tokenIds": [
          "nc-alert-close-size",
          "nc-alert-inline-gap",
          "nc-alert-details-margin-top"
        ]
      },
      {
        "id": "typography",
        "label": "Typografie",
        "tokenIds": [
          "nc-alert-title-font-weight",
          "nc-alert-inline-font-size",
          "nc-alert-details-font-size"
        ]
      },
      {
        "id": "interaction",
        "label": "Bewegung & Zustand",
        "category": "state",
        "tokenIds": [
          "nc-alert-description-opacity"
        ]
      }
    ]
  },
  {
    "id": "rating",
    "label": "Rating",
    "icon": "star",
    "tokens": [
      {
        "id": "nc-rating-size",
        "label": "Star Size",
        "type": "size",
        "default": "24px"
      },
      {
        "id": "nc-rating-gap",
        "label": "Gap",
        "type": "size",
        "default": "var(--fnd-spacing-01)"
      },
      {
        "id": "nc-rating-color-active",
        "label": "Active Color",
        "type": "color",
        "default": "var(--fnd-color-feedback-warning)"
      },
      {
        "id": "nc-rating-color-inactive",
        "label": "Inactive Color",
        "type": "color",
        "default": "var(--fnd-color-border-secondary)"
      },
      {
        "id": "nc-rating-hover-color",
        "label": "Hover Color",
        "type": "color",
        "default": "var(--fnd-color-feedback-warning)"
      },
      {
        "id": "nc-rating-disabled-opacity",
        "label": "Disabled Opacity",
        "type": "number",
        "default": "var(--fnd-opacity-disabled)"
      },
      {
        "id": "nc-rating-touch-padding",
        "label": "Touch Padding",
        "type": "size",
        "default": "10px"
      },
      {
        "id": "nc-rating-count-color",
        "label": "Count Color",
        "type": "color",
        "default": "var(--nc-input-label-color)"
      },
      {
        "id": "nc-rating-error-color",
        "label": "Error Color",
        "type": "color",
        "ref": "border-danger"
      },
      {
        "id": "nc-rating-transition-duration",
        "label": "Transition Duration",
        "type": "duration",
        "default": "var(--fnd-motion-duration-200)"
      },
      {
        "id": "nc-rating-transition-timing",
        "label": "Transition Timing",
        "type": "generic",
        "default": "cubic-bezier(0.4, 0, 0.2, 1)"
      },
      {
        "id": "nc-rating-sentiment-low",
        "label": "Sentiment Low",
        "type": "color",
        "ref": "feedback-danger"
      },
      {
        "id": "nc-rating-sentiment-mid",
        "label": "Sentiment Mid",
        "type": "color",
        "ref": "feedback-warning"
      },
      {
        "id": "nc-rating-sentiment-high",
        "label": "Sentiment High",
        "type": "color",
        "ref": "feedback-success"
      },
      {
        "id": "nc-rating-stagger-delay",
        "label": "Stagger Delay",
        "type": "duration",
        "default": "30ms"
      },
      {
        "id": "nc-rating-bounce-scale",
        "label": "Bounce Scale",
        "type": "generic",
        "default": "1.25"
      }
    ],
    "subGroups": [
      {
        "id": "geometry",
        "label": "Geometry",
        "tokenIds": [
          "nc-rating-size",
          "nc-rating-gap"
        ]
      },
      {
        "id": "colors",
        "label": "Colors",
        "tokenIds": [
          "nc-rating-color-active",
          "nc-rating-color-inactive",
          "nc-rating-hover-color"
        ]
      },
      {
        "id": "disabled",
        "label": "Disabled",
        "tokenIds": [
          "nc-rating-disabled-opacity"
        ]
      }
    ],
    "subgroups": [
      {
        "id": "geometry",
        "label": "Geometrie",
        "tokenIds": [
          "nc-rating-touch-padding"
        ]
      },
      {
        "id": "colors",
        "label": "Farben",
        "category": "main",
        "tokenIds": [
          "nc-rating-count-color",
          "nc-rating-error-color"
        ]
      },
      {
        "id": "interaction",
        "label": "Bewegung & Zustand",
        "category": "state",
        "tokenIds": [
          "nc-rating-transition-duration",
          "nc-rating-transition-timing",
          "nc-rating-stagger-delay",
          "nc-rating-bounce-scale"
        ]
      },
      {
        "id": "other",
        "label": "Weitere",
        "tokenIds": [
          "nc-rating-sentiment-low",
          "nc-rating-sentiment-mid",
          "nc-rating-sentiment-high"
        ]
      }
    ]
  },
  {
    "id": "accordion",
    "label": "Accordion",
    "icon": "layout-list",
    "tokens": [
      {
        "id": "nc-accordion-border",
        "label": "Border Color",
        "type": "color",
        "default": "var(--fnd-color-border-secondary)"
      },
      {
        "id": "nc-accordion-padding",
        "label": "Padding",
        "type": "size",
        "default": "var(--fnd-spacing-04) var(--fnd-spacing-05)"
      },
      {
        "id": "nc-accordion-icon-size",
        "label": "Icon Size",
        "type": "size",
        "default": "20px"
      },
      {
        "id": "nc-accordion-transition-duration",
        "label": "Transition Duration",
        "type": "duration",
        "default": "var(--fnd-motion-duration-200)"
      },
      {
        "id": "nc-accordion-trigger-font-weight",
        "label": "Trigger Font Weight",
        "type": "fontWeight",
        "default": "var(--fnd-font-weight-medium)"
      },
      {
        "id": "nc-accordion-trigger-color",
        "label": "Trigger Color",
        "type": "color",
        "ref": "text-primary"
      },
      {
        "id": "nc-accordion-content-color",
        "label": "Content Color",
        "type": "color",
        "ref": "text-secondary"
      },
      {
        "id": "nc-accordion-icon-color",
        "label": "Icon Color",
        "type": "color",
        "ref": "text-tertiary"
      },
      {
        "id": "nc-accordion-trigger-hover-bg",
        "label": "Trigger Hover BG",
        "type": "color",
        "default": "color-mix(in srgb, var(--fnd-color-text-primary) 4%, transparent)"
      },
      {
        "id": "nc-accordion-padding-compact",
        "label": "Padding Compact",
        "type": "spacing",
        "default": "var(--fnd-spacing-03) var(--fnd-spacing-04)"
      },
      {
        "id": "nc-accordion-padding-spacious",
        "label": "Padding Spacious",
        "type": "spacing",
        "default": "var(--fnd-spacing-06) var(--fnd-spacing-07)"
      },
      {
        "id": "nc-accordion-content-font-size",
        "label": "Content Font Size",
        "type": "size",
        "default": "var(--fnd-typography-body-m-font-size)"
      },
      {
        "id": "nc-accordion-content-font-size-compact",
        "label": "Content Font Size Compact",
        "type": "size",
        "default": "var(--fnd-typography-body-s-font-size)"
      },
      {
        "id": "nc-accordion-item-gap",
        "label": "Item Gap",
        "type": "spacing",
        "default": "var(--fnd-spacing-03)"
      },
      {
        "id": "nc-accordion-item-radius",
        "label": "Item Radius",
        "type": "radius",
        "default": "var(--fnd-radius-sm)"
      },
      {
        "id": "nc-accordion-item-shadow",
        "label": "Item Shadow",
        "type": "color",
        "default": "var(--fnd-shadow-sm)"
      },
      {
        "id": "nc-accordion-item-bg",
        "label": "Item BG",
        "type": "color",
        "ref": "background-base"
      },
      {
        "id": "nc-accordion-elevated-shadow",
        "label": "Elevated Shadow",
        "type": "color",
        "default": "var(--fnd-shadow-md)"
      },
      {
        "id": "nc-accordion-media-radius",
        "label": "Media Radius",
        "type": "radius",
        "default": "var(--fnd-radius-sm)"
      },
      {
        "id": "nc-accordion-media-max-height",
        "label": "Media Max Height",
        "type": "size",
        "default": "200px"
      },
      {
        "id": "nc-accordion-media-gap",
        "label": "Media Gap",
        "type": "spacing",
        "default": "var(--fnd-spacing-04)"
      },
      {
        "id": "nc-accordion-nested-indent",
        "label": "Nested Indent",
        "type": "spacing",
        "default": "var(--fnd-spacing-06)"
      },
      {
        "id": "nc-accordion-nested-border-width",
        "label": "Nested Border Width",
        "type": "size",
        "default": "1px"
      },
      {
        "id": "nc-accordion-nested-icon-size",
        "label": "Nested Icon Size",
        "type": "size",
        "default": "16px"
      },
      {
        "id": "nc-accordion-selection-border-active",
        "label": "Selection Border Active",
        "type": "color",
        "ref": "interactive-default"
      },
      {
        "id": "nc-accordion-selection-bg-active",
        "label": "Selection BG Active",
        "type": "color",
        "default": "color-mix(in srgb, var(--fnd-color-interactive-default) 5%, transparent)"
      },
      {
        "id": "nc-accordion-selection-indicator-size",
        "label": "Selection Indicator Size",
        "type": "size",
        "default": "20px"
      },
      {
        "id": "nc-accordion-actions-gap",
        "label": "Actions Gap",
        "type": "spacing",
        "default": "var(--fnd-spacing-02)"
      },
      {
        "id": "nc-accordion-actions-color",
        "label": "Actions Color",
        "type": "color",
        "ref": "text-tertiary"
      },
      {
        "id": "nc-accordion-actions-hover-color",
        "label": "Actions Hover Color",
        "type": "color",
        "ref": "text-primary"
      },
      {
        "id": "nc-accordion-trigger-sticky-z",
        "label": "Trigger Sticky Z",
        "type": "generic",
        "default": "2"
      },
      {
        "id": "nc-accordion-trigger-sticky-bg",
        "label": "Trigger Sticky BG",
        "type": "color",
        "ref": "background-base"
      },
      {
        "id": "nc-accordion-footer-padding",
        "label": "Footer Padding",
        "type": "spacing",
        "default": "var(--fnd-spacing-03) var(--fnd-spacing-05)"
      },
      {
        "id": "nc-accordion-footer-border",
        "label": "Footer Border",
        "type": "color",
        "ref": "border-secondary"
      },
      {
        "id": "nc-accordion-trigger-family",
        "label": "Trigger Family",
        "type": "generic",
        "default": "var(--font-heading)"
      },
      {
        "id": "nc-accordion-trigger-size",
        "label": "Trigger Size",
        "type": "size",
        "default": "var(--nc-type-heading-s-size)"
      },
      {
        "id": "nc-accordion-trigger-lh",
        "label": "Trigger Lh",
        "type": "generic",
        "default": "var(--lh-snug)"
      },
      {
        "id": "nc-accordion-trigger-tracking",
        "label": "Trigger Tracking",
        "type": "size",
        "default": "var(--fnd-tracking-snug)"
      },
      {
        "id": "nc-accordion-kicker-family",
        "label": "Kicker Family",
        "type": "generic",
        "default": "var(--font-mono)"
      },
      {
        "id": "nc-accordion-kicker-size",
        "label": "Kicker Size",
        "type": "size",
        "default": "var(--fs-xs)"
      },
      {
        "id": "nc-accordion-kicker-weight",
        "label": "Kicker Weight",
        "type": "fontWeight",
        "default": "var(--nc-mono-label-weight-strong)"
      },
      {
        "id": "nc-accordion-kicker-tracking",
        "label": "Kicker Tracking",
        "type": "size",
        "default": "var(--nc-mono-tracking-caps)"
      },
      {
        "id": "nc-accordion-kicker-color",
        "label": "Kicker Color",
        "type": "color",
        "ref": "text-tertiary"
      },
      {
        "id": "nc-accordion-kicker-gap",
        "label": "Kicker Gap",
        "type": "spacing",
        "default": "var(--fnd-spacing-01)"
      },
      {
        "id": "nc-accordion-content-lh",
        "label": "Content Lh",
        "type": "generic",
        "default": "var(--lh-body)"
      },
      {
        "id": "nc-accordion-content-measure",
        "label": "Content Measure",
        "type": "size",
        "default": "62ch"
      },
      {
        "id": "nc-accordion-gutter",
        "label": "Gutter",
        "type": "spacing",
        "default": "var(--fnd-spacing-06)"
      },
      {
        "id": "nc-accordion-register-columns",
        "label": "Register Columns",
        "type": "generic",
        "default": "2"
      },
      {
        "id": "nc-accordion-register-gap",
        "label": "Register Gap",
        "type": "spacing",
        "default": "0 var(--fnd-spacing-08)"
      },
      {
        "id": "nc-accordion-lese-trigger-size",
        "label": "Lese Trigger Size",
        "type": "size",
        "default": "var(--nc-type-heading-m-size)"
      },
      {
        "id": "nc-accordion-lese-content-size",
        "label": "Lese Content Size",
        "type": "size",
        "default": "var(--nc-type-body-l-size)"
      },
      {
        "id": "nc-accordion-lese-measure",
        "label": "Lese Measure",
        "type": "size",
        "default": "66ch"
      },
      {
        "id": "nc-accordion-lese-padding",
        "label": "Lese Padding",
        "type": "spacing",
        "default": "var(--fnd-spacing-06) 0"
      },
      {
        "id": "nc-accordion-lese-media-max",
        "label": "Lese Media Max",
        "type": "size",
        "default": "clamp(280px, 42vh, 460px)"
      },
      {
        "id": "nc-accordion-target-marker",
        "label": "Target Marker",
        "type": "color",
        "ref": "background-accent"
      },
      {
        "id": "nc-accordion-target-width",
        "label": "Target Width",
        "type": "size",
        "default": "3px"
      },
      {
        "id": "nc-accordion-cols",
        "label": "Cols",
        "type": "generic",
        "default": "1fr 2fr"
      },
      {
        "id": "nc-accordion-voll-measure",
        "label": "Voll Measure",
        "type": "size",
        "default": "62ch"
      }
    ],
    "subGroups": [
      {
        "id": "geometry",
        "label": "Geometry",
        "tokenIds": [
          "nc-accordion-border",
          "nc-accordion-padding",
          "nc-accordion-icon-size"
        ]
      },
      {
        "id": "animation",
        "label": "Animation",
        "tokenIds": [
          "nc-accordion-transition-duration"
        ]
      }
    ],
    "subgroups": [
      {
        "id": "geometry",
        "label": "Geometrie",
        "tokenIds": [
          "nc-accordion-padding-compact",
          "nc-accordion-padding-spacious",
          "nc-accordion-item-gap",
          "nc-accordion-item-radius",
          "nc-accordion-media-radius",
          "nc-accordion-media-max-height",
          "nc-accordion-media-gap",
          "nc-accordion-nested-indent",
          "nc-accordion-nested-border-width",
          "nc-accordion-nested-icon-size",
          "nc-accordion-selection-indicator-size",
          "nc-accordion-actions-gap",
          "nc-accordion-footer-padding",
          "nc-accordion-trigger-size",
          "nc-accordion-kicker-size",
          "nc-accordion-kicker-gap",
          "nc-accordion-register-gap",
          "nc-accordion-lese-trigger-size",
          "nc-accordion-lese-content-size",
          "nc-accordion-lese-padding",
          "nc-accordion-lese-media-max",
          "nc-accordion-target-width"
        ]
      },
      {
        "id": "typography",
        "label": "Typografie",
        "tokenIds": [
          "nc-accordion-trigger-font-weight",
          "nc-accordion-content-font-size",
          "nc-accordion-content-font-size-compact",
          "nc-accordion-trigger-tracking",
          "nc-accordion-kicker-weight",
          "nc-accordion-kicker-tracking"
        ]
      },
      {
        "id": "colors",
        "label": "Farben",
        "category": "main",
        "tokenIds": [
          "nc-accordion-trigger-color",
          "nc-accordion-content-color",
          "nc-accordion-icon-color",
          "nc-accordion-trigger-hover-bg",
          "nc-accordion-item-shadow",
          "nc-accordion-item-bg",
          "nc-accordion-elevated-shadow",
          "nc-accordion-selection-border-active",
          "nc-accordion-selection-bg-active",
          "nc-accordion-actions-color",
          "nc-accordion-actions-hover-color",
          "nc-accordion-trigger-sticky-bg",
          "nc-accordion-footer-border",
          "nc-accordion-kicker-color"
        ]
      },
      {
        "id": "interaction",
        "label": "Bewegung & Zustand",
        "category": "state",
        "tokenIds": [
          "nc-accordion-trigger-sticky-z"
        ]
      },
      {
        "id": "other",
        "label": "Weitere",
        "tokenIds": [
          "nc-accordion-trigger-family",
          "nc-accordion-trigger-lh",
          "nc-accordion-kicker-family",
          "nc-accordion-content-lh",
          "nc-accordion-content-measure",
          "nc-accordion-gutter",
          "nc-accordion-register-columns",
          "nc-accordion-lese-measure",
          "nc-accordion-target-marker",
          "nc-accordion-cols",
          "nc-accordion-voll-measure"
        ]
      }
    ]
  },
  {
    "id": "breadcrumb",
    "label": "Breadcrumb",
    "icon": "arrows-right",
    "tokens": [
      {
        "id": "nc-breadcrumb-gap",
        "label": "Gap",
        "type": "size",
        "default": "var(--fnd-spacing-02)"
      },
      {
        "id": "nc-breadcrumb-font-size",
        "label": "Font Size",
        "type": "size",
        "default": "var(--fs-sm)"
      },
      {
        "id": "nc-breadcrumb-color",
        "label": "Link Color",
        "type": "color",
        "default": "var(--fnd-color-text-secondary)"
      },
      {
        "id": "nc-breadcrumb-color-current",
        "label": "Current Color",
        "type": "color",
        "default": "var(--fnd-color-text-primary)"
      },
      {
        "id": "nc-breadcrumb-color-hover",
        "label": "Hover Color",
        "type": "color",
        "default": "var(--fnd-color-text-primary)"
      },
      {
        "id": "nc-breadcrumb-separator-color",
        "label": "Separator Color",
        "type": "color",
        "default": "var(--fnd-color-text-disabled)"
      },
      {
        "id": "nc-breadcrumb-separator-size",
        "label": "Separator Size",
        "type": "size",
        "default": "16px"
      },
      {
        "id": "nc-breadcrumb-separator-custom",
        "label": "Custom Separator Content",
        "type": "string",
        "default": "'·'"
      },
      {
        "id": "nc-breadcrumb-dropdown-min-width",
        "label": "Dropdown Min Width",
        "type": "size",
        "default": "160px"
      },
      {
        "id": "nc-breadcrumb-font-size-sm",
        "label": "Font Size SM",
        "type": "size",
        "default": "var(--fs-xs)"
      },
      {
        "id": "nc-breadcrumb-separator-opacity",
        "label": "Separator Opacity",
        "type": "opacity",
        "default": "0.4"
      },
      {
        "id": "nc-breadcrumb-separator-min-width",
        "label": "Separator Min Width",
        "type": "size",
        "default": "16px"
      },
      {
        "id": "nc-breadcrumb-ghost-color",
        "label": "Ghost Color",
        "type": "color",
        "ref": "text-tertiary"
      },
      {
        "id": "nc-breadcrumb-ghost-color-hover",
        "label": "Ghost Color Hover",
        "type": "color",
        "ref": "text-primary"
      },
      {
        "id": "nc-breadcrumb-back-icon-size",
        "label": "Back Icon Size",
        "type": "size",
        "default": "16px"
      },
      {
        "id": "nc-breadcrumb-back-gap",
        "label": "Back Gap",
        "type": "spacing",
        "default": "var(--fnd-spacing-01)"
      }
    ],
    "subGroups": [
      {
        "id": "geometry",
        "label": "Geometry",
        "tokenIds": [
          "nc-breadcrumb-gap",
          "nc-breadcrumb-font-size",
          "nc-breadcrumb-separator-size",
          "nc-breadcrumb-separator-custom"
        ]
      },
      {
        "id": "colors",
        "label": "Colors",
        "tokenIds": [
          "nc-breadcrumb-color",
          "nc-breadcrumb-color-current",
          "nc-breadcrumb-color-hover",
          "nc-breadcrumb-separator-color"
        ]
      },
      {
        "id": "dropdown",
        "label": "Dropdown",
        "tokenIds": [
          "nc-breadcrumb-dropdown-min-width"
        ]
      }
    ],
    "subgroups": [
      {
        "id": "geometry",
        "label": "Geometrie",
        "tokenIds": [
          "nc-breadcrumb-separator-min-width",
          "nc-breadcrumb-back-icon-size",
          "nc-breadcrumb-back-gap"
        ]
      },
      {
        "id": "typography",
        "label": "Typografie",
        "tokenIds": [
          "nc-breadcrumb-font-size-sm"
        ]
      },
      {
        "id": "colors",
        "label": "Farben",
        "category": "main",
        "tokenIds": [
          "nc-breadcrumb-ghost-color",
          "nc-breadcrumb-ghost-color-hover"
        ]
      },
      {
        "id": "interaction",
        "label": "Bewegung & Zustand",
        "category": "state",
        "tokenIds": [
          "nc-breadcrumb-separator-opacity"
        ]
      }
    ]
  },
  {
    "id": "form-field",
    "label": "Form Field",
    "icon": "input-search",
    "tokens": [
      {
        "id": "nc-form-field-gap",
        "label": "Gap",
        "type": "size",
        "default": "var(--fnd-spacing-01)"
      }
    ],
    "subgroups": []
  },
  {
    "id": "form-label",
    "label": "Form Label",
    "icon": "tag",
    "tokens": [
      {
        "id": "nc-form-label-font-size",
        "label": "Font Size",
        "type": "size",
        "default": "var(--fs-base)"
      },
      {
        "id": "nc-form-label-font-weight",
        "label": "Font Weight",
        "type": "fontWeight",
        "default": "var(--fnd-font-weight-semibold)"
      },
      {
        "id": "nc-form-label-color",
        "label": "Color",
        "type": "color",
        "default": "var(--fnd-color-text-primary)"
      },
      {
        "id": "nc-form-label-gap",
        "label": "Gap",
        "type": "size",
        "default": "var(--fnd-spacing-02)"
      },
      {
        "id": "nc-form-label-required-color",
        "label": "Required Color",
        "type": "color",
        "default": "var(--fnd-color-feedback-danger)"
      },
      {
        "id": "nc-form-label-optional-color",
        "label": "Optional Color",
        "type": "color",
        "default": "var(--fnd-color-text-tertiary)"
      },
      {
        "id": "nc-form-label-padding-block",
        "label": "Padding Block",
        "type": "size",
        "default": "2px"
      },
      {
        "id": "nc-form-label-min-height",
        "label": "Min Height",
        "type": "size",
        "default": "24px"
      },
      {
        "id": "nc-form-label-info-color",
        "label": "Info Color",
        "type": "color",
        "ref": "interactive-default"
      },
      {
        "id": "nc-form-label-inline-max-width",
        "label": "Inline Max Width",
        "type": "size",
        "default": "200px"
      },
      {
        "id": "nc-form-label-inline-padding-top",
        "label": "Inline Padding Top",
        "type": "size",
        "default": "var(--nc-input-padding-y-md, 8px)"
      },
      {
        "id": "nc-form-label-sm-font-size",
        "label": "SM Font Size",
        "type": "size",
        "default": "var(--fs-sm)"
      },
      {
        "id": "nc-form-label-sm-font-weight",
        "label": "SM Font Weight",
        "type": "fontWeight",
        "default": "var(--fnd-font-weight-medium)"
      },
      {
        "id": "nc-form-label-emphasis-font-size",
        "label": "Emphasis Font Size",
        "type": "size",
        "default": "var(--fs-lg)"
      },
      {
        "id": "nc-form-label-emphasis-font-weight",
        "label": "Emphasis Font Weight",
        "type": "fontWeight",
        "default": "var(--fnd-font-weight-bold)"
      }
    ],
    "subgroups": [
      {
        "id": "geometry",
        "label": "Geometrie",
        "tokenIds": [
          "nc-form-label-padding-block",
          "nc-form-label-min-height",
          "nc-form-label-inline-max-width",
          "nc-form-label-inline-padding-top"
        ]
      },
      {
        "id": "typography",
        "label": "Typografie",
        "tokenIds": [
          "nc-form-label-sm-font-size",
          "nc-form-label-sm-font-weight",
          "nc-form-label-emphasis-font-size",
          "nc-form-label-emphasis-font-weight"
        ]
      },
      {
        "id": "colors",
        "label": "Farben",
        "category": "main",
        "tokenIds": [
          "nc-form-label-info-color"
        ]
      }
    ]
  },
  {
    "id": "form-error",
    "label": "Form Error",
    "icon": "alert-triangle",
    "tokens": [
      {
        "id": "nc-form-error-font-size",
        "label": "Font Size",
        "type": "size",
        "default": "var(--fs-sm)"
      },
      {
        "id": "nc-form-error-font-weight",
        "label": "Font Weight",
        "type": "fontWeight",
        "default": "var(--fnd-font-weight-medium)"
      },
      {
        "id": "nc-form-error-color",
        "label": "Color",
        "type": "color",
        "default": "var(--fnd-color-feedback-danger)"
      },
      {
        "id": "nc-form-error-icon-size",
        "label": "Icon Size",
        "type": "size",
        "default": "16px"
      },
      {
        "id": "nc-form-error-gap",
        "label": "Gap",
        "type": "size",
        "default": "var(--fnd-spacing-01)"
      }
    ],
    "subgroups": []
  },
  {
    "id": "form-hint",
    "label": "Form Hint",
    "icon": "info-circle",
    "tokens": [
      {
        "id": "nc-form-hint-font-size",
        "label": "Font Size",
        "type": "size",
        "default": "var(--fs-sm)"
      },
      {
        "id": "nc-form-hint-color",
        "label": "Color",
        "type": "color",
        "default": "var(--fnd-color-text-secondary)"
      },
      {
        "id": "nc-form-hint-gap",
        "label": "Gap",
        "type": "size",
        "default": "var(--fnd-spacing-01)"
      },
      {
        "id": "nc-form-hint-link-color",
        "label": "Link Color",
        "type": "color",
        "ref": "interactive-default"
      },
      {
        "id": "nc-form-hint-muted-color",
        "label": "Muted Color",
        "type": "color",
        "ref": "text-tertiary"
      },
      {
        "id": "nc-form-hint-list-gap",
        "label": "List Gap",
        "type": "spacing",
        "default": "var(--fnd-spacing-01)"
      }
    ],
    "subgroups": [
      {
        "id": "geometry",
        "label": "Geometrie",
        "tokenIds": [
          "nc-form-hint-list-gap"
        ]
      },
      {
        "id": "colors",
        "label": "Farben",
        "category": "main",
        "tokenIds": [
          "nc-form-hint-link-color",
          "nc-form-hint-muted-color"
        ]
      }
    ]
  },
  {
    "id": "empty-state",
    "label": "Empty State",
    "icon": "mood-empty",
    "tokens": [
      {
        "id": "nc-empty-state-padding",
        "label": "Padding",
        "type": "size",
        "default": "var(--fnd-spacing-10)"
      },
      {
        "id": "nc-empty-state-gap",
        "label": "Gap",
        "type": "size",
        "default": "var(--fnd-spacing-04)"
      },
      {
        "id": "nc-empty-state-max-width",
        "label": "Max Width",
        "type": "size",
        "default": "400px"
      },
      {
        "id": "nc-empty-state-icon-size",
        "label": "Icon Size",
        "type": "size",
        "default": "var(--fnd-size-xl)"
      },
      {
        "id": "nc-empty-state-icon-color",
        "label": "Icon Color",
        "type": "color",
        "default": "var(--fnd-color-text-tertiary)"
      },
      {
        "id": "nc-empty-state-title-size",
        "label": "Title Size",
        "type": "size",
        "default": "var(--fs-lg)"
      },
      {
        "id": "nc-empty-state-title-weight",
        "label": "Title Weight",
        "type": "fontWeight",
        "default": "var(--fnd-font-weight-semibold)"
      },
      {
        "id": "nc-empty-state-title-color",
        "label": "Title Color",
        "type": "color",
        "default": "var(--fnd-color-text-primary)"
      },
      {
        "id": "nc-empty-state-desc-size",
        "label": "Description Size",
        "type": "size",
        "default": "var(--fs-sm)"
      },
      {
        "id": "nc-empty-state-desc-color",
        "label": "Description Color",
        "type": "color",
        "default": "var(--fnd-color-text-secondary)"
      },
      {
        "id": "nc-empty-state-action-gap",
        "label": "Action Gap",
        "type": "size",
        "default": "var(--fnd-spacing-03)"
      }
    ],
    "subgroups": []
  },
  {
    "id": "otp-input",
    "label": "OTP Input",
    "icon": "password",
    "tokens": [
      {
        "id": "nc-otp-cell-size",
        "label": "Cell Size",
        "type": "size",
        "default": "48px"
      },
      {
        "id": "nc-otp-cell-gap",
        "label": "Cell Gap",
        "type": "size",
        "default": "var(--fnd-spacing-02)"
      },
      {
        "id": "nc-otp-cell-radius",
        "label": "Cell Radius",
        "type": "size",
        "default": "var(--fnd-radius-sm)"
      },
      {
        "id": "nc-otp-cell-border",
        "label": "Cell Border Color",
        "type": "color",
        "default": "var(--fnd-color-border-primary)"
      },
      {
        "id": "nc-otp-cell-border-focus",
        "label": "Cell Focus Border",
        "type": "color",
        "default": "var(--fnd-color-interactive-focus)"
      },
      {
        "id": "nc-otp-cell-font-size",
        "label": "Cell Font Size",
        "type": "size",
        "default": "var(--fs-lg)"
      },
      {
        "id": "nc-otp-cell-font-weight",
        "label": "Cell Font Weight",
        "type": "fontWeight",
        "default": "var(--fnd-font-weight-semibold)"
      }
    ]
  },
  {
    "id": "stepper",
    "label": "Stepper",
    "icon": "plus-minus",
    "tokens": [
      {
        "id": "nc-stepper-button-size",
        "label": "Button Size",
        "type": "size",
        "default": "32px"
      },
      {
        "id": "nc-stepper-button-radius",
        "label": "Button Radius",
        "type": "size",
        "default": "var(--fnd-radius-sm)"
      },
      {
        "id": "nc-stepper-button-bg",
        "label": "Button Background",
        "type": "color",
        "default": "var(--fnd-color-background-secondary)"
      },
      {
        "id": "nc-stepper-button-bg-hover",
        "label": "Button Hover Background",
        "type": "color",
        "default": "var(--fnd-color-background-tertiary)"
      },
      {
        "id": "nc-stepper-button-color",
        "label": "Button Color",
        "type": "color",
        "default": "var(--fnd-color-text-primary)"
      },
      {
        "id": "nc-stepper-input-width",
        "label": "Input Width",
        "type": "size",
        "default": "64px"
      }
    ],
    "subgroups": []
  },
  {
    "id": "timeline",
    "label": "Timeline",
    "icon": "git-branch",
    "tokens": [
      {
        "id": "nc-timeline-line-color",
        "label": "Line Color",
        "type": "color",
        "default": "var(--fnd-color-border-secondary)"
      },
      {
        "id": "nc-timeline-line-width",
        "label": "Line Width",
        "type": "size",
        "default": "var(--fnd-border-width-sm)"
      },
      {
        "id": "nc-timeline-gap",
        "label": "Gap",
        "type": "size",
        "default": "0"
      },
      {
        "id": "nc-timeline-node-size",
        "label": "Node Size",
        "type": "size",
        "default": "12px"
      },
      {
        "id": "nc-timeline-node-bg",
        "label": "Node Background",
        "type": "color",
        "default": "var(--fnd-color-background-base)"
      },
      {
        "id": "nc-timeline-node-border",
        "label": "Node Border Color",
        "type": "color",
        "default": "var(--fnd-color-border-primary)"
      },
      {
        "id": "nc-timeline-node-border-width",
        "label": "Node Border Width",
        "type": "size",
        "default": "var(--fnd-border-width-sm)"
      },
      {
        "id": "nc-timeline-node-radius",
        "label": "Node Radius",
        "type": "size",
        "default": "var(--fnd-radius-full)"
      },
      {
        "id": "nc-timeline-node-active-bg",
        "label": "Node Active Background",
        "type": "color",
        "default": "var(--fnd-color-interactive-default)"
      },
      {
        "id": "nc-timeline-node-active-border",
        "label": "Node Active Border",
        "type": "color",
        "default": "var(--fnd-color-interactive-default)"
      },
      {
        "id": "nc-timeline-node-success-bg",
        "label": "Node Success Background",
        "type": "color",
        "default": "var(--fnd-color-feedback-success)"
      },
      {
        "id": "nc-timeline-node-danger-bg",
        "label": "Node Danger Background",
        "type": "color",
        "default": "var(--fnd-color-feedback-danger)"
      },
      {
        "id": "nc-timeline-node-icon-size",
        "label": "Node Icon Size",
        "type": "size",
        "default": "var(--fnd-size-sm)"
      },
      {
        "id": "nc-timeline-node-icon-color",
        "label": "Node Icon Color",
        "type": "color",
        "default": "var(--fnd-color-text-on-interactive)"
      },
      {
        "id": "nc-timeline-content-gap",
        "label": "Content Gap",
        "type": "size",
        "default": "var(--fnd-spacing-01)"
      },
      {
        "id": "nc-timeline-content-padding",
        "label": "Content Padding",
        "type": "size",
        "default": "var(--fnd-spacing-04)"
      },
      {
        "id": "nc-timeline-title-size",
        "label": "Title Size",
        "type": "size",
        "default": "var(--fs-sm)"
      },
      {
        "id": "nc-timeline-title-weight",
        "label": "Title Weight",
        "type": "fontWeight",
        "default": "var(--fnd-font-weight-semibold)"
      },
      {
        "id": "nc-timeline-title-color",
        "label": "Title Color",
        "type": "color",
        "default": "var(--fnd-color-text-primary)"
      },
      {
        "id": "nc-timeline-desc-size",
        "label": "Description Size",
        "type": "size",
        "default": "var(--fs-sm)"
      },
      {
        "id": "nc-timeline-desc-color",
        "label": "Description Color",
        "type": "color",
        "default": "var(--fnd-color-text-secondary)"
      },
      {
        "id": "nc-timeline-time-size",
        "label": "Time Size",
        "type": "size",
        "default": "var(--fs-xs)"
      },
      {
        "id": "nc-timeline-time-color",
        "label": "Time Color",
        "type": "color",
        "default": "var(--fnd-color-text-tertiary)"
      },
      {
        "id": "nc-timeline-time-weight",
        "label": "Time Weight",
        "type": "fontWeight",
        "default": "var(--fnd-font-weight-regular)"
      },
      {
        "id": "nc-timeline-alt-max-width",
        "label": "Alt Max Width",
        "type": "size",
        "default": "54rem"
      },
      {
        "id": "nc-timeline-alt-node-col",
        "label": "Alt Node Col",
        "type": "size",
        "default": "5.625rem"
      },
      {
        "id": "nc-timeline-alt-gap",
        "label": "Alt Gap",
        "type": "spacing",
        "default": "var(--fnd-spacing-04)"
      },
      {
        "id": "nc-timeline-alt-item-gap",
        "label": "Alt Item Gap",
        "type": "spacing",
        "default": "var(--fnd-spacing-12)"
      },
      {
        "id": "nc-timeline-alt-node-size",
        "label": "Alt Node Size",
        "type": "size",
        "default": "var(--fnd-size-xl)"
      },
      {
        "id": "nc-timeline-alt-node-size-sm",
        "label": "Alt Node Size SM",
        "type": "size",
        "default": "2.75rem"
      },
      {
        "id": "nc-timeline-progress-color",
        "label": "Progress Color",
        "type": "color",
        "ref": "text-accent"
      },
      {
        "id": "nc-timeline-card-bg",
        "label": "Card BG",
        "type": "color",
        "default": "var(--fnd-color-surface-elevated)"
      },
      {
        "id": "nc-timeline-card-border",
        "label": "Card Border",
        "type": "color",
        "default": "var(--fnd-color-border-hairline)"
      },
      {
        "id": "nc-timeline-card-radius",
        "label": "Card Radius",
        "type": "radius",
        "default": "var(--fnd-radius-lg)"
      },
      {
        "id": "nc-timeline-card-padding",
        "label": "Card Padding",
        "type": "spacing",
        "default": "var(--fnd-spacing-06)"
      },
      {
        "id": "nc-timeline-card-shadow",
        "label": "Card Shadow",
        "type": "color",
        "default": "var(--nc-media-frame-shadow)"
      },
      {
        "id": "nc-timeline-badge-tint",
        "label": "Badge Tint",
        "type": "color",
        "default": "8%"
      },
      {
        "id": "nc-timeline-badge-radius",
        "label": "Badge Radius",
        "type": "radius",
        "default": "var(--fnd-radius-sm)"
      },
      {
        "id": "nc-timeline-badge-size",
        "label": "Badge Size",
        "type": "size",
        "default": "var(--fs-2xs)"
      },
      {
        "id": "nc-timeline-phase-color",
        "label": "Phase Color",
        "type": "color",
        "ref": "text-tertiary"
      },
      {
        "id": "nc-timeline-lead-color",
        "label": "Lead Color",
        "type": "color",
        "ref": "text-accent"
      },
      {
        "id": "nc-timeline-marker-color",
        "label": "Marker Color",
        "type": "color",
        "ref": "text-accent"
      },
      {
        "id": "nc-timeline-card-title-size",
        "label": "Card Title Size",
        "type": "size",
        "default": "var(--nc-type-heading-m-size)"
      },
      {
        "id": "nc-timeline-card-title-weight",
        "label": "Card Title Weight",
        "type": "fontWeight",
        "default": "var(--fnd-font-weight-heading-strong)"
      },
      {
        "id": "nc-timeline-h-card-width",
        "label": "H Card Width",
        "type": "size",
        "default": "22rem"
      },
      {
        "id": "nc-timeline-h-gap",
        "label": "H Gap",
        "type": "spacing",
        "default": "var(--fnd-spacing-08)"
      },
      {
        "id": "nc-timeline-h-pad-block",
        "label": "H Pad Block",
        "type": "spacing",
        "default": "var(--fnd-spacing-06)"
      },
      {
        "id": "nc-timeline-cta-gap",
        "label": "Cta Gap",
        "type": "spacing",
        "default": "var(--fnd-spacing-05)"
      },
      {
        "id": "nc-timeline-reveal-shift",
        "label": "Reveal Shift",
        "type": "size",
        "default": "1.375rem"
      },
      {
        "id": "nc-timeline-reveal-duration",
        "label": "Reveal Duration",
        "type": "duration",
        "default": ".5s"
      },
      {
        "id": "nc-timeline-reveal-glow",
        "label": "Reveal Glow",
        "type": "color",
        "default": "0 0 0 var(--fnd-border-width-hairline) var(--nc-timeline-progress-color),\n      0 0 1.125rem color-mix(in srgb, var(--nc-timeline-progress-color) 22%, transparent)"
      },
      {
        "id": "nc-timeline-node-glow",
        "label": "Node Glow",
        "type": "color",
        "default": "0 0 0 .625rem var(--fnd-color-background-base),\n      0 0 0 .75rem color-mix(in srgb, var(--nc-timeline-progress-color) 18%, transparent),\n      0 0 2rem color-mix(in srgb, var(--nc-timeline-progress-color) 45%, transparent)"
      }
    ],
    "subgroups": [
      {
        "id": "geometry",
        "label": "Geometrie",
        "tokenIds": [
          "nc-timeline-alt-max-width",
          "nc-timeline-alt-gap",
          "nc-timeline-alt-item-gap",
          "nc-timeline-alt-node-size",
          "nc-timeline-alt-node-size-sm",
          "nc-timeline-card-radius",
          "nc-timeline-card-padding",
          "nc-timeline-badge-radius",
          "nc-timeline-badge-size",
          "nc-timeline-card-title-size",
          "nc-timeline-h-card-width",
          "nc-timeline-h-gap",
          "nc-timeline-cta-gap"
        ]
      },
      {
        "id": "typography",
        "label": "Typografie",
        "tokenIds": [
          "nc-timeline-card-title-weight"
        ]
      },
      {
        "id": "colors",
        "label": "Farben",
        "category": "main",
        "tokenIds": [
          "nc-timeline-progress-color",
          "nc-timeline-card-bg",
          "nc-timeline-card-border",
          "nc-timeline-card-shadow",
          "nc-timeline-badge-tint",
          "nc-timeline-phase-color",
          "nc-timeline-lead-color",
          "nc-timeline-marker-color",
          "nc-timeline-reveal-glow",
          "nc-timeline-node-glow"
        ]
      },
      {
        "id": "interaction",
        "label": "Bewegung & Zustand",
        "category": "state",
        "tokenIds": [
          "nc-timeline-reveal-duration"
        ]
      },
      {
        "id": "other",
        "label": "Weitere",
        "tokenIds": [
          "nc-timeline-alt-node-col",
          "nc-timeline-h-pad-block",
          "nc-timeline-reveal-shift"
        ]
      }
    ]
  },
  {
    "id": "popover",
    "label": "Popover",
    "icon": "message-circle",
    "tokens": [
      {
        "id": "nc-popover-bg",
        "label": "Background",
        "type": "color",
        "default": "var(--fnd-color-background-base)"
      },
      {
        "id": "nc-popover-border",
        "label": "Border Color",
        "type": "color",
        "default": "var(--fnd-color-border-secondary)"
      },
      {
        "id": "nc-popover-border-width",
        "label": "Border Width",
        "type": "size",
        "default": "var(--fnd-border-width-xs)"
      },
      {
        "id": "nc-popover-radius",
        "label": "Border Radius",
        "type": "size",
        "default": "var(--fnd-radius-sm)"
      },
      {
        "id": "nc-popover-shadow",
        "label": "Shadow",
        "type": "shadow",
        "default": "var(--fnd-elevation-floating)"
      },
      {
        "id": "nc-popover-padding",
        "label": "Body Padding",
        "type": "size",
        "default": "var(--fnd-spacing-04)"
      },
      {
        "id": "nc-popover-min-width",
        "label": "Min Width",
        "type": "size",
        "default": "200px"
      },
      {
        "id": "nc-popover-max-width",
        "label": "Max Width",
        "type": "size",
        "default": "360px"
      },
      {
        "id": "nc-popover-z-index",
        "label": "Z-Index",
        "type": "other",
        "default": "var(--fnd-z-dropdown)"
      },
      {
        "id": "nc-popover-offset",
        "label": "Trigger Offset",
        "type": "size",
        "default": "var(--fnd-spacing-02)"
      },
      {
        "id": "nc-popover-animation-duration",
        "label": "Animation Duration",
        "type": "other",
        "default": "var(--fnd-motion-duration-150)"
      },
      {
        "id": "nc-popover-arrow-size",
        "label": "Arrow Size",
        "type": "size",
        "default": "8px"
      },
      {
        "id": "nc-popover-arrow-bg",
        "label": "Arrow Background",
        "type": "color",
        "default": "var(--fnd-color-background-base)"
      },
      {
        "id": "nc-popover-arrow-border",
        "label": "Arrow Border",
        "type": "color",
        "default": "var(--fnd-color-border-secondary)"
      },
      {
        "id": "nc-popover-header-padding",
        "label": "Header Padding",
        "type": "size",
        "default": "var(--fnd-spacing-03) var(--fnd-spacing-04)"
      },
      {
        "id": "nc-popover-header-border",
        "label": "Header Border",
        "type": "color",
        "default": "var(--fnd-color-border-secondary)"
      },
      {
        "id": "nc-popover-header-font-size",
        "label": "Header Font Size",
        "type": "size",
        "default": "var(--fs-sm)"
      },
      {
        "id": "nc-popover-header-font-weight",
        "label": "Header Font Weight",
        "type": "fontWeight",
        "default": "var(--fnd-font-weight-semibold)"
      },
      {
        "id": "nc-popover-footer-padding",
        "label": "Footer Padding",
        "type": "size",
        "default": "var(--fnd-spacing-03) var(--fnd-spacing-04)"
      },
      {
        "id": "nc-popover-footer-border",
        "label": "Footer Border",
        "type": "color",
        "default": "var(--fnd-color-border-secondary)"
      },
      {
        "id": "nc-popover-header-color",
        "label": "Header Color",
        "type": "color",
        "ref": "text-primary"
      },
      {
        "id": "nc-popover-close-size",
        "label": "Close Size",
        "type": "size",
        "default": "24px"
      },
      {
        "id": "nc-popover-close-radius",
        "label": "Close Radius",
        "type": "radius",
        "default": "var(--fnd-radius-sm)"
      },
      {
        "id": "nc-popover-close-bg-hover",
        "label": "Close BG Hover",
        "type": "color",
        "ref": "background-hover"
      },
      {
        "id": "nc-popover-close-icon-size",
        "label": "Close Icon Size",
        "type": "size",
        "default": "14px"
      }
    ],
    "subgroups": [
      {
        "id": "geometry",
        "label": "Geometrie",
        "tokenIds": [
          "nc-popover-close-size",
          "nc-popover-close-radius",
          "nc-popover-close-icon-size"
        ]
      },
      {
        "id": "colors",
        "label": "Farben",
        "category": "main",
        "tokenIds": [
          "nc-popover-header-color",
          "nc-popover-close-bg-hover"
        ]
      }
    ]
  },
  {
    "id": "file-upload",
    "label": "File Upload",
    "icon": "upload",
    "tokens": [
      {
        "id": "nc-file-upload-border",
        "label": "Border Color",
        "type": "color",
        "default": "var(--fnd-color-border-primary)"
      },
      {
        "id": "nc-file-upload-border-style",
        "label": "Border Style",
        "type": "other",
        "default": "dashed"
      },
      {
        "id": "nc-file-upload-border-hover",
        "label": "Border Hover",
        "type": "color",
        "default": "var(--fnd-color-interactive-default)"
      },
      {
        "id": "nc-file-upload-bg",
        "label": "Background",
        "type": "color",
        "default": "var(--fnd-color-background-base)"
      },
      {
        "id": "nc-file-upload-bg-hover",
        "label": "Background Hover",
        "type": "color",
        "default": "var(--fnd-color-background-secondary)"
      },
      {
        "id": "nc-file-upload-radius",
        "label": "Border Radius",
        "type": "size",
        "default": "var(--fnd-radius-sm)"
      },
      {
        "id": "nc-file-upload-padding",
        "label": "Padding",
        "type": "size",
        "default": "var(--fnd-spacing-08)"
      },
      {
        "id": "nc-file-upload-icon-size",
        "label": "Icon Size",
        "type": "size",
        "default": "40px"
      },
      {
        "id": "nc-file-upload-icon-color",
        "label": "Icon Color",
        "type": "color",
        "default": "var(--fnd-color-text-tertiary)"
      }
    ],
    "subgroups": []
  },
  {
    "id": "fieldset",
    "label": "Fieldset",
    "icon": "forms",
    "tokens": [
      {
        "id": "nc-fieldset-border-width",
        "label": "Border Width",
        "type": "size",
        "default": "var(--fnd-border-width-xs)"
      },
      {
        "id": "nc-fieldset-border-color",
        "label": "Border Color",
        "type": "color",
        "default": "var(--fnd-color-border-secondary)"
      },
      {
        "id": "nc-fieldset-border-radius",
        "label": "Border Radius",
        "type": "size",
        "default": "var(--fnd-radius-sm)"
      },
      {
        "id": "nc-fieldset-padding",
        "label": "Padding",
        "type": "size",
        "default": "var(--fnd-spacing-06)"
      },
      {
        "id": "nc-fieldset-gap",
        "label": "Gap",
        "type": "size",
        "default": "var(--nc-form-gap)"
      },
      {
        "id": "nc-fieldset-legend-size",
        "label": "Legend Font Size",
        "type": "size",
        "default": "var(--fs-base)"
      },
      {
        "id": "nc-fieldset-legend-weight",
        "label": "Legend Font Weight",
        "type": "fontWeight",
        "default": "var(--fnd-font-weight-semibold)"
      },
      {
        "id": "nc-fieldset-legend-color",
        "label": "Legend Color",
        "type": "color",
        "default": "var(--fnd-color-text-primary)"
      },
      {
        "id": "nc-fieldset-legend-padding",
        "label": "Legend Padding",
        "type": "size",
        "default": "var(--fnd-spacing-02)"
      },
      {
        "id": "nc-fieldset-helper-size",
        "label": "Helper Size",
        "type": "size",
        "default": "var(--fs-sm)"
      },
      {
        "id": "nc-fieldset-helper-color",
        "label": "Helper Color",
        "type": "color",
        "ref": "text-secondary"
      },
      {
        "id": "nc-fieldset-helper-margin-top",
        "label": "Helper Margin Top",
        "type": "spacing",
        "default": "calc(var(--fnd-spacing-01) * -1)"
      },
      {
        "id": "nc-fieldset-card-bg",
        "label": "Card BG",
        "type": "color",
        "ref": "background-secondary"
      },
      {
        "id": "nc-fieldset-card-shadow",
        "label": "Card Shadow",
        "type": "color",
        "default": "var(--fnd-elevation-flat)"
      },
      {
        "id": "nc-fieldset-padding-compact",
        "label": "Padding Compact",
        "type": "spacing",
        "default": "var(--fnd-spacing-04)"
      },
      {
        "id": "nc-fieldset-gap-compact",
        "label": "Gap Compact",
        "type": "spacing",
        "default": "var(--fnd-spacing-03)"
      },
      {
        "id": "nc-fieldset-padding-loose",
        "label": "Padding Loose",
        "type": "spacing",
        "default": "var(--fnd-spacing-08)"
      },
      {
        "id": "nc-fieldset-gap-loose",
        "label": "Gap Loose",
        "type": "spacing",
        "default": "var(--fnd-spacing-06)"
      },
      {
        "id": "nc-fieldset-required-color",
        "label": "Required Color",
        "type": "color",
        "ref": "text-danger"
      }
    ],
    "subgroups": [
      {
        "id": "geometry",
        "label": "Geometrie",
        "tokenIds": [
          "nc-fieldset-helper-size",
          "nc-fieldset-helper-margin-top",
          "nc-fieldset-padding-compact",
          "nc-fieldset-gap-compact",
          "nc-fieldset-padding-loose",
          "nc-fieldset-gap-loose"
        ]
      },
      {
        "id": "colors",
        "label": "Farben",
        "category": "main",
        "tokenIds": [
          "nc-fieldset-helper-color",
          "nc-fieldset-card-bg",
          "nc-fieldset-card-shadow",
          "nc-fieldset-required-color"
        ]
      }
    ]
  },
  {
    "id": "validation-summary",
    "label": "Validation Summary",
    "icon": "alert-triangle",
    "tokens": [
      {
        "id": "nc-validation-summary-bg",
        "label": "Background",
        "type": "color",
        "default": "var(--fnd-color-background-danger)"
      },
      {
        "id": "nc-validation-summary-border",
        "label": "Border Color",
        "type": "color",
        "default": "var(--fnd-color-border-danger)"
      },
      {
        "id": "nc-validation-summary-color",
        "label": "Text Color",
        "type": "color",
        "default": "var(--fnd-color-text-danger)"
      },
      {
        "id": "nc-validation-summary-radius",
        "label": "Border Radius",
        "type": "size",
        "default": "var(--fnd-radius-sm)"
      },
      {
        "id": "nc-validation-summary-padding",
        "label": "Padding",
        "type": "size",
        "default": "var(--fnd-spacing-05)"
      }
    ],
    "subgroups": []
  },
  {
    "id": "sidebar",
    "label": "Sidebar",
    "icon": "layout-sidebar-left-collapse",
    "tokens": [
      {
        "id": "nc-sidebar-width",
        "label": "Width",
        "type": "size",
        "default": "260px"
      },
      {
        "id": "nc-sidebar-width-collapsed",
        "label": "Width Collapsed",
        "type": "size",
        "default": "56px"
      },
      {
        "id": "nc-sidebar-bg",
        "label": "Background",
        "type": "color",
        "default": "var(--fnd-color-layer-01)"
      },
      {
        "id": "nc-sidebar-border",
        "label": "Border Color",
        "type": "color",
        "default": "var(--fnd-color-border-secondary)"
      },
      {
        "id": "nc-sidebar-border-width",
        "label": "Border Width",
        "type": "size",
        "default": "var(--fnd-border-width-xs)"
      },
      {
        "id": "nc-sidebar-padding",
        "label": "Padding",
        "type": "size",
        "default": "var(--fnd-spacing-03)"
      },
      {
        "id": "nc-sidebar-z-index",
        "label": "Z-Index",
        "type": "other",
        "default": "var(--fnd-z-sidebar)"
      },
      {
        "id": "nc-sidebar-item-height",
        "label": "Item Height",
        "type": "size",
        "default": "var(--fnd-size-sm)"
      },
      {
        "id": "nc-sidebar-item-padding",
        "label": "Item Padding",
        "type": "size",
        "default": "var(--fnd-spacing-02) var(--fnd-spacing-03)"
      },
      {
        "id": "nc-sidebar-item-radius",
        "label": "Item Radius",
        "type": "size",
        "default": "var(--fnd-radius-sm)"
      },
      {
        "id": "nc-sidebar-item-gap",
        "label": "Item Gap",
        "type": "size",
        "default": "var(--fnd-spacing-02)"
      },
      {
        "id": "nc-sidebar-item-color",
        "label": "Item Color",
        "type": "color",
        "default": "var(--fnd-color-text-secondary)"
      },
      {
        "id": "nc-sidebar-item-color-hover",
        "label": "Item Hover Color",
        "type": "color",
        "default": "var(--fnd-color-text-primary)"
      },
      {
        "id": "nc-sidebar-item-bg-hover",
        "label": "Item Hover Background",
        "type": "color",
        "default": "var(--fnd-color-background-hover)"
      },
      {
        "id": "nc-sidebar-item-bg-active",
        "label": "Item Active Background",
        "type": "color",
        "default": "var(--fnd-color-background-active)"
      },
      {
        "id": "nc-sidebar-item-color-active",
        "label": "Item Active Color",
        "type": "color",
        "default": "var(--fnd-color-interactive-default)"
      },
      {
        "id": "nc-sidebar-item-font-size",
        "label": "Item Font Size",
        "type": "size",
        "default": "var(--fs-sm)"
      },
      {
        "id": "nc-sidebar-item-font-weight",
        "label": "Item Font Weight",
        "type": "fontWeight",
        "default": "var(--fnd-font-weight-medium)"
      },
      {
        "id": "nc-sidebar-item-icon-size",
        "label": "Item Icon Size",
        "type": "size",
        "default": "20px"
      },
      {
        "id": "nc-sidebar-group-label-color",
        "label": "Group Label Color",
        "type": "color",
        "default": "var(--fnd-color-text-tertiary)"
      },
      {
        "id": "nc-sidebar-group-label-size",
        "label": "Group Label Size",
        "type": "size",
        "default": "var(--fs-xs)"
      },
      {
        "id": "nc-sidebar-group-label-weight",
        "label": "Group Label Weight",
        "type": "fontWeight",
        "default": "var(--fnd-font-weight-semibold)"
      },
      {
        "id": "nc-sidebar-group-label-padding",
        "label": "Group Label Padding",
        "type": "size",
        "default": "var(--fnd-spacing-03) var(--fnd-spacing-03) var(--fnd-spacing-01)"
      },
      {
        "id": "nc-sidebar-group-gap",
        "label": "Group Gap",
        "type": "size",
        "default": "var(--fnd-spacing-01)"
      },
      {
        "id": "nc-sidebar-nested-indent",
        "label": "Nested Indent",
        "type": "size",
        "default": "var(--fnd-spacing-06)"
      },
      {
        "id": "nc-sidebar-badge-size",
        "label": "Badge Size",
        "type": "size",
        "default": "20px"
      },
      {
        "id": "nc-sidebar-badge-font-size",
        "label": "Badge Font Size",
        "type": "size",
        "default": "var(--fs-xs)"
      },
      {
        "id": "nc-sidebar-badge-bg",
        "label": "Badge Background",
        "type": "color",
        "default": "var(--fnd-color-feedback-danger)"
      },
      {
        "id": "nc-sidebar-badge-color",
        "label": "Badge Color",
        "type": "color",
        "default": "var(--fnd-color-on-danger)"
      },
      {
        "id": "nc-sidebar-badge-radius",
        "label": "Badge Radius",
        "type": "size",
        "default": "var(--fnd-radius-full)"
      }
    ],
    "subgroups": []
  },
  {
    "id": "toast",
    "label": "Toast",
    "icon": "bell",
    "tokens": [
      {
        "id": "nc-toast-z-index",
        "label": "Z-Index",
        "type": "keyword",
        "default": "var(--fnd-z-toast)"
      },
      {
        "id": "nc-toast-offset",
        "label": "Offset",
        "type": "size",
        "default": "var(--fnd-spacing-06)"
      },
      {
        "id": "nc-toast-gap",
        "label": "Gap",
        "type": "size",
        "default": "var(--fnd-spacing-03)"
      },
      {
        "id": "nc-toast-width",
        "label": "Width",
        "type": "size",
        "default": "356px"
      },
      {
        "id": "nc-toast-padding",
        "label": "Padding",
        "type": "size",
        "default": "var(--fnd-spacing-04) var(--fnd-spacing-05)"
      },
      {
        "id": "nc-toast-radius",
        "label": "Radius",
        "type": "size",
        "default": "var(--fnd-radius-sm)"
      },
      {
        "id": "nc-toast-border-width",
        "label": "Border Width",
        "type": "size",
        "default": "var(--fnd-border-width-xs)"
      },
      {
        "id": "nc-toast-shadow",
        "label": "Shadow",
        "type": "shadow",
        "default": "var(--fnd-elevation-raised)"
      },
      {
        "id": "nc-toast-item-gap",
        "label": "Item Gap",
        "type": "size",
        "default": "var(--fnd-spacing-03)"
      },
      {
        "id": "nc-toast-icon-size",
        "label": "Icon Size",
        "type": "size",
        "default": "20px"
      },
      {
        "id": "nc-toast-font-size",
        "label": "Font Size",
        "type": "size",
        "default": "var(--fs-sm)"
      },
      {
        "id": "nc-toast-description-font-size",
        "label": "Description Font Size",
        "type": "size",
        "default": "var(--fs-xs)"
      },
      {
        "id": "nc-toast-animation-duration",
        "label": "Animation Duration",
        "type": "keyword",
        "default": "var(--fnd-motion-duration-300)"
      },
      {
        "id": "nc-toast-animation-easing",
        "label": "Animation Easing",
        "type": "keyword",
        "default": "ease-out"
      },
      {
        "id": "nc-toast-progress-height",
        "label": "Progress Height",
        "type": "size",
        "default": "3px"
      },
      {
        "id": "nc-toast-auto-dismiss-duration",
        "label": "Auto Dismiss Duration",
        "type": "keyword",
        "default": "5000"
      },
      {
        "id": "nc-toast-default-bg",
        "label": "Default Background",
        "type": "color",
        "default": "var(--fnd-color-surface-elevated)"
      },
      {
        "id": "nc-toast-default-color",
        "label": "Default Color",
        "type": "color",
        "default": "var(--fnd-color-text-primary)"
      },
      {
        "id": "nc-toast-default-border",
        "label": "Default Border",
        "type": "color",
        "default": "var(--fnd-color-border-primary)"
      },
      {
        "id": "nc-toast-default-icon-color",
        "label": "Default Icon Color",
        "type": "color",
        "default": "var(--fnd-color-text-secondary)"
      },
      {
        "id": "nc-toast-default-progress-bg",
        "label": "Default Progress",
        "type": "color",
        "default": "var(--fnd-color-text-secondary)"
      },
      {
        "id": "nc-toast-success-bg",
        "label": "Success Background",
        "type": "color",
        "default": "var(--fnd-color-background-success)"
      },
      {
        "id": "nc-toast-success-color",
        "label": "Success Color",
        "type": "color",
        "default": "var(--fnd-color-text-primary)"
      },
      {
        "id": "nc-toast-success-border",
        "label": "Success Border",
        "type": "color",
        "default": "var(--fnd-color-border-success)"
      },
      {
        "id": "nc-toast-success-icon-color",
        "label": "Success Icon Color",
        "type": "color",
        "default": "var(--fnd-color-feedback-success)"
      },
      {
        "id": "nc-toast-success-progress-bg",
        "label": "Success Progress",
        "type": "color",
        "default": "var(--fnd-color-feedback-success)"
      },
      {
        "id": "nc-toast-warning-bg",
        "label": "Warning Background",
        "type": "color",
        "default": "var(--fnd-color-background-warning)"
      },
      {
        "id": "nc-toast-warning-color",
        "label": "Warning Color",
        "type": "color",
        "default": "var(--fnd-color-text-primary)"
      },
      {
        "id": "nc-toast-warning-border",
        "label": "Warning Border",
        "type": "color",
        "default": "var(--fnd-color-feedback-warning)"
      },
      {
        "id": "nc-toast-warning-icon-color",
        "label": "Warning Icon Color",
        "type": "color",
        "default": "var(--fnd-color-feedback-warning)"
      },
      {
        "id": "nc-toast-warning-progress-bg",
        "label": "Warning Progress",
        "type": "color",
        "default": "var(--fnd-color-feedback-warning)"
      },
      {
        "id": "nc-toast-error-bg",
        "label": "Error Background",
        "type": "color",
        "default": "var(--fnd-color-background-danger)"
      },
      {
        "id": "nc-toast-error-color",
        "label": "Error Color",
        "type": "color",
        "default": "var(--fnd-color-text-primary)"
      },
      {
        "id": "nc-toast-error-border",
        "label": "Error Border",
        "type": "color",
        "default": "var(--fnd-color-border-danger)"
      },
      {
        "id": "nc-toast-error-icon-color",
        "label": "Error Icon Color",
        "type": "color",
        "default": "var(--fnd-color-feedback-danger)"
      },
      {
        "id": "nc-toast-error-progress-bg",
        "label": "Error Progress",
        "type": "color",
        "default": "var(--fnd-color-feedback-danger)"
      },
      {
        "id": "nc-toast-info-bg",
        "label": "Info Background",
        "type": "color",
        "default": "var(--fnd-color-background-info)"
      },
      {
        "id": "nc-toast-info-color",
        "label": "Info Color",
        "type": "color",
        "default": "var(--fnd-color-text-primary)"
      },
      {
        "id": "nc-toast-info-border",
        "label": "Info Border",
        "type": "color",
        "default": "var(--fnd-color-feedback-info)"
      },
      {
        "id": "nc-toast-info-icon-color",
        "label": "Info Icon Color",
        "type": "color",
        "default": "var(--fnd-color-feedback-info)"
      },
      {
        "id": "nc-toast-info-progress-bg",
        "label": "Info Progress",
        "type": "color",
        "default": "var(--fnd-color-feedback-info)"
      },
      {
        "id": "nc-toast-close-size",
        "label": "Close Size",
        "type": "size",
        "default": "20px"
      },
      {
        "id": "nc-toast-close-opacity",
        "label": "Close Opacity",
        "type": "opacity",
        "default": "var(--fnd-opacity-disabled)"
      },
      {
        "id": "nc-toast-close-bg-hover",
        "label": "Close BG Hover",
        "type": "color",
        "default": "color-mix(in srgb, currentColor 10%, transparent)"
      },
      {
        "id": "nc-toast-action-padding",
        "label": "Action Padding",
        "type": "spacing",
        "default": "var(--fnd-spacing-01) var(--fnd-spacing-03)"
      },
      {
        "id": "nc-toast-action-radius",
        "label": "Action Radius",
        "type": "radius",
        "default": "var(--fnd-radius-sm)"
      },
      {
        "id": "nc-toast-action-font-size",
        "label": "Action Font Size",
        "type": "size",
        "default": "var(--fs-xs)"
      },
      {
        "id": "nc-toast-stack-transition",
        "label": "Stack Transition",
        "type": "generic",
        "default": "var(--fnd-motion-duration-200)"
      },
      {
        "id": "nc-toast-max-visible",
        "label": "Max Visible",
        "type": "size",
        "default": "3"
      },
      {
        "id": "nc-toast-swipe-threshold",
        "label": "Swipe Threshold",
        "type": "generic",
        "default": "100"
      }
    ],
    "subgroups": [
      {
        "id": "geometry",
        "label": "Geometrie",
        "tokenIds": [
          "nc-toast-close-size",
          "nc-toast-action-padding",
          "nc-toast-action-radius",
          "nc-toast-max-visible"
        ]
      },
      {
        "id": "typography",
        "label": "Typografie",
        "tokenIds": [
          "nc-toast-action-font-size"
        ]
      },
      {
        "id": "colors",
        "label": "Farben",
        "category": "main",
        "tokenIds": [
          "nc-toast-close-bg-hover"
        ]
      },
      {
        "id": "interaction",
        "label": "Bewegung & Zustand",
        "category": "state",
        "tokenIds": [
          "nc-toast-close-opacity",
          "nc-toast-stack-transition"
        ]
      },
      {
        "id": "other",
        "label": "Weitere",
        "tokenIds": [
          "nc-toast-swipe-threshold"
        ]
      }
    ]
  },
  {
    "id": "data-table",
    "label": "Data Table",
    "icon": "table",
    "tokens": [
      {
        "id": "nc-dt-radius",
        "label": "Radius",
        "type": "size",
        "default": "var(--fnd-radius-sm)"
      },
      {
        "id": "nc-dt-border",
        "label": "Border",
        "type": "keyword",
        "default": "var(--fnd-border-width-xs) solid var(--fnd-color-border-secondary)"
      },
      {
        "id": "nc-dt-body-bg",
        "label": "Body Background",
        "type": "color",
        "default": "var(--fnd-color-background-base)"
      },
      {
        "id": "nc-dt-body-color",
        "label": "Body Color",
        "type": "color",
        "default": "var(--fnd-color-text-primary)"
      },
      {
        "id": "nc-dt-body-font-size",
        "label": "Body Font Size",
        "type": "size",
        "default": "var(--fs-sm)"
      },
      {
        "id": "nc-dt-body-font-weight",
        "label": "Body Font Weight",
        "type": "keyword",
        "default": "var(--fnd-font-weight-regular)"
      },
      {
        "id": "nc-dt-row-height-compact",
        "label": "Row Height Compact",
        "type": "size",
        "default": "var(--fnd-size-sm)"
      },
      {
        "id": "nc-dt-row-height-default",
        "label": "Row Height Default",
        "type": "size",
        "default": "var(--fnd-size-md)"
      },
      {
        "id": "nc-dt-row-height-comfortable",
        "label": "Row Height Comfortable",
        "type": "size",
        "default": "var(--fnd-size-lg)"
      },
      {
        "id": "nc-dt-row-height",
        "label": "Row Height",
        "type": "size",
        "default": "var(--nc-dt-row-height-default)"
      },
      {
        "id": "nc-dt-cell-padding-x",
        "label": "Cell Padding X",
        "type": "size",
        "default": "var(--fnd-spacing-04)"
      },
      {
        "id": "nc-dt-cell-padding-y",
        "label": "Cell Padding Y",
        "type": "size",
        "default": "var(--fnd-spacing-03)"
      },
      {
        "id": "nc-dt-header-height",
        "label": "Header Height",
        "type": "size",
        "default": "44px"
      },
      {
        "id": "nc-dt-header-bg",
        "label": "Header Background",
        "type": "color",
        "default": "var(--fnd-color-background-secondary)"
      },
      {
        "id": "nc-dt-header-color",
        "label": "Header Color",
        "type": "color",
        "default": "var(--fnd-color-text-secondary)"
      },
      {
        "id": "nc-dt-header-font-size",
        "label": "Header Font Size",
        "type": "size",
        "default": "var(--fs-sm)"
      },
      {
        "id": "nc-dt-header-font-weight",
        "label": "Header Font Weight",
        "type": "keyword",
        "default": "var(--fnd-font-weight-semibold)"
      },
      {
        "id": "nc-dt-header-letter-spacing",
        "label": "Header Letter Spacing",
        "type": "keyword",
        "default": "normal"
      },
      {
        "id": "nc-dt-header-border-bottom",
        "label": "Header Border Bottom",
        "type": "keyword",
        "default": "var(--fnd-border-width-sm) solid var(--fnd-color-border-secondary)"
      },
      {
        "id": "nc-dt-row-border-bottom",
        "label": "Row Border Bottom",
        "type": "keyword",
        "default": "var(--fnd-border-width-xs) solid var(--fnd-color-border-secondary)"
      },
      {
        "id": "nc-dt-row-bg-hover",
        "label": "Row Hover Background",
        "type": "color",
        "default": "var(--fnd-color-background-hover)"
      },
      {
        "id": "nc-dt-row-bg-selected",
        "label": "Row Selected Background",
        "type": "color",
        "default": "var(--fnd-color-layer-02)"
      },
      {
        "id": "nc-dt-row-bg-stripe",
        "label": "Row Stripe Background",
        "type": "color",
        "default": "var(--fnd-color-layer-01)"
      },
      {
        "id": "nc-dt-toolbar-height",
        "label": "Toolbar Height",
        "type": "size",
        "default": "48px"
      },
      {
        "id": "nc-dt-toolbar-padding",
        "label": "Toolbar Padding",
        "type": "size",
        "default": "var(--fnd-spacing-03) var(--fnd-spacing-04)"
      },
      {
        "id": "nc-dt-toolbar-bg",
        "label": "Toolbar Background",
        "type": "color",
        "default": "var(--fnd-color-background-base)"
      },
      {
        "id": "nc-dt-toolbar-border-bottom",
        "label": "Toolbar Border Bottom",
        "type": "keyword",
        "default": "var(--fnd-border-width-xs) solid var(--fnd-color-border-secondary)"
      },
      {
        "id": "nc-dt-toolbar-gap",
        "label": "Toolbar Gap",
        "type": "size",
        "default": "var(--fnd-spacing-03)"
      },
      {
        "id": "nc-dt-pagination-height",
        "label": "Pagination Height",
        "type": "size",
        "default": "48px"
      },
      {
        "id": "nc-dt-pagination-padding",
        "label": "Pagination Padding",
        "type": "size",
        "default": "var(--fnd-spacing-03) var(--fnd-spacing-04)"
      },
      {
        "id": "nc-dt-pagination-bg",
        "label": "Pagination Background",
        "type": "color",
        "default": "var(--fnd-color-background-base)"
      },
      {
        "id": "nc-dt-pagination-border-top",
        "label": "Pagination Border Top",
        "type": "keyword",
        "default": "var(--fnd-border-width-xs) solid var(--fnd-color-border-secondary)"
      },
      {
        "id": "nc-dt-pagination-gap",
        "label": "Pagination Gap",
        "type": "size",
        "default": "var(--fnd-spacing-03)"
      },
      {
        "id": "nc-dt-pagination-color",
        "label": "Pagination Color",
        "type": "color",
        "default": "var(--fnd-color-text-secondary)"
      },
      {
        "id": "nc-dt-pagination-font-size",
        "label": "Pagination Font Size",
        "type": "size",
        "default": "var(--fs-sm)"
      },
      {
        "id": "nc-dt-sort-icon-size",
        "label": "Sort Icon Size",
        "type": "size",
        "default": "16px"
      },
      {
        "id": "nc-dt-sort-icon-color",
        "label": "Sort Icon Color",
        "type": "color",
        "default": "var(--nc-icon-color-secondary)"
      },
      {
        "id": "nc-dt-sort-icon-color-active",
        "label": "Sort Icon Active Color",
        "type": "color",
        "default": "var(--nc-icon-color-default)"
      },
      {
        "id": "nc-dt-sort-hit-area",
        "label": "Sort Hit Area",
        "type": "size",
        "default": "var(--nc-icon-touch-target)"
      },
      {
        "id": "nc-dt-checkbox-column-width",
        "label": "Checkbox Column Width",
        "type": "size",
        "default": "52px"
      },
      {
        "id": "nc-dt-checkbox-padding-x",
        "label": "Checkbox Padding X",
        "type": "size",
        "default": "var(--fnd-spacing-03)"
      },
      {
        "id": "nc-dt-expand-icon-size",
        "label": "Expand Icon Size",
        "type": "size",
        "default": "var(--nc-icon-size-xs)"
      },
      {
        "id": "nc-dt-expand-column-width",
        "label": "Expand Column Width",
        "type": "size",
        "default": "52px"
      },
      {
        "id": "nc-dt-expand-panel-bg",
        "label": "Expand Panel Background",
        "type": "color",
        "default": "var(--fnd-color-layer-01)"
      },
      {
        "id": "nc-dt-expand-panel-padding",
        "label": "Expand Panel Padding",
        "type": "size",
        "default": "var(--fnd-spacing-04) var(--fnd-spacing-06)"
      },
      {
        "id": "nc-dt-action-column-width",
        "label": "Action Column Width",
        "type": "size",
        "default": "52px"
      },
      {
        "id": "nc-dt-action-icon-size",
        "label": "Action Icon Size",
        "type": "size",
        "default": "var(--nc-icon-size-sm)"
      },
      {
        "id": "nc-dt-batch-bg",
        "label": "Batch Background",
        "type": "color",
        "default": "var(--fnd-color-background-inverse)"
      },
      {
        "id": "nc-dt-batch-color",
        "label": "Batch Color",
        "type": "color",
        "default": "var(--fnd-color-text-inverse)"
      },
      {
        "id": "nc-dt-batch-padding",
        "label": "Batch Padding",
        "type": "size",
        "default": "var(--fnd-spacing-03) var(--fnd-spacing-04)"
      },
      {
        "id": "nc-dt-batch-height",
        "label": "Batch Height",
        "type": "size",
        "default": "var(--nc-dt-toolbar-height)"
      },
      {
        "id": "nc-dt-batch-radius",
        "label": "Batch Radius",
        "type": "size",
        "default": "var(--fnd-radius-sm)"
      },
      {
        "id": "nc-dt-search-min-width",
        "label": "Search Min Width",
        "type": "size",
        "default": "240px"
      },
      {
        "id": "nc-dt-select-width",
        "label": "Select Width",
        "type": "size",
        "default": "120px"
      },
      {
        "id": "nc-dt-page-select-width",
        "label": "Page Select Width",
        "type": "size",
        "default": "72px"
      },
      {
        "id": "nc-dt-empty-icon-size",
        "label": "Empty Icon Size",
        "type": "size",
        "default": "32px"
      },
      {
        "id": "nc-dt-empty-title-color",
        "label": "Empty Title Color",
        "type": "color",
        "default": "var(--fnd-color-text-primary)"
      },
      {
        "id": "nc-dt-empty-body-color",
        "label": "Empty Body Color",
        "type": "color",
        "default": "var(--fnd-color-text-secondary)"
      },
      {
        "id": "nc-dt-skeleton-bg",
        "label": "Skeleton Background",
        "type": "color",
        "default": "var(--fnd-color-background-secondary)"
      },
      {
        "id": "nc-dt-skeleton-radius",
        "label": "Skeleton Radius",
        "type": "size",
        "default": "var(--fnd-radius-sm)"
      },
      {
        "id": "nc-dt-skeleton-shimmer",
        "label": "Skeleton Shimmer",
        "type": "color",
        "default": "var(--fnd-color-background-tertiary)"
      },
      {
        "id": "nc-dt-error-border",
        "label": "Error Border",
        "type": "color",
        "default": "var(--fnd-color-border-danger)"
      },
      {
        "id": "nc-dt-error-color",
        "label": "Error Color",
        "type": "color",
        "default": "var(--fnd-color-text-danger)"
      },
      {
        "id": "nc-dt-scroll-shadow-size",
        "label": "Scroll Shadow Size",
        "type": "size",
        "default": "24px"
      },
      {
        "id": "nc-dt-transition-duration",
        "label": "Transition Duration",
        "type": "keyword",
        "default": "var(--fnd-motion-duration-200)"
      },
      {
        "id": "nc-dt-link-color",
        "label": "Link Color",
        "type": "color",
        "default": "var(--fnd-color-text-link)"
      },
      {
        "id": "nc-dt-link-color-hover",
        "label": "Link Hover Color",
        "type": "color",
        "default": "var(--fnd-color-text-link-hover)"
      },
      {
        "id": "nc-dt-link-icon-size",
        "label": "Link Icon Size",
        "type": "size",
        "default": "14px"
      },
      {
        "id": "nc-dt-link-gap",
        "label": "Link Gap",
        "type": "size",
        "default": "var(--fnd-spacing-01)"
      },
      {
        "id": "nc-dt-radio-column-width",
        "label": "Radio Column Width",
        "type": "size",
        "default": "52px"
      },
      {
        "id": "nc-dt-radio-padding-x",
        "label": "Radio Padding X",
        "type": "size",
        "default": "var(--fnd-spacing-03)"
      },
      {
        "id": "nc-dt-user-avatar-size",
        "label": "User Avatar Size",
        "type": "size",
        "default": "var(--nc-avatar-size-sm)"
      },
      {
        "id": "nc-dt-user-gap",
        "label": "User Gap",
        "type": "size",
        "default": "var(--fnd-spacing-03)"
      },
      {
        "id": "nc-dt-user-name-font-weight",
        "label": "User Name Font Weight",
        "type": "keyword",
        "default": "var(--fnd-font-weight-semibold)"
      },
      {
        "id": "nc-dt-user-name-color",
        "label": "User Name Color",
        "type": "color",
        "default": "var(--fnd-color-text-primary)"
      },
      {
        "id": "nc-dt-user-email-font-size",
        "label": "User Email Font Size",
        "type": "size",
        "default": "var(--fs-xs)"
      },
      {
        "id": "nc-dt-user-email-color",
        "label": "User Email Color",
        "type": "color",
        "default": "var(--fnd-color-text-secondary)"
      },
      {
        "id": "nc-dt-progress-height",
        "label": "Progress Height",
        "type": "size",
        "default": "6px"
      },
      {
        "id": "nc-dt-progress-bg",
        "label": "Progress Background",
        "type": "color",
        "default": "var(--fnd-color-background-tertiary)"
      },
      {
        "id": "nc-dt-progress-fill",
        "label": "Progress Fill",
        "type": "color",
        "default": "var(--fnd-color-interactive-default)"
      },
      {
        "id": "nc-dt-progress-fill-success",
        "label": "Progress Fill Success",
        "type": "color",
        "default": "var(--fnd-color-feedback-success)"
      },
      {
        "id": "nc-dt-progress-fill-warning",
        "label": "Progress Fill Warning",
        "type": "color",
        "default": "var(--fnd-color-feedback-warning)"
      },
      {
        "id": "nc-dt-progress-fill-danger",
        "label": "Progress Fill Danger",
        "type": "color",
        "default": "var(--fnd-color-feedback-danger)"
      },
      {
        "id": "nc-dt-progress-radius",
        "label": "Progress Radius",
        "type": "size",
        "default": "var(--fnd-radius-full)"
      },
      {
        "id": "nc-dt-progress-gap",
        "label": "Progress Gap",
        "type": "size",
        "default": "var(--fnd-spacing-02)"
      },
      {
        "id": "nc-dt-progress-label-width",
        "label": "Progress Label Width",
        "type": "size",
        "default": "36px"
      },
      {
        "id": "nc-dt-progress-label-font-size",
        "label": "Progress Label Font Size",
        "type": "size",
        "default": "var(--fs-xs)"
      },
      {
        "id": "nc-dt-actions-gap",
        "label": "Actions Gap",
        "type": "size",
        "default": "var(--fnd-spacing-01)"
      },
      {
        "id": "nc-dt-date-font-feature",
        "label": "Date Font Feature",
        "type": "keyword",
        "default": "'tnum'"
      },
      {
        "id": "nc-dt-title-bar-padding",
        "label": "Title Bar Padding",
        "type": "size",
        "default": "var(--fnd-spacing-04) var(--fnd-spacing-04) 0"
      },
      {
        "id": "nc-dt-title-bar-gap",
        "label": "Title Bar Gap",
        "type": "size",
        "default": "var(--fnd-spacing-02)"
      },
      {
        "id": "nc-dt-title-font-size",
        "label": "Title Font Size",
        "type": "size",
        "default": "var(--fnd-typography-heading-m-font-size)"
      },
      {
        "id": "nc-dt-title-font-weight",
        "label": "Title Font Weight",
        "type": "keyword",
        "default": "var(--fnd-font-weight-semibold)"
      },
      {
        "id": "nc-dt-title-color",
        "label": "Title Color",
        "type": "color",
        "default": "var(--fnd-color-text-primary)"
      },
      {
        "id": "nc-dt-title-line-height",
        "label": "Title Line Height",
        "type": "keyword",
        "default": "1.3"
      },
      {
        "id": "nc-dt-description-font-size",
        "label": "Description Font Size",
        "type": "size",
        "default": "var(--fnd-typography-body-m-font-size)"
      },
      {
        "id": "nc-dt-description-color",
        "label": "Description Color",
        "type": "color",
        "default": "var(--fnd-color-text-secondary)"
      },
      {
        "id": "nc-dt-description-line-height",
        "label": "Description Line Height",
        "type": "keyword",
        "default": "1.5"
      }
    ]
  },
  {
    "id": "form",
    "label": "Form",
    "icon": "forms",
    "tokens": [
      {
        "id": "nc-form-gap",
        "label": "Field Gap",
        "type": "size",
        "default": "var(--fnd-spacing-06)"
      },
      {
        "id": "nc-form-section-gap",
        "label": "Section Gap",
        "type": "size",
        "default": "var(--fnd-spacing-08)"
      },
      {
        "id": "nc-form-divider-color",
        "label": "Divider Color",
        "type": "color",
        "default": "var(--fnd-color-border-secondary)"
      },
      {
        "id": "nc-form-actions-gap",
        "label": "Actions Gap",
        "type": "size",
        "default": "var(--fnd-spacing-04)"
      },
      {
        "id": "nc-form-label-font-size",
        "label": "Label Font Size",
        "type": "size",
        "default": "var(--fs-base)"
      },
      {
        "id": "nc-form-label-font-weight",
        "label": "Label Font Weight",
        "type": "keyword",
        "default": "var(--fnd-font-weight-semibold)"
      },
      {
        "id": "nc-form-label-color",
        "label": "Label Color",
        "type": "color",
        "default": "var(--fnd-color-text-primary)"
      },
      {
        "id": "nc-form-label-gap",
        "label": "Label Gap",
        "type": "size",
        "default": "var(--fnd-spacing-02)"
      },
      {
        "id": "nc-form-label-required-color",
        "label": "Label Required Color",
        "type": "color",
        "default": "var(--fnd-color-feedback-danger)"
      },
      {
        "id": "nc-form-label-optional-color",
        "label": "Label Optional Color",
        "type": "color",
        "default": "var(--fnd-color-text-tertiary)"
      },
      {
        "id": "nc-form-hint-font-size",
        "label": "Hint Font Size",
        "type": "size",
        "default": "var(--fs-sm)"
      },
      {
        "id": "nc-form-hint-color",
        "label": "Hint Color",
        "type": "color",
        "default": "var(--fnd-color-text-secondary)"
      },
      {
        "id": "nc-form-hint-gap",
        "label": "Hint Gap",
        "type": "size",
        "default": "var(--fnd-spacing-01)"
      },
      {
        "id": "nc-form-error-font-size",
        "label": "Error Font Size",
        "type": "size",
        "default": "var(--fs-sm)"
      },
      {
        "id": "nc-form-error-font-weight",
        "label": "Error Font Weight",
        "type": "keyword",
        "default": "var(--fnd-font-weight-medium)"
      },
      {
        "id": "nc-form-error-color",
        "label": "Error Color",
        "type": "color",
        "default": "var(--fnd-color-feedback-danger)"
      },
      {
        "id": "nc-form-error-icon-size",
        "label": "Error Icon Size",
        "type": "size",
        "default": "16px"
      },
      {
        "id": "nc-form-error-gap",
        "label": "Error Gap",
        "type": "size",
        "default": "var(--fnd-spacing-01)"
      },
      {
        "id": "nc-form-field-gap",
        "label": "Field Inner Gap",
        "type": "size",
        "default": "var(--fnd-spacing-01)"
      },
      {
        "id": "nc-form-control-bg",
        "label": "Control BG",
        "type": "color",
        "ref": "background-base"
      },
      {
        "id": "nc-form-control-color",
        "label": "Control Color",
        "type": "color",
        "ref": "text-primary"
      },
      {
        "id": "nc-form-control-border-color",
        "label": "Control Border Color",
        "type": "color",
        "ref": "border-primary"
      },
      {
        "id": "nc-form-control-radius",
        "label": "Control Radius",
        "type": "radius",
        "default": "var(--fnd-radius-sm)"
      },
      {
        "id": "nc-form-control-border-width",
        "label": "Control Border Width",
        "type": "size",
        "default": "var(--fnd-border-width-xs)"
      },
      {
        "id": "nc-form-control-placeholder-color",
        "label": "Control Placeholder Color",
        "type": "color",
        "ref": "text-tertiary"
      },
      {
        "id": "nc-form-control-border-hover",
        "label": "Control Border Hover",
        "type": "color",
        "ref": "border-strong"
      },
      {
        "id": "nc-form-control-border-focus",
        "label": "Control Border Focus",
        "type": "color",
        "ref": "interactive-focus"
      },
      {
        "id": "nc-form-control-border-error",
        "label": "Control Border Error",
        "type": "color",
        "ref": "border-danger"
      },
      {
        "id": "nc-form-control-border-success",
        "label": "Control Border Success",
        "type": "color",
        "ref": "border-success"
      },
      {
        "id": "nc-form-control-transition-duration",
        "label": "Control Transition Duration",
        "type": "duration",
        "default": "var(--fnd-motion-duration-200)"
      },
      {
        "id": "nc-form-control-filled-bg",
        "label": "Control Filled BG",
        "type": "color",
        "ref": "background-secondary"
      },
      {
        "id": "nc-form-control-filled-bg-hover",
        "label": "Control Filled BG Hover",
        "type": "color",
        "ref": "background-tertiary"
      },
      {
        "id": "nc-form-control-filled-bg-focus",
        "label": "Control Filled BG Focus",
        "type": "color",
        "ref": "background-secondary"
      },
      {
        "id": "nc-form-control-filled-border-bottom",
        "label": "Control Filled Border Bottom",
        "type": "color",
        "default": "var(--fnd-border-width-sm)"
      },
      {
        "id": "nc-form-control-filled-underline-color",
        "label": "Control Filled Underline Color",
        "type": "color",
        "ref": "border-primary"
      },
      {
        "id": "nc-form-control-filled-underline-color-focus",
        "label": "Control Filled Underline Color Focus",
        "type": "color",
        "ref": "interactive-focus"
      },
      {
        "id": "nc-form-control-filled-color",
        "label": "Control Filled Color",
        "type": "color",
        "ref": "text-primary"
      },
      {
        "id": "nc-form-control-minimal-bg-hover",
        "label": "Control Minimal BG Hover",
        "type": "color",
        "default": "color-mix(in srgb, var(--fnd-color-text-primary) 6%, transparent)"
      },
      {
        "id": "nc-form-control-minimal-border-focus",
        "label": "Control Minimal Border Focus",
        "type": "color",
        "ref": "interactive-focus"
      }
    ],
    "subgroups": [
      {
        "id": "geometry",
        "label": "Geometrie",
        "tokenIds": [
          "nc-form-control-radius",
          "nc-form-control-border-width"
        ]
      },
      {
        "id": "colors",
        "label": "Farben",
        "category": "main",
        "tokenIds": [
          "nc-form-control-bg",
          "nc-form-control-color",
          "nc-form-control-border-color",
          "nc-form-control-placeholder-color",
          "nc-form-control-border-hover",
          "nc-form-control-border-focus",
          "nc-form-control-border-error",
          "nc-form-control-border-success",
          "nc-form-control-filled-bg",
          "nc-form-control-filled-bg-hover",
          "nc-form-control-filled-bg-focus",
          "nc-form-control-filled-border-bottom",
          "nc-form-control-filled-underline-color",
          "nc-form-control-filled-underline-color-focus",
          "nc-form-control-filled-color",
          "nc-form-control-minimal-bg-hover",
          "nc-form-control-minimal-border-focus"
        ]
      },
      {
        "id": "interaction",
        "label": "Bewegung & Zustand",
        "category": "state",
        "tokenIds": [
          "nc-form-control-transition-duration"
        ]
      }
    ]
  },
  {
    "id": "input-group",
    "label": "Input Group",
    "icon": "layout-columns",
    "tokens": [
      {
        "id": "nc-input-group-addon-bg",
        "label": "Addon Background",
        "type": "color",
        "default": "var(--fnd-color-background-secondary)"
      },
      {
        "id": "nc-input-group-addon-color",
        "label": "Addon Color",
        "type": "color",
        "default": "var(--fnd-color-text-secondary)"
      },
      {
        "id": "nc-input-group-addon-border",
        "label": "Addon Border",
        "type": "color",
        "default": "var(--fnd-color-border-primary)"
      },
      {
        "id": "nc-input-group-addon-padding-x",
        "label": "Addon Padding X",
        "type": "size",
        "default": "var(--fnd-spacing-03)"
      },
      {
        "id": "nc-input-group-addon-font-size",
        "label": "Addon Font Size",
        "type": "size",
        "default": "var(--nc-input-font-size-md)"
      },
      {
        "id": "nc-input-group-height-sm",
        "label": "Height SM",
        "type": "size",
        "default": "var(--nc-input-height-sm)"
      },
      {
        "id": "nc-input-group-height-md",
        "label": "Height MD",
        "type": "size",
        "default": "var(--nc-input-height-md)"
      },
      {
        "id": "nc-input-group-height-lg",
        "label": "Height LG",
        "type": "size",
        "default": "var(--nc-input-height-lg)"
      },
      {
        "id": "nc-input-group-radius",
        "label": "Radius",
        "type": "radius",
        "default": "var(--nc-input-radius)"
      },
      {
        "id": "nc-input-group-border-width",
        "label": "Border Width",
        "type": "size",
        "default": "var(--nc-input-border-width)"
      },
      {
        "id": "nc-input-group-addon-hover-bg",
        "label": "Addon Hover BG",
        "type": "color",
        "ref": "background-tertiary"
      },
      {
        "id": "nc-input-group-addon-active-bg",
        "label": "Addon Active BG",
        "type": "color",
        "ref": "background-quaternary"
      },
      {
        "id": "nc-input-group-addon-border-error",
        "label": "Addon Border Error",
        "type": "color",
        "default": "var(--nc-input-border-error)"
      },
      {
        "id": "nc-input-group-addon-border-success",
        "label": "Addon Border Success",
        "type": "color",
        "default": "var(--nc-input-border-success)"
      },
      {
        "id": "nc-input-group-inner-radius",
        "label": "Inner Radius",
        "type": "radius",
        "default": "var(--fnd-radius-null)"
      }
    ],
    "subgroups": [
      {
        "id": "geometry",
        "label": "Geometrie",
        "tokenIds": [
          "nc-input-group-height-sm",
          "nc-input-group-height-md",
          "nc-input-group-height-lg",
          "nc-input-group-radius",
          "nc-input-group-border-width",
          "nc-input-group-inner-radius"
        ]
      },
      {
        "id": "colors",
        "label": "Farben",
        "category": "main",
        "tokenIds": [
          "nc-input-group-addon-hover-bg",
          "nc-input-group-addon-active-bg",
          "nc-input-group-addon-border-error",
          "nc-input-group-addon-border-success"
        ]
      }
    ]
  },
  {
    "id": "toolbar",
    "label": "Toolbar",
    "icon": "tools",
    "tokens": [
      {
        "id": "nc-toolbar-height",
        "label": "Height",
        "type": "size",
        "default": "var(--fnd-size-lg)"
      },
      {
        "id": "nc-toolbar-padding",
        "label": "Padding",
        "type": "size",
        "default": "var(--fnd-spacing-02) var(--fnd-spacing-03)"
      },
      {
        "id": "nc-toolbar-gap",
        "label": "Gap",
        "type": "size",
        "default": "var(--fnd-spacing-02)"
      },
      {
        "id": "nc-toolbar-bg",
        "label": "Background",
        "type": "color",
        "default": "var(--fnd-color-background-base)"
      },
      {
        "id": "nc-toolbar-border",
        "label": "Border Color",
        "type": "color",
        "default": "var(--fnd-color-border-secondary)"
      },
      {
        "id": "nc-toolbar-border-width",
        "label": "Border Width",
        "type": "size",
        "default": "var(--fnd-border-width-xs)"
      },
      {
        "id": "nc-toolbar-radius",
        "label": "Border Radius",
        "type": "size",
        "default": "var(--fnd-radius-sm)"
      },
      {
        "id": "nc-toolbar-separator-color",
        "label": "Separator Color",
        "type": "color",
        "default": "var(--fnd-color-border-secondary)"
      },
      {
        "id": "nc-toolbar-separator-width",
        "label": "Separator Width",
        "type": "size",
        "default": "var(--fnd-border-width-xs)"
      },
      {
        "id": "nc-toolbar-separator-margin",
        "label": "Separator Margin",
        "type": "size",
        "default": "var(--fnd-spacing-01)"
      },
      {
        "id": "nc-toolbar-label-color",
        "label": "Label Color",
        "type": "color",
        "default": "var(--fnd-color-text-secondary)"
      },
      {
        "id": "nc-toolbar-label-size",
        "label": "Label Font Size",
        "type": "size",
        "default": "var(--fs-sm)"
      },
      {
        "id": "nc-toolbar-label-weight",
        "label": "Label Font Weight",
        "type": "fontWeight",
        "default": "var(--fnd-font-weight-medium)"
      },
      {
        "id": "nc-toolbar-separator-height",
        "label": "Separator Height",
        "type": "size",
        "default": "24px"
      },
      {
        "id": "nc-toolbar-compact-height",
        "label": "Compact Height",
        "type": "size",
        "default": "var(--fnd-size-sm)"
      },
      {
        "id": "nc-toolbar-compact-gap",
        "label": "Compact Gap",
        "type": "spacing",
        "default": "var(--fnd-spacing-01)"
      },
      {
        "id": "nc-toolbar-compact-padding",
        "label": "Compact Padding",
        "type": "spacing",
        "default": "var(--fnd-spacing-01) var(--fnd-spacing-02)"
      },
      {
        "id": "nc-toolbar-floating-bg",
        "label": "Floating BG",
        "type": "color",
        "default": "var(--fnd-color-surface-elevated)"
      },
      {
        "id": "nc-toolbar-floating-radius",
        "label": "Floating Radius",
        "type": "radius",
        "default": "var(--fnd-radius-md)"
      },
      {
        "id": "nc-toolbar-floating-shadow",
        "label": "Floating Shadow",
        "type": "color",
        "default": "var(--fnd-elevation-floating)"
      },
      {
        "id": "nc-toolbar-floating-border",
        "label": "Floating Border",
        "type": "color",
        "ref": "border-secondary"
      },
      {
        "id": "nc-toolbar-blurred-bg",
        "label": "Blurred BG",
        "type": "color",
        "default": "color-mix(in srgb, var(--fnd-color-background-base) 80%, transparent)"
      },
      {
        "id": "nc-toolbar-blurred-blur",
        "label": "Blurred Blur",
        "type": "size",
        "default": "12px"
      },
      {
        "id": "nc-toolbar-blurred-border",
        "label": "Blurred Border",
        "type": "color",
        "default": "color-mix(in srgb, var(--fnd-color-border-secondary) 50%, transparent)"
      },
      {
        "id": "nc-toolbar-sticky-shadow",
        "label": "Sticky Shadow",
        "type": "color",
        "default": "var(--fnd-shadow-sm)"
      },
      {
        "id": "nc-toolbar-sticky-z-index",
        "label": "Sticky Z Index",
        "type": "generic",
        "default": "var(--fnd-z-sticky)"
      },
      {
        "id": "nc-toolbar-overflow-trigger-size",
        "label": "Overflow Trigger Size",
        "type": "size",
        "default": "var(--fnd-size-sm)"
      }
    ],
    "subgroups": [
      {
        "id": "geometry",
        "label": "Geometrie",
        "tokenIds": [
          "nc-toolbar-separator-height",
          "nc-toolbar-compact-height",
          "nc-toolbar-compact-gap",
          "nc-toolbar-compact-padding",
          "nc-toolbar-floating-radius",
          "nc-toolbar-overflow-trigger-size"
        ]
      },
      {
        "id": "colors",
        "label": "Farben",
        "category": "main",
        "tokenIds": [
          "nc-toolbar-floating-bg",
          "nc-toolbar-floating-shadow",
          "nc-toolbar-floating-border",
          "nc-toolbar-blurred-bg",
          "nc-toolbar-blurred-border",
          "nc-toolbar-sticky-shadow"
        ]
      },
      {
        "id": "interaction",
        "label": "Bewegung & Zustand",
        "category": "state",
        "tokenIds": [
          "nc-toolbar-blurred-blur",
          "nc-toolbar-sticky-z-index"
        ]
      }
    ]
  },
  {
    "id": "banner",
    "label": "Banner",
    "icon": "speakerphone",
    "tokens": [
      {
        "id": "nc-banner-padding",
        "label": "Padding",
        "type": "size",
        "default": "var(--fnd-spacing-03) var(--fnd-spacing-05)"
      },
      {
        "id": "nc-banner-gap",
        "label": "Gap",
        "type": "size",
        "default": "var(--fnd-spacing-03)"
      },
      {
        "id": "nc-banner-z-index",
        "label": "Z-Index",
        "type": "other",
        "default": "var(--fnd-z-notification)"
      },
      {
        "id": "nc-banner-font-size",
        "label": "Font Size",
        "type": "size",
        "default": "var(--fs-sm)"
      },
      {
        "id": "nc-banner-font-weight",
        "label": "Font Weight",
        "type": "fontWeight",
        "default": "var(--fnd-font-weight-medium)"
      },
      {
        "id": "nc-banner-info-bg",
        "label": "Info Background",
        "type": "color",
        "default": "var(--fnd-color-interactive-default)"
      },
      {
        "id": "nc-banner-info-color",
        "label": "Info Color",
        "type": "color",
        "default": "var(--fnd-color-text-on-interactive)"
      },
      {
        "id": "nc-banner-warning-bg",
        "label": "Warning Background",
        "type": "color",
        "default": "var(--fnd-color-feedback-warning)"
      },
      {
        "id": "nc-banner-warning-color",
        "label": "Warning Color",
        "type": "color",
        "default": "var(--fnd-color-on-warning)"
      },
      {
        "id": "nc-banner-danger-bg",
        "label": "Danger Background",
        "type": "color",
        "default": "var(--fnd-color-feedback-danger)"
      },
      {
        "id": "nc-banner-danger-color",
        "label": "Danger Color",
        "type": "color",
        "default": "var(--fnd-color-on-danger)"
      },
      {
        "id": "nc-banner-success-bg",
        "label": "Success Background",
        "type": "color",
        "default": "var(--fnd-color-feedback-success)"
      },
      {
        "id": "nc-banner-success-color",
        "label": "Success Color",
        "type": "color",
        "default": "var(--fnd-color-on-success)"
      },
      {
        "id": "nc-banner-close-size",
        "label": "Close Button Size",
        "type": "size",
        "default": "20px"
      },
      {
        "id": "nc-banner-close-radius",
        "label": "Close Button Radius",
        "type": "size",
        "default": "var(--fnd-radius-sm)"
      },
      {
        "id": "nc-banner-close-opacity",
        "label": "Close Button Opacity",
        "type": "other",
        "default": "var(--fnd-opacity-medium)"
      },
      {
        "id": "nc-banner-close-opacity-hover",
        "label": "Close Button Hover Opacity",
        "type": "other",
        "default": "1"
      },
      {
        "id": "nc-banner-link-weight",
        "label": "Link Font Weight",
        "type": "fontWeight",
        "default": "var(--fnd-font-weight-bold)"
      },
      {
        "id": "nc-banner-link-underline",
        "label": "Link Underline",
        "type": "other",
        "default": "underline"
      },
      {
        "id": "nc-banner-icon-size",
        "label": "Icon Size",
        "type": "size",
        "default": "16px"
      },
      {
        "id": "nc-banner-accent-border-width",
        "label": "Accent Border Width",
        "type": "size",
        "default": "4px"
      },
      {
        "id": "nc-banner-accent-border-color",
        "label": "Accent Border Color",
        "type": "color",
        "default": "currentColor"
      },
      {
        "id": "nc-banner-dismiss-duration",
        "label": "Dismiss Duration",
        "type": "duration",
        "default": "var(--fnd-motion-duration-300)"
      },
      {
        "id": "nc-banner-title-weight",
        "label": "Title Weight",
        "type": "fontWeight",
        "default": "var(--fnd-font-weight-bold)"
      }
    ],
    "subgroups": [
      {
        "id": "geometry",
        "label": "Geometrie",
        "tokenIds": [
          "nc-banner-icon-size",
          "nc-banner-accent-border-width"
        ]
      },
      {
        "id": "typography",
        "label": "Typografie",
        "tokenIds": [
          "nc-banner-title-weight"
        ]
      },
      {
        "id": "colors",
        "label": "Farben",
        "category": "main",
        "tokenIds": [
          "nc-banner-accent-border-color"
        ]
      },
      {
        "id": "interaction",
        "label": "Bewegung & Zustand",
        "category": "state",
        "tokenIds": [
          "nc-banner-dismiss-duration"
        ]
      }
    ]
  },
  {
    "id": "search",
    "label": "Search",
    "icon": "search",
    "tokens": [
      {
        "id": "nc-search-width",
        "label": "Width",
        "type": "size",
        "default": "320px"
      },
      {
        "id": "nc-search-max-width",
        "label": "Max Width",
        "type": "size",
        "default": "100%"
      },
      {
        "id": "nc-search-results-bg",
        "label": "Results Background",
        "type": "color",
        "default": "var(--fnd-color-background-base)"
      },
      {
        "id": "nc-search-results-border",
        "label": "Results Border",
        "type": "color",
        "default": "var(--fnd-color-border-secondary)"
      },
      {
        "id": "nc-search-results-border-width",
        "label": "Results Border Width",
        "type": "size",
        "default": "var(--fnd-border-width-xs)"
      },
      {
        "id": "nc-search-results-radius",
        "label": "Results Radius",
        "type": "size",
        "default": "var(--fnd-radius-sm)"
      },
      {
        "id": "nc-search-results-shadow",
        "label": "Results Shadow",
        "type": "shadow",
        "default": "var(--fnd-elevation-floating)"
      },
      {
        "id": "nc-search-results-max-height",
        "label": "Results Max Height",
        "type": "size",
        "default": "400px"
      },
      {
        "id": "nc-search-results-padding",
        "label": "Results Padding",
        "type": "size",
        "default": "var(--fnd-spacing-01)"
      },
      {
        "id": "nc-search-results-z-index",
        "label": "Results Z-Index",
        "type": "other",
        "default": "var(--fnd-z-dropdown)"
      },
      {
        "id": "nc-search-results-animation",
        "label": "Results Animation Duration",
        "type": "other",
        "default": "var(--fnd-motion-duration-150)"
      },
      {
        "id": "nc-search-item-height",
        "label": "Item Height",
        "type": "size",
        "default": "var(--fnd-size-sm)"
      },
      {
        "id": "nc-search-item-padding",
        "label": "Item Padding",
        "type": "size",
        "default": "var(--fnd-spacing-02) var(--fnd-spacing-03)"
      },
      {
        "id": "nc-search-item-radius",
        "label": "Item Radius",
        "type": "size",
        "default": "var(--fnd-radius-sm)"
      },
      {
        "id": "nc-search-item-color",
        "label": "Item Color",
        "type": "color",
        "default": "var(--fnd-color-text-primary)"
      },
      {
        "id": "nc-search-item-bg-hover",
        "label": "Item Hover Background",
        "type": "color",
        "default": "var(--fnd-color-background-hover)"
      },
      {
        "id": "nc-search-item-icon-size",
        "label": "Item Icon Size",
        "type": "size",
        "default": "16px"
      },
      {
        "id": "nc-search-item-icon-color",
        "label": "Item Icon Color",
        "type": "color",
        "default": "var(--fnd-color-text-secondary)"
      },
      {
        "id": "nc-search-item-gap",
        "label": "Item Gap",
        "type": "size",
        "default": "var(--fnd-spacing-02)"
      },
      {
        "id": "nc-search-item-font-size",
        "label": "Item Font Size",
        "type": "size",
        "default": "var(--fs-sm)"
      },
      {
        "id": "nc-search-highlight-bg",
        "label": "Highlight Background",
        "type": "color",
        "default": "color-mix(in srgb, var(--fnd-color-feedback-warning) 30%, transparent)"
      },
      {
        "id": "nc-search-highlight-color",
        "label": "Highlight Color",
        "type": "color",
        "default": "var(--fnd-color-text-primary)"
      },
      {
        "id": "nc-search-group-label-color",
        "label": "Group Label Color",
        "type": "color",
        "default": "var(--fnd-color-text-tertiary)"
      },
      {
        "id": "nc-search-group-label-size",
        "label": "Group Label Size",
        "type": "size",
        "default": "var(--fs-xs)"
      },
      {
        "id": "nc-search-group-label-weight",
        "label": "Group Label Weight",
        "type": "fontWeight",
        "default": "var(--fnd-font-weight-semibold)"
      },
      {
        "id": "nc-search-group-label-padding",
        "label": "Group Label Padding",
        "type": "size",
        "default": "var(--fnd-spacing-02) var(--fnd-spacing-03)"
      },
      {
        "id": "nc-search-shortcut-color",
        "label": "Shortcut Color",
        "type": "color",
        "default": "var(--fnd-color-text-tertiary)"
      },
      {
        "id": "nc-search-shortcut-size",
        "label": "Shortcut Size",
        "type": "size",
        "default": "var(--fs-xs)"
      },
      {
        "id": "nc-search-input-radius",
        "label": "Input Radius",
        "type": "radius",
        "default": "var(--nc-input-radius)"
      },
      {
        "id": "nc-search-input-height",
        "label": "Input Height",
        "type": "size",
        "default": "var(--fnd-size-md)"
      },
      {
        "id": "nc-search-scope-bg",
        "label": "Scope BG",
        "type": "color",
        "ref": "background-secondary"
      },
      {
        "id": "nc-search-scope-color",
        "label": "Scope Color",
        "type": "color",
        "ref": "text-secondary"
      },
      {
        "id": "nc-search-scope-border",
        "label": "Scope Border",
        "type": "color",
        "ref": "border-secondary"
      },
      {
        "id": "nc-search-scope-radius",
        "label": "Scope Radius",
        "type": "radius",
        "default": "var(--fnd-radius-sm)"
      },
      {
        "id": "nc-search-scope-font-size",
        "label": "Scope Font Size",
        "type": "size",
        "default": "var(--fs-xs)"
      },
      {
        "id": "nc-search-scope-padding",
        "label": "Scope Padding",
        "type": "spacing",
        "default": "var(--fnd-spacing-01) var(--fnd-spacing-02)"
      },
      {
        "id": "nc-search-scope-gap",
        "label": "Scope Gap",
        "type": "spacing",
        "default": "var(--fnd-spacing-02)"
      },
      {
        "id": "nc-search-minimal-bg",
        "label": "Minimal BG",
        "type": "color",
        "default": "transparent"
      },
      {
        "id": "nc-search-minimal-border",
        "label": "Minimal Border",
        "type": "color",
        "default": "transparent"
      },
      {
        "id": "nc-search-minimal-border-focus",
        "label": "Minimal Border Focus",
        "type": "color",
        "ref": "interactive-focus"
      },
      {
        "id": "nc-search-xl-height",
        "label": "XL Height",
        "type": "size",
        "default": "64px"
      },
      {
        "id": "nc-search-xl-font-size",
        "label": "XL Font Size",
        "type": "size",
        "default": "var(--fs-lg)"
      },
      {
        "id": "nc-search-xl-icon-size",
        "label": "XL Icon Size",
        "type": "size",
        "default": "24px"
      },
      {
        "id": "nc-search-xl-radius",
        "label": "XL Radius",
        "type": "radius",
        "default": "var(--fnd-radius-md)"
      },
      {
        "id": "nc-search-xl-shadow",
        "label": "XL Shadow",
        "type": "color",
        "default": "var(--fnd-elevation-floating)"
      },
      {
        "id": "nc-search-command-max-width",
        "label": "Command Max Width",
        "type": "size",
        "default": "640px"
      },
      {
        "id": "nc-search-command-shadow",
        "label": "Command Shadow",
        "type": "color",
        "default": "var(--fnd-shadow-xl)"
      },
      {
        "id": "nc-search-command-radius",
        "label": "Command Radius",
        "type": "radius",
        "default": "var(--fnd-radius-md)"
      },
      {
        "id": "nc-search-command-overlay-bg",
        "label": "Command Overlay BG",
        "type": "color",
        "default": "color-mix(in srgb, var(--fnd-color-text-primary) 40%, transparent)"
      },
      {
        "id": "nc-search-ghost-color",
        "label": "Ghost Color",
        "type": "color",
        "ref": "text-tertiary"
      },
      {
        "id": "nc-search-clear-size",
        "label": "Clear Size",
        "type": "size",
        "default": "20px"
      },
      {
        "id": "nc-search-clear-color",
        "label": "Clear Color",
        "type": "color",
        "ref": "text-tertiary"
      },
      {
        "id": "nc-search-clear-color-hover",
        "label": "Clear Color Hover",
        "type": "color",
        "ref": "text-primary"
      },
      {
        "id": "nc-search-results-top-offset",
        "label": "Results Top Offset",
        "type": "size",
        "default": "0"
      },
      {
        "id": "nc-search-backdrop-bg",
        "label": "Backdrop BG",
        "type": "color",
        "default": "var(--fnd-color-always-dark)"
      },
      {
        "id": "nc-search-backdrop-opacity",
        "label": "Backdrop Opacity",
        "type": "opacity",
        "default": "0.35"
      },
      {
        "id": "nc-search-backdrop-z-index",
        "label": "Backdrop Z Index",
        "type": "generic",
        "default": "calc(var(--fnd-z-dropdown) - 1)"
      },
      {
        "id": "nc-search-mobile-header-height",
        "label": "Mobile Header Height",
        "type": "size",
        "default": "56px"
      },
      {
        "id": "nc-search-mobile-results-max-height",
        "label": "Mobile Results Max Height",
        "type": "size",
        "default": "calc(100dvh - 56px)"
      },
      {
        "id": "nc-search-mobile-bg",
        "label": "Mobile BG",
        "type": "color",
        "ref": "background-base"
      }
    ],
    "subgroups": [
      {
        "id": "geometry",
        "label": "Geometrie",
        "tokenIds": [
          "nc-search-input-radius",
          "nc-search-input-height",
          "nc-search-scope-radius",
          "nc-search-scope-padding",
          "nc-search-scope-gap",
          "nc-search-xl-height",
          "nc-search-xl-icon-size",
          "nc-search-xl-radius",
          "nc-search-command-max-width",
          "nc-search-command-radius",
          "nc-search-clear-size",
          "nc-search-results-top-offset",
          "nc-search-mobile-header-height",
          "nc-search-mobile-results-max-height"
        ]
      },
      {
        "id": "typography",
        "label": "Typografie",
        "tokenIds": [
          "nc-search-scope-font-size",
          "nc-search-xl-font-size"
        ]
      },
      {
        "id": "colors",
        "label": "Farben",
        "category": "main",
        "tokenIds": [
          "nc-search-scope-bg",
          "nc-search-scope-color",
          "nc-search-scope-border",
          "nc-search-minimal-bg",
          "nc-search-minimal-border",
          "nc-search-minimal-border-focus",
          "nc-search-xl-shadow",
          "nc-search-command-shadow",
          "nc-search-command-overlay-bg",
          "nc-search-ghost-color",
          "nc-search-clear-color",
          "nc-search-clear-color-hover",
          "nc-search-backdrop-bg",
          "nc-search-mobile-bg"
        ]
      },
      {
        "id": "interaction",
        "label": "Bewegung & Zustand",
        "category": "state",
        "tokenIds": [
          "nc-search-backdrop-opacity",
          "nc-search-backdrop-z-index"
        ]
      }
    ]
  },
  {
    "id": "dropdown-menu",
    "label": "Dropdown Menu",
    "icon": "menu-2",
    "tokens": [
      {
        "id": "nc-dropdown-bg",
        "label": "Background",
        "type": "color",
        "default": "var(--fnd-color-surface-elevated)"
      },
      {
        "id": "nc-dropdown-border",
        "label": "Border Color",
        "type": "color",
        "default": "var(--fnd-color-border-secondary)"
      },
      {
        "id": "nc-dropdown-border-width",
        "label": "Border Width",
        "type": "size",
        "default": "var(--fnd-border-width-xs)"
      },
      {
        "id": "nc-dropdown-radius",
        "label": "Border Radius",
        "type": "size",
        "default": "var(--fnd-radius-sm)"
      },
      {
        "id": "nc-dropdown-shadow",
        "label": "Shadow",
        "type": "shadow",
        "default": "var(--fnd-elevation-floating)"
      },
      {
        "id": "nc-dropdown-padding",
        "label": "Padding",
        "type": "size",
        "default": "var(--fnd-spacing-01)"
      },
      {
        "id": "nc-dropdown-min-width",
        "label": "Min Width",
        "type": "size",
        "default": "180px"
      },
      {
        "id": "nc-dropdown-max-height",
        "label": "Max Height",
        "type": "size",
        "default": "320px"
      },
      {
        "id": "nc-dropdown-z-index",
        "label": "Z-Index",
        "type": "other",
        "default": "var(--fnd-z-dropdown)"
      },
      {
        "id": "nc-dropdown-animation-duration",
        "label": "Animation Duration",
        "type": "other",
        "default": "var(--fnd-motion-duration-150)"
      },
      {
        "id": "nc-dropdown-item-height",
        "label": "Item Height",
        "type": "size",
        "default": "var(--fnd-size-sm)"
      },
      {
        "id": "nc-dropdown-item-padding",
        "label": "Item Padding",
        "type": "size",
        "default": "var(--fnd-spacing-02) var(--fnd-spacing-03)"
      },
      {
        "id": "nc-dropdown-item-radius",
        "label": "Item Radius",
        "type": "size",
        "default": "var(--fnd-radius-sm)"
      },
      {
        "id": "nc-dropdown-item-color",
        "label": "Item Color",
        "type": "color",
        "default": "var(--fnd-color-text-primary)"
      },
      {
        "id": "nc-dropdown-item-bg-hover",
        "label": "Item Hover Background",
        "type": "color",
        "default": "var(--fnd-color-background-hover)"
      },
      {
        "id": "nc-dropdown-item-bg-active",
        "label": "Item Active Background",
        "type": "color",
        "default": "var(--fnd-color-background-active)"
      },
      {
        "id": "nc-dropdown-item-color-disabled",
        "label": "Item Disabled Color",
        "type": "color",
        "default": "var(--fnd-color-text-disabled)"
      },
      {
        "id": "nc-dropdown-item-icon-size",
        "label": "Item Icon Size",
        "type": "size",
        "default": "16px"
      },
      {
        "id": "nc-dropdown-item-icon-color",
        "label": "Item Icon Color",
        "type": "color",
        "default": "var(--fnd-color-text-secondary)"
      },
      {
        "id": "nc-dropdown-item-gap",
        "label": "Item Gap",
        "type": "size",
        "default": "var(--fnd-spacing-02)"
      },
      {
        "id": "nc-dropdown-item-font-size",
        "label": "Item Font Size",
        "type": "size",
        "default": "var(--fs-sm)"
      },
      {
        "id": "nc-dropdown-item-font-weight",
        "label": "Item Font Weight",
        "type": "fontWeight",
        "default": "var(--fnd-font-weight-regular)"
      },
      {
        "id": "nc-dropdown-item-danger-color",
        "label": "Danger Item Color",
        "type": "color",
        "default": "var(--fnd-color-feedback-danger)"
      },
      {
        "id": "nc-dropdown-item-danger-bg-hover",
        "label": "Danger Item Hover Background",
        "type": "color",
        "default": "var(--fnd-color-background-danger)"
      },
      {
        "id": "nc-dropdown-group-label-color",
        "label": "Group Label Color",
        "type": "color",
        "default": "var(--fnd-color-text-tertiary)"
      },
      {
        "id": "nc-dropdown-group-label-size",
        "label": "Group Label Size",
        "type": "size",
        "default": "var(--fs-xs)"
      },
      {
        "id": "nc-dropdown-group-label-weight",
        "label": "Group Label Weight",
        "type": "fontWeight",
        "default": "var(--fnd-font-weight-semibold)"
      },
      {
        "id": "nc-dropdown-group-label-padding",
        "label": "Group Label Padding",
        "type": "size",
        "default": "var(--fnd-spacing-02) var(--fnd-spacing-03)"
      },
      {
        "id": "nc-dropdown-separator-color",
        "label": "Separator Color",
        "type": "color",
        "default": "var(--fnd-color-border-secondary)"
      },
      {
        "id": "nc-dropdown-separator-margin",
        "label": "Separator Margin",
        "type": "size",
        "default": "var(--fnd-spacing-01)"
      }
    ]
  },
  {
    "id": "pagination",
    "label": "Pagination",
    "icon": "dots",
    "tokens": [
      {
        "id": "nc-pagination-gap",
        "label": "Gap",
        "type": "size",
        "default": "var(--fnd-spacing-01)"
      },
      {
        "id": "nc-pagination-padding",
        "label": "Padding",
        "type": "size",
        "default": "var(--fnd-spacing-03) 0"
      },
      {
        "id": "nc-pagination-color",
        "label": "Color",
        "type": "color",
        "default": "var(--fnd-color-text-secondary)"
      },
      {
        "id": "nc-pagination-font-size",
        "label": "Font Size",
        "type": "size",
        "default": "var(--fs-sm)"
      },
      {
        "id": "nc-pagination-item-size",
        "label": "Item Size",
        "type": "size",
        "default": "var(--fnd-size-sm)"
      },
      {
        "id": "nc-pagination-item-radius",
        "label": "Item Radius",
        "type": "size",
        "default": "var(--fnd-radius-sm)"
      },
      {
        "id": "nc-pagination-item-bg",
        "label": "Item Background",
        "type": "color",
        "default": "transparent"
      },
      {
        "id": "nc-pagination-item-bg-hover",
        "label": "Item Hover Background",
        "type": "color",
        "default": "var(--fnd-color-background-hover)"
      },
      {
        "id": "nc-pagination-item-bg-active",
        "label": "Item Active Background",
        "type": "color",
        "default": "var(--fnd-color-interactive-default)"
      },
      {
        "id": "nc-pagination-item-color",
        "label": "Item Color",
        "type": "color",
        "default": "var(--fnd-color-text-primary)"
      },
      {
        "id": "nc-pagination-item-color-active",
        "label": "Item Active Color",
        "type": "color",
        "default": "var(--fnd-color-text-on-interactive)"
      },
      {
        "id": "nc-pagination-item-font-weight",
        "label": "Item Font Weight",
        "type": "fontWeight",
        "default": "var(--fnd-font-weight-medium)"
      },
      {
        "id": "nc-pagination-nav-color",
        "label": "Nav Color",
        "type": "color",
        "default": "var(--fnd-color-interactive-default)"
      },
      {
        "id": "nc-pagination-nav-color-disabled",
        "label": "Nav Disabled Color",
        "type": "color",
        "default": "var(--fnd-color-text-disabled)"
      },
      {
        "id": "nc-pagination-ellipsis-color",
        "label": "Ellipsis Color",
        "type": "color",
        "default": "var(--fnd-color-text-tertiary)"
      },
      {
        "id": "nc-pagination-active-indicator-height",
        "label": "Active Indicator Height",
        "type": "size",
        "default": "2px"
      },
      {
        "id": "nc-pagination-active-indicator-color",
        "label": "Active Indicator Color",
        "type": "color",
        "ref": "interactive-default"
      },
      {
        "id": "nc-pagination-item-shadow-active",
        "label": "Item Shadow Active",
        "type": "color",
        "default": "var(--fnd-elevation-raised)"
      },
      {
        "id": "nc-pagination-touch-min",
        "label": "Touch Min",
        "type": "size",
        "default": "44px"
      },
      {
        "id": "nc-pagination-minimal-info-color",
        "label": "Minimal Info Color",
        "type": "color",
        "ref": "text-secondary"
      },
      {
        "id": "nc-pagination-minimal-info-size",
        "label": "Minimal Info Size",
        "type": "size",
        "default": "var(--fs-sm)"
      },
      {
        "id": "nc-pagination-jumper-width",
        "label": "Jumper Width",
        "type": "size",
        "default": "56px"
      },
      {
        "id": "nc-pagination-jumper-height",
        "label": "Jumper Height",
        "type": "size",
        "default": "var(--fnd-size-sm)"
      },
      {
        "id": "nc-pagination-jumper-radius",
        "label": "Jumper Radius",
        "type": "radius",
        "default": "var(--fnd-radius-sm)"
      },
      {
        "id": "nc-pagination-jumper-border",
        "label": "Jumper Border",
        "type": "color",
        "default": "var(--fnd-border-width-xs) solid var(--fnd-color-border-primary)"
      },
      {
        "id": "nc-pagination-jumper-font-size",
        "label": "Jumper Font Size",
        "type": "size",
        "default": "var(--fs-sm)"
      },
      {
        "id": "nc-pagination-jumper-color",
        "label": "Jumper Color",
        "type": "color",
        "ref": "text-primary"
      },
      {
        "id": "nc-pagination-outline-border",
        "label": "Outline Border",
        "type": "color",
        "default": "var(--fnd-border-width-xs) solid var(--fnd-color-border-secondary)"
      },
      {
        "id": "nc-pagination-outline-border-active",
        "label": "Outline Border Active",
        "type": "color",
        "default": "var(--fnd-border-width-sm) solid var(--fnd-color-interactive-default)"
      }
    ],
    "subgroups": [
      {
        "id": "geometry",
        "label": "Geometrie",
        "tokenIds": [
          "nc-pagination-active-indicator-height",
          "nc-pagination-touch-min",
          "nc-pagination-minimal-info-size",
          "nc-pagination-jumper-width",
          "nc-pagination-jumper-height",
          "nc-pagination-jumper-radius"
        ]
      },
      {
        "id": "typography",
        "label": "Typografie",
        "tokenIds": [
          "nc-pagination-jumper-font-size"
        ]
      },
      {
        "id": "colors",
        "label": "Farben",
        "category": "main",
        "tokenIds": [
          "nc-pagination-active-indicator-color",
          "nc-pagination-item-shadow-active",
          "nc-pagination-minimal-info-color",
          "nc-pagination-jumper-border",
          "nc-pagination-jumper-color",
          "nc-pagination-outline-border",
          "nc-pagination-outline-border-active"
        ]
      }
    ]
  },
  {
    "id": "range",
    "label": "Range-Regler",
    "icon": "adjustments-horizontal",
    "tokens": [
      {
        "id": "nc-range-track-height",
        "label": "Track Height",
        "type": "size",
        "default": "4px"
      },
      {
        "id": "nc-range-track-bg",
        "label": "Track Background",
        "type": "color",
        "default": "var(--fnd-color-border-secondary)"
      },
      {
        "id": "nc-range-track-bg-active",
        "label": "Track Fill Color",
        "type": "color",
        "default": "var(--fnd-color-interactive-default)"
      },
      {
        "id": "nc-range-track-radius",
        "label": "Track Radius",
        "type": "size",
        "default": "var(--fnd-radius-full)"
      },
      {
        "id": "nc-range-thumb-size",
        "label": "Thumb Size",
        "type": "size",
        "default": "20px"
      },
      {
        "id": "nc-range-thumb-bg",
        "label": "Thumb Background",
        "type": "color",
        "default": "var(--fnd-color-background-base)"
      },
      {
        "id": "nc-range-thumb-border",
        "label": "Thumb Border Color",
        "type": "color",
        "default": "var(--fnd-color-interactive-default)"
      },
      {
        "id": "nc-range-thumb-border-width",
        "label": "Thumb Border Width",
        "type": "size",
        "default": "var(--fnd-border-width-sm)"
      },
      {
        "id": "nc-range-thumb-shadow",
        "label": "Thumb Shadow",
        "type": "shadow",
        "default": "var(--fnd-elevation-base)"
      },
      {
        "id": "nc-range-disabled-opacity",
        "label": "Disabled Opacity",
        "type": "opacity",
        "default": "var(--fnd-opacity-disabled)"
      },
      {
        "id": "nc-range-thumb-touch-size",
        "label": "Thumb Touch Size",
        "type": "size",
        "default": "44px"
      },
      {
        "id": "nc-range-thumb-focus-ring-offset",
        "label": "Thumb Focus Ring Offset",
        "type": "size",
        "default": "2px"
      },
      {
        "id": "nc-range-transition-duration",
        "label": "Transition Duration",
        "type": "duration",
        "default": "var(--fnd-motion-duration-200)"
      },
      {
        "id": "nc-range-transition-timing",
        "label": "Transition Timing",
        "type": "generic",
        "default": "cubic-bezier(0.4, 0, 0.2, 1)"
      },
      {
        "id": "nc-range-tooltip-bg",
        "label": "Tooltip BG",
        "type": "color",
        "default": "var(--fnd-color-background-inverted)"
      },
      {
        "id": "nc-range-tooltip-color",
        "label": "Tooltip Color",
        "type": "color",
        "default": "var(--fnd-color-text-on-inverted)"
      },
      {
        "id": "nc-range-tooltip-radius",
        "label": "Tooltip Radius",
        "type": "radius",
        "default": "var(--fnd-radius-sm)"
      },
      {
        "id": "nc-range-tooltip-font-size",
        "label": "Tooltip Font Size",
        "type": "size",
        "default": "var(--fs-xs)"
      },
      {
        "id": "nc-range-tooltip-padding",
        "label": "Tooltip Padding",
        "type": "spacing",
        "default": "var(--fnd-spacing-01) var(--fnd-spacing-02)"
      },
      {
        "id": "nc-range-tooltip-offset-y",
        "label": "Tooltip Offset Y",
        "type": "size",
        "default": "8px"
      },
      {
        "id": "nc-range-range-fill-bg",
        "label": "Range Fill BG",
        "type": "color",
        "default": "var(--nc-slider-track-bg-active)"
      }
    ],
    "subgroups": [
      {
        "id": "geometry",
        "label": "Geometrie",
        "tokenIds": [
          "nc-range-thumb-touch-size",
          "nc-range-thumb-focus-ring-offset",
          "nc-range-tooltip-radius",
          "nc-range-tooltip-padding",
          "nc-range-tooltip-offset-y"
        ]
      },
      {
        "id": "typography",
        "label": "Typografie",
        "tokenIds": [
          "nc-range-tooltip-font-size"
        ]
      },
      {
        "id": "colors",
        "label": "Farben",
        "category": "main",
        "tokenIds": [
          "nc-range-tooltip-bg",
          "nc-range-tooltip-color",
          "nc-range-range-fill-bg"
        ]
      },
      {
        "id": "interaction",
        "label": "Bewegung & Zustand",
        "category": "state",
        "tokenIds": [
          "nc-range-transition-duration",
          "nc-range-transition-timing"
        ]
      }
    ]
  },
  {
    "id": "badge",
    "label": "Badge",
    "icon": "badge",
    "tokens": [
      {
        "id": "nc-badge-height-sm",
        "label": "Height SM",
        "type": "size",
        "default": "20px"
      },
      {
        "id": "nc-badge-height-md",
        "label": "Height MD",
        "type": "size",
        "default": "24px"
      },
      {
        "id": "nc-badge-radius",
        "label": "Radius",
        "type": "size",
        "default": "9999px"
      },
      {
        "id": "nc-badge-padding-x-sm",
        "label": "Padding X SM",
        "type": "size",
        "default": "6px"
      },
      {
        "id": "nc-badge-padding-x-md",
        "label": "Padding X MD",
        "type": "size",
        "default": "8px"
      },
      {
        "id": "nc-badge-padding-y",
        "label": "Padding Y",
        "type": "size",
        "default": "2px"
      },
      {
        "id": "nc-badge-gap",
        "label": "Gap",
        "type": "size",
        "default": "4px"
      },
      {
        "id": "nc-badge-font-size-sm",
        "label": "Font Size SM",
        "type": "size",
        "default": "11px"
      },
      {
        "id": "nc-badge-font-size-md",
        "label": "Font Size MD",
        "type": "size",
        "default": "12px"
      },
      {
        "id": "nc-badge-font-weight",
        "label": "Font Weight",
        "type": "size",
        "default": "600"
      },
      {
        "id": "nc-badge-letter-spacing",
        "label": "Letter Spacing",
        "type": "size",
        "default": "0.01em"
      },
      {
        "id": "nc-badge-line-height",
        "label": "Line Height",
        "type": "size",
        "default": "1"
      },
      {
        "id": "nc-badge-border-width",
        "label": "Border Width",
        "type": "size",
        "default": "0"
      },
      {
        "id": "nc-badge-border-color",
        "label": "Border Color",
        "type": "color",
        "default": "transparent"
      },
      {
        "id": "nc-badge-label-max-width",
        "label": "Label Max Width",
        "type": "size",
        "default": "20ch"
      },
      {
        "id": "nc-badge-default-bg",
        "label": "Default BG",
        "type": "color",
        "ref": "background-secondary"
      },
      {
        "id": "nc-badge-default-color",
        "label": "Default Text",
        "type": "color",
        "ref": "text-primary"
      },
      {
        "id": "nc-badge-secondary-bg",
        "label": "Secondary BG",
        "type": "color",
        "ref": "background-tertiary"
      },
      {
        "id": "nc-badge-secondary-color",
        "label": "Secondary Text",
        "type": "color",
        "ref": "text-secondary"
      },
      {
        "id": "nc-badge-success-bg",
        "label": "Success BG",
        "type": "color",
        "ref": "background-success"
      },
      {
        "id": "nc-badge-success-color",
        "label": "Success Text",
        "type": "color",
        "ref": "text-success"
      },
      {
        "id": "nc-badge-error-bg",
        "label": "Error BG",
        "type": "color",
        "ref": "background-danger"
      },
      {
        "id": "nc-badge-error-color",
        "label": "Error Text",
        "type": "color",
        "ref": "text-danger"
      },
      {
        "id": "nc-badge-info-bg",
        "label": "Info BG",
        "type": "color",
        "default": "rgba(69, 137, 255, 0.15)"
      },
      {
        "id": "nc-badge-info-color",
        "label": "Info Text",
        "type": "color",
        "ref": "text-info"
      },
      {
        "id": "nc-badge-warning-bg",
        "label": "Warning BG",
        "type": "color",
        "default": "rgba(212, 164, 0, 0.15)"
      },
      {
        "id": "nc-badge-warning-color",
        "label": "Warning Text",
        "type": "color",
        "ref": "text-warning"
      },
      {
        "id": "nc-badge-default-border",
        "label": "Default Border",
        "type": "color",
        "default": "transparent"
      },
      {
        "id": "nc-badge-secondary-border",
        "label": "Secondary Border",
        "type": "color",
        "default": "transparent"
      },
      {
        "id": "nc-badge-success-border",
        "label": "Success Border",
        "type": "color",
        "default": "transparent"
      },
      {
        "id": "nc-badge-warning-border",
        "label": "Warning Border",
        "type": "color",
        "default": "transparent"
      },
      {
        "id": "nc-badge-error-border",
        "label": "Error Border",
        "type": "color",
        "default": "transparent"
      },
      {
        "id": "nc-badge-info-border",
        "label": "Info Border",
        "type": "color",
        "default": "transparent"
      },
      {
        "id": "nc-badge-outline-bg",
        "label": "Outline BG",
        "type": "color",
        "default": "transparent"
      },
      {
        "id": "nc-badge-outline-color",
        "label": "Outline Text",
        "type": "color",
        "ref": "text-primary"
      },
      {
        "id": "nc-badge-outline-border",
        "label": "Outline Border",
        "type": "color",
        "ref": "border-primary"
      },
      {
        "id": "nc-badge-dot-size",
        "label": "Dot Size",
        "type": "size",
        "default": "6px"
      },
      {
        "id": "nc-badge-dot-radius",
        "label": "Dot Radius",
        "type": "size",
        "default": "50%"
      },
      {
        "id": "nc-badge-icon-size",
        "label": "Icon Size",
        "type": "size",
        "default": "14px"
      },
      {
        "id": "nc-badge-top-offset",
        "label": "Top Offset",
        "type": "size",
        "default": "-4px"
      },
      {
        "id": "nc-badge-right-offset",
        "label": "Right Offset",
        "type": "size",
        "default": "-4px"
      },
      {
        "id": "nc-badge-ring-width",
        "label": "Ring Width",
        "type": "size",
        "default": "2px"
      },
      {
        "id": "nc-badge-ring-color",
        "label": "Ring Color",
        "type": "color",
        "ref": "background-base"
      },
      {
        "id": "nc-badge-pulse-duration",
        "label": "Pulse Duration",
        "type": "duration",
        "default": "1.5s"
      },
      {
        "id": "nc-badge-pulse-scale",
        "label": "Pulse Scale",
        "type": "generic",
        "default": "1.8"
      },
      {
        "id": "nc-badge-pulse-opacity",
        "label": "Pulse Opacity",
        "type": "opacity",
        "default": "0"
      },
      {
        "id": "nc-badge-status-font-weight",
        "label": "Status Font Weight",
        "type": "fontWeight",
        "default": "var(--fnd-font-weight-semibold)"
      },
      {
        "id": "nc-badge-soft-opacity",
        "label": "Soft Opacity",
        "type": "opacity",
        "default": "40%"
      }
    ],
    "subgroups": [
      {
        "id": "core-geometry",
        "label": "Geometry",
        "category": "core",
        "tokenIds": [
          "nc-badge-height-sm",
          "nc-badge-height-md",
          "nc-badge-radius",
          "nc-badge-padding-x-sm",
          "nc-badge-padding-x-md",
          "nc-badge-padding-y",
          "nc-badge-gap"
        ]
      },
      {
        "id": "core-typography",
        "label": "Typography",
        "category": "core",
        "tokenIds": [
          "nc-badge-font-size-sm",
          "nc-badge-font-size-md",
          "nc-badge-font-weight",
          "nc-badge-letter-spacing",
          "nc-badge-line-height",
          "nc-badge-label-max-width"
        ]
      },
      {
        "id": "core-extras",
        "label": "Extras",
        "category": "core",
        "tokenIds": [
          "nc-badge-dot-size",
          "nc-badge-dot-radius",
          "nc-badge-icon-size"
        ]
      },
      {
        "id": "tone-default",
        "label": "Default",
        "category": "tone",
        "tokenIds": [
          "nc-badge-default-bg",
          "nc-badge-default-color",
          "nc-badge-default-border"
        ]
      },
      {
        "id": "tone-secondary",
        "label": "Secondary",
        "category": "tone",
        "tokenIds": [
          "nc-badge-secondary-bg",
          "nc-badge-secondary-color",
          "nc-badge-secondary-border"
        ]
      },
      {
        "id": "tone-success",
        "label": "Success",
        "category": "tone",
        "tokenIds": [
          "nc-badge-success-bg",
          "nc-badge-success-color",
          "nc-badge-success-border"
        ]
      },
      {
        "id": "tone-error",
        "label": "Error",
        "category": "tone",
        "tokenIds": [
          "nc-badge-error-bg",
          "nc-badge-error-color",
          "nc-badge-error-border"
        ]
      },
      {
        "id": "tone-info",
        "label": "Info",
        "category": "tone",
        "tokenIds": [
          "nc-badge-info-bg",
          "nc-badge-info-color",
          "nc-badge-info-border"
        ]
      },
      {
        "id": "tone-warning",
        "label": "Warning",
        "category": "tone",
        "tokenIds": [
          "nc-badge-warning-bg",
          "nc-badge-warning-color",
          "nc-badge-warning-border"
        ]
      },
      {
        "id": "emphasis-outline",
        "label": "Outline",
        "category": "emphasis",
        "tokenIds": [
          "nc-badge-outline-bg",
          "nc-badge-outline-color",
          "nc-badge-outline-border",
          "nc-badge-border-width"
        ]
      },
      {
        "id": "emphasis-soft",
        "label": "Soft",
        "category": "emphasis",
        "tokenIds": []
      },
      {
        "id": "geometry",
        "label": "Geometrie",
        "tokenIds": [
          "nc-badge-top-offset",
          "nc-badge-right-offset",
          "nc-badge-ring-width"
        ]
      },
      {
        "id": "typography",
        "label": "Typografie",
        "tokenIds": [
          "nc-badge-status-font-weight"
        ]
      },
      {
        "id": "colors",
        "label": "Farben",
        "category": "main",
        "tokenIds": [
          "nc-badge-ring-color"
        ]
      },
      {
        "id": "interaction",
        "label": "Bewegung & Zustand",
        "category": "state",
        "tokenIds": [
          "nc-badge-pulse-duration",
          "nc-badge-pulse-scale",
          "nc-badge-pulse-opacity",
          "nc-badge-soft-opacity"
        ]
      }
    ]
  },
  {
    "id": "status",
    "label": "Status",
    "icon": "point",
    "tokens": [
      {
        "id": "nc-status-size-xs",
        "label": "Size XS",
        "type": "size",
        "default": "6px"
      },
      {
        "id": "nc-status-size-sm",
        "label": "Size SM",
        "type": "size",
        "default": "8px"
      },
      {
        "id": "nc-status-size-md",
        "label": "Size MD",
        "type": "size",
        "default": "12px"
      },
      {
        "id": "nc-status-ring-width",
        "label": "Ring Width",
        "type": "size",
        "default": "2px"
      },
      {
        "id": "nc-status-ring-color",
        "label": "Ring Color",
        "type": "color",
        "ref": "background-base"
      },
      {
        "id": "nc-status-online",
        "label": "Online",
        "type": "color",
        "ref": "feedback-success"
      },
      {
        "id": "nc-status-offline",
        "label": "Offline",
        "type": "color",
        "ref": "text-disabled"
      },
      {
        "id": "nc-status-busy",
        "label": "Busy",
        "type": "color",
        "ref": "feedback-danger"
      },
      {
        "id": "nc-status-away",
        "label": "Away",
        "type": "color",
        "ref": "feedback-warning"
      },
      {
        "id": "nc-status-neutral",
        "label": "Neutral",
        "type": "color",
        "ref": "text-tertiary"
      },
      {
        "id": "nc-status-pulse-duration",
        "label": "Pulse Duration",
        "type": "size",
        "default": "1000ms"
      }
    ],
    "subgroups": []
  },
  {
    "id": "card",
    "label": "Card",
    "icon": "id",
    "subgroups": [
      {
        "id": "basis",
        "label": "Basis",
        "tokenIds": [
          "nc-card-bg",
          "nc-card-color",
          "nc-card-border",
          "nc-card-radius",
          "nc-card-padding",
          "nc-card-shadow",
          "nc-card-shadow-hover",
          "nc-card-border-width",
          "nc-card-disabled-opacity"
        ]
      },
      {
        "id": "spacing",
        "label": "Abstände",
        "tokenIds": [
          "nc-card-header-padding",
          "nc-card-header-gap",
          "nc-card-content-padding",
          "nc-card-footer-padding",
          "nc-card-footer-gap"
        ]
      },
      {
        "id": "typography",
        "label": "Typografie",
        "tokenIds": [
          "nc-card-title-font-size",
          "nc-card-title-font-weight",
          "nc-card-title-color",
          "nc-card-title-line-height",
          "nc-card-description-font-size",
          "nc-card-description-color",
          "nc-card-description-line-height",
          "nc-card-label-weight",
          "nc-card-label-tracking",
          "nc-card-label-transform",
          "nc-card-link-decoration",
          "nc-card-link-hover-decoration"
        ]
      },
      {
        "id": "interactive",
        "label": "Interaktiv",
        "tokenIds": [
          "nc-card-transition-duration",
          "nc-card-hover-border",
          "nc-card-nav-color-hover"
        ]
      },
      {
        "id": "selectable",
        "label": "Auswählbar",
        "tokenIds": [
          "nc-card-selected-border",
          "nc-card-selected-bg",
          "nc-card-selected-ring-width"
        ]
      },
      {
        "id": "expandable",
        "label": "Aufklappbar",
        "tokenIds": [
          "nc-card-summary-font-weight",
          "nc-card-summary-padding",
          "nc-card-details-content-padding",
          "nc-card-expand-icon-size"
        ]
      },
      {
        "id": "status",
        "label": "Status",
        "tokenIds": [
          "nc-card-status-border-width",
          "nc-card-status-success-border",
          "nc-card-status-warning-border",
          "nc-card-status-danger-border",
          "nc-card-status-info-border"
        ]
      },
      {
        "id": "preview",
        "label": "Preview",
        "tokenIds": [
          "nc-card-preview-media-ratio",
          "nc-card-preview-title-size"
        ]
      },
      {
        "id": "summary",
        "label": "Summary",
        "tokenIds": [
          "nc-card-summary-avatar-size",
          "nc-card-summary-avatar-radius"
        ]
      },
      {
        "id": "action",
        "label": "Aktion",
        "tokenIds": [
          "nc-card-action-icon-size"
        ]
      },
      {
        "id": "geometry",
        "label": "Geometrie",
        "tokenIds": [
          "nc-card-label-size",
          "nc-card-summary-icon-size"
        ]
      },
      {
        "id": "colors",
        "label": "Farben",
        "category": "main",
        "tokenIds": [
          "nc-card-label-color",
          "nc-card-hover-surface",
          "nc-card-hover-glow",
          "nc-card-summary-icon-color"
        ]
      },
      {
        "id": "interaction",
        "label": "Bewegung & Zustand",
        "category": "state",
        "tokenIds": [
          "nc-card-hover-glow-opacity",
          "nc-card-hover-duration",
          "nc-card-hover-glow-duration",
          "nc-card-hover-ease"
        ]
      },
      {
        "id": "other",
        "label": "Weitere",
        "tokenIds": [
          "nc-card-label-family",
          "nc-card-hover-lift",
          "nc-card-summary-icon-spacing"
        ]
      }
    ],
    "tokens": [
      {
        "id": "nc-card-bg",
        "label": "Background",
        "type": "color",
        "group": "basis",
        "ref": "background-base"
      },
      {
        "id": "nc-card-color",
        "label": "Text Color",
        "type": "color",
        "group": "basis",
        "ref": "text-primary"
      },
      {
        "id": "nc-card-border",
        "label": "Border Color",
        "type": "color",
        "group": "basis",
        "ref": "border-secondary"
      },
      {
        "id": "nc-card-radius",
        "label": "Radius",
        "type": "size",
        "group": "basis",
        "default": "16px"
      },
      {
        "id": "nc-card-padding",
        "label": "Padding",
        "type": "spacing",
        "group": "basis",
        "ref": "spacing-06"
      },
      {
        "id": "nc-card-shadow",
        "label": "Shadow",
        "type": "shadow",
        "group": "basis",
        "default": "xs"
      },
      {
        "id": "nc-card-shadow-hover",
        "label": "Shadow (Hover)",
        "type": "shadow",
        "group": "basis",
        "ref": "elevation-raised"
      },
      {
        "id": "nc-card-border-width",
        "label": "Border Width",
        "type": "size",
        "group": "basis",
        "ref": "border-width-xs"
      },
      {
        "id": "nc-card-disabled-opacity",
        "label": "Disabled Opacity",
        "type": "opacity",
        "group": "basis",
        "ref": "opacity-disabled"
      },
      {
        "id": "nc-card-header-padding",
        "label": "Header Padding",
        "type": "spacing",
        "group": "spacing",
        "ref": "spacing-06"
      },
      {
        "id": "nc-card-header-gap",
        "label": "Header Gap",
        "type": "spacing",
        "group": "spacing",
        "ref": "spacing-02"
      },
      {
        "id": "nc-card-content-padding",
        "label": "Content Padding",
        "type": "spacing",
        "group": "spacing",
        "ref": "spacing-06"
      },
      {
        "id": "nc-card-footer-padding",
        "label": "Footer Padding",
        "type": "spacing",
        "group": "spacing",
        "ref": "spacing-06"
      },
      {
        "id": "nc-card-footer-gap",
        "label": "Footer Gap",
        "type": "spacing",
        "group": "spacing",
        "ref": "spacing-03"
      },
      {
        "id": "nc-card-title-font-size",
        "label": "Title Font Size",
        "type": "size",
        "group": "typography",
        "ref": "heading-m-font-size"
      },
      {
        "id": "nc-card-title-font-weight",
        "label": "Title Font Weight",
        "type": "fontWeight",
        "group": "typography",
        "ref": "font-weight-semibold"
      },
      {
        "id": "nc-card-title-color",
        "label": "Title Color",
        "type": "color",
        "group": "typography",
        "ref": "text-primary"
      },
      {
        "id": "nc-card-title-line-height",
        "label": "Title Line Height",
        "type": "number",
        "group": "typography",
        "default": "1.3"
      },
      {
        "id": "nc-card-description-font-size",
        "label": "Description Font Size",
        "type": "size",
        "group": "typography",
        "ref": "body-m-font-size"
      },
      {
        "id": "nc-card-description-color",
        "label": "Description Color",
        "type": "color",
        "group": "typography",
        "ref": "text-secondary"
      },
      {
        "id": "nc-card-description-line-height",
        "label": "Description Line Height",
        "type": "number",
        "group": "typography",
        "default": "1.5"
      },
      {
        "id": "nc-card-transition-duration",
        "label": "Transition Duration",
        "type": "duration",
        "group": "interactive",
        "ref": "motion-duration-200"
      },
      {
        "id": "nc-card-hover-border",
        "label": "Hover Border Color",
        "type": "color",
        "group": "interactive",
        "ref": "border-strong"
      },
      {
        "id": "nc-card-nav-color-hover",
        "label": "Nav Link Hover Color",
        "type": "color",
        "group": "interactive",
        "ref": "interactive-hover"
      },
      {
        "id": "nc-card-selected-border",
        "label": "Selected Border",
        "type": "color",
        "group": "selectable",
        "ref": "interactive-default"
      },
      {
        "id": "nc-card-selected-bg",
        "label": "Selected Background",
        "type": "color",
        "group": "selectable",
        "ref": "background-accent-secondary"
      },
      {
        "id": "nc-card-selected-ring-width",
        "label": "Selected Ring Width",
        "type": "size",
        "group": "selectable",
        "default": "2px"
      },
      {
        "id": "nc-card-summary-font-weight",
        "label": "Summary Font Weight",
        "type": "fontWeight",
        "group": "expandable",
        "ref": "font-weight-semibold"
      },
      {
        "id": "nc-card-summary-padding",
        "label": "Summary Padding",
        "type": "spacing",
        "group": "expandable",
        "ref": "spacing-06"
      },
      {
        "id": "nc-card-details-content-padding",
        "label": "Details Content Padding",
        "type": "spacing",
        "group": "expandable",
        "ref": "spacing-06"
      },
      {
        "id": "nc-card-expand-icon-size",
        "label": "Expand Icon Size",
        "type": "size",
        "group": "expandable",
        "default": "20px"
      },
      {
        "id": "nc-card-status-border-width",
        "label": "Status Border Width",
        "type": "size",
        "group": "status",
        "ref": "border-width-sm"
      },
      {
        "id": "nc-card-status-success-border",
        "label": "Status Success",
        "type": "color",
        "group": "status",
        "ref": "feedback-success"
      },
      {
        "id": "nc-card-status-warning-border",
        "label": "Status Warning",
        "type": "color",
        "group": "status",
        "ref": "feedback-warning"
      },
      {
        "id": "nc-card-status-danger-border",
        "label": "Status Danger",
        "type": "color",
        "group": "status",
        "ref": "feedback-danger"
      },
      {
        "id": "nc-card-status-info-border",
        "label": "Status Info",
        "type": "color",
        "group": "status",
        "ref": "feedback-info"
      },
      {
        "id": "nc-card-preview-media-ratio",
        "label": "Preview Media Ratio",
        "type": "ratio",
        "group": "preview",
        "ref": "media-ratio-3-2"
      },
      {
        "id": "nc-card-preview-title-size",
        "label": "Preview Title Size",
        "type": "size",
        "group": "preview",
        "ref": "heading-xs-font-size"
      },
      {
        "id": "nc-card-summary-avatar-size",
        "label": "Summary Avatar Size",
        "type": "size",
        "group": "summary",
        "default": "96px"
      },
      {
        "id": "nc-card-summary-avatar-radius",
        "label": "Summary Avatar Radius",
        "type": "size",
        "group": "summary",
        "ref": "radius-full"
      },
      {
        "id": "nc-card-action-icon-size",
        "label": "Action Icon Size",
        "type": "size",
        "group": "action",
        "default": "48px"
      },
      {
        "id": "nc-card-label-family",
        "label": "Label Family",
        "type": "generic",
        "default": "var(--font-mono)"
      },
      {
        "id": "nc-card-label-size",
        "label": "Label Size",
        "type": "size",
        "default": "var(--nc-mono-label-size)"
      },
      {
        "id": "nc-card-label-weight",
        "label": "Label Weight",
        "type": "fontWeight",
        "default": "var(--nc-mono-label-weight)"
      },
      {
        "id": "nc-card-label-tracking",
        "label": "Label Tracking",
        "type": "size",
        "default": "var(--nc-mono-tracking-code)"
      },
      {
        "id": "nc-card-label-transform",
        "label": "Label Transform",
        "type": "size",
        "default": "none"
      },
      {
        "id": "nc-card-label-color",
        "label": "Label Color",
        "type": "color",
        "ref": "text-secondary"
      },
      {
        "id": "nc-card-hover-surface",
        "label": "Hover Surface",
        "type": "color",
        "ref": "background-hover"
      },
      {
        "id": "nc-card-hover-lift",
        "label": "Hover Lift",
        "type": "size",
        "default": "-6px"
      },
      {
        "id": "nc-card-hover-glow",
        "label": "Hover Glow",
        "type": "color",
        "ref": "interactive-default"
      },
      {
        "id": "nc-card-hover-glow-opacity",
        "label": "Hover Glow Opacity",
        "type": "color",
        "default": ".55"
      },
      {
        "id": "nc-card-hover-duration",
        "label": "Hover Duration",
        "type": "duration",
        "default": "var(--fnd-motion-duration-300)"
      },
      {
        "id": "nc-card-hover-glow-duration",
        "label": "Hover Glow Duration",
        "type": "color",
        "default": "var(--fnd-motion-duration-450)"
      },
      {
        "id": "nc-card-hover-ease",
        "label": "Hover Ease",
        "type": "generic",
        "default": "var(--fnd-motion-ease-informative)"
      },
      {
        "id": "nc-card-link-decoration",
        "label": "Link Decoration",
        "type": "size",
        "default": "none"
      },
      {
        "id": "nc-card-link-hover-decoration",
        "label": "Link Hover Decoration",
        "type": "size",
        "default": "none"
      },
      {
        "id": "nc-card-summary-icon-size",
        "label": "Summary Icon Size",
        "type": "size",
        "default": "60px"
      },
      {
        "id": "nc-card-summary-icon-color",
        "label": "Summary Icon Color",
        "type": "color",
        "default": "var(--fnd-neutral-800)"
      },
      {
        "id": "nc-card-summary-icon-spacing",
        "label": "Summary Icon Spacing",
        "type": "spacing",
        "default": "var(--fnd-spacing-03)"
      }
    ]
  },
  {
    "id": "dialog",
    "label": "Dialog",
    "icon": "layout-bottombar",
    "tokens": [
      {
        "id": "nc-dialog-max-width",
        "label": "Max Width",
        "type": "size",
        "default": "560px"
      },
      {
        "id": "nc-dialog-padding",
        "label": "Padding",
        "type": "size",
        "default": "var(--fnd-spacing-08)"
      },
      {
        "id": "nc-dialog-radius",
        "label": "Radius",
        "type": "size",
        "default": "var(--fnd-radius-4xl)"
      },
      {
        "id": "nc-dialog-bg",
        "label": "Background",
        "type": "color",
        "default": "var(--fnd-color-surface-elevated)"
      },
      {
        "id": "nc-dialog-shadow",
        "label": "Shadow",
        "type": "shadow",
        "default": "var(--fnd-elevation-modal)"
      },
      {
        "id": "nc-dialog-overlay-bg",
        "label": "Overlay Background",
        "type": "color",
        "default": "var(--fnd-color-background-overlay)"
      },
      {
        "id": "nc-dialog-title-font-size",
        "label": "Title Font Size",
        "type": "size",
        "default": "var(--fnd-typography-heading-m-font-size)"
      },
      {
        "id": "nc-dialog-title-font-weight",
        "label": "Title Font Weight",
        "type": "keyword",
        "default": "var(--fnd-font-weight-semibold)"
      },
      {
        "id": "nc-dialog-title-color",
        "label": "Title Color",
        "type": "color",
        "default": "var(--fnd-color-text-primary)"
      },
      {
        "id": "nc-dialog-description-font-size",
        "label": "Description Font Size",
        "type": "size",
        "default": "var(--fnd-typography-body-m-font-size)"
      },
      {
        "id": "nc-dialog-description-color",
        "label": "Description Color",
        "type": "color",
        "default": "var(--fnd-color-text-secondary)"
      },
      {
        "id": "nc-dialog-footer-gap",
        "label": "Footer Gap",
        "type": "size",
        "default": "var(--fnd-spacing-03)"
      },
      {
        "id": "nc-dialog-header-gap",
        "label": "Header Gap",
        "type": "size",
        "default": "var(--fnd-spacing-02)"
      },
      {
        "id": "nc-dialog-section-gap",
        "label": "Section Gap",
        "type": "size",
        "default": "var(--fnd-spacing-06)"
      },
      {
        "id": "nc-dialog-max-height",
        "label": "Max Height",
        "type": "spacing",
        "default": "calc(100vh - var(--fnd-spacing-08))"
      },
      {
        "id": "nc-dialog-header-border-color",
        "label": "Header Border Color",
        "type": "color",
        "ref": "border-secondary"
      },
      {
        "id": "nc-dialog-footer-border-color",
        "label": "Footer Border Color",
        "type": "color",
        "ref": "border-secondary"
      },
      {
        "id": "nc-dialog-close-size",
        "label": "Close Size",
        "type": "size",
        "default": "36px"
      },
      {
        "id": "nc-dialog-close-radius",
        "label": "Close Radius",
        "type": "radius",
        "default": "var(--fnd-radius-sm)"
      },
      {
        "id": "nc-dialog-close-bg",
        "label": "Close BG",
        "type": "color",
        "ref": "background-secondary"
      },
      {
        "id": "nc-dialog-close-bg-hover",
        "label": "Close BG Hover",
        "type": "color",
        "ref": "background-tertiary"
      },
      {
        "id": "nc-dialog-close-icon-size",
        "label": "Close Icon Size",
        "type": "size",
        "default": "18px"
      },
      {
        "id": "nc-dialog-danger-icon-color",
        "label": "Danger Icon Color",
        "type": "color",
        "ref": "feedback-danger"
      },
      {
        "id": "nc-dialog-danger-action-bg",
        "label": "Danger Action BG",
        "type": "color",
        "ref": "feedback-danger"
      },
      {
        "id": "nc-dialog-danger-action-color",
        "label": "Danger Action Color",
        "type": "color",
        "ref": "on-danger"
      },
      {
        "id": "nc-dialog-mobile-radius",
        "label": "Mobile Radius",
        "type": "radius",
        "default": "var(--fnd-radius-xl) var(--fnd-radius-xl) 0 0"
      },
      {
        "id": "nc-dialog-mobile-max-height",
        "label": "Mobile Max Height",
        "type": "size",
        "default": "90vh"
      },
      {
        "id": "nc-dialog-icon-size",
        "label": "Icon Size",
        "type": "size",
        "default": "24px"
      }
    ],
    "subgroups": [
      {
        "id": "geometry",
        "label": "Geometrie",
        "tokenIds": [
          "nc-dialog-max-height",
          "nc-dialog-close-size",
          "nc-dialog-close-radius",
          "nc-dialog-close-icon-size",
          "nc-dialog-mobile-radius",
          "nc-dialog-mobile-max-height",
          "nc-dialog-icon-size"
        ]
      },
      {
        "id": "colors",
        "label": "Farben",
        "category": "main",
        "tokenIds": [
          "nc-dialog-header-border-color",
          "nc-dialog-footer-border-color",
          "nc-dialog-close-bg",
          "nc-dialog-close-bg-hover",
          "nc-dialog-danger-icon-color",
          "nc-dialog-danger-action-bg",
          "nc-dialog-danger-action-color"
        ]
      }
    ]
  },
  {
    "id": "checkbox",
    "label": "Checkbox",
    "icon": "checkbox",
    "tokens": [
      {
        "id": "nc-checkbox-size-sm",
        "label": "Size SM",
        "type": "size",
        "default": "16px"
      },
      {
        "id": "nc-checkbox-size-md",
        "label": "Size MD",
        "type": "size",
        "default": "20px"
      },
      {
        "id": "nc-checkbox-size-lg",
        "label": "Size LG",
        "type": "size",
        "default": "24px"
      },
      {
        "id": "nc-checkbox-radius",
        "label": "Radius",
        "type": "border-radius",
        "ref": "radius-sm"
      },
      {
        "id": "nc-checkbox-border-width",
        "label": "Border Width",
        "type": "size",
        "ref": "border-width-sm"
      },
      {
        "id": "nc-checkbox-bg",
        "label": "Background",
        "type": "color",
        "ref": "background-base"
      },
      {
        "id": "nc-checkbox-border",
        "label": "Border",
        "type": "color",
        "ref": "border-strong"
      },
      {
        "id": "nc-checkbox-border-hover",
        "label": "Border Hover",
        "type": "color",
        "ref": "interactive-hover"
      },
      {
        "id": "nc-checkbox-bg-checked",
        "label": "BG Checked",
        "type": "color",
        "ref": "interactive-default"
      },
      {
        "id": "nc-checkbox-border-checked",
        "label": "Border Checked",
        "type": "color",
        "ref": "interactive-default"
      },
      {
        "id": "nc-checkbox-bg-indeterminate",
        "label": "BG Indeterminate",
        "type": "color",
        "ref": "interactive-default"
      },
      {
        "id": "nc-checkbox-disabled-bg",
        "label": "Disabled BG",
        "type": "color",
        "ref": "background-disabled"
      },
      {
        "id": "nc-checkbox-disabled-border",
        "label": "Disabled Border",
        "type": "color",
        "ref": "border-secondary"
      },
      {
        "id": "nc-checkbox-disabled-opacity",
        "label": "Disabled Opacity",
        "type": "opacity",
        "ref": "opacity-disabled"
      },
      {
        "id": "nc-checkbox-label-gap",
        "label": "Label Gap",
        "type": "spacing",
        "ref": "spacing-03"
      },
      {
        "id": "nc-checkbox-label-color",
        "label": "Label Color",
        "type": "color",
        "ref": "text-primary"
      },
      {
        "id": "nc-checkbox-border-error",
        "label": "Border Error",
        "type": "color",
        "ref": "border-danger"
      },
      {
        "id": "nc-checkbox-transition-duration",
        "label": "Transition",
        "type": "duration",
        "ref": "motion-duration-150"
      },
      {
        "id": "nc-checkbox-focus-ring-offset",
        "label": "Focus Ring Offset",
        "type": "size",
        "default": "2px"
      },
      {
        "id": "nc-checkbox-card-bg",
        "label": "Card BG",
        "type": "color",
        "ref": "background-base"
      },
      {
        "id": "nc-checkbox-card-bg-checked",
        "label": "Card BG Checked",
        "type": "color",
        "default": "var(--fnd-color-interactive-subtle)"
      },
      {
        "id": "nc-checkbox-card-border",
        "label": "Card Border",
        "type": "color",
        "ref": "border-primary"
      },
      {
        "id": "nc-checkbox-card-border-checked",
        "label": "Card Border Checked",
        "type": "color",
        "ref": "interactive-default"
      },
      {
        "id": "nc-checkbox-card-border-hover",
        "label": "Card Border Hover",
        "type": "color",
        "ref": "border-strong"
      },
      {
        "id": "nc-checkbox-card-radius",
        "label": "Card Radius",
        "type": "radius",
        "default": "var(--fnd-radius-md)"
      },
      {
        "id": "nc-checkbox-card-padding",
        "label": "Card Padding",
        "type": "spacing",
        "default": "var(--fnd-spacing-04)"
      }
    ],
    "subgroups": [
      {
        "id": "geometry",
        "label": "Geometry",
        "tokenIds": [
          "nc-checkbox-size-sm",
          "nc-checkbox-size-md",
          "nc-checkbox-size-lg",
          "nc-checkbox-radius",
          "nc-checkbox-border-width",
          "nc-checkbox-card-radius",
          "nc-checkbox-card-padding"
        ]
      },
      {
        "id": "colors",
        "label": "Colors",
        "tokenIds": [
          "nc-checkbox-bg",
          "nc-checkbox-border",
          "nc-checkbox-border-hover",
          "nc-checkbox-card-bg",
          "nc-checkbox-card-bg-checked",
          "nc-checkbox-card-border",
          "nc-checkbox-card-border-checked",
          "nc-checkbox-card-border-hover"
        ]
      },
      {
        "id": "checked",
        "label": "Checked",
        "tokenIds": [
          "nc-checkbox-bg-checked",
          "nc-checkbox-border-checked",
          "nc-checkbox-bg-indeterminate"
        ]
      },
      {
        "id": "disabled",
        "label": "Disabled",
        "tokenIds": [
          "nc-checkbox-disabled-bg",
          "nc-checkbox-disabled-border",
          "nc-checkbox-disabled-opacity"
        ]
      },
      {
        "id": "label",
        "label": "Label",
        "tokenIds": [
          "nc-checkbox-label-gap",
          "nc-checkbox-label-color"
        ]
      },
      {
        "id": "error",
        "label": "Error",
        "tokenIds": [
          "nc-checkbox-border-error"
        ]
      },
      {
        "id": "interaction",
        "label": "Interaction",
        "tokenIds": [
          "nc-checkbox-transition-duration",
          "nc-checkbox-focus-ring-offset"
        ]
      }
    ]
  },
  {
    "id": "radio",
    "label": "Radio",
    "icon": "circle-dot",
    "tokens": [
      {
        "id": "nc-radio-size-sm",
        "label": "Size SM",
        "type": "size",
        "default": "16px"
      },
      {
        "id": "nc-radio-size-md",
        "label": "Size MD",
        "type": "size",
        "default": "20px"
      },
      {
        "id": "nc-radio-size-lg",
        "label": "Size LG",
        "type": "size",
        "default": "24px"
      },
      {
        "id": "nc-radio-border-width",
        "label": "Border Width",
        "type": "size",
        "ref": "border-width-sm"
      },
      {
        "id": "nc-radio-bg",
        "label": "Background",
        "type": "color",
        "ref": "background-base"
      },
      {
        "id": "nc-radio-border",
        "label": "Border",
        "type": "color",
        "ref": "border-strong"
      },
      {
        "id": "nc-radio-border-hover",
        "label": "Border Hover",
        "type": "color",
        "ref": "interactive-hover"
      },
      {
        "id": "nc-radio-bg-checked",
        "label": "BG Checked",
        "type": "color",
        "ref": "interactive-default"
      },
      {
        "id": "nc-radio-border-checked",
        "label": "Border Checked",
        "type": "color",
        "ref": "interactive-default"
      },
      {
        "id": "nc-radio-dot-color",
        "label": "Dot Color",
        "type": "color",
        "ref": "text-on-interactive"
      },
      {
        "id": "nc-radio-dot-scale",
        "label": "Dot Scale",
        "type": "number",
        "default": "0.4"
      },
      {
        "id": "nc-radio-disabled-bg",
        "label": "Disabled BG",
        "type": "color",
        "ref": "background-disabled"
      },
      {
        "id": "nc-radio-disabled-border",
        "label": "Disabled Border",
        "type": "color",
        "ref": "border-secondary"
      },
      {
        "id": "nc-radio-disabled-opacity",
        "label": "Disabled Opacity",
        "type": "opacity",
        "ref": "opacity-disabled"
      },
      {
        "id": "nc-radio-label-gap",
        "label": "Label Gap",
        "type": "spacing",
        "ref": "spacing-03"
      },
      {
        "id": "nc-radio-label-color",
        "label": "Label Color",
        "type": "color",
        "ref": "text-primary"
      },
      {
        "id": "nc-radio-border-error",
        "label": "Border Error",
        "type": "color",
        "ref": "border-danger"
      },
      {
        "id": "nc-radio-transition-duration",
        "label": "Transition",
        "type": "duration",
        "ref": "motion-duration-150"
      },
      {
        "id": "nc-radio-card-bg",
        "label": "Card BG",
        "type": "color",
        "ref": "background-base"
      },
      {
        "id": "nc-radio-card-bg-checked",
        "label": "Card BG Checked",
        "type": "color",
        "default": "var(--fnd-color-interactive-subtle)"
      },
      {
        "id": "nc-radio-card-border",
        "label": "Card Border",
        "type": "color",
        "ref": "border-primary"
      },
      {
        "id": "nc-radio-card-border-checked",
        "label": "Card Border Checked",
        "type": "color",
        "ref": "interactive-default"
      },
      {
        "id": "nc-radio-card-border-hover",
        "label": "Card Border Hover",
        "type": "color",
        "ref": "border-strong"
      },
      {
        "id": "nc-radio-card-radius",
        "label": "Card Radius",
        "type": "radius",
        "default": "var(--fnd-radius-md)"
      },
      {
        "id": "nc-radio-card-padding",
        "label": "Card Padding",
        "type": "spacing",
        "default": "var(--fnd-spacing-04)"
      },
      {
        "id": "nc-radio-segmented-bg",
        "label": "Segmented BG",
        "type": "color",
        "ref": "background-secondary"
      },
      {
        "id": "nc-radio-segmented-bg-checked",
        "label": "Segmented BG Checked",
        "type": "color",
        "ref": "interactive-default"
      },
      {
        "id": "nc-radio-segmented-color",
        "label": "Segmented Color",
        "type": "color",
        "ref": "text-primary"
      },
      {
        "id": "nc-radio-segmented-color-checked",
        "label": "Segmented Color Checked",
        "type": "color",
        "ref": "text-on-interactive"
      },
      {
        "id": "nc-radio-segmented-radius",
        "label": "Segmented Radius",
        "type": "radius",
        "default": "var(--fnd-radius-md)"
      },
      {
        "id": "nc-radio-segmented-padding",
        "label": "Segmented Padding",
        "type": "spacing",
        "default": "var(--fnd-spacing-03) var(--fnd-spacing-05)"
      },
      {
        "id": "nc-radio-segmented-border",
        "label": "Segmented Border",
        "type": "color",
        "ref": "border-secondary"
      }
    ],
    "subgroups": [
      {
        "id": "geometry",
        "label": "Geometry",
        "tokenIds": [
          "nc-radio-size-sm",
          "nc-radio-size-md",
          "nc-radio-size-lg",
          "nc-radio-border-width",
          "nc-radio-card-radius",
          "nc-radio-card-padding",
          "nc-radio-segmented-radius",
          "nc-radio-segmented-padding"
        ]
      },
      {
        "id": "colors",
        "label": "Colors",
        "tokenIds": [
          "nc-radio-bg",
          "nc-radio-border",
          "nc-radio-border-hover",
          "nc-radio-card-bg",
          "nc-radio-card-bg-checked",
          "nc-radio-card-border",
          "nc-radio-card-border-checked",
          "nc-radio-card-border-hover",
          "nc-radio-segmented-bg",
          "nc-radio-segmented-bg-checked",
          "nc-radio-segmented-color",
          "nc-radio-segmented-color-checked",
          "nc-radio-segmented-border"
        ]
      },
      {
        "id": "checked",
        "label": "Checked",
        "tokenIds": [
          "nc-radio-bg-checked",
          "nc-radio-border-checked",
          "nc-radio-dot-color",
          "nc-radio-dot-scale"
        ]
      },
      {
        "id": "disabled",
        "label": "Disabled",
        "tokenIds": [
          "nc-radio-disabled-bg",
          "nc-radio-disabled-border",
          "nc-radio-disabled-opacity"
        ]
      },
      {
        "id": "label",
        "label": "Label",
        "tokenIds": [
          "nc-radio-label-gap",
          "nc-radio-label-color"
        ]
      },
      {
        "id": "error",
        "label": "Error",
        "tokenIds": [
          "nc-radio-border-error"
        ]
      },
      {
        "id": "interaction",
        "label": "Interaction",
        "tokenIds": [
          "nc-radio-transition-duration"
        ]
      }
    ]
  },
  {
    "id": "switch",
    "label": "Switch",
    "icon": "toggle-right",
    "tokens": [
      {
        "id": "nc-switch-width",
        "label": "Width",
        "type": "size",
        "default": "44px"
      },
      {
        "id": "nc-switch-height",
        "label": "Height",
        "type": "size",
        "default": "24px"
      },
      {
        "id": "nc-switch-radius",
        "label": "Radius",
        "type": "border-radius",
        "ref": "radius-full"
      },
      {
        "id": "nc-switch-bg",
        "label": "Background",
        "type": "color",
        "ref": "background-secondary"
      },
      {
        "id": "nc-switch-bg-hover",
        "label": "BG Hover",
        "type": "color",
        "ref": "border-primary"
      },
      {
        "id": "nc-switch-bg-checked",
        "label": "BG Checked",
        "type": "color",
        "ref": "interactive-default"
      },
      {
        "id": "nc-switch-thumb-size",
        "label": "Thumb Size",
        "type": "size",
        "default": "18px"
      },
      {
        "id": "nc-switch-thumb-color",
        "label": "Thumb Color",
        "type": "color",
        "ref": "background-base"
      },
      {
        "id": "nc-switch-thumb-offset",
        "label": "Thumb Offset",
        "type": "spacing",
        "default": "4px"
      },
      {
        "id": "nc-switch-disabled-bg",
        "label": "Disabled BG",
        "type": "color",
        "ref": "background-disabled"
      },
      {
        "id": "nc-switch-disabled-thumb",
        "label": "Disabled Thumb",
        "type": "color",
        "ref": "border-secondary"
      },
      {
        "id": "nc-switch-disabled-opacity",
        "label": "Disabled Opacity",
        "type": "opacity",
        "ref": "opacity-disabled"
      },
      {
        "id": "nc-switch-label-gap",
        "label": "Label Gap",
        "type": "spacing",
        "ref": "spacing-03"
      },
      {
        "id": "nc-switch-label-color",
        "label": "Label Color",
        "type": "color",
        "ref": "text-primary"
      },
      {
        "id": "nc-switch-transition-duration",
        "label": "Transition",
        "type": "duration",
        "ref": "motion-duration-200"
      },
      {
        "id": "nc-switch-transition-timing",
        "label": "Transition Timing",
        "type": "generic",
        "default": "cubic-bezier(0.4, 0, 0.2, 1)"
      },
      {
        "id": "nc-switch-thumb-shadow",
        "label": "Thumb Shadow",
        "type": "color",
        "default": "var(--fnd-shadow-xs)"
      },
      {
        "id": "nc-switch-thumb-active-scale",
        "label": "Thumb Active Scale",
        "type": "generic",
        "default": "1.2"
      },
      {
        "id": "nc-switch-touch-padding",
        "label": "Touch Padding",
        "type": "size",
        "default": "10px"
      },
      {
        "id": "nc-switch-focus-ring-offset",
        "label": "Focus Ring Offset",
        "type": "size",
        "default": "3px"
      },
      {
        "id": "nc-switch-indicator-color",
        "label": "Indicator Color",
        "type": "color",
        "ref": "text-tertiary"
      },
      {
        "id": "nc-switch-indicator-checked-color",
        "label": "Indicator Checked Color",
        "type": "color",
        "ref": "text-on-interactive"
      }
    ],
    "subgroups": [
      {
        "id": "geometry",
        "label": "Geometry",
        "tokenIds": [
          "nc-switch-width",
          "nc-switch-height",
          "nc-switch-radius",
          "nc-switch-touch-padding",
          "nc-switch-focus-ring-offset"
        ]
      },
      {
        "id": "colors",
        "label": "Colors",
        "tokenIds": [
          "nc-switch-bg",
          "nc-switch-bg-hover",
          "nc-switch-bg-checked",
          "nc-switch-thumb-shadow",
          "nc-switch-indicator-color",
          "nc-switch-indicator-checked-color"
        ]
      },
      {
        "id": "thumb",
        "label": "Thumb",
        "tokenIds": [
          "nc-switch-thumb-size",
          "nc-switch-thumb-color",
          "nc-switch-thumb-offset"
        ]
      },
      {
        "id": "disabled",
        "label": "Disabled",
        "tokenIds": [
          "nc-switch-disabled-bg",
          "nc-switch-disabled-thumb",
          "nc-switch-disabled-opacity"
        ]
      },
      {
        "id": "label",
        "label": "Label",
        "tokenIds": [
          "nc-switch-label-gap",
          "nc-switch-label-color"
        ]
      },
      {
        "id": "interaction",
        "label": "Interaction",
        "tokenIds": [
          "nc-switch-transition-duration",
          "nc-switch-transition-timing",
          "nc-switch-thumb-active-scale"
        ]
      }
    ]
  },
  {
    "id": "tooltip",
    "label": "Tooltip",
    "icon": "message",
    "tokens": [
      {
        "id": "nc-tooltip-bg",
        "label": "Background",
        "type": "color",
        "ref": "background-inverse"
      },
      {
        "id": "nc-tooltip-color",
        "label": "Text Color",
        "type": "color",
        "ref": "text-inverse"
      },
      {
        "id": "nc-tooltip-padding",
        "label": "Padding",
        "type": "spacing",
        "default": "10px var(--fnd-spacing-03)"
      },
      {
        "id": "nc-tooltip-radius",
        "label": "Radius",
        "type": "border-radius",
        "ref": "radius-sm"
      },
      {
        "id": "nc-tooltip-shadow",
        "label": "Shadow",
        "type": "shadow",
        "ref": "elevation-floating"
      },
      {
        "id": "nc-tooltip-font-size",
        "label": "Font Size",
        "type": "font-size",
        "ref": "fs-sm"
      },
      {
        "id": "nc-tooltip-max-width",
        "label": "Max Width",
        "type": "size",
        "default": "320px"
      },
      {
        "id": "nc-tooltip-arrow-size",
        "label": "Arrow Size",
        "type": "size",
        "default": "8px"
      },
      {
        "id": "nc-tooltip-transition-duration",
        "label": "Transition Duration",
        "type": "duration",
        "default": "var(--fnd-motion-duration-200)"
      },
      {
        "id": "nc-tooltip-transition-timing",
        "label": "Transition Timing",
        "type": "generic",
        "default": "cubic-bezier(0.4, 0, 0.2, 1)"
      },
      {
        "id": "nc-tooltip-offset",
        "label": "Offset",
        "type": "size",
        "default": "8px"
      },
      {
        "id": "nc-tooltip-delay",
        "label": "Delay",
        "type": "duration",
        "default": "300ms"
      }
    ],
    "subgroups": [
      {
        "id": "geometry",
        "label": "Geometrie",
        "tokenIds": [
          "nc-tooltip-arrow-size",
          "nc-tooltip-offset"
        ]
      },
      {
        "id": "interaction",
        "label": "Bewegung & Zustand",
        "category": "state",
        "tokenIds": [
          "nc-tooltip-transition-duration",
          "nc-tooltip-transition-timing",
          "nc-tooltip-delay"
        ]
      }
    ]
  },
  {
    "id": "avatar",
    "label": "Avatar",
    "icon": "user-circle",
    "tokens": [
      {
        "id": "nc-avatar-size-xs",
        "label": "Size XS",
        "type": "size",
        "ref": "size-xs"
      },
      {
        "id": "nc-avatar-size-sm",
        "label": "Size SM",
        "type": "size",
        "ref": "size-sm"
      },
      {
        "id": "nc-avatar-size-md",
        "label": "Size MD",
        "type": "size",
        "ref": "size-md"
      },
      {
        "id": "nc-avatar-size-lg",
        "label": "Size LG",
        "type": "size",
        "ref": "size-lg"
      },
      {
        "id": "nc-avatar-size-xl",
        "label": "Size XL",
        "type": "size",
        "ref": "size-xl"
      },
      {
        "id": "nc-avatar-font-size-xs",
        "label": "Font XS",
        "type": "font-size",
        "default": "0.625rem"
      },
      {
        "id": "nc-avatar-font-size-sm",
        "label": "Font SM",
        "type": "font-size",
        "default": "0.75rem"
      },
      {
        "id": "nc-avatar-font-size-md",
        "label": "Font MD",
        "type": "font-size",
        "default": "0.875rem"
      },
      {
        "id": "nc-avatar-font-size-lg",
        "label": "Font LG",
        "type": "font-size",
        "default": "1rem"
      },
      {
        "id": "nc-avatar-font-size-xl",
        "label": "Font XL",
        "type": "font-size",
        "default": "1.25rem"
      },
      {
        "id": "nc-avatar-font-weight",
        "label": "Font Weight",
        "type": "font-weight",
        "ref": "font-weight-semibold"
      },
      {
        "id": "nc-avatar-bg",
        "label": "Background",
        "type": "color",
        "ref": "background-tertiary"
      },
      {
        "id": "nc-avatar-color",
        "label": "Text Color",
        "type": "color",
        "ref": "text-primary"
      },
      {
        "id": "nc-avatar-border-color",
        "label": "Border Color",
        "type": "color",
        "ref": "border-primary"
      },
      {
        "id": "nc-avatar-ring-width",
        "label": "Ring Width",
        "type": "size",
        "default": "2px"
      },
      {
        "id": "nc-avatar-ring-color",
        "label": "Ring Color",
        "type": "color",
        "ref": "background-base"
      },
      {
        "id": "nc-avatar-radius",
        "label": "Radius",
        "type": "border-radius",
        "ref": "radius-full"
      },
      {
        "id": "nc-avatar-radius-square",
        "label": "Radius Square",
        "type": "border-radius",
        "ref": "radius-sm"
      },
      {
        "id": "nc-avatar-badge-size",
        "label": "Badge Size",
        "type": "size",
        "default": "12px"
      },
      {
        "id": "nc-avatar-badge-border-width",
        "label": "Badge Border Width",
        "type": "size",
        "default": "1px"
      },
      {
        "id": "nc-avatar-badge-border-color",
        "label": "Badge Border Color",
        "type": "color",
        "ref": "background-base"
      },
      {
        "id": "nc-avatar-badge-online",
        "label": "Badge Online",
        "type": "color",
        "ref": "feedback-success"
      },
      {
        "id": "nc-avatar-badge-offline",
        "label": "Badge Offline",
        "type": "color",
        "ref": "text-disabled"
      },
      {
        "id": "nc-avatar-badge-busy",
        "label": "Badge Busy",
        "type": "color",
        "ref": "feedback-danger"
      },
      {
        "id": "nc-avatar-badge-away",
        "label": "Badge Away",
        "type": "color",
        "ref": "feedback-warning"
      },
      {
        "id": "nc-avatar-group-spacing",
        "label": "Group Spacing",
        "type": "spacing",
        "default": "-8px"
      },
      {
        "id": "nc-avatar-group-ring-width",
        "label": "Group Ring Width",
        "type": "size",
        "default": "2px"
      },
      {
        "id": "nc-avatar-group-ring-color",
        "label": "Group Ring Color",
        "type": "color",
        "ref": "background-base"
      },
      {
        "id": "nc-avatar-transition-duration",
        "label": "Transition",
        "type": "duration",
        "ref": "motion-duration-200"
      },
      {
        "id": "nc-avatar-ring-shadow",
        "label": "Ring Shadow",
        "type": "color",
        "default": "var(--fnd-shadow-xs)"
      },
      {
        "id": "nc-avatar-badge-verified",
        "label": "Badge Verified",
        "type": "color",
        "ref": "interactive-default"
      },
      {
        "id": "nc-avatar-hover-scale",
        "label": "Hover Scale",
        "type": "generic",
        "default": "1.05"
      },
      {
        "id": "nc-avatar-hover-shadow",
        "label": "Hover Shadow",
        "type": "color",
        "default": "var(--fnd-shadow-sm)"
      },
      {
        "id": "nc-avatar-active-scale",
        "label": "Active Scale",
        "type": "generic",
        "default": "0.97"
      },
      {
        "id": "nc-avatar-focus-ring-width",
        "label": "Focus Ring Width",
        "type": "size",
        "default": "2px"
      },
      {
        "id": "nc-avatar-focus-ring-color",
        "label": "Focus Ring Color",
        "type": "color",
        "ref": "interactive-focus"
      },
      {
        "id": "nc-avatar-focus-ring-offset",
        "label": "Focus Ring Offset",
        "type": "size",
        "default": "2px"
      },
      {
        "id": "nc-avatar-image-fade-duration",
        "label": "Image Fade Duration",
        "type": "duration",
        "default": "var(--fnd-motion-duration-300)"
      },
      {
        "id": "nc-avatar-hash-bg",
        "label": "Hash BG",
        "type": "color",
        "default": "var(--nc-avatar-bg)"
      },
      {
        "id": "nc-avatar-hash-color",
        "label": "Hash Color",
        "type": "color",
        "default": "var(--nc-avatar-color)"
      },
      {
        "id": "nc-avatar-size",
        "label": "Size",
        "type": "size",
        "default": "var(--nc-avatar-size-lg)"
      },
      {
        "id": "nc-avatar-font-size",
        "label": "Font Size",
        "type": "size",
        "default": "var(--nc-avatar-font-size-md)"
      }
    ],
    "subgroups": [
      {
        "id": "sizing",
        "label": "Sizing",
        "tokenIds": [
          "nc-avatar-size-xs",
          "nc-avatar-size-sm",
          "nc-avatar-size-md",
          "nc-avatar-size-lg",
          "nc-avatar-size-xl"
        ]
      },
      {
        "id": "typography",
        "label": "Typography",
        "tokenIds": [
          "nc-avatar-font-size-xs",
          "nc-avatar-font-size-sm",
          "nc-avatar-font-size-md",
          "nc-avatar-font-size-lg",
          "nc-avatar-font-size-xl",
          "nc-avatar-font-weight",
          "nc-avatar-font-size"
        ]
      },
      {
        "id": "colors",
        "label": "Colors",
        "tokenIds": [
          "nc-avatar-bg",
          "nc-avatar-color",
          "nc-avatar-border-color",
          "nc-avatar-ring-shadow",
          "nc-avatar-hover-shadow",
          "nc-avatar-focus-ring-color",
          "nc-avatar-hash-bg",
          "nc-avatar-hash-color"
        ]
      },
      {
        "id": "shape",
        "label": "Shape",
        "tokenIds": [
          "nc-avatar-radius",
          "nc-avatar-radius-square"
        ]
      },
      {
        "id": "ring",
        "label": "Ring",
        "tokenIds": [
          "nc-avatar-ring-width",
          "nc-avatar-ring-color"
        ]
      },
      {
        "id": "badge",
        "label": "Badge",
        "tokenIds": [
          "nc-avatar-badge-size",
          "nc-avatar-badge-border-width",
          "nc-avatar-badge-border-color",
          "nc-avatar-badge-online",
          "nc-avatar-badge-offline",
          "nc-avatar-badge-busy",
          "nc-avatar-badge-away"
        ]
      },
      {
        "id": "group",
        "label": "Group",
        "tokenIds": [
          "nc-avatar-group-spacing",
          "nc-avatar-group-ring-width",
          "nc-avatar-group-ring-color"
        ]
      },
      {
        "id": "interaction",
        "label": "Interaction",
        "tokenIds": [
          "nc-avatar-transition-duration",
          "nc-avatar-hover-scale",
          "nc-avatar-active-scale",
          "nc-avatar-image-fade-duration"
        ]
      },
      {
        "id": "geometry",
        "label": "Geometrie",
        "tokenIds": [
          "nc-avatar-focus-ring-width",
          "nc-avatar-focus-ring-offset",
          "nc-avatar-size"
        ]
      },
      {
        "id": "other",
        "label": "Weitere",
        "tokenIds": [
          "nc-avatar-badge-verified"
        ]
      }
    ]
  },
  {
    "id": "chip",
    "label": "Chip",
    "icon": "badge",
    "tokens": [
      {
        "id": "nc-chip-height-sm",
        "label": "Height SM",
        "type": "size",
        "default": "24px"
      },
      {
        "id": "nc-chip-height-md",
        "label": "Height MD",
        "type": "size",
        "default": "32px"
      },
      {
        "id": "nc-chip-height-lg",
        "label": "Height LG",
        "type": "size",
        "default": "40px"
      },
      {
        "id": "nc-chip-padding-x",
        "label": "Padding X",
        "type": "spacing",
        "ref": "spacing-03"
      },
      {
        "id": "nc-chip-padding-y",
        "label": "Padding Y",
        "type": "spacing",
        "ref": "spacing-01"
      },
      {
        "id": "nc-chip-radius",
        "label": "Radius",
        "type": "border-radius",
        "ref": "radius-full"
      },
      {
        "id": "nc-chip-font-size",
        "label": "Font Size",
        "type": "font-size",
        "default": "var(--fs-xs)"
      },
      {
        "id": "nc-chip-font-size-sm",
        "label": "Font Size SM",
        "type": "font-size",
        "default": "var(--fs-xs)"
      },
      {
        "id": "nc-chip-font-size-lg",
        "label": "Font Size LG",
        "type": "font-size",
        "default": "var(--fs-base)"
      },
      {
        "id": "nc-chip-font-weight",
        "label": "Font Weight",
        "type": "font-weight",
        "ref": "font-weight-semibold"
      },
      {
        "id": "nc-chip-gap",
        "label": "Gap",
        "type": "spacing",
        "ref": "spacing-02"
      },
      {
        "id": "nc-chip-transition-duration",
        "label": "Transition",
        "type": "duration",
        "ref": "motion-duration-200"
      },
      {
        "id": "nc-chip-scale-active",
        "label": "Scale Active",
        "type": "number",
        "default": "0.98"
      },
      {
        "id": "nc-chip-default-bg",
        "label": "Default BG",
        "type": "color",
        "default": "transparent"
      },
      {
        "id": "nc-chip-default-color",
        "label": "Default Color",
        "type": "color",
        "ref": "text-primary"
      },
      {
        "id": "nc-chip-default-border",
        "label": "Default Border",
        "type": "color",
        "ref": "border-primary"
      },
      {
        "id": "nc-chip-default-bg-hover",
        "label": "Default BG Hover",
        "type": "color",
        "ref": "background-secondary"
      },
      {
        "id": "nc-chip-selected-bg",
        "label": "Selected BG",
        "type": "color",
        "ref": "interactive-default"
      },
      {
        "id": "nc-chip-selected-color",
        "label": "Selected Color",
        "type": "color",
        "ref": "text-on-interactive"
      },
      {
        "id": "nc-chip-selected-border",
        "label": "Selected Border",
        "type": "color",
        "ref": "interactive-default"
      },
      {
        "id": "nc-chip-selected-bg-hover",
        "label": "Selected BG Hover",
        "type": "color",
        "ref": "interactive-hover"
      },
      {
        "id": "nc-chip-remove-size",
        "label": "Remove Size",
        "type": "size",
        "default": "16px"
      },
      {
        "id": "nc-chip-icon-size",
        "label": "Icon Size",
        "type": "size",
        "default": "16px"
      },
      {
        "id": "nc-chip-avatar-size",
        "label": "Avatar Size",
        "type": "size",
        "default": "20px"
      },
      {
        "id": "nc-chip-disabled-bg",
        "label": "Disabled BG",
        "type": "color",
        "ref": "background-disabled"
      },
      {
        "id": "nc-chip-disabled-color",
        "label": "Disabled Color",
        "type": "color",
        "ref": "text-disabled"
      },
      {
        "id": "nc-chip-disabled-border",
        "label": "Disabled Border",
        "type": "color",
        "ref": "border-secondary"
      },
      {
        "id": "nc-chip-opacity-disabled",
        "label": "Disabled Opacity",
        "type": "opacity",
        "ref": "opacity-disabled"
      },
      {
        "id": "nc-chip-touch-target-min",
        "label": "Touch Target Min",
        "type": "size",
        "default": "44px"
      },
      {
        "id": "nc-chip-padding-avatar",
        "label": "Padding Avatar",
        "type": "spacing",
        "default": "var(--fnd-spacing-01)"
      },
      {
        "id": "nc-chip-outline-bg",
        "label": "Outline BG",
        "type": "color",
        "default": "transparent"
      },
      {
        "id": "nc-chip-outline-color",
        "label": "Outline Color",
        "type": "color",
        "ref": "text-primary"
      },
      {
        "id": "nc-chip-outline-border",
        "label": "Outline Border",
        "type": "color",
        "ref": "border-primary"
      },
      {
        "id": "nc-chip-outline-bg-hover",
        "label": "Outline BG Hover",
        "type": "color",
        "ref": "background-secondary"
      },
      {
        "id": "nc-chip-ghost-bg",
        "label": "Ghost BG",
        "type": "color",
        "default": "transparent"
      },
      {
        "id": "nc-chip-ghost-color",
        "label": "Ghost Color",
        "type": "color",
        "ref": "text-secondary"
      },
      {
        "id": "nc-chip-ghost-border",
        "label": "Ghost Border",
        "type": "color",
        "default": "transparent"
      },
      {
        "id": "nc-chip-ghost-bg-hover",
        "label": "Ghost BG Hover",
        "type": "color",
        "default": "color-mix(in srgb, var(--fnd-color-text-primary) 6%, transparent)"
      },
      {
        "id": "nc-chip-count-font-size",
        "label": "Count Font Size",
        "type": "size",
        "default": "0.625rem"
      },
      {
        "id": "nc-chip-count-height",
        "label": "Count Height",
        "type": "size",
        "default": "18px"
      },
      {
        "id": "nc-chip-count-min-width",
        "label": "Count Min Width",
        "type": "size",
        "default": "18px"
      },
      {
        "id": "nc-chip-count-padding-x",
        "label": "Count Padding X",
        "type": "size",
        "default": "4px"
      },
      {
        "id": "nc-chip-count-bg",
        "label": "Count BG",
        "type": "color",
        "default": "color-mix(in srgb, currentColor 15%, transparent)"
      },
      {
        "id": "nc-chip-count-radius",
        "label": "Count Radius",
        "type": "radius",
        "default": "var(--fnd-radius-full)"
      },
      {
        "id": "nc-chip-group-gap",
        "label": "Group Gap",
        "type": "spacing",
        "default": "var(--fnd-spacing-02)"
      }
    ],
    "subgroups": [
      {
        "id": "geometry",
        "label": "Geometry",
        "tokenIds": [
          "nc-chip-height-sm",
          "nc-chip-height-md",
          "nc-chip-height-lg",
          "nc-chip-padding-x",
          "nc-chip-padding-y",
          "nc-chip-radius",
          "nc-chip-touch-target-min",
          "nc-chip-padding-avatar",
          "nc-chip-count-height",
          "nc-chip-count-min-width",
          "nc-chip-count-padding-x",
          "nc-chip-count-radius",
          "nc-chip-group-gap"
        ]
      },
      {
        "id": "typography",
        "label": "Typography",
        "tokenIds": [
          "nc-chip-font-size",
          "nc-chip-font-size-sm",
          "nc-chip-font-size-lg",
          "nc-chip-font-weight",
          "nc-chip-count-font-size"
        ]
      },
      {
        "id": "default-colors",
        "label": "Default Colors",
        "tokenIds": [
          "nc-chip-default-bg",
          "nc-chip-default-color",
          "nc-chip-default-border",
          "nc-chip-default-bg-hover"
        ]
      },
      {
        "id": "selected",
        "label": "Selected",
        "tokenIds": [
          "nc-chip-selected-bg",
          "nc-chip-selected-color",
          "nc-chip-selected-border",
          "nc-chip-selected-bg-hover"
        ]
      },
      {
        "id": "elements",
        "label": "Elements",
        "tokenIds": [
          "nc-chip-icon-size",
          "nc-chip-avatar-size",
          "nc-chip-remove-size"
        ]
      },
      {
        "id": "disabled",
        "label": "Disabled",
        "tokenIds": [
          "nc-chip-disabled-bg",
          "nc-chip-disabled-color",
          "nc-chip-disabled-border",
          "nc-chip-opacity-disabled"
        ]
      },
      {
        "id": "interaction",
        "label": "Interaction",
        "tokenIds": [
          "nc-chip-gap",
          "nc-chip-transition-duration",
          "nc-chip-scale-active"
        ]
      },
      {
        "id": "colors",
        "label": "Farben",
        "category": "main",
        "tokenIds": [
          "nc-chip-outline-bg",
          "nc-chip-outline-color",
          "nc-chip-outline-border",
          "nc-chip-outline-bg-hover",
          "nc-chip-ghost-bg",
          "nc-chip-ghost-color",
          "nc-chip-ghost-border",
          "nc-chip-ghost-bg-hover",
          "nc-chip-count-bg"
        ]
      }
    ]
  },
  {
    "id": "skeleton",
    "label": "Skeleton",
    "icon": "layout-board",
    "tokens": [
      {
        "id": "nc-skeleton-bg",
        "label": "Background",
        "type": "color",
        "ref": "background-skeleton"
      },
      {
        "id": "nc-skeleton-shimmer",
        "label": "Shimmer",
        "type": "color",
        "ref": "background-skeleton-element"
      },
      {
        "id": "nc-skeleton-radius",
        "label": "Radius",
        "type": "border-radius",
        "ref": "radius-sm"
      },
      {
        "id": "nc-skeleton-radius-circle",
        "label": "Radius Circle",
        "type": "border-radius",
        "ref": "radius-full"
      },
      {
        "id": "nc-skeleton-duration",
        "label": "Duration",
        "type": "duration",
        "ref": "motion-duration-1000"
      },
      {
        "id": "nc-skeleton-ease",
        "label": "Easing",
        "type": "string",
        "ref": "motion-ease-ease-in-out"
      },
      {
        "id": "nc-skeleton-height-xs",
        "label": "Height XS",
        "type": "size",
        "ref": "spacing-03"
      },
      {
        "id": "nc-skeleton-height-sm",
        "label": "Height SM",
        "type": "size",
        "ref": "spacing-04"
      },
      {
        "id": "nc-skeleton-height-md",
        "label": "Height MD",
        "type": "size",
        "ref": "spacing-06"
      },
      {
        "id": "nc-skeleton-height-lg",
        "label": "Height LG",
        "type": "size",
        "ref": "spacing-09"
      }
    ],
    "subgroups": [
      {
        "id": "appearance",
        "label": "Appearance",
        "tokenIds": [
          "nc-skeleton-bg",
          "nc-skeleton-shimmer",
          "nc-skeleton-radius",
          "nc-skeleton-radius-circle"
        ]
      },
      {
        "id": "sizing",
        "label": "Sizing",
        "tokenIds": [
          "nc-skeleton-height-xs",
          "nc-skeleton-height-sm",
          "nc-skeleton-height-md",
          "nc-skeleton-height-lg"
        ]
      },
      {
        "id": "animation",
        "label": "Animation",
        "tokenIds": [
          "nc-skeleton-duration",
          "nc-skeleton-ease"
        ]
      }
    ]
  },
  {
    "id": "spinner",
    "label": "Spinner",
    "icon": "loader",
    "tokens": [
      {
        "id": "nc-spinner-color",
        "label": "Color",
        "type": "color",
        "ref": "interactive-default"
      },
      {
        "id": "nc-spinner-track-color",
        "label": "Track Color",
        "type": "color",
        "ref": "border-secondary"
      },
      {
        "id": "nc-spinner-duration",
        "label": "Duration",
        "type": "duration",
        "ref": "motion-duration-700"
      },
      {
        "id": "nc-spinner-ease",
        "label": "Easing",
        "type": "string",
        "ref": "motion-ease-linear"
      },
      {
        "id": "nc-spinner-size-xs",
        "label": "Size XS",
        "type": "size",
        "ref": "spacing-04"
      },
      {
        "id": "nc-spinner-size-sm",
        "label": "Size SM",
        "type": "size",
        "ref": "spacing-05"
      },
      {
        "id": "nc-spinner-size-md",
        "label": "Size MD",
        "type": "size",
        "ref": "spacing-06"
      },
      {
        "id": "nc-spinner-size-lg",
        "label": "Size LG",
        "type": "size",
        "ref": "spacing-08"
      },
      {
        "id": "nc-spinner-size-xl",
        "label": "Size XL",
        "type": "size",
        "ref": "spacing-10"
      },
      {
        "id": "nc-spinner-border-width-xs",
        "label": "Border XS",
        "type": "size",
        "ref": "border-width-xs"
      },
      {
        "id": "nc-spinner-border-width-sm",
        "label": "Border SM",
        "type": "size",
        "ref": "border-width-sm"
      },
      {
        "id": "nc-spinner-border-width-md",
        "label": "Border MD",
        "type": "size",
        "ref": "border-width-sm"
      },
      {
        "id": "nc-spinner-border-width-lg",
        "label": "Border LG",
        "type": "size",
        "ref": "border-width-md"
      },
      {
        "id": "nc-spinner-border-width-xl",
        "label": "Border XL",
        "type": "size",
        "ref": "border-width-md"
      }
    ],
    "subgroups": [
      {
        "id": "colors",
        "label": "Colors",
        "tokenIds": [
          "nc-spinner-color",
          "nc-spinner-track-color"
        ]
      },
      {
        "id": "sizing",
        "label": "Sizing",
        "tokenIds": [
          "nc-spinner-size-xs",
          "nc-spinner-size-sm",
          "nc-spinner-size-md",
          "nc-spinner-size-lg",
          "nc-spinner-size-xl"
        ]
      },
      {
        "id": "border",
        "label": "Border Width",
        "tokenIds": [
          "nc-spinner-border-width-xs",
          "nc-spinner-border-width-sm",
          "nc-spinner-border-width-md",
          "nc-spinner-border-width-lg",
          "nc-spinner-border-width-xl"
        ]
      },
      {
        "id": "animation",
        "label": "Animation",
        "tokenIds": [
          "nc-spinner-duration",
          "nc-spinner-ease"
        ]
      }
    ]
  },
  {
    "id": "divider",
    "label": "Divider",
    "icon": "separator-horizontal",
    "tokens": [
      {
        "id": "nc-divider-color",
        "label": "Color",
        "type": "color",
        "ref": "border-secondary"
      },
      {
        "id": "nc-divider-width",
        "label": "Width",
        "type": "size",
        "ref": "border-width-xs"
      },
      {
        "id": "nc-divider-style",
        "label": "Style",
        "type": "string",
        "default": "solid"
      },
      {
        "id": "nc-divider-spacing",
        "label": "Spacing",
        "type": "spacing",
        "ref": "spacing-04"
      },
      {
        "id": "nc-divider-label-color",
        "label": "Label Color",
        "type": "color",
        "ref": "text-tertiary"
      },
      {
        "id": "nc-divider-label-size",
        "label": "Label Size",
        "type": "font-size",
        "default": "var(--fs-xs)"
      },
      {
        "id": "nc-divider-label-weight",
        "label": "Label Weight",
        "type": "font-weight",
        "ref": "font-weight-medium"
      },
      {
        "id": "nc-divider-label-gap",
        "label": "Label Gap",
        "type": "spacing",
        "ref": "spacing-03"
      },
      {
        "id": "nc-divider-strong-color",
        "label": "Strong Color",
        "type": "color",
        "ref": "border-strong"
      },
      {
        "id": "nc-divider-strong-width",
        "label": "Strong Width",
        "type": "size",
        "ref": "border-width-sm"
      }
    ],
    "subgroups": [
      {
        "id": "core",
        "label": "Core",
        "tokenIds": [
          "nc-divider-color",
          "nc-divider-width",
          "nc-divider-style",
          "nc-divider-spacing"
        ]
      },
      {
        "id": "label",
        "label": "Label",
        "tokenIds": [
          "nc-divider-label-color",
          "nc-divider-label-size",
          "nc-divider-label-weight",
          "nc-divider-label-gap"
        ]
      },
      {
        "id": "strong",
        "label": "Strong",
        "tokenIds": [
          "nc-divider-strong-color",
          "nc-divider-strong-width"
        ]
      }
    ]
  },
  {
    "id": "kbd",
    "label": "Kbd",
    "icon": "keyboard",
    "tokens": [
      {
        "id": "nc-kbd-bg",
        "label": "Background",
        "type": "color",
        "ref": "background-secondary"
      },
      {
        "id": "nc-kbd-color",
        "label": "Color",
        "type": "color",
        "ref": "text-secondary"
      },
      {
        "id": "nc-kbd-border",
        "label": "Border",
        "type": "color",
        "ref": "border-secondary"
      },
      {
        "id": "nc-kbd-border-width",
        "label": "Border Width",
        "type": "size",
        "ref": "border-width-xs"
      },
      {
        "id": "nc-kbd-radius",
        "label": "Radius",
        "type": "border-radius",
        "ref": "radius-xs"
      },
      {
        "id": "nc-kbd-padding-x",
        "label": "Padding X",
        "type": "spacing",
        "ref": "spacing-02"
      },
      {
        "id": "nc-kbd-padding-y",
        "label": "Padding Y",
        "type": "spacing",
        "ref": "spacing-01"
      },
      {
        "id": "nc-kbd-font-family",
        "label": "Font Family",
        "type": "font-family",
        "default": "var(--font-mono)"
      },
      {
        "id": "nc-kbd-font-size",
        "label": "Font Size",
        "type": "font-size",
        "default": "var(--fs-xs)"
      },
      {
        "id": "nc-kbd-font-weight",
        "label": "Font Weight",
        "type": "font-weight",
        "ref": "font-weight-medium"
      },
      {
        "id": "nc-kbd-line-height",
        "label": "Line Height",
        "type": "number",
        "default": "1"
      },
      {
        "id": "nc-kbd-shadow",
        "label": "Shadow",
        "type": "shadow",
        "default": "var(--fnd-elevation-base)"
      }
    ],
    "subgroups": [
      {
        "id": "colors",
        "label": "Colors",
        "tokenIds": [
          "nc-kbd-bg",
          "nc-kbd-color",
          "nc-kbd-border"
        ]
      },
      {
        "id": "geometry",
        "label": "Geometry",
        "tokenIds": [
          "nc-kbd-border-width",
          "nc-kbd-radius",
          "nc-kbd-padding-x",
          "nc-kbd-padding-y",
          "nc-kbd-shadow"
        ]
      },
      {
        "id": "typography",
        "label": "Typography",
        "tokenIds": [
          "nc-kbd-font-family",
          "nc-kbd-font-size",
          "nc-kbd-font-weight",
          "nc-kbd-line-height"
        ]
      }
    ]
  },
  {
    "id": "code-snippet",
    "label": "Code Snippet",
    "icon": "code",
    "subgroups": [
      {
        "id": "layout",
        "label": "Layout",
        "tokenIds": [
          "nc-cs-bg",
          "nc-cs-color",
          "nc-cs-border",
          "nc-cs-border-width",
          "nc-cs-radius",
          "nc-cs-padding",
          "nc-cs-padding-inline"
        ]
      },
      {
        "id": "typography",
        "label": "Typography",
        "tokenIds": [
          "nc-cs-font-family",
          "nc-cs-font-size",
          "nc-cs-line-height",
          "nc-cs-font-weight",
          "nc-cs-tab-size"
        ]
      },
      {
        "id": "inline",
        "label": "Inline Variant",
        "tokenIds": [
          "nc-cs-inline-bg",
          "nc-cs-inline-color",
          "nc-cs-inline-radius",
          "nc-cs-inline-padding-x",
          "nc-cs-inline-padding-y",
          "nc-cs-inline-font-size"
        ]
      },
      {
        "id": "copy-button",
        "label": "Copy Button",
        "tokenIds": [
          "nc-cs-copy-size",
          "nc-cs-copy-bg",
          "nc-cs-copy-bg-hover",
          "nc-cs-copy-color",
          "nc-cs-copy-color-hover",
          "nc-cs-copy-border",
          "nc-cs-copy-radius",
          "nc-cs-copy-icon-size"
        ]
      },
      {
        "id": "show-more",
        "label": "Show More",
        "tokenIds": [
          "nc-cs-multi-max-height",
          "nc-cs-show-more-bg",
          "nc-cs-show-more-color",
          "nc-cs-show-more-font-size",
          "nc-cs-show-more-height"
        ]
      },
      {
        "id": "syntax",
        "label": "Syntax Highlighting",
        "tokenIds": [
          "nc-cs-syntax-comment",
          "nc-cs-syntax-keyword",
          "nc-cs-syntax-string",
          "nc-cs-syntax-number",
          "nc-cs-syntax-function",
          "nc-cs-syntax-operator",
          "nc-cs-syntax-class",
          "nc-cs-syntax-property",
          "nc-cs-syntax-tag",
          "nc-cs-syntax-attr-name",
          "nc-cs-syntax-attr-value",
          "nc-cs-syntax-selector",
          "nc-cs-syntax-punctuation"
        ]
      }
    ],
    "tokens": [
      {
        "id": "nc-cs-bg",
        "label": "Background",
        "type": "color",
        "ref": "layer-01"
      },
      {
        "id": "nc-cs-color",
        "label": "Text Color",
        "type": "color",
        "ref": "text-primary"
      },
      {
        "id": "nc-cs-border",
        "label": "Border Color",
        "type": "color",
        "ref": "border-secondary"
      },
      {
        "id": "nc-cs-border-width",
        "label": "Border Width",
        "type": "size",
        "default": "1px"
      },
      {
        "id": "nc-cs-radius",
        "label": "Radius",
        "type": "size",
        "default": "8px"
      },
      {
        "id": "nc-cs-padding",
        "label": "Padding Block",
        "type": "size",
        "default": "20px"
      },
      {
        "id": "nc-cs-padding-inline",
        "label": "Padding Inline",
        "type": "size",
        "default": "20px"
      },
      {
        "id": "nc-cs-font-family",
        "label": "Font Family",
        "type": "generic",
        "default": "var(--font-mono)"
      },
      {
        "id": "nc-cs-font-size",
        "label": "Font Size",
        "type": "size",
        "default": "0.875rem"
      },
      {
        "id": "nc-cs-line-height",
        "label": "Line Height",
        "type": "generic",
        "default": "1.6"
      },
      {
        "id": "nc-cs-font-weight",
        "label": "Font Weight",
        "type": "generic",
        "default": "var(--fnd-font-weight-regular)"
      },
      {
        "id": "nc-cs-tab-size",
        "label": "Tab Size",
        "type": "generic",
        "default": "2"
      },
      {
        "id": "nc-cs-inline-bg",
        "label": "Inline BG",
        "type": "color",
        "ref": "background-secondary"
      },
      {
        "id": "nc-cs-inline-color",
        "label": "Inline Text",
        "type": "color",
        "ref": "text-primary"
      },
      {
        "id": "nc-cs-inline-radius",
        "label": "Inline Radius",
        "type": "size",
        "default": "2px"
      },
      {
        "id": "nc-cs-inline-padding-x",
        "label": "Inline Padding X",
        "type": "size",
        "default": "8px"
      },
      {
        "id": "nc-cs-inline-padding-y",
        "label": "Inline Padding Y",
        "type": "size",
        "default": "2px"
      },
      {
        "id": "nc-cs-inline-font-size",
        "label": "Inline Font Size",
        "type": "size",
        "default": "0.875em"
      },
      {
        "id": "nc-cs-copy-size",
        "label": "Copy Button Size",
        "type": "size",
        "default": "32px"
      },
      {
        "id": "nc-cs-copy-bg",
        "label": "Copy BG",
        "type": "color",
        "ref": "background-base"
      },
      {
        "id": "nc-cs-copy-bg-hover",
        "label": "Copy BG Hover",
        "type": "color",
        "ref": "background-secondary"
      },
      {
        "id": "nc-cs-copy-color",
        "label": "Copy Icon",
        "type": "color",
        "ref": "text-secondary"
      },
      {
        "id": "nc-cs-copy-color-hover",
        "label": "Copy Icon Hover",
        "type": "color",
        "ref": "text-primary"
      },
      {
        "id": "nc-cs-copy-border",
        "label": "Copy Border",
        "type": "color",
        "ref": "border-secondary"
      },
      {
        "id": "nc-cs-copy-radius",
        "label": "Copy Radius",
        "type": "size",
        "default": "4px"
      },
      {
        "id": "nc-cs-copy-icon-size",
        "label": "Copy Icon Size",
        "type": "size",
        "default": "16px"
      },
      {
        "id": "nc-cs-multi-max-height",
        "label": "Max Height",
        "type": "size",
        "default": "240px"
      },
      {
        "id": "nc-cs-show-more-bg",
        "label": "Show More BG",
        "type": "color",
        "ref": "layer-01"
      },
      {
        "id": "nc-cs-show-more-color",
        "label": "Show More Color",
        "type": "color",
        "ref": "interactive-default"
      },
      {
        "id": "nc-cs-show-more-font-size",
        "label": "Show More Font",
        "type": "size",
        "default": "0.875rem"
      },
      {
        "id": "nc-cs-show-more-height",
        "label": "Show More Height",
        "type": "size",
        "default": "32px"
      },
      {
        "id": "nc-cs-syntax-comment",
        "label": "Comment",
        "type": "color",
        "ref": "text-tertiary"
      },
      {
        "id": "nc-cs-syntax-keyword",
        "label": "Keyword",
        "type": "color",
        "default": "#8b5cf6"
      },
      {
        "id": "nc-cs-syntax-string",
        "label": "String",
        "type": "color",
        "default": "#059669"
      },
      {
        "id": "nc-cs-syntax-number",
        "label": "Number",
        "type": "color",
        "default": "#d97706"
      },
      {
        "id": "nc-cs-syntax-function",
        "label": "Function",
        "type": "color",
        "default": "#2563eb"
      },
      {
        "id": "nc-cs-syntax-operator",
        "label": "Operator",
        "type": "color",
        "ref": "text-secondary"
      },
      {
        "id": "nc-cs-syntax-class",
        "label": "Class",
        "type": "color",
        "default": "#0891b2"
      },
      {
        "id": "nc-cs-syntax-property",
        "label": "Property",
        "type": "color",
        "default": "#dc2626"
      },
      {
        "id": "nc-cs-syntax-tag",
        "label": "Tag",
        "type": "color",
        "default": "#dc2626"
      },
      {
        "id": "nc-cs-syntax-attr-name",
        "label": "Attr Name",
        "type": "color",
        "default": "#d97706"
      },
      {
        "id": "nc-cs-syntax-attr-value",
        "label": "Attr Value",
        "type": "color",
        "default": "#059669"
      },
      {
        "id": "nc-cs-syntax-selector",
        "label": "Selector",
        "type": "color",
        "default": "#8b5cf6"
      },
      {
        "id": "nc-cs-syntax-punctuation",
        "label": "Punctuation",
        "type": "color",
        "ref": "text-tertiary"
      }
    ]
  },
  {
    "id": "shell",
    "label": "Shell",
    "icon": "components",
    "subgroups": [
      {
        "id": "alle",
        "label": "Alle Tokens",
        "tokenIds": [
          "nc-shell-linkbar-separator-background",
          "nc-shell-linkbar-separator-opacity",
          "nc-shell-linkbar-nc-button-xs-font-size",
          "nc-shell-linkbar-nc-button-xs-padding"
        ]
      },
      {
        "id": "geometry",
        "label": "Geometrie",
        "tokenIds": [
          "nc-shell-sidebar-left-width-narrow",
          "nc-shell-sidebar-left-width-standard",
          "nc-shell-sidebar-left-width-wide",
          "nc-shell-sidebar-right-width-narrow",
          "nc-shell-sidebar-right-width-standard",
          "nc-shell-sidebar-right-width-wide",
          "nc-shell-banner-padding"
        ]
      },
      {
        "id": "typography",
        "label": "Typografie",
        "tokenIds": [
          "nc-shell-banner-font-size"
        ]
      },
      {
        "id": "colors",
        "label": "Farben",
        "category": "main",
        "tokenIds": [
          "nc-shell-skip-link-bg",
          "nc-shell-skip-link-color",
          "nc-shell-banner-bg",
          "nc-shell-banner-color"
        ]
      },
      {
        "id": "interaction",
        "label": "Bewegung & Zustand",
        "category": "state",
        "tokenIds": [
          "nc-shell-z-linkbar",
          "nc-shell-z-footerbar",
          "nc-shell-z-navbar",
          "nc-shell-z-sidebar",
          "nc-shell-z-overlay",
          "nc-shell-z-drawer",
          "nc-shell-skip-link-z"
        ]
      }
    ],
    "tokens": [
      {
        "id": "nc-shell-linkbar-height",
        "label": "Linkbar Height",
        "type": "size",
        "default": "32px"
      },
      {
        "id": "nc-shell-linkbar-bg",
        "label": "Linkbar BG",
        "type": "color",
        "ref": "layer-01"
      },
      {
        "id": "nc-shell-linkbar-color",
        "label": "Linkbar Color",
        "type": "color",
        "ref": "text-secondary"
      },
      {
        "id": "nc-shell-linkbar-border",
        "label": "Linkbar Border",
        "type": "color",
        "ref": "border-secondary"
      },
      {
        "id": "nc-shell-sidebar-left-width",
        "label": "Sidebar Left Width",
        "type": "size",
        "default": "260px"
      },
      {
        "id": "nc-shell-sidebar-right-width",
        "label": "Sidebar Right Width",
        "type": "size",
        "default": "260px"
      },
      {
        "id": "nc-shell-sidebar-bg",
        "label": "Sidebar BG",
        "type": "color",
        "ref": "layer-01"
      },
      {
        "id": "nc-shell-sidebar-border",
        "label": "Sidebar Border",
        "type": "color",
        "ref": "border-secondary"
      },
      {
        "id": "nc-shell-footerbar-height",
        "label": "Footerbar Height",
        "type": "size",
        "default": "36px"
      },
      {
        "id": "nc-shell-footerbar-bg",
        "label": "Footerbar BG",
        "type": "color",
        "ref": "layer-01"
      },
      {
        "id": "nc-shell-footerbar-color",
        "label": "Footerbar Color",
        "type": "color",
        "ref": "text-secondary"
      },
      {
        "id": "nc-shell-footerbar-border",
        "label": "Footerbar Border",
        "type": "color",
        "ref": "border-secondary"
      },
      {
        "id": "nc-shell-content-max-width",
        "label": "Content Max Width",
        "type": "size",
        "default": "1200px"
      },
      {
        "id": "nc-shell-content-narrow",
        "label": "Content Narrow",
        "type": "size",
        "default": "720px"
      },
      {
        "id": "nc-shell-content-padding",
        "label": "Content Padding",
        "type": "size",
        "default": "24px"
      },
      {
        "id": "nc-shell-sidebar-left-width-narrow",
        "label": "Sidebar Left Width Narrow",
        "type": "size",
        "default": "200px"
      },
      {
        "id": "nc-shell-sidebar-left-width-standard",
        "label": "Sidebar Left Width Standard",
        "type": "size",
        "default": "260px"
      },
      {
        "id": "nc-shell-sidebar-left-width-wide",
        "label": "Sidebar Left Width Wide",
        "type": "size",
        "default": "320px"
      },
      {
        "id": "nc-shell-sidebar-right-width-narrow",
        "label": "Sidebar Right Width Narrow",
        "type": "size",
        "default": "160px"
      },
      {
        "id": "nc-shell-sidebar-right-width-standard",
        "label": "Sidebar Right Width Standard",
        "type": "size",
        "default": "260px"
      },
      {
        "id": "nc-shell-sidebar-right-width-wide",
        "label": "Sidebar Right Width Wide",
        "type": "size",
        "default": "300px"
      },
      {
        "id": "nc-shell-z-linkbar",
        "label": "Z Linkbar",
        "type": "generic",
        "default": "var(--fnd-z-base, 1)"
      },
      {
        "id": "nc-shell-z-footerbar",
        "label": "Z Footerbar",
        "type": "generic",
        "default": "var(--fnd-z-sticky)"
      },
      {
        "id": "nc-shell-z-navbar",
        "label": "Z Navbar",
        "type": "generic",
        "default": "var(--fnd-z-header)"
      },
      {
        "id": "nc-shell-z-sidebar",
        "label": "Z Sidebar",
        "type": "generic",
        "default": "var(--fnd-z-sidebar)"
      },
      {
        "id": "nc-shell-z-overlay",
        "label": "Z Overlay",
        "type": "color",
        "default": "calc(var(--fnd-z-drawer) - 1)"
      },
      {
        "id": "nc-shell-z-drawer",
        "label": "Z Drawer",
        "type": "generic",
        "default": "var(--fnd-z-drawer)"
      },
      {
        "id": "nc-shell-skip-link-bg",
        "label": "Skip Link BG",
        "type": "color",
        "ref": "background-base"
      },
      {
        "id": "nc-shell-skip-link-color",
        "label": "Skip Link Color",
        "type": "color",
        "ref": "text-primary"
      },
      {
        "id": "nc-shell-skip-link-z",
        "label": "Skip Link Z",
        "type": "generic",
        "default": "var(--fnd-z-skip-link)"
      },
      {
        "id": "nc-shell-banner-bg",
        "label": "Banner BG",
        "type": "color",
        "ref": "background-info"
      },
      {
        "id": "nc-shell-banner-color",
        "label": "Banner Color",
        "type": "color",
        "ref": "text-info"
      },
      {
        "id": "nc-shell-banner-padding",
        "label": "Banner Padding",
        "type": "spacing",
        "default": "var(--fnd-spacing-02) var(--fnd-spacing-06)"
      },
      {
        "id": "nc-shell-banner-font-size",
        "label": "Banner Font Size",
        "type": "size",
        "default": "var(--fs-sm)"
      }
    ]
  },
  {
    "id": "container",
    "label": "Container",
    "icon": "box",
    "subgroups": [
      {
        "id": "geometry",
        "label": "Geometry",
        "tokenIds": [
          "nc-container-max-width",
          "nc-container-max-width-wide",
          "nc-container-padding-inline",
          "nc-container-padding-inline-xxl",
          "nc-container-max-width-narrow",
          "nc-container-max-width-content",
          "nc-container-padding-inline-constrained",
          "nc-container-padding-block-sm",
          "nc-container-padding-block-md",
          "nc-container-padding-block-lg",
          "nc-container-margin-start",
          "nc-container-margin-end",
          "nc-container-surface-radius"
        ]
      },
      {
        "id": "colors",
        "label": "Farben",
        "category": "main",
        "tokenIds": [
          "nc-container-surface-bg",
          "nc-container-surface-shadow",
          "nc-container-surface-padding"
        ]
      }
    ],
    "tokens": [
      {
        "id": "nc-container-max-width",
        "label": "Max Width",
        "type": "size",
        "default": "1200px"
      },
      {
        "id": "nc-container-max-width-wide",
        "label": "Max Width (Wide)",
        "type": "size",
        "default": "1440px"
      },
      {
        "id": "nc-container-padding-inline",
        "label": "Padding Inline",
        "type": "size",
        "default": "clamp(16px, 3.5vw, 48px)"
      },
      {
        "id": "nc-container-padding-inline-xxl",
        "label": "Padding Inline (XXL)",
        "type": "size",
        "default": "0px"
      },
      {
        "id": "nc-container-max-width-narrow",
        "label": "Max Width Narrow",
        "type": "size",
        "default": "var(--container-narrow)"
      },
      {
        "id": "nc-container-max-width-content",
        "label": "Max Width Content",
        "type": "size",
        "default": "var(--container-content)"
      },
      {
        "id": "nc-container-padding-inline-constrained",
        "label": "Padding Inline Constrained",
        "type": "spacing",
        "default": "var(--fnd-spacing-11)"
      },
      {
        "id": "nc-container-padding-block-sm",
        "label": "Padding Block SM",
        "type": "size",
        "default": "clamp(16px, 2vw, 24px)"
      },
      {
        "id": "nc-container-padding-block-md",
        "label": "Padding Block MD",
        "type": "size",
        "default": "clamp(32px, 4vw, 48px)"
      },
      {
        "id": "nc-container-padding-block-lg",
        "label": "Padding Block LG",
        "type": "size",
        "default": "clamp(48px, 6vw, 80px)"
      },
      {
        "id": "nc-container-margin-start",
        "label": "Margin Start",
        "type": "size",
        "default": "auto"
      },
      {
        "id": "nc-container-margin-end",
        "label": "Margin End",
        "type": "size",
        "default": "auto"
      },
      {
        "id": "nc-container-surface-bg",
        "label": "Surface BG",
        "type": "color",
        "default": "var(--fnd-color-surface-elevated)"
      },
      {
        "id": "nc-container-surface-radius",
        "label": "Surface Radius",
        "type": "radius",
        "default": "var(--fnd-radius-md)"
      },
      {
        "id": "nc-container-surface-shadow",
        "label": "Surface Shadow",
        "type": "color",
        "default": "var(--fnd-shadow-sm)"
      },
      {
        "id": "nc-container-surface-padding",
        "label": "Surface Padding",
        "type": "color",
        "default": "clamp(16px, 3vw, 32px)"
      }
    ]
  },
  {
    "id": "grid",
    "label": "Grid",
    "icon": "layout-grid",
    "subgroups": [
      {
        "id": "geometry",
        "label": "Geometry",
        "tokenIds": [
          "nc-grid-columns",
          "nc-grid-gap",
          "nc-grid-gap-sm",
          "nc-grid-gap-lg"
        ]
      },
      {
        "id": "other",
        "label": "Weitere",
        "tokenIds": [
          "nc-grid-mobile-columns",
          "nc-grid-tablet-columns"
        ]
      }
    ],
    "tokens": [
      {
        "id": "nc-grid-columns",
        "label": "Columns",
        "type": "number",
        "default": "12"
      },
      {
        "id": "nc-grid-gap",
        "label": "Gap",
        "type": "size",
        "default": "clamp(12px, 1.5vw, 24px)"
      },
      {
        "id": "nc-grid-gap-sm",
        "label": "Gap Small",
        "type": "size",
        "default": "var(--fnd-spacing-04)"
      },
      {
        "id": "nc-grid-gap-lg",
        "label": "Gap Large",
        "type": "size",
        "default": "var(--fnd-spacing-08)"
      },
      {
        "id": "nc-grid-mobile-columns",
        "label": "Mobile Columns",
        "type": "generic",
        "default": "4"
      },
      {
        "id": "nc-grid-tablet-columns",
        "label": "Tablet Columns",
        "type": "generic",
        "default": "8"
      }
    ]
  },
  {
    "id": "section",
    "label": "Section",
    "icon": "section",
    "subgroups": [
      {
        "id": "geometry",
        "label": "Geometry",
        "tokenIds": [
          "nc-section-padding-block",
          "nc-section-padding-block-sm",
          "nc-section-padding-block-lg",
          "nc-section-divider-width",
          "nc-section-edge-height"
        ]
      },
      {
        "id": "surface",
        "label": "Surface",
        "tokenIds": [
          "nc-section-bg",
          "nc-section-color"
        ]
      },
      {
        "id": "colors",
        "label": "Farben",
        "category": "main",
        "tokenIds": [
          "nc-section-accent-bg",
          "nc-section-accent-color",
          "nc-section-accent-color-secondary",
          "nc-section-divider-color",
          "nc-section-edge-fill"
        ]
      },
      {
        "id": "other",
        "label": "Weitere",
        "tokenIds": [
          "nc-section-divider-style",
          "nc-section-edge-angle"
        ]
      }
    ],
    "tokens": [
      {
        "id": "nc-section-padding-block",
        "label": "Padding Block",
        "type": "size",
        "default": "clamp(2rem, 4vw, 6rem)"
      },
      {
        "id": "nc-section-padding-block-sm",
        "label": "Padding Block (Compact)",
        "type": "size",
        "default": "var(--fnd-spacing-08)"
      },
      {
        "id": "nc-section-padding-block-lg",
        "label": "Padding Block (Spacious)",
        "type": "size",
        "default": "var(--fnd-spacing-13)"
      },
      {
        "id": "nc-section-bg",
        "label": "Background",
        "type": "color",
        "ref": "background-base"
      },
      {
        "id": "nc-section-color",
        "label": "Text Color",
        "type": "color",
        "ref": "text-primary"
      },
      {
        "id": "nc-section-accent-bg",
        "label": "Accent BG",
        "type": "color",
        "ref": "interactive-default"
      },
      {
        "id": "nc-section-accent-color",
        "label": "Accent Color",
        "type": "color",
        "ref": "text-on-interactive"
      },
      {
        "id": "nc-section-accent-color-secondary",
        "label": "Accent Color Secondary",
        "type": "color",
        "default": "color-mix(in srgb, var(--fnd-color-text-on-interactive) 75%, transparent)"
      },
      {
        "id": "nc-section-divider-color",
        "label": "Divider Color",
        "type": "color",
        "ref": "border-primary"
      },
      {
        "id": "nc-section-divider-width",
        "label": "Divider Width",
        "type": "size",
        "default": "1px"
      },
      {
        "id": "nc-section-divider-style",
        "label": "Divider Style",
        "type": "generic",
        "default": "solid"
      },
      {
        "id": "nc-section-edge-height",
        "label": "Edge Height",
        "type": "size",
        "default": "48px"
      },
      {
        "id": "nc-section-edge-angle",
        "label": "Edge Angle",
        "type": "generic",
        "default": "3deg"
      },
      {
        "id": "nc-section-edge-fill",
        "label": "Edge Fill",
        "type": "color",
        "ref": "background-base"
      }
    ]
  },
  {
    "id": "bento-grid",
    "label": "Bento Grid",
    "icon": "components",
    "subgroups": [
      {
        "id": "alle",
        "label": "Alle Tokens",
        "tokenIds": [
          "nc-bento-grid-scrim-background",
          "nc-bento-grid-cell-box-shadow",
          "nc-bento-grid-cell-hover-box-shadow"
        ]
      }
    ],
    "tokens": [
      {
        "id": "nc-bento-grid-gap",
        "label": "Gap",
        "type": "size",
        "default": "var(--fnd-spacing-05)"
      },
      {
        "id": "nc-bento-grid-columns",
        "label": "Columns",
        "type": "number",
        "default": "4"
      },
      {
        "id": "nc-bento-grid-cell-min",
        "label": "Cell Min",
        "type": "size",
        "default": "11.25rem"
      },
      {
        "id": "nc-bento-grid-radius",
        "label": "Radius",
        "type": "size",
        "default": "var(--fnd-radius-4xl)"
      },
      {
        "id": "nc-bento-grid-padding",
        "label": "Padding",
        "type": "size",
        "default": "var(--fnd-spacing-07)"
      },
      {
        "id": "nc-bento-grid-surface",
        "label": "Surface",
        "type": "color",
        "default": "var(--fnd-color-surface-elevated)"
      },
      {
        "id": "nc-bento-grid-border",
        "label": "Border",
        "type": "color",
        "default": "var(--fnd-color-border-primary)"
      },
      {
        "id": "nc-bento-grid-border-hover",
        "label": "Border Hover",
        "type": "color",
        "default": "var(--fnd-color-interactive-default)"
      },
      {
        "id": "nc-bento-grid-accent",
        "label": "Accent",
        "type": "color",
        "default": "var(--fnd-color-interactive-default)"
      },
      {
        "id": "nc-bento-grid-title",
        "label": "Title",
        "type": "color",
        "default": "var(--fnd-color-text-primary)"
      },
      {
        "id": "nc-bento-grid-text",
        "label": "Text",
        "type": "color",
        "default": "var(--fnd-color-text-secondary)"
      }
    ]
  },
  {
    "id": "expanding-panels",
    "label": "Expanding Panels",
    "icon": "layout-columns",
    "subgroups": [
      {
        "id": "layout",
        "label": "Layout",
        "tokenIds": [
          "nc-expanding-panels-gap",
          "nc-expanding-panels-height",
          "nc-expanding-panels-radius",
          "nc-expanding-panels-grow"
        ]
      },
      {
        "id": "surface",
        "label": "Surface & Border",
        "tokenIds": [
          "nc-expanding-panels-surface",
          "nc-expanding-panels-border"
        ]
      },
      {
        "id": "accent",
        "label": "Accent & Text",
        "tokenIds": [
          "nc-expanding-panels-accent",
          "nc-expanding-panels-title",
          "nc-expanding-panels-text"
        ]
      }
    ],
    "tokens": [
      {
        "id": "nc-expanding-panels-gap",
        "label": "Gap",
        "type": "size",
        "default": "var(--fnd-spacing-03)"
      },
      {
        "id": "nc-expanding-panels-height",
        "label": "Height",
        "type": "size",
        "default": "26.25rem"
      },
      {
        "id": "nc-expanding-panels-radius",
        "label": "Radius",
        "type": "size",
        "default": "var(--fnd-radius-4xl)"
      },
      {
        "id": "nc-expanding-panels-grow",
        "label": "Grow",
        "type": "number",
        "default": "2.6"
      },
      {
        "id": "nc-expanding-panels-surface",
        "label": "Surface",
        "type": "color",
        "default": "var(--fnd-color-surface-elevated)"
      },
      {
        "id": "nc-expanding-panels-border",
        "label": "Border",
        "type": "color",
        "default": "var(--fnd-color-border-primary)"
      },
      {
        "id": "nc-expanding-panels-accent",
        "label": "Accent",
        "type": "color",
        "default": "var(--fnd-color-interactive-default)"
      },
      {
        "id": "nc-expanding-panels-title",
        "label": "Title",
        "type": "color",
        "default": "var(--fnd-color-text-primary)"
      },
      {
        "id": "nc-expanding-panels-text",
        "label": "Text",
        "type": "color",
        "default": "var(--fnd-color-text-secondary)"
      }
    ]
  },
  {
    "id": "solution-tabs",
    "label": "Solution Tabs",
    "icon": "layout-navbar",
    "subgroups": [
      {
        "id": "layout",
        "label": "Layout & Surface",
        "tokenIds": [
          "nc-solution-tabs-border",
          "nc-solution-tabs-visual-bg"
        ]
      },
      {
        "id": "tabs",
        "label": "Tabs & Autoplay",
        "tokenIds": [
          "nc-solution-tabs-tab-color",
          "nc-solution-tabs-tab-color-active",
          "nc-solution-tabs-autoplay-duration"
        ]
      },
      {
        "id": "accent",
        "label": "Accent & Text",
        "tokenIds": [
          "nc-solution-tabs-accent-default",
          "nc-solution-tabs-title",
          "nc-solution-tabs-text"
        ]
      },
      {
        "id": "colors",
        "label": "Farben",
        "category": "main",
        "tokenIds": [
          "nc-solution-tabs-tab-bg-strength",
          "nc-solution-tabs-tab-bg-strength-hover",
          "nc-solution-tabs-tab-color-hover"
        ]
      }
    ],
    "tokens": [
      {
        "id": "nc-solution-tabs-border",
        "label": "Border",
        "type": "color",
        "default": "color-mix(in srgb, var(--fnd-color-text-inverse) 14%, transparent)"
      },
      {
        "id": "nc-solution-tabs-visual-bg",
        "label": "Visual Bg",
        "type": "color",
        "default": "color-mix(in srgb, var(--fnd-color-text-inverse) 7%, var(--fnd-color-always-dark))"
      },
      {
        "id": "nc-solution-tabs-tab-color",
        "label": "Tab Color",
        "type": "color",
        "default": "color-mix(in srgb, var(--fnd-color-text-inverse) 58%, transparent)"
      },
      {
        "id": "nc-solution-tabs-tab-color-active",
        "label": "Tab Color Active",
        "type": "color",
        "default": "var(--fnd-color-text-inverse)"
      },
      {
        "id": "nc-solution-tabs-autoplay-duration",
        "label": "Autoplay Duration",
        "type": "time",
        "default": "7s"
      },
      {
        "id": "nc-solution-tabs-accent-default",
        "label": "Accent Default",
        "type": "color",
        "default": "var(--fnd-color-text-accent)"
      },
      {
        "id": "nc-solution-tabs-title",
        "label": "Title",
        "type": "color",
        "default": "var(--fnd-color-text-inverse)"
      },
      {
        "id": "nc-solution-tabs-text",
        "label": "Text",
        "type": "color",
        "default": "color-mix(in srgb, var(--fnd-color-text-inverse) 74%, transparent)"
      },
      {
        "id": "nc-solution-tabs-tab-bg-strength",
        "label": "Tab BG Strength",
        "type": "color",
        "default": "30%"
      },
      {
        "id": "nc-solution-tabs-tab-bg-strength-hover",
        "label": "Tab BG Strength Hover",
        "type": "color",
        "default": "45%"
      },
      {
        "id": "nc-solution-tabs-tab-color-hover",
        "label": "Tab Color Hover",
        "type": "color",
        "ref": "text-inverse"
      }
    ]
  },
  {
    "id": "footer",
    "label": "Footer",
    "icon": "components",
    "subgroups": [
      {
        "id": "alle",
        "label": "Alle Tokens",
        "tokenIds": [
          "nc-footer-column-h3-letter-spacing",
          "nc-footer-contact-gap",
          "nc-footer-address-margin",
          "nc-footer-backtotop-gap",
          "nc-footer-backtotop-padding",
          "nc-footer-backtotop-background",
          "nc-footer-backtotop-border-radius"
        ]
      },
      {
        "id": "geometry",
        "label": "Geometrie",
        "tokenIds": [
          "nc-footer-padding-block",
          "nc-footer-padding-inline",
          "nc-footer-max-width",
          "nc-footer-col-gap",
          "nc-footer-heading-size",
          "nc-footer-link-size",
          "nc-footer-cta-kicker-size",
          "nc-footer-cta-headline-size",
          "nc-footer-cta-gap",
          "nc-footer-social-icon-size",
          "nc-footer-social-gap",
          "nc-footer-legal-size"
        ]
      },
      {
        "id": "typography",
        "label": "Typografie",
        "tokenIds": [
          "nc-footer-heading-weight",
          "nc-footer-heading-transform",
          "nc-footer-cta-headline-weight"
        ]
      },
      {
        "id": "colors",
        "label": "Farben",
        "category": "main",
        "tokenIds": [
          "nc-footer-bg",
          "nc-footer-color",
          "nc-footer-separator-color",
          "nc-footer-link-color",
          "nc-footer-link-hover-color",
          "nc-footer-heading-color",
          "nc-footer-social-color",
          "nc-footer-social-hover-color",
          "nc-footer-legal-color"
        ]
      },
      {
        "id": "other",
        "label": "Weitere",
        "tokenIds": [
          "nc-footer-cta-kicker-family"
        ]
      }
    ],
    "tokens": [
      {
        "id": "nc-footer-column-h3-letter-spacing",
        "label": "Column H3 Letter Spacing",
        "type": "size",
        "default": "var(--nc-mono-tracking-code)"
      },
      {
        "id": "nc-footer-contact-gap",
        "label": "Contact Gap",
        "type": "spacing",
        "default": "var(--fnd-spacing-01)"
      },
      {
        "id": "nc-footer-address-margin",
        "label": "Address Margin",
        "type": "spacing",
        "default": "0 0 0.25rem"
      },
      {
        "id": "nc-footer-backtotop-gap",
        "label": "Backtotop Gap",
        "type": "spacing",
        "default": "var(--fnd-spacing-02)"
      },
      {
        "id": "nc-footer-backtotop-padding",
        "label": "Backtotop Padding",
        "type": "spacing",
        "default": "0.5rem 0.9rem"
      },
      {
        "id": "nc-footer-backtotop-background",
        "label": "Backtotop Background",
        "type": "color",
        "default": "transparent"
      },
      {
        "id": "nc-footer-backtotop-border-radius",
        "label": "Backtotop Border Radius",
        "type": "radius",
        "default": "var(--fnd-radius-full)"
      },
      {
        "id": "nc-footer-bg",
        "label": "BG",
        "type": "color",
        "ref": "background-base"
      },
      {
        "id": "nc-footer-color",
        "label": "Color",
        "type": "color",
        "ref": "text-primary"
      },
      {
        "id": "nc-footer-padding-block",
        "label": "Padding Block",
        "type": "spacing",
        "default": "var(--fnd-spacing-10)"
      },
      {
        "id": "nc-footer-padding-inline",
        "label": "Padding Inline",
        "type": "spacing",
        "default": "var(--fnd-spacing-06)"
      },
      {
        "id": "nc-footer-max-width",
        "label": "Max Width",
        "type": "size",
        "default": "var(--container-max-width, 1440px)"
      },
      {
        "id": "nc-footer-separator-color",
        "label": "Separator Color",
        "type": "color",
        "ref": "border-secondary"
      },
      {
        "id": "nc-footer-link-color",
        "label": "Link Color",
        "type": "color",
        "ref": "text-secondary"
      },
      {
        "id": "nc-footer-link-hover-color",
        "label": "Link Hover Color",
        "type": "color",
        "ref": "text-primary"
      },
      {
        "id": "nc-footer-col-gap",
        "label": "Col Gap",
        "type": "spacing",
        "default": "var(--fnd-spacing-08)"
      },
      {
        "id": "nc-footer-heading-size",
        "label": "Heading Size",
        "type": "size",
        "default": "var(--fs-xs)"
      },
      {
        "id": "nc-footer-heading-weight",
        "label": "Heading Weight",
        "type": "fontWeight",
        "default": "var(--fnd-font-weight-semibold)"
      },
      {
        "id": "nc-footer-heading-color",
        "label": "Heading Color",
        "type": "color",
        "ref": "text-primary"
      },
      {
        "id": "nc-footer-heading-transform",
        "label": "Heading Transform",
        "type": "size",
        "default": "uppercase"
      },
      {
        "id": "nc-footer-link-size",
        "label": "Link Size",
        "type": "size",
        "default": "var(--fs-sm)"
      },
      {
        "id": "nc-footer-cta-kicker-family",
        "label": "Cta Kicker Family",
        "type": "generic",
        "default": "var(--font-mono)"
      },
      {
        "id": "nc-footer-cta-kicker-size",
        "label": "Cta Kicker Size",
        "type": "size",
        "default": "var(--nc-mono-label-size)"
      },
      {
        "id": "nc-footer-cta-headline-size",
        "label": "Cta Headline Size",
        "type": "size",
        "default": "var(--fs-4xl)"
      },
      {
        "id": "nc-footer-cta-headline-weight",
        "label": "Cta Headline Weight",
        "type": "fontWeight",
        "default": "var(--fnd-font-weight-bold)"
      },
      {
        "id": "nc-footer-cta-gap",
        "label": "Cta Gap",
        "type": "spacing",
        "default": "var(--fnd-spacing-06)"
      },
      {
        "id": "nc-footer-social-icon-size",
        "label": "Social Icon Size",
        "type": "size",
        "default": "24px"
      },
      {
        "id": "nc-footer-social-gap",
        "label": "Social Gap",
        "type": "spacing",
        "default": "var(--fnd-spacing-04)"
      },
      {
        "id": "nc-footer-social-color",
        "label": "Social Color",
        "type": "color",
        "ref": "text-secondary"
      },
      {
        "id": "nc-footer-social-hover-color",
        "label": "Social Hover Color",
        "type": "color",
        "ref": "text-primary"
      },
      {
        "id": "nc-footer-legal-size",
        "label": "Legal Size",
        "type": "size",
        "default": "var(--fs-xs)"
      },
      {
        "id": "nc-footer-legal-color",
        "label": "Legal Color",
        "type": "color",
        "ref": "text-tertiary"
      }
    ]
  },
  {
    "id": "testimonial",
    "label": "Testimonial",
    "icon": "components",
    "subgroups": [
      {
        "id": "alle",
        "label": "Alle Tokens",
        "tokenIds": [
          "nc-testimonial-quote-font-weight",
          "nc-testimonial-result-padding",
          "nc-testimonial-result-line-height",
          "nc-testimonial-avatar-border-radius",
          "nc-testimonial-meta-gap",
          "nc-testimonial-socials-gap",
          "nc-testimonial-social-border-radius",
          "nc-testimonial-video-background",
          "nc-testimonial-video-facade-after-background",
          "nc-testimonial-video-facade-hover-after-background",
          "nc-testimonial-video-play-border-radius",
          "nc-testimonial-video-play-background",
          "nc-testimonial-video-play-color",
          "nc-testimonial-video-play-box-shadow",
          "nc-testimonial-context-gap",
          "nc-testimonial-context-item-before-opacity"
        ]
      }
    ],
    "tokens": [
      {
        "id": "nc-testimonial-quote-font-weight",
        "label": "Quote Font Weight",
        "type": "weight",
        "default": "var(--fnd-font-weight-medium)"
      },
      {
        "id": "nc-testimonial-result-padding",
        "label": "Result Padding",
        "type": "spacing",
        "default": "0.3rem 0.7rem"
      },
      {
        "id": "nc-testimonial-result-line-height",
        "label": "Result Line Height",
        "type": "size",
        "default": "1.2"
      },
      {
        "id": "nc-testimonial-avatar-border-radius",
        "label": "Avatar Border Radius",
        "type": "radius",
        "default": "var(--fnd-radius-full)"
      },
      {
        "id": "nc-testimonial-meta-gap",
        "label": "Meta Gap",
        "type": "spacing",
        "default": "2px"
      },
      {
        "id": "nc-testimonial-socials-gap",
        "label": "Socials Gap",
        "type": "spacing",
        "default": "var(--fnd-spacing-02)"
      },
      {
        "id": "nc-testimonial-social-border-radius",
        "label": "Social Border Radius",
        "type": "radius",
        "default": "var(--fnd-radius-full)"
      },
      {
        "id": "nc-testimonial-video-background",
        "label": "Video Background",
        "type": "color",
        "default": "#000"
      },
      {
        "id": "nc-testimonial-video-facade-after-background",
        "label": "Video Facade After Background",
        "type": "color",
        "default": "rgba(0, 0, 0, .18)"
      },
      {
        "id": "nc-testimonial-video-facade-hover-after-background",
        "label": "Video Facade Hover After Background",
        "type": "color",
        "default": "rgba(0, 0, 0, .34)"
      },
      {
        "id": "nc-testimonial-video-play-border-radius",
        "label": "Video Play Border Radius",
        "type": "radius",
        "default": "var(--fnd-radius-full)"
      },
      {
        "id": "nc-testimonial-video-play-background",
        "label": "Video Play Background",
        "type": "color",
        "default": "rgba(255, 255, 255, .92)"
      },
      {
        "id": "nc-testimonial-video-play-color",
        "label": "Video Play Color",
        "type": "color",
        "default": "var(--fnd-color-text-primary)"
      },
      {
        "id": "nc-testimonial-video-play-box-shadow",
        "label": "Video Play Box Shadow",
        "type": "shadow",
        "default": "0 4px 16px rgba(0, 0, 0, .25)"
      },
      {
        "id": "nc-testimonial-context-gap",
        "label": "Context Gap",
        "type": "spacing",
        "default": "0.25rem 0.5rem"
      },
      {
        "id": "nc-testimonial-context-item-before-opacity",
        "label": "Context Item Before Opacity",
        "type": "opacity",
        "default": "0.6"
      }
    ]
  },
  {
    "id": "story-gallery",
    "label": "Story Gallery",
    "icon": "components",
    "subgroups": [
      {
        "id": "alle",
        "label": "Alle Tokens",
        "tokenIds": [
          "nc-story-gallery-paddle-disabled-opacity",
          "nc-story-gallery-cursor-paddle-is-visible-opacity"
        ]
      },
      {
        "id": "geometry",
        "label": "Geometrie",
        "tokenIds": [
          "nc-story-gallery-card-height",
          "nc-story-gallery-gap",
          "nc-story-gallery-radius",
          "nc-story-gallery-title-size",
          "nc-story-gallery-desc-size",
          "nc-story-gallery-paddle-size",
          "nc-story-gallery-headline-size"
        ]
      },
      {
        "id": "typography",
        "label": "Typografie",
        "tokenIds": [
          "nc-story-gallery-title-weight"
        ]
      },
      {
        "id": "colors",
        "label": "Farben",
        "category": "main",
        "tokenIds": [
          "nc-story-gallery-title-color",
          "nc-story-gallery-desc-color",
          "nc-story-gallery-paddle-bg",
          "nc-story-gallery-paddle-shadow"
        ]
      }
    ],
    "tokens": [
      {
        "id": "nc-story-gallery-paddle-disabled-opacity",
        "label": "Paddle Disabled Opacity",
        "type": "opacity",
        "default": "0.3"
      },
      {
        "id": "nc-story-gallery-cursor-paddle-is-visible-opacity",
        "label": "Cursor Paddle Is Visible Opacity",
        "type": "opacity",
        "default": "1"
      },
      {
        "id": "nc-story-gallery-card-height",
        "label": "Card Height",
        "type": "size",
        "default": "420px"
      },
      {
        "id": "nc-story-gallery-gap",
        "label": "Gap",
        "type": "spacing",
        "default": "var(--fnd-spacing-05)"
      },
      {
        "id": "nc-story-gallery-radius",
        "label": "Radius",
        "type": "radius",
        "default": "var(--fnd-radius-lg)"
      },
      {
        "id": "nc-story-gallery-title-size",
        "label": "Title Size",
        "type": "size",
        "default": "var(--fs-lg)"
      },
      {
        "id": "nc-story-gallery-title-weight",
        "label": "Title Weight",
        "type": "fontWeight",
        "default": "var(--fnd-font-weight-bold)"
      },
      {
        "id": "nc-story-gallery-title-color",
        "label": "Title Color",
        "type": "color",
        "ref": "text-primary"
      },
      {
        "id": "nc-story-gallery-desc-size",
        "label": "Desc Size",
        "type": "size",
        "default": "var(--fs-sm)"
      },
      {
        "id": "nc-story-gallery-desc-color",
        "label": "Desc Color",
        "type": "color",
        "ref": "text-secondary"
      },
      {
        "id": "nc-story-gallery-paddle-size",
        "label": "Paddle Size",
        "type": "size",
        "default": "44px"
      },
      {
        "id": "nc-story-gallery-paddle-bg",
        "label": "Paddle BG",
        "type": "color",
        "ref": "background-base"
      },
      {
        "id": "nc-story-gallery-paddle-shadow",
        "label": "Paddle Shadow",
        "type": "color",
        "default": "var(--fnd-shadow-md)"
      },
      {
        "id": "nc-story-gallery-headline-size",
        "label": "Headline Size",
        "type": "size",
        "default": "var(--fs-2xl)"
      }
    ]
  },
  {
    "id": "fade-gallery",
    "label": "Fade Gallery",
    "icon": "components",
    "subgroups": [
      {
        "id": "alle",
        "label": "Alle Tokens",
        "tokenIds": [
          "nc-fade-gallery-media-is-active-opacity",
          "nc-fade-gallery-tab-aria-selected-true-after-border-radius",
          "nc-fade-gallery-desc-is-visible-opacity"
        ]
      },
      {
        "id": "geometry",
        "label": "Geometrie",
        "tokenIds": [
          "nc-fade-gallery-radius",
          "nc-fade-gallery-tab-size",
          "nc-fade-gallery-desc-size",
          "nc-fade-gallery-headline-size"
        ]
      },
      {
        "id": "typography",
        "label": "Typografie",
        "tokenIds": [
          "nc-fade-gallery-tab-weight"
        ]
      },
      {
        "id": "colors",
        "label": "Farben",
        "category": "main",
        "tokenIds": [
          "nc-fade-gallery-tab-color",
          "nc-fade-gallery-desc-color"
        ]
      },
      {
        "id": "interaction",
        "label": "Bewegung & Zustand",
        "category": "state",
        "tokenIds": [
          "nc-fade-gallery-fade-duration"
        ]
      },
      {
        "id": "other",
        "label": "Weitere",
        "tokenIds": [
          "nc-fade-gallery-tab-active",
          "nc-fade-gallery-tab-indicator"
        ]
      }
    ],
    "tokens": [
      {
        "id": "nc-fade-gallery-media-is-active-opacity",
        "label": "Media Is Active Opacity",
        "type": "opacity",
        "default": "1"
      },
      {
        "id": "nc-fade-gallery-tab-aria-selected-true-after-border-radius",
        "label": "Tab Aria Selected True After Border Radius",
        "type": "radius",
        "default": "var(--fnd-radius-null)"
      },
      {
        "id": "nc-fade-gallery-desc-is-visible-opacity",
        "label": "Desc Is Visible Opacity",
        "type": "opacity",
        "default": "1"
      },
      {
        "id": "nc-fade-gallery-radius",
        "label": "Radius",
        "type": "radius",
        "default": "var(--fnd-radius-lg)"
      },
      {
        "id": "nc-fade-gallery-tab-size",
        "label": "Tab Size",
        "type": "size",
        "default": "var(--fs-base)"
      },
      {
        "id": "nc-fade-gallery-tab-weight",
        "label": "Tab Weight",
        "type": "fontWeight",
        "default": "var(--fnd-font-weight-medium)"
      },
      {
        "id": "nc-fade-gallery-tab-color",
        "label": "Tab Color",
        "type": "color",
        "ref": "text-secondary"
      },
      {
        "id": "nc-fade-gallery-tab-active",
        "label": "Tab Active",
        "type": "color",
        "ref": "text-primary"
      },
      {
        "id": "nc-fade-gallery-tab-indicator",
        "label": "Tab Indicator",
        "type": "color",
        "ref": "interactive-default"
      },
      {
        "id": "nc-fade-gallery-desc-size",
        "label": "Desc Size",
        "type": "size",
        "default": "var(--fs-base)"
      },
      {
        "id": "nc-fade-gallery-desc-color",
        "label": "Desc Color",
        "type": "color",
        "ref": "text-secondary"
      },
      {
        "id": "nc-fade-gallery-fade-duration",
        "label": "Fade Duration",
        "type": "duration",
        "default": "0.5s"
      },
      {
        "id": "nc-fade-gallery-headline-size",
        "label": "Headline Size",
        "type": "size",
        "default": "var(--fs-2xl)"
      }
    ]
  },
  {
    "id": "searchbar",
    "label": "Searchbar",
    "icon": "components",
    "subgroups": [
      {
        "id": "alle",
        "label": "Alle Tokens",
        "tokenIds": [
          "nc-searchbar-input-padding-left",
          "nc-searchbar-input-padding-right",
          "nc-searchbar-shortcut-font-size",
          "nc-searchbar-shortcut-padding",
          "nc-searchbar-close-background"
        ]
      }
    ],
    "tokens": [
      {
        "id": "nc-searchbar-input-padding-left",
        "label": "Input Padding Left",
        "type": "spacing",
        "default": "40px"
      },
      {
        "id": "nc-searchbar-input-padding-right",
        "label": "Input Padding Right",
        "type": "spacing",
        "default": "80px"
      },
      {
        "id": "nc-searchbar-shortcut-font-size",
        "label": "Shortcut Font Size",
        "type": "size",
        "default": "11px"
      },
      {
        "id": "nc-searchbar-shortcut-padding",
        "label": "Shortcut Padding",
        "type": "spacing",
        "default": "2px 6px"
      },
      {
        "id": "nc-searchbar-close-background",
        "label": "Close Background",
        "type": "color",
        "default": "transparent"
      }
    ]
  },
  {
    "id": "news",
    "label": "News",
    "icon": "components",
    "subgroups": [
      {
        "id": "alle",
        "label": "Alle Tokens",
        "tokenIds": [
          "nc-news-hero-overlay-background",
          "nc-news-eyebrow-gap",
          "nc-news-title-font-weight",
          "nc-news-title-font-size",
          "nc-news-title-line-height",
          "nc-news-lead-font-size",
          "nc-news-lead-line-height",
          "nc-news-footer-a-font-weight"
        ]
      }
    ],
    "tokens": [
      {
        "id": "nc-news-hero-overlay-background",
        "label": "Hero Overlay Background",
        "type": "color",
        "default": "linear-gradient(180deg,\n    color-mix(in srgb, #000 55%, transparent) 0%,\n    color-mix(in srgb, #000 22%, transparent) 45%,\n    color-mix(in srgb, #000 62%, transparent) 100%)"
      },
      {
        "id": "nc-news-eyebrow-gap",
        "label": "Eyebrow Gap",
        "type": "spacing",
        "default": ".4rem 1.25rem"
      },
      {
        "id": "nc-news-title-font-weight",
        "label": "Title Font Weight",
        "type": "weight",
        "default": "var(--fnd-font-weight-bold)"
      },
      {
        "id": "nc-news-title-font-size",
        "label": "Title Font Size",
        "type": "size",
        "default": "clamp(2rem, 1.2rem + 3vw, 3.4rem)"
      },
      {
        "id": "nc-news-title-line-height",
        "label": "Title Line Height",
        "type": "size",
        "default": "1.08"
      },
      {
        "id": "nc-news-lead-font-size",
        "label": "Lead Font Size",
        "type": "size",
        "default": "clamp(1.05rem, 1rem + .4vw, 1.35rem)"
      },
      {
        "id": "nc-news-lead-line-height",
        "label": "Lead Line Height",
        "type": "size",
        "default": "1.55"
      },
      {
        "id": "nc-news-footer-a-font-weight",
        "label": "Footer A Font Weight",
        "type": "weight",
        "default": "var(--fnd-font-weight-semibold)"
      }
    ]
  },
  {
    "id": "events",
    "label": "Events",
    "icon": "components",
    "subgroups": [
      {
        "id": "alle",
        "label": "Alle Tokens",
        "tokenIds": [
          "nc-events-card-type-letter-spacing",
          "nc-events-card-title-line-height",
          "nc-events-card-meta-item-gap"
        ]
      }
    ],
    "tokens": [
      {
        "id": "nc-events-card-type-letter-spacing",
        "label": "Card Type Letter Spacing",
        "type": "size",
        "default": "0.04em"
      },
      {
        "id": "nc-events-card-title-line-height",
        "label": "Card Title Line Height",
        "type": "size",
        "default": "1.3"
      },
      {
        "id": "nc-events-card-meta-item-gap",
        "label": "Card Meta Item Gap",
        "type": "spacing",
        "default": "var(--fnd-spacing-01)"
      }
    ]
  },
  {
    "id": "event",
    "label": "Event",
    "icon": "components",
    "subgroups": [
      {
        "id": "alle",
        "label": "Alle Tokens",
        "tokenIds": [
          "nc-event-tag-padding",
          "nc-event-tag-letter-spacing",
          "nc-event-title-line-height"
        ]
      }
    ],
    "tokens": [
      {
        "id": "nc-event-tag-padding",
        "label": "Tag Padding",
        "type": "spacing",
        "default": "2px 10px"
      },
      {
        "id": "nc-event-tag-letter-spacing",
        "label": "Tag Letter Spacing",
        "type": "size",
        "default": "0.04em"
      },
      {
        "id": "nc-event-title-line-height",
        "label": "Title Line Height",
        "type": "size",
        "default": "1.1"
      }
    ]
  },
  {
    "id": "mobile-drawer",
    "label": "Mobile Drawer",
    "icon": "components",
    "subgroups": [
      {
        "id": "alle",
        "label": "Alle Tokens",
        "tokenIds": [
          "nc-mobile-drawer-root-box-shadow",
          "nc-mobile-drawer-close-background",
          "nc-mobile-drawer-backdrop-visible-opacity"
        ]
      }
    ],
    "tokens": [
      {
        "id": "nc-mobile-drawer-root-box-shadow",
        "label": "Root Box Shadow",
        "type": "shadow",
        "default": "-4px 0 20px rgba(0,0,0,0.1)"
      },
      {
        "id": "nc-mobile-drawer-close-background",
        "label": "Close Background",
        "type": "color",
        "default": "transparent"
      },
      {
        "id": "nc-mobile-drawer-backdrop-visible-opacity",
        "label": "Backdrop Visible Opacity",
        "type": "opacity",
        "default": "1"
      }
    ]
  },
  {
    "id": "testimonial-grid",
    "label": "Testimonial Grid",
    "icon": "components",
    "subgroups": [
      {
        "id": "alle",
        "label": "Alle Tokens",
        "tokenIds": [
          "nc-testimonial-grid-btn-border-radius",
          "nc-testimonial-grid-btn-disabled-opacity"
        ]
      }
    ],
    "tokens": [
      {
        "id": "nc-testimonial-grid-btn-border-radius",
        "label": "Btn Border Radius",
        "type": "radius",
        "default": "var(--fnd-radius-full)"
      },
      {
        "id": "nc-testimonial-grid-btn-disabled-opacity",
        "label": "Btn Disabled Opacity",
        "type": "opacity",
        "default": "0.4"
      }
    ]
  },
  {
    "id": "multiselect",
    "label": "Multiselect",
    "icon": "components",
    "subgroups": [
      {
        "id": "alle",
        "label": "Alle Tokens",
        "tokenIds": [
          "nc-multiselect-trigger-gap",
          "nc-multiselect-trigger-padding",
          "nc-multiselect-trigger-font-size",
          "nc-multiselect-panel-gap",
          "nc-multiselect-panel-padding",
          "nc-multiselect-panel-box-shadow",
          "nc-multiselect-option-padding"
        ]
      }
    ],
    "tokens": [
      {
        "id": "nc-multiselect-trigger-gap",
        "label": "Trigger Gap",
        "type": "spacing",
        "default": "var(--fnd-spacing-02)"
      },
      {
        "id": "nc-multiselect-trigger-padding",
        "label": "Trigger Padding",
        "type": "spacing",
        "default": "0.5rem 0.85rem"
      },
      {
        "id": "nc-multiselect-trigger-font-size",
        "label": "Trigger Font Size",
        "type": "size",
        "default": "1rem"
      },
      {
        "id": "nc-multiselect-panel-gap",
        "label": "Panel Gap",
        "type": "spacing",
        "default": "0.1rem"
      },
      {
        "id": "nc-multiselect-panel-padding",
        "label": "Panel Padding",
        "type": "spacing",
        "default": "var(--fnd-spacing-02)"
      },
      {
        "id": "nc-multiselect-panel-box-shadow",
        "label": "Panel Box Shadow",
        "type": "shadow",
        "default": "0 12px 32px rgba(0, 0, 0, .14)"
      },
      {
        "id": "nc-multiselect-option-padding",
        "label": "Option Padding",
        "type": "spacing",
        "default": "var(--fnd-spacing-02)"
      }
    ]
  },
  {
    "id": "tbl-cell",
    "label": "Tbl Cell",
    "icon": "components",
    "subgroups": [
      {
        "id": "alle",
        "label": "Alle Tokens",
        "tokenIds": [
          "nc-tbl-cell-sub-line-height",
          "nc-tbl-cell-info-btn-padding",
          "nc-tbl-cell-info-btn-hover-opacity"
        ]
      }
    ],
    "tokens": [
      {
        "id": "nc-tbl-cell-sub-line-height",
        "label": "Sub Line Height",
        "type": "size",
        "default": "1.3"
      },
      {
        "id": "nc-tbl-cell-info-btn-padding",
        "label": "Info Btn Padding",
        "type": "spacing",
        "default": "2px"
      },
      {
        "id": "nc-tbl-cell-info-btn-hover-opacity",
        "label": "Info Btn Hover Opacity",
        "type": "opacity",
        "default": "1"
      }
    ]
  },
  {
    "id": "table-info-modal",
    "label": "Table Info Modal",
    "icon": "components",
    "subgroups": [
      {
        "id": "alle",
        "label": "Alle Tokens",
        "tokenIds": [
          "nc-table-info-modal-is-open-opacity"
        ]
      }
    ],
    "tokens": [
      {
        "id": "nc-table-info-modal-is-open-opacity",
        "label": "Is Open Opacity",
        "type": "opacity",
        "default": "1"
      }
    ]
  },
  {
    "id": "feature-list",
    "label": "Feature List",
    "icon": "components",
    "subgroups": [
      {
        "id": "alle",
        "label": "Alle Tokens",
        "tokenIds": [
          "nc-feature-list-icon-margin-top"
        ]
      }
    ],
    "tokens": [
      {
        "id": "nc-feature-list-icon-margin-top",
        "label": "Icon Margin Top",
        "type": "spacing",
        "default": ".1em"
      }
    ]
  },
  {
    "id": "form-block",
    "label": "Form Block",
    "icon": "components",
    "subgroups": [
      {
        "id": "alle",
        "label": "Alle Tokens",
        "tokenIds": [
          "nc-form-block-nc-input-font-size",
          "nc-form-block-error-margin",
          "nc-form-block-error-padding",
          "nc-form-block-success-gap",
          "nc-form-block-success-icon-border-radius",
          "nc-form-block-success-icon-color",
          "nc-form-block-success-icon-font-size",
          "nc-form-block-success-text-margin",
          "nc-form-block-submit-is-loading-opacity"
        ]
      }
    ],
    "tokens": [
      {
        "id": "nc-form-block-nc-input-font-size",
        "label": "Nc Input Font Size",
        "type": "size",
        "default": "1rem"
      },
      {
        "id": "nc-form-block-error-margin",
        "label": "Error Margin",
        "type": "spacing",
        "default": "0 0 0.75rem"
      },
      {
        "id": "nc-form-block-error-padding",
        "label": "Error Padding",
        "type": "spacing",
        "default": "0.6rem 0.8rem"
      },
      {
        "id": "nc-form-block-success-gap",
        "label": "Success Gap",
        "type": "spacing",
        "default": "var(--fnd-spacing-03)"
      },
      {
        "id": "nc-form-block-success-icon-border-radius",
        "label": "Success Icon Border Radius",
        "type": "radius",
        "default": "var(--fnd-radius-full)"
      },
      {
        "id": "nc-form-block-success-icon-color",
        "label": "Success Icon Color",
        "type": "color",
        "default": "#fff"
      },
      {
        "id": "nc-form-block-success-icon-font-size",
        "label": "Success Icon Font Size",
        "type": "size",
        "default": "1rem"
      },
      {
        "id": "nc-form-block-success-text-margin",
        "label": "Success Text Margin",
        "type": "spacing",
        "default": "0.2rem 0 0"
      },
      {
        "id": "nc-form-block-submit-is-loading-opacity",
        "label": "Submit Is Loading Opacity",
        "type": "opacity",
        "default": "0.7"
      }
    ]
  },
  {
    "id": "compare-table",
    "label": "Compare Table",
    "icon": "components",
    "subgroups": [
      {
        "id": "alle",
        "label": "Alle Tokens",
        "tokenIds": [
          "nc-compare-table-sticky-col-th-first-child-after-background"
        ]
      }
    ],
    "tokens": [
      {
        "id": "nc-compare-table-sticky-col-th-first-child-after-background",
        "label": "Sticky Col Th First Child After Background",
        "type": "color",
        "default": "linear-gradient(to right, rgba(0,0,0,0.06), transparent)"
      }
    ]
  },
  {
    "id": "text-media",
    "label": "Text Media",
    "icon": "components",
    "subgroups": [
      {
        "id": "alle",
        "label": "Alle Tokens",
        "tokenIds": [
          "nc-text-media-nc-video-padding-bottom"
        ]
      },
      {
        "id": "geometry",
        "label": "Geometrie",
        "tokenIds": [
          "nc-text-media-gap",
          "nc-text-media-headline-size",
          "nc-text-media-content-gap",
          "nc-text-media-video-radius"
        ]
      },
      {
        "id": "colors",
        "label": "Farben",
        "category": "main",
        "tokenIds": [
          "nc-text-media-subline-color"
        ]
      }
    ],
    "tokens": [
      {
        "id": "nc-text-media-nc-video-padding-bottom",
        "label": "Nc Video Padding Bottom",
        "type": "spacing",
        "default": "56.25%"
      },
      {
        "id": "nc-text-media-gap",
        "label": "Gap",
        "type": "spacing",
        "default": "var(--fnd-spacing-08)"
      },
      {
        "id": "nc-text-media-headline-size",
        "label": "Headline Size",
        "type": "size",
        "default": "var(--fs-2xl)"
      },
      {
        "id": "nc-text-media-subline-color",
        "label": "Subline Color",
        "type": "color",
        "ref": "text-secondary"
      },
      {
        "id": "nc-text-media-content-gap",
        "label": "Content Gap",
        "type": "spacing",
        "default": "var(--fnd-spacing-04)"
      },
      {
        "id": "nc-text-media-video-radius",
        "label": "Video Radius",
        "type": "radius",
        "default": "var(--fnd-radius-md)"
      }
    ]
  },
  {
    "id": "table-block",
    "label": "Table Block",
    "icon": "components",
    "subgroups": [
      {
        "id": "alle",
        "label": "Alle Tokens",
        "tokenIds": [
          "nc-table-block-thead-th-letter-spacing",
          "nc-table-block-is-scrolled-nc-compare-table-sticky-col-th-first-child-after-opacity"
        ]
      }
    ],
    "tokens": [
      {
        "id": "nc-table-block-thead-th-letter-spacing",
        "label": "Thead Th Letter Spacing",
        "type": "size",
        "default": "var(--nc-mono-tracking-code)"
      },
      {
        "id": "nc-table-block-is-scrolled-nc-compare-table-sticky-col-th-first-child-after-opacity",
        "label": "Is Scrolled Nc Compare Table Sticky Col Th First Child After Opacity",
        "type": "opacity",
        "default": "1"
      }
    ]
  },
  {
    "id": "tab-nav",
    "label": "Tab Nav",
    "icon": "components",
    "subgroups": [
      {
        "id": "alle",
        "label": "Alle Tokens",
        "tokenIds": [
          "nc-tab-nav-badges-gap",
          "nc-tab-nav-badges-margin-block"
        ]
      }
    ],
    "tokens": [
      {
        "id": "nc-tab-nav-badges-gap",
        "label": "Badges Gap",
        "type": "spacing",
        "default": "var(--fnd-spacing-02)"
      },
      {
        "id": "nc-tab-nav-badges-margin-block",
        "label": "Badges Margin Block",
        "type": "spacing",
        "default": ".25rem .7rem"
      }
    ]
  },
  {
    "id": "aspect-ratio",
    "label": "Aspect Ratio",
    "icon": "components",
    "subgroups": [
      {
        "id": "other",
        "label": "Weitere",
        "tokenIds": [
          "nc-aspect-ratio-ratio"
        ]
      }
    ],
    "tokens": [
      {
        "id": "nc-aspect-ratio-ratio",
        "label": "Ratio",
        "type": "generic",
        "default": "var(--fnd-media-ratio-16-9)"
      }
    ]
  },
  {
    "id": "badge-row",
    "label": "Badge Row",
    "icon": "components",
    "subgroups": [
      {
        "id": "geometry",
        "label": "Geometrie",
        "tokenIds": [
          "nc-badge-row-gap",
          "nc-badge-row-hero-size",
          "nc-badge-row-hero-pad-x",
          "nc-badge-row-hero-pad-y",
          "nc-badge-row-hero-family",
          "nc-badge-row-hero-tracking"
        ]
      },
      {
        "id": "colors",
        "label": "Farben",
        "category": "main",
        "tokenIds": [
          "nc-badge-row-hero-bg",
          "nc-badge-row-hero-color",
          "nc-badge-row-hero-border",
          "nc-badge-row-hero-on-dark-bg",
          "nc-badge-row-hero-on-dark-color",
          "nc-badge-row-hero-on-dark-border",
          "nc-badge-row-hero-on-light-bg",
          "nc-badge-row-hero-on-light-color",
          "nc-badge-row-hero-on-light-border"
        ]
      },
      {
        "id": "other",
        "label": "Weitere",
        "tokenIds": [
          "nc-badge-row-hero-spacing"
        ]
      }
    ],
    "tokens": [
      {
        "id": "nc-badge-row-gap",
        "label": "Gap",
        "type": "spacing",
        "default": "var(--fnd-spacing-02)"
      },
      {
        "id": "nc-badge-row-hero-bg",
        "label": "Hero BG",
        "type": "color",
        "default": "color-mix(in srgb, var(--fnd-color-always-light) 18%, transparent)"
      },
      {
        "id": "nc-badge-row-hero-color",
        "label": "Hero Color",
        "type": "color",
        "default": "var(--fnd-color-always-light)"
      },
      {
        "id": "nc-badge-row-hero-border",
        "label": "Hero Border",
        "type": "color",
        "default": "color-mix(in srgb, var(--fnd-color-always-light) 32%, transparent)"
      },
      {
        "id": "nc-badge-row-hero-spacing",
        "label": "Hero Spacing",
        "type": "spacing",
        "default": "var(--fnd-spacing-04)"
      },
      {
        "id": "nc-badge-row-hero-on-dark-bg",
        "label": "Hero dunkel — Schleier",
        "type": "color",
        "default": "color-mix(in srgb, var(--fnd-color-always-light) 18%, transparent)"
      },
      {
        "id": "nc-badge-row-hero-on-dark-color",
        "label": "Hero dunkel — Schrift",
        "type": "color",
        "default": "var(--fnd-color-always-light)"
      },
      {
        "id": "nc-badge-row-hero-on-dark-border",
        "label": "Hero dunkel — Kante",
        "type": "color",
        "default": "color-mix(in srgb, var(--fnd-color-always-light) 32%, transparent)"
      },
      {
        "id": "nc-badge-row-hero-on-light-bg",
        "label": "Hero hell — Schleier",
        "type": "color",
        "default": "color-mix(in srgb, var(--fnd-color-always-dark) 10%, transparent)"
      },
      {
        "id": "nc-badge-row-hero-on-light-color",
        "label": "Hero hell — Schrift",
        "type": "color",
        "default": "var(--fnd-neutral-950)"
      },
      {
        "id": "nc-badge-row-hero-on-light-border",
        "label": "Hero hell — Kante",
        "type": "color",
        "default": "color-mix(in srgb, var(--fnd-color-always-dark) 24%, transparent)"
      },
      {
        "id": "nc-badge-row-hero-size",
        "label": "Hero-Badge — Größe (fluid)",
        "type": "size",
        "default": "clamp(0.75rem, calc(0.75rem + (1rem - 0.75rem) * var(--fluid-bp)), 1rem)"
      },
      {
        "id": "nc-badge-row-hero-pad-x",
        "label": "Hero-Badge — Polsterung X",
        "type": "size",
        "default": "clamp(8px, calc(8px + (16px - 8px) * var(--fluid-bp)), 16px)"
      },
      {
        "id": "nc-badge-row-hero-pad-y",
        "label": "Hero-Badge — Polsterung Y",
        "type": "size",
        "default": "clamp(3px, calc(3px + (7px - 3px) * var(--fluid-bp)), 7px)"
      },
      {
        "id": "nc-badge-row-hero-family",
        "label": "Hero-Badge — Schriftfamilie",
        "type": "size",
        "default": "var(--font-mono)"
      },
      {
        "id": "nc-badge-row-hero-tracking",
        "label": "Hero-Badge — Laufweite",
        "type": "size",
        "default": "0.01em"
      }
    ]
  },
  {
    "id": "card-grid",
    "label": "Card Grid",
    "icon": "components",
    "subgroups": [
      {
        "id": "geometry",
        "label": "Geometrie",
        "tokenIds": [
          "nc-card-grid-gap",
          "nc-card-grid-title-size",
          "nc-card-grid-title-margin"
        ]
      },
      {
        "id": "interaction",
        "label": "Bewegung & Zustand",
        "category": "state",
        "tokenIds": [
          "nc-card-grid-anim-duration",
          "nc-card-grid-anim-delay",
          "nc-card-grid-anim-translate-y"
        ]
      },
      {
        "id": "other",
        "label": "Weitere",
        "tokenIds": [
          "nc-card-grid-columns"
        ]
      }
    ],
    "tokens": [
      {
        "id": "nc-card-grid-columns",
        "label": "Columns",
        "type": "size",
        "default": "repeat(auto-fill, minmax(300px, 1fr))"
      },
      {
        "id": "nc-card-grid-gap",
        "label": "Gap",
        "type": "spacing",
        "default": "var(--fnd-spacing-06)"
      },
      {
        "id": "nc-card-grid-title-size",
        "label": "Title Size",
        "type": "size",
        "default": "var(--fs-2xl)"
      },
      {
        "id": "nc-card-grid-title-margin",
        "label": "Title Margin",
        "type": "spacing",
        "default": "var(--fnd-spacing-06)"
      },
      {
        "id": "nc-card-grid-anim-duration",
        "label": "Anim Duration",
        "type": "duration",
        "default": "0.5s"
      },
      {
        "id": "nc-card-grid-anim-delay",
        "label": "Anim Delay",
        "type": "duration",
        "default": "0.1s"
      },
      {
        "id": "nc-card-grid-anim-translate-y",
        "label": "Anim Translate Y",
        "type": "size",
        "default": "2rem"
      }
    ]
  },
  {
    "id": "card-grid-cta",
    "label": "Card Grid Cta",
    "icon": "components",
    "subgroups": [
      {
        "id": "geometry",
        "label": "Geometrie",
        "tokenIds": [
          "nc-card-grid-cta-gap",
          "nc-card-grid-cta-padding",
          "nc-card-grid-cta-radius",
          "nc-card-grid-cta-title-size"
        ]
      },
      {
        "id": "typography",
        "label": "Typografie",
        "tokenIds": [
          "nc-card-grid-cta-title-weight"
        ]
      },
      {
        "id": "colors",
        "label": "Farben",
        "category": "main",
        "tokenIds": [
          "nc-card-grid-cta-title-color",
          "nc-card-grid-cta-overlay-start",
          "nc-card-grid-cta-overlay-end"
        ]
      },
      {
        "id": "interaction",
        "label": "Bewegung & Zustand",
        "category": "state",
        "tokenIds": [
          "nc-card-grid-cta-hover-scale"
        ]
      },
      {
        "id": "other",
        "label": "Weitere",
        "tokenIds": [
          "nc-card-grid-cta-columns"
        ]
      }
    ],
    "tokens": [
      {
        "id": "nc-card-grid-cta-columns",
        "label": "Columns",
        "type": "generic",
        "default": "3"
      },
      {
        "id": "nc-card-grid-cta-gap",
        "label": "Gap",
        "type": "spacing",
        "default": "var(--fnd-spacing-04)"
      },
      {
        "id": "nc-card-grid-cta-padding",
        "label": "Padding",
        "type": "spacing",
        "default": "var(--fnd-spacing-06)"
      },
      {
        "id": "nc-card-grid-cta-radius",
        "label": "Radius",
        "type": "radius",
        "default": "var(--fnd-radius-md)"
      },
      {
        "id": "nc-card-grid-cta-title-size",
        "label": "Title Size",
        "type": "size",
        "default": "var(--fs-2xl)"
      },
      {
        "id": "nc-card-grid-cta-title-weight",
        "label": "Title Weight",
        "type": "fontWeight",
        "default": "var(--fnd-font-weight-bold)"
      },
      {
        "id": "nc-card-grid-cta-title-color",
        "label": "Title Color",
        "type": "color",
        "default": "var(--fnd-color-always-light)"
      },
      {
        "id": "nc-card-grid-cta-overlay-start",
        "label": "Overlay Start",
        "type": "color",
        "default": "rgba(0, 0, 0, 0.6)"
      },
      {
        "id": "nc-card-grid-cta-overlay-end",
        "label": "Overlay End",
        "type": "color",
        "default": "transparent"
      },
      {
        "id": "nc-card-grid-cta-hover-scale",
        "label": "Hover Scale",
        "type": "generic",
        "default": "1.03"
      }
    ]
  },
  {
    "id": "content",
    "label": "Content",
    "icon": "components",
    "subgroups": [
      {
        "id": "geometry",
        "label": "Geometrie",
        "tokenIds": [
          "nc-content-grid-gap",
          "nc-content-grid-gap-md",
          "nc-content-grid-gap-lg"
        ]
      }
    ],
    "tokens": [
      {
        "id": "nc-content-grid-gap",
        "label": "Grid Gap",
        "type": "spacing",
        "default": "var(--fnd-spacing-06)"
      },
      {
        "id": "nc-content-grid-gap-md",
        "label": "Grid Gap MD",
        "type": "spacing",
        "default": "var(--fnd-spacing-07)"
      },
      {
        "id": "nc-content-grid-gap-lg",
        "label": "Grid Gap LG",
        "type": "spacing",
        "default": "var(--fnd-spacing-10)"
      }
    ]
  },
  {
    "id": "drawer",
    "label": "Drawer",
    "icon": "components",
    "subgroups": [
      {
        "id": "geometry",
        "label": "Geometrie",
        "tokenIds": [
          "nc-drawer-max-width",
          "nc-drawer-max-height",
          "nc-drawer-width",
          "nc-drawer-side-width",
          "nc-drawer-padding",
          "nc-drawer-radius",
          "nc-drawer-header-gap",
          "nc-drawer-section-gap",
          "nc-drawer-footer-gap",
          "nc-drawer-handle-width",
          "nc-drawer-handle-height",
          "nc-drawer-handle-radius",
          "nc-drawer-close-size",
          "nc-drawer-close-radius",
          "nc-drawer-close-icon-size",
          "nc-drawer-close-offset"
        ]
      },
      {
        "id": "typography",
        "label": "Typografie",
        "tokenIds": [
          "nc-drawer-title-font-size",
          "nc-drawer-title-font-weight",
          "nc-drawer-desc-font-size"
        ]
      },
      {
        "id": "colors",
        "label": "Farben",
        "category": "main",
        "tokenIds": [
          "nc-drawer-bg",
          "nc-drawer-shadow",
          "nc-drawer-overlay-bg",
          "nc-drawer-title-color",
          "nc-drawer-desc-color",
          "nc-drawer-header-border-color",
          "nc-drawer-footer-border-color",
          "nc-drawer-handle-bg",
          "nc-drawer-close-bg",
          "nc-drawer-close-bg-hover"
        ]
      },
      {
        "id": "interaction",
        "label": "Bewegung & Zustand",
        "category": "state",
        "tokenIds": [
          "nc-drawer-duration",
          "nc-drawer-ease"
        ]
      }
    ],
    "tokens": [
      {
        "id": "nc-drawer-max-width",
        "label": "Max Width",
        "type": "size",
        "default": "100%"
      },
      {
        "id": "nc-drawer-max-height",
        "label": "Max Height",
        "type": "size",
        "default": "85vh"
      },
      {
        "id": "nc-drawer-width",
        "label": "Width",
        "type": "size",
        "default": "100%"
      },
      {
        "id": "nc-drawer-side-width",
        "label": "Side Width",
        "type": "size",
        "default": "380px"
      },
      {
        "id": "nc-drawer-padding",
        "label": "Padding",
        "type": "spacing",
        "default": "var(--fnd-spacing-06)"
      },
      {
        "id": "nc-drawer-radius",
        "label": "Radius",
        "type": "radius",
        "default": "var(--fnd-radius-4xl)"
      },
      {
        "id": "nc-drawer-bg",
        "label": "BG",
        "type": "color",
        "default": "var(--nc-dialog-bg, var(--fnd-color-surface-elevated))"
      },
      {
        "id": "nc-drawer-shadow",
        "label": "Shadow",
        "type": "color",
        "default": "var(--fnd-elevation-modal)"
      },
      {
        "id": "nc-drawer-overlay-bg",
        "label": "Overlay BG",
        "type": "color",
        "default": "var(--nc-dialog-overlay-bg, var(--fnd-color-background-overlay))"
      },
      {
        "id": "nc-drawer-title-font-size",
        "label": "Title Font Size",
        "type": "size",
        "default": "var(--nc-dialog-title-font-size, var(--fnd-typography-heading-m-font-size))"
      },
      {
        "id": "nc-drawer-title-font-weight",
        "label": "Title Font Weight",
        "type": "fontWeight",
        "default": "var(--nc-dialog-title-font-weight, var(--fnd-font-weight-semibold))"
      },
      {
        "id": "nc-drawer-title-color",
        "label": "Title Color",
        "type": "color",
        "default": "var(--nc-dialog-title-color, var(--fnd-color-text-primary))"
      },
      {
        "id": "nc-drawer-desc-font-size",
        "label": "Desc Font Size",
        "type": "size",
        "default": "var(--nc-dialog-description-font-size, var(--fnd-typography-body-m-font-size))"
      },
      {
        "id": "nc-drawer-desc-color",
        "label": "Desc Color",
        "type": "color",
        "default": "var(--nc-dialog-description-color, var(--fnd-color-text-secondary))"
      },
      {
        "id": "nc-drawer-header-border-color",
        "label": "Header Border Color",
        "type": "color",
        "ref": "border-secondary"
      },
      {
        "id": "nc-drawer-header-gap",
        "label": "Header Gap",
        "type": "spacing",
        "default": "var(--nc-dialog-header-gap, var(--fnd-spacing-02))"
      },
      {
        "id": "nc-drawer-section-gap",
        "label": "Section Gap",
        "type": "spacing",
        "default": "var(--nc-dialog-section-gap, var(--fnd-spacing-06))"
      },
      {
        "id": "nc-drawer-footer-gap",
        "label": "Footer Gap",
        "type": "spacing",
        "default": "var(--nc-dialog-footer-gap, var(--fnd-spacing-03))"
      },
      {
        "id": "nc-drawer-footer-border-color",
        "label": "Footer Border Color",
        "type": "color",
        "ref": "border-secondary"
      },
      {
        "id": "nc-drawer-handle-width",
        "label": "Handle Width",
        "type": "size",
        "default": "32px"
      },
      {
        "id": "nc-drawer-handle-height",
        "label": "Handle Height",
        "type": "size",
        "default": "4px"
      },
      {
        "id": "nc-drawer-handle-radius",
        "label": "Handle Radius",
        "type": "radius",
        "default": "var(--fnd-radius-full)"
      },
      {
        "id": "nc-drawer-handle-bg",
        "label": "Handle BG",
        "type": "color",
        "ref": "border-primary"
      },
      {
        "id": "nc-drawer-close-size",
        "label": "Close Size",
        "type": "size",
        "default": "36px"
      },
      {
        "id": "nc-drawer-close-radius",
        "label": "Close Radius",
        "type": "radius",
        "default": "var(--fnd-radius-sm)"
      },
      {
        "id": "nc-drawer-close-bg",
        "label": "Close BG",
        "type": "color",
        "ref": "background-secondary"
      },
      {
        "id": "nc-drawer-close-bg-hover",
        "label": "Close BG Hover",
        "type": "color",
        "ref": "background-tertiary"
      },
      {
        "id": "nc-drawer-close-icon-size",
        "label": "Close Icon Size",
        "type": "size",
        "default": "18px"
      },
      {
        "id": "nc-drawer-close-offset",
        "label": "Close Offset",
        "type": "spacing",
        "default": "var(--fnd-spacing-04)"
      },
      {
        "id": "nc-drawer-duration",
        "label": "Duration",
        "type": "duration",
        "default": "var(--fnd-motion-duration-300)"
      },
      {
        "id": "nc-drawer-ease",
        "label": "Ease",
        "type": "generic",
        "default": "cubic-bezier(0.175, 0.885, 0.32, 1.275)"
      }
    ]
  },
  {
    "id": "form-actions",
    "label": "Form Actions",
    "icon": "components",
    "subgroups": [],
    "tokens": []
  },
  {
    "id": "form-section",
    "label": "Form Section",
    "icon": "components",
    "subgroups": [],
    "tokens": []
  },
  {
    "id": "gallery",
    "label": "Gallery",
    "icon": "components",
    "subgroups": [
      {
        "id": "geometry",
        "label": "Geometrie",
        "tokenIds": [
          "nc-gallery-height",
          "nc-gallery-min-height",
          "nc-gallery-max-height",
          "nc-gallery-padding-block",
          "nc-gallery-padding-inline",
          "nc-gallery-content-inset",
          "nc-gallery-content-max-width",
          "nc-gallery-content-gap",
          "nc-gallery-stage-max-width",
          "nc-gallery-media-max-width",
          "nc-gallery-media-radius",
          "nc-gallery-media-gap",
          "nc-gallery-media-padding-inline",
          "nc-gallery-media-padding-block",
          "nc-gallery-title-size",
          "nc-gallery-desc-size",
          "nc-gallery-desc-max-width",
          "nc-gallery-tag-size",
          "nc-gallery-tag-radius",
          "nc-gallery-tag-padding",
          "nc-gallery-logo-max-height",
          "nc-gallery-logo-max-width",
          "nc-gallery-dot-size",
          "nc-gallery-dot-gap",
          "nc-gallery-dot-radius",
          "nc-gallery-paddle-size",
          "nc-gallery-paddle-radius"
        ]
      },
      {
        "id": "typography",
        "label": "Typografie",
        "tokenIds": [
          "nc-gallery-content-align",
          "nc-gallery-title-weight",
          "nc-gallery-title-line-height",
          "nc-gallery-desc-line-height",
          "nc-gallery-tag-weight"
        ]
      },
      {
        "id": "colors",
        "label": "Farben",
        "category": "main",
        "tokenIds": [
          "nc-gallery-media-shadow",
          "nc-gallery-overlay-start",
          "nc-gallery-overlay-end",
          "nc-gallery-overlay-direction",
          "nc-gallery-title-color",
          "nc-gallery-desc-color",
          "nc-gallery-tag-bg",
          "nc-gallery-tag-color",
          "nc-gallery-dot-color",
          "nc-gallery-dot-color-active",
          "nc-gallery-paddle-bg",
          "nc-gallery-paddle-bg-hover",
          "nc-gallery-paddle-color",
          "nc-gallery-autoplay-progress-color"
        ]
      },
      {
        "id": "interaction",
        "label": "Bewegung & Zustand",
        "category": "state",
        "tokenIds": [
          "nc-gallery-animation-duration",
          "nc-gallery-animation-easing"
        ]
      },
      {
        "id": "other",
        "label": "Weitere",
        "tokenIds": [
          "nc-gallery-media-ratio",
          "nc-gallery-autoplay-interval"
        ]
      }
    ],
    "tokens": [
      {
        "id": "nc-gallery-height",
        "label": "Height",
        "type": "size",
        "default": "100dvh"
      },
      {
        "id": "nc-gallery-min-height",
        "label": "Min Height",
        "type": "size",
        "default": "400px"
      },
      {
        "id": "nc-gallery-max-height",
        "label": "Max Height",
        "type": "size",
        "default": "none"
      },
      {
        "id": "nc-gallery-padding-block",
        "label": "Padding Block",
        "type": "spacing",
        "default": "var(--fnd-spacing-10)"
      },
      {
        "id": "nc-gallery-padding-inline",
        "label": "Padding Inline",
        "type": "spacing",
        "default": "var(--fnd-spacing-08)"
      },
      {
        "id": "nc-gallery-content-inset",
        "label": "Content Inset",
        "type": "spacing",
        "default": "var(--fnd-spacing-12)"
      },
      {
        "id": "nc-gallery-content-max-width",
        "label": "Content Max Width",
        "type": "size",
        "default": "600px"
      },
      {
        "id": "nc-gallery-content-gap",
        "label": "Content Gap",
        "type": "spacing",
        "default": "var(--fnd-spacing-04)"
      },
      {
        "id": "nc-gallery-content-align",
        "label": "Content Align",
        "type": "size",
        "default": "flex-start"
      },
      {
        "id": "nc-gallery-stage-max-width",
        "label": "Stage Max Width",
        "type": "size",
        "default": "var(--nc-container-max-width)"
      },
      {
        "id": "nc-gallery-media-max-width",
        "label": "Media Max Width",
        "type": "size",
        "default": "50%"
      },
      {
        "id": "nc-gallery-media-ratio",
        "label": "Media Ratio",
        "type": "generic",
        "default": "var(--fnd-media-ratio-16-9)"
      },
      {
        "id": "nc-gallery-media-radius",
        "label": "Media Radius",
        "type": "radius",
        "default": "var(--fnd-radius-lg)"
      },
      {
        "id": "nc-gallery-media-shadow",
        "label": "Media Shadow",
        "type": "color",
        "default": "var(--fnd-shadow-lg)"
      },
      {
        "id": "nc-gallery-media-gap",
        "label": "Media Gap",
        "type": "spacing",
        "default": "var(--fnd-spacing-10)"
      },
      {
        "id": "nc-gallery-media-padding-inline",
        "label": "Media Padding Inline",
        "type": "size",
        "default": "var(--nc-gallery-content-inset)"
      },
      {
        "id": "nc-gallery-media-padding-block",
        "label": "Media Padding Block",
        "type": "size",
        "default": "var(--nc-gallery-content-inset)"
      },
      {
        "id": "nc-gallery-overlay-start",
        "label": "Overlay Start",
        "type": "color",
        "default": "rgba(0, 0, 0, 0.6)"
      },
      {
        "id": "nc-gallery-overlay-end",
        "label": "Overlay End",
        "type": "color",
        "default": "rgba(0, 0, 0, 0.1)"
      },
      {
        "id": "nc-gallery-overlay-direction",
        "label": "Overlay Direction",
        "type": "color",
        "default": "to right"
      },
      {
        "id": "nc-gallery-title-size",
        "label": "Title Size",
        "type": "size",
        "default": "var(--fs-4xl)"
      },
      {
        "id": "nc-gallery-title-weight",
        "label": "Title Weight",
        "type": "fontWeight",
        "default": "var(--fnd-font-weight-bold)"
      },
      {
        "id": "nc-gallery-title-color",
        "label": "Title Color",
        "type": "color",
        "default": "var(--fnd-color-always-light)"
      },
      {
        "id": "nc-gallery-title-line-height",
        "label": "Title Line Height",
        "type": "size",
        "default": "var(--lh-heading)"
      },
      {
        "id": "nc-gallery-desc-size",
        "label": "Desc Size",
        "type": "size",
        "default": "var(--fs-lg)"
      },
      {
        "id": "nc-gallery-desc-color",
        "label": "Desc Color",
        "type": "color",
        "default": "color-mix(in srgb, var(--fnd-color-always-light) 80%, transparent)"
      },
      {
        "id": "nc-gallery-desc-max-width",
        "label": "Desc Max Width",
        "type": "size",
        "default": "50ch"
      },
      {
        "id": "nc-gallery-desc-line-height",
        "label": "Desc Line Height",
        "type": "size",
        "default": "var(--lh-body)"
      },
      {
        "id": "nc-gallery-tag-size",
        "label": "Tag Size",
        "type": "size",
        "default": "var(--fs-xs)"
      },
      {
        "id": "nc-gallery-tag-weight",
        "label": "Tag Weight",
        "type": "fontWeight",
        "default": "var(--fnd-font-weight-semibold)"
      },
      {
        "id": "nc-gallery-tag-bg",
        "label": "Tag BG",
        "type": "color",
        "default": "color-mix(in srgb, var(--fnd-color-always-light) 15%, transparent)"
      },
      {
        "id": "nc-gallery-tag-color",
        "label": "Tag Color",
        "type": "color",
        "default": "var(--fnd-color-always-light)"
      },
      {
        "id": "nc-gallery-tag-radius",
        "label": "Tag Radius",
        "type": "radius",
        "default": "var(--fnd-radius-sm)"
      },
      {
        "id": "nc-gallery-tag-padding",
        "label": "Tag Padding",
        "type": "spacing",
        "default": "var(--fnd-spacing-01) var(--fnd-spacing-03)"
      },
      {
        "id": "nc-gallery-logo-max-height",
        "label": "Logo Max Height",
        "type": "size",
        "default": "48px"
      },
      {
        "id": "nc-gallery-logo-max-width",
        "label": "Logo Max Width",
        "type": "size",
        "default": "200px"
      },
      {
        "id": "nc-gallery-dot-size",
        "label": "Dot Size",
        "type": "size",
        "default": "10px"
      },
      {
        "id": "nc-gallery-dot-gap",
        "label": "Dot Gap",
        "type": "spacing",
        "default": "var(--fnd-spacing-02)"
      },
      {
        "id": "nc-gallery-dot-color",
        "label": "Dot Color",
        "type": "color",
        "default": "color-mix(in srgb, var(--fnd-color-always-light) 40%, transparent)"
      },
      {
        "id": "nc-gallery-dot-color-active",
        "label": "Dot Color Active",
        "type": "color",
        "default": "var(--fnd-color-always-light)"
      },
      {
        "id": "nc-gallery-dot-radius",
        "label": "Dot Radius",
        "type": "radius",
        "default": "var(--fnd-radius-full)"
      },
      {
        "id": "nc-gallery-paddle-size",
        "label": "Paddle Size",
        "type": "size",
        "default": "48px"
      },
      {
        "id": "nc-gallery-paddle-bg",
        "label": "Paddle BG",
        "type": "color",
        "default": "color-mix(in srgb, var(--fnd-color-always-dark) 30%, transparent)"
      },
      {
        "id": "nc-gallery-paddle-bg-hover",
        "label": "Paddle BG Hover",
        "type": "color",
        "default": "color-mix(in srgb, var(--fnd-color-always-dark) 50%, transparent)"
      },
      {
        "id": "nc-gallery-paddle-color",
        "label": "Paddle Color",
        "type": "color",
        "default": "var(--fnd-color-always-light)"
      },
      {
        "id": "nc-gallery-paddle-radius",
        "label": "Paddle Radius",
        "type": "radius",
        "default": "var(--fnd-radius-full)"
      },
      {
        "id": "nc-gallery-animation-duration",
        "label": "Animation Duration",
        "type": "duration",
        "default": "0.6s"
      },
      {
        "id": "nc-gallery-animation-easing",
        "label": "Animation Easing",
        "type": "generic",
        "default": "cubic-bezier(0.16, 1, 0.3, 1)"
      },
      {
        "id": "nc-gallery-autoplay-interval",
        "label": "Autoplay Interval",
        "type": "generic",
        "default": "6s"
      },
      {
        "id": "nc-gallery-autoplay-progress-color",
        "label": "Autoplay Progress Color",
        "type": "color",
        "default": "var(--fnd-color-always-light)"
      }
    ]
  },
  {
    "id": "hero",
    "label": "Hero",
    "icon": "components",
    "subgroups": [
      {
        "id": "geometry",
        "label": "Geometrie",
        "tokenIds": [
          "nc-hero-min-height",
          "nc-hero-padding-block",
          "nc-hero-padding-inline",
          "nc-hero-gap",
          "nc-hero-radius",
          "nc-hero-kicker-size",
          "nc-hero-kicker-radius",
          "nc-hero-kicker-padding",
          "nc-hero-highlights-gap",
          "nc-hero-highlights-size",
          "nc-hero-title-size",
          "nc-hero-title-max-width",
          "nc-hero-subtitle-size",
          "nc-hero-subtitle-max-width",
          "nc-hero-actions-gap",
          "nc-hero-actions-margin-top",
          "nc-hero-mark-thickness",
          "nc-hero-footer-margin-top",
          "nc-hero-footer-gap",
          "nc-hero-cards-gap",
          "nc-hero-split-columns",
          "nc-hero-split-media-min-height",
          "nc-hero-split-gap",
          "nc-hero-mockup-width",
          "nc-hero-mockup-ratio",
          "nc-hero-mockup-radius",
          "nc-hero-mockup-padding",
          "nc-hero-mockup-gap",
          "nc-hero-cards-kicker-size",
          "nc-hero-cards-value-size",
          "nc-hero-cards-label-size",
          "nc-hero-cards-stack",
          "nc-hero-cards-rule-width-sm",
          "nc-hero-cards-rule-width-md",
          "nc-hero-cards-rule-width-lg",
          "nc-hero-cards-rule-inset",
          "nc-hero-cards-radius",
          "nc-hero-cards-pad"
        ]
      },
      {
        "id": "typography",
        "label": "Typografie",
        "tokenIds": [
          "nc-hero-kicker-weight",
          "nc-hero-kicker-tracking",
          "nc-hero-kicker-transform",
          "nc-hero-title-weight",
          "nc-hero-title-line-height",
          "nc-hero-subtitle-line-height",
          "nc-hero-cards-kicker-weight",
          "nc-hero-cards-kicker-family",
          "nc-hero-cards-kicker-tracking",
          "nc-hero-cards-value-family",
          "nc-hero-cards-value-weight",
          "nc-hero-cards-value-lh",
          "nc-hero-cards-label-lh"
        ]
      },
      {
        "id": "colors",
        "label": "Farben",
        "category": "main",
        "tokenIds": [
          "nc-hero-bg",
          "nc-hero-color",
          "nc-hero-overlay-visible",
          "nc-hero-overlay-start",
          "nc-hero-overlay-end",
          "nc-hero-overlay-direction",
          "nc-hero-kicker-bg",
          "nc-hero-kicker-color",
          "nc-hero-highlights-color",
          "nc-hero-title-color",
          "nc-hero-subtitle-color",
          "nc-hero-surface-dark-bg",
          "nc-hero-surface-dark-fg",
          "nc-hero-surface-light-bg",
          "nc-hero-surface-light-fg",
          "nc-hero-surface-muted-bg",
          "nc-hero-mark-on-light",
          "nc-hero-mark-on-dark",
          "nc-hero-mark-color",
          "nc-hero-mark-tint",
          "nc-hero-mark-tint-on-light",
          "nc-hero-mark-tint-on-dark",
          "nc-hero-footer-rule",
          "nc-hero-cards-rule-color",
          "nc-hero-cards-rule-accent",
          "nc-hero-cards-rule-on-dark",
          "nc-hero-cards-rule-on-light",
          "nc-hero-cards-bg",
          "nc-hero-cards-fg",
          "nc-hero-cards-fg-muted"
        ]
      },
      {
        "id": "other",
        "label": "Weitere",
        "tokenIds": [
          "nc-hero-kicker-family",
          "nc-hero-highlights-marker"
        ]
      }
    ],
    "tokens": [
      {
        "id": "nc-hero-bg",
        "label": "BG",
        "type": "color",
        "default": "var(--fnd-color-always-dark)"
      },
      {
        "id": "nc-hero-color",
        "label": "Color",
        "type": "color",
        "default": "var(--fnd-color-always-light)"
      },
      {
        "id": "nc-hero-min-height",
        "label": "Min Height",
        "type": "size",
        "default": "60dvh"
      },
      {
        "id": "nc-hero-padding-block",
        "label": "Padding Block",
        "type": "spacing",
        "default": "var(--fnd-spacing-12)"
      },
      {
        "id": "nc-hero-padding-inline",
        "label": "Padding Inline",
        "type": "spacing",
        "default": "var(--fnd-spacing-06)"
      },
      {
        "id": "nc-hero-gap",
        "label": "Gap",
        "type": "spacing",
        "default": "var(--fnd-spacing-08)"
      },
      {
        "id": "nc-hero-radius",
        "label": "Radius",
        "type": "radius",
        "default": "0"
      },
      {
        "id": "nc-hero-overlay-visible",
        "label": "Overlay Visible",
        "type": "color",
        "default": "1"
      },
      {
        "id": "nc-hero-overlay-start",
        "label": "Overlay Start",
        "type": "color",
        "default": "rgba(0, 0, 0, 0.7)"
      },
      {
        "id": "nc-hero-overlay-end",
        "label": "Overlay End",
        "type": "color",
        "default": "rgba(0, 0, 0, 0.3)"
      },
      {
        "id": "nc-hero-overlay-direction",
        "label": "Overlay Direction",
        "type": "color",
        "default": "135deg"
      },
      {
        "id": "nc-hero-kicker-family",
        "label": "Kicker Family",
        "type": "generic",
        "default": "var(--font-mono)"
      },
      {
        "id": "nc-hero-kicker-size",
        "label": "Kicker Size",
        "type": "size",
        "default": "var(--nc-mono-label-size-lg)"
      },
      {
        "id": "nc-hero-kicker-weight",
        "label": "Kicker Weight",
        "type": "fontWeight",
        "default": "var(--nc-mono-label-weight-strong)"
      },
      {
        "id": "nc-hero-kicker-tracking",
        "label": "Kicker Tracking",
        "type": "size",
        "default": "var(--nc-mono-tracking-caps)"
      },
      {
        "id": "nc-hero-kicker-transform",
        "label": "Kicker Transform",
        "type": "size",
        "default": "uppercase"
      },
      {
        "id": "nc-hero-kicker-bg",
        "label": "Kicker BG",
        "type": "color",
        "default": "transparent"
      },
      {
        "id": "nc-hero-kicker-color",
        "label": "Kicker Color",
        "type": "color",
        "default": "var(--nc-hero-color)"
      },
      {
        "id": "nc-hero-kicker-radius",
        "label": "Kicker Radius",
        "type": "radius",
        "default": "0"
      },
      {
        "id": "nc-hero-kicker-padding",
        "label": "Kicker Padding",
        "type": "spacing",
        "default": "0"
      },
      {
        "id": "nc-hero-highlights-gap",
        "label": "Highlights Gap",
        "type": "spacing",
        "default": "var(--fnd-spacing-02)"
      },
      {
        "id": "nc-hero-highlights-color",
        "label": "Highlights Color",
        "type": "color",
        "default": "color-mix(in srgb, var(--nc-hero-color) 70%, transparent)"
      },
      {
        "id": "nc-hero-highlights-marker",
        "label": "Highlights Marker",
        "type": "color",
        "ref": "background-accent"
      },
      {
        "id": "nc-hero-highlights-size",
        "label": "Highlights Size",
        "type": "size",
        "default": "var(--fs-sm)"
      },
      {
        "id": "nc-hero-title-size",
        "label": "Title Size",
        "type": "size",
        "default": "var(--fs-4xl)"
      },
      {
        "id": "nc-hero-title-weight",
        "label": "Title Weight",
        "type": "fontWeight",
        "default": "var(--fnd-font-weight-bold)"
      },
      {
        "id": "nc-hero-title-color",
        "label": "Title Color",
        "type": "color",
        "default": "var(--nc-hero-color)"
      },
      {
        "id": "nc-hero-title-max-width",
        "label": "Title Max Width",
        "type": "size",
        "default": "18ch"
      },
      {
        "id": "nc-hero-title-line-height",
        "label": "Title Line Height",
        "type": "size",
        "default": "var(--lh-heading)"
      },
      {
        "id": "nc-hero-subtitle-size",
        "label": "Subtitle Size",
        "type": "size",
        "default": "var(--fs-xl)"
      },
      {
        "id": "nc-hero-subtitle-color",
        "label": "Subtitle Color",
        "type": "color",
        "default": "color-mix(in srgb, var(--nc-hero-color) 80%, transparent)"
      },
      {
        "id": "nc-hero-subtitle-max-width",
        "label": "Subtitle Max Width",
        "type": "size",
        "default": "40ch"
      },
      {
        "id": "nc-hero-subtitle-line-height",
        "label": "Subtitle Line Height",
        "type": "size",
        "default": "var(--lh-body)"
      },
      {
        "id": "nc-hero-actions-gap",
        "label": "Actions Gap",
        "type": "spacing",
        "default": "var(--fnd-spacing-04)"
      },
      {
        "id": "nc-hero-actions-margin-top",
        "label": "Actions Margin Top",
        "type": "spacing",
        "default": "var(--fnd-spacing-04)"
      },
      {
        "id": "nc-hero-surface-dark-bg",
        "label": "Fläche dunkel — Grund",
        "type": "color",
        "default": "var(--fnd-color-always-dark)"
      },
      {
        "id": "nc-hero-surface-dark-fg",
        "label": "Fläche dunkel — Schrift",
        "type": "color",
        "default": "var(--fnd-color-always-light)"
      },
      {
        "id": "nc-hero-surface-light-bg",
        "label": "Fläche hell — Grund",
        "type": "color",
        "default": "var(--fnd-neutral-50)"
      },
      {
        "id": "nc-hero-surface-light-fg",
        "label": "Fläche hell — Schrift",
        "type": "color",
        "default": "var(--fnd-neutral-950)"
      },
      {
        "id": "nc-hero-surface-muted-bg",
        "label": "Fläche getönt — Grund",
        "type": "color",
        "default": "var(--fnd-neutral-100)"
      },
      {
        "id": "nc-hero-mark-on-light",
        "label": "Hervorhebung auf hell",
        "type": "color",
        "default": "var(--fnd-accent-200)"
      },
      {
        "id": "nc-hero-mark-on-dark",
        "label": "Hervorhebung auf dunkel",
        "type": "color",
        "default": "var(--fnd-accent-800)"
      },
      {
        "id": "nc-hero-mark-color",
        "label": "Hervorhebung — Balken",
        "type": "color",
        "default": "var(--nc-hero-mark-on-dark)"
      },
      {
        "id": "nc-hero-mark-tint",
        "label": "Hervorhebung — Tinte",
        "type": "color",
        "default": "var(--nc-hero-mark-tint-on-dark)"
      },
      {
        "id": "nc-hero-mark-tint-on-light",
        "label": "Tinte auf hell",
        "type": "color",
        "default": "var(--fnd-accent-800)"
      },
      {
        "id": "nc-hero-mark-tint-on-dark",
        "label": "Tinte auf dunkel",
        "type": "color",
        "default": "var(--fnd-accent-300)"
      },
      {
        "id": "nc-hero-footer-rule",
        "label": "Fuß — Trennlinie",
        "type": "color",
        "default": "color-mix(in srgb, var(--nc-hero-color) 14%, transparent)"
      },
      {
        "id": "nc-hero-mark-thickness",
        "label": "Hervorhebung — Balkenhöhe",
        "type": "size",
        "default": "0.34em"
      },
      {
        "id": "nc-hero-footer-margin-top",
        "label": "Fuß — Abstand nach oben",
        "type": "size",
        "default": "var(--fnd-spacing-08)"
      },
      {
        "id": "nc-hero-footer-gap",
        "label": "Fuß — Innenabstand",
        "type": "size",
        "default": "var(--fnd-spacing-06)"
      },
      {
        "id": "nc-hero-cards-gap",
        "label": "Kennzahlen — Abstand",
        "type": "size",
        "default": "var(--fnd-spacing-06)"
      },
      {
        "id": "nc-hero-split-columns",
        "label": "Split — Spalten",
        "type": "size",
        "default": "1fr 1fr"
      },
      {
        "id": "nc-hero-split-media-min-height",
        "label": "Split — Mindesthöhe Medium",
        "type": "size",
        "default": "420px"
      },
      {
        "id": "nc-hero-split-gap",
        "label": "Split — Spaltenabstand",
        "type": "size",
        "default": "var(--fnd-spacing-10)"
      },
      {
        "id": "nc-hero-mockup-width",
        "label": "Attrappe — Breite",
        "type": "size",
        "default": "min(420px, 90vw)"
      },
      {
        "id": "nc-hero-mockup-ratio",
        "label": "Attrappe — Seitenverhältnis",
        "type": "size",
        "default": "4 / 5"
      },
      {
        "id": "nc-hero-mockup-radius",
        "label": "Attrappe — Radius",
        "type": "size",
        "default": "var(--fnd-radius-4xl)"
      },
      {
        "id": "nc-hero-mockup-padding",
        "label": "Attrappe — Innenabstand",
        "type": "size",
        "default": "var(--fnd-spacing-06)"
      },
      {
        "id": "nc-hero-mockup-gap",
        "label": "Attrappe — Abstand innen",
        "type": "size",
        "default": "var(--fnd-spacing-06)"
      },
      {
        "id": "nc-hero-cards-kicker-size",
        "label": "Kennzahlen — Kicker-Größe",
        "type": "size",
        "default": "var(--fs-xs)"
      },
      {
        "id": "nc-hero-cards-value-size",
        "label": "Kennzahlen — Wert-Größe",
        "type": "size",
        "default": "var(--fs-2xl)"
      },
      {
        "id": "nc-hero-cards-label-size",
        "label": "Kennzahlen — Beschriftungs-Größe",
        "type": "size",
        "default": "var(--fs-base)"
      },
      {
        "id": "nc-hero-cards-stack",
        "label": "Kennzahlen — Innenabstand",
        "type": "size",
        "default": "var(--fnd-spacing-01)"
      },
      {
        "id": "nc-hero-cards-rule-width-sm",
        "label": "Trennlinie fein",
        "type": "size",
        "default": "1px"
      },
      {
        "id": "nc-hero-cards-rule-width-md",
        "label": "Trennlinie mittel",
        "type": "size",
        "default": "2px"
      },
      {
        "id": "nc-hero-cards-rule-width-lg",
        "label": "Trennlinie kräftig",
        "type": "size",
        "default": "4px"
      },
      {
        "id": "nc-hero-cards-rule-inset",
        "label": "Trennlinie — Abstand zum Inhalt",
        "type": "size",
        "default": "var(--fnd-spacing-06)"
      },
      {
        "id": "nc-hero-cards-rule-color",
        "label": "Trennlinie — Farbe",
        "type": "color",
        "default": "var(--nc-hero-footer-rule)"
      },
      {
        "id": "nc-hero-cards-rule-accent",
        "label": "Trennlinie — Lime",
        "type": "color",
        "default": "var(--fnd-accent-500)"
      },
      {
        "id": "nc-hero-cards-kicker-weight",
        "label": "Kennzahlen — Kicker-Gewicht",
        "type": "size",
        "default": "var(--nc-mono-label-weight-strong)"
      },
      {
        "id": "nc-hero-cards-kicker-family",
        "label": "Kennzahlen — Kicker-Schrift",
        "type": "size",
        "default": "var(--font-mono)"
      },
      {
        "id": "nc-hero-cards-kicker-tracking",
        "label": "Kennzahlen — Kicker-Laufweite",
        "type": "size",
        "default": "var(--nc-mono-tracking-caps)"
      },
      {
        "id": "nc-hero-cards-value-family",
        "label": "Kennzahlen — Wert-Schrift",
        "type": "size",
        "default": "var(--font-heading)"
      },
      {
        "id": "nc-hero-cards-value-weight",
        "label": "Kennzahlen — Wert-Gewicht",
        "type": "size",
        "default": "var(--fnd-font-weight-bold)"
      },
      {
        "id": "nc-hero-cards-value-lh",
        "label": "Kennzahlen — Wert-Zeilenhöhe",
        "type": "size",
        "default": "var(--lh-heading)"
      },
      {
        "id": "nc-hero-cards-label-lh",
        "label": "Kennzahlen — Beschriftungs-Zeilenhöhe",
        "type": "size",
        "default": "var(--lh-snug)"
      },
      {
        "id": "nc-hero-cards-rule-on-dark",
        "label": "Trennlinie auf dunkler Fläche",
        "type": "color",
        "default": "var(--fnd-neutral-100)"
      },
      {
        "id": "nc-hero-cards-rule-on-light",
        "label": "Trennlinie auf heller Fläche",
        "type": "color",
        "default": "var(--fnd-neutral-900)"
      },
      {
        "id": "nc-hero-cards-bg",
        "label": "Kartenfläche",
        "type": "color",
        "default": "transparent"
      },
      {
        "id": "nc-hero-cards-fg",
        "label": "Kartenschrift",
        "type": "color",
        "default": "inherit"
      },
      {
        "id": "nc-hero-cards-fg-muted",
        "label": "Kartenschrift gedämpft",
        "type": "color",
        "default": "inherit"
      },
      {
        "id": "nc-hero-cards-radius",
        "label": "Karten — Radius",
        "type": "size",
        "default": "var(--fnd-radius-lg)"
      },
      {
        "id": "nc-hero-cards-pad",
        "label": "Karten — Polsterung",
        "type": "size",
        "default": "clamp(16px, calc(16px + (28px - 16px) * var(--fluid-bp)), 28px)"
      }
    ]
  },
  {
    "id": "hero-tmob",
    "label": "Hero Tmob",
    "icon": "components",
    "subgroups": [
      {
        "id": "geometry",
        "label": "Geometrie",
        "tokenIds": [
          "nc-hero-tmob-headline-size",
          "nc-hero-tmob-subtext-size",
          "nc-hero-tmob-subtext-max-width",
          "nc-hero-tmob-content-max-width",
          "nc-hero-tmob-media-max-width",
          "nc-hero-tmob-media-radius",
          "nc-hero-tmob-content-gap"
        ]
      },
      {
        "id": "typography",
        "label": "Typografie",
        "tokenIds": [
          "nc-hero-tmob-headline-weight"
        ]
      },
      {
        "id": "colors",
        "label": "Farben",
        "category": "main",
        "tokenIds": [
          "nc-hero-tmob-media-shadow"
        ]
      },
      {
        "id": "interaction",
        "label": "Bewegung & Zustand",
        "category": "state",
        "tokenIds": [
          "nc-hero-tmob-subtext-opacity"
        ]
      }
    ],
    "tokens": [
      {
        "id": "nc-hero-tmob-headline-size",
        "label": "Headline Size",
        "type": "size",
        "default": "var(--fs-5xl)"
      },
      {
        "id": "nc-hero-tmob-headline-weight",
        "label": "Headline Weight",
        "type": "fontWeight",
        "default": "var(--fnd-font-weight-bold)"
      },
      {
        "id": "nc-hero-tmob-subtext-size",
        "label": "Subtext Size",
        "type": "size",
        "default": "var(--fs-xl)"
      },
      {
        "id": "nc-hero-tmob-subtext-opacity",
        "label": "Subtext Opacity",
        "type": "opacity",
        "default": "0.85"
      },
      {
        "id": "nc-hero-tmob-subtext-max-width",
        "label": "Subtext Max Width",
        "type": "size",
        "default": "600px"
      },
      {
        "id": "nc-hero-tmob-content-max-width",
        "label": "Content Max Width",
        "type": "size",
        "default": "800px"
      },
      {
        "id": "nc-hero-tmob-media-max-width",
        "label": "Media Max Width",
        "type": "size",
        "default": "960px"
      },
      {
        "id": "nc-hero-tmob-media-radius",
        "label": "Media Radius",
        "type": "radius",
        "default": "var(--fnd-radius-lg)"
      },
      {
        "id": "nc-hero-tmob-media-shadow",
        "label": "Media Shadow",
        "type": "color",
        "default": "var(--fnd-shadow-lg)"
      },
      {
        "id": "nc-hero-tmob-content-gap",
        "label": "Content Gap",
        "type": "spacing",
        "default": "var(--fnd-spacing-08)"
      }
    ]
  },
  {
    "id": "hero-tom",
    "label": "Hero Tom",
    "icon": "components",
    "subgroups": [
      {
        "id": "geometry",
        "label": "Geometrie",
        "tokenIds": [
          "nc-hero-tom-kicker-size",
          "nc-hero-tom-headline-size",
          "nc-hero-tom-subtext-size",
          "nc-hero-tom-expand-radius",
          "nc-hero-tom-content-max-width"
        ]
      },
      {
        "id": "typography",
        "label": "Typografie",
        "tokenIds": [
          "nc-hero-tom-kicker-weight",
          "nc-hero-tom-kicker-tracking",
          "nc-hero-tom-kicker-transform",
          "nc-hero-tom-headline-weight"
        ]
      },
      {
        "id": "colors",
        "label": "Farben",
        "category": "main",
        "tokenIds": [
          "nc-hero-tom-scrim-color"
        ]
      },
      {
        "id": "interaction",
        "label": "Bewegung & Zustand",
        "category": "state",
        "tokenIds": [
          "nc-hero-tom-subtext-opacity"
        ]
      },
      {
        "id": "other",
        "label": "Weitere",
        "tokenIds": [
          "nc-hero-tom-kicker-family"
        ]
      }
    ],
    "tokens": [
      {
        "id": "nc-hero-tom-kicker-family",
        "label": "Kicker Family",
        "type": "generic",
        "default": "var(--font-mono)"
      },
      {
        "id": "nc-hero-tom-kicker-size",
        "label": "Kicker Size",
        "type": "size",
        "default": "var(--nc-mono-label-size-lg)"
      },
      {
        "id": "nc-hero-tom-kicker-weight",
        "label": "Kicker Weight",
        "type": "fontWeight",
        "default": "var(--nc-mono-label-weight-strong)"
      },
      {
        "id": "nc-hero-tom-kicker-tracking",
        "label": "Kicker Tracking",
        "type": "size",
        "default": "var(--nc-mono-tracking-caps)"
      },
      {
        "id": "nc-hero-tom-kicker-transform",
        "label": "Kicker Transform",
        "type": "size",
        "default": "uppercase"
      },
      {
        "id": "nc-hero-tom-headline-size",
        "label": "Headline Size",
        "type": "size",
        "default": "var(--fs-5xl)"
      },
      {
        "id": "nc-hero-tom-headline-weight",
        "label": "Headline Weight",
        "type": "fontWeight",
        "default": "var(--fnd-font-weight-bold)"
      },
      {
        "id": "nc-hero-tom-subtext-size",
        "label": "Subtext Size",
        "type": "size",
        "default": "var(--fs-xl)"
      },
      {
        "id": "nc-hero-tom-subtext-opacity",
        "label": "Subtext Opacity",
        "type": "opacity",
        "default": "0.85"
      },
      {
        "id": "nc-hero-tom-scrim-color",
        "label": "Scrim Color",
        "type": "color",
        "default": "rgba(0, 0, 0, 0.4)"
      },
      {
        "id": "nc-hero-tom-expand-radius",
        "label": "Expand Radius",
        "type": "radius",
        "default": "var(--fnd-radius-xl)"
      },
      {
        "id": "nc-hero-tom-content-max-width",
        "label": "Content Max Width",
        "type": "size",
        "default": "800px"
      }
    ]
  },
  {
    "id": "item",
    "label": "Item",
    "icon": "components",
    "subgroups": [
      {
        "id": "geometry",
        "label": "Geometrie",
        "tokenIds": [
          "nc-item-gap",
          "nc-item-padding-x",
          "nc-item-padding-y",
          "nc-item-radius",
          "nc-item-border-width",
          "nc-item-selected-accent-width",
          "nc-item-accent-width",
          "nc-item-media-size",
          "nc-item-media-radius",
          "nc-item-thumbnail-width",
          "nc-item-thumbnail-radius",
          "nc-item-compact-padding-x",
          "nc-item-compact-padding-y",
          "nc-item-compact-gap",
          "nc-item-compact-media-size",
          "nc-item-loose-padding-x",
          "nc-item-loose-padding-y",
          "nc-item-loose-gap",
          "nc-item-loose-media-size"
        ]
      },
      {
        "id": "typography",
        "label": "Typografie",
        "tokenIds": [
          "nc-item-align",
          "nc-item-title-font-size",
          "nc-item-title-font-weight",
          "nc-item-title-line-height",
          "nc-item-desc-font-size",
          "nc-item-desc-line-height"
        ]
      },
      {
        "id": "colors",
        "label": "Farben",
        "category": "main",
        "tokenIds": [
          "nc-item-title-color",
          "nc-item-desc-color",
          "nc-item-bg",
          "nc-item-border",
          "nc-item-hover-bg",
          "nc-item-active-bg",
          "nc-item-selected-bg",
          "nc-item-selected-border",
          "nc-item-accent-color",
          "nc-item-media-bg",
          "nc-item-media-color"
        ]
      },
      {
        "id": "interaction",
        "label": "Bewegung & Zustand",
        "category": "state",
        "tokenIds": [
          "nc-item-transition",
          "nc-item-disabled-opacity"
        ]
      },
      {
        "id": "other",
        "label": "Weitere",
        "tokenIds": [
          "nc-item-thumbnail-ratio"
        ]
      }
    ],
    "tokens": [
      {
        "id": "nc-item-gap",
        "label": "Gap",
        "type": "spacing",
        "default": "var(--fnd-spacing-03)"
      },
      {
        "id": "nc-item-padding-x",
        "label": "Padding X",
        "type": "spacing",
        "default": "var(--fnd-spacing-04)"
      },
      {
        "id": "nc-item-padding-y",
        "label": "Padding Y",
        "type": "spacing",
        "default": "var(--fnd-spacing-03)"
      },
      {
        "id": "nc-item-radius",
        "label": "Radius",
        "type": "radius",
        "default": "var(--fnd-radius-sm)"
      },
      {
        "id": "nc-item-align",
        "label": "Align",
        "type": "size",
        "default": "center"
      },
      {
        "id": "nc-item-border-width",
        "label": "Border Width",
        "type": "size",
        "default": "var(--fnd-border-width-xs)"
      },
      {
        "id": "nc-item-transition",
        "label": "Transition",
        "type": "generic",
        "default": "var(--fnd-motion-duration-200)"
      },
      {
        "id": "nc-item-title-font-size",
        "label": "Title Font Size",
        "type": "size",
        "default": "var(--fs-sm)"
      },
      {
        "id": "nc-item-title-font-weight",
        "label": "Title Font Weight",
        "type": "fontWeight",
        "default": "var(--fnd-font-weight-bold)"
      },
      {
        "id": "nc-item-title-line-height",
        "label": "Title Line Height",
        "type": "size",
        "default": "1.4"
      },
      {
        "id": "nc-item-title-color",
        "label": "Title Color",
        "type": "color",
        "ref": "text-primary"
      },
      {
        "id": "nc-item-desc-font-size",
        "label": "Desc Font Size",
        "type": "size",
        "default": "var(--fs-xs)"
      },
      {
        "id": "nc-item-desc-line-height",
        "label": "Desc Line Height",
        "type": "size",
        "default": "1.5"
      },
      {
        "id": "nc-item-desc-color",
        "label": "Desc Color",
        "type": "color",
        "ref": "text-secondary"
      },
      {
        "id": "nc-item-bg",
        "label": "BG",
        "type": "color",
        "default": "transparent"
      },
      {
        "id": "nc-item-border",
        "label": "Border",
        "type": "color",
        "default": "transparent"
      },
      {
        "id": "nc-item-hover-bg",
        "label": "Hover BG",
        "type": "color",
        "ref": "background-secondary"
      },
      {
        "id": "nc-item-active-bg",
        "label": "Active BG",
        "type": "color",
        "ref": "background-tertiary"
      },
      {
        "id": "nc-item-selected-bg",
        "label": "Selected BG",
        "type": "color",
        "default": "color-mix(in srgb, var(--fnd-color-interactive-default) 10%, transparent)"
      },
      {
        "id": "nc-item-selected-border",
        "label": "Selected Border",
        "type": "color",
        "ref": "interactive-default"
      },
      {
        "id": "nc-item-selected-accent-width",
        "label": "Selected Accent Width",
        "type": "size",
        "default": "2px"
      },
      {
        "id": "nc-item-accent-width",
        "label": "Accent Width",
        "type": "size",
        "default": "2px"
      },
      {
        "id": "nc-item-accent-color",
        "label": "Accent Color",
        "type": "color",
        "ref": "interactive-default"
      },
      {
        "id": "nc-item-media-size",
        "label": "Media Size",
        "type": "size",
        "default": "40px"
      },
      {
        "id": "nc-item-media-radius",
        "label": "Media Radius",
        "type": "radius",
        "default": "var(--fnd-radius-sm)"
      },
      {
        "id": "nc-item-media-bg",
        "label": "Media BG",
        "type": "color",
        "ref": "background-secondary"
      },
      {
        "id": "nc-item-media-color",
        "label": "Media Color",
        "type": "color",
        "ref": "text-secondary"
      },
      {
        "id": "nc-item-thumbnail-ratio",
        "label": "Thumbnail Ratio",
        "type": "generic",
        "default": "16 / 9"
      },
      {
        "id": "nc-item-thumbnail-width",
        "label": "Thumbnail Width",
        "type": "size",
        "default": "120px"
      },
      {
        "id": "nc-item-thumbnail-radius",
        "label": "Thumbnail Radius",
        "type": "radius",
        "default": "var(--fnd-radius-sm)"
      },
      {
        "id": "nc-item-compact-padding-x",
        "label": "Compact Padding X",
        "type": "spacing",
        "default": "var(--fnd-spacing-02)"
      },
      {
        "id": "nc-item-compact-padding-y",
        "label": "Compact Padding Y",
        "type": "spacing",
        "default": "var(--fnd-spacing-01)"
      },
      {
        "id": "nc-item-compact-gap",
        "label": "Compact Gap",
        "type": "spacing",
        "default": "var(--fnd-spacing-02)"
      },
      {
        "id": "nc-item-compact-media-size",
        "label": "Compact Media Size",
        "type": "size",
        "default": "28px"
      },
      {
        "id": "nc-item-loose-padding-x",
        "label": "Loose Padding X",
        "type": "spacing",
        "default": "var(--fnd-spacing-05)"
      },
      {
        "id": "nc-item-loose-padding-y",
        "label": "Loose Padding Y",
        "type": "spacing",
        "default": "var(--fnd-spacing-04)"
      },
      {
        "id": "nc-item-loose-gap",
        "label": "Loose Gap",
        "type": "spacing",
        "default": "var(--fnd-spacing-04)"
      },
      {
        "id": "nc-item-loose-media-size",
        "label": "Loose Media Size",
        "type": "size",
        "default": "48px"
      },
      {
        "id": "nc-item-disabled-opacity",
        "label": "Disabled Opacity",
        "type": "opacity",
        "default": "var(--fnd-opacity-disabled)"
      }
    ]
  },
  {
    "id": "label",
    "label": "Label",
    "icon": "components",
    "subgroups": [
      {
        "id": "geometry",
        "label": "Geometrie",
        "tokenIds": [
          "nc-label-height-xs",
          "nc-label-height-sm",
          "nc-label-height-md",
          "nc-label-padding-x",
          "nc-label-padding-x-xs",
          "nc-label-padding-x-md",
          "nc-label-radius",
          "nc-label-radius-pill",
          "nc-label-gap",
          "nc-label-container-gap",
          "nc-label-icon-size",
          "nc-label-outline-border-width",
          "nc-label-remove-size"
        ]
      },
      {
        "id": "typography",
        "label": "Typografie",
        "tokenIds": [
          "nc-label-font-size",
          "nc-label-font-size-xs",
          "nc-label-font-size-md",
          "nc-label-font-weight",
          "nc-label-letter-spacing"
        ]
      },
      {
        "id": "colors",
        "label": "Farben",
        "category": "main",
        "tokenIds": [
          "nc-label-default-bg",
          "nc-label-default-color",
          "nc-label-default-border",
          "nc-label-default-bg-hover",
          "nc-label-accent-color",
          "nc-label-accent-border",
          "nc-label-accent-bg-hover",
          "nc-label-success-bg",
          "nc-label-success-color",
          "nc-label-success-border",
          "nc-label-warning-bg",
          "nc-label-warning-color",
          "nc-label-warning-border",
          "nc-label-danger-bg",
          "nc-label-danger-color",
          "nc-label-danger-border",
          "nc-label-info-bg",
          "nc-label-info-color",
          "nc-label-info-border",
          "nc-label-solid-default-bg",
          "nc-label-solid-default-color",
          "nc-label-remove-hover-bg"
        ]
      },
      {
        "id": "interaction",
        "label": "Bewegung & Zustand",
        "category": "state",
        "tokenIds": [
          "nc-label-transition-duration",
          "nc-label-disabled-opacity"
        ]
      }
    ],
    "tokens": [
      {
        "id": "nc-label-height-xs",
        "label": "Height XS",
        "type": "size",
        "default": "20px"
      },
      {
        "id": "nc-label-height-sm",
        "label": "Height SM",
        "type": "size",
        "default": "24px"
      },
      {
        "id": "nc-label-height-md",
        "label": "Height MD",
        "type": "size",
        "default": "28px"
      },
      {
        "id": "nc-label-padding-x",
        "label": "Padding X",
        "type": "spacing",
        "default": "var(--fnd-spacing-02)"
      },
      {
        "id": "nc-label-padding-x-xs",
        "label": "Padding X XS",
        "type": "spacing",
        "default": "var(--fnd-spacing-01)"
      },
      {
        "id": "nc-label-padding-x-md",
        "label": "Padding X MD",
        "type": "spacing",
        "default": "var(--fnd-spacing-03)"
      },
      {
        "id": "nc-label-radius",
        "label": "Radius",
        "type": "radius",
        "default": "var(--fnd-radius-xs)"
      },
      {
        "id": "nc-label-radius-pill",
        "label": "Radius Pill",
        "type": "radius",
        "default": "var(--fnd-radius-full)"
      },
      {
        "id": "nc-label-font-size",
        "label": "Font Size",
        "type": "size",
        "default": "var(--fs-2xs)"
      },
      {
        "id": "nc-label-font-size-xs",
        "label": "Font Size XS",
        "type": "size",
        "default": "10px"
      },
      {
        "id": "nc-label-font-size-md",
        "label": "Font Size MD",
        "type": "size",
        "default": "var(--fs-xs)"
      },
      {
        "id": "nc-label-font-weight",
        "label": "Font Weight",
        "type": "fontWeight",
        "default": "var(--fnd-font-weight-semibold)"
      },
      {
        "id": "nc-label-gap",
        "label": "Gap",
        "type": "spacing",
        "default": "var(--fnd-spacing-01)"
      },
      {
        "id": "nc-label-container-gap",
        "label": "Container Gap",
        "type": "spacing",
        "default": "var(--fnd-spacing-02)"
      },
      {
        "id": "nc-label-transition-duration",
        "label": "Transition Duration",
        "type": "duration",
        "default": "var(--fnd-motion-duration-200)"
      },
      {
        "id": "nc-label-letter-spacing",
        "label": "Letter Spacing",
        "type": "size",
        "default": "0.01em"
      },
      {
        "id": "nc-label-icon-size",
        "label": "Icon Size",
        "type": "size",
        "default": "12px"
      },
      {
        "id": "nc-label-default-bg",
        "label": "Default BG",
        "type": "color",
        "ref": "background-secondary"
      },
      {
        "id": "nc-label-default-color",
        "label": "Default Color",
        "type": "color",
        "ref": "text-secondary"
      },
      {
        "id": "nc-label-default-border",
        "label": "Default Border",
        "type": "color",
        "default": "transparent"
      },
      {
        "id": "nc-label-default-bg-hover",
        "label": "Default BG Hover",
        "type": "color",
        "ref": "background-tertiary"
      },
      {
        "id": "nc-label-accent-color",
        "label": "Accent Color",
        "type": "color",
        "ref": "text-accent"
      },
      {
        "id": "nc-label-accent-border",
        "label": "Accent Border",
        "type": "color",
        "default": "transparent"
      },
      {
        "id": "nc-label-accent-bg-hover",
        "label": "Accent BG Hover",
        "type": "color",
        "default": "color-mix(in srgb, var(--fnd-color-interactive-default) 18%, transparent)"
      },
      {
        "id": "nc-label-success-bg",
        "label": "Success BG",
        "type": "color",
        "ref": "background-success"
      },
      {
        "id": "nc-label-success-color",
        "label": "Success Color",
        "type": "color",
        "ref": "text-success"
      },
      {
        "id": "nc-label-success-border",
        "label": "Success Border",
        "type": "color",
        "default": "transparent"
      },
      {
        "id": "nc-label-warning-bg",
        "label": "Warning BG",
        "type": "color",
        "ref": "background-warning"
      },
      {
        "id": "nc-label-warning-color",
        "label": "Warning Color",
        "type": "color",
        "ref": "text-warning"
      },
      {
        "id": "nc-label-warning-border",
        "label": "Warning Border",
        "type": "color",
        "default": "transparent"
      },
      {
        "id": "nc-label-danger-bg",
        "label": "Danger BG",
        "type": "color",
        "ref": "background-danger"
      },
      {
        "id": "nc-label-danger-color",
        "label": "Danger Color",
        "type": "color",
        "ref": "text-danger"
      },
      {
        "id": "nc-label-danger-border",
        "label": "Danger Border",
        "type": "color",
        "default": "transparent"
      },
      {
        "id": "nc-label-info-bg",
        "label": "Info BG",
        "type": "color",
        "ref": "background-info"
      },
      {
        "id": "nc-label-info-color",
        "label": "Info Color",
        "type": "color",
        "ref": "text-info"
      },
      {
        "id": "nc-label-info-border",
        "label": "Info Border",
        "type": "color",
        "default": "transparent"
      },
      {
        "id": "nc-label-solid-default-bg",
        "label": "Solid Default BG",
        "type": "color",
        "ref": "background-inverse"
      },
      {
        "id": "nc-label-solid-default-color",
        "label": "Solid Default Color",
        "type": "color",
        "ref": "text-inverse"
      },
      {
        "id": "nc-label-outline-border-width",
        "label": "Outline Border Width",
        "type": "size",
        "default": "var(--fnd-border-width-xs)"
      },
      {
        "id": "nc-label-remove-size",
        "label": "Remove Size",
        "type": "size",
        "default": "14px"
      },
      {
        "id": "nc-label-remove-hover-bg",
        "label": "Remove Hover BG",
        "type": "color",
        "default": "color-mix(in srgb, currentColor 15%, transparent)"
      },
      {
        "id": "nc-label-disabled-opacity",
        "label": "Disabled Opacity",
        "type": "opacity",
        "default": "var(--fnd-opacity-disabled)"
      }
    ]
  },
  {
    "id": "logo-wall",
    "label": "Logo Wall",
    "icon": "components",
    "subgroups": [
      {
        "id": "geometry",
        "label": "Geometrie",
        "tokenIds": [
          "nc-logo-wall-gap",
          "nc-logo-wall-padding-block",
          "nc-logo-wall-padding-inline",
          "nc-logo-wall-grid-min",
          "nc-logo-wall-item-border-width",
          "nc-logo-wall-item-radius",
          "nc-logo-wall-item-padding",
          "nc-logo-wall-item-width-sm",
          "nc-logo-wall-item-width-md",
          "nc-logo-wall-item-width-lg",
          "nc-logo-wall-item-height",
          "nc-logo-wall-logo-max-height",
          "nc-logo-wall-marquee-gap"
        ]
      },
      {
        "id": "typography",
        "label": "Typografie",
        "tokenIds": [
          "nc-logo-wall-align",
          "nc-logo-wall-font-size",
          "nc-logo-wall-font-weight"
        ]
      },
      {
        "id": "colors",
        "label": "Farben",
        "category": "main",
        "tokenIds": [
          "nc-logo-wall-item-bg",
          "nc-logo-wall-item-border",
          "nc-logo-wall-item-shadow",
          "nc-logo-wall-color",
          "nc-logo-wall-item-hover-shadow",
          "nc-logo-wall-item-hover-border"
        ]
      },
      {
        "id": "interaction",
        "label": "Bewegung & Zustand",
        "category": "state",
        "tokenIds": [
          "nc-logo-wall-logo-opacity",
          "nc-logo-wall-logo-opacity-hover",
          "nc-logo-wall-fadein-duration",
          "nc-logo-wall-fadein-delay-step",
          "nc-logo-wall-fadein-easing",
          "nc-logo-wall-item-transition"
        ]
      },
      {
        "id": "other",
        "label": "Weitere",
        "tokenIds": [
          "nc-logo-wall-item-aspect-ratio",
          "nc-logo-wall-logo-filter",
          "nc-logo-wall-logo-filter-hover",
          "nc-logo-wall-marquee-speed"
        ]
      }
    ],
    "tokens": [
      {
        "id": "nc-logo-wall-gap",
        "label": "Gap",
        "type": "spacing",
        "default": "var(--fnd-spacing-04)"
      },
      {
        "id": "nc-logo-wall-padding-block",
        "label": "Padding Block",
        "type": "spacing",
        "default": "var(--fnd-spacing-08)"
      },
      {
        "id": "nc-logo-wall-padding-inline",
        "label": "Padding Inline",
        "type": "spacing",
        "default": "var(--fnd-spacing-06)"
      },
      {
        "id": "nc-logo-wall-grid-min",
        "label": "Grid Min",
        "type": "size",
        "default": "var(--nc-logo-wall-item-width-md)"
      },
      {
        "id": "nc-logo-wall-align",
        "label": "Align",
        "type": "size",
        "default": "center"
      },
      {
        "id": "nc-logo-wall-item-bg",
        "label": "Item BG",
        "type": "color",
        "ref": "background-base"
      },
      {
        "id": "nc-logo-wall-item-border",
        "label": "Item Border",
        "type": "color",
        "ref": "border-secondary"
      },
      {
        "id": "nc-logo-wall-item-border-width",
        "label": "Item Border Width",
        "type": "size",
        "default": "var(--fnd-border-width-xs)"
      },
      {
        "id": "nc-logo-wall-item-radius",
        "label": "Item Radius",
        "type": "radius",
        "default": "var(--fnd-radius-full)"
      },
      {
        "id": "nc-logo-wall-item-padding",
        "label": "Item Padding",
        "type": "size",
        "default": "0.75rem 1.25rem"
      },
      {
        "id": "nc-logo-wall-item-aspect-ratio",
        "label": "Item Aspect Ratio",
        "type": "generic",
        "default": "auto"
      },
      {
        "id": "nc-logo-wall-item-shadow",
        "label": "Item Shadow",
        "type": "color",
        "default": "none"
      },
      {
        "id": "nc-logo-wall-item-width-sm",
        "label": "Item Width SM",
        "type": "size",
        "default": "200px"
      },
      {
        "id": "nc-logo-wall-item-width-md",
        "label": "Item Width MD",
        "type": "size",
        "default": "260px"
      },
      {
        "id": "nc-logo-wall-item-width-lg",
        "label": "Item Width LG",
        "type": "size",
        "default": "380px"
      },
      {
        "id": "nc-logo-wall-item-height",
        "label": "Item Height",
        "type": "size",
        "default": "auto"
      },
      {
        "id": "nc-logo-wall-logo-max-height",
        "label": "Logo Max Height",
        "type": "size",
        "default": "88px"
      },
      {
        "id": "nc-logo-wall-logo-opacity",
        "label": "Logo Opacity",
        "type": "opacity",
        "default": "1"
      },
      {
        "id": "nc-logo-wall-logo-filter",
        "label": "Logo Filter",
        "type": "generic",
        "default": "none"
      },
      {
        "id": "nc-logo-wall-logo-filter-hover",
        "label": "Logo Filter Hover",
        "type": "generic",
        "default": "none"
      },
      {
        "id": "nc-logo-wall-logo-opacity-hover",
        "label": "Logo Opacity Hover",
        "type": "opacity",
        "default": "1"
      },
      {
        "id": "nc-logo-wall-font-size",
        "label": "Font Size",
        "type": "size",
        "default": "var(--fs-sm)"
      },
      {
        "id": "nc-logo-wall-font-weight",
        "label": "Font Weight",
        "type": "fontWeight",
        "default": "var(--fnd-font-weight-semibold)"
      },
      {
        "id": "nc-logo-wall-color",
        "label": "Color",
        "type": "color",
        "ref": "text-secondary"
      },
      {
        "id": "nc-logo-wall-marquee-speed",
        "label": "Marquee Speed",
        "type": "generic",
        "default": "30s"
      },
      {
        "id": "nc-logo-wall-marquee-gap",
        "label": "Marquee Gap",
        "type": "spacing",
        "default": "var(--fnd-spacing-06)"
      },
      {
        "id": "nc-logo-wall-fadein-duration",
        "label": "Fadein Duration",
        "type": "duration",
        "default": "0.4s"
      },
      {
        "id": "nc-logo-wall-fadein-delay-step",
        "label": "Fadein Delay Step",
        "type": "duration",
        "default": "0.08s"
      },
      {
        "id": "nc-logo-wall-fadein-easing",
        "label": "Fadein Easing",
        "type": "generic",
        "default": "ease-out"
      },
      {
        "id": "nc-logo-wall-item-hover-shadow",
        "label": "Item Hover Shadow",
        "type": "color",
        "default": "var(--fnd-shadow-xs)"
      },
      {
        "id": "nc-logo-wall-item-hover-border",
        "label": "Item Hover Border",
        "type": "color",
        "ref": "border-primary"
      },
      {
        "id": "nc-logo-wall-item-transition",
        "label": "Item Transition",
        "type": "generic",
        "default": "var(--fnd-motion-duration-200)"
      }
    ]
  },
  {
    "id": "media-frame",
    "label": "Media Frame",
    "icon": "components",
    "subgroups": [
      {
        "id": "geometry",
        "label": "Geometrie",
        "tokenIds": [
          "nc-media-frame-border-width",
          "nc-media-frame-radius"
        ]
      },
      {
        "id": "colors",
        "label": "Farben",
        "category": "main",
        "tokenIds": [
          "nc-media-frame-border-color",
          "nc-media-frame-shadow"
        ]
      }
    ],
    "tokens": [
      {
        "id": "nc-media-frame-border-width",
        "label": "Border Width",
        "type": "size",
        "default": "var(--fnd-border-width-hairline)"
      },
      {
        "id": "nc-media-frame-border-color",
        "label": "Border Color",
        "type": "color",
        "default": "var(--fnd-color-border-hairline)"
      },
      {
        "id": "nc-media-frame-radius",
        "label": "Radius",
        "type": "radius",
        "default": "var(--fnd-radius-md)"
      },
      {
        "id": "nc-media-frame-shadow",
        "label": "Shadow",
        "type": "color",
        "default": "0 1px 2px rgba(0, 0, 0, 0.50),\n        0 8px 20px -6px rgba(0, 0, 0, 0.60),\n        0 30px 60px -24px rgba(0, 0, 0, 0.80)",
        "darkDefault": "0 1px 2px rgba(0, 0, 0, 0.50),\n      0 8px 20px -6px rgba(0, 0, 0, 0.60),\n      0 30px 60px -24px rgba(0, 0, 0, 0.80)"
      }
    ]
  },
  {
    "id": "metric",
    "label": "Metric",
    "icon": "components",
    "subgroups": [
      {
        "id": "geometry",
        "label": "Geometrie",
        "tokenIds": [
          "nc-metric-radius",
          "nc-metric-padding",
          "nc-metric-gap",
          "nc-metric-trend-gap",
          "nc-metric-trend-icon-size",
          "nc-metric-md-padding",
          "nc-metric-xl-padding"
        ]
      },
      {
        "id": "typography",
        "label": "Typografie",
        "tokenIds": [
          "nc-metric-value-font-family",
          "nc-metric-value-font-size",
          "nc-metric-value-font-weight",
          "nc-metric-value-line-height",
          "nc-metric-unit-font-size",
          "nc-metric-unit-font-weight",
          "nc-metric-label-font-family",
          "nc-metric-label-font-size",
          "nc-metric-label-transform",
          "nc-metric-label-tracking",
          "nc-metric-label-font-weight",
          "nc-metric-trend-font-size",
          "nc-metric-trend-font-weight",
          "nc-metric-footer-font-size",
          "nc-metric-md-value-font-size",
          "nc-metric-md-unit-font-size",
          "nc-metric-md-label-font-size",
          "nc-metric-xl-value-font-size",
          "nc-metric-xl-unit-font-size",
          "nc-metric-xl-label-font-size"
        ]
      },
      {
        "id": "colors",
        "label": "Farben",
        "category": "main",
        "tokenIds": [
          "nc-metric-bg",
          "nc-metric-color",
          "nc-metric-value-color",
          "nc-metric-unit-color",
          "nc-metric-label-color",
          "nc-metric-trend-up-color",
          "nc-metric-trend-down-color",
          "nc-metric-trend-neutral-color",
          "nc-metric-footer-color",
          "nc-metric-subtle-bg",
          "nc-metric-subtle-color",
          "nc-metric-subtle-value-color",
          "nc-metric-subtle-label-color",
          "nc-metric-subtle-footer-color"
        ]
      },
      {
        "id": "interaction",
        "label": "Bewegung & Zustand",
        "category": "state",
        "tokenIds": [
          "nc-metric-label-opacity",
          "nc-metric-footer-opacity",
          "nc-metric-subtle-label-opacity",
          "nc-metric-subtle-footer-opacity"
        ]
      }
    ],
    "tokens": [
      {
        "id": "nc-metric-bg",
        "label": "BG",
        "type": "color",
        "ref": "background-inverse"
      },
      {
        "id": "nc-metric-color",
        "label": "Color",
        "type": "color",
        "ref": "text-inverse"
      },
      {
        "id": "nc-metric-radius",
        "label": "Radius",
        "type": "radius",
        "default": "var(--fnd-radius-sm)"
      },
      {
        "id": "nc-metric-padding",
        "label": "Padding",
        "type": "spacing",
        "default": "var(--fnd-spacing-06)"
      },
      {
        "id": "nc-metric-gap",
        "label": "Gap",
        "type": "spacing",
        "default": "var(--fnd-spacing-02)"
      },
      {
        "id": "nc-metric-value-font-family",
        "label": "Value Font Family",
        "type": "size",
        "default": "var(--font-mono)"
      },
      {
        "id": "nc-metric-value-font-size",
        "label": "Value Font Size",
        "type": "size",
        "default": "var(--fs-6xl)"
      },
      {
        "id": "nc-metric-value-font-weight",
        "label": "Value Font Weight",
        "type": "fontWeight",
        "default": "var(--fnd-font-weight-bold)"
      },
      {
        "id": "nc-metric-value-color",
        "label": "Value Color",
        "type": "color",
        "ref": "background-accent"
      },
      {
        "id": "nc-metric-value-line-height",
        "label": "Value Line Height",
        "type": "size",
        "default": "1.1"
      },
      {
        "id": "nc-metric-unit-font-size",
        "label": "Unit Font Size",
        "type": "size",
        "default": "var(--fs-xl)"
      },
      {
        "id": "nc-metric-unit-color",
        "label": "Unit Color",
        "type": "color",
        "ref": "background-accent"
      },
      {
        "id": "nc-metric-unit-font-weight",
        "label": "Unit Font Weight",
        "type": "fontWeight",
        "default": "var(--fnd-font-weight-bold)"
      },
      {
        "id": "nc-metric-label-font-family",
        "label": "Label Font Family",
        "type": "size",
        "default": "var(--font-mono)"
      },
      {
        "id": "nc-metric-label-font-size",
        "label": "Label Font Size",
        "type": "size",
        "default": "var(--nc-mono-label-size-sm)"
      },
      {
        "id": "nc-metric-label-transform",
        "label": "Label Transform",
        "type": "size",
        "default": "uppercase"
      },
      {
        "id": "nc-metric-label-tracking",
        "label": "Label Tracking",
        "type": "size",
        "default": "var(--nc-mono-tracking-caps)"
      },
      {
        "id": "nc-metric-label-color",
        "label": "Label Color",
        "type": "color",
        "ref": "text-inverse"
      },
      {
        "id": "nc-metric-label-font-weight",
        "label": "Label Font Weight",
        "type": "fontWeight",
        "default": "var(--fnd-font-weight-medium)"
      },
      {
        "id": "nc-metric-label-opacity",
        "label": "Label Opacity",
        "type": "opacity",
        "default": "0.75"
      },
      {
        "id": "nc-metric-trend-font-size",
        "label": "Trend Font Size",
        "type": "size",
        "default": "var(--fs-sm)"
      },
      {
        "id": "nc-metric-trend-font-weight",
        "label": "Trend Font Weight",
        "type": "fontWeight",
        "default": "var(--fnd-font-weight-semibold)"
      },
      {
        "id": "nc-metric-trend-gap",
        "label": "Trend Gap",
        "type": "spacing",
        "default": "var(--fnd-spacing-01)"
      },
      {
        "id": "nc-metric-trend-icon-size",
        "label": "Trend Icon Size",
        "type": "size",
        "default": "16px"
      },
      {
        "id": "nc-metric-trend-up-color",
        "label": "Trend Up Color",
        "type": "color",
        "ref": "feedback-success"
      },
      {
        "id": "nc-metric-trend-down-color",
        "label": "Trend Down Color",
        "type": "color",
        "ref": "feedback-danger"
      },
      {
        "id": "nc-metric-trend-neutral-color",
        "label": "Trend Neutral Color",
        "type": "color",
        "ref": "text-tertiary"
      },
      {
        "id": "nc-metric-footer-font-size",
        "label": "Footer Font Size",
        "type": "size",
        "default": "var(--fs-xs)"
      },
      {
        "id": "nc-metric-footer-color",
        "label": "Footer Color",
        "type": "color",
        "ref": "text-inverse"
      },
      {
        "id": "nc-metric-footer-opacity",
        "label": "Footer Opacity",
        "type": "opacity",
        "default": "0.5"
      },
      {
        "id": "nc-metric-subtle-bg",
        "label": "Subtle BG",
        "type": "color",
        "ref": "background-secondary",
        "darkDefault": "var(--fnd-color-background-secondary)"
      },
      {
        "id": "nc-metric-subtle-color",
        "label": "Subtle Color",
        "type": "color",
        "ref": "text-primary"
      },
      {
        "id": "nc-metric-subtle-value-color",
        "label": "Subtle Value Color",
        "type": "color",
        "ref": "interactive-default",
        "darkDefault": "var(--fnd-color-interactive-default)"
      },
      {
        "id": "nc-metric-subtle-label-color",
        "label": "Subtle Label Color",
        "type": "color",
        "ref": "text-secondary"
      },
      {
        "id": "nc-metric-subtle-label-opacity",
        "label": "Subtle Label Opacity",
        "type": "opacity",
        "default": "1"
      },
      {
        "id": "nc-metric-subtle-footer-color",
        "label": "Subtle Footer Color",
        "type": "color",
        "ref": "text-tertiary"
      },
      {
        "id": "nc-metric-subtle-footer-opacity",
        "label": "Subtle Footer Opacity",
        "type": "opacity",
        "default": "1"
      },
      {
        "id": "nc-metric-md-padding",
        "label": "MD Padding",
        "type": "spacing",
        "default": "var(--fnd-spacing-04)"
      },
      {
        "id": "nc-metric-md-value-font-size",
        "label": "MD Value Font Size",
        "type": "size",
        "default": "var(--fs-3xl)"
      },
      {
        "id": "nc-metric-md-unit-font-size",
        "label": "MD Unit Font Size",
        "type": "size",
        "default": "var(--fs-lg)"
      },
      {
        "id": "nc-metric-md-label-font-size",
        "label": "MD Label Font Size",
        "type": "size",
        "default": "var(--fs-xs)"
      },
      {
        "id": "nc-metric-xl-padding",
        "label": "XL Padding",
        "type": "spacing",
        "default": "var(--fnd-spacing-08)"
      },
      {
        "id": "nc-metric-xl-value-font-size",
        "label": "XL Value Font Size",
        "type": "size",
        "default": "var(--fs-8xl)"
      },
      {
        "id": "nc-metric-xl-unit-font-size",
        "label": "XL Unit Font Size",
        "type": "size",
        "default": "var(--fs-3xl)"
      },
      {
        "id": "nc-metric-xl-label-font-size",
        "label": "XL Label Font Size",
        "type": "size",
        "default": "var(--fs-base)"
      }
    ]
  },
  {
    "id": "notification",
    "label": "Notification",
    "icon": "components",
    "subgroups": [
      {
        "id": "geometry",
        "label": "Geometrie",
        "tokenIds": [
          "nc-notification-padding",
          "nc-notification-radius",
          "nc-notification-border-width",
          "nc-notification-max-width",
          "nc-notification-gap",
          "nc-notification-header-gap",
          "nc-notification-title-size",
          "nc-notification-meta-size",
          "nc-notification-body-size",
          "nc-notification-media-size",
          "nc-notification-media-radius",
          "nc-notification-unread-dot-size",
          "nc-notification-close-size",
          "nc-notification-close-radius",
          "nc-notification-footer-gap",
          "nc-notification-action-size",
          "nc-notification-priority-border-width"
        ]
      },
      {
        "id": "typography",
        "label": "Typografie",
        "tokenIds": [
          "nc-notification-title-weight",
          "nc-notification-body-line-height",
          "nc-notification-action-weight"
        ]
      },
      {
        "id": "colors",
        "label": "Farben",
        "category": "main",
        "tokenIds": [
          "nc-notification-shadow",
          "nc-notification-bg",
          "nc-notification-border-color",
          "nc-notification-title-color",
          "nc-notification-meta-color",
          "nc-notification-body-color",
          "nc-notification-unread-dot-color",
          "nc-notification-unread-bg",
          "nc-notification-action-color",
          "nc-notification-priority-border-color",
          "nc-notification-feature-color",
          "nc-notification-system-color",
          "nc-notification-promo-color"
        ]
      },
      {
        "id": "interaction",
        "label": "Bewegung & Zustand",
        "category": "state",
        "tokenIds": [
          "nc-notification-close-opacity",
          "nc-notification-close-opacity-hover",
          "nc-notification-transition-duration",
          "nc-notification-dismiss-duration"
        ]
      }
    ],
    "tokens": [
      {
        "id": "nc-notification-padding",
        "label": "Padding",
        "type": "spacing",
        "default": "var(--fnd-spacing-05)"
      },
      {
        "id": "nc-notification-radius",
        "label": "Radius",
        "type": "radius",
        "default": "var(--fnd-radius-md)"
      },
      {
        "id": "nc-notification-shadow",
        "label": "Shadow",
        "type": "color",
        "default": "var(--fnd-elevation-overlay)"
      },
      {
        "id": "nc-notification-bg",
        "label": "BG",
        "type": "color",
        "default": "var(--fnd-color-surface-elevated)"
      },
      {
        "id": "nc-notification-border-width",
        "label": "Border Width",
        "type": "size",
        "default": "var(--fnd-border-width-xs)"
      },
      {
        "id": "nc-notification-border-color",
        "label": "Border Color",
        "type": "color",
        "ref": "border-secondary"
      },
      {
        "id": "nc-notification-max-width",
        "label": "Max Width",
        "type": "size",
        "default": "400px"
      },
      {
        "id": "nc-notification-gap",
        "label": "Gap",
        "type": "spacing",
        "default": "var(--fnd-spacing-03)"
      },
      {
        "id": "nc-notification-header-gap",
        "label": "Header Gap",
        "type": "spacing",
        "default": "var(--fnd-spacing-02)"
      },
      {
        "id": "nc-notification-title-size",
        "label": "Title Size",
        "type": "size",
        "default": "var(--fs-sm)"
      },
      {
        "id": "nc-notification-title-weight",
        "label": "Title Weight",
        "type": "fontWeight",
        "default": "var(--fnd-font-weight-semibold)"
      },
      {
        "id": "nc-notification-title-color",
        "label": "Title Color",
        "type": "color",
        "ref": "text-primary"
      },
      {
        "id": "nc-notification-meta-size",
        "label": "Meta Size",
        "type": "size",
        "default": "var(--fs-xs)"
      },
      {
        "id": "nc-notification-meta-color",
        "label": "Meta Color",
        "type": "color",
        "ref": "text-tertiary"
      },
      {
        "id": "nc-notification-body-size",
        "label": "Body Size",
        "type": "size",
        "default": "var(--fs-sm)"
      },
      {
        "id": "nc-notification-body-color",
        "label": "Body Color",
        "type": "color",
        "ref": "text-secondary"
      },
      {
        "id": "nc-notification-body-line-height",
        "label": "Body Line Height",
        "type": "size",
        "default": "1.5"
      },
      {
        "id": "nc-notification-media-size",
        "label": "Media Size",
        "type": "size",
        "default": "48px"
      },
      {
        "id": "nc-notification-media-radius",
        "label": "Media Radius",
        "type": "radius",
        "default": "var(--fnd-radius-sm)"
      },
      {
        "id": "nc-notification-unread-dot-size",
        "label": "Unread Dot Size",
        "type": "size",
        "default": "8px"
      },
      {
        "id": "nc-notification-unread-dot-color",
        "label": "Unread Dot Color",
        "type": "color",
        "ref": "interactive-default"
      },
      {
        "id": "nc-notification-unread-bg",
        "label": "Unread BG",
        "type": "color",
        "default": "color-mix(in srgb, var(--fnd-color-interactive-default) 6%, transparent)"
      },
      {
        "id": "nc-notification-close-size",
        "label": "Close Size",
        "type": "size",
        "default": "24px"
      },
      {
        "id": "nc-notification-close-radius",
        "label": "Close Radius",
        "type": "radius",
        "default": "var(--fnd-radius-sm)"
      },
      {
        "id": "nc-notification-close-opacity",
        "label": "Close Opacity",
        "type": "opacity",
        "default": "var(--fnd-opacity-disabled)"
      },
      {
        "id": "nc-notification-close-opacity-hover",
        "label": "Close Opacity Hover",
        "type": "opacity",
        "default": "1"
      },
      {
        "id": "nc-notification-footer-gap",
        "label": "Footer Gap",
        "type": "spacing",
        "default": "var(--fnd-spacing-03)"
      },
      {
        "id": "nc-notification-action-size",
        "label": "Action Size",
        "type": "size",
        "default": "var(--fs-xs)"
      },
      {
        "id": "nc-notification-action-weight",
        "label": "Action Weight",
        "type": "fontWeight",
        "default": "var(--fnd-font-weight-semibold)"
      },
      {
        "id": "nc-notification-action-color",
        "label": "Action Color",
        "type": "color",
        "ref": "interactive-default"
      },
      {
        "id": "nc-notification-priority-border-width",
        "label": "Priority Border Width",
        "type": "size",
        "default": "4px"
      },
      {
        "id": "nc-notification-priority-border-color",
        "label": "Priority Border Color",
        "type": "color",
        "ref": "feedback-warning"
      },
      {
        "id": "nc-notification-feature-color",
        "label": "Feature Color",
        "type": "color",
        "ref": "interactive-default"
      },
      {
        "id": "nc-notification-system-color",
        "label": "System Color",
        "type": "color",
        "ref": "feedback-warning"
      },
      {
        "id": "nc-notification-promo-color",
        "label": "Promo Color",
        "type": "color",
        "ref": "feedback-success"
      },
      {
        "id": "nc-notification-transition-duration",
        "label": "Transition Duration",
        "type": "duration",
        "default": "var(--fnd-motion-duration-200)"
      },
      {
        "id": "nc-notification-dismiss-duration",
        "label": "Dismiss Duration",
        "type": "duration",
        "default": "var(--fnd-motion-duration-300)"
      }
    ]
  },
  {
    "id": "product-showcase",
    "label": "Product Showcase",
    "icon": "components",
    "subgroups": [
      {
        "id": "geometry",
        "label": "Geometrie",
        "tokenIds": [
          "nc-product-showcase-gap",
          "nc-product-showcase-options-width",
          "nc-product-showcase-padding",
          "nc-product-showcase-option-gap",
          "nc-product-showcase-option-padding",
          "nc-product-showcase-indicator-size",
          "nc-product-showcase-indicator-radius",
          "nc-product-showcase-headline-size",
          "nc-product-showcase-desc-size",
          "nc-product-showcase-media-radius",
          "nc-product-showcase-sticky-top",
          "nc-product-showcase-acc-label-size",
          "nc-product-showcase-acc-title-size",
          "nc-product-showcase-acc-text-size",
          "nc-product-showcase-acc-text-max",
          "nc-product-showcase-acc-gap",
          "nc-product-showcase-acc-marker-width",
          "nc-product-showcase-acc-marker-inset",
          "nc-product-showcase-acc-columns-gap",
          "nc-product-showcase-acc-card-width",
          "nc-product-showcase-acc-card-gap",
          "nc-product-showcase-acc-marker-gap"
        ]
      },
      {
        "id": "typography",
        "label": "Typografie",
        "tokenIds": [
          "nc-product-showcase-option-font-family",
          "nc-product-showcase-option-font-size",
          "nc-product-showcase-option-font-weight",
          "nc-product-showcase-options-align",
          "nc-product-showcase-label-font-size",
          "nc-product-showcase-label-font-family",
          "nc-product-showcase-headline-weight",
          "nc-product-showcase-acc-label-weight",
          "nc-product-showcase-acc-label-tracking",
          "nc-product-showcase-acc-title-weight",
          "nc-product-showcase-acc-title-tracking"
        ]
      },
      {
        "id": "colors",
        "label": "Farben",
        "category": "main",
        "tokenIds": [
          "nc-product-showcase-option-color",
          "nc-product-showcase-option-color-active",
          "nc-product-showcase-option-color-hover",
          "nc-product-showcase-label-color",
          "nc-product-showcase-headline-color",
          "nc-product-showcase-desc-color",
          "nc-product-showcase-media-bg",
          "nc-product-showcase-acc-label-color",
          "nc-product-showcase-acc-title-color",
          "nc-product-showcase-acc-text-color"
        ]
      },
      {
        "id": "interaction",
        "label": "Bewegung & Zustand",
        "category": "state",
        "tokenIds": [
          "nc-product-showcase-animation-duration",
          "nc-product-showcase-animation-easing",
          "nc-product-showcase-acc-duration"
        ]
      },
      {
        "id": "other",
        "label": "Weitere",
        "tokenIds": [
          "nc-product-showcase-label-family",
          "nc-product-showcase-media-aspect-ratio",
          "nc-product-showcase-acc-label-family",
          "nc-product-showcase-acc-title-family",
          "nc-product-showcase-acc-title-lh",
          "nc-product-showcase-acc-text-lh",
          "nc-product-showcase-acc-pad",
          "nc-product-showcase-acc-rule",
          "nc-product-showcase-acc-marker",
          "nc-product-showcase-acc-device-col",
          "nc-product-showcase-acc-device-reserve"
        ]
      }
    ],
    "tokens": [
      {
        "id": "nc-product-showcase-gap",
        "label": "Gap",
        "type": "spacing",
        "default": "var(--fnd-spacing-08)"
      },
      {
        "id": "nc-product-showcase-options-width",
        "label": "Options Width",
        "type": "size",
        "default": "280px"
      },
      {
        "id": "nc-product-showcase-padding",
        "label": "Padding",
        "type": "spacing",
        "default": "var(--fnd-spacing-08)"
      },
      {
        "id": "nc-product-showcase-option-font-family",
        "label": "Option Font Family",
        "type": "size",
        "default": "var(--fnd-typography-fonts-heading)"
      },
      {
        "id": "nc-product-showcase-option-font-size",
        "label": "Option Font Size",
        "type": "size",
        "default": "var(--fs-xl)"
      },
      {
        "id": "nc-product-showcase-option-font-weight",
        "label": "Option Font Weight",
        "type": "fontWeight",
        "default": "var(--fnd-font-weight-bold)"
      },
      {
        "id": "nc-product-showcase-options-align",
        "label": "Options Align",
        "type": "size",
        "default": "center"
      },
      {
        "id": "nc-product-showcase-option-color",
        "label": "Option Color",
        "type": "color",
        "default": "color-mix(in srgb, var(--fnd-color-text-inverse) 40%, transparent)"
      },
      {
        "id": "nc-product-showcase-option-color-active",
        "label": "Option Color Active",
        "type": "color",
        "ref": "text-inverse"
      },
      {
        "id": "nc-product-showcase-option-color-hover",
        "label": "Option Color Hover",
        "type": "color",
        "default": "color-mix(in srgb, var(--fnd-color-text-inverse) 70%, transparent)"
      },
      {
        "id": "nc-product-showcase-option-gap",
        "label": "Option Gap",
        "type": "spacing",
        "default": "var(--fnd-spacing-02)"
      },
      {
        "id": "nc-product-showcase-option-padding",
        "label": "Option Padding",
        "type": "spacing",
        "default": "var(--fnd-spacing-02) 0"
      },
      {
        "id": "nc-product-showcase-label-family",
        "label": "Label Family",
        "type": "generic",
        "default": "var(--font-mono)"
      },
      {
        "id": "nc-product-showcase-label-font-size",
        "label": "Label Font Size",
        "type": "size",
        "default": "var(--nc-mono-label-size)"
      },
      {
        "id": "nc-product-showcase-label-font-family",
        "label": "Label Font Family",
        "type": "size",
        "default": "var(--fnd-typography-fonts-body)"
      },
      {
        "id": "nc-product-showcase-label-color",
        "label": "Label Color",
        "type": "color",
        "ref": "text-secondary"
      },
      {
        "id": "nc-product-showcase-indicator-size",
        "label": "Indicator Size",
        "type": "size",
        "default": "12px"
      },
      {
        "id": "nc-product-showcase-indicator-radius",
        "label": "Indicator Radius",
        "type": "radius",
        "default": "var(--fnd-radius-full)"
      },
      {
        "id": "nc-product-showcase-headline-size",
        "label": "Headline Size",
        "type": "size",
        "default": "var(--nc-block-headline-size, var(--fs-2xl))"
      },
      {
        "id": "nc-product-showcase-headline-weight",
        "label": "Headline Weight",
        "type": "fontWeight",
        "default": "var(--fnd-font-weight-bold)"
      },
      {
        "id": "nc-product-showcase-headline-color",
        "label": "Headline Color",
        "type": "color",
        "ref": "text-inverse"
      },
      {
        "id": "nc-product-showcase-desc-size",
        "label": "Desc Size",
        "type": "size",
        "default": "var(--fs-sm)"
      },
      {
        "id": "nc-product-showcase-desc-color",
        "label": "Desc Color",
        "type": "color",
        "default": "var(--nc-product-showcase-option-color)"
      },
      {
        "id": "nc-product-showcase-media-radius",
        "label": "Media Radius",
        "type": "radius",
        "default": "var(--fnd-radius-md)"
      },
      {
        "id": "nc-product-showcase-media-aspect-ratio",
        "label": "Media Aspect Ratio",
        "type": "generic",
        "default": "16 / 9"
      },
      {
        "id": "nc-product-showcase-media-bg",
        "label": "Media BG",
        "type": "color",
        "default": "transparent"
      },
      {
        "id": "nc-product-showcase-animation-duration",
        "label": "Animation Duration",
        "type": "duration",
        "default": "0.5s"
      },
      {
        "id": "nc-product-showcase-animation-easing",
        "label": "Animation Easing",
        "type": "generic",
        "default": "cubic-bezier(0.16, 1, 0.3, 1)"
      },
      {
        "id": "nc-product-showcase-sticky-top",
        "label": "Klebeabstand nach oben",
        "type": "size",
        "default": "calc(var(--nc-nav-height, 72px) + var(--fnd-spacing-06))"
      },
      {
        "id": "nc-product-showcase-acc-label-family",
        "label": "Acc Label Family",
        "type": "generic",
        "default": "var(--font-mono)"
      },
      {
        "id": "nc-product-showcase-acc-label-size",
        "label": "Acc Label Size",
        "type": "size",
        "default": "var(--fs-xs)"
      },
      {
        "id": "nc-product-showcase-acc-label-weight",
        "label": "Acc Label Weight",
        "type": "fontWeight",
        "default": "var(--nc-mono-label-weight-strong)"
      },
      {
        "id": "nc-product-showcase-acc-label-tracking",
        "label": "Acc Label Tracking",
        "type": "size",
        "default": "var(--nc-mono-tracking-caps)"
      },
      {
        "id": "nc-product-showcase-acc-label-color",
        "label": "Acc Label Color",
        "type": "color",
        "ref": "text-tertiary"
      },
      {
        "id": "nc-product-showcase-acc-title-family",
        "label": "Acc Title Family",
        "type": "generic",
        "default": "var(--font-heading)"
      },
      {
        "id": "nc-product-showcase-acc-title-size",
        "label": "Acc Title Size",
        "type": "size",
        "default": "var(--nc-type-heading-m-size)"
      },
      {
        "id": "nc-product-showcase-acc-title-weight",
        "label": "Acc Title Weight",
        "type": "fontWeight",
        "default": "var(--fnd-font-weight-semibold)"
      },
      {
        "id": "nc-product-showcase-acc-title-lh",
        "label": "Acc Title Lh",
        "type": "generic",
        "default": "var(--lh-heading)"
      },
      {
        "id": "nc-product-showcase-acc-title-tracking",
        "label": "Acc Title Tracking",
        "type": "size",
        "default": "var(--fnd-tracking-snug)"
      },
      {
        "id": "nc-product-showcase-acc-title-color",
        "label": "Acc Title Color",
        "type": "color",
        "ref": "text-primary"
      },
      {
        "id": "nc-product-showcase-acc-text-size",
        "label": "Acc Text Size",
        "type": "size",
        "default": "var(--nc-type-body-m-size)"
      },
      {
        "id": "nc-product-showcase-acc-text-lh",
        "label": "Acc Text Lh",
        "type": "generic",
        "default": "var(--lh-body)"
      },
      {
        "id": "nc-product-showcase-acc-text-color",
        "label": "Acc Text Color",
        "type": "color",
        "ref": "text-secondary"
      },
      {
        "id": "nc-product-showcase-acc-text-max",
        "label": "Acc Text Max",
        "type": "size",
        "default": "58ch"
      },
      {
        "id": "nc-product-showcase-acc-gap",
        "label": "Acc Gap",
        "type": "spacing",
        "default": "var(--fnd-spacing-02)"
      },
      {
        "id": "nc-product-showcase-acc-pad",
        "label": "Acc Pad",
        "type": "spacing",
        "default": "var(--fnd-spacing-05) 0"
      },
      {
        "id": "nc-product-showcase-acc-rule",
        "label": "Acc Rule",
        "type": "color",
        "ref": "border-primary"
      },
      {
        "id": "nc-product-showcase-acc-marker",
        "label": "Acc Marker",
        "type": "color",
        "ref": "background-accent"
      },
      {
        "id": "nc-product-showcase-acc-marker-width",
        "label": "Acc Marker Width",
        "type": "size",
        "default": "3px"
      },
      {
        "id": "nc-product-showcase-acc-device-col",
        "label": "Acc Device Col",
        "type": "generic",
        "default": "auto"
      },
      {
        "id": "nc-product-showcase-acc-duration",
        "label": "Acc Duration",
        "type": "duration",
        "default": "var(--fnd-motion-duration-300, 300ms)"
      },
      {
        "id": "nc-product-showcase-acc-marker-inset",
        "label": "Acc Marker Inset",
        "type": "size",
        "default": "var(--nc-product-showcase-option-gap)"
      },
      {
        "id": "nc-product-showcase-acc-columns-gap",
        "label": "Acc Columns Gap",
        "type": "size",
        "default": "calc(var(--nc-product-showcase-gap) * 2)"
      },
      {
        "id": "nc-product-showcase-acc-card-width",
        "label": "Acc Card Width",
        "type": "size",
        "default": "min(84%, 26rem)"
      },
      {
        "id": "nc-product-showcase-acc-card-gap",
        "label": "Acc Card Gap",
        "type": "spacing",
        "default": "var(--fnd-spacing-05)"
      },
      {
        "id": "nc-product-showcase-acc-device-reserve",
        "label": "Acc Device Reserve",
        "type": "size",
        "default": "150px"
      },
      {
        "id": "nc-product-showcase-acc-marker-gap",
        "label": "Acc Marker Gap",
        "type": "spacing",
        "default": "var(--fnd-spacing-04)"
      }
    ]
  },
  {
    "id": "section-header",
    "label": "Section Header",
    "icon": "components",
    "subgroups": [
      {
        "id": "geometry",
        "label": "Geometrie",
        "tokenIds": [
          "nc-section-header-gap"
        ]
      },
      {
        "id": "typography",
        "label": "Typografie",
        "tokenIds": [
          "nc-section-header-label-font-size",
          "nc-section-header-label-font-weight",
          "nc-section-header-label-letter-spacing",
          "nc-section-header-label-text-transform",
          "nc-section-header-title-font-size",
          "nc-section-header-title-font-weight",
          "nc-section-header-title-line-height",
          "nc-section-header-title-letter-spacing",
          "nc-section-header-subtitle-font-size",
          "nc-section-header-subtitle-line-height"
        ]
      },
      {
        "id": "colors",
        "label": "Farben",
        "category": "main",
        "tokenIds": [
          "nc-section-header-label-color",
          "nc-section-header-title-color",
          "nc-section-header-subtitle-color"
        ]
      },
      {
        "id": "other",
        "label": "Weitere",
        "tokenIds": [
          "nc-section-header-label-spacing",
          "nc-section-header-badges-spacing",
          "nc-section-header-title-spacing"
        ]
      }
    ],
    "tokens": [
      {
        "id": "nc-section-header-gap",
        "label": "Gap",
        "type": "spacing",
        "default": "var(--fnd-spacing-08)"
      },
      {
        "id": "nc-section-header-label-font-size",
        "label": "Label Font Size",
        "type": "size",
        "default": "var(--nc-kicker-font-size)"
      },
      {
        "id": "nc-section-header-label-font-weight",
        "label": "Label Font Weight",
        "type": "fontWeight",
        "default": "800"
      },
      {
        "id": "nc-section-header-label-letter-spacing",
        "label": "Label Letter Spacing",
        "type": "size",
        "default": "var(--nc-kicker-letter-spacing)"
      },
      {
        "id": "nc-section-header-label-text-transform",
        "label": "Label Text Transform",
        "type": "size",
        "default": "var(--nc-kicker-text-transform)"
      },
      {
        "id": "nc-section-header-label-color",
        "label": "Label Color",
        "type": "color",
        "default": "var(--fnd-neutral-800)"
      },
      {
        "id": "nc-section-header-label-spacing",
        "label": "Label Spacing",
        "type": "generic",
        "default": "var(--nc-kicker-spacing)"
      },
      {
        "id": "nc-section-header-badges-spacing",
        "label": "Badges Spacing",
        "type": "spacing",
        "default": "var(--fnd-spacing-04)"
      },
      {
        "id": "nc-section-header-title-font-size",
        "label": "Title Font Size",
        "type": "size",
        "default": "var(--fnd-typography-heading-m-font-size)"
      },
      {
        "id": "nc-section-header-title-font-weight",
        "label": "Title Font Weight",
        "type": "fontWeight",
        "default": "var(--fnd-font-weight-bold)"
      },
      {
        "id": "nc-section-header-title-line-height",
        "label": "Title Line Height",
        "type": "size",
        "default": "var(--fnd-typography-heading-m-line-height)"
      },
      {
        "id": "nc-section-header-title-letter-spacing",
        "label": "Title Letter Spacing",
        "type": "size",
        "default": "var(--fnd-typography-heading-m-letter-spacing)"
      },
      {
        "id": "nc-section-header-title-color",
        "label": "Title Color",
        "type": "color",
        "ref": "text-primary"
      },
      {
        "id": "nc-section-header-title-spacing",
        "label": "Title Spacing",
        "type": "spacing",
        "default": "var(--fnd-spacing-04)"
      },
      {
        "id": "nc-section-header-subtitle-font-size",
        "label": "Subtitle Font Size",
        "type": "size",
        "default": "var(--fnd-typography-paragraph-xl-font-size)"
      },
      {
        "id": "nc-section-header-subtitle-line-height",
        "label": "Subtitle Line Height",
        "type": "size",
        "default": "var(--fnd-typography-paragraph-xl-line-height)"
      },
      {
        "id": "nc-section-header-subtitle-color",
        "label": "Subtitle Color",
        "type": "color",
        "default": "var(--nc-block-lead-color, var(--fnd-color-text-secondary))"
      }
    ]
  },
  {
    "id": "table",
    "label": "Table",
    "icon": "components",
    "subgroups": [
      {
        "id": "geometry",
        "label": "Geometrie",
        "tokenIds": [
          "nc-table-radius",
          "nc-table-border-width",
          "nc-table-cell-padding-compact",
          "nc-table-cell-padding-default",
          "nc-table-cell-padding-expressive",
          "nc-table-cell-padding",
          "nc-table-row-border-width",
          "nc-table-sort-icon-size",
          "nc-table-checkbox-size",
          "nc-table-checkbox-column-width"
        ]
      },
      {
        "id": "typography",
        "label": "Typografie",
        "tokenIds": [
          "nc-table-header-font-family",
          "nc-table-header-font-size",
          "nc-table-header-font-weight",
          "nc-table-header-letter-spacing",
          "nc-table-header-text-transform",
          "nc-table-font-size"
        ]
      },
      {
        "id": "colors",
        "label": "Farben",
        "category": "main",
        "tokenIds": [
          "nc-table-bg",
          "nc-table-shadow",
          "nc-table-border-color",
          "nc-table-header-bg",
          "nc-table-header-color",
          "nc-table-row-border-color",
          "nc-table-row-bg-hover",
          "nc-table-stripe-bg",
          "nc-table-row-bg-selected",
          "nc-table-row-border-selected",
          "nc-table-sticky-shadow",
          "nc-table-sort-icon-color",
          "nc-table-sort-icon-color-active",
          "nc-table-color",
          "nc-table-color-secondary",
          "nc-table-ghost-header-bg",
          "nc-table-ghost-header-color",
          "nc-table-ghost-border-color"
        ]
      },
      {
        "id": "interaction",
        "label": "Bewegung & Zustand",
        "category": "state",
        "tokenIds": [
          "nc-table-sticky-z-index",
          "nc-table-transition-duration"
        ]
      }
    ],
    "tokens": [
      {
        "id": "nc-table-bg",
        "label": "BG",
        "type": "color",
        "ref": "background-base"
      },
      {
        "id": "nc-table-radius",
        "label": "Radius",
        "type": "radius",
        "default": "var(--fnd-radius-md)"
      },
      {
        "id": "nc-table-shadow",
        "label": "Shadow",
        "type": "color",
        "default": "var(--fnd-elevation-raised)"
      },
      {
        "id": "nc-table-border-color",
        "label": "Border Color",
        "type": "color",
        "ref": "border-secondary"
      },
      {
        "id": "nc-table-border-width",
        "label": "Border Width",
        "type": "size",
        "default": "var(--fnd-border-width-xs)"
      },
      {
        "id": "nc-table-header-bg",
        "label": "Header BG",
        "type": "color",
        "ref": "background-inverse"
      },
      {
        "id": "nc-table-header-color",
        "label": "Header Color",
        "type": "color",
        "ref": "text-inverse"
      },
      {
        "id": "nc-table-header-font-family",
        "label": "Header Font Family",
        "type": "size",
        "default": "var(--font-mono)"
      },
      {
        "id": "nc-table-header-font-size",
        "label": "Header Font Size",
        "type": "size",
        "default": "var(--nc-mono-label-size-sm)"
      },
      {
        "id": "nc-table-header-font-weight",
        "label": "Header Font Weight",
        "type": "fontWeight",
        "default": "var(--nc-mono-label-weight)"
      },
      {
        "id": "nc-table-header-letter-spacing",
        "label": "Header Letter Spacing",
        "type": "size",
        "default": "var(--nc-mono-tracking-caps)"
      },
      {
        "id": "nc-table-header-text-transform",
        "label": "Header Text Transform",
        "type": "size",
        "default": "uppercase"
      },
      {
        "id": "nc-table-cell-padding-compact",
        "label": "Cell Padding Compact",
        "type": "spacing",
        "default": "var(--fnd-spacing-02) var(--fnd-spacing-03)"
      },
      {
        "id": "nc-table-cell-padding-default",
        "label": "Cell Padding Default",
        "type": "spacing",
        "default": "var(--fnd-spacing-03) var(--fnd-spacing-04)"
      },
      {
        "id": "nc-table-cell-padding-expressive",
        "label": "Cell Padding Expressive",
        "type": "spacing",
        "default": "var(--fnd-spacing-04) var(--fnd-spacing-05)"
      },
      {
        "id": "nc-table-cell-padding",
        "label": "Cell Padding",
        "type": "size",
        "default": "var(--nc-table-cell-padding-default)"
      },
      {
        "id": "nc-table-row-border-color",
        "label": "Row Border Color",
        "type": "color",
        "ref": "border-secondary"
      },
      {
        "id": "nc-table-row-border-width",
        "label": "Row Border Width",
        "type": "size",
        "default": "var(--fnd-border-width-xs)"
      },
      {
        "id": "nc-table-row-bg-hover",
        "label": "Row BG Hover",
        "type": "color",
        "ref": "background-secondary"
      },
      {
        "id": "nc-table-stripe-bg",
        "label": "Stripe BG",
        "type": "color",
        "default": "color-mix(in srgb, var(--fnd-color-background-secondary) 50%, transparent)"
      },
      {
        "id": "nc-table-row-bg-selected",
        "label": "Row BG Selected",
        "type": "color",
        "ref": "background-tertiary"
      },
      {
        "id": "nc-table-row-border-selected",
        "label": "Row Border Selected",
        "type": "color",
        "ref": "interactive-default"
      },
      {
        "id": "nc-table-sticky-shadow",
        "label": "Sticky Shadow",
        "type": "color",
        "default": "var(--fnd-elevation-raised)"
      },
      {
        "id": "nc-table-sticky-z-index",
        "label": "Sticky Z Index",
        "type": "generic",
        "default": "var(--fnd-z-sticky)"
      },
      {
        "id": "nc-table-sort-icon-size",
        "label": "Sort Icon Size",
        "type": "size",
        "default": "14px"
      },
      {
        "id": "nc-table-sort-icon-color",
        "label": "Sort Icon Color",
        "type": "color",
        "ref": "text-tertiary"
      },
      {
        "id": "nc-table-sort-icon-color-active",
        "label": "Sort Icon Color Active",
        "type": "color",
        "ref": "text-primary"
      },
      {
        "id": "nc-table-checkbox-size",
        "label": "Checkbox Size",
        "type": "size",
        "default": "16px"
      },
      {
        "id": "nc-table-checkbox-column-width",
        "label": "Checkbox Column Width",
        "type": "size",
        "default": "48px"
      },
      {
        "id": "nc-table-font-size",
        "label": "Font Size",
        "type": "size",
        "default": "var(--fs-sm)"
      },
      {
        "id": "nc-table-color",
        "label": "Color",
        "type": "color",
        "ref": "text-primary"
      },
      {
        "id": "nc-table-color-secondary",
        "label": "Color Secondary",
        "type": "color",
        "ref": "text-secondary"
      },
      {
        "id": "nc-table-transition-duration",
        "label": "Transition Duration",
        "type": "duration",
        "default": "var(--fnd-motion-duration-150)"
      },
      {
        "id": "nc-table-ghost-header-bg",
        "label": "Ghost Header BG",
        "type": "color",
        "default": "transparent"
      },
      {
        "id": "nc-table-ghost-header-color",
        "label": "Ghost Header Color",
        "type": "color",
        "ref": "text-secondary"
      },
      {
        "id": "nc-table-ghost-border-color",
        "label": "Ghost Border Color",
        "type": "color",
        "default": "transparent"
      }
    ]
  },
  {
    "id": "tabs",
    "label": "Tabs",
    "icon": "components",
    "subgroups": [
      {
        "id": "typography",
        "label": "Typografie",
        "tokenIds": [
          "nc-tabs-trigger-font-weight",
          "nc-tabs-trigger-font-weight-active"
        ]
      },
      {
        "id": "colors",
        "label": "Farben",
        "category": "main",
        "tokenIds": [
          "nc-tabs-trigger-color",
          "nc-tabs-trigger-color-hover",
          "nc-tabs-trigger-color-active",
          "nc-tabs-trigger-color-disabled",
          "nc-tabs-line-border-color",
          "nc-tabs-line-indicator-color",
          "nc-tabs-contained-bg"
        ]
      },
      {
        "id": "interaction",
        "label": "Bewegung & Zustand",
        "category": "state",
        "tokenIds": [
          "nc-tabs-trigger-disabled-opacity"
        ]
      }
    ],
    "tokens": [
      {
        "id": "nc-tabs-trigger-color",
        "label": "Trigger Color",
        "type": "color",
        "ref": "text-secondary"
      },
      {
        "id": "nc-tabs-trigger-color-hover",
        "label": "Trigger Color Hover",
        "type": "color",
        "ref": "text-primary"
      },
      {
        "id": "nc-tabs-trigger-color-active",
        "label": "Trigger Color Active",
        "type": "color",
        "ref": "interactive-default"
      },
      {
        "id": "nc-tabs-trigger-color-disabled",
        "label": "Trigger Color Disabled",
        "type": "color",
        "ref": "text-disabled"
      },
      {
        "id": "nc-tabs-trigger-font-weight",
        "label": "Trigger Font Weight",
        "type": "fontWeight",
        "default": "var(--fnd-font-weight-medium)"
      },
      {
        "id": "nc-tabs-trigger-font-weight-active",
        "label": "Trigger Font Weight Active",
        "type": "size",
        "default": "var(--fnd-font-weight-semibold)"
      },
      {
        "id": "nc-tabs-trigger-disabled-opacity",
        "label": "Trigger Disabled Opacity",
        "type": "opacity",
        "default": "var(--fnd-opacity-disabled)"
      },
      {
        "id": "nc-tabs-line-border-color",
        "label": "Line Border Color",
        "type": "color",
        "ref": "border-secondary"
      },
      {
        "id": "nc-tabs-line-indicator-color",
        "label": "Line Indicator Color",
        "type": "color",
        "ref": "interactive-default"
      },
      {
        "id": "nc-tabs-contained-bg",
        "label": "Contained BG",
        "type": "color",
        "ref": "background-secondary"
      }
    ]
  },
  {
    "id": "text-cta",
    "label": "Text Cta",
    "icon": "components",
    "subgroups": [
      {
        "id": "geometry",
        "label": "Geometrie",
        "tokenIds": [
          "nc-text-cta-gap",
          "nc-text-cta-content-gap",
          "nc-text-cta-card-padding",
          "nc-text-cta-card-radius",
          "nc-text-cta-list-gap",
          "nc-text-cta-card-icon-size",
          "nc-text-cta-card-icon-gap"
        ]
      },
      {
        "id": "colors",
        "label": "Farben",
        "category": "main",
        "tokenIds": [
          "nc-text-cta-card-bg",
          "nc-text-cta-card-border",
          "nc-text-cta-list-marker-color",
          "nc-text-cta-card-icon-color"
        ]
      },
      {
        "id": "other",
        "label": "Weitere",
        "tokenIds": [
          "nc-text-cta-columns",
          "nc-text-cta-columns-reverse"
        ]
      }
    ],
    "tokens": [
      {
        "id": "nc-text-cta-gap",
        "label": "Gap",
        "type": "size",
        "default": "var(--nc-text-media-gap)"
      },
      {
        "id": "nc-text-cta-content-gap",
        "label": "Content Gap",
        "type": "size",
        "default": "var(--nc-text-media-content-gap)"
      },
      {
        "id": "nc-text-cta-columns",
        "label": "Columns",
        "type": "generic",
        "default": "minmax(0, 1.35fr) minmax(0, 1fr)"
      },
      {
        "id": "nc-text-cta-columns-reverse",
        "label": "Columns Reverse",
        "type": "generic",
        "default": "minmax(0, 1fr) minmax(0, 1.35fr)"
      },
      {
        "id": "nc-text-cta-card-padding",
        "label": "Card Padding",
        "type": "spacing",
        "default": "var(--fnd-spacing-08)"
      },
      {
        "id": "nc-text-cta-card-radius",
        "label": "Card Radius",
        "type": "radius",
        "default": "var(--fnd-radius-2xl)"
      },
      {
        "id": "nc-text-cta-card-bg",
        "label": "Card BG",
        "type": "color",
        "ref": "background-base"
      },
      {
        "id": "nc-text-cta-card-border",
        "label": "Card Border",
        "type": "color",
        "ref": "border-secondary"
      },
      {
        "id": "nc-text-cta-list-gap",
        "label": "List Gap",
        "type": "spacing",
        "default": "var(--fnd-spacing-03)"
      },
      {
        "id": "nc-text-cta-list-marker-color",
        "label": "List Marker Color",
        "type": "color",
        "ref": "text-accent"
      },
      {
        "id": "nc-text-cta-card-icon-size",
        "label": "Card Icon Size",
        "type": "size",
        "default": "var(--fnd-size-xl, 40px)"
      },
      {
        "id": "nc-text-cta-card-icon-color",
        "label": "Card Icon Color",
        "type": "color",
        "ref": "text-accent"
      },
      {
        "id": "nc-text-cta-card-icon-gap",
        "label": "Card Icon Gap",
        "type": "spacing",
        "default": "var(--fnd-spacing-04)"
      }
    ]
  },
  {
    "id": "treeview",
    "label": "Treeview",
    "icon": "components",
    "subgroups": [
      {
        "id": "geometry",
        "label": "Geometrie",
        "tokenIds": [
          "nc-treeview-indent",
          "nc-treeview-item-height",
          "nc-treeview-item-height-compact",
          "nc-treeview-item-padding-x",
          "nc-treeview-gap",
          "nc-treeview-radius",
          "nc-treeview-toggle-size",
          "nc-treeview-icon-size",
          "nc-treeview-border-selected-width",
          "nc-treeview-guide-width",
          "nc-treeview-action-gap",
          "nc-treeview-action-size",
          "nc-treeview-checkbox-size",
          "nc-treeview-checkbox-gap",
          "nc-treeview-badge-radius",
          "nc-treeview-badge-padding",
          "nc-treeview-drop-indicator-width",
          "nc-treeview-bordered-border-width",
          "nc-treeview-bordered-radius",
          "nc-treeview-bordered-padding"
        ]
      },
      {
        "id": "typography",
        "label": "Typografie",
        "tokenIds": [
          "nc-treeview-label-font-size",
          "nc-treeview-label-font-weight",
          "nc-treeview-label-font-weight-selected",
          "nc-treeview-badge-font-size"
        ]
      },
      {
        "id": "colors",
        "label": "Farben",
        "category": "main",
        "tokenIds": [
          "nc-treeview-toggle-color",
          "nc-treeview-toggle-color-hover",
          "nc-treeview-icon-color",
          "nc-treeview-label-color",
          "nc-treeview-bg-hover",
          "nc-treeview-bg-selected",
          "nc-treeview-bg-active",
          "nc-treeview-border-selected",
          "nc-treeview-link-color",
          "nc-treeview-link-color-hover",
          "nc-treeview-guide-color",
          "nc-treeview-action-color",
          "nc-treeview-action-color-hover",
          "nc-treeview-badge-bg",
          "nc-treeview-badge-color",
          "nc-treeview-drop-indicator-color",
          "nc-treeview-bordered-border-color"
        ]
      },
      {
        "id": "interaction",
        "label": "Bewegung & Zustand",
        "category": "state",
        "tokenIds": [
          "nc-treeview-toggle-transition",
          "nc-treeview-disabled-opacity",
          "nc-treeview-transition-duration",
          "nc-treeview-guide-opacity",
          "nc-treeview-drag-opacity",
          "nc-treeview-expand-duration"
        ]
      },
      {
        "id": "other",
        "label": "Weitere",
        "tokenIds": [
          "nc-treeview-guide-style"
        ]
      }
    ],
    "tokens": [
      {
        "id": "nc-treeview-indent",
        "label": "Indent",
        "type": "size",
        "default": "24px"
      },
      {
        "id": "nc-treeview-item-height",
        "label": "Item Height",
        "type": "size",
        "default": "32px"
      },
      {
        "id": "nc-treeview-item-height-compact",
        "label": "Item Height Compact",
        "type": "size",
        "default": "28px"
      },
      {
        "id": "nc-treeview-item-padding-x",
        "label": "Item Padding X",
        "type": "spacing",
        "default": "var(--fnd-spacing-02)"
      },
      {
        "id": "nc-treeview-gap",
        "label": "Gap",
        "type": "spacing",
        "default": "var(--fnd-spacing-02)"
      },
      {
        "id": "nc-treeview-radius",
        "label": "Radius",
        "type": "radius",
        "default": "var(--fnd-radius-sm)"
      },
      {
        "id": "nc-treeview-toggle-size",
        "label": "Toggle Size",
        "type": "size",
        "default": "20px"
      },
      {
        "id": "nc-treeview-toggle-color",
        "label": "Toggle Color",
        "type": "color",
        "ref": "text-secondary"
      },
      {
        "id": "nc-treeview-toggle-color-hover",
        "label": "Toggle Color Hover",
        "type": "color",
        "ref": "text-primary"
      },
      {
        "id": "nc-treeview-toggle-transition",
        "label": "Toggle Transition",
        "type": "generic",
        "default": "var(--fnd-motion-duration-200)"
      },
      {
        "id": "nc-treeview-icon-size",
        "label": "Icon Size",
        "type": "size",
        "default": "20px"
      },
      {
        "id": "nc-treeview-icon-color",
        "label": "Icon Color",
        "type": "color",
        "ref": "text-secondary"
      },
      {
        "id": "nc-treeview-label-font-size",
        "label": "Label Font Size",
        "type": "size",
        "default": "var(--fs-sm)"
      },
      {
        "id": "nc-treeview-label-color",
        "label": "Label Color",
        "type": "color",
        "ref": "text-primary"
      },
      {
        "id": "nc-treeview-label-font-weight",
        "label": "Label Font Weight",
        "type": "fontWeight",
        "default": "var(--fnd-font-weight-regular)"
      },
      {
        "id": "nc-treeview-label-font-weight-selected",
        "label": "Label Font Weight Selected",
        "type": "size",
        "default": "var(--fnd-font-weight-medium)"
      },
      {
        "id": "nc-treeview-bg-hover",
        "label": "BG Hover",
        "type": "color",
        "ref": "background-secondary"
      },
      {
        "id": "nc-treeview-bg-selected",
        "label": "BG Selected",
        "type": "color",
        "ref": "background-tertiary"
      },
      {
        "id": "nc-treeview-bg-active",
        "label": "BG Active",
        "type": "color",
        "ref": "background-tertiary"
      },
      {
        "id": "nc-treeview-border-selected",
        "label": "Border Selected",
        "type": "color",
        "ref": "interactive-default"
      },
      {
        "id": "nc-treeview-border-selected-width",
        "label": "Border Selected Width",
        "type": "size",
        "default": "3px"
      },
      {
        "id": "nc-treeview-disabled-opacity",
        "label": "Disabled Opacity",
        "type": "opacity",
        "default": "var(--fnd-opacity-disabled)"
      },
      {
        "id": "nc-treeview-transition-duration",
        "label": "Transition Duration",
        "type": "duration",
        "default": "var(--fnd-motion-duration-150)"
      },
      {
        "id": "nc-treeview-link-color",
        "label": "Link Color",
        "type": "color",
        "ref": "interactive-default"
      },
      {
        "id": "nc-treeview-link-color-hover",
        "label": "Link Color Hover",
        "type": "color",
        "ref": "interactive-hover"
      },
      {
        "id": "nc-treeview-guide-color",
        "label": "Guide Color",
        "type": "color",
        "ref": "border-secondary"
      },
      {
        "id": "nc-treeview-guide-width",
        "label": "Guide Width",
        "type": "size",
        "default": "1px"
      },
      {
        "id": "nc-treeview-guide-style",
        "label": "Guide Style",
        "type": "generic",
        "default": "solid"
      },
      {
        "id": "nc-treeview-guide-opacity",
        "label": "Guide Opacity",
        "type": "opacity",
        "default": "0.5"
      },
      {
        "id": "nc-treeview-action-gap",
        "label": "Action Gap",
        "type": "spacing",
        "default": "var(--fnd-spacing-02)"
      },
      {
        "id": "nc-treeview-action-color",
        "label": "Action Color",
        "type": "color",
        "ref": "text-tertiary"
      },
      {
        "id": "nc-treeview-action-color-hover",
        "label": "Action Color Hover",
        "type": "color",
        "ref": "text-primary"
      },
      {
        "id": "nc-treeview-action-size",
        "label": "Action Size",
        "type": "size",
        "default": "20px"
      },
      {
        "id": "nc-treeview-checkbox-size",
        "label": "Checkbox Size",
        "type": "size",
        "default": "16px"
      },
      {
        "id": "nc-treeview-checkbox-gap",
        "label": "Checkbox Gap",
        "type": "spacing",
        "default": "var(--fnd-spacing-02)"
      },
      {
        "id": "nc-treeview-badge-font-size",
        "label": "Badge Font Size",
        "type": "size",
        "default": "var(--fs-2xs)"
      },
      {
        "id": "nc-treeview-badge-radius",
        "label": "Badge Radius",
        "type": "radius",
        "default": "var(--fnd-radius-full)"
      },
      {
        "id": "nc-treeview-badge-padding",
        "label": "Badge Padding",
        "type": "spacing",
        "default": "0 var(--fnd-spacing-02)"
      },
      {
        "id": "nc-treeview-badge-bg",
        "label": "Badge BG",
        "type": "color",
        "ref": "background-tertiary"
      },
      {
        "id": "nc-treeview-badge-color",
        "label": "Badge Color",
        "type": "color",
        "ref": "text-secondary"
      },
      {
        "id": "nc-treeview-drop-indicator-color",
        "label": "Drop Indicator Color",
        "type": "color",
        "ref": "interactive-default"
      },
      {
        "id": "nc-treeview-drop-indicator-width",
        "label": "Drop Indicator Width",
        "type": "size",
        "default": "2px"
      },
      {
        "id": "nc-treeview-drag-opacity",
        "label": "Drag Opacity",
        "type": "opacity",
        "default": "0.6"
      },
      {
        "id": "nc-treeview-expand-duration",
        "label": "Expand Duration",
        "type": "duration",
        "default": "var(--fnd-motion-duration-200)"
      },
      {
        "id": "nc-treeview-bordered-border-color",
        "label": "Bordered Border Color",
        "type": "color",
        "ref": "border-secondary"
      },
      {
        "id": "nc-treeview-bordered-border-width",
        "label": "Bordered Border Width",
        "type": "size",
        "default": "var(--fnd-border-width-xs)"
      },
      {
        "id": "nc-treeview-bordered-radius",
        "label": "Bordered Radius",
        "type": "radius",
        "default": "var(--fnd-radius-md)"
      },
      {
        "id": "nc-treeview-bordered-padding",
        "label": "Bordered Padding",
        "type": "spacing",
        "default": "var(--fnd-spacing-03)"
      }
    ]
  },
  {
    "id": "device",
    "label": "Geräterahmen",
    "icon": "square",
    "subgroups": [
      {
        "id": "geometry",
        "label": "Geometrie",
        "tokenIds": [
          "nc-device-ratio",
          "nc-device-width",
          "nc-device-bezel",
          "nc-device-radius",
          "nc-device-screen-radius",
          "nc-device-notch-width",
          "nc-device-notch-height",
          "nc-device-notch-radius",
          "nc-device-tilt",
          "nc-device-caption-size",
          "nc-device-caption-gap",
          "nc-device-width-per-height"
        ]
      },
      {
        "id": "colors",
        "label": "Farben",
        "tokenIds": [
          "nc-device-bezel-color",
          "nc-device-shadow",
          "nc-device-caption-color"
        ]
      }
    ],
    "tokens": [
      {
        "id": "nc-device-ratio",
        "label": "Seitenverhältnis",
        "type": "size",
        "default": "1206 / 2622"
      },
      {
        "id": "nc-device-width",
        "label": "Breite",
        "type": "size",
        "default": "clamp(200px, calc(200px + (300px - 200px) * var(--fluid-bp)), 300px)"
      },
      {
        "id": "nc-device-bezel",
        "label": "Rand",
        "type": "size",
        "default": "clamp(6px, calc(6px + (10px - 6px) * var(--fluid-bp)), 10px)"
      },
      {
        "id": "nc-device-radius",
        "label": "Radius außen",
        "type": "size",
        "default": "clamp(22px, calc(22px + (38px - 22px) * var(--fluid-bp)), 38px)"
      },
      {
        "id": "nc-device-screen-radius",
        "label": "Radius Bildschirm",
        "type": "size",
        "default": "clamp(14px, calc(14px + (26px - 14px) * var(--fluid-bp)), 26px)"
      },
      {
        "id": "nc-device-notch-width",
        "label": "Aussparung — Breite",
        "type": "size",
        "default": "34%"
      },
      {
        "id": "nc-device-notch-height",
        "label": "Aussparung — Höhe",
        "type": "size",
        "default": "clamp(14px, calc(14px + (24px - 14px) * var(--fluid-bp)), 24px)"
      },
      {
        "id": "nc-device-notch-radius",
        "label": "Aussparung — Radius",
        "type": "size",
        "default": "var(--fnd-radius-full)"
      },
      {
        "id": "nc-device-tilt",
        "label": "Neigung",
        "type": "size",
        "default": "6deg"
      },
      {
        "id": "nc-device-caption-size",
        "label": "Beschriftung — Größe",
        "type": "size",
        "default": "var(--fs-sm)"
      },
      {
        "id": "nc-device-caption-gap",
        "label": "Beschriftung — Abstand",
        "type": "size",
        "default": "var(--fnd-spacing-04)"
      },
      {
        "id": "nc-device-bezel-color",
        "label": "Rand — Farbe",
        "type": "color",
        "default": "var(--fnd-neutral-950)"
      },
      {
        "id": "nc-device-shadow",
        "label": "Schatten",
        "type": "color",
        "default": "var(--fnd-elevation-overlay)"
      },
      {
        "id": "nc-device-caption-color",
        "label": "Beschriftung — Farbe",
        "type": "color",
        "default": "var(--fnd-color-text-secondary)"
      },
      {
        "id": "nc-device-width-per-height",
        "label": "Width Per Height",
        "type": "size",
        "default": "0.46"
      }
    ]
  },
  {
    "id": "app-store",
    "label": "App-Store-Verweise",
    "icon": "square",
    "subgroups": [
      {
        "id": "geometry",
        "label": "Geometrie",
        "tokenIds": [
          "nc-app-store-gap",
          "nc-app-store-badge-gap",
          "nc-app-store-badge-pad",
          "nc-app-store-badge-radius",
          "nc-app-store-badge-border-width",
          "nc-app-store-kicker-size",
          "nc-app-store-name-size",
          "nc-app-store-icon-size",
          "nc-app-store-qr-size"
        ]
      },
      {
        "id": "colors",
        "label": "Farben",
        "tokenIds": [
          "nc-app-store-badge-border",
          "nc-app-store-badge-border-hover",
          "nc-app-store-badge-bg",
          "nc-app-store-badge-bg-hover",
          "nc-app-store-badge-color"
        ]
      }
    ],
    "tokens": [
      {
        "id": "nc-app-store-gap",
        "label": "Abstand",
        "type": "size",
        "default": "var(--fnd-spacing-05)"
      },
      {
        "id": "nc-app-store-badge-gap",
        "label": "Abzeichen — Abstand",
        "type": "size",
        "default": "var(--fnd-spacing-03)"
      },
      {
        "id": "nc-app-store-badge-pad",
        "label": "Abzeichen — Polsterung",
        "type": "size",
        "default": "var(--fnd-spacing-03) var(--fnd-spacing-05)"
      },
      {
        "id": "nc-app-store-badge-radius",
        "label": "Abzeichen — Radius",
        "type": "size",
        "default": "var(--fnd-radius-md)"
      },
      {
        "id": "nc-app-store-badge-border-width",
        "label": "Abzeichen — Randstärke",
        "type": "size",
        "default": "var(--fnd-border-width-sm)"
      },
      {
        "id": "nc-app-store-kicker-size",
        "label": "Kicker — Größe",
        "type": "size",
        "default": "var(--fs-xs)"
      },
      {
        "id": "nc-app-store-name-size",
        "label": "Name — Größe",
        "type": "size",
        "default": "var(--fs-lg)"
      },
      {
        "id": "nc-app-store-icon-size",
        "label": "Symbolgröße",
        "type": "size",
        "default": "clamp(22px, calc(22px + (28px - 22px) * var(--fluid-bp)), 28px)"
      },
      {
        "id": "nc-app-store-qr-size",
        "label": "QR-Code — Größe",
        "type": "size",
        "default": "clamp(96px, calc(96px + (128px - 96px) * var(--fluid-bp)), 128px)"
      },
      {
        "id": "nc-app-store-badge-border",
        "label": "Abzeichen — Rand",
        "type": "color",
        "default": "var(--fnd-color-border-primary)"
      },
      {
        "id": "nc-app-store-badge-border-hover",
        "label": "Abzeichen — Rand beim Überfahren",
        "type": "color",
        "default": "var(--fnd-color-interactive-default)"
      },
      {
        "id": "nc-app-store-badge-bg",
        "label": "Abzeichen — Fläche",
        "type": "color",
        "default": "transparent"
      },
      {
        "id": "nc-app-store-badge-bg-hover",
        "label": "Abzeichen — Fläche beim Überfahren",
        "type": "color",
        "default": "var(--fnd-color-background-secondary)"
      },
      {
        "id": "nc-app-store-badge-color",
        "label": "Abzeichen — Schrift",
        "type": "color",
        "default": "var(--fnd-color-text-primary)"
      }
    ]
  }
]

// ---------------------------------------------------------------------------
// Foundation non-color tokens
// ---------------------------------------------------------------------------

export const foundationTokens = {
  "radius": {
    "label": "Border Radius",
    "icon": "border-radius",
    "tokens": {
      "null": {
        "label": "None",
        "value": "0px",
        "cssVar": "--fnd-radius-null"
      },
      "xs": {
        "label": "XS",
        "value": "2px",
        "cssVar": "--fnd-radius-xs"
      },
      "sm": {
        "label": "SM (Default)",
        "value": "4px",
        "cssVar": "--fnd-radius-sm"
      },
      "md": {
        "label": "MD",
        "value": "6px",
        "cssVar": "--fnd-radius-md"
      },
      "lg": {
        "label": "LG",
        "value": "8px",
        "cssVar": "--fnd-radius-lg"
      },
      "xl": {
        "label": "XL",
        "value": "10px",
        "cssVar": "--fnd-radius-xl"
      },
      "2xl": {
        "label": "2XL",
        "value": "12px",
        "cssVar": "--fnd-radius-2xl"
      },
      "3xl": {
        "label": "3XL",
        "value": "14px",
        "cssVar": "--fnd-radius-3xl"
      },
      "4xl": {
        "label": "4XL",
        "value": "16px",
        "cssVar": "--fnd-radius-4xl"
      },
      "full": {
        "label": "Full",
        "value": "9999px",
        "cssVar": "--fnd-radius-full"
      }
    }
  },
  "spacing": {
    "label": "Spacing",
    "icon": "spacing-horizontal",
    "tokens": {
      "10": {
        "label": "10",
        "value": "64px",
        "cssVar": "--fnd-spacing-10"
      },
      "11": {
        "label": "11",
        "value": "80px",
        "cssVar": "--fnd-spacing-11"
      },
      "12": {
        "label": "12",
        "value": "120px",
        "cssVar": "--fnd-spacing-12"
      },
      "13": {
        "label": "13",
        "value": "160px",
        "cssVar": "--fnd-spacing-13"
      },
      "01": {
        "label": "01",
        "value": "4px",
        "cssVar": "--fnd-spacing-01"
      },
      "02": {
        "label": "02",
        "value": "8px",
        "cssVar": "--fnd-spacing-02"
      },
      "03": {
        "label": "03",
        "value": "12px",
        "cssVar": "--fnd-spacing-03"
      },
      "04": {
        "label": "04",
        "value": "16px",
        "cssVar": "--fnd-spacing-04"
      },
      "05": {
        "label": "05",
        "value": "20px",
        "cssVar": "--fnd-spacing-05"
      },
      "06": {
        "label": "06",
        "value": "24px",
        "cssVar": "--fnd-spacing-06"
      },
      "07": {
        "label": "07",
        "value": "32px",
        "cssVar": "--fnd-spacing-07"
      },
      "08": {
        "label": "08",
        "value": "40px",
        "cssVar": "--fnd-spacing-08"
      },
      "09": {
        "label": "09",
        "value": "48px",
        "cssVar": "--fnd-spacing-09"
      }
    }
  },
  "shadow": {
    "label": "Shadow",
    "icon": "shadow",
    "tokens": {
      "xs": {
        "label": "XS",
        "value": "0 1px 2px rgba(15, 23, 42, 0.06)",
        "cssVar": "--fnd-shadow-xs"
      },
      "sm": {
        "label": "SM",
        "value": "0 4px 10px rgba(15, 23, 42, 0.08)",
        "cssVar": "--fnd-shadow-sm"
      },
      "md": {
        "label": "MD",
        "value": "0 10px 24px rgba(15, 23, 42, 0.12)",
        "cssVar": "--fnd-shadow-md"
      },
      "lg": {
        "label": "LG",
        "value": "0 18px 40px rgba(15, 23, 42, 0.16)",
        "cssVar": "--fnd-shadow-lg"
      },
      "xl": {
        "label": "XL",
        "value": "0 30px 60px rgba(15, 23, 42, 0.2)",
        "cssVar": "--fnd-shadow-xl"
      }
    }
  },
  "elevation": {
    "label": "Elevation",
    "icon": "stack-3",
    "tokens": {
      "base": {
        "label": "Base",
        "value": "xs",
        "maps_to": "shadow",
        "cssVar": "--fnd-elevation-base",
        "resolved_value": "var(--fnd-shadow-xs)"
      },
      "raised": {
        "label": "Raised",
        "value": "sm",
        "maps_to": "shadow",
        "cssVar": "--fnd-elevation-raised",
        "resolved_value": "var(--fnd-shadow-sm)"
      },
      "floating": {
        "label": "Floating",
        "value": "md",
        "maps_to": "shadow",
        "cssVar": "--fnd-elevation-floating",
        "resolved_value": "var(--fnd-shadow-md)"
      },
      "overlay": {
        "label": "Overlay",
        "value": "lg",
        "maps_to": "shadow",
        "cssVar": "--fnd-elevation-overlay",
        "resolved_value": "var(--fnd-shadow-lg)"
      },
      "modal": {
        "label": "Modal",
        "value": "xl",
        "maps_to": "shadow",
        "cssVar": "--fnd-elevation-modal",
        "resolved_value": "var(--fnd-shadow-xl)"
      }
    }
  },
  "opacity": {
    "label": "Opacity",
    "icon": "eye",
    "tokens": {
      "disabled": {
        "label": "Disabled",
        "value": 0.5,
        "cssVar": "--fnd-opacity-disabled"
      },
      "hover": {
        "label": "Hover",
        "value": 0.08,
        "cssVar": "--fnd-opacity-hover"
      },
      "focus": {
        "label": "Focus",
        "value": 0.12,
        "cssVar": "--fnd-opacity-focus"
      },
      "pressed": {
        "label": "Pressed",
        "value": 0.12,
        "cssVar": "--fnd-opacity-pressed"
      },
      "dragged": {
        "label": "Dragged",
        "value": 0.16,
        "cssVar": "--fnd-opacity-dragged"
      },
      "muted": {
        "label": "Muted",
        "value": 0.6,
        "cssVar": "--fnd-opacity-muted"
      },
      "medium": {
        "label": "Medium",
        "value": 0.7,
        "cssVar": "--fnd-opacity-medium"
      },
      "high": {
        "label": "High",
        "value": 0.8,
        "cssVar": "--fnd-opacity-high"
      },
      "prominent": {
        "label": "Prominent",
        "value": 0.85,
        "cssVar": "--fnd-opacity-prominent"
      },
      "subtle": {
        "label": "Subtle",
        "value": 0.9,
        "cssVar": "--fnd-opacity-subtle"
      }
    }
  },
  "typography": {
    "label": "Typography",
    "icon": "typography",
    "tokens": {
      "font-body": {
        "label": "Body Font",
        "value": "Manrope, Helvetica Neue, Arial, sans-serif",
        "type": "font",
        "cssVar": "--font-body"
      },
      "font-heading": {
        "label": "Heading Font",
        "value": "Space Grotesk, Helvetica Neue, Arial, sans-serif",
        "type": "font",
        "cssVar": "--font-heading"
      },
      "font-mono": {
        "label": "Mono Font",
        "value": "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, monospace",
        "type": "font",
        "cssVar": "--font-mono"
      },
      "weight-light": {
        "label": "Light",
        "value": 300,
        "type": "weight",
        "cssVar": "--fnd-font-weight-light"
      },
      "weight-regular": {
        "label": "Regular",
        "value": 400,
        "type": "weight",
        "cssVar": "--fnd-font-weight-regular"
      },
      "weight-medium": {
        "label": "Medium",
        "value": 500,
        "type": "weight",
        "cssVar": "--fnd-font-weight-medium"
      },
      "weight-semibold": {
        "label": "Semibold",
        "value": 600,
        "type": "weight",
        "cssVar": "--fnd-font-weight-semibold"
      },
      "weight-bold": {
        "label": "Bold",
        "value": 700,
        "type": "weight",
        "cssVar": "--fnd-font-weight-bold"
      },
      "weight-black": {
        "label": "Black",
        "value": 900,
        "type": "weight",
        "cssVar": "--fnd-font-weight-black"
      }
    }
  },
  "motion": {
    "label": "Motion",
    "icon": "ripple",
    "tokens": {
      "easing-informative": {
        "label": "Informative",
        "value": "linear",
        "type": "easing",
        "cssVar": "--fnd-motion-easing-informative"
      },
      "easing-focused": {
        "label": "Focused",
        "value": "ease-in-out",
        "type": "easing",
        "cssVar": "--fnd-motion-easing-focused"
      },
      "easing-expressive": {
        "label": "Expressive",
        "value": "ease-out",
        "type": "easing",
        "cssVar": "--fnd-motion-easing-expressive"
      },
      "duration-quick": {
        "label": "Quick",
        "value": "0.2s",
        "type": "duration",
        "cssVar": "--fnd-motion-duration-200"
      },
      "duration-base": {
        "label": "Base",
        "value": "0.3s",
        "type": "duration",
        "cssVar": "--fnd-motion-duration-300"
      },
      "duration-slow": {
        "label": "Slow",
        "value": "0.45s",
        "type": "duration",
        "cssVar": "--fnd-motion-duration-450"
      }
    }
  },
  "border": {
    "label": "Border",
    "icon": "border-style-2",
    "tokens": {
      "width-null": {
        "label": "None",
        "value": "0px",
        "type": "width",
        "cssVar": "--fnd-border-width-null"
      },
      "width-xs": {
        "label": "XS (Hairline)",
        "value": "1px",
        "type": "width",
        "cssVar": "--fnd-border-width-xs"
      },
      "width-sm": {
        "label": "SM (Default)",
        "value": "1.5px",
        "type": "width",
        "cssVar": "--fnd-border-width-sm"
      },
      "width-md": {
        "label": "MD",
        "value": "2px",
        "type": "width",
        "cssVar": "--fnd-border-width-md"
      },
      "width-lg": {
        "label": "LG",
        "value": "3px",
        "type": "width",
        "cssVar": "--fnd-border-width-lg"
      },
      "width-xl": {
        "label": "XL",
        "value": "4px",
        "type": "width",
        "cssVar": "--fnd-border-width-xl"
      },
      "style-solid": {
        "label": "Solid",
        "value": "solid",
        "type": "style",
        "cssVar": "--fnd-border-style-solid"
      },
      "style-dashed": {
        "label": "Dashed",
        "value": "dashed",
        "type": "style",
        "cssVar": "--fnd-border-style-dashed"
      },
      "style-dotted": {
        "label": "Dotted",
        "value": "dotted",
        "type": "style",
        "cssVar": "--fnd-border-style-dotted"
      },
      "style-double": {
        "label": "Double",
        "value": "double",
        "type": "style",
        "cssVar": "--fnd-border-style-double"
      },
      "style-none": {
        "label": "None (Hidden)",
        "value": "none",
        "type": "style",
        "cssVar": "--fnd-border-style-none"
      }
    }
  },
  "zindex": {
    "label": "Z-Index",
    "icon": "stack-3",
    "tokens": {
      "base": {
        "label": "Base",
        "value": 1,
        "cssVar": "--fnd-layout-z-index-base"
      },
      "dropdown": {
        "label": "Dropdown",
        "value": 2,
        "cssVar": "--fnd-layout-z-index-dropdown"
      },
      "sticky": {
        "label": "Sticky",
        "value": 3,
        "cssVar": "--fnd-layout-z-index-sticky"
      },
      "fixed": {
        "label": "Fixed",
        "value": 9,
        "cssVar": "--fnd-layout-z-index-fixed"
      },
      "modal-backdrop": {
        "label": "Modal Backdrop",
        "value": 10,
        "cssVar": "--fnd-layout-z-index-modal-backdrop"
      },
      "modal": {
        "label": "Modal",
        "value": 11,
        "cssVar": "--fnd-layout-z-index-modal"
      },
      "tooltip": {
        "label": "Tooltip",
        "value": 20,
        "cssVar": "--fnd-layout-z-index-tooltip"
      }
    }
  },
  "focus": {
    "label": "Focus Ring",
    "icon": "focus-2",
    "tokens": {
      "color": {
        "label": "Ring Color",
        "value": "var(--fnd-color-text-primary)",
        "type": "color",
        "cssVar": "--fnd-focus-ring-color"
      },
      "width": {
        "label": "Ring Width",
        "value": "2px",
        "type": "size",
        "cssVar": "--fnd-focus-ring-width"
      },
      "offset": {
        "label": "Offset (aussen)",
        "value": "2px",
        "type": "size",
        "css_property": "--fnd-focus-offset",
        "description": "Abstand der Outline nach aussen (Default)",
        "cssVar": "--fnd-focus-offset"
      },
      "inset": {
        "label": "Inset (innen)",
        "value": "2px",
        "type": "size",
        "css_property": "--fnd-focus-inset",
        "description": "Abstand der Outline nach innen (fuer overflow-hidden Elemente)",
        "cssVar": "--fnd-focus-inset"
      },
      "style": {
        "label": "Ring Style",
        "value": "solid",
        "cssVar": "--fnd-focus-ring-style"
      }
    }
  },
  "media": {
    "label": "Media Ratios",
    "icon": "aspect-ratio",
    "tokens": {
      "auto": {
        "label": "Auto (intrinsisch)",
        "value": "auto",
        "cssVar": "--fnd-media-ratio-auto"
      },
      "1-1": {
        "label": "1:1 (Quadrat)",
        "value": "1 / 1",
        "cssVar": "--fnd-media-ratio-1-1"
      },
      "3-2": {
        "label": "3:2 (Landscape)",
        "value": "3 / 2",
        "cssVar": "--fnd-media-ratio-3-2"
      },
      "2-3": {
        "label": "2:3 (Portrait)",
        "value": "2 / 3",
        "cssVar": "--fnd-media-ratio-2-3"
      },
      "4-3": {
        "label": "4:3 (Klassisch)",
        "value": "4 / 3",
        "cssVar": "--fnd-media-ratio-4-3"
      },
      "3-4": {
        "label": "3:4 (Portrait-Foto)",
        "value": "3 / 4",
        "cssVar": "--fnd-media-ratio-3-4"
      },
      "16-9": {
        "label": "16:9 (Widescreen)",
        "value": "16 / 9",
        "cssVar": "--fnd-media-ratio-16-9"
      },
      "9-16": {
        "label": "9:16 (Stories)",
        "value": "9 / 16",
        "cssVar": "--fnd-media-ratio-9-16"
      },
      "2-1": {
        "label": "2:1 (Panorama)",
        "value": "2 / 1",
        "cssVar": "--fnd-media-ratio-2-1"
      },
      "1-2": {
        "label": "1:2 (Tall)",
        "value": "1 / 2",
        "cssVar": "--fnd-media-ratio-1-2"
      }
    }
  },
  "elements": {
    "label": "Elements",
    "icon": "components",
    "groups": [
      {
        "label": "Body",
        "items": [
          {
            "property": "font-family",
            "value": "var(--fnd-font-family-body)"
          },
          {
            "property": "font-size",
            "value": "var(--fs-base)"
          },
          {
            "property": "line-height",
            "value": "1.6"
          },
          {
            "property": "color",
            "value": "var(--fnd-color-text-primary)"
          },
          {
            "property": "background",
            "value": "var(--fnd-color-background-base)"
          }
        ]
      },
      {
        "label": "Headings",
        "items": [
          {
            "property": "font-family",
            "value": "var(--fnd-font-family-heading)"
          },
          {
            "property": "font-weight",
            "value": "var(--fnd-font-weight-bold)"
          },
          {
            "property": "color",
            "value": "var(--fnd-color-text-primary)"
          },
          {
            "property": "line-height",
            "value": "1.2"
          }
        ]
      },
      {
        "label": "Links",
        "items": [
          {
            "property": "color",
            "value": "var(--fnd-color-interactive-default)"
          },
          {
            "property": "text-decoration",
            "value": "underline"
          },
          {
            "property": "hover:color",
            "value": "var(--fnd-color-interactive-hover)"
          }
        ]
      },
      {
        "label": "Buttons",
        "items": [
          {
            "property": "font-family",
            "value": "inherit"
          },
          {
            "property": "font-weight",
            "value": "var(--fnd-font-weight-semibold)"
          },
          {
            "property": "cursor",
            "value": "pointer"
          },
          {
            "property": "border",
            "value": "none"
          }
        ]
      },
      {
        "label": "Forms",
        "items": [
          {
            "property": "font-family",
            "value": "inherit"
          },
          {
            "property": "font-size",
            "value": "inherit"
          },
          {
            "property": "color",
            "value": "inherit"
          }
        ]
      }
    ]
  },
  "themes": {
    "label": "Themes",
    "icon": "color-swatch",
    "themeList": [
      {
        "id": "neo-light-theme",
        "label": "Neo Light",
        "role": "Primary (Default)",
        "colorScheme": "light",
        "mixTarget": "always-dark",
        "desc": "Standard-Theme für helle Umgebungen. Basis aller anderen Themes."
      },
      {
        "id": "neo-dark-theme",
        "label": "Neo Dark",
        "role": "Primary Dark",
        "colorScheme": "dark",
        "mixTarget": "always-light",
        "desc": "Dunkles Gegenstück zu Neo Light. Aktiviert per prefers-color-scheme oder data-theme."
      },
      {
        "id": "customer-light-theme",
        "label": "Customer Light",
        "role": "Secondary",
        "colorScheme": "light",
        "mixTarget": "always-dark",
        "desc": "Kundenspezifisches helles Theme mit angepasster Farbpalette."
      },
      {
        "id": "customer-dark-theme",
        "label": "Customer Dark",
        "role": "Secondary Dark",
        "colorScheme": "dark",
        "mixTarget": "always-light",
        "desc": "Kundenspezifisches dunkles Theme. Hover/Active-States mixen Richtung always-light."
      }
    ]
  }
}

// ---------------------------------------------------------------------------
// Sidebar navigation tree structure
// ---------------------------------------------------------------------------

export const navigationTree = [
  {
    "id": "foundation",
    "label": "Foundation",
    "icon": "building-arch",
    "children": [
      {
        "id": "grid",
        "label": "Grid",
        "icon": "layout-grid",
        "section": "foundation-grid"
      },
      {
        "id": "colors",
        "label": "Color",
        "icon": "palette",
        "section": "foundation-colors"
      },
      {
        "id": "spacing",
        "label": "Spacing",
        "icon": "spacing-horizontal",
        "section": "foundation-spacing"
      },
      {
        "id": "typography",
        "label": "Typography",
        "icon": "typography",
        "section": "foundation-typography"
      },
      {
        "id": "radius",
        "label": "Radii",
        "icon": "border-radius",
        "section": "foundation-radius"
      },
      {
        "id": "border",
        "label": "Border",
        "icon": "border-style-2",
        "section": "foundation-border"
      },
      {
        "id": "focus",
        "label": "Focus Ring",
        "icon": "focus-2",
        "section": "foundation-focus"
      },
      {
        "id": "media",
        "label": "Media Ratios",
        "icon": "aspect-ratio",
        "section": "foundation-media"
      },
      {
        "id": "elements",
        "label": "Elements",
        "icon": "components",
        "section": "foundation-elements"
      },
      {
        "id": "icons",
        "label": "Icons",
        "icon": "icons",
        "section": "foundation-icons"
      },
      {
        "id": "themes",
        "label": "Themes",
        "icon": "color-swatch",
        "section": "foundation-themes"
      },
      {
        "id": "shadows",
        "label": "Shadow & Elevation",
        "icon": "shadow",
        "section": "foundation-shadows"
      },
      {
        "id": "opacity-zindex-motion",
        "label": "Opacity, Z-Index & Motion",
        "icon": "eye",
        "section": "foundation-opacity"
      }
    ]
  },
  {
    "id": "components",
    "label": "Komponenten",
    "icon": "components",
    "children": [
      {
        "id": "layout",
        "label": "Layout",
        "isSubgroup": true,
        "children": [
          {
            "id": "container",
            "label": "Container",
            "icon": "box",
            "section": "component-container"
          },
          {
            "id": "grid",
            "label": "Grid",
            "icon": "layout-grid",
            "section": "component-grid"
          },
          {
            "id": "section",
            "label": "Section",
            "icon": "section",
            "section": "component-section"
          },
          {
            "id": "shell",
            "label": "Shell",
            "icon": "layout",
            "section": "component-shell"
          }
        ]
      },
      {
        "id": "layouts",
        "label": "Layouts",
        "isSubgroup": true,
        "children": [
          {
            "id": "layout-marketing",
            "label": "Marketing",
            "icon": "speakerphone",
            "section": "layout-marketing"
          },
          {
            "id": "layout-docs",
            "label": "Documentation",
            "icon": "book",
            "section": "layout-docs"
          },
          {
            "id": "layout-dashboard",
            "label": "Dashboard",
            "icon": "dashboard",
            "section": "layout-dashboard"
          },
          {
            "id": "layout-form",
            "label": "Form",
            "icon": "forms",
            "section": "layout-form"
          },
          {
            "id": "layout-content",
            "label": "Content",
            "icon": "article",
            "section": "layout-content"
          }
        ]
      },
      {
        "id": "actions",
        "label": "Actions",
        "isSubgroup": true,
        "children": [
          {
            "id": "button",
            "label": "Buttons",
            "icon": "rectangle",
            "section": "component-button"
          },
          {
            "id": "button-micro",
            "label": "Button Micro",
            "icon": "square",
            "section": "component-button-micro"
          }
        ]
      },
      {
        "id": "form-inputs",
        "label": "Form Inputs",
        "isSubgroup": true,
        "children": [
          {
            "id": "input",
            "label": "Inputs",
            "icon": "forms",
            "section": "component-input"
          },
          {
            "id": "textarea",
            "label": "Textarea",
            "icon": "text-resize",
            "section": "component-textarea"
          },
          {
            "id": "select",
            "label": "Select",
            "icon": "select",
            "section": "component-select"
          },
          {
            "id": "checkbox",
            "label": "Checkboxes",
            "icon": "checkbox",
            "section": "component-checkbox"
          },
          {
            "id": "radio",
            "label": "Radio",
            "icon": "circle-dot",
            "section": "component-radio"
          },
          {
            "id": "switch",
            "label": "Switch",
            "icon": "toggle-right",
            "section": "component-switch"
          },
          {
            "id": "slider",
            "label": "Slider",
            "icon": "adjustments-horizontal",
            "section": "component-slider"
          },
          {
            "id": "rating",
            "label": "Rating",
            "icon": "star",
            "section": "component-rating"
          },
          {
            "id": "file-upload",
            "label": "File Upload",
            "icon": "upload",
            "section": "component-file-upload"
          }
        ]
      },
      {
        "id": "form-structure",
        "label": "Form Structure",
        "isSubgroup": true,
        "children": [
          {
            "id": "form-field",
            "label": "Form Field",
            "icon": "input-search",
            "section": "component-form-field"
          },
          {
            "id": "input-group",
            "label": "Input Group",
            "icon": "layout-list",
            "section": "component-input-group"
          },
          {
            "id": "form-layout",
            "label": "Form Layout",
            "icon": "layout",
            "section": "component-form-layout"
          },
          {
            "id": "label",
            "label": "Label",
            "icon": "tag",
            "section": "component-label"
          }
        ]
      },
      {
        "id": "loading-progress",
        "label": "Loading & Progress",
        "isSubgroup": true,
        "children": [
          {
            "id": "skeleton",
            "label": "Skeleton",
            "icon": "layout-board",
            "section": "component-skeleton"
          },
          {
            "id": "spinner",
            "label": "Spinner",
            "icon": "loader",
            "section": "component-spinner"
          },
          {
            "id": "progress",
            "label": "Progress",
            "icon": "progress",
            "section": "component-progress"
          }
        ]
      },
      {
        "id": "data-display",
        "label": "Data Display",
        "isSubgroup": true,
        "children": [
          {
            "id": "avatar",
            "label": "Avatar",
            "icon": "user-circle",
            "section": "component-avatar"
          },
          {
            "id": "badge",
            "label": "Badge",
            "icon": "badge",
            "section": "component-badge"
          },
          {
            "id": "status",
            "label": "Status",
            "icon": "point",
            "section": "component-status"
          },
          {
            "id": "card",
            "label": "Card",
            "icon": "id",
            "section": "component-card"
          },
          {
            "id": "item",
            "label": "Item",
            "icon": "list",
            "section": "component-item"
          },
          {
            "id": "tag",
            "label": "Tag",
            "icon": "tag",
            "section": "component-tag"
          },
          {
            "id": "chip",
            "label": "Chip",
            "icon": "badge",
            "section": "component-chip"
          },
          {
            "id": "code-snippet",
            "label": "Code Snippet",
            "icon": "code",
            "section": "component-code-snippet"
          },
          {
            "id": "table",
            "label": "Table",
            "icon": "table",
            "section": "component-table"
          },
          {
            "id": "data-table",
            "label": "Data Table",
            "icon": "table",
            "section": "component-data-table"
          },
          {
            "id": "metric",
            "label": "Metric",
            "icon": "chart-bar",
            "section": "component-metric"
          },
          {
            "id": "timeline",
            "label": "Timeline",
            "icon": "git-branch",
            "section": "component-timeline"
          },
          {
            "id": "empty-state",
            "label": "Empty State",
            "icon": "mood-empty",
            "section": "component-empty-state"
          }
        ]
      },
      {
        "id": "typography-layout",
        "label": "Typography & Layout",
        "isSubgroup": true,
        "children": [
          {
            "id": "divider",
            "label": "Divider",
            "icon": "separator-horizontal",
            "section": "component-divider"
          },
          {
            "id": "kbd",
            "label": "Kbd",
            "icon": "keyboard",
            "section": "component-kbd"
          }
        ]
      },
      {
        "id": "controls",
        "label": "Controls",
        "isSubgroup": true,
        "children": [
          {
            "id": "toggle",
            "label": "Toggle",
            "icon": "toggle-left",
            "section": "component-toggle"
          },
          {
            "id": "segmented-control",
            "label": "Segmented Control",
            "icon": "layout-columns",
            "section": "component-segmented-control"
          },
          {
            "id": "accordion",
            "label": "Accordion",
            "icon": "layout-rows",
            "section": "component-accordion"
          }
        ]
      },
      {
        "id": "navigation",
        "label": "Navigation",
        "isSubgroup": true,
        "children": [
          {
            "id": "breadcrumb",
            "label": "Breadcrumb",
            "icon": "arrows-right",
            "section": "component-breadcrumb"
          },
          {
            "id": "navigation-menu",
            "label": "Navigation Menu",
            "icon": "menu-2",
            "section": "component-navigation-menu"
          },
          {
            "id": "nav",
            "label": "Navigation",
            "icon": "compass",
            "section": "component-navigation"
          },
          {
            "id": "treeview",
            "label": "TreeView",
            "icon": "list-tree",
            "section": "component-treeview"
          },
          {
            "id": "tabs",
            "label": "Tabs",
            "icon": "folder",
            "section": "component-tabs"
          },
          {
            "id": "pagination",
            "label": "Pagination",
            "icon": "dots",
            "section": "component-pagination"
          },
          {
            "id": "sidebar",
            "label": "Sidebar",
            "icon": "layout-sidebar-left",
            "section": "component-sidebar"
          }
        ]
      },
      {
        "id": "feedback",
        "label": "Feedback",
        "isSubgroup": true,
        "children": [
          {
            "id": "alert",
            "label": "Alert",
            "icon": "alert-circle",
            "section": "component-alert"
          },
          {
            "id": "alert-dialog",
            "label": "Alert Dialog",
            "icon": "alert-triangle",
            "section": "component-alert-dialog"
          },
          {
            "id": "modal",
            "label": "Modal",
            "icon": "layout-bottombar",
            "section": "component-modal"
          },
          {
            "id": "drawer",
            "label": "Drawer",
            "icon": "layout-sidebar-right",
            "section": "component-drawer"
          },
          {
            "id": "notification",
            "label": "Notification",
            "icon": "bell",
            "section": "component-notification"
          },
          {
            "id": "tooltip",
            "label": "Tooltip",
            "icon": "message",
            "section": "component-tooltip"
          },
          {
            "id": "toast",
            "label": "Toast",
            "icon": "message-2",
            "section": "component-toast"
          },
          {
            "id": "banner",
            "label": "Banner",
            "icon": "flag",
            "section": "component-banner"
          },
          {
            "id": "popover",
            "label": "Popover",
            "icon": "message-circle",
            "section": "component-popover"
          },
          {
            "id": "dropdown-menu",
            "label": "Dropdown Menu",
            "icon": "menu",
            "section": "component-dropdown-menu"
          }
        ]
      },
      {
        "id": "search-toolbar",
        "label": "Search & Toolbar",
        "isSubgroup": true,
        "children": [
          {
            "id": "search",
            "label": "Search",
            "icon": "search",
            "section": "component-search"
          },
          {
            "id": "toolbar",
            "label": "Toolbar",
            "icon": "tools",
            "section": "component-toolbar"
          }
        ]
      },
      {
        "id": "content",
        "label": "Content",
        "isSubgroup": true,
        "children": [
          {
            "id": "hero",
            "label": "Hero",
            "icon": "photo",
            "section": "component-hero"
          },
          {
            "id": "header",
            "label": "Header",
            "icon": "layout-navbar",
            "section": "component-header"
          },
          {
            "id": "footer",
            "label": "Footer",
            "icon": "layout-bottombar-collapse",
            "section": "component-footer"
          },
          {
            "id": "carousel",
            "label": "Carousel",
            "icon": "carousel-horizontal",
            "section": "component-carousel"
          },
          {
            "id": "cta",
            "label": "CTA",
            "icon": "click",
            "section": "component-cta"
          },
          {
            "id": "faq",
            "label": "FAQ",
            "icon": "help",
            "section": "component-faq"
          },
          {
            "id": "facts",
            "label": "Facts",
            "icon": "chart-infographic",
            "section": "component-facts"
          },
          {
            "id": "testimonial",
            "label": "Testimonial",
            "icon": "quote",
            "section": "component-testimonial"
          },
          {
            "id": "pricing",
            "label": "Pricing",
            "icon": "currency-dollar",
            "section": "component-pricing"
          },
          {
            "id": "logo-wall",
            "label": "Logo Wall",
            "icon": "brand-abstract",
            "section": "component-logo-wall"
          },
          {
            "id": "marquee",
            "label": "Marquee",
            "icon": "marquee",
            "section": "component-marquee"
          },
          {
            "id": "video",
            "label": "Video",
            "icon": "player-play",
            "section": "component-video"
          },
          {
            "id": "video-section",
            "label": "Video Section",
            "icon": "video",
            "section": "component-video-section"
          }
        ]
      }
    ]
  },
  {
    "id": "templates",
    "label": "Templates",
    "icon": "template",
    "children": [
      {
        "id": "home-hero",
        "label": "Home Hero",
        "icon": "photo",
        "section": "template-home-hero"
      },
      {
        "id": "home-basic",
        "label": "Home Basic",
        "icon": "home",
        "section": "template-home-basic"
      },
      {
        "id": "dashboard",
        "label": "Dashboard",
        "icon": "dashboard",
        "section": "template-dashboard"
      },
      {
        "id": "content-page",
        "label": "Content Page",
        "icon": "article",
        "section": "template-content"
      },
      {
        "id": "form-page",
        "label": "Form Page",
        "icon": "forms",
        "section": "template-form"
      },
      {
        "id": "settings-page",
        "label": "Settings Page",
        "icon": "settings",
        "section": "template-settings"
      },
      {
        "id": "error-page",
        "label": "Error Page",
        "icon": "alert-triangle",
        "section": "template-error"
      }
    ]
  },
  {
    "id": "utilities",
    "label": "Utilities",
    "icon": "tool",
    "children": [
      {
        "id": "accessibility",
        "label": "Accessibility",
        "icon": "accessible",
        "section": "utility-accessibility"
      },
      {
        "id": "visibility",
        "label": "Visibility",
        "icon": "eye",
        "section": "utility-visibility"
      }
    ]
  },
  {
    "id": "guides",
    "label": "Guides",
    "icon": "book",
    "children": [
      {
        "id": "component-matrix",
        "label": "Komponenten-Matrix",
        "icon": "table",
        "section": "guide-component-matrix"
      }
    ]
  }
]
