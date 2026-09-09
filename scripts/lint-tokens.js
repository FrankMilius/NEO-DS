#!/usr/bin/env node
// ==========================================================================
// Token Lint: Prueft auf hardcodierte Werte in SCSS-Komponentendateien
// ==========================================================================
// Stellt sicher, dass Foundation-Tokens konsistent genutzt werden.
// Laueft als Teil von `npm test`.
// ==========================================================================

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SCSS_DIR = path.join(__dirname, '..', 'scss', 'scss');

// Verzeichnisse die geprueft werden (Komponenten, nicht Settings/Tools)
const CHECK_DIRS = [
  '03-elements',
  '04-objects',
  '05-atoms',
  '06-molecules',
  '07-organisms',
  '08-templates',
];

// Ausnahmen: Dateien die nicht geprueft werden
const SKIP_FILES = [
  '_docs.scss', // Docs-Page hat eigene Regeln
];

// Regeln: Pattern + Nachricht + Ausnahmen
const rules = [
  {
    name: 'hardcoded-shadow',
    pattern: /box-shadow:\s*\d+px\s+\d+px\s+\d+px\s+rgba/g,
    message: 'Hardcodierter box-shadow gefunden. Nutze var(--fnd-elevation-*) oder var(--fnd-shadow-*).',
    skipLine: /--[a-z]/,
  },
  {
    name: 'hardcoded-font-weight',
    pattern: /font-weight:\s*[0-9]+\s*;/g,
    message: 'Hardcodierter font-weight Wert. Nutze var(--fnd-font-weight-*).',
    skipLine: /\/\//,
  },
  {
    name: 'hardcoded-opacity-disabled',
    pattern: /-opacity(?:-disabled)?:\s*0\.5\s*;/g,
    message: 'Hardcodierter disabled-opacity: 0.5. Nutze var(--fnd-opacity-disabled).',
    skipLine: null,
  },
  {
    name: 'hardcoded-white-bg',
    pattern: /(?:background|background-color):\s*#(?:fff(?:fff)?)\s*;/gi,
    message: 'Hardcodiertes #fff/#ffffff als background. Nutze var(--fnd-color-surface-elevated) fuer erhobene Flaechen oder var(--fnd-color-background-base) fuer das Papier.',
    skipLine: /\/\//,
  },
  {
    name: 'hardcoded-rgba-colors',
    pattern: /(?:background|color):\s*rgba\(\s*(?:0|15|255)/g,
    message: 'Hardcodierter rgba()-Farbwert. Nutze color-mix() mit semantischen Tokens.',
    skipLine: /--[a-z]/,
  },
  {
    name: 'hardcoded-spacing-rem',
    pattern: /(?:padding|margin|gap)(?:-[\w-]+)?:[^;]*\d+\.?\d*rem/g,
    message: 'Hardcodierter rem-Wert in Spacing. Nutze var(--fnd-spacing-*) oder var(--nc-*).',
    skipLine: /\/\/|--[a-z]/,
  },
];

let totalErrors = 0;
let totalFiles = 0;

for (const dir of CHECK_DIRS) {
  const dirPath = path.join(SCSS_DIR, dir);
  if (!fs.existsSync(dirPath)) continue;

  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.scss'));

  for (const file of files) {
    if (SKIP_FILES.includes(file)) continue;

    const filePath = path.join(dirPath, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    let fileErrors = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      // Ueberspringe Kommentarzeilen
      if (line.trim().startsWith('//')) continue;

      for (const rule of rules) {
        if (rule.skipLine && rule.skipLine.test(line)) continue;

        // Reset regex lastIndex
        rule.pattern.lastIndex = 0;
        if (rule.pattern.test(line)) {
          if (fileErrors === 0) {
            console.log(`\n${dir}/${file}:`);
            totalFiles++;
          }
          console.log(`  Zeile ${i + 1}: [${rule.name}] ${rule.message}`);
          console.log(`    > ${line.trim()}`);
          fileErrors++;
          totalErrors++;
        }
      }
    }
  }
}

console.log('\n' + '='.repeat(60));
if (totalErrors === 0) {
  console.log('Token-Lint: Keine Probleme gefunden.');
  process.exit(0);
} else {
  console.log(`Token-Lint: ${totalErrors} Problem(e) in ${totalFiles} Datei(en).`);
  console.log('Ersetze hardcodierte Werte durch Foundation-Tokens.');
  process.exit(1);
}
