#!/usr/bin/env bash
# ==========================================================================
# Modul-Paket des Theme-Konfigurators für den Server (Übergabe 19.10.2026)
#
#   bash scripts/modul-paket.sh [Zielordner]          (Vorgabe: dist/modul-paket)
#
# Baut die App mit dem Pfad des Drupal-Moduls neo_theme_konfigurator und
# schnürt dessen Ordner app/ als ZIP:
#
#   neo_theme_konfigurator-app-<Version>.zip
#     app/theme-config.html
#     app/theme-configurator/…          gebaute App
#     app/daten/icons-manifest*.json    Icon-Listen
#     app/HERKUNFT.txt                  Version, Commit, Zeitpunkt
#
# Auf dem Server im Modulordner entpacken (ersetzt app/):
#   cd web/modules/custom/neo_theme_konfigurator
#   rm -rf app && unzip -q <zip> && cat app/HERKUNFT.txt && drush cr
#
# Gleicher Inhalt wie scripts/app-uebernehmen.sh im Modul (DRUPAL11), aber
# ohne Zugriff auf DRUPAL11 — so baut es auch die Release-Pipeline.
# Voraussetzung: npm ci, npm run build:css, apps/theme-configurator: npm ci.
# ==========================================================================
set -euo pipefail

DS="$(cd "$(dirname "$0")/.." && pwd)"
APP="$DS/apps/theme-configurator"
ZIEL="${1:-$DS/dist/modul-paket}"
BASIS="/modules/custom/neo_theme_konfigurator/app/theme-configurator/"

[ -f "$DS/styles.css" ] || { echo "styles.css fehlt — erst 'npm run build:css'" >&2; exit 2; }
command -v zip >/dev/null || { echo "zip fehlt" >&2; exit 2; }

VERSION="$(node -p "require('$APP/package.json').version")"
HASH="$(git -C "$DS" rev-parse --short HEAD 2>/dev/null || echo unbekannt)"
if [ -n "$(git -C "$DS" status --porcelain -- apps/theme-configurator data styles.css 2>/dev/null)" ]; then
  echo "Hinweis: ungespeicherte Änderungen in App, data/ oder styles.css — das Paket enthält sie, HERKUNFT nennt trotzdem $HASH." >&2
fi

ARBEIT="$(mktemp -d)"
trap 'rm -rf "$ARBEIT"' EXIT
(cd "$APP" && KONFIGURATOR_BASE="$BASIS" KONFIGURATOR_AUSGABE="$ARBEIT/build" npx vite build --logLevel warn)
[ -f "$ARBEIT/build/theme-config.html" ] || { echo "Build ohne theme-config.html" >&2; exit 1; }

mkdir -p "$ARBEIT/paket/app/daten"
cp "$ARBEIT/build/theme-config.html" "$ARBEIT/paket/app/"
cp -R "$ARBEIT/build/theme-configurator" "$ARBEIT/paket/app/"
cp "$DS/data/icons-manifest.json" "$DS/data/icons-manifest-heroicons.json" "$ARBEIT/paket/app/daten/"
printf 'App %s aus WEBSITE26 %s, gebaut %s (Modul-Paket)\n' "$VERSION" "$HASH" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" > "$ARBEIT/paket/app/HERKUNFT.txt"

# Der Basis-Pfad muss im Einstieg stehen, sonst lädt die App ihre Dateien nicht
grep -q "$BASIS" "$ARBEIT/paket/app/theme-config.html" || { echo "Einstieg ohne Modul-Pfad $BASIS" >&2; exit 1; }

mkdir -p "$ZIEL"
ZIEL="$(cd "$ZIEL" && pwd)"   # absolut: gezippt wird aus dem Arbeitsordner
DATEI="$ZIEL/neo_theme_konfigurator-app-$VERSION.zip"
rm -f "$DATEI"
(cd "$ARBEIT/paket" && zip -qr "$DATEI" app)
( cd "$ZIEL" && shasum -a 256 "$(basename "$DATEI")" > "$(basename "$DATEI").sha256" )
echo "$DATEI"
cat "$ARBEIT/paket/app/HERKUNFT.txt"
echo "$(find "$ARBEIT/paket/app" -type f | wc -l | tr -d ' ') Dateien, $(du -h "$DATEI" | cut -f1) gepackt"
