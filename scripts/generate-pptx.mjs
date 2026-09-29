/**
 * Generate PowerPoint Presentation for Dev Process Schulung
 */

import PptxGenJS from 'pptxgenjs';
import path from 'path';

const pptx = new PptxGenJS();

// ─── Theme ───────────────────────────────────────────────────────────
// Nachgezogen am 26.08.2026 auf den aktuellen Markenstand:
//   Primary ist Graphit, nicht mehr Neo Darkblue (Kapitel 04)
//   Cyan ist #009EE3, nicht #009FE3 (vereinheitlicht mit der Ebenenfarbe)
//   Rueckmeldung aus den Systempaletten Stufe 500
//   Schriften statt Arial (Kapitel 03) — muessen installiert sein,
//   sonst faellt PowerPoint auf die Ersatzkaskade zurueck.
//
// ACHTUNG: Dieses Skript ist ein EINZELSTUECK fuer ein Schulungsdeck. Es
// benutzt addSlide() ohne defineSlideMaster() und ist damit kein
// Vorlagenwerkzeug. Der Master liegt in scripts/pptx-vorlage.mjs.
const COLORS = {
  bg: 'F1F3F1',        // Graphit 100 — Grundflaeche
  bgDark: '161816',    // Graphit 950 — tiefer Grund
  primary: '909390',   // Graphit 500
  accent: '37E93D',    // Lime 500 — Signal
  secondary: '009EE3', // Neo Blue
  text: '161816',      // Graphit 950
  textLight: '595C59', // Graphit 700
  pass: '24A148',      // success 500
  warn: 'D4A400',      // warning 500
  fail: 'FA4D56',      // danger 500
};

const FONTS = {
  marke: 'Space Grotesk',
  info: 'Manrope',
  technik: 'JetBrains Mono',
};

pptx.layout = 'LAYOUT_16x9';
pptx.author = 'NEO Design System';
pptx.subject = 'Dev Process Acceleration — Schulung Phase 1–6';

// ─── Helper Functions ────────────────────────────────────────────────

function titleSlide(title, subtitle) {
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.bgDark };
  slide.addText(title, { x: 0.8, y: 1.5, w: '85%', h: 1.5, fontSize: 36, bold: true, color: COLORS.accent, fontFace: FONTS.marke });
  if (subtitle) {
    slide.addText(subtitle, { x: 0.8, y: 3.2, w: '85%', h: 0.8, fontSize: 18, color: 'CCCCCC', fontFace: FONTS.info });
  }
  slide.addText('NEO Design System', { x: 0.8, y: 6.5, w: 3, h: 0.4, fontSize: 11, color: '666666', fontFace: FONTS.info });
  return slide;
}

function sectionSlide(phaseNum, title, subtitle) {
  const slide = pptx.addSlide();
  slide.background = { color: COLORS.primary };
  slide.addText(`PHASE ${phaseNum}`, { x: 0.8, y: 1.0, w: '85%', h: 0.6, fontSize: 14, color: COLORS.accent, bold: true, fontFace: FONTS.info });
  slide.addText(title, { x: 0.8, y: 1.8, w: '85%', h: 1.5, fontSize: 32, bold: true, color: 'FFFFFF', fontFace: FONTS.marke });
  if (subtitle) {
    slide.addText(subtitle, { x: 0.8, y: 3.5, w: '85%', h: 0.8, fontSize: 16, color: 'AAAAAA', fontFace: FONTS.info });
  }
  return slide;
}

function contentSlide(title, bullets, options = {}) {
  const slide = pptx.addSlide();
  slide.addText(title, { x: 0.8, y: 0.3, w: '85%', h: 0.7, fontSize: 22, bold: true, color: COLORS.primary, fontFace: FONTS.info });

  const bulletText = bullets.map(b => ({
    text: b.text || b,
    options: { fontSize: b.size || 14, color: b.color || COLORS.text, bullet: b.bullet !== false, breakLine: true, paraSpaceAfter: 6 },
  }));

  slide.addText(bulletText, { x: 0.8, y: 1.2, w: '85%', h: 5.0, fontFace: FONTS.info, valign: 'top' });
  return slide;
}

