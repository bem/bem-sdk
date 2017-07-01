'use strict';

module.exports = {
    root: true,
    parserOptions: {
        ecmaVersion: 6
    },
    env: {
        node: true,
        es6: true
    },
    // plugins: ['node', 'promise', 'unicorn'],
    extends: 'pedant',

    overrides: [
        {
            files: ['*.test.js'],
            env: { mocha: true },
            globals: { 'utils': true },
            rules: {
                'no-unused-expressions': 'no'
            }
        },
        {
            files: ['*.spec.js'],
            globals: { 'lib': true, 'utils': true },
            rules: {
                'no-unexpected-multiline': 'no'
            }
        },
        {
            files: ['*.bench.js'],
            globals: { 'suite': true, 'set': true, 'bench': true }
        }
    ],

    rules: {
        /* Strict Mode ========================================================================= */
        /* http://eslint.org/docs/rules/#strict-mode                                             */
        /* ===================================================================================== */
        'strict': ['error', 'safe']
    }
};
