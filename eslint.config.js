import js from '@eslint/js'
import jestPlugin from 'eslint-plugin-jest'

export default [
  js.configs.recommended,
  {
    languageOptions: {
      globals: {
        process: 'readonly',
      },
    },
  },
  {
    files: ['ApiResponse.js'],
    languageOptions: {
      globals: jestPlugin.environments.globals.globals,
    },
  },
  {
    files: ['tests/**/*.js'],
    plugins: { jest: jestPlugin },
    languageOptions: {
      globals: jestPlugin.environments.globals.globals,
    },
    rules: {
      ...jestPlugin.configs.recommended.rules,
      'jest/expect-expect': 'off',
    },
  },
]
