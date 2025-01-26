module.exports = {
  testEnvironment: 'jsdom',
  testMatch: ['**/tests/**/*.js?(x)', '**/?(*.)+(spec|test).js?(x)'],
  testPathIgnorePatterns: ['/node_modules/', '/tests/helpers/'],
  setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
};
