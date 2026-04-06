import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#1e3a5c',
          50:  '#f0f4f9',
          100: '#dce6f0',
          200: '#b3c8dd',
          400: '#4a7aaa',
          500: '#2d5f8a',
          600: '#1e3a5c',
          700: '#152b45',
          800: '#0e1e30',
          900: '#090f18',
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
