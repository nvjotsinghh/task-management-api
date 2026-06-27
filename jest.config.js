module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.test.ts'],
  moduleNameMapper: {
    '^../config/firebase$': '<rootDir>/src/__mocks__/firebase.ts',
    '^../../config/firebase$': '<rootDir>/src/__mocks__/firebase.ts',
    '^../../../config/firebase$': '<rootDir>/src/__mocks__/firebase.ts',
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/server.ts',
    '!src/config/**',
    '!src/types/**',
    '!src/__mocks__/**',
    '!src/routes/**',
  ],
  coverageThreshold: {
    global: {
      lines: 65,
    },
  },
};