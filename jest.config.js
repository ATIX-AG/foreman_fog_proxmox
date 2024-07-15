// Find where foreman is located
const { foremanRelativePath, foremanLocation } = require('@theforeman/find-foreman');
const foremanReactRelative = 'webpack/assets/javascripts/react_app';
const foremanFull = foremanLocation();
const foremanReactFull = foremanRelativePath(foremanReactRelative);

module.exports = {
  testURL: 'http://localhost/',
  setupFiles: [
    './webpack/test_setup.js',
  ],
  setupFilesAfterEnv: [
    './webpack/global_test_setup.js',
    '@testing-library/jest-dom'
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/foreman/',
    '<rootDir>/.+fixtures.+',
    '<rootDir>/engines',
  ],
  moduleDirectories: [
    `${foremanFull}/node_modules`,
    `${foremanFull}/node_modules/@theforeman/vendor-core/node_modules`,
    'node_modules',
    'webpack/test-utils',
  ],
  modulePathIgnorePatterns: [
    '<rootDir>/foreman/',
  ],
  moduleNameMapper: {
    '^.+\\.(css|scss)$': 'identity-obj-proxy',
    '^foremanReact(.*)$': `${foremanReactFull}/$1`,
  },
};
