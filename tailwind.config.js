/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js}",
    "./dist/**/*.html",
    "./*.html"
  ],
  theme: {
    extend: {
      colors: {
        // Golden Buzz Palette
        'buzz-primary': '#111111',
        'buzz-secondary': '#111111',
        'buzz-accent': '#111111',
        'buzz-neutral': '#3d4451',
        'buzz-neutral-dark': '#2d3440',
        'buzz-warm': '#fff9e6',
        'buzz-light': '#f8fafc',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'buzz-gradient': 'linear-gradient(90deg, #111111 0%, #000000 100%)',
        'buzz-hero': 'linear-gradient(135deg, #000000 0%, #111111 50%, #222222 100%)',
      },
      animation: {
        'bounce-subtle': 'bounce-subtle 2s infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(-2px)' },
          '50%': { transform: 'translateY(0)' },
        },
        'glow': {
          '0%': { boxShadow: '0 0 5px rgba(251, 191, 36, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(251, 191, 36, 0.6)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      boxShadow: {
        'buzz': '0 25px 50px -12px rgba(251, 191, 36, 0.25)',
        'buzz-lg': '0 35px 60px -12px rgba(251, 191, 36, 0.4)',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('daisyui'),
  ],
  daisyui: {
    themes: [
      {
        bumblebee: {
          "primary": "#111111",
          "secondary": "#111111",
          "accent": "#111111",
          "neutral": "#3d4451",
          "base-100": "#ffffff",
          "base-200": "#f2f2f2",
          "base-300": "#e5e6e6",
          "base-content": "#1f2937",
          "info": "#111111",
          "success": "#111111",
          "warning": "#111111",
          "error": "#111111",
        }
      }
    ],
    base: true,
    utils: true,
    logs: false,
    rtl: false,
  },
} 
