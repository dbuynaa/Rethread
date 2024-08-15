/** @type {import("eslint").Linter.Config} */
const config = {
  env: {
    browser: true,
    node: true,
    es2020: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  plugins: ['@typescript-eslint', 'react', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'next',
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'prettier',
  ],
  rules: {
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        semi: true,
        tabWidth: 2,
        trailingComma: 'all',
        endOfLine: 'auto',
      },
    ],
    'react/react-in-jsx-scope': 'off',
    // "react/prop-types": "off",
    // "@typescript-eslint/explicit-module-boundary-types": "off",
    '@next/next/no-img-element': 'off',
    '@next/next/no-sync-scripts': 'off',
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      typescript: {}, // this loads <rootdir>/tsconfig.json to eslint
    },
  },
  ignorePatterns: ['node_modules/*', 'next.config.js'],
};
module.exports = config;
