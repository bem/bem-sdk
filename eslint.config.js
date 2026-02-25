import js from '@eslint/js';

export default [
    js.configs.recommended,
    {
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                console: 'readonly',
                process: 'readonly',
                setTimeout: 'readonly',
                clearTimeout: 'readonly',
                setInterval: 'readonly',
                clearInterval: 'readonly',
                URL: 'readonly',
                Buffer: 'readonly',
            }
        },
        rules: {
            'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        }
    },
    {
        files: ['**/*.test.js'],
        languageOptions: {
            globals: {
                describe: 'readonly',
                it: 'readonly',
                before: 'readonly',
                beforeEach: 'readonly',
                after: 'readonly',
                afterEach: 'readonly',
                utils: 'readonly',
            }
        },
        rules: {
            'no-unused-expressions': 'off',
        }
    },
    {
        files: ['**/*.spec.js'],
        languageOptions: {
            globals: {
                describe: 'readonly',
                it: 'readonly',
                before: 'readonly',
                beforeEach: 'readonly',
                after: 'readonly',
                afterEach: 'readonly',
                lib: 'readonly',
                utils: 'readonly',
            }
        },
        rules: {
            'no-unexpected-multiline': 'off',
            'no-unused-expressions': 'off',
        }
    },
    {
        files: ['**/*.bench.js'],
        languageOptions: {
            globals: {
                suite: 'readonly',
                set: 'readonly',
                bench: 'readonly',
            }
        }
    },
    {
        ignores: ['node_modules/**', 'packages/*/node_modules/**', '.claude/**']
    }
];
