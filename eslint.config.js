// Flat config for ESLint 9/10. Order matters: prettier compat goes last so it can
// turn off any stylistic rules that would fight Prettier's formatter.
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  // 1. Global ignores — must be its own object with only `ignores` to act as a
  //    global filter, not a per-config ignore.
  {
    ignores: [
      'dist/**',
      'build/**',
      'coverage/**',
      'node_modules/**',
      '.bun/**',
      '*.min.js',
      'notes/**', // markdown knowledge base, not linted
    ],
  },

  // 2. Base recommended JS rules.
  js.configs.recommended,

  // 3. TypeScript recommended (non-type-checked variant; fast). Switch to
  //    recommendedTypeChecked when we want type-aware rules.
  ...tseslint.configs.recommended,

  // 4. React + hooks + jsx-a11y for source files.
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
      'react-refresh': reactRefresh,
    },
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
        ...globals.es2024,
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      ...react.configs.flat.recommended.rules,
      ...react.configs.flat['jsx-runtime'].rules,
      ...reactHooks.configs.flat.recommended.rules,
      ...jsxA11y.flatConfigs.recommended.rules,

      // React Refresh — only-export-components keeps HMR happy in dev. Lessons
      // each export a `meta` object alongside their component; whitelist it so
      // we don't get a warning per lesson file.
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true, allowExportNames: ['meta'] },
      ],

      // React 19 uses the new JSX transform: no React import needed.
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',

      // Lesson pages are content-heavy: natural apostrophes and quotes are fine.
      'react/no-unescaped-entities': 'off',

      // Unused vars/imports are an error — `noUnusedLocals` in tsconfig catches
      // the cases ESLint misses (e.g. imports used only inside `declare module`
      // augmentations). Underscore-prefix to opt out for intentional unused.
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      // Prefer inline type imports for slimmer bundles.
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
    },
  },

  // 5. Config files run in Node; expose Node globals.
  {
    files: ['**/*.config.{js,ts,mjs,cjs}', 'eslint.config.*', 'server.ts', 'build.ts'],
    languageOptions: {
      globals: { ...globals.node },
    },
  },

  // 6. Prettier compat — disable rules that would conflict with the formatter.
  //    MUST be last so it overrides everything above.
  prettier,
);
