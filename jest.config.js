module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)'],
  testPathIgnorePatterns: ['dist'],
  moduleDirectories: ['node_modules', 'src'],
  moduleNameMapper: {
    '^@app/entity/(.*)$': '<rootDir>/libs/entity/$1',
    '^@app/common/(.*)$': '<rootDir>/libs/common/$1',
    '^@test/(.*)$': '<rootDir>/__test__/$1',
  },
};
