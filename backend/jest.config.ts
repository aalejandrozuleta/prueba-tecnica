import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testEnvironment: 'node',

  /**
   * Soporte para path aliases de tsconfig
   */
  moduleNameMapper: {
    '^@auth/(.*)$': '<rootDir>/src/$1',
    '^@/(.*)$': '<rootDir>/src/$1',
  },

  /**
   * Detectar tests
   */
  testRegex: '.*\\.spec\\.ts$',

  /**
   * Transformación TS
   */
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
};

export default config;
