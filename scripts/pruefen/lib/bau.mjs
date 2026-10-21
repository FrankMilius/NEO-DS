// Bau-Prüfung der Prüfwerkzeuge (E3, 21.10.2026).
// Gleiche Regel wie veraltet() im Schutz-Hook ~/.claude/hooks/neo-schutz.py:
// Ist styles.css älter als scss/ bzw. design-tokens.json, oder der gebaute
// Konfigurator älter als apps/theme-configurator/src bzw. styles.css, prüfen
// Bildvergleich und Modul-e2e eine alte Fassung. Der Hook bleibt die Warnung
// beim Tippen, diese Funktion die Sperre im Werkzeug.
import { existsSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'

const UEBERSPRINGEN = new Set(['node_modules', 'dist', '.git'])

function mtime (p) {
  try { return statSync(p).mtimeMs } catch { return 0 }
}

function neueste (ordner) {
  let t = 0
  if (!existsSync(ordner)) return t
  for (const e of readdirSync(ordner, { withFileTypes: true })) {
    if (UEBERSPRINGEN.has(e.name)) continue
    const p = path.join(ordner, e.name)
    t = Math.max(t, e.isDirectory() ? neueste(p) : mtime(p))
  }
  return t
}

/**
 * Gründe, weshalb der Bau veraltet ist; leer = aktuell. nurCss: nur styles.css
 * prüfen (für die Modul-Übernahme, die den Konfigurator selbst neu baut).
 */
export function bauVeraltet (wurzel, { nurCss = false } = {}) {
  const gruende = []
  const css = mtime(path.join(wurzel, 'styles.css'))
  const scss = path.join(wurzel, 'scss')
  if (existsSync(scss) && Math.max(neueste(scss), mtime(path.join(wurzel, 'data/design-tokens.json'))) > css) {
    gruende.push('styles.css älter als scss/ bzw. design-tokens.json — erst `npm run build:css` (bei Token-Änderungen vorher `npm run tokens`).')
  }
  const src = path.join(wurzel, 'apps/theme-configurator/src')
  if (!nurCss && existsSync(src) && Math.max(neueste(src), css) > mtime(path.join(wurzel, 'config/theme-configurator/index.html'))) {
    gruende.push('Konfigurator älter als src oder styles.css (config/theme-configurator) — erst `npm run build` in apps/theme-configurator.')
  }
  return gruende
}
