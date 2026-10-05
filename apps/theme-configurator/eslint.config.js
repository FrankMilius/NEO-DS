// ==========================================================================
// ESLint (flat config) — Theme-Konfigurator (Plan v2, 3.2)
// ==========================================================================
// Ziel: echte Fehler finden, nicht den Stil umschreiben. Der Code hat einen
// eigenen, konsistenten Stil (ohne Semikolons, lange Attributzeilen in
// Arenen); die reinen Layout-Regeln von eslint-plugin-vue sind deshalb aus.
// Prettier ist bewusst NICHT eingebunden (Begruendung: README, „Lint und
// Typen“). Aufruf: npm run lint   ·   im Hook nur gestagte Dateien.
// ==========================================================================

import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'

export default [
  {
    ignores: [
      'node_modules/**', 'dist/**', 'public/**',
      'playwright-report/**', 'test-results/**', 'blob-report/**',
      'e2e/__screenshots__/**',
      // Generat aus scripts/generate-tokens.cjs — nicht von Hand pflegen
      'src/data/tokens.generated.js',
    ],
  },

  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],

  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser },
    },
    rules: {
      // --- echte Fehler -----------------------------------------------------
      'no-unused-vars': ['error', {
        // Signaturen (Render-Helfer, Callbacks) duerfen ungenutzte Parameter haben
        args: 'none',
        caughtErrors: 'none',
        ignoreRestSiblings: true,
        varsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
      }],
      // Leere catch-Bloecke sind hier bewusst (localStorage, JSON.parse)
      'no-empty': ['error', { allowEmptyCatch: true }],

      // --- Vue: Inhalt behalten, Layout aus -----------------------------------
      'vue/max-attributes-per-line': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/multiline-html-element-content-newline': 'off',
      'vue/html-indent': 'off',
      'vue/html-closing-bracket-spacing': 'off',
      'vue/html-closing-bracket-newline': 'off',
      'vue/html-self-closing': 'off',
      'vue/first-attribute-linebreak': 'off',
      'vue/attributes-order': 'off',
      'vue/attribute-hyphenation': 'off',
      'vue/v-on-event-hyphenation': 'off',
      // Arenen buendeln ihre Specimen-Komponenten bewusst in einer Datei
      'vue/one-component-per-file': 'off',
      // Props ohne Default sind in den Arenen ueblich (undefined = „nicht gesetzt“)
      'vue/require-default-prop': 'off',
      // Warnungen, aber verbindlich: npm run lint laeuft mit --max-warnings 0.
      // v-html nur mit begruendetem eslint-disable-next-line (Quelle im Repo).
      'vue/no-v-html': 'warn',
      'vue/no-template-shadow': 'warn',
    },
  },

  // Tests: Vitest-Globals (vitest.config.js: globals: true) und Node
  {
    files: ['tests/**'],
    languageOptions: { globals: { ...globals.node, ...globals.vitest } },
  },

  // Konfigurationsdateien, Playwright
  {
    files: ['*.js', '*.cjs', '*.mjs', 'e2e/**'],
    languageOptions: { globals: { ...globals.node } },
  },
]
