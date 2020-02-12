module.exports = {
  preset: 'ts-jest',
  modulePaths: ['src'],
  collectCoverage: true,
  testEnvironment: 'node',
  testMatch: ['<rootDir>/**/*.spec.ts'],
  collectCoverageFrom: ['src/**/*.ts'],

  coverageThreshold: {
    global: {
      statements: 10,
    },
  },
};
