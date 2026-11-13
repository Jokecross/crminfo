/** Charte Loseless v1.0 — Vermillon réservé aux boutons, au point du logo et aux chiffres clés (jamais un chiffre de gain). */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        encre: '#121212',
        papier: '#F4F2EE',
        craie: '#E6E2DA',
        pierre: '#6B6660',
        vermillon: '#D2401C',
      },
      fontFamily: {
        sans: ['"Schibsted Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