function tableSlide(title, headers, rows) {
  const slide = pptx.addSlide();
  slide.addText(title, { x: 0.8, y: 0.3, w: '85%', h: 0.7, fontSize: 22, bold: true, color: COLORS.primary, fontFace: FONTS.info });

  const tableRows = [
    headers.map(h => ({ text: h, options: { bold: true, fontSize: 11, color: 'FFFFFF', fill: { color: COLORS.primary } } })),
    ...rows.map(row => row.map(cell => ({ text: cell, options: { fontSize: 10, color: COLORS.text } }))),
  ];

  slide.addTable(tableRows, {
    x: 0.8, y: 1.2, w: 11.5,
    border: { pt: 0.5, color: 'CCCCCC' },
    colW: Array(headers.length).fill(11.5 / headers.length),
    rowH: 0.35,
    autoPage: true,
  });

  return slide;
}

function exampleSlide(phaseNum, exampleNum, title, scenario, command, output) {
  const slide = pptx.addSlide();
  slide.addText(`Phase ${phaseNum} — Beispiel ${exampleNum}`, { x: 0.8, y: 0.3, w: '85%', h: 0.4, fontSize: 12, color: COLORS.accent, bold: true, fontFace: FONTS.info });
  slide.addText(title, { x: 0.8, y: 0.7, w: '85%', h: 0.6, fontSize: 20, bold: true, color: COLORS.primary, fontFace: FONTS.info });

  slide.addText('Szenario:', { x: 0.8, y: 1.5, w: 1.2, h: 0.3, fontSize: 11, bold: true, color: COLORS.textLight, fontFace: FONTS.info });
  slide.addText(scenario, { x: 0.8, y: 1.8, w: '85%', h: 0.6, fontSize: 13, color: COLORS.text, fontFace: FONTS.info });

  if (command) {
    slide.addText('Command:', { x: 0.8, y: 2.6, w: 1.2, h: 0.3, fontSize: 11, bold: true, color: COLORS.textLight, fontFace: FONTS.info });
    slide.addShape('rect', { x: 0.8, y: 2.9, w: 11.5, h: 0.5, fill: { color: 'F5F5F5' }, rectRadius: 0.05 });
    slide.addText(command, { x: 1.0, y: 2.95, w: 11.0, h: 0.4, fontSize: 12, color: COLORS.primary, fontFace: 'Courier New' });
  }

  if (output) {
    slide.addText('Ergebnis:', { x: 0.8, y: 3.6, w: 1.2, h: 0.3, fontSize: 11, bold: true, color: COLORS.textLight, fontFace: FONTS.info });
    slide.addShape('rect', { x: 0.8, y: 3.9, w: 11.5, h: 2.5, fill: { color: '1A1A2E' }, rectRadius: 0.05 });
    slide.addText(output, { x: 1.0, y: 4.0, w: 11.0, h: 2.3, fontSize: 10, color: COLORS.accent, fontFace: 'Courier New', valign: 'top' });
  }

  return slide;
}

// ═══════════════════════════════════════════════════════════════════════
// SLIDES
// ═══════════════════════════════════════════════════════════════════════

// ── Title ──
titleSlide('Dev Process Acceleration', 'Schulungspräsentation Phase 1–6\nNEO Design System — März 2026');

// ── Agenda ──
contentSlide('Agenda', [
  { text: 'Phase 1: Testing Foundation & CI/CD', size: 16 },
  { text: 'Phase 2: Storybook Integration', size: 16 },
  { text: 'Phase 3: Figma Pipeline', size: 16 },
  { text: 'Phase 4: Research Agent (/evaluate-component)', size: 16 },
  { text: 'Phase 5: Quality Dashboard', size: 16 },
  { text: 'Phase 6: Agent-Netzwerk (Orchestrator)', size: 16 },
]);

// ── Overview ──
tableSlide('Überblick: Vorher → Nachher',
  ['Metrik', 'Vorher', 'Nachher'],
  [
    ['Automatisierte Tests', '0', '28 Unit Tests'],
    ['Storybook Stories', '0', '107 auto-generiert'],
    ['CI/CD Pipelines', '0', '2 GitHub Actions'],
    ['Quality KPIs', '0', '10 automatisiert'],
    ['Custom Skills', '4', '13'],
    ['Build Agents', '0', '4 (Builder, Tester, Documenter, Reporter)'],
    ['Figma Integration', '0', 'API-Sync + Import'],
    ['Quality Score', 'Unbekannt', '97/100'],
  ]
);

// ═════════════════════════════════════════════════════════════════════
// PHASE 1
// ═════════════════════════════════════════════════════════════════════

