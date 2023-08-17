module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
  ],
  settings: {
    'import/resolver': {
      typescript: {},
    },
  },
  parserOptions: {
    parser: '@babel/eslint-parser',
  },
  rules: {
    'vuejs-accessibility/media-has-caption': 'off',
    'linebreak-style': ['error', 'windows'],
    'global-require': 'off',
    'arrow-body-style': ['off'],
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'import/no-unresolved': 'off',
  },
};
