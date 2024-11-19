import { ESLint } from 'eslint';

export default [
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 2021,
            sourceType: 'module',
        },
        parser: '@babel/eslint-parser',
        parserOptions: {
            requireConfigFile: false,
        },
        env: {
            es6: true,
            node: true,
        },
        rules: {
            // Your custom rules here
        },
    },
];
