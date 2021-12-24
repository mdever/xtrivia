module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx", "./public/index.html"],
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    container: {
      center: true
    },
    extend: {
      gridTemplateColumns: {
        'layout': 'minmax(200px, 1fr) 6fr'
      }
    },
  },
  plugins: [],
}