sectionSlide(1, 'Testing Foundation & CI/CD', 'Das Fundament für alles Weitere');

contentSlide('Phase 1 — Warum zuerst Tests?', [
  'Ohne Tests ist jede Automatisierung riskant',
  'Tests sind das Fundament auf dem Phase 2–6 aufbauen',
  'Design Systems haben besondere Test-Anforderungen:',
  { text: '  → Token-Konsistenz (SCSS → CSS → Browser)', size: 12 },
  { text: '  → Recipe-Validität (JSON-Schema)', size: 12 },
  { text: '  → CSS-Output-Qualität (keine hardcodierten Werte)', size: 12 },
  '',
  { text: 'Technologie: Vitest (schnell, ESM-native, Vite-kompatibel)', size: 14, color: COLORS.accent },
]);

tableSlide('Phase 1 — Was wurde implementiert',
  ['Komponente', 'Datei', 'Tests', 'Was wird geprüft'],
  [
    ['SCSS Token Tests', 'tests/scss/tokens.test.mjs', '16', 'Foundation + Component Tokens, CSS Quality'],
    ['Recipe Schema', 'tests/recipes/recipe-schema.test.mjs', '12', 'JSON-Validierung, Axis-Konsistenz, Token Coverage'],
    ['CI/CD', '.github/workflows/ci.yml', '—', 'Automatisch bei Push/PR auf main'],
    ['Skill: /test', '.claude/skills/test/', '—', 'Kontextbezogene Testausführung'],
    ['Skill: /collateral-check', '.claude/skills/collateral-check/', '—', 'Kollateralschaden-Prüfung'],
  ]
);

tableSlide('Phase 1 — Pro & Con',
  ['Pro', 'Con'],
  [
    ['28 Tests decken Token-Integrität + Recipe-Konsistenz ab', 'Keine Visual Regression Tests (Pixel-Vergleich)'],
    ['CSS-Build wird bei jedem Test verifiziert', 'Test Coverage nur auf SCSS-Output, nicht Mixin-Logik'],
    ['Recipe-Validierung fängt JSON-Fehler früh ab', 'Kein Browser-basiertes Testing'],
    ['CI/CD verhindert kaputte Merges', 'Schwellwerte initial großzügig'],
  ]
);

exampleSlide(1, 1, 'Token-Vollständigkeit prüfen',
  'Du fügst einen neuen Spacing-Token --fnd-spacing-14 hinzu. Der Test prüft ob er im CSS-Output erscheint.',
  'npm run test:unit',
  '✅ Foundation Tokens > enthält Spacing-Tokens    4ms\n✅ Component Tokens > enthält Button-Tokens      1ms\n✅ CSS Output Quality > CSS Build hat keine Fehler\n\nTest Files: 2 passed\n     Tests: 28 passed'
);

exampleSlide(1, 2, 'Recipe-Validierung nach Änderung',
  'Du erweiterst accordion-recipe.json um eine neue Axis "media". Der Test prüft ob alle Specimens die neue Axis korrekt referenzieren.',
  'npx vitest run tests/recipes/',
  '✅ Recipe JSON Validity > alle Dateien gültiges JSON\n✅ Required Fields > alle Recipes haben Identifikation\n❌ Specimen Axis Consistency:\n   Specimen "default" uses undefined axis "media"\n\nTests: 1 failed | 11 passed'
);

exampleSlide(1, 3, 'Automatische CI-Prüfung',
  'Du pushst SCSS-Änderungen. GitHub Actions führt automatisch npm run agents:full aus.',
  'git push origin main',
  'GitHub Actions:\n  ✅ Install dependencies     12s\n  ✅ Run Agent Network        30s\n     ✅ Builder: CSS 825KB\n     ✅ Tester: 28/28 passed\n     ✅ Documenter: 107 stories\n  → PR bekommt grünes Häkchen ✅'
);

// ═════════════════════════════════════════════════════════════════════
// PHASE 2
// ═════════════════════════════════════════════════════════════════════

sectionSlide(2, 'Storybook Integration', '107 Komponenten-Stories automatisch generiert');

