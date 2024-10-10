/** @type {import('jest').Config} */
const config = {
    verbose: true,
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.m?js$',
    transform: {
        '^.+\\.mjs$': 'babel-jest',
    },
};

module.exports = config;
