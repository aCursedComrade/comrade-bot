export default [
    {
        rules: {
            'arrow-spacing': [
                'warn',
                {
                    'before': true,
                    'after': true,
                },
            ],
            'brace-style': [
                'error',
                '1tbs',
                {
                    'allowSingleLine': true,
                },
            ],
            'comma-dangle': ['error', 'always-multiline'],
            'comma-spacing': 'error',
            'comma-style': 'error',
            'curly': ['error', 'multi-line', 'consistent'],
            'dot-location': ['error', 'property'],
            'handle-callback-err': 'off',
            'indent': [
                'error',
                4,
                {
                    'SwitchCase': 1,
                },
            ],
            'keyword-spacing': 'error',
            'max-nested-callbacks': 'off',
            'max-statements-per-line': 'off',
            'no-console': 'off',
            'no-empty-function': 'error',
            'no-floating-decimal': 'error',
            'no-inline-comments': 'off',
            'no-lonely-if': 'error',
            'no-multi-spaces': 'error',
            'no-trailing-spaces': ['error'],
            'no-var': 'error',
            'no-unused-vars': 'warn',
            'object-curly-spacing': ['error', 'always'],
            'prefer-const': 'warn',
            'quotes': ['error', 'single'],
            'semi': ['error', 'always'],
            'space-before-blocks': 'error',
            'space-before-function-paren': [
                'error',
                {
                    'anonymous': 'always',
                    'named': 'never',
                    'asyncArrow': 'always',
                },
            ],
            'space-in-parens': 'error',
            'space-infix-ops': 'error',
            'space-unary-ops': 'error',
            'spaced-comment': 'error',
            'yoda': 'error',
            'require-yield': 'off',
        },
    },
];
