#!/usr/bin/env node
// ==========================================================================
// pruefen:sg-schaerfe — wie scharf ist jede Karte jeder Story Gallery?
// (I18 Phase 13, 25.11.2026, Vorschlag 16)
//
//   npm run pruefen:sg-schaerfe -- [--block <id>] [--streng]
//
// Liest aus Drupal (DDEV) jede Story Gallery mit Kartenhöhe und Karten, dazu
// die Pixelmaße der Bilddateien, und rechnet mit derselben Formel wie die
// Ampel im Karten-Editor (packages/neo-behaviors/shot.js, shotSchaerfe und
// shotKasten): Bildpixel je Gerätepixel, Desktop bei 2-facher, Handy bei
// 3-facher Dichte. Grün ab 1,2, gelb ab 1, rot darunter — mit der Breite, die
// eine neue Datei mindestens haben müsste.
//
// Ein Bericht für die Redaktion: Ausgang 0, mit --streng 1 bei roten Karten.
// ==========================================================================
import { execFileSync } from 'node:child_process'
import { parseArgs } from 'node:util'
import { shotSchaerfe, shotKasten } from '../../packages/neo-behaviors/shot.js'

const { values: a } = parseArgs({
  options: {
    block: { type: 'string' },
    streng: { type: 'boolean', default: false },
    drupal: { type: 'string', default: '/Users/frank.milius/Sites/DRUPAL11' },
  },
})

const php = `$ids = ${a.block ? `[${Number(a.block)}]` : '\\Drupal::entityQuery("block_content")->accessCheck(FALSE)->condition("type", "neo_story_gallery")->execute()'};
$aus = [];
foreach ($ids as $id) {
  $b = \\Drupal\\block_content\\Entity\\BlockContent::load($id);
  if (!$b) continue;
  $karten = [];
  foreach (json_decode((string) $b->field_sg_cards->value, TRUE) ?: [] as $k) {
    $mass = null;
    if (!empty($k["image"]) && preg_match("#^/sites/default/files/(.+)$#", $k["image"], $m)) {
      $p = \\Drupal::service("file_system")->realpath("public://" . rawurldecode($m[1]));
      $g = $p && is_file($p) ? @getimagesize($p) : FALSE;
      if ($g) $mass = [$g[0], $g[1]];
    }
    $karten[] = ["titel" => $k["title"] ?? "", "ratio" => $k["ratio"] ?? "4/3", "zoom" => (float) ($k["zoom"] ?? 1), "anordnung" => $k["anordnung"] ?? "", "bild" => $mass, "video" => !empty($k["video"])];
  }
  $aus[] = ["id" => (int) $id, "name" => $b->label(), "hoehe" => (int) ($b->field_sg_card_height->value ?: 420), "karten" => $karten];
}
echo json_encode($aus);`
const roh = execFileSync('ddev', ['drush', 'php:eval', php], { cwd: a.drupal, encoding: 'utf8', maxBuffer: 1 << 24 })
const bloecke = JSON.parse(roh.trim().split('\n').pop())

const zeichen = { gruen: '●', gelb: '◐', rot: '○' }
let rot = 0
for (const b of bloecke) {
  console.log(`\nBlock ${b.id} „${b.name}“ · Kartenhöhe ${b.hoehe}`)
  b.karten.forEach((k, i) => {
    const nr = `  ${String(i + 1).padStart(2)} ${k.titel.slice(0, 34).padEnd(34)}`
    if (k.video) return console.log(`${nr} Video, nicht gemessen`)
    if (!k.bild) return console.log(`${nr} Bildmaße unbekannt (keine Datei unter /sites/default/files)`)
    const t = String(k.ratio).split('/').map(Number)
    const ganz = k.anordnung === 'ganz' || (!k.anordnung && t[0] < t[1])
    const werte = [false, true].map((handy) => shotSchaerfe({ bild: k.bild, kasten: shotKasten({ ratio: k.ratio, hoehe: b.hoehe, handy }), zoom: k.zoom, dichte: handy ? 3 : 2, ganz }))
    const schlecht = werte.some((w) => w.ampel === 'rot')
    if (schlecht) rot++
    // strengere Breite zählt (Desktop oder Handy)
    const noetig = Math.max(...werte.map((w) => w.mindestBreite))
    const fmt = (w) => `${zeichen[w.ampel]} ${w.wert.toFixed(2).replace('.', ',')}`
    console.log(`${nr} Desktop ${fmt(werte[0])} · Handy ${fmt(werte[1])} · ${k.bild[0]} × ${k.bild[1]} px${schlecht ? ` · neu hochladen ab ${noetig} px Breite` : ''}`)
  })
}
console.log(`\n${bloecke.length} Galerie(n) · ${rot} Karte(n) unter Schärfe 1`)
process.exit(a.streng && rot ? 1 : 0)