contentSlide('Phase 2 — Warum Storybook?', [
  'Single Source of Truth für Komponenten-Dokumentation',
  'Visuelles Testing (A11y, Viewport, Theme-Wechsel)',
  'Teilbar mit Designern, PMs, Stakeholdern (ohne Code-Zugriff)',
  'Auto-generiert aus bestehenden Recipe-JSONs (107 Recipes → 107 Stories)',
  '',
  { text: 'Framework: @storybook/html-vite (nicht Vue — DS ist HTML+SCSS)', size: 14, color: COLORS.accent },
  '',
  'Features:',
  { text: '  → Theme Toggle (4 NEO Themes in Toolbar)', size: 12 },
  { text: '  → Viewport Presets (Mobile/Tablet/Desktop/Wide)', size: 12 },
  { text: '  → A11y Addon (automatische WCAG-Prüfung)', size: 12 },
  { text: '  → Auto-Docs (Version, Status, A11y aus Recipe)', size: 12 },
]);

tableSlide('Phase 2 — Story-Generator: Recipe → Story',
  ['Input (Recipe JSON)', 'Output (Storybook Story)', 'Generiert'],
  [
    ['meta.component', 'Title: "Atoms/Button"', 'Automatisch'],
    ['anatomy.slots', 'Default Story HTML', 'Automatisch'],
    ['specimens[0..8]', 'Specimen Stories (bis 8 Varianten)', 'Automatisch'],
    ['axes[].values', 'ArgTypes (Storybook Controls)', 'Automatisch'],
    ['a11y', 'Docs: Accessibility Section', 'Automatisch'],
    ['meta.version + status', 'Docs: "Button v2.0.0 (stable)"', 'Automatisch'],
  ]
);

tableSlide('Phase 2 — Pro & Con',
  ['Pro', 'Con'],
  [
    ['107 Stories automatisch — kein manueller Aufwand', 'HTML-Rendering statisch (keine JS-Interaktion)'],
    ['Theme-Wechsel in der Toolbar', 'Specimen-HTML generiert — nicht immer pixel-perfekt'],
    ['A11y-Addon prüft WCAG automatisch', 'Kein Vue-Component-Testing in Storybook'],
    ['Teilbar via GitHub Pages URL', 'Storybook 8.6 statt 10 (Node-Version)'],
  ]
);

exampleSlide(2, 1, 'Neues Recipe → automatisch eine Story',
  'Du erstellst ein neues tooltip-recipe.json. Stories werden automatisch regeneriert.',
  'npm run generate:stories',
  '📖 Story Generator: 108 stories generated, 0 skipped\n   Output: stories/{atoms,molecules,organisms}/*.stories.js\n\nnpm run storybook\n→ http://localhost:6006 → Atoms/Tooltip erscheint'
);

exampleSlide(2, 2, 'Theme-Testing im Browser',
  'Du willst prüfen ob der Button in allen 4 Themes korrekt aussieht.',
  'npm run storybook → http://localhost:6006',
  'Toolbar → Theme Dropdown:\n  → NEO Light   (heller Hintergrund, dunkle Tokens)\n  → NEO Dark    (dunkler Hintergrund, helle Tokens)\n  → Customer Light  (Secondary-Palette)\n  → Customer Dark   (Secondary-Palette, dunkel)\n\nJeder Wechsel wendet CSS Theme-Klasse an'
);

exampleSlide(2, 3, 'A11y-Prüfung in Storybook',
  'Du öffnest die Checkbox-Story und prüfst Accessibility.',
  'Storybook → Atoms/Checkbox → Accessibility Tab',
  'Violations (2):\n  ❌ Color contrast ratio 3.2:1 < AA threshold 4.5:1\n  ❌ Missing aria-label on icon-only variant\n\nPasses (8):\n  ✅ Interactive elements have focus indicator\n  ✅ Form elements have labels\n  ✅ Touch targets >= 24x24px'
);

// ═════════════════════════════════════════════════════════════════════
// PHASE 3
// ═════════════════════════════════════════════════════════════════════

sectionSlide(3, 'Figma Pipeline', 'Design Tokens bidirektional synchronisieren');

contentSlide('Phase 3 — Pipeline-Architektur', [
  'Figma (Tokens Studio / Variables API)',
  { text: '  ↓ figma-sync.mjs --pull', size: 12, color: COLORS.secondary },
  'data/figma-tokens.json (Rohexport)',
  { text: '  ↓ Transform + Diff + Merge', size: 12, color: COLORS.secondary },
  'data/design-tokens.json (Single Source of Truth)',
  { text: '  ↓ generate-tokens.js', size: 12, color: COLORS.secondary },
  'scss/scss/00-settings/_tokens-*.generated.scss',
  { text: '  ↓ sass', size: 12, color: COLORS.secondary },
  'styles.css → Drupal',
  '',
  { text: '4 Modi: --pull, --diff, --components, --from-file', size: 14, color: COLORS.accent },
]);

