/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'space-blue': '#0B1426',
        'space-purple': '#1E1B4B',
        'cosmic-pink': '#EC4899',
        'nebula-cyan': '#06B6D4',
        'stellar-yellow': '#F59E0B',
        'mars-red': '#DC2626',
        'earth-green': '#10B981',
        'border': '#334155',
      },
      fontFamily: {
        'space': ['Orbitron', 'monospace'],
        'sans': ['Inter', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      backgroundImage: {
        'space-gradient': 'linear-gradient(135deg, #0B1426 0%, #1E1B4B 50%, #312E81 100%)',
        'cosmic-gradient': 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 50%, #06B6D4 100%)',
        'nebula-gradient': 'radial-gradient(circle at center, rgba(236, 72, 153, 0.1) 0%, rgba(139, 92, 246, 0.1) 50%, rgba(6, 182, 212, 0.1) 100%)',
      },
    },
  },
  plugins: [],
} 