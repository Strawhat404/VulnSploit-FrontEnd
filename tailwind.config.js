/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          green: '#3b82f6',   // Electric blue — replaces green as primary
          cyan: '#06b6d4',    // Cyan — secondary accent
          red: '#ff0040',
          yellow: '#f59e0b',
          dark: '#0a0a0a',
          darker: '#050505',
          card: '#0d0d0f',
          border: '#1a1d26',
          muted: '#252830',
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'Consolas', 'monospace'],
        sans: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'pulse-green': 'pulseGreen 2s ease-in-out infinite',
        'scanline': 'scanline 8s linear infinite',
        'flicker': 'flicker 0.15s infinite',
        'typing': 'typing 3.5s steps(40, end)',
        'blink': 'blink 1s step-end infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'matrix-rain': 'matrixRain 20s linear infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.6s ease-out',
      },
      keyframes: {
        pulseGreen: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        flicker: {
          '0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%': { opacity: '1' },
          '20%, 24%, 55%': { opacity: '0.4' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        glow: {
          'from': { opacity: '1' },
          'to':   { opacity: '0.8' },
        },
        slideUp: {
          'from': { transform: 'translateY(30px)', opacity: '0' },
          'to': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)",
        'cyber-gradient': 'linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #000000 100%)',
      },
      backgroundSize: {
        'grid': '50px 50px',
      },
      boxShadow: {
        'card': '0 4px 20px rgba(0,0,0,0.6)',
      },
    },
  },
  plugins: [],
}
