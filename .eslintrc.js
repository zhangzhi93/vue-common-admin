module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/strongly-recommended',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    semi: ['warn', 'always'],
    quotes: 'warn',
    'quote-props': 'off',
    'comma-dangle': ['warn', {
      arrays: 'ignore',
      objects: 'only-multiline',
      imports: 'only-multiline',
      exports: 'only-multiline',
      functions: 'ignore',
    }],
    'space-before-function-paren': 'off',
    'prefer-promise-reject-errors': 'off',
    'no-useless-escape': 'off',
    'no-unused-vars': 'off',
    'no-multi-spaces': 'warn',
    'spaced-comment': 'warn',
    'key-spacing': 'off',
    'vue/no-unused-components': 'warn',
    'no-new': 'off',
    'no-prototype-builtins': 'off',
    'no-irregular-whitespace': 'off',
    'space-before-blocks': 0,
    'space-infix-ops': 0,
    'arrow-spacing': 0,
    'block-spacing': 'off',
    'camelcase': 'off',
    'no-mixed-spaces-and-tabs': 0,
    'node/handle-callback-err': 0,
    'node/no-callback-literal': 0,
    'no-empty': 1,
    'vue/max-attributes-per-line': [
      2,
      {
        'singleline': 5,
        'multiline': {
          'max': 1,
          'allowFirstLine': false
        }
      }
    ],
    'vue/attribute-hyphenation': 0,
    'vue/singleline-html-element-content-newline': 0,
  }
};