exampleSlide(3, 1, 'Farb-Token aus Figma synchronisieren',
  'Designer hat in Figma die Accent-Farbe von #37e93d auf #2dd636 geändert.',
  'npm run figma:pull',
  '🔄 Fetching Figma File (Styles + Components)...\n📊 Token Diff: 1 Änderung\n  🟡 Geändert: accent.500: #37e93d → #2dd636\n\n✅ design-tokens.json aktualisiert\n→ npm run tokens && npm run build:css'
);

exampleSlide(3, 2, 'Tokens Studio JSON importieren',
  'Designer exportiert Token-Datei manuell aus Figma (Tokens Studio Plugin).',
  'npm run figma:import -- --from-file=~/Downloads/tokens-export.json',
  '📥 Importiere Tokens Studio Datei\n📊 Token Diff: 8 Änderungen\n  🟢 Hinzugefügt (3): brand.tertiary.500, neutral.50, accent.950\n  🟡 Geändert (5): spacing-06, radius-lg, ...'
);

exampleSlide(3, 3, 'Figma-Komponenten → Recipe Mapping',
  'Prüfe welche Figma-Komponenten ein Recipe haben und welche neu sind.',
  'npm run figma:components',
  '📦 Figma Components → Recipes (24):\n  🔄 Bestehende (18): button, card, accordion, modal...\n  🆕 Neue ohne Recipe (6):\n     tooltip (Tooltip)\n     skeleton (Skeleton Loader)\n     progress (Progress Bar)\n→ Recipe scaffolden mit /sync-recipe'
);

// ═════════════════════════════════════════════════════════════════════
// PHASE 4
// ═════════════════════════════════════════════════════════════════════

sectionSlide(4, 'Research Agent', '/evaluate-component — automatisierte UX-Evaluierung');

contentSlide('Phase 4 — 4 parallele Research-Agents', [
  'Agent A: UX Best Practices (NNg, Baymard, Smashing Magazine)',
  'Agent B: Design System Benchmarks (Radix, Shadcn, Chakra, Carbon, Ant)',
  'Agent C: WCAG/ARIA Compliance (W3C APG, MDN Web Docs)',
  'Agent D: CSS/Web Platform Trends (@starting-style, Popover API)',
  '',
  { text: 'Alle 4 Agents laufen PARALLEL → Ergebnis in 3–5 Minuten', size: 14, color: COLORS.accent },
  '',
  'Output: Gap-Analyse-Matrix + priorisierte Roadmap',
  'Gespeichert: data/evaluations/<component>-evaluation-<date>.md',
]);

exampleSlide(4, 1, 'Komponente vor Refactoring evaluieren',
  'Du willst das Accordion überarbeiten. Vorher: Was machen andere besser?',
  '/evaluate-component accordion --focus=all',
  'Evaluation: Accordion v3.0.0\n\nGap-Analyse:\n| Feature    | NEO | Radix | Carbon | Ant | Empfehlung  |\n| Sortable   |  ❌ |  ❌   |  ❌    |  ✅ | Nice-to-Have|\n| Motion     |  ❌ |  ✅   |  ✅    |  ✅ | MUST-HAVE   |\n| Nested     |  ✅ |  ❌   |  ✅    |  ✅ | Behalten    |\n\nGespeichert: data/evaluations/accordion-evaluation-2026-03-25.md'
);

exampleSlide(4, 2, 'A11y-Check vor Release',
  'Du willst sicherstellen dass das Modal WCAG 2.2 AA-konform ist.',
  '/evaluate-component modal --focus=a11y',
  'A11y-Audit:\n  ✅ role="dialog" (nativ via <dialog>)\n  ✅ aria-modal="true" (nativ via showModal())\n  ❌ aria-describedby fehlt\n  ❌ prefers-reduced-motion nicht implementiert\n  ⚠️ Focus-Restore nur dokumentiert, nicht implementiert\n\nRoadmap: P1 = aria-describedby + reduced-motion'
);

