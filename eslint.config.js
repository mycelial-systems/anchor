import { defineConfig } from 'eslint/config'
import {
    newneostandard,
    plugins,
    defaultFilePatterns
} from 'newneostandard'

const tseslint = plugins['typescript-eslint']
const tsFiles = [...defaultFilePatterns.ts]

export default defineConfig([
    // replaces .eslintignore
    {
        ignores: [
            'dist/**',
            'public/**',
            'docs/**',
            'test/*.js',
            'lib.es5.d.ts'
        ]
    },

    ...newneostandard({ ts: true }),

    // was `plugin:@typescript-eslint/recommended`
    {
        files: tsFiles,
        extends: [tseslint.configs.recommended]
    },

    {
        files: tsFiles,
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-unused-vars': ['error', {
                argsIgnorePattern: '^_',
                varsIgnorePattern: '^_',
                caughtErrorsIgnorePattern: '^_'
            }],
            '@typescript-eslint/consistent-type-imports': ['error', {
                prefer: 'type-imports'
            }]
        }
    },

    // style overrides
    {
        files: [...defaultFilePatterns.all],
        rules: {
            '@stylistic/operator-linebreak': 'off',
            '@stylistic/multiline-ternary': 'off',
            '@stylistic/no-multiple-empty-lines': ['error', {
                max: 1,
                maxEOF: 1
            }],
            '@stylistic/indent': ['error', 4, {
                SwitchCase: 1,
                ignoredNodes: ['TemplateLiteral *'],
                assignmentOperator: 'off'
            }],
            '@stylistic/comma-dangle': 'off',
            '@stylistic/no-multi-spaces': ['error', {
                ignoreEOLComments: true
            }],
            // allow `key?:string|boolean` in type annotations
            '@stylistic/key-spacing': ['error', {
                beforeColon: false,
                afterColon: true,
                ignoredNodes: ['TSInterfaceBody', 'TSTypeLiteral', 'ClassBody']
            }],
            '@stylistic/space-infix-ops': ['error', { ignoreTypes: true }]
        }
    }
])
