// ==========================================================================
// Recipes im Status „draft" (Plan v3, Phase 4)
// ==========================================================================
// Die Navigation braucht den Status beim Start, die Recipes laedt der
// Konfigurator aber erst beim Oeffnen (useRecipeLoader, Code-Splitting) — alle
// 130 Recipe-Kopfzeilen ins Einstiegs-Bundle zu holen kostete rund 100 kB
// (Changelogs). Deshalb diese Liste. Sie ist keine zweite Quelle, die
// unbemerkt driftet: tests/navigation/entwuerfe.test.js vergleicht sie in
// beide Richtungen mit meta.status in data/*-recipe.json. Wer ein Recipe
// freigibt oder als Entwurf anlegt, traegt es hier aus bzw. ein.
//
// Der Arena-Kopf (LaboratoryPanel) liest den Status aus dem geladenen Recipe
// selbst und nimmt die Liste nur, solange es noch laedt.
//
// Seit 08.10.2026 leer: die letzten Entwuerfe scroll-expand und scroll-reveal
// sind stillgelegt (Entscheidung Abschluss 2). Der Mechanismus bleibt —
// ein neues Recipe im Status draft wird wieder hier eingetragen.
// ==========================================================================

/** @type {ReadonlyArray<string>} */
export const ENTWUERFE = Object.freeze([])

const MENGE = new Set(ENTWUERFE)

/** Steht das Recipe auf meta.status „draft"? */
export function istEntwurf (id) {
  return MENGE.has(id)
}

/** Text fuer Kennzeichen (title/Hinweis). */
export const ENTWURF_HINWEIS = 'Recipe im Status „draft": Anatomie, Achsen und Zustände sind noch nicht freigegeben.'
