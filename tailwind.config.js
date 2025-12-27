/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  important: true,
  theme: {
    extend: {
      colors: {
        'cairos-primary': '#333f91',
        'cairos-bg': '#FFFFFC',
        'cairos-bgSecondary': '#F5F5F5',
        'cairos-border': '#EAE5E3',
        'cairos-success': '#62bd2d',
        'cairos-warning': '#ff9e0b',
        'cairos-alert': '#e1516c',
      },
      fontFamily: {
        sans: ['Avenir', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        'h1': ['48px', { lineHeight: '1.2', fontWeight: '700' }],
        'h2': ['36px', { lineHeight: '1.3', fontWeight: '700' }],
        'h3': ['30px', { lineHeight: '1.4', fontWeight: '600' }],
        'body': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        'body-sm': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
      },
      borderRadius: {
        'card': '24px',
      },
    },
  },
  plugins: [],
}

