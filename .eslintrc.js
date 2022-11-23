module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  extends: [
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
    './.eslintrc-auto-import.json'
  ],
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false,
  },
  globals: {
    defineProps: true,
    defineEmits: true,
    defineExpose: true,
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'warn',
    semi: ['warn', 'always'],
    quotes: ['warn', 'single'],
    'quote-props': 'off',
    'comma-dangle': ['warn', {
      arrays: 'ignore',
      objects: 'only-multiline',
      imports: 'only-multiline',
      exports: 'only-multiline',
      functions: 'ignore'
    }],
    'prefer-promise-reject-errors': 'off',
    'no-useless-escape': 'off',
    'no-unused-vars': 'off',
    'no-multi-spaces': 'warn',
    'space-before-function-paren': 'off',
    'spaced-comment': 'warn',
    'key-spacing': 'off',
    'no-new': 'off',
    'no-prototype-builtins': 'off',
    'no-irregular-whitespace': 'off',
    'space-before-blocks': 0,
    'space-infix-ops': 0,
    'arrow-spacing': 0,
    'camelcase': 1,
    'block-spacing': 'off',
    'no-mixed-spaces-and-tabs': 0,
    'no-empty': 1,
    'no-undef': 'warn',
    'node/handle-callback-err': 0,
    'node/no-callback-literal': 0,
    'no-useless-return': 0,
    'no-extend-native': 0,
    'vue/no-unused-components': 'warn',
    'vue/max-attributes-per-line': [
      2,
      {
        singleline: 5,
        multiline: 1
      }
    ],
    'vue/attribute-hyphenation': 0,
    'vue/singleline-html-element-content-newline': 0,
    'vue/multi-word-component-names': 0,
    'vue/valid-attribute-name': 0,
  }
};
