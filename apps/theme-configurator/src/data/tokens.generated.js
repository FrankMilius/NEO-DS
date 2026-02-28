// AUTO-GENERATED from data/design-tokens.json — DO NOT EDIT DIRECTLY.
// Token Contract v2.0.0 — Theme Configurator App Data Model
// Generated: 2026-02-27

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
      "100": "#d7fbd8",
      "200": "#aff7b1",
      "300": "#87f38a",
      "400": "#5fef63",
      "500": "#37e93d",
      "600": "#2cba31",
      "700": "#218c25",
      "800": "#165d18",
      "900": "#0b2f0c",
      "950": "#051706"
    }
  }
}

// --- Supporting Palettes ---
export const supportingPalettes = {
  "beige": {
    "label": "Beige",
    "base": "#D9D2C4",
    "shades": {
      "100": "#f7f6f3",
      "200": "#efede8",
      "300": "#e7e4dc",
      "400": "#e0dbd0",
      "500": "#D9D2C4",
      "600": "#ada89d",
      "700": "#827e76",
      "800": "#56544f",
      "900": "#2b2a27",
      "950": "#161514"
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
  }
]

// Default semantic values for all 4 themes
export const semanticDefaults = {
  "neo-light": {
    "text-primary": "#000000",
    "text-secondary": "#666666",
    "text-tertiary": "#8e8d8d",
    "text-inverse": "#ffffff",
    "text-disabled": "#8e8d8d",
    "text-on-interactive": "#ffffff",
    "text-link": "#009fe3",
    "text-link-hover": "#007fb6",
    "text-success": "#0b9e23",
    "text-danger": "#bf281b",
    "text-warning": "#8a6900",
    "text-info": "#2b6cb0",
    "background-base": "#ffffff",
    "background-secondary": "#f5f5f5",
    "background-tertiary": "#e5e5e5",
    "background-quaternary": "#cbcbcb",
    "background-inverse": "#000000",
    "background-disabled": "#e5e5e5",
    "background-hover": "#f5f5f5",
    "background-active": "#e5e5e5",
    "background-accent": "#37e93d",
    "background-accent-secondary": "#04cd24",
    "background-success": "#d5ffd1",
    "background-danger": "#ffdfdc",
    "background-warning": "#fff3cc",
    "background-info": "#dae8ff",
    "border-primary": "#cbcbcb",
    "border-secondary": "#e5e5e5",
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
    "text-primary": "#ffffff",
    "text-secondary": "#cbcbcb",
    "text-tertiary": "#767676",
    "text-inverse": "#000000",
    "text-disabled": "#8e8d8d",
    "text-on-interactive": "#ffffff",
    "text-link": "#009fe3",
    "text-link-hover": "#33b2e9",
    "text-success": "#0b9e23",
    "text-danger": "#ef5b4e",
    "text-warning": "#d4a400",
    "text-info": "#6aa3ff",
    "background-base": "#000000",
    "background-secondary": "#1d1d1d",
    "background-tertiary": "#4d4d4d",
    "background-quaternary": "#666666",
    "background-inverse": "#ffffff",
    "background-disabled": "#333333",
    "background-hover": "#1d1d1d",
    "background-active": "#333333",
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
          "nc-button-radius-full"
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
          "nc-button-min-width"
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
        "id": "nc-button-primary-bg",
        "label": "Primary BG",
        "type": "color",
        "ref": "interactive-default",
        "readonly": true
      },
      {
        "id": "nc-button-primary-bg-hover",
        "label": "Primary BG Hover",
        "type": "color",
        "ref": "interactive-hover",
        "readonly": true
      },
      {
        "id": "nc-button-primary-bg-active",
        "label": "Primary BG Active",
        "type": "color",
        "ref": "interactive-active",
        "readonly": true
      },
      {
        "id": "nc-button-primary-color",
        "label": "Primary Text",
        "type": "color",
        "ref": "text-on-interactive",
        "readonly": true
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
        "ref": "background-secondary",
        "readonly": true
      },
      {
        "id": "nc-button-secondary-bg-active",
        "label": "Secondary BG Active",
        "type": "color",
        "ref": "background-tertiary",
        "readonly": true
      },
      {
        "id": "nc-button-secondary-color",
        "label": "Secondary Text",
        "type": "color",
        "ref": "interactive-default",
        "readonly": true
      },
      {
        "id": "nc-button-secondary-border",
        "label": "Secondary Border",
        "type": "color",
        "ref": "interactive-default",
        "readonly": true
      },
      {
        "id": "nc-button-accent-bg",
        "label": "Accent BG",
        "type": "color",
        "ref": "background-accent",
        "readonly": true
      },
      {
        "id": "nc-button-accent-bg-hover",
        "label": "Accent BG Hover",
        "type": "color",
        "ref": "background-accent-secondary",
        "readonly": true
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
        "ref": "background-secondary",
        "readonly": true
      },
      {
        "id": "nc-button-outline-bg-active",
        "label": "Outline BG Active",
        "type": "color",
        "ref": "background-tertiary",
        "readonly": true
      },
      {
        "id": "nc-button-outline-color",
        "label": "Outline Text",
        "type": "color",
        "ref": "text-primary",
        "readonly": true
      },
      {
        "id": "nc-button-outline-border",
        "label": "Outline Border",
        "type": "color",
        "ref": "border-primary",
        "readonly": true
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
        "ref": "background-secondary",
        "readonly": true
      },
      {
        "id": "nc-button-ghost-bg-active",
        "label": "Ghost BG Active",
        "type": "color",
        "ref": "background-tertiary",
        "readonly": true
      },
      {
        "id": "nc-button-ghost-color",
        "label": "Ghost Text",
        "type": "color",
        "ref": "text-primary",
        "readonly": true
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
        "ref": "feedback-success",
        "readonly": true
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
        "ref": "feedback-warning",
        "readonly": true
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
        "ref": "feedback-info",
        "readonly": true
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
        "ref": "feedback-danger",
        "readonly": true
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
        "ref": "feedback-danger",
        "readonly": true
      },
      {
        "id": "nc-button-disabled-bg",
        "label": "Disabled BG",
        "type": "color",
        "ref": "background-disabled",
        "readonly": true
      },
      {
        "id": "nc-button-disabled-color",
        "label": "Disabled Text",
        "type": "color",
        "ref": "text-disabled",
        "readonly": true
      },
      {
        "id": "nc-button-disabled-border",
        "label": "Disabled Border",
        "type": "color",
        "ref": "border-secondary",
        "readonly": true
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
        "ref": "background-secondary",
        "readonly": true
      },
      {
        "id": "nc-icon-button-bg-hover",
        "label": "Icon Button BG Hover",
        "type": "color",
        "ref": "background-tertiary",
        "readonly": true
      },
      {
        "id": "nc-icon-button-color",
        "label": "Icon Button Color",
        "type": "color",
        "ref": "text-primary",
        "readonly": true
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
        "ref": "background-base",
        "readonly": true
      },
      {
        "id": "nc-input-color",
        "label": "Text Color",
        "type": "color",
        "ref": "text-primary",
        "readonly": true
      },
      {
        "id": "nc-input-border",
        "label": "Border Color",
        "type": "color",
        "ref": "border-primary",
        "readonly": true
      },
      {
        "id": "nc-input-placeholder",
        "label": "Placeholder",
        "type": "color",
        "ref": "text-tertiary",
        "readonly": true
      },
      {
        "id": "nc-input-border-hover",
        "label": "Border Hover",
        "type": "color",
        "ref": "border-strong",
        "readonly": true
      },
      {
        "id": "nc-input-border-focus",
        "label": "Border Focus",
        "type": "color",
        "ref": "interactive-focus",
        "readonly": true
      },
      {
        "id": "nc-input-border-error",
        "label": "Border Error",
        "type": "color",
        "ref": "border-danger",
        "readonly": true
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
        "id": "nc-badge-default-bg",
        "label": "Default BG",
        "type": "color",
        "ref": "background-secondary",
        "readonly": true
      },
      {
        "id": "nc-badge-default-color",
        "label": "Default Text",
        "type": "color",
        "ref": "text-primary",
        "readonly": true
      },
      {
        "id": "nc-badge-success-bg",
        "label": "Success BG",
        "type": "color",
        "ref": "background-success",
        "readonly": true
      },
      {
        "id": "nc-badge-success-color",
        "label": "Success Text",
        "type": "color",
        "ref": "text-success",
        "readonly": true
      },
      {
        "id": "nc-badge-error-bg",
        "label": "Error BG",
        "type": "color",
        "ref": "background-danger",
        "readonly": true
      },
      {
        "id": "nc-badge-error-color",
        "label": "Error Text",
        "type": "color",
        "ref": "text-danger",
        "readonly": true
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
        "ref": "text-info",
        "readonly": true
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
        "ref": "text-warning",
        "readonly": true
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
          "nc-badge-line-height"
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
          "nc-badge-default-color"
        ]
      },
      {
        "id": "tone-success",
        "label": "Success",
        "category": "tone",
        "tokenIds": [
          "nc-badge-success-bg",
          "nc-badge-success-color"
        ]
      },
      {
        "id": "tone-error",
        "label": "Error",
        "category": "tone",
        "tokenIds": [
          "nc-badge-error-bg",
          "nc-badge-error-color"
        ]
      },
      {
        "id": "tone-info",
        "label": "Info",
        "category": "tone",
        "tokenIds": [
          "nc-badge-info-bg",
          "nc-badge-info-color"
        ]
      },
      {
        "id": "tone-warning",
        "label": "Warning",
        "category": "tone",
        "tokenIds": [
          "nc-badge-warning-bg",
          "nc-badge-warning-color"
        ]
      },
      {
        "id": "emphasis-outline",
        "label": "Outline",
        "category": "emphasis",
        "tokenIds": [
          "nc-badge-border-width",
          "nc-badge-border-color"
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
        "ref": "background-base",
        "readonly": true
      },
      {
        "id": "nc-status-online",
        "label": "Online",
        "type": "color",
        "ref": "feedback-success",
        "readonly": true
      },
      {
        "id": "nc-status-offline",
        "label": "Offline",
        "type": "color",
        "ref": "text-disabled",
        "readonly": true
      },
      {
        "id": "nc-status-busy",
        "label": "Busy",
        "type": "color",
        "ref": "feedback-danger",
        "readonly": true
      },
      {
        "id": "nc-status-away",
        "label": "Away",
        "type": "color",
        "ref": "feedback-warning",
        "readonly": true
      },
      {
        "id": "nc-status-neutral",
        "label": "Neutral",
        "type": "color",
        "ref": "text-tertiary",
        "readonly": true
      },
      {
        "id": "nc-status-pulse-duration",
        "label": "Pulse Duration",
        "type": "size",
        "default": "1000ms"
      }
    ]
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
          "nc-card-description-line-height"
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
      }
    ],
    "tokens": [
      {
        "id": "nc-card-bg",
        "label": "Background",
        "type": "color",
        "group": "basis",
        "ref": "background-base",
        "readonly": true
      },
      {
        "id": "nc-card-color",
        "label": "Text Color",
        "type": "color",
        "group": "basis",
        "ref": "text-primary",
        "readonly": true
      },
      {
        "id": "nc-card-border",
        "label": "Border Color",
        "type": "color",
        "group": "basis",
        "ref": "border-secondary",
        "readonly": true
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
        "ref": "spacing-06",
        "readonly": true
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
        "ref": "elevation-raised",
        "readonly": true
      },
      {
        "id": "nc-card-border-width",
        "label": "Border Width",
        "type": "size",
        "group": "basis",
        "ref": "border-width-xs",
        "readonly": true
      },
      {
        "id": "nc-card-disabled-opacity",
        "label": "Disabled Opacity",
        "type": "opacity",
        "group": "basis",
        "ref": "opacity-disabled",
        "readonly": true
      },
      {
        "id": "nc-card-header-padding",
        "label": "Header Padding",
        "type": "spacing",
        "group": "spacing",
        "ref": "spacing-06",
        "readonly": true
      },
      {
        "id": "nc-card-header-gap",
        "label": "Header Gap",
        "type": "spacing",
        "group": "spacing",
        "ref": "spacing-02",
        "readonly": true
      },
      {
        "id": "nc-card-content-padding",
        "label": "Content Padding",
        "type": "spacing",
        "group": "spacing",
        "ref": "spacing-06",
        "readonly": true
      },
      {
        "id": "nc-card-footer-padding",
        "label": "Footer Padding",
        "type": "spacing",
        "group": "spacing",
        "ref": "spacing-06",
        "readonly": true
      },
      {
        "id": "nc-card-footer-gap",
        "label": "Footer Gap",
        "type": "spacing",
        "group": "spacing",
        "ref": "spacing-03",
        "readonly": true
      },
      {
        "id": "nc-card-title-font-size",
        "label": "Title Font Size",
        "type": "size",
        "group": "typography",
        "ref": "heading-m-font-size",
        "readonly": true
      },
      {
        "id": "nc-card-title-font-weight",
        "label": "Title Font Weight",
        "type": "fontWeight",
        "group": "typography",
        "ref": "font-weight-semibold",
        "readonly": true
      },
      {
        "id": "nc-card-title-color",
        "label": "Title Color",
        "type": "color",
        "group": "typography",
        "ref": "text-primary",
        "readonly": true
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
        "ref": "body-m-font-size",
        "readonly": true
      },
      {
        "id": "nc-card-description-color",
        "label": "Description Color",
        "type": "color",
        "group": "typography",
        "ref": "text-secondary",
        "readonly": true
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
        "ref": "motion-duration-200",
        "readonly": true
      },
      {
        "id": "nc-card-hover-border",
        "label": "Hover Border Color",
        "type": "color",
        "group": "interactive",
        "ref": "border-strong",
        "readonly": true
      },
      {
        "id": "nc-card-nav-color-hover",
        "label": "Nav Link Hover Color",
        "type": "color",
        "group": "interactive",
        "ref": "interactive-hover",
        "readonly": true
      },
      {
        "id": "nc-card-selected-border",
        "label": "Selected Border",
        "type": "color",
        "group": "selectable",
        "ref": "interactive-default",
        "readonly": true
      },
      {
        "id": "nc-card-selected-bg",
        "label": "Selected Background",
        "type": "color",
        "group": "selectable",
        "ref": "background-accent-secondary",
        "readonly": true
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
        "ref": "font-weight-semibold",
        "readonly": true
      },
      {
        "id": "nc-card-summary-padding",
        "label": "Summary Padding",
        "type": "spacing",
        "group": "expandable",
        "ref": "spacing-06",
        "readonly": true
      },
      {
        "id": "nc-card-details-content-padding",
        "label": "Details Content Padding",
        "type": "spacing",
        "group": "expandable",
        "ref": "spacing-06",
        "readonly": true
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
        "ref": "border-width-sm",
        "readonly": true
      },
      {
        "id": "nc-card-status-success-border",
        "label": "Status Success",
        "type": "color",
        "group": "status",
        "ref": "feedback-success",
        "readonly": true
      },
      {
        "id": "nc-card-status-warning-border",
        "label": "Status Warning",
        "type": "color",
        "group": "status",
        "ref": "feedback-warning",
        "readonly": true
      },
      {
        "id": "nc-card-status-danger-border",
        "label": "Status Danger",
        "type": "color",
        "group": "status",
        "ref": "feedback-danger",
        "readonly": true
      },
      {
        "id": "nc-card-status-info-border",
        "label": "Status Info",
        "type": "color",
        "group": "status",
        "ref": "feedback-info",
        "readonly": true
      },
      {
        "id": "nc-card-preview-media-ratio",
        "label": "Preview Media Ratio",
        "type": "ratio",
        "group": "preview",
        "ref": "media-ratio-3-2",
        "readonly": true
      },
      {
        "id": "nc-card-preview-title-size",
        "label": "Preview Title Size",
        "type": "size",
        "group": "preview",
        "ref": "heading-xs-font-size",
        "readonly": true
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
        "ref": "radius-full",
        "readonly": true
      },
      {
        "id": "nc-card-action-icon-size",
        "label": "Action Icon Size",
        "type": "size",
        "group": "action",
        "default": "48px"
      }
    ]
  },
  {
    "id": "dialog",
    "label": "Dialog",
    "icon": "layout-bottombar",
    "tokens": [
      {
        "id": "nc-dialog-bg",
        "label": "Background",
        "type": "color",
        "ref": "background-base",
        "readonly": true
      },
      {
        "id": "nc-dialog-radius",
        "label": "Radius",
        "type": "size",
        "default": "16px"
      },
      {
        "id": "nc-dialog-shadow",
        "label": "Shadow Level",
        "type": "shadow",
        "default": "xl"
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
        "id": "nc-switch-bg",
        "label": "Background",
        "type": "color",
        "ref": "background-secondary",
        "readonly": true
      },
      {
        "id": "nc-switch-bg-checked",
        "label": "BG Checked",
        "type": "color",
        "ref": "interactive-default",
        "readonly": true
      },
      {
        "id": "nc-switch-thumb-color",
        "label": "Thumb Color",
        "type": "color",
        "ref": "background-base",
        "readonly": true
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
        "ref": "background-inverse",
        "readonly": true
      },
      {
        "id": "nc-tooltip-color",
        "label": "Text Color",
        "type": "color",
        "ref": "text-inverse",
        "readonly": true
      },
      {
        "id": "nc-tooltip-radius",
        "label": "Radius",
        "type": "size",
        "default": "4px"
      }
    ]
  },
  {
    "id": "avatar",
    "label": "Avatar",
    "icon": "user-circle",
    "tokens": [
      {
        "id": "nc-avatar-size-sm",
        "label": "Size SM",
        "type": "size",
        "default": "32px"
      },
      {
        "id": "nc-avatar-size-md",
        "label": "Size MD",
        "type": "size",
        "default": "40px"
      },
      {
        "id": "nc-avatar-size-lg",
        "label": "Size LG",
        "type": "size",
        "default": "48px"
      },
      {
        "id": "nc-avatar-bg",
        "label": "Background",
        "type": "color",
        "ref": "background-tertiary",
        "readonly": true
      },
      {
        "id": "nc-avatar-color",
        "label": "Text Color",
        "type": "color",
        "ref": "text-primary",
        "readonly": true
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
        "ref": "layer-01",
        "readonly": true
      },
      {
        "id": "nc-cs-color",
        "label": "Text Color",
        "type": "color",
        "ref": "text-primary",
        "readonly": true
      },
      {
        "id": "nc-cs-border",
        "label": "Border Color",
        "type": "color",
        "ref": "border-secondary",
        "readonly": true
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
        "ref": "background-secondary",
        "readonly": true
      },
      {
        "id": "nc-cs-inline-color",
        "label": "Inline Text",
        "type": "color",
        "ref": "text-primary",
        "readonly": true
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
        "ref": "background-base",
        "readonly": true
      },
      {
        "id": "nc-cs-copy-bg-hover",
        "label": "Copy BG Hover",
        "type": "color",
        "ref": "background-secondary",
        "readonly": true
      },
      {
        "id": "nc-cs-copy-color",
        "label": "Copy Icon",
        "type": "color",
        "ref": "text-secondary",
        "readonly": true
      },
      {
        "id": "nc-cs-copy-color-hover",
        "label": "Copy Icon Hover",
        "type": "color",
        "ref": "text-primary",
        "readonly": true
      },
      {
        "id": "nc-cs-copy-border",
        "label": "Copy Border",
        "type": "color",
        "ref": "border-secondary",
        "readonly": true
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
        "ref": "layer-01",
        "readonly": true
      },
      {
        "id": "nc-cs-show-more-color",
        "label": "Show More Color",
        "type": "color",
        "ref": "interactive-default",
        "readonly": true
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
        "ref": "text-tertiary",
        "readonly": true
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
        "ref": "text-secondary",
        "readonly": true
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
        "ref": "text-tertiary",
        "readonly": true
      }
    ]
  },
  {
    "id": "shell",
    "label": "Shell",
    "icon": "layout",
    "subgroups": [
      {
        "id": "linkbar",
        "label": "Linkbar",
        "tokenIds": [
          "nc-shell-linkbar-height",
          "nc-shell-linkbar-bg",
          "nc-shell-linkbar-color",
          "nc-shell-linkbar-border"
        ]
      },
      {
        "id": "sidebars",
        "label": "Sidebars",
        "tokenIds": [
          "nc-shell-sidebar-left-width",
          "nc-shell-sidebar-right-width",
          "nc-shell-sidebar-bg",
          "nc-shell-sidebar-border"
        ]
      },
      {
        "id": "footerbar",
        "label": "Footerbar",
        "tokenIds": [
          "nc-shell-footerbar-height",
          "nc-shell-footerbar-bg",
          "nc-shell-footerbar-color",
          "nc-shell-footerbar-border"
        ]
      },
      {
        "id": "content",
        "label": "Content Area",
        "tokenIds": [
          "nc-shell-content-max-width",
          "nc-shell-content-narrow",
          "nc-shell-content-padding"
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
        "ref": "layer-01",
        "readonly": true
      },
      {
        "id": "nc-shell-linkbar-color",
        "label": "Linkbar Color",
        "type": "color",
        "ref": "text-secondary",
        "readonly": true
      },
      {
        "id": "nc-shell-linkbar-border",
        "label": "Linkbar Border",
        "type": "color",
        "ref": "border-secondary",
        "readonly": true
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
        "ref": "layer-01",
        "readonly": true
      },
      {
        "id": "nc-shell-sidebar-border",
        "label": "Sidebar Border",
        "type": "color",
        "ref": "border-secondary",
        "readonly": true
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
        "ref": "layer-01",
        "readonly": true
      },
      {
        "id": "nc-shell-footerbar-color",
        "label": "Footerbar Color",
        "type": "color",
        "ref": "text-secondary",
        "readonly": true
      },
      {
        "id": "nc-shell-footerbar-border",
        "label": "Footerbar Border",
        "type": "color",
        "ref": "border-secondary",
        "readonly": true
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
        "value": "0px"
      },
      "xs": {
        "label": "XS",
        "value": "2px"
      },
      "sm": {
        "label": "SM (Default)",
        "value": "4px"
      },
      "md": {
        "label": "MD",
        "value": "6px"
      },
      "lg": {
        "label": "LG",
        "value": "8px"
      },
      "xl": {
        "label": "XL",
        "value": "10px"
      },
      "2xl": {
        "label": "2XL",
        "value": "12px"
      },
      "3xl": {
        "label": "3XL",
        "value": "16px"
      },
      "full": {
        "label": "Full",
        "value": "9999px"
      }
    }
  },
  "spacing": {
    "label": "Spacing",
    "icon": "spacing-horizontal",
    "tokens": {
      "10": {
        "label": "10",
        "value": "64px"
      },
      "11": {
        "label": "11",
        "value": "80px"
      },
      "12": {
        "label": "12",
        "value": "120px"
      },
      "13": {
        "label": "13",
        "value": "160px"
      },
      "01": {
        "label": "01",
        "value": "4px"
      },
      "02": {
        "label": "02",
        "value": "8px"
      },
      "03": {
        "label": "03",
        "value": "12px"
      },
      "04": {
        "label": "04",
        "value": "16px"
      },
      "05": {
        "label": "05",
        "value": "20px"
      },
      "06": {
        "label": "06",
        "value": "24px"
      },
      "07": {
        "label": "07",
        "value": "32px"
      },
      "08": {
        "label": "08",
        "value": "40px"
      },
      "09": {
        "label": "09",
        "value": "48px"
      }
    }
  },
  "shadow": {
    "label": "Shadow",
    "icon": "shadow",
    "tokens": {
      "xs": {
        "label": "XS",
        "value": "0 1px 2px rgba(15, 23, 42, 0.06)"
      },
      "sm": {
        "label": "SM",
        "value": "0 4px 10px rgba(15, 23, 42, 0.08)"
      },
      "md": {
        "label": "MD",
        "value": "0 10px 24px rgba(15, 23, 42, 0.12)"
      },
      "lg": {
        "label": "LG",
        "value": "0 18px 40px rgba(15, 23, 42, 0.16)"
      },
      "xl": {
        "label": "XL",
        "value": "0 30px 60px rgba(15, 23, 42, 0.2)"
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
        "maps_to": "shadow"
      },
      "raised": {
        "label": "Raised",
        "value": "sm",
        "maps_to": "shadow"
      },
      "floating": {
        "label": "Floating",
        "value": "md",
        "maps_to": "shadow"
      },
      "overlay": {
        "label": "Overlay",
        "value": "lg",
        "maps_to": "shadow"
      },
      "modal": {
        "label": "Modal",
        "value": "xl",
        "maps_to": "shadow"
      }
    }
  },
  "opacity": {
    "label": "Opacity",
    "icon": "eye",
    "tokens": {
      "disabled": {
        "label": "Disabled",
        "value": 0.5
      },
      "hover": {
        "label": "Hover",
        "value": 0.08
      },
      "focus": {
        "label": "Focus",
        "value": 0.12
      },
      "pressed": {
        "label": "Pressed",
        "value": 0.12
      },
      "dragged": {
        "label": "Dragged",
        "value": 0.16
      },
      "muted": {
        "label": "Muted",
        "value": 0.6
      },
      "medium": {
        "label": "Medium",
        "value": 0.7
      },
      "high": {
        "label": "High",
        "value": 0.8
      },
      "prominent": {
        "label": "Prominent",
        "value": 0.85
      },
      "subtle": {
        "label": "Subtle",
        "value": 0.9
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
        "type": "font"
      },
      "font-heading": {
        "label": "Heading Font",
        "value": "Space Grotesk, Helvetica Neue, Arial, sans-serif",
        "type": "font"
      },
      "font-mono": {
        "label": "Mono Font",
        "value": "DM Mono, ui-monospace, SFMono-Regular, Menlo, monospace",
        "type": "font"
      },
      "weight-light": {
        "label": "Light",
        "value": 300,
        "type": "weight"
      },
      "weight-regular": {
        "label": "Regular",
        "value": 400,
        "type": "weight"
      },
      "weight-medium": {
        "label": "Medium",
        "value": 500,
        "type": "weight"
      },
      "weight-semibold": {
        "label": "Semibold",
        "value": 600,
        "type": "weight"
      },
      "weight-bold": {
        "label": "Bold",
        "value": 700,
        "type": "weight"
      },
      "weight-black": {
        "label": "Black",
        "value": 900,
        "type": "weight"
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
        "type": "easing"
      },
      "easing-focused": {
        "label": "Focused",
        "value": "ease-in-out",
        "type": "easing"
      },
      "easing-expressive": {
        "label": "Expressive",
        "value": "ease-out",
        "type": "easing"
      },
      "duration-quick": {
        "label": "Quick",
        "value": "0.2s",
        "type": "duration"
      },
      "duration-base": {
        "label": "Base",
        "value": "0.3s",
        "type": "duration"
      },
      "duration-slow": {
        "label": "Slow",
        "value": "0.45s",
        "type": "duration"
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
        "type": "width"
      },
      "width-xs": {
        "label": "XS (Hairline)",
        "value": "1px",
        "type": "width"
      },
      "width-sm": {
        "label": "SM (Default)",
        "value": "1.5px",
        "type": "width"
      },
      "width-md": {
        "label": "MD",
        "value": "2px",
        "type": "width"
      },
      "width-lg": {
        "label": "LG",
        "value": "3px",
        "type": "width"
      },
      "width-xl": {
        "label": "XL",
        "value": "4px",
        "type": "width"
      },
      "style-solid": {
        "label": "Solid",
        "value": "solid",
        "type": "style"
      },
      "style-dashed": {
        "label": "Dashed",
        "value": "dashed",
        "type": "style"
      },
      "style-dotted": {
        "label": "Dotted",
        "value": "dotted",
        "type": "style"
      }
    }
  },
  "zindex": {
    "label": "Z-Index",
    "icon": "stack-3",
    "tokens": {
      "base": {
        "label": "Base",
        "value": 1
      },
      "dropdown": {
        "label": "Dropdown",
        "value": 2
      },
      "sticky": {
        "label": "Sticky",
        "value": 3
      },
      "fixed": {
        "label": "Fixed",
        "value": 9
      },
      "modal-backdrop": {
        "label": "Modal Backdrop",
        "value": 10
      },
      "modal": {
        "label": "Modal",
        "value": 11
      },
      "tooltip": {
        "label": "Tooltip",
        "value": 20
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
        "type": "color"
      },
      "width": {
        "label": "Ring Width",
        "value": "2px",
        "type": "size"
      },
      "offset": {
        "label": "Offset (aussen)",
        "value": "2px",
        "type": "size",
        "css_property": "--fnd-focus-offset",
        "description": "Abstand der Outline nach aussen (Default)"
      },
      "inset": {
        "label": "Inset (innen)",
        "value": "2px",
        "type": "size",
        "css_property": "--fnd-focus-inset",
        "description": "Abstand der Outline nach innen (fuer overflow-hidden Elemente)"
      },
      "style": {
        "label": "Ring Style",
        "value": "solid"
      }
    }
  },
  "media": {
    "label": "Media Ratios",
    "icon": "aspect-ratio",
    "tokens": {
      "auto": {
        "label": "Auto (intrinsisch)",
        "value": "auto"
      },
      "1-1": {
        "label": "1:1 (Quadrat)",
        "value": "1 / 1"
      },
      "3-2": {
        "label": "3:2 (Landscape)",
        "value": "3 / 2"
      },
      "2-3": {
        "label": "2:3 (Portrait)",
        "value": "2 / 3"
      },
      "4-3": {
        "label": "4:3 (Klassisch)",
        "value": "4 / 3"
      },
      "3-4": {
        "label": "3:4 (Portrait-Foto)",
        "value": "3 / 4"
      },
      "16-9": {
        "label": "16:9 (Widescreen)",
        "value": "16 / 9"
      },
      "9-16": {
        "label": "9:16 (Stories)",
        "value": "9 / 16"
      },
      "2-1": {
        "label": "2:1 (Panorama)",
        "value": "2 / 1"
      },
      "1-2": {
        "label": "1:2 (Tall)",
        "value": "1 / 2"
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
            "id": "aspect-ratio",
            "label": "Aspect Ratio",
            "icon": "aspect-ratio",
            "section": "component-aspect-ratio"
          },
          {
            "id": "container",
            "label": "Container",
            "icon": "box",
            "section": "component-container"
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
