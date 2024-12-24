module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  plugins: ['prettier'],
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'prettier',
    'plugin:prettier/recommended',
    './.eslintrc-auto-import.json',
  ],
  parserOptions: {
    parser: '@babel/eslint-parser',
    ecmaVersion: 'latest',
    sourceType: 'module',
    requireConfigFile: false,
    allowImportExportEverywhere: true,
  },
  globals: {
    defineProps: true,
    defineEmits: true,
    defineExpose: true,
  },
  rules: {
    'prettier/prettier': 'warn',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'warn',
    semi: ['warn', 'always'],
    quotes: ['warn', 'single'],
    camelcase: 1,
    'quote-props': 0, // 不需要在对象字面属性名称周围加上引号
    'comma-dangle': [
      'warn',
      {
        arrays: 'ignore',
        objects: 'only-multiline',
        imports: 'only-multiline',
        exports: 'only-multiline',
        functions: 'ignore',
      },
    ],
    'prefer-promise-reject-errors': 0, // 不要求使用 Error 对象作为 Promise 拒绝原因
    'no-unused-vars': 1, // 提醒未使用的变量
    'no-multi-spaces': 2, // 禁止多个空格
    'space-before-function-paren': 0, // 在 function 定义左括号之前强制保持一致的间距
    'spaced-comment': 1, // 注释符号之后和之前要有空格
    'space-before-blocks': 0, // 在块之前强制保持一致的间距
    'space-infix-ops': 0, // 中缀运算符周围需要间距
    'block-spacing': 1, // 在打开块之后和关闭块之前禁止或强制块内的空格
    'no-mixed-spaces-and-tabs': 1, // 不允许使用混合空格和制表符进行缩进
    'no-empty': 1, // 禁止空块语句
    'no-undef': 'warn', // 除非在 /*global */ 注释中提及，否则不允许使用未声明的变量
    'no-useless-return': 1, // 不允许多余的返回语句
    'no-extend-native': 1, // 扩展原生类型时提醒
    'node/handle-callback-err': 0, // 该规则期望当你在 Node.js 中使用回调模式时，你将处理错误。
    'node/no-callback-literal': 0,
    'vue/no-unused-components': 'warn',
    'vue/multi-word-component-names': 0,
    'vue/max-attributes-per-line': [
      2,
      {
        singleline: 5,
        multiline: 2,
      },
    ],
  },
};
