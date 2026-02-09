module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        slate: {
          900: '#040617',
          800: '#071129',
          700: '#0b1524'
        },
        glass: 'rgba(255,255,255,0.04)'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Segoe UI', 'Helvetica Neue', 'Arial']
      },
      boxShadow: {
        'soft-3d': '0 6px 18px rgba(2,6,23,0.6), 0 1px 0 rgba(255,255,255,0.02) inset'
      }
    }
  },
  plugins: []
};