exampleSlide(4, 3, 'Trend-basierte Modernisierung',
  'Prüfe ob es neue CSS-Features gibt die den Tooltip verbessern.',
  '/evaluate-component tooltip --focus=variants',
  'CSS Trends 2026:\n  → Popover API (popover="auto") ersetzt JS-Positioning\n  → CSS Anchor Positioning (anchor(), position-try)\n  → @starting-style für Entry-Animationen\n  → popover=hint für Tooltip-spezifisches Verhalten\n\nEmpfehlung: Migration zu Popover API + CSS Anchor'
);

// ═════════════════════════════════════════════════════════════════════
// PHASE 5
// ═════════════════════════════════════════════════════════════════════

sectionSlide(5, 'Quality Dashboard', '10 KPIs — aktuell 97/100');

tableSlide('Phase 5 — 10 KPIs (gewichtet)',
  ['KPI', 'Gewicht', 'Aktuell', 'Status'],
  [
    ['Test Coverage', '20%', '28/28 (100%)', '✅'],
    ['Build Health', '15%', '825KB CSS', '✅'],
    ['Token Sync', '15%', '1 Drift', '❌'],
    ['Token Coverage', '15%', '0 Violations (100%)', '✅'],
    ['Recipe Completeness', '10%', '107/107 (100%)', '✅'],
    ['Docs Coverage', '10%', '107/107 Stories (100%)', '✅'],
    ['Component Maturity', '10%', '106 stable', '✅'],
    ['Pipeline Sync', '5%', '50%', '⚠️'],
    ['Bundle Size', '—', '825KB (stable)', 'ℹ️'],
    ['Evaluations', '—', '1 (modal)', 'ℹ️'],
  ]
);

exampleSlide(5, 1, 'Täglicher Health Check',
  'Morgens kurz den Zustand des Design Systems prüfen.',
  'npm run dashboard',
  'Overall Score: 97/100 (excellent)\n\n✅ Test Coverage:      28/28 passed (100%)\n✅ Build Health:       825KB CSS\n✅ Token Coverage:     100% (0 violations)\n✅ Docs Coverage:      107/107 with stories\n⚠️ Pipeline Sync:      50%\n📦 Bundle Size:        825KB (stable)'
);

exampleSlide(5, 2, 'Sprint-Ende Snapshot',
  'Am Ende jedes Sprints wird ein History-Snapshot gespeichert.',
  'npm run dashboard:snapshot',
  '💾 Snapshot: data/dashboard/history/2026-03-25.json\n\nNächste Woche:\n  npm run dashboard\n  → Bundle Size: 830KB (+5KB, growing ↑)\n  → Token Sync: 0 drift (improved! ✅)'
);

exampleSlide(5, 3, 'CI/CD Quality Gate',
  'PRs werden blockiert wenn der Quality Score unter 80 fällt.',
  'GitHub Actions → Quality Gate Step',
  'SCORE=$(npm run dashboard:json | jq .overallScore)\nif [ "$SCORE" -lt 80 ]; then\n  echo "❌ Quality gate failed ($SCORE < 80)"\n  exit 1\nfi\n\n→ PR wird blockiert bis Score >= 80'
);

// ═════════════════════════════════════════════════════════════════════
// PHASE 6
// ═════════════════════════════════════════════════════════════════════

sectionSlide(6, 'Agent-Netzwerk', '4 Agents, 12 Checks, 30 Sekunden');

contentSlide('Phase 6 — Architektur', [
  'Orchestrator — Koordiniert alle Agents, erkennt geänderte Dateien',
  '',
  { text: '┌── Builder (5 Checks, ~6s)', size: 14, color: COLORS.pass },
  { text: '│   Token Gen, CSS Build, Token Sync, Token Lint, Recipe Lint', size: 12 },
  '',
  { text: '├── Tester (4 Checks, ~10s)', size: 14, color: COLORS.secondary },
  { text: '│   Vitest, Pipeline Guard, Fragment Lint, Script Lint', size: 12 },
  '',
  { text: '├── Documenter (3 Checks, ~14s)', size: 14, color: COLORS.warn },
  { text: '│   Story Generation, Docs Lint, Dashboard Snapshot', size: 12 },
  '',
  { text: '└── Reporter', size: 14, color: COLORS.textLight },
  { text: '    Aggregation, JSON Export, Empfehlungen', size: 12 },
]);

