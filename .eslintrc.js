module.exports = {
    env: {
        browser: true,
        es2021: true,
        jest: true,
        node: true,
    },
    globals: {
        process: true,
    },
    extends: ['eslint:recommended', 'plugin:react/recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
    overrides: [],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    plugins: ['react', 'react-hooks', '@typescript-eslint', 'prettier', 'jsx-a11y'],
    rules: {
        'react/react-in-jsx-scope': 'off',
        // "camelcase": ["error", { "properties": "never" }],
        camelcase: 'off',
        'spaced-comment': ['warn'],
        quotes: ['off', 'single'],
        'prefer-const': 'off',
        'no-duplicate-imports': 'warn',
        'react/prop-types': [0],
        'no-empty-function': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        'react-hooks/exhaustive-deps': ['warn'],
        '@typescript-eslint/no-var-requires': 0,
        'jsx-a11y/anchor-is-valid': ['warn'],
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': ['warn'],
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-inferrable-types': 'off',
        '@typescript-eslint/ban-types': [
            'error',
            {
                extendDefaults: true,
                types: {
                    '{}': false,
                },
            },
        ],
    },
    settings: {
        'import/resolver': {
            typescript: {},
        },
    },
};
