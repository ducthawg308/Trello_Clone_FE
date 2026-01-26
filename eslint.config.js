import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      /* =======================
      * Core / Possible Errors
      * ======================= */
      'no-undef': 'error',
      'no-debugger': 'error',
      'eqeqeq': ['error', 'always'],
      'no-unused-vars': ['warn', { varsIgnorePattern: '^[A-Z_]' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],

      /* =======================
      * React / Hooks
      * ======================= */
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      /* =======================
      * Imports
      * ======================= */
      'import/no-duplicates': 'error',
      'import/order': [
        'warn',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          'newlines-between': 'always',
        },
      ],

      /* =======================
      * Style / Spacing
      * ======================= */
      'semi': ['warn', 'never'],
      'quotes': ['warn', 'single', { avoidEscape: true }],
      'array-bracket-spacing': ['warn', 'never'],
      'keyword-spacing': ['warn', { before: true, after: true }],
      'comma-spacing': ['warn', { before: false, after: true }],
      'operator-spacing': ['warn', { before: true, after: true }],
      'no-multi-spaces': ['warn', { ignoreEOLComments: true }],
      'no-multiple-empty-lines': ['warn', { max: 1 }],

      /* =======================
      * Clean Code
      * ======================= */
      'prefer-const': 'warn',
      'no-var': 'error',
      'object-shorthand': 'warn',

      /* =======================
      * Safety / Best Practices
      * ======================= */
      'no-alert': 'warn',
    },
  },
])
