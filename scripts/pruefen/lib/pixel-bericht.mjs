// Urteil und Bericht des Pixelvergleichs (E3, 21.10.2026).
// ab = Pixel, in denen nachher von vorher abweicht; ac = Pixel, in denen die
// Kontrollaufnahme (vorher noch einmal) von vorher abweicht, also Rauschen der
// Seite selbst (Karussell, Video, Zufallsinhalt). Geändert ist eine Seite erst,
// wenn ab deutlich über ac liegt; sonst „unklar“ — von Hand ansehen.

export const FAKTOR = 2

export function urteil ({ ab, ac }) {
  if (ab === 0) return 'unverändert'
  return ab > FAKTOR * ac ? 'geändert' : 'unklar'
}

const seiten = (n) => (n === 1 ? '1 Seite' : `${n} Seiten`)

/** Textbericht für eine Breite; Fehlerseiten zählen nicht zu den geprüften. */
export function bericht (breite, ergebnisse) {
  const geprueft = ergebnisse.filter((e) => !e.fehler)
  const fehler = ergebnisse.filter((e) => e.fehler)
  const auffaellig = geprueft.map((e) => ({ ...e, urteil: urteil(e) })).filter((e) => e.urteil !== 'unverändert')
  const zeilen = [`${breite} Seiten mit Unterschied: ${auffaellig.filter((e) => e.urteil === 'geändert').length} von ${geprueft.length}`]
  for (const e of auffaellig) zeilen.push(`  ${e.urteil.padEnd(9)} ${e.seite}  Unterschied ${e.ab} · Rauschen ${e.ac}`)
  const wiederholt = geprueft.filter((e) => e.wiederholt)
  if (wiederholt.length) {
    const ruhig = wiederholt.filter((e) => urteil(e) === 'unverändert').map((e) => e.seite)
    zeilen.push(`  wiederholt: ${seiten(wiederholt.length)}, danach unauffällig: ${ruhig.join(', ') || 'keine'}`)
  }
  if (fehler.length) {
    zeilen.push(`  Fehler: ${seiten(fehler.length)} nicht geprüft`)
    for (const e of fehler) zeilen.push(`    ${e.seite}  ${e.fehler}`)
  }
  return zeilen.join('\n')
}
