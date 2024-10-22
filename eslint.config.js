import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: { react: { version: '18.3' } },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      'react/jsx-no-target-blank': 'off',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      // Airbnb-like rules manually since the npm package doesn't support this new eslint object shape (v9)
      'array-bracket-spacing': ['error', 'never'],
      'block-spacing': ['error', 'always'],
      'comma-dangle': ['error', 'always-multiline'],
      'comma-spacing': ['error', { before: false, after: true }],
      'eol-last': ['error', 'always'],
      'func-call-spacing': ['error', 'never'],
      indent: ['error', 2, { SwitchCase: 1 }],
      'jsx-quotes': ['error', 'prefer-double'],
      'key-spacing': ['error', { beforeColon: false, afterColon: true }],
      'linebreak-style': ['error', 'unix'],
      'no-console': ['warn'],
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0 }],
      'no-trailing-spaces': ['error'],
      'no-unused-vars': ['error', { args: 'none', ignoreRestSiblings: true }],
      'object-curly-spacing': ['error', 'always'],
      quotes: ['error', 'single', { avoidEscape: true }],
      'space-before-function-paren': 'off',
      'space-in-parens': ['error', 'never'],
      'spaced-comment': ['error', 'always', { markers: ['!'] }],
      'arrow-spacing': ['error', { before: true, after: true }],

      // React-specific Airbnb-like rules
      'react/jsx-filename-extension': ['warn', { extensions: ['.jsx', '.js'] }],
      'react/jsx-indent': ['error', 2],
      'react/jsx-indent-props': ['error', 2],
      'react/jsx-tag-spacing': ['error', { beforeSelfClosing: 'always' }],
      'react/jsx-wrap-multilines': [
        'error',
        { declaration: 'parens-new-line', assignment: 'parens-new-line' },
      ],
      'react/prop-types': 'off', // If not using PropTypes
      'react/react-in-jsx-scope': 'off', // If using React 17+ (JSX transform)

      // React Hooks rules
      'react-hooks/rules-of-hooks': 'error', // Checks rules of Hooks
      'react-hooks/exhaustive-deps': 'warn', // Checks effect dependencies
    },
  },
]
