module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.js'],
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js',
    '!src/config/**',
    '!src/migrations/**',
    '!src/seeders/**',
    '!src/tests/**'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  testMatch: [
    '<rootDir>/src/tests/**/*.test.js'
  ],
  testTimeout: 10000,
  verbose: true
};
