module.exports = {
  preset: 'ts-jest',
  modulePaths: ['src'],
  collectCoverage: true,
  testEnvironment: 'node',
  collectCoverageFrom: ['src/**/*.ts'],

  coverageThreshold: {
    global: {
      statements: 10,
    },
  },
};
