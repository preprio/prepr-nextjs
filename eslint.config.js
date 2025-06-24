import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default [
  // Base configuration for all files
  {
    ignores: ['dist/', 'node_modules/', '*.config.js', '*.config.ts'],
  },
  
  // JavaScript files
  {
    files: ['**/*.js', '**/*.mjs'],
    ...js.configs.recommended,
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        browser: 'readonly',
        node: 'readonly',
      },
    },
    rules: {
      'no-console': 'warn',
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
  
  // TypeScript files
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        browser: 'readonly',
        node: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
      react,
      'react-hooks': reactHooks,
      prettier,
    },
    rules: {
      // TypeScript rules
      ...typescript.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      
      // React rules
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off', // Not needed in Next.js
      'react/prop-types': 'off', // Using TypeScript instead
      'react/display-name': 'off',
      
      // General rules
      'prefer-const': 'error',
      'no-var': 'error',
      
      // Prettier integration
      'prettier/prettier': 'error',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  
  // Prettier config (must be last)
  prettierConfig,
]; 