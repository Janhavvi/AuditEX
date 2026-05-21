/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        midnight: '#050816',
        ink: '#0A0F23',
        electric: '#3b82f6',
        violet: '#8b5cf6',
        aqua: '#22d3ee',
      },
      boxShadow: {
        glow: '0 0 50px rgba(59, 130, 246, 0.28)',
        violet: '0 0 70px rgba(139, 92, 246, 0.26)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
