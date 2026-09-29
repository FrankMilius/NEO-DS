#!/usr/bin/env node
// ==========================================================================
// Docs Server — Lokaler Dev-Server für Design System Dokumentation
// ==========================================================================
// Stellt statische Dateien bereit + Save-Endpoint für Theme-Konfiguration.
//
// Nutzung:
//   node scripts/docs-server.js
//   → http://localhost:3333/docs/color-config.html
//
// Endpoints:
//   GET  /*                → Statische Dateien aus Projekt-Root
//   POST /api/save-theme   → Schreibt website/data/custom-theme.json
// ==========================================================================

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { exec } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
// Nur lokal erreichbar (Entscheidung 29.09.2026). Der Server schreibt ins
// Repo (custom-theme.json, _color-primitives.scss, Docs) — vorher lauschte er
// auf allen Netzwerk-Interfaces mit CORS *, d. h. jede Webseite im Browser
// und jeder Rechner im LAN konnte diese Endpunkte aufrufen.
const HOST = process.env.HOST || '127.0.0.1';
const MAX_BODY = 2 * 1024 * 1024; // 2 MB reichen fuer jedes Theme

// Erlaubte Herkunft: nur localhost / 127.0.0.1, beliebiger Port (Vite 5173 usw.)
const LOKAL_ORIGIN = /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/;
// Host-Kopf pruefen gegen DNS-Rebinding (fremde Domain, die auf 127.0.0.1 zeigt)
const LOKAL_HOST = /^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/;

// Namen und Werte, die in CSS geschrieben werden: nur harmlose Zeichen.
const CSS_NAME = /^[a-z0-9][a-z0-9-]{0,80}$/i;
function pruefeCssName(name, wo) {
  if (!CSS_NAME.test(name)) throw new Error('Ungueltiger Name in ' + wo + ': ' + String(name).slice(0, 40));
}
function pruefeCssWert(wert, wo) {
  if (typeof wert === 'number') return;
  if (typeof wert !== 'string' || wert.length > 200 || /[;{}<>\n\r\\]|\/\*|\*\//.test(wert)) {
    throw new Error('Ungueltiger Wert in ' + wo);
  }
}
const ROOT = path.resolve(__dirname, '..');
const THEME_FILE = path.join(ROOT, 'website', 'data', 'custom-theme.json');

// MIME-Types
const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.svg':  'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf':  'font/ttf',
  '.ico':  'image/x-icon'
};

