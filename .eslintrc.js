module.exports = {
  parser: '@typescript-eslint/parser',
  'env': {
    'es6': true,
    'node': true
  },
  plugins: ['@typescript-eslint'],
  'extends': [
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  'globals': {
    'Atomics': 'readonly',
    'SharedArrayBuffer': 'readonly'
  },
  'parserOptions': {
    'ecmaVersion': 2018,
    'sourceType': 'module'
  },
  'rules': {
  }
}