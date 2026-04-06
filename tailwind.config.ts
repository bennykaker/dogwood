import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
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
