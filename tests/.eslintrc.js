module.exports = {
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js']
      }
    }
  },
  parser: 'babel-eslint',
  env: {
    node: true,
    es6: true,
  },
  globals: {
  },
  extends: ['airbnb'],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 6,
    impliedStrict: true,
    ecmaFeatures: {
      experimentalObjectRestSpread: false,
      jsx: false,
    }
  },
  plugins: [
    'babel',
    'jsx-a11y',
    'react',
  ],
  rules: {
    'jsx-quotes': ['error', 'prefer-double'],
    'babel/flow-object-type': 1,
    'babel/generator-star-spacing': 0,
    'babel/new-cap': 0,
    'babel/object-curly-spacing': 0,
    'babel/object-shorthand': 1,
    'babel/arrow-parens': 0,
    'babel/no-await-in-loop': 1,
    'arrow-parens': 0,
    'new-cap': [
      'warn',
      {
        newIsCap: true,
        capIsNewExceptions: [
          'Color',
        ]
      },
    ],
    indent: [
      'warn',
      2
    ],
    'linebreak-style': [
      'warn',
      'unix'
    ],
    quotes: [
      'warn',
      'single'
    ],
    semi: [
      'warn',
      'always'
    ],
    'comma-dangle': [
      'warn',
      'always-multiline'
    ],
    'no-unused-vars': 1,
    'no-use-before-define': 1,
    'no-console': [
      'warn', { allow: ['warn', 'error']}
    ],
    'no-mixed-operators': 0,
    'class-methods-use-this': 0,
    'no-plusplus': ['error', { 'allowForLoopAfterthoughts': true }],
  }
};
