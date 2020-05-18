module.exports = {
  extends: '@pqt',
  env: {
    node: true,
  },
  overrides: [
    {
      files: ['pages/**/*.tsx'],
      rules: {
        'unicorn/filename-case': 'off',
      },
    },
  ],
};
