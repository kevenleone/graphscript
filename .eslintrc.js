module.exports = {
  env: {
    es2020: true,
    node: true,
  },
  extends: ['plugin:@typescript-eslint/recommended', 'prettier/@typescript-eslint', 'plugin:prettier/recommended'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'prettier', 'simple-import-sort', 'sort-destructure-keys', 'sort-keys-fix'],
  rules: {
    '@typescript-eslint/no-explicit-any': 0,
    camelcase: 'off',
    'no-explicit-any': 'off',
    semi: ['error', 'always'],
    'simple-import-sort/sort': 'error',
    'sort-destructure-keys/sort-destructure-keys': [2, { caseSensitive: false }],
    'sort-keys': ['error', 'asc', { caseSensitive: true, minKeys: 2, natural: false }],
    'sort-keys-fix/sort-keys-fix': 'warn',
  },
};
