const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  // purge: [
  //   './components/*.tsx',
  //   './components/**/*.tsx',
  //   './pages/*.tsx',
  //   './pages/**/*.tsx',
  //   './styles/*.css',
  //   './styles/**/*.css',
  // ],
  theme: {
    container: {
      center: true,
    },
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      screens: {
        // => @media (prefers-color-scheme: dark) { ... }
        dark: { raw: '(prefers-color-scheme: dark)' },
      },
    },
  },
  plugins: [require('@tailwindcss/ui')],
};