tableSlide('Phase 6 — 3 Ausführungsmodi',
  ['Modus', 'Command', 'Dauer', 'Wann verwenden'],
  [
    ['Quick', 'npm run agents:quick', '~5s', 'Nach einzelner SCSS-Änderung'],
    ['Auto', 'npm run agents', '~15s', 'Standard — erkennt geänderte Dateien'],
    ['Full', 'npm run agents:full', '~30s', 'Vor Commit, in CI/CD'],
  ]
);

exampleSlide(6, 1, 'Quick Check nach SCSS-Änderung',
  'Du hast _button.scss geändert und willst schnell prüfen.',
  'npm run agents:quick',
  '[Builder] ✅ CSS build successful (825KB)\n[Builder] ✅ No hardcoded values found\n\nOverall: 2 passed, 0 warnings, 0 failed\n⏱️ Duration: 5.1s'
);

exampleSlide(6, 2, 'Volle Pipeline vor dem Commit',
  'Alle Checks durchlaufen bevor du pushst.',
  'npm run agents:full',
  '[Builder]    ✅ CSS 825KB, Token Sync, Lint\n[Tester]     ✅ 28/28 Tests, Pipeline Guard\n[Documenter] ✅ 107 Stories, Dashboard 97/100\n\nOverall: 12 passed, 0 warnings, 0 failed\n⏱️ Total: 29.8s\n\n💾 Report: data/dashboard/last-pipeline-run.json'
);

exampleSlide(6, 3, 'Kontextbezogen nach einzelner Datei',
  'Nur relevante Checks für eine bestimmte Datei ausführen.',
  'node agents/orchestrator.mjs --changed=data/button-recipe.json',
  'Mode: Single file — data/button-recipe.json\nFiles: 1 recipe\n\n[Builder] ✅ Recipe Lint\n[Tester]  ✅ Vitest (28/28)\n[Documenter] ✅ 107 Stories regenerated\n\nOverall: 3 passed — nur Recipe-relevante Checks'
);

// ═════════════════════════════════════════════════════════════════════
// ZUSAMMENFASSUNG
// ═════════════════════════════════════════════════════════════════════

sectionSlide('', 'Zusammenfassung', 'Von manuell zu automatisiert in 6 Phasen');

contentSlide('6 Phasen — Überblick', [
  { text: 'Phase 1: TESTING      → "Können wir es messen?"', size: 16, color: COLORS.pass },
  { text: 'Phase 2: STORYBOOK    → "Können wir es zeigen?"', size: 16, color: COLORS.pass },
  { text: 'Phase 3: FIGMA        → "Können wir es designen?"', size: 16, color: COLORS.pass },
  { text: 'Phase 4: RESEARCH     → "Können wir es verbessern?"', size: 16, color: COLORS.pass },
  { text: 'Phase 5: DASHBOARD    → "Wie gut ist es?"', size: 16, color: COLORS.pass },
  { text: 'Phase 6: AGENTS       → "Läuft es automatisch?"', size: 16, color: COLORS.pass },
]);

tableSlide('Workflow: Vorher → Nachher',
  ['Workflow', 'Vorher', 'Nachher'],
  [
    ['CSS-Änderung prüfen', 'Manuell Browser refreshen', 'npm run agents:quick (5s)'],
    ['Neues Recipe erstellen', 'Manuell Arena + Inspector updaten', '/sync-recipe <name>'],
    ['Komponente evaluieren', 'Gemini + 30min Recherche', '/evaluate-component (3min)'],
    ['Quality Check', '"Hoffentlich funktioniert alles"', 'npm run dashboard → 97/100'],
    ['Storybook aktualisieren', 'Stories manuell schreiben', 'npm run generate:stories (107)'],
    ['Drupal Block erstellen', '7 manuelle Schritte', '/create-drupal-block <id>'],
    ['Wettbewerber analysieren', 'Website manuell durchklicken', '/analyze-competitor <url>'],
  ]
);

titleSlide('Vielen Dank', '13 Skills · 4 Agents · 107 Stories · 97/100 Score\n\nFragen?');

// ─── Generate ────────────────────────────────────────────────────────

// Relativ zum Repo statt absolut auf ~/Documents (Umzug aus dem iCloud-Ordner).
const outPath = path.resolve(import.meta.dirname, '..', 'data', 'dev-process-schulung.pptx');
await pptx.writeFile({ fileName: outPath });
console.log(`✅ Präsentation erstellt: ${outPath}`);
console.log(`   ${pptx.slides.length} Slides`);
