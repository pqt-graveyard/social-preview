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
    colors: {
      ...defaultTheme.colors,

      transparent: 'transparent',
      white: '#ffffff',
      black: '#1b1f23',

      primary: '#0366d6',
      secondary: '#435372',
      tertiary: '#63708A',

      blue: {
        '50': '#f1f8ff',
        '100': '#dbedff',
        '200': '#c8e1ff',
        '300': '#79b8ff',
        '400': '#2188ff',
        '500': '#0366d6',
        '600': '#005cc5',
        '700': '#044289',
        '800': '#032f62',
        '900': '#05264c',
      },
    },
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
