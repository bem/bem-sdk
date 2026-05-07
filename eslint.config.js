import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export default tseslint.config(
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/coverage/**',
      '**/.nyc_output/**',
      '.worktrees/**',
      'pnpm-lock.yaml',
      // Legacy CJS sources — migrated package-by-package in Phase 5.
      // Remove this glob entry per package as it is converted to TS.
      'packages/**/*.js',
      'packages/**/*.d.ts',
      'packages/**/test/**',
      'packages/**/spec/**',
      'packages/**/benchmark/**',
      'packages/**/bench/**',
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  {
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: { ...globals.node, ...globals.es2024 },
    },
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },

  // Mocha test files
  {
    files: ['**/*.test.{js,ts}', '**/*.spec.{js,ts}'],
    languageOptions: {
      globals: { ...globals.mocha },
    },
    rules: {
      '@typescript-eslint/no-unused-expressions': 'off',
    },
  },

  // Scripts (CJS-friendly tooling)
  {
    files: ['scripts/**/*.{mjs,js}'],
    rules: {
      'no-console': 'off',
    },
  },
);
