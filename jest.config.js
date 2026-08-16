export default {
  clearMocks: true,
  moduleFileExtensions: ['js', 'ts'],
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  testRunner: 'jest-circus/runner',
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    // Map ESM-style ./foo.js specifiers in TS sources back to ./foo(.ts)
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  transform: {
    '^.+\\.ts$': ['ts-jest', {useESM: true}]
  },
  verbose: true
}
