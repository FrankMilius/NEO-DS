#!/usr/bin/env node
/**
 * Doku gegen Recipe und gebautes CSS pruefen.
 *
 *   node scripts/pruefe-doku-gegen-recipe.cjs form-label form-hint ...
 *   node scripts/pruefe-doku-gegen-recipe.cjs --json <slugs>
 *
 * Je Seite (Quelle: docs/content/<slug>.html):
 *   - tote Klassen:   .nc-*-Klassen in der Doku, die es in styles.css nicht gibt
 *   - tote Tokens:    --nc-* / --fnd-* in der Doku, die styles.css nicht deklariert
 *   - fehlende Slots: Anatomie-Elemente des Recipes, die die Doku nicht nennt
 *   - fehlende Modifier und Token (Recipe styling.tokenGroups), die die Doku nicht nennt
 *   - fehlende Achsenwerte (Recipe axes), die die Doku nicht nennt
 * Entstanden fuer den Abgleich der Form-Seiten (29.09.2026), deren Inhalte
 * vom Maerz stammen.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const css = fs.readFileSync(path.join(ROOT, 'styles.css'), 'utf8');
const klassen = new Set([...css.matchAll(/\.(nc-[a-z0-9_-]+)/g)].map((m) => m[1]));
const vars = new Set([...css.matchAll(/(--(?:nc|fnd)-[a-z0-9-]+)\s*:/g)].map((m) => m[1]));

const args = process.argv.slice(2);
const alsJson = args.includes('--json');
const summe = args.includes('--summe');
let slugs = args.filter((a) => !a.startsWith('--'));
if (!slugs.length) slugs = fs.readdirSync(path.join(ROOT, 'docs/content')).filter((f) => f.endsWith('.html')).map((f) => f.slice(0, -5));
const ergebnis = {};

for (const slug of slugs) {
  const doku = fs.readFileSync(path.join(ROOT, 'docs/content', slug + '.html'), 'utf8');
  const rPfad = path.join(ROOT, 'data', slug + '-recipe.json');
  const recipe = fs.existsSync(rPfad) ? JSON.parse(fs.readFileSync(rPfad, 'utf8')) : null;

  const dokuKlassen = new Set([...doku.matchAll(/(?:class="[^"]*|\.)\b(nc-[a-z0-9_-]+)/g)].map((m) => m[1]));
  // class="a b c" vollstaendig zerlegen
  for (const m of doku.matchAll(/class="([^"]*)"/g)) m[1].split(/\s+/).filter((k) => k.startsWith('nc-')).forEach((k) => dokuKlassen.add(k));
  // Namensraum-Angaben wie --nc-form-label-*, --fnd-radius-{size} oder
  // --nc-nav__icon-* sind keine Token (Platzhalter seit 09.10.2026 erkannt:
  // vorher 9 Fehlalarme in border, radii, spacing, typography, nav-*).
  const dokuVars = new Set([...doku.matchAll(/--(?:nc|fnd)-[a-z0-9-]+/g)]
    .filter((m) => !['*', '{', '_'].includes(doku[m.index + m[0].length]))
    .map((m) => m[0]));

  const r = { recipe: !!recipe };
  // nc-nav__* u. ae. sind Namensraeume, keine Klassen
  r.toteKlassen = [...dokuKlassen].filter((k) => !klassen.has(k) && !k.endsWith('-') && !k.endsWith('_')).sort();
  r.toteTokens = [...dokuVars].filter((v) => !vars.has(v) && !v.endsWith('*')).sort();

  if (recipe) {
    const nennt = (s) => doku.includes(s);
    const slots = (recipe.anatomy?.slots || []).map((s) => (s.element || '').replace(/^\./, '')).filter(Boolean);
    r.fehlendeSlots = slots.filter((s) => !nennt(s));
    const mods = [];
    const achsen = [];
    for (const [achse, def] of Object.entries(recipe.axes || {})) {
      for (const [wert, v] of Object.entries(def.values || {})) {
        if (v.modifier) mods.push(String(v.modifier).replace(/^\./, ''));
        achsen.push(`${achse}=${wert}`);
      }
    }
    r.fehlendeModifier = [...new Set(mods)].filter((m) => !nennt(m));
    r.modifierOhneCss = [...new Set(mods)].filter((m) => !klassen.has(m));
    const toks = Object.values(recipe.styling?.tokenGroups || {}).flatMap((g) => g.tokens || []).map((t) => (typeof t === 'string' ? t : t?.token)).filter(Boolean);
    r.fehlendeTokens = toks.filter((t) => !nennt('--' + t));
    r.recipeTokensOhneCss = toks.filter((t) => !vars.has('--' + t));
    r.achsen = achsen;
    r.docsLink = recipe.meta?.pipeline?.docs ?? null;
  }
  ergebnis[slug] = r;
}

if (summe) {
  let n = 0;
  for (const r of Object.values(ergebnis)) {
    for (const k of ['toteKlassen', 'toteTokens', 'fehlendeSlots', 'fehlendeModifier', 'fehlendeTokens']) n += (r[k] || []).length;
  }
  console.log(`Doku-Befunde: ${n} ueber ${Object.keys(ergebnis).length} Seiten`);
} else if (alsJson) {
  // kein process.exit: das schnitte grosse JSON-Ausgaben ueber Pipes ab
  console.log(JSON.stringify(ergebnis, null, 2));
} else {
for (const [slug, r] of Object.entries(ergebnis)) {
  const n = (a) => (a ? a.length : 0);
  console.log(`\n${slug}: tote Klassen ${n(r.toteKlassen)}, tote Tokens ${n(r.toteTokens)}, fehlende Slots ${n(r.fehlendeSlots)}, Modifier ${n(r.fehlendeModifier)}, Tokens ${n(r.fehlendeTokens)}${r.recipe ? '' : ' (kein Recipe)'}`);
  for (const k of ['toteKlassen', 'toteTokens', 'fehlendeSlots', 'fehlendeModifier', 'modifierOhneCss', 'fehlendeTokens', 'recipeTokensOhneCss']) {
    if (n(r[k])) console.log(`  ${k}: ${r[k].join(', ')}`);
  }
}
}
