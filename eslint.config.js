import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
import tailwindcss from 'eslint-plugin-tailwindcss';
import globals from 'globals';

export default [
  {
    ignores: ['dist', 'node_modules', '.astro', 'coverage']
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    },
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }]
    }
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs['flat/recommended'],
  {
    plugins: {
      tailwindcss
    },
    rules: {
      ...tailwindcss.configs['flat/recommended'].rules,
      'tailwindcss/no-custom-classname': 'off'
    }
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
      ]
    }
  },
  { files: ['**/*.astro'], rules: { 'astro/no-set-html-directive': 'error' } }
];
