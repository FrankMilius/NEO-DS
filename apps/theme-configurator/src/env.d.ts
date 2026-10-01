// Typen fuer die Typpruefung (npm run typecheck, jsconfig.json) — Plan v2, 3.2
/// <reference types="vite/client" />

// Vite `define` (build-info.js)
declare const __APP_VERSION__: string
declare const __APP_COMMIT__: string
declare const __APP_BUILD_DATUM__: string

// Lokale Entwicklung: Speicher-Auswahl (speicher/index.js)
interface ImportMetaEnv {
  readonly VITE_NEO_SPEICHER?: string
  readonly VITE_NEO_BASIS_URL?: string
  readonly VITE_NEO_CSRF_TOKEN_URL?: string
  readonly VITE_NEO_RECHTE?: string
}
