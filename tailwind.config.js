/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Colores de la identidad visual Flama
      // Coinciden exactamente con las variables CSS de globals.css
      colors: {
        'flama-bg':          '#141A11',
        'flama-bg-2':        '#1A2116',
        'flama-surface':     '#22291B',
        'flama-surface-2':   '#2C3523',
        'flama-olive':       '#5A7A38',
        'flama-moss':        '#3A5828',
        'flama-sage':        '#7A9E52',
        'flama-beige':       '#C4A882',
        'flama-cream':       '#EDE5D4',
        'flama-wood':        '#7A4E28',
        'flama-amber':       '#C4802A',
        'flama-amber-light': '#D9963C',
        'flama-text':        '#EDE5D4',
        'flama-muted':       '#A89878',
      },
      fontFamily: {
        heading: ['Cormorant Garamond', 'Georgia', 'serif'],
        body:    ['Jost', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
