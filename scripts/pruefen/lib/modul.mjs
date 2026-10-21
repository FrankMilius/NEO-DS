// Modul-e2e der Prüfwerkzeuge (E3, 21.10.2026).
// Die Modul-e2e legen Test-Themes an (Labels „E2E …“, „UX-Audit …“) und
// schreiben eine Vorschau unter der Benutzer-Nummer des Testkontos. Nur das
// wird aufgeräumt; „Kundentheme NEU“ bleibt immer stehen. neo_theme ist eine
// Konfigurations-Entität — gelöscht wird über die Entitäts-API in der
// Datenbank, config/sync bleibt unberührt.
// Checkouts werden nur geprüft, nie umgeschaltet (Entscheidung Frank 21.10.2026).

const PRAEFIX = /^(E2E|UX-Audit)/
const GESCHUETZT = { id: 'kundentheme_neu', label: 'Kundentheme NEU' }

const geschuetzt = (t) => t.id === GESCHUETZT.id || t.label === GESCHUETZT.label

/** Themes, die die Modul-e2e angelegt haben. */
export function waehleZumLoeschen (themes) {
  return themes.filter((t) => PRAEFIX.test(t.label) && !geschuetzt(t))
}

function konto (name) {
  if (!/^[\w.@-]+$/.test(name)) throw new Error(`Kontoname „${name}“ ungültig`)
  return name
}

/** PHP für drush php:eval: alle Themes und ob das Testkonto eine Vorschau hat. Ändert nichts. */
export function phpListe (kontoname) {
  return `$s = \\Drupal::entityTypeManager()->getStorage("neo_theme");
$t = []; foreach ($s->loadMultiple() as $e) { $t[] = ["id" => $e->id(), "label" => $e->label()]; }
$u = user_load_by_name("${konto(kontoname)}"); $uid = $u ? (string) $u->id() : null;
$v = $uid !== null && \\Drupal::keyValue("neo_theme_konfigurator.vorschau")->has($uid);
echo json_encode(["themes" => $t, "uid" => $uid, "vorschau" => $v]);`
}

/** PHP für drush php:eval: löscht die Themes (Präfix und Schutz werden dort erneut geprüft) und die Vorschau des Testkontos. */
export function phpLoeschen (ids, kontoname) {
  return `$s = \\Drupal::entityTypeManager()->getStorage("neo_theme"); $weg = [];
foreach (${JSON.stringify(ids)} as $id) { $e = $s->load($id);
  if ($e && preg_match('/^(E2E|UX-Audit)/', $e->label()) && $e->id() !== "${GESCHUETZT.id}" && $e->label() !== "${GESCHUETZT.label}") { $weg[] = $e->label(); $e->delete(); } }
$u = user_load_by_name("${konto(kontoname)}"); $vorschau = false;
if ($u) { $uid = $u->id(); $kv = \\Drupal::keyValue("neo_theme_konfigurator.vorschau");
  if ($kv->has((string) $uid)) { $kv->delete((string) $uid); $vorschau = true; } }
echo json_encode(["geloescht" => $weg, "vorschau" => $vorschau]);`
}

/** Meldungen zu Checkouts, die nicht auf dem erwarteten Zweig stehen. */
export function pruefeZweige (ist, soll, pfade) {
  const namen = { drupal: 'DRUPAL11', theme: 'neo_fe' }
  return Object.keys(namen)
    .filter((k) => ist[k] !== soll[k])
    .map((k) => `${namen[k]} auf ${ist[k]}, erwartet ${soll[k]} — selbst umschalten: git -C ${pfade[k]} switch ${soll[k]}`)
}
