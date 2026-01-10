import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import sonarjs from 'eslint-plugin-sonarjs';
import security from 'eslint-plugin-security';
import importPlugin from 'eslint-plugin-import';

export default [
  {
    ignores: [
      'eslint.config.mjs',
      '**/*.test.ts',
      '**/*.spec.ts',
      '**/__tests__/**',
      '**/__mocks__/**',
      'dist',
      'coverage',
      'node_modules',
    ],
  },

  js.configs.recommended,

  ...tseslint.configs.recommendedTypeChecked,

  prettierRecommended,

  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'module',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },

    plugins: {
      sonarjs,
      security,
      import: importPlugin,
    },
    rules: {
      'import/no-unresolved': 'error',
      'import/no-cycle': 'warn',
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal'],
          pathGroups: [
            {
              pattern: '@/**',
              group: 'internal',
              position: 'after',
            },
          ],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],

      // =========================
      // Seguridad y robustez
      // =========================
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/no-unsafe-member-access': 'error',
      '@typescript-eslint/no-unsafe-call': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: true }],
      '@typescript-eslint/strict-boolean-expressions': 'error',
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],

      // =========================
      // Buenas prácticas
      // =========================
      'no-console': ['error', { allow: ['error', 'info', 'table'] }],
      'no-debugger': 'error',
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],
      'no-implicit-coercion': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'object-shorthand': ['error', 'always'],
      'prefer-template': 'error',

      // =========================
      // Formato
      // =========================
      'prettier/prettier': 'error',

      // =========================
      // SonarJS – calidad de código
      // =========================
      'sonarjs/no-duplicate-string': 'warn',
      'sonarjs/no-identical-functions': 'warn',
      'sonarjs/cognitive-complexity': ['warn', 15],
      'sonarjs/no-small-switch': 'warn',

      // =========================
      // Seguridad (estilo Sonar)
      // =========================
      'security/detect-object-injection': 'warn',
      'security/detect-non-literal-regexp': 'warn',
      'security/detect-eval-with-expression': 'error',
    },
  },
];
