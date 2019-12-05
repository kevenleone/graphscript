module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  modulePaths: ['src'],

  coverageThreshold: {
    global: {
      statements: 10,
    },
  },
};
