#!/bin/zsh
# ---------------------------------------------------------------------------
# Woechentlicher Lauf der Arbeitsbilanz, gestartet von launchd.
#
# WARUM EIN WRAPPER UND NICHT DIREKT NODE IM PLIST
# launchd startet mit einem nackten Umfeld: kein PATH, keine Shell-Profile.
# `git` faende sich noch, `node` nicht. Alles Noetige steht deshalb hier
# ausdruecklich, und der Lauf protokolliert sich selbst — ein stiller
# Fehlschlag um 8:47 Uhr faellt sonst wochenlang niemandem auf.
# ---------------------------------------------------------------------------

export PATH="/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"
PROJEKT="/Users/frank.milius/Sites/WEBSITE26"
LOG="$PROJEKT/data/bilanz/lauf.log"

mkdir -p "$PROJEKT/data/bilanz"
cd "$PROJEKT" || exit 1

{
  echo ""
  echo "════════════════════════════════════════════════════════════"
  echo "Lauf: $(date '+%Y-%m-%d %H:%M:%S')"
  /usr/local/bin/node scripts/arbeitsbilanz.js --wochen 1 --mail
  echo "Rückgabecode: $?"
} >> "$LOG" 2>&1

# Protokoll kurz halten: nur die letzten 400 Zeilen behalten.
if [ -f "$LOG" ]; then
  tail -n 400 "$LOG" > "$LOG.tmp" && mv "$LOG.tmp" "$LOG"
fi
