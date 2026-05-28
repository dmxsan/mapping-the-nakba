export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#E3F2FD',
          100: '#BBDEFB',
          200: '#90CAF9',
          300: '#64B5F6',
          400: '#42A5F5',
          500: '#2196F3',
          600: '#1976D2',
          700: '#1565C0',
          800: '#0D47A1',
          900: '#0D47A1'
        },
        city: '#2E7D32',
        village: '#D32F2F',
        event: '#1976D2',
        header: {
          start: '#1B5E20',
          end: '#2E7D32'
        }
      }
    },
  },
  plugins: [],
}
