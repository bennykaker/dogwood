import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#2d5a27',
          50:  '#f1f7f0',
          100: '#d9edd6',
          200: '#afd5aa',
          300: '#7db876',
          400: '#4d9e43',
          500: '#3a7a32',
          600: '#2d5a27',
          700: '#1e3f1a',
          800: '#132910',
          900: '#0a180a',
        },
        coral: {
          DEFAULT: '#c1441a',
          50:  '#fef3ee',
          100: '#fde3d3',
          200: '#fbc5a5',
          400: '#e0642e',
          500: '#c1441a',
          600: '#a33516',
          700: '#882b12',
        },
      },
      fontFamily: {
        serif: ['"DM Serif Display"', 'Georgia', 'serif'],
        sans:  ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
