/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // Times New Roman everywhere
        sans: ['"Times New Roman"', 'Times', 'serif'],
        serif: ['"Times New Roman"', 'Times', 'serif'],
        mono: ['"Times New Roman"', 'Times', 'serif'],
      },
      colors: {
        bg: { DEFAULT: '#050508', surface: '#0d0d14', surface2: '#13131e' },
        pink: { DEFAULT: '#ff2d78', dim: 'rgba(255,45,120,0.1)', border: 'rgba(255,45,120,0.3)' },
        purple: { DEFAULT: '#a020f0', dim: 'rgba(160,32,240,0.1)', border: 'rgba(160,32,240,0.25)' },
        cyan: { DEFAULT: '#00e5ff', dim: 'rgba(0,229,255,0.1)', border: 'rgba(0,229,255,0.3)' },
        muted: '#b0adcc',
      },
      boxShadow: {
        pink: '0 0 20px rgba(255,45,120,0.4)',
        purple: '0 0 20px rgba(160,32,240,0.4)',
        cyan: '0 0 20px rgba(0,229,255,0.3)',
      },
    },
  },
  plugins: [],
}
