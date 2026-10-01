// @ts-check
// ==========================================================================
// App-Version (Plan v2, 4.5)
// ==========================================================================
// Version, Git-Kurz-Hash und Build-Datum der App — zur Build-Zeit per Vite
// `define` eingesetzt (build-info.js). Ohne define (z. B. ein Werkzeug, das
// das Modul roh laedt) greifen Platzhalter, statt dass die App abbricht.
//
// Nicht verwechseln: state.version im Theme-Store ist die Version des
// bearbeiteten THEMES (Metadaten, vom Nutzer gesetzt), nicht die der App.
// ==========================================================================

/* global __APP_VERSION__, __APP_COMMIT__, __APP_BUILD_DATUM__ */
export const APP_VERSION = typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : '0.0.0-dev'
export const APP_COMMIT = typeof __APP_COMMIT__ !== 'undefined' ? __APP_COMMIT__ : 'unbekannt'
export const APP_BUILD_DATUM = typeof __APP_BUILD_DATUM__ !== 'undefined' ? __APP_BUILD_DATUM__ : ''

/** ISO-Zeitpunkt → „30.09.2026, 11:56 UTC“; leer/ungueltig → '' */
export function formatiereBuildDatum (iso) {
  const d = new Date(iso)
  if (!iso || Number.isNaN(d.getTime())) return ''
  const z = (n) => String(n).padStart(2, '0')
  return `${z(d.getUTCDate())}.${z(d.getUTCMonth() + 1)}.${d.getUTCFullYear()}, ${z(d.getUTCHours())}:${z(d.getUTCMinutes())} UTC`
}

/** Kurztext fuer den Header: „App 1.0.0-rc.1 · a1b2c3d“ */
export function appVersionKurz ({ version = APP_VERSION, commit = APP_COMMIT } = {}) {
  return `App ${version} · ${commit}`
}

/** Langtext (Tooltip, Fehlermeldungen, Support): mit Build-Datum */
export function appVersionLang ({ version = APP_VERSION, commit = APP_COMMIT, datum = APP_BUILD_DATUM } = {}) {
  const wann = formatiereBuildDatum(datum)
  return `Theme-Konfigurator ${version}, Commit ${commit}` + (wann ? `, gebaut ${wann}` : '')
}
