module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'import/prefer-default-export': 'off',
    'no-param-reassign': 'off',
    'max-len': 'off',
    'arrow-parens': 'off',
    'arrow-body-style': 'off',
    'import/no-dynamic-require': 'off',
    'global-require': 'off',
    'no-unused-vars': 'warn',
    'no-plusplus': 'off',
    'consistent-return': 'off',
    'no-prototype-builtins': 'off',
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
};