const server = http.createServer((req, res) => {
  // ---- Herkunft pruefen ----
  if (!LOKAL_HOST.test(req.headers.host || '')) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Forbidden: nur ueber localhost erreichbar');
    return;
  }
  const origin = req.headers.origin;
  if (origin && LOKAL_ORIGIN.test(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }
  if (req.method === 'POST') {
    // Schreibende Aufrufe nur von lokalen Seiten (ohne Origin: curl, Skripte)
    if (origin && !LOKAL_ORIGIN.test(origin)) {
      res.writeHead(403, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'error', message: 'Origin nicht erlaubt' }));
      return;
    }
    // Groessenlimit: grosse Koerper abbrechen, bevor sie im Speicher landen
    let groesse = 0;
    req.on('data', (chunk) => {
      groesse += chunk.length;
      if (groesse > MAX_BODY && !res.headersSent) {
        res.writeHead(413, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'error', message: 'Anfrage zu gross' }));
        req.destroy();
      }
    });
  }

  // ---- Cache Control (dev mode: no caching for HTML/JS/CSS) ----
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // ---- POST /api/save-theme ----
  // Accepts full theme format: primitives + theme (required),
  // semantic, components, foundation (optional).
  if (req.method === 'POST' && req.url === '/api/save-theme') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const json = JSON.parse(body);

        // Required fields (backward-compatible)
        if (!json.primitives || !json.theme) {
          throw new Error('Invalid theme JSON: missing primitives or theme');
        }

        // Validate primitive hex colors
        const HEX_RE = /^#[0-9a-fA-F]{6}$/;
        ['primary', 'secondary', 'accent'].forEach(key => {
          if (json.primitives[key] && !HEX_RE.test(json.primitives[key])) {
            throw new Error('Invalid hex color for primitives.' + key + ': ' + json.primitives[key]);
          }
        });

        // Validate optional semantic overrides (hex colors per theme variant)
        if (json.semantic) {
          for (const [variant, tokens] of Object.entries(json.semantic)) {
            if (typeof tokens !== 'object' || tokens === null) {
              throw new Error('semantic.' + variant + ' must be an object');
            }
            pruefeCssName(variant, 'semantic');
            for (const [id, val] of Object.entries(tokens)) {
              pruefeCssName(id, 'semantic.' + variant);
              pruefeCssWert(val, 'semantic.' + variant + '.' + id);
              if (typeof val === 'string' && val.startsWith('#') && !HEX_RE.test(val)) {
                throw new Error('Invalid hex in semantic.' + variant + '.' + id + ': ' + val);
              }
            }
          }
        }

        // Validate optional component overrides
        if (json.components) {
          if (typeof json.components !== 'object' || json.components === null) {
            throw new Error('components must be an object');
          }
          for (const [id, val] of Object.entries(json.components)) {
            pruefeCssName(id, 'components');
            pruefeCssWert(val, 'components.' + id);
            if (typeof val === 'string' && val.startsWith('#') && !HEX_RE.test(val)) {
              throw new Error('Invalid hex in components.' + id + ': ' + val);
            }
          }
        }

        // Validate optional foundation overrides
        if (json.foundation) {
          if (typeof json.foundation !== 'object' || json.foundation === null) {
            throw new Error('foundation must be an object');
          }
          for (const [category, tokens] of Object.entries(json.foundation)) {
            if (typeof tokens !== 'object' || tokens === null) continue;
            pruefeCssName(category, 'foundation');
            for (const [key, val] of Object.entries(tokens)) {
              if (val === undefined || val === null) continue;
              pruefeCssName(key, 'foundation.' + category);
              pruefeCssWert(val, 'foundation.' + category + '.' + key);
            }
          }
        }

        // Write file
        fs.writeFileSync(THEME_FILE, JSON.stringify(json, null, 2) + '\n', 'utf8');
        console.log('[SAVE] Theme saved to', THEME_FILE);

        // ── Generate theme-overrides.css ──
        // Exportiert alle Overrides als CSS Custom Properties,
        // damit Drupal (und andere Konsumenten) die Aenderungen erhalten.
        const cssLines = [
          '/* ==========================================================================',
          '   NEO Theme Overrides — auto-generated by Theme Configurator',
          '   Generated: ' + new Date().toISOString(),
          '   DO NOT EDIT DIRECTLY — changes will be overwritten on next save.',
          '   ========================================================================== */',
          ''
        ];

        let hasOverrides = false;

        // Semantic overrides (Light)
        const lightKey = Object.keys(json.semantic || {}).find(k => k.endsWith('-light'));
        const darkKey = Object.keys(json.semantic || {}).find(k => k.endsWith('-dark'));

        if (lightKey && json.semantic[lightKey]) {
          const lightTokens = json.semantic[lightKey];
          const lightEntries = Object.entries(lightTokens).filter(([, v]) => typeof v === 'string');
          if (lightEntries.length) {
            cssLines.push(':root, .neo-light-theme {');
            for (const [id, val] of lightEntries) {
              cssLines.push('  --fnd-color-' + id + ': ' + val + ';');
            }
            cssLines.push('}', '');
            hasOverrides = true;
          }
        }

        if (darkKey && json.semantic[darkKey]) {
          const darkTokens = json.semantic[darkKey];
          const darkEntries = Object.entries(darkTokens).filter(([, v]) => typeof v === 'string');
          if (darkEntries.length) {
            cssLines.push('.neo-dark-theme {');
            for (const [id, val] of darkEntries) {
              cssLines.push('  --fnd-color-' + id + ': ' + val + ';');
            }
            cssLines.push('}', '');
            hasOverrides = true;
          }
        }

        // Component token overrides
        if (json.components && Object.keys(json.components).length) {
          cssLines.push(':root {');
          for (const [id, val] of Object.entries(json.components)) {
            cssLines.push('  --' + id + ': ' + val + ';');
          }
          cssLines.push('}', '');
          hasOverrides = true;
        }

        // Foundation overrides (spacing, radius, shadow, etc.)
        if (json.foundation) {
          const fndLines = [];
          for (const [category, tokens] of Object.entries(json.foundation)) {
            if (typeof tokens !== 'object' || tokens === null) continue;
            for (const [key, val] of Object.entries(tokens)) {
              if (val !== undefined && val !== null) {
                fndLines.push('  --fnd-' + category + '-' + key + ': ' + val + ';');
              }
            }
          }
          if (fndLines.length) {
            cssLines.push(':root {');
            cssLines.push(...fndLines);
            cssLines.push('}', '');
            hasOverrides = true;
          }
        }

        const overrideCssPath = path.join(ROOT, 'data', 'theme-overrides.css');
        if (hasOverrides) {
          fs.writeFileSync(overrideCssPath, cssLines.join('\n') + '\n', 'utf8');
          console.log('[SAVE] Overrides CSS generated:', overrideCssPath);
        } else {
          // Leere Datei wenn keine Overrides
          fs.writeFileSync(overrideCssPath, '/* No overrides */\n', 'utf8');
          console.log('[SAVE] No overrides, empty CSS written');
        }

        // ── Drupal Cache Clear (async, non-blocking) ──
        // Geschwister-Verzeichnis statt fester ~/Documents-Pfad (Umzug aus iCloud).
        const DRUPAL_DIR = path.resolve(ROOT, '..', 'DRUPAL11');
        const ddevBin = '/opt/homebrew/bin/ddev';
        if (fs.existsSync(DRUPAL_DIR) && fs.existsSync(ddevBin)) {
          // exec wird oben statisch importiert - require() gibt es in diesem
          // ESM-Modul nicht (warf hier bisher "require is not defined").
          exec(
            'eval "$(/opt/homebrew/bin/brew shellenv)" && source ~/.orbstack/shell/init.zsh 2>/dev/null && cd ' + DRUPAL_DIR + ' && ddev drush cr',
            { shell: '/bin/zsh' },
            (err) => {
              if (err) console.log('[DRUPAL] Cache clear failed:', err.message);
              else console.log('[DRUPAL] Cache cleared successfully');
            }
          );
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok', path: THEME_FILE, cssPath: overrideCssPath }));
      } catch (err) {
        console.error('[ERROR]', err.message);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'error', message: err.message }));
      }
    });
    return;
  }

  // ---- GET /api/neo-theme-defaults ----
  // Returns the factory-default NEO Theme snapshot from the secure data folder.
  // Used by the Theme Configurator for reliable reset-to-defaults.
  if (req.method === 'GET' && req.url === '/api/neo-theme-defaults') {
    try {
      const defaultsPath = path.join(ROOT, 'data/neo-theme-defaults/neo-theme-defaults.json');
      const content = fs.readFileSync(defaultsPath, 'utf-8');
      const data = JSON.parse(content);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ status: 'ok', defaults: data }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ status: 'error', message: 'Could not load NEO theme defaults: ' + err.message }));
    }
    return;
  }

  // ---- GET /api/styleguide-status ----
  // Returns the list of supporting palettes currently in _color-primitives.scss
  if (req.method === 'GET' && req.url === '/api/styleguide-status') {
    try {
      const scssPath = path.join(ROOT, 'scss/scss/00-settings/_color-primitives.scss');
      const scss = fs.readFileSync(scssPath, 'utf8');
      // Extract supporting palette names from SCSS variable declarations
      const existing = [];
      const re = /^\$_([a-z][a-z0-9-]*)-base:\s*#([0-9a-fA-F]{6})\s*!default;/gm;
      let m;
      // Only capture those between "Supporting Palettes" and "CSS Custom Properties Output"
      const supportingStart = scss.indexOf('// Supporting Palettes');
      const supportingEnd = scss.indexOf('// CSS Custom Properties Output', supportingStart);
      const supportingBlock = supportingStart >= 0
        ? scss.substring(supportingStart, supportingEnd >= 0 ? supportingEnd : scss.length)
        : '';
      while ((m = re.exec(supportingBlock)) !== null) {
        existing.push({ id: m[1], base: '#' + m[2] });
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', palettes: existing }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'error', message: err.message }));
    }
    return;
  }

  // ---- POST /api/preview-styleguide-update ----
  // Generates a diff preview of what would change (dry-run)
  if (req.method === 'POST' && req.url === '/api/preview-styleguide-update') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const json = JSON.parse(body);
        const palettes = json.palettes;
        if (!Array.isArray(palettes) || palettes.length === 0) {
          throw new Error('palettes array is required');
        }

        // Validate
        palettes.forEach(p => {
          if (!p.id || !p.label || !p.base) throw new Error('Each palette needs id, label, base');
          if (!/^#[0-9a-fA-F]{6}$/.test(p.base)) throw new Error('Invalid hex for ' + p.id + ': ' + p.base);
          if (!/^[a-z][a-z0-9-]*$/.test(p.id)) throw new Error('Invalid id: ' + p.id);
        });

        // Check which palettes are actually new
        const scssPath = path.join(ROOT, 'scss/scss/00-settings/_color-primitives.scss');
        const scss = fs.readFileSync(scssPath, 'utf8');
        const newPalettes = palettes.filter(p => !scss.includes('$_' + p.id + '-base:'));

        if (newPalettes.length === 0) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            status: 'ok',
            summary: 'All palettes already exist in the styleguide',
            files: [],
            diffs: []
          }));
          return;
        }

        // Generate diffs for each new palette
        const diffs = newPalettes.map(p => ({
          palette: p.id,
          changes: [
            {
              file: '_color-primitives.scss',
              lines: [
                '+ $_' + p.id + '-base: ' + p.base + ' !default;',
                '+ $' + p.id + ': fn.generate-shade-scale($_' + p.id + '-base) !default;',
                '+ @each $step, $color in $' + p.id + ' {',
                '+   --fnd-primitive-' + p.id + '-#{$step}: #{$color};',
                '+ }'
              ]
            },
            {
              file: 'color-docs.html',
              lines: [
                '+ <h4 class="docs__semantic-group-title">' + p.label + '</h4>',
                '+ <div class="docs__shade-scale" id="scale-' + p.id + '"></div>'
              ]
            },
            {
              file: 'color-docs.js',
              lines: [
                "+ " + p.id + ": ['--fnd-primitive-" + p.id + "-', steps10]"
              ]
            }
          ]
        }));

        const files = [
          { path: 'scss/scss/00-settings/_color-primitives.scss', type: 'scss', action: 'modify' },
          { path: 'docs/color-docs.html', type: 'html', action: 'modify' },
          { path: 'docs/color-docs.js', type: 'js', action: 'modify' }
        ];

        console.log('[PREVIEW] Generated diff for', newPalettes.length, 'palette(s):', newPalettes.map(p => p.id).join(', '));

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          status: 'ok',
          summary: 'Add ' + newPalettes.length + ' supporting palette(s) to the Design System',
          files: files,
          diffs: diffs
        }));
      } catch (err) {
        console.error('[ERROR]', err.message);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'error', message: err.message }));
      }
    });
    return;
  }

  // ---- POST /api/update-styleguide ----
  // Adds new supporting palettes to _color-primitives.scss, color-docs.html, color-docs.js
  if (req.method === 'POST' && req.url === '/api/update-styleguide') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const json = JSON.parse(body);
        const palettes = json.palettes; // [{ id, label, base }]
        if (!Array.isArray(palettes) || palettes.length === 0) {
          throw new Error('palettes array is required');
        }

        // Validate
        palettes.forEach(p => {
          if (!p.id || !p.label || !p.base) throw new Error('Each palette needs id, label, base');
          if (!/^#[0-9a-fA-F]{6}$/.test(p.base)) throw new Error('Invalid hex for ' + p.id + ': ' + p.base);
          if (!/^[a-z][a-z0-9-]*$/.test(p.id)) throw new Error('Invalid id: ' + p.id);
        });

        const updated = [];

        // ---- 1. Update _color-primitives.scss ----
        const scssPath = path.join(ROOT, 'scss/scss/00-settings/_color-primitives.scss');
        let scss = fs.readFileSync(scssPath, 'utf8');

        palettes.forEach(p => {
          // Check if already exists
          if (scss.includes('$_' + p.id + '-base:')) {
            return; // skip existing
          }

          // A) Insert variable declaration before the CSS Custom Properties section
          const varLine = '$_' + p.id + '-base:' + ' '.repeat(Math.max(1, 15 - p.id.length)) + p.base + ' !default;';
          const scaleLine = '$' + p.id + ':' + ' '.repeat(Math.max(1, 12 - p.id.length)) + 'fn.generate-shade-scale($_' + p.id + '-base) !default;';

          // Insert before "// ---...\n// CSS Custom Properties Output"
          const cssOutputMarker = '// ---------------------------------------------------------------------------\n// CSS Custom Properties Output: Primitives';
          scss = scss.replace(cssOutputMarker, varLine + '\n' + scaleLine + '\n\n' + cssOutputMarker);

          // B) Insert :root output loop before the closing section comment for supporting palettes
          const rootOutputBlock = '  @each $step, $color in $' + p.id + ' {\n    --fnd-primitive-' + p.id + '-#{$step}: #{$color};\n  }';
          // Insert after the last supporting palette @each loop (before the system colors backward-compat comment)
          const systemColorMarker = '\n  // --- System Colors (single values, backward-compat) ---';
          scss = scss.replace(systemColorMarker, '\n' + rootOutputBlock + '\n' + systemColorMarker);

          updated.push(p);
        });

        fs.writeFileSync(scssPath, scss, 'utf8');

        // ---- 2. Update color-docs.html ----
        if (updated.length > 0) {
          const htmlPath = path.join(ROOT, 'docs/color-docs.html');
          let html = fs.readFileSync(htmlPath, 'utf8');

          // Insert palette entries before the closing </div> of the Supporting Palettes subsection
          // Find the last scale-* div in the supporting section
          const closingTag = '      </div>\n\n      <div class="docs__code-block">';
          const newHtmlEntries = updated.map(p =>
            '\n        <h4 class="docs__semantic-group-title">' + p.label + '</h4>\n' +
            '        <div class="docs__shade-scale" id="scale-' + p.id + '"></div>\n'
          ).join('');

          html = html.replace(closingTag, newHtmlEntries + '      </div>\n\n      <div class="docs__code-block">');
          fs.writeFileSync(htmlPath, html, 'utf8');
        }

        // ---- 3. Update color-docs.js ----
        if (updated.length > 0) {
          const jsPath = path.join(ROOT, 'docs/color-docs.js');
          let js = fs.readFileSync(jsPath, 'utf8');

          // Insert new palette entries into the palettes object.
          // Strategy: Find the last entry before `};` and add a comma to it,
          // then insert the new entries.
          updated.forEach(p => {
            if (js.includes("'" + p.id + "'")) return; // already exists

            // Find the closing of the palettes object
            const closingMarker = "\n  };\n\n  function renderScales()";
            const closingIdx = js.indexOf(closingMarker);
            if (closingIdx === -1) return;

            // Find the last non-whitespace line before the closing marker
            // and ensure it has a trailing comma
            const beforeClosing = js.substring(0, closingIdx);
            const lastLineEnd = beforeClosing.lastIndexOf('\n');
            const lastLine = beforeClosing.substring(lastLineEnd + 1);

            // Add comma to last entry if missing
            if (lastLine.trim().endsWith(']') && !lastLine.trim().endsWith('],')) {
              const fixedLastLine = lastLine.replace(/\](\s*)$/, '],$1');
              js = beforeClosing.substring(0, lastLineEnd + 1) + fixedLastLine + js.substring(closingIdx);
            }

            // Now insert the new entry before the closing marker
            const newEntry = "\n    " + p.id + ":" + " ".repeat(Math.max(1, 12 - p.id.length)) + "['--fnd-primitive-" + p.id + "-', steps10]";
            js = js.replace(closingMarker, newEntry + closingMarker);
          });

          fs.writeFileSync(jsPath, js, 'utf8');
        }

        console.log('[STYLEGUIDE] Updated supporting palettes:', updated.map(p => p.id).join(', '));

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          status: 'ok',
          updated: updated.map(p => p.id),
          files: [
            'scss/scss/00-settings/_color-primitives.scss',
            'docs/color-docs.html',
            'docs/color-docs.js'
          ]
        }));
      } catch (err) {
        console.error('[ERROR]', err.message);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'error', message: err.message }));
      }
    });
    return;
  }

  // ---- Static File Serving ----
  // Strip query string and hash for file resolution
  const urlPath = req.url.split('?')[0].split('#')[0];
  // WEITERLEITEN, NICHT AUSLIEFERN.
  //
  // Die Wurzel lieferte /docs/color-docs.html aus — eine INHALTSSEITE, nicht
  // die Huelle. Deren Verweise sind relativ zu /docs/: `../styles.css`,
  // `docs-sidebar.js`, `docs-tabs.js`. Unter / aufgerufen zeigen sie ins Leere:
  // acht 404, keine Navigation, keine Suche, keine Tabs — und die Seite selbst
  // sieht auf den ersten Blick heil aus. Genau daran ist die Doku „vollkommen
  // unvollstaendig" erschienen.
  //
  // Die Uebersicht dort STATT DESSEN auszuliefern hilft nicht: Die Verweise
  // bleiben relativ zur Adresse im Browser, und die ist dann immer noch /.
  // Nur eine Weiterleitung aendert die Basis.
  if (urlPath === '/') {
    res.writeHead(302, { Location: '/docs/' });
    res.end();
    return;
  }

  let filePath = path.join(ROOT, urlPath);

  // Security: prevent directory traversal — und keine versteckten Pfade
  // (.git, .env, .claude ...) ausliefern.
  const segmente = path.relative(ROOT, filePath).split(path.sep);
  if ((filePath !== ROOT && !filePath.startsWith(ROOT + path.sep)) || segmente.some((seg) => seg.startsWith('.'))) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  // Helper: serve a resolved file
  function serveFile(fp) {
    const ext = path.extname(fp).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    fs.readFile(fp, (err, data) => {
      if (err) {
        res.writeHead(err.code === 'ENOENT' ? 404 : 500, { 'Content-Type': 'text/plain' });
        res.end(err.code === 'ENOENT' ? '404 Not Found: ' + req.url : '500 Server Error');
        return;
      }
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    });
  }

  // Try the exact path first, then .html fallback, then index.html in directory
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (!err) {
      // Check if it's a directory — try index.html inside it
      fs.stat(filePath, (statErr, stats) => {
        if (!statErr && stats.isDirectory()) {
          serveFile(path.join(filePath, 'index.html'));
        } else {
          serveFile(filePath);
        }
      });
    } else {
      // File not found — try appending .html extension
      const htmlFallback = filePath + '.html';
      fs.access(htmlFallback, fs.constants.F_OK, (htmlErr) => {
        if (!htmlErr) {
          serveFile(htmlFallback);
        } else {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('404 Not Found: ' + req.url);
        }
      });
    }
  });
});

server.listen(PORT, HOST, () => {
  console.log('\n  Design System Docs Server');
  console.log('  ========================\n');
  console.log('  URL:      http://localhost:' + PORT + '/docs/');
  console.log('  Colors:   http://localhost:' + PORT + '/docs/color-docs');
  console.log('  Grid:     http://localhost:' + PORT + '/docs/grid-docs');
  console.log('  Spacing:  http://localhost:' + PORT + '/docs/spacing-docs');
  console.log('  Typo:     http://localhost:' + PORT + '/docs/typography-docs');
  console.log('\n  Theme Configurator:');
  console.log('  Config:   http://localhost:' + PORT + '/config/theme-config');
  console.log('\n  Save API: POST http://localhost:' + PORT + '/api/save-theme');
  console.log('  Theme:    ' + THEME_FILE);
  console.log('\n  Press Ctrl+C to stop.\n');
});
